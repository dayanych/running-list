import { Plus, Square, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

import { StateStatus } from '@/entities/states/model/constants/state-status';
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

import { useStateCell } from '../lib/use-state-cell';

interface Props {
  date: Date;
  state: State | null;
  taskId: string;
}

const size = 16;

export const StateCell = ({ state, taskId }: Props) => {
  const { updateStatus } = useStateCell(state, taskId);

  const statusItems = useMemo(
    () => [
      {
        icon: <Square size={size} />,
        label: 'Empty',
        onclick: () => updateStatus(StateStatus.Empty),
      },
      {
        icon: <Square size={size} color="green" />,
        label: 'Full done',
        onclick: () => updateStatus(StateStatus.FullDone),
      },
      {
        icon: <Square size={size} color="blue" />,
        label: 'Half done',
        onclick: () => updateStatus(StateStatus.HalfDone),
      },
      {
        icon: <Square size={size} color="orange" />,
        label: 'Delay',
        onclick: () => updateStatus(StateStatus.Delay),
      },
      {
        icon: <Plus size={size} className="rotate-45" />,
        label: 'Failed',
        onclick: () => updateStatus(StateStatus.Failed),
      },
      ...(state
        ? [
            {
              icon: <Trash2 size={size} className="text-destructive" />,
              label: 'Delete',
              onclick: () => updateStatus(StateStatus.Empty),
            },
          ]
        : []),
    ],
    [],
  );

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
              {index === statusItems.length - 1 && state && (
                <DropdownMenuSeparator />
              )}
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
