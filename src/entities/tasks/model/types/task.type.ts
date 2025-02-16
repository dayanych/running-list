import { State } from '@/entities/states/model/types/state.type';

export interface Task {
  id: string;
  title: string;
  userId: string;
  week: number;
  year: number;
  color: string;
  createdAt: Date;
}

export interface TaskWithStates extends Task {
  states: State[];
}
