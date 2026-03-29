import { Navigate } from 'react-router-dom';

import { getAppWeek, getAppWeekYear } from '@/shared/lib';
import { useUser } from '@/shared/lib/hooks/use-user';

export const CurrentWeekRedirectPage = () => {
  const user = useUser();

  if (!user) {
    return null;
  }

  const currentYear = getAppWeekYear(new Date());
  const currentWeek = getAppWeek(new Date());

  return <Navigate to={`/${currentYear}/${currentWeek}`} replace />;
};
