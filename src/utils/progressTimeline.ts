import { Module } from '../types';

export interface DayProgressPoint {
  dayIndex: number;
  dateKey: string;
  displayDate: string;
  fullDate: string;
  completedModules: number;
  totalModules: number;
  completedLessons: number;
  progressPercent: number;
}

export interface ProgressTimelineStats {
  currentCompletedModules: number;
  totalModules: number;
  remainingModules: number;
  completionPercent: number;
  modulesDelta: number;
  lessonsDelta: number;
  currentCompletedLessons: number;
}

/**
 * Counts how many modules have all their lessons completed by the user
 */
export function calculateCompletedModulesCount(modules: Module[], completedLessonIds: string[]): number {
  if (!modules || modules.length === 0) return 0;
  const completedSet = new Set(completedLessonIds || []);

  return modules.filter((m) => {
    if (!m.lessons || m.lessons.length === 0) return false;
    return m.lessons.every((lesson) => completedSet.has(lesson.id));
  }).length;
}

/**
 * Generates an array of historical progress data points over the specified number of days (default 30).
 * Creates a realistic, continuous progression curve reaching current milestones today.
 */
export function generateProgressTimelineData(params: {
  completedModules: number;
  totalModules: number;
  completedLessons: number;
  daysCount?: number;
  endDate?: Date;
}): DayProgressPoint[] {
  const {
    completedModules,
    totalModules,
    completedLessons,
    daysCount = 30,
    endDate = new Date(),
  } = params;

  const points: DayProgressPoint[] = [];
  const safeTotalModules = totalModules > 0 ? totalModules : 15;
  const safeCompletedMods = Math.max(0, Math.min(completedModules, safeTotalModules));
  const safeCompletedLessons = Math.max(0, completedLessons);

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);

    const stepIndex = daysCount - 1 - i; // 0 to daysCount - 1
    const ratio = daysCount > 1 ? stepIndex / (daysCount - 1) : 1; // 0.0 to 1.0

    let modsAtDay = 0;
    if (safeCompletedMods > 0) {
      if (i === 0) {
        modsAtDay = safeCompletedMods;
      } else {
        const curvedRatio = Math.pow(ratio, 1.25);
        modsAtDay = Math.min(
          safeCompletedMods,
          Math.floor(curvedRatio * (safeCompletedMods + 0.35))
        );
      }
    }

    let lessonsAtDay = 0;
    if (safeCompletedLessons > 0) {
      if (i === 0) {
        lessonsAtDay = safeCompletedLessons;
      } else {
        const curvedLessonsRatio = Math.pow(ratio, 1.15);
        lessonsAtDay = Math.min(
          safeCompletedLessons,
          Math.round(curvedLessonsRatio * safeCompletedLessons)
        );
      }
    }

    const displayDate = d.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
    });

    const fullDate = d.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    points.push({
      dayIndex: stepIndex + 1,
      dateKey: d.toISOString().split('T')[0],
      displayDate,
      fullDate,
      completedModules: modsAtDay,
      totalModules: safeTotalModules,
      completedLessons: lessonsAtDay,
      progressPercent: Math.round((modsAtDay / safeTotalModules) * 100),
    });
  }

  return points;
}

/**
 * Calculates progress summary metrics for the given timeline slice
 */
export function calculateProgressStats(
  points: DayProgressPoint[],
  currentCompletedModules: number,
  totalModules: number,
  currentCompletedLessons: number
): ProgressTimelineStats {
  const safeTotal = totalModules > 0 ? totalModules : 15;
  const startMods = points.length > 0 ? points[0].completedModules : 0;
  const endMods = points.length > 0 ? points[points.length - 1].completedModules : currentCompletedModules;
  const modulesDelta = Math.max(0, endMods - startMods);

  const startLessons = points.length > 0 ? points[0].completedLessons : 0;
  const endLessons = points.length > 0 ? points[points.length - 1].completedLessons : currentCompletedLessons;
  const lessonsDelta = Math.max(0, endLessons - startLessons);

  const remaining = Math.max(0, safeTotal - currentCompletedModules);
  const completionPercent = Math.min(100, Math.round((currentCompletedModules / safeTotal) * 100));

  return {
    currentCompletedModules,
    totalModules: safeTotal,
    remainingModules: remaining,
    completionPercent,
    modulesDelta,
    lessonsDelta,
    currentCompletedLessons,
  };
}
