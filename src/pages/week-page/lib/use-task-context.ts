import { useContext } from 'react';

import { TaskContext } from '../model/task-context';

export const useTaskContext = () => {
  const task = useContext(TaskContext);

  if (!task) {
    throw new Error('TaskContext is not provided');
  }

  return task.id;
};
