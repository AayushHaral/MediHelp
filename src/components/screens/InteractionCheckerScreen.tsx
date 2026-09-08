import React, { useState } from 'react';
import { ScreenType } from '../../types';
import { MOCK_INTERACTIONS } from '../../data/mockData';

interface InteractionCheckerScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const InteractionCheckerScreen: React.FC<InteractionCheckerScreenProps> = ({ onNavigate }) => {
  const [selectedMeds, setSelectedMeds] = useState<string[]>([
    'Atorvastatin Calcium',
    'Clarithromycin',
    'Sertraline HCl',
    'Adderall XR'
  ]);
  const [newMedInput, setNewMedInput] = useState('');

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedInput.trim()) return;
    if (!selectedMeds.includes(newMedInput.trim())) {
      setSelectedMeds([...selectedMeds, newMedInput.trim()]);
    }
    setNewMedInput('');
  };

  const handleRemoveMed = (med: string) => {
    setSelectedMeds(selectedMeds.filter((m) => m !== med));
  };

  // Find interactions involving the selected meds
  const activeInteractions = MOCK_INTERACTIONS.filter(
    (inter) =>
      selectedMeds.some((m) => m.toLowerCase().includes(inter.drugA.toLowerCase())) &&
      selectedMeds.some((m) => m.toLowerCase().includes(inter.drugB.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 md:p-8 space-y-2 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-semibold">
          <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
          <span>Clinical Pharmacovigilance & Polypharmacy Scanner</span>
        </div>
        <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-on-surface tracking-tight">
          Clinical Drug-Drug Interaction Checker
        </h1>
        <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl">
          Evaluate potential contraindications, CYP3A4 enzyme inhibition, and adverse pharmacological synergies before filling multiple prescriptions.
        </p>
      </div>

      {/* Regimen Selector Box */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">medication</span>
              Active Medication Regimen ({selectedMeds.length})
            </h2>
            <p className="text-xs text-on-surface-variant">Add all prescription drugs, over-the-counter pills, and supplements</p>
          </div>

          <form onSubmit={handleAddMed} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={newMedInput}
              onChange={(e) => setNewMedInput(e.target.value)}
              placeholder="Add drug (e.g. Omeprazole)..."
              className="px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary w-full sm:w-48"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-secondary text-white font-headline font-semibold text-xs hover:bg-secondary/90 transition-colors shrink-0"
            >
              Add
            </button>
          </form>
        </div>

        {/* Medication Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {selectedMeds.map((med) => (
            <div
              key={med}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container text-xs font-semibold text-on-surface border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[15px] text-secondary">pill</span>
              <span>{med}</span>
              <button
                onClick={() => handleRemoveMed(med)}
                className="w-4 h-4 rounded-full hover:bg-outline-variant/30 text-outline hover:text-on-surface flex items-center justify-center text-[10px]"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interaction Severity Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs space-y-1">
          <div className="flex items-center justify-between text-red-900 font-bold font-mono">
            <span>MAJOR CONTRAINDICATIONS</span>
            <span className="text-base font-black">
              {activeInteractions.filter((i) => i.severity === 'major').length}
            </span>
          </div>
          <p className="text-red-700 text-[11px]">Combination strictly avoided or warrants immediate therapy substitution.</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs space-y-1">
          <div className="flex items-center justify-between text-amber-900 font-bold font-mono">
            <span>MODERATE MONITORING</span>
            <span className="text-base font-black">
              {activeInteractions.filter((i) => i.severity === 'moderate').length}
            </span>
          </div>
          <p className="text-amber-700 text-[11px]">Use concomitantly only with clinical monitoring of vitals.</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-900 font-bold font-mono">
            <span>COMPATIBLE PAIRINGS</span>
            <span className="text-base font-black">Verified</span>
          </div>
          <p className="text-emerald-700 text-[11px]">No adverse synergistic interactions detected in other pairs.</p>
        </div>
      </div>

      {/* Interaction Cards */}
      <div className="space-y-4">
        <h3 className="font-headline font-bold text-base text-on-surface">Detailed Clinical Evaluation</h3>

        {activeInteractions.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-8 text-center space-y-2">
            <span className="material-symbols-outlined text-4xl text-emerald-600">verified</span>
            <h4 className="font-headline font-bold text-base text-on-surface">No Severe Interactions Detected</h4>
            <p className="text-xs text-on-surface-variant">The currently selected medications have no documented major kinetic clashes.</p>
          </div>
        ) : (
          activeInteractions.map((item, idx) => (
            <div
              key={idx}
              className={`bg-surface-container-lowest rounded-2xl border p-6 space-y-4 shadow-xs ${
                item.severity === 'major' ? 'border-red-300' : 'border-amber-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-outline-variant/15 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                      item.severity === 'major'
                        ? 'bg-red-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {item.severity} Severity
                  </span>
                  <h4 className="font-headline font-bold text-base text-on-surface">
                    {item.drugA} + {item.drugB}
                  </h4>
                </div>
                <span className="text-xs font-mono text-outline">{item.evidenceRating}</span>
              </div>

              <div className="space-y-2 text-xs">
                <h5 className="font-bold text-on-surface">{item.title}</h5>
                <p className="text-on-surface-variant leading-relaxed">{item.clinicalImpact}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 text-xs space-y-1">
                <span className="font-bold text-secondary uppercase font-mono text-[10px] block">
                  Recommended Clinical Management
                </span>
                <p className="text-on-surface">{item.management}</p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Concerned about this combination?</span>
                <button
                  onClick={() => onNavigate('teleconsult')}
                  className="text-secondary font-semibold hover:underline flex items-center gap-1"
                >
                  Discuss with Dr. Elena Rostova MD
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
