import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { checkProtectedRouteAccess, isGuestUser } from '../utils/authValidation';
import { ShieldAlert, Lock, LogIn, ArrowLeft, UserCheck } from 'lucide-react';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  allowGuests?: boolean;
  onOpenAuthModal?: () => void;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'admin',
  allowGuests = false,
  onOpenAuthModal,
  fallbackTitle,
  fallbackMessage,
}) => {
  const { currentUser, isAuthenticated, setActiveTab } = useApp();

  const access = checkProtectedRouteAccess(currentUser, isAuthenticated, {
    requiredRole,
    allowGuests,
  });

  if (access.allowed) {
    return <>{children}</>;
  }

  const isGuest = isGuestUser(currentUser, isAuthenticated);
  const handleTriggerLogin = () => {
    if (onOpenAuthModal) {
      onOpenAuthModal();
    } else {
      window.dispatchEvent(new CustomEvent('akademia:open-auth-modal'));
    }
  };

  return (
    <section
      data-testid="protected-route-guard"
      role="region"
      aria-label="Zabezpieczenie dostępu ProtectedRoute"
      className="mx-auto max-w-2xl px-4 py-14 sm:py-20"
    >
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Icon & Security Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${
              access.reason === 'guest_blocked'
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
            }`}
          >
            {access.reason === 'guest_blocked' ? (
              <Lock className="h-8 w-8" />
            ) : (
              <ShieldAlert className="h-8 w-8" />
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ochrona Trasy · ProtectedRoute
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {fallbackTitle || access.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {fallbackMessage || access.message}
            </p>
          </div>
        </div>

        {/* Clean Unboxed Diagnostic Metadata */}
        <div className="border-y border-slate-800/80 py-3.5 px-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
          <span>
            Status sesji:{' '}
            <strong className={isGuest ? 'text-amber-300 font-semibold' : 'text-emerald-300 font-semibold'}>
              {isGuest ? 'Gość (Zablokowany)' : 'Zalogowany użytkownik'}
            </strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Konto:{' '}
            <strong className="text-slate-200 font-semibold">
              {currentUser?.name || 'Gość'}
            </strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Aktualna rola:{' '}
            <strong className="text-slate-200 font-semibold">
              {isGuest ? 'Gość (Brak uprawnień)' : currentUser?.role === 'admin' ? 'Administrator' : 'Kursant'}
            </strong>
          </span>
          {requiredRole && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                Wymagana rola:{' '}
                <strong className="text-rose-300 font-semibold">
                  {requiredRole === 'admin' ? 'Administrator' : 'Kursant'}
                </strong>
              </span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          {access.reason === 'guest_blocked' ? (
            <>
              <button
                type="button"
                onClick={handleTriggerLogin}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-lg shadow-indigo-600/20"
              >
                <LogIn className="h-4 w-4" />
                <span>Zaloguj się / Utwórz konto</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Powrót do Pulpitu Kursanta</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-lg shadow-indigo-600/20"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Powrót do Pulpitu Kursanta</span>
              </button>
              <button
                type="button"
                onClick={handleTriggerLogin}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
              >
                <UserCheck className="h-4 w-4 text-indigo-400" />
                <span>Autoryzacja Administratora (Google OAuth)</span>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
