import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { soundManager } from '../utils/audioFx';
import { 
  Briefcase, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  HelpCircle, 
  Trophy, 
  Send,
  Eye,
  Award
} from 'lucide-react';

interface TestCase {
  input: string;
  expected: string;
  description: string;
  isHidden?: boolean;
}

interface InterviewTask {
  id: string;
  title: string;
  difficulty: 'Junior' | 'Junior/Mid' | 'Mid';
  timeMinutes: number;
  xpReward: number;
  description: string;
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
  hints: string[];
}

export const MockInterviewView: React.FC = () => {
  const { currentUser, awardCustomXp } = useApp();

  const TASKS: InterviewTask[] = [
    {
      id: 'task-brackets',
      title: 'Walidacja nawiasów (Balanced Parentheses)',
      difficulty: 'Junior',
      timeMinutes: 15,
      xpReward: 80,
      description: `Częste zadanie na pierwszym etapie technicznym (Live Coding):
Napisz funkcję isValidBrackets(str), która sprawdza, czy wszystkie nawiasy w podanym ciągu '()', '{}', '[]' są prawidłowo sparowane i zamykane w odpowiedniej kolejności.
Zwróć true jeśli ciąg jest poprawny, false w przeciwnym razie.`,
      starterCode: `function isValidBrackets(str) {
  // Uzupełnij implementację przy użyciu stosu (tablicy):
  // Zwróć true jeśli nawiasy (), {}, [] są poprawnie sparowane, w przeciwnym razie false.
  return false;
}`,
      solutionCode: `function isValidBrackets(str) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of str) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (char === ')' || char === '}' || char === ']') {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
      testCases: [
        { input: '"()[]{}"', expected: 'true', description: 'Proste nawiasy w kolejności' },
        { input: '"{[()]}"', expected: 'true', description: 'Zagnieżdżone nawiasy' },
        { input: '"(]"', expected: 'false', description: 'Niezgodne typy nawiasów' },
        { input: '"([)]"', expected: 'false', description: 'Niepoprawne przeplatanie nawiasów' },
        { input: '""', expected: 'true', description: 'Pusty ciąg znaków (Edge Case)', isHidden: true },
      ],
      hints: [
        'Zastosuj strukturę danych Stos (LIFO) przy użyciu tablicy i metody .push() / .pop().',
        'Dla otwierających nawiasów odkładaj je na stos, a dla zamykających sprawdzaj czy zdejmujesz pasujący odpowiednik.',
      ],
    },
    {
      id: 'task-groupby',
      title: 'Grupowanie i Sumowanie Danych (Array Reduce)',
      difficulty: 'Junior/Mid',
      timeMinutes: 20,
      xpReward: 90,
      description: `Klasyczne zadanie z manipulacji danymi w backendzie i frontendzie:
Napisz funkcję groupSpendingByPlan(orders), która przyjmuje tablicę zamówień:
[{ plan: 'monthly', amount: 49 }, { plan: 'yearly', amount: 99 }, { plan: 'monthly', amount: 49 }]
i zwraca obiekt z sumą kwot pogrupowaną według nazwy planu:
{ monthly: 98, yearly: 99 }`,
      starterCode: `function groupSpendingByPlan(orders) {
  // Uzupełnij implementację (np. przy użyciu orders.reduce):
  return {};
}`,
      solutionCode: `function groupSpendingByPlan(orders) {
  return orders.reduce((acc, order) => {
    acc[order.plan] = (acc[order.plan] || 0) + order.amount;
    return acc;
  }, {});
}`,
      testCases: [
        {
          input: `[{ plan: 'monthly', amount: 49 }, { plan: 'monthly', amount: 49 }]`,
          expected: `{"monthly":98}`,
          description: 'Sumowanie dwóch takich samych planów',
        },
        {
          input: `[{ plan: 'monthly', amount: 50 }, { plan: 'yearly', amount: 100 }]`,
          expected: `{"monthly":50,"yearly":100}`,
          description: 'Grupowanie różnych planów',
        },
      ],
      hints: [
        'Użyj metody orders.reduce((acc, curr) => ..., {}) z obiektem początkowym {}.',
        'Dodawaj kwotę do istniejącego klucza lub zainicjalizuj zerem: (acc[curr.plan] || 0) + curr.amount.',
      ],
    },
    {
      id: 'task-debounce',
      title: 'Implementacja funkcji Debounce',
      difficulty: 'Mid',
      timeMinutes: 20,
      xpReward: 100,
      description: `Jedno z ulubionych pytań rekruterów z JavaScriptu i optymalizacji:
Napisz funkcję debounce(fn, delayMs), która opóźnia wykonanie przekazanej funkcji fn, dopóki nie upłynie podany czas delayMs od ostatniego jej wywołania.`,
      starterCode: `function debounce(fn, delayMs) {
  // Uzupełnij implementację:
  // Przechowaj identyfikator timera w domknięciu i użyj clearTimeout oraz setTimeout
  return null;
}`,
      solutionCode: `function debounce(fn, delayMs) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delayMs);
  };
}`,
      testCases: [
        { input: 'debounce(log, 200)', expected: 'Funkcja zwraca opakowaną funkcję', description: 'Prawidłowe domknięcie (closure)' },
      ],
      hints: [
        'Wykorzystaj mechanizm domknięcia (Closure) do przechowywania identyfikatora timera w zmiennej timer.',
        'Przy każdym kolejnym wywołaniu anuluj poprzedni licznik za pomocą clearTimeout(timer).',
      ],
    },
  ];

  const [selectedTaskIdx, setSelectedTaskIdx] = useState(0);
  const currentTask = TASKS[selectedTaskIdx];

  const [userCode, setUserCode] = useState(currentTask.starterCode);
  const [secondsRemaining, setSecondsRemaining] = useState(currentTask.timeMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[] | null>(null);
  const [activeHintIdx, setActiveHintIdx] = useState<number>(-1);
  const [isCompleted, setIsCompleted] = useState<boolean>(() =>
    Boolean(currentUser.claimedRewards?.includes(`interview-${currentTask.id}`))
  );

  useEffect(() => {
    setIsCompleted(Boolean(currentUser.claimedRewards?.includes(`interview-${currentTask.id}`)));
  }, [currentTask.id, currentUser.claimedRewards]);

  // Timer tick
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      soundManager.playHeartLost();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  // Task Switch
  const handleSelectTask = (idx: number) => {
    setSelectedTaskIdx(idx);
    const task = TASKS[idx];
    setUserCode(task.starterCode);
    setSecondsRemaining(task.timeMinutes * 60);
    setIsTimerRunning(false);
    setTestResults(null);
    setActiveHintIdx(-1);
    setIsCompleted(Boolean(currentUser.claimedRewards?.includes(`interview-${task.id}`)));
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRunTests = () => {
    soundManager.playClick();
    const results: { passed: boolean; message: string }[] = [];
    let allPassed = true;

    try {
      if (currentTask.id === 'task-brackets') {
        // Execute code safely
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${userCode}; return isValidBrackets;`)();
        
        results.push({
          passed: fn('()[]{}') === true,
          message: 'Test 1: ()[]{} -> oczekiwano true',
        });
        results.push({
          passed: fn('{[()]}') === true,
          message: 'Test 2: {[()]} -> oczekiwano true',
        });
        results.push({
          passed: fn('(]') === false,
          message: 'Test 3: (] -> oczekiwano false',
        });
        results.push({
          passed: fn('([)]') === false,
          message: 'Test 4: ([)] -> oczekiwano false',
        });
        results.push({
          passed: fn('') === true,
          message: 'Test 5 (Ukryty Edge Case): pusty string -> oczekiwano true',
        });
      } else if (currentTask.id === 'task-groupby') {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${userCode}; return groupSpendingByPlan;`)();
        const res1 = fn([{ plan: 'monthly', amount: 49 }, { plan: 'monthly', amount: 49 }]);
        const res2 = fn([{ plan: 'monthly', amount: 50 }, { plan: 'yearly', amount: 100 }]);

        results.push({
          passed: res1?.monthly === 98,
          message: 'Test 1: podwójny plan monthly zsumowany do 98',
        });
        results.push({
          passed: res2?.monthly === 50 && res2?.yearly === 100,
          message: 'Test 2: rozdzielenie planów monthly i yearly',
        });
      } else {
        // Debounce test
        const codeWithoutComments = userCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${userCode}; return debounce;`)();
        const d = fn(() => {}, 100);
        results.push({
          passed: typeof d === 'function',
          message: 'Test 1: funkcja zwraca właściwy wrapper closure',
        });
        results.push({
          passed: /clearTimeout\s*\(/.test(codeWithoutComments) && /setTimeout\s*\(/.test(codeWithoutComments),
          message: 'Test 2: wykorzystano clearTimeout() oraz setTimeout() wewnątrz domknięcia',
        });
      }

      allPassed = results.every((r) => r.passed);
      setTestResults(results);

      if (allPassed) {
        awardCustomXp(
          currentTask.xpReward,
          `Zadanie Live Coding: ${currentTask.title}`,
          `interview-${currentTask.id}`
        );
        setIsCompleted(true);
        setIsTimerRunning(false);
        soundManager.playSuccess();
      } else {
        soundManager.playHeartLost();
      }
    } catch (err: any) {
      soundManager.playHeartLost();
      setTestResults([
        { passed: false, message: `Błąd wykonania kodu: ${err.message}` },
      ]);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Briefcase className="h-4 w-4" />
            <span>Symulator Rozmowy Technicznej</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Live Coding & Pytania Rekrutacyjne
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Poczuj atmosferę prawdziwej rozmowy kwalifikacyjnej: rozwiąż zadanie algorytmiczne w limicie czasu, przejdź testy automatyczne i zdobądź rekomendację Junior Developera.
          </p>
        </div>

        {/* Global Timer Card */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border font-mono text-base font-bold transition-all ${
            secondsRemaining < 120 
              ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 animate-pulse'
              : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <Clock className={`h-4 w-4 ${secondsRemaining < 120 ? 'text-rose-400' : 'text-slate-400'}`} />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isTimerRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/40'
            }`}
          >
            {isTimerRunning ? <Pause className="h-3.5 w-3.5 fill-white" /> : <Play className="h-3.5 w-3.5 fill-white" />}
            <span>{isTimerRunning ? 'Pauza' : 'Start'}</span>
          </button>
        </div>
      </div>

      {/* Task Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {TASKS.map((task, idx) => (
          <button
            key={task.id}
            type="button"
            onClick={() => handleSelectTask(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
              selectedTaskIdx === idx
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <span className="font-mono text-[10px] opacity-75">#{idx + 1}</span>
            <span>{task.title}</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
              task.difficulty === 'Junior'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-amber-500/20 text-amber-300'
            }`}>
              {task.difficulty}
            </span>
          </button>
        ))}
      </div>

      {/* Main Coding Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Editor & Test Runner (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col">
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-400">solution.js</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUserCode(currentTask.starterCode)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Resetuj</span>
                </button>
                <button
                  type="button"
                  onClick={handleRunTests}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/40"
                >
                  <Send className="h-3 w-3" />
                  <span>Testy (Submit)</span>
                </button>
              </div>
            </div>

            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              rows={12}
              spellCheck={false}
              className="w-full bg-[#0d1117] text-white font-mono text-xs p-4 focus:outline-none resize-none leading-relaxed selection:bg-indigo-600 selection:text-white"
            />
          </div>

          {/* Test Cases Feedback Box */}
          {testResults && (
            <div className={`p-4 rounded-2xl border ${
              isCompleted
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : 'bg-rose-950/30 border-rose-500/40'
            } space-y-2`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isCompleted ? 'text-emerald-300' : 'text-rose-300'
                }`}>
                  {isCompleted ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertCircle className="h-4 w-4 text-rose-400" />}
                  <span>{isCompleted ? 'Wszystkie Testy Zaliczone!' : 'Niektóre testy nie przeszły pomyślnie'}</span>
                </span>
                {isCompleted && (
                  <span className="text-xs font-mono font-bold text-amber-300">
                    +{currentTask.xpReward} XP Odblokowane!
                  </span>
                )}
              </div>

              <div className="space-y-1 text-xs font-mono pt-1">
                {testResults.map((t, i) => (
                  <div key={i} className={`flex items-center gap-2 ${t.passed ? 'text-emerald-300' : 'text-rose-300'}`}>
                    <span>{t.passed ? '✓' : '✗'}</span>
                    <span>{t.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Task Details & Interviewer Advice (1 col) */}
        <div className="space-y-4">
          
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Treść Zadania</span>
              <span className="text-xs text-indigo-400 font-bold">Nagroda: {currentTask.xpReward} XP</span>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {currentTask.description}
            </div>
          </div>

          {/* Hints Section */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-amber-400" />
                <span>Wskazówki Mentora:</span>
              </span>
            </div>

            <div className="space-y-2">
              {currentTask.hints.map((hint, hIdx) => {
                const isOpen = activeHintIdx >= hIdx;
                return (
                  <div key={hIdx} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
                    {isOpen ? (
                      <p className="text-slate-300 leading-relaxed">{hint}</p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveHintIdx(hIdx);
                          soundManager.playClick();
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold text-[11px] flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Odkryj wskazówkę #{hIdx + 1}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tech Lead Advice Card */}
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-4 text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <span className="font-bold text-indigo-300 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Porada Senior Developera:
            </span>
            <p className="text-[11px] text-slate-400">
              Na prawdziwym Live Codingu nie milcz! Mów na głos co robisz, jakie przypadki brzegowe bierzesz pod uwagę i jaka będzie złożoność czasowa Twojego algorytmu (Big-O).
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
