import { useMemo } from 'react';
import { LuTrash2 } from 'react-icons/lu';

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
  isLoading?: boolean;
}

const MENU_ICON_SIZE = 16;

const STATE_ICON_SRC: Record<StateStatus, string> = {
  [StateStatus.Empty]: '/icons/todo.svg',
  [StateStatus.FullDone]: '/icons/finished.svg',
  [StateStatus.HalfDone]: '/icons/started.svg',
  [StateStatus.Delay]: '/icons/moved.svg',
  [StateStatus.Failed]: '/icons/cancelled.svg',
};

const getStateIcon = (status: StateStatus, size: number) => (
  <img
    src={STATE_ICON_SRC[status]}
    width={size}
    height={size}
    alt=""
    aria-hidden="true"
  />
);

export const StateCell = ({ date, state, taskId, isLoading }: Props) => {
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
              icon: <LuTrash2 size={MENU_ICON_SIZE} className="text-inherit" />,
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
      <DropdownMenuTrigger
        asChild
        disabled={isLoading}
        className={cn(isLoading && 'cursor-not-allowed')}
      >
        <TableCell
          className={cn(
            'h-state w-state relative cursor-pointer',
            state && 'bg-background',
          )}
        >
          <div className="flex h-full w-full items-center justify-center">
            {/* TODO: Update loading state */}
            {state ? getStateIcon(state.status, 39) : null}
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
