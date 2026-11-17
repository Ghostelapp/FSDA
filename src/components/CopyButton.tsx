import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label,
  copiedLabel,
  className = '',
}) => {
  const { language } = useApp();
  const isEn = language === 'en';
  const resolvedLabel = label ?? (isEn ? 'Copy' : 'Kopiuj');
  const resolvedCopiedLabel = copiedLabel ?? (isEn ? 'Copied' : 'Skopiowano');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(textarea);
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={isEn ? 'Copy code to clipboard' : 'Kopiuj kod do schowka'}
      title={isEn ? 'Copy code to clipboard' : 'Kopiuj kod do schowka'}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
        copied
          ? 'border-emerald-500/40 bg-emerald-950/70 text-emerald-300'
          : 'border-slate-700/70 bg-slate-800/85 text-slate-300 hover:bg-slate-800 hover:text-white'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>{resolvedCopiedLabel}</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 shrink-0" />
          <span>{resolvedLabel}</span>
        </>
      )}
    </button>
  );
};
