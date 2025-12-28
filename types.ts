export enum ReferralStatus {
  REGISTERED = 'Registered',
  APPLIED = 'Applied',
  APPROVED = 'Approved',
  DISBURSED = 'Disbursed'
}

export enum CommissionStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  INELIGIBLE = 'Ineligible' // If loan not disbursed
}

export interface Referral {
  id: string;
  leadName: string;
  maskedMobile: string;
  date: string; // ISO date string
  status: ReferralStatus;
  loanAmount?: number;
  commissionStatus: CommissionStatus;
  loanType?: string;
  creditScore?: number;
  assignedLender?: string;
}

export interface Payout {
  id: string;
  disbursedAmount: number;
  commissionRate: number; // e.g. 0.015 for 1.5%
  earnedAmount: number;
  status: 'Pending' | 'Paid';
  payoutDate?: string;
  referralId: string;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
}

export interface UserProfile {
  name: string;
  referralCode: string; // Immutable
  email: string;
  phone: string;
  totalEarnings: number;
  bankDetails?: BankDetails;
}

export interface BannerIdea {
  concept: string;
  tagline: string;
}

export type ViewState = 'dashboard' | 'referrals' | 'earnings' | 'payouts' | 'marketing' | 'profile';