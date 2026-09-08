import React, { useState } from 'react';
import { ScreenType, PriceAlert } from '../../types';
import { MOCK_PRICE_ALERTS } from '../../data/mockData';

interface PriceAlertsScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const PriceAlertsScreen: React.FC<PriceAlertsScreenProps> = ({ onNavigate }) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>(MOCK_PRICE_ALERTS);
  const [newDrug, setNewDrug] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleToggleNotify = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, notifyOnDrop: !a.notifyOnDrop } : a)));
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrug.trim()) return;
    const newEntry: PriceAlert = {
      id: `alert-${Date.now()}`,
      drugName: newDrug,
      strength: 'Standard therapeutic dose',
      currentLowest: Number(newTarget) * 1.15 || 25.0,
      targetPrice: Number(newTarget) || 20.0,
      notifyOnDrop: true,
      lastUpdated: 'Just now',
      changePercent: -2.1,
      historicalTrend: 'down'
    };
    setAlerts([newEntry, ...alerts]);
    setNewDrug('');
    setNewTarget('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">notifications_active</span>
            <span>Algorithmic Formulary Price Watcher</span>
          </div>
          <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-on-surface tracking-tight">
            Prescription Price Drop Watchlist
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant">
            Wholesale pharmaceutical pricing shifts weekly. Set target thresholds to automatically trigger prescription transfers when prices plunge.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 bg-secondary text-white font-headline font-semibold text-xs rounded-xl hover:bg-secondary/90 transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">{isAdding ? 'close' : 'add'}</span>
          <span>{isAdding ? 'Cancel' : 'Set New Price Alert'}</span>
        </button>
      </div>

      {/* Inline Create Form if open */}
      {isAdding && (
        <form
          onSubmit={handleCreateAlert}
          className="bg-surface-container-lowest rounded-2xl border border-secondary/40 p-5 space-y-4 shadow-sm"
        >
          <h3 className="font-headline font-bold text-sm text-on-surface">Configure Price Drop Target</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-on-surface block">Medication Name</label>
              <input
                type="text"
                placeholder="e.g. Ozempic, Lisinopril..."
                value={newDrug}
                onChange={(e) => setNewDrug(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-on-surface block">Target Price Threshold ($)</label>
              <input
                type="number"
                placeholder="e.g. 15.00"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface font-mono focus:outline-none focus:ring-1 focus:ring-secondary"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-secondary text-white font-headline font-semibold text-xs rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Activate Price Sentinel
          </button>
        </form>
      )}

      {/* Price Watchlist Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
          <span>Active Monitored Medications ({alerts.length})</span>
          <span className="font-mono">Updated 15 mins ago via Wholesale Feeds</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-secondary/40 transition-all shadow-xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-surface-container-high text-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">monitoring</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-bold text-base text-on-surface">{alert.drugName}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-surface-container text-on-surface">
                      {alert.strength}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-on-surface-variant font-mono mt-1">
                    <span>
                      Current Lowest: <strong className="text-secondary">${alert.currentLowest.toFixed(2)}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Target: <strong className="text-on-surface">${alert.targetPrice.toFixed(2)}</strong>
                    </span>
                    <span>•</span>
                    <span
                      className={`font-bold flex items-center gap-0.5 ${
                        alert.changePercent < 0 ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {alert.changePercent < 0 ? 'trending_down' : 'trending_up'}
                      </span>
                      {alert.changePercent}% 7-day
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions & Toggle */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleToggleNotify(alert.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    alert.notifyOnDrop
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-container text-outline hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {alert.notifyOnDrop ? 'notifications_active' : 'notifications_off'}
                  </span>
                  <span>{alert.notifyOnDrop ? 'Push & SMS Active' : 'Muted'}</span>
                </button>

                <button
                  onClick={() => onNavigate('catalog')}
                  className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold border border-outline-variant/30"
                >
                  Compare Prices
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
