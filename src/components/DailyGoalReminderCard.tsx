import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDurationUntilReminder } from '../utils/pushNotifications';
import { Bell, BellRing, CheckCircle2, Clock, Send, Target } from 'lucide-react';

const DAYS_OPTIONS = [
  { day: 1, label: 'Pn' },
  { day: 2, label: 'Wt' },
  { day: 3, label: 'Śr' },
  { day: 4, label: 'Cz' },
  { day: 5, label: 'Pt' },
  { day: 6, label: 'So' },
  { day: 0, label: 'Nd' },
];

const GOAL_MINUTES_OPTIONS = [15, 30, 45, 60];

export const DailyGoalReminderCard: React.FC = () => {
  const {
    reminderSettings,
    notificationPermission,
    todaySpentMinutes,
    dailyGoalMinutes,
    nextReminderInMs,
    requestNotificationPermission,
    updateReminderSettings,
    triggerGoalReminderNow,
  } = useApp();

  const [isSendingTest, setIsSendingTest] = useState(false);

  const progressPercent = Math.min(100, Math.round((todaySpentMinutes / Math.max(1, dailyGoalMinutes)) * 100));
  const isGoalReached = todaySpentMinutes >= dailyGoalMinutes;

  const handleToggleDay = (day: number) => {
    const current = reminderSettings.daysOfWeek || [];
    const exists = current.includes(day);
    const updated = exists ? current.filter((d) => d !== day) : [...current, day];
    updateReminderSettings({ daysOfWeek: updated });
  };

  const handleTestNotification = async () => {
    setIsSendingTest(true);
    try {
      if (notificationPermission === 'default') {
        await requestNotificationPermission();
      }
      await triggerGoalReminderNow(true);
    } finally {
      setTimeout(() => setIsSendingTest(false), 600);
    }
  };

  const permissionStatusText =
    notificationPermission === 'granted'
      ? 'Aktywne (Service Worker)'
      : notificationPermission === 'denied'
      ? 'Tryb w aplikacji (Powiadomienia przeglądarki zablokowane)'
      : notificationPermission === 'unsupported'
      ? 'Tryb w aplikacji'
      : 'Wymagana zgoda przeglądarki';

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7 space-y-6">
      {/* Header & Main Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Target className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span>Harmonogram Nauki</span>
            <span aria-hidden="true">·</span>
            <span>{permissionStatusText}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Dzienny Cel Nauki i Przypomnienia Push
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Ustaw dzienny cel minutowy oraz godzinę, o której Service Worker przypomni Ci o dokończeniu lekcji i utrzymaniu serii.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={() => updateReminderSettings({ enabled: !reminderSettings.enabled })}
            aria-pressed={reminderSettings.enabled}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              reminderSettings.enabled
                ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {reminderSettings.enabled ? (
              <>
                <BellRing className="h-3.5 w-3.5" />
                <span>Przypomnienia: Włączone</span>
              </>
            ) : (
              <>
                <Bell className="h-3.5 w-3.5" />
                <span>Przypomnienia: Wyłączone</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Two-Column Content: Today's Goal Progress vs Reminder Schedule Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Today's Learning Goal Progress */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-950/60 p-5 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Dzisiejsza realizacja celu</span>
              <span className="font-mono font-bold text-white tabular-nums">
                {todaySpentMinutes} / {dailyGoalMinutes} min ({progressPercent}%)
              </span>
            </div>

            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isGoalReached
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              {isGoalReached ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300 font-medium">
                    Cel dzienny osiągnięty! Dzisiejsze przypomnienie zostało wyciszone.
                  </span>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>
                    Pozostało <strong className="text-white tabular-nums">{dailyGoalMinutes - todaySpentMinutes} min</strong> nauki do zrealizowania dzisiejszego celu.
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Daily Goal Target Selector */}
          <div className="space-y-2 pt-3 border-t border-slate-800/80">
            <label className="block text-xs font-medium text-slate-400">
              Wybierz dzienny cel nauki:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {GOAL_MINUTES_OPTIONS.map((mins) => {
                const active = dailyGoalMinutes === mins;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => updateReminderSettings({ dailyGoalMinutes: mins })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold tabular-nums transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {mins} min
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Schedule & Service Worker Push Controls */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-950/60 p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Time Picker */}
            <div className="space-y-1.5">
              <label htmlFor="reminder-time-input" className="block text-xs font-medium text-slate-300">
                Godzina przypomnienia
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="reminder-time-input"
                  type="time"
                  value={reminderSettings.reminderTime}
                  disabled={!reminderSettings.enabled}
                  onChange={(e) => updateReminderSettings({ reminderTime: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm font-mono text-white tabular-nums focus:border-indigo-500 focus:outline-none disabled:opacity-50"
                />
              </div>
              <p className="text-[11px] text-slate-400 tabular-nums">
                {reminderSettings.enabled && nextReminderInMs !== null
                  ? `Następne powiadomienie za: ${formatDurationUntilReminder(nextReminderInMs)}`
                  : 'Harmonogram wstrzymany'}
              </p>
            </div>

            {/* Days of Week Selector */}
            <div className="space-y-1.5">
              <span className="block text-xs font-medium text-slate-300">
                Dni aktywności harmonogramu
              </span>
              <div className="flex items-center gap-1.5">
                {DAYS_OPTIONS.map(({ day, label }) => {
                  const isSelected = reminderSettings.daysOfWeek.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={!reminderSettings.enabled}
                      onClick={() => handleToggleDay(day)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 disabled:opacity-50 ${
                        isSelected
                          ? 'bg-indigo-600/90 text-white'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400">
                Aktywne dni: <span className="text-slate-200 font-medium tabular-nums">{reminderSettings.daysOfWeek.length} / 7</span>
              </p>
            </div>
          </div>

          {/* Actions Row: Permission & Test Push Notification */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
            <div className="text-xs text-slate-400">
              {notificationPermission === 'default' ? (
                <button
                  type="button"
                  onClick={() => void requestNotificationPermission()}
                  className="px-3.5 py-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                >
                  Autoryzuj powiadomienia systemowe
                </button>
              ) : (
                <span>
                  Kliknięcie powiadomienia przenosi bezpośrednio do kolejnej lekcji.
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => void handleTestNotification()}
              disabled={isSendingTest}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 disabled:opacity-60"
            >
              <Send className="h-3.5 w-3.5 text-cyan-400" />
              <span>{isSendingTest ? 'Wysyłanie...' : 'Wyślij testowe powiadomienie'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
