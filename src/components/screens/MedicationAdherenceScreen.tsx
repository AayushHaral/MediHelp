import React, { useState, useEffect } from 'react';
import { ScreenType, AdherenceDose } from '../../types';
import { getStoredAdherenceDoses, toggleDoseTaken } from '../../services/dbService';
import { sendMedicationSmsReminder } from '../../services/reminderService';

interface MedicationAdherenceScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const MedicationAdherenceScreen: React.FC<MedicationAdherenceScreenProps> = ({ onNavigate }) => {
  const [doses, setDoses] = useState<AdherenceDose[]>([]);
  const [streakDays] = useState(14);
  const [smsNotificationMsg, setSmsNotificationMsg] = useState<string | null>(null);

  useEffect(() => {
    setDoses(getStoredAdherenceDoses());
  }, []);

  const handleToggleTaken = (id: string) => {
    const updated = toggleDoseTaken(id);
    setDoses(updated);
  };

  const handleSendSmsReminder = async (dose: AdherenceDose) => {
    setSmsNotificationMsg(null);
    const res = await sendMedicationSmsReminder({
      recipientPhone: '+1 (555) 019-2834',
      drugName: dose.drugName,
      scheduledTime: dose.scheduledTime,
      dosageInstructions: dose.instructions,
    });
    setSmsNotificationMsg(`SMS Alert ${res.deliveryStatus.toUpperCase()}! Reminder sent for ${dose.drugName} at ${dose.scheduledTime}.`);
    setTimeout(() => setSmsNotificationMsg(null), 5000);
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

      {smsNotificationMsg && (
        <div className="p-3 rounded-xl bg-teal-100 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-teal-600 text-base">sms</span>
          <span>{smsNotificationMsg}</span>
        </div>
      )}

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
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                <button
                  onClick={() => handleSendSmsReminder(dose)}
                  className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors flex items-center gap-1 border border-outline-variant/30"
                  title="Send SMS reminder alert to patient phone"
                >
                  <span className="material-symbols-outlined text-[15px] text-teal-600">sms</span>
                  <span>SMS Alert</span>
                </button>

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
