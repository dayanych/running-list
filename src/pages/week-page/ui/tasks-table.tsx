import { flexRender } from '@tanstack/react-table';
import { CalendarX, LoaderCircle, Plus } from 'lucide-react';
import { memo } from 'react';

import { State } from '@/entities/states/model/types/state.type';
import { Task } from '@/entities/tasks/model/types/task.type';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/shadcn/table';

import { useTasksTable } from '../lib/use-tasks-table';

export interface TaskWithStates extends Task {
  states: State[];
}

interface Props {
  data: TaskWithStates[];
  startWeekDate: Date;
  loading?: boolean;
  error?: boolean;
}

const TasksTable = ({ data, startWeekDate, loading, error }: Props) => {
  const { columns, table } = useTasksTable(data, startWeekDate);

  return (
    <Table className="border-collapse border text-lg">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header, headerIndex) => {
              const isLastChild =
                headerIndex === headerGroup.headers.length - 1;

              return (
                <TableHead
                  key={header.id}
                  className={cn(
                    'h-8 p-0',
                    isLastChild && 'w-full text-center',
                    'border-collapse border text-sm font-light',
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {loading && (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              <div className="flex h-full w-full items-center justify-center">
                <LoaderCircle className="h-14 w-14 animate-spin text-primary" />
              </div>
            </TableCell>
          </TableRow>
        )}
        {error && (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center font-semibold text-destructive"
            >
              An error occurred. Please try again.
            </TableCell>
          </TableRow>
        )}
        {!loading && !error && table.getRowModel().rows?.length === 0 && (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              <div className="flex w-full flex-col items-center justify-center gap-4 py-8">
                <CalendarX size={50} className="text-muted-foreground" />
                <p className="text-4xl">Nothing!</p>
                <span className="text-sm text-muted-foreground">
                  Add the first task to get started
                </span>
                <Button>
                  <span className="text-sm">Create task</span>
                  <span className="ml-2 inline-flex items-center">
                    <Plus size={16} />
                  </span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
        {table.getRowModel().rows?.length > 0 &&
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              className="border-b-0"
            >
              {row
                .getVisibleCells()
                .map((cell) =>
                  flexRender(cell.column.columnDef.cell, cell.getContext()),
                )}
            </TableRow>
          ))}
      </TableBody>
      {table.getRowModel().rows?.length > 0 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length}>
              <div className="flex w-full items-center justify-end p-2">
                <Button>
                  <span className="text-sm">Create task</span>
                  <span className="ml-2 inline-flex items-center">
                    <Plus size={16} />
                  </span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
};

const MemoizedTasksTable = memo(TasksTable);
MemoizedTasksTable.displayName = 'TasksTable';

export { MemoizedTasksTable as TasksTable };
