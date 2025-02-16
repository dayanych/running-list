import { useMutation, useQueryClient } from '@tanstack/react-query';

import { StatesDal } from '@/entities/states';
import { StateStatus } from '@/entities/states/model/constants/state-status';
import { State } from '@/entities/states/model/types/state.type';
import { TaskWithStates } from '@/entities/tasks/model/types/task.type';
import { useUser } from '@/shared/lib/hooks/use-user';
import { useYearWeekParams } from '@/shared/lib/hooks/use-year-week-params';

export const useStateCell = (
  date: Date,
  state: State | null,
  taskId: string,
) => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { year, week } = useYearWeekParams();

  const updateOldData = (updatedState: State) => {
    queryClient.setQueryData(
      ['getTasks', user?.id, year, week],
      (oldData: TaskWithStates[] | undefined) => {
        if (!oldData) return oldData;

        return oldData.map((task) =>
          task.id === updatedState.taskId
            ? {
                ...task,
                states: task.states.map((s) =>
                  s.id === updatedState.id ? updatedState : s,
                ),
              }
            : task,
        );
      },
    );
  };

  const addNewState = (newState: State) => {
    queryClient.setQueryData(
      ['getTasks', user?.id, year, week],
      (oldData: TaskWithStates[] | undefined) => {
        if (!oldData) return oldData;

        return oldData.map((task) =>
          task.id === newState.taskId
            ? { ...task, states: [...task.states, newState] }
            : task,
        );
      },
    );
  };

  const { mutate: createEmptyStateCell } = useMutation({
    mutationKey: ['createEmptyStateTask'],
    mutationFn: async ({
      taskId,
      status,
    }: {
      taskId: string;
      status: StateStatus;
    }) =>
      StatesDal.createState({
        taskId,
        status,
        date,
      }),
    onSuccess: addNewState,
    meta: { showToast: false },
  });

  const { mutate: updateStateCell } = useMutation({
    mutationKey: ['updateStateTask'],
    mutationFn: async ({ state }: { state: State }) =>
      StatesDal.updateState(state),
    onSuccess: updateOldData,
    meta: { showToast: false },
  });

  const updateStatus = (status: StateStatus) => {
    if (!state) {
      createEmptyStateCell({
        taskId,
        status,
      });
      return;
    }

    updateStateCell({
      state: {
        ...state,
        status,
      },
    });
  };

  return {
    updateStatus,
  };
};
