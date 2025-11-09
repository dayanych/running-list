import { LoaderCircle, Trash2 } from 'lucide-react';

import { Task } from '@/entities/tasks';
import { cn } from '@/shared/lib';
import { Button, EditableText, TableCell } from '@/shared/ui';

import { useTaskCell } from '../lib/use-task-cell';

interface Props {
  task: Task;
}

export const TaskCell = ({ task }: Props) => {
  const { updateTaskTitle, isUpdatingTaskTitle } = useTaskCell();

  return (
    <TableCell
      className={cn(
        'cursor-pointer',
        isUpdatingTaskTitle && 'cursor-not-allowed',
      )}
    >
      <div className="group flex items-center gap-2">
        <EditableText
          value={task.title}
          onChangeFinish={(title) => {
            updateTaskTitle({ task, title });
          }}
          disabled={isUpdatingTaskTitle}
          className="cursor-pointerp-0 align-middle font-light"
        />
        <Button
          variant="ghost"
          disabled={isUpdatingTaskTitle}
          className={cn(
            'transition-opacity',
            isUpdatingTaskTitle
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100',
          )}
        >
          {isUpdatingTaskTitle ? (
            <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Trash2 size={15} className="text-destructive" />
          )}
        </Button>
      </div>
    </TableCell>
  );
};
