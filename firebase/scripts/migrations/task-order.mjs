/** Fields required to group and order task documents */
const TASK_FIELDS = ['user_id', 'year', 'week', 'created_at', 'order'];

/** Composite index used by the ordered week query */
const INDEX_FIELDS = [
  { fieldPath: 'user_id', order: 'ASCENDING' },
  { fieldPath: 'year', order: 'ASCENDING' },
  { fieldPath: 'week', order: 'ASCENDING' },
  { fieldPath: 'order', order: 'ASCENDING' },
];

/** Pause between index status checks */
const INDEX_POLL_MS = 10_000;

/** Status checks before giving up: 15 minutes at INDEX_POLL_MS */
const INDEX_POLLS = 90;

const REPAIR_MESSAGE =
  'Firestore reports the tasks order index as NEEDS_REPAIR. Delete it in the Firebase console under Firestore > Indexes, then rerun --apply to recreate it';

/** Resolves after the given delay */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Reads a required Firestore integer field */
const requiredInteger = (document, field) => {
  const value = Number(document.fields?.[field]?.integerValue);
  if (!Number.isSafeInteger(value)) {
    throw new Error(`Invalid ${field}: ${document.name}`);
  }
  return value;
};

/** Reads and validates the fields used to migrate one task */
const taskDetails = (document) => {
  const fields = document.fields ?? {};
  const userId = fields.user_id?.stringValue;
  if (!userId) throw new Error(`Invalid user_id: ${document.name}`);

  const createdAt = new Date(fields.created_at?.timestampValue ?? NaN);
  if (!Number.isFinite(createdAt.getTime())) {
    throw new Error(`Invalid created_at: ${document.name}`);
  }

  let order;
  if (Object.hasOwn(fields, 'order')) {
    order = requiredInteger(document, 'order');
    if (order < 0) throw new Error(`Invalid order: ${document.name}`);
  } else if (!document.updateTime) {
    throw new Error(`Missing updateTime: ${document.name}`);
  }

  return {
    document,
    userId,
    year: requiredInteger(document, 'year'),
    week: requiredInteger(document, 'week'),
    createdAt: createdAt.getTime(),
    order,
  };
};

/** Reads bounded pages containing only the task-order fields */
async function* documents(request, collection) {
  let pageToken;
  do {
    const params = new URLSearchParams({ pageSize: '200' });
    for (const field of TASK_FIELDS) params.append('mask.fieldPaths', field);
    if (pageToken) params.set('pageToken', pageToken);
    const page = await request(`${collection}?${params}`);
    yield* page.documents ?? [];
    pageToken = page.nextPageToken;
  } while (pageToken);
}

/** Builds deterministic order updates without replacing existing values */
const planUpdates = (taskDocuments) => {
  const groups = new Map();

  for (const document of taskDocuments) {
    const task = taskDetails(document);
    const key = JSON.stringify([task.userId, task.year, task.week]);
    const group = groups.get(key);
    if (group) group.push(task);
    else groups.set(key, [task]);
  }

  const updates = [];
  for (const group of groups.values()) {
    const existingOrders = group
      .map(({ order }) => order)
      .filter((order) => order !== undefined);
    let nextOrder =
      existingOrders.length === 0 ? 0 : Math.max(...existingOrders) + 1;

    const missing = group
      .filter(({ order }) => order === undefined)
      .sort(
        (left, right) =>
          left.createdAt - right.createdAt ||
          left.document.name.localeCompare(right.document.name),
      );

    for (const task of missing) {
      updates.push({ document: task.document, order: nextOrder });
      nextOrder += 1;
    }
  }

  return updates;
};

/** Reads every composite index defined on the tasks collection group */
const listIndexes = async (request, indexesPath) => {
  const indexes = [];
  let pageToken;
  do {
    const query = pageToken
      ? `?pageToken=${encodeURIComponent(pageToken)}`
      : '';
    const page = await request(`${indexesPath}${query}`);
    indexes.push(...(page.indexes ?? []));
    pageToken = page.nextPageToken;
  } while (pageToken);
  return indexes;
};

/** Finds the state of the index used by the ordered week query */
const taskOrderIndexState = (indexes) => {
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

/** Polls until the task-order index is ready */
const waitForIndex = async (request, indexesPath, wait, log) => {
  for (let attempt = 0; attempt < INDEX_POLLS; attempt += 1) {
    const state = taskOrderIndexState(await listIndexes(request, indexesPath));
    if (state === 'READY') return state;
    if (state === 'NEEDS_REPAIR') throw new Error(REPAIR_MESSAGE);
    if (attempt === 0) {
      log(
        'Waiting for the tasks order index to build; this can take several minutes',
      );
    } else if (attempt % 6 === 0) {
      log(`Still building after ${attempt / 6} min`);
    }
    await wait(INDEX_POLL_MS);
  }
  throw new Error(
    'The tasks order index is still building after 15 minutes; rerun --verify in a few minutes',
  );
};

/**
 * Backfills a stable, zero-based order for legacy tasks within each user week
 *
 * Existing order values are preserved so the migration is safe to rerun after
 * a partial apply or after users start reordering tasks
 *
 * @param options - REST transport, explicit project id, optional write mode,
 * wait implementation and log hook
 * @returns Counts and index state from the dry run or final verification
 */
export const migrateTaskOrder = async ({
  request,
  projectId,
  apply = false,
  wait = sleep,
  log = () => {},
}) => {
  if (!/^[a-z][a-z0-9-]{4,61}[a-z0-9]$/.test(projectId ?? '')) {
    throw new Error('Invalid project id');
  }

  const collection = `projects/${projectId}/databases/(default)/documents/tasks`;
  const indexesPath = `projects/${projectId}/databases/(default)/collectionGroups/tasks/indexes`;
  const taskDocuments = [];
  for await (const document of documents(request, collection)) {
    taskDocuments.push(document);
  }

  const updates = planUpdates(taskDocuments);
  const initialIndex = taskOrderIndexState(
    await listIndexes(request, indexesPath),
  );
  if (!apply) {
    return {
      total: taskDocuments.length,
      missing: updates.length,
      updated: 0,
      index: initialIndex,
    };
  }

  if (initialIndex === 'NEEDS_REPAIR') throw new Error(REPAIR_MESSAGE);
  if (initialIndex === 'MISSING') {
    log('Creating the tasks index on user_id, year, week and order');
    await request(indexesPath, {
      method: 'POST',
      body: JSON.stringify({ queryScope: 'COLLECTION', fields: INDEX_FIELDS }),
    });
  }

  for (const { document, order } of updates) {
    if (!document.name.startsWith(`${collection}/`)) {
      throw new Error('Unexpected document path');
    }
    const params = new URLSearchParams({
      'updateMask.fieldPaths': 'order',
      'currentDocument.updateTime': document.updateTime,
    });
    await request(`${document.name}?${params}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: { order: { integerValue: String(order) } },
      }),
    });
  }

  const remainingDocuments = [];
  for await (const document of documents(request, collection)) {
    remainingDocuments.push(document);
  }
  const missing = planUpdates(remainingDocuments).length;
  if (missing > 0) {
    throw new Error(
      `Verification failed: ${missing} tasks still lack order; rerun the migration`,
    );
  }

  const index = await waitForIndex(request, indexesPath, wait, log);

  return {
    total: remainingDocuments.length,
    missing,
    updated: updates.length,
    index,
  };
};
