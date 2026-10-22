import React from 'react';
import { 
  Terminal, 
  Server, 
  ShieldCheck, 
  Layers,
  Key,
  BookOpen
} from 'lucide-react';
import { CodeBlock } from './CodeBlock';

export const DeploymentGuideView: React.FC = () => {
  const localSetupCommands = `# 1. Klonowanie repozytorium platformy
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

  const dockerfileSnippet = `# Wielostopniowy, zoptymalizowany Dockerfile (Multi-stage build)
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

  const nginxConfigSnippet = `# Konfiguracja Nginx jako Reverse Proxy z obsługą SSL Let's Encrypt
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
      - name: Konfiguracja Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Instalacja bibliotek
        run: npm ci
      - name: Weryfikacja statyczna TypeScript
        run: npm run lint
      - name: Automatyczne testy jednostkowe
        run: npm test
      - name: Budowanie paczki produkcyjnej
        run: npm run build`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          <BookOpen className="h-4 w-4" />
          <span>DevOps & Production Engineering</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Przewodnik Uruchomienia Lokalnego i Wdrożenia Produkcyjnego
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Dokładne instrukcje krok po kroku pozwalające uruchomić platformę na własnym komputerze
          oraz wdrożyć ją na serwer produkcyjny z zachowaniem dobrych praktyk bezpieczeństwa (OWASP).
        </p>
      </div>

      {/* SECTION 1: Local Setup */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
          <Terminal className="h-5 w-5" />
          <h2 className="text-white">1. Uruchomienie lokalne (Development)</h2>
        </div>
        <p className="text-xs text-slate-300">
          Wymagania: Node.js w wersji 20.x lub nowszej, menedżer pakietów npm lub bun, Git.
        </p>

        <CodeBlock 
          code={localSetupCommands}
          language="bash"
          title="Terminal Bash / Zsh"
          badge="Instalacja lokalna"
          badgeColor="emerald"
        />
      </section>

      {/* SECTION 2: Environment Variables */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Key className="h-5 w-5" />
          <h2 className="text-white">2. Wymagane zmienne środowiskowe (.env)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="pb-2">Zmienna</th>
                <th className="pb-2">Opis</th>
                <th className="pb-2">Przykładowa wartość</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 font-bold text-indigo-400">PORT</td>
                <td className="py-2.5">Port serwera aplikacji</td>
                <td className="py-2.5 text-slate-400">3000</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-indigo-400">NODE_ENV</td>
                <td className="py-2.5">Środowisko uruchomieniowe</td>
                <td className="py-2.5 text-slate-400">production / development</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-indigo-400">DATABASE_URL</td>
                <td className="py-2.5">Ciąg połączenia PostgreSQL</td>
                <td className="py-2.5 text-slate-400">postgresql://user:pass@localhost:5432/fsda</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-indigo-400">JWT_SECRET</td>
                <td className="py-2.5">Klucz szyfrujący tokeny sesji (min. 64 znaki)</td>
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
          <h2 className="text-white">3. Konteneryzacja z Docker</h2>
        </div>

        <CodeBlock 
          code={dockerfileSnippet}
          language="docker"
          title="Dockerfile (Multi-Stage Build)"
          badge="Docker"
          badgeColor="indigo"
        />

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
          <span className="text-slate-500"># Polecenia do zbudowania i uruchomienia kontenera produkcyjnego:</span>
          <div className="text-emerald-400">docker build -t fsda-app:latest .</div>
          <div className="text-cyan-400">docker run -d -p 3000:3000 --name fsda fsda-app:latest</div>
        </div>
      </section>

      {/* SECTION 4: Nginx & SSL */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Server className="h-5 w-5" />
          <h2 className="text-white">4. Wdrożenie produkcyjne VPS z Nginx i SSL (Certbot)</h2>
        </div>

        <CodeBlock 
          code={nginxConfigSnippet}
          language="bash"
          title="Konfiguracja /etc/nginx/sites-available/academy"
          badge="Nginx & OWASP"
          badgeColor="amber"
        />

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
          <span className="text-slate-500"># Certyfikat Let's Encrypt Certbot dla bezpiecznego HTTPS:</span>
          <div className="text-emerald-400">sudo apt install certbot python3-certbot-nginx</div>
          <div className="text-cyan-400">sudo certbot --nginx -d academy.twojadomena.pl</div>
        </div>
      </section>

      {/* SECTION 5: CI/CD Pipeline */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <ShieldCheck className="h-5 w-5" />
          <h2 className="text-white">5. Potok automatyzacji CI/CD (GitHub Actions)</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Zalecany zautomatyzowany przepływ pracy w pliku <code className="prose-code-token text-indigo-300 bg-indigo-950/50 border-indigo-500/30">.github/workflows/ci.yml</code>:
        </p>

        <CodeBlock 
          code={ciCdSnippet}
          language="yaml"
          title=".github/workflows/ci.yml"
          badge="Automatyzacja CI/CD"
          badgeColor="rose"
        />
      </section>

    </div>
  );
};
