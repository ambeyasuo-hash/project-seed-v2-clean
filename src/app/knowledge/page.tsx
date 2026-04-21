"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Database } from '@/types/database';

type KnowledgeEntry = Pick<Database['public']['Tables']['knowledge_entries']['Row'], 'id' | 'title' | 'description' | 'status'>;

export default function KnowledgePage() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/knowledge');
      const data = await res.json();
      setEntries(data.entries ?? []);
    })();
  }, []);

  const handleSummarize = async (id: string) => {
    setSummary("AIが要約中...");
    const res = await fetch('/api/knowledge/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entryId: id }),
    });
    const data = await res.json();
    setSummary(data.summary ?? null);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">マニュアル一覧</h1>
        <Link href="/" className="text-sm text-blue-600">戻る</Link>
      </div>

      {summary && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <strong>AI要約:</strong>
          <p>{summary}</p>
        </div>
      )}

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="p-4 bg-white border rounded-xl shadow-sm">
            <h2 className="font-bold text-lg">{entry.title}</h2>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{entry.description}</p>
            <button
              onClick={() => handleSummarize(entry.id)}
              className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full font-medium"
            >
              AIで要約する
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
