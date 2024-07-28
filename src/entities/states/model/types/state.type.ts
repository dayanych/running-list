import { StateStatus } from '../constants/state-status';

export interface State {
  id: string;
  date: Date;
  status: StateStatus;
  taskId: string;
}
