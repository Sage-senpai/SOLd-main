'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ensureUser, setUserRole as storeSetRole } from './store';
import type { UserRole } from './types';

type Provider = 'phantom' | 'solflare' | 'mock';

type Wallet = {
  address: string;
  provider: Provider;
};

type Session = Wallet & { role: UserRole | null };

type Ctx = {
  wallet: Wallet | null;
  role: UserRole | null;
  hydrated: boolean;
  isAdmin: boolean;
  connect: (provider?: Provider) => Promise<void>;
  disconnect: () => Promise<void>;
  setRole: (role: UserRole) => void;
  shortAddress: string;
};

const KEY = 'sold.session.v1';

// Comma-separated NEXT_PUBLIC_ADMIN_ADDRESSES gives admin powers to those addresses.
// In dev, the mock wallet always has admin gateway via the role selector.
function isAdminAddress(address: string) {
  const env = process.env.NEXT_PUBLIC_ADMIN_ADDRESSES ?? '';
  return env
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .includes(address);
}

function shorten(addr: string) {
  return addr.length <= 10 ? addr : `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

type SolanaWindow = {
  solana?: {
    isPhantom?: boolean;
    publicKey?: { toString: () => string };
    connect: () => Promise<{ publicKey: { toString: () => string } }>;
    disconnect: () => Promise<void>;
  };
  solflare?: {
    isSolflare?: boolean;
    publicKey?: { toString: () => string };
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
  };
};

async function connectProvider(provider: Provider): Promise<Wallet> {
  if (typeof window === 'undefined') throw new Error('Client only');
  const w = window as unknown as SolanaWindow;

  if (provider === 'phantom') {
    if (!w.solana?.isPhantom) throw new Error('Phantom not detected. Install at phantom.app');
    const res = await w.solana.connect();
    return { address: res.publicKey.toString(), provider: 'phantom' };
  }

  if (provider === 'solflare') {
    if (!w.solflare) throw new Error('Solflare not detected. Install at solflare.com');
    await w.solflare.connect();
    const pk = w.solflare.publicKey?.toString();
    if (!pk) throw new Error('Solflare did not return a public key');
    return { address: pk, provider: 'solflare' };
  }

  // Mock — generate a deterministic-looking address for local dev when no wallet is installed.
  const stored = window.localStorage.getItem('sold.mockAddress');
  const address = stored ?? `MOCK${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString(36).slice(-4).toUpperCase()}`;
  window.localStorage.setItem('sold.mockAddress', address);
  return { address, provider: 'mock' };
}

const WalletCtx = createContext<Ctx | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [role, setLocalRole] = useState<UserRole | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate session from localStorage.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw) as Session;
        setWallet({ address: s.address, provider: s.provider });
        setLocalRole(s.role);
        if (s.role) ensureUser(s.address, s.role);
      }
    } catch {}
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Session | null) => {
    try {
      if (next) window.localStorage.setItem(KEY, JSON.stringify(next));
      else window.localStorage.removeItem(KEY);
    } catch {}
  }, []);

  const connect = useCallback(async (provider: Provider = 'phantom') => {
    const w = await connectProvider(provider);
    setWallet(w);
    persist({ ...w, role });
  }, [persist, role]);

  const disconnect = useCallback(async () => {
    try {
      const win = window as unknown as SolanaWindow;
      if (wallet?.provider === 'phantom') await win.solana?.disconnect?.();
      if (wallet?.provider === 'solflare') await win.solflare?.disconnect?.();
    } catch {}
    setWallet(null);
    setLocalRole(null);
    persist(null);
  }, [persist, wallet?.provider]);

  const setRole = useCallback((r: UserRole) => {
    setLocalRole(r);
    if (wallet) {
      ensureUser(wallet.address, r);
      storeSetRole(wallet.address, r);
      persist({ ...wallet, role: r });
    }
  }, [persist, wallet]);

  const value = useMemo<Ctx>(
    () => ({
      wallet,
      role,
      hydrated,
      isAdmin: !!wallet && (role === 'admin' || isAdminAddress(wallet.address)),
      connect,
      disconnect,
      setRole,
      shortAddress: wallet ? shorten(wallet.address) : '',
    }),
    [wallet, role, hydrated, connect, disconnect, setRole],
  );

  return <WalletCtx.Provider value={value}>{children}</WalletCtx.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletCtx);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
