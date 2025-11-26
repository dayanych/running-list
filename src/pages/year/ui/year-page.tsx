import { Navigate, Outlet } from 'react-router-dom';

import { NotFoundPage } from '@/pages/not-found';

import { useYearPage } from '../lib/use-year-page';

export const YearPage = () => {
  const {
    isNotFound,
    isWeekMissing,
    shouldRedirectToLastWeek,
    lastWeekOfYear,
  } = useYearPage();

  if (isNotFound) {
    return <NotFoundPage />;
  }

  if (isWeekMissing) {
    return <Navigate to="1" replace />;
  }

  if (shouldRedirectToLastWeek && lastWeekOfYear) {
    return <Navigate to={lastWeekOfYear.toString()} replace />;
  }

  return <Outlet />;
};
