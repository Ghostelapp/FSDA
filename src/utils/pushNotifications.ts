import { DailyReminderSettings } from '../types';

export const DEFAULT_REMINDER_SETTINGS: DailyReminderSettings = {
  enabled: true,
  reminderTime: '18:00',
  dailyGoalMinutes: 30,
  daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // All days of week
  streakProtectionAlert: true,
};

export interface NotificationPayload {
  title: string;
  options: NotificationOptions & {
    renotify?: boolean;
    vibrate?: number[];
    actions?: Array<{ action: string; title: string }>;
  };
}

/**
 * Parses a "HH:MM" time string into hours and minutes.
 */
export function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  const parts = (timeStr || '18:00').split(':');
  const rawHours = parseInt(parts[0] ?? '18', 10);
  const rawMinutes = parseInt(parts[1] ?? '0', 10);

  const hours = Number.isFinite(rawHours) ? Math.min(23, Math.max(0, rawHours)) : 18;
  const minutes = Number.isFinite(rawMinutes) ? Math.min(59, Math.max(0, rawMinutes)) : 0;

  return { hours, minutes };
}

/**
 * Formats a Date object as local "YYYY-MM-DD" string.
 */
export function formatLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates milliseconds until the next scheduled reminder based on reminderTime and active daysOfWeek.
 * Returns null if no days of the week are selected.
 */
export function getMsUntilNextReminder(
  reminderTime: string,
  daysOfWeek: number[],
  now: Date = new Date()
): number | null {
  if (!daysOfWeek || daysOfWeek.length === 0) {
    return null;
  }

  const { hours, minutes } = parseTimeString(reminderTime);
  const activeSet = new Set(daysOfWeek);

  for (let offsetDays = 0; offsetDays <= 7; offsetDays++) {
    const candidate = new Date(now.getTime());
    candidate.setDate(candidate.getDate() + offsetDays);
    candidate.setHours(hours, minutes, 0, 0);

    const candidateDay = candidate.getDay();
    if (!activeSet.has(candidateDay)) {
      continue;
    }

    const diffMs = candidate.getTime() - now.getTime();
    if (diffMs > 0) {
      return diffMs;
    }
  }

  return null;
}

/**
 * Formats milliseconds into a human-friendly Polish countdown string (e.g., "2 godz. 15 min").
 */
export function formatDurationUntilReminder(ms: number | null): string {
  if (ms === null || ms <= 0) {
    return 'Wkrótce';
  }

  const totalMinutes = Math.ceil(ms / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days} d ${hours} godz.`;
  }
  if (hours > 0) {
    return minutes > 0 ? `${hours} godz. ${minutes} min` : `${hours} godz.`;
  }
  return `${minutes} min`;
}

/**
 * Determines whether the daily learning goal reminder should fire right now.
 * Fires when:
 * 1. Reminders are enabled
 * 2. Today's day of week is in daysOfWeek
 * 3. Current time is >= scheduled reminderTime today
 * 4. Reminder hasn't already fired today (lastNotifiedDate !== todayKey)
 * 5. User hasn't reached their dailyGoalMinutes today (todayCompletedMinutes < dailyGoalMinutes)
 */
export function shouldTriggerDailyReminderNow(
  settings: DailyReminderSettings,
  todayCompletedMinutes: number,
  now: Date = new Date()
): boolean {
  if (!settings.enabled) return false;
  if (!settings.daysOfWeek || settings.daysOfWeek.length === 0) return false;

  const todayDay = now.getDay();
  if (!settings.daysOfWeek.includes(todayDay)) return false;

  const todayKey = formatLocalDateKey(now);
  if (settings.lastNotifiedDate === todayKey) return false;

  if (todayCompletedMinutes >= settings.dailyGoalMinutes) return false;

  const { hours, minutes } = parseTimeString(settings.reminderTime);
  const scheduledToday = new Date(now.getTime());
  scheduledToday.setHours(hours, minutes, 0, 0);

  return now.getTime() >= scheduledToday.getTime();
}

/**
 * Builds the Service Worker push notification payload for the daily learning goal.
 */
export function buildDailyGoalNotificationPayload(params: {
  userName: string;
  streakDays: number;
  todayMinutes: number;
  dailyGoalMinutes: number;
  nextLessonId?: string;
  nextLessonTitle?: string;
  isTest?: boolean;
}): NotificationPayload {
  const remainingMinutes = Math.max(0, params.dailyGoalMinutes - params.todayMinutes);
  const goalMet = remainingMinutes === 0;

  const title = params.isTest
    ? `Full Stack Academy — Test Powiadomienia (${params.streakDays} dni serii)`
    : goalMet
    ? `Cel dzienny zrealizowany! (${params.todayMinutes}/${params.dailyGoalMinutes} min)`
    : `Przypomnienie o nauce: brakuje ${remainingMinutes} min do celu dnia!`;

  const lessonHint = params.nextLessonTitle
    ? ` Następna lekcja: „${params.nextLessonTitle}”.`
    : ' Rozwiąż krótkie ćwiczenie lub quiz, aby utrzymać serię.';

  const body = goalMet
    ? `Świetna robota, ${params.userName}! Twój dzienny cel (${params.dailyGoalMinutes} min) został dziś osiągnięty, a seria ${params.streakDays} dni jest bezpieczna.`
    : `Cześć ${params.userName}! Masz dziś ${params.todayMinutes}/${params.dailyGoalMinutes} min nauki. Chroń swoją serię ${params.streakDays} dni!${lessonHint}`;

  return {
    title,
    options: {
      body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: 'fsda-daily-goal-reminder',
      renotify: true,
      vibrate: [150, 80, 150],
      data: {
        url: '/',
        lessonId: params.nextLessonId || 'html-1',
        timestamp: Date.now(),
      },
      actions: [
        { action: 'start-lesson', title: 'Kontynuuj naukę' },
        { action: 'dismiss', title: 'Później' },
      ],
    },
  };
}

/**
 * Returns current Notification permission state, or 'unsupported' if Notification API is unavailable.
 */
export function getNotificationPermissionState(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Requests browser Notification permission safely.
 */
export async function requestBrowserNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  try {
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return Notification.permission;
  }
}

/**
 * Dispatches a notification through the active Service Worker registration (preferred for PWA/TWA)
 * with fallback to postMessage and standard Notification constructor.
 */
export async function sendServiceWorkerNotification(payload: NotificationPayload): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const permission = getNotificationPermissionState();
  if (permission !== 'granted') {
    return false;
  }

  // 1. Try Service Worker registration showNotification + postMessage
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        if (registration.active) {
          registration.active.postMessage({
            type: 'SHOW_DAILY_GOAL_NOTIFICATION',
            payload,
          });
          return true;
        }
        await registration.showNotification(payload.title, payload.options);
        return true;
      }
    } catch {
      // Fallback to standard Notification API below
    }
  }

  // 2. Fallback to standard browser Notification API
  if ('Notification' in window) {
    try {
      new Notification(payload.title, {
        body: payload.options.body,
        icon: payload.options.icon,
        tag: payload.options.tag,
      });
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Syncs the next scheduled reminder delay with the Service Worker so background timers stay aligned.
 */
export async function syncScheduleWithServiceWorker(
  delayMs: number | null,
  payload: NotificationPayload | null
): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration?.active) return;

    if (delayMs && delayMs > 0 && payload && getNotificationPermissionState() === 'granted') {
      registration.active.postMessage({
        type: 'SCHEDULE_SW_REMINDER',
        delayMs,
        payload,
      });
    } else {
      registration.active.postMessage({
        type: 'CANCEL_SW_REMINDER',
      });
    }
  } catch {
    // Ignore SW sync errors in unsupported environments
  }
}
