import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import { State, StatesDal } from '@/entities/states';
import { TasksDal } from '@/entities/tasks';
import {
  getStartDateOfAppWeek,
  useUser,
  useWeekCalendarChange,
  useWeeksParams,
} from '@/shared/lib';

import { TaskWithStates } from '../ui/tasks-table';

/**
 * Groups a flat list of states by the task they belong to
 *
 * @param states - States loaded for every task of the week
 * @returns Map from task id to the states of that task
 */
const groupStatesByTaskId = (states: State[]): Map<string, State[]> => {
  const statesByTaskId = new Map<string, State[]>();

  states.forEach((state) => {
    const taskStates = statesByTaskId.get(state.taskId);

    if (taskStates) {
      taskStates.push(state);
      return;
    }

    statesByTaskId.set(state.taskId, [state]);
  });

  return statesByTaskId;
};

export const useWeekPage = () => {
  const user = useUser();
  const userId = user?.id;
  const { year, week } = useWeeksParams();
  const { onWeekChange } = useWeekCalendarChange();

  const taskInputRef = useRef<HTMLInputElement>(null);

  const {
    data: tasksWithStates = [],
    isLoading: isLoadingTasks,
    isError,
  } = useQuery({
    queryKey: ['getTasks', userId, year, week],
    queryFn: async (): Promise<TaskWithStates[]> => {
      if (!userId) {
        return [];
      }

      // States are selected by owner and day rather than by task id, so both
      // queries run in parallel
      const [tasks, states] = await Promise.all([
        TasksDal.getTasksByUserIdYearWeek(userId, year, week),
        StatesDal.getStatesByUserIdYearWeek(userId, year, week),
      ]);
      const statesByTaskId = groupStatesByTaskId(states);

      return tasks.map((task) => ({
        ...task,
        states: statesByTaskId.get(task.id) ?? [],
      }));
    },
    enabled: Boolean(userId),
  });

  const handleCreateTaskClick = useCallback(() => {
    taskInputRef.current?.focus();
  }, []);

  return {
    startWeekDate: getStartDateOfAppWeek(week, year),
    tasksWithStates,
    // The query is disabled until the user is known, so a disabled-and-pending
    // query must still read as loading rather than as an empty week
    isLoading: isLoadingTasks || !userId,
    isError,
    taskInputRef,
    handleWeekChange: onWeekChange,
    handleCreateTaskClick,
  };
};
