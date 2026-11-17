import { QuizQuestion } from '../types';

/**
 * Dodatkowe pytania quizowe (min. 3 pytania łącznie w każdej z 96 lekcji),
 * dopasowane merytorycznie do tematu konkretnej lekcji.
 */
export const EXTRA_LESSON_QUIZZES: Record<string, QuizQuestion[]> = {
  // ==================== MODUŁ 1: HTML5 (14 lekcji) ====================
  'html-7': [
    {
      id: 'q-h7-2',
      question: 'Ile głównych nagłówków <h1> powinno znajdować się zazwyczaj na pojedynczej stronie internetowej?',
      options: [
        'Jeden główny nagłówek <h1> opisujący najważniejszy temat strony',
        'Co najmniej dziesięć, po jednym dla każdego akapitu',
        'Zero — nagłówek <h1> jest przestarzały i zastępuje go <p>',
        'Dokładnie sześć, od <h1> do <h6> w każdej sekcji',
      ],
      correctAnswer: 0,
      explanation: 'Dobra praktyka SEO i dostępności (WCAG) zaleca użycie jednego głównego <h1> dla tytułu strony, a kolejnych sekcji w hierarchii <h2> i <h3>.',
    },
    {
      id: 'q-h7-3',
      question: 'Czym różni się znacznik <strong> od zwykłego stylowania CSS font-weight: bold?',
      options: [
        '<strong> nadaje treści znaczenie semantyczne (ważna informacja dla czytników ekranu i Google), a nie tylko wygląd',
        '<strong> automatycznie zmienia kolor tekstu na czerwony',
        '<strong> działa wyłącznie wewnątrz nagłówków <h1>',
        'Nie ma żadnej różnicy — oba działają identycznie dla czytników ekranu',
      ],
      correctAnswer: 0,
      explanation: 'Znacznik <strong> sygnalizuje wysoką wagę merytoryczną tekstu, co jest odczytywane przez technologie asystujące i indeksatory wyszukiwarek.',
    },
  ],
  'html-10': [
    {
      id: 'q-h10-3',
      question: 'Kiedy najlepiej użyć znacznika <em> zamiast <i>?',
      options: [
        'Gdy chcemy nadać słowu nacisk znaczeniowy w zdaniu (np. „To jest NAPRAWDĘ ważne”)',
        'Wyłącznie do wstawiania ikon z bibliotek CSS',
        'Gdy chcemy wycentrować akapit na ekranie',
        'Do tworzenia pogrubionych nagłówków tabeli',
      ],
      correctAnswer: 0,
      explanation: 'Znacznik <em> (emphasis) niesie nacisk intonacyjny/semantyczny w treści, dzięki czemu czytniki ekranu akcentują dane słowo.',
    },
  ],
  'html-8': [
    {
      id: 'q-h8-2',
      question: 'Który typ listy należy wybrać do zapisania kroków przepisu kulinarnego lub instrukcji „krok po kroku”?',
      options: [
        '<ol> (lista uporządkowana z numeracją 1, 2, 3...)',
        '<ul> (lista nieuporządkowana z punktatorami)',
        '<dl> bez żadnych znaczników podrzędnych',
        '<nav> zamiast listy',
      ],
      correctAnswer: 0,
      explanation: 'Gdy kolejność elementów ma znaczenie (jak w instrukcji krok po kroku), właściwym znacznikiem semantycznym jest <ol>.',
    },
    {
      id: 'q-h8-3',
      question: 'Który atrybut w znaczniku <a> określa docelowy adres URL, pod który przeniesie link?',
      options: ['href', 'src', 'action', 'target'],
      correctAnswer: 0,
      explanation: 'Atrybut href (Hypertext Reference) wskazuje adres URL strony lub zasobu, do którego prowadzi odnośnik <a>.',
    },
  ],
  'html-11': [
    {
      id: 'q-h11-3',
      question: 'Dlaczego przy linkach zewnętrznych z target="_blank" warto dodać atrybut rel="noopener noreferrer"?',
      options: [
        'Ze względów bezpieczeństwa i prywatności — blokuje nowej karcie dostęp do obiektu window.opener starej strony',
        'Aby przeglądarka otworzyła link w oknie incognito',
        'Aby przyspieszyć pobieranie obrazków na stronie docelowej',
        'Bez tego linki mailto: nie uruchamiają klienta poczty',
      ],
      correctAnswer: 0,
      explanation: 'rel="noopener noreferrer" zabezpiecza przed atakiem typu reverse tabnabbing i ukrywa nagłówek Referer przed zewnętrzną domeną.',
    },
  ],
  'html-4': [
    {
      id: 'q-h4-2',
      question: 'Dlaczego każdy merytoryczny obrazek <img> powinien posiadać dobrze opisany atrybut alt?',
      options: [
        'Opisuje grafikę osobom niewidomym (czytniki ekranu), wyświetla się gdy plik nie załaduje się poprawnie i pomaga SEO',
        'Automatycznie kompresuje rozmiar pliku PNG o 50%',
        'Wymusza otwarcie zdjęcia na pełnym ekranie po kliknięciu',
        'Jest wymagany tylko przy plikach w formacie SVG',
      ],
      correctAnswer: 0,
      explanation: 'Atrybut alt to fundament dostępności WCAG i SEO obrazów — bez niego czytnik ekranu odczyta jedynie nazwę pliku.',
    },
    {
      id: 'q-h4-3',
      question: 'Co powoduje dodanie atrybutu loading="lazy" na znaczniku <img>?',
      options: [
        'Przeglądarka opóźnia pobranie zdjęcia do momentu, aż użytkownik przewinie stronę w jego pobliże',
        'Obrazek ładuje się w obniżonej rozdzielczości czarno-białej',
        'Zdjęcie jest ukrywane na urządzeniach mobilnych',
        'Obrazek ładuje się przed plikami CSS',
      ],
      correctAnswer: 0,
      explanation: 'Leniwe ładowanie (loading="lazy") oszczędza transfer użytkownika i przyspiesza pierwsze wyrenderowanie widoku powyżej linii zgięcia (LCP).',
    },
  ],
  'html-12': [
    {
      id: 'q-h12-3',
      question: 'Dlaczego warto dzielić rozbudowaną tabelę HTML na sekcje <thead>, <tbody> i <tfoot>?',
      options: [
        'Ułatwia to czytnikom ekranu interpretację danych, pozwala stylować sekcje niezależnie oraz powtarzać nagłówek przy druku',
        'Bez tych znaczników przeglądarka nie wyświetli żadnego tekstu w komórkach <td>',
        'Automatycznie dodaje to sortowanie kolumn w JavaScript',
        'Zmniejsza rozmiar pliku HTML o połowę',
      ],
      correctAnswer: 0,
      explanation: 'Semantyczny podział na <thead>, <tbody> i <tfoot> porządkuje strukturę tabeli dla dostępności, CSS oraz paginacji wydruku.',
    },
  ],
  'html-9': [
    {
      id: 'q-h9-2',
      question: 'Jaka jest główna zasada dotycząca używania atrybutu id na jednej stronie HTML?',
      options: [
        'Wartość id powinna być unikalna — nie należy nadawać tego samego id wielu elementom na stronie',
        'To samo id musi występować co najmniej 3 razy w jednym dokumencie',
        'Atrybut id można stosować wyłącznie na znacznikach <span>',
        'Wartość id może zawierać wyłącznie cyfry',
      ],
      correctAnswer: 0,
      explanation: 'Identyfikator id jednoznacznie wskazuje pojedynczy element (np. dla kotwic #sekcja, etykiet <label for="..."> czy JavaScriptu), w przeciwieństwie do wielokrotnej klasy class.',
    },
    {
      id: 'q-h9-3',
      question: 'Kiedy użyć znacznika <span> zamiast <div>?',
      options: [
        'Gdy chcemy ostylować lub wyróżnić fragment tekstu w jednej linii (element liniowy / inline)',
        'Gdy budujemy całą nawigację boczną lub stopkę strony',
        'Gdy potrzebujemy elementu blokowego zajmującego całą szerokość ekranu',
        'Wyłącznie do wstawiania arkuszy stylów CSS',
      ],
      correctAnswer: 0,
      explanation: '<span> to neutralny kontener liniowy (inline), idealny do stylowania fragmentu akapitu bez łamania linii.',
    },
  ],
  'html-1': [
    {
      id: 'q-h1-3',
      question: 'Po co na samej górze dokumentu umieszczamy deklarację <!DOCTYPE html>?',
      options: [
        'Informuje przeglądarkę, aby renderowała stronę w nowoczesnym trybie standardowym HTML5 (zamiast Quirks Mode)',
        'Importuje domyślny arkusz stylów Tailwind CSS',
        'Tworzy automatycznie pierwszy nagłówek na stronie',
        'Zabezpiecza stronę protokołem HTTPS',
      ],
      correctAnswer: 0,
      explanation: 'Brak <!DOCTYPE html> może przełączyć przeglądarkę w przestarzały tryb kompatybilności wstecznej (Quirks Mode), psując układ CSS.',
    },
  ],
  'html-2': [
    {
      id: 'q-h2-2',
      question: 'Który znacznik semantyczny najlepiej nadaje się do otoczenia głównego paska linków nawigacyjnych witryny?',
      options: ['<nav>', '<aside>', '<footer>', '<article>'],
      correctAnswer: 0,
      explanation: 'Znacznik <nav> wyznacza sekcję głównych odnośników nawigacyjnych, umożliwiając użytkownikom czytników ekranu szybki przeskok do menu.',
    },
    {
      id: 'q-h2-3',
      question: 'Czym różni się <article> od <section> w semantycznym HTML5?',
      options: [
        '<article> to samodzielna treść mająca sens także poza stroną (np. wpis na blogu, karta produktu), a <section> grupuje tematyczny fragment większej całości',
        '<article> działa tylko na urządzeniach mobilnych, a <section> na desktopie',
        '<section> nie może zawierać żadnych nagłówków <h2>',
        'Nie ma między nimi żadnej różnicy semantycznej',
      ],
      correctAnswer: 0,
      explanation: '<article> nadaje się do syndykacji i samodzielnego odczytu (post, komentarz, artykuł), natomiast <section> dzieli większy dokument na logiczne rozdziały.',
    },
  ],
  'html-3': [
    {
      id: 'q-h3-2',
      question: 'Jak poprawnie powiązać etykietę <label> z polem <input id="user-email">?',
      options: [
        'Dodać atrybut for="user-email" na znaczniku <label>',
        'Dodać atrybut name="label" na przycisku <button>',
        'Umieścić <label> dopiero w stopce <footer>',
        'Ustawić identyczny atrybut placeholder na obu znacznikach',
      ],
      correctAnswer: 0,
      explanation: 'Powiązanie <label for="id"> sprawia, że kliknięcie tekstu etykiety aktywuje pole formularza, a czytniki ekranu poprawnie opisują input.',
    },
    {
      id: 'q-h3-3',
      question: 'Jaki jest domyślny typ przycisku <button> umieszczonego wewnątrz <form>, jeśli nie podamy atrybutu type?',
      options: ['submit (wysyła formularz)', 'reset (czyści pola)', 'button (nic nie robi)', 'link (otwiera nową kartę)'],
      correctAnswer: 0,
      explanation: 'Domyślnie <button> w <form> ma type="submit", dlatego przyciski pomocnicze (np. „Pokaż hasło”) powinny mieć jawnie type="button".',
    },
  ],
  'html-13': [
    {
      id: 'q-h13-3',
      question: 'Które pole wyboru pozwala użytkownikowi zaznaczyć wiele niezależnych opcji naraz (np. wybór kilku zainteresowań)?',
      options: [
        '<input type="checkbox">',
        '<input type="radio">',
        '<input type="hidden">',
        '<select> bez atrybutu multiple',
      ],
      correctAnswer: 0,
      explanation: 'Pola typu checkbox umożliwiają wielokrotny wybór niezależnych opcji, w przeciwieństwie do grupy radio (wybór dokładnie jednej opcji).',
    },
  ],
  'html-6': [
    {
      id: 'q-h6-2',
      question: 'Jaka jest główna zaleta grafik wektorowych <svg> w porównaniu do zwykłych plików PNG/JPG przy ikonach i logotypach?',
      options: [
        'Zachowują idealną ostrość przy dowolnym powiększeniu (Retina/4K) i można zmieniać ich kolory przez CSS',
        'Zawsze zajmują kilkadziesiąt megabajtów',
        'Działają wyłącznie przy wyłączonym CSS',
        'Nie obsługują przezroczystości',
      ],
      correctAnswer: 0,
      explanation: 'SVG opisuje kształty matematycznie (wektorowo), dzięki czemu logo lub ikona wyglądają ostro na każdym ekranie i łatwo reagują na CSS (np. fill: currentColor).',
    },
    {
      id: 'q-h6-3',
      question: 'Dlaczego wewnątrz znacznika <video> warto umieścić atrybut muted, jeśli chcemy użyć autoplay?',
      options: [
        'Nowoczesne przeglądarki blokują automatyczne odtwarzanie wideo z dźwiękiem (autoplay działa tylko przy wyciszonym dźwięku)',
        'Atrybut muted przyspiesza dwukrotnie odtwarzanie filmu',
        'Bez muted przeglądarka usuwa pasek przewijania',
        'Atrybut muted zamienia wideo w format MP3',
      ],
      correctAnswer: 0,
      explanation: 'Polityka przeglądarek chroni użytkowników przed niespodziewanym hałasem — autoplay bez interakcji użytkownika wymaga muted.',
    },
  ],
  'html-14': [
    {
      id: 'q-h14-3',
      question: 'Jaką natywną funkcję oferuje element <dialog> otwarty metodą .showModal() w JavaScript?',
      options: [
        'Tworzy okno modalne na górnej warstwie (Top Layer) z pseudoelementem ::backdrop i obsługą klawisza Escape',
        'Wysyła automatycznie e-mail przez SMTP',
        'Zapisuje pliki cookie w bazie PostgreSQL',
        'Wyświetla powiadomienie systemowe poza przeglądarką',
      ],
      correctAnswer: 0,
      explanation: 'Natywny <dialog> otwarty przez showModal() sam zarządza tłem (::backdrop), pułapką fokusu i zamykaniem klawiszem Esc.',
    },
  ],
  'html-5': [
    {
      id: 'q-h5-2',
      question: 'Jaki minimalny współczynnik kontrastu tekstu do tła zaleca standard WCAG AA dla zwykłego tekstu?',
      options: ['4.5 : 1', '1.2 : 1', '2.0 : 1', '100 : 1'],
      correctAnswer: 0,
      explanation: 'Standard dostępności WCAG 2.1 na poziomie AA wymaga kontrastu minimum 4.5:1 dla zwykłego tekstu (oraz 3:1 dla dużego tekstu i elementów UI).',
    },
    {
      id: 'q-h5-3',
      question: 'Który tag w sekcji <head> odpowiada za krótki opis strony widoczny często pod tytułem w wynikach wyszukiwania Google?',
      options: [
        '<meta name="description" content="...">',
        '<meta name="viewport">',
        '<link rel="icon">',
        '<script type="module">',
      ],
      correctAnswer: 0,
      explanation: 'Meta opis (<meta name="description">) podsumowuje zawartość strony dla wyszukiwarek i zachęca użytkowników do kliknięcia linku w wynikach SERP.',
    },
  ],

  // ==================== MODUŁ 2: CSS3 (9 lekcji) ====================
  'css-7': [
    {
      id: 'q-css7-2',
      question: 'Która właściwość CSS odpowiada za kolor samego tekstu wewnątrz elementu (np. akapitu <p>)?',
      options: ['color', 'background-color', 'font-color', 'text-fill'],
      correctAnswer: 0,
      explanation: 'W CSS kolor tekstu ustawia się po prostu właściwością color (nie ma właściwości font-color).',
    },
    {
      id: 'q-css7-3',
      question: 'Co oznacza skrót linear-gradient(135deg, #4f46e5, #06b6d4) w CSS?',
      options: [
        'Płynne przejście kolorystyczne ustawione pod kątem 135 stopni między dwoma kolorami',
        'Animację obracającą element o 135 stopni w pętli',
        'Grubość obramowania wokół karty',
        'Cień rzucany przez tekst nagłówka',
      ],
      correctAnswer: 0,
      explanation: 'linear-gradient generuje tło z płynnym przejściem kolorów w zadanym kierunku lub kącie (np. 135deg).',
    },
  ],
  'css-6': [
    {
      id: 'q-css6-2',
      question: 'Który selektor CSS ma wyższą specyficzność (pierwszeństwo nadpisania stylu)?',
      options: [
        'Identyfikator #header (100)',
        'Klasa .header (10)',
        'Znacznik header (1)',
        'Selektor uniwersalny * (0)',
      ],
      correctAnswer: 0,
      explanation: 'Hierarchia specyficzności w CSS (od najsilniejszej): style inline -> #id (100) -> .klasa / :hover (10) -> znacznik tag (1).',
    },
    {
      id: 'q-css6-3',
      question: 'Kiedy używamy pseudoklasy :focus-visible na przyciskach i linkach?',
      options: [
        'Aby pokazać wyraźną obwódkę fokusu osobom nawigującym klawiaturą (klawisz Tab)',
        'Aby ukryć przycisk przed wyszukiwarką Google',
        'Aby zmienić rozmiar czcionki po najechaniu myszką',
        'Wyłącznie wewnątrz zapytań @media print',
      ],
      correctAnswer: 0,
      explanation: ':focus-visible poprawia dostępność (klawiatura) bez pokazywania zbędnej ramki przy zwykłym kliknięciu myszą.',
    },
  ],
  'css-1': [
    {
      id: 'q-css1-2',
      question: 'Jaka jest główna różnica między padding a margin w modelu pudełkowym CSS?',
      options: [
        'padding to odstęp WEWNĄTRZ elementu (między treścią a ramką), a margin to odstęp NA ZEWNĄTRZ (między sąsiednimi elementami)',
        'margin powiększa tło elementu, a padding jest zawsze przezroczysty',
        'padding działa tylko w poziomie, a margin tylko w pionie',
        'Nie ma żadnej różnicy między nimi',
      ],
      correctAnswer: 0,
      explanation: 'Padding odsuwa treść od krawędzi/ramki (i ma tło elementu), natomiast margin tworzy dystans na zewnątrz obramowania.',
    },
    {
      id: 'q-css1-3',
      question: 'Co oznacza skrócony zapis padding: 12px 24px; w CSS?',
      options: [
        '12px odstępu u góry i na dole oraz 24px po lewej i prawej stronie',
        '12px po lewej i 24px u góry, pozostałe strony po 0px',
        'Łącznie 36px paddingu z każdej strony',
        '12px na telefonie i 24px na komputerze',
      ],
      correctAnswer: 0,
      explanation: 'Zapis dwuwartościowy ustawia kolejno: oś pionową (top/bottom) oraz oś poziomą (left/right).',
    },
  ],
  'css-2': [
    {
      id: 'q-css2-2',
      question: 'Która właściwość Flexboxa pozwala zawinąć elementy do kolejnego wiersza, gdy zabraknie miejsca w poziomie?',
      options: ['flex-wrap: wrap;', 'justify-content: space-between;', 'align-items: stretch;', 'flex-direction: row-reverse;'],
      correctAnswer: 0,
      explanation: 'Domyślnie flex-wrap ma wartość nowrap (ściskanie w jednym wierszu); ustawienie flex-wrap: wrap umożliwia przejście do nowego wiersza.',
    },
    {
      id: 'q-css2-3',
      question: 'Jak w kontenerze display: flex; najczytelniej dodać równy odstęp 16px pomiędzy wszystkimi elementami bez używania marginesów na ostatnim dziecku?',
      options: ['gap: 16px;', 'margin-auto: 16px;', 'padding-between: 16px;', 'flex-spacing: 16px;'],
      correctAnswer: 0,
      explanation: 'Właściwość gap w Flexboxie i CSS Grid wstawia odstępy wyłącznie pomiędzy sąsiednimi elementami.',
    },
  ],
  'css-8': [
    {
      id: 'q-css8-2',
      question: 'Jak zachowuje się element z position: sticky; top: 0; podczas przewijania strony?',
      options: [
        'Przewija się normalnie w swoim kontenerze, a po dotknięciu górnej krawędzi (0px) „przykleja” się do ekranu na czas przewijania rodzica',
        'Znika natychmiast po przewinięciu 10 pikseli',
        'Zawsze pozostaje ukryty pod spodem innych elementów',
        'Działa tylko w obrębie stopki <footer>',
      ],
      correctAnswer: 0,
      explanation: 'position: sticky łączy cechy relative i fixed — pozostaje w przepływie dokumentu do osiągnięcia progu (np. top: 0).',
    },
    {
      id: 'q-css8-3',
      question: 'Która właściwość CSS decyduje o kolejności nakładania się warstw (co jest wyżej, a co niżej) dla elementów pozycjonowanych?',
      options: ['z-index', 'order-layer', 'stack-level', 'float-depth'],
      correctAnswer: 0,
      explanation: 'Wyższa wartość z-index (np. z-index: 50) wyświetla element na wierzchu innych nakładających się warstw (np. modale, dropdowny).',
    },
  ],
  'css-3': [
    {
      id: 'q-css3-2',
      question: 'Co wygeneruje zapis grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));?',
      options: [
        'Automatyczną, responsywną siatkę kolumn o minimalnej szerokości 260px, która dopasowuje liczbę kolumn do szerokości ekranu bez @media queries',
        'Dokładnie jedną kolumnę o stałej szerokości 260px',
        'Układ poziomego suwaka bez zawijania wierszy',
        'Ukrycie siatki na ekranach powyżej 260px',
      ],
      correctAnswer: 0,
      explanation: 'Połączenie repeat(auto-fit, minmax(...)) to jeden z najpotężniejszych wzorców CSS Grid do responsywnych galerii kart.',
    },
    {
      id: 'q-css3-3',
      question: 'Jak sprawić w CSS Grid, aby wybrany element zajął szerokość 2 sąsiednich kolumn?',
      options: ['grid-column: span 2;', 'flex-grow: 2;', 'col-width: 2fr;', 'grid-merge: 2;'],
      correctAnswer: 0,
      explanation: 'Właściwość grid-column: span 2 rozszerza kafelek siatki na dwie kolumny.',
    },
  ],
  'css-4': [
    {
      id: 'q-css4-2',
      question: 'Po co w sekcji <head> dodajemy tag <meta name="viewport" content="width=device-width, initial-scale=1.0" />?',
      options: [
        'Aby przeglądarki mobilne dopasowały szerokość layoutu do faktycznej szerokości ekranu telefonu zamiast pomniejszać wersję desktopową',
        'Aby automatycznie aktywować tryb ciemny na Androidzie',
        'Aby wyłączyć wszystkie zapytania @media queries',
        'Aby powiększyć każdy przycisk do 100% wysokości ekranu',
      ],
      correctAnswer: 0,
      explanation: 'Bez meta tagu viewport smartfon udaje szeroki ekran ~980px i pomniejsza całą stronę, ignorując mobilne breakpointy CSS.',
    },
    {
      id: 'q-css4-3',
      question: 'Która nowoczesna jednostka CSS najlepiej dopasowuje szerokość komponentu względem rozmiaru czcionki root (<html>)?',
      options: ['rem', 'pt', 'cm', 'mm'],
      correctAnswer: 0,
      explanation: 'Jednostka rem (root em) bazuje na rozmiarze czcionki elementu <html> (zwykle 16px) i skaluje się przewidywalnie zgodnie z ustawieniami dostępności użytkownika.',
    },
  ],
  'css-5': [
    {
      id: 'q-css5-2',
      question: 'Jak w CSS zadeklarować własną zmienną globalną dla koloru przewodniego i odczytać ją w regule przycisku?',
      options: [
        ':root { --brand: #4f46e5; } oraz background: var(--brand);',
        '$brand: #4f46e5; w zwykłym pliku .css',
        '@var brand = #4f46e5; oraz background: @brand;',
        'body { var-brand: #4f46e5; } oraz background: get(brand);',
      ],
      correctAnswer: 0,
      explanation: 'Natywne zmienne CSS definiuje się z podwójnym myślnikiem (--nazwa) zwykle w :root i odczytuje funkcją var(--nazwa).',
    },
    {
      id: 'q-css5-3',
      question: 'Do czego służy zapytanie @media (prefers-reduced-motion: reduce)?',
      options: [
        'Pozwala wyłączyć lub ograniczyć intensywne animacje osobom z nadwrażliwością błędnika, które włączyły tę opcję w systemie',
        'Spowalnia połączenie internetowe w trybie deweloperskim',
        'Zmniejsza jasność ekranu w nocy',
        'Wyłącza obsługę SVG na urządzeniach iOS',
      ],
      correctAnswer: 0,
      explanation: 'Respektowanie prefers-reduced-motion to ważny standard dostępności (WCAG), który chroni użytkowników przed dyskomfortem wywołanym ruchem.',
    },
  ],
  'css-9': [
    {
      id: 'q-css9-2',
      question: 'Co robi zestaw klas Tailwind CSS: flex items-center justify-between gap-4?',
      options: [
        'Tworzy kontener Flexbox, wyrównuje dzieci w pionie do środka, rozsuwa je do krawędzi i dodaje odstęp 1rem (16px)',
        'Ukrywa element na ekranach poniżej 768px',
        'Tworzy siatkę 4-kolumnową z cieniem',
        'Dodaje obramowanie i przejście animacji 4s',
      ],
      correctAnswer: 0,
      explanation: 'Klasy użytkowe Tailwind mapują się bezpośrednio na właściwości CSS: display: flex, align-items: center, justify-content: space-between, gap: 1rem.',
    },
    {
      id: 'q-css9-3',
      question: 'Co oznacza prefiks dark: w klasie Tailwind np. dark:bg-slate-900?',
      options: [
        'Styl bg-slate-900 zostanie zastosowany tylko wtedy, gdy aktywny jest tryb ciemny',
        'Tło stanie się półprzezroczyste niezależnie od motywu',
        'Element zostanie przesunięty pod inne warstwy',
        'Klasa zadziała wyłącznie w przeglądarce Safari',
      ],
      correctAnswer: 0,
      explanation: 'Wariant dark: pozwala łatwo definiować osobny wygląd komponentów w trybie ciemnym bez duplikowania plików CSS.',
    },
  ],

  // ==================== MODUŁ 3: JAVASCRIPT (10 lekcji) ====================
  'js-1': [
    {
      id: 'q-js1-2',
      question: 'Kiedy używamy const, a kiedy let przy deklarowaniu zmiennych w JavaScript?',
      options: [
        'Domyślnie używamy const, a po let sięgamy tylko wtedy, gdy zmienna będzie później nadpisywana nową wartością',
        'Zawsze używamy let, bo const blokuje dodawanie elementów do tablic',
        'const działa tylko dla liczb, a let tylko dla tekstu',
        'let działa poza funkcją, a const tylko w pętlach for',
      ],
      correctAnswer: 0,
      explanation: 'const chroni przed przypadkowym nadpisaniem referencji zmiennej, co czyni kod bardziej przewidywalnym i bezpieczniejszym.',
    },
    {
      id: 'q-js1-3',
      question: 'Jaki jest wynik działania operatora typeof "42" w JavaScript?',
      options: ['"string"', '"number"', '"boolean"', '"undefined"'],
      correctAnswer: 0,
      explanation: 'Wartość zapisana w cudzysłowie ("42") jest łańcuchem znaków (typ string), a nie liczbą.',
    },
  ],
  'js-6': [
    {
      id: 'q-js6-2',
      question: 'Dlaczego w porównaniach w JavaScript prawie zawsze używamy operatora === zamiast ==?',
      options: [
        'Operator === sprawdza zarówno wartość, jak i typ danych bez niejawnej konwersji (koercji), unikając pułapek typu 0 == ""',
        'Operator == nie działa w przeglądarce Chrome',
        'Operator === potrafi automatycznie zamienić tekst na liczbę',
        'Nie ma różnicy — oba działają identycznie',
      ],
      correctAnswer: 0,
      explanation: 'Ścisłe porównanie === eliminuje zaskakujące błędy koercji typów (np. false == "0" daje true przy ==, ale false przy ===).',
    },
    {
      id: 'q-js6-3',
      question: 'Co robi operator logiczny && (AND) w warunku if (isLoggedIn && isAdmin)?',
      options: [
        'Zwraca prawdę tylko wtedy, gdy oba warunki są prawdziwe jednocześnie',
        'Wystarczy, że chociaż jeden z warunków będzie prawdziwy',
        'Odwraca wartość logiczną na przeciwną',
        'Porównuje typy zmiennych',
      ],
      correctAnswer: 0,
      explanation: 'Koniunkcja && wymaga spełnienia wszystkich łączonych warunków, w przeciwieństwie do alternatywy || (OR).',
    },
  ],
  'js-8': [
    {
      id: 'q-js8-2',
      question: 'Czym jest funkcja strzałkowa (arrow function) const dodaj = (a, b) => a + b;?',
      options: [
        'Zwięzłą składnią funkcji z niejawnym zwrotem wyniku (implicit return) przy zapisie jednoliniowym bez nawiasów klamrowych',
        'Pętlą wykonującą się w nieskończoność',
        'Specjalnym typem tablicy asocjacyjnej',
        'Komentarzem ignorowanym przez silnik JS',
      ],
      correctAnswer: 0,
      explanation: 'Jeśli ciało arrow function nie ma klamer {}, wyrażenie po strzałce => jest od razu zwracane jako wynik.',
    },
    {
      id: 'q-js8-3',
      question: 'Do czego służą parametry domyślne funkcji, np. function powitaj(imie = "Gościu")?',
      options: [
        'Podstawiają wartość "Gościu", gdy wywołamy powitaj() bez podania argumentu lub podamy undefined',
        'Blokują możliwość przekazania własnego imienia do funkcji',
        'Zamieniają typ argumentu zawsze na tablicę',
        'Powtarzają wykonanie funkcji 2 razy',
      ],
      correctAnswer: 0,
      explanation: 'Domyślne parametry (ES6) zabezpieczają funkcję przed brakującymi argumentami bez pisania dodatkowych warunków if.',
    },
  ],
  'js-7': [
    {
      id: 'q-js7-2',
      question: 'Która metoda dodaje nowy element na sam KONIEC istniejącej tablicy w JavaScript?',
      options: ['.push()', '.pop()', '.shift()', '.slice()'],
      correctAnswer: 0,
      explanation: 'arr.push(x) dopisuje element na końcu tablicy, natomiast .pop() go usuwa z końca.',
    },
    {
      id: 'q-js7-3',
      question: 'Co zwróci odwołanie do elementu pod nieistniejącym indeksem, np. ["HTML", "CSS"][5]?',
      options: ['undefined', 'null', 'false', '0'],
      correctAnswer: 0,
      explanation: 'W JavaScript odczyt elementu poza zakresem tablicy nie rzuca błędu, tylko zwraca undefined.',
    },
  ],
  'js-9': [
    {
      id: 'q-js9-2',
      question: 'Jak przy pomocy destrukturyzacji najczytelniej wyciągnąć pola name i role z obiektu user?',
      options: [
        'const { name, role } = user;',
        'const [name, role] = user;',
        'extract(user, "name", "role");',
        'user -> (name, role);',
      ],
      correctAnswer: 0,
      explanation: 'Destrukturyzacja obiektów { a, b } = obj pozwala zwięźle przypisać właściwości obiektu do zmiennych o tych samych nazwach.',
    },
    {
      id: 'q-js9-3',
      question: 'Do czego służy operator opcjonalnego łańcuchowania ?. w zapisie user?.profile?.avatar?',
      options: [
        'Bezpiecznie zwraca undefined zamiast błędu TypeError, jeśli user lub profile mają wartość null/undefined',
        'Automatycznie pobiera brakujące dane z serwera',
        'Usuwa pole avatar z obiektu profile',
        'Zamienia obiekt na JSON',
      ],
      correctAnswer: 0,
      explanation: 'Optional chaining (?.) chroni aplikację przed wykrzaczeniem przy dostępie do zagnieżdżonych pól niekompletnych danych.',
    },
  ],
  'js-3': [
    {
      id: 'q-js3-2',
      question: 'Co robi wywołanie event.preventDefault() wewnątrz listenera zdarzenia submit formularza?',
      options: [
        'Zatrzymuje domyślne przeładowanie całej strony przez przeglądarkę, aby obsłużyć wysyłkę w JS bez utraty stanu',
        'Usuwa wszystkie dane wpisane przez użytkownika w formularzu',
        'Zamyka bieżącą kartę przeglądarki',
        'Wyłącza style CSS formularza',
      ],
      correctAnswer: 0,
      explanation: 'Domyślnie wysłanie <form> odświeża stronę — e.preventDefault() pozwala obsłużyć formularz płynnie po stronie SPA/fetch.',
    },
    {
      id: 'q-js3-3',
      question: 'Która metoda na obiekcie document pozwala znaleźć pierwszy element pasujący do dowolnego selektora CSS (np. ".card button")?',
      options: ['document.querySelector()', 'document.getAll()', 'document.findCss()', 'document.selectElement()'],
      correctAnswer: 0,
      explanation: 'document.querySelector(selektor) obsługuje pełną składnię selektorów CSS i zwraca pierwszy dopasowany element lub null.',
    },
  ],
  'js-2': [
    {
      id: 'q-js2-2',
      question: 'Czym różni się metoda tablicowa .filter() od .find()?',
      options: [
        '.filter() zawsze zwraca NOWĄ tablicę ze wszystkimi pasującymi elementami, a .find() zwraca tylko PIERWSZY pasujący element (lub undefined)',
        '.find() zawsze modyfikuje tablicę źródłową w miejscu',
        '.filter() zwraca wyłącznie liczbę elementów',
        'Obie zwracają identyczny wynik w każdej sytuacji',
      ],
      correctAnswer: 0,
      explanation: 'Wybieramy .filter(), gdy oczekujemy listy pasujących rekordów, a .find(), gdy szukamy pojedynczego obiektu np. po unikalnym ID.',
    },
    {
      id: 'q-js2-3',
      question: 'Do czego najczęściej używa się metody .reduce() na tablicy obiektów (np. koszyka zakupowego)?',
      options: [
        'Do zredukowania tablicy do jednej wartości wynikowej, np. obliczenia łącznej sumy cen produktów',
        'Do usunięcia pierwszego elementu z tablicy',
        'Do posortowania tablicy alfabetycznie',
        'Do konwersji JSON na HTML',
      ],
      correctAnswer: 0,
      explanation: 'reduce((akumulator, element) => ..., wartośćPoczątkowa) idealnie nadaje się do sumowania, grupowania i agregacji danych.',
    },
  ],
  'js-4': [
    {
      id: 'q-js4-2',
      question: 'Gdzie wolno używać operatora await w standardowym kodzie JavaScript (poza top-level ES Modules)?',
      options: [
        'Wewnątrz funkcji oznaczonej słowem kluczowym async',
        'W dowolnej zwykłej funkcji synchronicznej bez async',
        'Wyłącznie wewnątrz plików CSS',
        'Tylko w pętli while(true)',
      ],
      correctAnswer: 0,
      explanation: 'Słowo kluczowe await wstrzymuje wykonanie bieżącej funkcji async do czasu rozstrzygnięcia Promise bez blokowania wątku głównego.',
    },
    {
      id: 'q-js4-3',
      question: 'Jakie trzy stany może mieć obiekt Promise w JavaScript?',
      options: [
        'pending (oczekująca), fulfilled (spełniona), rejected (odrzucona)',
        'loading, cached, deleted',
        'start, middle, end',
        'open, closed, paused',
      ],
      correctAnswer: 0,
      explanation: 'Każda obietnica startuje w stanie pending i raz na zawsze przechodzi w stan fulfilled (sukces) albo rejected (błąd).',
    },
  ],
  'js-5': [
    {
      id: 'q-js5-2',
      question: 'Jak bezpiecznie obsłużyć błędy HTTP (np. 404 lub 500) przy korzystaniu z fetch()?',
      options: [
        'Sprawdzić właściwość response.ok (lub response.status) zaraz po await fetch(...) i w razie fałszu rzucić własny Error',
        'Polegać wyłącznie na bloku catch, bo fetch zawsze rzuca wyjątek przy kodzie 404',
        'Wywołać response.json() dwukrotnie',
        'Dodać nagłówek Retry-On-404: true',
      ],
      correctAnswer: 0,
      explanation: 'fetch() odrzuca Promise tylko przy problemach z siecią; dla odpowiedzi 4xx/5xx trzeba jawnie sprawdzić if (!res.ok) throw new Error(...).',
    },
    {
      id: 'q-js5-3',
      question: 'Która metoda HTTP służy zgodnie ze standardem REST do pobrania danych z serwera bez ich modyfikowania?',
      options: ['GET', 'POST', 'DELETE', 'PATCH'],
      correctAnswer: 0,
      explanation: 'Metoda GET jest metodą bezpieczną i idempotentną przeznaczoną wyłącznie do odczytu zasobów.',
    },
  ],
  'js-10': [
    {
      id: 'q-js10-2',
      question: 'Jaka jest główna różnica między eksportem nazwanym (export const x) a domyślnym (export default)?',
      options: [
        'W jednym pliku może być wiele eksportów nazwanych (importowanych w klamrach { x }), ale maksymalnie jeden export default',
        'export default działa tylko w plikach CSS',
        'Eksporty nazwane nie działają w TypeScript',
        'Plik z export default nie może mieć żadnych innych funkcji',
      ],
      correctAnswer: 0,
      explanation: 'Eksporty nazwane ułatwiają refaktoryzację i autouzupełnianie IDE (import { foo } from "./mod"), podczas gdy export default jest unikalny dla modułu.',
    },
    {
      id: 'q-js10-3',
      question: 'Jaki jest sens stosowania bloku try { ... } catch (err) { ... } wokół operacji mogących zawieść (np. JSON.parse)?',
      options: [
        'Przechwycenie wyjątku i elegancka obsługa błędu zamiast całkowitego zatrzymania skryptu (crash aplikacji)',
        'Przyspieszenie wykonywania kodu o 50%',
        'Automatyczne wysłanie kodu na GitHuba',
        'Pominięcie sprawdzania typów w TypeScript',
      ],
      correctAnswer: 0,
      explanation: 'try/catch pozwala odzyskać kontrolę po błędzie wykonania (np. zepsuty JSON z sieci) i wyświetlić użytkownikowi czytelny komunikat.',
    },
  ],

  // ==================== MODUŁ 4: NARZĘDZIA PROGRAMISTY (6 lekcji) ====================
  'fund-1': [
    {
      id: 'q-f1-3',
      question: 'Która rodzina kodów statusu HTTP oznacza błąd po stronie klienta (np. brak autoryzacji 401 lub brak zasobu 404)?',
      options: ['4xx (400–499)', '2xx (200–299)', '3xx (300–399)', '1xx (100–199)'],
      correctAnswer: 0,
      explanation: 'Kody 2xx to sukces, 3xx przekierowania, 4xx błędy po stronie żądania klienta, a 5xx awarie po stronie serwera.',
    },
  ],
  'fund-2': [
    {
      id: 'q-f-algo-2',
      question: 'Co w informatyce nazywamy algorytmem?',
      options: [
        'Skończony, precyzyjnie zapisany ciąg kroków prowadzący od danych wejściowych do rozwiązania problemu',
        'Rodzaj karty graficznej używanej w serwerach',
        'Plik zawierający wyłącznie style CSS strony',
        'Hasło dostępu do repozytorium GitHub',
      ],
      correctAnswer: 0,
      explanation: 'Każdy program komputerowy składa się z algorytmów — jednoznacznych przepisów krok po kroku przekształcających dane wejściowe w wynik.',
    },
    {
      id: 'q-f-algo-3',
      question: 'Dlaczego komputer przechowuje zmienne aplikacji w pamięci RAM zamiast bezpośrednio wyłącznie na dysku twardym podczas pracy programu?',
      options: [
        'Pamięć RAM jest wielokrotnie szybsza w dostępie od dysku, dzięki czemu procesor może błyskawicznie odczytywać i zmieniać zmienne',
        'Dysk twardy nie potrafi przechowywać liczb',
        'Pamięć RAM zachowuje dane na zawsze nawet po odłączeniu prądu',
        'Zmienne w RAM są automatycznie publikowane w Internecie',
      ],
      correctAnswer: 0,
      explanation: 'RAM to ultraszybka pamięć operacyjna do bieżącej pracy programu, natomiast dysk (SSD/HDD) służy do trwałego zapisu danych po wyłączeniu komputera.',
    },
  ],
  'fund-3': [
    {
      id: 'q-f-vsc-2',
      question: 'Który skrót klawiszowy w VS Code otwiera Szybkie Otwieranie Pliku (Quick Open) po samej nazwie?',
      options: ['Ctrl + P (lub Cmd + P na Mac)', 'Alt + F4', 'Ctrl + Z', 'F5'],
      correctAnswer: 0,
      explanation: 'Skrót Ctrl+P / Cmd+P pozwala w sekundę przełączyć się do dowolnego pliku w dużym projekcie bez szukania go myszką w drzewie folderów.',
    },
    {
      id: 'q-f-vsc-3',
      question: 'Dlaczego warto włączyć opcję „Format on Save” (formatowanie przy zapisie) w edytorze kodu?',
      options: [
        'Automatycznie porządkuje wcięcia, cudzysłowy i średniki przy każdym Ctrl+S, utrzymując spójny i czytelny kod w zespole',
        'Wysyła plik prosto na produkcję bez testów',
        'Usuwa wszystkie komentarze z kodu',
        'Zmniejsza rozdzielczość ekranu edytora',
      ],
      correctAnswer: 0,
      explanation: 'Automatyczny formatter (np. Prettier) przy zapisie oszczędza czas na ręczne poprawianie spacji i eliminuje spory stylistyczne na Code Review.',
    },
  ],
  'fund-4': [
    {
      id: 'q-f2-3',
      question: 'Jakie polecenie w terminalu tworzy nowy pusty katalog (folder) o nazwie "src"?',
      options: ['mkdir src', 'touch src', 'rm -rf src', 'pwd src'],
      correctAnswer: 0,
      explanation: 'Polecenie mkdir (make directory) tworzy nowy folder, podczas gdy touch tworzy pusty plik, a pwd wyświetla bieżącą ścieżkę.',
    },
  ],
  'fund-6': [
    {
      id: 'q-f3-3',
      question: 'Do czego najczęściej służy zakładka "Network" (Sieć) w DevTools przeglądarki (F12)?',
      options: [
        'Do podglądu wszystkich zapytań HTTP wysyłanych przez stronę, ich kodów statusu (np. 200, 401, 500), nagłówków oraz treści JSON',
        'Do edytowania koloru logo w Photoshopie',
        'Do zwiększania pamięci RAM komputera',
        'Do kompilacji plików Dockerfile',
      ],
      correctAnswer: 0,
      explanation: 'Zakładka Network to podstawowe narzędzie diagnostyczne przy debugowaniu API, błędów CORS, formularzy i wolno ładujących się zasobów.',
    },
  ],
  'fund-5': [
    {
      id: 'q-fund5-2',
      question: 'Co powinno znaleźć się w repozytorium Git jako szablon dla innych programistów zamiast prawdziwego pliku .env?',
      options: [
        'Plik .env.example zawierający same nazwy zmiennych bez prawdziwych haseł i kluczy',
        'Plik .env.passwords z jawnymi hasłami produkcyjnymi',
        'Zrzut ekranu z bazy danych',
        'Cały folder node_modules',
      ],
      correctAnswer: 0,
      explanation: 'Wzorzec .env.example dokumentuje wymagane zmienne środowiskowe potrzebne do uruchomienia projektu bez ujawniania tajnych kluczy.',
    },
    {
      id: 'q-fund5-3',
      question: 'Dlaczego folder node_modules również dopisujemy do pliku .gitignore?',
      options: [
        'Zawiera tysiące plików bibliotek, które każdy odtworzy lokalnie komendą npm install na podstawie package.json i package-lock.json',
        'Ponieważ Git nie obsługuje folderów z podkreślnikiem w nazwie',
        'Ponieważ node_modules nie jest potrzebne podczas uruchamiania aplikacji',
        'Aby ukryć kod naszych własnych komponentów React',
      ],
      correctAnswer: 0,
      explanation: 'Commitowanie node_modules zapchałoby repozytorium dziesiątkami tysięcy zbędnych plików — pliki lockfile gwarantują powtarzalne npm install.',
    },
  ],

  // ==================== MODUŁ 5: GIT & GITHUB (6 lekcji) ====================
  'git-1': [
    {
      id: 'q-git1-2',
      question: 'Które polecenie zapisuje przygotowane zmiany ze Staging Area (index) jako nowy trwały punkt w historii repozytorium?',
      options: ['git commit -m "feat: opis"', 'git status', 'git init', 'git log --oneline'],
      correctAnswer: 0,
      explanation: 'git add przenosi zmiany do poczekalni (Staging Area), a git commit utrwala je w historii jako migawkę (snapshot).',
    },
    {
      id: 'q-git1-3',
      question: 'Co oznacza prefiks "feat:" lub "fix:" w konwencji Conventional Commits?',
      options: [
        '"feat:" oznacza dodanie nowej funkcjonalności, a "fix:" naprawę wykrytego błędu',
        'Oba oznaczają usunięcie całego repozytorium',
        'Są to tajne komendy uruchamiane na serwerze Nginx',
        'Oznaczają automatyczne scalenie gałęzi bez testów',
      ],
      correctAnswer: 0,
      explanation: 'Konwencja Conventional Commits ułatwia czytanie historii zmian oraz automatyczne generowanie changelogu i numerów wersji SemVer.',
    },
  ],
  'git-2': [
    {
      id: 'q-git2-2',
      question: 'Jakie polecenie tworzy nową gałąź "feature/login" i od razu na nią przełącza?',
      options: ['git checkout -b feature/login (lub git switch -c feature/login)', 'git branch -D feature/login', 'git push --force', 'git merge feature/login'],
      correctAnswer: 0,
      explanation: 'git switch -c <nazwa> (lub starsze git checkout -b <nazwa>) tworzy gałąź i od razu przenosi na nią katalog roboczy.',
    },
    {
      id: 'q-git2-3',
      question: 'Co należy zrobić po ręcznym rozwiązaniu konfliktów i usunięciu znaczników <<<<<<<, =======, >>>>>>> w pliku?',
      options: [
        'Oznaczyć plik jako rozwiązany przez git add <plik> i dokończyć scalanie za pomocą git commit',
        'Skasować folder .git z projektu',
        'Ponownie zainstalować Node.js',
        'Zostawić znaczniki w kodzie, bo Git usunie je sam przy pushu',
      ],
      correctAnswer: 0,
      explanation: 'Git wymaga jawnego potwierdzenia rozwiązania konfliktu przez git add oraz wykonania commita scalającego.',
    },
  ],
  'git-3': [
    {
      id: 'q-git3-2',
      question: 'Do czego służy polecenie git stash, gdy w połowie nieskończonej pracy musisz nagle przełączyć gałąź na pilny hotfix?',
      options: [
        'Tymczasowo chowa bieżące niezacommitowane zmiany na bezpiecznym stosie, czyszcząc katalog roboczy do późniejszego przywrócenia (git stash pop)',
        'Trwale usuwa wszystkie zmiany z ostatnich 5 commitów',
        'Wysyła niegotowy kod bezpośrednio na serwer produkcyjny',
        'Zmienia nazwę głównego repozytorium na GitHubie',
      ],
      correctAnswer: 0,
      explanation: 'git stash to „schowek roboczy” — pozwala odłożyć brudne pliki na bok i wrócić do nich po zakończeniu pilnego zadania.',
    },
    {
      id: 'q-git3-3',
      question: 'Czym różni się git reset --soft HEAD~1 od git reset --hard HEAD~1?',
      options: [
        '--soft cofa ostatni commit, zachowując wszystkie zmiany gotowe w Staging Area, podczas gdy --hard całkowicie kasuje zmiany z plików',
        '--hard wysyła zmiany na GitHuba, a --soft nie',
        'Obie opcje usuwają cały folder projektu',
        '--soft działa wyłącznie na gałęzi main',
      ],
      correctAnswer: 0,
      explanation: 'Flaga --soft jest bezpieczna, gdy chcesz np. poprawić wiadomość lub zawartość ostatniego commita; --hard bezpowrotnie nadpisuje katalog roboczy.',
    },
  ],
  'git-4': [
    {
      id: 'q-git4-2',
      question: 'Po co na GitHubie wykonuje się „Fork” cudzego repozytorium Open Source zamiast bezpośredniego git push?',
      options: [
        'Tworzy własną kopię repozytorium na naszym koncie GitHub, w której możemy wprowadzać zmiany i potem zgłosić je przez Pull Request',
        'Automatycznie pobiera płatną licencję komercyjną',
        'Usuwa oryginalny projekt autora',
        'Konwertuje projekt z JavaScript na Pythona',
      ],
      correctAnswer: 0,
      explanation: 'Ponieważ nie masz uprawnień zapisu do cudzych repozytoriów, pracujesz na własnym forku i proponujesz poprawki przez Pull Request.',
    },
    {
      id: 'q-git4-3',
      question: 'Dlaczego do codziennej pracy z GitHubem zaleca się klucze SSH zamiast haseł konta?',
      options: [
        'Klucz SSH (para klucz publiczny/prywatny) zapewnia silne uwierzytelnianie kryptograficzne bez każdorazowego wpisywania hasła i jest wymagany przez GitHuba zamiast hasła w CLI',
        'Klucze SSH zmniejszają rozmiar zdjęć w projekcie',
        'Połączenie SSH omija konieczność posiadania Internetu',
        'Klucz SSH automatycznie naprawia błędy składniowe JS',
      ],
      correctAnswer: 0,
      explanation: 'GitHub nie akceptuje zwykłego hasła w terminalu Git — autoryzacja kluczem SSH (lub tokenem PAT) jest bezpieczniejsza i wygodniejsza.',
    },
  ],
  'git-5': [
    {
      id: 'q-git5-2',
      question: 'Kiedy NIGDY nie wolno wykonywać polecenia git rebase na gałęziach?',
      options: [
        'Na publicznej, współdzielonej gałęzi (np. main), na której pracują już inni członkowie zespołu — ponieważ rebase przepisuje historię commitów',
        'Na własnej, lokalnej gałęzi feature przed wystawieniem Pull Requesta',
        'Gdy w projekcie znajduje się więcej niż 5 plików',
        'Gdy używamy TypeScriptu',
      ],
      correctAnswer: 0,
      explanation: 'Złota zasada Gita: nigdy nie zmieniaj historii (rebase / push --force) na gałęziach współdzielonych z innymi programistami.',
    },
    {
      id: 'q-git5-3',
      question: 'Co jest głównym celem przeprowadzania Code Review przed zmergowaniem Pull Requesta?',
      options: [
        'Wykrycie błędów logicznych i luk bezpieczeństwa, dbanie o czytelność kodu oraz dzielenie się wiedzą w zespole',
        'Ocenianie szybkości pisania na klawiaturze autora PR',
        'Sprawdzenie, czy autor napisał kod bez użycia żadnych bibliotek',
        'Zmiana nazw wszystkich zmiennych na skróty jednoliterowe',
      ],
      correctAnswer: 0,
      explanation: 'Code Review to druga para oczu — podnosi jakość architektury, wyłapuje regresje i pomaga całemu zespołowi rozumieć zmiany w systemie.',
    },
  ],
  'git-6': [
    {
      id: 'q-git6-2',
      question: 'Która część numeru wersji SemVer (MAJOR.MINOR.PATCH) rośnie, gdy dodajemy nową funkcję w pełni kompatybilną wstecz?',
      options: ['MINOR (np. z 1.2.0 na 1.3.0)', 'MAJOR (z 1.2.0 na 2.0.0)', 'PATCH (z 1.2.0 na 1.2.1)', 'Żadna — numer wersji się nie zmienia'],
      correctAnswer: 0,
      explanation: 'W SemVer: MAJOR = zmiany łamiące kompatybilność, MINOR = nowe funkcje kompatybilne wstecz, PATCH = poprawki błędów.',
    },
    {
      id: 'q-git6-3',
      question: 'Do czego służą Git Hooks (np. narzędzie Husky + lint-staged)?',
      options: [
        'Uruchamiają automatycznie linter lub szybkie testy przed każdym commitem (pre-commit), nie pozwalając wysłać zepsutego kodu',
        'Zmieniają motyw kolorystyczny terminala na zielony',
        'Kopiują repozytorium na pendrive',
        'Tworzą automatycznie bazę danych PostgreSQL',
      ],
      correctAnswer: 0,
      explanation: 'Hooki pre-commit działają jak automatyczny strażnik jakości lokalnie u programisty przed trafieniem kodu do historii Git.',
    },
  ],

  // ==================== MODUŁ 6: TYPESCRIPT (6 lekcji) ====================
  'ts-1': [
    {
      id: 'q-ts1-2',
      question: 'Czym jest inferencja typów (Type Inference) w TypeScript?',
      options: [
        'Zdolnością kompilatora TS do samodzielnego wydedukowania typu zmiennej (np. let age = 25 ma typ number) bez ręcznej adnotacji',
        'Automatycznym tłumaczeniem komentarzy na język angielski',
        'Konwertowaniem błędów runtime na ostrzeżenia CSS',
        'Usuwaniem wszystkich zmiennych const podczas builda',
      ],
      correctAnswer: 0,
      explanation: 'Dzięki inferencji nie trzeba pisać typów przy oczywistych deklaracjach — TypeScript sam wywnioskuje typ na podstawie przypisanej wartości.',
    },
    {
      id: 'q-ts1-3',
      question: 'Kiedy słowo kluczowe type ma przewagę nad interface w TypeScript?',
      options: [
        'Gdy chcemy zdefiniować unię typów (np. type Status = "idle" | "loading" | "error"), krotkę lub typ złożony',
        'Wyłącznie przy definiowaniu klas CSS',
        'interface nie obsługuje pól typu string',
        'type działa także w trakcie wykonania w przeglądarce po kompilacji',
      ],
      correctAnswer: 0,
      explanation: 'interface świetnie opisuje kształt obiektów i pozwala na deklaratywne rozszerzanie, natomiast type jest niezastąpione przy uniach, krotkach i typach narzędziowych.',
    },
  ],
  'ts-3': [
    {
      id: 'q-ts3-2',
      question: 'W jaki sposób zawęzić typ zmiennej `val: string | number` w TypeScript, aby bezpiecznie wywołać `.toUpperCase()`?',
      options: [
        'Sprawdzić typ w warunku: if (typeof val === "string") { val.toUpperCase(); }',
        'Napisać val.toUpperCase() bez sprawdzania — TS sam zgadnie typ',
        'Użyć try { val.toUpperCase() } catch {}',
        'Dodać komentarz // string',
      ],
      correctAnswer: 0,
      explanation: 'Instrukcja warunkowa z typeof działa jako Type Guard — w jej wnętrzu TypeScript zwęża unię string | number do samego string.',
    },
    {
      id: 'q-ts3-3',
      question: 'Do czego służy sprawdzenie w gałęzi default switcha przypisanej do typu `never` (tzw. Exhaustiveness Checking)?',
      options: [
        'Gwarantuje na etapie kompilacji, że obsłużyliśmy wszystkie możliwe warianty unii dyskryminowanej (np. nowy status w przyszłości wywoła błąd TS)',
        'Powoduje, że funkcja zwraca wartość null',
        'Wyłącza sprawdzanie typów w całym pliku',
        'Zamienia unię w tablicę obiektów',
      ],
      correctAnswer: 0,
      explanation: 'Przypisanie nieobsłużonego wariantu do never sprawia, że kompilator natychmiast ostrzeże nas po dodaniu nowej opcji do unii.',
    },
  ],
  'ts-4': [
    {
      id: 'q-ts4-2',
      question: 'Co oznacza typ zwracany `: void` w sygnaturze funkcji TypeScript?',
      options: [
        'Funkcja nie zwraca żadnej znaczącej wartości (np. funkcja logująca lub zapisująca stan)',
        'Funkcja rzuca wyjątek w każdej linijce i nigdy nie kończy działania',
        'Funkcja zwraca zawsze pustą tablicę []',
        'Funkcja akceptuje wyłącznie argumenty null',
      ],
      correctAnswer: 0,
      explanation: 'void sygnalizuje brak wartości zwracanej, w odróżnieniu od never, który oznacza funkcję nigdy niekończącą się poprawnym powrotem (np. zawsze rzucającą błąd).',
    },
    {
      id: 'q-ts4-3',
      question: 'Czym jest krotka (Tuple) w TypeScript, np. `type Point = [number, number]`?',
      options: [
        'Tablicą o z góry określonej długości i konkretnych typach na każdej pozycji',
        'Nieuporządkowanym zbiorem unikalnych wartości',
        'Obiektem, który nie może mieć liczb',
        'Specjalnym operatorem do porównywania obiektów',
      ],
      correctAnswer: 0,
      explanation: 'Krotki idealnie opisują stałe pary lub trójki danych, jak chociażby wynik hooka useState w React: [state, setState].',
    },
  ],
  'ts-2': [
    {
      id: 'q-ts2-2',
      question: 'Do czego służy typ generyczny (Generics) zapisywany jako `<T>` w funkcjach i interfejsach?',
      options: [
        'Pozwala napisać uniwersalny, wielokrotnie używalny kod (np. ApiResponse<T>), który zachowuje dokładne typowanie przekazanego typu T zamiast tracić je przez any',
        'Zawsze konwertuje typ T na ciąg tekstowy',
        'Ogranicza funkcję tylko do jednego konkretnego obiektu User',
        'Zwiększa rozmiar pliku JS o dodatkowy runtime',
      ],
      correctAnswer: 0,
      explanation: 'Generyki działają jak parametry dla typów — pozwalają współdzielić logikę (np. wrapper odpowiedzi API) z pełnym autouzupełnianiem.',
    },
    {
      id: 'q-ts2-3',
      question: 'Jaki jest efekt zastosowania typu narzędziowego `Pick<User, "id" | "email">` lub `Omit<User, "password">`?',
      options: [
        'Tworzy nowy typ obiektu zawierający wyłącznie wybrane pola (Pick) albo wszystkie pola poza wskazanymi (Omit)',
        'Usuwa pole password z obiektu w trakcie działania programu w JS',
        'Tworzy zapytanie SQL SELECT z bazy danych',
        'Zmienia wszystkie właściwości na opcjonalne',
      ],
      correctAnswer: 0,
      explanation: 'Typy użytkowe Pick i Omit pozwalają bezpiecznie wyprowadzać podzbiory DTO z bazowego modelu bez duplikowania definicji.',
    },
  ],
  'ts-5': [
    {
      id: 'q-ts5-2',
      question: 'Jaki typ w React + TypeScript najlepiej zastosować dla funkcji obsługującej zdarzenie zmiany pola `<input>`?',
      options: [
        'React.ChangeEvent<HTMLInputElement>',
        'React.MouseEvent<HTMLDivElement>',
        'Promise<HTMLInputElement>',
        'KeyboardEvent<Window>',
      ],
      correctAnswer: 0,
      explanation: 'React.ChangeEvent<HTMLInputElement> poprawnie typuje e.target.value jako string na kontrolce input.',
    },
    {
      id: 'q-ts5-3',
      question: 'Dlaczego typowanie odpowiedzi zewnętrznego API samym `await res.json() as User` nie chroni przed błędnymi danymi w trakcie działania programu?',
      options: [
        'Ponieważ asercja `as User` działa tylko w czasie kompilacji i znika w JS — do weryfikacji kształtu danych w runtime potrzebujemy np. schematu Zod',
        'Ponieważ res.json() zawsze zwraca HTML zamiast JSON',
        'Ponieważ as User blokuje zapytania POST',
        'Ponieważ fetch automatycznie odrzuca wszystkie pola typu boolean',
      ],
      correctAnswer: 0,
      explanation: 'TypeScript sprawdza typy na etapie budowania (static check); dane z sieci lub formularza mogą mieć inny kształt w runtime i warto je walidować biblioteką typu Zod.',
    },
  ],
  'ts-6': [
    {
      id: 'q-ts6-2',
      question: 'Co włącza flaga `"strict": true` w pliku konfiguracyjnym `tsconfig.json`?',
      options: [
        'Pełny pakiet rygorystycznych reguł bezpieczeństwa typów (m.in. strictNullChecks i noImplicitAny), eliminujący najczęstsze ukryte błędy JS',
        'Automatyczną minifikację kodu produkcyjnego',
        'Wyłączenie sprawdzania null i undefined',
        'Uruchamianie testów jednostkowych przed każdym zapisem pliku',
      ],
      correctAnswer: 0,
      explanation: 'Tryb strict: true to najważniejsze ustawienie tsconfig.json w profesjonalnych projektach — wymusza obsługę null/undefined i zakazuje niejawnego any.',
    },
    {
      id: 'q-ts6-3',
      question: 'Do czego służy operator `keyof typeof config` w TypeScript?',
      options: [
        'Tworzy unię typów złożoną z dokładnych nazw wszystkich kluczy istniejącego obiektu JavaScript `config`',
        'Konwertuje obiekt config na tablicę liczb',
        'Usuwa wszystkie klucze z obiektu w runtime',
        'Sprawdza wersję TypeScriptu w pliku package.json',
      ],
      correctAnswer: 0,
      explanation: 'Połączenie typeof (typ wartości JS) i keyof (unia nazw kluczy) utrzymuje typy w 100% zsynchronizowane z obiektem konfiguracyjnym.',
    },
  ],

  // ==================== MODUŁ 7: REACT (7 lekcji) ====================
  'react-1': [
    {
      id: 'q-react1-2',
      question: 'Co jest prawdą o właściwościach (props) przekazywanych do komponentu potomnego w React?',
      options: [
        'Propsy są tylko do odczytu (read-only / niemutowalne) z perspektywy komponentu potomnego — dane płyną z góry na dół',
        'Komponent potomny powinien bezpośrednio nadpisywać props.title = "Nowy"',
        'Propsy mogą mieć wyłącznie typ boolean',
        'Propsy działają tylko w komponentach klasowych',
      ],
      correctAnswer: 0,
      explanation: 'Jednokierunkowy przepływ danych (One-Way Data Flow) sprawia, że komponent nie modyfikuje otrzymanych propsów, lecz sygnalizuje zmiany przez callbacki lub własny stan.',
    },
    {
      id: 'q-react1-3',
      question: 'Dlaczego aktualizacja stanu przez setCount(prev => prev + 1) jest bezpieczniejsza niż setCount(count + 1), gdy zmieniamy stan wielokrotnie w jednej akcji?',
      options: [
        'Forma funkcyjna zawsze odczytuje najświeższą, aktualną wartość stanu z kolejki aktualizacji Reacta zamiast starej wartości z domknięcia renderu',
        'Forma funkcyjna pomija ponowne renderowanie ekranu',
        'setCount(count + 1) działa tylko dla tekstu',
        'Forma funkcyjna zapisuje licznik w ciasteczkach',
      ],
      correctAnswer: 0,
      explanation: 'React grupuje (batching) aktualizacje stanu; przekazanie funkcji (prev => ...) gwarantuje, że kolejne wywołanie bazuje na wyniku poprzedniego.',
    },
  ],
  'react-4': [
    {
      id: 'q-react4-2',
      question: 'Kiedy użycie indeksu tablicy `key={index}` przy renderowaniu listy w React jest bezpieczne, a kiedy może powodować błędy?',
      options: [
        'Jest akceptowalne wyłącznie dla statycznych list, których kolejność nigdy się nie zmienia; przy filtrowaniu, sortowaniu lub usuwaniu elementów należy użyć unikalnego ID',
        'Indeks tablicy jest zawsze lepszy niż ID z bazy danych',
        'key={index} powoduje błąd składni JSX',
        'Indeks tablicy działa wyłącznie przy 1 elemencie',
      ],
      correctAnswer: 0,
      explanation: 'Gdy dodajemy element na początek listy lub filtrujemy listę, indeksy się przesuwają i React może błędnie przypisać stan inputów do niewłaściwych wierszy.',
    },
    {
      id: 'q-react4-3',
      question: 'Do czego w React służy specjalny prop `children`?',
      options: [
        'Pozwala przekazywać dowolne elementy JSX zagnieżdżone między otwierającym a zamykającym tagiem komponentu (wzorzec kompozycji, np. <Modal>...</Modal>)',
        'Automatycznie pobiera dane dzieci użytkownika z bazy danych',
        'Ogranicza maksymalną liczbę renderowanych elementów do dwóch',
        'Służy wyłącznie do definiowania tras w React Router',
      ],
      correctAnswer: 0,
      explanation: 'Kompozycja z użyciem children umożliwia budowanie uniwersalnych kontenerów (Card, Modal, Layout) bez sztywnego wiązania się z ich zawartością.',
    },
  ],
  'react-5': [
    {
      id: 'q-react5-2',
      question: 'Czym jest komponent kontrolowany (Controlled Component) w formularzach React?',
      options: [
        'Polem formularza, którego wartość pochodzi ze stanu Reacta (value={text}) i jest aktualizowana przy każdej zmianie przez onChange',
        'Formularzem całkowicie zablokowanym atrybutem disabled',
        'Inputem obsługiwanym wyłącznie przez document.getElementById',
        'Formularzem wysyłanym bez sprawdzania jakichkolwiek danych',
      ],
      correctAnswer: 0,
      explanation: 'W komponencie kontrolowanym stan Reacta jest jedynym źródłem prawdy (Single Source of Truth) — pozwala to walidować i formatować dane na bieżąco.',
    },
    {
      id: 'q-react5-3',
      question: 'W jakim scenariuszu najczęściej korzystamy z referencji useRef w połączeniu z atrybutem ref={<element>}?',
      options: [
        'Do bezpośredniego wywołania metod DOM, takich jak automatyczne ustawienie fokusu (.focus()) lub przewinięcie elementu do widoku',
        'Do zastąpienia całego Context API',
        'Do przechowywania haseł po stronie serwera',
        'Do wymuszenia odświeżenia strony F5',
      ],
      correctAnswer: 0,
      explanation: 'useRef daje stabilny uchwyt do węzła DOM lub wartości między renderami (np. ID timera) bez wywoływania zbędnych re-renderów.',
    },
  ],
  'react-2': [
    {
      id: 'q-react2-2',
      question: 'Po co zwracamy funkcję czyszczącą (cleanup function) z wnętrza hooka useEffect?',
      options: [
        'Aby posprzątać po komponencie przed kolejnym uruchomieniem efektu lub przy odmontowaniu (np. clearInterval, removeEventListener, AbortController)',
        'Aby wyczyścić wszystkie ciasteczka w przeglądarce',
        'Aby wymusić nieskończoną pętlę zapytań do API',
        'Funkcja zwracana w useEffect jest ignorowana przez Reacta',
      ],
      correctAnswer: 0,
      explanation: 'Cleanup w useEffect zapobiega wyciekom pamięci i tzw. wyścigom danych (race conditions), gdy komponent zniknie przed zakończeniem operacji w tle.',
    },
    {
      id: 'q-react2-3',
      question: 'Kiedy uruchomi się efekt `useEffect(() => { ... }, [])` z pustą tablicą zależności?',
      options: [
        'Jednorazowo po pierwszym zamontowaniu komponentu na ekranie',
        'Po każdej zmianie dowolnego stanu w komponencie',
        'Nigdy — pusta tablica wyłącza efekt całkowicie',
        'Co 100 milisekund jak setInterval',
      ],
      correctAnswer: 0,
      explanation: 'Pusta tablica [] sygnalizuje brak obserwowanych zależności, więc efekt wykona się tylko raz przy montowaniu (oraz jego cleanup przy odmontowaniu).',
    },
  ],
  'react-6': [
    {
      id: 'q-react6-2',
      question: 'Jaka obowiązkowa konwencja nazewnictwa dotyczy każdego własnego hooka (Custom Hook) w React?',
      options: [
        'Nazwa funkcji musi zaczynać się od przedrostka `use` (np. useDebounce, useFetch)',
        'Nazwa musi kończyć się słowem `Component`',
        'Funkcja musi być klasą dziedziczącą po React.Hook',
        'Nazwa musi być zapisana WIELKIMI LITERAMI',
      ],
      correctAnswer: 0,
      explanation: 'Prefiks `use` pozwala Reactowi i regule ESLint (Rules of Hooks) weryfikować, czy hooki nie są wywoływane warunkowo lub w pętlach.',
    },
    {
      id: 'q-react6-3',
      question: 'Dlaczego przy wyszukiwarce „na żywo” stosuje się hook useDebounce zamiast wysyłać zapytanie do API przy każdym pojedynczym naciśnięciu klawisza?',
      options: [
        'Opóźnia wywołanie zapytania (np. o 300 ms) aż użytkownik przestanie pisać, co radykalnie zmniejsza liczbę niepotrzebnych zapytań sieciowych i obciążenie serwera',
        'Ukrywa wpisywany tekst gwiazdkami jak w polu hasła',
        'Tłumaczy wpisaną frazę na SQL po stronie przeglądarki',
        'Blokuje działanie klawisza Backspace',
      ],
      correctAnswer: 0,
      explanation: 'Debouncing grupuje serię szybkich zdarzeń w jedno wywołanie po krótkiej pauzie użytkownika.',
    },
  ],
  'react-3': [
    {
      id: 'q-react3-2',
      question: 'Czym różni się hook useCallback od hooka useMemo w React?',
      options: [
        'useMemo zapamiętuje wynik wywołania funkcji (wartość), a useCallback zapamiętuje samą referencję definicji funkcji między renderami',
        'useCallback wykonuje zapytania HTTP, a useMemo stylowanie CSS',
        'useMemo działa tylko raz na sesję w localStorage',
        'Oba służą wyłącznie do przekierowań URL',
      ],
      correctAnswer: 0,
      explanation: 'useCallback(fn, deps) jest równoważne useMemo(() => fn, deps) i pomaga uniknąć zbędnego re-renderowania zoptymalizowanych komponentów potomnych (React.memo).',
    },
    {
      id: 'q-react3-3',
      question: 'Kiedy warto sięgnąć po `useReducer` zamiast kilku osobnych wywołań `useState`?',
      options: [
        'Gdy stan ma wiele powiązanych ze sobą pól i złożone przejścia między akcjami (np. koszyk zakupowy, wieloetapowy formularz, tabela z filtrami)',
        'Gdy przechowujemy pojedynczy boolean `isOpen`',
        'Wyłącznie do przechowywania statycznego adresu URL API',
        'Gdy chcemy wyłączyć re-rendering całego drzewa aplikacji',
      ],
      correctAnswer: 0,
      explanation: 'useReducer centralizuje logikę aktualizacji stanu w czystej funkcji (reducerze), co ułatwia testowanie jednostkowe i utrzymanie przewidywalności.',
    },
  ],
  'react-7': [
    {
      id: 'q-react7-2',
      question: 'Jak w komponencie strony React Router odczytać dynamiczny fragment adresu URL z trasy `/lekcje/:lessonId`?',
      options: [
        'Za pomocą hooka `const { lessonId } = useParams()`',
        'Przez `document.cookie`',
        'Za pomocą `useState("lessonId")`',
        'Przez `window.alert(location)`',
      ],
      correctAnswer: 0,
      explanation: 'Hook useParams() zwraca obiekt dopasowanych parametrów dynamicznych z bieżącej ścieżki React Routera.',
    },
    {
      id: 'q-react7-3',
      question: 'Jaka jest rola komponentu ochronnego `<ProtectedRoute>` w aplikacji SPA?',
      options: [
        'Sprawdza stan uwierzytelnienia/uprawnień użytkownika i przekierowuje niezalogowanych gości na ekran logowania przed wyrenderowaniem prywatnych widoków',
        'Szyfruje cały kod JavaScript w pamięci karty graficznej',
        'Przyspiesza ładowanie czcionek Google Fonts',
        'Zastępuje bazę danych PostgreSQL',
      ],
      correctAnswer: 0,
      explanation: 'ProtectedRoute dba o właściwy UX i nawigację po stronie klienta, ale pamiętaj, że realna autoryzacja musi być zawsze egzekwowana po stronie backendu/API.',
    },
  ],

  // ==================== MODUŁ 8: BACKEND NODE.JS & EXPRESS (6 lekcji) ====================
  'node-1': [
    {
      id: 'q-node1-2',
      question: 'Do czego służy linia `app.use(express.json())` w aplikacji Express.js?',
      options: [
        'Dodaje wbudowany middleware parsujący przychodzące ciało żądania (body) w formacie JSON do obiektu `req.body`',
        'Tworzy plik package.json w głównym katalogu',
        'Automatycznie łączy serwer z bazą PostgreSQL',
        'Zamienia wszystkie odpowiedzi HTML na pliki PDF',
      ],
      correctAnswer: 0,
      explanation: 'Bez middleware express.json() właściwość req.body w żądaniach POST/PUT pozostanie undefined.',
    },
    {
      id: 'q-node1-3',
      question: 'Jaka jest różnica w Expressie między `req.params` a `req.query`?',
      options: [
        'req.params zawiera dynamiczne segmenty ścieżki (np. /users/:id -> req.params.id), a req.query parametry po znaku ? (np. ?page=2&sort=asc)',
        'req.params służy tylko do haseł, a req.query tylko do obrazków',
        'req.query działa wyłącznie w metodzie DELETE',
        'Nie ma różnicy — oba odczytują nagłówki Authorization',
      ],
      correctAnswer: 0,
      explanation: 'Parametry ścieżki (req.params) identyfikują konkretny zasób (/users/42), natomiast query string (req.query) służy do filtrowania, sortowania i paginacji.',
    },
  ],
  'node-2': [
    {
      id: 'q-node2-2',
      question: 'Dlaczego walidację danych (np. przez bibliotekę Zod) trzeba bezwzględnie wykonywać na serwerze, nawet jeśli formularz React już sprawdził pola na froncie?',
      options: [
        'Ponieważ każdy może wysłać dowolny zmodyfikowany JSON bezpośrednio do API za pomocą cURL lub Postmana, całkowicie omijając interfejs w przeglądarce',
        'Ponieważ React nie obsługuje walidacji liczb',
        'Ponieważ walidacja na froncie spowalnia bazę PostgreSQL',
        'Aby zmienić kod statusu z 200 na 301',
      ],
      correctAnswer: 0,
      explanation: 'Walidacja frontendowa poprawia jedynie UX; granicę bezpieczeństwa i integralności danych stanowi wyłącznie walidacja po stronie serwera.',
    },
    {
      id: 'q-node2-3',
      question: 'Jaki kod statusu HTTP warto zwrócić po pomyślnym utworzeniu nowego zasobu (np. użytkownika lub zadania) przez żądanie POST?',
      options: ['201 Created', '200 Found Error', '404 Created', '500 OK'],
      correctAnswer: 0,
      explanation: 'Kod 201 Created precyzyjnie komunikuje klientowi, że żądanie zakończyło się utworzeniem nowego rekordu po stronie serwera.',
    },
  ],
  'node-5': [
    {
      id: 'q-node5-2',
      question: 'Dlaczego w produkcyjnym REST API nigdy nie powinniśmy zwracać w `GET /api/posts` wszystkich 100 000 rekordów naraz bez paginacji?',
      options: [
        'Przeciąża to bazę danych, zatyka pamięć RAM serwera i drastycznie spowalnia odpowiedź sieciową do przeglądarki',
        'Przeglądarka nie potrafi sparsować tablicy dłuższej niż 10 elementów',
        'Format JSON ogranicza rozmiar odpowiedzi do 1 KB',
        'Protokół HTTP blokuje odpowiedzi większe niż 50 wierszy',
      ],
      correctAnswer: 0,
      explanation: 'Paginacja (limit/offset lub cursor-based) utrzymuje stabilny czas odpowiedzi i zużycie pamięci niezależnie od wzrostu bazy.',
    },
    {
      id: 'q-node5-3',
      question: 'Gdzie i w jaki sposób działa mechanizm CORS (Cross-Origin Resource Sharing)?',
      options: [
        'Jest to zabezpieczenie po stronie przeglądarki, która sprawdza nagłówki odpowiedzi serwera (np. Access-Control-Allow-Origin), zanim pozwoli skryptowi z innej domeny odczytać wynik',
        'Jest to zapora sieciowa wbudowana wyłącznie w cURL i Postmana',
        'Automatycznie szyfruje hasła w bazie danych',
        'Pozwala ominąć logowanie użytkownika',
      ],
      correctAnswer: 0,
      explanation: 'CORS egzekwuje przeglądarka, a nie cURL; dlatego serwer musi jawnie zezwolić wyłącznie zaufanym domenom frontendowym na odczyt odpowiedzi.',
    },
  ],
  'node-4': [
    {
      id: 'q-node4-2',
      question: 'Dlaczego przetwarzanie wielkich plików (np. import CSV 500 MB) w Node.js lepiej oprzeć o Strumienie (Streams) zamiast wczytywać cały plik do pamięci za jednym zamachem?',
      options: [
        'Strumienie przetwarzają dane małymi porcjami (chunks), utrzymując minimalne, stałe zużycie pamięci RAM serwera',
        'Strumienie działają tylko przy wyłączonej sieci',
        'Wczytanie 500 MB do RAM jest zakazane przez protokół HTTP',
        'Strumienie automatycznie kompresują tekst do formatu PNG',
      ],
      correctAnswer: 0,
      explanation: 'Przetwarzanie strumieniowe pozwala obsłużyć równolegle wielu użytkowników na serwerze o niewielkiej pamięci bez błędów Out-Of-Memory.',
    },
    {
      id: 'q-node4-3',
      question: 'Dlaczego do budowania ścieżek do plików w Node.js lepiej używać `path.join(__dirname, "uploads", file)` zamiast ręcznego sklejania stringów z `/` lub `\\`?',
      options: [
        'Moduł path automatycznie dobiera właściwe separatory ścieżek dla systemu Linux, macOS oraz Windows i porządkuje segmenty',
        'path.join automatycznie tworzy brakujące foldery na dysku',
        'Sklejanie stringów w Node.js zawsze zwraca pusty napis',
        'path.join szyfruje nazwę pliku algorytmem SHA-256',
      ],
      correctAnswer: 0,
      explanation: 'Wieloplatformowy kod backendowy nie powinien zakładać na sztywno separatora Windowsa (\\) ani Uniksa (/).',
    },
  ],
  'node-3': [
    {
      id: 'q-node3-2',
      question: 'Po co w Express.js tworzymy na samym końcu potoku middleware 4-argumentowy `(err, req, res, next)`?',
      options: [
        'Jako centralny Error Handler, który w jednym miejscu przechwytuje wszystkie błędy z tras, loguje je i zwraca spójną odpowiedź HTTP bez ujawniania stack trace klientowi',
        'Aby obsłużyć wyłącznie pliki graficzne PNG',
        'Aby zamknąć bazę danych po każdym zapytaniu GET',
        'Express wymaga zawsze 4 argumentów w każdym zwykłym routerze',
      ],
      correctAnswer: 0,
      explanation: 'Centralny middleware błędów eliminuje duplikację try/catch i dba o bezpieczeństwo (ukrywa surowe błędy wewnętrzne przed użytkownikiem).',
    },
    {
      id: 'q-node3-3',
      question: 'Za co w czystej architekturze warstwowej powinien odpowiadać sam Kontroler (Controller)?',
      options: [
        'Wyłącznie za warstwę HTTP: odczyt parametrów żądania (req), wywołanie odpowiedniej metody Serwisu oraz odesłanie statusu i odpowiedzi (res)',
        'Za pisanie surowych zapytań SQL oraz zarządzanie migracjami bazy',
        'Za renderowanie komponentów Tailwind CSS',
        'Za konfigurację certyfikatu SSL w Nginx',
      ],
      correctAnswer: 0,
      explanation: 'Rozdział Kontroler (HTTP) -> Serwis (logika biznesowa) -> Repozytorium (baza danych) znacznie ułatwia testowanie jednostkowe i utrzymanie kodu.',
    },
  ],
  'node-6': [
    {
      id: 'q-node6-2',
      question: 'Jaką rolę pełni publiczny endpoint `GET /health` (lub `/api/health`) w produkcyjnej aplikacji backendowej?',
      options: [
        'Pozwala systemom monitoringu i load balancerom (np. Docker, Kubernetes, Railway) automatycznie sprawdzać, czy proces API żyje i odpowiada prawidłowo',
        'Zwraca listę wszystkich haseł administratorów',
        'Czyści całą bazę danych po restarcie',
        'Wyłącza logowanie strukturalne',
      ],
      correctAnswer: 0,
      explanation: 'Healthcheck umożliwia automatyczne wykrycie zawieszonego kontenera i płynne przełączenie ruchu podczas wdrożeń Zero-Downtime.',
    },
    {
      id: 'q-node6-3',
      question: 'Dlaczego na produkcji zamiast zwykłego `console.log("błąd")` stosuje się logowanie strukturalne JSON (np. Pino lub Winston)?',
      options: [
        'Logi JSON zawierają poziom ważności, znacznik czasu oraz ID żądania i mogą być automatycznie filtrowane oraz agregowane w systemach monitoringu',
        'console.log jest usunięty ze specyfikacji Node.js v20',
        'Logowanie JSON automatycznie naprawia wyjątki w bazie danych',
        'Pino zmniejsza zużycie procesora przeglądarki',
      ],
      correctAnswer: 0,
      explanation: 'Logi w formacie JSON pozwalają błyskawicznie przeszukiwać błędy po userId, ścieżce czy kodzie HTTP wśród milionów wpisów.',
    },
  ],

  // ==================== MODUŁ 9: BAZY DANYCH SQL & PRISMA (6 lekcji) ====================
  'db-1': [
    {
      id: 'q-db1-2',
      question: 'Czym jest klucz obcy (Foreign Key) w relacyjnej bazie danych (np. `user_id` w tabeli `orders`)?',
      options: [
        'Kolumną przechowującą identyfikator rekordu z innej tabeli (klucz główny), gwarantującą spójność powiązań między tabelami (Integralność Referencyjna)',
        'Hasłem służącym do szyfrowania całej bazy',
        'Kluczem API Google Maps zapisanym w kolumnie',
        'Automatycznym indeksem tekstowym używanym wyłącznie w NoSQL',
      ],
      correctAnswer: 0,
      explanation: 'Foreign Key pilnuje na poziomie silnika bazy danych, aby nie utworzyć np. zamówienia przypisanego do nieistniejącego użytkownika.',
    },
    {
      id: 'q-db1-3',
      question: 'Która klauzula SQL służy do posortowania zwróconych wierszy od największej wartości do najmniejszej?',
      options: ['ORDER BY kolumna DESC', 'SORT BY kolumna MAX', 'GROUP BY kolumna TOP', 'FILTER kolumna DESC'],
      correctAnswer: 0,
      explanation: 'ORDER BY ... DESC sortuje malejąco (np. najnowsze posty lub najwyższe wyniki na górze), a ASC rosnąco.',
    },
  ],
  'db-3': [
    {
      id: 'q-db3-2',
      question: 'Co wymusza ograniczenie `UNIQUE` nałożone na kolumnę `email` w tabeli `users` w PostgreSQL?',
      options: [
        'Baza odrzuci próbę wstawienia lub zmiany wiersza na adres e-mail, który już istnieje w innym rekordzie tej tabeli',
        'Pole email może zostać pozostawione całkowicie puste dla każdego wiersza',
        'Wszystkie adresy email zostaną zamienione na wielkie litery',
        'Tabela może pomieścić maksymalnie 1 użytkownika',
      ],
      correctAnswer: 0,
      explanation: 'Więzy integralności UNIQUE gwarantują unikalność wartości na poziomie samej bazy, nawet przy jednoczesnych żądaniach równoległych (race conditions).',
    },
    {
      id: 'q-db3-3',
      question: 'Dlaczego w SQL do operacji `INSERT` czy `UPDATE` zawsze używamy zapytań parametryzowanych (`$1, $2` / ORM) zamiast sklejania stringów?',
      options: [
        'Zapobiega to atakom SQL Injection, ponieważ dane użytkownika nigdy nie są interpretowane jako część polecenia SQL',
        'Zapytania parametryzowane usuwają potrzebę tworzenia tabel',
        'Bez $1 baza PostgreSQL nie obsługuje polskich znaków',
        'Sklejanie stringów działa wolniej o 10 minut na każdym wierszu',
      ],
      correctAnswer: 0,
      explanation: 'Parametryzacja oddziela strukturę zapytania SQL od danych wejściowych, całkowicie neutralizując wstrzykiwanie złośliwego kodu SQL.',
    },
  ],
  'db-4': [
    {
      id: 'q-db4-2',
      question: 'Jaka jest różnica w wyniku zapytania między `INNER JOIN` a `LEFT JOIN`?',
      options: [
        'INNER JOIN zwraca tylko pasujące pary z obu tabel, natomiast LEFT JOIN zwraca wszystkie wiersze z lewej tabeli (nawet jeśli nie mają dopasowania po prawej — wtedy z wartością NULL)',
        'LEFT JOIN sortuje wyniki od lewej do prawej',
        'INNER JOIN potrafi łączyć tylko tabele o tej samej liczbie kolumn',
        'LEFT JOIN automatycznie usuwa duplikaty z bazy',
      ],
      correctAnswer: 0,
      explanation: 'LEFT JOIN jest niezastąpiony, gdy np. chcemy wyświetlić listę wszystkich użytkowników wraz z liczbą ich zamówień — w tym tych, którzy mają 0 zamówień.',
    },
    {
      id: 'q-db4-3',
      question: 'Która funkcja agregująca SQL służy do zliczenia liczby wierszy w grupie?',
      options: ['COUNT(*)', 'TOTAL()', 'LENGTH(*)', 'SIZE()'],
      correctAnswer: 0,
      explanation: 'Podstawowe funkcje agregujące w SQL to COUNT, SUM, AVG, MIN oraz MAX.',
    },
  ],
  'db-5': [
    {
      id: 'q-db5-2',
      question: 'Jak w relacyjnej bazie danych (PostgreSQL) modeluje się relację Wiele-do-Wielu (np. Studenci i Kursy)?',
      options: [
        'Za pomocą dodatkowej tabeli łączącej (junction table, np. enrollments) zawierającej klucze obce do obu tabel',
        'Przechowując tablicę ID rozdzieloną przecinkami w jednej kolumnie tekstowej',
        'Tworząc 50 osobnych kolumn course_1 ... course_50 w tabeli users',
        'W SQL nie da się zapisać relacji Wiele-do-Wielu',
      ],
      correctAnswer: 0,
      explanation: 'Tabela pośrednicząca (junction table) z dwoma kluczami obcymi jest standardem relacyjnym umożliwiającym indeksowanie, filtrowanie i przechowywanie metadanych relacji (np. daty zapisu).',
    },
    {
      id: 'q-db5-3',
      question: 'Do czego w transakcji SQL służy polecenie `ROLLBACK`?',
      options: [
        'Wycofuje wszystkie zmiany wykonane od początku transakcji (BEGIN), jeśli którykolwiek krok po drodze zakończył się błędem',
        'Zatwierdza zmiany na stałe na dysku',
        'Tworzy kopię zapasową tabeli w formacie ZIP',
        'Restartuje serwer aplikacji Express',
      ],
      correctAnswer: 0,
      explanation: 'Transakcja działa na zasadzie „wszystko albo nic” — w razie błędu (np. przy przelewie bankowym) ROLLBACK przywraca spójny stan sprzed operacji.',
    },
  ],
  'db-2': [
    {
      id: 'q-db2-2',
      question: 'Po co uruchamia się `npx prisma generate` po zmodyfikowaniu pliku `schema.prisma`?',
      options: [
        'Regeneruje obiekt `PrismaClient` wraz z dokładnymi typami TypeScript dopasowanymi do nowego kształtu tabel i pól',
        'Kasuje całą zawartość produkcyjnej bazy danych',
        'Kompiluje pliki CSS dla frontendu',
        'Tworzy nowe konto administratora w bazie',
      ],
      correctAnswer: 0,
      explanation: 'Prisma Client czerpie pełne podpowiadanie składni i bezpieczeństwo typów właśnie z wygenerowanego kodu po każdej zmianie schematu.',
    },
    {
      id: 'q-db2-3',
      question: 'Co w modelu `schema.prisma` oznacza atrybut `@default(autoincrement())` lub `@default(cuid())` na polu `id`?',
      options: [
        'Baza lub Prisma automatycznie wygeneruje unikalny identyfikator podczas tworzenia każdego nowego rekordu',
        'Pole id musi być podane ręcznie przez użytkownika w formularzu',
        'Każdy nowy rekord nadpisze poprzedni o tym samym id',
        'Identyfikator będzie zmieniał się losowo co minutę',
      ],
      correctAnswer: 0,
      explanation: 'Automatyczne generowanie kluczy głównych (sekwencyjny int albo CUID/UUID) odciąża kod biznesowy i gwarantuje unikalność rekordów.',
    },
  ],
  'db-6': [
    {
      id: 'q-db6-2',
      question: 'Co jest kosztem (wadą) dodania zbyt wielu niepotrzebnych indeksów B-Tree na niemal każdej kolumnie tabeli?',
      options: [
        'Spowolnienie operacji zapisu (INSERT, UPDATE, DELETE) oraz większe zużycie miejsca na dysku i w pamięci, bo każdy indeks musi być aktualizowany przy zmianach',
        'Indeksy całkowicie blokują wykonywanie zapytań SELECT',
        'Indeksy usuwają starsze wiersze z tabeli',
        'Indeksy powodują błędy składniowe w TypeScript',
      ],
      correctAnswer: 0,
      explanation: 'Indeksy przyspieszają wyszukiwanie (odczyt), ale spowalniają zapis — dlatego indeksuje się głównie kolumny często używane w WHERE, JOIN i ORDER BY.',
    },
    {
      id: 'q-db6-3',
      question: 'Jak w praktyce rozwiązać problem zapytań N+1 w ORM (np. Prisma) podczas pobierania listy postów wraz z ich autorami?',
      options: [
        'Użyć zachłannego dołączania relacji (`include: { author: true }`) lub zapytania JOIN zamiast pobierać autora osobno w pętli dla każdego posta',
        'Zwiększyć timeout bazy danych do 60 sekund',
        'Przenieść pętlę zapytań z backendu do komponentu React',
        'Usunąć klucz obcy z bazy danych',
      ],
      correctAnswer: 0,
      explanation: 'Dzięki `include` lub `JOIN` baza zwraca posty i powiązanych autorów w stałej, minimalnej liczbie zapytań (1–2 zamiast N+1).',
    },
  ],

  // ==================== MODUŁ 10: BEZPIECZEŃSTWO (5 lekcji) ====================
  'sec-1': [
    {
      id: 'q-sec1-2',
      question: 'Czym różni się haszowanie hasła algorytmem `bcrypt` (lub Argon2) od zwykłego szyfrowania symetrycznego (np. AES)?',
      options: [
        'Haszowanie z solą jest procesem jednokierunkowym (nie da się odtworzyć oryginalnego hasła z hasha), a szyfrowanie jest odwracalne za pomocą klucza',
        'bcrypt jest szybszy niż SHA-1 i nie używa soli',
        'Szyfrowanie AES usuwa spacje z hasła, a bcrypt nie',
        'Nie ma różnicy — w obu przypadkach administrator może odczytać hasło w bazie',
      ],
      correctAnswer: 0,
      explanation: 'Hasła zawsze haszujemy wolnym algorytmem z losową solą (bcrypt/Argon2), dzięki czemu nawet wyciek bazy nie ujawnia haseł użytkowników.',
    },
    {
      id: 'q-sec1-3',
      question: 'Czy zawartość payloadu tokena JWT (środkowa część Base64Url) jest ukryta przed użytkownikiem bez znajomości tajnego klucza serwera?',
      options: [
        'Nie — payload JWT jest tylko zakodowany w Base64Url (każdy może go zdekodować i przeczytać), a klucz podpisuje go, by wykryć ewentualną modyfikację',
        'Tak — JWT szyfruje wszystkie pola algorytmem wojskowym',
        'Tak — nawet przeglądarka nie widzi danych w JWT',
        'Zależy od tego, czy używamy HTTPS',
      ],
      correctAnswer: 0,
      explanation: 'Standardowy JWT gwarantuje integralność podpisem (nie da się go podrobić), ale nie poufność — nigdy nie wkładaj tajnych haseł do payloadu JWT.',
    },
  ],
  'sec-2': [
    {
      id: 'q-sec2-2',
      question: 'Na czym polega atak XSS (Cross-Site Scripting) i jak chroni przed nim sam React?',
      options: [
        'Polega na wstrzyknięciu złośliwego skryptu JS na stronę ofiary; React domyślnie escapuje tekst w `{zmienna}`, traktując go jako zwykły napis zamiast kodu HTML',
        'Polega na przepełnieniu pamięci dyskowej serwera',
        'React wyłącza obsługę zdarzeń onClick na stronie',
        'XSS występuje wyłącznie w bazach SQL',
      ],
      correctAnswer: 0,
      explanation: 'Automatyczne escapowanie w JSX chroni przed XSS, dopóki sami nie użyjemy niebezpiecznego `dangerouslySetInnerHTML` na nieoczyszczonych danych od użytkownika.',
    },
    {
      id: 'q-sec2-3',
      question: 'Co ogranicza mechanizm Rate Limiting (np. `express-rate-limit`) w API?',
      options: [
        'Maksymalną liczbę żądań z jednego adresu IP w zadanym oknie czasowym, chroniąc przed atakami brute-force na logowanie i nadużyciami DDoS',
        'Rozmiar czcionki w aplikacji React',
        'Liczbę tabel w bazie danych PostgreSQL',
        'Maksymalną długość nazwy repozytorium GitHub',
      ],
      correctAnswer: 0,
      explanation: 'Rate limiting blokuje automaty próbujące zgadywać hasła tysiące razy na sekundę lub przeciążać kosztowne endpointy.',
    },
  ],
  'sec-5': [
    {
      id: 'q-sec5-2',
      question: 'Co oznacza ustawienie flagi `Secure` na ciasteczku sesyjnym?',
      options: [
        'Przeglądarka wyśle to ciasteczko wyłącznie przez zaszyfrowane połączenie HTTPS (nigdy po zwykłym HTTP)',
        'Ciasteczko nigdy nie wygasa nawet po usunięciu historii przeglądarki',
        'Ciasteczko staje się widoczne w `document.cookie`',
        'Zezwala na wysyłkę ciasteczka do dowolnej zewnętrznej reklamy',
      ],
      correctAnswer: 0,
      explanation: 'Flaga Secure chroni token sesji przed podsłuchem w otwartych sieciach Wi-Fi na nieszyfrowanym ruchu HTTP.',
    },
    {
      id: 'q-sec5-3',
      question: 'W jakim celu ustawia się flagę `SameSite=Lax` lub `SameSite=Strict` na ciasteczku?',
      options: [
        'Aby ograniczyć wysyłanie ciasteczka w żądaniach inicjowanych z zewnętrznych witryn, co stanowi kluczową obronę przed atakami CSRF',
        'Aby podwoić czas ważności tokena JWT',
        'Aby synchronizować ciasteczka między różnymi przeglądarkami',
        'Aby umożliwić dostęp do ciasteczka przez `localStorage`',
      ],
      correctAnswer: 0,
      explanation: 'SameSite zapobiega sytuacji, w której złośliwa strona trzecia po cichu wysyła żądanie (np. przelew) w imieniu zalogowanego użytkownika.',
    },
  ],
  'sec-3': [
    {
      id: 'q-sec3-2',
      question: 'Czym różni się Uwierzytelnianie (Authentication) od Autoryzacji (Authorization)?',
      options: [
        'Authentication sprawdza KIM jesteś (logowanie), a Authorization sprawdza CO wolno Ci zrobić w systemie (uprawnienia / role RBAC)',
        'Są to dokładnie te same pojęcia używane zamiennie',
        'Authorization odbywa się przed założeniem konta, a Authentication po wylogowaniu',
        'Authentication dotyczy wyłącznie adminów, a Authorization gości',
      ],
      correctAnswer: 0,
      explanation: 'Najpierw uwierzytelniamy tożsamość (401 przy braku logowania), a potem autoryzujemy dostęp do konkretnego zasobu/roli (403 Forbidden przy braku uprawnień).',
    },
    {
      id: 'q-sec3-3',
      question: 'Dlaczego w architekturze tokenowej stosuje się krótkotrwały Access Token (np. 15 min) razem z dłuższym Refresh Tokenem?',
      options: [
        'Aby w razie przechwycenia Access Tokena zminimalizować okno nadużycia oraz móc w każdej chwili unieważnić sesję po stronie serwera przy odświeżaniu Refresh Tokena',
        'Ponieważ JWT przestaje działać matematycznie po 16 minutach',
        'Aby zmusić użytkownika do wpisywania hasła co 15 minut',
        'Aby uniknąć używania protokołu HTTPS',
      ],
      correctAnswer: 0,
      explanation: 'Krótki czas życia Access Tokena ogranicza ryzyko wycieku, a bezpiecznie przechowywany Refresh Token pozwala płynnie odnawiać sesję i zachować kontrolę (revocation).',
    },
  ],
  'sec-4': [
    {
      id: 'q-sec4-2',
      question: 'Jak działa technika „Honeypot” w formularzach chroniących przed botami spamującymi?',
      options: [
        'Dodaje ukryte dla prawdziwego człowieka pole formularza — jeśli automatyczny bot wypełni wszystkie inputy, włącznie z tym ukrytym polem, serwer odrzuca zgłoszenie',
        'Wymusza rozwiązanie 20 równań różniczkowych przed rejestracją',
        'Blokuje wszystkich użytkowników z Polski',
        'Szyfruje przycisk wyślij w formacie PNG',
      ],
      correctAnswer: 0,
      explanation: 'Honeypot połączony z pomiarem czasu wypełnienia formularza skutecznie odfiltrowuje proste boty bez męczenia użytkowników uciążliwą CAPTCHA.',
    },
    {
      id: 'q-sec4-3',
      question: 'Jakie polecenie CLI pozwala szybko sprawdzić zainstalowane zależności npm pod kątem znanych podatności bezpieczeństwa (CVE)?',
      options: ['npm audit', 'npm format', 'npm cache verify', 'npm run dev'],
      correctAnswer: 0,
      explanation: 'Komenda `npm audit` porównuje drzewo zależności w package-lock.json z publiczną bazą luk i wskazuje, które pakiety wymagają aktualizacji.',
    },
  ],

  // ==================== MODUŁ 11: FULL STACK INTEGRACJA (5 lekcji) ====================
  'fullstack-1': [
    {
      id: 'q-fs1-2',
      question: 'Co oferuje biblioteka TanStack Query (React Query) w porównaniu do ręcznego pobierania danych przez `useEffect` + `useState`?',
      options: [
        'Automatyczne cache’owanie odpowiedzi, deduplikację zapytań, odświeżanie w tle, obsługę stanów isLoading/isError oraz ponawianie po błędzie sieci',
        'Zastępuje całkowicie serwer Express.js w Node',
        'Tworzy tabele w PostgreSQL',
        'Tłumaczy kod TypeScript na Python',
      ],
      correctAnswer: 0,
      explanation: 'TanStack Query traktuje stan serwerowy (Server State) osobno od lokalnego stanu UI, usuwając dziesiątki linijek powtarzalnego kodu w komponentach.',
    },
    {
      id: 'q-fs1-3',
      question: 'Czym jest „Monorepo” w projekcie Full Stack?',
      options: [
        'Jedno wspólne repozytorium Git przechowujące spójnie kod frontendu, backendu oraz współdzielonych pakietów (np. typów i walidatorów)',
        'Aplikacja napisana w jednym wielkim pliku index.js',
        'Baza danych obsługująca tylko jednego użytkownika',
        'Repozytorium bez żadnych gałęzi',
      ],
      correctAnswer: 0,
      explanation: 'Monorepo (np. npm workspaces / pnpm / Turborepo) pozwala zmieniać kontrakt API na backendzie i frontendzie w jednym spójnym commicie.',
    },
  ],
  'fullstack-4': [
    {
      id: 'q-fs4-2',
      question: 'Dlaczego podczas odświeżania wygasłego tokena przez Response Interceptor w kliencie HTTP warto kolejkować równoległe żądania?',
      options: [
        'Aby nie wysłać 5 osobnych żądań `/auth/refresh` jednocześnie (co przy rotacji tokenów unieważniłoby sesję), tylko wykonać jedno odświeżenie i ponowić oczekujące zapytania',
        'Aby zwolnić internet użytkownika o połowę',
        'Aby wylogować użytkownika po każdym kliknięciu',
        'Aby usunąć nagłówki Content-Type',
      ],
      correctAnswer: 0,
      explanation: 'Gdy dashboard odpala 4 requesty naraz i dostaje 4x 401, pojedyncza obietnica odświeżająca (mutex/kolejka) zapobiega wyścigowi unieważniającemu Refresh Token.',
    },
    {
      id: 'q-fs4-3',
      question: 'Co należy przekazać do opcji `fetch(url, { credentials: "include" })`, jeśli autoryzacja oparta jest o bezpieczne ciasteczka `HttpOnly` na innej subdomenie/porcie?',
      options: [
        'Opcję `credentials: "include"`, aby przeglądarka dołączyła ciasteczka sesyjne i zaakceptowała `Set-Cookie` w odpowiedzi cross-origin',
        'Hasło użytkownika w URL jako `?pass=...`',
        'Nagłówek `X-Skip-Auth: true`',
        'Wyłącznie metodę `GET`',
      ],
      correctAnswer: 0,
      explanation: 'Domyślnie zapytania cross-origin w fetch nie wysyłają ciasteczek — wymaga to zarówno credentials: "include" po stronie klienta, jak i Access-Control-Allow-Credentials: true na serwerze.',
    },
  ],
  'fullstack-5': [
    {
      id: 'q-fs5-2',
      question: 'Jaka jest korzyść z użycia współdzielonego schematu Zod w aplikacji React (np. z React Hook Form) oraz Express.js?',
      options: [
        'Reguły walidacji (np. minimalna długość hasła, format e-mail, komunikaty błędów) definiujesz w jednym miejscu i działają identycznie po obu stronach aplikacji',
        'Zod automatycznie styluje formularz w CSS',
        'Dzięki Zod backend nie potrzebuje w ogóle połączenia z siecią',
        'Zod zastępuje bazę PostgreSQL',
      ],
      correctAnswer: 0,
      explanation: 'Jedno źródło prawdy (Single Source of Truth) dla walidacji eliminuje rozbieżności między komunikatami formularza na froncie a wymaganiami endpointu na backendzie.',
    },
    {
      id: 'q-fs5-3',
      question: 'Która metoda schematu Zod zwraca obiekt `{ success, data, error }` bez rzucania wyjątku, gdy dane są błędne?',
      options: ['schema.safeParse(input)', 'schema.crashIfInvalid(input)', 'schema.tryHtml(input)', 'schema.stringify(input)'],
      correctAnswer: 0,
      explanation: 'safeParse() jest wygodne w kontrolerach i formularzach, bo pozwala elegancko obsłużyć wynik walidacji zwykłym if (!result.success).',
    },
  ],
  'fullstack-2': [
    {
      id: 'q-fs2-2',
      question: 'Na czym polega wzorzec przesyłania dużych plików przez tzw. „Presigned URL” (np. do AWS S3 / Cloudflare R2 / GCS)?',
      options: [
        'Backend weryfikuje uprawnienia i generuje jednorazowy, czasowy link do chmury, a przeglądarka wysyła plik bezpośrednio do storage’u bez obciążania serwera Node.js',
        'Plik jest zamieniany na tekst i zapisywany w pliku CSS',
        'Przeglądarka wysyła plik e-mailem do administratora',
        'Backend pobiera cały dysk twardy użytkownika',
      ],
      correctAnswer: 0,
      explanation: 'Presigned URL odciąża pasmo i pamięć serwera aplikacyjnego, umożliwiając bezpieczny i szybki upload dużych plików prosto do chmury.',
    },
    {
      id: 'q-fs2-3',
      question: 'Co robi wzorzec „Optimistic Update” przy mutacjach danych w React (np. polubienie posta)?',
      options: [
        'Aktualizuje natychmiast interfejs na ekranie (0 ms opóźnienia dla oka), a w razie błędu zapytania do API cofa zmianę do poprzedniego stanu',
        'Ignoruje wszystkie błędy zwracane przez serwer bez cofania UI',
        'Wysyła każde kliknięcie dwa razy do bazy danych',
        'Wyłącza przyciski na 10 sekund',
      ],
      correctAnswer: 0,
      explanation: 'Optymistyczne aktualizacje (z bezpiecznym rollbackiem w onError) dają wrażenie błyskawicznej, natywnej responsywności interfejsu.',
    },
  ],
  'fullstack-3': [
    {
      id: 'q-fs3-2',
      question: 'Dlaczego status opłacenia zamówienia w Stripe/Przelewy24 potwierdzamy przez serwerowy Webhook z weryfikacją podpisu, a nie samo przekierowanie użytkownika na `/success`?',
      options: [
        'Ponieważ użytkownik może zamknąć przeglądarkę przed powrotem na `/success` albo po prostu wpisać ten adres ręcznie w pasek URL bez płacenia; webhook gwarantuje wiarygodne potwierdzenie serwer-serwer',
        'Ponieważ strona `/success` nie obsługuje CSS',
        'Ponieważ webhook nie wymaga połączenia z internetem',
        'Aby dwukrotnie pobrać środki z karty klienta',
      ],
      correctAnswer: 0,
      explanation: 'Podpisany kryptograficznie webhook Stripe jest jedynym wiarygodnym źródłem informacji o zaksięgowanej płatności w systemach produkcyjnych.',
    },
    {
      id: 'q-fs3-3',
      question: 'Co oznacza „idempotentność” przy obsłudze webhooków płatniczych i ponawianiu żądań?',
      options: [
        'Wielokrotne odebranie tego samego zdarzenia (np. przez retry Stripe) nie przyzna użytkownikowi usługi podwójnie ani nie wywoła błędu',
        'Serwer może przyjąć tylko jedną płatność w całej historii aplikacji',
        'Wszystkie płatności muszą wynosić dokładnie 0 zł',
        'Webhook usuwa konto użytkownika po 24 godzinach',
      ],
      correctAnswer: 0,
      explanation: 'Zapisanie eventId z webhooka w bazie (lub unikalny constraint) gwarantuje, że powtórzone powiadomienie z bramki płatności nie zdubluje subskrypcji.',
    },
  ],

  // ==================== MODUŁ 12: TESTOWANIE (4 lekcje) ====================
  'test-1': [
    {
      id: 'q-tst1-2',
      question: 'Co powinno być główną cechą czystych funkcji (Pure Functions), aby najłatwiej pokryć je testami jednostkowymi w Vitest lub node:test?',
      options: [
        'Dla tych samych argumentów wejściowych zawsze zwracają identyczny wynik i nie modyfikują ukrytego stanu globalnego ani nie wymagają bazy/sieci',
        'Muszą zawsze zawierać w środku wywołanie fetch() i DOM',
        'Powinny mieć co najmniej 500 linijek kodu',
        'Nie mogą zwracać żadnych wartości',
      ],
      correctAnswer: 0,
      explanation: 'Wydzielenie logiki biznesowej (np. walidacji, kalkulatorów, parserów) do czystych funkcji czyni testy błyskawicznymi i deterministycznymi.',
    },
    {
      id: 'q-tst1-3',
      question: 'Co oznacza skrótowy schemat pisania czytelnego testu „AAA” (Arrange – Act – Assert)?',
      options: [
        'Przygotuj dane wejściowe (Arrange), wywołaj testowaną funkcję (Act), sprawdź czy wynik zgadza się z oczekiwaniami (Assert)',
        'Autoryzuj użytkownika, Aktywuj serwer, Archiwizuj logi',
        'Uruchom testy trzy razy pod rząd',
        'Testuj wyłącznie formularze HTML',
      ],
      correctAnswer: 0,
      explanation: 'Struktura Arrange-Act-Assert sprawia, że każdy test ma jasny cel i czyta się go jak dokumentację zachowania funkcji.',
    },
  ],
  'test-2': [
    {
      id: 'q-tst2-2',
      question: 'Dlaczego w React Testing Library zaleca się wyszukiwać elementy przez `getByRole("button", { name: /zapisz/i })` zamiast po wewnętrznych klasach CSS?',
      options: [
        'Testuje aplikację dokładnie tak, jak widzi ją użytkownik i czytnik ekranu, jednocześnie weryfikując dostępność (WCAG) i będąc odpornym na zmianę klas Tailwinda',
        'getByRole jest jedyną metodą działającą w przeglądarce Firefox',
        'Klasy CSS nie istnieją podczas testów React',
        'getByRole automatycznie naprawia błędy TypeScript',
      ],
      correctAnswer: 0,
      explanation: 'Testowanie zachowania użytkownika (Accessibility-first queries) zamiast szczegółów implementacji sprawia, że refaktoryzacja stylów nie psuje testów.',
    },
    {
      id: 'q-tst2-3',
      question: 'Po co w testach komponentów React mockujemy zewnętrzne wywołania sieciowe (`fetch` / API)?',
      options: [
        'Aby testy były szybkie, powtarzalne i niezależne od działania zewnętrznych serwerów czy limitów prawdziwego API',
        'Ponieważ komponenty React nie obsługują zapytań fetch',
        'Aby ominąć kompilację TypeScript',
        'Aby testy zawsze przechodziły nawet przy zepsutym UI',
      ],
      correctAnswer: 0,
      explanation: 'Mockowanie sieci pozwala przetestować deterministycznie zarówno stan ładowania, sukces, jak i obsługę błędu 500 z serwera.',
    },
  ],
  'test-4': [
    {
      id: 'q-test4-2',
      question: 'Co przede wszystkim weryfikują testy integracyjne REST API uruchamiane np. za pomocą Supertest?',
      options: [
        'Czy cały przepływ HTTP (routing, middleware autoryzacji, walidacja Zod, kontroler, serwis, format JSON i kody statusu) współpracuje poprawnie razem',
        'Wyłącznie kolor tła przycisków na stronie głównej',
        'Czy monitor użytkownika ma rozdzielczość 4K',
        'Wyłącznie poprawność składni pliku README.md',
      ],
      correctAnswer: 0,
      explanation: 'Testy integracyjne sprawdzają współpracę wielu warstw razem, dając ogromną pewność poprawności całego kontraktu API.',
    },
    {
      id: 'q-test4-3',
      question: 'Dlaczego testy integracyjne powinny uruchamiać się na odizolowanej bazie testowej (z czyszczeniem stanu między testami), a nigdy na bazie produkcyjnej?',
      options: [
        'Aby nie nadpisać ani nie usunąć danych prawdziwych klientów oraz zapewnić powtarzalne wyniki niezależnie od kolejności testów',
        'Ponieważ baza produkcyjna nie obsługuje zapytań INSERT',
        'Ponieważ baza testowa zawsze działa bez SQL',
        'Aby ukryć testy przed systemem CI/CD',
      ],
      correctAnswer: 0,
      explanation: 'Izolacja środowiska testowego chroni dane użytkowników i gwarantuje, że jeden test nie zanieczyszcza danych kolejnego testu.',
    },
  ],
  'test-3': [
    {
      id: 'q-tst3-2',
      question: 'Jak w Playwright bezpiecznie oczekiwać na pojawienie się komunikatu sukcesu po kliknięciu przycisku zamiast używać `waitForTimeout`?',
      options: [
        'Użyć web-first assertion np. `await expect(page.getByText("Zapisano")).toBeVisible()`, które inteligentnie czeka i ponawia sprawdzenie',
        'Wstawić `while(true) {}` przed asercją',
        'Użyć `sleep(10000)` w kodzie aplikacji',
        'Odświeżać stronę w pętli 5 razy',
      ],
      correctAnswer: 0,
      explanation: 'Asercje web-first w Playwright automatycznie czekają aż element stanie się widoczny i stabilny, eliminując tzw. flaky tests.',
    },
    {
      id: 'q-tst3-3',
      question: 'Co jest kluczową funkcją „Quality Gates” (bramek jakości) w potoku CI/CD na GitHub Actions przed wdrożeniem?',
      options: [
        'Automatycznie blokuje scalenie Pull Requesta lub deploy na produkcję, jeśli `tsc`, linter, testy jednostkowe albo build zakończą się błędem',
        'Wysyła automatycznie SMS do wszystkich użytkowników po każdym commicie',
        'Zmniejsza liczbę plików w repozytorium do jednego',
        'Wyłącza HTTPS w trybie produkcyjnym',
      ],
      correctAnswer: 0,
      explanation: 'Quality Gates eliminują czynnik ludzkiego przeoczenia — żadna zmiana psująca kompilację lub testy nie trafi na serwer produkcyjny.',
    },
  ],

  // ==================== MODUŁ 13: DEVOPS & DEPLOYMENT (4 lekcje) ====================
  'devops-1': [
    {
      id: 'q-dop1-2',
      question: 'Czym różni się obraz Docker (Docker Image) od kontenera Docker (Docker Container)?',
      options: [
        'Obraz to niezmienny szablon/przepis aplikacji z zależnościami, a kontener to uruchomiona w izolacji żywa instancja tego obrazu (jak klasa i obiekt)',
        'Kontener służy tylko do grafiki SVG, a obraz do baz danych',
        'Obraz działa wyłącznie na Windowsie, a kontener tylko na Macu',
        'Nie ma różnicy — oba terminy oznaczają dokładnie ten sam plik',
      ],
      correctAnswer: 0,
      explanation: 'Z jednego obrazu (Image) możesz uruchomić wiele niezależnych, powtarzalnych kontenerów (Containers) lokalnie i w chmurze.',
    },
    {
      id: 'q-dop1-3',
      question: 'Do czego służy plik `docker-compose.yml` podczas lokalnego programowania aplikacji Full Stack?',
      options: [
        'Pozwala jedną komendą `docker compose up` uruchomić i połączyć siecią wiele usług naraz (np. Backend, PostgreSQL, Redis)',
        'Konwertuje pliki CSS na obrazy Docker',
        'Zastępuje całkowicie plik `tsconfig.json`',
        'Publikuje aplikację bezpośrednio w sklepie Google Play',
      ],
      correctAnswer: 0,
      explanation: 'Docker Compose orkiestruje zestaw współpracujących kontenerów i wolumenów danych w jednym czytelnym pliku YAML.',
    },
  ],
  'devops-2': [
    {
      id: 'q-dop2-2',
      question: 'Jaką funkcję pełni Nginx jako Reverse Proxy przed aplikacją Node.js działającą na porcie 3000?',
      options: [
        'Odbiera ruch z Internetu na portach 80/443, obsługuje szyfrowanie SSL/TLS (HTTPS), kompresję i pliki statyczne, a zapytania API przekazuje bezpiecznie do localhost:3000',
        'Kompiluje kod TypeScript bezpośrednio w przeglądarce klienta',
        'Służy do rysowania wykresów na dashboardzie React',
        'Zastępuje bazę danych PostgreSQL',
      ],
      correctAnswer: 0,
      explanation: 'Reverse Proxy oddziela warstwę sieciową/TLS i statyczne zasoby od procesu aplikacji Node.js, podnosząc bezpieczeństwo i wydajność.',
    },
    {
      id: 'q-dop2-3',
      question: 'Który rekord DNS wskazuje bezpośrednio adres IPv4 serwera VPS (np. dla domeny `fsda.tech`), a który tworzy alias do innej nazwy domeny?',
      options: [
        'Rekord A mapuje domenę na adres IPv4, natomiast CNAME tworzy alias do innej nazwy domenowej',
        'Rekord MX mapuje na IPv4, a TXT na bazę danych',
        'Oba służą wyłącznie do weryfikacji poczty e-mail',
        'Rekord HTTPS służy do przechowywania obrazków',
      ],
      correctAnswer: 0,
      explanation: 'Rekord A wskazuje na konkretny adres IPv4 serwera, AAAA na IPv6, a CNAME wskazuje na inną nazwę hosta.',
    },
  ],
  'devops-4': [
    {
      id: 'q-devops4-2',
      question: 'Dlaczego na serwerze VPS warto skonfigurować zaporę UFW (Uncomplicated Firewall), otwierając np. tylko porty 22 (SSH), 80 (HTTP) i 443 (HTTPS)?',
      options: [
        'Aby zablokować z zewnątrz bezpośredni dostęp do wewnętrznych portów usług (np. PostgreSQL 5432, Redis 6379 czy Node 3000) zgodnie z zasadą najmniejszych uprawnień',
        'Aby zwiększyć zużycie pamięci RAM przez Nginx',
        'Aby wyłączyć wszystkie certyfikaty HTTPS',
        'Bez UFW przeglądarki nie wyświetlają stylów CSS',
      ],
      correctAnswer: 0,
      explanation: 'Wystawianie portów bazy danych lub niezabezpieczonego portu aplikacji bezpośrednio na świat to krytyczne ryzyko — firewall blokuje niechciany ruch.',
    },
    {
      id: 'q-devops4-3',
      question: 'Co daje uruchomienie Node.js w trybie Cluster (np. `pm2 start server.js -i max`) na serwerze wielordzeniowym?',
      options: [
        'Uruchamia wiele procesów roboczych wykorzystujących wszystkie dostępne rdzenie CPU i automatycznie rozkłada pomiędzy nie ruch HTTP',
        'Zmniejsza rozmiar pliku package.json',
        'Przenosi całą bazę PostgreSQL do localStorage',
        'Wyłącza obsługę zapytań POST',
      ],
      correctAnswer: 0,
      explanation: 'Pojedynczy proces Node.js używa jednego wątku dla JS; tryb Cluster pozwala w pełni wykorzystać wszystkie rdzenie procesora serwera.',
    },
  ],
  'devops-3': [
    {
      id: 'q-dop3-2',
      question: 'Dlaczego regularne tworzenie i testowanie odtwarzania kopii zapasowych (`pg_dump`) na zewnętrznym dysku/chmurze jest obowiązkowe na produkcji?',
      options: [
        'Ponieważ przypadkowe usunięcie danych, awaria dysku serwera lub atak ransomware bez zewnętrznego, sprawdzonego backupu oznaczają nieodwracalną utratę danych użytkowników',
        'Ponieważ pg_dump automatycznie przyspiesza animacje CSS o 200%',
        'Ponieważ backup jest wymagany wyłącznie przed pierwszą linią kodu',
        'Ponieważ GitHub przechowuje zawsze całą zawartość bazy PostgreSQL',
      ],
      correctAnswer: 0,
      explanation: 'Zasada 3-2-1 backupu i okresowe testy odtworzenia chronią projekt przed katastrofalną utratą bazy danych.',
    },
    {
      id: 'q-dop3-3',
      question: 'Co umożliwia poprawne skonfigurowanie manifestu PWA (`manifest.webmanifest`) oraz Service Workera w aplikacji webowej?',
      options: [
        'Instalację aplikacji bezpośrednio na ekranie głównym telefonu/komputera z ikoną i obsługę trybu offline / buforowania zasobów',
        'Uruchomienie bazy PostgreSQL wewnątrz pliku SVG',
        'Automatyczną publikację kodu na npm bez konta',
        'Wyłączenie polityki Same-Origin w przeglądarce',
      ],
      correctAnswer: 0,
      explanation: 'PWA łączy natychmiastowy dostęp przez URL z doświadczeniem przypominającym aplikację natywną oraz niezawodnością cache.',
    },
  ],

  // ==================== MODUŁ 14: ZAAWANSOWANY FULL STACK (4 lekcje) ====================
  'next-1': [
    {
      id: 'q-nxt1-2',
      question: 'Kiedy w Next.js App Router musimy na samej górze pliku dodać dyrektywę `"use client"`?',
      options: [
        'Gdy komponent korzysta z interaktywności przeglądarkowej: hooków stanu (`useState`, `useEffect`), zdarzeń (`onClick`, `onChange`) lub obiektów `window`/`localStorage`',
        'W każdym pliku strony `page.tsx`, nawet jeśli wyświetla sam statyczny tekst',
        'Wyłącznie w plikach CSS',
        'Gdy chcemy połączyć się bezpośrednio z bazą PostgreSQL w komponencie',
      ],
      correctAnswer: 0,
      explanation: 'Domyślnie komponenty w App Routerze to Server Components (0 KB JS na froncie); `"use client"` oznaczamy tylko interaktywne wyspy UI.',
    },
    {
      id: 'q-nxt1-3',
      question: 'Do czego służą Server Actions w nowoczesnym Next.js?',
      options: [
        'Pozwalają wywoływać asynchroniczne funkcje serwerowe bezpośrednio z formularzy i komponentów React (np. zapis do bazy i `revalidatePath`) bez ręcznego pisania boilerplate endpointu API',
        'Służą wyłącznie do generowania animacji CSS',
        'Uruchamiają kod SQL bezpośrednio w przeglądarce klienta',
        'Zastępują plik `package.json`',
      ],
      correctAnswer: 0,
      explanation: 'Server Actions upraszczają mutacje danych z zachowaniem pełnego bezpieczeństwa po stronie serwera oraz automatycznym odświeżaniem cache.',
    },
  ],
  'next-2': [
    {
      id: 'q-nxt2-2',
      question: 'Jaka jest główna przewaga protokołu WebSocket nad ciągłym odpytywaniem serwera co sekundę (HTTP Polling) w czacie lub grze na żywo?',
      options: [
        'Utrzymuje stałe, dwukierunkowe połączenie TCP bez ciągłego narzutu nagłówków HTTP, zapewniając natychmiastowe dostarczanie zdarzeń w czasie rzeczywistym',
        'WebSocket nie wymaga w ogóle serwera po drugiej stronie',
        'WebSocket przesyła wyłącznie statyczne obrazki PNG',
        'HTTP Polling nie działa w Chrome',
      ],
      correctAnswer: 0,
      explanation: 'Stały kanał full-duplex WebSocket redukuje opóźnienia i niepotrzebny ruch sieciowy przy częstej wymianie wiadomości.',
    },
    {
      id: 'q-nxt2-3',
      question: 'Kiedy zamiast pełnego dwukierunkowego WebSocketa wystarczy prostszy mechanizm Server-Sent Events (SSE)?',
      options: [
        'Gdy potrzebujemy jednokierunkowego strumienia aktualizacji z serwera do klienta (np. powiadomienia na żywo, postęp generowania odpowiedzi AI, ticker kursów)',
        'Gdy wysyłamy z przeglądarki strumień wideo 4K do serwera',
        'Gdy aplikacja nie ma połączenia z Internetem',
        'SSE służy wyłącznie do wysyłania formularzy kontaktowych',
      ],
      correctAnswer: 0,
      explanation: 'SSE działa po zwykłym HTTP i posiada wbudowane automatyczne wznawianie połączenia — świetnie sprawdza się do strumieniowania danych od serwera do UI.',
    },
  ],
  'next-3': [
    {
      id: 'q-nxt3-2',
      question: 'Dlaczego kosztowne zadania takie jak generowanie raportu PDF lub wysyłka 500 e-maili przenosimy do kolejki zadań w tle (np. Redis + BullMQ) zamiast wykonywać je w trakcie żądania HTTP?',
      options: [
        'Aby nie blokować odpowiedzi API dla użytkownika (natychmiastowe 202 Accepted), zyskać automatyczne ponawianie po błędzie (retries) i kontrolę obciążenia',
        'Ponieważ Node.js nie potrafi wysyłać e-maili bez Redisa',
        'Ponieważ kolejki zamieniają PDF na JSON',
        'Aby usunąć potrzebę posiadania bazy PostgreSQL',
      ],
      correctAnswer: 0,
      explanation: 'Kolejka zadań (Job Queue) oddziela szybką odpowiedź HTTP od wolnych lub zawodnych operacji zewnętrznych, zwiększając niezawodność systemu.',
    },
    {
      id: 'q-nxt3-3',
      question: 'Co jest częstą przyczyną słabego wyniku LCP (Largest Contentful Paint) w Google Core Web Vitals?',
      options: [
        'Zbyt ciężki, nieoptymalizowany obraz hero lub skrypty blokujące renderowanie, które opóźniają wyświetlenie głównej treści strony',
        'Zbyt krótki tytuł w tagu `<title>`',
        'Użycie pliku robots.txt',
        'Stosowanie zmiennych CSS zamiast sztywnych kolorów',
      ],
      correctAnswer: 0,
      explanation: 'Optymalizacja LCP obejmuje kompresję obrazów (WebP/AVIF), preloading kluczowych zasobów i ograniczenie blokującego JS.',
    },
  ],
  'next-4': [
    {
      id: 'q-next4-2',
      question: 'Jaką główną rolę pełni wzorzec API Gateway w architekturze opartej na wielu usługach?',
      options: [
        'Stanowi pojedynczy punkt wejścia dla klientów, odpowiadający m.in. za routing do odpowiednich usług, uwierzytelnianie, Rate Limiting i agregację odpowiedzi',
        'Służy jako edytor grafiki wektorowej na serwerze',
        'Zastępuje przeglądarkę internetową u użytkownika',
        'Szyfruje nazwy zmiennych w plikach TypeScript',
      ],
      correctAnswer: 0,
      explanation: 'API Gateway upraszcza architekturę od strony klienta (jeden spójny punkt wejścia) i centralizuje aspekty przekrojowe takie jak auth czy limity zapytań.',
    },
    {
      id: 'q-next4-3',
      question: 'Kiedy ma sens rozważenie architektury mikrousług zamiast dobrze zorganizowanego Monolitu Modularnego?',
      options: [
        'Dopiero przy dużej skali produktu, niezależnych zespołach i wyraźnie różnych wymaganiach skalowania poszczególnych domen — na start Monolit Modularny jest szybszy i prostszy w utrzymaniu',
        'Od samego początku, nawet przy prostym blogu dla jednego autora',
        'Wyłącznie wtedy, gdy aplikacja nie ma bazy danych',
        'Mikrousługi eliminują potrzebę pisania testów',
      ],
      correctAnswer: 0,
      explanation: 'Mikrousługi wnoszą spory narzut operacyjny (sieć, rozproszone transakcje, obserwowalność); zaczynanie od czystego monolitu modularnego to złota praktyka inżynierska.',
    },
  ],

  // ==================== MODUŁ 15: PORTFOLIO & KARIERA (4 lekcje) ====================
  'career-1': [
    {
      id: 'q-car1-2',
      question: 'Co w pierwszej kolejności powinien zawierać profesjonalny plik `README.md` projektu w portfolio na GitHubie?',
      options: [
        'Krótki opis problemu biznesowego, link do działającego demo na żywo, zrzuty ekranu, listę technologii i jasną instrukcję uruchomienia lokalnego',
        'Wyłącznie napis „Mój pierwszy projekt” bez żadnych informacji',
        'Wklejone prywatne klucze API i hasła do bazy produkcyjnej',
        'Skopiowaną treść licencji MIT bez opisu aplikacji',
      ],
      correctAnswer: 0,
      explanation: 'Rekruter i Tech Lead spędzają nad projektem często 60 sekund — świetne README z linkiem Live Demo od razu wyróżnia kandydata.',
    },
    {
      id: 'q-car1-3',
      question: 'Które projekty robią znacznie lepsze wrażenie w CV Junior/Regular Full Stacka niż popularna prosta lista „ToDo App”?',
      options: [
        'Realistyczne aplikacje rozwiązujące konkretny problem domenowy (np. z autoryzacją, walidacją, bazą danych, testami i wdrożeniem na żywo)',
        'Dziesięć identycznych kalkulatorów skopiowanych z tego samego tutoriala',
        'Puste repozytorium z samym plikiem `.gitignore`',
        'Projekt bez działającego przycisku uruchomienia',
      ],
      correctAnswer: 0,
      explanation: 'Nawet 2–3 dopracowane, wdrożone projekty biznesowe z czystym kodem i testami są warte więcej niż 15 niedokończonych klonów tutoriali.',
    },
  ],
  'career-2': [
    {
      id: 'q-car2-2',
      question: 'Jak najlepiej odpowiadać na trudne pytanie techniczne podczas rozmowy rekrutacyjnej, gdy nie pamiętasz dokładnej nazwy metody lub odpowiedzi?',
      options: [
        'Głośno przeanalizować problem, wyjaśnić swój tok rozumowania oraz kompromisy (trade-offs) i uczciwie zaznaczyć, co sprawdziłbyś w dokumentacji',
        'Zamilknąć na minutę albo wymyślać nieistniejące API udając pewność siebie',
        'Przerwać rozmowę i wyjść ze spotkania',
        'Powiedzieć, że nigdy nie używasz Google ani dokumentacji',
      ],
      correctAnswer: 0,
      explanation: 'Rekruterzy oceniają przede wszystkim sposób myślenia inżynierskiego, analizę problemu i szczerość komunikacyjną, a nie pamięciową recytację.',
    },
    {
      id: 'q-car2-3',
      question: 'O co warto zapytać zespół techniczny pod koniec rozmowy rekrutacyjnej, aby pokazać dojrzałość zawodową?',
      options: [
        'O proces Code Review, sposób wdrażania zmian na produkcję (CI/CD), największe wyzwania techniczne zespołu oraz wdrożenie (onboarding) w pierwszych tygodniach',
        'Wyłącznie o to, czy wolno nie pisać żadnych testów',
        'Nie zadawać żadnych pytań i od razu się rozłączyć',
        'Zapytać, jakie hasło ma baza produkcyjna',
      ],
      correctAnswer: 0,
      explanation: 'Mądre pytania o procesy inżynierskie pokazują, że zależy Ci na jakości oprogramowania i szybko odnajdziesz się w realnej pracy zespołowej.',
    },
  ],
  'career-4': [
    {
      id: 'q-career4-2',
      question: 'Jaką złożoność czasową ma znalezienie wartości przy użyciu zagnieżdżonej pętli porównującej każdy element z każdym w tablicy o długości N?',
      options: ['O(N²) — kwadratowa', 'O(1) — stała', 'O(log N) — logarytmiczna', 'O(N) — liniowa'],
      correctAnswer: 0,
      explanation: 'Podwójna pętla po tej samej tablicy daje O(N²); w wielu zadaniach typu Two-Sum zamiana wewnętrznej pętli na HashMap (`Map`/`Set`) redukuje czas do O(N).',
    },
    {
      id: 'q-career4-3',
      question: 'Co warto zrobić jako PIERWSZY krok na zadaniu Live Coding przed napisaniem pierwszej linijki kodu?',
      options: [
        'Upewnić się co do wymagań i przypadków brzegowych (pusta tablica, null, duplikaty) oraz krótko omówić plan rozwiązania na prostym przykładzie',
        'Od razu pisać kod bez czytania polecenia do końca',
        'Zoptymalizować przedwcześnie kod używając mikro-hacków kosztem czytelności',
        'Skasować przykładowe testy jednostkowe',
      ],
      correctAnswer: 0,
      explanation: 'Zrozumienie edge cases i przedstawienie prostego, działającego planu przed kodowaniem chroni przed błądzeniem w ślepej uliczce.',
    },
  ],
  'career-3': [
    {
      id: 'q-car3-2',
      question: 'Do czego w metodyce Scrum służy codzienne krótkie spotkanie zespołu zwane „Daily Stand-up” (ok. 15 min)?',
      options: [
        'Do zsynchronizowania postępów nad celem Sprintu i wczesnego zgłoszenia blokerów (przeszkód wymagających wsparcia zespołu)',
        'Do szczegółowej dyskusji nad każdym średnikiem w kodzie przez 2 godziny',
        'Do publicznego karania osób za spóźnienia',
        'Do ręcznego testowania całej aplikacji przez szefa firmy',
      ],
      correctAnswer: 0,
      explanation: 'Daily to szybka synchronizacja zespołu (co pcha sprint do przodu, co nas blokuje), a nie szczegółowe spotkanie raportowe dla zarządu.',
    },
    {
      id: 'q-car3-3',
      question: 'Jaki nawyk daje najwięcej korzyści podczas pierwszych 90 dni pracy w nowym zespole IT?',
      options: [
        'Notowanie architektury i odpowiedzi zespołu, robienie małych i częstych Pull Requestów oraz zadawanie konkretnych pytań po wcześniejszym samodzielnym rozpoznaniu',
        'Przepisywanie całego działającego projektu na nowy framework w pierwszym tygodniu bez konsultacji',
        'Ukrywanie przez tydzień, że nie potrafisz uruchomić lokalnego środowiska',
        'Pomijanie dokumentacji zespołu i pisanie własnych reguł lintera na głównym repozytorium',
      ],
      correctAnswer: 0,
      explanation: 'Szybkie usamodzielnianie się poprzez notatki, małe PR-y ułatwiające Code Review i konkretną komunikację buduje zaufanie zespołu.',
    },
  ],
};
