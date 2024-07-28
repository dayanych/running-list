import { Task } from '../../model/types/task.type';
import { TaskDto } from '../dto/task.dto';

export const convertedTaskToTaskDto = (task: Task): TaskDto => {
  return {
    id: task.id,
    title: task.title,
    week: task.week,
    year: task.year,
    color: task.color,
    user_id: task.userId,
    created_at: task.createdAt,
  };
};
