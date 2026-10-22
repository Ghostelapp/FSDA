import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MODULES_DATA } from '../data/modulesData';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Bell, 
  BarChart3, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { Announcement } from '../types';

export const AdminPanelView: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    announcements, 
    addAnnouncement, 
    deleteAnnouncement, 
    updateUserByAdmin, 
    switchUser 
  } = useApp();

  const [adminTab, setAdminTab] = useState<'students' | 'announcements' | 'analytics' | 'curriculum'>('students');

  // Announcement form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<Announcement['category']>('Kurs');

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    addAnnouncement(newTitle.trim(), newContent.trim(), newCategory);
    setNewTitle('');
    setNewContent('');
  };

  const totalXP = allUsers.reduce((sum, u) => sum + u.xp, 0);
  const avgXP = Math.round(totalXP / (allUsers.length || 1));
  const totalCompletedLessons = allUsers.reduce((sum, u) => sum + u.completedLessons.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>Panel Instruktora & Administracji</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Zarządzanie Akademią i Kursantami
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Zarządzaj kontami studentów, publikuj ogłoszenia, analizuj postępy i weryfikuj trudność lekcji.
          </p>
        </div>

        {currentUser.role !== 'admin' && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Zalogowano jako kursant ({currentUser.name}).</span>
            <button
              type="button"
              onClick={() => switchUser('user-admin')}
              className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
            >
              Przełącz na konto Admina
            </button>
          </div>
        )}
      </div>

      {/* Quick KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <span className="text-xs font-semibold text-slate-400">Aktywni Kursanci</span>
          <p className="mt-2 text-2xl font-black text-white">{allUsers.length}</p>
          <p className="mt-1 text-[11px] text-slate-400">Wszyscy w bazie lokalnej</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <span className="text-xs font-semibold text-slate-400">Średnie XP na Studenta</span>
          <p className="mt-2 text-2xl font-black text-indigo-300">{avgXP} <span className="text-xs font-normal text-slate-400">XP</span></p>
          <p className="mt-1 text-[11px] text-emerald-400">Łącznie: {totalXP} XP</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <span className="text-xs font-semibold text-slate-400">Zaliczone Lekcje Łącznie</span>
          <p className="mt-2 text-2xl font-black text-white">{totalCompletedLessons}</p>
          <p className="mt-1 text-[11px] text-slate-400">W modułach Fundamenty & HTML</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <span className="text-xs font-semibold text-slate-400">Dostępne Moduły</span>
          <p className="mt-2 text-2xl font-black text-cyan-400">15</p>
          <p className="mt-1 text-[11px] text-slate-400">Pełny syllabus Full Stack</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setAdminTab('students')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            adminTab === 'students'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Kursanci ({allUsers.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('announcements')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            adminTab === 'announcements'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>Ogłoszenia ({announcements.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('analytics')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            adminTab === 'analytics'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Analiza Quizów & Problemów</span>
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('curriculum')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            adminTab === 'curriculum'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Przegląd Programu (15)</span>
        </button>
      </div>

      {/* TAB 1: Students Manager */}
      {adminTab === 'students' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th scope="col" className="p-4">Kursant</th>
                    <th scope="col" className="p-4">Rola</th>
                    <th scope="col" className="p-4">Punkty XP</th>
                    <th scope="col" className="p-4">Seria</th>
                    <th scope="col" className="p-4">Ukończone</th>
                    <th scope="col" className="p-4 text-right">Akcje administracyjne</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {allUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'} 
                            alt={user.name} 
                            className="h-8 w-8 rounded-lg object-cover" 
                          />
                          <div>
                            <span className="font-bold text-white block">{user.name}</span>
                            <span className="text-[11px] text-slate-400">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          user.role === 'admin' 
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' 
                            : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {user.role === 'admin' ? 'Administrator' : 'Kursant'}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-indigo-300">
                        {user.xp} XP
                      </td>
                      <td className="p-4 text-amber-400 font-semibold">
                        {user.streakDays} dni
                      </td>
                      <td className="p-4 text-slate-300">
                        {user.completedLessons.length} lekcji
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => updateUserByAdmin(user.id, { xp: user.xp + 100 })}
                          title="Dodaj 100 bonusowych punktów XP"
                          className="px-2.5 py-1 rounded bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors"
                        >
                          +100 XP
                        </button>
                        <button
                          type="button"
                          onClick={() => updateUserByAdmin(user.id, { 
                            role: user.role === 'admin' ? 'student' : 'admin' 
                          })}
                          className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                          Zmień rolę
                        </button>
                        <button
                          type="button"
                          onClick={() => switchUser(user.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors"
                        >
                          Zaloguj jako
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Announcements Publisher */}
      {adminTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create form */}
          <form onSubmit={handleCreateAnnouncement} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="h-4 w-4 text-indigo-400" />
              <span>Opublikuj nowe ogłoszenie</span>
            </h3>
            
            <div className="space-y-1">
              <label htmlFor="ann-title" className="text-xs font-semibold text-slate-300 block">Tytuł ogłoszenia:</label>
              <input
                id="ann-title"
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="np. Warsztaty na żywo z React 19 w czwartek"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="ann-cat" className="text-xs font-semibold text-slate-300 block">Kategoria:</label>
              <select
                id="ann-cat"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Kurs">Kurs</option>
                <option value="Wydarzenie">Wydarzenie</option>
                <option value="Aktualizacja">Aktualizacja</option>
                <option value="Porada">Porada</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="ann-content" className="text-xs font-semibold text-slate-300 block">Treść wiadomości:</label>
              <textarea
                id="ann-content"
                rows={4}
                required
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Wpisz treść komunikatu dla kursantów..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 text-xs font-bold transition-all shadow-md shadow-indigo-900/40"
            >
              Opublikuj ogłoszenie dla wszystkich
            </button>
          </form>

          {/* List of existing */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Opublikowane ogłoszenia ({announcements.length}):
            </h3>
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-400">{ann.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">{ann.date}</span>
                    <button
                      type="button"
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Usuń ogłoszenie"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                <p className="text-xs text-slate-400">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Analytics */}
      {adminTab === 'analytics' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Analiza wyników i problematycznych zagadnień</h3>
            <p className="text-xs text-slate-400 mt-1">
              Zestawienie średnich wyników testów wiedzy kursantów z modułu HTML5:
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Lekcja 3: Nowoczesne formularze i walidacja</span>
                <span className="text-amber-400 font-semibold font-mono">Średni wynik: 74%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '74%' }} />
              </div>
              <p className="text-[11px] text-slate-400">
                Najczęstszy błąd: Pomijanie atrybutu "for" w tagu &lt;label&gt; i stosowanie wyłącznie placeholderów.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Lekcja 5: Dostępność cyfrowa (a11y/WCAG) i SEO</span>
                <span className="text-emerald-400 font-semibold font-mono">Średni wynik: 88%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
              </div>
              <p className="text-[11px] text-slate-400">
                Wysoka zdawalność: Kursanci doskonale radzą sobie z zasadą POUR i atrybutami aria-label.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Curriculum Overview */}
      {adminTab === 'curriculum' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Struktura 15 modułów kursu</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {MODULES_DATA.map((m) => (
              <div key={m.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 font-bold font-mono">
                  {m.id}
                </span>
                <div>
                  <h4 className="font-bold text-white">{m.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{m.durationHours}h • {m.totalXp} XP • {m.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
