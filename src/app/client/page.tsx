'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Campaign {
  id: string;
  title: string;
  bountyB: string;
  escrowAmount: string;
  conversions: number;
  status: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

export default function ClientPortal() {
  const [_campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [metrics] = useState({
    totalSpent: '$18,400',
    activeDrivers: 23,
    conversionRate: '8.4%',
    avgCAC: '$219',
  });

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/campaigns`);
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data.data || []);
        }
      } catch (e) {
        // silent fail
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <main className="min-h-screen bg-sold-gray-900 text-sold-gray-100">
      <nav className="sticky top-0 z-50 bg-sold-gray-900/95 border-b border-sold-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-sold-primary font-eldritch">
            SOLd.
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-sold-gray-400 text-sm uppercase tracking-wider">Vendor Portal</span>
          </div>
          <button className="btn-primary text-sm">Sign Out</button>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-12 appear">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Distribution Network</h1>
          <p className="text-sold-gray-400">Campaign performance and ROI analytics.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(metrics).map(([label, value]) => (
            <div key={label} className="card">
              <p className="text-sold-gray-500 text-xs uppercase mb-2">
                {label.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-2xl font-bold font-mono text-sold-primary">{value}</p>
            </div>
          ))}
        </div>

        <div className="card mb-8">
          <div className="flex justify-between items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Active Campaigns</h2>
              <p className="text-sold-gray-400 text-sm">Manage your funded escrow contracts.</p>
            </div>
            <Link href="/client/create" className="btn-primary">
              Launch Campaign
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Hardware Wallet Distribution', escrow: '$115,000', active: 18, conversions: 92, roi: '127%' },
              { title: 'Payment Device Nigeria', escrow: '$57,500', active: 5, conversions: 34, roi: '94%' },
            ].map((c) => (
              <div key={c.title} className="bg-sold-gray-900 border border-sold-gray-700 rounded-lg p-4">
                <div className="grid md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-2">
                    <p className="font-semibold">{c.title}</p>
                    <p className="text-sold-gray-500 text-xs mt-1 font-mono">Escrow: {c.escrow}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sold-gray-500 text-xs uppercase">Drivers</p>
                    <p className="font-mono font-bold">{c.active}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sold-gray-500 text-xs uppercase">Conversions</p>
                    <p className="font-mono font-bold">{c.conversions}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sold-gray-500 text-xs uppercase">ROI</p>
                    <p className="font-mono font-bold text-sold-success">{c.roi}</p>
                  </div>
                  <Link href={`/client/campaign/${c.title}`} className="btn-secondary text-center text-sm">
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-2">Drivers by Region</h2>
          <p className="text-sold-gray-400 text-sm mb-6">Geographic distribution of your sales network.</p>

          <div className="space-y-3">
            {[
              { region: 'Lagos, Nigeria', drivers: 12, sales: '$34,500' },
              { region: 'Abuja, Nigeria', drivers: 6, sales: '$18,900' },
              { region: 'Accra, Ghana', drivers: 5, sales: '$12,400' },
              { region: 'Nairobi, Kenya', drivers: 8, sales: '$29,300' },
            ].map((r) => (
              <div key={r.region} className="bg-sold-gray-900 border border-sold-gray-700 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="text-sold-gray-500 text-xs uppercase mb-1">{r.region}</p>
                  <p className="font-semibold">{r.drivers} Active Scouts</p>
                </div>
                <p className="text-xl font-bold font-mono text-sold-primary">{r.sales}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-sold-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sold-gray-500 text-sm uppercase tracking-wider">
          ROI Driven. Data Ready.
        </div>
      </footer>
    </main>
  );
}
