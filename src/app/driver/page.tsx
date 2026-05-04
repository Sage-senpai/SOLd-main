'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import Nav from '@/components/Nav';
import AuthGate from '@/components/AuthGate';
import SubmitProofDialog from '@/components/SubmitProofDialog';
import { useWallet } from '@/lib/wallet';
import { useToast } from '@/lib/toast';
import {
  useCampaigns,
  useMyApplications,
  useMySales,
  useUserMeta,
  applyToCampaign,
} from '@/lib/store';

export default function DriverHub() {
  return (
    <main className="relative min-h-screen overflow-hidden text-sold-gray-900">
      <div className="nascent-bg" aria-hidden="true" />
      <Nav portal="Driver Hub" />
      <AuthGate requiredRole="scout" portalLabel="Driver Hub">
        <DriverInner />
      </AuthGate>
    </main>
  );
}

function DriverInner() {
  const { wallet, shortAddress } = useWallet();
  const { toast } = useToast();
  const campaigns = useCampaigns({ activeOnly: true });
  const applications = useMyApplications(wallet?.address);
  const sales = useMySales(wallet?.address);
  const meta = useUserMeta(wallet?.address);

  const verifiedSales = useMemo(() => sales.filter((s) => s.status === 'verified'), [sales]);
  const totalEarned = verifiedSales.reduce((acc, s) => acc + s.payoutAmount, 0);
  const pending = sales.filter((s) => s.status === 'pending').reduce((acc, s) => acc + s.payoutAmount, 0);

  const onApply = (campaign: typeof campaigns[number]) => {
    if (!wallet) return;
    try {
      applyToCampaign(wallet.address, campaign);
      toast(`Joined ${campaign.title}`, 'success');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Failed', 'error');
    }
  };

  return (
    <section className="section-shell relative z-10 pt-10 pb-20">
      <div className="ink-panel mb-10 p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase text-sold-gray-600 mb-2">Your Reputation</p>
            <h1 className="text-4xl font-bold mb-6">Soul Stat / {shortAddress}</h1>
            <div className="space-y-4">
              <Metric label="Verified Earnings" value={`$${totalEarned.toLocaleString()}`} />
              <Metric label="Reputation" value={`${meta?.reputation ?? 50}/100`} />
            </div>
          </div>
          <div className="space-y-3">
            {[
              ['SBT Tier', meta?.tier ?? 'bronze'],
              ['Active Campaigns', applications.length.toString()],
              ['Pending Payouts', `$${pending.toLocaleString()}`],
              ['Status', meta ? 'Active' : 'New'],
            ].map(([label, value]) => (
              <div key={label} className="border border-sold-gray-900 bg-white/70 p-3">
                <p className="font-mono text-xs uppercase text-sold-gray-600">{label}</p>
                <p className="metric-number mt-2 text-lg font-bold">{value}</p>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Link href="/driver/profile" className="btn-secondary text-center text-xs">Profile</Link>
              <Link href="/driver/leaderboard" className="btn-secondary text-center text-xs">Ranks</Link>
              <Link href="/driver/onboarding" className="btn-secondary text-center text-xs">Onboard</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="mb-6">
          <div className="glyph-badge mb-4">Active Bounties</div>
          <h2 className="text-3xl font-bold">Campaigns Seeking Scouts</h2>
        </div>
        {campaigns.length === 0 ? (
          <div className="ink-card p-8">
            <p className="text-sold-gray-700">No campaigns available — check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {campaigns.map((c) => {
              const joined = applications.some((a) => a.campaignId === c.id);
              return (
                <article key={c.id} className="ink-card p-6">
                  <p className="font-mono text-xs uppercase text-sold-gray-600">100% of bounty</p>
                  <h3 className="mt-4 text-2xl font-bold">{c.title}</h3>
                  <div className="rune-rule my-4" />
                  <div className="space-y-3 mb-6">
                    <Row label="Per Sale" value={`${c.rewardAmount} ${c.rewardToken}`} />
                    <Row label="Region" value={c.targetRegion} />
                    <Row label="Type" value={c.productType} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/driver/campaign/${c.id}`} className="btn-secondary text-center text-xs">
                      Details
                    </Link>
                    {joined ? (
                      <SubmitProofDialog
                        campaign={c}
                        trigger={(open) => (
                          <button onClick={open} className="btn-primary text-xs">
                            Submit Proof
                          </button>
                        )}
                      />
                    ) : (
                      <button onClick={() => onApply(c)} className="btn-primary text-xs">
                        Claim Campaign
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <div className="ink-panel p-6 md:p-8">
        <div className="mb-6">
          <div className="glyph-badge mb-4">Escrow Status</div>
          <h2 className="text-3xl font-bold">Pending Payouts</h2>
        </div>
        {sales.length === 0 ? (
          <p className="font-mono text-xs uppercase text-sold-gray-600">
            No proofs submitted yet. Claim a campaign to start.
          </p>
        ) : (
          <div className="space-y-3">
            {sales.map((s) => (
              <div key={s.id} className="border border-sold-gray-900 bg-white/70 p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-mono text-xs uppercase text-sold-gray-600 mb-1">
                      {s.campaignTitle} · {s.merchantName}
                    </p>
                    <p className="metric-number text-xl font-bold">${s.payoutAmount.toLocaleString()}</p>
                  </div>
                  <p className="glyph-badge text-xs">{statusLabel(s.status)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase text-sold-gray-600 mb-2">{label}</p>
      <p className="metric-number text-3xl font-bold">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start">
      <span className="font-mono text-xs text-sold-gray-600">{label}</span>
      <span className="font-mono text-xs uppercase font-bold">{value}</span>
    </div>
  );
}

function statusLabel(s: string) {
  if (s === 'verified') return 'Released';
  if (s === 'rejected') return 'Rejected';
  return 'Challenge Window (48h)';
}
