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
    analogyTitle: 'HTML to fundamenty i ściany domu',
    analogyText:
      'Tworzenie strony internetowej przypomina budowę domu. HTML to mury, piętra i drzwi (określa gdzie jest tytuł, a gdzie akapit tekstu). CSS to farba na ścianach, zasłony i meble (wygląd i kolory). JavaScript to instalacja elektryczna i dzwonek do drzwi (interakcja po kliknięciu). W tej lekcji stawiamy pierwsze mury: niewidoczną metryczkę budynku (<head>) oraz widoczne wnętrze domu (<body>).',
    glossary: [
      { term: 'Znacznik (Tag)', simpleDefinition: 'Słowo w nawiasach ostrokątnych, np. <h1> (otwarcie) i </h1> (zamknięcie z ukośnikiem).' },
      { term: '<!DOCTYPE html>', simpleDefinition: 'Pierwsza linijka pliku mówiąca przeglądarce: „To jest nowoczesna strona HTML5”.' },
      { term: '<head> (Głowa)', simpleDefinition: 'Niewidoczna zaplecze strony — zawiera tytuł na karcie przeglądarki (<title>) i polskie znaki (UTF-8).' },
      { term: '<body> (Ciało)', simpleDefinition: 'Wszystko, co użytkownik widzi na ekranie: nagłówki <h1>, teksty <p>, przyciski i zdjęcia.' },
    ],
  },
  'html-7': {
    analogyTitle: 'Strona internetowa jak dobrze złożona gazeta',
    analogyText:
      'Wyobraź sobie gazetę, w której cały tekst ma identyczną czcionkę — nikt by jej nie przeczytał! Dlatego w HTML używamy jednego głównego tytułu na pierwszej stronie (<h1>), tytułów działów (<h2>), zwykłych akapitów (<p>) oraz pogrubień najważniejszych słów (<strong>). Dzięki temu i ludzie, i wyszukiwarka Google od razu rozumieją, co jest najważniejsze.',
    glossary: [
      { term: '<h1> do <h6>', simpleDefinition: 'Nagłówki od najważniejszego (h1 — tytuł całej strony) do najmniejszych podtytułów (h6).' },
      { term: '<p> (Paragraph)', simpleDefinition: 'Zwykły akapit tekstu z automatycznym odstępem nad i pod tekstem.' },
      { term: '<strong>', simpleDefinition: 'Pogrubienie bardzo ważnego fragmentu zdania.' },
      { term: '<code> i <blockquote>', simpleDefinition: '<code> wyróżnia fragment kodu programistycznego, a <blockquote> tworzy elegancki cytat.' },
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
    (lesson.moduleId === 1 && lesson.order <= 4) ||
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
    if (lesson.moduleId === 2) {
      defaultAnalogyTitle = 'HTML jak klocki LEGO z etykietami';
      defaultAnalogyText =
        'Każdy element na stronie to osobny klocek HTML z otwarciem (np. <znacznik>) i zamknięciem (</znacznik>). Przeglądarka układa te klocki od góry do dołu dokładnie w takiej kolejności, w jakiej je wpiszesz.';
    } else if (lesson.moduleId === 3) {
      defaultAnalogyTitle = 'CSS to stylista wnętrz Twojej strony';
      defaultAnalogyText =
        'W CSS najpierw wskazujesz palcem element, który chcesz upiększyć (tzw. selektor, np. h1 albo .karta), a potem w nawiasach klamrowych { } wpisujesz cechy wyglądu: kolor tekstu (color), tło (background) lub odstępy (padding).';
    } else if (lesson.moduleId === 4) {
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

