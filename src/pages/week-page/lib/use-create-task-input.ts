import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';

import { TasksDal } from '@/entities/tasks';
import { useUser } from '@/shared/lib/hooks/use-user';
import { useWeeksParams } from '@/shared/lib/hooks/use-weeks-params';

/**
 * Drives the new task form of the current week
 *
 * @param isTaskLimitReached - Whether the week already holds the maximum number of tasks
 * @returns Form state, the limit tooltip state and the form handlers
 */
export const useCreateTaskInput = (isTaskLimitReached: boolean) => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { week, year } = useWeeksParams();
  const [taskTitle, setTaskTitle] = useState('');
  const [isLimitTooltipOpen, setIsLimitTooltipOpen] = useState(false);

  const { mutate: createTask, isPending: isLoading } = useMutation({
    mutationKey: ['createTask'],
    mutationFn: async () => {
      if (!user) return;

      await TasksDal.createTask({
        title: taskTitle.trim(),
        userId: user.id,
        color: '',
        week,
        year,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['getTasks', user?.id, year, week],
      });
      setTaskTitle('');
    },
  });

  const handleTaskTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTaskTitle(event.target.value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isTaskLimitReached || taskTitle.trim() === '') return;

    createTask();
  };

  return {
    taskTitle,
    isLoading,
    // The tooltip explains the disabled input, so it stays closed while the
    // week still has room for another task
    isLimitTooltipOpen: isTaskLimitReached && isLimitTooltipOpen,
    onSubmit,
    handleTaskTitleChange,
    handleLimitTooltipOpenChange: setIsLimitTooltipOpen,
  };
};
