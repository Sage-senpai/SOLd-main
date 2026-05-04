'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import AuthGate from '@/components/AuthGate';
import { useWallet } from '@/lib/wallet';
import { useToast } from '@/lib/toast';
import { createCampaign } from '@/lib/store';

const STEPS = ['Brief', 'Targeting', 'Budget & Escrow', 'Review'];

export default function CreateCampaignWizard() {
  return (
    <main className="relative min-h-screen overflow-hidden text-sold-gray-900">
      <div className="nascent-bg" aria-hidden="true" />
      <Nav portal="Launch Campaign" />
      <AuthGate requiredRole="vendor" portalLabel="Launch Campaign">
        <Wizard />
      </AuthGate>
    </main>
  );
}

function Wizard() {
  const router = useRouter();
  const { wallet } = useWallet();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    title: '',
    description: '',
    productType: 'Hardware',
    region: 'Global',
    duration: '30',
    reward: 50,
    target: 100,
    token: 'USDC' as 'USDC' | 'SOL',
  });

  const escrow = data.reward * data.target;

  const update = <K extends keyof typeof data>(k: K, v: typeof data[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const deploy = () => {
    if (!wallet) return;
    const c = createCampaign({
      vendorAddress: wallet.address,
      title: data.title,
      description: data.description,
      productType: data.productType,
      rewardAmount: data.reward,
      rewardToken: data.token,
      targetSales: data.target,
      targetRegion: data.region,
      escrowAmount: escrow,
    });
    toast('Campaign deployed · escrow locked', 'success');
    router.push(`/client/campaign/${c.id}`);
  };

  return (
    <section className="section-shell relative z-10 pt-10 pb-20">
      <div className="ink-panel max-w-3xl mx-auto p-6 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <div className="glyph-badge">Step {step + 1} / {STEPS.length}</div>
          <Link href="/client" className="font-mono text-xs uppercase text-sold-gray-600 underline">
            Cancel
          </Link>
        </div>
        <h1 className="font-eldritch text-4xl font-bold mb-2">{STEPS[step]}</h1>
        <div className="rune-rule my-6" />

        {step === 0 && (
          <div className="space-y-4">
            <Field label="Campaign Title" value={data.title} onChange={(v) => update('title', v)} />
            <Field label="Description" value={data.description} onChange={(v) => update('description', v)} textarea />
            <Field label="Product Type" value={data.productType} onChange={(v) => update('productType', v)} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Field label="Region" value={data.region} onChange={(v) => update('region', v)} placeholder="Lagos, Nigeria" />
            <Field label="Duration (days)" value={data.duration} onChange={(v) => update('duration', v)} />
            <p className="font-mono text-[10px] uppercase text-sold-gray-600">
              Scouts within this region will be prioritized; global is allowed but lower conversion.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <NumField label="Reward / Sale" value={data.reward} onChange={(v) => update('reward', v)} />
              <NumField label="Target Sales" value={data.target} onChange={(v) => update('target', v)} />
              <div>
                <label className="font-mono text-[10px] uppercase text-sold-gray-600 block mb-1">Token</label>
                <select
                  value={data.token}
                  onChange={(e) => update('token', e.target.value as 'USDC' | 'SOL')}
                  className="w-full border border-sold-gray-900 bg-white/70 px-3 py-2 font-mono text-xs uppercase"
                >
                  <option>USDC</option>
                  <option>SOL</option>
                </select>
              </div>
            </div>
            <div className="border border-sold-gray-900 bg-white/70 p-4">
              <p className="font-mono text-xs uppercase text-sold-gray-600 mb-2">Escrow Total</p>
              <p className="metric-number text-3xl font-bold">${escrow.toLocaleString()}</p>
              <p className="font-mono text-[10px] uppercase text-sold-gray-600 mt-2">
                Locked from your wallet on deploy. Returned for unverified sales after challenge window.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <Review label="Title" value={data.title} />
            <Review label="Region" value={data.region} />
            <Review label="Reward" value={`${data.reward} ${data.token}`} />
            <Review label="Target" value={`${data.target} sales`} />
            <Review label="Escrow" value={`$${escrow.toLocaleString()}`} />
          </div>
        )}

        <div className="mt-8 flex justify-between gap-2">
          <button onClick={prev} disabled={step === 0} className="btn-secondary">Back</button>
          {step < STEPS.length - 1 ? (
            <button onClick={next} disabled={step === 0 && !data.title} className="btn-primary">
              Next
            </button>
          ) : (
            <button onClick={deploy} className="btn-primary">Deploy & Lock Escrow</button>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  const cls = 'w-full border border-sold-gray-900 bg-white/70 px-3 py-2 text-sm';
  return (
    <div>
      <label className="font-mono text-[10px] uppercase text-sold-gray-600 block mb-1">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className={cls} rows={3} placeholder={placeholder} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} placeholder={placeholder} />
      )}
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase text-sold-gray-600 block mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full border border-sold-gray-900 bg-white/70 px-3 py-2 text-sm"
      />
    </div>
  );
}

function Review({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border border-sold-gray-900 bg-white/70 p-3">
      <span className="font-mono text-xs uppercase text-sold-gray-600">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
