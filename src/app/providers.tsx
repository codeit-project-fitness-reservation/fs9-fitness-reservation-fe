'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth';
import { ModalProvider } from '@/providers/ModalProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ModalProvider>{children}</ModalProvider>
    </AuthProvider>
  );
}
