import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import {
  User,
  UserRole,
  UserStatus,
  Announcement,
  Lesson,
  Module,
  Project,
  Badge,
  ReviewItem,
  DailyReminderSettings,
  SecurityAuditEvent,
  AdSenseConfig,
  GitHubIntegrationState,
} from '../types';
import { MODULES_DATA } from '../data/modulesData';
import { PROJECTS_DATA } from '../data/projectsData';
import { BADGES_DATA } from '../data/badgesData';
import { DEFAULT_ANNOUNCEMENTS } from '../data/defaultAnnouncements';
import { soundManager } from '../utils/audioFx';
import {
  AppLanguage,
  loadSavedLanguage,
  saveLanguagePreference,
  getOgLocale,
} from '../utils/i18n';
import {
  localizeModule,
  localizeProject,
  localizeBadge,
  localizeAnnouncement,
} from '../locales/curriculumEn';
import {
  fetchGithubUserAndRepos,
  submitProjectFromGithubRepo,
  setSessionGithubToken,
  clearSessionGithubToken,
  GithubSyncResult,
  GithubProjectSubmitResult,
} from '../utils/githubService';
import {
  REQUIRED_QUIZ_SCORE,
  evaluateLessonQuiz,
  getProjectInteractiveExercise,
  validateExerciseCode,
} from '../utils/codeRunner';
import {
  DEFAULT_ADSENSE_CONFIG,
  shouldShowAdsForUser,
  checkRewardedAdEligibility,
  ensureAdSenseScriptLoaded,
} from '../utils/adsense';
import {
  getNextThemePreference,
  parseThemePreference,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from '../utils/theme';
import {
  buildPublicPath,
  detectEmbeddedWebViewRuntime,
  detectInstalledMobileAppRuntime,
  getPublicRouteSeoMetadata,
  isPublicTab,
  normalizePathname,
  parsePublicLocation,
  SITE_BASE_URL,
} from '../utils/publicRoutes';
import {
  validateEmailFormat,
  authenticateUserCredentials,
  validateAndCreateUser,
  canSwitchToUser,
  canResetUserPassword,
  sanitizeImportedUser,
  createGuestUser,
  classifyGoogleAuthError,
  classifyEmailAuthError,
  GoogleAuthErrorClassification,
  EmailAuthErrorClassification,
} from '../utils/authValidation';
import {
  DEFAULT_REMINDER_SETTINGS,
  formatLocalDateKey,
  getMsUntilNextReminder,
  shouldTriggerDailyReminderNow,
  buildDailyGoalNotificationPayload,
  getNotificationPermissionState,
  requestBrowserNotificationPermission,
  sendServiceWorkerNotification,
  syncScheduleWithServiceWorker,
} from '../utils/pushNotifications';
import {
  calculateLevel, 
  updateStreak, 
  checkBadgesToUnlock, 
  findWeakAreas,
  calculateRegeneratedLives,
  applyRegeneratedLives,
  claimIdempotentReward,
  deductLife,
  addLife,
  refillAllLives,
  buyHeartWithXP,
  buyFullRefillWithXP,
  buyStreakFreezeWithXP,
  setProStatus,
  LivesCalculationResult,
  XP_COST_ONE_HEART,
  XP_COST_FULL_REFILL,
  XP_COST_STREAK_FREEZE
} from '../utils/gamification';
import {
  VISITOR_ID_STORAGE_KEY,
  VISITOR_SESSION_STORAGE_KEY,
  VISITOR_REFERRER_STORAGE_KEY,
  VISITOR_UTM_STORAGE_KEY,
  generateSafeTelemetryId,
  isValidTelemetryToken,
  normalizeReferrerHost,
  extractUtmSource,
  detectDeviceType,
  normalizeVisitedPath,
  shouldDeduplicatePageview,
  buildVisitorEventWritePayload,
  buildVisitorPresenceWritePayload,
} from '../utils/visitorAnalytics';
import { shouldSkipTelemetryInEnvironment } from '../utils/cloudSync';
import {
  auth,
  onAuthStateChanged,
  signInWithGoogleFirebase,
  resolveGoogleRedirectSignIn,
  isGoogleRedirectPending,
  clearGoogleRedirectPending,
  buildVerifiedFallbackUser,
  signUpWithEmailFirebase,
  signInWithEmailFirebase,
  sendPasswordResetFirebase,
  updateFirebaseUserProfile,
  signOutFromFirebase,
  trackFirebaseEvent,
  fetchOrCreateCloudUserProfile,
  saveUserProfileToCloud,
  verifyLessonExerciseInCloud,
  submitQuizAnswersToCloud,
  completeLessonInCloud,
  completeProjectInCloud,
  claimActivityRewardInCloud,
  updateLivesInCloud,
  setUserStatusInCloud,
  setUserProStatusInCloud,
  deleteUserProfileFromCloud,
  CloudLifeAction,
  subscribeToUserProfile,
  subscribeToCloudAnnouncements,
  subscribeAllUsersForAdmin,
  recordVisitorEventToCloud,
  upsertVisitorPresenceToCloud,
  saveAnnouncementToCloud,
  deleteAnnouncementFromCloud,
  isFirestoreQuotaCircuitOpen,
} from '../firebase';

export type AppTab = 
  | 'landing'
  | 'knowledge_base'
  | 'public_lesson'
  | 'about'
  | 'contact'
  | 'terms'
  | 'privacy'
  | 'dashboard' 
  | 'modules' 
  | 'lesson' 
  | 'editor' 
  | 'projects' 
  | 'reviews' 
  | 'certificate' 
  | 'admin' 
  | 'deployment'
  | 'terminal'
  | 'sql_studio'
  | 'interview'
  | 'api_studio'
  | 'event_loop'
  | 'leaderboard'
  | 'flashcards'
  | 'career';

interface AppContextType {
  currentUser: User;
  isAuthenticated: boolean;
  isCloudConnected: boolean;
  isSyncingCloud: boolean;
  firebaseUid: string | null;
  allUsers: User[];
  activeTab: AppTab;
  selectedLessonId: string | null;
  selectedProjectId: string | null;
  announcements: Announcement[];
  localizedAnnouncements: Announcement[];
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  allModules: Module[];
  allProjects: Project[];
  allBadges: Badge[];
  theme: ResolvedTheme;
  themePreference: ThemePreference;
  toast: { message: string; type: 'success' | 'info' | 'badge' | 'danger' } | null;
  livesInfo: LivesCalculationResult;
  isLivesModalOpen: boolean;
  isSubModalOpen: boolean;
  setIsLivesModalOpen: (open: boolean) => void;
  setIsSubModalOpen: (open: boolean) => void;
  loseLife: (reason?: string) => boolean;
  refillLives: () => void;
  earnPracticeLife: (answers: number[]) => void;
  earnAdRewardLife: () => { success: boolean; message: string };
  adSenseConfig: AdSenseConfig;
  updateAdSenseConfig: (partial: Partial<AdSenseConfig>) => void;
  buyHeart: () => boolean;
  buyRefill: () => boolean;
  buyFreeze: () => boolean;
  togglePro: (enable: boolean, plan?: 'monthly' | 'yearly') => void;
  setThemePreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
  setActiveTab: (tab: AppTab, lessonId?: string, projectId?: string) => void;
  loginUser: (
    email: string,
    password?: string
  ) => Promise<{
    success: boolean;
    error?: string;
    classification?: EmailAuthErrorClassification;
  }>;
  loginWithGoogle: () => Promise<{
    success: boolean;
    redirecting?: boolean;
    error?: string;
    classification?: GoogleAuthErrorClassification;
  }>;
  syncNowToCloud: () => Promise<boolean>;
  registerUser: (params: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    antiBotPassed: boolean;
    antiBotScore?: number;
    bio?: string;
  }) => Promise<{
    success: boolean;
    user?: User;
    error?: string;
    classification?: EmailAuthErrorClassification;
  }>;
  updateCurrentUserProfile: (partial: {
    name?: string;
    bio?: string;
    password?: string;
    weeklyGoalMinutes?: number;
  }) => Promise<{
    success: boolean;
    message: string;
    classification?: EmailAuthErrorClassification;
  }>;
  switchUser: (userId: string) => void;
  logout: () => void;
  deleteUser: (userId: string) => void;
  setUserStatus: (userId: string, status: UserStatus, reason?: string) => void;
  resetUserPassword: (
    email: string
  ) => Promise<{
    success: boolean;
    message: string;
    classification?: EmailAuthErrorClassification;
  }>;
  verifyUserAntiBot: (userId: string) => void;
  giveProByAdmin: (userId: string, isPro: boolean, plan?: 'monthly' | 'yearly') => void;
  refillUserLivesByAdmin: (userId: string) => void;
  completeLesson: (lessonId: string, xpReward: number, answers?: Record<string, number>) => void;
  saveQuizScore: (lessonId: string, scorePercent: number, answers: Record<string, number>) => void;
  verifyLessonExercise: (exerciseId: string, code: { html: string; css: string; js: string }) => Promise<boolean>;
  saveCodeSnippet: (exerciseId: string, code: { html: string; css: string; js: string }) => void;
  completeProject: (projectId: string, xpReward: number, code?: { html: string; css: string; js: string }) => void;
  isSyncingGithub: boolean;
  linkGithubAccount: (usernameOrUrl: string, token?: string) => Promise<GithubSyncResult>;
  refreshGithubSync: (token?: string) => Promise<GithubSyncResult>;
  unlinkGithubAccount: () => void;
  submitProjectFromGithub: (
    projectId: string,
    repoIdentifier: string,
    token?: string
  ) => Promise<GithubProjectSubmitResult>;
  addAnnouncement: (title: string, content: string, category: Announcement['category']) => void;
  deleteAnnouncement: (id: string) => void;
  updateUserByAdmin: (userId: string, partial: Partial<User>) => void;
  dismissToast: () => void;
  weakAreas: ReviewItem[];
  allLessons: Lesson[];
  isSoundMuted: boolean;
  toggleSound: () => void;
  // Daily Goal & Service Worker Push Notifications
  reminderSettings: DailyReminderSettings;
  notificationPermission: NotificationPermission | 'unsupported';
  todaySpentMinutes: number;
  dailyGoalMinutes: number;
  nextReminderInMs: number | null;
  requestNotificationPermission: () => Promise<NotificationPermission | 'unsupported'>;
  updateReminderSettings: (partial: Partial<DailyReminderSettings>) => void;
  triggerGoalReminderNow: (isTest?: boolean) => Promise<boolean>;
  awardCustomXp: (xpAmount: number, reason: string, rewardId?: string, proof?: Record<string, unknown>) => boolean;
  importUserBackup: (restoredUser: User) => void;
  securityLogs: SecurityAuditEvent[];
  clearSecurityLogs: () => void;
}

const STORAGE_KEY_USER = 'fsda_current_user_v7';
const STORAGE_KEY_AUTH = 'fsda_is_authenticated_v7';
const STORAGE_KEY_USERS = 'fsda_all_users_v7';
const STORAGE_KEY_ANNOUNCEMENTS = 'fsda_announcements_v5';
const STORAGE_KEY_THEME = THEME_STORAGE_KEY;
const STORAGE_KEY_REMINDERS = 'fsda_reminder_settings_v1';
const STORAGE_KEY_SECURITY_LOGS = 'fsda_security_logs_v1';
const STORAGE_KEY_ADSENSE_CONFIG = 'fsda_adsense_config_v1';

const LEGACY_TEST_USER_IDS = new Set([
  'user-student-anna',
  'user-student-piotr',
  'user-bot-blocked',
]);

const DEFAULT_SECURITY_LOGS: SecurityAuditEvent[] = [
  {
    id: 'sec-1',
    timestamp: '2026-10-24 10:15:02',
    type: 'auth_blocked',
    severity: 'critical',
    actorEmail: 'scraper@spambot.io',
    actorRole: 'student',
    action: 'Zablokowano automatyczny skrypt (Honeypot Anty-Bot)',
    details: 'Wykryto próbę rejestracji bota (czas wypełnienia formularza < 200ms). Konto oznaczono statusem BANNED.',
  },
  {
    id: 'sec-2',
    timestamp: '2026-10-24 11:04:19',
    type: 'route_blocked',
    severity: 'warning',
    actorEmail: 'gosc@fullstack-academy.pl',
    actorRole: 'guest',
    action: 'ProtectedRoute zablokował dostęp Gościa do sekcji chronionej',
    details: 'Niezalogowany użytkownik (Gość) próbował wyświetlić chronioną zawartość kursu bez logowania.',
  },
  {
    id: 'sec-3',
    timestamp: '2026-10-24 11:30:45',
    type: 'auth_blocked',
    severity: 'critical',
    actorEmail: 'zordonzordon1@gmail.com',
    actorRole: 'guest',
    action: 'Odrzucono próbę logowania hasłem na konto Administratora',
    details: 'Konto właściciela platformy wymaga uwierzytelnienia Google Firebase OAuth.',
  },
];

const DEFAULT_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Administrator (Zordon)',
    email: 'zordonzordon1@gmail.com',
    role: 'admin',
    status: 'active',
    antiBotVerified: true,
    antiBotScore: 100,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    xp: 9999,
    level: 10,
    streakDays: 45,
    lastActiveDate: new Date().toISOString().split('T')[0],
    weeklyGoalMinutes: 300,
    weeklySpentMinutes: 280,
    completedLessons: [
      'fund-1', 'html-1', 'html-2', 'html-3', 'html-4', 'html-5',
      'css-1', 'js-1', 'react-1', 'react-2', 'node-1', 'db-1', 'sec-1'
    ],
    completedProjects: ['proj-1', 'proj-2', 'proj-3', 'proj-4'],
    quizScores: {
      'fund-1': 100,
      'html-1': 100,
      'html-2': 100,
      'html-3': 100,
      'html-4': 100,
      'html-5': 100,
      'css-1': 100,
      'js-1': 100,
      'react-1': 100,
      'react-2': 100,
      'node-1': 100,
      'db-1': 100,
      'sec-1': 100,
    },
    unlockedBadges: [
      'first-step',
      'html-master',
      'quiz-ace',
      'streak-3',
      'streak-7',
      'xp-500',
      'xp-1500',
      'project-first'
    ],
    savedCode: {},
    lives: 5,
    maxLives: 5,
    isPro: true,
    proPlan: 'lifetime',
    streakFreezes: 5,
    bio: 'Główny Administrator i Architekt Akademii Full Stack Developer.',
    createdAt: '2026-09-01',
  },
];


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      if (stored) {
        const parsed: User[] = JSON.parse(stored)
          .filter((u: User) => !LEGACY_TEST_USER_IDS.has(u.id))
          .map((u: User) => {
            const isOwnerAdmin =
              u.id === 'user-admin' || u.email.trim().toLowerCase() === 'zordonzordon1@gmail.com';
            if (isOwnerAdmin) {
              const { password: _removed, ...rest } = u;
              return { ...rest, role: 'admin' as UserRole };
            }
            return { ...u, role: 'student' as UserRole };
          });
        const existingIds = new Set(parsed.map((u) => u.id));
        const missingDefaults = DEFAULT_USERS.filter((d) => !existingIds.has(d.id));
        return [...parsed, ...missingDefaults];
      }
      return DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  const [language, setLanguageState] = useState<AppLanguage>(() => loadSavedLanguage());
  const languageRef = useRef<AppLanguage>(language);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const setLanguage = useCallback((nextLang: AppLanguage) => {
    setLanguageState(nextLang);
    saveLanguagePreference(nextLang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = nextLang;
      const ogLocale = document.querySelector('meta[property="og:locale"]');
      if (ogLocale) {
        ogLocale.setAttribute('content', getOgLocale(nextLang));
      }
    }
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const storedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (storedAuth !== null && storedUser !== null) {
        const parsedUser: User = JSON.parse(storedUser);
        if (
          parsedUser &&
          parsedUser.id &&
          parsedUser.id !== 'user-guest' &&
          !LEGACY_TEST_USER_IDS.has(parsedUser.id)
        ) {
          return JSON.parse(storedAuth) === true;
        }
      }
      return false;
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const initialLang = loadSavedLanguage();
    try {
      const storedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      if (storedAuth === null || JSON.parse(storedAuth) !== true) {
        return createGuestUser(initialLang);
      }
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        const parsed: User = JSON.parse(stored);
        if (!parsed || !parsed.id || parsed.id === 'user-guest' || LEGACY_TEST_USER_IDS.has(parsed.id)) {
          return createGuestUser(initialLang);
        }
        // Never restore an admin session from localStorage without active verified Firebase OAuth
        const hasVerifiedFirebaseAdmin =
          Boolean(auth.currentUser?.emailVerified) &&
          (auth.currentUser?.email || '').trim().toLowerCase() === 'zordonzordon1@gmail.com';
        if (
          (parsed.role === 'admin' ||
            parsed.id === 'user-admin' ||
            (parsed.email || '').trim().toLowerCase() === 'zordonzordon1@gmail.com') &&
          !hasVerifiedFirebaseAdmin
        ) {
          return createGuestUser(initialLang);
        }
        return parsed.role === 'admin' && !hasVerifiedFirebaseAdmin
          ? { ...parsed, role: 'student' }
          : parsed;
      }
      return createGuestUser(initialLang);
    } catch {
      return createGuestUser(initialLang);
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS);
      return stored ? JSON.parse(stored) : DEFAULT_ANNOUNCEMENTS;
    } catch {
      return DEFAULT_ANNOUNCEMENTS;
    }
  });

  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(() => {
    try {
      return parseThemePreference(localStorage.getItem(STORAGE_KEY_THEME));
    } catch {
      return 'dark';
    }
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    try {
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
    } catch {
      return true;
    }
  });

  const theme: ResolvedTheme = resolveTheme(themePreference, systemPrefersDark);

  const [activeTab, setActiveTabState] = useState<AppTab>(() => {
    try {
      const validTabs: AppTab[] = [
        'landing',
        'knowledge_base',
        'public_lesson',
        'about',
        'contact',
        'terms',
        'privacy',
        'dashboard',
        'modules',
        'lesson',
        'editor',
        'projects',
        'reviews',
        'certificate',
        'terminal',
        'sql_studio',
        'interview',
        'api_studio',
        'event_loop',
        'leaderboard',
        'flashcards',
        'career',
        'admin',
        'deployment',
      ];
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as AppTab | null;
      if (tabParam && validTabs.includes(tabParam)) {
        return tabParam;
      }

      const host = (window.location.hostname || '').toLowerCase();
      const path = window.location.pathname || '/';
      const normalizedPath = normalizePathname(path);
      const isAppSubdomainOrPath =
        host.startsWith('app.') ||
        host.startsWith('app-') ||
        normalizedPath.toLowerCase() === '/app' ||
        normalizedPath.toLowerCase().startsWith('/app/');

      if (isAppSubdomainOrPath) {
        return 'dashboard';
      }

      if (normalizedPath === '/' && detectInstalledMobileAppRuntime()) {
        if (!detectEmbeddedWebViewRuntime()) {
          try {
            window.history.replaceState(null, '', '/app');
          } catch {
            // ignore history errors
          }
        }
        return 'dashboard';
      }

      const parsedPublic = parsePublicLocation(path);
      return parsedPublic ? parsedPublic.tab : 'landing';
    } catch {
      return 'landing';
    }
  });
  const activeTabRef = useRef<AppTab>(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(() => {
    try {
      const parsedPublic = parsePublicLocation(window.location.pathname || '/');
      if (parsedPublic?.lessonId) return parsedPublic.lessonId;
    } catch {
      // ignore window errors
    }
    return 'html-7';
  });
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('proj-1');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'badge' | 'danger' } | null>(null);
  const [securityLogs, setSecurityLogs] = useState<SecurityAuditEvent[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SECURITY_LOGS);
      return stored ? JSON.parse(stored) : DEFAULT_SECURITY_LOGS;
    } catch {
      return DEFAULT_SECURITY_LOGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SECURITY_LOGS, JSON.stringify(securityLogs));
    } catch {
      // ignore storage errors
    }
  }, [securityLogs]);

  // Google AdSense Configuration State (for Free Accounts)
  const [adSenseConfig, setAdSenseConfig] = useState<AdSenseConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ADSENSE_CONFIG);
      if (stored) {
        const parsed = JSON.parse(stored);
        const resolvedClientId =
          !parsed.clientId || parsed.clientId === 'ca-pub-7482910384756192'
            ? DEFAULT_ADSENSE_CONFIG.clientId
            : parsed.clientId;
        return {
          ...DEFAULT_ADSENSE_CONFIG,
          ...parsed,
          clientId: resolvedClientId,
          slots: { ...DEFAULT_ADSENSE_CONFIG.slots, ...(parsed.slots || {}) },
          placements: { ...DEFAULT_ADSENSE_CONFIG.placements, ...(parsed.placements || {}) },
        };
      }
      return DEFAULT_ADSENSE_CONFIG;
    } catch {
      return DEFAULT_ADSENSE_CONFIG;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ADSENSE_CONFIG, JSON.stringify(adSenseConfig));
    } catch {
      // ignore storage errors
    }
  }, [adSenseConfig]);

  // Dynamically load Google AdSense SDK ONLY when a free-tier authenticated student is active
  useEffect(() => {
    if (shouldShowAdsForUser(currentUser, isAuthenticated, adSenseConfig)) {
      ensureAdSenseScriptLoaded(adSenseConfig.clientId);
    }
  }, [currentUser, isAuthenticated, adSenseConfig]);

  const updateAdSenseConfig = useCallback((partial: Partial<AdSenseConfig>) => {
    setAdSenseConfig((prev) => ({
      ...prev,
      ...partial,
      slots: partial.slots ? { ...prev.slots, ...partial.slots } : prev.slots,
      placements: partial.placements ? { ...prev.placements, ...partial.placements } : prev.placements,
    }));
  }, []);

  const appendSecurityLog = useCallback(
    (entry: Omit<SecurityAuditEvent, 'id' | 'timestamp'>) => {
      const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
      setSecurityLogs((prev) => [
        {
          ...entry,
          id: `sec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: nowStr,
        },
        ...prev.slice(0, 99),
      ]);
    },
    []
  );

  const clearSecurityLogs = useCallback(() => {
    setSecurityLogs([]);
  }, []);

  // Firebase Auth & Firestore Cloud State
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const [isSyncingGithub, setIsSyncingGithub] = useState<boolean>(false);
  const lastCloudSyncHashRef = useRef<string>('');
  const pendingCloudProfileRef = useRef<{ name?: string; bio?: string } | null>(null);
  const currentUserRef = useRef<User>(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(() => soundManager.getIsMuted());

  const toggleSound = () => {
    const next = soundManager.toggleMute();
    setIsSoundMuted(next);
  };

  // Daily Goal & Service Worker Push Reminder State
  const [reminderSettings, setReminderSettings] = useState<DailyReminderSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REMINDERS);
      if (stored) {
        return { ...DEFAULT_REMINDER_SETTINGS, ...JSON.parse(stored) };
      }
      if (currentUser.reminderSettings) {
        return { ...DEFAULT_REMINDER_SETTINGS, ...currentUser.reminderSettings };
      }
      return DEFAULT_REMINDER_SETTINGS;
    } catch {
      return DEFAULT_REMINDER_SETTINGS;
    }
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(() =>
    getNotificationPermissionState()
  );

  const [nextReminderInMs, setNextReminderInMs] = useState<number | null>(() =>
    getMsUntilNextReminder(reminderSettings.reminderTime, reminderSettings.daysOfWeek)
  );

  // Gamification & Subscription modals
  const [isLivesModalOpen, setIsLivesModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  // Lives calculation state
  const [livesInfo, setLivesInfo] = useState<LivesCalculationResult>(() => 
    calculateRegeneratedLives(currentUser)
  );

  // Live countdown and heart regeneration timer
  useEffect(() => {
    const interval = setInterval(() => {
      const { user: userWithRegen, info: updated, changed } = applyRegeneratedLives(currentUser);
      setLivesInfo(updated);

      // If hearts were regenerated over time, persist to user state with advanced timestamp
      if (changed) {
        setCurrentUser(userWithRegen);
        setAllUsers((users) => users.map((u) => (u.id === userWithRegen.id ? userWithRegen : u)));
        syncLifeAction('regenerate');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser]);

  // Localized curriculum & catalog selectors
  const allModules: Module[] = useMemo(
    () => MODULES_DATA.map((m) => localizeModule(m, language)),
    [language]
  );
  const allLessons: Lesson[] = useMemo(
    () => allModules.flatMap((m) => m.lessons),
    [allModules]
  );
  const allProjects: Project[] = useMemo(
    () => PROJECTS_DATA.map((p) => localizeProject(p, language)),
    [language]
  );
  const allBadges: Badge[] = useMemo(
    () => BADGES_DATA.map((b) => localizeBadge(b, language)),
    [language]
  );
  const localizedAnnouncements: Announcement[] = useMemo(
    () => announcements.map((a) => localizeAnnouncement(a, language)),
    [announcements, language]
  );
  const localizedSecurityLogs: SecurityAuditEvent[] = useMemo(() => {
    if (language !== 'en') return securityLogs;
    return securityLogs.map((log) => {
      if (log.id === 'sec-1') {
        return {
          ...log,
          action: 'Blocked automated script (Anti-Bot Honeypot)',
          details: 'Bot registration attempt detected (form filled in < 200ms). Account marked as BANNED.',
        };
      }
      if (log.id === 'sec-2') {
        return {
          ...log,
          action: 'ProtectedRoute blocked Guest access to protected area',
          details: 'Signed-out user (Guest) attempted to view protected course content without signing in.',
        };
      }
      if (log.id === 'sec-3') {
        return {
          ...log,
          action: 'Rejected password login attempt on Administrator account',
          details: 'Platform owner account requires Google Firebase OAuth authentication.',
        };
      }
      return log;
    });
  }, [securityLogs, language]);
  const localizedCurrentUser: User = useMemo(() => {
    if (currentUser.id === 'user-guest') {
      const template = createGuestUser(language);
      return { ...currentUser, name: template.name, bio: template.bio };
    }
    return currentUser;
  }, [currentUser, language]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(isAuthenticated));
    } catch (e) {
      console.warn('Auth storage sync error', e);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(allUsers));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [allUsers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(announcements));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [announcements]);

  // Subscribe to Firebase Auth state and connect to Firestore when authenticated
  useEffect(() => {
    let unsubProfile: (() => void) | null = null;
    let unsubAnnouncements: (() => void) | null = null;
    let unsubAllUsers: (() => void) | null = null;

    // Resolve any pending Google OAuth redirect sign-in (mobile TWA / Expo WebView / standalone PWA)
    const hadPendingGoogleRedirect = isGoogleRedirectPending();
    if (hadPendingGoogleRedirect) {
      setIsSyncingCloud(true);
    }

    void resolveGoogleRedirectSignIn()
      .then((redirectUser) => {
        if (redirectUser) {
          trackFirebaseEvent('login', { method: 'google_redirect' });
          soundManager.playLevelUp();
          const isEnLang = languageRef.current === 'en';
          showToast(
            isEnLang
              ? `Signed in with Google! Welcome, ${redirectUser.displayName || redirectUser.email || 'Developer'}.`
              : `Zalogowano przez Google! Witaj, ${redirectUser.displayName || redirectUser.email || 'Programisto'}.`,
            'badge'
          );
          if (activeTabRef.current === 'landing') {
            setActiveTab('dashboard');
          }
        } else if (hadPendingGoogleRedirect && !auth.currentUser) {
          setIsSyncingCloud(false);
        }
      })
      .catch((err) => {
        if (!auth.currentUser) {
          setIsSyncingCloud(false);
        }
        const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        const classification = classifyGoogleAuthError(err, currentHostname, languageRef.current);
        showToast(classification.toastMessage, 'danger');
      });

    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }
      if (unsubAnnouncements) {
        unsubAnnouncements();
        unsubAnnouncements = null;
      }
      if (unsubAllUsers) {
        unsubAllUsers();
        unsubAllUsers = null;
      }

      if (fbUser) {
        setFirebaseUid(fbUser.uid);
        setIsCloudConnected(true);
        setIsSyncingCloud(true);
        try {
          const cloudProfile = await fetchOrCreateCloudUserProfile(
            fbUser,
            currentUserRef.current,
            pendingCloudProfileRef.current ?? undefined
          );
          if (cloudProfile.status && cloudProfile.status !== 'active') {
            await signOutFromFirebase();
            setFirebaseUid(null);
            setIsCloudConnected(false);
            setIsAuthenticated(false);
            setCurrentUser(createGuestUser(languageRef.current));
            return;
          }
          lastCloudSyncHashRef.current = JSON.stringify({
            xp: cloudProfile.xp,
            level: cloudProfile.level,
            streakDays: cloudProfile.streakDays,
            streakFreezes: cloudProfile.streakFreezes,
            lastActiveDate: cloudProfile.lastActiveDate,
            lives: cloudProfile.lives,
            isPro: cloudProfile.isPro,
            proPlan: cloudProfile.proPlan ?? null,
            name: cloudProfile.name,
            bio: cloudProfile.bio,
            avatar: cloudProfile.avatar,
            weeklyGoalMinutes: cloudProfile.weeklyGoalMinutes,
            savedCode: cloudProfile.savedCode,
            githubIntegration: cloudProfile.githubIntegration,
            completedLessons: cloudProfile.completedLessons,
            completedProjects: cloudProfile.completedProjects,
            unlockedBadges: cloudProfile.unlockedBadges,
            claimedRewards: cloudProfile.claimedRewards,
            quizScores: cloudProfile.quizScores,
          });
          setCurrentUser(cloudProfile);
          setIsAuthenticated(true);
          setLivesInfo(calculateRegeneratedLives(cloudProfile));
          setAllUsers((prev) => {
            const exists = prev.some((u) => u.id === cloudProfile.id);
            if (exists) {
              return prev.map((u) => (u.id === cloudProfile.id ? cloudProfile : u));
            }
            return [cloudProfile, ...prev];
          });

          unsubProfile = subscribeToUserProfile(fbUser.uid, (remoteUser) => {
            const remoteHash = JSON.stringify({
              xp: remoteUser.xp,
              level: remoteUser.level,
              streakDays: remoteUser.streakDays,
              streakFreezes: remoteUser.streakFreezes,
              lastActiveDate: remoteUser.lastActiveDate,
              lives: remoteUser.lives,
              isPro: remoteUser.isPro,
              proPlan: remoteUser.proPlan ?? null,
              name: remoteUser.name,
              bio: remoteUser.bio,
              avatar: remoteUser.avatar,
              weeklyGoalMinutes: remoteUser.weeklyGoalMinutes,
              savedCode: remoteUser.savedCode,
              githubIntegration: remoteUser.githubIntegration,
              completedLessons: remoteUser.completedLessons,
              completedProjects: remoteUser.completedProjects,
              unlockedBadges: remoteUser.unlockedBadges,
              claimedRewards: remoteUser.claimedRewards,
              quizScores: remoteUser.quizScores,
            });
            if (remoteHash !== lastCloudSyncHashRef.current) {
              lastCloudSyncHashRef.current = remoteHash;
              setCurrentUser(remoteUser);
              setLivesInfo(calculateRegeneratedLives(remoteUser));
              setAllUsers((prev) =>
                prev.map((u) => (u.id === remoteUser.id ? remoteUser : u))
              );
            }
          });

          unsubAnnouncements = subscribeToCloudAnnouncements((remoteAnns) => {
            if (remoteAnns.length > 0) {
              setAnnouncements(remoteAnns);
            }
          });
        } catch (err) {
          console.error('Failed to initialize cloud user profile:', err);
          // Even if Firestore temporarily fails, honor the verified Firebase Auth session
          const fallbackProfile = buildVerifiedFallbackUser(fbUser);
          setCurrentUser(fallbackProfile);
          setIsAuthenticated(true);
          setLivesInfo(calculateRegeneratedLives(fallbackProfile));
        } finally {
          clearGoogleRedirectPending();
          setIsSyncingCloud(false);
        }
      } else {
        setFirebaseUid(null);
        setIsCloudConnected(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
      if (unsubAnnouncements) unsubAnnouncements();
      if (unsubAllUsers) unsubAllUsers();
    };
  }, []);

  // Lazy-subscribe to all users list ONLY when an authenticated admin opens the Admin Panel
  useEffect(() => {
    if (
      !isAuthenticated ||
      !isCloudConnected ||
      currentUser.role !== 'admin' ||
      activeTab !== 'admin' ||
      isFirestoreQuotaCircuitOpen()
    ) {
      return;
    }

    const unsub = subscribeAllUsersForAdmin((remoteUsers) => {
      if (remoteUsers.length === 0) return;
      setAllUsers((prev) => {
        const byId = new Map<string, User>();
        for (const u of prev) byId.set(u.id, u);
        for (const ru of remoteUsers) {
          const existing = byId.get(ru.id);
          byId.set(ru.id, existing ? { ...existing, ...ru } : ru);
        }
        return Array.from(byId.values());
      });
    });

    return () => unsub();
  }, [isAuthenticated, isCloudConnected, currentUser.role, activeTab]);

  // Automatic real visitor telemetry & active presence tracking (Firestore, anonymized, zero PII)
  const lastTrackedVisitRef = useRef<{ key: string | null; atMs: number }>({
    key: null,
    atMs: 0,
  });
  const lastPresenceSentAtRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (
      shouldSkipTelemetryInEnvironment(window.location.hostname || '', navigator.userAgent || '') ||
      isFirestoreQuotaCircuitOpen()
    ) {
      return;
    }

    const resolveVisitorTokens = () => {
      let visitorId = '';
      let sessionId = '';
      let referrerHost = 'direct';
      let utmSource = 'none';

      try {
        const storedVisitor = localStorage.getItem(VISITOR_ID_STORAGE_KEY);
        visitorId = isValidTelemetryToken(storedVisitor)
          ? storedVisitor
          : generateSafeTelemetryId('vis');
        if (storedVisitor !== visitorId) {
          localStorage.setItem(VISITOR_ID_STORAGE_KEY, visitorId);
        }
      } catch {
        visitorId = generateSafeTelemetryId('vis');
      }

      try {
        const storedSession = sessionStorage.getItem(VISITOR_SESSION_STORAGE_KEY);
        sessionId = isValidTelemetryToken(storedSession)
          ? storedSession
          : generateSafeTelemetryId('ses');
        if (storedSession !== sessionId) {
          sessionStorage.setItem(VISITOR_SESSION_STORAGE_KEY, sessionId);
        }

        const storedRef = sessionStorage.getItem(VISITOR_REFERRER_STORAGE_KEY);
        if (storedRef) {
          referrerHost = storedRef;
        } else {
          referrerHost = normalizeReferrerHost(document.referrer || '', window.location.hostname || '');
          sessionStorage.setItem(VISITOR_REFERRER_STORAGE_KEY, referrerHost);
        }

        const currentUtm = extractUtmSource(window.location.search || '');
        const storedUtm = sessionStorage.getItem(VISITOR_UTM_STORAGE_KEY);
        if (currentUtm !== 'none') {
          utmSource = currentUtm;
          sessionStorage.setItem(VISITOR_UTM_STORAGE_KEY, utmSource);
        } else if (storedUtm) {
          utmSource = storedUtm;
        } else {
          utmSource = 'none';
          sessionStorage.setItem(VISITOR_UTM_STORAGE_KEY, utmSource);
        }
      } catch {
        if (!sessionId) sessionId = generateSafeTelemetryId('ses');
      }

      return { visitorId, sessionId, referrerHost, utmSource };
    };

    const { visitorId, sessionId, referrerHost, utmSource } = resolveVisitorTokens();
    const rawPath = window.location.pathname || '/';
    const rawSearch = window.location.search || '';
    const resolvedPublicPath = buildPublicPath(activeTab, selectedLessonId);
    const targetPath = resolvedPublicPath || (isPublicTab(activeTab) ? rawPath : '/app');
    const targetSearch = resolvedPublicPath ? rawSearch : rawSearch || `?tab=${activeTab}`;
    const normalizedPath = normalizeVisitedPath(targetPath, targetSearch);
    const deviceType = detectDeviceType(window.innerWidth, navigator.userAgent || '');

    const visitKey = `${activeTab}::${normalizedPath}`;
    const nowMs = Date.now();

    if (!shouldDeduplicatePageview(lastTrackedVisitRef.current.key, visitKey, lastTrackedVisitRef.current.atMs, nowMs)) {
      lastTrackedVisitRef.current = { key: visitKey, atMs: nowMs };
      const eventPayload = buildVisitorEventWritePayload({
        visitorId,
        sessionId,
        date: new Date(nowMs),
        pathname: normalizedPath.split('?')[0] || '/',
        search: normalizedPath.includes('?') ? normalizedPath.slice(normalizedPath.indexOf('?')) : '',
        tab: activeTab,
        referrerHost,
        utmSource,
        deviceType,
        language,
        isAuthenticated,
      });
      void recordVisitorEventToCloud(eventPayload);
    }

    if (document.visibilityState !== 'hidden' && nowMs - lastPresenceSentAtRef.current >= 300_000) {
      lastPresenceSentAtRef.current = nowMs;
      const presencePayload = buildVisitorPresenceWritePayload({
        sessionId,
        visitorId,
        pathname: normalizedPath.split('?')[0] || '/',
        search: normalizedPath.includes('?') ? normalizedPath.slice(normalizedPath.indexOf('?')) : '',
        tab: activeTab,
        referrerHost,
        deviceType: detectDeviceType(window.innerWidth, navigator.userAgent || ''),
        language,
        isAuthenticated,
      });
      void upsertVisitorPresenceToCloud(presencePayload);
    }
  }, [activeTab, selectedLessonId, language, isAuthenticated]);

  // Automatically sync currentUser changes to Cloud Firestore when connected via Firebase Auth
  useEffect(() => {
    if (
      !firebaseUid ||
      !isCloudConnected ||
      currentUser.id !== firebaseUid ||
      isFirestoreQuotaCircuitOpen()
    ) {
      return;
    }

    const currentHash = JSON.stringify({
      xp: currentUser.xp,
      level: currentUser.level,
      streakDays: currentUser.streakDays,
      streakFreezes: currentUser.streakFreezes,
      lastActiveDate: currentUser.lastActiveDate,
      lives: currentUser.lives,
      isPro: currentUser.isPro,
      name: currentUser.name,
      bio: currentUser.bio,
      avatar: currentUser.avatar,
      weeklyGoalMinutes: currentUser.weeklyGoalMinutes,
      savedCode: currentUser.savedCode,
      githubIntegration: currentUser.githubIntegration,
      completedLessons: currentUser.completedLessons,
      completedProjects: currentUser.completedProjects,
      unlockedBadges: currentUser.unlockedBadges,
      claimedRewards: currentUser.claimedRewards,
      quizScores: currentUser.quizScores,
    });

    if (currentHash === lastCloudSyncHashRef.current) return;
    lastCloudSyncHashRef.current = currentHash;

    const timer = setTimeout(async () => {
      setIsSyncingCloud(true);
      await saveUserProfileToCloud(firebaseUid, currentUser, true);
      setIsSyncingCloud(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentUser, firebaseUid, isCloudConnected]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const syncMatches = (matches: boolean) => {
      setSystemPrefersDark(matches);
    };
    const handleChange = (event: MediaQueryListEvent) => {
      syncMatches(event.matches);
    };
    syncMatches(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    const legacyQuery = mediaQuery as MediaQueryList & {
      addListener?: (cb: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (cb: (event: MediaQueryListEvent) => void) => void;
    };
    legacyQuery.addListener?.(handleChange);
    return () => legacyQuery.removeListener?.(handleChange);
  }, [themePreference]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, themePreference);
      const root = document.documentElement;
      root.dataset.themePreference = themePreference;
      root.style.colorScheme = theme;
      if (theme === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
      } else {
        root.classList.remove('light');
        root.classList.add('dark');
      }
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', theme === 'light' ? '#f8fafc' : '#4f46e5');
      }
    } catch (e) {
      console.warn('Theme storage error', e);
    }
  }, [theme, themePreference]);

  const setThemePreference = useCallback((preference: ThemePreference) => {
    if (preference === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      setSystemPrefersDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    setThemePreferenceState(preference);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemePreferenceState((prev) => {
      const next = getNextThemePreference(prev);
      if (next === 'system' && typeof window !== 'undefined' && window.matchMedia) {
        setSystemPrefersDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
      return next;
    });
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'badge' | 'danger' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const dismissToast = () => setToast(null);

  const syncLifeAction = (action: CloudLifeAction, targetUid?: string, proof?: Record<string, unknown>) => {
    if (!firebaseUid || !isCloudConnected) return;
    const isEn = languageRef.current === 'en';
    void updateLivesInCloud(action, targetUid, proof).then((res) => {
      if (res.status === 'rejected') {
        showToast(
          isEn ? 'Failed to confirm heart update in the cloud.' : 'Nie udało się potwierdzić zmiany serc w chmurze.',
          'danger'
        );
      }
    });
  };

  // Lives management actions
  const loseLife = (reason?: string): boolean => {
    const isEn = languageRef.current === 'en';
    if (currentUser.isPro) {
      // PRO members have unlimited lives!
      return false;
    }

    const currentLives = typeof currentUser.lives === 'number' ? currentUser.lives : 5;
    if (currentLives <= 0) {
      showToast(
        isEn
          ? 'No hearts left! Refill hearts in the Shop or complete a quick review.'
          : 'Brak serc! Odnów serca w Sklepie lub wykonaj szybką powtórkę.',
        'danger'
      );
      setIsLivesModalOpen(true);
      return false;
    }

    const result = deductLife(currentUser);
    setCurrentUser(result.updatedUser);
    setAllUsers((users) => users.map((u) => (u.id === result.updatedUser.id ? result.updatedUser : u)));
    setLivesInfo(calculateRegeneratedLives(result.updatedUser));
    syncLifeAction('lose');

    const remaining = result.updatedUser.lives;
    soundManager.playHeartLost();
    showToast(
      reason ||
        (isEn
          ? `Lost 1 heart! Remaining: ${remaining}/5. Learn from your mistakes!`
          : `Tracisz 1 serce! Zostało: ${remaining}/5. Ucz się na błędach!`),
      remaining === 0 ? 'danger' : 'info'
    );

    if (remaining === 0) {
      setIsLivesModalOpen(true);
    }

    return true;
  };

  const refillLives = () => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    const result = buyFullRefillWithXP(currentUser, lang);
    if (!result.success) {
      showToast(result.error || (isEn ? 'Unable to refill hearts.' : 'Nie można odnowić serc.'), 'danger');
      return;
    }
    setCurrentUser(result.user);
    setAllUsers((users) => users.map((u) => (u.id === result.user.id ? result.user : u)));
    setLivesInfo(calculateRegeneratedLives(result.user));
    syncLifeAction('buy-refill');
    showToast(isEn ? 'All hearts refilled (5/5)!' : 'Wszystkie serca zostały odnowione (5/5)!', 'success');
  };

  const earnPracticeLife = (answers: number[]) => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    const todayKey = new Date().toISOString().slice(0, 10);
    if (currentUser.lastPracticeRewardDate === todayKey) {
      showToast(
        isEn ? 'Quick review reward has already been claimed today.' : 'Nagroda za szybką powtórkę została już odebrana dzisiaj.',
        'info'
      );
      return;
    }
    const maxLives = currentUser.maxLives ?? 5;
    const currentLives = typeof currentUser.lives === 'number' ? currentUser.lives : maxLives;
    if (currentUser.isPro || currentLives >= maxLives) {
      const newXp = currentUser.xp + 15;
      const levelInfo = calculateLevel(newXp, lang);
      const updated: User = {
        ...currentUser,
        xp: newXp,
        level: levelInfo.level,
        lastPracticeRewardDate: todayKey,
      };
      setCurrentUser(updated);
      setAllUsers((users) => users.map((u) => (u.id === updated.id ? updated : u)));
      syncLifeAction('practice', undefined, { answers });
      soundManager.playSuccess();
      showToast(
        isEn
          ? 'You already have 5/5 hearts — awarded a +15 XP bonus for the quick review!'
          : 'Masz już 5/5 serc — przyznano bonus +15 XP za szybką powtórkę!',
        'success'
      );
      return;
    }

    const updated = addLife(currentUser, 1);
    setCurrentUser(updated);
    setAllUsers((users) => users.map((u) => (u.id === updated.id ? updated : u)));
    syncLifeAction('practice', undefined, { answers });
    setLivesInfo(calculateRegeneratedLives(updated));
    soundManager.playSuccess();
    showToast(isEn ? '+1 Heart earned from quick review activity!' : '+1 Serce zdobyte za aktywność w powtórkach!', 'success');
  };

  const earnAdRewardLife = (): { success: boolean; message: string } => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    if (firebaseUid && isCloudConnected) {
      const message = isEn
        ? 'Ad rewards are disabled until server-side verification is enabled.'
        : 'Nagrody za reklamy są wyłączone do czasu wdrożenia weryfikacji potwierdzenia po stronie serwera.';
      showToast(message, 'info');
      return { success: false, message };
    }

    const todayKey = formatLocalDateKey(new Date());
    const nowMs = Date.now();
    const eligibility = checkRewardedAdEligibility({
      user: currentUser,
      config: adSenseConfig,
      nowMs,
      todayDateKey: todayKey,
      language: lang,
    });

    if (!eligibility.allowed) {
      const msg =
        eligibility.reason ||
        (isEn ? 'Unable to claim ad reward right now.' : 'Nie można teraz odebrać nagrody z reklamy.');
      showToast(msg, 'danger');
      return { success: false, message: msg };
    }

    const maxLives = currentUser.maxLives ?? 5;
    const currentLives = typeof currentUser.lives === 'number' ? currentUser.lives : maxLives;
    const nextDailyCount = eligibility.watchedToday + 1;

    if (currentLives >= maxLives) {
      const newXp = currentUser.xp + 20;
      const levelInfo = calculateLevel(newXp, lang);
      const updated: User = {
        ...currentUser,
        xp: newXp,
        level: levelInfo.level,
        lastAdRewardTimestamp: nowMs,
        lastAdRewardDate: todayKey,
        dailyAdRewardsCount: nextDailyCount,
      };
      setCurrentUser(updated);
      setAllUsers((users) => users.map((u) => (u.id === updated.id ? updated : u)));
      syncLifeAction('ad-reward');
      soundManager.playSuccess();
      const msg = isEn
        ? 'You already have 5/5 hearts — awarded a +20 XP bonus for watching a Google AdSense ad!'
        : 'Masz już 5/5 serc — przyznano bonus +20 XP za obejrzenie reklamy Google AdSense!';
      showToast(msg, 'success');
      return { success: true, message: msg };
    }

    const withHeart = addLife(currentUser, 1);
    const updated: User = {
      ...withHeart,
      lastPracticeRewardDate: todayKey,
      lastAdRewardTimestamp: nowMs,
      lastAdRewardDate: todayKey,
      dailyAdRewardsCount: nextDailyCount,
    };
    setCurrentUser(updated);
    setAllUsers((users) => users.map((u) => (u.id === updated.id ? updated : u)));
    syncLifeAction('ad-reward');
    setLivesInfo(calculateRegeneratedLives(updated));
    soundManager.playSuccess();
    const msg = isEn
      ? `+1 Heart earned via Google AdSense! (${updated.lives}/${maxLives} ❤️)`
      : `+1 Serce zdobyte dzięki reklamie Google AdSense! (${updated.lives}/${maxLives} ❤️)`;
    showToast(msg, 'success');
    return { success: true, message: msg };
  };

  const buyHeart = (): boolean => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    const res = buyHeartWithXP(currentUser, lang);
    if (!res.success) {
      showToast(res.error || (isEn ? 'Unable to buy heart.' : 'Nie można kupić serca.'), 'danger');
      return false;
    }
    setCurrentUser(res.user);
    setAllUsers((users) => users.map((u) => (u.id === res.user.id ? res.user : u)));
    setLivesInfo(calculateRegeneratedLives(res.user));
    syncLifeAction('buy-heart');
    showToast(
      isEn ? `Purchased 1 heart for ${XP_COST_ONE_HEART} XP!` : `Zakupiono 1 serce za ${XP_COST_ONE_HEART} XP!`,
      'success'
    );
    return true;
  };

  const buyRefill = (): boolean => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    const res = buyFullRefillWithXP(currentUser, lang);
    if (!res.success) {
      showToast(res.error || (isEn ? 'Unable to refill hearts.' : 'Nie można odnowić serc.'), 'danger');
      return false;
    }
    setCurrentUser(res.user);
    setAllUsers((users) => users.map((u) => (u.id === res.user.id ? res.user : u)));
    setLivesInfo(calculateRegeneratedLives(res.user));
    syncLifeAction('buy-refill');
    showToast(
      isEn
        ? `Refilled full pack of hearts (5/5) for ${XP_COST_FULL_REFILL} XP!`
        : `Odnawianie pełnego pakietu serc (5/5) za ${XP_COST_FULL_REFILL} XP!`,
      'success'
    );
    return true;
  };

  const buyFreeze = (): boolean => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    const res = buyStreakFreezeWithXP(currentUser, lang);
    if (!res.success) {
      showToast(res.error || (isEn ? 'Unable to buy Streak Freeze.' : 'Nie można kupić tarczy serii.'), 'danger');
      return false;
    }
    setCurrentUser(res.user);
    setAllUsers((users) => users.map((u) => (u.id === res.user.id ? res.user : u)));
    syncLifeAction('buy-freeze');
    showToast(
      isEn
        ? `Purchased Streak Freeze for ${XP_COST_STREAK_FREEZE} XP! Your streak is protected.`
        : `Kupiono Tarczę Serii za ${XP_COST_STREAK_FREEZE} XP! Twoja passa jest chroniona.`,
      'badge'
    );
    return true;
  };

  const togglePro = (enable: boolean, plan: 'monthly' | 'yearly' = 'monthly') => {
    const isEn = languageRef.current === 'en';
    if (!isAuthenticated || currentUser.id === 'user-guest') {
      showToast(
        isEn
          ? 'Sign in or create an account to activate Full Stack PRO.'
          : 'Zaloguj się lub utwórz konto, aby aktywować subskrypcję Full Stack PRO.',
        'danger'
      );
      window.dispatchEvent(new CustomEvent('akademia:open-auth-modal'));
      return;
    }
    if (currentUser.role !== 'admin') {
      showToast(
        enable
          ? isEn
            ? 'PRO subscription requires payment confirmation; online checkout is not configured yet.'
            : 'Subskrypcja PRO wymaga potwierdzenia płatności; płatności online nie są skonfigurowane.'
          : isEn
          ? 'PRO status updates after payment cancellation confirmation.'
          : 'Status PRO zmienia się po potwierdzeniu anulowania płatności.',
        'danger'
      );
      return;
    }
    const updated = setProStatus(currentUser, enable, plan);
    setCurrentUser(updated);
    setAllUsers((users) => users.map((u) => (u.id === updated.id ? updated : u)));
    setLivesInfo(calculateRegeneratedLives(updated));

    if (enable) {
      showToast(
        isEn
          ? 'Full Stack PRO subscription active! Unlimited lives & full access.'
          : 'Subskrypcja Full Stack PRO aktywna! Nielimitowane życia i pełen dostęp.',
        'badge'
      );
    } else {
      showToast(
        isEn ? 'Switched to Free plan with a 5-heart limit.' : 'Przełączono na plan bezpłatny z limitem 5 serc.',
        'info'
      );
    }
  };


  useEffect(() => {
    const handlePopState = () => {
      try {
        const validTabs: AppTab[] = [
          'landing',
          'knowledge_base',
          'public_lesson',
          'about',
          'contact',
          'terms',
          'privacy',
          'dashboard',
          'modules',
          'lesson',
          'editor',
          'projects',
          'reviews',
          'certificate',
          'terminal',
          'sql_studio',
          'interview',
          'api_studio',
          'event_loop',
          'leaderboard',
          'flashcards',
          'career',
          'admin',
          'deployment',
        ];
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab') as AppTab | null;
        if (tabParam && validTabs.includes(tabParam)) {
          setActiveTabState(tabParam);
          return;
        }
        const host = (window.location.hostname || '').toLowerCase();
        const path = window.location.pathname || '/';
        const normalizedPath = normalizePathname(path);
        const isAppSubdomainOrPath =
          host.startsWith('app.') ||
          host.startsWith('app-') ||
          normalizedPath.toLowerCase() === '/app' ||
          normalizedPath.toLowerCase().startsWith('/app/');

        if (isAppSubdomainOrPath) {
          setActiveTabState('dashboard');
          return;
        }

        if (normalizedPath === '/' && detectInstalledMobileAppRuntime()) {
          setActiveTabState('dashboard');
          return;
        }

        const parsedPublic = parsePublicLocation(path);
        if (parsedPublic) {
          setActiveTabState(parsedPublic.tab);
          if (parsedPublic.lessonId) setSelectedLessonId(parsedPublic.lessonId);
        } else {
          setActiveTabState('landing');
        }
      } catch {
        // ignore history error
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update <html lang>, og:locale, <title>, <meta name="description">, robots and canonical URL on route/language changes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = language;
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute('content', getOgLocale(language));

    const robotsMeta = document.querySelector('meta[name="robots"]');

    if (!isPublicTab(activeTab)) {
      document.title =
        language === 'en'
          ? 'Student Workspace | Full Stack Developer Academy'
          : 'Pulpit Kursanta | Full Stack Developer Academy';
      if (robotsMeta) robotsMeta.setAttribute('content', 'noindex, nofollow');
      return;
    }

    if (robotsMeta) {
      robotsMeta.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    const activeLesson =
      activeTab === 'public_lesson'
        ? allLessons.find((l) => l.id === selectedLessonId) || allLessons[0]
        : null;
    const seo = getPublicRouteSeoMetadata(activeTab, activeLesson, language);
    document.title = seo.title;

    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', seo.description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', seo.description);

    const canonicalUrl = `${SITE_BASE_URL}${seo.canonicalPath}`;
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.setAttribute('href', canonicalUrl);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);
  }, [activeTab, selectedLessonId, language, allLessons]);

  const setActiveTab = (tab: AppTab, lessonId?: string, projectId?: string) => {
    const isEn = languageRef.current === 'en';
    if (tab === 'admin' && (!isAuthenticated || currentUser.role !== 'admin')) {
      const isGuest = !isAuthenticated || currentUser.id === 'user-guest';
      appendSecurityLog({
        type: 'route_blocked',
        severity: isGuest ? 'warning' : 'critical',
        actorEmail: currentUser.email,
        actorRole: isGuest ? 'guest' : currentUser.role,
        action: 'ProtectedRoute zablokował wejście do AdminPanelView',
        details: isGuest
          ? 'Próba wyświetlenia Panelu Administratora z sesji niezalogowanego Gościa.'
          : `Kursant (${currentUser.name}) próbował uzyskać dostęp do strefy Administratora.`,
      });
      showToast(
        isGuest
          ? isEn
            ? 'Guest access restricted! Sign in to access this protected area.'
            : 'Dostęp zablokowany dla gości! Zaloguj się, aby uzyskać dostęp do chronionej sekcji.'
          : isEn
          ? 'Insufficient permissions! The Admin Panel is protected by ProtectedRoute.'
          : 'Brak uprawnień! Panel Administratora jest chroniony przez ProtectedRoute.',
        'danger'
      );
    }
    setActiveTabState(tab);
    if (lessonId) setSelectedLessonId(lessonId);
    if (projectId) setSelectedProjectId(projectId);

    if (!detectEmbeddedWebViewRuntime()) {
      try {
        const host = (window.location.hostname || '').toLowerCase();
        const isAppSubdomain = host.startsWith('app.') || host.startsWith('app-');
        const resolvedLessonId = lessonId || selectedLessonId;
        const publicPath = buildPublicPath(tab, resolvedLessonId);
        let nextUrl = '/';
        if (isAppSubdomain) {
          nextUrl = tab === 'dashboard' ? '/' : `/?tab=${tab}`;
        } else if (publicPath) {
          nextUrl = publicPath;
        } else if (tab === 'dashboard') {
          nextUrl = '/app';
        } else {
          nextUrl = `/app?tab=${tab}`;
        }
        if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
          window.history.pushState({ tab, lessonId: resolvedLessonId }, '', nextUrl);
        }
      } catch {
        // ignore history API errors in sandboxed iframes
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginUser = async (
    email: string,
    password?: string
  ): Promise<{
    success: boolean;
    error?: string;
    classification?: EmailAuthErrorClassification;
  }> => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    const cleanEmail = (email || '').trim().toLowerCase();
    const rawPassword = password || '';

    if (!cleanEmail) {
      return {
        success: false,
        error: isEn ? 'Enter your email address.' : 'Wprowadź adres e-mail.',
      };
    }

    if (!validateEmailFormat(cleanEmail)) {
      return {
        success: false,
        error: isEn
          ? 'Enter a valid email format (e.g. name@domain.com).'
          : 'Wprowadź poprawny format adresu e-mail (np. imie@domena.pl).',
      };
    }

    if (!rawPassword.trim()) {
      return {
        success: false,
        error: isEn ? 'Enter your password.' : 'Wprowadź hasło dostępowe.',
      };
    }

    if (cleanEmail === 'zordonzordon1@gmail.com') {
      const adminErr = isEn
        ? 'Administrator account is protected and requires Google Firebase Auth verification (use "Sign in with Google").'
        : 'Konto Administratora jest chronione i wymaga weryfikacji tożsamości przez Google Firebase Auth (przycisk „Zaloguj przez Google”).';
      appendSecurityLog({
        type: 'auth_blocked',
        severity: 'critical',
        actorEmail: cleanEmail,
        actorRole: !isAuthenticated ? 'guest' : currentUser.role,
        action: isEn ? 'Rejected password login attempt on Administrator account' : 'Odrzucono próbę logowania hasłem na konto Administratora',
        details: adminErr,
      });
      return { success: false, error: adminErr };
    }

    const legacyCandidate = allUsers.find((u) => u.email.trim().toLowerCase() === cleanEmail);
    if (legacyCandidate && legacyCandidate.status !== 'active') {
      const statusRes = authenticateUserCredentials(allUsers, cleanEmail, rawPassword, lang);
      return { success: false, error: statusRes.error };
    }

    const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

    try {
      setIsSyncingCloud(true);
      let fbUser;
      try {
        fbUser = await signInWithEmailFirebase(cleanEmail, rawPassword);
      } catch (signInErr) {
        const errCode =
          typeof signInErr === 'object' && signInErr !== null && 'code' in signInErr
            ? String((signInErr as { code?: unknown }).code || '')
            : '';
        // Migrate verified legacy local accounts transparently to Firebase Auth when password matches
        const canMigrateLegacy =
          legacyCandidate &&
          legacyCandidate.role !== 'admin' &&
          legacyCandidate.id.startsWith('user-') &&
          legacyCandidate.password === rawPassword &&
          (errCode === 'auth/user-not-found' || errCode === 'auth/invalid-credential');

        if (canMigrateLegacy && legacyCandidate) {
          pendingCloudProfileRef.current = {
            name: legacyCandidate.name,
            bio: legacyCandidate.bio,
          };
          fbUser = await signUpWithEmailFirebase(cleanEmail, rawPassword, legacyCandidate.name);
        } else {
          throw signInErr;
        }
      }

      const cloudProfile = await fetchOrCreateCloudUserProfile(
        fbUser,
        legacyCandidate || currentUserRef.current,
        pendingCloudProfileRef.current ?? undefined
      );
      pendingCloudProfileRef.current = null;

      if (cloudProfile.status !== 'active') {
        await signOutFromFirebase();
        const blockedMsg =
          cloudProfile.status === 'banned'
            ? isEn
              ? `Account blocked. Reason: ${cloudProfile.banReason || 'Violation of platform terms.'}`
              : `Konto zostało zablokowane. Powód: ${cloudProfile.banReason || 'Naruszenie regulaminu platformy.'}`
            : isEn
            ? 'Account suspended or awaiting security verification.'
            : 'Konto zostało zawieszone lub oczekuje na weryfikację bezpieczeństwa.';
        appendSecurityLog({
          type: 'auth_blocked',
          severity: 'warning',
          actorEmail: cleanEmail,
          actorRole: cloudProfile.role,
          action: isEn ? 'Blocked sign-in to inactive account' : 'Zablokowano logowanie na nieaktywne konto',
          details: blockedMsg,
        });
        return { success: false, error: blockedMsg };
      }

      setFirebaseUid(fbUser.uid);
      setIsCloudConnected(true);
      setCurrentUser(cloudProfile);
      setIsAuthenticated(true);
      setLivesInfo(calculateRegeneratedLives(cloudProfile));
      setAllUsers((prev) => {
        const exists = prev.some((u) => u.id === cloudProfile.id);
        if (exists) {
          return prev.map((u) => (u.id === cloudProfile.id ? cloudProfile : u));
        }
        return [cloudProfile, ...prev.filter((u) => u.email.trim().toLowerCase() !== cleanEmail)];
      });

      appendSecurityLog({
        type: 'login_success',
        severity: 'info',
        actorEmail: cloudProfile.email,
        actorRole: cloudProfile.role,
        action: isEn ? 'Successful Firebase Email login' : 'Pomyślne logowanie Firebase (E-mail)',
        details: isEn
          ? `Signed in as student: ${cloudProfile.name}.`
          : `Zalogowano na konto kursanta: ${cloudProfile.name} (synchronizacja Firestore).`,
      });

      if ((cloudProfile.role !== 'admin' && activeTab === 'admin') || activeTab === 'landing') {
        setActiveTab('dashboard');
      }
      trackFirebaseEvent('login', { method: 'email' });
      soundManager.playSuccess();
      showToast(
        isEn
          ? `Signed in via Firebase! Welcome back, ${cloudProfile.name}.`
          : `Zalogowano przez Firebase! Witaj ponownie, ${cloudProfile.name}.`,
        'success'
      );
      return { success: true };
    } catch (err) {
      pendingCloudProfileRef.current = null;
      const classification = classifyEmailAuthError(err, currentHostname, lang);
      appendSecurityLog({
        type: 'auth_blocked',
        severity: 'warning',
        actorEmail: cleanEmail,
        actorRole: !isAuthenticated ? 'guest' : currentUser.role,
        action: isEn ? 'Failed Firebase Email login attempt' : 'Nieudana próba logowania Firebase (E-mail)',
        details: `${classification.rawCode}: ${classification.userMessage}`,
      });
      showToast(classification.userTitle, 'danger');
      return {
        success: false,
        error: classification.userMessage,
        classification,
      };
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const loginWithGoogle = async (): Promise<{
    success: boolean;
    redirecting?: boolean;
    error?: string;
    classification?: GoogleAuthErrorClassification;
  }> => {
    const isEn = languageRef.current === 'en';
    const lang = languageRef.current;
    try {
      setIsSyncingCloud(true);
      const signInOutcome = await signInWithGoogleFirebase();
      if (signInOutcome.status === 'redirecting') {
        return { success: true, redirecting: true };
      }
      const fbUser = signInOutcome.user;
      const cloudProfile = await fetchOrCreateCloudUserProfile(fbUser, currentUserRef.current);
      if (cloudProfile.status !== 'active') {
        await signOutFromFirebase();
        const blockedMsg = isEn
          ? 'Your account is suspended or blocked.'
          : 'Twoje konto zostało zawieszone lub zablokowane.';
        showToast(blockedMsg, 'danger');
        return { success: false, error: blockedMsg };
      }
      setFirebaseUid(fbUser.uid);
      setIsCloudConnected(true);
      setCurrentUser(cloudProfile);
      setIsAuthenticated(true);
      setLivesInfo(calculateRegeneratedLives(cloudProfile));
      setAllUsers((prev) => {
        const exists = prev.some((u) => u.id === cloudProfile.id);
        if (exists) {
          return prev.map((u) => (u.id === cloudProfile.id ? cloudProfile : u));
        }
        return [cloudProfile, ...prev];
      });
      if (activeTab === 'landing') {
        setActiveTab('dashboard');
      }
      trackFirebaseEvent('login', { method: 'google' });
      soundManager.playLevelUp();
      showToast(
        isEn
          ? `Connected to Firebase Cloud! Welcome, ${cloudProfile.name}. Progress syncs with Firestore.`
          : `Połączono z chmurą Firebase! Witaj, ${cloudProfile.name}. Postępy synchronizują się z Firestore.`,
        'badge'
      );
      return { success: true };
    } catch (err) {
      const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const classification = classifyGoogleAuthError(err, currentHostname, lang);

      showToast(classification.toastMessage, 'danger');
      return {
        success: false,
        error: classification.userMessage,
        classification,
      };
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const syncNowToCloud = async (): Promise<boolean> => {
    const isEn = languageRef.current === 'en';
    if (!firebaseUid || !isCloudConnected) {
      showToast(
        isEn
          ? 'Sign in with Google or Email (Firebase Auth) to enable cloud synchronization.'
          : 'Zaloguj się przez Google lub E-mail (Firebase Auth), aby włączyć synchronizację w chmurze.',
        'info'
      );
      return false;
    }
    setIsSyncingCloud(true);
    const ok = await saveUserProfileToCloud(firebaseUid, currentUser);
    setIsSyncingCloud(false);
    if (ok) {
      soundManager.playSuccess();
      showToast(
        isEn
          ? 'Profile, settings, and saved code synced to Cloud Firestore.'
          : 'Profil, ustawienia i zapisany kod zostały zapisane w Cloud Firestore.',
        'success'
      );
    } else {
      showToast(
        isEn ? 'Failed to sync profile to Firestore.' : 'Nie udało się zsynchronizować profilu z bazą Firestore.',
        'danger'
      );
    }
    return ok;
  };

  const registerUser = async (params: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    antiBotPassed: boolean;
    antiBotScore?: number;
    bio?: string;
  }): Promise<{
    success: boolean;
    user?: User;
    error?: string;
    classification?: EmailAuthErrorClassification;
  }> => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    const cleanName = (params.name || '').trim();
    const cleanEmail = (params.email || '').trim().toLowerCase();
    const rawPassword = params.password || '';

    const preCheck = validateAndCreateUser([], { ...params, name: cleanName, email: cleanEmail }, lang);
    if (!preCheck.success || !preCheck.user) {
      return { success: false, error: preCheck.error };
    }

    const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const bioOverride =
      params.bio?.trim() ||
      (isEn ? 'New Full Stack Academy student.' : 'Nowy kursant Akademii Full Stack.');

    try {
      setIsSyncingCloud(true);
      pendingCloudProfileRef.current = {
        name: cleanName,
        bio: bioOverride,
      };
      const fbUser = await signUpWithEmailFirebase(cleanEmail, rawPassword, cleanName);
      const cloudProfile = await fetchOrCreateCloudUserProfile(
        fbUser,
        currentUserRef.current,
        pendingCloudProfileRef.current
      );
      pendingCloudProfileRef.current = null;

      setFirebaseUid(fbUser.uid);
      setIsCloudConnected(true);
      setAllUsers((prev) => {
        const exists = prev.some((u) => u.id === cloudProfile.id);
        return exists ? prev.map((u) => (u.id === cloudProfile.id ? cloudProfile : u)) : [cloudProfile, ...prev];
      });
      setCurrentUser(cloudProfile);
      setIsAuthenticated(true);
      setLivesInfo(calculateRegeneratedLives(cloudProfile));
      if ((cloudProfile.role !== 'admin' && activeTab === 'admin') || activeTab === 'landing') {
        setActiveTab('dashboard');
      }
      trackFirebaseEvent('sign_up', { method: 'email' });
      soundManager.playLevelUp();
      showToast(
        isEn
          ? `Firebase account created and verified! Welcome, ${cloudProfile.name}.`
          : `Konto Firebase zostało utworzone i zweryfikowane! Witaj, ${cloudProfile.name}.`,
        'badge'
      );
      return { success: true, user: cloudProfile };
    } catch (err) {
      pendingCloudProfileRef.current = null;
      const classification = classifyEmailAuthError(err, currentHostname, lang);
      showToast(classification.userTitle, 'danger');
      return {
        success: false,
        error: classification.userMessage,
        classification,
      };
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const updateCurrentUserProfile = async (partial: {
    name?: string;
    bio?: string;
    password?: string;
    weeklyGoalMinutes?: number;
  }): Promise<{
    success: boolean;
    message: string;
    classification?: EmailAuthErrorClassification;
  }> => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    if (!isAuthenticated || currentUser.id === 'user-guest') {
      return {
        success: false,
        message: isEn ? 'Sign in to your account to save profile changes.' : 'Zaloguj się na swoje konto, aby zapisać zmiany profilu.',
      };
    }

    const cleanName = partial.name !== undefined ? partial.name.trim() : currentUser.name;
    if (cleanName.length < 2) {
      return {
        success: false,
        message: isEn ? 'Full name must be at least 2 characters long.' : 'Imię i nazwisko musi zawierać co najmniej 2 znaki.',
      };
    }

    if (partial.password !== undefined && partial.password.trim().length > 0 && partial.password.length < 6) {
      return {
        success: false,
        message: isEn ? 'New password must be at least 6 characters long.' : 'Nowe hasło musi mieć co najmniej 6 znaków.',
      };
    }

    const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

    try {
      if (firebaseUid && isCloudConnected) {
        setIsSyncingCloud(true);
        await updateFirebaseUserProfile({
          displayName: cleanName,
          newPassword: partial.password,
        });
      }

      const updatedUser: User = {
        ...currentUser,
        name: cleanName,
        bio: partial.bio !== undefined ? partial.bio.trim() : currentUser.bio,
        password:
          !firebaseUid && partial.password && partial.password.trim().length >= 6
            ? partial.password
            : undefined,
        weeklyGoalMinutes:
          typeof partial.weeklyGoalMinutes === 'number' && partial.weeklyGoalMinutes >= 30
            ? partial.weeklyGoalMinutes
            : currentUser.weeklyGoalMinutes,
      };

      if (firebaseUid && isCloudConnected) {
        await saveUserProfileToCloud(firebaseUid, updatedUser);
      }

      setCurrentUser(updatedUser);
      setAllUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      soundManager.playSuccess();
      showToast(
        isEn
          ? 'Your profile and security settings have been updated.'
          : 'Twój profil oraz ustawienia bezpieczeństwa zostały zaktualizowane.',
        'success'
      );
      return {
        success: true,
        message: isEn ? 'Profile changes saved.' : 'Zmiany w profilu zostały zapisane.',
      };
    } catch (err) {
      const classification = classifyEmailAuthError(err, currentHostname, lang);
      showToast(classification.userTitle, 'danger');
      return {
        success: false,
        message: classification.userMessage,
        classification,
      };
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const deleteUser = (userId: string) => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    if (!isAuthenticated || currentUser.role !== 'admin') {
      showToast(isEn ? 'Administrator permission required.' : 'Brak uprawnień administratora.', 'danger');
      return;
    }
    const userToDelete = allUsers.find((u) => u.id === userId);
    if (!userToDelete) return;

    if (userId === 'user-admin' || userToDelete.role === 'admin') {
      showToast(
        isEn ? 'Cannot delete the primary administrator account.' : 'Nie można usunąć głównego konta administratora.',
        'danger'
      );
      return;
    }

    const updated = allUsers.filter((u) => u.id !== userId);
    setAllUsers(updated);

    if (currentUser.id === userId) {
      setIsAuthenticated(false);
      setCurrentUser(createGuestUser(lang));
      if (activeTab === 'admin') {
        setActiveTabState('dashboard');
      }
    }

    if (firebaseUid && isCloudConnected) {
      void deleteUserProfileFromCloud(userId).then((res) => {
        if (res.status === 'ok') {
          showToast(
            isEn
              ? `Account ${userToDelete.name} deleted from Firestore.`
              : `Konto ${userToDelete.name} zostało usunięte z bazy Firestore.`,
            'info'
          );
        } else {
          setAllUsers((prev) => (prev.some((u) => u.id === userToDelete.id) ? prev : [...prev, userToDelete]));
          showToast(
            isEn
              ? 'Failed to delete user document from Firestore.'
              : 'Nie udało się usunąć konta użytkownika z bazy Firestore.',
            'danger'
          );
        }
      });
      return;
    }

    showToast(
      isEn ? `Account ${userToDelete.name} deleted.` : `Konto ${userToDelete.name} zostało usunięte z bazy danych.`,
      'info'
    );
  };

  const setUserStatus = (userId: string, status: UserStatus, reason?: string) => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    if (!isAuthenticated || currentUser.role !== 'admin') {
      showToast(isEn ? 'Administrator permission required.' : 'Brak uprawnień administratora.', 'danger');
      return;
    }
    const previousUser = allUsers.find((u) => u.id === userId) || null;
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, status, banReason: reason };
        }
        return u;
      })
    );
    if (currentUser.id === userId && status !== 'active') {
      setIsAuthenticated(false);
      setCurrentUser(createGuestUser(lang));
      if (activeTab === 'admin') {
        setActiveTabState('dashboard');
      }
    } else if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, status, banReason: reason }));
    }

    const actionText = isEn
      ? status === 'active'
        ? 'unlocked and active'
        : status === 'suspended'
        ? 'suspended'
        : 'banned'
      : status === 'active'
      ? 'odblokowane i aktywne'
      : status === 'suspended'
      ? 'zawieszone'
      : 'zablokowane';

    if (firebaseUid && isCloudConnected) {
      void setUserStatusInCloud(userId, status, reason).then((res) => {
        if (res.status === 'ok') {
          showToast(
            isEn ? `Account status saved: ${actionText}.` : `Zapisano status konta w bazie: ${actionText}.`,
            status === 'active' ? 'success' : 'danger'
          );
        } else {
          if (previousUser) {
            setAllUsers((prev) => prev.map((u) => (u.id === userId ? previousUser : u)));
            if (currentUser.id === userId) {
              setCurrentUser(previousUser);
            }
          }
          showToast(
            isEn ? 'Failed to update account status in Firestore.' : 'Nie udało się zapisać statusu konta w bazie Firestore.',
            'danger'
          );
        }
      });
      return;
    }

    showToast(
      isEn ? `Account status updated: ${actionText}.` : `Status konta został zmieniony: ${actionText}.`,
      status === 'active' ? 'success' : 'danger'
    );
  };

  const resetUserPassword = async (
    email: string
  ): Promise<{
    success: boolean;
    message: string;
    classification?: EmailAuthErrorClassification;
  }> => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !validateEmailFormat(cleanEmail)) {
      return {
        success: false,
        message: isEn
          ? 'Enter a valid email address format.'
          : 'Podaj poprawny format adresu e-mail.',
      };
    }

    const foundAdmin = allUsers.find((u) => u.email.trim().toLowerCase() === cleanEmail);
    if (cleanEmail === 'zordonzordon1@gmail.com' || foundAdmin?.role === 'admin') {
      const check = canResetUserPassword(
        foundAdmin || ({ email: cleanEmail, role: 'admin', id: 'user-admin' } as User),
        lang
      );
      return {
        success: false,
        message: check.error || (isEn ? 'Administrator password reset is disabled.' : 'Reset hasła administratora jest wyłączony.'),
      };
    }

    const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

    try {
      setIsSyncingCloud(true);
      await sendPasswordResetFirebase(cleanEmail);
      const okMsg = isEn
        ? `Firebase sent a password reset link to ${cleanEmail}. Check your inbox (and Spam folder).`
        : `Firebase wysłał link do zmiany hasła na adres ${cleanEmail}. Sprawdź skrzynkę e-mail (oraz folder Spam).`;
      showToast(okMsg, 'badge');
      return { success: true, message: okMsg };
    } catch (err) {
      const classification = classifyEmailAuthError(err, currentHostname, lang);
      showToast(classification.userTitle, 'danger');
      return {
        success: false,
        message: classification.userMessage,
        classification,
      };
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const verifyUserAntiBot = (userId: string) => {
    const isEn = languageRef.current === 'en';
    if (!isAuthenticated || currentUser.role !== 'admin') {
      showToast(isEn ? 'Administrator permission required.' : 'Brak uprawnień administratora.', 'danger');
      return;
    }
    const previousUser = allUsers.find((u) => u.id === userId) || null;
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, antiBotVerified: true, antiBotScore: 100, status: 'active' } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, antiBotVerified: true, antiBotScore: 100, status: 'active' }));
    }
    if (firebaseUid && isCloudConnected) {
      void setUserStatusInCloud(userId, 'active').then((res) => {
        if (res.status === 'ok') {
          showToast(
            isEn
              ? 'Account verified and saved in Firestore.'
              : 'Konto zostało zweryfikowane i zapisane w bazie Firestore.',
            'success'
          );
        } else {
          if (previousUser) {
            setAllUsers((prev) => prev.map((u) => (u.id === userId ? previousUser : u)));
          }
          showToast(
            isEn
              ? 'Failed to save verification status in Firestore.'
              : 'Nie udało się zapisać weryfikacji konta w bazie Firestore.',
            'danger'
          );
        }
      });
      return;
    }
    showToast(
      isEn
        ? 'Account verified by anti-bot guard (100% human score).'
        : 'Konto zostało zweryfikowane przez system anty-bot (100% human score).',
      'success'
    );
  };

  const giveProByAdmin = (userId: string, isPro: boolean, plan: 'monthly' | 'yearly' = 'yearly') => {
    const isEn = languageRef.current === 'en';
    if (!isAuthenticated || currentUser.role !== 'admin') {
      showToast(isEn ? 'Administrator permission required.' : 'Brak uprawnień administratora.', 'danger');
      return;
    }
    const previousUser = allUsers.find((u) => u.id === userId) || null;
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = setProStatus(u, isPro, plan);
          if (currentUser.id === userId) {
            setCurrentUser(updated);
            setLivesInfo(calculateRegeneratedLives(updated));
          }
          return updated;
        }
        return u;
      })
    );
    if (firebaseUid && isCloudConnected) {
      void setUserProStatusInCloud(userId, isPro, plan).then((res) => {
        if (res.status === 'ok') {
          showToast(
            isEn
              ? isPro
                ? 'PRO subscription granted and saved in Firestore.'
                : 'PRO subscription revoked and saved in Firestore.'
              : isPro
              ? 'Nadano subskrypcję PRO i zapisano w bazie Firestore.'
              : 'Odebrano subskrypcję PRO i zapisano w bazie Firestore.',
            'badge'
          );
        } else {
          if (previousUser) {
            setAllUsers((prev) => prev.map((u) => (u.id === userId ? previousUser : u)));
            if (currentUser.id === userId) {
              setCurrentUser(previousUser);
              setLivesInfo(calculateRegeneratedLives(previousUser));
            }
          }
          showToast(
            isEn
              ? 'Failed to persist PRO status in Firestore. Verify admin permissions or that the account exists in cloud.'
              : 'Nie udało się zapisać uprawnień PRO w bazie Firestore. Sprawdź uprawnienia admina lub czy konto istnieje w chmurze.',
            'danger'
          );
        }
      });
      return;
    }
    showToast(
      isEn ? 'Updated user PRO subscription status.' : 'Zaktualizowano uprawnienia PRO dla użytkownika.',
      'badge'
    );
  };

  const refillUserLivesByAdmin = (userId: string) => {
    const isEn = languageRef.current === 'en';
    if (!isAuthenticated || currentUser.role !== 'admin') {
      showToast(isEn ? 'Administrator permission required.' : 'Brak uprawnień administratora.', 'danger');
      return;
    }
    const previousUser = allUsers.find((u) => u.id === userId) || null;
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = refillAllLives(u);
          if (currentUser.id === userId) {
            setCurrentUser(updated);
            setLivesInfo(calculateRegeneratedLives(updated));
          }
          return updated;
        }
        return u;
      })
    );
    if (firebaseUid && isCloudConnected) {
      void updateLivesInCloud('admin-refill', userId).then((res) => {
        if (res.status === 'ok') {
          showToast(
            isEn
              ? 'User hearts refilled to maximum (5/5) and saved in Firestore.'
              : 'Uzupełniono serca użytkownika (5/5) i zapisano w bazie Firestore.',
            'success'
          );
        } else {
          if (previousUser) {
            setAllUsers((prev) => prev.map((u) => (u.id === userId ? previousUser : u)));
            if (currentUser.id === userId) {
              setCurrentUser(previousUser);
              setLivesInfo(calculateRegeneratedLives(previousUser));
            }
          }
          showToast(
            isEn ? 'Failed to refill hearts in Firestore.' : 'Nie udało się zapisać uzupełnienia serc w bazie Firestore.',
            'danger'
          );
        }
      });
      return;
    }
    showToast(
      isEn ? 'User hearts refilled to maximum (5/5).' : 'Serca użytkownika zostały uzupełnione do maksimum (5/5).',
      'success'
    );
  };

  const switchUser = (userId: string) => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    const found = allUsers.find((u) => u.id === userId);
    const check = canSwitchToUser(found, currentUser, isAuthenticated, lang);
    if (!check.allowed || !found) {
      showToast(check.error || (isEn ? 'Cannot switch to this account.' : 'Nie można przełączyć na to konto.'), 'danger');
      return;
    }

    const updatedUser: User = {
      ...found,
      lastLoginAt: new Date().toISOString(),
    };
    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    setAllUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setLivesInfo(calculateRegeneratedLives(updatedUser));
    if (updatedUser.role !== 'admin' && activeTab === 'admin') {
      setActiveTabState('dashboard');
    }
    const roleLabel = isEn
      ? found.role === 'admin'
        ? 'Instructor/Admin'
        : 'Student'
      : found.role === 'admin'
      ? 'Instruktor/Admin'
      : 'Kursant';
    showToast(
      isEn ? `Switched profile: ${found.name} (${roleLabel})` : `Przełączono na profil: ${found.name} (${roleLabel})`,
      'info'
    );
  };

  const logout = () => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    const prevName = currentUser.name;
    void signOutFromFirebase();
    setFirebaseUid(null);
    setIsCloudConnected(false);
    const guest = createGuestUser(lang);
    setIsAuthenticated(false);
    setCurrentUser(guest);
    setLivesInfo(calculateRegeneratedLives(guest));
    if (activeTab === 'admin') {
      setActiveTab('dashboard');
    }
    showToast(
      isEn ? `Signed out (${prevName}). Now browsing in Guest mode.` : `Wylogowano z konta (${prevName}). Jesteś teraz w trybie gościa.`,
      'info'
    );
  };

  const completeLesson = (lessonId: string, _xpReward: number, answers?: Record<string, number>) => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    const lessonObj = allLessons.find((l) => l.id === lessonId);
    if (!lessonObj) {
      showToast(
        isEn ? 'Invalid lesson identifier.' : 'Nieprawidłowy identyfikator lekcji.',
        'danger'
      );
      return;
    }

    if (currentUser.completedLessons.includes(lessonId)) {
      return;
    }

    const savedExerciseCode = currentUser.savedCode[lessonObj.interactiveExercise.id];
    const exerciseValidation = savedExerciseCode
      ? validateExerciseCode(lessonObj.interactiveExercise, savedExerciseCode, lang)
      : null;
    if (!exerciseValidation?.allPassed) {
      showToast(
        isEn
          ? 'Pass the interactive coding exercise in the editor before completing the lesson.'
          : 'Najpierw rozwiąż i zalicz ćwiczenie praktyczne w edytorze kodu.',
        'danger'
      );
      return;
    }

    const hasSubmittedAnswers =
      Boolean(answers) && typeof answers === 'object' && Object.keys(answers).length > 0;
    const quizEval = hasSubmittedAnswers
      ? evaluateLessonQuiz(lessonObj, answers, REQUIRED_QUIZ_SCORE)
      : null;
    if (hasSubmittedAnswers && !quizEval?.valid) {
      showToast(
        isEn ? 'Please answer all quiz questions.' : 'Odpowiedz na wszystkie pytania quizu.',
        'danger'
      );
      return;
    }

    const verifiedQuizScore = Math.max(
      quizEval?.valid ? quizEval.scorePercent : 0,
      currentUser.quizScores[lessonId] || 0
    );
    if (verifiedQuizScore < REQUIRED_QUIZ_SCORE) {
      showToast(
        isEn
          ? `Pass the lesson quiz with at least ${REQUIRED_QUIZ_SCORE}% before completing the lesson.`
          : `Zalicz quiz sprawdzający na co najmniej ${REQUIRED_QUIZ_SCORE}%, aby ukończyć lekcję.`,
        'danger'
      );
      return;
    }

    const canonicalXpReward = lessonObj.xpReward;
    const lessonMinutes = lessonObj.durationMinutes || 25;

    setCurrentUser((prev) => {
      const alreadyCompleted = prev.completedLessons.includes(lessonId);
      if (alreadyCompleted) return prev;

      const newCompleted = [...prev.completedLessons, lessonId];
      const newXp = prev.xp + canonicalXpReward;
      const levelInfo = calculateLevel(newXp, lang);
      const todayStr = new Date().toISOString().split('T')[0];
      const localTodayKey = formatLocalDateKey();
      const streakInfo = updateStreak(prev.lastActiveDate, prev.streakDays, todayStr);
      const prevTodayMinutes = prev.lastGoalDate === localTodayKey ? (prev.todaySpentMinutes ?? 15) : 0;

      const updatedUser: User = {
        ...prev,
        xp: newXp,
        level: levelInfo.level,
        streakDays: streakInfo.newStreak,
        lastActiveDate: todayStr,
        weeklySpentMinutes: prev.weeklySpentMinutes + lessonMinutes,
        todaySpentMinutes: prevTodayMinutes + lessonMinutes,
        lastGoalDate: localTodayKey,
        completedLessons: newCompleted,
        quizScores: {
          ...prev.quizScores,
          [lessonId]: Math.max(verifiedQuizScore, prev.quizScores[lessonId] || 0),
        },
      };

      // Check badges
      const newBadges = checkBadgesToUnlock(updatedUser);
      if (newBadges.length > 0) {
        updatedUser.unlockedBadges = [...(updatedUser.unlockedBadges || []), ...newBadges];
        soundManager.playBadgeUnlocked();
        showToast(
          isEn ? 'New badge unlocked! Check your profile.' : 'Zdobyto nową odznakę! Sprawdź swój profil.',
          'badge'
        );
      } else if (levelInfo.level > prev.level) {
        soundManager.playLevelUp();
        showToast(
          isEn ? `Leveled up to Level ${levelInfo.level}: ${levelInfo.title}!` : `Awans na Poziom ${levelInfo.level}: ${levelInfo.title}!`,
          'success'
        );
      } else {
        soundManager.playSuccess();
        showToast(
          isEn
            ? `Congrats! Lesson completed (+${canonicalXpReward} XP)`
            : `Gratulacje! Ukończono lekcję (+${canonicalXpReward} XP)`,
          'success'
        );
      }

      // Update in allUsers list
      setAllUsers((users) => users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      return updatedUser;
    });
    if (firebaseUid && isCloudConnected) {
      const cloudAnswers = quizEval?.valid ? answers : undefined;
      void completeLessonInCloud(lessonId, cloudAnswers).then((res) => {
        if (res.status === 'rejected') {
          showToast(
            isEn ? 'Failed to confirm lesson completion in cloud.' : 'Nie udało się potwierdzić zaliczenia lekcji w chmurze.',
            'danger'
          );
        }
      });
    }
  };

  const saveQuizScore = (lessonId: string, _scorePercent: number, answers: Record<string, number>) => {
    const isEn = languageRef.current === 'en';
    const lessonObj = allLessons.find((l) => l.id === lessonId);
    if (!lessonObj) return;

    const evaluation = evaluateLessonQuiz(lessonObj, answers, REQUIRED_QUIZ_SCORE);
    if (!evaluation.valid) {
      showToast(
        isEn ? 'Invalid quiz answers submitted.' : 'Przesłano nieprawidłowe odpowiedzi quizu.',
        'danger'
      );
      return;
    }

    const canonicalScore = evaluation.scorePercent;

    setCurrentUser((prev) => {
      const updatedScores = {
        ...prev.quizScores,
        [lessonId]: Math.max(canonicalScore, prev.quizScores[lessonId] || 0),
      };

      const updatedUser: User = {
        ...prev,
        quizScores: updatedScores,
      };

      const newBadges = checkBadgesToUnlock(updatedUser);
      if (newBadges.length > 0) {
        updatedUser.unlockedBadges = [...(updatedUser.unlockedBadges || []), ...newBadges];
        soundManager.playBadgeUnlocked();
        showToast(isEn ? 'Unlocked a knowledge quiz badge!' : 'Zdobyto odznakę za test wiedzy!', 'badge');
      } else if (canonicalScore >= REQUIRED_QUIZ_SCORE) {
        soundManager.playSuccess();
      }

      setAllUsers((users) => users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      return updatedUser;
    });
    if (firebaseUid && isCloudConnected) {
      void submitQuizAnswersToCloud(lessonId, answers).then((res) => {
        if (res.status === 'rejected') {
          showToast(
            isEn ? 'Failed to verify quiz answers in cloud.' : 'Nie udało się zweryfikować odpowiedzi quizu w chmurze.',
            'danger'
          );
        }
      });
    }
  };

  const verifyLessonExercise = async (exerciseId: string, code: { html: string; css: string; js: string }) => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    const lessonObj = allLessons.find((l) => l.interactiveExercise.id === exerciseId);
    if (!lessonObj) return false;

    const localValidation = validateExerciseCode(lessonObj.interactiveExercise, code, lang);
    if (!localValidation.allPassed) {
      return false;
    }

    if (!firebaseUid || !isCloudConnected) return true;
    const cloudResult = await verifyLessonExerciseInCloud(exerciseId, code);
    if (cloudResult.status === 'rejected') {
      showToast(isEn ? 'Server did not confirm exercise completion.' : 'Serwer nie potwierdził poprawności ćwiczenia.', 'danger');
      return false;
    }
    return true;
  };

  const saveCodeSnippet = (exerciseId: string, code: { html: string; css: string; js: string }) => {
    setCurrentUser((prev) => {
      const updatedUser: User = {
        ...prev,
        savedCode: {
          ...prev.savedCode,
          [exerciseId]: code,
        },
      };
      setAllUsers((users) => users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      return updatedUser;
    });
  };

  const completeProject = (projectId: string, _xpReward: number, code?: { html: string; css: string; js: string }) => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    const projectObj = allProjects.find((p) => p.id === projectId);
    if (!projectObj) return;

    const projectExercise = getProjectInteractiveExercise(projectObj, lang);
    const candidateCode = code || currentUser.savedCode[projectExercise.id];
    if (!candidateCode || !validateExerciseCode(projectExercise, candidateCode, lang).allPassed) {
      showToast(
        isEn
          ? 'Project code does not pass all verification checks yet.'
          : 'Kod projektu nie spełnia jeszcze wszystkich testów weryfikacyjnych.',
        'danger'
      );
      return;
    }

    const canonicalXpReward = projectObj.xpReward;

    setCurrentUser((prev) => {
      const alreadyCompleted = prev.completedProjects.includes(projectId);
      if (alreadyCompleted) return prev;
      const newCompleted = [...prev.completedProjects, projectId];
      const newXp = prev.xp + canonicalXpReward;
      const levelInfo = calculateLevel(newXp, lang);

      const updatedUser: User = {
        ...prev,
        xp: newXp,
        level: levelInfo.level,
        completedProjects: newCompleted,
      };

      const newBadges = checkBadgesToUnlock(updatedUser);
      if (newBadges.length > 0) {
        updatedUser.unlockedBadges = [...(updatedUser.unlockedBadges || []), ...newBadges];
        soundManager.playBadgeUnlocked();
      } else {
        soundManager.playLevelUp();
      }

      showToast(
        isEn
          ? `Awesome! Project submitted and passed (+${canonicalXpReward} XP)`
          : `Wspaniale! Projekt oddany i zaliczony (+${canonicalXpReward} XP)`,
        'success'
      );
      setAllUsers((users) => users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      return updatedUser;
    });
    if (firebaseUid && isCloudConnected) {
      void completeProjectInCloud(projectId, candidateCode).then((res) => {
        if (res.status === 'rejected') {
          showToast(
            isEn ? 'Server did not confirm project completion.' : 'Serwer nie potwierdził zaliczenia projektu.',
            'danger'
          );
        }
      });
    }
  };

  const linkGithubAccount = async (usernameOrUrl: string, token?: string): Promise<GithubSyncResult> => {
    const isEn = languageRef.current === 'en';
    const nowIso = new Date().toISOString();
    if (!isAuthenticated || currentUser.id === 'user-guest') {
      const errorMsg = isEn
        ? 'Sign in to your Academy account to link GitHub repositories.'
        : 'Zaloguj się na swoje konto w Akademii, aby połączyć repozytoria GitHub.';
      showToast(errorMsg, 'danger');
      return {
        ok: false,
        error: errorMsg,
        integration: {
          ...(currentUser.githubIntegration || { updatedAt: nowIso }),
          status: 'error',
          lastSyncError: errorMsg,
          updatedAt: nowIso,
        },
      };
    }

    if (token !== undefined) {
      setSessionGithubToken(token);
    }

    const prevGithub: GitHubIntegrationState = currentUser.githubIntegration || {
      status: 'disconnected',
      updatedAt: nowIso,
    };

    setIsSyncingGithub(true);
    setCurrentUser((prev) => ({
      ...prev,
      githubIntegration: {
        ...(prev.githubIntegration || { updatedAt: nowIso }),
        status: 'syncing',
        updatedAt: nowIso,
      },
    }));

    const result = await fetchGithubUserAndRepos(usernameOrUrl, {
      token,
      previousIntegration: prevGithub,
      language: languageRef.current,
    });

    setCurrentUser((prev) => {
      const updatedUser: User = {
        ...prev,
        githubIntegration: result.integration,
      };
      setAllUsers((users) => users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      return updatedUser;
    });
    setIsSyncingGithub(false);

    if (result.ok) {
      soundManager.playSuccess();
      showToast(
        isEn
          ? `Synced GitHub account @${result.integration.username} (${result.integration.repos?.length ?? 0} repositories).`
          : `Zsynchronizowano konto GitHub @${result.integration.username} (${result.integration.repos?.length ?? 0} repozytoriów).`,
        'success'
      );
    } else {
      showToast(result.error || (isEn ? 'GitHub synchronization error.' : 'Błąd synchronizacji z GitHub.'), 'danger');
    }

    return result;
  };

  const refreshGithubSync = async (token?: string): Promise<GithubSyncResult> => {
    const isEn = languageRef.current === 'en';
    const existingUsername = currentUser.githubIntegration?.username;
    if (!existingUsername) {
      const nowIso = new Date().toISOString();
      const errorMsg = isEn
        ? 'Link your GitHub account in profile settings first.'
        : 'Najpierw połącz swoje konto GitHub w ustawieniach profilu.';
      showToast(errorMsg, 'info');
      return {
        ok: false,
        error: errorMsg,
        integration: {
          status: 'disconnected',
          updatedAt: nowIso,
        },
      };
    }
    return linkGithubAccount(existingUsername, token);
  };

  const unlinkGithubAccount = () => {
    const isEn = languageRef.current === 'en';
    clearSessionGithubToken();
    const nowIso = new Date().toISOString();
    setCurrentUser((prev) => {
      const updatedUser: User = {
        ...prev,
        githubIntegration: {
          status: 'disconnected',
          repos: [],
          projectSubmissions: prev.githubIntegration?.projectSubmissions || {},
          updatedAt: nowIso,
        },
      };
      setAllUsers((users) => users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      return updatedUser;
    });
    showToast(
      isEn ? 'Unlinked GitHub account from Academy profile.' : 'Odłączono konto GitHub od profilu Akademii.',
      'info'
    );
  };

  const submitProjectFromGithub = async (
    projectId: string,
    repoIdentifier: string,
    token?: string
  ): Promise<GithubProjectSubmitResult> => {
    const isEn = languageRef.current === 'en';
    if (!isAuthenticated || currentUser.id === 'user-guest') {
      const errorMsg = isEn
        ? 'Sign in to a student account to submit project progress from GitHub.'
        : 'Zaloguj się na konto kursanta, aby wysłać postęp projektu z GitHub.';
      showToast(errorMsg, 'danger');
      return { ok: false, error: errorMsg };
    }

    const project = allProjects.find((p) => p.id === projectId);
    if (!project) {
      return { ok: false, error: isEn ? 'Selected project not found.' : 'Nie znaleziono wybranego projektu.' };
    }

    if (token !== undefined) {
      setSessionGithubToken(token);
    }

    setIsSyncingGithub(true);
    const result = await submitProjectFromGithubRepo(project, repoIdentifier, {
      token,
      language: languageRef.current,
    });
    setIsSyncingGithub(false);

    if (!result.ok || !result.submission) {
      showToast(
        result.error || (isEn ? 'Failed to submit project repository.' : 'Nie udało się wysłać repozytorium projektu.'),
        'danger'
      );
      return result;
    }

    const submission = result.submission;
    const nowIso = new Date().toISOString();

    setCurrentUser((prev) => {
      const prevGh = prev.githubIntegration || { status: 'disconnected', updatedAt: nowIso };
      const updatedUser: User = {
        ...prev,
        githubIntegration: {
          ...prevGh,
          projectSubmissions: {
            ...(prevGh.projectSubmissions || {}),
            [projectId]: submission,
          },
          updatedAt: nowIso,
        },
      };
      setAllUsers((users) => users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      return updatedUser;
    });

    if (result.extractedCode) {
      const exercise = getProjectInteractiveExercise(project, languageRef.current);
      saveCodeSnippet(exercise.id, result.extractedCode);
    }

    if (result.validationSummary?.allPassed) {
      awardCustomXp(
        50,
        isEn ? `Verified project code from GitHub: ${project.title}` : `Zweryfikowano kod projektu z GitHub: ${project.title}`,
        `project-verify-${project.id}`
      );
      completeProject(project.id, project.xpReward, result.extractedCode);
    } else {
      soundManager.playSuccess();
      showToast(
        isEn
          ? `Submitted project progress from GitHub (${submission.repoFullName} @ ${submission.commitSha.slice(0, 7)}).`
          : `Przesłano postęp projektu z GitHub (${submission.repoFullName} @ ${submission.commitSha.slice(0, 7)}).`,
        'success'
      );
    }

    return result;
  };

  const addAnnouncement = (title: string, content: string, category: Announcement['category']) => {
    const isEn = languageRef.current === 'en';
    if (!isAuthenticated || currentUser.role !== 'admin') {
      showToast(isEn ? 'Administrator permission required.' : 'Brak uprawnień administratora.', 'danger');
      return;
    }
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      category,
      author: currentUser.name,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    if (isCloudConnected && currentUser.role === 'admin') {
      void saveAnnouncementToCloud(newAnn);
    }
    showToast(isEn ? 'Published new announcement for students.' : 'Opublikowano nowe ogłoszenie dla kursantów.', 'info');
  };

  const deleteAnnouncement = (id: string) => {
    const isEn = languageRef.current === 'en';
    if (!isAuthenticated || currentUser.role !== 'admin') {
      showToast(isEn ? 'Administrator permission required.' : 'Brak uprawnień administratora.', 'danger');
      return;
    }
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    if (isCloudConnected && currentUser.role === 'admin') {
      void deleteAnnouncementFromCloud(id);
    }
    showToast(isEn ? 'Announcement deleted.' : 'Ogłoszenie zostało usunięte.', 'info');
  };

  const updateUserByAdmin = (userId: string, partial: Partial<User>) => {
    const isEn = languageRef.current === 'en';
    if (!isAuthenticated || currentUser.role !== 'admin') {
      showToast(isEn ? 'Administrator permission required.' : 'Brak uprawnień administratora.', 'danger');
      return;
    }
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...partial };
          if (currentUser.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    showToast(isEn ? 'Updated user profile in database.' : 'Zaktualizowano profil użytkownika w bazie danych.', 'success');
  };

  const awardCustomXp = useCallback((
    xpAmount: number,
    reason: string,
    rewardId?: string,
    proof?: Record<string, unknown>
  ): boolean => {
    const lang = languageRef.current;
    const isEn = lang === 'en';
    let wasGranted = true;
    setCurrentUser((prev) => {
      if (rewardId) {
        const res = claimIdempotentReward(prev, rewardId, xpAmount);
        if (!res.granted) {
          wasGranted = false;
          return prev;
        }
        setAllUsers((users) => users.map((u) => (u.id === res.updatedUser.id ? res.updatedUser : u)));
        return res.updatedUser;
      }

      const newXp = prev.xp + xpAmount;
      const levelInfo = calculateLevel(newXp, lang);
      const updatedUser: User = {
        ...prev,
        xp: newXp,
        level: levelInfo.level,
      };
      setAllUsers((users) => users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      return updatedUser;
    });

    if (!wasGranted) {
      showToast(
        isEn
          ? 'Challenge already completed (XP reward was already claimed).'
          : 'Zadanie zostało już wcześniej zaliczone (punkty XP zostały już przyznane).',
        'info'
      );
      return false;
    }

    soundManager.playSuccess();
    showToast(`${reason} (+${xpAmount} XP)`, 'success');
    if (firebaseUid && isCloudConnected && !rewardId?.startsWith('exercise-') && !rewardId?.startsWith('project-verify-')) {
      void claimActivityRewardInCloud(rewardId, proof).then((res) => {
        if (res.status === 'rejected') {
          showToast(isEn ? 'Server did not confirm this reward.' : 'Serwer nie potwierdził tej nagrody.', 'danger');
        }
      });
    }
    return true;
  }, [firebaseUid, isCloudConnected]);

  const importUserBackup = useCallback(
    (restoredUser: User) => {
      const isEn = languageRef.current === 'en';
      const safeUser = sanitizeImportedUser(restoredUser, currentUser, isAuthenticated);
      setCurrentUser(safeUser);
      setIsAuthenticated(true);
      setAllUsers((prev) => {
        const exists = prev.some((u) => u.id === safeUser.id);
        if (exists) {
          return prev.map((u) => (u.id === safeUser.id ? safeUser : u));
        }
        return [...prev, safeUser];
      });
      soundManager.playLevelUp();
      showToast(
        isEn ? `Restored profile backup: ${safeUser.name}` : `Przywrócono kopię zapasową profilu: ${safeUser.name}`,
        'badge'
      );
    },
    [currentUser, isAuthenticated]
  );

  const weakAreas = useMemo(
    () => findWeakAreas(currentUser.quizScores || {}, allLessons, language),
    [currentUser.quizScores, allLessons, language]
  );

  const localTodayKey = formatLocalDateKey();
  const todaySpentMinutes =
    currentUser.lastGoalDate === localTodayKey
      ? (currentUser.todaySpentMinutes ?? 15)
      : currentUser.lastActiveDate === new Date().toISOString().split('T')[0]
      ? (currentUser.todaySpentMinutes ?? 15)
      : 0;
  const dailyGoalMinutes = reminderSettings.dailyGoalMinutes || 30;

  // Persist reminderSettings in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REMINDERS, JSON.stringify(reminderSettings));
    } catch (e) {
      console.warn('Reminder settings storage error', e);
    }
  }, [reminderSettings]);

  const updateReminderSettings = useCallback((partial: Partial<DailyReminderSettings>) => {
    setReminderSettings((prev) => {
      const next = { ...prev, ...partial };
      setNextReminderInMs(
        next.enabled ? getMsUntilNextReminder(next.reminderTime, next.daysOfWeek) : null
      );
      return next;
    });
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    const isEn = languageRef.current === 'en';
    const perm = await requestBrowserNotificationPermission();
    setNotificationPermission(perm);
    if (perm === 'granted') {
      showToast(
        isEn ? 'Push Notifications (Service Worker) enabled!' : 'Powiadomienia Push (Service Worker) zostały włączone!',
        'success'
      );
    } else if (perm === 'denied') {
      showToast(
        isEn
          ? 'Browser notifications are blocked — in-app study reminders remain active.'
          : 'Uprawnienia powiadomień przeglądarki są zablokowane — aktywne są przypomnienia w aplikacji.',
        'info'
      );
    }
    return perm;
  }, []);

  const triggerGoalReminderNow = useCallback(
    async (isTest: boolean = false): Promise<boolean> => {
      const lang = languageRef.current;
      const isEn = lang === 'en';
      const nextLesson =
        allLessons.find((l) => !currentUser.completedLessons.includes(l.id)) || allLessons[0];

      const payload = buildDailyGoalNotificationPayload({
        userName: currentUser.name,
        streakDays: currentUser.streakDays,
        todayMinutes: todaySpentMinutes,
        dailyGoalMinutes,
        nextLessonId: nextLesson?.id,
        nextLessonTitle: nextLesson?.title,
        isTest,
        language: lang,
      });

      const swSent = await sendServiceWorkerNotification(payload);
      soundManager.playSuccess();

      const remaining = Math.max(0, dailyGoalMinutes - todaySpentMinutes);
      const toastMsg = isEn
        ? isTest
          ? swSent
            ? `Service Worker notification sent: "${payload.title}"`
            : `Daily goal reminder (${todaySpentMinutes}/${dailyGoalMinutes} min): Continue lesson "${nextLesson?.title || 'HTML'}"!`
          : remaining > 0
          ? `Daily goal reminder: ${remaining} min left today to keep your ${currentUser.streakDays}-day streak!`
          : `Daily goal (${dailyGoalMinutes} min) completed! Great job!`
        : isTest
        ? swSent
          ? `Wysłano powiadomienie Service Worker: „${payload.title}”`
          : `Przypomnienie o celu dnia (${todaySpentMinutes}/${dailyGoalMinutes} min): Kontynuuj lekcję „${nextLesson?.title || 'HTML'}”!`
        : remaining > 0
        ? `Przypomnienie o celu dnia: brakuje jeszcze ${remaining} min nauki, aby utrzymać serię ${currentUser.streakDays} dni!`
        : `Cel dzienny (${dailyGoalMinutes} min) osiągnięty! Brawo!`;

      showToast(toastMsg, 'info');
      return swSent;
    },
    [allLessons, currentUser.completedLessons, currentUser.name, currentUser.streakDays, todaySpentMinutes, dailyGoalMinutes]
  );

  const triggerGoalReminderRef = useRef(triggerGoalReminderNow);
  useEffect(() => {
    triggerGoalReminderRef.current = triggerGoalReminderNow;
  }, [triggerGoalReminderNow]);

  // Listen for Service Worker notification clicks to navigate directly to the recommended lesson
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const handleSWMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NOTIFICATION_CLICKED') {
        const lessonId = event.data.data?.lessonId || 'html-1';
        setActiveTab('lesson', lessonId);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleSWMessage);
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleSWMessage);
    };
  }, []);

  // Simple & accurate daily learning goal scheduling loop in AppContext
  useEffect(() => {
    const evaluateSchedule = () => {
      const now = new Date();
      const ms = reminderSettings.enabled
        ? getMsUntilNextReminder(reminderSettings.reminderTime, reminderSettings.daysOfWeek, now)
        : null;

      setNextReminderInMs((prev) => {
        if (prev === null && ms === null) return prev;
        if (prev === null || ms === null) return ms;
        if (Math.abs(prev - ms) < 1000) return prev;
        return ms;
      });

      if (
        isAuthenticated &&
        activeTab !== 'landing' &&
        shouldTriggerDailyReminderNow(reminderSettings, todaySpentMinutes, now)
      ) {
        const todayKey = formatLocalDateKey(now);
        setReminderSettings((prev) => {
          if (prev.lastNotifiedDate === todayKey) return prev;
          return {
            ...prev,
            lastNotifiedDate: todayKey,
          };
        });
        void triggerGoalReminderRef.current(false);
      }
    };

    evaluateSchedule();

    const intervalId = setInterval(evaluateSchedule, 15000);

    // Sync upcoming reminder with the Service Worker
    const nextLesson =
      allLessons.find((l) => !currentUser.completedLessons.includes(l.id)) || allLessons[0];
    const nextMs = reminderSettings.enabled
      ? getMsUntilNextReminder(reminderSettings.reminderTime, reminderSettings.daysOfWeek)
      : null;

    const swPayload =
      reminderSettings.enabled && todaySpentMinutes < dailyGoalMinutes
        ? buildDailyGoalNotificationPayload({
            userName: currentUser.name,
            streakDays: currentUser.streakDays,
            todayMinutes: todaySpentMinutes,
            dailyGoalMinutes,
            nextLessonId: nextLesson?.id,
            nextLessonTitle: nextLesson?.title,
            language,
          })
        : null;

    void syncScheduleWithServiceWorker(nextMs, swPayload);

    // Also set an exact timeout if the next reminder is within the next 6 hours
    let exactTimeoutId: ReturnType<typeof setTimeout> | null = null;
    if (nextMs !== null && nextMs > 0 && nextMs <= 6 * 60 * 60 * 1000) {
      exactTimeoutId = setTimeout(evaluateSchedule, nextMs + 250);
    }

    return () => {
      clearInterval(intervalId);
      if (exactTimeoutId) clearTimeout(exactTimeoutId);
    };
  }, [
    reminderSettings,
    todaySpentMinutes,
    dailyGoalMinutes,
    allLessons,
    currentUser.completedLessons,
    currentUser.name,
    currentUser.streakDays,
    language,
  ]);

  return (
    <AppContext.Provider
      value={{
        currentUser: localizedCurrentUser,
        isAuthenticated,
        isCloudConnected,
        isSyncingCloud,
        firebaseUid,
        allUsers,
        activeTab,
        selectedLessonId,
        selectedProjectId,
        announcements: localizedAnnouncements,
        localizedAnnouncements,
        language,
        setLanguage,
        allModules,
        allProjects,
        allBadges,
        theme,
        themePreference,
        toast,
        livesInfo,
        isLivesModalOpen,
        isSubModalOpen,
        setIsLivesModalOpen,
        setIsSubModalOpen,
        loseLife,
        refillLives,
        earnPracticeLife,
        earnAdRewardLife,
        adSenseConfig,
        updateAdSenseConfig,
        buyHeart,
        buyRefill,
        buyFreeze,
        togglePro,
        setThemePreference,
        toggleTheme,
        setActiveTab,
        loginUser,
        loginWithGoogle,
        syncNowToCloud,
        registerUser,
        updateCurrentUserProfile,
        switchUser,
        logout,
        deleteUser,
        setUserStatus,
        resetUserPassword,
        verifyUserAntiBot,
        giveProByAdmin,
        refillUserLivesByAdmin,
        completeLesson,
        saveQuizScore,
        verifyLessonExercise,
        saveCodeSnippet,
        completeProject,
        isSyncingGithub,
        linkGithubAccount,
        refreshGithubSync,
        unlinkGithubAccount,
        submitProjectFromGithub,
        addAnnouncement,
        deleteAnnouncement,
        updateUserByAdmin,
        dismissToast,
        weakAreas,
        allLessons,
        isSoundMuted,
        toggleSound,
        reminderSettings,
        notificationPermission,
        todaySpentMinutes,
        dailyGoalMinutes,
        nextReminderInMs,
        requestNotificationPermission,
        updateReminderSettings,
        triggerGoalReminderNow,
        awardCustomXp,
        importUserBackup,
        securityLogs: localizedSecurityLogs,
        clearSecurityLogs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
