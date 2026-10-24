import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateLevel, formatCountdown } from '../utils/gamification';
import { 
  Code2, 
  Flame, 
  Sparkles, 
  Moon, 
  Sun, 
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
  LogIn
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onOpenAuthModal: () => void;
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuthModal, onOpenCommandPalette }) => {
  const { 
    currentUser, 
    isAuthenticated,
    allUsers, 
    switchUser, 
    logout,
    theme, 
    toggleTheme, 
    activeTab, 
    setActiveTab,
    livesInfo,
    setIsLivesModalOpen,
    setIsSubModalOpen,
    isSoundMuted,
    toggleSound
  } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const levelInfo = calculateLevel(currentUser.xp);
  const isPro = currentUser.isPro;
  const currentLives = isPro ? 5 : (livesInfo.currentLives ?? currentUser.lives ?? 5);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button 
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 sm:gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-0.5 sm:p-1"
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20 shrink-0">
              <Code2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <span className="block text-sm sm:text-base font-bold tracking-tight text-white leading-none">
                Full Stack <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Academy</span>
              </span>
              <span className="hidden sm:block text-[10px] font-medium uppercase tracking-wider text-slate-400 mt-1">
                Akademia Programowania
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Quick Nav */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-medium shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'dashboard' 
                ? 'bg-slate-800/80 text-white font-semibold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            Pulpit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('modules')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'modules' || activeTab === 'lesson'
                ? 'bg-slate-800/80 text-white font-semibold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            Moduły (15)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'editor' 
                ? 'bg-slate-800/80 text-white font-semibold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            Piaskownica
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'projects' 
                ? 'bg-slate-800/80 text-white font-semibold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            Projekty (12)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('api_studio')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'api_studio' 
                ? 'bg-slate-800/80 text-white font-semibold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            REST API
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('certificate')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'certificate' 
                ? 'bg-slate-800/80 text-white font-semibold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            Certyfikat
          </button>
        </nav>

        {/* User stats & Profile widget */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Szukaj w akademii (Ctrl+K)"
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 px-2.5 py-1 text-xs text-slate-300 transition-colors whitespace-nowrap shrink-0"
            >
              <Search className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden lg:inline">Szukaj</span>
              <kbd className="hidden xl:inline text-[10px] font-mono text-slate-400">Ctrl+K</kbd>
            </button>
          )}
          
          {/* Hearts / Lives indicator */}
          <button
            type="button"
            onClick={() => setIsLivesModalOpen(true)}
            title={isPro ? "Nielimitowane życia (PRO)" : `Masz ${currentLives}/5 serc. Kliknij, aby sprawdzić odnowienie lub uzupełnić serca.`}
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
            title={`Twoja seria nauki: ${currentUser.streakDays} dni z rzędu!`}
            className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-1 text-xs font-semibold text-amber-400 whitespace-nowrap shrink-0"
          >
            <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{currentUser.streakDays}d</span>
          </div>

          {/* XP & Level Indicator */}
          <div 
            title={`Poziom ${levelInfo.level}: ${levelInfo.title} (${currentUser.xp} XP)`}
            className="hidden sm:flex items-center gap-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs whitespace-nowrap shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-bold text-indigo-300 tabular-nums">{currentUser.xp} XP</span>
          </div>

          {/* Sound FX Toggle (desktop / tablet) */}
          <button
            type="button"
            onClick={toggleSound}
            title={isSoundMuted ? 'Włącz efekty dźwiękowe (SFX)' : 'Wycisz efekty dźwiękowe (SFX)'}
            aria-label={isSoundMuted ? 'Włącz dźwięki' : 'Wycisz dźwięki'}
            className="hidden sm:inline-flex rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            {isSoundMuted ? <VolumeX className="h-4 w-4 text-slate-500" /> : <Volume2 className="h-4 w-4 text-cyan-400 animate-pulse" />}
          </button>

          {/* Theme Toggle (desktop / tablet) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'}
            className="hidden sm:inline-flex rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Quick Login Button when logged out */}
          {!isAuthenticated && (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition-colors shrink-0"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Zaloguj się</span>
            </button>
          )}

          {/* Profile Switcher Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-slate-700 bg-slate-900 p-1 sm:p-1.5 text-left text-xs text-slate-200 hover:border-slate-600 transition-colors focus:outline-none"
            >
              <img 
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'} 
                alt={currentUser.name}
                className="h-6 w-6 rounded-md object-cover ring-1 ring-indigo-500/50" 
              />
              <span className="hidden md:inline font-medium max-w-[100px] truncate">{currentUser.name}</span>
              {!isAuthenticated ? (
                <span className="hidden sm:inline-block bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-amber-500/30">
                  Gość
                </span>
              ) : currentUser.role === 'admin' ? (
                <span className="hidden sm:inline-block bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-rose-500/30">
                  Admin
                </span>
              ) : (
                <span className="hidden sm:inline-block bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded text-[10px] font-medium border border-indigo-500/30">
                  Kursant
                </span>
              )}
              <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      isAuthenticated ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {isAuthenticated ? 'Zalogowany' : 'Tryb Gościa'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  <p className="text-[10px] text-indigo-400 mt-1 font-mono">{levelInfo.title}</p>
                </div>

                <div className="px-2 py-1 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Profile testowe kursantów:
                </div>

                {allUsers
                  .filter(
                    (u) =>
                      u.status === 'active' &&
                      u.role !== 'admin' &&
                      u.id !== 'user-admin' &&
                      u.email.trim().toLowerCase() !== 'zordonzordon1@gmail.com'
                  )
                  .map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => switchUser(u.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-left transition-colors ${
                        isAuthenticated && u.id === currentUser.id
                          ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{u.name}</span>
                      <span className="text-[10px] text-slate-400 ml-2 shrink-0">
                        {u.xp} XP
                      </span>
                    </button>
                  ))}

                <div className="border-t border-slate-800 mt-2 pt-1 space-y-0.5">
                  <button
                    type="button"
                    onClick={onOpenAuthModal}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-indigo-300 hover:bg-slate-800 font-medium"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>{isAuthenticated ? 'Konto / Zmień profil / Rejestracja' : 'Zaloguj się / Załóż konto'}</span>
                  </button>
                  {currentUser.role === 'admin' && isAuthenticated && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('admin')}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-300 hover:bg-slate-800 font-medium"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      <span>Panel Zarządzania Kursem</span>
                    </button>
                  )}
                  {isAuthenticated && (
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-950/40 font-semibold transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Wyloguj się z konta</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Otwórz menu mobilne"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 py-3 space-y-2 max-h-[85vh] overflow-y-auto">
          
          {/* Mobile Hearts & Pro Bar */}
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsLivesModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                isPro 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <Heart className={`h-4 w-4 ${isPro ? 'fill-amber-400' : 'fill-rose-500'}`} />
              <span>{isPro ? 'Serca: ∞ PRO' : `Serca: ${currentLives}/5`}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSubModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black shrink-0"
            >
              <Crown className="h-4 w-4 fill-slate-950" />
              <span>{isPro ? 'PRO Aktywne' : 'Kup PRO'}</span>
            </button>
          </div>

          {/* Quick Sound FX & Theme Toggles for Mobile */}
          <div className="flex items-center gap-2 py-1.5 border-b border-slate-800">
            <button
              type="button"
              onClick={toggleSound}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold"
            >
              {isSoundMuted ? <VolumeX className="h-4 w-4 text-slate-500" /> : <Volume2 className="h-4 w-4 text-cyan-400 animate-pulse" />}
              <span>{isSoundMuted ? 'Dźwięk: Wył.' : 'Dźwięk: Wł.'}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
              <span>{theme === 'dark' ? 'Jasny motyw' : 'Ciemny motyw'}</span>
            </button>
          </div>

          {/* Mobile Android / Play Store Install Action */}
          <div className="py-1 border-b border-slate-800">
            <PWAInstallButton variant="full" className="w-full justify-center py-2.5" />
          </div>

          {/* Primary Navigation */}
          <div className="pt-1 space-y-1">
            <button
              type="button"
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <BookOpen className="h-4 w-4 text-indigo-400" />
              <span>Pulpit Kursanta</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('modules'); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <BookOpen className="h-4 w-4 text-cyan-400" />
              <span>Moduły Kursu (15)</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('projects'); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <Trophy className="h-4 w-4 text-emerald-400" />
              <span>Projekty Praktyczne (12)</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('certificate'); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <Award className="h-4 w-4 text-yellow-400" />
              <span>Certyfikat Ukończenia</span>
            </button>
          </div>

          {/* Interactive Tools Group */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Warsztat & Narzędzia
            </div>
            <button
              type="button"
              onClick={() => { setActiveTab('terminal'); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <TerminalSquare className="h-4 w-4 text-emerald-400" />
                <span>Terminal Bash & Git</span>
              </div>
              <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded font-bold">+XP</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('sql_studio'); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <Database className="h-4 w-4 text-indigo-400" />
              <span>Studio Bazy SQL</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('interview'); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <Award className="h-4 w-4 text-amber-400" />
                <span>Live Coding (Egzamin)</span>
              </div>
              <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">Mock</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('editor'); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <Terminal className="h-4 w-4 text-amber-400" />
              <span>Piaskownica Kodu</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('reviews'); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <Sparkles className="h-4 w-4 text-rose-400" />
              <span>Centrum Powtórek</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('deployment'); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
            >
              <Code2 className="h-4 w-4 text-blue-400" />
              <span>Przewodnik Wdrożenia & DevOps</span>
            </button>
            {currentUser.role === 'admin' && isAuthenticated && (
              <button
                type="button"
                onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-rose-300 hover:bg-slate-800 font-semibold"
              >
                <Shield className="h-4 w-4" />
                <span>Panel Administratora</span>
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
              <span>{isAuthenticated ? 'Zarządzaj Kontem / Zmień Profil' : 'Zaloguj się / Załóż Konto'}</span>
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
                <span>Wyloguj się ({currentUser.name})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
