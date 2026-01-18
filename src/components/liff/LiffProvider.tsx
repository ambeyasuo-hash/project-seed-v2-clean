"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import liff from '@line/liff';

const LiffContext = createContext<{ profile: any | null, staffId: string | null }>({ profile: null, staffId: null });

export const LiffProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<any>(null);
  const [staffId, setStaffId] = useState<string | null>(null);

  useEffect(() => {
    liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
      .then(async () => {
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const p = await liff.getProfile();
          setProfile(p);
          const res = await fetch('/api/line/liff-auth', {
            method: 'POST',
            body: JSON.stringify({ lineId: p.userId, displayName: p.displayName })
          });
          const data = await res.json();
          setStaffId(data.staffId);
        }
      });
  }, []);

  return <LiffContext.Provider value={{ profile, staffId }}>{children}</LiffContext.Provider>;
};

export const useLiff = () => useContext(LiffContext);