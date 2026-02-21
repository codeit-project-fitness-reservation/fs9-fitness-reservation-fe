'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authFetch } from '@/lib/api';

type AllowedRole = 'CUSTOMER';

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const me = await authFetch<{ id: string; role: AllowedRole | string }>('/api/auth/me');
      if (!mounted) return;

      if (!me.ok) {
        setAuthorized(false);
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if (me.data.role !== 'CUSTOMER') {
        setAuthorized(false);
        if (me.data.role === 'SELLER') {
          router.replace('/seller');
        } else if (me.data.role === 'ADMIN') {
          router.replace('/admin');
        } else {
          router.replace('/');
        }
        return;
      }

      setAuthorized(true);
    };

    void check();
    return () => {
      mounted = false;
    };
  }, [router, pathname]);

  if (authorized !== true) return null;

  return <>{children}</>;
}
