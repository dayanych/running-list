import {
  differenceInCalendarDays,
  endOfWeek,
  getWeek,
  getWeekYear,
  setWeek,
  startOfWeek,
  startOfWeekYear,
} from 'date-fns';

import { dateConfig } from '@/shared/config';

const weekOptions = {
  weekStartsOn: dateConfig.weekStart,
  firstWeekContainsDate: dateConfig.firstWeekContainsDate,
} as const;

export const getAppWeek = (date: Date): number => getWeek(date, weekOptions);

export const getAppWeekYear = (date: Date): number =>
  getWeekYear(date, weekOptions);

export const getStartOfAppWeek = (date: Date): Date =>
  startOfWeek(date, { weekStartsOn: dateConfig.weekStart });

export const getEndOfAppWeek = (date: Date): Date =>
  endOfWeek(date, { weekStartsOn: dateConfig.weekStart });

export const getAppWeeksInYear = (year: number): number => {
  const currentWeekYearStart = startOfWeekYear(
    new Date(year, 0, dateConfig.firstWeekContainsDate),
    weekOptions,
  );
  const nextWeekYearStart = startOfWeekYear(
    new Date(year + 1, 0, dateConfig.firstWeekContainsDate),
    weekOptions,
  );

  return differenceInCalendarDays(nextWeekYearStart, currentWeekYearStart) / 7;
};

export const getStartDateOfAppWeek = (week: number, year: number): Date => {
  const date = setWeek(
    new Date(year, 0, dateConfig.firstWeekContainsDate),
    week,
    weekOptions,
  );

  return getStartOfAppWeek(date);
};
