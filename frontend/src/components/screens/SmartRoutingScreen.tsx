import React, { useState } from 'react';
import { ScreenType } from '../../types';
import { MOCK_ROUTING_PLANS } from '../../data/mockData';

interface SmartRoutingScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const SmartRoutingScreen: React.FC<SmartRoutingScreenProps> = ({ onNavigate }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-hybrid');
  const [isRoutingApproved, setIsRoutingApproved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentPlan = MOCK_ROUTING_PLANS.find((p) => p.id === selectedPlanId) || MOCK_ROUTING_PLANS[0];

  const handleExecuteRouting = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsRoutingApproved(true);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Engine Banner */}
      <div className="bg-gradient-to-r from-primary-container via-surface-container-highest to-surface-container-high rounded-2xl p-6 md:p-8 text-white border border-outline-variant/30 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[140px]">alt_route</span>
        </div>

        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-white text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            <span>Patent-Pending Prescription Split-Fulfillment Engine</span>
          </div>

          <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            Algorithmic Rx Routing & Cart Splitter
          </h1>

          <p className="text-sm text-inverse-on-surface/80">
            Why pay $271 at a single counter? Our routing engine decouples your active prescriptions across mail-order wholesale hubs and local retail discount desks to minimize out-of-pocket costs while respecting state controlled-substance laws.
          </p>

          <div className="flex items-center gap-6 pt-2 font-mono text-xs">
            <div>
              <span className="text-inverse-on-surface/60 block">Monthly Baseline</span>
              <span className="text-xl font-bold line-through text-outline">$271.00</span>
            </div>
            <div>
              <span className="text-secondary-fixed block">Optimized Cost</span>
              <span className="text-2xl font-bold text-secondary-fixed">${currentPlan.totalMonthlyCost.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-emerald-400 block">Annual Savings</span>
              <span className="text-2xl font-bold text-emerald-400">
                ${(currentPlan.totalSavings * 12).toFixed(0)}/yr
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Strategy Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_ROUTING_PLANS.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all ${
                isSelected
                  ? 'bg-surface-container-lowest border-secondary ring-2 ring-secondary/40 shadow-sm'
                  : 'bg-surface-container-low border-outline-variant/30 hover:border-secondary/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-bold text-base text-on-surface">{plan.strategyName}</h3>
                    {plan.recommendedBadge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-secondary text-white">
                        AI Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {plan.routes.length} distinct fulfillment destination{plan.routes.length > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-headline font-extrabold text-2xl text-secondary">
                    ${plan.totalMonthlyCost.toFixed(2)}
                  </span>
                  <span className="text-xs text-on-surface-variant block">/month</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold font-mono">
                  Saves ${plan.totalSavings.toFixed(2)}/mo ({plan.savingsPercentage}%)
                </span>
                <span className="text-secondary font-semibold flex items-center gap-1">
                  {isSelected ? 'Active Plan' : 'Select Plan'}
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Route Breakdown Diagram */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 md:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <div>
            <h2 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">schema</span>
              Routing Plan Architecture
            </h2>
            <p className="text-xs text-on-surface-variant">
              Prescription split paths calculated based on formulary pricing, distance, and regulatory classification
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Opt-Route Algorithm V3.2 Active</span>
          </div>
        </div>

        {/* Dynamic Route Nodes */}
        <div className="space-y-4">
          {currentPlan.routes.map((route, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-outline-variant/30 p-5 bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  {idx + 1}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-headline font-bold text-base text-on-surface">{route.drugName}</h4>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-container-high text-on-surface">
                      {route.dosage}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant">
                    Routed to: <strong className="text-on-surface">{route.recommendedPharmacy}</strong>
                  </p>

                  <div className="flex items-center gap-3 text-xs text-on-surface-variant pt-1 flex-wrap font-mono">
                    <span className="flex items-center gap-1 text-secondary font-medium">
                      <span className="material-symbols-outlined text-[15px]">local_shipping</span>
                      {route.fulfillmentMethod}
                    </span>
                    <span>•</span>
                    <span className="text-on-surface font-sans">{route.leadTime}</span>
                  </div>

                  <p className="text-[11px] text-on-surface-variant/80 italic pt-0.5">
                    Optimization note: {route.reason}
                  </p>
                </div>
              </div>

              {/* Price & Savings pill */}
              <div className="text-right md:w-44 shrink-0">
                <div className="font-headline font-extrabold text-xl text-secondary">
                  ${route.monthlyCost.toFixed(2)}
                </div>
                <span className="text-xs text-emerald-700 font-mono font-semibold block">
                  Save ${route.savingsVsRetail.toFixed(2)}
                </span>
                <span className="text-[10px] text-on-surface-variant block mt-0.5 font-mono">vs retail $124.50</span>
              </div>
            </div>
          ))}
        </div>

        {/* Execution Actions */}
        <div className="pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
            <span>Automatic transfer requests will be sent to pharmacists upon confirmation</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isRoutingApproved ? (
              <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-100 text-emerald-800 font-headline font-bold text-sm w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined">task_alt</span>
                <span>Fulfillment Orders Dispatched Successfully!</span>
              </div>
            ) : (
              <button
                onClick={handleExecuteRouting}
                disabled={isProcessing}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-secondary text-white font-headline font-bold text-sm hover:bg-secondary/90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    <span>Dispatching NCPDP Electronic Handoff...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">send</span>
                    <span>Approve & Dispatch Split Fulfillment (${currentPlan.totalMonthlyCost.toFixed(2)}/mo)</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => onNavigate('delivery-tracking')}
              className="px-4 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs border border-outline-variant/30 transition-colors"
            >
              Track Deliveries
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
