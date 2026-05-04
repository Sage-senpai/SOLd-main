'use client';

import { useState } from 'react';
import Modal from './Modal';
import { useToast } from '@/lib/toast';
import { useWallet } from '@/lib/wallet';
import { submitSale } from '@/lib/store';
import type { Campaign } from '@/lib/types';

export default function SubmitProofDialog({
  campaign,
  trigger,
}: {
  campaign: Campaign;
  trigger: (open: () => void) => React.ReactNode;
}) {
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
      submitSale({
        campaign,
        scoutAddress: wallet.address,
        merchantName: String(fd.get('merchant')),
        txHash: String(fd.get('txHash')),
      });
      toast('Proof submitted — awaiting verification', 'success');
      setOpen(false);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Submit failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {trigger(() => setOpen(true))}
      <Modal open={open} onClose={() => setOpen(false)} title="Submit Proof of Sale">
        <p className="font-mono text-xs uppercase text-sold-gray-600 mb-4">For: {campaign.title}</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-[10px] uppercase text-sold-gray-600 block mb-1">Merchant Name</label>
            <input
              name="merchant"
              required
              placeholder="Brew & Co"
              className="w-full border border-sold-gray-900 bg-white/70 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase text-sold-gray-600 block mb-1">Onchain Tx Hash</label>
            <input
              name="txHash"
              required
              placeholder="0x..."
              className="w-full border border-sold-gray-900 bg-white/70 px-3 py-2 text-sm font-mono"
            />
          </div>
          <div className="border border-dashed border-sold-gray-900 bg-white/40 p-6 text-center">
            <p className="font-mono text-[10px] uppercase text-sold-gray-600">Receipt / Photo Upload</p>
            <p className="text-xs text-sold-gray-700 mt-1">Off-chain evidence (mock — UI only).</p>
          </div>
          <div className="flex justify-between border border-sold-gray-900 bg-white/70 p-3">
            <span className="font-mono text-[10px] uppercase text-sold-gray-600">Reward on verify</span>
            <span className="metric-number text-sm font-bold">
              {campaign.rewardAmount} {campaign.rewardToken}
            </span>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Submitting…' : 'Submit Proof'}
          </button>
        </form>
      </Modal>
    </>
  );
}
