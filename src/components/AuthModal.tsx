import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  getLocalizedAntiBotChallengeById,
  getRandomAntiBotChallenge,
  verifyAntiBotSubmission,
  AntiBotChallenge,
} from '../utils/antiBot';
import {
  AuthModalMode,
  GoogleAuthErrorClassification,
  getPasswordStrength,
  validateEmailFormat,
} from '../utils/authValidation';
import { activeFirebaseConfig } from '../firebase';
import { GithubSyncCard } from './GithubSyncCard';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  ShieldCheck,
  ShieldAlert,
  Bot,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  RefreshCw,
  KeyRound,
  LogOut,
  Settings,
  Save,
  Cloud,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthModalMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode }) => {
  const {
    language,
    currentUser,
    isAuthenticated,
    isCloudConnected,
    isSyncingCloud,
    loginUser,
    loginWithGoogle,
    syncNowToCloud,
    registerUser,
    updateCurrentUserProfile,
    resetUserPassword,
    logout,
  } = useApp();
  const isEn = language === 'en';

  const [mode, setMode] = useState<AuthModalMode>(() =>
    initialMode ?? (isAuthenticated ? 'profile' : 'login')
  );
  const wasOpenRef = React.useRef(false);

  // Form fields (Login / Register / Forgot)
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('akademia2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [bio, setBio] = useState('');

  // Profile Edit Fields
  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileNewPassword, setProfileNewPassword] = useState('');
  const [profileWeeklyGoal, setProfileWeeklyGoal] = useState(180);

  // Anti-Bot Protection Fields
  const [challenge, setChallenge] = useState<AntiBotChallenge>(() => getRandomAntiBotChallenge(language));
  const [antiBotAnswer, setAntiBotAnswer] = useState('');
  const [honeypotValue, setHoneypotValue] = useState('');
  const [sliderProgress, setSliderProgress] = useState(0);
  const [formOpenTime, setFormOpenTime] = useState<number>(Date.now());
  const [isHumanConfirmed, setIsHumanConfirmed] = useState(false);

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [googleAuthIssue, setGoogleAuthIssue] = useState<GoogleAuthErrorClassification | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Reset form timer when modal opens or mode changes
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setMode(initialMode ?? (isAuthenticated ? 'profile' : 'login'));
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, initialMode, isAuthenticated]);

  useEffect(() => {
    if (isOpen) {
      setFormOpenTime(Date.now());
      setChallenge(getRandomAntiBotChallenge(language));
      setAntiBotAnswer('');
      setSliderProgress(0);
      setIsHumanConfirmed(false);
      setErrorMessage('');
      setGoogleAuthIssue(null);
      setSuccessMessage('');
      setProfileName(currentUser.name);
      setProfileBio(currentUser.bio || '');
      setProfileNewPassword('');
      setProfileWeeklyGoal(currentUser.weeklyGoalMinutes || 180);
    }
  }, [isOpen, mode, currentUser.name, currentUser.bio, currentUser.weeklyGoalMinutes, language]);

  if (!isOpen) return null;

  const activeChallenge = getLocalizedAntiBotChallengeById(challenge.id, language) || challenge;
  const passwordStrength = getPasswordStrength(password, language);

  const handleRefreshChallenge = () => {
    setChallenge(getRandomAntiBotChallenge(language));
    setAntiBotAnswer('');
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderProgress(val);
    if (val >= 95) {
      setIsHumanConfirmed(true);
    } else {
      setIsHumanConfirmed(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setGoogleAuthIssue(null);
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage(
        isEn
          ? 'Enter both your email address and password.'
          : 'Wprowadź adres e-mail oraz hasło dostępowe.'
      );
      return;
    }

    const res = loginUser(email.trim(), password);
    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || (isEn ? 'Sign-in error.' : 'Błąd logowania.'));
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setGoogleAuthIssue(null);
    setSuccessMessage('');
    const res = await loginWithGoogle();
    if (res.success) {
      onClose();
    } else {
      if (res.classification) {
        setGoogleAuthIssue(res.classification);
      }
      if (res.error) {
        setErrorMessage(res.error);
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage(
        isEn ? 'Fill in all required form fields.' : 'Wypełnij wszystkie wymagane pola formularza.'
      );
      return;
    }

    if (name.trim().length < 2) {
      setErrorMessage(
        isEn
          ? 'Full name must be at least 2 characters long.'
          : 'Imię i nazwisko musi zawierać co najmniej 2 znaki.'
      );
      return;
    }

    if (!validateEmailFormat(email)) {
      setErrorMessage(
        isEn
          ? 'Enter a valid email address (e.g., name@domain.com).'
          : 'Podaj poprawny adres e-mail (np. imie@domena.pl).'
      );
      return;
    }

    if (password.length < 6) {
      setErrorMessage(
        isEn
          ? 'Password must be at least 6 characters long.'
          : 'Hasło musi mieć co najmniej 6 znaków.'
      );
      return;
    }

    // Run Anti-Bot heuristic check
    const timeSpentMs = Date.now() - formOpenTime;
    const botCheck = verifyAntiBotSubmission({
      challengeId: activeChallenge.id,
      userAnswer: antiBotAnswer,
      honeypotValue,
      sliderProgress,
      timeSpentMs,
      language,
    });

    if (!botCheck.isHuman) {
      setErrorMessage(
        isEn
          ? `Anti-Bot Protection: ${botCheck.reason || 'Human verification failed.'}`
          : `Ochrona Anty-Bot: ${botCheck.reason || 'Weryfikacja tożsamości nie powiodła się.'}`
      );
      return;
    }

    const res = registerUser({
      name: name.trim(),
      email: email.trim(),
      password,
      role: 'student',
      antiBotPassed: botCheck.isHuman,
      antiBotScore: botCheck.score,
      bio: bio.trim(),
    });

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(
        res.error ||
          (isEn ? 'Could not register the user account.' : 'Nie udało się zarejestrować użytkownika.')
      );
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage(
        isEn ? 'Enter the email address associated with your account.' : 'Podaj adres e-mail powiązany z kontem.'
      );
      return;
    }

    if (!validateEmailFormat(email)) {
      setErrorMessage(
        isEn ? 'Enter a valid email address format.' : 'Podaj poprawny format adresu e-mail.'
      );
      return;
    }

    const targetPass = newResetPassword.trim() || 'akademia2026!';
    if (targetPass.length < 6) {
      setErrorMessage(
        isEn
          ? 'The new password must be at least 6 characters long.'
          : 'Nowe hasło musi zawierać co najmniej 6 znaków.'
      );
      return;
    }

    const res = resetUserPassword(email.trim(), targetPass);
    if (res.success) {
      setSuccessMessage(res.message);
      setPassword(targetPass);
      setTimeout(() => {
        setMode('login');
      }, 2000);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const res = updateCurrentUserProfile({
      name: profileName,
      bio: profileBio,
      password: profileNewPassword.trim() ? profileNewPassword : undefined,
      weeklyGoalMinutes: profileWeeklyGoal,
    });

    if (res.success) {
      setSuccessMessage(res.message);
      setProfileNewPassword('');
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleLogoutClick = () => {
    logout();
    setErrorMessage('');
    setSuccessMessage(
      isEn
        ? 'Signed out of your account. You can sign in to another account below.'
        : 'Wylogowano z konta. Możesz zalogować się na inne konto poniżej.'
    );
    setMode('login');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className={`w-full ${mode === 'profile' ? 'max-w-xl' : 'max-w-lg'} rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 shrink-0">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-base sm:text-lg font-bold text-white leading-tight">
                {mode === 'login' && (isEn ? 'Sign In to the Academy' : 'Logowanie do Akademii')}
                {mode === 'register' &&
                  (isEn ? 'Register with Anti-Bot Shield' : 'Rejestracja z Ochroną Anty-Bot')}
                {mode === 'forgot' &&
                  (isEn ? 'Account Recovery & Password Reset' : 'Odzyskiwanie i Reset Hasła')}
                {mode === 'profile' &&
                  (isEn ? 'Account & Profile Settings' : 'Ustawienia Konta i Profilu')}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {mode === 'login' &&
                  (isEn
                    ? 'Sign in with Google Firebase Cloud or your email address.'
                    : 'Zaloguj się przez Chmurę Google Firebase lub adresem e-mail.')}
                {mode === 'register' &&
                  (isEn
                    ? 'Fill in your details and verify that you are human.'
                    : 'Wypełnij dane i potwierdź tożsamość człowieka.')}
                {mode === 'forgot' &&
                  (isEn
                    ? 'Set a new access password for your account.'
                    : 'Ustaw nowe hasło dostępowe dla swojego konta.')}
                {mode === 'profile' &&
                  (isEn
                    ? 'Manage your profile details, password, and active session.'
                    : 'Zarządzaj swoimi danymi, hasłem i aktywną sesją.')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? 'Close authentication dialog' : 'Zamknij okno autoryzacji'}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Active Session Status Bar */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-slate-800/80 bg-slate-950/90 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`h-2 w-2 rounded-full shrink-0 ${
                isAuthenticated ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span className="text-slate-400 truncate">
              {isEn ? 'Session:' : 'Sesja:'}{' '}
              <strong className="text-white font-semibold">
                {isAuthenticated
                  ? currentUser.name
                  : isEn
                  ? 'Guest (Not signed in)'
                  : 'Gość (Niezalogowany)'}
              </strong>
            </span>
            {isCloudConnected && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold shrink-0">
                <Cloud className="h-3 w-3" />
                {isSyncingCloud ? 'Sync...' : 'Firestore'}
              </span>
            )}
          </div>
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 shrink-0">
              {isCloudConnected && (
                <button
                  type="button"
                  onClick={() => void syncNowToCloud()}
                  disabled={isSyncingCloud}
                  title={
                    isEn
                      ? 'Force immediate progress sync to Cloud Firestore'
                      : 'Wymuś natychmiastowy zapis postępów do Cloud Firestore'
                  }
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold transition-colors"
                >
                  <Cloud className="h-3 w-3" />
                  <span className="hidden sm:inline">
                    {isEn ? 'Save to Cloud' : 'Zapisz w Chmurze'}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setMode('profile');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  mode === 'profile'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <Settings className="h-3 w-3" />
                <span>{isEn ? 'Profile' : 'Profil'}</span>
              </button>
              <button
                type="button"
                onClick={handleLogoutClick}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-[11px] font-semibold transition-colors"
              >
                <LogOut className="h-3 w-3" />
                <span>{isEn ? 'Sign Out' : 'Wyloguj'}</span>
              </button>
            </div>
          ) : (
            <span className="text-[11px] text-amber-400 font-medium shrink-0">
              {isEn ? 'Guest Mode' : 'Tryb Gościa'}
            </span>
          )}
        </div>

        {/* Scrollable Container */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                mode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isEn ? 'Sign In' : 'Logowanie'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">
                {isEn ? 'Register (Anti-Bot)' : 'Rejestracja (Anty-Bot)'}
              </span>
              <span className="sm:hidden">{isEn ? 'Register' : 'Rejestracja'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('forgot');
                setErrorMessage('');
              }}
              className={`py-2 px-3 rounded-xl transition-all ${
                mode === 'forgot' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isEn ? 'Reset password' : 'Reset hasła'}
            </button>
          </div>

          {/* Firebase Cloud Google Sign-In Banner */}
          {mode !== 'profile' && (
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/25 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Cloud className="h-4 w-4 text-cyan-400" />
                  <span>
                    {isEn
                      ? 'Firebase Auth & Cloud Firestore Sync'
                      : 'Chmura Firebase Auth & Cloud Firestore'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {isEn
                    ? 'Sign in with Google to sync XP, badges, hearts, and code in real time across devices.'
                    : 'Zaloguj się kontem Google, aby synchronizować XP, odznaki, serca i kod w czasie rzeczywistym między urządzeniami.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleGoogleLogin()}
                disabled={isSyncingCloud}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-60"
              >
                <Cloud className="h-4 w-4 text-indigo-600" />
                <span>
                  {isSyncingCloud
                    ? isEn
                      ? 'Connecting...'
                      : 'Łączenie...'
                    : isEn
                    ? 'Sign in with Google'
                    : 'Zaloguj przez Google'}
                </span>
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {(errorMessage || googleAuthIssue) && (
            <div
              role="alert"
              className={`p-3.5 rounded-2xl text-xs space-y-2.5 animate-in slide-in-from-top-1 border ${
                googleAuthIssue?.isDomainConfigIssue
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-100'
                  : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <ShieldAlert
                  className={`h-4 w-4 shrink-0 mt-0.5 ${
                    googleAuthIssue?.isDomainConfigIssue ? 'text-amber-400' : 'text-rose-400'
                  }`}
                />
                <div className="flex-1 space-y-1 leading-relaxed">
                  {googleAuthIssue && (
                    <p className="font-bold text-white">{googleAuthIssue.userTitle}</p>
                  )}
                  <p>{googleAuthIssue ? googleAuthIssue.userMessage : errorMessage}</p>
                </div>
              </div>

              {googleAuthIssue?.recommendEmailAuth && mode !== 'register' && (
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
                  <span className="text-[11px] text-slate-300">
                    {isEn ? 'Create an instant email account instead:' : 'Załóż darmowe konto e-mail poniżej:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage('');
                      setGoogleAuthIssue(null);
                    }}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
                  >
                    {isEn ? 'Register free →' : 'Rejestracja e-mail →'}
                  </button>
                </div>
              )}

              {googleAuthIssue?.isDomainConfigIssue && (
                <details className="rounded-xl bg-slate-950/90 border border-slate-800 px-3 py-2 text-[11px] text-slate-300">
                  <summary className="cursor-pointer font-semibold text-slate-300 hover:text-white select-none">
                    {isEn
                      ? 'Owner guide: Add this domain in Firebase Console'
                      : 'Dla właściciela domeny: jak odblokować Google OAuth'}
                  </summary>
                  <div className="mt-2 space-y-2 pt-2 border-t border-slate-800/80">
                    <ol className="list-decimal list-inside space-y-1 text-slate-300">
                      <li>
                        {isEn ? 'Open ' : 'Otwórz '}
                        <a
                          href={`https://console.firebase.google.com/project/${activeFirebaseConfig.projectId}/authentication/settings`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 underline font-semibold"
                        >
                          Firebase Console ({activeFirebaseConfig.projectId}) → Authentication → Settings → Authorized domains
                        </a>
                      </li>
                      <li>
                        {isEn ? (
                          <>
                            Click <strong>Add domain</strong> and add these hostnames:
                          </>
                        ) : (
                          <>
                            Kliknij <strong>Add domain</strong> i dodaj poniższe domeny:
                          </>
                        )}
                      </li>
                    </ol>
                    <div className="space-y-1.5">
                      {googleAuthIssue.recommendedDomains.map((domainHost) => (
                        <div
                          key={domainHost}
                          className="flex items-center justify-between gap-2 rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1.5 font-mono text-[11px] text-emerald-300"
                        >
                          <span className="truncate">{domainHost}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (navigator.clipboard) {
                                void navigator.clipboard.writeText(domainHost);
                                setSuccessMessage(
                                  isEn ? `Copied domain: ${domainHost}` : `Skopiowano domenę: ${domainHost}`
                                );
                              }
                            }}
                            className="shrink-0 px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-semibold text-[10px] cursor-pointer"
                          >
                            {isEn ? 'Copy' : 'Kopiuj'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              )}
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-200 flex items-start gap-2.5 animate-in slide-in-from-top-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{successMessage}</div>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="login-email" className="text-xs font-semibold text-slate-300 block">
                  {isEn ? 'Email Address:' : 'Adres E-mail:'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isEn ? 'you@example.com' : 'twoj@email.pl'}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-pass" className="text-xs font-semibold text-slate-300 block">
                    {isEn ? 'Password:' : 'Hasło dostępowe:'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage('');
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300"
                  >
                    {isEn ? 'Forgot password?' : 'Nie pamiętasz hasła?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="login-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-10 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 text-xs font-bold transition-all shadow-md shadow-indigo-900/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isEn ? 'Sign In' : 'Zaloguj się'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <p className="text-center text-xs text-slate-400 pt-1">
                {isEn ? "Don't have an account yet?" : 'Nie masz jeszcze konta?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                    setGoogleAuthIssue(null);
                  }}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-2 cursor-pointer"
                >
                  {isEn ? 'Create a free account →' : 'Załóż darmowe konto →'}
                </button>
              </p>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Invisible Honeypot Trap Field */}
              <div
                aria-hidden="true"
                className="sr-only pointer-events-none opacity-0 h-0 w-0 overflow-hidden"
              >
                <label htmlFor="bot_trap_field">Do not fill this</label>
                <input
                  id="bot_trap_field"
                  type="text"
                  tabIndex={-1}
                  value={honeypotValue}
                  onChange={(e) => setHoneypotValue(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="reg-name" className="text-xs font-semibold text-slate-300 block">
                    {isEn ? 'Full name:' : 'Imię i nazwisko:'}
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      id="reg-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isEn ? 'e.g. Alex Morgan' : 'np. Piotr Wiśniewski'}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-300 block">
                    {isEn ? 'Account type:' : 'Typ rejestrowanego konta:'}
                  </span>
                  <div className="w-full rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2 text-xs text-indigo-300 font-semibold flex items-center justify-between">
                    <span>{isEn ? 'Student Account' : 'Kursant (Student)'}</span>
                    <span className="text-[10px] text-slate-500 font-normal">Standard</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="reg-email" className="text-xs font-semibold text-slate-300 block">
                  {isEn ? 'Email Address:' : 'Adres E-mail:'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isEn ? 'your.email@domain.com' : 'twoj.email@domena.pl'}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="reg-pass" className="text-xs font-semibold text-slate-300 block">
                  {isEn ? 'Password:' : 'Hasło dostępowe:'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="reg-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isEn ? 'Minimum 6 characters' : 'Minimum 6 znaków'}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-10 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password && (
                  <div className="pt-1 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1">
                      <div
                        className={`h-full flex-1 rounded-full ${
                          passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-800'
                        }`}
                      />
                      <div
                        className={`h-full flex-1 rounded-full ${
                          passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-800'
                        }`}
                      />
                      <div
                        className={`h-full flex-1 rounded-full ${
                          passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-800'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="reg-bio" className="text-xs font-semibold text-slate-300 block">
                  {isEn ? 'Short bio / Learning goal (optional):' : 'Krótki opis / Cel nauki (opcjonalnie):'}
                </label>
                <input
                  id="reg-bio"
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={
                    isEn
                      ? 'e.g. Becoming a Junior React & Node.js Developer'
                      : 'np. Chcę zostać Junior React & Node.js Developerem'
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* ANTI-BOT VERIFICATION SECTION */}
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    <ShieldCheck className="h-4 w-4 text-cyan-400" />
                    <span>
                      {isEn ? 'Anti-Bot Verification (Human)' : 'Weryfikacja Anty-Botowa (Człowiek)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRefreshChallenge}
                    title={isEn ? 'Change verification question' : 'Zmień pytanie weryfikacyjne'}
                    className="text-slate-400 hover:text-cyan-300 text-[11px] flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>{isEn ? 'Another question' : 'Inne pytanie'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="font-semibold text-slate-200">{activeChallenge.question}</div>
                  <div className="text-[10px] text-slate-500">
                    {isEn ? 'Hint:' : 'Wskazówka:'} {activeChallenge.hint}
                  </div>
                  <input
                    type="text"
                    required
                    value={antiBotAnswer}
                    onChange={(e) => setAntiBotAnswer(e.target.value)}
                    placeholder={isEn ? 'Your answer...' : 'Twoja odpowiedź...'}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                {/* Human Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300">
                      {isHumanConfirmed
                        ? isEn
                          ? 'Human presence verified'
                          : 'Zweryfikowano obecność człowieka'
                        : isEn
                        ? 'Drag the slider to the right (min. 95%):'
                        : 'Przesuń suwak do prawej strony (min. 95%):'}
                    </span>
                    <span
                      className={`font-bold ${
                        isHumanConfirmed ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {sliderProgress}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderProgress}
                    onChange={handleSliderChange}
                    aria-label={isEn ? 'Human verification slider' : 'Suwak weryfikacji człowieka'}
                    className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 text-xs font-bold transition-all shadow-md shadow-indigo-900/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>{isEn ? 'Register Verified Account' : 'Zarejestruj zweryfikowane konto'}</span>
              </button>

              <p className="text-center text-xs text-slate-400 pt-1">
                {isEn ? 'Already have an account?' : 'Masz już konto w akademii?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                    setGoogleAuthIssue(null);
                  }}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-2 cursor-pointer"
                >
                  {isEn ? 'Sign in instead →' : 'Zaloguj się →'}
                </button>
              </p>
            </form>
          )}

          {/* FORGOT / RESET PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed">
                {isEn
                  ? 'Enter the email address linked to your account and type a new password (or generate one). Once confirmed, you will be redirected to sign in.'
                  : 'Podaj adres e-mail przypisany do Twojego konta oraz wpisz nowe hasło (lub użyj wygenerowanego). Po zatwierdzeniu zostaniesz przekierowany do logowania.'}
              </div>

              <div className="space-y-1">
                <label htmlFor="forgot-email" className="text-xs font-semibold text-slate-300 block">
                  {isEn ? 'Account Email:' : 'Adres E-mail konta:'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isEn ? 'you@example.com' : 'twoj@email.pl'}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="forgot-new-pass" className="text-xs font-semibold text-slate-300 block">
                    {isEn ? 'New password (min. 6 characters):' : 'Nowe hasło dostępowe (min. 6 znaków):'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewResetPassword(`FullStack${Math.floor(100 + Math.random() * 900)}!`)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300"
                  >
                    {isEn ? 'Generate strong password' : 'Losuj silne hasło'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="forgot-new-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newResetPassword}
                    onChange={(e) => setNewResetPassword(e.target.value)}
                    placeholder={isEn ? 'Minimum 6 characters' : 'Minimum 6 znaków'}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-10 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 text-xs font-bold transition-all shadow-md shadow-indigo-900/40 flex items-center justify-center gap-2"
              >
                <KeyRound className="h-4 w-4" />
                <span>{isEn ? 'Set New Password' : 'Ustaw nowe hasło dostępowe'}</span>
              </button>
            </form>
          )}

          {/* PROFILE SETTINGS FORM */}
          {mode === 'profile' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={
                      currentUser.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'
                    }
                    alt={currentUser.name}
                    className="h-11 w-11 rounded-xl object-cover ring-2 ring-indigo-500/40 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                    <p className="text-[11px] text-indigo-400 mt-0.5">
                      {isEn ? 'Level' : 'Poziom'} {currentUser.level} • {currentUser.xp} XP •{' '}
                      {currentUser.role === 'admin'
                        ? isEn
                          ? 'Administrator'
                          : 'Administrator'
                        : isEn
                        ? 'Student'
                        : 'Kursant'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold shrink-0 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>{isEn ? 'Sign Out' : 'Wyloguj się'}</span>
                </button>
              </div>

              {/* GitHub Synchronization Status Indicator & Controls */}
              <GithubSyncCard />

              <form onSubmit={handleProfileSave} className="space-y-4 pt-1 border-t border-slate-800/80">
                <div className="space-y-1">
                  <label htmlFor="prof-name" className="text-xs font-semibold text-slate-300 block">
                    {isEn
                      ? 'Full name (displayed on certificate):'
                      : 'Imię i nazwisko (widoczne na certyfikacie):'}
                  </label>
                  <input
                    id="prof-name"
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="prof-bio" className="text-xs font-semibold text-slate-300 block">
                    {isEn
                      ? 'Bio / Career specialization (shown in CV):'
                      : 'Bio / Specjalizacja zawodowa (widoczne w CV):'}
                  </label>
                  <textarea
                    id="prof-bio"
                    rows={2}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="prof-goal" className="text-xs font-semibold text-slate-300 block">
                      {isEn ? 'Weekly study goal (minutes):' : 'Tygodniowy cel nauki (minuty):'}
                    </label>
                    <input
                      id="prof-goal"
                      type="number"
                      min={30}
                      max={1200}
                      step={15}
                      value={profileWeeklyGoal}
                      onChange={(e) => setProfileWeeklyGoal(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="prof-pass" className="text-xs font-semibold text-slate-300 block">
                      {isEn ? 'Change password (optional):' : 'Zmień hasło (opcjonalnie):'}
                    </label>
                    <input
                      id="prof-pass"
                      type={showPassword ? 'text' : 'password'}
                      value={profileNewPassword}
                      onChange={(e) => setProfileNewPassword(e.target.value)}
                      placeholder={isEn ? 'Leave blank to keep current' : 'Pozostaw puste bez zmian'}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{isEn ? 'Save profile changes' : 'Zapisz zmiany w profilu'}</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>{isEn ? 'Anybot & Anti-Spam Shield v2.4' : 'Ochrona Anybot & Anti-Spam v2.4'}</span>
          <span>{isEn ? 'TLS session encryption' : 'Szyfrowanie sesji TLS'}</span>
        </div>
      </div>
    </div>
  );
};
