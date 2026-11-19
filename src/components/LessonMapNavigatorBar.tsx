import React, { useMemo, useState } from 'react';
import { Lesson } from '../types';
import { useApp } from '../context/AppContext';
import {
  buildCurriculumMap,
  getLessonTransitionContext,
} from '../utils/curriculumMap';
import { RichInlineText } from './RichInlineText';
import {
  Map as MapIcon,
  Check,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Compass,
  Flag,
  Sparkles,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface LessonMapNavigatorBarProps {
  currentLesson: Lesson;
  mode: 'app' | 'public';
  onSelectLesson: (lessonId: string) => void;
  onOpenFullMap: () => void;
}

export const LessonMapNavigatorBar: React.FC<LessonMapNavigatorBarProps> = ({
  currentLesson,
  mode,
  onSelectLesson,
  onOpenFullMap,
}) => {
  const { allModules, currentUser, language } = useApp();
  const isEn = language === 'en';
  const [isAtlasDrawerOpen, setIsAtlasDrawerOpen] = useState(false);
  const [atlasSelectedModuleId, setAtlasSelectedModuleId] = useState<number>(
    currentLesson.moduleId
  );

  // Sync selected module in drawer when currentLesson changes
  React.useEffect(() => {
    setAtlasSelectedModuleId(currentLesson.moduleId);
  }, [currentLesson.moduleId]);

  const mapSummary = useMemo(
    () =>
      buildCurriculumMap({
        modules: allModules,
        completedLessonIds: currentUser.completedLessons,
        quizScores: currentUser.quizScores,
        savedCode: currentUser.savedCode,
        activeLessonId: currentLesson.id,
      }),
    [
      allModules,
      currentUser.completedLessons,
      currentUser.quizScores,
      currentUser.savedCode,
      currentLesson.id,
    ]
  );

  const transitionCtx = useMemo(
    () => getLessonTransitionContext(mapSummary, currentLesson.id),
    [mapSummary, currentLesson.id]
  );

  const { currentNode, prevNode, nextNode, moduleZone, isCrossingModuleBoundaryOnNext } =
    transitionCtx;

  const inspectedAtlasZone = useMemo(
    () =>
      mapSummary.zones.find((z) => z.module.id === atlasSelectedModuleId) ||
      moduleZone ||
      mapSummary.zones[0],
    [mapSummary.zones, atlasSelectedModuleId, moduleZone]
  );

  if (!moduleZone || !currentNode) return null;

  return (
    <section
      data-testid="lesson-map-navigator"
      aria-label={isEn ? 'Interactive lesson map navigator' : 'Interaktywna mapa nawigacji lekcji'}
      className="rounded-2xl border border-slate-800/90 bg-slate-900/80 shadow-xl overflow-hidden"
    >
      {/* Row 1: Zone Header, Prev/Next Station Hop, and 96-Station Atlas Toggle */}
      <div className="p-4 sm:px-6 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Back to Map & Full Zone Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenFullMap}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <MapIcon className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span>{isEn ? 'Course Map' : 'Mapa kursu'}</span>
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 font-mono tabular-nums">
              <span className="font-bold text-indigo-400">
                {isEn ? 'Zone' : 'Strefa'} {String(moduleZone.module.id).padStart(2, '0')}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {isEn ? 'Station' : 'Stacja'} {currentNode.indexInModule} / {moduleZone.totalCount}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                #{currentNode.globalIndex} / {mapSummary.totalLessonsCount}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-white truncate">
              {moduleZone.module.title}
            </p>
          </div>
        </div>

        {/* Right: Quick Prev/Next Station Hop & Expand Full 15-Zone Atlas Drawer */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <div className="inline-flex items-center gap-1.5">
            <button
              type="button"
              disabled={!prevNode}
              onClick={() => prevNode && onSelectLesson(prevNode.lesson.id)}
              title={
                prevNode
                  ? `${isEn ? 'Previous station' : 'Poprzednia stacja'}: ${prevNode.lesson.title}`
                  : undefined
              }
              aria-label={isEn ? 'Previous lesson station' : 'Poprzednia stacja lekcji'}
              className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-35 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{isEn ? 'Prev' : 'Poprzednia'}</span>
            </button>

            <button
              type="button"
              disabled={!nextNode}
              onClick={() => nextNode && onSelectLesson(nextNode.lesson.id)}
              title={
                nextNode
                  ? `${isEn ? 'Next station' : 'Następna stacja'}: ${nextNode.lesson.title}`
                  : undefined
              }
              aria-label={isEn ? 'Next lesson station' : 'Następna stacja lekcji'}
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-35 ${
                isCrossingModuleBoundaryOnNext
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200 hover:bg-amber-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <span>
                {isCrossingModuleBoundaryOnNext
                  ? isEn
                    ? `Zone ${nextNode?.moduleId}`
                    : `Strefa ${nextNode?.moduleId}`
                  : isEn
                  ? 'Next'
                  : 'Następna'}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAtlasDrawerOpen((v) => !v)}
            aria-expanded={isAtlasDrawerOpen}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              isAtlasDrawerOpen
                ? 'border-indigo-500/50 bg-indigo-950/60 text-indigo-200'
                : 'border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span>
              {isAtlasDrawerOpen
                ? isEn
                  ? 'Hide map'
                  : 'Zwiń mapę'
                : isEn
                ? 'All 96 stations'
                : 'Mapa (96 stacji)'}
            </span>
            {isAtlasDrawerOpen ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Row 2: Full-Width Interactive Connected Station Track for Current Module */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 px-4 sm:px-6 py-2.5 flex items-center gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap shrink-0 hidden sm:inline">
          {isEn ? 'Zone Stations:' : 'Stacje strefy:'}
        </span>
        <div
          role="navigation"
          aria-label={
            isEn
              ? `Stations in Module ${moduleZone.module.id}`
              : `Stacje w Module ${moduleZone.module.id}`
          }
          className="flex items-center gap-1 overflow-x-auto py-1 flex-1"
        >
          {moduleZone.nodes.map((node, idx) => {
            const isActive = node.lesson.id === currentLesson.id;
            const isDone = node.status === 'completed';
            const isLast = idx === moduleZone.nodes.length - 1;

            return (
              <React.Fragment key={node.lesson.id}>
                <button
                  type="button"
                  onClick={() => onSelectLesson(node.lesson.id)}
                  title={`${isEn ? 'Station' : 'Stacja'} ${node.moduleId}.${node.indexInModule}: ${node.lesson.title}`}
                  aria-label={`${isEn ? 'Station' : 'Stacja'} ${node.moduleId}.${node.indexInModule}: ${node.lesson.title}`}
                  aria-current={isActive ? 'step' : undefined}
                  className={`group relative flex h-8 min-w-[38px] px-2.5 items-center justify-center rounded-lg font-mono text-xs font-extrabold transition-all shrink-0 tabular-nums cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950 ring-2 ring-indigo-400/60'
                      : isDone
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {isDone && !isActive ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : node.isMilestoneNode && !isActive ? (
                    <Flag className="h-3.5 w-3.5 text-amber-400" />
                  ) : (
                    <span>
                      {node.moduleId}.{node.indexInModule}
                    </span>
                  )}
                </button>

                {!isLast && (
                  <div
                    aria-hidden="true"
                    className={`h-0.5 w-2.5 sm:w-4 shrink-0 rounded-full ${
                      isDone ? 'bg-emerald-500/50' : 'bg-slate-800'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Expandable Interactive 15-Zone Mini-Atlas Drawer (Teleport to any lesson without leaving view) */}
      {isAtlasDrawerOpen && (
        <div
          data-testid="lesson-atlas-drawer"
          className="border-t border-slate-800 bg-slate-950/90 p-5 space-y-4 animate-in slide-in-from-top-1 duration-150"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Compass className="h-4 w-4 text-indigo-400" />
              <span>
                {isEn
                  ? 'Interactive Course Atlas — Switch zone or teleport directly to any station'
                  : 'Interaktywny Atlas Kursu — Wybierz strefę i przeskocz bezpośrednio do dowolnej stacji'}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {mode === 'app'
                ? `${mapSummary.completedLessonsCount}/${mapSummary.totalLessonsCount} (${mapSummary.overallPercent}%)`
                : `${mapSummary.totalModulesCount} ${isEn ? 'zones' : 'stref'} · ${mapSummary.totalLessonsCount} ${isEn ? 'lessons' : 'lekcji'}`}
            </span>
          </div>

          {/* 15 Zone Pills Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5">
            {mapSummary.zones.map((z) => {
              const selected = z.module.id === inspectedAtlasZone?.module.id;
              const isCurrentLessonZone = z.module.id === currentLesson.moduleId;
              return (
                <button
                  key={z.module.id}
                  type="button"
                  onClick={() => setAtlasSelectedModuleId(z.module.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    selected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : z.isZoneCompleted
                      ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/60'
                      : isCurrentLessonZone
                      ? 'bg-slate-800 border border-indigo-500/40 text-indigo-200'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-mono tabular-nums">
                    {String(z.module.id).padStart(2, '0')}
                  </span>
                  <span className="truncate max-w-[150px]">{z.module.title}</span>
                  {z.isZoneCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          {/* Stations Grid for Selected Atlas Zone */}
          {inspectedAtlasZone && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
              {inspectedAtlasZone.nodes.map((node) => {
                const isCurrent = node.lesson.id === currentLesson.id;
                const isDone = node.status === 'completed';

                return (
                  <button
                    key={node.lesson.id}
                    type="button"
                    onClick={() => {
                      onSelectLesson(node.lesson.id);
                      setIsAtlasDrawerOpen(false);
                    }}
                    className={`flex items-start justify-between gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-indigo-500 bg-indigo-950/50 text-white ring-1 ring-indigo-500/40'
                        : isDone
                        ? 'border-emerald-500/30 bg-slate-900/70 hover:border-emerald-500/60 text-slate-200'
                        : 'border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] font-bold tabular-nums ${
                          isCurrent
                            ? 'bg-indigo-600 text-white'
                            : isDone
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-950 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {isDone ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          `${node.moduleId}.${node.indexInModule}`
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          <RichInlineText text={node.lesson.title} />
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono tabular-nums">
                          #{node.globalIndex} · {node.lesson.durationMinutes} min · +{node.lesson.xpReward} XP
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

interface LessonRouteTransitionCardProps {
  currentLesson: Lesson;
  isCompleted: boolean;
  canCompleteLesson?: boolean;
  onVerifyAndComplete?: () => void;
  onSelectLesson: (lessonId: string) => void;
  onOpenFullMap: () => void;
  mode: 'app' | 'public';
}

export const LessonRouteTransitionCard: React.FC<LessonRouteTransitionCardProps> = ({
  currentLesson,
  isCompleted,
  canCompleteLesson = false,
  onVerifyAndComplete,
  onSelectLesson,
  onOpenFullMap,
  mode,
}) => {
  const { allModules, currentUser, language } = useApp();
  const isEn = language === 'en';

  const mapSummary = useMemo(
    () =>
      buildCurriculumMap({
        modules: allModules,
        completedLessonIds: currentUser.completedLessons,
        quizScores: currentUser.quizScores,
        savedCode: currentUser.savedCode,
        activeLessonId: currentLesson.id,
      }),
    [
      allModules,
      currentUser.completedLessons,
      currentUser.quizScores,
      currentUser.savedCode,
      currentLesson.id,
    ]
  );

  const transitionCtx = useMemo(
    () => getLessonTransitionContext(mapSummary, currentLesson.id),
    [mapSummary, currentLesson.id]
  );

  const {
    currentNode,
    prevNode,
    nextNode,
    moduleZone,
    isCrossingModuleBoundaryOnNext,
  } = transitionCtx;

  if (!currentNode || !moduleZone) return null;

  return (
    <section
      data-testid="lesson-route-transition-card"
      aria-label={isEn ? 'Next station on the learning map' : 'Kolejna stacja na mapie nauki'}
      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl space-y-5"
    >
      {/* Top Route Visual Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              {isEn ? 'Interactive Route Transition' : 'Nawigacja po stacjach mapy'}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {isCrossingModuleBoundaryOnNext && nextNode
                ? isEn
                  ? `Zone ${moduleZone.module.id} Finale — Next up: Zone ${nextNode.moduleId}`
                  : `Finał Strefy ${moduleZone.module.id} — Następny przystanek: Strefa ${nextNode.moduleId}`
                : isEn
                ? `Station ${currentNode.moduleId}.${currentNode.indexInModule} of ${moduleZone.totalCount} in ${moduleZone.module.title}`
                : `Stacja ${currentNode.moduleId}.${currentNode.indexInModule} z ${moduleZone.totalCount} w strefie: ${moduleZone.module.title}`}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenFullMap}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <MapIcon className="h-3.5 w-3.5 text-indigo-400" />
          <span>{isEn ? 'Open full map' : 'Otwórz pełną mapę'}</span>
        </button>
      </div>

      {/* 3-Station Connected Route Cards (Previous -> Current -> Next) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">
        {/* 1. Previous Station */}
        <div className="rounded-xl border border-slate-800/90 bg-slate-950/60 p-4 flex flex-col justify-between gap-3">
          {prevNode ? (
            <>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                  <span>← {isEn ? 'Previous station' : 'Poprzednia stacja'}</span>
                  <span>
                    {prevNode.moduleId}.{prevNode.indexInModule}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-200 line-clamp-2">
                  <RichInlineText text={prevNode.lesson.title} />
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectLesson(prevNode.lesson.id)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                <span>{isEn ? 'Go back' : 'Wróć do stacji'}</span>
              </button>
            </>
          ) : (
            <div className="h-full flex flex-col justify-center text-xs text-slate-500">
              <p className="font-semibold text-slate-400">
                {isEn ? 'Start of the Roadmap' : 'Początek Mapy Kursu'}
              </p>
              <p className="text-[11px]">
                {isEn
                  ? 'You are at the very first station (#1).'
                  : 'Znajdujesz się na pierwszej stacji startowej (#1).'}
              </p>
            </div>
          )}
        </div>

        {/* 2. Current Station Checkpoint */}
        <div
          className={`rounded-xl border p-4 flex flex-col justify-between gap-3 ${
            isCompleted
              ? 'border-emerald-500/40 bg-emerald-950/25'
              : 'border-indigo-500/40 bg-indigo-950/25'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
              <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-indigo-300 font-bold'}>
                {isCompleted
                  ? isEn
                    ? '✓ Station Completed'
                    : '✓ Stacja zaliczona'
                  : isEn
                  ? '● Current Station'
                  : '● Aktualna stacja'}
              </span>
              <span className="text-amber-300 font-bold">+{currentLesson.xpReward} XP</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-white line-clamp-2">
              <RichInlineText text={currentLesson.title} />
            </p>
          </div>

          {mode === 'app' && !isCompleted && onVerifyAndComplete ? (
            <button
              type="button"
              onClick={onVerifyAndComplete}
              className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                canCompleteLesson
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>
                {isEn ? 'Verify & complete' : 'Zweryfikuj i zalicz'}
              </span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>
                {isCompleted
                  ? isEn
                    ? 'Station mastered — ready for next!'
                    : 'Stacja opanowana — ruszaj dalej!'
                  : isEn
                  ? `Station #${currentNode.globalIndex} on the roadmap`
                  : `Stacja #${currentNode.globalIndex} na mapie`}
              </span>
            </div>
          )}
        </div>

        {/* 3. Next Station Destination */}
        <div
          className={`rounded-xl border p-4 flex flex-col justify-between gap-3 ${
            isCrossingModuleBoundaryOnNext
              ? 'border-amber-500/40 bg-amber-950/20'
              : 'border-slate-800 bg-slate-950/80'
          }`}
        >
          {nextNode ? (
            <>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                  <span
                    className={
                      isCrossingModuleBoundaryOnNext
                        ? 'text-amber-300 font-bold'
                        : 'text-indigo-400 font-bold'
                    }
                  >
                    {isCrossingModuleBoundaryOnNext
                      ? isEn
                        ? `New Zone ${nextNode.moduleId} →`
                        : `Nowa Strefa ${nextNode.moduleId} →`
                      : isEn
                      ? 'Next station →'
                      : 'Następna stacja →'}
                  </span>
                  <span className="text-slate-400">
                    {nextNode.moduleId}.{nextNode.indexInModule} · +{nextNode.lesson.xpReward} XP
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                  <RichInlineText text={nextNode.lesson.title} />
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectLesson(nextNode.lesson.id)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-md shadow-indigo-950/50 cursor-pointer"
              >
                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {isCrossingModuleBoundaryOnNext
                    ? isEn
                      ? `Enter Zone ${nextNode.moduleId}`
                      : `Wejdź do Strefy ${nextNode.moduleId}`
                    : isEn
                    ? 'Travel to next station'
                    : 'Przejdź do następnej stacji'}
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </button>
            </>
          ) : (
            <div className="h-full flex flex-col justify-center text-xs text-emerald-300">
              <p className="font-bold">
                {isEn ? 'Final Station Reached!' : 'Ostatnia stacja mapy!'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isEn
                  ? 'You have reached the end of all 15 zones.'
                  : 'Dotarłeś do finału wszystkich 15 stref programu.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
