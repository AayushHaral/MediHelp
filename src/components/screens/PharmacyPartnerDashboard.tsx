import React, { useState } from 'react';
import { ScreenType } from '../../types';
import { generateFhirPrescriptionBundle, validateFhirMedicationRequest, FhirBundle } from '../../services/fhirService';
import { getPartnerInventory, syncPartnerInventory, getB2bClaims, adjudicateB2bClaim, PharmacyPartnerStock, CouponClaimSettlement } from '../../services/partnerInventoryService';
import { getPopulationHealthMetrics, getPatientAdherenceRiskProfiles, PopulationHealthMetrics, PatientAdherenceRiskProfile } from '../../services/enterpriseAnalyticsService';
import { FileJson, CheckCircle2, AlertTriangle, RefreshCw, Layers, Server, Activity, ShieldCheck, Download, Award, ArrowUpRight, DollarSign } from 'lucide-react';

interface PharmacyPartnerDashboardProps {
  onNavigate: (screen: ScreenType) => void;
}

export const PharmacyPartnerDashboard: React.FC<PharmacyPartnerDashboardProps> = ({ onNavigate }) => {
  const [selectedTenant, setSelectedTenant] = useState('HealthFirst Regional Network (48 Stores)');
  const [dispensedOrders, setDispensedOrders] = useState<string[]>([]);

  // Phase 5 State
  const [activeTab, setActiveTab] = useState<'queue' | 'fhir' | 'inventory' | 'claims' | 'analytics'>('queue');
  const [stocks, setStocks] = useState<PharmacyPartnerStock[]>(getPartnerInventory());
  const [claims, setClaims] = useState<CouponClaimSettlement[]>(getB2bClaims());
  const [popMetrics] = useState<PopulationHealthMetrics>(getPopulationHealthMetrics());
  const [riskProfiles] = useState<PatientAdherenceRiskProfile[]>(getPatientAdherenceRiskProfiles());

  // FHIR Export Modal State
  const [isFhirModalOpen, setIsFhirModalOpen] = useState<boolean>(false);
  const [selectedOrderForFhir, setSelectedOrderForFhir] = useState<any | null>(null);
  const [generatedFhirBundle, setGeneratedFhirBundle] = useState<FhirBundle | null>(null);
  const [fhirCopied, setFhirCopied] = useState<boolean>(false);
  const [isSyncingStock, setIsSyncingStock] = useState<boolean>(false);
  const [claimAdjudicatedMsg, setClaimAdjudicatedMsg] = useState<string | null>(null);

  const orders = [
    {
      id: 'RX-774921',
      patientId: 'pat-99182',
      patient: 'Robert Alvarez',
      drug: 'Atorvastatin Calcium 20mg #90',
      rxNormCode: '310965',
      wacCost: '$4.20',
      reimbursement: '$18.40',
      margin: '+$14.20 (77%)',
      time: '3 min ago',
      payer: 'Direct Cash Pass',
      priority: 'Normal'
    },
    {
      id: 'RX-774922',
      patientId: 'pat-99183',
      patient: 'Sarah Jenkins',
      drug: 'Adderall XR 20mg #30 (C-II)',
      rxNormCode: '202688',
      wacCost: '$16.80',
      reimbursement: '$28.50',
      margin: '+$11.70 (41%)',
      time: '8 min ago',
      payer: 'Digital Coupon COB',
      priority: 'Urgent Counter Pickup'
    },
    {
      id: 'RX-774923',
      patientId: 'pat-99184',
      patient: 'David Miller',
      drug: 'Ozempic 1mg/dose Pre-filled Pen',
      rxNormCode: '1991440',
      wacCost: '$840.00',
      reimbursement: '$892.00',
      margin: '+$52.00 (6%)',
      time: '14 min ago',
      payer: 'Cold-Chain Courier',
      priority: 'Cold-Chain'
    },
    {
      id: 'RX-774924',
      patientId: 'pat-99185',
      patient: 'Emily Watson',
      drug: 'Metformin HCl ER 500mg #60',
      rxNormCode: '861007',
      wacCost: '$1.90',
      reimbursement: '$4.80',
      margin: '+$2.90 (60%)',
      time: '21 min ago',
      payer: 'Retail $4 Tier',
      priority: 'Normal'
    }
  ];

  const handleDispense = (id: string) => {
    setDispensedOrders((prev) => [...prev, id]);
  };

  const handleOpenFhirModal = (ord: any) => {
    setSelectedOrderForFhir(ord);
    const bundle = generateFhirPrescriptionBundle(
      ord.patientId,
      ord.patient,
      ord.drug,
      ord.rxNormCode,
      90,
      90,
      selectedTenant
    );
    setGeneratedFhirBundle(bundle);
    setIsFhirModalOpen(true);
  };

  const handleSyncInventoryFeed = async () => {
    setIsSyncingStock(true);
    const updated = await syncPartnerInventory('ph-cvs-4928');
    setStocks(updated);
    setIsSyncingStock(false);
  };

  const handleAdjudicateNewClaim = () => {
    const claim = adjudicateB2bClaim(
      'CVS Pharmacy #4928',
      'Atorvastatin Calcium 20mg #90',
      48.99,
      12.40
    );
    setClaims([...getB2bClaims()]);
    setClaimAdjudicatedMsg(`Successfully adjudicated claim ${claim.claimId} via NCPDP Gateway!`);
    setTimeout(() => setClaimAdjudicatedMsg(null), 4500);
  };

  const handleCopyFhirJson = () => {
    if (generatedFhirBundle) {
      navigator.clipboard.writeText(JSON.stringify(generatedFhirBundle, null, 2));
      setFhirCopied(true);
      setTimeout(() => setFhirCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-7xl mx-auto">
      {/* Header with Tenant Selector */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500 text-white uppercase tracking-wider">
              Enterprise Console v2.0
            </span>
            <span className="text-xs text-indigo-300 font-mono flex items-center gap-1">
              <Server className="w-3.5 h-3.5" />
              NCPDP #5502910 • HL7 FHIR R4 Connected
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-white tracking-tight">
            Pharmacy Network & EHR Interoperability Terminal
          </h1>
          <p className="text-xs md:text-sm text-indigo-200/80 max-w-2xl">
            HL7 FHIR R4 EHR integrations (Epic, Cerner), live pioneer inventory synchronizers, B2B coupon claims adjudication, and population health analytics.
          </p>
        </div>

        {/* Tenant Switcher Dropdown */}
        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 w-full md:w-auto relative z-10 shrink-0">
          <label className="text-[10px] font-mono uppercase text-indigo-200 block mb-1">
            Active Multi-Tenant Context
          </label>
          <select
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            className="w-full bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-indigo-400/30 focus:outline-none"
          >
            <option value="HealthFirst Regional Network (48 Stores)">HealthFirst Regional Network (48 Stores)</option>
            <option value="St. Jude Clinical Pharmacy Alliance (12 Stores)">St. Jude Clinical Pharmacy Alliance (12 Stores)</option>
            <option value="MediCare+ Independent Partner Network">MediCare+ Independent Partner Network</option>
          </select>
        </div>
      </div>

      {/* Phase 5 Sub-Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-xl text-xs font-headline font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
            activeTab === 'queue'
              ? 'bg-secondary text-white shadow-xs'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Fulfillment Queue</span>
        </button>

        <button
          onClick={() => setActiveTab('fhir')}
          className={`px-4 py-2 rounded-xl text-xs font-headline font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
            activeTab === 'fhir'
              ? 'bg-secondary text-white shadow-xs'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <FileJson className="w-4 h-4 text-emerald-400" />
          <span>HL7 FHIR R4 EHR Gateway</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-headline font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
            activeTab === 'inventory'
              ? 'bg-secondary text-white shadow-xs'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <Server className="w-4 h-4 text-cyan-400" />
          <span>Live Inventory Feed</span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`px-4 py-2 rounded-xl text-xs font-headline font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
            activeTab === 'claims'
              ? 'bg-secondary text-white shadow-xs'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <DollarSign className="w-4 h-4 text-amber-400" />
          <span>B2B Claims Settlement</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-headline font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-secondary text-white shadow-xs'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <Activity className="w-4 h-4 text-indigo-400" />
          <span>Population Health & PDC</span>
        </button>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-xs space-y-1">
          <span className="text-[11px] font-mono uppercase text-on-surface-variant font-semibold">
            Today's Ingested Scripts
          </span>
          <div className="text-2xl font-headline font-extrabold text-on-surface">1,482</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold font-mono">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>+14.2% vs baseline</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-xs space-y-1">
          <span className="text-[11px] font-mono uppercase text-on-surface-variant font-semibold">
            CMS Star Rating (PDC)
          </span>
          <div className="text-2xl font-headline font-extrabold text-indigo-600 flex items-center gap-1">
            <span>{popMetrics.cmsStarRatingEstimate}</span>
            <Award className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold font-mono">
            <span>86.4% PDC Adherence Target</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-xs space-y-1">
          <span className="text-[11px] font-mono uppercase text-on-surface-variant font-semibold">
            FHIR R4 Bundle Transports
          </span>
          <div className="text-2xl font-headline font-extrabold text-emerald-700">4,912</div>
          <div className="flex items-center gap-1 text-[11px] text-on-surface-variant font-mono">
            <span>Epic & Cerner Compliant</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-xs space-y-1">
          <span className="text-[11px] font-mono uppercase text-on-surface-variant font-semibold">
            Claim Clean Adjudication
          </span>
          <div className="text-2xl font-headline font-extrabold text-emerald-700">99.4%</div>
          <div className="flex items-center gap-1 text-[11px] text-on-surface-variant font-mono">
            <span>0.6% prior auth rejects</span>
          </div>
        </div>
      </div>

      {/* Tab Content 1: Fulfillment Queue */}
      {activeTab === 'queue' && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-surface-container-low">
            <div>
              <h2 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">queue</span>
                Real-Time Inbound Dispense Queue
              </h2>
              <p className="text-xs text-on-surface-variant">
                Automated claims verification, inventory reservation, and pharmacist sign-off
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>NCPDP Real-Time Gateway Active</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-outline-variant/20 text-[11px] font-mono uppercase tracking-wider text-on-surface-variant bg-surface">
                  <th className="py-3 px-6">Rx Number & Patient</th>
                  <th className="py-3 px-4">Medication & Strength</th>
                  <th className="py-3 px-4">Payer / Program</th>
                  <th className="py-3 px-4">WAC vs Reimburse</th>
                  <th className="py-3 px-4">Net Spread</th>
                  <th className="py-3 px-6 text-right">EHR & Dispense Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15">
                {orders.map((ord) => {
                  const isDispensed = dispensedOrders.includes(ord.id);
                  return (
                    <tr key={ord.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-mono font-bold text-on-surface">{ord.id}</div>
                        <div className="font-medium text-on-surface">{ord.patient}</div>
                        <span className="text-[10px] text-on-surface-variant font-mono">{ord.time}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-headline font-semibold text-on-surface">{ord.drug}</span>
                        {ord.priority === 'Cold-Chain' && (
                          <span className="block text-[10px] font-bold text-blue-700 font-mono">
                            ❄️ Requires Insulated Cold-Pack
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-mono text-[11px]">
                          {ord.payer}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono">
                        <div className="text-on-surface-variant">WAC: {ord.wacCost}</div>
                        <div className="font-bold text-on-surface">Reimb: {ord.reimbursement}</div>
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-emerald-700">
                        {ord.margin}
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenFhirModal(ord)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-semibold text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <FileJson className="w-3.5 h-3.5" />
                          <span>FHIR JSON</span>
                        </button>

                        {isDispensed ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold font-mono text-xs">
                            <span className="material-symbols-outlined text-base">check_circle</span>
                            Dispensed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDispense(ord.id)}
                            className="px-3 py-1.5 rounded-lg bg-secondary text-white font-headline font-semibold text-xs hover:bg-secondary/90 transition-colors shadow-xs"
                          >
                            Dispense
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: HL7 FHIR R4 EHR Gateway */}
      {activeTab === 'fhir' && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
                <FileJson className="w-5 h-5 text-emerald-600" />
                HL7 FHIR R4 EHR Integration Hub
              </h2>
              <p className="text-xs text-on-surface-variant">
                21st Century Cures Act compliant MedicationRequest and Patient bundle generator for Epic, Cerner, and Surescripts.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold rounded-lg border border-emerald-300">
              FHIR v4.0.1 Specification Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {orders.map((ord) => (
              <div key={ord.id} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface">{ord.patient} ({ord.patientId})</span>
                  <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold">
                    RxNorm: {ord.rxNormCode}
                  </span>
                </div>
                <p className="text-on-surface-variant text-[11px] font-sans">{ord.drug}</p>
                <div className="pt-2 flex items-center justify-between border-t border-outline-variant/20">
                  <span className="text-emerald-700 font-semibold">Ready for EHR Export</span>
                  <button
                    onClick={() => handleOpenFhirModal(ord)}
                    className="px-3 py-1 bg-secondary hover:bg-secondary/90 text-white rounded-lg font-sans text-xs font-bold flex items-center gap-1"
                  >
                    <FileJson className="w-3.5 h-3.5" />
                    <span>Generate FHIR R4 Bundle</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Live Inventory Synchronizer */}
      {activeTab === 'inventory' && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
                <Server className="w-5 h-5 text-cyan-600" />
                Live Partner Pharmacy Inventory Feed
              </h2>
              <p className="text-xs text-on-surface-variant">
                Synchronized stock levels, wholesale acquisition cost (WAC), and margin arbitrage across retail partner chains.
              </p>
            </div>
            <button
              onClick={handleSyncInventoryFeed}
              disabled={isSyncingStock}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingStock ? 'animate-spin' : ''}`} />
              <span>{isSyncingStock ? 'Syncing PMS Feed...' : 'Sync Stock Feeds'}</span>
            </button>
          </div>

          <div className="divide-y divide-outline-variant/15 text-xs">
            {stocks.map((st) => (
              <div key={st.pharmacyId} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono">
                <div>
                  <h4 className="font-headline font-bold text-sm text-on-surface font-sans">{st.pharmacyName}</h4>
                  <div className="text-on-surface-variant text-[11px] space-x-2">
                    <span>NDC: {st.ndcCode}</span>
                    <span>•</span>
                    <span>Sync: {st.lastInventorySync}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">On Hand</span>
                    <strong className="text-on-surface text-sm">{st.quantityOnHand} units</strong>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">WAC / Cash Price</span>
                    <span className="text-on-surface">${st.wholesaleAcquisitionCost} / ${st.cashPrice}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">Est. Margin</span>
                    <span className="text-emerald-700 font-bold">{st.estimatedMarginPercent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 4: B2B Claims Settlement */}
      {activeTab === 'claims' && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-500" />
                B2B Coupon Claim Adjudication & Settlement
              </h2>
              <p className="text-xs text-on-surface-variant">
                NCPDP D.0 claim adjudication, copay coupon redemptions, and PBM clearinghouse financial settlement logs.
              </p>
            </div>
            <button
              onClick={handleAdjudicateNewClaim}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Adjudicate Sample Claim</span>
            </button>
          </div>

          {claimAdjudicatedMsg && (
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{claimAdjudicatedMsg}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-outline-variant/20 text-[11px] uppercase tracking-wider text-on-surface-variant bg-surface">
                  <th className="py-2.5 px-3">Claim ID & Pharmacy</th>
                  <th className="py-2.5 px-3">Medication</th>
                  <th className="py-2.5 px-3">Rx BIN / PCN</th>
                  <th className="py-2.5 px-3">Gross / Copay</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15">
                {claims.map((clm) => (
                  <tr key={clm.claimId} className="hover:bg-surface-container-low">
                    <td className="py-3 px-3">
                      <div className="font-bold text-on-surface">{clm.claimId}</div>
                      <div className="text-[11px] text-on-surface-variant font-sans">{clm.pharmacyName}</div>
                    </td>
                    <td className="py-3 px-3 font-sans font-semibold text-on-surface">{clm.drugName}</td>
                    <td className="py-3 px-3">BIN: {clm.rxBin} • PCN: {clm.rxPcn}</td>
                    <td className="py-3 px-3">
                      Gross: ${clm.grossAmount} | <strong className="text-emerald-700">Copay: ${clm.patientPaidCopay}</strong>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-200">
                        {clm.settlementStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 5: Population Health Analytics */}
      {activeTab === 'analytics' && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-6 shadow-xs">
          <div>
            <h2 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Enterprise Population Health & PDC Adherence Metrics
            </h2>
            <p className="text-xs text-on-surface-variant">
              Proportion of Days Covered (PDC) adherence analysis for Medicare Advantage CMS Star Ratings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-1">
              <span className="text-indigo-900 dark:text-indigo-300 font-semibold block text-[11px]">Enrolled Population</span>
              <div className="text-2xl font-extrabold text-indigo-950 dark:text-indigo-100">
                {popMetrics.totalPatientsEnrolled.toLocaleString()} Patients
              </div>
              <p className="text-indigo-800 dark:text-indigo-300 text-[11px]">Across 3 Therapeutic Categories</p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <span className="text-emerald-900 dark:text-emerald-300 font-semibold block text-[11px]">Avg Population PDC</span>
              <div className="text-2xl font-extrabold text-emerald-950 dark:text-emerald-100">
                {popMetrics.averagePdcAdherencePercent}%
              </div>
              <p className="text-emerald-800 dark:text-emerald-300 text-[11px]">Target ≥80% for CMS 5-Star Threshold</p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1">
              <span className="text-purple-900 dark:text-purple-300 font-semibold block text-[11px]">Total Savings Generated</span>
              <div className="text-2xl font-extrabold text-purple-950 dark:text-purple-100">
                ${popMetrics.totalAnnualSavingsGenerated.toLocaleString()}
              </div>
              <p className="text-purple-800 dark:text-purple-300 text-[11px]">Avg ${popMetrics.averageSavingsPerPatient}/patient annual</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-headline font-bold text-sm text-on-surface">Patient Adherence Risk Stratification</h3>
            <div className="divide-y divide-outline-variant/15 text-xs font-mono">
              {riskProfiles.map((prof) => (
                <div key={prof.patientId} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <strong className="text-on-surface font-sans text-sm block">{prof.patientName}</strong>
                    <span className="text-on-surface-variant text-[11px] font-sans">{prof.primaryCondition}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-on-surface-variant text-[10px] block">PDC Score</span>
                      <strong className="text-indigo-600 text-sm">{prof.currentPdcPercent}%</strong>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        prof.riskCategory === 'Low'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : prof.riskCategory === 'Moderate'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-red-100 text-red-900 border border-red-300'
                      }`}
                    >
                      {prof.riskCategory} Risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HL7 FHIR R4 Bundle Modal */}
      {isFhirModalOpen && generatedFhirBundle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 text-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-emerald-400" />
                <h3 className="font-headline font-bold text-base">HL7 FHIR R4 Transaction Bundle</h3>
              </div>
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded font-mono">
                Cures Act Validated
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Generated compliant FHIR R4 MedicationRequest bundle for <strong>{selectedOrderForFhir?.patient}</strong> directly exportable into Epic, Cerner, or Surescripts EHR portals.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-80">
              <pre>{JSON.stringify(generatedFhirBundle, null, 2)}</pre>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={handleCopyFhirJson}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{fhirCopied ? 'Copied to Clipboard!' : 'Copy FHIR R4 JSON'}</span>
              </button>

              <button
                onClick={() => setIsFhirModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
