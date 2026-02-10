'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authFetch } from '@/lib/api';

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

  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const me = await authFetch<{ id: string; role: Role }>('/api/auth/me');
      if (!mounted) return;

      // 비로그인이면 auth 페이지 그대로 노출
      if (!me.ok) {
        setReady(true);
        return;
      }

      // 로그인 상태면 (next가 유효하면) next로, 아니면 role별 기본으로
      if (safeNext && canAccess(me.data.role, safeNext)) {
        router.replace(safeNext);
      } else {
        router.replace(
          me.data.role === 'SELLER' ? '/seller' : me.data.role === 'ADMIN' ? '/admin' : '/',
        );
      }
    };

    void check();
    return () => {
      mounted = false;
    };
  }, [router, safeNext]);

  if (!ready) return null;

  return <section className="flex min-h-dvh flex-col bg-white">{children}</section>;
}
