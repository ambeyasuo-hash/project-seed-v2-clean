"use client";
import { useState } from 'react';
import { useLiff } from '@/components/liff/LiffProvider';
import { useRouter } from 'next/navigation';

export default function ShiftRequestPage() {
  const { staffId } = useLiff();
  const router = useRouter();
  const [date, setDate] = useState('');
  const [isAbsent, setIsAbsent] = useState(false);

  const handleSubmit = async () => {
    if (!staffId || !date) return alert("日付を入力してください");
    
    const res = await fetch('/api/line/shift-request', {
      method: 'POST',
      body: JSON.stringify({
        staffId,
        date,
        startTime: isAbsent ? null : "10:00",
        endTime: isAbsent ? null : "22:00",
        isAbsent
      })
    });

    if (res.ok) {
      alert("提出完了");
      router.push('/');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">シフト提出</h1>
      <input type="date" className="w-full p-3 border rounded" onChange={(e) => setDate(e.target.value)} />
      <label className="flex items-center space-x-3">
        <input type="checkbox" checked={isAbsent} onChange={(e) => setIsAbsent(e.target.checked)} />
        <span>この日は休みを希望する</span>
      </label>
      <button onClick={handleSubmit} className="w-full py-4 bg-green-600 text-white rounded-lg font-bold">提出する</button>
    </div>
  );
}