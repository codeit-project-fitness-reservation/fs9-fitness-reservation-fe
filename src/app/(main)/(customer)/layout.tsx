'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, user } = useAuth();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (status === 'authenticated' && user && user.role !== 'CUSTOMER') {
      if (user.role === 'SELLER') router.replace('/seller');
      else if (user.role === 'ADMIN') router.replace('/admin');
      else router.replace('/');
    }
  }, [router, status, user, pathname]);

  if (status !== 'authenticated') return null;
  if (!user || user.role !== 'CUSTOMER') return null;

  return <>{children}</>;
}
