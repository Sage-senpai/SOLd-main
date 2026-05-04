'use client';

import { useState } from 'react';
import Modal from './Modal';
import { useToast } from '@/lib/toast';
import { useWallet } from '@/lib/wallet';
import { createCampaign } from '@/lib/store';

export default function CreateCampaignDialog({ trigger }: { trigger: (open: () => void) => React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { wallet } = useWallet();
  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!wallet) {
      toast('Connect a wallet first', 'error');
      return;
    }
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    try {
      const reward = Number(fd.get('reward'));
      const target = Number(fd.get('target'));
      createCampaign({
        vendorAddress: wallet.address,
        title: String(fd.get('title')),
        description: String(fd.get('description') || ''),
        productType: String(fd.get('productType') || 'Generic'),
        rewardAmount: reward,
        rewardToken: (fd.get('token') as 'USDC' | 'SOL') || 'USDC',
        targetSales: target,
        targetRegion: String(fd.get('region') || 'Global'),
        escrowAmount: reward * target,
      });
      toast('Campaign deployed to escrow', 'success');
      setOpen(false);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to deploy', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {trigger(() => setOpen(true))}
      <Modal open={open} onClose={() => setOpen(false)} title="Launch Campaign">
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Campaign Title" name="title" placeholder="e.g. NYC Coffee Shop Onboarding" required />
          <Field label="Description" name="description" placeholder="What scouts need to do" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Product Type" name="productType" placeholder="POS / Hardware / DePIN" />
            <Field label="Region" name="region" placeholder="Global" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Reward / Sale" name="reward" type="number" step="0.01" placeholder="50.00" required />
            <Field label="Target Sales" name="target" type="number" placeholder="100" required />
            <div>
              <label className="font-mono text-[10px] uppercase text-sold-gray-600 block mb-1">Token</label>
              <select name="token" className="w-full border border-sold-gray-900 bg-white/70 px-3 py-2 font-mono text-xs uppercase">
                <option>USDC</option>
                <option>SOL</option>
              </select>
            </div>
          </div>
          <div className="border border-sold-gray-900 bg-white/70 p-3">
            <p className="font-mono text-[10px] uppercase text-sold-gray-600">Escrow auto-locks</p>
            <p className="text-xs text-sold-gray-700 mt-1">
              Reward × Target Sales — funded from your wallet on deploy.
            </p>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Deploying…' : 'Deploy Bounty'}
          </button>
        </form>
      </Modal>
    </>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase text-sold-gray-600 block mb-1">{label}</label>
      <input
        {...props}
        className="w-full border border-sold-gray-900 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:bg-white"
      />
    </div>
  );
}
