export type AppLanguage = 'pl' | 'en';

export const LANGUAGE_STORAGE_KEY = 'fsda_language_v1';
export const DEFAULT_LANGUAGE: AppLanguage = 'pl';

export function parseLanguage(raw: unknown): AppLanguage {
  if (typeof raw !== 'string') return DEFAULT_LANGUAGE;
  const normalized = raw.trim().toLowerCase();
  if (normalized === 'en' || normalized.startsWith('en-')) return 'en';
  if (normalized === 'pl' || normalized.startsWith('pl-')) return 'pl';
  return DEFAULT_LANGUAGE;
}

export function loadSavedLanguage(): AppLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored) return parseLanguage(stored);
  } catch {
    // Ignore storage access errors in restricted frames
  }
  return DEFAULT_LANGUAGE;
}

export function saveLanguagePreference(language: AppLanguage): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Ignore storage quota / restricted frame errors
  }
}

export function getIntlLocale(language: AppLanguage): string {
  return language === 'en' ? 'en-US' : 'pl-PL';
}

export function getOgLocale(language: AppLanguage): string {
  return language === 'en' ? 'en_US' : 'pl_PL';
}

export const CATEGORY_LABELS_EN: Record<string, string> = {
  Wszystkie: 'All',
  Podstawy: 'Foundations',
  Frontend: 'Frontend',
  Backend: 'Backend',
  'Bazy danych': 'Databases',
  'DevOps & Bezpieczeństwo': 'DevOps & Security',
  Kariera: 'Career',
};

export function formatCategoryLabel(category: string, language: AppLanguage): string {
  if (language === 'pl') return category;
  return CATEGORY_LABELS_EN[category] || category;
}

export const DIFFICULTY_LABELS_EN: Record<string, string> = {
  Wszystkie: 'All',
  'Start od Zera': 'Zero to Start',
  Początkujący: 'Beginner',
  Podstawy: 'Foundations',
  Średniozaawansowany: 'Intermediate',
  Zaawansowany: 'Advanced',
  Ekspert: 'Expert',
};

export function formatDifficultyLabel(difficulty: string, language: AppLanguage): string {
  if (language === 'pl') return difficulty;
  return DIFFICULTY_LABELS_EN[difficulty] || difficulty;
}

export const ANNOUNCEMENT_CAT_EN: Record<string, string> = {
  Kurs: 'Course',
  Wydarzenie: 'Event',
  Aktualizacja: 'Update',
  Porada: 'Tip',
};

export function formatAnnouncementCategory(category: string, language: AppLanguage): string {
  if (language === 'pl') return category;
  return ANNOUNCEMENT_CAT_EN[category] || category;
}

export const LEVEL_TITLES_EN: Record<number, string> = {
  1: 'Aspiring Developer',
  2: 'Foundations & Terminal Adept',
  3: 'HTML & CSS Semantics Master',
  4: 'JavaScript & DOM Explorer',
  5: 'React Interface Architect',
  6: 'Backend & Node.js Engineer',
  7: 'Database & SQL Specialist',
  8: 'Security & Auth Guardian',
  9: 'DevOps & CI/CD Practitioner',
  10: 'Independent Junior Full Stack',
};

export function getLocalizedLevelTitle(level: number, fallbackTitle: string, language: AppLanguage): string {
  if (language === 'pl') return fallbackTitle;
  return LEVEL_TITLES_EN[level] || fallbackTitle;
}

export function formatMinutesLabel(minutes: number, language: AppLanguage): string {
  return language === 'en' ? `${minutes} min` : `${minutes} min`;
}

export function formatDaysLabel(days: number, language: AppLanguage): string {
  if (language === 'en') {
    return days === 1 ? '1 day' : `${days} days`;
  }
  return days === 1 ? '1 dzień' : `${days} dni`;
}
