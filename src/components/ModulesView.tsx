import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MODULES_DATA } from '../data/modulesData';
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
  const { currentUser, setActiveTab } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(2); // Default expand HTML module

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
    ? MODULES_DATA
    : MODULES_DATA.filter((m) => m.category === selectedCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          <Layers className="h-4 w-4" />
          <span>Kompletny Program Nauki</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ścieżka Full Stack Developera (15 Modułów)
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Od zera do samodzielnego architekta aplikacji. Każdy moduł łączy teorię, dobre praktyki branżowe,
          interaktywne ćwiczenia z weryfikacją testów oraz praktyczne projekty komercyjne.
        </p>
      </div>

      {/* Category Pills */}
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
            {cat}
          </button>
        ))}
      </div>

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

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        {module.category}
                      </span>
                      <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" />
                        Odznaka: {module.badgeName}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{module.title}</h3>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">{module.description}</p>
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
                        {completedInModule} / {totalInModule} lekcji
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    aria-label={isExpanded ? 'Zwiń moduł' : 'Rozwiń moduł'}
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
                      Kluczowe zagadnienia modułu:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                      {module.topics.map((t, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project Brief if present */}
                  {module.projectBrief && (
                    <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-xs">
                      <span className="font-bold text-indigo-300 block mb-1">Projekt praktyczny modułu:</span>
                      <p className="text-slate-300">{module.projectBrief}</p>
                    </div>
                  )}

                  {/* Lessons in this Module */}
                  {module.lessons.length > 0 ? (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Dostępne lekcje ({module.lessons.length}):
                      </h4>
                      <div className="space-y-2">
                        {module.lessons.map((lesson) => {
                          const isDone = currentUser.completedLessons.includes(lesson.id);

                          return (
                            <div
                              key={lesson.id}
                              onClick={() => setActiveTab('lesson', lesson.id)}
                              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                                  isDone ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : lesson.order}
                                </div>
                                <div>
                                  <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                                    {lesson.title}
                                  </h5>
                                  <span className="text-[11px] text-slate-400">
                                    {lesson.durationMinutes} min • +{lesson.xpReward} XP
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white text-xs font-semibold transition-all"
                              >
                                <span>{isDone ? 'Powtórz' : 'Otwórz'}</span>
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
                        <span>Kolejne lekcje tego modułu odblokowują się po zaliczeniu modułów wstępnych (HTML/CSS).</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('projects')}
                        className="text-indigo-400 hover:underline font-semibold"
                      >
                        Zobacz projekt modułu &rarr;
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
