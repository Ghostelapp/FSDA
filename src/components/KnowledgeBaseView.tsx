import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { PublicHeader } from './PublicHeader';
import { RichInlineText } from './RichInlineText';
import { estimateLessonReadingMinutes, getBeginnerLessonAid } from '../utils/lessonReadability';
import { buildCurriculumMap, MapLessonNode } from '../utils/curriculumMap';
import { formatCategoryLabel } from '../utils/i18n';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Search,
  Layers,
  Map as MapIcon,
  LayoutGrid,
  Compass,
  Flag,
  Sparkles,
  CheckCircle2,
  Play,
} from 'lucide-react';

interface KnowledgeBaseViewProps {
  onOpenAuthModal: () => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({ onOpenAuthModal }) => {
  const { setActiveTab, allModules, allLessons, language } = useApp();
  const isEn = language === 'en';
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');
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

  const totalLessons = allLessons.length;

  const mapSummary = useMemo(
    () =>
      buildCurriculumMap({
        modules: allModules,
        completedLessonIds: [],
        searchQuery,
        categoryFilter: selectedCategory,
      }),
    [allModules, searchQuery, selectedCategory]
  );

  const activeNode: MapLessonNode | null = useMemo(() => {
    if (inspectedLessonId) {
      const found = mapSummary.flatNodes.find((n) => n.lesson.id === inspectedLessonId);
      if (found) return found;
    }
    return mapSummary.flatNodes[0] || null;
  }, [inspectedLessonId, mapSummary.flatNodes]);

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

  const handleOpenPublicLesson = (
    e: React.MouseEvent<HTMLAnchorElement>,
    lessonId: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setActiveTab('public_lesson', lessonId);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const scrollToZone = (moduleId: number) => {
    const el = document.getElementById(`kb-map-zone-${moduleId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToNode = (lessonId: string) => {
    setInspectedLessonId(lessonId);
    const el = document.getElementById(`kb-map-node-${lessonId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-[#06080E] text-[#F8FAFC] selection:bg-indigo-600 selection:text-white">
      <PublicHeader onOpenAuthModal={onOpenAuthModal} activeTab="knowledge_base" />

      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-12 sm:py-16 space-y-10">
        {/* Editorial Intro & Interactive Map Mode Switcher */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#94A3B8]">
              <span className="font-semibold text-indigo-400">
                {isEn ? 'Interactive Curriculum Map' : 'Interaktywna Mapa Programu'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{isEn ? 'No sign-up required' : 'Dostęp bez rejestracji'}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {isEn
                  ? `${allModules.length} zones · ${totalLessons} stations`
                  : `${allModules.length} stref · ${totalLessons} stacji lekcji`}
              </span>
            </div>

            <h1
              style={{ textWrap: 'balance' }}
              className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F8FAFC]"
            >
              {isEn
                ? 'Interactive roadmap of lessons from zero to Full Stack.'
                : 'Interaktywna mapa lekcji od podstaw do Full Stacka.'}
            </h1>

            <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
              {isEn
                ? `Explore all ${totalLessons} stations along the Full Stack Developer path. Click any station node to inspect its analogy, learning goals, and code preview, or open the full interactive lesson.`
                : `Przemierzaj wszystkie ${totalLessons} stacji na ścieżce Full Stack Developera. Kliknij dowolny węzeł lekcji na mapie, aby podejrzeć analogię, cele nauki i zadanie praktyczne, albo od razu przejdź do pełnej lekcji.`}
            </p>
          </div>

          <div
            role="group"
            aria-label={isEn ? 'Knowledge base display mode' : 'Tryb widoku bazy wiedzy'}
            className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#0B101B] border border-white/10 self-start lg:self-auto shrink-0"
          >
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <MapIcon className="h-3.5 w-3.5 shrink-0" />
              <span>{isEn ? 'Interactive Map' : 'Interaktywna Mapa'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5 shrink-0" />
              <span>{isEn ? 'Article Grid' : 'Karty Artykułów'}</span>
            </button>
          </div>
        </header>

        {/* Filter, Search & Zone Jumper Bar */}
        <div className="rounded-2xl border border-white/10 bg-[#0B101B] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isEn
                    ? 'Search lesson station (e.g., Flexbox, React, async/await, PostgreSQL, Docker, JWT)...'
                    : 'Szukaj stacji lekcji (np. Flexbox, React, async/await, PostgreSQL, Docker, JWT)...'
                }
                aria-label={isEn ? 'Search lessons in the open knowledge base' : 'Szukaj lekcji w otwartej bazie wiedzy'}
                className="w-full rounded-xl border border-white/10 bg-[#060911] pl-10 pr-4 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {viewMode === 'map' && mapSummary.zones.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-[11px] font-semibold text-[#94A3B8] whitespace-nowrap mr-1">
                  {isEn ? 'Zone:' : 'Strefa:'}
                </span>
                {mapSummary.zones.map((z) => (
                  <button
                    key={z.module.id}
                    type="button"
                    onClick={() => scrollToZone(z.module.id)}
                    title={`${isEn ? 'Module' : 'Moduł'} ${z.module.id}: ${z.module.title}`}
                    className="h-7 min-w-[28px] px-2 rounded-lg font-mono text-xs font-bold bg-[#060911] border border-white/10 text-[#94A3B8] hover:text-white hover:border-indigo-500/50 transition-colors shrink-0 tabular-nums cursor-pointer"
                  >
                    {z.module.id}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/[0.04] text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {formatCategoryLabel(cat, language)}
              </button>
            ))}
          </div>
        </div>

        {/* Empty Filter State */}
        {mapSummary.zones.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0B101B] p-10 text-center space-y-3">
            <p className="text-base font-bold text-[#F8FAFC]">
              {isEn ? 'No lessons match your search' : 'Brak lekcji pasujących do wyszukiwania'}
            </p>
            <p className="text-sm text-[#94A3B8]">
              {isEn
                ? 'Try another search term or clear the category filter.'
                : 'Zmień frazę wyszukiwania lub wyczyść filtr kategorii.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Wszystkie');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 cursor-pointer"
            >
              {isEn ? `Show all ${totalLessons} lessons` : `Pokaż wszystkie ${totalLessons} lekcji`}
            </button>
          </div>
        ) : viewMode === 'map' ? (
          /* =====================================================================
             INTERACTIVE WINDING LESSON MAP + STICKY STATION INSPECTOR
          ===================================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT 7 COLUMNS: Winding Curriculum Path */}
            <div
              data-testid="kb-interactive-curriculum-map"
              className="lg:col-span-7 space-y-8"
            >
              {mapSummary.zones.map(({ module: mod, nodes }) => (
                <section
                  key={mod.id}
                  id={`kb-map-zone-${mod.id}`}
                  aria-labelledby={`kb-module-${mod.id}`}
                  className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#0B101B] overflow-hidden shadow-lg"
                >
                  {/* Zone Header */}
                  <div className="p-5 sm:p-6 border-b border-white/10 bg-[#0E1422] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 font-mono font-extrabold text-base text-indigo-300 tabular-nums">
                        {String(mod.id).padStart(2, '0')}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-indigo-400">
                          <span className="font-bold">
                            {isEn ? 'Zone' : 'Strefa'} {String(mod.id).padStart(2, '0')}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#94A3B8] font-sans">{mod.displayCategory}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#94A3B8] tabular-nums">
                            {nodes.length} {isEn ? 'stations' : 'stacji'}
                          </span>
                        </div>
                        <h2
                          id={`kb-module-${mod.id}`}
                          className="font-display text-lg sm:text-xl font-extrabold text-[#F8FAFC]"
                        >
                          {mod.title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Winding Track of Station Nodes */}
                  <div className="relative px-4 sm:px-8 py-8 bg-[#070B13]">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-6 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-indigo-500/35 via-white/10 to-emerald-500/35"
                    />

                    <div className="relative space-y-5">
                      {nodes.map((node, nodeIdx) => {
                        const isSelected = activeNode?.lesson.id === node.lesson.id;
                        const nextNodeInZone =
                          nodeIdx < nodes.length - 1 ? nodes[nodeIdx + 1] : null;
                        const href = `/baza-wiedzy/${encodeURIComponent(node.lesson.id)}`;
                        const readMinutes = estimateLessonReadingMinutes(node.lesson);

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
                            id={`kb-map-node-${node.lesson.id}`}
                            className="relative flex flex-col items-center"
                          >
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
                                className={`group relative rounded-2xl border p-4 transition-all cursor-pointer select-none ${
                                  isSelected
                                    ? 'border-indigo-400 bg-indigo-950/60 shadow-lg shadow-indigo-950/60 ring-2 ring-indigo-500/40'
                                    : 'border-white/10 bg-[#0B101B] hover:border-indigo-500/50 hover:bg-[#0F1626]'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3.5">
                                  <div className="flex items-start gap-3.5 min-w-0">
                                    <div
                                      className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-extrabold tabular-nums border transition-colors ${
                                        isSelected
                                          ? 'bg-indigo-600 border-indigo-400 text-white'
                                          : node.isMilestoneNode
                                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                                          : 'bg-[#060911] border-white/10 text-slate-300 group-hover:border-indigo-500/40'
                                      }`}
                                    >
                                      {node.isMilestoneNode ? (
                                        <Flag className="h-4 w-4 text-amber-400" />
                                      ) : (
                                        <span>
                                          {mod.id}.{node.indexInModule}
                                        </span>
                                      )}
                                    </div>

                                    <div className="space-y-1 min-w-0">
                                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#94A3B8]">
                                        <span className="font-mono font-semibold text-indigo-300 tabular-nums">
                                          #{node.globalIndex}
                                        </span>
                                        <span aria-hidden="true">·</span>
                                        <span className="font-mono tabular-nums">
                                          ~{readMinutes} min
                                        </span>
                                        <span aria-hidden="true">·</span>
                                        <span className="font-mono text-amber-300 tabular-nums">
                                          +{node.lesson.xpReward} XP
                                        </span>
                                      </div>

                                      <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC] leading-snug group-hover:text-indigo-300 transition-colors">
                                        <RichInlineText text={node.lesson.title} />
                                      </h3>

                                      <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                                        <RichInlineText text={node.lesson.summary} />
                                      </p>
                                    </div>
                                  </div>

                                  <a
                                    href={href}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenPublicLesson(e, node.lesson.id);
                                    }}
                                    className="shrink-0 self-center inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors whitespace-nowrap"
                                  >
                                    <Play className="h-3.5 w-3.5 fill-current shrink-0" />
                                    <span>{isEn ? 'Open' : 'Otwórz'}</span>
                                  </a>
                                </div>
                              </div>
                            </div>

                            {nextNodeInZone && (
                              <div
                                aria-hidden="true"
                                className="h-5 flex items-center justify-center"
                              >
                                <div className="h-full w-0.5 bg-white/10" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* RIGHT 5 COLUMNS: Sticky Interactive Station Inspector */}
            <aside
              data-testid="kb-map-station-inspector"
              aria-label={isEn ? 'Selected lesson station preview' : 'Podgląd wybranej stacji lekcji'}
              className="lg:col-span-5 lg:sticky lg:top-20 rounded-2xl border border-white/10 bg-[#0B101B] p-6 shadow-xl space-y-5"
            >
              {activeNode ? (
                <>
                  <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-white/10">
                    <div className="flex items-center gap-2 text-xs text-[#94A3B8] font-mono tabular-nums">
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
                        className="px-2.5 py-1 rounded-lg border border-white/10 bg-[#060911] text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
                      >
                        ← {isEn ? 'Prev' : 'Poprzednia'}
                      </button>
                      <button
                        type="button"
                        disabled={!nextInspectNode}
                        onClick={() => nextInspectNode && scrollToNode(nextInspectNode.lesson.id)}
                        className="px-2.5 py-1 rounded-lg border border-white/10 bg-[#060911] text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
                      >
                        {isEn ? 'Next' : 'Następna'} →
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8]">
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
                    </div>

                    <h2 className="font-display text-xl font-extrabold text-[#F8FAFC] leading-snug">
                      <RichInlineText text={activeNode.lesson.title} />
                    </h2>

                    <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                      <RichInlineText text={activeNode.lesson.summary} />
                    </p>
                  </div>

                  {activeBeginnerAid && (
                    <div className="rounded-xl border border-white/10 bg-[#060911] p-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        <Sparkles className="h-3.5 w-3.5 shrink-0" />
                        <span>{isEn ? '30-Second Analogy' : 'Analogia w 30 sekund'}</span>
                      </div>
                      <p className="text-xs font-bold text-[#F8FAFC]">
                        <RichInlineText text={activeBeginnerAid.analogyTitle} />
                      </p>
                      <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                        <RichInlineText text={activeBeginnerAid.analogyText} />
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                      {isEn ? 'Key station objectives:' : 'Cele na tej stacji:'}
                    </h3>
                    <ul className="space-y-2">
                      {activeNode.lesson.objectives.slice(0, 3).map((obj, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-[#CBD5E1] leading-relaxed"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><RichInlineText text={obj} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-1">
                    <a
                      href={`/baza-wiedzy/${encodeURIComponent(activeNode.lesson.id)}`}
                      onClick={(e) => handleOpenPublicLesson(e, activeNode.lesson.id)}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold transition-colors shadow-lg shadow-indigo-950/60"
                    >
                      <BookOpen className="h-4 w-4 shrink-0" />
                      <span>
                        {isEn ? 'Enter lesson station' : 'Wejdź na stację lekcji'}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </a>
                  </div>
                </>
              ) : null}
            </aside>
          </div>
        ) : (
          /* =====================================================================
             CLASSIC ARTICLE GRID VIEW
          ===================================================================== */
          <div className="space-y-12">
            {mapSummary.zones.map(({ module: mod, nodes }) => (
              <section
                key={mod.id}
                aria-labelledby={`kb-grid-module-${mod.id}`}
                className="space-y-5 pt-4 border-t border-white/[0.08]"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-indigo-400">
                      <span className="font-bold">
                        {isEn ? 'Module' : 'Moduł'} {String(mod.id).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#94A3B8] font-sans">{mod.displayCategory}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#94A3B8] tabular-nums">
                        {nodes.length} {isEn ? 'lessons' : 'lekcji'}
                      </span>
                    </div>
                    <h2
                      id={`kb-grid-module-${mod.id}`}
                      className="font-display text-xl sm:text-2xl font-extrabold text-[#F8FAFC]"
                    >
                      {mod.title}
                    </h2>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">{mod.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nodes.map(({ lesson }) => {
                    const readMinutes = estimateLessonReadingMinutes(lesson);
                    const aid = getBeginnerLessonAid(lesson, language);
                    const href = `/baza-wiedzy/${encodeURIComponent(lesson.id)}`;
                    return (
                      <article
                        key={lesson.id}
                        className="group rounded-2xl border border-white/[0.08] bg-[#0B101B] hover:border-indigo-500/60 p-5 flex flex-col justify-between gap-4 transition-all"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2 text-[11px] font-mono tabular-nums text-[#94A3B8]">
                            <span className="inline-flex items-center gap-1.5 text-indigo-300 font-sans font-semibold">
                              <Layers className="h-3 w-3 shrink-0" />
                              {aid.displayDifficultyLabel}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3 shrink-0" />
                              {readMinutes} {isEn ? 'min read' : 'min czytania'}
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC] leading-snug group-hover:text-indigo-300 transition-colors">
                            <a
                              href={href}
                              onClick={(e) => handleOpenPublicLesson(e, lesson.id)}
                              className="focus:outline-none focus-visible:underline"
                            >
                              <RichInlineText text={lesson.title} />
                            </a>
                          </h3>

                          <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                            <RichInlineText text={lesson.summary} />
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-[#64748B]">
                            <BookOpen className="h-3 w-3" />
                            {isEn ? 'Theory + code examples' : 'Teoria + przykłady kodu'}
                          </span>
                          <a
                            href={href}
                            onClick={(e) => handleOpenPublicLesson(e, lesson.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 whitespace-nowrap"
                          >
                            <span>{isEn ? 'Read' : 'Czytaj'}</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
