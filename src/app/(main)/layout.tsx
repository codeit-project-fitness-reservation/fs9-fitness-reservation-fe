'use client';

import Header from '@/components/layout/Header/Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-200">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 bg-gray-50 px-4 md:px-8">{children}</main>
    </div>
  );
}
