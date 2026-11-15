import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  formatGithubSyncTimestamp,
  formatRelativeSyncTime,
  getGithubSyncStatusPresentation,
  getSessionGithubToken,
} from '../utils/githubService';
import {
  Github,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Unlink,
  Link2,
  Clock,
  FolderGit2,
  ExternalLink,
  KeyRound,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface GithubSyncCardProps {
  compact?: boolean;
}

export const GithubSyncCard: React.FC<GithubSyncCardProps> = ({ compact = false }) => {
  const {
    currentUser,
    isAuthenticated,
    isSyncingGithub,
    linkGithubAccount,
    refreshGithubSync,
    unlinkGithubAccount,
    setActiveTab,
  } = useApp();

  const gh = currentUser.githubIntegration;
  const presentation = getGithubSyncStatusPresentation(gh);
  const [usernameInput, setUsernameInput] = useState(gh?.username || '');
  const [tokenInput, setTokenInput] = useState(() => getSessionGithubToken());
  const [showTokenField, setShowTokenField] = useState(false);
  const [showAccountEditor, setShowAccountEditor] = useState(!gh?.username);
  const [localError, setLocalError] = useState('');

  const isConnected = Boolean(gh?.username && gh.status !== 'disconnected');
  const submissionsCount = Object.keys(gh?.projectSubmissions || {}).length;
  const reposPreview = (gh?.repos || []).slice(0, compact ? 2 : 4);

  const toneClasses = {
    emerald: {
      badge: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
      dot: 'bg-emerald-400',
      border: 'border-emerald-500/30',
    },
    indigo: {
      badge: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300',
      dot: 'bg-indigo-400 animate-pulse',
      border: 'border-indigo-500/30',
    },
    rose: {
      badge: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
      dot: 'bg-rose-400',
      border: 'border-rose-500/30',
    },
    slate: {
      badge: 'bg-slate-800 border-slate-700 text-slate-300',
      dot: 'bg-slate-500',
      border: 'border-slate-800',
    },
  }[presentation.tone];

  const handleConnect = async () => {
    setLocalError('');
    if (!usernameInput.trim()) {
      setLocalError('Podaj nazwę użytkownika GitHub lub link do profilu.');
      return;
    }
    const res = await linkGithubAccount(usernameInput.trim(), tokenInput);
    if (res.ok) {
      setShowAccountEditor(false);
    } else if (res.error) {
      setLocalError(res.error);
    }
  };

  const handleRefresh = async () => {
    setLocalError('');
    const res = await refreshGithubSync(tokenInput || undefined);
    if (!res.ok && res.error) {
      setLocalError(res.error);
    }
  };

  const handleUnlink = () => {
    setLocalError('');
    unlinkGithubAccount();
    setUsernameInput('');
    setTokenInput('');
    setShowAccountEditor(true);
  };

  return (
    <div
      data-testid="github-sync-card"
      className={`rounded-2xl border ${toneClasses.border} bg-slate-950/75 p-4 space-y-3.5`}
    >
      {/* Header + Visual Sync Status Indicator */}
      <div className="flex flex-wrap items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 flex-1 min-w-[210px]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 text-white shrink-0">
            <Github className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
              Synchronizacja Konta GitHub
            </h3>
            <p className="text-[11px] text-slate-400 truncate">
              Bezpośrednie przesyłanie postępów projektów z własnych repozytoriów
            </p>
          </div>
        </div>

        {/* Visual Sync Status Badge */}
        <div
          data-testid="github-sync-status"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold shrink-0 ${toneClasses.badge}`}
        >
          <span className={`h-2 w-2 rounded-full ${toneClasses.dot}`} aria-hidden="true" />
          {presentation.status === 'synced' && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
          {presentation.status === 'syncing' && <RefreshCw className="h-3.5 w-3.5 animate-spin shrink-0" />}
          {presentation.status === 'error' && <AlertTriangle className="h-3.5 w-3.5 shrink-0" />}
          <span>{presentation.label}</span>
        </div>
      </div>

      {/* Connected Account Summary & Last Sync Time */}
      {isConnected && gh ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {gh.avatarUrl ? (
                <img
                  src={gh.avatarUrl}
                  alt={`Awatar GitHub ${gh.username}`}
                  className="h-9 w-9 rounded-lg object-cover border border-slate-700 shrink-0"
                />
              ) : (
                <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                  <Github className="h-4 w-4" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <a
                    href={gh.profileUrl || `https://github.com/${gh.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-white hover:text-indigo-300 inline-flex items-center gap-1 truncate"
                  >
                    <span>@{gh.username}</span>
                    <ExternalLink className="h-3 w-3 text-slate-400 shrink-0" />
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-400 mt-0.5">
                  <span className="inline-flex items-center gap-1">
                    <FolderGit2 className="h-3 w-3 text-cyan-400" />
                    <span>{gh.reposCount ?? gh.repos?.length ?? 0} repozytoriów</span>
                  </span>
                  <span className="hidden sm:inline" aria-hidden="true">•</span>
                  <span>Przesłanych projektów: {submissionsCount}/12</span>
                </div>
              </div>
            </div>

            {/* Re-Sync & Unlink Actions */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => void handleRefresh()}
                disabled={isSyncingGithub}
                aria-label="Odśwież połączenie GitHub"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-[11px] font-bold transition-colors cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncingGithub ? 'animate-spin' : ''}`} />
                <span>{isSyncingGithub ? 'Synchronizacja...' : 'Odśwież połączenie'}</span>
              </button>
              <button
                type="button"
                onClick={handleUnlink}
                disabled={isSyncingGithub}
                aria-label="Rozłącz konto GitHub"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <Unlink className="h-3.5 w-3.5" />
                <span>Rozłącz</span>
              </button>
            </div>
          </div>

          {/* Last Successful Sync Timestamp Row */}
          <div
            data-testid="github-last-synced"
            className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px]"
          >
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-slate-300">
              <Clock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-400">Ostatnia udana synchronizacja:</span>
              <strong className="text-white font-mono">
                {formatGithubSyncTimestamp(gh.lastSyncedAt)}
              </strong>
              {gh.lastSyncedAt && (
                <span className="text-emerald-400 font-medium">
                  ({formatRelativeSyncTime(gh.lastSyncedAt)})
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowAccountEditor((prev) => !prev)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
            >
              <span>{showAccountEditor ? 'Ukryj konfigurację' : 'Zmień konto / Token'}</span>
              {showAccountEditor ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>

          {/* Synced Repositories Preview */}
          {reposPreview.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>Ostatnio zsynchronizowane repozytoria</span>
                {compact && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('projects')}
                    className="text-cyan-400 hover:text-cyan-300 normal-case font-semibold"
                  >
                    Prześlij kod projektu →
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {reposPreview.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950/70 hover:border-indigo-500/40 px-2.5 py-1.5 text-[11px] transition-colors"
                  >
                    <span className="font-mono text-slate-200 truncate">{repo.name}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {repo.language || repo.defaultBranch}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-300 leading-relaxed">
          {presentation.description}
        </p>
      )}

      {/* Sync Error Banner */}
      {(localError || (gh?.status === 'error' && gh.lastSyncError)) && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-2.5 text-xs text-rose-200 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{localError || gh?.lastSyncError}</span>
        </div>
      )}

      {/* Connect / Configure GitHub Username Form Controls */}
      {showAccountEditor && (
        <div className="space-y-2.5 pt-1">
          {!isAuthenticated && (
            <p className="text-[11px] text-amber-300 bg-amber-950/30 border border-amber-500/30 rounded-lg px-2.5 py-1.5">
              Zaloguj się na konto w Akademii, aby trwale powiązać repozytoria GitHub ze swoim profilem.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 space-y-1">
              <label htmlFor="github-username-input" className="text-[11px] font-semibold text-slate-300 block">
                Nazwa użytkownika GitHub lub link do profilu:
              </label>
              <input
                id="github-username-input"
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void handleConnect();
                  }
                }}
                placeholder="np. octocat lub https://github.com/nazwa"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="sm:self-end">
              <button
                type="button"
                onClick={() => void handleConnect()}
                disabled={isSyncingGithub || !isAuthenticated}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer"
              >
                {isSyncingGithub ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Link2 className="h-3.5 w-3.5" />
                )}
                <span>{isConnected ? 'Zapisz i odśwież' : 'Połącz GitHub'}</span>
              </button>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowTokenField((prev) => !prev)}
              className="text-[11px] text-slate-400 hover:text-slate-200 inline-flex items-center gap-1 font-medium"
            >
              <KeyRound className="h-3 w-3 text-amber-400" />
              <span>
                {showTokenField
                  ? 'Ukryj opcjonalny Personal Access Token (PAT)'
                  : 'Opcjonalnie: dodaj GitHub Token (dla prywatnych repo lub wyższych limitów API)'}
              </span>
            </button>

            {showTokenField && (
              <div className="mt-2 space-y-1">
                <input
                  id="github-pat-input"
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="github_pat_... lub ghp_... (przechowywane wyłącznie w sesji przeglądarki)"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <p className="text-[10px] text-slate-400">
                  Token nigdy nie jest zapisywany w bazie Cloud Firestore ani eksportowany w kopiach zapasowych.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
