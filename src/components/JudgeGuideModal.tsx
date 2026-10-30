import React, { useState } from 'react';
import {
  CheckCircle,
  Copy,
  DollarSign,
  ExternalLink,
  Flame,
  Globe2,
  Key,
  Lock,
  Play,
  RotateCcw,
  ShieldCheck,
  Terminal,
  Video,
  X,
  Zap,
} from 'lucide-react';

interface JudgeGuideModalProps {
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const JudgeGuideModal: React.FC<JudgeGuideModalProps> = ({
  onClose,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'run' | 'security' | 'quicktour'>('quicktour');
  const [activeVideoScene, setActiveVideoScene] = useState<number>(0);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const scenes = [
    {
      time: '0:00 – 0:20',
      title: 'Scene 1: The Diaspora Hook & Problem',
      actionTab: 'rounds',
      script:
        'Over 11 million South Africans save in informal stokvels, and millions more in the global diaspora run mukando and susu circles on WhatsApp and pure trust. Kitty replaces the vulnerable human treasurer with accountable AI agents, non-custodial PayPal settlements, and a deterministic policy engine.',
      keyDemonstration: 'Shows the 6 diaspora members and the Round 2 pot collecting $400 of $600.',
    },
    {
      time: '0:20 – 0:45',
      title: 'Scene 2: Multilingual AI Constitution',
      actionTab: 'constitution',
      script:
        'Watch as an organizer types circle requirements in Chishona: "Tiri vanhu 6 muLondon, $100 pamwedzi...". Within seconds, Gemini AI drafts the legal bylaws in both English and Shona, plus machine-readable rulesJson that all 6 members cryptographically consent to.',
      keyDemonstration: 'Side-by-side English & Shona bylaws with verified consent registry.',
    },
    {
      time: '0:45 – 1:15',
      title: 'Scene 3: Direct PayPal Orders v2 Payment',
      actionTab: 'rounds',
      script:
        'A member pays their round with one tap on the PayPal Sandbox button. Using PayPal Orders v2 with payee.email_address, the money moves member-to-member directly into Tendai’s PayPal wallet. Kitty never holds user custody.',
      keyDemonstration: 'Live PayPal Orders v2 modal with direct payee email routing and capture write to ledger.',
    },
    {
      time: '1:15 – 1:55',
      title: 'Scene 4: Autonomous Member Swap Negotiation (The Showpiece)',
      actionTab: 'swap',
      script:
        'Chipo has an urgent boiler repair bill and needs liquidity. Her AI agent autonomously negotiates with Nyasha’s agent within pre-signed mandate limits. The agents converse, counter-offer, and converge on a fair $12 fee. Both humans tap approval, and PayPal settles the swap immediately.',
      keyDemonstration: 'Multi-turn agent transcript, mandate compliance checks, dual human consent cards, and slot rotation.',
    },
    {
      time: '1:55 – 2:20',
      title: 'Scene 5: The Trust Moment (Policy Engine Blocks Attack)',
      actionTab: 'policy',
      script:
        'An adversarial prompt injection attempts to transfer $500 to an unknown account attacker@scam.com. The deterministic policy engine intercepts it before it can reach PayPal. It instantly issues a BLOCK verdict with clear audit explanations.',
      keyDemonstration: 'Live attack simulator execution and Agent Action Ledger audit trail.',
    },
    {
      time: '2:20 – 2:45',
      title: 'Scene 6: Ask-the-Ledger AI & Closing Impact',
      actionTab: 'ledger',
      script:
        'A member asks: "Where is my money?". The AI auditor searches the immutable ledger and cites exact entry and capture IDs. Kitty unlocks financial resilience for millions of diaspora savers worldwide.',
      keyDemonstration: 'Grounded AI ledger Q&A with strict citations and zero hallucinations.',
    },
  ];

  const handleCopyEnv = () => {
    const envText = `# Environment Configuration for Kitty (PayPal + AI Hackathon)
GEMINI_API_KEY="your_gemini_api_key_here"
PAYPAL_CLIENT_ID="your_sandbox_client_id_here"
PAYPAL_CLIENT_SECRET="your_sandbox_client_secret_here"
PAYPAL_API_BASE="https://api-m.sandbox.paypal.com"
PAYPAL_WEBHOOK_ID="your_sandbox_webhook_id_here"
APP_URL="http://localhost:3000"`;
    navigator.clipboard.writeText(envText);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Judge Fast-Track, Video Script & Run Guide
              </h2>
              <p className="text-xs text-slate-400">
                PayPal AI Hackathon 2026 Evaluation Hub
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

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950 text-xs">
          <button
            onClick={() => setActiveTab('quicktour')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition ${
              activeTab === 'quicktour'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Judge Fast-Track (60s Tour)
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition ${
              activeTab === 'video'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            2:45 Video Script & Scenes
          </button>
          <button
            onClick={() => setActiveTab('run')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition ${
              activeTab === 'run'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Local & Hosted Run Instructions
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition ${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Key Security & Secrets Policy
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* TAB 1: QUICK TOUR */}
          {activeTab === 'quicktour' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                <h4 className="text-sm font-bold text-blue-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  Test All 3 Core Flows in 60 Seconds
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  You are viewing seeded demo data (Harare-London Diaspora Stokvel #1). No signup, installs, or configurations required.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Step 1 */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    1
                  </div>
                  <h5 className="font-bold text-white text-xs">Pay Round 2 with PayPal</h5>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Switch to member Chipo or Nyasha using the top-right switcher, click "Pay Round #2", and observe direct peer-to-peer Orders v2 capture.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('rounds');
                    }}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded font-semibold text-[11px] transition"
                  >
                    Go to Rounds →
                  </button>
                </div>

                {/* Step 2 */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <h5 className="font-bold text-white text-xs">Approve AI Slot Swap</h5>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Inspect the multi-agent negotiation between Chipo and Nyasha. Tap both human approval buttons and execute direct PayPal settlement.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('swap');
                    }}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded font-semibold text-[11px] transition"
                  >
                    Go to AI Swap →
                  </button>
                </div>

                {/* Step 3 */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs">
                    3
                  </div>
                  <h5 className="font-bold text-white text-xs">Test Attack on Policy Engine</h5>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Fire a prompt injection attempting to transfer $500 to a rogue wallet. Watch the Policy Engine halt the action with clear audit reasons.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('policy');
                    }}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded font-semibold text-[11px] transition"
                  >
                    Go to Policy Engine →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VIDEO SCRIPT & SCENES */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Official Hackathon Demo Video Script (2 Minutes 45 Seconds)
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Complies with the Devpost requirement: under 3 minutes, showing both PayPal and AI working seamlessly.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                  Target: 2:45
                </span>
              </div>

              {/* Scene Navigator */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {scenes.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveVideoScene(idx)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      activeVideoScene === idx
                        ? 'bg-blue-600/20 border-blue-500/50 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-blue-400 block">{s.time}</span>
                    <span className="text-xs font-bold truncate block">{s.title.split(':')[1] || s.title}</span>
                  </button>
                ))}
              </div>

              {/* Active Scene Card */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] font-mono text-blue-400 font-bold">
                      {scenes[activeVideoScene].time}
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {scenes[activeVideoScene].title}
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab(scenes[activeVideoScene].actionTab);
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition"
                  >
                    Jump to Screen →
                  </button>
                </div>

                <div>
                  <strong className="text-slate-400 block text-[11px] uppercase tracking-wider mb-1">
                    Voiceover Narration:
                  </strong>
                  <p className="p-3 bg-slate-900 rounded-xl text-slate-200 text-xs italic leading-relaxed border border-slate-800">
                    "{scenes[activeVideoScene].script}"
                  </p>
                </div>

                <div className="text-xs text-slate-300">
                  <strong className="text-slate-400 block text-[11px] uppercase tracking-wider mb-0.5">
                    Live Screen Visual:
                  </strong>
                  <span>{scenes[activeVideoScene].keyDemonstration}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RUN INSTRUCTIONS */}
          {activeTab === 'run' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  How Judges Can Run This App (2 Quick Options)
                </h4>
                <p className="text-xs text-slate-300">
                  <strong>Option A (Hosted URL - Zero Install):</strong> Open this hosted applet URL. The application is pre-seeded with 6 sandbox accounts, mid-cycle rounds, and live AI integration.
                </p>
                <p className="text-xs text-slate-300">
                  <strong>Option B (Local Clone & Run):</strong>
                </p>
                <div className="p-3 bg-slate-900 rounded-lg font-mono text-[11px] text-emerald-400 border border-slate-800 space-y-1">
                  <div>git clone https://github.com/tatendachipwanya/kitty.git</div>
                  <div>cd kitty</div>
                  <div>npm install</div>
                  <div>cp .env.example .env.local  # add sandbox keys</div>
                  <div>npm run dev                # runs full-stack on port 3000</div>
                </div>
              </div>

              {/* Environment Variables Reference */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs uppercase tracking-wider">
                    Environment Variables Template (.env.example)
                  </span>
                  <button
                    onClick={handleCopyEnv}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedEnv ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 rounded-lg font-mono text-[11px] text-slate-300 border border-slate-800 overflow-x-auto">
{`GEMINI_API_KEY="MY_GEMINI_API_KEY"       # Server-side Gemini AI model calls
PAYPAL_CLIENT_ID="your_sandbox_client_id" # PayPal REST Sandbox App Client ID
PAYPAL_CLIENT_SECRET="your_secret"        # Never committed to repo!
PAYPAL_API_BASE="https://api-m.sandbox.paypal.com"
PAYPAL_WEBHOOK_ID="your_webhook_id"
APP_URL="http://localhost:3000"`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Strict API Key Protection & Secrets Policy</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  As demanded by hackathon rules and best practices:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  <li><strong>Zero Client Secrets:</strong> PayPal Client Secret and Gemini API keys are strictly accessed on the server via <code className="text-emerald-300">process.env</code> and are NEVER exposed to browser bundles or client HTML.</li>
                  <li><strong>Git Hygiene:</strong> All <code className="text-amber-300">.env</code> and <code className="text-amber-300">.env.local</code> files are excluded in <code className="text-amber-300">.gitignore</code>. Only <code className="text-slate-400">.env.example</code> with dummy placeholders is ever committed.</li>
                  <li><strong>Non-Custodial Money Flow:</strong> Kitty does not hold a platform bank account or pooled escrow. PayPal Orders v2 routes funds directly to the designated member's PayPal sandbox email.</li>
                  <li><strong>Policy Interception:</strong> Every AI tool call must pass the deterministic policy engine before any PayPal endpoint is queried.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">
            PayPal AI Hackathon 2026 · Project: Kitty
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
