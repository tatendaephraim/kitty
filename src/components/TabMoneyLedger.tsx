import React, { useState } from 'react';
import { LedgerEntry, User } from '../types/kitty';
import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Download,
  ExternalLink,
  Filter,
  MessageSquare,
  Search,
  Sparkles,
  Table,
} from 'lucide-react';

interface TabMoneyLedgerProps {
  ledger: LedgerEntry[];
  users: User[];
  onAskLedger: (question: string) => Promise<string>;
  isAsking: boolean;
}

export const TabMoneyLedger: React.FC<TabMoneyLedgerProps> = ({
  ledger,
  users,
  onAskLedger,
  isAsking,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'CONTRIBUTION' | 'PAYOUT_SETTLED' | 'SWAP_FEE'>('ALL');
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ q: string; a: string; time: string }[]>([
    {
      q: 'Has Rudo Moyo received the Round 1 payout?',
      a: 'Yes. Round 1 payout of $600.00 was fully settled to Rudo Moyo (User ID: user-rudo). Verified via 6 peer contributions (LEDGER-001 through LEDGER-006, Capture Refs: CAP-RD1-01 to CAP-RD1-06) and recorded in aggregate entry LEDGER-007.',
      time: '14:20',
    },
  ]);

  const getUserName = (userId: string) => {
    if (userId === 'CIRCLE_POOL') return 'Circle Pool';
    const u = users.find((x) => x.id === userId);
    return u ? u.name : userId;
  };

  const filteredEntries = ledger.filter((entry) => {
    if (typeFilter !== 'ALL' && entry.type !== typeFilter) return false;
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    const from = getUserName(entry.fromUserId).toLowerCase();
    const to = getUserName(entry.toUserId).toLowerCase();
    return (
      entry.id.toLowerCase().includes(s) ||
      entry.paypalCaptureId.toLowerCase().includes(s) ||
      entry.paypalRef.toLowerCase().includes(s) ||
      from.includes(s) ||
      to.includes(s) ||
      entry.notes.toLowerCase().includes(s)
    );
  });

  const handleAsk = async (preset?: string) => {
    const questionToAsk = preset || chatQuestion;
    if (!questionToAsk.trim() || isAsking) return;

    const answer = await onAskLedger(questionToAsk);
    setChatHistory((prev) => [
      ...prev,
      {
        q: questionToAsk,
        a: answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    if (!preset) setChatQuestion('');
  };

  const handleExportCsv = () => {
    const headers = ['Entry ID', 'Timestamp', 'Type', 'Amount', 'Currency', 'From', 'To', 'PayPal Order Ref', 'PayPal Capture ID', 'Notes'];
    const rows = filteredEntries.map((e) => [
      e.id,
      e.createdAt,
      e.type,
      e.amount,
      e.currency,
      getUserName(e.fromUserId),
      getUserName(e.toUserId),
      e.paypalRef,
      e.paypalCaptureId,
      `"${e.notes.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kitty-ledger-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Ask the Ledger AI Card */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Ask-the-Ledger AI Auditor (Gemini 3.8 Flash)
              </h3>
              <p className="text-xs text-slate-400">
                Ask questions about money movements. Gemini answers strictly from verified ledger entries, citing Entry IDs and PayPal Capture IDs.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
            Strict Grounding & Citations
          </span>
        </div>

        {/* Chat History */}
        <div className="mt-4 space-y-3 max-h-56 overflow-y-auto pr-1">
          {chatHistory.map((item, idx) => (
            <div key={idx} className="space-y-1 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                  Q
                </span>
                <span>{item.q}</span>
                <span className="text-[10px] text-slate-400 font-mono ml-auto">{item.time}</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-teal-200 leading-relaxed font-sans">
                {item.a}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => handleAsk('Who has paid round 2 so far?')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
          >
            "Who has paid Round 2?"
          </button>
          <button
            onClick={() => handleAsk("What is Rudo's Round 1 payout capture ID?")}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
          >
            "Show Rudo's payout capture"
          </button>
          <button
            onClick={() => handleAsk('Are there any unpaid or delinquent contributions?')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
          >
            "Who is pending?"
          </button>
        </div>

        {/* Query Input */}
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={chatQuestion}
            onChange={(e) => setChatQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask anything: Where is my $100? Who received slot 1?..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
          />
          <button
            onClick={() => handleAsk()}
            disabled={isAsking}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAsking ? 'Auditing...' : 'Ask AI'}</span>
          </button>
        </div>
      </div>

      {/* Ledger Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Table className="w-4 h-4 text-amber-400" />
              Immutable Money Movement Ledger ({filteredEntries.length} entries)
            </h3>
            <p className="text-xs text-slate-400">
              Append-only financial record. Every row correlates to a verified PayPal Orders v2 capture ID.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by entry ID, capture ID, or member..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                typeFilter === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('CONTRIBUTION')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                typeFilter === 'CONTRIBUTION' ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Contributions
            </button>
            <button
              onClick={() => setTypeFilter('PAYOUT_SETTLED')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                typeFilter === 'PAYOUT_SETTLED' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Payouts
            </button>
            <button
              onClick={() => setTypeFilter('SWAP_FEE')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                typeFilter === 'SWAP_FEE' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Swap Fees
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Entry ID</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3">From</th>
                <th className="py-3 px-3">To (Payee)</th>
                <th className="py-3 px-3">PayPal Capture ID</th>
                <th className="py-3 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
              {filteredEntries.map((row) => {
                const isPayout = row.type === 'PAYOUT_SETTLED';
                const isSwap = row.type === 'SWAP_FEE';

                return (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-mono font-bold text-amber-400">
                      {row.id}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono whitespace-nowrap">
                      {new Date(row.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      {new Date(row.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          isPayout
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isSwap
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white whitespace-nowrap">
                      ${row.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-200">
                      {getUserName(row.fromUserId)}
                    </td>
                    <td className="py-3 px-3 font-medium text-emerald-400">
                      {getUserName(row.toUserId)}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                      <div className="flex items-center gap-1 group">
                        <span className="truncate max-w-[140px]">{row.paypalCaptureId}</span>
                        <a
                          href={`https://api-m.sandbox.paypal.com/v2/payments/captures/${row.paypalCaptureId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:text-blue-300 opacity-60 group-hover:opacity-100 transition"
                          title="View PayPal Sandbox Capture Endpoint"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-[220px] truncate" title={row.notes}>
                      {row.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
