import React from 'react';
import { useApp } from '../context/AppContext';
import { buildPublicPath } from '../utils/publicRoutes';
import type { PublicTab } from '../utils/publicRoutes';
import { BrandLogo } from './BrandLogo';

interface PublicHeaderProps {
  onOpenAuthModal: () => void;
  activeTab: PublicTab;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ onOpenAuthModal, activeTab }) => {
  const { isAuthenticated, setActiveTab, allLessons } = useApp();

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

  const navItems: { tab: PublicTab; label: string }[] = [
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
          aria-label="Full Stack Academy — Strona główna"
          className="whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-0.5 sm:p-1"
        >
          <BrandLogo />
        </a>

        <nav
          aria-label="Nawigacja publiczna"
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

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="/baza-wiedzy"
            onClick={(e) => handleLinkClick(e, 'knowledge_base')}
            className="md:hidden px-2.5 py-1.5 text-[11px] font-semibold text-[#CBD5E1] border border-white/15 rounded-lg hover:text-white whitespace-nowrap"
          >
            Baza wiedzy
          </a>
          <button
            type="button"
            onClick={handlePrimaryApp}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline">Pulpit Kursanta →</span>
                <span className="sm:hidden">Pulpit →</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Uruchom Aplikację →</span>
                <span className="sm:hidden">Aplikacja →</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
