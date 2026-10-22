import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  ANTI_BOT_CHALLENGES, 
  getRandomAntiBotChallenge, 
  verifyAntiBotSubmission, 
  AntiBotChallenge 
} from '../utils/antiBot';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  ShieldAlert,
  Bot, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  KeyRound
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { allUsers, loginUser, registerUser, switchUser, resetUserPassword } = useApp();
  
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [demoRoleFilter, setDemoRoleFilter] = useState<'all' | 'students' | 'admins' | 'blocked'>('all');

  // Form fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [bio, setBio] = useState('');

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
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 1, label: 'Słabe', color: 'bg-rose-500' };
    if (score <= 4) return { score: 2, label: 'Średnie', color: 'bg-amber-500' };
    return { score: 3, label: 'Silne', color: 'bg-emerald-500' };
  };

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

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Wypełnij wszystkie wymagane pola formularza.');
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

    const res = resetUserPassword(email.trim(), 'akademia2026!');
    if (res.success) {
      setSuccessMessage(res.message);
      setPassword('akademia2026!');
      setTimeout(() => {
        setMode('login');
      }, 2500);
    } else {
      setErrorMessage(res.message);
    }
  };

  const filteredDemoUsers = allUsers.filter((u) => {
    if (demoRoleFilter === 'students') return u.role === 'student' && u.status === 'active';
    if (demoRoleFilter === 'admins') return u.role === 'admin';
    if (demoRoleFilter === 'blocked') return u.status === 'suspended' || u.status === 'banned' || u.status === 'pending_verification';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
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
                {mode === 'forgot' && 'Odzyskiwanie Hasła'}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {mode === 'login' && 'Wprowadź dane lub wybierz profil testowy poniżej.'}
                {mode === 'register' && 'Wypełnij dane i potwierdź tożsamość człowieka.'}
                {mode === 'forgot' && 'Zresetuj hasło dostępowe do swojego konta.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                mode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Logowanie
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Nowe Konto (Anty-Bot)</span>
              <span className="sm:hidden">Rejestracja</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('forgot'); setErrorMessage(''); }}
              className={`py-2 px-3 rounded-xl transition-all ${
                mode === 'forgot' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Reset
            </button>
          </div>

          {/* Quick Demo Accounts Palette (Filtered) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Szybkie logowanie testowe:
              </span>
              <div className="flex gap-1 text-[10px]">
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
                    demoRoleFilter === 'blocked' ? 'bg-slate-800 text-amber-300' : 'text-slate-500 hover:text-slate-300'
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

                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setEmail(u.email);
                      setPassword(u.password || 'password123');
                      if (mode === 'login') {
                        const res = loginUser(u.email, u.password || 'password123');
                        if (res.success) onClose();
                        else setErrorMessage(res.error || 'Konto niedostępne');
                      }
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs text-left transition-all ${
                      isBlocked
                        ? 'bg-rose-950/20 border-rose-900/40 hover:bg-rose-900/30'
                        : isPending
                        ? 'bg-amber-950/20 border-amber-900/40 hover:bg-amber-900/30'
                        : 'bg-slate-900 hover:bg-indigo-950/50 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img 
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'} 
                        alt={u.name} 
                        className="h-6 w-6 rounded-lg object-cover shrink-0" 
                      />
                      <div className="truncate">
                        <span className="font-bold text-white block truncate">{u.name}</span>
                        <span className="text-[10px] text-slate-400 truncate">{u.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {u.isPro && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                          PRO
                        </span>
                      )}
                      {isBlocked ? (
                        <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded font-bold">
                          Zablokowane
                        </span>
                      ) : isPending ? (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                          Weryfikacja
                        </span>
                      ) : (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                          u.role === 'admin' ? 'bg-rose-500/20 text-rose-300' : 'bg-indigo-500/20 text-indigo-300'
                        }`}>
                          {u.role === 'admin' ? 'Admin' : `${u.xp} XP`}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

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

          {/* Form Content */}
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
                    onClick={() => { setMode('forgot'); setErrorMessage(''); }}
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

          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* Invisible Honeypot Trap Field */}
              <div 
                aria-hidden="true" 
                style={{ opacity: 0, position: 'absolute', top: 0, left: '-5000px', height: 0, width: 0, zIndex: -1 }}
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
                {/* Strength meter */}
                {password && (
                  <div className="pt-1 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-800'}`} />
                      <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-800'}`} />
                      <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-800'}`} />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{passwordStrength.label}</span>
                  </div>
                )}
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
                  <div className="font-semibold text-slate-200">
                    {challenge.question}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Wskazówka: {challenge.hint}
                  </div>
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
                      {isHumanConfirmed ? 'Zweryfikowano obecność człowieka' : 'Przesuń suwak do prawej strony:'}
                    </span>
                    <span className={`font-bold ${isHumanConfirmed ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {sliderProgress}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderProgress}
                    onChange={handleSliderChange}
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

          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed">
                Podaj adres e-mail przypisany do Twojego konta kursanta. Wygenerujemy nowe hasło dostępowe.
              </div>

              <div className="space-y-1">
                <label htmlFor="forgot-email" className="text-xs font-semibold text-slate-300 block">
                  Adres E-mail:
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

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 text-xs font-bold transition-all shadow-md shadow-indigo-900/40 flex items-center justify-center gap-2"
              >
                <KeyRound className="h-4 w-4" />
                <span>Wygeneruj nowe hasło</span>
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
