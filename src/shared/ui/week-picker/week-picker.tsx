import { endOfWeek, format, isWithinInterval, startOfWeek } from 'date-fns';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { dateConfig } from '@/shared/config/date.config';
import { cn } from '@/shared/lib';
import { Calendar, Popover, PopoverContent, PopoverTrigger } from '@/shared/ui';

interface WeekPickerProps {
  initialDate?: Date;
  title?: string;
  className?: string;
  onChange: (date: DateRange) => void;
  formatTitle?: (date: DateRange) => string;
}

export function WeekPicker({
  initialDate,
  title,
  className,
  formatTitle,
  onChange,
}: WeekPickerProps) {
  const [date, setDate] = useState<DateRange | null>(null);
  const [month, setMonth] = useState<Date>(() => initialDate ?? new Date());
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  useEffect(() => {
    const baseDate = initialDate ?? new Date();

    const start = startOfWeek(baseDate, {
      weekStartsOn: dateConfig.weekStart,
    });
    const end = endOfWeek(start, {
      weekStartsOn: dateConfig.weekStart,
    });

    setDate({
      from: start,
      to: end,
    });
    setMonth(start);
  }, [initialDate]);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const start = startOfWeek(selectedDate, {
        weekStartsOn: dateConfig.weekStart,
      });
      const end = endOfWeek(selectedDate, {
        weekStartsOn: dateConfig.weekStart,
      });
      setDate({ from: start, to: end });
      setMonth(start);
      onChange({ from: start, to: end });
    } else {
      setDate(null);
    }
  };

  const getWeekTitle = () => {
    if (title) {
      return title;
    }

    if (formatTitle && date) {
      return formatTitle(date);
    }

    if (date?.from && date?.to) {
      return `${format(date.from, dateConfig.formatWeek)} - ${format(date.to, dateConfig.formatWeek)}`;
    }

    return 'Pick a week';
  };

  const isInHoveredWeek = (day: Date) => {
    if (!hoveredDay) return false;

    const hoveredWeekStart = startOfWeek(hoveredDay, {
      weekStartsOn: dateConfig.weekStart,
    });
    const hoveredWeekEnd = endOfWeek(hoveredDay, {
      weekStartsOn: dateConfig.weekStart,
    });

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
            'w-fit cursor-pointer justify-start text-left font-normal text-foreground',
            !date && 'text-muted-foreground',
            className,
          )}
        >
          <span
            key={weekTitle}
            className="inline-block duration-300 animate-in fade-in"
          >
            {weekTitle}
          </span>
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          mode="single"
          selected={date?.from}
          month={month}
          onMonthChange={setMonth}
          onSelect={handleSelect}
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
