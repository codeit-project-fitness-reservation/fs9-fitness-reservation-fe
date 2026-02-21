'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';

type Role = 'CUSTOMER' | 'SELLER' | 'ADMIN';

function isSafeNext(nextParam: string | null): nextParam is string {
  return Boolean(nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//'));
}

function canAccess(role: Role, path: string): boolean {
  if (path.startsWith('/seller')) return role === 'SELLER';
  if (path.startsWith('/admin')) return role === 'ADMIN';
  if (path.startsWith('/mypage')) return true;
  // 기타 경로는 일단 허용
  return true;
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const safeNext = isSafeNext(nextParam) ? nextParam : null;
  const { status, user } = useAuth();

  useEffect(() => {
    const check = async () => {
      if (status === 'loading') return;
      if (status !== 'authenticated' || !user) {
        return;
      }

      const role = user.role as Role;
      if (safeNext && canAccess(role, safeNext)) {
        router.replace(safeNext);
      } else {
        router.replace(role === 'SELLER' ? '/seller' : role === 'ADMIN' ? '/admin' : '/main');
      }
    };

    void check();
  }, [router, safeNext, status, user]);

  if (status === 'loading') return null;
  if (status === 'authenticated') return null;

  return <section className="flex min-h-dvh flex-col bg-white">{children}</section>;
}
