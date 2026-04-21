import { NextResponse } from 'next/server';
import { createManualClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { lineId, displayName } = await request.json();

    if (!lineId || !displayName) {
      return NextResponse.json({ error: 'Missing lineId or displayName' }, { status: 400 });
    }

    const supabase = createManualClient();

    const { data: existingStaff, error: selectError } = await supabase
      .from('staff')
      .select('id')
      .eq('line_id', lineId)
      .limit(1);

    if (selectError) throw selectError;

    let staffId: string;
    const isNewUser = !existingStaff || existingStaff.length === 0;

    if (!isNewUser) {
      staffId = existingStaff[0].id;
    } else {
      const { data: newStaff, error: insertError } = await supabase
        .from('staff')
        .insert({
          line_id: lineId,
          display_name: displayName,
          employment_type: 'part-time',
          is_active: true,
        })
        .select('id')
        .maybeSingle();

      if (insertError) throw insertError;
      if (!newStaff) throw new Error('Failed to create staff');

      staffId = newStaff.id;
    }

    return NextResponse.json({ message: 'Authentication successful', staffId, isNewUser });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
