/**
 * Determines whether a public environment flag is enabled
 *
 * @param value - Raw environment variable value
 * @returns Whether the flag is enabled
 */
export const isEnvFlagEnabled = (value: string | undefined): boolean =>
  value === 'true';
