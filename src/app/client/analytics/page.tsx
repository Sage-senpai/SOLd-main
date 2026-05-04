'use client';

import Nav from '@/components/Nav';
import AuthGate from '@/components/AuthGate';
import { useWallet } from '@/lib/wallet';
import { useCampaigns, useVendorSales } from '@/lib/store';

export default function ClientAnalytics() {
  return (
    <main className="relative min-h-screen overflow-hidden text-sold-gray-900">
      <div className="nascent-bg" aria-hidden="true" />
      <Nav portal="Analytics" />
      <AuthGate requiredRole="vendor" portalLabel="Analytics">
        <Inner />
      </AuthGate>
    </main>
  );
}

function Inner() {
  const { wallet } = useWallet();
  const camps = useCampaigns({ vendorAddress: wallet?.address });
  const sales = useVendorSales(wallet?.address);
  const verified = sales.filter((s) => s.status === 'verified');

  const totalSpent = verified.reduce((acc, s) => acc + s.payoutAmount, 0);
  const totalEscrow = camps.reduce((acc, c) => acc + c.escrowAmount, 0);
  const conversion = sales.length === 0 ? 0 : (verified.length / sales.length) * 100;
  const cac = verified.length === 0 ? 0 : totalSpent / verified.length;
  const roi = totalSpent === 0 ? 0 : ((verified.length * 100 - totalSpent) / totalSpent) * 100;

  // Region rollup
  const regions = camps.reduce<Record<string, { campaigns: number; spent: number; sales: number }>>((acc, c) => {
    if (!acc[c.targetRegion]) acc[c.targetRegion] = { campaigns: 0, spent: 0, sales: 0 };
    acc[c.targetRegion].campaigns += 1;
    const camSales = verified.filter((s) => s.campaignId === c.id);
    acc[c.targetRegion].sales += camSales.length;
    acc[c.targetRegion].spent += camSales.reduce((a, s) => a + s.payoutAmount, 0);
    return acc;
  }, {});

  return (
    <section className="section-shell relative z-10 pt-10 pb-20 space-y-6">
      <div>
        <div className="glyph-badge mb-4">Performance</div>
        <h1 className="text-4xl font-bold">Campaign Intelligence</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Total Spent" value={`$${totalSpent.toLocaleString()}`} />
        <Stat label="Escrow Locked" value={`$${totalEscrow.toLocaleString()}`} />
        <Stat label="Conversion" value={`${conversion.toFixed(1)}%`} />
        <Stat label="Avg CAC" value={cac ? `$${cac.toFixed(0)}` : '—'} />
      </div>

      <div className="ink-panel p-6 md:p-8">
        <div className="glyph-badge mb-4">By Region</div>
        <h2 className="text-2xl font-bold mb-4">Coverage Breakdown</h2>
        {Object.keys(regions).length === 0 ? (
          <p className="font-mono text-xs uppercase text-sold-gray-600">No campaigns yet.</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(regions).map(([region, r]) => (
              <div key={region} className="border border-sold-gray-900 bg-white/70 p-4 grid md:grid-cols-4 gap-3 items-center">
                <p className="font-bold">{region}</p>
                <Cell label="Campaigns" value={r.campaigns.toString()} />
                <Cell label="Verified Sales" value={r.sales.toString()} />
                <Cell label="Spent" value={`$${r.spent.toLocaleString()}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="ink-panel p-6 md:p-8">
        <div className="glyph-badge mb-4">ROI Estimate</div>
        <h2 className="text-2xl font-bold mb-4">Effective Return</h2>
        <p className="metric-number text-5xl font-bold">{roi.toFixed(1)}%</p>
        <p className="font-mono text-[10px] uppercase text-sold-gray-600 mt-2">
          Mock formula: (verified × $100 − spent) / spent. Real revenue attribution will replace this when on-chain conversion tracking ships.
        </p>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="ink-card p-6">
      <p className="font-mono text-xs uppercase text-sold-gray-600 mb-2">{label}</p>
      <p className="metric-number text-2xl font-bold">{value}</p>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase text-sold-gray-600">{label}</p>
      <p className="metric-number text-lg font-bold">{value}</p>
    </div>
  );
}
