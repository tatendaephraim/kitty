import React, { useState } from 'react';
import { Constitution, User, Membership } from '../types/kitty';
import {
  BookOpen,
  CheckCircle,
  Copy,
  Globe2,
  Lock,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';

interface TabConstitutionProps {
  constitution: Constitution;
  users: User[];
  memberships: Membership[];
  onDraftNewConstitution: (prompt: string, language: string) => Promise<void>;
  isDrafting: boolean;
}

export const TabConstitution: React.FC<TabConstitutionProps> = ({
  constitution,
  users,
  memberships,
  onDraftNewConstitution,
  isDrafting,
}) => {
  const [selectedLang, setSelectedLang] = useState<'bilingual' | 'en' | 'sn'>('bilingual');
  const [activeJsonTab, setActiveJsonTab] = useState<'bylaws' | 'rulesJson'>('bylaws');
  const [draftPrompt, setDraftPrompt] = useState(
    '6 of us healthcare workers in Manchester, $100 a month on the 1st via PayPal, random draw for slots, 5-day grace period with $10 penalty, autonomous AI agent slot swaps permitted.'
  );
  const [draftLang, setDraftLang] = useState('bilingual');
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(constitution.rulesJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePresetPrompt = (preset: 'en' | 'sn') => {
    if (preset === 'sn') {
      setDraftPrompt(
        'Tiri vanhu 6 vanoshanda muUK, tinobvisa $100 pamwedzi ichibhadharwa zvakananga pa PayPal. Nzvimbwana dzekutambira dzinokweverwa pachena. Nhengo inopihwa mazuva 5 ekunonoka pashure pacho pane chirango che $10.'
      );
      setDraftLang('sn');
    } else {
      setDraftPrompt(
        '6 tech consultants in London saving $100 monthly. Direct PayPal peer payments. 5-day grace period, $10 late fee, autonomous AI slot swaps allowed.'
      );
      setDraftLang('en');
    }
  };

  const handleSubmitDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftPrompt.trim()) return;
    await onDraftNewConstitution(draftPrompt, draftLang);
  };

  return (
    <div className="space-y-6">
      {/* Top Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-purple-400" />
                Multilingual AI Constitution
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Version {constitution.version}.0 (Active)
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Deterministic Rules + Cultural Bylaws in English & Shona
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Every circle operates on a double foundation: machine-readable JSON that the Policy Engine strictly enforces, and natural bylaws translated into community languages (Chishona & English) so every diaspora member has complete cultural trust.
            </p>
          </div>

          {/* Language / Mode Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700 self-start md:self-center">
            <button
              onClick={() => setSelectedLang('bilingual')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedLang === 'bilingual'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side (Bilingual)
            </button>
            <button
              onClick={() => setSelectedLang('en')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedLang === 'en'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English Only
            </button>
            <button
              onClick={() => setSelectedLang('sn')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedLang === 'sn'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chishona Only
            </button>
          </div>
        </div>
      </div>

      {/* Bylaws View vs JSON Toggle */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveJsonTab('bylaws')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeJsonTab === 'bylaws'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Human-Readable Bylaws
          </button>
          <button
            onClick={() => setActiveJsonTab('rulesJson')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeJsonTab === 'rulesJson'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Machine-Readable rulesJson</span>
            <span className="text-[10px] font-mono text-purple-300">Policy Schema</span>
          </button>
        </div>

        {activeJsonTab === 'rulesJson' && (
          <button
            onClick={handleCopyJson}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>
        )}
      </div>

      {/* Main Constitution Content */}
      {activeJsonTab === 'bylaws' ? (
        <div className={`grid gap-4 ${selectedLang === 'bilingual' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          {/* English Version */}
          {(selectedLang === 'bilingual' || selectedLang === 'en') && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-blue-400" /> English Constitution
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Consented by 6/6 Members</span>
              </div>
              <pre className="mt-4 text-xs font-sans text-slate-300 whitespace-pre-wrap leading-relaxed">
                {constitution.plainTextEn}
              </pre>
            </div>
          )}

          {/* Shona Version */}
          {(selectedLang === 'bilingual' || selectedLang === 'sn') && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-amber-400" /> Bumbiro reMitemo (Chishona)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Zvabvumiranwa ne Nhengo 6</span>
              </div>
              <pre className="mt-4 text-xs font-sans text-slate-300 whitespace-pre-wrap leading-relaxed">
                {constitution.plainTextSn}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="text-xs text-slate-400 mb-2 font-mono">
            // This JSON schema is fed directly into Kitty's Deterministic Policy Engine (Rule 2)
          </div>
          <pre className="text-xs font-mono text-emerald-300 bg-slate-900/80 p-4 rounded-xl overflow-x-auto border border-slate-800">
            {JSON.stringify(constitution.rulesJson, null, 2)}
          </pre>
        </div>
      )}

      {/* Member Signatures & Consent Registry */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Verified Consent Registry (All 6 Members Agreed)
            </span>
          </div>
          <span className="text-xs text-emerald-400 font-mono">
            consentedConstitutionVersion: 1
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {memberships.map((m) => {
            const memberUser = users.find((u) => u.id === m.userId);
            return (
              <div
                key={m.id}
                className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center"
              >
                <img
                  src={memberUser?.avatar}
                  alt={memberUser?.name}
                  className="w-10 h-10 rounded-full object-cover mx-auto ring-1 ring-emerald-500/50"
                />
                <div className="text-xs font-semibold text-white mt-1.5 truncate">
                  {memberUser?.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Slot #{m.slot}</div>
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" /> Agreed v1
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Constitution Drafter Studio */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Live AI Constitution Drafter (Gemini 3.8 Flash)
              </h3>
              <p className="text-xs text-slate-400">
                Type an informal circle description in English or Shona and watch the AI synthesize bilingual bylaws and deterministic rules.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handlePresetPrompt('en')}
              className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
            >
              Preset (English)
            </button>
            <button
              type="button"
              onClick={() => handlePresetPrompt('sn')}
              className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
            >
              Preset (Chishona)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmitDraft} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Organizer Natural Language Prompt:
            </label>
            <textarea
              value={draftPrompt}
              onChange={(e) => setDraftPrompt(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
              placeholder="Describe circle size, monthly amount, late penalties, payout rules..."
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Target Output:</span>
              <select
                value={draftLang}
                onChange={(e) => setDraftLang(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
              >
                <option value="bilingual">Bilingual (English + Chishona)</option>
                <option value="en">English Only</option>
                <option value="sn">Chishona Only</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isDrafting}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isDrafting ? 'Drafting with Gemini AI...' : 'Draft New Constitution with AI'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
