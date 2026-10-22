import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Announcement, Lesson, ReviewItem } from '../types';
import { MODULES_DATA } from '../data/modulesData';
import { PROJECTS_DATA } from '../data/projectsData';
import { DEFAULT_ANNOUNCEMENTS } from '../data/defaultAnnouncements';
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
  | 'deployment';

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
  loginUser: (email: string) => boolean;
  registerUser: (name: string, email: string, role: UserRole) => User;
  switchUser: (userId: string) => void;
  logout: () => void;
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
}

const STORAGE_KEY_USER = 'fsda_current_user_v2';
const STORAGE_KEY_USERS = 'fsda_all_users_v2';
const STORAGE_KEY_ANNOUNCEMENTS = 'fsda_announcements_v2';
const STORAGE_KEY_THEME = 'fsda_theme_v2';

const DEFAULT_USERS: User[] = [
  {
    id: 'user-jan',
    name: 'Jan Kowalski',
    email: 'jan.kowalski@example.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    xp: 220,
    level: 2,
    streakDays: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
    weeklyGoalMinutes: 180,
    weeklySpentMinutes: 75,
    completedLessons: ['fund-1'],
    completedProjects: [],
    quizScores: { 'fund-1': 100 },
    unlockedBadges: ['first-step', 'quiz-ace', 'streak-3'],
    savedCode: {},
    lives: 5,
    maxLives: 5,
    isPro: false,
    streakFreezes: 1,
    createdAt: '2026-10-15',
  },
  {
    id: 'user-anna',
    name: 'Anna Nowak',
    email: 'anna.nowak@example.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    xp: 680,
    level: 3,
    streakDays: 6,
    lastActiveDate: new Date().toISOString().split('T')[0],
    weeklyGoalMinutes: 240,
    weeklySpentMinutes: 190,
    completedLessons: ['fund-1', 'html-1', 'html-2', 'html-3'],
    completedProjects: ['proj-1'],
    quizScores: { 'fund-1': 100, 'html-1': 100, 'html-2': 85, 'html-3': 70 },
    unlockedBadges: ['first-step', 'quiz-ace', 'streak-3', 'xp-500', 'project-first'],
    savedCode: {},
    lives: 5,
    maxLives: 5,
    isPro: false,
    streakFreezes: 2,
    createdAt: '2026-10-10',
  },
  {
    id: 'user-admin',
    name: 'Marek Architekt (Instruktor Główny)',
    email: 'admin@academy.dev',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    xp: 9999,
    level: 10,
    streakDays: 45,
    lastActiveDate: new Date().toISOString().split('T')[0],
    weeklyGoalMinutes: 300,
    weeklySpentMinutes: 280,
    completedLessons: ['fund-1', 'html-1', 'html-2', 'html-3', 'html-4', 'html-5'],
    completedProjects: ['proj-1', 'proj-2', 'proj-3', 'proj-4'],
    quizScores: { 'fund-1': 100, 'html-1': 100, 'html-2': 100, 'html-3': 100, 'html-4': 100, 'html-5': 100 },
    unlockedBadges: ['first-step', 'html-master', 'quiz-ace', 'streak-3', 'streak-7', 'xp-500', 'xp-1500', 'project-first'],
    savedCode: {},
    lives: 5,
    maxLives: 5,
    isPro: true,
    proPlan: 'lifetime',
    streakFreezes: 5,
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

  // Collect all lessons across all modules
  const allLessons: Lesson[] = MODULES_DATA.flatMap((m) => m.lessons);

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

  const loginUser = (email: string): boolean => {
    const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      showToast(`Witaj ponownie, ${found.name}! Zalogowano pomyślnie.`, 'success');
      return true;
    }
    return false;
  };

  const registerUser = (name: string, email: string, role: UserRole): User => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
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
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [...allUsers, newUser];
    setAllUsers(updated);
    setCurrentUser(newUser);
    showToast(`Konto zostało utworzone! Witamy w Akademii, ${name}.`, 'success');
    return newUser;
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
    setCurrentUser((prev) => {
      const alreadyCompleted = prev.completedLessons.includes(lessonId);
      const newCompleted = alreadyCompleted ? prev.completedLessons : [...prev.completedLessons, lessonId];
      const addedXp = alreadyCompleted ? 0 : xpReward;
      const newXp = prev.xp + addedXp;
      const levelInfo = calculateLevel(newXp);
      const todayStr = new Date().toISOString().split('T')[0];
      const streakInfo = updateStreak(prev.lastActiveDate, prev.streakDays, todayStr);

      const updatedUser: User = {
        ...prev,
        xp: newXp,
        level: levelInfo.level,
        streakDays: streakInfo.newStreak,
        lastActiveDate: todayStr,
        weeklySpentMinutes: prev.weeklySpentMinutes + 25,
        completedLessons: newCompleted,
      };

      // Check badges
      const newBadges = checkBadgesToUnlock(updatedUser);
      if (newBadges.length > 0) {
        updatedUser.unlockedBadges = [...(updatedUser.unlockedBadges || []), ...newBadges];
        showToast(`Zdobyto nową odznakę! Sprawdź swój profil.`, 'badge');
      } else if (!alreadyCompleted) {
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
        showToast(`Zdobyto odznakę za test wiedzy!`, 'badge');
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

  const weakAreas = findWeakAreas(currentUser.quizScores || {}, allLessons);

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
