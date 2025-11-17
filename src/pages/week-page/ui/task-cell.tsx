import { LoaderCircle, Trash2 } from 'lucide-react';

import { Task } from '@/entities/tasks';
import { cn } from '@/shared/lib';
import { Button, EditableText, TableCell } from '@/shared/ui';

import { useTaskCell } from '../lib/use-task-cell';

interface Props {
  task: Task;
  deleteTask: (taskId: string) => void;
  isDeletingTask: boolean;
}

export const TaskCell = ({ task, deleteTask, isDeletingTask }: Props) => {
  const { updateTaskTitle, isUpdatingTaskTitle } = useTaskCell();
  const isTaskActionInProgress = isUpdatingTaskTitle || isDeletingTask;

  return (
    <TableCell
      className={cn(
        'cursor-pointer',
        isTaskActionInProgress && 'cursor-not-allowed',
      )}
    >
      <div className="group flex items-center gap-2">
        <EditableText
          value={task.title}
          onChangeFinish={(title) => {
            updateTaskTitle({ task, title });
          }}
          disabled={isTaskActionInProgress}
          className="cursor-pointerp-0 align-middle font-light"
        />
        <Button
          variant="ghost"
          disabled={isTaskActionInProgress}
          onClick={(event) => {
            event.stopPropagation();
            deleteTask(task.id);
          }}
          className={cn(
            'transition-opacity',
            isTaskActionInProgress
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100',
          )}
        >
          {isTaskActionInProgress ? (
            <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Trash2 size={15} className="text-destructive" />
          )}
        </Button>
      </div>
    </TableCell>
  );
};
