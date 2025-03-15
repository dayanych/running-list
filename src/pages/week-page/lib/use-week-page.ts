import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { StatesDal } from '@/entities/states';
import { TasksDal } from '@/entities/tasks';
import { useUser } from '@/shared/lib/hooks/use-user';
import { useYearWeekParams } from '@/shared/lib/hooks/use-year-week-params';

import { TaskWithStates } from '../ui/tasks-table';

const getStartDateOfWeek = (week: number, year: number) => {
  const firstDayOfYear = new Date(year, 0, 1);
  const firstDayOfWeek = firstDayOfYear.getDay();
  const dayOffset =
    (week - 1) * 7 - firstDayOfWeek + (firstDayOfWeek === 0 ? -6 : 1) + 1;

  return new Date(year, 0, dayOffset);
};

const getEndDateOfWeek = (week: number, year: number) => {
  const startDate = getStartDateOfWeek(week, year);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  return endDate;
};

export const useWeekPage = () => {
  const user = useUser();
  const { year, week } = useYearWeekParams();

  if (!user || !year || !week) {
    toast.error('User, year, or week not provided');
    throw new Error('User, year, or week not provided');
  }

  const startWeekDate = getStartDateOfWeek(week, year);
  const endWeekDate = getEndDateOfWeek(week, year);
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

  return {
    startWeekDate,
    endWeekDate,
    tasksWithStates,
    isLoading,
    isError,
  };
};
