import { getWeek, getYear } from 'date-fns';
import { Navigate } from 'react-router-dom';

import { useUser } from '@/shared/lib/hooks/use-user';

export const CurrentWeekRedirectPage = () => {
  const user = useUser();

  if (!user) {
    return null;
  }

  const currentYear = getYear(new Date());
  const currentWeek = getWeek(new Date());

  return <Navigate to={`/${currentYear}/${currentWeek}`} replace />;
};
