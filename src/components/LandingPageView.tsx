import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  CareerTrackId,
  calculateStudyPlanEstimate,
  getLocalizedCareerTracks,
} from '../utils/landingCalculator';
import { formatCategoryLabel } from '../utils/i18n';
import {
  getLandingAnalogies,
  getLandingFaqItems,
  getLandingFlashcards,
  getLandingPlaygroundSamples,
  getLandingShowcaseProjects,
  getTechRibbonItems,
} from '../locales/landingEn';
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
import portfolioDeskImage from '../assets/images/dark_portfolio_desk_1794680585081.jpg';
import { BrandLogo } from './BrandLogo';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { GUIDES_DATA } from '../data/guidesData';
import { estimateGuideReadingMinutes } from '../utils/guides';

const FEATURED_GUIDE_SLUGS = [
  'jak-zostac-full-stack-developerem-plan-nauki',
  'javascript-event-loop-async-await-kompendium',
  'react-19-architektura-stanu-i-wydajnosc',
  'postgresql-indeksy-join-optymalizacja-zapytan',
] as const;

const HERO_DARK_STUDIO_IMAGE = heroDarkStudioImage;
const PORTFOLIO_DESK_IMAGE = portfolioDeskImage;

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

interface LandingPageViewProps {
  onOpenAuthModal: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onOpenAuthModal }) => {
  const { isAuthenticated, currentUser, setActiveTab, allModules, allLessons, language } = useApp();
  const isEn = language === 'en';

  const techRibbonItems = useMemo(() => getTechRibbonItems(language), [language]);
  const analogyExamples = useMemo(() => getLandingAnalogies(language), [language]);
  const flashcardPreview = useMemo(() => getLandingFlashcards(language), [language]);
  const playgroundSamples = useMemo(() => getLandingPlaygroundSamples(language), [language]);
  const showcaseProjects = useMemo(() => getLandingShowcaseProjects(language), [language]);
  const faqItems = useMemo(
    () => getLandingFaqItems(language, allLessons.length),
    [language, allLessons.length]
  );
  const careerTracks = useMemo(() => getLocalizedCareerTracks(language), [language]);

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
    () => playgroundSamples.find((s) => s.id === selectedSampleId) || playgroundSamples[0],
    [playgroundSamples, selectedSampleId]
  );
  const [editedSamples, setEditedSamples] = useState<Record<string, string>>({});

  // Clear untouched language defaults automatically if user switches language
  const prevLanguageRef = useRef(language);
  useEffect(() => {
    if (prevLanguageRef.current !== language) {
      prevLanguageRef.current = language;
      setEditedSamples({});
    }
  }, [language]);

  const currentCode = editedSamples[selectedSampleId] ?? activeSample.solutionCode;
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
  const [selectedProjectId, setSelectedProjectId] = useState<string>('fintech');
  const activePortfolioProject = useMemo(
    () => showcaseProjects.find((p) => p.id === selectedProjectId) || showcaseProjects[0],
    [showcaseProjects, selectedProjectId]
  );

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
    if (selectedCategory === 'Wszystkie') return allModules;
    return allModules.filter((m) => m.category === selectedCategory);
  }, [allModules, selectedCategory]);

  const totalCurriculumHours = useMemo(
    () => allModules.reduce((sum, m) => sum + m.durationHours, 0),
    [allModules]
  );

  const studyPlanEstimate = useMemo(
    () => calculateStudyPlanEstimate(totalCurriculumHours, weeklyHours, selectedTrackId, language),
    [totalCurriculumHours, weeklyHours, selectedTrackId, language]
  );

  const activeTrackSpec = careerTracks[selectedTrackId];

  const activeModule = useMemo(
    () => allModules.find((m) => m.id === expandedModuleId) || filteredModules[0] || allModules[0],
    [allModules, expandedModuleId, filteredModules]
  );

  const handlePrimaryAction = () => {
    setActiveTab('dashboard');
    if (!isAuthenticated) {
      onOpenAuthModal();
    }
  };

  const handleOpenLesson = (lessonId: string) => {
    if (isAuthenticated) {
      setActiveTab('lesson', lessonId);
    } else {
      setActiveTab('public_lesson', lessonId);
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
      setFormError(
        isEn
          ? 'Enter your name (minimum 2 characters) to generate your schedule.'
          : 'Podaj swoje imię (minimum 2 znaki), aby wygenerować harmonogram.'
      );
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setFormError(
        isEn
          ? 'Enter a valid email address (e.g., alex.morgan@example.com).'
          : 'Podaj poprawny adres e-mail (np. jan.kowalski@domena.pl).'
      );
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

  const activeAnalogy = analogyExamples[activeAnalogyIndex];
  const activeFlashcard = flashcardPreview[flashcardIndex];

  return (
    <div className="min-h-screen bg-[#06080E] text-[#F8FAFC] selection:bg-indigo-600 selection:text-white">
      {/* =====================================================================
          TOP BAR CONTRACT (Strict 3-Zone Dark Obsidian Glass Header + Scroll Progress)
      ===================================================================== */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#06080E]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-6 lg:gap-8 px-3 sm:px-8 py-3 sm:py-3.5">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollToTop();
            }}
            aria-label={isEn ? 'Full Stack Academy — Back to top' : 'Full Stack Academy — Powrót na górę strony'}
            className="whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-0.5 sm:p-1"
          >
            <span className="sm:hidden">
              <BrandLogo compact />
            </span>
            <span className="hidden sm:inline">
              <BrandLogo />
            </span>
          </a>

          <nav
            aria-label={isEn ? 'Landing navigation' : 'Nawigacja strony głównej'}
            className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-[#94A3B8]"
          >
            <button
              type="button"
              onClick={() => scrollToSection('metoda-nauki')}
              className="hover:text-[#F8FAFC] hover:underline underline-offset-8 decoration-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              {isEn ? 'Method' : 'Metoda nauki'}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('program-kursu')}
              className="hover:text-[#F8FAFC] hover:underline underline-offset-8 decoration-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              {isEn ? 'Curriculum' : 'Program'}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('projekty-portfolio')}
              className="hover:text-[#F8FAFC] hover:underline underline-offset-8 decoration-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              {isEn ? 'Projects' : 'Projekty'}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('plany-dostepu')}
              className="hover:text-[#F8FAFC] hover:underline underline-offset-8 decoration-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              {isEn ? 'Free Access' : 'Darmowy dostęp'}
            </button>
            <a
              href="/poradniki"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                setActiveTab('guides');
              }}
              className="text-indigo-300 hover:text-white hover:underline underline-offset-8 decoration-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              {isEn ? 'Guides' : 'Poradniki'}
            </a>
            <a
              href="/baza-wiedzy"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                setActiveTab('knowledge_base');
              }}
              className="hover:text-[#F8FAFC] hover:underline underline-offset-8 decoration-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              {isEn ? 'Knowledge Base' : 'Baza wiedzy'}
            </a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <LanguageToggle variant="compact" />
            <ThemeToggle variant="compact" />
            <button
              type="button"
              onClick={handlePrimaryAction}
              data-testid="landing-top-cta"
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              {isAuthenticated ? (
                <>
                  <span className="hidden sm:inline">{isEn ? 'Dashboard →' : 'Pulpit Kursanta →'}</span>
                  <span className="sm:hidden">{isEn ? 'Dashboard →' : 'Pulpit →'}</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">{isEn ? 'Start Free →' : 'Rozpocznij za darmo →'}</span>
                  <span className="sm:hidden">{isEn ? 'Start →' : 'Start 0 zł →'}</span>
                </>
              )}
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
                  <span className="font-semibold text-indigo-400">
                    {isEn ? 'Full Stack Coding Academy' : 'Polska Akademia Kodowania'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{isEn ? 'Zero to Hero for 0 PLN' : 'Start od zera za 0 zł'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{isEn ? 'No setup needed' : 'Bez instalacji'}</span>
                </div>

                <h1
                  style={{
                    textWrap: 'balance',
                    fontSize: 'clamp(2.35rem, 3.85vw, 3.6rem)',
                    animationDelay: '70ms',
                  }}
                  className="animate-fsda-fade-up font-display font-extrabold tracking-tight text-[#F8FAFC] leading-[1.06]"
                >
                  {isEn
                    ? 'Start writing code today. Become a Full Stack Developer.'
                    : 'Zacznij pisać kod dziś. Zostań Full Stack Developerem.'}
                </h1>

                <p
                  className="animate-fsda-fade-up text-base text-[#CBD5E1] leading-relaxed tracking-[0.01em]"
                  style={{ animationDelay: '140ms' }}
                >
                  {isEn
                    ? 'Hands-on engineering workshops instead of endless passive video lectures. Every lesson opens with an everyday life analogy and an 80% pre-built scaffold ready to run straight in your browser.'
                    : 'Praktyczny warsztat inżynierski zamiast wielogodzinnych wykładów wideo. Każdą lekcję zaczynasz od analogii z życia i gotowego w 80% kodu, który uruchamiasz od razu w przeglądarce.'}
                </p>

                <div
                  className="animate-fsda-fade-up pt-5 border-t border-white/[0.08] space-y-3 text-xs text-[#CBD5E1]"
                  style={{ animationDelay: '200ms' }}
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? 'Gentle onboarding — zero jargon upfront and a plain-language glossary inside every lesson'
                        : 'Łagodny próg wejścia — zero żargonu na starcie, słowniczek w każdej lekcji'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? '6 interactive simulators (Bash & Git Terminal, SQL JOIN Studio, REST API, JS Event Loop)'
                        : '6 symulatorów (Terminal Bash & Git, SQL JOIN, REST API, Event Loop JS)'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? '12 commercial applications with acceptance checklists ready for your GitHub portfolio'
                        : '12 aplikacji biznesowych z kryteriami akceptacyjnymi gotowych do GitHuba'}
                    </span>
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
                        ? isEn
                          ? `Continue learning (${currentUser.name.split(' ')[0]})`
                          : `Przejdź do nauki (${currentUser.name.split(' ')[0]})`
                        : isEn
                        ? 'Launch Learning App'
                        : 'Uruchom Aplikację do nauki'}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection('program-kursu')}
                    className="px-5 py-3.5 text-sm font-semibold text-[#CBD5E1] hover:text-[#F8FAFC] bg-[#0B101B] border border-white/15 hover:border-white/30 rounded-xl transition-all whitespace-nowrap shrink-0"
                  >
                    {isEn ? `Explore ${allModules.length} modules` : `Zobacz ${allModules.length} modułów`}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#94A3B8]">
                  <span>fsda.tech</span>
                  <span aria-hidden="true">·</span>
                  <a
                    href="/baza-wiedzy"
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                      e.preventDefault();
                      setActiveTab('knowledge_base');
                    }}
                    className="font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                  >
                    {isEn ? 'Open Knowledge Base (96 free lessons)' : 'Otwarta Baza Wiedzy (96 lekcji bez logowania)'}
                  </a>
                  <span aria-hidden="true">·</span>
                  <span>{isEn ? 'No credit card required' : 'Bez karty płatniczej'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Kinetic Obsidian Live Interactive IDE */}
            <div
              className="animate-fsda-fade-up lg:col-span-7 flex flex-col"
              style={{ animationDelay: '150ms' }}
            >
              <div className="fsda-keep-dark flex-1 flex flex-col rounded-2xl border border-white/10 bg-[#0B101B] text-[#E2E8F0] overflow-hidden shadow-2xl">
                {/* Single-Row Top IDE Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] bg-[#070A12] px-4 py-2.5">
                  <div className="flex items-center gap-1 p-1 bg-[#111827] rounded-lg border border-white/[0.06]">
                    {playgroundSamples.map((sample) => (
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

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowBeginnerHint((prev) => !prev)}
                      className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                        showBeginnerHint
                          ? 'border-amber-500/50 bg-amber-950/50 text-amber-300'
                          : 'border-white/10 text-[#CBD5E1] hover:text-white'
                      }`}
                    >
                      <HelpCircle className="h-3 w-3 shrink-0" />
                      <span>{isEn ? 'Hint' : 'Podpowiedź'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditedSamples((prev) => ({
                          ...prev,
                          [selectedSampleId]: activeSample.starterCode,
                        }));
                        setScanTrigger((n) => n + 1);
                      }}
                      className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-medium text-[#CBD5E1] hover:text-white border border-white/10 rounded-md transition-colors whitespace-nowrap shrink-0"
                      title={isEn ? 'Restore 80% starter scaffold' : 'Przywróć szablon początkowy 80%'}
                    >
                      <RotateCcw className="h-3 w-3 shrink-0" />
                      <span>{isEn ? '80% Scaffold' : 'Szablon 80%'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditedSamples((prev) => ({
                          ...prev,
                          [selectedSampleId]: activeSample.solutionCode,
                        }));
                        setScanTrigger((n) => n + 1);
                      }}
                      className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-medium text-indigo-300 hover:text-white bg-indigo-950/60 border border-indigo-500/40 rounded-md transition-colors whitespace-nowrap shrink-0"
                    >
                      <Play className="h-3 w-3 shrink-0" />
                      <span>{isEn ? 'Solution' : 'Wzorzec'}</span>
                    </button>
                  </div>
                </div>

                {/* Task & Analogy Header */}
                <div className="border-b border-white/[0.08] bg-[#0F1624] px-4 py-3 space-y-1">
                  <p className="text-xs font-semibold text-[#F8FAFC]">
                    {isEn ? 'Sample challenge:' : 'Zadanie próbne:'} {activeSample.taskTitle}
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    {isEn ? 'Analogy:' : 'Analogia:'} {activeSample.analogy}
                  </p>
                  {showBeginnerHint && (
                    <p className="animate-fsda-card-enter text-xs text-amber-300 pt-1.5 mt-1 border-t border-white/[0.08]">
                      {isEn ? 'Tip:' : 'Wskazówka:'} {activeSample.beginnerHint}
                    </p>
                  )}
                </div>

                {/* Editable Code + Live Visual Result Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] flex-1">
                  {/* Code Editor Pane with Line Numbers */}
                  <div className="flex flex-col p-4 bg-[#0B101B]">
                    <div className="flex items-center justify-between text-[11px] text-[#94A3B8] mb-2">
                      <span>{isEn ? 'Code editor (editable)' : 'Edytor kodu (możesz pisać)'}</span>
                      <span className="font-mono tabular-nums">
                        {codeLines.length} {isEn ? 'lines' : 'linii'}
                      </span>
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
                          setEditedSamples((prev) => ({
                            ...prev,
                            [selectedSampleId]: e.target.value,
                          }))
                        }
                        aria-label={isEn ? 'Interactive homepage code editor' : 'Interaktywny edytor kodu na stronie głównej'}
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
                        <span>{isEn ? 'Live output' : 'Wynik na żywo'}</span>
                        <span
                          className={`font-mono tabular-nums font-semibold whitespace-nowrap shrink-0 transition-colors duration-200 ${
                            isRulePassed ? 'text-emerald-400' : 'text-[#CBD5E1]'
                          }`}
                        >
                          {isRulePassed
                            ? isEn
                              ? 'Passed (+150 XP)'
                              : 'Zaliczono (+150 XP)'
                            : isEn
                            ? 'Editing...'
                            : 'W trakcie edycji'}
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
                            <p className="text-[11px] text-indigo-400 font-medium">
                              {isEn ? 'Software Engineer' : 'Inżynier IT'}
                            </p>
                            <p className="text-base font-bold text-[#F8FAFC]">
                              {(currentCode.match(/<h1>([\s\S]*?)<\/h1>/i)?.[1] || '').trim() ||
                                (isEn ? 'No text inside <h1>...' : 'Brak tekstu w <h1>...')}
                            </p>
                            <p className="text-xs text-[#94A3B8]">React &amp; TypeScript</p>
                            {/<button[^>]*>([\s\S]*?)<\/button>/i.test(currentCode) && (
                              <span className="inline-block mt-1 px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-md">
                                {(currentCode.match(/<button[^>]*>([\s\S]*?)<\/button>/i)?.[1] || (isEn ? 'Button' : 'Przycisk')).trim()}
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
                              <p className="text-xs font-bold text-[#F8FAFC]">
                                {isEn ? 'Full Stack Bundle' : 'Pakiet Full Stack'}
                              </p>
                              <p className="text-[11px] text-[#94A3B8]">
                                {isRulePassed
                                  ? isEn
                                    ? 'Flexbox Layout (Row)'
                                    : 'Układ Flexbox (Wiersz)'
                                  : isEn
                                  ? 'Block Layout (Column)'
                                  : 'Układ Block (Kolumna)'}
                              </p>
                            </div>
                            <span className="inline-block px-2.5 py-1 text-xs font-mono tabular-nums font-semibold bg-indigo-600 text-white rounded whitespace-nowrap shrink-0">
                              {isEn ? '100% Ready' : '100% Gotowy'}
                            </span>
                          </div>
                        )}

                        {selectedSampleId === 'js' && (
                          <div className="relative space-y-2 font-mono text-xs">
                            <div className="text-[#94A3B8]">
                              {isEn ? 'Input:' : 'Wejście:'}{' '}
                              <span className="text-[#CBD5E1] tabular-nums">1250 XP + 150 XP</span>
                            </div>
                            <div className="text-sm font-bold text-[#F8FAFC] tabular-nums">
                              {isEn ? 'Result:' : 'Wynik:'}{' '}
                              <span className={isRulePassed ? 'text-emerald-400' : 'text-amber-400'}>
                                {isRulePassed
                                  ? isEn
                                    ? '1400 XP (Passed)'
                                    : '1400 XP (Poprawnie)'
                                  : isEn
                                  ? '0 XP (Complete return)'
                                  : '0 XP (Uzupełnij return)'}
                              </span>
                            </div>
                          </div>
                        )}

                        {selectedSampleId === 'sql' && (
                          <div className="relative space-y-1.5 font-mono text-[11px]">
                            <div className="grid grid-cols-3 text-[#94A3B8] border-b border-white/[0.08] pb-1">
                              <span>{isEn ? 'name' : 'imie'}</span>
                              <span>{isEn ? 'role' : 'rola'}</span>
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
                                {isEn
                                  ? 'Add WHERE level > 5 and ORDER BY xp DESC.'
                                  : 'Dodaj WHERE level > 5 oraz ORDER BY xp DESC.'}
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
                      <a
                        href={`/baza-wiedzy/${encodeURIComponent(activeSample.lessonRef)}`}
                        onClick={(e) => {
                          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                          e.preventDefault();
                          handleOpenLesson(activeSample.lessonRef);
                        }}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 whitespace-nowrap shrink-0 transition-colors"
                      >
                        {isEn ? 'Open lesson →' : 'Otwórz lekcję →'}
                      </a>
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
                {allModules.length} {isEn ? 'modules' : 'modułów'}
              </p>
              <p className="mt-1.5 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {isEn
                  ? 'Full learning roadmap from HTML5 and CSS through React 19, Node.js, and SQL up to Docker.'
                  : 'Kompletna ścieżka od podstaw HTML5 i CSS przez React 19, Node.js i SQL aż po Docker.'}
              </p>
            </div>
            <div className="lg:px-8">
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tabular-nums">
                {allLessons.length} {isEn ? 'lessons' : 'lekcji'}
              </p>
              <p className="mt-1.5 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {isEn
                  ? 'Everyday analogy, jargon-free glossary, 80% code scaffold, and knowledge check quiz.'
                  : 'Prosta analogia, słowniczek bez żargonu, gotowy szablon 80% oraz quiz sprawdzający.'}
              </p>
            </div>
            <div className="lg:px-8">
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tabular-nums">
                12 {isEn ? 'projects' : 'projektów'}
              </p>
              <p className="mt-1.5 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {isEn
                  ? 'Real commercial apps with acceptance checklists ready to showcase to recruiters.'
                  : 'Realne aplikacje biznesowe z kryteriami akceptacyjnymi gotowe do pokazania rekruterowi.'}
              </p>
            </div>
            <div className="lg:pl-8">
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tabular-nums">
                6 {isEn ? 'simulators' : 'symulatorów'}
              </p>
              <p className="mt-1.5 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {isEn
                  ? 'Bash/Git Terminal, SQL Studio, REST API Client, JS Event Loop, and Live Coding prep.'
                  : 'Terminal Bash/Git, Studio SQL, Klient REST API, Event Loop JS i egzamin Live Coding.'}
              </p>
            </div>
          </div>
        </div>

        {/* Continuous Kinetic Technology Ribbon */}
        <div
          aria-label={isEn ? 'Technologies covered in the academy curriculum' : 'Technologie w programie akademii'}
          className="mt-12 border-t border-white/[0.06] bg-[#04060B] py-4 overflow-hidden select-none"
        >
          <div className="animate-fsda-marquee flex items-center gap-10 text-xs font-mono text-[#64748B] whitespace-nowrap">
            {[...techRibbonItems, ...techRibbonItems].map((tech, idx) => (
              <span key={`${tech}-${idx}`} className="inline-flex items-center gap-10 shrink-0">
                <span className="hover:text-[#CBD5E1] transition-colors">{tech}</span>
                <span aria-hidden="true" className="text-indigo-500/40">/</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. ASYMMETRIC INTERACTIVE BENTO STUDIO ("Method & Tools")
             Breaks monotonous equal columns with dynamic col-spans & micro-interactions
      ===================================================================== */}
      <section id="metoda-nauki" className="bg-[#090D16] py-20 lg:py-24 border-b border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-12">
          <RevealBlock className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-[#94A3B8]">
                <span className="font-semibold text-indigo-400">
                  {isEn ? 'Scaffolding Method & Simulators' : 'Metoda Rusztowania i Symulatory'}
                </span>
                <span aria-hidden="true">·</span>
                <span>{isEn ? 'Built for complete beginners' : 'Zaprojektowane dla startujących od zera'}</span>
              </div>
              <h2
                style={{ textWrap: 'balance' }}
                className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]"
              >
                {isEn
                  ? 'Learning where you never stare at a blank screen.'
                  : 'Nauka, w której nie patrzysz na pusty ekran.'}
              </h2>
            </div>
            <p className="text-sm text-[#94A3B8] max-w-md leading-relaxed">
              {isEn
                ? `Each of the ${allLessons.length} lessons combines three elements: a real-life analogy, an 80% ready code scaffold, and a built-in simulator for instant execution.`
                : `Każda z ${allLessons.length} lekcji łączy trzy elementy: analogię z życia, gotowy w 80% szkielet kodu oraz wbudowany symulator do natychmiastowego uruchomienia.`}
            </p>
          </RevealBlock>

          {/* Row 1 of Asymmetric Bento: 7 cols Dark Studio Photo + Interactive Diff / 5 cols Pointer-Spotlight Simulators */}
          <RevealBlock delayMs={80} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Tile 1 (col-span-7): Moody Architectural Studio + Interactive 80% Scaffold Toggle */}
            <div className="fsda-keep-dark lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0B101B] overflow-hidden flex flex-col justify-between">
              <div className="relative">
                <EditorialImage
                  src={HERO_DARK_STUDIO_IMAGE}
                  alt={
                    isEn
                      ? 'Evening developer desk in a minimalist studio with a laptop displaying TypeScript and React code'
                      : 'Wieczorne biurko programisty w minimalistycznym studiu z laptopem prezentującym kod TypeScript i React'
                  }
                  aspectClass="aspect-[16/9]"
                  fallbackTitle={isEn ? 'Full Stack Academy Environment' : 'Środowisko Full Stack Academy'}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0B101B] via-[#0B101B]/45 to-transparent"
                />
                <div className="absolute bottom-4 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-indigo-300">
                      {isEn ? '01. 80% Scaffolding Method' : '01. Metodyka Rusztowania 80%'}
                    </p>
                    <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#F8FAFC] mt-0.5">
                      {isEn ? 'You always start from a working base' : 'Zawsze zaczynasz od działającej bazy'}
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
                      {isEn ? '80% Template' : 'Szablon 80%'}
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
                      {isEn ? 'After adding 1 line' : 'Po dopisaniu 2 linii'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Animated Scaffold Diff Strip */}
              <div
                key={`${scaffoldStep}-${language}`}
                className="animate-fsda-card-enter p-5 border-t border-white/[0.08] bg-[#080C15] font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {scaffoldStep === 'before' ? (
                  <>
                    <div className="space-y-1 text-[#94A3B8]">
                      <div className="text-[#CBD5E1]">
                        {isEn
                          ? 'const student = await db.users.findFirst();'
                          : 'const kursant = await db.users.findFirst();'}
                      </div>
                      <div className="text-amber-300">
                        {isEn
                          ? '// TODO: Return JSON payload with HTTP 200 status'
                          : '// TODO: Zwróć dane JSON ze statusem 200'}
                      </div>
                    </div>
                    <span className="text-[11px] font-sans font-semibold text-amber-300 whitespace-nowrap shrink-0">
                      {isEn
                        ? 'Scaffold ready — you write just 1 line'
                        : 'Szkielet gotowy — wpisujesz tylko 1 linię'}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="text-[#94A3B8]">
                        {isEn
                          ? 'const student = await db.users.findFirst();'
                          : 'const kursant = await db.users.findFirst();'}
                      </div>
                      <div className="text-emerald-300">
                        {isEn
                          ? '+ return res.status(200).json(student);'
                          : '+ return res.status(200).json(kursant);'}
                      </div>
                    </div>
                    <span className="text-[11px] font-sans font-semibold text-emerald-400 whitespace-nowrap shrink-0">
                      {isEn ? 'Test passed — move forward' : 'Test zaliczony — przechodzisz dalej'}
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
                <p className="text-xs font-semibold text-indigo-400">
                  {isEn ? '02. Hands-On Environments' : '02. Środowiska Praktyczne'}
                </p>
                <h3 className="font-display text-xl font-extrabold text-[#F8FAFC]">
                  {isEn ? '4 simulators with zero setup' : '4 symulatory bez żadnej instalacji'}
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  {isEn
                    ? 'Practice real database queries, Git commands, HTTP requests, and JS async flows directly inside your browser tab.'
                    : 'Ćwiczysz prawdziwe zapytania bazodanowe, komendy Git, żądania HTTP oraz asynchroniczność JS bezpośrednio w karcie przeglądarki.'}
                </p>
              </div>

              <div className="relative space-y-2.5 my-5">
                {[
                  {
                    tab: 'sql_studio' as const,
                    icon: Database,
                    title: isEn ? 'SQL Database Studio (JOIN)' : 'Studio Bazy SQL (JOIN)',
                    sub: isEn
                      ? 'Visual relational tables and live SELECT queries'
                      : 'Wizualne tabele relacyjne i live SELECT',
                  },
                  {
                    tab: 'terminal' as const,
                    icon: Terminal,
                    title: isEn ? 'Bash & Git Terminal' : 'Terminal Bash & Git',
                    sub: isEn
                      ? 'Safe commit, branch, and merge practice'
                      : 'Bezpieczne ćwiczenia commit, branch i merge',
                  },
                  {
                    tab: 'api_studio' as const,
                    icon: Send,
                    title: isEn ? 'REST API & JSON Studio' : 'Studio REST API & JSON',
                    sub: isEn
                      ? 'Test GET / POST requests with Auth headers'
                      : 'Testowanie GET / POST z nagłówkami Auth',
                  },
                  {
                    tab: 'event_loop' as const,
                    icon: Cpu,
                    title: isEn ? 'Event Loop Visualizer' : 'Wizualizator Event Loop',
                    sub: isEn
                      ? 'Animated Call Stack, Microtasks & Callback Queue'
                      : 'Animacja Call Stack, Microtasks i Callback Queue',
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
                  <p className="text-xs font-semibold text-indigo-400">
                    {isEn ? '03. Plain-English Glossary' : '03. Słownik Ludzkim Językiem'}
                  </p>
                  <div className="flex items-center gap-1">
                    {analogyExamples.map((item, idx) => (
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

              <div key={`${activeAnalogy.id}-${language}`} className="animate-fsda-card-enter space-y-3">
                <div className="text-xs text-[#94A3B8] leading-relaxed">
                  <span className="font-semibold text-[#64748B]">
                    {isEn ? 'Raw definition: ' : 'Surowa definicja: '}
                  </span>
                  {activeAnalogy.jargon}
                </div>
                <div className="pt-3 border-t border-white/[0.08]">
                  <p className="text-xs font-semibold text-emerald-400 mb-1">
                    {isEn ? 'Our analogy: ' : 'Nasza analogia: '}
                    {activeAnalogy.analogyTitle}
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
                <p className="text-xs font-semibold text-indigo-400">
                  {isEn ? '04. SM-2 Flashcards On the Go' : '04. Fiszki SM-2 w drodze'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFlashcardFlipped(false);
                    setFlashcardIndex((prev) => (prev + 1) % flashcardPreview.length);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>{isEn ? 'Next' : 'Następna'}</span>
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
                    {flashcardFlipped
                      ? isEn
                        ? 'Answer'
                        : 'Odpowiedź'
                      : isEn
                      ? 'Question · click'
                      : 'Pytanie · kliknij'}
                  </span>
                </div>
                <p
                  key={`${flashcardIndex}-${flashcardFlipped ? 'ans' : 'q'}-${language}`}
                  className="animate-fsda-card-enter text-xs sm:text-sm font-medium text-[#F8FAFC] leading-relaxed my-3"
                >
                  {flashcardFlipped ? activeFlashcard.answer : activeFlashcard.question}
                </p>
                <span className="text-[11px] font-semibold text-indigo-300">
                  {flashcardFlipped
                    ? isEn
                      ? '← Click to return to question'
                      : '← Kliknij, aby wrócić do pytania'
                    : isEn
                    ? 'Click to flip card →'
                    : 'Kliknij, aby obrócić kartę →'}
                </span>
              </button>
            </div>

            {/* Tile 5 (col-span-3): Stress-Free Practice Metric Ring */}
            <div className="md:col-span-3 rounded-2xl border border-white/[0.08] bg-[#0B101B] p-6 flex flex-col justify-between space-y-4">
              <p className="text-xs font-semibold text-indigo-400">
                {isEn ? '05. Error-Friendly Zone' : '05. Bez stresu o błędy'}
              </p>

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
                    {isEn ? '0 penalties' : '0 kar'}
                  </p>
                  <p className="text-xs text-emerald-400 font-semibold">
                    {isEn ? 'in the lesson editor' : 'w edytorze lekcji'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {isEn
                  ? 'You can test, break, and fix your code as many times as you like. The 5 energy hearts apply only to checkpoint quizzes.'
                  : 'Możesz testować, psuć i poprawiać swój kod dowolną liczbę razy. 5 serc energii dotyczy wyłącznie quizów sprawdzających.'}
              </p>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* =====================================================================
          3. VERTICAL MILESTONE TIMELINE & STICKY DARK INSPECTOR ("Curriculum")
             Breaks the boxed-list look with an architectural spine + live inspector
      ===================================================================== */}
      <section id="program-kursu" className="bg-[#06080E] py-20 lg:py-24 border-b border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-10">
          <RevealBlock className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-[#94A3B8]">
                <span className="font-semibold text-indigo-400">
                  {isEn ? 'Complete Syllabus' : 'Kompletny Sylabus'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {isEn
                    ? `${allModules.length} modules · ${allLessons.length} lessons · ${totalCurriculumHours}h of content`
                    : `${allModules.length} modułów · ${allLessons.length} lekcji · ${totalCurriculumHours}h materiału`}
                </span>
              </div>
              <h2
                style={{ textWrap: 'balance' }}
                className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]"
              >
                {isEn
                  ? 'A clear path from your very first HTML tag to the cloud.'
                  : 'Przejrzysta ścieżka od pierwszego znacznika do chmury.'}
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
                        ? allModules[0]
                        : allModules.find((m) => m.category === cat);
                    if (firstInCat) setExpandedModuleId(firstInCat.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.04]'
                  }`}
                >
                  {formatCategoryLabel(cat, language)}
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
                          {isEn ? 'Module' : 'Moduł'} {String(mod.id).padStart(2, '0')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{mod.displayCategory}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {mod.lessons.length} {isEn ? 'lessons' : 'lekcji'}
                        </span>
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
              key={`${activeModule.id}-${language}`}
              className="animate-fsda-card-enter lg:col-span-5 lg:sticky lg:top-24 rounded-2xl border border-white/10 bg-[#0B101B] p-6 sm:p-7 space-y-5"
            >
              <div className="space-y-2 border-b border-white/[0.08] pb-4">
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span className="font-semibold text-indigo-400">
                    {isEn ? 'Module' : 'Moduł'} {String(activeModule.id).padStart(2, '0')} ·{' '}
                    {activeModule.displayCategory}
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
                  {isEn
                    ? `Lessons in this module (${activeModule.lessons.length}):`
                    : `Lekcje w tym module (${activeModule.lessons.length}):`}
                </p>
                <div className="divide-y divide-white/[0.06] max-h-72 overflow-y-auto pr-1">
                  {activeModule.lessons.map((lesson, idx) => (
                    <a
                      key={lesson.id}
                      href={`/baza-wiedzy/${encodeURIComponent(lesson.id)}`}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                        e.preventDefault();
                        setActiveTab('public_lesson', lesson.id);
                      }}
                      className="flex items-start justify-between gap-3 py-2 text-xs hover:text-indigo-300 transition-colors group"
                    >
                      <span className="text-[#CBD5E1] group-hover:text-indigo-300 leading-snug">
                        <span className="font-mono tabular-nums text-[#64748B] mr-2">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        {lesson.title}
                      </span>
                      <span className="font-mono tabular-nums text-[#94A3B8] shrink-0">
                        {lesson.durationMinutes} min
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`/baza-wiedzy/${encodeURIComponent(activeModule.lessons[0]?.id || 'html-7')}`}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    setActiveTab('public_lesson', activeModule.lessons[0]?.id || 'html-7');
                  }}
                  className="text-xs font-semibold text-indigo-300 hover:text-indigo-200 underline underline-offset-4 whitespace-nowrap"
                >
                  {isEn ? 'Read free without signing up →' : 'Czytaj za darmo bez logowania →'}
                </a>
                <button
                  type="button"
                  onClick={() => handleOpenLesson(activeModule.lessons[0]?.id || 'html-7')}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors whitespace-nowrap shrink-0"
                >
                  {isEn ? 'Practice in editor →' : 'Ćwicz w edytorze →'}
                </button>
              </div>
            </div>
          </div>

          {/* Public Open Knowledge Base Featured Articles (Un-gated SEO & Reader Access) */}
          <RevealBlock delayMs={80} className="pt-12 border-t border-white/[0.08] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-indigo-400">
                  {isEn
                    ? 'Open Knowledge Base · Access without sign-in'
                    : 'Otwarta Baza Wiedzy · Dostęp bez logowania'}
                </p>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#F8FAFC]">
                  {isEn
                    ? 'Read selected lessons and guides right here'
                    : 'Przeczytaj wybrane lekcje i poradniki od razu tutaj'}
                </h3>
              </div>
              <a
                href="/baza-wiedzy"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  e.preventDefault();
                  setActiveTab('knowledge_base');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-300 hover:text-white border border-indigo-500/40 bg-indigo-950/40 rounded-xl transition-colors whitespace-nowrap shrink-0 self-start"
              >
                <span>
                  {isEn
                    ? `All ${allLessons.length} free lessons`
                    : `Wszystkie ${allLessons.length} darmowych lekcji`}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {['html-7', 'css-2', 'js-1', 'react-1', 'node-1', 'db-1']
                .map((id) => allLessons.find((l) => l.id === id))
                .filter((l): l is NonNullable<typeof l> => Boolean(l))
                .map((lesson) => (
                  <article
                    key={lesson.id}
                    className="group rounded-2xl border border-white/[0.08] bg-[#0B101B] hover:border-indigo-500/50 p-5 flex flex-col justify-between gap-4 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                        <span className="text-indigo-400 font-semibold font-sans">
                          {isEn ? 'Module' : 'Moduł'} {String(lesson.moduleId).padStart(2, '0')}
                        </span>
                        <span className="tabular-nums">~{lesson.durationMinutes} min</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-[#F8FAFC] leading-snug group-hover:text-indigo-300 transition-colors">
                        <a
                          href={`/baza-wiedzy/${encodeURIComponent(lesson.id)}`}
                          onClick={(e) => {
                            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
                              return;
                            e.preventDefault();
                            setActiveTab('public_lesson', lesson.id);
                          }}
                        >
                          {lesson.title}
                        </a>
                      </h4>
                      <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                        {lesson.summary}
                      </p>
                    </div>
                    <a
                      href={`/baza-wiedzy/${encodeURIComponent(lesson.id)}`}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
                          return;
                        e.preventDefault();
                        setActiveTab('public_lesson', lesson.id);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300"
                    >
                      <span>
                        {isEn ? 'Read article & code examples' : 'Czytaj artykuł i przykłady kodu'}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </article>
                ))}
            </div>
          </RevealBlock>

          {/* Deep Engineering Guides Showcase (/poradniki) */}
          <RevealBlock delayMs={100} className="pt-12 border-t border-white/[0.08] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-indigo-400">
                  {isEn
                    ? `Editorial Guides · ${GUIDES_DATA.length} long-form articles · No sign-in required`
                    : `Poradniki Eksperckie · ${GUIDES_DATA.length} długich artykułów · Bez logowania`}
                </p>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#F8FAFC]">
                  {isEn
                    ? 'In-depth engineering guides with production code'
                    : 'Pogłębione poradniki inżynierskie z kodem produkcyjnym'}
                </h3>
              </div>
              <a
                href="/poradniki"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  e.preventDefault();
                  setActiveTab('guides');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-300 hover:text-white border border-indigo-500/40 bg-indigo-950/40 rounded-xl transition-colors whitespace-nowrap shrink-0 self-start"
              >
                <span>
                  {isEn
                    ? `All ${GUIDES_DATA.length} engineering guides`
                    : `Wszystkie ${GUIDES_DATA.length} poradników`}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {FEATURED_GUIDE_SLUGS.map((slug) => GUIDES_DATA.find((g) => g.slug === slug))
                .filter((g): g is NonNullable<typeof g> => Boolean(g))
                .map((guide) => {
                  const readMins = estimateGuideReadingMinutes(guide);
                  return (
                    <article
                      key={guide.slug}
                      className="group rounded-2xl border border-white/[0.08] bg-[#0B101B] hover:border-indigo-500/50 p-6 flex flex-col justify-between gap-4 transition-all"
                    >
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#94A3B8]">
                          <span className="font-semibold text-indigo-400">
                            {isEn ? guide.categoryEn : guide.category}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{readMins} min</span>
                          <span aria-hidden="true">·</span>
                          <span>{isEn ? guide.levelEn : guide.level}</span>
                        </div>
                        <h4 className="font-display text-base sm:text-lg font-bold text-[#F8FAFC] leading-snug group-hover:text-indigo-300 transition-colors">
                          <a
                            href={`/poradniki/${encodeURIComponent(guide.slug)}`}
                            onClick={(e) => {
                              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
                                return;
                              e.preventDefault();
                              setActiveTab('guide_detail', guide.slug);
                            }}
                          >
                            {isEn ? guide.titleEn : guide.title}
                          </a>
                        </h4>
                        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed line-clamp-3">
                          {isEn ? guide.subtitleEn : guide.subtitle}
                        </p>
                      </div>
                      <a
                        href={`/poradniki/${encodeURIComponent(guide.slug)}`}
                        onClick={(e) => {
                          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
                            return;
                          e.preventDefault();
                          setActiveTab('guide_detail', guide.slug);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300"
                      >
                        <span>{isEn ? 'Read full guide' : 'Czytaj pełny poradnik'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </article>
                  );
                })}
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* =====================================================================
          4. ARCHITECTURE BLUEPRINT STAGE & ASYMMETRIC GRADUATE SPOTLIGHT
      ===================================================================== */}
      <section id="projekty-portfolio" className="bg-[#090D16] py-20 lg:py-24 border-b border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          {/* Interactive Architecture Stage */}
          <RevealBlock className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-[#94A3B8]">
                  <span className="font-semibold text-indigo-400">
                    {isEn ? 'GitHub Engineering Portfolio' : 'Portfolio Inżynierskie GitHub'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {isEn ? '12 apps with real business criteria' : '12 aplikacji z kryteriami biznesowymi'}
                  </span>
                </div>
                <h2
                  style={{ textWrap: 'balance' }}
                  className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]"
                >
                  {isEn
                    ? 'Projects that genuinely convince engineering recruiters.'
                    : 'Projekty, które realnie przekonują rekruterów.'}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-xl border border-white/[0.08] bg-[#0B101B]">
                {showcaseProjects.map((proj) => (
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
              key={`${activePortfolioProject.id}-${language}`}
              className="animate-fsda-card-enter rounded-2xl border border-white/10 bg-[#0B101B] p-6 sm:p-8 space-y-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8]">
                    <span className="font-semibold text-indigo-400">
                      {isEn
                        ? `Project ${activePortfolioProject.index} of 12`
                        : `Projekt ${activePortfolioProject.index} z 12`}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{activePortfolioProject.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      ~{activePortfolioProject.estimatedHours}h {isEn ? 'practice' : 'praktyki'}
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
                  <span>{isEn ? 'Open in Project Studio' : 'Otwórz w Studio Projektów'}</span>
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
                        <span>{isEn ? `Layer 0${idx + 1}` : `Warstwa 0${idx + 1}`}</span>
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
                    <span>
                      {isEn
                        ? 'Acceptance criteria in Project Studio:'
                        : 'Kryteria zaliczenia w Studio Projektów:'}
                    </span>
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
                  <span className="font-semibold text-indigo-400">
                    {isEn ? 'Study Path Calculator' : 'Kalkulator Ścieżki Nauki'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{isEn ? 'EU & Poland market data 2026' : 'Dane rynkowe Polska 2026'}</span>
                </div>
                <h2
                  style={{ textWrap: 'balance' }}
                  className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]"
                >
                  {isEn
                    ? 'Calculate when you will finish the program at your own pace.'
                    : 'Policz, kiedy skończysz program w swoim tempie.'}
                </h2>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  {isEn
                    ? 'Pick a specialization and weekly study hours to see exact milestones and compare market compensation ranges.'
                    : 'Wybierz specjalizację oraz liczbę godzin w tygodniu, aby zobaczyć dokładne kamienie milowe i porównanie rynkowych widełek wynagrodzeń.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(Object.keys(careerTracks) as CareerTrackId[]).map((trackKey) => {
                  const spec = careerTracks[trackKey];
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
                    {isEn ? 'Your weekly study time:' : 'Twój czas na naukę w tygodniu:'}
                  </label>
                  <span className="font-mono tabular-nums text-base font-extrabold text-indigo-400">
                    {isEn ? `${weeklyHours} hrs / week` : `${weeklyHours} godz. / tydzień`}
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
                  <span>{isEn ? '3h (Steady)' : '3h (Spokojnie)'}</span>
                  <span>{isEn ? '10h (Optimal)' : '10h (Optymalnie)'}</span>
                  <span>{isEn ? '25h (Intensive)' : '25h (Intensywnie)'}</span>
                </div>

                <div className="pt-4 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-[11px] text-[#94A3B8]">
                      {isEn ? 'Time to certificate' : 'Czas do certyfikatu'}
                    </p>
                    <p className="text-base sm:text-lg font-extrabold text-[#F8FAFC] font-mono tabular-nums">
                      {isEn
                        ? `~${studyPlanEstimate.estimatedWeeks} wks (${studyPlanEstimate.estimatedMonths} mos)`
                        : `~${studyPlanEstimate.estimatedWeeks} tyg. (${studyPlanEstimate.estimatedMonths} mies.)`}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#94A3B8]">
                      {isEn ? 'Daily study dose' : 'Dzienna dawka nauki'}
                    </p>
                    <p className="text-base sm:text-lg font-extrabold text-emerald-400 font-mono tabular-nums">
                      ~{studyPlanEstimate.dailyMinutes} {isEn ? 'min / day' : 'min / dzień'}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-[11px] text-[#94A3B8]">
                      {isEn ? 'Mid / Regular range' : 'Widełki Mid / Regular'}
                    </p>
                    <p className="text-base sm:text-lg font-extrabold text-indigo-400 font-mono tabular-nums">
                      {activeTrackSpec.midSalaryRangePln}
                    </p>
                  </div>
                </div>

                {/* Animated GPU-composited Market Benchmark Bars */}
                <div className="pt-4 border-t border-white/[0.08] space-y-2.5 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono tabular-nums text-[11px] text-[#94A3B8]">
                      <span>{isEn ? 'Junior Level' : 'Poziom Junior'}</span>
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
                      <span>{isEn ? 'Mid / Regular Level' : 'Poziom Mid / Regular'}</span>
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
                    {isEn ? `Milestones (${activeTrackSpec.title}):` : `Kamienie milowe (${activeTrackSpec.title}):`}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {studyPlanEstimate.milestones.map((ms) => (
                      <div
                        key={ms.phase}
                        className="rounded-xl border border-white/[0.08] bg-[#101726] p-3.5 space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                          <span className="text-indigo-400 font-semibold">{ms.phase}</span>
                          <span className="text-[#94A3B8]">
                            {isEn ? `Week ${ms.weekTarget}` : `Tydzień ${ms.weekTarget}`}
                          </span>
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
                        {isEn
                          ? `Study plan prepared for ${leadName}`
                          : `Plan nauki dla ${leadName} został przygotowany`}
                      </h3>
                      <p className="text-xs text-[#94A3B8]">
                        {leadEmail} · {activeTrackSpec.roleLabel} (
                        {isEn ? `${weeklyHours}h / wk` : `${weeklyHours}h / tydz.`})
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-[#CBD5E1] leading-relaxed">
                    {isEn ? (
                      <>
                        Recommended start: <strong>Module 01: HTML5 Foundations</strong> (Lesson 1:
                        First HTML Tags). You can launch the interactive workspace right away.
                      </>
                    ) : (
                      <>
                        Rekomendowany start to <strong>Moduł 01: Podstawy HTML5</strong> (Lekcja 1:
                        Pierwsze znaczniki HTML). Możesz od razu uruchomić interaktywną aplikację.
                      </>
                    )}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handlePrimaryAction}
                      className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors whitespace-nowrap"
                    >
                      {isAuthenticated
                        ? isEn
                          ? 'Open Student Dashboard'
                          : 'Otwórz Pulpit Kursanta'
                        : isEn
                        ? 'Create free account & start'
                        : 'Utwórz darmowe konto i zacznij'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormSubmitted(false)}
                      className="px-4 py-3 text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                    >
                      {isEn ? 'Change parameters' : 'Zmień parametry'}
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
                      {isEn ? 'Get your personalized study plan' : 'Odbierz indywidualny plan nauki'}
                    </h3>
                    <p className="text-xs text-[#94A3B8]">
                      {isEn
                        ? `We will tailor the schedule for track: ${activeTrackSpec.roleLabel}.`
                        : `Dopasujemy harmonogram pod ścieżkę: ${activeTrackSpec.roleLabel}.`}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="lead-name" className="block text-xs font-semibold text-[#CBD5E1]">
                      {isEn ? 'Your first name' : 'Twoje imię'}
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder={isEn ? 'e.g. Alex' : 'np. Aleksander'}
                      className="w-full rounded-xl border border-white/15 bg-[#060911] px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#475569] focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="lead-email" className="block text-xs font-semibold text-[#CBD5E1]">
                      {isEn ? 'Email address' : 'Adres e-mail'}
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder={isEn ? 'e.g. alex@example.com' : 'np. aleksander@domena.pl'}
                      className="w-full rounded-xl border border-white/15 bg-[#060911] px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#475569] focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="block text-xs font-semibold text-[#CBD5E1]">
                      {isEn ? 'Primary learning goal' : 'Główny cel nauki'}
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'job', label: isEn ? 'Tech job' : 'Praca w IT' },
                        { id: 'projects', label: isEn ? 'Own apps' : 'Własne aplikacje' },
                        { id: 'upskill', label: isEn ? 'Promotion' : 'Awans' },
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
                    {isEn ? 'Generate personalized study plan' : 'Wygeneruj indywidualny plan nauki'}
                  </button>
                </form>
              )}
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* =====================================================================
          6. ACCESS MODES (100% Free Open Reading + Free Student Account)
      ===================================================================== */}
      <section id="plany-dostepu" className="bg-[#090D16] py-20 lg:py-24 border-b border-white/[0.08]">
        <div className="mx-auto max-w-5xl px-4 sm:px-8 space-y-10">
          <RevealBlock className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-medium text-[#94A3B8]">
                <span className="font-semibold text-emerald-400">
                  {isEn ? '100% Free Educational Platform' : '100% Bezpłatna Platforma Edukacyjna'}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {isEn
                    ? 'Zero paywalls, zero credit cards'
                    : 'Zero paywalli, bez karty płatniczej'}
                </span>
              </div>
              <h2
                style={{ textWrap: 'balance' }}
                className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]"
              >
                {isEn
                  ? 'Learn openly right now or save your progress with a free account.'
                  : 'Czytaj otwarcie bez logowania albo zapisuj postępy na darmowym koncie.'}
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 shrink-0 self-start">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{isEn ? 'Every module unlocked today' : 'Wszystkie moduły odblokowane od razu'}</span>
            </div>
          </RevealBlock>

          <RevealBlock delayMs={80} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Mode 1: Open Knowledge Base & Guides — No Sign-in */}
            <div className="rounded-2xl border border-white/10 bg-[#0B101B] p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-indigo-400">
                    {isEn ? 'No Sign-In Required' : 'Bez Logowania i Rejestracji'}
                  </p>
                  <h3 className="font-display text-xl font-bold text-[#F8FAFC] mt-1">
                    {isEn ? 'Open Knowledge Base & Guides' : 'Otwarta Baza Wiedzy i Poradniki'}
                  </h3>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-extrabold text-[#F8FAFC] tabular-nums">
                    {isEn ? '0 PLN' : '0 zł'}
                  </span>
                  <span className="text-xs text-[#94A3B8]">
                    {isEn ? '/ instant browser reading' : '/ natychmiastowy dostęp w przeglądarce'}
                  </span>
                </div>

                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  {isEn
                    ? 'Browse every editorial engineering guide and all lesson walkthroughs directly in your browser without creating an account.'
                    : 'Przeglądaj wszystkie eksperckie poradniki inżynierskie oraz pełną teorię lekcji bezpośrednio w przeglądarce bez zakładania konta.'}
                </p>

                <ul className="space-y-2.5 pt-3 border-t border-white/[0.08] text-xs sm:text-sm text-[#CBD5E1]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? `${GUIDES_DATA.length} long-form engineering guides with production code & FAQs`
                        : `${GUIDES_DATA.length} długich poradników eksperckich z kodem produkcyjnym i FAQ`}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? `All ${allLessons.length} open lessons across ${allModules.length} Full Stack modules`
                        : `Wszystkie ${allLessons.length} otwartych lekcji w ${allModules.length} modułach Full Stack`}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? 'Plain-language analogies, glossaries, and common-mistakes checklists'
                        : 'Analogie z życia codziennego, słowniczki pojęć i listy najczęstszych błędów'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? 'Full-text search and category filters available immediately'
                        : 'Wyszukiwarka i filtry kategorii dostępne natychmiast bez konta'}
                    </span>
                  </li>
                </ul>
              </div>

              <a
                href="/poradniki"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  e.preventDefault();
                  setActiveTab('guides');
                }}
                className="w-full py-3.5 px-5 text-sm font-bold text-center text-[#F8FAFC] bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 rounded-xl transition-colors whitespace-nowrap"
              >
                {isEn ? 'Read guides without signing up →' : 'Czytaj poradniki bez logowania →'}
              </a>
            </div>

            {/* Mode 2: Free Student Account — Interactive Workspace */}
            <div className="rounded-2xl border border-emerald-500/60 bg-[#0D1526] p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-400">
                    {isEn ? 'Interactive Practice & Cloud Sync' : 'Interaktywna Praktyka i Zapis w Chmurze'}
                  </p>
                  <h3 className="font-display text-xl font-bold text-[#F8FAFC] mt-1">
                    {isEn ? 'Free Student Account' : 'Bezpłatne Konto Kursanta'}
                  </h3>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-extrabold text-[#F8FAFC] tabular-nums">
                    {isEn ? '0 PLN' : '0 zł'}
                  </span>
                  <span className="text-xs text-[#94A3B8]">
                    {isEn ? '/ full interactive course' : '/ pełny interaktywny kurs'}
                  </span>
                </div>

                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  {isEn
                    ? 'The complete hands-on Full Stack workspace with zero paywalls: live code verification, 6 simulators, 12 portfolio projects, GitHub sync, and verified certificates.'
                    : 'Kompletny warsztat programistyczny bez paywalla: automatyczne sprawdzanie kodu, 6 symulatorów, 12 projektów do portfolio, synchronizacja GitHub oraz certyfikat.'}
                </p>

                <ul className="space-y-2.5 pt-3 border-t border-white/[0.08] text-xs sm:text-sm text-[#CBD5E1]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? `Live browser code editor + automated tests for all ${allLessons.length} lessons`
                        : `Edytor kodu w przeglądarce + automatyczne testy dla wszystkich ${allLessons.length} lekcji`}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? '6 interactive simulators (Bash/Git Terminal, SQL JOIN, REST API, Event Loop)'
                        : '6 symulatorów (Terminal Bash/Git, SQL JOIN, REST API, Event Loop)'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? '12 portfolio projects with GitHub submission, ATS CV Builder & Certificate'
                        : '12 projektów do portfolio z podpięciem GitHuba, Kreator CV ATS i Certyfikat'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? 'Cloud progress sync across desktop & mobile + SM-2 spaced repetition'
                        : 'Synchronizacja postępów między komputerem i telefonem + fiszki SM-2'}
                    </span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handlePrimaryAction}
                className="w-full py-3.5 px-5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors whitespace-nowrap"
              >
                {isAuthenticated
                  ? isEn
                    ? 'Go to Student Dashboard'
                    : 'Przejdź do Pulpitu Kursanta'
                  : isEn
                  ? 'Create free account (0 PLN)'
                  : 'Załóż darmowe konto (0 zł)'}
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
                  <span className="font-semibold text-indigo-400">
                    {isEn ? 'Frequently Asked Questions' : 'Najczęściej Zadawane Pytania'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{isEn ? 'Everything before your first sign-in' : 'Wszystko przed pierwszym logowaniem'}</span>
                </div>
                <h2
                  style={{ textWrap: 'balance' }}
                  className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]"
                >
                  {isEn
                    ? 'Answers for people starting from scratch.'
                    : 'Odpowiedzi dla osób zaczynających od zera.'}
                </h2>
              </div>

              <div className="space-y-3">
                {faqItems.map((item, idx) => {
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
                  alt={
                    isEn
                      ? 'Dark engineer desk with a laptop showing a finished application dashboard and mechanical keyboard'
                      : 'Ciemne biurko inżyniera z laptopem prezentującym ukończony dashboard aplikacji i klawiaturą mechaniczną'
                  }
                  aspectClass="aspect-[4/3]"
                  fallbackTitle={
                    isEn ? 'Your Full Stack portfolio & certificate' : 'Twoje portfolio i certyfikat Full Stack'
                  }
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0B101B] via-transparent to-transparent"
                />
              </div>
              <div className="p-6 sm:p-7 space-y-4">
                <h3 className="font-display text-xl font-extrabold text-[#F8FAFC]">
                  {isEn
                    ? 'Ready to write your first line of code?'
                    : 'Gotowy napisać swoją pierwszą linijkę kodu?'}
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  {isEn
                    ? 'Module 01 takes around 15 minutes for the first lesson and requires zero local setup. Launch the platform and try it hands-on.'
                    : 'Moduł 01 zajmuje około 15 minut na pierwszą lekcję i nie wymaga żadnej instalacji. Uruchom aplikację i sprawdź w praktyce.'}
                </p>
                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  className="group w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all whitespace-nowrap"
                >
                  <span>
                    {isAuthenticated
                      ? isEn
                        ? 'Go to Student Dashboard'
                        : 'Przejdź do Pulpitu Kursanta'
                      : isEn
                      ? 'Start your first free lesson'
                      : 'Zacznij pierwszą lekcję za darmo'}
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
        aria-label={isEn ? 'Scroll smoothly to the top' : 'Przewiń płynnie do góry strony'}
        aria-hidden={!showScrollTop}
        tabIndex={showScrollTop ? 0 : -1}
        title={isEn ? 'Scroll to top' : 'Przewiń do góry'}
        className={`fixed bottom-5 right-5 z-40 inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-[#0B101B]/90 px-3.5 text-xs font-semibold text-[#F8FAFC] backdrop-blur-md shadow-xl transition-all duration-200 hover:border-indigo-500/70 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          showScrollTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <ArrowUp className="h-4 w-4 text-indigo-400 shrink-0" />
        <span className="hidden sm:inline whitespace-nowrap">{isEn ? 'To top' : 'Do góry'}</span>
      </button>
    </div>
  );
};
