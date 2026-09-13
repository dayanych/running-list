import { Timestamp } from 'firebase/firestore';

export type TaskDto = {
  id: string;
  title: string;
  user_id: string;
  week: number;
  year: number;
  color: string;
  order: number;
  created_at: Timestamp;
};
