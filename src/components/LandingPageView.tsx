import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MODULES_DATA } from '../data/modulesData';
import {
  ArrowRight,
  Check,
  Play,
  RotateCcw,
  Terminal,
  Database,
  Send,
  Cpu,
  Award,
  ChevronRight,
  CheckCircle2,
  Smartphone,
} from 'lucide-react';

interface PlaygroundSample {
  id: 'html' | 'css' | 'js';
  label: string;
  lessonRef: string;
  taskTitle: string;
  analogy: string;
  starterCode: string;
  solutionCode: string;
  checkRule: (code: string) => boolean;
  ruleLabel: string;
}

const PLAYGROUND_SAMPLES: PlaygroundSample[] = [
  {
    id: 'html',
    label: '01. HTML5: Struktura',
    lessonRef: 'html-1',
    taskTitle: 'Dopisz główny nagłówek <h1> oraz przycisk <button> w karcie profilu',
    analogy: 'HTML to szkielet budynku — każdy znacznik mówi przeglądarce, czym jest dany element.',
    starterCode: `<div class="card">
  <p class="kicker">Karta Inżyniera</p>
  <!-- Dopisz poniżej nagłówek <h1> z imieniem i <button> -->
  <h1></h1>
  <p class="bio">Buduję nowoczesne aplikacje webowe w React i TypeScript.</p>
</div>`,
    solutionCode: `<div class="card">
  <p class="kicker">Karta Inżyniera</p>
  <h1>Maja Kowalska</h1>
  <p class="bio">Buduję nowoczesne aplikacje webowe w React i TypeScript.</p>
  <button class="btn">Zobacz Portfolio</button>
</div>`,
    checkRule: (code: string) =>
      /<h1>\s*[^<\s][^<]*<\/h1>/i.test(code) && /<button[^>]*>[\s\S]*?<\/button>/i.test(code),
    ruleLabel: 'Wypełniony znacznik <h1>Tekst</h1> oraz dodany przycisk <button>',
  },
  {
    id: 'css',
    label: '02. CSS3: Układ Flexbox',
    lessonRef: 'css-1',
    taskTitle: 'Włącz układ Flexbox (display: flex) i wyrównaj elementy w wierszu',
    analogy: 'Flexbox działa jak inteligentna półka, która sama układa elementy obok siebie z równym odstępem.',
    starterCode: `.pricing-row {
  /* Dopisz display: flex oraz gap: 16px */
  display: block;
  padding: 16px;
  background: #0f172a;
  border-radius: 12px;
  border: 1px solid #1e293b;
}`,
    solutionCode: `.pricing-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #0f172a;
  border-radius: 12px;
  border: 1px solid #38bdf8;
}`,
    checkRule: (code: string) => /display\s*:\s*flex/i.test(code) && /gap\s*:\s*\d+/i.test(code),
    ruleLabel: 'Zadeklarowano właściwość display: flex oraz odstęp gap',
  },
  {
    id: 'js',
    label: '03. JavaScript: Logika',
    lessonRef: 'js-1',
    taskTitle: 'Oblicz sumę punktów XP po ukończeniu lekcji i zwróć wynik',
    analogy: 'Funkcja w JavaScript to ekspres do kawy: wsypujesz składniki (argumenty), a na wyjściu otrzymujesz gotowy wynik (return).',
    starterCode: `function obliczNoweXP(aktualneXP, bonusZaLekcje) {
  // Zwróć sumę aktualneXP + bonusZaLekcje
  return 0;
}

const wynik = obliczNoweXP(1250, 150);`,
    solutionCode: `function obliczNoweXP(aktualneXP, bonusZaLekcje) {
  return aktualneXP + bonusZaLekcje;
}

const wynik = obliczNoweXP(1250, 150);`,
    checkRule: (code: string) =>
      /return\s+aktualneXP\s*\+\s*bonusZaLekcje/i.test(code),
    ruleLabel: 'Funkcja zwraca wyrażenie aktualneXP + bonusZaLekcje',
  },
];

interface LandingPageViewProps {
  onOpenAuthModal: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onOpenAuthModal }) => {
  const { isAuthenticated, currentUser, setActiveTab, setIsSubModalOpen, allLessons } = useApp();

  // Interactive Hero Code Playground state
  const [selectedSampleId, setSelectedSampleId] = useState<'html' | 'css' | 'js'>('html');
  const activeSample = useMemo(
    () => PLAYGROUND_SAMPLES.find((s) => s.id === selectedSampleId) || PLAYGROUND_SAMPLES[0],
    [selectedSampleId]
  );
  const [codeBySample, setCodeBySample] = useState<Record<string, string>>({
    html: PLAYGROUND_SAMPLES[0].solutionCode,
    css: PLAYGROUND_SAMPLES[1].solutionCode,
    js: PLAYGROUND_SAMPLES[2].solutionCode,
  });

  const currentCode = codeBySample[selectedSampleId] ?? activeSample.starterCode;
  const isRulePassed = activeSample.checkRule(currentCode);

  // Interactive Curriculum Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');
  const [expandedModuleId, setExpandedModuleId] = useState<number>(1);

  // Pricing billing toggle
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Interactive Study Path Calculator & Lead Capture Form state
  const [weeklyHours, setWeeklyHours] = useState<number>(8);
  const [leadName, setLeadName] = useState<string>('');
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadGoal, setLeadGoal] = useState<'job' | 'projects' | 'upskill'>('job');
  const [formError, setFormError] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

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

  const estimatedWeeks = useMemo(
    () => Math.max(4, Math.ceil(totalCurriculumHours / Math.max(2, weeklyHours))),
    [totalCurriculumHours, weeklyHours]
  );

  const estimatedMonths = useMemo(
    () => (estimatedWeeks / 4.3).toFixed(1),
    [estimatedWeeks]
  );

  const handlePrimaryAction = () => {
    if (isAuthenticated) {
      setActiveTab('dashboard');
    } else {
      onOpenAuthModal();
    }
  };

  const handleOpenLesson = (lessonId: string) => {
    if (isAuthenticated) {
      setActiveTab('lesson', lessonId);
    } else {
      onOpenAuthModal();
    }
  };

  const handleOpenSimulator = (tab: 'terminal' | 'sql_studio' | 'api_studio' | 'event_loop') => {
    if (isAuthenticated) {
      setActiveTab(tab);
    } else {
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* =====================================================================
          TOP BAR CONTRACT (Strict 3-Zone Single-Row Header)
          [Brand title, one line] — [5 nav links, single-line] — [1 primary action]
      ===================================================================== */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 sm:px-8 py-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
          >
            Full Stack Academy
          </a>

          {/* Zone 2: 5 clean single-line text navigation links */}
          <nav
            aria-label="Nawigacja strony głównej"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
          >
            <button
              type="button"
              onClick={() => scrollToSection('metoda-nauki')}
              className="hover:text-white hover:underline underline-offset-8 decoration-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              Metoda Nauki
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('program-kursu')}
              className="hover:text-white hover:underline underline-offset-8 decoration-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              Program 15 Modułów
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('wyniki-kursantow')}
              className="hover:text-white hover:underline underline-offset-8 decoration-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              Wyniki Kursantów
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('plany-dostepu')}
              className="hover:text-white hover:underline underline-offset-8 decoration-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              Plany i Dostęp
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('kalkulator-sciezki')}
              className="hover:text-white hover:underline underline-offset-8 decoration-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              Kalkulator Kariery
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handlePrimaryAction}
              data-testid="landing-top-cta"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              {isAuthenticated ? 'Aplikacja do nauki (Pulpit)' : 'Otwórz Aplikację do nauki →'}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          1. HERO SECTION (2-Column Asymmetric Split + Interactive Live IDE)
      ===================================================================== */}
      <section id="top" className="relative border-b border-slate-900 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-stretch">
            {/* Left Column: Value Proposition & Primary Action */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                {/* Quiet Unboxed Metadata Kicker (Zero-Pill Discipline) */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
                  <span className="text-indigo-400 font-semibold">fsda-phi.vercel.app</span>
                  <span aria-hidden="true">·</span>
                  <span>Aplikacja: app.fsda-phi.vercel.app</span>
                  <span aria-hidden="true">·</span>
                  <span>Polska Akademia Kodowania</span>
                </div>

                {/* Display Headline with text-wrap: balance */}
                <h1
                  style={{ textWrap: 'balance', fontSize: 'clamp(2.25rem, 4vw, 3.65rem)' }}
                  className="font-extrabold tracking-tight text-white leading-[1.08]"
                >
                  Opanuj inżynierię Full Stack od pierwszej linii HTML do wdrożenia w chmurze.
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  Praktyczna platforma szkoleniowa z wbudowanym edytorem kodu, 6 symulatorami
                  inżynierskimi i metodą nauki bez żargonu. Zamiast pustego ekranu otrzymujesz
                  gotowy szkielet projektu i uzupełniasz kluczową logikę krok po kroku.
                </p>
              </div>

              {/* Single Dominant Primary CTA + Quiet Secondary Link */}
              <div className="space-y-6 pt-2">
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={handlePrimaryAction}
                    data-testid="landing-hero-primary-cta"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0 shadow-lg shadow-indigo-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    <span>
                      {isAuthenticated
                        ? `Przejdź do Aplikacji (${currentUser.name.split(' ')[0]})`
                        : 'Uruchom Aplikację do nauki'}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection('program-kursu')}
                    className="px-5 py-3.5 text-sm font-semibold text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl transition-colors whitespace-nowrap shrink-0"
                  >
                    Przejrzyj sylabus 15 modułów
                  </button>
                </div>

                {/* Unboxed Trust Metadata */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 pt-2 border-t border-slate-900">
                  <span>Landing Page: fsda-phi.vercel.app</span>
                  <span aria-hidden="true">·</span>
                  <a
                    href="https://app.fsda-phi.vercel.app"
                    onClick={(e) => {
                      if (window.location.hostname !== 'app.fsda-phi.vercel.app') {
                        e.preventDefault();
                        handlePrimaryAction();
                      }
                    }}
                    className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                  >
                    Aplikacja: app.fsda-phi.vercel.app
                  </a>
                  <span aria-hidden="true">·</span>
                  <span>Weryfikowany certyfikat SHA-256</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Mini-IDE Showcase */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="flex-1 flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
                {/* Segmented Interactive Controls for Playground */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/80 px-4 py-3">
                  <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800/80">
                    {PLAYGROUND_SAMPLES.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => setSelectedSampleId(sample.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                          selectedSampleId === sample.id
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCodeBySample((prev) => ({
                          ...prev,
                          [selectedSampleId]: activeSample.starterCode,
                        }))
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white border border-slate-800 rounded-md transition-colors whitespace-nowrap shrink-0"
                      title="Przywróć szablon początkowy"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Szablon 80%</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCodeBySample((prev) => ({
                          ...prev,
                          [selectedSampleId]: activeSample.solutionCode,
                        }))
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-950/60 border border-indigo-500/30 rounded-md transition-colors whitespace-nowrap shrink-0"
                    >
                      <Play className="h-3 w-3" />
                      <span>Wstaw wzorzec</span>
                    </button>
                  </div>
                </div>

                {/* Task & Analogy Bar */}
                <div className="border-b border-slate-800/80 bg-slate-900/40 px-4 py-3 space-y-1">
                  <p className="text-xs font-semibold text-slate-200">
                    Zadanie próbne: {activeSample.taskTitle}
                  </p>
                  <p className="text-xs text-slate-400">
                    Analogia z życia: {activeSample.analogy}
                  </p>
                </div>

                {/* Editable Code + Live Visual Result Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 flex-1">
                  {/* Code Editor Pane */}
                  <div className="flex flex-col p-4 bg-slate-950/60">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                      <span>Edytor na żywo (możesz edytować)</span>
                      <span className="font-mono tabular-nums">{currentCode.split('\n').length} linii</span>
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
                      rows={8}
                      className="w-full flex-1 font-mono text-xs leading-relaxed text-emerald-300 bg-slate-950 border border-slate-800/90 rounded-lg p-3 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  {/* Live Output Preview Pane */}
                  <div className="flex flex-col justify-between p-4 bg-slate-900/30">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Podgląd wyniku w czasie rzeczywistym</span>
                        <span className="text-slate-300 font-medium">
                          {isRulePassed ? 'Zaliczono (+150 XP)' : 'W trakcie edycji'}
                        </span>
                      </div>

                      {/* Visual Rendered Representation */}
                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 min-h-[148px] flex flex-col justify-center">
                        {selectedSampleId === 'html' && (
                          <div className="space-y-2">
                            <p className="text-[11px] text-indigo-400 font-medium">Karta Inżyniera</p>
                            <p className="text-base font-bold text-white">
                              {(currentCode.match(/<h1>([\s\S]*?)<\/h1>/i)?.[1] || '').trim() ||
                                'Brak tekstu w <h1>...'}
                            </p>
                            <p className="text-xs text-slate-400">
                              Buduję nowoczesne aplikacje webowe w React i TypeScript.
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
                            className={`p-3 rounded-lg border transition-all ${
                              isRulePassed
                                ? 'flex items-center justify-between gap-4 border-sky-500/60 bg-slate-900'
                                : 'block space-y-2 border-slate-800 bg-slate-900/50'
                            }`}
                          >
                            <div>
                              <p className="text-xs font-bold text-white">Pakiet Full Stack</p>
                              <p className="text-[11px] text-slate-400">Układ {isRulePassed ? 'Flexbox (Wiersz)' : 'Block (Kolumna)'}</p>
                            </div>
                            <span className="inline-block px-2.5 py-1 text-xs font-mono tabular-nums font-semibold bg-indigo-600 text-white rounded">
                              100% Gotowy
                            </span>
                          </div>
                        )}

                        {selectedSampleId === 'js' && (
                          <div className="space-y-2 font-mono text-xs">
                            <div className="text-slate-400">
                              Wejście: <span className="text-slate-200 tabular-nums">1250 XP + 150 XP</span>
                            </div>
                            <div className="text-sm font-bold text-white tabular-nums">
                              Wynik funkcji:{' '}
                              <span className={isRulePassed ? 'text-emerald-400' : 'text-amber-400'}>
                                {isRulePassed ? '1400 XP (Poprawnie)' : '0 XP (Uzupełnij return)'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Live Checklist Verification Row */}
                    <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2
                          className={`h-4 w-4 shrink-0 ${
                            isRulePassed ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        />
                        <span className={isRulePassed ? 'text-slate-200' : 'text-slate-400'}>
                          {activeSample.ruleLabel}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenLesson(activeSample.lessonRef)}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 whitespace-nowrap shrink-0"
                      >
                        Otwórz lekcję →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              FULL-WIDTH 4-COLUMN KPI STRIP BELOW HERO SPLIT (Tabular Numerals)
          ===================================================================== */}
          <div className="mt-14 pt-10 border-t border-slate-900 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                {MODULES_DATA.length} modułów
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Kompletna ścieżka od HTML5 i CSS3 przez React 19, Node.js, SQL aż po Docker i CI/CD.
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                {allLessons.length} lekcji
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Każda lekcja zawiera analogię z życia, gotowy szablon 80%, quiz i zadanie praktyczne.
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                12 projektów
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Realne aplikacje do portfolio z wymaganiami biznesowymi i testami akceptacyjnymi.
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                6 symulatorów
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Terminal Bash/Git, Studio SQL, Klient REST API, Wizualizator Event Loop i Live Coding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. CORE CAPABILITIES — ASYMMETRIC BENTO GRID (Editorial Numbering)
      ===================================================================== */}
      <section id="metoda-nauki" className="py-20 lg:py-24 border-b border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="text-indigo-400 font-semibold">Architektura Kształcenia</span>
              <span aria-hidden="true">·</span>
              <span>Dlaczego kursanci kończą ten program</span>
            </div>
            <h2
              style={{ textWrap: 'balance' }}
              className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white"
            >
              Zaprojektowane dla osób, które odbiły się od suchych wykładów wideo.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Większość kursów zarzuca początkujących akademickimi definicjami i zostawia przed pustym
              plikiem. W Full Stack Academy uczysz się przez modyfikację działającego kodu w przeglądarce.
            </p>
          </div>

          {/* Asymmetric Bento Grid: Row 1 (col-span-2 + col-span-1), Row 2 (col-span-1 + col-span-2) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 01: col-span-2 */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-800/90 bg-slate-900/40 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Metodyka Start od Zera</span>
                  <span aria-hidden="true">·</span>
                  <span>Zero kar za eksperymentowanie</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  01. Szablony 80% gotowego kodu i lista kroków na żywo
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Nie musisz pisać 50 linijek boilerplate&apos;u z pamięci. Każde ćwiczenie otwiera się
                  z ułożonym projektem, w którym dopisujesz najważniejsze 2–3 linijki we wskazanym miejscu.
                  Lista kontrolna weryfikuje Twój kod w ułamku sekundy, bez odbierania punktów życia za próby.
                </p>
              </div>

              {/* Architectural Comparison Diagram (Old Courses vs FSDA) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-400">Tradycyjne kursy wideo</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    2 godziny oglądania teorii, trudny żargon techniczny i pusty edytor, w którym
                    jedna literówka blokuje dalszą naukę.
                  </p>
                </div>
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-2">
                  <p className="text-xs font-semibold text-indigo-300">Full Stack Academy</p>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Prosta analogia z codziennego życia, słowniczek bez żargonu, gotowy szablon z podpowiedzią
                    i natychmiastowy podgląd wzorca.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 02: col-span-1 */}
            <div className="lg:col-span-1 rounded-2xl border border-slate-800/90 bg-slate-900/40 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Środowisko Cloud IDE</span>
                  <span aria-hidden="true">·</span>
                  <span>Bez instalacji</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  02. 6 symulatorów inżynierskich w przeglądarce
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Trenuj komendy Linuksa, zapytania SQL JOIN, żądania REST API oraz pętlę zdarzeń JS
                  bez konfigurowania lokalnego serwera.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenSimulator('sql_studio')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2 truncate">
                    <Database className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">Studio Bazy SQL (Relacje & JOIN)</span>
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenSimulator('terminal')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2 truncate">
                    <Terminal className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Terminal Bash & Git Workflow</span>
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenSimulator('api_studio')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2 truncate">
                    <Send className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">Studio REST API & JSON</span>
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenSimulator('event_loop')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2 truncate">
                    <Cpu className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">Wizualizator Event Loop JS</span>
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                </button>
              </div>
            </div>

            {/* Card 03: col-span-1 */}
            <div className="lg:col-span-1 rounded-2xl border border-slate-800/90 bg-slate-900/40 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>iOS · Android · Web PWA</span>
                  <span aria-hidden="true">·</span>
                  <span>Synchronizacja Cloud</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  03. Nauka na telefonie i komputerze z algorytmem SM-2
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Powtarzaj fiszki w drodze do pracy na smartfonie i pisz projekty wieczorem na laptopie.
                  Twój postęp, seria dni (Streak) i kod zapisują się automatycznie w chmurze Firebase.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Aplikacja Mobilna & PWA</span>
                  </span>
                  <span className="font-mono tabular-nums text-emerald-400 font-semibold">100% Sync</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Wsparcie dla iOS (App Store SDK 26), Android (Google Play) oraz instalacji bezpośredniej PWA.
                </p>
              </div>
            </div>

            {/* Card 04: col-span-2 */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-800/90 bg-slate-900/40 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Rekrutacja IT & Portfolio</span>
                  <span aria-hidden="true">·</span>
                  <span>Weryfikacja kryptograficzna</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  04. Imienny Certyfikat Full Stack Engineer, Egzamin Live Coding i Kreator CV
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Po ukończeniu modułów i projektów generujesz dwujęzyczny certyfikat z unikalnym
                  identyfikatorem weryfikacyjnym dla rekruterów oraz gotowe CV techniczne w formacie ATS.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Award className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Dyplom Ukończenia · Poziom Junior / Mid Full Stack</span>
                  </div>
                  <p className="text-sm font-bold text-white">
                    Zawiera wykaz 15 ukończonych modułów, 12 projektów Git oraz wynik egzaminu technicznego
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (isAuthenticated) {
                      setActiveTab('certificate');
                    } else {
                      onOpenAuthModal();
                    }
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Zobacz wzór certyfikatu →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. INTERACTIVE 15-MODULE CURRICULUM EXPLORER
      ===================================================================== */}
      <section id="program-kursu" className="py-20 lg:py-24 border-b border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="text-indigo-400 font-semibold">Kompletny Sylabus</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{MODULES_DATA.length} modułów · {allLessons.length} lekcji · {totalCurriculumHours}h nauki</span>
              </div>
              <h2
                style={{ textWrap: 'balance' }}
                className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white"
              >
                Przejrzysta mapa drogowa od podstaw do architektury produkcyjnej.
              </h2>
            </div>

            {/* Interactive Category Filter Segmented Bar */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Modules Grid + Lesson Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left List of Modules */}
            <div className="lg:col-span-7 space-y-3">
              {filteredModules.map((mod) => {
                const isSelected = expandedModuleId === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setExpandedModuleId(mod.id)}
                    className={`w-full text-left rounded-2xl border p-5 transition-colors ${
                      isSelected
                        ? 'border-indigo-500/60 bg-slate-900/90'
                        : 'border-slate-800/80 bg-slate-900/30 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        {/* Unboxed Metadata */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
                          <span className="text-indigo-400 font-semibold">
                            Moduł {String(mod.id).padStart(2, '0')}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{mod.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{mod.lessons.length} lekcji</span>
                          <span aria-hidden="true">·</span>
                          <span>{mod.durationHours}h</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          {mod.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">
                          {mod.description}
                        </p>
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 shrink-0 mt-1 transition-transform ${
                          isSelected ? 'text-indigo-400 translate-x-0.5' : 'text-slate-600'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Sticky Preview of Selected Module's Lessons */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
              {(() => {
                const activeMod =
                  MODULES_DATA.find((m) => m.id === expandedModuleId) || MODULES_DATA[0];
                return (
                  <>
                    <div className="space-y-2 border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
                        <span className="text-indigo-400 font-semibold">
                          Szczegóły Modułu {String(activeMod.id).padStart(2, '0')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>+{activeMod.totalXp} XP do zdobycia</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-white">{activeMod.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {activeMod.description}
                      </p>
                    </div>

                    <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                      <p className="text-xs font-semibold text-slate-400">
                        Lista lekcji w tym module ({activeMod.lessons.length}):
                      </p>
                      {activeMod.lessons.map((lesson, idx) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-950/70 px-3.5 py-2.5 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="font-mono tabular-nums text-slate-500 shrink-0">
                              {String(idx + 1).padStart(2, '0')}.
                            </span>
                            <span className="text-slate-200 font-medium truncate">
                              {lesson.title}
                            </span>
                          </div>
                          <span className="font-mono tabular-nums text-[11px] text-slate-400 shrink-0">
                            {lesson.durationMinutes} min
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-4">
                      <div className="text-xs text-slate-400">
                        Odznaka modułu: <strong className="text-white">{activeMod.badgeName}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenLesson(activeMod.lessons[0]?.id || 'html-7')}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>Rozpocznij ten moduł</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. PROOF OF IMPACT & STUDENT OUTCOMES (Claim-to-Proof Adjacency)
      ===================================================================== */}
      <section id="wyniki-kursantow" className="py-20 lg:py-24 border-b border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="text-indigo-400 font-semibold">Udokumentowane Rezultaty</span>
              <span aria-hidden="true">·</span>
              <span>Przebranżowienie i awanse techniczne</span>
            </div>
            <h2
              style={{ textWrap: 'balance' }}
              className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white"
            >
              Od pierwszych znaczników HTML do komercyjnych projektów w zespole.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Case Study 1 */}
            <article className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
                  <span className="text-emerald-400 font-semibold">Czas nauki: 5.5 miesiąca</span>
                  <span aria-hidden="true">·</span>
                  <span>12 ukończonych projektów</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  „Wcześniej kupiłem dwa kursy wideo z JavaScriptu i porzuciłem je po tygodniu, bo
                  gubiłem się w trudnych pojęciach. Tutaj szablony 80% w lekcjach HTML i Reacta
                  pozwoliły mi od pierwszego dnia widzieć efekty. Na rozmowie rekrutacyjnej pokazałem
                  własny projekt z modułu SQL i dostałem pierwszą ofertę.”
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80">
                <p className="text-sm font-bold text-white">Michał Krawczyk</p>
                <p className="text-xs text-slate-400">
                  Przed: Specjalista ds. Logistyki · Obecnie: Junior Frontend Developer w Software House (Wrocław)
                </p>
              </div>
            </article>

            {/* Case Study 2 */}
            <article className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
                  <span className="text-emerald-400 font-semibold">Wynik egzaminu: 94/100</span>
                  <span aria-hidden="true">·</span>
                  <span>Seria 68 dni nauki</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  „Jako testerka manualna chciałam przejść na automatyzację i pełny development.
                  Wbudowany symulator terminala Git oraz Studio REST API oszczędziły mi godzin walki
                  z konfiguracją środowiska. Codzienne fiszki SM-2 na telefonie sprawiły, że pytania
                  techniczne na rekrutacji zdałam bez stresu.”
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80">
                <p className="text-sm font-bold text-white">Karolina Wiśniewska</p>
                <p className="text-xs text-slate-400">
                  Przed: QA Manual Tester · Obecnie: Associate Full Stack Engineer w FinTech (Warszawa)
                </p>
              </div>
            </article>

            {/* Case Study 3 */}
            <article className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
                  <span className="text-emerald-400 font-semibold">Awans płacowy: +65%</span>
                  <span aria-hidden="true">·</span>
                  <span>Certyfikat FSDA-2026</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  „Znałem podstawy CSS i WordPressa, ale brakowało mi architektury backendowej:
                  Node.js, Express, autoryzacji JWT i baz relacyjnych. Moduły backendowe i symulator
                  Event Loopa uporządkowały moją wiedzę tak dobrze, że przejąłem w firmie projekty
                  w pełnym stacku TypeScript.”
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80">
                <p className="text-sm font-bold text-white">Tomasz Zieliński</p>
                <p className="text-xs text-slate-400">
                  Przed: Freelance Webmaster · Obecnie: Regular Full Stack Developer w Agencji E-Commerce (Kraków)
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. TRANSPARENT PLANS & ACCESS
      ===================================================================== */}
      <section id="plany-dostepu" className="py-20 lg:py-24 border-b border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="text-indigo-400 font-semibold">Przejrzyste Warunki</span>
                <span aria-hidden="true">·</span>
                <span>Zacznij za darmo, przejdź na PRO kiedy chcesz</span>
              </div>
              <h2
                style={{ textWrap: 'balance' }}
                className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white"
              >
                Wybierz tryb nauki dopasowany do Twojego tempa.
              </h2>
            </div>

            {/* Interactive Billing Cycle Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  billingCycle === 'monthly'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Rozliczenie miesięczne
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  billingCycle === 'yearly'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Rocznie (2 miesiące gratis)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
            {/* Free Tier Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 flex flex-col justify-between space-y-8">
              <div className="space-y-5">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400">Konto Startowe</p>
                  <h3 className="text-2xl font-extrabold text-white">Plan Darmowy (Start od Zera)</h3>
                </div>

                <div className="flex items-baseline gap-2 font-mono tabular-nums">
                  <span className="text-4xl font-extrabold text-white">0 zł</span>
                  <span className="text-xs text-slate-400">/ bezterminowo</span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Pełny dostęp do ścieżki edukacyjnej z systemem 5 serc energii (odnawiających się
                  automatycznie co 30 minut lub za punkty XP).
                </p>

                <ul className="space-y-3 pt-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Dostęp do wszystkich 15 modułów i 91 interaktywnych lekcji</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Wbudowany edytor kodu z listą kroków na żywo bez utraty serc</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Synchronizacja postępów w chmurze między komputerem a telefonem</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Ligi XP, wyzwania dnia oraz fiszki powtórkowe SM-2</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handlePrimaryAction}
                className="w-full py-3.5 px-6 text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors whitespace-nowrap"
              >
                {isAuthenticated ? 'Przejdź do swojego konta' : 'Załóż darmowe konto'}
              </button>
            </div>

            {/* PRO Tier Card */}
            <div className="rounded-2xl border border-indigo-500/50 bg-slate-900/80 p-6 sm:p-8 flex flex-col justify-between space-y-8">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-indigo-400">Pełna Swoboda Inżynierska</p>
                    <h3 className="text-2xl font-extrabold text-white">Full Stack PRO</h3>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-slate-400">
                    {billingCycle === 'yearly' ? 'Oszczędzasz 120 zł / rok' : 'Elastyczna subskrypcja'}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 font-mono tabular-nums">
                  <span className="text-4xl font-extrabold text-white">
                    {billingCycle === 'yearly' ? '39 zł' : '49 zł'}
                  </span>
                  <span className="text-xs text-slate-400">
                    / miesiąc {billingCycle === 'yearly' ? '(płatne 468 zł rocznie)' : ''}
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Stworzony dla osób intensywnie przygotowujących się do zmiany pracy w IT — zero
                  limitów energii, brak reklam i pełny pakiet egzaminacyjny.
                </p>

                <ul className="space-y-3 pt-2 text-sm text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Nielimitowane serca energii (∞) podczas quizów i egzaminów</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>100% czystego interfejsu — całkowite wyłączenie reklam sponsorskich</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Symulator rozmowy kwalifikacyjnej Live Coding + Kreator CV ATS</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Weryfikowany Certyfikat Ukończenia Full Stack Engineer (PL / EN)</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isAuthenticated) {
                    setIsSubModalOpen(true);
                  } else {
                    onOpenAuthModal();
                  }
                }}
                className="w-full py-3.5 px-6 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors whitespace-nowrap shadow-lg shadow-indigo-600/20"
              >
                {currentUser.isPro ? 'Masz aktywny pakiet PRO — Zarządzaj' : 'Wybierz pakiet Full Stack PRO'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. INTERACTIVE CAREER CALCULATOR & LEAD ONBOARDING FORM
      ===================================================================== */}
      <section id="kalkulator-sciezki" className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Interactive Study Tempo Estimator */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-indigo-400 font-semibold">Kalkulator Ścieżki Nauki</span>
                  <span aria-hidden="true">·</span>
                  <span>Zaplanuj swój start</span>
                </div>
                <h2
                  style={{ textWrap: 'balance' }}
                  className="text-2xl sm:text-3xl font-extrabold text-white"
                >
                  Sprawdź, kiedy odbierzesz swój certyfikat Full Stack Developera.
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Dostosuj liczbę godzin tygodniowo i wygeneruj spersonalizowany plan nauki
                  obejmujący wszystkie 15 modułów i 12 projektów praktycznych.
                </p>
              </div>

              {/* Tempo Selector */}
              <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="weekly-hours-range" className="font-semibold text-slate-300">
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
                <div className="flex justify-between text-[11px] font-mono tabular-nums text-slate-500">
                  <span>3h (Spokojnie)</span>
                  <span>10h (Optymalnie)</span>
                  <span>25h (Bootcamp)</span>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-slate-400">Szacowany czas ukończenia</p>
                    <p className="text-lg font-extrabold text-white font-mono tabular-nums">
                      ~{estimatedWeeks} tygodni ({estimatedMonths} mies.)
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Dzienna dawka nauki</p>
                    <p className="text-lg font-extrabold text-emerald-400 font-mono tabular-nums">
                      ~{Math.round((weeklyHours * 60) / 7)} min / dzień
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Validated Lead / Onboarding Form */}
            <div className="lg:col-span-6">
              {formSubmitted ? (
                <div
                  data-testid="study-plan-success"
                  className="rounded-2xl border border-emerald-500/40 bg-slate-950 p-6 sm:p-8 space-y-5"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-7 w-7 text-emerald-400 shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Plan nauki dla {leadName} został przygotowany!
                      </h3>
                      <p className="text-xs text-slate-400">
                        Wysłaliśmy podsumowanie na adres {leadEmail} · Tempo: {weeklyHours}h / tydz.
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    Twój rekomendowany pierwszy krok to <strong>Moduł 01: Podstawy HTML5</strong> (Lekcja 1:
                    Jak działa strona internetowa). Możesz rozpocząć naukę natychmiast.
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
                      className="px-4 py-3 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                      Zmień parametry planu
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleStudyPlanSubmit}
                  noValidate
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 space-y-4"
                >
                  <h3 className="text-lg font-bold text-white">
                    Odbierz harmonogram nauki i darmowy dostęp
                  </h3>

                  <div className="space-y-1.5">
                    <label htmlFor="lead-name" className="block text-xs font-medium text-slate-300">
                      Twoje imię
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="np. Aleksander"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="lead-email" className="block text-xs font-medium text-slate-300">
                      Adres e-mail
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="np. aleksander@domena.pl"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Główny cel nauki
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'job', label: 'Praca w IT' },
                        { id: 'projects', label: 'Własne aplikacje' },
                        { id: 'upskill', label: 'Awans zawodowy' },
                      ].map((goal) => (
                        <button
                          key={goal.id}
                          type="button"
                          onClick={() => setLeadGoal(goal.id as 'job' | 'projects' | 'upskill')}
                          className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap truncate ${
                            leadGoal === goal.id
                              ? 'border-indigo-500 bg-indigo-950/60 text-white'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          {goal.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formError && (
                    <p role="alert" className="text-xs font-medium text-rose-400">
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
          </div>
        </div>
      </section>
    </div>
  );
};
