/**
 * Builds the absolute canonical address of a page
 *
 * @param appUrl - Public origin of the application
 * @param pathname - Path of the current page
 * @returns Absolute URL, or null when the public origin is not configured
 */
export const getCanonicalUrl = (
  appUrl: string,
  pathname: string,
): string | null => {
  if (!appUrl) return null;

  const origin = appUrl.replace(/\/+$/, '');
  const path = pathname.replace(/\/+$/, '');

  return `${origin}${path || '/'}`;
};
