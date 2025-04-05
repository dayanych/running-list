import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';

import { TasksDal } from '@/entities/tasks';
import { useUser } from '@/shared/lib/hooks/use-user';
import { useYearWeekParams } from '@/shared/lib/hooks/use-year-week-params';

export const useCreateTaskInput = () => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { week, year } = useYearWeekParams();
  const [taskTitle, setTaskTitle] = useState('');

  if (!user) {
    throw new Error('User not provided');
  }

  const { mutate: createTask, isPending: isLoading } = useMutation({
    mutationKey: ['createTask'],
    mutationFn: async () =>
      TasksDal.createTask({
        title: taskTitle.trim(),
        userId: user.id,
        color: '',
        week,
        year,
      }),
    onSuccess: () => {
      setTaskTitle('');
      queryClient.invalidateQueries({
        queryKey: ['getTasks', user.id, year, week],
      });
    },
    meta: { showToast: false },
  });

  const handleTaskTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTaskTitle(event.target.value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (taskTitle.trim() === '') return;

    createTask();
  };

  return {
    taskTitle,
    isLoading,
    onSubmit,
    handleTaskTitleChange,
  };
};
