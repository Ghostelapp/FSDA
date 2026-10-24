import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  getRandomAntiBotChallenge,
  verifyAntiBotSubmission,
  AntiBotChallenge,
} from '../utils/antiBot';
import { getPasswordStrength, validateEmailFormat } from '../utils/authValidation';
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
  Sparkles,
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
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    isAuthenticated,
    isCloudConnected,
    isSyncingCloud,
    allUsers,
    loginUser,
    loginWithGoogle,
    syncNowToCloud,
    registerUser,
    updateCurrentUserProfile,
    resetUserPassword,
    logout,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'profile'>('login');
  const [demoRoleFilter, setDemoRoleFilter] = useState<'all' | 'students' | 'admins' | 'blocked'>('all');

  // Form fields (Login / Register / Forgot)
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('akademia2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [bio, setBio] = useState('');

  // Profile Edit Fields
  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileNewPassword, setProfileNewPassword] = useState('');
  const [profileWeeklyGoal, setProfileWeeklyGoal] = useState(180);

  // Anti-Bot Protection Fields
  const [challenge, setChallenge] = useState<AntiBotChallenge>(() => getRandomAntiBotChallenge());
  const [antiBotAnswer, setAntiBotAnswer] = useState('');
  const [honeypotValue, setHoneypotValue] = useState('');
  const [sliderProgress, setSliderProgress] = useState(0);
  const [formOpenTime, setFormOpenTime] = useState<number>(Date.now());
  const [isHumanConfirmed, setIsHumanConfirmed] = useState(false);

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Reset form timer when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setFormOpenTime(Date.now());
      setChallenge(getRandomAntiBotChallenge());
      setAntiBotAnswer('');
      setSliderProgress(0);
      setIsHumanConfirmed(false);
      setErrorMessage('');
      setSuccessMessage('');
      setProfileName(currentUser.name);
      setProfileBio(currentUser.bio || '');
      setProfileNewPassword('');
      setProfileWeeklyGoal(currentUser.weeklyGoalMinutes || 180);
    }
  }, [isOpen, mode, currentUser.name, currentUser.bio, currentUser.weeklyGoalMinutes]);

  if (!isOpen) return null;

  const passwordStrength = getPasswordStrength(password);

  const handleRefreshChallenge = () => {
    setChallenge(getRandomAntiBotChallenge());
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
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Wprowadź adres e-mail oraz hasło dostępowe.');
      return;
    }

    const res = loginUser(email.trim(), password);
    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Błąd logowania.');
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    const res = await loginWithGoogle();
    if (res.success) {
      onClose();
    } else if (res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Wypełnij wszystkie wymagane pola formularza.');
      return;
    }

    if (name.trim().length < 2) {
      setErrorMessage('Imię i nazwisko musi zawierać co najmniej 2 znaki.');
      return;
    }

    if (!validateEmailFormat(email)) {
      setErrorMessage('Podaj poprawny adres e-mail (np. imie@domena.pl).');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Hasło musi mieć co najmniej 6 znaków.');
      return;
    }

    // Run Anti-Bot heuristic check
    const timeSpentMs = Date.now() - formOpenTime;
    const botCheck = verifyAntiBotSubmission({
      challengeId: challenge.id,
      userAnswer: antiBotAnswer,
      honeypotValue,
      sliderProgress,
      timeSpentMs,
    });

    if (!botCheck.isHuman) {
      setErrorMessage(`Ochrona Anty-Bot: ${botCheck.reason || 'Weryfikacja tożsamości nie powiodła się.'}`);
      return;
    }

    const res = registerUser({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      antiBotPassed: botCheck.isHuman,
      antiBotScore: botCheck.score,
      bio: bio.trim(),
    });

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Nie udało się zarejestrować użytkownika.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Podaj adres e-mail powiązany z kontem.');
      return;
    }

    if (!validateEmailFormat(email)) {
      setErrorMessage('Podaj poprawny format adresu e-mail.');
      return;
    }

    const targetPass = newResetPassword.trim() || 'akademia2026!';
    if (targetPass.length < 6) {
      setErrorMessage('Nowe hasło musi zawierać co najmniej 6 znaków.');
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
    setSuccessMessage('Wylogowano z konta. Możesz zalogować się na inne konto poniżej.');
    setMode('login');
  };

  const filteredDemoUsers = allUsers.filter((u) => {
    if (demoRoleFilter === 'students') return u.role === 'student' && u.status === 'active';
    if (demoRoleFilter === 'admins') return u.role === 'admin';
    if (demoRoleFilter === 'blocked')
      return u.status === 'suspended' || u.status === 'banned' || u.status === 'pending_verification';
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 shrink-0">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {mode === 'login' && 'Logowanie do Akademii'}
                {mode === 'register' && 'Rejestracja z Ochroną Anty-Bot'}
                {mode === 'forgot' && 'Odzyskiwanie i Reset Hasła'}
                {mode === 'profile' && 'Ustawienia Konta i Profilu'}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {mode === 'login' && 'Zaloguj się przez Chmurę Google Firebase lub wybierz profil.'}
                {mode === 'register' && 'Wypełnij dane i potwierdź tożsamość człowieka.'}
                {mode === 'forgot' && 'Ustaw nowe hasło dostępowe dla swojego konta.'}
                {mode === 'profile' && 'Zarządzaj swoimi danymi, hasłem i aktywną sesją.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij okno autoryzacji"
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
              Sesja:{' '}
              <strong className="text-white font-semibold">
                {isAuthenticated ? currentUser.name : 'Gość (Niezalogowany)'}
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
                  title="Wymuś natychmiastowy zapis postępów do Cloud Firestore"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold transition-colors"
                >
                  <Cloud className="h-3 w-3" />
                  <span className="hidden sm:inline">Zapisz w Chmurze</span>
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
                <span>Profil</span>
              </button>
              <button
                type="button"
                onClick={handleLogoutClick}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-[11px] font-semibold transition-colors"
              >
                <LogOut className="h-3 w-3" />
                <span>Wyloguj</span>
              </button>
            </div>
          ) : (
            <span className="text-[11px] text-amber-400 font-medium shrink-0">Tryb Gościa</span>
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
              Logowanie
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
              <span className="hidden sm:inline">Rejestracja (Anty-Bot)</span>
              <span className="sm:hidden">Rejestracja</span>
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
              Reset hasła
            </button>
          </div>

          {/* Firebase Cloud Google Sign-In Banner */}
          {mode !== 'profile' && (
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/25 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Cloud className="h-4 w-4 text-cyan-400" />
                  <span>Chmura Firebase Auth & Cloud Firestore</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Zaloguj się kontem Google, aby synchronizować XP, odznaki, serca i kod w czasie rzeczywistym między urządzeniami.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleGoogleLogin()}
                disabled={isSyncingCloud}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-60"
              >
                <Cloud className="h-4 w-4 text-indigo-600" />
                <span>{isSyncingCloud ? 'Łączenie...' : 'Zaloguj przez Google'}</span>
              </button>
            </div>
          )}

          {/* Quick Demo Accounts Palette (Filtered) */}
          {mode !== 'profile' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  Szybkie logowanie testowe:
                </span>
                <div className="flex flex-wrap gap-1 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setDemoRoleFilter('all')}
                    className={`px-2 py-0.5 rounded-lg font-medium transition-colors ${
                      demoRoleFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Wszyscy ({allUsers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoRoleFilter('students')}
                    className={`px-2 py-0.5 rounded-lg font-medium transition-colors ${
                      demoRoleFilter === 'students'
                        ? 'bg-slate-800 text-indigo-300'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Kursanci
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoRoleFilter('admins')}
                    className={`px-2 py-0.5 rounded-lg font-medium transition-colors ${
                      demoRoleFilter === 'admins' ? 'bg-slate-800 text-rose-300' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoRoleFilter('blocked')}
                    className={`px-2 py-0.5 rounded-lg font-medium transition-colors ${
                      demoRoleFilter === 'blocked'
                        ? 'bg-slate-800 text-amber-300'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Zablokowani
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {filteredDemoUsers.map((u) => {
                  const isBlocked = u.status === 'suspended' || u.status === 'banned';
                  const isPending = u.status === 'pending_verification';
                  const isCurrentActive = isAuthenticated && u.id === currentUser.id;

                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setEmail(u.email);
                        setPassword(u.password || 'password123');
                        if (mode === 'forgot') {
                          setSuccessMessage(`Wybrano konto ${u.email} do resetu hasła.`);
                          setErrorMessage('');
                          return;
                        }
                        setMode('login');
                        const res = loginUser(u.email, u.password || 'password123');
                        if (res.success) {
                          onClose();
                        } else {
                          setErrorMessage(res.error || 'Konto niedostępne');
                        }
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs text-left transition-all ${
                        isCurrentActive
                          ? 'bg-indigo-950/60 border-indigo-500/50 ring-1 ring-indigo-500/30'
                          : isBlocked
                          ? 'bg-rose-950/20 border-rose-900/40 hover:bg-rose-900/30'
                          : isPending
                          ? 'bg-amber-950/20 border-amber-900/40 hover:bg-amber-900/30'
                          : 'bg-slate-900 hover:bg-indigo-950/50 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img
                          src={
                            u.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'
                          }
                          alt={u.name}
                          className="h-6 w-6 rounded-lg object-cover shrink-0"
                        />
                        <div className="truncate">
                          <span className="font-bold text-white block truncate">
                            {u.name} {isCurrentActive ? '(Aktywne)' : ''}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">{u.email}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {u.isPro && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">
                            PRO
                          </span>
                        )}
                        {isBlocked ? (
                          <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded font-bold">
                            Zablokowane
                          </span>
                        ) : isPending ? (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">
                            Weryfikacja
                          </span>
                        ) : (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                              u.role === 'admin'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-indigo-500/20 text-indigo-300'
                            }`}
                          >
                            {u.role === 'admin' ? 'Admin' : `${u.xp} XP`}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5 animate-in slide-in-from-top-1">
              <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
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
                  Adres E-mail:
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="twoj@email.pl"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-pass" className="text-xs font-semibold text-slate-300 block">
                    Hasło dostępowe:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage('');
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300"
                  >
                    Nie pamiętasz hasła?
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
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 text-xs font-bold transition-all shadow-md shadow-indigo-900/40 flex items-center justify-center gap-2"
              >
                <span>Zaloguj się</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
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
                    Imię i nazwisko:
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      id="reg-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="np. Piotr Wiśniewski"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="reg-role" className="text-xs font-semibold text-slate-300 block">
                    Rola początkowa:
                  </label>
                  <select
                    id="reg-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="student">Kursant (Student)</option>
                    <option value="admin">Instruktor / Administrator</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="reg-email" className="text-xs font-semibold text-slate-300 block">
                  Adres E-mail:
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="twoj.email@domena.pl"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="reg-pass" className="text-xs font-semibold text-slate-300 block">
                  Hasło dostępowe:
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="reg-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 znaków"
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
                  Krótki opis / Cel nauki (opcjonalnie):
                </label>
                <input
                  id="reg-bio"
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="np. Chcę zostać Junior React & Node.js Developerem"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* ANTI-BOT VERIFICATION SECTION */}
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    <ShieldCheck className="h-4 w-4 text-cyan-400" />
                    <span>Weryfikacja Anty-Botowa (Człowiek)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRefreshChallenge}
                    title="Zmień pytanie weryfikacyjne"
                    className="text-slate-400 hover:text-cyan-300 text-[11px] flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Inne pytanie</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="font-semibold text-slate-200">{challenge.question}</div>
                  <div className="text-[10px] text-slate-500">Wskazówka: {challenge.hint}</div>
                  <input
                    type="text"
                    required
                    value={antiBotAnswer}
                    onChange={(e) => setAntiBotAnswer(e.target.value)}
                    placeholder="Twoja odpowiedź..."
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                {/* Human Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300">
                      {isHumanConfirmed
                        ? 'Zweryfikowano obecność człowieka'
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
                    aria-label="Suwak weryfikacji człowieka"
                    className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 text-xs font-bold transition-all shadow-md shadow-indigo-900/40 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Zarejestruj zweryfikowane konto</span>
              </button>
            </form>
          )}

          {/* FORGOT / RESET PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed">
                Podaj adres e-mail przypisany do Twojego konta oraz wpisz nowe hasło (lub użyj wygenerowanego). Po zatwierdzeniu zostaniesz przekierowany do logowania.
              </div>

              <div className="space-y-1">
                <label htmlFor="forgot-email" className="text-xs font-semibold text-slate-300 block">
                  Adres E-mail konta:
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="twoj@email.pl"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="forgot-new-pass" className="text-xs font-semibold text-slate-300 block">
                    Nowe hasło dostępowe (min. 6 znaków):
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewResetPassword(`FullStack${Math.floor(100 + Math.random() * 900)}!`)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300"
                  >
                    Losuj silne hasło
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
                    placeholder="Minimum 6 znaków"
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
                <span>Ustaw nowe hasło dostępowe</span>
              </button>
            </form>
          )}

          {/* PROFILE SETTINGS FORM */}
          {mode === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-4">
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
                      Poziom {currentUser.level} • {currentUser.xp} XP •{' '}
                      {currentUser.role === 'admin' ? 'Administrator' : 'Kursant'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold shrink-0 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Wyloguj się</span>
                </button>
              </div>

              <div className="space-y-1">
                <label htmlFor="prof-name" className="text-xs font-semibold text-slate-300 block">
                  Imię i nazwisko (widoczne na certyfikacie):
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
                  Bio / Specjalizacja zawodowa (widoczne w CV):
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
                    Tygodniowy cel nauki (minuty):
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
                    Zmień hasło (opcjonalnie):
                  </label>
                  <input
                    id="prof-pass"
                    type={showPassword ? 'text' : 'password'}
                    value={profileNewPassword}
                    onChange={(e) => setProfileNewPassword(e.target.value)}
                    placeholder="Pozostaw puste bez zmian"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Zapisz zmiany w profilu</span>
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Ochrona Anybot & Anti-Spam v2.4</span>
          <span>Szyfrowanie sesji TLS</span>
        </div>
      </div>
    </div>
  );
};
