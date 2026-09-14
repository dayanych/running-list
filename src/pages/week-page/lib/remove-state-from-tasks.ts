import type { TaskWithStates } from '@/entities/tasks/model/types/task.type';

/**
 * Removes one state from one task in cached week data
 *
 * @param tasks - Cached tasks for the displayed week
 * @param taskId - Task that owns the deleted state
 * @param stateId - Deleted state identifier
 * @returns Updated task data, or undefined when the cache is empty
 */
export const removeStateFromTasks = (
  tasks: TaskWithStates[] | undefined,
  taskId: string,
  stateId: string,
): TaskWithStates[] | undefined => {
  if (!tasks) return tasks;

  return tasks.map((task) =>
    task.id === taskId
      ? { ...task, states: task.states.filter(({ id }) => id !== stateId) }
      : task,
  );
};
