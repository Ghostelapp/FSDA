import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { escapeCsvCell, filterAndSortUsers } from './userFilters';
import { exportVisitorAnalyticsCsv } from './visitorAnalytics';
import { sanitizeHttpUrl, sanitizeGithubIntegrationForPersistence } from './githubService';
import { normalizeUserProfile, sanitizeSafeAvatarUrl } from './authValidation';
import {
  compileSandboxedChallengeFunction,
  DAILY_CHALLENGES,
  evaluateDailyChallenge,
  validateBackupPayload,
} from './developerSimulators';
import { generateSandboxDocument } from './codeRunner';
import type { User, VisitorEventRecord } from '../types';

describe('Security & Stability Audit Regressions', () => {
  it('neutralizes CSV formula injection and escapes RFC-4180 quotes/commas', () => {
    assert.equal(escapeCsvCell('=CMD("calc")'), `"'=CMD(""calc"")"`);
    assert.equal(escapeCsvCell('+1+1'), `"'+1+1"`);
    assert.equal(escapeCsvCell('-2+3'), `"'-2+3"`);
    assert.equal(escapeCsvCell('@SUM(A1:A2)'), `"'@SUM(A1:A2)"`);
    assert.equal(escapeCsvCell('\t=1+1'), `"'\t=1+1"`);
    assert.equal(escapeCsvCell('Jan, "Kowalski"'), `"Jan, ""Kowalski"""`);
    assert.equal(escapeCsvCell('normal-user'), 'normal-user');
  });

  it('neutralizes CSV formula payloads in visitor analytics CSV export', () => {
    const maliciousEvent: VisitorEventRecord = {
      id: '=1+1',
      visitorId: 'vis_12345678',
      sessionId: 'ses_12345678',
      dateKey: '2026-11-21',
      path: '=HYPERLINK("https://evil.example","Click")',
      tab: 'landing',
      referrerHost: '+evil.com',
      utmSource: '@cmd',
      deviceType: 'desktop',
      language: 'pl',
      isAuthenticated: false,
      createdAtMs: Date.UTC(2026, 10, 21, 12, 0, 0),
    };
    const csv = exportVisitorAnalyticsCsv([maliciousEvent]);
    const dataRow = csv.split('\n')[1];
    assert.ok(dataRow.includes(`"'=1+1"`));
    assert.ok(dataRow.includes(`"'=HYPERLINK(""https://evil.example"",""Click"")"`));
    assert.ok(dataRow.includes(`"'+evil.com"`));
    assert.ok(dataRow.includes(`"'@cmd"`));
  });

  it('blocks javascript:/data:/vbscript: URLs in GitHub integration and avatar sanitization', () => {
    assert.equal(sanitizeHttpUrl('javascript:alert(1)'), '');
    assert.equal(sanitizeHttpUrl('data:text/html,<script>alert(1)</script>'), '');
    assert.equal(sanitizeHttpUrl('vbscript:msgbox(1)'), '');
    assert.equal(sanitizeHttpUrl('https://github.com/octocat'), 'https://github.com/octocat');

    const cleaned = sanitizeGithubIntegrationForPersistence({
      status: 'synced',
      username: 'octocat',
      profileUrl: 'javascript:alert(document.cookie)',
      avatarUrl: 'data:image/svg+xml,<svg onload=alert(1)>',
      updatedAt: '2026-11-21T00:00:00.000Z',
      repos: [
        {
          id: 1,
          name: 'demo',
          fullName: 'octocat/demo',
          htmlUrl: 'javascript:void(0)',
          description: 'desc',
          language: 'TS',
          defaultBranch: 'main',
          isPrivate: false,
          stargazersCount: 2,
          updatedAt: '2026-11-21T00:00:00.000Z',
        },
      ],
      projectSubmissions: {
        'proj-1': {
          projectId: 'proj-1',
          repoFullName: 'octocat/demo',
          repoUrl: 'javascript:alert(1)',
          branch: 'main',
          commitSha: 'abcdef1',
          commitMessage: 'init',
          commitDate: '2026-11-21T00:00:00.000Z',
          submittedAt: '2026-11-21T00:00:00.000Z',
          status: 'verified',
          matchedFiles: ['index.html'],
          checksPassed: 3,
          checksTotal: 3,
          summary: 'ok',
        },
      },
    });

    assert.equal(cleaned?.profileUrl, undefined);
    assert.equal(cleaned?.avatarUrl, undefined);
    assert.equal(cleaned?.repos?.[0]?.htmlUrl, '');
    assert.equal(cleaned?.projectSubmissions?.['proj-1']?.repoUrl, '');

    const safeAvatar = sanitizeSafeAvatarUrl('javascript:alert(1)', 'Jan');
    assert.ok(safeAvatar.startsWith('https://api.dicebear.com/'));
  });

  it('normalizes partial/legacy user profiles without NaN/undefined and strips plaintext passwords', () => {
    const partial = {
      id: 'user-legacy',
      name: 'Anna Nowak',
      email: 'anna@example.com',
      password: 'plain-secret-password',
      xp: Number.NaN,
      streakDays: undefined,
      weeklyGoalMinutes: undefined,
      weeklySpentMinutes: undefined,
      avatar: 'javascript:alert(1)',
    } as unknown as Partial<User>;

    const normalized = normalizeUserProfile(partial, { language: 'pl', stripPassword: true });
    assert.equal(normalized.password, undefined);
    assert.equal(normalized.xp, 0);
    assert.equal(normalized.streakDays, 0);
    assert.equal(normalized.weeklyGoalMinutes, 180);
    assert.equal(normalized.weeklySpentMinutes, 0);
    assert.deepEqual(normalized.completedLessons, []);
    assert.deepEqual(normalized.completedProjects, []);
    assert.ok(normalized.avatar?.startsWith('https://api.dicebear.com/'));

    // Sorting partial users never throws
    const { filteredUsers } = filterAndSortUsers([partial as User, normalized], {
      searchQuery: '',
      role: 'all',
      proStatus: 'all',
      status: 'all',
      livesStatus: 'all',
      sortBy: 'lessons_desc',
    });
    assert.equal(filteredUsers.length, 2);
  });

  it('rejects malicious avatar URLs and non-finite stats in backup JSON import', () => {
    const payload = JSON.stringify({
      version: 'fsda-backup-v1',
      user: {
        id: 'u-1',
        name: 'Jan Developer',
        email: 'jan@example.com',
        xp: 450,
        level: Number.NaN,
        streakDays: -5,
        weeklyGoalMinutes: 0,
        weeklySpentMinutes: -10,
        avatar: 'javascript:alert(1)',
        completedLessons: ['m1-l1'],
        githubIntegration: {
          status: 'synced',
          profileUrl: 'javascript:alert(2)',
          updatedAt: '2026-11-21T00:00:00.000Z',
        },
      },
    });
    const res = validateBackupPayload(payload, 'pl');
    assert.equal(res.valid, true);
    assert.ok(res.user?.avatar?.startsWith('https://api.dicebear.com/'));
    assert.equal(res.user?.weeklyGoalMinutes, 180);
    assert.equal(res.user?.weeklySpentMinutes, 0);
    assert.equal(res.user?.githubIntegration?.profileUrl, undefined);
  });

  it('blocks browser global and prototype escape attempts in challenge code while passing valid solutions', () => {
    const challenge = DAILY_CHALLENGES[0];
    assert.ok(challenge);

    const legit = evaluateDailyChallenge(challenge, challenge.solutionCode, 'pl');
    assert.equal(legit.passedAll, true);

    const maliciousLocalStorage = evaluateDailyChallenge(
      challenge,
      `function czyPalindrom(s) { return Boolean(localStorage.getItem('x')); }`,
      'pl'
    );
    assert.equal(maliciousLocalStorage.passedAll, false);
    assert.ok(maliciousLocalStorage.error?.includes('Zablokowano'));

    const maliciousConstructor = evaluateDailyChallenge(
      challenge,
      `function czyPalindrom(s) { return ([]).constructor.constructor('return process')(); }`,
      'pl'
    );
    assert.equal(maliciousConstructor.passedAll, false);
    assert.ok(maliciousConstructor.error?.includes('Zablokowano'));

    assert.throws(
      () =>
        compileSandboxedChallengeFunction(
          `function test() { return window.location.href; }`,
          'test',
          [],
          [],
          'en'
        ),
      /Blocked restricted/
    );
  });

  it('escapes closing script and style tags inside generateSandboxDocument', () => {
    const doc = generateSandboxDocument(
      '<h1>Hello</h1>',
      'body { color: red; } </style><script>alert(1)</script>',
      'const s = "</script><img src=x onerror=alert(1)>";',
      'en'
    );
    assert.ok(!doc.includes('body { color: red; } </style><script>'));
    assert.ok(doc.includes('<\\/style'));
    assert.ok(doc.includes('const s = "<\\/script>'));
  });
});
