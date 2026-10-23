import React, { useState, useEffect, useMemo } from 'react';
import { useApp, AppTab } from '../context/AppContext';
import { PROJECTS_DATA } from '../data/projectsData';
import {
  Search,
  X,
  Terminal,
  BookOpen,
  FolderGit2,
  Cpu,
  Send,
  Trophy,
  Brain,
  Briefcase,
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
  category: 'Narzędzie' | 'Lekcja' | 'Projekt';
  tab: AppTab;
  lessonId?: string;
  projectId?: string;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({ isOpen, onClose }) => {
  const { allLessons, setActiveTab } = useApp();
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
    const tools: PaletteItem[] = [
      {
        id: 'tool-api',
        title: 'Studio REST API (Klient HTTP / Postman)',
        subtitle: 'Symulator endpointów GET/POST/DELETE, Bearer JWT i misje API',
        category: 'Narzędzie',
        tab: 'api_studio',
      },
      {
        id: 'tool-event-loop',
        title: 'Wizualizator JS Event Loop & Async',
        subtitle: 'Symulacja Call Stack, Microtask Queue (Promise) i Macrotask (setTimeout)',
        category: 'Narzędzie',
        tab: 'event_loop',
      },
      {
        id: 'tool-leaderboard',
        title: 'Ligi Tygodniowe XP & Wyzwanie Dnia',
        subtitle: 'Ranking kursantów oraz codzienne zadania algorytmiczne JS',
        category: 'Narzędzie',
        tab: 'leaderboard',
      },
      {
        id: 'tool-flashcards',
        title: 'Fiszki SM-2 & Ściągi Programistyczne',
        subtitle: 'Powtórki pytań rekrutacyjnych i gotowe snippety kodu',
        category: 'Narzędzie',
        tab: 'flashcards',
      },
      {
        id: 'tool-career',
        title: 'Kreator CV / Portfolio GitHub & Backup JSON',
        subtitle: 'Generator CV Junior Full Stack Developera oraz eksport postępów',
        category: 'Narzędzie',
        tab: 'career',
      },
      {
        id: 'tool-terminal',
        title: 'Terminal Bash & Git',
        subtitle: 'Interaktywna konsola poleceń Linux oraz systemu kontroli wersji Git',
        category: 'Narzędzie',
        tab: 'terminal',
      },
      {
        id: 'tool-sql',
        title: 'Studio Bazy SQL',
        subtitle: 'Wykonywanie zapytań SELECT, JOIN, GROUP BY na żywej bazie',
        category: 'Narzędzie',
        tab: 'sql_studio',
      },
    ];

    const lessonItems: PaletteItem[] = allLessons.map((l, idx) => ({
      id: `lesson-${l.id}-${idx}`,
      title: l.title,
      subtitle: `${l.moduleTitle} · +${l.xpReward} XP`,
      category: 'Lekcja',
      tab: 'lesson',
      lessonId: l.id,
    }));

    const projectItems: PaletteItem[] = PROJECTS_DATA.map((p, idx) => ({
      id: `proj-${p.id}-${idx}`,
      title: p.title,
      subtitle: `Projekt #${p.number} · ${p.difficulty} · +${p.xpReward} XP`,
      category: 'Projekt',
      tab: 'projects',
      projectId: p.id,
    }));

    return [...tools, ...lessonItems, ...projectItems];
  }, [allLessons]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems.slice(0, 12);
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
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
      aria-label="Globalna wyszukiwarka i paleta poleceń"
    >
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3.5">
          <Search className="h-4 w-4 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            aria-label="Wpisz szukaną frazę lub polecenie"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj lekcji, symulatora (REST API, Event Loop, SQL), projektu..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij wyszukiwarkę"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/50">
          {filteredItems.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400">
              Brak wyników dla zapytania „{query}”.
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
                    <span className="text-[11px] text-slate-400">· {item.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
              </button>
            ))
          )}
        </div>

        <div className="border-t border-slate-800 bg-slate-950 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Wskazówka: Naciśnij Ctrl+K (lub Cmd+K), aby otworzyć z dowolnego widoku</span>
          <span>ESC aby zamknąć</span>
        </div>
      </div>
    </div>
  );
};
