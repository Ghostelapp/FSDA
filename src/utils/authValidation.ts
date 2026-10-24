import { User, UserRole } from '../types';

export interface RegisterUserParams {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  antiBotPassed: boolean;
  antiBotScore?: number;
  bio?: string;
}

export interface PasswordStrengthInfo {
  score: 0 | 1 | 2 | 3;
  label: string;
  color: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmailFormat(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function getPasswordStrength(password: string): PasswordStrengthInfo {
  if (!password) {
    return { score: 0, label: '', color: 'bg-slate-700' };
  }
  let points = 0;
  if (password.length >= 6) points++;
  if (password.length >= 8) points++;
  if (/[A-Z]/.test(password)) points++;
  if (/[0-9]/.test(password)) points++;
  if (/[^A-Za-z0-9]/.test(password)) points++;

  if (points <= 2) return { score: 1, label: 'Słabe', color: 'bg-rose-500' };
  if (points <= 4) return { score: 2, label: 'Średnie', color: 'bg-amber-500' };
  return { score: 3, label: 'Silne', color: 'bg-emerald-500' };
}

export function authenticateUserCredentials(
  users: User[],
  email: string,
  password?: string
): { success: boolean; user?: User; error?: string } {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, error: 'Wprowadź adres e-mail.' };
  }

  if (!validateEmailFormat(cleanEmail)) {
    return { success: false, error: 'Wprowadź poprawny format adresu e-mail (np. imie@domena.pl).' };
  }

  if (!password || password.trim().length === 0) {
    return { success: false, error: 'Wprowadź hasło dostępowe.' };
  }

  const found = users.find((u) => u.email.trim().toLowerCase() === cleanEmail);
  if (!found) {
    return { success: false, error: 'Nie znaleziono konta z tym adresem e-mail.' };
  }

  if (found.status === 'banned') {
    return {
      success: false,
      error: `Konto zostało zablokowane. Powód: ${found.banReason || 'Naruszenie regulaminu platformy.'}`,
    };
  }

  if (found.status === 'suspended') {
    return {
      success: false,
      error: `Konto zostało tymczasowo zawieszone. Powód: ${found.banReason || 'Weryfikacja bezpieczeństwa przez anty-bota.'}`,
    };
  }

  if (found.status === 'pending_verification') {
    return {
      success: false,
      error: 'Konto oczekuje na weryfikację anty-botem. Skontaktuj się z administratorem.',
    };
  }

  const expectedPassword = found.password || 'password123';
  if (password !== expectedPassword) {
    return {
      success: false,
      error: 'Nieprawidłowe hasło dostępowe. Sprawdź poprawność lub skorzystaj z resetu hasła.',
    };
  }

  const updatedUser: User = {
    ...found,
    lastLoginAt: new Date().toISOString(),
  };

  return { success: true, user: updatedUser };
}

export function validateAndCreateUser(
  users: User[],
  params: RegisterUserParams
): { success: boolean; user?: User; error?: string } {
  const cleanName = (params.name || '').trim();
  const cleanEmail = (params.email || '').trim().toLowerCase();
  const rawPassword = params.password || '';

  if (cleanName.length < 2) {
    return { success: false, error: 'Imię i nazwisko musi zawierać co najmniej 2 znaki.' };
  }

  if (!cleanEmail || !validateEmailFormat(cleanEmail)) {
    return { success: false, error: 'Podaj poprawny adres e-mail (np. kursant@domena.pl).' };
  }

  if (rawPassword.length < 6) {
    return { success: false, error: 'Hasło dostępowe musi mieć co najmniej 6 znaków.' };
  }

  const existing = users.find((u) => u.email.trim().toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, error: 'Konto z podanym adresem e-mail już istnieje w systemie.' };
  }

  if (!params.antiBotPassed) {
    return {
      success: false,
      error: 'Weryfikacja anty-botowa nie powiodła się. Potwierdź, że jesteś człowiekiem.',
    };
  }

  const todayDate = new Date().toISOString().split('T')[0];

  const newUser: User = {
    id: `user-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    role: params.role || 'student',
    status: 'active',
    antiBotVerified: true,
    antiBotScore: params.antiBotScore ?? 100,
    password: rawPassword,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`,
    xp: 0,
    level: 1,
    streakDays: 1,
    lastActiveDate: todayDate,
    weeklyGoalMinutes: 180,
    weeklySpentMinutes: 0,
    completedLessons: [],
    completedProjects: [],
    quizScores: {},
    unlockedBadges: [],
    savedCode: {},
    lives: 5,
    maxLives: 5,
    isPro: false,
    streakFreezes: 1,
    bio: params.bio?.trim() || 'Nowy kursant Akademii Full Stack.',
    lastLoginAt: new Date().toISOString(),
    createdAt: todayDate,
  };

  return { success: true, user: newUser };
}

export function canSwitchToUser(user: User | undefined): { allowed: boolean; error?: string } {
  if (!user) {
    return { allowed: false, error: 'Nie znaleziono wybranego profilu użytkownika.' };
  }
  if (user.status === 'banned') {
    return {
      allowed: false,
      error: `Nie można przełączyć na zablokowane konto (${user.name}). Powód: ${user.banReason || 'Blokada administratora.'}`,
    };
  }
  if (user.status === 'suspended') {
    return {
      allowed: false,
      error: `Konto ${user.name} jest tymczasowo zawieszone.`,
    };
  }
  if (user.status === 'pending_verification') {
    return {
      allowed: false,
      error: `Konto ${user.name} oczekuje na weryfikację anty-botem w Panelu Administratora.`,
    };
  }
  return { allowed: true };
}

export function createGuestUser(): User {
  const todayDate = new Date().toISOString().split('T')[0];
  return {
    id: 'user-guest',
    name: 'Gość (Niezalogowany)',
    email: 'gosc@fullstack-academy.pl',
    role: 'student',
    status: 'active',
    antiBotVerified: true,
    antiBotScore: 100,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GuestDeveloper',
    xp: 0,
    level: 1,
    streakDays: 0,
    lastActiveDate: todayDate,
    weeklyGoalMinutes: 120,
    weeklySpentMinutes: 0,
    completedLessons: [],
    completedProjects: [],
    quizScores: {},
    unlockedBadges: [],
    savedCode: {},
    lives: 5,
    maxLives: 5,
    isPro: false,
    streakFreezes: 0,
    bio: 'Konto gościa — zaloguj się lub załóż bezpłatne konto, aby trwale zapisywać postępy i zdobywać certyfikaty.',
    createdAt: todayDate,
  };
}
