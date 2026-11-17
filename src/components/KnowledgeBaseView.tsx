import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { PublicHeader } from './PublicHeader';
import { RichInlineText } from './RichInlineText';
import { estimateLessonReadingMinutes, getBeginnerLessonAid } from '../utils/lessonReadability';
import { formatCategoryLabel } from '../utils/i18n';
import { ArrowRight, BookOpen, Clock, Search, Layers } from 'lucide-react';

interface KnowledgeBaseViewProps {
  onOpenAuthModal: () => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({ onOpenAuthModal }) => {
  const { setActiveTab, allModules, allLessons, language } = useApp();
  const isEn = language === 'en';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');

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

  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allModules
      .filter((mod) => (selectedCategory === 'Wszystkie' ? true : mod.category === selectedCategory))
      .map((mod) => {
        if (!q) return mod;
        const modMatch =
          mod.title.toLowerCase().includes(q) || mod.description.toLowerCase().includes(q);
        const matchingLessons = modMatch
          ? mod.lessons
          : mod.lessons.filter(
              (l) =>
                l.title.toLowerCase().includes(q) ||
                l.summary.toLowerCase().includes(q)
            );
        return { ...mod, lessons: matchingLessons };
      })
      .filter((mod) => mod.lessons.length > 0);
  }, [allModules, searchQuery, selectedCategory]);

  const handleOpenPublicLesson = (
    e: React.MouseEvent<HTMLAnchorElement>,
    lessonId: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setActiveTab('public_lesson', lessonId);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div className="min-h-screen bg-[#06080E] text-[#F8FAFC] selection:bg-indigo-600 selection:text-white">
      <PublicHeader onOpenAuthModal={onOpenAuthModal} activeTab="knowledge_base" />

      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-12 sm:py-16 space-y-12">
        {/* Editorial Intro */}
        <header className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#94A3B8]">
            <span className="font-semibold text-indigo-400">
              {isEn ? 'Open IT Knowledge Base' : 'Otwarta Baza Wiedzy IT'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{isEn ? 'No sign-up required' : 'Dostęp bez rejestracji'}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {isEn
                ? `${allModules.length} modules · ${totalLessons} complete lessons`
                : `${allModules.length} modułów · ${totalLessons} pełnych lekcji`}
            </span>
          </div>

          <h1
            style={{ textWrap: 'balance' }}
            className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F8FAFC]"
          >
            {isEn
              ? 'Complete programming guides and lessons from zero to Full Stack.'
              : 'Kompletne poradniki i lekcje programowania od podstaw do Full Stacka.'}
          </h1>

          <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed max-w-3xl">
            {isEn
              ? `Read all ${totalLessons} lessons from the Full Stack Developer Academy curriculum freely right here without logging in. Every article combines step-by-step explanations, an everyday analogy, a jargon-free glossary, and hands-on code examples.`
              : `Wszystkie ${totalLessons} lekcji programu Full Stack Developer Academy możesz czytać tutaj bezpośrednio i bez logowania. Każdy artykuł zawiera omówienie krok po kroku, życiową analogię, słowniczek bez żargonu oraz przykłady kodu gotowe do przećwiczenia.`}
          </p>
        </header>

        {/* Filter & Search Bar */}
        <div className="rounded-2xl border border-white/10 bg-[#0B101B] p-5 space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isEn
                  ? 'Search lesson topics (e.g., Flexbox, React, async/await, PostgreSQL, Docker, JWT)...'
                  : 'Szukaj tematu lekcji (np. Flexbox, React, async/await, PostgreSQL, Docker, JWT)...'
              }
              aria-label={isEn ? 'Search lessons in the open knowledge base' : 'Szukaj lekcji w otwartej bazie wiedzy'}
              className="w-full rounded-xl border border-white/10 bg-[#060911] pl-10 pr-4 py-3 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
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

        {/* All Modules & Public Lesson Articles */}
        <div className="space-y-12">
          {filteredModules.length === 0 ? (
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
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
              >
                {isEn ? `Show all ${totalLessons} lessons` : `Pokaż wszystkie ${totalLessons} lekcji`}
              </button>
            </div>
          ) : (
            filteredModules.map((mod) => (
              <section
                key={mod.id}
                aria-labelledby={`kb-module-${mod.id}`}
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
                        {mod.lessons.length} {isEn ? 'lessons' : 'lekcji'}
                      </span>
                    </div>
                    <h2
                      id={`kb-module-${mod.id}`}
                      className="font-display text-xl sm:text-2xl font-extrabold text-[#F8FAFC]"
                    >
                      {mod.title}
                    </h2>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">{mod.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mod.lessons.map((lesson) => {
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};
