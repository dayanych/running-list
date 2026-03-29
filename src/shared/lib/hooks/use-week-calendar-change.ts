import { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';

import { getAppWeek, getAppWeekYear } from '../week';

export const useWeekCalendarChange = () => {
  const navigate = useNavigate();

  const onWeekChange = (date: DateRange) => {
    if (!date.from || !date.to) return;

    const updatedWeek = getAppWeek(date.from);
    const updatedYear = getAppWeekYear(date.to);

    navigate(`/${updatedYear}/${updatedWeek}`);
  };

  return { onWeekChange };
};
