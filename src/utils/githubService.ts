import {
  GitHubIntegrationState,
  GitHubProjectSubmission,
  GitHubRepoSummary,
  GitHubSyncStatus,
  Project,
} from '../types';
import {
  getProjectInteractiveExercise,
  validateExerciseCode,
  ValidationSummary,
} from './codeRunner';
import { AppLanguage, getIntlLocale } from './i18n';

const GITHUB_API_BASE = 'https://api.github.com';
const SESSION_TOKEN_KEY = 'fsda_github_pat_session';

export interface ParsedGithubRepo {
  owner: string;
  repo: string;
  fullName: string;
}

export interface GithubSyncResult {
  ok: boolean;
  integration: GitHubIntegrationState;
  error?: string;
}

export interface GithubProjectSubmitResult {
  ok: boolean;
  submission?: GitHubProjectSubmission;
  extractedCode?: { html: string; css: string; js: string };
  validationSummary?: ValidationSummary;
  error?: string;
}

export function getSessionGithubToken(): string {
  try {
    return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(SESSION_TOKEN_KEY) || '' : '';
  } catch {
    return '';
  }
}

export function setSessionGithubToken(token: string): void {
  try {
    if (typeof sessionStorage === 'undefined') return;
    const trimmed = token.trim();
    if (trimmed) {
      sessionStorage.setItem(SESSION_TOKEN_KEY, trimmed);
    } else {
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors in restricted environments
  }
}

export function clearSessionGithubToken(): void {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
    }
  } catch {
    // Ignore
  }
}

export function parseGithubUsername(rawInput: string): string | null {
  const trimmed = (rawInput || '').trim();
  if (!trimmed) return null;

  let candidate = trimmed.replace(/^@+/, '');

  if (/^(https?:\/\/)?(www\.)?github\.com\//i.test(candidate)) {
    const normalizedUrl = candidate.startsWith('http') ? candidate : `https://${candidate}`;
    try {
      const parsed = new URL(normalizedUrl);
      const parts = parsed.pathname.split('/').filter(Boolean);
      candidate = parts[0] || '';
    } catch {
      return null;
    }
  } else if (candidate.includes('/')) {
    candidate = candidate.split('/').filter(Boolean)[0] || '';
  }

  const usernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
  return usernameRegex.test(candidate) ? candidate : null;
}

export function parseGithubRepoIdentifier(rawInput: string): ParsedGithubRepo | null {
  const trimmed = (rawInput || '').trim();
  if (!trimmed) return null;

  let owner = '';
  let repo = '';

  if (/^(https?:\/\/)?(www\.)?github\.com\//i.test(trimmed)) {
    const normalizedUrl = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    try {
      const parsed = new URL(normalizedUrl);
      const parts = parsed.pathname.split('/').filter(Boolean);
      owner = parts[0] || '';
      repo = (parts[1] || '').replace(/\.git$/i, '');
    } catch {
      return null;
    }
  } else {
    const parts = trimmed.replace(/^\/+|\/+$/g, '').split('/');
    if (parts.length < 2) return null;
    owner = parts[0] || '';
    repo = (parts[1] || '').replace(/\.git$/i, '');
  }

  const ownerValid = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(owner);
  const repoValid = /^[a-zA-Z0-9._-]{1,100}$/.test(repo) && repo !== '.' && repo !== '..';
  if (!ownerValid || !repoValid) return null;

  return {
    owner,
    repo,
    fullName: `${owner}/${repo}`,
  };
}

export function formatGithubSyncTimestamp(isoString?: string, language: AppLanguage = 'pl'): string {
  const isEn = language === 'en';
  if (!isoString) return isEn ? 'Never synced' : 'Nigdy nie synchronizowano';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isEn ? 'Unknown date' : 'Nieznana data';
  try {
    return new Intl.DateTimeFormat(getIntlLocale(language), {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

export function formatRelativeSyncTime(
  isoString?: string,
  nowMs: number = Date.now(),
  language: AppLanguage = 'pl'
): string {
  const isEn = language === 'en';
  if (!isoString) return isEn ? 'not synced' : 'brak synchronizacji';
  const ts = new Date(isoString).getTime();
  if (Number.isNaN(ts)) return isEn ? 'unknown time' : 'nieznany czas';
  const diffSec = Math.max(0, Math.floor((nowMs - ts) / 1000));
  if (diffSec < 60) return isEn ? 'just now' : 'przed chwilą';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return isEn ? `${diffMin}m ago` : `${diffMin} min temu`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return isEn ? `${diffHours}h ago` : `${diffHours} godz. temu`;
  const diffDays = Math.floor(diffHours / 24);
  return isEn ? `${diffDays}d ago` : `${diffDays} dni temu`;
}

export interface GithubStatusPresentation {
  status: GitHubSyncStatus;
  label: string;
  shortLabel: string;
  description: string;
  tone: 'emerald' | 'indigo' | 'rose' | 'slate';
}

export function getGithubSyncStatusPresentation(
  integration?: GitHubIntegrationState,
  language: AppLanguage = 'pl'
): GithubStatusPresentation {
  const isEn = language === 'en';
  const status: GitHubSyncStatus = integration?.status || 'disconnected';
  switch (status) {
    case 'synced':
      return {
        status: 'synced',
        label: isEn ? 'Connected & synced' : 'Połączono i zsynchronizowano',
        shortLabel: isEn ? 'Synced' : 'Zsynchronizowano',
        description: integration?.username
          ? isEn
            ? `Active link with @${integration.username} (${integration.reposCount ?? integration.repos?.length ?? 0} repositories).`
            : `Aktywne połączenie z @${integration.username} (${integration.reposCount ?? integration.repos?.length ?? 0} repozytoriów).`
          : isEn
          ? 'GitHub account is synced.'
          : 'Konto GitHub jest zsynchronizowane.',
        tone: 'emerald',
      };
    case 'syncing':
      return {
        status: 'syncing',
        label: isEn ? 'Syncing with GitHub...' : 'Synchronizowanie z GitHub...',
        shortLabel: isEn ? 'Syncing...' : 'Synchronizacja...',
        description: isEn
          ? 'Refreshing repositories and metadata from GitHub API.'
          : 'Trwa odświeżanie listy repozytoriów i metadanych z GitHub API.',
        tone: 'indigo',
      };
    case 'error':
      return {
        status: 'error',
        label: isEn ? 'GitHub Sync Error' : 'Błąd synchronizacji GitHub',
        shortLabel: isEn ? 'Sync error' : 'Błąd sync',
        description:
          integration?.lastSyncError ||
          (isEn
            ? 'Failed to refresh GitHub connection. Use Re-sync to retry.'
            : 'Nie udało się odświeżyć połączenia z GitHub. Użyj przycisku ponownej synchronizacji.'),
        tone: 'rose',
      };
    case 'disconnected':
    default:
      return {
        status: 'disconnected',
        label: isEn ? 'GitHub Account Not Linked' : 'Konto GitHub niepołączone',
        shortLabel: isEn ? 'Disconnected' : 'Niepołączono',
        description: isEn
          ? 'Connect your GitHub account to submit project progress directly from your codebase.'
          : 'Połącz swoje konto GitHub, aby wysyłać postępy projektów bezpośrednio z własnego kodu.',
        tone: 'slate',
      };
  }
}

export function sanitizeGithubIntegrationForPersistence(
  integration?: GitHubIntegrationState
): GitHubIntegrationState | undefined {
  if (!integration) return undefined;

  const safeStatus: GitHubSyncStatus =
    integration.status === 'synced' ||
    integration.status === 'syncing' ||
    integration.status === 'error'
      ? integration.status
      : 'disconnected';

  const safeRepos: GitHubRepoSummary[] = Array.isArray(integration.repos)
    ? integration.repos.slice(0, 30).map((r) => ({
        id: Number(r.id) || 0,
        name: String(r.name || '').slice(0, 120),
        fullName: String(r.fullName || '').slice(0, 200),
        htmlUrl: String(r.htmlUrl || '').slice(0, 512),
        description: r.description ? String(r.description).slice(0, 300) : '',
        language: r.language ? String(r.language).slice(0, 60) : '',
        defaultBranch: String(r.defaultBranch || 'main').slice(0, 100),
        isPrivate: Boolean(r.isPrivate),
        stargazersCount: Math.max(0, Number(r.stargazersCount) || 0),
        updatedAt: String(r.updatedAt || '').slice(0, 64),
      }))
    : [];

  const safeSubmissions: Record<string, GitHubProjectSubmission> = {};
  if (integration.projectSubmissions && typeof integration.projectSubmissions === 'object') {
    Object.entries(integration.projectSubmissions)
      .slice(0, 30)
      .forEach(([projId, sub]) => {
        if (!sub || typeof sub !== 'object') return;
        const key = String(projId).slice(0, 64);
        safeSubmissions[key] = {
          projectId: String(sub.projectId || key).slice(0, 64),
          repoFullName: String(sub.repoFullName || '').slice(0, 200),
          repoUrl: String(sub.repoUrl || '').slice(0, 512),
          branch: String(sub.branch || 'main').slice(0, 100),
          commitSha: String(sub.commitSha || '').slice(0, 64),
          commitMessage: String(sub.commitMessage || '').slice(0, 200),
          commitDate: String(sub.commitDate || '').slice(0, 64),
          submittedAt: String(sub.submittedAt || '').slice(0, 64),
          status: sub.status === 'verified' ? 'verified' : 'submitted',
          matchedFiles: Array.isArray(sub.matchedFiles)
            ? sub.matchedFiles.slice(0, 20).map((f) => String(f).slice(0, 200))
            : [],
          checksPassed: Math.max(0, Number(sub.checksPassed) || 0),
          checksTotal: Math.max(0, Number(sub.checksTotal) || 0),
          summary: String(sub.summary || '').slice(0, 400),
        };
      });
  }

  const sanitized: GitHubIntegrationState = {
    status: safeStatus,
    updatedAt: String(integration.updatedAt || new Date().toISOString()).slice(0, 64),
    repos: safeRepos,
    projectSubmissions: safeSubmissions,
  };

  if (integration.username) sanitized.username = String(integration.username).slice(0, 100);
  if (integration.profileUrl) sanitized.profileUrl = String(integration.profileUrl).slice(0, 512);
  if (integration.avatarUrl) sanitized.avatarUrl = String(integration.avatarUrl).slice(0, 1024);
  if (integration.lastSyncedAt) sanitized.lastSyncedAt = String(integration.lastSyncedAt).slice(0, 64);
  if (integration.lastSyncError) sanitized.lastSyncError = String(integration.lastSyncError).slice(0, 500);
  if (typeof integration.reposCount === 'number') {
    sanitized.reposCount = Math.max(0, Math.min(100000, integration.reposCount));
  }

  return sanitized;
}

function buildGithubHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  };
  const activeToken = (token || getSessionGithubToken()).trim();
  if (activeToken) {
    headers.Authorization = `Bearer ${activeToken}`;
  }
  return headers;
}

function mapGithubHttpError(status: number, usernameOrRepo: string, language: AppLanguage = 'pl'): string {
  const isEn = language === 'en';
  if (status === 401) {
    return isEn
      ? 'GitHub access token (PAT) is invalid or expired.'
      : 'Token dostępu GitHub (PAT) jest nieprawidłowy lub wygasł.';
  }
  if (status === 403 || status === 429) {
    return isEn
      ? 'GitHub API rate limit reached (60 req/h without token). Wait a moment or provide an optional Personal Access Token.'
      : 'Przekroczono limit zapytań GitHub API (60 req/h bez tokena). Odczekaj chwilę lub podaj opcjonalny Personal Access Token.';
  }
  if (status === 404) {
    return isEn
      ? `GitHub resource not found: "${usernameOrRepo}". Check the username / repository name and visibility.`
      : `Nie znaleziono zasobu GitHub: "${usernameOrRepo}". Sprawdź nazwę użytkownika / repozytorium oraz widoczność.`;
  }
  if (status === 409) {
    return isEn
      ? `Repository "${usernameOrRepo}" is empty (no commits on default branch).`
      : `Repozytorium "${usernameOrRepo}" jest puste (brak commitów na głównej gałęzi).`;
  }
  return isEn
    ? `GitHub API communication error (HTTP ${status}).`
    : `Błąd komunikacji z GitHub API (HTTP ${status}).`;
}

export async function fetchGithubUserAndRepos(
  usernameOrUrl: string,
  options?: {
    token?: string;
    previousIntegration?: GitHubIntegrationState;
    fetchFn?: typeof fetch;
    language?: AppLanguage;
  }
): Promise<GithubSyncResult> {
  const language: AppLanguage = options?.language || 'pl';
  const isEn = language === 'en';
  const username = parseGithubUsername(usernameOrUrl);
  const nowIso = new Date().toISOString();

  if (!username) {
    const errorMsg = isEn
      ? 'Enter a valid GitHub username or profile URL (e.g. octocat or https://github.com/octocat).'
      : 'Podaj poprawną nazwę użytkownika GitHub lub adres profilu (np. octocat lub https://github.com/octocat).';
    return {
      ok: false,
      error: errorMsg,
      integration: {
        ...(options?.previousIntegration || { updatedAt: nowIso }),
        status: 'error',
        lastSyncError: errorMsg,
        updatedAt: nowIso,
      },
    };
  }

  const doFetch = options?.fetchFn || fetch;
  const headers = buildGithubHeaders(options?.token);

  try {
    const userRes = await doFetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`, { headers });
    if (!userRes.ok) {
      const errText = mapGithubHttpError(userRes.status, username, language);
      return {
        ok: false,
        error: errText,
        integration: {
          ...(options?.previousIntegration || { updatedAt: nowIso }),
          status: 'error',
          username: options?.previousIntegration?.username,
          lastSyncError: errText,
          updatedAt: nowIso,
        },
      };
    }

    const userData = (await userRes.json()) as {
      login: string;
      html_url: string;
      avatar_url?: string;
      public_repos?: number;
    };

    const reposRes = await doFetch(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(userData.login)}/repos?sort=updated&per_page=30&type=owner`,
      { headers }
    );
    if (!reposRes.ok) {
      const errText = mapGithubHttpError(reposRes.status, `${userData.login}/repos`, language);
      return {
        ok: false,
        error: errText,
        integration: {
          ...(options?.previousIntegration || { updatedAt: nowIso }),
          status: 'error',
          username: userData.login,
          profileUrl: userData.html_url,
          avatarUrl: userData.avatar_url,
          lastSyncError: errText,
          updatedAt: nowIso,
        },
      };
    }

    const rawRepos = (await reposRes.json()) as Array<{
      id: number;
      name: string;
      full_name: string;
      html_url: string;
      description?: string | null;
      language?: string | null;
      default_branch?: string;
      private?: boolean;
      stargazers_count?: number;
      updated_at?: string;
    }>;

    const repos: GitHubRepoSummary[] = (Array.isArray(rawRepos) ? rawRepos : [])
      .slice(0, 30)
      .map((r) => ({
        id: r.id,
        name: r.name,
        fullName: r.full_name,
        htmlUrl: r.html_url,
        description: r.description || '',
        language: r.language || '',
        defaultBranch: r.default_branch || 'main',
        isPrivate: Boolean(r.private),
        stargazersCount: Number(r.stargazers_count) || 0,
        updatedAt: r.updated_at || nowIso,
      }));

    const syncedIntegration: GitHubIntegrationState = {
      status: 'synced',
      username: userData.login,
      profileUrl: userData.html_url,
      avatarUrl: userData.avatar_url || options?.previousIntegration?.avatarUrl,
      lastSyncedAt: nowIso,
      reposCount: typeof userData.public_repos === 'number' ? Math.max(userData.public_repos, repos.length) : repos.length,
      repos,
      projectSubmissions: options?.previousIntegration?.projectSubmissions || {},
      updatedAt: nowIso,
    };

    return {
      ok: true,
      integration: sanitizeGithubIntegrationForPersistence(syncedIntegration)!,
    };
  } catch (err) {
    const msg =
      err instanceof Error && err.message
        ? isEn
          ? `Network error while syncing with GitHub: ${err.message}`
          : `Błąd sieci podczas synchronizacji z GitHub: ${err.message}`
        : isEn
        ? 'Failed to connect to GitHub API. Check your internet connection.'
        : 'Błąd połączenia z GitHub API. Sprawdź dostęp do internetu.';
    return {
      ok: false,
      error: msg,
      integration: {
        ...(options?.previousIntegration || { updatedAt: nowIso }),
        status: 'error',
        username: options?.previousIntegration?.username,
        lastSyncError: msg,
        updatedAt: nowIso,
      },
    };
  }
}

function decodeGithubBase64Utf8(base64Content: string): string {
  const cleaned = (base64Content || '').replace(/\s+/g, '');
  if (!cleaned) return '';
  try {
    if (typeof atob === 'function') {
      const binary = atob(cleaned);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      if (typeof TextDecoder !== 'undefined') {
        return new TextDecoder('utf-8').decode(bytes);
      }
      return binary;
    }
    return Buffer.from(cleaned, 'base64').toString('utf-8');
  } catch {
    return '';
  }
}

function normalizeStructureTokens(project: Project): string[] {
  const fromStructure = (project.fileStructure || [])
    .map((line) => line.replace(/[│├└─\s#].*$/g, '').trim())
    .map((line) => line.replace(/^[│├└─\s]+/, '').split(/\s+/)[0] || '')
    .filter((token) => token.includes('.'));
  const fromSource = (project.sourceFiles || []).map((f) => f.path.toLowerCase());
  return Array.from(new Set([...fromStructure.map((t) => t.toLowerCase()), ...fromSource]));
}

export async function submitProjectFromGithubRepo(
  project: Project,
  repoIdentifier: string,
  options?: {
    token?: string;
    fetchFn?: typeof fetch;
    language?: AppLanguage;
  }
): Promise<GithubProjectSubmitResult> {
  const language: AppLanguage = options?.language || 'pl';
  const isEn = language === 'en';
  const parsedRepo = parseGithubRepoIdentifier(repoIdentifier);
  if (!parsedRepo) {
    return {
      ok: false,
      error: isEn
        ? 'Enter a valid GitHub repository address (e.g. account/my-project or https://github.com/account/my-project).'
        : 'Podaj poprawny adres repozytorium GitHub (np. nazwa-konta/moj-projekt lub https://github.com/nazwa-konta/moj-projekt).',
    };
  }

  const doFetch = options?.fetchFn || fetch;
  const headers = buildGithubHeaders(options?.token);

  try {
    const repoRes = await doFetch(
      `${GITHUB_API_BASE}/repos/${encodeURIComponent(parsedRepo.owner)}/${encodeURIComponent(parsedRepo.repo)}`,
      { headers }
    );
    if (!repoRes.ok) {
      return { ok: false, error: mapGithubHttpError(repoRes.status, parsedRepo.fullName, language) };
    }

    const repoData = (await repoRes.json()) as {
      full_name: string;
      html_url: string;
      default_branch?: string;
    };
    const defaultBranch = repoData.default_branch || 'main';

    const commitsRes = await doFetch(
      `${GITHUB_API_BASE}/repos/${encodeURIComponent(parsedRepo.owner)}/${encodeURIComponent(parsedRepo.repo)}/commits?sha=${encodeURIComponent(defaultBranch)}&per_page=1`,
      { headers }
    );
    if (!commitsRes.ok) {
      return { ok: false, error: mapGithubHttpError(commitsRes.status, repoData.full_name, language) };
    }

    const commitsData = (await commitsRes.json()) as Array<{
      sha: string;
      commit?: {
        message?: string;
        author?: { date?: string };
      };
    }>;
    const latestCommit = Array.isArray(commitsData) ? commitsData[0] : undefined;
    if (!latestCommit?.sha) {
      return {
        ok: false,
        error: isEn
          ? `Repository "${repoData.full_name}" has no commits yet on branch "${defaultBranch}".`
          : `Repozytorium "${repoData.full_name}" nie posiada jeszcze żadnego commita na gałęzi "${defaultBranch}".`,
      };
    }

    const treeRes = await doFetch(
      `${GITHUB_API_BASE}/repos/${encodeURIComponent(parsedRepo.owner)}/${encodeURIComponent(parsedRepo.repo)}/git/trees/${encodeURIComponent(defaultBranch)}?recursive=1`,
      { headers }
    );

    let allRepoFiles: string[] = [];
    if (treeRes.ok) {
      const treeData = (await treeRes.json()) as {
        tree?: Array<{ path: string; type: string }>;
      };
      allRepoFiles = (treeData.tree || [])
        .filter(
          (item) =>
            item.type === 'blob' &&
            !item.path.startsWith('node_modules/') &&
            !item.path.startsWith('.git/') &&
            !item.path.startsWith('dist/')
        )
        .map((item) => item.path);
    }

    if (allRepoFiles.length === 0) {
      return {
        ok: false,
        error: isEn
          ? `No source files detected in repository "${repoData.full_name}" on branch "${defaultBranch}".`
          : `Nie wykryto plików źródłowych w repozytorium "${repoData.full_name}" na gałęzi "${defaultBranch}".`,
      };
    }

    // Match expected project structure files or key source files
    const expectedTokens = normalizeStructureTokens(project);
    const matchedFiles = allRepoFiles
      .filter((path) => {
        const lower = path.toLowerCase();
        const fileName = lower.split('/').pop() || lower;
        if (expectedTokens.some((tok) => lower === tok || lower.endsWith(`/${tok}`) || fileName === tok.split('/').pop())) {
          return true;
        }
        return /\.(html|css|js|jsx|ts|tsx|sql|prisma|yml|yaml|json)$/i.test(lower) || /dockerfile$/i.test(lower);
      })
      .slice(0, 15);

    // Pick up to 6 priority source files to inspect code requirements
    const htmlCandidates = allRepoFiles.filter((p) => /\.html?$/i.test(p)).slice(0, 2);
    const cssCandidates = allRepoFiles.filter((p) => /\.(css|scss)$/i.test(p)).slice(0, 2);
    const jsCandidates = allRepoFiles
      .filter((p) => /\.(js|jsx|ts|tsx)$/i.test(p) && !p.endsWith('.d.ts'))
      .slice(0, 3);
    const configCandidates = allRepoFiles
      .filter((p) => /(^|\/)(package\.json|dockerfile|docker-compose\.ya?ml|prisma\/schema\.prisma)$/i.test(p))
      .slice(0, 2);

    const filesToFetch = Array.from(
      new Set([...htmlCandidates, ...cssCandidates, ...jsCandidates, ...configCandidates])
    ).slice(0, 6);

    const htmlParts: string[] = [];
    const cssParts: string[] = [];
    const jsParts: string[] = [];

    for (const filePath of filesToFetch) {
      const encodedPath = filePath.split('/').map(encodeURIComponent).join('/');
      const contentRes = await doFetch(
        `${GITHUB_API_BASE}/repos/${encodeURIComponent(parsedRepo.owner)}/${encodeURIComponent(parsedRepo.repo)}/contents/${encodedPath}?ref=${encodeURIComponent(defaultBranch)}`,
        { headers }
      );
      if (!contentRes.ok) continue;
      const contentJson = (await contentRes.json()) as { content?: string; encoding?: string };
      if (!contentJson.content) continue;
      const decoded =
        contentJson.encoding === 'base64'
          ? decodeGithubBase64Utf8(contentJson.content)
          : contentJson.content;
      if (!decoded) continue;

      if (/\.html?$/i.test(filePath)) {
        htmlParts.push(decoded);
      } else if (/\.(css|scss)$/i.test(filePath)) {
        cssParts.push(decoded);
      } else {
        jsParts.push(`// File: ${filePath}\n${decoded}`);
      }
    }

    const extractedCode = {
      html: htmlParts.join('\n').slice(0, 80000),
      css: cssParts.join('\n').slice(0, 40000),
      js: jsParts.join('\n').slice(0, 80000),
    };

    const projectExercise = getProjectInteractiveExercise(project, language);
    const validationSummary = validateExerciseCode(projectExercise, extractedCode, language);

    const nowIso = new Date().toISOString();
    const shortSha = latestCommit.sha.slice(0, 7);
    const commitMsg = (latestCommit.commit?.message || (isEn ? 'Repository commit' : 'Commit w repozytorium'))
      .split('\n')[0]
      .slice(0, 160);
    const commitDate = latestCommit.commit?.author?.date || nowIso;

    const status: GitHubProjectSubmission['status'] = validationSummary.allPassed ? 'verified' : 'submitted';
    const summary = validationSummary.allPassed
      ? isEn
        ? `GitHub codebase (${repoData.full_name} @ ${shortSha}) passed 100% of automated project tests (${validationSummary.passedCount}/${validationSummary.totalCount}).`
        : `Kod z GitHub (${repoData.full_name} @ ${shortSha}) przeszedł 100% automatycznych testów projektu (${validationSummary.passedCount}/${validationSummary.totalCount}).`
      : isEn
      ? `Submitted GitHub codebase (${repoData.full_name} @ ${shortSha}). Detected ${allRepoFiles.length} files (${validationSummary.passedCount}/${validationSummary.totalCount} code rules matched).`
      : `Przesłano codebase z GitHub (${repoData.full_name} @ ${shortSha}). Wykryto ${allRepoFiles.length} plików (${validationSummary.passedCount}/${validationSummary.totalCount} reguł kodu zsynchronizowanych).`;

    const submission: GitHubProjectSubmission = {
      projectId: project.id,
      repoFullName: repoData.full_name,
      repoUrl: repoData.html_url,
      branch: defaultBranch,
      commitSha: latestCommit.sha,
      commitMessage: commitMsg,
      commitDate,
      submittedAt: nowIso,
      status,
      matchedFiles: matchedFiles.length > 0 ? matchedFiles : allRepoFiles.slice(0, 8),
      checksPassed: validationSummary.passedCount,
      checksTotal: validationSummary.totalCount,
      summary,
    };

    return {
      ok: true,
      submission,
      extractedCode,
      validationSummary,
    };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error && err.message
          ? isEn
            ? `Error while fetching project code from GitHub: ${err.message}`
            : `Błąd podczas pobierania kodu projektu z GitHub: ${err.message}`
          : isEn
          ? 'Failed to fetch repository from GitHub.'
          : 'Nie udało się pobrać repozytorium z GitHub.',
    };
  }
}
