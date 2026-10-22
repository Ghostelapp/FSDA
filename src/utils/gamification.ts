import { User, Lesson, ReviewItem } from '../types';

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  currentLevelXp: number;
  levelXpSpan: number;
  progressPercent: number;
}

export const LEVEL_TIERS: { level: number; title: string; minXp: number }[] = [
  { level: 1, title: 'Aspirujący Programista', minXp: 0 },
  { level: 2, title: 'Adept Podstaw & Terminala', minXp: 150 },
  { level: 3, title: 'Mistrz Semantyki HTML & CSS', minXp: 400 },
  { level: 4, title: 'Eksplorator JavaScript & DOM', minXp: 800 },
  { level: 5, title: 'Architekt Interfejsów React', minXp: 1400 },
  { level: 6, title: 'Inżynier Backend & Node.js', minXp: 2200 },
  { level: 7, title: 'Specjalista Bazy Danych & SQL', minXp: 3200 },
  { level: 8, title: 'Strażnik Bezpieczeństwa & Auth', minXp: 4400 },
  { level: 9, title: 'Praktyk DevOps & CI/CD', minXp: 6000 },
  { level: 10, title: 'Samodzielny Junior Full Stack', minXp: 8000 },
];

export function calculateLevel(xp: number): LevelInfo {
  const safeXp = Math.max(0, Math.floor(xp));
  let currentTierIndex = 0;

  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (safeXp >= LEVEL_TIERS[i].minXp) {
      currentTierIndex = i;
    } else {
      break;
    }
  }

  const currentTier = LEVEL_TIERS[currentTierIndex];
  const nextTier = LEVEL_TIERS[currentTierIndex + 1];

  if (!nextTier) {
    return {
      level: currentTier.level,
      title: currentTier.title,
      minXp: currentTier.minXp,
      maxXp: currentTier.minXp * 1.5,
      currentLevelXp: safeXp - currentTier.minXp,
      levelXpSpan: currentTier.minXp * 0.5,
      progressPercent: 100,
    };
  }

  const levelXpSpan = nextTier.minXp - currentTier.minXp;
  const currentLevelXp = safeXp - currentTier.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentLevelXp / levelXpSpan) * 100)));

  return {
    level: currentTier.level,
    title: currentTier.title,
    minXp: currentTier.minXp,
    maxXp: nextTier.minXp,
    currentLevelXp,
    levelXpSpan,
    progressPercent,
  };
}

export function updateStreak(lastActiveDateStr: string, currentStreak: number, todayDateStr: string): { newStreak: number; shouldIncrement: boolean } {
  if (!lastActiveDateStr) {
    return { newStreak: 1, shouldIncrement: true };
  }

  const lastDate = new Date(lastActiveDateStr);
  const today = new Date(todayDateStr);

  // Normalize to UTC midnight
  const lastUtc = Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

  const diffDays = Math.round((todayUtc - lastUtc) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Already active today
    return { newStreak: currentStreak, shouldIncrement: false };
  } else if (diffDays === 1) {
    // Exactly consecutive day
    return { newStreak: currentStreak + 1, shouldIncrement: true };
  } else {
    // Missed at least one day, reset to 1
    return { newStreak: 1, shouldIncrement: true };
  }
}

export function checkBadgesToUnlock(user: User): string[] {
  const unlocked = new Set(user.unlockedBadges || []);
  const newlyUnlocked: string[] = [];

  const maybeUnlock = (badgeId: string, condition: boolean) => {
    if (condition && !unlocked.has(badgeId)) {
      newlyUnlocked.push(badgeId);
    }
  };

  // 1. First code step
  maybeUnlock('first-step', user.completedLessons.length >= 1);

  // 2. HTML Mastery
  const htmlLessonsCount = user.completedLessons.filter((id) => id.startsWith('html-')).length;
  maybeUnlock('html-master', htmlLessonsCount >= 5);

  // 3. Quiz Genius (at least one 100% quiz)
  const hasPerfectQuiz = Object.values(user.quizScores || {}).some((score) => score >= 100);
  maybeUnlock('quiz-ace', hasPerfectQuiz);

  // 4. Dedicated Streaker
  maybeUnlock('streak-3', user.streakDays >= 3);
  maybeUnlock('streak-7', user.streakDays >= 7);

  // 5. XP Milestones
  maybeUnlock('xp-500', user.xp >= 500);
  maybeUnlock('xp-1500', user.xp >= 1500);

  // 6. Project Pioneer
  maybeUnlock('project-first', user.completedProjects.length >= 1);

  return newlyUnlocked;
}

export function findWeakAreas(quizScores: Record<string, number>, allLessons: Lesson[]): ReviewItem[] {
  const weakItems: ReviewItem[] = [];

  for (const lesson of allLessons) {
    const score = quizScores[lesson.id];
    if (score !== undefined && score < 80) {
      weakItems.push({
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        moduleTitle: lesson.moduleTitle,
        quizScore: score,
        lastAttempt: 'Niedawno',
        keyTopics: lesson.objectives.slice(0, 3),
      });
    }
  }

  return weakItems;
}

// -------------------------------------------------------------
// Lives & Gamified Subscription Mechanics
// -------------------------------------------------------------

export const MAX_FREE_LIVES = 5;
export const HEART_REGEN_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes per heart
export const XP_COST_ONE_HEART = 40;
export const XP_COST_FULL_REFILL = 150;
export const XP_COST_STREAK_FREEZE = 120;

export interface LivesCalculationResult {
  currentLives: number;
  maxLives: number;
  isFull: boolean;
  secondsToNextHeart: number | null; // null if full or isPro
  regeneratedCount: number;
}

/**
 * Calculates lives restored over elapsed time.
 */
export function calculateRegeneratedLives(user: User, nowMs: number = Date.now()): LivesCalculationResult {
  const maxLives = user.maxLives ?? MAX_FREE_LIVES;

  if (user.isPro) {
    return {
      currentLives: maxLives,
      maxLives,
      isFull: true,
      secondsToNextHeart: null,
      regeneratedCount: 0,
    };
  }

  const currentLives = typeof user.lives === 'number' ? user.lives : maxLives;

  if (currentLives >= maxLives) {
    return {
      currentLives: maxLives,
      maxLives,
      isFull: true,
      secondsToNextHeart: null,
      regeneratedCount: 0,
    };
  }

  if (!user.lastHeartLostTimestamp) {
    return {
      currentLives,
      maxLives,
      isFull: false,
      secondsToNextHeart: Math.round(HEART_REGEN_INTERVAL_MS / 1000),
      regeneratedCount: 0,
    };
  }

  const elapsedMs = Math.max(0, nowMs - user.lastHeartLostTimestamp);
  const heartsRecovered = Math.floor(elapsedMs / HEART_REGEN_INTERVAL_MS);

  if (heartsRecovered <= 0) {
    const msRemaining = HEART_REGEN_INTERVAL_MS - (elapsedMs % HEART_REGEN_INTERVAL_MS);
    return {
      currentLives,
      maxLives,
      isFull: false,
      secondsToNextHeart: Math.max(1, Math.round(msRemaining / 1000)),
      regeneratedCount: 0,
    };
  }

  const newLives = Math.min(maxLives, currentLives + heartsRecovered);
  const isNowFull = newLives >= maxLives;
  
  let secondsToNextHeart: number | null = null;
  if (!isNowFull) {
    const msIntoCurrentHeart = elapsedMs % HEART_REGEN_INTERVAL_MS;
    const msRemaining = HEART_REGEN_INTERVAL_MS - msIntoCurrentHeart;
    secondsToNextHeart = Math.max(1, Math.round(msRemaining / 1000));
  }

  return {
    currentLives: newLives,
    maxLives,
    isFull: isNowFull,
    secondsToNextHeart,
    regeneratedCount: heartsRecovered,
  };
}

/**
 * Deducts 1 heart if user is on Free tier and has hearts.
 */
export function deductLife(user: User, nowMs: number = Date.now()): { updatedUser: User; lost: boolean } {
  if (user.isPro) {
    return { updatedUser: user, lost: false };
  }

  const currentLives = typeof user.lives === 'number' ? user.lives : (user.maxLives ?? MAX_FREE_LIVES);
  if (currentLives <= 0) {
    return { updatedUser: { ...user, lives: 0 }, lost: false };
  }

  const newLives = currentLives - 1;
  const lastHeartLostTimestamp = user.lastHeartLostTimestamp || nowMs;

  return {
    updatedUser: {
      ...user,
      lives: newLives,
      lastHeartLostTimestamp: newLives < (user.maxLives ?? MAX_FREE_LIVES) ? lastHeartLostTimestamp : undefined,
    },
    lost: true,
  };
}

/**
 * Adds hearts (e.g. via practice quiz in review center).
 */
export function addLife(user: User, amount: number = 1): User {
  const maxLives = user.maxLives ?? MAX_FREE_LIVES;
  const currentLives = typeof user.lives === 'number' ? user.lives : maxLives;
  const newLives = Math.min(maxLives, currentLives + amount);

  return {
    ...user,
    lives: newLives,
    lastHeartLostTimestamp: newLives >= maxLives ? undefined : user.lastHeartLostTimestamp,
  };
}

/**
 * Refills all hearts to maximum.
 */
export function refillAllLives(user: User): User {
  return {
    ...user,
    lives: user.maxLives ?? MAX_FREE_LIVES,
    lastHeartLostTimestamp: undefined,
  };
}

/**
 * Buys 1 heart using XP.
 */
export function buyHeartWithXP(user: User): { success: boolean; user: User; error?: string } {
  const maxLives = user.maxLives ?? MAX_FREE_LIVES;
  const currentLives = typeof user.lives === 'number' ? user.lives : maxLives;

  if (currentLives >= maxLives) {
    return { success: false, user, error: 'Masz już pełną liczbę żyć (5/5)!' };
  }

  if (user.xp < XP_COST_ONE_HEART) {
    return { success: false, user, error: `Potrzebujesz ${XP_COST_ONE_HEART} XP. Masz obecnie ${user.xp} XP.` };
  }

  const newLives = Math.min(maxLives, currentLives + 1);
  return {
    success: true,
    user: {
      ...user,
      xp: user.xp - XP_COST_ONE_HEART,
      lives: newLives,
      lastHeartLostTimestamp: newLives >= maxLives ? undefined : user.lastHeartLostTimestamp,
    },
  };
}

/**
 * Buys a full refill (5/5) using XP.
 */
export function buyFullRefillWithXP(user: User): { success: boolean; user: User; error?: string } {
  const maxLives = user.maxLives ?? MAX_FREE_LIVES;
  const currentLives = typeof user.lives === 'number' ? user.lives : maxLives;

  if (currentLives >= maxLives) {
    return { success: false, user, error: 'Masz już pełną liczbę żyć (5/5)!' };
  }

  if (user.xp < XP_COST_FULL_REFILL) {
    return { success: false, user, error: `Potrzebujesz ${XP_COST_FULL_REFILL} XP. Masz obecnie ${user.xp} XP.` };
  }

  return {
    success: true,
    user: {
      ...user,
      xp: user.xp - XP_COST_FULL_REFILL,
      lives: maxLives,
      lastHeartLostTimestamp: undefined,
    },
  };
}

/**
 * Buys a Streak Freeze shield using XP.
 */
export function buyStreakFreezeWithXP(user: User): { success: boolean; user: User; error?: string } {
  if (user.xp < XP_COST_STREAK_FREEZE) {
    return { success: false, user, error: `Potrzebujesz ${XP_COST_STREAK_FREEZE} XP. Masz obecnie ${user.xp} XP.` };
  }

  return {
    success: true,
    user: {
      ...user,
      xp: user.xp - XP_COST_STREAK_FREEZE,
      streakFreezes: (user.streakFreezes ?? 0) + 1,
    },
  };
}

/**
 * Sets PRO subscription status.
 */
export function setProStatus(
  user: User,
  isPro: boolean,
  plan: 'monthly' | 'yearly' | 'lifetime' = 'monthly'
): User {
  if (isPro) {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + (plan === 'yearly' ? 1 : 0));
    if (plan === 'monthly') expires.setMonth(expires.getMonth() + 1);

    return {
      ...user,
      isPro: true,
      proPlan: plan,
      proExpiresAt: expires.toISOString(),
      lives: user.maxLives ?? MAX_FREE_LIVES,
      lastHeartLostTimestamp: undefined,
    };
  }

  return {
    ...user,
    isPro: false,
    proPlan: null,
    proExpiresAt: undefined,
  };
}

/**
 * Formats seconds into mm:ss
 */
export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
