interface AccountDeletionDependencies {
  deleteAccount: () => Promise<void>;
  clearLocalSession: () => Promise<void>;
}

/** Deletes the current account and then removes its local browser session */
export const runAccountDeletion = async (
  dependencies: AccountDeletionDependencies,
): Promise<void> => {
  await dependencies.deleteAccount();

  try {
    await dependencies.clearLocalSession();
  } catch {
    // The server deletion is already final; the UI clears its own user state
    return;
  }
};
