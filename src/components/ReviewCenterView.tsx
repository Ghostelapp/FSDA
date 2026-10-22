import React from 'react';
import { useApp } from '../context/AppContext';
import { RotateCcw, AlertTriangle, CheckCircle2, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export const ReviewCenterView: React.FC = () => {
  const { weakAreas, setActiveTab, currentUser } = useApp();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
          <RotateCcw className="h-4 w-4" />
          <span>Inteligentny System Spaced Repetition</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Centrum Powtórek i Trudniejszych Zagadnień
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Platforma automatycznie analizuje Twoje wyniki quizów i ćwiczeń praktycznych. 
          Zagadnienia z wynikiem poniżej 80% trafiają tutaj, aby umożliwić ich powtórzenie i trwałe utrwalenie w pamięci.
        </p>
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
