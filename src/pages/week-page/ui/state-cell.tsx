import {
  ArrowRight,
  Plus,
  Square,
  SquareDashed,
  SquareDashedTopSolid,
  Trash2,
} from 'lucide-react';
import { useMemo } from 'react';

import { StateStatus } from '@/entities/states/model/constants/state-status';
import { State } from '@/entities/states/model/types/state.type';
import { cn } from '@/shared/lib';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  TableCell,
} from '@/shared/ui';

import { useStateCell } from '../lib/use-state-cell';

interface Props {
  date: Date;
  state: State | null;
  taskId: string;
}

const MENU_ICON_SIZE = 16;

const getStateIcon = (status: StateStatus, size: number) => {
  switch (status) {
    case StateStatus.Empty:
      return <SquareDashed size={size} />;
    case StateStatus.FullDone:
      return <Square size={size} color="black" fill="black" />;
    case StateStatus.HalfDone:
      return <SquareDashedTopSolid size={size} color="black" />;
    case StateStatus.Delay:
      return <ArrowRight size={size} />;
    case StateStatus.Failed:
      return <Plus size={size} className="rotate-45" />;
  }
};

const getTableStateStyle = (status: StateStatus | null) => {
  switch (status) {
    case StateStatus.Empty:
      return 'border border-dashed';
    case StateStatus.FullDone:
      return 'border';
    case StateStatus.HalfDone:
      return 'border';
    case StateStatus.Delay:
      return 'border';
    case StateStatus.Failed:
      return 'border';
    default:
      return '';
  }
};

export const StateCell = ({ date, state, taskId }: Props) => {
  const { updateStatus } = useStateCell(date, state, taskId);

  const statusItems = useMemo(
    () => [
      {
        icon: getStateIcon(StateStatus.Empty, MENU_ICON_SIZE),
        label: 'Empty',
        onclick: () => updateStatus(StateStatus.Empty),
      },
      {
        icon: getStateIcon(StateStatus.FullDone, MENU_ICON_SIZE),
        label: 'Full done',
        onclick: () => updateStatus(StateStatus.FullDone),
      },
      {
        icon: getStateIcon(StateStatus.HalfDone, MENU_ICON_SIZE),
        label: 'Half done',
        onclick: () => updateStatus(StateStatus.HalfDone),
      },
      {
        icon: getStateIcon(StateStatus.Delay, MENU_ICON_SIZE),
        label: 'Delay',
        onclick: () => updateStatus(StateStatus.Delay),
      },
      {
        icon: getStateIcon(StateStatus.Failed, MENU_ICON_SIZE),
        label: 'Failed',
        onclick: () => updateStatus(StateStatus.Failed),
      },
      ...(state
        ? [
            {
              icon: (
                <Trash2 size={MENU_ICON_SIZE} className="text-destructive" />
              ),
              label: 'Delete',
              danger: true,
              onclick: () => updateStatus(StateStatus.Empty),
            },
          ]
        : []),
    ],
    [state],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TableCell
          // className={`cursor-pointer ${state ? 'border-2' : 'border border-dashed'}`}
          className={cn(
            'h-state w-state cursor-pointer',
            getTableStateStyle(state?.status ?? null),
          )}
        />
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
                danger={item.danger}
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
