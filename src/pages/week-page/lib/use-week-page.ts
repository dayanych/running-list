import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { TasksDal } from '@/entities/tasks';
import { useTasksQuery } from '@/shared/lib/hooks/use-tasks-query';
import { useUser } from '@/shared/lib/hooks/use-user';

import { useYearWeekParams } from './use-year-week-params';

const getStartDateOfWeek = (week: number, year: number) => {
  const firstDayOfYear = new Date(year, 0, 1);
  const firstDayOfWeek = firstDayOfYear.getDay();
  const dayOffset =
    (week - 1) * 7 - firstDayOfWeek + (firstDayOfWeek === 0 ? -6 : 1);
  return new Date(year, 0, dayOffset);
};

export const useWeekPage = () => {
  const user = useUser();
  const { year, week } = useYearWeekParams();
  const queryClient = useQueryClient();

  if (!user || !year || !week) {
    toast.error('User, year, or week not provided');
    throw new Error('User, year, or week not provided');
  }

  const startWeekDate = getStartDateOfWeek(week, year);

  const {
    data: tasksWithStates,
    isLoading,
    isError,
  } = useTasksQuery(user.id, year, week);

  const { mutate } = useMutation({
    mutationKey: ['updateTaskState'],
    mutationFn: () =>
      TasksDal.createTask({
        title: '',
        userId: user.id,
        week,
        year,
        color: '',
        createdAt: new Date(),
      }),
    onSuccess: async (newTask) => {
      // await queryClient.invalidateQueries({
      //   queryKey: ['getTasks', user.id, year, week],
      // });
      if (!tasksWithStates) {
        return;
      }
      await queryClient.setQueryData(['getTasks', user.id, year, week], () => {
        const newData = [...tasksWithStates, { ...newTask, states: [] }];
        return newData;
      });
    },
  });

  return {
    startWeekDate,
    tasksWithStates,
    isLoading,
    isError,
    createTask: mutate,
  };
};
