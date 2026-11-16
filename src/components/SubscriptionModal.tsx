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
  } = useApp();

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
            aria-label="Zamknij okno informacji o planach"
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              Edycja Otwarta — 100% Za Darmo
            </span>
            <span className="text-xs text-slate-400">
              Finansowana przez Google AdSense
            </span>
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-tight">
            Cała Akademia jest dostępna za 0 zł.
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Wystartowaliśmy jako otwarta, bezpłatna platforma edukacyjna. Masz pełny dostęp do wszystkich{' '}
            <strong className="text-white">{allLessons.length} lekcji</strong>, 6 symulatorów, 12 projektów z kodem i synchronizacji GitHub.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Open Access Highlight */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                Aktywny model startowy
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">0 zł</span>
                <span className="text-xs text-slate-400">/ pełny dostęp dla każdego kursanta</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Utrzymujemy serwery dzięki reklamom Google AdSense. Nie wymagamy karty płatniczej ani abonamentu.
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              {isGuest ? (
                <button
                  type="button"
                  onClick={handleOpenAuth}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-colors"
                >
                  Załóż darmowe konto
                </button>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Check className="h-4 w-4" />
                  <span>{isPro ? 'Konto specjalne PRO aktywne' : 'Pełny darmowy dostęp aktywny'}</span>
                </div>
              )}
            </div>
          </div>

          {/* What's Included Free Today */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Co masz w pełni za darmo już teraz
            </h3>

            <div className="rounded-2xl border border-slate-800 overflow-hidden text-xs">
              <div className="p-3.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-4">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-400 shrink-0" />
                  Wszystkie 15 modułów i {allLessons.length} lekcji + edytor na żywo
                </span>
                <span className="font-bold text-emerald-400 shrink-0">W cenie (0 zł)</span>
              </div>

              <div className="p-3.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between gap-4">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-cyan-400 shrink-0" />
                  6 symulatorów (Terminal Bash/Git, SQL, REST API, Event Loop)
                </span>
                <span className="font-bold text-emerald-400 shrink-0">W cenie (0 zł)</span>
              </div>

              <div className="p-3.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-4">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  12 projektów komercyjnych + synchronizacja GitHub
                </span>
                <span className="font-bold text-emerald-400 shrink-0">W cenie (0 zł)</span>
              </div>

              <div className="p-3.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between gap-4">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-400 shrink-0" />
                  Kreator CV ATS, Live Coding, Fiszki SM-2 i Certyfikat
                </span>
                <span className="font-bold text-emerald-400 shrink-0">W cenie (0 zł)</span>
              </div>

              <div className="p-3.5 bg-slate-950/60 flex items-center justify-between gap-4">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500 shrink-0" />
                  System 5 serc energii w quizach (odnowa co 15 min + powtórki)
                </span>
                <span className="font-bold text-emerald-400 shrink-0">Bezpłatne odnawianie</span>
              </div>
            </div>
          </div>

          {/* PRO Planned Notice */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3">
            <Clock className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-bold text-indigo-300">
                Opcjonalny pakiet Full Stack PRO (bez reklam) — w przygotowaniu
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Sprzedaż płatnego pakietu PRO (usunięcie reklam Google AdSense i brak limitu serc w quizach) uruchomimy w kolejnym etapie rozwoju platformy. Do tego czasu wszystkie funkcje pozostają otwarte dla każdego za darmo.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>Brak ukrytych opłat i automatycznych subskrypcji</span>
          </div>
          <button
            type="button"
            onClick={() => setIsSubModalOpen(false)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};
