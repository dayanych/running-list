export type StateStatusValue =
  | 'empty'
  | 'completed'
  | 'partially_completed'
  | 'delayed'
  | 'failed';

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          email: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          user_id: string;
          week: number;
          year: number;
          color: string;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          user_id: string;
          week: number;
          year: number;
          color: string;
          order: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          user_id?: string;
          week?: number;
          year?: number;
          color?: string;
          order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      states: {
        Row: {
          id: string;
          date: string;
          date_key: string;
          status: StateStatusValue;
          task_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          date: string;
          date_key: string;
          status: StateStatusValue;
          task_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          date?: string;
          date_key?: string;
          status?: StateStatusValue;
          task_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { state_status: StateStatusValue };
    CompositeTypes: { [_ in never]: never };
  };
};
