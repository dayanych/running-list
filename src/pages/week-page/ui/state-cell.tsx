import { useEffect, useMemo, useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';

import { StateStatus } from '@/entities/states/model/constants/state-status';
import { State } from '@/entities/states/model/types/state.type';
import { cn } from '@/shared/lib';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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

const MENU_ICON_SIZE = 20;
const ICON_EXIT_DURATION_MS = 160;

const STATE_ICON_SRC: Record<StateStatus, string> = {
  [StateStatus.Empty]: '/icons/01-empty.svg',
  [StateStatus.FullDone]: '/icons/02-completed.svg',
  [StateStatus.HalfDone]: '/icons/03-half-done.svg',
  [StateStatus.Delay]: '/icons/04-moved.svg',
  [StateStatus.Failed]: '/icons/05-cancelled.svg',
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
  const status = state?.status ?? null;
  const [displayedStatus, setDisplayedStatus] = useState(status);

  if (status !== null && displayedStatus !== status) {
    setDisplayedStatus(status);
  }

  const isIconExiting = status === null && displayedStatus !== null;

  useEffect(() => {
    if (!isIconExiting) return;

    const isReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const hideTimer = window.setTimeout(
      () => setDisplayedStatus(null),
      isReducedMotion ? 0 : ICON_EXIT_DURATION_MS,
    );

    return () => window.clearTimeout(hideTimer);
  }, [isIconExiting]);

  const { updateStatus, deleteState, isStateMutationPending } = useStateCell(
    date,
    state,
    taskId,
  );
  const isDisabled = isLoading || isStateMutationPending;

  const statusItems = useMemo(
    () => [
      {
        status: StateStatus.Empty,
        icon: getStateIcon(StateStatus.Empty, MENU_ICON_SIZE),
        label: 'Empty',
        onclick: () => updateStatus(StateStatus.Empty),
      },
      {
        status: StateStatus.FullDone,
        icon: getStateIcon(StateStatus.FullDone, MENU_ICON_SIZE),
        label: 'Full done',
        onclick: () => updateStatus(StateStatus.FullDone),
      },
      {
        status: StateStatus.HalfDone,
        icon: getStateIcon(StateStatus.HalfDone, MENU_ICON_SIZE),
        label: 'Half done',
        onclick: () => updateStatus(StateStatus.HalfDone),
      },
      {
        status: StateStatus.Delay,
        icon: getStateIcon(StateStatus.Delay, MENU_ICON_SIZE),
        label: 'Delay',
        onclick: () => updateStatus(StateStatus.Delay),
      },
      {
        status: StateStatus.Failed,
        icon: getStateIcon(StateStatus.Failed, MENU_ICON_SIZE),
        label: 'Failed',
        onclick: () => updateStatus(StateStatus.Failed),
      },
    ],
    [updateStatus],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        disabled={isDisabled}
        className={cn(isDisabled && 'cursor-not-allowed')}
      >
        <TableCell
          className={cn(
            'h-state w-state group relative cursor-pointer focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring data-[state=open]:bg-accent',
            state && 'bg-background',
          )}
        >
          <div className="flex h-full w-full items-center justify-center">
            {/* TODO: Update loading state */}
            {displayedStatus !== null ? (
              <span
                key={displayedStatus}
                className={cn(
                  'flex items-center justify-center',
                  isIconExiting ? 'state-icon-exit' : 'state-icon-enter',
                )}
              >
                {getStateIcon(displayedStatus, 39)}
              </span>
            ) : (
              <span className="state-dot-enter flex items-center justify-center">
                <span
                  aria-hidden="true"
                  className="h-[3px] w-[3px] rounded-full bg-anchor opacity-[0.35] transition-[opacity,transform] duration-200 ease-out group-hover:scale-110 group-hover:opacity-70 motion-reduce:transform-none motion-reduce:transition-none"
                />
              </span>
            )}
          </div>
        </TableCell>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        collisionPadding={12}
        className="w-44 max-w-[calc(100vw-24px)] rounded-none border-border p-1 shadow-lg motion-reduce:animate-none"
        aria-label="Task state"
      >
        <DropdownMenuRadioGroup value={state ? String(state.status) : ''}>
          {statusItems.map((item) => (
            <DropdownMenuRadioItem
              key={item.status}
              value={String(item.status)}
              onSelect={item.onclick}
              disabled={isDisabled}
              className="h-9 cursor-pointer gap-2 rounded-none px-2 py-1.5 text-ink-secondary focus:bg-accent focus:text-foreground data-[highlighted]:bg-accent data-[state=checked]:bg-accent data-[state=checked]:text-foreground motion-reduce:transition-none [&>span]:hidden"
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                {item.icon}
              </div>
              {item.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        {state && (
          <>
            <DropdownMenuSeparator className="mx-2 my-1 bg-border" />
            <DropdownMenuItem
              onSelect={deleteState}
              disabled={isDisabled}
              danger
              className="h-9 gap-2 rounded-none px-2 py-1.5 data-[highlighted]:bg-destructive-wash data-[highlighted]:text-destructive motion-reduce:transition-none"
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                <LuTrash2 size={16} strokeWidth={1.5} aria-hidden="true" />
              </div>
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
