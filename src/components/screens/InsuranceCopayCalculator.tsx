import React, { useState } from 'react';
import { ScreenType } from '../../types';

interface InsuranceCopayCalculatorProps {
  onNavigate: (screen: ScreenType) => void;
}

export const InsuranceCopayCalculator: React.FC<InsuranceCopayCalculatorProps> = ({ onNavigate }) => {
  const [annualDeductible, setAnnualDeductible] = useState<number>(2500);
  const [spentYTD, setSpentYTD] = useState<number>(650);
  const [drugRetailCost, setDrugRetailCost] = useState<number>(124.50);
  const [discountCashPrice, setDiscountCashPrice] = useState<number>(8.40);
  const [formularyTierCopay, setFormularyTierCopay] = useState<number>(10);
  const [willHitDeductibleLaterThisYear, setWillHitDeductibleLaterThisYear] = useState<boolean>(false);

  const remainingDeductible = Math.max(0, annualDeductible - spentYTD);
  const isDeductibleMet = remainingDeductible <= 0;

  // If deductible is not met: insurance charges full negotiated retail (e.g. $95) until deductible is met!
  // If deductible is met: insurance charges tier copay ($10).
  const insuranceImmediateCost = isDeductibleMet ? formularyTierCopay : Math.min(remainingDeductible, drugRetailCost * 0.85);

  const cashSavingsRightNow = insuranceImmediateCost - discountCashPrice;
  const recommendCash = !willHitDeductibleLaterThisYear && cashSavingsRightNow > 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 md:p-8 space-y-2 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
          <span className="material-symbols-outlined text-[16px]">calculate</span>
          <span>Deductible vs Direct Cash Cost Modeler</span>
        </div>
        <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-on-surface tracking-tight">
          Insurance Copay vs. Cash Pass Decision Engine
        </h1>
        <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl">
          High-deductible health plans often force you to pay 100% of retail drug costs until your deductible is met. Calculate whether using a discount cash pass or filing an insurance claim saves you more.
        </p>
      </div>

      {/* Interactive Controls & Modeler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-5 shadow-xs">
          <h2 className="font-headline font-bold text-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">tune</span>
            Your Health Plan Parameters
          </h2>

          <div className="space-y-4 text-xs">
            {/* Annual Deductible */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-on-surface">
                <span>Annual Prescription / Medical Deductible</span>
                <span className="font-mono text-secondary">${annualDeductible}</span>
              </div>
              <input
                type="range"
                min="0"
                max="6000"
                step="250"
                value={annualDeductible}
                onChange={(e) => setAnnualDeductible(Number(e.target.value))}
                className="w-full accent-secondary"
              />
              <span className="text-[10px] text-on-surface-variant">Standard HDHP is $1,600 to $3,200</span>
            </div>

            {/* Spent Year to Date */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-on-surface">
                <span>Amount Spent Year-to-Date (YTD)</span>
                <span className="font-mono text-secondary">${spentYTD}</span>
              </div>
              <input
                type="range"
                min="0"
                max={annualDeductible}
                step="50"
                value={spentYTD}
                onChange={(e) => setSpentYTD(Number(e.target.value))}
                className="w-full accent-secondary"
              />
              <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                <span>Remaining to meet: <strong>${remainingDeductible}</strong></span>
                <span>{((spentYTD / (annualDeductible || 1)) * 100).toFixed(0)}% met</span>
              </div>
            </div>

            {/* Drug parameters */}
            <div className="pt-2 border-t border-outline-variant/15 space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-on-surface block">Medication Being Evaluated</label>
                <input
                  type="text"
                  defaultValue="Atorvastatin Calcium 20mg (90-day)"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-on-surface block">Discount Cash Pass</label>
                  <input
                    type="number"
                    value={discountCashPrice}
                    onChange={(e) => setDiscountCashPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-on-surface block">Post-Deductible Copay</label>
                  <input
                    type="number"
                    value={formularyTierCopay}
                    onChange={(e) => setFormularyTierCopay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                  />
                </div>
              </div>

              {/* Will hit deductible toggle */}
              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={willHitDeductibleLaterThisYear}
                  onChange={(e) => setWillHitDeductibleLaterThisYear(e.target.checked)}
                  className="w-4 h-4 accent-secondary rounded"
                />
                <span className="text-xs text-on-surface font-medium">
                  I expect major medical procedures/surgeries later this year
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Comparison Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Recommendation Banner */}
          <div
            className={`rounded-2xl p-5 border text-xs shadow-xs ${
              recommendCash
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-blue-50 border-blue-300 text-blue-950'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-2xl text-secondary">
                {recommendCash ? 'recommend' : 'policy'}
              </span>
              <div>
                <h3 className="font-headline font-bold text-sm">
                  {recommendCash
                    ? 'Recommendation: Pay Direct with Discount Pass'
                    : 'Recommendation: File Through Commercial Insurance'}
                </h3>
                <p className="mt-1 leading-relaxed">
                  {recommendCash
                    ? `You save $${cashSavingsRightNow.toFixed(2)} immediately today. Because your deductible has $${remainingDeductible} remaining and you are unlikely to hit the ceiling, applying high retail prices towards your deductible wastes cash.`
                    : `Since you anticipate exceeding your $${annualDeductible} deductible this year, paying through insurance will count toward your deductible threshold, unlocking $0 copays sooner.`}
                </p>
              </div>
            </div>
          </div>

          {/* Side-by-Side Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option A: Cash Pass */}
            <div className="bg-surface-container-lowest rounded-2xl border border-secondary/50 p-5 space-y-3 shadow-xs relative overflow-hidden">
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-secondary text-white font-mono text-[9px] font-bold">
                RECOMMENDED
              </div>
              <span className="text-xs font-mono uppercase text-secondary font-bold block">Option A</span>
              <h4 className="font-headline font-bold text-base text-on-surface">PharmaCompare Cash Pass</h4>

              <div className="py-2 border-y border-outline-variant/15">
                <div className="text-3xl font-headline font-black text-secondary">
                  ${discountCashPrice.toFixed(2)}
                </div>
                <span className="text-[11px] text-on-surface-variant font-mono">You pay today at counter</span>
              </div>

              <ul className="text-xs text-on-surface-variant space-y-1.5 list-disc list-inside">
                <li>Immediate guaranteed price</li>
                <li>No prior authorization delays</li>
                <li>HSA/FSA debit card eligible</li>
                <li>Does NOT apply to plan deductible</li>
              </ul>

              <button
                onClick={() => onNavigate('discount-card')}
                className="w-full py-2 rounded-lg bg-secondary text-white font-headline font-semibold text-xs hover:bg-secondary/90 transition-colors"
              >
                Generate Cash Pass
              </button>
            </div>

            {/* Option B: Insurance */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 space-y-3 shadow-xs">
              <span className="text-xs font-mono uppercase text-on-surface-variant font-bold block">Option B</span>
              <h4 className="font-headline font-bold text-base text-on-surface">Standard Insurance Claim</h4>

              <div className="py-2 border-y border-outline-variant/15">
                <div className="text-3xl font-headline font-bold text-on-surface">
                  ${insuranceImmediateCost.toFixed(2)}
                </div>
                <span className="text-[11px] text-on-surface-variant font-mono">
                  {isDeductibleMet ? 'Tier 1 copay (deductible met)' : 'Subject to unmet deductible'}
                </span>
              </div>

              <ul className="text-xs text-on-surface-variant space-y-1.5 list-disc list-inside">
                <li>Counts toward your annual deductible</li>
                <li>Subject to PBM formulary restrictions</li>
                <li>Requires clinical step therapy</li>
              </ul>

              <button
                onClick={() => onNavigate('patient-wallet')}
                className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs border border-outline-variant/30 transition-colors"
              >
                View Stored Insurance Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
