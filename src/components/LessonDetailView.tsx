import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Lesson } from '../types';
import { CodeEditor } from './CodeEditor';
import { CodeBlock } from './CodeBlock';
import { PostLessonQuiz } from './PostLessonQuiz';
import { GoogleAdSenseBanner } from './GoogleAdSenseBanner';
import { checkLessonCompletionEligibility } from '../utils/codeRunner';
import {
  parseTheoryBlocks,
  getBeginnerLessonAid,
  type InlineToken,
} from '../utils/lessonReadability';
import {
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Code,
  HelpCircle,
  AlertOctagon,
  Sparkles,
  CheckSquare,
  Award,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  XCircle,
  FileText,
  Heart,
  Lock,
  Compass,
  Type,
  Layers,
} from 'lucide-react';

interface LessonDetailViewProps {
  lesson: Lesson;
}

type LessonStepFilter = 'all' | 'theory' | 'examples' | 'practice' | 'quiz';
type FontScale = 'normal' | 'large';

const renderInlineTokens = (tokens: InlineToken[]) => {
  return tokens.map((token, idx) => {
    if (token.type === 'bold') {
      return (
        <strong key={idx} className="font-semibold text-white">
          {token.content}
        </strong>
      );
    }
    if (token.type === 'code') {
      let colorClass = 'text-indigo-200 bg-indigo-950/70 border-indigo-500/30';
      if (token.category === 'html') {
        colorClass = 'text-rose-200 bg-rose-950/70 border-rose-500/30';
      } else if (token.category === 'css') {
        colorClass = 'text-cyan-200 bg-cyan-950/70 border-cyan-500/30';
      } else if (token.category === 'cli') {
        colorClass = 'text-emerald-200 bg-emerald-950/70 border-emerald-500/30';
      } else if (token.category === 'js') {
        colorClass = 'text-amber-200 bg-amber-950/70 border-amber-500/30';
      }
      return (
        <code
          key={idx}
          className={`inline-block rounded-md border px-1.5 py-0.5 font-mono text-[0.9em] font-medium align-baseline mx-0.5 ${colorClass}`}
        >
          {token.content}
        </code>
      );
    }
    return <React.Fragment key={idx}>{token.content}</React.Fragment>;
  });
};

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({ lesson }) => {
  const {
    currentUser,
    completeLesson,
    saveQuizScore,
    saveCodeSnippet,
    setActiveTab,
    allLessons,
    loseLife,
    livesInfo,
    setIsLivesModalOpen,
    awardCustomXp,
  } = useApp();

  const isCompleted = currentUser.completedLessons.includes(lesson.id);
  const currentLives = currentUser.isPro ? 5 : (livesInfo.currentLives ?? currentUser.lives ?? 5);

  // Reading & Pedagogical State
  const [stepFilter, setStepFilter] = useState<LessonStepFilter>('all');
  const [fontScale, setFontScale] = useState<FontScale>('normal');
  const [beginnerMode, setBeginnerMode] = useState<boolean>(true);
  const [showExerciseGuide, setShowExerciseGuide] = useState<boolean>(true);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Automated exercise & quiz verification state
  const [exercisePassedInSession, setExercisePassedInSession] = useState<boolean>(false);
  const [showPostLessonQuiz, setShowPostLessonQuiz] = useState<boolean>(false);

  useEffect(() => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setExercisePassedInSession(false);
    setShowPostLessonQuiz(false);
    setStepFilter('all');
  }, [lesson.id]);

  const theoryBlocks = useMemo(() => parseTheoryBlocks(lesson.theoryMarkdown), [lesson.theoryMarkdown]);
  const beginnerAid = useMemo(() => getBeginnerLessonAid(lesson), [lesson]);

  const hasClaimedExercise = Boolean(
    currentUser.claimedRewards?.includes(`exercise-${lesson.interactiveExercise.id}`)
  );
  const isExercisePassed = isCompleted || exercisePassedInSession || hasClaimedExercise;
  const bestQuizScore = currentUser.quizScores?.[lesson.id] ?? 0;
  const eligibility = checkLessonCompletionEligibility({
    isExercisePassed,
    quizScore: isCompleted ? Math.max(80, bestQuizScore) : bestQuizScore,
    requiredQuizScore: 80,
  });

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleEvaluateQuiz = () => {
    if (!currentUser.isPro && currentLives <= 0) {
      setIsLivesModalOpen(true);
      return;
    }

    setQuizSubmitted(true);
    let correctCount = 0;
    lesson.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    const scorePercent = Math.round((correctCount / lesson.quiz.length) * 100);
    saveQuizScore(lesson.id, scorePercent);

    if (scorePercent < 80) {
      loseLife(`Wynik testu: ${scorePercent}%. Tracisz 1 serce! Przeanalizuj poniższe wyjaśnienia.`);
    } else if (isExercisePassed && !isCompleted) {
      completeLesson(lesson.id, lesson.xpReward);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const handleCompleteLessonAction = () => {
    if (!eligibility.canComplete && !isCompleted) {
      return;
    }
    completeLesson(lesson.id, lesson.xpReward);
    setShowPostLessonQuiz(true);
    setTimeout(() => {
      document.getElementById('post-lesson-quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Find previous and next lessons
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const bodySizeClass = fontScale === 'large' ? 'text-lg leading-8' : 'text-base leading-7';
  const subSizeClass = fontScale === 'large' ? 'text-base leading-7' : 'text-sm leading-6';

  const showTheorySection = stepFilter === 'all' || stepFilter === 'theory';
  const showExamplesSection = stepFilter === 'all' || stepFilter === 'examples';
  const showPracticeSection = stepFilter === 'all' || stepFilter === 'practice';
  const showQuizSection = stepFilter === 'all' || stepFilter === 'quiz';

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Breadcrumb & Reading Comfort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('modules')}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Powrót do modułów</span>
          </button>

          {prevLesson && (
            <button
              type="button"
              onClick={() => setActiveTab('lesson', prevLesson.id)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span>Poprzednia lekcja</span>
            </button>
          )}
        </div>

        {/* Reading Comfort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setBeginnerMode((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors border ${
              beginnerMode
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Tryb „Od Zera” (Analogie i Słowniczek): {beginnerMode ? 'Włączony' : 'Wyłączony'}</span>
          </button>

          <div className="flex items-center gap-1 rounded-lg bg-slate-900 border border-slate-800 p-1">
            <button
              type="button"
              onClick={() => setFontScale('normal')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                fontScale === 'normal'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Standardowy rozmiar tekstu (16px)"
            >
              A (Standard)
            </button>
            <button
              type="button"
              onClick={() => setFontScale('large')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                fontScale === 'large'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Powiększony rozmiar tekstu (18px) dla wygodniejszego czytania"
            >
              A+ (Duży tekst)
            </button>
          </div>
        </div>
      </div>

      {/* Editorial Lesson Header (Clean unboxed metadata per frontend-design) */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-slate-400">
          <span className="text-indigo-400 font-semibold">{lesson.moduleTitle}</span>
          <span aria-hidden="true">·</span>
          <span>Lekcja {lesson.order}</span>
          <span aria-hidden="true">·</span>
          <span>Poziom: <strong className="text-emerald-400 font-semibold">{beginnerAid.difficultyLabel}</strong></span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{lesson.durationMinutes} min nauki</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-indigo-300">+{lesson.xpReward} XP</span>
          {isCompleted && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" />
                Ukończono
              </span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight max-w-3xl leading-tight">
          {lesson.title}
        </h1>

        <p className={`${bodySizeClass} text-slate-200 max-w-[70ch]`}>
          {lesson.summary}
        </p>
      </header>

      {/* Step-by-Step Interactive Mode Selector (Reduces cognitive load) */}
      <nav
        aria-label="Etapy nauki w lekcji"
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-2"
      >
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'all', label: 'Pełna lekcja (Wszystko)' },
            { id: 'theory', label: 'Krok 1: Wyjaśnienie od zera' },
            { id: 'examples', label: 'Krok 2: Przykłady i błędy' },
            { id: 'practice', label: 'Krok 3: Ćwiczenie w edytorze' },
            { id: 'quiz', label: 'Krok 4: Quiz i zaliczenie' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStepFilter(tab.id as LessonStepFilter)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                stepFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* BEGINNER ANALOGY & GENTLE INTRO BANNER */}
      {beginnerMode && showTheorySection && (
        <section
          aria-label="Wyjaśnienie na chłopski rozum dla początkujących"
          className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-6 sm:p-7 space-y-5"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Compass className="h-4 w-4 shrink-0" />
              <span>Wprowadzenie bez żargonu · {beginnerAid.difficultyLabel}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {beginnerAid.analogyTitle}
            </h2>
            <p className={`${bodySizeClass} text-slate-200 max-w-[72ch]`}>
              {beginnerAid.analogyText}
            </p>
          </div>

          {/* Simple Glossary Grid */}
          <div className="pt-4 border-t border-emerald-500/20 space-y-3">
            <h3 className="text-xs font-semibold text-emerald-300">
              Słowniczek pojęć z tej lekcji (prostymi słowami):
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {beginnerAid.glossary.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-4 space-y-1"
                >
                  <div className="text-sm font-bold text-white font-mono">
                    {item.term}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.simpleDefinition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 1 & 2: Cel lekcji + Wyjaśnienie prostym językiem */}
      {showTheorySection && (
        <>
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-2.5">
              <BookOpen className="h-5 w-5 text-indigo-400 shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold text-white">
                1. Cel lekcji — co opanujesz krok po kroku
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300">
                  Po tej lekcji będziesz potrafić:
                </h3>
                <ul className={`space-y-2.5 ${subSizeClass} text-slate-200`}>
                  {lesson.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300">
                  Co warto wiedzieć przed startem:
                </h3>
                <ul className={`space-y-2.5 ${subSizeClass} text-slate-200`}>
                  {lesson.prerequisites.map((pre, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <ChevronRight className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{pre}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-400 pt-1">
                  {beginnerAid.difficultySummary}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2: Structured, High-Legibility Theory Blocks */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-indigo-400 shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  2. Wyjaśnienie prostym językiem
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                Czytaj spokojnie — nie musisz uczyć się definicji na pamięć
              </span>
            </div>

            <div className={`space-y-6 text-slate-100 ${bodySizeClass}`}>
              {theoryBlocks.map((block, bIdx) => {
                if (block.type === 'heading') {
                  return (
                    <h3
                      key={bIdx}
                      className="pt-2 text-lg sm:text-xl font-bold text-white tracking-tight"
                    >
                      {block.title}
                    </h3>
                  );
                }

                if (block.type === 'paragraph') {
                  return (
                    <p key={bIdx} className="max-w-[72ch] text-slate-200">
                      {renderInlineTokens(block.tokens)}
                    </p>
                  );
                }

                if (block.type === 'ordered_list') {
                  return (
                    <div key={bIdx} className="space-y-3 max-w-3xl">
                      {block.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className="flex items-start gap-4 rounded-xl border border-slate-800/90 bg-slate-950/70 p-4"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 border border-indigo-500/30 font-mono text-sm font-bold text-indigo-300">
                            {item.number}
                          </span>
                          <div className="space-y-1 text-slate-200">
                            {item.title && item.title.length > 0 && (
                              <div className="font-bold text-white">
                                {renderInlineTokens(item.title)}
                              </div>
                            )}
                            <div>{renderInlineTokens(item.body)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                if (block.type === 'unordered_list') {
                  return (
                    <ul key={bIdx} className="space-y-2.5 max-w-[72ch] pl-1">
                      {block.items.map((itemTokens, uIdx) => (
                        <li
                          key={uIdx}
                          className="flex items-start gap-3 text-slate-200"
                        >
                          <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0 mt-1" />
                          <span>{renderInlineTokens(itemTokens)}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                if (block.type === 'code_block') {
                  return (
                    <div key={bIdx} className="max-w-3xl">
                      <CodeBlock
                        code={block.code}
                        language={block.language}
                        title="Przykład w treści lekcji"
                        badge={block.language.toUpperCase()}
                        badgeColor="indigo"
                        showLineNumbers={false}
                      />
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {stepFilter === 'theory' && (
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStepFilter('examples')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
                >
                  <span>Przejdź do Kroku 2: Przykłady kodu</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>
        </>
      )}

      {/* SECTION 3, 4 & 8: Przykład kodu, Krok po kroku, Typowe błędy */}
      {showExamplesSection && (
        <>
          <section className="space-y-5">
            <div className="flex items-center gap-2.5">
              <Code className="h-5 w-5 text-indigo-400 shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold text-white">
                3. Przykład gotowego kodu z objaśnieniem
              </h2>
            </div>

            <div className="space-y-5">
              {lesson.codeExamples.map((example, idx) => (
                <div key={idx} className="space-y-3">
                  <CodeBlock
                    code={example.code}
                    language={example.language}
                    title={example.title}
                    badge={example.language.toUpperCase()}
                    badgeColor="indigo"
                  />
                  <div className={`rounded-xl border border-slate-800 bg-slate-900/80 p-4 ${subSizeClass} text-slate-200 flex items-start gap-3`}>
                    <Lightbulb className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-white">Co robi ten kod? </strong>
                      <span>{example.explanation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: Wyjaśnienie kodu krok po kroku */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Layers className="h-5 w-5 text-indigo-400 shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold text-white">
                4. Jak powtórzyć to krok po kroku
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lesson.stepByStepGuide.map((step) => (
                <div
                  key={step.step}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 font-mono text-xs font-bold text-white">
                      {step.step}
                    </span>
                    <h3 className="text-sm font-bold text-white">{step.title}</h3>
                  </div>
                  <p className={`${subSizeClass} text-slate-300`}>{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 8: Typowe błędy i sposób ich naprawy */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <AlertOctagon className="h-5 w-5 text-rose-400 shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold text-white">
                5. Częste pułapki początkujących (Czego unikać)
              </h2>
            </div>
            <div className="space-y-4">
              {lesson.commonMistakes.map((mistake, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4"
                >
                  <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
                    <AlertOctagon className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>Błąd: {mistake.mistake}</span>
                  </h3>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${subSizeClass}`}>
                    <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3.5 text-slate-300">
                      <strong className="text-slate-200 block mb-1">Dlaczego się zdarza:</strong>
                      {mistake.whyItHappens}
                    </div>
                    <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/30 p-3.5 text-slate-200">
                      <strong className="text-emerald-300 block mb-1">Jak łatwo naprawić:</strong>
                      {mistake.howToFix}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <CodeBlock
                      code={mistake.badCode}
                      language={lesson.codeExamples[0]?.language || 'javascript'}
                      title="Błędny zapis"
                      badge="Błąd"
                      badgeColor="rose"
                      showLineNumbers={false}
                    />
                    <CodeBlock
                      code={mistake.goodCode}
                      language={lesson.codeExamples[0]?.language || 'javascript'}
                      title="Prawidłowy zapis"
                      badge="Poprawnie"
                      badgeColor="emerald"
                      showLineNumbers={false}
                    />
                  </div>
                </div>
              ))}
            </div>

            {stepFilter === 'examples' && (
              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStepFilter('theory')}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-sm font-semibold"
                >
                  Wróć do teorii
                </button>
                <button
                  type="button"
                  onClick={() => setStepFilter('practice')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
                >
                  <span>Przejdź do Kroku 3: Ćwiczenie w edytorze</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>
        </>
      )}

      {/* SECTION 5, 6 & 9: Interaktywne ćwiczenie z prowadzeniem za rękę */}
      {showPracticeSection && (
        <>
          <section id="lesson-code-editor" className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-indigo-400 shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  6. Praktyczne ćwiczenie w edytorze (Z podpowiedziami)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowExerciseGuide((prev) => !prev)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {showExerciseGuide ? 'Ukryj ściągę do zadania' : 'Pokaż ściągę krok po kroku'}
              </button>
            </div>

            {/* Step-by-step Hand-holding Box for Beginners */}
            {showExerciseGuide && (
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Jak rozwiązać to ćwiczenie bez stresu?</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    W edytorze masz też przycisk „Rozwiązanie”, jeśli utkniesz
                  </span>
                </div>
                <ol className={`space-y-2 ${subSizeClass} text-slate-200`}>
                  {beginnerAid.exerciseWalkthrough.map((stepText, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs font-bold text-indigo-400 mt-1">
                        {idx + 1}.
                      </span>
                      <span>{stepText}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <CodeEditor
              exercise={lesson.interactiveExercise}
              onSuccess={() => {
                setExercisePassedInSession(true);
                awardCustomXp(
                  25,
                  `Zaliczono ćwiczenie w edytorze: ${lesson.interactiveExercise.title}`,
                  `exercise-${lesson.interactiveExercise.id}`
                );
                if (eligibility.isQuizPassed && !isCompleted) {
                  completeLesson(lesson.id, lesson.xpReward);
                }
              }}
              savedCode={currentUser.savedCode?.[lesson.interactiveExercise.id]}
              onSave={(code) => saveCodeSnippet(lesson.interactiveExercise.id, code)}
            />
          </section>

          {/* SECTION 6 & 9: Zadanie dla chętnych */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <Lightbulb className="h-5 w-5 shrink-0" />
                <h2 className="text-base font-bold text-white">
                  Zadanie dodatkowe (Dla chętnych)
                </h2>
              </div>
              <h3 className="text-sm font-bold text-slate-100">
                {lesson.independentTask.title}
              </h3>
              <p className={`${subSizeClass} text-slate-300`}>
                {lesson.independentTask.instructions}
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                <div className="font-semibold text-indigo-300">
                  Oczekiwany efekt: {lesson.independentTask.expectedOutcome}
                </div>
                <p className="text-amber-300">
                  Podpowiedź: {lesson.independentTask.starterHint}
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <Award className="h-5 w-5 shrink-0" />
                <h2 className="text-base font-bold text-white">
                  Mini-ćwiczenie na własnym komputerze
                </h2>
              </div>
              <h3 className="text-sm font-bold text-white">
                {lesson.practicalTask.title}
              </h3>
              <p className={`${subSizeClass} text-slate-300`}>
                {lesson.practicalTask.brief}
              </p>
              <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1">
                {lesson.practicalTask.steps.map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ol>
            </section>
          </div>

          {stepFilter === 'practice' && (
            <div className="pt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setStepFilter('examples')}
                className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-sm font-semibold"
              >
                Wróć do przykładów
              </button>
              <button
                type="button"
                onClick={() => setStepFilter('quiz')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
              >
                <span>Przejdź do Kroku 4: Quiz i zaliczenie</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Google AdSense Display Unit (Shown only to authenticated Free-tier students) */}
      <GoogleAdSenseBanner placement="lesson" />

      {/* SECTION 7 & 10: Test wiedzy i Zaliczenie */}
      {showQuizSection && (
        <>
          <section className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="h-5 w-5 text-indigo-400 shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  7. Krótki test sprawdzający (Quiz)
                </h2>
              </div>
              {currentUser.quizScores?.[lesson.id] !== undefined && (
                <span className="text-xs font-semibold text-indigo-300">
                  Twój najlepszy wynik: <strong className="font-mono">{currentUser.quizScores[lesson.id]}%</strong>
                </span>
              )}
            </div>

            <div className="space-y-4">
              {lesson.quiz.map((q, qIndex) => {
                const userAnswer = selectedAnswers[q.id];
                const isCorrect = userAnswer === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4"
                  >
                    <p className="text-base font-bold text-white">
                      Pytanie {qIndex + 1}: {q.question}
                    </p>

                    <div className="space-y-2.5">
                      {q.options.map((opt, optIndex) => {
                        const isSelected = userAnswer === optIndex;
                        let optionStyle =
                          'border-slate-800 bg-slate-950/70 text-slate-200 hover:bg-slate-800/80';

                        if (quizSubmitted) {
                          if (optIndex === q.correctAnswer) {
                            optionStyle =
                              'border-emerald-500/60 bg-emerald-950/40 text-emerald-200 font-semibold';
                          } else if (isSelected && !isCorrect) {
                            optionStyle =
                              'border-rose-500/60 bg-rose-950/40 text-rose-200';
                          } else {
                            optionStyle =
                              'border-slate-800/40 bg-slate-950/30 text-slate-500 opacity-60';
                          }
                        } else if (isSelected) {
                          optionStyle =
                            'border-indigo-500 bg-indigo-950/50 text-white font-semibold';
                        }

                        return (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() => handleSelectAnswer(q.id, optIndex)}
                            className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && optIndex === q.correctAnswer && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 ml-2" />
                            )}
                            {quizSubmitted && isSelected && !isCorrect && (
                              <XCircle className="h-4 w-4 text-rose-400 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="pt-3 text-sm text-slate-300 border-t border-slate-800/80 mt-3">
                        <strong className="font-semibold text-white">Wyjaśnienie: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Out of lives prompt if 0 lives on Free tier */}
            {!currentUser.isPro && currentLives <= 0 && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-rose-300">
                  <Heart className="h-5 w-5 text-rose-500 fill-rose-500 shrink-0" />
                  <div>
                    <span className="font-bold">Brak serc do weryfikacji quizu!</span>
                    <p className="text-[11px] text-slate-300">
                      Odnów serce za darmo w szybkiej powtórce lub wymień XP w sklepie.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLivesModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 transition-colors"
                >
                  Uzupełnij serca (+1 ❤️)
                </button>
              </div>
            )}

            <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
              {!quizSubmitted ? (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={Object.keys(selectedAnswers).length < lesson.quiz.length}
                    onClick={handleEvaluateQuiz}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-bold transition-all shadow-md shadow-indigo-900/40 flex items-center gap-2"
                  >
                    <span>Zatwierdź odpowiedzi</span>
                    {!currentUser.isPro && (
                      <span className="inline-flex items-center gap-1 text-xs bg-indigo-700/60 px-2 py-0.5 rounded-md font-mono">
                        <Heart className="h-3 w-3 fill-rose-400 text-rose-400" />
                        Koszt błędu: 1 ❤️
                      </span>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-sm text-slate-200 hover:text-white"
                >
                  Spróbuj ponownie
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsLivesModalOpen(true)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Heart
                  className={`h-3.5 w-3.5 ${
                    currentUser.isPro
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-rose-500 text-rose-500'
                  }`}
                />
                <span>
                  {currentUser.isPro
                    ? 'Nielimitowane podejścia PRO'
                    : `Dostępne serca: ${currentLives}/5`}
                </span>
              </button>
            </div>
          </section>

          {/* SECTION 10: Podsumowanie i automatyczna weryfikacja zaliczenia */}
          <section className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckSquare className="h-5 w-5" />
                <h2 className="text-base sm:text-lg font-bold text-white">
                  8. Automatyczna weryfikacja zaliczenia lekcji
                </h2>
              </div>
              <span
                className={`text-xs font-semibold ${
                  isCompleted || eligibility.canComplete
                    ? 'text-emerald-300'
                    : 'text-amber-300'
                }`}
              >
                {isCompleted
                  ? 'Lekcja ukończona i zweryfikowana'
                  : eligibility.canComplete
                  ? 'Wszystkie wymagania spełnione (2/2)'
                  : `Wymagane wykonanie zadań (${
                      (eligibility.isExercisePassed ? 1 : 0) +
                      (eligibility.isQuizPassed ? 1 : 0)
                    }/2)`}
              </span>
            </div>

            <p className="text-sm text-slate-300">
              Zaliczenie lekcji oraz przyznanie punktów XP odbywa się po przejściu testów w edytorze kodu oraz zdaniu quizu sprawdzającego:
            </p>

            {/* Automated Verification Gates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                  eligibility.isExercisePassed
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {eligibility.isExercisePassed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Lock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p className="font-bold text-white">1. Ćwiczenie praktyczne w edytorze</p>
                    <p className="text-slate-300">
                      {eligibility.isExercisePassed
                        ? `Zaliczono 100% testów kodu (${lesson.interactiveExercise.title})`
                        : 'Napisz kod w edytorze i kliknij "Sprawdź kod", aby zaliczyć testy.'}
                    </p>
                  </div>
                </div>
                {!eligibility.isExercisePassed && (
                  <button
                    type="button"
                    onClick={() => {
                      setStepFilter('all');
                      setTimeout(() => {
                        document
                          .getElementById('lesson-code-editor')
                          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 50);
                    }}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                  >
                    Do edytora
                  </button>
                )}
              </div>

              <div
                className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                  eligibility.isQuizPassed
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {eligibility.isQuizPassed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Lock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p className="font-bold text-white">2. Test wiedzy (min. 80%)</p>
                    <p className="text-slate-300">
                      {eligibility.isQuizPassed
                        ? `Zdano quiz z wynikiem ${Math.max(80, bestQuizScore)}%`
                        : `Wymagane minimum 80% poprawnych odpowiedzi (Twój wynik: ${bestQuizScore}%).`}
                    </p>
                  </div>
                </div>
                {!eligibility.isQuizPassed && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowPostLessonQuiz(true);
                      setTimeout(() => {
                        document
                          .getElementById('post-lesson-quiz')
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                  >
                    Rozwiąż quiz
                  </button>
                )}
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={!eligibility.canComplete && !isCompleted}
                  onClick={handleCompleteLessonAction}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg ${
                    isCompleted
                      ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                      : eligibility.canComplete
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-75'
                  }`}
                >
                  {isCompleted || eligibility.canComplete ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  <span>
                    {isCompleted
                      ? 'Lekcja zaliczona — Otwórz quiz podsumowujący'
                      : eligibility.canComplete
                      ? `Zatwierdź ukończenie lekcji (+${lesson.xpReward} XP)`
                      : `Zablokowane — wykonaj ćwiczenie i quiz (+${lesson.xpReward} XP)`}
                  </span>
                </button>

                {!showPostLessonQuiz && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowPostLessonQuiz(true);
                      setTimeout(() => {
                        document
                          .getElementById('post-lesson-quiz')
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-indigo-500/30 bg-indigo-950/30 hover:bg-indigo-900/40 text-indigo-300 text-xs sm:text-sm font-bold transition-colors"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Uruchom interaktywny quiz</span>
                  </button>
                )}
              </div>

              {/* Next Lesson Button */}
              {nextLesson && (
                <button
                  type="button"
                  onClick={() => setActiveTab('lesson', nextLesson.id)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold transition-colors"
                >
                  <span>Następna lekcja: {nextLesson.title}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </section>
        </>
      )}

      {/* INTERACTIVE POST-LESSON QUIZ */}
      {(isCompleted || showPostLessonQuiz) && (
        <PostLessonQuiz
          lesson={lesson}
          nextLesson={nextLesson}
          isExercisePassed={eligibility.isExercisePassed}
          onNavigateNext={() => {
            if (nextLesson) {
              setActiveTab('lesson', nextLesson.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        />
      )}
    </div>
  );
};
