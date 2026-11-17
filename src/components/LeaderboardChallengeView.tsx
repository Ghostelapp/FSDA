import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  buildWeeklyLeaderboard,
  DAILY_CHALLENGES,
  getLocalizedDailyChallenges,
  evaluateDailyChallenge,
  ChallengeEvalResult,
} from '../utils/developerSimulators';
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  XCircle,
  Play,
  Code2,
  Crown,
} from 'lucide-react';

export const LeaderboardChallengeView: React.FC = () => {
  const { currentUser, allUsers, awardCustomXp, language } = useApp();
  const isEn = language === 'en';

  const dailyChallenges = useMemo(
    () => getLocalizedDailyChallenges(language),
    [language]
  );

  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(DAILY_CHALLENGES[0].id);
  const activeChallenge =
    dailyChallenges.find((c) => c.id === selectedChallengeId) || dailyChallenges[0];

  const [codeMap, setCodeMap] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    DAILY_CHALLENGES.forEach((c) => {
      initial[c.id] = c.starterCode;
    });
    return initial;
  });

  const [evalResult, setEvalResult] = useState<ChallengeEvalResult | null>(null);
  const [localSolvedIds, setLocalSolvedIds] = useState<string[]>([]);

  const solvedIds = useMemo(
    () =>
      Array.from(
        new Set([
          ...localSolvedIds,
          ...dailyChallenges
            .filter((c) => (currentUser.claimedRewards || []).includes(`daily-${c.id}`))
            .map((c) => c.id),
        ])
      ),
    [localSolvedIds, currentUser.claimedRewards, dailyChallenges]
  );

  const leaderboard = useMemo(
    () => buildWeeklyLeaderboard(currentUser, allUsers, language),
    [currentUser, allUsers, language]
  );

  const handleRunTests = () => {
    const userCode = codeMap[activeChallenge.id] || '';
    const res = evaluateDailyChallenge(activeChallenge, userCode, language);
    setEvalResult(res);

    if (res.passedAll) {
      setLocalSolvedIds((prev) => (prev.includes(activeChallenge.id) ? prev : [...prev, activeChallenge.id]));
      awardCustomXp(
        activeChallenge.xpReward,
        isEn
          ? `Solved Daily Challenge: ${activeChallenge.title}`
          : `Rozwiązano Wyzwanie Dnia: ${activeChallenge.title}`,
        `daily-${activeChallenge.id}`,
        { code: userCode }
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <p className="text-xs font-semibold text-amber-400">
            {isEn ? 'Competition & Algorithms' : 'Rywalizacja & Algorytmika'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {isEn ? 'Weekly XP Leagues & Daily Kata' : 'Ligi Tygodniowe XP & Wyzwanie Dnia'}
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            {isEn
              ? 'Earn XP from lessons, API missions, and daily coding challenges to hold your spot in the Diamond League.'
              : 'Zdobywaj punkty doświadczenia za ukończone lekcje, misje API i codzienne zadania kodowania, aby utrzymać miejsce w Lidze Diamentowej.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Weekly League Leaderboard Table (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Trophy className="h-5 w-5 text-amber-400" />
              <div>
                <h2 className="text-base font-bold text-white">
                  {isEn ? 'Weekly Student Leaderboard' : 'Ranking Tygodniowy Kursantów'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isEn ? 'Live standings by total XP' : 'Aktualizacja na żywo według łącznego XP'}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-amber-300">
              {isEn ? 'Fall 2026 Season' : 'Sezon Jesień 2026'}
            </span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {leaderboard.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between py-3 px-3 rounded-xl transition-colors ${
                  entry.isCurrentUser ? 'bg-indigo-950/40 border border-indigo-500/30' : 'hover:bg-slate-950/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-6 text-center font-mono text-xs font-bold tabular-nums ${
                      entry.rank === 1
                        ? 'text-amber-400'
                        : entry.rank === 2
                        ? 'text-slate-200'
                        : entry.rank === 3
                        ? 'text-amber-600'
                        : 'text-slate-400'
                    }`}
                  >
                    #{entry.rank}
                  </span>

                  <img
                    src={entry.avatar}
                    alt={entry.name}
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-lg object-cover bg-slate-800 shrink-0"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white truncate">{entry.name}</p>
                      {entry.rank === 1 && <Crown className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {isEn
                        ? `${entry.displayLeague} League · ${entry.streakDays}d streak`
                        : `Liga ${entry.displayLeague} · Seria ${entry.streakDays} dni`}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono tabular-nums shrink-0">
                  <p className="text-xs font-bold text-indigo-300">{entry.xp} XP</p>
                  <p className="text-[10px] text-emerald-400">
                    {isEn ? `+${entry.weeklyXp} this wk` : `+${entry.weeklyXp} w tym tyg.`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Daily Coding Challenge (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-cyan-400" />
              <div>
                <h2 className="text-base font-bold text-white">
                  {isEn ? 'Daily Coding Challenge (Kata)' : 'Wyzwanie Dnia (Daily Kata)'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isEn
                    ? `Solve the puzzle and claim +${activeChallenge.xpReward} XP bonus`
                    : `Rozwiąż zadanie i zgarnij bonus +${activeChallenge.xpReward} XP`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
              <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                {isEn
                  ? `Completed: ${solvedIds.length}/${dailyChallenges.length}`
                  : `Zaliczone: ${solvedIds.length}/${dailyChallenges.length}`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {dailyChallenges.map((ch, idx) => {
              const isSolved = solvedIds.includes(ch.id);
              const isActive = ch.id === activeChallenge.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  title={ch.title}
                  onClick={() => {
                    setSelectedChallengeId(ch.id);
                    setEvalResult(null);
                  }}
                  className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : isSolved
                      ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>#{idx + 1}</span>
                  {isSolved && <CheckCircle2 className="h-3 w-3 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{activeChallenge.title}</h3>
              {solvedIds.includes(activeChallenge.id) && (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isEn ? 'Solved' : 'Zaliczone'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{activeChallenge.description}</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="daily-challenge-editor" className="text-xs font-semibold text-slate-300">
              {isEn ? 'Your JavaScript solution:' : 'Twój kod JavaScript:'}
            </label>
            <textarea
              id="daily-challenge-editor"
              rows={7}
              value={codeMap[activeChallenge.id] || ''}
              onChange={(e) =>
                setCodeMap((prev) => ({ ...prev, [activeChallenge.id]: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs text-cyan-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleRunTests}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white transition-colors"
            >
              <Play className="h-3.5 w-3.5" />
              <span>{isEn ? 'Run unit tests' : 'Uruchom testy jednostkowe'}</span>
            </button>

            <span className="text-xs font-mono text-indigo-300 tabular-nums flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              {isEn ? `Reward: +${activeChallenge.xpReward} XP` : `Nagroda: +${activeChallenge.xpReward} XP`}
            </span>
          </div>

          {evalResult && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              {evalResult.error ? (
                <p className="text-xs text-rose-400 font-mono">{evalResult.error}</p>
              ) : (
                <div className="space-y-2">
                  {evalResult.results.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300">{r.inputDesc}</span>
                      <span className={`flex items-center gap-1 font-bold ${r.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {r.passed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                        {r.passed
                          ? `OK (${r.actual})`
                          : isEn
                          ? `Got ${r.actual}, expected ${r.expected}`
                          : `Otrzymano ${r.actual}, oczekiwano ${r.expected}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
