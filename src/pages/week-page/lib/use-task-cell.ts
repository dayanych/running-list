import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Task, TasksDal, TaskWithStates } from '@/entities/tasks';
import { useUser } from '@/shared/lib/hooks/use-user';
import { useYearWeekParams } from '@/shared/lib/hooks/use-year-week-params';

export const useTaskCell = () => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { year, week } = useYearWeekParams();

  const updateOldData = (updatedTask: Task) => {
    queryClient.setQueryData(
      ['getTasks', user?.id, year, week],
      (oldData: TaskWithStates[] | undefined) => {
        if (!oldData) return oldData;

        return oldData.map((task) =>
          task.id === updatedTask.id
            ? {
                ...task,
                title: updatedTask.title,
              }
            : task,
        );
      },
    );
  };

  const { mutate: updateTaskTitle, isPending: isUpdatingTaskTitle } =
    useMutation({
      mutationFn: async ({ task, title }: { task: Task; title: string }) => {
        if (task.title === title) {
          return task;
        }
        const updatedTask = await TasksDal.updateTask({ ...task, title });
        return updatedTask;
      },
      onSuccess: (updatedTask) => {
        updateOldData(updatedTask);
      },
      // onError: (error) => {
      //   console.error(error);
      // },
      meta: { showToast: false },
    });

  return {
    updateTaskTitle,
    isUpdatingTaskTitle,
  };
};
