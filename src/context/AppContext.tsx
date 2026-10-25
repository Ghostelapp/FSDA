import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import { User, UserRole, UserStatus, Announcement, Lesson, ReviewItem, DailyReminderSettings, SecurityAuditEvent, AdSenseConfig } from '../types';
import { MODULES_DATA } from '../data/modulesData';
import { DEFAULT_ANNOUNCEMENTS } from '../data/defaultAnnouncements';
import { soundManager } from '../utils/audioFx';
import {
  DEFAULT_ADSENSE_CONFIG,
  shouldShowAdsForUser,
  checkRewardedAdEligibility,
  ensureAdSenseScriptLoaded,
} from '../utils/adsense';
import {
  authenticateUserCredentials,
  validateAndCreateUser,
  canSwitchToUser,
  canResetUserPassword,
  sanitizeImportedUser,
  createGuestUser,
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
  auth,
  onAuthStateChanged,
  testFirebaseConnection,
  signInWithGoogleFirebase,
  signOutFromFirebase,
  fetchOrCreateCloudUserProfile,
  saveUserProfileToCloud,
  subscribeToUserProfile,
  subscribeToCloudAnnouncements,
  saveAnnouncementToCloud,
  deleteAnnouncementFromCloud,
} from '../firebase';

export type AppTab = 
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
  theme: 'dark' | 'light';
  toast: { message: string; type: 'success' | 'info' | 'badge' | 'danger' } | null;
  livesInfo: LivesCalculationResult;
  isLivesModalOpen: boolean;
  isSubModalOpen: boolean;
  setIsLivesModalOpen: (open: boolean) => void;
  setIsSubModalOpen: (open: boolean) => void;
  loseLife: (reason?: string) => boolean;
  refillLives: () => void;
  earnPracticeLife: () => void;
  earnAdRewardLife: () => { success: boolean; message: string };
  adSenseConfig: AdSenseConfig;
  updateAdSenseConfig: (partial: Partial<AdSenseConfig>) => void;
  buyHeart: () => boolean;
  buyRefill: () => boolean;
  buyFreeze: () => boolean;
  togglePro: (enable: boolean, plan?: 'monthly' | 'yearly') => void;
  toggleTheme: () => void;
  setActiveTab: (tab: AppTab, lessonId?: string, projectId?: string) => void;
  loginUser: (email: string, password?: string) => { success: boolean; error?: string };
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  syncNowToCloud: () => Promise<boolean>;
  registerUser: (params: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    antiBotPassed: boolean;
    antiBotScore?: number;
    bio?: string;
  }) => { success: boolean; user?: User; error?: string };
  updateCurrentUserProfile: (partial: {
    name?: string;
    bio?: string;
    password?: string;
    weeklyGoalMinutes?: number;
  }) => { success: boolean; message: string };
  switchUser: (userId: string) => void;
  logout: () => void;
  deleteUser: (userId: string) => void;
  setUserStatus: (userId: string, status: UserStatus, reason?: string) => void;
  resetUserPassword: (email: string, newPassword?: string) => { success: boolean; message: string };
  verifyUserAntiBot: (userId: string) => void;
  giveProByAdmin: (userId: string, isPro: boolean, plan?: 'monthly' | 'yearly') => void;
  refillUserLivesByAdmin: (userId: string) => void;
  completeLesson: (lessonId: string, xpReward: number) => void;
  saveQuizScore: (lessonId: string, scorePercent: number) => void;
  saveCodeSnippet: (exerciseId: string, code: { html: string; css: string; js: string }) => void;
  completeProject: (projectId: string, xpReward: number) => void;
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
  awardCustomXp: (xpAmount: number, reason: string, rewardId?: string) => boolean;
  importUserBackup: (restoredUser: User) => void;
  securityLogs: SecurityAuditEvent[];
  clearSecurityLogs: () => void;
}

const STORAGE_KEY_USER = 'fsda_current_user_v7';
const STORAGE_KEY_AUTH = 'fsda_is_authenticated_v7';
const STORAGE_KEY_USERS = 'fsda_all_users_v7';
const STORAGE_KEY_ANNOUNCEMENTS = 'fsda_announcements_v5';
const STORAGE_KEY_THEME = 'fsda_theme_v5';
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
    try {
      const storedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      if (storedAuth === null || JSON.parse(storedAuth) !== true) {
        return createGuestUser();
      }
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        const parsed: User = JSON.parse(stored);
        if (!parsed || !parsed.id || parsed.id === 'user-guest' || LEGACY_TEST_USER_IDS.has(parsed.id)) {
          return createGuestUser();
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
          return createGuestUser();
        }
        return parsed.role === 'admin' && !hasVerifiedFirebaseAdmin
          ? { ...parsed, role: 'student' }
          : parsed;
      }
      return createGuestUser();
    } catch {
      return createGuestUser();
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

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_THEME);
      return (stored === 'light' || stored === 'dark') ? stored : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [activeTab, setActiveTabState] = useState<AppTab>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as AppTab | null;
      const validTabs: AppTab[] = [
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
      if (tabParam && validTabs.includes(tabParam)) {
        return tabParam;
      }
      return 'dashboard';
    } catch {
      return 'dashboard';
    }
  });
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>('html-7');
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
        return {
          ...DEFAULT_ADSENSE_CONFIG,
          ...parsed,
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
  const lastCloudSyncHashRef = useRef<string>('');
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
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser]);

  // Collect all lessons across all modules (stable reference)
  const allLessons: Lesson[] = useMemo(() => MODULES_DATA.flatMap((m) => m.lessons), []);

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

  // Verify Firestore connection and subscribe to Firebase Auth state
  useEffect(() => {
    void testFirebaseConnection();

    let unsubProfile: (() => void) | null = null;
    let unsubAnnouncements: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }
      if (unsubAnnouncements) {
        unsubAnnouncements();
        unsubAnnouncements = null;
      }

      if (fbUser) {
        setFirebaseUid(fbUser.uid);
        setIsCloudConnected(true);
        setIsSyncingCloud(true);
        try {
          const cloudProfile = await fetchOrCreateCloudUserProfile(fbUser, currentUserRef.current);
          lastCloudSyncHashRef.current = JSON.stringify({
            xp: cloudProfile.xp,
            level: cloudProfile.level,
            lives: cloudProfile.lives,
            isPro: cloudProfile.isPro,
            name: cloudProfile.name,
            bio: cloudProfile.bio,
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
              lives: remoteUser.lives,
              isPro: remoteUser.isPro,
              name: remoteUser.name,
              bio: remoteUser.bio,
              completedLessons: remoteUser.completedLessons,
              completedProjects: remoteUser.completedProjects,
              unlockedBadges: remoteUser.unlockedBadges,
              claimedRewards: remoteUser.claimedRewards,
              quizScores: remoteUser.quizScores,
            });
            if (remoteHash !== lastCloudSyncHashRef.current) {
              lastCloudSyncHashRef.current = remoteHash;
              setCurrentUser(remoteUser);
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
        } finally {
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
    };
  }, []);

  // Automatically sync currentUser changes to Cloud Firestore when connected via Firebase Auth
  useEffect(() => {
    if (!firebaseUid || !isCloudConnected || currentUser.id !== firebaseUid) return;

    const currentHash = JSON.stringify({
      xp: currentUser.xp,
      level: currentUser.level,
      lives: currentUser.lives,
      isPro: currentUser.isPro,
      name: currentUser.name,
      bio: currentUser.bio,
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
      await saveUserProfileToCloud(firebaseUid, currentUser);
      setIsSyncingCloud(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [currentUser, firebaseUid, isCloudConnected]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
      if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      console.warn('Theme storage error', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message: string, type: 'success' | 'info' | 'badge' | 'danger' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const dismissToast = () => setToast(null);

  // Lives management actions
  const loseLife = (reason?: string): boolean => {
    if (currentUser.isPro) {
      // PRO members have unlimited lives!
      return false;
    }

    const currentLives = typeof currentUser.lives === 'number' ? currentUser.lives : 5;
    if (currentLives <= 0) {
      showToast('Brak serc! Odnów serca w Sklepie lub wykonaj szybką powtórkę.', 'danger');
      setIsLivesModalOpen(true);
      return false;
    }

    const result = deductLife(currentUser);
    setCurrentUser(result.updatedUser);
    setAllUsers((users) => users.map((u) => (u.id === result.updatedUser.id ? result.updatedUser : u)));
    setLivesInfo(calculateRegeneratedLives(result.updatedUser));

    const remaining = result.updatedUser.lives;
    soundManager.playHeartLost();
    showToast(
      reason || `Tracisz 1 serce! Zostało: ${remaining}/5. Ucz się na błędach!`,
      remaining === 0 ? 'danger' : 'info'
    );

    if (remaining === 0) {
      setIsLivesModalOpen(true);
    }

    return true;
  };

  const refillLives = () => {
    const updated = refillAllLives(currentUser);
    setCurrentUser(updated);
    setAllUsers((users) => users.map((u) => (u.id === updated.id ? updated : u)));
    setLivesInfo(calculateRegeneratedLives(updated));
    showToast('Wszystkie serca zostały odnowione (5/5)!', 'success');
  };

  const earnPracticeLife = () => {
    const maxLives = currentUser.maxLives ?? 5;
    const currentLives = typeof currentUser.lives === 'number' ? currentUser.lives : maxLives;
    if (currentUser.isPro || currentLives >= maxLives) {
      const newXp = currentUser.xp + 15;
      const levelInfo = calculateLevel(newXp);
      const updated: User = {
        ...currentUser,
        xp: newXp,
        level: levelInfo.level,
      };
      setCurrentUser(updated);
      setAllUsers((users) => users.map((u) => (u.id === updated.id ? updated : u)));
      soundManager.playSuccess();
      showToast('Masz już 5/5 serc — przyznano bonus +15 XP za szybką powtórkę!', 'success');
      return;
    }

    const updated = addLife(currentUser, 1);
    setCurrentUser(updated);
    setAllUsers((users) => users.map((u) => (u.id === updated.id ? updated : u)));
    setLivesInfo(calculateRegeneratedLives(updated));
    soundManager.playSuccess();
    showToast('+1 Serce zdobyte za aktywność w powtórkach!', 'success');
  };

  const earnAdRewardLife = (): { success: boolean; message: string } => {
    const todayKey = formatLocalDateKey(new Date());
    const nowMs = Date.now();
    const eligibility = checkRewardedAdEligibility({
      user: currentUser,
      config: adSenseConfig,
      nowMs,
      todayDateKey: todayKey,
    });

    if (!eligibility.allowed) {
      const msg = eligibility.reason || 'Nie można teraz odebrać nagrody z reklamy.';
      showToast(msg, 'danger');
      return { success: false, message: msg };
    }

    const maxLives = currentUser.maxLives ?? 5;
    const currentLives = typeof currentUser.lives === 'number' ? currentUser.lives : maxLives;
    const nextDailyCount = eligibility.watchedToday + 1;

    if (currentLives >= maxLives) {
      const newXp = currentUser.xp + 20;
      const levelInfo = calculateLevel(newXp);
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
      soundManager.playSuccess();
      const msg = 'Masz już 5/5 serc — przyznano bonus +20 XP za obejrzenie reklamy Google AdSense!';
      showToast(msg, 'success');
      return { success: true, message: msg };
    }

    const withHeart = addLife(currentUser, 1);
    const updated: User = {
      ...withHeart,
      lastAdRewardTimestamp: nowMs,
      lastAdRewardDate: todayKey,
      dailyAdRewardsCount: nextDailyCount,
    };
    setCurrentUser(updated);
    setAllUsers((users) => users.map((u) => (u.id === updated.id ? updated : u)));
    setLivesInfo(calculateRegeneratedLives(updated));
    soundManager.playSuccess();
    const msg = `+1 Serce zdobyte dzięki reklamie Google AdSense! (${updated.lives}/${maxLives} ❤️)`;
    showToast(msg, 'success');
    return { success: true, message: msg };
  };

  const buyHeart = (): boolean => {
    const res = buyHeartWithXP(currentUser);
    if (!res.success) {
      showToast(res.error || 'Nie można kupić serca.', 'danger');
      return false;
    }
    setCurrentUser(res.user);
    setAllUsers((users) => users.map((u) => (u.id === res.user.id ? res.user : u)));
    setLivesInfo(calculateRegeneratedLives(res.user));
    showToast(`Zakupiono 1 serce za ${XP_COST_ONE_HEART} XP!`, 'success');
    return true;
  };

  const buyRefill = (): boolean => {
    const res = buyFullRefillWithXP(currentUser);
    if (!res.success) {
      showToast(res.error || 'Nie można odnowić serc.', 'danger');
      return false;
    }
    setCurrentUser(res.user);
    setAllUsers((users) => users.map((u) => (u.id === res.user.id ? res.user : u)));
    setLivesInfo(calculateRegeneratedLives(res.user));
    showToast(`Odnawianie pełnego pakietu serc (5/5) za ${XP_COST_FULL_REFILL} XP!`, 'success');
    return true;
  };

  const buyFreeze = (): boolean => {
    const res = buyStreakFreezeWithXP(currentUser);
    if (!res.success) {
      showToast(res.error || 'Nie można kupić tarczy serii.', 'danger');
      return false;
    }
    setCurrentUser(res.user);
    setAllUsers((users) => users.map((u) => (u.id === res.user.id ? res.user : u)));
    showToast(`Kupiono Tarczę Serii za ${XP_COST_STREAK_FREEZE} XP! Twoja passa jest chroniona.`, 'badge');
    return true;
  };

  const togglePro = (enable: boolean, plan: 'monthly' | 'yearly' = 'monthly') => {
    if (!isAuthenticated || currentUser.id === 'user-guest') {
      showToast('Zaloguj się lub utwórz konto, aby aktywować subskrypcję Full Stack PRO.', 'danger');
      window.dispatchEvent(new CustomEvent('akademia:open-auth-modal'));
      return;
    }
    const updated = setProStatus(currentUser, enable, plan);
    setCurrentUser(updated);
    setAllUsers((users) => users.map((u) => (u.id === updated.id ? updated : u)));
    setLivesInfo(calculateRegeneratedLives(updated));

    if (enable) {
      showToast('Subskrypcja Full Stack PRO aktywna! Nielimitowane życia i pełen dostęp.', 'badge');
    } else {
      showToast('Przełączono na plan bezpłatny z limitem 5 serc.', 'info');
    }
  };


  const setActiveTab = (tab: AppTab, lessonId?: string, projectId?: string) => {
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
          ? 'Dostęp zablokowany dla gości! Zaloguj się, aby uzyskać dostęp do chronionej sekcji.'
          : 'Brak uprawnień! Panel Administratora jest chroniony przez ProtectedRoute.',
        'danger'
      );
    }
    setActiveTabState(tab);
    if (lessonId) setSelectedLessonId(lessonId);
    if (projectId) setSelectedProjectId(projectId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginUser = (email: string, password?: string): { success: boolean; error?: string } => {
    const result = authenticateUserCredentials(allUsers, email, password);
    if (!result.success || !result.user) {
      appendSecurityLog({
        type: 'auth_blocked',
        severity: (email || '').trim().toLowerCase() === 'zordonzordon1@gmail.com' ? 'critical' : 'warning',
        actorEmail: (email || 'nieznany').trim(),
        actorRole: !isAuthenticated ? 'guest' : currentUser.role,
        action: 'Nieudana próba logowania formularzem',
        details: result.error || 'Błąd autoryzacji danych logowania.',
      });
      return { success: false, error: result.error };
    }

    const updatedUser = result.user;
    appendSecurityLog({
      type: 'login_success',
      severity: 'info',
      actorEmail: updatedUser.email,
      actorRole: updatedUser.role,
      action: 'Pomyślne logowanie użytkownika',
      details: `Zalogowano na konto kursanta: ${updatedUser.name}.`,
    });
    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    setAllUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setLivesInfo(calculateRegeneratedLives(updatedUser));
    if (updatedUser.role !== 'admin' && activeTab === 'admin') {
      setActiveTabState('dashboard');
    }
    soundManager.playSuccess();
    showToast(`Witaj ponownie, ${updatedUser.name}! Zalogowano pomyślnie.`, 'success');
    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsSyncingCloud(true);
      const fbUser = await signInWithGoogleFirebase();
      const cloudProfile = await fetchOrCreateCloudUserProfile(fbUser, currentUser);
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
      soundManager.playLevelUp();
      showToast(
        `Połączono z chmurą Firebase! Witaj, ${cloudProfile.name}. Postępy synchronizują się z Firestore.`,
        'badge'
      );
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Nie udało się zalogować przez Google.';
      return {
        success: false,
        error: msg.includes('popup-closed-by-user')
          ? 'Okno logowania Google zostało zamknięte przed zakończeniem autoryzacji.'
          : `Błąd autoryzacji Firebase Google: ${msg}`,
      };
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const syncNowToCloud = async (): Promise<boolean> => {
    if (!firebaseUid || !isCloudConnected) {
      showToast('Zaloguj się przez Google (Firebase Auth), aby włączyć synchronizację w chmurze.', 'info');
      return false;
    }
    setIsSyncingCloud(true);
    const ok = await saveUserProfileToCloud(firebaseUid, currentUser);
    setIsSyncingCloud(false);
    if (ok) {
      soundManager.playSuccess();
      showToast('Profil i postępy zostały pomyślnie zapisane w bazie Cloud Firestore!', 'success');
    } else {
      showToast('Nie udało się zsynchronizować profilu z bazą Firestore.', 'danger');
    }
    return ok;
  };

  const registerUser = (params: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    antiBotPassed: boolean;
    antiBotScore?: number;
    bio?: string;
  }): { success: boolean; user?: User; error?: string } => {
    const result = validateAndCreateUser(allUsers, params);
    if (!result.success || !result.user) {
      return { success: false, error: result.error };
    }

    const newUser = result.user;
    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setLivesInfo(calculateRegeneratedLives(newUser));
    if (newUser.role !== 'admin' && activeTab === 'admin') {
      setActiveTabState('dashboard');
    }

    soundManager.playLevelUp();
    showToast(`Konto zostało pomyślnie utworzone i zweryfikowane anty-botem! Witaj, ${newUser.name}.`, 'success');
    return { success: true, user: newUser };
  };

  const updateCurrentUserProfile = (partial: {
    name?: string;
    bio?: string;
    password?: string;
    weeklyGoalMinutes?: number;
  }): { success: boolean; message: string } => {
    if (!isAuthenticated || currentUser.id === 'user-guest') {
      return { success: false, message: 'Zaloguj się na swoje konto, aby zapisać zmiany profilu.' };
    }

    const cleanName = partial.name !== undefined ? partial.name.trim() : currentUser.name;
    if (cleanName.length < 2) {
      return { success: false, message: 'Imię i nazwisko musi zawierać co najmniej 2 znaki.' };
    }

    if (partial.password !== undefined && partial.password.trim().length > 0 && partial.password.length < 6) {
      return { success: false, message: 'Nowe hasło musi mieć co najmniej 6 znaków.' };
    }

    const updatedUser: User = {
      ...currentUser,
      name: cleanName,
      bio: partial.bio !== undefined ? partial.bio.trim() : currentUser.bio,
      password:
        partial.password && partial.password.trim().length >= 6
          ? partial.password
          : currentUser.password,
      weeklyGoalMinutes:
        typeof partial.weeklyGoalMinutes === 'number' && partial.weeklyGoalMinutes >= 30
          ? partial.weeklyGoalMinutes
          : currentUser.weeklyGoalMinutes,
    };

    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    soundManager.playSuccess();
    showToast('Twój profil oraz ustawienia bezpieczeństwa zostały zaktualizowane.', 'success');
    return { success: true, message: 'Zmiany w profilu zostały zapisane.' };
  };

  const deleteUser = (userId: string) => {
    if (!isAuthenticated || currentUser.role !== 'admin') {
      showToast('Brak uprawnień administratora.', 'danger');
      return;
    }
    const userToDelete = allUsers.find((u) => u.id === userId);
    if (!userToDelete) return;

    if (userId === 'user-admin' || userToDelete.role === 'admin') {
      showToast('Nie można usunąć głównego konta administratora.', 'danger');
      return;
    }

    const updated = allUsers.filter((u) => u.id !== userId);
    setAllUsers(updated);

    if (currentUser.id === userId) {
      setIsAuthenticated(false);
      setCurrentUser(createGuestUser());
      if (activeTab === 'admin') {
        setActiveTabState('dashboard');
      }
    }

    showToast(`Konto ${userToDelete.name} zostało usunięte z bazy danych.`, 'info');
  };

  const setUserStatus = (userId: string, status: UserStatus, reason?: string) => {
    if (!isAuthenticated || currentUser.role !== 'admin') {
      showToast('Brak uprawnień administratora.', 'danger');
      return;
    }
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
      setCurrentUser(createGuestUser());
      if (activeTab === 'admin') {
        setActiveTabState('dashboard');
      }
    } else if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, status, banReason: reason }));
    }

    const actionText = status === 'active' ? 'odblokowane i aktywne' : status === 'suspended' ? 'zawieszone' : 'zablokowane';
    showToast(`Status konta został zmieniony: ${actionText}.`, status === 'active' ? 'success' : 'danger');
  };

  const resetUserPassword = (email: string, newPassword: string = 'noweHaslo2026!'): { success: boolean; message: string } => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const found = allUsers.find((u) => u.email.trim().toLowerCase() === cleanEmail);
    const resetCheck = canResetUserPassword(found);
    if (!resetCheck.allowed || !found) {
      return { success: false, message: resetCheck.error || 'Nie znaleziono konta z podanym adresem e-mail.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'Nowe hasło musi mieć co najmniej 6 znaków.' };
    }

    setAllUsers((prev) =>
      prev.map((u) => (u.id === found.id ? { ...u, password: newPassword } : u))
    );
    if (currentUser.id === found.id) {
      setCurrentUser((prev) => ({ ...prev, password: newPassword }));
    }
    showToast(`Hasło dla ${found.name} zostało zaktualizowane.`, 'badge');
    return { success: true, message: `Nowe hasło dla konta ${found.email} zostało ustawione: ${newPassword}` };
  };

  const verifyUserAntiBot = (userId: string) => {
    if (!isAuthenticated || currentUser.role !== 'admin') {
      showToast('Brak uprawnień administratora.', 'danger');
      return;
    }
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, antiBotVerified: true, antiBotScore: 100, status: 'active' } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, antiBotVerified: true, antiBotScore: 100, status: 'active' }));
    }
    showToast('Konto zostało zweryfikowane przez system anty-bot (100% human score).', 'success');
  };

  const giveProByAdmin = (userId: string, isPro: boolean, plan: 'monthly' | 'yearly' = 'yearly') => {
    if (!isAuthenticated || currentUser.role !== 'admin') {
      showToast('Brak uprawnień administratora.', 'danger');
      return;
    }
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = setProStatus(u, isPro, plan);
          if (currentUser.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    showToast(`Zaktualizowano uprawnienia PRO dla użytkownika.`, 'badge');
  };

  const refillUserLivesByAdmin = (userId: string) => {
    if (!isAuthenticated || currentUser.role !== 'admin') {
      showToast('Brak uprawnień administratora.', 'danger');
      return;
    }
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = refillAllLives(u);
          if (currentUser.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    showToast('Serca użytkownika zostały uzupełnione do maksimum (5/5).', 'success');
  };

  const switchUser = (userId: string) => {
    const found = allUsers.find((u) => u.id === userId);
    const check = canSwitchToUser(found, currentUser, isAuthenticated);
    if (!check.allowed || !found) {
      showToast(check.error || 'Nie można przełączyć na to konto.', 'danger');
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
    showToast(`Przełączono na profil: ${found.name} (${found.role === 'admin' ? 'Instruktor/Admin' : 'Kursant'})`, 'info');
  };

  const logout = () => {
    const prevName = currentUser.name;
    void signOutFromFirebase();
    setFirebaseUid(null);
    setIsCloudConnected(false);
    const guest = createGuestUser();
    setIsAuthenticated(false);
    setCurrentUser(guest);
    setLivesInfo(calculateRegeneratedLives(guest));
    if (activeTab === 'admin') {
      setActiveTabState('dashboard');
    }
    showToast(`Wylogowano z konta (${prevName}). Jesteś teraz w trybie gościa.`, 'info');
  };

  const completeLesson = (lessonId: string, xpReward: number) => {
    const lessonObj = allLessons.find((l) => l.id === lessonId);
    const lessonMinutes = lessonObj?.durationMinutes || 25;

    setCurrentUser((prev) => {
      const alreadyCompleted = prev.completedLessons.includes(lessonId);
      const newCompleted = alreadyCompleted ? prev.completedLessons : [...prev.completedLessons, lessonId];
      const addedXp = alreadyCompleted ? 0 : xpReward;
      const newXp = prev.xp + addedXp;
      const levelInfo = calculateLevel(newXp);
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
      };

      // Check badges
      const newBadges = checkBadgesToUnlock(updatedUser);
      if (newBadges.length > 0) {
        updatedUser.unlockedBadges = [...(updatedUser.unlockedBadges || []), ...newBadges];
        soundManager.playBadgeUnlocked();
        showToast(`Zdobyto nową odznakę! Sprawdź swój profil.`, 'badge');
      } else if (levelInfo.level > prev.level) {
        soundManager.playLevelUp();
        showToast(`Awans na Poziom ${levelInfo.level}: ${levelInfo.title}!`, 'success');
      } else if (!alreadyCompleted) {
        soundManager.playSuccess();
        showToast(`Gratulacje! Ukończono lekcję (+${xpReward} XP)`, 'success');
      }

      // Update in allUsers list
      setAllUsers((users) => users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      return updatedUser;
    });
  };

  const saveQuizScore = (lessonId: string, scorePercent: number) => {
    setCurrentUser((prev) => {
      const updatedScores = {
        ...prev.quizScores,
        [lessonId]: Math.max(scorePercent, prev.quizScores[lessonId] || 0),
      };

      const updatedUser: User = {
        ...prev,
        quizScores: updatedScores,
      };

      const newBadges = checkBadgesToUnlock(updatedUser);
      if (newBadges.length > 0) {
        updatedUser.unlockedBadges = [...(updatedUser.unlockedBadges || []), ...newBadges];
        soundManager.playBadgeUnlocked();
        showToast(`Zdobyto odznakę za test wiedzy!`, 'badge');
      } else if (scorePercent >= 80) {
        soundManager.playSuccess();
      }

      setAllUsers((users) => users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      return updatedUser;
    });
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

  const completeProject = (projectId: string, xpReward: number) => {
    setCurrentUser((prev) => {
      const alreadyCompleted = prev.completedProjects.includes(projectId);
      const newCompleted = alreadyCompleted ? prev.completedProjects : [...prev.completedProjects, projectId];
      const addedXp = alreadyCompleted ? 0 : xpReward;
      const newXp = prev.xp + addedXp;
      const levelInfo = calculateLevel(newXp);

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

      showToast(`Wspaniale! Projekt oddany i zaliczony (+${xpReward} XP)`, 'success');
      setAllUsers((users) => users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      return updatedUser;
    });
  };

  const addAnnouncement = (title: string, content: string, category: Announcement['category']) => {
    if (!isAuthenticated || currentUser.role !== 'admin') {
      showToast('Brak uprawnień administratora.', 'danger');
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
    showToast('Opublikowano nowe ogłoszenie dla kursantów.', 'info');
  };

  const deleteAnnouncement = (id: string) => {
    if (!isAuthenticated || currentUser.role !== 'admin') {
      showToast('Brak uprawnień administratora.', 'danger');
      return;
    }
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    if (isCloudConnected && currentUser.role === 'admin') {
      void deleteAnnouncementFromCloud(id);
    }
    showToast('Ogłoszenie zostało usunięte.', 'info');
  };

  const updateUserByAdmin = (userId: string, partial: Partial<User>) => {
    if (!isAuthenticated || currentUser.role !== 'admin') {
      showToast('Brak uprawnień administratora.', 'danger');
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
    showToast('Zaktualizowano profil użytkownika w bazie danych.', 'success');
  };

  const awardCustomXp = useCallback((xpAmount: number, reason: string, rewardId?: string): boolean => {
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
      const levelInfo = calculateLevel(newXp);
      const updatedUser: User = {
        ...prev,
        xp: newXp,
        level: levelInfo.level,
      };
      setAllUsers((users) => users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      return updatedUser;
    });

    if (!wasGranted) {
      showToast(`Zadanie zostało już wcześniej zaliczone (punkty XP zostały już przyznane).`, 'info');
      return false;
    }

    soundManager.playSuccess();
    showToast(`${reason} (+${xpAmount} XP)`, 'success');
    return true;
  }, []);

  const importUserBackup = useCallback(
    (restoredUser: User) => {
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
      showToast(`Przywrócono kopię zapasową profilu: ${safeUser.name}`, 'badge');
    },
    [currentUser, isAuthenticated]
  );

  const weakAreas = useMemo(
    () => findWeakAreas(currentUser.quizScores || {}, allLessons),
    [currentUser.quizScores, allLessons]
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
    const perm = await requestBrowserNotificationPermission();
    setNotificationPermission(perm);
    if (perm === 'granted') {
      showToast('Powiadomienia Push (Service Worker) zostały włączone!', 'success');
    } else if (perm === 'denied') {
      showToast('Uprawnienia powiadomień przeglądarki są zablokowane — aktywne są przypomnienia w aplikacji.', 'info');
    }
    return perm;
  }, []);

  const triggerGoalReminderNow = useCallback(
    async (isTest: boolean = false): Promise<boolean> => {
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
      });

      const swSent = await sendServiceWorkerNotification(payload);
      soundManager.playSuccess();

      const remaining = Math.max(0, dailyGoalMinutes - todaySpentMinutes);
      const toastMsg = isTest
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

      if (shouldTriggerDailyReminderNow(reminderSettings, todaySpentMinutes, now)) {
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
  ]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isCloudConnected,
        isSyncingCloud,
        firebaseUid,
        allUsers,
        activeTab,
        selectedLessonId,
        selectedProjectId,
        announcements,
        theme,
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
        saveCodeSnippet,
        completeProject,
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
        securityLogs,
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
