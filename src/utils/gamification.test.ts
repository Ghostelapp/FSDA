import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateLevel, 
  updateStreak, 
  checkBadgesToUnlock, 
  calculateRegeneratedLives, 
  deductLife, 
  buyHeartWithXP, 
  formatCountdown 
} from './gamification';
import { User } from '../types';

test('calculateLevel properly assigns starting tier for 0 XP', () => {
  const result = calculateLevel(0);
  assert.equal(result.level, 1);
  assert.equal(result.title, 'Aspirujący Programista');
  assert.equal(result.progressPercent, 0);
});

test('calculateLevel moves to tier 2 after 150 XP', () => {
  const result = calculateLevel(150);
  assert.equal(result.level, 2);
  assert.equal(result.title, 'Adept Podstaw & Terminala');
  assert.equal(result.progressPercent, 0);
});

test('calculateLevel calculates mid-tier progress percentage', () => {
  // Level 1 span is 0 to 150. At 75 XP it should be 50%
  const result = calculateLevel(75);
  assert.equal(result.level, 1);
  assert.equal(result.progressPercent, 50);
});

test('updateStreak increments on consecutive day', () => {
  const result = updateStreak('2026-10-20', 2, '2026-10-21');
  assert.equal(result.newStreak, 3);
  assert.equal(result.shouldIncrement, true);
});

test('updateStreak retains count on same day', () => {
  const result = updateStreak('2026-10-21', 3, '2026-10-21');
  assert.equal(result.newStreak, 3);
  assert.equal(result.shouldIncrement, false);
});

test('updateStreak resets to 1 after missing a day', () => {
  const result = updateStreak('2026-10-15', 5, '2026-10-21');
  assert.equal(result.newStreak, 1);
  assert.equal(result.shouldIncrement, true);
});

test('checkBadgesToUnlock awards first-step on first lesson completed', () => {
  const mockUser: User = {
    id: 'u-1',
    name: 'Jan',
    email: 'jan@example.com',
    role: 'student',
    xp: 50,
    level: 1,
    streakDays: 1,
    lastActiveDate: '2026-10-21',
    weeklyGoalMinutes: 120,
    weeklySpentMinutes: 30,
    completedLessons: ['html-1'],
    completedProjects: [],
    quizScores: {},
    unlockedBadges: [],
    savedCode: {},
    lives: 5,
    maxLives: 5,
    isPro: false,
    streakFreezes: 1,
    createdAt: '2026-10-21',
  };

  const newBadges = checkBadgesToUnlock(mockUser);
  assert.ok(newBadges.includes('first-step'));
});

test('calculateRegeneratedLives leaves PRO users with max lives and no countdown', () => {
  const proUser: User = {
    id: 'u-pro',
    name: 'Pro User',
    email: 'pro@example.com',
    role: 'student',
    xp: 500,
    level: 3,
    streakDays: 5,
    lastActiveDate: '2026-10-21',
    weeklyGoalMinutes: 180,
    weeklySpentMinutes: 60,
    completedLessons: [],
    completedProjects: [],
    quizScores: {},
    unlockedBadges: [],
    savedCode: {},
    lives: 2,
    maxLives: 5,
    isPro: true,
    streakFreezes: 2,
    createdAt: '2026-10-21',
  };

  const result = calculateRegeneratedLives(proUser, Date.now());
  assert.equal(result.currentLives, 5);
  assert.equal(result.isFull, true);
  assert.equal(result.secondsToNextHeart, null);
});

test('calculateRegeneratedLives regenerates hearts after elapsed time', () => {
  const now = 1700000000000;
  const fifteenMinutesMs = 15 * 60 * 1000;
  // Lost 2 hearts 31 minutes ago -> should recover 2 hearts
  const freeUser: User = {
    id: 'u-free',
    name: 'Free User',
    email: 'free@example.com',
    role: 'student',
    xp: 100,
    level: 1,
    streakDays: 1,
    lastActiveDate: '2026-10-21',
    weeklyGoalMinutes: 120,
    weeklySpentMinutes: 30,
    completedLessons: [],
    completedProjects: [],
    quizScores: {},
    unlockedBadges: [],
    savedCode: {},
    lives: 2,
    maxLives: 5,
    lastHeartLostTimestamp: now - (fifteenMinutesMs * 2 + 60000), // 31 mins ago
    isPro: false,
    streakFreezes: 1,
    createdAt: '2026-10-21',
  };

  const result = calculateRegeneratedLives(freeUser, now);
  assert.equal(result.regeneratedCount, 2);
  assert.equal(result.currentLives, 4);
  assert.equal(result.isFull, false);
  assert.ok(result.secondsToNextHeart !== null && result.secondsToNextHeart <= 900);
});

test('deductLife deducts 1 life on free tier, never drops below 0, and protects PRO', () => {
  const freeUser: User = {
    id: 'u-free',
    name: 'Free User',
    email: 'free@example.com',
    role: 'student',
    xp: 100,
    level: 1,
    streakDays: 1,
    lastActiveDate: '2026-10-21',
    weeklyGoalMinutes: 120,
    weeklySpentMinutes: 30,
    completedLessons: [],
    completedProjects: [],
    quizScores: {},
    unlockedBadges: [],
    savedCode: {},
    lives: 3,
    maxLives: 5,
    isPro: false,
    streakFreezes: 1,
    createdAt: '2026-10-21',
  };

  const res1 = deductLife(freeUser);
  assert.equal(res1.lost, true);
  assert.equal(res1.updatedUser.lives, 2);

  const proUser = { ...freeUser, isPro: true };
  const resPro = deductLife(proUser);
  assert.equal(resPro.lost, false);
  assert.equal(resPro.updatedUser.lives, 3);
});

test('buyHeartWithXP exchanges XP for heart', () => {
  const user: User = {
    id: 'u-1',
    name: 'Jan',
    email: 'jan@example.com',
    role: 'student',
    xp: 100,
    level: 1,
    streakDays: 1,
    lastActiveDate: '2026-10-21',
    weeklyGoalMinutes: 120,
    weeklySpentMinutes: 30,
    completedLessons: [],
    completedProjects: [],
    quizScores: {},
    unlockedBadges: [],
    savedCode: {},
    lives: 3,
    maxLives: 5,
    isPro: false,
    streakFreezes: 0,
    createdAt: '2026-10-21',
  };

  const buyRes = buyHeartWithXP(user);
  assert.equal(buyRes.success, true);
  assert.equal(buyRes.user.xp, 60); // 100 - 40
  assert.equal(buyRes.user.lives, 4);

  // Insufficient XP check
  const brokeUser = { ...user, xp: 20 };
  const brokeRes = buyHeartWithXP(brokeUser);
  assert.equal(brokeRes.success, false);
  assert.equal(brokeRes.user.lives, 3);
});

test('formatCountdown formats seconds accurately', () => {
  assert.equal(formatCountdown(0), '00:00');
  assert.equal(formatCountdown(65), '01:05');
  assert.equal(formatCountdown(900), '15:00');
});
