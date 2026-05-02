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
    <main className="min-h-screen bg-sold-gray-900 text-sold-gray-100">
      <nav className="sticky top-0 z-50 bg-sold-gray-900/95 border-b border-sold-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-sold-primary font-eldritch">
            SOLd.
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-sold-gray-400 text-sm uppercase tracking-wider">Driver Hub</span>
          </div>
          <button className="btn-primary text-sm">Sign Out</button>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-12 appear">
        <div className="card mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sold-gray-500 text-sm uppercase mb-2">Your Reputation</p>
              <h1 className="text-4xl font-bold mb-6 text-sold-primary">Soul Stat / You</h1>
              <div className="space-y-4">
                <div>
                  <p className="text-sold-gray-400 text-sm mb-1">Volume Sold</p>
                  <p className="text-3xl font-bold font-mono">{earnings.totalVolume}</p>
                </div>
                <div>
                  <p className="text-sold-gray-400 text-sm mb-1">Verification Rating</p>
                  <p className="text-3xl font-bold font-mono text-sold-success">{earnings.reputation}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ['Level', '4'],
                ['Active Referrals', earnings.activeReferrals.toString()],
                ['This Month', earnings.monthlyEarnings],
                ['Status', 'Active'],
              ].map(([label, value]) => (
                <div key={label} className="bg-sold-gray-900 border border-sold-gray-700 rounded-lg p-4">
                  <p className="text-sold-gray-500 text-xs uppercase mb-2">{label}</p>
                  <p className="text-xl font-bold font-mono">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Available Campaigns</h2>
          <p className="text-sold-gray-400 mb-6">100% of base bounty goes to you.</p>

          {loading ? (
            <div className="card text-center py-12">
              <p className="text-sold-gray-400">Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="card">
              <p className="text-sold-gray-400 mb-2">No campaigns available right now.</p>
              <p className="text-sold-gray-500 text-sm">Check back soon for new opportunities.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {campaigns.map((campaign) => (
                <article key={campaign.id} className="card hover:border-sold-primary transition">
                  <p className="text-sold-success text-xs uppercase mb-2">100% bounty</p>
                  <h3 className="text-xl font-semibold mb-4">{campaign.title}</h3>

                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-sold-gray-500">Per Sale</span>
                      <span className="font-mono font-bold text-sold-primary">${campaign.bountyB}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sold-gray-500">Type</span>
                      <span className="font-mono uppercase text-sold-gray-300">{campaign.productType}</span>
                    </div>
                  </div>

                  <Link href={`/driver/campaign/${campaign.id}`} className="btn-primary w-full text-center block">
                    Claim Campaign
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-2">Pending Payouts</h2>
          <p className="text-sold-gray-400 mb-6 text-sm">Escrow status for verified sales.</p>

          <div className="space-y-3">
            {[
              { campaign: 'Hardware Wallet Q4', amount: '$2,400', status: 'Challenge Window (48h)', cls: 'badge-danger' },
              { campaign: 'Payment Device Nigeria', amount: '$1,850', status: 'Verified', cls: 'badge-success' },
              { campaign: 'NFC Cards Test', amount: '$950', status: 'Released', cls: 'badge-success' },
            ].map((p) => (
              <div key={p.campaign} className="bg-sold-gray-900 border border-sold-gray-700 rounded-lg p-4 flex justify-between items-center gap-4">
                <div className="flex-1">
                  <p className="text-sold-gray-400 text-xs uppercase mb-1">{p.campaign}</p>
                  <p className="text-xl font-bold font-mono">{p.amount}</p>
                </div>
                <span className={p.cls}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-sold-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sold-gray-500 text-sm uppercase tracking-wider">
          Earn. Prove. Scale.
        </div>
      </footer>
    </main>
  );
}
