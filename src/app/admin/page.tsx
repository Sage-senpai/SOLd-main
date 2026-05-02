'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminConsole() {
  const [activeTab, setActiveTab] = useState('overview');

  const metrics = {
    totalVolume: '$412.8k',
    platformFees: '$61.9k',
    activeDrivers: 47,
    fraudFlags: 3,
  };

  return (
    <main className="min-h-screen bg-sold-gray-900 text-sold-gray-100">
      <nav className="sticky top-0 z-50 bg-sold-gray-900/95 border-b border-sold-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-sold-primary font-eldritch">
            SOLd.
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-sold-gray-400 text-sm uppercase tracking-wider">Protocol Admin</span>
          </div>
          <button className="btn-primary text-sm">Sign Out</button>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-12 appear">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Guild Operations Center</h1>
          <p className="text-sold-gray-400">Protocol health, treasury, and fraud monitoring.</p>
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

        <div className="card">
          <div className="flex border-b border-sold-gray-700 -mx-6 -mt-6 mb-6">
            {['overview', 'sbt-lifecycle', 'fraud-monitor', 'audit-ledger'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 text-xs uppercase font-semibold tracking-wider transition ${
                  activeTab === tab
                    ? 'border-b-2 border-sold-primary text-sold-primary'
                    : 'text-sold-gray-500 hover:text-sold-gray-300'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Treasury Status</h3>
              <div className="space-y-3">
                {[
                  { wallet: 'Treasury Wallet (Solana)', balance: '$61,923', address: 'SOLD...7XqK' },
                  { wallet: 'Escrow Contract Reserve', balance: '$412,800', address: 'Prog...xyz9' },
                ].map((item) => (
                  <div key={item.wallet} className="bg-sold-gray-900 border border-sold-gray-700 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sold-gray-400 text-xs uppercase mb-1">{item.wallet}</p>
                      <p className="text-sold-gray-500 text-xs font-mono">{item.address}</p>
                    </div>
                    <p className="text-xl font-bold font-mono text-sold-primary">{item.balance}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sbt-lifecycle' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Driver Credentials Management</h3>
              <div className="space-y-3">
                {[
                  { driver: 'Scout_Lagos_001', level: 5, volume: '$45.2k', status: 'Active', cls: 'badge-success', action: 'Promote' },
                  { driver: 'Scout_Abuja_003', level: 2, volume: '$8.5k', status: 'Probation', cls: 'badge-danger', action: 'Revoke' },
                  { driver: 'Scout_Accra_002', level: 7, volume: '$78.3k', status: 'Active', cls: 'badge-success', action: 'Monitor' },
                ].map((d) => (
                  <div key={d.driver} className="bg-sold-gray-900 border border-sold-gray-700 rounded-lg p-4">
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      <div>
                        <p className="text-sold-gray-500 text-xs uppercase mb-1">Driver</p>
                        <p className="font-semibold font-mono text-sm">{d.driver}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sold-gray-500 text-xs uppercase mb-1">Level</p>
                        <p className="font-mono font-bold">{d.level}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sold-gray-500 text-xs uppercase mb-1">Volume</p>
                        <p className="font-mono font-bold text-sm">{d.volume}</p>
                      </div>
                      <div className="text-center">
                        <span className={d.cls}>{d.status}</span>
                      </div>
                      <button className="btn-secondary text-center text-sm">{d.action}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'fraud-monitor' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Active Fraud Flags</h3>
              <div className="space-y-3">
                {[
                  { referral: 'ref_q9K2', flag: 'Velocity Spike', severity: 'HIGH', color: 'text-sold-danger', details: '5 conversions in 2 hours from same IP' },
                  { referral: 'ref_m4Lx', flag: 'Device Fingerprint', severity: 'MEDIUM', color: 'text-yellow-400', details: 'Duplicate fingerprint across 3 scouts' },
                  { referral: 'ref_n7Pq', flag: 'Wallet Age', severity: 'LOW', color: 'text-sold-success', details: 'Buyer wallet created 4 hours ago' },
                ].map((f) => (
                  <div key={f.referral} className="bg-sold-gray-900 border border-sold-gray-700 rounded-lg p-4">
                    <div className="grid md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sold-gray-500 text-xs uppercase mb-1">Referral</p>
                        <p className="font-mono font-bold text-sm">{f.referral}</p>
                      </div>
                      <div>
                        <p className="text-sold-gray-500 text-xs uppercase mb-1">Flag</p>
                        <p className="font-semibold text-sm">{f.flag}</p>
                      </div>
                      <div>
                        <p className="text-sold-gray-500 text-xs uppercase mb-1">Severity</p>
                        <p className={`font-mono font-bold text-sm ${f.color}`}>{f.severity}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sold-gray-500 text-xs uppercase mb-1">Details</p>
                        <p className="text-sold-gray-300 text-sm">{f.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit-ledger' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Transaction Log</h3>
              <div className="space-y-2 font-mono text-sm">
                {[
                  { time: '14:32 UTC', action: 'Payout Released', referral: 'ref_k1Qm', amount: '+$1,200' },
                  { time: '14:18 UTC', action: 'SBT Updated', referral: 'Scout_Lagos_001', amount: 'Level: 5' },
                  { time: '13:45 UTC', action: 'Fraud Flag Created', referral: 'ref_q9K2', amount: 'HIGH' },
                  { time: '13:22 UTC', action: 'Campaign Funded', referral: 'camp_7KmN', amount: '$115,000' },
                  { time: '12:56 UTC', action: 'Proof Verified', referral: 'ref_p3Xr', amount: '✓' },
                ].map((log, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 py-2 border-b border-sold-gray-700 last:border-0">
                    <span className="text-sold-gray-500">{log.time}</span>
                    <span>{log.action}</span>
                    <span className="text-sold-gray-400">{log.referral}</span>
                    <span className="text-right font-bold text-sold-primary">{log.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-sold-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sold-gray-500 text-sm uppercase tracking-wider">
          Protocol Integrity. Perfect Ledgers.
        </div>
      </footer>
    </main>
  );
}
