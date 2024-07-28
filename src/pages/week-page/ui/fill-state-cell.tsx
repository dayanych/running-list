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
  state: State;
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

export const FillStateCell = ({ state }: Props) => {
  return (
    <DropdownMenu key={state.id}>
      <DropdownMenuTrigger asChild>
        <TableCell className="cursor-pointer border-2">
          <div className="h-state w-state flex items-center justify-center text-gray-500">
            {state.status}
          </div>
        </TableCell>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup key={state.id}>
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
