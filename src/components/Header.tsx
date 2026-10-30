import React from 'react';
import { User } from '../types/kitty';
import {
  ShieldCheck,
  CreditCard,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Wrench,
  Image as ImageIcon,
} from 'lucide-react';

interface HeaderProps {
  users: User[];
  currentUser: User;
  onSelectUser: (user: User) => void;
  onOpenBuiltWith: () => void;
  onOpenJudgeGuide?: () => void;
  onOpenPayPalSetup: () => void;
  onOpenPayPalToolkit: () => void;
  onOpenGallery: () => void;
  onResetDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  users,
  currentUser,
  onSelectUser,
  onOpenBuiltWith,
  onOpenJudgeGuide,
  onOpenPayPalSetup,
  onOpenPayPalToolkit,
  onOpenGallery,
  onResetDemo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-white/20">
            <span className="text-xl font-black text-slate-950 tracking-tighter">KY</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">Kitty</span>
              <span className="px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                PayPal + AI
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Autonomous Rotating Savings (Stokvel / Mukando)
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Role Switcher Dropdown */}
          <div className="relative group">
            <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-0.5 sm:hidden">
              Viewing As:
            </label>
            <div className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 cursor-pointer transition">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-400/50"
              />
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                  <span>{currentUser.name}</span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    (Slot {currentUser.roleDescription.includes('Slot') ? currentUser.roleDescription.match(/Slot (\d)/)?.[1] : '1'})
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                  {currentUser.roleDescription}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-1 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 hidden group-hover:block hover:block z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-slate-800 mb-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Switch Demo Member (Zero Signup)
                </span>
              </div>
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => onSelectUser(u)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition ${
                    u.id === currentUser.id
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      : 'hover:bg-slate-800/60 text-slate-200'
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold flex items-center justify-between">
                      <span className="truncate">{u.name}</span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        ${u.sandboxBalance.toFixed(0)}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{u.roleDescription}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* PayPal Sandbox Setup & Instructions Button */}
          <button
            onClick={onOpenPayPalSetup}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/30 transition cursor-pointer"
            title="PayPal Sandbox Live Credentials & Test Accounts Setup"
          >
            <CreditCard className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">PayPal Sandbox Setup</span>
            <span className="sm:hidden">PayPal</span>
          </button>

          {/* PayPal Agent Toolkit Button */}
          <button
            onClick={onOpenPayPalToolkit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/30 transition cursor-pointer"
            title="Inspect 47 PayPal Agent Tools and AI Partner Swapping"
          >
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">PayPal Agent Toolkit (47 Tools)</span>
            <span className="sm:hidden">AI Toolkit</span>
          </button>

          {/* Built With Button */}
          <button
            onClick={onOpenBuiltWith}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Inspect Built With & Architecture"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Built With</span>
          </button>

          {/* Devpost Media Gallery Button */}
          <button
            onClick={onOpenGallery}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition cursor-pointer"
            title="Preview and Download 3:2 Ratio Devpost Media Images"
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Gallery (3:2)</span>
            <span className="sm:hidden">Gallery</span>
          </button>

          {/* Reset Demo State Button labeled Initial State */}
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition cursor-pointer"
            title="Reset demo data to initial pristine state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Initial State</span>
          </button>
        </div>
      </div>
    </header>
  );
};
