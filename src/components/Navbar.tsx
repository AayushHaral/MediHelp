import React from 'react';
import { ScreenType } from '../types';
import { ALL_SCREENS } from '../data/mockData';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  onOpenScreenModal: () => void;
  activeZip: string;
  onChangeZip: (zip: string) => void;
  isEnterpriseMode: boolean;
  onToggleEnterprise: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onSelectScreen,
  onOpenScreenModal,
  activeZip,
  isEnterpriseMode,
  onToggleEnterprise
}) => {
  const currentMeta = ALL_SCREENS.find((s) => s.id === currentScreen) || ALL_SCREENS[0];

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/30 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelectScreen('catalog')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-container text-secondary-fixed flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-secondary-fixed text-2xl">local_pharmacy</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-lg tracking-tight text-on-surface">
                  Pharma<span className="text-secondary">Compare</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-secondary-container text-on-secondary-container">
                  OS 3.4
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-medium">Algorithmic Rx Clearinghouse</p>
            </div>
          </button>

          {/* Location Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant font-medium border border-outline-variant/20">
            <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
            <span>SF Bay Area, CA</span>
            <span className="font-mono text-on-surface font-semibold">{activeZip}</span>
          </div>
        </div>

        {/* Center: Quick Screen Navigator Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenScreenModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface text-sm font-semibold transition-colors border border-outline-variant/30 shadow-xs"
            title="Switch between all 13 application screens"
          >
            <span className="material-symbols-outlined text-[20px] text-secondary">grid_view</span>
            <span className="hidden sm:inline">Explore All 13 Screens</span>
            <span className="sm:hidden">Screens</span>
            <span className="px-1.5 py-0.2 bg-primary-container text-primary-fixed rounded text-xs font-mono">13</span>
          </button>

          {/* Quick Shortcuts */}
          <div className="hidden xl:flex items-center gap-1 ml-2 border-l border-outline-variant/30 pl-3">
            <button
              onClick={() => onSelectScreen('catalog')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                currentScreen === 'catalog'
                  ? 'bg-secondary text-white font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Rx Search
            </button>
            <button
              onClick={() => onSelectScreen('smart-routing')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                currentScreen === 'smart-routing'
                  ? 'bg-secondary text-white font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Routing AI
            </button>
            <button
              onClick={() => onSelectScreen('discount-card')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                currentScreen === 'discount-card'
                  ? 'bg-secondary text-white font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Rx Pass Card
            </button>
            <button
              onClick={() => onSelectScreen('teleconsult')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                currentScreen === 'teleconsult'
                  ? 'bg-secondary text-white font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Teleconsult MD
            </button>
          </div>
        </div>

        {/* Right Controls: Light/Dark Theme, Mode Toggle & Patient Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Light / Dark Mode Toggle */}
          <ThemeToggle variant="pill" className="hidden sm:inline-block" />
          <ThemeToggle variant="icon" className="sm:hidden" />

          {/* Mode Switcher */}
          <button
            onClick={onToggleEnterprise}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isEnterpriseMode
                ? 'bg-primary-container text-secondary-fixed border-secondary-fixed/40'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isEnterpriseMode ? 'admin_panel_settings' : 'storefront'}
            </span>
            <span>{isEnterpriseMode ? 'Enterprise OS' : 'Consumer Mode'}</span>
          </button>

          {/* Patient Card / Profile quick button */}
          <button
            onClick={() => onSelectScreen('patient-wallet')}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/30"
          >
            <div className="w-7 h-7 rounded-full bg-secondary text-white font-semibold text-xs flex items-center justify-center">
              SJ
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold leading-tight text-on-surface">Sarah J.</p>
              <p className="text-[10px] text-secondary font-mono leading-tight">BCBS Gold PPO</p>
            </div>
          </button>
        </div>
      </div>

      {/* Screen Sub-Banner & Breadcrumb */}
      <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-outline-variant/15 flex items-center justify-between text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-on-surface">{currentMeta.category}</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-secondary font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">{currentMeta.icon}</span>
            {currentMeta.title}
          </span>
          {currentMeta.badge && (
            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-secondary-container text-on-secondary-container">
              {currentMeta.badge}
            </span>
          )}
        </div>
        <p className="hidden md:block text-[11px] text-on-surface-variant/80 italic font-normal">
          {currentMeta.subtitle}
        </p>
      </div>
    </header>
  );
};
