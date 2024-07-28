import { Timestamp } from 'firebase/firestore';

import { State } from '../../model/types/state.type';
import { StateDto } from '../dto/state.dto';

export const converterStateDtoToState = (stateDto: StateDto): State => {
  const timestamp = new Timestamp(
    stateDto.date.seconds,
    stateDto.date.nanoseconds,
  );

  return {
    id: stateDto.id,
    date: timestamp.toDate(),
    status: stateDto.status,
    taskId: stateDto.task_id,
  };
};
