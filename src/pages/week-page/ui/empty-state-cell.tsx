import { TableCell } from '@/shared/ui/shadcn/table';

import { useEmptyStateCell } from '../lib/use-empty-state-cell';
import { useTaskContext } from '../lib/use-task-context';

interface Props {
  date: Date;
}

export const EmptyStateCell = ({ date }: Props) => {
  const taskId = useTaskContext();
  const { createEmptyStateCell } = useEmptyStateCell(taskId, date);

  return (
    <TableCell
      className="cursor-pointer border border-dashed"
      onClick={createEmptyStateCell}
      key={date?.getDate()}
    >
      <div className="h-state w-state flex items-center justify-center text-gray-500" />
    </TableCell>
  );
};
