import { isEnvFlagEnabled } from './is-env-flag-enabled';

export const appConfig = {
  supportEmail: import.meta.env.VITE_APP_EMAIL ?? '',
  appUrl: import.meta.env.VITE_APP_URL ?? '',
  isDisabled: isEnvFlagEnabled(import.meta.env.VITE_APP_DISABLED),
};
