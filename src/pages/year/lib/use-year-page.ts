import { getISOWeeksInYear } from 'date-fns';
import { useParams } from 'react-router-dom';

const digitsOnlyRegExp = /^\d+$/;

export const useYearPage = () => {
  const { year, week } = useParams();

  const isYearValid = Boolean(year && digitsOnlyRegExp.test(year));
  const numericYear = isYearValid ? Number(year) : null;
  const lastWeekOfYear =
    numericYear !== null
      ? getISOWeeksInYear(new Date(numericYear, 0, 1))
      : null;

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
