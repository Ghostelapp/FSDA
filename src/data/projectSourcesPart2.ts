import { ProjectSourceFile } from '../types';

export const PROJECT_SOURCES_PART_2: Record<string, ProjectSourceFile[]> = {
  'proj-5': [
    {
      path: 'index.html',
      language: 'html',
      description: 'Widok pogodynki WeatherSphere z wyszukiwarką miast, przyciskiem GPS, szkieletem ładowania, prognozą 24h i 7-dniową.',
      code: `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WeatherSphere — Prognoza Pogody Live</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body class="theme-clear">
  <main class="weather-shell">
    <header class="topbar">
      <div>
        <h1>WeatherSphere</h1>
        <p class="tagline">Prognoza na żywo · Open-Meteo Geocoding &amp; Forecast API</p>
      </div>
      <div class="search-bar">
        <input
          id="cityInput"
          type="search"
          placeholder="Wpisz miasto (np. Kraków, Gdańsk, Wrocław)..."
          aria-label="Nazwa miasta"
          autocomplete="off"
        />
        <button id="searchBtn" type="button">Szukaj</button>
        <button id="geoBtn" type="button" class="btn-secondary">Moja lokalizacja</button>
      </div>
    </header>

    <p id="statusMsg" role="status" aria-live="polite" class="status-msg"></p>
    <section id="weatherCard" class="weather-card" aria-live="polite"></section>
    <section id="hourlyStrip" class="hourly-section" aria-label="Prognoza godzinowa 24h"></section>
    <section id="forecastGrid" class="forecast-section" aria-label="Prognoza 7-dniowa"></section>
  </main>

  <script type="module" src="js/app.js"></script>
</body>
</html>`,
    },
    {
      path: 'styles.css',
      language: 'css',
      description: 'Dynamiczne motywy tła (słońce, deszcz, noc), animowany Skeleton Loader oraz responsywna siatka kart godzinowych i 7-dniowych.',
      code: `* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
  color: #f8fafc;
  transition: background 0.4s ease;
}
body.theme-clear { background: linear-gradient(160deg, #0f172a 0%, #1d4ed8 55%, #0284c7 100%); }
body.theme-cloudy { background: linear-gradient(160deg, #0f172a 0%, #334155 60%, #475569 100%); }
body.theme-rain { background: linear-gradient(160deg, #020617 0%, #1e293b 55%, #0f766e 100%); }
body.theme-night { background: linear-gradient(160deg, #020617 0%, #1e1b4b 60%, #0f172a 100%); }

.weather-shell { max-width: 1040px; margin: 0 auto; padding: 24px 20px 48px; display: grid; gap: 20px; }
.topbar { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; }
.topbar h1 { margin: 0; font-size: 1.5rem; }
.tagline { margin: 2px 0 0; font-size: 0.82rem; color: #cbd5e1; }
.search-bar { display: flex; flex-wrap: wrap; gap: 8px; flex: 1; justify-content: flex-end; }
.search-bar input {
  flex: 1; min-width: 210px; max-width: 340px;
  padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(15, 23, 42, 0.65); color: #fff; font: inherit;
}
.search-bar button {
  padding: 10px 16px; border-radius: 10px; border: 0; font-weight: 700; cursor: pointer;
  background: #4f46e5; color: #fff;
}
.search-bar .btn-secondary { background: rgba(15, 23, 42, 0.72); border: 1px solid rgba(255, 255, 255, 0.2); }

.status-msg { margin: 0; font-size: 0.88rem; color: #bae6fd; min-height: 20px; }
.status-msg.is-error { color: #fecaca; font-weight: 600; }

.weather-card {
  background: rgba(15, 23, 42, 0.68);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 20px;
  padding: 24px;
}
.current-grid { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 20px; }
.temp-hero { font-size: clamp(2.6rem, 6vw, 4rem); font-weight: 800; line-height: 1; }
.city-name { font-size: 1.4rem; font-weight: 800; margin: 0 0 4px; }
.weather-desc { color: #cbd5e1; margin: 0; font-size: 0.95rem; }
.metrics-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
  gap: 10px; margin-top: 20px; padding-top: 18px; border-top: 1px solid rgba(255, 255, 255, 0.12);
}
.metric-box {
  background: rgba(2, 6, 23, 0.45); border-radius: 12px; padding: 12px;
}
.metric-box span { display: block; font-size: 0.75rem; color: #94a3b8; }
.metric-box strong { font-size: 1.05rem; }

.section-title { margin: 0 0 10px; font-size: 0.92rem; text-transform: uppercase; letter-spacing: 0.06em; color: #cbd5e1; }
.hourly-list {
  display: flex; gap: 10px; overflow-x: auto; padding-bottom: 6px;
}
.hour-card {
  min-width: 82px; text-align: center; padding: 12px 10px; border-radius: 14px;
  background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(255, 255, 255, 0.12);
}
.hour-card small { display: block; color: #94a3b8; font-size: 0.75rem; }
.hour-card strong { display: block; margin-top: 6px; font-size: 0.95rem; }

.forecast-list {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;
}
.day-card {
  padding: 14px; border-radius: 14px; text-align: center;
  background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(255, 255, 255, 0.12);
}
.day-card .day-name { font-weight: 700; font-size: 0.85rem; margin-bottom: 6px; }
.day-card .day-temps { font-size: 0.9rem; margin-top: 6px; }
.day-card .temp-min { color: #94a3b8; margin-left: 6px; }

.skeleton {
  height: 150px; border-radius: 16px;
  background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.06) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`,
    },
    {
      path: 'js/api.js',
      language: 'javascript',
      description: 'Asynchroniczna warstwa Open-Meteo Geocoding & Forecast API pobierająca bieżące KPI (temperatura, wilgotność, ciśnienie, wiatr, UV), prognozę 24h i 7-dniową.',
      code: `export async function searchCityCoordinates(cityName) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new Error('Brak połączenia z internetem. Sprawdź sieć i spróbuj ponownie.');
  }
  const clean = cityName.trim();
  if (!clean) {
    throw new Error('Wpisz nazwę miasta, aby pobrać prognozę.');
  }

  const url = \`https://geocoding-api.open-meteo.com/v1/search?name=\${encodeURIComponent(clean)}&count=1&language=pl&format=json\`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Błąd komunikacji z serwerem geokodowania.');
  }
  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(\`Nie znaleziono miasta "\${clean}". Sprawdź pisownię.\`);
  }
  const best = data.results[0];
  return {
    name: best.name,
    country: best.country || '',
    latitude: best.latitude,
    longitude: best.longitude,
  };
}

export async function fetchForecast(latitude, longitude) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new Error('Tryb offline — brak połączenia z API pogodowym.');
  }
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code,is_day',
    hourly: 'temperature_2m,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,uv_index_max,weather_code',
    forecast_days: '7',
    timezone: 'auto',
  });
  const response = await fetch(\`https://api.open-meteo.com/v1/forecast?\${params.toString()}\`);
  if (!response.ok) {
    throw new Error('Nie udało się pobrać prognozy pogody z Open-Meteo.');
  }
  return response.json();
}`,
    },
    {
      path: 'js/ui.js',
      language: 'javascript',
      description: 'Mapowanie kodów WMO na etykiety PL i wektorowe ikony SVG, zmiana motywu tła, Skeleton Loader oraz renderowanie prognozy 24h i 7-dniowej.',
      code: `export function describeWmoCode(code) {
  if (code === 0) return { label: 'Bezchmurnie', theme: 'theme-clear', kind: 'sun' };
  if ([1, 2, 3].includes(code)) return { label: 'Częściowe zachmurzenie', theme: 'theme-cloudy', kind: 'cloud' };
  if ([45, 48].includes(code)) return { label: 'Mgła i zamglenia', theme: 'theme-cloudy', kind: 'cloud' };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { label: 'Opady deszczu', theme: 'theme-rain', kind: 'rain' };
  if ([71, 73, 75, 85, 86].includes(code)) return { label: 'Opady śniegu', theme: 'theme-cloudy', kind: 'snow' };
  if ([95, 96, 99].includes(code)) return { label: 'Burza z wyładowaniami', theme: 'theme-rain', kind: 'rain' };
  return { label: 'Zmienne warunki', theme: 'theme-cloudy', kind: 'cloud' };
}

export function renderWeatherSvg(kind, size = 44) {
  if (kind === 'sun') {
    return \`<svg width="\${size}" height="\${size}" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>\`;
  }
  if (kind === 'rain') {
    return \`<svg width="\${size}" height="\${size}" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"><path d="M4 14.5A4.5 4.5 0 0 1 8.5 10h1A5.5 5.5 0 0 1 20 12.5a3.5 3.5 0 0 1-1.5 6.5H8"/><path d="M8 19v2M12 19v2M16 19v2"/></svg>\`;
  }
  return \`<svg width="\${size}" height="\${size}" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" stroke-width="2" stroke-linecap="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>\`;
}

export function renderLoadingSkeleton(weatherCard, hourlyStrip, forecastGrid) {
  weatherCard.innerHTML = '<div class="skeleton" aria-label="Ładowanie prognozy"></div>';
  hourlyStrip.innerHTML = '';
  forecastGrid.innerHTML = '';
}

export function renderWeatherView({ cityLabel, data, weatherCard, hourlyStrip, forecastGrid }) {
  const current = data.current;
  const info = describeWmoCode(current.weather_code);
  const uvMax = data.daily?.uv_index_max?.[0] ?? 0;

  document.body.className = current.is_day === 0 ? 'theme-night' : info.theme;

  weatherCard.innerHTML = \`
    <div class="current-grid">
      <div>
        <h2 class="city-name">\${cityLabel}</h2>
        <p class="weather-desc">\${info.label}</p>
      </div>
      <div style="display:flex;align-items:center;gap:14px">
        \${renderWeatherSvg(info.kind, 56)}
        <div class="temp-hero">\${Math.round(current.temperature_2m)}°C</div>
      </div>
    </div>
    <div class="metrics-grid">
      <div class="metric-box"><span>Wilgotność</span><strong>\${current.relative_humidity_2m}%</strong></div>
      <div class="metric-box"><span>Wiatr</span><strong>\${Math.round(current.wind_speed_10m)} km/h</strong></div>
      <div class="metric-box"><span>Ciśnienie</span><strong>\${Math.round(current.surface_pressure)} hPa</strong></div>
      <div class="metric-box"><span>Indeks UV (max)</span><strong>\${uvMax.toFixed(1)}</strong></div>
    </div>
  \`;

  const hours = (data.hourly?.time || []).slice(0, 24);
  hourlyStrip.innerHTML = \`
    <h3 class="section-title">Prognoza godzinowa (24h)</h3>
    <div class="hourly-list">
      \${hours
        .map((iso, idx) => {
          const hh = iso.slice(11, 16);
          const temp = Math.round(data.hourly.temperature_2m[idx]);
          const w = describeWmoCode(data.hourly.weather_code[idx]);
          return \`<div class="hour-card"><small>\${hh}</small>\${renderWeatherSvg(w.kind, 24)}<strong>\${temp}°</strong></div>\`;
        })
        .join('')}
    </div>
  \`;

  const days = data.daily?.time || [];
  forecastGrid.innerHTML = \`
    <h3 class="section-title">Prognoza 7-dniowa</h3>
    <div class="forecast-list">
      \${days
        .map((dateStr, idx) => {
          const w = describeWmoCode(data.daily.weather_code[idx]);
          const maxT = Math.round(data.daily.temperature_2m_max[idx]);
          const minT = Math.round(data.daily.temperature_2m_min[idx]);
          const dayName = new Date(dateStr + 'T12:00:00').toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric' });
          return \`<article class="day-card"><div class="day-name">\${dayName}</div>\${renderWeatherSvg(w.kind, 32)}<div class="day-temps"><strong>\${maxT}°</strong><span class="temp-min">\${minT}°</span></div></article>\`;
        })
        .join('')}
    </div>
  \`;
}`,
    },
    {
      path: 'js/app.js',
      language: 'javascript',
      description: 'Kontroler główny WeatherSphere z debouncingiem wyszukiwania (450ms), obsługą Geolocation API i reakcją na utratę łączności offline.',
      code: `import { fetchForecast, searchCityCoordinates } from './api.js';
import { renderLoadingSkeleton, renderWeatherView } from './ui.js';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');
const statusMsg = document.getElementById('statusMsg');
const weatherCard = document.getElementById('weatherCard');
const hourlyStrip = document.getElementById('hourlyStrip');
const forecastGrid = document.getElementById('forecastGrid');

let debounceTimer = null;

function setStatus(message, isError = false) {
  statusMsg.textContent = message;
  statusMsg.classList.toggle('is-error', isError);
}

async function loadWeatherByCoords(label, lat, lon) {
  setStatus(\`Pobieranie prognozy dla: \${label}...\`);
  renderLoadingSkeleton(weatherCard, hourlyStrip, forecastGrid);
  try {
    const data = await fetchForecast(lat, lon);
    renderWeatherView({ cityLabel: label, data, weatherCard, hourlyStrip, forecastGrid });
    setStatus(\`Zaktualizowano prognozę dla \${label}.\`);
  } catch (err) {
    weatherCard.innerHTML = '';
    setStatus(err.message || 'Nie udało się pobrać danych pogodowych.', true);
  }
}

async function handleCitySearch(cityName) {
  const query = (cityName || '').trim();
  if (!query) return;
  setStatus(\`Wyszukiwanie lokalizacji "\${query}"...\`);
  renderLoadingSkeleton(weatherCard, hourlyStrip, forecastGrid);
  try {
    const place = await searchCityCoordinates(query);
    const label = place.country ? \`\${place.name}, \${place.country}\` : place.name;
    await loadWeatherByCoords(label, place.latitude, place.longitude);
  } catch (err) {
    weatherCard.innerHTML = '';
    setStatus(err.message || 'Nie znaleziono miasta.', true);
  }
}

searchBtn.addEventListener('click', () => handleCitySearch(cityInput.value));

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    clearTimeout(debounceTimer);
    handleCitySearch(cityInput.value);
  }
});

cityInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  const val = cityInput.value.trim();
  if (val.length < 3) return;
  debounceTimer = setTimeout(() => handleCitySearch(val), 450);
});

geoBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    setStatus('Twoja przeglądarka nie obsługuje Geolocation API.', true);
    return;
  }
  setStatus('Pobieranie współrzędnych GPS...');
  navigator.geolocation.getCurrentPosition(
    (pos) => loadWeatherByCoords('Twoja lokalizacja (GPS)', pos.coords.latitude, pos.coords.longitude),
    () => setStatus('Brak zgody na lokalizację GPS. Wpisz miasto ręcznie.', true),
    { timeout: 8000 }
  );
});

window.addEventListener('offline', () => setStatus('Utracono połączenie z internetem (tryb offline).', true));
window.addEventListener('online', () => setStatus('Przywrócono połączenie z internetem.'));

loadWeatherByCoords('Warszawa, Polska', 52.2297, 21.0122);`,
    },
    {
      path: 'README.md',
      language: 'markdown',
      description: 'Instrukcja uruchomienia WeatherSphere oraz opis wykorzystanych darmowych endpointów Open-Meteo (bez klucza API).',
      code: `# WeatherSphere — Prognoza Pogody Live

Aplikacja pogodowa w asynchronicznym JavaScript (Fetch API, async/await, ES Modules) korzystająca z darmowego **Open-Meteo API** (bez konieczności rejestracji klucza API).

## Funkcje
- Wyszukiwanie miast z obsługą polskich znaków i debouncingiem (450 ms)
- Bieżące parametry: temperatura, wilgotność, wiatr, ciśnienie atmosferyczne oraz indeks UV
- Prognoza godzinowa 24h i długoterminowa 7-dniowa z wektorowymi ikonami SVG
- Dynamiczne motywy tła (dzień, noc, zachmurzenie, deszcz) + Skeleton Loader + obsługa offline i GPS

## Uruchomienie lokalne
\`\`\`bash
npx serve .
\`\`\``,
    },
  ],

  'proj-6': [
    {
      path: 'package.json',
      language: 'json',
      description: 'Konfiguracja projektu Vite + React 19 + TypeScript + Tailwind CSS gotowa do uruchomienia przez npm install && npm run dev.',
      code: `{
  "name": "pulse-analytics-dashboard",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.469.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.2",
    "vite": "^6.0.0"
  }
}`,
    },
    {
      path: 'tsconfig.json',
      language: 'json',
      description: 'Konfiguracja ścisłego kompilatora TypeScript dla React 19 (react-jsx, strict: true).',
      code: `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}`,
    },
    {
      path: 'index.html',
      language: 'html',
      description: 'Punkt wejściowy aplikacji Vite dla PulseAnalytics.',
      code: `<!doctype html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PulseAnalytics — Dashboard KPI</title>
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    },
    {
      path: 'src/main.tsx',
      language: 'tsx',
      description: 'Inicjalizacja drzewa React 19 z StrictMode.',
      code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import { PulseAnalyticsApp } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PulseAnalyticsApp />
  </React.StrictMode>
);`,
    },
    {
      path: 'src/types/analytics.ts',
      language: 'typescript',
      description: 'Ścisłe kontrakty TypeScript dla transakcji, zakresów dat, walut, serii wykresów i sortowania tabeli.',
      code: `export type CurrencyCode = 'PLN' | 'EUR' | 'USD';
export type DateRangePreset = '7d' | '30d' | '365d';
export type TransactionStatus = 'PAID' | 'PENDING' | 'REFUNDED';

export interface Transaction {
  id: string;
  customer: string;
  email: string;
  channel: 'Organic' | 'Direct' | 'Ads' | 'Referral';
  amountPln: number;
  status: TransactionStatus;
  createdAt: string; // YYYY-MM-DD
}

export interface SortConfig {
  field: 'customer' | 'amountPln' | 'createdAt';
  direction: 'asc' | 'desc';
}`,
    },
    {
      path: 'src/utils/exportCsv.ts',
      language: 'typescript',
      description: 'Konwerter walut PLN/EUR/USD oraz eksport przefiltrowanej tabeli do CSV z nagłówkiem UTF-8 BOM dla Excela.',
      code: `import { CurrencyCode, Transaction } from '../types/analytics';

export const CURRENCY_RATES: Record<CurrencyCode, number> = {
  PLN: 1,
  EUR: 0.23,
  USD: 0.25,
};

export function formatMoney(amountPln: number, currency: CurrencyCode): string {
  const converted = amountPln * CURRENCY_RATES[currency];
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(converted);
}

export function downloadTransactionsCsv(rows: Transaction[], currency: CurrencyCode): void {
  const header = ['ID', 'Klient', 'E-mail', 'Kanał', 'Kwota', 'Waluta', 'Status', 'Data'];
  const rate = CURRENCY_RATES[currency];
  const escapeCell = (val: string | number) => \`"\${String(val).replace(/"/g, '""')}"\`;

  const csvRows = [
    header.join(';'),
    ...rows.map((r) =>
      [
        escapeCell(r.id),
        escapeCell(r.customer),
        escapeCell(r.email),
        escapeCell(r.channel),
        escapeCell((r.amountPln * rate).toFixed(2)),
        escapeCell(currency),
        escapeCell(r.status),
        escapeCell(r.createdAt),
      ].join(';')
    ),
  ];

  const blob = new Blob(['\\uFEFF' + csvRows.join('\\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = \`pulse-analytics-\${new Date().toISOString().slice(0, 10)}.csv\`;
  a.click();
  URL.revokeObjectURL(url);
}`,
    },
    {
      path: 'src/components/RevenueChart.tsx',
      language: 'tsx',
      description: 'Responsywny komponent wykresu słupkowego SVG przychodów oraz rozkładu kanałów ruchu bez ciężkich zależności zewnętrznych.',
      code: `import React from 'react';
import { CurrencyCode, Transaction } from '../types/analytics';
import { formatMoney } from '../utils/exportCsv';

interface RevenueChartProps {
  transactions: Transaction[];
  currency: CurrencyCode;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ transactions, currency }) => {
  const paid = transactions.filter((t) => t.status === 'PAID');
  const byDateMap = new Map<string, number>();
  for (const tx of paid) {
    byDateMap.set(tx.createdAt, (byDateMap.get(tx.createdAt) || 0) + tx.amountPln);
  }
  const points = Array.from(byDateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({ date, amount }));

  const maxAmount = Math.max(1, ...points.map((p) => p.amount));

  const channelTotals = paid.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.channel] = (acc[tx.channel] || 0) + tx.amountPln;
    return acc;
  }, {});
  const totalPaid = Math.max(1, paid.reduce((s, tx) => s + tx.amountPln, 0));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-5">
        <h2 className="text-sm font-bold text-white mb-4">Przychód w czasie (PAID)</h2>
        {points.length === 0 ? (
          <p className="text-xs text-slate-400">Brak opłaconych transakcji w wybranym okresie.</p>
        ) : (
          <svg viewBox="0 0 560 180" className="w-full h-44 overflow-visible" role="img" aria-label="Wykres przychodów">
            {points.map((pt, idx) => {
              const slotW = 540 / Math.max(1, points.length);
              const barW = Math.min(48, slotW * 0.6);
              const barH = Math.max(8, (pt.amount / maxAmount) * 128);
              const x = 10 + idx * slotW + (slotW - barW) / 2;
              const y = 148 - barH;
              return (
                <g key={pt.date}>
                  <rect x={x} y={y} width={barW} height={barH} rx={6} fill="#6366f1" />
                  <text x={x + barW / 2} y={168} textAnchor="middle" fill="#94a3b8" fontSize="10">
                    {pt.date.slice(5)}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
        <h2 className="text-sm font-bold text-white">Źródła przychodu</h2>
        {Object.entries(channelTotals).map(([channel, sum]) => {
          const pct = Math.round((sum / totalPaid) * 100);
          return (
            <div key={channel} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">{channel}</span>
                <span className="text-slate-400">{formatMoney(sum, currency)} ({pct}%)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: \`\${pct}%\` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};`,
    },
    {
      path: 'src/App.tsx',
      language: 'tsx',
      description: 'Główny komponent dashboardu PulseAnalytics z kartami KPI, wykresem, filtrem dat, przełącznikiem walut, sortowalną tabelą z paginacją i eksportem CSV.',
      code: `import React, { useMemo, useState } from 'react';
import { CurrencyCode, DateRangePreset, SortConfig, Transaction } from './types/analytics';
import { downloadTransactionsCsv, formatMoney } from './utils/exportCsv';
import { RevenueChart } from './components/RevenueChart';

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { id: 'TX-101', customer: 'Anna Kowalczyk', email: 'anna@studio.pl', channel: 'Organic', amountPln: 1290, status: 'PAID', createdAt: '2026-11-18' },
  { id: 'TX-102', customer: 'Piotr Zieliński', email: 'piotr@soft.io', channel: 'Ads', amountPln: 890, status: 'PAID', createdAt: '2026-11-16' },
  { id: 'TX-103', customer: 'Marek Nowak', email: 'marek@cloud.pl', channel: 'Direct', amountPln: 450, status: 'PENDING', createdAt: '2026-11-15' },
  { id: 'TX-104', customer: 'Katarzyna Wiśniewska', email: 'kasia@media.pl', channel: 'Referral', amountPln: 2150, status: 'PAID', createdAt: '2026-11-10' },
  { id: 'TX-105', customer: 'Tomasz Kamiński', email: 'tomasz@devhouse.pl', channel: 'Organic', amountPln: 1640, status: 'PAID', createdAt: '2026-11-04' },
  { id: 'TX-106', customer: 'Magda Lewandowska', email: 'magda@ux.pl', channel: 'Ads', amountPln: 720, status: 'REFUNDED', createdAt: '2026-10-25' },
  { id: 'TX-107', customer: 'Jakub Wójcik', email: 'jakub@fintech.pl', channel: 'Direct', amountPln: 3100, status: 'PAID', createdAt: '2026-09-14' },
];

const PAGE_SIZE = 4;

export const PulseAnalyticsApp: React.FC = () => {
  const [currency, setCurrency] = useState<CurrencyCode>('PLN');
  const [range, setRange] = useState<DateRangePreset>('30d');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortConfig>({ field: 'createdAt', direction: 'desc' });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SAMPLE_TRANSACTIONS.filter((tx) => {
      if (range === '7d' && tx.createdAt < '2026-11-12') return false;
      if (range === '30d' && tx.createdAt < '2026-10-20') return false;
      if (!q) return true;
      return tx.customer.toLowerCase().includes(q) || tx.email.toLowerCase().includes(q);
    }).sort((a, b) => {
      const factor = sort.direction === 'asc' ? 1 : -1;
      if (sort.field === 'amountPln') return (a.amountPln - b.amountPln) * factor;
      return a[sort.field].localeCompare(b[sort.field]) * factor;
    });
  }, [range, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const paidRows = filtered.filter((t) => t.status === 'PAID');
  const paidRevenuePln = paidRows.reduce((acc, t) => acc + t.amountPln, 0);
  const conversionRate = filtered.length ? Math.round((paidRows.length / filtered.length) * 100) : 0;

  const toggleSort = (field: SortConfig['field']) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-100">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">PulseAnalytics KPI</h1>
          <p className="text-xs text-slate-400">Panel zarządczy przychodów, konwersji i eksportu raportów</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={range}
            onChange={(e) => { setRange(e.target.value as DateRangePreset); setPage(1); }}
            className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs"
          >
            <option value="7d">Ostatnie 7 dni</option>
            <option value="30d">Ostatnie 30 dni</option>
            <option value="365d">Ostatni rok</option>
          </select>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs"
          >
            <option value="PLN">PLN</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
          <button
            type="button"
            onClick={() => downloadTransactionsCsv(filtered, currency)}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white"
          >
            Eksportuj CSV
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Przychód netto (PAID)</span>
          <p className="text-2xl font-bold mt-1">{formatMoney(paidRevenuePln, currency)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Transakcje w okresie</span>
          <p className="text-2xl font-bold mt-1">{filtered.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Skuteczność płatności</span>
          <p className="text-2xl font-bold mt-1 text-emerald-400">{conversionRate}%</p>
        </div>
      </section>

      <RevenueChart transactions={filtered} currency={currency} />

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Filtruj po kliencie lub e-mailu..."
          className="w-full max-w-sm rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2 pr-3">ID</th>
                <th className="py-2 pr-3"><button type="button" onClick={() => toggleSort('customer')}>Klient ↕</button></th>
                <th className="py-2 pr-3"><button type="button" onClick={() => toggleSort('amountPln')}>Kwota ↕</button></th>
                <th className="py-2 pr-3">Kanał</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2"><button type="button" onClick={() => toggleSort('createdAt')}>Data ↕</button></th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-800/60">
                  <td className="py-2.5 pr-3 font-mono text-slate-400">{tx.id}</td>
                  <td className="py-2.5 pr-3 font-semibold">{tx.customer}</td>
                  <td className="py-2.5 pr-3">{formatMoney(tx.amountPln, currency)}</td>
                  <td className="py-2.5 pr-3 text-slate-400">{tx.channel}</td>
                  <td className="py-2.5 pr-3">{tx.status}</td>
                  <td className="py-2.5 font-mono text-slate-400">{tx.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Strona {safePage} z {totalPages}</span>
          <div className="flex gap-2">
            <button type="button" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 rounded bg-slate-800 disabled:opacity-40">Poprzednia</button>
            <button type="button" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded bg-slate-800 disabled:opacity-40">Następna</button>
          </div>
        </div>
      </div>
    </div>
  );
};`,
    },
    {
      path: 'README.md',
      language: 'markdown',
      description: 'Instrukcja instalacji zależności, uruchomienia serwera developerskiego Vite oraz budowy produkcyjnej.',
      code: `# PulseAnalytics — Dashboard Analityczny (React 19 + TypeScript)

## Uruchomienie lokalne
\`\`\`bash
npm install
npm run dev
\`\`\`

## Budowa produkcyjna
\`\`\`bash
npm run build
npx vercel --prod
\`\`\``,
    },
  ],

  'proj-7': [
    {
      path: 'package.json',
      language: 'json',
      description: 'Zależności i skrypty uruchomieniowe serwera SecureGate (Express, PostgreSQL pg, JWT, bcrypt, Helmet, rate-limit).',
      code: `{
  "name": "securegate-auth-api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "tsx --test src/utils/jwt.test.ts"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "express-rate-limit": "^7.5.0",
    "helmet": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.13.1"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/cookie-parser": "^1.4.8",
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/node": "^22.10.2",
    "@types/pg": "^8.11.10",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  }
}`,
    },
    {
      path: 'tsconfig.json',
      language: 'json',
      description: 'Konfiguracja kompilatora TypeScript dla backendu Node.js ESM.',
      code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}`,
    },
    {
      path: '.env.example',
      language: 'bash',
      description: 'Szablon wymaganych zmiennych środowiskowych (klucze JWT, adres PostgreSQL, CORS).',
      code: `PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/securegate
JWT_ACCESS_SECRET=replace-with-64-char-random-access-secret
JWT_REFRESH_SECRET=replace-with-64-char-random-refresh-secret`,
    },
    {
      path: 'database/schema.sql',
      language: 'sql',
      description: 'Schemat tabel PostgreSQL users oraz refresh_tokens z rodzinami tokenów (Token Reuse Detection) i indeksami.',
      code: `CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'moderator', 'admin')) DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  token_family UUID NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family ON refresh_tokens(token_family);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);`,
    },
    {
      path: 'src/db/pool.ts',
      language: 'typescript',
      description: 'Połączenie pg.Pool z PostgreSQL oraz sparametryzowane zapytania SQL chroniące przed SQL Injection.',
      code: `import { Pool } from 'pg';
import { UserRole } from '../utils/jwt.js';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const { rows } = await pool.query<DbUser>(
    'SELECT id, email, password_hash, role FROM users WHERE email = $1 LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

export async function findUserById(id: string): Promise<DbUser | null> {
  const { rows } = await pool.query<DbUser>(
    'SELECT id, email, password_hash, role FROM users WHERE id = $1 LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

export async function insertUser(email: string, passwordHash: string): Promise<DbUser> {
  const { rows } = await pool.query<DbUser>(
    'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, password_hash, role',
    [email, passwordHash, 'student']
  );
  return rows[0];
}

export async function storeRefreshToken(userId: string, tokenHash: string, family: string): Promise<void> {
  await pool.query(
    \`INSERT INTO refresh_tokens (user_id, token_hash, token_family, expires_at)
     VALUES ($1, $2, $3, NOW() + INTERVAL '7 days')\`,
    [userId, tokenHash, family]
  );
}

export async function findRefreshToken(tokenHash: string) {
  const { rows } = await pool.query<{ id: string; user_id: string; token_family: string; revoked_at: string | null }>(
    'SELECT id, user_id, token_family, revoked_at FROM refresh_tokens WHERE token_hash = $1 LIMIT 1',
    [tokenHash]
  );
  return rows[0] || null;
}

export async function revokeTokenByHash(tokenHash: string): Promise<void> {
  await pool.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1', [tokenHash]);
}

export async function revokeTokenFamily(family: string): Promise<void> {
  await pool.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_family = $1', [family]);
}`,
    },
    {
      path: 'src/utils/jwt.ts',
      language: 'typescript',
      description: 'Moduł kryptograficzny generujący i weryfikujący pary Access Token (15 min) i Refresh Token (7 dni) oraz skróty SHA-256.',
      code: `import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export type UserRole = 'student' | 'admin' | 'moderator';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

function getSecret(name: 'JWT_ACCESS_SECRET' | 'JWT_REFRESH_SECRET'): string {
  const val = process.env[name];
  if (val && val.length >= 16) return val;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(\`Brak wymaganej zmiennej środowiskowej \${name}\`);
  }
  return \`dev-fallback-\${name.toLowerCase()}-secret\`;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, getSecret('JWT_ACCESS_SECRET'), { expiresIn: '15m' });
}

export function signRefreshToken(userId: string, tokenFamily: string): string {
  return jwt.sign({ sub: userId, family: tokenFamily }, getSecret('JWT_REFRESH_SECRET'), { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, getSecret('JWT_ACCESS_SECRET')) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): { sub: string; family: string } {
  return jwt.verify(token, getSecret('JWT_REFRESH_SECRET')) as { sub: string; family: string };
}

export function hashTokenSha256(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}`,
    },
    {
      path: 'src/middleware/authMiddleware.ts',
      language: 'typescript',
      description: 'Middleware weryfikacji tokenów Bearer, kontrola ról RBAC oraz Rate Limiter blokujący ataki Brute-Force.',
      code: `import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { AccessTokenPayload, UserRole, verifyAccessToken } from '../utils/jwt.js';

export interface AuthenticatedRequest extends Request {
  user?: AccessTokenPayload;
}

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Zbyt wiele prób logowania. Spróbuj ponownie za 15 minut.' },
});

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Brak tokena autoryzacyjnego' });
    return;
  }

  const token = authHeader.slice(7);
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Token wygasł lub jest nieprawidłowy' });
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Brak wymaganych uprawnień do tego zasobu' });
      return;
    }
    next();
  };
}`,
    },
    {
      path: 'src/controllers/authController.ts',
      language: 'typescript',
      description: 'Kontroler rejestracji (bcrypt 12 rund), logowania, rotacji Refresh Tokenów w HttpOnly cookie i wykrywania kradzieży tokena (Reuse Detection) w PostgreSQL.',
      code: `import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {
  findRefreshToken,
  findUserByEmail,
  findUserById,
  insertUser,
  revokeTokenByHash,
  revokeTokenFamily,
  storeRefreshToken,
} from '../db/pool.js';
import {
  hashTokenSha256,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';

const REFRESH_COOKIE_NAME = 'sg_refresh_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password || password.length < 8) {
    res.status(400).json({ error: 'Podaj poprawny e-mail oraz hasło min. 8 znaków.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    res.status(409).json({ error: 'Konto o tym adresie już istnieje.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const created = await insertUser(normalizedEmail, passwordHash);
  res.status(201).json({ id: created.id, email: created.email, role: created.role });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };
  const user = email ? await findUserByEmail(email.trim().toLowerCase()) : null;

  if (!user || !password || !(await bcrypt.compare(password, user.password_hash))) {
    res.status(401).json({ error: 'Nieprawidłowy e-mail lub hasło.' });
    return;
  }

  const family = crypto.randomUUID();
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken(user.id, family);
  await storeRefreshToken(user.id, hashTokenSha256(refreshToken), family);

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
  res.json({ accessToken, user: { id: user.id, email: user.email, role: user.role } });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) {
    res.status(401).json({ error: 'Brak ciasteczka sesji' });
    return;
  }

  try {
    const decoded = verifyRefreshToken(token);
    const tokenHash = hashTokenSha256(token);
    const record = await findRefreshToken(tokenHash);

    if (!record || record.revoked_at) {
      await revokeTokenFamily(decoded.family);
      res.clearCookie(REFRESH_COOKIE_NAME, COOKIE_OPTIONS);
      res.status(403).json({ error: 'Wykryto ponowne użycie tokena. Cała rodzina sesji została unieważniona.' });
      return;
    }

    await revokeTokenByHash(tokenHash);
    const user = await findUserById(decoded.sub);
    if (!user) {
      res.status(401).json({ error: 'Konto nie istnieje' });
      return;
    }

    const nextAccess = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const nextRefresh = signRefreshToken(user.id, decoded.family);
    await storeRefreshToken(user.id, hashTokenSha256(nextRefresh), decoded.family);

    res.cookie(REFRESH_COOKIE_NAME, nextRefresh, COOKIE_OPTIONS);
    res.json({ accessToken: nextAccess });
  } catch {
    res.status(401).json({ error: 'Refresh token wygasł lub jest nieprawidłowy' });
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (token) {
    await revokeTokenByHash(hashTokenSha256(token));
  }
  res.clearCookie(REFRESH_COOKIE_NAME, COOKIE_OPTIONS);
  res.json({ ok: true });
}`,
    },
    {
      path: 'src/server.ts',
      language: 'typescript',
      description: 'Konfiguracja serwera Express z Helmet, CORS credentials, trasami /api/auth oraz chronionym audytem /api/admin/audit.',
      code: `import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { AuthenticatedRequest, authRateLimiter, requireAuth, requireRole } from './middleware/authMiddleware.js';
import { login, logout, refresh, register } from './controllers/authController.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.post('/api/auth/register', authRateLimiter, register);
app.post('/api/auth/login', authRateLimiter, login);
app.post('/api/auth/refresh', refresh);
app.post('/api/auth/logout', logout);

app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

app.get('/api/admin/audit', requireAuth, requireRole('admin'), (_req, res) => {
  res.json({ status: 'Dostęp administracyjny zweryfikowany (RBAC)' });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(\`SecureGate Auth API działa na porcie \${port}\`));`,
    },
    {
      path: 'src/utils/jwt.test.ts',
      language: 'typescript',
      description: 'Automatyczne testy jednostkowe (node:test) weryfikujące podpisywanie, dekodowanie tokenów JWT i haszowanie SHA-256.',
      code: `import test from 'node:test';
import assert from 'node:assert/strict';
import { hashTokenSha256, signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from './jwt.js';

test('signAccessToken and verifyAccessToken round-trip payload accurately', () => {
  const token = signAccessToken({ sub: 'u-1', email: 'admin@fsda.tech', role: 'admin' });
  const decoded = verifyAccessToken(token);
  assert.equal(decoded.sub, 'u-1');
  assert.equal(decoded.role, 'admin');
});

test('signRefreshToken embeds token family and SHA-256 hash is deterministic', () => {
  const token = signRefreshToken('u-1', 'fam-42');
  const decoded = verifyRefreshToken(token);
  assert.equal(decoded.family, 'fam-42');
  assert.equal(hashTokenSha256(token).length, 64);
});`,
    },
    {
      path: 'README.md',
      language: 'markdown',
      description: 'Instrukcja konfiguracji bazy PostgreSQL, zmiennych .env i uruchomienia testów SecureGate.',
      code: `# SecureGate — System Uwierzytelniania JWT & RBAC

## Uruchomienie krok po kroku
1. Skopiuj \`.env.example\` do \`.env\` i wpisz własne sekrety JWT oraz \`DATABASE_URL\`.
2. Załaduj schemat bazy danych:
\`\`\`bash
psql "$DATABASE_URL" -f database/schema.sql
\`\`\`
3. Zainstaluj pakiety, uruchom testy i serwer API:
\`\`\`bash
npm install
npm test
npm run dev
\`\`\``,
    },
  ],

  'proj-8': [
    {
      path: 'package.json',
      language: 'json',
      description: 'Konfiguracja Full Stack bloga DevChronicle z Express, Prisma ORM, JWT oraz React.',
      code: `{
  "name": "devchronicle-blog-cms",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev:server": "tsx watch backend/src/server.ts",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "build": "tsc"
  },
  "dependencies": {
    "@prisma/client": "^6.2.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "helmet": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/react": "^19.0.0",
    "prisma": "^6.2.1",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  }
}`,
    },
    {
      path: 'tsconfig.json',
      language: 'json',
      description: 'Konfiguracja TypeScript obejmująca katalogi backend/ oraz frontend/.',
      code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["backend/src", "frontend/src"]
}`,
    },
    {
      path: '.env.example',
      language: 'bash',
      description: 'Szablon konfiguracji PostgreSQL i sekretu JWT dla panelu autora CMS.',
      code: `PORT=4001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/devchronicle
JWT_SECRET=replace-with-secure-secret-key
CLIENT_URL=http://localhost:5173`,
    },
    {
      path: 'prisma/schema.prisma',
      language: 'prisma',
      description: 'Schemat bazy danych PostgreSQL z relacjami User -> Post -> Comment oraz indeksem złożonym i unikalnym slug.',
      code: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  name         String
  passwordHash String
  posts        Post[]
  comments     Comment[]
}

model Post {
  id        String    @id @default(cuid())
  slug      String    @unique
  title     String
  contentMd String
  published Boolean   @default(false)
  views     Int       @default(0)
  tags      String[]
  authorId  String
  author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([published, createdAt])
}

model Comment {
  id        String   @id @default(cuid())
  body      String
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}`,
    },
    {
      path: 'backend/src/utils/slugify.ts',
      language: 'typescript',
      description: 'Generator przyjaznych adresów URL (z obsługą polskich znaków) oraz funkcja neutralizująca kod XSS w komentarzach.',
      code: `const POLISH_CHAR_MAP: Record<string, string> = {
  ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
};

export function createUrlSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (ch) => POLISH_CHAR_MAP[ch] || ch)
    .replace(/[^a-z0-9\\s-]/g, '')
    .trim()
    .replace(/\\s+/g, '-')
    .replace(/-+/g, '-');
}

export function sanitizeCommentHtml(rawText: string): string {
  return rawText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}`,
    },
    {
      path: 'backend/src/middleware/auth.ts',
      language: 'typescript',
      description: 'Middleware autoryzacji JWT gwarantujące, że wyłącznie zalogowany autor może tworzyć, edytować i usuwać własne wpisy.',
      code: `import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthedRequest extends Request {
  userId?: string;
}

export function requireAuthorAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Wymagane logowanie autora' });
    return;
  }
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET || 'dev-secret') as { sub: string };
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: 'Nieprawidłowy lub wygasły token' });
  }
}`,
    },
    {
      path: 'backend/src/routes/posts.ts',
      language: 'typescript',
      description: 'Kompletne endpointy CRUD bloga CMS: lista z paginacją i tagami, inkrementacja odsłon, tworzenie/edycja/usuwanie z weryfikacją właściciela oraz komentarze bez XSS.',
      code: `import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { createUrlSlug, sanitizeCommentHtml } from '../utils/slugify';
import { AuthedRequest, requireAuthorAuth } from '../middleware/auth';

const prisma = new PrismaClient();
export const postsRouter = Router();

postsRouter.get('/posts', async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = 10;
  const tag = typeof req.query.tag === 'string' && req.query.tag.trim() ? req.query.tag.trim() : undefined;

  const where = {
    published: true,
    ...(tag ? { tags: { has: tag } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { author: { select: { name: true } } },
    }),
    prisma.post.count({ where }),
  ]);

  res.json({ items, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
});

postsRouter.get('/posts/:slug', async (req, res) => {
  const existing = await prisma.post.findUnique({ where: { slug: req.params.slug } });
  if (!existing) {
    res.status(404).json({ error: 'Artykuł nie istnieje' });
    return;
  }
  const post = await prisma.post.update({
    where: { slug: req.params.slug },
    data: { views: { increment: 1 } },
    include: { author: { select: { name: true } }, comments: { orderBy: { createdAt: 'desc' } } },
  });
  res.json(post);
});

postsRouter.post('/posts', requireAuthorAuth, async (req: AuthedRequest, res) => {
  const { title, contentMd, tags, published } = req.body as {
    title?: string;
    contentMd?: string;
    tags?: string[];
    published?: boolean;
  };
  if (!title?.trim() || !contentMd?.trim()) {
    res.status(400).json({ error: 'Tytuł oraz treść Markdown są wymagane.' });
    return;
  }
  const slug = \`\${createUrlSlug(title)}-\${Date.now().toString(36)}\`;
  const created = await prisma.post.create({
    data: {
      title: title.trim(),
      contentMd,
      slug,
      tags: Array.isArray(tags) ? tags : [],
      published: Boolean(published),
      authorId: req.userId!,
    },
  });
  res.status(201).json(created);
});

postsRouter.patch('/posts/:id', requireAuthorAuth, async (req: AuthedRequest, res) => {
  const post = await prisma.post.findUnique({ where: { id: req.params.id } });
  if (!post) {
    res.status(404).json({ error: 'Nie znaleziono wpisu' });
    return;
  }
  if (post.authorId !== req.userId) {
    res.status(403).json({ error: 'Tylko autor wpisu może go edytować.' });
    return;
  }
  const updated = await prisma.post.update({
    where: { id: post.id },
    data: {
      title: typeof req.body.title === 'string' ? req.body.title.trim() : post.title,
      contentMd: typeof req.body.contentMd === 'string' ? req.body.contentMd : post.contentMd,
      published: typeof req.body.published === 'boolean' ? req.body.published : post.published,
    },
  });
  res.json(updated);
});

postsRouter.delete('/posts/:id', requireAuthorAuth, async (req: AuthedRequest, res) => {
  const post = await prisma.post.findUnique({ where: { id: req.params.id } });
  if (!post || post.authorId !== req.userId) {
    res.status(403).json({ error: 'Brak uprawnień do usunięcia wpisu.' });
    return;
  }
  await prisma.post.delete({ where: { id: post.id } });
  res.status(204).send();
});

postsRouter.post('/posts/:slug/comments', requireAuthorAuth, async (req: AuthedRequest, res) => {
  const safeBody = sanitizeCommentHtml(String(req.body.body || '').trim());
  if (safeBody.length < 2) {
    res.status(400).json({ error: 'Komentarz jest za krótki.' });
    return;
  }
  const post = await prisma.post.findUnique({ where: { slug: req.params.slug } });
  if (!post) {
    res.status(404).json({ error: 'Artykuł nie istnieje.' });
    return;
  }
  const comment = await prisma.comment.create({
    data: { body: safeBody, postId: post.id, authorId: req.userId! },
  });
  res.status(201).json(comment);
});`,
    },
    {
      path: 'backend/src/server.ts',
      language: 'typescript',
      description: 'Punkt startowy serwera Express montujący router artykułów CMS z nagłówkami Helmet i CORS.',
      code: `import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { postsRouter } from './routes/posts';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', postsRouter);

const port = Number(process.env.PORT || 4001);
app.listen(port, () => console.log(\`DevChronicle API uruchomione na porcie \${port}\`));`,
    },
    {
      path: 'frontend/src/App.tsx',
      language: 'tsx',
      description: 'Interfejs React czytelnika i panelu CMS z edytorem Markdown + podglądem na żywo, filtrem tagów i bezpiecznym renderowaniem komentarzy.',
      code: `import React, { useMemo, useState } from 'react';

interface Article {
  id: string;
  slug: string;
  title: string;
  contentMd: string;
  tags: string[];
  views: number;
  comments: string[];
}

function renderSafeMarkdownBlocks(md: string): Array<{ type: 'h2' | 'code' | 'p'; text: string }> {
  return md.split('\\n\\n').map((block) => {
    if (block.startsWith('## ')) return { type: 'h2', text: block.slice(3) };
    if (block.startsWith('\`\`\`')) return { type: 'code', text: block.replace(/\`\`\`\\w*\\n?/g, '').trim() };
    return { type: 'p', text: block };
  });
}

export const DevChronicleApp: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: 'p-1',
      slug: 'indeksy-w-postgresql',
      title: 'Jak indeksy B-Tree przyspieszają zapytania w PostgreSQL',
      contentMd: '## Problem skanowania całej tabeli\\n\\nBez indeksu na kolumnie slug baza wykonuje Seq Scan.\\n\\n\`\`\`sql\\nCREATE UNIQUE INDEX idx_post_slug ON posts(slug);\\n\`\`\`',
      tags: ['PostgreSQL', 'Backend'],
      views: 42,
      comments: ['Świetne wyjaśnienie EXPLAIN ANALYZE!'],
    },
  ]);
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [title, setTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('React, TypeScript');
  const [contentMd, setContentMd] = useState('## Nowy wpis\\n\\nNapisz treść w Markdown...');
  const [commentText, setCommentText] = useState('');

  const visibleArticles = useMemo(
    () => (selectedTag === 'ALL' ? articles : articles.filter((a) => a.tags.includes(selectedTag))),
    [articles, selectedTag]
  );

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !contentMd.trim()) return;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setArticles((prev) => [
      {
        id: 'p-' + Date.now(),
        slug,
        title: title.trim(),
        contentMd,
        tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
        views: 1,
        comments: [],
      },
      ...prev,
    ]);
    setTitle('');
  };

  const handleAddComment = (articleId: string) => {
    const clean = commentText.trim();
    if (clean.length < 2) return;
    setArticles((prev) =>
      prev.map((a) => (a.id === articleId ? { ...a, comments: [clean, ...a.comments] } : a))
    );
    setCommentText('');
  };

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8 text-slate-100">
      <header className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-extrabold">DevChronicle CMS</h1>
        <div className="flex gap-2">
          {['ALL', 'PostgreSQL', 'Backend', 'React', 'TypeScript'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={\`px-3 py-1 rounded-lg text-xs font-bold \${selectedTag === tag ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}\`}
            >
              {tag}
            </button>
          ))}
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl bg-slate-900 border border-slate-800 p-5">
        <form onSubmit={handlePublish} className="space-y-3">
          <h2 className="text-sm font-bold">Edytor CMS (Markdown)</h2>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tytuł artykułu..." className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs" />
          <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Tagi po przecinku..." className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs" />
          <textarea value={contentMd} onChange={(e) => setContentMd(e.target.value)} rows={6} className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs font-mono" />
          <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-xs font-bold">Opublikuj artykuł</button>
        </form>
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-2">
          <span className="text-[11px] uppercase text-slate-400 font-bold">Podgląd na żywo</span>
          {renderSafeMarkdownBlocks(contentMd).map((b, i) =>
            b.type === 'h2' ? (
              <h3 key={i} className="text-base font-bold text-white">{b.text}</h3>
            ) : b.type === 'code' ? (
              <pre key={i} className="p-2 rounded bg-slate-900 text-cyan-300 text-xs overflow-x-auto"><code>{b.text}</code></pre>
            ) : (
              <p key={i} className="text-xs text-slate-300">{b.text}</p>
            )
          )}
        </div>
      </section>

      <section className="space-y-4">
        {visibleArticles.map((art) => (
          <article key={art.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">{art.title}</h2>
              <span className="text-xs text-slate-400">Odsłon: {art.views}</span>
            </div>
            <p className="text-xs font-mono text-indigo-400">/articles/{art.slug}</p>
            <div className="flex gap-2">
              <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Dodaj komentarz..." className="flex-1 rounded-lg bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs" />
              <button type="button" onClick={() => handleAddComment(art.id)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold">Wyślij</button>
            </div>
            <ul className="space-y-1 text-xs text-slate-300">
              {art.comments.map((c, idx) => <li key={idx}>• {c}</li>)}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
};`,
    },
    {
      path: 'README.md',
      language: 'markdown',
      description: 'Instrukcja migracji Prisma ORM i uruchomienia backendu oraz frontendu DevChronicle.',
      code: `# DevChronicle — Blog Techniczny & Panel CMS

## Uruchomienie lokalne
1. Skopiuj \`.env.example\` do \`.env\` i ustaw \`DATABASE_URL\` oraz \`JWT_SECRET\`.
2. Wykonaj migrację bazy danych i uruchom API:
\`\`\`bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev:server
\`\`\``,
    },
  ],
};
