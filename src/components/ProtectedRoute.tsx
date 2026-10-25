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
  const { currentUser, isAuthenticated, isSyncingCloud, loginWithGoogle, setActiveTab } = useApp();

  const access = checkProtectedRouteAccess(currentUser, isAuthenticated, {
    requiredRole,
    allowGuests,
  });

  if (access.allowed) {
    return <>{children}</>;
  }

  const isGuest = isGuestUser(currentUser, isAuthenticated);
  const isStudentAuthGate = requiredRole === 'student' && access.reason === 'guest_blocked';

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
      className="mx-auto max-w-2xl px-4 py-12 sm:py-16"
    >
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Icon & Security Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${
              isStudentAuthGate
                ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                : access.reason === 'guest_blocked'
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
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              {isStudentAuthGate ? 'Strefa Kursanta · Wymagane Logowanie' : 'Ochrona Trasy · ProtectedRoute'}
            </p>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              {fallbackTitle || (isStudentAuthGate ? 'Zaloguj się, aby rozpocząć naukę' : access.title)}
            </h1>
            <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {fallbackMessage ||
                (isStudentAuthGate
                  ? 'Dostęp do 15 modułów kursu, 91 interaktywnych lekcji, edytora kodu oraz projektów jest dostępny wyłącznie dla zalogowanych użytkowników. Zaloguj się kontem Google lub utwórz darmowe konto e-mail.'
                  : access.message)}
            </p>
          </div>
        </div>

        {/* Clean Unboxed Diagnostic Metadata */}
        <div className="border-y border-slate-800/80 py-3.5 px-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
          <span>
            Status sesji:{' '}
            <strong className={isGuest ? 'text-amber-300 font-semibold' : 'text-emerald-300 font-semibold'}>
              {isGuest ? 'Niezalogowany (Wymagane konto)' : 'Zalogowany użytkownik'}
            </strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Dostęp do nauki:{' '}
            <strong className="text-slate-200 font-semibold">
              Tylko dla zalogowanych kursantów
            </strong>
          </span>
          {requiredRole === 'admin' && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                Wymagana rola:{' '}
                <strong className="text-rose-300 font-semibold">Administrator</strong>
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
                onClick={() => void loginWithGoogle()}
                disabled={isSyncingCloud}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold transition-colors shadow-lg cursor-pointer disabled:opacity-60"
              >
                <UserCheck className="h-4 w-4 text-indigo-600" />
                <span>{isSyncingCloud ? 'Łączenie z Google...' : 'Zaloguj przez Google'}</span>
              </button>
              <button
                type="button"
                onClick={handleTriggerLogin}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold transition-colors shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span>Zaloguj się e-mailem / Załóż konto</span>
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
