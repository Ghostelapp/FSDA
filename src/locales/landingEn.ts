import type { AppLanguage } from '../utils/i18n';

export interface LandingAnalogyExample {
  id: string;
  term: string;
  jargon: string;
  analogyTitle: string;
  analogyText: string;
}

export interface LandingFlashcardItem {
  category: string;
  question: string;
  answer: string;
}

export interface LandingPlaygroundSample {
  id: 'html' | 'css' | 'js' | 'sql';
  label: string;
  lessonRef: string;
  taskTitle: string;
  analogy: string;
  beginnerHint: string;
  starterCode: string;
  solutionCode: string;
  checkRule: (code: string) => boolean;
  ruleLabel: string;
}

export interface LandingPortfolioShowcaseProject {
  id: string;
  projectRef: string;
  index: string;
  title: string;
  category: string;
  difficulty: string;
  estimatedHours: number;
  summary: string;
  stack: string;
  architectureLayers: { layer: string; detail: string }[];
  acceptanceCriteria: string[];
}

export interface LandingFaqItem {
  id: string;
  question: string;
  answer: string;
}

export function getTechRibbonItems(language: AppLanguage): string[] {
  if (language === 'en') {
    return [
      'HTML5 Semantics',
      'CSS Grid & Flexbox',
      'Tailwind CSS',
      'JavaScript ES2025',
      'TypeScript 5',
      'React 19',
      'Next.js App Router',
      'Node.js & Express',
      'PostgreSQL & SQL',
      'Prisma ORM',
      'REST API & JWT',
      'WebSockets Real-Time',
      'Docker Multi-Stage',
      'Git & GitHub Actions',
      'Playwright E2E',
    ];
  }
  return [
    'HTML5 Semantyka',
    'CSS Grid & Flexbox',
    'Tailwind CSS',
    'JavaScript ES2025',
    'TypeScript 5',
    'React 19',
    'Next.js App Router',
    'Node.js & Express',
    'PostgreSQL & SQL',
    'Prisma ORM',
    'REST API & JWT',
    'WebSockets Real-Time',
    'Docker Multi-Stage',
    'Git & GitHub Actions',
    'Playwright E2E',
  ];
}

export function getLandingAnalogies(language: AppLanguage): LandingAnalogyExample[] {
  if (language === 'en') {
    return [
      {
        id: 'api',
        term: 'REST API & Endpoints',
        jargon: 'Stateless client-server communication protocol over HTTP methods (GET, POST, PUT, DELETE) exchanging JSON payloads.',
        analogyTitle: 'A Waiter at a Restaurant',
        analogyText:
          'You (the browser) never walk into the kitchen (the database) yourself. You place an order with the waiter (the API), and they bring your finished dish (JSON data) straight to your table.',
      },
      {
        id: 'middleware',
        term: 'Middleware & Auth',
        jargon: 'Intermediate function in the Express request pipeline intercepting the Request object before running the target controller.',
        analogyTitle: 'Bouncer at a Concert',
        analogyText:
          'Before stepping into the VIP area (student dashboard), the bouncer at the door checks your ticket (JWT token). Without a valid pass, you are politely sent back to login.',
      },
      {
        id: 'sql',
        term: 'SQL Relations (JOIN)',
        jargon: 'Joining normalized relational tables through Foreign Key constraints and relational projection.',
        analogyTitle: 'Order Book and Customer Card File',
        analogyText:
          'Instead of copying a customer’s address onto every receipt, you store only their numeric ID. Whenever you need the shipping address, you match both cards by that ID.',
      },
      {
        id: 'docker',
        term: 'Docker Containerization',
        jargon: 'Isolating an application process and all OS-level dependencies inside an immutable user-space image.',
        analogyTitle: 'Standard Shipping Container',
        analogyText:
          'You seal your app alongside its exact Node.js runtime and config inside one portable box. It runs identically on your laptop and on any production cloud server.',
      },
    ];
  }
  return [
    {
      id: 'api',
      term: 'REST API & Endpointy',
      jargon: 'Bezstanowy interfejs komunikacji klient-serwer oparty o metody HTTP (GET, POST, PUT, DELETE) oraz wymianę JSON.',
      analogyTitle: 'Kelner w restauracji',
      analogyText:
        'Ty (przeglądarka) nie wchodzisz sam do kuchni (bazy danych). Składasz zamówienie u kelnera (API), a on przynosi gotowe danie (dane JSON) na Twój stolik.',
    },
    {
      id: 'middleware',
      term: 'Middleware & Auth',
      jargon: 'Funkcja pośrednicząca w potoku żądań Express przechwytująca obiekt Request przed wykonaniem kontrolera docelowego.',
      analogyTitle: 'Bramkarz na koncercie',
      analogyText:
        'Zanim wejdziesz na strefę VIP (panel kursanta), ochroniarz przy wejściu sprawdza Twój bilet (token JWT). Bez ważnego biletu grzecznie zawraca Cię na start.',
    },
    {
      id: 'sql',
      term: 'Relacje SQL (JOIN)',
      jargon: 'Łączenie znormalizowanych tabel za pomocą klucza obcego (Foreign Key) oraz operacji iloczynu relacyjnego.',
      analogyTitle: 'Księga zamówień i kartoteka klientów',
      analogyText:
        'Zamiast przepisywać adres klienta przy każdym paragonie, zapisujesz tylko jego numer ID. Gdy potrzebujesz adresu do wysyłki, łączysz obie kartki po tym numerze.',
    },
    {
      id: 'docker',
      term: 'Konteneryzacja Docker',
      jargon: 'Izolacja procesu aplikacyjnego i wszystkich jego zależności systemowych w lekkim obrazie przestrzeni użytkownika.',
      analogyTitle: 'Kontener morski ze sprzętem',
      analogyText:
        'Pakujesz swój projekt razem z odpowiednią wersją Node.js i ustawieniami do jednego szczelnego pudła. Działa dokładnie tak samo na Twoim laptopie i serwerze produkcyjnym.',
    },
  ];
}

export function getLandingFlashcards(language: AppLanguage): LandingFlashcardItem[] {
  if (language === 'en') {
    return [
      {
        category: 'JavaScript & React',
        question: 'Why do we assign a unique key prop when rendering a list of elements in React?',
        answer:
          'It lets React’s reconciliation engine track precisely which element was added, moved, or removed — avoiding needless DOM re-renders of the entire list.',
      },
      {
        category: 'Backend & Security',
        question: 'Why do we store refresh tokens inside an HttpOnly cookie?',
        answer:
          'The HttpOnly flag blocks client-side JavaScript (document.cookie) from reading the token, protecting the session even if an XSS vulnerability occurs.',
      },
      {
        category: 'SQL Databases',
        question: 'What is the difference between LEFT JOIN and INNER JOIN in a SELECT query?',
        answer:
          'INNER JOIN returns only matching rows across both tables, whereas LEFT JOIN preserves every row from the left table even when no right-side match exists.',
      },
    ];
  }
  return [
    {
      category: 'JavaScript & React',
      question: 'Dlaczego w React używamy klucza key podczas renderowania listy elementów?',
      answer:
        'Pozwala to silnikowi React dokładnie rozpoznać, który element został dodany, przesunięty lub usunięty — bez zbędnego przerysowywania całej listy w DOM.',
    },
    {
      category: 'Backend & Bezpieczeństwo',
      question: 'Po co zapisujemy token odświeżający w ciasteczku z flagą HttpOnly?',
      answer:
        'Flaga HttpOnly blokuje dostęp skryptów JavaScript (document.cookie) do tokenu, co chroni sesję użytkownika nawet w przypadku ataku XSS.',
    },
    {
      category: 'Bazy Danych SQL',
      question: 'Czym różni się LEFT JOIN od INNER JOIN w zapytaniu SELECT?',
      answer:
        'INNER JOIN zwraca wyłącznie pasujące rekordy z obu tabel, a LEFT JOIN zachowuje wszystkie wiersze z lewej tabeli, nawet jeśli nie mają jeszcze dopasowania po prawej.',
    },
  ];
}

export function getLandingPlaygroundSamples(language: AppLanguage): LandingPlaygroundSample[] {
  if (language === 'en') {
    return [
      {
        id: 'html',
        label: '01. HTML',
        lessonRef: 'html-1',
        taskTitle: 'Add an <h1> heading and a <button> inside the profile card',
        analogy: 'HTML is the skeleton of the page — every tag tells the browser what each element represents.',
        beginnerHint:
          'Type <h1>Maja Kowalska</h1> inside the heading, then add <button>Portfolio</button> below the <p> bio.',
        starterCode: `<div class="card">
  <p class="kicker">Software Engineer</p>
  <h1></h1>
  <p class="bio">React & TypeScript</p>
</div>`,
        solutionCode: `<div class="card">
  <p class="kicker">Software Engineer</p>
  <h1>Maja Kowalska</h1>
  <p class="bio">React & TypeScript</p>
  <button>Portfolio</button>
</div>`,
        checkRule: (code: string) =>
          /<h1>\s*[^<\s][^<]*<\/h1>/i.test(code) && /<button[^>]*>[\s\S]*?<\/button>/i.test(code),
        ruleLabel: 'Added <h1> heading and <button> control',
      },
      {
        id: 'css',
        label: '02. CSS',
        lessonRef: 'css-1',
        taskTitle: 'Enable Flexbox layout (display: flex) and spacing gap: 16px',
        analogy: 'Flexbox acts like a smart shelf that arranges neighboring items cleanly in a row.',
        beginnerHint: 'Replace display: block with display: flex; and add gap: 16px; on a new line.',
        starterCode: `.pricing-row {
  display: block;
  padding: 16px;
  background: #0f172a;
  border-radius: 12px;
}`,
        solutionCode: `.pricing-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px;
}`,
        checkRule: (code: string) => /display\s*:\s*flex/i.test(code) && /gap\s*:\s*\d+/i.test(code),
        ruleLabel: 'Declared display: flex and spacing gap',
      },
      {
        id: 'js',
        label: '03. JS',
        lessonRef: 'js-1',
        taskTitle: 'Calculate total XP after completing a lesson and return the result',
        analogy: 'A function is like a recipe: you pass input values in, and return hands back the finished result.',
        beginnerHint: 'Replace return 0; with return currentXP + lessonBonus;',
        starterCode: `function calculateNewXP(currentXP, lessonBonus) {
  return 0;
}

const totalXP = calculateNewXP(1250, 150);`,
        solutionCode: `function calculateNewXP(currentXP, lessonBonus) {
  return currentXP + lessonBonus;
}

const totalXP = calculateNewXP(1250, 150);`,
        checkRule: (code: string) =>
          /return\s+currentXP\s*\+\s*lessonBonus/i.test(code) ||
          /return\s+aktualneXP\s*\+\s*bonusZaLekcje/i.test(code),
        ruleLabel: 'Function returns currentXP + lessonBonus',
      },
      {
        id: 'sql',
        label: '04. SQL',
        lessonRef: 'db-1',
        taskTitle: 'Query students above level 5 sorted descending by XP',
        analogy: 'A SELECT query works like a smart spreadsheet filter — picking columns, condition, and sort order.',
        beginnerHint: 'Add WHERE level > 5 and ORDER BY xp DESC;',
        starterCode: `SELECT name, role, xp, level
FROM students
-- Add WHERE level > 5 and ORDER BY xp DESC;`,
        solutionCode: `SELECT name, role, xp, level
FROM students
WHERE level > 5
ORDER BY xp DESC;`,
        checkRule: (code: string) =>
          /WHERE\s+level\s*>\s*5/i.test(code) && /ORDER\s+BY\s+xp\s+DESC/i.test(code),
        ruleLabel: 'Filter WHERE level > 5 and sort ORDER BY xp DESC',
      },
    ];
  }

  return [
    {
      id: 'html',
      label: '01. HTML',
      lessonRef: 'html-1',
      taskTitle: 'Dopisz nagłówek <h1> oraz przycisk <button> w karcie profilu',
      analogy: 'HTML to szkielet strony — każdy znacznik mówi przeglądarce, czym jest dany element.',
      beginnerHint:
        'Wpisz wewnątrz <h1>Maja Kowalska</h1>, a pod akapitem <p> dodaj <button>Zobacz Portfolio</button>.',
      starterCode: `<div class="card">
  <p class="kicker">Inżynier IT</p>
  <h1></h1>
  <p class="bio">React & TypeScript</p>
</div>`,
      solutionCode: `<div class="card">
  <p class="kicker">Inżynier IT</p>
  <h1>Maja Kowalska</h1>
  <p class="bio">React & TypeScript</p>
  <button>Portfolio</button>
</div>`,
      checkRule: (code: string) =>
        /<h1>\s*[^<\s][^<]*<\/h1>/i.test(code) && /<button[^>]*>[\s\S]*?<\/button>/i.test(code),
      ruleLabel: 'Dodano <h1> i przycisk <button>',
    },
    {
      id: 'css',
      label: '02. CSS',
      lessonRef: 'css-1',
      taskTitle: 'Włącz układ Flexbox (display: flex) i odstęp gap: 16px',
      analogy: 'Flexbox działa jak inteligentna półka, która równo układa elementy obok siebie.',
      beginnerHint: 'Zamień display: block na display: flex; oraz dodaj w nowej linii gap: 16px;',
      starterCode: `.pricing-row {
  display: block;
  padding: 16px;
  background: #0f172a;
  border-radius: 12px;
}`,
      solutionCode: `.pricing-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px;
}`,
      checkRule: (code: string) => /display\s*:\s*flex/i.test(code) && /gap\s*:\s*\d+/i.test(code),
      ruleLabel: 'Zadeklarowano display: flex oraz odstęp gap',
    },
    {
      id: 'js',
      label: '03. JS',
      lessonRef: 'js-1',
      taskTitle: 'Oblicz sumę punktów XP po ukończeniu lekcji i zwróć wynik',
      analogy: 'Funkcja to przepis: podajesz dane wejściowe, a return oddaje gotowy rezultat.',
      beginnerHint: 'Zamiast return 0; wpisz return aktualneXP + bonusZaLekcje;',
      starterCode: `function obliczNoweXP(aktualneXP, bonusZaLekcje) {
  return 0;
}

const wynik = obliczNoweXP(1250, 150);`,
      solutionCode: `function obliczNoweXP(aktualneXP, bonusZaLekcje) {
  return aktualneXP + bonusZaLekcje;
}

const wynik = obliczNoweXP(1250, 150);`,
      checkRule: (code: string) => /return\s+aktualneXP\s*\+\s*bonusZaLekcje/i.test(code),
      ruleLabel: 'Funkcja zwraca sumę aktualneXP + bonusZaLekcje',
    },
    {
      id: 'sql',
      label: '04. SQL',
      lessonRef: 'db-1',
      taskTitle: 'Pobierz kursantów z poziomem powyżej 5 posortowanych malejąco po XP',
      analogy: 'Zapytanie SELECT działa jak filtr tabeli — wybierasz kolumny, warunek i kolejność.',
      beginnerHint: 'Dopisz warunek WHERE level > 5 oraz sortowanie ORDER BY xp DESC;',
      starterCode: `SELECT imie, rola, xp, level
FROM kursanci
-- Dopisz WHERE level > 5 i ORDER BY xp DESC;`,
      solutionCode: `SELECT imie, rola, xp, level
FROM kursanci
WHERE level > 5
ORDER BY xp DESC;`,
      checkRule: (code: string) =>
        /WHERE\s+level\s*>\s*5/i.test(code) && /ORDER\s+BY\s+xp\s+DESC/i.test(code),
      ruleLabel: 'Filtr WHERE level > 5 i sortowanie ORDER BY xp DESC',
    },
  ];
}

export function getLandingShowcaseProjects(language: AppLanguage): LandingPortfolioShowcaseProject[] {
  if (language === 'en') {
    return [
      {
        id: 'fintech',
        projectRef: 'proj-1',
        index: '01',
        title: 'FinTech Personal Banking & Budget Dashboard (SPA)',
        category: 'Frontend & TypeScript',
        difficulty: 'Junior Level',
        estimatedHours: 14,
        summary:
          'Interactive financial panel featuring transaction categorization, real-time multi-currency conversion, cashflow charts, and persistent browser storage.',
        stack: 'React 19 · TypeScript · Tailwind CSS · LocalStorage & REST API',
        architectureLayers: [
          {
            layer: 'Presentation Layer',
            detail: 'Functional React components using tabular numeric formatting (tabular-nums) and responsive CSS Grid.',
          },
          {
            layer: 'State Logic',
            detail: 'Strictly typed TypeScript interfaces and custom hooks computing real-time income and expense balances.',
          },
          {
            layer: 'Data Validation',
            detail: 'Guards preventing negative transactions, empty titles, and floating-point rounding drift.',
          },
        ],
        acceptanceCriteria: [
          'Adding and filtering transactions smoothly without page reloads',
          'Real-time balance conversion across PLN / EUR / USD',
          '100% strict TypeScript type coverage with zero any casts',
        ],
      },
      {
        id: 'ecommerce',
        projectRef: 'proj-2',
        index: '02',
        title: 'E-Commerce REST API Engine with JWT Authorization',
        category: 'Backend & Databases',
        difficulty: 'Junior / Mid Level',
        estimatedHours: 22,
        summary:
          'Complete online store API managing shopping carts, warehouse inventory, ACID transactions in PostgreSQL, and secure JWT + Refresh Token authentication.',
        stack: 'Node.js · Express · PostgreSQL · Prisma ORM · Zod · JWT',
        architectureLayers: [
          {
            layer: 'API & Middleware Layer',
            detail: 'RESTful endpoints guarded by Zod payload validation and RBAC role authorization.',
          },
          {
            layer: 'Relational SQL Database',
            detail: '1:N and N:M relations connecting users, orders, and products inside atomic database transactions.',
          },
          {
            layer: 'OWASP Security',
            detail: 'bcrypt password hashing, HttpOnly cookie transport, and full SQL Injection protection.',
          },
        ],
        acceptanceCriteria: [
          'Atomic warehouse stock reservation on order checkout',
          'Consistent JSON error responses for HTTP 400 / 401 / 403 / 404',
          'Automated integration test suite covering full checkout flows',
        ],
      },
      {
        id: 'kanban',
        projectRef: 'proj-3',
        index: '03',
        title: 'Real-Time Engineering Team Kanban Board',
        category: 'Full Stack & WebSockets',
        difficulty: 'Mid Level',
        estimatedHours: 26,
        summary:
          'Collaborative task management web application synchronizing board edits, drag-and-drop card moves, and comments across open browser tabs in under 50 ms.',
        stack: 'Next.js · TypeScript · Node.js · WebSockets · Redis Cache',
        architectureLayers: [
          {
            layer: 'Live Sync Engine',
            detail: 'Bidirectional WebSocket event channel broadcasting card moves and comments under 50 ms.',
          },
          {
            layer: 'Optimistic UI',
            detail: 'Instantaneous UI updates paired with automatic rollback protection if network drops.',
          },
          {
            layer: 'Cache Layer',
            detail: 'Redis caching for active boards and sessions to keep PostgreSQL latency ultra-low.',
          },
        ],
        acceptanceCriteria: [
          'Drag & drop cards seamlessly across To Do / In Progress / Done columns',
          'Concurrent multi-user board editing without stale state overwrites',
          'Full keyboard accessibility (WCAG AA) and responsive mobile controls',
        ],
      },
      {
        id: 'devops',
        projectRef: 'proj-4',
        index: '04',
        title: 'Production Deployment with Docker, Nginx & CI/CD',
        category: 'DevOps & Cloud',
        difficulty: 'Production Level',
        estimatedHours: 18,
        summary:
          'Automated release pipeline building slim multi-stage Docker images, running Vitest + Playwright E2E checks in GitHub Actions, and serving behind Nginx SSL.',
        stack: 'Docker · GitHub Actions · Linux VPS · Nginx · Playwright E2E',
        architectureLayers: [
          {
            layer: 'Containerization',
            detail: 'Multi-stage Dockerfile builds reducing production image size by over 75%.',
          },
          {
            layer: 'Quality Gate Pipeline',
            detail: 'Automated deployment blocks on any TypeScript compilation error or failing E2E test.',
          },
          {
            layer: 'Reverse Proxy & Security',
            detail: 'Nginx configured with Let’s Encrypt TLS certificates and hardened HSTS / CSP headers.',
          },
        ],
        acceptanceCriteria: [
          'Zero-downtime container rebuilds and health-checked restarts',
          'Automated Playwright browser smoke tests before shipping',
          'Public HTTPS URL ready for engineering CVs and recruiter demos',
        ],
      },
    ];
  }

  return [
    {
      id: 'fintech',
      projectRef: 'proj-1',
      index: '01',
      title: 'System Bankowości i Budżetu FinTech (SPA)',
      category: 'Frontend & TypeScript',
      difficulty: 'Poziom Junior',
      estimatedHours: 14,
      summary:
        'Interaktywny panel finansowy z kategoryzacją transakcji, wielowalutowym przelicznikiem kursów w czasie rzeczywistym, wykresami przepływów oraz trwałym zapisem stanu.',
      stack: 'React 19 · TypeScript · Tailwind CSS · LocalStorage & REST API',
      architectureLayers: [
        {
          layer: 'Warstwa Prezentacji',
          detail: 'Komponenty funkcyjne React z tabelarycznym formatowaniem kwot (tabular-nums) i responsywnym układem Grid.',
        },
        {
          layer: 'Logika Stanu',
          detail: 'Silnie typowane interfejsy TypeScript oraz niestandardowe hooki obliczające bilans przychodów i wydatków.',
        },
        {
          layer: 'Walidacja Danych',
          detail: 'Ochrona przed ujemnymi kwotami, pustymi tytułami i błędami zaokrągleń zmiennoprzecinkowych.',
        },
      ],
      acceptanceCriteria: [
        'Dodawanie i filtrowanie transakcji bez przeładowania strony',
        'Automatyczne przeliczanie salda w PLN / EUR / USD',
        '100% pokrycia typami TypeScript bez użycia any',
      ],
    },
    {
      id: 'ecommerce',
      projectRef: 'proj-2',
      index: '02',
      title: 'Silnik E-Commerce REST API z Autoryzacją JWT',
      category: 'Backend & Bazy Danych',
      difficulty: 'Poziom Junior / Regular',
      estimatedHours: 22,
      summary:
        'Kompletny serwer sklepu internetowego obsługujący koszyk, stany magazynowe, transakcje ACID w PostgreSQL oraz bezpieczne logowanie z tokenami JWT i Refresh Token.',
      stack: 'Node.js · Express · PostgreSQL · Prisma ORM · Zod · JWT',
      architectureLayers: [
        {
          layer: 'Warstwa API & Middleware',
          detail: 'Endpointy RESTful zabezpieczone walidacją schematów Zod oraz kontrolą uprawnień RBAC.',
        },
        {
          layer: 'Baza Relacyjna SQL',
          detail: 'Relacje 1:N oraz N:M pomiędzy użytkownikami, zamówieniami i produktami z transakcjami bazodanowymi.',
        },
        {
          layer: 'Bezpieczeństwo OWASP',
          detail: 'Haszowanie haseł algorytmem bcrypt, ciasteczka HttpOnly i ochrona przed SQL Injection.',
        },
      ],
      acceptanceCriteria: [
        'Atomowa rezerwacja towaru w magazynie podczas składania zamówienia',
        'Obsługa błędów HTTP 400 / 401 / 403 / 404 w ujednoliconym formacie JSON',
        'Zestaw testów integracyjnych dla ścieżki zakupowej',
      ],
    },
    {
      id: 'kanban',
      projectRef: 'proj-3',
      index: '03',
      title: 'Zespołowa Tablica Inżynierska Real-Time',
      category: 'Full Stack & WebSockets',
      difficulty: 'Poziom Regular',
      estimatedHours: 26,
      summary:
        'Aplikacja do zarządzania zadaniami zespołowymi z natychmiastową synchronizacją zmian pomiędzy wieloma otwartymi oknami przeglądarki przez WebSockets.',
      stack: 'Next.js · TypeScript · Node.js · WebSockets · Redis Cache',
      architectureLayers: [
        {
          layer: 'Synchronizacja na Żywo',
          detail: 'Dwukierunkowy kanał zdarzeń przesyłający przesunięcia kart i komentarze poniżej 50 ms.',
        },
        {
          layer: 'Optymistyczny UI',
          detail: 'Natychmiastowa reakcja interfejsu z automatycznym wycofaniem zmiany w razie utraty połączenia.',
        },
        {
          layer: 'Warstwa Cache',
          detail: 'Buforowanie aktywnych tablic i sesji użytkowników dla minimalnego obciążenia bazy SQL.',
        },
      ],
      acceptanceCriteria: [
        'Przeciąganie zadań pomiędzy kolumnami To Do / In Progress / Done',
        'Współbieżna edycja tablicy przez kilku członków zespołu',
        'Pełna dostępność klawiaturowa (WCAG AA) i obsługa urządzeń mobilnych',
      ],
    },
    {
      id: 'devops',
      projectRef: 'proj-4',
      index: '04',
      title: 'Wdrożenie Produkcyjne z Docker, Nginx i CI/CD',
      category: 'DevOps & Cloud',
      difficulty: 'Poziom Produkcyjny',
      estimatedHours: 18,
      summary:
        'Zautomatyzowany potok wydawniczy budujący wielostopniowy obraz Docker, uruchamiający testy jednostkowe i E2E w GitHub Actions oraz wystawiający aplikację za Nginx z SSL.',
      stack: 'Docker · GitHub Actions · Linux VPS · Nginx · Playwright E2E',
      architectureLayers: [
        {
          layer: 'Konteneryzacja',
          detail: 'Wielostopniowy Dockerfile (Multi-stage build) redukujący rozmiar obrazu produkcyjnego o ponad 75%.',
        },
        {
          layer: 'Potok Quality Gate',
          detail: 'Automatyczna blokada wdrożenia w przypadku błędu kompilacji TypeScript lub nieudanego testu.',
        },
        {
          layer: 'Reverse Proxy & Bezpieczeństwo',
          detail: 'Konfiguracja Nginx z certyfikatem TLS Let’s Encrypt i nagłówkami bezpieczeństwa HSTS / CSP.',
        },
      ],
      acceptanceCriteria: [
        'Bezprzestojowe przebudowanie i uruchomienie kontenerów aplikacyjnych',
        'Automatyczne testy akceptacyjne Playwright przed publikacją',
        'Publiczny adres HTTPS gotowy do wpisania w CV i pokazania rekruterowi',
      ],
    },
  ];
}

export function getLandingFaqItems(language: AppLanguage, totalLessonsCount: number): LandingFaqItem[] {
  if (language === 'en') {
    return [
      {
        id: 'faq-1',
        question: 'I have never coded before. Can I succeed starting from Module 01?',
        answer:
          'Yes. Module 01 (HTML5 Foundations) is built specifically for complete beginners. Every concept starts with a clear everyday analogy and glossary before placing you inside an 80% pre-built scaffold where you fill in missing lines step by step.',
      },
      {
        id: 'faq-2',
        question: 'How does this platform differ from traditional video courses?',
        answer:
          'Video courses often leave you staring at a blank editor after hours of passive watching. Here you write real code in the browser from minute one, practice across 6 built-in simulators (Bash/Git Terminal, SQL Studio, REST API Client, JS Event Loop), and get instant rule feedback.',
      },
      {
        id: 'faq-3',
        question: 'Do I need to install heavy software on my computer to begin?',
        answer:
          'No. The code editor, live visual preview, SQL engine, and terminal simulator run directly inside your browser on desktop, tablet, and mobile. Later modules also walk you step-by-step through installing VS Code, Git, and Docker locally.',
      },
      {
        id: 'faq-4',
        question: 'Is the platform truly 100% free, and how is it funded?',
        answer: `Yes. All 15 modules, ${totalLessonsCount} lessons, 13 in-depth engineering guides, 6 simulators, 12 commercial projects with full starter code, GitHub sync, ATS CV Builder, and the completion certificate are available for 0 PLN. We maintain servers and curriculum updates via Google AdSense.`,
      },
      {
        id: 'faq-5',
        question: 'Does my study progress sync between desktop and mobile?',
        answer:
          'Yes. Once you sign in (e.g., one-click Google sign-in), your completed lessons, written code, daily learning streak, and SM-2 flashcard schedules sync to the cloud automatically across every device.',
      },
    ];
  }

  return [
    {
      id: 'faq-1',
      question: 'Nigdy wcześniej nie programowałem. Czy poradzę sobie od pierwszego modułu?',
      answer:
        'Tak. Moduł 01 (Podstawy HTML5) jest ułożony specjalnie dla osób startujących całkowicie od zera. Każde pojęcie wyjaśniamy najpierw prostą analogią z codziennego życia i krótkim słowniczkiem, a w edytorze otrzymujesz gotowy w 80% szkielet kodu, w którym dopisujesz brakujące linijki.',
    },
    {
      id: 'faq-2',
      question: 'Czym ta platforma różni się od zwykłych kursów wideo?',
      answer:
        'W kursach wideo spędzasz dziesiątki godzin na biernym oglądaniu, po czym zostajesz przed pustym edytorem. Tutaj od pierwszej minuty piszesz kod w przeglądarce, trenujesz w 6 symulatorach (Terminal Bash/Git, Studio SQL, Klient REST API, Event Loop) i widzisz natychmiastowe sprawdzenie kroków.',
    },
    {
      id: 'faq-3',
      question: 'Czy muszę instalować specjalne programy na komputerze?',
      answer:
        'Nie. Cały edytor kodu, podgląd strony na żywo, baza SQL oraz symulator terminala działają od razu w przeglądarce na komputerze, tablecie i telefonie. W dalszych modułach przeprowadzimy Cię też krok po kroku przez instalację VS Code, Gita i Dockera.',
    },
    {
      id: 'faq-4',
      question: 'Czy platforma jest naprawdę w 100% darmowa i jak jest utrzymywana?',
      answer: `Tak. Wszystkie 15 modułów, ${totalLessonsCount} lekcji, 13 rozbudowanych poradników eksperckich, 6 symulatorów, 12 projektów z pełnym kodem, synchronizacja GitHub, Kreator CV ATS oraz certyfikat ukończenia są dostępne za 0 zł. Utrzymanie serwerów i rozwój materiałów finansujemy poprzez Google AdSense.`,
    },
    {
      id: 'faq-5',
      question: 'Czy postępy z komputera synchronizują się z telefonem?',
      answer:
        'Tak. Po zalogowaniu (np. jednym kliknięciem przez Google) ukończone lekcje, napisany kod, seria dni nauki i powtórki fiszek SM-2 zapisują się w chmurze i są natychmiast dostępne na każdym urządzeniu.',
    },
  ];
}
