/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

import { State } from '@/entities/states/model/types/state.type';
import { EditableText } from '@/shared/ui/editable-text';
import { Button } from '@/shared/ui/shadcn/button';
import { TableCell } from '@/shared/ui/shadcn/table';

import { DayNameCell } from '../ui/day-name-cell';
import { StateCell } from '../ui/state-cell';

const returnStateCell = (value: {
  date: Date;
  state: State;
  taskId: string;
}) => {
  return (
    <StateCell state={value.state} date={value.date} taskId={value.taskId} />
  );
};

export const getTasksColumns = (): ColumnDef<any, any>[] => [
  {
    accessorKey: 'mo',
    enableSorting: false,
    header: () => <DayNameCell day="Mo" />,
    cell: ({ getValue }) => returnStateCell(getValue()),
  },
  {
    accessorKey: 'tu',
    enableSorting: false,
    header: () => <DayNameCell day="Tu" />,
    cell: ({ getValue }) => returnStateCell(getValue()),
  },
  {
    accessorKey: 'we',
    enableSorting: false,
    header: () => <DayNameCell day="We" />,
    cell: ({ getValue }) => returnStateCell(getValue()),
  },
  {
    accessorKey: 'th',
    enableSorting: false,
    header: () => <DayNameCell day="Th" />,
    cell: ({ getValue }) => returnStateCell(getValue()),
  },
  {
    accessorKey: 'fr',
    enableSorting: false,
    header: () => <DayNameCell day="Fr" />,
    cell: ({ getValue }) => returnStateCell(getValue()),
  },
  {
    accessorKey: 'sa',
    enableSorting: false,
    header: () => <DayNameCell day="Sa" />,
    cell: ({ getValue }) => returnStateCell(getValue()),
  },
  {
    accessorKey: 'su',
    enableSorting: false,
    header: () => <DayNameCell day="Su" />,
    cell: ({ getValue }) => returnStateCell(getValue()),
  },
  {
    accessorKey: 'taskTitle',
    header: 'Task List',
    enableSorting: false,
    cell: ({ getValue }) => (
      <TableCell className="cursor-pointer border-b">
        <div className="flex items-center gap-2 px-2">
          <EditableText title={getValue()} onChangeFinish={() => ({})} />
          <Button variant="ghost">
            <Trash2 size={15} className="text-destructive" />
          </Button>
        </div>
      </TableCell>
    ),
  },
];
