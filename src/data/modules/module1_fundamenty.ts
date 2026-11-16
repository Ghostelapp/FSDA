import { Module } from '../../types';

export const MODULE_1: Module = {
  id: 1,
  title: 'Jak działa Internet, Edytor Kodu i Terminal (Narzędzia)',
  category: 'Podstawy',
  description: 'Gdy potrafisz już budować strony w HTML, CSS i JavaScript, dowiedz się jak przeglądarka łączy się z serwerem (HTTP/DNS), jak pracować w edytorze VS Code, używać Terminala oraz Narzędzi Deweloperskich (F12).',
  badgeName: 'Pionier Terminala',
  badgeIcon: 'Terminal',
  durationHours: 16,
  totalXp: 480,
  prerequisites: ['Podstawy HTML, CSS i JavaScript'],
  topics: [
    'Jak działa internet: przeglądarka (Klient), serwer i kody HTTP (200, 404)',
    'Jak komputer wykonuje kod: algorytmy i zmienne w pamięci',
    'Konfiguracja środowiska: VS Code, skróty klawiszowe i Prettier',
    'Terminal od podstaw: tworzenie folderów i nawigacja po plikach',
    'Narzędzia przeglądarki (DevTools F12) oraz pliki konfiguracyjne .env',
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
      summary: 'Dowiedz się od absolutnych podstaw, co dzieje się po wpisaniu adresu strony w przeglądarce, czym różni się Klient od Serwera i czym są kody 200 oraz 404.',
      objectives: [
        'Zrozumieć prosty podział ról: Przeglądarka (Klient) pyta, a Serwer odpowiada',
        'Rozumieć najważniejsze kody odpowiedzi: 200 (OK — strona działa) oraz 404 (Nie znaleziono)',
        'Stworzyć swój pierwszy nagłówek <h1> i akapit <p> w edytorze kodu',
      ],
      prerequisites: ['Brak — zaczynamy zupełnie od zera!'],
      theoryMarkdown: `Zanim napiszesz pierwszą linijkę kodu, zobaczmy jak działa każda strona internetowa. Nie musisz znać żadnych trudnych pojęć — cały internet opiera się na prostej rozmowie dwóch programów.

**1. Dwóch bohaterów internetu: Klient i Serwer**
- **Klient (Twoja przeglądarka):** To program, którego teraz używasz (np. Chrome, Firefox, Safari). Jego zadaniem jest wyświetlenie tekstu, przycisków i obrazków na Twoim ekranie.
- **Serwer:** To komputer włączony 24 godziny na dobę w centrum danych, na którym zapisane są pliki strony internetowej.

**2. Co dzieje się krok po kroku, gdy wpisujesz adres strony?**
1. **Książka telefoniczna internetu (DNS):** Ludzie łatwo zapamiętują nazwy takie jak \`google.com\`, ale komputery porozumiewają się za pomocą numerów (adresów IP, np. \`142.250.180.206\`). System **DNS** automatycznie tłumaczy nazwę domeny na numer IP serwera.
2. **Wysłanie prośby (Request HTTP):** Twoja przeglądarka wysyła do serwera krótką wiadomość: \`GET /strona-glowna\` — czyli *„Poproszę o przesłanie strony głównej”*.
3. **Odpowiedź serwera (Response HTTP):** Serwer znajduje odpowiedni plik i odsyła go razem z krótkim kodem liczbowym:
- **\`200 OK\`** — Wszystko się udało! Oto gotowa strona.
- **\`404 Not Found\`** — Pod tym adresem nic nie ma (np. literówka w adresie).
- **\`500 Server Error\`** — Serwer napotkał usterkę po swojej stronie.
4. **Wyświetlenie strony na ekranie:** Przeglądarka odbiera przesłany kod **HTML** (tekst i strukturę), **CSS** (kolory i wygląd) oraz **JavaScript** (interakcje) i rysuje gotową stronę.`,
      codeExamples: [
        {
          title: 'Jak wygląda rozmowa przeglądarki z serwerem?',
          language: 'bash',
          code: `# 1. Przeglądarka pyta serwer (Request):
GET /kurs-od-podstaw HTTP/1.1
Host: akademia.pl

# 2. Serwer odpowiada (Response):
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8

<h1>Witaj w Akademii</h1>
<p>Twoja pierwsza strona została pobrana z serwera!</p>`,
          explanation: 'Polecenie GET oznacza „pobierz stronę”, status 200 OK potwierdza sukces, a poniżej serwer przesyła zwykły kod HTML.',
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
      title: 'Jak działa kod? Myślenie algorytmiczne, pamięć RAM i wykonanie programu',
      slug: 'jak-dziala-kod-algorytmy-pamiec',
      durationMinutes: 25,
      xpReward: 60,
      order: 2,
      summary: 'Zanim napiszesz pierwszą aplikację, zrozum jak procesor i pamięć RAM przetwarzają instrukcje, czym jest algorytm oraz czym różni się język interpretowany (JS) od kompilowanego.',
      objectives: [
        'Rozkładać złożony problem na proste, jednoznaczne kroki (myślenie algorytmiczne)',
        'Zrozumieć jak zmienne rezerwują miejsce w pamięci operacyjnej RAM',
        'Rozróżniać kompilację (C++, Rust, TypeScript) od interpretacji JIT (JavaScript V8)',
      ],
      prerequisites: ['Lekcja 1: Architektura Internetu'],
      theoryMarkdown: `Programowanie to sztuka tłumaczenia ludzkich celów biznesowych na precyzyjną listę jednoznacznych kroków, które potrafi wykonać procesor. Zanim nauczysz się dziesiątek bibliotek, warto dokładnie zrozumieć, co dzieje się pod spodem w sprzęcie i pamięci operacyjnej komputera.

**1. Czym jest algorytm i jego trzy fundamentalne klocki?**
Algorytm to skończony, powtarzalny przepis prowadzący od danych wejściowych (*Input*) do oczekiwanego wyniku (*Output*). Absolutnie każdy program — od prostego kalkulatora po silnik rekomendacji Netflixa — buduje się z zaledwie trzech struktur sterujących:
- **Sekwencji:** Wykonywanie instrukcji linijka po linijce od góry do dołu (np. pobierz dane, sprawdź hasło, zapisz sesję).
- **Warunku (Selekcji):** Rozgałęzienie decyzji za pomocą \`if / else\` (*jeśli* koszyk przekracza 200 zł -> nalicz darmową dostawę, *w przeciwnym razie* -> dolicz 15 zł).
- **Pętli (Iteracji):** Wielokrotne powtarzanie operacji dla całej kolekcji danych (np. wyświetlenie 50 produktów z listy).

**2. Jak zmienne rezerwują pamięć RAM?**
Gdy w kodzie piszesz \`const wiek = 25;\`, środowisko uruchomieniowe rezerwuje miejsce w szybkiej pamięci operacyjnej **RAM**, zapisuje tam reprezentację binarną liczby \`25\` i wiąże z nią czytelną etykietę \`wiek\`. Typy proste (liczby, krótkie flagi) trafiają na szybki **Stos (Stack)**, natomiast rozbudowane obiekty i tablice są alokowane na dynamicznej **Stercie (Heap)**, do której zmienna przechowuje jedynie adres (referencję).

**3. Kompilacja, interpretacja i silnik V8 (JIT):**
Procesor rozumie wyłącznie kod maszynowy. Języki takie jak C++ czy Rust kompiluje się z góry do pliku wykonywalnego przed wysłaniem do użytkownika. Z kolei nowoczesny JavaScript w przeglądarce Chrome i środowisku Node.js wykorzystuje silnik **V8** z kompilatorem **JIT (Just-In-Time)**: kod startuje błyskawicznie jako interpreter, a fragmenty wykonywane w pętlach tysiące razy (*hot paths*) są w locie zamieniane bezpośrednio na ultraszybki kod maszynowy.`,
      codeExamples: [
        {
          title: 'Od problemu w języku polskim do pierwszego algorytmu w JS',
          language: 'javascript',
          code: `// CEL: Sprawdź czy kursant otrzymuje certyfikat (wymagane >= 80% punktów)
const punktyKursanta = 88;
const progZaliczenia = 80;

// Krok warunkowy (Selekcja):
if (punktyKursanta >= progZaliczenia) {
  console.log("Gratulacje! Certyfikat został wygenerowany.");
} else {
  console.log("Spróbuj ponownie — brakuje jeszcze kilku punktów.");
}`,
          explanation: 'Komputer wykonuje instrukcje od góry do dołu, sprawdzając warunek logiczny w nawiasie if (...).',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zdefiniuj dane wejściowe (Input)', description: 'Zapisz wartości początkowe w zmiennych (np. cena produktu, kod rabatowy).' },
        { step: 2, title: 'Zastosuj regułę przetwarzania', description: 'Przeprowadź obliczenie lub sprawdź warunek if/else.' },
        { step: 3, title: 'Zwróć wynik (Output)', description: 'Wyświetl rezultat na ekranie lub w konsoli.' },
      ],
      interactiveExercise: {
        id: 'ex-fund-algo',
        title: 'Twój pierwszy algorytm: weryfikacja wieku użytkownika',
        instructions: 'W zakładce JS zadeklaruj stałą const age = 20; oraz wypisz w console.log("Dostęp przyznany") jeśli wiek jest większy lub równy 18.',
        task: 'Zadeklaruj const age = 20 i wywołaj console.log("Dostęp przyznany").',
        starterCode: {
          html: '<h2>Symulator Algorytmu Decyzyjnego</h2>\n<p>Wynik działania programu zobaczysz w konsoli.</p>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: '// Napisz swój pierwszy algorytm poniżej:\n',
        },
        solutionCode: {
          html: '<h2>Symulator Algorytmu Decyzyjnego</h2>\n<p>Wynik działania programu zobaczysz w konsoli.</p>',
          css: 'body { font-family: sans-serif; padding: 20px; }',
          js: 'const age = 20;\nif (age >= 18) {\n  console.log("Dostęp przyznany");\n}',
        },
        hints: [
          'Zacznij od: const age = 20;',
          'Dodaj warunek: if (age >= 18) { ... }',
          'Wewnątrz klamry wpisz: console.log("Dostęp przyznany");',
        ],
        rules: [
          { id: 'r1', description: 'Deklaracja zmiennej age', ruleType: 'js_contains', target: 'age' },
          { id: 'r2', description: 'Wypisanie tekstu "Dostęp przyznany"', ruleType: 'js_contains', target: 'Dostęp przyznany' },
          { id: 'r3', description: 'Użycie console.log', ruleType: 'js_contains', target: 'console.log' },
        ],
      },
      independentTask: {
        title: 'Algorytm obliczania rabatu koszyka',
        instructions: 'Rozpisz w komentarzach 4 kroki algorytmu naliczającego 15% zniżki, gdy wartość koszyka przekracza 200 zł, a następnie zapisz go w kodzie JS.',
        expectedOutcome: 'Umiejętność planowania logiki w pseudokodzie przed pisaniem właściwego kodu.',
        starterHint: 'Najpierw oblicz kwotę po rabacie: cena * 0.85.',
      },
      quiz: [
        {
          id: 'q-f-algo-1',
          question: 'Czym jest silnik V8 w przeglądarce Google Chrome oraz środowisku Node.js?',
          options: [
            'Klawiaturą mechaniczną dla programistów',
            'Silnikiem wykonującym i kompilującym JIT kod JavaScript do instrukcji procesora',
            'Arkusze stylów dla tabel HTML',
            'Rodzajem kabla sieciowego',
          ],
          correctAnswer: 1,
          explanation: 'Silnik V8 napisany w C++ odpowiada za parsowanie i błyskawiczne wykonywanie kodu JavaScript.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Zaczynanie pisania kodu bez zrozumienia problemu i rozpisania kroków',
          whyItHappens: 'Chęć natychmiastowego zobaczenia efektu na ekranie.',
          howToFix: 'Najpierw zapisz kroki po polsku w komentarzach (// Krok 1: ..., // Krok 2: ...), a dopiero potem zamień je na kod.',
          badCode: '// Chaotyczne pisanie losowych warunków bez planu',
          goodCode: '// 1. Pobierz kwotę\n// 2. Sprawdź czy > 100\n// 3. Odejmij rabat',
        },
      ],
      practicalTask: {
        title: 'Pseudokod procesu logowania',
        brief: 'Napisz w notatniku 5 kroków algorytmu logowania użytkownika z obsługą błędnego hasła i blokadą po 3 nieudanych próbach.',
        steps: ['Pobierz e-mail i hasło', 'Sprawdź czy użytkownik istnieje w bazie', 'Porównaj hash hasła', 'Zwróć token lub zwiększ licznik błędów'],
        deliverable: 'Kompletny schemat logiczny procesu autoryzacji.',
      },
      completionCriteria: [
        'Zrozumienie pojęcia algorytmu i pamięci RAM',
        'Prawidłowe wykonanie ćwiczenia w JS',
        'Wynik quizu min. 80%',
      ],
    },
    {
      id: 'fund-3',
      moduleId: 1,
      moduleTitle: 'Fundamenty programowania',
      title: 'Warsztat Developera: VS Code, skróty klawiszowe, Prettier i ESLint',
      slug: 'warsztat-vscode-prettier-eslint',
      durationMinutes: 25,
      xpReward: 50,
      order: 3,
      summary: 'Skonfiguruj profesjonalny edytor kodu Visual Studio Code. Poznaj skróty klawiszowe oszczędzające godziny pracy, automatyczne formatowanie Prettier oraz strażnika jakości ESLint.',
      objectives: [
        'Opanować najważniejsze skróty klawiszowe VS Code (Ctrl+P, Ctrl+Shift+P, Alt+Strzałki, Ctrl+D)',
        'Skonfigurować automatyczne formatowanie kodu przy zapisie (Format On Save + Prettier)',
        'Zrozumieć różnicę między formaterem wyglądu (Prettier) a analizatorem błędów logicznych (ESLint)',
      ],
      prerequisites: ['Lekcja 1 i 2'],
      theoryMarkdown: `Dobry inżynier dba o swoje narzędzia pracy tak samo jak o architekturę kodu. **Visual Studio Code (VS Code)** to lekki, rozszerzalny edytor kodu będący dziś niekwestionowanym standardem w świecie Full Stack — od pracy z Reactem i Node.js po kontenery Docker i zdalne serwery SSH.

**1. Skróty klawiszowe oszczędzające godziny pracy:**
Przełączanie ręki między klawiaturą a myszką przy każdym pliku wybija z rytmu. Opanuj pięć podstawowych skrótów:
- **\`Ctrl + P\` (Mac: \`Cmd + P\`):** Błyskawiczne przechodzenie do dowolnego pliku w projekcie po fragmentach nazwy (np. wpisujesz \`navbar\` i naciskasz Enter).
- **\`Ctrl + Shift + P\` (Mac: \`Cmd + Shift + P\`):** Paleta poleceń (*Command Palette*) — uruchamiasz z niej restart TypeScriptu, formatowanie dokumentu czy komendy Gita.
- **\`Ctrl + D\`:** Wielokursorowe zaznaczanie kolejnych wystąpień tej samej nazwy zmiennej lub klasy CSS i edycja wszystkich miejsc naraz.
- **\`Alt + Strzałka Góra/Dół\`:** Płynne przesuwanie całych wierszy lub zaznaczonego bloku kodu bez wycinania i wklejania.
- **\`Ctrl + ~\` (tylda):** Natychmiastowe otwieranie i ukrywanie wbudowanego terminala.

**2. Duet jakości: Prettier + ESLint (Styl vs Poprawność):**
Początkujący często mylą te dwa narzędzia, choć pełnią zupełnie inne role:
- **Prettier (Formater):** Odpowiada wyłącznie za estetykę zapisu — spójne wcięcia, cudzysłowy, średniki i łamanie zbyt długich linii. Gdy włączysz opcję **Format On Save**, po każdym naciśnięciu \`Ctrl + S\` cały plik układa się w ułamku sekundy, kończąc jałowe dyskusje o spacjach na Code Review.
- **ESLint (Linter):** Analizuje drzewo składniowe kodu w poszukiwaniu realnych błędów i ryzykownych wzorców — ostrzega przed nieużywanymi zmiennymi, brakującymi importami, nieskończonymi pętlami efektów w React czy niebezpiecznym typem \`any\`.

**3. Konfiguracja zespołowa w repozytorium:**
Współdzielone pliki \`.prettierrc\`, \`eslint.config.js\` oraz folder \`.vscode/settings.json\` sprawiają, że każdy nowy programista otwierający projekt ma identyczne zasady formatowania od pierwszej minuty.`,
      codeExamples: [
        {
          title: 'Przykładowy plik konfiguracyjny .prettierrc w projekcie',
          language: 'json',
          code: `{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}`,
          explanation: 'Plik .prettierrc w głównym katalogu gwarantuje, że każdy programista w zespole formatuje kod identycznie.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zainstaluj rozszerzenia ESLint i Prettier', description: 'Otwórz zakładkę Extensions (Ctrl+Shift+X) w VS Code.' },
        { step: 2, title: 'Włącz Format On Save', description: 'W ustawieniach VS Code zaznacz Editor: Format On Save.' },
        { step: 3, title: 'Przetestuj wielokursor (Ctrl+D)', description: 'Zaznacz nazwę zmiennej i naciśnij Ctrl+D trzykrotnie, aby zmienić ją w 3 miejscach naraz.' },
      ],
      interactiveExercise: {
        id: 'ex-fund-vscode',
        title: 'Karta skrótów klawiszowych IDE',
        instructions: 'Zbuduj w HTML ściągawkę skrótów klawiszowych: użyj znacznika <kbd> dla skrótu "Ctrl + P" oraz drugiego znacznika <kbd> dla "Ctrl + Shift + P" wewnątrz kontenera z klasą shortcuts.',
        task: 'Utwórz kontener .shortcuts ze znacznikami <kbd>Ctrl + P</kbd> oraz <kbd>Ctrl + Shift + P</kbd>.',
        starterCode: {
          html: '<!-- Zbuduj ściągawkę ze znacznikami <kbd> -->\n',
          css: '.shortcuts { background: #1e293b; color: #f8fafc; padding: 16px; border-radius: 10px; font-family: sans-serif; }\nkbd { background: #334155; border: 1px solid #475569; border-radius: 4px; padding: 2px 6px; font-family: monospace; color: #38bdf8; }',
          js: 'console.log("Ściągawka VS Code gotowa!");',
        },
        solutionCode: {
          html: '<div class="shortcuts">\n  <p><kbd>Ctrl + P</kbd> — Szybkie szukanie pliku</p>\n  <p><kbd>Ctrl + Shift + P</kbd> — Paleta poleceń</p>\n</div>',
          css: '.shortcuts { background: #1e293b; color: #f8fafc; padding: 16px; border-radius: 10px; font-family: sans-serif; }\nkbd { background: #334155; border: 1px solid #475569; border-radius: 4px; padding: 2px 6px; font-family: monospace; color: #38bdf8; }',
          js: 'console.log("Ściągawka VS Code gotowa!");',
        },
        hints: [
          'Użyj <div class="shortcuts"> jako kontenera.',
          'Semantyczny tag HTML dla klawiszy klawiatury to <kbd>.',
          'Wpisz <kbd>Ctrl + P</kbd> oraz <kbd>Ctrl + Shift + P</kbd>.',
        ],
        rules: [
          { id: 'r1', description: 'Znacznik semantyczny <kbd> użyty w kodzie', ruleType: 'html_tag_exists', target: 'kbd' },
          { id: 'r2', description: 'Skrót Ctrl + P obecny', ruleType: 'html_contains', target: 'Ctrl + P' },
          { id: 'r3', description: 'Klasa shortcuts obecna', ruleType: 'html_contains', target: 'shortcuts' },
        ],
      },
      independentTask: {
        title: 'Paleta poleceń w naszej Akademii',
        instructions: 'Naciśnij teraz na klawiaturze Ctrl + K (lub Cmd + K), aby otworzyć wbudowaną w naszą Akademię Paletę Poleceń wzorowaną na VS Code!',
        expectedOutcome: 'Natychmiastowe wyszukiwanie dowolnej lekcji i symulatora bez użycia myszy.',
        starterHint: 'Skrót Ctrl+K działa z każdego miejsca w aplikacji.',
      },
      quiz: [
        {
          id: 'q-f-vsc-1',
          question: 'Czym różni się zadanie narzędzia Prettier od narzędzia ESLint?',
          options: [
            'Prettier formatuje styl i wcięcia kodu, a ESLint wykrywa błędy składniowe i potencjalne usterki logiczne',
            'Prettier służy do baz danych, a ESLint do grafiki 3D',
            'Nie ma żadnej różnicy',
            'ESLint działa tylko na systemie macOS',
          ],
          correctAnswer: 0,
          explanation: 'Prettier dba o estetykę i spójne formatowanie, natomiast ESLint chroni przed błędami w kodzie.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Ręczne wyrównywanie wcięć spacjami w każdym pliku',
          whyItHappens: 'Brak skonfigurowanego formatera Prettier z opcją Format On Save.',
          howToFix: 'Pozwól automatowi formatować kod przy każdym zapisie pliku (Ctrl+S). Oszczędzisz dziesiątki godzin.',
          badCode: 'function test(){const a=1;return a;} // Nieczytelny, zbity kod',
          goodCode: 'function test() {\n  const a = 1;\n  return a;\n}',
        },
      ],
      practicalTask: {
        title: 'Konfiguracja własnego pliku .prettierrc',
        brief: 'Stwórz w głównym katalogu projektu plik .prettierrc i przetestuj automatyczne formatowanie przy zapisie.',
        steps: ['Utwórz plik .prettierrc', 'Wklej konfigurację JSON', 'Zapisz plik skrótem Ctrl+S'],
        deliverable: 'Automatycznie sformatowany kod zgodny ze standardem zespołowym.',
      },
      completionCriteria: [
        'Poznanie skrótów VS Code i znacznika <kbd>',
        'Zrozumienie roli Prettier i ESLint',
        'Zaliczenie quizu min. 80%',
      ],
    },
    {
      id: 'fund-4',
      moduleId: 1,
      moduleTitle: 'Fundamenty programowania',
      title: 'Terminal, wiersz poleceń i zarządzanie systemem plików',
      slug: 'terminal-bash-system-plikow',
      durationMinutes: 30,
      xpReward: 60,
      order: 4,
      summary: 'Opanuj terminal — podstawowe narzędzie każdego profesjonalnego developera. Naucz się poruszać po katalogach, tworzyć i edytować pliki oraz instalować pakiety.',
      objectives: [
        'Zrozumieć strukturę drzewa katalogów w systemach Linux i macOS',
        'Opanować kluczowe polecenia: pwd, ls, cd, mkdir, touch, rm, cat',
        'Poznać potoki, łączenie komend operatorem && i strukturę katalogów projektu',
      ],
      prerequisites: ['Lekcja 1-3 z modułu Fundamenty'],
      theoryMarkdown: `**Terminal (wiersz poleceń)** to tekstowy interfejs komunikacji z powłoką systemu operacyjnego (*Bash*, *Zsh*). Choć na początku okno z migającym kursorem może wydawać się surowe, w pracy Full Stack Developera jest szybsze i bardziej precyzyjne niż przeklikiwanie dziesiątek okienek — używasz go codziennie do instalacji paczek \`npm\`, pracy z Gitem, uruchamiania testów, budowania kontenerów Docker i łączenia się przez SSH z serwerem Linux VPS.

**1. Nawigacja i operacje na plikach, które musisz znać:**
- **\`pwd\`** (*Print Working Directory*) — wyświetla pełną ścieżkę bieżącego katalogu, w którym się znajdujesz.
- **\`ls -la\`** — listuje zawartość folderu ze szczegółami uprawnień i rozmiaru; flaga \`-a\` ujawnia ukryte pliki konfiguracyjne zaczynające się od kropki (np. \`.env\`, \`.gitignore\`, \`.git/\`).
- **\`cd ścieżka\`** — zmienia katalog; \`cd ..\` cofa o jeden poziom wyżej, a \`cd ~\` wraca do Twojego katalogu domowego.
- **\`mkdir -p src/components/ui\`** — tworzy od razu całe drzewo zagnieżdżonych folderów.
- **\`touch index.ts\`** — błyskawicznie tworzy nowy, pusty plik.
- **\`cat\` / \`head -n 20\` / \`tail -f\`** — podgląda zawartość plików i śledzi logi serwera na żywo bez otwierania ciężkiego edytora.
- **\`rm -rf katalog\`** — nieodwracalnie usuwa katalog (w terminalu nie ma Kosza — przed wciśnięciem Enter dwa razy sprawdź ścieżkę!).

**2. Łączenie poleceń i przekierowania (\`&&\`, \`|\`, \`>\`):**
- Operator **\`&&\`** uruchamia kolejne polecenie wyłącznie wtedy, gdy poprzednie zakończyło się sukcesem (kod wyjścia \`0\`), np. \`npm run build && npm test\`.
- Potok **\`|\`** (*pipe*) przekazuje wynik pierwszego programu jako wejście drugiego, np. \`ls -la | grep ".env"\`.
- Wskazówka produktywności: używaj klawisza **\`Tab\`** do autouzupełniania długich nazw plików oraz strzałki w górę lub **\`Ctrl + R\`** do przeszukiwania historii wcześniejszych poleceń.`,
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
      id: 'fund-5',
      moduleId: 1,
      moduleTitle: 'Fundamenty programowania',
      title: 'Zmienne środowiskowe (.env), bezpieczeństwo sekretów i plik .gitignore',
      slug: 'terminal-unix-system-plikow-env',
      durationMinutes: 30,
      xpReward: 60,
      order: 5,
      summary: 'Dowiedz się, jak profesjonalnie przechowywać hasła do baz danych, klucze API i konfigurację serwerową w plikach .env oraz chronić je przed przypadkowym wysłaniem na GitHub.',
      objectives: [
        'Zrozumieć rolę zmiennych środowiskowych w oddzieleniu konfiguracji od kodu',
        'Zabezpieczać klucze API przed wyciekiem na GitHub za pomocą pliku .gitignore',
        'Stosować pliki .env.example jako wzorzec konfiguracyjny dla zespołu',
      ],
      prerequisites: ['Lekcja 4: Terminal i system plików'],
      theoryMarkdown: `Hasła do produkcyjnej bazy PostgreSQL, tajne klucze Stripe do pobierania płatności, tokeny OAuth oraz sekrety podpisujące JWT **nigdy nie mogą trafić na sztywno do kodu źródłowego**. Zgodnie z metodologią *Twelve-Factor App* konfigurację zależną od środowiska oddzielamy od logiki aplikacji za pomocą **zmiennych środowiskowych (Environment Variables)**.

**1. Plik \`.env\` — lokalne centrum konfiguracji:**
W pliku \`.env\` trzymamy pary \`KLUCZ=WARTOŚĆ\`, które różnią się między komputerem programisty, serwerem testowym a produkcją:
\`\`\`bash
# .env (Plik wyłącznie lokalny — NIGDY nie wysyłaj go do repozytorium!)
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:tajne_haslo@localhost:5432/db
JWT_SECRET=super_dlugi_losowy_ciag_znakow
\`\`\`
Po stronie backendu (Node.js/Express) odczytujemy te dane bezpiecznie przez obiekt \`process.env\`. Pamiętaj o zasadniczym podziale w projektach Vite/React: każda zmienna zaczynająca się od \`VITE_\` trafia do publicznej paczki przeglądarkowej i **każdy użytkownik może ją odczytać w DevTools**, dlatego klucze prywatne zawsze zostają wyłącznie na serwerze!

**2. Strażnik \`.gitignore\` i dlaczego wyciek to realny problem:**
Zautomatyzowane skanery nieustannie przeszukują nowe publiczne commity na GitHubie w poszukiwaniu kluczy API i haseł do baz danych — skradziony klucz chmurowy bywa wykorzystany w ciągu kilkudziesięciu sekund. Dlatego wpisanie \`.env\`, \`.env.local\` oraz \`node_modules/\` do pliku **\`.gitignore\`** to absolutnie pierwsza czynność przed \`git init\`.

**3. Wzorzec \`.env.example\` i walidacja przy starcie serwera:**
Ponieważ prawdziwy plik \`.env\` nie trafia do Gita, do repozytorium dodajemy bezpieczny szablon **\`.env.example\`** zawierający nazwy wszystkich wymaganych kluczy bez wrażliwych wartości. Dobrą praktyką produkcyjną jest także walidacja zmiennych przy starcie aplikacji (np. przy użyciu Zod) — jeśli brakuje \`DATABASE_URL\`, serwer od razu zgłasza jasny błąd zamiast wybuchnąć po cichu dopiero przy pierwszym logowaniu użytkownika.`,
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
        id: 'ex-fund-5',
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
          id: 'q-fund5-1',
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
        'Zrozumienie roli plików .env i .gitignore',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'fund-6',
      moduleId: 1,
      moduleTitle: 'Fundamenty programowania',
      title: 'Sztuka debugowania: jak czytać Stack Trace, błędy i logi',
      slug: 'debugowanie-stack-trace-bledy',
      durationMinutes: 30,
      xpReward: 60,
      order: 6,
      summary: 'Ponad 50% czasu pracy developera to znajdowanie i naprawianie usterek. Naucz się czytać komunikaty błędów, Stack Trace oraz korzystać z debuggera i konsoli.',
      objectives: [
        'Rozróżniać typy błędów: SyntaxError, ReferenceError, TypeError, Logic Errors',
        'Czytać ślad stosu wywołań (Stack Trace) od góry do dołu, lokalizując numer pliku i linii',
        'Stosować profesjonalne techniki logowania: console.log, console.error, console.table, breakpointy',
      ],
      prerequisites: ['Lekcje 1-5 z modułu Fundamenty'],
      theoryMarkdown: `Wielu początkujących traktuje czerwony komunikat błędu w konsoli jak powód do paniki. W rzeczywistości **komunikat błędu i ślad stosu (Stack Trace)** to najlepszy przyjaciel programisty — precyzyjny raport wskazujący dokładny plik, numer linii oraz powód zatrzymania programu. Spokojne, metodyczne debugowanie to jedna z najważniejszych umiejętności odróżniających samodzielnego inżyniera od osoby kopiującej kod na ślepo.

**1. Cztery główne kategorie błędów, które spotkasz najczęściej:**
- **SyntaxError (Błąd składni):** Niepoprawny zapis języka — brakujący nawias klamrowy \`}\`, niedomknięty cudzysłów lub literówka w słowie kluczowym. Program nie przechodzi nawet etapu parsowania i w ogóle nie startuje.
- **ReferenceError (Błąd odwołania):** Próba odczytania zmiennej lub funkcji nieistniejącej w bieżącym zasięgu (np. literówka w nazwie lub odwołanie się do \`let\` przed jego deklaracją).
- **TypeError (Błąd typu):** Wywołanie metody lub odczyt pola na wartości złego typu — klasyczne \`Cannot read properties of undefined (reading 'name')\` albo próba użycia \`.map()\` na obiekcie zamiast na tablicy.
- **Logic Error (Błąd logiczny):** Najbardziej podstępny rodzaj usterki — konsola jest czysta, program działa bez awarii, ale oblicza złą kwotę rabatu lub wyświetla niewłaściwy stan przez błędny warunek \`<\` zamiast \`<=\`.

**2. Jak czytać Stack Trace i używać DevTools?**
Ślad stosu pokazany w konsoli czytaj zawsze **od góry do pierwszego wiersza wskazującego na Twój własny plik źródłowy** (np. \`at calculateTotal (cart.ts:42:15)\` — plik \`cart.ts\`, linia 42, znak 15), ignorując na start wewnętrzne ścieżki \`node_modules\`. Jeśli \`console.log()\` nie wystarcza, otwórz w przeglądarce zakładkę **Sources** (lub wpisz słowo \`debugger;\` w kodzie), zatrzymaj wykonanie na *breakpoincie* i podejrzyj na żywo zawartość wszystkich zmiennych oraz kolejność żądań w zakładce **Network**.`,
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
  ],
};
