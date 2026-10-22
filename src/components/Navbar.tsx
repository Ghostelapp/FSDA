import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateLevel } from '../utils/gamification';
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
  Award
} from 'lucide-react';

interface NavbarProps {
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuthModal }) => {
  const { currentUser, allUsers, switchUser, theme, toggleTheme, activeTab, setActiveTab } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const levelInfo = calculateLevel(currentUser.xp);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-base font-bold tracking-tight text-white leading-none">
                Full Stack <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Academy</span>
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400 mt-1">
                Akademia Programowania
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Quick Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
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
            className={`px-3 py-1.5 rounded-lg transition-colors ${
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
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'editor' 
                ? 'bg-slate-800/80 text-white font-semibold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            Piaskownica Kodu
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'projects' 
                ? 'bg-slate-800/80 text-white font-semibold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            Projekty (12)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'reviews' 
                ? 'bg-slate-800/80 text-white font-semibold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            Powtórki
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('certificate')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'certificate' 
                ? 'bg-slate-800/80 text-white font-semibold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            Certyfikat
          </button>
        </nav>

        {/* User stats & Profile widget */}
        <div className="flex items-center gap-3">
          {/* Streak indicator */}
          <div 
            title={`Twoja seria nauki: ${currentUser.streakDays} dni z rzędu!`}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-400"
          >
            <Flame className="h-4 w-4 fill-amber-400 text-amber-400 animate-pulse" />
            <span>{currentUser.streakDays}d</span>
          </div>

          {/* XP & Level Indicator */}
          <div 
            title={`Poziom ${levelInfo.level}: ${levelInfo.title} (${currentUser.xp} XP)`}
            className="hidden sm:flex items-center gap-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <div>
              <span className="font-bold text-indigo-300">{currentUser.xp} XP</span>
              <span className="text-slate-400 ml-1.5 text-[11px]">Poz. {levelInfo.level}</span>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Profile Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-left text-xs text-slate-200 hover:border-slate-600 transition-colors focus:outline-none"
            >
              <img 
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'} 
                alt={currentUser.name}
                className="h-6 w-6 rounded-md object-cover ring-1 ring-indigo-500/50" 
              />
              <span className="hidden md:inline font-medium max-w-[100px] truncate">{currentUser.name}</span>
              {currentUser.role === 'admin' ? (
                <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-rose-500/30">
                  Admin
                </span>
              ) : (
                <span className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded text-[10px] font-medium border border-indigo-500/30">
                  Kursant
                </span>
              )}
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  <p className="text-[10px] text-indigo-400 mt-1 font-mono">{levelInfo.title}</p>
                </div>

                <div className="px-2 py-1 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Szybkie przełączanie konta:
                </div>

                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => switchUser(u.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-left transition-colors ${
                      u.id === currentUser.id 
                        ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' 
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{u.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2">
                      {u.role === 'admin' ? 'Instruktor' : `${u.xp} XP`}
                    </span>
                  </button>
                ))}

                <div className="border-t border-slate-800 mt-2 pt-1">
                  <button
                    type="button"
                    onClick={onOpenAuthModal}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-indigo-300 hover:bg-slate-800 font-medium"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    Zmień konto / Rejestracja
                  </button>
                  {currentUser.role === 'admin' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('admin')}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-300 hover:bg-slate-800 font-medium"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      Panel Zarządzania Kursem
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
        <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 py-3 space-y-1">
          <button
            type="button"
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
          >
            <BookOpen className="h-4 w-4 text-indigo-400" />
            Pulpit Kursanta
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('modules'); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
          >
            <BookOpen className="h-4 w-4 text-cyan-400" />
            Moduły Kursu (15)
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('editor'); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
          >
            <Terminal className="h-4 w-4 text-amber-400" />
            Interaktywny Edytor Kodu
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('projects'); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
          >
            <Trophy className="h-4 w-4 text-emerald-400" />
            Projekty Praktyczne (12)
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('reviews'); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
          >
            <Sparkles className="h-4 w-4 text-rose-400" />
            Centrum Powtórek
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('certificate'); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
          >
            <Award className="h-4 w-4 text-yellow-400" />
            Certyfikat Ukończenia
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('deployment'); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-200 hover:bg-slate-800"
          >
            <Code2 className="h-4 w-4 text-blue-400" />
            Przewodnik Wdrożenia & DevOps
          </button>
          {currentUser.role === 'admin' && (
            <button
              type="button"
              onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-rose-300 hover:bg-slate-800 font-semibold"
            >
              <Shield className="h-4 w-4" />
              Panel Administratora
            </button>
          )}
        </div>
      )}
    </header>
  );
};
