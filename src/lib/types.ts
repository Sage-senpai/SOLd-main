export type UserRole = 'scout' | 'vendor' | 'admin';

export type ScoutTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type CampaignStatus = 'active' | 'paused' | 'completed';

export type Campaign = {
  id: string;
  vendorAddress: string;
  title: string;
  description: string;
  productType: string;
  rewardAmount: number;
  rewardToken: 'USDC' | 'SOL';
  escrowAmount: number;
  targetSales: number;
  targetRegion: string;
  status: CampaignStatus;
  createdAt: number;
};

export type Application = {
  id: string;
  campaignId: string;
  campaignTitle: string;
  scoutAddress: string;
  rewardAmount: number;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: number;
};

export type SaleStatus = 'pending' | 'verified' | 'rejected';

export type Sale = {
  id: string;
  campaignId: string;
  campaignTitle: string;
  scoutAddress: string;
  merchantName: string;
  txHash: string;
  payoutAmount: number;
  status: SaleStatus;
  createdAt: number;
};

export type UserMeta = {
  address: string;
  role: UserRole;
  tier: ScoutTier;
  reputation: number;
  totalEarnings: number;
  joinedAt: number;
};

export type LedgerEntry = {
  id: string;
  ts: number;
  action: string;
  ref: string;
  value: string;
};

export type FraudFlag = {
  id: string;
  ref: string;
  flag: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  details: string;
  ts: number;
};
