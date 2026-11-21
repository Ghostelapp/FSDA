import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { soundManager } from '../utils/audioFx';
import { compileSandboxedChallengeFunction } from '../utils/developerSimulators';
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
  const { currentUser, awardCustomXp, language } = useApp();
  const isEn = language === 'en';

  const TASKS_PL: InterviewTask[] = [
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

  const TASKS_EN: InterviewTask[] = [
    {
      id: 'task-brackets',
      title: 'Balanced Parentheses Validation',
      difficulty: 'Junior',
      timeMinutes: 15,
      xpReward: 80,
      description: `Frequent stage-1 technical interview challenge (Live Coding):
Write a function isValidBrackets(str) that checks whether all brackets '()', '{}', '[]' in the input string are properly paired and closed in the right order.
Return true if valid, false otherwise.`,
      starterCode: `function isValidBrackets(str) {
  // Complete using a stack (array):
  // Return true if (), {}, [] brackets match cleanly, otherwise false.
  return false;
}`,
      solutionCode: TASKS_PL[0].solutionCode,
      testCases: [
        { input: '"()[]{}"', expected: 'true', description: 'Sequential simple brackets' },
        { input: '"{[()]}"', expected: 'true', description: 'Nested brackets' },
        { input: '"(]"', expected: 'false', description: 'Mismatched bracket types' },
        { input: '"([)]"', expected: 'false', description: 'Incorrect interleaving' },
        { input: '""', expected: 'true', description: 'Empty string (Edge Case)', isHidden: true },
      ],
      hints: [
        'Use a LIFO Stack backed by an array with .push() / .pop().',
        'Push opening brackets onto the stack, and when encountering a closing bracket verify it matches the popped top item.',
      ],
    },
    {
      id: 'task-groupby',
      title: 'Group & Sum Data (Array Reduce)',
      difficulty: 'Junior/Mid',
      timeMinutes: 20,
      xpReward: 90,
      description: `Classic backend & frontend data-aggregation interview exercise:
Write groupSpendingByPlan(orders), accepting an array like:
[{ plan: 'monthly', amount: 49 }, { plan: 'yearly', amount: 99 }, { plan: 'monthly', amount: 49 }]
and returning an object summing amounts per plan:
{ monthly: 98, yearly: 99 }`,
      starterCode: `function groupSpendingByPlan(orders) {
  // Complete implementation (e.g. using orders.reduce):
  return {};
}`,
      solutionCode: TASKS_PL[1].solutionCode,
      testCases: [
        {
          input: `[{ plan: 'monthly', amount: 49 }, { plan: 'monthly', amount: 49 }]`,
          expected: `{"monthly":98}`,
          description: 'Summing two identical plans',
        },
        {
          input: `[{ plan: 'monthly', amount: 50 }, { plan: 'yearly', amount: 100 }]`,
          expected: `{"monthly":50,"yearly":100}`,
          description: 'Grouping distinct plans',
        },
      ],
      hints: [
        'Use orders.reduce((acc, curr) => ..., {}) initialized with an empty object {}.',
        'Add amount to the running bucket or initialize at 0: (acc[curr.plan] || 0) + curr.amount.',
      ],
    },
    {
      id: 'task-debounce',
      title: 'Implement Debounce Utility',
      difficulty: 'Mid',
      timeMinutes: 20,
      xpReward: 100,
      description: `A favorite JavaScript & performance interview question:
Write debounce(fn, delayMs) which delays invoking fn until delayMs milliseconds have elapsed since the last call.`,
      starterCode: `function debounce(fn, delayMs) {
  // Complete implementation:
  // Store timer ID inside closure and use clearTimeout + setTimeout
  return null;
}`,
      solutionCode: TASKS_PL[2].solutionCode,
      testCases: [
        { input: 'debounce(log, 200)', expected: 'Returns a wrapped debounced function', description: 'Valid closure wrapper' },
      ],
      hints: [
        'Capture a mutable timer ID variable inside the outer debounce closure.',
        'Cancel any pending scheduled execution on each call via clearTimeout(timer).',
      ],
    },
  ];

  const TASKS = isEn ? TASKS_EN : TASKS_PL;

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

  useEffect(() => {
    const otherStarter = (isEn ? TASKS_PL : TASKS_EN)[selectedTaskIdx]?.starterCode;
    setUserCode((prev) => (prev === otherStarter ? currentTask.starterCode : prev));
  }, [isEn, selectedTaskIdx, currentTask.starterCode]);

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
        const fn = compileSandboxedChallengeFunction(
          userCode,
          'isValidBrackets',
          [],
          [],
          language
        );
        
        results.push({
          passed: fn('()[]{}') === true,
          message: isEn ? 'Test 1: ()[]{} -> expected true' : 'Test 1: ()[]{} -> oczekiwano true',
        });
        results.push({
          passed: fn('{[()]}') === true,
          message: isEn ? 'Test 2: {[()]} -> expected true' : 'Test 2: {[()]} -> oczekiwano true',
        });
        results.push({
          passed: fn('(]') === false,
          message: isEn ? 'Test 3: (] -> expected false' : 'Test 3: (] -> oczekiwano false',
        });
        results.push({
          passed: fn('([)]') === false,
          message: isEn ? 'Test 4: ([)] -> expected false' : 'Test 4: ([)] -> oczekiwano false',
        });
        results.push({
          passed: fn('') === true,
          message: isEn ? 'Test 5 (Hidden Edge Case): empty string -> expected true' : 'Test 5 (Ukryty Edge Case): pusty string -> oczekiwano true',
        });
      } else if (currentTask.id === 'task-groupby') {
        const fn = compileSandboxedChallengeFunction(
          userCode,
          'groupSpendingByPlan',
          [],
          [],
          language
        );
        const res1 = fn([{ plan: 'monthly', amount: 49 }, { plan: 'monthly', amount: 49 }]) as Record<string, number> | null | undefined;
        const res2 = fn([{ plan: 'monthly', amount: 50 }, { plan: 'yearly', amount: 100 }]) as Record<string, number> | null | undefined;

        results.push({
          passed: res1?.monthly === 98,
          message: isEn ? 'Test 1: two monthly plans summed to 98' : 'Test 1: podwójny plan monthly zsumowany do 98',
        });
        results.push({
          passed: res2?.monthly === 50 && res2?.yearly === 100,
          message: isEn ? 'Test 2: separate monthly and yearly plan totals' : 'Test 2: rozdzielenie planów monthly i yearly',
        });
      } else {
        // Debounce test with synchronous timer verification
        const codeWithoutComments = userCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
        let capturedTimerFn: (() => void) | null = null;
        let clearedCount = 0;
        const mockSetTimeout = (cb: () => void) => {
          capturedTimerFn = cb;
          return 777;
        };
        const mockClearTimeout = () => {
          clearedCount++;
        };
        const fn = compileSandboxedChallengeFunction(
          userCode,
          'debounce',
          ['setTimeout', 'clearTimeout'],
          [mockSetTimeout, mockClearTimeout],
          language
        );

        let receivedArg = '';
        const d = fn((val: string) => {
          receivedArg = val;
        }, 100) as ((...args: unknown[]) => unknown) | unknown;

        results.push({
          passed: typeof d === 'function',
          message: isEn ? 'Test 1: returns a valid closure wrapper function' : 'Test 1: funkcja zwraca właściwy wrapper closure',
        });

        if (typeof d === 'function') {
          d('first');
          d('second');
          if (capturedTimerFn) {
            (capturedTimerFn as () => void)();
          }
        }

        results.push({
          passed:
            /clearTimeout\s*\(/.test(codeWithoutComments) &&
            /setTimeout\s*\(/.test(codeWithoutComments) &&
            clearedCount >= 1 &&
            receivedArg === 'second',
          message: isEn
            ? 'Test 2: cancels previous timer (clearTimeout) and invokes target callback with latest args'
            : 'Test 2: anuluje poprzedni timer (clearTimeout) i wywołuje docelowy callback z argumentami',
        });
      }

      allPassed = results.every((r) => r.passed);
      setTestResults(results);

      if (allPassed) {
        awardCustomXp(
          currentTask.xpReward,
          `${isEn ? 'Live Coding Challenge' : 'Zadanie Live Coding'}: ${currentTask.title}`,
          `interview-${currentTask.id}`,
          { code: userCode }
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
        { passed: false, message: `${isEn ? 'Code execution error' : 'Błąd wykonania kodu'}: ${err.message}` },
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
            <span>{isEn ? 'Technical Interview Simulator' : 'Symulator Rozmowy Technicznej'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isEn ? 'Live Coding & Interview Questions' : 'Live Coding & Pytania Rekrutacyjne'}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {isEn
              ? 'Simulate a real engineering interview: solve an algorithm under a countdown timer, pass automated unit tests, and build confidence.'
              : 'Poczuj atmosferę prawdziwej rozmowy kwalifikacyjnej: rozwiąż zadanie algorytmiczne w limicie czasu, przejdź testy automatyczne i zdobądź rekomendację Junior Developera.'}
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
            <span>{isTimerRunning ? (isEn ? 'Pause' : 'Pauza') : 'Start'}</span>
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
                  <span>{isEn ? 'Reset' : 'Resetuj'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleRunTests}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/40"
                >
                  <Send className="h-3 w-3" />
                  <span>{isEn ? 'Run Tests (Submit)' : 'Testy (Submit)'}</span>
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
          {testResults && (() => {
            const allTestsPassed = testResults.length > 0 && testResults.every((t) => t.passed);
            return (
              <div className={`p-4 rounded-2xl border ${
                allTestsPassed
                  ? 'bg-emerald-950/30 border-emerald-500/40'
                  : 'bg-rose-950/30 border-rose-500/40'
              } space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    allTestsPassed ? 'text-emerald-300' : 'text-rose-300'
                  }`}>
                    {allTestsPassed ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertCircle className="h-4 w-4 text-rose-400" />}
                    <span>
                      {allTestsPassed
                        ? isEn ? 'All Tests Passed!' : 'Wszystkie Testy Zaliczone!'
                        : isEn ? 'Some tests failed' : 'Niektóre testy nie przeszły pomyślnie'}
                    </span>
                  </span>
                  {allTestsPassed && (
                    <span className="text-xs font-mono font-bold text-amber-300">
                      +{currentTask.xpReward} XP {isEn ? 'Unlocked!' : 'Odblokowane!'}
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
            );
          })()}

        </div>

        {/* Task Details & Interviewer Advice (1 col) */}
        <div className="space-y-4">
          
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">{isEn ? 'Task Brief' : 'Treść Zadania'}</span>
              <span className="text-xs text-indigo-400 font-bold">{isEn ? 'Reward:' : 'Nagroda:'} {currentTask.xpReward} XP</span>
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
                <span>{isEn ? 'Mentor Hints:' : 'Wskazówki Mentora:'}</span>
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
                        <span>{isEn ? `Reveal hint #${hIdx + 1}` : `Odkryj wskazówkę #${hIdx + 1}`}</span>
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
              {isEn ? 'Senior Developer Tip:' : 'Porada Senior Developera:'}
            </span>
            <p className="text-[11px] text-slate-400">
              {isEn
                ? 'Never go silent in a real live-coding interview! Think out loud, explain edge cases you are checking, and mention time complexity (Big-O).'
                : 'Na prawdziwym Live Codingu nie milcz! Mów na głos co robisz, jakie przypadki brzegowe bierzesz pod uwagę i jaka będzie złożoność czasowa Twojego algorytmu (Big-O).'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
