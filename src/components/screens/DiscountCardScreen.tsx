import React, { useState } from 'react';
import { DrugItem, PharmacyQuote, ScreenType } from '../../types';

interface DiscountCardScreenProps {
  drug: DrugItem;
  pharmacyQuote?: PharmacyQuote;
  onNavigate: (screen: ScreenType) => void;
}

export const DiscountCardScreen: React.FC<DiscountCardScreenProps> = ({
  drug,
  pharmacyQuote,
  onNavigate
}) => {
  const [copied, setCopied] = useState(false);
  const [textSent, setTextSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('(415) 555-0192');

  const quote = pharmacyQuote || drug.quotes[0];
  const bin = quote.bin || '015995';
  const pcn = quote.pcn || 'GDC';
  const group = quote.group || 'PRX902';
  const memberId = 'PHARM-849204-01';

  const handleCopyCard = () => {
    navigator.clipboard?.writeText(
      `PharmaCompare Rx Pass\nBIN: ${bin}\nPCN: ${pcn}\nGroup: ${group}\nMember ID: ${memberId}\nMedication: ${drug.name}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    setTextSent(true);
    setTimeout(() => setTextSent(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('drug-detail')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Medication Details</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('transfer-concierge')}
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant/30"
          >
            Transfer Rx
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant/30 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Pass</span>
          </button>
        </div>
      </div>

      {/* Main Digital Coupon Card Pass */}
      <div className="bg-gradient-to-br from-[#0c1a2e] via-[#132238] to-[#0a1526] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Subtle background graphics */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center font-bold shadow-md">
              <span className="material-symbols-outlined text-2xl">local_pharmacy</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                  PharmaCompare <span className="text-secondary-fixed">Rx Pass</span>
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500 text-white">
                  Active & Verified
                </span>
              </div>
              <p className="text-xs text-white/70">National Prescription Savings Network • Accepted at 68,000+ Pharmacies</p>
            </div>
          </div>

          <div className="text-left sm:text-right bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-mono text-white/60 block">Designated Pharmacy</span>
            <span className="text-sm font-bold text-white">{quote.pharmacyName}</span>
            <span className="text-xs text-secondary-fixed block">{quote.distance}</span>
          </div>
        </div>

        {/* Prescription Highlight */}
        <div className="py-6 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-secondary-fixed uppercase tracking-wider font-semibold">
              Authorized Medication
            </span>
            <div className="text-2xl font-headline font-bold text-white mt-0.5">
              {drug.name} <span className="text-white/60 text-lg font-normal">({drug.selectedStrength || '20 mg'})</span>
            </div>
            <p className="text-xs text-white/70 mt-1">
              Quantity: {drug.selectedQuantity || 30} {drug.selectedForm || 'Tablets'} • Patient: <strong className="text-white">Sarah Jenkins</strong>
            </p>
          </div>

          <div className="bg-white/10 px-5 py-3 rounded-2xl text-right shrink-0 border border-white/15">
            <span className="text-[10px] uppercase font-mono text-white/70 block">You Pay At Counter</span>
            <div className="text-3xl font-headline font-black text-secondary-fixed">
              ${quote.discountPrice.toFixed(2)}
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
              Save ${(quote.cashPrice - quote.discountPrice).toFixed(2)} off retail
            </span>
          </div>
        </div>

        {/* Claims Processing Data Grid (BIN / PCN / Group / ID) */}
        <div className="py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/10">
            <span className="text-[10px] font-mono text-white/60 uppercase block">RxBIN</span>
            <span className="text-lg font-mono font-bold text-white tracking-wider">{bin}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/10">
            <span className="text-[10px] font-mono text-white/60 uppercase block">RxPCN</span>
            <span className="text-lg font-mono font-bold text-white tracking-wider">{pcn}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/10">
            <span className="text-[10px] font-mono text-white/60 uppercase block">RxGroup</span>
            <span className="text-lg font-mono font-bold text-white tracking-wider">{group}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/10">
            <span className="text-[10px] font-mono text-white/60 uppercase block">Member ID</span>
            <span className="text-lg font-mono font-bold text-white tracking-wider">{memberId}</span>
          </div>
        </div>

        {/* Simulated Barcode & Pharmacist Instructions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/5 rounded-2xl p-5 border border-white/10">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="material-symbols-outlined text-secondary-fixed text-lg">contactless</span>
              <h3 className="font-headline font-bold text-sm text-white">Show to Pharmacist at Counter</h3>
            </div>
            <p className="text-xs text-white/70 max-w-md">
              Pharmacist: Process as secondary payer or primary cash card through NCPDP clearinghouse. No prior authorization or insurance required.
            </p>
          </div>

          {/* Barcode Graphic */}
          <div className="bg-white px-5 py-3 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-md">
            {/* SVG barcode bars */}
            <div className="flex items-center gap-[2px] h-10">
              {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 3, 1, 2, 3, 1, 4, 2, 1, 3].map((w, i) => (
                <div
                  key={i}
                  className="bg-black h-full"
                  style={{ width: `${w * 1.5}px` }}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono font-bold text-black tracking-widest mt-1">
              *01599584920401*
            </span>
          </div>
        </div>
      </div>

      {/* Sharing & Delivery Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SMS / Text Pass to Phone */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">sms</span>
            <h3 className="font-headline font-bold text-sm text-on-surface">Text Card to Mobile</h3>
          </div>
          <p className="text-xs text-on-surface-variant">
            Send an instant digital pass directly to your smartphone to present at pickup.
          </p>

          <form onSubmit={handleSendText} className="flex items-center gap-2 pt-1">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 text-xs font-mono text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-secondary text-white font-headline font-semibold text-xs hover:bg-secondary/90 transition-colors shrink-0"
            >
              {textSent ? 'Sent to Phone!' : 'Send SMS'}
            </button>
          </form>
        </div>

        {/* Copy Claims Info */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">content_copy</span>
            <h3 className="font-headline font-bold text-sm text-on-surface">Copy Claims Numbers</h3>
          </div>
          <p className="text-xs text-on-surface-variant">
            Copy all NCPDP billing numbers to your clipboard to paste into pharmacy drive-thru apps.
          </p>
          <div className="pt-1">
            <button
              onClick={handleCopyCard}
              className="w-full py-2 px-4 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs border border-outline-variant/30 transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'done' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied Billing Info to Clipboard!' : 'Copy BIN, PCN & Group'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
