import { flexRender } from '@tanstack/react-table';
import { memo } from 'react';
import React from 'react';
import { LuLoaderCircle } from 'react-icons/lu';

import { State } from '@/entities/states/model/types/state.type';
import { Task } from '@/entities/tasks/model/types/task.type';
import { cn } from '@/shared/lib';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui';

import { getEmptyStateMessage, useTasksTable } from '../lib';

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
    <Table className="text-lg">
      <TableHeader className="border">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header, headerIndex) => {
              const isLastChild =
                headerIndex === headerGroup.headers.length - 1;

              return (
                <TableHead
                  key={header.id}
                  className={cn(
                    'h-12 p-0',
                    isLastChild && 'w-full text-center',
                    'text-sm font-light',
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
      <TableBody className="border-none">
        {loading && (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              <div className="flex h-full w-full items-center justify-center">
                <LuLoaderCircle className="h-14 w-14 animate-spin text-primary" />
              </div>
            </TableCell>
          </TableRow>
        )}
        {error && (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              <div className="flex w-full flex-col items-center justify-center gap-4 py-8">
                <span className="font-light text-destructive">
                  Oops! Something went wrong. Try again in a few seconds.
                </span>
              </div>
            </TableCell>
          </TableRow>
        )}
        {!loading && !error && table.getRowModel().rows?.length === 0 && (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              <p className="w-full py-8 font-light text-muted-foreground">
                {getEmptyStateMessage()}
              </p>
            </TableCell>
          </TableRow>
        )}
        {table.getRowModel().rows?.length > 0 &&
          table.getRowModel().rows.map((row, index) => (
            <React.Fragment key={row.id}>
              {index === 0 && (
                <TableRow className="border-b-0">
                  <TableCell colSpan={columns.length} className="h-4" />
                </TableRow>
              )}
              <TableRow
                data-state={row.getIsSelected() && 'selected'}
                className="border-b-0"
              >
                {row
                  .getVisibleCells()
                  .map((cell) =>
                    flexRender(cell.column.columnDef.cell, cell.getContext()),
                  )}
              </TableRow>
            </React.Fragment>
          ))}
      </TableBody>
    </Table>
  );
};

const MemoizedTasksTable = memo(TasksTable);

export { MemoizedTasksTable as TasksTable };
