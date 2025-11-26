import { Navigate } from 'react-router-dom';

import { getCurrentYear } from '@/shared/lib/get-current-year';
import { getWeekNumber } from '@/shared/lib/get-week-number';
import { useUser } from '@/shared/lib/hooks/use-user';

export const CurrentWeekRedirectPage = () => {
  const user = useUser();

  if (!user) {
    return null;
  }

  const currentYear = getCurrentYear();
  const currentWeek = getWeekNumber(new Date());

  return <Navigate to={`/${currentYear}/${currentWeek}`} replace />;
};
