import { supabase } from '@/shared/config';

import { TaskDto } from './dto/task.dto';

type TaskDtoWithoutId = Omit<TaskDto, 'id'>;

export class TasksService {
  public static async getTasksByUserIdYearWeek(
    userId: string,
    week: number,
    year: number,
  ): Promise<TaskDto[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('year', year)
      .eq('week', week)
      .order('order', { ascending: true });

    if (error) throw error;
    return data;
  }

  public static async createAndGetTask(
    taskDtoWithoutId: TaskDtoWithoutId,
  ): Promise<TaskDto> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskDtoWithoutId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  public static async updateTask(taskDto: TaskDto): Promise<TaskDto> {
    const { id, ...updates } = taskDto;
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  public static async deleteTask(
    taskId: string,
    userId: string,
  ): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId)
      .select('id')
      .single();

    if (error) throw error;
  }
}
