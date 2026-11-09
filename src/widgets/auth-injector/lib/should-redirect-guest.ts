const HOME_PATH = '/';

/**
 * Tells whether a visitor must be sent to the home page
 *
 * @param pathname - Current location pathname
 * @param isSignedIn - Whether the visitor is signed in
 * @returns True for a guest on any address other than the home page
 */
export const shouldRedirectGuest = (
  pathname: string,
  isSignedIn: boolean,
): boolean => !isSignedIn && pathname !== HOME_PATH;
