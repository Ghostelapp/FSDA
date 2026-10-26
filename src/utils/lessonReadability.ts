import { Lesson } from '../types';

export type InlineToken =
  | { type: 'text'; content: string }
  | { type: 'bold'; content: string }
  | { type: 'code'; content: string; category: 'html' | 'css' | 'cli' | 'js' | 'general' };

export type TheoryBlock =
  | { type: 'heading'; title: string }
  | { type: 'paragraph'; tokens: InlineToken[] }
  | { type: 'ordered_list'; items: { number: string; title?: InlineToken[]; body: InlineToken[] }[] }
  | { type: 'unordered_list'; items: InlineToken[][] }
  | { type: 'code_block'; language: string; code: string };

export interface GlossaryItem {
  term: string;
  simpleDefinition: string;
}

export interface BeginnerLessonAid {
  difficultyLabel: 'Start od Zera' | 'Podstawy' | 'Średniozaawansowany' | 'Zaawansowany';
  difficultySummary: string;
  analogyTitle: string;
  analogyText: string;
  keyTakeaways: string[];
  glossary: GlossaryItem[];
  exerciseWalkthrough: string[];
}

export function classifyCodeCategory(snippet: string): 'html' | 'css' | 'cli' | 'js' | 'general' {
  const trimmed = snippet.trim();
  if ((trimmed.startsWith('<') && trimmed.endsWith('>')) || trimmed.startsWith('&lt;') || trimmed.startsWith('<!')) {
    return 'html';
  }
  if (trimmed.includes(':') && !trimmed.startsWith('http') && !trimmed.includes('://')) {
    return 'css';
  }
  if (
    trimmed.startsWith('git ') ||
    trimmed.startsWith('npm ') ||
    trimmed.startsWith('npx ') ||
    trimmed.startsWith('cd ') ||
    trimmed.startsWith('ls') ||
    trimmed.startsWith('mkdir ') ||
    trimmed.startsWith('docker ')
  ) {
    return 'cli';
  }
  if (
    trimmed.startsWith('const ') ||
    trimmed.startsWith('let ') ||
    trimmed.startsWith('function ') ||
    trimmed.includes('=>') ||
    trimmed.includes('()')
  ) {
    return 'js';
  }
  return 'general';
}

/**
 * Parses inline markdown tokens (**bold**, `code`, and nested **`code`**)
 * so raw backticks or asterisks never leak into the rendered lesson text.
 */
export function parseInlineTokens(rawText: string): InlineToken[] {
  if (!rawText) return [];

  // Normalize **`code`** or `**code**` into `code` so code badges render cleanly without literal backticks
  const normalized = rawText
    .replace(/\*\*`([^`]+)`\*\*/g, '`$1`')
    .replace(/`\*\*([^*]+)\*\*`/g, '`$1`');

  const parts = normalized.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter((p) => p.length > 0);
  const tokens: InlineToken[] = [];

  for (const part of parts) {
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const content = part.slice(1, -1).replace(/`/g, '');
      tokens.push({
        type: 'code',
        content,
        category: classifyCodeCategory(content),
      });
    } else if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const inner = part.slice(2, -2);
      if (inner.includes('`')) {
        const subParts = inner.split(/(`[^`]+`)/g).filter((sp) => sp.length > 0);
        for (const sp of subParts) {
          if (sp.startsWith('`') && sp.endsWith('`') && sp.length >= 2) {
            const codeContent = sp.slice(1, -1).replace(/`/g, '');
            tokens.push({
              type: 'code',
              content: codeContent,
              category: classifyCodeCategory(codeContent),
            });
          } else {
            tokens.push({ type: 'bold', content: sp.replace(/`/g, '') });
          }
        }
      } else {
        tokens.push({
          type: 'bold',
          content: inner.replace(/`/g, ''),
        });
      }
    } else {
      const cleaned = part.replace(/\*([^*]+)\*/g, '$1').replace(/`/g, '');
      tokens.push({
        type: 'text',
        content: cleaned,
      });
    }
  }

  return tokens;
}

/**
 * Parses lesson theoryMarkdown into structured visual blocks (headings, paragraphs,
 * numbered step cards, bullet lists, and fenced code blocks) even when lists use single line breaks (\n).
 */
export function parseTheoryBlocks(markdown: string): TheoryBlock[] {
  if (!markdown || !markdown.trim()) return [];

  const rawLines = markdown.replace(/\r\n/g, '\n').split('\n');

  const blocks: TheoryBlock[] = [];
  let currentOrdered: { number: string; title?: InlineToken[]; body: InlineToken[] }[] = [];
  let currentUnordered: InlineToken[][] = [];
  let currentParagraphLines: string[] = [];
  let inCodeBlock = false;
  let codeBlockLang = 'bash';
  let codeBlockLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const joined = currentParagraphLines.join(' ');
      blocks.push({
        type: 'paragraph',
        tokens: parseInlineTokens(joined),
      });
      currentParagraphLines = [];
    }
  };

  const flushOrdered = () => {
    if (currentOrdered.length > 0) {
      blocks.push({
        type: 'ordered_list',
        items: currentOrdered,
      });
      currentOrdered = [];
    }
  };

  const flushUnordered = () => {
    if (currentUnordered.length > 0) {
      blocks.push({
        type: 'unordered_list',
        items: currentUnordered,
      });
      currentUnordered = [];
    }
  };

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();

    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        flushParagraph();
        flushOrdered();
        flushUnordered();
        inCodeBlock = true;
        codeBlockLang = trimmed.slice(3).trim() || 'javascript';
        codeBlockLines = [];
      } else {
        inCodeBlock = false;
        blocks.push({
          type: 'code_block',
          language: codeBlockLang,
          code: codeBlockLines.join('\n'),
        });
        codeBlockLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      continue;
    }

    const line = trimmed;
    if (!line) {
      flushParagraph();
      flushOrdered();
      flushUnordered();
      continue;
    }

    // Check if standalone bold section header, e.g. "**1. Czym jest algorytm?**" or "### Nagłówek"
    const headingMatch =
      line.match(/^\*\*(\d+\.\s+[^*]+)\*\*:?$/) ||
      line.match(/^#{1,3}\s+(.+)$/);

    if (headingMatch) {
      flushParagraph();
      flushOrdered();
      flushUnordered();
      blocks.push({
        type: 'heading',
        title: headingMatch[1].replace(/\*\*/g, '').trim(),
      });
      continue;
    }

    // Check if numbered list item: "1. **Title:** Description" or "1. Description"
    const orderedMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      flushUnordered();
      const num = orderedMatch[1];
      const rest = orderedMatch[2];

      // Split optional lead-in bold title before colon or dash
      const colonSplit = rest.match(/^(\*\*[^*]+\*\*:?|\*\*`[^`]+`\*\*:?)\s*(.*)$/);
      if (colonSplit && colonSplit[2]) {
        const rawLead = colonSplit[1].replace(/:$/, '');
        currentOrdered.push({
          number: num,
          title: parseInlineTokens(rawLead),
          body: parseInlineTokens(colonSplit[2].replace(/^[:—–-]\s*/, '')),
        });
      } else {
        currentOrdered.push({
          number: num,
          body: parseInlineTokens(rest),
        });
      }
      continue;
    }

    // Check if unordered list item: "- item" or "* item"
    const unorderedMatch = line.match(/^[-•]\s+(.+)$/);
    if (unorderedMatch) {
      flushParagraph();
      flushOrdered();
      currentUnordered.push(parseInlineTokens(unorderedMatch[1]));
      continue;
    }

    // Otherwise regular paragraph line
    flushOrdered();
    flushUnordered();
    currentParagraphLines.push(line);
  }

  flushParagraph();
  flushOrdered();
  flushUnordered();

  return blocks;
}

const CURATED_BEGINNER_AIDS: Record<
  string,
  {
    analogyTitle: string;
    analogyText: string;
    glossary: GlossaryItem[];
  }
> = {
  'fund-1': {
    analogyTitle: 'Wyobraź sobie wizytę w restauracji',
    analogyText:
      'Przeglądarka (np. Chrome) to Ty siedzący przy stoliku. Serwer to kuchnia na zapleczu. Kiedy wpisujesz adres strony, wysyłasz kelnera (protokół HTTP) z zamówieniem (Request). Kuchnia przygotowuje danie i odsyła kelnera z gotowym talerzem — czyli stroną HTML, którą widzisz na ekranie (Response 200 OK). Jeśli poprosisz o danie, którego nie ma w karcie, kelner wróci z informacją „404 Nie znaleziono”.',
    glossary: [
      { term: 'Klient (Przeglądarka)', simpleDefinition: 'Program na Twoim komputerze lub telefonie (np. Chrome, Safari), który wyświetla strony.' },
      { term: 'Serwer', simpleDefinition: 'Komputer działający 24/7 w internecie, który przechowuje pliki strony i wysyła je na żądanie.' },
      { term: 'HTTP / HTTPS', simpleDefinition: 'Język, w jakim przeglądarka rozmawia z serwerem (literka S oznacza bezpieczne, szyfrowane połączenie).' },
      { term: 'Kod 200 i 404', simpleDefinition: '200 oznacza „Wszystko działa, oto strona”, a 404 oznacza „Taka podstrona nie istnieje”.' },
    ],
  },
  'fund-2': {
    analogyTitle: 'Algorytm to po prostu przepis kulinarny',
    analogyText:
      'Komputer nie potrafi się domyślać — wykonuje dokładnie to, co napiszesz, krok po kroku, jak przepis na naleśniki. Zmienna w pamięci RAM to podpisane pudełko na półce (np. pudełko z napisem „wiek” i włożoną do środka karteczką „20”). Warunek „if” to zwykłe pytanie: „Jeśli masz co najmniej 18 lat, wejdź do środka”.',
    glossary: [
      { term: 'Algorytm', simpleDefinition: 'Lista prostych kroków prowadzących od problemu do wyniku (jak instrukcja składania mebli).' },
      { term: 'Zmienna (const / let)', simpleDefinition: 'Nazwane pudełko w pamięci komputera, w którym przechowujemy liczbę lub tekst.' },
      { term: 'Warunek if (...) ', simpleDefinition: 'Instrukcja „Jeżeli to prawda, wykonaj kod w klamrach { ... }”.' },
      { term: 'console.log(...)', simpleDefinition: 'Polecenie, które wypisuje wiadomość tekstową w okienku podglądu programisty.' },
    ],
  },
  'html-1': {
    analogyTitle: 'Szkielet HTML to koperta z adresem (<head>) i list w środku (<body>)',
    analogyText:
      'Wyobraź sobie wysyłanie tradycyjnego listu. Niewidoczna dla czytelnika metryczka na kopercie (znaczek, kod pocztowy i tytuł listu) to sekcja <head>. Natomiast kartka papieru włożona do środka koperty — czyli wszystko, co odbiorca wyjmuje i czyta oczami — to sekcja <body>.',
    glossary: [
      { term: '<!DOCTYPE html>', simpleDefinition: 'Pierwsza linijka mówiąca przeglądarce: „To jest nowoczesna strona HTML5”.' },
      { term: '<head> (Głowa)', simpleDefinition: 'Niewidoczne ustawienia strony — np. tytuł karty u góry przeglądarki (<title>).' },
      { term: '<body> (Ciało)', simpleDefinition: 'Widoczna część strony! Wszystko, co tu wpiszesz (<h1>, <p>, zdjęcia), pojawi się na ekranie.' },
      { term: '<title>', simpleDefinition: 'Nazwa wyświetlana na pasku karty w przeglądarce oraz w wynikach Google.' },
    ],
  },
  'html-7': {
    analogyTitle: 'Strona internetowa jak pierwsza strona w gazecie',
    analogyText:
      'Wyobraź sobie gazetę, w której cały tekst ma identyczną czcionkę — nikt by jej nie przeczytał! Dlatego w HTML używamy jednego dużego tytułu na górze (<h1>), mniejszego podtytułu (<h2>), zwykłych akapitów tekstu (<p>) oraz pogrubień najważniejszych słów (<strong>). Każdy znacznik otwieramy <p> i na końcu zamykamy ukośnikiem </p>.',
    glossary: [
      { term: '<h1> oraz <h2>', simpleDefinition: 'Nagłówki: <h1> to największy główny tytuł strony, a <h2> to mniejszy podtytuł.' },
      { term: '<p> (Akapit)', simpleDefinition: 'Zwykły akapit tekstu (od ang. paragraph) z automatycznym odstępem.' },
      { term: '<strong>', simpleDefinition: 'Pogrubia ważne słowo wewnątrz zdania, np. <strong>HTML</strong>.' },
      { term: 'Domknięcie </...>', simpleDefinition: 'Każdy otwarty znacznik (np. <p>) zamykamy na końcu ukośnikiem (</p>).' },
    ],
  },
  'html-8': {
    analogyTitle: 'Lista zakupów (<ul>), przepis kulinarny (<ol>) i drogowskaz (<a href>)',
    analogyText:
      'Kiedy idziesz do sklepu, kolejność produktów na kartce nie ma znaczenia — to lista z kropkami (<ul>). Kiedy jednak pieczesz ciasto, musisz wykonać krok 1, potem krok 2 i krok 3 — to lista ponumerowana (<ol>). W obu listach każdy pojedynczy wiersz wkładamy w znacznik <li>. A znacznik <a href="..."> działa jak drogowskaz: po kliknięciu przenosi Cię pod wskazany adres!',
    glossary: [
      { term: '<ul> (Kropki)', simpleDefinition: 'Lista wypunktowana (kropki) — gdy kolejność nie ma znaczenia.' },
      { term: '<ol> (Numery 1, 2, 3)', simpleDefinition: 'Lista ponumerowana — przeglądarka sama nada numery 1, 2, 3.' },
      { term: '<li> (Podpunkt)', simpleDefinition: 'Pojedyncza pozycja na liście (wiersz wewnątrz <ul> lub <ol>).' },
      { term: '<a href="adres">', simpleDefinition: 'Klikalny link — w cudzysłowie po href= wpisujemy dokąd ma prowadzić.' },
    ],
  },
  'html-4': {
    analogyTitle: 'Ramka na zdjęcie (<img>) oraz arkusz z kratkami (<table>)',
    analogyText:
      'Znacznik <img> działa jak ramka na zdjęcie powieszona na ścianie: w dopisku src="..." podajesz skąd wziąć fotografię, a w alt="..." piszesz jedno zdanie opisu (na wypadek, gdyby zdjęcie się nie wczytało). Z kolei <table> to prosta tabelka jak w zeszycie: <tr> tworzy nowy poziomy rząd, a <td> pojedynczą kratkę w tym rzędzie.',
    glossary: [
      { term: '<img src="..." alt="...">', simpleDefinition: 'Wstawia obrazek na stronę (nie wymaga osobnego znacznika zamykającego).' },
      { term: 'src oraz alt', simpleDefinition: 'src to adres pliku ze zdjęciem, a alt to krótki opis słowny obrazka.' },
      { term: '<table> i <tr>', simpleDefinition: '<table> to cała tabela, a każde <tr> (table row) to jeden poziomy wiersz.' },
      { term: '<th> oraz <td>', simpleDefinition: '<th> to pogrubiona komórka tytułowa u góry tabeli, a <td> to zwykła komórka z danymi.' },
    ],
  },
  'html-9': {
    analogyTitle: 'Kartonowe pudełko przeprowadzkowe (<div>) i żółty zakreślacz (<span>)',
    analogyText:
      'Wyobraź sobie przeprowadzkę: <div> to duże kartonowe pudełko, do którego wkładasz kilka rzeczy naraz (np. tytuł produktu, opis i przycisk), a na pudełku przyklejasz naklejkę z nazwą class="karta". Natomiast <span> to żółty flamaster-zakreślacz, którym zaznaczasz jedno słowo lub cenę w środku zdania, bez rozbijania tekstu na osobne pudełka.',
    glossary: [
      { term: '<div> (Pudełko blokowe)', simpleDefinition: 'Grupuje kilka elementów w jeden blok i zawsze zaczyna się od nowej linii.' },
      { term: '<span> (W linii tekstu)', simpleDefinition: 'Otacza pojedyncze słowo lub kwotę wewnątrz zdania, by nadać mu np. inny kolor.' },
      { term: 'class="nazwa"', simpleDefinition: 'Etykieta wielokrotnego użytku — pozwala nadać ten sam wygląd wielu pudełkom.' },
      { term: 'id="unikalna-nazwa"', simpleDefinition: 'Unikalny identyfikator (jak PESEL) dla jednego konkretnego elementu na stronie.' },
    ],
  },
  'html-2': {
    analogyTitle: 'Mieszkanie z podpisanymi pokojami (Kuchnia, Salon, Przedpokój)',
    analogyText:
      'Zamiast nazywać każde pomieszczenie w domu „Pokój nr 1, Pokój nr 2” (czyli same <div>), znacznie wygodniej nazwać je po imieniu: Przedpokój na górze (<header> i menu <nav>), duży Salon w środku (<main>) oraz Piwnica/Stopka na samym dole (<footer>). Wyglądają jak zwykłe pudełka, ale każdy od razu wie, co jest w środku!',
    glossary: [
      { term: '<header>', simpleDefinition: 'Górny pasek strony (zazwyczaj zawiera logo i główne menu).' },
      { term: '<nav>', simpleDefinition: 'Menu nawigacji z linkami do podstron.' },
      { term: '<main>', simpleDefinition: 'Główna, najważniejsza treść danej podstrony (występuje raz na stronie).' },
      { term: '<footer>', simpleDefinition: 'Stopka na samym dole strony (np. podpis autora i rok utworzenia).' },
    ],
  },
  'html-3': {
    analogyTitle: 'Formularz jak papierowy druk zamówienia na poczcie',
    analogyText:
      'Cała kartka papieru to znacznik <form>. Wydrukowany napis nad kratkami („Twoje imię:”) to <label>. Puste okienko, w które wpisujesz długopisem tekst, to <input>. A pieczątka i wrzucenie druku do skrzynki na końcu to przycisk <button type="submit">Wyślij</button>.',
    glossary: [
      { term: '<form>', simpleDefinition: 'Ramka otaczająca cały formularz (wszystkie pola i przycisk wysyłania).' },
      { term: '<label>', simpleDefinition: 'Podpis tekstowy nad polem mówiący użytkownikowi, co ma wpisać.' },
      { term: '<input type="email" required>', simpleDefinition: 'Okienko do wpisywania tekstu; słówko required pilnuje, by nie zostało puste.' },
      { term: '<button type="submit">', simpleDefinition: 'Przycisk zatwierdzający i wysyłający formularz.' },
    ],
  },
  'html-6': {
    analogyTitle: 'Telewizor z pilotem (<video controls>) i odtwarzacz muzyki (<audio controls>)',
    analogyText:
      'Sam znacznik <video> to ekran telewizora, ale dopiero dopisanie słówka controls daje użytkownikowi do ręki „pilota” z przyciskami Play, Pauza i Głośność. A dopisek poster="okladka.jpg" to ładna miniaturka wyświetlana na ekranie zanim widz naciśnie Play.',
    glossary: [
      { term: '<video controls>', simpleDefinition: 'Wbudowany odtwarzacz filmów z widocznym paskiem przycisków Play/Pauza.' },
      { term: '<audio controls>', simpleDefinition: 'Wbudowany odtwarzacz plików dźwiękowych (np. piosenek lub podcastów MP3).' },
      { term: 'controls', simpleDefinition: 'Włącza pasek sterowania (Play, czas trwania, głośność, pełny ekran).' },
      { term: 'poster="obrazek.jpg"', simpleDefinition: 'Miniaturka (okładka) wyświetlana na wideo przed kliknięciem Play.' },
    ],
  },
  'html-5': {
    analogyTitle: 'Wizytówka w katalogu Google (SEO) i lektor dla osób niewidomych (aria-label)',
    analogyText:
      'Znacznik <meta name="description"> to krótkie jednozdaniowe zaproszenie na szyldzie Twojego sklepu — Google wyświetla je w wynikach wyszukiwania pod tytułem strony. Natomiast aria-label="Zamknij" to głosowa podpowiedź dla osoby niewidomej, dzięki której wie ona, że przycisk ze znaczkiem „X” służy do zamknięcia okienka.',
    glossary: [
      { term: 'SEO', simpleDefinition: 'Dbanie o to, aby strona była dobrze opisana i wysoko wyświetlała się w wyszukiwarce Google.' },
      { term: '<meta name="description">', simpleDefinition: 'Krótki opis strony (1–2 zdania) wyświetlany w wynikach wyszukiwania Google.' },
      { term: 'Dostępność (WCAG / a11y)', simpleDefinition: 'Tworzenie stron tak, aby mogły z nich korzystać również osoby niewidome lub używające samej klawiatury.' },
      { term: 'aria-label="Opis"', simpleDefinition: 'Niewidoczny podpis głosowy dla czytników ekranu (np. na przycisku z samą ikonką).' },
    ],
  },
  'css-7': {
    analogyTitle: 'CSS to pędzel z farbą i wybór czcionki',
    analogyText:
      'Gdy masz już gotowy tekst w HTML, CSS pozwala nadać mu kolor i odpowiedni rozmiar. Zasada jest zawsze taka sama: najpierw piszesz nazwę elementu (np. h1 lub body), otwierasz nawias klamrowy { }, a w środku podajesz cechę i wartość po dwukropku, np. color: white; (kolor tekstu) lub background: blue; (kolor tła).',
    glossary: [
      { term: 'color', simpleDefinition: 'Zmienia kolor liter (tekstu), np. color: #2563eb;' },
      { term: 'background', simpleDefinition: 'Zmienia kolor tła pod elementem (lub ustawia płynne przejście kolorów — gradient).' },
      { term: 'font-size i line-height', simpleDefinition: 'font-size określa wielkość liter, a line-height odstęp między linijkami tekstu.' },
    ],
  },
  'css-6': {
    analogyTitle: 'Selektory CSS to adresowanie listu do konkretnego elementu',
    analogyText:
      'Na stronie masz dziesiątki przycisków i akapitów. Jak powiedzieć przeglądarce, że chcesz pokolorować tylko jeden wybrany przycisk? Nadajesz mu w HTML klasę (np. class="ważny-przycisk"), a w CSS zaczynasz nazwę od kropki (.ważny-przycisk { ... }). Dopisek :hover oznacza: „zmień kolor, gdy użytkownik najedzie na ten element myszką”.',
    glossary: [
      { term: '.klasa (z kropką)', simpleDefinition: 'Wybiera wszystkie elementy posiadające w HTML atrybut class="klasa".' },
      { term: ':hover', simpleDefinition: 'Styl, który włącza się w momencie najechania kursorem myszy na element.' },
      { term: 'px vs rem', simpleDefinition: 'px to sztywne piksele ekranu, a rem to elastyczna jednostka (1rem = standardowo 16 pikseli).' },
    ],
  },
  'css-1': {
    analogyTitle: 'Każdy element na stronie to pudełko na prezent (Box Model)',
    analogyText:
      'Wyobraź sobie zegarek zapakowany w pudełko. Sam zegarek to treść (Content). Gąbka ochronna wewnątrz pudełka wokół zegarka to odstęp wewnętrzny (Padding). Kartonowe ścianki pudełka to obramowanie (Border). A wolne miejsce na półce między tym pudełkiem a sąsiednim pudełkiem to margines zewnętrzny (Margin).',
    glossary: [
      { term: 'padding (do środka)', simpleDefinition: 'Odstęp wewnątrz pudełka — odsuwa tekst od krawędzi ramki.' },
      { term: 'border (ramka)', simpleDefinition: 'Widoczna linia obramowania wokół elementu, np. border: 1px solid gray;' },
      { term: 'margin (na zewnątrz)', simpleDefinition: 'Zewnętrzny odstęp odpychający od siebie sąsiednie elementy.' },
      { term: 'border-radius', simpleDefinition: 'Zaokrąglenie rogów pudełka (np. 12px daje ładnie zaokrągloną kartę).' },
    ],
  },
  'js-1': {
    analogyTitle: 'Zmienne w JavaScript to podpisane szufladki na dane',
    analogyText:
      'Gdy tworzysz grę lub sklep internetowy, program musi pamiętać imię gracza i liczbę jego punktów. Służą do tego zmienne: słowo const tworzy szufladkę ze stałą zawartością (np. imię użytkownika), a słowo let tworzy szufladkę, w której liczba może się zmieniać (np. licznik punktów XP).',
    glossary: [
      { term: 'const (stała)', simpleDefinition: 'Tworzy zmienną, której wartości nie zamierzamy później nadpisywać.' },
      { term: 'let (zmienna)', simpleDefinition: 'Tworzy zmienną, której wartość będzie się zmieniać (np. punkty = punkty + 10).' },
      { term: '=== (potrójne równa się)', simpleDefinition: 'Sprawdza, czy dwie wartości są sobie dokładnie równe.' },
      { term: 'console.log(...)', simpleDefinition: 'Wypisuje wartość zmiennej w okienku konsoli po prawej stronie edytora.' },
    ],
  },
  'js-6': {
    analogyTitle: 'Instrukcja if / else to rozwidlenie dróg z drogowskazem',
    analogyText:
      'Program komputerowy podejmuje decyzje dokładnie tak jak bramkarz przed wejściem: „JEŚLI (if) masz bilet — zapraszamy do środka, W PRZECIWNYM RAZIE (else) — musisz najpierw kupić bilet”. Warunek zawsze zapisujemy w zwykłych nawiasach ( ), a czynność do wykonania w nawiasach klamrowych { }.',
    glossary: [
      { term: 'if (warunek) { ... }', simpleDefinition: 'Wykonuje kod w klamrach tylko wtedy, gdy warunek w nawiasie jest prawdziwy.' },
      { term: 'else { ... }', simpleDefinition: 'Wykonuje się automatycznie, gdy warunek w if okazał się nieprawdziwy.' },
      { term: '>= oraz <=', simpleDefinition: 'Oznacza „większe lub równe” (>=) oraz „mniejsze lub równe” (<=).' },
    ],
  },
};

export function detectPrimaryExerciseTab(
  exercise: Lesson['interactiveExercise']
): 'html' | 'css' | 'js' {
  if (!exercise || !exercise.rules || exercise.rules.length === 0) {
    return 'html';
  }
  const hasJsRule = exercise.rules.some((r) => r.ruleType.startsWith('js_'));
  const hasCssRule = exercise.rules.some((r) => r.ruleType.startsWith('css_'));
  const hasHtmlRule = exercise.rules.some((r) => r.ruleType.startsWith('html_'));

  if (hasJsRule && !hasHtmlRule && !hasCssRule) return 'js';
  if (hasCssRule && !hasHtmlRule && !hasJsRule) return 'css';
  return 'html';
}

export function getBeginnerLessonAid(lesson: Lesson): BeginnerLessonAid {
  const isVeryFirstSteps =
    lesson.moduleId === 1 ||
    lesson.id.startsWith('html-') ||
    (lesson.moduleId === 2 && lesson.order <= 4) ||
    (lesson.moduleId === 3 && lesson.order <= 3) ||
    (lesson.moduleId === 4 && lesson.order <= 3);

  const isBasicModule = lesson.moduleId <= 5;
  const isIntermediateModule = lesson.moduleId >= 6 && lesson.moduleId <= 10;

  const difficultyLabel: BeginnerLessonAid['difficultyLabel'] = isVeryFirstSteps
    ? 'Start od Zera'
    : isBasicModule
    ? 'Podstawy'
    : isIntermediateModule
    ? 'Średniozaawansowany'
    : 'Zaawansowany';

  const difficultySummary =
    difficultyLabel === 'Start od Zera'
      ? 'Lekcja stworzona dla osób zaczynających całkowicie od zera. Nie musisz nic pamiętać na pamięć — korzystaj z gotowych podpowiedzi krok po kroku.'
      : difficultyLabel === 'Podstawy'
      ? 'Łagodne wprowadzenie do praktycznych fundamentów. Każdy fragment kodu możesz skopiować lub podejrzeć w podpowiedziach.'
      : difficultyLabel === 'Średniozaawansowany'
      ? 'Łączymy poznane wcześniej klocki w prawdziwe komponenty. W razie trudności włącz podpowiedź lub wzorzec rozwiązania.'
      : 'Poziom komercyjny przygotowujący do pracy zespołowej i rozmów rekrutacyjnych.';

  const curated = CURATED_BEGINNER_AIDS[lesson.id];

  let defaultAnalogyTitle = 'Jak zrozumieć ten temat na chłopski rozum?';
  let defaultAnalogyText =
    'Nie próbuj uczyć się kodu na pamięć! Programiści w codziennej pracy rozumieją ogólną zasadę działania i zaglądają do przykładów. Przeczytaj najpierw prosty przykład poniżej, a potem zmień w nim jedną rzecz w edytorze.';

  if (!curated) {
    if (lesson.id.startsWith('html-')) {
      defaultAnalogyTitle = 'HTML jak klocki LEGO z etykietami';
      defaultAnalogyText =
        'Każdy element na stronie to osobny klocek HTML z otwarciem (np. <znacznik>) i zamknięciem (</znacznik>). Przeglądarka układa te klocki od góry do dołu dokładnie w takiej kolejności, w jakiej je wpiszesz.';
    } else if (lesson.id.startsWith('css-')) {
      defaultAnalogyTitle = 'CSS to stylista wnętrz Twojej strony';
      defaultAnalogyText =
        'W CSS najpierw wskazujesz palcem element, który chcesz upiększyć (tzw. selektor, np. h1 albo .karta), a potem w nawiasach klamrowych { } wpisujesz cechy wyglądu: kolor tekstu (color), tło (background) lub odstępy (padding).';
    } else if (lesson.id.startsWith('js-')) {
      defaultAnalogyTitle = 'JavaScript to mózg i refleks strony';
      defaultAnalogyText =
        'HTML i CSS tworzą statyczny obrazek. Dopiero JavaScript sprawia, że po kliknięciu przycisku przelicza się koszyk, otwiera okienko lub sprawdza formularz.';
    }
  }

  const defaultGlossary: GlossaryItem[] = lesson.objectives.slice(0, 3).map((obj, idx) => ({
    term: `Kluczowy koncept #${idx + 1}`,
    simpleDefinition: obj,
  }));

  const targetTab = detectPrimaryExerciseTab(lesson.interactiveExercise);
  const tabLabel =
    targetTab === 'js'
      ? 'zakładce script.js (JavaScript)'
      : targetTab === 'css'
      ? 'zakładce style.css (Arkusz stylów)'
      : 'zakładce index.html (Kod HTML)';

  const exerciseWalkthrough = [
    `Krok 1 (Gdzie pisać?): Edytor otworzył się automatycznie na ${tabLabel}. Zadanie: ${lesson.interactiveExercise.task}`,
    ...(lesson.interactiveExercise.hints.length > 0
      ? lesson.interactiveExercise.hints.map((h, i) => `Krok ${i + 2} (Wskazówka): ${h}`)
      : []),
  ];

  return {
    difficultyLabel,
    difficultySummary,
    analogyTitle: curated?.analogyTitle || defaultAnalogyTitle,
    analogyText: curated?.analogyText || defaultAnalogyText,
    keyTakeaways: lesson.objectives,
    glossary: curated?.glossary || defaultGlossary,
    exerciseWalkthrough,
  };
}

