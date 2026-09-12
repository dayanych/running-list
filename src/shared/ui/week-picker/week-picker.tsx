import { format, isWithinInterval } from 'date-fns';
import { type Key, useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { dateConfig } from '@/shared/config/date.config';
import { cn, getEndOfAppWeek, getStartOfAppWeek } from '@/shared/lib';
import { Calendar, Popover, PopoverContent, PopoverTrigger } from '@/shared/ui';

interface WeekPickerProps {
  initialDate?: Date;
  title?: string;
  className?: string;
  contentKey?: Key;
  contentClassName?: string;
  onChange: (date: DateRange) => void;
  formatTitle?: (date: DateRange) => string;
}

export function WeekPicker({
  initialDate,
  title,
  className,
  contentKey,
  contentClassName,
  formatTitle,
  onChange,
}: WeekPickerProps) {
  const baseDate = initialDate ?? new Date();
  const startDate = getStartOfAppWeek(baseDate);
  const date: DateRange = {
    from: startDate,
    to: getEndOfAppWeek(startDate),
  };
  const startDateTimestamp = startDate.getTime();
  const [month, setMonth] = useState<Date>(() => startDate);
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  useEffect(() => {
    setMonth(new Date(startDateTimestamp));
  }, [startDateTimestamp]);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const start = getStartOfAppWeek(selectedDate);
      const end = getEndOfAppWeek(selectedDate);
      setMonth(start);
      onChange({ from: start, to: end });
    }
  };

  const getWeekTitle = () => {
    if (title) {
      return title;
    }

    if (formatTitle) {
      return formatTitle(date);
    }

    if (date?.from && date?.to) {
      return `${format(date.from, dateConfig.formatWeek)} - ${format(date.to, dateConfig.formatWeek)}`;
    }

    return 'Pick a week';
  };

  const isInHoveredWeek = (day: Date) => {
    if (!hoveredDay) return false;

    const hoveredWeekStart = getStartOfAppWeek(hoveredDay);
    const hoveredWeekEnd = getEndOfAppWeek(hoveredDay);

    return isWithinInterval(day, {
      start: hoveredWeekStart,
      end: hoveredWeekEnd,
    });
  };

  const modifiers = {
    weekHighlight: (day: Date) => {
      if (!date?.from) return false;
      return isWithinInterval(day, {
        start: date.from,
        end: date.to || date.from,
      });
    },
    weekHover: (day: Date) => isInHoveredWeek(day),
  };

  const modifiersStyles = {
    weekHighlight: {
      backgroundColor: 'var(--accent)',
      color: 'var(--accent-foreground)',
      borderRadius: 'var(--radius-sm)',
    },
    weekHover: {
      backgroundColor: 'var(--muted)',
      color: 'var(--muted-foreground)',
      borderRadius: 'var(--radius-sm)',
    },
  };

  const handlePopoverOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      const resetDate = date?.from ?? initialDate ?? new Date();
      setMonth(resetDate);
    }
  };

  const weekTitle = getWeekTitle();

  return (
    <Popover onOpenChange={handlePopoverOpenChange}>
      <PopoverTrigger asChild>
        <span
          className={cn(
            'w-fit cursor-pointer justify-start text-left text-foreground',
            className,
          )}
        >
          <span
            key={contentKey}
            className={cn('inline-block', contentClassName)}
          >
            {weekTitle}
          </span>
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          month={month}
          onMonthChange={setMonth}
          onDayClick={handleSelect}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          weekStartsOn={dateConfig.weekStart}
          className="rounded-md border"
          onDayMouseEnter={(day) => setHoveredDay(day)}
          onDayMouseLeave={() => setHoveredDay(null)}
        />
      </PopoverContent>
    </Popover>
  );
}
