import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_ADSENSE_CONFIG,
  isValidAdSenseClientId,
  isValidAdSenseSlotId,
  shouldShowAdsForUser,
  checkRewardedAdEligibility,
  generateAdsTxtContent,
} from './adsense';
import { User } from '../types';

const makeMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-free-1',
  name: 'Jan Testowy',
  email: 'jan@test.pl',
  role: 'student',
  xp: 120,
  level: 1,
  streakDays: 2,
  lastActiveDate: '2026-10-25',
  weeklyGoalMinutes: 180,
  weeklySpentMinutes: 45,
  completedLessons: [],
  completedProjects: [],
  quizScores: {},
  unlockedBadges: [],
  savedCode: {},
  lives: 3,
  maxLives: 5,
  isPro: false,
  streakFreezes: 1,
  status: 'active',
  antiBotVerified: true,
  createdAt: '2026-10-25',
  ...overrides,
});

test('isValidAdSenseClientId validates ca-pub-XXXXXXXXXXXXXXXX format', () => {
  assert.equal(isValidAdSenseClientId('ca-pub-7482910384756192'), true);
  assert.equal(isValidAdSenseClientId('pub-7482910384756192'), false);
  assert.equal(isValidAdSenseClientId('ca-pub-123'), false);
  assert.equal(isValidAdSenseClientId(''), false);
});

test('isValidAdSenseSlotId validates numeric slot IDs', () => {
  assert.equal(isValidAdSenseSlotId('1092837465'), true);
  assert.equal(isValidAdSenseSlotId('abc1234567'), false);
  assert.equal(isValidAdSenseSlotId('123'), false);
});

test('shouldShowAdsForUser shows ads ONLY for authenticated free-tier students', () => {
  const freeStudent = makeMockUser({ isPro: false, role: 'student' });
  const proStudent = makeMockUser({ isPro: true, role: 'student' });
  const adminUser = makeMockUser({ isPro: false, role: 'admin' });
  const guestUser = makeMockUser({ id: 'user-guest', isPro: false });

  // Free authenticated student -> true
  assert.equal(shouldShowAdsForUser(freeStudent, true, DEFAULT_ADSENSE_CONFIG, 'dashboard'), true);

  // Unauthenticated -> false
  assert.equal(shouldShowAdsForUser(freeStudent, false, DEFAULT_ADSENSE_CONFIG, 'dashboard'), false);

  // Guest user -> false
  assert.equal(shouldShowAdsForUser(guestUser, true, DEFAULT_ADSENSE_CONFIG, 'dashboard'), false);

  // PRO student -> false (ad-free experience)
  assert.equal(shouldShowAdsForUser(proStudent, true, DEFAULT_ADSENSE_CONFIG, 'dashboard'), false);

  // Admin -> false
  assert.equal(shouldShowAdsForUser(adminUser, true, DEFAULT_ADSENSE_CONFIG, 'dashboard'), false);

  // Disabled placement -> false
  const disabledDashboardConfig = {
    ...DEFAULT_ADSENSE_CONFIG,
    placements: { ...DEFAULT_ADSENSE_CONFIG.placements, dashboard: false },
  };
  assert.equal(shouldShowAdsForUser(freeStudent, true, disabledDashboardConfig, 'dashboard'), false);
  assert.equal(shouldShowAdsForUser(freeStudent, true, disabledDashboardConfig, 'modules'), true);
});

test('checkRewardedAdEligibility enforces daily cap and cooldown for free accounts', () => {
  const nowMs = 1_700_000_000_000;
  const today = '2026-10-25';

  // Eligible fresh free user
  const freshUser = makeMockUser({ isPro: false });
  const res1 = checkRewardedAdEligibility({
    user: freshUser,
    config: DEFAULT_ADSENSE_CONFIG,
    nowMs,
    todayDateKey: today,
  });
  assert.equal(res1.allowed, true);
  assert.equal(res1.remainingToday, 5);

  // Cooldown active (watched 10 seconds ago, cooldown is 45s)
  const cooldownUser = makeMockUser({
    isPro: false,
    lastAdRewardTimestamp: nowMs - 10_000,
    lastAdRewardDate: today,
    dailyAdRewardsCount: 1,
  });
  const res2 = checkRewardedAdEligibility({
    user: cooldownUser,
    config: DEFAULT_ADSENSE_CONFIG,
    nowMs,
    todayDateKey: today,
  });
  assert.equal(res2.allowed, false);
  assert.equal(res2.secondsRemaining, 35);
  assert.equal(res2.remainingToday, 4);

  // Daily limit reached (5/5 watched today)
  const maxedUser = makeMockUser({
    isPro: false,
    lastAdRewardTimestamp: nowMs - 120_000,
    lastAdRewardDate: today,
    dailyAdRewardsCount: 5,
  });
  const res3 = checkRewardedAdEligibility({
    user: maxedUser,
    config: DEFAULT_ADSENSE_CONFIG,
    nowMs,
    todayDateKey: today,
  });
  assert.equal(res3.allowed, false);
  assert.equal(res3.remainingToday, 0);
});

test('generateAdsTxtContent formats Google AdSense publisher line properly', () => {
  assert.equal(
    generateAdsTxtContent('ca-pub-7482910384756192'),
    'google.com, pub-7482910384756192, DIRECT, f08c47fec0942fa0'
  );
});
