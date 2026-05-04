'use client';

import Link from 'next/link';
import { useWallet } from '@/lib/wallet';
import { useToast } from '@/lib/toast';
import { useProtocolMetrics } from '@/lib/store';
import WalletButton from '@/components/WalletButton';
import type { UserRole } from '@/lib/types';

export default function Home() {
  const { wallet, role, hydrated, setRole, isAdmin } = useWallet();
  const { toast } = useToast();
  const metrics = useProtocolMetrics();

  const onPickRole = (r: UserRole) => {
    setRole(r);
    toast(`Registered as ${r}`, 'success');
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-sold-gray-900">
      <div className="nascent-bg" aria-hidden="true" />
      <div className="sigil-field" aria-hidden="true" />

      <nav className="section-shell sticky top-4 z-50 pt-4">
        <div className="ink-panel flex items-center justify-between gap-3 px-4 py-3 md:px-6">
          <span className="font-eldritch text-xl font-bold">SOLd.</span>
          <span className="hidden font-mono text-xs uppercase text-sold-gray-600 md:inline">
            Operational App
          </span>
          <WalletButton size="sm" />
        </div>
      </nav>

      <section className="section-shell relative z-10 flex min-h-[calc(100vh-12rem)] items-center justify-center pt-16 pb-24 appear">
        <div className="ink-panel w-full max-w-3xl p-10 md:p-14 text-center">
          <div className="glyph-badge mx-auto mb-6">Decentralized Sales Guild · Solana</div>
          <h1 className="shadow-word font-eldritch text-5xl font-bold leading-tight md:text-6xl">
            Earn. Prove. Scale.
          </h1>

          <div className="rune-rule my-8" />

          <p className="mx-auto max-w-xl text-base text-sold-gray-700 md:text-lg">
            The operational layer of the SOLd. Protocol. Connect your wallet, choose a role, then enter a portal.
          </p>

          {!hydrated ? (
            <div className="mt-10 font-mono text-xs uppercase text-sold-gray-600">Loading session…</div>
          ) : !wallet ? (
            <div className="mt-10 flex flex-col items-center gap-3">
              <WalletButton />
              <p className="font-mono text-[10px] uppercase text-sold-gray-600">
                Phantom · Solflare · or Dev Mock
              </p>
            </div>
          ) : !role ? (
            <div className="mt-10">
              <p className="font-mono text-xs uppercase text-sold-gray-600 mb-6">Pick Your Path</p>
              <div className="grid gap-4 md:grid-cols-3">
                <RoleCard
                  title="Driver"
                  blurb="Find merchants, submit proof, claim bounties."
                  onClick={() => onPickRole('scout')}
                />
                <RoleCard
                  title="Vendor"
                  blurb="Launch campaigns, fund escrow, scale distribution."
                  onClick={() => onPickRole('vendor')}
                />
                <RoleCard
                  title="Admin"
                  blurb="Protocol oversight: fraud, treasury, audit ledger."
                  onClick={() => onPickRole('admin')}
                />
              </div>
            </div>
          ) : (
            <div className="mt-10">
              <p className="glyph-badge mx-auto mb-6">Active Session · {role}</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {(role === 'scout' || isAdmin) && (
                  <Link href="/driver" className="btn-primary">
                    Enter Driver Hub
                  </Link>
                )}
                {(role === 'vendor' || isAdmin) && (
                  <Link href="/client" className="btn-primary">
                    Vendor Portal
                  </Link>
                )}
                {(role === 'admin' || isAdmin) && (
                  <Link href="/admin" className="btn-secondary">
                    Admin Console
                  </Link>
                )}
              </div>
              <button
                className="mt-6 font-mono text-[10px] uppercase text-sold-gray-600 underline"
                onClick={() => setRole(role === 'scout' ? 'vendor' : 'scout')}
              >
                Switch role
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="section-shell relative z-10 mb-12">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Active Campaigns" value={metrics.activeCampaigns.toString()} />
          <Stat label="Verified Volume" value={`$${metrics.totalVolume.toLocaleString()}`} />
          <Stat label="Verified Scouts" value={metrics.activeDrivers.toString()} />
          <Stat label="Escrow Reserve" value={`$${(metrics.escrowReserve / 1000).toFixed(1)}k`} />
        </div>
      </section>

      <footer className="section-shell relative z-10 pb-10 pt-8">
        <div className="border-t border-sold-gray-900 pt-6 flex justify-between items-center font-mono text-xs uppercase">
          <span>SOLd. Protocol</span>
          <span>v0.1 · Internal</span>
        </div>
      </footer>
    </main>
  );
}

function RoleCard({ title, blurb, onClick }: { title: string; blurb: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="ink-card p-6 text-left">
      <p className="font-mono text-[10px] uppercase text-sold-gray-600">I am a</p>
      <h3 className="font-eldritch text-2xl font-bold mt-2">{title}</h3>
      <div className="rune-rule my-4" />
      <p className="text-sm text-sold-gray-700">{blurb}</p>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="ink-card p-5">
      <p className="font-mono text-[10px] uppercase text-sold-gray-600">{label}</p>
      <p className="metric-number text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
