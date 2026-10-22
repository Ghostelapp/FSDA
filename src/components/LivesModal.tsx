import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCountdown, XP_COST_ONE_HEART, XP_COST_FULL_REFILL, XP_COST_STREAK_FREEZE } from '../utils/gamification';
import { 
  Heart, 
  Clock, 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  Zap, 
  X, 
  CheckCircle2, 
  ShoppingBag, 
  BookOpen,
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';

// Mini practice questions to earn 1 heart
const PRACTICE_QUESTIONS = [
  {
    q: 'Jaki znacznik HTML reprezentuje najważniejszy nagłówek pierwszego poziomu?',
    options: ['<h1>', '<header>', '<head>', '<title>'],
    correct: 0,
    tip: '<h1> to nagłówek nadrzędny w strukturze dokumentu.',
  },
  {
    q: 'Która właściwość CSS ustawia elastyczny układ kontenera (Flexbox)?',
    options: ['display: flex;', 'flex-direction: row;', 'align-items: center;', 'position: flex;'],
    correct: 0,
    tip: 'display: flex aktywuje Flexbox na elemencie kontenera.',
  },
  {
    q: 'Co oznacza operator === w języku JavaScript?',
    options: ['Przypisanie wartości', 'Ścisłe porównanie wartości i typu', 'Porównanie z rzutowaniem typów', 'Kopiowanie obiektu'],
    correct: 1,
    tip: 'Operator potrójnego równości === sprawdza zarówno wartość jak i typ.',
  },
  {
    q: 'W protokole HTTP kod odpowiedzi 200 oznacza:',
    options: ['Not Found', 'Internal Server Error', 'OK (sukces żądania)', 'Unauthorized'],
    correct: 2,
    tip: 'Kod 200 OK wskazuje na pomyślne przetworzenie żądania.',
  },
  {
    q: 'Które polecenie Git pobiera zmiany ze zdalnego repozytorium i scala je z lokalną gałęzią?',
    options: ['git push', 'git pull', 'git fetch', 'git commit'],
    correct: 1,
    tip: 'git pull wykonuje fetch i merge w jednym kroku.',
  },
];

export const LivesModal: React.FC = () => {
  const { 
    currentUser, 
    livesInfo, 
    isLivesModalOpen, 
    setIsLivesModalOpen, 
    setIsSubModalOpen,
    earnPracticeLife,
    buyHeart,
    buyRefill,
    buyFreeze
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'practice' | 'shop'>('overview');
  
  // Practice quiz state
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);

  if (!isLivesModalOpen) return null;

  const currentLives = currentUser.isPro ? 5 : (livesInfo.currentLives ?? currentUser.lives ?? 5);
  const maxLives = livesInfo.maxLives ?? 5;
  const isFull = currentUser.isPro || currentLives >= maxLives;

  const handlePracticeSubmit = () => {
    if (selectedPracticeOption === null) return;
    setIsAnswerRevealed(true);

    const question = PRACTICE_QUESTIONS[currentPracticeIndex];
    if (selectedPracticeOption === question.correct) {
      setTimeout(() => {
        if (currentPracticeIndex + 1 < 3) {
          setCurrentPracticeIndex((prev) => prev + 1);
          setSelectedPracticeOption(null);
          setIsAnswerRevealed(false);
        } else {
          setPracticeCompleted(true);
          earnPracticeLife();
        }
      }, 1200);
    }
  };

  const resetPractice = () => {
    setCurrentPracticeIndex(0);
    setSelectedPracticeOption(null);
    setIsAnswerRevealed(false);
    setPracticeCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-800/80 bg-gradient-to-b from-slate-850 to-slate-900">
          <button
            type="button"
            onClick={() => setIsLivesModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
            <span>Stan Energii i Życia w Nauce</span>
          </div>

          <h2 className="mt-1 text-xl sm:text-2xl font-black text-white">
            {currentUser.isPro ? 'Nielimitowane Życia PRO' : 'Twoje Serca Nauki'}
          </h2>

          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
            {currentUser.isPro 
              ? 'Posiadasz aktywną subskrypcję PRO. Masz nielimitowaną liczbę podejść do quizów i wyzwań programistycznych.'
              : 'Serca chronią Twój proces nauki i motywują do przemyślanych odpowiedzi. Tracisz serce tylko przy błędzie w quizie lub niezaliczonych testach kodu.'}
          </p>

          {/* Heart Slots Visualizer */}
          <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {currentUser.isPro ? (
                <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/10">
                  <Crown className="h-4 w-4 text-amber-400" />
                  <span>∞ Nielimitowane podejścia</span>
                  <Sparkles className="h-4 w-4 text-purple-400" />
                </div>
              ) : (
                [1, 2, 3, 4, 5].map((slot) => {
                  const hasLife = slot <= currentLives;
                  return (
                    <div 
                      key={slot}
                      className={`relative flex items-center justify-center h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                        hasLife 
                          ? 'bg-rose-500/15 border-rose-500/40 text-rose-500 shadow-md shadow-rose-500/20 scale-105' 
                          : 'bg-slate-900 border-slate-800 text-slate-600'
                      }`}
                    >
                      <Heart 
                        className={`h-4 w-4 sm:h-6 sm:w-6 transition-all ${
                          hasLife ? 'fill-rose-500 text-rose-500 animate-in zoom-in-75' : 'text-slate-600'
                        }`} 
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Countdown / Status Banner */}
            {!currentUser.isPro && (
              <div className="flex items-center gap-2 text-xs font-medium">
                {isFull ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Pełna energia (5/5) — możesz swobodnie rozwiązywać zadania!
                  </span>
                ) : (
                  <span className="text-amber-300 flex items-center gap-1.5 font-mono">
                    <Clock className="h-4 w-4 text-amber-400 animate-spin" />
                    Kolejne serce za: <strong className="text-white font-bold">{formatCountdown(livesInfo.secondsToNextHeart || 0)}</strong>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          {!currentUser.isPro && (
            <div className="mt-4 flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'overview' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Opcje Regeneracji
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('practice')}
                className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'practice' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Szybka Powtórka (+1 ❤️)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('shop')}
                className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'shop' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="h-3.5 w-3.5 text-amber-400" />
                <span>Sklep XP</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {currentUser.isPro ? (
            /* PRO active screen */
            <div className="space-y-4 text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-600/20 border border-amber-500/30 text-amber-400 shadow-xl shadow-amber-500/10">
                <Crown className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Twój profil posiada status PRO</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                  Uczysz się bez żadnych przerw na odnowienie żyć. Błędy są częścią kodowania i nic Cię nie zatrzymuje.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-left space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Nielimitowane serca w quizach i weryfikacji kodu</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Tarcze serii nauki aktywne ({currentUser.streakFreezes ?? 1} w zapasie)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Certyfikat Full Stack z weryfikacją portfolio projektów</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsLivesModalOpen(false);
                    setIsSubModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
                >
                  Zarządzaj subskrypcją PRO
                </button>
              </div>
            </div>
          ) : activeTab === 'overview' ? (
            /* Free user overview */
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Jak odzyskać serca za darmo:
              </div>

              {/* Way 1: Time */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">1. Czasowa automatyczna regeneracja</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Każde serce odnawia się samoczynnie co 15 minut. Możesz w tym czasie czytać teorię, przeglądać kod wzorcowy lub piaskownicę.
                  </p>
                </div>
              </div>

              {/* Way 2: Practice */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">2. Szybka powtórka wiedzy (+1 ❤️)</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      Odpowiedz na 3 szybkie pytania teoretyczne. Nie tracisz serc w powtórkach, a zyskujesz serce natychmiast!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetPractice();
                    setActiveTab('practice');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition-colors"
                >
                  Start
                </button>
              </div>

              {/* Way 3: XP Shop */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">3. Sklep Programisty (Wymiana XP)</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      Wykorzystaj punkty doświadczenia (masz {currentUser.xp} XP), aby natychmiast dokupić serca lub tarczę serii.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('shop')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold shrink-0 transition-colors"
                >
                  Sklep
                </button>
              </div>

              {/* Pro Banner Promo */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-600/15 to-indigo-600/15 border border-amber-500/30 flex items-center justify-between gap-3 mt-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                    <Crown className="h-4 w-4" />
                    <span>Nielimitowana nauka z PRO</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Brak limitów serc, tarcze serii i priorytetowa ocena projektów.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsLivesModalOpen(false);
                    setIsSubModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shrink-0 shadow-lg shadow-amber-500/20 transition-all"
                >
                  Sprawdź PRO
                </button>
              </div>
            </div>
          ) : activeTab === 'practice' ? (
            /* Practice Quiz View */
            <div className="space-y-4">
              {practiceCompleted ? (
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Świetna robota! +1 Serce dodane</h3>
                  <p className="text-xs text-slate-300">
                    Ukończyłeś szybką powtórkę. Twoja energia do nauki została uzupełniona.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Wróć do podsumowania
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-400">
                      Pytanie {currentPracticeIndex + 1} z 3
                    </span>
                    <span className="text-slate-400">
                      Zaliczenie nagradza +1 ❤️
                    </span>
                  </div>

                  {/* Progress dots */}
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((idx) => (
                      <div 
                        key={idx} 
                        className={`h-1.5 flex-1 rounded-full ${
                          idx < currentPracticeIndex ? 'bg-indigo-500' : idx === currentPracticeIndex ? 'bg-indigo-400' : 'bg-slate-800'
                        }`} 
                      />
                    ))}
                  </div>

                  {/* Question */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <p className="text-sm font-bold text-white leading-relaxed">
                      {PRACTICE_QUESTIONS[currentPracticeIndex].q}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {PRACTICE_QUESTIONS[currentPracticeIndex].options.map((opt, oIdx) => {
                      const isSelected = selectedPracticeOption === oIdx;
                      const isCorrect = oIdx === PRACTICE_QUESTIONS[currentPracticeIndex].correct;
                      
                      let style = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
                      if (isSelected) style = 'bg-indigo-600/20 border-indigo-500 text-indigo-200';
                      if (isAnswerRevealed) {
                        if (isCorrect) style = 'bg-emerald-600/20 border-emerald-500 text-emerald-200';
                        else if (isSelected) style = 'bg-rose-600/20 border-rose-500 text-rose-200';
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={isAnswerRevealed}
                          onClick={() => setSelectedPracticeOption(oIdx)}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all ${style}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit / Tip */}
                  {!isAnswerRevealed ? (
                    <button
                      type="button"
                      disabled={selectedPracticeOption === null}
                      onClick={handlePracticeSubmit}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition-colors"
                    >
                      Sprawdź odpowiedź
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      💡 {PRACTICE_QUESTIONS[currentPracticeIndex].tip}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Developer Shop (XP Exchange) */
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400">Twój stan konta XP:</span>
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  {currentUser.xp} XP
                </span>
              </div>

              {/* Item 1: 1 Heart */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                    <Heart className="h-5 w-5 fill-rose-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">1 Serce Energii</h4>
                    <p className="text-[11px] text-slate-400">+1 punkt do puli żyć</p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isFull || currentUser.xp < XP_COST_ONE_HEART}
                  onClick={buyHeart}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-white font-bold text-xs transition-colors shrink-0"
                >
                  {XP_COST_ONE_HEART} XP
                </button>
              </div>

              {/* Item 2: Full Refill */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Zap className="h-5 w-5 fill-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Pełny Pakiet Serc (5/5)</h4>
                    <p className="text-[11px] text-slate-400">Maksymalne uzupełnienie energii</p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isFull || currentUser.xp < XP_COST_FULL_REFILL}
                  onClick={buyRefill}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shrink-0"
                >
                  {XP_COST_FULL_REFILL} XP
                </button>
              </div>

              {/* Item 3: Streak Freeze Shield */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">Tarcza Serii (Streak Freeze)</h4>
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-mono">
                        posiadasz: {currentUser.streakFreezes ?? 1}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Chroni serię dni nauki przed zresetowaniem</p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={currentUser.xp < XP_COST_STREAK_FREEZE}
                  onClick={buyFreeze}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white font-bold text-xs transition-colors shrink-0"
                >
                  {XP_COST_STREAK_FREEZE} XP
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Full Stack Developer Academy Gamification v2.0
          </span>
          <button
            type="button"
            onClick={() => setIsLivesModalOpen(false)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Zamknij
          </button>
        </div>

      </div>
    </div>
  );
};
