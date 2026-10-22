import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateLevel, updateStreak, checkBadgesToUnlock } from './gamification';
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
    createdAt: '2026-10-21',
  };

  const newBadges = checkBadgesToUnlock(mockUser);
  assert.ok(newBadges.includes('first-step'));
});
