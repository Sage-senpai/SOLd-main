'use client';

import Link from 'next/link';
import { useState } from 'react';
import Nav from '@/components/Nav';
import AuthGate from '@/components/AuthGate';
import { useWallet } from '@/lib/wallet';
import { useMySales, useUserMeta } from '@/lib/store';

export default function DriverProfile() {
  return (
    <main className="relative min-h-screen overflow-hidden text-sold-gray-900">
      <div className="nascent-bg" aria-hidden="true" />
      <Nav portal="Driver Profile" />
      <AuthGate requiredRole="scout" portalLabel="Driver Profile">
        <Inner />
      </AuthGate>
    </main>
  );
}

function Inner() {
  const { wallet } = useWallet();
  const meta = useUserMeta(wallet?.address);
  const sales = useMySales(wallet?.address);
  const [notif, setNotif] = useState({ payouts: true, fraud: true, campaigns: false });

  const exportHistory = () => {
    if (typeof window === 'undefined') return;
    const blob = new Blob([JSON.stringify(sales, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sold-sales-${wallet?.address.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="section-shell relative z-10 pt-10 pb-20 grid gap-6 md:grid-cols-3">
      <div className="ink-panel md:col-span-2 p-6 md:p-8">
        <div className="glyph-badge mb-4">Identity</div>
        <h1 className="text-3xl font-bold mb-2">Soul Stat</h1>
        <p className="font-mono text-xs text-sold-gray-600 mb-6 break-all">{wallet?.address}</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Stat label="SBT Tier" value={meta?.tier ?? 'bronze'} />
          <Stat label="Reputation" value={`${meta?.reputation ?? 50}/100`} />
          <Stat label="Verified Sales" value={sales.filter((s) => s.status === 'verified').length.toString()} />
          <Stat label="Total Earned" value={`$${(meta?.totalEarnings ?? 0).toLocaleString()}`} />
        </div>

        <div className="rune-rule my-6" />

        <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
        <div className="space-y-2">
          {(Object.entries(notif) as [keyof typeof notif, boolean][]).map(([k, v]) => (
            <label key={k} className="flex items-center justify-between border border-sold-gray-900 bg-white/70 p-3 cursor-pointer">
              <span className="font-mono text-xs uppercase text-sold-gray-700">{k}</span>
              <input
                type="checkbox"
                checked={v}
                onChange={(e) => setNotif({ ...notif, [k]: e.target.checked })}
              />
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button className="btn-secondary text-xs" onClick={exportHistory}>Export History (JSON)</button>
          <Link href="/driver" className="btn-primary text-xs">Back to Hub</Link>
        </div>
      </div>

      <div className="ink-card p-6">
        <p className="font-mono text-[10px] uppercase text-sold-gray-600 mb-2">Next Milestone</p>
        <h3 className="font-bold text-lg mb-3">Promote to Silver</h3>
        <div className="space-y-2 text-sm">
          <p>Need: 10 verified sales · current {sales.filter((s) => s.status === 'verified').length}.</p>
          <p>Reputation ≥ 70 · current {meta?.reputation ?? 50}.</p>
        </div>
        <div className="rune-rule my-4" />
        <p className="font-mono text-[10px] uppercase text-sold-gray-600">Tier rewards higher payouts and exclusive premium campaigns.</p>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-sold-gray-900 bg-white/70 p-3">
      <p className="font-mono text-xs uppercase text-sold-gray-600">{label}</p>
      <p className="metric-number mt-2 text-lg font-bold">{value}</p>
    </div>
  );
}
