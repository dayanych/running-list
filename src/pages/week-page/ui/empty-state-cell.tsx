import { TableCell } from '@/shared/ui/shadcn/table';

interface Props {
  date: Date;
}

export const EmptyStateCell = ({ date }: Props) => {
  return (
    <TableCell
      className="cursor-pointer border border-dashed"
      key={date?.getDate()}
    >
      <div className="h-state w-state flex items-center justify-center text-gray-500" />
    </TableCell>
  );
};
