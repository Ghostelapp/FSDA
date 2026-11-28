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
  const { currentUser, isAuthenticated, adSenseConfig, setIsSubModalOpen, language } = useApp();
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

  // Never render placeholder/coming-soon ad containers before real AdSense slots are configured
  if (!shouldRender || dismissedInView || !hasRealSlotUnit) {
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
            <span>{isEn ? 'Ad · AdSense' : 'Reklama · AdSense'}</span>
          </span>
          <button
            type="button"
            onClick={() => setIsSubModalOpen(true)}
            className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            Info
          </button>
        </div>

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
      </div>
    );
  }

  return (
    <aside
      aria-label={isEn ? 'Google AdSense Advertisement' : 'Reklama Google AdSense'}
      data-testid={`adsense-banner-${placement}`}
      className={`rounded-2xl border border-slate-800/90 bg-slate-900/50 overflow-hidden shadow-md print:hidden ${className}`}
    >
      <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300">
            {isEn ? 'Google AdSense Ad' : 'Reklama Google AdSense'}
          </span>
          <span className="hidden sm:inline text-slate-500">·</span>
          <span className="hidden sm:inline text-slate-400">
            {isEn
              ? 'Supports 100% free access to all lessons and simulators'
              : 'Wspiera 100% bezpłatny dostęp do wszystkich lekcji i symulatorów'}
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
            title={isEn ? 'Hide this ad container in this view' : 'Ukryj tę sekcję w tym widoku'}
            className="p-0.5 rounded text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

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
    </aside>
  );
};
