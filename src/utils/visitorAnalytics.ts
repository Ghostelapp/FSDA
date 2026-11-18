import {
  Module,
  User,
  VisitorAnalyticsSummary,
  VisitorDeviceType,
  VisitorEventRecord,
  VisitorPageStat,
  VisitorPresenceRecord,
  VisitorSourceStat,
  VisitorTimeframe,
  VisitorTimeSeriesPoint,
} from '../types';

export const VISITOR_ID_STORAGE_KEY = 'fsda_visitor_id_v1';
export const VISITOR_SESSION_STORAGE_KEY = 'fsda_session_id_v1';
export const VISITOR_REFERRER_STORAGE_KEY = 'fsda_session_referrer_v1';
export const VISITOR_UTM_STORAGE_KEY = 'fsda_session_utm_v1';
export const ONLINE_PRESENCE_TTL_MS = 3 * 60 * 1000;

const SAFE_TOKEN_RE = /^[a-zA-Z0-9_-]{8,128}$/;

export function isValidTelemetryToken(token: unknown): token is string {
  return typeof token === 'string' && SAFE_TOKEN_RE.test(token);
}

export function generateSafeTelemetryId(prefix = 'v'): string {
  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 12) || 'v';
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
    const raw = globalThis.crypto.randomUUID().replace(/-/g, '');
    return `${cleanPrefix}_${raw}`.slice(0, 64);
  }
  const timePart = Date.now().toString(36);
  const randA = Math.random().toString(36).slice(2, 10);
  const randB = Math.random().toString(36).slice(2, 10);
  return `${cleanPrefix}_${timePart}${randA}${randB}`.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
}

export function formatCalendarDateKey(date: Date = new Date()): string {
  const year = Math.min(2099, Math.max(2020, date.getFullYear()));
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function normalizeVisitedPath(pathname: string, search = ''): string {
  const rawWithoutHash = (pathname || '/').trim().split('#')[0] || '/';
  const [rawPathPart, inlineSearchPart] = rawWithoutHash.split('?');
  let cleanPath = rawPathPart || '/';
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`;
  }
  cleanPath = cleanPath.replace(/\/+/g, '/');
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }
  const resolvedSearch = search || (inlineSearchPart ? `?${inlineSearchPart}` : '');

  let preservedQuery = '';
  if (resolvedSearch) {
    try {
      const cleanSearch = resolvedSearch.split('#')[0] || '';
      const params = new URLSearchParams(cleanSearch.startsWith('?') ? cleanSearch : `?${cleanSearch}`);
      const kept = new URLSearchParams();
      for (const key of ['tab', 'promo', 'utm_source']) {
        const val = params.get(key);
        if (val) kept.set(key, val.slice(0, 40));
      }
      const qStr = kept.toString();
      if (qStr) {
        preservedQuery = `?${qStr}`;
      }
    } catch {
      // ignore invalid search params
    }
  }

  const combined = `${cleanPath}${preservedQuery}`.replace(/[^a-zA-Z0-9_/?=&.%-]/g, '');
  if (!combined.startsWith('/')) return '/';
  return combined.slice(0, 160) || '/';
}

export function normalizeTabIdentifier(tab: string): string {
  const clean = (tab || 'landing')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 40);
  return clean || 'landing';
}

export function normalizeReferrerHost(referrerUrl: string, currentHost = ''): string {
  const trimmed = (referrerUrl || '').trim();
  if (!trimmed) return 'direct';
  try {
    const parsed = new URL(trimmed);
    const refHost = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const ownHost = (currentHost || '').toLowerCase().replace(/^www\./, '');
    if (!refHost || (ownHost && refHost === ownHost)) {
      return 'direct';
    }
    const safeHost = refHost.replace(/[^a-z0-9.-]/g, '').slice(0, 120);
    return safeHost || 'direct';
  } catch {
    const fallback = trimmed
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .split(':')[0]
      .replace(/[^a-z0-9.-]/g, '')
      .slice(0, 120);
    const ownHost = (currentHost || '').toLowerCase().replace(/^www\./, '');
    if (!fallback || (ownHost && fallback === ownHost)) {
      return 'direct';
    }
    return fallback;
  }
}

export function extractUtmSource(search: string): string {
  if (!search) return 'none';
  try {
    const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
    const raw = params.get('utm_source') || params.get('ref') || '';
    const cleaned = raw.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 80);
    return cleaned || 'none';
  } catch {
    return 'none';
  }
}

export function detectDeviceType(viewportWidth?: number, userAgent = ''): VisitorDeviceType {
  const ua = (userAgent || '').toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) {
    return 'tablet';
  }
  if (/mobi|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua)) {
    return 'mobile';
  }
  if (typeof viewportWidth === 'number' && viewportWidth > 0) {
    if (viewportWidth < 768) return 'mobile';
    if (viewportWidth <= 1024) return 'tablet';
  }
  return 'desktop';
}

export function shouldDeduplicatePageview(
  lastVisitKey: string | null,
  nextVisitKey: string,
  lastVisitAtMs: number,
  nowMs: number,
  windowMs = 4000
): boolean {
  if (!lastVisitKey || lastVisitAtMs <= 0) return false;
  return lastVisitKey === nextVisitKey && nowMs - lastVisitAtMs < windowMs;
}

export interface VisitorEventWritePayload {
  id: string;
  visitorId: string;
  sessionId: string;
  dateKey: string;
  path: string;
  tab: string;
  referrerHost: string;
  utmSource: string;
  deviceType: VisitorDeviceType;
  language: 'pl' | 'en';
  isAuthenticated: boolean;
}

export interface VisitorPresenceWritePayload {
  sessionId: string;
  visitorId: string;
  path: string;
  tab: string;
  referrerHost: string;
  deviceType: VisitorDeviceType;
  language: 'pl' | 'en';
  isAuthenticated: boolean;
}

export function buildVisitorEventWritePayload(input: {
  id?: string;
  visitorId: string;
  sessionId: string;
  date?: Date;
  pathname: string;
  search?: string;
  tab: string;
  referrerHost: string;
  utmSource?: string;
  deviceType: VisitorDeviceType;
  language: 'pl' | 'en';
  isAuthenticated: boolean;
}): VisitorEventWritePayload {
  const id = isValidTelemetryToken(input.id) ? input.id : generateSafeTelemetryId('ev');
  const visitorId = isValidTelemetryToken(input.visitorId)
    ? input.visitorId
    : generateSafeTelemetryId('vis');
  const sessionId = isValidTelemetryToken(input.sessionId)
    ? input.sessionId
    : generateSafeTelemetryId('ses');

  return {
    id,
    visitorId,
    sessionId,
    dateKey: formatCalendarDateKey(input.date || new Date()),
    path: normalizeVisitedPath(input.pathname, input.search || ''),
    tab: normalizeTabIdentifier(input.tab),
    referrerHost: (input.referrerHost || 'direct').trim().slice(0, 120) || 'direct',
    utmSource: (input.utmSource || 'none').trim().slice(0, 80) || 'none',
    deviceType: input.deviceType,
    language: input.language === 'en' ? 'en' : 'pl',
    isAuthenticated: Boolean(input.isAuthenticated),
  };
}

export function buildVisitorPresenceWritePayload(input: {
  sessionId: string;
  visitorId: string;
  pathname: string;
  search?: string;
  tab: string;
  referrerHost: string;
  deviceType: VisitorDeviceType;
  language: 'pl' | 'en';
  isAuthenticated: boolean;
}): VisitorPresenceWritePayload {
  const visitorId = isValidTelemetryToken(input.visitorId)
    ? input.visitorId
    : generateSafeTelemetryId('vis');
  const sessionId = isValidTelemetryToken(input.sessionId)
    ? input.sessionId
    : generateSafeTelemetryId('ses');

  return {
    sessionId,
    visitorId,
    path: normalizeVisitedPath(input.pathname, input.search || ''),
    tab: normalizeTabIdentifier(input.tab),
    referrerHost: (input.referrerHost || 'direct').trim().slice(0, 120) || 'direct',
    deviceType: input.deviceType,
    language: input.language === 'en' ? 'en' : 'pl',
    isAuthenticated: Boolean(input.isAuthenticated),
  };
}

export function formatTrafficSourceLabel(
  referrerHost: string,
  utmSource = 'none',
  language: 'pl' | 'en' = 'pl'
): string {
  const ref = (referrerHost || 'direct').toLowerCase();
  const utm = (utmSource || 'none').toLowerCase();

  if (ref.includes('wykop.pl') || utm === 'wykop') return 'Wykop.pl';
  if (ref.includes('google.')) return 'Google Search';
  if (ref.includes('bing.com')) return 'Bing Search';
  if (ref.includes('duckduckgo.com')) return 'DuckDuckGo';
  if (ref.includes('facebook.com') || ref.includes('fb.com')) return 'Facebook';
  if (ref === 't.co' || ref.includes('twitter.com') || ref.includes('x.com')) return 'X (Twitter)';
  if (ref.includes('linkedin.com') || ref === 'lnkd.in') return 'LinkedIn';
  if (ref.includes('github.com')) return 'GitHub';
  if (ref.includes('youtube.com') || ref === 'youtu.be') return 'YouTube';
  if (ref.includes('reddit.com')) return 'Reddit';
  if (ref.includes('discord.com') || ref === 'discord.gg') return 'Discord';
  if (ref === 'direct' || !ref) {
    if (utm !== 'none') return `Campaign: ${utm}`;
    return language === 'en' ? 'Direct / Bookmark' : 'Bezpośrednie (Direct)';
  }
  return ref;
}

export function formatReadablePathLabel(
  path: string,
  tab: string,
  language: 'pl' | 'en' = 'pl'
): string {
  const isEn = language === 'en';
  if (path === '/') return isEn ? 'Landing Page (/)' : 'Strona Główna (/)';
  if (path === '/baza-wiedzy') return isEn ? 'Knowledge Base Index (/baza-wiedzy)' : 'Baza Wiedzy — Katalog (/baza-wiedzy)';
  if (path.startsWith('/baza-wiedzy/')) {
    const id = path.replace('/baza-wiedzy/', '');
    return isEn ? `Lesson Article: ${id}` : `Lekcja Bazy Wiedzy: ${id}`;
  }
  if (path === '/o-nas') return isEn ? 'About Academy (/o-nas)' : 'O Akademii (/o-nas)';
  if (path === '/kontakt') return isEn ? 'Contact (/kontakt)' : 'Kontakt (/kontakt)';
  if (path === '/regulamin') return isEn ? 'Terms (/regulamin)' : 'Regulamin (/regulamin)';
  if (path === '/polityka-prywatnosci') return isEn ? 'Privacy Policy (/polityka-prywatnosci)' : 'Polityka Prywatności';
  if (path.startsWith('/app') || tab !== 'landing') {
    const labels: Record<string, string> = {
      dashboard: isEn ? 'Student Dashboard' : 'Pulpit Kursanta',
      modules: isEn ? 'Course Modules (15)' : 'Moduły Kursu (15)',
      lesson: isEn ? 'Interactive Lesson' : 'Lekcja Interaktywna',
      editor: isEn ? 'Code Sandbox IDE' : 'Edytor Kodu Sandbox',
      projects: isEn ? 'Portfolio Projects' : 'Projekty Portfolio',
      terminal: isEn ? 'Terminal Simulator' : 'Symulator Terminala',
      sql_studio: 'SQL Studio',
      api_studio: 'API & HTTP Studio',
      event_loop: 'JS Event Loop Visualizer',
      interview: isEn ? 'AI/Tech Mock Interview' : 'Symulator Rozmowy Tech',
      flashcards: isEn ? 'Flashcards' : 'Fiszki i Ściągi',
      admin: isEn ? 'Admin Console' : 'Panel Administratora',
    };
    return labels[tab] ? `${labels[tab]} (${path})` : path;
  }
  return path;
}

function getTimeframeStartMs(nowMs: number, timeframe: VisitorTimeframe): number {
  const hourMs = 60 * 60 * 1000;
  const dayMs = 24 * hourMs;
  if (timeframe === '24h') return nowMs - 24 * hourMs;
  if (timeframe === '7d') return nowMs - 7 * dayMs;
  return nowMs - 30 * dayMs;
}

function buildDailyOrHourlyBuckets(
  events: VisitorEventRecord[],
  nowMs: number,
  timeframe: VisitorTimeframe,
  language: 'pl' | 'en'
): VisitorTimeSeriesPoint[] {
  const points: VisitorTimeSeriesPoint[] = [];
  const bucketMap = new Map<string, { pageviews: number; visitors: Set<string>; sessions: Set<string> }>();

  if (timeframe === '24h') {
    const endHour = new Date(nowMs);
    endHour.setMinutes(0, 0, 0);
    for (let i = 23; i >= 0; i--) {
      const slot = new Date(endHour.getTime() - i * 60 * 60 * 1000);
      const key = `${formatCalendarDateKey(slot)}-${String(slot.getHours()).padStart(2, '0')}`;
      const label = `${String(slot.getHours()).padStart(2, '0')}:00`;
      bucketMap.set(key, { pageviews: 0, visitors: new Set(), sessions: new Set() });
      points.push({ key, label, pageviews: 0, uniqueVisitors: 0, sessions: 0 });
    }
    for (const ev of events) {
      const d = new Date(ev.createdAtMs);
      const key = `${formatCalendarDateKey(d)}-${String(d.getHours()).padStart(2, '0')}`;
      const entry = bucketMap.get(key);
      if (entry) {
        entry.pageviews += 1;
        entry.visitors.add(ev.visitorId);
        entry.sessions.add(ev.sessionId);
      }
    }
  } else {
    const daysCount = timeframe === '7d' ? 7 : 30;
    const today = new Date(nowMs);
    today.setHours(0, 0, 0, 0);
    for (let i = daysCount - 1; i >= 0; i--) {
      const slot = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const key = formatCalendarDateKey(slot);
      const monthNamesPl = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
      const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const label =
        language === 'en'
          ? `${monthNamesEn[slot.getMonth()]} ${slot.getDate()}`
          : `${slot.getDate()} ${monthNamesPl[slot.getMonth()]}`;
      bucketMap.set(key, { pageviews: 0, visitors: new Set(), sessions: new Set() });
      points.push({ key, label, pageviews: 0, uniqueVisitors: 0, sessions: 0 });
    }
    for (const ev of events) {
      const entry = bucketMap.get(ev.dateKey);
      if (entry) {
        entry.pageviews += 1;
        entry.visitors.add(ev.visitorId);
        entry.sessions.add(ev.sessionId);
      }
    }
  }

  return points.map((pt) => {
    const bucket = bucketMap.get(pt.key);
    return {
      ...pt,
      pageviews: bucket?.pageviews || 0,
      uniqueVisitors: bucket?.visitors.size || 0,
      sessions: bucket?.sessions.size || 0,
    };
  });
}

export function aggregateVisitorAnalytics(
  events: VisitorEventRecord[],
  presences: VisitorPresenceRecord[],
  nowMs: number = Date.now(),
  timeframe: VisitorTimeframe = '7d',
  searchFilter = '',
  language: 'pl' | 'en' = 'pl'
): VisitorAnalyticsSummary {
  const startMs = getTimeframeStartMs(nowMs, timeframe);
  const query = searchFilter.trim().toLowerCase();
  const todayKey = formatCalendarDateKey(new Date(nowMs));

  // Filter by timeframe & optional query
  const windowEvents = events
    .filter((ev) => ev.createdAtMs >= startMs && ev.createdAtMs <= nowMs + 60_000)
    .filter((ev) => {
      if (!query) return true;
      return (
        ev.path.toLowerCase().includes(query) ||
        ev.tab.toLowerCase().includes(query) ||
        ev.referrerHost.toLowerCase().includes(query) ||
        ev.utmSource.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => b.createdAtMs - a.createdAtMs);

  const uniqueVisitorSet = new Set<string>();
  const uniqueSessionSet = new Set<string>();
  const todayVisitors = new Set<string>();
  let todayPageviews = 0;

  const devices: Record<VisitorDeviceType, number> = {
    desktop: 0,
    mobile: 0,
    tablet: 0,
  };
  const languages: Record<'pl' | 'en', number> = {
    pl: 0,
    en: 0,
  };
  let authenticatedCount = 0;
  let guestCount = 0;

  const pageBuckets = new Map<
    string,
    { path: string; tab: string; views: number; visitors: Set<string>; lastVisitedAtMs: number }
  >();
  const sourceBuckets = new Map<
    string,
    { sourceKey: string; utmSource: string; visits: number; visitors: Set<string> }
  >();

  for (const ev of windowEvents) {
    uniqueVisitorSet.add(ev.visitorId);
    uniqueSessionSet.add(ev.sessionId);

    if (ev.deviceType === 'mobile') devices.mobile += 1;
    else if (ev.deviceType === 'tablet') devices.tablet += 1;
    else devices.desktop += 1;

    if (ev.language === 'en') languages.en += 1;
    else languages.pl += 1;

    if (ev.isAuthenticated) authenticatedCount += 1;
    else guestCount += 1;

    const pageEntry = pageBuckets.get(ev.path);
    if (pageEntry) {
      pageEntry.views += 1;
      pageEntry.visitors.add(ev.visitorId);
      if (ev.createdAtMs > pageEntry.lastVisitedAtMs) {
        pageEntry.lastVisitedAtMs = ev.createdAtMs;
        pageEntry.tab = ev.tab;
      }
    } else {
      pageBuckets.set(ev.path, {
        path: ev.path,
        tab: ev.tab,
        views: 1,
        visitors: new Set([ev.visitorId]),
        lastVisitedAtMs: ev.createdAtMs,
      });
    }

    const sourceMapKey = `${ev.referrerHost}::${ev.utmSource}`;
    const sourceEntry = sourceBuckets.get(sourceMapKey);
    if (sourceEntry) {
      sourceEntry.visits += 1;
      sourceEntry.visitors.add(ev.visitorId);
    } else {
      sourceBuckets.set(sourceMapKey, {
        sourceKey: ev.referrerHost,
        utmSource: ev.utmSource,
        visits: 1,
        visitors: new Set([ev.visitorId]),
      });
    }
  }

  // Always compute Today KPIs accurately across all known events for todayKey
  for (const ev of events) {
    if (ev.dateKey === todayKey) {
      todayPageviews += 1;
      todayVisitors.add(ev.visitorId);
    }
  }

  const totalPageviews = windowEvents.length;
  const uniqueSessions = uniqueSessionSet.size;
  const avgPagesPerSession =
    uniqueSessions > 0 ? Math.round((totalPageviews / uniqueSessions) * 10) / 10 : 0;

  const topPages: VisitorPageStat[] = Array.from(pageBuckets.values())
    .map((p) => ({
      path: p.path,
      tab: p.tab,
      views: p.views,
      uniqueVisitors: p.visitors.size,
      sharePercent: totalPageviews > 0 ? Math.round((p.views / totalPageviews) * 100) : 0,
      lastVisitedAtMs: p.lastVisitedAtMs,
    }))
    .sort((a, b) => b.views - a.views || b.lastVisitedAtMs - a.lastVisitedAtMs)
    .slice(0, 20);

  const topSources: VisitorSourceStat[] = Array.from(sourceBuckets.values())
    .map((s) => ({
      sourceKey: s.sourceKey,
      utmSource: s.utmSource,
      visits: s.visits,
      uniqueVisitors: s.visitors.size,
      sharePercent: totalPageviews > 0 ? Math.round((s.visits / totalPageviews) * 100) : 0,
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 15);

  const activePresenceList = presences
    .filter((p) => nowMs - p.lastSeenMs <= ONLINE_PRESENCE_TTL_MS)
    .sort((a, b) => b.lastSeenMs - a.lastSeenMs);

  const onlineNowCount = activePresenceList.length;

  return {
    timeframe,
    totalPageviews,
    uniqueVisitors: uniqueVisitorSet.size,
    uniqueSessions,
    avgPagesPerSession,
    todayPageviews,
    todayUniqueVisitors: todayVisitors.size,
    onlineNowCount,
    activePresenceList,
    dailySeries: buildDailyOrHourlyBuckets(windowEvents, nowMs, timeframe, language),
    topPages,
    topSources,
    devices,
    languages,
    authenticatedCount,
    guestCount,
    recentVisits: windowEvents.slice(0, 40),
  };
}

export interface RealQuizAnalyticsRow {
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  attemptsCount: number;
  avgScorePercent: number;
  passRatePercent: number;
  lowestScorePercent: number;
}

export function aggregateRealQuizAnalytics(
  users: User[],
  modules: Module[]
): {
  rows: RealQuizAnalyticsRow[];
  totalQuizAttempts: number;
  overallAvgScorePercent: number;
} {
  const lessonMetaMap = new Map<string, { title: string; moduleTitle: string }>();
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      lessonMetaMap.set(lesson.id, { title: lesson.title, moduleTitle: mod.title });
    }
  }

  const statsMap = new Map<string, number[]>();
  let totalQuizAttempts = 0;
  let scoreSum = 0;

  for (const user of users) {
    const scores = user.quizScores || {};
    for (const [lessonId, rawScore] of Object.entries(scores)) {
      const score = Number(rawScore);
      if (!Number.isFinite(score)) continue;
      const clamped = Math.max(0, Math.min(100, Math.round(score)));
      const arr = statsMap.get(lessonId) || [];
      arr.push(clamped);
      statsMap.set(lessonId, arr);
      totalQuizAttempts += 1;
      scoreSum += clamped;
    }
  }

  const rows: RealQuizAnalyticsRow[] = Array.from(statsMap.entries())
    .map(([lessonId, scores]) => {
      const meta = lessonMetaMap.get(lessonId);
      const sum = scores.reduce((acc, s) => acc + s, 0);
      const passed = scores.filter((s) => s >= 80).length;
      return {
        lessonId,
        lessonTitle: meta?.title || lessonId,
        moduleTitle: meta?.moduleTitle || 'Full Stack Curriculum',
        attemptsCount: scores.length,
        avgScorePercent: Math.round(sum / scores.length),
        passRatePercent: Math.round((passed / scores.length) * 100),
        lowestScorePercent: Math.min(...scores),
      };
    })
    .sort((a, b) => a.avgScorePercent - b.avgScorePercent || b.attemptsCount - a.attemptsCount);

  return {
    rows,
    totalQuizAttempts,
    overallAvgScorePercent: totalQuizAttempts > 0 ? Math.round(scoreSum / totalQuizAttempts) : 0,
  };
}

export function exportVisitorAnalyticsCsv(events: VisitorEventRecord[]): string {
  const headers = [
    'id',
    'dateKey',
    'timestampIso',
    'path',
    'tab',
    'referrerHost',
    'utmSource',
    'deviceType',
    'language',
    'isAuthenticated',
    'visitorId',
    'sessionId',
  ];

  const rows = events.map((ev) => [
    ev.id,
    ev.dateKey,
    new Date(ev.createdAtMs).toISOString(),
    `"${ev.path.replace(/"/g, '""')}"`,
    ev.tab,
    `"${ev.referrerHost.replace(/"/g, '""')}"`,
    `"${ev.utmSource.replace(/"/g, '""')}"`,
    ev.deviceType,
    ev.language,
    ev.isAuthenticated ? 'true' : 'false',
    ev.visitorId,
    ev.sessionId,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
