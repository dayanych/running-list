import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { getAppWeek, getAppWeekYear } from '@/shared/lib';
import { useUser } from '@/shared/lib/hooks/use-user';

interface Props {
  guestElement: ReactNode;
}

/** Opens the current week for a signed-in user and the guest page otherwise */
export const CurrentWeekRedirectPage = ({ guestElement }: Props) => {
  const user = useUser();

  if (!user) {
    return guestElement;
  }

  const currentYear = getAppWeekYear(new Date());
  const currentWeek = getAppWeek(new Date());

  return <Navigate to={`/${currentYear}/${currentWeek}`} replace />;
};
