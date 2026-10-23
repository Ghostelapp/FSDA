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
    {
      id: 'ts-3',
      moduleId: 6,
      moduleTitle: 'TypeScript — Bezpieczny Kod na Dużą Skalę',
      title: 'Zawężanie typów (Type Narrowing), Type Guards i Unii Dyskryminowane',
      slug: 'typescript-type-narrowing-type-guards-discriminated-unions',
      durationMinutes: 45,
      xpReward: 85,
      order: 3,
      summary: 'Jak bezpiecznie obsługiwać wartości, które mogą mieć więcej niż jeden kształt? Poznaj mechanizm Type Narrowing (typeof, instanceof, in), predykaty typów (is) oraz potężny wzorzec Discriminated Unions do modelowania stanów aplikacji.',
      objectives: [
        'Zawężać typy unii (string | number | null) za pomocą instrukcji warunkowych i operatorów typeof / in',
        'Modelować stany żądań API za pomocą Unii Dyskryminowanych (Discriminated Unions) bez użycia flag boolean',
        'Pisać własne funkcje strażników typów (Custom Type Guards) ze składnią value is Type',
      ],
      prerequisites: ['Podstawy typów i interfejsów TypeScript'],
      theoryMarkdown: `Gdy zmienna ma typ unii (np. \`string | number\`), TypeScript pozwala wywołać na niej tylko te metody, które są wspólne dla obu typów. Aby użyć metody \`.toUpperCase()\`, musimy najpierw **zawęzić typ (Type Narrowing)**.

**1. Podstawowe techniki zawężania (Narrowing):**
- **\`typeof\` guard:** dla typów prostych (\`string\`, \`number\`, \`boolean\`, \`function\`).
- **Truthiness narrowing:** sprawdzenie \`if (val)\` odrzuca \`null\` oraz \`undefined\`.
- **Operator \`in\`:** sprawdza, czy dane pole istnieje w obiekcie.

\`\`\`typescript
function formatValue(val: string | number | null): string {
  if (val === null) return 'Brak danych';
  if (typeof val === 'string') {
    return val.trim().toUpperCase(); // Tutaj TS wie, że val to string!
  }
  return val.toFixed(2); // Tutaj TS wie na 100%, że val to number!
}
\`\`\`

**2. Unie Dyskryminowane (Discriminated Unions) — Złoty Standard:**
Zamiast tworzyć obiekt z wieloma opcjonalnymi polami (\`{ isLoading?: boolean; data?: User; error?: string }\`), które pozwalają na niemożliwe stany (np. jednocześnie \`isLoading: true\` i \`error: "Błąd"\`), używamy wspólnego pola dyskryminującego \`status\`:

\`\`\`typescript
type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

function renderView(state: AsyncState<string[]>) {
  switch (state.status) {
    case 'loading':
      return 'Ładowanie...';
    case 'success':
      // TS automatycznie wie, że state.data jest dostępne TYLKO tutaj!
      return \`Pobrano elementów: \${state.data.length}\`;
    case 'error':
      return \`Błąd: \${state.message}\`;
  }
}
\`\`\`

**3. Własne strażniki typów (Type Predicates \`is\`):**
Gdy walidujemy dane z zewnętrznego API, możemy napisać funkcję zwracającą \`val is User\`:
\`\`\`typescript
function isUser(obj: unknown): obj is { id: number; email: string } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj
  );
}
\`\`\``,
      codeExamples: [
        {
          title: 'Wyczerpujące sprawdzanie (Exhaustiveness Checking) z typem never',
          language: 'typescript',
          code: `type PaymentMethod =
  | { kind: 'card'; cardNumber: string }
  | { kind: 'blik'; code: string }
  | { kind: 'transfer'; bankName: string };

function processPayment(payment: PaymentMethod): string {
  switch (payment.kind) {
    case 'card':
      return \`Płatność kartą: \${payment.cardNumber.slice(-4)}\`;
    case 'blik':
      return \`Kod BLIK: \${payment.code}\`;
    case 'transfer':
      return \`Przelew z banku: \${payment.bankName}\`;
    default:
      // Jeśli ktoś doda 4. metodę płatności i zapomni o switchu,
      // TypeScript zgłosi tutaj błąd kompilacji!
      const _exhaustiveCheck: never = payment;
      return _exhaustiveCheck;
  }
}`,
          explanation: 'Przypisanie nieobsłużonego przypadku do zmiennej typu never gwarantuje, że żaden nowy wariant unii nie zostanie pominięty podczas rozwoju aplikacji.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zdefiniuj warianty stanu', description: 'Każdy wariant unii powinien mieć wspólne pole literałowe (np. status lub type).' },
        { step: 2, title: 'Zastosuj instrukcję switch', description: 'Przełączaj logikę po polu dyskryminującym.' },
        { step: 3, title: 'Dodaj blok default z never', description: 'Zabezpiecz kod przed nieobsłużonymi wariantami w przyszłości.' },
      ],
      interactiveExercise: {
        id: 'ex-ts-3',
        title: 'Wizualizacja maszyny stanów Discriminated Union',
        instructions: 'Stwórz kontener z klasą union-card, w środku umieść znacznik <code>status: "success"</code> oraz kontener danych z tekstem "Payload: 24 rekordy (Type Safe)".',
        task: 'Zbuduj kartę union-card prezentującą zawężony wariant sukcesu unii dyskryminowanej.',
        starterCode: {
          html: '<!-- Zbuduj kartę Discriminated Union poniżej -->\n',
          css: '.union-card { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Discriminated Union zweryfikowana.");',
        },
        solutionCode: {
          html: '<div class="union-card">\n  <code>status: "success"</code>\n  <div>Payload: 24 rekordy (Type Safe)</div>\n</div>',
          css: '.union-card { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Discriminated Union zweryfikowana.");',
        },
        hints: [
          'Użyj <div class="union-card">.',
          'Dodaj <code>status: "success"</code>.',
          'Wpisz tekst Payload: 24 rekordy (Type Safe).',
        ],
        rules: [
          { id: 'r1', description: 'Klasa union-card obecna', ruleType: 'html_contains', target: 'union-card' },
          { id: 'r2', description: 'Dyskryminator status: "success" obecny', ruleType: 'html_contains', target: 'status: "success"' },
          { id: 'r3', description: 'Informacja Payload: 24 rekordy (Type Safe) obecna', ruleType: 'html_contains', target: 'Payload: 24 rekordy (Type Safe)' },
        ],
      },
      independentTask: {
        title: 'Model powiadomień systemowych jako Discriminated Union',
        instructions: 'Zaprojektuj typ Notification obsługujący 3 warianty: email (wymaga pola recipientEmail), sms (wymaga phoneNumber) oraz push (wymaga deviceToken). Napisz funkcję sendNotification(n: Notification).',
        expectedOutcome: 'Brak możliwości wysłania SMS-a bez numeru telefonu już na etapie kompilacji.',
        starterHint: 'type Notification = { type: "email"; recipientEmail: string } | { type: "sms"; phoneNumber: string } | ...',
      },
      quiz: [
        {
          id: 'q-ts3-1',
          question: 'Czym jest tzw. "dyskryminator" w wzorcu Discriminated Union?',
          options: [
            'Wspólnym polem o typie literałowym (np. status: "loading" | "success" | "error"), po którym TypeScript jednoznacznie rozpoznaje konkretny wariant obiektu',
            'Specjalną flagą w pliku tsconfig.json wyłączającą sprawdzanie typów',
            'Funkcją usuwającą duplikaty z tablicy',
            'Metodą szyfrowania haseł w bazie danych',
          ],
          correctAnswer: 0,
          explanation: 'Wspólne pole literałowe pozwala kompilatorowi zawęzić cały typ obiektu wewnątrz instrukcji if lub switch.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Nadużywanie rzutowania typu "as" (Type Assertion) zamiast prawdziwego zawężenia typu',
          whyItHappens: 'Chęć szybkiego uciszenia błędu kompilatora poprzez wpisanie (data as User).name.',
          howToFix: 'Słowo kluczowe "as" wyłącza ochronę TypeScriptu i może spowodować crash aplikacji w runtime. Zamiast tego użyj warunku sprawdzającego (Type Guard).',
          badCode: 'const user = response as User; // Niebezpieczne kłamstwo wobec kompilatora!',
          goodCode: 'if (isUser(response)) { console.log(response.email); }',
        },
      ],
      practicalTask: {
        title: 'Strażnik typów dla odpowiedzi API',
        brief: 'Napisz funkcję isApiError(err: unknown): err is { code: number; message: string }, która bezpiecznie sprawdza kształt błędu.',
        steps: ['Sprawdź typeof err === "object" && err !== null', 'Zweryfikuj obecność kluczy "code" i "message"', 'Przetestuj w bloku catch (err: unknown)'],
        deliverable: 'Bezpieczna obsługa wyjątków zgodna ze standardem strict TypeScript.',
      },
      completionCriteria: [
        'Zrozumienie Type Narrowing i Discriminated Unions',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'ts-4',
      moduleId: 6,
      moduleTitle: 'TypeScript — Bezpieczny Kod na Dużą Skalę',
      title: 'Zaawansowane funkcje, typy unknown vs any, void vs never oraz krotki (Tuples)',
      slug: 'typescript-funkcje-unknown-any-never-tuples',
      durationMinutes: 40,
      xpReward: 80,
      order: 4,
      summary: 'Dlaczego typ unknown ratuje aplikację przed awarią, podczas gdy any ją niszczy? Naucz się typować callbacki, parametry opcjonalne i domyślne, przeciążenia funkcji (Function Overloads) oraz krotki (Tuples) takie jak te zwracane przez useState.',
      objectives: [
        'Zastępować niebezpieczny typ any bezpiecznym typem unknown przy danych wejściowych (JSON.parse, catch)',
        'Rozróżniać typ void (funkcja nic nie zwraca) od never (funkcja nigdy nie kończy działania lub rzuca wyjątek)',
        'Typować funkcje wyższego rzędu (callbacks) oraz krotki o stałej długości i określonych typach pozycji',
      ],
      prerequisites: ['Podstawy TypeScript i zawężanie typów'],
      theoryMarkdown: `W profesjonalnych zespołach programistycznych obowiązuje zasada **Zero \`any\` Policy** (wymuszana przez regułę ESLint \`@typescript-eslint/no-explicit-any\`).

**1. \`any\` vs \`unknown\` — Kluczowa różnica:**
- **\`any\`:** Całkowicie wyłącza sprawdzanie typów. Pozwala wywołać \`val.nieistniejacaMetoda()\`, co wywali aplikację u klienta.
- **\`unknown\`:** Bezpieczny odpowiednik "nie wiem jeszcze, co to jest". Możesz przypisać do niego dowolną wartość, ale **nie możesz zrobić z nią nic**, dopóki nie sprawdzisz jej typu!

\`\`\`typescript
function parseConfig(rawJson: string): unknown {
  return JSON.parse(rawJson);
}

const config = parseConfig('{"port": 3000}');
// config.port; // ❌ Błąd kompilacji! Obiekt jest typu 'unknown'.

if (typeof config === 'object' && config !== null && 'port' in config) {
  console.log(config.port); // ✅ Bezpieczny dostęp po weryfikacji!
}
\`\`\`

**2. Typowanie funkcji i callbacków:**
\`\`\`typescript
// Definicja typu funkcji filtrującej:
type Predicate<T> = (item: T, index: number) => boolean;

function filterItems<T>(items: T[], callback: Predicate<T>): T[] {
  const result: T[] = [];
  items.forEach((item, idx) => {
    if (callback(item, idx)) result.push(item);
  });
  return result;
}
\`\`\`

**3. Krotki (Tuples) — tablice o ściśle określonej strukturze:**
Zwykła tablica \`string[]\` może mieć 0 lub 1000 elementów. **Krotka (Tuple)** ma ściśle określoną długość i typ każdego elementu z osobna (dokładnie tak działa \`useState\` w React!):
\`\`\`typescript
// Krotka nazwana (Labeled Tuple):
type Coordinates = [latitude: number, longitude: number];
type UseStateTuple<T> = [state: T, setState: (newVal: T) => void];

const warsaw: Coordinates = [52.2297, 21.0122];
\`\`\``,
      codeExamples: [
        {
          title: 'Różnica między void a never w praktyce',
          language: 'typescript',
          code: `// void: funkcja wykonuje efekt uboczny i kończy się normalnie bez wartości
function logMessage(msg: string): void {
  console.log(\`[LOG]: \${msg}\`);
}

// never: funkcja NIGDY nie dociera do końca (zawsze rzuca wyjątek)
function throwFatalError(message: string): never {
  throw new Error(\`Krytyczny błąd: \${message}\`);
}`,
          explanation: 'Typ never informuje kompilator, że kod znajdujący się po wywołaniu throwFatalError jest nieosiągalny (Dead Code).',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zamień wszystkie any na unknown', description: 'Szczególnie w blokach catch(err: unknown) oraz po JSON.parse().' },
        { step: 2, title: 'Zdefiniuj aliasy dla callbacków', description: 'Użyj składni (param: Type) => ReturnType.' },
        { step: 3, title: 'Użyj Readonly Tuple dla stałych par', description: 'Zabezpiecz współrzędne lub wyniki hooków przed przypadkowym .push().' },
      ],
      interactiveExercise: {
        id: 'ex-ts-4',
        title: 'Porównanie bezpieczeństwa unknown vs any',
        instructions: 'Stwórz kontener z klasą safety-box, umieść w nim zielony znacznik <code>unknown: Safe Type Check Required</code> oraz ostrzeżenie "Zero any policy active".',
        task: 'Utwórz widżet safety-box promujący używanie typu unknown zamiast any.',
        starterCode: {
          html: '<!-- Zbuduj widżet bezpieczeństwa typów poniżej -->\n',
          css: '.safety-box { background: #0f172a; border: 1px solid #38bdf8; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #38bdf8; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Polityka Zero Any aktywna.");',
        },
        solutionCode: {
          html: '<div class="safety-box">\n  <code>unknown: Safe Type Check Required</code>\n  <div>Zero any policy active</div>\n</div>',
          css: '.safety-box { background: #0f172a; border: 1px solid #38bdf8; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #38bdf8; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Polityka Zero Any aktywna.");',
        },
        hints: [
          'Użyj <div class="safety-box">.',
          'Wstaw <code>unknown: Safe Type Check Required</code>.',
          'Dodaj tekst Zero any policy active.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa safety-box obecna', ruleType: 'html_contains', target: 'safety-box' },
          { id: 'r2', description: 'Kod unknown: Safe Type Check Required obecny', ruleType: 'html_contains', target: 'unknown: Safe Type Check Required' },
          { id: 'r3', description: 'Hasło Zero any policy active obecne', ruleType: 'html_contains', target: 'Zero any policy active' },
        ],
      },
      independentTask: {
        title: 'Własna implementacja krotki wyniku Result<T, E>',
        instructions: 'Zdefiniuj typ Result<T> jako krotkę będącą unią: [data: T, error: null] | [data: null, error: Error]. Napisz funkcję dzielenia dwóch liczb zwracającą ten typ.',
        expectedOutcome: 'Obsługa błędów w stylu języka Go/Rust wymuszająca sprawdzenie błędu przed odczytem wyniku.',
        starterHint: 'function safeDivide(a: number, b: number): [number, null] | [null, Error]',
      },
      quiz: [
        {
          id: 'q-ts4-1',
          question: 'Czym różni się typ `unknown` od typu `any` w TypeScript?',
          options: [
            'Do obu można przypisać dowolną wartość, ale `unknown` zabrania wywoływania metod i odczytu właściwości bez wcześniejszego zawężenia typu (Type Narrowing)',
            '`unknown` działa tylko dla liczb, a `any` tylko dla tekstów',
            'Nie ma między nimi żadnej różnicy',
            '`unknown` automatycznie usuwa zmienne z pamięci RAM',
          ],
          correctAnswer: 0,
          explanation: 'Typ unknown wymusza weryfikację danych w runtime, zachowując 100% bezpieczeństwa typów.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Używanie ogólnego typu Function zamiast dokładnej sygnatury funkcji',
          whyItHappens: 'Pisanie callback: Function z przyzwyczajenia z luźnego JS.',
          howToFix: 'Typ Function akceptuje dowolną funkcję z dowolnymi argumentami i zwraca any. Zawsze określaj dokładne parametry, np. (id: string) => void.',
          badCode: 'function onClick(handler: Function) { ... }',
          goodCode: 'function onClick(handler: (event: MouseEvent) => void) { ... }',
        },
      ],
      practicalTask: {
        title: 'Bezpieczny parser JSON z typem unknown',
        brief: 'Zaimplementuj funkcję safeJsonParse(str: string): unknown, która łapie błędy składniowe JSON i zwraca null w razie niepowodzenia.',
        steps: ['Opakuj JSON.parse w blok try/catch', 'Oznacz typ zwracany jako unknown', 'Zweryfikuj wynik za pomocą typeof przed użyciem'],
        deliverable: 'Odporny na awarie moduł parsowania danych zewnętrznych.',
      },
      completionCriteria: [
        'Zrozumienie różnic między unknown, any, void i never',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'ts-5',
      moduleId: 6,
      moduleTitle: 'TypeScript — Bezpieczny Kod na Dużą Skalę',
      title: 'Typowanie DOM, Zdarzeń (Events) oraz asynchronicznych zapytań Fetch / Promise<T>',
      slug: 'typescript-dom-events-async-promise-fetch',
      durationMinutes: 45,
      xpReward: 85,
      order: 5,
      summary: 'Jak pracować z elementami HTML i asynchronicznym API w TypeScript? Poznaj interfejsy HTMLInputElement, HTMLButtonElement, różnicę między e.target a e.currentTarget oraz generyczny typ Promise<T>.',
      objectives: [
        'Prawidłowo pobierać i typować elementy DOM za pomocą querySelector<HTMLInputElement>',
        'Obsługiwać zdarzenia MouseEvent, KeyboardEvent i SubmitEvent z pełnym autouzupełnianiem',
        'Typować funkcje async/await za pomocą generycznego typu Promise<T>',
      ],
      prerequisites: ['Moduł 4: DOM i Async JS', 'Generics w TypeScript'],
      theoryMarkdown: `Kiedy pobierasz element ze strony przez \`document.querySelector('.pole')\`, TypeScript widzi go domyślnie jako ogólny \`Element | null\`. Ogólny \`Element\` nie posiada właściwości \`.value\`!

**1. Typowanie elementów DOM:**
Używamy parametru generycznego w \`querySelector<T>\` oraz sprawdzamy, czy element istnieje:
\`\`\`typescript
const emailInput = document.querySelector<HTMLInputElement>('#email-input');
const submitBtn = document.querySelector<HTMLButtonElement>('#submit-btn');

if (emailInput && submitBtn) {
  // Tutaj TS wie, że emailInput to HTMLInputElement i ma pole .value!
  console.log(emailInput.value);
  submitBtn.disabled = true;
}
\`\`\`

**2. Typowanie zdarzeń (Events): \`currentTarget\` vs \`target\`:**
W obsłudze zdarzeń zawsze preferuj \`e.currentTarget\` (element, do którego przypięto listener), ponieważ TypeScript zna jego dokładny typ:
\`\`\`typescript
emailInput?.addEventListener('input', (e: Event) => {
  if (e.currentTarget instanceof HTMLInputElement) {
    console.log('Wpisano:', e.currentTarget.value);
  }
});
\`\`\`

**3. Asynchroniczność i \`Promise<T>\`:**
Każda funkcja oznaczona słowem \`async\` **zawsze** zwraca \`Promise<T>\`:
\`\`\`typescript
interface Course {
  id: string;
  title: string;
  lessonsCount: number;
}

async function fetchCourses(): Promise<Course[]> {
  const response = await fetch('/api/courses');
  if (!response.ok) {
    throw new Error(\`HTTP Error: \${response.status}\`);
  }
  const data: Course[] = await response.json();
  return data;
}
\`\`\``,
      codeExamples: [
        {
          title: 'Generyczny klient HTTP z obsługą błędów i typowaniem',
          language: 'typescript',
          code: `async function apiGet<TResponse>(url: string): Promise<TResponse> {
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(\`Błąd żądania [\${res.status}]: \${res.statusText}\`);
  }

  return (await res.json()) as TResponse;
}

// Użycie z pełnym podpowiadaniem składni:
// const user = await apiGet<{ id: string; name: string }>('/api/me');`,
          explanation: 'Jeden generyczny helper apiGet<T> eliminuje powtarzanie logiki sprawdzania res.ok w dziesiątkach miejsc w aplikacji.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Dobierz właściwy interfejs HTML', description: 'HTMLInputElement dla <input>, HTMLFormElement dla <form>, HTMLCanvasElement dla <canvas>.' },
        { step: 2, title: 'Obsłuż wartość null', description: 'Użyj if (element) lub operatora optional chaining element?.focus().' },
        { step: 3, title: 'Oznacz typ zwracany funkcji async', description: 'Zawsze pisz jawnie Promise<ReturnType> w nagłówku funkcji API.' },
      ],
      interactiveExercise: {
        id: 'ex-ts-5',
        title: 'Widżet typowanego klienta API Promise<T>',
        instructions: 'Zbuduj kontener z klasą async-type-card, umieść w nim sygnaturę <code>async fetchUser(): Promise&lt;User&gt;</code> oraz status "DOM & Fetch Typed: 100%".',
        task: 'Utwórz element async-type-card z sygnaturą Promise<User> i statusem typowania.',
        starterCode: {
          html: '<!-- Zbuduj widżet Promise<User> poniżej -->\n',
          css: '.async-type-card { background: #0f172a; border: 1px solid #818cf8; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #a5b4fc; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Klient Promise<T> gotowy.");',
        },
        solutionCode: {
          html: '<div class="async-type-card">\n  <code>async fetchUser(): Promise&lt;User&gt;</code>\n  <div>DOM &amp; Fetch Typed: 100%</div>\n</div>',
          css: '.async-type-card { background: #0f172a; border: 1px solid #818cf8; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #a5b4fc; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Klient Promise<T> gotowy.");',
        },
        hints: [
          'Użyj <div class="async-type-card">.',
          'Wstaw <code>async fetchUser(): Promise&lt;User&gt;</code>.',
          'Dodaj tekst DOM & Fetch Typed: 100%.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa async-type-card obecna', ruleType: 'html_contains', target: 'async-type-card' },
          { id: 'r2', description: 'Sygnatura async fetchUser obecna', ruleType: 'html_contains', target: 'async fetchUser()' },
          { id: 'r3', description: 'Status 100% obecny', ruleType: 'html_contains', target: '100%' },
        ],
      },
      independentTask: {
        title: 'Typowana obsługa formularza logowania w czystym TS',
        instructions: 'Pobierz formularz HTMLFormElement, obsłuż zdarzenie submit (SubmitEvent), zablokuj przeładowanie e.preventDefault() i odczytaj wartości z pól za pomocą new FormData(form).',
        expectedOutcome: 'Bezpieczna obsługa formularza bez użycia żadnego rzutowania any.',
        starterHint: 'const form = document.querySelector<HTMLFormElement>("#login-form");',
      },
      quiz: [
        {
          id: 'q-ts5-1',
          question: 'Jaki typ zwraca każda funkcja oznaczona słowem kluczowym `async` w TypeScript?',
          options: [
            'Zawsze zwraca generyczny typ `Promise<T>`, gdzie `T` to typ wartości zwracanej przez instrukcję `return`',
            'Zwraca zwykły obiekt synchroniczny',
            'Zawsze zwraca typ `void`',
            'Zwraca typ `any`',
          ],
          correctAnswer: 0,
          explanation: 'Nawet jeśli wewnątrz funkcji async zrobisz return 42, jej typem zwracanym na zewnątrz jest Promise<number>.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Używanie wykrzyknika Non-Null Assertion (element!) przy pobieraniu z DOM',
          whyItHappens: 'Pisanie document.querySelector("#btn")!.addEventListener(...) z lenistwa.',
          howToFix: 'Jeśli identyfikator w HTML zmieni się lub element nie jest jeszcze wyrenderowany, wykrzyknik (!) doprowadzi do błędu "Cannot read properties of null". Użyj operatora ?. lub bloku if.',
          badCode: 'document.querySelector<HTMLButtonElement>("#btn")!.click();',
          goodCode: 'document.querySelector<HTMLButtonElement>("#btn")?.click();',
        },
      ],
      practicalTask: {
        title: 'Równoległe pobieranie danych z Promise.all',
        brief: 'Napisz funkcję pobierającą jednocześnie profil użytkownika i listę jego kursów za pomocą Promise.all<[Promise<User>, Promise<Course[]>]> i zobacz, jak TS automatycznie wnioskuje krotkę wynikową [User, Course[]].',
        steps: ['Przygotuj dwie funkcje zwracające Promise', 'Wywołaj await Promise.all([getUser(), getCourses()])', 'Zdestrukturyzuj wynik const [user, courses] = ...'],
        deliverable: 'Wydajne i w pełni otypowane równoległe zapytania sieciowe.',
      },
      completionCriteria: [
        'Zrozumienie typowania elementów DOM, zdarzeń i Promise<T>',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'ts-6',
      moduleId: 6,
      moduleTitle: 'TypeScript — Bezpieczny Kod na Dużą Skalę',
      title: 'Konfiguracja tsconfig.json, as const, keyof typeof i pliki deklaracji (.d.ts)',
      slug: 'typescript-tsconfig-as-const-keyof-typeof-deklaracje',
      durationMinutes: 40,
      xpReward: 85,
      order: 6,
      summary: 'Poznaj tajniki zaawansowanego TypeScriptu używanego w bibliotekach produkcyjnych: zamrażanie literałów przez as const, wyprowadzanie typów ze stałych za pomocą keyof typeof, operator satisfies oraz konfiguracja pliku tsconfig.json.',
      objectives: [
        'Konfigurować kluczowe flagi kompilatora w pliku tsconfig.json (strict, noUncheckedIndexedAccess, target)',
        'Stosować asercję as const oraz operator satisfies do tworzenia niezmiennych obiektów konfiguracyjnych',
        'Wyciągać typy kluczy i wartości z istniejących obiektów za pomocą kombinacji keyof typeof',
      ],
      prerequisites: ['Generics i Utility Types w TypeScript'],
      theoryMarkdown: `W dużych projektach nie chcemy pisać dwa razy tego samego — raz jako obiektu JavaScript, a drugi raz jako typu TypeScript. Nowoczesny TypeScript pozwala **wygenerować typy bezpośrednio z wartości**.

**1. Asercja \`as const\` (Const Assertions):**
Domyślnie obiekt \`const routes = { home: '/' }\` ma typ \`{ home: string }\`. Dodanie \`as const\` zamraża obiekt jako głęboki \`readonly\` i zachowuje dokładne literały tekstowe:
\`\`\`typescript
const ROLES = ['ADMIN', 'EDITOR', 'STUDENT'] as const;
// Wyciągamy unię z tablicy: 'ADMIN' | 'EDITOR' | 'STUDENT'
type Role = (typeof ROLES)[number];
\`\`\`

**2. Wzorzec \`keyof typeof\`:**
\`\`\`typescript
const THEME_COLORS = {
  primary: '#6366f1',
  success: '#10b981',
  danger: '#ef4444',
} as const;

// Typ kluczy: "primary" | "success" | "danger"
type ThemeKey = keyof typeof THEME_COLORS;
\`\`\`

**3. Operator \`satisfies\` (TS 4.9+):**
Sprawdza, czy obiekt spełnia dany interfejs, ale **nie rozszerza (nie zamazuje)** jego dokładnych typów:
\`\`\`typescript
type RouteConfig = Record<string, { path: string; auth: boolean }>;

const appRoutes = {
  home: { path: '/', auth: false },
  profile: { path: '/profile', auth: true },
} satisfies RouteConfig;

// TS nadal wie, że appRoutes.home istnieje (przy zwykłym : RouteConfig by to zgubił!)
\`\`\`

**4. Najważniejsze flagi w \`tsconfig.json\`:**
- \`"strict": true\` — włącza wszystkie rygorystyczne kontrole (m.in. \`strictNullChecks\`).
- \`"noUncheckedIndexedAccess": true\` — sprawia, że odczyt z tablicy \`arr[0]\` ma typ \`T | undefined\`, chroniąc przed wyjściem poza zakres tablicy.
- \`"noEmit": true\` — używane w projektach z bundlerem Vite (TS tylko sprawdza typy, a kompilacją zajmuje się Vite/esbuild).`,
      codeExamples: [
        {
          title: 'Typowanie zmiennych środowiskowych w pliku env.d.ts',
          language: 'typescript',
          code: `/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}`,
          explanation: 'Pliki z rozszerzeniem .d.ts (Declaration Files) nie zawierają kodu wykonywalnego — dostarczają kompilatorowi informacji o typach globalnych lub zewnętrznych bibliotekach.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Włącz flagę strict w tsconfig.json', description: 'To absolutny fundament każdego profesjonalnego projektu TS.' },
        { step: 2, title: 'Używaj as const zamiast enumów', description: 'Obiekty z as const nie generują dodatkowego kodu JS po kompilacji.' },
        { step: 3, title: 'Waliduj konfigurację operatorem satisfies', description: 'Połącz bezpieczeństwo kontraktu z dokładnym wnioskowaniem literałów.' },
      ],
      interactiveExercise: {
        id: 'ex-ts-6',
        title: 'Wizualizacja konfiguracji Strict TypeScript',
        instructions: 'Zbuduj kontener z klasą tsconfig-card, w środku umieść znacznik <code>"strict": true</code> oraz informację o wzorcu "as const + satisfies: Enabled".',
        task: 'Utwórz widżet tsconfig-card prezentujący produkcyjną konfigurację kompilatora.',
        starterCode: {
          html: '<!-- Zbuduj widżet tsconfig poniżej -->\n',
          css: '.tsconfig-card { background: #0f172a; border: 1px solid #f59e0b; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #fbbf24; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Konfiguracja tsconfig zweryfikowana.");',
        },
        solutionCode: {
          html: '<div class="tsconfig-card">\n  <code>"strict": true</code>\n  <div>as const + satisfies: Enabled</div>\n</div>',
          css: '.tsconfig-card { background: #0f172a; border: 1px solid #f59e0b; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #fbbf24; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Konfiguracja tsconfig zweryfikowana.");',
        },
        hints: [
          'Użyj <div class="tsconfig-card">.',
          'Wstaw <code>"strict": true</code>.',
          'Dodaj tekst as const + satisfies: Enabled.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa tsconfig-card obecna', ruleType: 'html_contains', target: 'tsconfig-card' },
          { id: 'r2', description: 'Flaga "strict": true obecna', ruleType: 'html_contains', target: '"strict": true' },
          { id: 'r3', description: 'Informacja as const + satisfies: Enabled obecna', ruleType: 'html_contains', target: 'as const + satisfies: Enabled' },
        ],
      },
      independentTask: {
        title: 'Zastąpienie Enuma obiektem as const',
        instructions: 'Stwórz obiekt HTTP_STATUS = { OK: 200, CREATED: 201, NOT_FOUND: 404, SERVER_ERROR: 500 } as const i wyprowadź z niego typ HttpStatusCode reprezentujący wyłącznie wartości (200 | 201 | 404 | 500).',
        expectedOutcome: 'Czysty typ unii liczbowej bez narzutu kompilacji enum.',
        starterHint: 'type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];',
      },
      quiz: [
        {
          id: 'q-ts6-1',
          question: 'Co daje dopisanie `as const` na końcu definicji obiektu lub tablicy w TypeScript?',
          options: [
            'Czyni wszystkie właściwości głęboko tylko do odczytu (readonly) i zawęża ich typy ze zwykłych string/number do dokładnych wartości literałowych',
            'Konwertuje obiekt na ciąg znaków JSON',
            'Wysyła obiekt na serwer',
            'Usuwa wszystkie typy z obiektu',
          ],
          correctAnswer: 0,
          explanation: 'Dzięki as const tablica ["a", "b"] staje się readonly ["a", "b"] zamiast ogólnego string[].',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Wyłączanie flagi strict w tsconfig.json, gdy pojawia się dużo czerwonych podkreśleń',
          whyItHappens: 'Zniecierpliwienie początkującego programisty podczas migracji z JS do TS.',
          howToFix: 'Bez flagi strict TypeScript pozwala na ukryte wartości null/undefined i niejawne any, co niweczy sens jego używania. Zawsze pracuj z włączonym "strict": true.',
          badCode: '{ "compilerOptions": { "strict": false } }',
          goodCode: '{ "compilerOptions": { "strict": true, "noUncheckedIndexedAccess": true } }',
        },
      ],
      practicalTask: {
        title: 'Analiza pliku tsconfig.json w projekcie akademii',
        brief: 'Otwórz plik tsconfig.json w głównym katalogu aplikacji i sprawdź ustawienia target, moduleResolution oraz paths.',
        steps: ['Sprawdź alias ścieżek "@/*": ["./src/*"]', 'Zobacz opcję "noEmit": true', 'Uruchom npm run lint, który wykonuje tsc --noEmit'],
        deliverable: 'Świadome zarządzanie konfiguracją kompilatora w projekcie produkcyjnym.',
      },
      completionCriteria: [
        'Zrozumienie as const, keyof typeof, satisfies i tsconfig.json',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
  ],
};

