import { useMemo } from 'react';
import {
  LuArrowRight,
  LuPlus,
  LuSquare,
  LuSquareDashed,
  LuSquareDashedBottom,
  LuTrash2,
} from 'react-icons/lu';

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

const getStateIcon = (status: StateStatus, size: number) => {
  switch (status) {
    case StateStatus.Empty:
      return <LuSquareDashed size={size} />;
    case StateStatus.FullDone:
      return <LuSquare size={size} color="black" fill="black" />;
    case StateStatus.HalfDone:
      return <LuSquareDashedBottom size={size} color="black" />;
    case StateStatus.Delay:
      return <LuArrowRight size={size} />;
    case StateStatus.Failed:
      return <LuPlus size={size} className="rotate-45" />;
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
            state ? 'bg-background' : '',
            getTableStateStyle(state?.status ?? null),
          )}
        >
          <div className="flex h-full w-full items-center justify-center">
            {/* TODO: Update loading state */}
            {state?.status ? getStateIcon(state.status, 30) : ''}
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
