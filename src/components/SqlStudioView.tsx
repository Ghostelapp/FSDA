import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundManager } from '../utils/audioFx';
import { 
  Database, 
  Play, 
  Table2, 
  Network, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  FileCode,
  Layers,
  ArrowRight
} from 'lucide-react';

interface DbRow {
  [key: string]: any;
}

export const SqlStudioView: React.FC = () => {
  const { allUsers } = useApp();

  const [activeTab, setActiveTab] = useState<'editor' | 'erd'>('editor');
  const [queryInput, setQueryInput] = useState<string>(
    `SELECT users.name, users.email, orders.amount, orders.status, orders.plan\nFROM orders\nINNER JOIN users ON orders.user_id = users.id\nWHERE orders.status = 'PAID'\nORDER BY orders.amount DESC;`
  );
  
  const [queryError, setQueryError] = useState<string | null>(null);
  const [executionStats, setExecutionStats] = useState<{ timeMs: number; count: number } | null>({
    timeMs: 1.2,
    count: 3,
  });

  // Pre-populated relational datasets
  const mockDb = {
    users: allUsers.map((u, i) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      xp: u.xp,
      is_pro: u.isPro,
    })),
    courses: [
      { id: 'c-1', title: 'Fundamenty Programowania', category: 'Podstawy', xp: 500, lessons_count: 5 },
      { id: 'c-2', title: 'HTML5 & Semantyka Web', category: 'Frontend', xp: 600, lessons_count: 5 },
      { id: 'c-3', title: 'Nowoczesny CSS & Tailwind', category: 'Frontend', xp: 700, lessons_count: 6 },
      { id: 'c-4', title: 'JavaScript & TypeScript', category: 'Frontend', xp: 950, lessons_count: 8 },
      { id: 'c-5', title: 'React SPA & Next.js', category: 'Frontend', xp: 1200, lessons_count: 10 },
      { id: 'c-6', title: 'Backend Node.js & Express', category: 'Backend', xp: 950, lessons_count: 7 },
      { id: 'c-7', title: 'PostgreSQL & Prisma ORM', category: 'Bazy danych', xp: 850, lessons_count: 6 },
      { id: 'c-8', title: 'DevOps, Docker & CI/CD', category: 'DevOps', xp: 900, lessons_count: 6 },
    ],
    orders: [
      { id: 'ord-101', user_id: 'user-admin', amount: 199.00, status: 'PAID', plan: 'lifetime', created_at: '2026-09-01' },
      { id: 'ord-102', user_id: 'user-admin', amount: 49.00, status: 'PAID', plan: 'monthly', created_at: '2026-10-01' },
      { id: 'ord-103', user_id: 'user-admin', amount: 99.00, status: 'PAID', plan: 'yearly', created_at: '2026-10-15' },
    ],
    quizzes: [
      { id: 'qz-1', user_id: 'user-admin', lesson_id: 'html-1', score_percent: 100, passed: true },
      { id: 'qz-2', user_id: 'user-admin', lesson_id: 'react-1', score_percent: 100, passed: true },
      { id: 'qz-3', user_id: 'user-admin', lesson_id: 'node-1', score_percent: 95, passed: true },
      { id: 'qz-4', user_id: 'user-admin', lesson_id: 'db-1', score_percent: 100, passed: true },
    ],
  };

  const [results, setResults] = useState<DbRow[]>([
    { name: 'Administrator (Zordon)', email: 'zordonzordon1@gmail.com', amount: 199.00, status: 'PAID', plan: 'lifetime' },
    { name: 'Administrator (Zordon)', email: 'zordonzordon1@gmail.com', amount: 99.00, status: 'PAID', plan: 'yearly' },
    { name: 'Administrator (Zordon)', email: 'zordonzordon1@gmail.com', amount: 49.00, status: 'PAID', plan: 'monthly' },
  ]);

  const handleRunQuery = () => {
    soundManager.playClick();
    const t0 = performance.now();
    const clean = queryInput.trim().replace(/;$/, '');

    try {
      setQueryError(null);
      let output: DbRow[] = [];

      // Query parser
      if (/from\s+courses/i.test(clean)) {
        output = [...mockDb.courses];
      } else if (/from\s+quizzes/i.test(clean)) {
        output = [...mockDb.quizzes];
      } else if (/from\s+orders/i.test(clean) && /join\s+users/i.test(clean)) {
        // JOIN orders + users
        output = mockDb.orders.map((o) => {
          const user = mockDb.users.find((u) => u.id === o.user_id) || { name: 'Anonim', email: 'brak' };
          return {
            order_id: o.id,
            user_name: user.name,
            user_email: user.email,
            amount: o.amount,
            status: o.status,
            plan: o.plan,
            created_at: o.created_at,
          };
        });
      } else if (/from\s+orders/i.test(clean)) {
        output = [...mockDb.orders];
      } else if (/from\s+users/i.test(clean)) {
        output = [...mockDb.users];
      } else {
        output = mockDb.users;
      }

      // WHERE clause simulation
      if (/where\s+.*xp\s*>\s*(\d+)/i.test(clean)) {
        const threshold = Number(clean.match(/xp\s*>\s*(\d+)/i)?.[1] || 0);
        output = output.filter((r) => (r.xp || 0) > threshold);
      }
      if (/where\s+.*status\s*=\s*['"](\w+)['"]/i.test(clean)) {
        const status = clean.match(/status\s*=\s*['"](\w+)['"]/i)?.[1];
        if (status) {
          output = output.filter((r) => r.status?.toLowerCase() === status.toLowerCase());
        }
      }

      // ORDER BY simulation
      if (/order\s+by\s+.*desc/i.test(clean)) {
        output = [...output].reverse();
      }

      const t1 = performance.now();
      const elapsed = Number((t1 - t0).toFixed(2));

      setResults(output);
      setExecutionStats({ timeMs: Math.max(0.4, elapsed), count: output.length });
      soundManager.playSuccess();
    } catch (err: any) {
      soundManager.playHeartLost();
      setQueryError(err.message || 'Błąd składniowy zapytania SQL.');
      setResults([]);
      setExecutionStats(null);
    }
  };

  const templates = [
    {
      label: 'Relacja: Zamówienia i Kursanci (INNER JOIN)',
      query: `SELECT users.name, users.email, orders.amount, orders.status, orders.plan\nFROM orders\nINNER JOIN users ON orders.user_id = users.id\nWHERE orders.status = 'PAID'\nORDER BY orders.amount DESC;`,
    },
    {
      label: 'Wszyscy Kursanci (SELECT * FROM users)',
      query: `SELECT id, name, email, role, xp, is_pro\nFROM users\nORDER BY xp DESC;`,
    },
    {
      label: 'Katalog Modułów (SELECT FROM courses)',
      query: `SELECT title, category, xp, lessons_count\nFROM courses\nWHERE xp >= 700\nORDER BY xp DESC;`,
    },
    {
      label: 'Wyniki Quizów (SELECT FROM quizzes)',
      query: `SELECT lesson_id, score_percent, passed\nFROM quizzes\nWHERE score_percent >= 90\nORDER BY score_percent DESC;`,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Database className="h-4 w-4" />
            <span>Studio Bazy Danych PostgreSQL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Interaktywna Konsola SQL & Schemat ERD
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Testuj zapytania SQL w czasie rzeczywistym: złączenia relacji (INNER JOIN), filtrowanie (WHERE), agregacje i badaj schemat tabel bez instalacji lokalnego serwera.
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'editor' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Table2 className="h-3.5 w-3.5" />
            <span>Konsola SQL</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('erd')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'erd' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            <span>Diagram Relacji (ERD)</span>
          </button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Query Editor & Controls (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Editor Box */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden flex flex-col">
              <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <FileCode className="h-4 w-4 text-cyan-400" />
                  <span>query.sql (PostgreSQL 16)</span>
                </div>
                <button
                  type="button"
                  onClick={handleRunQuery}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/30"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>Wykonaj Zapytanie (Run)</span>
                </button>
              </div>

              <textarea
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                rows={6}
                spellCheck={false}
                className="w-full bg-[#0d1117] text-cyan-300 font-mono text-xs p-3 sm:p-4 focus:outline-none resize-none leading-relaxed selection:bg-indigo-600 selection:text-white"
              />

              {/* Execution Info Bar */}
              <div className="px-3 sm:px-4 py-2 border-t border-slate-800/80 bg-slate-950 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-slate-400">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {executionStats && (
                    <>
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Status: 200 OK</span>
                      </span>
                      <span>Zwrócono: <strong className="text-white">{executionStats.count}</strong> wierszy</span>
                      <span>Czas: <strong className="text-cyan-300">{executionStats.timeMs}ms</strong></span>
                    </>
                  )}
                  {queryError && (
                    <span className="text-rose-400 font-semibold">{queryError}</span>
                  )}
                </div>
                <span className="text-slate-400">PostgreSQL</span>
              </div>
            </div>

            {/* Results Grid Table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl overflow-hidden">
              <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Table2 className="h-4 w-4 text-indigo-400" />
                  <span>Wyniki Zapytania</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {results.length} wierszy
                </span>
              </div>

              <div className="overflow-x-auto max-h-80">
                {results.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Brak wyników do wyświetlenia. Zmodyfikuj kryteria lub wybierz gotowy szablon.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950/80 text-slate-300 uppercase text-[10px] tracking-wider sticky top-0 border-b border-slate-800">
                      <tr>
                        {Object.keys(results[0]).map((col) => (
                          <th key={col} className="px-4 py-2.5 font-bold">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {results.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                          {Object.values(row).map((val, cellIdx) => (
                            <td key={cellIdx} className="px-4 py-2 text-slate-300">
                              {typeof val === 'boolean' ? (
                                <span className={val ? 'text-emerald-400' : 'text-slate-400'}>
                                  {val ? 'TRUE' : 'FALSE'}
                                </span>
                              ) : typeof val === 'number' ? (
                                <span className="text-amber-300">{val}</span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>

          {/* Templates & Schema Inspector Sidebar (1 col) */}
          <div className="space-y-4">
            
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Gotowe Szablony Zapytań</h3>
              </div>

              <div className="space-y-2">
                {templates.map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQueryInput(tpl.query);
                      soundManager.playClick();
                    }}
                    className="w-full text-left p-3 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-800/60 hover:border-indigo-500/40 transition-all text-xs space-y-1 group"
                  >
                    <div className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                      <span>{tpl.label}</span>
                      <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      {tpl.query.split('\n')[0]}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Schema Tables Info */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-indigo-400" />
                <span>Dostępne Tabele w Bazie:</span>
              </h4>
              <ul className="space-y-2 text-xs font-mono">
                <li className="flex items-center justify-between text-slate-400">
                  <span className="text-cyan-300 font-bold">users</span>
                  <span className="text-[10px] text-slate-400">PK: id (UUID)</span>
                </li>
                <li className="flex items-center justify-between text-slate-400">
                  <span className="text-cyan-300 font-bold">orders</span>
                  <span className="text-[10px] text-slate-400">FK: user_id -&gt; users.id</span>
                </li>
                <li className="flex items-center justify-between text-slate-400">
                  <span className="text-cyan-300 font-bold">courses</span>
                  <span className="text-[10px] text-slate-400">PK: id (VARCHAR)</span>
                </li>
                <li className="flex items-center justify-between text-slate-400">
                  <span className="text-cyan-300 font-bold">quizzes</span>
                  <span className="text-[10px] text-slate-400">FK: user_id, lesson_id</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      ) : (
        /* ERD (Entity Relationship Diagram) View */
        <div className="rounded-2xl border border-slate-800 bg-[#0b101b] p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Network className="h-5 w-5 text-indigo-400" />
                <span>Diagram Encji i Relacji Bazy Danych (ERD)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Relacje jeden-do-wielu (1:N) i integralność referencyjna w PostgreSQL / Prisma ORM.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Table: Users */}
            <div className="rounded-xl border border-indigo-500/40 bg-slate-900 shadow-lg overflow-hidden font-mono text-xs">
              <div className="bg-indigo-950/80 px-4 py-2.5 font-bold text-indigo-200 border-b border-indigo-500/30 flex items-center justify-between">
                <span>TABLE: users</span>
                <span className="text-[10px] bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-300">Główna</span>
              </div>
              <div className="p-3 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <span>PK id</span>
                  <span className="text-slate-400">UUID NOT NULL</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>name</span>
                  <span className="text-slate-400">VARCHAR(100)</span>
                </div>
                <div className="flex items-center justify-between text-cyan-300">
                  <span>email</span>
                  <span className="text-slate-400">VARCHAR(255) UNIQUE</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>xp</span>
                  <span className="text-slate-400">INTEGER DEFAULT 0</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>role</span>
                  <span className="text-slate-400">ENUM('student', 'admin')</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>is_pro</span>
                  <span className="text-slate-400">BOOLEAN DEFAULT FALSE</span>
                </div>
              </div>
            </div>

            {/* Table: Orders */}
            <div className="rounded-xl border border-emerald-500/40 bg-slate-900 shadow-lg overflow-hidden font-mono text-xs">
              <div className="bg-emerald-950/80 px-4 py-2.5 font-bold text-emerald-200 border-b border-emerald-500/30 flex items-center justify-between">
                <span>TABLE: orders</span>
                <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">Relacja 1:N</span>
              </div>
              <div className="p-3 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <span>PK id</span>
                  <span className="text-slate-400">UUID NOT NULL</span>
                </div>
                <div className="flex items-center justify-between text-rose-300 font-bold">
                  <span>FK user_id</span>
                  <span className="text-slate-400">-&gt; users(id) ON DELETE CASCADE</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>amount</span>
                  <span className="text-slate-400">DECIMAL(10,2)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>status</span>
                  <span className="text-slate-400">ENUM('PAID', 'PENDING')</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>plan</span>
                  <span className="text-slate-400">VARCHAR(50)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>created_at</span>
                  <span className="text-slate-400">TIMESTAMP WITH TIME ZONE</span>
                </div>
              </div>
            </div>

            {/* Table: Quizzes */}
            <div className="rounded-xl border border-cyan-500/40 bg-slate-900 shadow-lg overflow-hidden font-mono text-xs">
              <div className="bg-cyan-950/80 px-4 py-2.5 font-bold text-cyan-200 border-b border-cyan-500/30 flex items-center justify-between">
                <span>TABLE: quizzes</span>
                <span className="text-[10px] bg-cyan-500/20 px-1.5 py-0.5 rounded text-cyan-300">Edukacja</span>
              </div>
              <div className="p-3 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <span>PK id</span>
                  <span className="text-slate-400">UUID NOT NULL</span>
                </div>
                <div className="flex items-center justify-between text-rose-300 font-bold">
                  <span>FK user_id</span>
                  <span className="text-slate-400">-&gt; users(id)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>lesson_id</span>
                  <span className="text-slate-400">VARCHAR(50)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>score_percent</span>
                  <span className="text-slate-400">INTEGER</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>passed</span>
                  <span className="text-slate-400">BOOLEAN</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
