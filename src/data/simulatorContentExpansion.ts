import type {
  DailyChallengeSpec,
  EventLoopScenario,
  FlashcardItem,
} from '../utils/developerSimulators';

// ============================================================================
// EXTRA EVENT LOOP SCENARIOS (3 additional PL + EN -> 5 total)
// ============================================================================

export const EXTRA_EVENT_LOOP_SCENARIOS: EventLoopScenario[] = [
  {
    id: 'nested-microtasks',
    title: 'Zagnieżdżone Microtasks vs setTimeout',
    difficulty: 'Rekrutacyjny',
    description:
      'Czy nowy Promise dodany WEWNĄTRZ innego .then() wykona się przed oczekującym setTimeout? Prześledź zasadę pełnego opróżniania kolejki Microtasków.',
    codeLines: [
      "setTimeout(() => console.log('1. Macrotask setTimeout'), 0);",
      'Promise.resolve().then(() => {',
      "  console.log('2. Pierwsze .then()');",
      "  Promise.resolve().then(() => console.log('3. Zagnieżdżone .then()'));",
      '});',
      "console.log('4. Koniec kodu synchronicznego');",
    ],
    steps: [
      {
        stepIndex: 0,
        activeLine: 1,
        phase: 'Web APIs',
        explanation:
          'setTimeout(0) rejestruje timer w Web APIs i niemal natychmiast przenosi callback do Macrotask Queue.',
        callStack: ['main()', 'setTimeout(..., 0)'],
        webApis: ['Timer (0ms) -> gotowy'],
        microtaskQueue: [],
        macrotaskQueue: ['() => console.log("1. Macrotask setTimeout")'],
        consoleOutput: [],
      },
      {
        stepIndex: 1,
        activeLine: 2,
        phase: 'Microtask Queue',
        explanation:
          'Pierwsze Promise.resolve().then(...) umieszcza swój callback w Microtask Queue.',
        callStack: ['main()', 'Promise.resolve().then(...)'],
        webApis: [],
        microtaskQueue: ['Callback: 2. Pierwsze .then()'],
        macrotaskQueue: ['() => console.log("1. Macrotask setTimeout")'],
        consoleOutput: [],
      },
      {
        stepIndex: 2,
        activeLine: 6,
        phase: 'Call Stack',
        explanation:
          'Wykonuje się synchroniczny console.log("4. Koniec kodu synchronicznego") i główny skrypt main() schodzi ze stosu.',
        callStack: ['main()', 'console.log("4. Koniec...")'],
        webApis: [],
        microtaskQueue: ['Callback: 2. Pierwsze .then()'],
        macrotaskQueue: ['() => console.log("1. Macrotask setTimeout")'],
        consoleOutput: ['4. Koniec kodu synchronicznego'],
      },
      {
        stepIndex: 3,
        activeLine: 3,
        phase: 'Microtask Queue',
        explanation:
          'Event Loop pobiera pierwszy Microtask: wypisuje "2. Pierwsze .then()" i rejestruje KOLEJNY Microtask ("3. Zagnieżdżone .then()").',
        callStack: ['thenCallback1()', 'console.log("2. Pierwsze .then()")'],
        webApis: [],
        microtaskQueue: ['Callback: 3. Zagnieżdżone .then()'],
        macrotaskQueue: ['() => console.log("1. Macrotask setTimeout")'],
        consoleOutput: ['4. Koniec kodu synchronicznego', '2. Pierwsze .then()'],
      },
      {
        stepIndex: 4,
        activeLine: 4,
        phase: 'Microtask Queue',
        explanation:
          'Zanim Event Loop przejdzie do setTimeout, musi opróżnić NOWY element z Microtask Queue — dlatego "3. Zagnieżdżone .then()" wyprzedza Macrotask!',
        callStack: ['thenCallback2()', 'console.log("3. Zagnieżdżone .then()")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: ['() => console.log("1. Macrotask setTimeout")'],
        consoleOutput: [
          '4. Koniec kodu synchronicznego',
          '2. Pierwsze .then()',
          '3. Zagnieżdżone .then()',
        ],
      },
      {
        stepIndex: 5,
        activeLine: 1,
        phase: 'Macrotask Queue',
        explanation:
          'Dopiero gdy Microtask Queue jest całkowicie pusta, Event Loop uruchamia callback z setTimeout.',
        callStack: ['timeoutCallback()', 'console.log("1. Macrotask setTimeout")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: [
          '4. Koniec kodu synchronicznego',
          '2. Pierwsze .then()',
          '3. Zagnieżdżone .then()',
          '1. Macrotask setTimeout',
        ],
      },
    ],
  },
  {
    id: 'queue-microtask-ui',
    title: 'queueMicrotask() vs stan ładowania UI',
    difficulty: 'Średniozaawansowany',
    description:
      'Jak przeglądarka rozdziela natychmiastową aktualizację stanu UI, kolejkę queueMicrotask i odroczone zadanie setTimeout.',
    codeLines: [
      "console.log('UI: Pokaż spinner ładowania');",
      "queueMicrotask(() => console.log('Microtask: Walidacja sesji'));",
      "setTimeout(() => console.log('Macrotask: Analityka w tle'), 0);",
      "console.log('UI: Zakończ render ramki');",
    ],
    steps: [
      {
        stepIndex: 0,
        activeLine: 1,
        phase: 'Call Stack',
        explanation: 'Pierwsze wywołanie synchroniczne ustawia stan ładowania na ekranie.',
        callStack: ['main()', 'console.log("UI: Pokaż spinner...")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: ['UI: Pokaż spinner ładowania'],
      },
      {
        stepIndex: 1,
        activeLine: 2,
        phase: 'Microtask Queue',
        explanation:
          'queueMicrotask() planuje lekkie zadanie w kolejce Microtask Queue tuż po zakończeniu bieżącego stosu.',
        callStack: ['main()', 'queueMicrotask(...)'],
        webApis: [],
        microtaskQueue: ['() => console.log("Microtask: Walidacja sesji")'],
        macrotaskQueue: [],
        consoleOutput: ['UI: Pokaż spinner ładowania'],
      },
      {
        stepIndex: 2,
        activeLine: 3,
        phase: 'Web APIs',
        explanation: 'setTimeout trafia do Web APIs i kolejkuje wysyłkę analityki jako Macrotask.',
        callStack: ['main()', 'setTimeout(..., 0)'],
        webApis: ['Timer (0ms) -> gotowy'],
        microtaskQueue: ['() => console.log("Microtask: Walidacja sesji")'],
        macrotaskQueue: ['() => console.log("Macrotask: Analityka w tle")'],
        consoleOutput: ['UI: Pokaż spinner ładowania'],
      },
      {
        stepIndex: 3,
        activeLine: 4,
        phase: 'Call Stack',
        explanation: 'Zamyka się główny kod synchroniczny funkcji zdarzenia.',
        callStack: ['main()', 'console.log("UI: Zakończ render ramki")'],
        webApis: [],
        microtaskQueue: ['() => console.log("Microtask: Walidacja sesji")'],
        macrotaskQueue: ['() => console.log("Macrotask: Analityka w tle")'],
        consoleOutput: ['UI: Pokaż spinner ładowania', 'UI: Zakończ render ramki'],
      },
      {
        stepIndex: 4,
        activeLine: 2,
        phase: 'Microtask Queue',
        explanation: 'Walidacja sesji z queueMicrotask wykonuje się przed kolejnym Macrotaskiem i przed odmalowaniem klatki.',
        callStack: ['microtaskFn()', 'console.log("Microtask: Walidacja sesji")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: ['() => console.log("Macrotask: Analityka w tle")'],
        consoleOutput: [
          'UI: Pokaż spinner ładowania',
          'UI: Zakończ render ramki',
          'Microtask: Walidacja sesji',
        ],
      },
      {
        stepIndex: 5,
        activeLine: 3,
        phase: 'Macrotask Queue',
        explanation: 'Na końcu, w kolejnym cyklu Event Loop, wykonywana jest analityka z Macrotask Queue.',
        callStack: ['timeoutCallback()', 'console.log("Macrotask: Analityka w tle")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: [
          'UI: Pokaż spinner ładowania',
          'UI: Zakończ render ramki',
          'Microtask: Walidacja sesji',
          'Macrotask: Analityka w tle',
        ],
      },
    ],
  },
  {
    id: 'fetch-and-render',
    title: 'Kolejność wykonania fetch() + try / finally',
    difficulty: 'Średniozaawansowany',
    description:
      'Śledzenie prawdziwego zapytania fetch() w przeglądarce: blok synchroniczny, oczekiwanie w Web APIs i wznowienie w Microtask Queue.',
    codeLines: [
      "console.log('1. Start komponentu');",
      "fetch('/api/kursy').then(() => console.log('3. Odpowiedź z serwera'));",
      "Promise.resolve().then(() => console.log('2. Cache lokalny gotowy'));",
    ],
    steps: [
      {
        stepIndex: 0,
        activeLine: 1,
        phase: 'Call Stack',
        explanation: 'Komponent uruchamia się i synchronicznie loguje start.',
        callStack: ['render()', 'console.log("1. Start komponentu")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: ['1. Start komponentu'],
      },
      {
        stepIndex: 1,
        activeLine: 2,
        phase: 'Web APIs',
        explanation:
          'fetch("/api/kursy") zleca żądanie sieciowe przeglądarce (Web APIs), nie blokując głównego wątku JS.',
        callStack: ['render()', 'fetch("/api/kursy")'],
        webApis: ['HTTP GET /api/kursy (w toku...)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: ['1. Start komponentu'],
      },
      {
        stepIndex: 2,
        activeLine: 3,
        phase: 'Microtask Queue',
        explanation:
          'Rozstrzygnięty natychmiast Promise.resolve().then(...) trafia od razu do Microtask Queue.',
        callStack: ['render()'],
        webApis: ['HTTP GET /api/kursy (w toku...)'],
        microtaskQueue: ['() => console.log("2. Cache lokalny gotowy")'],
        macrotaskQueue: [],
        consoleOutput: ['1. Start komponentu'],
      },
      {
        stepIndex: 3,
        activeLine: 3,
        phase: 'Microtask Queue',
        explanation:
          'Po zejściu render() ze stosu, lokalny Microtask wykonuje się natychmiast zanim dotrze odpowiedź sieciowa.',
        callStack: ['cacheCallback()'],
        webApis: ['HTTP GET /api/kursy (odebrano 200 OK)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: ['1. Start komponentu', '2. Cache lokalny gotowy'],
      },
      {
        stepIndex: 4,
        activeLine: 2,
        phase: 'Microtask Queue',
        explanation:
          'Gdy sieć zwraca dane, callback .then() z fetcha zostaje przeniesiony do Microtask Queue i wypisuje odpowiedź serwera.',
        callStack: ['fetchCallback()', 'console.log("3. Odpowiedź z serwera")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: [
          '1. Start komponentu',
          '2. Cache lokalny gotowy',
          '3. Odpowiedź z serwera',
        ],
      },
    ],
  },
];

export const EXTRA_EVENT_LOOP_SCENARIOS_EN: (EventLoopScenario & { displayDifficulty: string })[] = [
  {
    id: 'nested-microtasks',
    title: 'Nested Microtasks vs setTimeout',
    difficulty: 'Rekrutacyjny',
    displayDifficulty: 'Interview Prep',
    description:
      'Does a new Promise queued INSIDE another .then() run before a pending setTimeout? Trace full Microtask Queue draining.',
    codeLines: [
      "setTimeout(() => console.log('1. Macrotask setTimeout'), 0);",
      'Promise.resolve().then(() => {',
      "  console.log('2. First .then()');",
      "  Promise.resolve().then(() => console.log('3. Nested .then()'));",
      '});',
      "console.log('4. Synchronous code finished');",
    ],
    steps: [
      {
        stepIndex: 0,
        activeLine: 1,
        phase: 'Web APIs',
        explanation:
          'setTimeout(0) registers a timer in Web APIs and queues its callback in the Macrotask Queue.',
        callStack: ['main()', 'setTimeout(..., 0)'],
        webApis: ['Timer (0ms) -> ready'],
        microtaskQueue: [],
        macrotaskQueue: ['() => console.log("1. Macrotask setTimeout")'],
        consoleOutput: [],
      },
      {
        stepIndex: 1,
        activeLine: 2,
        phase: 'Microtask Queue',
        explanation: 'The outer Promise.resolve().then(...) places its callback into Microtask Queue.',
        callStack: ['main()', 'Promise.resolve().then(...)'],
        webApis: [],
        microtaskQueue: ['Callback: 2. First .then()'],
        macrotaskQueue: ['() => console.log("1. Macrotask setTimeout")'],
        consoleOutput: [],
      },
      {
        stepIndex: 2,
        activeLine: 6,
        phase: 'Call Stack',
        explanation: 'Synchronous console.log("4. Synchronous code finished") runs and main() completes.',
        callStack: ['main()', 'console.log("4. Synchronous...")'],
        webApis: [],
        microtaskQueue: ['Callback: 2. First .then()'],
        macrotaskQueue: ['() => console.log("1. Macrotask setTimeout")'],
        consoleOutput: ['4. Synchronous code finished'],
      },
      {
        stepIndex: 3,
        activeLine: 3,
        phase: 'Microtask Queue',
        explanation:
          'The Event Loop dequeues the first Microtask, prints "2. First .then()", and schedules ANOTHER Microtask ("3. Nested .then()").',
        callStack: ['thenCallback1()', 'console.log("2. First .then()")'],
        webApis: [],
        microtaskQueue: ['Callback: 3. Nested .then()'],
        macrotaskQueue: ['() => console.log("1. Macrotask setTimeout")'],
        consoleOutput: ['4. Synchronous code finished', '2. First .then()'],
      },
      {
        stepIndex: 4,
        activeLine: 4,
        phase: 'Microtask Queue',
        explanation:
          'Before touching any Macrotask, the Event Loop drains the newly added Microtask — so "3. Nested .then()" still beats setTimeout!',
        callStack: ['thenCallback2()', 'console.log("3. Nested .then()")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: ['() => console.log("1. Macrotask setTimeout")'],
        consoleOutput: [
          '4. Synchronous code finished',
          '2. First .then()',
          '3. Nested .then()',
        ],
      },
      {
        stepIndex: 5,
        activeLine: 1,
        phase: 'Macrotask Queue',
        explanation:
          'Only after Microtask Queue is completely empty does Event Loop pick the setTimeout callback.',
        callStack: ['timeoutCallback()', 'console.log("1. Macrotask setTimeout")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: [
          '4. Synchronous code finished',
          '2. First .then()',
          '3. Nested .then()',
          '1. Macrotask setTimeout',
        ],
      },
    ],
  },
  {
    id: 'queue-microtask-ui',
    title: 'queueMicrotask() vs UI Loading State',
    difficulty: 'Średniozaawansowany',
    displayDifficulty: 'Practical',
    description:
      'See how the browser orders synchronous UI updates, queueMicrotask(), and deferred setTimeout work.',
    codeLines: [
      "console.log('UI: Show loading spinner');",
      "queueMicrotask(() => console.log('Microtask: Verify session'));",
      "setTimeout(() => console.log('Macrotask: Background analytics'), 0);",
      "console.log('UI: Finish frame setup');",
    ],
    steps: [
      {
        stepIndex: 0,
        activeLine: 1,
        phase: 'Call Stack',
        explanation: 'The first synchronous call marks the loading state.',
        callStack: ['main()', 'console.log("UI: Show loading...")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: ['UI: Show loading spinner'],
      },
      {
        stepIndex: 1,
        activeLine: 2,
        phase: 'Microtask Queue',
        explanation: 'queueMicrotask() schedules a lightweight task right after the current Call Stack clears.',
        callStack: ['main()', 'queueMicrotask(...)'],
        webApis: [],
        microtaskQueue: ['() => console.log("Microtask: Verify session")'],
        macrotaskQueue: [],
        consoleOutput: ['UI: Show loading spinner'],
      },
      {
        stepIndex: 2,
        activeLine: 3,
        phase: 'Web APIs',
        explanation: 'setTimeout schedules background analytics in the Macrotask Queue.',
        callStack: ['main()', 'setTimeout(..., 0)'],
        webApis: ['Timer (0ms) -> ready'],
        microtaskQueue: ['() => console.log("Microtask: Verify session")'],
        macrotaskQueue: ['() => console.log("Macrotask: Background analytics")'],
        consoleOutput: ['UI: Show loading spinner'],
      },
      {
        stepIndex: 3,
        activeLine: 4,
        phase: 'Call Stack',
        explanation: 'Synchronous handler code finishes.',
        callStack: ['main()', 'console.log("UI: Finish frame setup")'],
        webApis: [],
        microtaskQueue: ['() => console.log("Microtask: Verify session")'],
        macrotaskQueue: ['() => console.log("Macrotask: Background analytics")'],
        consoleOutput: ['UI: Show loading spinner', 'UI: Finish frame setup'],
      },
      {
        stepIndex: 4,
        activeLine: 2,
        phase: 'Microtask Queue',
        explanation: 'The queued microtask runs before any macrotask or next paint.',
        callStack: ['microtaskFn()', 'console.log("Microtask: Verify session")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: ['() => console.log("Macrotask: Background analytics")'],
        consoleOutput: [
          'UI: Show loading spinner',
          'UI: Finish frame setup',
          'Microtask: Verify session',
        ],
      },
      {
        stepIndex: 5,
        activeLine: 3,
        phase: 'Macrotask Queue',
        explanation: 'Finally, background analytics runs on the next Event Loop turn.',
        callStack: ['timeoutCallback()', 'console.log("Macrotask: Background analytics")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: [
          'UI: Show loading spinner',
          'UI: Finish frame setup',
          'Microtask: Verify session',
          'Macrotask: Background analytics',
        ],
      },
    ],
  },
  {
    id: 'fetch-and-render',
    title: 'fetch() + Cache Promise Ordering',
    difficulty: 'Średniozaawansowany',
    displayDifficulty: 'Intermediate',
    description:
      'Trace a real browser network fetch() alongside an immediately resolved cache Promise.',
    codeLines: [
      "console.log('1. Component mounted');",
      "fetch('/api/courses').then(() => console.log('3. Server response'));",
      "Promise.resolve().then(() => console.log('2. Local cache ready'));",
    ],
    steps: [
      {
        stepIndex: 0,
        activeLine: 1,
        phase: 'Call Stack',
        explanation: 'Component mounts and logs synchronously.',
        callStack: ['render()', 'console.log("1. Component mounted")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: ['1. Component mounted'],
      },
      {
        stepIndex: 1,
        activeLine: 2,
        phase: 'Web APIs',
        explanation: 'fetch() delegates the HTTP request to browser Web APIs without blocking JS.',
        callStack: ['render()', 'fetch("/api/courses")'],
        webApis: ['HTTP GET /api/courses (pending...)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: ['1. Component mounted'],
      },
      {
        stepIndex: 2,
        activeLine: 3,
        phase: 'Microtask Queue',
        explanation: 'The already-resolved cache Promise queues its .then() handler immediately.',
        callStack: ['render()'],
        webApis: ['HTTP GET /api/courses (pending...)'],
        microtaskQueue: ['() => console.log("2. Local cache ready")'],
        macrotaskQueue: [],
        consoleOutput: ['1. Component mounted'],
      },
      {
        stepIndex: 3,
        activeLine: 3,
        phase: 'Microtask Queue',
        explanation: 'Cache reaction executes as soon as Call Stack clears.',
        callStack: ['cacheCallback()'],
        webApis: ['HTTP GET /api/courses (200 OK received)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: ['1. Component mounted', '2. Local cache ready'],
      },
      {
        stepIndex: 4,
        activeLine: 2,
        phase: 'Microtask Queue',
        explanation: 'Once network completes, the fetch .then() handler runs from Microtask Queue.',
        callStack: ['fetchCallback()', 'console.log("3. Server response")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: [
          '1. Component mounted',
          '2. Local cache ready',
          '3. Server response',
        ],
      },
    ],
  },
];

// ============================================================================
// EXTRA DAILY CHALLENGES (12 additional PL + EN -> 14 total = 2-week rotation)
// ============================================================================

export const EXTRA_DAILY_CHALLENGES: DailyChallengeSpec[] = [
  {
    id: 'challenge-palindrome',
    title: 'Sprawdź czy napis jest palindromem',
    xpReward: 100,
    description:
      'Napisz funkcję czyPalindrom(str), która zwraca true, jeśli napis czytany od przodu i od tyłu brzmi tak samo (ignorując wielkość liter oraz znaki inne niż litery/cyfry), lub false w przeciwnym razie.',
    starterCode: `function czyPalindrom(str) {\n  // Oczyść napis ze spacji/interpunkcji, zamień na małe litery i porównaj z odwróconym\n  return false;\n}`,
    solutionCode: `function czyPalindrom(str) {\n  const clean = String(str).toLowerCase().replace(/[^a-z0-9]/g, '');\n  return clean === clean.split('').reverse().join('');\n}`,
    testCases: [
      { inputDesc: 'czyPalindrom("Kajak")', args: ['Kajak'], expected: true },
      { inputDesc: 'czyPalindrom("A man, a plan, a canal: Panama")', args: ['A man, a plan, a canal: Panama'], expected: true },
      { inputDesc: 'czyPalindrom("Frontend")', args: ['Frontend'], expected: false },
    ],
  },
  {
    id: 'challenge-unique-sorted',
    title: 'Unikalne liczby posortowane rosnąco',
    xpReward: 100,
    description:
      'Napisz funkcję unikalnePosortowane(arr), która usuwa duplikaty z tablicy liczb i zwraca nową tablicę posortowaną rosnąco.',
    starterCode: `function unikalnePosortowane(arr) {\n  // Użyj Set oraz .sort((a, b) => a - b)\n  return [];\n}`,
    solutionCode: `function unikalnePosortowane(arr) {\n  return Array.from(new Set(arr)).sort((a, b) => a - b);\n}`,
    testCases: [
      { inputDesc: 'unikalnePosortowane([10, 2, 10, 5, 2])', args: [[10, 2, 10, 5, 2]], expected: [2, 5, 10] },
      { inputDesc: 'unikalnePosortowane([-3, 0, -3, 12, 1])', args: [[-3, 0, -3, 12, 1]], expected: [-3, 0, 1, 12] },
      { inputDesc: 'unikalnePosortowane([])', args: [[]], expected: [] },
    ],
  },
  {
    id: 'challenge-count-vowels',
    title: 'Zlicz samogłoski w tekście',
    xpReward: 90,
    description:
      'Napisz funkcję policzSamogloski(text), która zwraca łączną liczbę samogłosek (a, e, i, o, u, y — niezależnie od wielkości liter) w przekazanym napisie.',
    starterCode: `function policzSamogloski(text) {\n  // Zlicz wystąpienia samogłosek a, e, i, o, u, y\n  return -1;\n}`,
    solutionCode: `function policzSamogloski(text) {\n  const matches = String(text).toLowerCase().match(/[aeiouy]/g);\n  return matches ? matches.length : 0;\n}`,
    testCases: [
      { inputDesc: 'policzSamogloski("Full Stack")', args: ['Full Stack'], expected: 2 },
      { inputDesc: 'policzSamogloski("TypeScript")', args: ['TypeScript'], expected: 3 },
      { inputDesc: 'policzSamogloski("bcdfg")', args: ['bcdfg'], expected: 0 },
    ],
  },
  {
    id: 'challenge-second-largest',
    title: 'Druga największa unikalna liczba',
    xpReward: 120,
    description:
      'Napisz funkcję drugaNajwieksza(nums), która zwraca drugą co do wielkości unikalną liczbę z tablicy lub null, jeśli tablica ma mniej niż 2 różne wartości.',
    starterCode: `function drugaNajwieksza(nums) {\n  // Odfiltruj unikalne wartości, posortuj malejąco i zwróć indeks 1 albo null\n  return undefined;\n}`,
    solutionCode: `function drugaNajwieksza(nums) {\n  const unique = Array.from(new Set(nums)).sort((a, b) => b - a);\n  return unique.length >= 2 ? unique[1] : null;\n}`,
    testCases: [
      { inputDesc: 'drugaNajwieksza([10, 5, 20, 20, 8])', args: [[10, 5, 20, 20, 8]], expected: 10 },
      { inputDesc: 'drugaNajwieksza([4, 4, 4])', args: [[4, 4, 4]], expected: null },
      { inputDesc: 'drugaNajwieksza([-10, -2, -5])', args: [[-10, -2, -5]], expected: -5 },
    ],
  },
  {
    id: 'challenge-camel-case',
    title: 'Konwersja kebab-case na camelCase',
    xpReward: 110,
    description:
      'Napisz funkcję naCamelCase(str), która przekształca nazwę stylu CSS zapisaną w kebab-case (np. "background-color") na camelCase ("backgroundColor").',
    starterCode: `function naCamelCase(str) {\n  // Zamień myślniki i pierwszą literę kolejnego słowa na wielką\n  return '';\n}`,
    solutionCode: `function naCamelCase(str) {\n  return String(str)\n    .split('-')\n    .filter(Boolean)\n    .map((part, idx) => (idx === 0 ? part.toLowerCase() : part[0].toUpperCase() + part.slice(1).toLowerCase()))\n    .join('');\n}`,
    testCases: [
      { inputDesc: 'naCamelCase("background-color")', args: ['background-color'], expected: 'backgroundColor' },
      { inputDesc: 'naCamelCase("border-top-left-radius")', args: ['border-top-left-radius'], expected: 'borderTopLeftRadius' },
      { inputDesc: 'naCamelCase("margin")', args: ['margin'], expected: 'margin' },
    ],
  },
  {
    id: 'challenge-chunk-array',
    title: 'Podziel tablicę na paczki (Chunk)',
    xpReward: 110,
    description:
      'Napisz funkcję podzielNaPaczki(arr, size), która dzieli tablicę na mniejsze podtablice o maksymalnej długości size.',
    starterCode: `function podzielNaPaczki(arr, size) {\n  // Podziel arr na kawałki po size elementów\n  return null;\n}`,
    solutionCode: `function podzielNaPaczki(arr, size) {\n  if (size <= 0) return [];\n  const out = [];\n  for (let i = 0; i < arr.length; i += size) {\n    out.push(arr.slice(i, i + size));\n  }\n  return out;\n}`,
    testCases: [
      { inputDesc: 'podzielNaPaczki([1, 2, 3, 4, 5], 2)', args: [[1, 2, 3, 4, 5], 2], expected: [[1, 2], [3, 4], [5]] },
      { inputDesc: 'podzielNaPaczki(["a", "b", "c"], 3)', args: [['a', 'b', 'c'], 3], expected: [['a', 'b', 'c']] },
      { inputDesc: 'podzielNaPaczki([], 2)', args: [[], 2], expected: [] },
    ],
  },
  {
    id: 'challenge-most-frequent',
    title: 'Najczęstszy element w tablicy (HashMap)',
    xpReward: 120,
    description:
      'Napisz funkcję najczestszyElement(arr), która znajduje element występujący w tablicy najczęściej (dla pustej tablicy zwróć null).',
    starterCode: `function najczestszyElement(arr) {\n  // Zlicz wystąpienia każdego elementu w obiekcie lub Mapie\n  return undefined;\n}`,
    solutionCode: `function najczestszyElement(arr) {\n  if (!arr.length) return null;\n  const counts = new Map();\n  let best = arr[0];\n  let maxCount = 0;\n  for (const item of arr) {\n    const next = (counts.get(item) || 0) + 1;\n    counts.set(item, next);\n    if (next > maxCount) {\n      maxCount = next;\n      best = item;\n    }\n  }\n  return best;\n}`,
    testCases: [
      { inputDesc: 'najczestszyElement(["js", "ts", "js", "react", "js"])', args: [['js', 'ts', 'js', 'react', 'js']], expected: 'js' },
      { inputDesc: 'najczestszyElement([3, 7, 3, 2, 7, 7])', args: [[3, 7, 3, 2, 7, 7]], expected: 7 },
      { inputDesc: 'najczestszyElement([])', args: [[]], expected: null },
    ],
  },
  {
    id: 'challenge-flatten-once',
    title: 'Spłaszcz jeden poziom tablicy',
    xpReward: 95,
    description:
      'Napisz funkcję splaszczRaz(arr), która spłaszcza dokładnie jeden poziom zagnieżdżenia tablicy (np. [1, [2, 3], [4, [5]]] -> [1, 2, 3, 4, [5]]).',
    starterCode: `function splaszczRaz(arr) {\n  // Rozpakuj bezpośrednie podtablice dokładnie o 1 poziom\n  return null;\n}`,
    solutionCode: `function splaszczRaz(arr) {\n  const res = [];\n  for (const item of arr) {\n    if (Array.isArray(item)) res.push(...item);\n    else res.push(item);\n  }\n  return res;\n}`,
    testCases: [
      { inputDesc: 'splaszczRaz([1, [2, 3], 4])', args: [[1, [2, 3], 4]], expected: [1, 2, 3, 4] },
      { inputDesc: 'splaszczRaz([[1, 2], [3, [4]]])', args: [[[1, 2], [3, [4]]]], expected: [1, 2, 3, [4]] },
      { inputDesc: 'splaszczRaz([])', args: [[]], expected: [] },
    ],
  },
  {
    id: 'challenge-clamp-number',
    title: 'Ogranicz liczbę do przedziału (clamp)',
    xpReward: 85,
    description:
      'Napisz funkcję ograniczZakres(val, min, max), która pilnuje, by val mieściło się w przedziale [min, max].',
    starterCode: `function ograniczZakres(val, min, max) {\n  // Zwróć min jeśli val < min, max jeśli val > max, w innym razie val\n  return null;\n}`,
    solutionCode: `function ograniczZakres(val, min, max) {\n  return Math.min(Math.max(val, min), max);\n}`,
    testCases: [
      { inputDesc: 'ograniczZakres(150, 0, 100)', args: [150, 0, 100], expected: 100 },
      { inputDesc: 'ograniczZakres(-12, 0, 100)', args: [-12, 0, 100], expected: 0 },
      { inputDesc: 'ograniczZakres(42, 0, 100)', args: [42, 0, 100], expected: 42 },
    ],
  },
  {
    id: 'challenge-merge-totals',
    title: 'Zsumuj wydatki według kategorii',
    xpReward: 125,
    description:
      'Napisz funkcję sumujKategorie(items), która przyjmuje tablicę obiektów { category, amount } i zwraca obiekt sumujący kwoty dla każdej kategorii.',
    starterCode: `function sumujKategorie(items) {\n  // Pogrupuj elementy i zsumuj pola amount dla każdej kategorii\n  return null;\n}`,
    solutionCode: `function sumujKategorie(items) {\n  const totals = {};\n  for (const item of items) {\n    totals[item.category] = (totals[item.category] || 0) + item.amount;\n  }\n  return totals;\n}`,
    testCases: [
      {
        inputDesc: 'sumujKategorie([{category:"hosting",amount:20},{category:"domena",amount:50},{category:"hosting",amount:30}])',
        args: [[{ category: 'hosting', amount: 20 }, { category: 'domena', amount: 50 }, { category: 'hosting', amount: 30 }]],
        expected: { hosting: 50, domena: 50 },
      },
      {
        inputDesc: 'sumujKategorie([{category:"kurs",amount:0}])',
        args: [[{ category: 'kurs', amount: 0 }]],
        expected: { kurs: 0 },
      },
      { inputDesc: 'sumujKategorie([])', args: [[]], expected: {} },
    ],
  },
  {
    id: 'challenge-valid-brackets',
    title: 'Walidacja nawiasów za pomocą Stosu (Stack)',
    xpReward: 140,
    description:
      'Klasyczne zadanie rekrutacyjne! Napisz funkcję poprawneNawiasy(str), która sprawdza, czy nawiasy (), [] i {} są poprawnie otwarte i zamknięte we właściwej kolejności.',
    starterCode: `function poprawneNawiasy(str) {\n  // Użyj tablicy jako stosu (push/pop) oraz mapy par nawiasów\n  return false;\n}`,
    solutionCode: `function poprawneNawiasy(str) {\n  const pairs = { ')': '(', ']': '[', '}': '{' };\n  const stack = [];\n  for (const ch of str) {\n    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);\n    else if (pairs[ch]) {\n      if (stack.pop() !== pairs[ch]) return false;\n    }\n  }\n  return stack.length === 0;\n}`,
    testCases: [
      { inputDesc: 'poprawneNawiasy("({[]})")', args: ['({[]})'], expected: true },
      { inputDesc: 'poprawneNawiasy("([)]")', args: ['([)]'], expected: false },
      { inputDesc: 'poprawneNawiasy("((")', args: ['(('], expected: false },
    ],
  },
  {
    id: 'challenge-capitalize-words',
    title: 'Wielka pierwsza litera każdego słowa',
    xpReward: 95,
    description:
      'Napisz funkcję wielkaPierwszaLitera(sentence), która zamienia pierwszą literę każdego słowa w zdaniu na wielką, a pozostałe litery słowa na małe.',
    starterCode: `function wielkaPierwszaLitera(sentence) {\n  // Rozbij zdanie po spacjach, sformatuj każde słowo i połącz\n  return null;\n}`,
    solutionCode: `function wielkaPierwszaLitera(sentence) {\n  if (!sentence.trim()) return '';\n  return sentence\n    .trim()\n    .split(/\\s+/)\n    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())\n    .join(' ');\n}`,
    testCases: [
      { inputDesc: 'wielkaPierwszaLitera("full stack academy")', args: ['full stack academy'], expected: 'Full Stack Academy' },
      { inputDesc: 'wielkaPierwszaLitera("hELLO wORLD")', args: ['hELLO wORLD'], expected: 'Hello World' },
      { inputDesc: 'wielkaPierwszaLitera("")', args: [''], expected: '' },
    ],
  },
];

export const EXTRA_DAILY_CHALLENGES_EN: DailyChallengeSpec[] = [
  {
    id: 'challenge-palindrome',
    title: 'Check Valid Palindrome',
    xpReward: 100,
    description:
      'Write a function czyPalindrom(str) returning true if the string reads identically forward and backward (ignoring case and non-alphanumeric chars), or false otherwise.',
    starterCode: `function czyPalindrom(str) {\n  // Clean non-alphanumeric characters, lowercase, and compare with reversed string\n  return false;\n}`,
    solutionCode: EXTRA_DAILY_CHALLENGES[0].solutionCode,
    testCases: EXTRA_DAILY_CHALLENGES[0].testCases,
  },
  {
    id: 'challenge-unique-sorted',
    title: 'Unique Sorted Numbers',
    xpReward: 100,
    description:
      'Write a function unikalnePosortowane(arr) that removes duplicate numbers and returns a new array sorted ascending.',
    starterCode: `function unikalnePosortowane(arr) {\n  // Deduplicate with Set and sort numerically\n  return [];\n}`,
    solutionCode: EXTRA_DAILY_CHALLENGES[1].solutionCode,
    testCases: EXTRA_DAILY_CHALLENGES[1].testCases,
  },
  {
    id: 'challenge-count-vowels',
    title: 'Count Vowels in a String',
    xpReward: 90,
    description:
      'Write a function policzSamogloski(text) returning the total count of vowels (a, e, i, o, u, y — case-insensitive).',
    starterCode: `function policzSamogloski(text) {\n  // Count all vowels a, e, i, o, u, y\n  return -1;\n}`,
    solutionCode: EXTRA_DAILY_CHALLENGES[2].solutionCode,
    testCases: EXTRA_DAILY_CHALLENGES[2].testCases,
  },
  {
    id: 'challenge-second-largest',
    title: 'Second Largest Unique Number',
    xpReward: 120,
    description:
      'Write a function drugaNajwieksza(nums) returning the second largest unique number, or null if fewer than 2 distinct numbers exist.',
    starterCode: `function drugaNajwieksza(nums) {\n  // Deduplicate, sort descending, and return index 1 or null\n  return undefined;\n}`,
    solutionCode: EXTRA_DAILY_CHALLENGES[3].solutionCode,
    testCases: EXTRA_DAILY_CHALLENGES[3].testCases,
  },
  {
    id: 'challenge-camel-case',
    title: 'Convert kebab-case to camelCase',
    xpReward: 110,
    description:
      'Write a function naCamelCase(str) converting CSS-style kebab-case strings (e.g. "background-color") to camelCase ("backgroundColor").',
    starterCode: `function naCamelCase(str) {\n  // Split on hyphens and capitalize subsequent segments\n  return '';\n}`,
    solutionCode: EXTRA_DAILY_CHALLENGES[4].solutionCode,
    testCases: EXTRA_DAILY_CHALLENGES[4].testCases,
  },
  {
    id: 'challenge-chunk-array',
    title: 'Chunk Array into Sub-arrays',
    xpReward: 110,
    description:
      'Write a function podzielNaPaczki(arr, size) splitting an array into groups of up to `size` items.',
    starterCode: `function podzielNaPaczki(arr, size) {\n  // Slice arr into chunks of length size\n  return null;\n}`,
    solutionCode: EXTRA_DAILY_CHALLENGES[5].solutionCode,
    testCases: EXTRA_DAILY_CHALLENGES[5].testCases,
  },
  {
    id: 'challenge-most-frequent',
    title: 'Most Frequent Element (HashMap)',
    xpReward: 120,
    description:
      'Write a function najczestszyElement(arr) returning the most frequently occurring item (or null for empty array).',
    starterCode: `function najczestszyElement(arr) {\n  // Track counts with Map and return the highest-frequency value\n  return undefined;\n}`,
    solutionCode: EXTRA_DAILY_CHALLENGES[6].solutionCode,
    testCases: EXTRA_DAILY_CHALLENGES[6].testCases,
  },
  {
    id: 'challenge-flatten-once',
    title: 'Flatten Array One Level Deep',
    xpReward: 95,
    description:
      'Write a function splaszczRaz(arr) flattening exactly one nesting level (e.g. [1, [2, 3], [4, [5]]] -> [1, 2, 3, 4, [5]]).',
    starterCode: `function splaszczRaz(arr) {\n  // Unwrap direct child arrays by 1 level\n  return null;\n}`,
    solutionCode: EXTRA_DAILY_CHALLENGES[7].solutionCode,
    testCases: EXTRA_DAILY_CHALLENGES[7].testCases,
  },
  {
    id: 'challenge-clamp-number',
    title: 'Clamp Number Within Range',
    xpReward: 85,
    description:
      'Write a function ograniczZakres(val, min, max) clamping val inside the inclusive bounds [min, max].',
    starterCode: `function ograniczZakres(val, min, max) {\n  // Clamp val between min and max\n  return null;\n}`,
    solutionCode: EXTRA_DAILY_CHALLENGES[8].solutionCode,
    testCases: EXTRA_DAILY_CHALLENGES[8].testCases,
  },
  {
    id: 'challenge-merge-totals',
    title: 'Aggregate Totals by Category',
    xpReward: 125,
    description:
      'Write a function sumujKategorie(items) summing `amount` per `category` from an array of { category, amount } objects.',
    starterCode: `function sumujKategorie(items) {\n  // Sum amounts grouped by category key\n  return null;\n}`,
    solutionCode: EXTRA_DAILY_CHALLENGES[9].solutionCode,
    testCases: EXTRA_DAILY_CHALLENGES[9].testCases,
  },
  {
    id: 'challenge-valid-brackets',
    title: 'Valid Parentheses Using a Stack',
    xpReward: 140,
    description:
      'Classic interview kata! Write a function poprawneNawiasy(str) checking that (), [], and {} brackets balance properly.',
    starterCode: `function poprawneNawiasy(str) {\n  // Use an array stack (push/pop) and closing-pair map\n  return false;\n}`,
    solutionCode: EXTRA_DAILY_CHALLENGES[10].solutionCode,
    testCases: EXTRA_DAILY_CHALLENGES[10].testCases,
  },
  {
    id: 'challenge-capitalize-words',
    title: 'Title-Case Every Word',
    xpReward: 95,
    description:
      'Write a function wielkaPierwszaLitera(sentence) capitalizing the first letter of every word and lowercasing the rest.',
    starterCode: `function wielkaPierwszaLitera(sentence) {\n  // Split words, capitalize first char, lowercase remaining chars\n  return null;\n}`,
    solutionCode: EXTRA_DAILY_CHALLENGES[11].solutionCode,
    testCases: EXTRA_DAILY_CHALLENGES[11].testCases,
  },
];

// ============================================================================
// EXTRA SM-2 FLASHCARDS (30 additional PL + EN -> 36 total)
// ============================================================================

export const EXTRA_FLASHCARDS: FlashcardItem[] = [
  // HTML & CSS (7 extra -> 8 total)
  {
    id: 'fc-7',
    category: 'HTML & CSS',
    question: 'Czym różnią się jednostki CSS: px, rem oraz em?',
    answer:
      'px to stały rozmiar piksela CSS, rem skaluje się zawsze względem rozmiaru czcionki root (<html>, zwykle 16px), a em względem rozmiaru czcionki bezpośredniego rodzica.',
    codeSnippet: 'html { font-size: 16px; }\n.title { font-size: 1.5rem; /* 24px */ }',
  },
  {
    id: 'fc-8',
    category: 'HTML & CSS',
    question: 'Kiedy wybrać Flexbox, a kiedy CSS Grid przy budowaniu układu strony?',
    answer:
      'Flexbox jest idealny dla układów jednowymiarowych (jeden wiersz lub jedna kolumna np. navbar), natomiast CSS Grid króluje w układach dwuwymiarowych (siatka wierszy i kolumn jednocześnie).',
    codeSnippet: '.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }',
  },
  {
    id: 'fc-9',
    category: 'HTML & CSS',
    question: 'Jak działa kolejność specyficzności (Specificity) selektorów CSS?',
    answer:
      'Od najsilniejszego: styl inline (1000) > #id (100) > .klasa / [atr] / :hover (10) > znacznik HTML / ::before (1). Unikaj !important, bo psuje przewidywalność kaskady.',
    codeSnippet: '#nav .link.active { color: #6366f1; } /* 100 + 10 + 10 = 120 */',
  },
  {
    id: 'fc-10',
    category: 'HTML & CSS',
    question: 'Jaka jest różnica między position: fixed a position: sticky?',
    answer:
      'position: fixed przykleja element na stałe do okna przeglądarki (viewportu) wyjmując go z przepływu. position: sticky zachowuje się normalnie aż do progu przewijania (np. top: 0) i trzyma się w obrębie swojego rodzica.',
    codeSnippet: '.header { position: sticky; top: 0; z-index: 40; }',
  },
  {
    id: 'fc-11',
    category: 'HTML & CSS',
    question: 'Dlaczego semantyczne znaczniki HTML (<header>, <nav>, <main>, <article>, <footer>) są lepsze niż wszędobylskie <div>?',
    answer:
      'Nadają dokumentowi strukturę zrozumiałą dla czytników ekranu (WCAG — łatwiejsza nawigacja klawiaturą) oraz robotów Google (SEO), a kod staje się czytelniejszy.',
    codeSnippet: '<main>\n  <article><h1>Tytuł</h1><p>Treść...</p></article>\n</main>',
  },
  {
    id: 'fc-12',
    category: 'HTML & CSS',
    question: 'Jak działają natywne zmienne CSS (--var) i dlaczego warto definiować je w :root?',
    answer:
      'Zmienne zadeklarowane w :root są dostępne globalnie w całym dokumencie i można je nadpisać np. dla klasy .light lub .dark bez przeładowania strony.',
    codeSnippet: ':root { --bg: #020617; }\nhtml.light { --bg: #f8fafc; }\nbody { background: var(--bg); }',
  },
  {
    id: 'fc-13',
    category: 'HTML & CSS',
    question: 'Do czego służy atrybut aria-label oraz pusty alt="" na obrazkach dekoracyjnych?',
    answer:
      'aria-label dostarcza tekstowej etykiety dla przycisków z samą ikoną, a alt="" nakazuje czytnikowi ekranu pominąć czysto dekoracyjną grafikę zamiast czytać nazwę pliku.',
    codeSnippet: '<button aria-label="Zamknij okno">×</button>',
  },

  // JavaScript & TS (6 extra -> 8 total)
  {
    id: 'fc-14',
    category: 'JavaScript & TS',
    question: 'W jakiej kolejności Event Loop uruchamia Call Stack, Microtask Queue oraz Macrotask Queue?',
    answer:
      'Najpierw wykonuje się cały synchroniczny kod na Call Stack. Gdy stos jest pusty, opróżniana jest CAŁA kolejka Microtask Queue (Promise.then, queueMicrotask), a dopiero potem 1 zadanie z Macrotask Queue (setTimeout).',
    codeSnippet: 'Promise.resolve().then(fn1); // przed setTimeout!\nsetTimeout(fn2, 0);',
  },
  {
    id: 'fc-15',
    category: 'JavaScript & TS',
    question: 'Czym różni się Promise.all() od Promise.allSettled()?',
    answer:
      'Promise.all() odrzuca całość natychmiast, jeśli choć jedna obietnica zawiedzie (fail-fast). Promise.allSettled() czeka na zakończenie wszystkich i zwraca tablicę statusów fulfilled lub rejected.',
    codeSnippet: 'const results = await Promise.allSettled([fetchUsers(), fetchStats()]);',
  },
  {
    id: 'fc-16',
    category: 'JavaScript & TS',
    question: 'Jaka jest różnica między var, let i const pod kątem zasięgu oraz hoistingu?',
    answer:
      'var ma zasięg funkcyjny i jest wynoszony (hoisted) jako undefined; let i const mają zasięg blokowy ({...}) i znajdują się w Temporal Dead Zone (TDZ) przed linią deklaracji.',
    codeSnippet: 'if (true) {\n  const x = 10; // dostępna tylko wewnątrz bloku\n}',
  },
  {
    id: 'fc-17',
    category: 'JavaScript & TS',
    question: 'Czym różni się typ unknown od any w TypeScript?',
    answer:
      'any wyłącza sprawdzanie typów i pozwala wywołać cokolwiek bez błędów kompilacji. unknown to typ bezpieczny — przed użyciem wartości musisz zawęzić jej typ (Type Guard).',
    codeSnippet: 'function parseMsg(val: unknown) {\n  if (typeof val === "string") return val.trim();\n}',
  },
  {
    id: 'fc-18',
    category: 'JavaScript & TS',
    question: 'Jak działają typy użytkowe TypeScript: Partial<T>, Pick<T, K> oraz Omit<T, K>?',
    answer:
      'Partial<T> czyni wszystkie pola opcjonalnymi (idealne do PATCH), Pick<T, K> wybiera wskazane klucze, a Omit<T, K> usuwa wskazane pola (np. Omit<User, "password">).',
    codeSnippet: 'type PublicUser = Omit<User, "passwordHash">;\ntype UserPatch = Partial<PublicUser>;',
  },
  {
    id: 'fc-19',
    category: 'JavaScript & TS',
    question: 'Czym różni się operator Nullish Coalescing (??) od logicznego OR (||)?',
    answer:
      'Operator ?? zwraca prawą stronę WYŁĄCZNIE dla null lub undefined (zachowuje 0, false i ""), natomiast || traktuje wszystkie wartości falsy jako brakujące.',
    codeSnippet: 'const limit = config.limit ?? 10; // dla 0 zwróci 0!',
  },

  // React & Next.js (6 extra -> 7 total)
  {
    id: 'fc-20',
    category: 'React & Next.js',
    question: 'Dlaczego nie wolno używać losowego key={Math.random()} ani pochopnie indeksu tablicy przy listach w React?',
    answer:
      'Math.random() niszczy i odtwarza komponenty od zera przy każdym renderze (utrata fokusu/stanu). Indeks tablicy psuje przypisanie stanu przy sortowaniu, filtrowaniu lub wstawianiu na początek.',
    codeSnippet: '{items.map((item) => <Row key={item.id} item={item} />)}',
  },
  {
    id: 'fc-21',
    category: 'React & Next.js',
    question: 'Po co zwracamy funkcję czyszczącą (cleanup) z hooka useEffect?',
    answer:
      'Cleanup uruchamia się przed ponownym wykonaniem efektu i przy odmontowaniu komponentu — służy do anulowania fetcha (AbortController), clearInterval lub odpięcia nasłuchów zdarzeń.',
    codeSnippet: 'useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);',
  },
  {
    id: 'fc-22',
    category: 'React & Next.js',
    question: 'Jaka jest różnica między useMemo a useCallback?',
    answer:
      'useMemo zapamiętuje wynik kosztownego obliczenia (wartość), a useCallback zapamiętuje referencję samej funkcji między renderami (przydatne przy React.memo i tablicach zależności).',
    codeSnippet: 'const total = useMemo(() => calc(items), [items]);\nconst onSave = useCallback(() => save(id), [id]);',
  },
  {
    id: 'fc-23',
    category: 'React & Next.js',
    question: 'Czym różni się komponent kontrolowany (Controlled) od niekontrolowanego (Uncontrolled) w formularzach React?',
    answer:
      'W kontrolowanym wartość inputa trzyma stan Reacta (value + onChange — natychmiastowa walidacja). Niekontrolowany trzyma wartość w samym DOM i odczytujesz ją np. przez useRef przy wysyłce.',
    codeSnippet: '<input value={email} onChange={(e) => setEmail(e.target.value)} />',
  },
  {
    id: 'fc-24',
    category: 'React & Next.js',
    question: 'Czym różnią się React Server Components (RSC) od Client Components ("use client") w Next.js App Router?',
    answer:
      'Server Components wykonują się wyłącznie na serwerze (0 KB JS wysyłanego do przeglądarki, bezpośredni dostęp do bazy danych), a Client Components obsługują interakcję (useState, onClick).',
    codeSnippet: "'use client';\nimport { useState } from 'react';",
  },
  {
    id: 'fc-25',
    category: 'React & Next.js',
    question: 'Do czego służy useRef poza bezpośrednim dostępem do elementu DOM (np. input.focus())?',
    answer:
      'Przechowuje mutowalną wartość w `.current` pomiędzy kolejnymi renderami komponentu (np. ID timera, poprzednią wartość), której zmiana NIE powoduje re-rendera ekranu.',
    codeSnippet: 'const timerRef = useRef<number | null>(null);',
  },

  // Backend & SQL (6 extra -> 7 total)
  {
    id: 'fc-26',
    category: 'Backend & SQL',
    question: 'Jaka jest różnica między INNER JOIN a LEFT JOIN w SQL?',
    answer:
      'INNER JOIN zwraca wyłącznie rekordy mające dopasowanie w obu tabelach. LEFT JOIN zwraca wszystkie rekordy z lewej tabeli, uzupełniając brakujące kolumny z prawej wartością NULL.',
    codeSnippet: 'SELECT u.name, COUNT(o.id) FROM users u LEFT JOIN orders o ON o.user_id = u.id GROUP BY u.id;',
  },
  {
    id: 'fc-27',
    category: 'Backend & SQL',
    question: 'Czym jest problem zapytań N+1 i jak go rozwiązać?',
    answer:
      'Polega na wykonaniu 1 zapytania po listę rekordów (np. N postów) i następnie N osobnych zapytań w pętli po powiązane dane. Rozwiązuje się go przez JOIN / include / batching IN (...).',
    codeSnippet: 'await prisma.post.findMany({ include: { author: true } });',
  },
  {
    id: 'fc-28',
    category: 'Backend & SQL',
    question: 'Czym różnią się kody HTTP: 400, 401, 403 oraz 404?',
    answer:
      '400 Bad Request = błędny format danych/walidacja; 401 Unauthorized = brak ważnego logowania; 403 Forbidden = zalogowany, ale brak uprawnień (rola RBAC); 404 Not Found = zasób nie istnieje.',
    codeSnippet: 'if (!req.user) return res.status(401).end();\nif (req.user.role !== "admin") return res.status(403).end();',
  },
  {
    id: 'fc-29',
    category: 'Backend & SQL',
    question: 'Dlaczego ciasteczka z flagą HttpOnly + Secure + SameSite są bezpieczniejsze dla sesji niż localStorage?',
    answer:
      'Do ciasteczka HttpOnly nie ma dostępu żaden skrypt JavaScript (ochrona przed kradzieżą tokena przy ataku XSS), Secure wymusza HTTPS, a SameSite ogranicza ataki CSRF.',
    codeSnippet: "res.cookie('session', token, { httpOnly: true, secure: true, sameSite: 'lax' });",
  },
  {
    id: 'fc-30',
    category: 'Backend & SQL',
    question: 'Jak działają transakcje ACID w PostgreSQL (BEGIN / COMMIT / ROLLBACK)?',
    answer:
      'Grupują serię operacji w niepodzielną całość (wszystko albo nic). Jeśli choć jeden krok zawiedzie, ROLLBACK wycofuje wcześniejsze zmiany, utrzymując spójność danych (np. przelewy).',
    codeSnippet: 'BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nCOMMIT;',
  },
  {
    id: 'fc-31',
    category: 'Backend & SQL',
    question: 'Dlaczego haseł użytkowników nigdy nie szyfrujemy (AES), tylko haszujemy z solą (bcrypt / Argon2)?',
    answer:
      'Szyfrowanie jest odwracalne za pomocą klucza. Haszowanie z unikalną solą jest jednokierunkowe i celowo kosztowne obliczeniowo, co blokuje ataki tęczowych tablic i brute-force po wycieku bazy.',
    codeSnippet: 'const hash = await bcrypt.hash(plainPassword, 12);',
  },

  // DevOps & Git (5 extra -> 6 total)
  {
    id: 'fc-32',
    category: 'DevOps & Git',
    question: 'Czym różni się git revert od git reset --hard na współdzielonej gałęzi?',
    answer:
      'git revert tworzy NOWY commit odwracający zmiany bez przepisywania historii (bezpieczne na main). git reset --hard cofa wskaźnik i niszczy historię, co psuje repozytorium innych osób.',
    codeSnippet: 'git revert <commit-sha>',
  },
  {
    id: 'fc-33',
    category: 'DevOps & Git',
    question: 'Dlaczego plik .env zawsze dodajemy do .gitignore i trzymamy w repozytorium tylko .env.example?',
    answer:
      'Historia Git jest trwała — jednorazowe zacommitowanie kluczy API lub haseł do bazy zostaje na zawsze w historii commitów, nawet po usunięciu pliku w kolejnym commicie.',
    codeSnippet: '# .gitignore\n.env\n.env.local',
  },
  {
    id: 'fc-34',
    category: 'DevOps & Git',
    question: 'Po co stosuje się Multi-Stage Build w pliku Dockerfile dla aplikacji Node.js / React?',
    answer:
      'Oddziela ciężki etap budowania (kompilatory, devDependencies) od lekkiego obrazu produkcyjnego (np. node:20-alpine z samym folderem dist), zmniejszając obraz o 70–90% i powierzchnię ataku.',
    codeSnippet: 'FROM node:20-alpine AS builder\n...\nFROM node:20-alpine AS runner\nCOPY --from=builder /app/dist ./dist',
  },
  {
    id: 'fc-35',
    category: 'DevOps & Git',
    question: 'Jaką rolę pełni Reverse Proxy (np. Nginx lub Caddy) przed serwerem Node.js?',
    answer:
      'Terminuje połączenia HTTPS (certyfikaty Let’s Encrypt), buforuje statyczne pliki z kompresją Gzip/Brotli, chroni przed wolnymi klientami i przekierowuje ruch na wewnętrzny port aplikacji.',
    codeSnippet: 'location /api/ {\n  proxy_pass http://127.0.0.1:3000;\n}',
  },
  {
    id: 'fc-36',
    category: 'DevOps & Git',
    question: 'Co weryfikuje plik pipeline CI/CD (np. GitHub Actions) przed zmergowaniem Pull Requesta?',
    answer:
      'Automatycznie uruchamia instalację zależności, sprawdzanie typów TypeScript (tsc), linter, testy jednostkowe/integracyjne i build produkcyjny — blokując uszkodzony kod przed produkcją.',
    codeSnippet: 'npm ci && npx tsc --noEmit && npm test && npm run build',
  },
];

export const EXTRA_FLASHCARDS_EN: FlashcardItem[] = [
  {
    id: 'fc-7',
    category: 'HTML & CSS',
    question: 'What is the difference between CSS units px, rem, and em?',
    answer:
      'px is a fixed CSS pixel, rem scales relative to the root <html> font-size (usually 16px), and em scales relative to the current element or parent font-size.',
    codeSnippet: 'html { font-size: 16px; }\n.title { font-size: 1.5rem; /* 24px */ }',
  },
  {
    id: 'fc-8',
    category: 'HTML & CSS',
    question: 'When should you choose CSS Flexbox vs CSS Grid?',
    answer:
      'Use Flexbox for 1-dimensional layouts (a single row or column such as a navbar). Use CSS Grid for 2-dimensional layouts controlling both rows and columns at once.',
    codeSnippet: '.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }',
  },
  {
    id: 'fc-9',
    category: 'HTML & CSS',
    question: 'How does CSS selector specificity work?',
    answer:
      'Priority order from strongest: inline style (1000) > #id (100) > .class / [attr] / :hover (10) > element tag / ::before (1). Avoid !important to keep the cascade predictable.',
    codeSnippet: '#nav .link.active { color: #6366f1; } /* 100 + 10 + 10 = 120 */',
  },
  {
    id: 'fc-10',
    category: 'HTML & CSS',
    question: 'How does position: fixed differ from position: sticky?',
    answer:
      'position: fixed pins an element directly to the viewport and removes it from normal flow. position: sticky scrolls normally until hitting a threshold (e.g. top: 0) inside its parent container.',
    codeSnippet: '.header { position: sticky; top: 0; z-index: 40; }',
  },
  {
    id: 'fc-11',
    category: 'HTML & CSS',
    question: 'Why are semantic HTML tags (<header>, <nav>, <main>, <article>, <footer>) better than generic <div> wrappers?',
    answer:
      'They communicate document landmarks to screen readers (WCAG accessibility) and search engine crawlers (SEO) while keeping markup self-documenting.',
    codeSnippet: '<main>\n  <article><h1>Title</h1><p>Content...</p></article>\n</main>',
  },
  {
    id: 'fc-12',
    category: 'HTML & CSS',
    question: 'How do native CSS custom properties (--var) work with :root and theming?',
    answer:
      'Variables declared in :root are available globally and can be overridden on html.light / html.dark dynamically without rebuilding stylesheets.',
    codeSnippet: ':root { --bg: #020617; }\nhtml.light { --bg: #f8fafc; }\nbody { background: var(--bg); }',
  },
  {
    id: 'fc-13',
    category: 'HTML & CSS',
    question: 'When should you use aria-label vs empty alt="" on images?',
    answer:
      'aria-label provides accessible text for icon-only buttons, whereas alt="" instructs screen readers to skip purely decorative images.',
    codeSnippet: '<button aria-label="Close modal">×</button>',
  },
  {
    id: 'fc-14',
    category: 'JavaScript & TS',
    question: 'In what order does the Event Loop process the Call Stack, Microtask Queue, and Macrotask Queue?',
    answer:
      'First all synchronous frames on the Call Stack finish. Then the Event Loop drains the ENTIRE Microtask Queue (Promise.then, queueMicrotask) before running a single Macrotask (setTimeout).',
    codeSnippet: 'Promise.resolve().then(fn1); // runs before setTimeout!\nsetTimeout(fn2, 0);',
  },
  {
    id: 'fc-15',
    category: 'JavaScript & TS',
    question: 'What is the difference between Promise.all() and Promise.allSettled()?',
    answer:
      'Promise.all() rejects immediately if any promise rejects (fail-fast). Promise.allSettled() waits for all promises to finish and returns status objects for every item.',
    codeSnippet: 'const results = await Promise.allSettled([fetchUsers(), fetchStats()]);',
  },
  {
    id: 'fc-16',
    category: 'JavaScript & TS',
    question: 'How do var, let, and const differ in scope and hoisting?',
    answer:
      'var is function-scoped and hoisted initialized as undefined. let and const are block-scoped ({...}) and stay in the Temporal Dead Zone (TDZ) until their declaration line.',
    codeSnippet: 'if (true) {\n  const x = 10; // block-scoped only\n}',
  },
  {
    id: 'fc-17',
    category: 'JavaScript & TS',
    question: 'What is the difference between unknown and any in TypeScript?',
    answer:
      'any disables type checking completely. unknown is type-safe — TypeScript forces you to narrow the value (via Type Guards) before accessing properties or methods.',
    codeSnippet: 'function parseMsg(val: unknown) {\n  if (typeof val === "string") return val.trim();\n}',
  },
  {
    id: 'fc-18',
    category: 'JavaScript & TS',
    question: 'How do TypeScript utility types Partial<T>, Pick<T, K>, and Omit<T, K> work?',
    answer:
      'Partial<T> makes every property optional (great for PATCH DTOs), Pick<T, K> keeps only listed keys, and Omit<T, K> drops sensitive keys like passwordHash.',
    codeSnippet: 'type PublicUser = Omit<User, "passwordHash">;\ntype UserPatch = Partial<PublicUser>;',
  },
  {
    id: 'fc-19',
    category: 'JavaScript & TS',
    question: 'How does Nullish Coalescing (??) differ from logical OR (||)?',
    answer:
      '?? falls back ONLY on null or undefined (preserving 0, false, and ""), whereas || falls back on every falsy value.',
    codeSnippet: 'const limit = config.limit ?? 10; // preserves 0!',
  },
  {
    id: 'fc-20',
    category: 'React & Next.js',
    question: 'Why should you avoid random key={Math.random()} or blindly using array index as key in React?',
    answer:
      'Math.random() destroys and recreates DOM/state on every render. Array indexes break item-to-state association whenever a list is sorted, filtered, or prepended.',
    codeSnippet: '{items.map((item) => <Row key={item.id} item={item} />)}',
  },
  {
    id: 'fc-21',
    category: 'React & Next.js',
    question: 'Why do we return a cleanup function from React’s useEffect?',
    answer:
      'Cleanup executes before re-running the effect and on unmount — preventing memory leaks by clearing intervals, removing listeners, or aborting in-flight fetch requests.',
    codeSnippet: 'useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);',
  },
  {
    id: 'fc-22',
    category: 'React & Next.js',
    question: 'What is the difference between useMemo and useCallback?',
    answer:
      'useMemo memoizes the computed return value of a function, whereas useCallback memoizes the function reference itself between renders.',
    codeSnippet: 'const total = useMemo(() => calc(items), [items]);\nconst onSave = useCallback(() => save(id), [id]);',
  },
  {
    id: 'fc-23',
    category: 'React & Next.js',
    question: 'How do Controlled vs Uncontrolled inputs work in React forms?',
    answer:
      'Controlled inputs bind value to React state and update via onChange (enabling live validation). Uncontrolled inputs let the DOM hold the value and read it via useRef on submit.',
    codeSnippet: '<input value={email} onChange={(e) => setEmail(e.target.value)} />',
  },
  {
    id: 'fc-24',
    category: 'React & Next.js',
    question: 'How do React Server Components (RSC) differ from Client Components ("use client") in Next.js?',
    answer:
      'Server Components render strictly on the server (0 KB client JS, direct DB access), while Client Components ship interactive JS for state, effects, and browser event handlers.',
    codeSnippet: "'use client';\nimport { useState } from 'react';",
  },
  {
    id: 'fc-25',
    category: 'React & Next.js',
    question: 'Why use useRef beyond focusing DOM elements?',
    answer:
      'useRef stores mutable values in `.current` (like timer IDs or previous props) across renders without triggering a UI re-render when updated.',
    codeSnippet: 'const timerRef = useRef<number | null>(null);',
  },
  {
    id: 'fc-26',
    category: 'Backend & SQL',
    question: 'What is the difference between INNER JOIN and LEFT JOIN in SQL?',
    answer:
      'INNER JOIN returns only rows with matches in both tables. LEFT JOIN preserves every row from the left table and fills unmatched right columns with NULL.',
    codeSnippet: 'SELECT u.name, COUNT(o.id) FROM users u LEFT JOIN orders o ON o.user_id = u.id GROUP BY u.id;',
  },
  {
    id: 'fc-27',
    category: 'Backend & SQL',
    question: 'What is the N+1 Query Problem and how do you fix it?',
    answer:
      'Fetching 1 list of N parent items and then firing N extra queries inside a loop for child records. Fix it with JOINs, ORM `include`, or batched `IN (...)` queries.',
    codeSnippet: 'await prisma.post.findMany({ include: { author: true } });',
  },
  {
    id: 'fc-28',
    category: 'Backend & SQL',
    question: 'What is the difference between HTTP status codes 400, 401, 403, and 404?',
    answer:
      '400 = invalid payload/validation error; 401 = unauthenticated (missing/invalid login); 403 = authenticated but lacks permission (RBAC); 404 = resource not found.',
    codeSnippet: 'if (!req.user) return res.status(401).end();\nif (req.user.role !== "admin") return res.status(403).end();',
  },
  {
    id: 'fc-29',
    category: 'Backend & SQL',
    question: 'Why are HttpOnly + Secure + SameSite cookies safer for auth tokens than localStorage?',
    answer:
      'HttpOnly blocks JavaScript/XSS from reading the cookie, Secure restricts transmission to HTTPS, and SameSite mitigates Cross-Site Request Forgery (CSRF).',
    codeSnippet: "res.cookie('session', token, { httpOnly: true, secure: true, sameSite: 'lax' });",
  },
  {
    id: 'fc-30',
    category: 'Backend & SQL',
    question: 'How do ACID database transactions (BEGIN / COMMIT / ROLLBACK) protect data integrity?',
    answer:
      'They group operations into an atomic all-or-nothing unit. If any query fails mid-flight, ROLLBACK reverts all partial writes safely.',
    codeSnippet: 'BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nCOMMIT;',
  },
  {
    id: 'fc-31',
    category: 'Backend & SQL',
    question: 'Why must user passwords be hashed with salt (bcrypt / Argon2) instead of encrypted?',
    answer:
      'Encryption is reversible with a key. Salted slow hashing is one-way and resistant to rainbow tables and GPU brute-force attacks if the database leaks.',
    codeSnippet: 'const hash = await bcrypt.hash(plainPassword, 12);',
  },
  {
    id: 'fc-32',
    category: 'DevOps & Git',
    question: 'When should you use git revert instead of git reset --hard?',
    answer:
      'git revert creates a new inverse commit safely on shared branches without rewriting history, whereas git reset --hard rewrites commit history and breaks collaborators.',
    codeSnippet: 'git revert <commit-sha>',
  },
  {
    id: 'fc-33',
    category: 'DevOps & Git',
    question: 'Why must .env files always stay in .gitignore while committing .env.example instead?',
    answer:
      'Git history retains secrets forever once committed; .env.example documents required environment variable names without exposing production credentials.',
    codeSnippet: '# .gitignore\n.env\n.env.local',
  },
  {
    id: 'fc-34',
    category: 'DevOps & Git',
    question: 'What are the benefits of Multi-Stage Builds in a Dockerfile?',
    answer:
      'They separate build tools/devDependencies from the tiny runtime image (e.g. node:20-alpine with only compiled dist/), shrinking image size by 70–90% and reducing attack surface.',
    codeSnippet: 'FROM node:20-alpine AS builder\n...\nFROM node:20-alpine AS runner\nCOPY --from=builder /app/dist ./dist',
  },
  {
    id: 'fc-35',
    category: 'DevOps & Git',
    question: 'What role does a Reverse Proxy (Nginx / Caddy) play in front of Node.js?',
    answer:
      'It handles TLS/HTTPS termination, gzip/brotli compression, static asset caching, and request buffering before forwarding API calls to Node.js on localhost.',
    codeSnippet: 'location /api/ {\n  proxy_pass http://127.0.0.1:3000;\n}',
  },
  {
    id: 'fc-36',
    category: 'DevOps & Git',
    question: 'What should a CI/CD quality gate check before merging a Pull Request?',
    answer:
      'Automated installation, TypeScript type-checking (tsc --noEmit), linting, unit/integration tests, and production build verification.',
    codeSnippet: 'npm ci && npx tsc --noEmit && npm test && npm run build',
  },
];
