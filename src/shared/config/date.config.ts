/**
 * Shared date and week configuration used across the app.
 *
 * Week-related fields define the canonical week model for routing, storage keys,
 * calendar rendering and helper functions built on top of `date-fns`.
 */
interface DateConfig {
  /**
   * First day of week, where `0` is Sunday and `1` is Monday.
   */
  weekStart: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Last day of week for the selected week model.
   */
  weekEnd: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Determines which date must belong to week 1 of a week-based year.
   * `1` means the week containing January 1st, `4` matches ISO week numbering.
   */
  firstWeekContainsDate: 1 | 4;
  weekDays: string[];
  format: string;
  formatWeek: string;
  formatMonth: string;
  formatYear: string;
  formatWeekNumber: string;
  formatWeekTitle: string;
}

/**
 * Centralized date formatting and week rules for the application.
 */
export const dateConfig: DateConfig = {
  weekStart: 1,
  weekEnd: 0,
  firstWeekContainsDate: 4,
  weekDays: ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'],
  format: 'yyyy-MM-dd',
  formatWeek: 'yyyy-MM-dd',
  formatMonth: 'yyyy-MM',
  formatYear: 'yyyy',
  formatWeekNumber: 'yyyy-MM-dd',
  formatWeekTitle: 'd MMMM',
};
