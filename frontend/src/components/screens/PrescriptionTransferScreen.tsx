import React, { useState } from 'react';
import { PharmacyQuote, ScreenType, TransferRequest } from '../../types';
import { MOCK_TRANSFERS } from '../../data/mockData';

interface PrescriptionTransferScreenProps {
  targetPharmacy?: PharmacyQuote;
  onNavigate: (screen: ScreenType) => void;
}

export const PrescriptionTransferScreen: React.FC<PrescriptionTransferScreenProps> = ({
  targetPharmacy,
  onNavigate
}) => {
  const [transfers, setTransfers] = useState<TransferRequest[]>(MOCK_TRANSFERS);
  const [rxNumber, setRxNumber] = useState('RX-992014-C');
  const [drugName, setDrugName] = useState('Atorvastatin 20mg (90-day)');
  const [sourcePharmacy, setSourcePharmacy] = useState('Walgreens Pharmacy #883 (Mission St)');
  const [destPharmacy, setDestPharmacy] = useState(
    targetPharmacy ? targetPharmacy.pharmacyName : 'Mark Cuban Cost Plus Drug Co.'
  );
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmitTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: TransferRequest = {
      id: `TR-${Math.floor(10000 + Math.random() * 90000)}`,
      patientName: 'Sarah Jenkins',
      rxNumber,
      drugName,
      dosage: 'Standard oral regimen',
      sourcePharmacy,
      destinationPharmacy: destPharmacy,
      status: 'submitted',
      dateSubmitted: 'Just now',
      estimatedCompletion: 'Today within 2-4 hours'
    };
    setTransfers([newReq, ...transfers]);
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 5000);
  };

  const getStatusStep = (status: TransferRequest['status']) => {
    switch (status) {
      case 'submitted': return 1;
      case 'pharmacist_review': return 2;
      case 'transferring': return 3;
      case 'ready_for_pickup': return 4;
      case 'completed': return 5;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Banner */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">sync_alt</span>
            <span>Zero-Paperwork Automated Transfer</span>
          </div>
          <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-on-surface tracking-tight">
            Prescription Transfer Concierge
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant max-w-xl">
            Switch your existing prescription from an expensive pharmacy to any discounted network partner. Our automated clearinghouse contacts your previous pharmacy directly.
          </p>
        </div>

        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 text-xs font-mono shrink-0 space-y-1">
          <div className="flex items-center gap-2 text-secondary font-bold">
            <span className="material-symbols-outlined text-base">verified</span>
            <span>State Board Pharmacy Rule 1717 Compliant</span>
          </div>
          <p className="text-on-surface-variant">Transfers processed in an average of 42 minutes</p>
        </div>
      </div>

      {/* Main Grid: Form + Active Transfers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-5 shadow-xs">
          <div>
            <h2 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">add_circle</span>
              Initiate New Script Transfer
            </h2>
            <p className="text-xs text-on-surface-variant">
              Enter your current prescription details and choose your new target pharmacy.
            </p>
          </div>

          {submittedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
              <span className="material-symbols-outlined">check_circle</span>
              <span>Transfer request submitted! Pharmacist dispatching now.</span>
            </div>
          )}

          <form onSubmit={handleSubmitTransfer} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-on-surface block">Medication & Dosage</label>
              <input
                type="text"
                value={drugName}
                onChange={(e) => setDrugName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-on-surface block">Current Rx Number (on bottle label)</label>
              <input
                type="text"
                value={rxNumber}
                onChange={(e) => setRxNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 font-mono text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-on-surface block">Current Pharmacy to Transfer FROM</label>
              <input
                type="text"
                value={sourcePharmacy}
                onChange={(e) => setSourcePharmacy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-on-surface block">New Destination Pharmacy to Transfer TO</label>
              <input
                type="text"
                value={destPharmacy}
                onChange={(e) => setDestPharmacy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                required
              />
            </div>

            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 text-[11px] text-on-surface-variant flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-secondary shrink-0 mt-0.5">lock</span>
              <span>
                By submitting, you authorize PharmaCompare to request your prescription profile on your behalf pursuant to HIPAA 45 CFR § 164.506.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-secondary text-white font-headline font-semibold text-xs tracking-wide hover:bg-secondary/90 transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Submit Transfer Request</span>
            </button>
          </form>
        </div>

        {/* Status Pipeline Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">pending_actions</span>
              Active Prescription Transfers ({transfers.length})
            </h2>
            <span className="text-xs text-on-surface-variant font-mono">Live WebSocket Updates</span>
          </div>

          <div className="space-y-4">
            {transfers.map((req) => {
              const currentStep = getStatusStep(req.status);
              return (
                <div
                  key={req.id}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 space-y-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-headline font-bold text-base text-on-surface">{req.drugName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-surface-container-high text-on-surface">
                          {req.rxNumber}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Moving from <strong className="text-on-surface">{req.sourcePharmacy}</strong> →{' '}
                        <strong className="text-secondary">{req.destinationPharmacy}</strong>
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                        req.status === 'ready_for_pickup'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'transferring'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status === 'ready_for_pickup'
                        ? 'Ready for Pickup'
                        : req.status === 'transferring'
                        ? 'Transfer in Progress'
                        : 'Reviewing Request'}
                    </span>
                  </div>

                  {/* 4-Step Visual Progress Bar */}
                  <div className="pt-2">
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono font-semibold">
                      <div className={currentStep >= 1 ? 'text-secondary' : 'text-outline'}>
                        1. Submitted
                      </div>
                      <div className={currentStep >= 2 ? 'text-secondary' : 'text-outline'}>
                        2. Verified
                      </div>
                      <div className={currentStep >= 3 ? 'text-secondary' : 'text-outline'}>
                        3. Transferring
                      </div>
                      <div className={currentStep >= 4 ? 'text-emerald-700 font-bold' : 'text-outline'}>
                        4. Ready
                      </div>
                    </div>

                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden mt-1.5 flex">
                      <div
                        className="h-full bg-secondary rounded-full transition-all duration-500"
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between text-xs text-on-surface-variant">
                    <span>Est: <strong className="text-on-surface">{req.estimatedCompletion}</strong></span>
                    <button
                      onClick={() => onNavigate('discount-card')}
                      className="text-secondary font-semibold hover:underline flex items-center gap-1"
                    >
                      View Pickup Card
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
