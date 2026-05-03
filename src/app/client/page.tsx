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
    <main className="relative min-h-screen overflow-hidden text-sold-gray-900">
      <div className="nascent-bg" aria-hidden="true" />

      <nav className="section-shell sticky top-4 z-50 pt-4">
        <div className="ink-panel flex items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="font-eldritch text-xl font-bold">
            SOLd.
          </Link>
          <div className="hidden items-center gap-6 font-mono text-xs uppercase md:flex">
            <span className="text-sold-gray-600">Vendor Portal</span>
          </div>
          <button className="btn-primary px-4 py-2 text-xs">
            Sign Out
          </button>
        </div>
      </nav>

      <section className="section-shell relative z-10 pt-10">
        {/* ROI Dashboard */}
        <div className="mb-10">
          <div className="mb-6">
            <div className="glyph-badge mb-4">Campaign Performance</div>
            <h1 className="text-4xl font-bold">Your Distribution Network</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {Object.entries(metrics).map(([label, value]) => (
              <div key={label} className="ink-card p-6">
                <p className="font-mono text-xs uppercase text-sold-gray-600 mb-2">
                  {label.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="metric-number text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Manager */}
        <div className="ink-panel mb-10 p-6 md:p-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <div className="glyph-badge mb-4">Active Campaigns</div>
              <h2 className="text-3xl font-bold">Escrow Contracts</h2>
            </div>
            <Link href="/client/create" className="btn-primary">
              Launch Campaign
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Hardware Wallet Distribution',
                escrow: '$115,000',
                active: 18,
                conversions: 92,
                roi: '127%',
              },
              {
                title: 'Payment Device Nigeria',
                escrow: '$57,500',
                active: 5,
                conversions: 34,
                roi: '94%',
              },
            ].map((campaign) => (
              <div key={campaign.title} className="border border-sold-gray-900 bg-white/70 p-4">
                <div className="grid md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-2">
                    <p className="font-bold text-sm">{campaign.title}</p>
                    <p className="font-mono text-xs text-sold-gray-600 mt-1">
                      Escrow: {campaign.escrow}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-xs uppercase text-sold-gray-600">Active Drivers</p>
                    <p className="metric-number text-lg font-bold">{campaign.active}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-xs uppercase text-sold-gray-600">Conversions</p>
                    <p className="metric-number text-lg font-bold">{campaign.conversions}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-xs uppercase text-sold-gray-600">ROI</p>
                    <p className="metric-number text-lg font-bold">{campaign.roi}</p>
                  </div>
                  <Link
                    href={`/client/campaign/${campaign.title}`}
                    className="btn-secondary text-center text-xs"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Drivers Map Data */}
        <div className="ink-panel p-6 md:p-8">
          <div className="mb-6">
            <div className="glyph-badge mb-4">Network Distribution</div>
            <h2 className="text-3xl font-bold">Drivers by Region</h2>
          </div>

          <div className="space-y-3">
            {[
              { region: 'Lagos, Nigeria', drivers: 12, sales: '$34,500' },
              { region: 'Abuja, Nigeria', drivers: 6, sales: '$18,900' },
              { region: 'Accra, Ghana', drivers: 5, sales: '$12,400' },
              { region: 'Nairobi, Kenya', drivers: 8, sales: '$29,300' },
            ].map((item) => (
              <div key={item.region} className="border border-sold-gray-900 bg-white/70 p-4">
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase text-sold-gray-600 mb-1">{item.region}</p>
                    <p className="font-bold">{item.drivers} Active Scouts</p>
                  </div>
                  <div className="text-right">
                    <p className="metric-number text-lg font-bold">{item.sales}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="section-shell relative z-10 pb-10 pt-8">
        <div className="border-t border-sold-gray-900 pt-6 font-mono text-xs uppercase">
          <p>ROI Driven. Data Ready.</p>
        </div>
      </footer>
    </main>
  );
}
