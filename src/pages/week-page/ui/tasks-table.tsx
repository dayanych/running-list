import { flexRender } from '@tanstack/react-table';
import { memo, useEffect, useMemo, useState } from 'react';
import React from 'react';

import { State } from '@/entities/states/model/types/state.type';
import { Task } from '@/entities/tasks/model/types/task.type';
import { cn } from '@/shared/lib';
import {
  EmptyDescription,
  EmptyTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui';

import { getEmptyStateMessage, useTasksTable } from '../lib';
import type { WeekTransitionDirection } from '../lib/use-week-page';

export interface TaskWithStates extends Task {
  states: State[];
}

interface Props {
  data: TaskWithStates[];
  startWeekDate: Date;
  transitionDirection: WeekTransitionDirection;
  loading?: boolean;
  error?: boolean;
}

const SKELETON_TASK_WIDTHS = ['42%', '58%', '36%', '51%', '45%'];
const SKELETON_TRANSITION_MS = 320;

const TasksTable = ({
  data,
  startWeekDate,
  transitionDirection,
  loading,
  error,
}: Props) => {
  const { columns, table } = useTasksTable(data, startWeekDate);
  const weekStartTimestamp = startWeekDate.getTime();
  const emptyStateMessage = useMemo(
    () => getEmptyStateMessage(),
    [weekStartTimestamp],
  );
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(
    Boolean(loading),
  );
  const [isLoadingOverlayVisible, setIsLoadingOverlayVisible] = useState(
    Boolean(loading),
  );

  useEffect(() => {
    let visibilityFrame = 0;
    let hideTimer = 0;

    if (loading) {
      setShowLoadingOverlay(true);
      visibilityFrame = requestAnimationFrame(() => {
        setIsLoadingOverlayVisible(true);
      });
    } else {
      setIsLoadingOverlayVisible(false);
      hideTimer = window.setTimeout(() => {
        setShowLoadingOverlay(false);
      }, SKELETON_TRANSITION_MS);
    }

    return () => {
      cancelAnimationFrame(visibilityFrame);
      window.clearTimeout(hideTimer);
    };
  }, [loading]);

  return (
    <div
      className={cn(
        'relative',
        transitionDirection === 'forward' && 'week-content-enter-forward',
        transitionDirection === 'backward' && 'week-content-enter-backward',
      )}
    >
      <Table aria-busy={loading}>
        <TableHeader className="bg-background [&_tr]:border-rule">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isTaskColumn = header.column.id === 'taskList';

                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'type-eyebrow h-12 p-0 text-ink-muted',
                      isTaskColumn && 'w-full text-left',
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
          {error && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                <div className="flex w-full flex-col items-center justify-center gap-4 py-8">
                  <span className="type-help text-destructive">
                    Oops! Something went wrong. Try again in a few seconds.
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}
          {!loading && !error && table.getRowModel().rows?.length === 0 && (
            <TableRow className="border-rule hover:bg-transparent">
              <TableCell className="h-64 align-top">
                <div className="flex max-w-md flex-col items-start gap-2 pt-20 text-left">
                  <EmptyTitle>Nothing here yet</EmptyTitle>
                  <EmptyDescription>{emptyStateMessage}</EmptyDescription>
                </div>
              </TableCell>
              {table
                .getAllLeafColumns()
                .slice(1)
                .map((column) => (
                  <TableCell
                    key={column.id}
                    aria-hidden="true"
                    className="h-64"
                  />
                ))}
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

      {showLoadingOverlay && (
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-0 top-12 z-10 bg-background pt-4 transition-opacity ease-out motion-reduce:transition-none',
            isLoadingOverlayVisible ? 'opacity-100' : 'opacity-0',
          )}
          style={{ transitionDuration: `${SKELETON_TRANSITION_MS}ms` }}
        >
          {SKELETON_TASK_WIDTHS.map((width) => (
            <div
              key={width}
              className="h-state grid items-center"
              style={{
                gridTemplateColumns:
                  'minmax(0, 1fr) repeat(7, var(--state-block-width))',
              }}
            >
              <div className="flex min-w-0 items-center gap-3 pr-3">
                <span
                  className="skeleton-soft h-4 shrink-0 bg-rule"
                  style={{ width }}
                />
                <span className="flex-1 border-t border-dashed border-rule-faint opacity-50" />
              </div>
              {Array.from({ length: 7 }, (_, columnIndex) => (
                <div
                  key={columnIndex}
                  className="h-state w-state flex items-center justify-center"
                >
                  <span className="skeleton-soft h-6 w-6 bg-rule-faint" />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MemoizedTasksTable = memo(TasksTable);

export { MemoizedTasksTable as TasksTable };
