import React from 'react';
import { useApp } from '../context/AppContext';
import { RotateCcw, AlertTriangle, CheckCircle2, ArrowRight, BookOpen, Sparkles, Heart, Crown } from 'lucide-react';

export const ReviewCenterView: React.FC = () => {
  const { weakAreas, setActiveTab, currentUser, setIsLivesModalOpen, livesInfo } = useApp();

  const isPro = currentUser.isPro;
  const currentLives = isPro ? 5 : (livesInfo.currentLives ?? currentUser.lives ?? 5);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
          <RotateCcw className="h-4 w-4" />
          <span>Inteligentny System Spaced Repetition & Gamifikacja</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Centrum Powtórek i Regeneracji Energii
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Platforma automatycznie analizuje Twoje wyniki quizów i ćwiczeń praktycznych. 
          Tutaj możesz utrwalać wiedzę i odzyskiwać utracone serca poprzez szybkie powtórki pytań bez ryzyka ich utraty.
        </p>
      </div>

      {/* Hearts Recovery Card */}
      <div className="p-5 rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/30 via-slate-900 to-indigo-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shrink-0">
            <Heart className="h-6 w-6 fill-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                {isPro ? 'Status PRO Aktywny' : 'Zasada Uczciwej Nauki'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {isPro ? '∞ serc' : `${currentLives}/5 serc`}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5">
              {isPro 
                ? 'Nielimitowane podejścia do wszystkich powtórek i testów' 
                : 'Ucz się i odzyskuj serca za darmo (+1 ❤️)'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isPro
                ? 'Jako użytkownik PRO możesz swobodnie eksperymentować bez przerw na regenerację.'
                : 'Za rozwiązanie 3 szybkich pytań powtórkowych natychmiast otrzymujesz +1 serce do wykorzystania w lekcjach.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsLivesModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shrink-0 shadow-lg shadow-rose-950 transition-all flex items-center justify-center gap-2"
        >
          <Heart className="h-4 w-4 fill-white" />
          <span>{isPro ? 'Zarządzaj sercami' : 'Szybka powtórka (+1 ❤️)'}</span>
        </button>
      </div>

      {weakAreas.length > 0 ? (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-950/20 text-xs text-rose-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              Znaleziono {weakAreas.length} lekcji wymagających powtórki przed egzaminem końcowym.
            </span>
          </div>

          <div className="space-y-3">
            {weakAreas.map((item) => (
              <div
                key={item.lessonId}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    {item.moduleTitle}
                  </span>
                  <h3 className="text-base font-bold text-white">{item.lessonTitle}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="text-rose-400 font-semibold">Twój wynik testu: {item.quizScore}%</span>
                    <span>•</span>
                    <span>Wymagany próg zaliczenia: 80%</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('lesson', item.lessonId)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shrink-0"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Powtórz lekcję i quiz</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-md">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Wszystkie zagadnienia opanowane perfekcyjnie!</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Nie masz obecnie żadnych słabych obszarów. Wszystkie Twoje dotychczasowe testy wiedzy osiągnęły wynik minimum 80%.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('modules')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
          >
            <span>Przejdź do kolejnych modułów</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

    </div>
  );
};
