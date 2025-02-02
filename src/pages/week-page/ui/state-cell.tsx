import { Plus, Square, Trash2 } from 'lucide-react';

import { State } from '@/entities/states/model/types/state.type';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu';
import { TableCell } from '@/shared/ui/shadcn/table';

interface Props {
  state: State | null;
  date: Date;
}

const size = 16;

const statusItems = [
  {
    icon: <Square size={size} />,
    label: 'Empty',
    onclick: () => {},
  },
  {
    icon: <Square size={size} color="green" />,
    label: 'Full done',
    onclick: () => {},
  },
  {
    icon: <Square size={size} color="blue" />,
    label: 'Half done',
    onclick: () => {},
  },
  {
    icon: <Square size={size} color="orange" />,
    label: 'Delay',
    onclick: () => {},
  },
  {
    icon: <Plus size={size} className="rotate-45" />,
    label: 'Failed',
    onclick: () => {},
  },
  {
    icon: <Trash2 size={size} className="text-destructive" />,
    label: 'Delete',
    onclick: () => {},
  },
];

export const StateCell = ({ state }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TableCell
          className={`cursor-pointer ${state ? 'border-2' : 'border border-dashed'}`}
        >
          <div className="h-state w-state flex items-center justify-center text-gray-500">
            {state ? state.status : ''}
          </div>
        </TableCell>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {statusItems.map((item, index) => (
            <>
              {index === statusItems.length - 1 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                key={item.label}
                onClick={item.onclick}
                className="cursor-pointer"
              >
                <div className="mr-2">{item.icon}</div>
                <span>{item.label}</span>
              </DropdownMenuItem>
            </>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
