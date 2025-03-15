import { format } from 'date-fns';

import { WeekPicker } from '@/shared/ui/week-picker';

interface Props {
  startWeekDate: Date;
  endWeekDate: Date;
}

export const WeekTitle = ({ startWeekDate, endWeekDate }: Props) => {
  return (
    <WeekPicker
      initialDate={startWeekDate}
      title={`${format(startWeekDate, 'yyyy-MM-dd')} - ${format(endWeekDate, 'yyyy-MM-dd')}`}
    />
  );
};
