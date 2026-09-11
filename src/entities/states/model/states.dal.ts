import { Timestamp } from 'firebase/firestore';

import { getEndOfAppWeek, getStartDateOfAppWeek } from '@/shared/lib/week';

import { converterStateDtoToState } from '../api/mappers/state-dto-to-state';
import { converterStateToStateDto } from '../api/mappers/state-to-state-dto';
import { StatesService } from '../api/states.service';
import { toDateKey } from '../lib/date-key';
import { State } from './types/state.type';

export type StateWithoutId = Omit<State, 'id'>;

export class StatesDal {
  /**
   * Loads a user's states for one app week with a single query
   *
   * @param userId - Owner of the states
   * @param year - Week-numbering year of the week
   * @param week - App week number
   * @returns States of the user dated within that week
   */
  public static async getStatesByUserIdYearWeek(
    userId: string,
    year: number,
    week: number,
  ): Promise<State[]> {
    const startDate = getStartDateOfAppWeek(week, year);
    const statesDto = await StatesService.getStatesByUserIdDateRange(
      userId,
      toDateKey(startDate),
      toDateKey(getEndOfAppWeek(startDate)),
    );

    return statesDto.map((stateDto) => converterStateDtoToState(stateDto));
  }

  public static async createState(state: StateWithoutId): Promise<State> {
    const stateDtoWithoutId = {
      date: Timestamp.fromDate(state.date),
      date_key: toDateKey(state.date),
      status: state.status,
      task_id: state.taskId,
      user_id: state.userId,
    };

    const stateDto = await StatesService.createAndGetState(stateDtoWithoutId);

    return converterStateDtoToState(stateDto);
  }

  public static async updateState(state: State): Promise<State> {
    const stateDto = converterStateToStateDto(state);
    await StatesService.updateState(stateDto);

    const updatedState = await StatesService.getStateById(state.id);

    return converterStateDtoToState(updatedState);
  }

  public static async deleteState(stateId: string): Promise<void> {
    await StatesService.deleteState(stateId);
  }
}
