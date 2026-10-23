import { Module } from '../../types';

export const MODULE_10: Module = {
  id: 10,
  title: 'Autoryzacja i Bezpieczeństwo Aplikacji',
  category: 'DevOps & Bezpieczeństwo',
  description: 'Bezpieczeństwo aplikacji webowych: haszowanie haseł bcrypt, sesje, tokeny JWT, Refresh Tokens, ciasteczka HttpOnly, ochrona przed SQLi, XSS i CSRF.',
  badgeName: 'Oficer Bezpieczeństwa Web',
  badgeIcon: 'Lock',
  durationHours: 25,
  totalXp: 800,
  prerequisites: ['Moduł 8: Backend', 'Moduł 9: Bazy Danych'],
  topics: [
    'Różnica między uwierzytelnianiem (Authentication) a autoryzacją (Authorization / RBAC)',
    'Bezpieczne przechowywanie haseł: sól (salt), koszt obliczeniowy i algorytm bcrypt/argon2',
    'Tokeny JSON Web Token (JWT): struktura Header.Payload.Signature, wady i zalety',
    'Bezpieczne przechowywanie tokenów: ciasteczka z flagami HttpOnly, Secure i SameSite',
    'Ochrona przed topowymi podatnościami OWAG Top 10: XSS, CSRF, SQL Injection, SSRF',
    'Rate Limiting, nagłówki bezpieczeństwa Helmet.js i polityka CORS',
  ],
  projectBrief: 'Projekt modułu: Bezpieczny moduł Auth z podwójnym tokenem (Access + Refresh Token) i rolami użytkowników (Admin, Moderator, User).',
  lessons: [
    {
      id: 'sec-1',
      moduleId: 10,
      moduleTitle: 'Autoryzacja i Bezpieczeństwo Aplikacji',
      title: 'Uwierzytelnianie: haszowanie haseł bcrypt i bezpieczne tokeny JWT',
      slug: 'uwierzytelnianie-bcrypt-jwt-bezpieczenstwo',
      durationMinutes: 40,
      xpReward: 80,
      order: 1,
      summary: 'Koniec z przechowywaniem haseł jawnym tekstem! Poznaj funkcje skrótu z soleniem (bcrypt), architekturę tokenów JWT (Header.Payload.Signature) oraz bezpieczne przechowywanie w ciasteczkach HttpOnly.',
      objectives: [
        'Zrozumieć dlaczego hasła muszą być haszowane z solą (salt) i kosztem obliczeniowym (work factor)',
        'Podpisywać i weryfikować tokeny JSON Web Token (jwt.sign, jwt.verify)',
        'Zabezpieczać tokeny przed kradzieżą XSS za pomocą flagi ciasteczka HttpOnly',
      ],
      prerequisites: ['Moduł 8: Backend'],
      theoryMarkdown: `Bezpieczeństwo kont użytkowników to najważniejsza odpowiedzialność developera.

**Haszowanie haseł z bcrypt:**
Haszowanie to operacja **jednokierunkowa** (nie da się jej "odkodować").
- Sól (Salt): losowy ciąg bajtów dołączany do każdego hasła, uniemożliwiający użycie tzw. tablic tęczowych (Rainbow Tables).
- Work Factor (Cost): spowalnia sprawdzanie hasła, zabezpieczając przed atakami typu Brute Force:
\`\`\`typescript
import bcrypt from 'bcrypt';

// Haszowanie nowego hasła:
const passwordHash = await bcrypt.hash(rawPassword, 12);

// Porównanie podczas logowania:
const isMatch = await bcrypt.compare(candidatePassword, passwordHash);
\`\`\`

**Tokeny JSON Web Token (JWT):**
Składają się z 3 części rozdzielonych kropkami: \`Header.Payload.Signature\`.
- **Header:** Algorytm podpisu (np. HS256).
- **Payload:** Dane tożsamości (np. \`{ userId: "123", role: "student" }\`). **Uwaga: Payload NIE jest szyfrowany!** Każdy może go odczytać na jwt.io. Nie umieszczaj w nim haseł ani numerów kart!
- **Signature:** Podpis kryptograficzny wygenerowany z użyciem tajnego klucza serwera (\`JWT_SECRET\`). Zapobiega sfałszowaniu tokena.`,
      codeExamples: [
        {
          title: 'Wzorzec generowania i weryfikacji tokena JWT w Express',
          language: 'typescript',
          code: `import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

// 1. Generowanie tokena dostępowego:
export function generateAccessToken(userId: string, role: string): string {
  return jwt.sign(
    { sub: userId, role }, 
    JWT_SECRET, 
    { expiresIn: '15m' } // Krótki czas życia tokena (15 minut)
  );
}

// 2. Weryfikacja tokena w middleware:
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error('Niepoprawny lub przedawniony token tożsamości');
  }
}`,
          explanation: 'Krótki czas życia tokena (15m) minimalizuje ryzyko w razie jego ewentualnego przechwycenia.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zahaszuj hasło przed zapisem w bazie', description: 'Użyj await bcrypt.hash(password, 12).' },
        { step: 2, title: 'Wygeneruj podpisany token po logowaniu', description: 'Użyj jwt.sign({ userId }, secret, { expiresIn }).' },
        { step: 3, title: 'Przechowaj token w ciasteczku HttpOnly', description: 'Flaga httpOnly uniemożliwia odczyt tokena z kodu JS (ochrona XSS).' },
      ],
      interactiveExercise: {
        id: 'ex-sec-1',
        title: 'Komponent wizualizacji bezpiecznego tokena JWT',
        instructions: 'Zaprojektuj wizualny widżet tokena JWT: stwórz kontener z klasą jwt-card, nagłówek <h4> z podpisem "JSON Web Token", odznakę algorytmu <span class="badge">HS256</span> oraz informację "HttpOnly Cookie Enabled".',
        task: 'Utwórz element jwt-card z nagłówkiem, odznaką HS256 i tekstem HttpOnly.',
        starterCode: {
          html: '<!-- Zbuduj widżet tokena JWT poniżej -->\n',
          css: '.jwt-card { background: #0f172a; border: 1px solid #334155; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: white; display: inline-flex; align-items: center; gap: 12px; }\nh4 { margin: 0; font-size: 0.95rem; }\n.badge { background: #6366f1; color: white; font-family: monospace; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }',
          js: 'console.log("Security visualizer gotowy.");',
        },
        solutionCode: {
          html: '<div class="jwt-card">\n  <h4>JSON Web Token</h4>\n  <span class="badge">HS256</span>\n  <span style="color: #4ade80; font-size: 0.8rem;">HttpOnly Cookie Enabled</span>\n</div>',
          css: '.jwt-card { background: #0f172a; border: 1px solid #334155; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: white; display: inline-flex; align-items: center; gap: 12px; }\nh4 { margin: 0; font-size: 0.95rem; }\n.badge { background: #6366f1; color: white; font-family: monospace; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }',
          js: 'console.log("Security visualizer gotowy.");',
        },
        hints: [
          'Użyj <div class="jwt-card">.',
          'Wstaw <h4>JSON Web Token</h4>.',
          'Dodaj <span class="badge">HS256</span>.',
          'Dodaj tekst HttpOnly Cookie Enabled.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa jwt-card obecna', ruleType: 'html_contains', target: 'jwt-card' },
          { id: 'r2', description: 'Tytuł JSON Web Token obecny', ruleType: 'html_contains', target: 'JSON Web Token' },
          { id: 'r3', description: 'Algorytm HS256 obecny', ruleType: 'html_contains', target: 'HS256' },
          { id: 'r4', description: 'Status HttpOnly obecny', ruleType: 'html_contains', target: 'HttpOnly' },
        ],
      },
      independentTask: {
        title: 'Middleware weryfikacji roli (RBAC)',
        instructions: 'Napisz funkcję checkRole("admin") sprawdzającą czy dekodowany token posiada rolę admin, a jeśli nie — zwróć kod 403 Forbidden.',
        expectedOutcome: 'Precyzyjna kontrola uprawnień w systemie wielorolowym.',
        starterHint: 'Kod 401 oznacza brak zalogowania, a 403 brak wystarczających uprawnień.',
      },
      quiz: [
        {
          id: 'q-sec1-1',
          question: 'Dlaczego NIE należy przechowywać tokenów uwierzytelniających w obiekcie localStorage przeglądarki?',
          options: [
            'Wszelki kod JavaScript (w tym złośliwy skrypt wstrzyknięty w ataku XSS) ma pełny dostęp do localStorage i może natychmiast ukraść tożsamość użytkownika. Ciasteczko HttpOnly jest chronione przed dostępem JS',
            'localStorage ma limit wielkości 5 bajtów',
            'Przeglądarka kasuje localStorage co 5 minut',
            'localStorage działa tylko na telefonach',
          ],
          correctAnswer: 0,
          explanation: 'Flaga HttpOnly sprawia, że document.cookie nie widzi tokena, co uniemożliwia jego kradzież przez wrogi skrypt XSS.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Haszowanie haseł przestarzałym algorytmem MD5 lub SHA256',
          whyItHappens: 'Użycie prostych, szybkich funkcji skrótu bez soli.',
          howToFix: 'MD5 i SHA256 są zbyt szybkie — współczesne karty graficzne sprawdzają miliardy takich haseł na sekundę. Zawsze używaj algorytmów wolnych z kosztem obliczeniowym: bcrypt lub argon2.',
          badCode: 'crypto.createHash("md5").update(pass).digest("hex"); // Skrajnie niebezpieczne!',
          goodCode: 'await bcrypt.hash(pass, 12);',
        },
      ],
      practicalTask: {
        title: 'Inspekcja tokena JWT',
        brief: 'Wygeneruj testowy token JWT i zobacz jak odkodowuje się jego payload na jwt.io.',
        steps: ['Podpisz token z userId i rolą', 'Wklej do analizatora', 'Zrozum, że dane są jawne, ale podpisane'],
        deliverable: 'Praktyczne zrozumienie kryptografii tokenów.',
      },
      completionCriteria: [
        'Zrozumienie haszowania haseł i tokenów JWT',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'sec-2',
      moduleId: 10,
      moduleTitle: 'Autoryzacja i Bezpieczeństwo Aplikacji',
      title: 'Ochrona przed OWASP Top 10: XSS, CSRF, SQL Injection, Helmet i Rate Limiting',
      slug: 'bezpieczenstwo-owasp-xss-csrf-sqli-helmet-rate-limiting',
      durationMinutes: 45,
      xpReward: 90,
      order: 2,
      summary: 'Cyberbezpieczeństwo w praktyce: chroń dane użytkowników przed Cross-Site Scripting (XSS), fałszowaniem żądań (CSRF), wstrzykiwaniem SQL (SQLi), atakami typu brute-force i wyciekami nagłówków dzięki Helmet.js i Rate Limiting.',
      objectives: [
        'Rozumieć wektory ataków XSS i stosować sanitizację HTML oraz Content Security Policy (CSP)',
        'Wdrażać ciasteczka SameSite=Strict i tokeny anty-CSRF',
        'Konfigurować pakiety helmet oraz express-rate-limit na serwerze produkcyjnym',
      ],
      prerequisites: ['Moduł 10: Lekcja 1 (JWT i bcrypt)'],
      theoryMarkdown: `Organizacja **OWASP** (Open Web Application Security Project) publikuje zestawienie 10 najgroźniejszych podatności aplikacji internetowych.

**1. Cross-Site Scripting (XSS):**
Atak polegający na wstrzyknięciu złośliwego skryptu JavaScript do przeglądarki ofiary (np. przez niesanitizowany komentarz).
- **Zagrożenie:** Kradzież ciasteczek sesyjnych, tokenów z localStorage, podsłuchiwanie klawiatury (keylogger).
- **Obrona:** Unikaj \`dangerouslySetInnerHTML\`, stosuj bibliotekę DOMPurify, a wrażliwe tokeny przechowuj wyłącznie w ciasteczkach z flagą **\`HttpOnly\`** (do których JavaScript nie ma dostępu!).

**2. Cross-Site Request Forgery (CSRF):**
Zmuszenie zalogowanej przeglądarki ofiary do wykonania niepożądanej akcji na zaufanej stronie (np. wysłanie formularza przelewu).
- **Obrona:** Ciasteczka sesyjne z flagą **\`SameSite=Lax\`** lub **\`SameSite=Strict\`**, a także unikalne tokeny CSRF dołączane do żądań POST/PUT/DELETE.

**3. SQL Injection (SQLi):**
Wstrzykiwanie fragmentów języka SQL do zapytań (np. \`' OR 1=1 --\`).
- **Obrona:** Nigdy nie łącz stringów (\`"SELECT * WHERE id=" + id\`). Używaj zapytań parametryzowanych lub ORM-ów (Prisma/Drizzle), które automatycznie escapują parametry.

**4. Utwardzanie Express.js (Helmet & Rate Limiter):**
\`\`\`typescript
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

// Ukrywa nagłówek X-Powered-By: Express i ustawia CSP, HSTS, X-Frame-Options:
app.use(helmet());

// Blokuje brute force: max 100 zapytań na 15 minut z jednego IP:
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Zbyt wiele zapytań. Spróbuj ponownie za 15 minut.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);
\`\`\``,
      codeExamples: [
        {
          title: 'Middleware Rate Limitingu dla formularza logowania w Express',
          language: 'typescript',
          code: `import rateLimit from 'express-rate-limit';

// Rygorystyczny limit dla logowania: max 5 błędnych prób na 5 minut:
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: { error: 'Zbyt wiele nieudanych prób logowania. Konto zablokowane na 5 minut.' },
  standardHeaders: true,
});

app.post('/api/auth/login', loginLimiter, authController.login);`,
          explanation: 'Chroni przed automatycznymi atakami typu dictionary attack i credential stuffing.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zainstaluj Helmet', description: 'npm install helmet i dodaj app.use(helmet()).' },
        { step: 2, title: 'Wdróż Rate Limiting', description: 'npm install express-rate-limit i zabezpiecz endpointy logowania.' },
        { step: 3, title: 'Wymuś ciasteczka HttpOnly', description: 'res.cookie("token", jwt, { httpOnly: true, secure: true, sameSite: "strict" }).' },
      ],
      interactiveExercise: {
        id: 'ex-sec-2',
        title: 'Komponent tarczy bezpieczeństwa aplikacji (WAF Badge)',
        instructions: 'Zaprojektuj wizualną odznakę tarczy bezpieczeństwa: utwórz kontener z klasą waf-badge, informację o aktywnym nagłówku "Helmet CSP: Active", oraz limit zapytań "Rate Limiting: 100 req/15m".',
        task: 'Utwórz element waf-badge z tekstami Helmet CSP: Active oraz Rate Limiting: 100 req/15m.',
        starterCode: {
          html: '<!-- Zbuduj widok tarczy bezpieczeństwa poniżej -->\n',
          css: '.waf-badge { background: #1a0b2e; border: 1px solid #7c3aed; padding: 14px 18px; border-radius: 10px; font-family: monospace; color: #d8b4fe; display: flex; flex-direction: column; gap: 6px; }\n.shield-title { color: #a855f7; font-weight: bold; }',
          js: 'console.log("Security Shield Active.");',
        },
        solutionCode: {
          html: '<div class="waf-badge">\n  <div>Helmet CSP: Active</div>\n  <div>Rate Limiting: 100 req/15m</div>\n</div>',
          css: '.waf-badge { background: #1a0b2e; border: 1px solid #7c3aed; padding: 14px 18px; border-radius: 10px; font-family: monospace; color: #d8b4fe; display: flex; flex-direction: column; gap: 6px; }\n.shield-title { color: #a855f7; font-weight: bold; }',
          js: 'console.log("Security Shield Active.");',
        },
        hints: [
          'Użyj kontenera <div class="waf-badge">.',
          'Wstaw <div>Helmet CSP: Active</div>.',
          'Wstaw <div>Rate Limiting: 100 req/15m</div>.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa waf-badge obecna', ruleType: 'html_contains', target: 'waf-badge' },
          { id: 'r2', description: 'Helmet CSP: Active obecne', ruleType: 'html_contains', target: 'Helmet CSP: Active' },
          { id: 'r3', description: 'Rate Limiting: 100 req/15m obecne', ruleType: 'html_contains', target: 'Rate Limiting: 100 req/15m' },
        ],
      },
      independentTask: {
        title: 'Audyt bezpieczeństwa nagłówków HTTP',
        instructions: 'Zbadaj stronę securityheaders.com i skonfiguruj Content-Security-Policy blokującą skrypty z nieautoryzowanych domen.',
        expectedOutcome: 'Ocena A+ w rankingu nagłówków bezpieczeństwa serwera.',
        starterHint: 'helmet.contentSecurityPolicy({ directives: { defaultSrc: ["\'self\'"] } })',
      },
      quiz: [
        {
          id: 'q-sec2-1',
          question: 'Dlaczego przechowywanie tokena uwierzytelniającego w ciasteczku z flagą HttpOnly jest bezpieczniejsze niż w localStorage przeglądarki?',
          options: [
            'Flaga HttpOnly uniemożliwia odczytanie ciasteczka z poziomu skryptów JavaScript, co chroni token przed kradzieżą w razie ataku XSS',
            'Ciasteczko HttpOnly jest automatycznie usuwane co 5 sekund',
            'LocalStorage może pomieścić maksymalnie 10 znaków',
            'Flaga HttpOnly szyfruje procesor komputera użytkownika',
          ],
          correctAnswer: 0,
          explanation: 'Skrypt wstrzyknięty przez atakującego w ataku XSS ma bezpośredni dostęp do window.localStorage, ale nie jest w stanie odczytać ciasteczek HttpOnly.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Brak limitera zapytań (Rate Limiting) na trasach rejestracji i logowania',
          whyItHappens: 'Przekonanie, że zabezpieczenia bazy danych wystarczą.',
          howToFix: 'Brak limitera pozwala botom sprawdzać miliony haseł na minutę (Brute Force) lub wysyłać tysiące zapytań obciążających serwer. Zawsze chroń wrażliwe trasy za pomocą express-rate-limit.',
          badCode: 'app.post("/login", loginHandler); // Podatne na spam botów!',
          goodCode: 'app.post("/login", loginLimiter, loginHandler);',
        },
      ],
      practicalTask: {
        title: 'Konfiguracja pakietu Helmet w serwerze Express',
        instructions: 'Dodaj pakiet helmet do konfiguracji serwera Express i sprawdź nagłówki odpowiedzi za pomocą DevTools Network tab.',
        brief: 'Przetestuj nagłówki X-Content-Type-Options i Strict-Transport-Security.',
        steps: ['Zaimportuj helmet', 'Użyj middleware app.use(helmet())', 'Sprawdź ukrycie nagłówka X-Powered-By'],
        deliverable: 'Utwardzone, bezpieczne środowisko Express.',
      },
      completionCriteria: [
        'Zrozumienie wektorów ataku OWASP i mechanizmów obronnych',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'sec-3',
      moduleId: 10,
      moduleTitle: 'Bezpieczeństwo i Uwierzytelnianie Aplikacji',
      title: 'Autoryzacja oparta na rolach (RBAC), Access vs Refresh Token oraz OAuth 2.0',
      slug: 'bezpieczenstwo-rbac-refresh-token-oauth2',
      durationMinutes: 45,
      xpReward: 90,
      order: 3,
      summary: 'Czym różni się Uwierzytelnianie (Authentication — kim jesteś?) od Autoryzacji (Authorization — co wolno Ci zrobić?)? Poznaj architekturę krótkotrwałych Access Tokenów z rotacją Refresh Tokenów, kontrolę dostępu RBAC oraz przepływ OAuth 2.0 ("Zaloguj przez Google/GitHub").',
      objectives: [
        'Projektować middleware autoryzacji Role-Based Access Control (RBAC) chroniący zasoby administracyjne',
        'Rozumieć architekturę podwójnych tokenów: krótkotrwały Access Token (15 min) + odnawialny Refresh Token (7 dni)',
        'Unikać podatności BOLA / IDOR (Broken Object Level Authorization) poprzez weryfikację właściciela zasobu',
      ],
      prerequisites: ['Haszowanie haseł i JWT'],
      theoryMarkdown: `**1. Authentication (401) vs Authorization (403):**
- **Authentication (Uwierzytelnianie — kod \`401 Unauthorized\`):** Weryfikacja tożsamości użytkownika (np. sprawdzenie loginu i hasła lub podpisu tokena JWT).
- **Authorization (Autoryzacja — kod \`403 Forbidden\`):** Sprawdzenie, czy zalogowany już użytkownik ma uprawnienia do wykonania danej akcji (np. kursant próbuje usunąć kurs należący do administratora).

**2. Role-Based Access Control (RBAC) oraz ochrona przed IDOR (BOLA):**
Sam fakt, że użytkownik ma rolę \`USER\`, nie oznacza, że może edytować profil innego użytkownika, zmieniając ID w adresie \`PATCH /api/users/999\`! To najgroźniejsza luka z listy OWASP API Security (**Broken Object Level Authorization / IDOR**):
\`\`\`typescript
// Middleware wymagający określonej roli:
export function requireRole(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Brak uprawnień (403 Forbidden)' });
    }
    next();
  };
}

// Weryfikacja właściciela zasobu (Ochrona przed IDOR):
if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
  return res.status(403).json({ error: 'Nie jesteś autorem tego wpisu!' });
}
\`\`\`

**3. Dlaczego stosujemy parę Access Token + Refresh Token?**
Gdyby pojedynczy token JWT był ważny przez 30 dni, po zablokowaniu zhakowanego konta token nadal działałby przez miesiąc (bo JWT jest bezstanowy!).
Dlatego w systemach produkcyjnych:
- **Access Token** żyje krótko (np. **15 minut**).
- **Refresh Token** żyje długo (np. **7–30 dni**), jest zapisany w bazie danych i w ciasteczku \`HttpOnly\`. Gdy konto zostaje zablokowane, usuwamy Refresh Token z bazy i po max 15 minutach sesja wygasa.`,
      codeExamples: [
        {
          title: 'Zabezpieczenie trasy Express za pomocą łańcucha authenticate + requireRole',
          language: 'typescript',
          code: `app.delete(
  '/api/courses/:id',
  authenticateToken,          // 1. Sprawdza kim jesteś (401)
  requireRole('ADMIN', 'MENTOR'), // 2. Sprawdza czy masz rolę (403)
  async (req, res) => {
    await courseService.deleteCourse(req.params.id);
    res.status(204).send();
  }
);`,
          explanation: 'Kaskadowe łączenie middleware pozwala deklaratywnie zabezpieczyć dowolny endpoint jedną linijką kodu.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Rozdziel statusy 401 i 403', description: 'Zwracaj 401 gdy brakuje ważnego tokena, a 403 gdy rola użytkownika jest niewystarczająca.' },
        { step: 2, title: 'Zawsze weryfikuj userId zasobu', description: 'W zapytaniach SQL/Prisma używaj klauzuli WHERE { id: itemId, ownerId: req.user.id }.' },
        { step: 3, title: 'Ustaw krótki czas życia Access Tokena', description: 'Stosuj expiresIn: "15m" dla Access Tokena i endpoint /api/auth/refresh.' },
      ],
      interactiveExercise: {
        id: 'ex-sec-3',
        title: 'Wizualizacja strażnika uprawnień RBAC & Anti-IDOR',
        instructions: 'Zbuduj kontener z klasą rbac-guard, wstaw znacznik <code>requireRole("ADMIN") -&gt; 200 Authorized</code> oraz status ochrony "IDOR Ownership Check: Verified".',
        task: 'Utwórz widżet rbac-guard prezentujący kontrolę dostępu opartą na rolach.',
        starterCode: {
          html: '<!-- Zbuduj widżet RBAC poniżej -->\n',
          css: '.rbac-guard { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
          js: 'console.log("RBAC Guard aktywny.");',
        },
        solutionCode: {
          html: '<div class="rbac-guard">\n  <code>requireRole("ADMIN") -&gt; 200 Authorized</code>\n  <div>IDOR Ownership Check: Verified</div>\n</div>',
          css: '.rbac-guard { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
          js: 'console.log("RBAC Guard aktywny.");',
        },
        hints: [
          'Użyj <div class="rbac-guard">.',
          'Wstaw <code>requireRole("ADMIN") -&gt; 200 Authorized</code>.',
          'Dodaj tekst IDOR Ownership Check: Verified.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa rbac-guard obecna', ruleType: 'html_contains', target: 'rbac-guard' },
          { id: 'r2', description: 'Wywołanie requireRole("ADMIN") obecne', ruleType: 'html_contains', target: 'requireRole("ADMIN")' },
          { id: 'r3', description: 'Status IDOR Ownership Check: Verified obecny', ruleType: 'html_contains', target: 'IDOR Ownership Check: Verified' },
        ],
      },
      independentTask: {
        title: 'Naprawa podatności IDOR w endpoincie faktur',
        instructions: 'Zrefaktoryzuj endpoint GET /api/invoices/:invoiceId tak, aby użytkownik nie mógł pobrać faktury sąsiada, wpisując kolejny numer ID w pasku adresu.',
        expectedOutcome: 'Sprawdzenie invoice.userId === req.user.id przed zwróceniem dokumentu.',
        starterHint: 'const invoice = await db.invoice.findFirst({ where: { id: req.params.invoiceId, userId: req.user.id } });',
      },
      quiz: [
        {
          id: 'q-sec3-1',
          question: 'Na czym polega podatność bezpieczeństwa nazywana IDOR (Insecure Direct Object Reference / BOLA)?',
          options: [
            'Serwer sprawdza wprawdzie, czy użytkownik jest zalogowany, ale nie weryfikuje, czy pobierany lub modyfikowany rekord (np. `/api/orders/105`) faktycznie należy do tego użytkownika',
            'Użytkownik zapomina swojego hasła',
            'Baza danych działa zbyt wolno przy dużym ruchu',
            'Strona nie posiada ciemnego motywu',
          ],
          correctAnswer: 0,
          explanation: 'Aby zapobiec IDOR, każde zapytanie do bazy musi porównywać właściciela zasobu z ID zalogowanego użytkownika z tokena.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Ukrywanie przycisku "Usuń wszystko" tylko w kodzie Reacta (`{user.role === "ADMIN" && <DeleteBtn />}`) bez zabezpieczenia endpointu na backendzie',
          whyItHappens: 'Złudne poczucie, że skoro przycisku nie widać na ekranie, to nikt nie wywoła akcji.',
          howToFix: 'Każdy użytkownik może otworzyć konsolę lub program Postman i wysłać żądanie DELETE bezpośrednio do API. Autoryzacja ról MUSI być zawsze egzekwowana na serwerze!',
          badCode: '// Tylko ukrycie w UI, a endpoint DELETE /api/users otwarty dla każdego',
          goodCode: 'app.delete("/api/users/:id", authenticate, requireRole("ADMIN"), deleteUser);',
        },
      ],
      practicalTask: {
        title: 'Macierz uprawnień dla 3 ról w akademii',
        brief: 'Zaprojektuj obiekt uprawnień dla ról STUDENT, MENTOR oraz ADMIN i napisz funkcję canPerform(role, action), np. canPerform("MENTOR", "review_code").',
        steps: ['Zdefiniuj stałą PERMISSIONS z użyciem as const', 'Napisz funkcję sprawdzającą obecność uprawnienia', 'Przetestuj dla wszystkich ról'],
        deliverable: 'Czysty moduł autoryzacji uprawnień (Permission-Based Access Control).',
      },
      completionCriteria: [
        'Zrozumienie RBAC, Refresh Tokenów i ochrony przed IDOR',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'sec-4',
      moduleId: 10,
      moduleTitle: 'Bezpieczeństwo i Uwierzytelnianie Aplikacji',
      title: 'Ochrona przed botami (Honeypot, Timing Verification), Zarządzanie Sekretami i Audyt npm',
      slug: 'bezpieczenstwo-ochrona-przed-botami-honeypot-sekrety-npm-audit',
      durationMinutes: 40,
      xpReward: 85,
      order: 4,
      summary: 'Jak chronić formularze rejestracji i kontaktowe przed automatycznymi botami spamującymi bez psucia UX irytującymi obrazkami CAPTCHA? Poznaj technikę Honeypot, analizę czasu wypełniania formularza, bezpieczne zarządzanie sekretami oraz audyt podatności pakietów (npm audit).',
      objectives: [
        'Implementować niewidoczną dla ludzi pułapkę Honeypot oraz weryfikację czasu interakcji (Heuristic Timing Check)',
        'Zarządzać kluczami API i sekretami bez ryzyka ich wycieku do repozytorium Git lub paczki klienckiej',
        'Przeprowadzać audyt bezpieczeństwa zależności zewnętrznych (Supply Chain Security) za pomocą npm audit',
      ],
      prerequisites: ['Walidacja formularzy i nagłówki bezpieczeństwa'],
      theoryMarkdown: `Boty internetowe nieustannie skanują publiczne formularze rejestracji, logowania i komentarzy. Możemy zatrzymać 99% zautomatyzowanych skryptów za pomocą wielowarstwowej obrony niewidocznej dla prawdziwego użytkownika!

**1. Pułapka Honeypot ("Słoik miodu" na boty):**
Dodajemy do formularza dodatkowe pole (np. \`website_url\` lub \`company_fax\`), które ukrywamy wizualnie w CSS (\`opacity: 0; position: absolute; pointer-events: none;\`) i oznaczamy \`tabIndex={-1}\` oraz \`aria-hidden="true"\`.
- **Człowiek** nie widzi tego pola i zostawia je puste.
- **Bot spamujący** parsuje kod HTML i automatycznie wpisuje tekst we wszystkie znalezione pola \`<input>\`.
- Jeśli na serwerze pole \`honeypot\` nie jest puste -> natychmiast odrzucamy żądanie!

**2. Heurystyczna weryfikacja czasu (Timing Check):**
Prawdziwy człowiek potrzebuje przynajmniej **1.5–2 sekund**, aby przeczytać i wypełnić formularz rejestracyjny. Skrypt bota wysyła żądanie \`POST\` w **20 milisekund** od załadowania widoku:
\`\`\`typescript
const elapsedMs = Date.now() - formRenderedAtTimestamp;
if (elapsedMs < 1200) {
  throw new Error('Podejrzanie szybka wysyłka formularza (Bot detected).');
}
\`\`\`

**3. Bezpieczeństwo łańcucha dostaw (Supply Chain Security) i Sekrety:**
- **Nigdy nie umieszczaj prywatnych kluczy API w zmiennych zaczynających się od \`VITE_\` lub \`NEXT_PUBLIC_\`**, ponieważ bundler wklei je bezpośrednio do pliku JavaScript widocznego dla każdego w DevTools!
- Regularnie uruchamiaj \`npm audit\`, aby wykrywać znane luki bezpieczeństwa (CVE) w zainstalowanych bibliotekach.`,
      codeExamples: [
        {
          title: 'Weryfikacja antybotowa używana w naszej Akademii Full Stack',
          language: 'typescript',
          code: `export function verifyHumanInteraction(params: {
  honeypotValue: string;
  elapsedMs: number;
  challengeChecked: boolean;
}): { valid: boolean; reason?: string } {
  // 1. Sprawdzenie pułapki Honeypot
  if (params.honeypotValue.trim() !== '') {
    return { valid: false, reason: 'Wykryto bota (Honeypot triggered).' };
  }
  // 2. Sprawdzenie minimalnego czasu wypełniania (min. 1.2 sekundy)
  if (params.elapsedMs < 1200) {
    return { valid: false, reason: 'Formularz wysłany zbyt szybko.' };
  }
  // 3. Weryfikacja wyzwania interaktywnego
  if (!params.challengeChecked) {
    return { valid: false, reason: 'Potwierdź weryfikację bezpieczeństwa.' };
  }
  return { valid: true };
}`,
          explanation: 'Połączenie ukrytego pola Honeypot, pomiaru czasu i Rate Limitera skutecznie chroni endpointy bez konieczności przeklikiwania świateł drogowych.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Dodaj ukryte pole Honeypot do formularza', description: 'Pamiętaj o atrybutach tabIndex={-1} oraz autoComplete="off", aby przeglądarka sama go nie wypełniła.' },
        { step: 2, title: 'Sprawdź sekrety na frontendzie', description: 'Klucze prywatne mogą istnieć tylko na backendzie (server.ts) i być wywoływane przez proxy /api/*.' },
        { step: 3, title: 'Włącz automatyczny audyt w CI/CD', description: 'Uruchamiaj npm audit --audit-level=high w potoku GitHub Actions.' },
      ],
      interactiveExercise: {
        id: 'ex-sec-4',
        title: 'Widżet wielowarstwowej tarczy Anty-Botowej',
        instructions: 'Zbuduj kontener z klasą antibot-shield, wstaw znacznik <code>Honeypot: Empty | Timing: 3420ms</code> oraz werdykt "Human Verification: PASSED".',
        task: 'Utwórz widżet antibot-shield prezentujący wynik weryfikacji antybotowej.',
        starterCode: {
          html: '<!-- Zbuduj widżet ochrony antybotowej poniżej -->\n',
          css: '.antibot-shield { background: #0f172a; border: 1px solid #38bdf8; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #38bdf8; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Anti-Bot Shield aktywny.");',
        },
        solutionCode: {
          html: '<div class="antibot-shield">\n  <code>Honeypot: Empty | Timing: 3420ms</code>\n  <div>Human Verification: PASSED</div>\n</div>',
          css: '.antibot-shield { background: #0f172a; border: 1px solid #38bdf8; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #38bdf8; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Anti-Bot Shield aktywny.");',
        },
        hints: [
          'Użyj <div class="antibot-shield">.',
          'Wstaw <code>Honeypot: Empty | Timing: 3420ms</code>.',
          'Dodaj tekst Human Verification: PASSED.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa antibot-shield obecna', ruleType: 'html_contains', target: 'antibot-shield' },
          { id: 'r2', description: 'Informacja Honeypot: Empty obecna', ruleType: 'html_contains', target: 'Honeypot: Empty' },
          { id: 'r3', description: 'Werdykt Human Verification: PASSED obecny', ruleType: 'html_contains', target: 'Human Verification: PASSED' },
        ],
      },
      independentTask: {
        title: 'Komponent pola Honeypot dostępny dla czytników ekranu',
        instructions: 'Stwórz w React ukryte pole input dla pułapki Honeypot z atrybutami aria-hidden="true", tabIndex={-1} oraz autoComplete="off", aby ani użytkownicy klawiatury, ani menedżery haseł nie wypełnili go przypadkowo.',
        expectedOutcome: 'Bezpieczna pułapka na boty bez fałszywych alarmów u prawdziwych użytkowników.',
        starterHint: '<input type="text" name="website_trap" tabIndex={-1} autoComplete="off" aria-hidden="true" className="opacity-0 absolute -z-10 pointer-events-none" />',
      },
      quiz: [
        {
          id: 'q-sec4-1',
          question: 'Dlaczego nie wolno przechowywać prywatnego klucza API (np. `OPENAI_API_KEY` lub `STRIPE_SECRET_KEY`) w zmiennej środowiskowej zaczynającej się od prefiksu `VITE_` w aplikacji React?',
          options: [
            'Ponieważ Vite dołącza wszystkie zmienne z prefiksem `VITE_` bezpośrednio do publicznej paczki JavaScript wysyłanej do przeglądarki, przez co każdy użytkownik może je odczytać w zakładce Sources/Network',
            'Ponieważ zmienne `VITE_` mają limit długości do 10 znaków',
            'Ponieważ przeglądarka Chrome blokuje słowo VITE',
            'Ponieważ spowalnia to animacje CSS',
          ],
          correctAnswer: 0,
          explanation: 'Prywatne klucze API muszą znajdować się wyłącznie po stronie serwera (Node.js) i nigdy nie mogą opuszczać środowiska backendowego.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Brak atrybutu `autoComplete="off"` na ukrytym polu Honeypot',
          whyItHappens: 'Pominięcie zachowania automatycznego uzupełniania formularzy przez przeglądarkę.',
          howToFix: 'Jeśli nazwiesz pole Honeypot np. `phone` lub `address`, przeglądarka użytkownika może automatycznie wpisać tam jego dane z autouzupełniania i zablokować mu rejestrację! Używaj neutralnej nazwy i `autoComplete="off"`.',
          badCode: '<input name="phone" className="hidden" /> // Autouzupełnianie przeglądarki wypełni to pole!',
          goodCode: '<input name="bot_check_field" autoComplete="off" tabIndex={-1} aria-hidden="true" />',
        },
      ],
      practicalTask: {
        title: 'Inspekcja modala rejestracji w naszej Akademii',
        brief: 'Otwórz komponent AuthModal.tsx w kodzie projektu i przeanalizuj, jak działają w nim zabezpieczenia Honeypot oraz pomiar czasu otwarcia formularza.',
        steps: ['Znajdź plik src/components/AuthModal.tsx', 'Zobacz stan honeypot oraz openedAt', 'Sprawdź walidację przed utworzeniem konta'],
        deliverable: 'Praktyczna znajomość produkcyjnych zabezpieczeń formularzy.',
      },
      completionCriteria: [
        'Zrozumienie pułapki Honeypot, ochrony sekretów i audytu zależności',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
  ],
};

