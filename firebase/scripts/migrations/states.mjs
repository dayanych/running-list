const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Almaty',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Fields read from each state; nothing else is fetched or written */
const STATE_FIELDS = ['date', 'date_key', 'task_id', 'user_id'];

/** Composite index the week query filters on: user_id, then date_key */
const INDEX_FIELDS = [
  { fieldPath: 'user_id', order: 'ASCENDING' },
  { fieldPath: 'date_key', order: 'ASCENDING' },
];

/** Pause between index status checks */
const INDEX_POLL_MS = 10_000;

/** Status checks before giving up: 15 minutes at INDEX_POLL_MS */
const INDEX_POLLS = 90;

const REPAIR_MESSAGE =
  'Firestore reports the states index as NEEDS_REPAIR. Delete it in the Firebase console under Firestore > Indexes, then rerun --apply to recreate it';

/** Resolves after the given delay */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Validates a stored Gregorian calendar key */
const validKey = (key) => {
  if (typeof key !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const parsed = new Date(`${key}T00:00:00Z`);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === key
  );
};

/** Derives a legacy state's calendar key from its Almaty timestamp */
const legacyKey = (document) => {
  const timestamp = document.fields?.date?.timestampValue;
  const date = new Date(timestamp ?? NaN);
  if (typeof timestamp !== 'string' || !Number.isFinite(date.getTime())) {
    throw new Error(`Invalid legacy timestamp: ${document.name}`);
  }
  const parts = formatter.formatToParts(date);
  const key = ['year', 'month', 'day']
    .map((type) => parts.find((part) => part.type === type).value)
    .join('-');
  if (!validKey(key)) {
    throw new Error(`Invalid legacy document: ${document.name}`);
  }
  return key;
};

/**
 * Works out which fields a state still lacks
 *
 * @param document - State document from the Firestore REST API
 * @param owners - Owner id of every existing task, keyed by task id
 * @returns Missing fields with their values, empty once migrated, or null for
 * an orphan whose task no longer exists
 */
const pendingFields = (document, owners) => {
  const fields = document.fields ?? {};
  const pending = {};

  // Checked first: an orphan is skipped whole, so its other fields never block
  // the run
  if (Object.hasOwn(fields, 'user_id')) {
    if (!fields.user_id.stringValue) {
      throw new Error(`Invalid user_id: ${document.name}`);
    }
  } else {
    const owner = owners.get(fields.task_id?.stringValue);
    if (!owner) return null;
    pending.user_id = owner;
  }

  if (Object.hasOwn(fields, 'date_key')) {
    if (!validKey(fields.date_key.stringValue)) {
      throw new Error(`Invalid date_key: ${document.name}`);
    }
  } else {
    pending.date_key = legacyKey(document);
  }

  if (Object.keys(pending).length > 0 && !document.updateTime) {
    throw new Error(`Missing updateTime: ${document.name}`);
  }
  return pending;
};

/** Reads bounded pages containing only the requested fields */
async function* documents(request, collection, fields) {
  let pageToken;
  do {
    const params = new URLSearchParams({ pageSize: '200' });
    for (const field of fields) params.append('mask.fieldPaths', field);
    if (pageToken) params.set('pageToken', pageToken);
    const page = await request(`${collection}?${params}`);
    yield* page.documents ?? [];
    pageToken = page.nextPageToken;
  } while (pageToken);
}

/** Maps every task id to the id of the user who owns the task */
const loadOwners = async (request, collection) => {
  const owners = new Map();
  for await (const document of documents(request, collection, ['user_id'])) {
    const owner = document.fields?.user_id?.stringValue;
    if (!owner) throw new Error(`Task without user_id: ${document.name}`);
    owners.set(document.name.split('/').pop(), owner);
  }
  return owners;
};

/** Validates every state and counts those still requiring migration */
const scan = async (request, collection, owners) => {
  const counts = { total: 0, missing: 0, orphaned: 0 };
  for await (const document of documents(request, collection, STATE_FIELDS)) {
    counts.total += 1;
    const pending = pendingFields(document, owners);
    if (pending === null) counts.orphaned += 1;
    else if (Object.keys(pending).length > 0) counts.missing += 1;
  }
  return counts;
};

/** Reads every composite index defined on the states collection group */
const listIndexes = async (request, indexesPath) => {
  const indexes = [];
  let pageToken;
  do {
    const query = pageToken ? `?pageToken=${encodeURIComponent(pageToken)}` : '';
    const page = await request(`${indexesPath}${query}`);
    indexes.push(...(page.indexes ?? []));
    pageToken = page.nextPageToken;
  } while (pageToken);
  return indexes;
};

/**
 * Finds the state of the index the week query needs
 *
 * Firestore appends an implicit `__name__` field to composite indexes, so it is
 * left out when comparing field lists
 *
 * @param indexes - Composite indexes of the states collection group
 * @returns Index state such as CREATING or READY, or MISSING when undefined
 */
const weekIndexState = (indexes) => {
  const wanted = JSON.stringify(INDEX_FIELDS);
  const index = indexes.find(
    (candidate) =>
      candidate.queryScope === 'COLLECTION' &&
      JSON.stringify(
        (candidate.fields ?? [])
          .filter((field) => field.fieldPath !== '__name__')
          .map(({ fieldPath, order }) => ({ fieldPath, order })),
      ) === wanted,
  );
  return index?.state ?? 'MISSING';
};

/** Polls until the week-query index is READY, logging while it builds */
const waitForIndex = async (request, indexesPath, wait, log) => {
  for (let attempt = 0; attempt < INDEX_POLLS; attempt += 1) {
    const state = weekIndexState(await listIndexes(request, indexesPath));
    if (state === 'READY') return state;
    if (state === 'NEEDS_REPAIR') throw new Error(REPAIR_MESSAGE);
    if (attempt === 0) {
      log('Waiting for the states index to build; this can take several minutes');
    } else if (attempt % 6 === 0) {
      log(`Still building after ${attempt / 6} min`);
    }
    await wait(INDEX_POLL_MS);
  }
  throw new Error(
    'The states index is still building after 15 minutes; rerun --verify in a few minutes',
  );
};

/**
 * Backfills date_key and user_id and creates the index the week query needs,
 * without replacing other fields or overwriting concurrent edits
 *
 * @param options - REST transport, explicit project id, optional write mode, and
 * optional wait and log hooks
 * @returns Counts and the index state from the dry run or the final verification
 */
export const migrateStates = async ({
  request,
  projectId,
  apply = false,
  wait = sleep,
  log = () => {},
}) => {
  if (!/^[a-z][a-z0-9-]{4,61}[a-z0-9]$/.test(projectId ?? '')) {
    throw new Error('Invalid project id');
  }
  const database = `projects/${projectId}/databases/(default)`;
  const collection = `${database}/documents/states`;
  const indexesPath = `${database}/collectionGroups/states/indexes`;
  const owners = await loadOwners(request, `${database}/documents/tasks`);

  const before = await scan(request, collection, owners);
  const initialIndex = weekIndexState(await listIndexes(request, indexesPath));
  if (!apply) return { ...before, updated: 0, index: initialIndex };

  // The scan above has validated every state, so a run that would fail on bad
  // data never creates the index or writes anything
  if (initialIndex === 'NEEDS_REPAIR') throw new Error(REPAIR_MESSAGE);
  if (initialIndex === 'MISSING') {
    log('Creating the states index on user_id and date_key');
    await request(indexesPath, {
      method: 'POST',
      body: JSON.stringify({ queryScope: 'COLLECTION', fields: INDEX_FIELDS }),
    });
  }

  let updated = 0;
  if (before.missing > 0) {
    for await (const document of documents(request, collection, STATE_FIELDS)) {
      const pending = pendingFields(document, owners);
      if (pending === null || Object.keys(pending).length === 0) continue;
      if (!document.name.startsWith(`${collection}/`)) {
        throw new Error('Unexpected document path');
      }
      const params = new URLSearchParams();
      const fields = {};
      for (const [field, value] of Object.entries(pending)) {
        params.append('updateMask.fieldPaths', field);
        fields[field] = { stringValue: value };
      }
      params.set('currentDocument.updateTime', document.updateTime);
      await request(`${document.name}?${params}`, {
        method: 'PATCH',
        body: JSON.stringify({ fields }),
      });
      updated += 1;
    }
  }

  // Firestore builds the index in the background, so it has been building
  // while the backfill ran
  const index = await waitForIndex(request, indexesPath, wait, log);
  const after = await scan(request, collection, owners);
  if (after.missing !== 0) {
    throw new Error(
      `Verification failed: ${after.missing} states still lack date_key or user_id; reload old clients and rerun`,
    );
  }
  return { ...after, updated, index };
};
