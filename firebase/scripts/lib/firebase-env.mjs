import path from 'node:path';

import { loadEnv } from 'vite';

// This module lives at firebase/scripts/lib/, so the repository root is three
// levels up. Anchoring here rather than on process.cwd() lets the migration run
// from any directory
/** Repository directory used for local environment files and CLI account selection */
export const repoRoot = path.resolve(import.meta.dirname, '../../..');

/** Reads the Firebase project id from the local application's configuration */
export const resolveProjectId = () => {
  const projectId = loadEnv('', repoRoot, 'VITE_').VITE_PROJECT_ID?.trim();
  if (!projectId) {
    throw new Error(
      'Set VITE_PROJECT_ID in .env before running Firebase scripts.',
    );
  }
  return projectId;
};
