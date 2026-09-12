import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addWeeks } from 'date-fns';

import { Task, TasksDal, TaskWithStates } from '@/entities/tasks';
import {
  getAppWeek,
  getAppWeekYear,
  getStartDateOfAppWeek,
} from '@/shared/lib';
import { useUser } from '@/shared/lib/hooks/use-user';
import { useWeeksParams } from '@/shared/lib/hooks/use-weeks-params';
import { notify } from '@/shared/ui/toaster/notify';

export const useTaskCell = () => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { year, week } = useWeeksParams();
  const queryKey = ['getTasks', user?.id, year, week];

  const updateOldData = (updatedTask: Task) => {
    queryClient.setQueryData(
      queryKey,
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
      onError: () => {
        notify.error("Couldn't rename task. The previous title was restored");
      },
    });

  const { mutate: copyTaskToNextWeek, isPending: isCopyingTask } = useMutation({
    mutationFn: async (task: Task) => {
      const nextWeekDate = addWeeks(
        getStartDateOfAppWeek(task.week, task.year),
        1,
      );

      return TasksDal.createTask({
        title: task.title,
        userId: task.userId,
        color: task.color,
        week: getAppWeek(nextWeekDate),
        year: getAppWeekYear(nextWeekDate),
      });
    },
    onSuccess: async (copiedTask) => {
      await queryClient.invalidateQueries({
        queryKey: [
          'getTasks',
          copiedTask.userId,
          copiedTask.year,
          copiedTask.week,
        ],
      });

      notify.success(`Task copied to week ${copiedTask.week}`);
    },
  });

  return {
    updateTaskTitle,
    isUpdatingTaskTitle,
    copyTaskToNextWeek,
    isCopyingTask,
  };
};
