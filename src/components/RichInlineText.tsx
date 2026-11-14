import React from 'react';
import { InlineToken, parseInlineTokens } from '../utils/lessonReadability';

interface RichInlineTextProps {
  text: string;
  className?: string;
}

const CATEGORY_BADGE_STYLES: Record<'html' | 'css' | 'cli' | 'js' | 'general', string> = {
  html: 'border-orange-500/45 bg-orange-950/65 text-orange-200 font-semibold',
  css: 'border-cyan-500/40 bg-cyan-950/60 text-cyan-200 font-medium',
  js: 'border-amber-500/35 bg-amber-950/55 text-amber-200 font-medium',
  cli: 'border-emerald-500/40 bg-emerald-950/60 text-emerald-200 font-medium',
  general: 'border-sky-500/30 bg-slate-800/95 text-sky-200 font-medium',
};

export const renderInlineTokens = (tokens: InlineToken[]) => {
  return tokens.map((token, idx) => {
    if (token.type === 'code') {
      const styleClass = CATEGORY_BADGE_STYLES[token.category] || CATEGORY_BADGE_STYLES.general;
      const layoutClass =
        token.content.length <= 28
          ? 'inline-block whitespace-nowrap'
          : 'inline box-decoration-clone';
      return (
        <code
          key={idx}
          className={`mx-0.5 ${layoutClass} rounded-md border px-1.5 py-0.5 font-mono text-[0.86em] leading-none align-baseline ${styleClass}`}
        >
          {token.content}
        </code>
      );
    }
    if (token.type === 'bold') {
      return (
        <strong key={idx} className="font-semibold text-white">
          {token.content}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{token.content}</React.Fragment>;
  });
};

/**
 * Automatically highlights HTML tags (<input>, </form>, <button>...</button>),
 * CSS rules/pseudo-classes, CLI commands, JS calls, and backticked code across
 * all lesson titles, summaries, descriptions, tasks, hints, and quiz questions.
 */
export const RichInlineText: React.FC<RichInlineTextProps> = ({ text, className }) => {
  if (!text) return null;
  const tokens = parseInlineTokens(text);
  return <span className={className}>{renderInlineTokens(tokens)}</span>;
};
