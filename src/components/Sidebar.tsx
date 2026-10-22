import React from 'react';
import { useApp } from '../context/AppContext';
import { soundManager } from '../utils/audioFx';
import { 
  LayoutDashboard, 
  Layers, 
  Terminal, 
  FolderGit2, 
  RotateCcw, 
  Award, 
  ShieldCheck, 
  BookMarked,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Database,
  Briefcase,
  TerminalSquare
} from 'lucide-react';

interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, weakAreas } = useApp();

  const primaryItems: SidebarNavItem[] = [
    { id: 'dashboard', label: 'Pulpit Kursanta', icon: LayoutDashboard },
    { id: 'modules', label: 'Ścieżka Kursu (15)', icon: Layers },
    { id: 'projects', label: 'Projekty Praktyczne (12)', icon: FolderGit2, badge: 'Portfolio' },
    { id: 'certificate', label: 'Certyfikat Ukończenia', icon: Award },
  ];

  const toolsItems: SidebarNavItem[] = [
    { id: 'terminal', label: 'Terminal Bash / Git', icon: TerminalSquare, badge: '+XP' },
    { id: 'sql_studio', label: 'Studio Bazy SQL', icon: Database },
    { id: 'interview', label: 'Live Coding (Egzamin)', icon: Briefcase, badge: 'Mock' },
    { id: 'editor', label: 'Piaskownica Kodu', icon: Terminal },
  ];

  const extraItems: SidebarNavItem[] = [
    { 
      id: 'reviews', 
      label: 'Centrum Powtórek', 
      icon: RotateCcw, 
      count: weakAreas.length > 0 ? weakAreas.length : undefined 
    },
    { id: 'deployment', label: 'Przewodnik Wdrożenia', icon: BookMarked },
  ];

  const weeklyPercent = Math.min(100, Math.round((currentUser.weeklySpentMinutes / (currentUser.weeklyGoalMinutes || 180)) * 100));

  const renderNavGroup = (title: string, items: SidebarNavItem[]) => (
    <div className="space-y-1 pt-2">
      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {title}
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id || (item.id === 'modules' && activeTab === 'lesson');
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab(item.id as any);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'}`} />
              <span className="truncate">{item.label}</span>
            </div>
            {item.badge && (
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              }`}>
                {item.badge}
              </span>
            )}
            {item.count !== undefined && (
              <span className="bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0">
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800 bg-slate-950/60 p-4 shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="space-y-2">
        {renderNavGroup('Ścieżka Nauki', primaryItems)}
        {renderNavGroup('Warsztat & Symulatory', toolsItems)}
        {renderNavGroup('Zasoby', extraItems)}

        {currentUser.role === 'admin' && (
          <div className="pt-3">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Instruktor
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'admin'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-rose-400 hover:bg-rose-950/30 border border-rose-900/30'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4" />
                <span>Panel Administratora</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            </button>
          </div>
        )}
      </div>

      {/* Current HTML Module Quick Glance */}
      <div className="mt-6 rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Aktualny Moduł</span>
          <span className="text-[11px] font-semibold text-slate-300">Moduł 2</span>
        </div>
        <p className="text-xs font-semibold text-white truncate">HTML — Semantyka & Formularze</p>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Ukończono</span>
          <span className="font-mono text-indigo-300 font-bold">
            {currentUser.completedLessons.filter((id) => id.startsWith('html-')).length} / 5 lekcji
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${(currentUser.completedLessons.filter((id) => id.startsWith('html-')).length / 5) * 100}%` }}
          />
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('lesson', 'html-1')}
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-indigo-600/40 hover:bg-indigo-600 text-white text-[11px] font-semibold transition-colors"
        >
          <span>Kontynuuj naukę</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      {/* Weekly Goal Progress Widget */}
      <div className="mt-auto pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>Cel tygodniowy</span>
          </div>
          <span className="font-mono text-[11px] font-semibold text-slate-400">
            {currentUser.weeklySpentMinutes} / {currentUser.weeklyGoalMinutes} min
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div 
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${weeklyPercent}%` }}
          />
        </div>
        <p className="mt-1.5 text-[10px] text-slate-400 text-center">
          {weeklyPercent >= 100 ? 'Cel zrealizowany! Wspaniała robota.' : `Pozostało ${Math.max(0, currentUser.weeklyGoalMinutes - currentUser.weeklySpentMinutes)} min do osiągnięcia celu`}
        </p>
      </div>
    </aside>
  );
};
