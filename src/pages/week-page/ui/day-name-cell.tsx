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
              ? 'text-[0.625rem] font-medium leading-[0.875rem] text-ink-faint'
              : 'text-[0.625rem] font-normal leading-[0.875rem] text-ink-faint'
          }
        >
          {date.toLocaleDateString('en-US', { day: 'numeric' })}
        </span>
      )}
    </div>
  );
};
