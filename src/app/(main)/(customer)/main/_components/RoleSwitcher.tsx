'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function RoleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const isCustomer =
    pathname.startsWith('/main') ||
    pathname.startsWith('/classes') ||
    pathname.startsWith('/centers') ||
    pathname.startsWith('/my') ||
    pathname.startsWith('/payment') ||
    pathname.startsWith('/point-charge') ||
    pathname === '/';
  const isSeller = pathname.startsWith('/seller');

  const handleSellerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // SELLER 역할이면 /seller로 이동, 아니면 로그인 페이지로 이동
    if (user && user.role === 'SELLER') {
      router.push('/seller');
    } else {
      router.push('/login?next=/seller');
    }
  };

  return (
    <div className="mb-6 flex items-center justify-center">
      <div className="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-1">
        <button
          onClick={() => router.push('/main')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            isCustomer ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-500'
          }`}
        >
          고객
        </button>
        <button
          onClick={handleSellerClick}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            isSeller ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-500'
          }`}
        >
          판매자
        </button>
      </div>
    </div>
  );
}
