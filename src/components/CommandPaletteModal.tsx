import React, { useState, useEffect, useMemo } from 'react';
import { useApp, AppTab } from '../context/AppContext';
import {
  Search,
  X,
  ArrowRight,
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  categoryLabel: string;
  tab: AppTab;
  lessonId?: string;
  projectId?: string;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({ isOpen, onClose }) => {
  const { allLessons, allProjects, setActiveTab, language } = useApp();
  const isEn = language === 'en';
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const allItems: PaletteItem[] = useMemo(() => {
    const toolLabel = isEn ? 'Tool' : 'Narzędzie';
    const lessonLabel = isEn ? 'Lesson' : 'Lekcja';
    const projectLabel = isEn ? 'Project' : 'Projekt';

    const tools: PaletteItem[] = [
      {
        id: 'tool-api',
        title: isEn ? 'REST API Studio (HTTP Client / Postman)' : 'Studio REST API (Klient HTTP / Postman)',
        subtitle: isEn
          ? 'GET/POST/DELETE endpoint simulator, Bearer JWT and API missions'
          : 'Symulator endpointów GET/POST/DELETE, Bearer JWT i misje API',
        categoryLabel: toolLabel,
        tab: 'api_studio',
      },
      {
        id: 'tool-event-loop',
        title: isEn ? 'JS Event Loop & Async Visualizer' : 'Wizualizator JS Event Loop & Async',
        subtitle: isEn
          ? 'Call Stack, Microtask Queue (Promise) and Macrotask (setTimeout) simulation'
          : 'Symulacja Call Stack, Microtask Queue (Promise) i Macrotask (setTimeout)',
        categoryLabel: toolLabel,
        tab: 'event_loop',
      },
      {
        id: 'tool-leaderboard',
        title: isEn ? 'Weekly XP Leagues & Daily Challenge' : 'Ligi Tygodniowe XP & Wyzwanie Dnia',
        subtitle: isEn
          ? 'Student ranking and daily JavaScript algorithmic challenges'
          : 'Ranking kursantów oraz codzienne zadania algorytmiczne JS',
        categoryLabel: toolLabel,
        tab: 'leaderboard',
      },
      {
        id: 'tool-flashcards',
        title: isEn ? 'SM-2 Flashcards & Developer Cheat Sheets' : 'Fiszki SM-2 & Ściągi Programistyczne',
        subtitle: isEn
          ? 'Interview question spaced repetition and ready-to-use code snippets'
          : 'Powtórki pytań rekrutacyjnych i gotowe snippety kodu',
        categoryLabel: toolLabel,
        tab: 'flashcards',
      },
      {
        id: 'tool-career',
        title: isEn ? 'CV / GitHub Portfolio Builder & JSON Backup' : 'Kreator CV / Portfolio GitHub & Backup JSON',
        subtitle: isEn
          ? 'Junior Full Stack Developer CV generator and progress export'
          : 'Generator CV Junior Full Stack Developera oraz eksport postępów',
        categoryLabel: toolLabel,
        tab: 'career',
      },
      {
        id: 'tool-terminal',
        title: isEn ? 'Bash & Git Terminal' : 'Terminal Bash & Git',
        subtitle: isEn
          ? 'Interactive Linux command console and Git version control simulator'
          : 'Interaktywna konsola poleceń Linux oraz systemu kontroli wersji Git',
        categoryLabel: toolLabel,
        tab: 'terminal',
      },
      {
        id: 'tool-sql',
        title: isEn ? 'SQL Database Studio' : 'Studio Bazy SQL',
        subtitle: isEn
          ? 'Execute SELECT, JOIN and GROUP BY queries on a live database'
          : 'Wykonywanie zapytań SELECT, JOIN, GROUP BY na żywej bazie',
        categoryLabel: toolLabel,
        tab: 'sql_studio',
      },
    ];

    const lessonItems: PaletteItem[] = allLessons.map((l, idx) => ({
      id: `lesson-${l.id}-${idx}`,
      title: l.title,
      subtitle: `${l.moduleTitle} · +${l.xpReward} XP`,
      categoryLabel: lessonLabel,
      tab: 'lesson',
      lessonId: l.id,
    }));

    const projectItems: PaletteItem[] = allProjects.map((p, idx) => ({
      id: `proj-${p.id}-${idx}`,
      title: p.title,
      subtitle: `${isEn ? 'Project' : 'Projekt'} #${p.number} · ${p.displayDifficulty || p.difficulty} · +${p.xpReward} XP`,
      categoryLabel: projectLabel,
      tab: 'projects',
      projectId: p.id,
    }));

    return [...tools, ...lessonItems, ...projectItems];
  }, [allLessons, allProjects, isEn]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems.slice(0, 12);
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.categoryLabel.toLowerCase().includes(q)
      )
      .slice(0, 15);
  }, [allItems, query]);

  if (!isOpen) return null;

  const handleSelect = (item: PaletteItem) => {
    setActiveTab(item.tab, item.lessonId, item.projectId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/80 backdrop-blur-sm p-4 pt-16 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? 'Global search and command palette' : 'Globalna wyszukiwarka i paleta poleceń'}
    >
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3.5">
          <Search className="h-4 w-4 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            aria-label={isEn ? 'Type a search phrase or command' : 'Wpisz szukaną frazę lub polecenie'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isEn
                ? 'Search lessons, simulators (REST API, Event Loop, SQL), projects...'
                : 'Szukaj lekcji, symulatora (REST API, Event Loop, SQL), projektu...'
            }
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? 'Close search' : 'Zamknij wyszukiwarkę'}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/50">
          {filteredItems.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400">
              {isEn ? `No results for “${query}”.` : `Brak wyników dla zapytania „${query}”.`}
            </p>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left hover:bg-slate-800/90 transition-colors group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-400">· {item.categoryLabel}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
              </button>
            ))
          )}
        </div>

        <div className="border-t border-slate-800 bg-slate-950 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            {isEn
              ? 'Tip: Press Ctrl+K (or Cmd+K) to open from any view'
              : 'Wskazówka: Naciśnij Ctrl+K (lub Cmd+K), aby otworzyć z dowolnego widoku'}
          </span>
          <span>{isEn ? 'ESC to close' : 'ESC aby zamknąć'}</span>
        </div>
      </div>
    </div>
  );
};
