/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

import { State } from '@/entities/states/model/types/state.type';
import { dateConfig } from '@/shared/config/date.config';
import { Button, EditableText, TableCell } from '@/shared/ui';

import { DayNameCell } from '../ui/day-name-cell';
import { StateCell } from '../ui/state-cell';

const returnStateCell = (
  value: { date: Date; state: State },
  taskId: string,
) => {
  return <StateCell state={value.state} date={value.date} taskId={taskId} />;
};

export const getTasksColumns = (startWeekDate: Date): ColumnDef<any, any>[] => {
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
        returnStateCell(getValue(), row.original.taskId),
    })),
    {
      accessorKey: 'taskList',
      header: '',
      enableSorting: false,
      cell: ({ getValue }) => (
        <TableCell className="cursor-pointer border-b">
          <div className="flex items-center gap-2 px-2">
            <EditableText
              title={getValue().title}
              onChangeFinish={() => ({})}
            />
            <Button variant="ghost">
              <Trash2 size={15} className="text-destructive" />
            </Button>
          </div>
        </TableCell>
      ),
    },
  ];
};
