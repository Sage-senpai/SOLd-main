'use client';

import Link from 'next/link';
import { useState } from 'react';
import Nav from '@/components/Nav';
import AuthGate from '@/components/AuthGate';
import { useWallet } from '@/lib/wallet';
import { useToast } from '@/lib/toast';
import { ensureUser } from '@/lib/store';

const STEPS = ['Connect Wallet', 'Verify Identity', 'Mint SBT', 'Done'];

export default function DriverOnboarding() {
  return (
    <main className="relative min-h-screen overflow-hidden text-sold-gray-900">
      <div className="nascent-bg" aria-hidden="true" />
      <Nav portal="Driver Onboarding" />
      <AuthGate requiredRole="scout" portalLabel="Driver Onboarding">
        <Inner />
      </AuthGate>
    </main>
  );
}

function Inner() {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const [step, setStep] = useState(1); // wallet already connected at this point

  const advance = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else if (wallet) {
      ensureUser(wallet.address, 'scout');
      toast('SBT minted (mock) — onboarding complete', 'success');
    }
  };

  return (
    <section className="section-shell relative z-10 pt-10 pb-20">
      <div className="ink-panel max-w-2xl mx-auto p-8 md:p-10">
        <div className="glyph-badge mb-4">Step {step + 1} / {STEPS.length}</div>
        <h1 className="font-eldritch text-4xl font-bold mb-2">{STEPS[step]}</h1>
        <div className="rune-rule my-6" />

        {step === 0 && (
          <p className="text-sold-gray-700 mb-6">
            Connect Phantom or Solflare. Your wallet IS your identity on SOLd.
          </p>
        )}
        {step === 1 && (
          <div className="space-y-3 text-sold-gray-700 mb-6">
            <p>Sign a message to prove you control the wallet (mock — no signature requested).</p>
            <div className="border border-sold-gray-900 bg-white/70 p-4 font-mono text-xs">
              Address: {wallet?.address}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3 text-sold-gray-700 mb-6">
            <p>Mint your Soulbound Token (SBT) — non-transferrable proof of guild membership.</p>
            <div className="border border-sold-gray-900 bg-white/70 p-4">
              <p className="font-mono text-xs uppercase text-sold-gray-600">Initial Tier</p>
              <p className="metric-number text-2xl font-bold mt-1">Bronze · Reputation 50/100</p>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4 mb-6">
            <p className="text-sold-gray-700">Welcome to the Guild. Time to earn.</p>
            <Link href="/driver" className="btn-primary inline-block">Enter Driver Hub</Link>
          </div>
        )}

        {step < STEPS.length - 1 && (
          <button onClick={advance} className="btn-primary w-full">
            Continue
          </button>
        )}
        {step === STEPS.length - 1 && (
          <button onClick={advance} className="btn-secondary w-full">
            Confirm Onboarded
          </button>
        )}
      </div>
    </section>
  );
}
