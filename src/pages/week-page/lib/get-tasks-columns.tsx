/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

import { State } from '@/entities/states/model/types/state.type';
import { EditableText } from '@/shared/ui/editable-text';
import { Button } from '@/shared/ui/shadcn/button';
import { TableCell } from '@/shared/ui/shadcn/table';

import { DayNameCell } from '../ui/day-name-cell';
import { StateCell } from '../ui/state-cell';

const returnStateCell = (
  value: { date: Date; state: State },
  taskId: string,
) => {
  return <StateCell state={value.state} date={value.date} taskId={taskId} />;
};

export const getTasksColumns = (): ColumnDef<any, any>[] => [
  {
    accessorKey: 'mo',
    enableSorting: false,
    header: () => <DayNameCell day="Mo" />,
    cell: ({ row, getValue }) =>
      returnStateCell(getValue(), row.original.taskId),
  },
  {
    accessorKey: 'tu',
    enableSorting: false,
    header: () => <DayNameCell day="Tu" />,
    cell: ({ row, getValue }) =>
      returnStateCell(getValue(), row.original.taskId),
  },
  {
    accessorKey: 'we',
    enableSorting: false,
    header: () => <DayNameCell day="We" />,
    cell: ({ row, getValue }) =>
      returnStateCell(getValue(), row.original.taskId),
  },
  {
    accessorKey: 'th',
    enableSorting: false,
    header: () => <DayNameCell day="Th" />,
    cell: ({ row, getValue }) =>
      returnStateCell(getValue(), row.original.taskId),
  },
  {
    accessorKey: 'fr',
    enableSorting: false,
    header: () => <DayNameCell day="Fr" />,
    cell: ({ row, getValue }) =>
      returnStateCell(getValue(), row.original.taskId),
  },
  {
    accessorKey: 'sa',
    enableSorting: false,
    header: () => <DayNameCell day="Sa" />,
    cell: ({ row, getValue }) =>
      returnStateCell(getValue(), row.original.taskId),
  },
  {
    accessorKey: 'su',
    enableSorting: false,
    header: () => <DayNameCell day="Su" />,
    cell: ({ row, getValue }) =>
      returnStateCell(getValue(), row.original.taskId),
  },
  {
    accessorKey: 'taskList',
    header: 'Task List',
    enableSorting: false,
    cell: ({ getValue }) => (
      <TableCell className="cursor-pointer border-b">
        <div className="flex items-center gap-2 px-2">
          <EditableText title={getValue().title} onChangeFinish={() => ({})} />
          <Button variant="ghost">
            <Trash2 size={15} className="text-destructive" />
          </Button>
        </div>
      </TableCell>
    ),
  },
];
