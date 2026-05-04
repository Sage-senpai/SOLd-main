'use client';

import Link from 'next/link';
import Nav from '@/components/Nav';
import AuthGate from '@/components/AuthGate';
import CreateCampaignDialog from '@/components/CreateCampaignDialog';
import { useWallet } from '@/lib/wallet';
import { useToast } from '@/lib/toast';
import {
  useCampaigns,
  useVendorSales,
  reviewSale,
  pauseCampaign,
} from '@/lib/store';

export default function ClientPortal() {
  return (
    <main className="relative min-h-screen overflow-hidden text-sold-gray-900">
      <div className="nascent-bg" aria-hidden="true" />
      <Nav portal="Vendor Portal" />
      <AuthGate requiredRole="vendor" portalLabel="Vendor Portal">
        <ClientInner />
      </AuthGate>
    </main>
  );
}

function ClientInner() {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const myCampaigns = useCampaigns({ vendorAddress: wallet?.address });
  const sales = useVendorSales(wallet?.address);
  const verified = sales.filter((s) => s.status === 'verified');
  const pending = sales.filter((s) => s.status === 'pending');

  const totalSpent = verified.reduce((acc, s) => acc + s.payoutAmount, 0);
  const conversionRate = sales.length === 0 ? 0 : (verified.length / sales.length) * 100;
  const avgCAC = verified.length === 0 ? 0 : totalSpent / verified.length;

  const onReview = (id: string, decision: 'verified' | 'rejected') => {
    reviewSale(id, decision);
    toast(decision === 'verified' ? 'Payout released' : 'Submission rejected', decision === 'verified' ? 'success' : 'info');
  };

  return (
    <section className="section-shell relative z-10 pt-10 pb-20">
      <div className="mb-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="glyph-badge mb-4">Campaign Performance</div>
            <h1 className="text-4xl font-bold">Your Distribution Network</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/client/onboarding" className="btn-secondary text-xs">Onboarding</Link>
            <Link href="/client/analytics" className="btn-secondary text-xs">Analytics</Link>
            <Link href="/client/create" className="btn-primary">Launch Campaign</Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Stat label="Total Spent" value={`$${totalSpent.toLocaleString()}`} />
          <Stat label="Active Drivers" value={Math.max(myCampaigns.length, 1).toString()} />
          <Stat label="Conversion Rate" value={`${conversionRate.toFixed(1)}%`} />
          <Stat label="Avg CAC" value={avgCAC ? `$${avgCAC.toFixed(0)}` : '—'} />
        </div>
      </div>

      <div className="ink-panel mb-10 p-6 md:p-8">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div>
            <div className="glyph-badge mb-4">Active Campaigns</div>
            <h2 className="text-3xl font-bold">Escrow Contracts</h2>
          </div>
          <CreateCampaignDialog
            trigger={(open) => (
              <button onClick={open} className="btn-primary">
                Launch Campaign
              </button>
            )}
          />
        </div>

        {myCampaigns.length === 0 ? (
          <p className="text-sold-gray-700 font-mono text-sm">
            No campaigns yet. Launch one to start funding scouts.
          </p>
        ) : (
          <div className="space-y-3">
            {myCampaigns.map((c) => {
              const camSales = sales.filter((s) => s.campaignId === c.id);
              const camVerified = camSales.filter((s) => s.status === 'verified').length;
              const roi = c.escrowAmount === 0 ? 0 : (camVerified * c.rewardAmount) / c.escrowAmount;
              return (
                <div key={c.id} className="border border-sold-gray-900 bg-white/70 p-4">
                  <div className="grid md:grid-cols-6 gap-4 items-center">
                    <div className="md:col-span-2">
                      <p className="font-bold text-sm">{c.title}</p>
                      <p className="font-mono text-xs text-sold-gray-600 mt-1">
                        Escrow: ${c.escrowAmount.toLocaleString()} · {c.status}
                      </p>
                    </div>
                    <Cell label="Active" value={camSales.length.toString()} />
                    <Cell label="Verified" value={camVerified.toString()} />
                    <Cell label="ROI" value={`${(roi * 100).toFixed(0)}%`} />
                    <div className="flex gap-2">
                      <Link
                        href={`/client/campaign/${c.id}`}
                        className="btn-secondary text-center text-xs flex-1"
                      >
                        Manage
                      </Link>
                      <button
                        onClick={() => pauseCampaign(c.id)}
                        className="border border-sold-gray-900 bg-white/70 px-3 py-2 font-mono text-[10px] uppercase"
                      >
                        {c.status === 'active' ? 'Pause' : 'Resume'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="ink-panel mb-10 p-6 md:p-8">
        <div className="mb-6 flex justify-between items-center gap-4 flex-wrap">
          <div>
            <div className="glyph-badge mb-4">Verification Queue</div>
            <h2 className="text-3xl font-bold">Proof Review · {pending.length}</h2>
          </div>
          <p className="font-mono text-xs uppercase text-sold-gray-600">
            Approve to release escrow · Reject to dispute
          </p>
        </div>

        {pending.length === 0 ? (
          <p className="font-mono text-xs uppercase text-sold-gray-600">No proofs awaiting review.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((s) => (
              <div key={s.id} className="border border-sold-gray-900 bg-white/70 p-4">
                <div className="grid md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-2">
                    <p className="font-mono text-xs uppercase text-sold-gray-600">{s.campaignTitle}</p>
                    <p className="font-bold mt-1">{s.merchantName}</p>
                  </div>
                  <Cell label="Scout" value={`${s.scoutAddress.slice(0, 4)}…${s.scoutAddress.slice(-4)}`} />
                  <Cell label="Tx" value={s.txHash.slice(0, 8) + '…'} />
                  <Cell label="Reward" value={`$${s.payoutAmount}`} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => onReview(s.id, 'rejected')}
                      className="border border-sold-gray-900 bg-white/70 px-3 py-2 font-mono text-[10px] uppercase flex-1"
                    >
                      Reject
                    </button>
                    <button onClick={() => onReview(s.id, 'verified')} className="btn-primary text-xs flex-1">
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="ink-panel p-6 md:p-8">
        <div className="mb-6">
          <div className="glyph-badge mb-4">Network Distribution</div>
          <h2 className="text-3xl font-bold">Coverage</h2>
        </div>
        <div className="space-y-3">
          {regionAggregate(myCampaigns).map((item) => (
            <div key={item.region} className="border border-sold-gray-900 bg-white/70 p-4">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <p className="font-mono text-xs uppercase text-sold-gray-600 mb-1">{item.region}</p>
                  <p className="font-bold">{item.campaigns} Campaigns</p>
                </div>
                <p className="metric-number text-lg font-bold">${item.escrow.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function regionAggregate(camps: ReturnType<typeof useCampaigns>) {
  const map = new Map<string, { region: string; campaigns: number; escrow: number }>();
  camps.forEach((c) => {
    const cur = map.get(c.targetRegion) ?? { region: c.targetRegion, campaigns: 0, escrow: 0 };
    cur.campaigns += 1;
    cur.escrow += c.escrowAmount;
    map.set(c.targetRegion, cur);
  });
  if (map.size === 0) {
    return [{ region: 'Global', campaigns: 0, escrow: 0 }];
  }
  return Array.from(map.values());
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
      <p className="metric-number text-lg font-bold">{value}</p>
    </div>
  );
}
