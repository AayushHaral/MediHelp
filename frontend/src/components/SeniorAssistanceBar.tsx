import React, { useState } from 'react';
import { useLanguage, TextSize } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { SeniorGuideModal } from './SeniorGuideModal';

export const SeniorAssistanceBar: React.FC = () => {
  const {
    isSeniorMode,
    toggleSeniorMode,
    textSize,
    setTextSize,
    isSpeaking,
    stopSpeaking,
    t,
    currentLanguageOption
  } = useLanguage();

  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <>
      <div className="bg-primary-container text-on-primary-container border-b border-outline-variant/30 py-2 px-4 lg:px-8 transition-all">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Senior Mode indicator & Badge */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={toggleSeniorMode}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs ${
                isSeniorMode
                  ? 'bg-secondary text-white ring-2 ring-secondary/50'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
              }`}
              title="Toggle Senior Citizen High-Legibility Mode"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSeniorMode ? 'elderly' : 'accessibility_new'}
              </span>
              <span>{t('nav.seniorMode')}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isSeniorMode ? 'bg-emerald-300 animate-pulse' : 'bg-outline/50'
                }`}
              />
            </button>

            <span className="hidden md:inline text-on-primary-container/80 text-[11px] font-medium">
              {currentLanguageOption.seniorGreeting}
            </span>

            {/* Speaking animation indicator */}
            {isSpeaking && (
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary-fixed text-[11px] font-semibold animate-pulse border border-secondary/30">
                <span className="material-symbols-outlined text-[15px] animate-bounce">volume_up</span>
                <span>{t('senior.voiceActive')}</span>
                <button
                  onClick={stopSpeaking}
                  className="ml-1 hover:underline text-white font-bold"
                  title="Stop audio"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Right: Accessibility Controls (Text Size + Language + Senior Guide + Helpline) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap ml-auto">
            {/* Text Zoom Controls */}
            <div className="flex items-center rounded-lg bg-surface-container-lowest/15 p-0.5 border border-white/10">
              <span className="px-2 text-[10px] font-bold text-on-primary-container uppercase hidden sm:inline">
                {t('senior.textSize')}
              </span>
              <button
                type="button"
                onClick={() => setTextSize('normal')}
                className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                  textSize === 'normal'
                    ? 'bg-secondary text-white'
                    : 'text-on-primary-container hover:text-white'
                }`}
                title="Normal text size (100%)"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setTextSize('large')}
                className={`px-2 py-0.5 rounded text-sm font-bold transition-colors ${
                  textSize === 'large'
                    ? 'bg-secondary text-white'
                    : 'text-on-primary-container hover:text-white'
                }`}
                title="Large text size (115%)"
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setTextSize('xlarge')}
                className={`px-2 py-0.5 rounded text-base font-extrabold transition-colors ${
                  textSize === 'xlarge'
                    ? 'bg-secondary text-white'
                    : 'text-on-primary-container hover:text-white'
                }`}
                title="Extra large text size (130%)"
              >
                A++
              </button>
            </div>

            {/* Language Switcher */}
            <LanguageSelector />

            {/* Senior Guide Button */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-lowest/15 hover:bg-white/20 text-white font-semibold transition-colors border border-white/10 text-xs"
              title="Senior Prescription & Medicare Guide"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-300">help_outline</span>
              <span className="hidden sm:inline">{t('senior.howItWorks')}</span>
            </button>

            {/* 24/7 Helpline */}
            <a
              href="tel:18006334227"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary text-white font-bold text-xs hover:bg-secondary/90 transition-colors shadow-xs"
              title="Toll-free Medicare Helpline for Seniors: 1-800-633-4227"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>1-800-MEDICARE</span>
            </a>
          </div>
        </div>
      </div>

      <SeniorGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </>
  );
};
