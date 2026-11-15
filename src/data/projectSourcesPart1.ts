import { ProjectSourceFile } from '../types';

export const PROJECT_SOURCES_PART_1: Record<string, ProjectSourceFile[]> = {
  'proj-1': [
    {
      path: 'index.html',
      language: 'html',
      description: 'Kompletny, semantyczny dokument HTML5 z nawigacją, sekcją Hero, projektami i dostępnym formularzem kontaktowym.',
      code: `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Portfolio Junior Full Stack Developera — projekty w HTML5, CSS3, React i Node.js." />
  <title>Jan Kowalski — Junior Full Stack Developer</title>
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="#hero" class="brand">Jan Kowalski<span class="accent">.dev</span></a>
      <nav aria-label="Główna nawigacja">
        <ul class="nav-list">
          <li><a href="#o-mnie">O mnie</a></li>
          <li><a href="#umiejetnosci">Umiejętności</a></li>
          <li><a href="#projekty">Projekty</a></li>
          <li><a href="#kontakt">Kontakt</a></li>
        </ul>
      </nav>
      <button id="themeToggle" type="button" class="theme-btn" aria-label="Przełącz motyw kolorystyczny">
        Motyw
      </button>
    </div>
  </header>

  <main>
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
        Od podstaw uczę się inżynierii oprogramowania Full Stack, stawiając na czysty kod, testy automatyczne
        oraz standardy dostępności WCAG 2.1.
      </p>
    </section>

    <section id="umiejetnosci" class="section container">
      <h2>Stack technologiczny</h2>
      <ul class="skills-grid">
        <li class="skill-card">HTML5 &amp; WCAG</li>
        <li class="skill-card">CSS3 / Flexbox / Grid</li>
        <li class="skill-card">JavaScript ES6+ / TS</li>
        <li class="skill-card">React 19 &amp; Tailwind</li>
        <li class="skill-card">Node.js &amp; Express</li>
        <li class="skill-card">PostgreSQL &amp; Prisma</li>
      </ul>
    </section>

    <section id="projekty" class="section container">
      <h2>Wybrane Projekty</h2>
      <div class="projects-grid">
        <article class="project-card">
          <h3>TaskFlow Kanban</h3>
          <p>Aplikacja do zarządzania zadaniami z HTML5 Drag &amp; Drop API i trwałym zapisem w LocalStorage.</p>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">Kod na GitHub →</a>
        </article>
        <article class="project-card">
          <h3>PulseAnalytics</h3>
          <p>Dashboard KPI w React i TypeScript z sortowaniem tabeli, filtrami i eksportem raportów do CSV.</p>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">Kod na GitHub →</a>
        </article>
      </div>
    </section>

    <section id="kontakt" class="section container">
      <h2>Kontakt</h2>
      <form id="contactForm" class="contact-form" novalidate>
        <div class="field">
          <label for="name">Imię i nazwisko</label>
          <input id="name" name="name" type="text" required minlength="2" placeholder="Np. Anna Nowak" />
        </div>
        <div class="field">
          <label for="email">Adres e-mail</label>
          <input id="email" name="email" type="email" required placeholder="anna@firma.pl" />
        </div>
        <div class="field">
          <label for="message">Wiadomość</label>
          <textarea id="message" name="message" rows="4" required minlength="10" placeholder="Opisz projekt lub propozycję..."></textarea>
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

*, *::before, *::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

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

.accent {
  color: var(--accent);
}

.nav-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-list a {
  color: var(--muted);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.nav-list a:hover,
.nav-list a:focus-visible {
  color: var(--accent);
}

.hero {
  padding: 56px 20px 36px;
}

.badge {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 8px;
}

h1 {
  font-size: clamp(1.9rem, 4vw, 3rem);
  line-height: 1.15;
  margin: 0 0 14px;
}

.lead {
  color: var(--muted);
  max-width: 62ch;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

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

.btn-primary {
  background: var(--accent);
  color: #ffffff;
}

.btn-primary:hover {
  background: var(--accent-hover);
}

.btn-secondary {
  background: var(--surface);
  color: var(--text);
  border-color: var(--border);
}

.theme-btn {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  font-weight: 600;
}

.section {
  padding: 32px 20px;
  scroll-margin-top: 72px;
}

.skills-grid,
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  list-style: none;
  padding: 0;
}

.skill-card,
.project-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}

.contact-form {
  display: grid;
  gap: 14px;
  max-width: 540px;
}

.field {
  display: grid;
  gap: 6px;
}

.field input,
.field textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font: inherit;
}

.form-status {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 4px 0 0;
}

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

@media (min-width: 768px) {
  .skills-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}`,
    },
    {
      path: 'app.js',
      language: 'javascript',
      description: 'Obsługa przełącznika motywu z pamięcią w LocalStorage oraz walidacja formularza kontaktowego po stronie klienta.',
      code: `const themeToggle = document.getElementById('themeToggle');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// 1. Przywrócenie zapisanego motywu kolorystycznego
const savedTheme = localStorage.getItem('portfolio_theme');
if (savedTheme === 'light' || savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('portfolio_theme', nextTheme);
  });
}

// 2. Walidacja i obsługa wysyłki formularza kontaktowego
if (contactForm && formStatus) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name.length < 2) {
      formStatus.textContent = 'Podaj imię (co najmniej 2 znaki).';
      formStatus.style.color = '#ef4444';
      return;
    }

    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      formStatus.textContent = 'Wpisz poprawny adres e-mail.';
      formStatus.style.color = '#ef4444';
      return;
    }

    if (message.length < 10) {
      formStatus.textContent = 'Wiadomość powinna mieć minimum 10 znaków.';
      formStatus.style.color = '#ef4444';
      return;
    }

    formStatus.textContent = \`Dziękujemy, \${name}! Twoja wiadomość została zweryfikowana i wysłana.\`;
    formStatus.style.color = '#10b981';
    contactForm.reset();
  });
}`,
    },
  ],

  'proj-2': [
    {
      path: 'index.html',
      language: 'html',
      description: 'Kompletny landing page platformy SaaS: przyklejona nawigacja, sekcja Hero, 3-kolumnowa siatka cech, tabela cennika i natywny akordeon FAQ.',
      code: `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CloudPulse SaaS — Monitoring aplikacji na żywo</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header class="sticky-nav">
    <div class="container nav-wrap">
      <a href="#" class="logo">CloudPulse</a>
      <nav aria-label="Menu główne">
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
        Kompleksowy monitoring API, logów oraz czasów odpowiedzi z gotowymi alertami na Slacka i e-mail.
      </p>
      <div class="hero-actions">
        <button type="button" class="btn-primary">Rozpocznij za darmo</button>
        <a href="#funkcje" class="btn-outline">Zobacz funkcje</a>
      </div>
    </section>

    <section id="funkcje" class="section container">
      <h2>Wszystko czego potrzebuje Twój zespół</h2>
      <div class="features-grid">
        <article class="card">
          <h3>Monitoring 24/7</h3>
          <p>Pingujemy Twoje endpointy co 15 sekund z 12 lokalizacji na świecie.</p>
        </article>
        <article class="card">
          <h3>Analiza zapytań SQL</h3>
          <p>Wskazujemy wolne zapytania w PostgreSQL zanim zablokują bazę.</p>
        </article>
        <article class="card">
          <h3>Raporty SLA</h3>
          <p>Automatyczne raporty dostępności generowane co miesiąc w formacie PDF.</p>
        </article>
      </div>
    </section>

    <section id="cennik" class="section container">
      <div class="pricing-header">
        <h2>Przejrzysty cennik</h2>
        <button id="billingSwitch" type="button" class="billing-btn" data-cycle="monthly">
          Tryb: Miesięczny (kliknij, aby przełączyć -20% rocznie)
        </button>
      </div>
      <div class="pricing-grid">
        <article class="price-card">
          <h3>Starter</h3>
          <p class="price" data-monthly="0" data-yearly="0">0 zł / mies.</p>
          <ul>
            <li>Do 3 monitorowanych usług</li>
            <li>Powiadomienia e-mail</li>
          </ul>
          <button type="button" class="btn-outline">Wybierz Starter</button>
        </article>
        <article class="price-card popular">
          <span class="popular-tag">Najpopularniejszy</span>
          <h3>Pro Team</h3>
          <p class="price" data-monthly="99" data-yearly="79">99 zł / mies.</p>
          <ul>
            <li>Do 50 monitorowanych usług</li>
            <li>Alerty Slack, Discord i Webhook</li>
          </ul>
          <button type="button" class="btn-primary">Wybierz Pro</button>
        </article>
      </div>
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
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer-grid">
      <p>© 2026 CloudPulse SaaS Sp. z o.o.</p>
      <form id="newsletterForm" class="newsletter">
        <label for="newsEmail">Newsletter produktowy:</label>
        <input id="newsEmail" type="email" required placeholder="twoj@email.pl" />
        <button type="submit" class="btn-primary">Zapisz się</button>
        <span id="newsFeedback"></span>
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
      description: 'Stylizacja przyklejonej nawigacji ze scroll-margin-top, równych wysokości kart CSS Grid i animowanego akordeonu <details>.',
      code: `* { box-sizing: border-box; }
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
  background: rgba(11, 17, 32, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #1e293b;
}
.nav-wrap {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; padding-top: 14px; padding-bottom: 14px;
}
.logo { font-weight: 800; color: #fff; text-decoration: none; font-size: 1.2rem; }
.sticky-nav nav { display: flex; gap: 18px; }
.sticky-nav nav a { color: #94a3b8; text-decoration: none; font-size: 0.9rem; font-weight: 600; }
.sticky-nav nav a:hover { color: #fff; }

.hero { padding: 64px 20px; text-align: center; }
.pill {
  display: inline-block; padding: 4px 12px; border-radius: 999px;
  background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.4);
  color: #a5b4fc; font-size: 0.8rem; font-weight: 700;
}
.hero h1 { font-size: clamp(2rem, 4.5vw, 3.2rem); max-width: 18ch; margin: 16px auto; line-height: 1.15; }
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
}

.section { padding: 48px 20px; scroll-margin-top: 76px; }
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
.card, .price-card {
  display: flex; flex-direction: column; justify-content: space-between;
  background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 24px;
}
.pricing-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 18px; }
.billing-btn {
  background: #1e293b; color: #cbd5e1; border: 1px solid #334155;
  padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 0.85rem;
}
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
.price-card.popular { border-color: #6366f1; position: relative; }
.popular-tag {
  align-self: flex-start; background: #4f46e5; color: #fff;
  font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 999px;
}
.price { font-size: 1.9rem; font-weight: 800; margin: 10px 0; }

.faq-list { display: grid; gap: 12px; }
details {
  background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 16px;
}
summary { font-weight: 700; cursor: pointer; }
details p { color: #94a3b8; margin: 10px 0 0; }

.footer { border-top: 1px solid #1e293b; padding: 28px 0; margin-top: 40px; }
.footer-grid { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; }
.newsletter { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.newsletter input { padding: 9px 12px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: #fff; }`,
    },
    {
      path: 'js/main.js',
      language: 'javascript',
      description: 'Interaktywne przełączanie cennika miesięczny/roczny oraz walidacja zapisu do newslettera.',
      code: `const billingSwitch = document.getElementById('billingSwitch');
const priceNodes = document.querySelectorAll('.price');
const newsletterForm = document.getElementById('newsletterForm');
const newsFeedback = document.getElementById('newsFeedback');

if (billingSwitch) {
  billingSwitch.addEventListener('click', () => {
    const isMonthly = billingSwitch.dataset.cycle === 'monthly';
    const nextCycle = isMonthly ? 'yearly' : 'monthly';
    billingSwitch.dataset.cycle = nextCycle;

    billingSwitch.textContent =
      nextCycle === 'yearly'
        ? 'Tryb: Roczny (-20% — kliknij, aby wrócić do miesięcznego)'
        : 'Tryb: Miesięczny (kliknij, aby przełączyć -20% rocznie)';

    priceNodes.forEach((node) => {
      const value = node.dataset[nextCycle];
      node.textContent = \`\${value} zł / mies.\`;
    });
  });
}

if (newsletterForm && newsFeedback) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsEmail');
    if (!emailInput || !emailInput.value.includes('@')) {
      newsFeedback.textContent = 'Podaj poprawny e-mail.';
      newsFeedback.style.color = '#f87171';
      return;
    }
    newsFeedback.textContent = 'Zapisano do newslettera!';
    newsFeedback.style.color = '#34d399';
    newsletterForm.reset();
  });
}`,
    },
  ],

  'proj-3': [
    {
      path: 'index.html',
      language: 'html',
      description: 'Interfejs kalkulatora programistycznego z wyświetlaczem, klawiaturą numeryczną, podglądem BIN/OCT/HEX oraz listą historii.',
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
  font-family: ui-monospace, monospace; font-size: 0.75rem; color: #38bdf8;
}
.keys-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
}
.key {
  padding: 14px; border-radius: 10px; border: 1px solid #1e293b;
  background: #1e293b; color: #f8fafc; font-size: 1rem; font-weight: 700;
  cursor: pointer;
}
.key:hover { background: #334155; }
.key-op { background: #312e81; color: #c7d2fe; }
.key-eq { background: #4f46e5; color: #fff; grid-row: span 2; }
.key-zero { grid-column: span 2; }
.key-muted { background: #0f172a; color: #94a3b8; }
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
}`,
    },
    {
      path: 'app.js',
      language: 'javascript',
      description: 'Silnik matematyczny bez eval() z obsługą błędów zmiennoprzecinkowych (0.1+0.2=0.3), konwersją BIN/OCT/HEX, obsługą klawiatury i zapisem w LocalStorage.',
      code: `const STORAGE_KEY = 'dev_calc_history_v1';
const displayEl = document.getElementById('display');
const exprEl = document.getElementById('expressionPreview');
const binOut = document.getElementById('binOut');
const octOut = document.getElementById('octOut');
const hexOut = document.getElementById('hexOut');
const historyList = document.getElementById('historyList');

let currentInput = '0';
let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

// Bezpieczne zaokrąglanie eliminujące błędy IEEE-754 (np. 0.1 + 0.2 => 0.3)
function formatFloatPrecision(num) {
  return Number(num.toPrecision(12));
}

// Bezpieczny parser Shunting-Yard dla +, -, *, / bez użycia eval()
function evaluateArithmetic(expr) {
  const tokens = expr.match(/\\d+(?:\\.\\d+)?|[+\\-*/]/g);
  if (!tokens) throw new Error('Błąd składni');

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
    if (!Number.isNaN(Number(token))) {
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
  if (Number.isNaN(intPart)) {
    binOut.textContent = 'BIN: —';
    octOut.textContent = 'OCT: —';
    hexOut.textContent = 'HEX: —';
    return;
  }
  binOut.textContent = 'BIN: ' + intPart.toString(2);
  octOut.textContent = 'OCT: ' + intPart.toString(8);
  hexOut.textContent = 'HEX: ' + intPart.toString(16).toUpperCase();
}

function renderHistory() {
  historyList.innerHTML = '';
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

function calculateResult() {
  try {
    const result = evaluateArithmetic(currentInput);
    exprEl.textContent = currentInput + ' =';
    history = [{ expr: currentInput, result }, ...history].slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
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
  if (btn.dataset.action === 'clear') {
    currentInput = '0';
    exprEl.textContent = '0';
    displayEl.value = '0';
    updateRadixDisplays(0);
  }
  if (btn.dataset.action === 'backspace') {
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
    displayEl.value = currentInput;
    updateRadixDisplays(Number(currentInput));
  }
  if (btn.dataset.action === 'equals') calculateResult();
});

document.getElementById('clearHistoryBtn').addEventListener('click', () => {
  history = [];
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
});

window.addEventListener('keydown', (e) => {
  if (/^[0-9+\\-*/.]$/.test(e.key)) appendValue(e.key);
  if (e.key === 'Enter') {
    e.preventDefault();
    calculateResult();
  }
  if (e.key === 'Escape') {
    currentInput = '0';
    displayEl.value = '0';
    updateRadixDisplays(0);
  }
});

renderHistory();
updateRadixDisplays(0);`,
    },
  ],

  'proj-4': [
    {
      path: 'index.html',
      language: 'html',
      description: 'Tablica Kanban z formularzem dodawania zadań, wyszukiwarką w czasie rzeczywistym, 3 kolumnami oraz eksportem/importem JSON.',
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
      <input id="searchInput" type="search" placeholder="Szukaj zadania..." />
      <select id="priorityFilter" aria-label="Filtruj po priorytecie">
        <option value="all">Wszystkie priorytety</option>
        <option value="high">Wysoki</option>
        <option value="medium">Średni</option>
        <option value="low">Niski</option>
      </select>
      <button id="exportBtn" type="button">Eksport JSON</button>
    </div>
  </header>

  <main class="container">
    <form id="taskForm" class="task-form">
      <input id="taskTitle" type="text" required placeholder="Nazwa nowego zadania..." />
      <select id="taskPriority">
        <option value="medium">Średni priorytet</option>
        <option value="high">Wysoki priorytet</option>
        <option value="low">Niski priorytet</option>
      </select>
      <button type="submit">Dodaj zadanie</button>
    </form>

    <section class="board" aria-label="Kolumny tablicy Kanban">
      <div class="column" data-status="todo">
        <h2>Do zrobienia</h2>
        <div class="task-list" id="col-todo"></div>
      </div>
      <div class="column" data-status="in-progress">
        <h2>W toku</h2>
        <div class="task-list" id="col-in-progress"></div>
      </div>
      <div class="column" data-status="done">
        <h2>Ukończone</h2>
        <div class="task-list" id="col-done"></div>
      </div>
    </section>
  </main>

  <script type="module" src="src/dragDrop.js"></script>
</body>
</html>`,
    },
    {
      path: 'styles.css',
      language: 'css',
      description: 'Układ 3-kolumnowy CSS Grid z podświetleniem kolumny podczas przeciągania (.drag-over) oraz oznaczeniami priorytetów.',
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
.filters { display: flex; flex-wrap: wrap; gap: 8px; }
.container { max-width: 1120px; margin: 0 auto; padding: 20px; }
.task-form { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
input, select, button {
  padding: 9px 12px; border-radius: 8px; border: 1px solid #334155;
  background: #0f172a; color: #f8fafc; font: inherit; font-size: 0.9rem;
}
button { background: #4f46e5; border-color: #4f46e5; font-weight: 700; cursor: pointer; }
.board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}
.column {
  background: #0f172a; border: 1px solid #1e293b; border-radius: 14px;
  padding: 14px; min-height: 320px; transition: border-color 0.15s ease;
}
.column.drag-over { border-color: #6366f1; background: #1e1b4b; }
.column h2 { font-size: 0.95rem; margin: 0 0 12px; color: #cbd5e1; }
.task-list { display: grid; gap: 10px; }
.task-card {
  background: #020617; border: 1px solid #1e293b; border-radius: 10px;
  padding: 12px; cursor: grab; display: grid; gap: 8px;
}
.task-card:active { cursor: grabbing; opacity: 0.7; }
.priority-high { border-left: 4px solid #ef4444; }
.priority-medium { border-left: 4px solid #f59e0b; }
.priority-low { border-left: 4px solid #10b981; }
.card-actions { display: flex; justify-content: space-between; gap: 6px; }
.card-btn {
  padding: 4px 8px; font-size: 0.75rem; background: #1e293b;
  border-color: #334155; color: #cbd5e1;
}`,
    },
    {
      path: 'src/state.js',
      language: 'javascript',
      description: 'Klasa TaskManager zarządzająca stanem zadań, trwałością LocalStorage, filtrowaniem i eksportem do pliku JSON.',
      code: `const KANBAN_KEY = 'taskflow_kanban_v1';

export class TaskManager {
  constructor() {
    const saved = localStorage.getItem(KANBAN_KEY);
    this.tasks = saved
      ? JSON.parse(saved)
      : [
          { id: 't-1', title: 'Skonfigurować repozytorium Git', priority: 'high', status: 'todo' },
          { id: 't-2', title: 'Wdrożyć HTML5 Drag & Drop', priority: 'medium', status: 'in-progress' },
        ];
  }

  save() {
    localStorage.setItem(KANBAN_KEY, JSON.stringify(this.tasks));
  }

  addTask(title, priority = 'medium') {
    const cleanTitle = title.trim();
    if (!cleanTitle) return null;
    const task = {
      id: 't-' + Date.now(),
      title: cleanTitle,
      priority,
      status: 'todo',
    };
    this.tasks.push(task);
    this.save();
    return task;
  }

  moveTask(taskId, nextStatus) {
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
      const matchesText = !q || task.title.toLowerCase().includes(q);
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
}`,
    },
    {
      path: 'src/dragDrop.js',
      language: 'javascript',
      description: 'Renderowanie kart Kanban z obsługą HTML5 Drag & Drop API oraz przycisków szybkiego przenoszenia między kolumnami.',
      code: `import { TaskManager } from './state.js';

const manager = new TaskManager();
const searchInput = document.getElementById('searchInput');
const priorityFilter = document.getElementById('priorityFilter');
const taskForm = document.getElementById('taskForm');

function renderBoard() {
  const columns = {
    todo: document.getElementById('col-todo'),
    'in-progress': document.getElementById('col-in-progress'),
    done: document.getElementById('col-done'),
  };

  Object.values(columns).forEach((col) => { col.innerHTML = ''; });

  const visibleTasks = manager.filterTasks(searchInput.value, priorityFilter.value);
  visibleTasks.forEach((task) => {
    const card = document.createElement('article');
    card.className = \`task-card priority-\${task.priority}\`;
    card.setAttribute('draggable', 'true');
    card.dataset.id = task.id;

    card.innerHTML = \`
      <strong>\${task.title}</strong>
      <div class="card-actions">
        <button type="button" class="card-btn move-done">→ Zakończ</button>
        <button type="button" class="card-btn delete-btn">Usuń</button>
      </div>
    \`;

    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', task.id);
    });

    card.querySelector('.move-done').addEventListener('click', () => {
      manager.moveTask(task.id, 'done');
      renderBoard();
    });

    card.querySelector('.delete-btn').addEventListener('click', () => {
      manager.deleteTask(task.id);
      renderBoard();
    });

    columns[task.status].appendChild(card);
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
      renderBoard();
    }
  });
});

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const titleEl = document.getElementById('taskTitle');
  const prioEl = document.getElementById('taskPriority');
  if (manager.addTask(titleEl.value, prioEl.value)) {
    titleEl.value = '';
    renderBoard();
  }
});

searchInput.addEventListener('input', renderBoard);
priorityFilter.addEventListener('change', renderBoard);
document.getElementById('exportBtn').addEventListener('click', () => manager.exportJSON());

renderBoard();`,
    },
  ],

  'proj-5': [
    {
      path: 'index.html',
      language: 'html',
      description: 'Widok pogodynki WeatherSphere z wyszukiwarką miast, przyciskiem GPS, szkieletem ładowania oraz prognozą 7-dniową.',
      code: `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WeatherSphere — Prognoza Pogody Live</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main class="weather-shell">
    <header class="search-bar">
      <input id="cityInput" type="search" placeholder="Wpisz miasto (np. Kraków, Gdańsk)..." aria-label="Nazwa miasta" />
      <button id="searchBtn" type="button">Szukaj</button>
      <button id="geoBtn" type="button">Moja lokalizacja</button>
    </header>

    <p id="statusMsg" role="status" class="status-msg"></p>
    <section id="weatherCard" class="weather-card" aria-live="polite"></section>
    <section id="forecastGrid" class="forecast-grid" aria-label="Prognoza 7-dniowa"></section>
  </main>

  <script type="module" src="js/app.js"></script>
</body>
</html>`,
    },
    {
      path: 'js/api.js',
      language: 'javascript',
      description: 'Asynchroniczna warstwa API łącząca się z Open-Meteo Geocoding i Forecast API z obsługą trybu offline i błędów HTTP.',
      code: `export async function searchCityCoordinates(cityName) {
  if (!navigator.onLine) {
    throw new Error('Brak połączenia z internetem. Sprawdź sieć.');
  }
  const url = \`https://geocoding-api.open-meteo.com/v1/search?name=\${encodeURIComponent(cityName)}&count=1&language=pl&format=json\`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Błąd komunikacji z serwerem geokodowania.');
  }
  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(\`Nie znaleziono miasta "\${cityName}".\`);
  }
  const best = data.results[0];
  return { name: best.name, country: best.country, latitude: best.latitude, longitude: best.longitude };
}

export async function fetchForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
    timezone: 'auto',
  });
  const response = await fetch(\`https://api.open-meteo.com/v1/forecast?\${params.toString()}\`);
  if (!response.ok) {
    throw new Error('Nie udało się pobrać prognozy pogody.');
  }
  return response.json();
}`,
    },
    {
      path: 'js/app.js',
      language: 'javascript',
      description: 'Kontroler WeatherSphere z debouncingiem wpisywania, obsługą geolokalizacji przeglądarki i skeleton loaderem.',
      code: `import { searchCityCoordinates, fetchForecast } from './api.js';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');
const statusMsg = document.getElementById('statusMsg');
const weatherCard = document.getElementById('weatherCard');
const forecastGrid = document.getElementById('forecastGrid');

function renderSkeleton() {
  weatherCard.innerHTML = '<div class="skeleton">Ładowanie aktualnej pogody...</div>';
  forecastGrid.innerHTML = '';
}

function renderWeather(locationName, data) {
  const cur = data.current;
  weatherCard.innerHTML = \`
    <h1>\${locationName}</h1>
    <p class="temp">\${Math.round(cur.temperature_2m)}°C</p>
    <p>Wilgotność: \${cur.relative_humidity_2m}% · Wiatr: \${cur.wind_speed_10m} km/h</p>
  \`;

  forecastGrid.innerHTML = data.daily.time
    .map(
      (day, idx) => \`
        <article class="day-card">
          <strong>\${day}</strong>
          <span>Max: \${Math.round(data.daily.temperature_2m_max[idx])}°C</span>
          <span>Min: \${Math.round(data.daily.temperature_2m_min[idx])}°C</span>
        </article>
      \`
    )
    .join('');
}

async function loadByCity(city) {
  if (!city.trim()) return;
  try {
    statusMsg.textContent = '';
    renderSkeleton();
    const loc = await searchCityCoordinates(city);
    const forecast = await fetchForecast(loc.latitude, loc.longitude);
    renderWeather(\`\${loc.name}, \${loc.country || ''}\`, forecast);
  } catch (err) {
    weatherCard.innerHTML = '';
    statusMsg.textContent = err.message;
  }
}

let debounceTimer = null;
cityInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (cityInput.value.trim().length >= 3) {
      loadByCity(cityInput.value);
    }
  }, 450);
});

searchBtn.addEventListener('click', () => loadByCity(cityInput.value));

geoBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    statusMsg.textContent = 'Przeglądarka nie obsługuje geolokalizacji.';
    return;
  }
  renderSkeleton();
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const forecast = await fetchForecast(pos.coords.latitude, pos.coords.longitude);
        renderWeather('Twoja lokalizacja (GPS)', forecast);
      } catch (err) {
        statusMsg.textContent = err.message;
      }
    },
    () => {
      weatherCard.innerHTML = '';
      statusMsg.textContent = 'Odmówiono dostępu do lokalizacji.';
    }
  );
});

loadByCity('Warszawa');`,
    },
  ],

  'proj-6': [
    {
      path: 'src/types/analytics.ts',
      language: 'typescript',
      description: 'Silne typowanie TypeScript dla transakcji, zakresów czasowych, walut oraz konfiguracji sortowania tabeli.',
      code: `export type CurrencyCode = 'PLN' | 'EUR' | 'USD';
export type DateRangePreset = '7d' | '30d' | '365d';
export type TransactionStatus = 'PAID' | 'PENDING' | 'REFUNDED';

export interface Transaction {
  id: string;
  customer: string;
  email: string;
  amountPln: number;
  status: TransactionStatus;
  createdAt: string;
}

export interface SortConfig {
  field: 'createdAt' | 'amountPln' | 'customer';
  direction: 'asc' | 'desc';
}

export const CURRENCY_RATES: Record<CurrencyCode, number> = {
  PLN: 1,
  EUR: 0.23,
  USD: 0.25,
};`,
    },
    {
      path: 'src/utils/exportCsv.ts',
      language: 'typescript',
      description: 'Eksport przefiltrowanej tabeli transakcji do pliku CSV z dodanym nagłówkiem UTF-8 BOM poprawnie otwieranym przez Microsoft Excel.',
      code: `import { CurrencyCode, CURRENCY_RATES, Transaction } from '../types/analytics';

export function formatMoney(amountPln: number, currency: CurrencyCode): string {
  const converted = amountPln * CURRENCY_RATES[currency];
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(converted);
}

export function downloadTransactionsCsv(rows: Transaction[], currency: CurrencyCode): void {
  const header = ['ID', 'Klient', 'E-mail', 'Kwota', 'Waluta', 'Status', 'Data'];
  const rate = CURRENCY_RATES[currency];

  const escapeCell = (val: string | number) =>
    \`"\${String(val).replace(/"/g, '""')}"\`;

  const csvRows = [
    header.join(';'),
    ...rows.map((r) =>
      [
        escapeCell(r.id),
        escapeCell(r.customer),
        escapeCell(r.email),
        escapeCell((r.amountPln * rate).toFixed(2)),
        escapeCell(currency),
        escapeCell(r.status),
        escapeCell(r.createdAt),
      ].join(';')
    ),
  ];

  // UTF-8 BOM gwarantuje polskie znaki w Excelu
  const blob = new Blob(['\\uFEFF' + csvRows.join('\\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = \`pulse-analytics-\${new Date().toISOString().slice(0, 10)}.csv\`;
  a.click();
  URL.revokeObjectURL(url);
}`,
    },
    {
      path: 'src/App.tsx',
      language: 'tsx',
      description: 'Główny komponent dashboardu PulseAnalytics z obliczaniem KPI (.filter + .reduce), sortowalną tabelą, paginacją i eksportem CSV.',
      code: `import React, { useMemo, useState } from 'react';
import { CurrencyCode, DateRangePreset, SortConfig, Transaction } from './types/analytics';
import { downloadTransactionsCsv, formatMoney } from './utils/exportCsv';

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { id: 'TX-101', customer: 'Anna Kowalczyk', email: 'anna@studio.pl', amountPln: 1290, status: 'PAID', createdAt: '2026-11-12' },
  { id: 'TX-102', customer: 'Piotr Zieliński', email: 'piotr@soft.io', amountPln: 890, status: 'PAID', createdAt: '2026-11-11' },
  { id: 'TX-103', customer: 'Marek Nowak', email: 'marek@cloud.pl', amountPln: 450, status: 'PENDING', createdAt: '2026-11-05' },
  { id: 'TX-104', customer: 'Katarzyna Wiśniewska', email: 'kasia@media.pl', amountPln: 2150, status: 'PAID', createdAt: '2026-10-20' },
];

export const PulseAnalyticsApp: React.FC = () => {
  const [currency, setCurrency] = useState<CurrencyCode>('PLN');
  const [range, setRange] = useState<DateRangePreset>('30d');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortConfig>({ field: 'createdAt', direction: 'desc' });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SAMPLE_TRANSACTIONS
      .filter((tx) => {
        if (range === '7d' && tx.createdAt < '2026-11-08') return false;
        if (!q) return true;
        return tx.customer.toLowerCase().includes(q) || tx.email.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        const factor = sort.direction === 'asc' ? 1 : -1;
        if (sort.field === 'amountPln') return (a.amountPln - b.amountPln) * factor;
        return a[sort.field].localeCompare(b[sort.field]) * factor;
      });
  }, [range, search, sort]);

  const paidRevenuePln = useMemo(
    () => filtered.filter((t) => t.status === 'PAID').reduce((acc, t) => acc + t.amountPln, 0),
    [filtered]
  );

  const toggleSort = (field: SortConfig['field']) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-100">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">PulseAnalytics KPI</h1>
        <div className="flex gap-2">
          <select value={range} onChange={(e) => setRange(e.target.value as DateRangePreset)}>
            <option value="7d">Ostatnie 7 dni</option>
            <option value="30d">Ostatnie 30 dni</option>
            <option value="365d">Rok</option>
          </select>
          <select value={currency} onChange={(e) => setCurrency(e.target.value as CurrencyCode)}>
            <option value="PLN">PLN</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
          <button type="button" onClick={() => downloadTransactionsCsv(filtered, currency)}>
            Eksportuj CSV
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Przychód (PAID)</span>
          <p className="text-2xl font-bold">{formatMoney(paidRevenuePln, currency)}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Liczba transakcji</span>
          <p className="text-2xl font-bold">{filtered.length}</p>
        </div>
      </section>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filtruj po kliencie lub e-mailu..."
      />

      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th>ID</th>
            <th><button type="button" onClick={() => toggleSort('customer')}>Klient</button></th>
            <th><button type="button" onClick={() => toggleSort('amountPln')}>Kwota</button></th>
            <th>Status</th>
            <th><button type="button" onClick={() => toggleSort('createdAt')}>Data</button></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>{tx.customer}</td>
              <td>{formatMoney(tx.amountPln, currency)}</td>
              <td>{tx.status}</td>
              <td>{tx.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};`,
    },
  ],
};
