import test from 'node:test';
import assert from 'node:assert/strict';
import {
  executeSimulatedRequest,
  checkApiMissionCompleted,
  API_MISSIONS,
  EVENT_LOOP_SCENARIOS,
  buildWeeklyLeaderboard,
  DAILY_CHALLENGES,
  evaluateDailyChallenge,
  calculateNextFlashcardReview,
  filterCheatSheets,
  CHEAT_SHEETS_DATA,
  generateGithubPortfolioMarkdown,
  validateBackupPayload,
  sanitizeUserForExport,
  generateCertificateCode,
  verifyCertificateCode,
  validateSqlQuerySyntax,
} from './developerSimulators';
import { User } from '../types';

const mockUser: User = {
  id: 'user-test',
  name: 'Jan Testowy',
  email: 'jan@test.pl',
  role: 'student',
  status: 'active',
  antiBotVerified: true,
  xp: 5200,
  level: 6,
  streakDays: 12,
  lastActiveDate: '2026-10-23',
  weeklyGoalMinutes: 180,
  weeklySpentMinutes: 140,
  completedLessons: ['html-1', 'html-2', 'js-1'],
  completedProjects: ['proj-1'],
  quizScores: { 'html-1': 100 },
  unlockedBadges: ['first-step'],
  savedCode: {},
  lives: 5,
  maxLives: 5,
  isPro: true,
  streakFreezes: 2,
  createdAt: '2026-09-01',
};

test('REST API Simulator handles GET /api/users and POST /api/tasks', () => {
  const getRes = executeSimulatedRequest({
    method: 'GET',
    endpoint: '/api/users',
    headers: {},
    bodyRaw: '',
  });
  assert.equal(getRes.status, 200);
  assert.equal(getRes.ok, true);
  assert.equal(checkApiMissionCompleted(API_MISSIONS[0], {
    method: 'GET',
    endpoint: '/api/users',
    headers: {},
    bodyRaw: '',
  }, getRes), true);

  const postRes = executeSimulatedRequest({
    method: 'POST',
    endpoint: '/api/tasks',
    headers: { 'Content-Type': 'application/json' },
    bodyRaw: JSON.stringify({ title: 'Przetestować endpoint' }),
  });
  assert.equal(postRes.status, 201);
  assert.equal(postRes.ok, true);
});

test('REST API Simulator enforces Bearer token on /api/profile', () => {
  const unauth = executeSimulatedRequest({
    method: 'GET',
    endpoint: '/api/profile',
    headers: {},
    bodyRaw: '',
  });
  assert.equal(unauth.status, 401);

  const auth = executeSimulatedRequest({
    method: 'GET',
    endpoint: '/api/profile',
    headers: { Authorization: 'Bearer fsda-secret-token-2026' },
    bodyRaw: '',
  });
  assert.equal(auth.status, 200);
  assert.equal(auth.ok, true);
});

test('JS Event Loop scenarios have valid sequential steps', () => {
  assert.ok(EVENT_LOOP_SCENARIOS.length >= 2);
  const first = EVENT_LOOP_SCENARIOS[0];
  assert.equal(first.steps[0].consoleOutput[0], '1. Start skryptu');
  const lastStep = first.steps[first.steps.length - 1];
  assert.deepEqual(lastStep.consoleOutput, [
    '1. Start skryptu',
    '4. Koniec skryptu',
    '3. Mikro-zadanie Promise',
    '2. Callback setTimeout',
  ]);
});

test('Daily Challenge evaluator validates user solutions accurately and blocks starterCode', () => {
  for (const challenge of DAILY_CHALLENGES) {
    const starterRes = evaluateDailyChallenge(challenge, challenge.starterCode);
    assert.equal(
      starterRes.passedAll,
      false,
      `Daily challenge ${challenge.id} starterCode must NOT pass automatically`
    );

    const solutionRes = evaluateDailyChallenge(challenge, challenge.solutionCode);
    assert.equal(
      solutionRes.passedAll,
      true,
      `Daily challenge ${challenge.id} solutionCode MUST pass all unit tests`
    );
    assert.equal(solutionRes.results.length, 3);
  }
});

test('Weekly Leaderboard ranks users by XP and assigns leagues', () => {
  const board = buildWeeklyLeaderboard(mockUser, [mockUser]);
  assert.ok(board.length >= 7);
  assert.equal(board[0].rank, 1);
  assert.ok(board.some((entry) => entry.isCurrentUser && entry.league === 'Złota'));
});

test('SM-2 Flashcard scheduling updates intervals and ease factor', () => {
  const now = 1700000000000;
  const firstGood = calculateNextFlashcardReview(undefined, 'good', now);
  assert.equal(firstGood.intervalDays, 1);
  assert.equal(firstGood.repetitions, 1);

  const secondEasy = calculateNextFlashcardReview(firstGood, 'easy', now);
  assert.equal(secondEasy.intervalDays, 7);
  assert.equal(secondEasy.repetitions, 2);

  const resetAgain = calculateNextFlashcardReview(secondEasy, 'again', now);
  assert.equal(resetAgain.intervalDays, 1);
  assert.equal(resetAgain.repetitions, 0);
});

test('Cheat Sheets filter by category and query and CV/Backup helpers work', () => {
  const filtered = filterCheatSheets(CHEAT_SHEETS_DATA, 'CSS Flexbox & Grid', 'grid');
  assert.ok(filtered.length >= 1);

  const md = generateGithubPortfolioMarkdown(mockUser, ['HTML — Semantyka'], ['Portfolio Developer']);
  assert.ok(md.includes('Jan Testowy'));
  assert.ok(md.includes('Portfolio Developer'));

  const validBackup = validateBackupPayload(JSON.stringify({ user: mockUser }));
  assert.equal(validBackup.valid, true);
  assert.equal(validBackup.user?.email, 'jan@test.pl');

  // Minimal partial backup normalization test
  const partialBackup = validateBackupPayload(
    JSON.stringify({
      user: {
        id: 'user-minimal',
        name: 'Minimal User',
        email: 'min@akademia.pl',
        xp: 1200,
        completedLessons: ['fund-1'],
      },
    })
  );
  assert.equal(partialBackup.valid, true);
  assert.deepEqual(partialBackup.user?.completedProjects, []);
  assert.deepEqual(partialBackup.user?.unlockedBadges, []);
  assert.equal(partialBackup.user?.lives, 5);

  const invalidBackup = validateBackupPayload('{broken json');
  assert.equal(invalidBackup.valid, false);
});

test('Certificate code generation and verification work accurately', () => {
  const code = generateCertificateCode(mockUser);
  assert.equal(code, 'FSDA-2026-TEST-6X');

  const verified = verifyCertificateCode(code, [mockUser]);
  assert.equal(verified.valid, true);
  assert.equal(verified.isOfficial, true);
  assert.equal(verified.holderName, 'Jan Testowy');

  const invalid = verifyCertificateCode('FSDA-2026-FAKE-99X', [mockUser]);
  assert.equal(invalid.valid, false);

  // Guest certificate is blocked
  const guestUser: User = { ...mockUser, id: 'user-guest', email: 'gosc@fullstack-academy.pl' };
  const guestCode = generateCertificateCode(guestUser);
  assert.equal(guestCode, 'FSDA-GUEST-LOCKED');
  const guestVerify = verifyCertificateCode(guestCode, [mockUser], guestUser);
  assert.equal(guestVerify.valid, false);
  assert.ok(guestVerify.message.includes('Gościa'));
});

test('sanitizeUserForExport strips password and validateBackupPayload blocks guest imports', () => {
  const userWithPass: User = { ...mockUser, password: 'SuperSecretPassword!' };
  const exported = sanitizeUserForExport(userWithPass);
  assert.equal('password' in exported, false);
  assert.equal(exported.email, 'jan@test.pl');

  const guestImport = validateBackupPayload(
    JSON.stringify({
      user: {
        id: 'user-guest',
        name: 'Gość',
        email: 'gosc@fullstack-academy.pl',
        xp: 0,
        completedLessons: [],
      },
    })
  );
  assert.equal(guestImport.valid, false);
});

test('validateSqlQuerySyntax accepts valid SELECT queries and rejects invalid SQL syntax', () => {
  const validJoin = validateSqlQuerySyntax('SELECT * FROM orders INNER JOIN users ON orders.user_id = users.id;');
  assert.equal(validJoin.valid, true);

  const empty = validateSqlQuerySyntax('   ');
  assert.equal(empty.valid, false);

  const invalidTable = validateSqlQuerySyntax('SELECT * FROM hacked_secrets');
  assert.equal(invalidTable.valid, false);

  const randomGibberish = validateSqlQuerySyntax('drop table users');
  assert.equal(randomGibberish.valid, false);
});


