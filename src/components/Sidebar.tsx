import React from 'react';
import { useApp } from '../context/AppContext';
import { soundManager } from '../utils/audioFx';
import { GoogleAdSenseBanner } from './GoogleAdSenseBanner';
import { 
  LayoutDashboard, 
  Layers, 
  Terminal, 
  FolderGit2, 
  RotateCcw, 
  Award, 
  ShieldCheck, 
  Lock,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Database,
  Briefcase,
  TerminalSquare,
  Send,
  Cpu,
  Trophy,
  Brain,
  FileText
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, isAuthenticated, weakAreas, allLessons, allModules, allProjects, language } = useApp();
  const isEn = language === 'en';

  const primaryItems: SidebarNavItem[] = isEn
    ? [
        { id: 'landing', label: 'Home Page (Landing)', icon: Sparkles },
        { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
        { id: 'modules', label: `Course Path (${allModules.length})`, icon: Layers },
        { id: 'projects', label: `Hands-on Projects (${allProjects.length})`, icon: FolderGit2 },
        { id: 'leaderboard', label: 'XP Leagues & Daily Challenge', icon: Trophy },
        { id: 'certificate', label: 'Completion Certificate', icon: Award },
      ]
    : [
        { id: 'landing', label: 'Strona Główna (Landing)', icon: Sparkles },
        { id: 'dashboard', label: 'Pulpit Kursanta', icon: LayoutDashboard },
        { id: 'modules', label: `Ścieżka Kursu (${allModules.length})`, icon: Layers },
        { id: 'projects', label: `Projekty Praktyczne (${allProjects.length})`, icon: FolderGit2 },
        { id: 'leaderboard', label: 'Ligi XP & Wyzwanie Dnia', icon: Trophy },
        { id: 'certificate', label: 'Certyfikat Ukończenia', icon: Award },
      ];

  const toolsItems: SidebarNavItem[] = isEn
    ? [
        { id: 'api_studio', label: 'REST API Studio', icon: Send },
        { id: 'event_loop', label: 'Event Loop Visualizer', icon: Cpu },
        { id: 'terminal', label: 'Bash / Git Terminal', icon: TerminalSquare },
        { id: 'sql_studio', label: 'SQL Database Studio', icon: Database },
        { id: 'interview', label: 'Live Coding (Mock Exam)', icon: Briefcase },
        { id: 'editor', label: 'Code Sandbox', icon: Terminal },
      ]
    : [
        { id: 'api_studio', label: 'Studio REST API', icon: Send },
        { id: 'event_loop', label: 'Wizualizator Event Loop', icon: Cpu },
        { id: 'terminal', label: 'Terminal Bash / Git', icon: TerminalSquare },
        { id: 'sql_studio', label: 'Studio Bazy SQL', icon: Database },
        { id: 'interview', label: 'Live Coding (Egzamin)', icon: Briefcase },
        { id: 'editor', label: 'Piaskownica Kodu', icon: Terminal },
      ];

  const extraItems: SidebarNavItem[] = isEn
    ? [
        { id: 'flashcards', label: 'SM-2 Flashcards & Cheatsheets', icon: Brain },
        { id: 'career', label: 'CV Builder & Backup', icon: FileText },
        {
          id: 'reviews',
          label: 'Review Center',
          icon: RotateCcw,
          count: weakAreas.length > 0 ? weakAreas.length : undefined,
        },
      ]
    : [
        { id: 'flashcards', label: 'Fiszki SM-2 & Ściągi', icon: Brain },
        { id: 'career', label: 'Kreator CV & Backup', icon: FileText },
        {
          id: 'reviews',
          label: 'Centrum Powtórek',
          icon: RotateCcw,
          count: weakAreas.length > 0 ? weakAreas.length : undefined,
        },
      ];

  const safeCompletedLessonsCount = Array.isArray(currentUser.completedLessons)
    ? currentUser.completedLessons.length
    : 0;
  const safeWeeklyGoalMinutes =
    typeof currentUser.weeklyGoalMinutes === 'number' &&
    Number.isFinite(currentUser.weeklyGoalMinutes) &&
    currentUser.weeklyGoalMinutes > 0
      ? currentUser.weeklyGoalMinutes
      : 180;
  const safeWeeklySpentMinutes =
    typeof currentUser.weeklySpentMinutes === 'number' &&
    Number.isFinite(currentUser.weeklySpentMinutes) &&
    currentUser.weeklySpentMinutes >= 0
      ? currentUser.weeklySpentMinutes
      : 0;
  const weeklyPercent = Math.min(100, Math.round((safeWeeklySpentMinutes / safeWeeklyGoalMinutes) * 100));

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
    <aside className="hidden lg:flex w-60 xl:w-64 flex-col border-r border-slate-800 bg-slate-950/60 p-4 shrink-0 print:hidden">
      <div className="space-y-2">
        {renderNavGroup(isEn ? 'Learning Path' : 'Ścieżka Nauki', primaryItems)}
        {renderNavGroup(isEn ? 'Workshop & Simulators' : 'Warsztat & Symulatory', toolsItems)}
        {renderNavGroup(isEn ? 'Resources' : 'Zasoby', extraItems)}

        <div className="pt-3">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {isEn ? 'Administration' : 'Administracja'}
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'admin'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : isAuthenticated && currentUser.role === 'admin'
                ? 'text-rose-400 hover:bg-rose-950/30 border border-rose-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800/80'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isAuthenticated && currentUser.role === 'admin' ? (
                <ShieldCheck className="h-4 w-4 text-rose-400" />
              ) : (
                <Lock className="h-4 w-4 text-amber-400" />
              )}
              <span>{isEn ? 'Admin Panel' : 'Panel Administratora'}</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </button>

          <div className="mt-2.5">
            <PWAInstallButton variant="full" className="w-full justify-center py-2" />
          </div>
        </div>
      </div>

      {/* Current Curriculum Progress Quick Glance */}
      <div className="mt-6 rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
            {isEn ? 'Course Progress' : 'Postęp Kursu'}
          </span>
          <span className="text-[11px] font-semibold text-slate-300">
            {isEn
              ? `${allModules.length} Modules (${allLessons.length} lessons)`
              : `${allModules.length} Modułów (${allLessons.length} lekcji)`}
          </span>
        </div>
        <p className="text-xs font-semibold text-white truncate">
          {isEn ? 'Full Stack Path' : 'Ścieżka Full Stack'}
        </p>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>{isEn ? 'Completed' : 'Ukończono'}</span>
          <span className="font-mono text-indigo-300 font-bold">
            {safeCompletedLessonsCount} / {allLessons.length} {isEn ? 'lessons' : 'lekcji'}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.round((safeCompletedLessonsCount / (allLessons.length || 96)) * 100))}%` }}
          />
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('modules')}
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-indigo-600/40 hover:bg-indigo-600 text-white text-[11px] font-semibold transition-colors"
        >
          <span>{isEn ? 'Continue learning' : 'Kontynuuj naukę'}</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      {/* Weekly Goal Progress Widget */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>{isEn ? 'Weekly goal' : 'Cel tygodniowy'}</span>
          </div>
          <span className="font-mono text-[11px] font-semibold text-slate-400">
            {safeWeeklySpentMinutes} / {safeWeeklyGoalMinutes} min
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div 
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${weeklyPercent}%` }}
          />
        </div>
        <p className="mt-1.5 text-[10px] text-slate-400 text-center">
          {weeklyPercent >= 100
            ? isEn
              ? 'Goal achieved! Amazing work.'
              : 'Cel zrealizowany! Wspaniała robota.'
            : isEn
            ? `${Math.max(0, safeWeeklyGoalMinutes - safeWeeklySpentMinutes)} min left to reach your goal`
            : `Pozostało ${Math.max(0, safeWeeklyGoalMinutes - safeWeeklySpentMinutes)} min do osiągnięcia celu`}
        </p>
      </div>

      {/* Google AdSense Sidebar Unit (Shown only to authenticated Free-tier students) */}
      <div className="mt-4">
        <GoogleAdSenseBanner placement="sidebar" variant="sidebar" />
      </div>
    </aside>
  );
};
