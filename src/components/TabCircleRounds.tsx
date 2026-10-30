import React from 'react';
import {
  Circle,
  Round,
  Membership,
  User,
  Contribution,
} from '../types/kitty';
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Zap,
} from 'lucide-react';

interface TabCircleRoundsProps {
  circle: Circle;
  rounds: Round[];
  memberships: Membership[];
  users: User[];
  contributions: Contribution[];
  currentUser: User;
  onOpenPaymentModal: (round: Round, payeeUser: User) => void;
  onNavigateTab: (tabId: string) => void;
}

export const TabCircleRounds: React.FC<TabCircleRoundsProps> = ({
  circle,
  rounds,
  memberships,
  users,
  contributions,
  currentUser,
  onOpenPaymentModal,
  onNavigateTab,
}) => {
  const currentRound = rounds.find((r) => r.status === 'COLLECTING') || rounds[1];
  const recipientUser = users.find((u) => u.id === currentRound.recipientUserId) || users[1];

  // Check if current user has already paid Round 2
  const currentUserContribution = contributions.find(
    (c) => c.roundId === currentRound.id && c.userId === currentUser.id
  );
  const hasPaidCurrentRound = currentUserContribution?.status === 'CAPTURED';

  return (
    <div className="space-y-6">
      {/* Current Round Callout Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Active Collection Cycle
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Round #{currentRound.number} of {rounds.length}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Target Pot: ${currentRound.totalTarget}.00 for{' '}
                <span className="text-amber-400">{recipientUser.name}</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Every member pays ${circle.contributionAmount} directly to{' '}
                <span className="font-mono text-blue-300">{recipientUser.paypalEmail}</span> via PayPal Orders v2. Kitty holds $0 in custody.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3 self-end md:self-center">
            {hasPaidCurrentRound ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>You Paid Round #{currentRound.number} ($100)</span>
              </div>
            ) : (
              <button
                onClick={() => onOpenPaymentModal(currentRound, recipientUser)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition transform active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Pay Round #{currentRound.number} ($100 via PayPal)</span>
              </button>
            )}
          </div>
        </div>

        {/* Pot Progress */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Total Collected</span>
            <span className="text-base font-bold text-emerald-400">
              ${currentRound.totalCollected}.00{' '}
              <span className="text-slate-400 font-normal">/ ${currentRound.totalTarget}.00</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Due Date & Grace Window</span>
            <span className="text-white font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              1st Nov 2026 (5 days grace)
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Direct PayPal Payee</span>
            <span className="font-mono text-slate-200 truncate block">
              {recipientUser.paypalEmail}
            </span>
          </div>
        </div>
      </div>

      {/* Rounds Timeline Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            Circle Payout Schedule (Slots 1–6)
          </h3>
          <span className="text-xs text-slate-400">
            Rotate monthly · Random draw constitution
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rounds.map((round) => {
            const recipient = users.find((u) => u.id === round.recipientUserId);
            const isCurrent = round.status === 'COLLECTING';
            const isCompleted = round.status === 'PAID_OUT';

            // Find contributions for this round
            const roundContribs = contributions.filter((c) => c.roundId === round.id);
            const paidCount = roundContribs.filter((c) => c.status === 'CAPTURED').length;

            return (
              <div
                key={round.id}
                className={`rounded-2xl border p-4 transition ${
                  isCurrent
                    ? 'bg-slate-900 border-blue-500/50 ring-2 ring-blue-500/20 shadow-lg'
                    : isCompleted
                    ? 'bg-slate-900/60 border-emerald-500/30'
                    : 'bg-slate-900/40 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    Slot / Round #{round.number}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isCurrent
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isCompleted ? 'PAID OUT ($600)' : isCurrent ? 'COLLECTING NOW' : 'SCHEDULED'}
                  </span>
                </div>

                {/* Recipient Profile */}
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={recipient?.avatar}
                    alt={recipient?.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                      <span>{recipient?.name}</span>
                      {recipient?.id === currentUser.id && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 rounded">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {recipient?.roleDescription}
                    </div>
                  </div>
                </div>

                {/* Pot Stats */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Collected</span>
                    <span className="font-semibold text-slate-200">
                      ${round.totalCollected} / ${round.totalTarget}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Contributions</span>
                    <span className="font-semibold text-slate-200">
                      {paidCount} of 6 captured
                    </span>
                  </div>
                </div>

                {/* Special Callouts */}
                {round.number === 3 && (
                  <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/25 rounded-lg text-[11px] text-amber-300 flex items-center justify-between">
                    <span>⚡ Chipo requesting slot swap</span>
                    <button
                      onClick={() => onNavigateTab('swap')}
                      className="underline font-semibold hover:text-white"
                    >
                      View AI Swap
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Member Roster & PayPal Vault Status */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Circle Members & PayPal Vault Status
            </h3>
            <p className="text-xs text-slate-400">
              Each member saves their payment method via PayPal Vault with individual autonomous spending mandates.
            </p>
          </div>
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-4 h-4" /> 6 Vault Tokens Connected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {memberships.map((m) => {
            const memberUser = users.find((u) => u.id === m.userId);
            const isRound2Paid = contributions.some(
              (c) => c.roundId === 'round-2' && c.userId === m.userId && c.status === 'CAPTURED'
            );

            return (
              <div
                key={m.id}
                className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={memberUser?.avatar}
                    alt={memberUser?.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1.5">
                      <span>{memberUser?.name}</span>
                      <span className="text-[10px] text-amber-400 font-mono">Slot {m.slot}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {memberUser?.paypalEmail}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {isRound2Paid ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle className="w-3 h-3" /> Paid R2
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                  <span className="block text-[9px] text-slate-400 mt-0.5 font-mono">
                    Mandate: ≤${m.mandate.maxSwapFee} fee
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
