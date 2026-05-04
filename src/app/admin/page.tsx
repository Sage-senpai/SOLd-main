'use client';

import { useState } from 'react';
import Nav from '@/components/Nav';
import AuthGate from '@/components/AuthGate';
import {
  useAllScouts,
  useCampaigns,
  useFraudFlags,
  useLedger,
  useProtocolMetrics,
  pauseCampaign,
} from '@/lib/store';

const TABS = [
  ['overview', 'Overview'],
  ['sbt-lifecycle', 'SBT Lifecycle'],
  ['fraud-monitor', 'Fraud Monitor'],
  ['audit-ledger', 'Audit Ledger'],
  ['drivers', 'Drivers'],
  ['campaigns', 'Campaigns'],
  ['treasury', 'Treasury'],
] as const;

export default function AdminConsole() {
  return (
    <main className="relative min-h-screen overflow-hidden text-sold-gray-900">
      <div className="nascent-bg" aria-hidden="true" />
      <Nav portal="Protocol Admin" />
      <AuthGate requiredRole="admin" portalLabel="Admin Console">
        <AdminInner />
      </AuthGate>
    </main>
  );
}

function AdminInner() {
  const [tab, setTab] = useState<typeof TABS[number][0]>('overview');
  const metrics = useProtocolMetrics();
  const scouts = useAllScouts();
  const camps = useCampaigns();
  const ledger = useLedger();
  const fraud = useFraudFlags();

  return (
    <section className="section-shell relative z-10 pt-10 pb-20">
      <div className="mb-10">
        <div className="mb-6">
          <div className="glyph-badge mb-4">Protocol Health</div>
          <h1 className="text-4xl font-bold">Guild Operations Center</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Stat label="Total Volume" value={`$${metrics.totalVolume.toLocaleString()}`} />
          <Stat label="Platform Fees (15%)" value={`$${metrics.platformFees.toFixed(0).toLocaleString()}`} />
          <Stat label="Active Drivers" value={metrics.activeDrivers.toString()} />
          <Stat label="Fraud Flags" value={metrics.fraudFlags.toString()} />
        </div>
      </div>

      <div className="ink-panel mb-8">
        <div className="flex border-b border-sold-gray-900 overflow-x-auto">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`whitespace-nowrap px-6 py-3 font-mono text-xs uppercase font-bold transition ${
                tab === key
                  ? 'border-b-2 border-sold-gray-900 text-sold-gray-900'
                  : 'text-sold-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8">
          {tab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-4">Treasury Status</h3>
              <Row title="Treasury Wallet (Solana)" value={`$${metrics.platformFees.toFixed(0).toLocaleString()}`} sub="SOLD…7XqK" />
              <Row title="Escrow Reserve" value={`$${metrics.escrowReserve.toLocaleString()}`} sub={`${metrics.activeCampaigns} active campaigns`} />
            </div>
          )}

          {tab === 'sbt-lifecycle' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-4">Driver Credentials</h3>
              {scouts.length === 0 ? (
                <p className="font-mono text-xs uppercase text-sold-gray-600">No scouts onboarded yet.</p>
              ) : (
                <div className="space-y-3">
                  {scouts.map((s) => (
                    <div key={s.address} className="border border-sold-gray-900 bg-white/70 p-4">
                      <div className="grid md:grid-cols-5 gap-4 items-center">
                        <Cell label="Driver" value={`${s.address.slice(0, 6)}…${s.address.slice(-4)}`} />
                        <Cell label="Tier" value={s.tier} />
                        <Cell label="Volume" value={`$${s.earned.toLocaleString()}`} />
                        <p className="glyph-badge text-xs text-center">Active</p>
                        <button className="btn-secondary text-xs text-center">Promote</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'fraud-monitor' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-4">Active Fraud Flags</h3>
              <div className="space-y-3">
                {fraud.map((f) => (
                  <div key={f.id} className="border border-sold-gray-900 bg-white/70 p-4">
                    <div className="grid md:grid-cols-5 gap-4 items-start">
                      <Cell label="Referral" value={f.ref} />
                      <Cell label="Flag" value={f.flag} />
                      <Cell label="Severity" value={f.severity} />
                      <div className="md:col-span-2">
                        <p className="font-mono text-xs uppercase text-sold-gray-600 mb-1">Details</p>
                        <p className="text-sm text-sold-gray-700">{f.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'audit-ledger' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-4">Transaction Log</h3>
              <div className="space-y-2 font-mono text-sm">
                {ledger.map((l) => (
                  <div key={l.id} className="flex justify-between items-center gap-4 py-2 border-b border-sold-gray-200">
                    <span className="text-sold-gray-600">{new Date(l.ts).toLocaleTimeString()}</span>
                    <span>{l.action}</span>
                    <span className="text-sold-gray-600">{l.ref}</span>
                    <span className="text-right font-bold">{l.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'drivers' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-4">All Drivers</h3>
              {scouts.length === 0 ? (
                <p className="font-mono text-xs uppercase text-sold-gray-600">No drivers yet.</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {scouts.map((s) => (
                    <div key={s.address} className="border border-sold-gray-900 bg-white/70 p-4">
                      <p className="font-mono text-xs uppercase text-sold-gray-600">{s.address}</p>
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <Cell label="Tier" value={s.tier} />
                        <Cell label="Sales" value={s.salesCount.toString()} />
                        <Cell label="Earned" value={`$${s.earned}`} />
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="btn-secondary text-xs flex-1">Suspend</button>
                        <button className="btn-secondary text-xs flex-1">Flag</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'campaigns' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-4">All Campaigns</h3>
              <div className="space-y-3">
                {camps.map((c) => (
                  <div key={c.id} className="border border-sold-gray-900 bg-white/70 p-4">
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      <div className="md:col-span-2">
                        <p className="font-bold">{c.title}</p>
                        <p className="font-mono text-xs text-sold-gray-600">{c.id}</p>
                      </div>
                      <Cell label="Status" value={c.status} />
                      <Cell label="Escrow" value={`$${c.escrowAmount.toLocaleString()}`} />
                      <button onClick={() => pauseCampaign(c.id)} className="btn-secondary text-xs">
                        {c.status === 'active' ? 'Pause' : 'Resume'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'treasury' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-4">Treasury Actions</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <ActionCard
                  title="Withdraw Platform Fees"
                  blurb={`$${metrics.platformFees.toFixed(0)} available · 15% of verified volume.`}
                  cta="Withdraw"
                />
                <ActionCard
                  title="Top-up Escrow Reserve"
                  blurb="Backstop for late settlements & disputes."
                  cta="Top-up"
                />
                <ActionCard
                  title="Sign Multi-sig Tx"
                  blurb="Pending: 0 transactions awaiting co-signature."
                  cta="Open"
                />
                <ActionCard
                  title="Rotate Admin Keys"
                  blurb="Quarterly key rotation per security policy."
                  cta="Rotate"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-sold-gray-900 pt-6 font-mono text-xs uppercase">
        <p>Protocol Integrity. Perfect Ledgers.</p>
      </footer>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="ink-card p-6">
      <p className="font-mono text-xs uppercase text-sold-gray-600 mb-2">{label}</p>
      <p className="metric-number text-2xl font-bold">{value}</p>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-mono text-xs uppercase text-sold-gray-600">{label}</p>
      <p className="metric-number text-sm font-bold">{value}</p>
    </div>
  );
}

function Row({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="border border-sold-gray-900 bg-white/70 p-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="font-mono text-xs uppercase text-sold-gray-600 mb-1">{title}</p>
          {sub && <p className="font-mono text-xs text-sold-gray-500">{sub}</p>}
        </div>
        <p className="metric-number text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function ActionCard({ title, blurb, cta }: { title: string; blurb: string; cta: string }) {
  return (
    <div className="ink-card p-5">
      <p className="font-mono text-[10px] uppercase text-sold-gray-600 mb-2">Treasury Action</p>
      <h4 className="font-bold mb-2">{title}</h4>
      <p className="text-sm text-sold-gray-700 mb-4">{blurb}</p>
      <button className="btn-primary text-xs">{cta}</button>
    </div>
  );
}
