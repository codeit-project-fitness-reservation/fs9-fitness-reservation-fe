import { NextResponse, type NextRequest } from 'next/server';

type Role = 'CUSTOMER' | 'SELLER' | 'ADMIN';

function decodeJwtPayload(token: string): { role?: Role } | null {
  const parts = token.split('.');
  if (parts.length < 2) return null;

  // base64url -> base64
  let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  if (pad) base64 += '='.repeat(4 - pad);

  try {
    return JSON.parse(atob(base64)) as { role?: Role };
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get('accessToken')?.value;
  const payload = accessToken ? decodeJwtPayload(accessToken) : null;
  const role = payload?.role;

  // 보호 라우트 정책
  const needsAuth =
    pathname.startsWith('/mypage') ||
    pathname.startsWith('/seller') ||
    pathname.startsWith('/admin');
  const needsSeller = pathname.startsWith('/seller');
  const needsAdmin = pathname.startsWith('/admin');

  // 이미 로그인한 사용자가 로그인/회원가입 페이지로 접근하면 홈으로 보냄
  if ((pathname === '/login' || pathname === '/signup') && accessToken) {
    const url = req.nextUrl.clone();
    url.pathname = role === 'SELLER' ? '/seller' : role === 'ADMIN' ? '/admin' : '/';
    return NextResponse.redirect(url);
  }

  if (needsAuth && !accessToken) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // role 기반 UX 가드(토큰 검증은 BE authenticate가 최종 책임)
  if (needsSeller && role && role !== 'SELLER') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  if (needsAdmin && role && role !== 'ADMIN') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/seller/:path*', '/admin/:path*', '/mypage/:path*', '/login', '/signup'],
};
