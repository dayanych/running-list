import { useMutation, useQueryClient } from '@tanstack/react-query';

import { StatesDal } from '@/entities/states';
import { StateStatus } from '@/entities/states/model/constants/state-status';
import { State } from '@/entities/states/model/types/state.type';
import { TaskWithStates } from '@/entities/tasks/model/types/task.type';
import { useUser } from '@/shared/lib/hooks/use-user';
import { useWeeksParams } from '@/shared/lib/hooks/use-weeks-params';

import { removeStateFromTasks } from './remove-state-from-tasks';

export const useStateCell = (
  date: Date,
  state: State | null,
  taskId: string,
) => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { year, week } = useWeeksParams();

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

  const { mutate: createEmptyStateCell, isPending: isCreatingState } =
    useMutation({
      mutationKey: ['createEmptyStateTask'],
      mutationFn: async ({
        taskId,
        status,
      }: {
        taskId: string;
        status: StateStatus;
      }) => {
        if (!user) throw new Error('User is not loaded');

        return StatesDal.createState({
          taskId,
          status,
          date,
          userId: user.id,
        });
      },
      onSuccess: addNewState,
    });

  const { mutate: updateStateCell, isPending: isUpdatingState } = useMutation({
    mutationKey: ['updateStateTask'],
    mutationFn: async ({ state }: { state: State }) =>
      StatesDal.updateState(state),
    onSuccess: updateOldData,
  });

  const { mutate: deleteStateCell, isPending: isDeletingState } = useMutation({
    mutationKey: ['deleteStateTask'],
    mutationFn: async (deletedState: State) => {
      await StatesDal.deleteState(deletedState.id);

      return deletedState;
    },
    onSuccess: (deletedState) => {
      queryClient.setQueryData(
        ['getTasks', user?.id, year, week],
        (oldData: TaskWithStates[] | undefined) =>
          removeStateFromTasks(oldData, deletedState.taskId, deletedState.id),
      );
    },
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

  const deleteState = () => {
    if (!state) return;

    deleteStateCell(state);
  };

  return {
    updateStatus,
    deleteState,
    isStateMutationPending:
      isCreatingState || isUpdatingState || isDeletingState,
  };
};
