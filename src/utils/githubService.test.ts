import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseGithubUsername,
  parseGithubRepoIdentifier,
  formatGithubSyncTimestamp,
  formatRelativeSyncTime,
  getGithubSyncStatusPresentation,
  sanitizeGithubIntegrationForPersistence,
  fetchGithubUserAndRepos,
  submitProjectFromGithubRepo,
} from './githubService';
import { PROJECTS_DATA } from '../data/projectsData';

function jsonResponse(body: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

test('parseGithubUsername extracts and validates usernames and profile URLs', () => {
  assert.equal(parseGithubUsername('octocat'), 'octocat');
  assert.equal(parseGithubUsername('@jan-kowalski'), 'jan-kowalski');
  assert.equal(parseGithubUsername('https://github.com/torvalds'), 'torvalds');
  assert.equal(parseGithubUsername('https://github.com/gaearon/overreacted.io'), 'gaearon');
  assert.equal(parseGithubUsername(''), null);
  assert.equal(parseGithubUsername('-invalid-start'), null);
  assert.equal(parseGithubUsername('bad user name'), null);
});

test('parseGithubRepoIdentifier parses owner/repo and full GitHub URLs', () => {
  assert.deepEqual(parseGithubRepoIdentifier('octocat/Hello-World'), {
    owner: 'octocat',
    repo: 'Hello-World',
    fullName: 'octocat/Hello-World',
  });
  assert.deepEqual(parseGithubRepoIdentifier('https://github.com/vercel/next.js.git'), {
    owner: 'vercel',
    repo: 'next.js',
    fullName: 'vercel/next.js',
  });
  assert.deepEqual(parseGithubRepoIdentifier('https://github.com/facebook/react/tree/main'), {
    owner: 'facebook',
    repo: 'react',
    fullName: 'facebook/react',
  });
  assert.equal(parseGithubRepoIdentifier('just-one-segment'), null);
  assert.equal(parseGithubRepoIdentifier(''), null);
});

test('getGithubSyncStatusPresentation returns accurate visual states', () => {
  assert.equal(getGithubSyncStatusPresentation(undefined).tone, 'slate');
  assert.equal(getGithubSyncStatusPresentation({ status: 'disconnected', updatedAt: '2026-11-15T10:00:00Z' }).status, 'disconnected');
  assert.equal(getGithubSyncStatusPresentation({ status: 'syncing', updatedAt: '2026-11-15T10:00:00Z' }).tone, 'indigo');
  assert.equal(
    getGithubSyncStatusPresentation({
      status: 'synced',
      username: 'octocat',
      reposCount: 8,
      updatedAt: '2026-11-15T10:00:00Z',
    }).tone,
    'emerald'
  );
  const errState = getGithubSyncStatusPresentation({
    status: 'error',
    lastSyncError: 'Rate limit exceeded',
    updatedAt: '2026-11-15T10:00:00Z',
  });
  assert.equal(errState.tone, 'rose');
  assert.equal(errState.description, 'Rate limit exceeded');
});

test('formatGithubSyncTimestamp and formatRelativeSyncTime format valid and empty dates', () => {
  assert.equal(formatGithubSyncTimestamp(undefined), 'Nigdy nie synchronizowano');
  assert.match(formatGithubSyncTimestamp('2026-11-15T12:30:45.000Z'), /\d{2}\.\d{2}\.2026/);
  const now = new Date('2026-11-15T12:05:00.000Z').getTime();
  assert.equal(formatRelativeSyncTime('2026-11-15T12:04:30.000Z', now), 'przed chwilą');
  assert.equal(formatRelativeSyncTime('2026-11-15T12:00:00.000Z', now), '5 min temu');
  assert.equal(formatRelativeSyncTime('2026-11-15T09:00:00.000Z', now), '3 godz. temu');
});

test('fetchGithubUserAndRepos syncs GitHub profile, repos, and lastSyncedAt timestamp', async () => {
  const fakeFetch: typeof fetch = async (input) => {
    const url = String(input);
    if (url.endsWith('/users/jan-dev')) {
      return jsonResponse({
        login: 'jan-dev',
        html_url: 'https://github.com/jan-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
        public_repos: 2,
      });
    }
    if (url.includes('/users/jan-dev/repos')) {
      return jsonResponse([
        {
          id: 101,
          name: 'portfolio-site',
          full_name: 'jan-dev/portfolio-site',
          html_url: 'https://github.com/jan-dev/portfolio-site',
          description: 'My developer portfolio',
          language: 'HTML',
          default_branch: 'main',
          private: false,
          stargazers_count: 5,
          updated_at: '2026-11-14T18:00:00Z',
        },
      ]);
    }
    return jsonResponse({ message: 'Not Found' }, 404);
  };

  const result = await fetchGithubUserAndRepos('https://github.com/jan-dev', { fetchFn: fakeFetch });
  assert.equal(result.ok, true);
  assert.equal(result.integration.status, 'synced');
  assert.equal(result.integration.username, 'jan-dev');
  assert.equal(result.integration.repos?.length, 1);
  assert.equal(result.integration.repos?.[0].fullName, 'jan-dev/portfolio-site');
  assert.ok(result.integration.lastSyncedAt);
});

test('fetchGithubUserAndRepos handles 404 user not found cleanly', async () => {
  const fakeFetch: typeof fetch = async () => jsonResponse({ message: 'Not Found' }, 404);
  const result = await fetchGithubUserAndRepos('unknown-user-xyz', { fetchFn: fakeFetch });
  assert.equal(result.ok, false);
  assert.equal(result.integration.status, 'error');
  assert.match(result.error || '', /Nie znaleziono/);
});

test('submitProjectFromGithubRepo fetches tree, latest commit, files, and verifies project #1 codebase', async () => {
  const project1 = PROJECTS_DATA.find((p) => p.id === 'proj-1')!;
  const htmlContent = Buffer.from(
    `<header><nav><a href="#work">Work</a></nav></header><main><form><input type="email"/></form></main><footer>2026</footer>`,
    'utf-8'
  ).toString('base64');
  const cssContent = Buffer.from(`header { display: flex; justify-content: space-between; }`, 'utf-8').toString('base64');

  const fakeFetch: typeof fetch = async (input) => {
    const url = String(input);
    if (url.endsWith('/repos/jan-dev/portfolio-site')) {
      return jsonResponse({
        full_name: 'jan-dev/portfolio-site',
        html_url: 'https://github.com/jan-dev/portfolio-site',
        default_branch: 'main',
      });
    }
    if (url.includes('/repos/jan-dev/portfolio-site/commits')) {
      return jsonResponse([
        {
          sha: 'abc1234567890def',
          commit: {
            message: 'feat: add responsive nav and contact form',
            author: { date: '2026-11-15T10:15:00Z' },
          },
        },
      ]);
    }
    if (url.includes('/repos/jan-dev/portfolio-site/git/trees/main')) {
      return jsonResponse({
        tree: [
          { path: 'index.html', type: 'blob' },
          { path: 'styles.css', type: 'blob' },
          { path: 'README.md', type: 'blob' },
        ],
      });
    }
    if (url.includes('/contents/index.html')) {
      return jsonResponse({ encoding: 'base64', content: htmlContent });
    }
    if (url.includes('/contents/styles.css')) {
      return jsonResponse({ encoding: 'base64', content: cssContent });
    }
    return jsonResponse({ message: 'Not Found' }, 404);
  };

  const result = await submitProjectFromGithubRepo(project1, 'jan-dev/portfolio-site', {
    fetchFn: fakeFetch,
  });

  assert.equal(result.ok, true);
  assert.equal(result.submission?.status, 'verified');
  assert.equal(result.submission?.commitSha, 'abc1234567890def');
  assert.equal(result.validationSummary?.allPassed, true);
  assert.ok(result.submission?.matchedFiles.includes('index.html'));
});

test('sanitizeGithubIntegrationForPersistence bounds arrays and strips excess lengths', () => {
  const manyRepos = Array.from({ length: 45 }, (_, idx) => ({
    id: idx + 1,
    name: `repo-${idx}`,
    fullName: `user/repo-${idx}`,
    htmlUrl: `https://github.com/user/repo-${idx}`,
    defaultBranch: 'main',
    isPrivate: false,
    stargazersCount: idx,
    updatedAt: '2026-11-15T10:00:00Z',
  }));
  const cleaned = sanitizeGithubIntegrationForPersistence({
    status: 'synced',
    username: 'user',
    reposCount: 45,
    repos: manyRepos,
    updatedAt: '2026-11-15T10:00:00Z',
  });
  assert.equal(cleaned?.repos?.length, 30);
  assert.equal(cleaned?.lastSyncError, undefined);
});
