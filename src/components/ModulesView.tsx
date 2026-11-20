import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCategoryLabel } from '../utils/i18n';
import {
  buildCurriculumMap,
  MapLessonNode,
  MapModuleZone,
} from '../utils/curriculumMap';
import { getBeginnerLessonAid } from '../utils/lessonReadability';
import { GoogleAdSenseBanner } from './GoogleAdSenseBanner';
import { RichInlineText } from './RichInlineText';
import {
  Layers,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Award,
  Code2,
  Lock,
  ArrowRight,
  Map as MapIcon,
  List,
  Compass,
  Play,
  Trophy,
  Search,
  Flag,
  Target,
  Check,
  Terminal,
} from 'lucide-react';

const getLaneOffsetPx = (laneOffset: MapLessonNode['laneOffset']): number => {
  switch (laneOffset) {
    case 'right':
      return 48;
    case 'center-right':
      return 24;
    case 'left':
      return -48;
    case 'center-left':
      return -24;
    case 'center':
    default:
      return 0;
  }
};

export const ModulesView: React.FC = () => {
  const { currentUser, setActiveTab, selectedLessonId, allModules, language } = useApp();
  const isEn = language === 'en';

  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(1);
  const [inspectedLessonId, setInspectedLessonId] = useState<string | null>(null);

  const categories = [
    'Wszystkie',
    'Podstawy',
    'Frontend',
    'Backend',
    'Bazy danych',
    'DevOps & Bezpieczeństwo',
    'Kariera',
  ];

  const mapSummary = useMemo(
    () =>
      buildCurriculumMap({
        modules: allModules,
        completedLessonIds: currentUser.completedLessons,
        quizScores: currentUser.quizScores,
        savedCode: currentUser.savedCode,
        activeLessonId: selectedLessonId,
        searchQuery,
        categoryFilter: selectedCategory,
      }),
    [
      allModules,
      currentUser.completedLessons,
      currentUser.quizScores,
      currentUser.savedCode,
      selectedLessonId,
      searchQuery,
      selectedCategory,
    ]
  );

  const activeNode: MapLessonNode | null = useMemo(() => {
    if (inspectedLessonId) {
      const found = mapSummary.flatNodes.find((n) => n.lesson.id === inspectedLessonId);
      if (found) return found;
    }
    return mapSummary.currentTargetNode || mapSummary.flatNodes[0] || null;
  }, [inspectedLessonId, mapSummary]);

  const activeNodeZone: MapModuleZone | null = useMemo(() => {
    if (!activeNode) return null;
    return mapSummary.zones.find((z) => z.module.id === activeNode.moduleId) || null;
  }, [activeNode, mapSummary.zones]);

  const activeNodeIndex = useMemo(() => {
    if (!activeNode) return -1;
    return mapSummary.flatNodes.findIndex((n) => n.lesson.id === activeNode.lesson.id);
  }, [activeNode, mapSummary.flatNodes]);

  const prevInspectNode =
    activeNodeIndex > 0 ? mapSummary.flatNodes[activeNodeIndex - 1] : null;
  const nextInspectNode =
    activeNodeIndex >= 0 && activeNodeIndex < mapSummary.flatNodes.length - 1
      ? mapSummary.flatNodes[activeNodeIndex + 1]
      : null;

  const activeBeginnerAid = useMemo(() => {
    if (!activeNode) return null;
    return getBeginnerLessonAid(activeNode.lesson, language);
  }, [activeNode, language]);

  const scrollToZone = (moduleId: number) => {
    const el = document.getElementById(`map-zone-${moduleId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToNode = (lessonId: string) => {
    setInspectedLessonId(lessonId);
    const el = document.getElementById(`map-node-${lessonId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8 space-y-4 sm:space-y-6">
      {/* Header & Interactive View Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3.5 sm:gap-6">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-slate-400">
            <span className="font-semibold text-indigo-400">
              {isEn ? 'Interactive Learning Map' : 'Interaktywna Mapa Ścieżki Nauki'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-slate-300">
              {mapSummary.completedLessonsCount} / {mapSummary.totalLessonsCount}{' '}
              {isEn ? 'lessons' : 'lekcji'} ({mapSummary.overallPercent}%)
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="font-mono tabular-nums text-emerald-400">
              {mapSummary.completedModulesCount} / {mapSummary.totalModulesCount}{' '}
              {isEn ? 'modules' : 'modułów'}
            </span>
          </div>

          <h1 className="text-xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
            {isEn
              ? `Full Stack Developer Roadmap (${allModules.length} Zones)`
              : `Mapa Kursu Full Stack Developera (${allModules.length} Stref)`}
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {isEn
              ? 'Navigate from node to node along the interactive skill tree. Click any station to inspect its goals, code examples, and analogy, or jump directly into the hands-on editor.'
              : 'Przechodź ze stacji do stacji wzdłuż interaktywnej mapy umiejętności. Kliknij dowolny węzeł lekcji, aby podejrzeć cele, analogię i zadania, lub od razu wejdź do warsztatu kodu.'}
          </p>
        </div>

        {/* View Mode Switcher & Jump to Current Station */}
        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto shrink-0">
          <div
            role="group"
            aria-label={isEn ? 'Curriculum display mode' : 'Tryb wyświetlania ścieżki'}
            className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800"
          >
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapIcon className="h-3.5 w-3.5 shrink-0" />
              <span>{isEn ? 'Interactive Map' : 'Interaktywna Mapa'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="h-3.5 w-3.5 shrink-0" />
              <span>{isEn ? 'Classic Syllabus' : 'Lista Modułów'}</span>
            </button>
          </div>

          {mapSummary.currentTargetNode && (
            <button
              type="button"
              onClick={() => {
                if (viewMode === 'map') {
                  scrollToNode(mapSummary.currentTargetNode!.lesson.id);
                } else {
                  setActiveTab('lesson', mapSummary.currentTargetNode!.lesson.id);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-lg shadow-emerald-950/40 whitespace-nowrap cursor-pointer"
            >
              <Compass className="h-4 w-4 shrink-0" />
              <span>
                {isEn ? 'Locate current lesson' : 'Znajdź aktualną lekcję'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4 space-y-2.5 sm:space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isEn
                  ? 'Search station on map (e.g. Flexbox, async, SQL, Docker, React)...'
                  : 'Szukaj stacji na mapie (np. Flexbox, async, SQL, Docker, React)...'
              }
              aria-label={isEn ? 'Search lessons on the map' : 'Szukaj lekcji na mapie'}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Fast Zone Jumper strip */}
          {viewMode === 'map' && mapSummary.zones.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap mr-1">
                {isEn ? 'Zone:' : 'Strefa:'}
              </span>
              {mapSummary.zones.map((z) => (
                <button
                  key={z.module.id}
                  type="button"
                  onClick={() => scrollToZone(z.module.id)}
                  title={`${isEn ? 'Module' : 'Moduł'} ${z.module.id}: ${z.module.title}`}
                  className={`h-7 min-w-[28px] px-2 rounded-lg font-mono text-xs font-bold transition-colors shrink-0 tabular-nums cursor-pointer ${
                    z.isZoneCompleted
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                      : z.containsCurrentTarget
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {z.module.id}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {formatCategoryLabel(cat, language)}
              </button>
            ))}
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isEn ? 'Completed' : 'Zaliczona'}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-indigo-400" />
              <span>{isEn ? 'Active target' : 'Aktualny cel'}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Flag className="h-3.5 w-3.5 text-amber-400" />
              <span>{isEn ? 'Zone milestone' : 'Finał modułu'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Google AdSense Display Unit */}
      <GoogleAdSenseBanner placement="modules" />

      {/* =====================================================================
          INTERACTIVE WINDING MAP VIEW (2-ZONE LAYOUT: CANVAS + INSPECTOR)
      ===================================================================== */}
      {viewMode === 'map' ? (
        mapSummary.zones.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center space-y-3">
            <p className="text-base font-bold text-white">
              {isEn ? 'No map stations match your filter' : 'Brak stacji na mapie pasujących do filtra'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Wszystkie');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white cursor-pointer"
            >
              {isEn ? 'Reset map filters' : 'Resetuj filtry mapy'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT 7 COLUMNS: Interactive Winding Skill Path Canvas */}
            <div
              data-testid="interactive-curriculum-map"
              className="lg:col-span-7 space-y-8"
            >
              {mapSummary.zones.map((zone) => {
                const { module, nodes, completedCount, totalCount, completionPercent, isZoneCompleted } =
                  zone;

                return (
                  <section
                    key={module.id}
                    id={`map-zone-${module.id}`}
                    aria-label={`${isEn ? 'Module' : 'Moduł'} ${module.id}: ${module.title}`}
                    className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/65 overflow-hidden shadow-lg"
                  >
                    {/* Module Checkpoint Header Gate */}
                    <div className="p-3.5 sm:p-6 border-b border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-mono font-extrabold text-base tabular-nums border ${
                            isZoneCompleted
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                              : zone.containsCurrentTarget
                              ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                              : 'bg-slate-950 border-slate-800 text-slate-300'
                          }`}
                        >
                          {String(module.id).padStart(2, '0')}
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            <span className="font-semibold text-indigo-400">
                              {module.displayCategory}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">
                              {completedCount} / {totalCount} {isEn ? 'stations' : 'stacji'} ({completionPercent}%)
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums text-amber-300">
                              +{module.totalXp} XP
                            </span>
                          </div>
                          <h2 className="text-base sm:text-lg font-bold text-white">
                            {module.title}
                          </h2>
                        </div>
                      </div>

                      {/* Zone Progress Bar */}
                      <div className="sm:w-36 space-y-1.5 shrink-0">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                          <span>{isZoneCompleted ? (isEn ? 'Mastered' : 'Ukończono') : (isEn ? 'Progress' : 'Postęp')}</span>
                          <span className={isZoneCompleted ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                            {completionPercent}%
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isZoneCompleted ? 'bg-emerald-500' : 'bg-indigo-500'
                            }`}
                            style={{ width: `${Math.max(4, completionPercent)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Winding Path Track of Lesson Stations */}
                    <div className="relative px-2.5 sm:px-8 py-4 sm:py-7 bg-slate-950/50">
                      <div className="relative flex flex-col">
                        {nodes.map((node, nodeIdx) => {
                          const isSelected = activeNode?.lesson.id === node.lesson.id;
                          const isDone = node.status === 'completed';
                          const isCurrent = node.status === 'current';
                          const nextNodeInZone =
                            nodeIdx < nodes.length - 1 ? nodes[nodeIdx + 1] : null;

                          // Shift classes for winding S-curve on desktop while staying centered/clean on small screens
                          const shiftClass =
                            node.laneOffset === 'right'
                              ? 'sm:translate-x-12'
                              : node.laneOffset === 'center-right'
                              ? 'sm:translate-x-6'
                              : node.laneOffset === 'left'
                              ? 'sm:-translate-x-12'
                              : node.laneOffset === 'center-left'
                              ? 'sm:-translate-x-6'
                              : 'sm:translate-x-0';

                          return (
                            <div
                              key={node.lesson.id}
                              id={`map-node-${node.lesson.id}`}
                              className="relative flex flex-col items-center"
                            >
                              {/* Station Node Card Button */}
                              <div
                                className={`w-full max-w-md transition-transform duration-200 ${shiftClass}`}
                              >
                                <div
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => setInspectedLessonId(node.lesson.id)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      setInspectedLessonId(node.lesson.id);
                                    }
                                  }}
                                  aria-label={`${isEn ? 'Station' : 'Stacja'} ${node.globalIndex}: ${node.lesson.title}`}
                                  aria-current={isSelected ? 'step' : undefined}
                                  className={`group relative rounded-2xl border p-3 sm:p-4 transition-all cursor-pointer select-none ${
                                    isSelected
                                      ? 'border-indigo-400 bg-indigo-950/60 shadow-lg shadow-indigo-950/60 ring-2 ring-indigo-500/40'
                                      : isCurrent
                                      ? 'border-amber-500/60 bg-slate-900/95 hover:border-amber-400 shadow-md'
                                      : isDone
                                      ? 'border-emerald-500/35 bg-slate-900/80 hover:border-emerald-500/60'
                                      : 'border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900'
                                  }`}
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5 sm:gap-3.5">
                                    {/* Station Medallion */}
                                    <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0">
                                      <div
                                        className={`mt-0.5 flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-extrabold tabular-nums border transition-colors ${
                                          isDone
                                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                            : isCurrent
                                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                                            : isSelected
                                            ? 'bg-indigo-600 border-indigo-400 text-white'
                                            : 'bg-slate-950 border-slate-800 text-slate-300 group-hover:border-indigo-500/40'
                                        }`}
                                      >
                                        {isDone ? (
                                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                                        ) : node.isMilestoneNode ? (
                                          <Flag className="h-4 w-4 text-amber-400" />
                                        ) : (
                                          <span>
                                            {module.id}.{node.indexInModule}
                                          </span>
                                        )}
                                      </div>

                                      <div className="space-y-1 min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-slate-400">
                                          <span className="font-mono font-semibold text-slate-300 tabular-nums">
                                            #{node.globalIndex}
                                          </span>
                                          <span aria-hidden="true">·</span>
                                          <span
                                            className={`font-semibold ${
                                              isDone
                                                ? 'text-emerald-400'
                                                : isCurrent
                                                ? 'text-amber-300'
                                                : 'text-indigo-300'
                                            }`}
                                          >
                                            {isDone
                                              ? isEn
                                                ? 'Completed'
                                                : 'Zaliczona'
                                              : isCurrent
                                              ? isEn
                                                ? 'Current station'
                                                : 'Aktualna stacja'
                                              : node.isMilestoneNode
                                              ? isEn
                                                ? 'Zone finale'
                                                : 'Finał strefy'
                                              : isEn
                                              ? 'Interactive station'
                                              : 'Stacja lekcji'}
                                          </span>
                                          <span aria-hidden="true">·</span>
                                          <span className="font-mono tabular-nums">
                                            {node.lesson.durationMinutes} min
                                          </span>
                                          <span aria-hidden="true">·</span>
                                          <span className="font-mono font-semibold text-amber-300 tabular-nums">
                                            +{node.lesson.xpReward} XP
                                          </span>
                                        </div>

                                        <h3 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-indigo-300 transition-colors">
                                          <RichInlineText text={node.lesson.title} />
                                        </h3>

                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                          <RichInlineText text={node.lesson.summary} />
                                        </p>
                                      </div>
                                    </div>

                                    {/* Direct Open Lesson Button */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveTab('lesson', node.lesson.id);
                                      }}
                                      aria-label={`${isEn ? 'Enter lesson' : 'Wejdź do lekcji'}: ${node.lesson.title}`}
                                      className={`w-full sm:w-auto shrink-0 sm:self-center inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                                        isDone
                                          ? 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-500/30'
                                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                                      }`}
                                    >
                                      <Play className="h-3.5 w-3.5 fill-current shrink-0" />
                                      <span>{isDone ? (isEn ? 'Replay' : 'Powtórz') : (isEn ? 'Start' : 'Start')}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Smooth Curved SVG Path Connector to Next Station */}
                              {nextNodeInZone && (() => {
                                const startX = 224 + getLaneOffsetPx(node.laneOffset);
                                const endX = 224 + getLaneOffsetPx(nextNodeInZone.laneOffset);
                                const midX = (startX + endX) / 2;
                                const isNextActive = isCurrent || nextNodeInZone.status === 'current';
                                const strokeColor = isDone
                                  ? '#10b981'
                                  : isNextActive
                                  ? '#6366f1'
                                  : '#334155';
                                const pathD = `M ${startX} 0 C ${startX} 18, ${endX} 18, ${endX} 36`;

                                return (
                                  <div
                                    aria-hidden="true"
                                    className="w-full flex items-center justify-center pointer-events-none select-none"
                                  >
                                    {/* Desktop/Tablet: true S-curve matching card laneOffset */}
                                    <svg
                                      viewBox="0 0 448 36"
                                      className="hidden sm:block w-full max-w-md h-9 overflow-visible"
                                    >
                                      <path
                                        d={pathD}
                                        fill="none"
                                        stroke={strokeColor}
                                        strokeWidth={isDone || isNextActive ? 2.5 : 2}
                                        strokeOpacity={isDone ? 0.75 : isNextActive ? 0.75 : 0.65}
                                        strokeDasharray={isDone ? undefined : '5 5'}
                                        strokeLinecap="round"
                                      />
                                      <circle
                                        cx={startX}
                                        cy={1}
                                        r={3}
                                        fill={isDone ? '#34d399' : isNextActive ? '#818cf8' : '#475569'}
                                      />
                                      <circle
                                        cx={endX}
                                        cy={35}
                                        r={3}
                                        fill={
                                          nextNodeInZone.status === 'completed'
                                            ? '#34d399'
                                            : nextNodeInZone.status === 'current'
                                            ? '#fbbf24'
                                            : '#475569'
                                        }
                                      />
                                      <g transform={`translate(${midX}, 18)`}>
                                        <circle
                                          r={7}
                                          fill="#0f172a"
                                          stroke={strokeColor}
                                          strokeWidth={1.5}
                                          strokeOpacity={0.9}
                                        />
                                        <path
                                          d="M -2.5 -1.2 L 0 1.6 L 2.5 -1.2"
                                          fill="none"
                                          stroke={isDone ? '#34d399' : isNextActive ? '#a5b4fc' : '#94a3b8'}
                                          strokeWidth={1.6}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </g>
                                    </svg>

                                    {/* Mobile: clean centered micro-connector without background spine */}
                                    <div className="sm:hidden h-7 flex flex-col items-center justify-center">
                                      <div
                                        className={`h-full border-l-2 ${
                                          isDone
                                            ? 'border-emerald-500/70'
                                            : isNextActive
                                            ? 'border-dashed border-indigo-400/75'
                                            : 'border-dashed border-slate-700'
                                        }`}
                                      />
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          );
                        })}
                      </div>

                      {/* Module Trophy Milestone Footer */}
                      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Award className="h-4 w-4 text-amber-400 shrink-0" />
                          <span>
                            {isEn ? 'Zone Reward Badge:' : 'Odznaka za ukończenie strefy:'}{' '}
                            <strong className="text-white">{module.badgeName}</strong>
                          </span>
                        </div>
                        {module.projectBrief && (
                          <button
                            type="button"
                            onClick={() => setActiveTab('projects')}
                            className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>{isEn ? 'Zone practical project' : 'Projekt praktyczny strefy'}</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>

            {/* RIGHT 5 COLUMNS: Sticky Interactive Station Inspector Deck */}
            <aside
              data-testid="map-station-inspector"
              aria-label={isEn ? 'Selected map station inspector' : 'Inspektor wybranej stacji na mapie'}
              className="lg:col-span-5 lg:sticky lg:top-20 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-5"
            >
              {activeNode ? (
                <>
                  {/* Station Navigation Header (Prev / Next Node on Map) */}
                  <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
                      <Compass className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span>
                        {isEn ? 'Station' : 'Stacja'} #{activeNode.globalIndex} / {mapSummary.flatNodes.length}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {isEn ? 'Zone' : 'Strefa'} {activeNode.moduleId}.{activeNode.indexInModule}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={!prevInspectNode}
                        onClick={() => prevInspectNode && scrollToNode(prevInspectNode.lesson.id)}
                        className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 cursor-pointer"
                      >
                        ← {isEn ? 'Prev' : 'Poprzednia'}
                      </button>
                      <button
                        type="button"
                        disabled={!nextInspectNode}
                        onClick={() => nextInspectNode && scrollToNode(nextInspectNode.lesson.id)}
                        className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 cursor-pointer"
                      >
                        {isEn ? 'Next' : 'Następna'} →
                      </button>
                    </div>
                  </div>

                  {/* Active Station Title & Status */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="font-semibold text-indigo-400">
                        {activeNode.moduleCategory}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {activeNode.lesson.durationMinutes} min
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono font-semibold text-amber-300 tabular-nums">
                        +{activeNode.lesson.xpReward} XP
                      </span>
                      {activeNode.quizScore !== null && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                            Quiz: {activeNode.quizScore}%
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="text-xl font-extrabold text-white tracking-tight leading-snug">
                      <RichInlineText text={activeNode.lesson.title} />
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      <RichInlineText text={activeNode.lesson.summary} />
                    </p>
                  </div>

                  {/* Real-world Analogy Preview */}
                  {activeBeginnerAid && (
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        <Sparkles className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          {isEn ? '30-Second Analogy' : 'Analogia w 30 sekund'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white">
                        <RichInlineText text={activeBeginnerAid.analogyTitle} />
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        <RichInlineText text={activeBeginnerAid.analogyText} />
                      </p>
                    </div>
                  )}

                  {/* Station Learning Goals */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {isEn ? 'What you will master at this station:' : 'Co opanujesz na tej stacji:'}
                    </h3>
                    <ul className="space-y-2">
                      {activeNode.lesson.objectives.slice(0, 3).map((obj, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-200 leading-relaxed"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><RichInlineText text={obj} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hands-on Workshop Task Preview */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Terminal className="h-4 w-4 text-indigo-400 shrink-0" />
                      <div className="truncate">
                        <p className="font-bold text-white truncate">
                          <RichInlineText text={activeNode.lesson.interactiveExercise.title} />
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {isEn
                            ? `Code editor + ${activeNode.lesson.quiz.length} quiz questions`
                            : `Warsztat kodu + quiz (${activeNode.lesson.quiz.length} pyt.)`}
                        </p>
                      </div>
                    </div>
                    {activeNode.hasSavedCode && (
                      <span className="text-[11px] font-mono text-emerald-400 shrink-0">
                        {isEn ? 'Saved draft' : 'Zapisany kod'}
                      </span>
                    )}
                  </div>

                  {/* Primary Action CTA: Enter Station */}
                  <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab('lesson', activeNode.lesson.id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold transition-colors shadow-lg shadow-indigo-950/60 cursor-pointer"
                    >
                      <BookOpen className="h-4 w-4 shrink-0" />
                      <span>
                        {activeNode.status === 'completed'
                          ? isEn
                            ? 'Open & review station'
                            : 'Otwórz i powtórz stację'
                          : isEn
                          ? 'Enter lesson station'
                          : 'Wejdź na stację lekcji'}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </button>
                  </div>

                  {/* Mini Zone Nodes Strip inside Inspector for instant hopping */}
                  {activeNodeZone && (
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          {isEn
                            ? `All stations in Zone ${activeNodeZone.module.id}:`
                            : `Wszystkie stacje w Strefie ${activeNodeZone.module.id}:`}
                        </span>
                        <span className="font-mono tabular-nums">
                          {activeNodeZone.completedCount}/{activeNodeZone.totalCount}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeNodeZone.nodes.map((n) => {
                          const active = n.lesson.id === activeNode.lesson.id;
                          const done = n.status === 'completed';
                          return (
                            <button
                              key={n.lesson.id}
                              type="button"
                              onClick={() => scrollToNode(n.lesson.id)}
                              title={n.lesson.title}
                              className={`h-8 px-2.5 rounded-lg font-mono text-xs font-bold transition-all tabular-nums cursor-pointer ${
                                active
                                  ? 'bg-indigo-600 text-white shadow-sm'
                                  : done
                                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {n.moduleId}.{n.indexInModule}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </aside>
          </div>
        )
      ) : (
        /* =====================================================================
           CLASSIC ACCORDION SYLLABUS VIEW (Secondary Mode)
        ===================================================================== */
        <div className="space-y-6">
          {mapSummary.zones.map(({ module, completedCount, totalCount }) => {
            const isExpanded = expandedModuleId === module.id;
            const isModuleActive = totalCount > 0;

            return (
              <div
                key={module.id}
                className={`rounded-3xl border transition-all ${
                  isModuleActive
                    ? 'border-slate-800 bg-slate-900/70 shadow-lg'
                    : 'border-slate-800/60 bg-slate-950/40 opacity-90'
                }`}
              >
                <div
                  className="p-6 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  onClick={() => setExpandedModuleId(isExpanded ? null : module.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-extrabold text-lg">
                      {module.id}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">
                          {module.displayCategory}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-indigo-400 font-semibold flex items-center gap-1">
                          <Award className="h-3.5 w-3.5" />
                          {isEn ? 'Badge:' : 'Odznaka:'} {module.badgeName}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">{module.title}</h3>
                      <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                        <RichInlineText text={module.description} />
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400 tabular-nums">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        {module.durationHours}h
                      </span>
                      <span className="flex items-center gap-1 text-indigo-300 font-semibold">
                        <Sparkles className="h-3.5 w-3.5" />+{module.totalXp} XP
                      </span>
                      {totalCount > 0 && (
                        <span className="text-emerald-400 font-semibold">
                          {completedCount} / {totalCount} {isEn ? 'lessons' : 'lekcji'}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      aria-label={
                        isExpanded
                          ? isEn
                            ? 'Collapse module'
                            : 'Zwiń moduł'
                          : isEn
                          ? 'Expand module'
                          : 'Rozwiń moduł'
                      }
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-800 bg-slate-950/60 p-6 space-y-4">
                    {module.lessons.map((lesson) => {
                      const isDone = currentUser.completedLessons.includes(lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => setActiveTab('lesson', lesson.id)}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800/90 hover:border-indigo-500/40 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start gap-3.5">
                            <div
                              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold tabular-nums ${
                                isDone
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {lesson.order}
                            </div>
                            <div className="space-y-1">
                              <h5 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                                {isEn ? 'Lesson' : 'Lekcja'} {lesson.order}:{' '}
                                <RichInlineText text={lesson.title} />
                              </h5>
                              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                                <RichInlineText text={lesson.summary} />
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="self-end sm:self-center shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600/30 text-indigo-200 group-hover:bg-indigo-600 group-hover:text-white text-xs font-semibold transition-all"
                          >
                            <span>
                              {isDone
                                ? isEn
                                  ? 'Review lesson'
                                  : 'Powtórz lekcję'
                                : isEn
                                ? 'Open lesson'
                                : 'Otwórz lekcję'}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
