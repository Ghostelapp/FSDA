import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseTimeString,
  formatLocalDateKey,
  getMsUntilNextReminder,
  formatDurationUntilReminder,
  shouldTriggerDailyReminderNow,
  buildDailyGoalNotificationPayload,
} from './pushNotifications';
import { DailyReminderSettings } from '../types';

test('parseTimeString parses valid and fallback HH:MM time strings', () => {
  assert.deepEqual(parseTimeString('18:30'), { hours: 18, minutes: 30 });
  assert.deepEqual(parseTimeString('07:05'), { hours: 7, minutes: 5 });
  assert.deepEqual(parseTimeString('invalid'), { hours: 18, minutes: 0 });
});

test('getMsUntilNextReminder calculates exact ms until next reminder later today or tomorrow', () => {
  const now = new Date(2026, 9, 22, 16, 0, 0, 0); // Thursday 16:00
  const msLaterToday = getMsUntilNextReminder('18:00', [0, 1, 2, 3, 4, 5, 6], now);
  assert.equal(msLaterToday, 2 * 60 * 60 * 1000); // 2 hours

  const afterTime = new Date(2026, 9, 22, 19, 0, 0, 0); // Thursday 19:00
  const msTomorrow = getMsUntilNextReminder('18:00', [0, 1, 2, 3, 4, 5, 6], afterTime);
  assert.equal(msTomorrow, 23 * 60 * 60 * 1000); // 23 hours until Friday 18:00
});

test('getMsUntilNextReminder returns null when no days of week are enabled', () => {
  const now = new Date(2026, 9, 22, 16, 0, 0, 0);
  assert.equal(getMsUntilNextReminder('18:00', [], now), null);
});

test('formatDurationUntilReminder formats duration into readable Polish string', () => {
  assert.equal(formatDurationUntilReminder(2 * 60 * 60 * 1000 + 15 * 60 * 1000), '2 godz. 15 min');
  assert.equal(formatDurationUntilReminder(45 * 60 * 1000), '45 min');
  assert.equal(formatDurationUntilReminder(null), 'Wkrótce');
});

test('shouldTriggerDailyReminderNow triggers only when enabled, past scheduled time, not notified today, and below goal', () => {
  const now = new Date(2026, 9, 22, 18, 15, 0, 0); // Thursday 18:15
  const todayKey = formatLocalDateKey(now);

  const baseSettings: DailyReminderSettings = {
    enabled: true,
    reminderTime: '18:00',
    dailyGoalMinutes: 30,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    streakProtectionAlert: true,
  };

  // Should trigger: 18:15 >= 18:00, 10 < 30 min, not notified today
  assert.equal(shouldTriggerDailyReminderNow(baseSettings, 10, now), true);

  // Should NOT trigger if goal already met (30 >= 30)
  assert.equal(shouldTriggerDailyReminderNow(baseSettings, 30, now), false);

  // Should NOT trigger if already notified today
  assert.equal(
    shouldTriggerDailyReminderNow({ ...baseSettings, lastNotifiedDate: todayKey }, 10, now),
    false
  );

  // Should NOT trigger before scheduled time (e.g. 17:30 < 18:00)
  const earlier = new Date(2026, 9, 22, 17, 30, 0, 0);
  assert.equal(shouldTriggerDailyReminderNow(baseSettings, 10, earlier), false);
});

test('buildDailyGoalNotificationPayload builds localized Polish notification payload', () => {
  const payload = buildDailyGoalNotificationPayload({
    userName: 'Zordon',
    streakDays: 12,
    todayMinutes: 10,
    dailyGoalMinutes: 30,
    nextLessonId: 'html-2',
    nextLessonTitle: 'Semantyczny HTML5',
  });

  assert.ok(payload.title.includes('20 min'));
  assert.ok(payload.options.body?.includes('Zordon'));
  assert.ok(payload.options.body?.includes('12 dni'));
  assert.ok(payload.options.body?.includes('Semantyczny HTML5'));
});
