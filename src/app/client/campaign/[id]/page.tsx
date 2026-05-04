'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Nav from '@/components/Nav';
import AuthGate from '@/components/AuthGate';
import { useWallet } from '@/lib/wallet';
import { useToast } from '@/lib/toast';
import {
  useCampaign,
  useVendorSales,
  pauseCampaign,
  reviewSale,
} from '@/lib/store';

export default function VendorCampaignManage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-sold-gray-900">
      <div className="nascent-bg" aria-hidden="true" />
      <Nav portal="Manage Campaign" />
      <AuthGate requiredRole="vendor" portalLabel="Manage Campaign">
        <Inner />
      </AuthGate>
    </main>
  );
}

function Inner() {
  const params = useParams<{ id: string }>();
  const { wallet } = useWallet();
  const { toast } = useToast();
  const campaign = useCampaign(params?.id);
  const vendorSales = useVendorSales(wallet?.address);

  if (!campaign) {
    return (
      <section className="section-shell relative z-10 pt-10">
        <div className="ink-panel p-8 text-center">
          <p className="font-mono text-xs uppercase text-sold-gray-600">Campaign not found.</p>
          <Link href="/client" className="btn-primary mt-6 inline-block">Back</Link>
        </div>
      </section>
    );
  }

  const pending = vendorSales.filter((s) => s.campaignId === campaign.id && s.status === 'pending');
  const verified = vendorSales.filter((s) => s.campaignId === campaign.id && s.status === 'verified');

  return (
    <section className="section-shell relative z-10 pt-10 pb-20 space-y-6">
      <div className="ink-panel p-6 md:p-8">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <div className="glyph-badge mb-3">{campaign.status}</div>
            <h1 className="text-4xl font-bold">{campaign.title}</h1>
            <p className="text-sold-gray-700 mt-2 max-w-2xl">{campaign.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                pauseCampaign(campaign.id);
                toast(`Campaign ${campaign.status === 'active' ? 'paused' : 'resumed'}`, 'info');
              }}
              className="btn-secondary text-xs"
            >
              {campaign.status === 'active' ? 'Pause' : 'Resume'}
            </button>
            <Link href="/client" className="btn-primary text-xs">Back to Portal</Link>
          </div>
        </div>
        <div className="rune-rule my-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Reward / Sale" value={`${campaign.rewardAmount} ${campaign.rewardToken}`} />
          <Stat label="Target" value={campaign.targetSales.toString()} />
          <Stat label="Verified" value={verified.length.toString()} />
          <Stat label="Pending" value={pending.length.toString()} />
        </div>
      </div>

      <div className="ink-panel p-6 md:p-8">
        <div className="glyph-badge mb-4">Verification Queue</div>
        <h2 className="text-2xl font-bold mb-4">Proof Review</h2>
        {pending.length === 0 ? (
          <p className="font-mono text-xs uppercase text-sold-gray-600">No proofs awaiting review.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((s) => (
              <div key={s.id} className="border border-sold-gray-900 bg-white/70 p-4">
                <div className="grid md:grid-cols-5 gap-4 items-center">
                  <div className="md:col-span-2">
                    <p className="font-bold">{s.merchantName}</p>
                    <p className="font-mono text-xs text-sold-gray-600 break-all">{s.txHash}</p>
                  </div>
                  <Cell label="Scout" value={`${s.scoutAddress.slice(0, 4)}…${s.scoutAddress.slice(-4)}`} />
                  <Cell label="Reward" value={`$${s.payoutAmount}`} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        reviewSale(s.id, 'rejected');
                        toast('Submission rejected', 'info');
                      }}
                      className="border border-sold-gray-900 bg-white/70 px-3 py-2 font-mono text-[10px] uppercase flex-1"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        reviewSale(s.id, 'verified');
                        toast('Payout released', 'success');
                      }}
                      className="btn-primary text-xs flex-1"
                    >
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
        <div className="glyph-badge mb-4">Verified Sales</div>
        <h2 className="text-2xl font-bold mb-4">Released Payouts</h2>
        {verified.length === 0 ? (
          <p className="font-mono text-xs uppercase text-sold-gray-600">No payouts released yet.</p>
        ) : (
          <div className="space-y-2">
            {verified.map((s) => (
              <div key={s.id} className="flex justify-between items-center border border-sold-gray-900 bg-white/70 p-3">
                <div>
                  <p className="font-bold text-sm">{s.merchantName}</p>
                  <p className="font-mono text-xs text-sold-gray-600">
                    {s.scoutAddress.slice(0, 6)}… · {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="metric-number font-bold">+${s.payoutAmount}</p>
              </div>
            ))}
          </div>
        )}
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

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-mono text-xs uppercase text-sold-gray-600">{label}</p>
      <p className="metric-number text-sm font-bold">{value}</p>
    </div>
  );
}
