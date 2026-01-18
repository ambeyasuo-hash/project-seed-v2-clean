// src/types/database.ts (最終版 - 手動で作成)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ----------------------------------------------------------------
// Supabaseクライアントが期待する正確な型構造
// ----------------------------------------------------------------
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
        }
        Insert: Omit<Database['public']['Tables']['staff']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['staff']['Row']>
      }
      // 他のテーブルは、必要になった時点で追加します。
      // まずは 'staff' の型が解決すれば、現在のエラーは解消します。
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