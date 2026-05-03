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
    <main className="relative min-h-screen overflow-hidden text-sold-gray-900">
      <div className="nascent-bg" aria-hidden="true" />

      <nav className="section-shell sticky top-4 z-50 pt-4">
        <div className="ink-panel flex items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="font-eldritch text-xl font-bold">
            SOLd.
          </Link>
          <div className="hidden items-center gap-6 font-mono text-xs uppercase md:flex">
            <span className="text-sold-gray-600">Protocol Admin</span>
          </div>
          <button className="btn-primary px-4 py-2 text-xs">
            Sign Out
          </button>
        </div>
      </nav>

      <section className="section-shell relative z-10 pt-10">
        {/* Revenue Dashboard */}
        <div className="mb-10">
          <div className="mb-6">
            <div className="glyph-badge mb-4">Protocol Health</div>
            <h1 className="text-4xl font-bold">Guild Operations Center</h1>
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

        {/* Tab Navigation */}
        <div className="ink-panel mb-8">
          <div className="flex border-b border-sold-gray-900">
            {['overview', 'sbt-lifecycle', 'fraud-monitor', 'audit-ledger'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-3 font-mono text-xs uppercase font-bold transition ${
                  activeTab === tab
                    ? 'border-b-2 border-sold-gray-900 text-sold-gray-900'
                    : 'text-sold-gray-600'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Treasury Status</h3>
                  <div className="space-y-3">
                    {[
                      { wallet: 'Treasury Wallet (Solana)', balance: '$61,923', address: 'SOLD...7XqK' },
                      { wallet: 'Escrow Contract Reserve', balance: '$412,800', address: 'Prog...xyz9' },
                    ].map((item) => (
                      <div key={item.wallet} className="border border-sold-gray-900 bg-white/70 p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="font-mono text-xs uppercase text-sold-gray-600 mb-1">{item.wallet}</p>
                            <p className="font-mono text-xs text-sold-gray-500">{item.address}</p>
                          </div>
                          <p className="metric-number text-xl font-bold">{item.balance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sbt-lifecycle' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-4">Driver Credentials Management</h3>
                <div className="space-y-3">
                  {[
                    { driver: 'Scout_Lagos_001', level: 5, volume: '$45.2k', status: 'Active', action: 'Promote' },
                    { driver: 'Scout_Abuja_003', level: 2, volume: '$8.5k', status: 'Probation', action: 'Revoke' },
                    { driver: 'Scout_Accra_002', level: 7, volume: '$78.3k', status: 'Active', action: 'Monitor' },
                  ].map((driver) => (
                    <div key={driver.driver} className="border border-sold-gray-900 bg-white/70 p-4">
                      <div className="grid md:grid-cols-5 gap-4 items-center">
                        <div>
                          <p className="font-mono text-xs uppercase text-sold-gray-600 mb-1">Driver</p>
                          <p className="font-bold">{driver.driver}</p>
                        </div>
                        <div className="text-center">
                          <p className="font-mono text-xs uppercase text-sold-gray-600 mb-1">Level</p>
                          <p className="metric-number text-lg font-bold">{driver.level}</p>
                        </div>
                        <div className="text-center">
                          <p className="font-mono text-xs uppercase text-sold-gray-600 mb-1">Volume</p>
                          <p className="metric-number text-sm font-bold">{driver.volume}</p>
                        </div>
                        <div>
                          <p className="glyph-badge text-xs text-center">{driver.status}</p>
                        </div>
                        <button className="btn-secondary text-xs text-center">{driver.action}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'fraud-monitor' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-4">Active Fraud Flags</h3>
                <div className="space-y-3">
                  {[
                    {
                      referral: 'ref_q9K2',
                      flag: 'Velocity Spike',
                      severity: 'HIGH',
                      details: '5 conversions in 2 hours from same IP',
                    },
                    {
                      referral: 'ref_m4Lx',
                      flag: 'Device Fingerprint',
                      severity: 'MEDIUM',
                      details: 'Duplicate fingerprint across 3 scouts',
                    },
                    {
                      referral: 'ref_n7Pq',
                      flag: 'Wallet Age',
                      severity: 'LOW',
                      details: 'Buyer wallet created 4 hours ago',
                    },
                  ].map((item) => (
                    <div key={item.referral} className="border border-sold-gray-900 bg-white/70 p-4">
                      <div className="grid md:grid-cols-5 gap-4 items-start">
                        <div>
                          <p className="font-mono text-xs uppercase text-sold-gray-600 mb-1">Referral ID</p>
                          <p className="font-bold font-mono">{item.referral}</p>
                        </div>
                        <div>
                          <p className="font-mono text-xs uppercase text-sold-gray-600 mb-1">Flag Type</p>
                          <p className="font-bold">{item.flag}</p>
                        </div>
                        <div>
                          <p className="font-mono text-xs uppercase text-sold-gray-600 mb-1">Severity</p>
                          <p className="font-bold font-mono">{item.severity}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="font-mono text-xs uppercase text-sold-gray-600 mb-1">Details</p>
                          <p className="text-sm text-sold-gray-700">{item.details}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'audit-ledger' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-4">Transaction Log</h3>
                <div className="space-y-2 font-mono text-sm">
                  {[
                    { time: '14:32 UTC', action: 'Payout Released', referral: 'ref_k1Qm', amount: '+$1,200' },
                    { time: '14:18 UTC', action: 'SBT Updated', referral: 'Scout_Lagos_001', amount: 'Level: 5' },
                    { time: '13:45 UTC', action: 'Fraud Flag Created', referral: 'ref_q9K2', amount: 'HIGH' },
                    { time: '13:22 UTC', action: 'Campaign Funded', referral: 'camp_7KmN', amount: '$115,000' },
                    { time: '12:56 UTC', action: 'Proof Verified', referral: 'ref_p3Xr', amount: '✓' },
                  ].map((log, i) => (
                    <div key={i} className="flex justify-between items-center gap-4 py-2 border-b border-sold-gray-200">
                      <span className="text-sold-gray-600">{log.time}</span>
                      <span>{log.action}</span>
                      <span className="text-sold-gray-600">{log.referral}</span>
                      <span className="text-right font-bold">{log.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="section-shell relative z-10 pb-10 pt-8">
        <div className="border-t border-sold-gray-900 pt-6 font-mono text-xs uppercase">
          <p>Protocol Integrity. Perfect Ledgers.</p>
        </div>
      </footer>
    </main>
  );
}
