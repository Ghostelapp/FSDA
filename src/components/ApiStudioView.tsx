import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HttpMethod,
  API_MISSIONS,
  executeSimulatedRequest,
  checkApiMissionCompleted,
  ApiResponseOutput,
} from '../utils/developerSimulators';
import {
  Send,
  CheckCircle2,
  Sparkles,
  Server,
  Clock,
  KeyRound,
  FileJson,
  HelpCircle,
  Plus,
  Trash2,
} from 'lucide-react';

const PRESET_ENDPOINTS: { label: string; method: HttpMethod; endpoint: string; body?: string; auth?: boolean }[] = [
  { label: 'GET /api/users', method: 'GET', endpoint: '/api/users' },
  {
    label: 'POST /api/tasks',
    method: 'POST',
    endpoint: '/api/tasks',
    body: JSON.stringify({ title: 'Zbudować REST API w Express', priority: 'high' }, null, 2),
  },
  { label: 'GET /api/profile (Bearer)', method: 'GET', endpoint: '/api/profile', auth: true },
  { label: 'DELETE /api/tasks/101', method: 'DELETE', endpoint: '/api/tasks/101' },
  { label: 'GET /api/health', method: 'GET', endpoint: '/api/health' },
];

export const ApiStudioView: React.FC = () => {
  const { currentUser, awardCustomXp } = useApp();
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [endpoint, setEndpoint] = useState<string>('/api/users');
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Accept', value: 'application/json' },
  ]);
  const [bodyRaw, setBodyRaw] = useState<string>(
    JSON.stringify({ title: 'Nauczyć się architektury REST API', priority: 'high' }, null, 2)
  );
  const [response, setResponse] = useState<ApiResponseOutput | null>(() =>
    executeSimulatedRequest({
      method: 'GET',
      endpoint: '/api/users',
      headers: { 'Content-Type': 'application/json' },
      bodyRaw: '',
    })
  );
  const [localCompletedMissions, setLocalCompletedMissions] = useState<string[]>([]);
  const [activeHintId, setActiveHintId] = useState<string | null>(null);

  const completedMissions = Array.from(
    new Set([
      ...localCompletedMissions,
      ...API_MISSIONS.filter((m) => (currentUser.claimedRewards || []).includes(`api-${m.id}`)).map((m) => m.id),
    ])
  );

  const handleSendRequest = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const headerRecord: Record<string, string> = {};
    headers.forEach((h) => {
      if (h.key.trim()) headerRecord[h.key.trim()] = h.value;
    });

    const req = {
      method,
      endpoint,
      headers: headerRecord,
      bodyRaw,
    };

    const res = executeSimulatedRequest(req);
    setResponse(res);

    // Check missions
    API_MISSIONS.forEach((mission) => {
      if (!completedMissions.includes(mission.id) && checkApiMissionCompleted(mission, req, res)) {
        setLocalCompletedMissions((prev) => [...prev, mission.id]);
        awardCustomXp(mission.xpReward, `Ukończono misję API: ${mission.title}`, `api-${mission.id}`);
      }
    });
  };

  const applyPreset = (preset: (typeof PRESET_ENDPOINTS)[number]) => {
    setMethod(preset.method);
    setEndpoint(preset.endpoint);
    if (preset.body) {
      setBodyRaw(preset.body);
    }
    if (preset.auth) {
      setHeaders([
        { key: 'Content-Type', value: 'application/json' },
        { key: 'Authorization', value: 'Bearer fsda-secret-token-2026' },
      ]);
    }
  };

  const addHeaderRow = () => {
    setHeaders((prev) => [...prev, { key: 'Authorization', value: 'Bearer fsda-secret-token-2026' }]);
  };

  const removeHeaderRow = (idx: number) => {
    setHeaders((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <p className="text-xs font-semibold text-cyan-400">Warsztat Backend & HTTP</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Studio REST API & Klient HTTP
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Testuj punkty końcowe (Endpoints), nagłówki autoryzacji JWT Bearer, kody statusu HTTP oraz ciała żądań JSON w bezpiecznym symulatorze.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PRESET_ENDPOINTS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-200 transition-colors whitespace-nowrap shrink-0"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Zone Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Request Builder & Response Inspector (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Request Bar */}
          <form
            onSubmit={handleSendRequest}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-5"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="http-method-select" className="sr-only">
                Metoda HTTP
              </label>
              <select
                id="http-method-select"
                aria-label="Metoda HTTP"
                value={method}
                onChange={(e) => setMethod(e.target.value as HttpMethod)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono font-bold text-cyan-300 focus:border-indigo-500 focus:outline-none"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>

              <label htmlFor="api-endpoint-input" className="sr-only">
                Adres Endpointu URL
              </label>
              <input
                id="api-endpoint-input"
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="/api/users"
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white transition-colors shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Wyślij żądanie</span>
              </button>
            </div>

            {/* Headers Editor */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Nagłówki HTTP (Headers)</span>
                </span>
                <button
                  type="button"
                  onClick={addHeaderRow}
                  className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Dodaj nagłówek Bearer</span>
                </button>
              </div>

              <div className="space-y-2">
                {headers.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      aria-label={`Klucz nagłówka ${idx + 1}`}
                      value={h.key}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHeaders((prev) => prev.map((item, i) => (i === idx ? { ...item, key: val } : item)));
                      }}
                      placeholder="Nagłówek (np. Authorization)"
                      className="w-1/3 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-mono text-slate-200"
                    />
                    <input
                      type="text"
                      aria-label={`Wartość nagłówka ${idx + 1}`}
                      value={h.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHeaders((prev) => prev.map((item, i) => (i === idx ? { ...item, value: val } : item)));
                      }}
                      placeholder="Wartość (np. Bearer token...)"
                      className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-mono text-emerald-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeHeaderRow(idx)}
                      aria-label={`Usuń nagłówek ${idx + 1}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* JSON Body Editor */}
            {(method === 'POST' || method === 'PUT') && (
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <label htmlFor="api-json-body" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileJson className="h-3.5 w-3.5 text-amber-400" />
                  <span>Ciało żądania (Request Body JSON)</span>
                </label>
                <textarea
                  id="api-json-body"
                  rows={5}
                  value={bodyRaw}
                  onChange={(e) => setBodyRaw(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-mono text-amber-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            )}
          </form>

          {/* Response Console */}
          {response && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-cyan-400" />
                  <h2 className="text-sm font-bold text-white">Odpowiedź Serwera (HTTP Response)</h2>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
                  <span
                    className={`font-bold ${
                      response.ok ? 'text-emerald-400' : response.status >= 400 ? 'text-rose-400' : 'text-amber-400'
                    }`}
                  >
                    Status: {response.status} {response.statusText}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {response.latencyMs} ms
                  </span>
                </div>
              </div>

              <pre className="rounded-xl bg-slate-950 border border-slate-800/90 p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-96">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right: Interactive Missions (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white">Misje Backend API</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Zrealizowano {completedMissions.length} z {API_MISSIONS.length} zadań
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-indigo-400" />
          </div>

          <div className="space-y-3">
            {API_MISSIONS.map((m) => {
              const isDone = completedMissions.includes(m.id);
              const showHint = activeHintId === m.id;
              return (
                <div
                  key={m.id}
                  className={`rounded-xl border p-3.5 transition-colors ${
                    isDone
                      ? 'border-emerald-500/40 bg-emerald-950/20'
                      : 'border-slate-800 bg-slate-950/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${
                          isDone ? 'text-emerald-400' : 'text-slate-600'
                        }`}
                      />
                      <h3 className="text-xs font-bold text-white">{m.title}</h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-300 tabular-nums shrink-0">
                      +{m.xpReward} XP
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{m.description}</p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono">
                      {m.method} {m.endpointPattern} → {m.expectedStatus}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveHintId(showHint ? null : m.id)}
                      className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      <HelpCircle className="h-3 w-3" />
                      <span>Podpowiedź</span>
                    </button>
                  </div>

                  {showHint && (
                    <p className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-amber-300">
                      {m.hint}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
