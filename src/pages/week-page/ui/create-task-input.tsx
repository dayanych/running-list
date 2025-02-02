import { Plus } from 'lucide-react';

import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';

import { useCreateTaskInput } from '../lib/use-create-task-input';

export const CreateTaskInput = () => {
  const { taskTitle, onSubmit, handleTaskTitleChange } = useCreateTaskInput();

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        placeholder="Add new habit..."
        value={taskTitle}
        onChange={handleTaskTitleChange}
      />
      <Button type="submit" size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
};
