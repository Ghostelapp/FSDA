import React, { useMemo, useState } from 'react';
import {
  Activity,
  Clock,
  Download,
  ExternalLink,
  Eye,
  Globe,
  Languages,
  Monitor,
  Radio,
  RefreshCw,
  Search,
  ShieldAlert,
  Smartphone,
  Tablet,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  VisitorDeviceType,
  VisitorEventRecord,
  VisitorPresenceRecord,
  VisitorTimeframe,
} from '../types';
import {
  aggregateVisitorAnalytics,
  exportVisitorAnalyticsCsv,
  formatReadablePathLabel,
  formatTrafficSourceLabel,
} from '../utils/visitorAnalytics';

interface VisitorTrafficPanelProps {
  language: 'pl' | 'en';
  events: VisitorEventRecord[];
  presences: VisitorPresenceRecord[];
  isLoading: boolean;
  isLiveSubscribed: boolean;
  onToggleLive: () => void;
  onRefresh: () => void;
  onClearAll: () => Promise<void>;
  lastSyncedAtMs: number | null;
  errorMessage: string | null;
}

export const VisitorTrafficPanel: React.FC<VisitorTrafficPanelProps> = ({
  language,
  events,
  presences,
  isLoading,
  isLiveSubscribed,
  onToggleLive,
  onRefresh,
  onClearAll,
  lastSyncedAtMs,
  errorMessage,
}) => {
  const isEn = language === 'en';
  const [timeframe, setTimeframe] = useState<VisitorTimeframe>('7d');
  const [searchFilter, setSearchFilter] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const nowMs = useMemo(() => Date.now(), [events, presences, timeframe, lastSyncedAtMs]);

  const summary = useMemo(
    () =>
      aggregateVisitorAnalytics(
        events,
        presences,
        nowMs,
        timeframe,
        searchFilter,
        language
      ),
    [events, presences, nowMs, timeframe, searchFilter, language]
  );

  const handleExportCsv = () => {
    const csv = exportVisitorAnalyticsCsv(events);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fsda_visitor_analytics_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleConfirmClear = async () => {
    setIsClearing(true);
    try {
      await onClearAll();
      setConfirmClear(false);
    } finally {
      setIsClearing(false);
    }
  };

  const formatTimeAgo = (tsMs: number): string => {
    const diffSec = Math.max(0, Math.round((nowMs - tsMs) / 1000));
    if (diffSec < 60) return isEn ? `${diffSec}s ago` : `${diffSec}s temu`;
    const diffMin = Math.round(diffSec / 60);
    if (diffMin < 60) return isEn ? `${diffMin}m ago` : `${diffMin}m temu`;
    const diffHours = Math.round(diffMin / 60);
    if (diffHours < 24) return isEn ? `${diffHours}h ago` : `${diffHours}h temu`;
    return new Date(tsMs).toLocaleDateString(isEn ? 'en-US' : 'pl-PL');
  };

  const renderDeviceIcon = (device: VisitorDeviceType) => {
    if (device === 'mobile') return <Smartphone className="h-3.5 w-3.5 text-cyan-400" />;
    if (device === 'tablet') return <Tablet className="h-3.5 w-3.5 text-indigo-400" />;
    return <Monitor className="h-3.5 w-3.5 text-emerald-400" />;
  };

  const totalDeviceHits =
    summary.devices.desktop + summary.devices.mobile + summary.devices.tablet;
  const totalLangHits = summary.languages.pl + summary.languages.en;
  const totalSessionTypeHits = summary.authenticatedCount + summary.guestCount;

  return (
    <div className="space-y-6" data-testid="visitor-traffic-panel">
      {/* Header & Controls Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Activity className="h-4 w-4" />
              <span>
                {isEn
                  ? 'Real-Time Firestore Visitor Telemetry (No PII)'
                  : 'Prawdziwa Telemetria Odwiedzin w Firestore (Bez PII / RODO)'}
              </span>
            </div>
            <h2 className="mt-1 text-lg sm:text-xl font-extrabold text-white">
              {isEn
                ? 'Traffic, Unique Visitors, Referrers & Popular Lessons'
                : 'Ruch na stronie, Unikalni Użytkownicy, Źródła (Wykop / Google) i Popularne Lekcje'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lastSyncedAtMs
                ? isEn
                  ? `Last synced from Firestore: ${new Date(lastSyncedAtMs).toLocaleTimeString('en-US')} • Showing real database records.`
                  : `Ostatnia synchronizacja z Firestore: ${new Date(lastSyncedAtMs).toLocaleTimeString('pl-PL')} • Dane pochodzą bezpośrednio z bazy zdarzeń.`
                : isEn
                ? 'Connecting to Firestore analytics collections...'
                : 'Łączenie z kolekcjami analitycznymi Firestore...'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Timeframe switcher */}
            <div className="inline-flex rounded-xl border border-slate-800 bg-slate-950 p-1">
              {(['24h', '7d', '30d'] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    timeframe === tf
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf === '24h' ? '24h' : tf === '7d' ? (isEn ? '7 days' : '7 dni') : isEn ? '30 days' : '30 dni'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onToggleLive}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                isLiveSubscribed
                  ? 'border-emerald-500/40 bg-emerald-950/50 text-emerald-300'
                  : 'border-slate-700 bg-slate-950 text-slate-300 hover:text-white'
              }`}
            >
              <Radio className={`h-3.5 w-3.5 ${isLiveSubscribed ? 'animate-pulse text-emerald-400' : ''}`} />
              <span>
                {isLiveSubscribed
                  ? isEn ? 'Live Sync ON' : 'Na żywo: WŁ'
                  : isEn ? 'Live Sync PAUSED' : 'Na żywo: PAUZA'}
              </span>
            </button>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isEn ? 'Refresh' : 'Odśwież'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={events.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5 text-indigo-400" />
              <span>CSV</span>
            </button>

            {events.length > 0 && !confirmClear && (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{isEn ? 'Clear logs' : 'Wyczyść'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter bar & optional inline delete confirmation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <label htmlFor="traffic-search" className="sr-only">
              {isEn ? 'Filter by path or traffic source' : 'Filtruj po ścieżce URL lub źródle ruchu'}
            </label>
            <input
              id="traffic-search"
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={
                isEn
                  ? 'Filter by path, lesson ID, Wykop, Google, UTM...'
                  : 'Filtruj po ścieżce, ID lekcji, wykop.pl, google, UTM...'
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-8 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                aria-label={isEn ? 'Clear search filter' : 'Wyczyść filtr'}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {confirmClear && (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-950/70 px-3 py-2 text-xs">
              <span className="text-rose-200 font-semibold">
                {isEn
                  ? `Delete all ${events.length} tracked events from Firestore?`
                  : `Usunąć wszystkie ${events.length} zapisanych zdarzeń z Firestore?`}
              </span>
              <button
                type="button"
                disabled={isClearing}
                onClick={() => void handleConfirmClear()}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer disabled:opacity-50"
              >
                {isClearing ? (isEn ? 'Deleting...' : 'Usuwanie...') : (isEn ? 'Confirm delete' : 'Potwierdź usunięcie')}
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                {isEn ? 'Cancel' : 'Anuluj'}
              </button>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-950/50 p-3.5 text-xs text-rose-200 flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{isEn ? 'Firestore analytics read issue:' : 'Błąd odczytu statystyk z Firestore:'}</p>
              <p className="text-rose-300/90 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* 5 Top Real KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isEn ? 'Online Now' : 'Online Teraz'}</span>
            <span className={`h-2.5 w-2.5 rounded-full ${summary.onlineNowCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-300">{summary.onlineNowCount}</p>
          <p className="mt-1 text-[11px] text-slate-400">
            {isEn ? 'Active tabs (last 3 min)' : 'Aktywne karty (ost. 3 min)'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isEn ? 'Today Views' : 'Odsłony Dzisiaj'}</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-white">{summary.todayPageviews}</p>
          <p className="mt-1 text-[11px] text-cyan-400 font-semibold">
            {summary.todayUniqueVisitors} {isEn ? 'unique today' : 'unikalnych dziś'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isEn ? `Pageviews (${timeframe})` : `Odsłony (${timeframe})`}</span>
            <Eye className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-indigo-300">{summary.totalPageviews}</p>
          <p className="mt-1 text-[11px] text-slate-400">
            {isEn ? 'Recorded route hits' : 'Zarejestrowane wejścia'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isEn ? 'Unique Visitors' : 'Unikalni Użytkownicy'}</span>
            <Users className="h-4 w-4 text-violet-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-white">{summary.uniqueVisitors}</p>
          <p className="mt-1 text-[11px] text-slate-400">
            {isEn ? 'Anonymous visitor tokens' : 'Anonimowe tokeny przeglądarek'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isEn ? 'Sessions & Depth' : 'Sesje i Głębokość'}</span>
            <Globe className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-300">{summary.uniqueSessions}</p>
          <p className="mt-1 text-[11px] text-slate-400">
            {summary.avgPagesPerSession} {isEn ? 'pages / session' : 'stron / sesję'}
          </p>
        </div>
      </div>

      {/* Traffic Time-Series Chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white">
              {timeframe === '24h'
                ? isEn ? 'Hourly Visits & Unique Visitors (Last 24h)' : 'Ruch godzinowy: Odsłony vs Unikalni (Ostatnie 24h)'
                : isEn ? `Daily Visits & Unique Visitors (${timeframe})` : `Ruch dzienny: Odsłony vs Unikalni (${timeframe})`}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isEn
                ? 'Calculated directly from Firestore visitor_events documents.'
                : 'Wykres generowany na żywo z rzeczywistych dokumentów w kolekcji visitor_events.'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
              {isEn ? 'Pageviews' : 'Odsłony'}
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="h-2.5 w-2.5 rounded-sm bg-cyan-400" />
              {isEn ? 'Unique Visitors' : 'Unikalni'}
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={summary.dailySeries} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="fsdaViewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="fsdaUniqueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Area
                type="monotone"
                dataKey="pageviews"
                name={isEn ? 'Pageviews' : 'Odsłony'}
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#fsdaViewsGrad)"
              />
              <Area
                type="monotone"
                dataKey="uniqueVisitors"
                name={isEn ? 'Unique Visitors' : 'Unikalni'}
                stroke="#22d3ee"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#fsdaUniqueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sources & Popular Pages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-cyan-400" />
              <span>{isEn ? 'Traffic Sources & Referrers (Wykop, Google, Direct)' : 'Źródła Ruchu i Referrery (Wykop, Google, Direct)'}</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {summary.topSources.length} {isEn ? 'sources' : 'źródeł'}
            </span>
          </div>

          {summary.topSources.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">
              {isEn ? 'No referral data recorded in this timeframe yet.' : 'Brak zarejestrowanych wejść w wybranym okresie.'}
            </p>
          ) : (
            <div className="space-y-2.5">
              {summary.topSources.map((src) => {
                const label = formatTrafficSourceLabel(src.sourceKey, src.utmSource, language);
                return (
                  <div key={`${src.sourceKey}-${src.utmSource}`} className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-white truncate">{label}</span>
                        {src.utmSource !== 'none' && (
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                            utm:{src.utmSource}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-slate-300 shrink-0">
                        {src.visits} ({src.sharePercent}%) · {src.uniqueVisitors} {isEn ? 'uniq' : 'unikal.'}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full transition-all"
                        style={{ width: `${Math.max(4, src.sharePercent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Most Visited Pages & Lessons */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="h-4 w-4 text-indigo-400" />
              <span>{isEn ? 'Top Visited Pages & Knowledge Base Lessons' : 'Najpopularniejsze Strony i Lekcje'}</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {summary.topPages.length} {isEn ? 'routes' : 'adresów'}
            </span>
          </div>

          {summary.topPages.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">
              {isEn ? 'No pageviews recorded in this timeframe yet.' : 'Brak odwiedzonych podstron w wybranym okresie.'}
            </p>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {summary.topPages.map((pg) => (
                <div key={pg.path} className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">
                        {formatReadablePathLabel(pg.path, pg.tab, language)}
                      </p>
                      <p className="font-mono text-[10px] text-slate-400 truncate">{pg.path}</p>
                    </div>
                    <span className="font-mono text-indigo-300 font-semibold shrink-0">
                      {pg.views} ({pg.sharePercent}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${Math.max(4, pg.sharePercent)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3 Audience Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Devices */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Monitor className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isEn ? 'Devices' : 'Urządzenia'}</span>
          </h4>
          {(['desktop', 'mobile', 'tablet'] as const).map((dev) => {
            const count = summary.devices[dev];
            const pct = totalDeviceHits > 0 ? Math.round((count / totalDeviceHits) * 100) : 0;
            return (
              <div key={dev} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-200 capitalize font-medium">
                    {renderDeviceIcon(dev)}
                    {dev === 'desktop' ? 'Desktop' : dev === 'mobile' ? 'Mobile' : 'Tablet'}
                  </span>
                  <span className="font-mono text-slate-300">{count} ({pct}%)</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Languages */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Languages className="h-3.5 w-3.5 text-cyan-400" />
            <span>{isEn ? 'Interface Language' : 'Język Interfejsu'}</span>
          </h4>
          {(['pl', 'en'] as const).map((lang) => {
            const count = summary.languages[lang];
            const pct = totalLangHits > 0 ? Math.round((count / totalLangHits) * 100) : 0;
            return (
              <div key={lang} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-medium">
                    {lang === 'pl' ? 'Polski (PL)' : 'English (EN)'}
                  </span>
                  <span className="font-mono text-slate-300">{count} ({pct}%)</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Guests vs Authenticated */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <UserCheck className="h-3.5 w-3.5 text-indigo-400" />
            <span>{isEn ? 'Session Type' : 'Typ Sesji'}</span>
          </h4>
          {[
            { label: isEn ? 'Signed-out Guests' : 'Goście (Niezalogowani)', count: summary.guestCount, color: 'bg-amber-500' },
            { label: isEn ? 'Signed-in Students' : 'Zalogowani Użytkownicy', count: summary.authenticatedCount, color: 'bg-indigo-500' },
          ].map((row) => {
            const pct = totalSessionTypeHits > 0 ? Math.round((row.count / totalSessionTypeHits) * 100) : 0;
            return (
              <div key={row.label} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-medium">{row.label}</span>
                  <span className="font-mono text-slate-300">{row.count} ({pct}%)</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${row.color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Online Presence & Recent Visits Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Tabs Online Now */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="h-4 w-4 text-emerald-400" />
              <span>{isEn ? `Active Visitors Online Now (${summary.onlineNowCount})` : `Aktywni Odwiedzający Teraz (${summary.onlineNowCount})`}</span>
            </h3>
            <span className="text-[11px] text-slate-400">{isEn ? 'Heartbeat < 3m' : 'Sygnał < 3 min'}</span>
          </div>

          {summary.activePresenceList.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">
              {isEn ? 'No other active visitor tabs detected right now.' : 'Brak aktywnych kart innych odwiedzających w tej chwili.'}
            </p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {summary.activePresenceList.map((pres) => (
                <div
                  key={pres.sessionId}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {renderDeviceIcon(pres.deviceType)}
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{pres.path}</p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {formatTrafficSourceLabel(pres.referrerHost, 'none', language)} · {pres.language.toUpperCase()} ·{' '}
                        {pres.isAuthenticated ? (isEn ? 'Signed-in' : 'Zalogowany') : (isEn ? 'Guest' : 'Gość')}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-400 shrink-0">
                    {formatTimeAgo(pres.lastSeenMs)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Pageview Log */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>{isEn ? 'Recent Visit Stream' : 'Ostatnie Wizyty na Żywo'}</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              {isEn ? `Latest ${summary.recentVisits.length}` : `Ostatnie ${summary.recentVisits.length}`}
            </span>
          </div>

          {summary.recentVisits.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">
              {isEn ? 'Waiting for the first recorded pageviews in Firestore.' : 'Oczekiwanie na pierwsze zapisane odsłony w bazie Firestore.'}
            </p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {summary.recentVisits.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {renderDeviceIcon(ev.deviceType)}
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{ev.path}</p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {formatTrafficSourceLabel(ev.referrerHost, ev.utmSource, language)} · {ev.language.toUpperCase()} ·{' '}
                        {ev.isAuthenticated ? (isEn ? 'Signed-in' : 'Zalogowany') : (isEn ? 'Guest' : 'Gość')}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 shrink-0">
                    {new Date(ev.createdAtMs).toLocaleTimeString(isEn ? 'en-US' : 'pl-PL', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
