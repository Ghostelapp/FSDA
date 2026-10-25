import React, { useState } from 'react';
import { Smartphone, Download, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';
import { AndroidPlayStoreModal } from './AndroidPlayStoreModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { currentUser, isAuthenticated } = useApp();
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdmin = isAuthenticated && currentUser.role === 'admin';

  // Non-admin users (guests and regular students) NEVER see the Google Play Store Release Center or keystore modal.
  // They only see a standard browser PWA install prompt button when supported by the browser.
  if (!isAdmin) {
    if (isInstalled || !isInstallable) {
      return null;
    }

    return (
      <button
        type="button"
        onClick={() => install()}
        title="Zainstaluj aplikację na urządzeniu"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/60 hover:bg-indigo-900/80 text-white text-xs font-bold transition-all ${className}`}
      >
        <Download className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
        <span>Zainstaluj aplikację</span>
      </button>
    );
  }

  // Administrator-only button to open the Google Play Store Release Center (APK / AAB / Keystore)
  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        title="Centrum Publikacji Google Play (Tylko Administrator)"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/40 bg-gradient-to-r from-rose-950/70 to-indigo-950/70 hover:from-rose-900/80 hover:to-indigo-900/80 text-white text-xs font-bold transition-all shadow-sm shadow-rose-500/20 active:scale-95 ${className}`}
      >
        <ShieldCheck className="h-3.5 w-3.5 text-rose-400 shrink-0" />
        <Smartphone className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
        {variant === 'full' ? (
          <span>Google Play / APK (Admin)</span>
        ) : (
          <span>Play Store (Admin)</span>
        )}
      </button>

      <AndroidPlayStoreModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
