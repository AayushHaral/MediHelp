import React, { useState } from 'react';
import { ScreenType } from '../../types';

interface PharmacyPartnerDashboardProps {
  onNavigate: (screen: ScreenType) => void;
}

export const PharmacyPartnerDashboard: React.FC<PharmacyPartnerDashboardProps> = ({ onNavigate }) => {
  const [selectedTenant, setSelectedTenant] = useState('HealthFirst Regional Network (48 Stores)');
  const [dispensedOrders, setDispensedOrders] = useState<string[]>([]);

  const orders = [
    {
      id: 'RX-774921',
      patient: 'Robert Alvarez',
      drug: 'Atorvastatin Calcium 20mg #90',
      wacCost: '$4.20',
      reimbursement: '$18.40',
      margin: '+$14.20 (77%)',
      time: '3 min ago',
      payer: 'Direct Cash Pass',
      priority: 'Normal'
    },
    {
      id: 'RX-774922',
      patient: 'Sarah Jenkins',
      drug: 'Adderall XR 20mg #30 (C-II)',
      wacCost: '$16.80',
      reimbursement: '$28.50',
      margin: '+$11.70 (41%)',
      time: '8 min ago',
      payer: 'Digital Coupon COB',
      priority: 'Urgent Counter Pickup'
    },
    {
      id: 'RX-774923',
      patient: 'David Miller',
      drug: 'Ozempic 1mg/dose Pre-filled Pen',
      wacCost: '$840.00',
      reimbursement: '$892.00',
      margin: '+$52.00 (6%)',
      time: '14 min ago',
      payer: 'Cold-Chain Courier',
      priority: 'Cold-Chain'
    },
    {
      id: 'RX-774924',
      patient: 'Emily Watson',
      drug: 'Metformin HCl ER 500mg #60',
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

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header with Tenant Selector */}
      <div className="bg-primary-container rounded-2xl p-6 md:p-8 text-white border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-secondary text-white uppercase tracking-wider">
              Enterprise Console
            </span>
            <span className="text-xs text-on-primary-container font-mono">NCPDP #5502910</span>
          </div>
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-white tracking-tight">
            Pharmacy Network Operational Terminal
          </h1>
          <p className="text-xs md:text-sm text-inverse-on-surface/80">
            Multi-tenant clearinghouse routing, live WAC/AWP margin arbitrage, and real-time electronic fulfillment queue.
          </p>
        </div>

        {/* Tenant Switcher Dropdown */}
        <div className="bg-white/10 p-3 rounded-xl border border-white/15 w-full md:w-auto">
          <label className="text-[10px] font-mono uppercase text-white/70 block mb-1">
            Active Multi-Tenant Context
          </label>
          <select
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            className="w-full bg-primary-container text-white text-xs font-semibold px-3 py-2 rounded-lg border border-white/20 focus:outline-none"
          >
            <option value="HealthFirst Regional Network (48 Stores)">HealthFirst Regional Network (48 Stores)</option>
            <option value="St. Jude Clinical Pharmacy Alliance (12 Stores)">St. Jude Clinical Pharmacy Alliance (12 Stores)</option>
            <option value="MediCare+ Independent Partner Network">MediCare+ Independent Partner Network</option>
          </select>
        </div>
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
            Avg Counter Latency
          </span>
          <div className="text-2xl font-headline font-extrabold text-secondary">11.4 min</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold font-mono">
            <span className="material-symbols-outlined text-[14px]">timer</span>
            <span>-2.8 min faster</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-xs space-y-1">
          <span className="text-[11px] font-mono uppercase text-on-surface-variant font-semibold">
            Formulary Net Margin
          </span>
          <div className="text-2xl font-headline font-extrabold text-on-surface">$24,190</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold font-mono">
            <span className="material-symbols-outlined text-[14px]">savings</span>
            <span>94.2% recovery</span>
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

      {/* Live Inbound Script Queue Table */}
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
                <th className="py-3 px-6 text-right">Status / Action</th>
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

                    <td className="py-4 px-6 text-right">
                      {isDispensed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold font-mono text-xs">
                          <span className="material-symbols-outlined text-base">check_circle</span>
                          Dispensed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDispense(ord.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-secondary text-white font-headline font-semibold text-xs hover:bg-secondary/90 transition-colors shadow-xs"
                        >
                          Verify & Dispense
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
    </div>
  );
};
