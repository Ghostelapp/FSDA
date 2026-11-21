import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateLevel } from '../utils/gamification';
import {
  Code2,
  Flame,
  Sparkles,
  UserCheck,
  Shield,
  Menu,
  X,
  ChevronDown,
  BookOpen,
  Terminal,
  Trophy,
  Award,
  Heart,
  Crown,
  Volume2,
  VolumeX,
  Database,
  TerminalSquare,
  Search,
  LogOut,
  LogIn,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { BrandLogo } from './BrandLogo';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';

interface NavbarProps {
  onOpenAuthModal: () => void;
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuthModal, onOpenCommandPalette }) => {
  const {
    currentUser,
    isAuthenticated,
    logout,
    setActiveTab,
    livesInfo,
    setIsLivesModalOpen,
    setIsSubModalOpen,
    isSoundMuted,
    toggleSound,
    language,
    allModules,
    allProjects,
  } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isEn = language === 'en';
  const levelInfo = calculateLevel(currentUser.xp ?? 0, language);
  const isPro = Boolean(currentUser.isPro);
  const currentLives = isPro ? 5 : (livesInfo.currentLives ?? currentUser.lives ?? 5);
  const shortDisplayName = (currentUser.name || (isEn ? 'Student' : 'Kursant')).replace(/\s*\(.*?\)\s*/g, '').trim();

  return (
    <header className="relative z-40 w-full border-b border-slate-800 bg-slate-950/95 transition-colors pt-[env(safe-area-inset-top,0px)]">
      <div className="flex h-14 sm:h-16 w-full items-center justify-between gap-1 sm:gap-4 px-2.5 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-0.5 sm:p-1"
          >
            <BrandLogo compact />
          </button>
        </div>

        {/* Center Quick Search & Quick Shortcuts */}
        <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg items-center justify-center gap-2 min-w-0">
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label={isEn ? 'Search Academy (Ctrl+K)' : 'Szukaj w akademii (Ctrl+K)'}
              className="w-full flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/90 hover:bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition-colors min-w-0"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span className="truncate text-slate-400">
                  {isEn ? 'Search lessons, tags, or topics...' : 'Szukaj lekcji, znacznika lub tematu...'}
                </span>
              </span>
              <kbd className="hidden sm:inline-block rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-700 shrink-0">
                Ctrl+K
              </kbd>
            </button>
          )}
        </div>

        {/* User stats & Profile widget */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label={isEn ? 'Search Academy (Ctrl+K)' : 'Szukaj w akademii (Ctrl+K)'}
              className="md:hidden flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 p-1.5 sm:p-2 text-xs text-slate-300 transition-colors shrink-0"
            >
              <Search className="h-4 w-4 text-indigo-400" />
            </button>
          )}

          {/* Google Play Store / APK Release Center Button (visible on wide screens; also in left Sidebar) */}
          <PWAInstallButton className="hidden 2xl:inline-flex" />

          {/* Hearts / Lives indicator */}
          <button
            type="button"
            onClick={() => setIsLivesModalOpen(true)}
            title={
              isPro
                ? isEn
                  ? 'Unlimited lives (PRO)'
                  : 'Nielimitowane życia (PRO)'
                : isEn
                ? `You have ${currentLives}/5 hearts. Click to check refill or restore hearts.`
                : `Masz ${currentLives}/5 serc. Kliknij, aby sprawdzić odnowienie lub uzupełnić serca.`
            }
            className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              isPro
                ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:border-amber-400'
                : currentLives === 0
                ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300'
                : 'bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:border-rose-500/40'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isPro ? 'fill-amber-400 text-amber-400' : 'fill-rose-500 text-rose-500'}`} />
            {isPro ? (
              <span className="font-bold tracking-tight">PRO</span>
            ) : (
              <span className="font-bold">{currentLives}/5</span>
            )}
          </button>

          {/* Streak indicator */}
          <div
            title={
              isEn
                ? `Your learning streak: ${currentUser.streakDays ?? 0} days in a row!`
                : `Twoja seria nauki: ${currentUser.streakDays ?? 0} dni z rzędu!`
            }
            className="hidden sm:flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-1 text-xs font-semibold text-amber-400 whitespace-nowrap shrink-0"
          >
            <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{currentUser.streakDays ?? 0}d</span>
          </div>

          {/* XP & Level Indicator */}
          <div
            title={
              isEn
                ? `Level ${levelInfo.level}: ${levelInfo.title} (${currentUser.xp ?? 0} XP)`
                : `Poziom ${levelInfo.level}: ${levelInfo.title} (${currentUser.xp ?? 0} XP)`
            }
            className="hidden sm:flex items-center gap-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs whitespace-nowrap shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-bold text-indigo-300 tabular-nums">{currentUser.xp ?? 0} XP</span>
          </div>

          {/* Sound FX Toggle (desktop / tablet) */}
          <button
            type="button"
            onClick={toggleSound}
            title={
              isSoundMuted
                ? isEn
                  ? 'Enable sound effects (SFX)'
                  : 'Włącz efekty dźwiękowe (SFX)'
                : isEn
                ? 'Mute sound effects (SFX)'
                : 'Wycisz efekty dźwiękowe (SFX)'
            }
            aria-label={
              isSoundMuted
                ? isEn
                  ? 'Unmute sounds'
                  : 'Włącz dźwięki'
                : isEn
                ? 'Mute sounds'
                : 'Wycisz dźwięki'
            }
            className="hidden sm:inline-flex rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors shrink-0"
          >
            {isSoundMuted ? <VolumeX className="h-4 w-4 text-slate-500" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
          </button>

          {/* Language Switcher (PL / EN) */}
          <LanguageToggle variant="compact" className="hidden sm:inline-flex" />

          {/* Global 3-Mode Theme Toggle (Dark / Light / System) */}
          <ThemeToggle variant="compact" className="hidden sm:inline-flex" />

          {/* Quick Login Button when logged out */}
          {!isAuthenticated && (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-2 sm:px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition-colors shrink-0 whitespace-nowrap"
            >
              <LogIn className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">{isEn ? 'Sign in' : 'Zaloguj się'}</span>
              <span className="sm:hidden">{isEn ? 'Sign in' : 'Zaloguj'}</span>
            </button>
          )}

          {/* Profile Switcher Dropdown */}
          <div className={`relative shrink-0 ${!isAuthenticated ? 'hidden sm:block' : ''}`}>
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-slate-700 bg-slate-900 px-1.5 sm:px-2 py-1 sm:py-1.5 text-left text-xs text-slate-200 hover:border-slate-600 transition-colors focus:outline-none"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="h-6 w-6 rounded-md object-cover ring-1 ring-indigo-500/50 shrink-0"
              />
              <span className="hidden md:inline font-medium max-w-[115px] xl:max-w-[140px] truncate">
                {shortDisplayName}
              </span>
              {!isAuthenticated ? (
                <span className="hidden xl:inline-block bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-amber-500/30">
                  {isEn ? 'Guest' : 'Gość'}
                </span>
              ) : currentUser.role === 'admin' ? (
                <span className="hidden xl:inline-block bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-rose-500/30">
                  Admin
                </span>
              ) : null}
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                        isAuthenticated ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {isAuthenticated ? (isEn ? 'Signed in' : 'Zalogowany') : (isEn ? 'Guest Mode' : 'Tryb Gościa')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  <p className="text-[10px] text-indigo-400 mt-1 font-mono">{levelInfo.title}</p>
                </div>

                <div className="pt-1 space-y-0.5">
                  <button
                    type="button"
                    onClick={onOpenAuthModal}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-indigo-300 hover:bg-slate-800 font-medium"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>
                      {isAuthenticated
                        ? isEn
                          ? 'Account & Profile Settings'
                          : 'Ustawienia Konta i Profilu'
                        : isEn
                        ? 'Sign In / Create Account'
                        : 'Zaloguj się / Załóż konto'}
                    </span>
                  </button>
                  {currentUser.role === 'admin' && isAuthenticated && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('admin')}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-300 hover:bg-slate-800 font-medium"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      <span>{isEn ? 'Course Admin Panel' : 'Panel Zarządzania Kursem'}</span>
                    </button>
                  )}
                  {isAuthenticated && (
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-950/40 font-semibold transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>{isEn ? 'Sign Out' : 'Wyloguj się z konta'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile / Tablet hamburger button (shown whenever left Sidebar is hidden: below lg) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-lg p-1.5 sm:p-2 text-slate-400 hover:bg-slate-800 hover:text-white shrink-0"
            aria-label={isEn ? 'Open navigation menu' : 'Otwórz menu nawigacji'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu (shown below lg) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-900 px-3 sm:px-4 py-2.5 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] space-y-2 max-h-[calc(100dvh-3.5rem-env(safe-area-inset-top,0px))] overflow-y-auto overscroll-contain">
          {/* Mobile Hearts, Streak & Plan Bar */}
          <div className="grid grid-cols-3 gap-1.5 pb-2 border-b border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsLivesModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl border text-[11px] font-bold transition-all whitespace-nowrap ${
                isPro
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 shrink-0 ${isPro ? 'fill-amber-400' : 'fill-rose-500'}`} />
              <span>{isPro ? '∞ PRO' : `${currentLives}/5`}</span>
            </button>

            <div className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold whitespace-nowrap">
              <Flame className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
              <span>{currentUser.streakDays ?? 0}d</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSubModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-bold whitespace-nowrap"
            >
              <Crown className={`h-3.5 w-3.5 shrink-0 ${isPro ? 'text-amber-400 fill-amber-400' : 'text-emerald-400'}`} />
              <span>{isPro ? 'PRO' : (isEn ? 'Free' : 'Darmowy')}</span>
            </button>
          </div>

          {/* Quick Sound FX, Language & 3-Mode Theme Toggle for Mobile */}
          <div className="space-y-1.5 py-1 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleSound}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold"
              >
                {isSoundMuted ? <VolumeX className="h-3.5 w-3.5 text-slate-500" /> : <Volume2 className="h-3.5 w-3.5 text-cyan-400" />}
                <span>
                  {isSoundMuted
                    ? isEn
                      ? 'Sound: Off'
                      : 'Dźwięk: Wył.'
                    : isEn
                    ? 'Sound: On'
                    : 'Dźwięk: Wł.'}
                </span>
              </button>
              <LanguageToggle variant="compact" />
            </div>

            <ThemeToggle variant="labeled" />
          </div>

          {/* Mobile Android / Play Store Install Action */}
          <div className="py-1 border-b border-slate-800">
            <PWAInstallButton variant="full" className="w-full justify-center py-2" />
          </div>

          {/* Primary Navigation */}
          <div className="pt-1 space-y-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <BookOpen className="h-4 w-4 text-indigo-400" />
              <span>{isEn ? 'Student Dashboard' : 'Pulpit Kursanta'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('modules');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <BookOpen className="h-4 w-4 text-cyan-400" />
              <span>{isEn ? `Course Modules (${allModules.length})` : `Moduły Kursu (${allModules.length})`}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('projects');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <Trophy className="h-4 w-4 text-emerald-400" />
              <span>{isEn ? `Hands-on Projects (${allProjects.length})` : `Projekty Praktyczne (${allProjects.length})`}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('certificate');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <Award className="h-4 w-4 text-yellow-400" />
              <span>{isEn ? 'Completion Certificate' : 'Certyfikat Ukończenia'}</span>
            </button>
          </div>

          {/* Interactive Tools Group */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isEn ? 'Workshop & Simulators' : 'Warsztat & Narzędzia'}
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab('terminal');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <TerminalSquare className="h-4 w-4 text-emerald-400" />
                <span>{isEn ? 'Bash & Git Terminal' : 'Terminal Bash & Git'}</span>
              </div>
              <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded font-bold">+XP</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('sql_studio');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <Database className="h-4 w-4 text-indigo-400" />
              <span>{isEn ? 'SQL Database Studio' : 'Studio Bazy SQL'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('interview');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <Award className="h-4 w-4 text-amber-400" />
                <span>{isEn ? 'Live Coding (Mock Exam)' : 'Live Coding (Egzamin)'}</span>
              </div>
              <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">Mock</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('editor');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <Terminal className="h-4 w-4 text-amber-400" />
              <span>{isEn ? 'Code Sandbox' : 'Piaskownica Kodu'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('reviews');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <Sparkles className="h-4 w-4 text-rose-400" />
              <span>{isEn ? 'Review Center' : 'Centrum Powtórek'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('deployment');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <Code2 className="h-4 w-4 text-blue-400" />
              <span>{isEn ? 'Deployment & DevOps Guide' : 'Przewodnik Wdrożenia & DevOps'}</span>
            </button>
            {currentUser.role === 'admin' && isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-rose-300 hover:bg-slate-800 font-semibold"
              >
                <Shield className="h-4 w-4" />
                <span>{isEn ? 'Admin Panel' : 'Panel Administratora'}</span>
              </button>
            )}
          </div>

          {/* Mobile Auth & Session Controls */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuthModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold"
            >
              <UserCheck className="h-4 w-4" />
              <span>
                {isAuthenticated
                  ? isEn
                    ? 'Manage Account / Switch Profile'
                    : 'Zarządzaj Kontem / Zmień Profil'
                  : isEn
                  ? 'Sign In / Create Account'
                  : 'Zaloguj się / Załóż Konto'}
              </span>
            </button>
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold"
              >
                <LogOut className="h-4 w-4" />
                <span>{isEn ? `Sign Out (${currentUser.name})` : `Wyloguj się (${currentUser.name})`}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
