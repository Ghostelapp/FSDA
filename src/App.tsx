import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { AuthModal } from './components/AuthModal';
import { LivesModal } from './components/LivesModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { LandingPageView } from './components/LandingPageView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { PublicLessonView } from './components/PublicLessonView';
import { PublicInfoPageView } from './components/PublicInfoPageView';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { detectEmbeddedWebViewRuntime, isPublicTab } from './utils/publicRoutes';
import { AuthModalMode } from './utils/authValidation';
import { Sparkles, Trophy, X, Code2, AlertTriangle } from 'lucide-react';

const DashboardView = React.lazy(() => import('./components/DashboardView').then(({ DashboardView }) => ({ default: DashboardView })));
const ModulesView = React.lazy(() => import('./components/ModulesView').then(({ ModulesView }) => ({ default: ModulesView })));
const LessonDetailView = React.lazy(() => import('./components/LessonDetailView').then(({ LessonDetailView }) => ({ default: LessonDetailView })));
const SandboxView = React.lazy(() => import('./components/SandboxView').then(({ SandboxView }) => ({ default: SandboxView })));
const ProjectsView = React.lazy(() => import('./components/ProjectsView').then(({ ProjectsView }) => ({ default: ProjectsView })));
const CertificateView = React.lazy(() => import('./components/CertificateView').then(({ CertificateView }) => ({ default: CertificateView })));
const ReviewCenterView = React.lazy(() => import('./components/ReviewCenterView').then(({ ReviewCenterView }) => ({ default: ReviewCenterView })));
const AdminPanelView = React.lazy(() => import('./components/AdminPanelView').then(({ AdminPanelView }) => ({ default: AdminPanelView })));
const PromoAssetsPanel = React.lazy(() => import('./components/PromoAssetsPanel').then(({ PromoAssetsPanel }) => ({ default: PromoAssetsPanel })));
const DeploymentGuideView = React.lazy(() => import('./components/DeploymentGuideView').then(({ DeploymentGuideView }) => ({ default: DeploymentGuideView })));
const TerminalSimulator = React.lazy(() => import('./components/TerminalSimulator').then(({ TerminalSimulator }) => ({ default: TerminalSimulator })));
const SqlStudioView = React.lazy(() => import('./components/SqlStudioView').then(({ SqlStudioView }) => ({ default: SqlStudioView })));
const MockInterviewView = React.lazy(() => import('./components/MockInterviewView').then(({ MockInterviewView }) => ({ default: MockInterviewView })));
const ApiStudioView = React.lazy(() => import('./components/ApiStudioView').then(({ ApiStudioView }) => ({ default: ApiStudioView })));
const EventLoopView = React.lazy(() => import('./components/EventLoopView').then(({ EventLoopView }) => ({ default: EventLoopView })));
const LeaderboardChallengeView = React.lazy(() => import('./components/LeaderboardChallengeView').then(({ LeaderboardChallengeView }) => ({ default: LeaderboardChallengeView })));
const FlashcardsCheatSheetView = React.lazy(() => import('./components/FlashcardsCheatSheetView').then(({ FlashcardsCheatSheetView }) => ({ default: FlashcardsCheatSheetView })));
const CareerBackupView = React.lazy(() => import('./components/CareerBackupView').then(({ CareerBackupView }) => ({ default: CareerBackupView })));

const MainContent: React.FC = () => {
  const { activeTab, selectedLessonId, allLessons, toast, dismissToast, setActiveTab, isAuthenticated, logout, language } = useApp();
  const isEn = language === 'en';
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<AuthModalMode | undefined>(undefined);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const openAuthModal = React.useCallback((preferredMode?: AuthModalMode) => {
    setAuthModalInitialMode(preferredMode);
    setIsAuthModalOpen(true);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    const handleOpenAuth = (ev: Event) => {
      const detail = (ev as CustomEvent<{ mode?: AuthModalMode }>).detail;
      openAuthModal(detail?.mode);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('akademia:open-auth-modal', handleOpenAuth);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('akademia:open-auth-modal', handleOpenAuth);
    };
  }, [openAuthModal]);

  // Retrieve current active lesson (defaults to Module 1, Lesson 1)
  const currentLesson = allLessons.find((l) => l.id === selectedLessonId) || allLessons[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white print:bg-white print:text-slate-900">
      
      {/* Top Navbar (hidden on public portal pages, which render their own header) */}
      {!isPublicTab(activeTab) && (
        <div className="print:hidden">
          <Navbar
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />
        </div>
      )}

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-[calc(4.5rem+env(safe-area-inset-top,0px))] left-3 right-3 sm:left-auto sm:right-6 z-50 sm:max-w-md animate-in slide-in-from-top-3 duration-300 print:hidden">
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
      {typeof window !== 'undefined' &&
      (/^\/promo\/?$/i.test(window.location.pathname) || new URLSearchParams(window.location.search).get('promo') === '1') ? (
        <main className="flex-1 min-w-0 max-w-6xl w-full mx-auto px-4 py-8">
          <React.Suspense fallback={<div className="py-12 text-center text-sm text-slate-400">Ładowanie...</div>}>
            <PromoAssetsPanel
              onClose={() => {
                if (!detectEmbeddedWebViewRuntime()) {
                  window.history.pushState(null, '', '/');
                }
                setActiveTab('landing');
              }}
            />
          </React.Suspense>
        </main>
      ) : isPublicTab(activeTab) ? (
        <main className="flex-1 min-w-0 overflow-x-clip print:pb-0">
          {activeTab === 'landing' && (
            <LandingPageView onOpenAuthModal={() => setIsAuthModalOpen(true)} />
          )}
          {activeTab === 'knowledge_base' && (
            <KnowledgeBaseView onOpenAuthModal={() => setIsAuthModalOpen(true)} />
          )}
          {activeTab === 'public_lesson' && (
            <PublicLessonView
              lessonId={selectedLessonId}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
          )}
          {(activeTab === 'about' ||
            activeTab === 'contact' ||
            activeTab === 'terms' ||
            activeTab === 'privacy') && (
            <PublicInfoPageView
              page={activeTab}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
          )}
        </main>
      ) : (
        <div className="flex flex-1 items-stretch min-w-0">
          <Sidebar />

          <main className="flex-1 min-w-0 overflow-x-clip pb-16 print:pb-0">
            <React.Suspense
              fallback={(
                <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-400" role="status">
                  {isEn ? 'Loading view...' : 'Ładowanie widoku...'}
                </div>
              )}
            >
              {activeTab === 'admin' ? (
                <ProtectedRoute
                  requiredRole="admin"
                  allowGuests={false}
                  onOpenAuthModal={openAuthModal}
                >
                  <AdminPanelView onOpenAuthModal={() => openAuthModal()} />
                </ProtectedRoute>
              ) : (
                <ProtectedRoute
                  requiredRole="student"
                  allowGuests={false}
                  onOpenAuthModal={openAuthModal}
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
      <footer
        className={`border-t px-3 sm:px-4 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] sm:py-10 text-xs print:hidden ${
          isPublicTab(activeTab)
            ? 'border-slate-800/80 bg-[#05070D] text-slate-400'
            : 'border-slate-900 bg-slate-950 text-slate-400'
        }`}
      >
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Code2 className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-slate-100">
              Full Stack Developer Academy
            </span>
            <span className="text-slate-500">
              {isEn ? '© 2026. All rights reserved.' : '© 2026. Wszystkie prawa zastrzeżone.'}
            </span>
          </div>

          <div className={`flex flex-wrap items-center justify-center gap-5 text-xs font-medium ${activeTab === 'landing' ? 'md:pr-28' : ''}`}>
            <a
              href="/"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                setActiveTab('landing');
                const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
                window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
              }}
              className="hover:text-slate-100 transition-colors"
            >
              {isEn ? 'Home' : 'Strona Główna'}
            </a>
            <a
              href="/baza-wiedzy"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                setActiveTab('knowledge_base');
              }}
              className="hover:text-slate-100 transition-colors"
            >
              {isEn ? `Knowledge Base (${allLessons.length} lessons)` : `Baza Wiedzy (${allLessons.length} lekcji)`}
            </a>
            <a
              href="/o-nas"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                setActiveTab('about');
              }}
              className="hover:text-slate-100 transition-colors"
            >
              {isEn ? 'About' : 'O Akademii'}
            </a>
            <a
              href="/kontakt"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                setActiveTab('contact');
              }}
              className="hover:text-slate-100 transition-colors"
            >
              {isEn ? 'Contact' : 'Kontakt'}
            </a>
            <a
              href="/regulamin"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                setActiveTab('terms');
              }}
              className="hover:text-slate-100 transition-colors"
            >
              {isEn ? 'Terms' : 'Regulamin'}
            </a>
            <a
              href="/polityka-prywatnosci"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                setActiveTab('privacy');
              }}
              className="hover:text-slate-100 transition-colors"
            >
              {isEn ? 'Privacy Policy' : 'Polityka Prywatności'}
            </a>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-slate-100 transition-colors"
            >
              {isEn ? 'Student Dashboard' : 'Pulpit Kursanta'}
            </button>
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="hover:text-indigo-400 transition-colors"
            >
              {isAuthenticated ? (isEn ? 'Account / Profile' : 'Konto / Zmień Profil') : (isEn ? 'Sign In' : 'Zaloguj się')}
            </button>
            {isAuthenticated && (
              <button
                type="button"
                onClick={logout}
                className="text-rose-500 hover:text-rose-400 transition-colors font-medium"
              >
                {isEn ? 'Sign Out' : 'Wyloguj się'}
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Cookie / GDPR Consent Banner */}
      <CookieConsentBanner />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalInitialMode}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthModalInitialMode(undefined);
        }}
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

interface AppErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  AppErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Nieoczekiwany błąd renderowania widoku.',
    };
  }

  componentDidCatch(error: Error) {
    console.error('AppErrorBoundary caught render error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center space-y-4 shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h1 className="text-lg font-extrabold text-white">
              Wystąpił problem z wyświetleniem widoku
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Aplikacja wykryła nieoczekiwany błąd interfejsu i zatrzymała renderowanie, aby uniknąć zawieszenia.
            </p>
            {this.state.errorMessage && (
              <p className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-[11px] font-mono text-rose-300 break-words">
                {this.state.errorMessage}
              </p>
            )}
            <button
              type="button"
              onClick={() => window.location.assign('/app')}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white transition-colors"
            >
              Odśwież aplikację
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </AppErrorBoundary>
  );
}
