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
  ],
};
