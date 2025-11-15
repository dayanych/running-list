import {
  getCurrentYear,
  getWeekNumber,
  useUser,
  useWeekCalendarChange,
} from '@/shared/lib';

export const useHeader = () => {
  const user = useUser();
  const { onWeekChange } = useWeekCalendarChange();
  const currentYear = getCurrentYear();
  const currentWeek = getWeekNumber(new Date());

  const todayLink = `/${currentYear}/${currentWeek}`;

  return {
    user,
    todayLink,
    onWeekChange,
  };
};
