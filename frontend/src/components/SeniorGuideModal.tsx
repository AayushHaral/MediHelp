import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface SeniorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SeniorGuideModal: React.FC<SeniorGuideModalProps> = ({ isOpen, onClose }) => {
  const { t, speakText, isSpeaking, stopSpeaking } = useLanguage();

  if (!isOpen) return null;

  const handleReadGuide = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    const fullGuideText = `${t('modal.seniorGuideTitle')}. ${t('modal.seniorTip1Title')}: ${t('modal.seniorTip1Desc')}. ${t('modal.seniorTip2Title')}: ${t('modal.seniorTip2Desc')}. ${t('modal.seniorTip3Title')}: ${t('modal.seniorTip3Desc')}`;
    speakText(fullGuideText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/40 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-on-surface"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl text-secondary">elderly</span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-lg sm:text-xl text-on-surface leading-tight">
                {t('modal.seniorGuideTitle')}
              </h2>
              <p className="text-xs text-secondary font-semibold mt-0.5">
                Medicare Part D • Cash Clearinghouse • Home Delivery
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Audio listen helper for seniors */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/10 border border-secondary/20">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary text-2xl">volume_up</span>
              <div>
                <span className="text-xs font-bold text-on-surface block">
                  {isSpeaking ? t('senior.voiceActive') : t('senior.voiceReader')}
                </span>
                <span className="text-[11px] text-on-surface-variant block">
                  Click to listen to this guide in your language
                </span>
              </div>
            </div>
            <button
              onClick={handleReadGuide}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                isSpeaking
                  ? 'bg-error text-white animate-pulse'
                  : 'bg-secondary text-white hover:bg-secondary/90'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSpeaking ? 'stop_circle' : 'play_circle'}
              </span>
              <span>{isSpeaking ? t('senior.voiceStop') : t('senior.voiceReader')}</span>
            </button>
          </div>

          {/* Tip 1 */}
          <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant/20 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <h3 className="font-headline font-bold text-sm sm:text-base text-on-surface">
                {t('modal.seniorTip1Title')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed pl-9">
              {t('modal.seniorTip1Desc')}
            </p>
          </div>

          {/* Tip 2 */}
          <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant/20 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <h3 className="font-headline font-bold text-sm sm:text-base text-on-surface">
                {t('modal.seniorTip2Title')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed pl-9">
              {t('modal.seniorTip2Desc')}
            </p>
          </div>

          {/* Tip 3 */}
          <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant/20 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <h3 className="font-headline font-bold text-sm sm:text-base text-on-surface">
                {t('modal.seniorTip3Title')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed pl-9">
              {t('modal.seniorTip3Desc')}
            </p>
          </div>

          {/* Phone call prompt */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-600 text-3xl">support_agent</span>
              <div>
                <p className="text-xs font-bold text-on-surface">Free Live Pharmacist Assistance</p>
                <p className="text-[11px] text-on-surface-variant">Available Monday-Sunday 24/7 for Senior Citizens</p>
              </div>
            </div>
            <a
              href="tel:18006334227"
              className="px-4 py-2 rounded-xl bg-amber-600 text-white font-headline font-bold text-xs hover:bg-amber-700 transition-colors inline-flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              <span>1-800-633-4227</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-container border-t border-outline-variant/30 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-secondary text-white font-headline font-bold text-xs hover:bg-secondary/90 transition-colors ml-auto shadow-xs"
          >
            {t('modal.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
