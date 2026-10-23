import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MODULES_DATA } from '../data/modulesData';
import { PROJECTS_DATA } from '../data/projectsData';
import {
  generateGithubPortfolioMarkdown,
  validateBackupPayload,
} from '../utils/developerSimulators';
import {
  FileText,
  Download,
  Upload,
  Copy,
  Check,
  Printer,
  Briefcase,
  Award,
  Code2,
} from 'lucide-react';

export const CareerBackupView: React.FC = () => {
  const { currentUser, importUserBackup } = useApp();
  const [copiedMd, setCopiedMd] = useState(false);
  const [backupJsonInput, setBackupJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<{ ok: boolean; message: string } | null>(null);

  const completedModules = MODULES_DATA.filter((m) =>
    m.lessons.some((l) => currentUser.completedLessons.includes(l.id))
  ).map((m) => m.title);

  const completedProjects = PROJECTS_DATA.filter((p) =>
    currentUser.completedProjects.includes(p.id)
  ).map((p) => p.title);

  const portfolioMarkdown = generateGithubPortfolioMarkdown(
    currentUser,
    completedModules,
    completedProjects
  );

  const handleCopyMarkdown = () => {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(portfolioMarkdown);
    }
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleExportJson = () => {
    const payload = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        platform: 'Full Stack Developer Academy',
        user: currentUser,
      },
      null,
      2
    );
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fsda-backup-${currentUser.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateBackupPayload(backupJsonInput);
    if (!validation.valid || !validation.user) {
      setImportStatus({ ok: false, message: validation.error || 'Błąd walidacji pliku JSON.' });
      return;
    }
    importUserBackup(validation.user);
    setImportStatus({
      ok: true,
      message: `Pomyślnie zaimportowano profil: ${validation.user.name} (${validation.user.xp} XP).`,
    });
    setBackupJsonInput('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <p className="text-xs font-semibold text-emerald-400">Kariera Junior Developera & Dane</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Kreator CV / Portfolio GitHub & Kopia Zapasowa
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Generuj profesjonalne podsumowanie umiejętności oraz projektów na podstawie postępów w akademii i zarządzaj kopią zapasową konta.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 transition-colors"
          >
            <Printer className="h-4 w-4 text-indigo-400" />
            <span>Drukuj CV / Zapisz PDF</span>
          </button>
          <button
            type="button"
            onClick={handleExportJson}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Pobierz Backup (.JSON)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Live Developer CV Preview (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <h2 className="text-xl font-extrabold text-white">{currentUser.name}</h2>
              <p className="text-xs font-semibold text-indigo-400 mt-0.5">
                Junior Full Stack Developer · Poziom {currentUser.level} ({currentUser.xp} XP)
              </p>
              <p className="text-xs text-slate-400 mt-1">{currentUser.email}</p>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-400 font-mono tabular-nums">
              <p>Ukończone lekcje: {currentUser.completedLessons.length}</p>
              <p>Projekty w portfolio: {currentUser.completedProjects.length} / 12</p>
              <p>Odznaki techniczne: {currentUser.unlockedBadges.length}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-cyan-400" />
              <span>Profil Zawodowy</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentUser.bio ||
                'Praktykujący programista Full Stack rozwijający nowoczesne aplikacje webowe w oparciu o React, TypeScript, Node.js oraz relacyjne bazy danych SQL.'}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>Zweryfikowane Projekty Praktyczne ({completedProjects.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {completedProjects.map((title, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-200 font-medium"
                >
                  {idx + 1}. {title}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span>Zrealizowane Moduły Ścieżki Full Stack ({completedModules.length})</span>
            </h3>
            <div className="space-y-1.5 text-xs text-slate-300">
              {completedModules.map((modTitle, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>{modTitle}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: GitHub README Generator & JSON Backup Restore (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* GitHub Profile Markdown */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Generator README.md na GitHub</h3>
              </div>
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                {copiedMd ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Skopiowano</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Kopiuj Markdown</span>
                  </>
                )}
              </button>
            </div>

            <pre className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-64">
              {portfolioMarkdown}
            </pre>
          </div>

          {/* Import Backup JSON */}
          <form
            onSubmit={handleImportJson}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Przywracanie Postępów z Kopii (JSON)</h3>
            </div>
            <p className="text-xs text-slate-400">
              Wklej zawartość pobranego wcześniej pliku kopii zapasowej JSON, aby przywrócić XP, ukończone lekcje i odznaki.
            </p>
            <label htmlFor="backup-json-textarea" className="sr-only">
              Kod JSON kopii zapasowej
            </label>
            <textarea
              id="backup-json-textarea"
              rows={4}
              value={backupJsonInput}
              onChange={(e) => setBackupJsonInput(e.target.value)}
              placeholder='{"user": {"id": "...", "name": "...", "email": "...", "xp": 5000, "completedLessons": []}}'
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-mono text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
            {importStatus && (
              <p className={`text-xs font-medium ${importStatus.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                {importStatus.message}
              </p>
            )}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 px-4 text-xs font-bold text-white transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Zaimportuj i przywróć profil</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
