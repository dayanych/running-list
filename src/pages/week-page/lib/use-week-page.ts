import { useQuery } from '@tanstack/react-query';

import { StatesDal } from '@/entities/states';
import { TasksDal } from '@/entities/tasks';
import {
  getStartDateOfWeek,
  useUser,
  useWeekCalendarChange,
  useYearWeekParams,
} from '@/shared/lib';

import { TaskWithStates } from '../ui/tasks-table';

export const useWeekPage = () => {
  const user = useUser();
  const { year, week } = useYearWeekParams();
  const { onWeekChange } = useWeekCalendarChange();

  const {
    data: tasksWithStates = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getTasks', user?.id, year, week],
    queryFn: async () => {
      if (!user) return;

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
    startWeekDate: getStartDateOfWeek(week, year),
    tasksWithStates,
    isLoading,
    isError,
    handleWeekChange: onWeekChange,
  };
};
