import { addWeeks } from 'date-fns';
import { type DateRange } from 'react-day-picker';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import { getEndOfAppWeek, getStartOfAppWeek } from '@/shared/lib';
import { Button, WeekPicker } from '@/shared/ui';

import { useWeekTitle } from '../lib/use-week-title';

interface Props {
  startWeekDate: Date;
  onChange: (date: DateRange) => void;
}

export const WeekTitle = ({ startWeekDate, onChange }: Props) => {
  const { formatTitle, formatMeta } = useWeekTitle();

  const changeWeek = (date: Date) => {
    const from = getStartOfAppWeek(date);
    onChange({ from, to: getEndOfAppWeek(from) });
  };

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="type-meta mb-2 text-ink-muted">
          {formatMeta(startWeekDate)}
        </p>
        <h1>
          <WeekPicker
            initialDate={startWeekDate}
            formatTitle={formatTitle}
            onChange={onChange}
            className="type-week block max-w-full"
          />
        </h1>
      </div>

      <nav
        aria-label="Week navigation"
        className="flex shrink-0 items-center gap-3 sm:pb-0.5"
      >
        <Button
          type="button"
          variant="outline"
          className="type-key rounded-none px-4 text-ink-secondary"
          onClick={() => changeWeek(new Date())}
        >
          Today
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-none text-ink-secondary"
          aria-label="Previous week"
          onClick={() => changeWeek(addWeeks(startWeekDate, -1))}
        >
          <LuChevronLeft aria-hidden="true" className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-none text-ink-secondary"
          aria-label="Next week"
          onClick={() => changeWeek(addWeeks(startWeekDate, 1))}
        >
          <LuChevronRight aria-hidden="true" className="h-5 w-5" />
        </Button>
      </nav>
    </div>
  );
};
