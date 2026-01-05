import { getWeek, getYear } from 'date-fns';

import { useUser, useWeekCalendarChange } from '@/shared/lib';

export const useHeader = () => {
  const user = useUser();
  const { onWeekChange } = useWeekCalendarChange();

  const currentYear = getYear(new Date());
  const currentWeek = getWeek(new Date());

  const todayLink = `/${currentYear}/${currentWeek}`;

  return {
    user,
    todayLink,
    onWeekChange,
  };
};
