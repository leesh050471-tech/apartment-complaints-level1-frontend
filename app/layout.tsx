import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: '햇살마을 민원 기록장',
  description: '아파트 관리사무소 민원 접수와 처리 기록',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="top">
          <div className="in">
            <Link href="/"><strong>🏢 햇살마을 민원 기록장</strong></Link>
            <Link href="/complaints/new" className="btn">민원 등록</Link>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
