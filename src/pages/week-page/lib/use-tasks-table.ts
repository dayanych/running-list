import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';

import { State } from '@/entities/states/model/types/state.type';

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
  const columns = useMemo(getTasksColumns, []);
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
          taskId: task.id,
          taskTitle: task.title,
        };
      }),
    [tasks],
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return { columns, table };
};
