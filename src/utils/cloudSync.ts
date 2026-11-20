import { User } from '../types';
import { sanitizeGithubIntegrationForPersistence } from './githubService';

export type CloudCallableStatus = 'ok' | 'unavailable' | 'rejected';

export interface CloudCallableResult<T = void> {
  status: CloudCallableStatus;
  data?: T;
  error?: unknown;
}

const REJECTED_CODES = new Set([
  'invalid-argument',
  'functions/invalid-argument',
  'failed-precondition',
  'functions/failed-precondition',
  'permission-denied',
  'functions/permission-denied',
  'unauthenticated',
  'functions/unauthenticated',
  'already-exists',
  'functions/already-exists',
  'resource-exhausted',
  'functions/resource-exhausted',
]);

export function classifyCloudCallableError(error: unknown): 'unavailable' | 'rejected' {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code || '').trim().toLowerCase()
      : '';
  const message =
    error instanceof Error
      ? error.message.trim().toLowerCase()
      : String(error || '').trim().toLowerCase();

  if (REJECTED_CODES.has(code)) {
    return 'rejected';
  }

  if (
    code === 'functions/unavailable' ||
    code === 'unavailable' ||
    code === 'functions/not-found' ||
    code === 'not-found' ||
    code === 'functions/internal' ||
    code === 'internal'
  ) {
    if (code.endsWith('not-found') && (message.includes('nie znaleziono') || message.includes('not found:'))) {
      return 'rejected';
    }
    return 'unavailable';
  }

  if (
    message.includes('failed to fetch') ||
    message.includes('networkerror') ||
    message.includes('network request failed') ||
    message.includes('cors') ||
    message.includes('404') ||
    message.includes('page not found')
  ) {
    return 'unavailable';
  }

  return 'rejected';
}

export function serializeUserProfileFields(uid: string, user: User): Record<string, unknown> {
  const sanitizedGithub = user.githubIntegration
    ? sanitizeGithubIntegrationForPersistence(user.githubIntegration)
    : undefined;
  return {
    name: (user.name || 'Kursant Akademii').slice(0, 120),
    bio: (user.bio || 'Kursant Full Stack Developer Academy').slice(0, 600),
    avatar:
      user.avatar ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name || uid)}`,
    weeklyGoalMinutes: Math.max(30, Math.min(1440, Number(user.weeklyGoalMinutes) || 180)),
    savedCode: user.savedCode && typeof user.savedCode === 'object' ? user.savedCode : {},
    ...(sanitizedGithub ? { githubIntegration: sanitizedGithub } : {}),
    updatedAt: new Date().toISOString(),
  };
}

export function serializeUserProgressForFirestore(uid: string, user: User): Record<string, unknown> {
  const base = serializeUserProfileFields(uid, user);
  const completedLessons = Array.isArray(user.completedLessons)
    ? user.completedLessons.filter((item): item is string => typeof item === 'string').slice(0, 500)
    : [];
  const completedProjects = Array.isArray(user.completedProjects)
    ? user.completedProjects.filter((item): item is string => typeof item === 'string').slice(0, 100)
    : [];
  const unlockedBadges = Array.isArray(user.unlockedBadges)
    ? user.unlockedBadges.filter((item): item is string => typeof item === 'string').slice(0, 100)
    : [];
  const claimedRewards = Array.isArray(user.claimedRewards)
    ? user.claimedRewards.filter((item): item is string => typeof item === 'string').slice(0, 1000)
    : [];

  return {
    ...base,
    xp: Math.max(0, Math.min(10_000_000, Math.floor(Number(user.xp) || 0))),
    level: Math.max(1, Math.min(1000, Math.floor(Number(user.level) || 1))),
    streakDays: Math.max(0, Math.min(10_000, Math.floor(Number(user.streakDays) || 0))),
    weeklySpentMinutes: Math.max(0, Math.min(10_080, Math.floor(Number(user.weeklySpentMinutes) || 0))),
    completedLessons,
    completedProjects,
    unlockedBadges,
    claimedRewards,
    quizScores: user.quizScores && typeof user.quizScores === 'object' ? user.quizScores : {},
    lives: Math.max(0, Math.min(10, Math.floor(typeof user.lives === 'number' ? user.lives : 5))),
    maxLives: Math.max(1, Math.min(10, Math.floor(typeof user.maxLives === 'number' ? user.maxLives : 5))),
    streakFreezes: Math.max(0, Math.min(100, Math.floor(Number(user.streakFreezes) || 0))),
    ...(user.lastActiveDate ? { lastActiveDate: String(user.lastActiveDate).slice(0, 40) } : {}),
    ...(typeof user.lastHeartLostTimestamp === 'number' && Number.isFinite(user.lastHeartLostTimestamp)
      ? { lastHeartLostTimestamp: user.lastHeartLostTimestamp }
      : {}),
    ...(user.lastPracticeRewardDate
      ? { lastPracticeRewardDate: String(user.lastPracticeRewardDate).slice(0, 40) }
      : {}),
    ...(user.lastFlashcardRewardDate
      ? { lastFlashcardRewardDate: String(user.lastFlashcardRewardDate).slice(0, 40) }
      : {}),
  };
}

const VALID_ADMIN_STATUSES = new Set(['active', 'suspended', 'banned', 'pending_verification']);

export function buildAdminProUpdatePayload(
  enabled: boolean,
  plan: 'monthly' | 'yearly' = 'yearly',
  nowIso: string = new Date().toISOString()
): Record<string, unknown> {
  const safeEnabled = Boolean(enabled);
  const safePlan = plan === 'monthly' ? 'monthly' : 'yearly';
  if (safeEnabled) {
    return {
      isPro: true,
      proPlan: safePlan,
      lives: 5,
      maxLives: 5,
      updatedAt: nowIso.slice(0, 60),
    };
  }
  return {
    isPro: false,
    proPlan: null,
    updatedAt: nowIso.slice(0, 60),
  };
}

export function buildAdminStatusUpdatePayload(
  status: string,
  banReason?: string,
  nowIso: string = new Date().toISOString()
): Record<string, unknown> {
  if (!VALID_ADMIN_STATUSES.has(status)) {
    throw new Error(`Invalid user status: ${status}`);
  }
  return {
    status,
    ...(banReason ? { banReason: banReason.slice(0, 300) } : {}),
    updatedAt: nowIso.slice(0, 60),
  };
}

export function buildAdminRefillLivesPayload(
  nowIso: string = new Date().toISOString()
): Record<string, unknown> {
  return {
    lives: 5,
    maxLives: 5,
    updatedAt: nowIso.slice(0, 60),
  };
}

export const FIRESTORE_QUOTA_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes

export function isFirestoreQuotaExhaustedError(error: unknown): boolean {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code || '').trim().toLowerCase()
      : '';
  const message =
    error instanceof Error
      ? error.message.trim().toLowerCase()
      : String(error || '').trim().toLowerCase();

  return (
    code === 'resource-exhausted' ||
    code === 'firestore/resource-exhausted' ||
    code === 'functions/resource-exhausted' ||
    message.includes('resource-exhausted') ||
    message.includes('quota exceeded') ||
    message.includes('maximum backoff delay')
  );
}

export function isQuotaCircuitOpen(
  exhaustedAtMs: number | null | undefined,
  nowMs: number = Date.now(),
  cooldownMs: number = FIRESTORE_QUOTA_COOLDOWN_MS
): boolean {
  if (typeof exhaustedAtMs !== 'number' || !Number.isFinite(exhaustedAtMs) || exhaustedAtMs <= 0) {
    return false;
  }
  const elapsed = nowMs - exhaustedAtMs;
  return elapsed >= 0 && elapsed < cooldownMs;
}

export function shouldSkipTelemetryInEnvironment(
  hostname: string = '',
  userAgent: string = ''
): boolean {
  const host = hostname.trim().toLowerCase();
  const ua = userAgent.trim().toLowerCase();

  if (
    !host ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.run.app') ||
    host.endsWith('.webcontainer.io') ||
    host.endsWith('.local')
  ) {
    return true;
  }

  if (
    ua.includes('headlesschrome') ||
    ua.includes('playwright') ||
    ua.includes('puppeteer') ||
    ua.includes('lighthouse')
  ) {
    return true;
  }

  return false;
}

export const CLOUD_PROFILE_FETCH_TIMEOUT_MS = 2500;
export const GOOGLE_REDIRECT_RESULT_TIMEOUT_MS = 5000;

export async function raceWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  fallbackValue: T
): Promise<{ value: T; timedOut: boolean }> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let settled = false;

  return new Promise<{ value: T; timedOut: boolean }>((resolve, reject) => {
    timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({ value: fallbackValue, timedOut: true });
    }, timeoutMs);

    promise.then(
      (value) => {
        if (settled) return;
        settled = true;
        if (timer) clearTimeout(timer);
        resolve({ value, timedOut: false });
      },
      (err) => {
        if (settled) return;
        settled = true;
        if (timer) clearTimeout(timer);
        reject(err);
      }
    );
  });
}


