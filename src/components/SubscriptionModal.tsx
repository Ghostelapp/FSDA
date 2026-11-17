import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Check,
  Sparkles,
  X,
  Shield,
  Code2,
  Terminal,
  Award,
  Heart,
  Clock,
  Layers,
} from 'lucide-react';
import { isGuestUser } from '../utils/authValidation';

export const SubscriptionModal: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    isSubModalOpen,
    setIsSubModalOpen,
    allLessons,
    allModules,
    allProjects,
    language,
  } = useApp();
  const isEn = language === 'en';

  if (!isSubModalOpen) return null;

  const isGuest = isGuestUser(currentUser, isAuthenticated);
  const isPro = !isGuest && currentUser.isPro;

  const handleOpenAuth = () => {
    setIsSubModalOpen(false);
    window.dispatchEvent(new CustomEvent('akademia:open-auth-modal'));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsSubModalOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner */}
        <div className="relative px-6 pt-7 pb-6 bg-gradient-to-r from-emerald-500/15 via-indigo-600/15 to-purple-600/15 border-b border-slate-800">
          <button
            type="button"
            onClick={() => setIsSubModalOpen(false)}
            aria-label={isEn ? 'Close plan information modal' : 'Zamknij okno informacji o planach'}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              {isEn ? 'Open Edition — 100% Free' : 'Edycja Otwarta — 100% Za Darmo'}
            </span>
            <span className="text-xs text-slate-400">
              {isEn ? 'Funded by Google AdSense' : 'Finansowana przez Google AdSense'}
            </span>
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isEn ? 'The entire Academy is available for $0.' : 'Cała Akademia jest dostępna za 0 zł.'}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            {isEn ? (
              <>
                We launched as an open, free educational platform. You get full access to all{' '}
                <strong className="text-white">{allLessons.length} lessons</strong>, 6 simulators, {allProjects.length} projects with code, and GitHub sync.
              </>
            ) : (
              <>
                Wystartowaliśmy jako otwarta, bezpłatna platforma edukacyjna. Masz pełny dostęp do wszystkich{' '}
                <strong className="text-white">{allLessons.length} lekcji</strong>, 6 symulatorów, {allProjects.length} projektów z kodem i synchronizacji GitHub.
              </>
            )}
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Open Access Highlight */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                {isEn ? 'Active launch model' : 'Aktywny model startowy'}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{isEn ? '$0' : '0 zł'}</span>
                <span className="text-xs text-slate-400">
                  {isEn ? '/ full access for every student' : '/ pełny dostęp dla każdego kursanta'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {isEn
                  ? 'We keep servers running via Google AdSense ads. No credit card or subscription required.'
                  : 'Utrzymujemy serwery dzięki reklamom Google AdSense. Nie wymagamy karty płatniczej ani abonamentu.'}
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              {isGuest ? (
                <button
                  type="button"
                  onClick={handleOpenAuth}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-colors"
                >
                  {isEn ? 'Create free account' : 'Załóż darmowe konto'}
                </button>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Check className="h-4 w-4" />
                  <span>
                    {isPro
                      ? isEn
                        ? 'Special PRO account active'
                        : 'Konto specjalne PRO aktywne'
                      : isEn
                        ? 'Full free access active'
                        : 'Pełny darmowy dostęp aktywny'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* What's Included Free Today */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isEn ? "What's completely free right now" : 'Co masz w pełni za darmo już teraz'}
            </h3>

            <div className="rounded-2xl border border-slate-800 overflow-hidden text-xs">
              <div className="p-3.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-4">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-400 shrink-0" />
                  {isEn
                    ? `All ${allModules.length} modules and ${allLessons.length} lessons + live editor`
                    : `Wszystkie ${allModules.length} modułów i ${allLessons.length} lekcji + edytor na żywo`}
                </span>
                <span className="font-bold text-emerald-400 shrink-0">
                  {isEn ? 'Included ($0)' : 'W cenie (0 zł)'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between gap-4">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-cyan-400 shrink-0" />
                  {isEn
                    ? '6 simulators (Bash/Git Terminal, SQL, REST API, Event Loop)'
                    : '6 symulatorów (Terminal Bash/Git, SQL, REST API, Event Loop)'}
                </span>
                <span className="font-bold text-emerald-400 shrink-0">
                  {isEn ? 'Included ($0)' : 'W cenie (0 zł)'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-4">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  {isEn
                    ? `${allProjects.length} commercial projects + GitHub sync`
                    : `${allProjects.length} projektów komercyjnych + synchronizacja GitHub`}
                </span>
                <span className="font-bold text-emerald-400 shrink-0">
                  {isEn ? 'Included ($0)' : 'W cenie (0 zł)'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between gap-4">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-400 shrink-0" />
                  {isEn
                    ? 'ATS CV Builder, Live Coding, SM-2 Flashcards & Certificate'
                    : 'Kreator CV ATS, Live Coding, Fiszki SM-2 i Certyfikat'}
                </span>
                <span className="font-bold text-emerald-400 shrink-0">
                  {isEn ? 'Included ($0)' : 'W cenie (0 zł)'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-950/60 flex items-center justify-between gap-4">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500 shrink-0" />
                  {isEn
                    ? '5-heart energy system in quizzes (15 min recharge + review drills)'
                    : 'System 5 serc energii w quizach (odnowa co 15 min + powtórki)'}
                </span>
                <span className="font-bold text-emerald-400 shrink-0">
                  {isEn ? 'Free recharge' : 'Bezpłatne odnawianie'}
                </span>
              </div>
            </div>
          </div>

          {/* PRO Planned Notice */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3">
            <Clock className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-bold text-indigo-300">
                {isEn
                  ? 'Optional Full Stack PRO plan (ad-free) — coming soon'
                  : 'Opcjonalny pakiet Full Stack PRO (bez reklam) — w przygotowaniu'}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isEn
                  ? 'We will launch the paid PRO package (removing Google AdSense ads and unlimited quiz hearts) in the next phase of the platform. Until then, all features remain open to everyone for free.'
                  : 'Sprzedaż płatnego pakietu PRO (usunięcie reklam Google AdSense i brak limitu serc w quizach) uruchomimy w kolejnym etapie rozwoju platformy. Do tego czasu wszystkie funkcje pozostają otwarte dla każdego za darmo.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>
              {isEn
                ? 'No hidden fees and no automatic subscriptions'
                : 'Brak ukrytych opłat i automatycznych subskrypcji'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsSubModalOpen(false)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isEn ? 'Close' : 'Zamknij'}
          </button>
        </div>
      </div>
    </div>
  );
};
