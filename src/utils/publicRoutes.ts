import { Lesson } from '../types';

export type PublicTab =
  | 'landing'
  | 'knowledge_base'
  | 'public_lesson'
  | 'about'
  | 'contact'
  | 'terms'
  | 'privacy';

export const PUBLIC_TABS: readonly PublicTab[] = [
  'landing',
  'knowledge_base',
  'public_lesson',
  'about',
  'contact',
  'terms',
  'privacy',
];

export const SITE_BASE_URL = 'https://fsda-phi.vercel.app';

export function isPublicTab(tab: string): tab is PublicTab {
  return (PUBLIC_TABS as readonly string[]).includes(tab);
}

export function normalizePathname(pathname: string): string {
  const clean = (pathname || '/').split('?')[0].split('#')[0].trim();
  if (!clean || clean === '/') return '/';
  const collapsed = clean.replace(/\/+/g, '/');
  return collapsed.length > 1 && collapsed.endsWith('/') ? collapsed.slice(0, -1) : collapsed;
}

export function parsePublicLocation(
  pathname: string,
  validLessonIds?: Set<string>
): { tab: PublicTab; lessonId?: string } | null {
  const normalized = normalizePathname(pathname);
  const lower = normalized.toLowerCase();

  if (lower === '/app' || lower.startsWith('/app/')) {
    return null;
  }

  if (lower === '/') {
    return { tab: 'landing' };
  }
  if (lower === '/baza-wiedzy' || lower === '/lekcje' || lower === '/poradniki') {
    return { tab: 'knowledge_base' };
  }
  if (lower === '/o-nas' || lower === '/o-akademii') {
    return { tab: 'about' };
  }
  if (lower === '/kontakt') {
    return { tab: 'contact' };
  }
  if (lower === '/regulamin') {
    return { tab: 'terms' };
  }
  if (lower === '/polityka-prywatnosci') {
    return { tab: 'privacy' };
  }

  const lessonPrefixMatch = normalized.match(/^\/(?:baza-wiedzy|lekcje|poradniki)\/([^/]+)$/i);
  if (lessonPrefixMatch) {
    const rawId = decodeURIComponent(lessonPrefixMatch[1]).trim();
    if (!validLessonIds || validLessonIds.has(rawId)) {
      return { tab: 'public_lesson', lessonId: rawId };
    }
    return { tab: 'knowledge_base' };
  }

  return { tab: 'landing' };
}

export function buildPublicPath(tab: string, lessonId?: string | null): string | null {
  switch (tab) {
    case 'landing':
      return '/';
    case 'knowledge_base':
      return '/baza-wiedzy';
    case 'public_lesson':
      return lessonId ? `/baza-wiedzy/${encodeURIComponent(lessonId)}` : '/baza-wiedzy';
    case 'about':
      return '/o-nas';
    case 'contact':
      return '/kontakt';
    case 'terms':
      return '/regulamin';
    case 'privacy':
      return '/polityka-prywatnosci';
    default:
      return null;
  }
}

export function getPublicRouteSeoMetadata(
  tab: PublicTab,
  lesson?: Pick<Lesson, 'id' | 'title' | 'summary' | 'moduleTitle'> | null
): {
  title: string;
  description: string;
  canonicalPath: string;
} {
  switch (tab) {
    case 'knowledge_base':
      return {
        title: 'Otwarta Baza Wiedzy — 91 darmowych lekcji programowania | Full Stack Academy',
        description:
          'Darmowa, otwarta baza wiedzy Full Stack Developer Academy: 15 modułów i 91 artykułów z przykładami kodu HTML5, CSS, JavaScript, TypeScript, React, Node.js, SQL i Docker bez logowania.',
        canonicalPath: '/baza-wiedzy',
      };
    case 'public_lesson':
      if (lesson) {
        return {
          title: `${lesson.title} — Lekcja z Bazy Wiedzy | Full Stack Academy`,
          description: lesson.summary,
          canonicalPath: `/baza-wiedzy/${encodeURIComponent(lesson.id)}`,
        };
      }
      return {
        title: 'Lekcja programowania | Full Stack Academy',
        description:
          'Bezpłatna lekcja programowania z omówieniem krok po kroku, analogią oraz przykładami kodu.',
        canonicalPath: '/baza-wiedzy',
      };
    case 'about':
      return {
        title: 'O Akademii i Metodyce Nauki | Full Stack Developer Academy',
        description:
          'Poznaj misję i metodykę edukacyjną polskiej platformy Full Stack Developer Academy: praktyczne przykłady, jasny język bez zbędnego żargonu oraz pełny program 15 modułów.',
        canonicalPath: '/o-nas',
      };
    case 'contact':
      return {
        title: 'Kontakt i Wsparcie Techniczne | Full Stack Developer Academy',
        description:
          'Skontaktuj się z zespołem Full Stack Developer Academy w sprawach merytorycznych, technicznych i ochrony danych osobowych.',
        canonicalPath: '/kontakt',
      };
    case 'terms':
      return {
        title: 'Regulamin Platformy Edukacyjnej | Full Stack Developer Academy',
        description:
          'Zasady korzystania z otwartej bazy wiedzy oraz interaktywnej aplikacji edukacyjnej Full Stack Developer Academy.',
        canonicalPath: '/regulamin',
      };
    case 'privacy':
      return {
        title: 'Polityka Prywatności i Cookies (RODO / AdSense) | Full Stack Academy',
        description:
          'Informacje o przetwarzaniu danych użytkowników, lokalnym zapisie postępów, uwierzytelnianiu Firebase oraz plikach cookie Google AdSense.',
        canonicalPath: '/polityka-prywatnosci',
      };
    case 'landing':
    default:
      return {
        title: 'Full Stack Developer Academy — Interaktywna Akademia Programowania',
        description:
          'Interaktywna platforma edukacyjna do nauki programowania od podstaw do poziomu Full Stack Developera z wbudowanym edytorem kodu, projektami i otwartą bazą 91 lekcji.',
        canonicalPath: '/',
      };
  }
}
