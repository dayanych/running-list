import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';

import { State, StatesDal } from '@/entities/states';
import { TasksDal } from '@/entities/tasks';
import { settingsConfig } from '@/shared/config/settings.config';
import {
  getStartDateOfAppWeek,
  useUser,
  useWeekCalendarChange,
  useWeeksParams,
} from '@/shared/lib';

import type { TaskWithStates } from '../ui/tasks-table';

export type WeekTransitionDirection = 'idle' | 'forward' | 'backward';

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
  const startWeekDate = getStartDateOfAppWeek(week, year);
  const weekStartTimestamp = startWeekDate.getTime();
  const [weekTransition, setWeekTransition] = useState<{
    weekStartTimestamp: number;
    direction: WeekTransitionDirection;
  }>({ weekStartTimestamp, direction: 'idle' });

  if (!Object.is(weekTransition.weekStartTimestamp, weekStartTimestamp)) {
    const hasValidTimestamps =
      Number.isFinite(weekStartTimestamp) &&
      Number.isFinite(weekTransition.weekStartTimestamp);

    setWeekTransition({
      weekStartTimestamp,
      direction: hasValidTimestamps
        ? weekStartTimestamp > weekTransition.weekStartTimestamp
          ? 'forward'
          : 'backward'
        : 'idle',
    });
  }

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

  return {
    startWeekDate,
    transitionDirection: weekTransition.direction,
    tasksWithStates,
    isTaskLimitReached:
      tasksWithStates.length >= settingsConfig.maxTasksPerWeek,
    // The query is disabled until the user is known, so a disabled-and-pending
    // query must still read as loading rather than as an empty week
    isLoading: isLoadingTasks || !userId,
    isError,
    taskInputRef,
    handleWeekChange: onWeekChange,
  };
};
