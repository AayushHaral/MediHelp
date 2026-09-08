import React, { useState } from 'react';
import { ScreenType, AdherenceDose } from '../../types';
import { MOCK_ADHERENCE } from '../../data/mockData';

interface MedicationAdherenceScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const MedicationAdherenceScreen: React.FC<MedicationAdherenceScreenProps> = ({ onNavigate }) => {
  const [doses, setDoses] = useState<AdherenceDose[]>(MOCK_ADHERENCE);
  const [streakDays, setStreakDays] = useState(14);

  const handleToggleTaken = (id: string) => {
    setDoses((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const newTaken = !d.taken;
          return {
            ...d,
            taken: newTaken,
            takenAt: newTaken ? 'Just now' : undefined,
            remainingPills: newTaken ? Math.max(0, d.remainingPills - 1) : d.remainingPills + 1
          };
        }
        return d;
      })
    );
  };

  const takenCount = doses.filter((d) => d.taken).length;
  const adherencePercent = Math.round((takenCount / doses.length) * 100);

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Adherence Header Card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">pill</span>
            <span>Intelligent Medication Adherence</span>
          </div>
          <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-on-surface tracking-tight">
            Daily Pill Schedule & Refill Monitor
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant">
            Stay on track with dosing times, track remaining inventory, and trigger automatic refills before you run out.
          </p>
        </div>

        {/* Adherence Streak Badge */}
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 text-center shrink-0 w-full sm:w-auto">
          <div className="flex items-center justify-center gap-1.5 text-amber-500 font-headline font-black text-2xl">
            <span className="material-symbols-outlined text-3xl fill">local_fire_department</span>
            <span>{streakDays} Days</span>
          </div>
          <span className="text-[11px] font-mono text-on-surface-variant block mt-0.5 font-semibold">
            Current Adherence Streak
          </span>
        </div>
      </div>

      {/* Daily Progress Gauge */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-on-surface">Today's Dosing Progress (Monday, Sep 8)</span>
          <span className="font-mono text-secondary">
            {takenCount} of {doses.length} doses taken ({adherencePercent}%)
          </span>
        </div>
        <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary rounded-full transition-all duration-500"
            style={{ width: `${adherencePercent}%` }}
          />
        </div>
      </div>

      {/* Dosing Timeline Cards */}
      <div className="space-y-3">
        <h2 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">schedule</span>
          Scheduled Doses for Today
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {doses.map((dose) => (
            <div
              key={dose.id}
              className={`rounded-2xl border p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                dose.taken
                  ? 'bg-surface-container-low/60 border-outline-variant/20 opacity-90'
                  : 'bg-surface-container-lowest border-outline-variant/40 hover:border-secondary/40 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleTaken(dose.id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                    dose.taken
                      ? 'bg-secondary text-white'
                      : 'bg-surface-container hover:bg-surface-container-high text-outline border border-outline-variant/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {dose.taken ? 'check' : 'radio_button_unchecked'}
                  </span>
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className={`font-headline font-bold text-base ${
                        dose.taken ? 'text-on-surface line-through decoration-outline' : 'text-on-surface'
                      }`}
                    >
                      {dose.drugName}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-surface-container text-on-surface">
                      {dose.dosage}
                    </span>
                    <span className="text-xs font-mono font-bold text-secondary">
                      ⏰ {dose.scheduledTime}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant">{dose.instructions}</p>

                  <div className="flex items-center gap-4 text-[11px] text-on-surface-variant font-mono pt-1">
                    <span>
                      Bottle Supply: <strong className="text-on-surface">{dose.remainingPills} pills</strong>
                    </span>
                    <span>•</span>
                    <span
                      className={
                        dose.refillDaysLeft <= 7 ? 'text-red-700 font-bold' : 'text-on-surface-variant'
                      }
                    >
                      {dose.refillDaysLeft <= 7 ? '⚠️ ' : ''}
                      {dose.refillDaysLeft} days of supply remaining
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {dose.refillDaysLeft <= 7 && (
                  <button
                    onClick={() => onNavigate('smart-routing')}
                    className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">autorenew</span>
                    <span>Trigger Refill</span>
                  </button>
                )}

                <button
                  onClick={() => handleToggleTaken(dose.id)}
                  className={`px-4 py-2 rounded-lg font-headline font-semibold text-xs transition-colors ${
                    dose.taken
                      ? 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      : 'bg-secondary text-white hover:bg-secondary/90 shadow-xs'
                  }`}
                >
                  {dose.taken ? 'Logged at ' + (dose.takenAt || 'today') : 'Mark as Taken'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
