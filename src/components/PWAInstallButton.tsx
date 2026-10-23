import React, { useState } from 'react';
import { Smartphone, Download, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { AndroidPlayStoreModal } from './AndroidPlayStoreModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If already running inside installed standalone app, optionally show a subtle badge or button to open Android Play Store info
  if (isInstalled) {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          title="Aplikacja zainstalowana — Zobacz opcje Google Play"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-950/50 transition-colors ${className}`}
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="hidden sm:inline">PWA Aktywne</span>
        </button>
        <AndroidPlayStoreModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        title="Centrum Publikacji Google Play / Pobierz Pakiet"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/40 bg-gradient-to-r from-indigo-900/60 to-cyan-950/60 hover:from-indigo-800/80 hover:to-cyan-900/80 text-white text-xs font-bold transition-all shadow-sm shadow-indigo-500/20 active:scale-95 ${className}`}
      >
        <Smartphone className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
        {variant === 'full' ? (
          <span>Pobierz Aplikację / Sklep Play</span>
        ) : (
          <span>App / Play Store</span>
        )}
      </button>

      <AndroidPlayStoreModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
