import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import { User, UserRole, UserStatus, Announcement, Lesson, ReviewItem, DailyReminderSettings } from '../types';
import { MODULES_DATA } from '../data/modulesData';
import { DEFAULT_ANNOUNCEMENTS } from '../data/defaultAnnouncements';
import { soundManager } from '../utils/audioFx';
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
  buyHeart: () => boolean;
  buyRefill: () => boolean;
  buyFreeze: () => boolean;
  togglePro: (enable: boolean, plan?: 'monthly' | 'yearly') => void;
  toggleTheme: () => void;
  setActiveTab: (tab: AppTab, lessonId?: string, projectId?: string) => void;
  loginUser: (email: string, password?: string) => { success: boolean; error?: string };
  registerUser: (params: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    antiBotPassed: boolean;
    antiBotScore?: number;
    bio?: string;
  }) => { success: boolean; user?: User; error?: string };
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
  awardCustomXp: (xpAmount: number, reason: string) => void;
  importUserBackup: (restoredUser: User) => void;
}

const STORAGE_KEY_USER = 'fsda_current_user_v5';
const STORAGE_KEY_USERS = 'fsda_all_users_v5';
const STORAGE_KEY_ANNOUNCEMENTS = 'fsda_announcements_v5';
const STORAGE_KEY_THEME = 'fsda_theme_v5';
const STORAGE_KEY_REMINDERS = 'fsda_reminder_settings_v1';

const DEFAULT_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Administrator (Zordon)',
    email: 'zordonzordon1@gmail.com',
    role: 'admin',
    status: 'active',
    antiBotVerified: true,
    antiBotScore: 100,
    password: 'admin123',
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
      return stored ? JSON.parse(stored) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        return JSON.parse(stored);
      }
      return DEFAULT_USERS[0];
    } catch {
      return DEFAULT_USERS[0];
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

  const [activeTab, setActiveTabState] = useState<AppTab>('dashboard');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>('html-1');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('proj-1');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'badge' | 'danger' } | null>(null);

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
      const updated = calculateRegeneratedLives(currentUser);
      setLivesInfo(updated);

      // If hearts were regenerated over time, persist to user state
      if (updated.regeneratedCount > 0 && updated.currentLives !== currentUser.lives) {
        setCurrentUser((prev) => {
          const userWithRegen: User = {
            ...prev,
            lives: updated.currentLives,
            lastHeartLostTimestamp: updated.isFull ? undefined : prev.lastHeartLostTimestamp,
          };
          setAllUsers((users) => users.map((u) => (u.id === userWithRegen.id ? userWithRegen : u)));
          return userWithRegen;
        });
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
    const updated = addLife(currentUser, 1);
    setCurrentUser(updated);
    setAllUsers((users) => users.map((u) => (u.id === updated.id ? updated : u)));
    setLivesInfo(calculateRegeneratedLives(updated));
    showToast('+1 Serce zdobyte za aktywność w powtórkach!', 'success');
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
    const updated = setProStatus(currentUser, enable, plan);
    setCurrentUser(updated);
    setAllUsers((users) => users.map((u) => (u.id === updated.id ? updated : u)));
    setLivesInfo(calculateRegeneratedLives(updated));

    if (enable) {
      showToast('👑 Subskrypcja Full Stack PRO aktywna! Nielimitowane życia i pełen dostęp.', 'badge');
    } else {
      showToast('Przełączono na plan bezpłatny z limitem 5 serc.', 'info');
    }
  };


  const setActiveTab = (tab: AppTab, lessonId?: string, projectId?: string) => {
    setActiveTabState(tab);
    if (lessonId) setSelectedLessonId(lessonId);
    if (projectId) setSelectedProjectId(projectId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginUser = (email: string, password?: string): { success: boolean; error?: string } => {
    const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
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
        error: 'Konto oczekuje na weryfikację anty-botem. Skontaktuj się z administratorem lub zaloguj jako człowiek.',
      };
    }

    if (password && found.password && found.password !== password) {
      return {
        success: false,
        error: 'Nieprawidłowe hasło dostępowe. Sprawdź poprawność lub skorzystaj z resetu hasła.',
      };
    }

    const updatedUser = {
      ...found,
      lastLoginAt: new Date().toISOString(),
    };
    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    showToast(`Witaj ponownie, ${found.name}! Zalogowano pomyślnie.`, 'success');
    return { success: true };
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
    const existing = allUsers.find((u) => u.email.toLowerCase() === params.email.toLowerCase());
    if (existing) {
      return { success: false, error: 'Konto z podanym adresem e-mail już istnieje w systemie.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: params.name,
      email: params.email,
      role: params.role,
      status: params.antiBotPassed ? 'active' : 'pending_verification',
      antiBotVerified: params.antiBotPassed,
      antiBotScore: params.antiBotScore ?? (params.antiBotPassed ? 100 : 30),
      password: params.password || 'password123',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(params.name)}`,
      xp: 0,
      level: 1,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
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
      bio: params.bio || 'Nowy kursant Akademii Full Stack.',
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [...allUsers, newUser];
    setAllUsers(updated);
    setCurrentUser(newUser);

    if (params.antiBotPassed) {
      showToast(`Konto zostało pomyślnie utworzone i zweryfikowane anty-botem! Witaj, ${params.name}.`, 'success');
    } else {
      showToast(`Konto utworzone, lecz oczekuje na pełną weryfikację anty-botem.`, 'info');
    }

    return { success: true, user: newUser };
  };

  const deleteUser = (userId: string) => {
    const userToDelete = allUsers.find((u) => u.id === userId);
    if (!userToDelete) return;

    if (userId === 'user-admin') {
      showToast('Nie można usunąć głównego konta administratora.', 'danger');
      return;
    }

    const updated = allUsers.filter((u) => u.id !== userId);
    setAllUsers(updated);

    if (currentUser.id === userId) {
      const fallback = updated[0] || DEFAULT_USERS[0];
      setCurrentUser(fallback);
    }

    showToast(`Konto ${userToDelete.name} zostało usunięte z bazy danych.`, 'info');
  };

  const setUserStatus = (userId: string, status: UserStatus, reason?: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, status, banReason: reason };
          if (currentUser.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );

    const actionText = status === 'active' ? 'odblokowane i aktywne' : status === 'suspended' ? 'zawieszone' : 'zablokowane';
    showToast(`Status konta został zmieniony: ${actionText}.`, status === 'active' ? 'success' : 'danger');
  };

  const resetUserPassword = (email: string, newPassword: string = 'noweHaslo2026!'): { success: boolean; message: string } => {
    const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, message: 'Nie znaleziono konta z podanym adresem e-mail.' };
    }

    setAllUsers((prev) =>
      prev.map((u) => (u.id === found.id ? { ...u, password: newPassword } : u))
    );
    showToast(`Hasło dla ${found.name} zostało zresetowane na: ${newPassword}`, 'badge');
    return { success: true, message: `Nowe hasło zostało ustawione: ${newPassword}` };
  };

  const verifyUserAntiBot = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, antiBotVerified: true, antiBotScore: 100, status: 'active' } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, antiBotVerified: true, antiBotScore: 100, status: 'active' }));
    }
    showToast('Konto zostało zweryfikowane przez system anty-bot (100% human score).', 'success');
  };

  const giveProByAdmin = (userId: string, isPro: boolean, plan: 'monthly' | 'yearly' = 'yearly') => {
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
    if (found) {
      setCurrentUser(found);
      showToast(`Przełączono na profil: ${found.name} (${found.role === 'admin' ? 'Instruktor/Admin' : 'Kursant'})`, 'info');
    }
  };

  const logout = () => {
    showToast('Wylogowano z konta.', 'info');
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
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      category,
      author: currentUser.name,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast('Opublikowano nowe ogłoszenie dla kursantów.', 'info');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Ogłoszenie zostało usunięte.', 'info');
  };

  const updateUserByAdmin = (userId: string, partial: Partial<User>) => {
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

  const awardCustomXp = useCallback((xpAmount: number, reason: string) => {
    setCurrentUser((prev) => {
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
    soundManager.playSuccess();
    showToast(`${reason} (+${xpAmount} XP)`, 'success');
  }, []);

  const importUserBackup = useCallback((restoredUser: User) => {
    setCurrentUser(restoredUser);
    setAllUsers((prev) => {
      const exists = prev.some((u) => u.id === restoredUser.id);
      if (exists) {
        return prev.map((u) => (u.id === restoredUser.id ? restoredUser : u));
      }
      return [...prev, restoredUser];
    });
    soundManager.playLevelUp();
    showToast(`Przywrócono kopię zapasową profilu: ${restoredUser.name}`, 'badge');
  }, []);

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
        buyHeart,
        buyRefill,
        buyFreeze,
        togglePro,
        toggleTheme,
        setActiveTab,
        loginUser,
        registerUser,
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
