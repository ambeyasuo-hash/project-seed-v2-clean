import { NextResponse } from 'next/server';
import { createManualClient } from '@/lib/supabase/server';
import { checkRisk } from '@/lib/ai/engine';

export async function GET() {
  const supabase = createManualClient('ai_copilot_reader');

  try {
    // エンゲージメントが低いスタッフを抽出
    const { data: staffData, error } = await (supabase
      .from('ai_staff_context') as any)
      .select('*')
      .lt('engagement_score', 40); // スコア40未満を対象

    if (error) throw error;
    if (!staffData || staffData.length === 0) return NextResponse.json({ riskStatus: "SAFE" });

    const riskAnalysis = await checkRisk(JSON.stringify(staffData));
    return NextResponse.json({ riskStatus: "ALERT", detail: riskAnalysis });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}