'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import type {
  Application,
  Campaign,
  FraudFlag,
  LedgerEntry,
  Sale,
  ScoutTier,
  UserMeta,
  UserRole,
} from './types';

type StoreState = {
  campaigns: Campaign[];
  applications: Application[];
  sales: Sale[];
  users: Record<string, UserMeta>;
  ledger: LedgerEntry[];
  fraudFlags: FraudFlag[];
};

const KEY = 'sold.store.v1';

const seedCampaigns: Campaign[] = [
  {
    id: 'camp_seed_hwallet',
    vendorAddress: 'SEED_VENDOR_TANGEM',
    title: 'Hardware Wallet Distribution',
    description: 'Onboard physical retailers to stock and demo Tangem cards.',
    productType: 'Hardware',
    rewardAmount: 120,
    rewardToken: 'USDC',
    escrowAmount: 115000,
    targetSales: 100,
    targetRegion: 'Global',
    status: 'active',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
  },
  {
    id: 'camp_seed_ng',
    vendorAddress: 'SEED_VENDOR_PAYDEV',
    title: 'Payment Device Nigeria',
    description: 'Sign up SMEs in Lagos & Abuja for Solana Pay terminals.',
    productType: 'POS',
    rewardAmount: 50,
    rewardToken: 'USDC',
    escrowAmount: 57500,
    targetSales: 80,
    targetRegion: 'Lagos, Nigeria',
    status: 'active',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'camp_seed_depin',
    vendorAddress: 'SEED_VENDOR_HELIUM',
    title: 'DePIN Merchant Onboarding',
    description: 'Place hotspots with verified merchants in dense city zones.',
    productType: 'DePIN',
    rewardAmount: 75,
    rewardToken: 'USDC',
    escrowAmount: 32000,
    targetSales: 60,
    targetRegion: 'London, UK',
    status: 'active',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
];

const seedLedger: LedgerEntry[] = [
  { id: 'l1', ts: Date.now() - 1000 * 60 * 22, action: 'Payout Released', ref: 'ref_k1Qm', value: '+$1,200' },
  { id: 'l2', ts: Date.now() - 1000 * 60 * 36, action: 'SBT Updated', ref: 'Scout_Lagos_001', value: 'Level: 5' },
  { id: 'l3', ts: Date.now() - 1000 * 60 * 60, action: 'Fraud Flag Created', ref: 'ref_q9K2', value: 'HIGH' },
  { id: 'l4', ts: Date.now() - 1000 * 60 * 90, action: 'Campaign Funded', ref: 'camp_7KmN', value: '$115,000' },
];

const seedFraud: FraudFlag[] = [
  { id: 'f1', ref: 'ref_q9K2', flag: 'Velocity Spike', severity: 'HIGH', details: '5 conversions in 2 hours from same IP', ts: Date.now() - 1000 * 60 * 60 },
  { id: 'f2', ref: 'ref_m4Lx', flag: 'Device Fingerprint', severity: 'MEDIUM', details: 'Duplicate fingerprint across 3 scouts', ts: Date.now() - 1000 * 60 * 180 },
  { id: 'f3', ref: 'ref_n7Pq', flag: 'Wallet Age', severity: 'LOW', details: 'Buyer wallet created 4 hours ago', ts: Date.now() - 1000 * 60 * 240 },
];

const initial: StoreState = {
  campaigns: seedCampaigns,
  applications: [],
  sales: [],
  users: {},
  ledger: seedLedger,
  fraudFlags: seedFraud,
};

let state: StoreState = initial;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}

let hydrated = false;
function hydrate() {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoreState;
      state = {
        ...initial,
        ...parsed,
        campaigns: parsed.campaigns?.length ? parsed.campaigns : initial.campaigns,
        ledger: parsed.ledger?.length ? parsed.ledger : initial.ledger,
        fraudFlags: parsed.fraudFlags?.length ? parsed.fraudFlags : initial.fraudFlags,
      };
    }
  } catch {}
  notify();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

const getSnapshot = () => state;
const getServerSnapshot = () => initial;

function set(updater: (s: StoreState) => StoreState) {
  state = updater(state);
  persist();
  notify();
}

const newId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;

function logLedger(entry: Omit<LedgerEntry, 'id' | 'ts'>) {
  set((s) => ({
    ...s,
    ledger: [{ id: newId('l'), ts: Date.now(), ...entry }, ...s.ledger].slice(0, 100),
  }));
}

// ---- Public API ----

export function useStore<T>(selector: (s: StoreState) => T): T {
  useEffect(() => {
    hydrate();
  }, []);
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(initial));
}

export function useCampaigns(opts: { activeOnly?: boolean; vendorAddress?: string } = {}) {
  const all = useStore((s) => s.campaigns);
  let list = all;
  if (opts.activeOnly) list = list.filter((c) => c.status === 'active');
  if (opts.vendorAddress) list = list.filter((c) => c.vendorAddress === opts.vendorAddress);
  return list;
}

export function useCampaign(id?: string) {
  const all = useStore((s) => s.campaigns);
  return id ? all.find((c) => c.id === id) : undefined;
}

export function useMyApplications(address?: string) {
  const all = useStore((s) => s.applications);
  return address ? all.filter((a) => a.scoutAddress === address) : [];
}

export function useMySales(address?: string) {
  const all = useStore((s) => s.sales);
  return address ? all.filter((s) => s.scoutAddress === address) : [];
}

export function useVendorSales(vendorAddress?: string) {
  const sales = useStore((s) => s.sales);
  const camps = useStore((s) => s.campaigns);
  if (!vendorAddress) return [];
  const myCampIds = new Set(camps.filter((c) => c.vendorAddress === vendorAddress).map((c) => c.id));
  return sales.filter((s) => myCampIds.has(s.campaignId));
}

export function useAllScouts() {
  const users = useStore((s) => s.users);
  const sales = useStore((s) => s.sales);
  return Object.values(users)
    .filter((u) => u.role === 'scout')
    .map((u) => {
      const my = sales.filter((s) => s.scoutAddress === u.address && s.status === 'verified');
      const earned = my.reduce((acc, s) => acc + s.payoutAmount, 0);
      return { ...u, salesCount: my.length, earned };
    });
}

export function useLedger() {
  return useStore((s) => s.ledger);
}

export function useFraudFlags() {
  return useStore((s) => s.fraudFlags);
}

export function useUserMeta(address?: string) {
  const users = useStore((s) => s.users);
  return address ? users[address] : undefined;
}

// ---- Mutations ----

export function ensureUser(address: string, role: UserRole, tier: ScoutTier = 'bronze') {
  set((s) => {
    if (s.users[address]) return s;
    return {
      ...s,
      users: {
        ...s.users,
        [address]: { address, role, tier, reputation: 50, totalEarnings: 0, joinedAt: Date.now() },
      },
    };
  });
}

export function setUserRole(address: string, role: UserRole) {
  set((s) => {
    const existing = s.users[address] ?? {
      address,
      role,
      tier: 'bronze' as ScoutTier,
      reputation: 50,
      totalEarnings: 0,
      joinedAt: Date.now(),
    };
    return { ...s, users: { ...s.users, [address]: { ...existing, role } } };
  });
}

export function createCampaign(input: {
  vendorAddress: string;
  title: string;
  description?: string;
  productType?: string;
  rewardAmount: number;
  rewardToken?: 'USDC' | 'SOL';
  escrowAmount: number;
  targetSales: number;
  targetRegion?: string;
}): Campaign {
  const c: Campaign = {
    id: newId('camp'),
    vendorAddress: input.vendorAddress,
    title: input.title,
    description: input.description ?? `Bounty for ${input.targetSales} sales`,
    productType: input.productType ?? 'Generic',
    rewardAmount: input.rewardAmount,
    rewardToken: input.rewardToken ?? 'USDC',
    escrowAmount: input.escrowAmount,
    targetSales: input.targetSales,
    targetRegion: input.targetRegion ?? 'Global',
    status: 'active',
    createdAt: Date.now(),
  };
  set((s) => ({ ...s, campaigns: [c, ...s.campaigns] }));
  logLedger({ action: 'Campaign Funded', ref: c.id, value: `$${input.escrowAmount.toLocaleString()}` });
  return c;
}

export function applyToCampaign(scoutAddress: string, campaign: Campaign) {
  if (state.applications.some((a) => a.scoutAddress === scoutAddress && a.campaignId === campaign.id)) {
    throw new Error('Already joined this campaign');
  }
  const app: Application = {
    id: newId('app'),
    campaignId: campaign.id,
    campaignTitle: campaign.title,
    scoutAddress,
    rewardAmount: campaign.rewardAmount,
    status: 'approved',
    createdAt: Date.now(),
  };
  set((s) => ({ ...s, applications: [app, ...s.applications] }));
  return app;
}

export function submitSale(input: {
  campaign: Campaign;
  scoutAddress: string;
  merchantName: string;
  txHash: string;
}): Sale {
  const sale: Sale = {
    id: newId('sale'),
    campaignId: input.campaign.id,
    campaignTitle: input.campaign.title,
    scoutAddress: input.scoutAddress,
    merchantName: input.merchantName,
    txHash: input.txHash,
    payoutAmount: input.campaign.rewardAmount,
    status: 'pending',
    createdAt: Date.now(),
  };
  set((s) => ({ ...s, sales: [sale, ...s.sales] }));
  logLedger({ action: 'Proof Submitted', ref: sale.id, value: input.merchantName });
  return sale;
}

export function reviewSale(saleId: string, decision: 'verified' | 'rejected') {
  let updated: Sale | undefined;
  set((s) => {
    const next = s.sales.map((sale) => {
      if (sale.id !== saleId) return sale;
      updated = { ...sale, status: decision };
      return updated;
    });
    let users = s.users;
    if (updated && decision === 'verified') {
      const u = users[updated.scoutAddress];
      if (u) {
        users = {
          ...users,
          [updated.scoutAddress]: {
            ...u,
            totalEarnings: u.totalEarnings + updated.payoutAmount,
            reputation: Math.min(100, u.reputation + 1),
          },
        };
      }
    }
    return { ...s, sales: next, users };
  });
  if (updated) {
    logLedger({
      action: decision === 'verified' ? 'Payout Released' : 'Proof Rejected',
      ref: updated.id,
      value: decision === 'verified' ? `+$${updated.payoutAmount}` : '✗',
    });
  }
}

export function pauseCampaign(id: string) {
  set((s) => ({
    ...s,
    campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c)),
  }));
}

export function resetStore() {
  state = initial;
  persist();
  notify();
}

// ---- Derived totals ----

export function useProtocolMetrics() {
  const campaigns = useStore((s) => s.campaigns);
  const sales = useStore((s) => s.sales);
  const users = useStore((s) => s.users);
  const fraud = useStore((s) => s.fraudFlags);

  const verified = sales.filter((s) => s.status === 'verified');
  const totalVolume = verified.reduce((acc, s) => acc + s.payoutAmount, 0);
  const platformFees = totalVolume * 0.15;
  const escrowReserve = campaigns.reduce((acc, c) => acc + c.escrowAmount, 0);

  return {
    totalVolume,
    platformFees,
    escrowReserve,
    activeDrivers: Object.values(users).filter((u) => u.role === 'scout').length,
    fraudFlags: fraud.length,
    activeCampaigns: campaigns.filter((c) => c.status === 'active').length,
  };
}

// Mounted-only flag — useful for components that should not render store data on the server.
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
