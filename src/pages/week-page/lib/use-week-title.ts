import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { dateConfig } from '@/shared/config/date.config';
import { getAppWeek, getAppWeekYear } from '@/shared/lib/week';

export const useWeekTitle = () => {
  const formatTitle = (date: DateRange) => {
    if (!date.from || !date.to) return '';

    return `${format(date.from, dateConfig.formatWeekTitle)} — ${format(
      date.to,
      dateConfig.formatWeekTitle,
    )}`;
  };

  const formatMeta = (date: Date) =>
    `Week ${getAppWeek(date)} · ${getAppWeekYear(date)}`;

  return {
    formatTitle,
    formatMeta,
  };
};
