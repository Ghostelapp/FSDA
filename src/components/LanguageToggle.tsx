import React from 'react';
import { Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { AppLanguage } from '../utils/i18n';

interface LanguageToggleProps {
  variant?: 'compact' | 'labeled';
  className?: string;
}

const LANGUAGE_OPTIONS: Array<{
  value: AppLanguage;
  shortLabel: string;
  fullLabel: string;
  ariaLabelPl: string;
  ariaLabelEn: string;
}> = [
  {
    value: 'pl',
    shortLabel: 'PL',
    fullLabel: 'Polski (PL)',
    ariaLabelPl: 'Język polski',
    ariaLabelEn: 'Polish language',
  },
  {
    value: 'en',
    shortLabel: 'EN',
    fullLabel: 'English (EN)',
    ariaLabelPl: 'Język angielski',
    ariaLabelEn: 'English language',
  },
];

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { language, setLanguage, theme } = useApp();
  const isEn = language === 'en';

  if (variant === 'labeled') {
    return (
      <div
        role="radiogroup"
        aria-label={isEn ? 'Choose interface language' : 'Wybierz język interfejsu'}
        data-testid="language-toggle-labeled"
        className={`grid grid-cols-2 gap-1.5 rounded-xl border p-1 ${
          theme === 'light'
            ? 'border-slate-300 bg-slate-200/75'
            : 'border-slate-800 bg-slate-950/80'
        } ${className}`}
      >
        {LANGUAGE_OPTIONS.map((opt) => {
          const isSelected = language === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={isEn ? opt.ariaLabelEn : opt.ariaLabelPl}
              data-testid={`lang-option-${opt.value}`}
              onClick={() => setLanguage(opt.value)}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : theme === 'light'
                  ? 'text-slate-700 hover:bg-white hover:text-slate-950'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Globe className="h-3.5 w-3.5 shrink-0" />
              <span>{opt.fullLabel}</span>
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
      aria-label={isEn ? 'Platform language' : 'Język platformy'}
      data-testid="language-toggle"
      className={`fsda-lang-switcher ${hasDisplayOverride ? '' : 'inline-flex'} items-center gap-0.5 rounded-xl border p-0.5 shrink-0 ${
        theme === 'light'
          ? 'border-slate-300 bg-slate-100'
          : 'border-slate-800 bg-slate-900/90'
      } ${className}`}
    >
      {LANGUAGE_OPTIONS.map((opt) => {
        const isSelected = language === opt.value;
        const label = isEn ? opt.ariaLabelEn : opt.ariaLabelPl;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={label}
            title={label}
            data-testid={`lang-toggle-${opt.value}`}
            onClick={() => setLanguage(opt.value)}
            className={`inline-flex items-center justify-center rounded-lg px-2 py-1 text-[11px] font-bold tracking-wide transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-sm'
                : theme === 'light'
                ? 'text-slate-600 hover:bg-white hover:text-slate-900'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            {opt.shortLabel}
          </button>
        );
      })}
    </div>
  );
};
