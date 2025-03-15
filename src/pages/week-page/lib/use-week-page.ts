import { useQuery } from '@tanstack/react-query';
import { addDays, setWeek, startOfWeek } from 'date-fns';
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

const getEndDateOfWeek = (week: number, year: number) => {
  const startDate = getStartDateOfWeek(week, year);
  return addDays(startDate, 6);
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
