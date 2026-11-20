import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Lesson } from '../types';
import { useApp } from '../context/AppContext';
import { CodeBlock } from './CodeBlock';
import { CodeEditor } from './CodeEditor';
import { RichInlineText, renderInlineTokens } from './RichInlineText';
import {
  LessonMapNavigatorBar,
  LessonRouteTransitionCard,
} from './LessonMapNavigatorBar';
import {
  REQUIRED_QUIZ_SCORE,
  ValidationSummary,
  checkLessonCompletionEligibility,
  evaluateLessonQuiz,
  validateExerciseCode,
} from '../utils/codeRunner';
import {
  parseInlineTokens,
  parseTheoryBlocks,
  getBeginnerLessonAid,
  groupTheoryBlocksIntoSections,
  estimateLessonReadingMinutes,
} from '../utils/lessonReadability';
import {
  LessonStepId,
  computeLessonSlideDirection,
  computeStepSlideDirection,
  getLessonSlideVariants,
  getStepSlideVariants,
} from '../utils/lessonTransition';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  AlertOctagon,
  Lightbulb,
  HelpCircle,
  Trophy,
  Sparkles,
  Layers,
  Award,
  Check,
  X,
  Lock,
  Play,
  Heart,
  Compass,
  ListChecks,
  GraduationCap,
  Type,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface LessonDetailViewProps {
  lesson: Lesson;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({ lesson }) => {
  const {
    currentUser,
    setActiveTab,
    completeLesson,
    saveQuizScore,
    verifyLessonExercise,
    saveCodeSnippet,
    allModules,
    allLessons,
    livesInfo,
    loseLife,
    setIsLivesModalOpen,
    language,
  } = useApp();
  const isEn = language === 'en';

  const prefersReducedMotion = Boolean(useReducedMotion());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [independentHintVisible, setIndependentHintVisible] = useState(false);
  const [comfortTextSize, setComfortTextSize] = useState<boolean>(true);
  const [stepFilter, setStepFilter] = useState<LessonStepId>('all');
  const [stepDirection, setStepDirection] = useState<1 | -1>(1);
  const [showWalkthroughSteps, setShowWalkthroughSteps] = useState<boolean>(false);
  const [showOptionalTasks, setShowOptionalTasks] = useState<boolean>(false);

  // Verification gates state
  const [editorCodeDraft, setEditorCodeDraft] = useState<{ html: string; css: string; js: string }>(() => {
    const saved = currentUser.savedCode?.[lesson.interactiveExercise.id];
    return {
      html: saved?.html ?? lesson.interactiveExercise.starterCode.html,
      css: saved?.css ?? lesson.interactiveExercise.starterCode.css,
      js: saved?.js ?? lesson.interactiveExercise.starterCode.js,
    };
  });
  const [exercisePassed, setExercisePassed] = useState(false);
  const [lastValidation, setLastValidation] = useState<ValidationSummary | null>(null);
  const [verificationBanner, setVerificationBanner] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Synchronize states when switching lessons
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setIndependentHintVisible(false);
    setVerificationBanner(null);
    setStepFilter('all');
    setShowWalkthroughSteps(false);
    setShowOptionalTasks(false);

    const saved = currentUser.savedCode?.[lesson.interactiveExercise.id];
    const initialCode = {
      html: saved?.html ?? lesson.interactiveExercise.starterCode.html,
      css: saved?.css ?? lesson.interactiveExercise.starterCode.css,
      js: saved?.js ?? lesson.interactiveExercise.starterCode.js,
    };
    setEditorCodeDraft(initialCode);

    const alreadyCompleted = (currentUser.completedLessons ?? []).includes(lesson.id);
    if (saved) {
      const savedValidation = validateExerciseCode(lesson.interactiveExercise, initialCode, language);
      setLastValidation(savedValidation);
      setExercisePassed(alreadyCompleted || savedValidation.allPassed);
    } else {
      setLastValidation(null);
      setExercisePassed(alreadyCompleted);
    }

    const existingScore = currentUser.quizScores?.[lesson.id];
    if (existingScore !== undefined) {
      setQuizScore(existingScore);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lesson.id]);

  const theoryBlocks = useMemo(
    () => parseTheoryBlocks(lesson.theoryMarkdown),
    [lesson.id, lesson.theoryMarkdown]
  );

  const theorySections = useMemo(
    () =>
      groupTheoryBlocksIntoSections(
        theoryBlocks,
        lesson.title || (isEn ? 'Theory Introduction' : 'Wprowadzenie teoretyczne')
      ),
    [theoryBlocks, lesson.title, isEn]
  );

  const beginnerAid = useMemo(
    () => getBeginnerLessonAid(lesson, language),
    [lesson.id, language]
  );

  const estimatedMinutes = useMemo(
    () => Math.max(lesson.durationMinutes || 10, estimateLessonReadingMinutes(lesson)),
    [lesson.id]
  );

  const parentModule = allModules.find((m) => m.id === lesson.moduleId);
  const isCompleted = currentUser.completedLessons.includes(lesson.id);

  // Next / Previous Lesson Navigation & Directional Slide Tracking
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const [trackedLessonId, setTrackedLessonId] = useState<string>(lesson.id);
  const [trackedLessonIndex, setTrackedLessonIndex] = useState<number>(currentIndex);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);

  if (lesson.id !== trackedLessonId) {
    setSlideDirection(computeLessonSlideDirection(trackedLessonIndex, currentIndex));
    setTrackedLessonId(lesson.id);
    setTrackedLessonIndex(currentIndex);
  }

  const lessonSlideVariants = useMemo(
    () => getLessonSlideVariants(prefersReducedMotion),
    [prefersReducedMotion]
  );

  const stepSlideVariants = useMemo(
    () => getStepSlideVariants(prefersReducedMotion),
    [prefersReducedMotion]
  );

  const handleStepChange = (nextStep: LessonStepId, scrollToTop = false) => {
    setStepDirection(computeStepSlideDirection(stepFilter, nextStep));
    setStepFilter(nextStep);
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  const moduleLessons = parentModule?.lessons || [];
  const lessonIndexInModule = moduleLessons.findIndex((l) => l.id === lesson.id) + 1;

  const currentLives = currentUser.isPro ? 5 : (livesInfo.currentLives ?? currentUser.lives ?? 5);

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    const question = lesson.quiz.find((q) => q.id === questionId);
    if (!question || !Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= question.options.length) {
      return;
    }
    if (!currentUser.isPro && currentLives <= 0) {
      setIsLivesModalOpen(true);
      return;
    }
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (quizSubmitted || lesson.quiz.length === 0) return;
    if (!currentUser.isPro && currentLives <= 0) {
      setIsLivesModalOpen(true);
      return;
    }

    const evaluation = evaluateLessonQuiz(lesson, quizAnswers, REQUIRED_QUIZ_SCORE);
    if (!evaluation.valid) return;

    const bestScore = Math.max(evaluation.scorePercent, currentUser.quizScores[lesson.id] ?? 0);
    setQuizScore(bestScore);
    setQuizSubmitted(true);
    if (bestScore >= REQUIRED_QUIZ_SCORE) {
      setVerificationBanner(null);
    }
    saveQuizScore(lesson.id, evaluation.scorePercent, quizAnswers);

    if (evaluation.scorePercent < 100 && !currentUser.isPro) {
      loseLife(
        isEn
          ? `Incorrect answer in lesson quiz: ${lesson.title}`
          : `Błędna odpowiedź w quizie lekcji: ${lesson.title}`
      );
    }
  };

  const handleResetQuiz = () => {
    if (!currentUser.isPro && currentLives <= 0) {
      setIsLivesModalOpen(true);
      return;
    }
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const eligibility = checkLessonCompletionEligibility({
    isExercisePassed: exercisePassed,
    quizScore: quizScore ?? undefined,
    requiredQuizScore: REQUIRED_QUIZ_SCORE,
    language,
  });
  const quizPassed = eligibility.isQuizPassed || isCompleted;
  const canCompleteLesson = isCompleted || eligibility.canComplete;

  const handleVerifyAndComplete = () => {
    if (isCompleted) return;

    // Re-verify live editor code immediately before completing to prevent post-pass code reset/deletion bypass
    const liveCodeValidation = validateExerciseCode(lesson.interactiveExercise, editorCodeDraft, language);
    const liveExercisePassed = exercisePassed && liveCodeValidation.allPassed;
    if (!liveCodeValidation.allPassed) {
      setExercisePassed(false);
      setLastValidation(liveCodeValidation);
    }

    const currentQuizEval = evaluateLessonQuiz(lesson, quizAnswers, REQUIRED_QUIZ_SCORE);
    const effectiveQuizScore = currentQuizEval.valid
      ? Math.max(currentQuizEval.scorePercent, quizScore ?? 0)
      : (quizScore ?? 0);
    const liveEligibility = checkLessonCompletionEligibility({
      isExercisePassed: liveExercisePassed,
      quizScore: effectiveQuizScore,
      requiredQuizScore: REQUIRED_QUIZ_SCORE,
      language,
    });

    const missingParts: string[] = [];
    if (!liveEligibility.isExercisePassed) {
      missingParts.push(
        isEn
          ? 'passing the hands-on exercise in the code editor (all tests green)'
          : 'zaliczenie ćwiczenia praktycznego w edytorze kodu (wszystkie testy na zielono)'
      );
    }
    if (!liveEligibility.isQuizPassed) {
      missingParts.push(
        isEn
          ? `completing the knowledge check quiz with at least ${REQUIRED_QUIZ_SCORE}%`
          : `rozwiązanie quizu sprawdzającego z wynikiem minimum ${REQUIRED_QUIZ_SCORE}%`
      );
    }

    if (missingParts.length > 0) {
      setVerificationBanner({
        type: 'error',
        message: isEn
          ? `To complete this lesson and claim +${lesson.xpReward} XP, you still need: ${missingParts.join(' and ')}.`
          : `Aby ukończyć tę lekcję i odebrać +${lesson.xpReward} XP, wymagane jest jeszcze: ${missingParts.join(' oraz ')}.`,
      });
      return;
    }

    saveCodeSnippet(lesson.interactiveExercise.id, editorCodeDraft);
    completeLesson(
      lesson.id,
      lesson.xpReward,
      currentQuizEval.valid ? quizAnswers : undefined
    );
    setVerificationBanner({
      type: 'success',
      message: isEn
        ? `Congratulations! All verification requirements met. You earn +${lesson.xpReward} XP!`
        : `Gratulacje! Wszystkie wymagania weryfikacyjne zostały spełnione. Zdobywasz +${lesson.xpReward} XP!`,
    });
  };

  const proseSizeClass = comfortTextSize ? 'text-[15px] sm:text-base leading-[1.8]' : 'text-sm leading-relaxed';

  const scrollToTopic = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const defaultExampleLang =
    lesson.codeExamples[0]?.language ||
    (lesson.id.startsWith('html-') ? 'html' : lesson.id.startsWith('css-') ? 'css' : 'javascript');

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 space-y-4 sm:space-y-8">
      
      {/* Top Navigation & Reading Comfort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 sm:pb-3 border-b border-slate-800/80">
        <button
          onClick={() => setActiveTab('modules')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors bg-slate-900 hover:bg-slate-800 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-800 whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          <span className="sm:hidden">{isEn ? 'Modules' : 'Moduły'}</span>
          <span className="hidden sm:inline">{isEn ? 'Back to modules' : 'Powrót do modułów'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setComfortTextSize((v) => !v)}
            title={isEn ? 'Toggle reading font size' : 'Przełącz wielkość czcionki'}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              comfortTextSize
                ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Type className="h-3.5 w-3.5 shrink-0" />
            <span className="sm:hidden">{comfortTextSize ? 'A+' : 'A'}</span>
            <span className="hidden sm:inline">
              {comfortTextSize
                ? isEn
                  ? 'Large font (Comfort)'
                  : 'Duża czcionka (Wygodna)'
                : isEn
                ? 'Standard font'
                : 'Standardowa czcionka'}
            </span>
          </button>

          {!currentUser.isPro && (
            <button
              onClick={() => setIsLivesModalOpen(true)}
              className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all whitespace-nowrap shrink-0 tabular-nums ${
                currentLives > 0
                  ? 'border-rose-500/30 bg-rose-950/30 text-rose-300 hover:bg-rose-950/50'
                  : 'border-rose-500 bg-rose-950/80 text-rose-200 animate-pulse'
              }`}
            >
              <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 shrink-0" />
              <span className="sm:hidden">{currentLives}/5</span>
              <span className="hidden sm:inline">{isEn ? `Hearts: ${currentLives}/5` : `Życia: ${currentLives}/5`}</span>
            </button>
          )}

          <div className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold whitespace-nowrap shrink-0 tabular-nums">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>+{lesson.xpReward} XP</span>
          </div>

          {isCompleted && (
            <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold whitespace-nowrap shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">{isEn ? 'Completed' : 'Zaliczone'}</span>
            </span>
          )}
        </div>
      </div>

      {/* Interactive Lesson Map Navigator Bar (Connected Stations & 15-Zone Atlas Drawer) */}
      <LessonMapNavigatorBar
        currentLesson={lesson}
        mode="app"
        onSelectLesson={(lessonId) => setActiveTab('lesson', lessonId)}
        onOpenFullMap={() => setActiveTab('modules')}
      />

      {/* Directional Slide Transition Viewport for Lesson Content */}
      <div className="overflow-x-hidden">
        <AnimatePresence mode="wait" custom={slideDirection} initial={false}>
          <motion.div
            key={lesson.id}
            custom={slideDirection}
            variants={lessonSlideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            data-testid="lesson-slide-container"
            data-slide-direction={slideDirection > 0 ? 'forward' : 'backward'}
            className="space-y-8 will-change-transform"
          >
            {/* Lesson Hero Header */}
            <header className="rounded-2xl border border-slate-800/90 bg-slate-900/75 p-4 sm:p-8 shadow-xl space-y-3.5 sm:space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center rounded-md bg-indigo-500/15 px-2 sm:px-2.5 py-0.5 sm:py-1 font-bold text-indigo-300 border border-indigo-500/30">
              {isEn ? `Module ${lesson.moduleId}` : `Moduł ${lesson.moduleId}`}: {parentModule?.title || lesson.moduleTitle}
            </span>
            {moduleLessons.length > 0 && (
              <span className="inline-flex items-center rounded-md bg-slate-800/90 px-2 sm:px-2.5 py-0.5 sm:py-1 font-mono text-slate-300 border border-slate-700/70 tabular-nums">
                {isEn
                  ? `Lesson ${lessonIndexInModule} of ${moduleLessons.length}`
                  : `Lekcja ${lessonIndexInModule} z ${moduleLessons.length}`}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 sm:px-2.5 py-0.5 sm:py-1 font-semibold border ${
                beginnerAid.difficultyLabel === 'Start od Zera'
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : beginnerAid.difficultyLabel === 'Podstawy'
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                  : beginnerAid.difficultyLabel === 'Średniozaawansowany'
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5 shrink-0" />
              <span>{isEn ? `Level: ${beginnerAid.displayDifficultyLabel}` : `Poziom: ${beginnerAid.displayDifficultyLabel}`}</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-400 font-medium tabular-nums">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{isEn ? `~${estimatedMinutes} min` : `~${estimatedMinutes} min`}</span>
            </span>
            <span>•</span>
            <span>
              {isEn
                ? `${theorySections.length} ${theorySections.length === 1 ? 'section' : 'sections'}`
                : `${theorySections.length} ${theorySections.length === 1 ? 'część' : 'części'}`}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-lg sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug sm:leading-tight">
            <RichInlineText text={lesson.title} />
          </h1>
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-[72ch]">
            <RichInlineText text={lesson.summary} />
          </p>
        </div>

        {/* Sticky 4-Stage Guided Learning Switcher */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
            {isEn ? 'Lesson view mode:' : 'Tryb przeglądania lekcji:'}
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: isEn ? 'Full view' : 'Pełny widok', done: isCompleted },
              { id: '1-teoria', label: isEn ? `1. Theory (${theorySections.length})` : `1. Teoria (${theorySections.length})`, done: false },
              { id: '2-przyklady', label: isEn ? '2. Examples & mistakes' : '2. Przykłady i błędy', done: false },
              { id: '3-cwiczenie', label: isEn ? '3. Code workshop' : '3. Warsztat kodu', done: exercisePassed },
              { id: '4-quiz', label: `4. Quiz (${lesson.quiz.length})`, done: quizPassed },
            ].map((tab) => {
              const active = stepFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleStepChange(tab.id as LessonStepId)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 tabular-nums ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-950'
                      : 'bg-slate-950/90 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {tab.done && (
                    <CheckCircle2
                      className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-white' : 'text-emerald-400'}`}
                    />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait" custom={stepDirection} initial={false}>
        <motion.div
          key={stepFilter}
          custom={stepDirection}
          variants={stepSlideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="space-y-8 will-change-transform"
        >
      {/* =====================================================================
          STAGE 1: TEORIA, ANALOGIA, SŁOWNICZEK I KARTY ZAGADNIEŃ
      ===================================================================== */}
      {(stepFilter === 'all' || stepFilter === '1-teoria') && (
        <div className="space-y-6">
          
          {/* Unified Lesson Overview Panel (Analogy + Objectives + Mini-Glossary) */}
          <section className="rounded-2xl border border-slate-800/90 bg-slate-900/60 overflow-hidden shadow-lg">
            {/* Top Banner: Simple Analogy */}
            <div className="p-4 sm:p-7 bg-gradient-to-r from-emerald-950/35 via-slate-900/90 to-slate-900/90 border-b border-slate-800/80">
              <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-4">
                <div className="flex items-center gap-2 sm:block shrink-0">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shrink-0">
                    <Compass className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <span className="sm:hidden text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    {isEn ? 'Real-world analogy' : 'Analogia z życia'}
                  </span>
                </div>
                <div className="space-y-1.5 min-w-0 w-full">
                  <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    {isEn
                      ? 'Understand it in 30 seconds • Real-world analogy'
                      : 'Zrozum temat w 30 sekund • Analogia z życia'}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                    <RichInlineText text={beginnerAid.analogyTitle} />
                  </h2>
                  <p className="text-slate-200 text-sm sm:text-[15px] leading-relaxed max-w-[74ch]">
                    <RichInlineText text={beginnerAid.analogyText} />
                  </p>
                </div>
              </div>
            </div>

            {/* Two-Column Architectural Grid: Objectives & Key Terms */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80">
              {/* Left Column: Learning Objectives & Prerequisites */}
              <div className="lg:col-span-6 p-4 sm:p-6 space-y-3.5 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-indigo-400 shrink-0" />
                    {isEn ? 'What you will learn in this lesson' : 'Czego nauczysz się w tej lekcji'}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums shrink-0">
                    {isEn
                      ? `${lesson.objectives.length} ${lesson.objectives.length === 1 ? 'goal' : 'goals'}`
                      : `${lesson.objectives.length} cele`}
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {lesson.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{renderInlineTokens(parseInlineTokens(obj))}</span>
                    </li>
                  ))}
                </ul>

                {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/70 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 mr-1">
                      {isEn ? 'Prerequisites:' : 'Wymagania wstępne:'}
                    </span>
                    {lesson.prerequisites.map((pre, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-950/90 border border-slate-800 text-[11px] text-slate-300"
                      >
                        <RichInlineText text={pre} />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Mini Glossary of Terms */}
              <div className="lg:col-span-6 p-4 sm:p-6 space-y-3.5 sm:space-y-4 bg-slate-950/30">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-400" />
                    {isEn ? 'Key terms glossary' : 'Słowniczek pojęć z tej lekcji'}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                    {isEn
                      ? `${beginnerAid.glossary.length} ${beginnerAid.glossary.length === 1 ? 'term' : 'terms'}`
                      : `${beginnerAid.glossary.length} pojęcia`}
                  </span>
                </div>

                <dl className="divide-y divide-slate-800/70">
                  {beginnerAid.glossary.map((item, idx) => (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                      <dt className="font-mono text-xs font-bold shrink-0 sm:w-44">
                        <RichInlineText
                          text={item.term.includes('<') || item.term.includes('`') ? item.term : `\`${item.term}\``}
                        />
                      </dt>
                      <dd className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                        <RichInlineText text={item.simpleDefinition} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          {/* Quick-Jump Table of Contents when lesson has 2+ Theory Topic Cards */}
          {theorySections.length > 1 && (
            <nav
              aria-label={isEn ? 'Topics in this lesson' : 'Spis zagadnień w tej lekcji'}
              className="rounded-xl border border-slate-800/90 bg-slate-900/50 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 shrink-0">
                <BookOpen className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>
                  {isEn
                    ? `Theory sections (${theorySections.length}):`
                    : `Spis części teoretycznych (${theorySections.length}):`}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {theorySections.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToTopic(sec.id)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/90 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-200 transition-colors text-left"
                  >
                    <span className="font-mono text-[11px] font-bold text-indigo-400 tabular-nums">
                      0{sec.index}
                    </span>
                    <span className="truncate max-w-[260px]">
                      <RichInlineText
                        text={sec.title.replace(/^\d+\.\s*/, '').replace(/:\s*$/, '')}
                      />
                    </span>
                  </button>
                ))}
              </div>
            </nav>
          )}

          {/* Numbered Theory Topic Cards (Karty Zagadnień) */}
          <div className="space-y-6">
            {theorySections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-2xl border border-slate-800/90 bg-slate-900/65 p-6 sm:p-8 shadow-lg space-y-5"
              >
                {/* Topic Card Header */}
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/30 font-mono text-xs font-bold text-indigo-300 tabular-nums">
                      0{section.index}
                    </span>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {isEn
                          ? `Part ${section.index} of ${theorySections.length}`
                          : `Część ${section.index} z ${theorySections.length}`}
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        {renderInlineTokens(parseInlineTokens(section.title.replace(/^\d+\.\s*/, '')))}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Topic Card Content Blocks */}
                <div className="space-y-5">
                  {section.blocks.map((block, bIdx) => {
                    if (block.type === 'code_block') {
                      return (
                        <div key={bIdx} className="my-4">
                          <CodeBlock
                            code={block.code}
                            language={block.language}
                            title={
                              isEn
                                ? `Syntax Example (${block.language.toUpperCase()})`
                                : `Przykład składni (${block.language.toUpperCase()})`
                            }
                            badge={isEn ? 'Pattern' : 'Wzorzec'}
                            badgeColor="indigo"
                          />
                        </div>
                      );
                    }

                    if (block.type === 'ordered_list') {
                      return (
                        <ol
                          key={bIdx}
                          className="divide-y divide-slate-800/70 rounded-xl border border-slate-800/80 bg-slate-950/50 px-5 py-2"
                        >
                          {block.items.map((item, i) => (
                            <li key={i} className="py-3.5 flex items-start gap-3.5">
                              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 border border-indigo-500/30 font-mono text-xs font-bold text-indigo-300 tabular-nums">
                                {item.number}
                              </span>
                              <div className={`${proseSizeClass} text-slate-200 max-w-[70ch]`}>
                                {item.title && (
                                  <span className="font-bold text-white mr-1.5">
                                    {renderInlineTokens(item.title)}
                                    {item.title[item.title.length - 1]?.content?.trim().endsWith(':') ? '' : ':'}
                                  </span>
                                )}
                                <span>{renderInlineTokens(item.body)}</span>
                              </div>
                            </li>
                          ))}
                        </ol>
                      );
                    }

                    if (block.type === 'unordered_list') {
                      return (
                        <ul
                          key={bIdx}
                          className="divide-y divide-slate-800/60 rounded-xl border border-slate-800/80 bg-slate-950/40 px-5 py-2"
                        >
                          {block.items.map((itemTokens, i) => (
                            <li key={i} className="py-3 flex items-start gap-3">
                              <span className="mt-2 h-2 w-2 rounded-full bg-indigo-400 shrink-0" />
                              <span className={`${proseSizeClass} text-slate-200 max-w-[70ch]`}>
                                {renderInlineTokens(itemTokens)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      );
                    }

                    if (block.type === 'paragraph') {
                      return (
                        <p key={bIdx} className={`${proseSizeClass} text-slate-200 max-w-[72ch]`}>
                          {renderInlineTokens(block.tokens)}
                        </p>
                      );
                    }

                    return null;
                  })}
                </div>
              </article>
            ))}
          </div>

          {stepFilter === '1-teoria' && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => handleStepChange('2-przyklady', true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/60 transition-all"
              >
                <span>
                  {isEn
                    ? 'Continue to Stage 2: Examples & common mistakes'
                    : 'Przejdź do Etapu 2: Przykłady i częste błędy'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          STAGE 2: PRZYKŁADY KODU, KROK PO KROKU I CZĘSTE BŁĘDY
      ===================================================================== */}
      {(stepFilter === 'all' || stepFilter === '2-przyklady') && (
        <div className="space-y-8">
          
          {/* Code Examples */}
          {lesson.codeExamples.length > 0 && (
            <section className="rounded-2xl border border-slate-800/90 bg-slate-900/65 p-6 sm:p-8 shadow-lg space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      {isEn ? 'Practical patterns' : 'Praktyczne wzorce'}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      {isEn ? 'Annotated code examples' : 'Gotowe przykłady kodu z wyjaśnieniem'}
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  {lesson.codeExamples.length}{' '}
                  {isEn
                    ? lesson.codeExamples.length === 1
                      ? 'example'
                      : 'examples'
                    : lesson.codeExamples.length === 1
                    ? 'przykład'
                    : 'przykłady'}
                </span>
              </div>

              <div className="space-y-8">
                {lesson.codeExamples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800/90 bg-slate-950/50 p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <span className="font-mono text-xs text-emerald-400 tabular-nums">#{idx + 1}</span>
                        <span><RichInlineText text={ex.title} /></span>
                      </h3>
                      <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {ex.language}
                      </span>
                    </div>

                    <CodeBlock
                      code={ex.code}
                      language={ex.language}
                      title={ex.title}
                      badge={isEn ? `Example #${idx + 1}` : `Przykład #${idx + 1}`}
                      badgeColor="emerald"
                    />

                    <div className="rounded-xl bg-slate-900/90 border border-slate-800 px-4 py-3.5 flex items-start gap-3">
                      <Lightbulb className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                      <div className="space-y-1">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                          {isEn ? 'How does this code work?' : 'Jak działa ten kod?'}
                        </span>
                        <p className={`${proseSizeClass} text-slate-200 max-w-[70ch]`}>
                          {renderInlineTokens(parseInlineTokens(ex.explanation))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Step-by-Step Guide */}
          {lesson.stepByStepGuide.length > 0 && (
            <section className="rounded-2xl border border-slate-800/90 bg-slate-900/65 p-6 sm:p-8 shadow-lg space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
                <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                    {isEn ? 'Implementation workflow' : 'Procedura wdrożenia'}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    {isEn ? 'Step-by-step guide' : 'Instrukcja krok po kroku'}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lesson.stepByStepGuide.map((step) => (
                  <div
                    key={step.step}
                    className="rounded-xl border border-slate-800/90 bg-slate-950/60 p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="h-7 w-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-mono text-xs font-bold shrink-0 tabular-nums">
                          0{step.step}
                        </span>
                        <h3 className="text-sm font-bold text-white leading-snug">
                          <RichInlineText text={step.title} />
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {renderInlineTokens(parseInlineTokens(step.description))}
                      </p>
                    </div>
                    {step.codeSnippet && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <CodeBlock
                          code={step.codeSnippet}
                          language={defaultExampleLang}
                          title={isEn ? `Step 0${step.step}` : `Krok 0${step.step}`}
                          showLineNumbers={true}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Side-by-Side Common Mistakes Comparison (Błąd vs. Poprawnie) */}
          {lesson.commonMistakes.length > 0 && (
            <section className="rounded-2xl border border-slate-800/90 bg-slate-900/65 p-6 sm:p-8 shadow-lg space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                    <AlertOctagon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                      {isEn ? 'Pitfalls & debugging' : 'Pułapki i debugowanie'}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      {isEn
                        ? 'Common beginner mistakes (Wrong vs. Correct)'
                        : 'Częste błędy początkujących (Porównanie: Błąd vs. Poprawnie)'}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {lesson.commonMistakes.map((mistake, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800/90 bg-slate-950/60 overflow-hidden"
                  >
                    {/* Mistake Header */}
                    <div className="px-5 py-4 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-[11px] font-bold text-rose-300 tabular-nums">
                        {isEn ? `Pitfall #${idx + 1}` : `Pułapka #${idx + 1}`}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {renderInlineTokens(parseInlineTokens(mistake.mistake))}
                      </h3>
                    </div>

                    {/* Side-by-Side Comparison Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80 p-5 gap-5">
                      <div className="space-y-3">
                        <div className="rounded-lg bg-rose-950/25 border border-rose-500/25 p-3 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                            <X className="h-4 w-4 shrink-0" />
                            <span>{isEn ? 'Why does this error happen?' : 'Dlaczego pojawia się błąd?'}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {renderInlineTokens(parseInlineTokens(mistake.whyItHappens))}
                          </p>
                        </div>
                        <CodeBlock
                          code={mistake.badCode}
                          language={defaultExampleLang}
                          title={isEn ? 'Buggy code' : 'Kod powodujący błąd'}
                          badge={isEn ? 'Wrong' : 'Błąd'}
                          badgeColor="rose"
                        />
                      </div>

                      <div className="space-y-3 lg:pl-5 pt-4 lg:pt-0">
                        <div className="rounded-lg bg-emerald-950/25 border border-emerald-500/25 p-3 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                            <Check className="h-4 w-4 shrink-0" />
                            <span>{isEn ? 'How to fix it?' : 'Jak to naprawić?'}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {renderInlineTokens(parseInlineTokens(mistake.howToFix))}
                          </p>
                        </div>
                        <CodeBlock
                          code={mistake.goodCode}
                          language={defaultExampleLang}
                          title={isEn ? 'Correct pattern' : 'Prawidłowy wzorzec'}
                          badge={isEn ? 'Correct' : 'Poprawnie'}
                          badgeColor="emerald"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {stepFilter === '2-przyklady' && (
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => handleStepChange('1-teoria', true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{isEn ? 'Back to Theory' : 'Wróć do Teorii'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleStepChange('3-cwiczenie', true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/60 transition-all"
              >
                <span>
                  {isEn
                    ? 'Continue to Stage 3: Practical workshop'
                    : 'Przejdź do Etapu 3: Warsztat praktyczny'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          STAGE 3: WARSZTAT PRAKTYCZNY (EDYTOR KODU + ZADANIA DODATKOWE)
      ===================================================================== */}
      {(stepFilter === 'all' || stepFilter === '3-cwiczenie') && (
        <section className="space-y-5">
          <div className="rounded-2xl border border-slate-800/90 bg-slate-900/65 p-6 sm:p-8 shadow-lg space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                      {isEn
                        ? 'Practical stage • Required for completion'
                        : 'Etap praktyczny • Wymagany do zaliczenia'}
                    </span>
                    {exercisePassed && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" /> {isEn ? 'Passed' : 'Zaliczone'}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    {isEn ? 'Interactive Code Workshop' : 'Interaktywny Warsztat Kodu'}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowWalkthroughSteps((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700/80 bg-slate-950 text-xs font-semibold text-indigo-300 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              >
                <Lightbulb className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>
                  {showWalkthroughSteps
                    ? isEn
                      ? 'Hide task guide'
                      : 'Ukryj instrukcję do zadania'
                    : isEn
                    ? 'How to solve this step by step?'
                    : 'Jak rozwiązać to zadanie krok po kroku?'}
                </span>
                {showWalkthroughSteps ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>

            {/* Collapsible Step-by-Step Walkthrough */}
            {showWalkthroughSteps && (
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  {isEn ? 'Cheat sheet before coding:' : 'Ściągawka przed pisaniem kodu:'}
                </p>
                <ol className="space-y-2">
                  {beginnerAid.exerciseWalkthrough.map((stepText, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-500/20 font-mono text-[11px] font-bold text-indigo-300 tabular-nums">
                        {idx + 1}
                      </span>
                      <span>{renderInlineTokens(parseInlineTokens(stepText))}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Main Interactive Code Editor */}
            <CodeEditor
              exercise={lesson.interactiveExercise}
              savedCode={editorCodeDraft}
              onCodeChange={(nextCode) => setEditorCodeDraft(nextCode)}
              onSave={(code) => {
                setEditorCodeDraft(code);
                saveCodeSnippet(lesson.interactiveExercise.id, code);
              }}
              onValidationChange={(result) => {
                setLastValidation(result);
                if (result.allPassed) {
                  setExercisePassed(true);
                  setVerificationBanner(null);
                } else {
                  setExercisePassed(false);
                }
              }}
              onSuccess={async (code) => {
                setEditorCodeDraft(code);
                saveCodeSnippet(lesson.interactiveExercise.id, code);
                const verified = await verifyLessonExercise(lesson.interactiveExercise.id, code);
                if (verified) {
                  setExercisePassed(true);
                  setVerificationBanner(null);
                } else {
                  setExercisePassed(false);
                }
              }}
            />

            {/* Collapsible Optional Challenges (So they don't clutter the primary workspace) */}
            <div className="pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowOptionalTasks((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800/90 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-200">
                    {isEn
                      ? 'Bonus challenges for extra practice (Independent exercise & mini-project)'
                      : 'Zadania dodatkowe dla chętnych (Samodzielna praktyka i mini-projekt)'}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 shrink-0">
                  <span>
                    {showOptionalTasks
                      ? isEn
                        ? 'Collapse'
                        : 'Zwiń'
                      : isEn
                      ? 'Expand tasks (2)'
                      : 'Rozwiń zadania (2)'}
                  </span>
                  {showOptionalTasks ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              </button>

              {showOptionalTasks && (
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Independent Exercise */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                        {isEn ? 'Bonus task #1' : 'Zadanie dodatkowe #1'} • <RichInlineText text={lesson.independentTask.title} />
                      </span>
                      <button
                        type="button"
                        onClick={() => setIndependentHintVisible(!independentHintVisible)}
                        className="text-xs font-semibold text-purple-300 hover:text-white underline shrink-0"
                      >
                        {independentHintVisible
                          ? isEn
                            ? 'Hide hint'
                            : 'Ukryj wskazówkę'
                          : isEn
                          ? 'Show hint'
                          : 'Pokaż wskazówkę'}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {renderInlineTokens(parseInlineTokens(lesson.independentTask.instructions))}
                    </p>
                    <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 text-xs text-slate-300">
                      <span className="font-bold text-emerald-400 mr-1.5">
                        {isEn ? 'Expected outcome:' : 'Oczekiwany efekt:'}
                      </span>
                      {renderInlineTokens(parseInlineTokens(lesson.independentTask.expectedOutcome))}
                    </div>
                    {independentHintVisible && (
                      <div className="rounded-lg bg-amber-950/30 border border-amber-500/30 p-3 text-xs text-amber-200">
                        <span className="font-bold text-amber-400 mr-1.5">
                          {isEn ? 'Hint:' : 'Wskazówka:'}
                        </span>
                        {renderInlineTokens(parseInlineTokens(lesson.independentTask.starterHint))}
                      </div>
                    )}
                  </div>

                  {/* Practical Task */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      {isEn ? 'Bonus task #2' : 'Zadanie dodatkowe #2'} • <RichInlineText text={lesson.practicalTask.title} />
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {renderInlineTokens(parseInlineTokens(lesson.practicalTask.brief))}
                    </p>
                    <ol className="space-y-1.5 pt-1">
                      {lesson.practicalTask.steps.map((stepStr, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="font-mono font-bold text-amber-400 shrink-0 tabular-nums">
                            {idx + 1}.
                          </span>
                          <span>{renderInlineTokens(parseInlineTokens(stepStr))}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>

          {stepFilter === '3-cwiczenie' && (
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => handleStepChange('2-przyklady', true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{isEn ? 'Back to Examples' : 'Wróć do Przykładów'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleStepChange('4-quiz', true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/60 transition-all"
              >
                <span>
                  {isEn
                    ? 'Continue to Stage 4: Quiz & completion'
                    : 'Przejdź do Etapu 4: Quiz i zaliczenie'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          STAGE 4: QUIZ SPRAWDZAJĄCY I ZALICZENIE LEKCJI
      ===================================================================== */}
      {(stepFilter === 'all' || stepFilter === '4-quiz') && (
        <div className="space-y-8">
          {lesson.quiz.length > 0 && (
            <section className="rounded-2xl border border-slate-800/90 bg-slate-900/65 p-6 sm:p-8 shadow-lg space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      {isEn
                        ? `Knowledge verification • Min. ${REQUIRED_QUIZ_SCORE}% required`
                        : `Weryfikacja wiedzy • Wymagane min. ${REQUIRED_QUIZ_SCORE}%`}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      {isEn
                        ? `Checkpoint quiz (${lesson.quiz.length} ${lesson.quiz.length === 1 ? 'question' : 'questions'})`
                        : `Quiz sprawdzający (${lesson.quiz.length} ${lesson.quiz.length === 1 ? 'pytanie' : 'pytania'})`}
                    </h2>
                  </div>
                </div>

                {quizScore !== null && (
                  <div
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 tabular-nums ${
                      quizScore >= REQUIRED_QUIZ_SCORE
                        ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    <Trophy className="h-4 w-4 shrink-0" />
                    <span>{isEn ? `Your score: ${quizScore}%` : `Twój wynik: ${quizScore}%`}</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {lesson.quiz.map((q, qIdx) => {
                  const selected = quizAnswers[q.id];

                  return (
                    <div
                      key={q.id}
                      className="rounded-xl border border-slate-800/90 bg-slate-950/60 p-5 space-y-4"
                    >
                      <p className="text-sm sm:text-base font-bold text-white leading-snug">
                        <span className="text-indigo-400 font-mono mr-2 tabular-nums">
                          0{qIdx + 1}.
                        </span>
                        {renderInlineTokens(parseInlineTokens(q.question))}
                      </p>

                      <div className="grid grid-cols-1 gap-2.5">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = selected === oIdx;
                          const isCorrectOption = q.correctAnswer === oIdx;

                          let btnStyle =
                            'border-slate-800 bg-slate-900/90 text-slate-200 hover:border-slate-700 hover:bg-slate-900';

                          if (quizSubmitted) {
                            if (isCorrectOption) {
                              btnStyle =
                                'border-emerald-500/50 bg-emerald-950/35 text-emerald-200 font-semibold';
                            } else if (isSelected && !isCorrectOption) {
                              btnStyle = 'border-rose-500/50 bg-rose-950/35 text-rose-300';
                            }
                          } else if (isSelected) {
                            btnStyle =
                              'border-indigo-500 bg-indigo-950/50 text-white font-semibold';
                          }

                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => handleSelectQuizOption(q.id, oIdx)}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                            >
                              <span>{renderInlineTokens(parseInlineTokens(opt))}</span>
                              {quizSubmitted && isCorrectOption && (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                              )}
                              {quizSubmitted && isSelected && !isCorrectOption && (
                                <X className="h-4 w-4 text-rose-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                          <span className="font-bold text-indigo-400 mr-1.5">
                            {isEn ? 'Explanation:' : 'Wyjaśnienie:'}
                          </span>
                          {renderInlineTokens(parseInlineTokens(q.explanation))}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="flex items-center justify-end gap-3 pt-2">
                  {quizSubmitted ? (
                    <button
                      type="button"
                      onClick={handleResetQuiz}
                      className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
                    >
                      {isEn ? 'Try again' : 'Spróbuj ponownie'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={Object.keys(quizAnswers).length < lesson.quiz.length}
                      onClick={handleSubmitQuiz}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-xs font-bold text-white transition-all shadow-lg shadow-emerald-950/50 tabular-nums"
                    >
                      {isEn
                        ? `Check answers (${Object.keys(quizAnswers).length}/${lesson.quiz.length})`
                        : `Sprawdź odpowiedzi (${Object.keys(quizAnswers).length}/${lesson.quiz.length})`}
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Completion Verification Gate & Lesson Footer Navigation */}
          <div className="pt-4 border-t border-slate-800 space-y-5">
            {!isCompleted && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-indigo-400" />
                    {isEn
                      ? `Lesson completion status (+${lesson.xpReward} XP)`
                      : `Status zaliczenia lekcji (+${lesson.xpReward} XP)`}
                  </h4>
                  <span className="text-xs text-slate-400">
                    {isEn
                      ? 'Meet both requirements to unlock XP rewards'
                      : 'Spełnij oba warunki, aby odblokować punkty XP'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                      exercisePassed
                        ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {exercisePassed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Play className="h-4 w-4 text-amber-400 shrink-0" />
                      )}
                      <div>
                        <p className="font-bold">
                          {isEn ? '1. Hands-on editor workshop' : '1. Warsztat praktyczny w edytorze'}
                        </p>
                        <p className="text-[11px] opacity-80">
                          {exercisePassed
                            ? isEn
                              ? 'All code tests passed!'
                              : 'Wszystkie testy kodu zaliczone!'
                            : lastValidation
                            ? isEn
                              ? `Passed ${lastValidation.passedCount}/${lastValidation.totalCount} tests`
                              : `Zaliczono ${lastValidation.passedCount}/${lastValidation.totalCount} testów`
                            : isEn
                            ? 'Click "Check code" in the editor'
                            : 'Uruchom przycisk "Sprawdź kod" w edytorze'}
                        </p>
                      </div>
                    </div>
                    {!exercisePassed && stepFilter !== 'all' && (
                      <button
                        type="button"
                        onClick={() => handleStepChange('3-cwiczenie', true)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-indigo-300 shrink-0"
                      >
                        {isEn ? 'Open editor' : 'Otwórz edytor'}
                      </button>
                    )}
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs ${
                      quizPassed
                        ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    {quizPassed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <HelpCircle className="h-4 w-4 text-amber-400 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold">
                        {isEn
                          ? `2. Checkpoint quiz (min. ${REQUIRED_QUIZ_SCORE}%)`
                          : `2. Quiz sprawdzający (min. ${REQUIRED_QUIZ_SCORE}%)`}
                      </p>
                      <p className="text-[11px] opacity-80">
                        {quizPassed
                          ? isEn
                            ? `Quiz passed (${quizScore ?? 100}%)`
                            : `Quiz zaliczony (${quizScore ?? 100}%)`
                          : quizScore !== null
                          ? isEn
                            ? `Score ${quizScore}% — min. ${REQUIRED_QUIZ_SCORE}% required`
                            : `Wynik ${quizScore}% — wymagane min. ${REQUIRED_QUIZ_SCORE}%`
                          : isEn
                          ? 'Answer the questions above and click "Check answers"'
                          : 'Odpowiedz na pytania powyżej i kliknij "Sprawdź odpowiedzi"'}
                      </p>
                    </div>
                  </div>
                </div>

                {verificationBanner && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2.5 ${
                      verificationBanner.type === 'success'
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    }`}
                  >
                    {verificationBanner.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertOctagon className="h-4 w-4 text-rose-400 shrink-0" />
                    )}
                    <span>{verificationBanner.message}</span>
                  </div>
                )}
              </div>
            )}

            {/* Interactive 3-Station Route Transition Card (Previous -> Current -> Next) */}
            <LessonRouteTransitionCard
              currentLesson={lesson}
              isCompleted={isCompleted}
              canCompleteLesson={canCompleteLesson}
              onVerifyAndComplete={handleVerifyAndComplete}
              onSelectLesson={(lessonId) => setActiveTab('lesson', lessonId)}
              onOpenFullMap={() => setActiveTab('modules')}
              mode="app"
            />
          </div>
        </div>
      )}
        </motion.div>
      </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
