import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export const createManualClient = (role?: 'ai_copilot_reader') => {
  const options = role === 'ai_copilot_reader'
    ? { global: { headers: { 'x-supabase-role': 'ai_copilot_reader' } } }
    : {};

  return createClient<Database>(
    process.env.MANUAL_DB_URL!,
    process.env.MANUAL_DB_KEY!,
    options
  );
};
