import { Module } from '../../types';

export const MODULE_2: Module = {
  id: 2,
  title: 'Podstawy HTML — Tworzenie Pierwszych Stron od Zera',
  category: 'Podstawy',
  description: 'Najprostszy start w świat tworzenia stron! Krok po kroku, bez trudnych pojęć i z gotowymi podpowiedziami nauczysz się wstawiać tytuły, teksty, listy, zdjęcia, linki oraz formularze.',
  badgeName: 'Mistrz Podstaw HTML',
  badgeIcon: 'FileCode2',
  durationHours: 12,
  totalXp: 600,
  prerequisites: ['Brak — zaczynamy całkowicie od zera!'],
  topics: [
    'Pierwsze znaczniki: nagłówki (h1–h3), akapity tekstu (p) i pogrubienie (strong)',
    'Listy zakupów i kroków (ul, ol, li) oraz klikalne linki (a href)',
    'Wstawianie obrazków (img) oraz proste tabelki (table, tr, td)',
    'Grupowanie elementów w pudełka (div, span) oraz nadawanie im nazw (class, id)',
    'Szkielet pełnej strony HTML: head (ustawienia) i body (widoczna treść)',
    'Czytelny podział strony: nagłówek (header), menu (nav), treść (main) i stopka (footer)',
    'Proste formularze: pola tekstowe (input), podpisy (label) i przyciski (button)',
    'Multimedia na stronie: wideo (video) i dźwięk (audio)',
    'Dobre praktyki: ułatwienia dla czytników ekranu i opis strony dla Google (SEO)',
  ],
  projectBrief: 'Projekt końcowy modułu: Twoja pierwsza wizytówka internetowa z tytułem, zdjęciem, listą umiejętności i formularzem kontaktowym.',
  lessons: [
    {
      id: 'html-7',
      moduleId: 1,
      moduleTitle: 'Podstawy HTML — Tworzenie Pierwszych Stron od Zera',
      title: 'Pierwsze znaczniki HTML: Nagłówki (h1–h6), akapity (p) i pogrubienie (strong)',
      slug: 'tekst-typografia-formatowanie-html',
      durationMinutes: 15,
      xpReward: 60,
      order: 1,
      summary: 'Witaj na pierwszej lekcji! Zobaczysz, jak w 3 prostych krokach wyświetlić na ekranie duży tytuł, zwykły tekst oraz pogrubione słowo.',
      objectives: [
        'Zrozumieć, że znacznik HTML to zwykłe słowo w nawiasach < >, np. <h1>',
        'Stworzyć duży tytuł za pomocą <h1> oraz zwykły akapit tekstu za pomocą <p>',
        'Pogrubić ważne słowo za pomocą znacznika <strong>',
      ],
      prerequisites: ['Brak — zaczynamy całkowicie od zera!'],
      theoryMarkdown: `Witaj na pierwszej lekcji! Każda strona internetowa — od prostego bloga po YouTube czy Allegro — jest zbudowana z prostych klocków zwanych **znacznikami HTML** (po angielsku *tags*).

**1. Jak wygląda znacznik HTML?**
Znacznik to krótkie słowo zamknięte w nawiasach ostrokątnych \`<\` oraz \`>\`. Pomyśl o nim jak o pudełku, które otwierasz na początku zdania i zamykasz na końcu:
- **Otwarcie pudełka:** \`<h1>\` (mówi przeglądarce: *„tu zaczyna się duży tytuł”*)
- **Zamknięcie pudełka (z ukośnikiem \`/\`):** \`</h1>\` (mówi: *„tu kończy się tytuł”*)

\`\`\`html
<h1>Mój pierwszy tytuł</h1>
\`\`\`

**2. Trzy najważniejsze znaczniki na start:**
1. **\`<h1>\` oraz \`<h2>\` (Nagłówki):** \`<h1>\` to największy, główny tytuł strony (jak tytuł na okładce książki). \`<h2>\` to nieco mniejszy podtytuł rozdziału.
2. **\`<p>\` (Akapit tekstu):** Od angielskiego słowa *paragraph*. Wkładamy do niego zwykłe zdania i opisy.
3. **\`<strong>\` (Pogrubienie):** Gdy chcesz wyróżnić ważne słowo w zdaniu, otaczasz je znacznikiem \`<strong>ważne słowo</strong>\`.`,
      codeExamples: [
        {
          title: 'Prosta wizytówka z tytułem, podtytułem i pogrubieniem',
          language: 'html',
          code: `<h1>Cześć! Nazywam się Tomek</h1>
<h2>Moja pierwsza strona internetowa</h2>
<p>
  Dzisiaj zaczynam naukę <strong>HTML</strong> od podstaw.
  To naprawdę proste!
</p>`,
          explanation: 'Przeglądarka czyta kod od góry do dołu: najpierw wyświetla duży tytuł <h1>, pod nim mniejszy <h2>, a na dole akapit <p> z pogrubionym słowem HTML.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Otwórz znacznik', description: 'Wpisz nazwę w nawiasach ostrokątnych, np. <p>.' },
        { step: 2, title: 'Wpisz tekst w środku', description: 'Napisz dowolne zdanie, np. Lubię tworzyć strony.' },
        { step: 3, title: 'Zamknij znacznik ukośnikiem', description: 'Na końcu zawsze dodaj zamknięcie z ukośnikiem, np. </p>.' },
      ],
      interactiveExercise: {
        id: 'ex-html-text',
        title: 'Dopisz swój pierwszy akapit z pogrubieniem',
        instructions: 'W edytorze na dole przygotowaliśmy już dla Ciebie duży tytuł <h1> oraz podtytuł <h2>. Dopisz na końcu tylko jedną linijkę: akapit <p>, a w jego środku pogrubione słowo w znaczniku <strong>.',
        task: 'Na dole edytora dopisz akapit <p> zawierający pogrubienie <strong> (np. <p>Uczę się <strong>HTML</strong></p>).',
        starterCode: {
          html: '<h1>Moja pierwsza strona</h1>\n<h2>Startuję od zera!</h2>\n\n<!-- 👇 DOPISZ PONIŻEJ AKAPIT <p> Z POGRUBIENIEM <strong> -->\n<!-- Wzór: <p>Uczę się <strong>HTML</strong>!</p> -->\n',
          css: 'body { font-family: system-ui, sans-serif; padding: 20px; line-height: 1.6; color: #1e293b; }\nh1 { color: #2563eb; margin-bottom: 4px; }\nh2 { color: #475569; font-size: 1.15rem; margin-top: 0; }\nstrong { color: #0f172a; background: #fef08a; padding: 2px 6px; border-radius: 4px; }',
          js: 'console.log("Świetnie! Twój pierwszy kod HTML działa.");',
        },
        solutionCode: {
          html: '<h1>Moja pierwsza strona</h1>\n<h2>Startuję od zera!</h2>\n\n<p>Uczę się <strong>HTML</strong> krok po kroku!</p>',
          css: 'body { font-family: system-ui, sans-serif; padding: 20px; line-height: 1.6; color: #1e293b; }\nh1 { color: #2563eb; margin-bottom: 4px; }\nh2 { color: #475569; font-size: 1.15rem; margin-top: 0; }\nstrong { color: #0f172a; background: #fef08a; padding: 2px 6px; border-radius: 4px; }',
          js: 'console.log("Świetnie! Twój pierwszy kod HTML działa.");',
        },
        hints: [
          'Na samym dole edytora wpisz dokładnie: <p>Uczę się <strong>HTML</strong>!</p>',
          'Pamiętaj, że każdy otwarty znacznik <p> i <strong> musi mieć zamknięcie </p> oraz </strong>.',
          'Jeśli wolisz, kliknij przycisk „Wstaw wzór rozwiązania” nad edytorem, aby zobaczyć gotowy kod!',
        ],
        rules: [
          { id: 'r1', description: 'Dodano akapit tekstu <p>', ruleType: 'html_tag_exists', target: 'p' },
          { id: 'r2', description: 'Użyto pogrubienia <strong>', ruleType: 'html_tag_exists', target: 'strong' },
        ],
      },
      independentTask: {
        title: 'Dodaj trzeci mniejszy nagłówek <h3>',
        instructions: 'Spróbuj pod swoim akapitem dopisać jeszcze mniejszy podtytuł: <h3>Moje hobby</h3>.',
        expectedOutcome: 'Na podglądzie pojawi się dodatkowy, mniejszy nagłówek.',
        starterHint: 'Wpisz <h3>Moje hobby</h3> na końcu kodu.',
      },
      quiz: [
        {
          id: 'q-h7-1',
          question: 'Jak prawidłowo zamknąć znacznik nagłówka <h1>?',
          options: [
            'Za pomocą znacznika z ukośnikiem: </h1>',
            'Za pomocą kropki na końcu zdania',
            'Wpisując ponownie <h1>',
            'Znaczników w HTML nigdy się nie zamyka',
          ],
          correctAnswer: 0,
          explanation: 'W HTML zamknięcie znacznika wygląda tak samo jak otwarcie, ale ma ukośnik "/" zaraz po znaku "<", czyli </h1>.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Zapomnienie o ukośniku "/" w znaczniku zamykającym',
          whyItHappens: 'Na początku łatwo napisać dwa razy <p> zamiast zamknąć go przez </p>.',
          howToFix: 'Sprawdź, czy drugi znacznik w parze zaczyna się od </ (np. </h1>, </p>, </strong>).',
          badCode: '<h1>Witaj na stronie<h1>',
          goodCode: '<h1>Witaj na stronie</h1>',
        },
      ],
      practicalTask: {
        title: 'Zmień tekst na swoje imię',
        brief: 'W edytorze powyżej zamień tekst w nagłówku <h1> na własne imię i zobacz zmianę w okienku podglądu po prawej stronie.',
        steps: ['Kliknij w pierwszą linijkę edytora', 'Wpisz swoje imię pomiędzy <h1> a </h1>', 'Zobacz efekt na żywo'],
        deliverable: 'Twoja pierwsza spersonalizowana strona.',
      },
      completionCriteria: [
        'Poznanie znaczników h1, h2, p oraz strong',
        'Dopisanie akapitu z pogrubieniem w edytorze',
        'Poprawna odpowiedź w krótkim quizie',
      ],
    },
    {
      id: 'html-8',
      moduleId: 2,
      moduleTitle: 'Podstawy HTML — Tworzenie Pierwszych Stron od Zera',
      title: 'Listy punktowane i numerowane (ul, ol) oraz linki (a href)',
      slug: 'listy-linki-sciezki-wzgledne',
      durationMinutes: 15,
      xpReward: 65,
      order: 2,
      summary: 'Naucz się tworzyć proste listy (jak lista zakupów) oraz klikalne linki prowadzące do innych stron.',
      objectives: [
        'Tworzyć listę z kropkami <ul> oraz listę ponumerowaną <ol>',
        'Dodawać pojedyncze podpunkty listy za pomocą znacznika <li>',
        'Tworzyć klikalny link za pomocą znacznika <a href="adres">',
      ],
      prerequisites: ['Lekcja 1: Pierwsze znaczniki HTML'],
      theoryMarkdown: `Na niemal każdej stronie spotkasz wyliczenia (np. listę zalet produktu) oraz linki, w które można kliknąć. W HTML robi się je wyjątkowo łatwo!

**1. Dwa rodzaje list — z kropkami (\`<ul>\`) i z numerami (\`<ol>\`):**
Każda lista składa się z „opakowania” całej listy oraz pojedynczych podpunktów **\`<li>\`** (od ang. *list item*):
- **\`<ul>\` (Lista z kropkami):** Używamy jej, gdy kolejność nie ma znaczenia (np. lista zakupów: chleb, mleko, masło).
- **\`<ol>\` (Lista ponumerowana 1, 2, 3...):** Używamy jej, gdy liczy się kolejność kroków (np. przepis kulinarny lub podium zawodów).
- **\`<li>\` (Podpunkt listy):** Każdy wiersz wewnątrz \`<ul>\` lub \`<ol>\` pakujemy w osobne \`<li>...</li>\`.

\`\`\`html
<ul>
  <li>Kawa</li>
  <li>Herbata</li>
</ul>
\`\`\`

**2. Klikalny link (\`<a href="...">\`):**
Aby stworzyć link, używamy krótkiego znacznika **\`<a>\`**. Musimy mu jednak podać adres strony, do której ma prowadzić — służy do tego dopisek **\`href="adres"\`** wewnątrz otwarcia:
\`\`\`html
<a href="https://google.pl">Przejdź do Google</a>
\`\`\``,
      codeExamples: [
        {
          title: 'Lista celów nauki oraz klikalny link',
          language: 'html',
          code: `<h2>Mój plan nauki:</h2>
<ol>
  <li>Poznać podstawy HTML</li>
  <li>Pokolorować stronę w CSS</li>
  <li>Zbudować własne portfolio</li>
</ol>

<a href="https://developer.mozilla.org">Otwórz słownik HTML</a>`,
          explanation: 'Znacznik <ol> sam automatycznie ponumeruje wszystkie elementy <li> od 1 do 3! Na dole <a href="..."> tworzy niebieski link.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Otwórz listę <ul> lub <ol>', description: 'Wpisz <ul> dla kropek lub <ol> dla numerków.' },
        { step: 2, title: 'Dodaj podpunkty <li>', description: 'Każdą pozycję umieść w osobnym <li>Tekst</li>.' },
        { step: 3, title: 'Dodaj link <a href="...">', description: 'W cudzysłowie po href= wpisz adres strony.' },
      ],
      interactiveExercise: {
        id: 'ex-html-lists',
        title: 'Dodaj kolejny podpunkt do listy oraz link',
        instructions: 'W edytorze mamy już gotową listę numerowaną <ol> z dwoma krokami. Dopisz na dole klikalny link <a> z atrybutem href (np. <a href="https://google.pl">Szukaj w Google</a>).',
        task: 'Dopisz na dole edytora klikalny link <a href="...">Tekst linku</a>.',
        starterCode: {
          html: '<h3>Jak zacząć programować:</h3>\n<ol>\n  <li>Krok pierwszy: Poznaj HTML</li>\n  <li>Krok drugi: Ćwicz w edytorze</li>\n</ol>\n\n<!-- 👇 DOPISZ PONIŻEJ LINK <a href="..."> -->\n<!-- Wzór: <a href="https://google.pl">Mój pierwszy link</a> -->\n',
          css: 'body { font-family: sans-serif; padding: 20px; color: #1e293b; }\nol { background: #f8fafc; padding: 16px 32px; border-radius: 8px; border: 1px solid #e2e8f0; line-height: 1.8; }\na { display: inline-block; margin-top: 8px; color: #4f46e5; font-weight: bold; }',
          js: 'console.log("Lista i link gotowe!");',
        },
        solutionCode: {
          html: '<h3>Jak zacząć programować:</h3>\n<ol>\n  <li>Krok pierwszy: Poznaj HTML</li>\n  <li>Krok drugi: Ćwicz w edytorze</li>\n</ol>\n\n<a href="https://google.pl">Mój pierwszy link</a>',
          css: 'body { font-family: sans-serif; padding: 20px; color: #1e293b; }\nol { background: #f8fafc; padding: 16px 32px; border-radius: 8px; border: 1px solid #e2e8f0; line-height: 1.8; }\na { display: inline-block; margin-top: 8px; color: #4f46e5; font-weight: bold; }',
          js: 'console.log("Lista i link gotowe!");',
        },
        hints: [
          'Lista <ol> z podpunktami <li> jest już gotowa na górze edytora — nie usuwaj jej.',
          'Na samym dole dopisz linijkę: <a href="https://google.pl">Mój pierwszy link</a>',
          'Kliknij „Sprawdź kod”, aby zaliczyć zadanie!',
        ],
        rules: [
          { id: 'r1', description: 'W kodzie znajduje się lista <ol> z podpunktami <li>', ruleType: 'html_tag_exists', target: 'li' },
          { id: 'r2', description: 'Dodano znacznik linku <a>', ruleType: 'html_tag_exists', target: 'a' },
          { id: 'r3', description: 'Link posiada atrybut href="..." z adresem', ruleType: 'html_attr_exists', target: 'href' },
        ],
      },
      independentTask: {
        title: 'Dodaj trzeci podpunkt <li> do listy',
        instructions: 'Wewnątrz znacznika <ol> (pod drugim podpunktem) dopisz trzeci wiersz: <li>Krok trzeci: Zbuduj stronę</li>.',
        expectedOutcome: 'Lista automatycznie wyświetli numer 3.',
        starterHint: 'Wpisz <li>...</li> tuż przed zamknięciem </ol>.',
      },
      quiz: [
        {
          id: 'q-h8-1',
          question: 'Którego znacznika używamy do stworzenia pojedynczego podpunktu wewnątrz listy <ul> lub <ol>?',
          options: [
            'Znacznika <p>',
            'Znacznika <li> (od angielskiego list item)',
            'Znacznika <punkt>',
            'Znacznika <h1>',
          ],
          correctAnswer: 1,
          explanation: 'Zarówno w liście punktowanej <ul>, jak i numerowanej <ol>, każdy pojedynczy podpunkt umieszczamy w znaczniku <li>...</li>.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Wpisywanie tekstu bezpośrednio w <ul> bez znaczników <li>',
          whyItHappens: 'Zapomnienie, że <ul> to tylko ramka całej listy, a każdy punkt wymaga osobnego <li>.',
          howToFix: 'Zawsze otaczaj każdy podpunkt listy parą <li> oraz </li>.',
          badCode: '<ul>\n  Jabłka\n  Pomarańcze\n</ul>',
          goodCode: '<ul>\n  <li>Jabłka</li>\n  <li>Pomarańcze</li>\n</ul>',
        },
      ],
      practicalTask: {
        title: 'Lista ulubionych filmów lub gier',
        brief: 'Zmień w edytorze tekst podpunktów <li> na swoje ulubione filmy lub gry.',
        steps: ['Zmień tekst wewnątrz pierwszego <li>', 'Zmień tekst wewnątrz drugiego <li>', 'Dopisz trzeci element <li>'],
        deliverable: 'Własna ponumerowana lista TOP 3.',
      },
      completionCriteria: [
        'Zrozumienie działania list ul, ol oraz li',
        'Dodanie linku <a href="..."> w ćwiczeniu',
        'Zaliczenie quizu',
      ],
    },
    {
      id: 'html-4',
      moduleId: 2,
      moduleTitle: 'Podstawy HTML — Tworzenie Pierwszych Stron od Zera',
      title: 'Obrazki (img), odnośniki i proste tabele danych (table)',
      slug: 'multimedia-tabele-linki',
      durationMinutes: 20,
      xpReward: 70,
      order: 3,
      summary: 'Dowiedz się, jak wstawić na stronę zdjęcie za pomocą znacznika <img> oraz jak ułożyć dane w prostą tabelkę z wierszami i kolumnami.',
      objectives: [
        'Wstawiać obrazki za pomocą <img src="adres" alt="opis">',
        'Rozumieć po co dodajemy opis alternatywny alt w obrazku',
        'Tworzyć prostą tabelkę za pomocą <table>, wiersza <tr> i komórki <td>',
      ],
      prerequisites: ['Lekcja 2: Listy i linki'],
      theoryMarkdown: `Strona internetowa bez zdjęć wyglądałaby nudno! Zobaczmy, jak w jednej linijce wstawić obrazek oraz jak ułożyć dane w prostą tabelkę.

**1. Wstawianie obrazka (\`<img>\`):**
Znacznik \`<img>\` (od ang. *image*) jest wyjątkowy — jest pojedynczy i nie wymaga osobnego zamknięcia \`</img>\`. Podajemy w nim dwie proste informacje:
- **\`src="adres-zdjecia.jpg"\`** (od *source* — źródło): skąd przeglądarka ma pobrać obrazek.
- **\`alt="Opis zdjęcia"\`** (tekst alternatywny): krótki opis słowny tego, co jest na zdjęciu (wyświetli się, gdy zdjęcie się nie załaduje, oraz przeczyta go lektor osobie niewidomej).

\`\`\`html
<img src="https://picsum.photos/300/160" alt="Krajobraz górski" />
\`\`\`

**2. Prosta tabelka (\`<table>\`):**
Gdy chcesz pokazać cennik lub plan lekcji, używasz tabeli. Składa się ona z 3 prostych znaczników:
1. **\`<table>\`**: Cała ramka tabeli.
2. **\`<tr>\` (Table Row — wiersz):** Każdy poziomy rząd w tabeli.
3. **\`<th>\` lub \`<td>\` (Komórki w wierszu):** \`<th>\` to pogrubiona komórka tytułowa na górze, a \`<td>\` to zwykła komórka z danymi.`,
      codeExamples: [
        {
          title: 'Obrazek oraz prosta dwukolumnowa tabelka',
          language: 'html',
          code: `<img src="https://picsum.photos/280/140" alt="Zdjęcie biurka programisty" />

<table>
  <tr>
    <th>Technologia</th>
    <th>Poziom</th>
  </tr>
  <tr>
    <td>HTML</td>
    <td>Podstawy</td>
  </tr>
</table>`,
          explanation: 'Pierwszy wiersz <tr> zawiera pogrubione nagłówki kolumn <th>, a drugi wiersz <tr> zawiera zwykłe komórki z danymi <td>.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Wstaw obrazek <img>', description: 'Podaj adres w src="..." oraz krótki opis w alt="...".' },
        { step: 2, title: 'Otwórz tabelę <table>', description: 'Każdy nowy rząd zaczynaj od znacznika wiersza <tr>.' },
        { step: 3, title: 'Wypełnij wiersz komórkami <td>', description: 'Wewnątrz <tr> wpisz komórki <td>Tekst</td>.' },
      ],
      interactiveExercise: {
        id: 'ex-html-4',
        title: 'Dodaj obrazek <img> nad gotową tabelką',
        instructions: 'W edytorze przygotowaliśmy już gotową tabelkę z planem nauki. Twoim zadaniem jest dopisanie na samej górze znacznika obrazka <img src="https://picsum.photos/260/120" alt="Baner kursu" />.',
        task: 'Dodaj w kodzie znacznik obrazka <img> z atrybutami src oraz alt.',
        starterCode: {
          html: '<!-- 👇 DOPISZ PONIŻEJ OBRAZEK <img> Z ATRYBUTAMI src ORAZ alt -->\n<!-- Wzór: <img src="https://picsum.photos/260/120" alt="Baner kursu" /> -->\n\n\n<h3>Mój postęp w nauce:</h3>\n<table>\n  <tr>\n    <th>Temat</th>\n    <th>Status</th>\n  </tr>\n  <tr>\n    <td>Nagłówki i listy</td>\n    <td>Ukończone</td>\n  </tr>\n</table>',
          css: 'body { font-family: sans-serif; padding: 20px; color: #1e293b; }\nimg { border-radius: 10px; display: block; margin-bottom: 12px; }\ntable { width: 100%; border-collapse: collapse; }\nth, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }\nth { background: #f1f5f9; }',
          js: 'console.log("Obrazek i tabela gotowe!");',
        },
        solutionCode: {
          html: '<img src="https://picsum.photos/260/120" alt="Baner kursu" />\n\n<h3>Mój postęp w nauce:</h3>\n<table>\n  <tr>\n    <th>Temat</th>\n    <th>Status</th>\n  </tr>\n  <tr>\n    <td>Nagłówki i listy</td>\n    <td>Ukończone</td>\n  </tr>\n</table>',
          css: 'body { font-family: sans-serif; padding: 20px; color: #1e293b; }\nimg { border-radius: 10px; display: block; margin-bottom: 12px; }\ntable { width: 100%; border-collapse: collapse; }\nth, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }\nth { background: #f1f5f9; }',
          js: 'console.log("Obrazek i tabela gotowe!");',
        },
        hints: [
          'Skopiuj lub wpisz na górze edytora: <img src="https://picsum.photos/260/120" alt="Baner kursu" />',
          'Upewnij się, że nie usunąłeś znajdującej się niżej tabeli <table>.',
          'Kliknij zielony przycisk „Sprawdź kod”.',
        ],
        rules: [
          { id: 'r1', description: 'Wstawiono znacznik obrazka <img>', ruleType: 'html_tag_exists', target: 'img' },
          { id: 'r2', description: 'Obrazek posiada opis alt="..."', ruleType: 'html_attr_exists', target: 'alt' },
          { id: 'r3', description: 'W kodzie znajduje się tabela <table>', ruleType: 'html_tag_exists', target: 'table' },
        ],
      },
      independentTask: {
        title: 'Dodaj kolejny wiersz <tr> do tabeli',
        instructions: 'Przed zamknięciem </table> dopisz jeszcze jeden wiersz: <tr><td>Obrazki i tabele</td><td>W trakcie</td></tr>.',
        expectedOutcome: 'Tabela powiększy się o drugi wiersz z danymi.',
        starterHint: 'Skopiuj istniejący blok <tr>...</tr> i zmień w nim tekst.',
      },
      quiz: [
        {
          id: 'q-h4-1',
          question: 'Który atrybut w znaczniku <img> odpowiada za podanie adresu (ścieżki) do wyświetlanego obrazka?',
          options: [
            'Atrybut src (od angielskiego source — źródło)',
            'Atrybut color',
            'Atrybut table',
            'Atrybut text',
          ],
          correctAnswer: 0,
          explanation: 'W znaczniku <img src="foto.jpg" alt="Opis"> atrybut src wskazuje plik ze zdjęciem, a alt zawiera jego opis słowny.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Pomijanie atrybutu alt="..." przy wstawianiu zdjęcia',
          whyItHappens: 'Skupienie się wyłącznie na tym, żeby obrazek wyświetlił się na ekranie.',
          howToFix: 'Zawsze dodawaj krótki opis w alt="...", np. alt="Logo firmy" — pomaga to osobom niewidomym i wyszukiwarce Google.',
          badCode: '<img src="pies.jpg" />',
          goodCode: '<img src="pies.jpg" alt="Złoty labrador biegnący po trawie" />',
        },
      ],
      practicalTask: {
        title: 'Zmień rozmiar losowego zdjęcia',
        brief: 'W adresie https://picsum.photos/260/120 liczby 260 i 120 to szerokość i wysokość obrazka. Zmień je np. na 320/150!',
        steps: ['Znajdź adres w src="..."', 'Zmień liczby wymiarów obrazka', 'Zobacz nowe zdjęcie w podglądzie'],
        deliverable: 'Zrozumienie działania atrybutu src.',
      },
      completionCriteria: [
        'Umiejętność wstawienia obrazka <img> z opisem alt',
        'Zrozumienie budowy wierszy <tr> i komórek <td> w tabeli',
        'Zaliczenie quizu',
      ],
    },
    {
      id: 'html-9',
      moduleId: 2,
      moduleTitle: 'Podstawy HTML — Tworzenie Pierwszych Stron od Zera',
      title: 'Pudełka div i span oraz nazywanie elementów za pomocą id i class',
      slug: 'elementy-blokowe-liniowe-atrybuty-globalne',
      durationMinutes: 15,
      xpReward: 65,
      order: 4,
      summary: 'Poznaj dwa najpopularniejsze „opakowania” w HTML: pudełko <div> do grupowania sekcji oraz <span> do wyróżniania pojedynczych słów, a także etykiety class i id.',
      objectives: [
        'Grupować powiązane elementy (np. tytuł i opis karty) w jedno pudełko <div>',
        'Wyróżniać pojedyncze słowo lub cenę wewnątrz zdania za pomocą <span>',
        'Nadawać elementom klasy (class="karta") potrzebne do późniejszego kolorowania w CSS',
      ],
      prerequisites: ['Lekcja 3: Obrazki i tabele'],
      theoryMarkdown: `Kiedy budujesz stronę (np. sklep internetowy), chcesz pogrupować zdjęcie produktu, jego nazwę i cenę w jedną ładną ramkę. Do tego właśnie służą znaczniki grupujące **\`<div>\`** oraz **\`<span>\`**.

**1. Duże pudełko \`<div>\` vs mały zakreślacz \`<span>\`:**
- **\`<div>\` (Pudełko blokowe):** Pomyśl o nim jak o kartonowym pudełku, do którego wkładasz kilka elementów naraz (np. nagłówek \`<h3>\` i akapit \`<p>\`). Każde pudełko \`<div>\` układa się jedno pod drugim, w nowej linii.
- **\`<span>\` (Zakreślacz w tekście):** Działa wewnątrz pojedynczej linijki tekstu, nie przenosząc niczego do nowego wiersza. Idealny, by pokolorować jedno słowo lub cenę w środku zdania!

**2. Jak nazwać pudełko? Atrybut \`class\` oraz \`id\`:**
Żeby później w języku CSS pokolorować nasze pudełko, nadajemy mu nazwę:
- **\`class="nazwa"\` (Klasa — wielokrotnego użytku):** Możesz nadać tę samą klasę np. dziesięciu kartom produktów na stronie (\`<div class="karta">\`).
- **\`id="unikalna-nazwa"\` (Identyfikator — tylko jeden na stronę):** Działa jak numer PESEL — służy do oznaczenia jednego, konkretnego miejsca na stronie (np. \`id="koszyk"\`).`,
      codeExamples: [
        {
          title: 'Karta produktu zbudowana z pudełka <div> i wyróżnienia <span>',
          language: 'html',
          code: `<div class="product-card">
  <h3>Słuchawki Bezprzewodowe</h3>
  <p>Cena promocyjna: <span class="price">199 zł</span></p>
</div>`,
          explanation: 'Pudełko <div class="product-card"> tworzy białą kartę z ramką, a <span class="price"> podświetla samą kwotę "199 zł" na zielono.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Otwórz pudełko <div class="...">', description: 'Grupuj powiązane elementy w jeden kontener <div>.' },
        { step: 2, title: 'Użyj <span class="..."> w zdaniu', description: 'Otocz pojedyncze słowo lub kwotę znacznikiem <span>.' },
        { step: 3, title: 'Zamknij </span> oraz </div>', description: 'Pamiętaj o domknięciu obu znaczników.' },
      ],
      interactiveExercise: {
        id: 'ex-html-block-inline',
        title: 'Podświetl cenę produktu za pomocą <span class="price">',
        instructions: 'W edytorze przygotowaliśmy już gotowe pudełko <div class="product-card">. Dopisz w środku akapit z ceną otoczoną znacznikiem <span class="price">199 zł</span>.',
        task: 'Wewnątrz <div class="product-card"> dodaj element <span class="price">199 zł</span>.',
        starterCode: {
          html: '<div class="product-card">\n  <h3>Kurs Tworzenia Stron</h3>\n  <!-- 👇 DOPISZ PONIŻEJ AKAPIT Z CENĄ W <span class="price"> -->\n  <!-- Wzór: <p>Cena: <span class="price">199 zł</span></p> -->\n  \n</div>',
          css: '.product-card { background: #ffffff; border: 2px solid #cbd5e1; padding: 16px; border-radius: 12px; max-width: 300px; font-family: sans-serif; }\nh3 { margin-top: 0; color: #0f172a; }\n.price { background: #dcfce7; color: #166534; padding: 3px 8px; border-radius: 6px; font-weight: bold; }',
          js: 'console.log("Pudełko div i wyróżnienie span gotowe!");',
        },
        solutionCode: {
          html: '<div class="product-card">\n  <h3>Kurs Tworzenia Stron</h3>\n  <p>Cena: <span class="price">199 zł</span></p>\n</div>',
          css: '.product-card { background: #ffffff; border: 2px solid #cbd5e1; padding: 16px; border-radius: 12px; max-width: 300px; font-family: sans-serif; }\nh3 { margin-top: 0; color: #0f172a; }\n.price { background: #dcfce7; color: #166534; padding: 3px 8px; border-radius: 6px; font-weight: bold; }',
          js: 'console.log("Pudełko div i wyróżnienie span gotowe!");',
        },
        hints: [
          'Wewnątrz pudełka <div class="product-card"> (przed zamknięciem </div>) dopisz: <p>Cena: <span class="price">199 zł</span></p>',
          'Zauważ, że w zakładce styles.css klasa .price jest już przygotowana i od razu pokoloruje cenę na zielono!',
        ],
        rules: [
          { id: 'r1', description: 'Pudełko posiada klasę product-card', ruleType: 'html_contains', target: 'product-card' },
          { id: 'r2', description: 'Użyto znacznika <span> wewnątrz karty', ruleType: 'html_tag_exists', target: 'span' },
          { id: 'r3', description: 'Nadano klasę price (class="price")', ruleType: 'html_contains', target: 'price' },
        ],
      },
      independentTask: {
        title: 'Stwórz drugą kartę produktu poniżej',
        instructions: 'Skopiuj cały blok <div class="product-card">...</div> i wklej go poniżej ze zmienioną nazwą produktu.',
        expectedOutcome: 'Dwie identycznie ostylowane karty produktów jedna pod drugą.',
        starterHint: 'Dzięki klasie class="product-card" obie karty automatycznie mają ten sam wygląd!',
      },
      quiz: [
        {
          id: 'q-h9-1',
          question: 'Czym różni się pudełko <div> od znacznika <span>?',
          options: [
            '<div> zawsze tworzy nowy blok od nowej linii (do grupowania większych sekcji), a <span> działa wewnątrz jednej linii tekstu',
            '<span> służy do wstawiania filmów wideo',
            '<div> może być użyty tylko raz na całej stronie',
            'Nie ma między nimi żadnej różnicy',
          ],
          correctAnswer: 0,
          explanation: '<div> to duży kontener blokowy (zaczyna się od nowej linii), a <span> to mały element liniowy do wyróżniania fragmentu zdania.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Nadawanie tego samego id="..." wielu elementom na stronie',
          whyItHappens: 'Mylenie unikalnego identyfikatora id z klasą wielokrotnego użytku class.',
          howToFix: 'Jeśli chcesz nadać ten sam wygląd kilku elementom, zawsze używaj class="karta", a nie id="karta".',
          badCode: '<div id="karta">Produkt 1</div>\n<div id="karta">Produkt 2</div>',
          goodCode: '<div class="karta">Produkt 1</div>\n<div class="karta">Produkt 2</div>',
        },
      ],
      practicalTask: {
        title: 'Zobacz jak CSS łączy się z class="price"',
        brief: 'Zajrzyj na chwilę do zakładki styles.css w edytorze i zobacz linijkę .price { background: #dcfce7; }.',
        steps: ['Kliknij zakładkę styles.css w edytorze', 'Zobacz skąd wziął się zielony kolor tła dla klasy .price', 'Wróć do zakładki index.html'],
        deliverable: 'Zrozumienie po co nadajemy klasy w HTML.',
      },
      completionCriteria: [
        'Zrozumienie różnicy między <div> (blok) a <span> (w linii tekstu)',
        'Użycie <span class="price"> w ćwiczeniu',
        'Zaliczenie quizu',
      ],
    },
    {
      id: 'html-1',
      moduleId: 2,
      moduleTitle: 'Podstawy HTML — Tworzenie Pierwszych Stron od Zera',
      title: 'Pełny szkielet pliku HTML5: DOCTYPE, sekcja head oraz ciało strony body',
      slug: 'anatomia-dokumentu-html5',
      durationMinutes: 20,
      xpReward: 60,
      order: 5,
      summary: 'Znamy już podstawowe znaczniki! Teraz zobaczmy, w jaki „szkielet” opakowujemy każdy prawdziwy plik index.html: czym różni się niewidoczna głowa <head> od widocznego ciała strony <body>.',
      objectives: [
        'Poznać 4 stałe elementy każdego pliku HTML (DOCTYPE, html, head, body)',
        'Odróżniać niewidoczne ustawienia strony (<head> i <title>) od widocznej treści (<body>)',
        'Uzupełnić widoczną sekcję <body> o główny nagłówek <h1>',
      ],
      prerequisites: ['Lekcja 4: Pudełka div i span'],
      theoryMarkdown: `W poprzednich lekcjach pisaliśmy od razu nagłówki \`<h1>\` i akapity \`<p>\`. Kiedy jednak tworzysz prawdziwy plik \`index.html\` na komputerze, otaczasz go prostym, standardowym **szkieletem strony**.

Dобра wiadomość: **żaden programista nie pisze tego szkieletu z pamięci** — edytory kodu generują go jednym skrótem klawiszowym! Warto jednak rozumieć, z jakich **4 części** się składa:

1. **\`<!DOCTYPE html>\`**: Krótka informacja na samej górze pliku mówiąca przeglądarce: *„To jest nowoczesna strona HTML5”*.
2. **\`<html lang="pl">\`**: Główna ramka otaczająca cały plik. Dopisek \`lang="pl"\` oznacza, że strona jest w języku polskim.
3. **\`<head>\` (Niewidoczna „głowa” z ustawieniami):** Tutaj wpisujemy tytuł wyświetlany na karcie przeglądarki (\`<title>\`) oraz obsługę polskich znaków (\`<meta charset="UTF-8">\`).
4. **\`<body>\` (Widoczne „ciało” strony):** Wszystko, co wpiszesz wewnątrz \`<body>...</body>\` (nagłówki \`<h1>\`, teksty \`<p>\`, zdjęcia \`<img>\`), wyświetli się na ekranie użytkownika!`,
      codeExamples: [
        {
          title: 'Kompletny plik index.html z podziałem na <head> oraz <body>',
          language: 'html',
          code: `<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <title>Moja Wizytówka</title>
  </head>
  <body>
    <h1>Cześć! Witaj na mojej stronie</h1>
    <p>Wszystko wewnątrz body jest widoczne na ekranie.</p>
  </body>
</html>`,
          explanation: 'Tekst w <title> trafia na górną zakładkę przeglądarki, natomiast <h1> i <p> wewnątrz <body> pojawiają się na samej stronie.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zostaw ustawienia w <head>', description: 'W sekcji <head> trzymamy <title> (tytuł karty) i kodowanie znaków.' },
        { step: 2, title: 'Znajdź sekcję <body>', description: 'To tutaj budujemy widoczną zawartość strony.' },
        { step: 3, title: 'Wpisz <h1> wewnątrz <body>', description: 'Dodaj główny nagłówek pomiędzy <body> a </body>.' },
      ],
      interactiveExercise: {
        id: 'ex-html-1',
        title: 'Dodaj główny tytuł <h1> wewnątrz widocznej sekcji <body>',
        instructions: 'W edytorze mamy już gotowy pełny szkielet HTML5 (<!DOCTYPE html>, <html lang="pl">, <head> oraz <body>). Dopisz wewnątrz <body> nagłówek <h1> ze swoim imieniem lub tytułem strony!',
        task: 'Wewnątrz sekcji <body> dopisz nagłówek <h1>Dowolny tytuł</h1>.',
        starterCode: {
          html: '<!DOCTYPE html>\n<html lang="pl">\n  <head>\n    <title>Moja Pierwsza Strona</title>\n  </head>\n  <body>\n    <!-- 👇 DOPISZ PONIŻEJ NAGŁÓWEK <h1> -->\n    <!-- Wzór: <h1>Moja strona domowa</h1> -->\n    \n  </body>\n</html>',
          css: 'body { font-family: "Segoe UI", sans-serif; padding: 24px; background: #f8fafc; color: #0f172a; }\nh1 { color: #2563eb; font-size: 1.8rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }',
          js: 'console.log("Szkielet dokumentu HTML5 gotowy!");',
        },
        solutionCode: {
          html: '<!DOCTYPE html>\n<html lang="pl">\n  <head>\n    <title>Moja Pierwsza Strona</title>\n  </head>\n  <body>\n    <h1>Moja strona domowa</h1>\n    <p>Znam już budowę pełnego pliku HTML5.</p>\n  </body>\n</html>',
          css: 'body { font-family: "Segoe UI", sans-serif; padding: 24px; background: #f8fafc; color: #0f172a; }\nh1 { color: #2563eb; font-size: 1.8rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }',
          js: 'console.log("Szkielet dokumentu HTML5 gotowy!");',
        },
        hints: [
          'Cały szkielet <!DOCTYPE html>, <head> i <body> jest już wpisany.',
          'Wewnątrz <body> dopisz po prostu: <h1>Moja strona domowa</h1>',
          'Kliknij „Sprawdź kod”, aby zaliczyć ćwiczenie!',
        ],
        rules: [
          { id: 'r1', description: 'Zachowano deklarację <!DOCTYPE html>', ruleType: 'html_contains', target: '<!doctype html>' },
          { id: 'r2', description: 'Zachowano sekcję <head> z tytułem <title>', ruleType: 'html_tag_exists', target: 'title' },
          { id: 'r3', description: 'Wewnątrz <body> dodano nagłówek <h1>', ruleType: 'html_tag_exists', target: 'h1' },
        ],
      },
      independentTask: {
        title: 'Dodaj akapit <p> pod nagłówkiem <h1>',
        instructions: 'Wewnątrz <body> dopisz pod swoim nagłówkiem <h1> krótki akapit <p>Odwiedź moją stronę!</p>.',
        expectedOutcome: 'Pełny dokument HTML z tytułem i opisem.',
        starterHint: 'Pamiętaj, aby pisać przed znacznikiem zamykającym </body>.',
      },
      quiz: [
        {
          id: 'q-h1-1',
          question: 'W której sekcji pliku HTML umieszczamy wszystkie widoczne elementy strony (nagłówki, teksty, zdjęcia i przyciski)?',
          options: [
            'Wewnątrz sekcji <body>...</body>',
            'Wewnątrz sekcji <head>...</head>',
            'Wewnątrz znacznika <title>',
            'Przed linijką <!DOCTYPE html>',
          ],
          correctAnswer: 0,
          explanation: 'Sekcja <body> (ciało strony) zawiera wszystko, co użytkownik widzi na ekranie. Sekcja <head> służy tylko do ukrytych ustawień technicznych.',
        },
        {
          id: 'q-h1-2',
          question: 'Gdzie wyświetla się tekst wpisany w znaczniku <title> wewnątrz sekcji <head>?',
          options: [
            'Na dole strony w stopce',
            'Na pasku karty (zakładki) przeglądarki u samej góry ekranu oraz w wynikach Google',
            'W konsoli błędów',
            'Nigdzie się nie wyświetla',
          ],
          correctAnswer: 1,
          explanation: 'Znacznik <title> określa nazwę karty na górnym pasku przeglądarki (np. "Moja Pierwsza Strona").',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Wpisywanie tekstów i przycisków w sekcji <head> zamiast w <body>',
          whyItHappens: 'Na początku łatwo pomylić słowo head (ustawienia dokumentu) z nagłówkiem widocznym na stronie.',
          howToFix: 'W <head> trzymaj tylko <meta> i <title>. Całą zawartość strony wpisuj zawsze wewnątrz <body>.',
          badCode: '<head>\n  <title>Strona</title>\n  <h1>Witaj!</h1> <!-- BŁĄD: w head nie dajemy treści -->\n</head>',
          goodCode: '<head>\n  <title>Strona</title>\n</head>\n<body>\n  <h1>Witaj!</h1> <!-- PRAWIDŁOWO: w body -->\n</body>',
        },
      ],
      practicalTask: {
        title: 'Skrót wykrzyknika (!) w edytorze VS Code',
        brief: 'W profesjonalnym edytorze VS Code wystarczy wpisać jeden znak wykrzyknika "!" i nacisnąć Tab, aby cały szkielet HTML5 wygenerował się sam w ułamku sekundy!',
        steps: ['Zapamiętaj skrót: ! + klawisz Tab', 'Nigdy nie musisz uczyć się linijek <meta> na pamięć'],
        deliverable: 'Wiedza jak szybko tworzyć nowy plik HTML.',
      },
      completionCriteria: [
        'Rozróżnianie sekcji <head> od <body>',
        'Dodanie nagłówka <h1> wewnątrz <body>',
        'Zaliczenie krótkiego quizu',
      ],
    },
    {
      id: 'html-2',
      moduleId: 2,
      moduleTitle: 'Podstawy HTML — Tworzenie Pierwszych Stron od Zera',
      title: 'Semantyczny układ strony: nagłówek (header), menu (nav), treść (main) i stopka (footer)',
      slug: 'semantyka-html5-struktura',
      durationMinutes: 20,
      xpReward: 70,
      order: 6,
      summary: 'Zamiast nazywać każde pudełko <div>, poznaj czytelne znaczniki mówiące wprost czym są: <header> (góra strony), <nav> (menu), <main> (główna treść) oraz <footer> (stopka na dole).',
      objectives: [
        'Rozumieć, co oznacza słowo „semantyczny” (znacznik, którego nazwa mówi, do czego on służy)',
        'Stosować <header> na górze strony, <main> w środkowej części i <footer> na samym dole',
        'Umieszczać menu z linkami wewnątrz znacznika <nav>',
      ],
      prerequisites: ['Lekcja 5: Pełny szkielet pliku HTML5'],
      theoryMarkdown: `W czwartej lekcji poznaliśmy uniwersalne pudełko \`<div>\`. Moglibyśmy zbudować całą stronę wyłącznie z pudełek \`<div>\`, ale wtedy w kodzie wszystko wyglądałoby tak samo.

Dlatego w HTML5 wymyślono **znaczniki semantyczne** — czyli takie pudełka, których nazwa od razu mówi, jaką część strony reprezentują!

**4 główne piętra każdej nowoczesnej strony:**
1. **\`<header>\` (Górny pasek strony):** Sama góra strony — zazwyczaj wkładamy tu logo oraz menu.
2. **\`<nav>\` (Menu nawigacji):** Pudełko na główne linki menu (np. *Strona główna, O nas, Kontakt*).
3. **\`<main>\` (Główna treść strony):** Najważniejsza, środkowa część strony (występuje raz na podstronie). W jej środku możemy umieścić np. wpis blogowy **\`<article>\`** lub sekcję tematyczną **\`<section>\`**.
4. **\`<footer>\` (Stopka na samym dole):** Dolny pasek strony z podpisem autora i rokiem utworzenia.`,
      codeExamples: [
        {
          title: 'Przejrzysty podział strony na 4 czytelne części',
          language: 'html',
          code: `<header>
  <nav>
    <a href="#start">Start</a>
    <a href="#kontakt">Kontakt</a>
  </nav>
</header>

<main>
  <h1>Witaj na moim blogu</h1>
  <p>To jest główna część mojej strony internetowej.</p>
</main>

<footer>
  <p>Stworzone w 2026 roku</p>
</footer>`,
          explanation: 'Patrząc na ten kod od razu widzisz: na górze <header> z menu <nav>, w środku główna treść <main>, a na dole stopka <footer>.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Góra strony: <header> i <nav>', description: 'Umieść górny pasek i nawigację na samym początku.' },
        { step: 2, title: 'Środek strony: <main>', description: 'Włóż główny tytuł i treść podstrony do znacznika <main>.' },
        { step: 3, title: 'Dół strony: <footer>', description: 'Na samym końcu dodaj stopkę <footer> z podpisem.' },
      ],
      interactiveExercise: {
        id: 'ex-html-2',
        title: 'Dopisz stopkę <footer> na dole strony',
        instructions: 'W edytorze przygotowaliśmy już górny nagłówek <header> z nawigacją <nav> oraz środkową część <main>. Dopisz na samym dole brakującą stopkę <footer> z krótkim podpisem!',
        task: 'Na dole kodu dopisz stopkę <footer><p>Moja strona 2026</p></footer>.',
        starterCode: {
          html: '<header>\n  <nav>\n    <a href="#start">Strona główna</a>\n  </nav>\n</header>\n\n<main>\n  <h1>Mój pierwszy blog</h1>\n  <p>Tutaj publikuję moje postępy w nauce HTML.</p>\n</main>\n\n<!-- 👇 DOPISZ PONIŻEJ STOPKĘ <footer> -->\n<!-- Wzór: <footer><p>Moja strona 2026</p></footer> -->\n',
          css: 'body { font-family: system-ui, sans-serif; padding: 20px; line-height: 1.6; color: #1e293b; }\nheader { background: #eef2ff; padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; }\nmain { background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; }\nfooter { border-top: 2px solid #cbd5e1; padding-top: 10px; margin-top: 16px; color: #64748b; font-size: 0.9rem; }',
          js: 'console.log("Układ strony: header, main i footer gotowy!");',
        },
        solutionCode: {
          html: '<header>\n  <nav>\n    <a href="#start">Strona główna</a>\n  </nav>\n</header>\n\n<main>\n  <h1>Mój pierwszy blog</h1>\n  <p>Tutaj publikuję moje postępy w nauce HTML.</p>\n</main>\n\n<footer>\n  <p>Moja strona 2026</p>\n</footer>',
          css: 'body { font-family: system-ui, sans-serif; padding: 20px; line-height: 1.6; color: #1e293b; }\nheader { background: #eef2ff; padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; }\nmain { background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; }\nfooter { border-top: 2px solid #cbd5e1; padding-top: 10px; margin-top: 16px; color: #64748b; font-size: 0.9rem; }',
          js: 'console.log("Układ strony: header, main i footer gotowy!");',
        },
        hints: [
          'Sekcje <header>, <nav> oraz <main> są już gotowe w edytorze.',
          'Na samym dole dopisz: <footer><p>Moja strona 2026</p></footer>',
          'Kliknij „Sprawdź kod”, aby zaliczyć zadanie!',
        ],
        rules: [
          { id: 'r1', description: 'Górna część <header> z menu <nav> obecna', ruleType: 'html_tag_exists', target: 'header' },
          { id: 'r2', description: 'Główna treść strony <main> obecna', ruleType: 'html_tag_exists', target: 'main' },
          { id: 'r3', description: 'Dodano stopkę <footer> na dole strony', ruleType: 'html_tag_exists', target: 'footer' },
        ],
      },
      independentTask: {
        title: 'Dodaj drugi link w menu <nav>',
        instructions: 'Wewnątrz znacznika <nav> dopisz obok pierwszego linku drugi: <a href="#o-mnie">O mnie</a>.',
        expectedOutcome: 'Górne menu będzie zawierało dwa odnośniki.',
        starterHint: 'Wpisz nowy znacznik <a> tuż przed zamknięciem </nav>.',
      },
      quiz: [
        {
          id: 'q-h2-1',
          question: 'Do czego służy znacznik <main> na stronie internetowej?',
          options: [
            'Do oznaczenia dolnej stopki z prawami autorskimi',
            'Do opakowania głównej, najważniejszej treści danej podstrony (występuje raz na stronie)',
            'Do zmiany koloru tła na niebieski',
            'Do ukrywania tekstu przed użytkownikami',
          ],
          correctAnswer: 1,
          explanation: '<main> (od angielskiego "główny") otacza centralną treść podstrony — pomiędzy górnym <header> a dolnym <footer>.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Robienie przycisku ze zwykłego pudełka <div> zamiast <button>',
          whyItHappens: 'Przyzwyczajenie do używania <div> do wszystkiego.',
          howToFix: 'Jeśli coś ma służyć do klikania jako przycisk, użyj znacznika <button>Kliknij</button> — działa on wtedy również z klawiszem Enter na klawiaturze.',
          badCode: '<div class="przycisk">Zapisz</div>',
          goodCode: '<button type="button">Zapisz</button>',
        },
      ],
      practicalTask: {
        title: 'Rozpoznaj części ulubionej strony',
        brief: 'Pomyśl o dowolnym sklepie (np. Allegro): górny pasek z wyszukiwarką to <header>, lista produktów w środku to <main>, a linki na samym dole to <footer>.',
        steps: ['Spójrz na podgląd w edytorze', 'Zauważ wyraźny podział na górę, środek i dół'],
        deliverable: 'Intuicyjne rozumienie budowy nowoczesnych stron.',
      },
      completionCriteria: [
        'Poznanie znaczników header, nav, main oraz footer',
        'Dopisanie stopki <footer> w edytorze',
        'Zaliczenie quizu',
      ],
    },
    {
      id: 'html-3',
      moduleId: 2,
      moduleTitle: 'Podstawy HTML — Tworzenie Pierwszych Stron od Zera',
      title: 'Formularze od podstaw: pola tekstowe (input), etykiety (label) i przyciski',
      slug: 'nowoczesne-formularze-walidacja',
      durationMinutes: 20,
      xpReward: 80,
      order: 7,
      summary: 'Naucz się tworzyć formularz logowania lub kontaktu: pole do wpisywania tekstu <input>, podpis pola <label> oraz przycisk wysyłania <button>.',
      objectives: [
        'Tworzyć pole do wpisywania tekstu za pomocą <input type="text"> oraz e-maila <input type="email">',
        'Podpisywać pola formularza czytelną etykietą <label>',
        'Dodawać przycisk zatwierdzający formularz <button type="submit">',
      ],
      prerequisites: ['Lekcja 6: Semantyczny układ strony'],
      theoryMarkdown: `Kiedy logujesz się na pocztę, wpisujesz hasło lub zamawiasz paczkę, korzystasz z **formularza HTML (\`<form>\`)**. Zobaczmy, z jakich 3 prostych klocków składa się każdy formularz!

**1. Trzy klocki każdego formularza:**
1. **\`<form>\` (Ramka formularza):** Otacza wszystkie pola do wypełnienia i przycisk wysyłania.
2. **\`<label>\` (Podpis nad polem):** Zwykły tekst mówiący użytkownikowi, co ma wpisać w okienku obok (np. *„Podaj swój e-mail:”*).
3. **\`<input>\` (Okienko do wpisywania):** Pojedynczy znacznik tworzący pole tekstowe. Zmieniając atrybut \`type\`, wybieramy rodzaj pola:
   - \`<input type="text">\` — zwykłe pole na imię lub nazwisko,
   - \`<input type="email">\` — pole sprawdzające, czy wpisano znak \`@\` w adresie e-mail,
   - \`<input type="password">\` — pole na hasło (ukrywa wpisywane znaki pod kropkami \`••••\`).

**2. Przycisk wysyłania (\`<button type="submit">\`):**
Na końcu formularza dodajemy przycisk \`<button type="submit">Wyślij</button>\`. Jeśli do pola \`<input>\` dopiszemy słowo **\`required\`** (wymagane), przeglądarka sama przypilnuje, żeby nikt nie wysłał pustego pola!`,
      codeExamples: [
        {
          title: 'Prosty formularz zapisu na newsletter',
          language: 'html',
          code: `<form>
  <label for="imie">Twoje imię:</label>
  <input type="text" id="imie" placeholder="np. Ania" required />

  <label for="mail">Twój e-mail:</label>
  <input type="email" id="mail" placeholder="ania@domena.pl" required />

  <button type="submit">Zapisz się</button>
</form>`,
          explanation: 'Atrybut placeholder wyświetla jasną podpowiedź wewnątrz pustego okienka, a słowo required pilnuje, by pole zostało wypełnione.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Dodaj podpis <label>', description: 'Napisz <label>Twój e-mail:</label>, aby użytkownik wiedział co wpisać.' },
        { step: 2, title: 'Wstaw pole <input>', description: 'Użyj <input type="email" required />, aby przeglądarka sprawdziła adres.' },
        { step: 3, title: 'Dodaj przycisk <button>', description: 'Na dole umieść <button type="submit">Wyślij</button>.' },
      ],
      interactiveExercise: {
        id: 'ex-html-3',
        title: 'Dokończ prosty formularz: dodaj przycisk wysyłania',
        instructions: 'W edytorze przygotowaliśmy już formularz <form> z polem na imię oraz polem na e-mail (type="email" required). Dopisz na dole przed zamknięciem </form> przycisk <button type="submit">Wyślij</button>!',
        task: 'Na końcu formularza (przed </form>) dopisz przycisk <button type="submit">Wyślij</button>.',
        starterCode: {
          html: '<form>\n  <label for="imie">Twoje imię:</label>\n  <input type="text" id="imie" required placeholder="Wpisz imię..." />\n\n  <label for="mail">Twój e-mail:</label>\n  <input type="email" id="mail" required placeholder="jan@example.com" />\n\n  <!-- 👇 DOPISZ PONIŻEJ PRZYCISK WYSYŁANIA -->\n  <!-- Wzór: <button type="submit">Wyślij</button> -->\n  \n</form>',
          css: 'form { display: flex; flex-direction: column; gap: 10px; max-width: 320px; padding: 20px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; font-family: sans-serif; }\nlabel { font-size: 0.9rem; font-weight: bold; color: #334155; }\ninput, button { padding: 9px 12px; border-radius: 8px; border: 1px solid #94a3b8; font-size: 0.95rem; }\nbutton { background: #4f46e5; color: white; border: none; font-weight: bold; cursor: pointer; margin-top: 6px; }',
          js: 'console.log("Formularz kontaktowy gotowy!");',
        },
        solutionCode: {
          html: '<form>\n  <label for="imie">Twoje imię:</label>\n  <input type="text" id="imie" required placeholder="Wpisz imię..." />\n\n  <label for="mail">Twój e-mail:</label>\n  <input type="email" id="mail" required placeholder="jan@example.com" />\n\n  <button type="submit">Wyślij</button>\n</form>',
          css: 'form { display: flex; flex-direction: column; gap: 10px; max-width: 320px; padding: 20px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; font-family: sans-serif; }\nlabel { font-size: 0.9rem; font-weight: bold; color: #334155; }\ninput, button { padding: 9px 12px; border-radius: 8px; border: 1px solid #94a3b8; font-size: 0.95rem; }\nbutton { background: #4f46e5; color: white; border: none; font-weight: bold; cursor: pointer; margin-top: 6px; }',
          js: 'console.log("Formularz kontaktowy gotowy!");',
        },
        hints: [
          'Pola <input> i etykiety <label> są już gotowe w formularzu.',
          'Tuż przed zamknięciem </form> dopisz: <button type="submit">Wyślij</button>',
          'Kliknij „Sprawdź kod”, aby zaliczyć ćwiczenie!',
        ],
        rules: [
          { id: 'r1', description: 'Formularz zawiera pole e-mail (type="email")', ruleType: 'html_attr_exists', target: 'type', param: 'email' },
          { id: 'r2', description: 'Pola formularza mają atrybut required', ruleType: 'html_contains', target: 'required' },
          { id: 'r3', description: 'Dodano przycisk <button type="submit">', ruleType: 'html_tag_exists', target: 'button' },
        ],
      },
      independentTask: {
        title: 'Dodaj pole na hasło',
        instructions: 'Spróbuj dodać nad przyciskiem jeszcze jedno pole: <input type="password" placeholder="Hasło" /> i wpisz coś w okienku podglądu.',
        expectedOutcome: 'Wpisywane znaki w polu hasła będą automatycznie zamieniane na kropki.',
        starterHint: 'Użyj atrybutu type="password".',
      },
      quiz: [
        {
          id: 'q-h3-1',
          question: 'Co daje dopisanie słówka "required" wewnątrz pola <input type="email" required>?',
          options: [
            'Zmienia kolor czcionki na zielony',
            'Sprawia, że pole staje się obowiązkowe — przeglądarka nie pozwoli wysłać pustego formularza',
            'Usuwa przycisk z formularza',
            'Powiększa okienko dwukrotnie',
          ],
          correctAnswer: 1,
          explanation: 'Atrybut required (wymagane) automatycznie sprawdza, czy użytkownik wypełnił pole przed wysłaniem formularza.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Brak podpisu <label> nad polem <input>',
          whyItHappens: 'Poleganie wyłącznie na szarym tekście podpowiedzi (placeholder) wewnątrz pola.',
          howToFix: 'Gdy użytkownik zacznie pisać, placeholder znika! Dlatego zawsze dawaj czytelny podpis <label> nad polem.',
          badCode: '<input type="text" placeholder="Numer telefonu" />',
          goodCode: '<label for="tel">Numer telefonu:</label>\n<input type="text" id="tel" />',
        },
      ],
      practicalTask: {
        title: 'Przetestuj sprawdzanie e-maila na żywo',
        brief: 'W okienku podglądu po prawej stronie kliknij przycisk "Wyślij" bez wpisywania tekstu — zobaczysz komunikat przeglądarki!',
        steps: ['Dodaj przycisk <button type="submit">Wyślij</button>', 'Kliknij przycisk w podglądzie na żywo', 'Zobacz jak przeglądarka pilnuje pola required'],
        deliverable: 'Działający formularz z automatycznym sprawdzaniem pól.',
      },
      completionCriteria: [
        'Zrozumienie ról znaczników form, label, input oraz button',
        'Dodanie przycisku wysyłania w edytorze',
        'Zaliczenie quizu',
      ],
    },
    {
      id: 'html-6',
      moduleId: 2,
      moduleTitle: 'Podstawy HTML — Tworzenie Pierwszych Stron od Zera',
      title: 'Multimedia na stronie: odtwarzacz wideo (video), dźwięk (audio) i ikony SVG',
      slug: 'media-audio-video-svg',
      durationMinutes: 15,
      xpReward: 70,
      order: 8,
      summary: 'Zobacz, jak za pomocą jednego znacznika <video> lub <audio> wstawić na stronę gotowy odtwarzacz filmów i muzyki z przyciskami Play i Głośność.',
      objectives: [
        'Wstawiać odtwarzacz filmów za pomocą <video controls>',
        'Wstawiać odtwarzacz dźwięku/podcastu za pomocą <audio controls>',
        'Wiedzieć do czego służy atrybut controls (pasek przycisków Play/Pauza) oraz poster (miniaturka filmu)',
      ],
      prerequisites: ['Lekcja 7: Formularze od podstaw'],
      theoryMarkdown: `Kiedyś do odtworzenia filmu lub piosenki na stronie trzeba było instalować dodatkowe wtyczki. Dzisiaj przeglądarki mają wbudowany odtwarzacz — wystarczy użyć znacznika **\`<video>\`** lub **\`<audio>\`**!

**1. Odtwarzacz filmów (\`<video controls>\`):**
Aby na ekranie pojawił się odtwarzacz z przyciskiem **Play**, paskiem postępu i regulacją głośności, dopisujemy do niego słowo **\`controls\`** (kontrolki sterowania):

\`\`\`html
<video src="film.mp4" poster="miniaturka.jpg" controls width="400">
  Twoja przeglądarka nie obsługuje wideo.
</video>
\`\`\`

**Co oznaczają te dopiski?**
- **\`controls\`**: Wyświetla przyciski Play, Pauza, Głośność i Pełny ekran. Bez tego słówka film wyglądałby jak zwykły nieruchomy obrazek!
- **\`poster="miniaturka.jpg"\`**: Obrazek okładki wyświetlany zanim użytkownik kliknie Play (tak jak miniaturka na YouTube).

**2. Odtwarzacz muzyki lub podcastu (\`<audio controls>\`):**
Działa dokładnie tak samo jak wideo, ale wyświetla zgrabny pasek do słuchania dźwięku (np. pliku \`.mp3\`):
\`\`\`html
<audio src="podcast.mp3" controls></audio>
\`\`\``,
      codeExamples: [
        {
          title: 'Odtwarzacz wideo z miniaturką oraz odtwarzacz podcastu',
          language: 'html',
          code: `<h3>Lekcja wideo:</h3>
<video src="prezentacja.mp4" poster="https://picsum.photos/360/180" controls width="360">
  Twoja przeglądarka nie obsługuje wideo.
</video>

<h3>Wersja audio (Podcast):</h3>
<audio src="odcinek1.mp3" controls></audio>`,
          explanation: 'Dopisek controls włącza widoczny panel sterowania zarówno dla <video>, jak i dla <audio>.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Użyj znacznika <video>', description: 'Wpisz <video controls> aby włączyć przyciski odtwarzacza.' },
        { step: 2, title: 'Dodaj miniaturkę poster="..."', description: 'Atrybut poster wyświetla ładną okładkę przed startem filmu.' },
        { step: 3, title: 'Zamknij znacznik </video>', description: 'Pamiętaj o zamknięciu </video> na końcu.' },
      ],
      interactiveExercise: {
        id: 'ex-html-6',
        title: 'Włącz przyciski sterowania w odtwarzaczu <video>',
        instructions: 'W edytorze przygotowaliśmy kartę z odtwarzaczem podcastu <audio controls>. Pod spodem dopisz odtwarzacz <video controls poster="thumb.jpg" src="demo.mp4"></video>!',
        task: 'Dopisz na dole znacznik <video controls poster="thumb.jpg" src="demo.mp4"></video>.',
        starterCode: {
          html: '<h3>Posłuchaj podcastu:</h3>\n<audio src="podcast.mp3" controls></audio>\n\n<h3>Obejrzyj wideo:</h3>\n<!-- 👇 DOPISZ PONIŻEJ ODTWARZACZ <video> Z ATRYBUTEM controls -->\n<!-- Wzór: <video controls poster="thumb.jpg" src="demo.mp4"></video> -->\n',
          css: 'body { font-family: sans-serif; padding: 20px; color: #1e293b; }\nh3 { margin-bottom: 8px; }\nvideo { max-width: 100%; width: 320px; border-radius: 12px; background: #0f172a; display: block; }',
          js: 'console.log("Odtwarzacze audio i video gotowe!");',
        },
        solutionCode: {
          html: '<h3>Posłuchaj podcastu:</h3>\n<audio src="podcast.mp3" controls></audio>\n\n<h3>Obejrzyj wideo:</h3>\n<video controls poster="thumb.jpg" src="demo.mp4"></video>',
          css: 'body { font-family: sans-serif; padding: 20px; color: #1e293b; }\nh3 { margin-bottom: 8px; }\nvideo { max-width: 100%; width: 320px; border-radius: 12px; background: #0f172a; display: block; }',
          js: 'console.log("Odtwarzacze audio i video gotowe!");',
        },
        hints: [
          'Na samym dole edytora wpisz: <video controls poster="thumb.jpg" src="demo.mp4"></video>',
          'Upewnij się, że w znaczniku <video> znajduje się słowo controls.',
          'Kliknij „Sprawdź kod”, aby zaliczyć ćwiczenie!',
        ],
        rules: [
          { id: 'r1', description: 'Dodano znacznik odtwarzacza <video>', ruleType: 'html_tag_exists', target: 'video' },
          { id: 'r2', description: 'Włączono przyciski sterowania (atrybut controls)', ruleType: 'html_contains', target: 'controls' },
        ],
      },
      independentTask: {
        title: 'Ustaw szerokość odtwarzacza wideo',
        instructions: 'Dopisz wewnątrz znacznika <video> atrybut width="300", aby określić jego szerokość.',
        expectedOutcome: 'Odtwarzacz dopasuje swoją szerokość do 300 pikseli.',
        starterHint: '<video controls width="300" src="demo.mp4"></video>',
      },
      quiz: [
        {
          id: 'q-h6-1',
          question: 'Co stanie się, jeśli wstawisz znacznik <video src="film.mp4"></video>, ale zapomnisz dopisać słówka "controls"?',
          options: [
            'Użytkownik nie zobaczy przycisków Play, Pauza ani regulacji głośności, więc nie będzie mógł wygodnie włączyć filmu',
            'Film zmieni się w plik tekstowy',
            'Strona w ogóle się nie otworzy',
            'Film odtworzy się od tyłu',
          ],
          correctAnswer: 0,
          explanation: 'Atrybut controls odpowiada za wyświetlenie paska sterowania (Play/Pauza, czas, głośność, pełny ekran).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Automatyczne włączanie wideo z głośnym dźwiękiem po wejściu na stronę (autoplay)',
          whyItHappens: 'Chęć natychmiastowego zwrócenia uwagi odwiedzającego.',
          howToFix: 'Nikt nie lubi, gdy strona nagle zaczyna grać muzykę! Pozwól użytkownikowi samemu kliknąć Play dzięki atrybutowi controls.',
          badCode: '<video src="reklama.mp4" autoplay></video>',
          goodCode: '<video src="reklama.mp4" controls></video>',
        },
      ],
      practicalTask: {
        title: 'Zobacz odtwarzacz w podglądzie',
        brief: 'Po dopisaniu <video controls> spójrz na prawe okienko podglądu — zobaczysz prawdziwy pasek odtwarzacza wbudowany w przeglądarkę!',
        steps: ['Dodaj <video controls></video>', 'Sprawdź przyciski Play i Głośność w podglądzie'],
        deliverable: 'Własny odtwarzacz multimediów na stronie.',
      },
      completionCriteria: [
        'Poznanie znaczników <video> oraz <audio>',
        'Dodanie odtwarzacza <video controls> w edytorze',
        'Zaliczenie quizu',
      ],
    },
    {
      id: 'html-5',
      moduleId: 2,
      moduleTitle: 'Podstawy HTML — Tworzenie Pierwszych Stron od Zera',
      title: 'Dostępność stron (WCAG) i widoczność w wyszukiwarce Google (Podstawy SEO)',
      slug: 'dostepnosc-a11y-wcag-seo',
      durationMinutes: 15,
      xpReward: 90,
      order: 9,
      summary: 'Ostatnia lekcja modułu HTML! Dowiedz się, jak w 2 linijkach sprawić, by Twoja strona była przyjazna dla wyszukiwarki Google (SEO) oraz dla osób niewidomych korzystających z czytników ekranu.',
      objectives: [
        'Dodać krótki opis strony dla wyszukiwarki Google (<meta name="description">)',
        'Podpisać przycisk z samą ikonką za pomocą aria-label="...", aby czytnik ekranu wiedział do czego on służy',
        'Podsumować wszystkie poznane fundamenty HTML5',
      ],
      prerequisites: ['Lekcja 8: Multimedia na stronie'],
      theoryMarkdown: `Gratulacje — dotarłeś do ostatniej lekcji modułu HTML! Na koniec poznamy dwie proste sztuczki, które odróżniają amatora od dobrego twórcy stron: **SEO** (widoczność w Google) oraz **Dostępność** (ułatwienia dla osób z niepełnosprawnościami).

**1. Jak pomóc wyszukiwarce Google znaleźć Twoją stronę (Podstawy SEO)?**
Kiedy szukasz czegoś w Google, pod niebieskim tytułem każdej strony widzisz 2 linijki krótkiego opisu zachęcającego do kliknięcia. Ten opis ustawiamy w sekcji \`<head>\` za pomocą znacznika **\`<meta name="description">\`**:

\`\`\`html
<head>
  <title>Piekarnia Rzemieślnicza Wrocław</title>
  <meta name="description" content="Świeży chleb na zakwasie pieczony codziennie rano." />
</head>
\`\`\`

**2. Jak pomóc osobom niewidomym? Dopisek \`aria-label\`:**
Osoby niewidome korzystają z programów (czytników ekranu), które czytają stronę na głos. Co się jednak stanie, jeśli na stronie jest przycisk z samym znakiem krzyżyka \`X\` (do zamykania okienka)? Czytnik nie wie, co oznacza sam znaczek!
Wystarczy wtedy dopisać **\`aria-label="Zamknij okienko"\`**:

\`\`\`html
<button type="button" aria-label="Zamknij powiadomienie">X</button>
\`\`\``,
      codeExamples: [
        {
          title: 'Przyjazny dla Google i czytników ekranu fragment strony',
          language: 'html',
          code: `<head>
  <title>Kurs HTML od Podstaw</title>
  <meta name="description" content="Naucz się tworzyć strony internetowe krok po kroku." />
</head>
<body>
  <div class="powiadomienie">
    <p>Twoje postępy zostały zapisane!</p>
    <button type="button" aria-label="Zamknij powiadomienie">X</button>
  </div>
</body>`,
          explanation: 'Google wyświetli tekst z meta description w wynikach wyszukiwania, a czytnik ekranu przeczyta dla przycisku X wyraźny komunikat: "Zamknij powiadomienie".',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Dodaj tytuł <title> w <head>', description: 'To główny niebieski nagłówek w wynikach wyszukiwania Google.' },
        { step: 2, title: 'Dodaj opis <meta name="description">', description: 'Napisz 1 zdanie podsumowujące o czym jest Twoja strona.' },
        { step: 3, title: 'Dodaj aria-label do przycisków z ikonką', description: 'Jeśli przycisk nie ma zwykłego tekstu (tylko ikonę lub X), opisz go w aria-label="...".' },
      ],
      interactiveExercise: {
        id: 'ex-html-5',
        title: 'Dodaj podpis aria-label do przycisku zamykania',
        instructions: 'W edytorze mamy już gotową stronę z opisem dla Google (<meta name="description">). Na dole znajduje się zielony pasek powiadomienia. Dopisz wewnątrz niego przycisk zamykania: <button type="button" aria-label="Zamknij">X</button>!',
        task: 'Wewnątrz <div class="alert"> dopisz przycisk <button type="button" aria-label="Zamknij">X</button>.',
        starterCode: {
          html: '<!DOCTYPE html>\n<html lang="pl">\n<head>\n  <title>Moja Dostępna Strona</title>\n  <meta name="description" content="Moja pierwsza strona w HTML5" />\n</head>\n<body>\n  <div class="alert">\n    <p>Gratulacje! Kończysz właśnie moduł HTML!</p>\n    <!-- 👇 DOPISZ PONIŻEJ PRZYCISK Z ATRYBUTEM aria-label -->\n    <!-- Wzór: <button type="button" aria-label="Zamknij">X</button> -->\n    \n  </div>\n</body>\n</html>',
          css: 'body { font-family: sans-serif; padding: 20px; }\n.alert { display: flex; align-items: center; justify-content: space-between; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 12px 16px; border-radius: 10px; color: #065f46; }\nbutton { background: #10b981; color: white; border: none; border-radius: 6px; padding: 4px 10px; font-weight: bold; cursor: pointer; }',
          js: 'console.log("Moduł HTML ukończony wzorowo!");',
        },
        solutionCode: {
          html: '<!DOCTYPE html>\n<html lang="pl">\n<head>\n  <title>Moja Dostępna Strona</title>\n  <meta name="description" content="Moja pierwsza strona w HTML5" />\n</head>\n<body>\n  <div class="alert">\n    <p>Gratulacje! Kończysz właśnie moduł HTML!</p>\n    <button type="button" aria-label="Zamknij">X</button>\n  </div>\n</body>\n</html>',
          css: 'body { font-family: sans-serif; padding: 20px; }\n.alert { display: flex; align-items: center; justify-content: space-between; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 12px 16px; border-radius: 10px; color: #065f46; }\nbutton { background: #10b981; color: white; border: none; border-radius: 6px; padding: 4px 10px; font-weight: bold; cursor: pointer; }',
          js: 'console.log("Moduł HTML ukończony wzorowo!");',
        },
        hints: [
          'Wewnątrz <div class="alert"> (pod akapitem <p>) wpisz: <button type="button" aria-label="Zamknij">X</button>',
          'Dzięki aria-label="Zamknij" czytnik ekranu dokładnie wie, co robi przycisk X!',
          'Kliknij „Sprawdź kod”, aby ukończyć cały moduł HTML!',
        ],
        rules: [
          { id: 'r1', description: 'W sekcji <head> znajduje się opis <meta name="description">', ruleType: 'html_contains', target: 'description' },
          { id: 'r2', description: 'Dodano przycisk <button>', ruleType: 'html_tag_exists', target: 'button' },
          { id: 'r3', description: 'Przycisk posiada opis aria-label="..."', ruleType: 'html_attr_exists', target: 'aria-label' },
        ],
      },
      independentTask: {
        title: 'Zmień treść opisu dla Google',
        instructions: 'W linijce <meta name="description" content="..." /> wpisz własne zdanie opisujące Twoją stronę.',
        expectedOutcome: 'Własny opis SEO w nagłówku dokumentu.',
        starterHint: 'Edytuj tekst wewnątrz cudzysłowu po słowie content=.',
      },
      quiz: [
        {
          id: 'q-h5-1',
          question: 'Dlaczego do przycisku zawierającego wyłącznie ikonkę lub znak "X" warto dopisać atrybut aria-label="Zamknij"?',
          options: [
            'Aby program czytający ekran osobie niewidomej przeczytał słowo "Zamknij" zamiast niezrozumiałego znaku',
            'Aby przycisk stał się niewidzialny na monitorze',
            'Aby zablokować możliwość kliknięcia myszką',
            'Aby usunąć stronę z wyszukiwarki Google',
          ],
          correctAnswer: 0,
          explanation: 'aria-label nadaje przyciskowi czytelną nazwę głosową dla czytników ekranu, nie zmieniając jego wyglądu na ekranie.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Zostawianie przycisków z samą ikonką (np. lupką lub koszem) bez aria-label',
          whyItHappens: 'Osoba widząca widzi obrazek kosza na śmieci, ale program czytający widzi pusty przycisk.',
          howToFix: 'Gdy w przycisku nie ma zwykłego tekstu, zawsze dodaj aria-label="Usuń" lub aria-label="Szukaj".',
          badCode: '<button>🔍</button>',
          goodCode: '<button type="button" aria-label="Szukaj">🔍</button>',
        },
      ],
      practicalTask: {
        title: 'Sprawdź nawigację klawiszem Tab',
        brief: 'Kliknij w okienko podglądu i naciśnij klawisz Tab na klawiaturze — zobaczysz jak kursor podświetla Twój przycisk!',
        steps: ['Dodaj przycisk w edytorze', 'Kliknij w podgląd i naciśnij Tab'],
        deliverable: 'Ukończenie całego modułu Podstaw HTML!',
      },
      completionCriteria: [
        'Zrozumienie do czego służy meta description oraz aria-label',
        'Dodanie przycisku z aria-label w edytorze',
        'Zaliczenie finałowego quizu modułu HTML',
      ],
    },
  ],
};
