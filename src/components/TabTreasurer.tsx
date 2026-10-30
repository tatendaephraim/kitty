import React, { useState } from 'react';
import { Circle, Round, Contribution, User, Membership } from '../types/kitty';
import {
  BellRing,
  Bot,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Mail,
  QrCode,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface TabTreasurerProps {
  circle: Circle;
  currentRound: Round;
  contributions: Contribution[];
  users: User[];
  memberships: Membership[];
  onTriggerTreasurerAudit: () => Promise<void>;
  isAuditing: boolean;
}

export const TabTreasurer: React.FC<TabTreasurerProps> = ({
  circle,
  currentRound,
  contributions,
  users,
  memberships,
  onTriggerTreasurerAudit,
  isAuditing,
}) => {
  const roundContribs = contributions.filter((c) => c.roundId === currentRound.id);
  const pendingContribs = roundContribs.filter((c) => c.status !== 'CAPTURED');

  const [reminderLanguage, setReminderLanguage] = useState<'bilingual' | 'sn' | 'en'>('bilingual');
  const [sentReminders, setSentReminders] = useState<string[]>([]);
  const [selectedInvoiceUser, setSelectedInvoiceUser] = useState<User | null>(null);

  const handleSendReminder = (userId: string) => {
    setSentReminders((prev) => [...prev, userId]);
  };

  return (
    <div className="space-y-6">
      {/* Treasurer Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
                Autonomous Treasurer Agent
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Round #{currentRound.number} Watchdog
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Culturally Supportive Reminders & PayPal Invoicing
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Traditional stokvel treasurers spend hours chasing late payments on WhatsApp. The Kitty Treasurer Agent monitors round deadlines daily, drafts respectful, non-shaming bilingual reminders (English & Chishona), and prepares direct PayPal payment orders so nobody loses face.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerTreasurerAudit}
              disabled={isAuditing}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAuditing ? 'Auditing with AI...' : 'Run Daily Treasurer Audit'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delinquency & Grace Window Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Round Collection Health
          </span>
          <div className="mt-2 text-2xl font-bold text-white">
            {roundContribs.filter((c) => c.status === 'CAPTURED').length} of {roundContribs.length}
          </div>
          <p className="text-xs text-emerald-400 mt-1">
            ${currentRound.totalCollected} / ${currentRound.totalTarget} collected
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Pending / In Grace Period
          </span>
          <div className="mt-2 text-2xl font-bold text-amber-400">
            {pendingContribs.length} Members
          </div>
          <p className="text-xs text-slate-400 mt-1">
            3 days remaining in standard 5-day grace window
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Late Penalty Enforcement
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-200">
            ${circle.contributionAmount + 10} Total
          </div>
          <p className="text-xs text-slate-400 mt-1">
            $10 fee applies only after day 5 expires (Policy Rule 2)
          </p>
        </div>
      </div>

      {/* Pending Members Chasing Roster */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Pending Round #{currentRound.number} Contributors
            </h3>
            <p className="text-xs text-slate-400">
              The Treasurer Agent drafts non-shaming reminders in the member's preferred language.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setReminderLanguage('bilingual')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                reminderLanguage === 'bilingual'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bilingual
            </button>
            <button
              onClick={() => setReminderLanguage('sn')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                reminderLanguage === 'sn'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chishona
            </button>
            <button
              onClick={() => setReminderLanguage('en')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                reminderLanguage === 'en'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {pendingContribs.length === 0 ? (
          <div className="py-8 text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>All members have paid Round #{currentRound.number}! No arrears outstanding.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingContribs.map((contrib) => {
              const member = users.find((u) => u.id === contrib.userId)!;
              const hasSent = sentReminders.includes(member.id);

              return (
                <div
                  key={contrib.id}
                  className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-amber-400/50"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{member.name}</span>
                        <span className="text-[10px] text-amber-400 font-mono">
                          Pending: ${contrib.amount}.00
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">
                          Prefers: {member.language === 'sn' ? 'Chishona' : 'English'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {member.paypalEmail}
                      </div>

                      {/* AI Drafted Supportive Reminder Preview */}
                      <div className="mt-2 p-2.5 bg-slate-900 border border-slate-800/80 rounded-lg text-xs text-slate-300 max-w-xl">
                        {(reminderLanguage === 'bilingual' || reminderLanguage === 'sn') && (
                          <p className="italic text-amber-200/90 text-[11px]">
                            "Kwaziwai {member.name.split(' ')[0]}. Tiri kukuyeuchidzai zvakanaka nezve mupurupo weRound #{currentRound.number} unokwana ${contrib.amount} unodiwa na Tendai musi wa 1. Kana pane zviri kukunetsai, AI Agent yenyu inogona kukumbira kuchinjanisa nzvimbwana."
                          </p>
                        )}
                        {(reminderLanguage === 'bilingual' || reminderLanguage === 'en') && (
                          <p className="text-slate-300 text-[11px] mt-1">
                            "Hello {member.name.split(' ')[0]}, this is a friendly reminder for Round #{currentRound.number} (${contrib.amount}) due to Tendai. 3 days remain in the grace window. If you require emergency liquidity, your AI Agent can request a slot swap."
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => setSelectedInvoiceUser(member)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-blue-400" />
                      <span>PayPal QR Invoice</span>
                    </button>

                    {hasSent ? (
                      <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                        <CheckCircle className="w-3.5 h-3.5" /> Dispatched
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendReminder(member.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Reminder</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PayPal Invoicing QR Modal */}
      {selectedInvoiceUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <h3 className="text-base font-bold text-white">
              PayPal Invoicing v2 (Mobile QR)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Member can scan with phone camera to pay directly to Tendai's PayPal wallet.
            </p>

            <div className="mt-4 p-4 bg-white rounded-2xl inline-block shadow-inner">
              {/* Simulated QR Code */}
              <div className="w-40 h-40 bg-slate-950 flex flex-col items-center justify-center p-2 rounded-lg text-white">
                <QrCode className="w-28 h-28 text-white" />
                <span className="text-[9px] font-mono text-slate-400 mt-1">
                  ORD-INV-{selectedInvoiceUser.id.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="mt-4 text-xs space-y-1 text-slate-300 font-mono">
              <div>Payer: {selectedInvoiceUser.name}</div>
              <div>Amount: ${circle.contributionAmount}.00 USD</div>
              <div className="text-emerald-400">Direct Payee: {currentRound.recipientUserId === 'user-tendai' ? 'sb-tendai.member@personal.example.com' : 'Recipient Wallet'}</div>
            </div>

            <button
              onClick={() => setSelectedInvoiceUser(null)}
              className="mt-5 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition"
            >
              Close Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
