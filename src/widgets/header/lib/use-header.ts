import { useCallback } from 'react';

import { AuthDal } from '@/entities/auth';
import {
  getAppWeek,
  getAppWeekYear,
  useUser,
  useWeekCalendarChange,
} from '@/shared/lib';

export const useHeader = () => {
  const user = useUser();
  const { onWeekChange } = useWeekCalendarChange();

  const currentYear = getAppWeekYear(new Date());
  const currentWeek = getAppWeek(new Date());

  const todayLink = `/${currentYear}/${currentWeek}`;
  const onLogout = useCallback(() => {
    void AuthDal.logout();
  }, []);

  return {
    user,
    todayLink,
    onWeekChange,
    onLogout,
  };
};
