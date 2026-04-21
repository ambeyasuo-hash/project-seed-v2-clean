export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      staff: {
        Row: {
          id: string
          display_name: string
          employment_type: string | null
          attributes: Json | null
          engagement_score: number | null
          is_active: boolean | null
          created_at: string
          line_id: string | null
        }
        Insert: {
          id?: string
          display_name: string
          employment_type?: string | null
          attributes?: Json | null
          engagement_score?: number | null
          is_active?: boolean | null
          created_at?: string
          line_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['staff']['Row']>
        Relationships: []
      }
      shift_requests: {
        Row: {
          id: string
          staff_id: string
          request_date: string
          start_time: string | null
          end_time: string | null
          is_absent: boolean | null
          priority_weight: number | null
        }
        Insert: {
          id?: string
          staff_id: string
          request_date: string
          start_time?: string | null
          end_time?: string | null
          is_absent?: boolean | null
          priority_weight?: number | null
        }
        Update: Partial<Database['public']['Tables']['shift_requests']['Row']>
        Relationships: []
      }
      knowledge_entries: {
        Row: {
          id: string
          category_id: string | null
          title: string
          image_url: string | null
          description: string | null
          contributor_id: string | null
          is_anonymous: boolean | null
          status: string | null
        }
        Insert: {
          id?: string
          category_id?: string | null
          title: string
          image_url?: string | null
          description?: string | null
          contributor_id?: string | null
          is_anonymous?: boolean | null
          status?: string | null
        }
        Update: Partial<Database['public']['Tables']['knowledge_entries']['Row']>
        Relationships: []
      }
      store_requirements: {
        Row: {
          id: string
          day_of_week: number | null
          time_slot: string | null
          required_staff_count: number | null
          required_skills: Json | null
        }
        Insert: {
          id?: string
          day_of_week?: number | null
          time_slot?: string | null
          required_staff_count?: number | null
          required_skills?: Json | null
        }
        Update: Partial<Database['public']['Tables']['store_requirements']['Row']>
        Relationships: []
      }
    }
    Views: {
      ai_staff_context: {
        Row: {
          id: string | null
          display_name: string | null
          employment_type: string | null
          role: string | null
          skills: string | null
          engagement_score: number | null
        }
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
