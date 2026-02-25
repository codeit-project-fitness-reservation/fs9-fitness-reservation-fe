'use client';

import { ReactNode, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

// 1. 공개 경로 설정
const PUBLIC_PATHS = ['/', '/main', '/classes', '/centers'];
const PUBLIC_PATH_PREFIXES = ['/classes/', '/centers/'];

interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, user } = useAuth();

  // 현재 경로가 공개 경로인지 계산 (Derived State)
  const isPublicPath = useMemo(() => {
    // 정확히 일치하는 경로
    if (PUBLIC_PATHS.includes(pathname)) return true;
    // 동적 경로를 위한 prefix 체크 (예: /classes/123, /centers/456)
    return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  }, [pathname]);

  // 권한 여부 계산: (인증된 고객이거나) 또는 (비인증 상태이되 공개 경로일 때)
  const isAuthorized = status === 'authenticated' && user?.role === 'CUSTOMER';
  const shouldRender = isPublicPath || isAuthorized;

  // [Side Effect] 권한이 없는 경우 리다이렉트만 담당
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' && !isPublicPath) {
      // 비인증 유저가 보호된 경로에 접속 시 로그인 페이지로
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (status === 'authenticated' && user && user.role !== 'CUSTOMER') {
      // 인증되었으나 CUSTOMER가 아닌 경우 (SELLER, ADMIN 등) 각자의 대시보드로
      const roleRedirectMap: Record<string, string> = {
        SELLER: '/seller',
        ADMIN: '/admin',
      };
      router.replace(roleRedirectMap[user.role] || '/');
    }
  }, [status, user, pathname, router, isPublicPath]);

  // --- Rendering Logic ---

  // 공개 경로인 경우 로딩 중이어도 바로 렌더링 (백엔드 응답 대기 없이)
  if (isPublicPath) {
    return <>{children}</>;
  }

  // 로딩 중이거나, 권한이 없어서 리다이렉트가 필요한 상황이면 로딩 화면 노출
  if (status === 'loading' || !shouldRender) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="animate-pulse font-medium text-gray-500">인증 확인 중...</p>
      </div>
    );
  }

  // 공개 경로이거나 권한 검증이 완료된 고객에게만 자식 컴포넌트 렌더링
  return <>{children}</>;
}
