import { NextResponse } from 'next/server';
import { createManualClient } from '@/lib/supabase/server';
import { askAi } from '@/lib/ai/engine';

export async function GET() {
  // 1. AI専用ロール（匿名ビューのみ参照可能）で接続
  const supabase = createManualClient('ai_copilot_reader');

  try {
    // 2. 匿名ビューからスタッフ状況を取得
    const { data: staffContext, error } = await (supabase
      .from('ai_staff_context') as any)
      .select('*');

    if (error) throw error;

    // 3. AIにアドバイスを求める
    const contextString = JSON.stringify(staffContext);
    const prompt = "現在のスタッフのスキルセットとエンゲージメントを分析し、店長へのアドバイスを30文字以内で簡潔に述べてください。";
    
    const advice = await askAi(prompt, contextString);

    return NextResponse.json({ advice });
  } catch (error: any) {
    console.error('AI Bridge Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}