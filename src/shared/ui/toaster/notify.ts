import { toast } from '../shadcn/use-toast';

const SUCCESS_DURATION = 3500;
const ERROR_DURATION = 10000;

/**
 * Application wide notifications
 *
 * Imported from this module rather than the `@/shared/ui` barrel so that
 * `shared/lib` can report errors without closing an import cycle
 */
export const notify = {
  /**
   * Confirms an action whose result the user cannot see on screen
   *
   * @param message - Sentence describing what happened
   */
  success: (message: string) =>
    toast({
      variant: 'success',
      description: message,
      duration: SUCCESS_DURATION,
    }),

  /**
   * Reports a failure
   *
   * @param message - Sentence describing what went wrong
   */
  error: (message: string) =>
    toast({
      variant: 'error',
      description: message,
      duration: ERROR_DURATION,
    }),
};
