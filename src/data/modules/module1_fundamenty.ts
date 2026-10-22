import { Module } from '../../types';

export const MODULE_1: Module = {
  id: 1,
  title: 'Fundamenty programowania',
  category: 'Podstawy',
  description: 'Poznaj architekturę sieci, model klient-serwer, system plików, terminal UNIX oraz profesjonalne techniki czytania błędów i debugowania.',
  badgeName: 'Pionier Terminala',
  badgeIcon: 'Terminal',
  durationHours: 12,
  totalXp: 350,
  prerequisites: ['Brak — kurs zaczynamy od zera'],
  topics: [
    'Jak działa internet: DNS, protokoły HTTP/HTTPS i pakiety TCP/IP',
    'Podział ról: Frontend, Backend, Baza Danych i Serwer',
    'Konfiguracja środowiska: VS Code, rozszerzenia, formatowanie Prettier',
    'Terminal Bash/Zsh: nawigacja cd, ls, mkdir, rm, uprawnienia i zmienne środowiskowe',
    'Sztuka debugowania: jak czytać Stack Trace i zadawać pytania w dokumentacji',
  ],
  projectBrief: 'Konfiguracja bezpiecznego środowiska programistycznego i skrypt startowy w bash.',
  lessons: [
    {
      id: 'fund-1',
      moduleId: 1,
      moduleTitle: 'Fundamenty programowania',
      title: 'Architektura Internetu: Klient, Serwer i Protokół HTTP',
      slug: 'architektura-internetu-http',
      durationMinutes: 25,
      xpReward: 50,
      order: 1,
      summary: 'Zrozum jak przeglądarka komunikuje się z serwerem, czym są żądania i odpowiedzi HTTP oraz jak działa adresowanie w sieci.',
      objectives: [
        'Zrozumieć cykl Request -> Response w protokole HTTP/HTTPS',
        'Poznać kody statusów HTTP (200, 301, 400, 401, 404, 500)',
        'Rozróżniać rolę przeglądarki (klienta) od serwera aplikacyjnego',
      ],
      prerequisites: ['Brak'],
      theoryMarkdown: `Gdy wpisujesz w przeglądarce adres URL (np. \`https://academy.dev\`), uruchamiasz łańcuch zdarzeń:
1. **Rozwiązanie DNS (Domain Name System):** Przeglądarka tłumaczy nazwę domeny na adres IP (np. \`142.250.180.206\`), który identyfikuje fizyczny serwer w sieci.
2. **Nawiązanie połączenia TCP/IP i uścisk dłoni TLS:** Zapewnia szyfrowane połączenie HTTPS.
3. **Żądanie HTTP (Request):** Przeglądarka wysyła zapytanie (metoda \`GET\`, nagłówki, ciasteczka).
4. **Odpowiedź serwera (Response):** Serwer zwraca status (np. \`200 OK\`), nagłówki oraz treść: dokument HTML, arkusze CSS i skrypty JS.
5. **Renderowanie DOM:** Przeglądarka parsuje HTML, buduje drzewo DOM (Document Object Model) i prezentuje interfejs użytkownikowi.`,
      codeExamples: [
        {
          title: 'Struktura żądania HTTP (Request)',
          language: 'bash',
          code: `GET /api/kursy HTTP/1.1
Host: academy.dev
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1...`,
          explanation: 'Metoda GET pobiera dane, nagłówek Host wskazuje domenę, a Authorization przesyła token tożsamości.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Otwórz DevTools w przeglądarce', description: 'Wciśnij klawisz F12 i przejdź do zakładki "Sieć" (Network).' },
        { step: 2, title: 'Zbadaj pierwsze zapytanie', description: 'Odśwież stronę. Zobacz pierwszy wiersz — to dokument HTML ze statusem 200.' },
        { step: 3, title: 'Sprawdź nagłówki i kody odpowiedzi', description: 'Zwróć uwagę na nagłówek Response Headers i Content-Type.' },
      ],
      interactiveExercise: {
        id: 'ex-fund-1',
        title: 'Symulacja nagłówka strony i powitania',
        instructions: 'Zdefiniuj w oknie HTML prosty nagłówek witryny z tytułem "Witaj w Akademii" wewnątrz znacznika <h1> oraz akapit <p>.',
        task: 'Dodaj znacznik <h1> z tekstem "Witaj w Akademii" oraz znacznik <p> z opisem.',
        starterCode: {
          html: '<!-- Wpisz swój kod poniżej -->\n',
          css: 'body { font-family: sans-serif; padding: 20px; }\nh1 { color: #4338ca; }',
          js: 'console.log("Strona załadowana poprawnie!");',
        },
        solutionCode: {
          html: '<h1>Witaj w Akademii</h1>\n<p>Rozpoczynam naukę programowania Full Stack od podstaw.</p>',
          css: 'body { font-family: sans-serif; padding: 20px; }\nh1 { color: #4338ca; }',
          js: 'console.log("Strona załadowana poprawnie!");',
        },
        hints: [
          'Użyj znacznika otwierającego <h1> i zamykającego </h1>.',
          'Tekst wewnątrz nagłówka musi zawierać frazę "Witaj w Akademii".',
          'Dodaj akapit <p>...</p> pod nagłówkiem.',
        ],
        rules: [
          { id: 'r1', description: 'Znacznik <h1> istnieje w kodzie HTML', ruleType: 'html_tag_exists', target: 'h1' },
          { id: 'r2', description: 'Nagłówek zawiera tekst "Witaj w Akademii"', ruleType: 'html_contains', target: 'Witaj w Akademii' },
          { id: 'r3', description: 'Znacznik akapitu <p> istnieje w kodzie', ruleType: 'html_tag_exists', target: 'p' },
        ],
      },
      independentTask: {
        title: 'Własna wizytówka w HTML',
        instructions: 'Uzupełnij kod o znacznik <h2> ze swoim imieniem i wymarzonym stanowiskiem.',
        expectedOutcome: 'Elegancka hierarchia z nagłówkiem głównym i podtytułem.',
        starterHint: 'Możesz użyć <h2>Jan Kowalski — Przyszły Full Stack Developer</h2>.',
      },
      quiz: [
        {
          id: 'q-f1-1',
          question: 'Jaki kod statusu HTTP informuje klienta, że żądany zasób nie istnieje?',
          options: ['200 OK', '404 Not Found', '500 Internal Server Error', '301 Moved Permanently'],
          correctAnswer: 1,
          explanation: 'Kod 404 oznacza, że serwer nie znalazł zasobu pod wskazanym adresem URI.',
        },
        {
          id: 'q-f1-2',
          question: 'Co robi usługa DNS w procesie komunikacji internetowej?',
          options: [
            'Szyfruje hasła użytkowników w bazie danych',
            'Tłumaczy domenę (np. google.com) na numeryczny adres IP serwera',
            'Renderuje style CSS w przeglądarce',
            'Kompiluje kod TypeScript na JavaScript',
          ],
          correctAnswer: 1,
          explanation: 'DNS zamienia czytelne dla człowieka nazwy domen na adresy IP.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Próba bezpośredniego łączenia przeglądarki z bazą SQL',
          whyItHappens: 'Niezrozumienie roli architektury trójwarstwowej (Klient -> API -> Baza).',
          howToFix: 'Przeglądarka łączy się z serwerem aplikacji przez API, a dopiero serwer rozmawia z bazą.',
          badCode: '// BŁĄD ARCHITEKTONICZNY:\nconst db = connectToPostgres("tajneHaslo123");',
          goodCode: '// PRAWIDŁOWO: Klient odpytuje endpoint REST API\nconst res = await fetch("/api/kursy");',
        },
      ],
      practicalTask: {
        title: 'Inspekcja żądań w DevTools',
        brief: 'Zbadaj zapytania sieciowe w ulubionej witrynie i przeanalizuj nagłówki odpowiedzi.',
        steps: ['Otwórz DevTools (F12) -> Network', 'Odśwież stronę', 'Kliknij w pierwsze zapytanie dokumentu'],
        deliverable: 'Praktyczne zrozumienie statusów i nagłówków HTTP.',
      },
      completionCriteria: [
        'Zrozumienie cyklu żądanie-odpowiedź HTTP',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Wynik quizu na poziomie minimum 80%',
      ],
    },
    {
      id: 'fund-2',
      moduleId: 1,
      moduleTitle: 'Fundamenty programowania',
      title: 'Terminal, wiersz poleceń i zarządzanie systemem plików',
      slug: 'terminal-bash-system-plikow',
      durationMinutes: 30,
      xpReward: 60,
      order: 2,
      summary: 'Opanuj terminal — podstawowe narzędzie każdego profesjonalnego developera. Naucz się poruszać po katalogach, tworzyć i edytować pliki oraz instalować pakiety.',
      objectives: [
        'Zrozumieć strukturę drzewa katalogów w systemach Linux i macOS',
        'Opanować kluczowe polecenia: pwd, ls, cd, mkdir, touch, rm, cat',
        'Poznać zmienne środowiskowe (PATH, NODE_ENV) i uprawnienia chmod',
      ],
      prerequisites: ['Lekcja 1: Architektura Internetu'],
      theoryMarkdown: `Terminal to tekstowy interfejs do komunikacji z jądrem systemu operacyjnego (shell). 

Jako Full Stack Developer będziesz używać terminala codziennie: do uruchamiania serwerów, kompilacji kodu, pracy z Git, budowania kontenerów Docker i zarządzania serwerami VPS.

**Najważniejsze komendy nawigacji:**
- \`pwd\` (print working directory) — wyświetla ścieżkę bieżącego folderu.
- \`ls -la\` — listuje zawartość katalogu, w tym ukryte pliki konfiguracyjne (zaczynające się od kropki, np. \`.env\`, \`.gitignore\`).
- \`cd nazwa_folderu\` — przechodzi do wskazanego katalogu.
- \`cd ..\` — cofa się o jeden poziom w górę drzewa katalogów.
- \`mkdir nazwa\` — tworzy nowy katalog.
- \`touch index.js\` — tworzy pusty plik.
- \`rm -rf folder\` — usuwa katalog i jego zawartość (używać z rozwagą!).`,
      codeExamples: [
        {
          title: 'Typowy ciąg poleceń przy tworzeniu nowego projektu',
          language: 'bash',
          code: `# Utwórz katalog projektu i wejdź do środka
mkdir my-fullstack-app && cd my-fullstack-app

# Zainicjalizuj menedżer pakietów
npm init -y

# Utwórz pliki startowe
touch index.js .env .gitignore

# Sprawdź strukturę katalogu
ls -la`,
          explanation: 'Operator && pozwala łączyć polecenia — drugie wykona się tylko wtedy, gdy pierwsze zakończy się sukcesem.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Otwórz terminal wbudowany w VS Code', description: 'Skorzystaj ze skrótu klawiszowego Ctrl+\` (lub Cmd+\` na Mac).' },
        { step: 2, title: 'Sprawdź gdzie się znajdujesz', description: 'Wpisz pwd i naciśnij Enter.' },
        { step: 3, title: 'Wylistuj pliki', description: 'Wpisz ls lub ls -la, aby zobaczyć wszystkie pliki.' },
      ],
      interactiveExercise: {
        id: 'ex-fund-2',
        title: 'Komponent wizualny terminala',
        instructions: 'Zbuduj w HTML strukturę przypominającą okno terminala: kontener z klasą terminal, wewnątrz znacznik <code> z symulacją komendy "$ npm run dev" oraz znacznik <pre> z komunikatem "Server running on port 3000".',
        task: 'Utwórz terminal ze znacznikami code i pre.',
        starterCode: {
          html: '<!-- Zbuduj okno terminala poniżej -->\n',
          css: '.terminal { background: #0f172a; color: #38bdf8; padding: 18px; border-radius: 10px; font-family: monospace; }\ncode { color: #4ade80; display: block; margin-bottom: 8px; }\npre { color: #e2e8f0; margin: 0; }',
          js: 'console.log("Terminal symulacyjny aktywny.");',
        },
        solutionCode: {
          html: '<div class="terminal">\n  <code>$ npm run dev</code>\n  <pre>Server running on port 3000 at http://localhost:3000</pre>\n</div>',
          css: '.terminal { background: #0f172a; color: #38bdf8; padding: 18px; border-radius: 10px; font-family: monospace; }\ncode { color: #4ade80; display: block; margin-bottom: 8px; }\npre { color: #e2e8f0; margin: 0; }',
          js: 'console.log("Terminal symulacyjny aktywny.");',
        },
        hints: [
          'Użyj <div class="terminal"> jako głównego kontenera.',
          'Wstaw <code>$ npm run dev</code> wewnątrz div.',
          'Dodaj <pre>Server running on port 3000</pre>.',
        ],
        rules: [
          { id: 'r1', description: 'Kontener terminal obecny', ruleType: 'html_contains', target: 'terminal' },
          { id: 'r2', description: 'Znacznik <code> zawiera komendę npm', ruleType: 'html_contains', target: 'npm run dev' },
          { id: 'r3', description: 'Znacznik <pre> zawiera port 3000', ruleType: 'html_contains', target: '3000' },
        ],
      },
      independentTask: {
        title: 'Skrypt Bash do automatyzacji',
        instructions: 'Napisz krótki ciąg poleceń tworzący strukturę folderów src/components, src/utils, src/styles.',
        expectedOutcome: 'Umiejętność jednoczesnego tworzenia zagnieżdżonych struktur z flagą mkdir -p.',
        starterHint: 'mkdir -p src/{components,utils,styles}',
      },
      quiz: [
        {
          id: 'q-f2-1',
          question: 'Jakie polecenie w terminalu pozwala cofnąć się o jeden poziom w górę katalogu?',
          options: ['cd up', 'cd ..', 'back', 'pwd -1'],
          correctAnswer: 1,
          explanation: 'Dwie kropki ".." w ścieżce oznaczają katalog nadrzędny w systemach uniksowych.',
        },
        {
          id: 'q-f2-2',
          question: 'Do czego służy flaga -a w poleceniu ls -a?',
          options: ['Wymusza alfabetyczne sortowanie', 'Wyświetla wszystkie pliki, w tym pliki ukryte zaczynające się od kropki', 'Automatycznie usuwa puste foldery', 'Kopiuje pliki do schowka'],
          correctAnswer: 1,
          explanation: 'Flaga -a (all) sprawia, że ls pokazuje ukryte pliki takie jak .env, .git czy .gitignore.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Używanie spacji w nazwach plików i folderów projektowych',
          whyItHappens: 'Przyzwyczajenie z codziennego korzystania z systemów Windows lub macOS.',
          howToFix: 'W świecie programowania i terminala zawsze używaj myślników (kebab-case) lub podkreślników (snake_case), np. moja-aplikacja zamiast "moja aplikacja".',
          badCode: 'mkdir moj nowy projekt  # Utworzy 3 osobne foldery!',
          goodCode: 'mkdir moj-nowy-projekt  # Utworzy 1 poprawny folder',
        },
      ],
      practicalTask: {
        title: 'Stworzenie struktury w terminalu',
        brief: 'Utwórz na dysku folder i przećwicz polecenia pwd, ls, touch i rm.',
        steps: ['Wpisz mkdir test-terminal', 'Przejdź cd test-terminal', 'Utwórz plik touch main.js', 'Wylistuj ls -l'],
        deliverable: 'Płynna nawigacja po systemie plików bez użycia myszki.',
      },
      completionCriteria: [
        'Zrozumienie podstawowych komend nawigacyjnych',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem co najmniej 80%',
      ],
    },
    {
      id: 'fund-3',
      moduleId: 1,
      moduleTitle: 'Fundamenty programowania',
      title: 'Sztuka debugowania: jak czytać Stack Trace, błędy i logi',
      slug: 'debugowanie-stack-trace-bledy',
      durationMinutes: 30,
      xpReward: 60,
      order: 3,
      summary: 'Ponad 50% czasu pracy developera to znajdowanie i naprawianie usterek. Naucz się czytać komunikaty błędów, Stack Trace oraz korzystać z debuggera i konsoli.',
      objectives: [
        'Rozróżniać typy błędów: SyntaxError, ReferenceError, TypeError, Logic Errors',
        'Czytać ślad stosu wywołań (Stack Trace) od góry do dołu, lokalizując numer pliku i linii',
        'Stosować profesjonalne techniki logowania: console.log, console.error, console.table, breakpointy',
      ],
      prerequisites: ['Lekcja 1 i 2 z modułu Fundamenty'],
      theoryMarkdown: `Błąd w kodzie nie jest porażką — to precyzyjna wskazówka przekazywana przez interpreter, gdzie i dlaczego wykonanie programu zostało przerwane.

**Główne kategorie błędów:**
1. **SyntaxError (Błąd składni):** Zły zapis kodu, np. brakujący nawias klamrowy \`}\` lub literówka w słowie kluczowym. Kod w ogóle się nie uruchomi.
2. **ReferenceError (Błąd odwołania):** Próba użycia zmiennej lub funkcji, która nie została zadeklarowana w danym zasięgu (np. \`console.log(user)\` przed jej definicją).
3. **TypeError (Błąd typu):** Wywołanie metody na wartości niewłaściwego typu, np. wywołanie \`user.map()\` gdy \`user\` jest obiektem lub \`null\`, albo słynne \`Cannot read properties of undefined\`.
4. **Logic Error (Błąd logiczny):** Kod wykonuje się bez błędu w konsoli, ale zwraca zły wynik (np. dodawanie zamiast mnożenia).

**Anatomia Stack Trace:**
Ślad stosu pokazuje łańcuch wywołań funkcji prowadzący do miejsca awarii. Pierwszy wiersz podaje typ błędu i opis, a kolejne wiersze wskazują dokładny plik oraz numer linii i kolumny: \`at calculateTotal (cart.js:42:15)\`.`,
      codeExamples: [
        {
          title: 'Przykład analizy błędu TypeError w konsoli',
          language: 'javascript',
          code: `// TypeError: Cannot read properties of undefined (reading 'name')
function printUserName(user) {
  // Jeśli user jest undefined, poniższa linia wyrzuci błąd:
  console.log("Użytkownik:", user.name);
}

// Bezpieczne podejście z Optional Chaining (?.):
function printUserNameSafe(user) {
  console.log("Użytkownik:", user?.name ?? "Gość");
}`,
          explanation: 'Operator ?. (Optional Chaining) zapobiega przerwaniu aplikacji, gdy obiekt ma wartość null lub undefined.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Przeczytaj komunikat błędu powoli', description: 'Zwróć uwagę na pierwsze słowa: TypeError czy ReferenceError.' },
        { step: 2, title: 'Zlokalizuj numer linii w kodzie', description: 'Sprawdź pierwszy wiersz Stack Trace wskazujący Twój plik źródłowy.' },
        { step: 3, title: 'Sprawdź stan zmiennych tuż przed linią błędu', description: 'Użyj console.log() lub postaw breakpoint w zakładce Sources DevTools.' },
      ],
      interactiveExercise: {
        id: 'ex-fund-3',
        title: 'Komponent bezpiecznego powiadomienia o błędzie',
        instructions: 'Zaprojektuj wizualny komponent powiadomienia o błędzie (Error Banner): stwórz element z atrybutem role="alert", nagłówkiem <h4> z tekstem "Wystąpił błąd", akapitem z opisem problemu oraz przyciskiem "Spróbuj ponownie".',
        task: 'Utwórz komponent powiadomienia o błędzie z role="alert" i przyciskiem ponowienia.',
        starterCode: {
          html: '<!-- Zbuduj baner błędu z role="alert" -->\n',
          css: '.error-box { background: #fee2e2; border: 1px solid #f87171; border-radius: 8px; padding: 16px; color: #991b1b; }\nh4 { margin: 0 0 6px 0; font-size: 1rem; }\np { margin: 0 0 10px 0; font-size: 0.85rem; }\nbutton { background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: bold; }',
          js: 'console.log("Obsługa błędów załadowana.");',
        },
        solutionCode: {
          html: '<div class="error-box" role="alert">\n  <h4>Wystąpił błąd</h4>\n  <p>Nie udało się pobrać danych z serwera. Sprawdź połączenie z internetem.</p>\n  <button type="button">Spróbuj ponownie</button>\n</div>',
          css: '.error-box { background: #fee2e2; border: 1px solid #f87171; border-radius: 8px; padding: 16px; color: #991b1b; }\nh4 { margin: 0 0 6px 0; font-size: 1rem; }\np { margin: 0 0 10px 0; font-size: 0.85rem; }\nbutton { background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: bold; }',
          js: 'console.log("Obsługa błędów załadowana.");',
        },
        hints: [
          'Dodaj <div class="error-box" role="alert">.',
          'W środku umieść <h4>Wystąpił błąd</h4>.',
          'Dodaj <button type="button">Spróbuj ponownie</button>.',
        ],
        rules: [
          { id: 'r1', description: 'Element posiada role="alert"', ruleType: 'html_attr_exists', target: 'role', param: 'alert' },
          { id: 'r2', description: 'Nagłówek <h4> zawiera tekst "Wystąpił błąd"', ruleType: 'html_contains', target: 'Wystąpił błąd' },
          { id: 'r3', description: 'Przycisk ponowienia próby obecny', ruleType: 'html_contains', target: 'Spróbuj ponownie' },
        ],
      },
      independentTask: {
        title: 'Debugowanie z użyciem console.table',
        instructions: 'Zdefiniuj w zakładce JS tablicę 3 obiektów studentów (id, name, score) i wyświetl ją za pomocą console.table(students).',
        expectedOutcome: 'Przejrzysta tabela w konsoli zamiast zagnieżdżonych obiektów.',
        starterHint: 'console.table([{ name: "Jan", score: 90 }, { name: "Anna", score: 95 }])',
      },
      quiz: [
        {
          id: 'q-f3-1',
          question: 'Co oznacza błąd: "TypeError: Cannot read properties of undefined (reading \'id\')"?',
          options: [
            'Baza danych SQL została wyłączona',
            'Kod próbuje odczytać pole .id z obiektu, który ma wartość undefined (nie istnieje)',
            'Przeglądarka ma wyłączoną obsługę ciasteczek',
            'Plik CSS zawiera błąd składni',
          ],
          correctAnswer: 1,
          explanation: 'To najczęstszy błąd w JS: próba odczytania właściwości ze zmiennej, która nie przechowuje obiektu.',
        },
        {
          id: 'q-f3-2',
          question: 'Która linia w typowym Stack Trace wskazuje bezpośrednie miejsce wystąpienia błędu?',
          options: [
            'Ostatnia linia na samym dole',
            'Pierwsza linia w śladzie stosu pod komunikatem błędu',
            'Linia numer 100',
            'Stack trace nie zawiera numerów linii',
          ],
          correctAnswer: 1,
          explanation: 'Pierwszy wpis pod nagłówkiem błędu wskazuje dokładny plik i numer linii, w której nastąpiło zatrzymanie kodu.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Kopiowanie całego błędu w panice bez przeczytania treści',
          whyItHappens: 'Strach przed czerwonym kolorem w konsoli deweloperskiej.',
          howToFix: 'Zatrzymaj się, przeczytaj typ błędu i sprawdź wskazaną linię w kodzie — w 90% przypadków rozwiązanie jest natychmiastowe.',
          badCode: '// Ignorowanie błędu pustym blokiem catch:\ntry { doSomething(); } catch (e) {}',
          goodCode: '// Właściwe logowanie błędu do analizy:\ntry { doSomething(); } catch (err) { console.error("Operacja nie powiodła się:", err.message); }',
        },
      ],
      practicalTask: {
        title: 'Świadome wywołanie błędu i inspekcja',
        brief: 'Napisz w pliku JS wywołanie nieistniejącej zmiennej i zbadaj wygląd Stack Trace w DevTools.',
        steps: ['Wpisz console.log(nieistniejacaZmienna)', 'Uruchom kod', 'Sprawdź komunikat ReferenceError'],
        deliverable: 'Praktyczne oswojenie się z komunikatami błędów.',
      },
      completionCriteria: [
        'Zrozumienie typów błędów w JS',
        'Prawidłowe rozwiązanie ćwiczenia z role="alert"',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'fund-3',
      moduleId: 1,
      moduleTitle: 'Fundamenty programowania',
      title: 'Terminal UNIX, system plików i zmienne środowiskowe .env',
      slug: 'terminal-unix-system-plikow-env',
      durationMinutes: 30,
      xpReward: 60,
      order: 3,
      summary: 'Kluczowe narzędzie inżyniera: terminal bash/zsh, nawigacja po drzewie katalogów (pwd, cd, ls), zarządzanie plikami oraz bezpieczna konfiguracja zmiennych środowiskowych w pliku .env.',
      objectives: [
        'Sprawnie nawigować po systemie plików i operować na plikach z poziomu konsoli',
        'Zrozumieć rolę zmiennych środowiskowych i zabezpieczać klucze API przed wyciekiem na GitHub',
        'Stosować pliki .env.example jako wzorzec konfiguracyjny projektu',
      ],
      prerequisites: ['Lekcja 1: Architektura Internetu'],
      theoryMarkdown: `Graficzny interfejs (GUI) jest wygodny, ale to **wiersz poleceń (CLI)** daje programiście pełną kontrolę nad serwerami, kontenerami i automatyzacją.

**1. Podstawowe komendy UNIX:**
- \`pwd\` (Print Working Directory): Wyświetla pełną ścieżkę bieżącego katalogu.
- \`ls -la\`: Wypisuje wszystkie pliki (również ukryte kropką, np. \`.gitignore\`) wraz z uprawnieniami.
- \`cd <ścieżka>\`: Przechodzi do katalogu (\`cd ..\` cofa o jeden poziom).
- \`mkdir <nazwa>\`: Tworzy nowy katalog.
- \`cat <plik>\`: Wypisuje zawartość pliku w oknie konsoli.

**2. Zmienne środowiskowe (.env):**
Sekrety (hasła do baz danych, klucze API, tokeny płatności) **nigdy nie mogą znaleźć się w kodzie źródłowym**.
Przechowujemy je w pliku \`.env\`, który jest dodany do \`.gitignore\`:
\`\`\`bash
# .env (NIGDY nie commituj do repozytorium!)
PORT=3000
DATABASE_URL=postgresql://user:tajne_haslo@localhost:5432/db
JWT_SECRET=super_tajny_klucz_kryptograficzny
\`\`\`

Do repozytorium wrzucamy wyłącznie szablon **\`.env.example\`** z pustymi lub przykładowymi wartościami, aby inni programiści wiedzieli, jak skonfigurować projekt.`,
      codeExamples: [
        {
          title: 'Odczyt zmiennych środowiskowych w Node.js',
          language: 'typescript',
          code: `import 'dotenv/config';

const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('KRYTYCZNY BŁĄD: Zmienna DATABASE_URL nie została zdefiniowana w pliku .env!');
}

console.log(\`Serwer uruchomiony na porcie \${port}\`);`,
          explanation: 'Pakiet dotenv wczytuje zawartość pliku .env do globalnego obiektu process.env w Node.js.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Dodaj .env do .gitignore', description: 'Upewnij się, że Git nie wyśle sekretów do sieci.' },
        { step: 2, title: 'Stwórz plik .env.example', description: 'Wypisz nazwy wymaganych zmiennych bez ich sekretnych wartości.' },
        { step: 3, title: 'Wczytaj przez process.env', description: 'Odwołuj się do zmiennych przez process.env.NAZWA_ZMIENNEJ.' },
      ],
      interactiveExercise: {
        id: 'ex-fund-3',
        title: 'Komponent wizualizacji statusu zmiennych środowiskowych',
        instructions: 'Zaprojektuj wizualny widżet statusu konfiguracji serwera: stwórz kontener z klasą env-checker, informację o aktywnym środowisku "NODE_ENV: production", oraz wskaźnik "DATABASE_URL: Configured".',
        task: 'Utwórz element env-checker z tekstami NODE_ENV: production oraz DATABASE_URL: Configured.',
        starterCode: {
          html: '<!-- Zbuduj widok wskaźnika zmiennych środowiskowych poniżej -->\n',
          css: '.env-checker { background: #0b132b; border: 1px solid #1c2541; padding: 14px 18px; border-radius: 10px; font-family: monospace; color: #5bc0be; font-size: 0.85rem; display: flex; flex-direction: column; gap: 6px; }\n.env-key { color: #6fffe9; font-weight: bold; }',
          js: 'console.log("Env Inspector aktywny.");',
        },
        solutionCode: {
          html: '<div class="env-checker">\n  <div>NODE_ENV: production</div>\n  <div>DATABASE_URL: Configured</div>\n</div>',
          css: '.env-checker { background: #0b132b; border: 1px solid #1c2541; padding: 14px 18px; border-radius: 10px; font-family: monospace; color: #5bc0be; font-size: 0.85rem; display: flex; flex-direction: column; gap: 6px; }\n.env-key { color: #6fffe9; font-weight: bold; }',
          js: 'console.log("Env Inspector aktywny.");',
        },
        hints: [
          'Użyj kontenera <div class="env-checker">.',
          'Wstaw <div>NODE_ENV: production</div>.',
          'Wstaw <div>DATABASE_URL: Configured</div>.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa env-checker obecna', ruleType: 'html_contains', target: 'env-checker' },
          { id: 'r2', description: 'NODE_ENV: production obecne', ruleType: 'html_contains', target: 'NODE_ENV: production' },
          { id: 'r3', description: 'DATABASE_URL: Configured obecne', ruleType: 'html_contains', target: 'DATABASE_URL: Configured' },
        ],
      },
      independentTask: {
        title: 'Konfiguracja pliku .env.example',
        instructions: 'Napisz plik .env.example definiujący klucze PORT, API_KEY, DATABASE_URL i REDIS_HOST bez ujawniania haseł.',
        expectedOutcome: 'Bezpieczny wzorzec konfiguracyjny gotowy do przekazania zespołowi.',
        starterHint: 'Zdefiniuj klucze z wartościami przykładowymi, np. DATABASE_URL=postgresql://user:pass@localhost:5432/db',
      },
      quiz: [
        {
          id: 'q-fund3-1',
          question: 'Dlaczego plik .env zawierający klucze API i hasła do bazy bezwzględnie musi znaleźć się w pliku .gitignore?',
          options: [
            'Ponieważ w przeciwnym razie boty internetowe w ciągu kilku sekund przeskanują publiczne repozytorium GitHub i ukradną Twoje klucze, co może narazić firmę na gigantyczne straty finansowe',
            'Ponieważ plik .env uniemożliwia kompilację kodu JavaScript',
            'Plik .env waży zbyt wiele megabajtów dla serwerów Gita',
            'Git nie obsługuje plików zaczynających się od kropki',
          ],
          correctAnswer: 0,
          explanation: 'Zautomatyzowane roboty skanują GitHub 24/7 w poszukiwaniu wycieków kluczy AWS, Stripe i haseł bazodanowych. Zawsze izoluj sekrety w .env.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Wpisywanie klucza API bezpośrednio w kodzie komponentu React',
          whyItHappens: 'Pośpiech i chęć szybkiego przetestowania zapytania.',
          howToFix: 'Wszystkie zmienne we frontendzie React/Vite muszą mieć przedrostek VITE_ i trafiać do pliku .env, a wrażliwe klucze powinny być ukryte za backendem (API Proxy).',
          badCode: 'const apiKey = "sk_live_9482018491028491"; // Poważny wyciek!',
          goodCode: 'const apiKey = import.meta.env.VITE_PUBLIC_API_KEY;',
        },
      ],
      practicalTask: {
        title: 'Przetestowanie komend w Terminalu Akademii',
        instructions: 'Otwórz zakładkę "Terminal Bash / Git" w lewym menu aplikacji i wykonaj komendy ls -la oraz cat package.json.',
        brief: 'Przetestuj interaktywny terminal wbudowany w aplikację.',
        steps: ['Przejdź do zakładki Terminal', 'Wpisz ls -la', 'Wyświetl plik cat package.json'],
        deliverable: 'Praktyczne oswojenie się z wierszem poleceń.',
      },
      completionCriteria: [
        'Zrozumienie podstawowych komend powłoki UNIX',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
  ],
};
