import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const updatePosition = () => {
    const mobile = window.innerWidth < 640;
    setIsMobile(mobile);
    if (buttonRef.current && !mobile) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 280;
      let left = rect.right - dropdownWidth;
      if (left < 16) left = 16;
      if (left + dropdownWidth > window.innerWidth - 16) {
        left = window.innerWidth - dropdownWidth - 16;
      }
      setPopoverPos({
        top: rect.bottom + 8,
        left: left
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

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
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2.5 ${className}`}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-secondary/15 border-secondary text-on-surface shadow-xs font-bold ring-1 ring-secondary/40'
                  : 'bg-surface-container hover:bg-surface-container-high border-outline-variant/30 text-on-surface'
              }`}
            >
              <span className="text-2xl shrink-0" role="img" aria-label={lang.label}>
                {lang.flag}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-sm block font-semibold leading-tight text-on-surface truncate">
                  {lang.nativeLabel}
                </span>
                <span className="text-xs text-on-surface-variant block truncate">{lang.label}</span>
              </div>
              {isSelected && (
                <span className="material-symbols-outlined text-secondary ml-auto text-lg font-bold shrink-0">
                  check_circle
                </span>
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
        ref={buttonRef}
        id="language-selector-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30 shadow-xs text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/40 shrink-0 ${className}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Select Language / 语言 / Idioma"
      >
        <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">translate</span>
        <span className="hidden sm:inline font-medium">{currentLanguageOption.nativeLabel}</span>
        <span className="sm:hidden font-bold uppercase text-[11px] tracking-wide">{currentLanguageOption.code}</span>
        <span className={`material-symbols-outlined text-[14px] text-on-surface-variant shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Language Dropdown Popover / Modal via Portal */}
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-50">
            {/* Backdrop click to close */}
            <div
              className="fixed inset-0 bg-black/40 sm:bg-black/20 backdrop-blur-xs transition-opacity duration-150"
              onClick={() => setIsOpen(false)}
            />

            {!isMobile ? (
              /* Desktop Anchored Dropdown directly below language button */
              <div
                style={{ top: `${popoverPos.top}px`, left: `${popoverPos.left}px` }}
                className="fixed z-50 w-72 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-1 max-h-[80vh] overflow-y-auto"
              >
                <div className="px-3 py-2 border-b border-outline-variant/20 flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-lg">translate</span>
                    <span className="text-xs font-bold text-on-surface">Select Language</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-mono">
                    {SUPPORTED_LANGUAGES.length} Options
                  </span>
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
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-secondary/15 border-secondary/50 text-secondary font-bold shadow-xs'
                          : 'bg-surface-container-low hover:bg-surface-container border-transparent text-on-surface'
                      }`}
                    >
                      <span className="text-xl shrink-0" role="img" aria-label={lang.label}>
                        {lang.flag}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-on-surface truncate leading-tight">
                          {lang.nativeLabel}
                        </p>
                        <p className="text-[10px] text-on-surface-variant truncate">{lang.label}</p>
                      </div>
                      {isSelected && (
                        <span className="material-symbols-outlined text-secondary text-base font-bold shrink-0">
                          check_circle
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Mobile Centered Popover Modal */
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="relative my-auto w-[90vw] max-w-sm bg-surface-container-lowest border border-outline-variant/40 rounded-3xl shadow-2xl p-4 z-10 animate-in zoom-in-95 duration-150 max-h-[80vh] flex flex-col">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-xl">translate</span>
                      <div>
                        <h3 className="text-sm font-bold text-on-surface leading-tight">
                          Select Language / 语言 / Idioma
                        </h3>
                        <p className="text-[11px] text-on-surface-variant">
                          {SUPPORTED_LANGUAGES.length} Languages Available
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="w-7 h-7 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors shrink-0"
                      title="Close language picker"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar pr-0.5 flex-1">
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
                          <span className="text-xl shrink-0" role="img" aria-label={lang.label}>
                            {lang.flag}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-on-surface truncate leading-snug">
                              {lang.nativeLabel}
                            </p>
                            <p className="text-[11px] text-on-surface-variant truncate">{lang.label}</p>
                          </div>
                          {isSelected && (
                            <span className="material-symbols-outlined text-secondary text-lg font-bold shrink-0">
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
          </div>,
          document.body
        )}
    </>
  );
};
