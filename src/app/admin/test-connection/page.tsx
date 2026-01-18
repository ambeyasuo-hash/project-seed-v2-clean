// src/app/admin/test-connection/page.tsx (微修正)

import { createManualClient } from '@/lib/supabase/server';
// ★Database型をインポートし、Row型を抽出
import { Database } from '@/types/database'; 

type StaffRow = Database['public']['Tables']['staff']['Row'];

// Next.jsのServer Componentとして実行
export default async function TestConnectionPage() {
  // 1. クライアントの作成
  const supabase = createManualClient();

  // 2. staffテーブルからデータを取得
  // ★ as StaffRow[] を追加し、型推論を強制的に助ける
  const { data: staff, error } = await supabase
    .from('staff') 
    .select('id, display_name, employment_type, is_active') 
    .limit(1) as { data: StaffRow[] | null, error: any }; // 型を強制的に上書き

  // 3. エラー処理
  // ... (省略)

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