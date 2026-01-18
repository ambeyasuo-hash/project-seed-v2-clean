// src/app/admin/test-connection/page.tsx (修正案)

import { createManualClient } from '@/lib/supabase/server';

// Next.jsのServer Componentとして実行
export default async function TestConnectionPage() {
  // 1. クライアントの作成
  const supabase = createManualClient();

  // 2. staffテーブルからデータを取得
  const { data: staff, error } = await supabase
    .from('staff') // テーブル名を指定
    .select('id, display_name, employment_type, is_active') // 必要なカラムを明示的に選択
    .limit(1); // 1件のみ取得

  // 3. エラー処理
  if (error) {
    return (
      <div className="p-4 text-red-500">
        <h2>DB接続エラー</h2>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  // 4. 成功時の表示
  const staffData = staff?.[0];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Supabase接続テスト (Manual DB)</h1>
      {staffData ? (
        <div className="mt-4 p-4 border rounded">
          <h2 className="font-semibold">スタッフデータ取得成功 (1件)</h2>
          <p>ID: {staffData.id}</p>
          <p>名前: {staffData.display_name}</p>
          <p>雇用形態: {staffData.employment_type}</p>
          <p>アクティブ: {staffData.is_active ? 'Yes' : 'No'}</p>
        </div>
      ) : (
        <p className="mt-4">データは取得されましたが、staffテーブルにレコードがありません。</p>
      )}
    </div>
  );
}