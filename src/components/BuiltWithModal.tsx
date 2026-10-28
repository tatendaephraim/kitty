import React from 'react';
import {
  Bot,
  CreditCard,
  DollarSign,
  Fingerprint,
  Globe2,
  Lock,
  Server,
  ShieldCheck,
  Sparkles,
  Table,
  Terminal,
  X,
  Zap,
} from 'lucide-react';

interface BuiltWithModalProps {
  onClose: () => void;
}

export const BuiltWithModal: React.FC<BuiltWithModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 text-slate-950 font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Built With: PayPal & Artificial Intelligence Architecture
              </h2>
              <p className="text-xs text-slate-400">
                Official Devpost Submission & Technical Stack Breakdown
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Section 1: PayPal Stack */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-400 uppercase tracking-wider pb-1 border-b border-slate-800">
              <DollarSign className="w-4 h-4" />
              <span>1. PayPal Payments & Money Infrastructure (Sandbox)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <span className="font-bold text-white text-xs block">PayPal Orders v2 (Direct Payee Routing)</span>
                <p className="text-[11px] text-slate-400">
                  Every round contribution creates an Order with <code className="text-blue-300">intent: CAPTURE</code> and <code className="text-blue-300">purchase_units[0].payee.email_address</code> set to that round's recipient. Kitty holds 0% custody—money travels member-to-member.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <span className="font-bold text-white text-xs block">PayPal Vault (Tokenized Authorization)</span>
                <p className="text-[11px] text-slate-400">
                  Saves member payment methods securely (<code className="text-blue-300">payment_source.paypal.attributes.vault.store_in_vault</code>) allowing one-tap round settlements and recurring pot cycles.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <span className="font-bold text-white text-xs block">PayPal Idempotency Headers</span>
                <p className="text-[11px] text-slate-400">
                  Every order creation and capture call injects a deterministic <code className="text-amber-300">PayPal-Request-Id</code> header derived from the database row ID, guaranteeing network retries never double charge.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <span className="font-bold text-white text-xs block">PayPal Invoicing v2 & Webhooks</span>
                <p className="text-[11px] text-slate-400">
                  Generates QR invoices for mobile late-fee recovery and processes cryptographic webhooks (<code className="text-blue-300">PAYMENT.CAPTURE.COMPLETED</code>) to verify real settlement before rotating rounds.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: AI Stack */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 uppercase tracking-wider pb-1 border-b border-slate-800">
              <Bot className="w-4 h-4" />
              <span>2. Artificial Intelligence Layer (Gemini 3.8 Flash via @google/genai)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <span className="font-bold text-white text-xs block">Autonomous Member Negotiation Agents</span>
                <p className="text-[11px] text-slate-400">
                  Personal AI agents negotiate emergency payout-slot swaps on members' behalf. Agents strictly respect each member's signed Mandate (<code className="text-emerald-300">maxSwapFee</code>, <code className="text-emerald-300">minIncentive</code>) across multi-turn exchanges.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <span className="font-bold text-white text-xs block">Multilingual Constitution Drafter</span>
                <p className="text-[11px] text-slate-400">
                  Accepts informal circle intentions in English or Shona (Chishona) and generates both machine-readable <code className="text-purple-300">rulesJson</code> for the engine and natural bylaws for diaspora trust.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <span className="font-bold text-white text-xs block">Culturally Supportive Treasurer Agent</span>
                <p className="text-[11px] text-slate-400">
                  Runs daily audits on circle health and drafts respectful, non-shaming reminders in the member's home language (Shona/English) with grace window notices.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <span className="font-bold text-white text-xs block">Ask-the-Ledger Natural Language Auditor</span>
                <p className="text-[11px] text-slate-400">
                  Grounded strictly in an immutable JSON snapshot of ledger transactions. Cites exact Entry IDs (<code className="text-teal-300">LEDGER-001</code>) and refuses to hallucinate facts outside the ledger.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Policy Engine & Security */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-400 uppercase tracking-wider pb-1 border-b border-slate-800">
              <ShieldCheck className="w-4 h-4" />
              <span>3. Deterministic Policy Engine & Security Boundary</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
              <p className="text-[11px] text-slate-300">
                AI agents propose financial actions; the <strong>Deterministic Policy Engine</strong> (pure TypeScript) decides <code className="text-emerald-400 font-bold">ALLOW</code>, <code className="text-amber-400 font-bold">NEEDS_CONSENT</code>, or <code className="text-rose-400 font-bold">BLOCK</code>.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[10px] font-mono text-slate-400">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">✓ Known Payee Only</div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">✓ Constitution Schedule</div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">✓ Mandate Limits</div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">✓ 10-Min Cooldown</div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">✓ Velocity Cap (3/day)</div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">✓ No Double Charging</div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 col-span-2">✓ Two-Tap Human Consent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">
            License: MIT Open Source · Developer: Tatenda Ephraim Chipwanya
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
