import { useQuery } from '@tanstack/react-query';

import { StatesDal } from '@/entities/states';
import { TasksDal } from '@/entities/tasks';

export const useTasksQuery = (userId: string, year: number, week: number) => {
  return useQuery({
    queryKey: ['getTasks', userId, year, week],
    queryFn: async () => {
      const tasks = await TasksDal.getTasksByUserIdYearWeek(userId, year, week);
      const tasksWithStates = tasks.map(async (task) => {
        const taskId = task.id;
        const states = await StatesDal.getStatesByTaskId(taskId);

        return { ...task, states };
      });

      return Promise.all(tasksWithStates);
    },
  });
};
