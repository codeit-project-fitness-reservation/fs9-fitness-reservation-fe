'use client';

import { ReactNode } from 'react';
import { ModalProvider } from '@/providers/ModalProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>;
}
