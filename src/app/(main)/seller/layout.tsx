'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authFetch } from '@/lib/api';

type AllowedRole = 'SELLER';

export default function SellerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const me = await authFetch<{ id: string; role: AllowedRole | string }>('/api/auth/me');
      if (!mounted) return;

      if (!me.ok) {
        setAuthorized(false);
        router.replace('/login?next=/seller');
        return;
      }

      if (me.data.role !== 'SELLER') {
        setAuthorized(false);
        router.replace('/');
        return;
      }

      setAuthorized(true);
    };

    void check();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (authorized !== true) return null;

  return <>{children}</>;
}
