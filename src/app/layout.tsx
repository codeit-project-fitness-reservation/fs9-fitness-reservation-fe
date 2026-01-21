import type { Metadata } from 'next';
import './globals.css';
import localFont from 'next/font/local';
import Providers from './providers';

export const metadata: Metadata = {
  title: '운동 예약 플랫폼',
  description: '쉽고 빠른 운동 예약 서비스',
};
// Pretendard 폰트 정의
const pretendard = localFont({
  src: './font/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko-kr" className={`${pretendard.variable}`} suppressHydrationWarning>
      <body className="font-pretendard antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
