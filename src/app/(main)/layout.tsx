'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header/Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

// SimpleHeader를 사용하는 페이지 경로 목록
const SIMPLE_HEADER_PAGES = ['/seller/class-register'];

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const useSimpleHeader = SIMPLE_HEADER_PAGES.includes(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-gray-200">
      {!useSimpleHeader && <Header />}
      <main
        className={`mx-auto w-full flex-1 ${
          useSimpleHeader ? '' : 'max-w-7xl bg-gray-50 px-4 md:px-8'
        }`}
      >
        {children}
      </main>
    </div>
  );
}
