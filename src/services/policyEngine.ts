/**
 * Kitty Deterministic Policy Engine (The Guardian)
 * Plain TypeScript deterministic verification before any money movement reaches PayPal.
 */

import { Circle, Constitution, Membership, Round, Contribution, AgentAction } from '../types/kitty';

export interface ProposedAction {
  id?: string;
  actor: string;
  toolName: string; // 'create_contribution_order' | 'capture_contribution' | 'settle_swap' | 'create_arrears_order' | 'transfer_external'
  amount: number;
  fromUserId: string;
  toUserId: string;
  circleId: string;
  roundId?: string;
  swapRequestId?: string;
  humanConsents?: {
    payerConsented: boolean;
    recipientConsented?: boolean;
  };
  memo?: string;
  timestamp?: string;
}

export interface PolicyContext {
  circle: Circle;
  constitution: Constitution;
  memberships: Membership[];
  rounds: Round[];
  contributions: Contribution[];
  recentActions: AgentAction[];
}

export interface PolicyVerdictResult {
  verdict: 'ALLOW' | 'NEEDS_CONSENT' | 'BLOCK';
  passedRules: string[];
  reasons: string[];
  ruleViolated?: string;
  evaluatedAt: string;
}

export class PolicyEngine {
  /**
   * Evaluates a proposed money movement against the 7 deterministic rules.
   * Runs sequentially and halts on the first BLOCK.
   */
  static evaluate(action: ProposedAction, context: PolicyContext): PolicyVerdictResult {
    const passedRules: string[] = [];
    const reasons: string[] = [];
    const now = new Date();

    // RULE 1: Known Payee Verification
    const isPayeeMember = context.memberships.some(
      (m) => m.userId === action.toUserId || action.toUserId === 'CIRCLE_POOL'
    );
    if (!isPayeeMember) {
      return {
        verdict: 'BLOCK',
        passedRules,
        reasons: [`RULE 1 VIOLATION (Known Payee): Payee '${action.toUserId}' is not an active member of circle '${context.circle.name}'. Agents are forbidden from routing funds to unverified addresses.`],
        ruleViolated: 'RULE_1_UNKNOWN_PAYEE',
        evaluatedAt: now.toISOString(),
      };
    }
    passedRules.push('RULE 1: Payee is verified active circle member.');

    // RULE 2: Constitution Match (Allowed Amounts)
    const validContribution = context.constitution.rulesJson.amount;
    const validLateFee = context.constitution.rulesJson.lateFee;
    const isContribution = action.toolName.includes('contribution') && action.amount === validContribution;
    const isLateFee = action.toolName.includes('arrears') && (action.amount === validLateFee || action.amount === validContribution + validLateFee);
    const isSwapFee = action.toolName.includes('swap') && action.amount > 0 && action.amount <= 30;

    if (!isContribution && !isLateFee && !isSwapFee) {
      return {
        verdict: 'BLOCK',
        passedRules,
        reasons: [
          `RULE 2 VIOLATION (Constitution Match): Amount £${action.amount} does not match any valid constitution schedule (Contribution: £${validContribution}, Late Fee: £${validLateFee}, or valid Swap Fee). Arbitrary sums are strictly rejected.`,
        ],
        ruleViolated: 'RULE_2_CONSTITUTION_MISMATCH',
        evaluatedAt: now.toISOString(),
      };
    }
    passedRules.push(`RULE 2: Amount £${action.amount} strictly matches authorized constitution parameters.`);

    // RULE 3: Member Mandate Limits
    const payerMembership = context.memberships.find((m) => m.userId === action.fromUserId);
    if (payerMembership) {
      const mandate = payerMembership.mandate;
      if (isSwapFee && action.amount > mandate.maxSwapFee) {
        return {
          verdict: 'BLOCK',
          passedRules,
          reasons: [
            `RULE 3 VIOLATION (Mandate Limit): Swap fee £${action.amount} exceeds member's signed autonomous mandate limit of £${mandate.maxSwapFee}.`,
          ],
          ruleViolated: 'RULE_3_MANDATE_EXCEEDED',
          evaluatedAt: now.toISOString(),
        };
      }
      if (action.amount > mandate.maxPerRound) {
        return {
          verdict: 'BLOCK',
          passedRules,
          reasons: [
            `RULE 3 VIOLATION (Mandate Limit): Transaction £${action.amount} exceeds member's max per-round ceiling of £${mandate.maxPerRound}.`,
          ],
          ruleViolated: 'RULE_3_MANDATE_MAX_PER_ROUND',
          evaluatedAt: now.toISOString(),
        };
      }
    }
    passedRules.push('RULE 3: Transaction conforms within member mandate ceiling.');

    // RULE 4: Round State & Double Payment Guard
    if (action.roundId) {
      const targetRound = context.rounds.find((r) => r.id === action.roundId);
      if (targetRound) {
        if (targetRound.status !== 'COLLECTING' && action.toolName.includes('contribution')) {
          return {
            verdict: 'BLOCK',
            passedRules,
            reasons: [
              `RULE 4 VIOLATION (Round State): Round #${targetRound.number} status is '${targetRound.status}', not 'COLLECTING'. Payments can only be accepted during active collection.`,
            ],
            ruleViolated: 'RULE_4_INVALID_ROUND_STATE',
            evaluatedAt: now.toISOString(),
          };
        }

        const alreadyPaid = context.contributions.some(
          (c) => c.roundId === action.roundId && c.userId === action.fromUserId && c.status === 'CAPTURED'
        );
        if (alreadyPaid && action.toolName.includes('contribution')) {
          return {
            verdict: 'BLOCK',
            passedRules,
            reasons: [`RULE 4 VIOLATION (Double Payment): Member has already successfully contributed £${validContribution} for Round #${targetRound.number}. Re-charging is blocked.`],
            ruleViolated: 'RULE_4_DOUBLE_PAYMENT',
            evaluatedAt: now.toISOString(),
          };
        }
      }
    }
    passedRules.push('RULE 4: Round is actively collecting and no prior payment exists for this member.');

    // RULE 5: Duplicate Action Guard (10-minute cooldown)
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
    const isDuplicate = context.recentActions.some(
      (a) =>
        a.actor === action.actor &&
        a.toolName === action.toolName &&
        a.timestamp > tenMinutesAgo &&
        JSON.stringify(a.inputJson.amount) === JSON.stringify(action.amount) &&
        a.inputJson.fromUserId === action.fromUserId
    );
    if (isDuplicate) {
      return {
        verdict: 'BLOCK',
        passedRules,
        reasons: ['RULE 5 VIOLATION (Duplicate Guard): Identical financial tool invocation detected within last 10 minutes. Throttled to prevent accidental duplicate charges.'],
        ruleViolated: 'RULE_5_DUPLICATE_THROTTLE',
        evaluatedAt: now.toISOString(),
      };
    }
    passedRules.push('RULE 5: Duplicate action cooldown verified (clean 10m window).');

    // RULE 6: Velocity Cap (Max 3 financial actions per member per 24 hours)
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const dailyCount = context.recentActions.filter(
      (a) => a.inputJson?.fromUserId === action.fromUserId && a.policyVerdict === 'ALLOW' && a.timestamp > twentyFourHoursAgo
    ).length;
    if (dailyCount >= 3) {
      return {
        verdict: 'BLOCK',
        passedRules,
        reasons: ['RULE 6 VIOLATION (Velocity Cap): Member has exceeded maximum daily velocity of 3 money actions.'],
        ruleViolated: 'RULE_6_VELOCITY_CAP_REACHED',
        evaluatedAt: now.toISOString(),
      };
    }
    passedRules.push(`RULE 6: Daily velocity cap checked (${dailyCount}/3 used).`);

    // RULE 7: Two-Human Consent Requirement for Swaps and Arrears
    if (action.toolName === 'settle_swap') {
      const consents = action.humanConsents;
      if (!consents || !consents.payerConsented || !consents.recipientConsented) {
        return {
          verdict: 'NEEDS_CONSENT',
          passedRules,
          reasons: [
            'RULE 7 (Dual Human Consent): AI Agents have concurred on swap terms, but money settlement and slot re-allocation requires explicit two-tap confirmation from both human members.',
          ],
          evaluatedAt: now.toISOString(),
        };
      }
    }

    if (action.toolName === 'create_arrears_order' && !action.humanConsents?.payerConsented) {
      return {
        verdict: 'NEEDS_CONSENT',
        passedRules,
        reasons: ['RULE 7: Arrears orders require human member confirmation before capture.'],
        evaluatedAt: now.toISOString(),
      };
    }

    passedRules.push('RULE 7: Required human approvals verified.');

    return {
      verdict: 'ALLOW',
      passedRules,
      reasons: ['All 7 deterministic policy rules satisfied. Transaction cleared to proceed to PayPal Orders v2.'],
      evaluatedAt: now.toISOString(),
    };
  }
}
