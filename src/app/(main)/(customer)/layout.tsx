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
  const { status } = useAuth();

  // 현재 경로가 공개 경로인지 계산 (Derived State)
  const isPublicPath = useMemo(() => {
    // 정확히 일치하는 경로
    if (PUBLIC_PATHS.includes(pathname)) return true;
    // 동적 경로를 위한 prefix 체크 (예: /classes/123, /centers/456)
    return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  }, [pathname]);

  // 고객 영역 권한: CUSTOMER만이 아니라 모든 계정이 customer 권한 이상을 가짐 (SELLER/ADMIN = customer+)
  // 따라서 로그인만 되어 있으면 고객 영역(메인, /my 등) 접근 허용. CUSTOMER 전용 예외 권한은 없음.
  const isAuthorized = status === 'authenticated';
  const shouldRender = isPublicPath || isAuthorized;

  // [Side Effect] 비인증만 로그인으로 보냄. SELLER/ADMIN을 고객 영역에서 내쫓지 않음.
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated' && !isPublicPath) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [status, pathname, router, isPublicPath]);

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
