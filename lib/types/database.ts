export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          email: string | null;
          role: "user" | "admin";
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          email?: string | null;
          role?: "user" | "admin";
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          email?: string | null;
          role?: "user" | "admin";
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      diagnostic_tools: {
        Row: {
          id: string;
          slug: string;
          name: string;
          name_en: string | null;
          description: string | null;
          icon: string | null;
          questions: Json;
          scale_type: string;
          scale_options: Json;
          category_map: Json;
          reverse_items: Json;
          max_scale: number | null;
          interpretations: Json;
          chart_config: Json;
          pattern_config: Json;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          name_en?: string | null;
          description?: string | null;
          icon?: string | null;
          questions: Json;
          scale_type: string;
          scale_options: Json;
          category_map: Json;
          reverse_items?: Json;
          max_scale?: number | null;
          interpretations: Json;
          chart_config?: Json;
          pattern_config?: Json;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          name_en?: string | null;
          description?: string | null;
          icon?: string | null;
          questions?: Json;
          scale_type?: string;
          scale_options?: Json;
          category_map?: Json;
          reverse_items?: Json;
          max_scale?: number | null;
          interpretations?: Json;
          chart_config?: Json;
          pattern_config?: Json;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      workshops: {
        Row: {
          id: string;
          admin_id: string;
          name: string;
          description: string | null;
          invite_code: string;
          start_date: string | null;
          end_date: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          name: string;
          description?: string | null;
          invite_code: string;
          start_date?: string | null;
          end_date?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string;
          name?: string;
          description?: string | null;
          invite_code?: string;
          start_date?: string | null;
          end_date?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      workshop_members: {
        Row: {
          id: string;
          workshop_id: string;
          user_id: string;
          role: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          workshop_id: string;
          user_id: string;
          role?: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          workshop_id?: string;
          user_id?: string;
          role?: string;
          joined_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          tool_id: string;
          workshop_id: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tool_id: string;
          workshop_id?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tool_id?: string;
          workshop_id?: string | null;
          status?: string;
          created_at?: string;
        };
      };
      results: {
        Row: {
          id: string;
          session_id: string | null;
          user_id: string;
          tool_id: string;
          workshop_id: string | null;
          answers: Json;
          scores: Json;
          pattern_type: string | null;
          completed_at: string;
        };
        Insert: {
          id?: string;
          session_id?: string | null;
          user_id: string;
          tool_id: string;
          workshop_id?: string | null;
          answers: Json;
          scores: Json;
          pattern_type?: string | null;
          completed_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string | null;
          user_id?: string;
          tool_id?: string;
          workshop_id?: string | null;
          answers?: Json;
          scores?: Json;
          pattern_type?: string | null;
          completed_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
