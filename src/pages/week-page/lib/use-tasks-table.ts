import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';

import { State } from '@/entities/states/model/types/state.type';
import { TasksDal } from '@/entities/tasks';
import { useUser } from '@/shared/lib/hooks/use-user';
import { useYearWeekParams } from '@/shared/lib/hooks/use-year-week-params';

import { TaskWithStates } from '../ui/tasks-table';
import { getTasksColumns } from './get-tasks-columns';

const daysMap = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
const dayStatus: {
  [key: string]: { date: Date | null; state: State | null };
} = {
  mo: {
    date: null,
    state: null,
  },
  tu: {
    date: null,
    state: null,
  },
  we: {
    date: null,
    state: null,
  },
  th: {
    date: null,
    state: null,
  },
  fr: {
    date: null,
    state: null,
  },
  sa: {
    date: null,
    state: null,
  },
  su: {
    date: null,
    state: null,
  },
};

export const useTasksTable = (tasks: TaskWithStates[], startWeekDate: Date) => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { year, week } = useYearWeekParams();
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const queryKey = ['getTasks', user?.id, year, week];

  const removeTaskFromOldData = (taskId: string) => {
    queryClient.setQueryData(
      queryKey,
      (oldData: TaskWithStates[] | undefined) => {
        if (!oldData) return oldData;

        return oldData.filter((task) => task.id !== taskId);
      },
    );
  };

  const { mutate: deleteTask, isPending: isDeletingTask } = useMutation({
    mutationFn: async (taskId: string) => {
      setDeletingTaskId(taskId);
      await TasksDal.deleteTask(taskId);
      return taskId;
    },
    onSuccess: (_, taskId) => {
      removeTaskFromOldData(taskId);
    },
    onSettled: () => {
      setDeletingTaskId(null);
    },
    meta: { showToast: false },
  });

  const isTaskDeleting = useCallback(
    (taskId: string) => isDeletingTask && deletingTaskId === taskId,
    [deletingTaskId, isDeletingTask],
  );

  const columns = useMemo(
    () => getTasksColumns(startWeekDate, deleteTask, isTaskDeleting),
    [startWeekDate, deleteTask, isTaskDeleting],
  );

  const data = useMemo(
    () =>
      tasks.map((task) => {
        const dayStatusClone = structuredClone(dayStatus);

        for (let i = 0; i < 7; i++) {
          const currentDate = new Date(startWeekDate);
          currentDate.setDate(startWeekDate.getDate() + i);
          const day = daysMap[currentDate.getDay()];
          dayStatusClone[day].date = currentDate;
        }

        task.states.forEach((state) => {
          const day = daysMap[state.date.getDay()];
          if (dayStatusClone[day].date?.getTime() === state.date.getTime()) {
            dayStatusClone[day].state = state;
          }
        });

        return {
          ...dayStatusClone,
          taskList: task,
          taskId: task.id,
        };
      }),
    [tasks, startWeekDate],
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return { columns, table };
};
