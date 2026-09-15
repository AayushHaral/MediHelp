import React from 'react';
import { ScreenType } from '../types';
import { ALL_SCREENS } from '../data/mockData';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

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
  const { currentUser, isLoggedIn } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/30 px-3 sm:px-6 lg:px-8 py-2.5 transition-all w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
        {/* Top Row on Mobile / Main Row on Desktop */}
        <div className="flex items-center justify-between gap-2 w-full md:w-auto">
          {/* Brand / Logo */}
          <button
            onClick={() => onSelectScreen('catalog')}
            className="flex items-center gap-2 text-left group focus:outline-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-container text-secondary-fixed flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-secondary-fixed text-xl sm:text-2xl">local_pharmacy</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-headline font-bold text-base sm:text-lg tracking-tight text-on-surface whitespace-nowrap">
                  Pharma<span className="text-secondary">Compare</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-secondary-container text-on-secondary-container shrink-0">
                  OS 3.4
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant font-medium hidden sm:block">
                {t('brand.tagline', 'Algorithmic Rx Clearinghouse')}
              </p>
            </div>
          </button>

          {/* Location Badge (Tablet & Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant font-medium border border-outline-variant/20 shrink-0">
            <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
            <span>{t('nav.location', 'SF Bay Area, CA')}</span>
            <span className="font-mono text-on-surface font-semibold">{activeZip}</span>
          </div>

          {/* Mobile Profile / Sign In button */}
          <div className="md:hidden flex items-center gap-1.5 shrink-0">
            {isLoggedIn && currentUser ? (
              <button
                onClick={() => onSelectScreen('auth')}
                className="flex items-center gap-1.5 p-1 pr-2.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/30"
                title="View Account Profile"
              >
                <div className="w-7 h-7 rounded-full bg-secondary text-white font-semibold text-xs flex items-center justify-center">
                  {currentUser.avatarInitials}
                </div>
                <span className="text-xs font-semibold text-on-surface max-w-[75px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => onSelectScreen('auth')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-white text-xs font-semibold shadow-xs hover:bg-secondary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">lock</span>
                <span>{t('auth.signIn', 'Sign In')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Upside Controls Slide Bar: Scrollable horizontal strip for Screens, Lang, Theme, Login & Modes */}
        <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none py-1 px-1 flex-nowrap shrink-0 touch-pan-x scroll-smooth rounded-xl bg-surface-container-low/40 md:bg-transparent border border-outline-variant/20 md:border-none">
          {/* Quick Screen Navigator Button */}
          <button
            onClick={onOpenScreenModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs sm:text-sm font-semibold transition-colors border border-outline-variant/30 shadow-xs shrink-0 whitespace-nowrap"
            title={`Switch between all ${ALL_SCREENS.length} application screens`}
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-secondary">grid_view</span>
            <span>{t('nav.screensShort', 'Screens')}</span>
            <span className="px-1.5 py-0.2 bg-primary-container text-primary-fixed rounded text-xs font-mono font-bold">
              {ALL_SCREENS.length}
            </span>
          </button>

          {/* Multilanguage Selector */}
          <div className="shrink-0">
            <LanguageSelector />
          </div>

          {/* Light / Dark Mode Toggle */}
          <div className="shrink-0">
            <ThemeToggle variant="pill" className="hidden sm:inline-block" />
            <ThemeToggle variant="icon" className="sm:hidden" />
          </div>

          {/* Senior Citizen Accessibility Toggle */}
          <button
            onClick={toggleSeniorMode}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-xs shrink-0 whitespace-nowrap ${
              isSeniorMode
                ? 'bg-secondary text-white border-secondary ring-1 ring-secondary'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/30'
            }`}
            title="Toggle Senior Citizen Accessibility Mode"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isSeniorMode ? 'elderly' : 'accessibility_new'}
            </span>
            <span>{t('nav.seniorMode', 'Senior')}</span>
          </button>

          {/* Mode Switcher */}
          <button
            onClick={onToggleEnterprise}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border shrink-0 whitespace-nowrap ${
              isEnterpriseMode
                ? 'bg-primary-container text-secondary-fixed border-secondary-fixed/40'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {isEnterpriseMode ? 'admin_panel_settings' : 'storefront'}
            </span>
            <span>
              {isEnterpriseMode
                ? t('nav.enterpriseMode', 'Enterprise OS')
                : t('nav.consumerMode', 'Consumer')}
            </span>
          </button>

          {/* Patient Card / Auth button (Desktop / Tablet view) */}
          <div className="hidden md:block shrink-0">
            {isLoggedIn && currentUser ? (
              <button
                onClick={() => onSelectScreen('auth')}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/30"
                title="View Account Profile & Session"
              >
                <div className="w-7 h-7 rounded-full bg-secondary text-white font-semibold text-xs flex items-center justify-center">
                  {currentUser.avatarInitials}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold leading-tight text-on-surface truncate max-w-[90px]">
                    {currentUser.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-secondary font-mono leading-tight truncate max-w-[90px]">
                    {currentUser.role === 'caregiver' ? 'Caregiver' : currentUser.insuranceName ? currentUser.insuranceName.split(' ')[0] : 'Member'}
                  </p>
                </div>
              </button>
            ) : (
              <button
                onClick={() => onSelectScreen('auth')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-white text-xs font-semibold shadow-xs hover:bg-secondary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>{t('auth.signIn', 'Sign In')}</span>
              </button>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="hidden xl:flex items-center gap-1 pl-2 border-l border-outline-variant/30 shrink-0">
            <button
              onClick={() => onSelectScreen('catalog')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                currentScreen === 'catalog'
                  ? 'bg-secondary text-white font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {t('nav.rxSearch', 'Rx Search')}
            </button>
            <button
              onClick={() => onSelectScreen('smart-routing')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                currentScreen === 'smart-routing'
                  ? 'bg-secondary text-white font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {t('nav.routingAi', 'Routing AI')}
            </button>
            <button
              onClick={() => onSelectScreen('discount-card')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                currentScreen === 'discount-card'
                  ? 'bg-secondary text-white font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {t('nav.rxPass', 'Rx Pass')}
            </button>
            <button
              onClick={() => onSelectScreen('teleconsult')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                currentScreen === 'teleconsult'
                  ? 'bg-secondary text-white font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {t('nav.teleconsult', 'Teleconsult')}
            </button>
          </div>
        </div>
      </div>

      {/* Screen Sub-Banner & Breadcrumb */}
      <div className="max-w-7xl mx-auto mt-2 pt-1.5 border-t border-outline-variant/15 flex items-center justify-between text-xs text-on-surface-variant">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
          <span className="font-semibold text-on-surface text-[11px] sm:text-xs">{currentMeta.category}</span>
          <span className="material-symbols-outlined text-[13px]">chevron_right</span>
          <span className="text-secondary font-semibold flex items-center gap-1 text-[11px] sm:text-xs">
            <span className="material-symbols-outlined text-[15px]">{currentMeta.icon}</span>
            {currentMeta.title}
          </span>
          {currentMeta.badge && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-secondary-container text-on-secondary-container">
              {currentMeta.badge}
            </span>
          )}
        </div>
        <p className="hidden md:block text-[11px] text-on-surface-variant/80 italic font-normal truncate">
          {currentMeta.subtitle}
        </p>
      </div>
    </header>
  );
};
