/* eslint-disable quotes */
import { endOfWeek, format, isWithinInterval, startOfWeek } from 'date-fns';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui/shadcn/button';
import { Calendar } from '@/shared/ui/shadcn/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/shadcn/popover';

interface WeekPickerProps {
  initialDate?: Date;
  title?: string;
}

export function WeekPicker({ initialDate, title }: WeekPickerProps) {
  const [date, setDate] = useState<DateRange | null>(null);
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  useEffect(() => {
    setDate({
      from: initialDate ?? new Date(),
      to: endOfWeek(initialDate ?? new Date(), { weekStartsOn: 1 }),
    });
  }, [initialDate]);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
      setDate({ from: start, to: end });
    } else {
      setDate(null);
    }
  };

  const getWeekTitle = () => {
    if (title) return title;
    if (date?.from && date?.to) {
      return `${format(date.from, 'yyyy-MM-dd')} - ${format(date.to, 'yyyy-MM-dd')}`;
    }

    return 'Pick a week';
  };

  const isInHoveredWeek = (day: Date) => {
    if (!hoveredDay) return false;

    const hoveredWeekStart = startOfWeek(hoveredDay, { weekStartsOn: 1 });
    const hoveredWeekEnd = endOfWeek(hoveredDay, { weekStartsOn: 1 });

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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          {getWeekTitle()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date?.from}
          onSelect={handleSelect}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          weekStartsOn={1}
          className="rounded-md border"
          onDayMouseEnter={(day) => setHoveredDay(day)}
          onDayMouseLeave={() => setHoveredDay(null)}
        />
      </PopoverContent>
    </Popover>
  );
}
