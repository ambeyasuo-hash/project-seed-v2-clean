import type { Metadata } from "next";
import "./globals.css";
import { LiffProvider } from "@/components/liff/LiffProvider";

export const metadata: Metadata = {
  title: "Project SEED v2",
  description: "Shift Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <LiffProvider>{children}</LiffProvider>
      </body>
    </html>
  );
}