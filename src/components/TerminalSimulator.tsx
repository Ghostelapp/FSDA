import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { soundManager } from '../utils/audioFx';
import { 
  Terminal as TerminalIcon, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  FolderTree,
  ShieldCheck,
  ChevronRight,
  Code
} from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  text: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  expectedCommandRegex: RegExp;
  xpReward: number;
  completed: boolean;
  hint: string;
}

interface VirtualFile {
  name: string;
  type: 'file' | 'dir';
  content?: string;
  children?: Record<string, VirtualFile>;
}

export const TerminalSimulator: React.FC = () => {
  const { currentUser, awardCustomXp } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [currentPath, setCurrentPath] = useState<string>('~/app');
  const [gitBranch, setGitBranch] = useState<string>('main');
  const [isGitInitialized, setIsGitInitialized] = useState<boolean>(false);
  const [gitStaged, setGitStaged] = useState<string[]>([]);
  const [gitCommits, setGitCommits] = useState<{ hash: string; msg: string; date: string }[]>([]);

  // Missions State
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 'm-1',
      title: 'Inicjalizacja repozytorium Git',
      description: 'Zainicjalizuj lokalne repozytorium kontroli wersji poleceniem git init.',
      expectedCommandRegex: /^git\s+init(\s+.*)?$/i,
      xpReward: 40,
      completed: false,
      hint: 'Wpisz: git init',
    },
    {
      id: 'm-2',
      title: 'Dodanie plików do poczekalni (Staging)',
      description: 'Dodaj wszystkie pliki projektu do poczekalni poleceniem git add .',
      expectedCommandRegex: /^git\s+add\s+(\.|\*|-A)$/i,
      xpReward: 40,
      completed: false,
      hint: 'Wpisz: git add .',
    },
    {
      id: 'm-3',
      title: 'Utworzenie pierwszego commita',
      description: 'Zapisz migawkę zmian z czytelnym komunikatem za pomocą git commit -m "feat: init"',
      expectedCommandRegex: /^git\s+commit\s+-m\s+["'].*["']$/i,
      xpReward: 50,
      completed: false,
      hint: 'Wpisz: git commit -m "feat: initial commit"',
    },
    {
      id: 'm-4',
      title: 'Nowa gałąź developerska',
      description: 'Utwórz i przełącz się na nową gałąź feature/auth.',
      expectedCommandRegex: /^git\s+(checkout\s+-b|switch\s+-c)\s+feature\/auth$/i,
      xpReward: 50,
      completed: false,
      hint: 'Wpisz: git checkout -b feature/auth',
    },
    {
      id: 'm-5',
      title: 'Uruchomienie testów automatycznych',
      description: 'Uruchom zestaw testów jednostkowych za pomocą npm test.',
      expectedCommandRegex: /^npm\s+(test|run\s+test)$/i,
      xpReward: 60,
      completed: false,
      hint: 'Wpisz: npm test',
    },
  ]);

  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', type: 'system', text: 'Full Stack Academy Cloud Terminal v2.5 (Linux x86_64 Ubuntu 24.04 LTS)' },
    { id: '2', type: 'system', text: 'Wpisz "help" aby wyświetlić listę dostępnych komend lub wykonaj misje po prawej.' },
    { id: '3', type: 'output', text: 'Projekt załadowany w katalogu ~/app (Node.js v22.14, TypeScript v5.5, Git v2.43)' },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    // Add to history
    setHistory((prev) => [...prev, cmd]);
    setHistoryIdx(-1);

    // Echo input
    const inputLine: TerminalLine = {
      id: `in-${Date.now()}`,
      type: 'input',
      text: `${currentUser.email.split('@')[0]}@academy:${currentPath}${isGitInitialized ? ` (${gitBranch})` : ''}$ ${cmd}`,
    };

    const newOutputs: TerminalLine[] = [inputLine];

    // Check Missions
    const matchedMissionIds: string[] = [];
    missions.forEach((m) => {
      if (!m.completed && m.expectedCommandRegex.test(cmd)) {
        matchedMissionIds.push(m.id);
        soundManager.playSuccess();
        awardCustomXp(m.xpReward, `Misja terminalowa: ${m.title}`);
        newOutputs.push({
          id: `succ-${Date.now()}-${m.id}`,
          type: 'success',
          text: `MISJA ZALICZONA: "${m.title}"! Zdobywasz +${m.xpReward} XP.`,
        });
      }
    });
    if (matchedMissionIds.length > 0) {
      setMissions((prev) =>
        prev.map((m) => (matchedMissionIds.includes(m.id) ? { ...m, completed: true } : m))
      );
    }

    // Process Command Logic
    const parts = cmd.split(' ').filter(Boolean);
    const mainCmd = parts[0]?.toLowerCase();
    const arg1 = parts[1];
    const arg2 = parts[2];

    switch (mainCmd) {
      case 'clear':
      case 'cls':
        setLines([]);
        setInputVal('');
        return;

      case 'help':
        newOutputs.push({
          id: `out-${Date.now()}-h`,
          type: 'output',
          text: `Dostępne polecenia:
  git <init|status|add|commit|branch|checkout|log|push>  - Narzędzie kontroli wersji Git
  npm <run dev|test|build|install>                       - Menedżer pakietów Node.js
  docker <ps|images|compose up>                          - Zarządzanie kontenerami
  ls [-la]                                               - Wyświetl zawartość katalogu
  cat <plik>                                             - Pokaż treść pliku (np. cat package.json)
  pwd                                                    - Wyświetl bieżącą ścieżkę
  cd <katalog>                                           - Zmień katalog roboczy
  curl <url>                                             - Wyślij zapytanie HTTP
  whoami                                                 - Pokaż dane aktywnego użytkownika
  date                                                   - Aktualny czas serwera
  clear                                                  - Wyczyść ekran terminala`,
        });
        break;

      case 'pwd':
        newOutputs.push({ id: `out-${Date.now()}`, type: 'output', text: `/home/student/app` });
        break;

      case 'whoami':
        newOutputs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `${currentUser.name} <${currentUser.email}> (Rola: ${currentUser.role}, XP: ${currentUser.xp})`,
        });
        break;

      case 'date':
        newOutputs.push({ id: `out-${Date.now()}`, type: 'output', text: new Date().toUTCString() });
        break;

      case 'ls':
        if (parts.includes('-la') || parts.includes('-a')) {
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'output',
            text: `drwxr-xr-x 8 student student 4096 Oct 22 12:00 .
drwxr-xr-x 3 student student 4096 Oct 22 11:30 ..
${isGitInitialized ? 'drwxr-xr-x 8 student student 4096 Oct 22 12:00 .git\n' : ''}-rw-r--r-- 1 student student  342 Oct 22 11:45 .gitignore
drwxr-xr-x 4 student student 4096 Oct 22 11:50 src
drwxr-xr-x 2 student student 4096 Oct 22 11:50 public
-rw-r--r-- 1 student student 1420 Oct 22 11:55 package.json
-rw-r--r-- 1 student student 2800 Oct 22 11:50 README.md
-rw-r--r-- 1 student student  580 Oct 22 11:40 tsconfig.json
-rw-r--r-- 1 student student  490 Oct 22 11:40 vite.config.ts`,
          });
        } else {
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'output',
            text: `src/   public/   package.json   README.md   tsconfig.json   vite.config.ts`,
          });
        }
        break;

      case 'cat':
        if (!arg1) {
          newOutputs.push({ id: `err-${Date.now()}`, type: 'error', text: 'Użycie: cat <nazwa_pliku>' });
        } else if (arg1 === 'package.json') {
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'output',
            text: `{
  "name": "fullstack-academy-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "node --test --import tsx src/utils/*.test.ts"
  },
  "dependencies": {
    "react": "^18.3.1",
    "express": "^4.19.2",
    "@prisma/client": "^5.18.0"
  }
}`,
          });
        } else if (arg1 === 'README.md') {
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'output',
            text: `# 🎓 Full Stack Academy Project
Projekt edukacyjny łączący React, Node.js i PostgreSQL.
Wszystkie testy jednostkowe: npm test
Uruchomienie serwera: npm run dev`,
          });
        } else if (arg1 === '.gitignore') {
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'output',
            text: `node_modules/\ndist/\n.env\n.DS_Store`,
          });
        } else {
          newOutputs.push({ id: `err-${Date.now()}`, type: 'error', text: `cat: ${arg1}: Nie znaleziono takiego pliku.` });
        }
        break;

      case 'cd':
        if (!arg1 || arg1 === '~' || arg1 === '~/app') {
          setCurrentPath('~/app');
        } else if (arg1 === 'src') {
          setCurrentPath('~/app/src');
        } else if (arg1 === '..') {
          setCurrentPath('~');
        } else {
          newOutputs.push({ id: `err-${Date.now()}`, type: 'error', text: `cd: brak katalogu: ${arg1}` });
        }
        break;

      // GIT COMMANDS
      case 'git':
        if (!arg1 || arg1 === '--help') {
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'output',
            text: 'Dostępne podkomendy git: init, status, add, commit, branch, checkout, switch, log, push, diff',
          });
        } else if (arg1 === 'init') {
          setIsGitInitialized(true);
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'success',
            text: 'Zainicjalizowano puste repozytorium Git w /home/student/app/.git/',
          });
        } else if (!isGitInitialized) {
          newOutputs.push({
            id: `err-${Date.now()}`,
            type: 'error',
            text: 'fatal: not a git repository (or any of the parent directories): .git\nWpisz najpierw: git init',
          });
        } else if (arg1 === 'status') {
          if (gitStaged.length === 0 && gitCommits.length === 0) {
            newOutputs.push({
              id: `out-${Date.now()}`,
              type: 'output',
              text: `Na gałęzi ${gitBranch}
Brak commitów.

Nieśledzone pliki (użyj "git add <plik>..." aby uwzględnić w commicie):
	README.md
	package.json
	src/
	tsconfig.json
	vite.config.ts

Brak dodanych zmian do commita (użyj "git add").`,
            });
          } else if (gitStaged.length > 0) {
            newOutputs.push({
              id: `out-${Date.now()}`,
              type: 'output',
              text: `Na gałęzi ${gitBranch}
Zmiany gotowe do zatwierdzenia (Staged for commit):
	nowy plik:   README.md
	nowy plik:   package.json
	nowy plik:   src/App.tsx
	nowy plik:   tsconfig.json`,
            });
          } else {
            newOutputs.push({
              id: `out-${Date.now()}`,
              type: 'output',
              text: `Na gałęzi ${gitBranch}\nDrzewo robocze czyste (working tree clean), brak zmian.`,
            });
          }
        } else if (arg1 === 'add') {
          setGitStaged(['README.md', 'package.json', 'src/App.tsx', 'tsconfig.json']);
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'output',
            text: 'Pliki dodane do poczekalni (Staging Area). Gotowe do wykonania git commit.',
          });
        } else if (arg1 === 'commit') {
          if (gitStaged.length === 0 && gitCommits.length > 0) {
            newOutputs.push({ id: `out-${Date.now()}`, type: 'output', text: 'Brak zmian dodanych do poczekalni (użyj git add).' });
          } else {
            const rawMsg = cmd.match(/["'](.*?)["']/)?.[1] || 'feat: initial commit';
            const hash = Math.random().toString(16).substring(2, 9);
            const newCommit = { hash, msg: rawMsg, date: new Date().toLocaleTimeString() };
            setGitCommits((prev) => [newCommit, ...prev]);
            setGitStaged([]);
            newOutputs.push({
              id: `out-${Date.now()}`,
              type: 'success',
              text: `[${gitBranch} ${hash}] ${rawMsg}\n 4 files changed, 280 insertions(+)`,
            });
          }
        } else if (arg1 === 'branch') {
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'output',
            text: `* ${gitBranch}\n  develop\n  feature/auth`,
          });
        } else if (arg1 === 'checkout' || arg1 === 'switch') {
          const target = arg2 === '-b' || arg2 === '-c' ? parts[3] : arg2;
          if (!target) {
            newOutputs.push({ id: `err-${Date.now()}`, type: 'error', text: 'Użycie: git checkout -b <nazwa_gałęzi>' });
          } else {
            setGitBranch(target);
            newOutputs.push({
              id: `out-${Date.now()}`,
              type: 'success',
              text: `Przełączono na nową gałąź '${target}'`,
            });
          }
        } else if (arg1 === 'log') {
          if (gitCommits.length === 0) {
            newOutputs.push({ id: `out-${Date.now()}`, type: 'output', text: 'Brak wykonanych commitów w repozytorium.' });
          } else {
            const logs = gitCommits
              .map(
                (c) => `commit ${c.hash}7a38b29f (HEAD -> ${gitBranch})
Autor: ${currentUser.name} <${currentUser.email}>
Data:  ${c.date}

    ${c.msg}
`
              )
              .join('\n');
            newOutputs.push({ id: `out-${Date.now()}`, type: 'output', text: logs });
          }
        } else if (arg1 === 'push') {
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'output',
            text: `Enumerating objects: 12, done.
Counting objects: 100% (12/12), done.
Writing objects: 100% (12/12), 3.24 KiB | 3.24 MiB/s, done.
To github.com:fullstack-academy/app.git
 * [new branch]      ${gitBranch} -> ${gitBranch}`,
          });
        }
        break;

      // NPM COMMANDS
      case 'npm':
        if (arg1 === 'test') {
          soundManager.playSuccess();
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'success',
            text: `TAP version 13
# Subtest: calculateLevel properly assigns starting tier
ok 1 - calculateLevel properly assigns starting tier
# Subtest: deductLife deducts 1 life on free tier
ok 2 - deductLife deducts 1 life on free tier
# Subtest: verifyAntiBotSubmission rejects bot
ok 3 - verifyAntiBotSubmission rejects bot
# Subtest: filterAndSortUsers filters by role
ok 4 - filterAndSortUsers filters by role
1..4
# tests 4 | suites 0 | pass 4 | fail 0 | duration_ms 42.1ms
✓ Wszystkie testy zaliczone pomyślnie!`,
          });
        } else if (arg1 === 'run' && arg2 === 'dev') {
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'success',
            text: `  VITE v5.4.2  ready in 184 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help`,
          });
        } else if (arg1 === 'run' && arg2 === 'build') {
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'output',
            text: `vite v5.4.2 building for production...
✓ 48 modules transformed.
dist/index.html                   1.34 kB │ gzip:  0.62 kB
dist/assets/index-D7pX8s2.css     14.20 kB │ gzip:  3.84 kB
dist/assets/index-Bq829Lm.js     182.40 kB │ gzip: 54.12 kB
✓ built in 420ms`,
          });
        } else if (arg1 === 'install' || arg1 === 'i') {
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'output',
            text: `added 14 packages, and audited 320 packages in 1s
found 0 vulnerabilities`,
          });
        } else {
          newOutputs.push({ id: `out-${Date.now()}`, type: 'output', text: `npm v10.8.2\nUżyj: npm test, npm run dev, npm run build` });
        }
        break;

      // DOCKER COMMANDS
      case 'docker':
        if (arg1 === 'ps') {
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'output',
            text: `CONTAINER ID   IMAGE                 COMMAND                  CREATED         STATUS         PORTS                    NAMES
8f92a1c0d4e3   postgres:16-alpine    "docker-entrypoint.s…"   2 hours ago     Up 2 hours     0.0.0.0:5432->5432/tcp   fsda-postgres
b4129e847c21   node:22-alpine        "docker-entrypoint.s…"   2 hours ago     Up 2 hours     0.0.0.0:3000->3000/tcp   fsda-webapp`,
          });
        } else if (arg1 === 'images') {
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'output',
            text: `REPOSITORY   TAG         IMAGE ID       CREATED        SIZE
postgres     16-alpine   74839201bcde   2 weeks ago    412MB
node         22-alpine   839201abc123   3 weeks ago    188MB`,
          });
        } else {
          newOutputs.push({ id: `out-${Date.now()}`, type: 'output', text: `Docker Engine v26.1.4\nUżyj: docker ps, docker images` });
        }
        break;

      case 'curl':
        if (!arg1) {
          newOutputs.push({ id: `err-${Date.now()}`, type: 'error', text: 'Użycie: curl http://localhost:3000/api/health' });
        } else {
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'output',
            text: `HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 48

{"status":"ok","database":"connected","uptime":7420}`,
          });
        }
        break;

      default:
        newOutputs.push({
          id: `err-${Date.now()}`,
          type: 'error',
          text: `bash: ${mainCmd}: nie znaleziono polecenia. Wpisz "help" aby zobaczyć dostępne komendy.`,
        });
        break;
    }

    setLines((prev) => [...prev, ...newOutputs]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(-1);
        setInputVal('');
      } else {
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple autocompletion
      const cmds = ['git status', 'git init', 'git add .', 'git commit -m "', 'git branch', 'npm test', 'npm run dev', 'docker ps', 'clear', 'cat package.json'];
      const match = cmds.find((c) => c.startsWith(inputVal.trim()));
      if (match) {
        setInputVal(match);
      }
    }
  };

  const completedMissionsCount = missions.filter((m) => m.completed).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <TerminalIcon className="h-4 w-4" />
            <span>Interaktywny Symulator Konsoli</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Terminal Bash, Git & Docker w Przeglądarce
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Prawdziwe środowisko wiersza poleceń dla programisty: wykonuj polecenia Gita, uruchamiaj testy jednostkowe npm, badaj pliki i zdobywaj punkty XP za ukończone misje.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <div>
              <span className="font-bold text-white">{completedMissionsCount} / {missions.length}</span>
              <span className="text-slate-400 ml-1.5">misji</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setLines([
                { id: `r-${Date.now()}`, type: 'system', text: 'Terminal zresetowany do stanu początkowego.' },
              ]);
              setIsGitInitialized(false);
              setGitStaged([]);
              setGitCommits([]);
              setGitBranch('main');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Grid: Terminal + Missions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Terminal Window (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#0d1117] shadow-2xl overflow-hidden flex flex-col h-[440px] sm:h-[560px] max-w-full">
          
          {/* Terminal Window Top Bar */}
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-[#161b22] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-3 w-3 rounded-full bg-rose-500/80 shrink-0" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80 shrink-0" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80 shrink-0" />
              <span className="text-xs font-mono text-slate-400 ml-1 sm:ml-2 truncate max-w-[150px] sm:max-w-none">bash — student@academy:~/app</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 shrink-0">
              {isGitInitialized && (
                <span className="bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded text-[10px] sm:text-xs">
                  git: ({gitBranch})
                </span>
              )}
              <span className="text-slate-400 hidden sm:inline">UTF-8</span>
            </div>
          </div>

          {/* Terminal Body */}
          <div 
            className="flex-1 p-3 sm:p-4 font-mono text-xs overflow-y-auto space-y-1.5 select-text"
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((l) => (
              <div key={l.id} className="leading-relaxed whitespace-pre-wrap break-words">
                {l.type === 'system' && (
                  <span className="text-slate-400 italic">{l.text}</span>
                )}
                {l.type === 'input' && (
                  <span className="text-emerald-400 font-semibold">{l.text}</span>
                )}
                {l.type === 'output' && (
                  <span className="text-slate-300">{l.text}</span>
                )}
                {l.type === 'success' && (
                  <span className="text-emerald-300 font-bold">{l.text}</span>
                )}
                {l.type === 'error' && (
                  <span className="text-rose-400 font-semibold">{l.text}</span>
                )}
              </div>
            ))}

            {/* Input Line */}
            <form onSubmit={handleCommandSubmit} className="flex flex-wrap sm:flex-nowrap items-baseline gap-1.5 pt-1">
              <span className="text-emerald-400 font-bold text-xs break-all shrink-0">
                {currentUser.email.split('@')[0]}@academy:{currentPath}{isGitInitialized ? ` (${gitBranch})` : ''}$
              </span>
              <input
                ref={inputRef}
                type="text"
                autoFocus
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Wpisz komendę..."
                className="flex-1 min-w-[120px] bg-transparent text-white focus:outline-none caret-cyan-400 text-xs font-mono"
              />
            </form>
            <div ref={terminalEndRef} />
          </div>

          {/* Quick Command Hints Bar */}
          <div className="px-4 py-2 border-t border-slate-800/80 bg-[#161b22]/80 flex flex-wrap gap-2 text-[11px] font-mono">
            <span className="text-slate-400">Szybkie komendy:</span>
            {['git status', 'git add .', 'git commit -m "feat: init"', 'npm test', 'npm run dev', 'docker ps', 'ls -la', 'clear'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setInputVal(c);
                  inputRef.current?.focus();
                }}
                className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 transition-colors"
              >
                {c}
              </button>
            ))}
          </div>

        </div>

        {/* Missions & Guided Tasks Panel (1 col) */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Misje Konsolowe (+XP)</h3>
              </div>
              <span className="text-xs font-mono text-indigo-400 font-bold">
                +{missions.reduce((acc, m) => acc + (m.completed ? m.xpReward : 0), 0)} XP
              </span>
            </div>

            <div className="space-y-3">
              {missions.map((m, idx) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    m.completed
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          m.completed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          #{idx + 1}
                        </span>
                        <h4 className={`text-xs font-bold ${m.completed ? 'text-emerald-200 line-through' : 'text-white'}`}>
                          {m.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shrink-0">
                      +{m.xpReward} XP
                    </span>
                  </div>

                  {!m.completed && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono text-[10px]">{m.hint}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const cmd = m.hint.replace('Wpisz: ', '');
                          setInputVal(cmd);
                          inputRef.current?.focus();
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold"
                      >
                        Wklej &gt;
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Cheat Sheet Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400 space-y-2">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <Code className="h-3.5 w-3.5 text-cyan-400" />
              <span>Skróty klawiszowe terminala:</span>
            </div>
            <ul className="space-y-1 text-[11px]">
              <li><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Tab</kbd> — Inteligentne autouzupełnianie poleceń</li>
              <li><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">↑ / ↓</kbd> — Przewijanie historii komend</li>
              <li><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">clear</kbd> — Czyszczenie bufora ekranu</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
