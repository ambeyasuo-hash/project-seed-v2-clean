// src/app/api/line/shift-request/route.ts

import { NextResponse } from 'next/server';
import { createManualClient } from '@/lib/supabase/server';

// シフト希望一覧の取得
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const staffId = searchParams.get('staffId');
  
  if (!staffId) return NextResponse.json({ error: 'Missing staffId' }, { status: 400 });

  const supabase = createManualClient();
  const { data, error } = await (supabase.from('shift_requests') as any)
    .select('*')
    .eq('staff_id', staffId)
    .order('request_date', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ shifts: data });
}

// シフト希望の提出
export async function POST(request: Request) {
  const { staffId, date, startTime, endTime, isAbsent } = await request.json();
  const supabase = createManualClient();

  try {
    const { error } = await (supabase.from('shift_requests') as any).insert({
      staff_id: staffId,
      request_date: date,
      start_time: startTime,
      end_time: endTime,
      is_absent: isAbsent,
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}