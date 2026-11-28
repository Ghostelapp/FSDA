import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PublicHeader } from './PublicHeader';
import { CodeBlock } from './CodeBlock';
import { GUIDES_DATA } from '../data/guidesData';
import {
  estimateGuideReadingMinutes,
  getGuideBySlug,
  getGuideWordCount,
} from '../utils/guides';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  HelpCircle,
  List,
} from 'lucide-react';

interface GuideDetailViewProps {
  guideSlug: string | null;
  onOpenAuthModal: () => void;
}

export const GuideDetailView: React.FC<GuideDetailViewProps> = ({
  guideSlug,
  onOpenAuthModal,
}) => {
  const { setActiveTab, allLessons, language } = useApp();
  const isEn = language === 'en';

  const guide = useMemo(
    () => getGuideBySlug(GUIDES_DATA, guideSlug) || GUIDES_DATA[0],
    [guideSlug]
  );

  const readingMinutes = useMemo(() => estimateGuideReadingMinutes(guide), [guide]);
  const wordCount = useMemo(() => getGuideWordCount(guide), [guide]);

  const relatedLessons = useMemo(
    () =>
      guide.relatedLessonIds
        .map((id) => allLessons.find((lesson) => lesson.id === id))
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [guide.relatedLessonIds, allLessons]
  );

  const relatedGuides = useMemo(
    () =>
      guide.relatedGuideSlugs
        .map((slug) => getGuideBySlug(GUIDES_DATA, slug))
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [guide.relatedGuideSlugs]
  );

  const handleNavigate = (
    e: React.MouseEvent<HTMLAnchorElement>,
    target: 'landing' | 'guides' | 'guide_detail' | 'knowledge_base' | 'public_lesson',
    idOrSlug?: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setActiveTab(target, idOrSlug);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div className="min-h-screen bg-[#06080E] text-[#F8FAFC] selection:bg-indigo-600 selection:text-white">
      <PublicHeader onOpenAuthModal={onOpenAuthModal} activeTab="guide_detail" />

      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-10 sm:py-14">
        {/* Breadcrumbs */}
        <nav
          aria-label={isEn ? 'Breadcrumbs' : 'Ścieżka nawigacji'}
          className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8] mb-8"
        >
          <a
            href="/"
            onClick={(e) => handleNavigate(e, 'landing')}
            className="hover:text-[#F8FAFC] transition-colors"
          >
            {isEn ? 'Home' : 'Strona główna'}
          </a>
          <span aria-hidden="true">/</span>
          <a
            href="/poradniki"
            onClick={(e) => handleNavigate(e, 'guides')}
            className="hover:text-[#F8FAFC] transition-colors"
          >
            {isEn ? 'Guides' : 'Poradniki'}
          </a>
          <span aria-hidden="true">/</span>
          <span className="text-indigo-300 font-medium">
            {isEn ? guide.categoryEn : guide.category}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Editorial Article Column */}
          <article className="lg:col-span-8 min-w-0 space-y-10">
            <header className="space-y-4 pb-8 border-b border-white/[0.08]">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8] tabular-nums">
                <span className="font-semibold text-indigo-400">
                  {isEn ? guide.categoryEn : guide.category}
                </span>
                <span aria-hidden="true">·</span>
                <span>{isEn ? guide.levelEn : guide.level}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {isEn ? 'Updated:' : 'Aktualizacja:'}{' '}
                  <time dateTime={guide.updatedAt}>{guide.updatedAt}</time>
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  {readingMinutes} {isEn ? 'min read' : 'min czytania'}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  ~{wordCount} {isEn ? 'words' : 'słów'}
                </span>
              </div>

              <h1
                style={{ textWrap: 'balance' }}
                className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.12]"
              >
                {guide.title}
              </h1>

              <p className="text-base sm:text-lg text-[#CBD5E1] leading-relaxed">
                {guide.subtitle}
              </p>

              <div className="pt-2 text-xs text-[#94A3B8]">
                <span className="font-semibold text-[#E2E8F0]">{guide.authorName}</span>
                <span aria-hidden="true"> · </span>
                <span>{guide.authorRole}</span>
              </div>
            </header>

            {isEn && (
              <div className="rounded-xl border border-white/10 bg-[#0B101B] p-4 text-xs sm:text-sm text-[#CBD5E1]">
                <strong className="text-[#F8FAFC]">Editorial note:</strong> This long-form technical handbook is authored in Polish ({guide.titleEn}).
              </div>
            )}

            {/* Lead Introduction */}
            <div className="space-y-4 text-[15px] sm:text-base text-[#CBD5E1] leading-[1.78]">
              {guide.leadParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Article Sections */}
            <div className="space-y-12">
              {guide.sections.map((section, idx) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 space-y-5 pt-2 border-t border-white/[0.06]"
                >
                  <h2
                    style={{ textWrap: 'balance' }}
                    className="font-display text-xl sm:text-2xl font-extrabold text-[#F8FAFC] pt-4"
                  >
                    <span className="font-mono text-indigo-400 mr-2 text-base tabular-nums">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    {section.heading}
                  </h2>

                  <div className="space-y-4 text-[15px] sm:text-base text-[#CBD5E1] leading-[1.78]">
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>

                  {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <ul className="space-y-2.5 pt-1">
                      {section.bulletPoints.map((point, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-2.5 text-sm sm:text-[15px] text-[#CBD5E1] leading-relaxed"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.codeSnippet && (
                    <div className="space-y-2 pt-1 min-w-0">
                      <CodeBlock
                        code={section.codeSnippet.code}
                        language={section.codeSnippet.language}
                        title={section.codeSnippet.title}
                        showLineNumbers={true}
                      />
                      {section.codeSnippet.caption && (
                        <p className="text-xs text-[#94A3B8] leading-relaxed">
                          {section.codeSnippet.caption}
                        </p>
                      )}
                    </div>
                  )}

                  {section.table && (
                    <div className="rounded-2xl border border-white/10 bg-[#0B101B] overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                          <caption className="px-4 py-3 text-left text-xs font-semibold text-[#94A3B8] bg-[#0E1422] border-b border-white/[0.08]">
                            {section.table.caption}
                          </caption>
                          <thead>
                            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                              {section.table.headers.map((header, hIdx) => (
                                <th
                                  key={hIdx}
                                  scope="col"
                                  className="px-4 py-3 font-bold text-[#F8FAFC] whitespace-nowrap"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.06]">
                            {section.table.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-white/[0.02]">
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`px-4 py-3 align-top leading-relaxed tabular-nums ${
                                      cIdx === 0
                                        ? 'font-semibold text-[#F8FAFC]'
                                        : 'text-[#CBD5E1]'
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Key Takeaways */}
            <section
              id="podsumowanie"
              className="scroll-mt-24 rounded-2xl border border-emerald-500/25 bg-[#0A131F] p-6 sm:p-8 space-y-4"
            >
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#F8FAFC]">
                {isEn ? 'Key engineering takeaways' : 'Najważniejsze wnioski z poradnika'}
              </h2>
              <ul className="space-y-2.5 text-sm sm:text-[15px] text-[#CBD5E1] leading-relaxed">
                {guide.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* FAQ Section */}
            <section id="faq-poradnik" className="scroll-mt-24 space-y-4">
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#F8FAFC] flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-indigo-400 shrink-0" />
                <span>{isEn ? 'Frequently asked questions' : 'Najczęściej zadawane pytania'}</span>
              </h2>
              <div className="space-y-3">
                {guide.faq.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/[0.08] bg-[#0B101B] p-5 space-y-2"
                  >
                    <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC]">
                      {item.question}
                    </h3>
                    <p className="text-sm text-[#CBD5E1] leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Related Guides */}
            {relatedGuides.length > 0 && (
              <section className="space-y-4 pt-6 border-t border-white/[0.08]">
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#F8FAFC]">
                  {isEn ? 'Continue reading' : 'Przeczytaj również'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedGuides.map((rel) => (
                    <a
                      key={rel.slug}
                      href={`/poradniki/${encodeURIComponent(rel.slug)}`}
                      onClick={(e) => handleNavigate(e, 'guide_detail', rel.slug)}
                      className="group rounded-2xl border border-white/[0.08] bg-[#0B101B] hover:border-indigo-500/50 p-4 flex flex-col justify-between gap-3 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-indigo-400">
                          {isEn ? rel.categoryEn : rel.category}
                        </span>
                        <p className="text-sm font-bold text-[#F8FAFC] leading-snug group-hover:text-indigo-300 transition-colors">
                          {isEn ? rel.titleEn : rel.title}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400">
                        <span>{isEn ? 'Read' : 'Czytaj'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            <div className="pt-4">
              <a
                href="/poradniki"
                onClick={(e) => handleNavigate(e, 'guides')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span>{isEn ? 'Back to all guides' : 'Powrót do listy wszystkich poradników'}</span>
              </a>
            </div>
          </article>

          {/* Right Sidebar: Sticky Table of Contents & Related Open Lessons */}
          <aside className="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
            <nav
              aria-label={isEn ? 'Table of contents' : 'Spis treści poradnika'}
              className="rounded-2xl border border-white/10 bg-[#0B101B] p-5 space-y-3"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#F8FAFC]">
                <List className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>{isEn ? 'On this page' : 'Spis treści'}</span>
              </div>
              <ol className="space-y-2 text-xs sm:text-sm text-[#94A3B8]">
                {guide.sections.map((section, idx) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block py-1 hover:text-[#F8FAFC] transition-colors leading-snug"
                    >
                      <span className="font-mono text-indigo-400 mr-1.5 tabular-nums">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      {section.heading}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#podsumowanie"
                    className="block py-1 hover:text-[#F8FAFC] transition-colors"
                  >
                    {isEn ? 'Key takeaways' : 'Najważniejsze wnioski'}
                  </a>
                </li>
                <li>
                  <a
                    href="#faq-poradnik"
                    className="block py-1 hover:text-[#F8FAFC] transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ol>
            </nav>

            {relatedLessons.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-[#0B101B] p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F8FAFC]">
                  <BookOpen className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    {isEn
                      ? 'Practice in Open Knowledge Base'
                      : 'Powiązane lekcje (bez logowania)'}
                  </span>
                </div>
                <ul className="space-y-2">
                  {relatedLessons.map((lesson) => (
                    <li key={lesson.id}>
                      <a
                        href={`/baza-wiedzy/${encodeURIComponent(lesson.id)}`}
                        onClick={(e) => handleNavigate(e, 'public_lesson', lesson.id)}
                        className="block rounded-xl border border-white/[0.06] bg-[#060911] hover:border-indigo-500/50 p-3 transition-colors"
                      >
                        <p className="text-xs font-semibold text-[#F8FAFC] leading-snug">
                          {lesson.title}
                        </p>
                        <p className="text-[11px] text-[#94A3B8] mt-1 line-clamp-2">
                          {lesson.summary}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
