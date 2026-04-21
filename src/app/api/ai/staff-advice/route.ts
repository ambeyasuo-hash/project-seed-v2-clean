import { NextResponse } from 'next/server';
import { createManualClient } from '@/lib/supabase/server';
import { askAi } from '@/lib/ai/engine';

export async function GET() {
  const supabase = createManualClient('ai_copilot_reader');

  try {
    const { data: staffContext, error } = await supabase
      .from('ai_staff_context')
      .select('*');

    if (error) throw error;

    const advice = await askAi(
      "現在のスタッフのスキルセットとエンゲージメントを分析し、店長へのアドバイスを30文字以内で簡潔に述べてください。",
      JSON.stringify(staffContext)
    );

    return NextResponse.json({ advice });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
