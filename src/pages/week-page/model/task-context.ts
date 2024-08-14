import { createContext } from 'react';

import { Task } from '@/entities/tasks/model/types/task.type';

export const TaskContext = createContext<Task | null>(null);
