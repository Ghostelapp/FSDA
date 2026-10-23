import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FLASHCARDS_DECK,
  CHEAT_SHEETS_DATA,
  FlashcardRating,
  FlashcardScheduleState,
  calculateNextFlashcardReview,
  filterCheatSheets,
} from '../utils/developerSimulators';
import {
  BookOpen,
  RotateCw,
  Copy,
  Check,
  Search,
  Sparkles,
  Brain,
} from 'lucide-react';

const CHEAT_CATEGORIES = [
  'Wszystkie',
  'HTML5',
  'CSS Flexbox & Grid',
  'JavaScript ES6+',
  'React Hooks',
  'SQL & Bazy',
  'Git & Terminal',
];

export const FlashcardsCheatSheetView: React.FC = () => {
  const { awardCustomXp } = useApp();
  const [mode, setMode] = useState<'flashcards' | 'cheatsheets'>('flashcards');

  // Flashcards state
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [scheduleMap, setScheduleMap] = useState<Record<string, FlashcardScheduleState>>({});
  const [reviewedCount, setReviewedCount] = useState<number>(0);

  // Cheat sheets state
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentCard = FLASHCARDS_DECK[cardIndex] || FLASHCARDS_DECK[0];
  const currentCardSchedule = scheduleMap[currentCard.id];

  const handleRateCard = (rating: FlashcardRating) => {
    const updated = calculateNextFlashcardReview(currentCardSchedule, rating);
    setScheduleMap((prev) => ({ ...prev, [currentCard.id]: updated }));
    setIsFlipped(false);
    setReviewedCount((c) => c + 1);
    setCardIndex((prev) => (prev + 1) % FLASHCARDS_DECK.length);

    if ((reviewedCount + 1) % 3 === 0) {
      awardCustomXp(25, 'Seria powtórek fiszek SM-2 ukończona!');
    }
  };

  const filteredSnippets = filterCheatSheets(CHEAT_SHEETS_DATA, selectedCategory, searchQuery);

  const handleCopyCode = (id: string, code: string) => {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(code);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header & Mode Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <p className="text-xs font-semibold text-indigo-400">Pamięć Długotrwała & Szybka Referencja</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Fiszki SM-2 & Ściągi Programistyczne
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Utrwalaj kluczowe pojęcia rekrutacyjne algorytmem Spaced Repetition (SM-2) i korzystaj z gotowych ściąg kodu.
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
            Fiszki SM-2 ({FLASHCARDS_DECK.length})
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
            Ściągi Kodu ({CHEAT_SHEETS_DATA.length})
          </button>
        </div>
      </div>

      {mode === 'flashcards' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Flashcard Stage (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Kategoria: <strong className="text-indigo-300">{currentCard.category}</strong>
              </span>
              <span className="font-mono tabular-nums">
                Karta {cardIndex + 1} / {FLASHCARDS_DECK.length} · Powtórzono dziś: {reviewedCount}
              </span>
            </div>

            <div className="min-h-[240px] rounded-2xl border border-slate-800 bg-slate-950 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-cyan-400">
                  {isFlipped ? 'Odpowiedź i wyjaśnienie:' : 'Pytanie rekrutacyjne:'}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {currentCard.question}
                </h2>

                {isFlipped && (
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <p className="text-sm text-slate-200 leading-relaxed">{currentCard.answer}</p>
                    {currentCard.codeSnippet && (
                      <pre className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs font-mono text-emerald-300 overflow-x-auto">
                        {currentCard.codeSnippet}
                      </pre>
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
                  <span>{isFlipped ? 'Ukryj odpowiedź' : 'Pokaż odpowiedź'}</span>
                </button>

                {currentCardSchedule && (
                  <span className="text-xs font-mono text-slate-400 tabular-nums">
                    Interwał SM-2: {currentCardSchedule.intervalDays} dni (EF: {currentCardSchedule.easeFactor})
                  </span>
                )}
              </div>
            </div>

            {/* SM-2 Rating Controls */}
            <div className="space-y-2">
              <p className="text-xs text-slate-400">
                Oceń jak dobrze pamiętasz odpowiedź, aby wyliczyć kolejny termin powtórki (algorytm SuperMemo SM-2):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => handleRateCard('again')}
                  className="rounded-xl border border-rose-500/30 bg-rose-950/30 hover:bg-rose-900/40 py-2.5 px-3 text-xs font-bold text-rose-300 transition-colors"
                >
                  Powtórz (1 dzień)
                </button>
                <button
                  type="button"
                  onClick={() => handleRateCard('hard')}
                  className="rounded-xl border border-amber-500/30 bg-amber-950/30 hover:bg-amber-900/40 py-2.5 px-3 text-xs font-bold text-amber-300 transition-colors"
                >
                  Trudne (1.2x)
                </button>
                <button
                  type="button"
                  onClick={() => handleRateCard('good')}
                  className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 hover:bg-indigo-900/40 py-2.5 px-3 text-xs font-bold text-indigo-300 transition-colors"
                >
                  Dobre (2.5x)
                </button>
                <button
                  type="button"
                  onClick={() => handleRateCard('easy')}
                  className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-900/40 py-2.5 px-3 text-xs font-bold text-emerald-300 transition-colors"
                >
                  Łatwe (4+ dni)
                </button>
              </div>
            </div>
          </div>

          {/* Deck List (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Talia Pytania Rekrutacyjne</h3>
              </div>
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>

            <div className="space-y-2">
              {FLASHCARDS_DECK.map((fc, idx) => {
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
                        {sched ? `Za ${sched.intervalDays}d` : 'Nowa'}
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
              {CHEAT_CATEGORIES.map((cat) => (
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
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label="Szukaj w ściągach kodu"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj (np. grid, fetch, join)..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSnippets.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-400">{item.category}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(item.id, item.code)}
                      className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Skopiowano</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Kopiuj kod</span>
                        </>
                      )}
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-300">{item.summary}</p>
                </div>

                <pre className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs font-mono text-cyan-200 overflow-x-auto">
                  {item.code}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
