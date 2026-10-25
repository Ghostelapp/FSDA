import { Module } from '../../types';

export const MODULE_2: Module = {
  id: 2,
  title: 'Podstawy HTML — Tworzenie Pierwszych Stron od Zera',
  category: 'Podstawy',
  description: 'Rozpocznij naukę całkowicie od zera! Poznaj proste znaczniki HTML, nagłówki, akapity, listy, obrazki, linki oraz budowę kompletnej strony internetowej krok po kroku.',
  badgeName: 'Mistrz Semantyki HTML5',
  badgeIcon: 'FileCode2',
  durationHours: 24,
  totalXp: 840,
  prerequisites: ['Brak — kurs zaczynamy całkowicie od zera!'],
  topics: [
    'Anatomia dokumentu HTML5, DOCTYPE i struktura drzewa DOM',
    'Typografia, formatowanie tekstu (h1-h6, p, strong, em, blockquote, code) i encje HTML',
    'Listy (ul, ol, dl), linki wewnętrzne/zewnętrzne oraz ścieżki względne i bezwzględne',
    'Elementy blokowe vs liniowe (div vs span) oraz atrybuty globalne (id, class, data-*)',
    'Znaczniki semantyczne: header, nav, main, article, section, aside, footer',
    'Nowoczesne formularze: input types, walidacja atrybutowa, label i dostępność',
    'Multimedia, hiperłącza i tabele danych: img, picture, audio, a, table, aria-labels',
    'Dostępność (a11y/WCAG), meta tagi i techniczne SEO dla developerów',
    'Nowoczesne audio, video i grafika rastrowa/wektorowa w HTML5',
  ],
  projectBrief: 'Projekt końcowy modułu: Kompletna, semantyczna strona portfolio programisty spełniająca normy WCAG 2.1 AA.',
  lessons: [
    {
      id: 'html-1',
      moduleId: 2,
      moduleTitle: 'HTML — Semantyczna Architektura Stron',
      title: 'Anatomia dokumentu HTML5, DOCTYPE i struktura DOM',
      slug: 'anatomia-dokumentu-html5',
      durationMinutes: 30,
      xpReward: 60,
      order: 1,
      summary: 'Poznaj 4 proste elementy, z których składa się każda strona internetowa na świecie: deklarację <!DOCTYPE html>, korzeń <html>, zaplecze <head> oraz widoczną część <body>.',
      objectives: [
        'Zrozumieć 4 podstawowe części każdego pliku HTML (DOCTYPE, html, head, body)',
        'Wiedzieć dlaczego polskie znaki (ą, ę, ł) wymagają linijki <meta charset="UTF-8">',
        'Stworzyć swój pierwszy nagłówek <h1> oraz akapit tekstu <p> wewnątrz sekcji <body>',
      ],
      prerequisites: ['Brak — zaczynamy naukę HTML od podstaw'],
      theoryMarkdown: `Każda strona internetowa to zwykły plik tekstowy z końcówką \`.html\`. Składa się on ze **znaczników (tagów)** zapisywanych w nawiasach ostrokątnych, np. \`<h1>Tytuł</h1>\`. Większość znaczników występuje w parach: znacznik otwierający \`<h1>\` oraz zamykający z ukośnikiem \`</h1>\`.

Każda nowoczesna strona zaczyna się od tych **4 prostych klocków**:

1. **\`<!DOCTYPE html>\`**: Pierwsza linijka na samej górze pliku. Mówi przeglądarce wprost: *„To jest nowoczesna strona napisana w standardzie HTML5”*.
2. **\`<html lang="pl">\`**: Główny kontener otaczający całą stronę. Dopisek \`lang="pl"\` informuje przeglądarkę i tłumacza Google, że strona jest po polsku.
3. **\`<head>\`**: Niewidoczne zaplecze techniczne strony. Tutaj wpisujemy tytuł widoczny na karcie przeglądarki (\`<title>\`) oraz obsługę polskich znaków (\`<meta charset="UTF-8">\`).
4. **\`<body>\`**: Widoczna część strony! Wszystko, co wpiszesz pomiędzy \`<body>\` a \`</body>\` — nagłówki \`<h1>\`, akapity \`<p>\`, zdjęcia i przyciski — pojawi się na ekranie użytkownika.`,
      codeExamples: [
        {
          title: 'Wzorcowy szkielet dokumentu HTML5',
          language: 'html',
          code: `<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Portfolio Junior Full Stack | Jan Kowalski</title>
  </head>
  <body>
    <h1>Witaj w moim świecie kodu</h1>
    <p>Uczę się tworzyć wydajne aplikacje internetowe.</p>
  </body>
</html>`,
          explanation: 'Metatag viewport zapewnia poprawne skalowanie strony na smartfonach (szerokość ekranu urządzenia i skala początkowa 1.0).',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Dodaj deklarację standardu HTML5', description: 'Na samej górze pliku zawsze wpisuj <!DOCTYPE html>.' },
        { step: 2, title: 'Zadeklaruj element nadrzędny html z atrybutem lang', description: 'Zapewnij wsparcie dla polskiej fonetyki czytników ekranu za pomocą lang="pl".' },
        { step: 3, title: 'Skonfiguruj sekcję head', description: 'Dodaj meta charset="UTF-8", meta name="viewport" oraz znacznik <title>.' },
        { step: 4, title: 'Wypełnij sekcję body treścią', description: 'Użyj nagłówka najwyższego rzędu <h1> oraz akapitów <p>.' },
      ],
      interactiveExercise: {
        id: 'ex-html-1',
        title: 'Zbuduj poprawną strukturę dokumentu HTML5',
        instructions: 'Twoim zadaniem jest stworzenie kompletnej struktury dokumentu HTML5: zdefiniuj <!DOCTYPE html>, element <html> z atrybutem lang="pl", sekcję <head> z tagiem <title> oraz <body> zawierające znacznik <h1> z Twoim nazwiskiem lub nickiem.',
        task: 'Uzupełnij kod w edytorze o prawidłową strukturę HTML5 z sekcjami head i body.',
        starterCode: {
          html: '<!DOCTYPE html>\n<html lang="pl">\n  <head>\n    <title>Moja Pierwsza Strona</title>\n  </head>\n  <body>\n    <!-- Dodaj poniżej nagłówek h1 -->\n    \n  </body>\n</html>',
          css: 'body { font-family: "Segoe UI", sans-serif; padding: 24px; background: #f8fafc; color: #0f172a; }\nh1 { color: #2563eb; font-size: 1.8rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }',
          js: 'console.log("Inicjalizacja dokumentu HTML5 udana.");',
        },
        solutionCode: {
          html: '<!DOCTYPE html>\n<html lang="pl">\n  <head>\n    <title>Moja Pierwsza Strona</title>\n  </head>\n  <body>\n    <h1>Jan Kowalski - Programista</h1>\n    <p>Rozpoczynam podróż ku stanowisku Full Stack Developera.</p>\n  </body>\n</html>',
          css: 'body { font-family: "Segoe UI", sans-serif; padding: 24px; background: #f8fafc; color: #0f172a; }\nh1 { color: #2563eb; font-size: 1.8rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }',
          js: 'console.log("Inicjalizacja dokumentu HTML5 udana.");',
        },
        hints: [
          'Upewnij się, że nie usunąłeś deklaracji <!DOCTYPE html>.',
          'W sekcji <body> umieść znacznik <h1>Tekst</h1>.',
          'Sprawdź czy znacznik <h1> ma domknięcie </h1>.',
        ],
        rules: [
          { id: 'r1', description: 'Deklaracja <!DOCTYPE html> obecna', ruleType: 'html_contains', target: '<!doctype html>' },
          { id: 'r2', description: 'Atrybut lang="pl" obecny w znaczniku html', ruleType: 'html_attr_exists', target: 'lang', param: 'pl' },
          { id: 'r3', description: 'Sekcja <head> oraz tag <title> istnieją', ruleType: 'html_tag_exists', target: 'title' },
          { id: 'r4', description: 'W sekcji body znajduje się nagłówek <h1>', ruleType: 'html_tag_exists', target: 'h1' },
        ],
      },
      independentTask: {
        title: 'Rozbudowa nagłówków i akapitów',
        instructions: 'Dodaj w sekcji body pod nagłówkiem h1 sekcję z podtytułem <h2>O mnie</h2> oraz dwoma akapitami tekstu opisującymi Twoje cele.',
        expectedOutcome: 'Czytelna hierarchia typograficzna z zachowaniem relacji h1 -> h2.',
        starterHint: 'Pamiętaj: nigdy nie pomijaj poziomów nagłówków (nie skacz z h1 od razu do h4).',
      },
      quiz: [
        {
          id: 'q-h1-1',
          question: 'Dlaczego deklaracja <!DOCTYPE html> jest bezwzględnie wymagana na początku pliku?',
          options: [
            'Informuje serwer bazy danych jak szyfrować rekordy',
            'Zapobiega uruchomieniu przez przeglądarkę trybu Quirks Mode i wymusza standard HTML5',
            'Kompiluje kod do języka maszynowego WebAssembly',
            'Wymusza instalację biblioteki Tailwind CSS',
          ],
          correctAnswer: 1,
          explanation: 'Brak <!DOCTYPE html> powoduje wejście w tryb Quirks Mode, w którym przeglądarka emuluje błędy z lat 90.',
        },
        {
          id: 'q-h1-2',
          question: 'Który tag powinien zawierać metadane takie jak kodowanie znaków czy tytuł karty?',
          options: ['<footer>', '<body>', '<head>', '<meta-zone>'],
          correctAnswer: 2,
          explanation: 'Tag <head> przeznaczony jest wyłącznie na metadane opisujące dokument i zasoby zewnętrzne.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Umieszczanie elementów widocznych (tekst, przyciski) bezpośrednio w sekcji <head>',
          whyItHappens: 'Niezrozumienie rozgraniczenia między metadanymi (<head>) a interfejsem użytkownika (<body>).',
          howToFix: 'Wszystkie elementy wizualne muszą znajdować się wewnątrz kontenera <body>.',
          badCode: '<head>\n  <title>Moja strona</title>\n  <button>Kliknij mnie</button> <!-- BŁĄD -->\n</head>',
          goodCode: '<head>\n  <title>Moja strona</title>\n</head>\n<body>\n  <button>Kliknij mnie</button> <!-- PRAWIDŁOWO -->\n</body>',
        },
      ],
      practicalTask: {
        title: 'Własny plik index.html',
        brief: 'Utwórz lokalnie plik index.html w edytorze kodu i otwórz go bezpośrednio w przeglądarce.',
        steps: ['Stwórz katalog "nauka-html"', 'Utwórz w nim plik index.html', 'Wpisz poprawny szkielet HTML5'],
        deliverable: 'Działający plik HTML wyświetlający treść bez błędów kodowania znaków.',
      },
      completionCriteria: [
        'Poprawnie zdefiniowany szkielet HTML5',
        'Pomyślnie zwalidowane ćwiczenie z nagłówkiem i akapitem',
        'Wynik quizu na poziomie minimum 80%',
      ],
    },
    {
      id: 'html-7',
      moduleId: 1,
      moduleTitle: 'Podstawy HTML — Tworzenie Pierwszych Stron od Zera',
      title: 'Pierwsze znaczniki HTML: Nagłówki (h1–h6), akapity (p) i pogrubienie (strong)',
      slug: 'tekst-typografia-formatowanie-html',
      durationMinutes: 20,
      xpReward: 60,
      order: 1,
      summary: 'Witaj na pierwszej lekcji kursu! Dowiedz się całkowicie od zera, czym są znaczniki HTML i napisz swój pierwszy nagłówek, akapit tekstu oraz pogrubienie.',
      objectives: [
        'Zrozumieć czym jest znacznik (tag) otwierający np. <h1> i zamykający </h1>',
        'Tworzyć nagłówki od największego <h1> do mniejszych <h2> i <h3> oraz akapity tekstu <p>',
        'Wyróżniać ważne słowa pogrubieniem <strong>, kodem <code> oraz cytatem <blockquote>',
      ],
      prerequisites: ['Brak — zaczynamy całkowicie od zera!'],
      theoryMarkdown: `Witaj na pierwszej lekcji! Każda strona internetowa na świecie — od prostego bloga po YouTube czy Allegro — zaczyna się od języka **HTML**. Nie musisz nic instalować ani znać matematyki: HTML to po prostu układanie tekstu za pomocą prostych etykiet zwanych **znacznikami (tagami)**.

**1. Jak działa znacznik HTML?**
W HTML otaczamy tekst słowem w nawiasach ostrokątnych \`< >\`. Niemal każdy znacznik występuje w parze:
- **Znacznik otwierający:** np. \`<h1>\` (mówi przeglądarce: *„tu zaczyna się główny tytuł”*),
- **Znacznik zamykający (z ukośnikiem \`/\`):** np. \`</h1>\` (mówi: *„tu kończy się tytuł”*).

**2. Nagłówki (\`<h1>\` – \`<h6>\`) i akapity (\`<p>\`):**
- **\`<h1>\`** — Najważniejszy, największy tytuł na stronie (używamy jednego głównego \`<h1>\` na podstronę).
- **\`<h2>\`** — Tytuł rozdziału lub sekcji pod głównym tytułem.
- **\`<h3>\`** — Mniejszy podtytuł wewnątrz rozdziału \`<h2>\`.
- **\`<p>\`** — Zwykły akapit tekstu (od ang. *paragraph*). Każdy nowy akapit zamykamy w osobnym \`<p>...</p>\`.

**3. Wyróżnianie ważnych słów w tekście:**
- **\`<strong>\`:** Pogrubia najważniejsze słowa w zdaniu (np. \`<strong>ważna informacja</strong>\`).
- **\`<em>\`:** Pochyla tekst (kursywa), aby położyć nacisk na dane słowo.
- **\`<code>\`:** Wyróżnia krótką nazwę polecenia lub kodu komputerowego w zdaniu.
- **\`<blockquote>\`:** Tworzy ładnie wcięty cytat lub złotą myśl.`,
      codeExamples: [
        {
          title: 'Twoja pierwsza strona z tytułem, akapitem i cytatem',
          language: 'html',
          code: `<h1>Moja pierwsza strona w HTML</h1>
<h2>Dlaczego uczę się tworzenia stron?</h2>
<p>
  Tworzenie stron w języku <strong>HTML</strong> jest proste i daje natychmiastowy efekt.
  Wystarczy wpisać znacznik <code>&lt;h1&gt;</code>, aby wyświetlić duży nagłówek!
</p>
<blockquote>
  "Każdy ekspert był kiedyś początkującym, który napisał swoją pierwszą linijkę kodu."
</blockquote>`,
          explanation: 'Zwróć uwagę, że każdy znacznik otwarty np. <h2> lub <p> ma na końcu swoje zamknięcie z ukośnikiem </h2> oraz </p>.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Napisz nagłówek <h2>', description: 'Wpisz <h2>Tytuł notatki</h2> w edytorze poniżej.' },
        { step: 2, title: 'Dodaj akapit <p> z pogrubieniem <strong> i kodem <code>', description: 'Wewnątrz <p>...</p> umieść <strong>ważne słowo</strong> oraz <code>kod</code>.' },
        { step: 3, title: 'Dodaj cytat <blockquote>', description: 'Na końcu dopisz <blockquote>Twój ulubiony cytat</blockquote>.' },
      ],
      interactiveExercise: {
        id: 'ex-html-text',
        title: 'Napisz swój pierwszy kod HTML: nagłówek, akapit i cytat',
        instructions: 'W edytorze HTML poniżej przygotowaliśmy już początek kodu. Dopisz brakujące elementy lub uzupełnij szablon tak, aby zawierał: nagłówek <h2>, akapit <p> z pogrubieniem <strong> i znacznikiem <code>, oraz cytat <blockquote>.',
        task: 'Użyj w kodzie HTML znaczników: <h2>, <p>, <strong>, <code> oraz <blockquote>.',
        starterCode: {
          html: '<!-- 1. Nagłówek drugiego stopnia: -->\n<h2>Moja pierwsza notatka z HTML</h2>\n\n<!-- 2. Akapit z pogrubieniem <strong> i znacznikiem <code>: -->\n<p>Uczę się <strong>podstaw HTML</strong> i znam już znacznik <code>h2</code>.</p>\n\n<!-- 3. Dopisz poniżej cytat w znaczniku <blockquote>Tekst cytatu</blockquote>: -->\n',
          css: 'body { font-family: system-ui, sans-serif; padding: 20px; line-height: 1.6; color: #1e293b; }\ncode { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #db2777; font-family: monospace; }\nblockquote { border-left: 4px solid #4f46e5; padding-left: 14px; color: #475569; font-style: italic; margin: 16px 0; }',
          js: 'console.log("Brawo! Twój pierwszy kod HTML działa.");',
        },
        solutionCode: {
          html: '<h2>Moja pierwsza notatka z HTML</h2>\n<p>Uczę się <strong>podstaw HTML</strong> i znam już znacznik <code>h2</code>.</p>\n<blockquote>Każda wielka strona internetowa zaczyna się od pierwszego znacznika HTML.</blockquote>',
          css: 'body { font-family: system-ui, sans-serif; padding: 20px; line-height: 1.6; color: #1e293b; }\ncode { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #db2777; font-family: monospace; }\nblockquote { border-left: 4px solid #4f46e5; padding-left: 14px; color: #475569; font-style: italic; margin: 16px 0; }',
          js: 'console.log("Brawo! Twój pierwszy kod HTML działa.");',
        },
        hints: [
          'Nagłówek <h2> i akapit <p> ze <strong> oraz <code> są już gotowe w edytorze!',
          'Na samym dole dopisz linijkę: <blockquote>Krok po kroku do celu!</blockquote>',
          'Kliknij przycisk „Uruchom i sprawdź kod” lub „Rozwiązanie”, jeśli chcesz zobaczyć gotowy wzór.',
        ],
        rules: [
          { id: 'r1', description: 'Znacznik <strong> obecny w kodzie', ruleType: 'html_tag_exists', target: 'strong' },
          { id: 'r2', description: 'Znacznik <code> obecny w kodzie', ruleType: 'html_tag_exists', target: 'code' },
          { id: 'r3', description: 'Cytat blokowy <blockquote> obecny', ruleType: 'html_tag_exists', target: 'blockquote' },
        ],
      },
      independentTask: {
        title: 'Wieloliniowy blok kodu z <pre><code>',
        instructions: 'Wyświetl 3-linijkowy fragment kodu HTML na stronie, używając kombinacji <pre><code> oraz encji &lt; i &gt;.',
        expectedOutcome: 'Wyświetlenie surowych nawiasów ostrokątnych na ekranie bez ich zinterpretowania przez przeglądarkę.',
        starterHint: 'Wpisz &lt;div&gt;Tekst&lt;/div&gt; wewnątrz <pre><code>.',
      },
      quiz: [
        {
          id: 'q-h7-1',
          question: 'Jaka jest kluczowa różnica między znacznikiem <strong> a znacznikiem <b>?',
          options: [
            '<strong> nadaje tekstowi semantyczną ważność (istotną dla czytników ekranu i SEO), natomiast <b> to wyłącznie pogrubienie wizualne',
            '<b> działa tylko w starych przeglądarkach',
            '<strong> zmienia kolor czcionki na czerwony',
            'Nie ma między nimi żadnej różnicy',
          ],
          correctAnswer: 0,
          explanation: 'W nowoczesnym HTML5 zawsze preferujemy <strong> i <em> ze względu na dostępność cyfrową.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Używanie wielokrotnych znaczników <br><br><br> do robienia odstępów między akapitami',
          whyItHappens: 'Traktowanie dokumentu HTML jak edytora Word (wielokrotne wciskanie Entera).',
          howToFix: 'Każdy akapit zamykaj w osobnym tagu <p>, a wielkość odstępów reguluj w CSS za pomocą margin-bottom.',
          badCode: 'Pierwszy akapit<br><br><br>Drugi akapit',
          goodCode: '<p>Pierwszy akapit</p>\n<p>Drugi akapit</p>',
        },
      ],
      practicalTask: {
        title: 'Wpis blogowy z hierarchią h1-h3',
        brief: 'Napisz krótki artykuł techniczny zawierający h1, dwie sekcje h2, podsekcję h3, cytat oraz przykład kodu.',
        steps: ['Stwórz strukturę nagłówków', 'Dodaj wyróżnienia strong i em', 'Dodaj stopkę ze znakiem &copy;'],
        deliverable: 'Wzorcowo sformatowany tekst gotowy pod SEO.',
      },
      completionCriteria: [
        'Zrozumienie hierarchii nagłówków i semantyki tekstu',
        'Poprawne rozwiązanie ćwiczenia z strong, code i blockquote',
        'Zaliczenie quizu min. 80%',
      ],
    },
    {
      id: 'html-8',
      moduleId: 2,
      moduleTitle: 'HTML — Semantyczna Architektura Stron',
      title: 'Listy (ul, ol, dl), nawigacja kotwicowa i ścieżki względne vs bezwzględne',
      slug: 'listy-linki-sciezki-wzgledne',
      durationMinutes: 30,
      xpReward: 65,
      order: 3,
      summary: 'Naucz się grupować informacje w listy punktowane, numerowane i definicyjne oraz opanuj zasady adresowania plików w projekcie (ścieżki względne ./ i ../ vs bezwzględne).',
      objectives: [
        'Tworzyć listy nieuporządkowane <ul>, uporządkowane <ol> oraz słowniki pojęć <dl>/<dt>/<dd>',
        'Rozróżniać ścieżki względne (./img/logo.png, ../index.html) od bezwzględnych (https://...)',
        'Tworzyć nawigację wewnątrz strony (kotwice #id) oraz linki specjalne mailto: i tel:',
      ],
      prerequisites: ['Lekcja 2: Tekst i typografia'],
      theoryMarkdown: `Listy i hiperłącza to spoiwo każdego serwisu internetowego — od menu nawigacyjnych po spisy treści i koszyki zakupowe.

**1. Trzy rodzaje list w HTML5:**
- **\`<ul>\` (Unordered List):** Lista punktowana — gdy kolejność elementów nie ma znaczenia (np. lista funkcji produktu, linki w menu). Bezpośrednim dzieckiem \`<ul>\` może być **wyłącznie** \`<li>\`!
- **\`<ol>\` (Ordered List):** Lista numerowana — gdy liczy się ścisła kolejność kroków (np. przepis, ranking TOP 10, instrukcja instalacji).
- **\`<dl>\` (Description List):** Lista par *termin* (\`<dt>\`) i *opis* (\`<dd>\`) — idealna do sekcji FAQ lub specyfikacji technicznej produktu.

**2. Ścieżki względne vs bezwzględne w atrybucie \`href\` i \`src\`:**
- **Ścieżka bezwzględna (Absolute):** Pełny adres internetowy, np. \`https://developer.mozilla.org\`. Używamy do linkowania obcych stron.
- **Ścieżka względna (Relative):** Wskazuje plik względem obecnego położenia:
  - \`./kontakt.html\` lub \`kontakt.html\` — plik w tym samym folderze,
  - \`./assets/logo.svg\` — wejście do podfolderu \`assets\`,
  - \`../index.html\` — wyjście o jeden folder w górę (\`..\`).

**3. Kotwice (Anchors):**
Link \`<a href="#cennik">Zobacz cennik</a>\` płynnie przewinie stronę do elementu posiadającego atrybut \`id="cennik"\`.`,
      codeExamples: [
        {
          title: 'Nawigacja z kotwicami i lista kroków nauki',
          language: 'html',
          code: `<nav>
  <ul>
    <li><a href="#plan-nauki">Plan nauki</a></li>
    <li><a href="mailto:mentor@academy.dev">Napisz do mentora</a></li>
  </ul>
</nav>

<section id="plan-nauki">
  <h2>3 kroki do zostania Full Stack Developerem</h2>
  <ol>
    <li>Opanuj fundamenty HTML5, CSS3 i JavaScript ES6+</li>
    <li>Zbuduj projekty w React, Node.js i PostgreSQL</li>
    <li>Przygotuj portfolio na GitHubie i aplikuj!</li>
  </ol>
</section>`,
          explanation: 'Kliknięcie w #plan-nauki przenosi użytkownika bezpośrednio do sekcji z id="plan-nauki".',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Wybierz odpowiedni typ listy', description: 'Użyj <ul> dla kolekcji bez kolejności lub <ol> dla kroków numerowanych.' },
        { step: 2, title: 'Umieść elementy w <li>', description: 'Pamiętaj, że tekst wpisujemy zawsze wewnątrz <li>, nigdy bezpośrednio w <ul>.' },
        { step: 3, title: 'Połącz link kotwicowy z id sekcji', description: 'Ustaw href="#sekcja" na linku oraz id="sekcja" na elemencie docelowym.' },
      ],
      interactiveExercise: {
        id: 'ex-html-lists',
        title: 'Zbuduj spis treści z kotwicą i listą uporządkowaną <ol>',
        instructions: 'Stwórz link <a href="#kroki">Przejdź do kroków</a> oraz sekcję z id="kroki" zawierającą listę numerowaną <ol> z przynajmniej dwoma podpunktami <li>.',
        task: 'Utwórz link z href="#kroki" oraz listę <ol> z elementami <li> wewnątrz elementu z id="kroki".',
        starterCode: {
          html: '<!-- Dodaj link kotwicowy oraz sekcję z listą <ol> -->\n',
          css: 'body { font-family: sans-serif; padding: 20px; }\na { color: #4f46e5; font-weight: bold; text-decoration: none; }\nol { background: #f8fafc; padding: 16px 32px; border-radius: 8px; border: 1px solid #e2e8f0; }',
          js: 'console.log("Listy i kotwice gotowe.");',
        },
        solutionCode: {
          html: '<a href="#kroki">Przejdź do kroków</a>\n<div id="kroki">\n  <h3>Etapy wdrożenia</h3>\n  <ol>\n    <li>Analiza wymagań</li>\n    <li>Implementacja i testy</li>\n  </ol>\n</div>',
          css: 'body { font-family: sans-serif; padding: 20px; }\na { color: #4f46e5; font-weight: bold; text-decoration: none; }\nol { background: #f8fafc; padding: 16px 32px; border-radius: 8px; border: 1px solid #e2e8f0; }',
          js: 'console.log("Listy i kotwice gotowe.");',
        },
        hints: [
          'Dodaj <a href="#kroki">Przejdź do kroków</a>.',
          'Utwórz <div id="kroki">.',
          'Wewnątrz dodaj <ol><li>Krok 1</li><li>Krok 2</li></ol>.',
        ],
        rules: [
          { id: 'r1', description: 'Link kotwicowy href="#kroki" obecny', ruleType: 'html_contains', target: '#kroki' },
          { id: 'r2', description: 'Lista uporządkowana <ol> istnieje', ruleType: 'html_tag_exists', target: 'ol' },
          { id: 'r3', description: 'Elementy listy <li> istnieją', ruleType: 'html_tag_exists', target: 'li' },
        ],
      },
      independentTask: {
        title: 'Sekcja FAQ oparta o listę definicji <dl>',
        instructions: 'Zbuduj słowniczek 3 pojęć (HTML, CSS, JS) za pomocą znaczników <dl>, <dt> (nazwa technologii) oraz <dd> (wyjaśnienie).',
        expectedOutcome: 'Semantyczny słownik pojęć bez nadmiarowych divów.',
        starterHint: '<dl><dt>HTML</dt><dd>Struktura strony</dd></dl>',
      },
      quiz: [
        {
          id: 'q-h8-1',
          question: 'Który element może być bezpośrednim dzieckiem listy <ul> lub <ol> zgodnie ze specyfikacją HTML5?',
          options: [
            'Dowolny znacznik, np. <p> lub <h2>',
            'Wyłącznie element <li> (oraz pomocniczo <script> lub <template>)',
            'Tylko znacznik <span>',
            'Tylko znacznik <a>',
          ],
          correctAnswer: 1,
          explanation: 'Wszelkie nagłówki, linki czy obrazki w liście muszą znajdować się WEWNĄTRZ elementu <li>, nigdy bezpośrednio pod <ul>.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Umieszczanie linków <a> wokół elementów <li> zamiast wewnątrz nich',
          whyItHappens: 'Chęć uczynienia całego wiersza listy klikalnym.',
          howToFix: 'Zawsze umieszczaj <a> wewnątrz <li> (<li><a href="...">Tekst</a></li>), a w CSS nadaj linkowi display: block.',
          badCode: '<ul>\n  <a href="/kontakt"><li>Kontakt</li></a> <!-- BŁĄD WALIDACJI HTML -->\n</ul>',
          goodCode: '<ul>\n  <li><a href="/kontakt">Kontakt</a></li> <!-- PRAWIDŁOWO -->\n</ul>',
        },
      ],
      practicalTask: {
        title: 'Zagnieżdżone menu kategorii sklepu',
        brief: 'Zbuduj dwupoziomową listę <ul> (Kategoria -> Podkategorie), pamiętając że podlista <ul> musi otwierać się wewnątrz elementu <li> rodzica.',
        steps: ['Stwórz główną listę <ul>', 'Wewnątrz pierwszego <li> przed jego zamknięciem </li> wstaw drugą listę <ul>'],
        deliverable: 'Poprawnie zagnieżdżone drzewo kategorii.',
      },
      completionCriteria: [
        'Zrozumienie różnicy między ul, ol i dl',
        'Poprawne użycie kotwic i ścieżek względnych',
        'Zaliczenie quizu min. 80%',
      ],
    },
    {
      id: 'html-9',
      moduleId: 2,
      moduleTitle: 'HTML — Semantyczna Architektura Stron',
      title: 'Elementy blokowe vs liniowe (div vs span) i atrybuty globalne (id, class, data-*)',
      slug: 'elementy-blokowe-liniowe-atrybuty-globalne',
      durationMinutes: 30,
      xpReward: 65,
      order: 4,
      summary: 'Zrozum fundamentalną różnicę między zachowaniem elementów blokowych (block) i liniowych (inline) w normalnym przepływie dokumentu oraz naucz się poprawnie używać id, class i data-* attribute.',
      objectives: [
        'Rozróżniać elementy blokowe (div, p, h1-h6, section) od liniowych (span, a, strong, img)',
        'Stosować unikalny identyfikator id oraz wielokrotnego użytku klasy CSS (class)',
        'Przechowywać własne dane w znacznikach HTML za pomocą atrybutów data-* (dataset)',
      ],
      prerequisites: ['Lekcje 1–3 modułu HTML'],
      theoryMarkdown: `Zanim napiszesz pierwszą linijkę CSS, przeglądarka układa wszystkie znaczniki HTML według tzw. **Normal Document Flow** (normalnego przepływu dokumentu).

**1. Elementy Blokowe (Block-level elements):**
Przykłady: \`<div>\`, \`<p>\`, \`<h1>\`–\`<h6>\`, \`<ul>\`, \`<section>\`, \`<article>\`.
- Zawsze zaczynają się **od nowej linii**.
- Domyślnie zajmują **100% dostępnej szerokości** swojego rodzica.
- Można im swobodnie nadawać \`width\`, \`height\`, \`margin\` i \`padding\` w każdym kierunku.

**2. Elementy Liniowe (Inline elements):**
Przykłady: \`<span>\`, \`<a>\`, \`<strong>\`, \`<em>\`, \`<code>\`, \`<kbd>\`.
- Układają się **obok siebie w jednej linii** tekstu (jak słowa w zdaniu).
- Zajmują dokładnie tyle szerokości, ile wynosi ich zawartość.
- **Ignorują** właściwości \`width\` oraz \`height\`!

**3. Atrybuty globalne (\`id\`, \`class\`, \`data-*\`):**
- **\`id="unikalna-nazwa"\`**: Musi być **unikalny w skali całej strony** (jak numer PESEL). Służy do kotwic, powiązań formularzy i precyzyjnych referencji.
- **\`class="karta wyrozniona"\`**: Może być przypisana do wielu elementów. To podstawowy sposób stylowania w CSS!
- **\`data-*\` (np. \`data-product-id="42"\`)**: Pozwala bezpiecznie przekazać dowolne dane z HTML do JavaScriptu (odczytywane przez \`element.dataset.productId\`).`,
      codeExamples: [
        {
          title: 'Współpraca kontenera blokowego <div> i wyróżnienia liniowego <span>',
          language: 'html',
          code: `<div id="featured-course" class="course-card" data-category="frontend" data-level="junior">
  <h3>Kurs Nowoczesnego HTML5 i CSS3</h3>
  <p>
    Poziom trudności: <span class="badge badge-green">Od podstaw</span> |
    Czas trwania: <span class="highlight">24 godziny</span>
  </p>
</div>`,
          explanation: 'Element <div> tworzy prostokątny blok karty, natomiast znaczniki <span> stylują wybrane fragmenty wewnątrz jednej linii tekstu.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Użyj <div> do grupowania większych bloków', description: 'Stosuj go jako kontener układu, gdy żaden tag semantyczny nie pasuje.' },
        { step: 2, title: 'Użyj <span> wewnątrz tekstu', description: 'Otocz pojedyncze słowo lub cenę tagiem <span> z klasą CSS.' },
        { step: 3, title: 'Dodaj atrybuty class oraz data-*', description: 'Używaj klas wielokrotnie, a id zachowaj dla unikalnych sekcji.' },
      ],
      interactiveExercise: {
        id: 'ex-html-block-inline',
        title: 'Zbuduj kartę produktu z div, span oraz atrybutem data-price',
        instructions: 'Stwórz kontener <div class="product-card" data-price="199"> zawierający akapit <p> z nazwą produktu oraz zagnieżdżony wewnątrz niego element <span class="price">199 zł</span>.',
        task: 'Użyj div z klasą product-card i atrybutem data-price oraz elementu span z klasą price.',
        starterCode: {
          html: '<!-- Zbuduj kartę produktu z div, data-price oraz span -->\n',
          css: '.product-card { background: #ffffff; border: 1px solid #cbd5e1; padding: 16px; border-radius: 10px; max-width: 300px; font-family: sans-serif; }\n.price { background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 6px; font-weight: bold; }',
          js: 'console.log("Block vs Inline gotowe.");',
        },
        solutionCode: {
          html: '<div class="product-card" data-price="199">\n  <p>Pakiet Full Stack Pro — <span class="price">199 zł</span></p>\n</div>',
          css: '.product-card { background: #ffffff; border: 1px solid #cbd5e1; padding: 16px; border-radius: 10px; max-width: 300px; font-family: sans-serif; }\n.price { background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 6px; font-weight: bold; }',
          js: 'console.log("Block vs Inline gotowe.");',
        },
        hints: [
          'Zacznij od <div class="product-card" data-price="199">.',
          'Wewnątrz dodaj <p> i <span class="price">199 zł</span>.',
          'Domknij </p> oraz </div>.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa product-card obecna', ruleType: 'html_contains', target: 'product-card' },
          { id: 'r2', description: 'Atrybut data-price zdefiniowany', ruleType: 'html_attr_exists', target: 'data-price' },
          { id: 'r3', description: 'Element liniowy <span> obecny', ruleType: 'html_tag_exists', target: 'span' },
        ],
      },
      independentTask: {
        title: 'Odczyt atrybutu data-* w JavaScript',
        instructions: 'W zakładce JS pobierz kartę produktu i wypisz wartość jej atrybutu data-price za pomocą document.querySelector(".product-card").dataset.price.',
        expectedOutcome: 'Zrozumienie mostu komunikacyjnego między HTML (data-*) a JavaScriptem (dataset).',
        starterHint: 'Każdy atrybut data-moja-wartosc zamienia się w JS na element.dataset.mojaWartosc.',
      },
      quiz: [
        {
          id: 'q-h9-1',
          question: 'Co się stanie, jeśli nadasz domyślnemu elementowi liniowemu <span> właściwość width: 500px w CSS?',
          options: [
            'Element rozciągnie się na 500 pikseli',
            'Nic się nie stanie — elementy inline ignorują właściwości width oraz height, dopóki nie zmienimy ich display na inline-block lub block',
            'Przeglądarka wyświetli błąd składni',
            'Tekst wewnątrz span zostanie usunięty',
          ],
          correctAnswer: 1,
          explanation: 'Elementy czysto liniowe (inline) przyjmują wyłącznie wymiary wynikające z tekstu wewnątrz nich.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Nadawanie tego samego atrybutu id="karta" wielu elementom na jednej stronie',
          whyItHappens: 'Mylenie przeznaczenia atrybutu id z atrybutem class.',
          howToFix: 'Jeśli styl lub logika dotyczy więcej niż jednego elementu, zawsze używaj class="karta". Identyfikator id musi być unikalny!',
          badCode: '<div id="box">1</div>\n<div id="box">2</div> <!-- BŁĄD: zduplikowane ID -->',
          goodCode: '<div class="box">1</div>\n<div class="box">2</div> <!-- PRAWIDŁOWO -->',
        },
      ],
      practicalTask: {
        title: 'Eksperyment z obramowaniem bloków i linii',
        brief: 'Nadaj w CSS czerwone obramowanie dla <p> oraz niebieskie dla <span>, aby na własne oczy zobaczyć jak elementy blokowe zajmują całą szerokość ekranu.',
        steps: ['Stwórz 2 akapity <p> i 3 elementy <span>', 'Dodaj border w CSS', 'Porównaj ich zachowanie przy zmianie rozmiaru okna'],
        deliverable: 'Wizualna intuicja działania Normal Document Flow.',
      },
      completionCriteria: [
        'Rozróżnianie elementów blokowych i liniowych',
        'Prawidłowe użycie class, id i data-*',
        'Zaliczenie quizu min. 80%',
      ],
    },
    {
      id: 'html-2',
      moduleId: 2,
      moduleTitle: 'HTML — Semantyczna Architektura Stron',
      title: 'Semantyka HTML5: header, nav, main, article, section, footer',
      slug: 'semantyka-html5-struktura',
      durationMinutes: 35,
      xpReward: 70,
      order: 5,
      summary: 'Koniec z "divozą"! Dowiedz się, dlaczego znaczniki semantyczne są kluczem do nowoczesnego web developmentu, dostępności a11y i wysokich pozycji w Google.',
      objectives: [
        'Poznać znaczenie i zastosowanie tagów: <header>, <nav>, <main>, <article>, <section>, <aside> i <footer>',
        'Wyeliminować nadmiarowe kontenery <div> na rzecz semantycznych odpowiedników',
        'Zaprojektować logiczny i czytelny zarys dokumentu (document outline)',
      ],
      prerequisites: ['Lekcja 1: Anatomia dokumentu HTML5'],
      theoryMarkdown: `HTML5 wprowadził dedykowane znaczniki semantyczne, które nadają **znaczenie maszynowe (meaning)** elementom:

- **\`<header>\`**: Nagłówek witryny lub sekcji (zwykle zawiera logo, tytuł, ewentualnie wyszukiwarkę).
- **\`<nav>\`**: Sekcja głównych linków nawigacyjnych (menu główne, spis treści).
- **\`<main>\`**: Unikalna, główna treść strony (może wystąpić tylko **raz** w dokumencie!).
- **\`<article>\`**: Niezależna, samowystarczalna treść, która ma sens wyrwana z kontekstu (np. artykuł na blogu, karta produktu).
- **\`<section>\`**: Tematyczny fragment większej całości z własnym nagłówkiem (h2-h6).
- **\`<aside>\`**: Treść poboczna (pasek boczny, powiązane linki).
- **\`<footer>\`**: Stopka strony z prawami autorskimi i polityką prywatności.`,
      codeExamples: [
        {
          title: 'Wzorcowy układ semantyczny nowoczesnej podstrony',
          language: 'html',
          code: `<body>
  <header>
    <a href="/" class="logo">DevAcademy</a>
    <nav aria-label="Główne menu">
      <ul>
        <li><a href="/kursy">Kursy</a></li>
        <li><a href="/projekty">Projekty</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <h1>Jak zostałem Full Stack Developerem</h1>
      <p>Systematyczna nauka to klucz do sukcesu...</p>
    </article>
  </main>

  <footer>
    <p>&copy; 2026 Full Stack Developer Academy</p>
  </footer>
</body>`,
          explanation: 'Użytkownik czytnika ekranu może jednym klawiszem przejść bezpośrednio do <main>.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zastąp kontener nawigacji znacznikiem <nav>', description: 'Użyj <nav>, a wewnątrz listę <ul> z elementami <li>.' },
        { step: 2, title: 'Oznacz centrum aplikacji tagiem <main>', description: 'Upewnij się, że znacznik <main> występuje dokładnie raz.' },
        { step: 3, title: 'Wybierz między <article> a <section>', description: 'Jeśli treść ma sens jako odrębny wpis w RSS -> <article>.' },
      ],
      interactiveExercise: {
        id: 'ex-html-2',
        title: 'Zbuduj semantyczny szkielet bloga',
        instructions: 'Zastąp przestarzałą strukturę "divozę" semantycznymi tagami HTML5. Kod musi zawierać: <header> z nawigacją <nav>, główną treść <main>, wewnątrz niej <article> z nagłówkiem <h1>, oraz stopkę <footer>.',
        task: 'Zbuduj strukturę z tagami: header, nav, main, article, footer.',
        starterCode: {
          html: '<header>\n  <nav>\n    <a href="#home">Strona główna</a>\n  </nav>\n</header>\n\n<!-- Dodaj main, article z h1 oraz footer -->\n',
          css: 'body { font-family: system-ui; padding: 20px; line-height: 1.6; }\narticle { background: #f1f5f9; padding: 16px; border-radius: 8px; }\nfooter { border-top: 1px solid #cbd5e1; padding-top: 12px; margin-top: 20px; }',
          js: 'console.log("Ćwiczenie semantyki HTML5 aktywne.");',
        },
        solutionCode: {
          html: '<header>\n  <nav>\n    <a href="#home">Strona główna</a>\n  </nav>\n</header>\n\n<main>\n  <article>\n    <h1>Architektura Nowoczesnych Aplikacji Webowych</h1>\n    <p>Semantyczny kod HTML to fundament stabilnego SEO i dostępności.</p>\n  </article>\n</main>\n\n<footer>\n  <p>&copy; 2026 DevAcademy</p>\n</footer>',
          css: 'body { font-family: system-ui; padding: 20px; line-height: 1.6; }\narticle { background: #f1f5f9; padding: 16px; border-radius: 8px; }\nfooter { border-top: 1px solid #cbd5e1; padding-top: 12px; margin-top: 20px; }',
          js: 'console.log("Ćwiczenie semantyki HTML5 aktywne.");',
        },
        hints: [
          'Użyj znacznika <main> do otoczenia głównej treści.',
          'Wewnątrz <main> umieść znacznik <article>, a w nim <h1>Tytuł artykułu</h1>.',
          'Na końcu dodaj znacznik <footer>.',
        ],
        rules: [
          { id: 'r1', description: 'Znacznik <header> zagnieżdża nawigację', ruleType: 'html_tag_exists', target: 'header' },
          { id: 'r2', description: 'Nawigacja <nav> obecna w kodzie', ruleType: 'html_tag_exists', target: 'nav' },
          { id: 'r3', description: 'Element <main> definiuje główną treść', ruleType: 'html_tag_exists', target: 'main' },
          { id: 'r4', description: 'Znacznik <article> zawiera nagłówek <h1>', ruleType: 'html_tag_exists', target: 'article' },
          { id: 'r5', description: 'Stopka <footer> domyka dokument', ruleType: 'html_tag_exists', target: 'footer' },
        ],
      },
      independentTask: {
        title: 'Wzbogacenie o sekcję boczną <aside>',
        instructions: 'Wewnątrz <main> obok <article> dodaj element <aside> z nagłówkiem <h3>O autorze</h3> oraz krótką notką biograficzną.',
        expectedOutcome: 'Klasyczny układ treści z kolumną główną i paskiem bocznym.',
        starterHint: 'Możesz zastosować znacznik <aside> bezpośrednio pod </article>.',
      },
      quiz: [
        {
          id: 'q-h2-1',
          question: 'Ile razy na pojedynczej stronie internetowej może pojawić się element <main>?',
          options: ['W każdej sekcji raz', 'Dokładnie jeden raz jako unikalny kontener głównej treści', 'Tyle ile jest artykułów', 'Brak ograniczeń'],
          correctAnswer: 1,
          explanation: 'Standard HTML5 specyfikuje, że <main> reprezentuje dominującą treść danego dokumentu i nie może być powielany w widocznym DOM.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Nadużywanie znaczników <div> do przycisków i linków',
          whyItHappens: 'Przyzwyczajenie ze starych szablonów.',
          howToFix: 'Zamiast <div class="button" onclick="..."> używaj natywnego <button type="button">.',
          badCode: '<div class="btn" onclick="zapisz()">Zapisz</div>',
          goodCode: '<button type="button" onclick="zapisz()">Zapisz</button>',
        },
      ],
      practicalTask: {
        title: 'Audyt semantyki w DevTools',
        brief: 'Zbadaj drzewo dostępności (Accessibility Tree) w narzędziach deweloperskich.',
        steps: ['Otwórz DevTools -> Elements', 'Przejdź do zakładki Accessibility', 'Sprawdź obecność ról Landmark'],
        deliverable: 'Praktyczne potwierdzenie działania semantyki dla czytników mowy.',
      },
      completionCriteria: [
        'Zrozumienie ról semantycznych HTML5',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'html-3',
      moduleId: 2,
      moduleTitle: 'HTML — Semantyczna Architektura Stron',
      title: 'Nowoczesne formularze: typy pól, atrybuty walidacji i dostępność',
      slug: 'nowoczesne-formularze-walidacja',
      durationMinutes: 40,
      xpReward: 80,
      order: 3,
      summary: 'Formularze to serce aplikacji webowych — odpowiadają za logowanie, zamówienia, płatności i wiadomości. Naucz się budować bezpieczne, dostępne i automatycznie walidowane pola wejściowe.',
      objectives: [
        'Opanować powiązanie pól formularza z etykietami za pomocą pary <label for="id"> oraz <input id="id">',
        'Wykorzystywać wyspecjalizowane typy pól: email, password, number, tel, date, search',
        'Wdrażać natywną walidację przeglądarkową: required, pattern, min/max, minlength/maxlength',
      ],
      prerequisites: ['Lekcja 1 i 2 z modułu HTML'],
      theoryMarkdown: `Każdy formularz w sieci musi być zaprojektowany z myślą o trzech filarach: **użyteczności (UX)**, **dostępności (a11y)** oraz **bezpieczeństwie (security)**.

1. **Struktura formularza**:
   Znacznik \`<form action="/api/login" method="POST">\` grupuje pola i definiuje, dokąd oraz jaką metodą HTTP wysyłane są dane.
2. **Powiązanie label z input**:
   Kliknięcie w etykietę \`<label>\` powinno automatycznie ustawiać kursor w polu tekstowym:
   \`\`\`html
   <label for="user-email">Adres e-mail:</label>
   <input type="email" id="user-email" name="email" required />
   \`\`\`
3. **Natywna walidacja HTML5**:
   Przeglądarka potrafi sama zwalidować poprawność danych dzięki atrybutom:
   - \`required\` — pole nie może pozostać puste,
   - \`type="email"\` — weryfikuje format e-maila,
   - \`minlength="8"\` — minimalna liczba znaków.`,
      codeExamples: [
        {
          title: 'Semantyczny formularz logowania z walidacją',
          language: 'html',
          code: `<form action="/api/login" method="POST">
  <div>
    <label for="login-email">Adres E-mail</label>
    <input type="email" id="login-email" name="email" required />
  </div>
  <div>
    <label for="login-pass">Hasło</label>
    <input type="password" id="login-pass" name="password" minlength="8" required />
  </div>
  <button type="submit">Zaloguj się</button>
</form>`,
          explanation: 'Powiązanie for z id to absolutny fundament dostępności formularzy.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Utwórz kontener <form>', description: 'Dodaj metodę wysyłki POST oraz adres action.' },
        { step: 2, title: 'Zawsze twórz parę <label> i <input>', description: 'Atrybut for w label musi odpowiadać id w input.' },
        { step: 3, title: 'Wybierz typ i walidację', description: 'Użyj type="email", required, minlength.' },
      ],
      interactiveExercise: {
        id: 'ex-html-3',
        title: 'Zbuduj formularz kontaktowy kursanta',
        instructions: 'Stwórz działający formularz zawierający: pole na imię (type="text", required), pole na e-mail (type="email", required), pole wyboru tematu <select> oraz przycisk wysłania <button type="submit">. Pamiętaj o powiązaniu labeli za pomocą atrybutu for i id!',
        task: 'Zbuduj formularz z polami text, email, select oraz przyciskiem submit.',
        starterCode: {
          html: '<form action="/api/kontakt" method="POST">\n  <!-- Dodaj pola formularza z powiązanymi labelami -->\n  \n</form>',
          css: 'form { display: flex; flex-direction: column; gap: 12px; max-width: 360px; padding: 20px; background: white; border-radius: 8px; }\ninput, select, button { padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; }\nbutton { background: #4f46e5; color: white; border: none; font-weight: bold; cursor: pointer; }',
          js: 'console.log("Gotowy do walidacji formularza.");',
        },
        solutionCode: {
          html: '<form action="/api/kontakt" method="POST">\n  <div>\n    <label for="imie">Twoje Imię</label>\n    <input type="text" id="imie" name="imie" required placeholder="np. Jan" />\n  </div>\n  <div>\n    <label for="mail">Twój E-mail</label>\n    <input type="email" id="mail" name="mail" required placeholder="jan@example.com" />\n  </div>\n  <div>\n    <label for="temat">Temat zapytania</label>\n    <select id="temat" name="temat">\n      <option value="kurs">Pytanie o kurs Full Stack</option>\n      <option value="pomoc">Wsparcie techniczne</option>\n    </select>\n  </div>\n  <button type="submit">Wyślij wiadomość</button>\n</form>',
          css: 'form { display: flex; flex-direction: column; gap: 12px; max-width: 360px; padding: 20px; background: white; border-radius: 8px; }\ninput, select, button { padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; }\nbutton { background: #4f46e5; color: white; border: none; font-weight: bold; cursor: pointer; }',
          js: 'console.log("Gotowy do walidacji formularza.");',
        },
        hints: [
          'Upewnij się, że każdy <input> ma identyfikator id pasujący do for w <label>.',
          'W polu e-mail ustaw type="email".',
          'Dodaj przycisk <button type="submit">.',
        ],
        rules: [
          { id: 'r1', description: 'Formularz posiada znacznik <form>', ruleType: 'html_tag_exists', target: 'form' },
          { id: 'r2', description: 'Pole email z type="email" obecne', ruleType: 'html_attr_exists', target: 'type', param: 'email' },
          { id: 'r3', description: 'Pole zawiera atrybut required', ruleType: 'html_contains', target: 'required' },
          { id: 'r4', description: 'Element wyboru <select> obecny w formularzu', ruleType: 'html_tag_exists', target: 'select' },
          { id: 'r5', description: 'Przycisk wysłania <button type="submit"> zdefiniowany', ruleType: 'html_contains', target: 'type="submit"' },
        ],
      },
      independentTask: {
        title: 'Pole wielowierszowe <textarea>',
        instructions: 'Dodaj do formularza pole <textarea id="wiadomosc" name="wiadomosc" rows="4" required></textarea>.',
        expectedOutcome: 'Kompletny formularz z możliwością wpisania dłuższego zapytania.',
        starterHint: 'Zwróć uwagę, że textarea wymaga tagu zamykającego </textarea>.',
      },
      quiz: [
        {
          id: 'q-h3-1',
          question: 'Do czego służy atrybut "name" w polu <input name="username">?',
          options: [
            'Określa kolor obramowania w CSS',
            'Identyfikuje klucz, pod którym wartość pola zostanie przesłana w żądaniu na serwer',
            'Jest używany wyłącznie przez Google',
            'Służy do szyfrowania metodą RSA',
          ],
          correctAnswer: 1,
          explanation: 'Bez atrybutu name wartość pola nie zostanie wysłana do serwera podczas zatwierdzenia formularza.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Stosowanie atrybutu placeholder zamiast znacznika <label>',
          whyItHappens: 'Chęć uzyskania "minimalistycznego" wyglądu.',
          howToFix: 'Placeholder znika po wpisaniu tekstu, dezorientując użytkownika. Zawsze stosuj widoczny <label>.',
          badCode: '<input type="text" placeholder="PESEL" />',
          goodCode: '<label for="pesel">PESEL</label>\n<input type="text" id="pesel" name="pesel" />',
        },
      ],
      practicalTask: {
        title: 'Walidacja formularza',
        brief: 'Przetestuj natywną walidację wpisując błędny e-mail i sprawdzając komunikat przeglądarki.',
        steps: ['Wpisz w polu e-mail samo słowo "test"', 'Kliknij Wyślij wiadomość', 'Zaobserwuj dymek walidacyjny'],
        deliverable: 'Zrozumienie Constraint Validation API w HTML5.',
      },
      completionCriteria: [
        'Zrozumienie powiązania label i input',
        'Prawidłowe użycie atrybutów type, name, required',
        'Wynik quizu na poziomie minimum 80%',
      ],
    },
    {
      id: 'html-4',
      moduleId: 2,
      moduleTitle: 'HTML — Semantyczna Architektura Stron',
      title: 'Multimedia, tabele i hiperłącza: img, picture, audio, a, table',
      slug: 'multimedia-tabele-linki',
      durationMinutes: 35,
      xpReward: 70,
      order: 4,
      summary: 'Poznaj zaawansowaną pracę z mediami: responsywne grafiki <picture> i format WebP/AVIF, atrybuty alt, tabele danych dla raportów oraz bezpieczne linki zewnętrzne rel="noopener".',
      objectives: [
        'Poprawnie wdrażać grafikę z atrybutem alt, parametrami width/height oraz loading="lazy"',
        'Budować semantyczne tabele danych z elementami <table>, <thead>, <tbody>, <th> ze scope="col"',
        'Tworzyć bezpieczne odnośniki zewnętrzne z target="_blank" i rel="noopener noreferrer"',
      ],
      prerequisites: ['Wcześniejsze lekcje modułu HTML'],
      theoryMarkdown: `Strony internetowe to nie tylko tekst — to bogate media i uporządkowane dane.

1. **Nowoczesny obrazek \`<img>\` i \`<picture>\`**:
   - **\`alt\` (Alternative Text)**: Tekst alternatywny dla osób niewidomych lub przy wolnym łączu.
   - **\`loading="lazy"\`**: Leniwe ładowanie obrazów poza ekranem (ogromny zysk wydajnościowy).
   - **\`width\` i \`height\`**: Podanie wymiarów zapobiega skakaniu układu (Cumulative Layout Shift — CLS).

2. **Tabele danych**:
   Służą wyłącznie do prezentowania danych tabelarycznych (cenniki, statystyki), NIGDY do układu strony!
   Wymagają semantyki: \`<caption>\`, \`<thead>\`, \`<tbody>\`, \`<th>\` ze \`scope="col"\`.

3. **Bezpieczne hiperłącza \`<a>\`**:
   Otwierając link w nowej karcie (\`target="_blank"\`), zawsze dodawaj \`rel="noopener noreferrer"\`, aby zabezpieczyć aplikację przed atakiem typu Reverse Tabnabbing.`,
      codeExamples: [
        {
          title: 'Semantyczna tabela statystyk kursantów',
          language: 'html',
          code: `<table>
  <caption>Wyniki modułu HTML5</caption>
  <thead>
    <tr>
      <th scope="col">Kursant</th>
      <th scope="col">Ocena</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Michał Wiśniewski</td>
      <td>100%</td>
    </tr>
  </tbody>
</table>`,
          explanation: 'Atrybut scope="col" w th jednoznacznie wiąże kolumnę z nagłówkiem dla asystentów głosowych.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Wstaw obrazek z poprawnym alt i lazy loading', description: 'Użyj tagu <img src="..." alt="..." loading="lazy" />.' },
        { step: 2, title: 'Zbuduj tabelę z thead i tbody', description: 'Zastosuj komórki nagłówkowe <th> ze scope="col".' },
        { step: 3, title: 'Zabezpiecz linki zewnętrzne', description: 'Dodaj rel="noopener noreferrer" do target="_blank".' },
      ],
      interactiveExercise: {
        id: 'ex-html-4',
        title: 'Stwórz tabelę modułów kursu i link do dokumentacji',
        instructions: 'Zaprojektuj tabelę z tagami <table>, <thead> z dwoma kolumnami <th> ("Moduł", "Status"), sekcją <tbody> z przynajmniej jednym wierszem <tr> oraz odnośnikiem <a> z atrybutem target="_blank" i rel="noopener".',
        task: 'Zbuduj semantyczną tabelę danych i bezpieczny link zewnętrzny.',
        starterCode: {
          html: '<!-- Dodaj poniżej tabelę oraz odnośnik -->\n',
          css: 'body { font-family: sans-serif; padding: 20px; }\ntable { width: 100%; border-collapse: collapse; margin-bottom: 20px; }\nth, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }\nth { background: #f1f5f9; }\na { color: #4f46e5; font-weight: bold; }',
          js: 'console.log("Moduł tabeli i mediów gotowy.");',
        },
        solutionCode: {
          html: '<table>\n  <caption>Harmonogram nauki</caption>\n  <thead>\n    <tr>\n      <th scope="col">Moduł</th>\n      <th scope="col">Status</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>HTML & Semantyka</td>\n      <td>Ukończony</td>\n    </tr>\n  </tbody>\n</table>\n\n<p>\n  <a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">Dokumentacja MDN</a>\n</p>',
          css: 'body { font-family: sans-serif; padding: 20px; }\ntable { width: 100%; border-collapse: collapse; margin-bottom: 20px; }\nth, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }\nth { background: #f1f5f9; }\na { color: #4f46e5; font-weight: bold; }',
          js: 'console.log("Moduł tabeli i mediów gotowy.");',
        },
        hints: [
          'Pamiętaj o strukturze: <table> -> <thead> -> <tr> -> <th>.',
          'W sekcji <tbody> umieść wiersz <tr> z komórkami <td>.',
          'Link <a> musi mieć target="_blank" i rel="noopener".',
        ],
        rules: [
          { id: 'r1', description: 'Tabela <table> istnieje w kodzie', ruleType: 'html_tag_exists', target: 'table' },
          { id: 'r2', description: 'Sekcja <thead> z nagłówkami <th> obecna', ruleType: 'html_tag_exists', target: 'thead' },
          { id: 'r3', description: 'Ciało tabeli <tbody> z komórkami <td> obecne', ruleType: 'html_tag_exists', target: 'tbody' },
          { id: 'r4', description: 'Link <a> posiada target="_blank"', ruleType: 'html_attr_exists', target: 'target', param: '_blank' },
          { id: 'r5', description: 'Link <a> posiada rel z wartością noopener', ruleType: 'html_attr_exists', target: 'rel', param: 'noopener' },
        ],
      },
      independentTask: {
        title: 'Dodanie grafiki z podpisem w <figure>',
        instructions: 'Zastosuj element <figure> zawierający obrazek <img src="..." alt="..." /> oraz podpis <figcaption>.',
        expectedOutcome: 'Elegancka prezentacja grafiki z semantycznym podpisem.',
        starterHint: 'Skorzystaj z pary <figure> i <figcaption>.',
      },
      quiz: [
        {
          id: 'q-h4-1',
          question: 'Przed jakim zagrożeniem chroni dodanie atrybutu rel="noopener" przy linkach z target="_blank"?',
          options: [
            'Przed atakiem typu SQL Injection',
            'Przed przejęciem kontroli nad kartą macierzystą przez manipulację obiektem window.opener (Reverse Tabnabbing)',
            'Przed utratą połączenia Wi-Fi',
            'Przed błędami kompilacji w TypeScript',
          ],
          correctAnswer: 1,
          explanation: 'Bez noopener nowo otwarta karta ma dostęp do window.opener i może przekierować Twoją stronę na fałszywy panel logowania.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Wpisywanie "Zdjęcie" lub "Obrazek" w treści atrybutu alt',
          whyItHappens: 'Próba dosłownego opisu typu nośnika.',
          howToFix: 'Czytnik ekranu sam ogłasza: "Grafika: [treść alt]". Wpisz bezpośrednio treść: "Wykres rocznej sprzedaży" zamiast "Zdjęcie wykresu".',
          badCode: '<img src="chart.png" alt="Obrazek przedstawiający wykres" />',
          goodCode: '<img src="chart.png" alt="Wykres wzrostu przychodów w latach 2024-2026" />',
        },
      ],
      practicalTask: {
        title: 'Wdrożenie tabeli cennika',
        brief: 'Stwórz semantyczną tabelę cennika abonamentów SaaS z 3 pakietami: Starter, Pro, Enterprise.',
        steps: ['Użyj <table> z atrybutem caption', 'Zdefiniuj kolumny: Plan, Cena, Limit projektów', 'Sformatuj wiersze z danymi'],
        deliverable: 'Czytelna tabela porównawcza gotowa do ostylowania w CSS.',
      },
      completionCriteria: [
        'Zrozumienie semantyki tabel i mediów',
        'Prawidłowe zabezpieczenie linków zewnętrznych',
        'Wynik quizu na poziomie minimum 80%',
      ],
    },
    {
      id: 'html-5',
      moduleId: 2,
      moduleTitle: 'HTML — Semantyczna Architektura Stron',
      title: 'Dostępność cyfrowa (a11y/WCAG), Meta Tagi i Techniczne SEO',
      slug: 'dostepnosc-a11y-wcag-seo',
      durationMinutes: 45,
      xpReward: 90,
      order: 5,
      summary: 'Prawdziwy Senior Developer tworzy strony dostępne dla każdego — w tym osób niewidomych, niedowidzących, z zaburzeniami motorycznymi oraz dla algorytmów Google. Poznaj standard WCAG 2.1 AA, atrybuty ARIA i OpenGraph.',
      objectives: [
        'Opanować 4 fundamentalne zasady standardu WCAG: Postrzegalność, Funkcjonalność, Zrozumiałość i Rzetelność (POUR)',
        'Stosować atrybuty ARIA (aria-label, aria-expanded, aria-hidden) tam, gdzie HTML nie wystarcza',
        'Konfigurować tagi Open Graph i Twitter Cards dla doskonałego wyglądu linków w mediach społecznościowych',
      ],
      prerequisites: ['Lekcje 1-4 modułu HTML'],
      theoryMarkdown: `Dostępność (**a11y**) to standard etyczny, prawny i biznesowy.

1. **Zasada POUR (WCAG 2.1)**:
   - **P**erceivable (Postrzegalna): Teksty alternatywne dla grafik, kontrast barw min. 4.5:1.
   - **O**perable (Funkcjonalna): Pełna obsługa interfejsu wyłącznie za pomocą klawiatury (Tab, Enter, Spacja).
   - **U**nderstandable (Zrozumiała): Przewidywalne działanie, czytelne komunikaty błędów.
   - **R**obust (Rzetelna): Poprawny kod HTML obsługiwany przez czytniki mowy.

2. **Atrybuty ARIA**:
   *Pierwsza zasada*: "Jeśli możesz użyć natywnego elementu HTML (np. \`<button>\`), **nigdy** nie zastępuj go \`<div role="button">\`!".
   Stosuj ARIA do rozszerzenia semantyki:
   - \`aria-label="Zamknij"\` — dla przycisków z samą ikonką krzyżyka (X).
   - \`aria-expanded="false"\` — dla rozwijanych menu hamburgerowych.
   - \`aria-hidden="true"\` — dla dekoracyjnych ikonek SVG.

3. **Techniczne SEO i Open Graph**:
   Gdy ktoś udostępnia link do Twojej aplikacji, platformy czytają metatagi Open Graph:
   \`\`\`html
   <meta property="og:title" content="Akademia Full Stack Developera" />
   <meta property="og:description" content="Ucz się programowania od podstaw do pierwszej pracy." />
   \`\`\``,
      codeExamples: [
        {
          title: 'Dostępny przycisk z ikonką i atrybutami ARIA',
          language: 'html',
          code: `<button type="button" aria-label="Zamknij okno modalne">
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
  </svg>
</button>`,
          explanation: 'Dzięki aria-label czytnik przeczyta cel przycisku, a aria-hidden ukrywa dekoracyjny wektor SVG.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zapewnij widoczny wskaźnik fokusu', description: 'Nigdy nie usuwaj stylu outline: none w CSS bez alternatywy.' },
        { step: 2, title: 'Dodaj etykiety dla przycisków ikonowych', description: 'Każdy przycisk z samą grafiką musi posiadać aria-label.' },
        { step: 3, title: 'Skonfiguruj metadane społecznościowe', description: 'Uzupełnij head o og:title i og:description.' },
      ],
      interactiveExercise: {
        id: 'ex-html-5',
        title: 'Wdróż dostępny pasek akcji z etykietami ARIA i OpenGraph',
        instructions: 'Zaimplementuj komponent z przyciskiem zamykania posiadającym aria-label="Zamknij powiadomienie", ikonką SVG z aria-hidden="true" oraz metatag OpenGraph og:title w sekcji head.',
        task: 'Zastosuj atrybuty aria-label, aria-hidden oraz metatag og:title.',
        starterCode: {
          html: '<!DOCTYPE html>\n<html lang="pl">\n<head>\n  <title>Dostępna Aplikacja</title>\n  <!-- Dodaj meta property="og:title" -->\n</head>\n<body>\n  <div class="alert" role="alert">\n    <p>Zadanie zapisane pomyślnie!</p>\n    <!-- Dodaj button z aria-label i span z aria-hidden -->\n    \n  </div>\n</body>\n</html>',
          css: 'body { font-family: sans-serif; padding: 20px; }\n.alert { display: flex; align-items: center; justify-content: space-between; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 12px; border-radius: 8px; color: #065f46; }\nbutton { background: transparent; border: none; cursor: pointer; }',
          js: 'console.log("Weryfikacja dostępności cyfrowej uruchomiona.");',
        },
        solutionCode: {
          html: '<!DOCTYPE html>\n<html lang="pl">\n<head>\n  <title>Dostępna Aplikacja</title>\n  <meta property="og:title" content="Panel Kursanta Full Stack" />\n</head>\n<body>\n  <div class="alert" role="alert">\n    <p>Zadanie zapisane pomyślnie!</p>\n    <button type="button" aria-label="Zamknij powiadomienie">\n      <span aria-hidden="true">&times;</span>\n    </button>\n  </div>\n</body>\n</html>',
          css: 'body { font-family: sans-serif; padding: 20px; }\n.alert { display: flex; align-items: center; justify-content: space-between; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 12px; border-radius: 8px; color: #065f46; }\nbutton { background: transparent; border: none; cursor: pointer; }',
          js: 'console.log("Weryfikacja dostępności cyfrowej uruchomiona.");',
        },
        hints: [
          'W head dodaj: <meta property="og:title" content="..." />',
          'Dodaj <button type="button" aria-label="Zamknij powiadomienie">.',
          'Element z krzyżykiem oznacz jako aria-hidden="true".',
        ],
        rules: [
          { id: 'r1', description: 'Metatag Open Graph og:title obecny w head', ruleType: 'html_contains', target: 'og:title' },
          { id: 'r2', description: 'Przycisk posiada atrybut aria-label', ruleType: 'html_attr_exists', target: 'aria-label' },
          { id: 'r3', description: 'Element dekoracyjny oznaczony aria-hidden="true"', ruleType: 'html_attr_exists', target: 'aria-hidden', param: 'true' },
        ],
      },
      independentTask: {
        title: 'Audyt Lighthouse w przeglądarce',
        instructions: 'Przeprowadź audyt Lighthouse w kategorii Accessibility na lokalnym projekcie.',
        expectedOutcome: 'Raport dostępności na poziomie 100 punktów.',
        starterHint: 'Zadbaj o właściwy kontrast barw i atrybuty alt.',
      },
      quiz: [
        {
          id: 'q-h5-1',
          question: 'Do czego służy atrybut aria-hidden="true"?',
          options: [
            'Ukrywa element wizualnie na ekranie komputera',
            'Ukrywa element (np. ikonę czysto dekoracyjną) przed czytnikami ekranu, nie usuwając go z widoku',
            'Kasuje ciasteczka sesyjne użytkownika',
            'Blokuje zaznaczanie tekstu',
          ],
          correctAnswer: 1,
          explanation: 'aria-hidden="true" informuje technologię asystującą, by pominęła ten element w drzewie dostępności.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Tworzenie przycisków z samą ikoną bez etykiety tekstowej lub aria-label',
          whyItHappens: 'Deweloper widzi ikonę i zakłada, że każdy rozumie jej znaczenie.',
          howToFix: 'Osoba niewidoma usłyszy tylko "przycisk". Zawsze dodawaj aria-label="Szukaj".',
          badCode: '<button><i class="icon-trash"></i></button>',
          goodCode: '<button type="button" aria-label="Usuń ten wpis"><i class="icon-trash" aria-hidden="true"></i></button>',
        },
      ],
      practicalTask: {
        title: 'Nawigacja wyłącznie klawiaturą',
        brief: 'Odłóż myszkę i spróbuj przejść po swojej aplikacji używając wyłącznie klawisza Tab, Shift+Tab, Spacji oraz Enter.',
        steps: ['Uruchom stronę i naciśnij klawisz Tab', 'Sprawdź, czy każdy link i przycisk ma obramowanie fokusu'],
        deliverable: 'Pewność, że aplikacja jest w 100% używalna bez myszy.',
      },
      completionCriteria: [
        'Zrozumienie standardu WCAG 2.1 i zasad POUR',
        'Prawidłowe użycie atrybutów aria-label i aria-hidden',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'html-6',
      moduleId: 2,
      moduleTitle: 'HTML — Semantyczna Architektura Stron',
      title: 'Nowoczesne Media w HTML5: video, audio, picture oraz SVG',
      slug: 'media-audio-video-svg',
      durationMinutes: 35,
      xpReward: 70,
      order: 6,
      summary: 'Naucz się osadzać wideo i dźwięk bez wtyczek flash z napisami (WebVTT), optymalizować formaty WEBM/MP4 oraz wdrażać wektory SVG z responsywnym zachowaniem.',
      objectives: [
        'Stosować znaczniki <video> i <audio> z atrybutami controls, preload, poster i wieloma źródłami <source>',
        'Dołączać napisy dla niesłyszących za pomocą znacznika <track kind="subtitles" srclang="pl">',
        'Wdrażać skalowalne grafiki wektorowe <svg> inline i unikać problemów z ostrością na ekranach Retina',
      ],
      prerequisites: ['Lekcje 1-5 modułu HTML'],
      theoryMarkdown: `HTML5 zrewolucjonizował multimedia w sieci, wprowadzając natywne odtwarzacze wideo i audio bez konieczności instalowania zewnętrznych pluginów.

**Struktura nowoczesnego odtwarzacza wideo:**
\`\`\`html
<video controls preload="metadata" poster="miniaturka.webp" width="800">
  <source src="film.webm" type="video/webm" />
  <source src="film.mp4" type="video/mp4" />
  <track kind="subtitles" src="napisy.vtt" srclang="pl" label="Polski" default />
  Twoja przeglądarka nie obsługuje natywnego odtwarzacza wideo.
</video>
\`\`\`

**Kluczowe atrybuty:**
- \`controls\` — wyświetla natywny pasek odtwarzacza (play/pause, głośność, pełny ekran).
- \`poster\` — obraz wyświetlany przed rozpoczęciem odtwarzania wideo.
- \`preload="metadata"\` — pobiera tylko długość i wymiary filmu, oszczędzając transfer mobilny.
- \`<track>\` — standard WebVTT z napisami (kluczowe dla dostępności WCAG!).`,
      codeExamples: [
        {
          title: 'Wzorcowe osadzenie odtwarzacza audio podcastu',
          language: 'html',
          code: `<div class="podcast-player">
  <h3>Odcinek 1: Od zera do Junior Full Stacka</h3>
  <audio controls preload="none">
    <source src="odcinek1.mp3" type="audio/mpeg" />
    <source src="odcinek1.ogg" type="audio/ogg" />
    Twoja przeglądarka nie obsługuje odtwarzacza audio.
  </audio>
</div>`,
          explanation: 'Wielokrotny tag <source> pozwala przeglądarce wybrać najbardziej wydajny kodek.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Wybierz kontener audio lub video', description: 'Użyj <video> lub <audio> z atrybutem controls.' },
        { step: 2, title: 'Zdefiniuj formaty w <source>', description: 'Podaj MP4 oraz otwarty format WebM.' },
        { step: 3, title: 'Dodaj napisy z tagiem <track>', description: 'Zadbaj o dostępność a11y dla osób niesłyszących.' },
      ],
      interactiveExercise: {
        id: 'ex-html-6',
        title: 'Zbuduj odtwarzacz wideo z atrybutem controls i poster',
        instructions: 'Zaimplementuj znacznik <video> z atrybutami controls, poster="thumb.jpg", dwoma źródłami <source> (jedno z type="video/mp4") oraz tekstem zastępczym dla starszych przeglądarek.',
        task: 'Utwórz odtwarzacz <video controls poster="thumb.jpg"> z tagami <source>.',
        starterCode: {
          html: '<!-- Wstaw poniżej znacznik video -->\n',
          css: 'body { font-family: sans-serif; padding: 20px; }\nvideo { max-width: 100%; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }',
          js: 'console.log("Moduł video zainicjalizowany.");',
        },
        solutionCode: {
          html: '<video controls poster="thumb.jpg" width="640">\n  <source src="demo.webm" type="video/webm">\n  <source src="demo.mp4" type="video/mp4">\n  Twoja przeglądarka nie obsługuje wideo w HTML5.\n</video>',
          css: 'body { font-family: sans-serif; padding: 20px; }\nvideo { max-width: 100%; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }',
          js: 'console.log("Moduł video zainicjalizowany.");',
        },
        hints: [
          'Użyj tagu <video controls poster="thumb.jpg">.',
          'Wewnątrz dodaj <source src="..." type="video/mp4">.',
          'Pamiętaj o zamknięciu </video>.',
        ],
        rules: [
          { id: 'r1', description: 'Znacznik <video> zdefiniowany', ruleType: 'html_tag_exists', target: 'video' },
          { id: 'r2', description: 'Atrybut controls obecny w video', ruleType: 'html_contains', target: 'controls' },
          { id: 'r3', description: 'Atrybut poster zdefiniowany', ruleType: 'html_attr_exists', target: 'poster', param: 'thumb.jpg' },
          { id: 'r4', description: 'Źródło <source> z type="video/mp4"', ruleType: 'html_contains', target: 'video/mp4' },
        ],
      },
      independentTask: {
        title: 'Napisy WebVTT w wideo',
        instructions: 'Dodaj znacznik <track kind="subtitles" src="pl.vtt" srclang="pl" label="Polski" default />.',
        expectedOutcome: 'Obsługa napisów filmowych w czytniku wideo.',
        starterHint: 'Atrybut kind="subtitles" definiuje rodzaj ścieżki tekstowej.',
      },
      quiz: [
        {
          id: 'q-h6-1',
          question: 'Dlaczego warto zdefiniować atrybut preload="metadata" zamiast preload="auto" dla wideo?',
          options: [
            'Zapobiega niepotrzebnemu pobieraniu całego wielomegabajtowego pliku wideo, zanim użytkownik kliknie Play (oszczędność transferu na smartfonach)',
            'Jest to jedyny sposób na odtworzenie dźwięku',
            'Wymusza kodowanie Dolby Atmos',
            'Zapobiega atakom hakerskim na stronę',
          ],
          correctAnswer: 0,
          explanation: 'preload="metadata" pobiera jedynie podstawowe parametry bez ściągania strumienia klatek.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Włączanie atrybutu autoplay z dźwiękiem na stronach webowych',
          whyItHappens: 'Próba natychmiastowego przyciągnięcia uwagi użytkownika.',
          howToFix: 'Przeglądarki domyślnie blokują autoodtwarzanie z dźwiękiem, a użytkownicy natychmiast opuszczają stronę. Jeśli musisz użyć wideo w tle, zawsze dodaj atrybut muted.',
          badCode: '<video autoplay src="reklama.mp4"></video>',
          goodCode: '<video autoplay muted loop playsinline src="tlo.mp4"></video>',
        },
      ],
      practicalTask: {
        title: 'Wdrożenie responsywnego wideo w CSS',
        brief: 'Osadź wideo i ustaw regułę CSS max-width: 100%; height: auto, sprawdzając skalowanie na różnych szerokościach.',
        steps: ['Wstaw znacznik <video>', 'Nadaj styl CSS zapobiegający overflow', 'Przetestuj responsywność'],
        deliverable: 'Prawidłowo skalujący się odtwarzacz wideo.',
      },
      completionCriteria: [
        'Zrozumienie atrybutów multimedialnych HTML5',
        'Prawidłowe rozwiązanie ćwiczenia z tagiem video',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
  ],
};
