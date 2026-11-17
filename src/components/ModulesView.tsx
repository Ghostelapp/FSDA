import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCategoryLabel } from '../utils/i18n';
import { GoogleAdSenseBanner } from './GoogleAdSenseBanner';
import { RichInlineText } from './RichInlineText';
import { 
  Layers, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  BookOpen, 
  Award,
  Terminal,
  Code2,
  Lock,
  ArrowRight
} from 'lucide-react';

export const ModulesView: React.FC = () => {
  const { currentUser, setActiveTab, allModules, language } = useApp();
  const isEn = language === 'en';
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(1);

  const categories = [
    'Wszystkie',
    'Podstawy',
    'Frontend',
    'Backend',
    'Bazy danych',
    'DevOps & Bezpieczeństwo',
    'Kariera',
  ];

  const filteredModules = selectedCategory === 'Wszystkie'
    ? allModules
    : allModules.filter((m) => m.category === selectedCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <Layers className="h-4 w-4" />
            <span>
              {isEn
                ? 'Complete Curriculum · From Zero to Junior Full Stack'
                : 'Kompletny Program Nauki · Od Zera do Junior Full Stack'}
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {isEn
              ? `Full Stack Developer Track (${allModules.length} Modules)`
              : `Ścieżka Full Stack Developera (${allModules.length} Modułów)`}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {isEn ? (
              <>
                Every lesson includes a <strong className="text-white font-semibold">“Explain from Zero”</strong>{' '}
                guide with everyday analogies, plain-English glossary cards, and step-by-step exercise hints.
              </>
            ) : (
              <>
                Każda lekcja zawiera tryb <strong className="text-white font-semibold">„Wyjaśnij od zera”</strong>{' '}
                z codziennymi analogiami, słowniczkiem prostych pojęć oraz podpowiedziami krok po kroku do ćwiczeń.
              </>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('lesson', 'html-7')}
          className="inline-flex items-center gap-2.5 self-start lg:self-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-colors shadow-lg shadow-emerald-950/50 shrink-0"
        >
          <BookOpen className="h-4 w-4" />
          <span>
            {isEn
              ? 'Start Lesson 1 (HTML Basics from Scratch)'
              : 'Zacznij od Lekcji 1 (Podstawy HTML od zera)'}
          </span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Category Filter Controls */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {formatCategoryLabel(cat, language)}
          </button>
        ))}
      </div>

      {/* Google AdSense Display Unit (Shown only to authenticated Free-tier students) */}
      <GoogleAdSenseBanner placement="modules" />

      {/* Modules List */}
      <div className="space-y-6">
        {filteredModules.map((module) => {
          const isExpanded = expandedModuleId === module.id;
          const completedInModule = module.lessons.filter((l) => currentUser.completedLessons.includes(l.id)).length;
          const totalInModule = module.lessons.length;
          const isModuleActive = totalInModule > 0;

          return (
            <div
              key={module.id}
              className={`rounded-3xl border transition-all ${
                isModuleActive
                  ? 'border-slate-800 bg-slate-900/70 shadow-lg'
                  : 'border-slate-800/60 bg-slate-950/40 opacity-90'
              }`}
            >
              {/* Module Header Bar */}
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
                      <span className="text-emerald-400 font-medium">
                        {isEn
                          ? module.id <= 2
                            ? 'Level: From Scratch'
                            : module.id <= 5
                            ? 'Level: Foundations'
                            : module.id <= 10
                            ? 'Level: Intermediate'
                            : 'Level: Advanced'
                          : module.id <= 2
                          ? 'Poziom: Start od Zera'
                          : module.id <= 5
                          ? 'Poziom: Podstawy'
                          : module.id <= 10
                          ? 'Poziom: Średniozaawansowany'
                          : 'Poziom: Zaawansowany'}
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

                {/* Module Stats & Action */}
                <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      {module.durationHours}h
                    </span>
                    <span className="flex items-center gap-1 text-indigo-300 font-semibold">
                      <Sparkles className="h-3.5 w-3.5" />
                      +{module.totalXp} XP
                    </span>
                    {totalInModule > 0 && (
                      <span className="text-emerald-400 font-semibold">
                        {completedInModule} / {totalInModule} {isEn ? 'lessons' : 'lekcji'}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    aria-label={isExpanded ? (isEn ? 'Collapse module' : 'Zwiń moduł') : (isEn ? 'Expand module' : 'Rozwiń moduł')}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-slate-800 bg-slate-950/60 p-6 space-y-6">
                  
                  {/* Topics Covered */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      {isEn ? 'Key module topics:' : 'Kluczowe zagadnienia modułu:'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-sm text-slate-300">
                      {module.topics.map((t, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-1" />
                          <span><RichInlineText text={t} /></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project Brief if present */}
                  {module.projectBrief && (
                    <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-sm">
                      <span className="font-bold text-indigo-300 block mb-1">
                        {isEn ? 'Module practical project:' : 'Projekt praktyczny modułu:'}
                      </span>
                      <p className="text-slate-200"><RichInlineText text={module.projectBrief} /></p>
                    </div>
                  )}

                  {/* Lessons in this Module */}
                  {module.lessons.length > 0 ? (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {isEn
                          ? `Lessons in this module (${module.lessons.length} — ordered from beginner-friendly to advanced):`
                          : `Lekcje w tym module (${module.lessons.length} — ułożone od najprostszych do zaawansowanych):`}
                      </h4>
                      <div className="space-y-2.5">
                        {module.lessons.map((lesson) => {
                          const isDone = currentUser.completedLessons.includes(lesson.id);

                          return (
                            <div
                              key={lesson.id}
                              onClick={() => setActiveTab('lesson', lesson.id)}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800/90 hover:border-indigo-500/40 transition-all cursor-pointer group"
                            >
                              <div className="flex items-start gap-3.5">
                                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                  isDone ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {lesson.order}
                                </div>
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h5 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                                      {isEn ? 'Lesson' : 'Lekcja'} {lesson.order}: <RichInlineText text={lesson.title} />
                                    </h5>
                                    {isDone && (
                                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        {isEn ? 'Completed' : 'Zaliczone'}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                                    <RichInlineText text={lesson.summary} />
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-400">
                                    <span>{lesson.durationMinutes} min</span>
                                    <span aria-hidden="true">·</span>
                                    <span className="text-indigo-300 font-semibold">+{lesson.xpReward} XP</span>
                                    <span aria-hidden="true">·</span>
                                    <span className="text-slate-300">
                                      <RichInlineText text={lesson.prerequisites.join(', ')} />
                                    </span>
                                    <span aria-hidden="true">·</span>
                                    <span className="text-emerald-400">
                                      {lesson.order <= 2 && module.id <= 3
                                        ? isEn ? 'Zero-to-hero (with analogy)' : 'Start od zera (z analogią)'
                                        : isEn ? 'Includes step-by-step guide' : 'Zawiera wyjaśnienie krok po kroku'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                className="self-end sm:self-center shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600/30 text-indigo-200 group-hover:bg-indigo-600 group-hover:text-white text-xs font-semibold transition-all"
                              >
                                <span>
                                  {isDone
                                    ? isEn ? 'Review lesson' : 'Powtórz lekcję'
                                    : isEn ? 'Open lesson' : 'Otwórz lekcję'}
                                </span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-xs text-slate-400 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-slate-500" />
                        <span>
                          {isEn
                            ? 'Further lessons unlock after finishing introductory modules (HTML/CSS).'
                            : 'Kolejne lekcje tego modułu odblokowują się po zaliczeniu modułów wstępnych (HTML/CSS).'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('projects')}
                        className="text-indigo-400 hover:underline font-semibold"
                      >
                        {isEn ? 'View module project →' : 'Zobacz projekt modułu →'}
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
