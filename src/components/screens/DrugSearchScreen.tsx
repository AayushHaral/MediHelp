import React, { useState, useMemo } from 'react';
import { DrugItem, ScreenType } from '../../types';
import { MOCK_DRUGS } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';

interface DrugSearchScreenProps {
  onSelectDrug: (drug: DrugItem) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const DrugSearchScreen: React.FC<DrugSearchScreenProps> = ({ onSelectDrug, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'generic' | 'mail-order' | 'local-fast'>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const { t, speakText, isSpeaking, stopSpeaking } = useLanguage();

  const drugClasses = useMemo(() => {
    const classes = Array.from(new Set(MOCK_DRUGS.map((d) => d.drugClass)));
    return ['all', ...classes];
  }, []);

  const filteredDrugs = useMemo(() => {
    return MOCK_DRUGS.filter((drug) => {
      const matchesQuery =
        drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drug.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drug.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drug.drugClass.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesQuery) return false;

      if (selectedClass !== 'all' && drug.drugClass !== selectedClass) return false;

      if (selectedFilter === 'generic' && !drug.isGenericAvailable) return false;
      if (selectedFilter === 'mail-order') {
        const hasMail = drug.quotes.some((q) => q.chainType === 'mail-order');
        if (!hasMail) return false;
      }
      if (selectedFilter === 'local-fast') {
        const hasFast = drug.quotes.some((q) => q.stockStatus === 'Ready in 15 min');
        if (!hasFast) return false;
      }

      return true;
    });
  }, [searchQuery, selectedFilter, selectedClass]);

  const handleSpeakDrug = (drug: DrugItem) => {
    const bestQuote = drug.quotes.find((q) => q.bestValue) || drug.quotes[0];
    const text = `${drug.name}. ${drug.selectedStrength}, ${drug.selectedForm}, ${drug.selectedQuantity} count. ${t('card.lowestCash')}: $${drug.lowestPrice.toFixed(2)} ${t('card.at')} ${bestQuote.pharmacyName}. ${t('card.save')} ${drug.typicalSavingsPercent}%.`;
    speakText(text);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Hero Search Box */}
      <div className="relative rounded-2xl bg-gradient-to-br from-primary-container via-surface-container-highest to-surface-container-high p-6 md:p-8 border border-outline-variant/30 text-white overflow-hidden shadow-sm">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-white text-xs font-semibold tracking-wide shadow-xs">
            <span className="material-symbols-outlined text-[16px]">price_check</span>
            <span>{t('search.badge')}</span>
          </div>

          <h1 className="font-headline font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-tight">
            {t('search.title')}{' '}
            <span className="text-secondary-fixed">{t('search.pharmacyCount')}</span>
          </h1>

          <p className="text-sm md:text-base text-inverse-on-surface/80 font-normal">
            {t('search.subtitle')}
          </p>

          {/* Search Input Bar */}
          <div className="pt-2">
            <div className="relative flex items-center bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 p-1.5 transition-all focus-within:ring-2 focus-within:ring-secondary">
              <span className="material-symbols-outlined text-outline ml-3 text-2xl">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full px-3 py-2.5 text-on-surface text-sm md:text-base focus:outline-none placeholder:text-outline/70 bg-transparent font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 text-outline hover:text-on-surface mr-1"
                >
                  <span className="material-symbols-outlined text-lg">cancel</span>
                </button>
              )}
              <button
                onClick={() => {}}
                className="px-5 py-2.5 bg-secondary text-white font-headline font-semibold text-sm rounded-lg hover:bg-secondary/90 transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
              >
                <span>{t('search.btn')}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            {/* Quick Popular Drug Pills */}
            <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
              <span className="text-inverse-on-surface/70 font-medium">{t('search.trending')}</span>
              {['Atorvastatin', 'Ozempic', 'Metformin', 'Adderall XR', 'Sertraline', 'Albuterol'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors font-medium text-[11px]"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-on-surface uppercase tracking-wider font-mono mr-1">
            {t('search.filter')}
          </span>
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedFilter === 'all'
                ? 'bg-secondary text-white'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {t('search.allMeds')}
          </button>
          <button
            onClick={() => setSelectedFilter('generic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedFilter === 'generic'
                ? 'bg-secondary text-white'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {t('search.genericOnly')}
          </button>
          <button
            onClick={() => setSelectedFilter('local-fast')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedFilter === 'local-fast'
                ? 'bg-secondary text-white'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {t('search.fastPickup')}
          </button>
          <button
            onClick={() => setSelectedFilter('mail-order')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedFilter === 'mail-order'
                ? 'bg-secondary text-white'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {t('search.mailOrder')}
          </button>
        </div>

        {/* Drug Class Filter dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-on-surface-variant font-medium">{t('search.classLabel')}</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface font-medium border border-outline-variant/30 text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
          >
            <option value="all">{t('search.allClasses')}</option>
            {drugClasses.filter((c) => c !== 'all').map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Drug Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
          <span>
            {t('search.showing')} <strong className="text-on-surface font-mono">{filteredDrugs.length}</strong> {t('search.matchingMeds')}
          </span>
          <div className="flex items-center gap-2">
            <span>{t('search.pricesCalibrated')} <strong className="text-on-surface">SF 94103</strong></span>
            <button
              onClick={() => onNavigate('smart-routing')}
              className="text-secondary font-semibold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">alt_route</span>
              {t('search.optimizeCart')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredDrugs.map((drug) => {
            const bestQuote = drug.quotes.find((q) => q.bestValue) || drug.quotes[0];

            return (
              <div
                key={drug.id}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 md:p-6 transition-all hover:border-secondary/40 hover:shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 group"
              >
                {/* Left Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-surface-container overflow-hidden shrink-0 border border-outline-variant/30 relative">
                    <img
                      src={drug.imageUrl}
                      alt={drug.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {drug.controlledSubstance && (
                      <span className="absolute bottom-1 right-1 px-1 rounded bg-amber-500 text-white font-mono text-[9px] font-bold">
                        C-II
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-headline font-bold text-lg sm:text-xl text-on-surface">
                        {drug.name}
                      </h2>

                      {/* Senior Voice Pronounce Button */}
                      <button
                        type="button"
                        onClick={() => handleSpeakDrug(drug)}
                        className="p-1.5 rounded-lg bg-surface-container hover:bg-secondary/20 text-secondary transition-colors"
                        title={t('card.listen')}
                        aria-label={`${t('card.listen')}: ${drug.name}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">volume_up</span>
                      </button>

                      {drug.brandName !== drug.genericName && (
                        <span className="text-xs text-on-surface-variant font-medium">
                          ({t('card.genericFor')} <span className="font-semibold">{drug.brandName}</span>)
                        </span>
                      )}
                      {drug.isGenericAvailable ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-secondary-container text-on-secondary-container">
                          {t('card.genericAvailable')}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container-high text-on-surface-variant">
                          {t('card.brandExclusive')}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-on-surface-variant line-clamp-2">
                      {drug.description}
                    </p>

                    <div className="flex items-center gap-3 pt-1 flex-wrap text-xs text-on-surface-variant font-mono">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-secondary">tune</span>
                        {t('card.standard')} {drug.selectedStrength}
                      </span>
                      <span>•</span>
                      <span>{t('card.form')} {drug.selectedForm}</span>
                      <span>•</span>
                      <span>{t('card.qty')} {drug.selectedQuantity}</span>
                    </div>

                    {/* Pharmacy price ticker chips */}
                    <div className="pt-2 flex items-center gap-2 flex-wrap">
                      {drug.quotes.slice(0, 3).map((q) => (
                        <div
                          key={q.pharmacyId}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-xs border border-outline-variant/20"
                        >
                          <span className="font-medium text-on-surface">{q.pharmacyName.split('#')[0].split('(')[0]}</span>
                          <span className="font-mono font-bold text-secondary">${q.discountPrice.toFixed(2)}</span>
                        </div>
                      ))}
                      {drug.quotes.length > 3 && (
                        <span className="text-xs text-on-surface-variant font-medium">
                          +{drug.quotes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Price Card & CTAs */}
                <div className="w-full lg:w-72 shrink-0 bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                        {t('card.lowestCash')}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {t('card.save')} {drug.typicalSavingsPercent}%
                      </span>
                    </div>

                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-headline font-extrabold text-3xl text-secondary">
                        ${drug.lowestPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-outline line-through font-mono">
                        ${drug.averageRetailPrice.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      {t('card.at')} <strong className="text-on-surface">{bestQuote.pharmacyName}</strong> ({bestQuote.distance})
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => onSelectDrug(drug)}
                      className="w-full py-2.5 px-4 rounded-lg bg-secondary text-white font-headline font-semibold text-xs tracking-wide hover:bg-secondary/90 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">tune</span>
                      <span>{t('card.configure')}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectDrug(drug);
                          onNavigate('discount-card');
                        }}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-medium text-xs border border-outline-variant/30 transition-colors text-center"
                      >
                        {t('card.digitalPass')}
                      </button>
                      <button
                        onClick={() => onNavigate('smart-routing')}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-medium text-xs border border-outline-variant/30 transition-colors text-center"
                      >
                        {t('card.splitRoute')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

