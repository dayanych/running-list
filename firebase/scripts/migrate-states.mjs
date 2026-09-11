/* eslint-disable no-console */
import process from 'node:process';
import { parseArgs } from 'node:util';

import { repoRoot, resolveProjectId } from './lib/firebase-env.mjs';
import { createFirebaseCliTokenProvider } from './migrations/firebase-cli-auth.mjs';
import { migrateStates } from './migrations/states.mjs';

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
      'Usage: node firebase/scripts/migrate-states.mjs [--dry-run | --apply | --verify]',
    );
    console.log(
      'Backfills date_key and user_id on states and creates the index the week query needs. Default: dry run. Uses VITE_PROJECT_ID from .env and the saved Firebase CLI login. Optional: --account EMAIL.',
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
  const result = await migrateStates({
    request,
    projectId,
    apply: values.apply,
    log: (message) => console.log(message),
  });
  console.log(JSON.stringify(result, null, 2));
  if (result.orphaned > 0) {
    console.log(
      `${result.orphaned} orphaned states belong to deleted tasks and were left unchanged.`,
    );
  }
  const problems = [];
  if (result.index !== 'READY') {
    problems.push(`the states index is ${result.index}`);
  }
  if (result.missing > 0) {
    problems.push(`${result.missing} states lack date_key or user_id`);
  }
  if (values.verify && problems.length > 0) {
    throw new Error(`Verification failed: ${problems.join('; ')}`);
  }
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
