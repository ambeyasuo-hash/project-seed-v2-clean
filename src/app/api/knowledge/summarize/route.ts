import { NextResponse } from 'next/server';
import { createManualClient } from '@/lib/supabase/server';
import { askAi } from '@/lib/ai/engine';

export async function POST(request: Request) {
  const { entryId } = await request.json();
  const supabase = createManualClient();

  try {
    // 1. 対象のマニュアル記事を取得
    const { data: entry, error } = await (supabase.from('knowledge_entries') as any)
      .select('title, description')
      .eq('id', entryId)
      .single();

    if (error || !entry) throw new Error('Entry not found');

    // 2. AIに要約を依頼
    const context = `タイトル: ${entry.title}\n内容: ${entry.description}`;
    const prompt = "このマニュアルの内容を、新人スタッフでもわかるように3つの箇条書きで100文字以内で要約してください。";
    
    const summary = await askAi(prompt, context);

    return NextResponse.json({ summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}