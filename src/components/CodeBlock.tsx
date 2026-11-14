import React from 'react';
import { Terminal, Code as CodeIcon } from 'lucide-react';
import { highlightCode, getLanguageDisplayName } from '../utils/syntaxHighlighter';
import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  className?: string;
  maxHeightClass?: string;
  badge?: string;
  badgeColor?: 'emerald' | 'rose' | 'indigo' | 'amber';
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  title,
  showLineNumbers = true,
  highlightLines = [],
  className = '',
  maxHeightClass = '',
  badge,
  badgeColor = 'indigo',
}) => {
  const highlightedHtml = highlightCode(code, language);
  const lines = code.split('\n');

  const badgeColorClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  }[badgeColor];

  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl ${className}`}>
      {/* Code Header Bar with Top-Right Copy Button */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-900/90 px-4 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          {language === 'bash' || language === 'sh' ? (
            <Terminal className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <CodeIcon className="h-4 w-4 text-indigo-400 shrink-0" />
          )}
          <span className="text-xs font-semibold text-slate-200 truncate">
            {title || getLanguageDisplayName(language)}
          </span>
          {badge && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${badgeColorClasses}`}>
              {badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline tabular-nums">
            {lines.length} {lines.length === 1 ? 'linia' : lines.length < 5 ? 'linie' : 'linii'}
          </span>
          <CopyButton text={code} />
        </div>
      </div>

      {/* Code Body with Synchronized Line Numbers & Syntax Highlighting */}
      <div className={`relative flex font-mono text-xs leading-relaxed overflow-auto bg-slate-950/95 min-w-0 max-w-full ${maxHeightClass}`}>
        {showLineNumbers && (
          <div
            aria-hidden="true"
            className="select-none py-3 px-3 text-right text-slate-600 bg-slate-950/90 border-r border-slate-800/70 shrink-0 font-mono text-xs leading-relaxed tabular-nums"
          >
            {lines.map((_, i) => {
              const lineNum = i + 1;
              const isHighlighted = highlightLines.includes(lineNum);
              return (
                <div
                  key={i}
                  className={isHighlighted ? 'text-amber-400 font-bold bg-amber-500/10 -mx-3 px-3' : ''}
                >
                  {lineNum}
                </div>
              );
            })}
          </div>
        )}

        <pre className="p-3 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed whitespace-pre flex-1 min-w-0 m-0">
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      </div>
    </div>
  );
};
