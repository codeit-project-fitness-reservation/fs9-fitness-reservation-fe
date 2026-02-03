'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type AllowedRole = 'SELLER';

export default function SellerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const role = (
    typeof window !== 'undefined' ? (localStorage.getItem('userRole') as AllowedRole | null) : null
  ) as AllowedRole | null;

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login');
      return;
    }

    if (role !== 'SELLER') {
      router.replace('/');
      return;
    }
  }, [router, accessToken, role]);

  if (!accessToken || role !== 'SELLER') return null;

  return <>{children}</>;
}
