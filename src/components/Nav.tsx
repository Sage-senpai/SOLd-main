'use client';

import Link from 'next/link';
import WalletButton from './WalletButton';

export default function Nav({ portal }: { portal?: string }) {
  return (
    <nav className="section-shell sticky top-4 z-50 pt-4">
      <div className="ink-panel flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="font-eldritch text-xl font-bold">
          SOLd.
        </Link>
        {portal && (
          <span className="hidden font-mono text-xs uppercase text-sold-gray-600 md:inline">
            {portal}
          </span>
        )}
        <WalletButton size="sm" />
      </div>
    </nav>
  );
}
