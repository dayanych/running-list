/**
 * Finds the order for a task appended to the current week
 *
 * @param tasks - Existing tasks from the same user week
 * @returns Zero for an empty week or one more than its greatest order
 */
export const getNextTaskOrder = (
  tasks: ReadonlyArray<{ order: number }>,
): number => {
  return tasks.reduce(
    (nextOrder, task) => Math.max(nextOrder, task.order + 1),
    0,
  );
};
