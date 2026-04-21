import { NextResponse } from 'next/server';
import { createManualClient } from '@/lib/supabase/server';
import { askAi } from '@/lib/ai/engine';

export async function POST(request: Request) {
  try {
    const { entryId } = await request.json();
    const supabase = createManualClient();

    const { data: entry, error } = await supabase
      .from('knowledge_entries')
      .select('title, description')
      .eq('id', entryId)
      .maybeSingle();

    if (error || !entry) throw new Error('Entry not found');

    const context = `タイトル: ${entry.title}\n内容: ${entry.description}`;
    const summary = await askAi(
      "このマニュアルの内容を、新人スタッフでもわかるように3つの箇条書きで100文字以内で要約してください。",
      context
    );

    return NextResponse.json({ summary });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
