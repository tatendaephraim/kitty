/**
 * Kitty Savings Circles - Domain Models & Types
 * PayPal + AI Hackathon 2026
 */

export interface User {
  id: string;
  name: string;
  email: string;
  paypalEmail: string;
  language: 'en' | 'sn';
  avatar: string;
  roleDescription: string;
  sandboxBalance: number;
}

export interface Mandate {
  maxPerRound: number;
  maxSwapFee: number;
  autoApproveSwapBelow: number;
  minIncentive: number;
  expiresAt: string;
}

export interface Membership {
  id: string;
  circleId: string;
  userId: string;
  slot: number;
  status: 'ACTIVE' | 'INVITED' | 'PAID_OUT' | 'DELINQUENT';
  vaultTokenId?: string;
  consentedConstitutionVersion: number;
  mandate: Mandate;
}

export interface RulesJson {
  circleName: string;
  amount: number;
  currency: 'GBP' | 'USD' | 'EUR';
  frequency: 'monthly' | 'bi-weekly' | 'weekly';
  memberCount: number;
  slotMethod: 'random_draw' | 'need_based' | 'seniority';
  lateFee: number;
  graceDays: number;
  exitRule: string;
  emergencySwapRule: string;
}

export interface Constitution {
  id: string;
  circleId: string;
  version: number;
  rulesJson: RulesJson;
  plainTextEn: string;
  plainTextSn: string;
  createdAt: string;
}

export interface Round {
  id: string;
  circleId: string;
  number: number;
  recipientMembershipId: string;
  recipientUserId: string;
  dueDate: string;
  status: 'SCHEDULED' | 'COLLECTING' | 'PAID_OUT' | 'BLOCKED';
  totalTarget: number;
  totalCollected: number;
}

export interface Contribution {
  id: string;
  roundId: string;
  membershipId: string;
  userId: string;
  amount: number;
  status: 'PENDING' | 'CAPTURED' | 'FAILED' | 'INVOICED';
  paypalOrderId?: string;
  captureId?: string;
  invoiceId?: string;
  capturedAt?: string;
  payeeEmail: string;
}

export interface SwapMessage {
  id: string;
  speaker: string; // e.g. "Chipo's Agent" or "Nyasha's Agent"
  role: 'requester_agent' | 'target_agent' | 'system';
  text: string;
  proposedFee?: number;
  timestamp: string;
}

export interface SwapRequest {
  id: string;
  circleId: string;
  requesterUserId: string;
  targetUserId: string;
  fromSlot: number;
  toSlot: number;
  reason: string;
  status: 'OPEN' | 'NEGOTIATING' | 'AGREED' | 'AWAITING_CONSENT' | 'SETTLED' | 'DECLINED';
  agreedFee: number;
  requesterConsent: boolean;
  targetConsent: boolean;
  transcript: SwapMessage[];
  settledAt?: string;
  paypalOrderId?: string;
  paypalCaptureId?: string;
}

export interface AgentAction {
  id: string;
  circleId: string;
  actor: string;
  toolName: string;
  inputJson: Record<string, any>;
  reasoning: string;
  policyVerdict: 'ALLOW' | 'NEEDS_CONSENT' | 'BLOCK';
  policyReasons: string[];
  resultJson?: Record<string, any>;
  timestamp: string;
}

export interface LedgerEntry {
  id: string;
  circleId: string;
  type: 'CONTRIBUTION' | 'SWAP_FEE' | 'LATE_FEE' | 'PAYOUT_SETTLED' | 'REVERSAL';
  amount: number;
  currency: string;
  fromUserId: string;
  toUserId: string;
  paypalRef: string;
  paypalCaptureId: string;
  notes: string;
  createdAt: string;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  currency: 'GBP' | 'USD';
  contributionAmount: number;
  frequency: 'monthly' | 'bi-weekly';
  memberCap: number;
  status: 'ACTIVE' | 'DRAFT' | 'COMPLETED';
  createdById: string;
  createdAt: string;
}
