import { useParams } from 'react-router-dom';

import { getAppWeeksInYear } from '@/shared/lib';

const digitsOnlyRegExp = /^\d+$/;

export const useYearPage = () => {
  const { year, week } = useParams();

  const isYearValid = Boolean(year && digitsOnlyRegExp.test(year));
  const numericYear = isYearValid ? Number(year) : null;
  const lastWeekOfYear =
    numericYear !== null ? getAppWeeksInYear(numericYear) : null;

  const isWeekMissing = !week;
  const numericWeek = week && digitsOnlyRegExp.test(week) ? Number(week) : null;
  const isWeekOutOfRange =
    numericWeek !== null &&
    (numericWeek < 1 ||
      (lastWeekOfYear !== null && numericWeek > lastWeekOfYear));

  const shouldRedirectToLastWeek =
    !isWeekMissing &&
    (numericWeek === null || isWeekOutOfRange) &&
    lastWeekOfYear !== null;

  return {
    isNotFound: !isYearValid,
    isWeekMissing,
    shouldRedirectToLastWeek,
    lastWeekOfYear,
  };
};
