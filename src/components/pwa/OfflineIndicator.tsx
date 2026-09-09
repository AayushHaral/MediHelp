import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { pwaService } from '../../services/pwaService';
import { getOfflineQueue, processOfflineQueue } from '../../services/dbService';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(pwaService.getIsOnline());
  const [queueCount, setQueueCount] = useState<number>(getOfflineQueue().length);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = pwaService.onNetworkChange((online) => {
      setIsOnline(online);
      if (online) {
        handleAutoSync();
      }
    });

    const handleSyncEvent = () => {
      handleAutoSync();
    };

    window.addEventListener('medihelp-offline-sync', handleSyncEvent);

    return () => {
      unsubscribe();
      window.removeEventListener('medihelp-offline-sync', handleSyncEvent);
    };
  }, []);

  const handleAutoSync = () => {
    const queue = getOfflineQueue();
    setQueueCount(queue.length);

    if (queue.length > 0) {
      setIsSyncing(true);
      setTimeout(() => {
        const result = processOfflineQueue();
        setIsSyncing(false);
        setQueueCount(0);
        setSyncSuccessMsg(`Synced ${result.count} offline action(s) to server.`);
        setTimeout(() => setSyncSuccessMsg(null), 4000);
      }, 1000);
    }
  };

  const handleManualSync = () => {
    handleAutoSync();
  };

  if (isOnline && queueCount === 0 && !syncSuccessMsg) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      {syncSuccessMsg && (
        <div className="mb-2 p-3 bg-emerald-900/90 backdrop-blur-md border border-emerald-500/40 text-emerald-100 rounded-xl shadow-2xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncSuccessMsg}</span>
          </div>
        </div>
      )}

      {!isOnline && (
        <div className="p-4 bg-slate-900/95 backdrop-blur-md border border-amber-500/50 text-amber-100 rounded-2xl shadow-2xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-amber-300 text-sm">
                <WifiOff className="w-4 h-4" />
                <span>Offline Mode Active</span>
              </div>
            </div>
            <span className="text-xs bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded-full border border-amber-800/60 font-mono">
              Cached PWA Mode
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Your saved discount cards, pill schedules, and health records are fully accessible offline. Changes will queue and sync when reconnected.
          </p>

          <div className="pt-1 flex items-center justify-between border-t border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Queue: <strong className="text-white">{queueCount}</strong> pending action(s)</span>
            </div>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold rounded-lg transition-colors text-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Force Sync'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
