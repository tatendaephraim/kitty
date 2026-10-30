import React from 'react';
import { Download, ExternalLink, Image as ImageIcon, X } from 'lucide-react';

interface ImageGalleryModalProps {
  onClose: () => void;
}

interface GalleryItem {
  title: string;
  filename: string;
  description: string;
  tag: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    title: '1. Circle Dashboard & 0% Custody Rotation Schedule',
    filename: 'kitty-1-circle-dashboard.png',
    description: 'Active Round #2 pot progress ($400/$600), 6 member roster with payout slots, and direct peer-to-peer non-custodial PayPal routing callout.',
    tag: 'Core Dashboard · 3:2 Ratio',
  },
  {
    title: '2. Autonomous AI Slot Swap Negotiation',
    filename: 'kitty-2-autonomous-swap-agents.png',
    description: 'Two personal AI agents (Chipo & Nyasha) autonomously negotiating an emergency slot swap within pre-signed mandates ($20 ceiling, agreed $12 fee) and dual human consent.',
    tag: 'Agentic Commerce · Showpiece',
  },
  {
    title: '3. The Guardian: Deterministic Policy Engine',
    filename: 'kitty-3-policy-engine-guardian.png',
    description: 'Code-level enforcement of 7 strict rules intercepting an adversarial prompt injection attempt ($500 rogue transfer halted before reaching PayPal).',
    tag: 'Policy Guardrails · Security',
  },
  {
    title: '4. Direct Non-Custodial PayPal Checkout & Webhook',
    filename: 'kitty-4-paypal-checkout-settlement.png',
    description: 'PayPal Orders v2 peer payee routing ($100 USD contribution directly to recipient), idempotency key, and live webhook verification pipeline.',
    tag: 'PayPal Orders v2 · Settlement',
  },
];

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Devpost Project Media Gallery</span>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                  3:2 Ratio · 1200x800 PNG
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Pixel-perfect project images formatted specifically for the Devpost Image Gallery (under 200 KB each).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded-xl text-xs text-blue-200 flex items-center justify-between">
            <span>
              Click <strong>"Download PNG"</strong> on any card to save it for your Devpost submission.
            </span>
            <span className="font-mono text-[11px] text-blue-400">4 / 4 Generated</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {GALLERY_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col shadow-lg group hover:border-slate-700 transition"
              >
                {/* Image Preview Container */}
                <div className="relative aspect-[3/2] bg-slate-900 overflow-hidden border-b border-slate-800/80">
                  <img
                    src={`/gallery/${item.filename}`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-slate-950/80 backdrop-blur-sm text-emerald-400 border border-emerald-500/30">
                      {item.tag}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">1200 × 800 px</span>
                    <a
                      href={`/gallery/${item.filename}`}
                      download={item.filename}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PNG</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Complies with Devpost specifications: PNG format, 3:2 ratio, &lt; 5 MB.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition cursor-pointer"
          >
            Close Gallery
          </button>
        </div>
      </div>
    </div>
  );
};
