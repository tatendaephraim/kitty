import React, { useState } from 'react';
import {
  SwapRequest,
  User,
  Membership,
  Circle,
  AgentAction,
} from '../types/kitty';
import {
  ArrowRightLeft,
  Bot,
  CheckCircle,
  Clock,
  DollarSign,
  Fingerprint,
  Lock,
  MessageSquare,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { PolicyEngine } from '../services/policyEngine';

interface TabSwapNegotiationProps {
  swapRequest: SwapRequest;
  users: User[];
  memberships: Membership[];
  circle: Circle;
  currentUser: User;
  onConsentRequester: () => void;
  onConsentTarget: () => void;
  onSettleSwap: () => void;
  onResetSwap: () => void;
  onSimulateNewNegotiation: (reason: string, maxFee: number) => Promise<void>;
  isSettling: boolean;
}

export const TabSwapNegotiation: React.FC<TabSwapNegotiationProps> = ({
  swapRequest,
  users,
  memberships,
  circle,
  currentUser,
  onConsentRequester,
  onConsentTarget,
  onSettleSwap,
  onResetSwap,
  onSimulateNewNegotiation,
  isSettling,
}) => {
  const requester = users.find((u) => u.id === swapRequest.requesterUserId)!;
  const target = users.find((u) => u.id === swapRequest.targetUserId)!;
  const requesterMem = memberships.find((m) => m.userId === requester.id)!;
  const targetMem = memberships.find((m) => m.userId === target.id)!;

  const [customReason, setCustomReason] = useState(
    'Emergency home repairs and dental bill requiring liquidity this week.'
  );
  const [customMaxFee, setCustomMaxFee] = useState(20);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  const canSettle =
    swapRequest.status === 'AGREED' &&
    swapRequest.requesterConsent &&
    swapRequest.targetConsent;

  const isSettled = swapRequest.status === 'SETTLED';

  const handleStartSim = async () => {
    setIsGenerating(true);
    await onSimulateNewNegotiation(customReason, customMaxFee);
    setIsGenerating(false);
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Showpiece Header Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                The Hackathon Showpiece
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Multi-Agent Autonomous Negotiation
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Autonomous AI Slot Swap Protocol & Settlement
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              When life happens, members don't need to beg on WhatsApp. Each member’s personal AI agent negotiates slot swaps strictly within their pre-signed mandate. Once agreed, <strong className="text-white">two-tap human consent</strong> executes direct <strong className="text-blue-400">PayPal settlement</strong> with 100% policy verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewModal(true)}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Bot className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate New AI Swap</span>
            </button>
            <button
              onClick={onResetSwap}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-800 transition"
              title="Reset swap state"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slots & Members Comparison Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Requester: Chipo */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Bot className="w-4 h-4" /> Requester Member Agent
            </span>
            <span className="text-xs font-mono font-bold text-slate-300">
              Current: Slot #{swapRequest.fromSlot}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <img
              src={requester.avatar}
              alt={requester.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/40"
            />
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{requester.name}</span>
                {currentUser.id === requester.id && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 rounded">
                    You
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 font-mono">{requester.paypalEmail}</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Reason for Swap:</span>
              <span className="font-medium text-right max-w-[200px] truncate">
                {swapRequest.reason}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Agent Mandate Ceiling:</span>
              <span className="font-mono text-emerald-400 font-semibold">
                Max ${requesterMem.mandate.maxSwapFee} thank-you fee
              </span>
            </div>
          </div>
        </div>

        {/* Target: Nyasha */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Bot className="w-4 h-4" /> Target Member Agent
            </span>
            <span className="text-xs font-mono font-bold text-slate-300">
              Current: Slot #{swapRequest.toSlot}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <img
              src={target.avatar}
              alt={target.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/40"
            />
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{target.name}</span>
                {currentUser.id === target.id && (
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 rounded">
                    You
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 font-mono">{target.paypalEmail}</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Autonomous Threshold:</span>
              <span className="font-mono text-blue-300 font-semibold">
                Min ${targetMem.mandate.minIncentive} incentive required
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Auto-Approve Below:</span>
              <span className="font-mono text-slate-400">
                ${targetMem.mandate.autoApproveSwapBelow}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Agent Transcript */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Autonomous Agent Negotiation Transcript
            </span>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Status: {swapRequest.status} (${swapRequest.agreedFee} agreed fee)
          </span>
        </div>

        {/* Messages */}
        <div className="mt-4 space-y-3">
          {swapRequest.transcript.map((msg) => {
            const isRequester = msg.role === 'requester_agent';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 p-3 rounded-xl text-xs ${
                  isRequester
                    ? 'bg-amber-500/5 border border-amber-500/20 mr-4 sm:mr-12'
                    : 'bg-blue-500/5 border border-blue-500/20 ml-4 sm:ml-12'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isRequester ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold ${
                        isRequester ? 'text-amber-300' : 'text-blue-300'
                      }`}
                    >
                      {msg.speaker}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-200 leading-relaxed">{msg.text}</p>
                  {msg.proposedFee !== undefined && (
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[11px] text-emerald-400">
                      <span>Proposed Incentive:</span>
                      <strong>${msg.proposedFee}.00</strong>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Tap Human Consent & PayPal Settlement Card */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Rule 7 Policy Requirement: Dual Human Consent Card
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Swap Round #{swapRequest.fromSlot} for Round #{swapRequest.toSlot} (Fee: ${swapRequest.agreedFee}.00 via PayPal)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              Deterministic Policy Engine:
            </span>
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                canSettle || isSettled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              {isSettled
                ? 'SETTLED & VERIFIED'
                : canSettle
                ? 'ALLOW (Both Consented)'
                : 'NEEDS_CONSENT'}
            </span>
          </div>
        </div>

        {/* 2-Tap Consent Buttons */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chipo Tap */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Chipo Dube (Payer)</span>
                {currentUser.id === requester.id && (
                  <span className="text-[10px] text-amber-400 font-mono">(You)</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Approve paying ${swapRequest.agreedFee} fee to Nyasha via PayPal
              </p>
            </div>

            {swapRequest.requesterConsent ? (
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <CheckCircle className="w-3.5 h-3.5" /> Consented
              </span>
            ) : (
              <button
                onClick={onConsentRequester}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer shadow-sm"
              >
                Tap 1: Approve
              </button>
            )}
          </div>

          {/* Nyasha Tap */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Nyasha Muzenda (Recipient)</span>
                {currentUser.id === target.id && (
                  <span className="text-[10px] text-blue-400 font-mono">(You)</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Approve relinquishing Slot #{swapRequest.fromSlot} & receiving ${swapRequest.agreedFee}
              </p>
            </div>

            {swapRequest.targetConsent ? (
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <CheckCircle className="w-3.5 h-3.5" /> Consented
              </span>
            ) : (
              <button
                onClick={onConsentTarget}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-blue-500 hover:bg-blue-400 text-white transition cursor-pointer shadow-sm"
              >
                Tap 2: Approve
              </button>
            )}
          </div>
        </div>

        {/* Final Settlement Execution */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {isSettled ? (
              <span className="text-emerald-400 font-mono">
                ✓ Settled on PayPal Orders v2 (Ref: {swapRequest.paypalCaptureId || 'CAP-SWAP-CHIPO-NYASHA'})
              </span>
            ) : (
              <span>Requires both human approvals before Policy Engine authorizes PayPal settlement.</span>
            )}
          </div>

          {isSettled ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
              <CheckCircle className="w-4 h-4" />
              <span>Slots Swapped & Recorded in Ledger</span>
            </div>
          ) : (
            <button
              onClick={onSettleSwap}
              disabled={!canSettle || isSettling}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition shadow-lg ${
                canSettle
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 cursor-pointer shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>
                {isSettling ? 'Executing PayPal Settlement...' : 'Settle Swap via PayPal Orders v2'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Modal to simulate new negotiation */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-amber-400" />
              Simulate New AI Slot Swap Negotiation
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Test how the AI agents autonomously converse within member mandates using Gemini 3.8 Flash.
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Requester Reason (Chipo):
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Chipo's Mandate Max Swap Fee ($):
                </label>
                <input
                  type="number"
                  value={customMaxFee}
                  onChange={(e) => setCustomMaxFee(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                  min={5}
                  max={40}
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleStartSim}
                disabled={isGenerating}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Negotiating with Gemini...' : 'Start Negotiation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
