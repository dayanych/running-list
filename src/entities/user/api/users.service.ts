import { supabase } from '@/shared/config';

import { UserDto } from './dto/user.dto';

export class UsersService {
  public static async getUser(id: string): Promise<UserDto | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  public static async createUser(userDto: UserDto): Promise<void> {
    const { error } = await supabase.from('users').insert(userDto);

    if (error) throw error;
  }

  public static async updateUser(userDto: UserDto): Promise<void> {
    const { id, ...updates } = userDto;
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select('id')
      .single();

    if (error) throw error;
  }
}
