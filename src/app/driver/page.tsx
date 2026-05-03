'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Campaign {
  id: string;
  title: string;
  bountyB: string;
  status: string;
  productType: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

export default function DriverHub() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [earnings] = useState({
    totalVolume: '$124.5k',
    monthlyEarnings: '$8.9k',
    activeReferrals: 12,
    reputation: '96.2%',
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
        // silent fail, fallback UI shown
      } finally {
        setLoading(false);
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
            <span className="text-sold-gray-600">Driver Hub</span>
          </div>
          <button className="btn-primary px-4 py-2 text-xs">
            Sign Out
          </button>
        </div>
      </nav>

      <section className="section-shell relative z-10 pt-10">
        {/* Soul Stat Card */}
        <div className="ink-panel mb-10 p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
            <div>
              <p className="font-mono text-xs uppercase text-sold-gray-600 mb-2">Your Reputation</p>
              <h1 className="text-4xl font-bold mb-6">Soul Stat / You</h1>
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-xs uppercase text-sold-gray-600 mb-2">Volume Sold</p>
                  <p className="metric-number text-3xl font-bold">{earnings.totalVolume}</p>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase text-sold-gray-600 mb-2">Rating</p>
                  <p className="metric-number text-3xl font-bold">{earnings.reputation}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                ['Level', '4'],
                ['Active Referrals', earnings.activeReferrals.toString()],
                ['This Month', earnings.monthlyEarnings],
                ['Status', 'Active'],
              ].map(([label, value]) => (
                <div key={label} className="border border-sold-gray-900 bg-white/70 p-3">
                  <p className="font-mono text-xs uppercase text-sold-gray-600">{label}</p>
                  <p className="metric-number mt-2 text-lg font-bold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pure B Feed - Live Campaigns */}
        <div className="mb-10">
          <div className="mb-6">
            <div className="glyph-badge mb-4">Active Bounties</div>
            <h2 className="text-3xl font-bold">Campaigns Seeking Scouts</h2>
          </div>

          {loading ? (
            <div className="ink-card p-8 text-center">
              <p className="text-sold-gray-600">Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="ink-card p-8">
              <p className="font-mono text-sm uppercase text-sold-gray-600 mb-4">No campaigns available</p>
              <p className="text-sold-gray-700">Check back soon for new distribution opportunities.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {campaigns.map((campaign) => (
                <article key={campaign.id} className="ink-card p-6">
                  <p className="font-mono text-xs uppercase text-sold-gray-600">100% of bounty</p>
                  <h3 className="mt-4 text-2xl font-bold">{campaign.title}</h3>

                  <div className="rune-rule my-4" />

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs text-sold-gray-600">Per Sale</span>
                      <span className="metric-number font-bold text-lg">${campaign.bountyB}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs text-sold-gray-600">Type</span>
                      <span className="font-mono text-xs uppercase font-bold">{campaign.productType}</span>
                    </div>
                  </div>

                  <Link
                    href={`/driver/campaign/${campaign.id}`}
                    className="btn-primary w-full text-center"
                  >
                    Claim Campaign
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Payout Dashboard */}
        <div className="ink-panel p-6 md:p-8">
          <div className="mb-6">
            <div className="glyph-badge mb-4">Escrow Status</div>
            <h2 className="text-3xl font-bold">Pending Payouts</h2>
          </div>

          <div className="space-y-3">
            {[
              { campaign: 'Hardware Wallet Q4', amount: '$2,400', status: 'Challenge Window (48h)' },
              { campaign: 'Payment Device Nigeria', amount: '$1,850', status: 'Verified' },
              { campaign: 'NFC Cards Test', amount: '$950', status: 'Released' },
            ].map((payout) => (
              <div key={payout.campaign} className="border border-sold-gray-900 bg-white/70 p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-mono text-xs uppercase text-sold-gray-600 mb-1">{payout.campaign}</p>
                    <p className="metric-number text-xl font-bold">{payout.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="glyph-badge text-xs">{payout.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="section-shell relative z-10 pb-10 pt-8">
        <div className="border-t border-sold-gray-900 pt-6 font-mono text-xs uppercase">
          <p>Earn. Prove. Scale.</p>
        </div>
      </footer>
    </main>
  );
}
