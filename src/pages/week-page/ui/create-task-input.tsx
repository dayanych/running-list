import { Plus } from 'lucide-react';

import { Button, Input } from '@/shared/ui';

import { useCreateTaskInput } from '../lib/use-create-task-input';

export const CreateTaskInput = () => {
  const { taskTitle, isLoading, onSubmit, handleTaskTitleChange } =
    useCreateTaskInput();

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        placeholder="Add new task..."
        value={taskTitle}
        onChange={handleTaskTitleChange}
        disabled={isLoading}
      />
      <Button type="submit" size="icon" disabled={isLoading}>
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
};
