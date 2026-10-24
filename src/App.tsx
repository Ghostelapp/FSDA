import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ModulesView } from './components/ModulesView';
import { LessonDetailView } from './components/LessonDetailView';
import { SandboxView } from './components/SandboxView';
import { ProjectsView } from './components/ProjectsView';
import { CertificateView } from './components/CertificateView';
import { ReviewCenterView } from './components/ReviewCenterView';
import { AdminPanelView } from './components/AdminPanelView';
import { DeploymentGuideView } from './components/DeploymentGuideView';
import { TerminalSimulator } from './components/TerminalSimulator';
import { SqlStudioView } from './components/SqlStudioView';
import { MockInterviewView } from './components/MockInterviewView';
import { ApiStudioView } from './components/ApiStudioView';
import { EventLoopView } from './components/EventLoopView';
import { LeaderboardChallengeView } from './components/LeaderboardChallengeView';
import { FlashcardsCheatSheetView } from './components/FlashcardsCheatSheetView';
import { CareerBackupView } from './components/CareerBackupView';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { AuthModal } from './components/AuthModal';
import { LivesModal } from './components/LivesModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { Sparkles, Trophy, X, Code2, AlertTriangle } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, selectedLessonId, allLessons, toast, dismissToast, setActiveTab, isAuthenticated, logout } = useApp();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Retrieve current active lesson
  const currentLesson = allLessons.find((l) => l.id === selectedLessonId) || allLessons[1]; // defaults to HTML lesson 1

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-md ${
            toast.type === 'badge'
              ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
              : toast.type === 'danger'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : 'bg-indigo-950/90 border-indigo-500/50 text-indigo-200'
          }`}>
            {toast.type === 'badge' ? (
              <Trophy className="h-5 w-5 text-amber-400 shrink-0 animate-bounce" />
            ) : toast.type === 'danger' ? (
              <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
            ) : (
              <Sparkles className="h-5 w-5 text-indigo-400 shrink-0" />
            )}
            <span className="text-xs font-semibold">{toast.message}</span>
            <button
              type="button"
              onClick={dismissToast}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* App Body with Sidebar */}
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 overflow-x-hidden pb-16">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'modules' && <ModulesView />}
          {activeTab === 'lesson' && <LessonDetailView lesson={currentLesson} />}
          {activeTab === 'editor' && <SandboxView />}
          {activeTab === 'projects' && <ProjectsView />}
          {activeTab === 'reviews' && <ReviewCenterView />}
          {activeTab === 'certificate' && <CertificateView />}
          {activeTab === 'terminal' && <TerminalSimulator />}
          {activeTab === 'sql_studio' && <SqlStudioView />}
          {activeTab === 'interview' && <MockInterviewView />}
          {activeTab === 'api_studio' && <ApiStudioView />}
          {activeTab === 'event_loop' && <EventLoopView />}
          {activeTab === 'leaderboard' && <LeaderboardChallengeView />}
          {activeTab === 'flashcards' && <FlashcardsCheatSheetView />}
          {activeTab === 'career' && <CareerBackupView />}
          {activeTab === 'admin' && <AdminPanelView />}
          {activeTab === 'deployment' && <DeploymentGuideView />}
        </main>
      </div>

      {/* Global Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 py-8 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Code2 className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-white">Full Stack Developer Academy</span>
            <span className="text-slate-500">© 2026. Wszystkie prawa zastrzeżone.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => setActiveTab('deployment')}
              className="hover:text-white transition-colors"
            >
              Przewodnik Wdrożenia
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('certificate')}
              className="hover:text-white transition-colors"
            >
              Weryfikacja Certyfikatów
            </button>
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="hover:text-indigo-400 transition-colors"
            >
              {isAuthenticated ? 'Konto / Zmień Profil' : 'Zaloguj się / Rejestracja'}
            </button>
            {isAuthenticated && (
              <button
                type="button"
                onClick={logout}
                className="text-rose-400 hover:text-rose-300 transition-colors font-medium"
              >
                Wyloguj się
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Gamification Lives & Energy Modal */}
      <LivesModal />

      {/* Full Stack PRO Subscription Modal */}
      <SubscriptionModal />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
