'use client';

import type { ReactNode } from 'react';
import { WalletProvider } from '@/lib/wallet';
import { ToastProvider } from '@/lib/toast';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <WalletProvider>{children}</WalletProvider>
    </ToastProvider>
  );
}
