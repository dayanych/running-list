import process from 'node:process';

/**
 * Creates an access-token provider backed by the saved Firebase CLI login
 *
 * Firebase Tools has no public token-provider API. Keep its internal adapter
 * isolated here and recheck it when upgrading firebase-tools (tested with 15.29)
 *
 * @param options - Project directory, optional account and CLI module loader
 * @returns Provider that delegates token caching and refresh to Firebase CLI
 */
export const createFirebaseCliTokenProvider = async ({
  projectRoot = process.cwd(),
  accountEmail,
  loadAuth = () => import('firebase-tools/lib/auth.js'),
} = {}) => {
  let auth;
  try {
    auth = await loadAuth();
  } catch {
    throw new Error(
      'Cannot load Firebase CLI authentication. Install the project dependencies and check firebase-tools compatibility.',
    );
  }
  let account;
  try {
    account = auth.selectAccount(accountEmail, projectRoot);
  } catch {
    throw new Error(
      'Firebase CLI account is unavailable. Run npx firebase login:list or npx firebase login:add.',
    );
  }
  const refreshToken = account?.tokens?.refresh_token;
  if (!refreshToken) {
    throw new Error(
      'No saved Firebase CLI login. Run npx firebase login, then rerun the migration.',
    );
  }
  const scopes = account.tokens.scopes?.length
    ? [...account.tokens.scopes]
    : ['https://www.googleapis.com/auth/cloud-platform'];

  return async () => {
    try {
      const tokens = await auth.getAccessToken(refreshToken, scopes);
      if (!tokens.access_token || tokens.access_token === refreshToken) {
        throw new Error('Invalid access token');
      }
      return tokens.access_token;
    } catch {
      throw new Error(
        'Cannot refresh Firebase CLI authorization. Check your connection; if login expired, run npx firebase login --reauth.',
      );
    }
  };
};
