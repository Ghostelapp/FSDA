import { Lesson } from '../../types';

export const MISSING_CURRICULUM_LESSONS: Record<number, Lesson[]> = {
  // Module 2 (HTML5): 5 additional lessons covering full HTML5 curriculum (14 HTML lessons total)
  2: [
    {
      id: 'html-10',
      moduleId: 2,
      moduleTitle: 'Podstawy HTML — Tworzenie Pierwszych Stron od Zera',
      title: 'Formatowanie tekstu, cytaty i kod: Kursywa (<em>), zakreślacz (<mark>), cytaty (<blockquote>) i podziały (<br>, <hr>)',
      slug: 'formatowanie-tekstu-cytaty-kod-html',
      durationMinutes: 20,
      xpReward: 65,
      order: 2,
      summary: 'Poznaj znaczniki, dzięki którym Twój tekst na stronie nabierze charakteru: pochylenie tekstu (<em>), żółty zakreślacz (<mark>), blok cytatu (<blockquote>), wyświetlanie kodu (<code>, <pre>) oraz linie podziału (<hr>, <br>).',
      objectives: [
        'Stosować semantyczną kursywę <em> oraz wyróżnienie tekstu <mark> i <small>',
        'Tworzyć czytelne cytaty blokowe <blockquote> oraz fragmenty kodu <code> i <pre>',
        'Rozróżniać złamanie pojedynczej linii <br> od poziomej linii oddzielającej tematy <hr>',
      ],
      prerequisites: ['Lekcja 1: Pierwsze znaczniki HTML'],
      theoryMarkdown: `W pierwszej lekcji poznaliśmy nagłówki \`<h1>\`–\`<h6>\`, akapit \`<p>\` oraz pogrubienie \`<strong>\`. Prawdziwe artykuły, blogi i dokumentacje techniczne potrzebują jednak bogatszego formatowania tekstu!

**1. Kursywa (\`<em>\`), zakreślacz (\`<mark>\`) i dopisek (\`<small>\`):**
- **\`<em>\` (Emphasis — nacisk / kursywa):** Pochyla tekst i sygnalizuje czytnikom ekranu, że dane słowo wymawiamy z emocjonalnym naciskiem (np. \`To jest <em>naprawdę</em> proste!\`).
- **\`<mark>\` (Zakreślacz):** Podświetla fragment zdania (domyślnie na żółto), dokładnie tak jak zakreślaczem w notatkach lub wynik wyszukiwania na stronie.
- **\`<small>\` (Drobny druk):** Pomniejsza tekst — idealny na dopiski prawne, datę aktualizacji lub prawa autorskie w stopce.

**2. Cytaty (\`<blockquote>\`) oraz wyświetlanie kodu (\`<code>\` i \`<pre>\`):**
- **\`<blockquote>\`**: Służy do wyróżnienia dłuższego cytatu lub opinii (zazwyczaj z bocznym paskiem i wcięciem).
- **\`<code>\`**: Oznacza krótkie polecenie lub fragment kodu wewnątrz zdania (np. \`Użyj znacznika <code>&lt;h1&gt;</code>\`), wyświetlając je czcionką maszynową (*monospace*).
- **\`<pre>\` (Preformatted text):** Zachowuje wszystkie spacje i przejścia do nowej linii dokładnie tak, jak zostały wpisane w edytorze — zawsze łączymy go z \`<code>\` przy dłuższych blokach kodu!

**3. Nowa linia (\`<br>\`) i pozioma kreska (\`<hr>\`):**
- **\`<br>\` (Line Break):** Przenosi tekst do następnej linijki wewnątrz tego samego akapitu (np. przy zapisywaniu adresu pocztowego lub wiersza).
- **\`<hr>\` (Horizontal Rule):** Rysuje poziomą linię oddzielającą dwie części tematu. Oba te znaczniki są pojedyncze — nie zamykamy ich ukośnikiem!`,
      codeExamples: [
        {
          title: 'Bogato sformatowany artykuł z cytatem, zakreślaczem i kodem',
          language: 'html',
          code: `<p>W języku HTML skrót <mark>SEO</mark> oznacza <em>optymalizację pod wyszukiwarki</em>.</p>

<blockquote>
  "Najlepszy kod to taki, który łatwo przeczytać drugiemu człowiekowi."
</blockquote>

<hr />

<p>Aby pogrubić tekst, użyj znacznika <code>&lt;strong&gt;</code>.</p>`,
          explanation: 'Znacznik <mark> podświetla słowo SEO, <em> pochyla tekst kursywą, <blockquote> wyróżnia cytat, a <hr /> rysuje poziomą linię podziału.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Wyróżnij słowo w zdaniu', description: 'Użyj <em> dla kursywy lub <mark> dla efektu żółtego zakreślacza.' },
        { step: 2, title: 'Dodaj cytat <blockquote>', description: 'Otocz ważną myśl znacznikiem <blockquote>...</blockquote>.' },
        { step: 3, title: 'Oddziel sekcję linią <hr />', description: 'Wstaw pojedynczy znacznik <hr /> między częściami tekstu.' },
      ],
      interactiveExercise: {
        id: 'ex-html-10',
        title: 'Dodaj wyróżnienie <mark> oraz cytat <blockquote>',
        instructions: 'W edytorze mamy początek notatki z nauki. Dopisz poniżej cytat w znaczniku <blockquote> oraz akapit zawierający podświetlone słowo w znaczniku <mark>!',
        task: 'Dodaj w kodzie znacznik <blockquote> oraz wyróżnienie <mark>.',
        starterCode: {
          html: '<h2>Moje notatki z HTML5</h2>\n<p>Dzisiaj poznaję <em>zaawansowane formatowanie</em> tekstu.</p>\n\n<!-- 👇 DOPISZ PONIŻEJ CYTAT <blockquote> ORAZ WYRÓŻNIENIE <mark> -->\n<!-- Wzór:\n<blockquote>Nauka przez praktykę daje najlepsze efekty!</blockquote>\n<p>Ważny skrót: <mark>HTML5</mark></p>\n-->\n',
          css: 'body { font-family: system-ui, sans-serif; padding: 20px; line-height: 1.6; color: #1e293b; }\nblockquote { margin: 12px 0; padding: 12px 16px; border-left: 4px solid #4f46e5; background: #eef2ff; border-radius: 0 8px 8px 0; font-style: italic; }\nmark { background: #fef08a; padding: 2px 6px; border-radius: 4px; font-weight: bold; }',
          js: 'console.log("Formatowanie tekstu i cytaty gotowe!");',
        },
        solutionCode: {
          html: '<h2>Moje notatki z HTML5</h2>\n<p>Dzisiaj poznaję <em>zaawansowane formatowanie</em> tekstu.</p>\n\n<blockquote>Nauka przez praktykę daje najlepsze efekty!</blockquote>\n<p>Ważny skrót: <mark>HTML5</mark></p>',
          css: 'body { font-family: system-ui, sans-serif; padding: 20px; line-height: 1.6; color: #1e293b; }\nblockquote { margin: 12px 0; padding: 12px 16px; border-left: 4px solid #4f46e5; background: #eef2ff; border-radius: 0 8px 8px 0; font-style: italic; }\nmark { background: #fef08a; padding: 2px 6px; border-radius: 4px; font-weight: bold; }',
          js: 'console.log("Formatowanie tekstu i cytaty gotowe!");',
        },
        hints: [
          'Wklej lub wpisz na dole: <blockquote>Nauka przez praktykę daje najlepsze efekty!</blockquote>',
          'Pod spodem dopisz: <p>Ważny skrót: <mark>HTML5</mark></p>',
          'Kliknij „Sprawdź kod”, aby zaliczyć ćwiczenie!',
        ],
        rules: [
          { id: 'r1', description: 'Użyto znacznika cytatu <blockquote>', ruleType: 'html_tag_exists', target: 'blockquote' },
          { id: 'r2', description: 'Użyto znacznika zakreślacza <mark>', ruleType: 'html_tag_exists', target: 'mark' },
        ],
      },
      independentTask: {
        title: 'Oddziel notatkę poziomą linią <hr />',
        instructions: 'Wstaw pomiędzy nagłówkiem <h2> a cytatem pojedynczy znacznik <hr /> oraz użyj <code> wewnątrz zdania.',
        expectedOutcome: 'Widoczna pozioma linia oddzielająca sekcje notatki.',
        starterHint: 'Znacznik <hr /> nie wymaga znacznika zamykającego.',
      },
      quiz: [
        {
          id: 'q-h10-1',
          question: 'Którego znacznika HTML5 używamy, aby podświetlić ważne słowo w tekście niczym żółtym zakreślaczem?',
          options: [
            'Znacznika <mark>',
            'Znacznika <hr>',
            'Znacznika <br>',
            'Znacznika <table>',
          ],
          correctAnswer: 0,
          explanation: 'Znacznik <mark> służy do wizualnego wyróżnienia (podświetlenia) kluczowego fragmentu tekstu.',
        },
        {
          id: 'q-h10-2',
          question: 'Do czego służy para znaczników <pre><code>...</code></pre>?',
          options: [
            'Do wyświetlania wieloliniowego bloku kodu z zachowaniem wcięć i spacji',
            'Do odtwarzania muzyki w tle',
            'Do wysyłania formularza na serwer',
            'Do ukrywania tekstu przed przeglądarką',
          ],
          correctAnswer: 0,
          explanation: '<pre> zachowuje oryginalne wcięcia i nowe linie, a <code> informuje przeglądarkę, że w środku znajduje się kod komputerowy.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Wielokrotne wstawianie <br><br><br> w celu zrobienia dużego odstępu między sekcjami',
          whyItHappens: 'Próba sterowania odstępami jak klawiszem Enter w edytorze Word.',
          howToFix: 'Używaj osobnych akapitów <p>, a wielkość odstępów między nimi ustawiaj później w CSS za pomocą margin lub padding.',
          badCode: '<p>Pierwsza myśl</p>\n<br><br><br>\n<p>Druga myśl</p>',
          goodCode: '<p>Pierwsza myśl</p>\n<p>Druga myśl</p>',
        },
      ],
      practicalTask: {
        title: 'Dodaj adres pocztowy ze złamaniem linii <br />',
        brief: 'Napisz w jednym akapicie <p> nazwę ulicy i w nowej linijce za pomocą <br /> kod pocztowy oraz miasto.',
        steps: ['Wpisz <p>ul. Kwiatowa 12<br />00-001 Warszawa</p>', 'Sprawdź w podglądzie jak działa <br />'],
        deliverable: 'Poprawnie sformatowany adres kontaktowy.',
      },
      completionCriteria: ['Zastosowanie <blockquote> oraz <mark>', 'Zaliczenie quizu z wynikiem min. 80%'],
    },
    {
      id: 'html-11',
      moduleId: 2,
      moduleTitle: 'Podstawy HTML — Tworzenie Pierwszych Stron od Zera',
      title: 'Odnośniki w praktyce: Nowa karta (target="_blank"), kotwice (#sekcja), mailto:, tel: i ścieżki plików',
      slug: 'zaawansowane-linki-kotwice-sciezki-plikow',
      durationMinutes: 20,
      xpReward: 70,
      order: 4,
      summary: 'Opanuj wszystkie rodzaje linków używanych w profesjonalnych stronach: otwieranie w nowej karcie z zabezpieczeniem rel="noopener", przewijanie do sekcji (#kontakt), klikalny e-mail i telefon oraz ścieżki względne.',
      objectives: [
        'Otwierać zewnętrzne strony w nowej karcie za pomocą target="_blank" i rel="noopener noreferrer"',
        'Tworzyć kotwice przewijające stronę do wybranej sekcji (href="#cennik" -> id="cennik")',
        'Tworzyć klikalne linki otwierające program pocztowy (mailto:) oraz wybieranie numeru na telefonie (tel:)',
      ],
      prerequisites: ['Lekcja 3: Listy punktowane i numerowane oraz podstawy linków'],
      theoryMarkdown: `Znacznik \`<a href="...">\` potrafi znacznie więcej niż tylko przechodzić pod inny adres! Zobaczmy 4 zastosowania linków, których używa się w każdym komercyjnym projekcie.

**1. Otwieranie linku w nowej karcie (\`target="_blank"\`):**
Gdy link prowadzi do zewnętrznego serwisu (np. Twojego profilu na GitHubie lub LinkedInie), nie chcesz, aby użytkownik zamknął Twoją stronę. Dopisujesz wtedy **\`target="_blank"\`** oraz zabezpieczenie **\`rel="noopener noreferrer"\`**:

\`\`\`html
<a href="https://github.com" target="_blank" rel="noopener noreferrer">
  Mój profil GitHub (nowa karta)
</a>
\`\`\`

**2. Kotwice — płynne przewijanie do sekcji na tej samej stronie (\`#id\`):**
W menu na górze strony często widzisz linki typu *„Cennik”* lub *„Kontakt”*, które po kliknięciu przewijają ekran w dół. Jak to działa?
1. Sekcji na dole nadajesz unikalny identyfikator: \`<section id="kontakt">\`
2. W linku wpisujesz znak kratki \`#\`: \`<a href="#kontakt">Przejdź do kontaktu</a>\`

**3. Klikalny e-mail (\`mailto:\`) oraz numer telefonu (\`tel:\`):**
- **\`<a href="mailto:kontakt@domena.pl">\`**: Automatycznie otwiera program pocztowy z wpisanym adresem odbiorcy.
- **\`<a href="tel:+48123456789">\`**: Na smartfonie od razu uruchamia ekran dzwonienia!

**4. Ścieżki bezwzględne vs względne:**
- **Ścieżka bezwzględna:** Pełny adres w internecie zaczynający się od \`https://...\`
- **Ścieżka względna:** Prowadzi do innego pliku w Twoim własnym projekcie, np. \`href="/o-nas"\` lub \`href="./kontakt.html"\`.`,
      codeExamples: [
        {
          title: 'Zestaw nawigacji: kotwica, nowa karta oraz klikalny e-mail i telefon',
          language: 'html',
          code: `<nav>
  <a href="#o-mnie">O mnie (na tej stronie)</a>
  <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
  <a href="mailto:biuro@akademia.pl">Napisz e-mail</a>
  <a href="tel:+48500600700">Zadzwoń: 500 600 700</a>
</nav>`,
          explanation: 'Każdy z czterech linków pełni inną funkcję: przewija stronę do #o-mnie, otwiera nową kartę, uruchamia pocztę lub wybiera numer telefonu.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Link zewnętrzny', description: 'Dodaj target="_blank" rel="noopener noreferrer", aby otworzyć stronę w nowej karcie.' },
        { step: 2, title: 'Kotwica na stronie', description: 'Połącz <a href="#sekcja"> z elementem posiadającym id="sekcja".' },
        { step: 3, title: 'Kontakt jednym kliknięciem', description: 'Użyj przedrostka mailto: dla adresu e-mail oraz tel: dla numeru telefonu.' },
      ],
      interactiveExercise: {
        id: 'ex-html-11',
        title: 'Dodaj link otwierany w nowej karcie oraz link mailto:',
        instructions: 'W stopce wizytówki dopisz dwa linki: pierwszy otwierający profil GitHub w nowej karcie (z atrybutem target="_blank") oraz drugi otwierający pocztę e-mail (href="mailto:kontakt@kurs.pl").',
        task: 'Dodaj link z target="_blank" oraz link z href="mailto:...".',
        starterCode: {
          html: '<div class="contact-box">\n  <h3>Skontaktuj się ze mną:</h3>\n  <!-- 👇 DOPISZ PONIŻEJ LINK Z target="_blank" ORAZ LINK mailto: -->\n  <!-- Wzór:\n  <a href="https://github.com" target="_blank" rel="noopener noreferrer">Mój GitHub</a>\n  <a href="mailto:kontakt@kurs.pl">Napisz e-mail</a>\n  -->\n</div>',
          css: 'body { font-family: sans-serif; padding: 20px; }\n.contact-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 16px; border-radius: 12px; display: flex; flex-direction: column; gap: 8px; max-width: 300px; }\na { color: #4f46e5; font-weight: bold; text-decoration: none; }',
          js: 'console.log("Zaawansowane odnośniki gotowe!");',
        },
        solutionCode: {
          html: '<div class="contact-box">\n  <h3>Skontaktuj się ze mną:</h3>\n  <a href="https://github.com" target="_blank" rel="noopener noreferrer">Mój GitHub</a>\n  <a href="mailto:kontakt@kurs.pl">Napisz e-mail</a>\n</div>',
          css: 'body { font-family: sans-serif; padding: 20px; }\n.contact-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 16px; border-radius: 12px; display: flex; flex-direction: column; gap: 8px; max-width: 300px; }\na { color: #4f46e5; font-weight: bold; text-decoration: none; }',
          js: 'console.log("Zaawansowane odnośniki gotowe!");',
        },
        hints: [
          'Dopisz pierwszy link: <a href="https://github.com" target="_blank" rel="noopener noreferrer">Mój GitHub</a>',
          'Dopisz drugi link: <a href="mailto:kontakt@kurs.pl">Napisz e-mail</a>',
          'Kliknij „Sprawdź kod”!',
        ],
        rules: [
          { id: 'r1', description: 'Użyto atrybutu target="_blank" do otwarcia nowej karty', ruleType: 'html_attr_exists', target: 'target', param: '_blank' },
          { id: 'r2', description: 'Dodano link pocztowy z przedrostkiem mailto:', ruleType: 'html_contains', target: 'mailto:' },
        ],
      },
      independentTask: {
        title: 'Dodaj klikalny numer telefonu (tel:)',
        instructions: 'Dopisz trzeci link w boksie kontaktowym: <a href="tel:+48123456789">Zadzwoń do mnie</a>.',
        expectedOutcome: 'Link telefoniczny gotowy do użycia na urządzeniach mobilnych.',
        starterHint: 'Użyj href="tel:+48123456789".',
      },
      quiz: [
        {
          id: 'q-h11-1',
          question: 'Jaki atrybut należy dodać do znacznika <a>, aby po kliknięciu strona otworzyła się w nowej karcie przeglądarki?',
          options: [
            'target="_blank" (wraz z rel="noopener noreferrer")',
            'newtab="true"',
            'open="window"',
            'href="new"',
          ],
          correctAnswer: 0,
          explanation: 'Standardowy atrybut HTML otwierający link w nowej karcie to target="_blank", a rel="noopener noreferrer" chroni bezpieczeństwo karty źródłowej.',
        },
        {
          id: 'q-h11-2',
          question: 'Jak zapisać atrybut href w linku, który ma przewinąć ekran do sekcji <section id="cennik"> znajdującej się niżej na tej samej stronie?',
          options: [
            'href="#cennik"',
            'href="mailto:cennik"',
            'href="https://cennik"',
            'href="@cennik"',
          ],
          correctAnswer: 0,
          explanation: 'Znak kratki (#) w href="#cennik" tworzy tzw. kotwicę wskazującą element z id="cennik".',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Używanie target="_blank" dla wewnętrznych podstron własnego serwisu',
          whyItHappens: 'Dodawanie target="_blank" odruchowo do każdego linku.',
          howToFix: 'Linki wewnątrz Twojej własnej strony (np. menu główne) powinny otwierać się w tej samej karcie; target="_blank" stosuj tylko dla stron zewnętrznych.',
          badCode: '<a href="/kontakt" target="_blank">Kontakt</a>',
          goodCode: '<a href="/kontakt">Kontakt</a>',
        },
      ],
      practicalTask: {
        title: 'Stwórz kotwicę przewijającą do stopki',
        brief: 'Dodaj na górze link <a href="#stopka">Skocz na dół</a>, a na dole element <footer id="stopka">Stopka</footer>.',
        steps: ['Dodaj id="stopka" do elementu na dole', 'Dodaj href="#stopka" w linku na górze'],
        deliverable: 'Działająca nawigacja wewnątrz strony.',
      },
      completionCriteria: ['Zastosowanie target="_blank" oraz mailto:', 'Zaliczenie quizu'],
    },
    {
      id: 'html-12',
      moduleId: 2,
      moduleTitle: 'Podstawy HTML — Tworzenie Pierwszych Stron od Zera',
      title: 'Tabele danych od A do Z (<table>): Nagłówki (<thead>, <th>), ciało (<tbody>), podsumowanie (<tfoot>) i colspan',
      slug: 'tabele-danych-thead-tbody-tfoot-colspan',
      durationMinutes: 25,
      xpReward: 75,
      order: 6,
      summary: 'Naucz się budować czytelne tabele cenników, faktur i statystyk: semantyczny podział na <thead>, <tbody> i <tfoot>, wiersze <tr>, komórki nagłówkowe <th> oraz łączenie kolumn za pomocą colspan.',
      objectives: [
        'Budować strukturę tabeli z wierszy <tr>, nagłówków <th> oraz komórek danych <td>',
        'Dzielić tabelę na czytelną część nagłówkową <thead>, dane <tbody> oraz stopkę podsumowania <tfoot>',
        'Łączyć sąsiednie komórki w poziomie za pomocą atrybutu colspan="2"',
      ],
      prerequisites: ['Lekcja 5: Obrazki na stronie i leniwe ładowanie'],
      theoryMarkdown: `Kiedy chcesz zaprezentować na stronie cennik pakietów, harmonogram zajęć, tabelę wyników lub podsumowanie koszyka zakupowego, najlepszym narzędziem jest semantyczna tabela **\`<table>\`**.

**1. Podstawowe klocki tabeli (\`<tr>\`, \`<th>\`, \`<td>\`):**
Tabela jest układana **wiersz po wierszu** (od góry do dołu):
- **\`<tr>\` (Table Row — wiersz):** Tworzy nowy poziomy rząd tabeli.
- **\`<th>\` (Table Header — komórka tytułowa):** Pogrubiona komórka z nazwą kolumny (np. *Produkt*, *Cena*).
- **\`<td>\` (Table Data — komórka z danymi):** Zwykła komórka zawierająca konkretną wartość (np. *Kurs HTML*, *0 zł*).

**2. Profesjonalny podział na 3 sekcje (\`<thead>\`, \`<tbody>\`, \`<tfoot>\`):**
Tak jak cała strona ma \`<header>\`, \`<main>\` i \`<footer>\`, tak dobrze zbudowana tabela dzieli się na:
1. **\`<thead>\` (Głowa tabeli):** Otacza pierwszy wiersz z tytułami kolumn \`<th>\`.
2. **\`<tbody>\` (Ciało tabeli):** Otacza wszystkie główne wiersze z danymi \`<td>\`.
3. **\`<tfoot>\` (Stopka tabeli):** Opcjonalny dolny wiersz z podsumowaniem (np. *Suma zamówienia: 299 zł*).

**3. Łączenie komórek (\`colspan\`):**
Jeśli w dolnym wierszu podsumowania chcesz, aby jedna komórka rozciągała się na szerokość dwóch kolumn, dopisujesz do niej **\`colspan="2"\`**!`,
      codeExamples: [
        {
          title: 'Tabela zamówienia z podziałem na <thead>, <tbody> oraz <tfoot>',
          language: 'html',
          code: `<table>
  <thead>
    <tr>
      <th>Usługa</th>
      <th>Czas</th>
      <th>Koszt</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Projekt strony HTML5</td>
      <td>5 dni</td>
      <td>1200 zł</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2"><strong>Razem do zapłaty:</strong></td>
      <td><strong>1200 zł</strong></td>
    </tr>
  </tfoot>
</table>`,
          explanation: 'Sekcja <thead> zawiera nazwy 3 kolumn, <tbody> wiersz z usługą, a w <tfoot> komórka z napisem "Razem do zapłaty:" ma colspan="2", dzięki czemu zajmuje szerokość dwóch pierwszych kolumn.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Utwórz nagłówek <thead>', description: 'Wewnątrz <thead><tr> umieść nazwy kolumn w znacznikach <th>.' },
        { step: 2, title: 'Wypełnij dane w <tbody>', description: 'Każdy kolejny wiersz danych <tr> z komórkami <td> umieść w <tbody>.' },
        { step: 3, title: 'Dodaj podsumowanie w <tfoot>', description: 'W razie potrzeby połącz kolumny za pomocą atrybutu colspan="2".' },
      ],
      interactiveExercise: {
        id: 'ex-html-12',
        title: 'Zbuduj tabelę z nagłówkiem <thead> i ciałem <tbody>',
        instructions: 'W edytorze mamy otwartą tabelę <table> z sekcją nagłówkową <thead>. Dopisz poniżej sekcję <tbody> zawierającą wiersz <tr> z dwiema komórkami <td> (np. <td>Moduł HTML5</td> i <td>Zaliczone</td>).',
        task: 'Dodaj sekcję <tbody> zawierającą wiersz <tr> i komórki <td>.',
        starterCode: {
          html: '<table>\n  <thead>\n    <tr>\n      <th>Moduł kursu</th>\n      <th>Status</th>\n    </tr>\n  </thead>\n  <!-- 👇 DOPISZ PONIŻEJ SEKCJĘ <tbody> Z WIERZEM <tr> I KOMÓRKAMI <td> -->\n  <!-- Wzór:\n  <tbody>\n    <tr>\n      <td>Moduł HTML5</td>\n      <td>Zaliczone</td>\n    </tr>\n  </tbody>\n  -->\n</table>',
          css: 'body { font-family: sans-serif; padding: 20px; }\ntable { width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; }\nth, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; }\nth { background: #eef2ff; color: #1e1b4b; }',
          js: 'console.log("Semantyczna tabela danych gotowa!");',
        },
        solutionCode: {
          html: '<table>\n  <thead>\n    <tr>\n      <th>Moduł kursu</th>\n      <th>Status</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Moduł HTML5</td>\n      <td>Zaliczone</td>\n    </tr>\n  </tbody>\n</table>',
          css: 'body { font-family: sans-serif; padding: 20px; }\ntable { width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; }\nth, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; }\nth { background: #eef2ff; color: #1e1b4b; }',
          js: 'console.log("Semantyczna tabela danych gotowa!");',
        },
        hints: [
          'Przed zamknięciem </table> dopisz sekcję <tbody>...</tbody>.',
          'Wewnątrz <tbody> umieść wiersz: <tr><td>Moduł HTML5</td><td>Zaliczone</td></tr>',
          'Kliknij „Sprawdź kod”!',
        ],
        rules: [
          { id: 'r1', description: 'Tabela posiada sekcję nagłówkową <thead> z komórkami <th>', ruleType: 'html_tag_exists', target: 'thead' },
          { id: 'r2', description: 'Dodano sekcję ciała tabeli <tbody>', ruleType: 'html_tag_exists', target: 'tbody' },
          { id: 'r3', description: 'Wiersz zawiera komórki danych <td>', ruleType: 'html_tag_exists', target: 'td' },
        ],
      },
      independentTask: {
        title: 'Dodaj wiersz podsumowania <tfoot> z colspan="2"',
        instructions: 'Pod zamknięciem </tbody> dopisz <tfoot><tr><td colspan="2">Łącznie: 14 lekcji HTML</td></tr></tfoot>.',
        expectedOutcome: 'Dolny wiersz podsumowania rozciągnięty na obie kolumny.',
        starterHint: 'Użyj atrybutu colspan="2" na znaczniku <td>.',
      },
      quiz: [
        {
          id: 'q-h12-1',
          question: 'Czym różni się komórka <th> od komórki <td> w tabeli HTML?',
          options: [
            '<th> to komórka nagłówkowa (tytuł kolumny, domyślnie pogrubiona), a <td> to zwykła komórka z danymi',
            '<th> tworzy nową tabelę, a <td> ją usuwa',
            '<td> może zawierać tylko liczby',
            'Nie ma między nimi żadnej różnicy',
          ],
          correctAnswer: 0,
          explanation: '<th> (table header) oznacza nagłówek kolumny lub wiersza, natomiast <td> (table data) przechowuje właściwe dane.',
        },
        {
          id: 'q-h12-2',
          question: 'Który atrybut pozwala połączyć dwie sąsiednie komórki w jednym wierszu w jedną szerszą komórkę?',
          options: [
            'colspan="2"',
            'width="2"',
            'merge="true"',
            'double="2"',
          ],
          correctAnswer: 0,
          explanation: 'Atrybut colspan="2" (od column span) rozciąga komórkę na szerokość dwóch kolumn.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Używanie tabel <table> do układania wyglądu całej strony (np. menu po lewej, artykuł po prawej)',
          whyItHappens: 'Nawyk ze starych kursów z lat 90., zanim powstał Flexbox i CSS Grid.',
          howToFix: 'Tabel <table> używaj wyłącznie do danych tabelarycznych (cenników, rozkładów, statystyk). Do układu strony służą znaczniki semantyczne oraz Flexbox / Grid w CSS.',
          badCode: '<table><tr><td>Menu</td><td>Artykuł</td></tr></table>',
          goodCode: '<div class="layout"><nav>Menu</nav><main>Artykuł</main></div>',
        },
      ],
      practicalTask: {
        title: 'Rozbuduj tabelę o 3 wiersze',
        brief: 'Dodaj w <tbody> wiersze dla modułów HTML, CSS oraz JavaScript.',
        steps: ['Skopiuj blok <tr>...</tr> wewnątrz <tbody>', 'Zmień nazwy modułów w komórkach <td>'],
        deliverable: 'Kompletna tabela planu nauki.',
      },
      completionCriteria: ['Zbudowanie tabeli z <thead> i <tbody>', 'Zaliczenie quizu'],
    },
    {
      id: 'html-13',
      moduleId: 2,
      moduleTitle: 'Podstawy HTML — Tworzenie Pierwszych Stron od Zera',
      title: 'Zaawansowane formularze HTML5: Listy rozwijane (<select>), <textarea>, checkbox, radio i walidacja',
      slug: 'zaawansowane-formularze-select-textarea-checkbox-radio',
      durationMinutes: 25,
      xpReward: 85,
      order: 11,
      summary: 'Rozbuduj swoje formularze o listę rozwijaną (<select> i <option>), duże pole na wiadomość (<textarea>), pola wyboru (checkbox oraz radio), grupowanie <fieldset> i wbudowaną walidację HTML5.',
      objectives: [
        'Tworzyć rozwijaną listę wyboru za pomocą <select> oraz opcji <option>',
        'Dodawać wieloliniowe pole tekstowe <textarea> na dłuższą wiadomość lub komentarz',
        'Rozróżniać pola wielokrotnego wyboru (type="checkbox") od wyboru jednej opcji (type="radio") oraz stosować walidację (minlength, pattern)',
      ],
      prerequisites: ['Lekcja 10: Formularze od podstaw (input, label, button)'],
      theoryMarkdown: `W poprzedniej lekcji stworzyliśmy prosty formularz z pojedynczym polem \`<input>\`. W prawdziwych aplikacjach (np. przy składaniu zamówienia w sklepie lub w formularzu kontaktowym) potrzebujemy jednak znacznie ciekawszych kontrolek!

**1. Wieloliniowe pole na dłuższą wiadomość (\`<textarea>\`):**
Zwykły \`<input type="text">\` mieści tylko jedną linijkę tekstu. Gdy użytkownik ma napisać opinię, komentarz lub wiadomość kontaktową, używamy znacznika **\`<textarea>\`** (z otwarciem i zamknięciem \`</textarea>\`):

\`\`\`html
<label for="wiadomosc">Twoja wiadomość:</label>
<textarea id="wiadomosc" rows="4" placeholder="Opisz swoje pytanie..." required></textarea>
\`\`\`

**2. Rozwijana lista wyboru (\`<select>\` oraz \`<option>\`):**
Gdy użytkownik ma wybrać np. kraj, miasto lub temat zgłoszenia z gotowej listy, używamy ramki **\`<select>\`**, a każdą pozycję na liście zapisujemy w **\`<option value="...">\`**:

\`\`\`html
<label for="poziom">Twój poziom zaawansowania:</label>
<select id="poziom" name="poziom">
  <option value="zero">Zaczynam od zera</option>
  <option value="junior">Znam podstawy HTML i CSS</option>
  <option value="mid">Tworzę aplikacje w React</option>
</select>
\`\`\`

**3. Kwadratowe pole \`checkbox\` vs okrągłe pole \`radio\`:**
- **\`<input type="checkbox">\` (Pole wyboru tak/nie lub wiele opcji):** Pozwala zaznaczyć np. zgodę na regulamin albo wybrać kilka ulubionych technologii naraz.
- **\`<input type="radio" name="platnosc">\` (Jedna opcja z grupy):** Gdy kilka pól \`radio\` ma ten sam atrybut \`name="..."\`, zaznaczenie jednego automatycznie odznacza pozostałe (np. wybór metody płatności: *BLIK* albo *Karta*).

**4. Wbudowana walidacja HTML5 (bez pisania JavaScriptu!):**
- \`required\` — pole nie może zostać puste,
- \`minlength="8"\` — tekst musi mieć minimum 8 znaków (np. dla hasła),
- \`min="1"\` oraz \`max="100"\` — zakres liczb dla \`type="number"\`.`,
      codeExamples: [
        {
          title: 'Kompletny formularz zgłoszeniowy z <select>, <textarea> i checkboxem',
          language: 'html',
          code: `<form>
  <label for="temat">Temat wiadomości:</label>
  <select id="temat" name="temat">
    <option value="kurs">Pytanie o kurs Full Stack</option>
    <option value="wspolpraca">Współpraca projektowa</option>
  </select>

  <label for="tresc">Treść wiadomości (min. 10 znaków):</label>
  <textarea id="tresc" rows="3" minlength="10" required></textarea>

  <label>
    <input type="checkbox" required /> Akceptuję regulamin serwisu
  </label>

  <button type="submit">Wyślij zgłoszenie</button>
</form>`,
          explanation: 'Użytkownik wybiera temat z listy <select>, wpisuje dłuższą wiadomość w <textarea>, zaznacza obowiązkowy checkbox i wysyła formularz.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Dodaj listę <select>', description: 'Wewnątrz <select> umieść co najmniej dwie opcje <option value="...">Tekst</option>.' },
        { step: 2, title: 'Dodaj pole <textarea>', description: 'Użyj <textarea rows="3"></textarea> do wpisywania dłuższego tekstu.' },
        { step: 3, title: 'Dodaj zgodę <input type="checkbox">', description: 'Pozwól użytkownikowi zaznaczyć akceptację regulaminu.' },
      ],
      interactiveExercise: {
        id: 'ex-html-13',
        title: 'Rozbuduj formularz o listę <select> oraz pole <textarea>',
        instructions: 'W edytorze mamy formularz kontaktowy. Dopisz wewnątrz niego rozwijaną listę <select> z opcjami <option> oraz wieloliniowe pole <textarea> na wiadomość!',
        task: 'Dodaj w formularzu element <select> (z <option>) oraz element <textarea>.',
        starterCode: {
          html: '<form>\n  <label for="dzial">Wybierz dział:</label>\n  <!-- 👇 DOPISZ PONIŻEJ LISTĘ <select> Z OPCJAMI <option> ORAZ POLE <textarea> -->\n  <!-- Wzór:\n  <select id="dzial">\n    <option value="pomoc">Pomoc techniczna</option>\n    <option value="kurs">Pytanie o kurs</option>\n  </select>\n  <label for="msg">Wiadomość:</label>\n  <textarea id="msg" rows="3" required></textarea>\n  -->\n  <button type="submit">Wyślij</button>\n</form>',
          css: 'form { display: flex; flex-direction: column; gap: 10px; max-width: 340px; padding: 18px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; font-family: sans-serif; }\nlabel { font-size: 0.85rem; font-weight: bold; color: #334155; }\nselect, textarea, button { padding: 8px 10px; border-radius: 8px; border: 1px solid #94a3b8; font-family: inherit; }\nbutton { background: #4f46e5; color: white; border: none; font-weight: bold; cursor: pointer; }',
          js: 'console.log("Zaawansowany formularz HTML5 gotowy!");',
        },
        solutionCode: {
          html: '<form>\n  <label for="dzial">Wybierz dział:</label>\n  <select id="dzial">\n    <option value="pomoc">Pomoc techniczna</option>\n    <option value="kurs">Pytanie o kurs</option>\n  </select>\n  <label for="msg">Wiadomość:</label>\n  <textarea id="msg" rows="3" required></textarea>\n  <button type="submit">Wyślij</button>\n</form>',
          css: 'form { display: flex; flex-direction: column; gap: 10px; max-width: 340px; padding: 18px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; font-family: sans-serif; }\nlabel { font-size: 0.85rem; font-weight: bold; color: #334155; }\nselect, textarea, button { padding: 8px 10px; border-radius: 8px; border: 1px solid #94a3b8; font-family: inherit; }\nbutton { background: #4f46e5; color: white; border: none; font-weight: bold; cursor: pointer; }',
          js: 'console.log("Zaawansowany formularz HTML5 gotowy!");',
        },
        hints: [
          'Dodaj listę: <select id="dzial"><option value="pomoc">Pomoc techniczna</option></select>',
          'Dodaj pod spodem wieloliniowe pole: <textarea id="msg" rows="3" required></textarea>',
          'Kliknij „Sprawdź kod”!',
        ],
        rules: [
          { id: 'r1', description: 'Dodano rozwijaną listę <select>', ruleType: 'html_tag_exists', target: 'select' },
          { id: 'r2', description: 'Lista zawiera opcję <option>', ruleType: 'html_tag_exists', target: 'option' },
          { id: 'r3', description: 'Dodano wieloliniowe pole <textarea>', ruleType: 'html_tag_exists', target: 'textarea' },
        ],
      },
      independentTask: {
        title: 'Dodaj pole wyboru zgody (checkbox)',
        instructions: 'Nad przyciskiem Wyślij dopisz <label><input type="checkbox" required /> Akceptuję regulamin</label>.',
        expectedOutcome: 'Formularz wymaga zaznaczenia pola wyboru przed wysłaniem.',
        starterHint: 'Umieść <input type="checkbox" required /> wewnątrz znacznika <label>.',
      },
      quiz: [
        {
          id: 'q-h13-1',
          question: 'Którego znacznika użyjesz, aby stworzyć duże, wieloliniowe pole do wpisania dłuższej wiadomości w formularzu kontaktowym?',
          options: [
            'Znacznika <textarea>...</textarea>',
            'Znacznika <select>',
            'Znacznika <input type="checkbox">',
            'Znacznika <img>',
          ],
          correctAnswer: 0,
          explanation: '<textarea> pozwala wpisywać wiele akapitów tekstu, a jego wysokość określamy atrybutem rows.',
        },
        {
          id: 'q-h13-2',
          question: 'Co musi łączyć kilka okrągłych pól <input type="radio">, aby zaznaczenie jednego automatycznie odznaczało pozostałe?',
          options: [
            'Taka sama wartość atrybutu name="..." (np. name="platnosc")',
            'Taki sam atrybut id="..."',
            'Taki sam kolor tła w CSS',
            'Umieszczenie ich w tabeli <table>',
          ],
          correctAnswer: 0,
          explanation: 'Wspólny atrybut name (np. name="plan") grupuje przyciski radiowe tak, że użytkownik może wybrać tylko jedną odpowiedź z grupy.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Próba zapisania domyślnego tekstu w <textarea> za pomocą atrybutu value="..."',
          whyItHappens: 'W zwykłym <input> używamy value="...", jednak <textarea> działa inaczej.',
          howToFix: 'Znacznik <textarea> posiada otwarcie i zamknięcie — tekst lub podpowiedź placeholder umieszczamy odpowiednio pomiędzy <textarea>Tekst</textarea> lub w placeholder="...".',
          badCode: '<textarea value="Domyślna wiadomość" />',
          goodCode: '<textarea placeholder="Wpisz wiadomość..."></textarea>',
        },
      ],
      practicalTask: {
        title: 'Dodaj trzecią opcję do listy <select>',
        brief: 'Dopisz trzeci wiersz <option value="faktura">Pytanie o fakturę</option> i rozwiń listę w podglądzie na żywo.',
        steps: ['Dodaj nowy <option> wewnątrz <select>', 'Kliknij listę rozwijaną w okienku podglądu'],
        deliverable: 'Interaktywna lista rozwijana z 3 pozycjami.',
      },
      completionCriteria: ['Zastosowanie <select>, <option> oraz <textarea>', 'Zaliczenie quizu'],
    },
    {
      id: 'html-14',
      moduleId: 2,
      moduleTitle: 'Podstawy HTML — Tworzenie Pierwszych Stron od Zera',
      title: 'Natywne komponenty interaktywne HTML5: Akordeony FAQ (<details>, <summary>), <dialog> i <iframe>',
      slug: 'natywne-komponenty-html5-details-summary-dialog-iframe',
      durationMinutes: 20,
      xpReward: 75,
      order: 13,
      summary: 'Odkryj potęgę nowoczesnego HTML5 bez pisania ani jednej linijki JavaScriptu: rozwijane pytania i odpowiedzi (<details> oraz <summary>), natywne okienka modalne (<dialog>) oraz bezpieczne osadzanie map i filmów (<iframe>).',
      objectives: [
        'Budować rozwijane sekcje FAQ (akordeony) za pomocą samych znaczników <details> i <summary>',
        'Poznać natywny znacznik okna modalnego <dialog> wprowadzony w nowoczesnym HTML5',
        'Bezpiecznie osadzać zewnętrzne mapy lub wideo za pomocą <iframe loading="lazy" title="...">',
      ],
      prerequisites: ['Lekcja 12: Multimedia na stronie (video, audio, SVG)'],
      theoryMarkdown: `Wielu początkujących myśli, że aby zrobić na stronie rozwijane pytanie FAQ (tzw. akordeon), trzeba od razu pisać skrypt w JavaScript. Tymczasem nowoczesny **HTML5 potrafi to zrobić sam z siebie**!

**1. Rozwijany akordeon FAQ bez JavaScriptu (\`<details>\` i \`<summary>\`):**
- **\`<details>\`**: Całe pudełko kryjące dodatkową treść (domyślnie zwinięte). Jeśli dopiszesz do niego słowo \`open\`, będzie domyślnie rozwinięte!
- **\`<summary>\`**: Widoczny nagłówek z trójkątną strzałką, w który klika użytkownik, aby rozwinąć lub zwinąć odpowiedź.

\`\`\`html
<details>
  <summary>Czy potrzebuję wcześniejszego doświadczenia w IT?</summary>
  <p>Nie! Kurs prowadzi Cię krok po kroku od zupełnych podstaw.</p>
</details>
\`\`\`

**2. Natywne okienko wyskakujące (\`<dialog>\`):**
Znacznik **\`<dialog>\`** to wbudowane w przeglądarkę okno modalne (popup). Posiada automatyczną obsługę klawisza \`Esc\` do zamykania oraz pełne wsparcie dla czytników ekranu.

**3. Osadzanie mapy Google lub filmu z YouTube (\`<iframe>\`):**
Znacznik **\`<iframe>\`** tworzy „okienko” na Twojej stronie, w którym wyświetla się zawartość zewnętrznego serwisu (np. interaktywna mapa dojazdu Google Maps). Pamiętaj o dwóch dobrych praktykach:
- Zawsze dodawaj **\`title="Mapa dojazdu do biura"\`** (dla dostępności WCAG),
- Dodawaj **\`loading="lazy"\`**, aby zewnętrzna ramka nie spowalniała startu Twojej strony!`,
      codeExamples: [
        {
          title: 'Sekcja Najczęściej Zadawanych Pytań (FAQ) zbudowana na <details> i <summary>',
          language: 'html',
          code: `<section>
  <h2>Najczęstsze pytania (FAQ)</h2>

  <details open>
    <summary>Jak długo trwa nauka HTML5?</summary>
    <p>Podstawy opanujesz już w pierwszy weekend praktycznych ćwiczeń!</p>
  </details>

  <details>
    <summary>Czy moje postępy są zapisywane?</summary>
    <p>Tak, każde ukończone zadanie dodaje punkty XP do Twojego profilu.</p>
  </details>
</section>`,
          explanation: 'Kliknięcie w dowolny wiersz <summary> natychmiast rozwija lub zwija ukryty pod nim akapit <p> — bez ani jednej linijki JavaScriptu!',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Otwórz kontener <details>', description: 'Każde rozwijane pytanie umieść w osobnym znaczniku <details>.' },
        { step: 2, title: 'Dodaj pytanie w <summary>', description: 'Pierwszym elementem wewnątrz <details> musi być <summary>Treść pytania</summary>.' },
        { step: 3, title: 'Wpisz odpowiedź poniżej', description: 'Pod </summary> dodaj akapit <p> z odpowiedzią, która pojawi się po kliknięciu.' },
      ],
      interactiveExercise: {
        id: 'ex-html-14',
        title: 'Stwórz rozwijane pytanie FAQ za pomocą <details> i <summary>',
        instructions: 'W edytorze mamy już jedno pytanie FAQ. Dopisz poniżej drugi blok <details> zawierający nagłówek <summary> oraz akapit <p> z odpowiedzią, a następnie kliknij go w podglądzie na żywo!',
        task: 'Dodaj w kodzie znacznik <details> zawierający w środku <summary> oraz <p>.',
        starterCode: {
          html: '<h2>Pytania i odpowiedzi (FAQ)</h2>\n\n<!-- 👇 DOPISZ PONIŻEJ ROZWIJANY BLOK <details> Z <summary> ORAZ <p> -->\n<!-- Wzór:\n<details>\n  <summary>Jak działa znacznik details?</summary>\n  <p>Po kliknięciu rozwija ukrytą treść bez użycia JavaScriptu!</p>\n</details>\n-->\n',
          css: 'body { font-family: system-ui, sans-serif; padding: 20px; color: #1e293b; }\ndetails { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px 16px; margin-bottom: 10px; }\nsummary { font-weight: bold; cursor: pointer; color: #312e81; }\ndetails p { margin: 10px 0 0 0; color: #475569; line-height: 1.5; }',
          js: 'console.log("Interaktywny akordeon HTML5 gotowy!");',
        },
        solutionCode: {
          html: '<h2>Pytania i odpowiedzi (FAQ)</h2>\n\n<details>\n  <summary>Jak działa znacznik details?</summary>\n  <p>Po kliknięciu rozwija ukrytą treść bez użycia JavaScriptu!</p>\n</details>',
          css: 'body { font-family: system-ui, sans-serif; padding: 20px; color: #1e293b; }\ndetails { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px 16px; margin-bottom: 10px; }\nsummary { font-weight: bold; cursor: pointer; color: #312e81; }\ndetails p { margin: 10px 0 0 0; color: #475569; line-height: 1.5; }',
          js: 'console.log("Interaktywny akordeon HTML5 gotowy!");',
        },
        hints: [
          'Wpisz: <details><summary>Jak działa znacznik details?</summary><p>Po kliknięciu rozwija ukrytą treść!</p></details>',
          'Kliknij utworzone pytanie w okienku podglądu po prawej stronie, aby zobaczyć jak się rozwija!',
          'Kliknij „Sprawdź kod”!',
        ],
        rules: [
          { id: 'r1', description: 'Użyto kontenera akordeonu <details>', ruleType: 'html_tag_exists', target: 'details' },
          { id: 'r2', description: 'Dodano klikalny nagłówek <summary>', ruleType: 'html_tag_exists', target: 'summary' },
          { id: 'r3', description: 'Dodano treść odpowiedzi w akapicie <p>', ruleType: 'html_tag_exists', target: 'p' },
        ],
      },
      independentTask: {
        title: 'Spraw, aby pytanie było domyślnie rozwinięte',
        instructions: 'Dopisz do otwierającego znacznika <details> atrybut open (czyli <details open>) i zobacz efekt w podglądzie.',
        expectedOutcome: 'Sekcja FAQ wyświetla się od razu rozwinięta po wczytaniu strony.',
        starterHint: 'Wpisz <details open>.',
      },
      quiz: [
        {
          id: 'q-h14-1',
          question: 'Jaka para znaczników HTML5 pozwala stworzyć rozwijany akordeon (np. sekcję FAQ) bez pisania kodu w JavaScript?',
          options: [
            '<details> oraz umieszczony w jego wnętrzu <summary>',
            '<div> oraz <span>',
            '<table> oraz <tr>',
            '<head> oraz <meta>',
          ],
          correctAnswer: 0,
          explanation: '<details> tworzy zwijalny kontener, a <summary> stanowi jego widoczny, klikalny tytuł.',
        },
        {
          id: 'q-h14-2',
          question: 'Dlaczego do ramki <iframe src="..."> zawsze warto dodać atrybut title="..."?',
          options: [
            'Aby użytkownicy czytników ekranu wiedzieli, co znajduje się wewnątrz osadzonej ramki (np. "Mapa dojazdu")',
            'Aby zmienić adres URL strony',
            'Aby wyłączyć połączenie z internetem',
            'Atrybut title jest zabroniony na znaczniku iframe',
          ],
          correctAnswer: 0,
          explanation: 'Zgodnie z wytycznymi dostępności WCAG każdy element <iframe> musi posiadać opisowy atrybut title.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Umieszczanie nagłówka pytania poza znacznikiem <details> zamiast w <summary>',
          whyItHappens: 'Niezrozumienie, że <summary> musi być pierwszym bezpośrednim dzieckiem wewnątrz <details>.',
          howToFix: 'Zawsze wkładaj <summary>Pytanie</summary> jako pierwszą linijkę zaraz po otwarciu <details>.',
          badCode: '<summary>Pytanie</summary>\n<details><p>Odpowiedź</p></details>',
          goodCode: '<details>\n  <summary>Pytanie</summary>\n  <p>Odpowiedź</p>\n</details>',
        },
      ],
      practicalTask: {
        title: 'Przetestuj rozwijanie i zwijanie w podglądzie',
        brief: 'Kliknij kilkukrotnie w nagłówek <summary> w prawym oknie podglądu — działa również po naciśnięciu Spacji lub Entera na klawiaturze!',
        steps: ['Dodaj <details> i <summary>', 'Kliknij w pytanie w podglądzie na żywo'],
        deliverable: 'W pełni dostępny, natywny akordeon FAQ.',
      },
      completionCriteria: ['Stworzenie akordeonu <details> i <summary>', 'Zaliczenie quizu'],
    },
  ],

  // Module 3 (CSS): 9th lesson — Tailwind CSS & Utility-First Architecture
  3: [
    {
      id: 'css-9',
      moduleId: 3,
      moduleTitle: 'CSS — Nowoczesne Stylowanie i Układy',
      title: 'Tailwind CSS i Architektura Utility-First: Systemy Designu i Dark Mode',
      slug: 'tailwind-css-utility-first-dark-mode',
      durationMinutes: 45,
      xpReward: 80,
      order: 9,
      summary: 'Poznaj podejście Utility-First w Tailwind CSS: budowanie responsywnych interfejsów z klas narzędziowych, stany interaktywne (hover:, focus-visible:), breakpointy (sm:, md:, lg:) oraz obsługa ciemnego motywu (dark:).',
      objectives: [
        'Zrozumieć przewagę klas atomowych (Utility-First) nad tradycyjnymi arkuszami BEM w komponentach React',
        'Stosować responsywne prefiksy sm:, md:, lg: oraz stany hover:, focus-visible: i active:',
        'Projektować spójne skale odstępów (p-4, gap-6), zaokrągleń (rounded-xl) i kontrastu w trybie ciemnym',
      ],
      prerequisites: ['Flexbox i CSS Grid', 'Zmienne CSS i Media Queries'],
      theoryMarkdown: `Tradycyjne pisanie CSS w dużych aplikacjach często prowadzi do tysięcy linii martwego kodu i problemów z wymyślaniem nazw klas (tzw. *class naming fatigue*).

**Filozofia Utility-First (Tailwind CSS):**
Zamiast wymyślać klasę \`.user-profile-card-wrapper\`, składamy wygląd bezpośrednio w komponencie z małych, jednozadaniowych klas narzędziowych:
- **Układ i odstępy:** \`flex items-center justify-between gap-4 p-6\`
- **Typografia i kolory:** \`text-sm font-semibold text-slate-100 bg-slate-900\`
- **Obramowania i cienie:** \`rounded-2xl border border-slate-800 shadow-xl\`

**Modyfikatory stanów i responsywności:**
Każdą klasę w Tailwind możesz poprzedzić prefiksem warunku:
- \`hover:bg-indigo-500\` — styl po najechaniu kursorem
- \`focus-visible:ring-2\` — widoczny pierścień fokusu dla nawigacji klawiaturą (a11y)
- \`md:grid-cols-3\` — 3 kolumny na ekranach od \`768px\` wzwyż (Mobile-First!)`,
      codeExamples: [
        {
          title: 'Komponent karty w Tailwind CSS z obsługą stanów i responsywności',
          language: 'html',
          code: `<article class="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all hover:border-indigo-500">
  <div class="flex items-center justify-between gap-4">
    <h3 class="text-lg font-bold text-white">Architektura Utility-First</h3>
    <span class="text-xs font-mono text-indigo-400">Tailwind v4</span>
  </div>
  <p class="mt-2 text-sm text-slate-300">Zero martwego CSS — kompilator generuje tylko użyte klasy.</p>
</article>`,
          explanation: 'Kompilator JIT (Just-In-Time) skanuje pliki projektu i dołącza do paczki produkcyjnej wyłącznie te klasy, które faktycznie wystąpiły w kodzie.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zacznij od układu bazowego (Mobile)', description: 'Użyj flex-col lub grid-cols-1 dla ekranu telefonu.' },
        { step: 2, title: 'Dodaj breakpointy dla większych ekranów', description: 'Dopisz sm:flex-row lub lg:grid-cols-3.' },
        { step: 3, title: 'Zadbaj o stany interaktywne', description: 'Dodaj hover: oraz focus-visible: dla każdego przycisku i linku.' },
      ],
      interactiveExercise: {
        id: 'ex-css-9',
        title: 'Karta produktu w stylu Utility-First',
        instructions: 'Utwórz kontener <div class="tw-card flex items-center justify-between"> zawierający tytuł <h3>Pakiet Full Stack</h3> oraz przycisk <button class="tw-btn">Wybierz plan</button>. W CSS zdefiniuj dla .tw-btn właściwość border-radius: 12px;.',
        task: 'Zbuduj strukturę karty z klasami narzędziowymi i ostyluj przycisk .tw-btn.',
        starterCode: {
          html: '<!-- Stwórz kartę tw-card poniżej -->\n',
          css: '.tw-card {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 16px;\n  background: #0f172a;\n  color: #f8fafc;\n  border: 1px solid #334155;\n}\n/* Dodaj border-radius: 12px dla .tw-btn */\n.tw-btn {\n  background: #4f46e5;\n  color: white;\n  padding: 8px 16px;\n}',
          js: 'console.log("System Utility-First załadowany.");',
        },
        solutionCode: {
          html: '<div class="tw-card flex items-center justify-between">\n  <h3>Pakiet Full Stack</h3>\n  <button class="tw-btn">Wybierz plan</button>\n</div>',
          css: '.tw-card {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 16px;\n  background: #0f172a;\n  color: #f8fafc;\n  border: 1px solid #334155;\n}\n.tw-btn {\n  background: #4f46e5;\n  color: white;\n  padding: 8px 16px;\n  border-radius: 12px;\n}',
          js: 'console.log("System Utility-First załadowany.");',
        },
        hints: [
          'Dodaj <div class="tw-card flex items-center justify-between">.',
          'Wewnątrz umieść <h3>Pakiet Full Stack</h3> oraz <button class="tw-btn">Wybierz plan</button>.',
          'W zakładce CSS dopisz border-radius: 12px; wewnątrz .tw-btn.',
        ],
        rules: [
          { id: 'r1', description: 'Kontener posiada klasę tw-card', ruleType: 'html_contains', target: 'tw-card' },
          { id: 'r2', description: 'Nagłówek Pakiet Full Stack obecny', ruleType: 'html_contains', target: 'Pakiet Full Stack' },
          { id: 'r3', description: 'Styl border-radius: 12px w CSS', ruleType: 'css_contains', target: 'border-radius: 12px' },
        ],
      },
      independentTask: {
        title: 'Responsywny pasek nawigacji w Tailwind',
        instructions: 'Zbuduj pasek nawigacji ukrywający linki na telefonie (hidden md:flex) i pokazujący je na ekranie desktopowym.',
        expectedOutcome: 'Czysty, responsywny układ bez pisania własnych @media queries.',
        starterHint: 'Użyj kombinacji klas hidden md:flex items-center gap-6.',
      },
      quiz: [
        {
          id: 'q-css9-1',
          question: 'Co oznacza klasa "md:grid-cols-3" w podejściu Mobile-First w Tailwind CSS?',
          options: [
            'Układ ma 3 kolumny na ekranach średnich (od 768px) oraz większych',
            'Układ ma 3 kolumny wyłącznie na telefonach komórkowych',
            'Układ tworzy 3 wiersze zamiast kolumn',
            'Klasa działa tylko po najechaniu myszką',
          ],
          correctAnswer: 0,
          explanation: 'W Tailwind CSS prefiksy sm:, md:, lg: działają w oparciu o min-width (Mobile-First).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Pisanie @media (max-width) razem z klasami Mobile-First',
          whyItHappens: 'Przyzwyczajenie do stylowania od desktopu w dół.',
          howToFix: 'Klasy bez prefiksu (np. grid-cols-1) definiują widok mobilny, a prefiksy md: i lg: rozszerzają układ na większe ekrany.',
          badCode: '<div class="grid-cols-3 sm:grid-cols-1">',
          goodCode: '<div class="grid-cols-1 md:grid-cols-3">',
        },
      ],
      practicalTask: {
        title: 'Karta cennika SaaS w Tailwind CSS',
        brief: 'Stwórz komponent cennika z wyróżnionym planem PRO i przyciskiem CTA.',
        steps: ['Utwórz siatkę grid-cols-1 md:grid-cols-2 gap-6', 'Dodaj obramowanie i cień', 'Dodaj efekt hover na przycisku'],
        deliverable: 'Komponent gotowy do osadzenia w aplikacji React.',
      },
      completionCriteria: ['Zaliczenie ćwiczenia Utility-First', 'Wynik min. 80% w quizie'],
    },
  ],

  // Module 4 (JavaScript): 10th lesson — ES6 Modules, Error Handling (try/catch), RegExp & Intl
  4: [
    {
      id: 'js-10',
      moduleId: 4,
      moduleTitle: 'JavaScript — Logika i Interaktywność',
      title: 'Moduły ES6 (import/export), własne klasy Error, RegExp i formatowanie Intl',
      slug: 'moduly-es6-obsługa-bledow-regexp-intl',
      durationMinutes: 45,
      xpReward: 85,
      order: 10,
      summary: 'Jak dzielić kod JavaScript na czyste moduły ES6, tworzyć własne klasy wyjątków (Custom Error), walidować wzorce tekstu za pomocą wyrażeń regularnych (RegExp) i formatować waluty oraz daty przez API Intl.',
      objectives: [
        'Rozróżniać eksport nazwany (named export) od domyślnego (export default)',
        'Rzucać i przechwytywać błędy za pomocą throw new Error() oraz bloku try / catch / finally',
        'Korzystać z wbudowanego obiektu Intl.NumberFormat oraz Intl.DateTimeFormat dla języka polskiego',
      ],
      prerequisites: ['Funkcje i obiekty w JS', 'Asynchroniczność i Fetch API'],
      theoryMarkdown: `Nowoczesny kod JavaScript nigdy nie znajduje się w jednym gigantycznym pliku. Dzielimy go na **Moduły ES6 (ECMAScript Modules)**:

\`\`\`js
// utils/currency.js — Eksport nazwany (Named Export)
export function formatPLN(amount) {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(amount);
}

// app.js — Import
import { formatPLN } from './utils/currency.js';
\`\`\`

**Zaawansowana obsługa błędów (\`try / catch / finally\`):**
Blok \`finally\` wykonuje się **zawsze** — niezależnie od tego, czy operacja zakończyła się sukcesem, czy rzuciła wyjątek (np. idealne miejsce na wyłączenie spinnera ładowania \`isLoading = false\`).`,
      codeExamples: [
        {
          title: 'Własna klasa błędu walidacji i bezpieczny blok try/catch/finally',
          language: 'javascript',
          code: `class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

function validateAge(age) {
  if (typeof age !== 'number' || age < 18) {
    throw new ValidationError('age', 'Wymagane ukończone 18 lat.');
  }
  return true;
}`,
          explanation: 'Dziedziczenie po wbudowanej klasie Error pozwala rozróżnić błędy walidacji formularza od awarii sieciowych.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Wydziel funkcje pomocnicze do osobnych plików', description: 'Używaj named exports (export function ...).' },
        { step: 2, title: 'Waliduj dane wejściowe i rzucaj czytelne wyjątki', description: 'Stosuj throw new Error("Konkretny powód").' },
        { step: 3, title: 'Formatuj liczby i daty natywnym API Intl', description: 'Unikaj ciężkich bibliotek zewnętrznych do prostego formatowania walut.' },
      ],
      interactiveExercise: {
        id: 'ex-js-10',
        title: 'Bezpieczny parser i formater ceny z try/catch',
        instructions: 'W zakładce JS napisz blok try { ... } catch (err) { ... }, wywołaj Intl.NumberFormat dla waluty PLN i wypisz sformatowaną kwotę w elemencie #price-out.',
        task: 'Użyj try, catch oraz Intl.NumberFormat w kodzie JavaScript.',
        starterCode: {
          html: '<div id="price-out">Oczekiwanie na przeliczenie...</div>',
          css: '#price-out { font-family: monospace; color: #34d399; font-size: 1.1rem; padding: 12px; background: #0f172a; border-radius: 8px; }',
          js: 'const rawPrice = 249.99;\n// Użyj bloku try / catch oraz Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" })\n',
        },
        solutionCode: {
          html: '<div id="price-out">Oczekiwanie na przeliczenie...</div>',
          css: '#price-out { font-family: monospace; color: #34d399; font-size: 1.1rem; padding: 12px; background: #0f172a; border-radius: 8px; }',
          js: 'const rawPrice = 249.99;\ntry {\n  const formatted = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(rawPrice);\n  document.getElementById("price-out").textContent = formatted;\n} catch (err) {\n  console.error(err);\n}',
          },
        hints: [
          'Zastosuj blok try { ... } catch (err) { ... }.',
          'Wewnątrz try utwórz new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).',
          'Przypisz wynik do document.getElementById("price-out").textContent.',
        ],
        rules: [
          { id: 'r1', description: 'Użyto konstrukcji try', ruleType: 'js_contains', target: 'try' },
          { id: 'r2', description: 'Użyto konstrukcji catch', ruleType: 'js_contains', target: 'catch' },
          { id: 'r3', description: 'Użyto API Intl.NumberFormat', ruleType: 'js_contains', target: 'Intl.NumberFormat' },
        ],
      },
      independentTask: {
        title: 'Walidator kodu pocztowego PL (RegExp)',
        instructions: 'Napisz funkcję sprawdzającą czy ciąg pasuje do wzorca /^\\d{2}-\\d{3}$/ (np. 00-950).',
        expectedOutcome: 'Funkcja zwraca true dla poprawnych kodów pocztowych i false dla błędnych.',
        starterHint: 'Użyj metody /^[0-9]{2}-[0-9]{3}$/.test(kod).',
      },
      quiz: [
        {
          id: 'q-js10-1',
          question: 'Kiedy wykonuje się kod umieszczony w bloku "finally" konstrukcji try / catch / finally?',
          options: [
            'Zawsze — niezależnie od tego, czy w bloku try wystąpił błąd, czy kod wykonał się poprawnie',
            'Tylko wtedy, gdy w bloku try wystąpił wyjątek',
            'Tylko wtedy, gdy nie było żadnego błędu',
            'Wyłącznie podczas pracy w Node.js',
          ],
          correctAnswer: 0,
          explanation: 'Blok finally gwarantuje wykonanie operacji porządkowych (np. zamknięcie połączenia lub wyłączenie stanu ładowania).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Pusty blok catch (połykanie błędów — silent failure)',
          whyItHappens: 'Chęć szybkiego pozbycia się czerwonego komunikatu w konsoli.',
          howToFix: 'Zawsze loguj błąd lub wyświetl czytelny komunikat dla użytkownika w interfejsie.',
          badCode: 'try { saveData(); } catch (e) {}',
          goodCode: 'try { saveData(); } catch (e) { console.error(e); showErrorToast("Nie udało się zapisać danych."); }',
        },
      ],
      practicalTask: {
        title: 'Moduł walidacji i formatowania danych zamówienia',
        brief: 'Stwórz moduł ES6 eksportujący funkcje walidacji e-maila oraz formatowania kwot w PLN.',
        steps: ['Zdefiniuj funkcję z RegExp', 'Dodaj formatowanie Intl.NumberFormat', 'Obsłuż błędy w try/catch'],
        deliverable: 'Czysty moduł narzędziowy gotowy do testów jednostkowych.',
      },
      completionCriteria: ['Zaliczenie ćwiczenia z try/catch i Intl', 'Wynik min. 80% w quizie'],
    },
  ],

  // Module 5 (Git & GitHub): 6th lesson — SemVer, Git Tags, Releases & Git Hooks (Husky)
  5: [
    {
      id: 'git-6',
      moduleId: 5,
      moduleTitle: 'Git i GitHub — Kontrola Wersji i Zespołowa Praca',
      title: 'Wydania produkcyjne: Wersjonowanie SemVer (v1.0.0), Git Tags, Releases i Git Hooks',
      slug: 'git-tags-semver-releases-git-hooks',
      durationMinutes: 35,
      xpReward: 70,
      order: 6,
      summary: 'Jak profesjonalnie oznaczać stabilne wydania produkcyjne za pomocą tagów Gita (git tag -a), stosować semantyczne wersjonowanie SemVer (MAJOR.MINOR.PATCH) oraz blokować błędne commity przez Git Hooks.',
      objectives: [
        'Stosować standard Semantic Versioning (MAJOR.MINOR.PATCH) w projektach komercyjnych',
        'Tworzyć opisane tagi wydań (annotated tags) i wypychać je na GitHub (git push origin --tags)',
        'Konfigurować hook pre-commit (Husky + lint-staged) uruchamiający testy przed każdym commitem',
      ],
      prerequisites: ['Gałęzie i Pull Requesty', 'Kultura Code Review i rebase'],
      theoryMarkdown: `Skąd zespół i klienci wiedzą, która dokładnie wersja kodu działa obecnie na serwerze produkcyjnym? Służą do tego **Tagi Gita (\`git tag\`)** oraz standard **Semantic Versioning (SemVer)**.

**SemVer (\`MAJOR.MINOR.PATCH\`, np. \`v2.4.1\`):**
- **MAJOR (\`2.x.x\`)** — zmiany niekompatybilne wstecz (*breaking changes*),
- **MINOR (\`x.4.x\`)** — nowe funkcjonalności dodane w sposób kompatybilny wstecz,
- **PATCH (\`x.x.1\`)** — poprawki błędów (*bugfixes*) i łatki bezpieczeństwa.

\`\`\`bash
# Utworzenie opisanego tagu wydania (Annotated Tag)
git tag -a v1.2.0 -m "Release v1.2.0: Dodano obsługę płatności i ProtectedRoute"

# Wypchnięcie tagu do repozytorium zdalnego GitHub
git push origin v1.2.0
\`\`\``,
      codeExamples: [
        {
          title: 'Konfiguracja pre-commit hooka w package.json (Husky + lint-staged)',
          language: 'json',
          code: `{
  "scripts": {
    "prepare": "husky",
    "precommit:check": "tsc --noEmit && npm test"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}`,
          explanation: 'Hook pre-commit automatycznie sprawdza typy TypeScript i formatowanie zanim Git pozwoli zapisać commit.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Sprawdź stan gałęzi main', description: 'Upewnij się, że wszystkie testy przechodzą.' },
        { step: 2, title: 'Utwórz tag z adnotacją', description: 'Wykonaj git tag -a v1.0.0 -m "Pierwsze wydanie produkcyjne".' },
        { step: 3, title: 'Opublikuj GitHub Release', description: 'Wypchnij tag na serwer i wygeneruj Changelog.' },
      ],
      interactiveExercise: {
        id: 'ex-git-6',
        title: 'Karta wydania produkcyjnego SemVer',
        instructions: 'Zbuduj w HTML kartę wydania zawierającą wersję <code>v1.2.0</code>, komendę <code>git tag -a v1.2.0</code> oraz opis "Stabilne wydanie produkcyjne".',
        task: 'Umieść znacznik wersji v1.2.0 oraz komendę git tag -a w kodzie HTML.',
        starterCode: {
          html: '<div class="release-box">\n  <!-- Dodaj wersję v1.2.0 oraz komendę git tag -a -->\n</div>',
          css: '.release-box { background: #0f172a; border: 1px solid #334155; padding: 16px; border-radius: 12px; color: #f8fafc; font-family: sans-serif; }\ncode { color: #38bdf8; font-family: monospace; }',
          js: 'console.log("Rejestr wydań SemVer gotowy.");',
        },
        solutionCode: {
          html: '<div class="release-box">\n  <h3>Wydanie <code>v1.2.0</code> — Stabilne wydanie produkcyjne</h3>\n  <p>Komenda: <code>git tag -a v1.2.0</code></p>\n</div>',
          css: '.release-box { background: #0f172a; border: 1px solid #334155; padding: 16px; border-radius: 12px; color: #f8fafc; font-family: sans-serif; }\ncode { color: #38bdf8; font-family: monospace; }',
          js: 'console.log("Rejestr wydań SemVer gotowy.");',
        },
        hints: [
          'Wpisz w HTML tekst v1.2.0.',
          'Wpisz komendę git tag -a.',
          'Dodaj tekst Stabilne wydanie produkcyjne.',
        ],
        rules: [
          { id: 'r1', description: 'Wersja v1.2.0 obecna w HTML', ruleType: 'html_contains', target: 'v1.2.0' },
          { id: 'r2', description: 'Komenda git tag -a obecna w HTML', ruleType: 'html_contains', target: 'git tag -a' },
          { id: 'r3', description: 'Opis Stabilne wydanie produkcyjne obecny', ruleType: 'html_contains', target: 'Stabilne wydanie produkcyjne' },
        ],
      },
      independentTask: {
        title: 'Automatyczny Changelog z Conventional Commits',
        instructions: 'Pogrupuj listę commitów zaczynających się od feat: oraz fix: w czytelną notatkę wydania v1.1.0.',
        expectedOutcome: 'Przejrzysta lista nowości i naprawionych błędów dla zespołu i użytkowników.',
        starterHint: 'Użyj git log --oneline v1.0.0..HEAD.',
      },
      quiz: [
        {
          id: 'q-git6-1',
          question: 'Którą część numeru wersji SemVer (MAJOR.MINOR.PATCH) należy zwiększyć, gdy naprawiamy błąd bezpieczeństwa bez zmiany API?',
          options: [
            'PATCH (np. z 1.4.2 na 1.4.3)',
            'MAJOR (np. z 1.4.2 na 2.0.0)',
            'MINOR (np. z 1.4.2 na 1.5.0)',
            'Żadną — nadpisujemy stary tag',
          ],
          correctAnswer: 0,
          explanation: 'Poprawki błędów kompatybilne wstecz zwiększają trzeci człon wersji (PATCH).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Zapominanie o wypchnięciu tagów (zwykłe git push nie wysyła tagów)',
          whyItHappens: 'Domyślnie git push przesyła tylko commity z bieżącej gałęzi.',
          howToFix: 'Używaj jawnego git push origin v1.2.0 lub git push origin --tags.',
          badCode: 'git tag -a v1.2.0 -m "release" && git push',
          goodCode: 'git tag -a v1.2.0 -m "release" && git push origin v1.2.0',
        },
      ],
      practicalTask: {
        title: 'Konfiguracja wydania v1.0.0',
        brief: 'Oznacz stabilny punkt historii projektu tagiem z adnotacją.',
        steps: ['Zweryfikuj git status', 'Wykonaj git tag -a v1.0.0 -m "Init release"', 'Sprawdź listę tagów poleceniem git tag -n'],
        deliverable: 'Oznaczona wersja wydania w repozytorium.',
      },
      completionCriteria: ['Zaliczenie ćwiczenia SemVer', 'Wynik min. 80% w quizie'],
    },
  ],

  // Module 10 (Security): 5th lesson — Secure Cookies (HttpOnly, Secure, SameSite) & Session Architecture
  10: [
    {
      id: 'sec-5',
      moduleId: 10,
      moduleTitle: 'Autoryzacja i Bezpieczeństwo Aplikacji',
      title: 'Bezpieczne Ciasteczka (HttpOnly, Secure, SameSite) i Architektura Sesji vs JWT',
      slug: 'bezpieczne-ciasteczka-httponly-samesite-sesje',
      durationMinutes: 45,
      xpReward: 90,
      order: 5,
      summary: 'Gdzie bezpiecznie przechowywać tokeny sesyjne w przeglądarce: dlaczego localStorage jest podatny na atak XSS, jak skonfigurować flagi ciasteczek HttpOnly, Secure i SameSite=Strict oraz jak unieważniać skompromitowane sesje.',
      objectives: [
        'Skonfigurować ciasteczka autoryzacyjne odporne na odczyt przez złośliwy skrypt JavaScript (HttpOnly)',
        'Dobierać politykę SameSite (Strict, Lax, None) dla ochrony przed atakami CSRF',
        'Wdrożyć rotację Refresh Tokenów oraz czarną listę unieważnionych sesji (Token Revocation)',
      ],
      prerequisites: ['Haszowanie bcrypt i JWT', 'Ochrona przed OWASP Top 10'],
      theoryMarkdown: `Jednym z najczęstszych pytań na rozmowach rekrutacyjnych Senior/Mid Full Stack jest: **„Gdzie przechowujesz token JWT po stronie przeglądarki?”**

**Dlaczego \`localStorage\` bywa ryzykowny?**
Każdy skrypt uruchomiony na stronie (np. przez lukę XSS lub zainfekowaną paczkę npm) ma pełny dostęp do \`window.localStorage.getItem('token')\`.

**Rozwiązanie produkcyjne: Ciasteczko \`HttpOnly\` + \`Secure\` + \`SameSite\`:**
\`\`\`ts
res.cookie('access_token', signedJwt, {
  httpOnly: true,     // Brak dostępu z poziomu document.cookie w JavaScript!
  secure: true,       // Przesyłane wyłącznie po szyfrowanym połączeniu HTTPS
  sameSite: 'strict', // Blokuje wysyłanie ciasteczka z obcych domen (ochrona CSRF)
  maxAge: 15 * 60 * 1000, // 15 minut ważności
  path: '/',
});
\`\`\``,
      codeExamples: [
        {
          title: 'Bezpieczne ustawienie i wyczyszczenie ciasteczka sesyjnego w Express.js',
          language: 'typescript',
          code: `app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  return res.status(200).json({ message: 'Sesja została bezpiecznie zakończona.' });
});`,
          explanation: 'Podczas wylogowania serwer nadpisuje ciasteczko HttpOnly z natychmiastową datą wygaśnięcia.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Włącz flagę HttpOnly', description: 'Zablokuj dostęp do tokenu przez document.cookie.' },
        { step: 2, title: 'Wymuś HTTPS flagą Secure', description: 'Zapobiegnij podsłuchaniu ciasteczka w sieci Wi-Fi (Man-in-the-Middle).' },
        { step: 3, title: 'Skonfiguruj SameSite', description: 'Użyj Lax lub Strict, aby zablokować nieautoryzowane żądania Cross-Site.' },
      ],
      interactiveExercise: {
        id: 'ex-sec-5',
        title: 'Konfigurator nagłówka Set-Cookie w Express',
        instructions: 'W zakładce JS uzupełnij obiekt konfiguracji ciasteczka o właściwości httpOnly: true, secure: true oraz sameSite: "strict".',
        task: 'Skonfiguruj flagi bezpieczeństwa httpOnly, secure i sameSite.',
        starterCode: {
          html: '<div class="cookie-audit">Audyt polityki ciasteczek sesyjnych</div>',
          css: '.cookie-audit { padding: 14px; background: #0f172a; border: 1px solid #10b981; color: #d1fae5; border-radius: 10px; font-family: monospace; }',
          js: 'const cookieOptions = {\n  // Uzupełnij flagi httpOnly: true, secure: true, sameSite: "strict"\n};\nconsole.log(cookieOptions);',
        },
        solutionCode: {
          html: '<div class="cookie-audit">Audyt polityki ciasteczek sesyjnych</div>',
          css: '.cookie-audit { padding: 14px; background: #0f172a; border: 1px solid #10b981; color: #d1fae5; border-radius: 10px; font-family: monospace; }',
          js: 'const cookieOptions = {\n  httpOnly: true,\n  secure: true,\n  sameSite: "strict"\n};\nconsole.log(cookieOptions);',
        },
        hints: [
          'Dodaj właściwość httpOnly: true.',
          'Dodaj właściwość secure: true.',
          'Dodaj właściwość sameSite: "strict".',
        ],
        rules: [
          { id: 'r1', description: 'Flaga httpOnly: true ustawiona', ruleType: 'js_contains', target: 'httpOnly: true' },
          { id: 'r2', description: 'Flaga secure: true ustawiona', ruleType: 'js_contains', target: 'secure: true' },
          { id: 'r3', description: 'Polityka sameSite ustawiona na strict', ruleType: 'js_contains', target: 'strict' },
        ],
      },
      independentTask: {
        title: 'Mechanizm Refresh Token Rotation',
        instructions: 'Zaprojektuj endpoint /api/auth/refresh, który przy każdym odświeżeniu unieważnia poprzedni Refresh Token i wydaje nową parę.',
        expectedOutcome: 'Natychmiastowe wykrycie próby ponownego użycia skradzionego tokenu.',
        starterHint: 'Zapisuj identyfikator jti tokenu w bazie danych lub Redisie.',
      },
      quiz: [
        {
          id: 'q-sec5-1',
          question: 'Przed jakim atakiem chroni przede wszystkim flaga "HttpOnly" ustawiona na ciasteczku sesyjnym?',
          options: [
            'Przed kradzieżą tokenu sesyjnego przez złośliwy kod JavaScript wstrzyknięty w ataku XSS (Cross-Site Scripting)',
            'Przed atakiem SQL Injection w bazie PostgreSQL',
            'Przed przeciążeniem serwera DDoS',
            'Przed błędami typowania w TypeScript',
          ],
          correctAnswer: 0,
          explanation: 'Ciasteczko z flagą HttpOnly jest całkowicie niewidoczne dla obiektu document.cookie w JavaScript.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Pomijanie credentials: "include" w zapytaniach fetch() po stronie Reacta',
          whyItHappens: 'Domyślnie przeglądarka nie dołącza ciasteczek do zapytań cross-origin.',
          howToFix: 'Ustaw credentials: "include" w fetch() oraz credentials: true w konfiguracji middleware CORS na backendzie.',
          badCode: 'fetch("https://api.domena.pl/profile")',
          goodCode: 'fetch("https://api.domena.pl/profile", { credentials: "include" })',
        },
      ],
      practicalTask: {
        title: 'Wdrożenie bezpiecznych ciasteczek sesyjnych',
        brief: 'Przenieś token autoryzacyjny z localStorage do ciasteczka HttpOnly.',
        steps: ['Zainstaluj cookie-parser w Express', 'Ustaw res.cookie z flagami HttpOnly i Secure', 'Skonfiguruj odczyt ciasteczka w middleware autoryzacji'],
        deliverable: 'Bezpieczna obsługa sesji odporna na wyciek przez XSS.',
      },
      completionCriteria: ['Zaliczenie ćwiczenia z flagami ciasteczek', 'Wynik min. 80% w quizie'],
    },
  ],

  // Module 11 (Full Stack Integration): 4th and 5th lessons
  11: [
    {
      id: 'fullstack-4',
      moduleId: 11,
      moduleTitle: 'Full Stack — Integracja Całego Ekosystemu',
      title: 'Klient HTTP, Interceptory autoryzacji, automatyczny Refresh Token i CORS',
      slug: 'klient-http-interceptory-refresh-token-cors',
      durationMinutes: 45,
      xpReward: 90,
      order: 4,
      summary: 'Jak zbudować niezawodną warstwę komunikacji HTTP na linii React–Express: centralny klient API, automatyczne dołączanie nagłówka Authorization Bearer oraz bezszwowe odświeżanie wygasłego tokenu (401 Retry Queue).',
      objectives: [
        'Stworzyć centralny wrapper wokół Fetch API / Axios z obsługą bazowego adresu API i timeoutów',
        'Zaimplementować wzorzec Request & Response Interceptor dla automatycznego odświeżania sesji po błędzie 401',
        'Prawidłowo skonfigurować nagłówki CORS (Access-Control-Allow-Origin, Allow-Credentials) między klientem a serwerem',
      ],
      prerequisites: ['TanStack Query', 'Tokeny JWT i Refresh Token'],
      theoryMarkdown: `W profesjonalnej aplikacji React żaden komponent nie wywołuje surowego \`fetch('http://localhost:4000/api/...')\` z ręcznym doklejaniem tokenów. Tworzymy **centralny klient API (HTTP Client)**.

**Jak działa Response Interceptor przy wygaśnięciu Access Tokenu (401)?**
1. Komponent wysyła żądanie \`GET /api/orders\`.
2. Access Token wygasł (minęło 15 minut) — serwer zwraca \`401 Unauthorized\`.
3. Interceptor przechwytuje błąd \`401\`, w tle wywołuje \`POST /api/auth/refresh\`, pobiera nowy Access Token i **automatycznie ponawia** pierwotne żądanie \`GET /api/orders\`!
4. Użytkownik nawet nie zauważa, że token w międzyczasie został odświeżony.`,
      codeExamples: [
        {
          title: 'Centralny klient Fetch z automatycznym odświeżaniem tokenu przy statusie 401',
          language: 'typescript',
          code: `export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(\`/api\${endpoint}\`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  if (res.status === 401) {
    const refreshRes = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
    if (refreshRes.ok) {
      return fetch(\`/api\${endpoint}\`, { ...options, credentials: 'include' });
    }
  }
  return res;
}`,
          explanation: 'Wszystkie komponenty korzystają z jednej funkcji apiFetch, dzięki czemu obsługa sesji i błędów jest w jednym miejscu.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Utwórz plik src/api/client.ts', description: 'Skonfiguruj bazowy URL ze zmiennej środowiskowej VITE_API_URL.' },
        { step: 2, title: 'Dodaj obsługę nagłówków i credentials', description: 'Zapewnij przekazywanie tokenów w każdym żądaniu.' },
        { step: 3, title: 'Obsłuż kod 401 Unauthorized', description: 'Wywołaj odświeżenie sesji lub przekieruj do logowania.' },
      ],
      interactiveExercise: {
        id: 'ex-fs-4',
        title: 'Interceptor klienta HTTP w JavaScript',
        instructions: 'W zakładce JS dokończ funkcję apiClient: ustaw nagłówek Authorization z wartością "Bearer " + token oraz sprawdź warunek status === 401.',
        task: 'Dodaj nagłówek Bearer oraz sprawdzenie status === 401 w kodzie JS.',
        starterCode: {
          html: '<div class="api-status">Klient HTTP z obsługą 401 Retry</div>',
          css: '.api-status { padding: 14px; background: #0f172a; border: 1px solid #38bdf8; color: #e0f2fe; border-radius: 10px; font-family: monospace; }',
          js: 'function createHeaders(token, status) {\n  // Ustaw Authorization: "Bearer " + token i sprawdź status === 401\n}',
        },
        solutionCode: {
          html: '<div class="api-status">Klient HTTP z obsługą 401 Retry</div>',
          css: '.api-status { padding: 14px; background: #0f172a; border: 1px solid #38bdf8; color: #e0f2fe; border-radius: 10px; font-family: monospace; }',
          js: 'function createHeaders(token, status) {\n  const headers = { Authorization: "Bearer " + token };\n  if (status === 401) {\n    return { refreshRequired: true, headers };\n  }\n  return headers;\n}',
        },
        hints: [
          'Użyj ciągu "Bearer " w nagłówku Authorization.',
          'Sprawdź warunek status === 401.',
        ],
        rules: [
          { id: 'r1', description: 'Użyto prefiksu Bearer', ruleType: 'js_contains', target: 'Bearer' },
          { id: 'r2', description: 'Sprawdzono kod odpowiedzi 401', ruleType: 'js_contains', target: '401' },
        ],
      },
      independentTask: {
        title: 'Kolejka oczekujących zapytań podczas Refreshu (Mutex)',
        instructions: 'Zabezpiecz interceptor tak, aby 5 równoczesnych zapytań zwracających 401 wywołało tylko jedno żądanie /api/auth/refresh.',
        expectedOutcome: 'Brak wyścigu (race condition) przy odświeżaniu tokenów.',
        starterHint: 'Przechowuj obietnicę refreshPromise w zmiennej modułowej.',
      },
      quiz: [
        {
          id: 'q-fs4-1',
          question: 'Po co w kliencie HTTP stosuje się wzorzec Response Interceptor dla kodu 401?',
          options: [
            'Aby automatycznie odświeżyć wygasły Access Token w tle i ponowić zapytanie bez przerywania pracy użytkownika',
            'Aby przyspieszyć renderowanie CSS',
            'Aby zastąpić bazę danych PostgreSQL',
            'Aby ominąć walidację formularzy',
          ],
          correctAnswer: 0,
          explanation: 'Interceptor 401 pozwala utrzymać krótki czas życia Access Tokenu (np. 15 min) przy zachowaniu płynnego UX.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Nieskończona pętla odświeżania, gdy sam endpoint /api/auth/refresh zwróci 401',
          whyItHappens: 'Interceptor próbuje odświeżyć token również dla nieudanego zapytania odświeżającego.',
          howToFix: 'Dodaj flagę _retry = true lub wyklucz ścieżkę /api/auth/refresh z interceptora.',
          badCode: 'if (res.status === 401) return refreshAndRetry(req); // pętla dla /auth/refresh!',
          goodCode: 'if (res.status === 401 && !req.url.includes("/auth/refresh")) return refreshAndRetry(req);',
        },
      ],
      practicalTask: {
        title: 'Budowa warstwy apiClient dla aplikacji SPA',
        brief: 'Napisz moduł klienta HTTP z obsługą tokenów i błędów sieciowych.',
        steps: ['Stwórz funkcję pomocniczą request<T>()', 'Dodaj automatyczne parsowanie JSON', 'Obsłuż wygaśnięcie sesji (401)'],
        deliverable: 'Typowany klient HTTP gotowy do współpracy z TanStack Query.',
      },
      completionCriteria: ['Zaliczenie ćwiczenia z interceptorem 401', 'Wynik min. 80% w quizie'],
    },
    {
      id: 'fullstack-5',
      moduleId: 11,
      moduleTitle: 'Full Stack — Integracja Całego Ekosystemu',
      title: 'Zaawansowane Formularze Full Stack: Współdzielony schemat Zod (Frontend + Backend)',
      slug: 'formularze-fullstack-wspoldzielony-schemat-zod',
      durationMinutes: 45,
      xpReward: 95,
      order: 5,
      summary: 'Jedno źródło prawdy dla walidacji danych: jak użyć tego samego schematu Zod w formularzu React (natychmiastowy feedback dla użytkownika) oraz w kontrolerze Express (ochrona serwera i bazy danych).',
      objectives: [
        'Definiować współdzielone schematy walidacji Zod i automatycznie wyprowadzać z nich typy TypeScript (z.infer)',
        'Mapować błędy walidacji serwerowej (400 Bad Request) bezpośrednio pod odpowiednimi polami formularza w React',
        'Zabezpieczać formularze przed podwójnym wysłaniem (Idempotency & isSubmitting state)',
      ],
      prerequisites: ['Formularze w React', 'Walidacja Zod w Express'],
      theoryMarkdown: `Walidacja wyłącznie na frontendzie to złudzenie bezpieczeństwa (każdy może wysłać zapytanie z Postmana lub \`curl\`). Z kolei walidacja wyłącznie na backendzie daje słaby UX (użytkownik dowiaduje się o literówce dopiero po wysłaniu formularza).

**Wzorzec Izomorficznej Walidacji (Shared Zod Schema):**
Definiujemy schemat raz we współdzielonym pliku \`shared/schemas/userSchema.ts\`:
\`\`\`ts
import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Podaj poprawny adres e-mail'),
  password: z.string().min(8, 'Hasło musi mieć minimum 8 znaków'),
  role: z.enum(['student', 'admin']).default('student'),
});

// Automatyczny typ TypeScript wygenerowany ze schematu!
export type RegisterInput = z.infer<typeof RegisterSchema>;
\`\`\`
Ten sam obiekt \`RegisterSchema\` waliduje pola na żywo w komponencie React oraz weryfikuje \`req.body\` w middleware Expressa!`,
      codeExamples: [
        {
          title: 'Weryfikacja tym samym schematem na serwerze i kliencie',
          language: 'typescript',
          code: `// Na frontendzie przed wysłaniem:
const parsed = RegisterSchema.safeParse(formData);
if (!parsed.success) {
  setFieldErrors(parsed.error.flatten().fieldErrors);
  return;
}

// Na backendzie w kontrolerze Express:
const body = RegisterSchema.parse(req.body); // Gwarantowany typ RegisterInput!`,
          explanation: 'Reguły walidacji nigdy się nie rozjeżdżają między frontendem a backendem.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Utwórz schemat Zod', description: 'Zdefiniuj reguły długości, formatu email i komunikatów po polsku.' },
        { step: 2, title: 'Wygeneruj typ z.infer<typeof Schema>', description: 'Nie pisz ręcznie zduplikowanego interfejsu TypeScript.' },
        { step: 3, title: 'Użyj safeParse w formularzu i w API', description: 'Wyświetl precyzyjne komunikaty błędów pod polami input.' },
      ],
      interactiveExercise: {
        id: 'ex-fs-5',
        title: 'Formularz z podwójną walidacją i blokadą wysyłki',
        instructions: 'Utwórz formularz <form id="order-form"> z polem <input type="email" required> oraz przyciskiem <button type="submit">Złóż zamówienie</button>. W JS użyj metody safeParse.',
        task: 'Zbuduj formularz z polem email i wywołaniem safeParse w JS.',
        starterCode: {
          html: '<!-- Stwórz formularz #order-form z input type="email" i button type="submit" -->\n',
          css: 'form { display: flex; gap: 10px; background: #0f172a; padding: 16px; border-radius: 10px; }\ninput { padding: 8px 12px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: white; }\nbutton { background: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; }',
          js: '// Wywołaj walidację safeParse dla danych formularza\n',
        },
        solutionCode: {
          html: '<form id="order-form">\n  <input type="email" required placeholder="kursant@akademia.pl" />\n  <button type="submit">Złóż zamówienie</button>\n</form>',
          css: 'form { display: flex; gap: 10px; background: #0f172a; padding: 16px; border-radius: 10px; }\ninput { padding: 8px 12px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: white; }\nbutton { background: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; }',
          js: 'const schema = { safeParse: (val) => ({ success: Boolean(val) }) };\nconst result = schema.safeParse("kursant@akademia.pl");\nconsole.log(result);',
        },
        hints: [
          'Dodaj znacznik <form id="order-form">.',
          'Wewnątrz umieść <input type="email" required> oraz <button type="submit">Złóż zamówienie</button>.',
          'W zakładce JS użyj metody safeParse.',
        ],
        rules: [
          { id: 'r1', description: 'Znacznik form obecny w HTML', ruleType: 'html_tag_exists', target: 'form' },
          { id: 'r2', description: 'Pole input type="email" obecne', ruleType: 'html_contains', target: 'type="email"' },
          { id: 'r3', description: 'Wywołano metodę safeParse w JS', ruleType: 'js_contains', target: 'safeParse' },
        ],
      },
      independentTask: {
        title: 'Walidacja zależnych pól (Potwierdzenie hasła z .refine())',
        instructions: 'Użyj metody .refine((data) => data.password === data.confirmPassword) w schemacie Zod.',
        expectedOutcome: 'Błąd walidacji przypisany dokładnie do pola confirmPassword.',
        starterHint: 'Przekaż obiekt { message: "Hasła muszą być identyczne", path: ["confirmPassword"] } jako drugi argument refine.',
      },
      quiz: [
        {
          id: 'q-fs5-1',
          question: 'Do czego służy konstrukcja "type UserInput = z.infer<typeof UserSchema>" w bibliotece Zod?',
          options: [
            'Automatycznie generuje statyczny typ TypeScript na podstawie zdefiniowanego schematu walidacji runtime',
            'Wysyła zapytanie SQL do bazy danych',
            'Szyfruje hasło użytkownika algorytmem bcrypt',
            'Kompiluje kod Reacta do WebAssembly',
          ],
          correctAnswer: 0,
          explanation: 'z.infer eliminuje duplikację między definicją typu TypeScript a regułami walidacji w czasie wykonywania programu.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Brak blokady przycisku Submit podczas trwania zapytania POST',
          whyItHappens: 'Użytkownik klika dwukrotnie przycisk na wolnym łączu internetowym.',
          howToFix: 'Zawsze ustawiaj atrybut disabled={isSubmitting} na przycisku wysyłania formularza.',
          badCode: '<button type="submit">Wyślij</button>',
          goodCode: '<button type="submit" disabled={isSubmitting}>{isSubmitting ? "Wysyłanie..." : "Wyślij"}</button>',
        },
      ],
      practicalTask: {
        title: 'Współdzielony walidator rejestracji',
        brief: 'Połącz walidację formularza rejestracji z obsługą błędów 400 z serwera.',
        steps: ['Stwórz schemat Zod', 'Zweryfikuj dane przed wysyłką', 'Wyświetl błędy pól pod inputami'],
        deliverable: 'Kompletny formularz odporny na błędne dane.',
      },
      completionCriteria: ['Zaliczenie ćwiczenia z formularzem i safeParse', 'Wynik min. 80% w quizie'],
    },
  ],

  // Module 12 (Testing): 4th lesson — Integration Testing REST API & Database (Supertest)
  12: [
    {
      id: 'test-4',
      moduleId: 12,
      moduleTitle: 'Testowanie i Jakość Kodu',
      title: 'Testy Integracyjne REST API i Bazy Danych: Supertest, Izolacja i Fabryki Danych',
      slug: 'testy-integracyjne-rest-api-supertest-baza-danych',
      durationMinutes: 50,
      xpReward: 95,
      order: 4,
      summary: 'Środkowe piętro piramidy testów: jak testować prawdziwe endpointy Express.js razem z walidacją Zod, middleware autoryzacji i testową bazą danych za pomocą biblioteki Supertest.',
      objectives: [
        'Pisać testy integracyjne HTTP dla endpointów GET, POST, PATCH i DELETE przy użyciu Supertest',
        'Izolować stan bazy danych między testami (czyszczenie tabel w beforeEach lub transakcje testowe)',
        'Testować scenariusze brzegowe: brak tokenu (401), błędny payload (400) oraz brak uprawnień roli (403)',
      ],
      prerequisites: ['Testy jednostkowe Vitest', 'Backend Express i Prisma ORM'],
      theoryMarkdown: `Testy jednostkowe sprawdzają pojedyncze funkcje w izolacji, ale skąd wiesz, czy Twój routing Expressa, middleware autoryzacji JWT, walidator Zod i zapytanie Prisma działają poprawnie **razem**?

Do tego służą **Testy Integracyjne API z biblioteką Supertest**:
\`\`\`ts
import request from 'supertest';
import { app } from '../src/app';

test('POST /api/courses zwraca 403 dla roli studenta i 201 dla admina', async () => {
  const studentRes = await request(app)
    .post('/api/courses')
    .set('Authorization', \`Bearer \${studentToken}\`)
    .send({ title: 'Nowy kurs' });
  expect(studentRes.status).toBe(403);

  const adminRes = await request(app)
    .post('/api/courses')
    .set('Authorization', \`Bearer \${adminToken}\`)
    .send({ title: 'Nowy kurs' });
  expect(adminRes.status).toBe(201);
  expect(adminRes.body.title).toBe('Nowy kurs');
});
\`\`\``,
      codeExamples: [
        {
          title: 'Izolacja bazy testowej przed każdym testem integracyjnym',
          language: 'typescript',
          code: `beforeEach(async () => {
  // Czyszczenie tabel w dedykowanej bazie testowej (TEST_DATABASE_URL)
  await prisma.$transaction([
    prisma.enrollment.deleteMany(),
    prisma.course.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});`,
          explanation: 'Każdy test musi startować z czystego, przewidywalnego stanu bazy danych (deterministyczność testów).',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Oddziel app.ts od server.listen()', description: 'Eksportuj instancję Expressa bez otwierania portu sieciowego, aby Supertest mógł z niej korzystać.' },
        { step: 2, title: 'Skonfiguruj osobną bazę testową (.env.test)', description: 'Nigdy nie uruchamiaj testów integracyjnych na bazie deweloperskiej ani produkcyjnej!' },
        { step: 3, title: 'Przetestuj kody 200/201 oraz 400/401/403', description: 'Sprawdzaj zarówno ścieżkę sukcesu (happy path), jak i blokady bezpieczeństwa.' },
      ],
      interactiveExercise: {
        id: 'ex-test-4',
        title: 'Test integracyjny endpointu chronionego rolą Admina',
        instructions: 'W zakładce JS uzupełnij test integracyjny: wywołaj request(app).post("/api/admin") oraz sprawdź asercję status === 403.',
        task: 'Użyj request(app) oraz sprawdzenia 403 w teście integracyjnym.',
        starterCode: {
          html: '<div class="test-runner">Suite: API Integration Tests (Supertest)</div>',
          css: '.test-runner { padding: 14px; background: #0f172a; border: 1px solid #22c55e; color: #bbf7d0; border-radius: 10px; font-family: monospace; }',
          js: '// Napisz wywołanie request(app) i sprawdź kod 403 dla nieautoryzowanego użytkownika\n',
        },
        solutionCode: {
          html: '<div class="test-runner">Suite: API Integration Tests (Supertest)</div>',
          css: '.test-runner { padding: 14px; background: #0f172a; border: 1px solid #22c55e; color: #bbf7d0; border-radius: 10px; font-family: monospace; }',
          js: 'async function runIntegrationTest(request, app) {\n  const res = await request(app).post("/api/admin");\n  return res.status === 403;\n}',
        },
        hints: [
          'Wywołaj request(app) w kodzie JS.',
          'Sprawdź czy status odpowiedzi wynosi 403.',
        ],
        rules: [
          { id: 'r1', description: 'Wywołano request(app)', ruleType: 'js_contains', target: 'request(app)' },
          { id: 'r2', description: 'Zweryfikowano kod HTTP 403', ruleType: 'js_contains', target: '403' },
        ],
      },
      independentTask: {
        title: 'Fabryka danych testowych (User Factory)',
        instructions: 'Napisz funkcję createTestUser(overrides) generującą unikalnego użytkownika w bazie testowej.',
        expectedOutcome: 'Zwięzłe i czytelne przygotowanie danych (Arrange) w każdym teście.',
        starterHint: 'Użyj domyślnych wartości i operatora spread (...overrides).',
      },
      quiz: [
        {
          id: 'q-test4-1',
          question: 'Dlaczego w architekturze Express.js warto rozdzielić definicję aplikacji (app.ts) od uruchomienia nasłuchiwania portu (server.ts z app.listen)?',
          options: [
            'Ponieważ pozwala to bibliotece Supertest zaimportować obiekt app bezpośrednio w pamięci bez kolizji zajętych portów TCP podczas równoległych testów',
            'Ponieważ Express nie obsługuje więcej niż jednego pliku',
            'Ponieważ wymaga tego przeglądarka Chrome',
            'Aby wyłączyć sprawdzanie typów TypeScript',
          ],
          correctAnswer: 0,
          explanation: 'Supertest tworzy własny efemeryczny serwer dla przekazanego obiektu app, co eliminuje błędy EADDRINUSE.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Współdzielenie stanu bazy danych między kolejnymi testami bez czyszczenia',
          whyItHappens: 'Brak hooka beforeEach / afterEach czyszczącego rekordy.',
          howToFix: 'Zawsze resetuj stan bazy przed każdym testem, aby testy były od siebie w 100% niezależne.',
          badCode: '// Test 2 zakłada, że Test 1 utworzył już użytkownika w bazie...',
          goodCode: 'beforeEach(async () => { await cleanDatabase(); });',
        },
      ],
      practicalTask: {
        title: 'Zestaw testów integracyjnych dla modułu logowania',
        brief: 'Przetestuj endpoint POST /api/auth/login dla poprawnych danych, błędnego hasła i zablokowanego konta.',
        steps: ['Przygotuj użytkownika w bazie testowej', 'Wyślij żądanie przez Supertest', 'Sprawdź kody 200, 401 i 403 oraz ciasteczko Set-Cookie'],
        deliverable: 'Automatyczny test integracyjny chroniący proces uwierzytelniania.',
      },
      completionCriteria: ['Zaliczenie ćwiczenia z Supertest', 'Wynik min. 80% w quizie'],
    },
  ],

  // Module 13 (DevOps & Deployment): 4th lesson — PM2, Cluster Mode, Zero-Downtime Reload & Firewall UFW
  13: [
    {
      id: 'devops-4',
      moduleId: 13,
      moduleTitle: 'Deployment i DevOps — Wdrażanie na Produkcję',
      title: 'Procesy Node.js na produkcji: PM2, tryb Cluster, Zero-Downtime Reload i Firewall UFW',
      slug: 'pm2-cluster-mode-zero-downtime-ufw-linux',
      durationMinutes: 45,
      xpReward: 95,
      order: 4,
      summary: 'Jak utrzymać serwer Node.js przy życiu 24/7 na maszynie Linux VPS: menedżer procesów PM2, wykorzystanie wszystkich rdzeni procesora w trybie Cluster, wdrożenia bez przerwy w działaniu (pm2 reload) oraz zapora sieciowa UFW.',
      objectives: [
        'Skonfigurować plik ecosystem.config.cjs dla menedżera procesów PM2 w trybie cluster (instances: "max")',
        'Wykonywać wdrożenia nowej wersji kodu bez zrywania aktywnych połączeń klientów (pm2 reload)',
        'Zabezpieczyć serwer Ubuntu Linux zaporą UFW (otwarte wyłącznie porty 22/SSH, 80/HTTP i 443/HTTPS)',
      ],
      prerequisites: ['Docker i CI/CD', 'Serwer VPS i Nginx Reverse Proxy'],
      theoryMarkdown: `Pojedynczy proces Node.js działa na **jednym wątku głównym**. Jeśli Twój serwer VPS posiada 4 lub 8 rdzeni CPU, zwykłe uruchomienie \`node dist/server.js\` wykorzysta tylko 1 rdzeń, a po nieobsłużonym błędzie proces po prostu się wyłączy!

**Menedżer procesów PM2 i Tryb Cluster:**
PM2 automatycznie uruchamia kopię aplikacji na każdym rdzeniu procesora i restartuje proces w ułamku sekundy w razie awarii:
\`\`\`js
// ecosystem.config.cjs
module.exports = {
  apps: [{
    name: 'fullstack-academy-api',
    script: './dist/server.js',
    instances: 'max',       // Wykorzystaj wszystkie rdzenie CPU!
    exec_mode: 'cluster',   // Wbudowany Load Balancing między rdzeniami
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }],
};
\`\`\`
Polecenie \`pm2 reload all\` restartuje instancje **jedna po drugiej**, dzięki czemu użytkownicy nie widzą ani sekundy przerwy w działaniu aplikacji (*Zero-Downtime Deployment*).`,
      codeExamples: [
        {
          title: 'Konfiguracja zapory sieciowej UFW na serwerze Ubuntu VPS',
          language: 'bash',
          code: `sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'   # Otwiera porty 80 (HTTP) oraz 443 (HTTPS)
sudo ufw enable`,
          explanation: 'Port 3000 aplikacji Node.js pozostaje zamknięty dla świata zewnętrznego — ruch przechodzi wyłącznie przez bezpieczne proxy Nginx na porcie 443.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Skonfiguruj zaporę UFW', description: 'Zablokuj bezpośredni dostęp z internetu do wewnętrznych portów aplikacji i bazy danych.' },
        { step: 2, title: 'Stwórz plik ecosystem.config.cjs', description: 'Włącz exec_mode: "cluster" oraz instances: "max".' },
        { step: 3, title: 'Zapisz listę procesów na wypadek restartu maszyny', description: 'Uruchom pm2 save oraz pm2 startup.' },
      ],
      interactiveExercise: {
        id: 'ex-devops-4',
        title: 'Konfiguracja klastra PM2 (ecosystem.config)',
        instructions: 'W zakładce JS uzupełnij konfigurację PM2: ustaw exec_mode: "cluster" oraz instances: "max".',
        task: 'Dodaj właściwości exec_mode: "cluster" oraz instances: "max" w konfiguracji JS.',
        starterCode: {
          html: '<div class="pm2-monitor">PM2 Cluster Process Manager: 4 vCPU Active</div>',
          css: '.pm2-monitor { padding: 14px; background: #0f172a; border: 1px solid #38bdf8; color: #e0f2fe; border-radius: 10px; font-family: monospace; }',
          js: 'const pm2Config = {\n  name: "academy-api",\n  // Ustaw exec_mode: "cluster" oraz instances: "max"\n};',
        },
        solutionCode: {
          html: '<div class="pm2-monitor">PM2 Cluster Process Manager: 4 vCPU Active</div>',
          css: '.pm2-monitor { padding: 14px; background: #0f172a; border: 1px solid #38bdf8; color: #e0f2fe; border-radius: 10px; font-family: monospace; }',
          js: 'const pm2Config = {\n  name: "academy-api",\n  exec_mode: "cluster",\n  instances: "max"\n};',
        },
        hints: [
          'Dopisz exec_mode: "cluster".',
          'Dopisz instances: "max".',
        ],
        rules: [
          { id: 'r1', description: 'Tryb exec_mode ustawiony na cluster', ruleType: 'js_contains', target: 'cluster' },
          { id: 'r2', description: 'Liczba instancji ustawiona na max', ruleType: 'js_contains', target: 'max' },
        ],
      },
      independentTask: {
        title: 'Skrypt wdrożeniowy Zero-Downtime',
        instructions: 'Napisz skrypt deploy.sh wykonujący git pull, npm ci, npm run build, npx prisma migrate deploy oraz pm2 reload ecosystem.config.cjs.',
        expectedOutcome: 'Pełne wdrożenie nowej wersji produkcyjnej jedną komendą bez przestoju.',
        starterHint: 'Dodaj flagę set -e na początku skryptu bash, aby przerwać wdrożenie w razie błędu kompilacji.',
      },
      quiz: [
        {
          id: 'q-devops4-1',
          question: 'Czym różni się polecenie "pm2 reload" od "pm2 restart" w trybie klastra?',
          options: [
            'pm2 reload podmienia procesy sekwencyjnie jeden po drugim (Zero-Downtime), natomiast pm2 restart zatrzymuje wszystkie naraz',
            'pm2 reload usuwa bazę danych',
            'pm2 restart działa wyłącznie na systemie Windows',
            'Nie ma między nimi żadnej różnicy',
          ],
          correctAnswer: 0,
          explanation: 'Dzięki pm2 reload zawsze przynajmniej jedna instancja serwera obsługuje ruch podczas aktualizacji.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Przechowywanie sesji użytkowników w zmiennej w pamięci RAM przy włączonym trybie Cluster',
          whyItHappens: 'Każdy proces roboczy (worker) w klastrze ma własną, odizolowaną pamięć RAM.',
          howToFix: 'W architekturze wieloprocesowej sesje i cache trzymamy w zewnętrznym magazynie (Redis lub baza PostgreSQL) albo stosujemy bezstanowe tokeny JWT.',
          badCode: 'const activeSessions = new Map(); // Zginie przy przełączeniu na inny rdzeń CPU!',
          goodCode: 'await redis.set(`session:${id}`, JSON.stringify(sessionData), "EX", 3600);',
        },
      ],
      practicalTask: {
        title: 'Konfiguracja produkcyjna PM2 i UFW',
        brief: 'Przygotuj konfigurację klastra Node.js i reguły zapory ogniowej.',
        steps: ['Napisz plik ecosystem.config.cjs', 'Zdefiniuj reguły UFW dla SSH i Nginx', 'Skonfiguruj rotację logów pm2-logrotate'],
        deliverable: 'Gotowy przepis na stabilny serwer produkcyjny.',
      },
      completionCriteria: ['Zaliczenie ćwiczenia z konfiguracją klastra PM2', 'Wynik min. 80% w quizie'],
    },
  ],

  // Module 14 (Advanced Full Stack): 4th lesson — Microservices, API Gateway, Message Queues & Horizontal Scaling
  14: [
    {
      id: 'next-4',
      moduleId: 14,
      moduleTitle: 'Zaawansowany Full Stack — Next.js, WebSockets i Cache',
      title: 'Architektura Mikrousług, API Gateway, Komunikacja Event-Driven i Skalowanie Horyzontalne',
      slug: 'mikrouslugi-api-gateway-event-driven-skalowanie',
      durationMinutes: 50,
      xpReward: 100,
      order: 4,
      summary: 'Kiedy monolit przestaje wystarczać: jak wydzielać niezależne mikrousługi, projektować bramę API Gateway, komunikować serwisy asynchronicznie przez brokery zdarzeń i skalować system horyzontalnie za Load Balancerem.',
      objectives: [
        'Porównać architekturę Modularnego Monolitu z rozproszonymi Mikrousługami (zalety, koszty i pułapki)',
        'Zrozumieć rolę API Gateway (routing, uwierzytelnianie brzegowe, Rate Limiting, agregacja odpowiedzi)',
        'Projektować bezstanowe serwisy gotowe na skalowanie horyzontalne (Horizontal Auto-Scaling)',
      ],
      prerequisites: ['Next.js i SSR', 'Redis, BullMQ i WebSockets'],
      theoryMarkdown: `Większość udanych startupów zaczyna od **Modularnego Monolitu** — jednej dobrze zorganizowanej aplikacji podzielonej na czyste moduły domenowe (\`auth\`, \`billing\`, \`courses\`). Gdy jednak wybrane części systemu wymagają zupełnie innego skalowania (np. generator wideo obciążający GPU vs prosty serwis profili), wydzielamy **Mikrousługi**.

**Kluczowe elementy architektury rozproszonej:**
1. **API Gateway:** Pojedynczy punkt wejścia dla aplikacji frontendowej. Weryfikuje token JWT, pilnuje limitów zapytań (Rate Limit) i kieruje ruch do odpowiedniego serwisu wewnętrznego.
2. **Database-per-Service:** Każda mikrousługa zarządza własnymi tabelami — żaden serwis nie sięga bezpośrednio do bazy danych innego serwisu!
3. **Komunikacja Event-Driven (Pub/Sub):** Gdy \`BillingService\` zatwierdzi płatność, publikuje zdarzenie \`OrderPaid\`. \`CourseService\` nasłuchuje tego zdarzenia i odblokowuje kurs, a \`EmailService\` wysyła fakturę PDF.`,
      codeExamples: [
        {
          title: 'Wzorzec publikacji i subskrypcji zdarzenia domenowego (Event Bus)',
          language: 'typescript',
          code: `// Billing Service — po udanej płatności publikuje zdarzenie:
await eventBus.publish('order.paid', {
  orderId: 'ord-901',
  userId: 'user-42',
  courseId: 'fullstack-pro',
  timestamp: Date.now(),
});

// Course Service — niezależnie odbiera zdarzenie i nadaje dostęp:
eventBus.subscribe('order.paid', async (event) => {
  await grantCourseAccess(event.userId, event.courseId);
});`,
          explanation: 'Luźne powiązanie (Loose Coupling): serwis płatności nie musi wiedzieć o istnieniu serwisu mailowego ani certyfikatów.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zacznij od Modularnego Monolitu', description: 'Wyznacz czyste granice domenowe wewnątrz jednego repozytorium.' },
        { step: 2, title: 'Zapewnij bezstanowość (Statelessness)', description: 'Nie przechowuj stanu sesji ani plików lokalnie na dysku pojedynczej instancji.' },
        { step: 3, title: 'Wydzielaj wyłącznie wąskie gardła', description: 'Przenieś najbardziej obciążone procesy do osobnych workerów i kolejek.' },
      ],
      interactiveExercise: {
        id: 'ex-next-4',
        title: 'Router bramy API Gateway i publikacja zdarzeń',
        instructions: 'W zakładce JS stwórz obiekt routes mapujący "/api/payments" na serwis płatności oraz wywołaj metodę publish("order.paid").',
        task: 'Zdefiniuj ścieżkę /api/payments oraz wywołanie publish("order.paid") w JS.',
        starterCode: {
          html: '<div class="gateway-box">API Gateway -> [AuthService, BillingService, CourseService]</div>',
          css: '.gateway-box { padding: 14px; background: #0f172a; border: 1px solid #a855f7; color: #f3e8ff; border-radius: 10px; font-family: monospace; }',
          js: '// Zdefiniuj routing "/api/payments" oraz wywołaj eventBus.publish("order.paid")\n',
        },
        solutionCode: {
          html: '<div class="gateway-box">API Gateway -> [AuthService, BillingService, CourseService]</div>',
          css: '.gateway-box { padding: 14px; background: #0f172a; border: 1px solid #a855f7; color: #f3e8ff; border-radius: 10px; font-family: monospace; }',
          js: 'const routes = { "/api/payments": "http://billing-service:4001" };\nconst eventBus = { publish: (topic) => console.log("Published:", topic) };\neventBus.publish("order.paid");',
        },
        hints: [
          'Umieść w kodzie JS ciąg "/api/payments".',
          'Wywołaj publish("order.paid").',
        ],
        rules: [
          { id: 'r1', description: 'Zdefiniowano trasę /api/payments', ruleType: 'js_contains', target: '/api/payments' },
          { id: 'r2', description: 'Opublikowano zdarzenie order.paid', ruleType: 'js_contains', target: 'order.paid' },
        ],
      },
      independentTask: {
        title: 'Wzorzec Circuit Breaker i Idempotentny Konsument Zdarzeń',
        instructions: 'Zabezpiecz subskrybenta zdarzenia order.paid przed dwukrotnym przetworzeniem tej samej wiadomości z kolejki.',
        expectedOutcome: 'Pełna idempotentność przy ponawianiu dostarczania wiadomości (At-Least-Once Delivery).',
        starterHint: 'Zapisuj przetworzony eventId w tabeli processed_events z unikalnym kluczem.',
      },
      quiz: [
        {
          id: 'q-next4-1',
          question: 'Czym różni się skalowanie horyzontalne (Horizontal Scaling) od wertykalnego (Vertical Scaling)?',
          options: [
            'Skalowanie horyzontalne polega na dokładaniu kolejnych instancji serwerów za Load Balancerem, a wertykalne na zwiększaniu RAM/CPU jednej maszyny',
            'Skalowanie horyzontalne zmienia bazę SQL na plik tekstowy',
            'Skalowanie wertykalne wymaga przepisania aplikacji na C++',
            'Oba pojęcia oznaczają to samo',
          ],
          correctAnswer: 0,
          explanation: 'Skalowanie horyzontalne pozwala obsłużyć niemal nieograniczony ruch i zapewnia wysoką dostępność (High Availability) w razie awarii jednej z maszyn.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Budowanie „Rozproszonego Monolitu” (synchroniczny łańcuch 10 wywołań HTTP między serwisami)',
          whyItHappens: 'Zastąpienie wywołań funkcji bezpośrednimi żądaniami REST między każdym serwisem.',
          howToFix: 'Komunikuj procesy domenowe asynchronicznie przez zdarzenia i kolejki, aby chwilowa niedostępność jednego serwisu nie położyła całego systemu.',
          badCode: '// Serwis A czeka synchronicznie na B, B czeka na C, C czeka na D...',
          goodCode: 'await messageQueue.add("order.created", payload); // Natychmiastowa odpowiedź 202 Accepted',
        },
      ],
      practicalTask: {
        title: 'Projekt architektury System Design dla platformy e-learningowej',
        brief: 'Rozrysuj przepływ danych między API Gateway, serwisem płatności i workerem certyfikatów.',
        steps: ['Wyznacz granice odpowiedzialności serwisów', 'Zaprojektuj kontrakt zdarzenia OrderPaid', 'Zaplanuj strategię skalowania i cache w Redisie'],
        deliverable: 'Kompletny diagram i specyfikacja architektury.',
      },
      completionCriteria: ['Zaliczenie ćwiczenia z API Gateway i Event Bus', 'Wynik min. 80% w quizie'],
    },
  ],

  // Module 15 (Career & Interviews): 4th lesson — Algorithms, Big-O, HashMap & Code Refactoring on Live Coding
  15: [
    {
      id: 'career-4',
      moduleId: 15,
      moduleTitle: 'Portfolio, Rozmowy Rekrutacyjne i Kariera',
      title: 'Algorytmy i Struktury Danych na Live Coding: Złożoność Big-O, HashMap i Refaktoryzacja',
      slug: 'algorytmy-struktury-danych-big-o-hashmap-live-coding',
      durationMinutes: 50,
      xpReward: 100,
      order: 4,
      summary: 'Jak bez stresu rozwiązywać zadania algorytmiczne i refaktoryzacyjne na rozmowie technicznej: szacowanie złożoności czasowej O(n) vs O(n²), zamiana zagnieżdżonych pętli na słownik Map/Set oraz komunikacja toku myślenia z rekruterem.',
      objectives: [
        'Oceniać złożoność czasową (Time Complexity) i pamięciową (Space Complexity) w notacji Big-O',
        'Optymalizować algorytmy z O(n²) do O(n) przy użyciu struktur Map oraz Set',
        'Przeprowadzać czystą refaktoryzację zastanego kodu (Early Return, nazewnictwo, eliminacja duplikacji)',
      ],
      prerequisites: ['Symulator Live Coding', 'Tablice i obiekty w JavaScript/TypeScript'],
      theoryMarkdown: `Na rozmowie technicznej rekruter nie szuka osoby, która wykuła na pamięć 500 zagadek, lecz inżyniera, który **głośno komunikuje tok myślenia**, potrafi zauważyć wąskie gardło wydajnościowe i pisze czytelny kod.

**Złota zasada optymalizacji na Live Coding (\`O(n²)\` $\\rightarrow$ \`O(n)\`):**
Gdy widzisz pętlę w pętli (\`for\` wewnątrz \`for\` lub \`.find()\` wewnątrz \`.map()\`), dla 10 000 elementów program wykona **100 000 000 operacji** (\`O(n²)\`).
Zastępując wewnętrzne wyszukiwanie słownikiem **\`new Map()\`** lub zbiorem **\`new Set()\`** (czas odczytu \`O(1)\`), redukujesz cały algorytm do jednego przebiegu **\`O(n)\`**!

\`\`\`ts
// Wolne O(n²) — .includes() wewnątrz pętli:
const duplicates = items.filter((item, index) => items.indexOf(item) !== index);

// Błyskawiczne O(n) z użyciem Set:
function findDuplicates<T>(items: T[]): T[] {
  const seen = new Set<T>();
  const duplicates = new Set<T>();
  for (const item of items) {
    if (seen.has(item)) duplicates.add(item);
    else seen.add(item);
  }
  return Array.from(duplicates);
}
\`\`\``,
      codeExamples: [
        {
          title: 'Klasyczne zadanie rekrutacyjne Two Sum w czasie liniowym O(n)',
          language: 'typescript',
          code: `export function twoSum(nums: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>(); // wartość -> indeks
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }
    seen.set(nums[i], i);
  }
  return null;
}`,
          explanation: 'Zamiast porównywać każdy element z każdym w dwóch pętlach O(n²), pamiętamy odwiedzone liczby w obiekcie Map i rozwiązujemy zadanie w jednym przejściu O(n).',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Doprecyzuj wymagania i przypadki brzegowe (Edge Cases)', description: 'Zapytaj co funkcja ma zwrócić dla pustej tablicy lub duplikatów.' },
        { step: 2, title: 'Zaproponuj najpierw proste rozwiązanie (Brute Force)', description: 'Pokaż, że rozumiesz problem, i określ jego złożoność np. O(n²).' },
        { step: 3, title: 'Zoptymalizuj z użyciem Map / Set do O(n)', description: 'Wyjaśnij kompromis: zużywamy O(n) pamięci, aby zyskać czas O(n).' },
      ],
      interactiveExercise: {
        id: 'ex-career-4',
        title: 'Optymalizacja algorytmu z użyciem Map i Set (O(n))',
        instructions: 'W zakładce JS wykorzystaj strukturę new Map() oraz new Set() do zoptymalizowania wyszukiwania elementów w czasie O(1).',
        task: 'Utwórz instancje new Map() oraz new Set() w kodzie JavaScript.',
        starterCode: {
          html: '<div class="algo-bench">Benchmark algorytmu: O(n²) -> O(n) (0.4ms)</div>',
          css: '.algo-bench { padding: 14px; background: #0f172a; border: 1px solid #f59e0b; color: #fef3c7; border-radius: 10px; font-family: monospace; }',
          js: '// Zastosuj new Map() oraz new Set() do indeksowania danych w czasie liniowym O(n)\n',
        },
        solutionCode: {
          html: '<div class="algo-bench">Benchmark algorytmu: O(n²) -> O(n) (0.4ms)</div>',
          css: '.algo-bench { padding: 14px; background: #0f172a; border: 1px solid #f59e0b; color: #fef3c7; border-radius: 10px; font-family: monospace; }',
          js: 'const lookupMap = new Map();\nconst uniqueIds = new Set([1, 2, 3]);\nlookupMap.set("user-1", { xp: 500 });\nconsole.log(lookupMap.get("user-1"), uniqueIds.has(2));',
        },
        hints: [
          'Użyj w kodzie JS konstrukcji new Map().',
          'Użyj w kodzie JS konstrukcji new Set().',
        ],
        rules: [
          { id: 'r1', description: 'Użyto struktury new Map()', ruleType: 'js_contains', target: 'new Map(' },
          { id: 'r2', description: 'Użyto struktury new Set()', ruleType: 'js_contains', target: 'new Set(' },
        ],
      },
      independentTask: {
        title: 'Refaktoryzacja zagnieżdżonych instrukcji if/else (Guard Clauses)',
        instructions: 'Przepisz funkcję z 4 poziomami zagnieżdżenia if/else na płaskie warunki strażnicze (Early Return).',
        expectedOutcome: 'Kod czytelny od góry do dołu bez tzw. Arrow Anti-Pattern.',
        starterHint: 'Sprawdzaj warunki błędu na samym początku funkcji i od razu wychodź przez return.',
      },
      quiz: [
        {
          id: 'q-career4-1',
          question: 'Jaka jest złożoność czasowa wyszukania klucza metodą .get(key) lub .has(key) w strukturze Map / Set w JavaScript?',
          options: [
            'Średnio O(1) — czas stały, niezależny od liczby elementów w kolekcji',
            'O(n²) — czas kwadratowy',
            'O(n) — wymaga przeszukania wszystkich elementów po kolei jak w tablicy',
            'O(n!) — czas silniowy',
          ],
          correctAnswer: 0,
          explanation: 'Struktury Map i Set są oparte na tablicach mieszających (Hash Tables), co zapewnia dostęp w czasie stałym O(1).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Wywoływanie array.find() wewnątrz array.map() dla dużych zbiorów danych',
          whyItHappens: 'Łączenie dwóch tablic (np. 5000 zamówień i 5000 użytkowników) w sposób naiwny.',
          howToFix: 'Najpierw zamień drugą tablicę na Mapę (const usersById = new Map(users.map(u => [u.id, u]))), a potem w .map() pobieraj użytkownika przez usersById.get(order.userId) w czasie O(1).',
          badCode: 'orders.map(o => ({ ...o, user: users.find(u => u.id === o.userId) })) // O(n * m)!',
          goodCode: 'const userMap = new Map(users.map(u => [u.id, u]));\norders.map(o => ({ ...o, user: userMap.get(o.userId) })); // O(n + m)!',
        },
      ],
      practicalTask: {
        title: 'Rozwiązanie 3 zadań w Symulatorze Live Coding',
        brief: 'Przejdź do zakładki Live Coding (Egzamin) i rozwiąż zadania z użyciem stosu, reduce i domknięć.',
        steps: ['Analizuj przypadki brzegowe', 'Zastosuj optymalną strukturę danych', 'Uruchom testy automatyczne'],
        deliverable: 'Zaliczone zadania rekrutacyjne z wynikiem 100% testów.',
      },
      completionCriteria: ['Zaliczenie ćwiczenia z Map i Set', 'Wynik min. 80% w quizie'],
    },
  ],
};
