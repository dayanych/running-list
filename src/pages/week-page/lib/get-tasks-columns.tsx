/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table';

import { State } from '@/entities/states/model/types/state.type';
import { dateConfig } from '@/shared/config/date.config';

import { DayNameCell } from '../ui/day-name-cell';
import { StateCell } from '../ui/state-cell';
import { TaskCell } from '../ui/task-cell';

const returnStateCell = (
  value: { date: Date; state: State },
  taskId: string,
  isTaskDeleting: (taskId: string) => boolean,
) => {
  return (
    <StateCell
      key={value?.state?.id ?? `${taskId}-${value.date.toISOString()}`}
      state={value.state}
      date={value.date}
      taskId={taskId}
      isLoading={isTaskDeleting(taskId)}
    />
  );
};

export const getTasksColumns = (
  startWeekDate: Date,
  deleteTask: (taskId: string) => void,
  isTaskDeleting: (taskId: string) => boolean,
): ColumnDef<any, any>[] => {
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const currentDate = new Date(startWeekDate);
    currentDate.setDate(startWeekDate.getDate() + i);

    return {
      day: dateConfig.weekDays[(i + dateConfig.weekStart) % 7],
      date: currentDate,
    };
  });

  return [
    ...weekDays.map((day) => ({
      accessorKey: day.day,
      enableSorting: false,
      header: () => <DayNameCell day={day.day} date={day.date} />,
      cell: ({ row, getValue }: any) =>
        returnStateCell(getValue(), row.original.taskId, isTaskDeleting),
    })),
    {
      accessorKey: 'taskList',
      header: '',
      enableSorting: false,
      cell: ({ getValue, row }) => (
        <TaskCell
          task={getValue()}
          deleteTask={deleteTask}
          isDeletingTask={isTaskDeleting(row.original.taskId)}
        />
      ),
    },
  ];
};
