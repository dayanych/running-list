import type { Database } from '@/shared/config/database.types';

export type TaskDto = Database['public']['Tables']['tasks']['Row'];
