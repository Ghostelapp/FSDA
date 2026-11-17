export type ThemePreference = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'fsda_theme_v5';

export const THEME_PREFERENCE_LABELS: Record<ThemePreference, string> = {
  dark: 'Ciemny',
  light: 'Jasny',
  system: 'Systemowy',
};

export function parseThemePreference(raw: string | null | undefined): ThemePreference {
  if (raw === 'dark' || raw === 'light' || raw === 'system') {
    return raw;
  }
  return 'dark';
}

export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean
): ResolvedTheme {
  if (preference === 'system') {
    return systemPrefersDark ? 'dark' : 'light';
  }
  return preference;
}

export function getNextThemePreference(current: ThemePreference): ThemePreference {
  if (current === 'dark') return 'light';
  if (current === 'light') return 'system';
  return 'dark';
}
