import React, { useState, useEffect } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '../context/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full' | 'dropdown';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'dropdown',
  className = ''
}) => {
  const { language, setLanguage, currentLanguageOption } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    <>
      <button
        id="language-selector-btn"
        type="button"
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30 shadow-xs text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/40 shrink-0 ${className}`}
        aria-haspopup="dialog"
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

      {/* Fixed Language Selection Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          <div className="relative w-full max-w-md bg-surface-container-lowest border border-outline-variant/40 rounded-3xl shadow-2xl p-5 z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-2xl">translate</span>
                <div>
                  <h3 className="text-base font-bold text-on-surface leading-tight">
                    Select Language / 语言 / Idioma
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    {SUPPORTED_LANGUAGES.length} Languages Available
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
                title="Close language picker"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto no-scrollbar pr-0.5">
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
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-secondary/15 border-secondary text-secondary shadow-xs font-bold ring-1 ring-secondary/40'
                        : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/30 text-on-surface'
                    }`}
                  >
                    <span className="text-2xl shrink-0" role="img" aria-label={lang.label}>
                      {lang.flag}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate leading-snug">
                        {lang.nativeLabel}
                      </p>
                      <p className="text-xs text-on-surface-variant truncate">{lang.label}</p>
                    </div>
                    {isSelected && (
                      <span className="material-symbols-outlined text-secondary text-xl font-bold shrink-0">
                        check_circle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
