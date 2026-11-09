import assert from 'node:assert/strict';
import test from 'node:test';

import { runAccountDeletion } from './delete-account.ts';

test('deletes the account before clearing the local session', async () => {
  const events: string[] = [];

  await runAccountDeletion({
    deleteAccount: async () => {
      events.push('delete-account');
    },
    clearLocalSession: async () => {
      events.push('clear-local-session');
    },
  });

  assert.deepEqual(events, ['delete-account', 'clear-local-session']);
});

test('completes deletion when local session cleanup fails', async () => {
  await assert.doesNotReject(() =>
    runAccountDeletion({
      deleteAccount: async () => undefined,
      clearLocalSession: async () => {
        throw new Error('Local session cleanup failed');
      },
    }),
  );
});
