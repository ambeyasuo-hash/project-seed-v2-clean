// src/lib/supabase/server.ts (最終確認)
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database'; // ★追加

// ... createMainClient は省略

/**
 * マニュアル・シフトDB（業務データ用）への接続クライアントを作成する。
 * @param role - 接続ロール ('ai_copilot_reader' または未指定)
 * @returns SupabaseClient
 */
export const createManualClient = (role?: 'ai_copilot_reader') => {
  const options = role === 'ai_copilot_reader' 
    ? { global: { headers: { 'x-supabase-role': 'ai_copilot_reader' } } }
    : {};

  // ★Database型を適用
  return createClient<Database>(
    process.env.MANUAL_DB_URL!,
    process.env.MANUAL_DB_KEY!,
    options
  );
};