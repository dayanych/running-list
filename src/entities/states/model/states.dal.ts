import { Timestamp } from 'firebase/firestore';

import { converterStateDtoToState } from '../api/mappers/state-dto-to-state';
import { converterStateToStateDto } from '../api/mappers/state-to-state-dto';
import { StatesService } from '../api/states.service';
import { State } from './types/state.type';

export type StateWithoutId = Omit<State, 'id'>;

export class StatesDal {
  public static async getStatesByTaskId(taskId: string): Promise<State[]> {
    const statesDto = await StatesService.getStatesByTaskId(taskId);

    const states = statesDto.map((stateDto) =>
      converterStateDtoToState(stateDto),
    );

    return states;
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

  public static async updateState(state: State) {
    const stateDto = converterStateToStateDto(state);

    await StatesService.updateState(stateDto);
  }

  public static async deleteState(stateId: string) {
    await StatesService.deleteState(stateId);
  }
}
