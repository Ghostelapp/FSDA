import { ProjectSourceFile } from '../types';

export const PROJECT_SOURCES_PART_1: Record<string, ProjectSourceFile[]> = {
  'proj-1': [
    {
      path: 'index.html',
      language: 'html',
      description: 'Kompletny, semantyczny dokument HTML5 z metatagami OpenGraph, nawigacją mobilną, sekcją Hero, projektami i dostępnym formularzem kontaktowym.',
      code: `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Portfolio Junior Full Stack Developera — projekty w HTML5, CSS3, React i Node.js." />
  <meta property="og:title" content="Jan Kowalski — Junior Full Stack Developer" />
  <meta property="og:description" content="Semantyczne aplikacje webowe, TypeScript, React oraz Node.js z PostgreSQL." />
  <meta property="og:type" content="website" />
  <title>Jan Kowalski — Junior Full Stack Developer</title>
  <link rel="stylesheet" href="styles/reset.css" />
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>
  <a class="skip-link" href="#main-content">Przejdź do treści głównej</a>

  <header class="site-header">
    <div class="container header-inner">
      <a href="#hero" class="brand">Jan Kowalski<span class="accent">.dev</span></a>

      <button
        id="menuToggle"
        type="button"
        class="menu-btn"
        aria-expanded="false"
        aria-controls="primaryNav"
        aria-label="Otwórz menu nawigacji"
      >
        Menu
      </button>

      <nav id="primaryNav" class="primary-nav" aria-label="Główna nawigacja">
        <ul class="nav-list">
          <li><a href="#o-mnie">O mnie</a></li>
          <li><a href="#umiejetnosci">Umiejętności</a></li>
          <li><a href="#projekty">Projekty</a></li>
          <li><a href="#kontakt">Kontakt</a></li>
        </ul>
      </nav>

      <button id="themeToggle" type="button" class="theme-btn" aria-label="Przełącz motyw kolorystyczny">
        Motyw: Auto
      </button>
    </div>
  </header>

  <main id="main-content">
    <section id="hero" class="hero container">
      <p class="badge">Dostępny na staż / Junior Full Stack</p>
      <h1>Buduję szybkie i dostępne aplikacje webowe.</h1>
      <p class="lead">
        Specjalizuję się w semantycznym HTML5, nowoczesnym CSS3, TypeScript, React oraz Node.js z PostgreSQL.
      </p>
      <div class="cta-row">
        <a href="#projekty" class="btn btn-primary">Zobacz projekty</a>
        <a href="#kontakt" class="btn btn-secondary">Napisz do mnie</a>
      </div>
    </section>

    <section id="o-mnie" class="section container">
      <h2>O mnie</h2>
      <p>
        Tworzę aplikacje internetowe od architektury bazy danych po responsywny interfejs użytkownika.
        Stawiam na czysty kod, testy automatyczne oraz standardy dostępności WCAG 2.1 AA.
      </p>
    </section>

    <section id="umiejetnosci" class="section container">
      <h2>Stack technologiczny</h2>
      <ul class="skills-grid">
        <li class="skill-card"><strong>HTML5 &amp; WCAG</strong><span>Semantyka, ARIA, SEO</span></li>
        <li class="skill-card"><strong>CSS3 Layout</strong><span>Flexbox, Grid, Mobile-First</span></li>
        <li class="skill-card"><strong>JavaScript / TS</strong><span>ES6+, Async/Await, typy</span></li>
        <li class="skill-card"><strong>React 19</strong><span>Komponenty, Hooki, Tailwind</span></li>
        <li class="skill-card"><strong>Node.js &amp; Express</strong><span>REST API, JWT, RBAC</span></li>
        <li class="skill-card"><strong>PostgreSQL</strong><span>SQL, Prisma ORM, Docker</span></li>
      </ul>
    </section>

    <section id="projekty" class="section container">
      <h2>Wybrane Projekty</h2>
      <div class="projects-grid">
        <article class="project-card">
          <h3>TaskFlow Kanban</h3>
          <p>Aplikacja do zarządzania zadaniami z HTML5 Drag &amp; Drop API, edycją kart oraz eksportem/importem JSON.</p>
          <div class="project-tags"><span>JS ES6+</span><span>Drag &amp; Drop</span><span>LocalStorage</span></div>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">Kod na GitHub →</a>
        </article>
        <article class="project-card">
          <h3>PulseAnalytics KPI</h3>
          <p>Dashboard analityczny w React i TypeScript z wykresem przychodów, paginacją i eksportem raportów CSV.</p>
          <div class="project-tags"><span>React 19</span><span>TypeScript</span><span>SVG Charts</span></div>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">Kod na GitHub →</a>
        </article>
      </div>
    </section>

    <section id="kontakt" class="section container">
      <h2>Kontakt</h2>
      <form id="contactForm" class="contact-form" novalidate>
        <div class="field">
          <label for="name">Imię i nazwisko</label>
          <input id="name" name="name" type="text" required minlength="2" autocomplete="name" placeholder="Np. Anna Nowak" />
          <small class="field-error" id="nameError" aria-live="polite"></small>
        </div>
        <div class="field">
          <label for="email">Adres e-mail</label>
          <input id="email" name="email" type="email" required autocomplete="email" placeholder="anna@firma.pl" />
          <small class="field-error" id="emailError" aria-live="polite"></small>
        </div>
        <div class="field">
          <label for="message">Wiadomość</label>
          <textarea id="message" name="message" rows="4" required minlength="10" placeholder="Opisz projekt lub propozycję..."></textarea>
          <small class="field-error" id="messageError" aria-live="polite"></small>
        </div>
        <button type="submit" class="btn btn-primary">Wyślij wiadomość</button>
        <p id="formStatus" role="status" aria-live="polite" class="form-status"></p>
      </form>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <p>© 2026 Jan Kowalski. Wszelkie prawa zastrzeżone.</p>
      <a href="#hero">Wróć na górę ↑</a>
    </div>
  </footer>

  <script src="app.js"></script>
</body>
</html>`,
    },
    {
      path: 'styles/reset.css',
      language: 'css',
      description: 'Nowoczesny reset CSS eliminujący różnice między przeglądarkami przy zachowaniu dostępności fokusu klawiatury.',
      code: `*, *::before, *::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
}

img, picture, svg, video {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

p, h1, h2, h3, h4 {
  overflow-wrap: break-word;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}`,
    },
    {
      path: 'styles/main.css',
      language: 'css',
      description: 'Arkusz stylów Mobile-First z obsługą zmiennych CSS, automatycznego trybu ciemnego oraz responsywnej siatki Grid/Flexbox.',
      code: `:root {
  --bg: #f8fafc;
  --surface: #ffffff;
  --text: #0f172a;
  --muted: #475569;
  --border: #cbd5e1;
  --accent: #4f46e5;
  --accent-hover: #4338ca;
  --danger: #dc2626;
  --success: #059669;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #020617;
    --surface: #0f172a;
    --text: #f8fafc;
    --muted: #94a3b8;
    --border: #1e293b;
    --accent: #6366f1;
    --accent-hover: #818cf8;
  }
}

:root[data-theme="light"] {
  --bg: #f8fafc;
  --surface: #ffffff;
  --text: #0f172a;
  --muted: #475569;
  --border: #cbd5e1;
}

:root[data-theme="dark"] {
  --bg: #020617;
  --surface: #0f172a;
  --text: #f8fafc;
  --muted: #94a3b8;
  --border: #1e293b;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

.skip-link {
  position: absolute;
  left: -999px;
  top: 8px;
  background: var(--accent);
  color: #fff;
  padding: 8px 14px;
  border-radius: 8px;
  z-index: 50;
}
.skip-link:focus { left: 12px; }

.container {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 20px;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  padding-bottom: 14px;
}

.brand {
  font-weight: 800;
  font-size: 1.15rem;
  color: var(--text);
  text-decoration: none;
}

.accent { color: var(--accent); }

.menu-btn,
.theme-btn {
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
}

.primary-nav {
  display: none;
  width: 100%;
}
.primary-nav.is-open { display: block; }

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
}

.nav-list a {
  color: var(--muted);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.92rem;
}

.nav-list a:hover,
.nav-list a:focus-visible {
  color: var(--accent);
}

.hero { padding: 52px 20px 32px; }
.badge {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent);
  margin: 0 0 10px;
}

h1 {
  font-size: clamp(1.9rem, 4.2vw, 3rem);
  line-height: 1.15;
  margin: 0 0 14px;
}

.lead { color: var(--muted); max-width: 62ch; margin: 0; }
.cta-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 20px;
  border-radius: 10px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color 0.2s ease, transform 0.15s ease;
}

.btn-primary { background: var(--accent); color: #ffffff; }
.btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
.btn-secondary { background: var(--surface); color: var(--text); border-color: var(--border); }

.section { padding: 32px 20px; scroll-margin-top: 76px; }
.skills-grid, .projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
}

.skill-card, .project-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px;
}

.skill-card { display: flex; flex-direction: column; gap: 4px; }
.skill-card span { font-size: 0.85rem; color: var(--muted); }
.project-card h3 { margin: 0 0 8px; }
.project-card p { margin: 0 0 12px; color: var(--muted); font-size: 0.92rem; }
.project-card a { color: var(--accent); font-weight: 700; text-decoration: none; font-size: 0.9rem; }
.project-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.project-tags span {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--bg);
  border: 1px solid var(--border);
}

.contact-form { display: grid; gap: 14px; max-width: 540px; margin-top: 14px; }
.field { display: grid; gap: 6px; }
.field label { font-weight: 600; font-size: 0.9rem; }
.field input, .field textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
}
.field input:focus-visible, .field textarea:focus-visible, button:focus-visible, a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.field-error { color: var(--danger); font-size: 0.8rem; min-height: 16px; }
.form-status { font-size: 0.92rem; font-weight: 600; margin: 4px 0 0; }

.site-footer {
  border-top: 1px solid var(--border);
  margin-top: 40px;
  padding: 20px 0;
}
.footer-inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.875rem;
  color: var(--muted);
}
.footer-inner a { color: var(--accent); text-decoration: none; font-weight: 600; }

@media (min-width: 768px) {
  .menu-btn { display: none; }
  .primary-nav { display: block; width: auto; }
  .nav-list { flex-direction: row; margin: 0; gap: 20px; }
  .skills-grid { grid-template-columns: repeat(3, 1fr); }
  .projects-grid { grid-template-columns: repeat(2, 1fr); }
}`,
    },
    {
      path: 'app.js',
      language: 'javascript',
      description: 'Obsługa przełącznika motywu z pamięcią w LocalStorage, mobilnego menu oraz walidacja każdego pola formularza kontaktowego.',
      code: `const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function applyTheme(theme) {
  if (theme === 'light' || theme === 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? 'Motyw: Ciemny' : 'Motyw: Jasny';
    }
  }
}

try {
  const savedTheme = localStorage.getItem('portfolio_theme');
  if (savedTheme) applyTheme(savedTheme);
} catch {
  // Ignore storage restrictions in private mode
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const active = current || (prefersDark ? 'dark' : 'light');
    const nextTheme = active === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try {
      localStorage.setItem('portfolio_theme', nextTheme);
    } catch {
      // Ignore storage errors
    }
  });
}

if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const messageEl = document.getElementById('message');
    const nameErr = document.getElementById('nameError');
    const emailErr = document.getElementById('emailError');
    const messageErr = document.getElementById('messageError');

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = messageEl.value.trim();

    nameErr.textContent = '';
    emailErr.textContent = '';
    messageErr.textContent = '';
    formStatus.textContent = '';

    let valid = true;
    if (name.length < 2) {
      nameErr.textContent = 'Podaj imię (minimum 2 znaki).';
      valid = false;
    }
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      emailErr.textContent = 'Wpisz poprawny adres e-mail (np. anna@firma.pl).';
      valid = false;
    }
    if (message.length < 10) {
      messageErr.textContent = 'Wiadomość powinna mieć minimum 10 znaków.';
      valid = false;
    }

    if (!valid) {
      formStatus.textContent = 'Popraw zaznaczone pola przed wysłaniem.';
      formStatus.style.color = 'var(--danger)';
      return;
    }

    formStatus.textContent = \`Dziękujemy, \${name}! Twoja wiadomość została zweryfikowana i wysłana.\`;
    formStatus.style.color = 'var(--success)';
    contactForm.reset();
  });
}`,
    },
    {
      path: 'README.md',
      language: 'markdown',
      description: 'Dokumentacja uruchomienia projektu lokalnie, lista kontrolna WCAG/Lighthouse oraz kroki wdrożenia na GitHub Pages lub Vercel.',
      code: `# Osobista Strona Portfolio Programisty

Kompletna, semantyczna i responsywna strona portfolio w czystym HTML5, CSS3 i JavaScript ES6+.

## Funkcje
- Semantyczna struktura HTML5 (\`header\`, \`nav\`, \`main\`, \`section\`, \`article\`, \`footer\`) + skip-link dla czytników ekranu
- Układ Mobile-First z responsywnym menu mobilnym i siatką CSS Grid
- Tryb jasny / ciemny (\`prefers-color-scheme\` + przełącznik zapisywany w \`localStorage\`)
- Formularz kontaktowy z walidacją każdego pola i komunikatami \`aria-live\`

## Uruchomienie lokalne
1. Rozpakuj archiwum i otwórz \`index.html\` bezpośrednio w przeglądarce lub uruchom serwer statyczny:
\`\`\`bash
npx serve .
\`\`\`

## Wdrożenie produkcyjne (Vercel / GitHub Pages)
\`\`\`bash
git init
git add .
git commit -m "feat: portfolio v1"
npx vercel --prod
\`\`\``,
    },
  ],

  'proj-2': [
    {
      path: 'index.html',
      language: 'html',
      description: 'Kompletny landing page platformy SaaS: przyklejona nawigacja z menu mobilnym, Hero CTA, 3-kolumnowa siatka funkcji, dynamiczny cennik i akordeon FAQ.',
      code: `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="CloudPulse SaaS — monitoring API, logów i czasów odpowiedzi 24/7." />
  <title>CloudPulse SaaS — Monitoring aplikacji na żywo</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header class="sticky-nav">
    <div class="container nav-wrap">
      <a href="#" class="logo">CloudPulse<span>.io</span></a>
      <button id="mobileNavBtn" type="button" class="mobile-menu-btn" aria-expanded="false" aria-controls="saasNav">
        Menu
      </button>
      <nav id="saasNav" class="nav-links" aria-label="Menu główne">
        <a href="#funkcje">Funkcje</a>
        <a href="#cennik">Cennik</a>
        <a href="#faq">FAQ</a>
      </nav>
      <a href="#cennik" class="btn-cta">Wypróbuj 14 dni</a>
    </div>
  </header>

  <main>
    <section class="hero container">
      <span class="pill">Nowość: Alerty w 3 sekundy</span>
      <h1>Wykrywaj błędy produkcyjne zanim zauważą je klienci.</h1>
      <p class="subtitle">
        Kompleksowy monitoring API, zapytań SQL oraz czasów odpowiedzi z natychmiastowymi alertami na Slacka, Discord i e-mail.
      </p>
      <div class="hero-actions">
        <a href="#cennik" class="btn-primary">Rozpocznij za darmo</a>
        <a href="#funkcje" class="btn-outline">Zobacz funkcje</a>
      </div>
    </section>

    <section id="funkcje" class="section container">
      <h2>Wszystko czego potrzebuje Twój zespół</h2>
      <div class="features-grid">
        <article class="card">
          <h3>Monitoring 24/7</h3>
          <p>Pingujemy Twoje endpointy co 15 sekund z 12 lokalizacji na świecie i wykrywamy spadki SLA.</p>
        </article>
        <article class="card">
          <h3>Analiza zapytań SQL</h3>
          <p>Wskazujemy wolne zapytania w PostgreSQL wraz z planem EXPLAIN zanim zablokują bazę.</p>
        </article>
        <article class="card">
          <h3>Raporty SLA</h3>
          <p>Automatyczne raporty dostępności generowane co miesiąc w formacie PDF dla klientów B2B.</p>
        </article>
      </div>
    </section>

    <section id="cennik" class="section container">
      <div class="pricing-header">
        <h2>Przejrzysty cennik</h2>
        <button id="billingSwitch" type="button" class="billing-btn" data-cycle="monthly" aria-pressed="false">
          Tryb: Miesięczny (kliknij, aby oszczędzić -20% rocznie)
        </button>
      </div>
      <div class="pricing-grid">
        <article class="price-card">
          <div>
            <h3>Starter</h3>
            <p class="price" data-monthly="0" data-yearly="0">0 zł / mies.</p>
            <ul class="plan-list">
              <li>Do 3 monitorowanych usług</li>
              <li>Powiadomienia e-mail</li>
              <li>Historia logów 7 dni</li>
            </ul>
          </div>
          <button type="button" class="btn-outline select-plan-btn" data-plan="Starter">Wybierz Starter</button>
        </article>

        <article class="price-card popular">
          <div>
            <span class="popular-tag">Najpopularniejszy</span>
            <h3>Pro Team</h3>
            <p class="price" data-monthly="99" data-yearly="79">99 zł / mies.</p>
            <ul class="plan-list">
              <li>Do 50 monitorowanych usług</li>
              <li>Alerty Slack, Discord i Webhook</li>
              <li>Historia logów 90 dni + raporty PDF</li>
            </ul>
          </div>
          <button type="button" class="btn-primary select-plan-btn" data-plan="Pro Team">Wybierz Pro</button>
        </article>

        <article class="price-card">
          <div>
            <h3>Enterprise</h3>
            <p class="price" data-monthly="349" data-yearly="279">349 zł / mies.</p>
            <ul class="plan-list">
              <li>Nielimitowane usługi i zespoły</li>
              <li>Dedykowany opiekun SLA 99.99%</li>
              <li>SSO SAML oraz audyt SOC2</li>
            </ul>
          </div>
          <button type="button" class="btn-outline select-plan-btn" data-plan="Enterprise">Wybierz Enterprise</button>
        </article>
      </div>
      <p id="planFeedback" role="status" aria-live="polite" class="plan-feedback"></p>
    </section>

    <section id="faq" class="section container">
      <h2>Najczęstsze pytania (FAQ)</h2>
      <div class="faq-list">
        <details open>
          <summary>Czy do okresu próbnego potrzebna jest karta płatnicza?</summary>
          <p>Nie. Testujesz plan Pro Team przez pełne 14 dni bez podawania danych karty.</p>
        </details>
        <details>
          <summary>Czy mogę anulować subskrypcję w dowolnym momencie?</summary>
          <p>Tak, rezygnacja zajmuje jedno kliknięcie w panelu rozliczeń bez okresu wypowiedzenia.</p>
        </details>
        <details>
          <summary>Jak szybko otrzymam alert w razie awarii API?</summary>
          <p>Alerty trafiają na Slacka, Discord lub Webhook w ciągu maksymalnie 3 sekund od wykrycia błędu 5xx.</p>
        </details>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer-grid">
      <p>© 2026 CloudPulse SaaS Sp. z o.o.</p>
      <form id="newsletterForm" class="newsletter" novalidate>
        <label for="newsEmail">Newsletter produktowy:</label>
        <input id="newsEmail" type="email" required placeholder="twoj@email.pl" />
        <button type="submit" class="btn-primary">Zapisz się</button>
        <span id="newsFeedback" role="status" aria-live="polite"></span>
      </form>
    </div>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>`,
    },
    {
      path: 'css/style.css',
      language: 'css',
      description: 'Stylizacja przyklejonej nawigacji ze scroll-margin-top, responsywnego menu, równych wysokości kart CSS Grid i akordeonu <details>.',
      code: `* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background: #0b1120;
  color: #f8fafc;
  line-height: 1.6;
}
.container { max-width: 1080px; margin: 0 auto; padding: 0 20px; }

.sticky-nav {
  position: sticky; top: 0; z-index: 30;
  background: rgba(11, 17, 32, 0.94);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #1e293b;
}
.nav-wrap {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
  gap: 12px; padding-top: 14px; padding-bottom: 14px;
}
.logo { font-weight: 800; color: #fff; text-decoration: none; font-size: 1.2rem; }
.logo span { color: #818cf8; }
.mobile-menu-btn {
  background: #1e293b; color: #f8fafc; border: 1px solid #334155;
  border-radius: 8px; padding: 6px 12px; font-weight: 600; cursor: pointer;
}
.nav-links { display: none; width: 100%; flex-direction: column; gap: 10px; }
.nav-links.open { display: flex; }
.nav-links a { color: #94a3b8; text-decoration: none; font-size: 0.92rem; font-weight: 600; }
.nav-links a:hover { color: #fff; }

.hero { padding: 64px 20px 44px; text-align: center; }
.pill {
  display: inline-block; padding: 5px 14px; border-radius: 999px;
  background: rgba(99, 102, 241, 0.16); border: 1px solid rgba(99, 102, 241, 0.45);
  color: #a5b4fc; font-size: 0.8rem; font-weight: 700;
}
.hero h1 { font-size: clamp(1.9rem, 4.5vw, 3.1rem); max-width: 19ch; margin: 16px auto; line-height: 1.15; }
.subtitle { color: #94a3b8; max-width: 58ch; margin: 0 auto 24px; }
.hero-actions { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }

.btn-primary, .btn-cta {
  background: #4f46e5; color: #fff; border: 0; border-radius: 10px;
  padding: 11px 18px; font-weight: 700; cursor: pointer; text-decoration: none;
  transition: transform 0.15s ease, background-color 0.2s ease;
}
.btn-primary:hover, .btn-cta:hover { background: #6366f1; transform: translateY(-1px); }
.btn-outline {
  background: transparent; color: #e2e8f0; border: 1px solid #334155;
  border-radius: 10px; padding: 11px 18px; font-weight: 700; cursor: pointer; text-decoration: none;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}
.btn-outline:hover { border-color: #6366f1; background: rgba(99, 102, 241, 0.08); }

.section { padding: 48px 20px; scroll-margin-top: 76px; }
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
.card, .price-card {
  display: flex; flex-direction: column; justify-content: space-between;
  background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 24px;
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.card:hover, .price-card:hover { transform: translateY(-2px); border-color: #334155; }
.pricing-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 18px; }
.billing-btn {
  background: #1e293b; color: #cbd5e1; border: 1px solid #334155;
  padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600;
}
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  align-items: stretch;
}
.price-card.popular { border-color: #6366f1; box-shadow: 0 12px 32px -12px rgba(79, 70, 229, 0.45); }
.popular-tag {
  display: inline-block; background: #4f46e5; color: #fff;
  font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 999px; margin-bottom: 8px;
}
.price { font-size: 1.9rem; font-weight: 800; margin: 10px 0; }
.plan-list { padding-left: 18px; color: #cbd5e1; font-size: 0.9rem; margin: 0 0 20px; }
.plan-feedback { margin-top: 14px; font-size: 0.9rem; font-weight: 600; color: #34d399; min-height: 22px; }

.faq-list { display: grid; gap: 12px; }
details {
  background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 16px;
}
summary { font-weight: 700; cursor: pointer; list-style: none; display: flex; justify-content: space-between; }
summary::after { content: '+'; color: #818cf8; font-size: 1.2rem; }
details[open] summary::after { content: '−'; }
details p { color: #94a3b8; margin: 10px 0 0; }

.footer { border-top: 1px solid #1e293b; padding: 28px 0; margin-top: 40px; }
.footer-grid { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; }
.newsletter { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.newsletter input { padding: 9px 12px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: #fff; }

@media (min-width: 768px) {
  .mobile-menu-btn { display: none; }
  .nav-links { display: flex; width: auto; flex-direction: row; gap: 20px; }
}`,
    },
    {
      path: 'js/main.js',
      language: 'javascript',
      description: 'Obsługa mobilnego menu, przełącznika rozliczeń miesięczny/roczny (-20%), wyboru planu oraz walidacji zapisu do newslettera.',
      code: `const mobileNavBtn = document.getElementById('mobileNavBtn');
const saasNav = document.getElementById('saasNav');
const billingSwitch = document.getElementById('billingSwitch');
const priceNodes = document.querySelectorAll('.price');
const planButtons = document.querySelectorAll('.select-plan-btn');
const planFeedback = document.getElementById('planFeedback');
const newsletterForm = document.getElementById('newsletterForm');
const newsFeedback = document.getElementById('newsFeedback');

if (mobileNavBtn && saasNav) {
  mobileNavBtn.addEventListener('click', () => {
    const open = saasNav.classList.toggle('open');
    mobileNavBtn.setAttribute('aria-expanded', String(open));
  });
}

if (billingSwitch) {
  billingSwitch.addEventListener('click', () => {
    const isMonthly = billingSwitch.dataset.cycle === 'monthly';
    const nextCycle = isMonthly ? 'yearly' : 'monthly';
    billingSwitch.dataset.cycle = nextCycle;
    billingSwitch.setAttribute('aria-pressed', String(nextCycle === 'yearly'));

    billingSwitch.textContent =
      nextCycle === 'yearly'
        ? 'Tryb: Roczny (-20% — kliknij, aby wrócić do miesięcznego)'
        : 'Tryb: Miesięczny (kliknij, aby oszczędzić -20% rocznie)';

    priceNodes.forEach((node) => {
      const value = node.dataset[nextCycle];
      node.textContent = \`\${value} zł / mies.\`;
    });
  });
}

planButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const cycle = billingSwitch?.dataset.cycle === 'yearly' ? 'roczny (-20%)' : 'miesięczny';
    if (planFeedback) {
      planFeedback.textContent = \`Wybrano pakiet \${btn.dataset.plan} (rozliczenie: \${cycle}). Rozpoczynasz 14-dniowy okres próbny!\`;
    }
  });
});

if (newsletterForm && newsFeedback) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsEmail');
    const email = emailInput ? emailInput.value.trim() : '';
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      newsFeedback.textContent = 'Podaj poprawny e-mail.';
      newsFeedback.style.color = '#f87171';
      return;
    }
    newsFeedback.textContent = \`Zapisano adres \${email} do newslettera!\`;
    newsFeedback.style.color = '#34d399';
    newsletterForm.reset();
  });
}`,
    },
    {
      path: 'README.md',
      language: 'markdown',
      description: 'Instrukcja uruchomienia landing page CloudPulse SaaS oraz wdrożenia na Netlify lub Cloudflare Pages.',
      code: `# CloudPulse SaaS — Responsywny Landing Page

Kompletna strona firmowa SaaS zbudowana w HTML5, CSS Grid/Flexbox oraz czystym JS.

## Elementy projektu
- Przyklejona nawigacja (\`sticky\`) ze \`scroll-margin-top\` i menu mobilnym
- 3-kolumnowa siatka funkcji oraz 3-kolumnowy cennik równej wysokości z przełącznikiem miesięczny / roczny (-20%)
- Natywny, dostępny z klawiatury akordeon FAQ (\`<details>\` + \`<summary>\`)
- Formularz newslettera z walidacją adresu e-mail

## Uruchomienie i deploy
\`\`\`bash
npx serve .
# Deploy na Netlify:
npx netlify-cli deploy --prod --dir=.
\`\`\``,
    },
  ],

  'proj-3': [
    {
      path: 'index.html',
      language: 'html',
      description: 'Interfejs kalkulatora programistycznego z wyświetlaczem, klawiaturą numeryczną, konwersją BIN/OCT/HEX oraz listą historii.',
      code: `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kalkulator Programistyczny BIN / OCT / HEX</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main class="calc-wrapper">
    <section class="calculator" aria-label="Kalkulator programistyczny">
      <div class="display-box">
        <div id="expressionPreview" class="expression">0</div>
        <input id="display" type="text" readonly value="0" aria-label="Wynik obliczeń" />
        <div class="radix-grid">
          <div id="binOut">BIN: 0</div>
          <div id="octOut">OCT: 0</div>
          <div id="hexOut">HEX: 0</div>
        </div>
      </div>

      <div class="keys-grid" id="keypad">
        <button type="button" data-action="clear" class="key key-muted">AC</button>
        <button type="button" data-action="backspace" class="key key-muted">⌫</button>
        <button type="button" data-value="/" class="key key-op">÷</button>
        <button type="button" data-value="*" class="key key-op">×</button>

        <button type="button" data-value="7" class="key">7</button>
        <button type="button" data-value="8" class="key">8</button>
        <button type="button" data-value="9" class="key">9</button>
        <button type="button" data-value="-" class="key key-op">−</button>

        <button type="button" data-value="4" class="key">4</button>
        <button type="button" data-value="5" class="key">5</button>
        <button type="button" data-value="6" class="key">6</button>
        <button type="button" data-value="+" class="key key-op">+</button>

        <button type="button" data-value="1" class="key">1</button>
        <button type="button" data-value="2" class="key">2</button>
        <button type="button" data-value="3" class="key">3</button>
        <button type="button" data-action="equals" class="key key-eq">=</button>

        <button type="button" data-value="0" class="key key-zero">0</button>
        <button type="button" data-value="." class="key">.</button>
      </div>
      <p class="kbd-hint">Skróty: 0–9, + − * /, Enter (=), Backspace (⌫), Escape (AC)</p>
    </section>

    <aside class="history-panel">
      <div class="history-head">
        <h2>Historia (ostatnie 10)</h2>
        <button id="clearHistoryBtn" type="button">Wyczyść</button>
      </div>
      <ul id="historyList" class="history-list"></ul>
    </aside>
  </main>

  <script src="app.js"></script>
</body>
</html>`,
    },
    {
      path: 'style.css',
      language: 'css',
      description: 'Ciemny interfejs kalkulatora w CSS Grid z wyróżnionymi operatorami i responsywnym panelem historii.',
      code: `* { box-sizing: border-box; }
body {
  margin: 0;
  padding: 20px;
  font-family: system-ui, -apple-system, sans-serif;
  background: #020617;
  color: #f8fafc;
}
.calc-wrapper {
  max-width: 780px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
.calculator, .history-panel {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 16px;
  padding: 18px;
}
.display-box {
  background: #020617;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 14px;
}
.expression { font-size: 0.78rem; color: #64748b; text-align: right; min-height: 18px; }
#display {
  width: 100%; border: 0; background: transparent; color: #fff;
  font-size: 1.9rem; font-weight: 700; text-align: right; outline: none;
  font-family: ui-monospace, monospace;
}
.radix-grid {
  display: grid; gap: 4px; margin-top: 8px; padding-top: 8px;
  border-top: 1px solid #1e293b;
  font-family: ui-monospace, monospace; font-size: 0.78rem; color: #38bdf8;
}
.keys-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
}
.key {
  padding: 14px; border-radius: 10px; border: 1px solid #1e293b;
  background: #1e293b; color: #f8fafc; font-size: 1rem; font-weight: 700;
  cursor: pointer; transition: background-color 0.15s ease;
}
.key:hover { background: #334155; }
.key-op { background: #312e81; color: #c7d2fe; }
.key-eq { background: #4f46e5; color: #fff; grid-row: span 2; }
.key-zero { grid-column: span 2; }
.key-muted { background: #0f172a; color: #94a3b8; }
.kbd-hint { margin: 12px 0 0; font-size: 0.72rem; color: #64748b; text-align: center; }
.history-head { display: flex; justify-content: space-between; align-items: center; }
.history-head h2 { font-size: 1rem; margin: 0; }
.history-head button {
  background: #1e293b; color: #cbd5e1; border: 1px solid #334155;
  padding: 5px 10px; border-radius: 8px; cursor: pointer; font-size: 0.75rem;
}
.history-list { list-style: none; padding: 0; margin: 12px 0 0; display: grid; gap: 6px; }
.history-item {
  display: flex; justify-content: space-between; width: 100%;
  padding: 8px 10px; border-radius: 8px; background: #020617;
  border: 1px solid #1e293b; color: #cbd5e1; cursor: pointer;
  font-family: ui-monospace, monospace; font-size: 0.8rem;
}
.history-item:hover { border-color: #6366f1; color: #fff; }`,
    },
    {
      path: 'app.js',
      language: 'javascript',
      description: 'Bezpieczny silnik matematyczny (Shunting-Yard bez eval()) obsługujący liczby ujemne, precyzję 0.1+0.2=0.3, BIN/OCT/HEX, klawiaturę i LocalStorage.',
      code: `const STORAGE_KEY = 'dev_calc_history_v1';
const displayEl = document.getElementById('display');
const exprEl = document.getElementById('expressionPreview');
const binOut = document.getElementById('binOut');
const octOut = document.getElementById('octOut');
const hexOut = document.getElementById('hexOut');
const historyList = document.getElementById('historyList');

let currentInput = '0';
let history = [];
try {
  history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
} catch {
  history = [];
}

function formatFloatPrecision(num) {
  return Number(num.toPrecision(12));
}

function tokenizeExpression(raw) {
  const cleaned = raw.replace(/\\s+/g, '');
  const tokens = [];
  let i = 0;

  while (i < cleaned.length) {
    const ch = cleaned[i];
    const prev = tokens[tokens.length - 1];
    const isUnaryMinus = ch === '-' && (tokens.length === 0 || ['+', '-', '*', '/'].includes(prev));

    if (/[0-9.]/.test(ch) || isUnaryMinus) {
      let numStr = ch;
      i += 1;
      while (i < cleaned.length && /[0-9.]/.test(cleaned[i])) {
        numStr += cleaned[i];
        i += 1;
      }
      if (Number.isNaN(Number(numStr))) throw new Error('Błędna liczba');
      tokens.push(numStr);
      continue;
    }

    if (['+', '-', '*', '/'].includes(ch)) {
      tokens.push(ch);
      i += 1;
      continue;
    }

    throw new Error('Nieznany znak');
  }
  return tokens;
}

function evaluateArithmetic(expr) {
  const tokens = tokenizeExpression(expr);
  if (!tokens.length) throw new Error('Błąd składni');

  const values = [];
  const ops = [];
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

  const applyTopOp = () => {
    const op = ops.pop();
    const b = values.pop();
    const a = values.pop();
    if (a === undefined || b === undefined) throw new Error('Błędne wyrażenie');
    if (op === '/' && b === 0) throw new Error('Dzielenie przez zero');
    if (op === '+') values.push(a + b);
    if (op === '-') values.push(a - b);
    if (op === '*') values.push(a * b);
    if (op === '/') values.push(a / b);
  };

  for (const token of tokens) {
    if (!['+', '-', '*', '/'].includes(token)) {
      values.push(Number(token));
    } else {
      while (ops.length && precedence[ops[ops.length - 1]] >= precedence[token]) {
        applyTopOp();
      }
      ops.push(token);
    }
  }
  while (ops.length) applyTopOp();
  if (values.length !== 1 || !Number.isFinite(values[0])) {
    throw new Error('Nieprawidłowy wynik');
  }
  return formatFloatPrecision(values[0]);
}

function updateRadixDisplays(numValue) {
  const intPart = Math.trunc(Number(numValue));
  if (!Number.isFinite(intPart)) {
    binOut.textContent = 'BIN: —';
    octOut.textContent = 'OCT: —';
    hexOut.textContent = 'HEX: —';
    return;
  }
  const sign = intPart < 0 ? '-' : '';
  const abs = Math.abs(intPart);
  binOut.textContent = 'BIN: ' + sign + abs.toString(2);
  octOut.textContent = 'OCT: ' + sign + abs.toString(8);
  hexOut.textContent = 'HEX: ' + sign + abs.toString(16).toUpperCase();
}

function renderHistory() {
  historyList.innerHTML = '';
  if (!history.length) {
    const empty = document.createElement('li');
    empty.style.color = '#64748b';
    empty.style.fontSize = '0.8rem';
    empty.textContent = 'Brak zapisanych obliczeń.';
    historyList.appendChild(empty);
    return;
  }
  history.forEach((entry) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'history-item';
    btn.textContent = \`\${entry.expr} = \${entry.result}\`;
    btn.addEventListener('click', () => {
      currentInput = String(entry.result);
      displayEl.value = currentInput;
      updateRadixDisplays(entry.result);
    });
    li.appendChild(btn);
    historyList.appendChild(li);
  });
}

function appendValue(val) {
  currentInput = currentInput === '0' && val !== '.' ? val : currentInput + val;
  displayEl.value = currentInput;
  updateRadixDisplays(Number(currentInput));
}

function backspace() {
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
  displayEl.value = currentInput;
  updateRadixDisplays(Number(currentInput));
}

function resetAll() {
  currentInput = '0';
  exprEl.textContent = '0';
  displayEl.value = '0';
  updateRadixDisplays(0);
}

function calculateResult() {
  try {
    const result = evaluateArithmetic(currentInput);
    exprEl.textContent = currentInput + ' =';
    history = [{ expr: currentInput, result }, ...history].slice(0, 10);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignore storage errors
    }
    currentInput = String(result);
    displayEl.value = currentInput;
    updateRadixDisplays(result);
    renderHistory();
  } catch (err) {
    displayEl.value = err.message;
    currentInput = '0';
  }
}

document.getElementById('keypad').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  if (btn.dataset.value) appendValue(btn.dataset.value);
  if (btn.dataset.action === 'clear') resetAll();
  if (btn.dataset.action === 'backspace') backspace();
  if (btn.dataset.action === 'equals') calculateResult();
});

document.getElementById('clearHistoryBtn').addEventListener('click', () => {
  history = [];
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
  renderHistory();
});

window.addEventListener('keydown', (e) => {
  if (/^[0-9+\\-*/.]$/.test(e.key)) appendValue(e.key);
  if (e.key === 'Backspace') backspace();
  if (e.key === 'Enter') {
    e.preventDefault();
    calculateResult();
  }
  if (e.key === 'Escape') resetAll();
});

renderHistory();
updateRadixDisplays(0);`,
    },
    {
      path: 'README.md',
      language: 'markdown',
      description: 'Opis architektury parsera Shunting-Yard, obsługi IEEE-754 i uruchomienia kalkulatora.',
      code: `# Kalkulator Programistyczny & Konwerter BIN/OCT/HEX

Interaktywny kalkulator w czystym JavaScript ES6+ bez użycia niebezpiecznego \`eval()\`.

## Kluczowe mechanizmy
- Własny parser wyrażeń arytmetycznych (algorytm Shunting-Yard) z obsługą kolejności działań i liczb ujemnych
- Eliminacja błędów zmiennoprzecinkowych (\`0.1 + 0.2 === 0.3\`)
- Konwersja na żywo na systemy BIN, OCT oraz HEX
- Pełna obsługa klawiatury (\`Enter\`, \`Backspace\`, \`Escape\`) oraz historia ostatnich 10 działań w \`localStorage\`

## Uruchomienie
Otwórz \`index.html\` w przeglądarce lub uruchom \`npx serve .\`.`,
    },
  ],

  'proj-4': [
    {
      path: 'index.html',
      language: 'html',
      description: 'Kompletna tablica TaskFlow Kanban z formularzem (tytuł, opis, priorytet, termin), filtrami, eksportem/importem JSON i oknem edycji <dialog>.',
      code: `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TaskFlow — Tablica Kanban</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="topbar">
    <h1>TaskFlow Kanban</h1>
    <div class="filters">
      <input id="searchInput" type="search" placeholder="Szukaj zadania..." aria-label="Szukaj zadania" />
      <select id="priorityFilter" aria-label="Filtruj po priorytecie">
        <option value="all">Wszystkie priorytety</option>
        <option value="high">Wysoki</option>
        <option value="medium">Średni</option>
        <option value="low">Niski</option>
      </select>
      <button id="exportBtn" type="button" class="btn-secondary">Eksport JSON</button>
      <label class="btn-secondary import-label">
        Import JSON
        <input id="importInput" type="file" accept="application/json" hidden />
      </label>
    </div>
  </header>

  <main class="container">
    <form id="taskForm" class="task-form">
      <input id="taskTitle" type="text" required placeholder="Tytuł zadania..." aria-label="Tytuł zadania" />
      <input id="taskDesc" type="text" placeholder="Krótki opis (opcjonalny)..." aria-label="Opis zadania" />
      <select id="taskPriority" aria-label="Priorytet">
        <option value="medium">Średni priorytet</option>
        <option value="high">Wysoki priorytet</option>
        <option value="low">Niski priorytet</option>
      </select>
      <input id="taskDueDate" type="date" aria-label="Termin realizacji" />
      <button type="submit">Dodaj zadanie</button>
    </form>

    <p id="boardFeedback" class="board-feedback" role="status" aria-live="polite"></p>

    <section class="board" aria-label="Kolumny tablicy Kanban">
      <div class="column" data-status="todo">
        <div class="col-head">
          <h2>Do zrobienia</h2>
          <span class="col-count" id="count-todo">0</span>
        </div>
        <div class="task-list" id="col-todo"></div>
      </div>
      <div class="column" data-status="in-progress">
        <div class="col-head">
          <h2>W toku</h2>
          <span class="col-count" id="count-in-progress">0</span>
        </div>
        <div class="task-list" id="col-in-progress"></div>
      </div>
      <div class="column" data-status="done">
        <div class="col-head">
          <h2>Ukończone</h2>
          <span class="col-count" id="count-done">0</span>
        </div>
        <div class="task-list" id="col-done"></div>
      </div>
    </section>
  </main>

  <dialog id="editDialog" class="edit-dialog">
    <form id="editForm" method="dialog" class="edit-form">
      <h3>Edytuj zadanie</h3>
      <input id="editId" type="hidden" />
      <label>Tytuł <input id="editTitle" type="text" required /></label>
      <label>Opis <textarea id="editDesc" rows="3"></textarea></label>
      <label>Priorytet
        <select id="editPriority">
          <option value="high">Wysoki</option>
          <option value="medium">Średni</option>
          <option value="low">Niski</option>
        </select>
      </label>
      <label>Termin <input id="editDueDate" type="date" /></label>
      <div class="dialog-actions">
        <button id="cancelEditBtn" type="button" class="btn-secondary">Anuluj</button>
        <button type="submit">Zapisz zmiany</button>
      </div>
    </form>
  </dialog>

  <script type="module" src="src/dragDrop.js"></script>
</body>
</html>`,
    },
    {
      path: 'styles.css',
      language: 'css',
      description: 'Układ 3-kolumnowy CSS Grid z podświetleniem kolumny (.drag-over), licznikami kart, priorytetami oraz stylem modala <dialog>.',
      code: `* { box-sizing: border-box; }
body {
  margin: 0; font-family: system-ui, sans-serif;
  background: #0b1120; color: #f8fafc;
}
.topbar {
  display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center;
  gap: 12px; padding: 16px 24px; background: #0f172a; border-bottom: 1px solid #1e293b;
}
.topbar h1 { margin: 0; font-size: 1.25rem; }
.filters { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.container { max-width: 1140px; margin: 0 auto; padding: 20px; }
.task-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 10px;
  margin-bottom: 14px;
}
input, select, textarea, button, .import-label {
  padding: 9px 12px; border-radius: 8px; border: 1px solid #334155;
  background: #0f172a; color: #f8fafc; font: inherit; font-size: 0.88rem;
}
button { background: #4f46e5; border-color: #4f46e5; font-weight: 700; cursor: pointer; }
.btn-secondary, .import-label {
  background: #1e293b; border-color: #334155; color: #e2e8f0;
  font-weight: 600; cursor: pointer; display: inline-flex; align-items: center;
}
.board-feedback { font-size: 0.82rem; color: #38bdf8; min-height: 20px; margin: 0 0 12px; }
.board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(195px, 1fr));
  gap: 14px;
}
.column {
  background: #0f172a; border: 1px solid #1e293b; border-radius: 14px;
  padding: 14px; min-height: 340px; transition: border-color 0.15s ease, background-color 0.15s ease;
}
.column.drag-over { border-color: #6366f1; background: #1e1b4b; }
.col-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.col-head h2 { font-size: 0.95rem; margin: 0; color: #cbd5e1; }
.col-count {
  font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 999px;
  background: #1e293b; color: #94a3b8;
}
.task-list { display: grid; gap: 10px; }
.task-card {
  background: #020617; border: 1px solid #1e293b; border-radius: 10px;
  padding: 12px; cursor: grab; display: grid; gap: 6px;
}
.task-card:active { cursor: grabbing; opacity: 0.7; }
.task-desc { margin: 0; font-size: 0.8rem; color: #94a3b8; }
.task-meta { font-size: 0.72rem; color: #64748b; }
.priority-high { border-left: 4px solid #ef4444; }
.priority-medium { border-left: 4px solid #f59e0b; }
.priority-low { border-left: 4px solid #10b981; }
.card-actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.card-btn {
  padding: 4px 8px; font-size: 0.74rem; background: #1e293b;
  border-color: #334155; color: #cbd5e1;
}
.edit-dialog {
  background: #0f172a; color: #f8fafc; border: 1px solid #334155;
  border-radius: 14px; padding: 20px; width: min(440px, 92vw);
}
.edit-dialog::backdrop { background: rgba(2, 6, 23, 0.78); }
.edit-form { display: grid; gap: 12px; }
.edit-form label { display: grid; gap: 4px; font-size: 0.85rem; font-weight: 600; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px; }`,
    },
    {
      path: 'src/state.js',
      language: 'javascript',
      description: 'Klasa TaskManager zarządzająca zadaniami (CRUD, priorytety, terminy), trwałością LocalStorage, filtrowaniem oraz eksportem i importem JSON.',
      code: `const KANBAN_KEY = 'taskflow_kanban_v2';
const VALID_STATUSES = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

export class TaskManager {
  constructor() {
    let saved = null;
    try {
      saved = localStorage.getItem(KANBAN_KEY);
    } catch {
      saved = null;
    }
    this.tasks = saved
      ? JSON.parse(saved)
      : [
          {
            id: 't-1',
            title: 'Skonfigurować repozytorium Git',
            description: 'Dodać .gitignore oraz pierwszy commit na gałęzi main.',
            priority: 'high',
            dueDate: '2026-11-30',
            status: 'todo',
          },
          {
            id: 't-2',
            title: 'Wdrożyć HTML5 Drag & Drop',
            description: 'Obsłużyć przeciąganie kart między 3 kolumnami Kanban.',
            priority: 'medium',
            dueDate: '2026-12-02',
            status: 'in-progress',
          },
          {
            id: 't-3',
            title: 'Przygotować układ Mobile-First',
            description: 'Siatka CSS Grid dopasowująca się do szerokości ekranu.',
            priority: 'low',
            dueDate: '2026-11-25',
            status: 'done',
          },
        ];
  }

  save() {
    try {
      localStorage.setItem(KANBAN_KEY, JSON.stringify(this.tasks));
    } catch {
      // Ignore storage errors
    }
  }

  addTask({ title, description = '', priority = 'medium', dueDate = '' }) {
    const cleanTitle = String(title || '').trim();
    if (!cleanTitle) return null;
    const task = {
      id: 't-' + Date.now(),
      title: cleanTitle,
      description: String(description || '').trim(),
      priority: VALID_PRIORITIES.includes(priority) ? priority : 'medium',
      dueDate: String(dueDate || ''),
      status: 'todo',
    };
    this.tasks.unshift(task);
    this.save();
    return task;
  }

  updateTask(taskId, patch) {
    const target = this.tasks.find((t) => t.id === taskId);
    if (!target) return null;
    const cleanTitle = String(patch.title || '').trim();
    if (!cleanTitle) return null;
    target.title = cleanTitle;
    target.description = String(patch.description || '').trim();
    target.priority = VALID_PRIORITIES.includes(patch.priority) ? patch.priority : target.priority;
    target.dueDate = String(patch.dueDate || '');
    this.save();
    return target;
  }

  moveTask(taskId, nextStatus) {
    if (!VALID_STATUSES.includes(nextStatus)) return;
    const target = this.tasks.find((t) => t.id === taskId);
    if (!target) return;
    target.status = nextStatus;
    this.save();
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter((t) => t.id !== taskId);
    this.save();
  }

  filterTasks(query = '', priority = 'all') {
    const q = query.trim().toLowerCase();
    return this.tasks.filter((task) => {
      const matchesText =
        !q ||
        task.title.toLowerCase().includes(q) ||
        (task.description || '').toLowerCase().includes(q);
      const matchesPrio = priority === 'all' || task.priority === priority;
      return matchesText && matchesPrio;
    });
  }

  exportJSON() {
    const blob = new Blob([JSON.stringify(this.tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'taskflow-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  importJSON(rawJsonText) {
    const parsed = JSON.parse(rawJsonText);
    if (!Array.isArray(parsed)) {
      throw new Error('Plik backupu musi zawierać tablicę zadań JSON.');
    }
    const sanitized = parsed
      .filter((item) => item && typeof item.title === 'string' && item.title.trim().length > 0)
      .map((item, idx) => ({
        id: typeof item.id === 'string' ? item.id : 'imp-' + Date.now() + '-' + idx,
        title: item.title.trim(),
        description: typeof item.description === 'string' ? item.description.trim() : '',
        priority: VALID_PRIORITIES.includes(item.priority) ? item.priority : 'medium',
        dueDate: typeof item.dueDate === 'string' ? item.dueDate : '',
        status: VALID_STATUSES.includes(item.status) ? item.status : 'todo',
      }));

    if (sanitized.length === 0) {
      throw new Error('Nie znaleziono poprawnych zadań w pliku JSON.');
    }
    this.tasks = sanitized;
    this.save();
    return sanitized.length;
  }
}`,
    },
    {
      path: 'src/dom.js',
      language: 'javascript',
      description: 'Moduł bezpiecznego renderowania kart Kanban (ochrona XSS przez textContent), liczników kolumn oraz obsługi modala edycji <dialog>.',
      code: `const NEXT_STATUS = {
  todo: 'in-progress',
  'in-progress': 'done',
  done: 'todo',
};

const NEXT_LABEL = {
  todo: '→ W toku',
  'in-progress': '→ Zakończ',
  done: '↺ Wznów',
};

export function renderKanbanBoard({ manager, query, priority, onEdit, onMutate }) {
  const columns = {
    todo: document.getElementById('col-todo'),
    'in-progress': document.getElementById('col-in-progress'),
    done: document.getElementById('col-done'),
  };
  const counts = { todo: 0, 'in-progress': 0, done: 0 };

  Object.values(columns).forEach((col) => {
    col.innerHTML = '';
  });

  const visibleTasks = manager.filterTasks(query, priority);

  visibleTasks.forEach((task) => {
    counts[task.status] = (counts[task.status] || 0) + 1;

    const card = document.createElement('article');
    card.className = \`task-card priority-\${task.priority}\`;
    card.setAttribute('draggable', 'true');
    card.dataset.id = task.id;

    const titleEl = document.createElement('strong');
    titleEl.textContent = task.title;
    card.appendChild(titleEl);

    if (task.description) {
      const descEl = document.createElement('p');
      descEl.className = 'task-desc';
      descEl.textContent = task.description;
      card.appendChild(descEl);
    }

    if (task.dueDate) {
      const metaEl = document.createElement('div');
      metaEl.className = 'task-meta';
      metaEl.textContent = \`Termin: \${task.dueDate}\`;
      card.appendChild(metaEl);
    }

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const moveBtn = document.createElement('button');
    moveBtn.type = 'button';
    moveBtn.className = 'card-btn';
    moveBtn.textContent = NEXT_LABEL[task.status] || '→ Dalej';
    moveBtn.addEventListener('click', () => {
      manager.moveTask(task.id, NEXT_STATUS[task.status] || 'done');
      onMutate();
    });

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'card-btn';
    editBtn.textContent = 'Edytuj';
    editBtn.addEventListener('click', () => onEdit(task));

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'card-btn';
    deleteBtn.textContent = 'Usuń';
    deleteBtn.addEventListener('click', () => {
      manager.deleteTask(task.id);
      onMutate();
    });

    actions.append(moveBtn, editBtn, deleteBtn);
    card.appendChild(actions);

    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', task.id);
    });

    columns[task.status].appendChild(card);
  });

  Object.entries(counts).forEach(([status, count]) => {
    const badge = document.getElementById(\`count-\${status}\`);
    if (badge) badge.textContent = String(count);
  });
}`,
    },
    {
      path: 'src/dragDrop.js',
      language: 'javascript',
      description: 'Kontroler główny łączący TaskManager, moduł DOM, zdarzenia HTML5 Drag & Drop, edycję w modalu oraz import/eksport JSON.',
      code: `import { TaskManager } from './state.js';
import { renderKanbanBoard } from './dom.js';

const manager = new TaskManager();
const searchInput = document.getElementById('searchInput');
const priorityFilter = document.getElementById('priorityFilter');
const taskForm = document.getElementById('taskForm');
const boardFeedback = document.getElementById('boardFeedback');
const editDialog = document.getElementById('editDialog');
const editForm = document.getElementById('editForm');

function setFeedback(msg) {
  if (boardFeedback) boardFeedback.textContent = msg;
}

function openEditModal(task) {
  document.getElementById('editId').value = task.id;
  document.getElementById('editTitle').value = task.title;
  document.getElementById('editDesc').value = task.description || '';
  document.getElementById('editPriority').value = task.priority;
  document.getElementById('editDueDate').value = task.dueDate || '';
  if (typeof editDialog.showModal === 'function') {
    editDialog.showModal();
  }
}

function refreshBoard() {
  renderKanbanBoard({
    manager,
    query: searchInput.value,
    priority: priorityFilter.value,
    onEdit: openEditModal,
    onMutate: refreshBoard,
  });
}

document.querySelectorAll('.column').forEach((column) => {
  column.addEventListener('dragover', (e) => {
    e.preventDefault();
    column.classList.add('drag-over');
  });
  column.addEventListener('dragleave', () => {
    column.classList.remove('drag-over');
  });
  column.addEventListener('drop', (e) => {
    e.preventDefault();
    column.classList.remove('drag-over');
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      manager.moveTask(taskId, column.dataset.status);
      refreshBoard();
      setFeedback('Przeniesiono kartę zadania.');
    }
  });
});

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const titleEl = document.getElementById('taskTitle');
  const descEl = document.getElementById('taskDesc');
  const prioEl = document.getElementById('taskPriority');
  const dueEl = document.getElementById('taskDueDate');

  const created = manager.addTask({
    title: titleEl.value,
    description: descEl.value,
    priority: prioEl.value,
    dueDate: dueEl.value,
  });
  if (created) {
    taskForm.reset();
    refreshBoard();
    setFeedback(\`Dodano zadanie "\${created.title}".\`);
  }
});

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('editId').value;
  manager.updateTask(id, {
    title: document.getElementById('editTitle').value,
    description: document.getElementById('editDesc').value,
    priority: document.getElementById('editPriority').value,
    dueDate: document.getElementById('editDueDate').value,
  });
  editDialog.close();
  refreshBoard();
  setFeedback('Zapisano zmiany w zadaniu.');
});

document.getElementById('cancelEditBtn').addEventListener('click', () => editDialog.close());
searchInput.addEventListener('input', refreshBoard);
priorityFilter.addEventListener('change', refreshBoard);
document.getElementById('exportBtn').addEventListener('click', () => {
  manager.exportJSON();
  setFeedback('Wyeksportowano kopię zadań do pliku taskflow-backup.json.');
});

document.getElementById('importInput').addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const count = manager.importJSON(text);
    refreshBoard();
    setFeedback(\`Zaimportowano \${count} zadań z pliku JSON.\`);
  } catch (err) {
    setFeedback(\`Błąd importu: \${err.message}\`);
  } finally {
    e.target.value = '';
  }
});

refreshBoard();`,
    },
    {
      path: 'README.md',
      language: 'markdown',
      description: 'Dokumentacja architektury modułowej TaskFlow (state.js, dom.js, dragDrop.js) i instrukcja uruchomienia.',
      code: `# TaskFlow — Tablica Kanban

Modularna aplikacja Kanban w czystym JavaScript ES6+ (ES Modules) bez zewnętrznych frameworków.

## Architektura plików
- \`src/state.js\` — klasa \`TaskManager\`, walidacja, trwałość \`localStorage\`, eksport/import JSON
- \`src/dom.js\` — bezpieczne renderowanie kart (\`textContent\`), liczniki kolumn i akcje kart
- \`src/dragDrop.js\` — obsługa HTML5 Drag & Drop API, filtrów i natywnego modala \`<dialog>\`

## Uruchomienie lokalne
Ze względu na \`type="module"\` uruchom projekt przez lekki serwer HTTP:
\`\`\`bash
npx serve .
\`\`\``,
    },
  ],
};
