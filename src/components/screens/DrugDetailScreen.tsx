import React, { useState } from 'react';
import { DrugItem, PharmacyQuote, ScreenType } from '../../types';

interface DrugDetailScreenProps {
  drug: DrugItem;
  onNavigate: (screen: ScreenType) => void;
  onSelectPharmacyForCoupon: (pharmacy: PharmacyQuote) => void;
  onSelectPharmacyForTransfer: (pharmacy: PharmacyQuote) => void;
}

export const DrugDetailScreen: React.FC<DrugDetailScreenProps> = ({
  drug,
  onNavigate,
  onSelectPharmacyForCoupon,
  onSelectPharmacyForTransfer
}) => {
  const [selectedStrength, setSelectedStrength] = useState<string>(drug.selectedStrength || drug.strengths[0]);
  const [selectedForm, setSelectedForm] = useState<string>(drug.selectedForm || drug.dosageForms[0]);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(drug.selectedQuantity || drug.quantities[0]);

  // Dynamic price adjustment based on quantity (e.g. 90-day supplies offer bulk discounts)
  const qtyMultiplier = selectedQuantity === 90 ? 2.2 : selectedQuantity === 60 ? 1.7 : 1.0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('catalog')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to All Medications</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('interaction-checker')}
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant/30 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px] text-amber-600">warning</span>
            <span>Check Drug Interactions</span>
          </button>
          <button
            onClick={() => onNavigate('price-alerts')}
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant/30 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">notifications_active</span>
            <span>Set Price Alert</span>
          </button>
        </div>
      </div>

      {/* Medication Header Card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-outline-variant/20">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-surface-container overflow-hidden border border-outline-variant/30 shrink-0">
              <img
                src={drug.imageUrl}
                alt={drug.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-headline font-bold text-2xl md:text-3xl text-on-surface">
                  {drug.name}
                </h1>
                {drug.isGenericAvailable ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary-container text-on-secondary-container">
                    Generic Equivalent
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container-high text-on-surface-variant">
                    Brand Name Only
                  </span>
                )}
                {drug.controlledSubstance && (
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500 text-white">
                    DEA Schedule II
                  </span>
                )}
              </div>

              <p className="text-sm text-on-surface-variant mt-1">
                Commonly prescribed as <strong className="text-on-surface">{drug.brandName}</strong> • {drug.drugClass}
              </p>

              <div className="flex items-center gap-4 mt-2 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                  FDA Approved
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">local_shipping</span>
                  Eligible for Mail Delivery & Local Pickup
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 text-right shrink-0">
            <span className="text-[11px] font-mono uppercase text-on-surface-variant font-semibold">
              Lowest Cash Option
            </span>
            <div className="text-2xl md:text-3xl font-headline font-black text-secondary">
              ${(drug.lowestPrice * (qtyMultiplier === 1 ? 1 : qtyMultiplier * 0.9)).toFixed(2)}
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              Save up to {drug.typicalSavingsPercent}% off retail
            </p>
          </div>
        </div>

        {/* Dose Configurator Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Strength selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase font-bold text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">tune</span>
              Dosage Strength
            </label>
            <div className="flex flex-wrap gap-2">
              {drug.strengths.map((str) => (
                <button
                  key={str}
                  onClick={() => setSelectedStrength(str)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    selectedStrength === str
                      ? 'bg-secondary text-white shadow-xs'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/20'
                  }`}
                >
                  {str}
                </button>
              ))}
            </div>
          </div>

          {/* Form selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase font-bold text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">category</span>
              Dosage Form
            </label>
            <div className="flex flex-wrap gap-2">
              {drug.dosageForms.map((form) => (
                <button
                  key={form}
                  onClick={() => setSelectedForm(form)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    selectedForm === form
                      ? 'bg-secondary text-white shadow-xs'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/20'
                  }`}
                >
                  {form}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase font-bold text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">inventory_2</span>
              Quantity (Days Supply)
            </label>
            <div className="flex flex-wrap gap-2">
              {drug.quantities.map((qty) => (
                <button
                  key={qty}
                  onClick={() => setSelectedQuantity(qty)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedQuantity === qty
                      ? 'bg-secondary text-white shadow-xs'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/20'
                  }`}
                >
                  <span>{qty} count</span>
                  {qty === 90 && (
                    <span className="px-1 rounded bg-secondary-container text-on-secondary-container text-[9px] font-bold">
                      Best Value
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pharmacy Pricing Comparison Matrix */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-surface-container-low">
          <div>
            <h2 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">store</span>
              Pharmacy Pricing & Availability Comparison
            </h2>
            <p className="text-xs text-on-surface-variant">
              Showing real-time verified pricing for {selectedStrength}, {selectedQuantity} count in San Francisco (94103)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-secondary font-semibold">● Live NCPDP Feeds Active</span>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 text-[11px] font-mono uppercase tracking-wider text-on-surface-variant bg-surface">
                <th className="py-3 px-6">Pharmacy</th>
                <th className="py-3 px-4">Fulfillment</th>
                <th className="py-3 px-4">Retail Price</th>
                <th className="py-3 px-4">Discount Pass Price</th>
                <th className="py-3 px-4">Est. Ins. Copay</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-xs">
              {drug.quotes.map((quote) => {
                const calculatedDiscountPrice = quote.discountPrice * qtyMultiplier;
                const calculatedRetailPrice = quote.cashPrice * qtyMultiplier;
                const savings = calculatedRetailPrice - calculatedDiscountPrice;

                return (
                  <tr
                    key={quote.pharmacyId}
                    className={`hover:bg-surface-container-low transition-colors ${
                      quote.bestValue ? 'bg-secondary-container/10' : ''
                    }`}
                  >
                    {/* Pharmacy Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center font-bold text-sm shrink-0">
                          <span className="material-symbols-outlined text-[20px]">
                            {quote.chainType === 'mail-order'
                              ? 'markunread_mailbox'
                              : quote.chainType === 'courier'
                              ? 'electric_moped'
                              : 'storefront'}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-headline font-bold text-sm text-on-surface">
                              {quote.pharmacyName}
                            </span>
                            {quote.bestValue && (
                              <span className="px-1.5 py-0.2 rounded bg-secondary text-white font-mono text-[9px] font-bold">
                                Lowest Price
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-on-surface-variant mt-0.5">{quote.address}</p>
                          <span className="text-[10px] text-secondary font-medium">{quote.distance}</span>
                        </div>
                      </div>
                    </td>

                    {/* Stock status */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          quote.stockStatus === 'Ready in 15 min'
                            ? 'bg-emerald-100 text-emerald-800'
                            : quote.stockStatus === 'Free 2-Day Mail'
                            ? 'bg-blue-100 text-blue-800'
                            : quote.stockStatus === 'In Stock'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {quote.stockStatus === 'Ready in 15 min' ? 'schedule' : 'inventory'}
                        </span>
                        {quote.stockStatus}
                      </span>
                    </td>

                    {/* Retail cash price */}
                    <td className="py-4 px-4 text-outline font-mono line-through">
                      ${calculatedRetailPrice.toFixed(2)}
                    </td>

                    {/* Discount pass price */}
                    <td className="py-4 px-4">
                      <div className="flex items-baseline gap-1">
                        <span className="font-headline font-extrabold text-base text-secondary">
                          ${calculatedDiscountPrice.toFixed(2)}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-semibold font-mono">
                        Save ${savings.toFixed(2)}
                      </span>
                    </td>

                    {/* Estimated Insurance Copay */}
                    <td className="py-4 px-4 text-on-surface-variant font-mono">
                      ${quote.insuranceEstimatedCopay.toFixed(2)}
                      <p className="text-[10px] text-outline font-sans">Tier 1 Copay</p>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            onSelectPharmacyForCoupon(quote);
                            onNavigate('discount-card');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-secondary text-white font-headline font-semibold text-xs hover:bg-secondary/90 transition-colors shadow-xs"
                        >
                          Use Free Coupon
                        </button>
                        <button
                          onClick={() => {
                            onSelectPharmacyForTransfer(quote);
                            onNavigate('transfer-concierge');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium border border-outline-variant/30 transition-colors"
                          title="Transfer prescription to this pharmacy"
                        >
                          Transfer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Reference & Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-3">
          <div className="flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-secondary">info</span>
            <h3 className="font-headline font-bold text-sm">Clinical Pharmacist Summary</h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {drug.description} Always take consistently at the same time each day. For extended-release formulations, do not crush or chew. Ingest with an adequate volume of water with or without meals unless otherwise directed by your prescriber.
          </p>
          <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">Need an urgent refill?</span>
            <button
              onClick={() => onNavigate('teleconsult')}
              className="text-secondary font-semibold hover:underline flex items-center gap-1"
            >
              Consult a licensed doctor now
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-3">
          <div className="flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-amber-600">health_and_safety</span>
            <h3 className="font-headline font-bold text-sm">Key Precautions & Adverse Effects</h3>
          </div>
          <ul className="text-xs text-on-surface-variant space-y-2 list-disc list-inside">
            <li>Report unexplained muscle pain, tenderness, or weakness promptly to your physician.</li>
            <li>Periodic liver function tests and lipid panels may be indicated during therapy.</li>
            <li>Store at controlled room temperature 20°C to 25°C (68°F to 77°F); protect from moisture.</li>
          </ul>
          <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">Check polypharmacy safety:</span>
            <button
              onClick={() => onNavigate('interaction-checker')}
              className="text-amber-700 font-semibold hover:underline"
            >
              Run Clinical Interaction Check
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
