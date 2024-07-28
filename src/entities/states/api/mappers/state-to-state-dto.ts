import { Timestamp } from 'firebase/firestore';

import { State } from '../../model/types/state.type';
import { StateDto } from '../dto/state.dto';

export const converterStateToStateDto = (state: State): StateDto => {
  return {
    id: state.id,
    date: Timestamp.fromDate(state.date),
    status: state.status,
    task_id: state.taskId,
  };
};
