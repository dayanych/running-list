import type { Database } from '@/shared/config/database.types';

/** Database row whose `date_key` is a timezone-independent calendar day */
export type StateDto = Database['public']['Tables']['states']['Row'];
