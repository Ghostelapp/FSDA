import test from 'node:test';
import assert from 'node:assert/strict';
import { filterAndSortUsers } from './userFilters';
import { User, UserFilters } from '../types';

const MOCK_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Jan Kowalski',
    email: 'jan@example.com',
    role: 'student',
    status: 'active',
    antiBotVerified: true,
    xp: 300,
    level: 2,
    streakDays: 5,
    lastActiveDate: '2026-10-21',
    weeklyGoalMinutes: 180,
    weeklySpentMinutes: 60,
    completedLessons: ['html-1'],
    completedProjects: [],
    quizScores: {},
    unlockedBadges: [],
    savedCode: {},
    lives: 5,
    maxLives: 5,
    isPro: false,
    streakFreezes: 1,
    createdAt: '2026-10-10',
  },
  {
    id: 'u-2',
    name: 'Anna Nowak',
    email: 'anna@example.com',
    role: 'student',
    status: 'suspended',
    antiBotVerified: true,
    banReason: 'Podejrzenie współdzielenia konta',
    xp: 950,
    level: 4,
    streakDays: 12,
    lastActiveDate: '2026-10-21',
    weeklyGoalMinutes: 200,
    weeklySpentMinutes: 120,
    completedLessons: ['html-1', 'html-2', 'html-3'],
    completedProjects: ['proj-1'],
    quizScores: {},
    unlockedBadges: [],
    savedCode: {},
    lives: 0,
    maxLives: 5,
    isPro: true,
    streakFreezes: 2,
    createdAt: '2026-10-05',
  },
  {
    id: 'u-3',
    name: 'Piotr Admin',
    email: 'admin@dev.com',
    role: 'admin',
    status: 'active',
    antiBotVerified: true,
    xp: 5000,
    level: 9,
    streakDays: 30,
    lastActiveDate: '2026-10-21',
    weeklyGoalMinutes: 300,
    weeklySpentMinutes: 240,
    completedLessons: ['html-1', 'html-2', 'html-3', 'html-4', 'html-5'],
    completedProjects: ['proj-1', 'proj-2'],
    quizScores: {},
    unlockedBadges: [],
    savedCode: {},
    lives: 5,
    maxLives: 5,
    isPro: true,
    streakFreezes: 5,
    createdAt: '2026-09-01',
  },
];

const DEFAULT_FILTERS: UserFilters = {
  searchQuery: '',
  role: 'all',
  proStatus: 'all',
  status: 'all',
  livesStatus: 'all',
  sortBy: 'created_desc',
};

test('filterAndSortUsers filters by search query matching name or email', () => {
  const { filteredUsers } = filterAndSortUsers(MOCK_USERS, {
    ...DEFAULT_FILTERS,
    searchQuery: 'nowak',
  });

  assert.equal(filteredUsers.length, 1);
  assert.equal(filteredUsers[0].name, 'Anna Nowak');
});

test('filterAndSortUsers filters by role and status', () => {
  const { filteredUsers } = filterAndSortUsers(MOCK_USERS, {
    ...DEFAULT_FILTERS,
    role: 'student',
    status: 'suspended',
  });

  assert.equal(filteredUsers.length, 1);
  assert.equal(filteredUsers[0].id, 'u-2');
});

test('filterAndSortUsers filters by proStatus', () => {
  const { filteredUsers, stats } = filterAndSortUsers(MOCK_USERS, {
    ...DEFAULT_FILTERS,
    proStatus: 'pro',
  });

  assert.equal(filteredUsers.length, 2);
  assert.equal(stats.proCount, 2);
});

test('filterAndSortUsers sorts correctly by xp_desc', () => {
  const { filteredUsers } = filterAndSortUsers(MOCK_USERS, {
    ...DEFAULT_FILTERS,
    sortBy: 'xp_desc',
  });

  assert.equal(filteredUsers[0].xp, 5000);
  assert.equal(filteredUsers[1].xp, 950);
  assert.equal(filteredUsers[2].xp, 300);
});
