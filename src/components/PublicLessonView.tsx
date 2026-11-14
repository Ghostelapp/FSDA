import React, { useMemo } from 'react';
import { MODULES_DATA } from '../data/modulesData';
import { useApp } from '../context/AppContext';
import { PublicHeader } from './PublicHeader';
import { RichInlineText } from './RichInlineText';
import { CodeBlock } from './CodeBlock';
import {
  estimateLessonReadingMinutes,
  getBeginnerLessonAid,
  groupTheoryBlocksIntoSections,
  parseTheoryBlocks,
} from '../utils/lessonReadability';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Lightbulb,
  Play,
  Terminal,
} from 'lucide-react';

interface PublicLessonViewProps {
  lessonId: string | null;
  onOpenAuthModal: () => void;
}

export const PublicLessonView: React.FC<PublicLessonViewProps> = ({
  lessonId,
  onOpenAuthModal,
}) => {
  const { allLessons, setActiveTab, isAuthenticated } = useApp();

  const lesson = useMemo(
    () => allLessons.find((l) => l.id === lessonId) || allLessons[0],
    [allLessons, lessonId]
  );

  const currentIndex = useMemo(
    () => allLessons.findIndex((l) => l.id === lesson.id),
    [allLessons, lesson.id]
  );
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  const moduleInfo = useMemo(
    () => MODULES_DATA.find((m) => m.id === lesson.moduleId) || MODULES_DATA[0],
    [lesson.moduleId]
  );

  const beginnerAid = useMemo(() => getBeginnerLessonAid(lesson), [lesson]);
  const theorySections = useMemo(
    () => groupTheoryBlocksIntoSections(parseTheoryBlocks(lesson.theoryMarkdown)),
    [lesson.theoryMarkdown]
  );
  const readingMinutes = useMemo(() => estimateLessonReadingMinutes(lesson), [lesson]);

  const navigatePublicLesson = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetTab: 'landing' | 'knowledge_base' | 'public_lesson',
    targetLessonId?: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setActiveTab(targetTab, targetLessonId);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleOpenInteractiveSandbox = () => {
    setActiveTab('lesson', lesson.id);
    if (!isAuthenticated) {
      onOpenAuthModal();
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div className="min-h-screen bg-[#06080E] text-[#F8FAFC] selection:bg-indigo-600 selection:text-white">
      <PublicHeader onOpenAuthModal={onOpenAuthModal} activeTab="public_lesson" />

      <article className="mx-auto max-w-4xl px-4 sm:px-8 py-10 sm:py-14 space-y-10">
        {/* Breadcrumbs */}
        <nav aria-label="Ścieżka nawigacji" className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8]">
          <a
            href="/"
            onClick={(e) => navigatePublicLesson(e, 'landing')}
            className="hover:text-[#F8FAFC] transition-colors"
          >
            Strona Główna
          </a>
          <span aria-hidden="true">/</span>
          <a
            href="/baza-wiedzy"
            onClick={(e) => navigatePublicLesson(e, 'knowledge_base')}
            className="hover:text-[#F8FAFC] transition-colors"
          >
            Baza Wiedzy
          </a>
          <span aria-hidden="true">/</span>
          <span className="text-indigo-300 font-medium">
            Moduł {String(moduleInfo.id).padStart(2, '0')} · Lekcja {lesson.order}
          </span>
        </nav>

        {/* Article Hero Header */}
        <header className="space-y-4 pb-8 border-b border-white/[0.08]">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/15 border border-indigo-500/30 font-semibold text-indigo-300">
              {moduleInfo.category} · {beginnerAid.difficultyLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              Czas czytania: ~{readingMinutes} min
            </span>
            <span className="font-mono tabular-nums">
              +{lesson.xpReward} XP w aplikacji
            </span>
          </div>

          <h1
            style={{ textWrap: 'balance' }}
            className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC] leading-tight"
          >
            <RichInlineText text={lesson.title} />
          </h1>

          <p className="text-base sm:text-lg text-[#CBD5E1] leading-relaxed">
            <RichInlineText text={lesson.summary} />
          </p>
        </header>

        {/* Everyday Life Analogy */}
        <section
          aria-labelledby="lesson-analogy-heading"
          className="rounded-2xl border border-indigo-500/30 bg-[#0B1120] p-6 space-y-2.5"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
            <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Analogia z życia codziennego</span>
          </div>
          <h2 id="lesson-analogy-heading" className="text-base sm:text-lg font-bold text-[#F8FAFC]">
            {beginnerAid.analogyTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
            <RichInlineText text={beginnerAid.analogyText} />
          </p>
        </section>

        {/* Plain-Language Glossary */}
        {beginnerAid.glossary.length > 0 && (
          <section aria-labelledby="lesson-glossary-heading" className="space-y-4">
            <h2
              id="lesson-glossary-heading"
              className="font-display text-lg sm:text-xl font-bold text-[#F8FAFC] flex items-center gap-2"
            >
              <BookOpen className="h-5 w-5 text-indigo-400" />
              <span>Słowniczek pojęć w tej lekcji</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {beginnerAid.glossary.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/[0.08] bg-[#0B101B] p-4 space-y-1.5"
                >
                  <p className="text-sm font-bold text-indigo-300">
                    <RichInlineText text={item.term} />
                  </p>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    <RichInlineText text={item.simpleDefinition} />
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Full Educational Theory Sections */}
        <div className="space-y-8">
          {theorySections.map((section) => (
            <section
              key={section.id}
              className="rounded-2xl border border-white/[0.08] bg-[#0B101B] p-6 sm:p-8 space-y-5"
            >
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#F8FAFC] border-b border-white/[0.08] pb-3">
                <span className="font-mono text-indigo-400 mr-2 text-base">
                  {String(section.index).padStart(2, '0')}.
                </span>
                <RichInlineText text={section.title} />
              </h2>

              <div className="space-y-4">
                {section.blocks.map((block, bIdx) => {
                  if (block.type === 'paragraph') {
                    return (
                      <p key={bIdx} className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
                        <RichInlineText
                          text={block.tokens.map((t) =>
                            t.type === 'code'
                              ? `\`${t.content}\``
                              : t.type === 'bold'
                              ? `**${t.content}**`
                              : t.content
                          ).join('')}
                        />
                      </p>
                    );
                  }

                  if (block.type === 'ordered_list') {
                    return (
                      <ol key={bIdx} className="space-y-3 pl-1">
                        {block.items.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="flex items-start gap-3 text-sm sm:text-base text-[#CBD5E1] leading-relaxed"
                          >
                            <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/15 border border-indigo-500/30 rounded-md px-2 py-0.5 mt-0.5 shrink-0">
                              {item.number}
                            </span>
                            <div>
                              {item.title && (
                                <strong className="font-semibold text-[#F8FAFC] mr-1.5">
                                  <RichInlineText
                                    text={item.title
                                      .map((t) => (t.type === 'code' ? `\`${t.content}\`` : t.content))
                                      .join('')}
                                  />
                                </strong>
                              )}
                              <RichInlineText
                                text={item.body
                                  .map((t) => (t.type === 'code' ? `\`${t.content}\`` : t.content))
                                  .join('')}
                              />
                            </div>
                          </li>
                        ))}
                      </ol>
                    );
                  }

                  if (block.type === 'unordered_list') {
                    return (
                      <ul key={bIdx} className="space-y-2.5 pl-1">
                        {block.items.map((tokens, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="flex items-start gap-2.5 text-sm sm:text-base text-[#CBD5E1] leading-relaxed"
                          >
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-2.5 shrink-0"
                            />
                            <span>
                              <RichInlineText
                                text={tokens
                                  .map((t) =>
                                    t.type === 'code'
                                      ? `\`${t.content}\``
                                      : t.type === 'bold'
                                      ? `**${t.content}**`
                                      : t.content
                                  )
                                  .join('')}
                              />
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  if (block.type === 'code_block') {
                    return (
                      <CodeBlock
                        key={bIdx}
                        code={block.code}
                        language={block.language}
                        showLineNumbers={true}
                      />
                    );
                  }

                  return null;
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Code Examples */}
        {lesson.codeExamples && lesson.codeExamples.length > 0 && (
          <section aria-labelledby="lesson-code-examples-heading" className="space-y-5">
            <h2
              id="lesson-code-examples-heading"
              className="font-display text-xl sm:text-2xl font-extrabold text-[#F8FAFC]"
            >
              Przykłady kodu z omówieniem
            </h2>
            <div className="space-y-6">
              {lesson.codeExamples.map((example, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/[0.08] bg-[#0B101B] p-6 space-y-4"
                >
                  <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC]">
                    <RichInlineText text={example.title} />
                  </h3>
                  <CodeBlock
                    code={example.code}
                    language={example.language}
                    title={example.title}
                    showLineNumbers={true}
                  />
                  {example.explanation && (
                    <p className="text-sm text-[#CBD5E1] leading-relaxed">
                      <RichInlineText text={example.explanation} />
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Takeaways & Exercise Solution Reference */}
        <section className="rounded-2xl border border-emerald-500/30 bg-[#0A131F] p-6 sm:p-8 space-y-5">
          <h2 className="font-display text-lg sm:text-xl font-bold text-[#F8FAFC]">
            Podsumowanie i wzorzec praktycznego zadania
          </h2>

          {beginnerAid.keyTakeaways.length > 0 && (
            <ul className="space-y-2.5 text-sm text-[#CBD5E1]">
              {beginnerAid.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                  <span>
                    <RichInlineText text={point} />
                  </span>
                </li>
              ))}
            </ul>
          )}

          {lesson.interactiveExercise?.instructions && (
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <Terminal className="h-4 w-4" />
                <span>Zadanie praktyczne w tej lekcji</span>
              </div>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                <RichInlineText text={lesson.interactiveExercise.instructions} />
              </p>

              {lesson.interactiveExercise.solutionCode?.html && (
                <CodeBlock
                  code={lesson.interactiveExercise.solutionCode.html}
                  language="html"
                  title="Przykładowe rozwiązanie — HTML"
                />
              )}
              {lesson.interactiveExercise.solutionCode?.css && (
                <CodeBlock
                  code={lesson.interactiveExercise.solutionCode.css}
                  language="css"
                  title="Przykładowe rozwiązanie — CSS"
                />
              )}
              {lesson.interactiveExercise.solutionCode?.js && (
                <CodeBlock
                  code={lesson.interactiveExercise.solutionCode.js}
                  language="javascript"
                  title="Przykładowe rozwiązanie — JavaScript / TypeScript"
                />
              )}
            </div>
          )}

          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Chcesz uruchomić ten kod w interaktywnym edytorze z testem kroków i zapisać postęp?
            </p>
            <button
              type="button"
              onClick={handleOpenInteractiveSandbox}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors whitespace-nowrap shrink-0"
            >
              <Play className="h-4 w-4 shrink-0" />
              <span>Ćwicz w edytorze na żywo</span>
            </button>
          </div>
        </section>

        {/* Previous / Next Crawlable Lesson Links */}
        <nav
          aria-label="Nawigacja między lekcjami"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/[0.08]"
        >
          {prevLesson ? (
            <a
              href={`/baza-wiedzy/${encodeURIComponent(prevLesson.id)}`}
              onClick={(e) => navigatePublicLesson(e, 'public_lesson', prevLesson.id)}
              className="rounded-2xl border border-white/10 bg-[#0B101B] hover:border-indigo-500/60 p-5 space-y-1.5 transition-colors"
            >
              <span className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8]">
                <ArrowLeft className="h-3.5 w-3.5" />
                Poprzednia lekcja
              </span>
              <p className="text-sm font-bold text-[#F8FAFC] leading-snug">
                <RichInlineText text={prevLesson.title} />
              </p>
            </a>
          ) : (
            <a
              href="/baza-wiedzy"
              onClick={(e) => navigatePublicLesson(e, 'knowledge_base')}
              className="rounded-2xl border border-white/10 bg-[#0B101B] hover:border-indigo-500/60 p-5 space-y-1.5 transition-colors"
            >
              <span className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8]">
                <ArrowLeft className="h-3.5 w-3.5" />
                Powrót do spisu lekcji
              </span>
              <p className="text-sm font-bold text-[#F8FAFC]">Wszystkie 15 modułów i 91 lekcji</p>
            </a>
          )}

          {nextLesson && (
            <a
              href={`/baza-wiedzy/${encodeURIComponent(nextLesson.id)}`}
              onClick={(e) => navigatePublicLesson(e, 'public_lesson', nextLesson.id)}
              className="rounded-2xl border border-white/10 bg-[#0B101B] hover:border-indigo-500/60 p-5 space-y-1.5 text-right transition-colors"
            >
              <span className="inline-flex items-center justify-end gap-1.5 text-xs text-indigo-400 font-semibold">
                Następna lekcja
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <p className="text-sm font-bold text-[#F8FAFC] leading-snug">
                <RichInlineText text={nextLesson.title} />
              </p>
            </a>
          )}
        </nav>
      </article>
    </div>
  );
};
