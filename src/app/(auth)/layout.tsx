'use client';

import { type ReactNode, Suspense, useEffect } from 'react';
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
  return true;
}

function AuthRedirectGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const safeNext = isSafeNext(nextParam) ? nextParam : null;
  const { status, user } = useAuth();

  // 이미 로그인한 유저는 적절한 페이지로 리다이렉트
  useEffect(() => {
    if (status !== 'authenticated' || !user) return;

    const role = user.role as Role;
    router.replace(
      safeNext && canAccess(role, safeNext)
        ? safeNext
        : role === 'SELLER'
          ? '/seller'
          : role === 'ADMIN'
            ? '/admin'
            : '/main',
    );
  }, [router, safeNext, status, user]);

  // 인증 확인 완료 후 로그인된 유저면 리다이렉트 대기 중이므로 숨김
  // loading 중엔 폼을 바로 보여줌 (지연 없음)
  if (status === 'authenticated') return null;

  return <section className="flex min-h-dvh flex-col bg-white">{children}</section>;
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<section className="flex min-h-dvh flex-col bg-white">{children}</section>}>
      <AuthRedirectGuard>{children}</AuthRedirectGuard>
    </Suspense>
  );
}
