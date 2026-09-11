import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { LuEllipsis } from 'react-icons/lu';

import { Task } from '@/entities/tasks';
import { cn } from '@/shared/lib';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  TableCell,
} from '@/shared/ui';

import { useTaskCell } from '../lib/use-task-cell';

interface Props {
  task: Task;
  deleteTask: (taskId: string) => void;
  isDeletingTask: boolean;
}

export const TaskCell = ({ task, deleteTask, isDeletingTask }: Props) => {
  const {
    updateTaskTitle,
    isUpdatingTaskTitle,
    copyTaskToNextWeek,
    isCopyingTask,
  } = useTaskCell();
  const [isRenaming, setIsRenaming] = useState(false);
  const [displayTitle, setDisplayTitle] = useState(task.title);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const isFinishingRenameRef = useRef(false);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const isTaskActionInProgress =
    isUpdatingTaskTitle || isCopyingTask || isDeletingTask;

  useEffect(() => {
    if (!isRenaming) return;

    const focusFrame = requestAnimationFrame(() => {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    });

    return () => cancelAnimationFrame(focusFrame);
  }, [isRenaming]);

  useEffect(() => {
    setDisplayTitle(task.title);
  }, [task.title]);

  const startRenaming = () => {
    isFinishingRenameRef.current = false;
    setDraftTitle(displayTitle);
    setIsRenaming(true);
  };

  const finishRenaming = () => {
    if (isFinishingRenameRef.current) return;
    isFinishingRenameRef.current = true;

    const title = draftTitle.trim();
    setIsRenaming(false);

    if (!title || title === displayTitle) {
      setDraftTitle(displayTitle);
      return;
    }

    const previousTitle = displayTitle;

    setDisplayTitle(title);
    setDraftTitle(title);
    updateTaskTitle(
      { task, title },
      {
        onError: () => {
          setDisplayTitle(previousTitle);
          setDraftTitle(previousTitle);
        },
      },
    );
  };

  const handleRenameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      finishRenaming();
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      isFinishingRenameRef.current = true;
      setDraftTitle(displayTitle);
      setIsRenaming(false);
    }
  };

  return (
    <TableCell className={cn(isTaskActionInProgress && 'cursor-not-allowed')}>
      <div className="h-state group relative flex min-w-0 items-center">
        <div
          aria-hidden={isRenaming}
          className={cn(
            'flex min-w-0 flex-1 items-center gap-3 transition-opacity duration-200 ease-out motion-reduce:transition-none',
            isRenaming ? 'pointer-events-none opacity-0' : 'opacity-100',
          )}
        >
          <span
            className={cn(
              'type-task min-w-0 truncate transition-colors duration-200',
              isUpdatingTaskTitle && 'task-title-saving',
            )}
            aria-busy={isUpdatingTaskTitle}
          >
            {displayTitle}
          </span>
          <span
            aria-hidden="true"
            className="min-w-8 flex-1 border-t border-dashed border-rule-faint opacity-70 transition-[border-color,opacity] duration-200 ease-out group-hover:border-rule group-hover:opacity-100 motion-reduce:transition-none"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isTaskActionInProgress}
                className="pointer-events-none h-7 w-7 shrink-0 translate-x-1 rounded-none text-ink-faint opacity-0 transition-[color,opacity,transform] duration-200 ease-out hover:bg-transparent hover:text-ink-secondary focus-visible:pointer-events-auto focus-visible:translate-x-0 focus-visible:opacity-100 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 data-[state=open]:pointer-events-auto data-[state=open]:translate-x-0 data-[state=open]:opacity-100 motion-reduce:transform-none motion-reduce:transition-none"
                aria-label={`Actions for ${task.title}`}
              >
                <LuEllipsis
                  aria-hidden="true"
                  className="h-[17px] w-[17px]"
                  strokeWidth={1.25}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 rounded-none"
              onCloseAutoFocus={(event) => {
                if (!isRenaming) return;

                event.preventDefault();
                renameInputRef.current?.focus();
              }}
            >
              <DropdownMenuItem onSelect={startRenaming}>
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => copyTaskToNextWeek(task)}>
                Copy to next week
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem danger onSelect={() => deleteTask(task.id)}>
                Delete task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Input
          ref={renameInputRef}
          value={draftTitle}
          onChange={(event) => setDraftTitle(event.target.value)}
          onBlur={() => {
            if (isRenaming) finishRenaming();
          }}
          onKeyDown={handleRenameKeyDown}
          className={cn(
            'type-task absolute inset-x-0 top-0 z-10 h-full min-w-0 rounded-none border-x-0 border-b border-t-0 border-rule-faint bg-transparent p-0 transition-[border-color,opacity] duration-200 ease-out focus-visible:border-input focus-visible:ring-0 motion-reduce:transition-none',
            isRenaming
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0',
          )}
          aria-label="Rename task"
          aria-hidden={!isRenaming}
          tabIndex={isRenaming ? 0 : -1}
        />
      </div>
    </TableCell>
  );
};
