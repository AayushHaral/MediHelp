import React, { useState, useRef, useEffect } from 'react';
import { useTheme, Theme } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'pill' | 'segmented' | 'switch';
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'icon',
  showLabel = false,
  className = ''
}) => {
  const { theme, isDark, setTheme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Segmented control (Light / System / Dark)
  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl bg-surface-container border border-outline-variant/30 text-xs font-semibold ${className}`}
        role="group"
        aria-label="Theme selection"
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            theme === 'light'
              ? 'bg-surface-container-lowest text-secondary shadow-xs font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          title="Light mode"
        >
          <span className="material-symbols-outlined text-[16px]">light_mode</span>
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('system')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            theme === 'system'
              ? 'bg-surface-container-lowest text-secondary shadow-xs font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          title="Follow system OS setting"
        >
          <span className="material-symbols-outlined text-[16px]">settings_brightness</span>
          <span>System</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            theme === 'dark'
              ? 'bg-surface-container-lowest text-secondary shadow-xs font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          title="Dark mode"
        >
          <span className="material-symbols-outlined text-[16px]">dark_mode</span>
          <span>Dark</span>
        </button>
      </div>
    );
  }

  // Switch control
  if (variant === 'switch') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {showLabel && (
          <span className="text-xs font-semibold text-on-surface select-none cursor-pointer" onClick={toggleTheme}>
            {isDark ? 'Dark Theme' : 'Light Theme'}
          </span>
        )}
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          onClick={toggleTheme}
          aria-label="Toggle light and dark mode"
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary/40 ${
            isDark ? 'bg-secondary' : 'bg-surface-container-highest'
          }`}
        >
          <span className="sr-only">Toggle dark mode</span>
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-surface-container-lowest shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
              isDark ? 'translate-x-5 text-secondary' : 'translate-x-0 text-outline'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] font-bold">
              {isDark ? 'dark_mode' : 'light_mode'}
            </span>
          </span>
        </button>
      </div>
    );
  }

  // Pill variant with quick toggle and optional dropdown trigger
  if (variant === 'pill') {
    return (
      <div className={`relative inline-block ${className}`} ref={menuRef}>
        <div className="flex items-center rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface shadow-xs transition-colors">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold hover:text-secondary transition-colors"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          >
            <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${isDark ? 'text-amber-300 rotate-12' : 'text-amber-600'}`}>
              {isDark ? 'dark_mode' : 'light_mode'}
            </span>
            <span>{isDark ? 'Dark' : 'Light'}</span>
          </button>
          <div className="h-4 w-px bg-outline-variant/30" />
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="px-1.5 py-1.5 text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Theme options menu"
            aria-expanded={isMenuOpen}
          >
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
            <button
              onClick={() => { setTheme('light'); setIsMenuOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors ${
                theme === 'light' ? 'bg-secondary/15 text-secondary' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-amber-500">light_mode</span>
              <span>Light Mode</span>
            </button>
            <button
              onClick={() => { setTheme('dark'); setIsMenuOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors ${
                theme === 'dark' ? 'bg-secondary/15 text-secondary' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-teal-400">dark_mode</span>
              <span>Dark Mode</span>
            </button>
            <button
              onClick={() => { setTheme('system'); setIsMenuOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors ${
                theme === 'system' ? 'bg-secondary/15 text-secondary' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">settings_brightness</span>
              <span>System (Auto)</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default: Icon-only button with smooth rotation & tooltip
  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={toggleTheme}
      className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30 shadow-xs focus:outline-none focus:ring-2 focus:ring-secondary/40 group ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Current: ${isDark ? 'Dark' : 'Light'} Mode (Click to toggle)`}
    >
      <span
        className={`material-symbols-outlined text-[20px] transition-all duration-300 transform ${
          isDark
            ? 'text-secondary-fixed rotate-0 scale-100'
            : 'text-amber-600 rotate-0 scale-100 group-hover:rotate-45'
        }`}
      >
        {isDark ? 'dark_mode' : 'light_mode'}
      </span>
      {showLabel && (
        <span className="ml-2 text-xs font-semibold hidden md:inline">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};
