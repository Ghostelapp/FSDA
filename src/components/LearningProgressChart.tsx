import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  BookCheck, 
  Layers, 
  Target, 
  Calendar, 
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { User, Module } from '../types';
import { 
  calculateCompletedModulesCount, 
  generateProgressTimelineData, 
  calculateProgressStats,
  DayProgressPoint 
} from '../utils/progressTimeline';

interface LearningProgressChartProps {
  currentUser: User;
  modules: Module[];
}

export const LearningProgressChart: React.FC<LearningProgressChartProps> = ({
  currentUser,
  modules,
}) => {
  const [timeRange, setTimeRange] = useState<'30' | '14' | '7'>('30');
  const [chartMode, setChartMode] = useState<'modules' | 'detailed'>('modules');

  const totalModulesCount = modules.length || 15;

  // Calculate actually completed modules for current user
  const currentCompletedModulesCount = useMemo(() => {
    return calculateCompletedModulesCount(modules, currentUser.completedLessons);
  }, [modules, currentUser.completedLessons]);

  const currentCompletedLessonsCount = currentUser.completedLessons.length;

  // Generate continuous timeline data for the past 30 days ending today
  const full30DaysData = useMemo<DayProgressPoint[]>(() => {
    return generateProgressTimelineData({
      completedModules: currentCompletedModulesCount,
      totalModules: totalModulesCount,
      completedLessons: currentCompletedLessonsCount,
      daysCount: 30,
    });
  }, [currentCompletedModulesCount, currentCompletedLessonsCount, totalModulesCount]);

  // Filter based on selected time range
  const filteredData = useMemo(() => {
    const days = parseInt(timeRange, 10);
    return full30DaysData.slice(full30DaysData.length - days);
  }, [full30DaysData, timeRange]);

  // Stats calculation
  const stats = useMemo(() => {
    return calculateProgressStats(
      filteredData,
      currentCompletedModulesCount,
      totalModulesCount,
      currentCompletedLessonsCount
    );
  }, [filteredData, currentCompletedModulesCount, totalModulesCount, currentCompletedLessonsCount]);

  // Custom Dark Tooltip
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DayProgressPoint = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md min-w-[210px] text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-indigo-400" />
              {data.fullDate}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Dzień {data.dayIndex}/30</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-400 inline-block" />
                Ukończone moduły:
              </span>
              <span className="font-bold text-cyan-300 font-mono">
                {data.completedModules} <span className="text-slate-500 font-normal">/ {data.totalModules}</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block" />
                Cel programu:
              </span>
              <span className="font-bold text-indigo-300 font-mono">
                {data.totalModules} modułów
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                Zaliczone lekcje:
              </span>
              <span className="font-bold text-emerald-400 font-mono">
                {data.completedLessons} lekcji
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Postęp programu:</span>
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-mono">
                {data.progressPercent}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 sm:p-7 space-y-6 shadow-xl backdrop-blur-sm overflow-hidden">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <TrendingUp className="h-4 w-4" />
            <span>Wizualizacja Postępów w Nauce</span>
            <span>•</span>
            <span>Ostatnie 30 dni</span>
          </div>
          <h2 className="mt-1 text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Ukończone Moduły vs Cel Programu</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Śledź swoje tempo przechodzenia kolejnych modułów technologicznych w relacji do całego 15-modułowego programu nauczania.
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Mode toggle */}
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setChartMode('modules')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                chartMode === 'modules'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Moduły
            </button>
            <button
              type="button"
              onClick={() => setChartMode('detailed')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                chartMode === 'detailed'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Szczegółowy
            </button>
          </div>

          {/* Time range switcher */}
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
            {(['7', '14', '30'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-slate-800 text-indigo-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-800/90 bg-slate-950/70 p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium truncate">Ukończone moduły</span>
            <BookCheck className="h-4 w-4 text-cyan-400 shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white font-mono">{stats.currentCompletedModules}</span>
            <span className="text-xs text-slate-400 font-mono">/ {stats.totalModules}</span>
          </div>
          <p className="text-[11px] text-cyan-400 mt-1 font-medium truncate">
            {stats.completionPercent}% programu zrealizowane
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/90 bg-slate-950/70 p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium truncate">Pozostało modułów</span>
            <Target className="h-4 w-4 text-indigo-400 shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-indigo-200 font-mono">
              {stats.remainingModules}
            </span>
            <span className="text-xs text-slate-400 font-mono">modułów</span>
          </div>
          <p className="text-[11px] text-indigo-300 mt-1 font-medium truncate">
            Cel: Pełny Full Stack
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/90 bg-slate-950/70 p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium truncate">Przyrost ({timeRange}d)</span>
            <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              +{stats.modulesDelta}
            </span>
            <span className="text-xs text-slate-400 font-mono">modułów</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            oraz +{stats.lessonsDelta} lekcji
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/90 bg-slate-950/70 p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium truncate">Aktywne lekcje</span>
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
              {stats.currentCompletedLessons}
            </span>
            <span className="text-xs text-slate-400 font-mono">ukończonych</span>
          </div>
          <p className="text-[11px] text-amber-400/90 mt-1 font-medium truncate">
            Seria: {currentUser.streakDays} dni nauki
          </p>
        </div>
      </div>

      {/* Main Responsive Recharts Container */}
      <div className="w-full relative bg-slate-950/80 rounded-2xl border border-slate-800/80 p-3 sm:p-5">
        {/* Custom Legend / Metric Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-4 px-1">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-md bg-gradient-to-r from-cyan-500 to-indigo-500 border border-cyan-400/50 shadow-sm shadow-cyan-500/30" />
              <span className="text-slate-200 font-medium">Ukończone moduły (aktualnie: {stats.currentCompletedModules})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-4 bg-indigo-400/80 border-t-2 border-dashed border-indigo-400" />
              <span className="text-slate-400">Cel programu ({stats.totalModules} modułów)</span>
            </div>
            {chartMode === 'detailed' && (
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 font-medium">Zaliczone lekcje</span>
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
            <Info className="h-3.5 w-3.5 text-indigo-400" />
            <span>Najedź na punkt, aby zobaczyć szczegóły dnia</span>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-64 sm:h-80 -ml-2 sm:ml-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 15, right: 15, left: -15, bottom: 0 }}
            >
              <defs>
                {/* Modules Completed Gradient Fill */}
                <linearGradient id="completedModulesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45} />
                  <stop offset="60%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>

                {/* Lessons Gradient Fill for Detailed Mode */}
                <linearGradient id="lessonsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
              />

              <XAxis
                dataKey="displayDate"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                interval={timeRange === '30' ? 4 : timeRange === '14' ? 2 : 0}
              />

              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                domain={[0, chartMode === 'detailed' ? Math.max(stats.totalModules, stats.currentCompletedLessons + 2) : stats.totalModules]}
                allowDecimals={false}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Reference line showing curriculum target (15 modules) */}
              <ReferenceLine
                y={stats.totalModules}
                stroke="#6366f1"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Cel: ${stats.totalModules} modułów`,
                  position: 'insideTopRight',
                  fill: '#818cf8',
                  fontSize: 10,
                  fontWeight: 600
                }}
              />

              {/* Detailed lessons area if mode is active */}
              {chartMode === 'detailed' && (
                <Area
                  type="monotone"
                  dataKey="completedLessons"
                  name="Ukończone lekcje"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#lessonsGradient)"
                />
              )}

              {/* Total modules guide line */}
              <Line
                type="stepAfter"
                dataKey="totalModules"
                name="Wszystkie moduły"
                stroke="#475569"
                strokeDasharray="5 5"
                strokeWidth={1.5}
                dot={false}
                activeDot={false}
              />

              {/* Primary area: Modules completed over 30 days */}
              <Area
                type="monotone"
                dataKey="completedModules"
                name="Ukończone moduły"
                stroke="#22d3ee"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#completedModulesGradient)"
                activeDot={{
                  r: 6,
                  fill: '#22d3ee',
                  stroke: '#0f172a',
                  strokeWidth: 2,
                  className: 'shadow-lg shadow-cyan-500/50',
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Mobile touch hint */}
        <p className="mt-2 text-center text-[10px] text-slate-500 sm:hidden">
          Dotknij wykresu, aby sprawdzić dane dla wybranego dnia
        </p>
      </div>

      {/* Curriculum Milestones Progress Bar & Footnote */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span className="font-semibold">Kamienie milowe programu:</span>
            <span className="text-slate-400">
              {stats.currentCompletedModules} z {stats.totalModules} modułów ukończonych
            </span>
          </div>
          <span className="font-mono text-cyan-400 font-bold self-end sm:self-auto">
            {stats.completionPercent}% zrealizowano
          </span>
        </div>

        {/* Visual segmented step bar */}
        <div className="grid grid-cols-5 sm:grid-cols-15 gap-1.5 h-3">
          {Array.from({ length: stats.totalModules }).map((_, idx) => {
            const isCompleted = idx < stats.currentCompletedModules;
            const isCurrent = idx === stats.currentCompletedModules;
            return (
              <div
                key={idx}
                title={`Moduł ${idx + 1}`}
                className={`h-full rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-sm shadow-cyan-500/30'
                    : isCurrent
                    ? 'bg-indigo-900 border border-indigo-400 animate-pulse'
                    : 'bg-slate-800'
                }`}
              />
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-400 pt-1 gap-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>
              Wykres aktualizuje się w czasie rzeczywistym po ukończeniu lekcji i modułów w kursie.
            </span>
          </div>
          <span className="text-slate-500">
            Pełny kurs: 15 modułów • 75+ lekcji • 12 projektów
          </span>
        </div>
      </div>
    </div>
  );
};
