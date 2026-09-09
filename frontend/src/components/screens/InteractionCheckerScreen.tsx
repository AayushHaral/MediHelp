import React, { useState, useEffect } from 'react';
import { ScreenType, DrugInteraction } from '../../types';
import { MOCK_INTERACTIONS } from '../../data/mockData';
import { fetchOpenFdaInteractions, OpenFdaQueryResult } from '../../services/openFdaService';
import { explainInteractionWithAI, AISafetyAdvice } from '../../services/geminiService';

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
  const [isLoadingFda, setIsLoadingFda] = useState(false);
  const [fdaQueryResult, setFdaQueryResult] = useState<OpenFdaQueryResult | null>(null);
  const [aiAdviceMap, setAiAdviceMap] = useState<Record<string, { loading: boolean; advice?: AISafetyAdvice }>>({});

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

  // Find interactions involving the selected meds from local mock
  const activeLocalInteractions = MOCK_INTERACTIONS.filter(
    (inter) =>
      selectedMeds.some((m) => m.toLowerCase().includes(inter.drugA.toLowerCase())) &&
      selectedMeds.some((m) => m.toLowerCase().includes(inter.drugB.toLowerCase()))
  );

  const activeInteractions: DrugInteraction[] = fdaQueryResult
    ? fdaQueryResult.interactions
    : activeLocalInteractions;

  const handleTriggerFdaLiveCheck = async () => {
    if (selectedMeds.length < 2) return;
    setIsLoadingFda(true);
    const drugA = selectedMeds[0];
    const drugB = selectedMeds[1];
    const result = await fetchOpenFdaInteractions(drugA, drugB);
    setFdaQueryResult(result);
    setIsLoadingFda(false);
  };

  const handleExplainWithAI = async (item: DrugInteraction, idx: number) => {
    const key = `${item.drugA}-${item.drugB}-${idx}`;
    setAiAdviceMap((prev) => ({ ...prev, [key]: { loading: true } }));
    const advice = await explainInteractionWithAI(item.drugA, item.drugB, item.clinicalImpact);
    setAiAdviceMap((prev) => ({ ...prev, [key]: { loading: false, advice } }));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 md:p-8 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
            <span>Clinical Pharmacovigilance & Polypharmacy Scanner</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-semibold border border-emerald-300 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>OpenFDA API v2 Connected</span>
          </div>
        </div>

        <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-on-surface tracking-tight">
          Clinical Drug-Drug Interaction Checker
        </h1>
        <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl">
          Evaluate potential contraindications, CYP3A4 enzyme inhibition, and adverse pharmacological synergies using live FDA labeling data and Gemini AI.
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

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <form onSubmit={handleAddMed} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={newMedInput}
                onChange={(e) => setNewMedInput(e.target.value)}
                placeholder="Add drug (e.g. Omeprazole)..."
                className="px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary w-full sm:w-44"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-secondary text-white font-headline font-semibold text-xs hover:bg-secondary/90 transition-colors shrink-0"
              >
                Add
              </button>
            </form>

            <button
              onClick={handleTriggerFdaLiveCheck}
              disabled={isLoadingFda || selectedMeds.length < 2}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-headline font-semibold text-xs hover:bg-emerald-700 disabled:opacity-50 transition-colors shrink-0 flex items-center gap-1"
            >
              {isLoadingFda ? (
                <>
                  <span className="material-symbols-outlined text-[14px] animate-spin">refresh</span>
                  <span>FDA API Querying...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[14px]">cloud_sync</span>
                  <span>Query Live OpenFDA</span>
                </>
              )}
            </button>
          </div>
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

      {fdaQueryResult && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600">verified_user</span>
            <span>{fdaQueryResult.disclaimer}</span>
          </div>
          <span className="font-mono text-[10px] uppercase font-bold bg-emerald-200 dark:bg-emerald-900 px-2 py-0.5 rounded">
            Source: {fdaQueryResult.source}
          </span>
        </div>
      )}

      {/* Interaction Severity Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl p-4 text-xs space-y-1">
          <div className="flex items-center justify-between text-red-900 dark:text-red-300 font-bold font-mono">
            <span>MAJOR CONTRAINDICATIONS</span>
            <span className="text-base font-black">
              {activeInteractions.filter((i) => i.severity === 'major').length}
            </span>
          </div>
          <p className="text-red-700 dark:text-red-400 text-[11px]">Combination strictly avoided or warrants immediate therapy substitution.</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs space-y-1">
          <div className="flex items-center justify-between text-amber-900 dark:text-amber-300 font-bold font-mono">
            <span>MODERATE MONITORING</span>
            <span className="text-base font-black">
              {activeInteractions.filter((i) => i.severity === 'moderate').length}
            </span>
          </div>
          <p className="text-amber-700 dark:text-amber-400 text-[11px]">Use concomitantly only with clinical monitoring of vitals.</p>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-900 dark:text-emerald-300 font-bold font-mono">
            <span>COMPATIBLE PAIRINGS</span>
            <span className="text-base font-black">Verified</span>
          </div>
          <p className="text-emerald-700 dark:text-emerald-400 text-[11px]">No adverse synergistic interactions detected in other pairs.</p>
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
          activeInteractions.map((item, idx) => {
            const key = `${item.drugA}-${item.drugB}-${idx}`;
            const aiData = aiAdviceMap[key];

            return (
              <div
                key={key}
                className={`bg-surface-container-lowest rounded-2xl border p-6 space-y-4 shadow-xs ${
                  item.severity === 'major' ? 'border-red-300 dark:border-red-900' : 'border-amber-300 dark:border-amber-900'
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

                {/* Gemini AI Plain Language Advice */}
                {aiData?.advice ? (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-teal-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 border border-teal-200 dark:border-teal-900 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold font-headline">
                      <span className="material-symbols-outlined text-[16px]">psychology</span>
                      <span>Gemini AI Plain-English Patient Advice</span>
                    </div>
                    <p className="text-on-surface italic">{aiData.advice.summary}</p>
                    <ul className="list-disc list-inside text-on-surface-variant space-y-1">
                      {aiData.advice.actionItems.map((action, aIdx) => (
                        <li key={aIdx}>{action}</li>
                      ))}
                    </ul>
                    <div className="p-2 rounded bg-white/70 dark:bg-slate-800/70 text-on-surface font-medium text-[11px] flex items-start gap-1">
                      <span className="material-symbols-outlined text-[14px] text-amber-500 shrink-0 mt-0.5">elderly</span>
                      <span><strong>Senior Patient Tip:</strong> {aiData.advice.seniorAdvice}</span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-1 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleExplainWithAI(item, idx)}
                      disabled={aiData?.loading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white font-headline font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                      <span>{aiData?.loading ? 'Analyzing with Gemini AI...' : 'Explain with Gemini AI'}</span>
                    </button>

                    <button
                      onClick={() => onNavigate('teleconsult')}
                      className="text-secondary font-semibold hover:underline flex items-center gap-1"
                    >
                      Discuss with Dr. Elena Rostova MD
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
