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
  ],
};
