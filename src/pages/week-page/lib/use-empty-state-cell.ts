import { useMutation, useQueryClient } from '@tanstack/react-query';

import { StatesDal } from '@/entities/states';
import { StateStatus } from '@/entities/states/model/constants/state-status';
import { useTasksQuery } from '@/shared/lib/hooks/use-tasks-query';
import { useUser } from '@/shared/lib/hooks/use-user';

import { useYearWeekParams } from './use-year-week-params';

export const useEmptyStateCell = (taskId: string, date: Date) => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { year, week } = useYearWeekParams();
  const { data: tasksData } = useTasksQuery(user?.id ?? '', year, week);

  const { mutate } = useMutation({
    mutationKey: ['createEmptyStateTask'],
    mutationFn: async () =>
      StatesDal.createState({
        date,
        taskId,
        status: StateStatus.Empty,
      }),
    onSuccess: async (data) => {
      if (!tasksData) {
        return;
      }

      const task = tasksData.find((task) => task.id === taskId);

      if (task) {
        task.states.push(data);
      }

      // await queryClient.setQueryData(
      //   ['getTasks', user?.id, year, week],
      //   () => tasksData,
      // );
      await queryClient.invalidateQueries({
        queryKey: ['getTasks', user?.id, year, week],
      });
    },
  });

  const createEmptyStateCell = () => {
    mutate();
  };

  return {
    createEmptyStateCell,
  };
};
