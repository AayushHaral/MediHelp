import React from 'react';
import { ScreenType } from '../types';
import { ALL_SCREENS } from '../data/mockData';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

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
  const { t, isSeniorMode, toggleSeniorMode } = useLanguage();

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
              <p className="text-xs text-on-surface-variant font-medium">
                {t('brand.tagline', 'Algorithmic Rx Clearinghouse')}
              </p>
            </div>
          </button>

          {/* Location Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant font-medium border border-outline-variant/20">
            <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
            <span>{t('nav.location', 'SF Bay Area, CA')}</span>
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
            <span className="hidden sm:inline">{t('nav.screens', 'Explore All 13 Screens')}</span>
            <span className="sm:hidden">{t('nav.screensShort', 'Screens')}</span>
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
              {t('nav.rxSearch', 'Rx Search')}
            </button>
            <button
              onClick={() => onSelectScreen('smart-routing')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                currentScreen === 'smart-routing'
                  ? 'bg-secondary text-white font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {t('nav.routingAi', 'Routing AI')}
            </button>
            <button
              onClick={() => onSelectScreen('discount-card')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                currentScreen === 'discount-card'
                  ? 'bg-secondary text-white font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {t('nav.rxPass', 'Rx Pass Card')}
            </button>
            <button
              onClick={() => onSelectScreen('teleconsult')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                currentScreen === 'teleconsult'
                  ? 'bg-secondary text-white font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {t('nav.teleconsult', 'Teleconsult MD')}
            </button>
          </div>
        </div>

        {/* Right Controls: Senior Mode, Language, Light/Dark Theme, Mode Toggle & Patient Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Senior Citizen Mode Quick Toggle Button */}
          <button
            onClick={toggleSeniorMode}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-xs ${
              isSeniorMode
                ? 'bg-secondary text-white border-secondary ring-1 ring-secondary'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/30'
            }`}
            title="Toggle Senior Citizen Accessibility Mode (Large text & audio)"
          >
            <span className="material-symbols-outlined text-[17px]">
              {isSeniorMode ? 'elderly' : 'accessibility_new'}
            </span>
            <span>{t('nav.seniorMode', 'Senior Mode')}</span>
          </button>

          {/* Multilanguage Selector */}
          <LanguageSelector />

          {/* Light / Dark Mode Toggle */}
          <ThemeToggle variant="pill" className="hidden lg:inline-block" />
          <ThemeToggle variant="icon" className="lg:hidden" />

          {/* Mode Switcher */}
          <button
            onClick={onToggleEnterprise}
            className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isEnterpriseMode
                ? 'bg-primary-container text-secondary-fixed border-secondary-fixed/40'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isEnterpriseMode ? 'admin_panel_settings' : 'storefront'}
            </span>
            <span>
              {isEnterpriseMode
                ? t('nav.enterpriseMode', 'Enterprise OS')
                : t('nav.consumerMode', 'Consumer Mode')}
            </span>
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
