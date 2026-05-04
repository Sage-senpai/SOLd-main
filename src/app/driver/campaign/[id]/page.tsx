'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Nav from '@/components/Nav';
import AuthGate from '@/components/AuthGate';
import SubmitProofDialog from '@/components/SubmitProofDialog';
import { useWallet } from '@/lib/wallet';
import { useToast } from '@/lib/toast';
import {
  useCampaign,
  useMyApplications,
  useMySales,
  applyToCampaign,
} from '@/lib/store';

export default function CampaignDetail() {
  return (
    <main className="relative min-h-screen overflow-hidden text-sold-gray-900">
      <div className="nascent-bg" aria-hidden="true" />
      <Nav portal="Campaign" />
      <AuthGate requiredRole="scout" portalLabel="Campaign">
        <Inner />
      </AuthGate>
    </main>
  );
}

function Inner() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { wallet } = useWallet();
  const { toast } = useToast();
  const campaign = useCampaign(id);
  const applications = useMyApplications(wallet?.address);
  const sales = useMySales(wallet?.address);

  if (!campaign) {
    return (
      <section className="section-shell relative z-10 pt-10">
        <div className="ink-panel p-8 text-center">
          <p className="font-mono text-xs uppercase text-sold-gray-600">Campaign not found.</p>
          <Link href="/driver" className="btn-primary mt-6 inline-block">Back to Hub</Link>
        </div>
      </section>
    );
  }

  const joined = applications.some((a) => a.campaignId === campaign.id);
  const mySalesForCampaign = sales.filter((s) => s.campaignId === campaign.id);
  const verified = mySalesForCampaign.filter((s) => s.status === 'verified').length;
  const progress = Math.min(100, (verified / Math.max(campaign.targetSales, 1)) * 100);

  const join = () => {
    if (!wallet) return;
    try {
      applyToCampaign(wallet.address, campaign);
      toast(`Joined ${campaign.title}`, 'success');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Failed', 'error');
    }
  };

  return (
    <section className="section-shell relative z-10 pt-10 pb-20 space-y-6">
      <div className="ink-panel p-6 md:p-8">
        <div className="glyph-badge mb-4">{campaign.productType}</div>
        <h1 className="text-4xl font-bold mb-2">{campaign.title}</h1>
        <p className="text-sold-gray-700 max-w-2xl">{campaign.description}</p>
        <div className="rune-rule my-6" />
        <div className="grid gap-3 md:grid-cols-4">
          <Stat label="Per Sale" value={`${campaign.rewardAmount} ${campaign.rewardToken}`} />
          <Stat label="Target" value={campaign.targetSales.toString()} />
          <Stat label="Region" value={campaign.targetRegion} />
          <Stat label="Status" value={campaign.status} />
        </div>
      </div>

      <div className="ink-panel p-6 md:p-8">
        <div className="glyph-badge mb-4">Your Progress</div>
        <h2 className="text-2xl font-bold mb-4">{verified} / {campaign.targetSales} verified</h2>
        <div className="h-2 w-full bg-sold-gray-200 border border-sold-gray-900">
          <div className="h-full bg-sold-gray-900" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {!joined ? (
            <button onClick={join} className="btn-primary">Apply as Scout</button>
          ) : (
            <SubmitProofDialog
              campaign={campaign}
              trigger={(open) => (
                <button onClick={open} className="btn-primary">Submit Proof of Sale</button>
              )}
            />
          )}
          <Link href="/driver" className="btn-secondary">Back to Hub</Link>
        </div>
      </div>

      <div className="ink-panel p-6 md:p-8">
        <div className="glyph-badge mb-4">Submissions</div>
        <h2 className="text-2xl font-bold mb-4">My proofs for this campaign</h2>
        {mySalesForCampaign.length === 0 ? (
          <p className="font-mono text-xs uppercase text-sold-gray-600">No proofs submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {mySalesForCampaign.map((s) => (
              <div key={s.id} className="border border-sold-gray-900 bg-white/70 p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">{s.merchantName}</p>
                  <p className="font-mono text-xs text-sold-gray-600">{s.txHash}</p>
                </div>
                <span className="glyph-badge text-xs">{s.status}</span>
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
