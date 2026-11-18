import test from 'node:test';
import assert from 'node:assert/strict';
import {
  aggregateRealQuizAnalytics,
  aggregateVisitorAnalytics,
  buildVisitorEventWritePayload,
  buildVisitorPresenceWritePayload,
  detectDeviceType,
  exportVisitorAnalyticsCsv,
  extractUtmSource,
  formatCalendarDateKey,
  formatTrafficSourceLabel,
  generateSafeTelemetryId,
  isValidTelemetryToken,
  normalizeReferrerHost,
  normalizeVisitedPath,
  shouldDeduplicatePageview,
} from './visitorAnalytics';
import { Module, User, VisitorEventRecord, VisitorPresenceRecord } from '../types';

test('generateSafeTelemetryId produces Firestore-rule compliant tokens', () => {
  const evId = generateSafeTelemetryId('ev');
  const visId = generateSafeTelemetryId('vis');
  assert.equal(isValidTelemetryToken(evId), true);
  assert.equal(isValidTelemetryToken(visId), true);
  assert.notEqual(evId, visId);
  assert.equal(isValidTelemetryToken('short'), false);
  assert.equal(isValidTelemetryToken('bad/slash/id'), false);
});

test('normalizeVisitedPath sanitizes paths and keeps allowed query params within 160 chars', () => {
  assert.equal(normalizeVisitedPath('/baza-wiedzy/html-7/', '?utm_source=wykop#top'), '/baza-wiedzy/html-7?utm_source=wykop');
  assert.equal(normalizeVisitedPath('///app//', '?tab=terminal&ignored=123'), '/app?tab=terminal');
  assert.equal(normalizeVisitedPath(''), '/');
  const huge = '/' + 'a'.repeat(300);
  assert.equal(normalizeVisitedPath(huge).length <= 160, true);
});

test('normalizeReferrerHost and extractUtmSource handle Wykop, Google, Direct, and own host', () => {
  assert.equal(normalizeReferrerHost('https://www.wykop.pl/link/12345', 'fsda.tech'), 'wykop.pl');
  assert.equal(normalizeReferrerHost('https://fsda.tech/baza-wiedzy', 'fsda.tech'), 'direct');
  assert.equal(normalizeReferrerHost('', 'fsda.tech'), 'direct');
  assert.equal(extractUtmSource('?utm_source=Wykop_Kampania!'), 'wykop_kampania');
  assert.equal(extractUtmSource('?foo=bar'), 'none');
  assert.equal(formatTrafficSourceLabel('wykop.pl', 'none'), 'Wykop.pl');
  assert.equal(formatTrafficSourceLabel('www.google.pl', 'none'), 'Google Search');
  assert.equal(formatTrafficSourceLabel('direct', 'none', 'pl'), 'Bezpośrednie (Direct)');
});

test('detectDeviceType identifies mobile, tablet, and desktop reliably', () => {
  assert.equal(detectDeviceType(390, ''), 'mobile');
  assert.equal(detectDeviceType(820, ''), 'tablet');
  assert.equal(detectDeviceType(1440, ''), 'desktop');
  assert.equal(detectDeviceType(1200, 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile'), 'mobile');
  assert.equal(detectDeviceType(1200, 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)'), 'tablet');
});

test('shouldDeduplicatePageview skips identical path within dedup window and allows navigation away', () => {
  const base = 1_760_000_000_000;
  assert.equal(shouldDeduplicatePageview('landing::/', 'landing::/', base, base + 1200), true);
  assert.equal(shouldDeduplicatePageview('landing::/', 'landing::/', base, base + 5000), false);
  assert.equal(shouldDeduplicatePageview('landing::/', 'knowledge_base::/baza-wiedzy', base, base + 500), false);
});

test('buildVisitorEventWritePayload and buildVisitorPresenceWritePayload produce rule-compliant shapes', () => {
  const date = new Date(2026, 10, 17, 14, 30, 0);
  const ev = buildVisitorEventWritePayload({
    visitorId: 'vis_1234567890',
    sessionId: 'ses_1234567890',
    date,
    pathname: '/baza-wiedzy/html-7',
    search: '?utm_source=wykop',
    tab: 'public_lesson',
    referrerHost: 'wykop.pl',
    utmSource: 'wykop',
    deviceType: 'mobile',
    language: 'pl',
    isAuthenticated: false,
  });

  assert.equal(ev.dateKey, formatCalendarDateKey(date));
  assert.match(ev.dateKey, /^20[2-9][0-9]-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/);
  assert.equal(ev.path, '/baza-wiedzy/html-7?utm_source=wykop');
  assert.equal(ev.tab, 'public_lesson');
  assert.equal(ev.deviceType, 'mobile');
  assert.equal(ev.isAuthenticated, false);

  const pres = buildVisitorPresenceWritePayload({
    sessionId: 'ses_1234567890',
    visitorId: 'vis_1234567890',
    pathname: '/app',
    search: '?tab=editor',
    tab: 'editor',
    referrerHost: 'direct',
    deviceType: 'desktop',
    language: 'en',
    isAuthenticated: true,
  });

  assert.equal(pres.sessionId, 'ses_1234567890');
  assert.equal(pres.tab, 'editor');
  assert.equal(pres.language, 'en');
  assert.equal(pres.isAuthenticated, true);
});

test('aggregateVisitorAnalytics computes real KPIs, online count, sources, top pages, and continuous series', () => {
  const nowMs = new Date(2026, 10, 17, 15, 0, 0).getTime();
  const todayKey = formatCalendarDateKey(new Date(nowMs));
  const yesterday = new Date(nowMs - 24 * 60 * 60 * 1000);
  const yesterdayKey = formatCalendarDateKey(yesterday);

  const events: VisitorEventRecord[] = [
    {
      id: 'ev_11111111',
      visitorId: 'vis_aaaaaaaa',
      sessionId: 'ses_11111111',
      dateKey: todayKey,
      path: '/',
      tab: 'landing',
      referrerHost: 'wykop.pl',
      utmSource: 'wykop',
      deviceType: 'mobile',
      language: 'pl',
      isAuthenticated: false,
      createdAtMs: nowMs - 60_000,
    },
    {
      id: 'ev_22222222',
      visitorId: 'vis_aaaaaaaa',
      sessionId: 'ses_11111111',
      dateKey: todayKey,
      path: '/baza-wiedzy/html-7',
      tab: 'public_lesson',
      referrerHost: 'wykop.pl',
      utmSource: 'wykop',
      deviceType: 'mobile',
      language: 'pl',
      isAuthenticated: false,
      createdAtMs: nowMs - 30_000,
    },
    {
      id: 'ev_33333333',
      visitorId: 'vis_bbbbbbbb',
      sessionId: 'ses_22222222',
      dateKey: yesterdayKey,
      path: '/baza-wiedzy/html-7',
      tab: 'public_lesson',
      referrerHost: 'google.com',
      utmSource: 'none',
      deviceType: 'desktop',
      language: 'en',
      isAuthenticated: true,
      createdAtMs: nowMs - 24 * 60 * 60 * 1000,
    },
  ];

  const presences: VisitorPresenceRecord[] = [
    {
      sessionId: 'ses_11111111',
      visitorId: 'vis_aaaaaaaa',
      path: '/baza-wiedzy/html-7',
      tab: 'public_lesson',
      referrerHost: 'wykop.pl',
      deviceType: 'mobile',
      language: 'pl',
      isAuthenticated: false,
      lastSeenMs: nowMs - 25_000, // active (< 3 min)
    },
    {
      sessionId: 'ses_stale123',
      visitorId: 'vis_old12345',
      path: '/',
      tab: 'landing',
      referrerHost: 'direct',
      deviceType: 'desktop',
      language: 'pl',
      isAuthenticated: false,
      lastSeenMs: nowMs - 10 * 60 * 1000, // stale (> 3 min)
    },
  ];

  const summary = aggregateVisitorAnalytics(events, presences, nowMs, '7d', '', 'pl');

  assert.equal(summary.totalPageviews, 3);
  assert.equal(summary.uniqueVisitors, 2);
  assert.equal(summary.uniqueSessions, 2);
  assert.equal(summary.avgPagesPerSession, 1.5);
  assert.equal(summary.todayPageviews, 2);
  assert.equal(summary.todayUniqueVisitors, 1);
  assert.equal(summary.onlineNowCount, 1);
  assert.equal(summary.dailySeries.length, 7);
  assert.equal(summary.topPages[0].path, '/baza-wiedzy/html-7');
  assert.equal(summary.topPages[0].views, 2);
  assert.equal(summary.topSources[0].sourceKey, 'wykop.pl');
  assert.equal(summary.topSources[0].visits, 2);
  assert.equal(summary.devices.mobile, 2);
  assert.equal(summary.devices.desktop, 1);
  assert.equal(summary.languages.pl, 2);
  assert.equal(summary.languages.en, 1);
  assert.equal(summary.guestCount, 2);
  assert.equal(summary.authenticatedCount, 1);

  const csv = exportVisitorAnalyticsCsv(events);
  assert.equal(csv.includes('wykop.pl'), true);
  assert.equal(csv.split('\n').length, 4);
});

test('aggregateRealQuizAnalytics computes actual quiz scores and attempts without fake values', () => {
  const mockModules = [
    {
      id: 1,
      title: 'HTML5',
      lessons: [
        { id: 'html-1', title: 'Tagi semantyczne' },
        { id: 'html-2', title: 'Formularze' },
      ],
    },
  ] as unknown as Module[];

  const mockUsers = [
    { id: 'u1', quizScores: { 'html-1': 100, 'html-2': 60 } },
    { id: 'u2', quizScores: { 'html-1': 80 } },
  ] as unknown as User[];

  const res = aggregateRealQuizAnalytics(mockUsers, mockModules);
  assert.equal(res.totalQuizAttempts, 3);
  assert.equal(res.overallAvgScorePercent, 80);
  assert.equal(res.rows[0].lessonId, 'html-2');
  assert.equal(res.rows[0].avgScorePercent, 60);
  assert.equal(res.rows[0].passRatePercent, 0);
  assert.equal(res.rows[1].lessonId, 'html-1');
  assert.equal(res.rows[1].avgScorePercent, 90);
  assert.equal(res.rows[1].passRatePercent, 100);
});
