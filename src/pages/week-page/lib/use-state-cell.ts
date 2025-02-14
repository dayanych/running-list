import { useMutation } from '@tanstack/react-query';

import { StatesDal } from '@/entities/states';
import { StateStatus } from '@/entities/states/model/constants/state-status';
import { State } from '@/entities/states/model/types/state.type';

export const useStateCell = (state: State | null, taskId: string) => {
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
        date: new Date(),
      }),
    onSuccess: () => {},
  });

  const { mutate: updateStateCell } = useMutation({
    mutationKey: ['updateStateTask'],
    mutationFn: async ({ state }: { state: State }) =>
      StatesDal.updateState(state),
    onSuccess: () => {},
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
