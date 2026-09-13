# Task order backfill

Adds `order` to legacy task documents and creates the composite index used to
load a user's weekly tasks in that order. Tasks are grouped by `user_id`,
`year` and `week`, then missing values are assigned from zero in `created_at`
order. The document id breaks ties deterministically. Existing values are
preserved; missing tasks in a partially migrated group are appended after its
greatest existing order.

Run the migration with the project's supported Node.js version and installed
dependencies:

```sh
npm run migrate:task-order -- --dry-run
npm run migrate:task-order -- --apply
npm run migrate:task-order -- --verify
```

- **Dry run**, the default, reports how many tasks lack `order` and whether the
  index is `MISSING`, `CREATING`, `READY` or `NEEDS_REPAIR`. It writes nothing.
- **Apply** validates every task before changing anything, writes only the
  missing field, creates the index when necessary, waits for it to become ready
  and verifies the result.
- **Verify** exits unsuccessfully while any task lacks `order` or the index is
  not ready.

Each write requires the document's original `updateTime`, so a concurrent edit
fails instead of being overwritten. The migration is safe to rerun after a
partial failure. Authentication and project selection work as described below
for the states migration.

Roll out by running dry run, apply and verify before deploying the application.
New application clients assign every newly created task the next order in its
user/week group.

If the data backfill was applied before index creation was added to this
migration, rerun `--apply`. Existing task documents will remain unchanged and
only the missing index will be created.

# States backfill

Prepares `states` for the week query the application runs:
`user_id == uid && date_key >= monday && date_key <= sunday`.

- Adds `date_key` (`YYYY-MM-DD`) and `user_id` to legacy documents. A state
  lacking either field stays invisible until it is backfilled.
- Creates the composite index that query needs, `user_id` ascending then
  `date_key` ascending. Without it the week page fails with
  `FAILED_PRECONDITION`.

`date_key` is derived from the old `date` timestamp. All legacy marks were
created in `Asia/Almaty`, and historical timezone offsets are applied.
`user_id` is copied from the state's task.

Existing values are preserved, even where they differ from what the migration
would derive. The migration never replaces `date`, `status`, `task_id`, or any
other field.

A state whose task no longer exists has no owner to copy. It is reported as
`orphaned` and left unchanged; the application could not display it anyway.

## Authentication and target

Use the project's supported Node.js version and installed dependencies. The
script uses the saved Firebase CLI account for this project directory, falling
back to the CLI's global default account. No Google Cloud CLI or manually
exported access token is required. Sign in once if necessary:

```sh
npx firebase login
```

The account needs Firestore read access for dry run and verification, write
access for apply, and permission to create indexes for the first apply. The
project owner has all three. Select another saved account with `--account EMAIL`.
Tokens stay inside the process and the Firebase CLI credential store; do not add
credentials to `VITE_*` variables. The adapter uses Firebase Tools' internal auth
module (tested with 15.29), isolated in `firebase-cli-auth.mjs`; recheck it with
a dry run when upgrading Firebase Tools.

The script runs locally against the project specified by `VITE_PROJECT_ID` in
the repository's `.env` (`running-list-c1ded`). There are no environment aliases
or service-account settings. Check the project id printed at startup. The
database is `(default)` and requests go to Firestore.

The one index the week query needs is created by this script. Other rules and
indexes are edited in the Firebase console; the repository holds no
`firestore.rules`, index definitions, or deploy script.

## Run

```sh
npm run migrate:states -- --dry-run
npm run migrate:states -- --apply
npm run migrate:states -- --verify
```

- **Dry run**, the default, writes nothing. It reports the counts and the index
  state: `MISSING`, `CREATING`, `READY` or `NEEDS_REPAIR`.
- **Apply** validates every state before changing anything. It then creates the
  index if it is missing, backfills the missing fields, and waits for the index
  to become `READY`, printing progress. The index builds while the backfill
  runs. If it is not ready within 15 minutes, apply stops with the data already
  backfilled; run `--verify` a few minutes later.
- **Verify** exits unsuccessfully until the index is `READY` and no state lacks
  a field. Orphans do not count. A passing verify means the application can be
  deployed.

Tasks are read once, masked to `user_id`, to map each task to its owner. States
are read in pages of 200 and updated sequentially. Each write sets only the
missing fields and requires the document's original `updateTime`, so a
concurrent edit fails instead of being overwritten.

A failure may leave earlier pages migrated. Rerun after resolving the error;
already migrated documents are skipped and an existing index is not recreated.
Firebase CLI refreshes access tokens as needed. If the saved login is revoked,
run `npx firebase login --reauth`.

If Firestore reports the index as `NEEDS_REPAIR`, apply refuses to run. Delete
the index in the Firebase console under Firestore > Indexes, then rerun apply.

A dry run reads every task once and every state once; apply reads the states
twice more. Each changed document incurs one write. Only the task-to-owner map
is held in memory.

## Rollout

1. Run a dry run and review the counts.
2. Apply, then verify.
3. Deploy the application.
4. Apply and verify again, to backfill states that tabs still running the old
   version created between steps 2 and 3. If nothing was written in between,
   it reports `missing: 0`.

Deploying before step 2 passes shows weeks without marks, or fails outright
while the index is missing. Worse, marking a cell whose old state is still
invisible creates a second state for the same day.

Afterwards every query the application makes against `states` filters by
`user_id`. A console rule limiting states to
`resource.data.user_id == request.auth.uid` can then be enabled without
breaking the week view or task deletion.

The application still writes `date`, because tabs running the old version read
it. Stop writing it once no such tab can remain.
