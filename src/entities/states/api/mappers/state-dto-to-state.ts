import { parseISO } from 'date-fns';

import { State } from '../../model/types/state.type';
import { StateDto } from '../dto/state.dto';

/** Restores a state's calendar day as local midnight on the device */
export const converterStateDtoToState = (stateDto: StateDto): State => {
  return {
    id: stateDto.id,
    date: parseISO(stateDto.date_key),
    status: stateDto.status,
    taskId: stateDto.task_id,
    userId: stateDto.user_id,
  };
};
