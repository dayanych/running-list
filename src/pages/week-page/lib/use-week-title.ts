import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { dateConfig } from '@/shared/config/date.config';

export const useWeekTitle = () => {
  const formatTitle = (date: DateRange) => {
    if (!date.from || !date.to) return '';

    return `${format(date.from, dateConfig.formatWeekTitle)} - ${format(
      date.to,
      dateConfig.formatWeekTitle,
    )}`;
  };

  return {
    formatTitle,
  };
};
