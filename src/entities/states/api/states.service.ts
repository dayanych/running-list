import { supabase } from '@/shared/config';

import { StateDto } from './dto/state.dto';

type StateDtoWithoutId = Omit<StateDto, 'id'>;

export class StatesService {
  /**
   * Loads a user's states whose calendar day falls within a range
   *
   * @param userId - Owner of the states
   * @param fromDateKey - First day, inclusive, in `yyyy-MM-dd` form
   * @param toDateKey - Last day, inclusive, in `yyyy-MM-dd` form
   * @returns States of the user within the range
   */
  public static async getStatesByUserIdDateRange(
    userId: string,
    fromDateKey: string,
    toDateKey: string,
  ): Promise<StateDto[]> {
    const { data, error } = await supabase
      .from('states')
      .select('*')
      .eq('user_id', userId)
      .gte('date_key', fromDateKey)
      .lte('date_key', toDateKey);

    if (error) throw error;
    return data;
  }

  public static async createAndGetState(
    stateWithoutIdDto: StateDtoWithoutId,
  ): Promise<StateDto> {
    const { data, error } = await supabase
      .from('states')
      .insert(stateWithoutIdDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  public static async updateState(stateDto: StateDto): Promise<StateDto> {
    const { id, ...updates } = stateDto;
    const { data, error } = await supabase
      .from('states')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  public static async deleteState(stateId: string): Promise<void> {
    const { error } = await supabase
      .from('states')
      .delete()
      .eq('id', stateId)
      .select('id')
      .single();

    if (error) throw error;
  }
}
