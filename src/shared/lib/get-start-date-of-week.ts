import { setWeek, startOfWeek } from 'date-fns';

import { dateConfig } from '@/shared/config';

/**
  Returns the start date of a given week number in a specific year.
  @param week - The week number (1-53).
  @param year - The year (e.g., 2023).
  @returns The start date of the specified week.
*/
export const getStartDateOfWeek = (week: number, year: number): Date => {
  const date = setWeek(new Date(year, 0, 1), week);
  return startOfWeek(date, { weekStartsOn: dateConfig.weekStart });
};
