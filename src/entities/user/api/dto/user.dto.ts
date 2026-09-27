import type { Database } from '@/shared/config/database.types';

export type UserDto = Database['public']['Tables']['users']['Row'];
