import { Module } from '../../types';

export const MODULE_8: Module = {
  id: 8,
  title: 'Backend z Node.js i Express',
  category: 'Backend',
  description: 'Architektura serwerowa: środowisko uruchomieniowe Node.js, framework Express.js, routing, middleware, REST API, walidacja Zod i obsługa błędów.',
  badgeName: 'Mistrz Serwera Node.js',
  badgeIcon: 'Server',
  durationHours: 35,
  totalXp: 950,
  prerequisites: ['Moduł 4: JavaScript', 'Moduł 6: TypeScript'],
  topics: [
    'Jak działa silnik V8, pętla zdarzeń Node.js i asynchroniczne I/O',
    'Tworzenie serwera HTTP i routing w Express.js',
    'Koncepcja Middleware: uwierzytelnianie, logowanie zapytań (Morgan/Winston), parsowanie JSON',
    'Standard projektowania REST API: zasoby, metody HTTP (GET, POST, PUT, PATCH, DELETE) i kody odpowiedzi',
    'Rygorystyczna walidacja danych wejściowych z użyciem biblioteki Zod',
    'Globalna obsługa błędów: centralny middleware błędów i bezpieczne komunikaty',
  ],
  projectBrief: 'Projekt modułu: Kompletne REST API dla systemu rezerwacji z autoryzacją i dokumentacją OpenAPI/Swagger.',
  lessons: [
    {
      id: 'node-1',
      moduleId: 8,
      moduleTitle: 'Backend z Node.js i Express',
      title: 'Środowisko Node.js, routing w Express.js i potok Middleware',
      slug: 'nodejs-express-routing-middleware',
      durationMinutes: 40,
      xpReward: 80,
      order: 1,
      summary: 'Przejdź na stronę serwera: jak działa Node.js, tworzenie instancji aplikacji Express, routing zapytań HTTP oraz potężny łańcuch middleware (req, res, next).',
      objectives: [
        'Zrozumieć architekturę serwerową Node.js i asynchroniczne operacje I/O',
        'Tworzyć trasy w Express: app.get, app.post, app.put, app.delete',
        'Stosować funkcje pośredniczące (Middleware) i sterować przepływem za pomocą next()',
      ],
      prerequisites: ['Moduł 4: JavaScript'],
      theoryMarkdown: `**Node.js** to środowisko uruchomieniowe umożliwiające wykonywanie kodu JavaScript poza przeglądarką — bezpośrednio na serwerze, z pełnym dostępem do systemu plików, sieci i baz danych.

**Framework Express.js:**
Najpopularniejszy na świecie minimalistyczny framework serwerowy dla Node.js. 

**Architektura Middleware (Potok przetwarzania):**
Żądanie HTTP przechodzi przez łańcuch funkcji pośredniczących:
\`\`\`
Klient ---> [express.json()] ---> [authMiddleware] ---> [Route Handler] ---> Odpowiedź
\`\`\`

Każdy middleware przyjmuje 3 argumenty: \`(req, res, next)\`:
- \`req\` (Request) — nagłówki, parametry URL (\`req.params\`), query string (\`req.query\`) oraz ciało (\`req.body\`).
- \`res\` (Response) — metody do odesłania odpowiedzi: \`res.status(200).json({ status: 'ok' })\`.
- \`next\` — funkcja przekazująca kontrolę do kolejnego middleware w łańcuchu.`,
      codeExamples: [
        {
          title: 'Minimalny, kompletny serwer Express w TypeScript',
          language: 'typescript',
          code: `import express, { Request, Response, NextFunction } from 'express';

const app = express();

// 1. Wbudowany middleware do parsowania JSON w ciele żądania:
app.use(express.json());

// 2. Własny middleware logujący czas i metodę zapytania:
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next(); // Przekaż sterowanie dalej
});

// 3. Trasa pobierania listy kursów:
app.get('/api/courses', (req: Request, res: Response) => {
  res.json([
    { id: 1, title: 'HTML5 & CSS3 Masterclass' },
    { id: 2, title: 'Full Stack Node.js & React' }
  ]);
});

app.listen(3000, () => console.log('Serwer działa na porcie 3000'));`,
          explanation: 'app.use() rejestruje middleware globalnie dla każdego przychodzącego zapytania.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zainstaluj express', description: 'npm install express @types/express.' },
        { step: 2, title: 'Włącz parser app.use(express.json())', description: 'Bez tego req.body będzie undefined.' },
        { step: 3, title: 'Zdefiniuj trasę z app.get lub app.post', description: 'Zwróć odpowiedź res.json().' },
      ],
      interactiveExercise: {
        id: 'ex-node-1',
        title: 'Komponent wizualizacji statusu serwera Express',
        instructions: 'Zaprojektuj wizualny widżet statusu serwera Express: stwórz kontener z klasą server-status, zieloną kropkę, informację <code>GET /api/courses</code> oraz status <span class="status-200">200 OK</span>.',
        task: 'Utwórz widget z klasą server-status, trasą GET i kodem 200 OK.',
        starterCode: {
          html: '<!-- Zbuduj widżet serwera poniżej -->\n',
          css: '.server-status { background: #0f172a; border: 1px solid #334155; padding: 12px 18px; border-radius: 8px; display: inline-flex; align-items: center; gap: 10px; font-family: monospace; font-size: 0.85rem; color: #cbd5e1; }\ncode { color: #38bdf8; font-weight: bold; }\n.status-200 { color: #4ade80; font-weight: bold; }',
          js: 'console.log("Express visualizer aktywny.");',
        },
        solutionCode: {
          html: '<div class="server-status">\n  <code>GET /api/courses</code>\n  <span class="status-200">200 OK</span>\n</div>',
          css: '.server-status { background: #0f172a; border: 1px solid #334155; padding: 12px 18px; border-radius: 8px; display: inline-flex; align-items: center; gap: 10px; font-family: monospace; font-size: 0.85rem; color: #cbd5e1; }\ncode { color: #38bdf8; font-weight: bold; }\n.status-200 { color: #4ade80; font-weight: bold; }',
          js: 'console.log("Express visualizer aktywny.");',
        },
        hints: [
          'Użyj <div class="server-status">.',
          'Wstaw <code>GET /api/courses</code>.',
          'Wstaw <span class="status-200">200 OK</span>.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa server-status obecna', ruleType: 'html_contains', target: 'server-status' },
          { id: 'r2', description: 'Trasa GET /api/courses obecna', ruleType: 'html_contains', target: 'GET /api/courses' },
          { id: 'r3', description: 'Kod statusu 200 OK obecny', ruleType: 'html_contains', target: '200 OK' },
        ],
      },
      independentTask: {
        title: 'Middleware sprawdzania autoryzacji',
        instructions: 'Napisz funkcję sprawdzającą czy nagłówek req.headers.authorization istnieje, a jeśli nie — zwróć res.status(401).json({ error: "Brak tokena" }).',
        expectedOutcome: 'Podstawowa ochrona prywatnych endpointów.',
        starterHint: 'Jeśli autoryzacja jest poprawna, pamiętaj o wywołaniu next().',
      },
      quiz: [
        {
          id: 'q-node1-1',
          question: 'Co się stanie w aplikacji Express, jeśli wewnątrz własnego middleware zapomnisz wywołać funkcję next()?',
          options: [
            'Zapytanie klienta "zawiśnie" w nieskończoność w oczekiwaniu na odpowiedź serwera (Request Timeout)',
            'Express automatycznie zgadnie kolejny krok',
            'Serwer natychmiast ulegnie awarii',
            'Kod błędu 404 zostanie odesłany',
          ],
          correctAnswer: 0,
          explanation: 'Bez wywołania next() lub wysłania res.send(), łańcuch middleware zostaje przerwany i przeglądarka czeka w nieskończoność.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Brak middleware app.use(express.json()) przed trasami POST',
          whyItHappens: 'Założenie, że req.body parsuje się samo z automatu.',
          howToFix: 'Zawsze umieszczaj app.use(express.json()) na samej górze pliku serwera.',
          badCode: '// Brak express.json() -> req.body będzie undefined!',
          goodCode: 'app.use(express.json()); // Na początku',
        },
      ],
      practicalTask: {
        title: 'Uruchomienie serwera Express w pliku server.ts',
        brief: 'Stwórz trasę GET /health zwracającą status serwera i czas działania (uptime).',
        steps: ['Zaimportuj express', 'Utwórz trasę GET /health', 'Zwróć status 200 z timestampem'],
        deliverable: 'Działający endpoint monitoringu serwera.',
      },
      completionCriteria: [
        'Zrozumienie routingu i potoku middleware w Express',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'node-2',
      moduleId: 8,
      moduleTitle: 'Backend z Node.js i Express',
      title: 'REST API, rygorystyczna walidacja Zod i centralna obsługa błędów',
      slug: 'rest-api-walidacja-zod-bledy',
      durationMinutes: 40,
      xpReward: 80,
      order: 2,
      summary: 'Nigdy nie ufaj danym od klienta! Zbuduj bezpieczne REST API z walidacją schematów w Zod, automatycznym generowaniem typów TypeScript oraz centralnym middleware błędów.',
      objectives: [
        'Projektować czyste endpointy REST (CRUD: GET, POST, PUT, DELETE)',
        'Walidować ciało zapytania za pomocą biblioteki Zod (zod schema.parse)',
        'Obsługiwać błędy w centralnym middleware (err, req, res, next) bez ujawniania sekretów',
      ],
      prerequisites: ['Lekcja 1: Podstawy Node.js i Express'],
      theoryMarkdown: `Zasada numer jeden inżynierii backendowej: **Nigdy nie ufaj danym przesyłanym przez przeglądarkę**. Użytkownik może ominąć walidację HTML/JS za pomocą Postmana lub curl.

**Biblioteka Zod:**
To światowy standard walidacji danych w ekosystemie TypeScript:
\`\`\`typescript
import { z } from 'zod';

const CreateCourseSchema = z.object({
  title: z.string().min(5, "Tytuł musi mieć min. 5 znaków"),
  price: z.number().positive("Cena musi być większa od zera"),
  category: z.enum(["Frontend", "Backend", "FullStack"])
});

// Automatyczny typ TypeScript wygenerowany ze schematu:
type CreateCourseInput = z.infer<typeof CreateCourseSchema>;
\`\`\`

**Centralny Error Handler:**
Wszystkie błędy z bloków \`catch\` przekazujemy do \`next(err)\`. Na samym końcu aplikacji rejestrujemy 4-argumentowy middleware:
\`\`\`typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Błąd serwera:", err.message);
  res.status(500).json({ error: "Wewnętrzny błąd serwera" });
});
\`\`\``,
      codeExamples: [
        {
          title: 'Bezpieczny endpoint rejestracji kursanta z walidacją Zod',
          language: 'typescript',
          code: `import { z } from 'zod';

const RegisterSchema = z.object({
  email: z.string().email("Niepoprawny format adresu e-mail"),
  password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków")
});

app.post('/api/register', async (req, res, next) => {
  try {
    // 1. Rygorystyczna walidacja:
    const validatedData = RegisterSchema.parse(req.body);

    // 2. Logika biznesowa (zapis w bazie danych)...
    res.status(201).json({ status: 'success', email: validatedData.email });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    next(err);
  }
});`,
          explanation: 'Zod gwarantuje, że do logiki biznesowej trafią wyłącznie w 100% zwalidowane dane.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zdefiniuj schemat w Zod', description: 'Użyj z.object({ pole: z.typ() }).' },
        { step: 2, title: 'Przeprowadź walidację w trasie', description: 'Wywołaj schema.parse(req.body).' },
        { step: 3, title: 'Zwróć status 400 przy błędzie walidacji', description: 'Odeślij czytelne komunikaty o błędach pól.' },
      ],
      interactiveExercise: {
        id: 'ex-node-2',
        title: 'Komponent wizualizacji statusu walidacji REST API',
        instructions: 'Zaprojektuj wizualny widżet walidacji danych API: stwórz kontener z klasą validation-card, informację <code>POST /api/register</code> oraz odznakę błędu walidacji <span class="badge-400">400 Bad Request</span>.',
        task: 'Utwórz element validation-card z trasą POST i kodem 400 Bad Request.',
        starterCode: {
          html: '<!-- Zbuduj widżet walidacji poniżej -->\n',
          css: '.validation-card { background: #0f172a; border: 1px solid #334155; padding: 12px 18px; border-radius: 8px; display: inline-flex; align-items: center; gap: 10px; font-family: monospace; font-size: 0.85rem; color: #cbd5e1; }\ncode { color: #f59e0b; font-weight: bold; }\n.badge-400 { color: #f87171; font-weight: bold; }',
          js: 'console.log("REST validation gotowa.");',
        },
        solutionCode: {
          html: '<div class="validation-card">\n  <code>POST /api/register</code>\n  <span class="badge-400">400 Bad Request</span>\n</div>',
          css: '.validation-card { background: #0f172a; border: 1px solid #334155; padding: 12px 18px; border-radius: 8px; display: inline-flex; align-items: center; gap: 10px; font-family: monospace; font-size: 0.85rem; color: #cbd5e1; }\ncode { color: #f59e0b; font-weight: bold; }\n.badge-400 { color: #f87171; font-weight: bold; }',
          js: 'console.log("REST validation gotowa.");',
        },
        hints: [
          'Użyj <div class="validation-card">.',
          'Wstaw <code>POST /api/register</code>.',
          'Wstaw <span class="badge-400">400 Bad Request</span>.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa validation-card obecna', ruleType: 'html_contains', target: 'validation-card' },
          { id: 'r2', description: 'Trasa POST /api/register obecna', ruleType: 'html_contains', target: 'POST /api/register' },
          { id: 'r3', description: 'Kod 400 Bad Request obecny', ruleType: 'html_contains', target: '400 Bad Request' },
        ],
      },
      independentTask: {
        title: 'Schemat walidacji logowania w Zod',
        instructions: 'Napisz schemat LoginSchema weryfikujący czy email jest poprawny oraz hasło ma min. 8 znaków.',
        expectedOutcome: 'Natychmiastowe odrzucanie niepoprawnych danych na poziomie API.',
        starterHint: 'z.object({ email: z.string().email(), password: z.string().min(8) })',
      },
      quiz: [
        {
          id: 'q-node2-1',
          question: 'Jaki kod statusu HTTP powinien zwrócić serwer, gdy dane przesłane w ciele zapytania nie przejdą walidacji Zod?',
          options: [
            '200 OK',
            '400 Bad Request (lub 422 Unprocessable Entity)',
            '500 Internal Server Error',
            '301 Moved Permanently',
          ],
          correctAnswer: 1,
          explanation: 'Błąd walidacji danych wejściowych to błąd po stronie klienta (rodzina 4xx), a nie awaria serwera (500).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Ujawnianie pełnego Stack Trace błędu w odpowiedzi dla użytkownika na produkcji',
          whyItHappens: 'Domyślna konfiguracja Expressa bez własnego Error Handlera.',
          howToFix: 'Stack trace ujawnia strukturę plików serwera, co ułatwia atak. Na produkcji zawsze zwracaj ogólny komunikat błędu.',
          badCode: 'res.status(500).json({ stack: err.stack }); // Wyciek danych bezpieczeństwa!',
          goodCode: 'res.status(500).json({ error: "Wystąpił wewnętrzny błąd serwera" });',
        },
      ],
      practicalTask: {
        title: 'Integracja biblioteki Zod z trasą Express',
        brief: 'Zaimplementuj middleware walidacyjny z funkcją validate(schema).',
        steps: ['Napisz generyczny middleware walidujący', 'Podepnij pod trasę POST', 'Przetestuj z błędnymi danymi'],
        deliverable: 'Czysta, modułowa walidacja API.',
      },
      completionCriteria: [
        'Zrozumienie walidacji w architekturze REST',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'node-3',
      moduleId: 8,
      moduleTitle: 'Backend z Node.js i Express',
      title: 'Architektura warstwowa: Kontrolery, Serwisy i Centralny Error Handler',
      slug: 'nodejs-architektura-warstwowa-controllers-services',
      durationMinutes: 45,
      xpReward: 90,
      order: 3,
      summary: 'Koniec z pisaniem całego kodu w jednym pliku! Poznaj wzorzec warstwowy (Controller - Service - Repository), rozdzielanie logiki HTTP od logiki biznesowej oraz centralny middleware obsługi wyjątków.',
      objectives: [
        'Projektować architekturę warstwową (Routes -> Controllers -> Services -> Repositories)',
        'Unikać umieszczania zapytań do bazy danych bezpośrednio w funkcjach obsługi tras (Route Handlers)',
        'Wdrażać centralny middleware błędów (err, req, res, next) obsługujący błędy synchroniczne i asynchroniczne',
      ],
      prerequisites: ['Moduł 8: Lekcja 1 i 2'],
      theoryMarkdown: `W profesjonalnych aplikacjach komercyjnych nie wolno łączyć obsługi protokołu HTTP (nagłówki, statusy) z logiką biznesową (kalkulacja rabatów, wysyłka e-maili) ani z zapytaniami do bazy.

**Architektura 3-warstwowa (Layered Architecture):**
1. **Routing & Controller:** Odbiera żądanie (\`req\`), wyciąga parametry, waliduje je (np. Zod) i wywołuje odpowiedni serwis. Następnie zwraca odpowiedź (\`res.status(...).json(...)\`).
2. **Service Layer (Logika biznesowa):** Czyste reguły biznesowe, niezależne od Expressa. Tu sprawdzamy np. czy kursant ma wystarczającą ilość XP lub czy subskrypcja jest aktywna.
3. **Data Access / Repository:** Bezpośrednia komunikacja z bazą danych (SQL / Prisma / Firestore).

**Centralny Error Handler:**
Express posiada specjalny 4-argumentowy middleware:
\`\`\`typescript
import { ErrorRequestHandler } from 'express';

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Wewnętrzny błąd serwera';

  console.error('[API Error]:', err);

  res.status(statusCode).json({
    success: false,
    error: {
      status: statusCode,
      message,
    },
  });
};
\`\`\``,
      codeExamples: [
        {
          title: 'Wzorzec separacji Kontroler vs Serwis w Express',
          language: 'typescript',
          code: `// users.service.ts - Czysta logika domenowa
export class UsersService {
  async enrollStudent(userId: string, courseId: string) {
    const student = await db.user.findUnique({ where: { id: userId } });
    if (!student) throw new AppError(404, 'Kursant nie istnieje');
    if (student.lives <= 0 && !student.isPro) {
      throw new AppError(403, 'Brak serduszek do zapisu na nowy kurs');
    }
    return db.enrollment.create({ data: { userId, courseId } });
  }
}

// users.controller.ts - Warstwa protokołu HTTP
export const enrollController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new UsersService();
    const result = await service.enrollStudent(req.user.id, req.body.courseId);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error); // Przekazanie do centralnego Error Handlera!
  }
};`,
          explanation: 'Dzięki separacji serwis można łatwo przetestować testami jednostkowymi bez uruchamiania serwera HTTP.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Wydziel trasę i kontroler', description: 'Plik routes.ts rejestruje endpoint, controller.ts obsługuje req/res.' },
        { step: 2, title: 'Wydziel klasę serwisu', description: 'Logika biznesowa nie powinna mieć zależności od obiektów req i res.' },
        { step: 3, title: 'Zarejestruj errorHandler na końcu', description: 'app.use(errorHandler) musi być ostatnim middleware w pliku server.ts.' },
      ],
      interactiveExercise: {
        id: 'ex-node-3',
        title: 'Komponent widoku statusu mikroserwisów (Architecture Monitor)',
        instructions: 'Zaprojektuj widżet monitorujący warstwy architektury serwera: stwórz kontener z klasą arch-monitor, element warstwy kontrolera "Controller Layer: Active", oraz element warstwy bazy "Database Pool: Connected".',
        task: 'Utwórz blok arch-monitor z elementami Controller Layer: Active oraz Database Pool: Connected.',
        starterCode: {
          html: '<!-- Zbuduj widok monitora warstw poniżej -->\n',
          css: '.arch-monitor { background: #090d16; border: 1px solid #1e293b; padding: 16px; border-radius: 10px; font-family: monospace; color: #38bdf8; }\n.layer { margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }\n.status-ok { color: #34d399; font-weight: bold; }',
          js: 'console.log("Architecture Monitor zainicjalizowany.");',
        },
        solutionCode: {
          html: '<div class="arch-monitor">\n  <div class="layer">\n    <span>Controller Layer: Active</span>\n  </div>\n  <div class="layer">\n    <span>Database Pool: Connected</span>\n  </div>\n</div>',
          css: '.arch-monitor { background: #090d16; border: 1px solid #1e293b; padding: 16px; border-radius: 10px; font-family: monospace; color: #38bdf8; }\n.layer { margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }\n.status-ok { color: #34d399; font-weight: bold; }',
          js: 'console.log("Architecture Monitor zainicjalizowany.");',
        },
        hints: [
          'Użyj kontenera <div class="arch-monitor">.',
          'Wstaw tekst Controller Layer: Active.',
          'Wstaw tekst Database Pool: Connected.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa arch-monitor obecna', ruleType: 'html_contains', target: 'arch-monitor' },
          { id: 'r2', description: 'Controller Layer: Active obecne', ruleType: 'html_contains', target: 'Controller Layer: Active' },
          { id: 'r3', description: 'Database Pool: Connected obecne', ruleType: 'html_contains', target: 'Database Pool: Connected' },
        ],
      },
      independentTask: {
        title: 'Klasa własnych wyjątków biznesowych (Custom Exceptions)',
        instructions: 'Zdefiniuj klasę NotFoundError dziedziczącą po AppError z kodem 404 oraz UnauthorizedError z kodem 401.',
        expectedOutcome: 'Jednolita, samoopisująca się hierarchia błędów w całym projekcie.',
        starterHint: 'class NotFoundError extends AppError { constructor(msg) { super(404, msg); } }',
      },
      quiz: [
        {
          id: 'q-node3-1',
          question: 'Dlaczego w architekturze warstwowej zapytania do bazy danych umieszcza się w warstwie Repozytorium/Serwisu, a nie w Kontrolerze?',
          options: [
            'Umożliwia to łatwe testowanie logiki biznesowej bez konieczności symulowania zapytań HTTP oraz pozwala na ponowne użycie tej samej metody w wielu trasach lub zadaniach cron',
            'Kontroler Expressa nie pozwala na używanie słowa kluczowego async/await',
            'Baza danych PostgreSQL nie akceptuje połączeń z kontrolerów',
            'Zmniejsza to zużycie prądu przez serwer o 50%',
          ],
          correctAnswer: 0,
          explanation: 'Separacja odpowiedzialności pozwala na testowanie jednostkowe i izolację warstwy sieciowej od logiki danych.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Przekazywanie obiektów req i res bezpośrednio do warstwy serwisu',
          whyItHappens: 'Wygoda programisty, który chce mieć dostęp do nagłówków w każdym miejscu kodu.',
          howToFix: 'Przekazuj do serwisu wyłącznie wyekstrahowane dane domenowe (np. userId, amount), zachowując pełną niezależność serwisu od frameworka HTTP.',
          badCode: 'async createOrder(req: Request) { const user = req.user; ... }',
          goodCode: 'async createOrder(userId: string, orderData: OrderDto) { ... }',
        },
      ],
      practicalTask: {
        title: 'Refaktoryzacja punktu końcowego API',
        instructions: 'Przeanalizuj endpoint rejestracji w projekcie i rozdziel go na plik route, controller oraz service.',
        brief: 'Stwórz czysty potok architektoniczny Controller -> Service.',
        steps: ['Wyodrębnij funkcję kontrolera', 'Stwórz klasę serwisu', 'Podepnij pod middleware błędów'],
        deliverable: 'Czysty kod produkcyjny.',
      },
      completionCriteria: [
        'Zrozumienie architektury warstwowej i separacji zadań',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
  ],
};
