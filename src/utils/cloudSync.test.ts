import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FIRESTORE_QUOTA_COOLDOWN_MS,
  buildAdminProUpdatePayload,
  buildAdminRefillLivesPayload,
  buildAdminStatusUpdatePayload,
  classifyCloudCallableError,
  isFirestoreQuotaExhaustedError,
  isQuotaCircuitOpen,
  serializeUserProfileFields,
  serializeUserProgressForFirestore,
  shouldSkipTelemetryInEnvironment,
} from './cloudSync';
import { User } from '../types';

const SAMPLE_USER: User = {
  id: 'uid-123',
  name: 'Google Play Reviewer',
  email: 'reviewer@fsda.tech',
  role: 'student',
  status: 'active',
  antiBotVerified: true,
  xp: 250,
  level: 2,
  streakDays: 3,
  lastActiveDate: '2026-11-19',
  weeklyGoalMinutes: 180,
  weeklySpentMinutes: 45,
  completedLessons: ['fund-1', 'html-1'],
  completedProjects: ['proj-1'],
  quizScores: { 'html-1': 100 },
  unlockedBadges: ['first-step'],
  claimedRewards: ['exercise-html-1'],
  savedCode: { 'ex-1': { html: '<h1>Hi</h1>', css: '', js: '' } },
  lives: 4,
  maxLives: 5,
  lastHeartLostTimestamp: 1700000000000,
  isPro: false,
  streakFreezes: 1,
  bio: 'Tester konta',
  createdAt: '2026-11-19',
};

test('classifyCloudCallableError treats undeployed/network errors as unavailable', () => {
  assert.equal(
    classifyCloudCallableError({ code: 'functions/internal', message: 'internal' }),
    'unavailable'
  );
  assert.equal(
    classifyCloudCallableError({ code: 'functions/unavailable', message: 'Service unavailable' }),
    'unavailable'
  );
  assert.equal(
    classifyCloudCallableError(new TypeError('Failed to fetch')),
    'unavailable'
  );
});

test('classifyCloudCallableError treats business/validation errors as rejected', () => {
  assert.equal(
    classifyCloudCallableError({
      code: 'functions/failed-precondition',
      message: 'Kod nie spełnia testów zadania.',
    }),
    'rejected'
  );
  assert.equal(
    classifyCloudCallableError({
      code: 'functions/invalid-argument',
      message: 'Nieprawidłowy identyfikator lekcji.',
    }),
    'rejected'
  );
  assert.equal(
    classifyCloudCallableError({
      code: 'functions/permission-denied',
      message: 'Wymagane uprawnienia administratora.',
    }),
    'rejected'
  );
});

test('serializeUserProgressForFirestore includes progress without privileged identity fields', () => {
  const payload = serializeUserProgressForFirestore('uid-123', {
    ...SAMPLE_USER,
    role: 'admin',
    isPro: true,
    password: 'secret',
  });

  assert.equal(payload.xp, 250);
  assert.equal(payload.level, 2);
  assert.deepEqual(payload.completedLessons, ['fund-1', 'html-1']);
  assert.deepEqual(payload.completedProjects, ['proj-1']);
  assert.deepEqual(payload.quizScores, { 'html-1': 100 });
  assert.equal(payload.lives, 4);
  assert.equal('role' in payload, false);
  assert.equal('status' in payload, false);
  assert.equal('isPro' in payload, false);
  assert.equal('password' in payload, false);
});

test('serializeUserProfileFields only exposes profile fields for hardened rule fallback', () => {
  const payload = serializeUserProfileFields('uid-123', SAMPLE_USER);
  assert.equal(payload.name, 'Google Play Reviewer');
  assert.equal('xp' in payload, false);
  assert.equal('completedLessons' in payload, false);
});

test('buildAdminProUpdatePayload builds Firestore-rule-compliant grant and revoke payloads', () => {
  const granted = buildAdminProUpdatePayload(true, 'yearly', '2026-11-20T08:00:00.000Z');
  assert.deepEqual(granted, {
    isPro: true,
    proPlan: 'yearly',
    lives: 5,
    maxLives: 5,
    updatedAt: '2026-11-20T08:00:00.000Z',
  });

  const grantedMonthly = buildAdminProUpdatePayload(true, 'monthly', '2026-11-20T08:00:00.000Z');
  assert.equal(grantedMonthly.isPro, true);
  assert.equal(grantedMonthly.proPlan, 'monthly');

  const revoked = buildAdminProUpdatePayload(false, 'yearly', '2026-11-20T08:00:00.000Z');
  assert.deepEqual(revoked, {
    isPro: false,
    proPlan: null,
    updatedAt: '2026-11-20T08:00:00.000Z',
  });
});

test('buildAdminStatusUpdatePayload and buildAdminRefillLivesPayload validate fields cleanly', () => {
  const banned = buildAdminStatusUpdatePayload('banned', 'Spam', '2026-11-20T08:00:00.000Z');
  assert.deepEqual(banned, {
    status: 'banned',
    banReason: 'Spam',
    updatedAt: '2026-11-20T08:00:00.000Z',
  });

  assert.throws(() => buildAdminStatusUpdatePayload('invalid_status'));

  const refilled = buildAdminRefillLivesPayload('2026-11-20T08:00:00.000Z');
  assert.deepEqual(refilled, {
    lives: 5,
    maxLives: 5,
    updatedAt: '2026-11-20T08:00:00.000Z',
  });
});

test('isFirestoreQuotaExhaustedError and isQuotaCircuitOpen detect resource-exhausted errors and enforce cooldown', () => {
  assert.equal(
    isFirestoreQuotaExhaustedError({ code: 'resource-exhausted', message: 'Quota exceeded.' }),
    true
  );
  assert.equal(
    isFirestoreQuotaExhaustedError(new Error('FirebaseError: [code=resource-exhausted]: Quota exceeded.')),
    true
  );
  assert.equal(
    isFirestoreQuotaExhaustedError(new Error('Using maximum backoff delay to prevent overloading the backend.')),
    true
  );
  assert.equal(isFirestoreQuotaExhaustedError(new Error('Permission denied')), false);

  const now = 1_700_000_000_000;
  assert.equal(isQuotaCircuitOpen(null, now), false);
  assert.equal(isQuotaCircuitOpen(now - 5_000, now), true);
  assert.equal(isQuotaCircuitOpen(now - FIRESTORE_QUOTA_COOLDOWN_MS - 1, now), false);
});

test('shouldSkipTelemetryInEnvironment skips preview, localhost, and headless browsers while allowing production fsda.tech', () => {
  assert.equal(shouldSkipTelemetryInEnvironment('localhost', 'Mozilla/5.0'), true);
  assert.equal(
    shouldSkipTelemetryInEnvironment(
      'ais-dev-4ucmmlowc42fnc3g36cfl7-601573615813.europe-west3.run.app',
      'Mozilla/5.0'
    ),
    true
  );
  assert.equal(
    shouldSkipTelemetryInEnvironment('fsda.tech', 'Mozilla/5.0 HeadlessChrome/131.0'),
    true
  );
  assert.equal(
    shouldSkipTelemetryInEnvironment('fsda.tech', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0'),
    false
  );
});


