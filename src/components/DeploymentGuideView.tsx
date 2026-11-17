import React, { useState } from 'react';
import { 
  Terminal, 
  Server, 
  ShieldCheck, 
  Layers,
  Key,
  BookOpen,
  Smartphone,
  Download,
  PackageCheck
} from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { AndroidPlayStoreModal } from './AndroidPlayStoreModal';
import { downloadVerifiedPlayStoreZip } from '../utils/playStoreDownload';
import { useApp } from '../context/AppContext';

export const DeploymentGuideView: React.FC = () => {
  const { currentUser, isAuthenticated, language } = useApp();
  const isEn = language === 'en';
  const isAdmin = isAuthenticated && currentUser.role === 'admin';
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    try {
      await downloadVerifiedPlayStoreZip();
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const localSetupCommands = isEn
    ? `# 1. Clone the platform repository
git clone https://github.com/your-org/fullstack-developer-academy.git
cd fullstack-developer-academy

# 2. Install project dependencies (Node >= 20.x recommended)
npm install

# 3. Configure environment variables
cp .env.example .env
# Populate required keys in .env (e.g. DATABASE_URL, JWT_SECRET)

# 4. Start the local Vite development server
npm run dev

# Application runs at: http://localhost:3000`
    : `# 1. Klonowanie repozytorium platformy
git clone https://github.com/twoja-organizacja/fullstack-developer-academy.git
cd fullstack-developer-academy

# 2. Instalacja zależności projektowych (Node >= 20.x zalecany)
npm install

# 3. Konfiguracja zmiennych środowiskowych
cp .env.example .env
# Uzupełnij wymagane klucze w pliku .env (np. DATABASE_URL, JWT_SECRET)

# 4. Uruchomienie serwera deweloperskiego Vite
npm run dev

# Aplikacja wystartuje pod adresem: http://localhost:3000`;

  const dockerfileSnippet = isEn
    ? `# Multi-stage optimized production Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Minimal Alpine production runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
USER node
EXPOSE 3000
CMD ["npm", "run", "preview"]`
    : `# Wielostopniowy, zoptymalizowany Dockerfile (Multi-stage build)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etap produkcyjny (minimalny obraz Alpine)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
USER node
EXPOSE 3000
CMD ["npm", "run", "preview"]`;

  const nginxConfigSnippet = isEn
    ? `# Nginx Reverse Proxy configuration with Let's Encrypt SSL
server {
    listen 80;
    server_name academy.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name academy.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/academy.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/academy.yourdomain.com/privkey.pem;

    # OWASP Security Headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`
    : `# Konfiguracja Nginx jako Reverse Proxy z obsługą SSL Let's Encrypt
server {
    listen 80;
    server_name academy.twojadomena.pl;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name academy.twojadomena.pl;

    ssl_certificate /etc/letsencrypt/live/academy.twojadomena.pl/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/academy.twojadomena.pl/privkey.pem;

    # Nagłówki bezpieczeństwa OWASP
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`;

  const ciCdSnippet = `name: Production CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: ${isEn ? 'Setup Node.js' : 'Konfiguracja Node.js'}
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: ${isEn ? 'Install dependencies' : 'Instalacja bibliotek'}
        run: npm ci
      - name: ${isEn ? 'TypeScript static analysis' : 'Weryfikacja statyczna TypeScript'}
        run: npm run lint
      - name: ${isEn ? 'Automated unit tests' : 'Automatyczne testy jednostkowe'}
        run: npm test
      - name: ${isEn ? 'Build production bundle' : 'Budowanie paczki produkcyjnej'}
        run: npm run build`;

  const androidPlaySnippet = isEn
    ? `# 1. Build the production PWA bundle
npm run build

# 2. Build signed .AAB (Google Play) and .APK from android/
cd android
gradle bundleRelease assembleRelease

# Generated signed artifacts using android.keystore:
# -> android/app/build/outputs/bundle/release/app-release.aab
# -> android/app/build/outputs/apk/release/app-release.apk

# Or via Google Bubblewrap CLI:
npx @bubblewrap/cli build`
    : `# 1. Zbuduj produkcyjny bundle PWA
npm run build

# 2. Zbuduj podpisany plik .AAB (do Google Play) i .APK (na telefon) z katalogu android/
cd android
gradle bundleRelease assembleRelease

# Wygenerowane i podpisane kluczem android.keystore pliki:
# -> android/app/build/outputs/bundle/release/app-release.aab
# -> android/app/build/outputs/apk/release/app-release.apk

# Alternatywnie za pomocą Google Bubblewrap CLI:
npx @bubblewrap/cli build`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <BookOpen className="h-4 w-4" />
            <span>DevOps & Production Engineering</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isEn ? 'Local Setup & Production Deployment Guide' : 'Przewodnik Uruchomienia Lokalnego i Wdrożenia Produkcyjnego'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {isEn
              ? 'Step-by-step instructions to run the platform locally and deploy it to production with Docker, Nginx SSL, and OWASP security headers.'
              : 'Dokładne instrukcje krok po kroku pozwalające uruchomić platformę lokalnie oraz wdrożyć ją na serwer VPS z zachowaniem dobrych praktyk bezpieczeństwa (OWASP).'}
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setIsPlayStoreModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-extrabold transition-all shadow-lg shadow-indigo-600/30 shrink-0 flex items-center gap-2"
          >
            <PackageCheck className="h-4 w-4" />
            <span>{isEn ? 'Google Play Center (Admin)' : 'Centrum Google Play (Admin)'}</span>
          </button>
        )}
      </div>

      {/* SECTION 0: Google Play Store APK / AAB Highlight Card (Admin Only) */}
      {isAdmin && (
        <section className="rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Smartphone className="h-5 w-5" />
                <h2 className="text-white">
                  {isEn
                    ? 'Google Play Store Production Bundle (Admin Only — TWA v2.0.0)'
                    : 'Pakiet Produkcyjny Google Play Store (Tylko Administrator — TWA v2.0.0)'}
                </h2>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isEn ? (
                  <>
                    Includes a preconfigured Android Studio project (<code className="text-indigo-300">com.fullstackacademy.app</code>, <strong>Target SDK 35 / Android 15</strong>), release <code className="text-amber-300">android.keystore</code>, Digital Asset Links <code className="text-emerald-300">/.well-known/assetlinks.json</code>, GDPR Privacy Policy, and 9:16 store screenshots.
                  </>
                ) : (
                  <>
                    Projekt posiada skonfigurowany moduł Android Studio (<code className="text-indigo-300">com.fullstackacademy.app</code>, <strong>Target SDK 35 / Android 15</strong>), wygenerowany klucz podpisu <code className="text-amber-300">android.keystore</code>, plik weryfikacyjny <code className="text-emerald-300">/.well-known/assetlinks.json</code>, Politykę Prywatności RODO oraz gotowe zrzuty ekranu 9:16.
                  </>
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isDownloadingZip}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>
                  {isDownloadingZip
                    ? isEn ? 'Verifying...' : 'Weryfikacja...'
                    : isEn ? 'Download Package (.zip)' : 'Pobierz Pakiet (.zip)'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setIsPlayStoreModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition-colors"
              >
                {isEn ? 'Metadata, Keystore & Assets' : 'Metadane, Keystore & Grafiki'}
              </button>
            </div>
          </div>

          <CodeBlock 
            code={androidPlaySnippet}
            language="bash"
            title={isEn ? 'Compile signed .APK and .AAB (Android SDK 35)' : 'Kompilacja podpisanego pliku .APK i .AAB (Android SDK 35)'}
            badge="Google Play Ready"
            badgeColor="emerald"
          />
        </section>
      )}

      {/* SECTION 1: Local Setup */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
          <Terminal className="h-5 w-5" />
          <h2 className="text-white">{isEn ? '1. Local Setup (Development)' : '1. Uruchomienie lokalne (Development)'}</h2>
        </div>
        <p className="text-xs text-slate-300">
          {isEn
            ? 'Requirements: Node.js 20.x or newer, npm or bun package manager, and Git.'
            : 'Wymagania: Node.js w wersji 20.x lub nowszej, menedżer pakietów npm lub bun, Git.'}
        </p>

        <CodeBlock 
          code={localSetupCommands}
          language="bash"
          title="Terminal Bash / Zsh"
          badge={isEn ? 'Local install' : 'Instalacja lokalna'}
          badgeColor="emerald"
        />
      </section>

      {/* SECTION 2: Environment Variables */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Key className="h-5 w-5" />
          <h2 className="text-white">{isEn ? '2. Required Environment Variables (.env)' : '2. Wymagane zmienne środowiskowych (.env)'}</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="pb-2">{isEn ? 'Variable' : 'Zmienna'}</th>
                <th className="pb-2">{isEn ? 'Description' : 'Opis'}</th>
                <th className="pb-2">{isEn ? 'Example Value' : 'Przykładowa wartość'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 font-bold text-indigo-400">PORT</td>
                <td className="py-2.5">{isEn ? 'Application server port' : 'Port serwera aplikacji'}</td>
                <td className="py-2.5 text-slate-400">3000</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-indigo-400">NODE_ENV</td>
                <td className="py-2.5">{isEn ? 'Runtime environment' : 'Środowisko uruchomieniowe'}</td>
                <td className="py-2.5 text-slate-400">production / development</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-indigo-400">DATABASE_URL</td>
                <td className="py-2.5">{isEn ? 'PostgreSQL connection string' : 'Ciąg połączenia PostgreSQL'}</td>
                <td className="py-2.5 text-slate-400">postgresql://user:pass@localhost:5432/fsda</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-indigo-400">JWT_SECRET</td>
                <td className="py-2.5">{isEn ? 'Session signing secret (min. 64 chars)' : 'Klucz szyfrujący tokeny sesji (min. 64 znaki)'}</td>
                <td className="py-2.5 text-slate-400">openssl rand -base64 48</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 3: Docker Containerization */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
          <Layers className="h-5 w-5" />
          <h2 className="text-white">{isEn ? '3. Docker Containerization' : '3. Konteneryzacja z Docker'}</h2>
        </div>

        <CodeBlock 
          code={dockerfileSnippet}
          language="docker"
          title="Dockerfile (Multi-Stage Build)"
          badge="Docker"
          badgeColor="indigo"
        />

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
          <span className="text-slate-500">
            {isEn ? '# Build and launch the production container:' : '# Polecenia do zbudowania i uruchomienia kontenera produkcyjnego:'}
          </span>
          <div className="text-emerald-400">docker build -t fsda-app:latest .</div>
          <div className="text-cyan-400">docker run -d -p 3000:3000 --name fsda fsda-app:latest</div>
        </div>
      </section>

      {/* SECTION 4: Nginx & SSL */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Server className="h-5 w-5" />
          <h2 className="text-white">{isEn ? '4. VPS Production Deployment with Nginx & SSL (Certbot)' : '4. Wdrożenie produkcyjne VPS z Nginx i SSL (Certbot)'}</h2>
        </div>

        <CodeBlock 
          code={nginxConfigSnippet}
          language="bash"
          title={isEn ? 'Config /etc/nginx/sites-available/academy' : 'Konfiguracja /etc/nginx/sites-available/academy'}
          badge="Nginx & OWASP"
          badgeColor="amber"
        />

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
          <span className="text-slate-500">
            {isEn ? "# Let's Encrypt Certbot certificate for HTTPS:" : "# Certyfikat Let's Encrypt Certbot dla bezpiecznego HTTPS:"}
          </span>
          <div className="text-emerald-400">sudo apt install certbot python3-certbot-nginx</div>
          <div className="text-cyan-400">sudo certbot --nginx -d {isEn ? 'academy.yourdomain.com' : 'academy.twojadomena.pl'}</div>
        </div>
      </section>

      {/* SECTION 5: CI/CD Pipeline */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <ShieldCheck className="h-5 w-5" />
          <h2 className="text-white">{isEn ? '5. CI/CD Automation Pipeline (GitHub Actions)' : '5. Potok automatyzacji CI/CD (GitHub Actions)'}</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {isEn ? (
            <>
              Recommended automated workflow in <code className="prose-code-token text-indigo-300 bg-indigo-950/50 border-indigo-500/30">.github/workflows/ci.yml</code> and <code className="prose-code-token text-emerald-300 bg-emerald-950/50 border-emerald-500/30">.github/workflows/google-play-publish.yml</code>:
            </>
          ) : (
            <>
              Zalecany zautomatyzowany przepływ pracy w pliku <code className="prose-code-token text-indigo-300 bg-indigo-950/50 border-indigo-500/30">.github/workflows/ci.yml</code> oraz <code className="prose-code-token text-emerald-300 bg-emerald-950/50 border-emerald-500/30">.github/workflows/google-play-publish.yml</code>:
            </>
          )}
        </p>

        <CodeBlock 
          code={ciCdSnippet}
          language="yaml"
          title=".github/workflows/ci.yml"
          badge={isEn ? 'CI/CD Automation' : 'Automatyzacja CI/CD'}
          badgeColor="rose"
        />
      </section>

      <AndroidPlayStoreModal
        isOpen={isPlayStoreModalOpen}
        onClose={() => setIsPlayStoreModalOpen(false)}
      />

    </div>
  );
};
