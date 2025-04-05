import { settingsConfig } from '@/shared/config/settings.config';

interface Props {
  day: string;
  date: Date;
}

export const DayNameCell = ({ day, date }: Props) => (
  <div className="w-state flex flex-col items-center justify-center text-center">
    <span>{day}</span>
    {settingsConfig.showWeekDate && (
      <span>{date.toLocaleDateString('en-US', { day: 'numeric' })}</span>
    )}
  </div>
);
