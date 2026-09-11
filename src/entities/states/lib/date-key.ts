import { format } from 'date-fns';

/**
 * Formats the calendar day stored as a state's `date_key`
 *
 * The key names a day rather than an instant, so it reads the same in every
 * timezone. Week queries compare these strings, so every writer must use it
 *
 * @param date - Local date whose calendar day is taken
 * @returns Day in `yyyy-MM-dd` form
 */
export const toDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');
