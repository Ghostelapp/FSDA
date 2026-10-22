import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { X, Lock, Mail, User, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { allUsers, loginUser, registerUser, switchUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'login') {
      const success = loginUser(email);
      if (success) {
        onClose();
      } else {
        setErrorMessage('Nie znaleziono konta z tym adresem e-mail. Zarejestruj się lub wybierz konto demo.');
      }
    } else {
      if (!name.trim() || !email.trim()) {
        setErrorMessage('Wszystkie pola są wymagane.');
        return;
      }
      registerUser(name.trim(), email.trim(), role);
      onClose();
    }
  };

  const handleSelectDemo = (userId: string) => {
    switchUser(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              {mode === 'login' ? 'Logowanie do Platformy' : 'Rejestracja w Akademii'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Śledź swoje postępy i zdobywaj punkty doświadczenia.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij okno"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Demo Accounts Selection */}
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-3.5 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
            Gotowe konta testowe (Kliknij aby zalogować od razu):
          </span>
          <div className="space-y-1.5">
            {allUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleSelectDemo(u.id)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900 hover:bg-indigo-900/40 border border-slate-800 text-xs text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{u.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    u.role === 'admin' ? 'bg-rose-500/20 text-rose-300' : 'bg-indigo-500/20 text-indigo-300'
                  }`}>
                    {u.role === 'admin' ? 'Instruktor' : 'Kursant'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{u.xp} XP &rarr;</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Logowanie
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Nowe Konto
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1">
              <label htmlFor="reg-name" className="text-xs font-semibold text-slate-300 block">Imię i nazwisko:</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="np. Michał Wiśniewski"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="auth-email" className="text-xs font-semibold text-slate-300 block">Adres E-mail:</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                id="auth-email"
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
            <label htmlFor="auth-pass" className="text-xs font-semibold text-slate-300 block">Hasło dostępowe:</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                id="auth-pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label htmlFor="reg-role" className="text-xs font-semibold text-slate-300 block">Rola w platformie:</label>
              <select
                id="reg-role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="student">Kursant (Uczeń)</option>
                <option value="admin">Instruktor / Administrator</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 text-xs font-bold transition-all shadow-md shadow-indigo-900/40"
          >
            {mode === 'login' ? 'Zaloguj się do panelu' : 'Utwórz konto w Akademii'}
          </button>
        </form>

      </div>
    </div>
  );
};
