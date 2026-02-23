'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header/Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const SIMPLE_HEADER_PAGES = ['/seller/class-register', '/seller/profile/edit', '/seller/coupons'];

const FULL_WIDTH_PAGES = ['/admin'];
const MY_PAGE = '/my';
const MAIN_PAGE = '/main';

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const useSimpleHeader = SIMPLE_HEADER_PAGES.includes(pathname);
  const useFullWidth = FULL_WIDTH_PAGES.some((p) => pathname.startsWith(p));
  const isMyPage = pathname.startsWith(MY_PAGE);
  const isMainPage = pathname === MAIN_PAGE || pathname === '/';

  const mainClassName = useSimpleHeader
    ? ''
    : isMyPage
      ? 'mx-auto w-full flex-1 bg-white px-4 md:max-w-240 md:px-0'
      : isMainPage
        ? 'mx-auto w-full flex-1 bg-gray-50 md:max-w-240'
        : useFullWidth
          ? 'flex-1 w-full min-w-0'
          : 'mx-auto w-full flex-1 bg-gray-50 px-4 md:max-w-240 md:px-8';

  return (
    <div className="flex min-h-screen flex-col bg-gray-200">
      {!useSimpleHeader && <Header />}
      <main className={mainClassName}>{children}</main>
    </div>
  );
}
