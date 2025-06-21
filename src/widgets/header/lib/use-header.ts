import { getCurrentYear, getWeekNumber, useUser } from '@/shared/lib';

export const useHeader = () => {
  const user = useUser();
  const currentYear = getCurrentYear();
  const currentWeek = getWeekNumber(new Date());

  const todayLink = `/app/${currentYear}/${currentWeek}`;

  return {
    user,
    todayLink,
  };
};
