import { EditorialGuide } from '../utils/guides';

export const GUIDES_PART_1: EditorialGuide[] = [
  {
    slug: 'jak-zostac-full-stack-developerem-plan-nauki',
    title: 'Jak zostać Full Stack Developerem od zera w 2026: konkretny plan nauki na 6 miesięcy',
    titleEn: 'How to Become a Full Stack Developer from Scratch in 2026: A Practical 6-Month Study Plan',
    subtitle: 'Realistyczna mapa nauki tydzień po tygodniu bez skakania między tutorialami — kolejność technologii, czas nauki, projekty do portfolio oraz wymagania rekruterów.',
    subtitleEn: 'A realistic week-by-week roadmap without tutorial hell — technology order, weekly time budgets, portfolio projects, and hiring expectations.',
    metaDescription: 'Kompletny, realistyczny plan nauki programowania Full Stack na 6 miesięcy: HTML5, CSS3, JavaScript, TypeScript, React, Node.js, PostgreSQL, Docker i portfolio na GitHubie.',
    category: 'Ścieżka Kariery',
    categoryEn: 'Career Path',
    publishedAt: '2026-10-12',
    updatedAt: '2026-11-28',
    authorName: 'Zespół Redakcyjny Full Stack Developer Academy',
    authorRole: 'Inżynieria Oprogramowania i Metodyka Nauczania',
    level: 'Początkujący',
    levelEn: 'Beginner',
    leadParagraphs: [
      'Większość osób zaczynających naukę programowania nie odpada dlatego, że kod jest dla nich za trudny. Odpadają dlatego, że próbują uczyć się jednocześnie pięciu frameworków, oglądają dziesiątki godzin pasywnych kursów wideo i po trzech miesiącach nadal nie potrafią samodzielnie zbudować działającej aplikacji od pustego folderu aż po wdrożenie na serwer. Zjawisko to określa się w branży jako tutorial hell — złudne poczucie postępu wynikające z przepisywania kodu za instruktorem bez rozumienia decyzji architektonicznych.',
      'Rola Full Stack Developera w 2026 roku nie polega na pamiętaniu na pamięć każdego parametru wszystkich bibliotek świata. Polega na rozumieniu pełnego przepływu danych w aplikacji webowej: od semantycznego interfejsu w przeglądarce, przez zapytania HTTP i walidację na serwerze, aż po relacyjną bazę danych, kontrolę dostępu i automatyczne wdrożenie. Poniższy przewodnik układa ten proces w sprawdzony, sześciomiesięczny plan działania przy założeniu 10 do 14 godzin systematycznej pracy tygodniowo.',
    ],
    sections: [
      {
        id: 'dlaczego-kolejnosc-ma-znaczenie',
        heading: 'Dlaczego kolejność technologii decyduje o tym, czy wytrwasz',
        paragraphs: [
          'Najczęstszy błąd początkujących to wejście w Reacta albo Next.js w drugim tygodniu nauki, zanim jeszcze zrozumieją, jak przeglądarka buduje drzewo DOM, czym różni się żądanie GET od POST i dlaczego funkcje asynchroniczne w JavaScript nie blokują interfejsu. Bez fundamentów każdy komunikat błędu w konsoli wygląda jak czarna magia, a debugowanie zamienia się w losowe wklejanie poprawek.',
          'Skuteczna ścieżka edukacyjna przypomina budowę domu: najpierw stawiasz strukturę dokumentu i układ wizualny (HTML5 + CSS3), potem uczysz się logiki i operacji na danych w czystym JavaScript oraz TypeScript, a dopiero na solidnym fundamencie nakładasz bibliotekę komponentów (React), środowisko serwerowe (Node.js) i relacyjną bazę danych (PostgreSQL). Dzięki temu każdy kolejny temat rozwiązuje realny problem, którego wcześniej doświadczyłeś ręcznie — i od razu rozumiesz, po co dane narzędzie powstało.',
          'Warto też od pierwszego tygodnia pracować w krótkich pętlach praktycznych. Reguła 30 na 70 sprawdza się najlepiej: maksymalnie 30 procent czasu poświęcasz na czytanie dokumentacji lub lekcji, a co najmniej 70 procent na pisanie kodu, celowe psucie przykładów, sprawdzanie komunikatów błędów oraz budowanie drobnych, samodzielnych funkcji. Jeśli po obejrzeniu materiału nie potrafisz zamknąć notatek i odtworzyć rozwiązania z pamięci po swojemu, temat wymaga jeszcze jednego ćwiczenia.',
        ],
        table: {
          caption: 'Sześciomiesięczny harmonogram nauki Full Stack (10–14 godzin tygodniowo)',
          headers: ['Etap', 'Zakres technologii', 'Czas', 'Projekt weryfikujący umiejętności'],
          rows: [
            ['Miesiąc 1', 'HTML5, WCAG, CSS3, Flexbox, Grid, RWD, Git', '4 tygodnie', 'Responsywna strona firmowa i portfolio z formularzem'],
            ['Miesiąc 2', 'JavaScript ES2025, DOM, Fetch API, async/await', '4 tygodnie', 'Interaktywna aplikacja budżetowa z zapisem lokalnym i API'],
            ['Miesiąc 3', 'TypeScript, React 19, stan aplikacji, routing, testy', '4 tygodnie', 'Panel zarządzania zadaniami z filtrami i walidacją formularzy'],
            ['Miesiąc 4', 'Node.js, Express, REST API, walidacja, autoryzacja JWT', '4 tygodnie', 'Własne API dla systemu rezerwacji z rolami użytkowników'],
            ['Miesiąc 5', 'PostgreSQL, SQL JOIN, indeksy, transakcje, bezpieczeństwo OWASP', '4 tygodnie', 'Pełna aplikacja Full Stack z bazą danych i kontami'],
            ['Miesiąc 6', 'Docker, CI/CD GitHub Actions, wdrożenie, testy, CV i rekrutacja', '4 tygodnie', 'Produkcyjne wdrożenie 2–3 projektów i symulacje rozmów'],
          ],
        },
      },
      {
        id: 'miesiac-1-i-2-fundamenty-webu',
        heading: 'Miesiąc 1 i 2: Semantyczny HTML, nowoczesny CSS i solidny JavaScript',
        paragraphs: [
          'W pierwszym miesiącu Twoim celem jest swobodne przekładanie makiety na czystą, dostępną i responsywną stronę internetową. Oznacza to świadome używanie znaczników semantycznych takich jak header, nav, main, article, section oraz footer zamiast budowania wszystkiego na zagnieżdżonych elementach div. Semantyka bezpośrednio wpływa na pozycjonowanie w Google, działanie czytników ekranu oraz czytelność kodu dla zespołu.',
          'W CSS nie trać tygodni na historyczne techniki z float i ręcznym pozycjonowaniem kolumn. Skup się na trzech filarach współczesnego stylowania: modelu pudełkowym (box-sizing: border-box), układzie jednowymiarowym Flexbox oraz siatce dwuwymiarowej CSS Grid. Dołożenie zmiennych CSS (custom properties) oraz podejścia mobile-first pozwoli Ci tworzyć interfejsy działające równie dobrze na smartfonie o szerokości 360 pikseli, jak i na monitorze 4K.',
          'Drugi miesiąc należy w całości do czystego JavaScriptu. Naucz się operować na tablicach za pomocą metod map, filter i reduce bez mutowania oryginalnych danych, opanuj destrukturyzację, moduły ES oraz obsługę zdarzeń. Kluczowym momentem przełomowym jest zrozumienie asynchroniczności: jak działają obietnice (Promise), słowo kluczowe async/await, obsługa błędów przez try/catch oraz pobieranie danych z zewnętrznego REST API przez fetch z weryfikacją statusu response.ok.',
        ],
        codeSnippet: {
          title: 'Przykład czystego pobierania danych z walidacją statusu i kontrolą błędów',
          language: 'javascript',
          code: `async function fetchCourseLessons(moduleSlug, signal) {
  const response = await fetch(\`/api/modules/\${encodeURIComponent(moduleSlug)}/lessons\`, {
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(\`Nie udało się pobrać lekcji (HTTP \${response.status})\`);
  }

  const payload = await response.json();
  return Array.isArray(payload.lessons) ? payload.lessons : [];
}`,
          caption: 'Nawyk sprawdzania response.ok i przekazywania AbortSignal oszczędza dziesiątki godzin debugowania w React i Node.js.',
        },
      },
      {
        id: 'miesiac-3-typescript-i-react',
        heading: 'Miesiąc 3: TypeScript i nowoczesna architektura w React',
        paragraphs: [
          'W 2026 roku TypeScript przestał być dodatkiem opcjonalnym — stał się domyślnym językiem projektów frontendowych i większości nowoczesnych backendów w ekosystemie Node.js. Wprowadzenie typów na trzecim miesiącu nauki daje ogromną korzyść dydaktyczną: edytor kodu na bieżąco pokazuje błędy w strukturze obiektów, brakujące pola i niezgodności typów zanim jeszcze uruchomisz przeglądarkę.',
          'Przechodząc do Reacta, skup się na myśleniu komponentowym i jednokierunkowym przepływie danych. Zamiast uczyć się przestarzałych komponentów klasowych, buduj proste komponenty funkcyjne, wydzielaj powtarzalną logikę do własnych hooków (custom hooks) i naucz się odróżniać stan lokalny formularza od stanu współdzielonego oraz danych pochodzących z serwera. Jednym z najważniejszych nawyków jest unikanie zbędnych wywołań useEffect tam, gdzie wartość można po prostu wyliczyć w trakcie renderowania.',
          'Już na tym etapie napisz pierwsze testy jednostkowe logiki biznesowej (np. kalkulatora cen, walidatora formularza albo filtrów wyszukiwania). Oddzielenie czystych funkcji TypeScript od warstwy widoków React sprawi, że Twój kod będzie wyglądał jak kod komercyjny, a nie przypadkowy skrypt z kursu.',
        ],
        bulletPoints: [
          'Typuj wejścia i wyjścia funkcji biznesowych oraz odpowiedzi z API bez używania typu any.',
          'Dziel widok na małe, odpowiedzialne za jedną rzecz komponenty zamiast jednego pliku na 1500 linii.',
          'Obsługuj cztery stany każdego widoku z danymi: ładowanie, wynik, stan pusty oraz komunikat błędu.',
          'Stosuj poprawne klucze (key) w listach oparte na stabilnym identyfikatorze rekordu, nigdy na indeksie przy sortowaniu lub usuwaniu.',
        ],
      },
      {
        id: 'miesiac-4-i-5-backend-i-bazy-danych',
        heading: 'Miesiąc 4 i 5: Backend w Node.js, REST API, PostgreSQL i bezpieczeństwo',
        paragraphs: [
          'Moment, w którym łączysz swój frontend z własnym serwerem HTTP i prawdziwą bazą danych, zmienia Cię z osoby klejącej widoki w inżyniera Full Stack. Zacznij od zrozumienia protokołu HTTP w praktyce: metod GET, POST, PUT, PATCH i DELETE, kodów statusu (200, 201, 204, 400, 401, 403, 404, 409, 500) oraz nagłówków Content-Type, Authorization i Cache-Control.',
          'Na backendzie w Node.js z Express kluczowa jest dyscyplina warstwowa i zasada zerowego zaufania do danych od klienta. Każde żądanie przychodzące do API musi zostać zwalidowane po stronie serwera — walidacja w formularzu HTML służy wyłącznie wygodzie użytkownika, nigdy bezpieczeństwu. Naucz się bezpiecznego haszowania haseł (bcrypt lub Argon2), podpisywania sesji i tokenów oraz sprawdzania uprawnień dostępu do zasobów (ochrona przed IDOR, czyli sytuacją, w której użytkownik A podgląda fakturę użytkownika B po zmianie numeru w adresie URL).',
          'W piątym miesiącu poświęć pełną uwagę bazom relacyjnym na przykładzie PostgreSQL. Nawet jeśli w pracy skorzystasz z ORM takiego jak Prisma lub Drizzle, musisz umieć napisać czyste zapytania SELECT z JOIN, GROUP BY i agregacjami, rozumieć klucze obce (FOREIGN KEY), ograniczenia unikalności (UNIQUE), transakcje ACID oraz wpływ indeksów B-Tree na wydajność zapytań. To jeden z najczęściej weryfikowanych obszarów na rozmowach technicznych.',
        ],
      },
      {
        id: 'miesiac-6-devops-portfolio-i-rekrutacja',
        heading: 'Miesiąc 6: Docker, CI/CD, realne portfolio i przygotowanie do pierwszej pracy',
        paragraphs: [
          'Aplikacja, która działa wyłącznie na localhost, w oczach rekrutera właściwie nie istnieje. Ostatni miesiąc przeznacz na spakowanie swojej flagowej aplikacji w kontener Docker (multi-stage Dockerfile), skonfigurowanie prostego pipeline w GitHub Actions uruchamiającego automatycznie testy i sprawdzanie typów TypeScript przy każdym pushu oraz publiczne wdrożenie projektu w sieci wraz z czytelnym plikiem README.',
          'Zamiast umieszczać na GitHubie dwadzieścia klonów aplikacji To-Do i kalkulatora z poradników na YouTube, przygotuj dwa lub trzy dopracowane projekty rozwiązujące konkretny problem domenowy: na przykład system rezerwacji wizyt z panelem administratora, aplikację do śledzenia finansów z wykresami i eksportem CSV albo platformę edukacyjną z kontami użytkowników. Każdy projekt powinien mieć zrzut ekranu, opis architektury, schemat bazy danych, listę podjętych kompromisów technicznych oraz działające demo online.',
          'Na koniec przećwicz głośne tłumaczenie własnego kodu. Podczas rozmowy technicznej rekruter rzadko szuka encyklopedycznej definicji — sprawdza, czy potrafisz logicznie zdiagnozować błąd, wyjaśnić dlaczego wybrałeś relacyjną bazę zamiast NoSQL oraz jak zabezpieczyłbyś endpoint przed nieautoryzowanym dostępem.',
        ],
      },
    ],
    keyTakeaways: [
      'Ucz się w kolejności: HTML/CSS → czysty JS → TypeScript i React → Node.js/API → PostgreSQL i bezpieczeństwo → Docker i wdrożenie.',
      'Stosuj proporcję 30% teorii do 70% samodzielnego pisania kodu i debugowania bez podglądania gotowca.',
      'Dwa dopracowane, wdrożone projekty Full Stack z testami i czytelnym README są warte więcej niż piętnaście klonów z kursów wideo.',
      'Każdy endpoint backendowy musi walidować dane wejściowe i weryfikować uprawnienia użytkownika po stronie serwera.',
    ],
    faq: [
      {
        question: 'Czy można zostać Full Stack Developerem bez studiów informatycznych?',
        answer: 'Tak. Na rynku komercyjnym decydują udokumentowane umiejętności: jakość kodu na GitHubie, wdrożone projekty Full Stack, znajomość podstaw sieci/SQL/bezpieczeństwa oraz sposób rozwiązywania problemów podczas rozmowy technicznej.',
      },
      {
        question: 'Ile godzin dziennie trzeba poświęcić na naukę, żeby osiągnąć poziom Juniora w 6 miesięcy?',
        answer: 'Minimum realistyczne to 1,5 do 2 godzin dziennie (10–14 godzin tygodniowo) utrzymywane konsekwentnie bez wielotygodniowych przerw. Przy 5–6 godzinach tygodniowo ten sam program zajmie około 10–12 miesięcy i również jest w pełni osiągalny.',
      },
      {
        question: 'Czy najpierw lepiej opanować Frontend czy Backend?',
        answer: 'Najłatwiej zacząć od Frontendu (HTML, CSS, JavaScript), ponieważ efekt każdej linijki kodu widać natychmiast w przeglądarce. Po zbudowaniu podstaw UI przejście do Node.js pozwala wykorzystać ten sam język (JavaScript/TypeScript) po stronie serwera.',
      },
    ],
    relatedLessonIds: ['fund-1', 'html-7', 'js-1', 'react-1', 'node-1', 'db-1'],
    relatedGuideSlugs: [
      'javascript-event-loop-async-await-kompendium',
      'react-19-architektura-stanu-i-wydajnosc',
      'postgresql-indeksy-join-optymalizacja-zapytan',
    ],
  },
  {
    slug: 'html5-semantyka-dostepnosc-wcag-przewodnik',
    title: 'Semantyczny HTML5 i dostępność WCAG 2.2 w praktyce: przewodnik dla twórców aplikacji webowych',
    titleEn: 'Semantic HTML5 and WCAG 2.2 Accessibility in Practice: A Web Engineer Guide',
    subtitle: 'Dlaczego natywne znaczniki HTML wygrywają z div-soup, jak poprawnie budować hierarchię nagłówków, formularze i nawigację klawiaturą oraz jak wpływa to na SEO.',
    subtitleEn: 'Why native HTML landmarks beat div-soup, how to structure headings, forms, and keyboard navigation properly, and why it boosts SEO.',
    metaDescription: 'Praktyczny poradnik semantycznego HTML5 i dostępności WCAG 2.2: landmarki, formularze, ARIA, nawigacja klawiaturą, kontrast kolorów i audyt SEO.',
    category: 'Frontend',
    categoryEn: 'Frontend',
    publishedAt: '2026-10-16',
    updatedAt: '2026-11-28',
    authorName: 'Zespół Redakcyjny Full Stack Developer Academy',
    authorRole: 'Frontend Architecture & Accessibility',
    level: 'Początkujący',
    levelEn: 'Beginner',
    leadParagraphs: [
      'Przeglądarka internetowa potrafi wyświetlić niemal dowolny bałagan znaczników: klikalny element div ostylowany na przycisk, akapit udający nagłówek dzięki powiększonej czcionce i tabelę złożoną z dziesiątek anonimowych kontenerów. Na ekranie młodego programisty pracującego myszką taka strona może wyglądać poprawnie. Problem pojawia się natychmiast, gdy stronę otwiera użytkownik nawigujący klawiaturą, osoba korzystająca z czytnika ekranu NVDA lub VoiceOver, wyszukiwarka Google analizująca strukturę dokumentu albo sam autor wracający do kodu po pół roku.',
      'Semantyczny HTML5 i standard dostępności WCAG 2.2 (oraz europejski akt o dostępności EAA obowiązujący w usługach cyfrowych) nie są biurokratycznym dodatkiem na koniec projektu. Dobrze napisany HTML daje ogromną liczbę funkcji za darmo: obsługę klawiszy Enter i Spacja na przyciskach, prawidłowe przenoszenie fokusu, podpowiedzi autouzupełniania na urządzeniach mobilnych oraz czytelny sygnał dla algorytmów indeksujących, która część dokumentu jest głównym artykułem, a która nawigacją.',
    ],
    sections: [
      {
        id: 'landmarki-i-struktura-dokumentu',
        heading: 'Landmarki HTML5 i żelazna zasada hierarchii nagłówków',
        paragraphs: [
          'Punkty orientacyjne strony, czyli tak zwane landmarki, pozwalają użytkownikom technologii asystujących oraz robotom indeksującym błyskawicznie przeskakiwać między kluczowymi obszarami witryny. Każda dobrze zbudowana podstrona powinna zawierać dokładnie jeden główny kontener main obejmujący unikalną treść danej podstrony, otoczony przez nagłówek serwisu header, oznaczone etykietą regiony nawigacji nav oraz stopkę footer. Jeżeli na stronie występują dwie osobne nawigacje (na przykład menu główne i okruszki breadcrumbs), każda z nich powinna otrzymać własny atrybut aria-label opisujący jej rolę.',
          'Równie istotna jest logiczna drabina nagłówków od h1 do h6. Na stronie powinien istnieć jeden wyraźny nagłówek h1 opisujący główny temat dokumentu, a kolejne poziomy nie powinny przeskakiwać szczebli (na przykład z h2 od razu na h4 tylko dlatego, że mniejszy rozmiar fontu lepiej pasował wizualnie). Wielkość tekstu zawsze regulujemy w CSS, nigdy wyborem poziomu nagłówka.',
          'Częste nieporozumienie dotyczy różnicy między section a article. Element article reprezentuje samodzielną jednostkę treści, która zachowuje sens nawet po wyrwaniu z kontekstu strony i osadzeniu w czytniku RSS (na przykład wpis blogowy, poradnik, karta produktu lub komentarz). Element section grupuje powiązany tematycznie fragment większej całości i co do zasady powinien posiadać własny nagłówek h2 lub h3.',
        ],
        codeSnippet: {
          title: 'Przykładowy, w pełni semantyczny szkielet podstrony artykułu',
          language: 'html',
          code: `<body>
  <a href="#main-content" class="skip-link">Przejdź do głównej treści</a>

  <header>
    <a href="/">Full Stack Academy</a>
    <nav aria-label="Nawigacja główna">
      <ul>
        <li><a href="/poradniki">Poradniki</a></li>
        <li><a href="/baza-wiedzy">Baza wiedzy</a></li>
        <li><a href="/o-nas">O nas</a></li>
      </ul>
    </nav>
  </header>

  <main id="main-content">
    <article>
      <header>
        <h1>Semantyczny HTML5 w praktyce</h1>
        <p>Opublikowano: <time datetime="2026-10-16">16 października 2026</time></p>
      </header>
      <section aria-labelledby="sec-formularze">
        <h2 id="sec-formularze">Dostępne formularze</h2>
        <p>Każde pole wejściowe musi posiadać powiązaną etykietę label.</p>
      </section>
    </article>
  </main>

  <footer>
    <p>© 2026 Full Stack Developer Academy</p>
  </footer>
</body>`,
          caption: 'Link skip-link na początku body pozwala użytkownikom klawiatury pominąć powtarzalne menu na każdej podstronie.',
        },
      },
      {
        id: 'button-kontra-link-i-klawiatura',
        heading: 'Przycisk kontra link — najczęstszy błąd interaktywności w aplikacjach SPA',
        paragraphs: [
          'Jedna z najbardziej kosztownych pomyłek w aplikacjach React polega na zamiennym stosowaniu znaczników a, button i klikalnego div. Zasada rozróżnienia jest bardzo prosta i jednoznaczna: jeżeli kliknięcie przenosi użytkownika pod inny adres URL lub kotwicę w dokumencie (i powinno dać się otworzyć środkowym przyciskiem myszy w nowej karcie), używasz znacznika a z poprawnym atrybutem href. Jeżeli kliknięcie wykonuje akcję w bieżącym interfejsie — otwiera okno modalne, wysyła formularz, przełącza motyw albo usuwa element z listy — używasz natywnego elementu button z jawnym atrybutem type="button" lub type="submit".',
          'Klikalny element div bez ręcznie dopisanego tabIndex, roli ARIA oraz obsługi klawiszy Enter i Space wyklucza użytkowników klawiatury i psuje automatyczne testy dostępności. Jeszcze groźniejszym błędem jest usuwanie obrysu fokusu regułą outline: none bez zapewnienia alternatywnego stylu :focus-visible. Nowoczesna pseudoklasa :focus-visible rozwiązuje dawny dylemat projektantów: ukrywa ramkę przy kliknięciu myszką, ale wyraźnie podświetla aktywny element podczas nawigacji klawiszem Tab.',
        ],
        table: {
          caption: 'Dobór właściwego elementu HTML i atrybutów dla typowych komponentów UI',
          headers: ['Komponent', 'Prawidłowy znacznik', 'Kluczowe atrybuty', 'Typowy błąd do uniknięcia'],
          rows: [
            ['Nawigacja do podstrony', '<a href="/poradniki">', 'href, rel przy _blank', 'Używanie <button onClick={navigate}> zamiast linku'],
            ['Akcja w formularzu / modal', '<button type="button">', 'type, disabled, aria-expanded', 'Klikalny <div> lub brak type="button" wewnątrz <form>'],
            ['Pole tekstowe', '<label> + <input>', 'for/id, autocomplete, aria-describedby', 'Zastępowanie etykiety samym placeholderem'],
            ['Obraz informacyjny', '<img src="..." alt="...">', 'opisowy alt, width, height', 'Pusty lub ogólny alt="obrazek1.png"'],
            ['Ikona czysto dekoracyjna', '<svg aria-hidden="true">', 'aria-hidden="true", focusable="false"', 'Brak tekstu alternatywnego przy przycisku z samą ikoną'],
          ],
        },
      },
      {
        id: 'formularze-bledy-i-kontrast',
        heading: 'Dostępne formularze, obsługa błędów walidacji i kontrast WCAG',
        paragraphs: [
          'Formularz kontaktowy, rejestracyjny albo koszyk w sklepie to miejsce, gdzie błędy dostępności bezpośrednio obniżają konwersję. Placeholder wewnątrz pola tekstowego nigdy nie zastępuje etykiety label — znika w chwili rozpoczęcia wpisywania, ma zwykle zbyt niski kontrast i nie jest stabilnie odczytywany przez czytniki ekranu. Każde pole powinno mieć widoczny element label powiązany przez atrybuty for i id.',
          'Komunikaty błędów walidacji nie mogą polegać wyłącznie na zmianie koloru obramowania na czerwony, ponieważ około 8 procent mężczyzn ma zaburzenia widzenia barw. Komunikat błędu powinien być wyrażony konkretnym tekstem (na przykład "Wpisz poprawny adres e-mail zawierający znak @"), połączony z polem przez atrybut aria-describedby oraz oznaczony atrybutem aria-invalid="true" na samym polu. Dodanie roli role="alert" sprawia, że czytnik ekranu natychmiast ogłosi błąd po nieudanym wysłaniu formularza.',
          'W zakresie kolorystyki norma WCAG 2.2 AA wymaga współczynnika kontrastu co najmniej 4.5:1 dla zwykłego tekstu oraz 3:1 dla dużych nagłówków (od 24px lub 18.66px pogrubionych) i kluczowych krawędzi pól formularza. Na ciemnych motywach warto unikać bardzo ciemnych szarości tekstu (np. #475569 na tle #06080E), które wyglądają efektownie na jasnym monitorze studyjnym, ale stają się nieczytelne na telefonie w słońcu.',
        ],
      },
      {
        id: 'aria-pierwsza-zasada-i-audyt',
        heading: 'Pierwsza zasada ARIA oraz praktyczna checklista przed wdrożeniem',
        paragraphs: [
          'Specyfikacja WAI-ARIA rozpoczyna się od słynnej pierwszej zasady: jeśli istnieje natywny element HTML realizujący potrzebne zachowanie i semantykę, zawsze użyj natywnego elementu zamiast doklejać atrybuty role do div. Brak ARIA jest znacznie lepszy niż błędna ARIA, ponieważ niepoprawnie zadeklarowana rola potrafi całkowicie zablokować obsługę komponentu w czytniku ekranu.',
          'Atrybuty ARIA stają się niezbędne w zaawansowanych wzorcach, których natywny HTML jeszcze w pełni nie pokrywa: w zakładkach (role="tablist", role="tab", aria-selected), akordeonach (aria-expanded, aria-controls), dynamicznych powiadomieniach toast (aria-live="polite") oraz przyciskach z samą ikoną (aria-label="Zamknij okno").',
          'Przed każdym wdrożeniem wykonaj pięciominutowy test manualny, który wyłapuje więcej realnych usterek niż jakikolwiek skaner automatyczny: odłóż myszkę i przejdź całą kluczową ścieżkę aplikacji wyłącznie klawiszami Tab, Shift+Tab, Enter, Spacja i Escape. Następnie powiększ widok przeglądarki do 200 procent i upewnij się, że żaden tekst nie zostaje obcięty ani nie pojawia się poziomy pasek przewijania.',
        ],
        bulletPoints: [
          'Każda podstrona posiada unikalny tytuł <title>, meta description oraz dokładnie jeden główny nagłówek <h1>.',
          'Wszystkie interaktywne przyciski, linki i zakładki dają się obsłużyć wyłącznie z klawiatury z wyraźnym :focus-visible.',
          'W oknach modalnych fokus trafia do wnętrza okna, a klawisz Escape zamyka modal i zwraca fokus do przycisku wywołującego.',
          'W ciemnym i jasnym motywie kontrast tekstu podstawowego wynosi minimum 4.5:1, a obszary dotykowe na telefonie mają co najmniej 44×44 px.',
        ],
      },
    ],
    keyTakeaways: [
      'Natywne znaczniki (<header>, <nav>, <main>, <article>, <button>, <a href>, <label>) zapewniają dostępność, obsługę klawiatury i czytelność dla Google bez dodatkowego kodu.',
      'Link <a href> służy wyłącznie do nawigacji pod adres URL; <button> służy do wykonywania akcji w interfejsie.',
      'Nigdy nie komunikuj błędów formularza samym kolorem — zawsze łącz tekstowy opis błędu z polem przez aria-describedby i aria-invalid.',
      'Krótki test nawigacji klawiszem Tab oraz powiększenie do 200% natychmiast ujawniają najważniejsze problemy użyteczności.',
    ],
    faq: [
      {
        question: 'Czy semantyczny HTML realnie wpływa na pozycjonowanie SEO w Google?',
        answer: 'Tak. Przejrzysta struktura nagłówków H1–H3, właściwe landmarki, opisowe linki <a href> zamiast przycisków JS oraz teksty alternatywne alt ułatwiają Googlebotowi zrozumienie tematyki podstrony, a także poprawiają metryki użyteczności i czasu spędzanego przez użytkowników.',
      },
      {
        question: 'Czy każdy obrazek na stronie musi mieć rozbudowany atrybut alt?',
        answer: 'Nie. Obrazy niosące treść merytoryczną (wykresy, zrzuty ekranu, zdjęcia redakcyjne) wymagają zwięzłego opisu tego, co pokazują. Natomiast grafiki czysto dekoracyjne powinny mieć pusty atrybut alt="" — wtedy czytnik ekranu elegancko je pominie zamiast odczytywać nazwę pliku.',
      },
      {
        question: 'Jak najszybciej sprawdzić kontrast i błędy dostępności na swojej stronie?',
        answer: 'Wbudowane narzędzie Lighthouse w Chrome DevTools oraz rozszerzenie axe DevTools w kilka sekund wskazują braki kontrastu, brakujące etykiety formularzy i błędną kolejność nagłówków. Zawsze uzupełniaj automat o ręczny test klawiszem Tab.',
      },
    ],
    relatedLessonIds: ['html-7', 'html-2', 'html-10', 'html-12', 'html-13'],
    relatedGuideSlugs: [
      'css-flexbox-vs-grid-kiedy-czego-uzywac',
      'jak-zostac-full-stack-developerem-plan-nauki',
      'react-19-architektura-stanu-i-wydajnosc',
    ],
  },
  {
    slug: 'css-flexbox-vs-grid-kiedy-czego-uzywac',
    title: 'CSS Flexbox czy CSS Grid? Kompletny przewodnik projektowania responsywnych układów bez frustracji',
    titleEn: 'CSS Flexbox vs CSS Grid: A Complete Guide to Building Responsive Layouts Without Frustration',
    subtitle: 'Kiedy wybrać Flexbox, a kiedy Grid, jak działają jednostki fr i funkcja minmax(), dlaczego elementy czasem rozpychają stronę na mobile i jak to naprawić jedną linijką CSS.',
    subtitleEn: 'When to pick Flexbox vs Grid, mastering fr units and minmax(), why children break mobile widths, and the one-line min-width fix.',
    metaDescription: 'Flexbox kontra CSS Grid w praktyce: różnice między układem 1D i 2D, responsywne siatki auto-fit/minmax, typowe błędy overflow oraz gotowe wzorce layoutów.',
    category: 'Frontend',
    categoryEn: 'Frontend',
    publishedAt: '2026-10-20',
    updatedAt: '2026-11-28',
    authorName: 'Zespół Redakcyjny Full Stack Developer Academy',
    authorRole: 'CSS Architecture & UI Engineering',
    level: 'Początkujący',
    levelEn: 'Beginner',
    leadParagraphs: [
      'Jedno z najczęstszych pytań wśród osób uczących się frontendu brzmi: czy CSS Grid całkowicie zastąpił Flexboxa? Krótka odpowiedź brzmi: absolutnie nie. Oba mechanizmy zostały zaprojektowane do rozwiązywania innych problemów i w profesjonalnych aplikacjach niemal zawsze współpracują ze sobą w ramach tego samego widoku — Grid buduje szkielet całej strony lub siatkę kart, a Flexbox precyzyjnie układa elementy wewnątrz pojedynczego paska nawigacji, przycisku czy nagłówka karty.',
      'Frustracja z CSS niemal zawsze wynika z próby zmuszania jednego narzędzia do pracy, do której stworzono drugie: na przykład ręcznego wyliczania procentowych szerokości calc(33.33% - 16px) w Flexboxie zamiast użycia jednej deklaracji CSS Grid, albo budowania złożonej siatki Grid dla prostego wiersza z logo po lewej i przyciskiem po prawej. W tym poradniku rozkładamy oba systemy na konkretne przypadki użycia i pokazujemy triki, które eliminują 90 procent problemów z responsywnością.',
    ],
    sections: [
      {
        id: 'regula-osi-1d-i-2d',
        heading: 'Zasada jednej osi kontra dwóch osi: model mentalny na lata',
        paragraphs: [
          'Najlepszy sposób myślenia o wyborze między Flexboxem a Gridem to rozróżnienie między układem sterowanym przez treść (content-first) a układem sterowanym przez strukturę siatki (layout-first). Flexbox jest systemem jednowymiarowym — rozkłada dzieci wzdłuż jednej osi (wiersza lub kolumny), pozwalając im naturalnie kurczyć się, rozciągać i dopasowywać do własnej zawartości. Nawet gdy włączysz zawijanie (flex-wrap: wrap), każdy wiersz zachowuje się niezależnie od pozostałych.',
          'CSS Grid działa jednocześnie w pionie i w poziomie. Najpierw definiujesz tory kolumn i wierszy na kontenerze rodzicu, a dopiero potem umieszczasz dzieci w wyznaczonych komórkach. Dzięki temu wszystkie karty w siatce mają idealnie równe szerokości i wysokości w ramach wiersza, kolumny trzymają pionową linię jak w magazynie drukowanym, a przestawienie całego układu strony na smartfonie sprowadza się do zmiany jednej właściwości grid-template-columns.',
        ],
        table: {
          caption: 'Porównanie CSS Flexbox i CSS Grid w realnych scenariuszach projektowych',
          headers: ['Scenariusz UI', 'Rekomendacja', 'Dlaczego to lepszy wybór'],
          rows: [
            ['Górny pasek nawigacji (logo + linki + CTA)', 'Flexbox', 'Elementy mają różne szerokości własne, liczy się wyrównanie w jednej linii'],
            ['Siatka kart artykułów / produktów', 'CSS Grid', 'Równe kolumny i wysokości bez ręcznych marginesów oraz auto-fit'],
            ['Układ całej aplikacji (sidebar + main)', 'CSS Grid', 'Jawna kontrola dwóch wymiarów, łatwe nazwane obszary grid-template-areas'],
            ['Przycisk z ikoną i etykietą tekstową', 'Flexbox', 'Proste centrowanie pionowe align-items: center i odstęp gap'],
            ['Karty z przypiętym przyciskiem na dole', 'Flexbox (kolumna)', 'flex-direction: column + margin-top: auto na stopce karty'],
          ],
        },
      },
      {
        id: 'responsywna-siatka-bez-media-queries',
        heading: 'Responsywna siatka kart bez ani jednego media query (auto-fit i minmax)',
        paragraphs: [
          'Jedną z najpotężniejszych konstrukcji współczesnego CSS jest połączenie funkcji repeat(), słowa kluczowego auto-fit oraz funkcji minmax(). Pozwala ono stworzyć siatkę kart, która na dużym monitorze wyświetla trzy lub cztery kolumny, na tablecie płynnie schodzi do dwóch, a na telefonie układa się w jedną pełną kolumnę — całkowicie bez ręcznego dopisywania progów @media.',
          'Kluczowym detalem, o którym często zapominają nawet doświadczeni programiści, jest owinięcie minimalnej szerokości w funkcję min(100%, 280px). Bez funkcji min() na bardzo wąskim ekranie (na przykład 320 pikseli z bocznym paddingiem 32 pikseli) kolumna o sztywnym minimum 280px może nie zmieścić się w kontenerze i wywołać niepożądany poziomy scroll. Zapis minmax(min(100%, 280px), 1fr) gwarantuje stuprocentowe bezpieczeństwo na każdym urządzeniu.',
        ],
        codeSnippet: {
          title: 'Wzorzec produkcyjnej siatki kart odpornej na wąskie ekrany mobilne',
          language: 'css',
          code: `.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 290px), 1fr));
  gap: 1.5rem;
  align-items: stretch;
}

.article-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 1rem;
  min-width: 0;
}

.article-card__footer {
  margin-top: auto;
  padding-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}`,
          caption: 'Połączenie CSS Grid na zewnątrz i Flexboxa wewnątrz karty wyrównuje stopki wszystkich kart do jednej linii.',
        },
      },
      {
        id: 'pulapka-min-width-zero-i-overflow',
        heading: 'Pułapka min-width: auto — dlaczego blok kodu rozwala layout na telefonie',
        paragraphs: [
          'Każdy programista przynajmniej raz spotkał się z tajemniczym błędem: tworzysz dwukolumnowy układ w Grid lub Flexboxie, wrzucasz do jednej z kolumn blok kodu <pre> albo długi adres URL i nagle cała strona rozjeżdża się w prawo poza ekran, mimo że kontener ma ustawione width: 100% i overflow-x: auto.',
          'Przyczyną jest domyślna wartość min-width: auto dla dzieci Flexboxa oraz Gridów w specyfikacji CSS. Przeglądarka interpretuje ją jako zakaz zwężania elementu poniżej minimalnej szerokości jego najdłuższego niełamanego wiersza (na przykład linijki kodu w pre). Rozwiązanie jest banalne, gdy zna się mechanizm: dodaj min-width: 0 na elemencie będącym dzieckiem kontenera flex lub grid (w Tailwind CSS to klasa min-w-0). Ta jedna deklaracja odblokowuje poprawne przewijanie wewnątrz bloku kodu i poprawną pracę text-overflow: ellipsis.',
          'Druga częsta pułapka dotyczy właściwości flex-shrink. Jeżeli w nagłówku umieszczasz tytuł po lewej i przycisk akcji po prawej, długi tytuł może ścisnąć przycisk w dwie nieczytelne linijki. Nadanie przyciskowi white-space: nowrap oraz flex-shrink: 0 (w Tailwind: whitespace-nowrap shrink-0) zabezpiecza etykietę kontrolki, podczas gdy tytuł po lewej stronie z min-w-0 bezpiecznie się skraca lub zawija.',
        ],
      },
      {
        id: 'subgrid-container-queries-i-odstepy',
        heading: 'Współczesny CSS 2026: gap, Subgrid oraz Container Queries',
        paragraphs: [
          'W nowoczesnym CSS nie stosujemy już ujemnych marginesów na kontenerach i ręcznych marginesów prawych :not(:last-child) do budowania odstępów między elementami. Właściwość gap działa natywnie zarówno w CSS Grid, jak i w Flexboxie we wszystkich współczesnych przeglądarkach, dbając wyłącznie o światło między sąsiednimi dziećmi bez tworzenia zbędnych odstępów na krawędziach.',
          'Drugą przełomową funkcją, szeroko wspieraną w przeglądarkach, jest CSS Subgrid (grid-template-rows: subgrid). Pozwala on dzieciom umieszczonym wewnątrz karty wyrównać swoje wewnętrzne sekcje — na przykład tytuł, krótki opis i stopkę — względem sąsiednich kart w tym samym wierszu siatki. Dzięki temu nawet gdy jeden nagłówek ma jedną linijkę, a sąsiedni dwie, podtytuły pod nimi zaczynają się dokładnie na tej samej wysokości.',
          'Na koniec warto poznać Container Queries (@container). Zamiast uzależniać wygląd komponentu od szerokości całego okna przeglądarki, uzależniasz go od szerokości rodzica, w którym został osadzony. Ten sam komponent karty artykułu automatycznie wyświetli się w układzie poziomym na szerokiej stronie głównej i w układzie pionowym po wstawieniu do wąskiego paska bocznego.',
        ],
        bulletPoints: [
          'Używaj właściwości gap zamiast ręcznych marginesów między sąsiednimi elementami siatki lub wiersza.',
          'Dodawaj min-width: 0 (min-w-0) do kolumn z blokami kodu, tabelami oraz długimi tekstami z truncate.',
          'Preferuj jednostki logiczne i elastyczne (rem, fr, %, clamp()) zamiast sztywnych pikseli dla szerokości kontenerów.',
          'Projektuj mobile-first: bazowe style piszesz dla jednej kolumny, a szersze układy dokładasz dopiero od breakpointów md i lg.',
        ],
      },
    ],
    keyTakeaways: [
      'Flexbox wybierz do układów w jednej osi (paski nawigacji, przyciski, wyrównanie elementów w rzędzie); CSS Grid wybierz do dwuwymiarowych siatek i szkieletu strony.',
      'Formuła repeat(auto-fit, minmax(min(100%, 280px), 1fr)) buduje odporną siatkę responsywną bez nadmiaru media queries.',
      'Deklaracja min-width: 0 na dzieciach Grid i Flexbox usuwa najczęstszy błąd rozpychania szerokości przez bloki kodu i długie linki.',
      'Połączenie CSS Grid na liście kart oraz Flexboxa (flex-col + mt-auto) wewnątrz karty daje równą linię przycisków niezależnie od długości opisu.',
    ],
    faq: [
      {
        question: 'Czy mogę łączyć CSS Grid i Flexbox w tym samym komponencie?',
        answer: 'Tak, to najlepsza praktyka. Bardzo często kontener zewnętrzny jest siatką CSS Grid (np. 3 kolumny kart), a wnętrze pojedynczej karty wykorzystuje Flexbox do rozłożenia nagłówka, treści i przypiętej na dole stopki.',
      },
      {
        question: 'Czym różni się auto-fit od auto-fill w CSS Grid?',
        answer: 'Gdy elementów jest mniej niż maksymalna liczba mieszczących się kolumn, auto-fit zwija puste tory do zera i rozciąga istniejące karty na całą dostępną szerokość. Natomiast auto-fill utrzymuje puste kolumny, zachowując stałą szerokość pojedynczej karty.',
      },
      {
        question: 'Dlaczego align-items: center nie wyśrodkowuje mojego elementu w pionie?',
        answer: 'W Flexboxie przy flex-direction: row właściwość align-items działa w pionie tylko wtedy, gdy kontener ma określoną wysokość większą niż samo dziecko (np. min-height: 100vh). Jeśli zmienisz kierunek na flex-direction: column, osie zamieniają się rolami i pionem steruje justify-content.',
      },
    ],
    relatedLessonIds: ['css-2', 'css-3', 'css-4', 'css-5'],
    relatedGuideSlugs: [
      'html5-semantyka-dostepnosc-wcag-przewodnik',
      'react-19-architektura-stanu-i-wydajnosc',
      'jak-zostac-full-stack-developerem-plan-nauki',
    ],
  },
  {
    slug: 'javascript-event-loop-async-await-kompendium',
    title: 'Jak naprawdę działa JavaScript: Event Loop, Call Stack, Microtasks, Promises i async/await',
    titleEn: 'How JavaScript Really Works: Event Loop, Call Stack, Microtasks, Promises, and async/await',
    subtitle: 'Zrozum jednowątkowy model wykonania JS od środka — kolejność logów w konsoli, różnice między Promise.all a Promise.allSettled, anulowanie zapytań i unikanie wycieków pamięci.',
    subtitleEn: 'Understand JS single-threaded execution from the inside — execution order, Promise.all vs allSettled, request cancellation, and preventing memory leaks.',
    metaDescription: 'Dogłębne kompendium asynchroniczności w JavaScript: stos wywołań Call Stack, Web APIs, kolejka mikrozadań Microtask Queue, Event Loop, Promise i async/await.',
    category: 'JavaScript & TypeScript',
    categoryEn: 'JavaScript & TypeScript',
    publishedAt: '2026-10-24',
    updatedAt: '2026-11-28',
    authorName: 'Zespół Redakcyjny Full Stack Developer Academy',
    authorRole: 'JavaScript Runtime & Performance',
    level: 'Średniozaawansowany',
    levelEn: 'Intermediate',
    leadParagraphs: [
      'JavaScript jest językiem jednowątkowym — w jednym momencie potrafi wykonywać dokładnie jedną instrukcję na głównym stosie wywołań (Call Stack). A mimo to nowoczesne aplikacje webowe potrafią jednocześnie pobierać dane z pięciu endpointów API, animować interfejs z płynnością 60 klatek na sekundę i reagować na kliknięcia użytkownika bez zacinania ekranu. Dla wielu początkujących i średniozaawansowanych programistów ten pozorny paradoks bywa źródłem zagadkowych błędów wyścigów (race conditions) oraz trudnych pytań na rozmowach rekrutacyjnych.',
      'Kluczem do opanowania asynchroniczności nie jest wkuwanie na pamięć zagadek z setTimeout(..., 0). Kluczem jest zrozumienie prostej współpracy czterech elementów środowiska uruchomieniowego: stosu wywołań Call Stack, asynchronicznych interfejsów Web APIs (lub libuv w Node.js), kolejki mikrozadań (Microtask Queue) oraz kolejki zadań (Macrotask / Task Queue), nad którymi czuwa pętla zdarzeń Event Loop.',
    ],
    sections: [
      {
        id: 'anatomia-event-loop-i-kolejki',
        heading: 'Anatomia Event Loop: stos wywołań, mikrozadania i makrozadania',
        paragraphs: [
          'Gdy wywołujesz zwykłą funkcję synchroniczną, trafia ona na szczyt stosu wywołań Call Stack. Dopóki stos nie jest pusty, przeglądarka nie może przerysować ekranu ani obsłużyć nowego kliknięcia — dlatego ciężka pętla licząca przez trzy sekundy całkowicie zamraża kartę przeglądarki. Natomiast operacje wejścia i wyjścia, takie jak fetch(), timery setTimeout() czy nasłuchiwanie kliknięć, są delegowane poza silnik JS do środowiska hosta (Web APIs w przeglądarce albo puli wątków libuv w Node.js).',
          'Kiedy operacja w tle zakończy się, jej funkcja zwrotna nie przerywa bieżącego kodu. Trafia do odpowiedniej kolejki. Tu pojawia się najważniejsza zasada: kolejka mikrozadań (Microtask Queue), do której trafiają reakcje .then(), .catch(), .finally(), wznowienia po await oraz queueMicrotask(), ma bezwzględne pierwszeństwo przed kolejką zwykłych zadań (Task Queue), w której czekają setTimeout, setInterval czy zdarzenia I/O.',
          'Pętla zdarzeń Event Loop działa według prostego cyklu: poczekaj aż Call Stack będzie zupełnie pusty → opróżnij całą kolejkę mikrozadań aż do ostatniego elementu (nawet jeśli mikrozadania dokładają kolejne mikrozadania!) → pozwól przeglądarce ewentualnie przerysować klatkę obrazu → pobierz jedno zadanie z kolejki Task Queue i wrzuć je na stos.',
        ],
        codeSnippet: {
          title: 'Klasyczny test kolejności wykonania: synchroniczny kod vs Promise vs setTimeout',
          language: 'javascript',
          code: `console.log('1. Start (Call Stack)');

setTimeout(() => {
  console.log('2. Timer 0ms (Task Queue)');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Promise .then (Microtask Queue)');
});

console.log('4. Koniec kodu synchronicznego (Call Stack)');

// Wynik w konsoli ZAWSZE w tej kolejności:
// 1. Start (Call Stack)
// 4. Koniec kodu synchronicznego (Call Stack)
// 3. Promise .then (Microtask Queue)
// 2. Timer 0ms (Task Queue)`,
          caption: 'Nawet przy opóźnieniu 0ms callback setTimeout czeka na pełne opróżnienie stosu oraz wszystkich mikrozadań Promise.',
        },
      },
      {
        id: 'async-await-i-sekwencyjna-pulapka',
        heading: 'Pułapka sekwencyjnego await i równoległe pobieranie danych',
        paragraphs: [
          'Składnia async/await sprawiła, że kod asynchroniczny czyta się niemal tak samo łatwo jak kod synchroniczny. Ma to jednak ukryty koszt wydajnościowy: początkujący często stawiają await przed każdym niezależnym wywołaniem fetch w kolejnych liniach, zamieniając równoległe zapytania sieciowe w powolną kaskadę (waterfall). Jeśli pobranie profilu trwa 250 ms, listy kursów 300 ms, a powiadomień 200 ms, trzy sekwencyjne wywołania await zajmą łącznie 750 ms zamiast 300 ms.',
          'Jeśli dwa lub więcej zapytań nie zależy od swoich wyników, uruchamiaj je równolegle za pomocą metod kombinujących obietnice. Dobór właściwego kombinatora decyduje o odporności aplikacji na częściowe awarie serwera: Promise.all przerywa działanie natychmiast przy pierwszym błędzie, podczas gdy Promise.allSettled pozwala wyświetlić wszystkie sekcje, które się powiodły, a dla jednej zepsutej pokazać lokalny komunikat awaryjny.',
        ],
        table: {
          caption: 'Kiedy użyć którego kombinatora Promise w aplikacji produkcyjnej',
          headers: ['Metoda', 'Zachowanie przy błędzie', 'Najlepszy przypadek użycia'],
          rows: [
            ['Promise.all([...])', 'Odrzuca całość po pierwszym błędzie (fail-fast)', 'Wszystkie dane są niezbędne jednocześnie (np. zapis powiązanych zasobów)'],
            ['Promise.allSettled([...])', 'Zawsze czeka na wszystkie i zwraca statusy fulfilled/rejected', 'Dashboard z wieloma niezależnymi widżetami — awaria jednego nie psuje reszty'],
            ['Promise.race([...])', 'Zwraca wynik lub błąd najszybszej obietnicy', 'Implementacja limitu czasu (timeout) dla wolnego żądania sieciowego'],
            ['Promise.any([...])', 'Zwraca pierwszy sukces; błąd dopiero gdy zawiodą wszystkie', 'Pobieranie zasobu z kilku zapasowych serwerów mirror / CDN'],
          ],
        },
      },
      {
        id: 'race-conditions-i-abort-controller',
        heading: 'Wyścigi zapytań (Race Conditions) i anulowanie przez AbortController',
        paragraphs: [
          'Wyobraź sobie pole wyszukiwania z podpowiedziami na żywo. Użytkownik wpisuje słowo "react" — najpierw wysyłane jest zapytanie dla frazy "re", a 100 milisekund później dla "react". Z powodu wahań w sieci starsze, cięższe zapytanie "re" wraca z serwera pół sekundy po nowszym zapytaniu "react" i nadpisuje wyniki na ekranie. Użytkownik widzi w polu wpisane "react", ale na liście dostaje wyniki dla "re". To klasyczny błąd wyścigu (race condition).',
          'Standardowym rozwiązaniem w nowoczesnym JavaScript i React jest obiekt AbortController. Przed wysłaniem nowego żądania (lub w funkcji czyszczącej useEffect po odmontowaniu komponentu) wywołujesz controller.abort(). Przeglądarka natychmiast przerywa nieaktualne połączenie HTTP, oszczędza transfer sieciowy i rzuca kontrolowany błąd AbortError, który świadomie ignorujesz bez psucia stanu aplikacji.',
        ],
        codeSnippet: {
          title: 'Równoległe zapytania z limitem czasu i bezpiecznym anulowaniem',
          language: 'javascript',
          code: `async function loadDashboardData(userId, externalSignal) {
  const timeoutSignal = AbortSignal.timeout(8000);
  const combinedSignal = externalSignal
    ? AbortSignal.any([externalSignal, timeoutSignal])
    : timeoutSignal;

  const [profileRes, statsRes] = await Promise.allSettled([
    fetch(\`/api/users/\${userId}\`, { signal: combinedSignal }).then((r) => {
      if (!r.ok) throw new Error(\`Profile HTTP \${r.status}\`);
      return r.json();
    }),
    fetch(\`/api/users/\${userId}/stats\`, { signal: combinedSignal }).then((r) => {
      if (!r.ok) throw new Error(\`Stats HTTP \${r.status}\`);
      return r.json();
    }),
  ]);

  return {
    profile: profileRes.status === 'fulfilled' ? profileRes.value : null,
    stats: statsRes.status === 'fulfilled' ? statsRes.value : null,
  };
}`,
          caption: 'AbortSignal.timeout() i AbortSignal.any() w nowoczesnym JS pozwalają łączyć anulowanie z UI z globalnym limitem czasu.',
        },
      },
      {
        id: 'blokowanie-watku-i-wycieki-pamieci',
        heading: 'Czego nigdy nie robić w pętli zdarzeń: blokowanie i wycieki pamięci',
        paragraphs: [
          'Na frontendzie każda operacja synchroniczna trwająca ponad 50 milisekund (Long Task) pogarsza metrykę INP (Interaction to Next Paint) w Core Web Vitals i sprawia, że strona wydaje się ospała. Ciężkie operacje obliczeniowe — na przykład parsowanie wielomegabajtowego pliku CSV, szyfrowanie lub przetwarzanie obrazu — warto przenieść do Web Workera działającego w osobnym wątku poza głównym Event Loop.',
          'Na backendzie w Node.js blokowanie pętli zdarzeń jest jeszcze bardziej dotkliwe, ponieważ jeden proces obsługuje jednocześnie setki klientów. Wywołanie synchronicznej metody fs.readFileSync() w obsłudze żądania HTTP albo obliczenie ciężkiego wyrażeń regularnych podatnych na ReDoS wstrzymuje odpowiedzi dla wszystkich pozostałych użytkowników podłączonych do tego serwera.',
          'Zawsze pilnuj również sprzątania zasobów asynchronicznych: niezamknięte interwały setInterval, nieodpięte nasłuchiwacze addEventListener oraz otwarte subskrypcje WebSocket utrzymują referencje do obiektów w pamięci i powodują systematyczny wzrost zużycia RAM w długich sesjach aplikacji SPA.',
        ],
        bulletPoints: [
          'Unikaj pętli forEach z funkcją async — forEach nie czeka na obietnice; użyj pętli for...of (sekwencyjnie) lub Promise.all(items.map(...)) (równolegle).',
          'Każdy nieobsłużony błąd obietnicy (unhandledRejection) potrafi zamknąć proces serwera Node.js — zawsze zamykaj await w try/catch lub globalny error handler.',
          'W React zawsze podpinaj AbortController w funkcji czyszczącej useEffect dla zapytań wywoływanych przy zmianie filtrów.',
        ],
      },
    ],
    keyTakeaways: [
      'Event Loop opróżnia najpierw cały Call Stack, potem kompletną kolejkę mikrozadań (Promise/await), a dopiero później pobiera jedno zadanie z kolejki makrozadań (setTimeout).',
      'Niezależne zapytania sieciowe uruchamiaj równolegle przez Promise.all lub Promise.allSettled zamiast kaskadowych await.',
      'Używaj AbortController do przerywania nieaktualnych zapytań wyszukiwania i eliminowania błędów wyścigu (race conditions).',
      'Nigdy nie blokuj głównego wątku synchronicznym I/O w Node.js ani ciężkimi pętlami powyżej 50 ms w przeglądarce.',
    ],
    faq: [
      {
        question: 'Dlaczego funkcja async zawsze zwraca obiekt Promise, nawet gdy zwracam zwykłą liczbę?',
        answer: 'Tak nakazuje specyfikacja ECMAScript: słowo kluczowe async automatycznie pakuje każdą zwróconą wartość w spełnioną obietnicę Promise.resolve(wartość), a każdy rzucony wyjątek w odrzuconą obietnicę Promise.reject(błąd).',
      },
      {
        question: 'Czy await blokuje całą aplikację JavaScript podczas czekania na odpowiedź serwera?',
        answer: 'Nie. Słowo kluczowe await wstrzymuje wykonanie wyłącznie bieżącej funkcji async i zwalnia główny wątek Call Stack. W tym czasie przeglądarka normalnie renderuje animacje i obsługuje inne kliknięcia, a wznowienie funkcji trafia później do kolejki mikrozadań.',
      },
      {
        question: 'Dlaczego async/await nie działa wewnątrz tablicowego .forEach()?',
        answer: 'Metoda Array.prototype.forEach została zaprojektowana synchronicznie i całkowicie ignoruje obietnice zwracane przez callback. Jeśli chcesz czekać po kolei, użyj pętli for (const item of items), a jeśli chcesz wykonać operacje jednocześnie — Promise.all(items.map(...)).',
      },
    ],
    relatedLessonIds: ['js-1', 'js-2', 'js-4', 'js-5', 'js-8'],
    relatedGuideSlugs: [
      'typescript-w-praktyce-typy-generyki-walidacja',
      'react-19-architektura-stanu-i-wydajnosc',
      'projektowanie-rest-api-nodejs-express-standardy',
    ],
  },
  {
    slug: 'typescript-w-praktyce-typy-generyki-walidacja',
    title: 'TypeScript w projektach produkcyjnych: typy generyczne, discriminated unions i walidacja runtime',
    titleEn: 'Production TypeScript in Practice: Generics, Discriminated Unions, and Runtime Validation',
    subtitle: 'Jak pisać bezpieczny, czytelny TypeScript bez uciekania w any — zawężanie typów, modelowanie stanów aplikacji, utility types oraz ochrona na granicy danych z sieci.',
    subtitleEn: 'Write safe, maintainable TypeScript without falling back to any — type narrowing, state modeling, utility types, and runtime boundary validation.',
    metaDescription: 'Zaawansowany poradnik TypeScript w praktyce: unknown zamiast any, discriminated unions, typy generyczne, typy narzędziowe (Pick, Omit, Record) oraz walidacja danych z API.',
    category: 'JavaScript & TypeScript',
    categoryEn: 'JavaScript & TypeScript',
    publishedAt: '2026-10-28',
    updatedAt: '2026-11-28',
    authorName: 'Zespół Redakcyjny Full Stack Developer Academy',
    authorRole: 'TypeScript & Software Architecture',
    level: 'Średniozaawansowany',
    levelEn: 'Intermediate',
    leadParagraphs: [
      'Wielu programistów zaczyna przygodę z TypeScriptem od traktowania go jak „JavaScript z dopisanymi dwukropkami” — gdy kompilator zgłasza błąd, wstawiają słowo kluczowe any albo rzutowanie as MyType i idą dalej. Niestety taki styl daje najgorsze z obu światów: płacisz koszt konfiguracji kompilatora i dodatkowego kodu, ale w zamian nie dostajesz ochrony przed błędami na produkcji.',
      'Prawdziwa siła TypeScriptu ujawnia się wtedy, gdy zaczynasz projektować typy tak, aby niemożliwe stany aplikacji były po prostu niemożliwe do zapisania w kodzie. Dobrze zaprojektowane typy zastępują połowę komentarzy w dokumentacji, czynią refaktoryzację dużego projektu bezstresową i eliminują całą klasę błędów typu Cannot read properties of undefined.',
    ],
    sections: [
      {
        id: 'discriminated-unions-zamiast-flag-boolean',
        heading: 'Discriminated Unions: dlaczego flagi isLoading i isError to zły wzorzec',
        paragraphs: [
          'Spójrz na bardzo popularny sposób modelowania stanu pobierania danych w aplikacjach frontendowych: obiekt zawierający jednocześnie pola isLoading: boolean, error: string | null oraz data: User | null. Taki typ pozwala na powstanie absurdalnych kombinacji — na przykład isLoading: true jednocześnie z error: "Timeout" i niepustym data. Każdy komponent korzystający z tego obiektu musi ręcznie pilnować kolejności instrukcji warunkowych if.',
          'Rozwiązaniem z najwyższej półki inżynierskiej są unie z wyróżnikiem (discriminated unions). Zamiast jednego worka z opcjonalnymi polami definiujesz dokładny zestaw rozłącznych wariantów ze wspólnym polem status. Kiedy sprawdzasz w instrukcji switch (state.status), kompilator TypeScript automatycznie zawęża typ i gwarantuje, że w wariancie success pole data zawsze istnieje, a w wariancie error zawsze dostępny jest komunikat message.',
        ],
        codeSnippet: {
          title: 'Bezpieczne modelowanie stanów asynchronicznych za pomocą Discriminated Union',
          language: 'typescript',
          code: `type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string; retryable: boolean }
  | { status: 'success'; data: T; loadedAt: number };

function assertNever(value: never): never {
  throw new Error(\`Nieobsłużony wariant stanu: \${JSON.stringify(value)}\`);
}

function getStatusLabel<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case 'idle':
      return 'Gotowy do pobrania';
    case 'loading':
      return 'Ładowanie danych...';
    case 'error':
      return \`Błąd: \${state.message}\`;
    case 'success':
      return \`Załadowano o \${new Date(state.loadedAt).toLocaleTimeString('pl-PL')}\`;
    default:
      return assertNever(state);
  }
}`,
          caption: 'Funkcja assertNever gwarantuje w czasie kompilacji, że po dodaniu nowego statusu nie zapomnisz zaktualizować żadnego switcha.',
        },
      },
      {
        id: 'typy-generyczne-i-narzedziowe',
        heading: 'Typy generyczne i wbudowane Utility Types bez duplikacji kodu',
        paragraphs: [
          'Typy generyczne (<T>) budzą respekt początkujących tylko dopóki brzmią abstrakcyjnie. W praktyce typ generyczny to po prostu parametr dla typu — dokładnie tak samo, jak parametr funkcji pozwala wywołać tę samą logikę dla różnych wartości. Zamiast pisać osobne interfejsy PaginatedUsersResponse, PaginatedLessonsResponse i PaginatedOrdersResponse, tworzysz jeden generyczny kontrakt PaginatedResponse<T> z polem items: T[] i metadanymi stronicowania.',
          'Ograniczanie parametrów generycznych słowem kluczowym extends pozwala bezpiecznie odwoływać się do wybranych właściwości obiektu. Przykładowo zapis <T extends { id: string }> daje gwarancję, że funkcja indeksująca listę do słownika Record<string, T> zadziała dla dowolnego obiektu posiadającego tekstowy identyfikator id, a odrzuci obiekt bez takiego pola już w edytorze.',
          'W codziennej pracy ogromną czystość zapewniają wbudowane typy narzędziowe (Utility Types). Zamiast ręcznie kopiować dziesięć pól modelu User do formularza edycji i narażać się na rozjazd definicji, wyprowadzasz nowe typy z jednego źródła prawdy za pomocą Pick, Omit, Partial, Required oraz Readonly.',
        ],
        table: {
          caption: 'Najbardziej przydatne wbudowane Utility Types w aplikacjach Full Stack',
          headers: ['Typ narzędziowy', 'Działanie', 'Praktyczne zastosowanie'],
          rows: [
            ['Pick<User, "id" | "name">', 'Wybiera wyłącznie wskazane pola', 'Lekkie DTO na listę użytkowników lub nagłówek karty'],
            ['Omit<User, "passwordHash">', 'Usuwa wrażliwe lub zbędne pola', 'Bezpieczna odpowiedź API zwracana do przeglądarki'],
            ['Partial<ProfileForm>', 'Ustawia wszystkie pola jako opcjonalne', 'Częściowa aktualizacja zasobu przez PATCH'],
            ['Record<string, number>', 'Słownik o typowanych kluczach i wartościach', 'Mapy liczników, cache, konfiguracja slotów'],
            ['ReturnType<typeof fn>', 'Wyciąga typ zwracany przez funkcję', 'Synchronizacja typów bez ręcznego powielania interfejsów'],
          ],
        },
      },
      {
        id: 'granica-runtime-unknown-i-type-guards',
        heading: 'Najważniejsza prawda o TypeScript: typy znikają w czasie wykonania',
        paragraphs: [
          'TypeScript weryfikuje typy wyłącznie podczas kompilacji — przeglądarka oraz Node.js uruchamiają czysty JavaScript pozbawiony adnotacji typów. Oznacza to, że typowanie odpowiedzi z fetch() poprzez zapis const user = (await res.json()) as User jest wyłącznie obietnicą złożoną kompilatorowi. Jeśli zewnętrzne API zmieni nazwę pola albo zwróci null zamiast tablicy, aplikacja wybuchnie w produkcji mimo zielonego builda.',
          'Dlatego na każdej granicy systemu — przy odczycie JSON z sieci, parametrów URL, localStorage, plików konfiguracyjnych oraz body żądań POST na backendzie — traktuj dane wejściowe jako typ unknown, nigdy any. Następnie przepuść je przez funkcję strażnika typu (type guard, zwracającą predykat value is User) albo schemat walidacyjny (np. Zod). Po przejściu przez taki strażnik masz podwójną pewność: zarówno w trakcie kompilacji, jak i w realnym uruchomieniu na serwerze.',
        ],
        codeSnippet: {
          title: 'Bezpieczny strażnik typu (Type Guard) dla danych z localStorage lub sieci',
          language: 'typescript',
          code: `interface SavedPreferences {
  theme: 'dark' | 'light' | 'system';
  language: 'pl' | 'en';
}

function isSavedPreferences(value: unknown): value is SavedPreferences {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  const validTheme =
    candidate.theme === 'dark' ||
    candidate.theme === 'light' ||
    candidate.theme === 'system';
  const validLang = candidate.language === 'pl' || candidate.language === 'en';
  return validTheme && validLang;
}

export function loadPreferences(rawJson: string | null): SavedPreferences {
  if (!rawJson) return { theme: 'dark', language: 'pl' };
  try {
    const parsed: unknown = JSON.parse(rawJson);
    if (isSavedPreferences(parsed)) {
      return parsed;
    }
  } catch {
    // Uszkodzony JSON w pamięci lokalnej — bezpieczny fallback
  }
  return { theme: 'dark', language: 'pl' };
}`,
          caption: 'Dzięki unknown oraz type guardowi aplikacja nigdy nie zawiesi się po ręcznej modyfikacji localStorage lub zmianie formatu danych.',
        },
      },
      {
        id: 'konfiguracja-strict-w-tsconfig',
        heading: 'Konfiguracja strict w tsconfig.json, która naprawdę łapie błędy',
        paragraphs: [
          'Warto uruchomić tryb strict: true w pliku tsconfig.json od pierwszego dnia projektu. Włącza on m.in. strictNullChecks (zmuszający do jawnej obsługi null i undefined) oraz noImplicitAny (eliminujący przypadkowe niejawne typy). W projektach produkcyjnych świetnym uzupełnieniem jest również flaga noUncheckedIndexedAccess: true — sprawia ona, że odczyt elementu z tablicy items[0] ma typ T | undefined zamiast samego T, przypominając o sprawdzeniu, czy lista nie jest pusta.',
          'Jeśli migrujesz starszy projekt z JavaScriptu, nie wyłączaj trybu strict globalnie. Zamiast tego dodawaj typy stopniowo od najbardziej krytycznych modułów domenowych (obliczenia, płatności, autoryzacja), traktując typ unknown jako bezpieczny punkt wejścia do czasu dopisania pełnego strażnika typu.',
        ],
        bulletPoints: [
          'Zastępuj każde wystąpienie any typem unknown połączonym z jawnym zawężeniem (typeof, Array.isArray, in, type guard).',
          'Unikaj nadużywania rzutowania as Typ — to instrukcja wyłączająca czujność kompilatora.',
          'Modeluj stany UI jako discriminated unions z polem status zamiast luźnego zestawu flag boolean.',
          'Używaj jednego źródła prawdy dla typów i wyprowadzaj warianty przez Pick, Omit oraz Partial.',
        ],
      },
    ],
    keyTakeaways: [
      'TypeScript chroni w czasie kompilacji, ale na granicach systemu (API, localStorage, formularze) zawsze łącz go z walidacją runtime na typie unknown.',
      'Discriminated unions eliminują niemożliwe kombinacje stanów (np. jednoczesne loading i error) i wymuszają kompletną obsługę w switch.',
      'Typy generyczne i Utility Types usuwają powielanie interfejsów między warstwą bazy danych, API i komponentami UI.',
      'Tryb strict: true w tsconfig.json to najważniejsze ustawienie odróżniające rzetelny TypeScript od pozorowanego typowania.',
    ],
    faq: [
      {
        question: 'Czym różni się interface od type w TypeScript — czego lepiej używać?',
        answer: 'Do opisu kształtu obiektów i propsów komponentów oba działają niemal identycznie. Typ (type) jest jednak bardziej uniwersalny: tylko za pomocą type zapiszesz unie (A | B), discriminated unions, krotki i typy mapowane. Najważniejsza jest konsekwencja w zespole.',
      },
      {
        question: 'Dlaczego typ unknown jest lepszy od any?',
        answer: 'Do obu możesz przypisać dowolną wartość, ale z any kompilator wyłącza wszelkie sprawdzenia i pozwala wywołać nieistniejące metody. Przy unknown TypeScript zabrania użycia wartości dopóki nie udowodnisz jej typu w instrukcji warunkowej lub type guardzie.',
      },
      {
        question: 'Czy TypeScript spowalnia działanie aplikacji w przeglądarce?',
        answer: 'Nie. Wszystkie adnotacje typów są całkowicie usuwane na etapie budowania (np. przez Vite/esbuild), więc przeglądarka otrzymuje czysty, zminifikowany JavaScript o zerowym narzucie wydajnościowym.',
      },
    ],
    relatedLessonIds: ['ts-1', 'ts-2', 'ts-3', 'js-1'],
    relatedGuideSlugs: [
      'javascript-event-loop-async-await-kompendium',
      'react-19-architektura-stanu-i-wydajnosc',
      'projektowanie-rest-api-nodejs-express-standardy',
    ],
  },
  {
    slug: 'react-19-architektura-stanu-i-wydajnosc',
    title: 'React w praktyce: architektura komponentów, pułapki useEffect, zarządzanie stanem i wydajność',
    titleEn: 'React in Practice: Component Architecture, useEffect Pitfalls, State Management, and Performance',
    subtitle: 'Jak pisać przejrzyste aplikacje React bez kaskadowych re-renderów — kiedy NIE używać useEffect, jak dzielić stan lokalny i serwerowy oraz jak projektować reużywalne hooki.',
    subtitleEn: 'Write clean React apps without cascading re-renders — when NOT to use useEffect, separating UI and server state, and designing clean custom hooks.',
    metaDescription: 'Przewodnik architektury React: zasady zarządzania stanem, najczęstsze błędy useEffect, własne hooki, optymalizacja re-renderów, code splitting i dobre praktyki.',
    category: 'Frontend',
    categoryEn: 'Frontend',
    publishedAt: '2026-11-01',
    updatedAt: '2026-11-28',
    authorName: 'Zespół Redakcyjny Full Stack Developer Academy',
    authorRole: 'React & Frontend Engineering',
    level: 'Średniozaawansowany',
    levelEn: 'Intermediate',
    leadParagraphs: [
      'React pozwala w dziesięć minut uruchomić pierwszy działający interfejs, ale równie łatwo pozwala zbudować trudną w utrzymaniu plątaninę efektów ubocznych, podwójnych zapytań sieciowych i spowolnionych formularzy. Różnica między kodem początkującego a architekturą seniora nie wynika ze znajomości egzotycznych bibliotek — wynika ze zrozumienia cyklu renderowania oraz dyscypliny w tym, gdzie i po co trzymasz stan.',
      'W tym poradniku przechodzimy przez cztery najważniejsze decyzje architektoniczne w każdej większej aplikacji React: eliminację nadmiarowych wywołań useEffect, świadomy podział na stan lokalny, stan URL i stan serwerowy, bezpieczne wydzielanie logiki do własnych hooków oraz praktyczną optymalizację wydajności opartą na pomiarze zamiast zgadywania.',
    ],
    sections: [
      {
        id: 'kiedy-nie-potrzebujesz-useeffect',
        heading: 'Kiedy NIE potrzebujesz useEffect (i jak usuwa to połowę błędów)',
        paragraphs: [
          'Hook useEffect jest najczęściej nadużywanym narzędziem w całym ekosystemie Reacta. Jego jedynym prawdziwym przeznaczeniem jest synchronizacja komponentu z systemem zewnętrznym — na przykład subskrypcją WebSocket, nasłuchiwaniem zdarzeń window, API przeglądarki (IntersectionObserver, title dokumentu) lub zewnętrznym widżetem DOM.',
          'Jeśli używasz useEffect do obliczania wartości pochodnej na podstawie propsów albo innego stanu (na przykład filtrowania listy artykułów po frazie wyszukiwania i zapisywania wyniku w osobnym useState), zmuszasz Reacta do podwójnego renderowania przy każdej zmianie, wprowadzasz przejściowy niespójny stan i komplikujesz przepływ danych. Wartość pochodną oblicz bezpośrednio w ciele komponentu — a jeżeli obliczenie jest kosztowne dla tysięcy rekordów, owiń je w useMemo.',
          'Drugim błędnym użyciem useEffect jest reagowanie na akcję użytkownika (na przykład wysłanie formularza lub zapis do bazy po kliknięciu przycisku). Logika wywołana konkretnym zdarzeniem użytkownika powinna znajdować się wprost w handlerze zdarzenia (onClick, onSubmit), a nie w efekcie nasłuchującym flagi isSubmitted.',
        ],
        codeSnippet: {
          title: 'Antywzorzec ze zbędnym useEffect kontra czyste wyliczanie pochodne',
          language: 'tsx',
          code: `// ZLE: Zbędny dodatkowy stan i podwójny render przez useEffect
function BadLessonList({ lessons, query }: { lessons: Lesson[]; query: string }) {
  const [filtered, setFiltered] = useState<Lesson[]>(lessons);
  useEffect(() => {
    setFiltered(lessons.filter((l) => l.title.toLowerCase().includes(query.toLowerCase())));
  }, [lessons, query]);
  return <ul>{filtered.map((l) => <li key={l.id}>{l.title}</li>)}</ul>;
}

// DOBRZE: Jedno źródło prawdy, zero zbędnych efektów i natychmiastowy wynik
function GoodLessonList({ lessons, query }: { lessons: Lesson[]; query: string }) {
  const normalized = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      normalized
        ? lessons.filter((l) => l.title.toLowerCase().includes(normalized))
        : lessons,
    [lessons, normalized]
  );

  return <ul>{filtered.map((l) => <li key={l.id}>{l.title}</li>)}</ul>;
}`,
          caption: 'Usunięcie zbędnego useState + useEffect natychmiast likwiduje opóźnienie o jedną klatkę i ryzyko rozjechania się danych.',
        },
      },
      {
        id: 'kategorie-stanu-i-kolokacja',
        heading: 'Cztery rodzaje stanu w aplikacji React — nie wrzucaj wszystkiego do Contextu',
        paragraphs: [
          'Częsty błąd w rozrastających się projektach to wrzucenie absolutnie wszystkich danych (od aktualnie otwartego akordeonu aż po dane zalogowanego użytkownika i listy lekcji) do jednego wielkiego React Contextu na samej górze aplikacji. Każda zmiana pojedynczego pola w takim kontekście wymusza ponowne wyrenderowanie wszystkich konsumentów w całym drzewie komponentów.',
          'Zasada kolokacji stanu (state colocation) mówi: trzymaj stan tak blisko komponentu, który go potrzebuje, jak to tylko możliwe. Podnoś stan wyżej dopiero w chwili, gdy dwa sąsiadujące komponenty naprawdę muszą go współdzielić. Z kolei stan filtrów wyszukiwania, zakładki czy numeru strony warto umieszczać w adresie URL — dzięki temu użytkownik może wysłać komuś link albo odświeżyć stronę bez utraty widoku.',
        ],
        table: {
          caption: 'Dobór właściwego miejsca przechowywania stanu w aplikacji React',
          headers: ['Rodzaj stanu', 'Przykłady', 'Najlepsze narzędzie'],
          rows: [
            ['Stan lokalny UI', 'Otwarty modal, wpis w polu input, aktywny tab', 'useState / useReducer wewnątrz komponentu'],
            ['Stan nawigacyjny', 'Wybrana kategoria, fraza wyszukiwania, strona', 'URL (pathname / URLSearchParams)'],
            ['Stan globalny UI', 'Motyw dark/light, język PL/EN, zalogowany user', 'Rozdzielone, małe konteksty React lub Zustand'],
            ['Stan serwerowy (cache)', 'Lista zamówień, profil z bazy, statystyki', 'Dedykowana warstwa cache (np. TanStack Query) lub subskrypcja'],
          ],
        },
      },
      {
        id: 'kompozycja-i-wydajnosc-renderowania',
        heading: 'Kompozycja dzieci (children) i realna optymalizacja wydajności',
        paragraphs: [
          'Zanim sięgniesz po React.memo, useCallback i useMemo w każdym pliku, poznaj najczystszą technikę optymalizacji w React: kompozycję przez prop children oraz wyniesienie ruchomego stanu w dół. Jeśli komponent Layout trzyma stan pozycji scrolla albo otwartego paska wyszukiwania i bezpośrednio renderuje ciężki wykres <ExpensiveChart />, każda zmiana tego stanu przerenderuje wykres. Jeśli jednak wydzielisz stan do mniejszego komponentu albo przekażesz <ExpensiveChart /> jako children z rodzica, React automatycznie pominie jego ponowne renderowanie bez ani jednego React.memo.',
          'Drugim filarem szybkości aplikacji w produkcji jest dzielenie paczki kodu (Code Splitting) przez React.lazy() i <Suspense>. Użytkownik odwiedzający publiczny artykuł lub stronę główną nie powinien pobierać kilkuset kilobajtów kodu panelu administratora, edytora wykresów ani symulatora SQL. Podział widoków według ścieżek nawigacyjnych radykalnie skraca czas pierwszego uruchomienia (LCP i TBT) na urządzeniach mobilnych.',
          'Pamiętaj też o mierzeniu przed optymalizacją: otwórz React Developer Tools, włącz zakładkę Profiler i nagraj konkretną interakcję (np. pisanie w wyszukiwarce). Dopiero gdy zobaczysz realny komponent zajmujący kilkadziesiąt milisekund na klatkę, wprowadź celowaną memoizację lub wirtualizację długiej listy.',
        ],
        bulletPoints: [
          'Wydzielaj powtarzalną logikę biznesową (np. filtrowanie, obliczenia, walidację) do czystych funkcji w src/utils/ łatwych do przetestowania w node:test.',
          'Używaj stabilnych, unikalnych kluczy key (np. lesson.id) — losowy Math.random() jako key niszczy i odtwarza DOM przy każdym renderze.',
          'Dla dużych widoków ładowanych warunkowo (panele admina, modale z wykresami) stosuj React.lazy() + Suspense.',
          'Resetuj stan formularza edycji przy zmianie wybranego rekordu podając key={record.id} zamiast pisać ręczny useEffect czyszczący pola.',
        ],
      },
      {
        id: 'wlasne-hooki-i-granice-bledow',
        heading: 'Własne hooki (Custom Hooks), Error Boundaries i architektura odporna na awarie',
        paragraphs: [
          'Własny hook w React to zwykła funkcja zaczynająca się od przedrostka use, która enkapsuluje powtarzalną logikę stanu i efektów ubocznych — na przykład useDebouncedValue dla pola wyszukiwania, useMediaQuery dla responsywnych komponentów czy useKeyboardShortcut dla skrótów klawiszowych. Dobrze napisany custom hook zwraca minimalny, czytelny interfejs i ukrywa szczegóły techniczne (takie jak sprzątanie timerów czy anulowanie zapytań przez AbortController), dzięki czemu sam komponent JSX skupia się wyłącznie na prezentacji.',
          'Drugim często pomijanym elementem profesjonalnej architektury React są granice błędów (Error Boundaries). Domyślnie nieobsłużony wyjątek rzucony podczas renderowania jednego pobocznego widżetu (na przykład uszkodzonego wykresu analitycznego) wyłącza całe drzewo aplikacji i zostawia użytkownika przed pustym białym ekranem. Otoczenie niezależnych sekcji aplikacji (panelu głównego, edytora kodu, modułów ładowanych przez React.lazy) granicą błędów izoluje awarię: uszkodzony fragment pokazuje czytelny komunikat z przyciskiem ponowienia próby, podczas gdy reszta serwisu nadal działa bez zakłóceń.',
          'Warto także pamiętać o spójnym projektowaniu propsów komponentów. Zamiast tworzyć jeden monstrualny komponent Card przyjmujący dwadzieścia pięć flag sterujących (isCompact, hasHeaderBorder, showIconOnLeft, footerVariant), buduj mniejsze, składalne klocki i przekazuj treść przez children. Taka kompozycja dramatycznie upraszcza rozwój projektu, ponieważ nowy wariant karty nie wymaga dopisywania kolejnych warunków if w jednym przeładowanym pliku.',
        ],
      },
    ],
    keyTakeaways: [
      'Używaj useEffect wyłącznie do synchronizacji ze światem zewnętrznym — dane pochodne licz bezpośrednio w renderze lub w useMemo.',
      'Stosuj zasadę kolokacji: trzymaj stan lokalnie w najmniejszym wspólnym komponencie zamiast w jednym monolitycznym kontekście.',
      'Kompozycja przez children i wyniesienie ruchomego stanu w dół często eliminują zbędne re-rendery czyściej niż React.memo.',
      'Oddzielaj czystą logikę obliczeniową od komponentów JSX i stosuj React.lazy dla ciężkich widoków dostępnych po zalogowaniu.',
    ],
    faq: [
      {
        question: 'Dlaczego w trybie deweloperskim mój useEffect uruchamia się dwa razy?',
        answer: 'To celowe zachowanie React StrictMode na środowisku dev. React montuje, odmontowuje i ponownie montuje komponent, aby natychmiast wykryć brakującą funkcję czyszczącą (np. brak removeEventListener, clearInterval lub controller.abort()). W buildzie produkcyjnym efekt uruchamia się raz.',
      },
      {
        question: 'Czy powinienem owijać każdą funkcję w useCallback i każdy komponent w React.memo?',
        answer: 'Nie. Każde useCallback i React.memo również ma drobny koszt pamięciowy i porównywania tablicy zależności, a ponadto utrudnia czytanie kodu. Stosuj je celowo: przy przekazywaniu callbacków do zmemoizowanych ciężkich dzieci, długich list lub tablic zależności efektów.',
      },
      {
        question: 'Kiedy warto zmienić React Context na bibliotekę taką jak Zustand lub Redux?',
        answer: 'React Context świetnie sprawdza się dla rzadko zmienianych danych (motyw, język, bieżąca sesja użytkownika). Gdy masz bardzo często aktualizowany stan globalny czytany wybiórczo przez dziesiątki komponentów (np. edytor graficzny, koszyk na żywo), dedykowany store z selektorami zapobiega kaskadowym re-renderom.',
      },
    ],
    relatedLessonIds: ['react-1', 'react-2', 'react-3', 'react-4', 'react-5'],
    relatedGuideSlugs: [
      'typescript-w-praktyce-typy-generyki-walidacja',
      'javascript-event-loop-async-await-kompendium',
      'projektowanie-rest-api-nodejs-express-standardy',
    ],
  },
];
