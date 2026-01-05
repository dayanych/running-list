import { getWeek, getYear } from 'date-fns';
import { useCallback } from 'react';

import { AuthDal } from '@/entities/auth';
import { useUser, useWeekCalendarChange } from '@/shared/lib';

export const useHeader = () => {
  const user = useUser();
  const { onWeekChange } = useWeekCalendarChange();

  const currentYear = getYear(new Date());
  const currentWeek = getWeek(new Date());

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
