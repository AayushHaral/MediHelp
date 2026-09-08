import React from 'react';
import { ScreenType } from '../types';
import { ALL_SCREENS } from '../data/mockData';

interface ScreenSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
}

export const ScreenSwitcherModal: React.FC<ScreenSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onSelectScreen
}) => {
  if (!isOpen) return null;

  const categories = ['Consumer Rx', 'Clinical & Delivery', 'Operations & Wallet'] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-2xl">grid_view</span>
              <h2 className="font-headline font-bold text-xl text-on-surface">Application Screen Directory</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-secondary text-white">
                13 Full Screens
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Select any screen from the 13 clinical workflows to preview, test, and interact with live state.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body: Organized by Category */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {categories.map((category) => {
            const screensInCat = ALL_SCREENS.filter((s) => s.category === category);
            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-secondary">
                    {category}
                  </h3>
                  <div className="h-px bg-outline-variant/30 flex-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {screensInCat.map((screen) => {
                    const isSelected = currentScreen === screen.id;
                    return (
                      <button
                        key={screen.id}
                        onClick={() => {
                          onSelectScreen(screen.id);
                          onClose();
                        }}
                        className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between group ${
                          isSelected
                            ? 'bg-secondary/10 border-secondary ring-1 ring-secondary shadow-xs'
                            : 'bg-surface hover:bg-surface-container-low border-outline-variant/30 hover:border-secondary/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                isSelected
                                  ? 'bg-secondary text-white'
                                  : 'bg-surface-container-high text-on-surface group-hover:bg-secondary-container group-hover:text-on-secondary-container'
                              }`}
                            >
                              <span className="material-symbols-outlined text-xl">{screen.icon}</span>
                            </div>
                            {screen.badge && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-semibold">
                                {screen.badge}
                              </span>
                            )}
                          </div>
                          <h4 className="font-headline font-bold text-sm text-on-surface group-hover:text-secondary">
                            {screen.title}
                          </h4>
                          <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                            {screen.subtitle}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-outline-variant/15 flex items-center justify-between text-[11px]">
                          <span className="text-on-surface-variant font-mono">
                            Screen #{ALL_SCREENS.findIndex((s) => s.id === screen.id) + 1}
                          </span>
                          <span
                            className={`font-semibold flex items-center gap-0.5 ${
                              isSelected ? 'text-secondary' : 'text-on-surface-variant group-hover:text-secondary'
                            }`}
                          >
                            {isSelected ? 'Active Now' : 'View Screen'}
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-surface-container border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Multi-tenant pricing & claims engine connected to 68,000+ US pharmacies</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Close Navigator
          </button>
        </div>
      </div>
    </div>
  );
};
