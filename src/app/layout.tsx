import './globals.css';
import localFont from 'next/font/local';

export const metadata = {
  title: '피트니스 예약 서비스',
  description: '편리한 수업 예약 시스템',
};

const pretendard = localFont({
  src: './font/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko-kr" className={`${pretendard.variable}`} suppressHydrationWarning>
      <body className="font-pretendard antialiased">{children}</body>
    </html>
  );
}
