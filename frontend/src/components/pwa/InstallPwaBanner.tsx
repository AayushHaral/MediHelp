import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, ShieldCheck, Zap } from 'lucide-react';
import { pwaService } from '../../services/pwaService';

export const InstallPwaBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  useEffect(() => {
    // Check if installable or captured prompt available
    const checkInstallability = () => {
      if (pwaService.isInstallable()) {
        setShowBanner(true);
      }
    };

    checkInstallability();

    const timer = setTimeout(checkInstallability, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleInstallClick = async () => {
    setIsInstalling(true);
    const installed = await pwaService.promptInstallPwa();
    setIsInstalling(false);
    if (installed) {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-950 via-blue-900 to-slate-900 border-b border-indigo-500/30 text-white px-4 py-3 shadow-lg relative z-40 animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/30 border border-blue-400/40 rounded-xl text-blue-400 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-semibold text-white">
              <span>Install MediHelp Native App</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-normal flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" />
                Offline Ready
              </span>
            </div>
            <p className="text-xs text-blue-200/80">
              Get instant offline access to discount cards, pill reminders, and 1-tap FaceID biometrics on your phone or tablet.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md shadow-blue-600/30 text-xs"
          >
            <Download className="w-4 h-4" />
            <span>{isInstalling ? 'Installing...' : 'Install App'}</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Dismiss installation banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
