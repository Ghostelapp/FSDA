import { Module } from '../../types';

export const MODULE_6: Module = {
  id: 6,
  title: 'TypeScript — Bezpieczeństwo i Skalowalność Kodu',
  category: 'Frontend',
  description: 'Statyczne typowanie w świecie JavaScript: typy proste, interfejsy, aliasy, unie, generics, utility types oraz bezpieczna komunikacja z API.',
  badgeName: 'Mistrz Typów TypeScript',
  badgeIcon: 'ShieldCheck',
  durationHours: 25,
  totalXp: 750,
  prerequisites: ['Moduł 4: JavaScript'],
  topics: [
    'Dlaczego TypeScript: eliminacja błędów "undefined is not a function" na etapie kompilacji',
    'Interfejsy vs Type Aliases: kiedy używać interface, a kiedy type',
    'Unie i zawężanie typów (Type Narrowing: typeof, instanceof, in, type guards)',
    'Typy uogólnione (Generics) w funkcjach i strukturach danych',
    'Wbudowane typy pomocnicze: Partial, Required, Pick, Omit, Record, Readonly',
    'Konfiguracja tsconfig.json dla rygorystycznej kontroli typów (strict: true)',
  ],
  projectBrief: 'Projekt modułu: Przepisanie biblioteki narzędziowej z czystego JS na bezpieczny TypeScript z pełnym pokryciem typów.',
  lessons: [
    {
      id: 'ts-1',
      moduleId: 6,
      moduleTitle: 'TypeScript — Bezpieczeństwo i Skalowalność Kodu',
      title: 'Typy proste, inferencja i interfejsy: interface vs type',
      slug: 'typescript-podstawy-interfejsy-typy',
      durationMinutes: 35,
      xpReward: 70,
      order: 1,
      summary: 'Dlaczego ponad 80% firm wymaga TypeScripta? Poznaj statyczną kontrolę typów, inferencję (Type Inference), definiowanie struktur danych z interface i type oraz eliminację runtime crashes.',
      objectives: [
        'Zrozumieć mechanizm kompilacji TS do czystego JS i rolę pliku tsconfig.json',
        'Stosować adnotacje typów: string, number, boolean, tablice T[] i krotki tuples',
        'Definiować kontrakty danych z interface i opcjonalnymi właściwościami (pole?: string)',
      ],
      prerequisites: ['Moduł 4: JavaScript'],
      theoryMarkdown: `**TypeScript** to nadzbiór JavaScriptu (superset) z opcjonalnym statycznym typowaniem, stworzony przez firmę Microsoft (pod kierunkiem Andersa Hejlsberga, twórcy języka C#).

W czystym JavaScript błąd typu widzimy dopiero w przeglądarce klienta (np. \`TypeError: Cannot read properties of undefined\`). 
W TypeScript kompilator ostrzega nas **w ułamku sekundy w edytorze kodu**, zanim aplikacja w ogóle zostanie uruchomiona.

**Definiowanie struktur:**
\`\`\`typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number; // Właściwość opcjonalna (może być pominięta)
  readonly createdAt: Date; // Właściwość tylko do odczytu
}

const user: UserProfile = {
  id: 'usr_123',
  name: 'Jan Kowalski',
  email: 'jan@example.com',
  createdAt: new Date()
};
\`\`\`

**Inferencja typów (Type Inference):**
TypeScript jest na tyle inteligentny, że w większości przypadków sam domyśla się typu bez potrzeby pisania adnotacji:
\`\`\`typescript
let count = 10; // TS automatycznie wie, że to typ 'number'
count = "tekst"; // BŁĄD KOMPILACJI: Type 'string' is not assignable to type 'number'.
\`\`\``,
      codeExamples: [
        {
          title: 'Typowanie funkcji i parametrów w TypeScript',
          language: 'typescript',
          code: `interface CalculateDiscountParams {
  price: number;
  discountPercentage: number;
}

// Jawne typowanie parametrów oraz typu zwracanego (number):
function calculateDiscount({ price, discountPercentage }: CalculateDiscountParams): number {
  if (discountPercentage < 0 || discountPercentage > 100) {
    throw new Error("Procent rabatu musi być w zakresie 0-100");
  }
  return price - (price * (discountPercentage / 100));
}

const finalPrice = calculateDiscount({ price: 200, discountPercentage: 15 });
console.log("Cena po rabacie:", finalPrice); // 170`,
          explanation: 'Błędny typ parametru (np. string zamiast number) zostanie natychmiast wychwycony.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zdefiniuj interfejs dla danych', description: 'Użyj słowa kluczowego interface.' },
        { step: 2, title: 'Oznacz pola opcjonalne znakiem zapytania', description: 'Użyj nazwa?: typ.' },
        { step: 3, title: 'Przypisz typ do obiektu lub parametru', description: 'Użyj dwukropka : NazwaInterfejsu.' },
      ],
      interactiveExercise: {
        id: 'ex-ts-1',
        title: 'Zdefiniuj interfejs kursanta i stwórz poprawnie otypowany obiekt',
        instructions: 'W pliku app.js zdefiniuj obiekt student z polami: name: "Jan", xp: 300, isEnrolled: true, a następnie wyświetl go w konsoli console.log().',
        task: 'Utwórz obiekt student z polami name, xp, isEnrolled i wywołaj console.log.',
        starterCode: {
          html: '<h3>TypeScript Kontrakt Danych</h3>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: '// Utwórz obiekt student poniżej\n',
        },
        solutionCode: {
          html: '<h3>TypeScript Kontrakt Danych</h3>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: 'const student = {\n  name: "Jan",\n  xp: 300,\n  isEnrolled: true\n};\nconsole.log(student);',
        },
        hints: [
          'Zdefiniuj const student = { name: "Jan", xp: 300, isEnrolled: true };',
          'Wypisz console.log(student);',
        ],
        rules: [
          { id: 'r1', description: 'Pole name obecne w obiekcie', ruleType: 'js_contains', target: 'name' },
          { id: 'r2', description: 'Pole xp obecne w obiekcie', ruleType: 'js_contains', target: 'xp' },
          { id: 'r3', description: 'Pole isEnrolled obecne', ruleType: 'js_contains', target: 'isEnrolled' },
        ],
      },
      independentTask: {
        title: 'Unia typów (Union Types)',
        instructions: 'Zdefiniuj typ statusu: type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";.',
        expectedOutcome: 'Gwarancja, że zamówienie może przyjąć wyłącznie jeden ze ściśle określonych ciągów znaków.',
        starterHint: 'Unia z operatorem | zapobiega literówkom w statusach zamówień.',
      },
      quiz: [
        {
          id: 'q-ts1-1',
          question: 'Co dzieje się z kodem TypeScript podczas budowania aplikacji produkcyjnej (npm run build)?',
          options: [
            'Typy są usuwane (Type Erasure), a kod jest kompilowany do czystego, wydajnego JavaScriptu zrozumiałego dla przeglądarek',
            'Przeglądarka pobiera kompilator TypeScriptu na komputer każdego klienta',
            'Kod zostaje przekonwertowany na język maszynowy C++',
            'Typy spowalniają działanie aplikacji o 40%',
          ],
          correctAnswer: 0,
          explanation: 'Typy w TS istnieją wyłącznie na etapie pisania kodu i kompilacji. W produkcji działa czysty JS o zerowym narzucie wydajnościowym.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Nadużywanie typu "any"',
          whyItHappens: 'Chęć szybkiego wyciszenia ostrzeżenia kompilatora.',
          howToFix: 'Użycie any całkowicie wyłącza sprawdzanie typów i odbiera wszystkie zalety TypeScriptu. Jeśli typ jest nieznany, użyj bezpiecznego typu unknown.',
          badCode: 'function processData(data: any) { data.cosTam(); }',
          goodCode: 'function processData(data: unknown) { /* Wymaga Type Narrowing */ }',
        },
      ],
      practicalTask: {
        title: 'Konfiguracja tsconfig.json',
        brief: 'Przeanalizuj konfigurację TypeScript z flagą "strict": true w projekcie.',
        steps: ['Otwórz tsconfig.json', 'Sprawdź flagę strict', 'Zrozum ochronę przed null i undefined'],
        deliverable: 'Pewność, że kompilator rygorystycznie pilnuje jakości typów.',
      },
      completionCriteria: [
        'Zrozumienie statycznego typowania i inferencji',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'ts-2',
      moduleId: 6,
      moduleTitle: 'TypeScript — Bezpieczeństwo i Skalowalność Kodu',
      title: 'Typy uogólnione (Generics) i narzędziowe typy wbudowane (Utility Types)',
      slug: 'typescript-generics-utility-types',
      durationMinutes: 40,
      xpReward: 80,
      order: 2,
      summary: 'Twórz uniwersalny, reużywalny i bezpieczny kod: parametry typów <T>, ograniczenia extends oraz potężne wbudowane pomocniki: Partial, Pick, Omit, Record i Readonly.',
      objectives: [
        'Pisać funkcje i interfejsy uogólnione z parametrem typu <T>',
        'Transformować typy za pomocą Pick<T, K>, Omit<T, K> oraz Partial<T>',
        'Typować słowniki klucz-wartość za pomocą Record<string, T>',
      ],
      prerequisites: ['Lekcja 1: Podstawy TypeScript'],
      theoryMarkdown: `**Generics (Typy uogólnione)** pozwalają pisać komponenty i funkcje, które potrafią pracować z różnymi typami danych, zachowując pełne bezpieczeństwo typów.

Zamiast pisać osobną funkcję dla każdego typu:
\`\`\`typescript
function getFirstItem<T>(items: T[]): T | undefined {
  return items[0];
}

const num = getFirstItem([10, 20, 30]); // Typ: number
const str = getFirstItem(['a', 'b', 'c']); // Typ: string
\`\`\`

**Wbudowane Utility Types (Narzędzia typów):**
1. **\`Partial<User>\`**: Czyni wszystkie pola obiektu opcjonalnymi (idealne dla endpointów aktualizacji PATCH).
2. **\`Required<User>\`**: Czyni wszystkie pola obowiązkowymi.
3. **\`Pick<User, 'id' | 'email'>\`**: Tworzy podtyp zawierający tylko wybrane klucze.
4. **\`Omit<User, 'passwordHash'>\`**: Usuwa wrażliwe pole z typu.
5. **\`Record<string, number>\`**: Definiuje mapę klucz -> wartość.`,
      codeExamples: [
        {
          title: 'Generyczna odpowiedź API (ApiResponse<T>)',
          language: 'typescript',
          code: `interface ApiResponse<TData> {
  status: 'success' | 'error';
  data: TData;
  timestamp: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
}

// Bezpiecznie otypowana odpowiedź z tablicą produktów:
const response: ApiResponse<Product[]> = {
  status: 'success',
  data: [{ id: 1, title: 'Klawiatura mechaniczna', price: 350 }],
  timestamp: Date.now()
};`,
          explanation: 'TData jest parametrem podstawianym w momencie deklaracji zmiennej.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Wstaw nawiasy ostre <T> po nazwie funkcji', description: 'T to konwencja oznaczająca Type.' },
        { step: 2, title: 'Użyj T w parametrach i typie zwracanym', description: 'Zachowaj spójność typu wejścia i wyjścia.' },
        { step: 3, title: 'Stosuj Utility Types zamiast duplikować kod', description: 'Użyj Omit do wycięcia pól.' },
      ],
      interactiveExercise: {
        id: 'ex-ts-2',
        title: 'Komponent wizualizacji statusu typu Generycznego',
        instructions: 'Zaprojektuj wizualny widżet typu generycznego: stwórz kontener z klasą generic-badge, tag <code> z podpisem "ApiResponse&lt;T&gt;" oraz opis "Wielokrotne użycie".',
        task: 'Utwórz element z klasą generic-badge, tekstem ApiResponse i Wielokrotne użycie.',
        starterCode: {
          html: '<!-- Zbuduj widżet generyczny poniżej -->\n',
          css: '.generic-badge { background: #0f172a; border: 1px solid #334155; padding: 12px 18px; border-radius: 8px; display: inline-flex; align-items: center; gap: 10px; font-family: sans-serif; font-size: 0.85rem; }\ncode { color: #38bdf8; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Generics visualizer gotowy.");',
        },
        solutionCode: {
          html: '<div class="generic-badge">\n  <code>ApiResponse&lt;T&gt;</code>\n  <span style="color: #94a3b8;">Wielokrotne użycie</span>\n</div>',
          css: '.generic-badge { background: #0f172a; border: 1px solid #334155; padding: 12px 18px; border-radius: 8px; display: inline-flex; align-items: center; gap: 10px; font-family: sans-serif; font-size: 0.85rem; }\ncode { color: #38bdf8; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Generics visualizer gotowy.");',
        },
        hints: [
          'Użyj <div class="generic-badge">.',
          'Wstaw <code>ApiResponse&lt;T&gt;</code>.',
          'Dodaj tekst Wielokrotne użycie.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa generic-badge obecna', ruleType: 'html_contains', target: 'generic-badge' },
          { id: 'r2', description: 'Tekst ApiResponse obecny', ruleType: 'html_contains', target: 'ApiResponse' },
          { id: 'r3', description: 'Tekst Wielokrotne użycie obecny', ruleType: 'html_contains', target: 'Wielokrotne użycie' },
        ],
      },
      independentTask: {
        title: 'Wykorzystanie typu Omit',
        instructions: 'Z typu User wygeneruj typ UserWithoutPassword za pomocą Omit<User, "password">.',
        expectedOutcome: 'Bezpieczne przesyłanie profilu do frontendu bez hasła.',
        starterHint: 'type SafeUser = Omit<User, "password">;',
      },
      quiz: [
        {
          id: 'q-ts2-1',
          question: 'Co robi typ narzędziowy Partial<User>?',
          options: [
            'Usuwa wszystkie właściwości z obiektu',
            'Czyni wszystkie właściwości typu User opcjonalnymi (dodaje do nich ?)',
            'Zmienia wartości na liczby dziesiętne',
            'Blokuje modyfikację obiektu',
          ],
          correctAnswer: 1,
          explanation: 'Partial<T> zamienia { id: string, name: string } w { id?: string, name?: string }.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Ręczne duplikowanie interfejsów zamiast użycia Pick lub Omit',
          whyItHappens: 'Nieznajomość wbudowanych typów narzędziowych w TS.',
          howToFix: 'Gdy potrzebujesz wersji obiektu bez jednego pola, użyj Omit<Type, "pole">.',
          badCode: 'interface UserWithoutPass { id: string; email: string; } // Duplikacja!',
          goodCode: 'type UserWithoutPass = Omit<User, "password">;',
        },
      ],
      practicalTask: {
        title: 'Napisanie generycznej kolejki Queue<T>',
        brief: 'Zaimplementuj prostą klasę Queue<T> z metodami push(item: T) oraz pop(): T | undefined.',
        steps: ['Zdefiniuj generyczną tablicę items: T[]', 'Zaimplementuj push i pop', 'Przetestuj z liczbami i stringami'],
        deliverable: 'Praktyczne zrozumienie działania Generics.',
      },
      completionCriteria: [
        'Zrozumienie Generics i Utility Types',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
  ],
};
