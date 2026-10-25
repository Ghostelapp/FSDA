import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdPlacementKey } from '../types';
import { shouldShowAdsForUser } from '../utils/adsense';
import { Crown, ExternalLink, Info, Sparkles, X } from 'lucide-react';

interface GoogleAdSenseBannerProps {
  placement: Exclude<AdPlacementKey, 'rewarded'>;
  variant?: 'horizontal' | 'sidebar' | 'compact';
  className?: string;
}

const CONTEXTUAL_SPONSOR_CREATIVES: Record<
  Exclude<AdPlacementKey, 'rewarded'>,
  {
    badge: string;
    headline: string;
    description: string;
    ctaLabel: string;
    displayUrl: string;
  }
> = {
  dashboard: {
    badge: 'Google Cloud & Firebase Hosting',
    headline: 'Wdróż swoją pierwszą aplikację Full Stack w 60 sekund za darmo',
    description:
      'Darmowy tier Cloud Firestore, uwierzytelnianie OAuth 2.0 i globalny CDN dla projektów kursowych React + TypeScript.',
    ctaLabel: 'Wypróbuj bezpłatnie',
    displayUrl: 'cloud.google.com/free',
  },
  modules: {
    badge: 'JetBrains WebStorm & VS Code Cloud',
    headline: 'Profesjonalne narzędzia IDE dla przyszłych Junior Developerów',
    description:
      'Automatyczne refaktoryzacje TypeScript, podgląd zapytań SQL oraz wbudowany klient Git. Zbuduj portfolio szybciej.',
    ctaLabel: 'Sprawdź ofertę edukacyjną',
    displayUrl: 'jetbrains.com/student',
  },
  lesson: {
    badge: 'Full Stack Academy PRO • Bez Reklam',
    headline: 'Ucz się w 100% bez reklam Google AdSense i bez limitu serc ❤️',
    description:
      'Odblokuj nielimitowane podejścia do quizów, gotowe repozytoria 12 projektów komercyjnych oraz certyfikat z weryfikacją QR.',
    ctaLabel: 'Przejdź na PRO (0% reklam)',
    displayUrl: 'fullstack-academy.pl/pro',
  },
  sidebar: {
    badge: 'Plan Darmowy (AdSense)',
    headline: 'Wyłącz wszystkie reklamy i limity serc',
    description: 'Przejdź na plan PRO, aby ukryć boksy reklamowe Google AdSense w całej Akademii.',
    ctaLabel: 'Odblokuj PRO',
    displayUrl: 'fullstack-academy.pl/pro',
  },
};

export const GoogleAdSenseBanner: React.FC<GoogleAdSenseBannerProps> = ({
  placement,
  variant = 'horizontal',
  className = '',
}) => {
  const { currentUser, isAuthenticated, adSenseConfig, setIsSubModalOpen, setIsLivesModalOpen } = useApp();
  const insRef = useRef<HTMLModElement | null>(null);
  const pushedSlotRef = useRef<string>('');
  const [adFilled, setAdFilled] = useState(false);
  const [dismissedInView, setDismissedInView] = useState(false);

  const shouldRender = shouldShowAdsForUser(currentUser, isAuthenticated, adSenseConfig, placement);
  const slotId = adSenseConfig.slots[placement] || '1092837465';
  const clientId = adSenseConfig.clientId || 'ca-pub-7482910384756192';

  useEffect(() => {
    if (!shouldRender || dismissedInView) return;
    const key = `${clientId}:${slotId}:${placement}`;
    if (pushedSlotRef.current === key) return;

    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && insRef.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushedSlotRef.current = key;

          // Check if AdSense injected a live iframe with non-zero height
          const status = insRef.current.getAttribute('data-ad-status');
          if (status === 'filled') {
            setAdFilled(true);
          }
        }
      } catch {
        // Fallback card handles environments where AdSense script is blocked or domain is awaiting review
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [shouldRender, dismissedInView, clientId, slotId, placement]);

  if (!shouldRender || dismissedInView) {
    return null;
  }

  const creative = CONTEXTUAL_SPONSOR_CREATIVES[placement];

  if (variant === 'sidebar') {
    return (
      <div
        data-testid={`adsense-banner-${placement}`}
        className={`rounded-xl border border-slate-800/90 bg-slate-950/90 p-3 space-y-2.5 relative overflow-hidden ${className}`}
      >
        {/* Top AdSense Disclosure Header */}
        <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400">
          <span className="inline-flex items-center gap-1 font-mono uppercase tracking-wider text-slate-400">
            <Info className="h-3 w-3 text-amber-400 shrink-0" />
            <span>Reklama • AdSense</span>
          </span>
          <button
            type="button"
            onClick={() => setIsSubModalOpen(true)}
            className="text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-0.5 cursor-pointer"
          >
            <Crown className="h-2.5 w-2.5" />
            <span>Usuń reklamy</span>
          </button>
        </div>

        {/* Official Google AdSense <ins> Container */}
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

        {/* Fallback Sponsor / House Ad Unit when AdSense iframe is not yet filled */}
        {!adFilled && adSenseConfig.showFallbackSponsorCard && (
          <div className="space-y-2 pt-0.5">
            <p className="text-xs font-bold text-white leading-snug">{creative.headline}</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">{creative.description}</p>
            <div className="pt-1 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsSubModalOpen(true)}
                className="w-full py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-indigo-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Crown className="h-3 w-3 text-amber-400" />
                <span>{creative.ctaLabel}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <aside
      aria-label="Reklama Google AdSense dla darmowego konta"
      data-testid={`adsense-banner-${placement}`}
      className={`rounded-2xl border border-slate-800/90 bg-slate-900/50 overflow-hidden shadow-md print:hidden ${className}`}
    >
      {/* Top Disclosure Bar */}
      <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold uppercase tracking-wider">
            Reklama Google AdSense
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400">
            Widoczna tylko na darmowym koncie (Free Tier)
          </span>
          <span className="font-mono text-[10px] text-slate-600 hidden md:inline">
            [{clientId} / slot:{slotId}]
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLivesModalOpen(true)}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            Obejrzyj reklamę za +1 ❤️
          </button>
          <span className="text-slate-700">|</span>
          <button
            type="button"
            onClick={() => setIsSubModalOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-[11px] transition-colors cursor-pointer"
          >
            <Crown className="h-3 w-3 text-amber-400" />
            <span>Wyłącz reklamy z PRO</span>
          </button>
          <button
            type="button"
            onClick={() => setDismissedInView(true)}
            title="Ukryj ten baner tymczasowo"
            className="p-0.5 rounded text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Official Google AdSense <ins> Tag */}
      <div className="px-4">
        <ins
          ref={insRef}
          className="adsbygoogle block"
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

      {/* Contextual AdSense Preview / Sponsor Unit (rendered when live network ad is pending domain approval or blocked) */}
      {!adFilled && adSenseConfig.showFallbackSponsorCard && (
        <div className="p-4 sm:px-5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-950/60 via-slate-900/60 to-indigo-950/20">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="font-bold text-indigo-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {creative.badge}
              </span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-slate-500 text-[10px]">{creative.displayUrl}</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
              {creative.headline}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              {creative.description}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsSubModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{creative.ctaLabel}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
