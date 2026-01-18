import { NextResponse } from 'next/server';
import { createManualClient } from '@/lib/supabase/server';

// マニュアル一覧の取得
export async function GET() {
  const supabase = createManualClient();
  const { data, error } = await (supabase.from('knowledge_entries') as any)
    .select(`
      id,
      title,
      description,
      status,
      knowledge_categories (name)
    `)
    .eq('status', 'published');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entries: data });
}

// マニュアルの新規投稿
export async function POST(request: Request) {
  const { title, description, categoryId, contributorId, isAnonymous } = await request.json();
  const supabase = createManualClient();

  const { data, error } = await (supabase.from('knowledge_entries') as any).insert({
    title,
    description,
    category_id: categoryId,
    contributor_id: contributorId,
    is_anonymous: isAnonymous,
    status: 'published'
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entry: data });
}