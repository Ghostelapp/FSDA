import { Module } from '../../types';

export const MODULE_3: Module = {
  id: 3,
  title: 'CSS — Nowoczesne Stylowanie i Układy',
  category: 'Frontend',
  description: 'Selektory, specyficzność, Box Model, elastyczny Flexbox, dwuwymiarowy CSS Grid, podejście Mobile-First, animacje i zmienne CSS.',
  badgeName: 'Mistrz Układów Flexbox & Grid',
  badgeIcon: 'Palette',
  durationHours: 26,
  totalXp: 800,
  prerequisites: ['Moduł 2: HTML'],
  topics: [
    'Kaskada, dziedziczenie i kalkulacja specyficzności selektorów',
    'Box Model od podszewki: content, padding, border, margin oraz box-sizing: border-box',
    'Selektory, pseudoklasy (:hover, :focus, :nth-child), kolory (HEX, RGB, HSL) i jednostki (rem, px, vh, vw)',
    'Typografia webowa (Google Fonts, line-height, clamp) oraz tła i gradienty',
    'Pozycjonowanie elementów (relative, absolute, fixed, sticky) i kontekst warstw z-index',
    'Flexbox: osie main i cross axis, align-items, justify-content, flex-wrap i gap',
    'CSS Grid: grid-template-columns, fr units, repeat, minmax, auto-fit i grid-template-areas',
    'Responsywność i Media Queries: projektowanie w strategii Mobile-First',
    'Nowoczesny CSS: zmienne custom properties, pseudo-klasy (:is, :where, :has) i animacje @keyframes',
  ],
  projectBrief: 'Projekt modułu: W pełni responsywna strona firmowa nowoczesnego produktu SaaS z animacjami i dark mode.',
  lessons: [
    {
      id: 'css-1',
      moduleId: 3,
      moduleTitle: 'CSS — Nowoczesne Stylowanie i Układy',
      title: 'Kaskada, specyficzność selektorów i model pudełkowy (Box Model)',
      slug: 'kaskada-specyficznosc-box-model',
      durationMinutes: 30,
      xpReward: 60,
      order: 1,
      summary: 'Zrozum jak przeglądarka oblicza wymiary elementów i decyduje, które style mają pierwszeństwo. Opanuj box-sizing: border-box i unikaj problemów z overflow.',
      objectives: [
        'Zrozumieć 4 warstwy Box Model: content, padding, border, margin',
        'Zastosować globalny reset box-sizing: border-box',
        'Obliczać wagę specyficzności selektorów (inline vs ID vs klasa vs element)',
      ],
      prerequisites: ['Podstawy semantyki HTML'],
      theoryMarkdown: `W CSS każdy element wyświetlany na stronie internetowej jest traktowany przez silnik przeglądarki jak prostokątne pudełko (**Box Model**). Zrozumienie relacji między wymiarami pudełek, kaskadą oraz wagą selektorów eliminuje 90% problemów z rozsypującym się układem strony.

**1. Cztery warstwy modelu pudełkowego (od środka na zewnątrz):**
1. **Content (Treść):** Właściwy obszar na tekst, grafikę lub dzieci elementu (określany przez \`width\` i \`height\`).
2. **Padding (Dopełnienie wewnętrzne):** Przezroczysta przestrzeń oddychająca między treścią a krawędzią ramki. Tło elementu (\`background-color\`) rozciąga się również pod paddingiem.
3. **Border (Obramowanie):** Widoczna lub niewidoczna ramka otaczająca padding i treść.
4. **Margin (Margines zewnętrzny):** Przezroczysty dystans odpychający sąsiednie elementy od siebie. Uwaga: pionowe marginesy między sąsiadującymi blokami potrafią się ze sobą nakładać (*Margin Collapsing*).

**2. Dlaczego domyślny \`content-box\` psuje układy i jak naprawia to \`border-box\`?**
Według pierwotnej specyfikacji CSS ustawienie \`width: 200px\` dotyczy wyłącznie warstwy \`content\`. Jeśli do takiej karty dodasz \`padding: 20px\` (z lewej i prawej) oraz \`border: 2px\`, rzeczywista szerokość elementu na ekranie urośnie do \`244px\`. Dwie takie karty obok siebie o szerokości \`50%\` nie zmieszczą się w jednym wierszu i spadną pod siebie. Dlatego w każdym nowoczesnym projekcie stosujemy globalny reset:

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\`

Dzięki regule \`border-box\` przeglądarka zamyka \`padding\` oraz \`border\` **wewnątrz** zadeklarowanej szerokości \`width\`. Gdy ustawisz \`width: 320px\`, karta ma dokładnie \`320px\`.

**3. Kaskada i specyficzność selektorów (Specificity):**
Gdy dwie reguły CSS celują w ten sam element, wygrywa reguła o wyższej wadze:
- **Styl inline (\`style="..."\`)** — waga \`1000\` (unikaj w produkcyjnym kodzie),
- **Identyfikator (\`#header\`)** — waga \`100\`,
- **Klasa, pseudoklasa lub atrybut (\`.card\`, \`:hover\`, \`[type="text"]\`)** — waga \`10\`,
- **Selektor typu lub pseudoelement (\`div\`, \`p\`, \`::before\`)** — waga \`1\`.

Jeżeli dwie reguły mają dokładnie tę samą wagę, decyduje kolejność w pliku — wygrywa reguła zapisana niżej w arkuszu (stąd nazwa **Kaskada**).`,
      codeExamples: [
        {
          title: 'Wzorcowy reset Box Model i karta komponentu',
          language: 'css',
          code: `*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.card {
  width: 320px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin: 16px auto;
  background-color: #ffffff;
}`,
          explanation: 'Karta ma dokładnie 320px całkowitej szerokości, bez względu na padding.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Wdróż reset box-sizing', description: 'Zdefiniuj selektor uniwersalny *, *::before, *::after.' },
        { step: 2, title: 'Ustaw padding i margin', description: 'Użyj padding dla przestrzeni wewnętrznej i margin dla odstępów.' },
        { step: 3, title: 'Sprawdź wymiary w DevTools', description: 'Zbadaj schemat pudełkowy w zakładce Elements -> Computed.' },
      ],
      interactiveExercise: {
        id: 'ex-css-1',
        title: 'Zbuduj kartę produktową z border-box i zaokrągleniami',
        instructions: 'W oknie stylów CSS zdefiniuj regułę dla klasy .card: ustaw box-sizing: border-box, padding: 20px, border o grubości przynajmniej 1px oraz border-radius: 12px.',
        task: 'Ostyluj klasę .card z użyciem właściwości padding, border i border-radius.',
        starterCode: {
          html: '<div class="card">\n  <h2>Konto Full Stack Pro</h2>\n  <p>Dostęp do 15 modułów, projektów i certyfikacji.</p>\n  <button type="button">Rozpocznij naukę</button>\n</div>',
          css: '/* Dodaj reguły dla klasy .card poniżej */\n.card {\n  background: #ffffff;\n  max-width: 320px;\n}',
          js: 'console.log("Box Model aktywny.");',
        },
        solutionCode: {
          html: '<div class="card">\n  <h2>Konto Full Stack Pro</h2>\n  <p>Dostęp do 15 modułów, projektów i certyfikacji.</p>\n  <button type="button">Rozpocznij naukę</button>\n</div>',
          css: '.card {\n  box-sizing: border-box;\n  background: #ffffff;\n  max-width: 320px;\n  padding: 20px;\n  border: 1px solid #cbd5e1;\n  border-radius: 12px;\n}\nbutton {\n  background: #4f46e5;\n  color: white;\n  border: none;\n  padding: 8px 16px;\n  border-radius: 6px;\n  cursor: pointer;\n}',
          js: 'console.log("Box Model aktywny.");',
        },
        hints: [
          'W klasie .card dodaj: padding: 20px;',
          'Dodaj: border: 1px solid #cbd5e1;',
          'Dodaj: border-radius: 12px;',
        ],
        rules: [
          { id: 'r1', description: 'Klasa .card definiuje padding', ruleType: 'css_contains', target: 'padding:' },
          { id: 'r2', description: 'Klasa .card posiada border', ruleType: 'css_contains', target: 'border:' },
          { id: 'r3', description: 'Klasa .card posiada border-radius', ruleType: 'css_contains', target: 'border-radius:' },
        ],
      },
      independentTask: {
        title: 'Cienie pudełkowe (box-shadow)',
        instructions: 'Wzbogać kartę o miękki cień: box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1).',
        expectedOutcome: 'Nowoczesny, lekki wygląd komponentu wyniesionego nad tło.',
        starterHint: 'Zastosuj subtelne rozmycie rgba dla naturalnego efektu oświetlenia.',
      },
      quiz: [
        {
          id: 'q-css1-1',
          question: 'Co dzieje się z wymiarami elementu przy box-sizing: border-box?',
          options: [
            'Wartości padding i border są wliczane w zadeklarowaną szerokość (width) elementu',
            'Element automatycznie staje się okrągły',
            'Zewnętrzne marginesy (margin) znikają',
            'Tekst zostaje pogrubiony',
          ],
          correctAnswer: 0,
          explanation: 'border-box gwarantuje, że width: 300px oznacza dokładnie 300px na ekranie wraz z ramką i paddingiem.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Nadużywanie !important do wymuszenia stylów',
          whyItHappens: 'Frustracja spowodowana niezrozumieniem specyficzności selektorów.',
          howToFix: 'Zamiast !important użyj bardziej specyficznego selektora lub przeorganizuj kaskadę.',
          badCode: '.btn { color: red !important; }',
          goodCode: '.modal .btn-primary { color: #dc2626; }',
        },
      ],
      practicalTask: {
        title: 'Inspekcja Box Model w DevTools',
        brief: 'Zbadaj kolorowe warstwy Box Model (pomarańczowy margin, żółty border, zielony padding, niebieski content) w panelu przeglądarki.',
        steps: ['Zbadaj dowolny przycisk na stronie', 'Przewiń zakładkę Styles na sam dół do diagramu pudełka'],
        deliverable: 'Praktyczne zrozumienie relacji między paddingiem a marginesem.',
      },
      completionCriteria: [
        'Zrozumienie 4 warstw modelu pudełkowego',
        'Prawidłowe ostylowanie komponentu karty',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'css-6',
      moduleId: 3,
      moduleTitle: 'CSS — Nowoczesne Stylowanie i Układy',
      title: 'Selektory, pseudoklasy (:hover, :focus) oraz jednostki (px, rem, em, vh/vw)',
      slug: 'selektory-pseudoklasy-jednostki-rem-vh',
      durationMinutes: 30,
      xpReward: 65,
      order: 2,
      summary: 'Poznaj precyzyjne celowanie w elementy DOM za pomocą kombinatorów i pseudoklas oraz dowiedz się, dlaczego profesjonaliści używają jednostek rem i vh/vw zamiast sztywnych pikseli.',
      objectives: [
        'Stosować selektory potomków (.card p), bezpośrednich dzieci (.menu > li) oraz pseudoklasy (:hover, :focus-visible, :nth-child)',
        'Rozróżniać jednostki względne (rem, em, %, vw, vh) od bezwzględnych (px)',
        'Zrozumieć systemy barw w CSS: HEX (#4f46e5), RGB/RGBA oraz nowoczesny HSL',
      ],
      prerequisites: ['Lekcja 1: Box Model'],
      theoryMarkdown: `Pisanie łatwego w utrzymaniu CSS zaczyna się od dwóch decyzji architektonicznych: precyzyjnego celowania w elementy bez zbędnego zagnieżdżania oraz wyboru elastycznych jednostek zamiast sztywnych pikseli.

**1. Kombinatory — precyzyjne zaznaczanie relacji w drzewie DOM:**
- **Selektor potomka (\`.card p\`):** Wybiera każdy akapit wewnątrz \`.card\`, niezależnie od głębokości zagnieżdżenia.
- **Bezpośrednie dziecko (\`.menu > li\`):** Wybiera wyłącznie elementy \`<li>\` leżące bezpośrednio pod \`.menu\`, nie psując zagnieżdżonych podmenu.
- **Sąsiad bezpośredni (\`h2 + p\`):** Styluje pierwszy akapit występujący zaraz po nagłówku \`<h2>\`.

**2. Jednostki w CSS — kiedy używać \`rem\`, \`em\`, \`px\`, a kiedy \`vh/vw\`?**
- **\`rem\` (Root EM):** Jednostka względna względem rozmiaru czcionki elementu \`<html>\` (standardowo \`1rem = 16px\`). Stosuj \`rem\` do \`font-size\`, \`padding\` i \`gap\`. Jeśli użytkownik z wadą wzroku zmieni domyślny rozmiar tekstu w ustawieniach przeglądarki na \`20px\`, cały interfejs w \`rem\` przeskaluje się proporcjonalnie zgodnie ze standardem dostępności WCAG.
- **\`em\`:** Odniesienie do rozmiaru czcionki bieżącego elementu lub jego rodzica — świetne np. dla wewnętrznych odstępów przycisku (\`padding: 0.6em 1.2em\`), które rosną razem z tekstem guzika.
- **\`px\` (Piksele):** Idealne do cienkich linii obramowania (\`border: 1px solid\`) lub precyzyjnych cieni.
- **\`vw\` / \`vh\` / \`dvh\`:** Procent szerokości lub wysokości okna przeglądarki. Na urządzeniach mobilnych używaj \`min-height: 100dvh\`, aby pasek adresu przeglądarki nie ucinał dolnej części ekranu.

**3. Pseudoklasy interakcji i struktury:**
- **\`:hover\`** — reakcja po najechaniu kursorem (na urządzeniach dotykowych stosuj ostrożnie),
- **\`:focus-visible\`** — wyraźna obwódka wyłącznie przy nawigacji klawiaturą (\`Tab\`), bez irytujących ramek po kliknięciu myszką,
- **\`:nth-child(even)\`** — stylowanie parzystych wierszy tabeli lub kart bez dodawania dodatkowych klas w HTML.

**4. Nowoczesny zapis kolorów — dlaczego profesjonaliści lubią HSL?**
Format \`hsl(243, 75%, 59%)\` opisuje barwę przez odcień (*Hue* 0–360°), nasycenie (*Saturation*) i jasność (*Lightness*). Aby uzyskać ciemniejszy kolor przycisku po najechaniu myszką, wystarczy obniżyć sam parametr jasności z \`59%\` na \`48%\`, zachowując spójną paletę całej marki.`,
      codeExamples: [
        {
          title: 'Skalowalne rozmiary w rem oraz stany interaktywne przycisku',
          language: 'css',
          code: `html {
  font-size: 16px; /* 1rem = 16px */
}

.hero-title {
  font-size: 2.25rem; /* 36px */
  color: hsl(243, 75%, 59%);
}

.cta-btn {
  padding: 0.75rem 1.5rem;
  background-color: #4f46e5;
  color: #ffffff;
}

.cta-btn:hover {
  background-color: #4338ca;
}`,
          explanation: 'Zastosowanie rem gwarantuje spełnienie wytycznych dostępności WCAG przy zmianie rozmiaru tekstu w systemie.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Używaj rem dla font-size', description: 'Przyjmij przelicznik: 1rem = 16px, 1.5rem = 24px, 0.875rem = 14px.' },
        { step: 2, title: 'Dodaj stan :hover i :focus', description: 'Każdy klikalny element musi dawać wizualną informację zwrotną.' },
        { step: 3, title: 'Wykorzystaj 100vh dla pełnoekranowego tła', description: 'Ustaw min-height: 100vh zamiast sztywnego height.' },
      ],
      interactiveExercise: {
        id: 'ex-css-units',
        title: 'Ostyluj przycisk z jednostkami rem i pseudoklasą :hover',
        instructions: 'W arkuszu CSS nadaj klasie .btn-action rozmiar czcionki font-size: 1.125rem; oraz zdefiniuj regułę .btn-action:hover zmieniającą tło lub kolor.',
        task: 'Użyj jednostki rem w .btn-action oraz stwórz selektor .btn-action:hover.',
        starterCode: {
          html: '<button class="btn-action" type="button">Najedź na mnie kursorem</button>',
          css: '.btn-action {\n  background: #2563eb;\n  color: white;\n  padding: 10px 20px;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n}\n/* Dodaj font-size w rem oraz regułę :hover */',
          js: 'console.log("Jednostki i pseudoklasy aktywne.");',
        },
        solutionCode: {
          html: '<button class="btn-action" type="button">Najedź na mnie kursorem</button>',
          css: '.btn-action {\n  font-size: 1.125rem;\n  background: #2563eb;\n  color: white;\n  padding: 10px 20px;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n}\n.btn-action:hover {\n  background: #1d4ed8;\n}',
          js: 'console.log("Jednostki i pseudoklasy aktywne.");',
        },
        hints: [
          'Wewnątrz .btn-action dopisz: font-size: 1.125rem;',
          'Pod spodem dodaj: .btn-action:hover { background: #1d4ed8; }',
        ],
        rules: [
          { id: 'r1', description: 'Jednostka rem użyta w stylach', ruleType: 'css_contains', target: 'rem' },
          { id: 'r2', description: 'Pseudoklasa :hover zdefiniowana', ruleType: 'css_contains', target: ':hover' },
        ],
      },
      independentTask: {
        title: 'Tabela z naprzemiennym kolorem wierszy (Zebra Striping)',
        instructions: 'Użyj selektora tr:nth-child(even) { background-color: #f1f5f9; }, aby pokolorować parzyste wiersze tabeli.',
        expectedOutcome: 'Czytelna tabela bez konieczności dopisywania klas w HTML.',
        starterHint: 'Pseudoklasa :nth-child(even) wybiera elementy 2, 4, 6...',
      },
      quiz: [
        {
          id: 'q-css6-1',
          question: 'Ile pikseli ma wartość 1.5rem, jeśli domyślny rozmiar czcionki na elemencie <html> wynosi 16px?',
          options: ['15px', '20px', '24px', '32px'],
          correctAnswer: 2,
          explanation: '1.5 * 16px = 24px. Jednostka rem zawsze mnoży bazowy rozmiar z elementu głównego :root / html.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Ustawianie sztywnego height: 100vh na kontenerze z dużą ilością tekstu',
          whyItHappens: 'Chęć rozciągnięcia sekcji na cały ekran.',
          howToFix: 'Zawsze używaj min-height: 100vh zamiast height: 100vh — dzięki temu na małym ekranie telefonu tekst nie wyleje się poza kontener!',
          badCode: '.section { height: 100vh; } /* Tekst ucięty na telefonie! */',
          goodCode: '.section { min-height: 100vh; } /* Bezpieczne rozciąganie */',
        },
      ],
      practicalTask: {
        title: 'Paleta kolorów w formacie HSL',
        brief: 'Stwórz 3 odcienie tego samego koloru (jasny, podstawowy, ciemny) zmieniając wyłącznie trzeci parametr (Lightness) w funkcji hsl(230, 80%, L%).',
        steps: ['Ustaw tło przycisku na hsl(230, 80%, 55%)', 'Na :hover zmniejsz jasność do 45%'],
        deliverable: 'Spójny system kolorów bez zgadywania kodów HEX.',
      },
      completionCriteria: [
        'Zrozumienie jednostek rem, px, vh/vw',
        'Poprawne użycie pseudoklasy :hover',
        'Zaliczenie quizu min. 80%',
      ],
    },
    {
      id: 'css-7',
      moduleId: 3,
      moduleTitle: 'CSS — Nowoczesne Stylowanie i Układy',
      title: 'Typografia webowa, interlinia, tła i gradienty (linear-gradient)',
      slug: 'typografia-webowa-tla-gradienty',
      durationMinutes: 30,
      xpReward: 65,
      order: 3,
      summary: '90% zawartości internetu to tekst. Naucz się dobierać bezpieczne stosy czcionek (font-family), kontrolować czytelność wiersza (line-height, max-width: 65ch) oraz tworzyć nowoczesne gradienty.',
      objectives: [
        'Definiować stos czcionek z fontami zapasowymi (fallback fonts) i wagami font-weight',
        'Poprawiać czytelność tekstu za pomocą line-height (1.5 - 1.7) oraz letter-spacing',
        'Tworzyć nowoczesne tła gradientowe linear-gradient() oraz kadrować zdjęcia z object-fit: cover',
      ],
      prerequisites: ['Lekcja 2: Selektory i jednostki'],
      theoryMarkdown: `Ponad 90% treści w aplikacjach webowych to tekst, etykiety i przyciski. Nawet najdroższe grafiki nie uratują interfejsu, jeśli czcionka jest trudna do przeczytania, wiersze są zbyt szerokie, a kontrast między tekstem a tłem za niski.

**1. Cztery filary czytelnej typografii w przeglądarce:**
- **Stos czcionek (\`font-family\`):** Zawsze podawaj listę zapasową (fallback stack), np. \`font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;\`. Jeśli zewnętrzny font z Google Fonts chwilowo się nie wczyta, system użytkownika od razu podstawi estetyczną czcionkę natywną zamiast archaicznego Times New Roman.
- **Interlinia (\`line-height\`):** Dla zwykłych akapitów ustawiaj bezjednostkową wartość \`1.55\`–\`1.7\`, aby oko łatwo wracało do początku kolejnej linii. Dla dużych nagłówków (\`h1\`, \`h2\`) interlinia powinna być ciaśniejsza (\`1.15\`–\`1.25\`), dzięki czemu tytuł wygląda spójnie i zwarcie.
- **Optymalna szerokość kolumny (\`max-width: 65ch\`):** Jednostka \`ch\` odpowiada szerokości znaku \`0\` w bieżącym foncie. Gdy akapit ma 140 znaków szerokości na dużym monitorze, czytelnik gubi linijki podczas czytania. Ograniczenie bloku tekstu do \`60ch–70ch\` radykalnie poprawia komfort lektury.
- **Płynne skalowanie (\`clamp()\`):** Zamiast pisać osobne rozmiary nagłówków dla każdego rozmiaru ekranu, użyj \`font-size: clamp(1.75rem, 3.5vw, 3rem);\`, co automatycznie dopasuje wielkość tekstu między telefonem a desktopem.

**2. Nowoczesne tła i wielowarstwowe gradienty:**
Funkcja \`linear-gradient(135deg, #0f172a 0%, #312e81 100%)\` pozwala tworzyć głębię, podświetlenia kart i czytelne nakładki na zdjęcia bez ładowania dodatkowych plików graficznych PNG czy JPEG. W ten sposób skracasz czas ładowania strony i utrzymujesz idealną ostrość na ekranach Retina/HiDPI.

**3. Bezpieczne kadrowanie zdjęć i miniatury (\`object-fit\`):**
Gdy zdjęcie użytkownika ma niestandardowe proporcje, nadanie sztywnego \`width: 80px; height: 80px\` spowoduje jego nienaturalne spłaszczenie. Dodanie \`object-fit: cover;\` oraz \`object-position: center;\` sprawia, że obrazek wypełnia wyznaczony kwadrat lub koło, proporcjonalnie przycinając jedynie wystające krawędzie.`,
      codeExamples: [
        {
          title: 'Nowoczesny baner Hero z gradientem i wzorcową typografią',
          language: 'css',
          code: `.hero-banner {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
  color: #f8fafc;
  padding: 3rem 2rem;
  border-radius: 16px;
}

.hero-banner p {
  font-size: 1.125rem;
  line-height: 1.65;
  max-width: 60ch;
  color: #cbd5e1;
}`,
          explanation: 'Jednostka ch odpowiada szerokości znaku "0" w bieżącej czcionce — idealnie ogranicza szerokość kolumny tekstu.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Ustaw czytelny font-family i line-height na body', description: 'Zapewnij komfort czytania w całej aplikacji.' },
        { step: 2, title: 'Zastosuj linear-gradient na karcie wyróżnionej', description: 'Użyj dwóch zbliżonych kolorów (np. indygo i fioletu).' },
        { step: 3, title: 'Zabezpiecz zdjęcia przed deformacją', description: 'Dodaj object-fit: cover dla awatarów i miniatur.' },
      ],
      interactiveExercise: {
        id: 'ex-css-typo',
        title: 'Stwórz baner z gradientem linear-gradient i interlinią line-height',
        instructions: 'W pliku CSS nadaj klasie .banner tło z funkcją linear-gradient(...) oraz ustaw właściwość line-height: 1.6; dla czytelności tekstu.',
        task: 'Zastosuj linear-gradient oraz line-height w klasie .banner.',
        starterCode: {
          html: '<div class="banner">\n  <h2>Akademia Nowoczesnego Frontendu</h2>\n  <p>Twórz przejrzyste interfejsy dzięki zasadom typografii i subtelnym gradientom.</p>\n</div>',
          css: '.banner {\n  color: white;\n  padding: 24px;\n  border-radius: 12px;\n  font-family: system-ui, sans-serif;\n  /* Dodaj background z linear-gradient oraz line-height */\n}',
          js: 'console.log("Typografia i gradienty gotowe.");',
        },
        solutionCode: {
          html: '<div class="banner">\n  <h2>Akademia Nowoczesnego Frontendu</h2>\n  <p>Twórz przejrzyste interfejsy dzięki zasadom typografii i subtelnym gradientom.</p>\n</div>',
          css: '.banner {\n  background: linear-gradient(135deg, #4f46e5, #7c3aed);\n  line-height: 1.6;\n  color: white;\n  padding: 24px;\n  border-radius: 12px;\n  font-family: system-ui, sans-serif;\n}',
          js: 'console.log("Typografia i gradienty gotowe.");',
        },
        hints: [
          'Dodaj: background: linear-gradient(135deg, #4f46e5, #7c3aed);',
          'Dodaj: line-height: 1.6;',
        ],
        rules: [
          { id: 'r1', description: 'Funkcja linear-gradient użyta w CSS', ruleType: 'css_contains', target: 'linear-gradient' },
          { id: 'r2', description: 'Właściwość line-height zdefiniowana', ruleType: 'css_contains', target: 'line-height:' },
        ],
      },
      independentTask: {
        title: 'Płynna typografia z funkcją clamp()',
        instructions: 'Przetestuj nowoczesną funkcję font-size: clamp(1.5rem, 4vw, 3rem), która płynnie skaluje nagłówek między 1.5rem a 3rem w zależności od szerokości ekranu.',
        expectedOutcome: 'Responsywny nagłówek bez ani jednego Media Query.',
        starterHint: 'Składnia: clamp(minimum, wartość_preferowana, maksimum).',
      },
      quiz: [
        {
          id: 'q-css7-1',
          question: 'Która właściwość CSS zapobiega spłaszczaniu lub rozciąganiu zdjęcia <img> o stałych wymiarach 200x200px?',
          options: [
            'text-align: justify',
            'object-fit: cover',
            'font-weight: bold',
            'display: inline',
          ],
          correctAnswer: 1,
          explanation: 'object-fit: cover zachowuje proporcje obrazu i wypełnia cały wymiar 200x200px, przycinając nadmiar.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Justowanie tekstu (text-align: justify) na wąskich ekranach mobilnych',
          whyItHappens: 'Przyzwyczajenie z drukowanych książek i prac dyplomowych.',
          howToFix: 'W sieci nie ma automatycznego dzielenia wyrazów w każdym języku, przez co justify tworzy gigantyczne "rzeki" pustych przestrzeni między słowami. Używaj text-align: left.',
          badCode: 'p { text-align: justify; } /* Trudne do czytania w sieci */',
          goodCode: 'p { text-align: left; line-height: 1.6; }',
        },
      ],
      practicalTask: {
        title: 'Karta profilu z okrągłym awatarem',
        brief: 'Stwórz awatar 80x80px z border-radius: 50% oraz object-fit: cover.',
        steps: ['Wstaw <img> z prostokątnym zdjęciem', 'Nadaj width: 80px; height: 80px; border-radius: 50%; object-fit: cover'],
        deliverable: 'Idealnie okrągły, niezdeformowany awatar użytkownika.',
      },
      completionCriteria: [
        'Zrozumienie zasad typografii i line-height',
        'Prawidłowe użycie linear-gradient',
        'Zaliczenie quizu min. 80%',
      ],
    },
    {
      id: 'css-8',
      moduleId: 3,
      moduleTitle: 'CSS — Nowoczesne Stylowanie i Układy',
      title: 'Pozycjonowanie elementów (relative, absolute, fixed, sticky) oraz z-index',
      slug: 'pozycjonowanie-position-z-index',
      durationMinutes: 35,
      xpReward: 75,
      order: 4,
      summary: 'Dowiedz się, jak przypiąć pasek nawigacji u góry ekranu (sticky), umieścić plakietkę "PROMOCJA" w rogu karty produktu (relative + absolute) oraz zarządzać warstwami z-index.',
      objectives: [
        'Zrozumieć kluczowy duet: rodzic z position: relative oraz dziecko z position: absolute',
        'Rozróżniać przyklejony nagłówek position: sticky od okna modalnego position: fixed',
        'Kontrolować kolejność nakładania się warstw za pomocą właściwości z-index',
      ],
      prerequisites: ['Lekcje 1–3 modułu CSS'],
      theoryMarkdown: `Domyślnie elementy na stronie układają się kolejno w normalnym przepływie dokumentu (bloki jeden pod drugim, elementy liniowe obok siebie). W nowoczesnych interfejsach często musimy jednak wyjąć pojedynczy komponent z tego przepływu — np. przypiąć górny pasek nawigacji, wyświetlić czerwoną kropkę powiadomień na ikonie albo umieścić okno modalne dokładnie na środku ekranu.

**1. Pięć trybów właściwości \`position\` i ich zastosowania:**
- **\`static\` (domyślna):** Normalny przepływ dokumentu. Element całkowicie ignoruje współrzędne \`top\`, \`right\`, \`bottom\`, \`left\` oraz kolejność \`z-index\`.
- **\`relative\`:** Element pozostaje dokładnie na swoim miejscu w układzie, ale tworzy **lokalny układ odniesienia** (kotwicę) dla dzieci z \`position: absolute\`. Przesunięcie go przez \`top: 4px\` nie wypycha sąsiednich elementów.
- **\`absolute\`:** Wyjmuje element z przepływu (przestaje zajmować miejsce w układzie) i ustawia go względem **najbliższego przodka mającego \`position\` inne niż \`static\`**. Jeśli żaden przodek nie ma np. \`relative\`, element przyklei się do krawędzi całego dokumentu!
- **\`fixed\`:** Przypina element na stałe do okna przeglądarki (*viewport*). Nawet podczas przewijania strony przycisk pomocy, baner cookies lub nakładka modala pozostaje dokładnie w tym samym miejscu.
- **\`sticky\`:** Inteligentne połączenie \`relative\` i \`fixed\`. Element przewija się razem z treścią, dopóki nie dotknie wyznaczonej krawędzi (np. \`top: 0\`), po czym przykleja się do niej w obrębie swojego rodzica. Uwaga: \`sticky\` przestaje działać, jeśli którykolwiek z przodków ma ustawione \`overflow: hidden\`!

**2. Kontekst warstw (\`z-index\` i *Stacking Context*):**
Właściwość \`z-index\` decyduje o tym, który element leży wyżej na osi Z (bliżej oka użytkownika), ale działa **wyłącznie** na elementach pozycjonowanych (innych niż \`static\`) oraz bezpośrednich dzieciach kontenerów Flex i Grid. Zamiast wpisywać przypadkowe wartości typu \`z-index: 999999\`, utrzymuj czytelną skalę w projekcie (np. \`10\` dropdowny, \`20\` sticky header, \`40\` szuflada boczna, \`50\` modale, \`60\` powiadomienia toast).`,
      codeExamples: [
        {
          title: 'Plakietka "NOWOŚĆ" w rogu karty produktu (relative + absolute)',
          language: 'css',
          code: `.product-card {
  position: relative; /* Kotwica dla plakietki! */
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.badge-new {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #ef4444;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
}`,
          explanation: 'Gdyby .product-card nie miało position: relative, plakietka .badge-new uciekłaby do rogu całego okna przeglądarki!',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Nadaj position: relative na kontenerze rodzica', description: 'Utwórz lokalny układ współrzędnych.' },
        { step: 2, title: 'Nadaj position: absolute na elemencie nakładanym', description: 'Określ współrzędne, np. top: 10px; right: 10px;.' },
        { step: 3, title: 'Użyj z-index dla nakładających się warstw', description: 'Wyższa wartość z-index (np. 10 vs 1) wyświetla element na wierzchu.' },
      ],
      interactiveExercise: {
        id: 'ex-css-position',
        title: 'Umieść plakietkę PRO w prawym górnym rogu karty',
        instructions: 'W pliku CSS nadaj klasie .card-box właściwość position: relative;, a klasie .badge właściwość position: absolute; oraz top: 10px; i right: 10px;.',
        task: 'Zastosuj duet position: relative na .card-box oraz position: absolute na .badge.',
        starterCode: {
          html: '<div class="card-box">\n  <span class="badge">PRO</span>\n  <h3>Kurs Architektury CSS</h3>\n  <p>Zaawansowane układy i pozycjonowanie.</p>\n</div>',
          css: '.card-box {\n  /* Dodaj position: relative */\n  background: white;\n  border: 1px solid #cbd5e1;\n  padding: 24px;\n  border-radius: 12px;\n  max-width: 280px;\n}\n.badge {\n  /* Dodaj position: absolute, top i right */\n  background: #4f46e5;\n  color: white;\n  padding: 4px 8px;\n  border-radius: 6px;\n  font-size: 12px;\n}',
          js: 'console.log("Pozycjonowanie CSS aktywne.");',
        },
        solutionCode: {
          html: '<div class="card-box">\n  <span class="badge">PRO</span>\n  <h3>Kurs Architektury CSS</h3>\n  <p>Zaawansowane układy i pozycjonowanie.</p>\n</div>',
          css: '.card-box {\n  position: relative;\n  background: white;\n  border: 1px solid #cbd5e1;\n  padding: 24px;\n  border-radius: 12px;\n  max-width: 280px;\n}\n.badge {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  background: #4f46e5;\n  color: white;\n  padding: 4px 8px;\n  border-radius: 6px;\n  font-size: 12px;\n}',
          js: 'console.log("Pozycjonowanie CSS aktywne.");',
        },
        hints: [
          'W .card-box wpisz: position: relative;',
          'W .badge wpisz: position: absolute; top: 10px; right: 10px;',
        ],
        rules: [
          { id: 'r1', description: 'Właściwość position: relative obecna', ruleType: 'css_contains', target: 'position: relative' },
          { id: 'r2', description: 'Właściwość position: absolute obecna', ruleType: 'css_contains', target: 'position: absolute' },
          { id: 'r3', description: 'Współrzędna top zdefiniowana', ruleType: 'css_contains', target: 'top:' },
        ],
      },
      independentTask: {
        title: 'Przyklejony pasek nawigacji (Sticky Header)',
        instructions: 'Nadaj nagłówkowi strony właściwości position: sticky; top: 0; z-index: 50;, aby pozostawał widoczny podczas przewijania długiego artykułu.',
        expectedOutcome: 'Nowoczesna nawigacja bez przeskakiwania treści pod spodem.',
        starterHint: 'Pamiętaj, że position: sticky wymaga podania przynajmniej jednej krawędzi, np. top: 0.',
      },
      quiz: [
        {
          id: 'q-css8-1',
          question: 'Względem czego pozycjonuje się element posiadający position: absolute?',
          options: [
            'Zawsze względem lewego dolnego rogu monitora',
            'Względem najbliższego elementu nadrzędnego (rodzica/przodka), który ma position inne niż static (np. relative), a w razie jego braku — względem <body>',
            'Względem poprzedzającego go akapitu <p>',
            'Tylko względem znacznika <footer>',
          ],
          correctAnswer: 1,
          explanation: 'Dlatego zawsze pamiętamy o dodaniu position: relative na rodzicu, wewnątrz którego chcemy zamknąć element absolute.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Wpisywanie losowych, gigantycznych wartości z-index: 9999999',
          whyItHappens: 'Próba przebicia innego elementu na siłę ("wojna na z-indexy").',
          howToFix: 'Utrzymuj uporządkowaną skalę warstw (np. 10 dla dropdownu, 20 dla sticky navbaru, 50 dla modala) i pamiętaj, że z-index działa tylko na elementach z position innym niż static lub dzieciach Flex/Grid.',
          badCode: '.modal { z-index: 999999999; }',
          goodCode: '.navbar { z-index: 20; }\n.modal-backdrop { z-index: 50; }',
        },
      ],
      practicalTask: {
        title: 'Czerwona kropka powiadomień na ikonie dzwonka',
        brief: 'Zbuduj kontener ikony z licznikiem nieprzeczytanych wiadomości (małe czerwone kółko w prawym górnym rogu: top: -4px; right: -4px).',
        steps: ['Stwórz przycisk z position: relative', 'Dodaj span z liczbą "3" i position: absolute'],
        deliverable: 'Klasyczny komponent UI paska powiadomień.',
      },
      completionCriteria: [
        'Zrozumienie różnic między relative, absolute, fixed i sticky',
        'Prawidłowe rozwiązanie ćwiczenia z plakietką PRO',
        'Zaliczenie quizu min. 80%',
      ],
    },
    {
      id: 'css-2',
      moduleId: 3,
      moduleTitle: 'CSS — Nowoczesne Stylowanie i Układy',
      title: 'Flexbox: elastyczne układy jednoosiowe i centrowanie elementów',
      slug: 'flexbox-elastyczne-uklady',
      durationMinutes: 35,
      xpReward: 70,
      order: 5,
      summary: 'Koniec z walką o wyśrodkowanie diva w pionie i poziomie! Opanuj elastyczny model Flexbox: osie main i cross, justify-content, align-items, flex-direction oraz gap.',
      objectives: [
        'Zrozumieć działanie osi głównej (Main Axis) i poprzecznej (Cross Axis)',
        'Wyrównywać elementy za pomocą justify-content i align-items',
        'Stosować nowoczesną właściwość gap zamiast niewygodnych marginesów',
      ],
      prerequisites: ['Lekcja 1: Box Model'],
      theoryMarkdown: `**Flexbox (Flexible Box Layout)** to jednoosiowy model układania komponentów, który raz na zawsze rozwiązał odwieczne problemy z równaniem kart, budowaniem pasków nawigacji i centrowaniem treści w pionie.

**1. Relacja Kontener–Dzieci i Dwie Osie Układu:**
Nadanie właściwości \`display: flex\` kontenerowi nadrzędnemu (*Flex Container*) zamienia jego bezpośrednie dzieci w elastyczne elementy (*Flex Items*):
- **Main Axis (Oś główna):** Domyślnie biegnie poziomo od lewej do prawej (\`flex-direction: row\`). Za wyrównanie na tej osi odpowiada **\`justify-content\`** (\`flex-start\`, \`center\`, \`flex-end\`, \`space-between\`, \`space-around\`).
- **Cross Axis (Oś poprzeczna):** Domyślnie biegnie pionowo z góry na dół. Za wyrównanie wzdłuż tej osi odpowiada **\`align-items\`** (\`stretch\`, \`center\`, \`flex-start\`, \`flex-end\`).

Jeśli zmienisz kierunek układu na kolumnowy (\`flex-direction: column\`), osie zamieniają się miejscami: \`justify-content\` steruje wtedy pionem, a \`align-items\` poziomem!

**2. Centrowanie idealne i brak zbędnych marginesów (\`gap\`):**
\`\`\`css
.center-box {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}
\`\`\`
Właściwość \`gap\` wstawia identyczny odstęp wyłącznie *pomiędzy* elementami, eliminując potrzebę czyszczenia marginesu z ostatniego elementu przez \`:last-child\`.

**3. Kontrola rozciągania i kurczenia dzieci (\`flex: 1\`, \`flex-wrap\`):**
- **\`flex-wrap: wrap\`:** Pozwala elementom przejść do kolejnej linii, gdy zabraknie miejsca na ekranie telefonu — bez tego elementy potrafią wypchnąć kontener poza szerokość ekranu.
- **\`flex: 1\`:** Skrót od \`flex-grow: 1; flex-shrink: 1; flex-basis: 0%\` — sprawia, że wybrana sekcja (np. główna część strony między nagłówkiem a stopką albo pole wyszukiwarki w navbarze) zajmuje całą pozostałą wolną przestrzeń.
- **\`flex-shrink: 0\`:** Niezastąpione przy ikonach i awatarach w wąskich wierszach — zapobiega spłaszczeniu okrągłego zdjęcia, gdy obok pojawi się długi tekst.`,
      codeExamples: [
        {
          title: 'Responsywny pasek nawigacji z Flexbox',
          language: 'css',
          code: `nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #0f172a;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
  list-style: none;
}`,
          explanation: 'space-between odpycha logo do lewej, a linki do prawej krawędzi paska.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Włącz tryb Flex na kontenerze nadrzędnym', description: 'Ustaw display: flex.' },
        { step: 2, title: 'Wyrównaj elementy wzdłuż osi głównej', description: 'Użyj justify-content: space-between lub center.' },
        { step: 3, title: 'Wyrównaj w osi poprzecznej i dodaj gap', description: 'Ustaw align-items: center oraz gap: 16px.' },
      ],
      interactiveExercise: {
        id: 'ex-css-2',
        title: 'Wyśrodkuj elementy i stwórz elastyczny pasek nawigacji',
        instructions: 'W pliku CSS nadaj klasie .navbar styl display: flex, justify-content: space-between oraz align-items: center.',
        task: 'Zastosuj display: flex, justify-content i align-items w .navbar.',
        starterCode: {
          html: '<header class="navbar">\n  <div class="logo">DevAcademy</div>\n  <nav class="menu">\n    <a href="#">Kursy</a>\n    <a href="#">Projekty</a>\n    <a href="#">Kontakt</a>\n  </nav>\n</header>',
          css: '/* Ostyluj .navbar poniżej */\n.navbar {\n  background: #1e1b4b;\n  color: white;\n  padding: 16px;\n}\n.menu a {\n  color: #c7d2fe;\n  margin-left: 14px;\n  text-decoration: none;\n}',
          js: 'console.log("Flexbox aktywny.");',
        },
        solutionCode: {
          html: '<header class="navbar">\n  <div class="logo">DevAcademy</div>\n  <nav class="menu">\n    <a href="#">Kursy</a>\n    <a href="#">Projekty</a>\n    <a href="#">Kontakt</a>\n  </nav>\n</header>',
          css: '.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background: #1e1b4b;\n  color: white;\n  padding: 16px;\n}\n.menu a {\n  color: #c7d2fe;\n  margin-left: 14px;\n  text-decoration: none;\n}',
          js: 'console.log("Flexbox aktywny.");',
        },
        hints: [
          'Dodaj display: flex;',
          'Dodaj justify-content: space-between;',
          'Dodaj align-items: center;',
        ],
        rules: [
          { id: 'r1', description: 'Właściwość display: flex obecna', ruleType: 'css_contains', target: 'display: flex' },
          { id: 'r2', description: 'Wyrównanie justify-content: space-between', ruleType: 'css_contains', target: 'justify-content: space-between' },
          { id: 'r3', description: 'Wyrównanie pionowe align-items: center', ruleType: 'css_contains', target: 'align-items: center' },
        ],
      },
      independentTask: {
        title: 'Zawijanie wierszy flex-wrap: wrap',
        instructions: 'Dodaj właściwość flex-wrap: wrap, aby elementy na małych ekranach płynnie przeskakiwały do kolejnej linii.',
        expectedOutcome: 'Brak poziomego paska przewijania na smartfonach.',
        starterHint: 'flex-wrap: wrap zabezpiecza przed ściskaniem elementów do zera.',
      },
      quiz: [
        {
          id: 'q-css2-1',
          question: 'Która właściwość steruje wyrównaniem elementów wzdłuż osi głównej (Main Axis)?',
          options: ['align-items', 'justify-content', 'flex-direction', 'align-content'],
          correctAnswer: 1,
          explanation: 'justify-content odpowiada za rozmieszczenie elementów wzdłuż osi głównej (np. w poziomie przy flex-direction: row).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Ustawianie display: flex na elementach potomnych zamiast na rodzicu',
          whyItHappens: 'Niezrozumienie relacji rodzic (flex container) a dziecko (flex item).',
          howToFix: 'Regułę display: flex zawsze nadajemy kontenerowi nadrzędnemu, którego dzieci chcemy rozmieścić.',
          badCode: '.item { display: flex; } /* Błędne założenie */',
          goodCode: '.parent-container { display: flex; } /* Prawidłowo */',
        },
      ],
      practicalTask: {
        title: 'Kafelkowy układ wizytówek',
        brief: 'Zbuduj rząd 3 kart z display: flex i gap: 20px, obserwując jak rozkładają się na ekranie.',
        steps: ['Utwórz kontener z 3 kartami', 'Dodaj display: flex i gap: 20px', 'Zbadaj elastyczność'],
        deliverable: 'Komponent wiersza kart oparty o Flexbox.',
      },
      completionCriteria: [
        'Zrozumienie osi głównej i poprzecznej',
        'Prawidłowe zastosowanie justify-content i align-items',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'css-3',
      moduleId: 3,
      moduleTitle: 'CSS — Nowoczesne Stylowanie i Układy',
      title: 'CSS Grid: dwuwymiarowe siatki, jednostki fr i auto-fit',
      slug: 'css-grid-dwuwymiarowe-siatki',
      durationMinutes: 40,
      xpReward: 80,
      order: 3,
      summary: 'Podczas gdy Flexbox zarządza jednym wymiarem, CSS Grid daje pełną kontrolę nad wierszami i kolumnami jednocześnie. Poznaj potęgę jednostki fr, repeat() oraz auto-fit bez pisania media queries!',
      objectives: [
        'Zrozumieć różnicę między jednoosiowym Flexboxem a dwuwymiarowym CSS Grid',
        'Tworzyć kolumny o ułamkowej szerokości z użyciem jednostki fr (fraction)',
        'Budować samo-dostosowujące się siatki z funkcją repeat(auto-fit, minmax(250px, 1fr))',
      ],
      prerequisites: ['Lekcja 2: Flexbox'],
      theoryMarkdown: `Podczas gdy Flexbox perfekcyjnie sprawdza się w układaniu elementów w jednym kierunku (pasek nawigacji, wiersz przycisków), **CSS Grid** to dwuwymiarowy system siatki pozwalający jednocześnie kontrolować **wiersze oraz kolumny** całego widoku lub galerii kart.

**1. Kiedy wybrać CSS Grid zamiast Flexboxa?**
Stosuj **Flexbox**, gdy rozmiar elementów ma wynikać z ich własnej treści i potrzebujesz płynnego rozmieszczenia w jednej linii. Wybieraj **CSS Grid**, gdy chcesz narzucić sztywną lub responsywną strukturę kolumn od zewnątrz (np. układ całej strony z panelem bocznym, siatka produktów w sklepie e-commerce, dashboard analityczny z kartami o równej szerokości).

**2. Jednostka ułamkowa \`fr\` i funkcja \`repeat()\`:**
- \`display: grid\` włącza silnik siatki na kontenerze rodzica.
- \`grid-template-columns: 280px 1fr\` tworzy lewy panel boczny o stałej szerokości \`280px\` oraz obszar główny, który automatycznie wypełnia całą resztę ekranu.
- \`grid-template-columns: 1fr 2fr\` dzieli wolne miejsce w stosunku 1:2 (33.3% i 66.6%), uwzględniając już szerokość odstępów \`gap\`, dzięki czemu nic nigdy nie wyjdzie poza ekran!

**3. Responsywna siatka bez ani jednego \`@media\` query:**
\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
\`\`\`
To jeden z najbardziej użytecznych wzorców w całym CSS. Mówi przeglądarce: *„Umieść w jednym rzędzie tyle równych kolumn, ile się zmieści, pod warunkiem, że żadna nie będzie węższa niż 280px”*. Na smartfonie siatka sama ułoży 1 kolumnę, na tablecie 2, a na dużym monitorze 4!

**4. Równe wysokości wierszy i \`min-width: 0\`:**
Wszystkie karty w tym samym rzędzie CSS Grid domyślnie rozciągają się do wysokości najwyższej z nich. Jeśli wewnątrz komórki siatki znajduje się długi blok kodu \`<pre>\`, dodaj na dziecku \`min-width: 0\`, aby nie rozpychało kolumny ponad \`1fr\`.`,
      codeExamples: [
        {
          title: 'Siatka kafelków portfolio z auto-fit',
          language: 'css',
          code: `.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  padding: 20px;
}

.project-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}`,
          explanation: 'Układ jest w 100% responsywny bez ani jednej reguły @media query.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zadeklaruj display: grid', description: 'Włącz układ siatki na elemencie nadrzędnym.' },
        { step: 2, title: 'Zdefiniuj kolumny za pomocą repeat i fr', description: 'Użyj grid-template-columns: repeat(3, 1fr).' },
        { step: 3, title: 'Dodaj odstęp gap', description: 'Ustaw gap: 20px dla przejrzystości.' },
      ],
      interactiveExercise: {
        id: 'ex-css-3',
        title: 'Zbuduj 3-kolumnową siatkę produktów w CSS Grid',
        instructions: 'W pliku CSS zdefiniuj na klasie .grid-container reguły: display: grid, grid-template-columns z 3 równymi kolumnami (użyj repeat(3, 1fr) lub 1fr 1fr 1fr) oraz gap: 20px.',
        task: 'Zastosuj display: grid, grid-template-columns i gap w .grid-container.',
        starterCode: {
          html: '<div class="grid-container">\n  <div class="item">Produkt 1</div>\n  <div class="item">Produkt 2</div>\n  <div class="item">Produkt 3</div>\n</div>',
          css: '/* Zdefiniuj siatkę poniżej */\n.grid-container {\n  background: #f8fafc;\n  padding: 20px;\n}\n.item {\n  background: #4f46e5;\n  color: white;\n  padding: 30px;\n  text-align: center;\n  border-radius: 8px;\n}',
          js: 'console.log("CSS Grid aktywny.");',
        },
        solutionCode: {
          html: '<div class="grid-container">\n  <div class="item">Produkt 1</div>\n  <div class="item">Produkt 2</div>\n  <div class="item">Produkt 3</div>\n</div>',
          css: '.grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n  background: #f8fafc;\n  padding: 20px;\n}\n.item {\n  background: #4f46e5;\n  color: white;\n  padding: 30px;\n  text-align: center;\n  border-radius: 8px;\n}',
          js: 'console.log("CSS Grid aktywny.");',
        },
        hints: [
          'Wpisz display: grid;',
          'Wpisz grid-template-columns: repeat(3, 1fr); lub 1fr 1fr 1fr;',
          'Dodaj gap: 20px;',
        ],
        rules: [
          { id: 'r1', description: 'Właściwość display: grid obecna', ruleType: 'css_contains', target: 'display: grid' },
          { id: 'r2', description: 'Kolumny w grid-template-columns', ruleType: 'css_contains', target: 'grid-template-columns' },
          { id: 'r3', description: 'Odstęp gap zdefiniowany', ruleType: 'css_contains', target: 'gap:' },
        ],
      },
      independentTask: {
        title: 'Obszary siatki grid-template-areas',
        instructions: 'Zdefiniuj nazwane obszary siatki: "header header" "sidebar main" "footer footer".',
        expectedOutcome: 'Czytelny, semantyczny układ witryny za pomocą słów kluczowych.',
        starterHint: 'Wykorzystaj właściwość grid-template-areas na rodzicu i grid-area na dzieciach.',
      },
      quiz: [
        {
          id: 'q-css3-1',
          question: 'Co oznacza jednostka "1fr" w CSS Grid?',
          options: [
            'Dokładnie 1 piksel',
            'Jeden ułamek (fraction) wolnej przestrzeni w kontenerze siatki',
            'Długość jednej linijki tekstu',
            'Wymiar 1 cala francuskiego',
          ],
          correctAnswer: 1,
          explanation: 'Jednostka fr dzieli wolną przestrzeń proporcjonalnie między kolumny lub wiersze.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Stosowanie sztywnych pikseli (width: 300px) w kolumnach zamiast fr',
          whyItHappens: 'Przyzwyczajenie ze statycznych projektów w Figmie.',
          howToFix: 'Zamiast sztywnych wartości px używaj fr lub minmax() — dzięki temu siatka dopasowuje się do każdego ekranu.',
          badCode: 'grid-template-columns: 350px 350px 350px;',
          goodCode: 'grid-template-columns: repeat(3, 1fr);',
        },
      ],
      practicalTask: {
        title: 'Siatka galerii zdjęć',
        brief: 'Zbuduj galerię 6 zdjęć z użyciem repeat(auto-fit, minmax(200px, 1fr)) i sprawdź jej responsywność przy zmianie szerokości okna.',
        steps: ['Stwórz siatkę z 6 elementami', 'Dodaj regułę z auto-fit i minmax', 'Zmieniaj szerokość podglądu'],
        deliverable: 'Prawdziwie płynna galeria kafelkowa.',
      },
      completionCriteria: [
        'Zrozumienie dwuwymiarowego układu CSS Grid',
        'Prawidłowe użycie jednostki fr i odstępu gap',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'css-4',
      moduleId: 3,
      moduleTitle: 'CSS — Nowoczesne Stylowanie i Układy',
      title: 'Responsywność i Media Queries w podejściu Mobile-First',
      slug: 'responsywnosc-mobile-first-media-queries',
      durationMinutes: 35,
      xpReward: 70,
      order: 4,
      summary: 'Ponad 65% ruchu w sieci generują smartfony. Dowiedz się, dlaczego projektowanie Mobile-First jest standardem rynkowym i jak pisać czyste reguły @media (min-width).',
      objectives: [
        'Zrozumieć filozofię projektowania Mobile-First i progresywnego wzbogacania',
        'Pisać zapytania mediów za pomocą @media (min-width: 768px)',
        'Unikać pułapki przeciążania kodu zbędnymi regułami max-width',
      ],
      prerequisites: ['Lekcje 1-3 z modułu CSS'],
      theoryMarkdown: `Ponad 60% ruchu internetowego pochodzi dzisiaj ze smartfonów. Projektowanie **Mobile-First** nie polega na dopasowaniu desktopowej strony pod koniec pracy — to filozofia, w której najpierw budujesz lekki, czytelny układ na wąski ekran telefonu (360–390 px), a następnie stopniowo wzbogacasz go dla tabletów i monitorów.

**1. Jak działają zapytania mediów (\`@media (min-width)\`)?**
W strategii Mobile-First wszystkie bazowe reguły poza blokami \`@media\` dotyczą małych ekranów (układ jednokoluwnowy, \`flex-direction: column\`, mniejsze marginesy). Kolejne progi (*breakpoints*) dokładają rozszerzenia wyłącznie w górę:

\`\`\`css
/* 1. Domyślnie dla smartfonów (1 kolumna, pionowy układ) */
.container {
  display: flex;
  flex-direction: column;
  padding: 16px;
}

/* 2. Od tabletów wzwyż (>= 768px) */
@media (min-width: 768px) {
  .container {
    flex-direction: row;
    padding: 24px;
  }
}

/* 3. Od laptopów wzwyż (>= 1024px) */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
\`\`\`

**2. Dlaczego \`min-width\` wygrywa z \`max-width\`?**
- Smartfony nie muszą przetwarzać nadpisywanych reguł desktopowych — podstawowy styl od razu jest poprawny.
- Kod rośnie addytywnie zamiast tworzyć wojny na resetowanie wcześniejszych właściwości (tzw. *spaghetti CSS* przy dziesiątkach \`@media (max-width)\`).
- Łatwiej utrzymać czytelne marginesy i hierarchię treści, bo projektując najpierw na mały ekran, od razu eliminujesz zbędne ozdobniki.

**3. Obowiązkowy fundament RWD w HTML i grafice:**
Żadne Media Query nie zadziała poprawnie, jeśli w sekcji \`<head>\` dokumentu HTML zabraknie tagu \`<meta name="viewport" content="width=device-width, initial-scale=1.0" />\`. Pamiętaj też o regule \`img, svg, video { max-width: 100%; height: auto; }\` oraz przyciskach o wysokości co najmniej \`44px\`, aby wygodnie trafić w nie kciukiem na ekranie dotykowym.`,
      codeExamples: [
        {
          title: 'Responsywny układ nawigacji hamburger -> pasek poziomy',
          language: 'css',
          code: `/* Domyślnie: menu schowane na telefonie */
.nav-menu {
  display: none;
  flex-direction: column;
}

/* Na tabletach i monitorach: menu widoczne w poziomie */
@media (min-width: 768px) {
  .nav-menu {
    display: flex;
    flex-direction: row;
    gap: 24px;
  }
  
  .hamburger-btn {
    display: none;
  }
}`,
          explanation: 'Czysty podział: przycisk hamburgera znika automatycznie powyżej 768px.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Projektuj bez media query dla 375px', description: 'Napisz bazowy styl dla małego ekranu.' },
        { step: 2, title: 'Dodaj breakpoint min-width: 768px', description: 'Rozwiń układ w wiersz lub dodaj drugą kolumnę.' },
        { step: 3, title: 'Przetestuj w Device Toolbar', description: 'Wciśnij Ctrl+Shift+M w DevTools i sprawdź płynność skalowania.' },
      ],
      interactiveExercise: {
        id: 'ex-css-4',
        title: 'Wdróż Media Query Mobile-First dla układu kolumnowego',
        instructions: 'Napisz regułę CSS: domyślnie .stack-container ma mieć flex-direction: column, a wewnątrz zapytania @media (min-width: 768px) zmień flex-direction na row.',
        task: 'Ustaw flex-direction: column domyślnie oraz flex-direction: row w @media (min-width: 768px).',
        starterCode: {
          html: '<div class="stack-container">\n  <div class="box">Kolumna A</div>\n  <div class="box">Kolumna B</div>\n</div>',
          css: '.stack-container {\n  display: flex;\n  /* Ustaw flex-direction */\n  gap: 16px;\n}\n.box {\n  flex: 1;\n  background: #3b82f6;\n  color: white;\n  padding: 20px;\n  text-align: center;\n}\n\n/* Dodaj @media (min-width: 768px) poniżej */',
          js: 'console.log("Media queries aktywne.");',
        },
        solutionCode: {
          html: '<div class="stack-container">\n  <div class="box">Kolumna A</div>\n  <div class="box">Kolumna B</div>\n</div>',
          css: '.stack-container {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.box {\n  flex: 1;\n  background: #3b82f6;\n  color: white;\n  padding: 20px;\n  text-align: center;\n}\n\n@media (min-width: 768px) {\n  .stack-container {\n    flex-direction: row;\n  }\n}',
          js: 'console.log("Media queries aktywne.");',
        },
        hints: [
          'Domyślnie dodaj flex-direction: column;',
          'Dodaj blok: @media (min-width: 768px) { .stack-container { flex-direction: row; } }',
        ],
        rules: [
          { id: 'r1', description: 'Domyślny styl column zdefiniowany', ruleType: 'css_contains', target: 'flex-direction: column' },
          { id: 'r2', description: 'Zapytanie @media (min-width: 768px) obecne', ruleType: 'css_contains', target: 'min-width: 768px' },
          { id: 'r3', description: 'Zmiana na row wewnątrz media query', ruleType: 'css_contains', target: 'flex-direction: row' },
        ],
      },
      independentTask: {
        title: 'Breakpoint dla dużych monitorów 1200px',
        instructions: 'Dodaj drugie zapytanie @media (min-width: 1200px) ograniczające max-width do 1140px i wyśrodkowujące kontener (margin: 0 auto).',
        expectedOutcome: 'Elegancka prezentacja aplikacji na szerokich monitorach.',
        starterHint: 'Zastosowanie margin: 0 auto to standard centrowania bloków z zadeklarowanym max-width.',
      },
      quiz: [
        {
          id: 'q-css4-1',
          question: 'Dlaczego w podejściu Mobile-First stosujemy min-width zamiast max-width?',
          options: [
            'Styl bazowy piszemy dla smartfonów, a kolejne media queries wzbogacają układ wraz ze wzrostem szerokości ekranu',
            'Przeglądarka Chrome nie obsługuje reguły max-width',
            'Jest to wymóg bazy danych PostgreSQL',
            'Wymusza to konwersję na język C++',
          ],
          correctAnswer: 0,
          explanation: 'Mobile-first buduje styl progresywnie od najmniejszego ekranu w górę (min-width).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Brak tagu <meta name="viewport"> w sekcji head dokumentu HTML',
          whyItHappens: 'Tworzenie pliku od zera bez użycia wzorca HTML5.',
          howToFix: 'Bez tagu viewport przeglądarka mobilna udaje monitor o szerokości 980px i mikroskopijnie pomniejsza całą stronę. Zawsze dodawaj viewport!',
          badCode: '<!-- Brak meta viewport w head -->',
          goodCode: '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        },
      ],
      practicalTask: {
        title: 'Symulacja urządzeń mobilnych w DevTools',
        brief: 'Otwórz DevTools, wybierz profil iPhone 14 Pro, a następnie przełącz na iPad Pro, sprawdzając działanie breakpointów.',
        steps: ['Włącz tryb Device Toolbar (Ctrl+Shift+M)', 'Zmień orientację pion/poziom', 'Zaobserwuj zmianę stylów'],
        deliverable: 'Praktyczna weryfikacja RWD na różnych urządzeniach.',
      },
      completionCriteria: [
        'Zrozumienie strategii Mobile-First',
        'Prawidłowe zastosowanie reguły @media (min-width)',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'css-5',
      moduleId: 3,
      moduleTitle: 'CSS — Nowoczesne Stylowanie i Układy',
      title: 'Zmienne CSS (Custom Properties), animacje i przejścia',
      slug: 'zmienne-css-animacje-przejscia',
      durationMinutes: 35,
      xpReward: 70,
      order: 5,
      summary: 'Twórz dynamiczne motywy (Dark / Light Mode) za pomocą natywnych zmiennych CSS oraz dodawaj profesjonalne mikrointerakcje: transition, transform i klatki kluczowe @keyframes.',
      objectives: [
        'Definiować i stosować zmienne CSS w pseudoklasie :root (--primary-color)',
        'Budować płynne stany hover z użyciem transition i transform: translateY(-4px)',
        'Tworzyć zapętlone animacje ładowania z @keyframes',
      ],
      prerequisites: ['Wszystkie wcześniejsze lekcje modułu CSS'],
      theoryMarkdown: `Nowoczesny CSS pozwala budować spójne systemy projektowe (Design Systems) oraz płynne mikrointerakcje bez instalowania ciężkich bibliotek animacji czy preprocesorów typu Sass.

**1. Zmienne CSS (Custom Properties) i dynamiczne motywy (Dark Mode):**
Zmienne zadeklarowane w selektorze \`:root\` są dostępne w całej aplikacji i w przeciwieństwie do zmiennych w Sass żyją w przeglądarce w czasie rzeczywistym — możesz je nawet zmieniać z poziomu JavaScriptu albo przełączać jednym atrybutem:

\`\`\`css
:root {
  --primary: #4f46e5;
  --bg-color: #ffffff;
  --text-color: #0f172a;
}

[data-theme="dark"] {
  --bg-color: #0f172a;
  --text-color: #f8fafc;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}
\`\`\`

Z funkcji \`var(--zmienna, #fallback)\` korzystasz w dowolnym miejscu — podając opcjonalny drugi parametr na wypadek, gdyby zmienna nie była zdefiniowana.

**2. Płynne przejścia (\`transition\`) i wydajność 60 FPS na GPU:**
\`\`\`css
.button {
  background-color: var(--primary);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
  background-color: #4338ca;
}
\`\`\`
Aby animacje nie zacinały się na słabszych telefonach, animuj wyłącznie właściwości obsługiwane bezpośrednio przez warstwę kompozycji GPU: **\`transform\`** (przesunięcie, skala, obrót) oraz **\`opacity\`** (przezroczystość). Unikaj animowania \`width\`, \`height\`, \`margin\` czy \`top/left\`, które zmuszają przeglądarkę do kosztownego przeliczania geometrii całej strony (*Layout Reflow*).

**3. Pętle animacji \`@keyframes\` i dostępność (\`prefers-reduced-motion\`):**
Dla wskaźników ładowania czy subtelnego pulsowania statusu *Live* używamy reguły \`@keyframes\`. Zadbaj też o użytkowników cierpiących na zaburzenia błędnika — owiń intensywne efekty w \`@media (prefers-reduced-motion: reduce)\`, wyłączając lub wyciszając ruch zgodnie z preferencjami systemu operacyjnego.`,
      codeExamples: [
        {
          title: 'Animacja pulsowania przycisku z @keyframes',
          language: 'css',
          code: `@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.85; }
  100% { transform: scale(1); opacity: 1; }
}

.badge-live {
  display: inline-block;
  padding: 4px 8px;
  background-color: #ef4444;
  color: white;
  border-radius: 9999px;
  animation: pulse 2s infinite ease-in-out;
}`,
          explanation: 'Właściwość transform jest renderowana bezpośrednio przez kartę graficzną w 60 klatkach na sekundę.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zadeklaruj zmienne w :root', description: 'Użyj składni --nazwa-zmiennej: wartość.' },
        { step: 2, title: 'Użyj zmiennej w regule', description: 'Skorzystaj z funkcji var(--nazwa-zmiennej).' },
        { step: 3, title: 'Dodaj transition na stan hover', description: 'Ustaw transition: transform 0.2s ease.' },
      ],
      interactiveExercise: {
        id: 'ex-css-5',
        title: 'Zdefiniuj zmienną CSS i dodaj płynne przejście',
        instructions: 'W sekcji :root zadeklaruj zmienną --brand-color: #4f46e5; a następnie w klasie .magic-btn użyj var(--brand-color) jako background oraz dodaj właściwość transition: transform 0.2s.',
        task: 'Zdefiniuj --brand-color w :root i użyj jej z transition w .magic-btn.',
        starterCode: {
          html: '<button class="magic-btn" type="button">Interaktywny Przycisk</button>',
          css: '/* Zadeklaruj :root poniżej */\n\n.magic-btn {\n  color: white;\n  border: none;\n  padding: 12px 24px;\n  border-radius: 8px;\n  font-weight: bold;\n  cursor: pointer;\n}\n.magic-btn:hover {\n  transform: translateY(-3px);\n}',
          js: 'console.log("Animacje aktywne.");',
        },
        solutionCode: {
          html: '<button class="magic-btn" type="button">Interaktywny Przycisk</button>',
          css: ':root {\n  --brand-color: #4f46e5;\n}\n\n.magic-btn {\n  background: var(--brand-color);\n  transition: transform 0.2s ease;\n  color: white;\n  border: none;\n  padding: 12px 24px;\n  border-radius: 8px;\n  font-weight: bold;\n  cursor: pointer;\n}\n.magic-btn:hover {\n  transform: translateY(-3px);\n}',
          js: 'console.log("Animacje aktywne.");',
        },
        hints: [
          'Dodaj: :root { --brand-color: #4f46e5; }',
          'W .magic-btn dodaj: background: var(--brand-color);',
          'W .magic-btn dodaj: transition: transform 0.2s;',
        ],
        rules: [
          { id: 'r1', description: 'Deklaracja :root z --brand-color', ruleType: 'css_contains', target: '--brand-color' },
          { id: 'r2', description: 'Użycie funkcji var(--brand-color)', ruleType: 'css_contains', target: 'var(--brand-color)' },
          { id: 'r3', description: 'Właściwość transition obecna', ruleType: 'css_contains', target: 'transition:' },
        ],
      },
      independentTask: {
        title: 'Przełącznik motywu ciemnego',
        instructions: 'Zdefiniuj zmienne tła dla trybu jasnego i ciemnego z użyciem reguły @media (prefers-color-scheme: dark).',
        expectedOutcome: 'Automatyczne dopasowanie kolorów strony do ustawień systemu użytkownika.',
        starterHint: '@media (prefers-color-scheme: dark) { :root { --bg: #0f172a; } }',
      },
      quiz: [
        {
          id: 'q-css5-1',
          question: 'Które właściwości CSS są najbardziej optymalne wydajnościowo do animacji (działają na GPU)?',
          options: [
            'transform oraz opacity',
            'width oraz height',
            'margin-left oraz top',
            'border-width oraz padding',
          ],
          correctAnswer: 0,
          explanation: 'transform i opacity są komponowane bezpośrednio przez procesor graficzny (Composite Layer) bez wywoływania kosztownego Layout i Paint.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Animowanie właściwości all: transition: all 0.5s',
          whyItHappens: 'Lenistwo w pisaniu konkretnych nazw właściwości.',
          howToFix: 'Zawsze precyzuj animowane właściwości (np. transition: transform 0.2s, background-color 0.2s), aby nie obciążać niepotrzebnie silnika przeglądarki.',
          badCode: 'transition: all 0.3s; /* Nieoptymalne */',
          goodCode: 'transition: transform 0.2s ease, opacity 0.2s ease;',
        },
      ],
      practicalTask: {
        title: 'Stworzenie kręcącego się loadera (spinner)',
        brief: 'Zbuduj okrągły wskaźnik ładowania z border-radius: 50% i animacją transform: rotate(360deg).',
        steps: ['Utwórz div z klasą spinner', 'Napisz @keyframes spin { to { transform: rotate(360deg); } }', 'Podepnij animation'],
        deliverable: 'Płynny wskaźnik oczekiwania na dane.',
      },
      completionCriteria: [
        'Zrozumienie zmiennych CSS i funkcji var()',
        'Prawidłowe zastosowanie transition i transform',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
  ],
};
