import { forwardRef } from 'react';
import { LuPlus } from 'react-icons/lu';

import { Button, Input } from '@/shared/ui';

import { useCreateTaskInput } from '../lib/use-create-task-input';

export const CreateTaskInput = forwardRef<HTMLInputElement>((_, ref) => {
  const { taskTitle, isLoading, onSubmit, handleTaskTitleChange } =
    useCreateTaskInput();

  return (
    <form
      onSubmit={onSubmit}
      className="relative flex max-w-[400px] gap-2"
      aria-busy={isLoading}
    >
      <Input
        ref={ref}
        name="taskTitle"
        placeholder="Add new task..."
        value={taskTitle}
        onChange={handleTaskTitleChange}
        disabled={isLoading}
        className="h-12 rounded-none pr-12 transition-colors duration-200 hover:border-primary focus:border-primary disabled:hover:border-input"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={isLoading}
        className="absolute right-0 h-full w-12 text-muted-foreground transition-opacity hover:bg-transparent"
      >
        <LuPlus className="h-4 w-4" />
      </Button>
    </form>
  );
});

CreateTaskInput.displayName = 'CreateTaskInput';
