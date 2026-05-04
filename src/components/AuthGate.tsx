'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useWallet } from '@/lib/wallet';
import WalletButton from './WalletButton';
import type { UserRole } from '@/lib/types';

export default function AuthGate({
  children,
  requiredRole,
  allowGuest = false,
  portalLabel,
}: {
  children: ReactNode;
  requiredRole: UserRole | UserRole[];
  allowGuest?: boolean;
  portalLabel?: string;
}) {
  const { wallet, role, hydrated, isAdmin } = useWallet();
  const required = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (!hydrated) {
    return (
      <div className="ink-panel mx-auto mt-20 max-w-md p-8 text-center">
        <p className="font-mono text-xs uppercase text-sold-gray-600">Loading session…</p>
      </div>
    );
  }

  // Admin always allowed.
  if (isAdmin) return <>{children}</>;

  if (!wallet) {
    if (allowGuest) return <>{children}</>;
    return (
      <div className="ink-panel mx-auto mt-20 max-w-lg p-10 text-center">
        <div className="glyph-badge mx-auto mb-4">{portalLabel ?? 'Restricted'}</div>
        <h2 className="text-3xl font-bold mb-3">Wallet Required</h2>
        <p className="text-sold-gray-700 mb-6">
          Connect a Solana wallet to enter this portal. Your address is your identity.
        </p>
        <div className="flex justify-center">
          <WalletButton />
        </div>
        <div className="rune-rule my-8" />
        <Link href="/" className="font-mono text-xs uppercase text-sold-gray-600 underline">
          Back to portal selector
        </Link>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="ink-panel mx-auto mt-20 max-w-lg p-10 text-center">
        <div className="glyph-badge mx-auto mb-4">Pick a Role</div>
        <h2 className="text-3xl font-bold mb-3">No Role Assigned</h2>
        <p className="text-sold-gray-700 mb-6">
          Pick your role on the landing page before entering a portal.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Choose Role
        </Link>
      </div>
    );
  }

  if (!required.includes(role)) {
    return (
      <div className="ink-panel mx-auto mt-20 max-w-lg p-10 text-center">
        <div className="glyph-badge mx-auto mb-4">Wrong Portal</div>
        <h2 className="text-3xl font-bold mb-3">This Portal Is For {required.join(' / ')}</h2>
        <p className="text-sold-gray-700 mb-6">
          Your current role is <span className="font-bold uppercase">{role}</span>. Switch on the landing page if you need a different portal.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Back to Landing
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
