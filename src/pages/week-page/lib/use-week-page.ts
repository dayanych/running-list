import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWeek, getYear, setWeek, startOfWeek } from 'date-fns';
import { DateRange } from 'react-day-picker';
import toast from 'react-hot-toast';

import { StatesDal } from '@/entities/states';
import { TasksDal } from '@/entities/tasks';
import { dateConfig } from '@/shared/config/date.config';
import { useUser } from '@/shared/lib/hooks/use-user';
import { useYearWeekParams } from '@/shared/lib/hooks/use-year-week-params';

import { TaskWithStates } from '../ui/tasks-table';

const getStartDateOfWeek = (week: number, year: number) => {
  const date = setWeek(new Date(year, 0, 1), week);
  return startOfWeek(date, { weekStartsOn: dateConfig.weekStart });
};

export const useWeekPage = () => {
  const user = useUser();
  const { year, week } = useYearWeekParams();
  const [startWeekDate, setStartWeekDate] = useState<Date>(
    getStartDateOfWeek(week, year),
  );

  if (!user || !year || !week) {
    toast.error('User, year, or week not provided');
    throw new Error('User, year, or week not provided');
  }

  const {
    data: tasksWithStates,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getTasks', user.id, year, week],
    queryFn: async () => {
      const tasks = await TasksDal.getTasksByUserIdYearWeek(
        user.id,
        year,
        week,
      );
      const tasksWithStates: TaskWithStates[] = await Promise.all(
        tasks.map(async (task) => {
          const states = await StatesDal.getStatesByTaskId(task.id);
          return { ...task, states };
        }),
      );

      return tasksWithStates;
    },
  });

  const handleWeekChange = (date: DateRange) => {
    if (!date.from || !date.to) return;

    const updatedWeek = getWeek(date.from);
    const updatedYear = getYear(date.from); 
    const updatedStartWeekDate = getStartDateOfWeek(updatedWeek, updatedYear);

    setStartWeekDate(updatedStartWeekDate);
  };

  return {
    startWeekDate,
    tasksWithStates,
    isLoading,
    isError,
    handleWeekChange,
  };
};
