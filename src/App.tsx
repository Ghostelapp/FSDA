import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { AuthModal } from './components/AuthModal';
import { LivesModal } from './components/LivesModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { Sparkles, Trophy, X, Code2, AlertTriangle } from 'lucide-react';

const DashboardView = React.lazy(() => import('./components/DashboardView').then(({ DashboardView }) => ({ default: DashboardView })));
const ModulesView = React.lazy(() => import('./components/ModulesView').then(({ ModulesView }) => ({ default: ModulesView })));
const LessonDetailView = React.lazy(() => import('./components/LessonDetailView').then(({ LessonDetailView }) => ({ default: LessonDetailView })));
const SandboxView = React.lazy(() => import('./components/SandboxView').then(({ SandboxView }) => ({ default: SandboxView })));
const ProjectsView = React.lazy(() => import('./components/ProjectsView').then(({ ProjectsView }) => ({ default: ProjectsView })));
const CertificateView = React.lazy(() => import('./components/CertificateView').then(({ CertificateView }) => ({ default: CertificateView })));
const ReviewCenterView = React.lazy(() => import('./components/ReviewCenterView').then(({ ReviewCenterView }) => ({ default: ReviewCenterView })));
const AdminPanelView = React.lazy(() => import('./components/AdminPanelView').then(({ AdminPanelView }) => ({ default: AdminPanelView })));
const DeploymentGuideView = React.lazy(() => import('./components/DeploymentGuideView').then(({ DeploymentGuideView }) => ({ default: DeploymentGuideView })));
const TerminalSimulator = React.lazy(() => import('./components/TerminalSimulator').then(({ TerminalSimulator }) => ({ default: TerminalSimulator })));
const SqlStudioView = React.lazy(() => import('./components/SqlStudioView').then(({ SqlStudioView }) => ({ default: SqlStudioView })));
const MockInterviewView = React.lazy(() => import('./components/MockInterviewView').then(({ MockInterviewView }) => ({ default: MockInterviewView })));
const ApiStudioView = React.lazy(() => import('./components/ApiStudioView').then(({ ApiStudioView }) => ({ default: ApiStudioView })));
const EventLoopView = React.lazy(() => import('./components/EventLoopView').then(({ EventLoopView }) => ({ default: EventLoopView })));
const LeaderboardChallengeView = React.lazy(() => import('./components/LeaderboardChallengeView').then(({ LeaderboardChallengeView }) => ({ default: LeaderboardChallengeView })));
const FlashcardsCheatSheetView = React.lazy(() => import('./components/FlashcardsCheatSheetView').then(({ FlashcardsCheatSheetView }) => ({ default: FlashcardsCheatSheetView })));
const CareerBackupView = React.lazy(() => import('./components/CareerBackupView').then(({ CareerBackupView }) => ({ default: CareerBackupView })));
const LandingPageView = React.lazy(() => import('./components/LandingPageView').then(({ LandingPageView }) => ({ default: LandingPageView })));

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
    const handleOpenAuth = () => setIsAuthModalOpen(true);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('akademia:open-auth-modal', handleOpenAuth);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('akademia:open-auth-modal', handleOpenAuth);
    };
  }, []);

  // Retrieve current active lesson (defaults to Module 1, Lesson 1)
  const currentLesson = allLessons.find((l) => l.id === selectedLessonId) || allLessons[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white print:bg-white print:text-slate-900">
      
      {/* Top Navbar (hidden on Landing Page, which renders its own 3-zone header) */}
      {activeTab !== 'landing' && (
        <div className="print:hidden">
          <Navbar
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />
        </div>
      )}

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300 print:hidden">
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

      {/* App Body */}
      {activeTab === 'landing' ? (
        <main className="flex-1 min-w-0 overflow-x-hidden print:pb-0">
          <React.Suspense
            fallback={(
              <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-400" role="status">
                Ładowanie strony głównej...
              </div>
            )}
          >
            <LandingPageView onOpenAuthModal={() => setIsAuthModalOpen(true)} />
          </React.Suspense>
        </main>
      ) : (
        <div className="flex flex-1 items-stretch min-w-0">
          <Sidebar />

          <main className="flex-1 min-w-0 overflow-x-hidden pb-16 print:pb-0">
            <React.Suspense
              fallback={(
                <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-400" role="status">
                  Ładowanie widoku...
                </div>
              )}
            >
              {activeTab === 'admin' ? (
                <ProtectedRoute
                  requiredRole="admin"
                  allowGuests={false}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                >
                  <AdminPanelView onOpenAuthModal={() => setIsAuthModalOpen(true)} />
                </ProtectedRoute>
              ) : (
                <ProtectedRoute
                  requiredRole="student"
                  allowGuests={false}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                >
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
                  {activeTab === 'deployment' && <DeploymentGuideView />}
                </ProtectedRoute>
              )}
            </React.Suspense>
          </main>
        </div>
      )}

      {/* Global Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 py-8 text-xs text-slate-400 print:hidden">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Code2 className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-white">Full Stack Developer Academy</span>
            <span className="text-slate-500">© 2026. Wszystkie prawa zastrzeżone.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => setActiveTab('landing')}
              className="hover:text-white transition-colors"
            >
              Strona Główna
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-white transition-colors"
            >
              Pulpit Kursanta
            </button>
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
              onClick={() => setActiveTab('admin')}
              className="hover:text-rose-400 transition-colors"
            >
              Panel Administratora
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
