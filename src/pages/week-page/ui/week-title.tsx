import { DateRange } from 'react-day-picker';

import { WeekPicker } from '@/shared/ui';

import { useWeekTitle } from '../lib/use-week-title';

interface Props {
  startWeekDate: Date;
  onChange: (date: DateRange) => void;
}

export const WeekTitle = ({ startWeekDate, onChange }: Props) => {
  const { formatTitle } = useWeekTitle();

  return (
    <WeekPicker
      initialDate={startWeekDate}
      formatTitle={formatTitle}
      onChange={onChange}
      className="py-4 text-3xl font-bold"
    />
  );
};
