// Service Worker Push & Scheduled Learning Goal Notification Handler
// Imported into the Workbox Service Worker via workbox.importScripts

let scheduledReminderTimer = null;

self.addEventListener('push', (event) => {
  let payload = {
    title: 'Full Stack Academy — Cel Dnia',
    body: 'Czas na codzienną dawkę kodu! Utrzymaj swoją serię nauki.',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: 'fsda-daily-goal-reminder',
    data: { url: '/', action: 'open-lesson' },
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      payload = { ...payload, ...parsed };
    } catch {
      payload.body = event.data.text() || payload.body;
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon || '/pwa-192x192.png',
    badge: payload.badge || '/pwa-192x192.png',
    tag: payload.tag || 'fsda-daily-goal-reminder',
    renotify: true,
    vibrate: [150, 80, 150],
    data: payload.data || { url: '/' },
    actions: [
      { action: 'start-lesson', title: 'Rozpocznij lekcję' },
      { action: 'dismiss', title: 'Później' },
    ],
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  if (data.type === 'SHOW_DAILY_GOAL_NOTIFICATION' && data.payload) {
    const { title, options } = data.payload;
    event.waitUntil(
      self.registration.showNotification(title || 'Full Stack Academy', {
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: 'fsda-daily-goal-reminder',
        renotify: true,
        ...options,
      })
    );
  }

  if (data.type === 'SCHEDULE_SW_REMINDER') {
    if (scheduledReminderTimer) {
      clearTimeout(scheduledReminderTimer);
      scheduledReminderTimer = null;
    }

    const { delayMs, payload } = data;
    if (typeof delayMs === 'number' && delayMs > 0 && delayMs <= 24 * 60 * 60 * 1000 && payload) {
      scheduledReminderTimer = setTimeout(() => {
        self.registration.showNotification(payload.title || 'Full Stack Academy — Przypomnienie', {
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: 'fsda-daily-goal-reminder',
          renotify: true,
          ...(payload.options || {}),
        });
      }, delayMs);
    }
  }

  if (data.type === 'CANCEL_SW_REMINDER') {
    if (scheduledReminderTimer) {
      clearTimeout(scheduledReminderTimer);
      scheduledReminderTimer = null;
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetData = event.notification.data || {};

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            action: event.action || 'open',
            data: targetData,
          });
          return;
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetData.url || '/');
      }
    })
  );
});
