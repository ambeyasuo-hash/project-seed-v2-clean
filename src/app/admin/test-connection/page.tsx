import { createManualClient } from '@/lib/supabase/server';

export default async function TestConnectionPage() {
  const supabase = createManualClient();

  const { data: staff, error } = await supabase
    .from('staff')
    .select('id, display_name, employment_type, is_active')
    .limit(1);

  const staffData = staff?.[0];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Supabase接続テスト</h1>
      {error && <p className="mt-4 text-red-600">{error.message}</p>}
      {staffData ? (
        <div className="mt-4 p-4 border rounded">
          <h2 className="font-semibold">スタッフデータ取得成功</h2>
          <p>ID: {staffData.id}</p>
          <p>名前: {staffData.display_name}</p>
          <p>雇用形態: {staffData.employment_type}</p>
          <p>アクティブ: {staffData.is_active ? 'Yes' : 'No'}</p>
        </div>
      ) : (
        !error && <p className="mt-4">staffテーブルにレコードがありません。</p>
      )}
    </div>
  );
}
