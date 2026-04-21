"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import liff from '@line/liff';
import type { Profile } from '@liff/get-profile';

type LiffContextValue = {
  profile: Profile | null;
  staffId: string | null;
};

const LiffContext = createContext<LiffContextValue>({ profile: null, staffId: null });

export const LiffProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [staffId, setStaffId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });

      if (!liff.isLoggedIn()) {
        liff.login();
        return;
      }

      const p = await liff.getProfile();
      setProfile(p);

      const res = await fetch('/api/line/liff-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId: p.userId, displayName: p.displayName }),
      });
      const data = await res.json();
      setStaffId(data.staffId ?? null);
    })();
  }, []);

  return <LiffContext.Provider value={{ profile, staffId }}>{children}</LiffContext.Provider>;
};

export const useLiff = () => useContext(LiffContext);
