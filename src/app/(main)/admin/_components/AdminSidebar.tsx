'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import logoImg from '@/assets/images/FITMATCH.svg';
import { useAuth } from '@/lib/auth';

const navItems = [
  { href: '/admin', label: '관리자 홈' },
  { href: '/admin/users', label: '회원 관리' },
  { href: '/admin/classes', label: '클래스 관리' },
  { href: '/admin/reservations', label: '최근 예약' },
  { href: '/admin/coupons', label: '쿠폰 관리' },
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <aside className="sticky top-0 flex h-screen w-[200px] shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-14 items-center border-b border-gray-200 px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src={logoImg} alt="FITMATCH" className="h-4 w-auto" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-between p-2">
        <nav className="flex flex-col gap-0.5">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link
                key={`${href}-${label}`}
                href={href}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          로그아웃
        </button>
      </div>
    </aside>
  );
}
