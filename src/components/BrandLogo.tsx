import React from 'react';
import { Code2 } from 'lucide-react';

interface BrandLogoProps {
  compact?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false }) => {
  return (
    <span className="inline-flex items-center gap-2 sm:gap-2.5 text-left">
      <span
        aria-hidden="true"
        className={`flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20 shrink-0 ${
          compact ? 'h-8 w-8 sm:h-9 sm:w-9' : 'h-9 w-9 sm:h-10 sm:w-10'
        }`}
      >
        <Code2 className={compact ? 'h-4 w-4' : 'h-4 w-4 sm:h-5 sm:w-5'} />
      </span>
      <span>
        <span className="block text-sm sm:text-base font-bold tracking-tight text-white leading-none">
          Full Stack{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Academy
          </span>
        </span>
        <span className="hidden sm:block text-[10px] font-medium uppercase tracking-wider text-slate-400 mt-1">
          Akademia Programowania
        </span>
      </span>
    </span>
  );
};
