import React from 'react';
import { ShieldCheck, ArrowRightLeft, DollarSign, Bot, Lock, CheckCircle2, Globe2 } from 'lucide-react';
import { Circle, Round } from '../types/kitty';

interface HeroBannerProps {
  circle: Circle;
  currentRound: Round;
  onNavigateTab: (tabId: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  circle,
  currentRound,
  onNavigateTab,
}) => {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800 text-white pt-8 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/25">
            <DollarSign className="w-3.5 h-3.5" />
            PayPal Sandbox Orders v2 & Vault
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <Bot className="w-3.5 h-3.5" />
            Autonomous AI Agent Layer (Gemini)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
            <ShieldCheck className="w-3.5 h-3.5" />
            Deterministic Policy Engine (7 Rules)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/25">
            <Globe2 className="w-3.5 h-3.5" />
            Multilingual (English & Shona)
          </span>
        </div>

        {/* Hero Title & Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Accountable AI Savings Circles for Diaspora Communities.
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Millions in the diaspora run rotating savings (stokvel, mukando, susu, tanda) via WhatsApp and pure trust.
              <strong className="text-white font-semibold"> Kitty</strong> pairs autonomous AI agents for constitution drafting, late-payer reminders, and payout-slot swaps with direct <strong className="text-blue-400 font-semibold">PayPal Orders v2</strong> peer-to-peer settlement. Kitty never holds user custody—every transaction is audited by our deterministic policy engine.
            </p>
          </div>

          {/* Quick Action Box */}
          <div className="lg:col-span-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-700">
              <span className="font-semibold text-slate-200">Current Demo Cycle</span>
              <span className="text-emerald-400 font-mono font-medium">Round 2 of 6</span>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">
                  ${currentRound.totalCollected}{' '}
                  <span className="text-xs font-normal text-slate-400">/ ${currentRound.totalTarget}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Collecting for recipient <strong className="text-slate-200">Tendai Chisamba</strong>
                </div>
              </div>
              <span className="px-2 py-1 text-xs rounded-lg font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Collecting (4/6 Paid)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700/80 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentRound.totalCollected / currentRound.totalTarget) * 100}%` }}
              />
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => onNavigateTab('swap')}
                className="flex-1 py-2 px-3 text-xs font-medium text-center bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Inspect Live Swap
              </button>
              <button
                onClick={() => onNavigateTab('policy')}
                className="py-2 px-3 text-xs font-medium text-center bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition flex items-center justify-center gap-1.5"
                title="Test Policy Engine Guardrails"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Test Attack
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pillars Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">0% Custodial Risk</div>
              <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                Direct member-to-member PayPal routing; Kitty holds $0.
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Autonomous Swaps</div>
              <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                Personal member AI agents negotiate payout slots within mandates.
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Deterministic Policy</div>
              <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                7 strict rules block rogue AI or prompt injections.
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Multilingual AI</div>
              <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                Constitutions and reminders drafted in English and Shona.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
