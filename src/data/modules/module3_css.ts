import { Module } from '../../types';

export const MODULE_3: Module = {
  id: 3,
  title: 'CSS — Nowoczesne Stylowanie i Układy',
  category: 'Frontend',
  description: 'Selektory, specyficzność, Box Model, elastyczny Flexbox, dwuwymiarowy CSS Grid, podejście Mobile-First, animacje i zmienne CSS.',
  badgeName: 'Mistrz Układów Flexbox & Grid',
  badgeIcon: 'Palette',
  durationHours: 20,
  totalXp: 600,
  prerequisites: ['Moduł 2: HTML'],
  topics: [
    'Kaskada, dziedziczenie i kalkulacja specyficzności selektorów',
    'Box Model od podszewki: content, padding, border, margin oraz box-sizing: border-box',
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
      theoryMarkdown: `W CSS każdy element na stronie jest prostokątnym pudełkiem (**Box Model**).

**4 warstwy pudełka:**
1. **Content**: Właściwa zawartość (tekst, grafika).
2. **Padding**: Wewnętrzny odstęp między treścią a krawędzią ramki.
3. **Border**: Obramowanie pudełka.
4. **Margin**: Zewnętrzny odstęp odsuwający sąsiednie elementy.

**Problem z domyślnym \`content-box\`:**
Domyślnie w przeglądarkach szerokość elementu (\`width: 200px\`) dotyczy tylko treści! Dodanie \`padding: 20px\` i \`border: 2px\` powiększa element do 244px, niszcząc układy kolumnowe.

**Rozwiązanie standardowe (CSS Reset):**
\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\`
Dzięki \`border-box\` wymiary \`padding\` i \`border\` mieszczą się **wewnątrz** zadeklarowanego \`width\`.`,
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
      id: 'css-2',
      moduleId: 3,
      moduleTitle: 'CSS — Nowoczesne Stylowanie i Układy',
      title: 'Flexbox: elastyczne układy jednoosiowe i centrowanie elementów',
      slug: 'flexbox-elastyczne-uklady',
      durationMinutes: 35,
      xpReward: 70,
      order: 2,
      summary: 'Koniec z walką o wyśrodkowanie diva w pionie i poziomie! Opanuj elastyczny model Flexbox: osie main i cross, justify-content, align-items, flex-direction oraz gap.',
      objectives: [
        'Zrozumieć działanie osi głównej (Main Axis) i poprzecznej (Cross Axis)',
        'Wyrównywać elementy za pomocą justify-content i align-items',
        'Stosować nowoczesną właściwość gap zamiast niewygodnych marginesów',
      ],
      prerequisites: ['Lekcja 1: Box Model'],
      theoryMarkdown: `Flexbox to jednoosiowy system rozmieszczania elementów w wierszu (\`row\`) lub kolumnie (\`column\`).

**Dwie osie Flexbox:**
1. **Main Axis (Oś główna):** Domyślnie pozioma (od lewej do prawej). Sterujemy nią przez **\`justify-content\`** (\`flex-start\`, \`center\`, \`flex-end\`, \`space-between\`).
2. **Cross Axis (Oś poprzeczna):** Domyślnie pionowa (od góry do dołu). Sterujemy nią przez **\`align-items\`** (\`stretch\`, \`center\`, \`flex-start\`, \`flex-end\`).

**Słynne centrowanie w pionie i poziomie w 3 linijkach:**
\`\`\`css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

**Właściwość \`gap\`:**
Zamiast pisać \`.item { margin-right: 16px; }\` i usuwać margines z ostatniego elementu pseudo-klasą \`:last-child\`, po prostu podaj na rodzicu \`gap: 16px;\`.`,
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
      theoryMarkdown: `CSS Grid to najbardziej zaawansowany system układu w przeglądarkach. Pozwala definiować **zarówno wiersze, jak i kolumny**.

**Kluczowe właściwości:**
- \`display: grid\` — aktywuje kontekst siatki.
- \`grid-template-columns: 1fr 1fr 1fr\` — tworzy 3 równe kolumny.
- \`gap: 24px\` — eleganckie odstępy między wierszami i kolumnami.

**Jednostka \`fr\` (fraction unit):**
Reprezentuje ułamek dostępnej przestrzeni w kontenerze siatki. Np. \`1fr 2fr\` dzieli przestrzeń na 3 części: pierwsza kolumna dostanie 33%, druga 66%.

**Magiczna responsywna siatka bez Media Queries:**
\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
\`\`\`
Przeglądarka sama wstawi tyle kolumn o min. szerokości 280px, ile zmieści się na ekranie! Na telefonie będzie to 1 kolumna, na tablecie 2, na monitorze 4.`,
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
      theoryMarkdown: `Podejście **Mobile-First** oznacza, że domyślny styl w Twoim pliku CSS pisany jest dla najprostszego widoku — małego ekranu smartfona.

Dopiero w miarę jak ekran staje się szerszy, "dokładamy" kolejne reguły za pomocą zapytań o minimalną szerokość (**\`min-width\`**):

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

**Dlaczego to podejście wygrało?**
1. Na telefonie pobierany i interpretowany jest najprostszy, najlżejszy arkusz stylów.
2. Zapobiega "nadpisywaniu nadpisań" (tzw. spaghetti CSS), które nagminnie pojawia się przy pisaniu pod desktop z setkami \`@media (max-width)\`.`,
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
      theoryMarkdown: `Zmienne CSS (**CSS Custom Properties**) pozwalają centralnie zarządzać kolorami, odstępami i promieniami zaokrągleń w całej aplikacji.

**Deklaracja i użycie:**
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

**Płynne przejścia (\`transition\`):**
\`\`\`css
.button {
  background-color: var(--primary);
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
  background-color: #4338ca;
}
\`\`\`
Animuj tylko właściwości korzystające z akceleracji GPU: **\`transform\`** oraz **\`opacity\`**! Unikaj animowania \`width\`, \`height\` lub \`top/left\`, które wywołują kosztowny reflow/layout w przeglądarce.`,
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
