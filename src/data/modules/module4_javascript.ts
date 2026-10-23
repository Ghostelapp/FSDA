import { Module } from '../../types';

export const MODULE_4: Module = {
  id: 4,
  title: 'JavaScript — Logika i Interaktywność',
  category: 'Frontend',
  description: 'Zmienne (const, let), typy prymitywne i referencyjne, funkcje strzałkowe, manipulacja DOM, obsługa zdarzeń, asynchroniczność (Promises, async/await) i Fetch API.',
  badgeName: 'Czarodziej JavaScript',
  badgeIcon: 'Sparkles',
  durationHours: 48,
  totalXp: 1180,
  prerequisites: ['Moduł 2: HTML', 'Moduł 3: CSS'],
  topics: [
    'Typy danych, scope (zakres leksykalny), hoisting i operatory porównania',
    'Instrukcje warunkowe (if/else, switch), wartości Truthy/Falsy i operator Nullish Coalescing (??)',
    'Pętle (for, while, for...of) oraz podstawowe operacje na tablicach (push, pop, includes, slice)',
    'Funkcje od podstaw: deklaracja, parametry domyślne, return, Arrow Functions i Scope',
    'Obiekty, destrukturyzacja, operator Spread/Rest (...) oraz pamięć LocalStorage i JSON',
    'Funkcje wyższego rzędu, domknięcia (closures) i metody tablicowe (map, filter, reduce, find)',
    'Obiektowy model dokumentu (DOM): selektory querySelector, tworzenie i modyfikacja węzłów',
    'Architektura zdarzeń: Event Bubbling, Event Capturing i delegacja zdarzeń',
    'Programowanie asynchroniczne: Event Loop, Call Stack, Microtasks, obietnice Promise i async/await',
    'Pobieranie danych z sieci: Fetch API, nagłówki, parsowanie JSON i elegancka obsługa błędów try/catch',
  ],
  projectBrief: 'Projekt modułu: Aplikacja do zarządzania zadaniami TaskFlow z filtrowaniem, zapisem w LocalStorage i animacjami.',
  lessons: [
    {
      id: 'js-1',
      moduleId: 4,
      moduleTitle: 'JavaScript — Logika i Interaktywność',
      title: 'Zmienne (const, let), typy danych i operatory logiczne',
      slug: 'zmienne-typy-danych-operatory',
      durationMinutes: 30,
      xpReward: 60,
      order: 1,
      summary: 'Fundamenty JavaScriptu: pożegnanie z archaizmem var, zakres blokowy, prymitywy (string, number, boolean, null, undefined) oraz ścisłe porównania ===.',
      objectives: [
        'Zrozumieć różnicę między deklaracją const a let i wyeliminować var',
        'Rozróżniać typy prymitywne (wartości) od obiektów (referencje)',
        'Stosować ścisłe porównanie === zamiast niebezpiecznego ==',
      ],
      prerequisites: ['Podstawy logiki komputerowej'],
      theoryMarkdown: `W nowoczesnym standardzie ES6+ zmienne deklarujemy wyłącznie za pomocą **\`const\`** lub **\`let\`**:

- **\`const\` (stała):** Domyślny wybór w 95% przypadków. Wskaźnik referencji nie może zostać nadpisany inną wartością.
- **\`let\` (zmienna mutowalna):** Stosowany tylko wtedy, gdy wartość rzeczywiście będzie ponownie przypisywana (np. licznik pętli).
- **\`var\` (przestarzałe):** Posiada zakres funkcyjny i problematyczny hoisting — nie używamy go w nowoczesnym kodzie.

**Ścisłe porównanie (===) vs Luźne (==):**
Nigdy nie używaj operatora \`==\`! Wykonuje on niejawną konwersję typów (type coercion), prowadząc do absurdów:
\`\`\`javascript
0 == ''        // true (niebezpieczne!)
0 === ''       // false (prawidłowo)
null == undefined  // true
null === undefined // false
\`\`\`

**Template Literals (Szablony ciągów):**
Zamiast łączenia \`"Witaj " + name + "!"\` używamy znaków backtick: \`\`\` \`Witaj \${name}!\` \`\`\`.`,
      codeExamples: [
        {
          title: 'Bezpieczna deklaracja i łańcuchy szablonowe',
          language: 'javascript',
          code: `const userName = 'Jan';
let userScore = 100;

// Modyfikacja zmiennej let:
userScore += 50;

// Szablon tekstowy z interpolacją:
const greeting = \`Kursant \${userName} posiada aktualnie \${userScore} punktów XP.\`;
console.log(greeting);`,
          explanation: 'Interpolacja ${wyrażenie} jest czytelna i zapobiega błędom w formatowaniu tekstu.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Wybierz const jako domyślny zapis', description: 'Używaj const do obiektów, tablic i stałych.' },
        { step: 2, title: 'Używaj let tylko dla zmiennych liczników', description: 'Gdy wartość musi się zmienić.' },
        { step: 3, title: 'Zawsze porównuj potrójnym znakiem równości', description: 'Stosuj === oraz !==.' },
      ],
      interactiveExercise: {
        id: 'ex-js-1',
        title: 'Zadeklaruj zmienne i wyświetl wynik w konsoli',
        instructions: 'W pliku app.js zadeklaruj stałą const courseName = "Full Stack Academy"; oraz zmienną let lessonsCompleted = 5; a następnie wyświetl je za pomocą console.log().',
        task: 'Zadeklaruj courseName i lessonsCompleted oraz wywołaj console.log.',
        starterCode: {
          html: '<h1>JavaScript w akcji</h1>\n<p>Sprawdź zakładkę konsoli po prawej stronie!</p>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: '// Wpisz deklaracje zmiennych poniżej\n',
        },
        solutionCode: {
          html: '<h1>JavaScript w akcji</h1>\n<p>Sprawdź zakładkę konsoli po prawej stronie!</p>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: 'const courseName = "Full Stack Academy";\nlet lessonsCompleted = 5;\nconsole.log(courseName, lessonsCompleted);',
        },
        hints: [
          'Użyj const courseName = "Full Stack Academy";',
          'Użyj let lessonsCompleted = 5;',
          'Wywołaj console.log(courseName, lessonsCompleted);',
        ],
        rules: [
          { id: 'r1', description: 'Deklaracja stałej courseName', ruleType: 'js_contains', target: 'courseName' },
          { id: 'r2', description: 'Użycie słowa kluczowego const', ruleType: 'js_contains', target: 'const' },
          { id: 'r3', description: 'Wywołanie console.log obecne', ruleType: 'js_contains', target: 'console.log' },
        ],
      },
      independentTask: {
        title: 'Operator trójargumentowy (Ternary Operator)',
        instructions: 'Zapisz warunek sprawdzający czy score >= 80 i przypisz "Zaliczony" lub "Poprawka" za pomocą const status = score >= 80 ? "Zaliczony" : "Poprawka";.',
        expectedOutcome: 'Zwięzły zapis warunkowy w jednej linijce.',
        starterHint: 'Składnia: warunek ? prawda : fałsz.',
      },
      quiz: [
        {
          id: 'q-js1-1',
          question: 'Dlaczego w nowoczesnym JavaScript należy unikać słowa kluczowego "var"?',
          options: [
            'var posiada zakres funkcyjny i podlega hoistingowi, co prowadzi do trudnych do wykrycia błędów i wycieków zmiennych',
            'var nie obsługuje liczb dziesiętnych',
            'Zostało całkowicie usunięte z silnika V8 w Chrome',
            'Działa tylko w systemie Windows',
          ],
          correctAnswer: 0,
          explanation: 'var nie respektuje zakresu blokowego { } i "przecieka" poza pętle oraz instrukcje if.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Używanie operatora podwójnego == zamiast potrójnego ===',
          whyItHappens: 'Przeniesienie nawyków z innych języków programowania.',
          howToFix: 'W JS zawsze używaj === (ścisłe porównanie typu i wartości).',
          badCode: 'if (userInput == 0) { ... } // "" dopasuje się do 0!',
          goodCode: 'if (userInput === 0) { ... }',
        },
      ],
      practicalTask: {
        title: 'Testy w konsoli przeglądarki',
        brief: 'Otwórz konsolę DevTools i sprawdź typy danych operatorem typeof: typeof 42, typeof "tekst", typeof null.',
        steps: ['Wpisz w konsoli typeof "hej"', 'Wpisz typeof null (zwróci historyczny błąd: object)'],
        deliverable: 'Praktyczne oswojenie się z typami w JS.',
      },
      completionCriteria: [
        'Zrozumienie const, let i typów prymitywnych',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'js-6',
      moduleId: 4,
      moduleTitle: 'JavaScript — Logika i Interaktywność',
      title: 'Instrukcje warunkowe (if/else, switch), Truthy/Falsy i operator ??',
      slug: 'instrukcje-warunkowe-if-else-truthy-falsy',
      durationMinutes: 30,
      xpReward: 65,
      order: 2,
      summary: 'Naucz się sterować przepływem programu: podejmuj decyzje za pomocą if/else, poznaj 6 wartości Falsy w JavaScript oraz stosuj nowoczesny operator Nullish Coalescing (??) i Guard Clauses.',
      objectives: [
        'Budować czytelne rozgałęzienia decyzyjne if / else if / else oraz switch',
        'Znać na pamięć 6 wartości Falsy (false, 0, "", null, undefined, NaN)',
        'Rozróżniać operator logiczny || od operatora Nullish Coalescing ??',
      ],
      prerequisites: ['Lekcja 1: Zmienne i typy danych'],
      theoryMarkdown: `Program komputerowy nieustannie podejmuje decyzje: czy użytkownik jest zalogowany? Czy koszyk jest pusty? Czy subskrypcja wygasła?

**1. 6 wartości Falsy w JavaScript:**
W kontekście warunku \`if (wartość)\` tylko te 6 wartości jest traktowanych jako **fałsz (Falsy)**:
- \`false\`
- \`0\` (oraz \`-0\`, \`0n\`)
- \`""\` (pusty ciąg znaków)
- \`null\`
- \`undefined\`
- \`NaN\` (Not a Number)
**Wszystko inne jest Truthy (prawdziwe)** — w tym pusta tablica \`[]\` oraz pusty obiekt \`{}\`!

**2. Operator \`??\` (Nullish Coalescing) vs \`||\`:**
Gdy ustawiasz wartość domyślną:
\`\`\`javascript
const discount = 0;
console.log(discount || 10); // 10 (BŁĄD! 0 jest Falsy, więc || je odrzucił!)
console.log(discount ?? 10); // 0  (PRAWIDŁOWO! ?? reaguje tylko na null i undefined)
\`\`\`

**3. Wzorzec Guard Clause (Wczesny powrót):**
Zamiast zagnieżdżać 4 poziomy \`if { if { if } }\`, sprawdzaj warunki brzegowe na samym początku funkcji i wychodź przez \`return\`.`,
      codeExamples: [
        {
          title: 'Weryfikacja uprawnień z wzorcem Guard Clause i operatorem ??',
          language: 'javascript',
          code: `function checkAccess(userRole, userAge) {
  const role = userRole ?? 'guest';

  if (userAge < 18) {
    return 'Brak dostępu: wymagana pełnoletność';
  }

  if (role === 'admin') {
    return 'Pełny dostęp administratora';
  } else if (role === 'student') {
    return 'Dostęp do modułów kursowych';
  }

  return 'Dostęp demonstracyjny (Gość)';
}

console.log(checkAccess('student', 22));`,
          explanation: 'Sprawdzenie wieku na początku funkcji eliminuje głębokie zagnieżdżenia else.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zapisz warunek główny w if (...)', description: 'Używaj operatorów ===, !==, >=, <=.' },
        { step: 2, title: 'Obsłuż pozostałe przypadki w else if / else', description: 'Zadbaj o domyślną ścieżkę zapasową.' },
        { step: 3, title: 'Stosuj ?? dla wartości domyślnych', description: 'Chronisz w ten sposób poprawne wartości 0 oraz "".' },
      ],
      interactiveExercise: {
        id: 'ex-js-conditionals',
        title: 'Oceń wynik egzaminu za pomocą instrukcji if / else',
        instructions: 'W pliku app.js zadeklaruj const points = 85; a następnie użyj instrukcji if (points >= 70), aby wypisać w console.log("Egzamin zdany!"), a w bloku else wypisz "Wymagana poprawka".',
        task: 'Zastosuj instrukcję if / else sprawdzającą points >= 70.',
        starterCode: {
          html: '<h2>Kalkulator Wyniku Egzaminu</h2>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: 'const points = 85;\n// Dopisz instrukcję if / else poniżej:\n',
        },
        solutionCode: {
          html: '<h2>Kalkulator Wyniku Egzaminu</h2>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: 'const points = 85;\nif (points >= 70) {\n  console.log("Egzamin zdany!");\n} else {\n  console.log("Wymagana poprawka");\n}',
        },
        hints: [
          'Wpisz: if (points >= 70) { console.log("Egzamin zdany!"); }',
          'Dopisz: else { console.log("Wymagana poprawka"); }',
        ],
        rules: [
          { id: 'r1', description: 'Instrukcja warunkowa if użyta', ruleType: 'js_contains', target: 'if' },
          { id: 'r2', description: 'Blok else obecny', ruleType: 'js_contains', target: 'else' },
          { id: 'r3', description: 'Tekst "Egzamin zdany!" obecny', ruleType: 'js_contains', target: 'Egzamin zdany!' },
        ],
      },
      independentTask: {
        title: 'Instrukcja switch dla statusu zamówienia',
        instructions: 'Napisz instrukcję switch(orderStatus) obsługującą stany: "pending", "shipped", "delivered" oraz blok default.',
        expectedOutcome: 'Czytelna obsługa wielu dyskretnych stanów tekstowych.',
        starterHint: 'Pamiętaj o słowie kluczowym break; na końcu każdego bloku case.',
      },
      quiz: [
        {
          id: 'q-js6-1',
          question: 'Jaki wynik zwróci wyrażenie Boolean([]) (czyli wartość logiczna pustej tablicy w JS)?',
          options: [
            'false, ponieważ tablica jest pusta',
            'true! W JavaScript pusta tablica [] oraz pusty obiekt {} są wartościami Truthy (aby sprawdzić czy tablica jest pusta, badamy array.length === 0)',
            'undefined',
            'Wyrzuci błąd TypeError',
          ],
          correctAnswer: 1,
          explanation: 'To częsta pułapka na rozmowach rekrutacyjnych: if ([]) zawsze wykona się jako prawda! Zawsze sprawdzaj if (arr.length > 0).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Użycie pojedynczego znaku przypisania = zamiast porównania === wewnątrz if (x = 5)',
          whyItHappens: 'Literówka podczas szybkiego pisania warunku.',
          howToFix: 'Pojedynczy = nadpisuje zmienną wartością 5 i zwraca 5 (Truthy), więc warunek wykona się zawsze! Używaj ===.',
          badCode: 'if (userRole = "admin") { ... } // Nadpisuje rolę na admin!',
          goodCode: 'if (userRole === "admin") { ... }',
        },
      ],
      practicalTask: {
        title: 'Test operatora ?? w konsoli',
        brief: 'Porównaj w konsoli działanie 0 || 50 oraz 0 ?? 50.',
        steps: ['Wpisz w konsoli 0 || 50', 'Wpisz 0 ?? 50', 'Porównaj wyniki dla pustego stringa ""'],
        deliverable: 'Świadome stosowanie operatora Nullish Coalescing.',
      },
      completionCriteria: [
        'Zrozumienie if/else oraz 6 wartości Falsy',
        'Poprawne rozwiązanie ćwiczenia z egzaminem',
        'Zaliczenie quizu min. 80%',
      ],
    },
    {
      id: 'js-7',
      moduleId: 4,
      moduleTitle: 'JavaScript — Logika i Interaktywność',
      title: 'Pętle (for, while, for...of) i podstawowe operacje na tablicach',
      slug: 'petle-for-while-podstawy-tablic',
      durationMinutes: 35,
      xpReward: 70,
      order: 3,
      summary: 'Zanim przejdziesz do programowania funkcyjnego, opanuj fundament kolekcji danych: indeksowanie tablic od 0, metody push/pop/includes/slice oraz iterację pętlami for i for...of.',
      objectives: [
        'Tworzyć tablice i odczytywać elementy po indeksie (od 0 do array.length - 1)',
        'Dodawać, usuwać i wyszukiwać elementy metodami push(), pop(), includes(), indexOf(), slice()',
        'Iterować po kolekcjach za pomocą klasycznej pętli for oraz nowoczesnej pętli for (const item of items)',
      ],
      prerequisites: ['Lekcja 2: Instrukcje warunkowe'],
      theoryMarkdown: `**Tablica (Array)** to uporządkowana lista wartości przechowywana pod jedną zmienną.

**1. Indeksowanie od zera (Zero-based indexing):**
\`\`\`javascript
const techStack = ['HTML', 'CSS', 'JavaScript', 'React'];
console.log(techStack[0]); // 'HTML' (pierwszy element ma indeks 0!)
console.log(techStack.length); // 4
console.log(techStack[techStack.length - 1]); // 'React' (ostatni element)
\`\`\`

**2. Podstawowe metody tablicowe:**
- **\`push(el)\`** — dodaje element na koniec tablicy.
- **\`pop()\`** — usuwa i zwraca ostatni element.
- **\`includes(el)\`** — zwraca \`true\` lub \`false\`, sprawdzając czy element istnieje w tablicy.
- **\`slice(start, end)\`** — wycina fragment tablicy do NOWEJ tablicy bez psucia oryginału.

**3. Pętla \`for...of\` (ES6) vs klasyczne \`for\`:**
Gdy chcesz przejść po każdym elemencie tablicy od początku do końca, najczytelniejsza jest pętla **\`for...of\`**:
\`\`\`javascript
for (const tech of techStack) {
  console.log(\`Uczę się technologii: \${tech}\`);
}
\`\`\``,
      codeExamples: [
        {
          title: 'Zliczanie sumy wydatków za pomocą pętli for...of',
          language: 'javascript',
          code: `const expenses = [45, 120, 30, 85];
let total = 0;

for (const amount of expenses) {
  total += amount;
}

console.log(\`Liczba transakcji: \${expenses.length}, Suma: \${total} zł\`);`,
          explanation: 'W każdym obiegu pętli zmienna amount przyjmuje kolejną liczbę z tablicy expenses.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Utwórz tablicę w nawiasach kwadratowych []', description: 'Oddziel kolejne elementy przecinkami.' },
        { step: 2, title: 'Sprawdź obecność elementu metodą .includes()', description: 'Unikaj ręcznego pisania pętli tylko po to, by sprawdzić czy wartość istnieje.' },
        { step: 3, title: 'Użyj pętli for...of do przejścia po kolekcji', description: 'Stosuj const item of array dla bezpieczeństwa i czytelności.' },
      ],
      interactiveExercise: {
        id: 'ex-js-loops',
        title: 'Przeiteruj po tablicy modułów za pomocą pętli i wypisz je w konsoli',
        instructions: 'W pliku app.js utwórz tablicę const modules = ["HTML", "CSS", "JS"]; a następnie użyj pętli for (lub for...of), aby wypisać elementy za pomocą console.log().',
        task: 'Zdefiniuj tablicę modules i użyj pętli for do wypisania jej elementów w console.log.',
        starterCode: {
          html: '<h2>Iteracja po tablicy w JS</h2>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: '// Zdefiniuj tablicę modules i pętlę for poniżej:\n',
        },
        solutionCode: {
          html: '<h2>Iteracja po tablicy w JS</h2>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: 'const modules = ["HTML", "CSS", "JS"];\nfor (const mod of modules) {\n  console.log(mod);\n}',
        },
        hints: [
          'Zadeklaruj: const modules = ["HTML", "CSS", "JS"];',
          'Napisz pętlę: for (const mod of modules) { console.log(mod); }',
        ],
        rules: [
          { id: 'r1', description: 'Tablica modules zdefiniowana', ruleType: 'js_contains', target: 'modules' },
          { id: 'r2', description: 'Pętla for obecna w kodzie', ruleType: 'js_contains', target: 'for' },
          { id: 'r3', description: 'Wywołanie console.log wewnątrz skryptu', ruleType: 'js_contains', target: 'console.log' },
        ],
      },
      independentTask: {
        title: 'Filtrowanie duplikatów za pomocą includes()',
        instructions: 'Napisz pętlę, która przepisuje elementy z tablicy [1, 2, 2, 3, 1] do nowej tablicy unique tylko wtedy, gdy !unique.includes(item).',
        expectedOutcome: 'Zrozumienie algorytmicznego usuwania duplikatów.',
        starterHint: 'Sprawdź warunek if (!unique.includes(num)) unique.push(num);',
      },
      quiz: [
        {
          id: 'q-js7-1',
          question: 'Jaki indeks ma ostatni element tablicy posiadającej 10 elementów (array.length === 10)?',
          options: [
            '10',
            '9 (ponieważ indeksowanie w JavaScript zawsze zaczyna się od 0)',
            '11',
            '-1',
          ],
          correctAnswer: 1,
          explanation: 'Elementy tablicy 10-elementowej mają indeksy od 0 do 9. Odwołanie do array[10] zwróci undefined.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Nieskończona pętla while (Infinite Loop) zawieszająca kartę przeglądarki',
          whyItHappens: 'Zapomnienie o zwiększaniu licznika (np. i++) wewnątrz pętli while (i < 10).',
          howToFix: 'Zawsze upewnij się, że warunek pętli w końcu stanie się fałszywy, lub preferuj pętle for...of.',
          badCode: 'let i = 0;\nwhile (i < 5) { console.log(i); } // Zawiesi przeglądarkę!',
          goodCode: 'let i = 0;\nwhile (i < 5) { console.log(i); i++; }',
        },
      ],
      practicalTask: {
        title: 'Klasyczne zadanie rekrutacyjne FizzBuzz',
        brief: 'Napisz pętlę od 1 do 15 wypisującą "Fizz" dla liczb podzielnych przez 3 (i % 3 === 0), "Buzz" dla podzielnych przez 5 oraz "FizzBuzz" dla podzielnych przez obie.',
        steps: ['Stwórz pętlę for (let i = 1; i <= 15; i++)', 'Sprawdź najpierw podzielność przez 15, potem 3, potem 5'],
        deliverable: 'Rozwiązanie najsłynniejszego zadania algorytmicznego dla Juniorów.',
      },
      completionCriteria: [
        'Zrozumienie indeksowania tablic i pętli for / for...of',
        'Poprawne rozwiązanie ćwiczenia z iteracją',
        'Zaliczenie quizu min. 80%',
      ],
    },
    {
      id: 'js-8',
      moduleId: 4,
      moduleTitle: 'JavaScript — Logika i Interaktywność',
      title: 'Funkcje od podstaw: deklaracja, parametry, return, Arrow Functions i Scope',
      slug: 'funkcje-parametry-return-arrow-functions',
      durationMinutes: 35,
      xpReward: 70,
      order: 4,
      summary: 'Naucz się zamykać logikę w wielokrotnego użytku funkcje. Poznaj różnicę między console.log a instrukcją return, parametry domyślne, funkcje strzałkowe (=>) oraz zasięg zmiennych (Scope).',
      objectives: [
        'Deklarować funkcje przyjmujące parametry i zwracające wynik przez słowo kluczowe return',
        'Przepisywać tradycyjne funkcje na zwięzłe funkcje strzałkowe (Arrow Functions)',
        'Rozumieć różnicę między zasięgiem globalnym a lokalnym (Block & Function Scope)',
      ],
      prerequisites: ['Lekcja 3: Pętle i tablice'],
      theoryMarkdown: `Funkcje to podstawowe cegiełki architektury aplikacji — pozwalają napisać logikę raz i wywoływać ją setki razy z różnymi danymi.

**1. \`return\` vs \`console.log\` (Kluczowa różnica dla początkujących!):**
- \`console.log()\` tylko wyświetla napis w konsoli deweloperskiej i zwraca \`undefined\`.
- **\`return\`** przekazuje obliczoną wartość z powrotem do miejsca, w którym funkcja została wywołana, i **natychmiast kończy działanie funkcji**.

**2. Trzy sposoby zapisu funkcji:**
\`\`\`javascript
// 1. Klasyczna deklaracja funkcji:
function add(a, b = 0) {
  return a + b;
}

// 2. Funkcja strzałkowa (Arrow Function — ES6):
const multiply = (a, b) => {
  return a * b;
};

// 3. Skrócona funkcja strzałkowa z niejawnym return (Implicit Return):
const square = (n) => n * n;
\`\`\`

**3. Zasięg zmiennych (Scope):**
Zmienna zadeklarowana wewnątrz funkcji lub bloku \`{ }\` za pomocą \`const\`/\`let\` jest **lokalna** — nie jest widoczna na zewnątrz tej funkcji.`,
      codeExamples: [
        {
          title: 'Funkcja obliczająca cenę brutto z domyślną stawką VAT',
          language: 'javascript',
          code: `const calculateGrossPrice = (netPrice, taxRate = 0.23) => {
  const gross = netPrice * (1 + taxRate);
  return Number(gross.toFixed(2));
};

const laptopPrice = calculateGrossPrice(3000); // Użyje domyślnego 23% VAT -> 3690
const bookPrice = calculateGrossPrice(100, 0.05); // Użyje 5% VAT -> 105
console.log(laptopPrice, bookPrice);`,
          explanation: 'Parametr domyślny taxRate = 0.23 zadziała automatycznie, jeśli przy wywołaniu nie podamy drugiego argumentu.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Nazwij funkcję czasownikiem', description: 'Np. calculateTotal, formatUserName, validateEmail.' },
        { step: 2, title: 'Zdefiniuj parametry wejściowe w nawiasach ()', description: 'Możesz nadać im wartości domyślne.' },
        { step: 3, title: 'Zwróć wynik instrukcją return', description: 'Przypisz wynik wywołania funkcji do nowej zmiennej.' },
      ],
      interactiveExercise: {
        id: 'ex-js-functions',
        title: 'Napisz funkcję obliczającą pole prostokąta z instrukcją return',
        instructions: 'Zdefiniuj funkcję (klasyczną lub strzałkową) o nazwie calculateArea, która przyjmuje parametry (width, height) i zwraca ich iloczyn za pomocą return. Następnie wywołaj ją w console.log(calculateArea(5, 4)).',
        task: 'Stwórz funkcję calculateArea z instrukcją return i wywołaj ją w console.log.',
        starterCode: {
          html: '<h2>Funkcje i wartość zwracana (return)</h2>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: '// Napisz funkcję calculateArea poniżej:\n',
        },
        solutionCode: {
          html: '<h2>Funkcje i wartość zwracana (return)</h2>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: 'function calculateArea(width, height) {\n  return width * height;\n}\nconsole.log(calculateArea(5, 4));',
        },
        hints: [
          'Wpisz: function calculateArea(width, height) { return width * height; }',
          'Wywołaj: console.log(calculateArea(5, 4));',
        ],
        rules: [
          { id: 'r1', description: 'Funkcja calculateArea zdefiniowana', ruleType: 'js_contains', target: 'calculateArea' },
          { id: 'r2', description: 'Słowo kluczowe return lub funkcja strzałkowa => obecne', ruleType: 'js_contains', target: 'calculateArea(' },
          { id: 'r3', description: 'Wypisanie wyniku w console.log', ruleType: 'js_contains', target: 'console.log' },
        ],
      },
      independentTask: {
        title: 'Konwersja na jednoliniową funkcję strzałkową',
        instructions: 'Przepisz funkcję calculateArea do postaci const calculateArea = (w, h) => w * h;',
        expectedOutcome: 'Biegłość w zapisie Arrow Functions używanym w każdym komponencie React.',
        starterHint: 'Gdy po strzałce => nie ma nawiasów klamrowych {}, wartość wyrażenia jest zwracana automatycznie.',
      },
      quiz: [
        {
          id: 'q-js8-1',
          question: 'Co zwraca funkcja w JavaScript, jeśli nie umieścimy w niej słowa kluczowego return?',
          options: [
            'Zwraca liczbę 0',
            'Zwraca wartość undefined',
            'Zwraca pusty tekst ""',
            'Powoduje błąd kompilacji',
          ],
          correctAnswer: 1,
          explanation: 'Każda funkcja bez instrukcji return domyślnie zwraca wartość undefined.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Pisanie kodu pod instrukcją return w tym samym bloku (Unreachable Code)',
          whyItHappens: 'Niezrozumienie, że return natychmiast przerywa wykonywanie funkcji.',
          howToFix: 'Wszystkie operacje muszą znaleźć się przed instrukcją return.',
          badCode: 'function test() {\n  return 10;\n  console.log("To nigdy się nie wykona!");\n}',
          goodCode: 'function test() {\n  console.log("Obliczam...");\n  return 10;\n}',
        },
      ],
      practicalTask: {
        title: 'Walidator hasła jako czysta funkcja',
        brief: 'Napisz funkcję isPasswordStrong(password), która zwraca true, jeśli password.length >= 8 oraz password.includes("!").',
        steps: ['Przyjmij parametr password', 'Zwróć wynik operatora logicznego &&'],
        deliverable: 'Funkcja pomocnicza gotowa do użycia w formularzu rejestracji.',
      },
      completionCriteria: [
        'Rozróżnianie return od console.log',
        'Opanowanie składni deklaracji funkcji i Arrow Functions',
        'Zaliczenie quizu min. 80%',
      ],
    },
    {
      id: 'js-9',
      moduleId: 4,
      moduleTitle: 'JavaScript — Logika i Interaktywność',
      title: 'Obiekty, destrukturyzacja, operator Spread (...) oraz LocalStorage',
      slug: 'obiekty-destrukturyzacja-spread-localstorage',
      durationMinutes: 40,
      xpReward: 75,
      order: 5,
      summary: 'Poznaj struktury klucz-wartość (Objects), nowoczesną składnię destrukturyzacji i kopiowania obiektów operatorem ...spread oraz trwały zapis danych w przeglądarce za pomocą localStorage.',
      objectives: [
        'Tworzyć i modyfikować obiekty { key: value } oraz zagnieżdżone struktury danych',
        'Wyciągać właściwości za pomocą destrukturyzacji const { name, role } = user;',
        'Tworzyć niemutowalne kopie obiektów i tablic operatorem Spread (...) oraz zapisywać dane w localStorage',
      ],
      prerequisites: ['Lekcja 4: Funkcje od podstaw'],
      theoryMarkdown: `W prawdziwych aplikacjach (i w React!) 99% danych z serwera przychodzi w postaci **obiektów** oraz **tablic obiektów**.

**1. Destrukturyzacja obiektów (Object Destructuring):**
Zamiast pisać w kółko \`user.name\`, \`user.email\`, \`user.role\`, rozpakowujemy właściwości w jednej linijce:
\`\`\`javascript
const user = { id: 1, name: 'Anna', role: 'Admin', xp: 1200 };
const { name, role } = user;
console.log(name, role); // 'Anna', 'Admin'
\`\`\`

**2. Operator Spread (\`...\`) — bezpieczne kopiowanie i aktualizacja:**
Obiekty są typami referencyjnymi. Aby stworzyć zaktualizowaną kopię obiektu bez psucia oryginału (fundament stanu w React!):
\`\`\`javascript
const updatedUser = { ...user, xp: 1350 };
\`\`\`

**3. Pamięć podręczna \`localStorage\` i \`JSON\`:**
\`localStorage\` pozwala trwale zapisać dane w przeglądarce użytkownika (nie znikają po odświeżeniu strony!):
\`\`\`javascript
// Zapis obiektu (zamiana na tekst JSON):
localStorage.setItem('profile', JSON.stringify(updatedUser));

// Odczyt (zamiana tekstu JSON z powrotem na obiekt JS):
const saved = JSON.parse(localStorage.getItem('profile'));
\`\`\``,
      codeExamples: [
        {
          title: 'Zarządzanie ustawieniami użytkownika z destrukturyzacją i Spread',
          language: 'javascript',
          code: `const defaultSettings = {
  theme: 'dark',
  notifications: true,
  dailyGoalMinutes: 30,
};

// Nadpisanie wybranej właściwości za pomocą operatora Spread (...):
const userSettings = {
  ...defaultSettings,
  dailyGoalMinutes: 60,
};

const { theme, dailyGoalMinutes } = userSettings;
console.log(\`Motyw: \${theme}, Cel dzienny: \${dailyGoalMinutes} min\`);`,
          explanation: 'Operator ...defaultSettings kopiuje wszystkie dotychczasowe klucze, a kolejna linia nadpisuje dailyGoalMinutes.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zdefiniuj obiekt w nawiasach klamrowych {}', description: 'Grupuj powiązane cechy jednego bytu (np. kursanta, produktu).' },
        { step: 2, title: 'Rozpakuj potrzebne klucze destrukturyzacją', description: 'Użyj const { pole1, pole2 } = obiekt;.' },
        { step: 3, title: 'Serializuj dane przez JSON.stringify przy zapisie', description: 'localStorage przechowuje wyłącznie wartości tekstowe (string).' },
      ],
      interactiveExercise: {
        id: 'ex-js-objects',
        title: 'Zbuduj obiekt kursanta i wyciągnij jego dane destrukturyzacją',
        instructions: 'W pliku app.js utwórz obiekt const student = { name: "Kamil", level: 4 }; a następnie użyj destrukturyzacji lub odwołania student.name i wypisz dane w console.log().',
        task: 'Zdefiniuj obiekt student z polami name i level oraz wypisz je w console.log.',
        starterCode: {
          html: '<h2>Obiekty i Destrukturyzacja ES6+</h2>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: '// Utwórz obiekt student poniżej:\n',
        },
        solutionCode: {
          html: '<h2>Obiekty i Destrukturyzacja ES6+</h2>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: 'const student = { name: "Kamil", level: 4 };\nconst { name, level } = student;\nconsole.log(name, level);',
        },
        hints: [
          'Zadeklaruj: const student = { name: "Kamil", level: 4 };',
          'Rozpakuj: const { name, level } = student;',
          'Wywołaj: console.log(name, level);',
        ],
        rules: [
          { id: 'r1', description: 'Obiekt student zdefiniowany', ruleType: 'js_contains', target: 'student' },
          { id: 'r2', description: 'Właściwość name obecna', ruleType: 'js_contains', target: 'name' },
          { id: 'r3', description: 'Wypisanie wyniku w console.log', ruleType: 'js_contains', target: 'console.log' },
        ],
      },
      independentTask: {
        title: 'Zapis i odczyt tablicy zadań w localStorage',
        instructions: 'Zapisz tablicę obiektów todos w localStorage pod kluczem "my_todos" z użyciem JSON.stringify(), a następnie odczytaj ją przez JSON.parse().',
        expectedOutcome: 'Trwałość danych w aplikacji po zamknięciu i ponownym otwarciu karty przeglądarki.',
        starterHint: 'localStorage.setItem("my_todos", JSON.stringify(todos))',
      },
      quiz: [
        {
          id: 'q-js9-1',
          question: 'Dlaczego przed zapisaniem obiektu w localStorage musimy użyć funkcji JSON.stringify(obiekt)?',
          options: [
            'Ponieważ localStorage potrafi przechowywać wyłącznie ciągi znaków (string), a zapisanie surowego obiektu zamieniłoby go w bezużyteczny napis "[object Object]"',
            'Aby zaszyfrować hasła przed hakerami',
            'Ponieważ bez tego przeglądarka zablokuje plik CSS',
            'Jest to wymóg bazy PostgreSQL',
          ],
          correctAnswer: 0,
          explanation: 'Próba wywołania localStorage.setItem("user", { name: "Jan" }) zapisze string "[object Object]". Zawsze serializujemy obiekty przez JSON.stringify.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Kopiowanie obiektu przez zwykłe przypisanie const copy = original;',
          whyItHappens: 'Brak świadomości, że obiekty przypisywane są przez referencję (wskaźnik do tego samego miejsca w pamięci RAM).',
          howToFix: 'Użyj operatora Spread const copy = { ...original }; lub nowoczesnej funkcji structuredClone(original).',
          badCode: 'const copy = user;\ncopy.name = "Zmiana"; // Zmodyfikuje również oryginalny obiekt user!',
          goodCode: 'const copy = { ...user, name: "Zmiana" }; // Oryginał pozostaje nietknięty',
        },
      ],
      practicalTask: {
        title: 'Inspekcja LocalStorage w DevTools',
        brief: 'Otwórz zakładkę Application -> Local Storage w narzędziach deweloperskich Chrome i sprawdź klucze zapisane przez naszą Akademię.',
        steps: ['Naciśnij F12 -> Application', 'Rozwiń Local Storage po lewej stronie', 'Zobacz zapisany postęp JSON'],
        deliverable: 'Praktyczne zrozumienie pamięci przeglądarkowej.',
      },
      completionCriteria: [
        'Zrozumienie obiektów, destrukturyzacji i operatora Spread (...)',
        'Opanowanie serializacji JSON i localStorage',
        'Zaliczenie quizu min. 80%',
      ],
    },
    {
      id: 'js-2',
      moduleId: 4,
      moduleTitle: 'JavaScript — Logika i Interaktywność',
      title: 'Funkcje wyższego rzędu i metody tablic: map, filter, reduce',
      slug: 'metody-tablic-map-filter-reduce',
      durationMinutes: 40,
      xpReward: 80,
      order: 6,
      summary: 'Koniec z ręcznym pisaniem pętli for! Opanuj programowanie deklaratywne: transformację danych metodą map(), filtrowanie kolekcji metodą filter() oraz agregację z reduce().',
      objectives: [
        'Pisać zwięzłe funkcje strzałkowe (Arrow Functions) z niejawnym return',
        'Filtrować i transformować tablice obiektów za pomocą map() i filter()',
        'Obliczać sumy i statystyki za pomocą metody reduce()',
      ],
      prerequisites: ['Lekcja 1: Zmienne i typy danych'],
      theoryMarkdown: `Nowoczesny JavaScript stawia na **programowanie funkcyjne** i niemutowalne operacje na tablicach.

Zamiast pętli imperatywnej:
\`\`\`javascript
// IMPERATYWNIE (stary styl):
const passed = [];
for (let i = 0; i < scores.length; i++) {
  if (scores[i] >= 80) passed.push(scores[i]);
}
\`\`\`

Piszemy **deklaratywnie**:
\`\`\`javascript
// DEKLARATYWNIE (nowoczesny standard):
const passed = scores.filter(score => score >= 80);
\`\`\`

**3 królewskie metody tablic:**
1. **\`map(item => newItem)\`**: Zwraca NOWĄ tablicę o tej samej długości, transformując każdy element (np. wyciągając same imiona).
2. **\`filter(item => boolean)\`**: Zwraca NOWĄ tablicę zawierającą tylko te elementy, które spełniają warunek.
3. **\`reduce((acc, curr) => newAcc, initVal)\`**: Agreguje tablicę do pojedynczej wartości (np. suma cen w koszyku).`,
      codeExamples: [
        {
          title: 'Łączenie metod tablicowych w potok (Chaining)',
          language: 'javascript',
          code: `const students = [
  { name: 'Jan', xp: 220, active: true },
  { name: 'Anna', xp: 680, active: true },
  { name: 'Piotr', xp: 120, active: false }
];

// Wybierz tylko aktywnych kursantów i policz ich łączne XP:
const totalActiveXp = students
  .filter(student => student.active)
  .reduce((sum, student) => sum + student.xp, 0);

console.log("Łączne XP aktywnych:", totalActiveXp); // 900`,
          explanation: 'Metody map i filter nie modyfikują oryginalnej tablicy, gwarantując niezmienność (immutability).',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Użyj filter do odrzucenia zbędnych danych', description: 'Zwróć true dla elementów, które chcesz zachować.' },
        { step: 2, title: 'Użyj map do modyfikacji struktury', description: 'Przekształć obiekt do nowego formatu.' },
        { step: 3, title: 'Użyj reduce do zsumowania wartości', description: 'Zawsze podaj wartość początkową akumulatora (np. 0).' },
      ],
      interactiveExercise: {
        id: 'ex-js-2',
        title: 'Przekształć i przefiltruj tablicę ocen',
        instructions: 'W pliku app.js zdefiniuj tablicę const scores = [65, 82, 95, 45, 90]; a następnie za pomocą metody filter() stwórz tablicę passedScores zawierającą oceny >= 80 i wypisz ją w console.log().',
        task: 'Przefiltruj tablicę scores metodą filter do zmiennej passedScores.',
        starterCode: {
          html: '<h2>Test Ocen Kursantów</h2>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: 'const scores = [65, 82, 95, 45, 90];\n// Użyj .filter() poniżej\n',
        },
        solutionCode: {
          html: '<h2>Test Ocen Kursantów</h2>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: 'const scores = [65, 82, 95, 45, 90];\nconst passedScores = scores.filter(score => score >= 80);\nconsole.log(passedScores);',
        },
        hints: [
          'Użyj const passedScores = scores.filter(score => score >= 80);',
          'Wypisz wynik: console.log(passedScores);',
        ],
        rules: [
          { id: 'r1', description: 'Wywołanie metody filter', ruleType: 'js_contains', target: '.filter(' },
          { id: 'r2', description: 'Zmienna passedScores obecna', ruleType: 'js_contains', target: 'passedScores' },
          { id: 'r3', description: 'Warunek progu 80 w kodzie', ruleType: 'js_contains', target: '80' },
        ],
      },
      independentTask: {
        title: 'Formatowanie cen walutowych',
        instructions: 'Użyj .map() aby przekształcić tablicę liczb [10, 20, 50] w format ["10 zł", "20 zł", "50 zł"].',
        expectedOutcome: 'Płynne łączenie wartości liczbowej z jednostką.',
        starterHint: 'prices.map(p => `${p} zł`)',
      },
      quiz: [
        {
          id: 'q-js2-1',
          question: 'Czy metoda .map() modyfikuje oryginalną tablicę, na której została wywołana?',
          options: [
            'Tak, bezpośrednio zamienia wartości w istniejącej tablicy',
            'Nie, tworzy i zwraca całkowicie nową tablicę z wynikami transformacji',
            'Tylko jeśli tablica zawiera same stringi',
            'Zależy od wersji przeglądarki',
          ],
          correctAnswer: 1,
          explanation: '.map() jest czystą funkcją i nigdy nie modyfikuje wejściowej tablicy (zasada immutability).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Zapominanie o wartości początkowej w metodzie .reduce()',
          whyItHappens: 'Przeoczenie drugiego parametru funkcji reduce.',
          howToFix: 'Zawsze jawnie podawaj wartość początkową (np. 0 dla liczb, [] dla tablic, {} dla obiektów), aby uniknąć błędów przy pustej kolekcji.',
          badCode: 'arr.reduce((acc, val) => acc + val.price); // Wyrzuci błąd przy pustej tablicy!',
          goodCode: 'arr.reduce((acc, val) => acc + val.price, 0);',
        },
      ],
      practicalTask: {
        title: 'Podsumowanie koszyka w e-commerce',
        brief: 'Przetestuj reduce() do obliczenia łącznej kwoty zamówienia z podatkiem VAT.',
        steps: ['Zdefiniuj tablicę pozycji koszyka', 'Zsumuj kwoty z reduce', 'Wypisz sformatowany wynik'],
        deliverable: 'Praktyczne zastosowanie agregacji danych biznesowych.',
      },
      completionCriteria: [
        'Zrozumienie działania map, filter i reduce',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'js-3',
      moduleId: 4,
      moduleTitle: 'JavaScript — Logika i Interaktywność',
      title: 'Manipulacja DOM i delegacja zdarzeń (addEventListener)',
      slug: 'manipulacja-dom-delegacja-zdarzen',
      durationMinutes: 40,
      xpReward: 80,
      order: 3,
      summary: 'Połącz kod logiczny z interfejsem użytkownika: selektory querySelector, modyfikacja tekstu i klas CSS, obsługa kliknięć oraz potężny wzorzec delegacji zdarzeń (Event Delegation).',
      objectives: [
        'Pobierać i modyfikować elementy drzewa DOM: querySelector, textContent, classList.toggle',
        'Rejestrować zdarzenia za pomocą element.addEventListener("click", handler)',
        'Stosować delegację zdarzeń (Event Delegation) na rodzicu zamiast 100 osobnych nasłuchiwaczy',
      ],
      prerequisites: ['Moduł 2: HTML', 'Lekcja 1 i 2 modułu JS'],
      theoryMarkdown: `**DOM (Document Object Model)** to obiektowa reprezentacja dokumentu HTML w pamięci przeglądarki. Za pomocą JavaScript możemy w ułamku sekundy zmieniać treść, kolory i układ elementów.

**Podstawowe metody:**
- \`document.querySelector('.moja-klasa')\` — pobiera pierwszy pasujący element (zwraca \`Element\` lub \`null\`).
- \`document.querySelectorAll('button')\` — pobiera kolekcję węzłów (\`NodeList\`).
- \`element.textContent = "Nowy tekst"\` — bezpiecznie zmienia tekst (chroni przed atakami XSS!).
- \`element.classList.add('active')\` / \`remove\` / \`toggle\` — modyfikuje klasy CSS.

**Zdarzenia i Delegacja (Event Delegation):**
Zamiast przypinać 50 nasłuchiwaczy do każdego elementu \`<li>\` z osobna, przypinamy **jeden** nasłuchiwacz do listy nadrzędnej \`<ul>\` i wykorzystujemy mechanizm bąbelkowania (**Event Bubbling**):
\`\`\`javascript
const list = document.querySelector('.todo-list');

list.addEventListener('click', (event) => {
  // Sprawdź czy kliknięto w przycisk usuwania:
  if (event.target.matches('.delete-btn')) {
    const item = event.target.closest('li');
    item.remove();
  }
});
\`\`\``,
      codeExamples: [
        {
          title: 'Interaktywny licznik kliknięć w czystym JS',
          language: 'javascript',
          code: `const btn = document.querySelector('#counter-btn');
const display = document.querySelector('#counter-val');
let count = 0;

btn.addEventListener('click', () => {
  count++;
  display.textContent = count;
  display.classList.toggle('high-score', count >= 10);
});`,
          explanation: 'Zdarzenie click aktualizuje zmienną stanu count i natychmiast odzwierciedla zmianę w DOM.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zlokalizuj element w DOM', description: 'Użyj document.querySelector z selektorem CSS.' },
        { step: 2, title: 'Zarejestruj nasłuchiwacz zdarzenia', description: 'Skorzystaj z addEventListener("click", callback).' },
        { step: 3, title: 'Zaktualizuj interfejs użytkownika', description: 'Zmień textContent lub classList.' },
      ],
      interactiveExercise: {
        id: 'ex-js-3',
        title: 'Podepnij zdarzenie kliknięcia i zmień tekst nagłówka',
        instructions: 'W pliku app.js pobierz przycisk document.querySelector("#actionBtn") oraz nagłówek #headingTitle. Po kliknięciu w przycisk zmień tekst nagłówka na "Zadanie Wykonane!".',
        task: 'Użyj addEventListener na #actionBtn i zmień textContent w #headingTitle.',
        starterCode: {
          html: '<h2 id="headingTitle">Kliknij przycisk poniżej</h2>\n<button id="actionBtn" type="button">Zmień nagłówek</button>',
          css: 'body { font-family: sans-serif; padding: 20px; }\nbutton { background: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }',
          js: '// Wpisz kod obsługi zdarzenia poniżej\n',
        },
        solutionCode: {
          html: '<h2 id="headingTitle">Kliknij przycisk poniżej</h2>\n<button id="actionBtn" type="button">Zmień nagłówek</button>',
          css: 'body { font-family: sans-serif; padding: 20px; }\nbutton { background: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }',
          js: 'const btn = document.querySelector("#actionBtn");\nconst title = document.querySelector("#headingTitle");\nbtn.addEventListener("click", () => {\n  title.textContent = "Zadanie Wykonane!";\n});',
        },
        hints: [
          'Użyj const btn = document.querySelector("#actionBtn");',
          'Dodaj btn.addEventListener("click", () => { ... });',
          'W środku funkcji ustaw title.textContent = "Zadanie Wykonane!";',
        ],
        rules: [
          { id: 'r1', description: 'Pobranie elementu querySelector', ruleType: 'js_contains', target: 'document.querySelector' },
          { id: 'r2', description: 'Rejestracja addEventListener z click', ruleType: 'js_contains', target: 'addEventListener' },
          { id: 'r3', description: 'Zmiana właściwości textContent', ruleType: 'js_contains', target: 'textContent' },
        ],
      },
      independentTask: {
        title: 'Przełącznik motywu z classList.toggle',
        instructions: 'Napisz funkcję przełączającą klasę "dark-mode" na elemencie document.body po naciśnięciu przycisku.',
        expectedOutcome: 'Płynna zmiana stylu całej witryny jednym kliknięciem.',
        starterHint: 'document.body.classList.toggle("dark-mode")',
      },
      quiz: [
        {
          id: 'q-js3-1',
          question: 'Dlaczego do wstawiania tekstu z formularza należy używać .textContent zamiast .innerHTML?',
          options: [
            '.textContent zapobiega atakom typu XSS (Cross-Site Scripting), traktując wpisany kod HTML jako zwykły tekst',
            '.innerHTML działa tylko w przeglądarce Safari',
            '.textContent automatycznie tłumaczy tekst na język angielski',
            '.innerHTML jest zakazane przez W3C',
          ],
          correctAnswer: 0,
          explanation: 'Wstawienie wrogiego skryptu przez innerHTML może doprowadzić do przejęcia ciasteczek sesyjnych użytkownika.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Stosowanie przestarzałych atrybutów inline: onclick="klik()" w HTML',
          whyItHappens: 'Wzorce z archaicznych samouczków z początku XXI wieku.',
          howToFix: 'Zawsze rozdzielaj strukturę (HTML) od zachowania (JS) za pomocą addEventListener w osobnym pliku.',
          badCode: '<button onclick="handleClick()">Zapisz</button>',
          goodCode: 'btn.addEventListener("click", handleClick);',
        },
      ],
      practicalTask: {
        title: 'Dynamiczna lista zadań Todo',
        brief: 'Zbuduj pole input z przyciskiem "Dodaj" tworzące dynamicznie nowe elementy <li> w liście <ul> z możliwością usuwania.',
        steps: ['Pobierz formularz i listę', 'Obsłuż zdarzenie submit z e.preventDefault()', 'Utwórz document.createElement("li")'],
        deliverable: 'Podstawowa interaktywna aplikacja Todo.',
      },
      completionCriteria: [
        'Zrozumienie selektorów i modyfikacji DOM',
        'Prawidłowe obsłużenie zdarzenia addEventListener',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'js-4',
      moduleId: 4,
      moduleTitle: 'JavaScript — Logika i Interaktywność',
      title: 'Asynchroniczność: Event Loop, obietnice Promise i async/await',
      slug: 'asynchronicznosc-event-loop-promises',
      durationMinutes: 45,
      xpReward: 90,
      order: 4,
      summary: 'Przeglądarka ma tylko jeden główny wątek (Single Threaded), a mimo to obsługuje animacje, kliknięcia i pobieranie plików w tle. Poznaj mechanizm Event Loop, Microtask Queue, obiekt Promise oraz składnię async/await.',
      objectives: [
        'Zrozumieć architekturę Event Loop: Call Stack, Web APIs, Callback Queue, Microtask Queue',
        'Tworzyć i konsumować obiekty Promise (resolve, reject, .then(), .catch())',
        'Pisać synchronicznie wyglądający kod asynchroniczny z użyciem słów kluczowych async i await',
      ],
      prerequisites: ['Lekcje 1-3 z modułu JS'],
      theoryMarkdown: `JavaScript jest **jednowątkowy** — wykonuje jedną operację w danym momencie. 

Gdyby pobieranie danych z serwera (trwające np. 2 sekundy) blokowało wątek główny, interfejs przeglądarki całkowicie by zamarzł (brak reakcji na kliknięcia, kursor myszy).

**Rozwiązanie: Pętla Zdarzeń (Event Loop)**
1. **Call Stack (Stos wywołań):** Wykonuje bieżące funkcje synchroniczne.
2. **Web APIs (Przeglądarka):** Przejmuje zadania długotrwałe w tle (timery \`setTimeout\`, zapytania sieciowe \`fetch\`).
3. **Microtask Queue:** Kolejka zadań z obietnic (\`Promise\`). Ma absolutne pierwszeństwo przed Callback Queue.
4. **Callback Queue:** Kolejka zdarzeń z timerów i kliknięć.

**Rewolucja: async / await (ES2017)**
Zamiast plątaniny \`.then().then().then()\` (tzw. Promise Hell), piszemy czytelny kod sekwencyjny:
\`\`\`javascript
async function loadUserData(userId) {
  try {
    const res = await fetch(\`/api/users/\${userId}\`);
    if (!res.ok) throw new Error("Błąd pobierania danych");
    const user = await res.json();
    return user;
  } catch (error) {
    console.error("Wystąpił problem:", error.message);
  }
}
\`\`\``,
      codeExamples: [
        {
          title: 'Własna obietnica opóźnienia (Sleep Utility)',
          language: 'javascript',
          code: `// Funkcja opóźniająca wykonanie o zadany czas:
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runDemo() {
  console.log("Krok 1: Rozpoczynam zadanie...");
  await sleep(1500); // Czeka 1.5 sekundy bez blokowania wątku!
  console.log("Krok 2: Zadanie zrealizowane pomyślnie.");
}

runDemo();`,
          explanation: 'Słowo await wstrzymuje wykonanie funkcji asynchronicznej do momentu rozwiązania obietnicy Promise.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Oznacz funkcję słowem kluczowym async', description: 'Funkcja async automatycznie zwraca Promise.' },
        { step: 2, title: 'Użyj await przed operacją asynchroniczną', description: 'await odpakowuje wynik obietnicy.' },
        { step: 3, title: 'Zabezpiecz kod blokiem try / catch', description: 'Złap ewentualne błędy sieciowe lub odrzucenia reject.' },
      ],
      interactiveExercise: {
        id: 'ex-js-4',
        title: 'Napisz funkcję asynchroniczną z try/catch',
        instructions: 'Zdefiniuj funkcję async function fetchGreeting() { ... }. Wewnątrz bloku try wywołaj console.log("Pobieranie powitania..."), a w bloku catch(err) zaloguj ewentualny błąd.',
        task: 'Zdefiniuj funkcję async z blokiem try/catch i wywołaniem console.log.',
        starterCode: {
          html: '<h3>Demonstracja async/await</h3>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: '// Zdefiniuj funkcję asynchroniczną poniżej\n',
        },
        solutionCode: {
          html: '<h3>Demonstracja async/await</h3>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: 'async function fetchGreeting() {\n  try {\n    console.log("Pobieranie powitania...");\n  } catch (err) {\n    console.error("Błąd:", err);\n  }\n}\nfetchGreeting();',
        },
        hints: [
          'Zacznij od async function fetchGreeting() {',
          'W środku dodaj try { console.log("Pobieranie powitania..."); } catch(err) { }',
          'Wywołaj fetchGreeting();',
        ],
        rules: [
          { id: 'r1', description: 'Słowo kluczowe async obecne', ruleType: 'js_contains', target: 'async function' },
          { id: 'r2', description: 'Blok try/catch zdefiniowany', ruleType: 'js_contains', target: 'try' },
          { id: 'r3', description: 'Wywołanie console.log z powitaniem', ruleType: 'js_contains', target: 'Pobieranie powitania' },
        ],
      },
      independentTask: {
        title: 'Równoległe zapytania z Promise.all',
        instructions: 'Użyj Promise.all([pobierzUzytkownika(), pobierzPosty()]) aby pobrać oba zasoby jednocześnie zamiast czekać sekwencyjnie.',
        expectedOutcome: 'Skrócenie czasu ładowania aplikacji o połowę.',
        starterHint: 'Promise.all czeka na zakończenie wszystkich obietnic w tablicy równolegle.',
      },
      quiz: [
        {
          id: 'q-js4-1',
          question: 'W jakiej kolejności wykona się poniższy kod:\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nconsole.log(3);',
          options: [
            '1, 2, 3',
            '1, 3, 2',
            '2, 1, 3',
            '3, 2, 1',
          ],
          correctAnswer: 1,
          explanation: 'Zadania synchroniczne (1 i 3) wykonują się na Call Stacku natychmiast. Callback timera trafia do kolejki zdarzeń i czeka na zwolnienie stosu.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Użycie słowa kluczowego await poza funkcją oznaczoną async',
          whyItHappens: 'Próba wywołania await w zwykłej funkcji synchronicznej.',
          howToFix: 'Upewnij się, że nadrzędna funkcja posiada przedrostek async.',
          badCode: 'function getData() { const data = await fetch(); } // SyntaxError!',
          goodCode: 'async function getData() { const data = await fetch(); }',
        },
      ],
      practicalTask: {
        title: 'Symulacja pobierania danych w interfejsie',
        brief: 'Zaimplementuj stan ładowania: wyświetl napis "Ładowanie danych...", poczekaj 2 sekundy funkcją sleep, po czym wyświetl załadowany profil.',
        steps: ['Utwórz przycisk i pole statusu', 'Użyj async/await z opóźnieniem', 'Zmień tekst na sukces'],
        deliverable: 'Praktyczne opanowanie stanów asynchronicznych (Loading / Success / Error).',
      },
      completionCriteria: [
        'Zrozumienie mechanizmu Event Loop i Promises',
        'Prawidłowe zastosowanie async/await z blokiem try/catch',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'js-5',
      moduleId: 4,
      moduleTitle: 'JavaScript — Logika i Interaktywność',
      title: 'Pobieranie danych z sieci: Fetch API, nagłówki i parsowanie JSON',
      slug: 'fetch-api-json-komunikacja-sieciowa',
      durationMinutes: 45,
      xpReward: 90,
      order: 5,
      summary: 'Serce nowoczesnego Frontendu: jak rozmawiać z serwerami backendowymi za pomocą natywnego Fetch API, wysyłać zapytania POST z JSON oraz obsługiwać błędy HTTP (status 404/500).',
      objectives: [
        'Wysyłać zapytania GET i POST z użyciem natywnej funkcji window.fetch()',
        'Prawidłowo sprawdzać właściwość response.ok oraz parsować payload JSON metodą response.json()',
        'Wysyłać nagłówki Content-Type: application/json oraz Authorization Bearer token',
      ],
      prerequisites: ['Lekcja 4: Asynchroniczność async/await'],
      theoryMarkdown: `**Fetch API** to wbudowany w każdą nowoczesną przeglądarkę standard komunikacji sieciowej zastępujący archaiczne zapytania XMLHttpRequest (AJAX).

**Kluczowa pułapka \`fetch()\`:**
Obietnica zwracana przez \`fetch()\` **NIE** zostaje odrzucona (nie wpada do bloku \`catch\`) w przypadku błędów HTTP serwera (takich jak \`404 Not Found\` czy \`500 Internal Server Error\`)! Wpada do \`catch\` wyłącznie wtedy, gdy wystąpi awaria sieci (brak internetu, błąd DNS).

Dlatego **zawsze** musimy sprawdzić flagę **\`response.ok\`**:
\`\`\`javascript
async function fetchProducts() {
  const response = await fetch('https://api.example.com/products');
  
  // Weryfikacja kodu statusu HTTP (czy mieści się w zakresie 200-299):
  if (!response.ok) {
    throw new Error(\`Błąd serwera: status \${response.status}\`);
  }
  
  // Asynchroniczne odczytanie strumienia i parsowanie JSON:
  const data = await response.json();
  return data;
}
\`\`\`

**Wysyłanie danych metodą POST:**
\`\`\`javascript
const res = await fetch('/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ title: 'Kupić mleko', done: false })
});
\`\`\``,
      codeExamples: [
        {
          title: 'Kompletna funkcja wysyłki danych formularza przez Fetch POST',
          language: 'javascript',
          code: `async function createAccount(email, password) {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Rejestracja nie powiodła się');
    }

    const result = await response.json();
    console.log("Konto utworzone pomyślnie:", result);
    return result;
  } catch (err) {
    console.error("Problem sieciowy:", err.message);
  }
}`,
          explanation: 'JSON.stringify() serializuje obiekt JS do formatu tekstowego zrozumiałego dla serwera.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Wywołaj fetch() z adresem URL', description: 'Domyślna metoda to GET.' },
        { step: 2, title: 'Sprawdź if (!response.ok)', description: 'Zabezpiecz się przed błędami HTTP 404/500.' },
        { step: 3, title: 'Sparsować odpowiedź await response.json()', description: 'Odczytaj payload z danymi biznesowymi.' },
      ],
      interactiveExercise: {
        id: 'ex-js-5',
        title: 'Napisz funkcję pobierającą dane z weryfikacją response.ok',
        instructions: 'W pliku app.js zaimplementuj funkcję async function getPosts(): pobierz dane z "https://jsonplaceholder.typicode.com/posts/1", sprawdź if (!response.ok), a następnie sparsuj wynik do zmiennej const post = await response.json(); i wypisz w console.log.',
        task: 'Wywołaj fetch, sprawdź response.ok i sparsuj wynik z response.json.',
        starterCode: {
          html: '<h3>Pobieranie Danych API</h3>\n<div id="result"></div>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: '// Wpisz funkcję pobierającą dane poniżej\n',
        },
        solutionCode: {
          html: '<h3>Pobieranie Danych API</h3>\n<div id="result"></div>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: 'async function getPosts() {\n  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");\n  if (response.ok) {\n    const post = await response.json();\n    console.log("Pobrany post:", post);\n  }\n}\ngetPosts();',
        },
        hints: [
          'Użyj const response = await fetch("...");',
          'Sprawdź if (response.ok) { ... }',
          'Pobierz JSON: const post = await response.json();',
        ],
        rules: [
          { id: 'r1', description: 'Wywołanie fetch obecne', ruleType: 'js_contains', target: 'fetch(' },
          { id: 'r2', description: 'Weryfikacja response.ok', ruleType: 'js_contains', target: 'response.ok' },
          { id: 'r3', description: 'Parsowanie response.json()', ruleType: 'js_contains', target: 'response.json()' },
        ],
      },
      independentTask: {
        title: 'Renderowanie pobranych danych w DOM',
        instructions: 'Po pobraniu posta wstaw jego tytuł do elementu document.querySelector("#result").textContent = post.title.',
        expectedOutcome: 'Dynamiczne wyświetlenie danych z serwera na ekranie użytkownika.',
        starterHint: 'Zaktualizuj DOM wewnątrz bloku if (response.ok).',
      },
      quiz: [
        {
          id: 'q-js5-1',
          question: 'Czy zapytanie fetch("https://api.dev/nie-istnieje") zwracające kod błędu 404 wpadnie do bloku catch?',
          options: [
            'Tak, każdy błąd HTTP powoduje odrzucenie Promise',
            'Nie! Obietnica rozwiąże się ze statusem response.ok = false. Do bloku catch wpada tylko awaria sieci (brak połączenia)',
            'Tylko w trybie incognito',
            'Tak, jeśli serwer używa HTTPS',
          ],
          correctAnswer: 1,
          explanation: 'To kluczowa cecha Fetch API: kody 4xx i 5xx są traktowane jako udana komunikacja sieciowa (serwer odpowiedział).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Zapominanie o nagłówku "Content-Type": "application/json" przy wysyłce POST',
          whyItHappens: 'Założenie, że serwer automatycznie domyśli się formatu.',
          howToFix: 'Zawsze jawnie informuj backend o formacie przesyłanego body, w przeciwnym razie parser Express.js go zignoruje.',
          badCode: 'fetch("/api", { method: "POST", body: JSON.stringify(dane) });',
          goodCode: 'fetch("/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dane) });',
        },
      ],
      practicalTask: {
        title: 'Wyszukiwarka użytkowników GitHub API',
        brief: 'Pobierz dane publicznego profilu z https://api.github.com/users/octocat i wyświetl awatar oraz liczbę repozytoriów.',
        steps: ['Wyślij zapytanie do GitHub API', 'Wyciągnij pola avatar_url i public_repos', 'Wyświetl w DOM'],
        deliverable: 'Kompletna integracja z zewnętrznym API.',
      },
      completionCriteria: [
        'Zrozumienie działania Fetch API i weryfikacji response.ok',
        'Prawidłowe parsowanie obiektów JSON',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
  ],
};
