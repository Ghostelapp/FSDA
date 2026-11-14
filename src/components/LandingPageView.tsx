import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { MODULES_DATA } from '../data/modulesData';
import {
  CAREER_TRACKS,
  CareerTrackId,
  calculateStudyPlanEstimate,
} from '../utils/landingCalculator';
import {
  ArrowRight,
  Play,
  RotateCcw,
  Terminal,
  Database,
  Send,
  Cpu,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  HelpCircle,
  Code2,
  RefreshCw,
  Layers,
  ShieldCheck,
  ArrowUp,
} from 'lucide-react';
import heroDarkStudioImage from '../assets/images/dark_studio_coding_1794680584416.jpg';
import pairEngineeringImage from '../assets/images/dark_pair_engineering_1794680583212.jpg';
import portfolioDeskImage from '../assets/images/dark_portfolio_desk_1794680585081.jpg';

const HERO_DARK_STUDIO_IMAGE = heroDarkStudioImage;
const PAIR_ENGINEERING_IMAGE = pairEngineeringImage;
const PORTFOLIO_DESK_IMAGE = portfolioDeskImage;

const TECH_RIBBON_ITEMS = [
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

const ANALOGY_EXAMPLES = [
  {
    id: 'api',
    term: 'REST API & Endpointy',
    jargon: 'Bezstanowy interfejs komunikacji klient-serwer oparty o metody HTTP (GET, POST, PUT, DELETE) oraz wymianę JSON.',
    analogyTitle: 'Kelner w restauracji',
    analogyText: 'Ty (przeglądarka) nie wchodzisz sam do kuchni (bazy danych). Składasz zamówienie u kelnera (API), a on przynosi gotowe danie (dane JSON) na Twój stolik.',
  },
  {
    id: 'middleware',
    term: 'Middleware & Auth',
    jargon: 'Funkcja pośrednicząca w potoku żądań Express przechwytująca obiekt Request przed wykonaniem kontrolera docelowego.',
    analogyTitle: 'Bramkarz na koncercie',
    analogyText: 'Zanim wejdziesz na strefę VIP (panel kursanta), ochroniarz przy wejściu sprawdza Twój bilet (token JWT). Bez ważnego biletu grzecznie zawraca Cię na start.',
  },
  {
    id: 'sql',
    term: 'Relacje SQL (JOIN)',
    jargon: 'Łączenie znormalizowanych tabel za pomocą klucza obcego (Foreign Key) oraz operacji iloczynu relacyjnego.',
    analogyTitle: 'Księga zamówień i kartoteka klientów',
    analogyText: 'Zamiast przepisywać adres klienta przy każdym paragonie, zapisujesz tylko jego numer ID. Gdy potrzebujesz adresu do wysyłki, łączysz obie kartki po tym numerze.',
  },
  {
    id: 'docker',
    term: 'Konteneryzacja Docker',
    jargon: 'Izolacja procesu aplikacyjnego i wszystkich jego zależności systemowych w lekkim obrazie przestrzeni użytkownika.',
    analogyTitle: 'Kontener morski ze sprzętem',
    analogyText: 'Pakujesz swój projekt razem z odpowiednią wersją Node.js i ustawieniami do jednego szczelnego pudła. Działa dokładnie tak samo na Twoim laptopie i serwerze produkcyjnym.',
  },
];

const FLASHCARD_PREVIEW = [
  {
    category: 'JavaScript & React',
    question: 'Dlaczego w React używamy klucza key podczas renderowania listy elementów?',
    answer: 'Pozwala to silnikowi React dokładnie rozpoznać, który element został dodany, przesunięty lub usunięty — bez zbędnego przerysowywania całej listy w DOM.',
  },
  {
    category: 'Backend & Bezpieczeństwo',
    question: 'Po co zapisujemy token odświeżający w ciasteczku z flagą HttpOnly?',
    answer: 'Flaga HttpOnly blokuje dostęp skryptów JavaScript (document.cookie) do tokenu, co chroni sesję użytkownika nawet w przypadku ataku XSS.',
  },
  {
    category: 'Bazy Danych SQL',
    question: 'Czym różni się LEFT JOIN od INNER JOIN w zapytaniu SELECT?',
    answer: 'INNER JOIN zwraca wyłącznie pasujące rekordy z obu tabel, a LEFT JOIN zachowuje wszystkie wiersze z lewej tabeli, nawet jeśli nie mają jeszcze dopasowania po prawej.',
  },
];

interface EditorialImageProps {
  src: string;
  alt: string;
  aspectClass?: string;
  fallbackTitle: string;
  className?: string;
}

const EditorialImage: React.FC<EditorialImageProps> = ({
  src,
  alt,
  aspectClass = 'aspect-[16/9]',
  fallbackTitle,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`${aspectClass} w-full bg-gradient-to-br from-[#0B1120] via-[#131C31] to-[#06080E] flex flex-col items-center justify-center p-6 text-center ${className}`}
      >
        <Code2 className="h-8 w-8 text-indigo-400 mb-2" />
        <p className="text-sm font-semibold text-slate-200">{fallbackTitle}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`${aspectClass} w-full object-cover block ${className}`}
    />
  );
};

interface RevealBlockProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

const RevealBlock: React.FC<RevealBlockProps> = ({ children, className = '', delayMs = 0 }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setVisible(true);
      return;
    }

    const checkInView = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.98) {
        setVisible(true);
        return true;
      }
      return false;
    };

    if (checkInView() || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: '120px 0px 120px 0px' }
    );
    observer.observe(el);

    const onScrollCheck = () => {
      if (checkInView()) {
        observer.disconnect();
        window.removeEventListener('scroll', onScrollCheck);
      }
    };
    window.addEventListener('scroll', onScrollCheck, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScrollCheck);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`reveal-section ${visible ? 'reveal-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

interface PlaygroundSample {
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

const PLAYGROUND_SAMPLES: PlaygroundSample[] = [
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
    checkRule: (code: string) =>
      /return\s+aktualneXP\s*\+\s*bonusZaLekcje/i.test(code),
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

interface PortfolioShowcaseProject {
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

const PORTFOLIO_SHOWCASE_PROJECTS: PortfolioShowcaseProject[] = [
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

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
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
    question: 'Jak działa darmowy dostęp i kiedy warto wybrać Full Stack PRO?',
    answer:
      'Plan Darmowy (0 zł bezterminowo) daje dostęp do wszystkich 15 modułów i 91 lekcji z systemem 5 odnawiających się serc energii — pisanie kodu w ćwiczeniach nigdy ich nie odejmuje. Pakiet Full Stack PRO znosi limity w quizach, wyłącza reklamy oraz odblokowuje egzamin Live Coding, kreator CV ATS i certyfikat.',
  },
  {
    id: 'faq-5',
    question: 'Czy postępy z komputera synchronizują się z telefonem?',
    answer:
      'Tak. Po zalogowaniu (np. jednym kliknięciem przez Google) ukończone lekcje, napisany kod, seria dni nauki i powtórki fiszek SM-2 zapisują się w chmurze i są natychmiast dostępne na każdym urządzeniu.',
  },
];

interface LandingPageViewProps {
  onOpenAuthModal: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onOpenAuthModal }) => {
  const { isAuthenticated, currentUser, setActiveTab, setIsSubModalOpen, allLessons } = useApp();

  // Scroll progress bar (GPU scaleX transform) & Back-to-Top visibility
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      setShowScrollTop(scrollTop > 420);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min(1, Math.max(0, scrollTop / docHeight)));
      }
    };
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  const smoothScrollToTop = () => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    const startY = window.scrollY;
    if (startY <= 0) return;

    const duration = Math.min(820, Math.max(420, Math.round(startY * 0.22)));
    const startTime = performance.now();
    let cancelled = false;

    const cancelOnUserScroll = () => {
      cancelled = true;
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('wheel', cancelOnUserScroll);
      window.removeEventListener('touchstart', cancelOnUserScroll);
    };

    window.addEventListener('wheel', cancelOnUserScroll, { passive: true, once: true });
    window.addEventListener('touchstart', cancelOnUserScroll, { passive: true, once: true });

    const step = (now: number) => {
      if (cancelled) return;
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // easeOutCubic for silky, gentle deceleration into top edge
      const eased = 1 - Math.pow(1 - t, 3);
      window.scrollTo({ top: Math.round(startY * (1 - eased)), behavior: 'instant' as ScrollBehavior });
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        cleanupListeners();
      }
    };

    requestAnimationFrame(step);
  };

  // Interactive Hero Code Playground state
  const [selectedSampleId, setSelectedSampleId] = useState<'html' | 'css' | 'js' | 'sql'>('html');
  const [showBeginnerHint, setShowBeginnerHint] = useState<boolean>(false);
  const [scanTrigger, setScanTrigger] = useState<number>(0);

  const activeSample = useMemo(
    () => PLAYGROUND_SAMPLES.find((s) => s.id === selectedSampleId) || PLAYGROUND_SAMPLES[0],
    [selectedSampleId]
  );
  const [codeBySample, setCodeBySample] = useState<Record<string, string>>({
    html: PLAYGROUND_SAMPLES[0].solutionCode,
    css: PLAYGROUND_SAMPLES[1].solutionCode,
    js: PLAYGROUND_SAMPLES[2].solutionCode,
    sql: PLAYGROUND_SAMPLES[3].solutionCode,
  });

  const currentCode = codeBySample[selectedSampleId] ?? activeSample.starterCode;
  const codeLines = currentCode.split('\n');
  const isRulePassed = activeSample.checkRule(currentCode);

  // Interactive Bento Widgets state
  const [scaffoldStep, setScaffoldStep] = useState<'before' | 'after'>('after');
  const [activeAnalogyIndex, setActiveAnalogyIndex] = useState<number>(0);
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState<boolean>(false);

  // Pointer spotlight tracking for Simulator Matrix Bento tile
  const [spotlightPos, setSpotlightPos] = useState<{ x: number; y: number; active: boolean }>({
    x: 150,
    y: 120,
    active: false,
  });

  // Interactive Curriculum Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');
  const [expandedModuleId, setExpandedModuleId] = useState<number>(1);

  // Interactive Portfolio Showcase state
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    PORTFOLIO_SHOWCASE_PROJECTS[0].id
  );
  const activePortfolioProject = useMemo(
    () =>
      PORTFOLIO_SHOWCASE_PROJECTS.find((p) => p.id === selectedProjectId) ||
      PORTFOLIO_SHOWCASE_PROJECTS[0],
    [selectedProjectId]
  );

  // Pricing billing toggle
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Interactive Study Path Calculator & Lead Capture Form state
  const [selectedTrackId, setSelectedTrackId] = useState<CareerTrackId>('fullstack');
  const [weeklyHours, setWeeklyHours] = useState<number>(10);
  const [leadName, setLeadName] = useState<string>('');
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadGoal, setLeadGoal] = useState<'job' | 'projects' | 'upskill'>('job');
  const [formError, setFormError] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // Interactive FAQ Accordion state
  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');

  const categories = [
    'Wszystkie',
    'Podstawy',
    'Frontend',
    'Backend',
    'Bazy danych',
    'DevOps & Bezpieczeństwo',
    'Kariera',
  ];

  const filteredModules = useMemo(() => {
    if (selectedCategory === 'Wszystkie') return MODULES_DATA;
    return MODULES_DATA.filter((m) => m.category === selectedCategory);
  }, [selectedCategory]);

  const totalCurriculumHours = useMemo(
    () => MODULES_DATA.reduce((sum, m) => sum + m.durationHours, 0),
    []
  );

  const studyPlanEstimate = useMemo(
    () => calculateStudyPlanEstimate(totalCurriculumHours, weeklyHours, selectedTrackId),
    [totalCurriculumHours, weeklyHours, selectedTrackId]
  );

  const activeTrackSpec = CAREER_TRACKS[selectedTrackId];

  const activeModule = useMemo(
    () => MODULES_DATA.find((m) => m.id === expandedModuleId) || filteredModules[0] || MODULES_DATA[0],
    [expandedModuleId, filteredModules]
  );

  const handlePrimaryAction = () => {
    setActiveTab('dashboard');
    if (!isAuthenticated) {
      onOpenAuthModal();
    }
  };

  const handleOpenLesson = (lessonId: string) => {
    setActiveTab('lesson', lessonId);
    if (!isAuthenticated) {
      onOpenAuthModal();
    }
  };

  const handleOpenProject = (projectRef: string) => {
    setActiveTab('projects', undefined, projectRef);
    if (!isAuthenticated) {
      onOpenAuthModal();
    }
  };

  const handleOpenSimulator = (tab: 'terminal' | 'sql_studio' | 'api_studio' | 'event_loop') => {
    setActiveTab(tab);
    if (!isAuthenticated) {
      onOpenAuthModal();
    }
  };

  const handleStudyPlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedEmail = leadEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!leadName.trim() || leadName.trim().length < 2) {
      setFormError('Podaj swoje imię (minimum 2 znaki), aby wygenerować harmonogram.');
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setFormError('Podaj poprawny adres e-mail (np. jan.kowalski@domena.pl).');
      return;
    }

    setFormSubmitted(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Normalized salary visualization ratio (out of 24k PLN cap for visual proportional bars)
  const trackBarRatios = useMemo(() => {
    const scaleByTrack: Record<CareerTrackId, { junior: number; mid: number }> = {
      frontend: { junior: 0.44, mid: 0.72 },
      backend: { junior: 0.48, mid: 0.78 },
      fullstack: { junior: 0.52, mid: 0.88 },
    };
    return scaleByTrack[selectedTrackId];
  }, [selectedTrackId]);

  const activeAnalogy = ANALOGY_EXAMPLES[activeAnalogyIndex];
  const activeFlashcard = FLASHCARD_PREVIEW[flashcardIndex];

  return (
    <div className="min-h-screen bg-[#06080E] text-[#F8FAFC] selection:bg-indigo-600 selection:text-white">
      {/* =====================================================================
          TOP BAR CONTRACT (Strict 3-Zone Dark Obsidian Glass Header + Scroll Progress)
      ===================================================================== */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#06080E]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 sm:px-8 py-4">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollToTop();
            }}
            className="font-display text-lg font-extrabold tracking-tight text-[#F8FAFC] whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
          >
            Full Stack Academy
          </a>

          <nav
            aria-label="Nawigacja strony głównej"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#94A3B8]"
          >
            <button
              type="button"
              onClick={() => scrollToSection('metoda-nauki')}
              className="hover:text-[#F8FAFC] hover:underline underline-offset-8 decoration-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              Metoda nauki
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('program-kursu')}
              className="hover:text-[#F8FAFC] hover:underline underline-offset-8 decoration-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              Program
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('projekty-portfolio')}
              className="hover:text-[#F8FAFC] hover:underline underline-offset-8 decoration-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              Projekty
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('kalkulator-sciezki')}
              className="hover:text-[#F8FAFC] hover:underline underline-offset-8 decoration-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              Kalkulator
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('plany-dostepu')}
              className="hover:text-[#F8FAFC] hover:underline underline-offset-8 decoration-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              Cennik
            </button>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handlePrimaryAction}
              data-testid="landing-top-cta"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              {isAuthenticated ? 'Pulpit Kursanta →' : 'Rozpocznij za darmo →'}
            </button>
          </div>
        </div>

        {/* GPU-composited scroll progress track */}
        <div
          aria-hidden="true"
          className="h-[2px] w-full bg-indigo-500 origin-left transition-transform duration-75"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </header>

      {/* =====================================================================
          1. HERO SECTION — Dark Atmospheric Depth + Kinetic Live IDE + Stack Marquee
      ===================================================================== */}
      <section
        id="top"
        className="relative overflow-hidden border-b border-white/[0.08] bg-[#06080E] pt-12 pb-12 lg:pt-20 lg:pb-16"
      >
        {/* Subtle atmospheric grid fading organically into obsidian */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 72% 18%, rgba(79, 70, 229, 0.16), transparent 52%), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 48px 48px, 48px 48px',
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left Column: Staggered Editorial Pitch */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div
                  className="animate-fsda-fade-up flex flex-wrap items-center gap-2 text-xs font-medium text-[#94A3B8]"
                  style={{ animationDelay: '0ms' }}
                >
                  <span className="font-semibold text-indigo-400">Polska Akademia Kodowania</span>
                  <span aria-hidden="true">·</span>
                  <span>Start od zera za 0 zł</span>
                  <span aria-hidden="true">·</span>
                  <span>Bez instalacji</span>
                </div>

                <h1
                  style={{
                    textWrap: 'balance',
                    fontSize: 'clamp(2.35rem, 3.85vw, 3.6rem)',
                    animationDelay: '70ms',
                  }}
                  className="animate-fsda-fade-up font-display font-extrabold tracking-tight text-[#F8FAFC] leading-[1.06]"
                >
                  Zacznij pisać kod dziś. Zostań Full Stack Developerem.
                </h1>

                <p
                  className="animate-fsda-fade-up text-base text-[#CBD5E1] leading-relaxed tracking-[0.01em]"
                  style={{ animationDelay: '140ms' }}
                >
                  Praktyczny warsztat inżynierski zamiast wielogodzinnych wykładów wideo. Każdą
                  lekcję zaczynasz od analogii z życia i gotowego w 80% kodu, który uruchamiasz
                  od razu w przeglądarce.
                </p>

                <div
                  className="animate-fsda-fade-up pt-5 border-t border-white/[0.08] space-y-3 text-xs text-[#CBD5E1]"
                  style={{ animationDelay: '200ms' }}
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Łagodny próg wejścia — zero żargonu na starcie, słowniczek w każdej lekcji</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>6 symulatorów (Terminal Bash &amp; Git, SQL JOIN, REST API, Event Loop JS)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>12 aplikacji biznesowych z kryteriami akceptacyjnymi gotowych do GitHuba</span>
                  </div>
                </div>
              </div>

              <div
                className="animate-fsda-fade-up space-y-4 pt-2"
                style={{ animationDelay: '260ms' }}
              >
                <div className="flex flex-wrap items-center gap-3.5">
                  <button
                    type="button"
                    onClick={handlePrimaryAction}
                    data-testid="landing-hero-primary-cta"
                    className="group inline-flex items-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    <span>
                      {isAuthenticated
                        ? `Przejdź do nauki (${currentUser.name.split(' ')[0]})`
                        : 'Uruchom Aplikację do nauki'}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection('program-kursu')}
                    className="px-5 py-3.5 text-sm font-semibold text-[#CBD5E1] hover:text-[#F8FAFC] bg-[#0B101B] border border-white/15 hover:border-white/30 rounded-xl transition-all whitespace-nowrap shrink-0"
                  >
                    Zobacz 15 modułów
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#94A3B8]">
                  <span>Portal: fsda-phi.vercel.app</span>
                  <span aria-hidden="true">·</span>
                  <a
                    href="https://app.fsda-phi.vercel.app"
                    onClick={(e) => {
                      if (window.location.hostname !== 'app.fsda-phi.vercel.app') {
                        e.preventDefault();
                        handlePrimaryAction();
                      }
                    }}
                    className="font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                  >
                    Aplikacja: app.fsda-phi.vercel.app
                  </a>
                  <span aria-hidden="true">·</span>
                  <span>Bez karty płatniczej</span>
                </div>
              </div>
            </div>

            {/* Right Column: Kinetic Obsidian Live Interactive IDE */}
            <div
              className="animate-fsda-fade-up lg:col-span-7 flex flex-col"
              style={{ animationDelay: '150ms' }}
            >
              <div className="flex-1 flex flex-col rounded-2xl border border-white/10 bg-[#0B101B] text-[#E2E8F0] overflow-hidden shadow-2xl">
                {/* Single-Row Top IDE Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] bg-[#070A12] px-4 py-2.5">
                  <div className="flex items-center gap-1 p-1 bg-[#111827] rounded-lg border border-white/[0.06]">
                    {PLAYGROUND_SAMPLES.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => {
                          setSelectedSampleId(sample.id);
                          setShowBeginnerHint(false);
                          setScanTrigger((n) => n + 1);
                        }}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                          selectedSampleId === sample.id
                            ? 'bg-indigo-600 text-white'
                            : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowBeginnerHint((prev) => !prev)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                        showBeginnerHint
                          ? 'border-amber-500/50 bg-amber-950/50 text-amber-300'
                          : 'border-white/10 text-[#CBD5E1] hover:text-white'
                      }`}
                    >
                      <HelpCircle className="h-3 w-3 shrink-0" />
                      <span>Podpowiedź</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCodeBySample((prev) => ({
                          ...prev,
                          [selectedSampleId]: activeSample.starterCode,
                        }));
                        setScanTrigger((n) => n + 1);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#CBD5E1] hover:text-white border border-white/10 rounded-md transition-colors whitespace-nowrap shrink-0"
                      title="Przywróć szablon początkowy 80%"
                    >
                      <RotateCcw className="h-3 w-3 shrink-0" />
                      <span>Szablon 80%</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCodeBySample((prev) => ({
                          ...prev,
                          [selectedSampleId]: activeSample.solutionCode,
                        }));
                        setScanTrigger((n) => n + 1);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-950/60 border border-indigo-500/40 rounded-md transition-colors whitespace-nowrap shrink-0"
                    >
                      <Play className="h-3 w-3 shrink-0" />
                      <span>Wzorzec</span>
                    </button>
                  </div>
                </div>

                {/* Task & Analogy Header */}
                <div className="border-b border-white/[0.08] bg-[#0F1624] px-4 py-3 space-y-1">
                  <p className="text-xs font-semibold text-[#F8FAFC]">
                    Zadanie próbne: {activeSample.taskTitle}
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    Analogia: {activeSample.analogy}
                  </p>
                  {showBeginnerHint && (
                    <p className="animate-fsda-card-enter text-xs text-amber-300 pt-1.5 mt-1 border-t border-white/[0.08]">
                      Wskazówka: {activeSample.beginnerHint}
                    </p>
                  )}
                </div>

                {/* Editable Code + Live Visual Result Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] flex-1">
                  {/* Code Editor Pane with Line Numbers */}
                  <div className="flex flex-col p-4 bg-[#0B101B]">
                    <div className="flex items-center justify-between text-[11px] text-[#94A3B8] mb-2">
                      <span>Edytor kodu (możesz pisać)</span>
                      <span className="font-mono tabular-nums">{codeLines.length} linii</span>
                    </div>
                    <div className="flex flex-1 rounded-xl border border-white/[0.08] bg-[#060911] overflow-hidden">
                      <div
                        aria-hidden="true"
                        className="select-none py-3 px-2.5 text-right font-mono text-[11.5px] leading-relaxed text-[#475569] bg-[#090E1A] border-r border-white/[0.06] tabular-nums shrink-0"
                      >
                        {codeLines.map((_, i) => (
                          <div key={i}>{i + 1}</div>
                        ))}
                      </div>
                      <textarea
                        value={currentCode}
                        onChange={(e) =>
                          setCodeBySample((prev) => ({
                            ...prev,
                            [selectedSampleId]: e.target.value,
                          }))
                        }
                        aria-label="Interaktywny edytor kodu na stronie głównej"
                        spellCheck={false}
                        wrap="off"
                        rows={7}
                        className="w-full flex-1 font-mono text-[11.5px] leading-relaxed text-emerald-300 bg-transparent p-3 focus:outline-none resize-none whitespace-pre overflow-x-auto"
                      />
                    </div>
                  </div>

                  {/* Live Visual Preview Pane with Execution Sweep Animation */}
                  <div className="flex flex-col justify-between p-4 bg-[#0E1523]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 text-[11px] text-[#94A3B8]">
                        <span>Wynik na żywo</span>
                        <span
                          className={`font-mono tabular-nums font-semibold whitespace-nowrap shrink-0 transition-colors duration-200 ${
                            isRulePassed ? 'text-emerald-400' : 'text-[#CBD5E1]'
                          }`}
                        >
                          {isRulePassed ? 'Zaliczono (+150 XP)' : 'W trakcie edycji'}
                        </span>
                      </div>

                      <div
                        key={`${selectedSampleId}-${scanTrigger}`}
                        className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#060911] p-4 min-h-[164px] flex flex-col justify-center animate-fsda-card-enter"
                      >
                        {/* One-shot subtle scan sweep on sample switch/reset */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-indigo-500/15 to-transparent animate-fsda-scan"
                        />

                        {selectedSampleId === 'html' && (
                          <div className="relative space-y-2">
                            <p className="text-[11px] text-indigo-400 font-medium">Inżynier IT</p>
                            <p className="text-base font-bold text-[#F8FAFC]">
                              {(currentCode.match(/<h1>([\s\S]*?)<\/h1>/i)?.[1] || '').trim() ||
                                'Brak tekstu w <h1>...'}
                            </p>
                            <p className="text-xs text-[#94A3B8]">
                              React &amp; TypeScript
                            </p>
                            {/<button[^>]*>([\s\S]*?)<\/button>/i.test(currentCode) && (
                              <span className="inline-block mt-1 px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-md">
                                {(currentCode.match(/<button[^>]*>([\s\S]*?)<\/button>/i)?.[1] || 'Przycisk').trim()}
                              </span>
                            )}
                          </div>
                        )}

                        {selectedSampleId === 'css' && (
                          <div
                            className={`relative p-3 rounded-lg border transition-all duration-200 ${
                              isRulePassed
                                ? 'flex items-center justify-between gap-3 border-indigo-500/60 bg-[#0F172A]'
                                : 'block space-y-2 border-white/[0.08] bg-[#0B101B]'
                            }`}
                          >
                            <div>
                              <p className="text-xs font-bold text-[#F8FAFC]">Pakiet Full Stack</p>
                              <p className="text-[11px] text-[#94A3B8]">
                                {isRulePassed ? 'Układ Flexbox (Wiersz)' : 'Układ Block (Kolumna)'}
                              </p>
                            </div>
                            <span className="inline-block px-2.5 py-1 text-xs font-mono tabular-nums font-semibold bg-indigo-600 text-white rounded whitespace-nowrap shrink-0">
                              100% Gotowy
                            </span>
                          </div>
                        )}

                        {selectedSampleId === 'js' && (
                          <div className="relative space-y-2 font-mono text-xs">
                            <div className="text-[#94A3B8]">
                              Wejście: <span className="text-[#CBD5E1] tabular-nums">1250 XP + 150 XP</span>
                            </div>
                            <div className="text-sm font-bold text-[#F8FAFC] tabular-nums">
                              Wynik:{' '}
                              <span className={isRulePassed ? 'text-emerald-400' : 'text-amber-400'}>
                                {isRulePassed ? '1400 XP (Poprawnie)' : '0 XP (Uzupełnij return)'}
                              </span>
                            </div>
                          </div>
                        )}

                        {selectedSampleId === 'sql' && (
                          <div className="relative space-y-1.5 font-mono text-[11px]">
                            <div className="grid grid-cols-3 text-[#94A3B8] border-b border-white/[0.08] pb-1">
                              <span>imie</span>
                              <span>rola</span>
                              <span className="text-right">xp (level)</span>
                            </div>
                            {isRulePassed ? (
                              <>
                                <div className="grid grid-cols-3 text-emerald-300 tabular-nums">
                                  <span>Maja K.</span>
                                  <span>Full Stack</span>
                                  <span className="text-right">8450 (Lv.9)</span>
                                </div>
                                <div className="grid grid-cols-3 text-[#CBD5E1] tabular-nums">
                                  <span>Piotr W.</span>
                                  <span>Backend</span>
                                  <span className="text-right">6200 (Lv.7)</span>
                                </div>
                              </>
                            ) : (
                              <div className="text-amber-400 py-2">
                                Dodaj WHERE level &gt; 5 oraz ORDER BY xp DESC.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs min-w-0">
                        <CheckCircle2
                          className={`h-4 w-4 shrink-0 transition-colors ${
                            isRulePassed ? 'text-emerald-400' : 'text-[#64748B]'
                          }`}
                        />
                        <span className={`truncate ${isRulePassed ? 'text-[#CBD5E1]' : 'text-[#94A3B8]'}`}>
                          {activeSample.ruleLabel}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenLesson(activeSample.lessonRef)}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 whitespace-nowrap shrink-0 transition-colors"
                      >
                        Otwórz lekcję →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width 4-Column Telemetry Bar */}
          <div className="mt-14 pt-10 border-t border-white/[0.08] grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/[0.08]">
            <div className="lg:pr-8">
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tabular-nums">
                {MODULES_DATA.length} modułów
              </p>
              <p className="mt-1.5 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Kompletna ścieżka od podstaw HTML5 i CSS przez React 19, Node.js i SQL aż po Docker.
              </p>
            </div>
            <div className="lg:px-8">
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tabular-nums">
                {allLessons.length} lekcji
              </p>
              <p className="mt-1.5 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Prosta analogia, słowniczek bez żargonu, gotowy szablon 80% oraz quiz sprawdzający.
              </p>
            </div>
            <div className="lg:px-8">
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tabular-nums">
                12 projektów
              </p>
              <p className="mt-1.5 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Realne aplikacje biznesowe z kryteriami akceptacyjnymi gotowe do pokazania rekruterowi.
              </p>
            </div>
            <div className="lg:pl-8">
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tabular-nums">
                6 symulatorów
              </p>
              <p className="mt-1.5 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Terminal Bash/Git, Studio SQL, Klient REST API, Event Loop JS i egzamin Live Coding.
              </p>
            </div>
          </div>
        </div>

        {/* Continuous Kinetic Technology Ribbon */}
        <div
          aria-label="Technologie w programie akademii"
          className="mt-12 border-t border-white/[0.06] bg-[#04060B] py-4 overflow-hidden select-none"
        >
          <div className="animate-fsda-marquee flex items-center gap-10 text-xs font-mono text-[#64748B] whitespace-nowrap">
            {[...TECH_RIBBON_ITEMS, ...TECH_RIBBON_ITEMS].map((tech, idx) => (
              <span key={`${tech}-${idx}`} className="inline-flex items-center gap-10 shrink-0">
                <span className="hover:text-[#CBD5E1] transition-colors">{tech}</span>
                <span aria-hidden="true" className="text-indigo-500/40">/</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. ASYMMETRIC INTERACTIVE BENTO STUDIO ("Metoda i Narzędzia")
             Breaks monotonous equal columns with dynamic col-spans & micro-interactions
      ===================================================================== */}
      <section id="metoda-nauki" className="bg-[#090D16] py-20 lg:py-24 border-b border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-12">
          <RevealBlock className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-[#94A3B8]">
                <span className="font-semibold text-indigo-400">Metoda Rusztowania i Symulatory</span>
                <span aria-hidden="true">·</span>
                <span>Zaprojektowane dla startujących od zera</span>
              </div>
              <h2
                style={{ textWrap: 'balance' }}
                className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]"
              >
                Nauka, w której nie patrzysz na pusty ekran.
              </h2>
            </div>
            <p className="text-sm text-[#94A3B8] max-w-md leading-relaxed">
              Każda z 91 lekcji łączy trzy elementy: analogię z życia, gotowy w 80% szkielet
              kodu oraz wbudowany symulator do natychmiastowego uruchomienia.
            </p>
          </RevealBlock>

          {/* Row 1 of Asymmetric Bento: 7 cols Dark Studio Photo + Interactive Diff / 5 cols Pointer-Spotlight Simulators */}
          <RevealBlock delayMs={80} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Tile 1 (col-span-7): Moody Architectural Studio + Interactive 80% Scaffold Toggle */}
            <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0B101B] overflow-hidden flex flex-col justify-between">
              <div className="relative">
                <EditorialImage
                  src={HERO_DARK_STUDIO_IMAGE}
                  alt="Wieczorne biurko programisty w minimalistycznym studiu z laptopem prezentującym kod TypeScript i React"
                  aspectClass="aspect-[16/9]"
                  fallbackTitle="Środowisko Full Stack Academy"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0B101B] via-[#0B101B]/45 to-transparent"
                />
                <div className="absolute bottom-4 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-indigo-300">01. Metodyka Rusztowania 80%</p>
                    <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#F8FAFC] mt-0.5">
                      Zawsze zaczynasz od działającej bazy
                    </h3>
                  </div>

                  {/* Interactive Before/After Code Scaffold Segmented Switch */}
                  <div className="flex items-center gap-1 p-1 rounded-lg border border-white/15 bg-[#06080E]/90 backdrop-blur-md shrink-0 self-start">
                    <button
                      type="button"
                      onClick={() => setScaffoldStep('before')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                        scaffoldStep === 'before'
                          ? 'bg-indigo-600 text-white'
                          : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      Szablon 80%
                    </button>
                    <button
                      type="button"
                      onClick={() => setScaffoldStep('after')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                        scaffoldStep === 'after'
                          ? 'bg-emerald-600 text-white'
                          : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      Po dopisaniu 2 linii
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Animated Scaffold Diff Strip */}
              <div
                key={scaffoldStep}
                className="animate-fsda-card-enter p-5 border-t border-white/[0.08] bg-[#080C15] font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {scaffoldStep === 'before' ? (
                  <>
                    <div className="space-y-1 text-[#94A3B8]">
                      <div className="text-[#CBD5E1]">const kursant = await db.users.findFirst();</div>
                      <div className="text-amber-300">// TODO: Zwróć dane JSON ze statusem 200</div>
                    </div>
                    <span className="text-[11px] font-sans font-semibold text-amber-300 whitespace-nowrap shrink-0">
                      Szkielet gotowy — wpisujesz tylko 1 linię
                    </span>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="text-[#94A3B8]">const kursant = await db.users.findFirst();</div>
                      <div className="text-emerald-300">+ return res.status(200).json(kursant);</div>
                    </div>
                    <span className="text-[11px] font-sans font-semibold text-emerald-400 whitespace-nowrap shrink-0">
                      Test zaliczony — przechodzisz dalej
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Tile 2 (col-span-5): Pointer-Spotlight Engineering Simulator Matrix */}
            <div
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setSpotlightPos({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                  active: true,
                });
              }}
              onMouseLeave={() => setSpotlightPos((prev) => ({ ...prev, active: false }))}
              className="relative lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0B101B] p-6 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle radial pointer spotlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-px transition-opacity duration-300"
                style={{
                  opacity: spotlightPos.active ? 1 : 0,
                  background: `radial-gradient(360px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(99, 102, 241, 0.14), transparent 65%)`,
                }}
              />

              <div className="relative space-y-2">
                <p className="text-xs font-semibold text-indigo-400">02. Środowiska Praktyczne</p>
                <h3 className="font-display text-xl font-extrabold text-[#F8FAFC]">
                  4 symulatory bez żadnej instalacji
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  Ćwiczysz prawdziwe zapytania bazodanowe, komendy Git, żądania HTTP oraz asynchroniczność JS bezpośrednio w karcie przeglądarki.
                </p>
              </div>

              <div className="relative space-y-2.5 my-5">
                {[
                  {
                    tab: 'sql_studio' as const,
                    icon: Database,
                    title: 'Studio Bazy SQL (JOIN)',
                    sub: 'Wizualne tabele relacyjne i live SELECT',
                  },
                  {
                    tab: 'terminal' as const,
                    icon: Terminal,
                    title: 'Terminal Bash & Git',
                    sub: 'Bezpieczne ćwiczenia commit, branch i merge',
                  },
                  {
                    tab: 'api_studio' as const,
                    icon: Send,
                    title: 'Studio REST API & JSON',
                    sub: 'Testowanie GET / POST z nagłówkami Auth',
                  },
                  {
                    tab: 'event_loop' as const,
                    icon: Cpu,
                    title: 'Wizualizator Event Loop',
                    sub: 'Animacja Call Stack, Microtasks i Callback Queue',
                  },
                ].map((sim) => {
                  const Icon = sim.icon;
                  return (
                    <button
                      key={sim.tab}
                      type="button"
                      onClick={() => handleOpenSimulator(sim.tab)}
                      className="w-full group flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#101726]/80 hover:border-indigo-500/60 hover:-translate-y-0.5 px-4 py-3 text-left transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className="h-4 w-4 text-indigo-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#F8FAFC] truncate">{sim.title}</p>
                          <p className="text-[11px] text-[#94A3B8] truncate">{sim.sub}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#64748B] group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </RevealBlock>

          {/* Row 2 of Asymmetric Bento: 5 cols Analogy Translator · 4 cols Interactive Flashcard Flip · 3 cols Energy Guarantee */}
          <RevealBlock delayMs={160} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Tile 3 (col-span-5): Interactive Jargon -> Life Analogy Switcher */}
            <div className="md:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0B101B] p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-indigo-400">03. Słownik Ludzkim Językiem</p>
                  <div className="flex items-center gap-1">
                    {ANALOGY_EXAMPLES.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveAnalogyIndex(idx)}
                        className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
                          activeAnalogyIndex === idx
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'text-[#94A3B8] hover:text-[#F8FAFC] bg-white/[0.04]'
                        }`}
                      >
                        0{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold text-[#F8FAFC]">
                  {activeAnalogy.term}
                </h3>
              </div>

              <div key={activeAnalogy.id} className="animate-fsda-card-enter space-y-3">
                <div className="text-xs text-[#94A3B8] leading-relaxed">
                  <span className="font-semibold text-[#64748B]">Surowa definicja: </span>
                  {activeAnalogy.jargon}
                </div>
                <div className="pt-3 border-t border-white/[0.08]">
                  <p className="text-xs font-semibold text-emerald-400 mb-1">
                    Nasza analogia: {activeAnalogy.analogyTitle}
                  </p>
                  <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                    {activeAnalogy.analogyText}
                  </p>
                </div>
              </div>
            </div>

            {/* Tile 4 (col-span-4): Interactive Click-to-Flip SM-2 Flashcard */}
            <div className="md:col-span-4 rounded-2xl border border-white/[0.08] bg-[#0B101B] p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-indigo-400">04. Fiszki SM-2 w drodze</p>
                <button
                  type="button"
                  onClick={() => {
                    setFlashcardFlipped(false);
                    setFlashcardIndex((prev) => (prev + 1) % FLASHCARD_PREVIEW.length);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Następna</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setFlashcardFlipped((prev) => !prev)}
                className="flex-1 text-left rounded-xl border border-white/10 bg-[#101726] hover:border-indigo-500/60 p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                  <span>{activeFlashcard.category}</span>
                  <span className="font-mono text-indigo-400">
                    {flashcardFlipped ? 'Odpowiedź' : 'Pytanie · kliknij'}
                  </span>
                </div>
                <p
                  key={`${flashcardIndex}-${flashcardFlipped ? 'ans' : 'q'}`}
                  className="animate-fsda-card-enter text-xs sm:text-sm font-medium text-[#F8FAFC] leading-relaxed my-3"
                >
                  {flashcardFlipped ? activeFlashcard.answer : activeFlashcard.question}
                </p>
                <span className="text-[11px] font-semibold text-indigo-300">
                  {flashcardFlipped ? '← Kliknij, aby wrócić do pytania' : 'Kliknij, aby obrócić kartę →'}
                </span>
              </button>
            </div>

            {/* Tile 5 (col-span-3): Stress-Free Practice Metric Ring */}
            <div className="md:col-span-3 rounded-2xl border border-white/[0.08] bg-[#0B101B] p-6 flex flex-col justify-between space-y-4">
              <p className="text-xs font-semibold text-indigo-400">05. Bez stresu o błędy</p>

              <div className="flex items-center gap-4">
                <svg className="h-16 w-16 shrink-0 -rotate-90" viewBox="0 0 64 64" aria-hidden="true">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="163"
                    strokeDashoffset="18"
                  />
                </svg>
                <div>
                  <p className="font-display text-2xl font-extrabold text-[#F8FAFC] tabular-nums">
                    0 kar
                  </p>
                  <p className="text-xs text-emerald-400 font-semibold">w edytorze lekcji</p>
                </div>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Możesz testować, psuć i poprawiać swój kod dowolną liczbę razy. 5 serc energii
                dotyczy wyłącznie quizów sprawdzających.
              </p>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* =====================================================================
          3. VERTICAL MILESTONE TIMELINE & STICKY DARK INSPECTOR ("Program")
             Breaks the boxed-list look with an architectural spine + live inspector
      ===================================================================== */}
      <section id="program-kursu" className="bg-[#06080E] py-20 lg:py-24 border-b border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-10">
          <RevealBlock className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-[#94A3B8]">
                <span className="font-semibold text-indigo-400">Kompletny Sylabus</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">15 modułów · 91 lekcji · {totalCurriculumHours}h materiału</span>
              </div>
              <h2
                style={{ textWrap: 'balance' }}
                className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]"
              >
                Przejrzysta ścieżka od pierwszego znacznika do chmury.
              </h2>
            </div>

            {/* Interactive Category Filter Bar */}
            <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-xl border border-white/[0.08] bg-[#0B101B]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    const firstInCat =
                      cat === 'Wszystkie'
                        ? MODULES_DATA[0]
                        : MODULES_DATA.find((m) => m.category === cat);
                    if (firstInCat) setExpandedModuleId(firstInCat.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.04]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </RevealBlock>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Vertical Milestone Timeline Spine */}
            <div className="lg:col-span-7 relative pl-6 border-l border-white/10 space-y-2">
              {filteredModules.map((mod) => {
                const isSelected = activeModule.id === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setExpandedModuleId(mod.id)}
                    className={`relative w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 flex items-start justify-between gap-4 ${
                      isSelected
                        ? 'border-indigo-500/60 bg-[#10172A] translate-x-1'
                        : 'border-transparent hover:border-white/[0.08] hover:bg-[#0B101B]'
                    }`}
                  >
                    {/* Timeline Node Dot directly aligned on the spine */}
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[29px] top-6 h-2.5 w-2.5 rounded-full border transition-all ${
                        isSelected
                          ? 'bg-indigo-500 border-indigo-300 scale-125'
                          : 'bg-[#06080E] border-white/25'
                      }`}
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8]">
                        <span className="font-mono tabular-nums font-bold text-indigo-400">
                          Moduł {String(mod.id).padStart(2, '0')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{mod.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{mod.lessons.length} lekcji</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{mod.durationHours}h</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC] leading-snug">
                        {mod.title}
                      </h3>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 shrink-0 mt-1 transition-all ${
                        isSelected ? 'text-indigo-400 translate-x-0.5' : 'text-[#64748B]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right 5 cols: Sticky Dark Module Inspector */}
            <div
              key={activeModule.id}
              className="animate-fsda-card-enter lg:col-span-5 lg:sticky lg:top-24 rounded-2xl border border-white/10 bg-[#0B101B] p-6 sm:p-7 space-y-5"
            >
              <div className="space-y-2 border-b border-white/[0.08] pb-4">
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span className="font-semibold text-indigo-400">
                    Moduł {String(activeModule.id).padStart(2, '0')} · {activeModule.category}
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-emerald-400">
                    +{activeModule.lessons.reduce((sum, l) => sum + l.xpReward, 0)} XP
                  </span>
                </div>
                <h3 className="font-display text-xl font-extrabold text-[#F8FAFC] leading-snug">
                  {activeModule.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  {activeModule.description}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#F8FAFC]">
                  Lekcje w tym module ({activeModule.lessons.length}):
                </p>
                <div className="divide-y divide-white/[0.06] max-h-72 overflow-y-auto pr-1">
                  {activeModule.lessons.map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      className="flex items-start justify-between gap-3 py-2 text-xs"
                    >
                      <span className="text-[#CBD5E1] leading-snug">
                        <span className="font-mono tabular-nums text-[#64748B] mr-2">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        {lesson.title}
                      </span>
                      <span className="font-mono tabular-nums text-[#94A3B8] shrink-0">
                        {lesson.durationMinutes} min
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                <div className="text-xs text-[#94A3B8]">
                  Odznaka:{' '}
                  <strong className="text-[#F8FAFC] font-semibold">{activeModule.badgeName}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenLesson(activeModule.lessons[0]?.id || 'html-1')}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors whitespace-nowrap shrink-0"
                >
                  Rozpocznij moduł →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. ARCHITECTURE BLUEPRINT STAGE & ASYMMETRIC GRADUATE SPOTLIGHT
      ===================================================================== */}
      <section id="projekty-portfolio" className="bg-[#090D16] py-20 lg:py-24 border-b border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-20">
          {/* Interactive Architecture Stage */}
          <RevealBlock className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-[#94A3B8]">
                  <span className="font-semibold text-indigo-400">Portfolio Inżynierskie GitHub</span>
                  <span aria-hidden="true">·</span>
                  <span>12 aplikacji z kryteriami biznesowymi</span>
                </div>
                <h2
                  style={{ textWrap: 'balance' }}
                  className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]"
                >
                  Projekty, które realnie przekonują rekruterów.
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-xl border border-white/[0.08] bg-[#0B101B]">
                {PORTFOLIO_SHOWCASE_PROJECTS.map((proj) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                      selectedProjectId === proj.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {proj.index}. {proj.category}
                  </button>
                ))}
              </div>
            </div>

            <div
              key={activePortfolioProject.id}
              className="animate-fsda-card-enter rounded-2xl border border-white/10 bg-[#0B101B] p-6 sm:p-8 space-y-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8]">
                    <span className="font-semibold text-indigo-400">
                      Projekt {activePortfolioProject.index} z 12
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{activePortfolioProject.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      ~{activePortfolioProject.estimatedHours}h praktyki
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-extrabold text-[#F8FAFC]">
                    {activePortfolioProject.title}
                  </h3>
                  <p className="text-sm text-[#CBD5E1] leading-relaxed">
                    {activePortfolioProject.summary}
                  </p>
                  <p className="text-xs font-mono text-indigo-300 pt-1">
                    {activePortfolioProject.stack}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenProject(activePortfolioProject.projectRef)}
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors whitespace-nowrap shrink-0 self-start lg:self-center"
                >
                  <span>Otwórz w Studio Projektów</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
              </div>

              {/* Horizontal 3-Layer Stack Diagram + Acceptance Specs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {activePortfolioProject.architectureLayers.map((layer, idx) => (
                    <div
                      key={layer.layer}
                      className="rounded-xl border border-white/[0.08] bg-[#101726] p-4 space-y-2 hover:-translate-y-0.5 transition-transform duration-200"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-indigo-400">
                        <span>Warstwa 0{idx + 1}</span>
                        <Layers className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-xs font-bold text-[#F8FAFC]">{layer.layer}</p>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">{layer.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-5 space-y-3">
                  <p className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Kryteria zaliczenia w Studio Projektów:</span>
                  </p>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-[#CBD5E1]">
                    {activePortfolioProject.acceptanceCriteria.map((criterion, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </RevealBlock>

          {/* Asymmetric Graduate Outcomes: 7-col Cinematic Feature + 5-col Editorial Column */}
          <RevealBlock delayMs={100} className="space-y-8 pt-6 border-t border-white/[0.08]">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-[#94A3B8]">
                <span className="font-semibold text-indigo-400">Historie Kursantów</span>
                <span aria-hidden="true">·</span>
                <span>Od zera do pierwszej pracy i awansu w IT</span>
              </div>
              <h2
                style={{ textWrap: 'balance' }}
                className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F8FAFC]"
              >
                Efekty osób, które wybrały naukę przez praktykę.
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Featured 7-col Documentary Pair Programming Card */}
              <div className="lg:col-span-7 relative rounded-2xl border border-white/10 bg-[#0B101B] overflow-hidden flex flex-col justify-between">
                <div className="relative">
                  <EditorialImage
                    src={PAIR_ENGINEERING_IMAGE}
                    alt="Dwójka programistów analizujących wspólnie architekturę kodu w wieczornym studiu"
                    aspectClass="aspect-[16/10]"
                    fallbackTitle="Praca projektowa w zespole IT"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#0B101B] via-[#0B101B]/45 to-transparent"
                  />
                </div>

                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums text-[#94A3B8]">
                    <span className="font-semibold text-emerald-400 whitespace-nowrap">Wynik egzaminu: 94/100</span>
                    <span aria-hidden="true">·</span>
                    <span className="whitespace-nowrap">Seria 68 dni</span>
                    <span aria-hidden="true">·</span>
                    <span className="whitespace-nowrap">Warszawa</span>
                  </div>
                  <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
                    „Wbudowany symulator terminala Git oraz Studio REST API oszczędziły mi godzin
                    walki z konfiguracją środowiska. Codzienne fiszki SM-2 na telefonie sprawiły, że
                    pytania rekrutacyjne na rozmowie technicznej zdałam bez żadnego stresu.”
                  </p>
                  <div className="pt-3 border-t border-white/[0.08]">
                    <p className="text-sm font-bold text-[#F8FAFC]">Karolina Wiśniewska</p>
                    <p className="text-xs text-[#94A3B8]">
                      Przed: QA Manual Tester · Obecnie: Associate Full Stack Engineer
                    </p>
                  </div>
                </div>
              </div>

              {/* Stacked 5-col Editorial Stories (Clean Hairline Divided Column) */}
              <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0B101B] p-6 sm:p-7 flex flex-col justify-between divide-y divide-white/[0.08]">
                <article className="pb-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums text-[#94A3B8]">
                    <span className="font-semibold text-emerald-400 whitespace-nowrap">Awans: +65%</span>
                    <span aria-hidden="true">·</span>
                    <span className="whitespace-nowrap">Certyfikat FSDA-2026</span>
                  </div>
                  <p className="text-sm text-[#CBD5E1] leading-relaxed">
                    „Znałem podstawy CSS, ale brakowało mi backendu: Node.js, autoryzacji JWT
                    i baz SQL. Moduły serwerowe oraz symulator Event Loopa uporządkowały moją wiedzę
                    tak dobrze, że przejąłem pełne projekty TypeScript w zespole.”
                  </p>
                  <div>
                    <p className="text-sm font-bold text-[#F8FAFC]">Tomasz Zieliński</p>
                    <p className="text-xs text-[#94A3B8]">
                      Przed: Freelance Webmaster · Obecnie: Regular Full Stack Developer (Kraków)
                    </p>
                  </div>
                </article>

                <article className="pt-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums text-[#94A3B8]">
                    <span className="font-semibold text-emerald-400 whitespace-nowrap">Czas nauki: 5.5 mies.</span>
                    <span aria-hidden="true">·</span>
                    <span className="whitespace-nowrap">12 ukończonych projektów</span>
                  </div>
                  <p className="text-sm text-[#CBD5E1] leading-relaxed">
                    „Wcześniej porzuciłem dwa kursy wideo, bo gubiłem się przed pustym edytorem. Tutaj
                    szablony 80% pozwoliły mi od pierwszego dnia widzieć działające efekty. Na rozmowie
                    pokazałem własną aplikację SQL i dostałem pierwszą ofertę.”
                  </p>
                  <div>
                    <p className="text-sm font-bold text-[#F8FAFC]">Michał Krawczyk</p>
                    <p className="text-xs text-[#94A3B8]">
                      Przed: Specjalista ds. Logistyki · Obecnie: Junior Frontend Developer (Wrocław)
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* =====================================================================
          5. INTERACTIVE CAREER CALCULATOR & SALARY BENCHMARK METER
      ===================================================================== */}
      <section id="kalkulator-sciezki" className="bg-[#06080E] py-20 lg:py-24 border-b border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <RevealBlock className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Interactive Track & Pace Calculator */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-medium text-[#94A3B8]">
                  <span className="font-semibold text-indigo-400">Kalkulator Ścieżki Nauki</span>
                  <span aria-hidden="true">·</span>
                  <span>Dane rynkowe Polska 2026</span>
                </div>
                <h2
                  style={{ textWrap: 'balance' }}
                  className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]"
                >
                  Policz, kiedy skończysz program w swoim tempie.
                </h2>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Wybierz specjalizację oraz liczbę godzin w tygodniu, aby zobaczyć dokładne
                  kamienie milowe i porównanie rynkowych widełek wynagrodzeń.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(Object.keys(CAREER_TRACKS) as CareerTrackId[]).map((trackKey) => {
                  const spec = CAREER_TRACKS[trackKey];
                  const isSelected = selectedTrackId === trackKey;
                  return (
                    <button
                      key={trackKey}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedTrackId(trackKey)}
                      className={`text-left rounded-xl border p-3.5 transition-all duration-200 ${
                        isSelected
                          ? 'border-indigo-500 bg-[#11192E] text-[#F8FAFC]'
                          : 'border-white/[0.08] bg-[#0B101B] text-[#94A3B8] hover:border-white/20'
                      }`}
                    >
                      <span className="block text-xs font-bold text-[#F8FAFC] truncate">
                        {spec.roleLabel}
                      </span>
                      <span className="block mt-1 text-[11px] font-mono tabular-nums text-emerald-400 font-semibold">
                        Junior: {spec.juniorSalaryRangePln}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-5 rounded-2xl border border-white/10 bg-[#0B101B] p-6">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="weekly-hours-range" className="font-semibold text-[#CBD5E1]">
                    Twój czas na naukę w tygodniu:
                  </label>
                  <span className="font-mono tabular-nums text-base font-extrabold text-indigo-400">
                    {weeklyHours} godz. / tydzień
                  </span>
                </div>
                <input
                  id="weekly-hours-range"
                  type="range"
                  min={3}
                  max={25}
                  step={1}
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono tabular-nums text-[#64748B]">
                  <span>3h (Spokojnie)</span>
                  <span>10h (Optymalnie)</span>
                  <span>25h (Intensywnie)</span>
                </div>

                <div className="pt-4 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-[11px] text-[#94A3B8]">Czas do certyfikatu</p>
                    <p className="text-base sm:text-lg font-extrabold text-[#F8FAFC] font-mono tabular-nums">
                      ~{studyPlanEstimate.estimatedWeeks} tyg. ({studyPlanEstimate.estimatedMonths} mies.)
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#94A3B8]">Dzienna dawka nauki</p>
                    <p className="text-base sm:text-lg font-extrabold text-emerald-400 font-mono tabular-nums">
                      ~{studyPlanEstimate.dailyMinutes} min / dzień
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-[11px] text-[#94A3B8]">Widełki Mid / Regular</p>
                    <p className="text-base sm:text-lg font-extrabold text-indigo-400 font-mono tabular-nums">
                      {activeTrackSpec.midSalaryRangePln}
                    </p>
                  </div>
                </div>

                {/* Animated GPU-composited Market Benchmark Bars */}
                <div className="pt-4 border-t border-white/[0.08] space-y-2.5 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono tabular-nums text-[11px] text-[#94A3B8]">
                      <span>Poziom Junior</span>
                      <span className="text-emerald-400">{activeTrackSpec.juniorSalaryRangePln}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 origin-left transition-transform duration-300"
                        style={{ transform: `scaleX(${trackBarRatios.junior})` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono tabular-nums text-[11px] text-[#94A3B8]">
                      <span>Poziom Mid / Regular</span>
                      <span className="text-indigo-400">{activeTrackSpec.midSalaryRangePln}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500 origin-left transition-transform duration-300"
                        style={{ transform: `scaleX(${trackBarRatios.mid})` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.08] space-y-3">
                  <p className="text-xs font-semibold text-[#F8FAFC]">
                    Kamienie milowe ({activeTrackSpec.title}):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {studyPlanEstimate.milestones.map((ms) => (
                      <div
                        key={ms.phase}
                        className="rounded-xl border border-white/[0.08] bg-[#101726] p-3.5 space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                          <span className="text-indigo-400 font-semibold">{ms.phase}</span>
                          <span className="text-[#94A3B8]">Tydzień {ms.weekTarget}</span>
                        </div>
                        <p className="text-xs font-bold text-[#F8FAFC]">{ms.title}</p>
                        <p className="text-[11px] text-[#94A3B8] leading-snug">{ms.deliverable}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Validated Lead / Onboarding Form */}
            <div className="lg:col-span-5 lg:pt-12">
              {formSubmitted ? (
                <div
                  data-testid="study-plan-success"
                  className="animate-fsda-card-enter rounded-2xl border border-emerald-500/40 bg-[#0B101B] p-6 sm:p-8 space-y-5"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-7 w-7 text-emerald-400 shrink-0" />
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#F8FAFC]">
                        Plan nauki dla {leadName} został przygotowany
                      </h3>
                      <p className="text-xs text-[#94A3B8]">
                        {leadEmail} · {activeTrackSpec.roleLabel} ({weeklyHours}h / tydz.)
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-[#CBD5E1] leading-relaxed">
                    Rekomendowany start to <strong>Moduł 01: Podstawy HTML5</strong> (Lekcja 1:
                    Pierwsze znaczniki HTML). Możesz od razu uruchomić interaktywną aplikację.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handlePrimaryAction}
                      className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors whitespace-nowrap"
                    >
                      {isAuthenticated ? 'Otwórz Pulpit Kursanta' : 'Utwórz darmowe konto i zacznij'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormSubmitted(false)}
                      className="px-4 py-3 text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                    >
                      Zmień parametry
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleStudyPlanSubmit}
                  noValidate
                  className="rounded-2xl border border-white/10 bg-[#0B101B] p-6 sm:p-8 space-y-4"
                >
                  <div className="space-y-1">
                    <h3 className="font-display text-xl font-bold text-[#F8FAFC]">
                      Odbierz indywidualny plan nauki
                    </h3>
                    <p className="text-xs text-[#94A3B8]">
                      Dopasujemy harmonogram pod ścieżkę: {activeTrackSpec.roleLabel}.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="lead-name" className="block text-xs font-semibold text-[#CBD5E1]">
                      Twoje imię
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="np. Aleksander"
                      className="w-full rounded-xl border border-white/15 bg-[#060911] px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#475569] focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="lead-email" className="block text-xs font-semibold text-[#CBD5E1]">
                      Adres e-mail
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="np. aleksander@domena.pl"
                      className="w-full rounded-xl border border-white/15 bg-[#060911] px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#475569] focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="block text-xs font-semibold text-[#CBD5E1]">
                      Główny cel nauki
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'job', label: 'Praca w IT' },
                        { id: 'projects', label: 'Własne aplikacje' },
                        { id: 'upskill', label: 'Awans' },
                      ].map((goal) => (
                        <button
                          key={goal.id}
                          type="button"
                          onClick={() => setLeadGoal(goal.id as 'job' | 'projects' | 'upskill')}
                          className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap truncate ${
                            leadGoal === goal.id
                              ? 'border-indigo-500 bg-indigo-950/60 text-indigo-300'
                              : 'border-white/10 bg-[#101726] text-[#94A3B8] hover:text-[#F8FAFC]'
                          }`}
                        >
                          {goal.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formError && (
                    <p role="alert" className="text-xs font-semibold text-rose-400">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors whitespace-nowrap"
                  >
                    Wygeneruj indywidualny plan nauki
                  </button>
                </form>
              )}
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* =====================================================================
          6. ACCESS PLANS (Focused Pricing Comparison)
      ===================================================================== */}
      <section id="plany-dostepu" className="bg-[#090D16] py-20 lg:py-24 border-b border-white/[0.08]">
        <div className="mx-auto max-w-5xl px-4 sm:px-8 space-y-10">
          <RevealBlock className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-medium text-[#94A3B8]">
                <span className="font-semibold text-indigo-400">Przejrzyste Warunki</span>
                <span aria-hidden="true">·</span>
                <span>Zacznij za darmo, rozbuduj kiedy zechcesz</span>
              </div>
              <h2
                style={{ textWrap: 'balance' }}
                className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]"
              >
                Wybierz tryb dopasowany do Twojego tempa.
              </h2>
            </div>

            <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-[#0B101B] shrink-0 self-start">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  billingCycle === 'monthly'
                    ? 'bg-white/15 text-[#F8FAFC]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                Miesięcznie
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  billingCycle === 'yearly'
                    ? 'bg-indigo-600 text-white'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                Rocznie (2 mies. gratis)
              </button>
            </div>
          </RevealBlock>

          <RevealBlock delayMs={80} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Plan Darmowy */}
            <div className="rounded-2xl border border-white/10 bg-[#0B101B] p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-[#94A3B8]">Konto Startowe</p>
                  <h3 className="font-display text-xl font-bold text-[#F8FAFC] mt-1">
                    Plan Darmowy (Start od Zera)
                  </h3>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-extrabold text-[#F8FAFC] tabular-nums">
                    0 zł
                  </span>
                  <span className="text-xs text-[#94A3B8]">/ bezterminowo</span>
                </div>

                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  Pełny dostęp do 15 modułów i 91 lekcji z systemem 5 odnawiających się serc energii.
                  Pisanie kodu w edytorze nigdy nie zabiera serc.
                </p>

                <ul className="space-y-2.5 pt-3 border-t border-white/[0.08] text-xs sm:text-sm text-[#CBD5E1]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Wszystkie 15 modułów i 91 interaktywnych lekcji</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Edytor kodu w przeglądarce z listą kroków na żywo</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Synchronizacja postępów między komputerem a telefonem</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Ligi XP, wyzwania dnia oraz fiszki powtórkowe SM-2</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handlePrimaryAction}
                className="w-full py-3.5 px-5 text-sm font-bold text-[#F8FAFC] bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 rounded-xl transition-colors whitespace-nowrap"
              >
                {isAuthenticated ? 'Przejdź do Pulpitu' : 'Załóż darmowe konto'}
              </button>
            </div>

            {/* Plan PRO */}
            <div className="rounded-2xl border border-indigo-500/70 bg-[#10172A] p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-indigo-300">Pełna Swoboda Inżynierska</p>
                    <h3 className="font-display text-xl font-bold text-[#F8FAFC] mt-1">
                      Full Stack PRO
                    </h3>
                  </div>
                  {billingCycle === 'yearly' && (
                    <span className="text-xs font-mono font-semibold text-emerald-400 whitespace-nowrap shrink-0">
                      Oszczędzasz 120 zł / rok
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  <span
                    key={billingCycle}
                    className="animate-fsda-card-enter font-display text-4xl font-extrabold text-[#F8FAFC] tabular-nums"
                  >
                    {billingCycle === 'yearly' ? '39 zł' : '49 zł'}
                  </span>
                  <span className="text-xs text-[#94A3B8]">
                    / miesiąc {billingCycle === 'yearly' ? '(płatne 468 zł rocznie)' : ''}
                  </span>
                </div>

                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  Dla osób przygotowujących się intensywnie do pracy w IT — zero limitów serc,
                  czysty interfejs bez reklam i pełny zestaw narzędzi rekrutacyjnych.
                </p>

                <ul className="space-y-2.5 pt-3 border-t border-white/[0.08] text-xs sm:text-sm text-[#CBD5E1]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Nielimitowane serca energii podczas quizów i egzaminów</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Brak reklam sponsorskich w całej Akademii</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Symulator rozmowy Live Coding oraz Kreator CV ATS</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Imienny Certyfikat Ukończenia Full Stack Engineer (PL / EN)</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    onOpenAuthModal();
                  } else {
                    setIsSubModalOpen(true);
                  }
                }}
                className="w-full py-3.5 px-5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors whitespace-nowrap"
              >
                Wybierz pakiet Full Stack PRO
              </button>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* =====================================================================
          7. FAQ ACCORDION & DARK PORTFOLIO DESK CLOSING INVITATION
      ===================================================================== */}
      <section id="faq" className="bg-[#06080E] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <RevealBlock className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-[#94A3B8]">
                  <span className="font-semibold text-indigo-400">Najczęściej Zadawane Pytania</span>
                  <span aria-hidden="true">·</span>
                  <span>Wszystko przed pierwszym logowaniem</span>
                </div>
                <h2
                  style={{ textWrap: 'balance' }}
                  className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]"
                >
                  Odpowiedzi dla osób zaczynających od zera.
                </h2>
              </div>

              <div className="space-y-3">
                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = openFaqId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border overflow-hidden transition-colors duration-200 ${
                        isOpen
                          ? 'border-indigo-500/50 bg-[#0D1322]'
                          : 'border-white/[0.08] bg-[#0B101B]'
                      }`}
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaqId(isOpen ? '' : item.id)}
                        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
                      >
                        <span className="text-sm sm:text-base font-bold text-[#F8FAFC]">
                          0{idx + 1}. {item.question}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-[#94A3B8] shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-indigo-400' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="animate-fsda-card-enter px-6 pb-5 pt-2 text-sm text-[#CBD5E1] leading-relaxed border-t border-white/[0.06]">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Dark Architectural Portfolio & Closing Action */}
            <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0B101B] overflow-hidden">
              <div className="relative">
                <EditorialImage
                  src={PORTFOLIO_DESK_IMAGE}
                  alt="Ciemne biurko inżyniera z laptopem prezentującym ukończony dashboard aplikacji i klawiaturą mechaniczną"
                  aspectClass="aspect-[4/3]"
                  fallbackTitle="Twoje portfolio i certyfikat Full Stack"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0B101B] via-transparent to-transparent"
                />
              </div>
              <div className="p-6 sm:p-7 space-y-4">
                <h3 className="font-display text-xl font-extrabold text-[#F8FAFC]">
                  Gotowy napisać swoją pierwszą linijkę kodu?
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Moduł 01 zajmuje około 15 minut na pierwszą lekcję i nie wymaga żadnej instalacji.
                  Uruchom aplikację i sprawdź w praktyce.
                </p>
                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  className="group w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all whitespace-nowrap"
                >
                  <span>
                    {isAuthenticated ? 'Przejdź do Pulpitu Kursanta' : 'Zacznij pierwszą lekcję za darmo'}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* Smooth Back-to-Top Floating Button */}
      <button
        type="button"
        onClick={smoothScrollToTop}
        data-testid="landing-scroll-to-top"
        aria-label="Przewiń płynnie do góry strony"
        aria-hidden={!showScrollTop}
        tabIndex={showScrollTop ? 0 : -1}
        title="Przewiń do góry"
        className={`fixed bottom-5 right-5 z-40 inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-[#0B101B]/90 px-3.5 text-xs font-semibold text-[#F8FAFC] backdrop-blur-md shadow-xl transition-all duration-200 hover:border-indigo-500/70 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          showScrollTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <ArrowUp className="h-4 w-4 text-indigo-400 shrink-0" />
        <span className="hidden sm:inline whitespace-nowrap">Do góry</span>
      </button>
    </div>
  );
};
