'use client';

import Link from 'next/link';
import { useState } from 'react';
import Nav from '@/components/Nav';
import AuthGate from '@/components/AuthGate';
import { useToast } from '@/lib/toast';

const STEPS = ['Company Details', 'Wallet & Escrow', 'First Campaign'];

export default function ClientOnboarding() {
  return (
    <main className="relative min-h-screen overflow-hidden text-sold-gray-900">
      <div className="nascent-bg" aria-hidden="true" />
      <Nav portal="Vendor Onboarding" />
      <AuthGate requiredRole="vendor" portalLabel="Vendor Onboarding">
        <Inner />
      </AuthGate>
    </main>
  );
}

function Inner() {
  const [step, setStep] = useState(0);
  const [company, setCompany] = useState({ name: '', website: '', industry: '' });
  const { toast } = useToast();

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else toast('Onboarding complete', 'success');
  };

  return (
    <section className="section-shell relative z-10 pt-10 pb-20">
      <div className="ink-panel max-w-2xl mx-auto p-8 md:p-10">
        <div className="glyph-badge mb-4">Step {step + 1} / {STEPS.length}</div>
        <h1 className="font-eldritch text-4xl font-bold mb-2">{STEPS[step]}</h1>
        <div className="rune-rule my-6" />

        {step === 0 && (
          <div className="space-y-4">
            <Field label="Company Name" value={company.name} onChange={(v) => setCompany({ ...company, name: v })} />
            <Field label="Website" value={company.website} onChange={(v) => setCompany({ ...company, website: v })} />
            <Field label="Industry" value={company.industry} onChange={(v) => setCompany({ ...company, industry: v })} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 text-sold-gray-700">
            <p>Wallet already connected. Future campaigns lock escrow from this address.</p>
            <p className="font-mono text-[10px] uppercase text-sold-gray-600">
              Multi-sig support arrives in v0.2 — single-sig only for now.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sold-gray-700">Ready to deploy your first campaign?</p>
            <Link href="/client/create" className="btn-primary inline-block">Launch First Campaign</Link>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="btn-secondary"
          >
            Back
          </button>
          <button onClick={next} className="btn-primary">
            {step === STEPS.length - 1 ? 'Finish' : 'Continue'}
          </button>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase text-sold-gray-600 block mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-sold-gray-900 bg-white/70 px-3 py-2 text-sm"
      />
    </div>
  );
}
