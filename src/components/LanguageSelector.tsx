import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '../context/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full' | 'dropdown';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'dropdown',
  className = ''
}) => {
  const { language, setLanguage, currentLanguageOption, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (variant === 'full') {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 ${className}`}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-secondary/15 border-secondary text-on-surface shadow-xs font-bold'
                  : 'bg-surface-container hover:bg-surface-container-high border-outline-variant/30 text-on-surface'
              }`}
            >
              <span className="text-2xl" role="img" aria-label={lang.label}>
                {lang.flag}
              </span>
              <div>
                <span className="text-sm block font-semibold leading-tight">{lang.nativeLabel}</span>
                <span className="text-xs text-on-surface-variant block">{lang.label}</span>
              </div>
              {isSelected && (
                <span className="material-symbols-outlined text-secondary ml-auto text-lg">check_circle</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      <button
        id="language-selector-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30 shadow-xs text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/40"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title="Choose language / 选择语言 / Seleccionar idioma"
      >
        <span className="text-base" role="img" aria-label={currentLanguageOption.label}>
          {currentLanguageOption.flag}
        </span>
        <span className="hidden sm:inline font-medium">{currentLanguageOption.nativeLabel}</span>
        <span className="sm:hidden font-medium uppercase">{currentLanguageOption.code}</span>
        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-56 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
          role="listbox"
        >
          <div className="px-3 py-1.5 border-b border-outline-variant/20 mb-1 flex items-center justify-between text-[11px] text-on-surface-variant font-semibold">
            <span>Select Language / 语言</span>
            <span className="text-secondary font-mono">6 Languages</span>
          </div>

          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-left transition-colors ${
                  isSelected
                    ? 'bg-secondary/15 text-secondary font-bold'
                    : 'text-on-surface hover:bg-surface-container'
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <span className="text-lg shrink-0" role="img" aria-label={lang.label}>
                  {lang.flag}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface truncate">{lang.nativeLabel}</p>
                  <p className="text-[10px] text-on-surface-variant truncate">{lang.label}</p>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-secondary text-base shrink-0 font-bold">
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
