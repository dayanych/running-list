import { isToday } from 'date-fns';

import { settingsConfig } from '@/shared/config/settings.config';

interface Props {
  day: string;
  date: Date;
}

export const DayNameCell = ({ day, date }: Props) => {
  const isCurrentDay = isToday(date);

  return (
    <div className="w-state flex flex-col items-center justify-center text-center">
      <span
        className={
          isCurrentDay
            ? 'type-weekday-current text-primary'
            : 'type-weekday text-ink-muted'
        }
      >
        {day}
      </span>
      {settingsConfig.showWeekDate && (
        <span
          className={
            isCurrentDay
              ? 'type-daynum-current text-primary'
              : 'type-daynum text-ink-muted'
          }
        >
          {date.toLocaleDateString('en-US', { day: 'numeric' })}
        </span>
      )}
    </div>
  );
};
