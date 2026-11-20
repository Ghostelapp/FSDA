import React, { useEffect, useState } from 'react';
import { Cookie, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const COOKIE_CONSENT_STORAGE_KEY = 'fsda_cookie_consent_v1';
export type CookieConsentChoice = 'all' | 'essential';

export function readStoredCookieConsent(): CookieConsentChoice | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    return raw === 'all' || raw === 'essential' ? raw : null;
  } catch {
    return null;
  }
}

export function saveCookieConsent(choice: CookieConsentChoice): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice);
    }
  } catch {
    // Ignore storage quota or sandbox restrictions
  }
}

export const CookieConsentBanner: React.FC = () => {
  const { language, setActiveTab, activeTab } = useApp();
  const isEn = language === 'en';
  const [consent, setConsent] = useState<CookieConsentChoice | null | 'pending'>('pending');

  useEffect(() => {
    setConsent(readStoredCookieConsent());
  }, []);

  if (consent !== null) {
    return null;
  }

  const handleChoose = (choice: CookieConsentChoice) => {
    saveCookieConsent(choice);
    setConsent(choice);
  };

  return (
    <aside
      data-testid="cookie-consent-banner"
      aria-label={isEn ? 'Cookie & Privacy Settings' : 'Zgoda na pliki cookie i prywatność'}
      className="fixed bottom-[calc(0.5rem+env(safe-area-inset-bottom,0px))] left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 z-40 mx-auto max-w-4xl rounded-2xl border border-slate-700/80 bg-slate-900/95 px-3 py-3 sm:px-6 sm:py-4 text-[11px] sm:text-xs text-slate-200 shadow-2xl backdrop-blur-md print:hidden"
    >
      <div className="flex flex-col gap-2.5 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="mt-0.5 hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
            <Cookie className="h-4 w-4" />
          </div>
          <div className="space-y-0.5 sm:space-y-1 leading-snug sm:leading-relaxed">
            <p className="font-bold text-slate-100 flex items-center gap-1.5 text-xs">
              <Cookie className="h-3.5 w-3.5 text-indigo-400 sm:hidden shrink-0" />
              <span>{isEn ? 'Privacy & Cookies (GDPR / AdSense)' : 'Prywatność i pliki cookie (RODO)'}</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            </p>
            <p className="text-slate-300">
              {isEn ? (
                <>
                  We use essential storage for your session &amp; theme, plus optional AdSense cookies to keep lessons 100% free.{' '}
                  <a
                    href="/polityka-prywatnosci"
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                      e.preventDefault();
                      setActiveTab('privacy');
                    }}
                    className="font-semibold text-indigo-400 underline hover:text-indigo-300"
                  >
                    Privacy Policy
                  </a>
                  .
                </>
              ) : (
                <>
                  Używamy pamięci lokalnej (sesja, motyw) i opcjonalnych cookie AdSense, by kurs był w 100% darmowy.{' '}
                  <a
                    href="/polityka-prywatnosci"
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                      e.preventDefault();
                      setActiveTab('privacy');
                    }}
                    className="font-semibold text-indigo-400 underline hover:text-indigo-300"
                  >
                    Polityka Prywatności
                  </a>
                  .
                </>
              )}
            </p>
          </div>
        </div>

        <div className={`grid grid-cols-2 sm:flex shrink-0 items-center gap-2 ${activeTab === 'landing' ? 'sm:pr-2' : ''}`}>
          <button
            type="button"
            data-testid="cookie-consent-essential"
            onClick={() => handleChoose('essential')}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-[11px] sm:text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700 cursor-pointer text-center"
          >
            {isEn ? 'Essential only' : 'Tylko niezbędne'}
          </button>
          <button
            type="button"
            data-testid="cookie-consent-accept"
            onClick={() => handleChoose('all')}
            className="rounded-xl bg-indigo-600 px-3 py-2 sm:px-4 text-[11px] sm:text-xs font-bold text-white transition-colors hover:bg-indigo-500 cursor-pointer text-center"
          >
            {isEn ? 'Accept all' : 'Akceptuję'}
          </button>
        </div>
      </div>
    </aside>
  );
};
