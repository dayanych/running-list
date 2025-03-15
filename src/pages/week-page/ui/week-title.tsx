import { format } from 'date-fns';

import { dateConfig } from '@/shared/config/date.config';
import { WeekPicker } from '@/shared/ui/week-picker';

interface Props {
  startWeekDate: Date;
  endWeekDate: Date;
}

export const WeekTitle = ({ startWeekDate, endWeekDate }: Props) => {
  return (
    <WeekPicker
      initialDate={startWeekDate}
      title={`${format(startWeekDate, dateConfig.formatWeek)} - ${format(endWeekDate, dateConfig.formatWeek)}`}
    />
  );
};
