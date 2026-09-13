/* eslint-disable no-console */
import process from 'node:process';
import { parseArgs } from 'node:util';

import { repoRoot, resolveProjectId } from './lib/firebase-env.mjs';
import { createFirebaseCliTokenProvider } from './migrations/firebase-cli-auth.mjs';
import { migrateTaskOrder } from './migrations/task-order.mjs';

/** Runs an explicit dry run, migration or verification against the configured project */
const main = async () => {
  const { values } = parseArgs({
    options: {
      account: { type: 'string' },
      apply: { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', default: false },
      verify: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
    },
  });
  if (values.help) {
    console.log(
      'Usage: node firebase/scripts/migrate-task-order.mjs [--dry-run | --apply | --verify]',
    );
    console.log(
      'Backfills order on tasks and creates the ordered week-query index. Default: dry run. Uses VITE_PROJECT_ID from .env and the saved Firebase CLI login. Optional: --account EMAIL.',
    );
    return;
  }
  if (
    [values.apply, values['dry-run'], values.verify].filter(Boolean).length > 1
  ) {
    throw new Error('Choose only one mode');
  }

  const projectId = resolveProjectId();
  const getToken = await createFirebaseCliTokenProvider({
    projectRoot: repoRoot,
    accountEmail: values.account,
  });
  console.log(
    `Project: ${projectId}; database: (default); mode: ${values.apply ? 'apply' : values.verify ? 'verify' : 'dry-run'}`,
  );

  /** Sends a request without exposing credentials or response contents in errors */
  const request = async (route, options = {}) => {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/${route}`,
      {
        ...options,
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(30000),
      },
    );
    if (!response.ok) {
      throw new Error(
        `Firestore HTTP ${response.status}. Check IAM access/token; on a write conflict or partial failure, rerun the migration.`,
      );
    }
    return response.json();
  };

  const result = await migrateTaskOrder({
    request,
    projectId,
    apply: values.apply,
    log: (message) => console.log(message),
  });
  console.log(JSON.stringify(result, null, 2));
  const problems = [];
  if (result.index !== 'READY') {
    problems.push(`the tasks order index is ${result.index}`);
  }
  if (result.missing > 0) {
    problems.push(`${result.missing} tasks still lack order`);
  }
  if (values.verify && problems.length > 0) {
    throw new Error(`Verification failed: ${problems.join('; ')}`);
  }
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
