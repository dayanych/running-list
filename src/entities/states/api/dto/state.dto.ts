import { Timestamp } from 'firebase/firestore';

export type StateDto = {
  id: string;
  date: Timestamp;
  status: number;
  task_id: string;
};
