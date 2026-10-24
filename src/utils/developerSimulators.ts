import { User } from '../types';

// ============================================================================
// 1. REST API / POSTMAN SIMULATOR ENGINE
// ============================================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiRequestInput {
  method: HttpMethod;
  endpoint: string;
  headers: Record<string, string>;
  bodyRaw: string;
}

export interface ApiResponseOutput {
  status: number;
  statusText: string;
  latencyMs: number;
  headers: Record<string, string>;
  data: unknown;
  ok: boolean;
}

export interface ApiMission {
  id: string;
  title: string;
  description: string;
  method: HttpMethod;
  endpointPattern: string;
  expectedStatus: number;
  xpReward: number;
  hint: string;
}

export const API_MISSIONS: ApiMission[] = [
  {
    id: 'api-mission-1',
    title: 'Pobierz listę kursantów (GET)',
    description: 'Wyślij żądanie GET na adres /api/users, aby pobrać listę użytkowników w formacie JSON.',
    method: 'GET',
    endpointPattern: '/api/users',
    expectedStatus: 200,
    xpReward: 40,
    hint: 'Wybierz metodę GET i wpisz ścieżkę /api/users, a następnie kliknij Wyślij żądanie.',
  },
  {
    id: 'api-mission-2',
    title: 'Utwórz nowe zadanie (POST + JSON)',
    description: 'Wyślij żądanie POST na /api/tasks z poprawnym ciałem JSON zawierającym pole "title".',
    method: 'POST',
    endpointPattern: '/api/tasks',
    expectedStatus: 201,
    xpReward: 60,
    hint: 'Ustaw metodę POST, adres /api/tasks oraz wklej w Body JSON np. {"title": "Nauczyć się REST API", "priority": "high"}.',
  },
  {
    id: 'api-mission-3',
    title: 'Autoryzowany dostęp do profilu (Bearer Token)',
    description: 'Wyślij żądanie GET na chroniony endpoint /api/profile z nagłówkiem Authorization: Bearer fsda-secret-token-2026.',
    method: 'GET',
    endpointPattern: '/api/profile',
    expectedStatus: 200,
    xpReward: 75,
    hint: 'Dodaj nagłówek Authorization o wartości Bearer fsda-secret-token-2026 i wyślij GET na /api/profile.',
  },
  {
    id: 'api-mission-4',
    title: 'Usuń rekord zadania (DELETE)',
    description: 'Wyślij żądanie DELETE na /api/tasks/101, aby usunąć zadanie o identyfikatorze 101.',
    method: 'DELETE',
    endpointPattern: '/api/tasks/101',
    expectedStatus: 200,
    xpReward: 50,
    hint: 'Wybierz metodę DELETE oraz wpisz endpoint /api/tasks/101.',
  },
];

const MOCK_USERS_DB = [
  { id: 1, name: 'Zordon Admin', role: 'admin', stack: ['React', 'Node.js', 'PostgreSQL'] },
  { id: 2, name: 'Marta Kowalska', role: 'student', stack: ['HTML5', 'CSS3', 'TypeScript'] },
  { id: 3, name: 'Kamil Nowak', role: 'student', stack: ['Next.js', 'Prisma', 'Docker'] },
];

const MOCK_TASKS_DB = [
  { id: 101, title: 'Skonfigurować połączenie z bazą PostgreSQL', completed: true, priority: 'high' },
  { id: 102, title: 'Zaimplementować autoryzację JWT w Express', completed: false, priority: 'high' },
  { id: 103, title: 'Napisać testy jednostkowe dla koszyka', completed: false, priority: 'medium' },
];

export function executeSimulatedRequest(req: ApiRequestInput): ApiResponseOutput {
  const cleanEndpoint = req.endpoint.trim().replace(/^https?:\/\/[^/]+/i, '') || '/';
  const [pathOnly, queryString] = cleanEndpoint.split('?');
  const normalizedHeaders: Record<string, string> = {};
  Object.entries(req.headers || {}).forEach(([k, v]) => {
    normalizedHeaders[k.toLowerCase().trim()] = v.trim();
  });

  const baseResponseHeaders = {
    'content-type': 'application/json; charset=utf-8',
    'x-powered-by': 'FSDA-API-Engine/2.4',
    'cache-control': 'no-store',
  };

  let parsedBody: Record<string, unknown> | null = null;
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!req.bodyRaw || !req.bodyRaw.trim()) {
      return {
        status: 400,
        statusText: 'Bad Request',
        latencyMs: 18,
        headers: baseResponseHeaders,
        ok: false,
        data: {
          error: 'Bad Request',
          message: 'Ciało żądania (Body JSON) nie może być puste dla metod POST oraz PUT.',
        },
      };
    }
    try {
      parsedBody = JSON.parse(req.bodyRaw);
    } catch {
      return {
        status: 400,
        statusText: 'Bad Request',
        latencyMs: 14,
        headers: baseResponseHeaders,
        ok: false,
        data: {
          error: 'Invalid JSON',
          message: 'Przesłany payload nie jest poprawnym formatem JSON. Sprawdź cudzysłowy i przecinki.',
        },
      };
    }
  }

  // Endpoint: /api/users
  if (pathOnly === '/api/users' && req.method === 'GET') {
    const roleFilter = queryString?.match(/role=([^&]+)/)?.[1];
    const results = roleFilter
      ? MOCK_USERS_DB.filter((u) => u.role === roleFilter)
      : MOCK_USERS_DB;
    return {
      status: 200,
      statusText: 'OK',
      latencyMs: 32,
      headers: baseResponseHeaders,
      ok: true,
      data: {
        count: results.length,
        items: results,
      },
    };
  }

  // Endpoint: /api/tasks
  if (pathOnly === '/api/tasks' && req.method === 'GET') {
    return {
      status: 200,
      statusText: 'OK',
      latencyMs: 28,
      headers: baseResponseHeaders,
      ok: true,
      data: {
        count: MOCK_TASKS_DB.length,
        tasks: MOCK_TASKS_DB,
      },
    };
  }

  if (pathOnly === '/api/tasks' && req.method === 'POST') {
    const title = parsedBody && typeof parsedBody.title === 'string' ? parsedBody.title.trim() : '';
    if (!title) {
      return {
        status: 422,
        statusText: 'Unprocessable Entity',
        latencyMs: 24,
        headers: baseResponseHeaders,
        ok: false,
        data: {
          error: 'Validation Error',
          message: 'Pole "title" (string) jest wymagane przy tworzeniu nowego zadania.',
        },
      };
    }
    const createdTask = {
      id: 104,
      title,
      priority: (parsedBody?.priority as string) || 'medium',
      completed: Boolean(parsedBody?.completed ?? false),
      createdAt: '2026-10-23T12:00:00Z',
    };
    return {
      status: 201,
      statusText: 'Created',
      latencyMs: 45,
      headers: baseResponseHeaders,
      ok: true,
      data: {
        message: 'Zadanie zostało pomyślnie utworzone.',
        task: createdTask,
      },
    };
  }

  // Endpoint: /api/tasks/:id
  const taskMatch = pathOnly.match(/^\/api\/tasks\/(\d+)$/);
  if (taskMatch) {
    const taskId = Number(taskMatch[1]);
    if (req.method === 'DELETE') {
      return {
        status: 200,
        statusText: 'OK',
        latencyMs: 37,
        headers: baseResponseHeaders,
        ok: true,
        data: {
          deleted: true,
          taskId,
          message: `Rekord zadania #${taskId} został usunięty.`,
        },
      };
    }
    if (req.method === 'PUT') {
      return {
        status: 200,
        statusText: 'OK',
        latencyMs: 41,
        headers: baseResponseHeaders,
        ok: true,
        data: {
          updated: true,
          taskId,
          changes: parsedBody,
        },
      };
    }
  }

  // Endpoint: /api/profile (Protected by Bearer token)
  if (pathOnly === '/api/profile' && req.method === 'GET') {
    const authHeader = normalizedHeaders['authorization'] || '';
    if (!authHeader.startsWith('Bearer ') || authHeader.slice(7).trim().length < 8) {
      return {
        status: 401,
        statusText: 'Unauthorized',
        latencyMs: 19,
        headers: baseResponseHeaders,
        ok: false,
        data: {
          error: 'Unauthorized',
          message: 'Brak poprawnego nagłówka Authorization: Bearer <token>. Użyj np. Bearer fsda-secret-token-2026.',
        },
      };
    }
    return {
      status: 200,
      statusText: 'OK',
      latencyMs: 29,
      headers: baseResponseHeaders,
      ok: true,
      data: {
        authenticated: true,
        tokenScope: 'read:profile write:code',
        profile: {
          username: 'zordon_dev',
          role: 'Full Stack Architect',
          permissions: ['deploy:prod', 'db:migrate', 'review:code'],
        },
      },
    };
  }

  // Endpoint: /api/health
  if (pathOnly === '/api/health' && req.method === 'GET') {
    return {
      status: 200,
      statusText: 'OK',
      latencyMs: 11,
      headers: baseResponseHeaders,
      ok: true,
      data: {
        status: 'healthy',
        uptimeSeconds: 86400,
        database: 'connected',
      },
    };
  }

  return {
    status: 404,
    statusText: 'Not Found',
    latencyMs: 16,
    headers: baseResponseHeaders,
    ok: false,
    data: {
      error: 'Not Found',
      message: `Nie znaleziono zasobu dla ${req.method} ${pathOnly}. Dostępne endpointy: /api/users, /api/tasks, /api/tasks/101, /api/profile, /api/health.`,
    },
  };
}

export function checkApiMissionCompleted(
  mission: ApiMission,
  req: ApiRequestInput,
  res: ApiResponseOutput
): boolean {
  const cleanEndpoint = req.endpoint.trim().replace(/^https?:\/\/[^/]+/i, '').split('?')[0];
  return (
    req.method === mission.method &&
    cleanEndpoint === mission.endpointPattern &&
    res.status === mission.expectedStatus
  );
}

// ============================================================================
// 2. JS EVENT LOOP & ASYNC VISUALIZER STATE MACHINE
// ============================================================================

export interface EventLoopStep {
  stepIndex: number;
  activeLine: number;
  explanation: string;
  phase: 'Call Stack' | 'Web APIs' | 'Microtask Queue' | 'Macrotask Queue' | 'Idle';
  callStack: string[];
  webApis: string[];
  microtaskQueue: string[];
  macrotaskQueue: string[];
  consoleOutput: string[];
}

export interface EventLoopScenario {
  id: string;
  title: string;
  difficulty: 'Podstawowy' | 'Średniozaawansowany' | 'Rekrutacyjny';
  description: string;
  codeLines: string[];
  steps: EventLoopStep[];
}

export const EVENT_LOOP_SCENARIOS: EventLoopScenario[] = [
  {
    id: 'promise-vs-timeout',
    title: 'Promise.then() vs setTimeout(..., 0)',
    difficulty: 'Rekrutacyjny',
    description:
      'Klasyczne pytanie z rozmów kwalifikacyjnych: dlaczego Promise wykonuje się przed setTimeout z czasem 0 ms?',
    codeLines: [
      "console.log('1. Start skryptu');",
      "setTimeout(() => console.log('2. Callback setTimeout'), 0);",
      "Promise.resolve().then(() => console.log('3. Mikro-zadanie Promise'));",
      "console.log('4. Koniec skryptu');",
    ],
    steps: [
      {
        stepIndex: 0,
        activeLine: 1,
        phase: 'Call Stack',
        explanation: 'Wywołanie synchroniczne console.log("1. Start skryptu") trafia na Call Stack i od razu wypisuje tekst w konsoli.',
        callStack: ['main()', 'console.log("1. Start skryptu")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: ['1. Start skryptu'],
      },
      {
        stepIndex: 1,
        activeLine: 2,
        phase: 'Web APIs',
        explanation: 'setTimeout rejestruje timer (0 ms) w Web APIs przeglądarki. Po upływie 0 ms callback wędruje do kolejki Macrotask Queue.',
        callStack: ['main()', 'setTimeout(..., 0)'],
        webApis: ['Timer (0ms) -> gotowy'],
        microtaskQueue: [],
        macrotaskQueue: ['() => console.log("2. Callback setTimeout")'],
        consoleOutput: ['1. Start skryptu'],
      },
      {
        stepIndex: 2,
        activeLine: 3,
        phase: 'Microtask Queue',
        explanation: 'Promise.resolve().then(...) rejestruje callback w kolejce o najwyższym priorytecie: Microtask Queue.',
        callStack: ['main()', 'Promise.resolve().then(...)'],
        webApis: [],
        microtaskQueue: ['() => console.log("3. Mikro-zadanie Promise")'],
        macrotaskQueue: ['() => console.log("2. Callback setTimeout")'],
        consoleOutput: ['1. Start skryptu'],
      },
      {
        stepIndex: 3,
        activeLine: 4,
        phase: 'Call Stack',
        explanation: 'Wykonuje się ostatnia linia synchroniczna: console.log("4. Koniec skryptu"). Główny skrypt main() kończy pracę.',
        callStack: ['main()', 'console.log("4. Koniec skryptu")'],
        webApis: [],
        microtaskQueue: ['() => console.log("3. Mikro-zadanie Promise")'],
        macrotaskQueue: ['() => console.log("2. Callback setTimeout")'],
        consoleOutput: ['1. Start skryptu', '4. Koniec skryptu'],
      },
      {
        stepIndex: 4,
        activeLine: 3,
        phase: 'Microtask Queue',
        explanation: 'Call Stack jest pusty! Event Loop w pierwszej kolejności opróżnia CAŁĄ kolejkę Microtask Queue przed jakimkolwiek zadaniem z Macrotask Queue.',
        callStack: ['promiseCallback()', 'console.log("3. Mikro-zadanie Promise")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: ['() => console.log("2. Callback setTimeout")'],
        consoleOutput: ['1. Start skryptu', '4. Koniec skryptu', '3. Mikro-zadanie Promise'],
      },
      {
        stepIndex: 5,
        activeLine: 2,
        phase: 'Macrotask Queue',
        explanation: 'Gdy Microtask Queue jest pusta, Event Loop pobiera pierwsze zadanie z Macrotask Queue (callback z setTimeout) i wrzuca je na Call Stack.',
        callStack: ['timeoutCallback()', 'console.log("2. Callback setTimeout")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: [
          '1. Start skryptu',
          '4. Koniec skryptu',
          '3. Mikro-zadanie Promise',
          '2. Callback setTimeout',
        ],
      },
    ],
  },
  {
    id: 'async-await-flow',
    title: 'Przepływ funkcji async / await',
    difficulty: 'Średniozaawansowany',
    description:
      'Zobacz, jak słowo kluczowe await zawiesza wykonywanie funkcji asynchronicznej i odkłada dalszą część kodu do Microtask Queue.',
    codeLines: [
      'async function pobierzDane() {',
      "  console.log('A. Wejście do async');",
      "  const wynik = await Promise.resolve('B. Dane z API');",
      '  console.log(wynik);',
      '}',
      'pobierzDane();',
      "console.log('C. Kod po wywołaniu pobierzDane()');",
    ],
    steps: [
      {
        stepIndex: 0,
        activeLine: 6,
        phase: 'Call Stack',
        explanation: 'Wywołujemy pobierzDane(). Funkcja async zaczyna wykonywać się synchronicznie aż do pierwszego słowa kluczowego await.',
        callStack: ['main()', 'pobierzDane()'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: [],
      },
      {
        stepIndex: 1,
        activeLine: 2,
        phase: 'Call Stack',
        explanation: 'Wewnątrz pobierzDane() synchronicznie wykonuje się console.log("A. Wejście do async").',
        callStack: ['main()', 'pobierzDane()', 'console.log("A. Wejście do async")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: ['A. Wejście do async'],
      },
      {
        stepIndex: 2,
        activeLine: 3,
        phase: 'Microtask Queue',
        explanation: 'Napotykamy await! Funkcja pobierzDane() zostaje zawieszona i schodzi z Call Stack, a reszta jej ciała trafia do Microtask Queue.',
        callStack: ['main()'],
        webApis: [],
        microtaskQueue: ['Kontynuacja pobierzDane() -> console.log(wynik)'],
        macrotaskQueue: [],
        consoleOutput: ['A. Wejście do async'],
      },
      {
        stepIndex: 3,
        activeLine: 7,
        phase: 'Call Stack',
        explanation: 'Główny wątek nie jest zablokowany — wykonuje linię 7: console.log("C. Kod po wywołaniu pobierzDane()").',
        callStack: ['main()', 'console.log("C. Kod po wywołaniu...")'],
        webApis: [],
        microtaskQueue: ['Kontynuacja pobierzDane() -> console.log(wynik)'],
        macrotaskQueue: [],
        consoleOutput: ['A. Wejście do async', 'C. Kod po wywołaniu pobierzDane()'],
      },
      {
        stepIndex: 4,
        activeLine: 4,
        phase: 'Microtask Queue',
        explanation: 'Po zakończeniu głównego skryptu Event Loop wznawia zawieszoną funkcję z Microtask Queue i wypisuje "B. Dane z API".',
        callStack: ['pobierzDane() [wznowiona]', 'console.log("B. Dane z API")'],
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        consoleOutput: [
          'A. Wejście do async',
          'C. Kod po wywołaniu pobierzDane()',
          'B. Dane z API',
        ],
      },
    ],
  },
];

// ============================================================================
// 3. WEEKLY LEADERBOARD & DAILY CODING CHALLENGE
// ============================================================================

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  weeklyXp: number;
  streakDays: number;
  league: 'Diamentowa' | 'Złota' | 'Srebrna' | 'Brązowa';
  isCurrentUser: boolean;
}

export function buildWeeklyLeaderboard(currentUser: User, allUsers: User[]): LeaderboardEntry[] {
  const peerBots = [
    {
      id: 'peer-1',
      name: 'Aleksandra Wiśniewska',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aleksandra',
      xp: 11250,
      weeklyXp: 1420,
      streakDays: 52,
    },
    {
      id: 'peer-2',
      name: 'Michał Zieliński',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Michal',
      xp: 9840,
      weeklyXp: 1190,
      streakDays: 34,
    },
    {
      id: 'peer-3',
      name: 'Karolina Dąbrowska',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Karolina',
      xp: 8420,
      weeklyXp: 950,
      streakDays: 28,
    },
    {
      id: 'peer-4',
      name: 'Piotr Szymański',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Piotr',
      xp: 6300,
      weeklyXp: 780,
      streakDays: 19,
    },
    {
      id: 'peer-5',
      name: 'Natalia Woźniak',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Natalia',
      xp: 4890,
      weeklyXp: 610,
      streakDays: 14,
    },
    {
      id: 'peer-6',
      name: 'Jakub Kaczmarek',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Jakub',
      xp: 3150,
      weeklyXp: 430,
      streakDays: 9,
    },
  ];

  const combined = [
    ...peerBots.map((b) => ({ ...b, isCurrentUser: false })),
    ...allUsers.map((u) => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.name)}`,
      xp: u.xp,
      weeklyXp: Math.max(250, Math.round(u.weeklySpentMinutes * 4.5)),
      streakDays: u.streakDays,
      isCurrentUser: u.id === currentUser.id,
    })),
  ];

  // Deduplicate by id
  const uniqueMap = new Map<string, (typeof combined)[number]>();
  for (const item of combined) {
    uniqueMap.set(item.id, item);
  }

  const sorted = Array.from(uniqueMap.values()).sort((a, b) => b.xp - a.xp);

  return sorted.map((entry, idx) => {
    const league: LeaderboardEntry['league'] =
      entry.xp >= 8000
        ? 'Diamentowa'
        : entry.xp >= 4500
        ? 'Złota'
        : entry.xp >= 2000
        ? 'Srebrna'
        : 'Brązowa';

    return {
      ...entry,
      rank: idx + 1,
      league,
    };
  });
}

export interface DailyChallengeSpec {
  id: string;
  title: string;
  xpReward: number;
  description: string;
  starterCode: string;
  solutionCode: string;
  testCases: {
    inputDesc: string;
    args: unknown[];
    expected: unknown;
  }[];
}

export const DAILY_CHALLENGES: DailyChallengeSpec[] = [
  {
    id: 'challenge-anagram',
    title: 'Sprawdź czy dwa słowa są anagramami',
    xpReward: 100,
    description:
      'Napisz funkcję czyAnagram(a, b), która zwraca true, jeśli oba napisy składają się z dokładnie tych samych liter (ignorując wielkość liter i spacje), lub false w przeciwnym razie.',
    starterCode: `function czyAnagram(a, b) {\n  // Uzupełnij implementację:\n  // Znormalizuj oba napisy (małe litery, bez spacji, posortowane znaki) i porównaj je\n  return false;\n}`,
    solutionCode: `function czyAnagram(a, b) {\n  const norm = (str) => String(str).toLowerCase().replace(/\\s+/g, '').split('').sort().join('');\n  return norm(a) === norm(b);\n}`,
    testCases: [
      { inputDesc: 'czyAnagram("listen", "silent")', args: ['listen', 'silent'], expected: true },
      { inputDesc: 'czyAnagram("React", "Caret")', args: ['React', 'Caret'], expected: true },
      { inputDesc: 'czyAnagram("FullStack", "Frontend")', args: ['FullStack', 'Frontend'], expected: false },
    ],
  },
  {
    id: 'challenge-fizzbuzz-sum',
    title: 'Suma liczb podzielnych przez 3 lub 5',
    xpReward: 100,
    description:
      'Napisz funkcję sumaPodzielnych(n), która zwraca sumę wszystkich liczb dodatnich mniejszych od n, które są podzielne przez 3 lub 5.',
    starterCode: `function sumaPodzielnych(n) {\n  // Uzupełnij implementację:\n  // Zsumuj liczby mniejsze od n podzielne przez 3 lub 5\n  return 0;\n}`,
    solutionCode: `function sumaPodzielnych(n) {\n  let suma = 0;\n  for (let i = 1; i < n; i++) {\n    if (i % 3 === 0 || i % 5 === 0) suma += i;\n  }\n  return suma;\n}`,
    testCases: [
      { inputDesc: 'sumaPodzielnych(10)', args: [10], expected: 23 },
      { inputDesc: 'sumaPodzielnych(16)', args: [16], expected: 60 },
      { inputDesc: 'sumaPodzielnych(4)', args: [4], expected: 3 },
    ],
  },
];

export interface ChallengeEvalResult {
  passedAll: boolean;
  results: {
    inputDesc: string;
    passed: boolean;
    actual: string;
    expected: string;
  }[];
  error?: string;
}

export function evaluateDailyChallenge(
  challenge: DailyChallengeSpec,
  userCode: string
): ChallengeEvalResult {
  try {
    const fnMatch = challenge.starterCode.match(/function\s+([a-zA-Z0-9_]+)/);
    const fnName = fnMatch ? fnMatch[1] : 'solve';
    const runner = new Function(`${userCode}\nreturn typeof ${fnName} === 'function' ? ${fnName} : null;`);
    const fn = runner();
    if (typeof fn !== 'function') {
      return {
        passedAll: false,
        results: [],
        error: `Nie znaleziono funkcji o nazwie ${fnName}().`,
      };
    }

    const results = challenge.testCases.map((tc) => {
      const actualVal = fn(...tc.args);
      const passed = JSON.stringify(actualVal) === JSON.stringify(tc.expected);
      return {
        inputDesc: tc.inputDesc,
        passed,
        actual: JSON.stringify(actualVal),
        expected: JSON.stringify(tc.expected),
      };
    });

    return {
      passedAll: results.every((r) => r.passed),
      results,
    };
  } catch (err: unknown) {
    return {
      passedAll: false,
      results: [],
      error: err instanceof Error ? err.message : 'Błąd wykonania kodu JS.',
    };
  }
}

// ============================================================================
// 4. SPACED REPETITION (SM-2) FLASHCARDS & CHEAT SHEETS
// ============================================================================

export type FlashcardRating = 'again' | 'hard' | 'good' | 'easy';

export interface FlashcardItem {
  id: string;
  category: 'HTML & CSS' | 'JavaScript & TS' | 'React & Next.js' | 'Backend & SQL' | 'DevOps & Git';
  question: string;
  answer: string;
  codeSnippet?: string;
}

export interface FlashcardScheduleState {
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  dueTimestamp: number;
}

export function calculateNextFlashcardReview(
  prev: FlashcardScheduleState | undefined,
  rating: FlashcardRating,
  nowMs: number = Date.now()
): FlashcardScheduleState {
  const current: FlashcardScheduleState = prev || {
    intervalDays: 0,
    easeFactor: 2.5,
    repetitions: 0,
    dueTimestamp: nowMs,
  };

  if (rating === 'again') {
    return {
      intervalDays: 1,
      easeFactor: Math.max(1.3, Number((current.easeFactor - 0.2).toFixed(2))),
      repetitions: 0,
      dueTimestamp: nowMs + 1 * 24 * 60 * 60 * 1000,
    };
  }

  const qualityMap: Record<FlashcardRating, number> = {
    again: 1,
    hard: 3,
    good: 4,
    easy: 5,
  };
  const q = qualityMap[rating];
  const nextReps = current.repetitions + 1;

  let nextInterval = 1;
  if (nextReps === 1) {
    nextInterval = rating === 'easy' ? 4 : 1;
  } else if (nextReps === 2) {
    nextInterval = rating === 'easy' ? 7 : 3;
  } else {
    const multiplier = rating === 'hard' ? 1.2 : rating === 'easy' ? current.easeFactor * 1.3 : current.easeFactor;
    nextInterval = Math.max(1, Math.round(current.intervalDays * multiplier));
  }

  const nextEase = Math.max(
    1.3,
    Number((current.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))).toFixed(2))
  );

  return {
    intervalDays: nextInterval,
    easeFactor: nextEase,
    repetitions: nextReps,
    dueTimestamp: nowMs + nextInterval * 24 * 60 * 60 * 1000,
  };
}

export const FLASHCARDS_DECK: FlashcardItem[] = [
  {
    id: 'fc-1',
    category: 'JavaScript & TS',
    question: 'Czym różni się == (luźne porównanie) od === (ścisłe porównanie) w JavaScript?',
    answer: 'Operator === porównuje zarówno wartość, jak i typ danych bez rzutowania (koercji), natomiast == dokonuje niejawnej konwersji typów przed porównaniem.',
    codeSnippet: "5 === '5' // false\n5 == '5'  // true",
  },
  {
    id: 'fc-2',
    category: 'React & Next.js',
    question: 'Dlaczego nie należy mutować stanu bezpośrednio w React (np. state.push(x))?',
    answer: 'React porównuje referencje obiektów (Object.is), aby zdecydować o re-renderze. Mutacja tej samej tablicy nie zmienia jej referencji w pamięci, więc komponent się nie odświeży.',
    codeSnippet: 'setItems((prev) => [...prev, newItem]);',
  },
  {
    id: 'fc-3',
    category: 'Backend & SQL',
    question: 'Czym różni się klauzula WHERE od HAVING w zapytaniach SQL?',
    answer: 'WHERE filtruje pojedyncze wiersze PRZED grupowaniem (GROUP BY), natomiast HAVING filtruje zgrupowane zestawy danych PO zastosowaniu funkcji agregujących (COUNT, SUM, AVG).',
    codeSnippet: 'SELECT dept, COUNT(*) FROM users WHERE active = true GROUP BY dept HAVING COUNT(*) > 5;',
  },
  {
    id: 'fc-4',
    category: 'HTML & CSS',
    question: 'Jak działa właściwość box-sizing: border-box w CSS?',
    answer: 'Sprawia, że zadeklarowane width oraz height elementu obejmują zawartość (content), dopełnienie (padding) oraz obramowanie (border), co zapobiega powiększaniu elementu.',
    codeSnippet: '*, *::before, *::after {\n  box-sizing: border-box;\n}',
  },
  {
    id: 'fc-5',
    category: 'DevOps & Git',
    question: 'Jaka jest różnica między git merge a git rebase?',
    answer: 'git merge łączy dwie gałęzie tworząc nowy commit scalający i zachowując pełną historię rozgałęzień. git rebase przenosi commity na czubek docelowej gałęzi, tworząc liniową historię.',
    codeSnippet: 'git checkout feature\ngit rebase main',
  },
  {
    id: 'fc-6',
    category: 'JavaScript & TS',
    question: 'Czym jest domknięcie (Closure) w języku JavaScript?',
    answer: 'Closure to mechanizm, dzięki któremu funkcja wewnętrzna zachowuje dostęp do zmiennych ze swojego zakresu leksykalnego (funkcji zewnętrznej) nawet po zakończeniu wykonywania funkcji zewnętrznej.',
    codeSnippet: 'function licznik() {\n  let n = 0;\n  return () => ++n;\n}',
  },
];

export interface CheatSheetSnippet {
  id: string;
  category: 'HTML5' | 'CSS Flexbox & Grid' | 'JavaScript ES6+' | 'React Hooks' | 'SQL & Bazy' | 'Git & Terminal';
  title: string;
  summary: string;
  code: string;
}

export const CHEAT_SHEETS_DATA: CheatSheetSnippet[] = [
  {
    id: 'cs-flex-center',
    category: 'CSS Flexbox & Grid',
    title: 'Idealne wyśrodkowanie w pionie i poziomie',
    summary: 'Najprostszy sposób na wyśrodkowanie elementu wewnątrz kontenera za pomocą Flexboxa lub CSS Grid.',
    code: `.container-flex {\n  display: flex;\n   justify-content: center;\n  align-items: center;\n}\n\n.container-grid {\n  display: grid;\n  place-items: center;\n}`,
  },
  {
    id: 'cs-grid-auto',
    category: 'CSS Flexbox & Grid',
    title: 'Responsywna siatka kart bez Media Queries',
    summary: 'Automatycznie dopasowująca się liczba kolumn z minimalną szerokością 260px.',
    code: `.grid-cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));\n  gap: 1.5rem;\n}`,
  },
  {
    id: 'cs-js-fetch',
    category: 'JavaScript ES6+',
    title: 'Bezpieczne pobieranie danych Fetch API z async/await',
    summary: 'Wzorzec obsługi błędów HTTP oraz parsowania JSON w nowoczesnym JS/TS.',
    code: `async function fetchUsers() {\n  const res = await fetch('/api/users');\n  if (!res.ok) throw new Error(\`HTTP error: \${res.status}\`);\n  return await res.json();\n}`,
  },
  {
    id: 'cs-react-effect',
    category: 'React Hooks',
    title: 'useEffect z czyszczeniem subskrypcji / AbortController',
    summary: 'Zapobieganie wyciekom pamięci oraz wyścigom żądań (race conditions) w komponentach React.',
    code: `useEffect(() => {\n  const controller = new AbortController();\n  fetch('/api/data', { signal: controller.signal })\n    .then((r) => r.json())\n    .then(setData)\n    .catch(() => {});\n  return () => controller.abort();\n}, []);`,
  },
  {
    id: 'cs-sql-join',
    category: 'SQL & Bazy',
    title: 'Łączenie tabel INNER JOIN oraz agregacja zamówień',
    summary: 'Pobranie klientów wraz z łączną wartością ich zamówień.',
    code: `SELECT u.name, COUNT(o.id) AS orders_count, SUM(o.total) AS total_spent\nFROM users u\nINNER JOIN orders o ON o.user_id = u.id\nGROUP BY u.id, u.name\nORDER BY total_spent DESC;`,
  },
  {
    id: 'cs-git-undo',
    category: 'Git & Terminal',
    title: 'Cofanie ostatniego commita z zachowaniem zmian w plikach',
    summary: 'Bezpieczne cofnięcie commita do strefy Staging (index) bez utraty napisanego kodu.',
    code: `git reset --soft HEAD~1\n# Lub poprawienie opisu ostatniego commita:\ngit commit --amend -m "Nowy poprawny opis"`,
  },
];

export function filterCheatSheets(
  items: CheatSheetSnippet[],
  category: string,
  searchQuery: string
): CheatSheetSnippet[] {
  const q = searchQuery.trim().toLowerCase();
  return items.filter((item) => {
    const matchesCategory = category === 'Wszystkie' || item.category === category;
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
}

// ============================================================================
// 5. CV / PORTFOLIO GENERATOR & JSON BACKUP VALIDATOR
// ============================================================================

export function generateGithubPortfolioMarkdown(
  user: User,
  completedModuleTitles: string[],
  completedProjectTitles: string[]
): string {
  const skills = [
    'HTML5 & Semantyka',
    'CSS3 / Tailwind CSS',
    'JavaScript (ES6+) & TypeScript',
    'React 19 & Hooks',
    'Node.js & Express REST API',
    'SQL & Relacyjne Bazy Danych',
    'Git & DevOps Podstawy',
  ];

  return `# Cześć! Jestem ${user.name} 👋
### Junior Full Stack Developer | Poziom ${user.level} (${user.xp} XP)

${user.bio || 'Pasjonat tworzenia nowoczesnych aplikacji webowych w oparciu o React, TypeScript oraz Node.js.'}

---

## 🛠 Stack Technologiczny
${skills.map((s) => `- **${s}**`).join('\n')}

## 🏆 Zrealizowane Projekty Portfolio (${completedProjectTitles.length})
${
  completedProjectTitles.length > 0
    ? completedProjectTitles.map((t, i) => `${i + 1}. **${t}** — Pełna implementacja Full Stack`).join('\n')
    : '- W trakcie realizacji pierwszego projektu portfolio'
}

## 📚 Ukończone Moduły i Lekcje (${user.completedLessons.length} lekcji)
${
  completedModuleTitles.length > 0
    ? completedModuleTitles.map((m) => `- [x] ${m}`).join('\n')
    : `- Ukończone lekcje: ${user.completedLessons.length}`
}

## 📊 Statystyki Akademii
- **Seria nauki (Streak):** ${user.streakDays} dni z rzędu
- **Zdobyte odznaki:** ${user.unlockedBadges.length}
- **Kontakt:** ${user.email}
`;
}

export interface BackupValidationResult {
  valid: boolean;
  user?: User;
  error?: string;
}

export function validateBackupPayload(rawJson: string): BackupValidationResult {
  if (!rawJson || !rawJson.trim()) {
    return { valid: false, error: 'Wklej zawartość pliku JSON lub wgraj plik z dysku.' };
  }

  try {
    const parsed = JSON.parse(rawJson);
    const candidate = parsed?.user || parsed;
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
      return { valid: false, error: 'Plik nie zawiera poprawnego obiektu profilu.' };
    }
    if (
      typeof candidate.id !== 'string' ||
      !candidate.id.trim() ||
      typeof candidate.name !== 'string' ||
      candidate.name.trim().length < 2 ||
      typeof candidate.email !== 'string' ||
      !candidate.email.includes('@')
    ) {
      return {
        valid: false,
        error: 'Brakuje wymaganych lub poprawnych pól profilu (id, name min. 2 znaki, poprawny email).',
      };
    }
    if (
      typeof candidate.xp !== 'number' ||
      !Number.isFinite(candidate.xp) ||
      candidate.xp < 0 ||
      !Array.isArray(candidate.completedLessons)
    ) {
      return {
        valid: false,
        error: 'Nieprawidłowa struktura postępów (xp musi być liczbą >= 0, a completedLessons tablicą).',
      };
    }

    const safeXp = Math.max(0, Math.floor(candidate.xp));
    const safeLessons = candidate.completedLessons.filter((item: unknown): item is string => typeof item === 'string');
    const safeProjects = Array.isArray(candidate.completedProjects)
      ? candidate.completedProjects.filter((item: unknown): item is string => typeof item === 'string')
      : [];
    const safeBadges = Array.isArray(candidate.unlockedBadges)
      ? candidate.unlockedBadges.filter((item: unknown): item is string => typeof item === 'string')
      : [];
    const safeClaimed = Array.isArray(candidate.claimedRewards)
      ? candidate.claimedRewards.filter((item: unknown): item is string => typeof item === 'string')
      : [];

    const normalizedUser: User = {
      id: candidate.id.trim(),
      name: candidate.name.trim(),
      email: candidate.email.trim(),
      role: candidate.role === 'admin' ? 'admin' : 'student',
      status:
        candidate.status === 'active' ||
        candidate.status === 'suspended' ||
        candidate.status === 'pending_verification' ||
        candidate.status === 'banned'
          ? candidate.status
          : 'active',
      antiBotVerified: typeof candidate.antiBotVerified === 'boolean' ? candidate.antiBotVerified : true,
      antiBotScore: typeof candidate.antiBotScore === 'number' ? candidate.antiBotScore : 100,
      avatar:
        typeof candidate.avatar === 'string' && candidate.avatar.trim()
          ? candidate.avatar
          : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(candidate.name.trim())}`,
      xp: safeXp,
      level: typeof candidate.level === 'number' && candidate.level >= 1 ? candidate.level : Math.max(1, Math.floor(safeXp / 500) + 1),
      streakDays: typeof candidate.streakDays === 'number' && candidate.streakDays >= 0 ? candidate.streakDays : 1,
      lastActiveDate:
        typeof candidate.lastActiveDate === 'string' && candidate.lastActiveDate
          ? candidate.lastActiveDate
          : new Date().toISOString().split('T')[0],
      weeklyGoalMinutes:
        typeof candidate.weeklyGoalMinutes === 'number' && candidate.weeklyGoalMinutes >= 30
          ? candidate.weeklyGoalMinutes
          : 180,
      weeklySpentMinutes:
        typeof candidate.weeklySpentMinutes === 'number' && candidate.weeklySpentMinutes >= 0
          ? candidate.weeklySpentMinutes
          : 0,
      completedLessons: safeLessons,
      completedProjects: safeProjects,
      quizScores:
        candidate.quizScores && typeof candidate.quizScores === 'object' && !Array.isArray(candidate.quizScores)
          ? candidate.quizScores
          : {},
      unlockedBadges: safeBadges,
      claimedRewards: safeClaimed,
      savedCode:
        candidate.savedCode && typeof candidate.savedCode === 'object' && !Array.isArray(candidate.savedCode)
          ? candidate.savedCode
          : {},
      lives: typeof candidate.lives === 'number' ? Math.max(0, Math.min(5, candidate.lives)) : 5,
      maxLives: typeof candidate.maxLives === 'number' && candidate.maxLives > 0 ? candidate.maxLives : 5,
      isPro: Boolean(candidate.isPro),
      proPlan: candidate.proPlan || null,
      streakFreezes: typeof candidate.streakFreezes === 'number' && candidate.streakFreezes >= 0 ? candidate.streakFreezes : 1,
      bio: typeof candidate.bio === 'string' ? candidate.bio : undefined,
      createdAt:
        typeof candidate.createdAt === 'string' && candidate.createdAt
          ? candidate.createdAt
          : new Date().toISOString().split('T')[0],
    };

    if (
      normalizedUser.id === 'user-guest' ||
      normalizedUser.email.toLowerCase() === 'gosc@fullstack-academy.pl'
    ) {
      return {
        valid: false,
        error: 'Nie można zaimportować tymczasowego profilu Gościa. Zaloguj się na konto kursanta.',
      };
    }

    return { valid: true, user: normalizedUser };
  } catch {
    return { valid: false, error: 'Plik nie jest poprawnym dokumentem JSON.' };
  }
}

export function sanitizeUserForExport(user: User): Omit<User, 'password'> {
  const { password: _removedPassword, ...safeUser } = user;
  return safeUser;
}

export function generateCertificateCode(user: User): string {
  if (user.id === 'user-guest' || (user.email || '').trim().toLowerCase() === 'gosc@fullstack-academy.pl') {
    return 'FSDA-GUEST-LOCKED';
  }
  const cleanId = (user.id || 'student').replace(/^user-/, '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase();
  return `FSDA-2026-${cleanId || 'STUDENT'}-${user.level || 1}X`;
}

export interface CertificateVerificationResult {
  valid: boolean;
  code: string;
  holderName?: string;
  holderEmail?: string;
  level?: number;
  xp?: number;
  completedLessonsCount?: number;
  completedProjectsCount?: number;
  isOfficial?: boolean;
  message: string;
}

export function verifyCertificateCode(
  inputCode: string,
  allUsers: User[],
  currentUser?: User
): CertificateVerificationResult {
  const clean = (inputCode || '').trim().toUpperCase();
  if (!clean) {
    return {
      valid: false,
      code: '',
      message: 'Wprowadź kod identyfikacyjny certyfikatu (np. FSDA-2026-ADMIN-10X).',
    };
  }

  if (clean.includes('GUEST')) {
    return {
      valid: false,
      code: clean,
      message:
        'Konto Gościa (Niezalogowany) nie posiada uprawnień do wystawienia certyfikatu. Zaloguj się na zweryfikowane konto kursanta.',
    };
  }

  const pool = currentUser && currentUser.id !== 'user-guest'
    ? [...allUsers.filter((u) => u.id !== currentUser.id), currentUser]
    : allUsers.filter((u) => u.id !== 'user-guest');

  const matchedUser = pool.find((u) => generateCertificateCode(u).toUpperCase() === clean);
  if (!matchedUser) {
    return {
      valid: false,
      code: clean,
      message: 'Nie znaleziono certyfikatu o podanym identyfikatorze w rejestrze Akademii.',
    };
  }

  const isOfficial =
    matchedUser.role === 'admin' ||
    (matchedUser.completedLessons.length >= 3 && matchedUser.completedProjects.length >= 1);

  return {
    valid: true,
    code: generateCertificateCode(matchedUser),
    holderName: matchedUser.name,
    holderEmail: matchedUser.email,
    level: matchedUser.level,
    xp: matchedUser.xp,
    completedLessonsCount: matchedUser.completedLessons.length,
    completedProjectsCount: matchedUser.completedProjects.length,
    isOfficial,
    message: isOfficial
      ? `Certyfikat autentyczny i oficjalnie zatwierdzony dla: ${matchedUser.name}.`
      : `Certyfikat przypisany do: ${matchedUser.name} (status: w trakcie realizacji wymagań końcowych).`,
  };
}

export interface SqlMission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  checkQuery: (cleanSql: string, rowCount: number) => boolean;
}

export const SQL_MISSIONS: SqlMission[] = [
  {
    id: 'sql-join-orders',
    title: 'Złączenie relacyjne INNER JOIN',
    description: 'Pobierz opłacone zamówienia wraz z danymi użytkowników za pomocą INNER JOIN orders i users.',
    xpReward: 50,
    checkQuery: (sql, count) =>
      /from\s+orders/i.test(sql) && /join\s+users/i.test(sql) && count > 0,
  },
  {
    id: 'sql-filter-courses',
    title: 'Filtrowanie katalogu kursów (WHERE)',
    description: 'Wyszukaj moduły z tabeli courses posiadające co najmniej 700 XP (WHERE xp >= 700 lub xp > 700).',
    xpReward: 40,
    checkQuery: (sql, count) =>
      /from\s+courses/i.test(sql) && /where\s+.*xp\s*>=?\s*\d+/i.test(sql) && count > 0,
  },
  {
    id: 'sql-high-quizzes',
    title: 'Analiza wyników quizów',
    description: 'Pobierz wyniki z tabeli quizzes posortowane malejąco (ORDER BY ... DESC).',
    xpReward: 45,
    checkQuery: (sql, count) =>
      /from\s+quizzes/i.test(sql) && /order\s+by\s+.*desc/i.test(sql) && count > 0,
  },
];

export function validateSqlQuerySyntax(rawQuery: string): { valid: boolean; cleanQuery: string; error?: string } {
  const clean = (rawQuery || '').trim().replace(/;+\s*$/, '');
  if (!clean) {
    return {
      valid: false,
      cleanQuery: '',
      error: 'ERROR 42601: Zapytanie SQL nie może być puste. Wprowadź instrukcję SELECT ... FROM <tabela>.',
    };
  }
  if (!/^select\s+.+\s+from\s+(users|courses|orders|quizzes)\b/is.test(clean)) {
    return {
      valid: false,
      cleanQuery: clean,
      error:
        'ERROR 42601: Błąd składniowy SQL. Dozwolone są zapytania SELECT <kolumny> FROM <users | courses | orders | quizzes>.',
    };
  }
  return { valid: true, cleanQuery: clean };
}


