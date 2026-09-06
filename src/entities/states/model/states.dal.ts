import { Timestamp } from 'firebase/firestore';

import { converterStateDtoToState } from '../api/mappers/state-dto-to-state';
import { converterStateToStateDto } from '../api/mappers/state-to-state-dto';
import { StatesService } from '../api/states.service';
import { State } from './types/state.type';

export type StateWithoutId = Omit<State, 'id'>;

export class StatesDal {
  /**
   * Loads states for several tasks in a single batched request
   *
   * @param taskIds - Ids of the tasks whose states are needed
   * @returns Flat list of states belonging to any of the given tasks
   */
  public static async getStatesByTaskIds(taskIds: string[]): Promise<State[]> {
    const statesDto = await StatesService.getStatesByTaskIds(taskIds);

    return statesDto.map((stateDto) => converterStateDtoToState(stateDto));
  }

  public static async createState(state: StateWithoutId): Promise<State> {
    const stateDtoWithoutId = {
      date: Timestamp.fromDate(state.date),
      status: state.status,
      task_id: state.taskId,
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
