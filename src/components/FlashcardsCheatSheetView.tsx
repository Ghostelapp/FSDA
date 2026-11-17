import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  getLocalizedFlashcardsDeck,
  getLocalizedCheatSheets,
  FlashcardRating,
  FlashcardScheduleState,
  calculateNextFlashcardReview,
  filterCheatSheets,
} from '../utils/developerSimulators';
import { CodeBlock } from './CodeBlock';
import {
  RotateCw,
  Search,
  Sparkles,
  Brain,
} from 'lucide-react';

const CHEAT_CATEGORY_KEYS = [
  'Wszystkie',
  'HTML5',
  'CSS Flexbox & Grid',
  'JavaScript ES6+',
  'React Hooks',
  'SQL & Bazy',
  'Git & Terminal',
] as const;

export const FlashcardsCheatSheetView: React.FC = () => {
  const { awardCustomXp, language } = useApp();
  const isEn = language === 'en';
  const flashcardsDeck = getLocalizedFlashcardsDeck(language);
  const cheatSheetsData = getLocalizedCheatSheets(language);

  const [mode, setMode] = useState<'flashcards' | 'cheatsheets'>('flashcards');

  // Flashcards state
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [scheduleMap, setScheduleMap] = useState<Record<string, FlashcardScheduleState>>({});
  const [reviewedCount, setReviewedCount] = useState<number>(0);
  const [recentlyReviewedCardIds, setRecentlyReviewedCardIds] = useState<string[]>([]);

  // Cheat sheets state
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentCard = flashcardsDeck[cardIndex] || flashcardsDeck[0];
  const currentCardSchedule = scheduleMap[currentCard.id];

  const getCategoryLabel = (catKey: string): string => {
    if (!isEn) return catKey;
    if (catKey === 'Wszystkie') return 'All';
    if (catKey === 'SQL & Bazy') return 'SQL & Databases';
    return catKey;
  };

  const handleRateCard = (rating: FlashcardRating) => {
    const updated = calculateNextFlashcardReview(currentCardSchedule, rating);
    setScheduleMap((prev) => ({ ...prev, [currentCard.id]: updated }));
    setIsFlipped(false);
    setReviewedCount((c) => c + 1);
    setCardIndex((prev) => (prev + 1) % flashcardsDeck.length);
    const reviewedCardIds = [...recentlyReviewedCardIds, currentCard.id];
    setRecentlyReviewedCardIds(reviewedCardIds.length >= 3 ? [] : reviewedCardIds);

    if (reviewedCardIds.length >= 3) {
      awardCustomXp(
        25,
        isEn ? 'SM-2 flashcard review streak completed!' : 'Seria powtórek fiszek SM-2 ukończona!',
        `flashcards-${new Date().toISOString().slice(0, 10)}`,
        { cardIds: reviewedCardIds }
      );
    }
  };

  const filteredSnippets = filterCheatSheets(cheatSheetsData, selectedCategory, searchQuery);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header & Mode Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <p className="text-xs font-semibold text-indigo-400">
            {isEn ? 'Long-Term Retention & Quick Reference' : 'Pamięć Długotrwała & Szybka Referencja'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {isEn ? 'SM-2 Flashcards & Developer Cheat Sheets' : 'Fiszki SM-2 & Ściągi Programistyczne'}
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            {isEn
              ? 'Master essential interview concepts using Spaced Repetition (SM-2) and browse production-ready code cheat sheets.'
              : 'Utrwalaj kluczowe pojęcia rekrutacyjne algorytmem Spaced Repetition (SM-2) i korzystaj z gotowych ściąg kodu.'}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl border border-slate-800 bg-slate-900 shrink-0">
          <button
            type="button"
            onClick={() => setMode('flashcards')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              mode === 'flashcards'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {isEn ? `SM-2 Flashcards (${flashcardsDeck.length})` : `Fiszki SM-2 (${flashcardsDeck.length})`}
          </button>
          <button
            type="button"
            onClick={() => setMode('cheatsheets')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              mode === 'cheatsheets'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {isEn ? `Code Cheat Sheets (${cheatSheetsData.length})` : `Ściągi Kodu (${cheatSheetsData.length})`}
          </button>
        </div>
      </div>

      {mode === 'flashcards' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Flashcard Stage (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                {isEn ? 'Category:' : 'Kategoria:'} <strong className="text-indigo-300">{currentCard.category}</strong>
              </span>
              <span className="font-mono tabular-nums">
                {isEn ? 'Card' : 'Karta'} {cardIndex + 1} / {flashcardsDeck.length} · {isEn ? 'Reviewed today:' : 'Powtórzono dziś:'} {reviewedCount}
              </span>
            </div>

            <div className="min-h-[240px] rounded-2xl border border-slate-800 bg-slate-950 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-cyan-400">
                  {isFlipped
                    ? isEn ? 'Answer & Explanation:' : 'Odpowiedź i wyjaśnienie:'
                    : isEn ? 'Interview Question:' : 'Pytanie rekrutacyjne:'}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {currentCard.question}
                </h2>

                {isFlipped && (
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <p className="text-sm text-slate-200 leading-relaxed">{currentCard.answer}</p>
                    {currentCard.codeSnippet && (
                      <CodeBlock
                        code={currentCard.codeSnippet}
                        language="javascript"
                        title={isEn ? 'Code Example' : 'Przykład kodu'}
                        showLineNumbers={true}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setIsFlipped((f) => !f)}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white transition-colors"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>
                    {isFlipped
                      ? isEn ? 'Hide Answer' : 'Ukryj odpowiedź'
                      : isEn ? 'Show Answer' : 'Pokaż odpowiedź'}
                  </span>
                </button>

                {currentCardSchedule && (
                  <span className="text-xs font-mono text-slate-400 tabular-nums">
                    {isEn
                      ? `SM-2 Interval: ${currentCardSchedule.intervalDays}d (EF: ${currentCardSchedule.easeFactor})`
                      : `Interwał SM-2: ${currentCardSchedule.intervalDays} dni (EF: ${currentCardSchedule.easeFactor})`}
                  </span>
                )}
              </div>
            </div>

            {/* SM-2 Rating Controls */}
            <div className="space-y-2">
              <p className="text-xs text-slate-400">
                {isEn
                  ? 'Rate your recall to calculate your next review interval (SuperMemo SM-2 algorithm):'
                  : 'Oceń jak dobrze pamiętasz odpowiedź, aby wyliczyć kolejny termin powtórki (algorytm SuperMemo SM-2):'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => handleRateCard('again')}
                  className="rounded-xl border border-rose-500/30 bg-rose-950/30 hover:bg-rose-900/40 py-2.5 px-3 text-xs font-bold text-rose-300 transition-colors"
                >
                  {isEn ? 'Again (1 day)' : 'Powtórz (1 dzień)'}
                </button>
                <button
                  type="button"
                  onClick={() => handleRateCard('hard')}
                  className="rounded-xl border border-amber-500/30 bg-amber-950/30 hover:bg-amber-900/40 py-2.5 px-3 text-xs font-bold text-amber-300 transition-colors"
                >
                  {isEn ? 'Hard (1.2x)' : 'Trudne (1.2x)'}
                </button>
                <button
                  type="button"
                  onClick={() => handleRateCard('good')}
                  className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 hover:bg-indigo-900/40 py-2.5 px-3 text-xs font-bold text-indigo-300 transition-colors"
                >
                  {isEn ? 'Good (2.5x)' : 'Dobre (2.5x)'}
                </button>
                <button
                  type="button"
                  onClick={() => handleRateCard('easy')}
                  className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-900/40 py-2.5 px-3 text-xs font-bold text-emerald-300 transition-colors"
                >
                  {isEn ? 'Easy (4+ days)' : 'Łatwe (4+ dni)'}
                </button>
              </div>
            </div>
          </div>

          {/* Deck List (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">{isEn ? 'Interview Flashcard Deck' : 'Talia Pytania Rekrutacyjne'}</h3>
              </div>
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>

            <div className="space-y-2">
              {flashcardsDeck.map((fc, idx) => {
                const sched = scheduleMap[fc.id];
                return (
                  <button
                    key={fc.id}
                    type="button"
                    onClick={() => {
                      setCardIndex(idx);
                      setIsFlipped(false);
                    }}
                    className={`w-full text-left rounded-xl border p-3 transition-colors ${
                      idx === cardIndex
                        ? 'border-indigo-500 bg-indigo-950/30'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{fc.category}</span>
                      <span className="font-mono tabular-nums">
                        {sched ? (isEn ? `In ${sched.intervalDays}d` : `Za ${sched.intervalDays}d`) : (isEn ? 'New' : 'Nowa')}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white mt-1 line-clamp-1">
                      {fc.question}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Cheat Sheets View */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {CHEAT_CATEGORY_KEYS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label={isEn ? 'Search code cheat sheets' : 'Szukaj w ściągach kodu'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? 'Search (e.g. grid, fetch, join)...' : 'Szukaj (np. grid, fetch, join)...'}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSnippets.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col space-y-4"
              >
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-indigo-400">{getCategoryLabel(item.category)}</span>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-300">{item.summary}</p>
                </div>

                <CodeBlock
                  code={item.code}
                  language={
                    item.category?.toLowerCase().includes('css')
                      ? 'css'
                      : item.category?.toLowerCase().includes('sql')
                      ? 'sql'
                      : item.category?.toLowerCase().includes('html')
                      ? 'html'
                      : item.category?.toLowerCase().includes('git') || item.category?.toLowerCase().includes('bash')
                      ? 'bash'
                      : 'javascript'
                  }
                  title={item.title}
                  showLineNumbers={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
