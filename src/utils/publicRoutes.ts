import { Lesson } from '../types';
import { AppLanguage } from './i18n';
import type { EditorialGuide } from './guides';

export type PublicTab =
  | 'landing'
  | 'knowledge_base'
  | 'public_lesson'
  | 'guides'
  | 'guide_detail'
  | 'about'
  | 'contact'
  | 'terms'
  | 'privacy';

export const PUBLIC_TABS: readonly PublicTab[] = [
  'landing',
  'knowledge_base',
  'public_lesson',
  'guides',
  'guide_detail',
  'about',
  'contact',
  'terms',
  'privacy',
];

export const SITE_BASE_URL = 'https://fsda.tech';

export function isPublicTab(tab: string): tab is PublicTab {
  return (PUBLIC_TABS as readonly string[]).includes(tab);
}

export function normalizePathname(pathname: string): string {
  const clean = (pathname || '/').split('?')[0].split('#')[0].trim();
  if (!clean || clean === '/') return '/';
  const collapsed = clean.replace(/\/+/g, '/');
  return collapsed.length > 1 && collapsed.endsWith('/') ? collapsed.slice(0, -1) : collapsed;
}

export interface MobileAppRuntimeSignals {
  displayModeStandalone?: boolean;
  displayModeFullscreen?: boolean;
  displayModeMinimalUi?: boolean;
  navigatorStandalone?: boolean;
  referrer?: string;
  userAgent?: string;
  hasReactNativeWebView?: boolean;
}

export interface EmbeddedWebViewSignals {
  userAgent?: string;
  hasReactNativeWebView?: boolean;
}

export const ANDROID_TWA_PACKAGE_ID = 'com.fullstackacademy.app';

/**
 * Detects an embedded React Native / Android WebView container (such as the
 * Expo APK wrapper). Calling `history.pushState`/`replaceState` inside
 * react-native-webview on Android fires `onLoadStart` without a matching
 * `onLoadEnd`, which can leave a native splash/loading overlay stuck forever.
 */
export function isEmbeddedWebViewRuntime(signals: EmbeddedWebViewSignals): boolean {
  if (signals.hasReactNativeWebView) {
    return true;
  }

  const ua = (signals.userAgent || '').trim().toLowerCase();
  if (!ua) return false;
  if (ua.includes('fullstackacademyexpo')) {
    return true;
  }
  if (ua.includes('; wv)')) {
    return true;
  }
  return false;
}

export function detectEmbeddedWebViewRuntime(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const win = window as unknown as {
      ReactNativeWebView?: unknown;
      __FSDA_MOBILE_APP__?: boolean;
    };
    return isEmbeddedWebViewRuntime({
      userAgent: window.navigator?.userAgent || '',
      hasReactNativeWebView:
        typeof win.ReactNativeWebView !== 'undefined' || win.__FSDA_MOBILE_APP__ === true,
    });
  } catch {
    return false;
  }
}

export function shouldSyncBrowserHistoryUrl(signals: EmbeddedWebViewSignals): boolean {
  return !isEmbeddedWebViewRuntime(signals);
}

export function isInstalledMobileAppRuntime(signals: MobileAppRuntimeSignals): boolean {
  if (
    signals.displayModeStandalone ||
    signals.displayModeFullscreen ||
    signals.displayModeMinimalUi ||
    signals.navigatorStandalone ||
    signals.hasReactNativeWebView
  ) {
    return true;
  }

  const referrer = (signals.referrer || '').trim().toLowerCase();
  if (referrer.startsWith(`android-app://${ANDROID_TWA_PACKAGE_ID}`)) {
    return true;
  }

  const ua = (signals.userAgent || '').trim().toLowerCase();
  if (ua.includes('fullstackacademyexpo')) {
    return true;
  }

  return false;
}

export function detectInstalledMobileAppRuntime(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const match = (query: string) => Boolean(window.matchMedia?.(query)?.matches);
    const nav = window.navigator as Navigator & { standalone?: boolean };
    const win = window as unknown as {
      ReactNativeWebView?: unknown;
      __FSDA_MOBILE_APP__?: boolean;
    };
    return isInstalledMobileAppRuntime({
      displayModeStandalone: match('(display-mode: standalone)'),
      displayModeFullscreen: match('(display-mode: fullscreen)'),
      displayModeMinimalUi: match('(display-mode: minimal-ui)'),
      navigatorStandalone: nav.standalone === true,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      userAgent: nav.userAgent || '',
      hasReactNativeWebView:
        typeof win.ReactNativeWebView !== 'undefined' || win.__FSDA_MOBILE_APP__ === true,
    });
  } catch {
    return false;
  }
}

export function parsePublicLocation(
  pathname: string,
  validLessonIds?: Set<string>,
  validGuideSlugs?: Set<string>
): { tab: PublicTab; lessonId?: string; guideSlug?: string } | null {
  const normalized = normalizePathname(pathname);
  const lower = normalized.toLowerCase();

  if (lower === '/app' || lower.startsWith('/app/')) {
    return null;
  }

  if (lower === '/') {
    return { tab: 'landing' };
  }
  if (lower === '/poradniki') {
    return { tab: 'guides' };
  }
  if (lower === '/baza-wiedzy' || lower === '/lekcje') {
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

  const guidePrefixMatch = normalized.match(/^\/poradniki\/([^/]+)$/i);
  if (guidePrefixMatch) {
    const rawSlug = decodeURIComponent(guidePrefixMatch[1]).trim();
    if (!validGuideSlugs || validGuideSlugs.has(rawSlug)) {
      return { tab: 'guide_detail', guideSlug: rawSlug };
    }
    return { tab: 'guides' };
  }

  const lessonPrefixMatch = normalized.match(/^\/(?:baza-wiedzy|lekcje)\/([^/]+)$/i);
  if (lessonPrefixMatch) {
    const rawId = decodeURIComponent(lessonPrefixMatch[1]).trim();
    if (!validLessonIds || validLessonIds.has(rawId)) {
      return { tab: 'public_lesson', lessonId: rawId };
    }
    return { tab: 'knowledge_base' };
  }

  return { tab: 'landing' };
}

export function buildPublicPath(tab: string, idOrSlug?: string | null): string | null {
  switch (tab) {
    case 'landing':
      return '/';
    case 'knowledge_base':
      return '/baza-wiedzy';
    case 'public_lesson':
      return idOrSlug ? `/baza-wiedzy/${encodeURIComponent(idOrSlug)}` : '/baza-wiedzy';
    case 'guides':
      return '/poradniki';
    case 'guide_detail':
      return idOrSlug ? `/poradniki/${encodeURIComponent(idOrSlug)}` : '/poradniki';
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
  lesson?: Pick<Lesson, 'id' | 'title' | 'summary' | 'moduleTitle'> | null,
  language: AppLanguage = 'pl',
  guide?: Pick<EditorialGuide, 'slug' | 'title' | 'titleEn' | 'metaDescription' | 'category'> | null
): {
  title: string;
  description: string;
  canonicalPath: string;
} {
  if (language === 'en') {
    switch (tab) {
      case 'guides':
        return {
          title: 'Engineering Guides — In-Depth Full Stack Articles | Full Stack Academy',
          description:
            'In-depth editorial programming guides covering HTML5, WCAG accessibility, CSS Flexbox & Grid, JavaScript Event Loop, TypeScript, React 19, REST APIs, PostgreSQL, OWASP security, Docker, testing, and IT recruitment.',
          canonicalPath: '/poradniki',
        };
      case 'guide_detail':
        if (guide) {
          return {
            title: `${guide.titleEn || guide.title} | Full Stack Academy`,
            description: guide.metaDescription,
            canonicalPath: `/poradniki/${encodeURIComponent(guide.slug)}`,
          };
        }
        return {
          title: 'Engineering Guide | Full Stack Academy',
          description: 'In-depth programming guide with production code examples, architecture checklists, and FAQs.',
          canonicalPath: '/poradniki',
        };
      case 'knowledge_base':
        return {
          title: 'Open Knowledge Base — 96 Free Coding Lessons | Full Stack Academy',
          description:
            'Free open knowledge base of Full Stack Developer Academy: 15 modules and 96 lessons with code examples in HTML5, CSS, JavaScript, TypeScript, React, Node.js, SQL, and Docker without login.',
          canonicalPath: '/baza-wiedzy',
        };
      case 'public_lesson':
        if (lesson) {
          return {
            title: `${lesson.title} — Knowledge Base Lesson | Full Stack Academy`,
            description: lesson.summary,
            canonicalPath: `/baza-wiedzy/${encodeURIComponent(lesson.id)}`,
          };
        }
        return {
          title: 'Programming Lesson | Full Stack Academy',
          description: 'Free programming lesson with step-by-step walkthrough, everyday analogy, and runnable examples.',
          canonicalPath: '/baza-wiedzy',
        };
      case 'about':
        return {
          title: 'About the Academy & Methodology | Full Stack Developer Academy',
          description:
            'Explore the mission and teaching methodology of Full Stack Developer Academy: hands-on examples, plain-English explanations, and a complete 15-module curriculum.',
          canonicalPath: '/o-nas',
        };
      case 'contact':
        return {
          title: 'Contact & Technical Support | Full Stack Developer Academy',
          description:
            'Get in touch with the Full Stack Developer Academy team regarding curriculum questions, technical support, or data privacy.',
          canonicalPath: '/kontakt',
        };
      case 'terms':
        return {
          title: 'Terms of Service | Full Stack Developer Academy',
          description:
            'Rules governing the use of the open knowledge base and interactive Full Stack Developer Academy platform.',
          canonicalPath: '/regulamin',
        };
      case 'privacy':
        return {
          title: 'Privacy Policy & Cookies (GDPR / AdSense) | Full Stack Academy',
          description:
            'Details on personal data processing, local progress persistence, Firebase authentication, and Google AdSense cookies.',
          canonicalPath: '/polityka-prywatnosci',
        };
      case 'landing':
      default:
        return {
          title: 'Full Stack Developer Academy — Free Coding Course & Engineering Guides',
          description:
            'Interactive coding platform taking you from zero to Full Stack Developer with an in-browser code editor, commercial projects, in-depth guides, and an open 96-lesson knowledge base.',
          canonicalPath: '/',
        };
    }
  }

  switch (tab) {
    case 'guides':
      return {
        title: 'Poradniki Eksperckie — Programowanie Full Stack | Full Stack Academy',
        description:
          'Długie, merytoryczne poradniki programistyczne z przykładami kodu produkcyjnego: HTML5 i WCAG, CSS Flexbox vs Grid, JavaScript Event Loop, TypeScript, React 19, REST API, PostgreSQL, OWASP, Docker, testy i rekrutacja IT.',
        canonicalPath: '/poradniki',
      };
    case 'guide_detail':
      if (guide) {
        return {
          title: `${guide.title} | Full Stack Academy`,
          description: guide.metaDescription,
          canonicalPath: `/poradniki/${encodeURIComponent(guide.slug)}`,
        };
      }
      return {
        title: 'Poradnik Ekspercki | Full Stack Academy',
        description:
          'Rozbudowany poradnik inżynierski z przykładami kodu, tabelami porównawczymi i sekcją FAQ.',
        canonicalPath: '/poradniki',
      };
    case 'knowledge_base':
      return {
        title: 'Otwarta Baza Wiedzy — 96 darmowych lekcji programowania | Full Stack Academy',
        description:
          'Darmowa, otwarta baza wiedzy Full Stack Developer Academy: 15 modułów i 96 artykułów z przykładami kodu HTML5, CSS, JavaScript, TypeScript, React, Node.js, SQL i Docker bez logowania.',
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
        title: 'Full Stack Developer Academy — Darmowy Kurs Programowania i Poradniki IT',
        description:
          'Interaktywna platforma edukacyjna do nauki programowania od podstaw do poziomu Full Stack Developera z edytorem kodu, eksperckimi poradnikami i otwartą bazą 96 lekcji.',
        canonicalPath: '/',
      };
  }
}
