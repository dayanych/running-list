import { Task } from '../../model/types/task.type';
import { TaskDto } from '../dto/task.dto';

export const converterTaskDtoToTask = (taskDto: TaskDto): Task => {
  return {
    id: taskDto.id,
    title: taskDto.title,
    week: taskDto.week,
    year: taskDto.year,
    color: taskDto.color,
    userId: taskDto.user_id,
    createdAt: taskDto.created_at.toDate(),
  };
};
