import type { StateStatusValue } from '@/shared/config/database.types';

export const StateStatus = {
  Empty: 'empty',
  Completed: 'completed',
  PartiallyCompleted: 'partially_completed',
  Delayed: 'delayed',
  Failed: 'failed',
} as const satisfies Record<string, StateStatusValue>;

export type StateStatus = (typeof StateStatus)[keyof typeof StateStatus];
