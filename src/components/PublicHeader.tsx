import React from 'react';
import { useApp } from '../context/AppContext';
import { buildPublicPath } from '../utils/publicRoutes';
import type { PublicTab } from '../utils/publicRoutes';
import { BrandLogo } from './BrandLogo';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';

interface PublicHeaderProps {
  onOpenAuthModal: () => void;
  activeTab: PublicTab;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ onOpenAuthModal, activeTab }) => {
  const { isAuthenticated, setActiveTab, allLessons, language } = useApp();
  const isEn = language === 'en';

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetTab: PublicTab,
    lessonId?: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setActiveTab(targetTab, lessonId);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handlePrimaryApp = () => {
    setActiveTab('dashboard');
    if (!isAuthenticated) {
      onOpenAuthModal();
    }
  };

  const navItems: { tab: PublicTab; label: string }[] = isEn
    ? [
        { tab: 'landing', label: 'Home' },
        { tab: 'knowledge_base', label: `Knowledge Base (${allLessons.length} lessons)` },
        { tab: 'about', label: 'About' },
        { tab: 'contact', label: 'Contact' },
      ]
    : [
        { tab: 'landing', label: 'Strona główna' },
        { tab: 'knowledge_base', label: `Baza wiedzy (${allLessons.length} lekcji)` },
        { tab: 'about', label: 'O Akademii' },
        { tab: 'contact', label: 'Kontakt' },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#06080E]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-6 px-3 sm:px-8 py-3 sm:py-3.5">
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, 'landing')}
          aria-label={isEn ? 'Full Stack Academy — Home' : 'Full Stack Academy — Strona główna'}
          className="whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-0.5 sm:p-1"
        >
          <BrandLogo compact />
        </a>

        <nav
          aria-label={isEn ? 'Public navigation' : 'Nawigacja publiczna'}
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#94A3B8]"
        >
          {navItems.map((item) => {
            const href = buildPublicPath(item.tab) || '/';
            const isActive =
              activeTab === item.tab ||
              (activeTab === 'public_lesson' && item.tab === 'knowledge_base');
            return (
              <a
                key={item.tab}
                href={href}
                onClick={(e) => handleLinkClick(e, item.tab)}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#F8FAFC] ${
                  isActive ? 'text-[#F8FAFC] underline underline-offset-8 decoration-indigo-500' : ''
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <LanguageToggle variant="compact" />
          <ThemeToggle variant="compact" />
          <a
            href="/baza-wiedzy"
            onClick={(e) => handleLinkClick(e, 'knowledge_base')}
            className="hidden sm:inline-flex md:hidden px-2 py-1.5 text-[11px] font-semibold text-[#CBD5E1] border border-white/15 rounded-lg hover:text-white whitespace-nowrap"
          >
            {isEn ? 'Docs' : 'Baza'}
          </a>
          <button
            type="button"
            onClick={handlePrimaryApp}
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline">{isEn ? 'Dashboard →' : 'Pulpit Kursanta →'}</span>
                <span className="sm:hidden">{isEn ? 'Dashboard →' : 'Pulpit →'}</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">{isEn ? 'Launch App →' : 'Uruchom Aplikację →'}</span>
                <span className="sm:hidden">{isEn ? 'App →' : 'Aplikacja →'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
