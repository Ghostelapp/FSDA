import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateLevel } from '../utils/gamification';
import { MODULES_DATA } from '../data/modulesData';
import { BADGES_DATA } from '../data/badgesData';
import { LearningProgressChart } from './LearningProgressChart';
import { DailyGoalReminderCard } from './DailyGoalReminderCard';
import { 
  Sparkles, 
  Flame, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Bell, 
  AlertTriangle,
  FolderGit2,
  ChevronRight,
  TrendingUp,
  Target,
  Zap,
  Code2
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { currentUser, setActiveTab, announcements, weakAreas, allLessons } = useApp();
  const levelInfo = calculateLevel(currentUser.xp);

  // Calculate overall progress across curriculum
  const totalLessons = allLessons.length;
  const completedCount = currentUser.completedLessons.length;
  const overallPercent = Math.min(100, Math.round((completedCount / (totalLessons || 1)) * 100));

  // Current focus: HTML module
  const htmlModule = MODULES_DATA.find((m) => m.id === 2);
  const htmlCompletedCount = currentUser.completedLessons.filter((id) => id.startsWith('html-')).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-4 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-300">
              <Zap className="h-3.5 w-3.5 text-indigo-400" />
              <span>Droga do Junior Full Stack Developera</span>
            </div>
            <h1 className="text-xl sm:text-4xl font-extrabold text-white tracking-tight">
              Witaj ponownie, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{currentUser.name}</span>!
            </h1>
            <p className="text-xs sm:text-base text-slate-300">
              Twój aktualny stopień: <strong className="text-indigo-300 font-semibold">{levelInfo.title}</strong> (Poziom {levelInfo.level}).
              Kontynuuj naukę, rozwiązuj interaktywne ćwiczenia w edytorze i buduj portfolio projektów.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('lesson', 'html-1')}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 sm:px-5 py-2.5 sm:py-3 text-xs font-bold transition-all shadow-lg shadow-indigo-900/50"
            >
              <Code2 className="h-4 w-4" />
              <span>Przejdź do lekcji HTML</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 px-4 py-2.5 sm:py-3 text-xs font-semibold transition-colors"
            >
              <span>Piaskownica Kodu</span>
            </button>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between text-xs gap-1 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Poziom {levelInfo.level}</span>
              <span className="text-slate-400">({levelInfo.title})</span>
            </div>
            <span className="font-mono text-indigo-300 font-semibold text-[11px] sm:text-xs">
              {levelInfo.currentLevelXp} / {levelInfo.levelXpSpan} XP
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* XP */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400">Punkty Dośw.</span>
            <div className="rounded-lg bg-indigo-500/10 p-1.5 sm:p-2 text-indigo-400">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black text-white">{currentUser.xp} <span className="text-xs font-normal text-slate-400">XP</span></p>
          <p className="mt-1 text-[10px] sm:text-[11px] text-emerald-400 flex items-center gap-1 font-medium truncate">
            <TrendingUp className="h-3 w-3 shrink-0" />
            <span>Aktywny postęp</span>
          </p>
        </div>

        {/* Streak */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400">Seria Nauki</span>
            <div className="rounded-lg bg-amber-500/10 p-1.5 sm:p-2 text-amber-400">
              <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black text-white">{currentUser.streakDays} <span className="text-xs font-normal text-slate-400">dni</span></p>
          <p className="mt-1 text-[10px] sm:text-[11px] text-amber-400 font-medium truncate">
            Ogień dyscypliny!
          </p>
        </div>

        {/* Completed Lessons */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400">Zaliczone Lekcje</span>
            <div className="rounded-lg bg-emerald-500/10 p-1.5 sm:p-2 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black text-white">{currentUser.completedLessons.length} <span className="text-xs font-normal text-slate-400">lekcji</span></p>
          <p className="mt-1 text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
            W module HTML: {htmlCompletedCount} / 5
          </p>
        </div>

        {/* Completed Projects */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400">Projekty</span>
            <div className="rounded-lg bg-cyan-500/10 p-1.5 sm:p-2 text-cyan-400">
              <FolderGit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black text-white">{currentUser.completedProjects.length} <span className="text-xs font-normal text-slate-400">/ 12</span></p>
          <p className="mt-1 text-[10px] sm:text-[11px] text-indigo-400 font-medium truncate">
            Budowa portfolio
          </p>
        </div>
      </div>

      {/* Daily Learning Goal & Service Worker Push Notification Scheduler */}
      <DailyGoalReminderCard />

      {/* 30-Day Learning Progress Visualization (Recharts) */}
      <LearningProgressChart 
        currentUser={currentUser} 
        modules={MODULES_DATA} 
      />

      {/* Weak Areas Banner if any */}
      {weakAreas.length > 0 && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Wykryto obszary wymagające powtórki ({weakAreas.length})</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Niektóre testy wiedzy uzyskały wynik poniżej 80%. System inteligentnych powtórek poleca odświeżenie materiału.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shrink-0"
          >
            Przejdź do powtórek
          </button>
        </div>
      )}

      {/* Current HTML Module Showcase */}
      {htmlModule && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                <span>Moduł 2</span>
                <span>•</span>
                <span>Frontend Podstawy</span>
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-white">{htmlModule.title}</h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">{htmlModule.description}</p>
            </div>
            
            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400">Postęp modułu</span>
              <p className="text-lg font-black text-indigo-300 font-mono">
                {Math.round((htmlCompletedCount / (htmlModule.lessons.length || 1)) * 100)}%
              </p>
            </div>
          </div>

          {/* Lessons List in Module 2 */}
          <div className="space-y-3">
            {htmlModule.lessons.map((lesson) => {
              const isDone = currentUser.completedLessons.includes(lesson.id);
              const quizScore = currentUser.quizScores?.[lesson.id];

              return (
                <div
                  key={lesson.id}
                  onClick={() => setActiveTab('lesson', lesson.id)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 hover:border-indigo-500/50 hover:bg-slate-900 transition-all cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`mt-0.5 sm:mt-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                      isDone 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {isDone ? <CheckCircle2 className="h-4 w-4" /> : lesson.order}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {lesson.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.durationMinutes} min
                        </span>
                        <span>•</span>
                        <span className="text-indigo-300 font-semibold">+{lesson.xpReward} XP</span>
                        {quizScore !== undefined && (
                          <>
                            <span>•</span>
                            <span className={quizScore >= 80 ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                              Quiz: {quizScore}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      {isDone ? 'Powtórz lekcję' : 'Rozpocznij naukę'}
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Badges & Achievements Section */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              <span>Odznaki i Osiągnięcia ({currentUser.unlockedBadges.length} / {BADGES_DATA.length})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Gromadź odznaki za systematyczność, perfekcyjne quizy i ukończone projekty.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {BADGES_DATA.map((badge) => {
            const isUnlocked = currentUser.unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-indigo-950/20 border-indigo-500/40 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-60 grayscale'
                }`}
              >
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl mb-3 ${
                  isUnlocked
                    ? 'bg-gradient-to-tr from-indigo-600 to-amber-500 text-white shadow-md'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  <Award className="h-6 w-6" />
                </div>
                <h4 className="text-xs font-bold text-white truncate">{badge.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
                <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isUnlocked ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-500'
                }`}>
                  {isUnlocked ? 'Odblokowane' : 'Zablokowane'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <Bell className="h-5 w-5" />
          <h2 className="text-base font-bold text-white">Ogłoszenia i Aktualności</h2>
        </div>
        <div className="space-y-3">
          {announcements.map((ann) => (
            <div key={ann.id} className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-indigo-400">{ann.category}</span>
                <span className="text-slate-500">{ann.date} • {ann.author}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-200">{ann.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{ann.content}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
