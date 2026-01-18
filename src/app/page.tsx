"use client";
import { useEffect, useState } from 'react';
import { useLiff } from "@/components/liff/LiffProvider";
import Link from 'next/link';

export default function HomePage() {
  const { profile, staffId } = useLiff();
  const [myShifts, setMyShifts] = useState<any[]>([]);

  useEffect(() => {
    if (staffId) {
      fetch(`/api/line/shift-request?staffId=${staffId}`)
        .then(res => res.json())
        .then(data => setMyShifts(data.shifts || []));
    }
  }, [staffId]);

  if (!profile) return <div className="p-10 text-center">LINE認証中...</div>;

  return (
    <main className="p-4 max-w-md mx-auto">
      <header className="mb-8 text-center">
        <img src={profile.pictureUrl} className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-green-500" />
        <h1 className="text-xl font-bold">お疲れ様です、{profile.displayName}さん</h1>
      </header>

      <div className="space-y-4">
        <Link href="/shift-request">
          <button className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg">📅 シフト希望を提出する</button>
        </Link>
        
        <section className="mt-8">
          <h2 className="text-lg font-bold mb-2">提出済みの希望</h2>
          <div className="space-y-2">
            {myShifts.length === 0 ? <p className="text-sm text-gray-500">データがありません</p> : 
              myShifts.map((s, i) => (
                <div key={i} className="p-3 bg-white border rounded shadow-sm text-sm">
                  {s.request_date} : {s.is_absent ? '休み希望' : `${s.start_time} - ${s.end_time}`}
                </div>
              ))
            }
          </div>
        </section>
      </div>
    </main>
  );
}