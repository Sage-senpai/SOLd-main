'use client';

import Nav from '@/components/Nav';
import AuthGate from '@/components/AuthGate';
import { useAllScouts } from '@/lib/store';

export default function Leaderboard() {
  return (
    <main className="relative min-h-screen overflow-hidden text-sold-gray-900">
      <div className="nascent-bg" aria-hidden="true" />
      <Nav portal="Leaderboard" />
      <AuthGate requiredRole={['scout', 'vendor']} portalLabel="Leaderboard">
        <Inner />
      </AuthGate>
    </main>
  );
}

function Inner() {
  const scouts = useAllScouts();
  // Augment with seeded synthetic leaderboard so first-run isn't empty.
  const seeded = [
    { address: '0xAlice…f42', tier: 'platinum', salesCount: 142, earned: 7100, reputation: 98 },
    { address: 'ScoutMaster…3e1', tier: 'gold', salesCount: 128, earned: 6200, reputation: 94 },
    { address: 'Web3Runner…99b', tier: 'gold', salesCount: 104, earned: 5500, reputation: 91 },
    { address: 'DePIN_Fan…a12', tier: 'silver', salesCount: 89, earned: 4100, reputation: 80 },
  ];

  const ranked = [
    ...scouts.map((s) => ({ address: s.address, tier: s.tier, salesCount: s.salesCount, earned: s.earned, reputation: s.reputation })),
    ...seeded,
  ].sort((a, b) => b.earned - a.earned);

  return (
    <section className="section-shell relative z-10 pt-10 pb-20">
      <div className="ink-panel p-6 md:p-8">
        <div className="glyph-badge mb-4">Seasonal Performance</div>
        <h1 className="text-3xl font-bold mb-6">Global Top Scouts</h1>
        <div className="space-y-2">
          {ranked.map((s, i) => (
            <div key={`${s.address}-${i}`} className="border border-sold-gray-900 bg-white/70 p-4">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xl font-bold opacity-30 w-10">#{i + 1}</span>
                <div className="flex-1">
                  <p className="font-mono text-xs">{shortAddr(s.address)}</p>
                  <p className="font-mono text-[10px] uppercase text-sold-gray-600 mt-0.5">{s.tier}</p>
                </div>
                <div className="text-right">
                  <p className="metric-number font-bold">{s.salesCount} sales</p>
                  <p className="font-mono text-[10px] uppercase text-sold-gray-600">${s.earned.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function shortAddr(a: string) {
  if (a.includes('…')) return a;
  return a.length > 14 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
}
