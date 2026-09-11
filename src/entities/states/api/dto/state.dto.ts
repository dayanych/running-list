import { Timestamp } from 'firebase/firestore';

export type StateDto = {
  id: string;
  /** Still written for tabs running the old version; the app reads `date_key` */
  date: Timestamp;
  /** Calendar day independent of the device timezone, in `yyyy-MM-dd` form */
  date_key: string;
  status: number;
  task_id: string;
  user_id: string;
};
