import { User, UserRole } from '../types';
import { AppLanguage } from './i18n';

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

export function getPasswordStrength(password: string, language: AppLanguage = 'pl'): PasswordStrengthInfo {
  if (!password) {
    return { score: 0, label: '', color: 'bg-slate-700' };
  }
  let points = 0;
  if (password.length >= 6) points++;
  if (password.length >= 8) points++;
  if (/[A-Z]/.test(password)) points++;
  if (/[0-9]/.test(password)) points++;
  if (/[^A-Za-z0-9]/.test(password)) points++;

  if (points <= 2) return { score: 1, label: language === 'en' ? 'Weak' : 'Słabe', color: 'bg-rose-500' };
  if (points <= 4) return { score: 2, label: language === 'en' ? 'Medium' : 'Średnie', color: 'bg-amber-500' };
  return { score: 3, label: language === 'en' ? 'Strong' : 'Silne', color: 'bg-emerald-500' };
}

export function authenticateUserCredentials(
  users: User[],
  email: string,
  password?: string,
  language: AppLanguage = 'pl'
): { success: boolean; user?: User; error?: string } {
  const isEn = language === 'en';
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, error: isEn ? 'Enter your email address.' : 'Wprowadź adres e-mail.' };
  }

  if (!validateEmailFormat(cleanEmail)) {
    return {
      success: false,
      error: isEn
        ? 'Enter a valid email format (e.g. name@domain.com).'
        : 'Wprowadź poprawny format adresu e-mail (np. imie@domena.pl).',
    };
  }

  if (!password || password.trim().length === 0) {
    return { success: false, error: isEn ? 'Enter your password.' : 'Wprowadź hasło dostępowe.' };
  }

  const found = users.find((u) => u.email.trim().toLowerCase() === cleanEmail);
  if (!found) {
    return {
      success: false,
      error: isEn ? 'No account found with that email address.' : 'Nie znaleziono konta z tym adresem e-mail.',
    };
  }

  if (found.status === 'banned') {
    return {
      success: false,
      error: isEn
        ? `Account blocked. Reason: ${found.banReason || 'Violation of platform terms.'}`
        : `Konto zostało zablokowane. Powód: ${found.banReason || 'Naruszenie regulaminu platformy.'}`,
    };
  }

  if (found.status === 'suspended') {
    return {
      success: false,
      error: isEn
        ? `Account temporarily suspended. Reason: ${found.banReason || 'Anti-bot security check.'}`
        : `Konto zostało tymczasowo zawieszone. Powód: ${found.banReason || 'Weryfikacja bezpieczeństwa przez anty-bota.'}`,
    };
  }

  if (found.status === 'pending_verification') {
    return {
      success: false,
      error: isEn
        ? 'Account awaiting anti-bot verification. Contact the administrator.'
        : 'Konto oczekuje na weryfikację anty-botem. Skontaktuj się z administratorem.',
    };
  }

  if (found.role === 'admin' || cleanEmail === 'zordonzordon1@gmail.com') {
    return {
      success: false,
      error: isEn
        ? 'Administrator account is protected and requires Google Firebase Auth verification (use "Sign in with Google").'
        : 'Konto Administratora jest chronione i wymaga weryfikacji tożsamości przez Google Firebase Auth (przycisk „Zaloguj przez Google”).',
    };
  }

  const expectedPassword = found.password;
  if (!expectedPassword || password !== expectedPassword) {
    return {
      success: false,
      error: isEn
        ? 'Incorrect password. Double-check your password or use password reset.'
        : 'Nieprawidłowe hasło dostępowe. Sprawdź poprawność lub skorzystaj z resetu hasła.',
    };
  }

  const updatedUser: User = {
    ...found,
    role: 'student',
    lastLoginAt: new Date().toISOString(),
  };

  return { success: true, user: updatedUser };
}

export function validateAndCreateUser(
  users: User[],
  params: RegisterUserParams,
  language: AppLanguage = 'pl'
): { success: boolean; user?: User; error?: string } {
  const isEn = language === 'en';
  const cleanName = (params.name || '').trim();
  const cleanEmail = (params.email || '').trim().toLowerCase();
  const rawPassword = params.password || '';

  if (cleanName.length < 2) {
    return {
      success: false,
      error: isEn ? 'Full name must be at least 2 characters long.' : 'Imię i nazwisko musi zawierać co najmniej 2 znaki.',
    };
  }

  if (!cleanEmail || !validateEmailFormat(cleanEmail)) {
    return {
      success: false,
      error: isEn ? 'Enter a valid email address (e.g. student@domain.com).' : 'Podaj poprawny adres e-mail (np. kursant@domena.pl).',
    };
  }

  if (params.role === 'admin' || cleanEmail === 'zordonzordon1@gmail.com') {
    return {
      success: false,
      error: isEn
        ? 'Self-registration for an Administrator account is blocked for security reasons.'
        : 'Samodzielna rejestracja konta Administratora jest zablokowana ze względów bezpieczeństwa.',
    };
  }

  if (rawPassword.length < 6) {
    return {
      success: false,
      error: isEn ? 'Password must be at least 6 characters long.' : 'Hasło dostępowe musi mieć co najmniej 6 znaków.',
    };
  }

  const existing = users.find((u) => u.email.trim().toLowerCase() === cleanEmail);
  if (existing) {
    return {
      success: false,
      error: isEn ? 'An account with this email already exists.' : 'Konto z podanym adresem e-mail już istnieje w systemie.',
    };
  }

  if (!params.antiBotPassed) {
    return {
      success: false,
      error: isEn
        ? 'Anti-bot verification failed. Please confirm you are human.'
        : 'Weryfikacja anty-botowa nie powiodła się. Potwierdź, że jesteś człowiekiem.',
    };
  }

  const todayDate = new Date().toISOString().split('T')[0];

  const newUser: User = {
    id: `user-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    role: 'student',
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
    bio: params.bio?.trim() || (isEn ? 'New Full Stack Academy student.' : 'Nowy kursant Akademii Full Stack.'),
    lastLoginAt: new Date().toISOString(),
    createdAt: todayDate,
  };

  return { success: true, user: newUser };
}

export function canSwitchToUser(
  user: User | undefined,
  actor?: User,
  isActorAuthenticated: boolean = false,
  language: AppLanguage = 'pl'
): { allowed: boolean; error?: string } {
  const isEn = language === 'en';
  if (!user) {
    return { allowed: false, error: isEn ? 'Selected user profile not found.' : 'Nie znaleziono wybranego profilu użytkownika.' };
  }
  if (user.role === 'admin' || user.id === 'user-admin' || user.email.trim().toLowerCase() === 'zordonzordon1@gmail.com') {
    const isAlreadyVerifiedAdmin =
      isActorAuthenticated &&
      actor?.role === 'admin' &&
      actor?.email.trim().toLowerCase() === 'zordonzordon1@gmail.com';
    if (!isAlreadyVerifiedAdmin) {
      return {
        allowed: false,
        error: isEn
          ? 'Administrator account is protected. Sign in via Google Firebase OAuth as the owner.'
          : 'Konto Administratora jest chronione. Zaloguj się przez autoryzację Google Firebase OAuth jako właściciel.',
      };
    }
  }
  if (user.status === 'banned') {
    return {
      allowed: false,
      error: isEn
        ? `Cannot switch to a blocked account (${user.name}). Reason: ${user.banReason || 'Blocked by administrator.'}`
        : `Nie można przełączyć na zablokowane konto (${user.name}). Powód: ${user.banReason || 'Blokada administratora.'}`,
    };
  }
  if (user.status === 'suspended') {
    return {
      allowed: false,
      error: isEn ? `Account ${user.name} is temporarily suspended.` : `Konto ${user.name} jest tymczasowo zawieszone.`,
    };
  }
  if (user.status === 'pending_verification') {
    return {
      allowed: false,
      error: isEn
        ? `Account ${user.name} awaits anti-bot approval in the Admin Panel.`
        : `Konto ${user.name} oczekuje na weryfikację anty-botem w Panelu Administratora.`,
    };
  }
  return { allowed: true };
}

export function canResetUserPassword(
  targetUser: User | undefined,
  language: AppLanguage = 'pl'
): { allowed: boolean; error?: string } {
  const isEn = language === 'en';
  if (!targetUser) {
    return {
      allowed: false,
      error: isEn ? 'No account found with that email address.' : 'Nie znaleziono konta z podanym adresem e-mail.',
    };
  }
  if (
    targetUser.role === 'admin' ||
    targetUser.id === 'user-admin' ||
    targetUser.email.trim().toLowerCase() === 'zordonzordon1@gmail.com'
  ) {
    return {
      allowed: false,
      error: isEn
        ? 'For security reasons the Administrator password cannot be reset publicly. Use Google Firebase OAuth login.'
        : 'Ze względów bezpieczeństwa hasło konta Administratora nie może zostać zresetowane publicznie. Użyj logowania Google Firebase OAuth.',
    };
  }
  return { allowed: true };
}

export function sanitizeImportedUser(
  restoredUser: User,
  actor?: User,
  isActorAuthenticated: boolean = false
): User {
  const isVerifiedAdmin =
    isActorAuthenticated &&
    actor?.role === 'admin' &&
    actor?.email.trim().toLowerCase() === 'zordonzordon1@gmail.com';

  const safeEmail =
    !isVerifiedAdmin && (restoredUser.email || '').trim().toLowerCase() === 'zordonzordon1@gmail.com'
      ? 'kursant.import@akademia.pl'
      : restoredUser.email;

  const safeId =
    !isVerifiedAdmin && restoredUser.id === 'user-admin'
      ? `user-import-${Date.now()}`
      : restoredUser.id;

  return {
    ...restoredUser,
    id: safeId,
    email: safeEmail,
    role: isVerifiedAdmin && restoredUser.role === 'admin' ? 'admin' : 'student',
  };
}

export function createGuestUser(language: AppLanguage = 'pl'): User {
  const isEn = language === 'en';
  const todayDate = new Date().toISOString().split('T')[0];
  return {
    id: 'user-guest',
    name: isEn ? 'Guest (Signed out)' : 'Gość (Niezalogowany)',
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
    bio: isEn
      ? 'Guest session — sign in or create a free account to save progress and unlock certificates.'
      : 'Konto gościa — zaloguj się lub załóż bezpłatne konto, aby trwale zapisywać postępy i zdobywać certyfikaty.',
    createdAt: todayDate,
  };
}

export interface ProtectedRouteOptions {
  requiredRole?: UserRole;
  allowGuests?: boolean;
  language?: AppLanguage;
}

export interface ProtectedRouteCheckResult {
  allowed: boolean;
  reason?: 'guest_blocked' | 'account_inactive' | 'insufficient_role';
  title?: string;
  message?: string;
}

export function isGuestUser(user: User | null | undefined, isAuthenticated: boolean): boolean {
  if (!isAuthenticated || !user) return true;
  if (user.id === 'user-guest') return true;
  if ((user.email || '').trim().toLowerCase() === 'gosc@fullstack-academy.pl') return true;
  return false;
}

export function checkProtectedRouteAccess(
  user: User | null | undefined,
  isAuthenticated: boolean,
  options: ProtectedRouteOptions = {}
): ProtectedRouteCheckResult {
  const { requiredRole, allowGuests = false, language = 'pl' } = options;
  const isEn = language === 'en';

  // 1. Always block guests when allowGuests is false or when admin role is required
  if ((!allowGuests || requiredRole === 'admin') && isGuestUser(user, isAuthenticated)) {
    return {
      allowed: false,
      reason: 'guest_blocked',
      title: isEn
        ? 'Guest Access Restricted — Sign In Required'
        : 'Dostęp Zablokowany dla Gości — Wymagane Logowanie',
      message: isEn
        ? 'You are browsing in Guest Mode. Access to the Admin Panel and protected workspace sections is restricted — please sign in with a verified account.'
        : 'Przeglądasz platformę w trybie Gościa (Niezalogowany). Dostęp do Panelu Administratora oraz chronionych sekcji jest zablokowany dla gości — zaloguj się na zweryfikowane konto.',
    };
  }

  if (!user) {
    return {
      allowed: false,
      reason: 'guest_blocked',
      title: isEn
        ? 'Guest Access Restricted — Sign In Required'
        : 'Dostęp Zablokowany dla Gości — Wymagane Logowanie',
      message: isEn ? 'Sign in to access this protected area.' : 'Zaloguj się, aby uzyskać dostęp do tej sekcji.',
    };
  }

  // 2. Block inactive, banned, or suspended accounts
  if (user.status && user.status !== 'active') {
    return {
      allowed: false,
      reason: 'account_inactive',
      title: isEn ? 'Account Inactive or Suspended' : 'Konto Nieaktywne lub Zawieszone',
      message:
        user.status === 'banned'
          ? isEn
            ? `Your account has been blocked. Reason: ${user.banReason || 'Platform terms violation.'}`
            : `Twoje konto zostało zablokowane. Powód: ${user.banReason || 'Naruszenie regulaminu platformy.'}`
          : isEn
          ? 'Your account is awaiting security review or temporarily suspended.'
          : 'Twoje konto oczekuje na weryfikację bezpieczeństwa lub zostało tymczasowo zawieszone.',
    };
  }

  // 3. Check requiredRole permissions
  if (requiredRole) {
    if (requiredRole === 'admin') {
      const isAuthorizedAdmin =
        !isGuestUser(user, isAuthenticated) &&
        user.role === 'admin' &&
        (user.email || '').trim().toLowerCase() === 'zordonzordon1@gmail.com';
      if (!isAuthorizedAdmin) {
        return {
          allowed: false,
          reason: 'insufficient_role',
          title: isEn
            ? 'Access Denied — Authorized Administrator Area'
            : 'Brak Dostępu — Strefa Autoryzowanego Administratora',
          message: isEn
            ? 'The Academy Admin Panel is protected by ProtectedRoute and restricted exclusively to the verified platform owner (Role: Administrator). Student and guest accounts do not hold administrative permissions.'
            : 'Panel zarządzania akademią jest chroniony przez komponent ProtectedRoute i dostępny wyłącznie dla zweryfikowanego właściciela platformy (rola: Administrator). Konta kursantów oraz gości nie posiadają uprawnień administracyjnych.',
        };
      }
    } else if (user.role !== requiredRole && user.role !== 'admin') {
      return {
        allowed: false,
        reason: 'insufficient_role',
        title: isEn ? 'Insufficient Permissions' : 'Brak Wymaganych Uprawnień',
        message: isEn ? `This section requires role: ${requiredRole}.` : `Ta sekcja wymaga uprawnień roli: ${requiredRole}.`,
      };
    }
  }

  return { allowed: true };
}

export type AuthModalMode = 'login' | 'register' | 'forgot' | 'profile';

export type GoogleAuthErrorCode =
  | 'unauthorized-domain'
  | 'popup-blocked'
  | 'popup-closed'
  | 'cancelled'
  | 'operation-not-supported'
  | 'network'
  | 'unknown';

export interface GoogleAuthErrorClassification {
  code: GoogleAuthErrorCode;
  rawCode: string;
  hostname: string;
  recommendedDomains: string[];
  userTitle: string;
  userMessage: string;
  toastMessage: string;
  recommendEmailAuth: boolean;
  isDomainConfigIssue: boolean;
}

export function getRecommendedAuthorizedDomains(hostname: string): string[] {
  const cleanHost = (hostname || '').trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
  if (!cleanHost) return ['localhost'];
  const list = [cleanHost];
  if (cleanHost.startsWith('www.')) {
    const apex = cleanHost.slice(4);
    if (apex && !list.includes(apex)) list.push(apex);
  } else if (
    cleanHost !== 'localhost' &&
    !/^\d+\.\d+\.\d+\.\d+$/.test(cleanHost) &&
    cleanHost.split('.').length === 2
  ) {
    list.push(`www.${cleanHost}`);
  }
  return list;
}

export function classifyGoogleAuthError(
  error: unknown,
  hostname: string = 'localhost',
  language: AppLanguage = 'pl'
): GoogleAuthErrorClassification {
  const isEn = language === 'en';
  const rawCode =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code || '')
      : '';
  const rawMessage = error instanceof Error ? error.message : String(error || '');
  const combined = `${rawCode} ${rawMessage}`.toLowerCase();
  const cleanHost = (hostname || 'localhost').trim() || 'localhost';
  const recommendedDomains = getRecommendedAuthorizedDomains(cleanHost);

  if (combined.includes('unauthorized-domain')) {
    return {
      code: 'unauthorized-domain',
      rawCode: rawCode || 'auth/unauthorized-domain',
      hostname: cleanHost,
      recommendedDomains,
      userTitle: isEn
        ? 'Google Sign-In unavailable on this domain yet'
        : 'Logowanie przez Google wymaga włączenia dla tej domeny',
      userMessage: isEn
        ? `Google Sign-In is not authorized for "${cleanHost}" yet. You can create a free account or sign in with email right now — all lessons, simulators, and progress work identically.`
        : `Logowanie przez Google na domenie „${cleanHost}” oczekuje na dodanie jej przez administratora w Firebase Console. Możesz już teraz założyć darmowe konto lub zalogować się e-mailem — wszystkie lekcje i symulatory działają od razu.`,
      toastMessage: isEn
        ? `Google Sign-In requires domain authorization (${cleanHost}). Use Email login or registration.`
        : `Logowanie Google wymaga autoryzacji domeny (${cleanHost}). Użyj logowania lub rejestracji e-mailem.`,
      recommendEmailAuth: true,
      isDomainConfigIssue: true,
    };
  }

  if (combined.includes('popup-blocked')) {
    return {
      code: 'popup-blocked',
      rawCode: rawCode || 'auth/popup-blocked',
      hostname: cleanHost,
      recommendedDomains,
      userTitle: isEn ? 'Browser blocked the Google sign-in window' : 'Przeglądarka zablokowała okno logowania Google',
      userMessage: isEn
        ? 'Your browser or in-app WebView blocked the Google popup window. Allow popups for this site, open the page in Chrome/Safari, or use email sign-in / registration.'
        : 'Twoja przeglądarka (lub wbudowana przeglądarka aplikacji) zablokowała wyskakujące okno Google. Zezwól na wyskakujące okna, otwórz stronę w Chrome/Safari albo zaloguj się e-mailem.',
      toastMessage: isEn
        ? 'Google popup was blocked by your browser. Allow popups or use Email login.'
        : 'Przeglądarka zablokowała okno Google. Odblokuj wyskakujące okna lub zaloguj się e-mailem.',
      recommendEmailAuth: true,
      isDomainConfigIssue: false,
    };
  }

  if (combined.includes('operation-not-supported-in-this-environment') || combined.includes('web-storage-unsupported')) {
    return {
      code: 'operation-not-supported',
      rawCode: rawCode || 'auth/operation-not-supported-in-this-environment',
      hostname: cleanHost,
      recommendedDomains,
      userTitle: isEn ? 'Google popup unsupported in this browser view' : 'Logowanie popup Google nie jest obsługiwane w tym widoku',
      userMessage: isEn
        ? 'This embedded browser blocks third-party OAuth cookies/storage. Open the site in your main browser or sign in with email & password.'
        : 'Wbudowana przeglądarka ogranicza pliki cookie/pamięć dla okien OAuth. Otwórz stronę w głównej przeglądarce lub skorzystaj z bezpłatnego konta e-mail.',
      toastMessage: isEn
        ? 'OAuth popup blocked by embedded browser. Use Email sign-in or your main browser.'
        : 'Ograniczona przeglądarka blokuje okno OAuth. Użyj logowania e-mail lub pełnej przeglądarki.',
      recommendEmailAuth: true,
      isDomainConfigIssue: false,
    };
  }

  if (combined.includes('popup-closed-by-user')) {
    return {
      code: 'popup-closed',
      rawCode: rawCode || 'auth/popup-closed-by-user',
      hostname: cleanHost,
      recommendedDomains,
      userTitle: isEn ? 'Google sign-in window closed' : 'Zamknięto okno logowania Google',
      userMessage: isEn
        ? 'The Google sign-in window was closed before completing authorization. Try again or sign in with email.'
        : 'Okno logowania Google zostało zamknięte przed zakończeniem autoryzacji. Spróbuj ponownie lub zaloguj się e-mailem.',
      toastMessage: isEn
        ? 'Google sign-in window closed before completing authorization.'
        : 'Okno logowania Google zostało zamknięte przed ukończeniem.',
      recommendEmailAuth: false,
      isDomainConfigIssue: false,
    };
  }

  if (combined.includes('cancelled-popup-request')) {
    return {
      code: 'cancelled',
      rawCode: rawCode || 'auth/cancelled-popup-request',
      hostname: cleanHost,
      recommendedDomains,
      userTitle: isEn ? 'Previous Google login attempt cancelled' : 'Anulowano poprzednią próbę logowania Google',
      userMessage: isEn
        ? 'Another Google sign-in popup was already opening. Click "Sign in with Google" once more.'
        : 'Poprzednie okno logowania zostało zastąpione nowym żądaniem. Kliknij przycisk „Zaloguj przez Google” jeszcze raz.',
      toastMessage: isEn ? 'Cancelled duplicate Google popup request.' : 'Anulowano zdublowane okno logowania Google.',
      recommendEmailAuth: false,
      isDomainConfigIssue: false,
    };
  }

  if (combined.includes('network-request-failed')) {
    return {
      code: 'network',
      rawCode: rawCode || 'auth/network-request-failed',
      hostname: cleanHost,
      recommendedDomains,
      userTitle: isEn ? 'Network connection error' : 'Błąd połączenia sieciowego',
      userMessage: isEn
        ? 'Unable to reach Google authentication servers. Check your internet connection or ad-blocker and try again.'
        : 'Nie udało się połączyć z serwerami autoryzacji Google. Sprawdź połączenie z internetem lub blokadę reklam i spróbuj ponownie.',
      toastMessage: isEn ? 'Network error while connecting to Google Auth.' : 'Błąd sieci podczas łączenia z logowaniem Google.',
      recommendEmailAuth: true,
      isDomainConfigIssue: false,
    };
  }

  return {
    code: 'unknown',
    rawCode: rawCode || 'auth/unknown',
    hostname: cleanHost,
    recommendedDomains,
    userTitle: isEn ? 'Google Sign-In error' : 'Błąd logowania przez Google',
    userMessage: rawMessage || (isEn ? 'Failed to sign in with Google.' : 'Nie udało się zalogować przez Google.'),
    toastMessage: isEn
      ? `Google sign-in error: ${rawMessage || 'Unknown error'}`
      : `Błąd logowania Google: ${rawMessage || 'Nieznany błąd'}`,
    recommendEmailAuth: true,
    isDomainConfigIssue: false,
  };
}


