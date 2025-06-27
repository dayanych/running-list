import { Plus } from 'lucide-react';

import { Button, Input } from '@/shared/ui';

import { useCreateTaskInput } from '../lib/use-create-task-input';

export const CreateTaskInput = () => {
  const { taskTitle, isLoading, onSubmit, handleTaskTitleChange } =
    useCreateTaskInput();

  return (
    <form onSubmit={onSubmit} className="relative flex max-w-[400px] gap-2">
      <Input
        name="taskTitle"
        placeholder="Add new task..."
        value={taskTitle}
        onChange={handleTaskTitleChange}
        disabled={isLoading}
        className="h-12 rounded-none pr-12"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={isLoading}
        className="absolute right-0 h-full w-12 text-muted-foreground hover:bg-transparent"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
};
