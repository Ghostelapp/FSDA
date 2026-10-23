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
    {
      id: 'node-4',
      moduleId: 8,
      moduleTitle: 'Node.js i Express — Budowa Backendu i REST API',
      title: 'Wbudowane moduły Node.js: fs/promises, path, crypto, Buffer oraz Strumienie (Streams)',
      slug: 'nodejs-moduly-fs-promises-path-crypto-streams',
      durationMinutes: 45,
      xpReward: 85,
      order: 4,
      summary: 'Zanim sięgniesz po zewnętrzne paczki z npm, poznaj potężną bibliotekę standardową Node.js: asynchroniczne operacje na plikach (node:fs/promises), bezpieczne łączenie ścieżek (node:path), generowanie UUID i skrótów (node:crypto) oraz przetwarzanie gigabajtowych plików przez Streams.',
      objectives: [
        'Wykonywać nieblokujące operacje odczytu i zapisu plików za pomocą modułu node:fs/promises',
        'Budować wieloplatformowe ścieżki plików przy użyciu path.join() i path.resolve()',
        'Rozumieć działanie buforów binarnych (Buffer) i strumieni (Readable/Writable Streams) oszczędzających pamięć RAM',
      ],
      prerequisites: ['Architektura Node.js i Event Loop'],
      theoryMarkdown: `Nowoczesny Node.js posiada bogaty zestaw wbudowanych modułów dostępnych przez prefiks **\`node:\`** (np. \`import fs from 'node:fs/promises'\`), które nie wymagają instalowania żadnych zależności.

**1. Asynchroniczny system plików (\`node:fs/promises\`):**
Na serwerze produkcyjnym **nigdy** nie używaj metod synchronicznych (\`fs.readFileSync\`), ponieważ zatrzymują one cały wątek Event Loop dla wszystkich klientów!
\`\`\`typescript
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

async function saveAuditLog(entry: string) {
  const logsDir = path.join(process.cwd(), 'logs');
  await mkdir(logsDir, { recursive: true });
  const filePath = path.join(logsDir, 'audit.log');
  await writeFile(filePath, \`\${new Date().toISOString()} - \${entry}\\n\`, { flag: 'a' });
}
\`\`\`

**2. Moduł \`node:path\` — Koniec z błędami ukośników \`/\` vs \`\\\`:**
System Windows używa ukośnika \`\\\`, a Linux/macOS używa \`/\`. Ręczne sklejanie stringów \`dir + "/" + file\` prowadzi do błędów oraz luk bezpieczeństwa (Path Traversal). Zawsze używaj \`path.join(dir, 'plik.json')\`.

**3. Moduł \`node:crypto\` — Kryptografia wbudowana w silnik:**
- \`crypto.randomUUID()\` — błyskawicznie generuje unikalny identyfikator v4 UUID (np. \`"3b241101-e2bb-4255-8caf-4136c566a962"\`).
- \`crypto.randomBytes(32).toString('hex')\` — generuje bezpieczny kryptograficznie token sesji lub resetu hasła.

**4. Strumienie (\`Streams\`) — Przetwarzanie danych kawałek po kawałku (Chunk by Chunk):**
Wyobraź sobie, że użytkownik pobiera z Twojego serwera plik wideo o wadze 2 GB.
- \`fs.readFile()\` spróbuje wczytać całe 2 GB naraz do pamięci RAM serwera, powodując natychmiastowy crash \`Out of Memory\`!
- **Strumień (\`fs.createReadStream\`)** wczytuje plik małymi paczkami po 64 KB i od razu wysyła je do klienta, zużywając zaledwie kilka megabajtów RAM-u!`,
      codeExamples: [
        {
          title: 'Strumieniowe kompresowanie pliku za pomocą pipeline',
          language: 'typescript',
          code: `import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

async function compressFile(inputPath: string, outputPath: string) {
  await pipeline(
    createReadStream(inputPath),
    createGzip(),
    createWriteStream(outputPath)
  );
  console.log('Plik skompresowany przy minimalnym zużyciu RAM!');
}`,
          explanation: 'Funkcja pipeline z node:stream/promises bezpiecznie łączy strumienie i automatycznie zamyka deskryptory plików w razie wystąpienia błędu.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Importuj moduły z prefiksem node:', description: 'Jawnie wskazuje to, że korzystasz z wbudowanego API środowiska Node.js.' },
        { step: 2, title: 'Używaj fs/promises z async/await', description: 'Unikaj starych callbacków i blokujących funkcji Sync.' },
        { step: 3, title: 'Stosuj Streams dla plików powyżej 10 MB', description: 'Chroń pamięć RAM procesu przed przepełnieniem.' },
      ],
      interactiveExercise: {
        id: 'ex-node-4',
        title: 'Monitor strumieniowego przetwarzania plików Node.js',
        instructions: 'Zbuduj kontener z klasą stream-monitor, wstaw znacznik <code>node:fs/promises + Streams</code> oraz informację o pamięci "RAM Usage: 12 MB (Chunked 64KB)".',
        task: 'Utwórz widżet stream-monitor prezentujący zalety strumieni w Node.js.',
        starterCode: {
          html: '<!-- Zbuduj widżet strumieni poniżej -->\n',
          css: '.stream-monitor { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Node Streams aktywne.");',
        },
        solutionCode: {
          html: '<div class="stream-monitor">\n  <code>node:fs/promises + Streams</code>\n  <div>RAM Usage: 12 MB (Chunked 64KB)</div>\n</div>',
          css: '.stream-monitor { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Node Streams aktywne.");',
        },
        hints: [
          'Użyj <div class="stream-monitor">.',
          'Wstaw <code>node:fs/promises + Streams</code>.',
          'Dodaj tekst RAM Usage: 12 MB (Chunked 64KB).',
        ],
        rules: [
          { id: 'r1', description: 'Klasa stream-monitor obecna', ruleType: 'html_contains', target: 'stream-monitor' },
          { id: 'r2', description: 'Moduł node:fs/promises obecny', ruleType: 'html_contains', target: 'node:fs/promises' },
          { id: 'r3', description: 'Informacja RAM Usage: 12 MB obecna', ruleType: 'html_contains', target: 'RAM Usage: 12 MB' },
        ],
      },
      independentTask: {
        title: 'Generator skrótów SHA-256 dla plików',
        instructions: 'Użyj modułu node:crypto i funkcji crypto.createHash("sha256").update(content).digest("hex"), aby wygenerować cyfrowy odcisk palca (checksum) dowolnego tekstu.',
        expectedOutcome: 'Deterministyczny, 64-znakowy skrót szesnastkowy wykorzystywany do weryfikacji integralności danych.',
        starterHint: 'import { createHash } from "node:crypto";',
      },
      quiz: [
        {
          id: 'q-node4-1',
          question: 'Dlaczego wywołanie `fs.readFileSync("duzy-plik.json")` wewnątrz endpointu Expressa jest poważnym błędem architektonicznym?',
          options: [
            'Ponieważ blokuje główny wątek Event Loop na czas odczytu z dysku, przez co serwer przestaje odpowiadać na zapytania wszystkich innych użytkowników',
            'Ponieważ funkcja ta nie obsługuje formatu JSON',
            'Ponieważ działa tylko w systemie Windows',
            'Ponieważ kasuje plik po jego odczytaniu',
          ],
          correctAnswer: 0,
          explanation: 'W kodzie obsługującym żądania HTTP należy zawsze korzystać z nieblokujących metod asynchronicznych (fs/promises lub strumieni).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Ręczne sklejanie ścieżek za pomocą szablonów tekstowych `${__dirname}/${userFileName}`',
          whyItHappens: 'Nieużywanie modułu node:path oraz brak walidacji nazwy pliku.',
          howToFix: 'Jeśli użytkownik przekaże `../../etc/passwd`, uzyska dostęp do plików systemowych (atak Path Traversal). Używaj `path.basename(userFileName)` oraz `path.join()`.',
          badCode: 'const target = `/uploads/${req.query.file}`;',
          goodCode: 'const safeName = path.basename(String(req.query.file)); const target = path.join(UPLOADS_DIR, safeName);',
        },
      ],
      practicalTask: {
        title: 'Eksport raportu CSV za pomocą strumienia HTTP',
        brief: 'Stwórz endpoint GET /api/export-csv, który ustawia nagłówek Content-Type: text/csv i strumieniowo wysyła wiersze danych bezpośrednio do obiektu odpowiedzi res (będącego Writable Streamem).',
        steps: ['Ustaw nagłówki Content-Type oraz Content-Disposition', 'Użyj res.write() dla kolejnych partii danych', 'Zakończ strumień wywołaniem res.end()'],
        deliverable: 'Wydajny endpoint eksportu danych odporny na duże wolumeny rekordów.',
      },
      completionCriteria: [
        'Zrozumienie modułów fs/promises, path, crypto i Streams',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'node-5',
      moduleId: 8,
      moduleTitle: 'Node.js i Express — Budowa Backendu i REST API',
      title: 'Projektowanie REST API: Paginacja, Filtrowanie, Sortowanie (req.query) oraz polityka CORS',
      slug: 'express-rest-api-paginacja-filtrowanie-cors',
      durationMinutes: 45,
      xpReward: 85,
      order: 5,
      summary: 'Jak projektować skalowalne endpointy kolekcji, które nie zawieszą przeglądarki przy 100 000 rekordów? Naucz się implementować paginację (page, limit, totalPages), filtrowanie przez req.query, kody statusów HTTP oraz konfigurację nagłówków CORS.',
      objectives: [
        'Rozróżniać zastosowanie parametrów ścieżki (req.params) od parametrów zapytania (req.query)',
        'Implementować bezpieczną paginację (limit/offset) z ustandaryzowaną kopertą metadanych (meta: { total, page, totalPages })',
        'Konfigurować mechanizm Cross-Origin Resource Sharing (CORS) dla komunikacji między domenami',
      ],
      prerequisites: ['Podstawy Express.js i walidacja Zod'],
      theoryMarkdown: `Gdy w bazie danych znajduje się 50 000 zamówień, endpoint \`GET /api/orders\` nie może zwrócić ich wszystkich naraz. Profesjonalne API zawsze udostępnia **paginację, filtrowanie i sortowanie** poprzez parametry zapytania (**Query Parameters**).

**1. \`req.params\` vs \`req.query\` — Kiedy czego używać?**
- **\`req.params\`** (\`/api/courses/:id\`): Służy do jednoznacznego wskazania **konkretnego zasobu** (np. \`/api/courses/react-101\`).
- **\`req.query\`** (\`/api/courses?category=frontend&page=2&limit=10\`): Służy do **filtrowania, sortowania, wyszukiwania i stronicowania** listy zasobów.

**2. Wzorcowa implementacja paginacji z walidacją Zod:**
Wszystkie wartości w \`req.query\` przychodzą jako teksty (\`string\`). Używamy \`z.coerce.number()\`, aby bezpiecznie zamienić je na liczby i narzucić maksymalny limit (np. max 100 rekordów na stronę):
\`\`\`typescript
const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.enum(['createdAt', 'xpReward', 'title']).default('createdAt'),
});

app.get('/api/lessons', async (req, res) => {
  const { page, limit, search, sortBy } = PaginationSchema.parse(req.query);
  const offset = (page - 1) * limit;

  // Zwracamy dane wraz z metadanymi paginacji dla frontendu:
  res.status(200).json({
    data: paginatedItems,
    meta: {
      page,
      limit,
      totalItems: 120,
      totalPages: Math.ceil(120 / limit),
    },
  });
});
\`\`\`

**3. Zrozumieć CORS (Cross-Origin Resource Sharing):**
Gdy Twój frontend działa na \`https://app.twojadomena.pl\`, a backend na \`https://api.twojadomena.pl\`, przeglądarka domyślnie zablokuje zapytania \`fetch\` ze względów bezpieczeństwa (Same-Origin Policy), jeśli serwer nie odeśle nagłówka \`Access-Control-Allow-Origin\`.`,
      codeExamples: [
        {
          title: 'Bezpieczna konfiguracja pakietu cors na produkcji',
          language: 'typescript',
          code: `import cors from 'cors';

const ALLOWED_ORIGINS = [
  'https://twoja-aplikacja.pl',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Pozwól na zapytania z dozwolonych domen lub z narzędzi serwerowych (brak origin)
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Zablokowano przez politykę CORS'));
      }
    },
    credentials: true, // Pozwala przesyłać ciasteczka HttpOnly!
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);`,
          explanation: 'Gdy używasz ciasteczek autoryzacyjnych (credentials: true), przeglądarka zabrania ustawienia gwiazdki origin: "*". Musisz jawnie podać dozwoloną domenę frontendu.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Waliduj i ograniczaj parametr limit', description: 'Nigdy nie pozwól klientowi przekazać ?limit=99999999.' },
        { step: 2, title: 'Zwracaj spójną strukturę odpowiedzi', description: 'Stosuj kopertę { data: [...], meta: { page, totalPages } }.' },
        { step: 3, title: 'Skonfiguruj białą listę domen w CORS', description: 'Odczytuj dozwolone domeny ze zmiennej środowiskowej CORS_ORIGIN.' },
      ],
      interactiveExercise: {
        id: 'ex-node-5',
        title: 'Wizualizacja odpowiedzi paginowanego REST API',
        instructions: 'Zbuduj kontener z klasą api-pagination, umieść w nim zapytanie <code>GET /api/lessons?page=2&amp;limit=10</code> oraz metadane "Meta: Page 2 of 6 (Total: 58)".',
        task: 'Utwórz widżet api-pagination prezentujący stronicowanie w REST API.',
        starterCode: {
          html: '<!-- Zbuduj widżet paginacji API poniżej -->\n',
          css: '.api-pagination { background: #0f172a; border: 1px solid #38bdf8; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #38bdf8; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Paginacja REST API aktywna.");',
        },
        solutionCode: {
          html: '<div class="api-pagination">\n  <code>GET /api/lessons?page=2&amp;limit=10</code>\n  <div>Meta: Page 2 of 6 (Total: 58)</div>\n</div>',
          css: '.api-pagination { background: #0f172a; border: 1px solid #38bdf8; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #38bdf8; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Paginacja REST API aktywna.");',
        },
        hints: [
          'Użyj <div class="api-pagination">.',
          'Wstaw <code>GET /api/lessons?page=2&amp;limit=10</code>.',
          'Dodaj tekst Meta: Page 2 of 6 (Total: 58).',
        ],
        rules: [
          { id: 'r1', description: 'Klasa api-pagination obecna', ruleType: 'html_contains', target: 'api-pagination' },
          { id: 'r2', description: 'Zapytanie GET /api/lessons obecne', ruleType: 'html_contains', target: 'GET /api/lessons' },
          { id: 'r3', description: 'Metadane Page 2 of 6 obecne', ruleType: 'html_contains', target: 'Page 2 of 6' },
        ],
      },
      independentTask: {
        title: 'Kalkulator offsetu i metadanych paginacji',
        instructions: 'Napisz czystą funkcję getPaginationMeta(totalItems: number, page: number, limit: number), zwracającą obiekt { offset, totalPages, hasNextPage, hasPrevPage }.',
        expectedOutcome: 'Uniwersalny helper gotowy do użycia w każdym kontrolerze kolekcji.',
        starterHint: 'const totalPages = Math.max(1, Math.ceil(totalItems / limit));',
      },
      quiz: [
        {
          id: 'q-node5-1',
          question: 'Czym jest zapytanie `OPTIONS` (tzw. Preflight Request) wysyłane automatycznie przez przeglądarkę przed wykonaniem żądania `POST` lub `DELETE` do innej domeny?',
          options: [
            'To automatyczne zapytanie kontrolne mechanizmu CORS, w którym przeglądarka pyta serwer, czy akceptuje on daną metodę HTTP i nagłówki z bieżącej domeny',
            'To błąd przeglądarki oznaczający zerwane połączenie Wi-Fi',
            'To zapytanie pobierające ikony czcionek',
            'To atak hakerski typu DDoS',
          ],
          correctAnswer: 0,
          explanation: 'Serwer (np. przez middleware cors w Expressie) odpowiada na żądanie OPTIONS statusem 204 i nagłówkami Access-Control-Allow-*, po czym przeglądarka wysyła właściwe żądanie.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Brak konwersji typów z `req.query.limit` i przekazywanie stringa `"10"` bezpośrednio do kalkulacji matematycznych',
          whyItHappens: 'Zapomnienie, że wszystkie parametry w URL są tekstami.',
          howToFix: 'Dodawanie `page + 1` na stringu `"2"` da `"21"` zamiast `3`! Zawsze parsuj parametry zapytania przez `Number()` lub `z.coerce.number()`.',
          badCode: 'const next = req.query.page + 1; // "21" zamiast 3!',
          goodCode: 'const page = Math.max(1, Number(req.query.page) || 1);',
        },
      ],
      practicalTask: {
        title: 'Endpoint wyszukiwarki kursów z wieloma filtrami',
        brief: 'Zbuduj endpoint GET /api/courses obsługujący jednoczesne filtrowanie po kategorii (?category=Frontend), minimalnej liczbie punktów XP (?minXp=500) oraz sortowanie.',
        steps: ['Zdefiniuj schemat Zod dla req.query', 'Przefiltruj kolekcję na podstawie zwalidowanych parametrów', 'Zwróć wynik wraz z liczbą znalezionych elementów'],
        deliverable: 'Elastyczny endpoint wyszukiwania zgodny ze standardem REST.',
      },
      completionCriteria: [
        'Zrozumienie paginacji, req.query oraz polityki CORS',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'node-6',
      moduleId: 8,
      moduleTitle: 'Node.js i Express — Budowa Backendu i REST API',
      title: 'Produkcyjny Backend: Logowanie strukturalne, Healthcheck, Zmienne ENV i Graceful Shutdown',
      slug: 'nodejs-produkcja-logowanie-healthcheck-graceful-shutdown',
      durationMinutes: 40,
      xpReward: 85,
      order: 6,
      summary: 'Co odróżnia projekt hobbystyczny od serwera klasy Enterprise? Poznaj walidację zmiennych środowiskowych przy starcie aplikacji, logowanie strukturalne JSON (Pino), endpointy diagnostyczne /health oraz bezpieczne zamykanie serwera (Graceful Shutdown).',
      objectives: [
        'Walidować obecność wszystkich wymaganych zmiennych process.env w momencie uruchamiania serwera (Fail-Fast)',
        'Zastępować zwykły console.log szybkim loggerem strukturalnym JSON z identyfikatorem żądania (Request ID)',
        'Obsługiwać sygnały systemowe SIGTERM i SIGINT w celu bezpiecznego dokończenia trwających żądań przed wyłączeniem',
      ],
      prerequisites: ['Architektura warstwowa Express.js'],
      theoryMarkdown: `Kiedy Twój serwer trafia na produkcję (w kontenerze Docker lub na VPS), nie patrzysz już na niego w oknie terminala na swoim laptopie. Serwer musi sam dbać o swoją stabilność, diagnostykę i bezpieczne restarty.

**1. Walidacja zmiennych środowiskowych na starcie (Fail-Fast):**
Nigdy nie dopuść do sytuacji, w której serwer uruchamia się poprawnie, a dopiero po 3 godzinach — gdy pierwszy klient kliknie "Zapłać" — aplikacja wybucha, bo ktoś zapomniał ustawić \`STRIPE_SECRET_KEY\` w pliku \`.env\`!
\`\`\`typescript
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url('Brak poprawnego DATABASE_URL!'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET musi mieć min. 32 znaki!'),
});

// Jeśli czegokolwiek brakuje, proces zatrzyma się w 1. milisekundzie z czytelnym komunikatem:
export const env = EnvSchema.parse(process.env);
\`\`\`

**2. Endpoint diagnostyczny (\`GET /api/health\`):**
Systemy chmurowe (Docker, Kubernetes, AWS, Render) co kilkanaście sekund odpytują Twój serwer, aby sprawdzić, czy proces żyje i ma połączenie z bazą danych:
\`\`\`typescript
app.get('/api/health', async (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});
\`\`\`

**3. Bezpieczne zamykanie procesu (Graceful Shutdown):**
Gdy wdrażasz nową wersję aplikacji, system operacyjny wysyła do starego procesu sygnał **\`SIGTERM\`**. Zamiast brutalnie zrywać trwające połączenia klientów w połowie zapisu do bazy:
1. Przestajemy przyjmować nowe połączenia (\`server.close()\`).
2. Czekamy na dokończenie trwających zapytań HTTP.
3. Zamykamy pulę połączeń z bazą danych (\`await prisma.$disconnect()\`).`,
      codeExamples: [
        {
          title: 'Wzorcowa implementacja Graceful Shutdown w Node.js',
          language: 'typescript',
          code: `const server = app.listen(3000, () => {
  console.log('Serwer nasłuchuje na porcie 3000');
});

async function gracefulShutdown(signal: string) {
  console.log(\`Otrzymano sygnał \${signal}. Rozpoczynam bezpieczne zamykanie...\`);

  server.close(async () => {
    console.log('Wszystkie trwające żądania HTTP zostały zakończone.');
    // Tutaj zamykamy połączenie z bazą danych, np. await db.close();
    process.exit(0);
  });

  // Bezpiecznik: jeśli po 10 sekundach coś wisi, wymuś zamknięcie
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));`,
          explanation: 'Dzięki obsłudze SIGTERM wdrożenia nowych wersji aplikacji odbywają się bez ani jednego błędu 502 Bad Gateway u użytkowników końcowych.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Stwórz plik src/config/env.ts', description: 'Przepuść process.env przez schemat Zod na samym początku startu aplikacji.' },
        { step: 2, title: 'Wystaw endpoint /api/health', description: 'Zwracaj status 200 OK oraz czas działania process.uptime().' },
        { step: 3, title: 'Zarejestruj obsługę SIGTERM i SIGINT', description: 'Zawsze zamykaj serwer HTTP i połączenia bazodanowe przed process.exit(0).' },
      ],
      interactiveExercise: {
        id: 'ex-node-6',
        title: 'Panel diagnostyczny Healthcheck & Graceful Shutdown',
        instructions: 'Zbuduj kontener z klasą health-panel, wstaw znacznik <code>GET /api/health -> 200 OK</code> oraz status "Graceful Shutdown (SIGTERM): Ready".',
        task: 'Utwórz widżet health-panel prezentujący gotowość produkcyjną serwera Node.js.',
        starterCode: {
          html: '<!-- Zbuduj panel diagnostyczny poniżej -->\n',
          css: '.health-panel { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Healthcheck panel aktywny.");',
        },
        solutionCode: {
          html: '<div class="health-panel">\n  <code>GET /api/health -&gt; 200 OK</code>\n  <div>Graceful Shutdown (SIGTERM): Ready</div>\n</div>',
          css: '.health-panel { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Healthcheck panel aktywny.");',
        },
        hints: [
          'Użyj <div class="health-panel">.',
          'Wstaw <code>GET /api/health -&gt; 200 OK</code>.',
          'Dodaj tekst Graceful Shutdown (SIGTERM): Ready.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa health-panel obecna', ruleType: 'html_contains', target: 'health-panel' },
          { id: 'r2', description: 'Endpoint /api/health obecny', ruleType: 'html_contains', target: '/api/health' },
          { id: 'r3', description: 'Informacja Graceful Shutdown (SIGTERM): Ready obecna', ruleType: 'html_contains', target: 'Graceful Shutdown (SIGTERM): Ready' },
        ],
      },
      independentTask: {
        title: 'Middleware nadający unikalne Request ID',
        instructions: 'Napisz middleware Expressa, który dla każdego przychodzącego żądania generuje identyfikator za pomocą crypto.randomUUID(), dopisuje go do nagłówka odpowiedzi res.setHeader("X-Request-Id", id) i mierzy czas wykonania w milisekundach.',
        expectedOutcome: 'Pełna identyfikowalność każdego żądania w logach serwera.',
        starterHint: 'const start = performance.now(); res.on("finish", () => { ... });',
      },
      quiz: [
        {
          id: 'q-node6-1',
          question: 'Jaki jest cel implementacji mechanizmu Graceful Shutdown po otrzymaniu sygnału `SIGTERM`?',
          options: [
            'Pozwala serwerowi przestać przyjmować nowy ruch, bezpiecznie dokończyć aktualnie przetwarzane zapytania klientów i czysto zamknąć połączenia z bazą danych przed wyłączeniem procesu',
            'Zwiększa taktowanie procesora o 50%',
            'Automatycznie kasuje wszystkie tabele w bazie danych',
            'Wyłącza szyfrowanie HTTPS',
          ],
          correctAnswer: 0,
          explanation: 'Graceful Shutdown zapobiega uszkodzeniu danych i błędom połączenia podczas restartów oraz wdrożeń CI/CD.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Logowanie wrażliwych danych (haseł, tokenów JWT, numerów kart) w plikach logów serwera',
          whyItHappens: 'Wypisywanie całego obiektu `console.log(req.body)` w middleware logującym.',
          howToFix: 'Zawsze stosuj maskowanie (redaction) pól wrażliwych przed zapisaniem logu, np. zamieniając `password` i `authorization` na `"[REDACTED]"`.',
          badCode: 'logger.info({ body: req.body }, "Otrzymano żądanie"); // Wyciek hasła do logów!',
          goodCode: 'logger.info({ email: req.body.email }, "Próba logowania");',
        },
      ],
      practicalTask: {
        title: 'Sprawdzenie endpointu /api/health w aplikacji',
        brief: 'Zbadaj plik server.ts w naszym projekcie i zobacz, jak zaimplementowany jest endpoint diagnostyczny /api/health.',
        steps: ['Otwórz plik server.ts', 'Znajdź trasę app.get("/api/health", ...)', 'Przetestuj odpowiedź JSON w przeglądarce'],
        deliverable: 'Zrozumienie monitoringu kondycji serwera Node.js.',
      },
      completionCriteria: [
        'Zrozumienie walidacji ENV, logowania, /health i Graceful Shutdown',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
  ],
};

