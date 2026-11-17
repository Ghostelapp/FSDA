import React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ThemePreference } from '../utils/theme';

interface ThemeToggleProps {
  variant?: 'compact' | 'labeled';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { theme, themePreference, setThemePreference, language } = useApp();
  const isEn = language === 'en';

  const options: Array<{
    value: ThemePreference;
    label: string;
    ariaLabel: string;
    Icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      value: 'dark',
      label: isEn ? 'Dark' : 'Ciemny',
      ariaLabel: isEn ? 'Dark theme' : 'Motyw ciemny',
      Icon: Moon,
    },
    {
      value: 'light',
      label: isEn ? 'Light' : 'Jasny',
      ariaLabel: isEn ? 'Light theme' : 'Motyw jasny',
      Icon: Sun,
    },
    {
      value: 'system',
      label: 'System',
      ariaLabel: isEn ? 'System theme' : 'Motyw systemowy',
      Icon: Monitor,
    },
  ];

  if (variant === 'labeled') {
    return (
      <div
        role="radiogroup"
        aria-label={isEn ? 'Select platform color mode' : 'Wybierz tryb kolorystyczny platformy'}
        data-testid="theme-toggle-labeled"
        className={`grid grid-cols-3 gap-1.5 rounded-xl border p-1 ${
          theme === 'light'
            ? 'border-slate-300 bg-slate-200/75'
            : 'border-slate-800 bg-slate-950/80'
        } ${className}`}
      >
        {options.map(({ value, label, ariaLabel, Icon }) => {
          const isSelected = themePreference === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={ariaLabel}
              onClick={() => setThemePreference(value)}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : theme === 'light'
                  ? 'text-slate-700 hover:bg-white hover:text-slate-950'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  const hasDisplayOverride = /\b(?:hidden|block|flex|inline-flex|grid)\b/.test(className);

  return (
    <div
      role="radiogroup"
      aria-label={isEn ? 'Platform color mode' : 'Tryb kolorystyczny platformy'}
      data-testid="theme-toggle"
      className={`fsda-theme-switcher ${hasDisplayOverride ? '' : 'inline-flex'} items-center gap-0.5 rounded-xl border p-0.5 shrink-0 ${
        theme === 'light'
          ? 'border-slate-300 bg-slate-100'
          : 'border-slate-800 bg-slate-900/90'
      } ${className}`}
    >
      {options.map(({ value, ariaLabel, Icon }) => {
        const isSelected = themePreference === value;
        const activeTitle =
          value === 'system'
            ? isEn
              ? `System theme (current: ${theme === 'dark' ? 'dark' : 'light'})`
              : `Motyw systemowy (aktualnie: ${theme === 'dark' ? 'ciemny' : 'jasny'})`
            : ariaLabel;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={ariaLabel}
            title={activeTitle}
            onClick={() => setThemePreference(value)}
            className={`inline-flex items-center justify-center rounded-lg p-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-sm'
                : theme === 'light'
                ? 'text-slate-600 hover:bg-white hover:text-slate-900'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
          </button>
        );
      })}
    </div>
  );
};
