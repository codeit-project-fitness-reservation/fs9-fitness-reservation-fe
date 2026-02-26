'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

type AllowedRole = 'SELLER';

export default function SellerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status, user } = useAuth();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.replace('/login?next=/seller');
      return;
    }
    if (status === 'authenticated' && user && user.role !== 'SELLER') {
      router.replace('/');
    }
  }, [router, status, user]);

  if (status !== 'authenticated') return null;
  if (!user || (user.role as AllowedRole | string) !== 'SELLER') return null;

  return <>{children}</>;
}
