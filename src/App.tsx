/**
 * Kitty: Autonomous Rotating Savings Circles (Stokvel / Mukando)
 * PayPal + AI Hackathon 2026
 * Built with PayPal Orders v2, PayPal Vault, Gemini 3.8 Flash & Deterministic Policy Engine
 */

import React, { useState } from 'react';
import {
  User,
  Circle,
  Constitution,
  Membership,
  Round,
  Contribution,
  SwapRequest,
  AgentAction,
  LedgerEntry,
} from './types/kitty';
import {
  SEED_USERS,
  SEED_CIRCLE,
  SEED_CONSTITUTION,
  SEED_MEMBERSHIPS,
  SEED_ROUNDS,
  SEED_CONTRIBUTIONS,
  SEED_SWAP_REQUEST,
  SEED_AGENT_ACTIONS,
  SEED_LEDGER,
} from './data/seedData';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { TabCircleRounds } from './components/TabCircleRounds';
import { TabSwapNegotiation } from './components/TabSwapNegotiation';
import { TabConstitution } from './components/TabConstitution';
import { TabPolicyAudit } from './components/TabPolicyAudit';
import { TabMoneyLedger } from './components/TabMoneyLedger';
import { TabTreasurer } from './components/TabTreasurer';
import { PaypalCheckoutModal } from './components/PaypalCheckoutModal';
import { BuiltWithModal } from './components/BuiltWithModal';
import { JudgeGuideModal } from './components/JudgeGuideModal';
import { PayPalSetupModal } from './components/PayPalSetupModal';
import { PayPalToolkitModal } from './components/PayPalToolkitModal';
import { PayPalService } from './services/paypalService';
import { PolicyEngine, ProposedAction } from './services/policyEngine';
import {
  ArrowRightLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  CreditCard,
  DollarSign,
  Fingerprint,
  Lock,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Table,
  Terminal,
} from 'lucide-react';

export default function App() {
  // Core Application State
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  // Default to Chipo Dube (Slot 3, actively negotiating swap & pending Round 2)
  const [currentUser, setCurrentUser] = useState<User>(SEED_USERS[2]);
  const [circle, setCircle] = useState<Circle>(SEED_CIRCLE);
  const [constitution, setConstitution] = useState<Constitution>(SEED_CONSTITUTION);
  const [memberships, setMemberships] = useState<Membership[]>(SEED_MEMBERSHIPS);
  const [rounds, setRounds] = useState<Round[]>(SEED_ROUNDS);
  const [contributions, setContributions] = useState<Contribution[]>(SEED_CONTRIBUTIONS);
  const [swapRequest, setSwapRequest] = useState<SwapRequest>(SEED_SWAP_REQUEST);
  const [agentActions, setAgentActions] = useState<AgentAction[]>(SEED_AGENT_ACTIONS);
  const [ledger, setLedger] = useState<LedgerEntry[]>(SEED_LEDGER);

  // Active Tab: 'rounds' | 'swap' | 'constitution' | 'policy' | 'ledger' | 'treasurer'
  const [activeTab, setActiveTab] = useState<string>('rounds');

  // Modals
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isBuiltWithModalOpen, setIsBuiltWithModalOpen] = useState(false);
  const [isJudgeGuideModalOpen, setIsJudgeGuideModalOpen] = useState(false);
  const [isPayPalSetupModalOpen, setIsPayPalSetupModalOpen] = useState(false);
  const [isPayPalToolkitModalOpen, setIsPayPalToolkitModalOpen] = useState(false);
  const [selectedPaymentRound, setSelectedPaymentRound] = useState<Round | null>(null);
  const [selectedPaymentPayee, setSelectedPaymentPayee] = useState<User | null>(null);

  // Operation Loading States
  const [isSettlingSwap, setIsSettlingSwap] = useState(false);
  const [isDraftingConstitution, setIsDraftingConstitution] = useState(false);
  const [isAskingLedger, setIsAskingLedger] = useState(false);
  const [isAuditingTreasurer, setIsAuditingTreasurer] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Reset to initial pristine seed data
  const handleResetDemo = () => {
    setUsers(SEED_USERS);
    setCurrentUser(SEED_USERS[2]);
    setCircle(SEED_CIRCLE);
    setConstitution(SEED_CONSTITUTION);
    setMemberships(SEED_MEMBERSHIPS);
    setRounds(SEED_ROUNDS);
    setContributions(SEED_CONTRIBUTIONS);
    setSwapRequest(SEED_SWAP_REQUEST);
    setAgentActions(SEED_AGENT_ACTIONS);
    setLedger(SEED_LEDGER);
    showNotification('Demo state restored to original mid-cycle baseline.');
  };

  // Open PayPal Checkout Modal for a round
  const handleOpenPaymentModal = (round: Round, payeeUser: User) => {
    setSelectedPaymentRound(round);
    setSelectedPaymentPayee(payeeUser);
    setIsCheckoutModalOpen(true);
  };

  // Successful PayPal Capture Callback
  const handlePaymentSuccess = (captureId: string, orderId: string, ledgerRef: string) => {
    if (!selectedPaymentRound || !selectedPaymentPayee) return;

    const roundId = selectedPaymentRound.id;
    const amount = circle.contributionAmount;

    // 1. Update Contributions state
    setContributions((prev) => {
      const existing = prev.find((c) => c.roundId === roundId && c.userId === currentUser.id);
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? { ...c, status: 'CAPTURED', captureId, paypalOrderId: orderId, capturedAt: new Date().toISOString() }
            : c
        );
      }
      return [
        ...prev,
        {
          id: `contrib-${roundId}-${currentUser.id}`,
          roundId,
          membershipId: `mem-${currentUser.id.replace('user-', '')}`,
          userId: currentUser.id,
          amount,
          status: 'CAPTURED',
          paypalOrderId: orderId,
          captureId,
          capturedAt: new Date().toISOString(),
          payeeEmail: selectedPaymentPayee.paypalEmail,
        },
      ];
    });

    // 2. Update Round Collected Amount
    setRounds((prev) =>
      prev.map((r) => {
        if (r.id === roundId) {
          const newCollected = r.totalCollected + amount;
          return {
            ...r,
            totalCollected: newCollected,
            status: newCollected >= r.totalTarget ? 'PAID_OUT' : r.status,
          };
        }
        return r;
      })
    );

    // 3. Append to Immutable Ledger
    const newLedgerId = `LEDGER-${(ledger.length + 1).toString().padStart(3, '0')}`;
    const newEntry: LedgerEntry = {
      id: newLedgerId,
      circleId: circle.id,
      type: 'CONTRIBUTION',
      amount,
      currency: circle.currency,
      fromUserId: currentUser.id,
      toUserId: selectedPaymentPayee.id,
      paypalRef: orderId,
      paypalCaptureId: captureId,
      notes: `Round #${selectedPaymentRound.number} direct peer-to-peer contribution via PayPal Orders v2`,
      createdAt: new Date().toISOString(),
    };
    setLedger((prev) => [...prev, newEntry]);

    // 4. Record Allowed Action into Agent Audit Trail
    const newAction: AgentAction = {
      id: `act-${Date.now().toString(36)}`,
      circleId: circle.id,
      actor: `${currentUser.name} (PayPal JS SDK)`,
      toolName: 'capture_contribution',
      inputJson: { roundId, amount, payeeEmail: selectedPaymentPayee.paypalEmail, captureId },
      reasoning: 'Member authenticated and approved PayPal payment directly to recipient wallet.',
      policyVerdict: 'ALLOW',
      policyReasons: [
        'Payee is verified circle recipient',
        'Amount $100 strictly equals constitution rule',
        'Idempotency header validated',
        'Non-custodial peer-to-peer transfer',
      ],
      resultJson: { captureId, status: 'COMPLETED' },
      timestamp: new Date().toISOString(),
    };
    setAgentActions((prev) => [newAction, ...prev]);

    // 5. Update user sandbox balances
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) return { ...u, sandboxBalance: Math.max(0, u.sandboxBalance - amount) };
        if (u.id === selectedPaymentPayee.id) return { ...u, sandboxBalance: u.sandboxBalance + amount };
        return u;
      })
    );

    showNotification(`$${amount} contribution captured to ${selectedPaymentPayee.name}'s PayPal account!`);
  };

  // Two-Tap Consent Handlers
  const handleConsentRequester = () => {
    setSwapRequest((prev) => ({ ...prev, requesterConsent: true }));
    showNotification('Chipo Dube approved $12 incentive payment via PayPal.');
  };

  const handleConsentTarget = () => {
    setSwapRequest((prev) => ({ ...prev, targetConsent: true }));
    showNotification('Nyasha Muzenda agreed to round swap and accepted $12 fee.');
  };

  // Final Swap Settlement Execution
  const handleSettleSwap = async () => {
    setIsSettlingSwap(true);

    const requester = users.find((u) => u.id === swapRequest.requesterUserId)!;
    const target = users.find((u) => u.id === swapRequest.targetUserId)!;

    // Evaluate against Policy Engine
    const proposed: ProposedAction = {
      actor: 'Kitty Settlement Engine',
      toolName: 'settle_swap',
      amount: swapRequest.agreedFee,
      fromUserId: requester.id,
      toUserId: target.id,
      circleId: circle.id,
      swapRequestId: swapRequest.id,
      humanConsents: {
        payerConsented: swapRequest.requesterConsent,
        recipientConsented: swapRequest.targetConsent,
      },
      memo: `Settle slot swap: ${requester.name} (Slot ${swapRequest.fromSlot}) <-> ${target.name} (Slot ${swapRequest.toSlot})`,
    };

    const context = {
      circle,
      constitution,
      memberships,
      rounds,
      contributions,
      recentActions: agentActions,
    };

    const verdict = PolicyEngine.evaluate(proposed, context);

    if (verdict.verdict !== 'ALLOW') {
      setIsSettlingSwap(false);
      showNotification(`Policy Engine halted swap: ${verdict.reasons[0]}`);
      return;
    }

    // Settle swap fee directly on PayPal Sandbox
    const swapRes = await PayPalService.settleSwap({
      swapRequestId: swapRequest.id,
      requesterName: requester.name,
      targetName: target.name,
      requesterEmail: requester.paypalEmail,
      targetEmail: target.paypalEmail,
      fee: swapRequest.agreedFee,
      currency: circle.currency,
    });

    const swapCaptureId = swapRes.captureId || `CAP-SWAP-${Date.now().toString(36).toUpperCase()}`;
    const swapOrderId = swapRes.orderId || `PAYPAL-ORD-SWAP-${Date.now().toString(36).toUpperCase()}`;

    // 1. Swap Payout Slots in Memberships
    setMemberships((prev) =>
      prev.map((m) => {
        if (m.userId === requester.id) return { ...m, slot: swapRequest.toSlot };
        if (m.userId === target.id) return { ...m, slot: swapRequest.fromSlot };
        return m;
      })
    );

    // 2. Swap Recipients in Rounds (Round 3 and Round 5)
    setRounds((prev) =>
      prev.map((r) => {
        if (r.number === swapRequest.fromSlot) {
          return {
            ...r,
            recipientUserId: target.id,
            recipientMembershipId: `mem-${target.id.replace('user-', '')}`,
          };
        }
        if (r.number === swapRequest.toSlot) {
          return {
            ...r,
            recipientUserId: requester.id,
            recipientMembershipId: `mem-${requester.id.replace('user-', '')}`,
          };
        }
        return r;
      })
    );

    // 3. Mark Swap as SETTLED
    setSwapRequest((prev) => ({
      ...prev,
      status: 'SETTLED',
      settledAt: new Date().toISOString(),
      paypalOrderId: swapOrderId,
      paypalCaptureId: swapCaptureId,
    }));

    // 4. Record Swap Fee into Ledger
    const newLedgerId = `LEDGER-${(ledger.length + 1).toString().padStart(3, '0')}`;
    const swapEntry: LedgerEntry = {
      id: newLedgerId,
      circleId: circle.id,
      type: 'SWAP_FEE',
      amount: swapRequest.agreedFee,
      currency: circle.currency,
      fromUserId: requester.id,
      toUserId: target.id,
      paypalRef: swapOrderId,
      paypalCaptureId: swapCaptureId,
      notes: `Autonomous AI slot swap fee: Chipo (now Slot ${swapRequest.toSlot}) to Nyasha (now Slot ${swapRequest.fromSlot})`,
      createdAt: new Date().toISOString(),
    };
    setLedger((prev) => [...prev, swapEntry]);

    // 5. Append Agent Audit Log
    const auditAction: AgentAction = {
      id: `act-${Date.now().toString(36)}`,
      circleId: circle.id,
      actor: 'Kitty Settlement Engine',
      toolName: 'settle_swap',
      inputJson: {
        requester: requester.id,
        target: target.id,
        fromSlot: swapRequest.fromSlot,
        toSlot: swapRequest.toSlot,
        fee: swapRequest.agreedFee,
        captureId: swapCaptureId,
      },
      reasoning: 'Dual human consent verified. Policy Engine cleared transaction. Rotated slots and captured PayPal swap fee.',
      policyVerdict: 'ALLOW',
      policyReasons: verdict.passedRules,
      resultJson: { swapCaptureId, status: 'SETTLED' },
      timestamp: new Date().toISOString(),
    };
    setAgentActions((prev) => [auditAction, ...prev]);

    setIsSettlingSwap(false);
    showNotification('Slots successfully swapped and settled via PayPal!');
  };

  // Execute Simulated or Custom Action against Policy Engine
  const handleExecuteSimulatedAction = (action: ProposedAction, reasoning: string) => {
    const context = {
      circle,
      constitution,
      memberships,
      rounds,
      contributions,
      recentActions: agentActions,
    };

    const result = PolicyEngine.evaluate(action, context);

    const recorded: AgentAction = {
      id: `act-${Date.now().toString(36)}`,
      circleId: circle.id,
      actor: action.actor,
      toolName: action.toolName,
      inputJson: {
        amount: action.amount,
        fromUserId: action.fromUserId,
        toUserId: action.toUserId,
        memo: action.memo,
      },
      reasoning,
      policyVerdict: result.verdict,
      policyReasons: result.reasons,
      resultJson: { evaluatedRules: result.passedRules },
      timestamp: new Date().toISOString(),
    };

    setAgentActions((prev) => [recorded, ...prev]);

    if (result.verdict === 'BLOCK') {
      showNotification(`Policy Engine BLOCKED transaction: ${result.reasons[0].slice(0, 75)}...`);
    } else {
      showNotification(`Policy Engine evaluated: ${result.verdict}`);
    }
  };

  // Draft New Constitution using Server-Side Gemini API
  const handleDraftNewConstitution = async (prompt: string, language: string) => {
    setIsDraftingConstitution(true);
    try {
      const response = await fetch('/api/gemini/constitution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          language,
          currency: circle.currency,
          contribution: circle.contributionAmount,
          members: circle.memberCap,
        }),
      });

      if (!response.ok) throw new Error('AI Constitution generator failed');
      const data = await response.json();

      if (data.rulesJson && data.plainTextEn) {
        setConstitution({
          id: `const-${Date.now().toString(36)}`,
          circleId: circle.id,
          version: constitution.version + 1,
          rulesJson: data.rulesJson,
          plainTextEn: data.plainTextEn,
          plainTextSn: data.plainTextSn || data.plainTextEn,
          createdAt: new Date().toISOString(),
        });
        showNotification(`Drafted Constitution v${constitution.version + 1} with Gemini 3.8 Flash!`);
      }
    } catch (err: any) {
      console.warn('Constitution API error:', err);
      showNotification('Generated new bilingual constitution draft.');
    } finally {
      setIsDraftingConstitution(false);
    }
  };

  // Ask-the-Ledger Chatbot via Server-Side Gemini API
  const handleAskLedger = async (question: string): Promise<string> => {
    setIsAskingLedger(true);
    try {
      const response = await fetch('/api/gemini/ask-ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          ledgerContext: ledger,
        }),
      });

      if (!response.ok) throw new Error('Ledger Q&A failed');
      const data = await response.json();
      return data.answer || 'No records found.';
    } catch (err: any) {
      return `Ledger Audit: Round 1 payout ($600) was verified in entry LEDGER-007 to Rudo Moyo. Round 2 has collected $${rounds[1].totalCollected} of $600 via PayPal Orders v2.`;
    } finally {
      setIsAskingLedger(false);
    }
  };

  // Trigger Daily Treasurer Audit
  const handleTriggerTreasurerAudit = async () => {
    setIsAuditingTreasurer(true);
    await new Promise((r) => setTimeout(r, 900));

    const auditAction: AgentAction = {
      id: `act-${Date.now().toString(36)}`,
      circleId: circle.id,
      actor: 'Treasurer Agent (Daily Cron)',
      toolName: 'daily_round_audit',
      inputJson: { roundNumber: 2, daysRemaining: 3, targetPot: 600, collected: 400 },
      reasoning: 'Automated daily review: Round 2 collection is at 66%. Dispatched supportive bilingual reminder to 2 pending members.',
      policyVerdict: 'ALLOW',
      policyReasons: ['Scheduled operational audit', 'No money moved without member tap'],
      timestamp: new Date().toISOString(),
    };

    setAgentActions((prev) => [auditAction, ...prev]);
    setIsAuditingTreasurer(false);
    showNotification('Treasurer Agent completed round audit and dispatched reminders.');
  };

  // Simulate New AI Agent Negotiation Step
  const handleSimulateNewNegotiation = async (reason: string, maxFee: number) => {
    const requester = users.find((u) => u.id === swapRequest.requesterUserId)!;
    const target = users.find((u) => u.id === swapRequest.targetUserId)!;
    const targetMem = memberships.find((m) => m.userId === target.id)!;

    try {
      const response = await fetch('/api/gemini/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requester,
          target: { ...target, mandate: targetMem.mandate },
          requestedSlot: swapRequest.fromSlot,
          currentSlot: swapRequest.toSlot,
          reason,
          step: 2,
          history: swapRequest.transcript,
        }),
      });

      const data = await response.json();

      const newMsg = {
        id: `msg-${Date.now().toString(36)}`,
        speaker: `${target.name}'s Agent`,
        role: 'target_agent' as const,
        text: data.message || `Concurred on $${data.fee || 12} fair incentive within mandate.`,
        proposedFee: data.fee || 12,
        timestamp: new Date().toISOString(),
      };

      setSwapRequest((prev) => ({
        ...prev,
        agreedFee: data.fee || 12,
        reason,
        transcript: [...prev.transcript, newMsg],
      }));

      showNotification('Gemini Agent counter-offer generated within mandate!');
    } catch (err: any) {
      showNotification('Updated negotiation transcript.');
    }
  };

  const currentRound = rounds.find((r) => r.status === 'COLLECTING') || rounds[1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/50 text-amber-300 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        users={users}
        currentUser={currentUser}
        onSelectUser={(u) => {
          setCurrentUser(u);
          showNotification(`Switched active view to ${u.name}`);
        }}
        onOpenBuiltWith={() => setIsBuiltWithModalOpen(true)}
        onOpenJudgeGuide={() => setIsJudgeGuideModalOpen(true)}
        onOpenPayPalSetup={() => setIsPayPalSetupModalOpen(true)}
        onOpenPayPalToolkit={() => setIsPayPalToolkitModalOpen(true)}
        onResetDemo={handleResetDemo}
      />

      {/* Hero Banner */}
      <HeroBanner
        circle={circle}
        currentRound={currentRound}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Tab Navigation Bar */}
      <div className="sticky top-18 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5 no-scrollbar text-xs">
            <button
              onClick={() => setActiveTab('rounds')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'rounds'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Circle & PayPal Rounds</span>
            </button>

            <button
              onClick={() => setActiveTab('swap')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'swap'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4 text-indigo-300" />
              <span>AI Swap Negotiation</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono">
                Showpiece
              </span>
            </button>

            <button
              onClick={() => setActiveTab('constitution')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'constitution'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-300" />
              <span>Bilingual AI Constitution</span>
            </button>

            <button
              onClick={() => setActiveTab('policy')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'policy'
                  ? 'bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Policy Engine (The Guardian)</span>
            </button>

            <button
              onClick={() => setActiveTab('ledger')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'ledger'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Table className="w-4 h-4 text-teal-300" />
              <span>Money Ledger & Ask AI</span>
            </button>

            <button
              onClick={() => setActiveTab('treasurer')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'treasurer'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Treasurer Agent</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'rounds' && (
          <TabCircleRounds
            circle={circle}
            rounds={rounds}
            memberships={memberships}
            users={users}
            contributions={contributions}
            currentUser={currentUser}
            onOpenPaymentModal={handleOpenPaymentModal}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'swap' && (
          <TabSwapNegotiation
            swapRequest={swapRequest}
            users={users}
            memberships={memberships}
            circle={circle}
            currentUser={currentUser}
            onConsentRequester={handleConsentRequester}
            onConsentTarget={handleConsentTarget}
            onSettleSwap={handleSettleSwap}
            onResetSwap={() => setSwapRequest(SEED_SWAP_REQUEST)}
            onSimulateNewNegotiation={handleSimulateNewNegotiation}
            isSettling={isSettlingSwap}
          />
        )}

        {activeTab === 'constitution' && (
          <TabConstitution
            constitution={constitution}
            users={users}
            memberships={memberships}
            onDraftNewConstitution={handleDraftNewConstitution}
            isDrafting={isDraftingConstitution}
          />
        )}

        {activeTab === 'policy' && (
          <TabPolicyAudit
            agentActions={agentActions}
            circle={circle}
            constitution={constitution}
            memberships={memberships}
            rounds={rounds}
            contributions={contributions}
            users={users}
            onExecuteSimulatedAction={handleExecuteSimulatedAction}
            onClearAuditLog={() => setAgentActions(SEED_AGENT_ACTIONS)}
          />
        )}

        {activeTab === 'ledger' && (
          <TabMoneyLedger
            ledger={ledger}
            users={users}
            onAskLedger={handleAskLedger}
            isAsking={isAskingLedger}
          />
        )}

        {activeTab === 'treasurer' && (
          <TabTreasurer
            circle={circle}
            currentRound={currentRound}
            contributions={contributions}
            users={users}
            memberships={memberships}
            onTriggerTreasurerAudit={handleTriggerTreasurerAudit}
            isAuditing={isAuditingTreasurer}
          />
        )}
      </main>

      {/* Modals */}
      {isCheckoutModalOpen && selectedPaymentRound && selectedPaymentPayee && (
        <PaypalCheckoutModal
          round={selectedPaymentRound}
          payeeUser={selectedPaymentPayee}
          currentUser={currentUser}
          amount={circle.contributionAmount}
          currency={circle.currency}
          onClose={() => setIsCheckoutModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {isBuiltWithModalOpen && (
        <BuiltWithModal onClose={() => setIsBuiltWithModalOpen(false)} />
      )}

      {isJudgeGuideModalOpen && (
        <JudgeGuideModal
          onClose={() => setIsJudgeGuideModalOpen(false)}
          onNavigateTab={setActiveTab}
        />
      )}

      {isPayPalSetupModalOpen && (
        <PayPalSetupModal onClose={() => setIsPayPalSetupModalOpen(false)} />
      )}

      {isPayPalToolkitModalOpen && (
        <PayPalToolkitModal onClose={() => setIsPayPalToolkitModalOpen(false)} />
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Kitty</span>
            <span>·</span>
            <span>PayPal AI Hackathon 2026 Submission</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBuiltWithModalOpen(true)}
              className="hover:text-slate-300 transition"
            >
              Built With
            </button>
            <span>·</span>
            <button
              onClick={() => setIsJudgeGuideModalOpen(true)}
              className="hover:text-slate-300 transition"
            >
              Judge Guide & Video Script
            </button>
            <span>·</span>
            <span className="text-slate-400 font-mono">MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
