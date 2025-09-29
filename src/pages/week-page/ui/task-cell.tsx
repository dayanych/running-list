import { Trash2 } from 'lucide-react';

import { Task } from '@/entities/tasks';
import { Button, EditableText, TableCell } from '@/shared/ui';

import { useTaskCell } from '../lib/use-task-cell';

interface Props {
  task: Task;
}

export const TaskCell = ({ task }: Props) => {
  const { updateTaskTitle, isUpdatingTaskTitle } = useTaskCell();

  return (
    <TableCell className="cursor-pointer">
      <div className="group flex items-center gap-2">
        <EditableText
          title={task.title}
          onChangeFinish={(title) => {
            updateTaskTitle({ task, title });
          }}
          isLoading={isUpdatingTaskTitle}
          className="cursor-pointerp-0 align-middle font-light"
        />
        <Button
          variant="ghost"
          className="opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Trash2 size={15} className="text-destructive" />
        </Button>
      </div>
    </TableCell>
  );
};
