import { getWeek, getYear } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';

export const useWeekCalendarChange = () => {
  const navigate = useNavigate();

  const onWeekChange = (date: DateRange) => {
    if (!date.from || !date.to) return;

    const updatedWeek = getWeek(date.from);
    const updatedYear = getYear(date.from);

    navigate(`/${updatedYear}/${updatedWeek}`);
  };

  return { onWeekChange };
};
