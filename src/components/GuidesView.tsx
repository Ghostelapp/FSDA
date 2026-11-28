import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { PublicHeader } from './PublicHeader';
import { GUIDES_DATA } from '../data/guidesData';
import {
  GUIDE_CATEGORIES,
  estimateGuideReadingMinutes,
  filterGuides,
  getGuideWordCount,
} from '../utils/guides';
import { ArrowRight, BookOpen, Clock, Search } from 'lucide-react';

interface GuidesViewProps {
  onOpenAuthModal: () => void;
}

const CATEGORY_LABELS_EN: Record<string, string> = {
  Wszystkie: 'All',
  'Ścieżka Kariery': 'Career Path',
  Frontend: 'Frontend',
  'JavaScript & TypeScript': 'JavaScript & TypeScript',
  'Backend & Bazy Danych': 'Backend & Databases',
  'Bezpieczeństwo & DevOps': 'Security & DevOps',
};

export const GuidesView: React.FC<GuidesViewProps> = ({ onOpenAuthModal }) => {
  const { setActiveTab, language, allLessons } = useApp();
  const isEn = language === 'en';
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredGuides = useMemo(
    () => filterGuides(GUIDES_DATA, { category: selectedCategory, query: searchQuery }),
    [selectedCategory, searchQuery]
  );

  const featuredGuide = filteredGuides[0] || null;
  const remainingGuides = filteredGuides.slice(1);

  const handleOpenGuide = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setActiveTab('guide_detail', slug);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleOpenKnowledgeBase = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setActiveTab('knowledge_base');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const filterCategories = ['Wszystkie', ...GUIDE_CATEGORIES];

  return (
    <div className="min-h-screen bg-[#06080E] text-[#F8FAFC] selection:bg-indigo-600 selection:text-white">
      <PublicHeader onOpenAuthModal={onOpenAuthModal} activeTab="guides" />

      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-12 sm:py-16 space-y-10">
        {/* Editorial Header */}
        <header className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#94A3B8]">
            <span className="font-semibold text-indigo-400">
              {isEn ? 'Engineering Guides' : 'Poradniki Eksperckie'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {isEn
                ? `${GUIDES_DATA.length} long-form articles`
                : `${GUIDES_DATA.length} pogłębionych artykułów`}
            </span>
            <span aria-hidden="true">·</span>
            <span>{isEn ? 'Free access without login' : 'Dostępne bez logowania'}</span>
          </div>

          <h1
            style={{ textWrap: 'balance' }}
            className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.08]"
          >
            {isEn
              ? 'In-depth web engineering handbooks and architecture guides.'
              : 'Pogłębione poradniki inżynierii webowej i architektury Full Stack.'}
          </h1>

          <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
            {isEn
              ? 'Practical, long-form engineering articles covering HTML5 & WCAG, CSS Layout, JavaScript Event Loop, TypeScript, React architecture, Node.js REST APIs, PostgreSQL indexing, OWASP security, Docker CI/CD, and technical interviews.'
              : 'Autorskie, rozbudowane opracowania z kompletnymi przykładami kodu produkcyjnego, tabelami porównawczymi i listami kontrolnymi — od semantycznego HTML5 i CSS Grid, przez Event Loop, TypeScript, React i PostgreSQL, aż po bezpieczeństwo OWASP oraz Docker CI/CD.'}
          </p>
        </header>

        {/* Search & Interactive Category Filters */}
        <div className="rounded-2xl border border-white/10 bg-[#0B101B] p-5 space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isEn
                  ? 'Search guides (e.g., PostgreSQL, Event Loop, OWASP, Flexbox, Docker, CV)...'
                  : 'Szukaj poradników (np. PostgreSQL, Event Loop, OWASP, Flexbox, Docker, CV)...'
              }
              aria-label={isEn ? 'Search engineering guides' : 'Szukaj poradników programistycznych'}
              className="w-full rounded-xl border border-white/10 bg-[#060911] pl-10 pr-4 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div
            role="group"
            aria-label={isEn ? 'Filter guides by category' : 'Filtruj poradniki według kategorii'}
            className="flex flex-wrap items-center gap-1.5"
          >
            {filterCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/[0.04] text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {isEn ? CATEGORY_LABELS_EN[cat] || cat : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredGuides.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0B101B] p-10 text-center space-y-3">
            <p className="text-base font-bold text-[#F8FAFC]">
              {isEn ? 'No guides match your filter' : 'Brak poradników pasujących do filtra'}
            </p>
            <p className="text-sm text-[#94A3B8]">
              {isEn
                ? 'Try another keyword or reset the category filter.'
                : 'Spróbuj innej frazy wyszukiwania lub wyczyść wybrany filtr kategorii.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Wszystkie');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
            >
              {isEn ? `Show all ${GUIDES_DATA.length} guides` : `Pokaż wszystkie ${GUIDES_DATA.length} poradników`}
            </button>
          </div>
        ) : (
          <div className="space-y-8" data-testid="guides-list-container">
            {/* Featured Lead Guide */}
            {featuredGuide && (
              <article className="rounded-2xl border border-indigo-500/35 bg-[#0B1120] p-6 sm:p-8 space-y-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8] tabular-nums">
                  <span className="font-semibold text-indigo-400">
                    {isEn ? featuredGuide.categoryEn : featuredGuide.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{isEn ? featuredGuide.levelEn : featuredGuide.level}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featuredGuide.updatedAt}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    {estimateGuideReadingMinutes(featuredGuide)} {isEn ? 'min read' : 'min czytania'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    ~{getGuideWordCount(featuredGuide)} {isEn ? 'words' : 'słów'}
                  </span>
                </div>

                <h2
                  style={{ textWrap: 'balance' }}
                  className="font-display text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] leading-tight"
                >
                  <a
                    href={`/poradniki/${encodeURIComponent(featuredGuide.slug)}`}
                    onClick={(e) => handleOpenGuide(e, featuredGuide.slug)}
                    className="hover:text-indigo-300 transition-colors focus:outline-none focus-visible:underline"
                  >
                    {isEn ? featuredGuide.titleEn : featuredGuide.title}
                  </a>
                </h2>

                <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed max-w-4xl">
                  {isEn ? featuredGuide.subtitleEn : featuredGuide.subtitle}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08]">
                  <span className="text-xs text-[#94A3B8]">
                    {featuredGuide.authorName} · {featuredGuide.sections.length}{' '}
                    {isEn ? 'sections + code examples' : 'rozdziałów + przykłady kodu'}
                  </span>
                  <a
                    href={`/poradniki/${encodeURIComponent(featuredGuide.slug)}`}
                    onClick={(e) => handleOpenGuide(e, featuredGuide.slug)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs sm:text-sm font-bold text-white transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>{isEn ? 'Read full guide' : 'Czytaj pełny poradnik'}</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </a>
                </div>
              </article>
            )}

            {/* Editorial Grid of Remaining Guides */}
            {remainingGuides.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {remainingGuides.map((guide) => {
                  const readingMinutes = estimateGuideReadingMinutes(guide);
                  const wordCount = getGuideWordCount(guide);
                  const href = `/poradniki/${encodeURIComponent(guide.slug)}`;
                  return (
                    <article
                      key={guide.slug}
                      className="group rounded-2xl border border-white/[0.08] bg-[#0B101B] hover:border-indigo-500/50 p-6 flex flex-col justify-between gap-5 transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#94A3B8] tabular-nums">
                          <span className="font-semibold text-indigo-400">
                            {isEn ? guide.categoryEn : guide.category}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{readingMinutes} min</span>
                          <span aria-hidden="true">·</span>
                          <span>{isEn ? guide.levelEn : guide.level}</span>
                        </div>

                        <h2 className="font-display text-lg font-bold text-[#F8FAFC] leading-snug group-hover:text-indigo-300 transition-colors">
                          <a
                            href={href}
                            onClick={(e) => handleOpenGuide(e, guide.slug)}
                            className="focus:outline-none focus-visible:underline"
                          >
                            {isEn ? guide.titleEn : guide.title}
                          </a>
                        </h2>

                        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed line-clamp-3">
                          {isEn ? guide.subtitleEn : guide.subtitle}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                        <span className="text-[11px] text-[#64748B] font-mono tabular-nums">
                          {wordCount} {isEn ? 'words' : 'słów'} · {guide.faq.length} FAQ
                        </span>
                        <a
                          href={href}
                          onClick={(e) => handleOpenGuide(e, guide.slug)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 whitespace-nowrap shrink-0"
                        >
                          <span>{isEn ? 'Read' : 'Czytaj'}</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Cross-link to Open Knowledge Base */}
        <section className="rounded-2xl border border-white/10 bg-[#0B101B] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#F8FAFC]">
              {isEn
                ? `Looking for short topic-by-topic lessons? Explore ${allLessons.length} open lessons.`
                : `Szukasz krótszych lekcji krok po kroku? Sprawdź ${allLessons.length} lekcji w Bazie Wiedzy.`}
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              {isEn
                ? 'Every guide pairs with interactive coding exercises, glossaries, and step-by-step practice inside our Open Knowledge Base.'
                : 'Każdy poradnik łączy się bezpośrednio z interaktywnymi lekcjami, słowniczkiem pojęć i zadaniami praktycznymi w naszej Otwartej Bazie Wiedzy.'}
            </p>
          </div>
          <a
            href="/baza-wiedzy"
            onClick={handleOpenKnowledgeBase}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs sm:text-sm font-bold text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0"
          >
            <BookOpen className="h-4 w-4 text-indigo-400 shrink-0" />
            <span>{isEn ? 'Open Knowledge Base' : 'Otwórz Bazę Wiedzy'}</span>
          </a>
        </section>
      </div>
    </div>
  );
};
