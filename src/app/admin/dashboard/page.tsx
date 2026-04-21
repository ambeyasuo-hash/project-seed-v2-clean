"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

type RiskState = { status: string; detail?: string };

export default function AdminDashboard() {
  const [advice, setAdvice] = useState<string>("分析中...");
  const [risk, setRisk] = useState<RiskState>({ status: "確認中" });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resAdvice, resRisk] = await Promise.all([
        fetch('/api/ai/staff-advice'),
        fetch('/api/ai/risk-monitor'),
      ]);
      const dataAdvice = await resAdvice.json();
      const dataRisk = await resRisk.json();

      setAdvice(dataAdvice.advice ?? "データ不足");
      setRisk({ status: dataRisk.riskStatus, detail: dataRisk.detail });
    } catch {
      setAdvice("エラー");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold">SEED v2 管理パネル</h1>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm disabled:opacity-50"
        >
          更新
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
          <h2 className="font-bold mb-2">AIアドバイス</h2>
          <p className="text-blue-900">{advice}</p>
        </div>

        <div className={`p-6 rounded-2xl border ${risk.status === 'ALERT' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
          <h2 className={`font-bold mb-2 ${risk.status === 'ALERT' ? 'text-red-800' : 'text-green-800'}`}>
            リスク状況: {risk.status}
          </h2>
          <p className="text-sm">{risk.detail ?? "現在、特筆すべきリスクは見当たりません。"}</p>
        </div>
      </div>

      <nav>
        <Link href="/" className="text-gray-400 text-sm">スタッフ画面へ</Link>
      </nav>
    </div>
  );
}
