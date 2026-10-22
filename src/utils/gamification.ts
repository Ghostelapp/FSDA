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
