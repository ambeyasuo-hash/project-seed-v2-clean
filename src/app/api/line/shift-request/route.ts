import { NextResponse } from 'next/server';
import { createManualClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const staffId = searchParams.get('staffId');

  if (!staffId) return NextResponse.json({ error: 'Missing staffId' }, { status: 400 });

  const supabase = createManualClient();
  const { data, error } = await supabase
    .from('shift_requests')
    .select('*')
    .eq('staff_id', staffId)
    .order('request_date', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ shifts: data });
}

export async function POST(request: Request) {
  try {
    const { staffId, date, startTime, endTime, isAbsent } = await request.json();
    const supabase = createManualClient();

    const { error } = await supabase.from('shift_requests').insert({
      staff_id: staffId,
      request_date: date,
      start_time: startTime,
      end_time: endTime,
      is_absent: isAbsent,
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
