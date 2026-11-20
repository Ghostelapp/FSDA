import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateLevel } from '../utils/gamification';
import { formatDaysLabel } from '../utils/i18n';
import { LearningProgressChart } from './LearningProgressChart';
import { DailyGoalReminderCard } from './DailyGoalReminderCard';
import { GoogleAdSenseBanner } from './GoogleAdSenseBanner';
import { RichInlineText } from './RichInlineText';
import {
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bell,
  AlertTriangle,
  FolderGit2,
  ChevronRight,
  TrendingUp,
  Zap,
  Code2,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    setActiveTab,
    localizedAnnouncements,
    weakAreas,
    allModules,
    allBadges,
    allLessons,
    allProjects,
    language,
  } = useApp();
  const isEn = language === 'en';
  const safeCompletedLessons = currentUser.completedLessons ?? [];
  const safeCompletedProjects = currentUser.completedProjects ?? [];
  const safeUnlockedBadges = currentUser.unlockedBadges ?? [];
  const safeStreakDays = currentUser.streakDays ?? 0;
  const levelInfo = calculateLevel(currentUser.xp ?? 0, language);

  // Calculate overall progress across curriculum
  const totalLessons = allLessons.length;
  const completedCount = safeCompletedLessons.length;

  // Next recommended lesson in strict pedagogical order
  const nextLesson = allLessons.find((l) => !safeCompletedLessons.includes(l.id)) || allLessons[0];
  const recommendedModuleId = nextLesson?.moduleId || 1;
  const [selectedDashboardModuleId, setSelectedDashboardModuleId] = React.useState<number>(recommendedModuleId);

  const activeModule = allModules.find((m) => m.id === selectedDashboardModuleId) || allModules[0];
  const activeModuleCompletedCount = activeModule.lessons.filter((l) =>
    safeCompletedLessons.includes(l.id)
  ).length;

  const isGuest = !isAuthenticated || currentUser.id === 'user-guest';
  const displayName = currentUser.name.replace(/\s*\(.*?\)\s*/g, '').trim();

  const getShortModuleLabel = (modId: number) => {
    if (modId === 1) return isEn ? 'Start Zero' : 'Start od zera';
    if (modId === 2) return 'HTML5';
    if (modId === 3) return 'CSS3';
    if (modId === 4) return 'JavaScript';
    return 'Git';
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8 space-y-4 sm:space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-4 sm:p-7 lg:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 2xl:grid-cols-12 gap-4 sm:gap-6 items-center">
          <div className="2xl:col-span-7 space-y-1.5 sm:space-y-2.5 min-w-0">
            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-indigo-300">
              <Zap className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span>
                {isEn
                  ? 'Zero to Junior Full Stack Developer Path'
                  : 'Ścieżka od Zera do Junior Full Stack Developera'}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug sm:leading-tight">
              {isGuest
                ? isEn
                  ? 'Welcome to the Academy, '
                  : 'Witaj w Akademii, '
                : isEn
                ? 'Welcome back, '
                : 'Witaj ponownie, '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                {isGuest ? (isEn ? 'future Developer' : 'przyszły Programisto') : displayName}
              </span>
              !
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed max-w-2xl">
              {isGuest ? (
                isEn ? (
                  <>
                    You are browsing the course in{' '}
                    <strong className="text-amber-300 font-semibold">Guest mode (Not signed in)</strong>.
                    You can start right away from Lesson 1 or sign in to sync your progress to the cloud.
                  </>
                ) : (
                  <>
                    Przeglądasz kurs w{' '}
                    <strong className="text-amber-300 font-semibold">trybie Gościa (Niezalogowany)</strong>.
                    Możesz od razu rozpocząć naukę od Lekcji 1 lub zalogować się, aby zapisywać postępy w chmurze.
                  </>
                )
              ) : isEn ? (
                <>
                  Your current rank: <strong className="text-indigo-300 font-semibold">{levelInfo.title}</strong>{' '}
                  (Level {levelInfo.level}). Lessons are structured step by step from the simplest basics to commercial projects.
                </>
              ) : (
                <>
                  Twój aktualny stopień: <strong className="text-indigo-300 font-semibold">{levelInfo.title}</strong>{' '}
                  (Poziom {levelInfo.level}). Lekcje są ułożone krok po kroku od najprostszych podstaw do zaawansowanych projektów.
                </>
              )}
            </p>
          </div>

          {/* Next Lesson Action Box */}
          <div className="2xl:col-span-5 w-full rounded-xl sm:rounded-2xl border border-indigo-500/30 bg-slate-950/75 p-3.5 sm:p-5 space-y-2.5 sm:space-y-3.5">
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                <span>{isEn ? 'Next learning step' : 'Następny krok w nauce'}</span>
                <span className="text-emerald-400 font-mono">
                  {isEn ? 'Module' : 'Moduł'} {nextLesson?.moduleId || 1} · {isEn ? 'Lesson' : 'Lekcja'}{' '}
                  {nextLesson?.order || 1}
                </span>
              </div>
              <p className="text-xs sm:text-base font-bold text-white line-clamp-2 leading-snug">
                <RichInlineText
                  text={
                    nextLesson
                      ? nextLesson.title
                      : isEn
                      ? 'First HTML Tags: Headings (<h1>–<h6>), Paragraphs (<p>), and Bold (<strong>)'
                      : 'Pierwsze znaczniki HTML: Nagłówki (<h1>–<h6>), akapity (<p>) i pogrubienie (<strong>)'
                  }
                />
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 pt-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('lesson', nextLesson?.id || 'html-7')}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold transition-all shadow-lg shadow-indigo-900/50 whitespace-nowrap"
              >
                <Code2 className="h-4 w-4 shrink-0" />
                <span>{isEn ? 'Continue lesson' : 'Kontynuuj lekcję'}</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('lesson', 'html-7')}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                <span>{isEn ? 'Lesson 1 (HTML Basics)' : 'Lekcja 1 (Podstawy HTML)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-4 pt-3.5 sm:mt-6 sm:pt-5 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between text-xs gap-1 mb-1.5 sm:mb-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="font-bold text-white shrink-0">
                {isEn ? 'Level' : 'Poziom'} {levelInfo.level}
              </span>
              <span className="text-slate-400 truncate">({levelInfo.title})</span>
            </div>
            <span className="font-mono text-indigo-300 font-semibold text-[11px] sm:text-xs shrink-0">
              {levelInfo.currentLevelXp} / {levelInfo.levelXpSpan} XP
            </span>
          </div>
          <div className="h-2 sm:h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* XP */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400">
              {isEn ? 'Experience Points' : 'Punkty Dośw.'}
            </span>
            <div className="rounded-lg bg-indigo-500/10 p-1.5 sm:p-2 text-indigo-400">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black text-white">
            {currentUser.xp} <span className="text-xs font-normal text-slate-400">XP</span>
          </p>
          <p className="mt-1 text-[10px] sm:text-[11px] text-emerald-400 flex items-center gap-1 font-medium truncate">
            <TrendingUp className="h-3 w-3 shrink-0" />
            <span>{isEn ? 'Active progress' : 'Aktywny postęp'}</span>
          </p>
        </div>

        {/* Streak */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400">
              {isEn ? 'Study Streak' : 'Seria Nauki'}
            </span>
            <div className="rounded-lg bg-amber-500/10 p-1.5 sm:p-2 text-amber-400">
              <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black text-white">
            {safeStreakDays}{' '}
            <span className="text-xs font-normal text-slate-400">
              {formatDaysLabel(safeStreakDays, language).replace(/^\d+\s*/, '')}
            </span>
          </p>
          <p className="mt-1 text-[10px] sm:text-[11px] text-amber-400 font-medium truncate">
            {isEn ? 'Keep the streak burning!' : 'Ogień dyscypliny!'}
          </p>
        </div>

        {/* Completed Lessons */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400">
              {isEn ? 'Completed Lessons' : 'Zaliczone Lekcje'}
            </span>
            <div className="rounded-lg bg-emerald-500/10 p-1.5 sm:p-2 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black text-white">
            {completedCount} <span className="text-xs font-normal text-slate-400">/ {totalLessons}</span>
          </p>
          <p className="mt-1 text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
            {isEn ? 'Module' : 'Moduł'} {activeModule.id}: {activeModuleCompletedCount} /{' '}
            {activeModule.lessons.length}
          </p>
        </div>

        {/* Completed Projects */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400">
              {isEn ? 'Projects' : 'Projekty'}
            </span>
            <div className="rounded-lg bg-cyan-500/10 p-1.5 sm:p-2 text-cyan-400">
              <FolderGit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black text-white">
            {safeCompletedProjects.length}{' '}
            <span className="text-xs font-normal text-slate-400">/ {allProjects.length}</span>
          </p>
          <p className="mt-1 text-[10px] sm:text-[11px] text-indigo-400 font-medium truncate">
            {isEn ? 'Building portfolio' : 'Budowa portfolio'}
          </p>
        </div>
      </div>

      {/* Google AdSense Display Unit */}
      <GoogleAdSenseBanner placement="dashboard" />

      {/* Daily Learning Goal & Service Worker Push Notification Scheduler */}
      <DailyGoalReminderCard />

      {/* 30-Day Learning Progress Visualization */}
      <LearningProgressChart currentUser={currentUser} modules={allModules} />

      {/* Weak Areas Banner if any */}
      {weakAreas.length > 0 && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isEn
                  ? `Areas requiring review detected (${weakAreas.length})`
                  : `Wykryto obszary wymagające powtórki (${weakAreas.length})`}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {isEn
                  ? 'Some knowledge quizzes scored below 80%. The smart review system recommends refreshing those topics.'
                  : 'Niektóre testy wiedzy uzyskały wynik poniżej 80%. System inteligentnych powtórek poleca odświeżenie materiału.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shrink-0"
          >
            {isEn ? 'Go to Reviews' : 'Przejdź do powtórek'}
          </button>
        </div>
      )}

      {/* Ordered Module & Lessons Showcase */}
      {activeModule && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
          {/* Quick Module Switcher (Modules 1-5 + All Modules Link) */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              {allModules.slice(0, 5).map((mod) => {
                const isSelected = mod.id === activeModule.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setSelectedDashboardModuleId(mod.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {isEn ? 'Module' : 'Moduł'} {mod.id}: {getShortModuleLabel(mod.id)}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('modules')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>
                {isEn ? `All ${allModules.length} modules` : `Wszystkie ${allModules.length} modułów`}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                <span>
                  {isEn
                    ? `Module ${activeModule.id} of ${allModules.length}`
                    : `Moduł ${activeModule.id} z ${allModules.length}`}
                </span>
                <span>•</span>
                <span>{activeModule.displayCategory}</span>
                <span>•</span>
                <span className="text-emerald-400">
                  {isEn ? 'Order: from simplest basics' : 'Kolejność: od najprostszych podstaw'}
                </span>
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-white">{activeModule.title}</h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                <RichInlineText text={activeModule.description} />
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400">
                {isEn ? 'Module progress' : 'Postęp modułu'}
              </span>
              <p className="text-lg font-black text-indigo-300 font-mono">
                {Math.round((activeModuleCompletedCount / (activeModule.lessons.length || 1)) * 100)}%
              </p>
            </div>
          </div>

          {/* Lessons List in Active Module */}
          <div className="space-y-3">
            {activeModule.lessons.map((lesson) => {
              const isDone = safeCompletedLessons.includes(lesson.id);
              const isNext = nextLesson?.id === lesson.id;
              const quizScore = currentUser.quizScores?.[lesson.id];

              return (
                <div
                  key={lesson.id}
                  onClick={() => setActiveTab('lesson', lesson.id)}
                  className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 transition-all cursor-pointer ${
                    isNext
                      ? 'border-indigo-500/60 bg-indigo-950/20 hover:bg-indigo-950/30'
                      : 'border-slate-800 bg-slate-950/70 hover:border-indigo-500/50 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`mt-0.5 sm:mt-0 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isNext
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {lesson.order}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {isEn ? 'Lesson' : 'Lekcja'} {lesson.order}: <RichInlineText text={lesson.title} />
                        </h4>
                        {isDone && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {isEn ? 'Completed' : 'Ukończono'}
                          </span>
                        )}
                        {isNext && !isDone && (
                          <span className="text-[11px] font-bold text-indigo-300">
                            {isEn ? '· Up next for you' : '· Teraz Twoja kolej'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                        <RichInlineText text={lesson.summary} />
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.durationMinutes} min
                        </span>
                        <span>•</span>
                        <span className="text-indigo-300 font-semibold">+{lesson.xpReward} XP</span>
                        <span>•</span>
                        <span>
                          <RichInlineText text={lesson.prerequisites.join(', ')} />
                        </span>
                        {quizScore !== undefined && (
                          <>
                            <span>•</span>
                            <span
                              className={
                                quizScore >= 80
                                  ? 'text-emerald-400 font-semibold'
                                  : 'text-amber-400 font-semibold'
                              }
                            >
                              Quiz: {quizScore}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <span className="text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      {isDone
                        ? isEn
                          ? 'Review lesson'
                          : 'Powtórz lekcję'
                        : isEn
                        ? 'Start learning'
                        : 'Rozpocznij naukę'}
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Badges & Achievements Section */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              <span>
                {isEn
                  ? `Badges & Achievements (${safeUnlockedBadges.length} / ${allBadges.length})`
                  : `Odznaki i Osiągnięcia (${safeUnlockedBadges.length} / ${allBadges.length})`}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isEn
                ? 'Collect badges for consistency, flawless quizzes, and completed projects.'
                : 'Gromadź odznaki za systematyczność, perfekcyjne quizy i ukończone projekty.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {allBadges.map((badge) => {
            const isUnlocked = safeUnlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-indigo-950/20 border-indigo-500/40 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-60 grayscale'
                }`}
              >
                <div
                  className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl mb-3 ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-indigo-600 to-amber-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Award className="h-6 w-6" />
                </div>
                <h4 className="text-xs font-bold text-white truncate">{badge.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
                <span
                  className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isUnlocked ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isUnlocked ? (isEn ? 'Unlocked' : 'Odblokowane') : isEn ? 'Locked' : 'Zablokowane'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <Bell className="h-5 w-5" />
          <h2 className="text-base font-bold text-white">
            {isEn ? 'Announcements & Updates' : 'Ogłoszenia i Aktualności'}
          </h2>
        </div>
        <div className="space-y-3">
          {localizedAnnouncements.map((ann) => (
            <div key={ann.id} className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-indigo-400">{ann.displayCategory}</span>
                <span className="text-slate-500">
                  {ann.date} • {ann.author}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-200">{ann.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{ann.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
