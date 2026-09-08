import React from 'react';
import { ScreenType } from '../types';
import { ALL_SCREENS } from '../data/mockData';
import { ThemeToggle } from './ThemeToggle';

interface ScreenQuickBarProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  onOpenModal: () => void;
}

export const ScreenQuickBar: React.FC<ScreenQuickBarProps> = ({
  currentScreen,
  onSelectScreen,
  onOpenModal
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] sm:max-w-xl md:max-w-2xl bg-surface-container-highest/95 backdrop-blur-md rounded-full shadow-2xl border border-outline-variant/40 px-3 py-2 flex items-center justify-between gap-2">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
        {ALL_SCREENS.slice(0, 6).map((screen, idx) => {
          const isSelected = currentScreen === screen.id;
          return (
            <button
              key={screen.id}
              onClick={() => onSelectScreen(screen.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-secondary text-white shadow-xs'
                  : 'text-on-surface hover:bg-surface-container-low'
              }`}
              title={screen.title}
            >
              <span className="material-symbols-outlined text-[16px]">{screen.icon}</span>
              <span className="hidden sm:inline">{screen.title.split(' ')[0]}</span>
              <span className="text-[10px] font-mono opacity-80">#{idx + 1}</span>
            </button>
          );
        })}
      </div>

      <div className="h-4 w-px bg-outline-variant/40 shrink-0 mx-1" />

      <ThemeToggle variant="icon" className="w-8 h-8 rounded-full text-xs shrink-0" />

      <button
        onClick={onOpenModal}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary-container text-secondary-fixed text-xs font-headline font-bold hover:bg-primary transition-colors shrink-0 shadow-xs"
        title="View all 13 screens directory"
      >
        <span className="material-symbols-outlined text-[16px]">grid_view</span>
        <span>All 13</span>
      </button>
    </div>
  );
};
