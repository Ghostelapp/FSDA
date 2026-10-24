import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateEmailFormat,
  getPasswordStrength,
  authenticateUserCredentials,
  validateAndCreateUser,
  canSwitchToUser,
  createGuestUser,
} from './authValidation';
import { User } from '../types';

const MOCK_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Anna Nowak',
    email: 'anna@akademia.pl',
    password: 'Secret123!',
    role: 'student',
    status: 'active',
    antiBotVerified: true,
    xp: 450,
    level: 2,
    streakDays: 5,
    lastActiveDate: '2026-10-20',
    weeklyGoalMinutes: 180,
    weeklySpentMinutes: 90,
    completedLessons: ['html-1'],
    completedProjects: [],
    quizScores: {},
    unlockedBadges: [],
    savedCode: {},
    lives: 5,
    maxLives: 5,
    isPro: false,
    streakFreezes: 1,
    createdAt: '2026-10-01',
  },
  {
    id: 'u-banned',
    name: 'Spam Bot',
    email: 'bot@spam.pl',
    password: 'botpassword',
    role: 'student',
    status: 'banned',
    banReason: 'Automatyczny skrypt spamujący.',
    antiBotVerified: false,
    xp: 0,
    level: 1,
    streakDays: 0,
    lastActiveDate: '2026-10-01',
    weeklyGoalMinutes: 180,
    weeklySpentMinutes: 0,
    completedLessons: [],
    completedProjects: [],
    quizScores: {},
    unlockedBadges: [],
    savedCode: {},
    lives: 0,
    maxLives: 5,
    isPro: false,
    streakFreezes: 0,
    createdAt: '2026-10-01',
  },
];

test('validateEmailFormat validates correct and incorrect email addresses', () => {
  assert.equal(validateEmailFormat('student@example.com'), true);
  assert.equal(validateEmailFormat('  zordonzordon1@gmail.com  '), true);
  assert.equal(validateEmailFormat('invalid-email'), false);
  assert.equal(validateEmailFormat('missing@domain'), false);
  assert.equal(validateEmailFormat(''), false);
});

test('getPasswordStrength scores weak, medium, and strong passwords', () => {
  assert.equal(getPasswordStrength('').score, 0);
  assert.equal(getPasswordStrength('abc').score, 1);
  assert.equal(getPasswordStrength('haslo123').score, 2);
  assert.equal(getPasswordStrength('SilneHaslo2026!').score, 3);
});

test('authenticateUserCredentials succeeds with valid email and password', () => {
  const res = authenticateUserCredentials(MOCK_USERS, '  ANNA@akademia.pl ', 'Secret123!');
  assert.equal(res.success, true);
  assert.equal(res.user?.id, 'u-1');
  assert.ok(res.user?.lastLoginAt);
});

test('authenticateUserCredentials rejects empty or wrong password', () => {
  const emptyPass = authenticateUserCredentials(MOCK_USERS, 'anna@akademia.pl', '');
  assert.equal(emptyPass.success, false);
  assert.ok(emptyPass.error?.includes('hasło'));

  const wrongPass = authenticateUserCredentials(MOCK_USERS, 'anna@akademia.pl', 'wrongpass');
  assert.equal(wrongPass.success, false);
  assert.ok(wrongPass.error?.includes('Nieprawidłowe hasło'));
});

test('authenticateUserCredentials blocks banned accounts with reason', () => {
  const banned = authenticateUserCredentials(MOCK_USERS, 'bot@spam.pl', 'botpassword');
  assert.equal(banned.success, false);
  assert.ok(banned.error?.includes('zablokowane'));
  assert.ok(banned.error?.includes('Automatyczny skrypt'));
});

test('validateAndCreateUser registers new verified user and prevents duplicates', () => {
  const duplicate = validateAndCreateUser(MOCK_USERS, {
    name: 'Anna Druga',
    email: 'ANNA@akademia.pl',
    password: 'password123',
    role: 'student',
    antiBotPassed: true,
  });
  assert.equal(duplicate.success, false);
  assert.ok(duplicate.error?.includes('już istnieje'));

  const valid = validateAndCreateUser(MOCK_USERS, {
    name: 'Karol Kowalski',
    email: 'karol@fullstack.pl',
    password: 'SafePassword99!',
    role: 'student',
    antiBotPassed: true,
    antiBotScore: 100,
    bio: 'Pasjonat TypeScriptu',
  });
  assert.equal(valid.success, true);
  assert.equal(valid.user?.email, 'karol@fullstack.pl');
  assert.equal(valid.user?.status, 'active');
  assert.equal(valid.user?.antiBotVerified, true);
});

test('canSwitchToUser allows active accounts and blocks banned accounts', () => {
  assert.equal(canSwitchToUser(MOCK_USERS[0]).allowed, true);
  const blocked = canSwitchToUser(MOCK_USERS[1]);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.error?.includes('zablokowane'));
});

test('createGuestUser returns a clean unauthenticated guest profile', () => {
  const guest = createGuestUser();
  assert.equal(guest.id, 'user-guest');
  assert.equal(guest.role, 'student');
  assert.equal(guest.xp, 0);
});
