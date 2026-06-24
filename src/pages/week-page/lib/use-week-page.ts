import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import { StatesDal } from '@/entities/states';
import { TasksDal } from '@/entities/tasks';
import {
  getStartDateOfAppWeek,
  useUser,
  useWeekCalendarChange,
  useWeeksParams,
} from '@/shared/lib';

import { TaskWithStates } from '../ui/tasks-table';

export const useWeekPage = () => {
  const user = useUser();
  const { year, week } = useWeeksParams();
  const { onWeekChange } = useWeekCalendarChange();

  const taskInputRef = useRef<HTMLInputElement>(null);

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

  const handleCreateTaskClick = useCallback(() => {
    taskInputRef.current?.focus();
  }, []);

  return {
    startWeekDate: getStartDateOfAppWeek(week, year),
    tasksWithStates,
    isLoading,
    isError,
    taskInputRef,
    handleWeekChange: onWeekChange,
    handleCreateTaskClick,
  };
};
