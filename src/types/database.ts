// src/types/database.ts (最終クリーンアップ版 - 全テーブル/ビュー対応)

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
          line_id: string | null // ★ line_id を追加
        }
        Insert: Omit<Database['public']['Tables']['staff']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['staff']['Row']>
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
        Insert: Omit<Database['public']['Tables']['shift_requests']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['shift_requests']['Row']>
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
        Insert: Omit<Database['public']['Tables']['knowledge_entries']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['knowledge_entries']['Row']>
      }
      store_requirements: {
        Row: {
          id: string
          day_of_week: number | null
          time_slot: string | null
          required_staff_count: number | null
          required_skills: Json | null
        }
        Insert: Omit<Database['public']['Tables']['store_requirements']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['store_requirements']['Row']>
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
      }
    }
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}

export {}; // モジュールとして強制的に認識させる