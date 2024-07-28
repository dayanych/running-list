import { useMutation } from '@tanstack/react-query';

import { StatesDal } from '@/entities/states';
import { StateStatus } from '@/entities/states/model/constants/state-status';

export const useEmptyStateCell = (taskId: string, date: Date) => {
  const { mutate } = useMutation({
    mutationKey: ['createEmptyStateTask'],
    mutationFn: async () =>
      StatesDal.createState({
        date,
        taskId,
        status: StateStatus.Empty,
      }),
    onSuccess: () => {},
  });

  return {
    createEmptyStateCell: mutate,
  };
};
