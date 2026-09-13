import { forwardRef } from 'react';
import { LuPlus } from 'react-icons/lu';

import { settingsConfig } from '@/shared/config/settings.config';
import {
  Button,
  Input,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui';

import { useCreateTaskInput } from '../lib/use-create-task-input';

interface Props {
  isTaskLimitReached?: boolean;
}

const TOOLTIP_DELAY_MS = 200;

export const CreateTaskInput = forwardRef<HTMLInputElement, Props>(
  ({ isTaskLimitReached = false }, ref) => {
    const {
      taskTitle,
      isLoading,
      isLimitTooltipOpen,
      onSubmit,
      handleTaskTitleChange,
      handleLimitTooltipOpenChange,
    } = useCreateTaskInput(isTaskLimitReached);

    const isDisabled = isLoading || isTaskLimitReached;

    return (
      <Tooltip
        open={isLimitTooltipOpen}
        onOpenChange={handleLimitTooltipOpenChange}
        delayDuration={TOOLTIP_DELAY_MS}
      >
        {/* A disabled input fires no pointer events, so the tooltip hangs on
            the wrapper. The wrapper also takes focus once the limit is
            reached, keeping the explanation reachable from the keyboard */}
        <TooltipTrigger asChild>
          <div
            className="max-w-[400px]"
            tabIndex={isTaskLimitReached ? 0 : undefined}
          >
            <form
              onSubmit={onSubmit}
              className="relative flex gap-2"
              aria-busy={isLoading}
            >
              <Input
                ref={ref}
                name="taskTitle"
                placeholder="Add new task..."
                value={taskTitle}
                onChange={handleTaskTitleChange}
                disabled={isDisabled}
                className="h-12 rounded-none pr-12 transition-colors duration-200 hover:border-primary focus:border-primary disabled:hover:border-input"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                disabled={isDisabled}
                className="absolute right-0 h-full w-12 text-muted-foreground transition-opacity hover:bg-transparent"
              >
                <LuPlus className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </TooltipTrigger>
        <TooltipContent align="start">
          You can create up to {settingsConfig.maxTasksPerWeek} tasks per week
        </TooltipContent>
      </Tooltip>
    );
  },
);

CreateTaskInput.displayName = 'CreateTaskInput';
