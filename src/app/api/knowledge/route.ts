import { NextResponse } from 'next/server';
import { createManualClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createManualClient();
  const { data, error } = await supabase
    .from('knowledge_entries')
    .select('id, title, description, status')
    .eq('status', 'published');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entries: data });
}

export async function POST(request: Request) {
  try {
    const { title, description, categoryId, contributorId, isAnonymous } = await request.json();
    const supabase = createManualClient();

    const { data, error } = await supabase
      .from('knowledge_entries')
      .insert({
        title,
        description,
        category_id: categoryId,
        contributor_id: contributorId,
        is_anonymous: isAnonymous,
        status: 'published',
      })
      .select()
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ entry: data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
