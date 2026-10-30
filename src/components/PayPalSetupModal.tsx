import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Copy,
  DollarSign,
  ExternalLink,
  Key,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  UserCheck,
  X,
  Zap,
} from 'lucide-react';

interface PayPalSetupModalProps {
  onClose: () => void;
}

interface ConnectionStatus {
  configured: boolean;
  authenticated: boolean;
  apiBase: string;
  clientIdMasked: string;
  message: string;
}

export const PayPalSetupModal: React.FC<PayPalSetupModalProps> = ({ onClose }) => {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [webhookData, setWebhookData] = useState<any>(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<string | null>(null);

  const fetchWebhookEvents = async () => {
    try {
      const res = await fetch('/api/paypal/webhook-events');
      const data = await res.json();
      setWebhookData(data);
    } catch (err: any) {
      console.warn('Could not fetch webhook events:', err);
    }
  };

  const handleTriggerTestWebhook = async () => {
    setIsTestingWebhook(true);
    setWebhookTestResult(null);
    try {
      const res = await fetch('/api/paypal/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'PAYMENT.CAPTURE.COMPLETED' }),
      });
      const data = await res.json();
      if (data.success) {
        setWebhookTestResult('Success: PayPal Sandbox accepted simulation and dispatched PAYMENT.CAPTURE.COMPLETED event!');
        fetchWebhookEvents();
      } else {
        setWebhookTestResult(`Simulation result: ${JSON.stringify(data.error || data.message)}`);
      }
    } catch (err: any) {
      setWebhookTestResult(`Error: ${err.message}`);
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/paypal/test-connection');
      const data = await res.json();
      setStatus(data);
      fetchWebhookEvents();
    } catch (err: any) {
      setStatus({
        configured: false,
        authenticated: false,
        apiBase: 'https://api-m.sandbox.paypal.com',
        clientIdMasked: 'Error querying backend',
        message: 'Could not connect to backend server endpoint.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    fetchWebhookEvents();
  }, []);

  const handleCopyEnv = () => {
    const text = `# Add to your .env or .env.local file:
PAYPAL_CLIENT_ID="your_sandbox_client_id_here"
PAYPAL_CLIENT_SECRET="your_sandbox_client_secret_here"
PAYPAL_API_BASE="https://api-m.sandbox.paypal.com"
PAYPAL_WEBHOOK_ID="your_sandbox_webhook_id_here"`;
    navigator.clipboard.writeText(text);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="bg-[#003087] px-6 py-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black italic tracking-tight font-sans">
                  PayPal <span className="text-[#0079C1]">Developer Sandbox</span>
                </span>
                <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Live Setup Guide
                </span>
              </div>
              <p className="text-xs text-white/80">
                Instructions for connecting your sandbox REST app & test accounts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Live Status Card */}
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              status?.authenticated
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : status?.configured
                ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                : 'bg-blue-950/30 border-blue-500/40 text-blue-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {status?.authenticated ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                ) : status?.configured ? (
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                ) : (
                  <Zap className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <div>
                <span className="font-bold text-xs uppercase tracking-wider block">
                  Current Status:{' '}
                  {status?.authenticated
                    ? 'Connected to Live PayPal Sandbox API'
                    : status?.configured
                    ? 'Configured (Authentication Pending)'
                    : 'Running in High-Fidelity Sandbox Simulator Mode'}
                </span>
                <p className="text-[11px] text-slate-300 mt-0.5">{status?.message}</p>
                <div className="mt-1 text-[10px] font-mono text-slate-400">
                  Client ID: {status?.clientIdMasked || 'Loading...'} · Endpoint: {status?.apiBase}
                </div>
              </div>
            </div>

            <button
              onClick={checkConnection}
              disabled={isChecking}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition self-start sm:self-center shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Pinging PayPal...' : 'Test Connection'}</span>
            </button>
          </div>

          {/* STEP 1: Developer Account & Sandbox App */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                Create Your Sandbox REST App
              </span>
              <a
                href="https://developer.paypal.com/dashboard/applications/sandbox"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
              >
                <span>developer.paypal.com/dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
              <li>Log into the <strong>PayPal Developer Dashboard</strong> (<code className="text-blue-300">developer.paypal.com</code>).</li>
              <li>Ensure the toggle in the upper right is set to <strong>Sandbox</strong> (not Live).</li>
              <li>Under <strong>Apps & Credentials</strong>, click <strong>Create App</strong>.</li>
              <li>Name your app (e.g., <code className="text-amber-300">kitty-sandbox</code>) and select your default Sandbox Business Account.</li>
              <li>Copy your <strong>Client ID</strong> and <strong>Secret</strong> (Click "Show" to reveal Secret).</li>
            </ol>
          </div>

          {/* STEP 2: App Features to Enable */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                2
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Enable App Features in Sandbox Settings
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Inside your <code className="text-amber-300">kitty-sandbox</code> app settings page, ensure the following checkboxes are toggled on:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-200 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Orders / Checkout</span>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-200 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Vault (Saved cards)</span>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-200 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Payouts</span>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-200 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Invoicing</span>
              </div>
            </div>
          </div>

          {/* STEP 3: Sandbox Test Accounts Setup */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  3
                </span>
                Create 6 Sandbox Test Accounts (Under Testing Tools)
              </span>
              <a
                href="https://developer.paypal.com/dashboard/accounts"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
              >
                <span>Sandbox Accounts</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-slate-400">
              In the sidebar, click <strong>Testing Tools → Sandbox Accounts</strong>. Create accounts matching Kitty's 6 circle members:
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[10px]">
                  <tr>
                    <th className="p-2">Member</th>
                    <th className="p-2">Account Type</th>
                    <th className="p-2">Sandbox Email</th>
                    <th className="p-2">Role in Demo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                  <tr>
                    <td className="p-2 font-bold text-white">Rudo Moyo</td>
                    <td className="p-2 text-slate-400">Business / Personal</td>
                    <td className="p-2 font-mono text-blue-300">sb-rudo.platform@business.example.com</td>
                    <td className="p-2 text-emerald-400">Round 1 Recipient ($600 Paid Out)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-white">Tendai Chisamba</td>
                    <td className="p-2 text-slate-400">Personal</td>
                    <td className="p-2 font-mono text-blue-300">sb-tendai.member@personal.example.com</td>
                    <td className="p-2 text-amber-300">Round 2 Recipient (Collecting Now)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-white">Chipo Dube</td>
                    <td className="p-2 text-slate-400">Personal</td>
                    <td className="p-2 font-mono text-blue-300">sb-chipo.member@personal.example.com</td>
                    <td className="p-2 text-purple-300">Slot 3 (Requesting AI Slot Swap)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-white">Farai Ncube</td>
                    <td className="p-2 text-slate-400">Personal</td>
                    <td className="p-2 font-mono text-blue-300">sb-farai.member@personal.example.com</td>
                    <td className="p-2 text-slate-300">Slot 4 (Contributed Round 2)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-white">Nyasha Muzenda</td>
                    <td className="p-2 text-slate-400">Personal</td>
                    <td className="p-2 font-mono text-blue-300">sb-nyasha.member@personal.example.com</td>
                    <td className="p-2 text-purple-300">Slot 5 (Negotiating Swap with Chipo)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-white">Tatenda Chipwanya</td>
                    <td className="p-2 text-slate-400">Business</td>
                    <td className="p-2 font-mono text-blue-300">sb-tatenda.admin@business.example.com</td>
                    <td className="p-2 text-slate-300">Slot 6 (Circle Creator & Admin)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-400 italic">
              Tip: Click "..." on each account → "View/Edit Account" → give each a Sandbox balance of $1,000 (USD).
            </p>
          </div>

          {/* STEP 4: Put Keys in Environment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  4
                </span>
                Configure Secrets in Environment (.env or .env.local)
              </span>
              <button
                onClick={handleCopyEnv}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedEnv ? 'Copied!' : 'Copy Template'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
{`# In your .env or .env.local file:
PAYPAL_CLIENT_ID="AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
PAYPAL_CLIENT_SECRET="EYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
PAYPAL_API_BASE="https://api-m.sandbox.paypal.com"
PAYPAL_WEBHOOK_ID="your_sandbox_webhook_id_here"`}
            </pre>
            <p className="text-[10px] text-slate-400">
              Once updated, restart your server or click "Test Connection" above. Kitty will automatically detect your live sandbox credentials and route all Orders v2 and Captures to PayPal Sandbox!
            </p>
          </div>

          {/* STEP 5: Live Webhooks Verification & Simulator */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                  5
                </span>
                Live Webhook Verification & Simulator
              </span>
              <button
                onClick={handleTriggerTestWebhook}
                disabled={isTestingWebhook}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isTestingWebhook ? 'animate-spin' : ''}`} />
                <span>{isTestingWebhook ? 'Simulating Event...' : 'Trigger Live Test Webhook'}</span>
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Configured Webhook ID:</span>
                <span className="text-emerald-400 font-bold">{webhookData?.webhookId || 'Loading...'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Registered Destination URL:</span>
                <span className="text-blue-300 truncate max-w-[280px]">
                  {webhookData?.registeredWebhook?.url || 'https://kitty-2tnq.onrender.com/api/paypal/webhook'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400">ENABLED (Orders & Invoicing events)</span>
              </div>
            </div>

            {webhookTestResult && (
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-[11px]">
                {webhookTestResult}
              </div>
            )}

            {/* Recent Received Webhook Events */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Recent Webhook Events Received by /api/paypal/webhook:
              </span>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 border border-slate-800 rounded-xl p-2 bg-slate-950 font-mono text-[10px]">
                {webhookData?.recentEvents && webhookData.recentEvents.length > 0 ? (
                  webhookData.recentEvents.map((evt: any, i: number) => (
                    <div key={i} className="p-1.5 bg-slate-900 rounded border border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-emerald-400 font-bold">{evt.eventType}</span>
                        {evt.amount && <span className="text-slate-300 font-semibold">{evt.amount}</span>}
                        {evt.resourceId && <span className="text-amber-400 text-[9px]">ID: {evt.resourceId}</span>}
                      </div>
                      <span className="text-slate-500 text-[9px] shrink-0">
                        {new Date(evt.receivedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 text-center py-2">
                    No webhooks received yet. Click "Trigger Live Test Webhook" above to test!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">
            Environment: PayPal Sandbox REST APIs (v2)
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
