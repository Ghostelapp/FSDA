import { Module } from '../../types';

export const MODULE_9: Module = {
  id: 9,
  title: 'Bazy Danych — SQL, PostgreSQL i Prisma ORM',
  category: 'Bazy danych',
  description: 'Projektowanie relacyjnych baz danych: tabele, klucze obce, indeksy, relacje 1:1, 1:N, N:M, zapytania SQL, transakcje ACID, migracje i Prisma ORM.',
  badgeName: 'Architekt Danych PostgreSQL',
  badgeIcon: 'Database',
  durationHours: 30,
  totalXp: 850,
  prerequisites: ['Moduł 8: Backend z Node.js'],
  topics: [
    'Relacyjne bazy danych vs NoSQL: kiedy wybierać PostgreSQL',
    'Język SQL: SELECT, INSERT, UPDATE, DELETE, klauzule WHERE, ORDER BY, GROUP BY',
    'Złączenia relacyjne (JOINs): INNER JOIN, LEFT JOIN, FULL JOIN',
    'Integralność danych, transakcje ACID i blokady współbieżności',
    'Nowoczesny ORM Prisma: definiowanie schematu schema.prisma, generowanie klienta i migracje',
    'Optymalizacja zapytań, indeksowanie kolumn i unikanie problemu N+1 queries',
  ],
  projectBrief: 'Projekt modułu: Model relacyjnej bazy danych sklepu e-commerce z migracjami Prisma i zaawansowanymi zapytaniami.',
  lessons: [
    {
      id: 'db-1',
      moduleId: 9,
      moduleTitle: 'Bazy Danych — SQL, PostgreSQL i Prisma ORM',
      title: 'Podstawy relacyjnych baz danych, zapytania SQL i relacje 1:N',
      slug: 'sql-postgresql-relacje-zapytania',
      durationMinutes: 40,
      xpReward: 80,
      order: 1,
      summary: 'Trwałe przechowywanie danych: tabele, klucze główne (Primary Key), klucze obce (Foreign Key), zapytania SQL (SELECT, INSERT) oraz łączenie tabel klauzulą JOIN.',
      objectives: [
        'Zrozumieć zasady relacyjnego modelu danych (PostgreSQL)',
        'Pisać zapytania SELECT z filtrowaniem WHERE, sortowaniem ORDER BY i limitem LIMIT',
        'Łączyć dane z powiązanych tabel za pomocą klauzuli INNER JOIN',
      ],
      prerequisites: ['Moduł 8: Backend'],
      theoryMarkdown: `Dane w relacyjnej bazie (RDBMS), takiej jak **PostgreSQL**, przechowywane są w tabelach składających się z wierszy (rekordów) i kolumn o ściśle określonych typach.

**Klucze relacji:**
- **Primary Key (Klucz główny):** Unikalny identyfikator wiersza (np. \`id UUID DEFAULT gen_random_uuid()\`).
- **Foreign Key (Klucz obcy):** Wskazuje na klucz główny w innej tabeli, tworząc relację (np. \`user_id\` w tabeli \`orders\`).

**Podstawowe zapytania SQL:**
\`\`\`sql
-- Pobierz wszystkich aktywnych kursantów posortowanych po punktach XP:
SELECT id, name, xp 
FROM users 
WHERE is_active = true 
ORDER BY xp DESC 
LIMIT 10;
\`\`\`

**Złączenie relacyjne (INNER JOIN):**
\`\`\`sql
SELECT users.name, orders.total_amount, orders.created_at
FROM orders
INNER JOIN users ON orders.user_id = users.id
WHERE orders.status = 'PAID';
\`\`\``,
      codeExamples: [
        {
          title: 'Definicja tabeli użytkowników i zamówień w PostgreSQL',
          language: 'sql',
          code: `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING'
);`,
          explanation: 'ON DELETE CASCADE usuwa zamówienia powiązane z usuwanym użytkownikiem, dbając o integralność referencyjną.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zdefiniuj tabelę z kluczem głównym PRIMARY KEY', description: 'Użyj unikalnego ID.' },
        { step: 2, title: 'Użyj klucza obcego REFERENCES', description: 'Połącz tabelę podrzędną z nadrzędną.' },
        { step: 3, title: 'Napisz zapytanie z JOIN', description: 'Złącz powiązane tabele po kluczach.' },
      ],
      interactiveExercise: {
        id: 'ex-db-1',
        title: 'Komponent wizualizacji relacji bazy danych',
        instructions: 'Zaprojektuj wizualny widżet schematu bazy danych: stwórz kontener z klasą db-schema, tag <code> z zapytaniem "SELECT * FROM users JOIN orders" oraz status relacji "1 : N (Jeden do Wielu)".',
        task: 'Utwórz element db-schema z zapytaniem SQL i statusem relacji 1 : N.',
        starterCode: {
          html: '<!-- Zbuduj widżet schematu bazy poniżej -->\n',
          css: '.db-schema { background: #0f172a; border: 1px solid #334155; padding: 12px 18px; border-radius: 8px; display: inline-flex; align-items: center; gap: 10px; font-family: monospace; font-size: 0.85rem; color: #cbd5e1; }\ncode { color: #38bdf8; font-weight: bold; }\n.rel { color: #f59e0b; font-weight: bold; }',
          js: 'console.log("Database schema visualizer gotowy.");',
        },
        solutionCode: {
          html: '<div class="db-schema">\n  <code>SELECT * FROM users JOIN orders</code>\n  <span class="rel">1 : N (Jeden do Wielu)</span>\n</div>',
          css: '.db-schema { background: #0f172a; border: 1px solid #334155; padding: 12px 18px; border-radius: 8px; display: inline-flex; align-items: center; gap: 10px; font-family: monospace; font-size: 0.85rem; color: #cbd5e1; }\ncode { color: #38bdf8; font-weight: bold; }\n.rel { color: #f59e0b; font-weight: bold; }',
          js: 'console.log("Database schema visualizer gotowy.");',
        },
        hints: [
          'Użyj <div class="db-schema">.',
          'Wstaw <code>SELECT * FROM users JOIN orders</code>.',
          'Wstaw <span class="rel">1 : N (Jeden do Wielu)</span>.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa db-schema obecna', ruleType: 'html_contains', target: 'db-schema' },
          { id: 'r2', description: 'Zapytanie SELECT * FROM users obecne', ruleType: 'html_contains', target: 'SELECT * FROM users' },
          { id: 'r3', description: 'Relacja 1 : N obecna', ruleType: 'html_contains', target: '1 : N' },
        ],
      },
      independentTask: {
        title: 'Klauzula grupowania GROUP BY',
        instructions: 'Napisz zapytanie liczące ilu kursantów jest w każdym module: SELECT module_id, COUNT(*) FROM enrollments GROUP BY module_id;.',
        expectedOutcome: 'Umiejętność tworzenia zapytań analitycznych i raportów.',
        starterHint: 'GROUP BY łączy wiersze o tej samej wartości kolumny w jedną grupę.',
      },
      quiz: [
        {
          id: 'q-db1-1',
          question: 'Do czego służy klauzula JOIN w języku SQL?',
          options: [
            'Łączy wiersze z dwóch lub więcej tabel na podstawie powiązanej między nimi kolumny (np. klucza obcego)',
            'Kasuje duplikaty w tabeli',
            'Szyfruje hasła algorytmem SHA256',
            'Tworzy kopię zapasową bazy na dysku',
          ],
          correctAnswer: 0,
          explanation: 'JOIN pozwala złożyć spójny rekord z kilku powiązanych relacyjnie tabel.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Brak indeksu (INDEX) na kolumnach często używanych w klauzuli WHERE i JOIN',
          whyItHappens: 'Brak wiedzy o planie wykonania zapytania (EXPLAIN ANALYZE).',
          howToFix: 'Gdy tabela urosnąć do 100 000 wierszy, brak indeksu spowoduje kosztowny Full Table Scan i drastyczne spowolnienie bazy. Zawsze twórz indeksy na kluczach obcych i kolumnach wyszukiwania.',
          badCode: '// Brak indeksu na user_id w tabeli orders',
          goodCode: 'CREATE INDEX idx_orders_user_id ON orders(user_id);',
        },
      ],
      practicalTask: {
        title: 'Model bazy w schemacie Prisma',
        brief: 'Przeanalizuj plik schema.prisma definiujący relację 1:N między modelem User a Post.',
        steps: ['Zdefiniuj model User', 'Zdefiniuj model Post z kluczem userId', 'Dodaj relację @relation'],
        deliverable: 'Praktyczne zrozumienie nowoczesnych ORM.',
      },
      completionCriteria: [
        'Zrozumienie zapytań SQL i relacji 1:N',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'db-2',
      moduleId: 9,
      moduleTitle: 'Bazy Danych — SQL, PostgreSQL i Prisma ORM',
      title: 'Prisma ORM: Modelowanie schematu, migracje bazy i Type-Safe Prisma Client',
      slug: 'prisma-orm-postgresql-migracje-klient',
      durationMinutes: 45,
      xpReward: 95,
      order: 2,
      summary: 'Koniec z ręcznym pisaniem podatnych na literówki stringów SQL! Poznaj Prisma ORM — standard w świecie TypeScript. Dowiedz się, jak definiować tabele i relacje w schema.prisma, generować migracje i pobierać dane ze 100% autouzupełnianiem typów.',
      objectives: [
        'Modelować tabele, typy enum, indeksy i relacje w pliku schema.prisma',
        'Tworzyć wersjonowane migracje bazy poleceniem prisma migrate dev',
        'Wykonywać operacje CRUD i złączenia relacji (include / select) za pomocą wygenerowanego klienta Prisma',
      ],
      prerequisites: ['Moduł 9: Lekcja 1 (Podstawy SQL)'],
      theoryMarkdown: `**Prisma** to nowoczesny Object-Relational Mapper (ORM) dla Node.js i TypeScript. Składa się z trzech filarów:
1. **Prisma Schema:** Pojedynczy, deklaratywny plik \`schema.prisma\`, w którym opisujesz strukturę bazy i relacje.
2. **Prisma Migrate:** Narzędzie do automatycznego generowania i uruchamiania skryptów migracji SQL.
3. **Prisma Client:** W pełni typowany generator zapytań TypeScript z inteligentnym autouzupełnianiem kodu w IDE.

**Deklaracja modelu w schema.prisma:**
\`\`\`prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  xp        Int      @default(0)
  role      String   @default("student")
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
\`\`\`

**Pobieranie powiązanych danych bez pisania JOIN:**
\`\`\`typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Pobierz użytkownika wraz z jego postami:
const userWithPosts = await prisma.user.findUnique({
  where: { email: 'kursant@academy.dev' },
  include: {
    posts: {
      orderBy: { createdAt: 'desc' },
      take: 5,
    },
  },
});
\`\`\``,
      codeExamples: [
        {
          title: 'Transakcje w Prisma: Wszystko albo nic (ACID)',
          language: 'typescript',
          code: `// Bezpieczne przeniesienie punktów XP w transakcji:
await prisma.$transaction(async (tx) => {
  const sender = await tx.user.update({
    where: { id: senderId },
    data: { xp: { decrement: 100 } },
  });

  if (sender.xp < 0) {
    throw new Error('Niewystarczająca liczba XP do wykonania transferu!');
  }

  await tx.user.update({
    where: { id: recipientId },
    data: { xp: { increment: 100 } },
  });
});`,
          explanation: 'Jeśli w trakcie transakcji wystąpi błąd, Prisma automatycznie wycofa wszystkie zmiany (Rollback).',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zainstaluj Prisma', description: 'npm install @prisma/client oraz npm install -D prisma.' },
        { step: 2, title: 'Zainicjalizuj konfigurację', description: 'npx prisma init utworzy katalog prisma i plik .env.' },
        { step: 3, title: 'Wykonaj migrację', description: 'npx prisma migrate dev --name init_db zaaplikuje zmiany w PostgreSQL.' },
      ],
      interactiveExercise: {
        id: 'ex-db-2',
        title: 'Komponent wizualizacji schematu relacji Prisma',
        instructions: 'Zaprojektuj wizualny widżet schematu bazy danych: utwórz kontener z klasą db-schema, model User "model User { id, email, xp }", oraz relację "User 1 -> N Posts".',
        task: 'Utwórz element db-schema z modelem User i relacją User 1 -> N Posts.',
        starterCode: {
          html: '<!-- Zbuduj widok schematu bazy danych poniżej -->\n',
          css: '.db-schema { background: #0b1329; border: 1px solid #1e3a8a; padding: 18px; border-radius: 12px; font-family: monospace; color: #93c5fd; font-size: 0.85rem; }\n.model { background: #172554; padding: 10px; border-radius: 6px; margin-bottom: 8px; }\n.relation { color: #60a5fa; font-weight: bold; }',
          js: 'console.log("Prisma Schema Inspector gotowy.");',
        },
        solutionCode: {
          html: '<div class="db-schema">\n  <div class="model">model User { id, email, xp }</div>\n  <div class="relation">User 1 -> N Posts</div>\n</div>',
          css: '.db-schema { background: #0b1329; border: 1px solid #1e3a8a; padding: 18px; border-radius: 12px; font-family: monospace; color: #93c5fd; font-size: 0.85rem; }\n.model { background: #172554; padding: 10px; border-radius: 6px; margin-bottom: 8px; }\n.relation { color: #60a5fa; font-weight: bold; }',
          js: 'console.log("Prisma Schema Inspector gotowy.");',
        },
        hints: [
          'Użyj kontenera <div class="db-schema">.',
          'Wstaw <div class="model">model User { id, email, xp }</div>.',
          'Wstaw <div class="relation">User 1 -> N Posts</div>.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa db-schema obecna', ruleType: 'html_contains', target: 'db-schema' },
          { id: 'r2', description: 'Model User obecny', ruleType: 'html_contains', target: 'model User { id, email, xp }' },
          { id: 'r3', description: 'Relacja User 1 -> N Posts obecna', ruleType: 'html_contains', target: 'User 1 -> N Posts' },
        ],
      },
      independentTask: {
        title: 'Model sklepu w Prisma',
        instructions: 'Zaprojektuj model Order ze statusem enum (PENDING, PAID, CANCELLED) oraz relacją do modelu OrderItem.',
        expectedOutcome: 'Pełne zrozumienie typów wyliczeniowych enum i relacji kaskadowych w Prisma.',
        starterHint: 'enum OrderStatus { PENDING PAID CANCELLED }',
      },
      quiz: [
        {
          id: 'q-db2-1',
          question: 'Co dzieje się po uruchomieniu polecenia `npx prisma migrate dev`?',
          options: [
            'Prisma porównuje plik schema.prisma ze stanem bazy, generuje plik migracji w czystym SQL, wykonuje go na bazie i automatycznie regeneruje klienta TypeScript (Prisma Client)',
            'Usuwa wszystkie dane bez pytania o zgodę',
            'Konwertuje bazę PostgreSQL na plik Excel (.xlsx)',
            'Uruchamia przeglądarkę Chrome w trybie incognito',
          ],
          correctAnswer: 0,
          explanation: 'Polecenie migrate dev dba o spójność schematu, tworzy czytelną historię zmian SQL i odświeża typy w IDE.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Tworzenie nowej instancji new PrismaClient() wewnątrz każdej funkcji zapytania',
          whyItHappens: 'Niewiedza o puli połączeń bazy danych (Connection Pool).',
          howToFix: 'Prisma Client zarządza własną pulą połączeń. Zawsze eksportuj pojedynczą instancję (Singleton) z dedykowanego pliku db.ts.',
          badCode: 'async function getUsers() { const prisma = new PrismaClient(); ... }',
          goodCode: 'import { prisma } from "../lib/db"; // Singleton',
        },
      ],
      practicalTask: {
        title: 'Zapytanie wielorelacyjne w Prisma Client',
        instructions: 'Napisz zapytanie findMany z klauzulą where filtrowania aktywnych kursantów oraz dołączeniem include ukończonych lekcji.',
        brief: 'Przećwicz autouzupełnianie i silne typowanie w Prisma.',
        steps: ['Zaimportuj singleton prisma', 'Zdefiniuj warunek where', 'Dodaj include dla powiązanej tabeli'],
        deliverable: 'Praktyczne opanowanie Prisma Client.',
      },
      completionCriteria: [
        'Zrozumienie modelowania danych w schema.prisma',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'db-3',
      moduleId: 9,
      moduleTitle: 'Bazy Danych — SQL, PostgreSQL i Prisma ORM',
      title: 'Modyfikacja danych (INSERT, UPDATE, DELETE) oraz więzy integralności (Constraints)',
      slug: 'sql-insert-update-delete-constraints-returning',
      durationMinutes: 45,
      xpReward: 85,
      order: 3,
      summary: 'Jak bezpiecznie zapisywać, aktualizować i usuwać rekordy w PostgreSQL? Poznaj klauzulę RETURNING, więzy integralności (NOT NULL, UNIQUE, CHECK, DEFAULT), kaskadowe usuwanie (ON DELETE CASCADE) oraz śmiertelne niebezpieczeństwo UPDATE bez WHERE.',
      objectives: [
        'Wstawiać i modyfikować dane za pomocą INSERT INTO, UPDATE oraz DELETE z klauzulą RETURNING *',
        'Projektować kuloodporne tabele wykorzystujące ograniczenia NOT NULL, UNIQUE, DEFAULT oraz CHECK',
        'Rozróżniać twarde usuwanie rekordów (Hard Delete) od miękkiego usuwania (Soft Delete z kolumną deleted_at)',
      ],
      prerequisites: ['Podstawy relacyjnych baz danych i SELECT'],
      theoryMarkdown: `Baza danych to ostatnia linia obrony integralności Twojej aplikacji. Nawet jeśli w kodzie JavaScript pojawi się błąd, dobrze skonfigurowane **więzy integralności (Constraints)** w PostgreSQL nigdy nie pozwolą zapisać ujemnej ceny produktu ani dwóch kont z tym samym adresem e-mail!

**1. Więzy integralności (Constraints) przy tworzeniu tabeli:**
\`\`\`sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(32) NOT NULL UNIQUE,
  title TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  stock_count INTEGER NOT NULL DEFAULT 0 CHECK (stock_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
\`\`\`

**2. \`INSERT\`, \`UPDATE\`, \`DELETE\` oraz potęga \`RETURNING\` w PostgreSQL:**
W starszych bazach danych po wstawieniu rekordu trzeba było wykonać drugie zapytanie \`SELECT\`, aby poznać wygenerowane \`id\`. W PostgreSQL dopisujemy na końcu **\`RETURNING *\`**:
\`\`\`sql
-- Wstawienie rekordu z natychmiastowym zwrotem wygenerowanego UUID:
INSERT INTO products (sku, title, price_cents)
VALUES ('TS-BOOK-01', 'Architektura TypeScript', 9900)
RETURNING id, created_at;

-- Aktualizacja ceny TYLKO dla wybranego produktu:
UPDATE products
SET price_cents = 7900
WHERE sku = 'TS-BOOK-01'
RETURNING *;
\`\`\`

**3. Hard Delete vs Soft Delete:**
W systemach finansowych i e-commerce rzadko używa się fizycznego \`DELETE FROM orders\`, ponieważ historia faktur musi pozostać nienaruszona. Zamiast tego stosuje się wzorzec **Soft Delete**: dodajemy kolumnę \`deleted_at TIMESTAMPTZ NULL\` i przy "usunięciu" wpisujemy tam aktualną datę.`,
      codeExamples: [
        {
          title: 'UPSERT w PostgreSQL: Wstaw lub zaktualizuj przy konflikcie (ON CONFLICT)',
          language: 'sql',
          code: `INSERT INTO daily_progress (user_id, date, xp_earned)
VALUES ('user-123', CURRENT_DATE, 50)
ON CONFLICT (user_id, date)
DO UPDATE SET xp_earned = daily_progress.xp_earned + EXCLUDED.xp_earned
RETURNING *;`,
          explanation: 'Klauzula ON CONFLICT ... DO UPDATE (tzw. Upsert) wykonuje atomową operację: jeśli rekord na dany dzień jeszcze nie istnieje, tworzy go, a jeśli istnieje — dopisuje punkty XP.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zawsze pisz klauzulę WHERE przed wpisaniem UPDATE/DELETE', description: 'Sprawdź warunek zapytaniem SELECT, zanim uruchomisz modyfikację.' },
        { step: 2, title: 'Stosuj CHECK constraints dla reguł domenowych', description: 'Wymuś na poziomie bazy, by np. rating mieścił się w przedziale CHECK (rating BETWEEN 1 AND 5).' },
        { step: 3, title: 'Przechowuj kwoty pieniężne jako liczby całkowite (grosze/centy)', description: 'Unikniesz błędów zaokrągleń typów zmiennoprzecinkowych FLOAT.' },
      ],
      interactiveExercise: {
        id: 'ex-db-3',
        title: 'Wizualizacja zapytania UPDATE z klauzulą RETURNING',
        instructions: 'Zbuduj kontener z klasą sql-mutation, wstaw kod <code>UPDATE users SET xp = xp + 100 WHERE id = 1 RETURNING *;</code> oraz status "Constraint Check: PASSED".',
        task: 'Utwórz widżet sql-mutation prezentujący bezpieczną aktualizację rekordu w PostgreSQL.',
        starterCode: {
          html: '<!-- Zbuduj widżet mutacji SQL poniżej -->\n',
          css: '.sql-mutation { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
          js: 'console.log("SQL Mutation zweryfikowana.");',
        },
        solutionCode: {
          html: '<div class="sql-mutation">\n  <code>UPDATE users SET xp = xp + 100 WHERE id = 1 RETURNING *;</code>\n  <div>Constraint Check: PASSED</div>\n</div>',
          css: '.sql-mutation { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
          js: 'console.log("SQL Mutation zweryfikowana.");',
        },
        hints: [
          'Użyj <div class="sql-mutation">.',
          'Wstaw <code>UPDATE users SET xp = xp + 100 WHERE id = 1 RETURNING *;</code>.',
          'Dodaj tekst Constraint Check: PASSED.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa sql-mutation obecna', ruleType: 'html_contains', target: 'sql-mutation' },
          { id: 'r2', description: 'Instrukcja UPDATE users SET xp obecna', ruleType: 'html_contains', target: 'UPDATE users SET xp' },
          { id: 'r3', description: 'Status Constraint Check: PASSED obecny', ruleType: 'html_contains', target: 'Constraint Check: PASSED' },
        ],
      },
      independentTask: {
        title: 'Projekt tabeli kuponów rabatowych z ograniczeniami CHECK',
        instructions: 'Napisz instrukcję CREATE TABLE coupons z kolumnami code (unikalny tekst), discount_percent (liczba całkowita od 1 do 90 wymuszona przez CHECK) oraz is_active (domyślnie true).',
        expectedOutcome: 'Tabela odrzucająca błędne dane rabatowe (np. 150% rabatu) na poziomie silnika SQL.',
        starterHint: 'discount_percent INT NOT NULL CHECK (discount_percent BETWEEN 1 AND 90)',
      },
      quiz: [
        {
          id: 'q-db3-1',
          question: 'Co stanie się w bazie PostgreSQL po wykonaniu polecenia `UPDATE users SET role = \'ADMIN\';` bez podania klauzuli `WHERE`?',
          options: [
            'Baza danych zmodyfikuje absolutnie każdy wiersz w tabeli `users`, nadając rolę ADMIN wszystkim użytkownikom w systemie',
            'PostgreSQL automatycznie zablokuje zapytanie i wyświetli okienko z pytaniem',
            'Zaktualizowany zostanie tylko pierwszy wiersz',
            'Nic się nie stanie, ponieważ WHERE jest wymagane składniowo',
          ],
          correctAnswer: 0,
          explanation: 'Brak klauzuli WHERE w instrukcjach UPDATE oraz DELETE oznacza zastosowanie operacji do wszystkich rekordów w tabeli.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Przechowywanie cen i sald finansowych w kolumnie typu REAL lub DOUBLE PRECISION (Float)',
          whyItHappens: 'Przenoszenie nawyków z prostych skryptów do systemów bazodanowych.',
          howToFix: 'Arytmetyka zmiennoprzecinkowa powoduje błędy zaokrągleń (0.1 + 0.2 = 0.30000000000000004). Przechowuj kwoty w groszach jako INTEGER/BIGINT lub używaj typu dokładnego NUMERIC(12, 2).',
          badCode: 'balance FLOAT NOT NULL',
          goodCode: 'balance_cents BIGINT NOT NULL DEFAULT 0',
        },
      ],
      practicalTask: {
        title: 'Symulacja Soft Delete w zapytaniach SQL',
        brief: 'Napisz zapytanie dezaktywujące konto użytkownika poprzez ustawienie deleted_at = NOW() oraz zapytanie pobierające wyłącznie aktywnych użytkowników (WHERE deleted_at IS NULL).',
        steps: ['Dodaj kolumnę deleted_at TIMESTAMPTZ', 'Wykonaj UPDATE z ustawieniem NOW()', 'Przefiltruj widok przez IS NULL'],
        deliverable: 'Bezpieczny mechanizm archiwizacji danych bez bezpowrotnej utraty historii.',
      },
      completionCriteria: [
        'Zrozumienie INSERT, UPDATE, DELETE, RETURNING i Constraints',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'db-4',
      moduleId: 9,
      moduleTitle: 'Bazy Danych — SQL, PostgreSQL i Prisma ORM',
      title: 'Funkcje agregujące (COUNT, SUM, AVG), grupowanie (GROUP BY, HAVING) i rodzaje JOIN',
      slug: 'sql-agregacje-group-by-having-inner-left-join',
      durationMinutes: 45,
      xpReward: 90,
      order: 4,
      summary: 'Jak generować raporty analityczne i statystyki bezpośrednio w bazie danych? Poznaj funkcje agregujące (COUNT, SUM, AVG), różnicę między filtrowaniem WHERE a HAVING oraz kiedy użyć LEFT JOIN zamiast INNER JOIN.',
      objectives: [
        'Tworzyć zapytania analityczne z użyciem GROUP BY oraz funkcji COUNT(), SUM(), AVG(), MIN(), MAX()',
        'Rozróżniać filtrowanie pojedynczych wierszy przed grupowaniem (WHERE) od filtrowania gotowych grup (HAVING)',
        'Świadomie dobierać INNER JOIN vs LEFT JOIN, aby nie gubić rekordów nadrzędnych bez przypisanych relacji',
      ],
      prerequisites: ['Podstawy SQL i relacje 1:N'],
      theoryMarkdown: `Zamiast pobierać 100 000 zamówień do pamięci Node.js i sumować je w pętli JavaScript, zlecamy to silnikowi PostgreSQL, który wykona agregację w kilka milisekund!

**1. \`INNER JOIN\` vs \`LEFT JOIN\` — Krytyczna różnica:**
Wyobraź sobie, że chcesz wyświetlić listę wszystkich kursantów wraz z liczbą ukończonych przez nich projektów:
- **\`INNER JOIN\`** zwróci **tylko tych** kursantów, którzy mają chociaż jeden projekt. Nowi użytkownicy (z 0 projektów) całkowicie znikną z listy!
- **\`LEFT JOIN\`** zachowa **wszystkich** kursantów z lewej tabeli (\`users\`), a w przypadku braku dopasowania w prawej tabeli wstawi \`NULL\`.

**2. Grupowanie (\`GROUP BY\`) i funkcja \`COALESCE\`:**
\`\`\`sql
SELECT
  u.id,
  u.email,
  COUNT(p.id) AS completed_projects,
  COALESCE(SUM(p.xp_awarded), 0) AS total_project_xp
FROM users u
LEFT JOIN projects p ON p.user_id = u.id
GROUP BY u.id, u.email
ORDER BY total_project_xp DESC;
\`\`\`
*(Uwaga: \`COUNT(p.id)\` liczy tylko niepuste dopasowania, a \`COALESCE(..., 0)\` zamienia wynik \`NULL\` na eleganckie \`0\`!).*

**3. \`WHERE\` vs \`HAVING\`:**
- **\`WHERE\`** filtruje surowe wiersze **PRZED** wykonaniem \`GROUP BY\`.
- **\`HAVING\`** filtruje zagregowane grupy **PO** wykonaniu \`GROUP BY\` (np. \`HAVING COUNT(p.id) >= 3\`).`,
      codeExamples: [
        {
          title: 'Raport przychodów z podziałem na kategorie (WHERE + GROUP BY + HAVING)',
          language: 'sql',
          code: `SELECT
  category,
  COUNT(*) AS orders_count,
  ROUND(AVG(amount_cents) / 100.0, 2) AS avg_order_pln
FROM orders
WHERE status = 'PAID'            -- 1. Najpierw bierzemy tylko opłacone zamówienia
GROUP BY category                -- 2. Grupujemy je według kategorii
HAVING COUNT(*) >= 10            -- 3. Zostawiamy tylko kategorie z min. 10 zamówieniami
ORDER BY avg_order_pln DESC;`,
          explanation: 'Kolejność wykonywania operacji przez silnik SQL to: FROM -> JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Dobierz odpowiedni JOIN', description: 'Jeśli chcesz widzieć również rekordy z wynikiem 0, użyj LEFT JOIN.' },
        { step: 2, title: 'Wymień kolumny nieagregowane w GROUP BY', description: 'Każda kolumna z SELECT, która nie jest w COUNT/SUM/AVG, musi znaleźć się w GROUP BY.' },
        { step: 3, title: 'Użyj HAVING do warunków na agregatach', description: 'W klauzuli WHERE nie wolno używać funkcji COUNT() ani SUM().' },
      ],
      interactiveExercise: {
        id: 'ex-db-4',
        title: 'Wizualizacja raportu analitycznego GROUP BY & LEFT JOIN',
        instructions: 'Zbuduj kontener z klasą sql-analytics, wstaw zapytanie <code>SELECT role, COUNT(*) FROM users GROUP BY role</code> oraz wynik "Result: 3 groups aggregated".',
        task: 'Utwórz widżet sql-analytics prezentujący grupowanie danych w SQL.',
        starterCode: {
          html: '<!-- Zbuduj widżet analityki SQL poniżej -->\n',
          css: '.sql-analytics { background: #0f172a; border: 1px solid #38bdf8; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #38bdf8; font-family: monospace; font-weight: bold; }',
          js: 'console.log("SQL Analytics gotowe.");',
        },
        solutionCode: {
          html: '<div class="sql-analytics">\n  <code>SELECT role, COUNT(*) FROM users GROUP BY role</code>\n  <div>Result: 3 groups aggregated</div>\n</div>',
          css: '.sql-analytics { background: #0f172a; border: 1px solid #38bdf8; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #38bdf8; font-family: monospace; font-weight: bold; }',
          js: 'console.log("SQL Analytics gotowe.");',
        },
        hints: [
          'Użyj <div class="sql-analytics">.',
          'Wstaw <code>SELECT role, COUNT(*) FROM users GROUP BY role</code>.',
          'Dodaj tekst Result: 3 groups aggregated.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa sql-analytics obecna', ruleType: 'html_contains', target: 'sql-analytics' },
          { id: 'r2', description: 'Klauzula GROUP BY role obecna', ruleType: 'html_contains', target: 'GROUP BY role' },
          { id: 'r3', description: 'Informacja Result: 3 groups aggregated obecna', ruleType: 'html_contains', target: 'Result: 3 groups aggregated' },
        ],
      },
      independentTask: {
        title: 'Zapytanie o najaktywniejszych autorów komentarzy',
        instructions: 'Napisz zapytanie SQL łączące tabelę users z tabelą comments i zwracające tylko tych użytkowników, którzy napisali więcej niż 5 komentarzy (użyj GROUP BY oraz HAVING).',
        expectedOutcome: 'Poprawne zastosowanie filtrowania pogrupowanych wyników.',
        starterHint: 'SELECT u.email, COUNT(c.id) FROM users u JOIN comments c ON c.user_id = u.id GROUP BY u.id, u.email HAVING COUNT(c.id) > 5;',
      },
      quiz: [
        {
          id: 'q-db4-1',
          question: 'Czym różni się klauzula `WHERE` od klauzuli `HAVING` w języku SQL?',
          options: [
            '`WHERE` filtruje pojedyncze wiersze przed ich zgrupowaniem, natomiast `HAVING` filtruje całe grupy utworzone przez `GROUP BY` na podstawie funkcji agregujących (np. `HAVING COUNT(*) > 5`)',
            '`HAVING` działa tylko w bazach nierelacyjnych NoSQL',
            'Nie ma między nimi żadnej różnicy',
            '`WHERE` służy do sortowania wyników rosnąco',
          ],
          correctAnswer: 0,
          explanation: 'Ponieważ funkcje agregujące są obliczane dopiero na etapie GROUP BY, warunki odwołujące się do COUNT() czy SUM() muszą znajdować się w klauzuli HAVING.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Użycie `COUNT(*)` zamiast `COUNT( prawa_tabela.id )` przy łączeniu tabel przez `LEFT JOIN`',
          whyItHappens: 'Zapomnienie, że `COUNT(*)` liczy każdy wiersz wynikowy, nawet taki, w którym prawa tabela ma same wartości `NULL`.',
          howToFix: 'Przy `LEFT JOIN` użytkownik z 0 zamówieniami przy `COUNT(*)` otrzymałby wynik `1`! Zawsze licz klucz główny dołączanej tabeli: `COUNT(orders.id)`.',
          badCode: 'SELECT u.id, COUNT(*) FROM users u LEFT JOIN orders o ON o.user_id = u.id GROUP BY u.id;',
          goodCode: 'SELECT u.id, COUNT(o.id) FROM users u LEFT JOIN orders o ON o.user_id = u.id GROUP BY u.id;',
        },
      ],
      practicalTask: {
        title: 'Agregacje w Prisma ORM (groupBy i aggregate)',
        brief: 'Przetłumacz zapytanie analityczne SQL na wywołanie prisma.lessonProgress.groupBy({ by: ["userId"], _count: { lessonId: true } }).',
        steps: ['Wywołaj metodę groupBy na modelu Prisma', 'Określ pole grupowania by', 'Odczytaj wynik z pola _count'],
        deliverable: 'Umiejętność wykonywania agregacji zarówno w czystym SQL, jak i w Prisma Client.',
      },
      completionCriteria: [
        'Zrozumienie GROUP BY, HAVING oraz różnic między INNER i LEFT JOIN',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'db-5',
      moduleId: 9,
      moduleTitle: 'Bazy Danych — SQL, PostgreSQL i Prisma ORM',
      title: 'Relacje Wiele-do-Wielu (Many-to-Many) oraz Transakcje ACID (BEGIN, COMMIT, ROLLBACK)',
      slug: 'sql-relacje-many-to-many-transakcje-acid-prisma',
      durationMinutes: 45,
      xpReward: 90,
      order: 5,
      summary: 'Jak zamodelować sytuację, w której jeden student może zapisać się na wiele kursów, a jeden kurs ma wielu studentów? Poznaj tabele łączące (Junction Tables), klucze złożone (Composite Primary Keys) oraz atomowe transakcje ACID chroniące przelewy i zamówienia.',
      objectives: [
        'Projektować tabele pośredniczące (Junction / Pivot Tables) dla relacji N:M ze złożonym kluczem głównym',
        'Wyjaśnić 4 właściwości transakcji bazodanowych ACID (Atomicity, Consistency, Isolation, Durability)',
        'Wykonywać bezpieczne transakcje w SQL (BEGIN / COMMIT / ROLLBACK) oraz w Prisma ($transaction)',
      ],
      prerequisites: ['Relacje 1:N oraz modelowanie w Prisma'],
      theoryMarkdown: `**1. Relacja Wiele-do-Wielu (Many-to-Many / N:M):**
W bazach relacyjnych nie da się bezpośrednio połączyć dwóch tabel relacją N:M bez tabeli pośredniczącej (tzw. **Junction Table** / **Tabela łącząca**).
Przykład: \`users\` (studenci) oraz \`courses\` (kursy). Tworzymy tabelę łączącą \`enrollments\` (zapisy):
\`\`\`sql
CREATE TABLE enrollments (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  progress_percent INT NOT NULL DEFAULT 0,
  -- Złożony klucz główny (Composite Primary Key) gwarantuje,
  -- że ten sam student nie zapisze się dwa razy na ten sam kurs!
  PRIMARY KEY (user_id, course_id)
);
\`\`\`

**2. Transakcje ACID — Wszystko albo nic!**
Wyobraź sobie przelew 100 zł z konta A na konto B:
1. Odejmujemy 100 zł z konta A.
2. *(W tym ułamku sekundy pada zasilanie serwera lub pojawia się błąd!)*
3. Dodajemy 100 zł do konta B.
Bez transakcji 100 zł wyparowałoby z systemu! **Transakcja** gwarantuje **Atomowość (Atomicity)**: albo wszystkie operacje wewnątrz bloku zakończą się sukcesem (\`COMMIT\`), albo w razie jakiegokolwiek błędu baza cofnie wszystkie dotychczasowe zmiany (\`ROLLBACK\`), jakby nic się nie wydarzyło.

\`\`\`typescript
// Transakcja interaktywna w Prisma ORM:
await prisma.$transaction(async (tx) => {
  const sender = await tx.account.update({
    where: { id: senderId },
    data: { balance: { decrement: 100 } },
  });

  if (sender.balance < 0) {
    // Rzucenie błędu automatycznie wywołuje ROLLBACK całej transakcji!
    throw new Error('Niewystarczające środki na koncie!');
  }

  await tx.account.update({
    where: { id: receiverId },
    data: { balance: { increment: 100 } },
  });
});
\`\`\``,
      codeExamples: [
        {
          title: 'Transakcja w czystym SQL (PostgreSQL)',
          language: 'sql',
          code: `BEGIN;

UPDATE accounts SET balance_cents = balance_cents - 10000 WHERE id = 'acc-1';
UPDATE accounts SET balance_cents = balance_cents + 10000 WHERE id = 'acc-2';

INSERT INTO transfers (from_account, to_account, amount_cents)
VALUES ('acc-1', 'acc-2', 10000);

COMMIT; -- Zatwierdza wszystkie 3 operacje jednocześnie!
-- (W przypadku błędu wykonujemy ROLLBACK;)`,
          explanation: 'Dopóki transakcja nie zostanie zatwierdzona przez COMMIT, inni użytkownicy bazy danych nie widzą połowicznie zmienionych sald (właściwość Isolation).',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Utwórz tabelę łączącą dla relacji N:M', description: 'Umieść w niej dwa klucze obce i zdefiniuj PRIMARY KEY (col_a, col_b).' },
        { step: 2, title: 'Zidentyfikuj operacje wieloetapowe', description: 'Każde zamówienie (utworzenie Order + odjęcie stanu magazynowego) owijaj w transakcję.' },
        { step: 3, title: 'Trzymaj transakcje tak krótkie, jak to możliwe', description: 'Nigdy nie wykonuj zewnętrznych zapytań HTTP (np. wysyłki e-maila) wewnątrz otwartej transakcji bazodanowej!' },
      ],
      interactiveExercise: {
        id: 'ex-db-5',
        title: 'Wizualizacja atomowej transakcji ACID',
        instructions: 'Zbuduj kontener z klasą acid-transaction, wstaw znacznik <code>BEGIN -&gt; Transfer 100 PLN -&gt; COMMIT</code> oraz status "ACID Guarantee: Atomic & Isolated".',
        task: 'Utwórz widżet acid-transaction prezentujący przebieg transakcji bazodanowej.',
        starterCode: {
          html: '<!-- Zbuduj widżet transakcji ACID poniżej -->\n',
          css: '.acid-transaction { background: #0f172a; border: 1px solid #818cf8; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #a5b4fc; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Transakcja ACID zatwierdzona.");',
        },
        solutionCode: {
          html: '<div class="acid-transaction">\n  <code>BEGIN -&gt; Transfer 100 PLN -&gt; COMMIT</code>\n  <div>ACID Guarantee: Atomic &amp; Isolated</div>\n</div>',
          css: '.acid-transaction { background: #0f172a; border: 1px solid #818cf8; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #a5b4fc; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Transakcja ACID zatwierdzona.");',
        },
        hints: [
          'Użyj <div class="acid-transaction">.',
          'Wstaw <code>BEGIN -&gt; Transfer 100 PLN -&gt; COMMIT</code>.',
          'Dodaj tekst ACID Guarantee: Atomic & Isolated.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa acid-transaction obecna', ruleType: 'html_contains', target: 'acid-transaction' },
          { id: 'r2', description: 'Komenda COMMIT obecna', ruleType: 'html_contains', target: 'COMMIT' },
          { id: 'r3', description: 'Gwarancja ACID Guarantee obecna', ruleType: 'html_contains', target: 'ACID Guarantee' },
        ],
      },
      independentTask: {
        title: 'Model tagowania artykułów (Post <-> Tag) w Prisma',
        instructions: 'Zaprojektuj w składni Prisma relację wiele-do-wielu między modelami Post oraz Tag za pomocą jawnej tabeli łączącej PostTag z dodatkowym polem assignedAt DateTime.',
        expectedOutcome: 'Poprawny schemat relacji N:M z metadanymi na krawędzi połączenia.',
        starterHint: '@@id([postId, tagId]) wewnątrz modelu PostTag.',
      },
      quiz: [
        {
          id: 'q-db5-1',
          question: 'Co oznacza litera "A" (Atomicity / Atomowość) w skrócie ACID opisującym transakcje bazodanowe?',
          options: [
            'Gwarancję "wszystko albo nic": albo wszystkie instrukcje wchodzące w skład transakcji wykonają się poprawnie, albo w razie jakiegokolwiek błędu żadna z nich nie zostanie zapisana',
            'Automatyczne szyfrowanie danych energią atomową',
            'Zdolność bazy do działania bez prądu',
            'Sortowanie wyników w kolejności alfabetycznej',
          ],
          correctAnswer: 0,
          explanation: 'Atomowość chroni spójność danych przy operacjach składających się z wielu kroków (np. zakup towaru, rezerwacja biletu, przelew).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Wykonywanie wolnych zapytań sieciowych (np. wysyłka e-maila lub generowanie PDF) wewnątrz bloku `prisma.$transaction`',
          whyItHappens: 'Wrzucenie całej logiki biznesowej kontrolera do wnętrza callbacku transakcji.',
          howToFix: 'Otwarta transakcja blokuje wiersze w bazie i zajmuje połączenie z puli. Wewnątrz transakcji wykonuj wyłącznie operacje bazodanowe, a e-mail wyślij dopiero po jej pomyślnym zakończeniu!',
          badCode: 'await prisma.$transaction(async (tx) => { await tx.order.create(...); await sendEmailViaSmtp(); });',
          goodCode: 'const order = await prisma.$transaction(async (tx) => { ... }); await sendEmailViaSmtp(order);',
        },
      ],
      practicalTask: {
        title: 'Atomowy zakup kursu za punkty XP',
        brief: 'Napisz funkcję wykorzystującą transakcję, która odejmuje 500 XP z konta użytkownika i jednocześnie dodaje wpis w tabeli odblokowanych nagród.',
        steps: ['Rozpocznij transakcję', 'Sprawdź czy użytkownik ma >= 500 XP', 'Zaktualizuj stan konta i wstaw rekord nagrody'],
        deliverable: 'Odporny na warunki wyścigu (Race Conditions) mechanizm sklepu z nagrodami.',
      },
      completionCriteria: [
        'Zrozumienie relacji N:M oraz transakcji ACID',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'db-6',
      moduleId: 9,
      moduleTitle: 'Bazy Danych — SQL, PostgreSQL i Prisma ORM',
      title: 'Optymalizacja wydajności: Indeksy B-Tree, EXPLAIN ANALYZE oraz problem N+1 zapytań',
      slug: 'sql-indeksy-btree-explain-analyze-problem-n-plus-1',
      durationMinutes: 45,
      xpReward: 95,
      order: 6,
      summary: 'Dlaczego zapytanie, które działało w 2 ms na komputerze programisty, na produkcji trwa 12 sekund? Dowiedz się, jak działają indeksy B-Tree, jak czytać plan wykonania zapytania (EXPLAIN ANALYZE) oraz jak wyeliminować słynny antywzorzec N+1 Queries.',
      objectives: [
        'Rozumieć różnicę między pełnym skanowaniem tabeli (Seq Scan O(n)) a wyszukiwaniem po indeksie B-Tree (Index Scan O(log n))',
        'Tworzyć indeksy pojedyncze i złożone (CREATE INDEX) na kolumnach używanych w WHERE, JOIN oraz ORDER BY',
        'Rozpoznawać i eliminować problem N+1 zapytań w ORM-ach za pomocą Eager Loadingu (include / IN (...))',
      ],
      prerequisites: ['Zapytania JOIN i Prisma ORM'],
      theoryMarkdown: `**1. Jak działa indeks B-Tree w bazie danych?**
Wyobraź sobie grubą, 1000-stronicową książkę bez spisu treści i bez skoroszytu na końcu. Aby znaleźć hasło "Transakcja", musisz przeczytać stronę po stronie od deski do deski — w PostgreSQL nazywa się to **Sequential Scan (\`Seq Scan\`)**.
Gdy założysz indeks na kolumnie:
\`\`\`sql
CREATE INDEX idx_orders_user_id ON orders (user_id);
\`\`\`
Baza danych tworzy posortowane drzewo **B-Tree**, dzięki któremu znajduje szukany rekord wśród 10 milionów wierszy w zaledwie ~20 porównaniach (**\`Index Scan\`**, czas wykonania spada z 4500 ms do **0.3 ms**!).

**2. Diagnostyka z \`EXPLAIN ANALYZE\`:**
Przed każdym wolnym zapytaniem dopisz \`EXPLAIN ANALYZE\`, aby zobaczyć rzeczywisty plan wykonania i czas w milisekundach:
\`\`\`sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 'u-9921' ORDER BY created_at DESC;
\`\`\`
*(Wskazówka: W PostgreSQL klucz główny \`PRIMARY KEY\` oraz kolumny \`UNIQUE\` otrzymują indeks automatycznie, ale **klucze obce \`FOREIGN KEY\` NIE są indeksowane automatycznie** — musisz dodać na nich indeks ręcznie!).*

**3. Antywzorzec N+1 Zapytań (The N+1 Query Problem):**
Najczęstszy zabójca wydajności backendu. Chcemy wyświetlić 50 artykułów wraz z imieniem autora każdego z nich:
\`\`\`typescript
// ❌ PROBLEM N+1: Wykonuje 1 zapytanie o posty + 50 osobnych zapytań o autora w pętli (51 zapytań!)
const posts = await prisma.post.findMany({ take: 50 });
for (const post of posts) {
  const author = await prisma.user.findUnique({ where: { id: post.authorId } });
}

// ✅ ROZWIĄZANIE: Eager Loading z "include" (Tylko 2 szybkie zapytania łącznie!)
const postsWithAuthors = await prisma.post.findMany({
  take: 50,
  include: { author: true },
});
\`\`\``,
      codeExamples: [
        {
          title: 'Indeks złożony (Composite Index) w schema.prisma',
          language: 'typescript',
          code: `model Order {
  id        String   @id @default(uuid())
  userId    String
  status    String
  createdAt DateTime @default(now())

  // Indeks złożony przyspieszający zapytania filtrujące po userId i sortujące po dacie:
  @@index([userId, createdAt(sort: Desc)])
}`,
          explanation: 'Kolejność kolumn w indeksie złożonym ma ogromne znaczenie: najpierw umieszczamy kolumny sprawdzane na równość (=), a potem kolumny używane do zakresów lub sortowania.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Indeksuj wszystkie klucze obce (Foreign Keys)', description: 'Każda kolumna userId, courseId czy orderId używana w JOIN i WHERE powinna mieć indeks.' },
        { step: 2, title: 'Nigdy nie wykonuj zapytań SQL wewnątrz pętli for/map', description: 'Używaj klauzuli include w Prisma lub operatora WHERE id IN (...) w SQL.' },
        { step: 3, title: 'Nie indeksuj każdej kolumny na ślepo', description: 'Każdy dodatkowy indeks przyspiesza SELECT, ale nieznacznie spowalnia INSERT/UPDATE i zajmuje miejsce na dysku.' },
      ],
      interactiveExercise: {
        id: 'ex-db-6',
        title: 'Porównanie wydajności Seq Scan vs B-Tree Index Scan',
        instructions: 'Zbuduj kontener z klasą index-benchmark, wstaw informację <code>Index Scan using idx_orders_user_id</code> oraz wynik przyspieszenia "Execution Time: 0.42 ms (vs 1420 ms Seq Scan)".',
        task: 'Utwórz widżet index-benchmark prezentujący wynik EXPLAIN ANALYZE po dodaniu indeksu.',
        starterCode: {
          html: '<!-- Zbuduj widżet benchmarku indeksu poniżej -->\n',
          css: '.index-benchmark { background: #0f172a; border: 1px solid #f59e0b; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #fbbf24; font-family: monospace; font-weight: bold; }',
          js: 'console.log("B-Tree Index aktywny.");',
        },
        solutionCode: {
          html: '<div class="index-benchmark">\n  <code>Index Scan using idx_orders_user_id</code>\n  <div>Execution Time: 0.42 ms (vs 1420 ms Seq Scan)</div>\n</div>',
          css: '.index-benchmark { background: #0f172a; border: 1px solid #f59e0b; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #fbbf24; font-family: monospace; font-weight: bold; }',
          js: 'console.log("B-Tree Index aktywny.");',
        },
        hints: [
          'Użyj <div class="index-benchmark">.',
          'Wstaw <code>Index Scan using idx_orders_user_id</code>.',
          'Dodaj tekst Execution Time: 0.42 ms (vs 1420 ms Seq Scan).',
        ],
        rules: [
          { id: 'r1', description: 'Klasa index-benchmark obecna', ruleType: 'html_contains', target: 'index-benchmark' },
          { id: 'r2', description: 'Komunikat Index Scan using idx_orders_user_id obecny', ruleType: 'html_contains', target: 'Index Scan using idx_orders_user_id' },
          { id: 'r3', description: 'Czas Execution Time: 0.42 ms obecny', ruleType: 'html_contains', target: 'Execution Time: 0.42 ms' },
        ],
      },
      independentTask: {
        title: 'Refaktoryzacja problemu N+1',
        instructions: 'Przeanalizuj funkcję pobierającą 20 modułów kursowych, która w pętli for-of odpytuje bazę o lekcje dla każdego modułu z osobna. Zastąp ją pojedynczym wywołaniem z klauzulą include: { lessons: true }.',
        expectedOutcome: 'Redukcja liczby zapytań bazodanowych z 21 do zaledwie 2.',
        starterHint: 'await prisma.module.findMany({ include: { lessons: { orderBy: { order: "asc" } } } });',
      },
      quiz: [
        {
          id: 'q-db6-1',
          question: 'Na czym polega problem wydajnościowy znany jako "N+1 Query Problem"?',
          options: [
            'Aplikacja wykonuje 1 zapytanie pobierające listę N obiektów głównych, a następnie w pętli wykonuje N osobnych zapytań o powiązane dane dla każdego elementu z osobna, zalewając bazę danych setkami zapytań',
            'W tabeli znajduje się o jedną kolumnę za dużo',
            'Zapytanie zwraca zawsze o 1 wiersz więcej niż podano w LIMIT',
            'Baza danych wymaga podłączenia N+1 dysków twardych',
          ],
          correctAnswer: 0,
          explanation: 'Rozwiązaniem problemu N+1 jest pobranie danych powiązanych od razu za pomocą JOIN lub klauzuli include / WHERE id IN (...).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Brak indeksów na kolumnach kluczy obcych (np. `user_id`, `course_id`) w PostgreSQL',
          whyItHappens: 'Błędne założenie, że `REFERENCES users(id)` automatycznie tworzy indeks tak samo jak `PRIMARY KEY`.',
          howToFix: 'PostgreSQL tworzy automatyczny indeks wyłącznie dla PRIMARY KEY oraz UNIQUE. Dla kluczy obcych zawsze dodawaj jawny `CREATE INDEX` lub `@@index([userId])` w Prisma.',
          badCode: 'user_id UUID REFERENCES users(id) -- Brak indeksu = wolne JOIN i WHERE!',
          goodCode: 'CREATE INDEX idx_posts_user_id ON posts(user_id);',
        },
      ],
      practicalTask: {
        title: 'Audyt indeksów w schemacie bazy danych',
        brief: 'Przejrzyj zapytania WHERE i ORDER BY w swoim projekcie i wypisz listę indeksów B-Tree, które zapewnią czas odpowiedzi poniżej 5 ms przy milionie rekordów.',
        steps: ['Wypisz najczęściej filtrowane kolumny', 'Zaprojektuj indeksy pojedyncze i złożone', 'Sprawdź różnicę między select a include w Prisma'],
        deliverable: 'Zoptymalizowany schemat bazy danych gotowy na ruch produkcyjny.',
      },
      completionCriteria: [
        'Zrozumienie indeksów B-Tree, EXPLAIN ANALYZE i problemu N+1',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
  ],
};

