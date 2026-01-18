// src/app/api/line/liff-auth/route.ts

import { NextResponse } from 'next/server';
import { createManualClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { lineId, displayName } = await request.json();

  if (!lineId || !displayName) {
    return NextResponse.json({ error: 'Missing lineId or displayName' }, { status: 400 });
  }

  const supabase = createManualClient();

  try {
    // 1. 既存スタッフの確認
    // .from('staff') を any キャストして型推論のループを断ち切る
    const { data: existingStaff, error: selectError } = await (supabase
      .from('staff') as any)
      .select('id')
      .eq('line_id', lineId)
      .limit(1);

    if (selectError) throw selectError;

    let staffId: string;

    if (existingStaff && existingStaff.length > 0) {
      staffId = existingStaff[0].id;
      console.log(`Existing staff logged in: ${staffId}`);
    } else {
      // 2. 新規スタッフの登録
      const { data: newStaff, error: insertError } = await (supabase
        .from('staff') as any)
        .insert({
          line_id: lineId,
          display_name: displayName,
          employment_type: 'part-time',
          is_active: true,
        })
        .select('id')
        .single();

      if (insertError) throw insertError;
      if (!newStaff) throw new Error('Failed to create staff');
      
      staffId = newStaff.id;
      console.log(`New staff registered: ${staffId}`);
    }

    return NextResponse.json({ 
      message: 'Authentication successful', 
      staffId: staffId,
      isNewUser: !existingStaff || existingStaff.length === 0 
    }, { status: 200 });

  } catch (error: any) {
    console.error('LIFF Auth Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}