import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdPlacementKey } from '../types';
import {
  isConfiguredAdUnitSlotId,
  isValidAdSenseClientId,
  shouldShowAdsForUser,
} from '../utils/adsense';
import { Info, Sparkles, X } from 'lucide-react';

interface GoogleAdSenseBannerProps {
  placement: Exclude<AdPlacementKey, 'rewarded'>;
  variant?: 'horizontal' | 'sidebar' | 'compact';
  className?: string;
}

export const GoogleAdSenseBanner: React.FC<GoogleAdSenseBannerProps> = ({
  placement,
  variant = 'horizontal',
  className = '',
}) => {
  const { currentUser, isAuthenticated, adSenseConfig, setIsSubModalOpen, language, allLessons, allModules, allProjects } = useApp();
  const isEn = language === 'en';
  const insRef = useRef<HTMLModElement | null>(null);
  const pushedSlotRef = useRef<string>('');
  const [dismissedInView, setDismissedInView] = useState(false);

  const shouldRender = shouldShowAdsForUser(currentUser, isAuthenticated, adSenseConfig, placement);
  const slotId = adSenseConfig.slots[placement] || '';
  const clientId = adSenseConfig.clientId || 'ca-pub-4030062340198648';
  const hasRealSlotUnit = isValidAdSenseClientId(clientId) && isConfiguredAdUnitSlotId(slotId);

  useEffect(() => {
    if (!shouldRender || dismissedInView || !hasRealSlotUnit) return;
    const key = `${clientId}:${slotId}:${placement}`;
    if (pushedSlotRef.current === key) return;

    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && insRef.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushedSlotRef.current = key;
        }
      } catch {
        // Ignore blocked AdSense script environments (e.g. adblockers / offline)
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [shouldRender, dismissedInView, hasRealSlotUnit, clientId, slotId, placement]);

  if (!shouldRender || dismissedInView) {
    return null;
  }

  if (variant === 'sidebar') {
    return (
      <div
        data-testid={`adsense-banner-${placement}`}
        className={`rounded-xl border border-slate-800/90 bg-slate-950/90 p-3 space-y-2 relative overflow-hidden ${className}`}
      >
        <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400">
          <span className="inline-flex items-center gap-1 font-mono uppercase tracking-wider text-slate-400">
            <Info className="h-3 w-3 text-emerald-400 shrink-0" />
            <span>
              {hasRealSlotUnit
                ? isEn
                  ? 'Ad • AdSense'
                  : 'Reklama • AdSense'
                : isEn
                  ? 'Open Edition'
                  : 'Edycja Otwarta'}
            </span>
          </span>
          <button
            type="button"
            onClick={() => setIsSubModalOpen(true)}
            className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            Info
          </button>
        </div>

        {hasRealSlotUnit ? (
          <div className="overflow-hidden rounded-lg">
            <ins
              ref={insRef}
              className="adsbygoogle block"
              data-ad-client={clientId}
              data-ad-slot={slotId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        ) : (
          <div className="space-y-1.5 pt-0.5">
            <p className="text-xs font-bold text-white leading-snug">
              {isEn ? '100% Free Access (AdSense)' : '100% Darmowy dostęp (AdSense)'}
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isEn
                ? `All ${allModules.length} modules and ${allProjects.length} projects are free thanks to Google AdSense.`
                : `Wszystkie ${allModules.length} modułów i ${allProjects.length} projektów są bezpłatne dzięki Google AdSense.`}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <aside
      aria-label={
        isEn
          ? 'Information about free access funded by Google AdSense'
          : 'Informacja o darmowym dostępie finansowanym przez Google AdSense'
      }
      data-testid={`adsense-banner-${placement}`}
      className={`rounded-2xl border border-slate-800/90 bg-slate-900/50 overflow-hidden shadow-md print:hidden ${className}`}
    >
      <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold uppercase tracking-wider">
            {hasRealSlotUnit
              ? isEn
                ? 'Google AdSense Ad'
                : 'Reklama Google AdSense'
              : isEn
                ? 'Open Edition · AdSense'
                : 'Edycja Otwarta · AdSense'}
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400">
            {isEn
              ? '100% free learning supported by Google AdSense ads'
              : '100% darmowa nauka wspierana przez reklamy Google AdSense'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSubModalOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 font-semibold text-[11px] transition-colors cursor-pointer"
          >
            <Sparkles className="h-3 w-3 text-indigo-400" />
            <span>{isEn ? 'About free model' : 'O modelu darmowym'}</span>
          </button>
          <button
            type="button"
            onClick={() => setDismissedInView(true)}
            title={isEn ? 'Hide this notice in this view' : 'Ukryj tę informację w tym widoku'}
            className="p-0.5 rounded text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {hasRealSlotUnit ? (
        <div className="px-4 py-2">
          <ins
            ref={insRef}
            className="adsbygoogle block"
            data-ad-client={clientId}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      ) : (
        <div className="px-4 py-3 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40">
          <p className="text-xs text-slate-300 leading-relaxed">
            {isEn
              ? `You are using the full free version of Full Stack Developer Academy (${allLessons.length} lessons, 6 simulators and ${allProjects.length} projects for $0). An ad-free PRO plan will launch in a future stage.`
              : `Korzystasz z pełnej, darmowej wersji Full Stack Developer Academy (${allLessons.length} lekcji, 6 symulatorów i ${allProjects.length} projektów za 0 zł). Plan PRO bez reklam pojawi się w kolejnym etapie.`}
          </p>
          <button
            type="button"
            onClick={() => setIsSubModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold shrink-0 transition-colors cursor-pointer"
          >
            {isEn ? 'Access details' : 'Szczegóły dostępu'}
          </button>
        </div>
      )}
    </aside>
  );
};
