import { InteractiveExercise, Project } from '../types';

export interface RuleResult {
  id: string;
  description: string;
  passed: boolean;
  message?: string;
}

export interface ValidationSummary {
  allPassed: boolean;
  passedCount: number;
  totalCount: number;
  results: RuleResult[];
}

export function stripCodeComments(raw: string, lang: 'html' | 'css' | 'js'): string {
  if (!raw) return '';
  if (lang === 'html') {
    return raw.replace(/<!--[\s\S]*?-->/g, '');
  }
  if (lang === 'css') {
    return raw.replace(/\/\*[\s\S]*?\*\//g, '');
  }
  // js: strip block comments /* ... */ and single-line comments // ... (avoiding http:// or https://)
  return raw
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:\\])\/\/.*$/gm, '$1');
}

export interface LessonCompletionCheck {
  canComplete: boolean;
  isExercisePassed: boolean;
  isQuizPassed: boolean;
  quizScore: number;
  requiredQuizScore: number;
  missingReasons: string[];
}

export function checkLessonCompletionEligibility(params: {
  isExercisePassed: boolean;
  quizScore?: number;
  requiredQuizScore?: number;
}): LessonCompletionCheck {
  const requiredQuizScore = params.requiredQuizScore ?? 80;
  const quizScore = params.quizScore ?? 0;
  const isExercisePassed = Boolean(params.isExercisePassed);
  const isQuizPassed = quizScore >= requiredQuizScore;
  const missingReasons: string[] = [];

  if (!isExercisePassed) {
    missingReasons.push('Rozwiąż i zalicz ćwiczenie praktyczne w edytorze kodu (Sekcja 5 — 100% testów).');
  }
  if (!isQuizPassed) {
    missingReasons.push(
      `Zdaj test wiedzy (Quiz) z wynikiem co najmniej ${requiredQuizScore}% (Twój wynik: ${quizScore}%).`
    );
  }

  return {
    canComplete: isExercisePassed && isQuizPassed,
    isExercisePassed,
    isQuizPassed,
    quizScore,
    requiredQuizScore,
    missingReasons,
  };
}

export function validateExerciseCode(
  exercise: InteractiveExercise,
  code: { html: string; css: string; js: string }
): ValidationSummary {
  const cleanHtml = stripCodeComments(code.html, 'html');
  const cleanCss = stripCodeComments(code.css, 'css');
  const cleanJs = stripCodeComments(code.js, 'js');
  const results: RuleResult[] = [];

  const normalizedHtml = cleanHtml.toLowerCase();
  const normalizedCss = cleanCss.toLowerCase().replace(/\s+/g, ' ');
  const normalizedJs = cleanJs.toLowerCase();

  for (const rule of exercise.rules) {
    let passed = false;
    let message: string | undefined;

    switch (rule.ruleType) {
      case 'html_contains': {
        const targetClean = rule.target.toLowerCase();
        passed = normalizedHtml.includes(targetClean);
        if (!passed) {
          message = `Brak oczekiwanego fragmentu: "${rule.target}"`;
        }
        break;
      }

      case 'html_tag_exists': {
        const tag = rule.target.toLowerCase();
        // Regex checking for <tag or <tag ... >
        const tagRegex = new RegExp(`<${tag}(\\s|>|/)`, 'i');
        passed = tagRegex.test(cleanHtml);
        if (!passed) {
          message = `Brak wymaganego znacznika <${rule.target}> w strukturze HTML`;
        }
        break;
      }

      case 'html_attr_exists': {
        const attrName = rule.target.toLowerCase();
        const attrVal = rule.param ? rule.param.toLowerCase() : null;
        if (attrVal) {
          const regex = new RegExp(`${attrName}\\s*=\\s*["'][^"']*${attrVal}[^"']*["']`, 'i');
          passed = regex.test(cleanHtml);
          if (!passed) {
            message = `Brak atrybutu ${attrName} zawierającego "${rule.param}"`;
          }
        } else {
          const regex = new RegExp(`\\b${attrName}\\b`, 'i');
          passed = regex.test(cleanHtml);
          if (!passed) {
            message = `Brak atrybutu ${attrName}`;
          }
        }
        break;
      }

      case 'css_contains': {
        const cssTarget = rule.target.toLowerCase();
        passed = normalizedCss.includes(cssTarget);
        if (!passed) {
          message = `Reguła CSS powinna zawierać definicję: "${rule.target}"`;
        }
        break;
      }

      case 'js_contains': {
        const jsTarget = rule.target.toLowerCase();
        passed = normalizedJs.includes(jsTarget);
        if (!passed) {
          message = `Kod JavaScript powinien zawierać: "${rule.target}"`;
        }
        break;
      }

      default:
        passed = false;
        message = 'Nieobsługiwany typ weryfikacji';
    }

    results.push({
      id: rule.id,
      description: rule.description,
      passed,
      message,
    });
  }

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const allPassed = totalCount > 0 && passedCount === totalCount;

  return {
    allPassed,
    passedCount,
    totalCount,
    results,
  };
}

const PROJECT_VERIFICATION_SPECS: Record<string, InteractiveExercise> = {
  'proj-1': {
    id: 'verify-proj-1',
    title: 'Weryfikacja Projektu #1: Osobista Strona Portfolio Programisty',
    instructions: 'Zbuduj semantyczne portfolio: dodaj nawigację <nav>, formularz kontaktowy <form> z polem <input> oraz w CSS zdefiniuj układ Flexbox/Grid (display: flex lub display: grid).',
    task: 'Uzupełnij kod HTML o tagi <nav>, <form>, <footer> oraz dodaj w CSS regułę display: flex (lub grid).',
    starterCode: {
      html: `<header>\n  <h1>Jan Kowalski — Junior Full Stack Developer</h1>\n  <!-- Etap 1: Dodaj tutaj nawigację <nav> z linkami -->\n</header>\n<main>\n  <section id="projekty">\n    <h2>Wybrane Projekty</h2>\n  </section>\n  <!-- Etap 2: Dodaj sekcję kontaktową z formularzem <form> oraz stopkę <footer> -->\n</main>`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n/* Etap 3: Dodaj układ elastyczny (np. display: flex;) dla nagłówka lub kart */`,
      js: `console.log("Inicjalizacja portfolio...");`,
    },
    solutionCode: {
      html: `<header>\n  <h1>Jan Kowalski — Junior Full Stack Developer</h1>\n  <nav aria-label="Główna nawigacja">\n    <a href="#projekty">Projekty</a>\n    <a href="#kontakt">Kontakt</a>\n  </nav>\n</header>\n<main>\n  <section id="projekty">\n    <h2>Wybrane Projekty</h2>\n  </section>\n  <section id="kontakt">\n    <form id="contactForm">\n      <label for="email">E-mail</label>\n      <input id="email" type="email" required />\n      <button type="submit">Wyślij</button>\n    </form>\n  </section>\n</main>\n<footer>\n  <p>© 2026 Jan Kowalski</p>\n</footer>`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  margin: 0;\n  padding: 20px;\n}\nheader {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}`,
      js: `console.log("Portfolio gotowe!");`,
    },
    hints: [
      'Etap 1: W pliku index.html dodaj znacznik <nav> wewnątrz <header>.',
      'Etap 2: Dodaj formularz <form> oraz znacznik <footer> na dole dokumentu HTML.',
      'Etap 3: W pliku styles.css użyj właściwości display: flex;',
    ],
    rules: [
      { id: 'p1-s1', description: 'Etap 1: Nawigacja semantyczna <nav> w strukturze HTML', ruleType: 'html_tag_exists', target: 'nav' },
      { id: 'p1-s2', description: 'Etap 2: Formularz kontaktowy <form> i stopka <footer>', ruleType: 'html_tag_exists', target: 'form' },
      { id: 'p1-s3', description: 'Etap 3: Zastosowanie układu Flexbox (display: flex) w CSS', ruleType: 'css_contains', target: 'display: flex' },
    ],
  },
  'proj-2': {
    id: 'verify-proj-2',
    title: 'Weryfikacja Projektu #2: Responsywna Strona Firmowa SaaS',
    instructions: 'Zbuduj stronę SaaS: stwórz sekcję Hero z przyciskiem CTA, siatkę CSS Grid (display: grid) dla kart cennika oraz sekcję FAQ z natywnym akordeonem <details> i <summary>.',
    task: 'Dodaj w HTML akordeon <details> + <summary>, a w CSS zdefiniuj siatkę display: grid.',
    starterCode: {
      html: `<header class="hero">\n  <h1>CloudPulse SaaS</h1>\n  <button type="button">Rozpocznij za darmo</button>\n</header>\n<section class="pricing">\n  <!-- Etap 1 i 2: Karty cennika i funkcji -->\n  <div class="card">Plan Starter</div>\n  <div class="card">Plan Pro</div>\n</section>\n<!-- Etap 3: Dodaj sekcję FAQ wykorzystującą znaczniki <details> oraz <summary> -->`,
      css: `.hero {\n  padding: 32px;\n  background: #0f172a;\n  color: white;\n}\n/* Etap 2: Zdefiniuj dla .pricing układ CSS Grid (display: grid;) */`,
      js: `console.log("SaaS Landing załadowany");`,
    },
    solutionCode: {
      html: `<header class="hero">\n  <h1>CloudPulse SaaS</h1>\n  <button type="button">Rozpocznij za darmo</button>\n</header>\n<section class="pricing">\n  <div class="card">Plan Starter</div>\n  <div class="card">Plan Pro</div>\n</section>\n<section class="faq">\n  <details>\n    <summary>Jak działa okres próbny?</summary>\n    <p>Przez 14 dni testujesz wszystkie funkcje za darmo.</p>\n  </details>\n</section>`,
      css: `.hero {\n  padding: 32px;\n  background: #0f172a;\n  color: white;\n}\n.pricing {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 16px;\n}`,
      js: `console.log("SaaS Landing załadowany");`,
    },
    hints: [
      'W index.html dodaj element <details> zawierający <summary>Pytanie</summary>.',
      'W styles.css dla klasy .pricing ustaw display: grid;',
    ],
    rules: [
      { id: 'p2-s1', description: 'Etap 1: Sekcja Hero z przyciskiem akcji <button>', ruleType: 'html_tag_exists', target: 'button' },
      { id: 'p2-s2', description: 'Etap 2: Układ wielokolumnowy CSS Grid (display: grid)', ruleType: 'css_contains', target: 'display: grid' },
      { id: 'p2-s3', description: 'Etap 3: Natywny akordeon FAQ (<details> i <summary>)', ruleType: 'html_tag_exists', target: 'details' },
    ],
  },
  'proj-3': {
    id: 'verify-proj-3',
    title: 'Weryfikacja Projektu #3: Kalkulator Programistyczny i Konwerter',
    instructions: 'Zaimplementuj silnik kalkulatora: wyświetlacz w HTML, konwersję systemów liczbowych za pomocą .toString(2) lub .toString(16) w JS oraz zapis historii w localStorage.',
    task: 'W pliku app.js użyj metody toString(2) do konwersji binarnej oraz localStorage do zapisu historii.',
    starterCode: {
      html: `<div class="calculator">\n  <input id="display" type="text" readonly value="42" />\n  <div id="binaryOutput">BIN: </div>\n  <button id="convertBtn" type="button">Przelicz BIN / HEX</button>\n</div>`,
      css: `.calculator { max-width: 320px; padding: 20px; background: #1e293b; color: white; border-radius: 12px; }`,
      js: `// Etap 1: Pobierz wartość i przelicz na system binarny używając .toString(2)\n// Etap 2: Obsłuż zdarzenie addEventListener\n// Etap 3: Zapisz wynik w localStorage`,
    },
    solutionCode: {
      html: `<div class="calculator">\n  <input id="display" type="text" readonly value="42" />\n  <div id="binaryOutput">BIN: </div>\n  <button id="convertBtn" type="button">Przelicz BIN / HEX</button>\n</div>`,
      css: `.calculator { max-width: 320px; padding: 20px; background: #1e293b; color: white; border-radius: 12px; }`,
      js: `const btn = document.getElementById('convertBtn');\nbtn.addEventListener('click', () => {\n  const val = Number(document.getElementById('display').value);\n  const bin = val.toString(2);\n  document.getElementById('binaryOutput').textContent = 'BIN: ' + bin;\n  localStorage.setItem('calc_history', JSON.stringify([bin]));\n});`,
    },
    hints: [
      'W app.js użyj addEventListener do obsługi kliknięcia przycisku.',
      'Wywołaj .toString(2) na liczbie, aby uzyskać zapis binarny.',
      'Wywołaj localStorage.setItem(...), aby zapisać historię obliczeń.',
    ],
    rules: [
      { id: 'p3-s1', description: 'Etap 1: Konwersja na system binarny (.toString(2)) w JS', ruleType: 'js_contains', target: 'tostring(2)' },
      { id: 'p3-s2', description: 'Etap 2: Podpięcie zdarzeń interfejsu (addEventListener)', ruleType: 'js_contains', target: 'addeventlistener' },
      { id: 'p3-s3', description: 'Etap 3: Zapis historii obliczeń w localStorage', ruleType: 'js_contains', target: 'localstorage' },
    ],
  },
  'proj-4': {
    id: 'verify-proj-4',
    title: 'Weryfikacja Projektu #4: TaskFlow — Tablica Kanban z Zapisem Danych',
    instructions: 'Zbuduj tablicę Kanban z obsługą przeciągania (draggable="true"), zarządzaniem stanem zadań w JS oraz serializacją JSON.stringify do LocalStorage.',
    task: 'Dodaj atrybut draggable="true" w HTML oraz użyj JSON.stringify i localStorage w JS.',
    starterCode: {
      html: `<div class="board">\n  <div class="column" id="todo">\n    <h3>Do zrobienia</h3>\n    <!-- Etap 3: Dodaj kartę zadania z atrybutem draggable="true" -->\n  </div>\n</div>`,
      css: `.board { display: flex; gap: 16px; }\n.column { background: #f1f5f9; padding: 16px; border-radius: 8px; min-width: 200px; }`,
      js: `const tasks = [{ id: 1, title: 'Skonfigurować projekt', status: 'todo' }];\n// Etap 1 i 2: Zapisz tablicę tasks w localStorage przy użyciu JSON.stringify`,
    },
    solutionCode: {
      html: `<div class="board">\n  <div class="column" id="todo">\n    <h3>Do zrobienia</h3>\n    <div class="task-card" draggable="true">Skonfigurować projekt</div>\n  </div>\n</div>`,
      css: `.board { display: flex; gap: 16px; }\n.column { background: #f1f5f9; padding: 16px; border-radius: 8px; min-width: 200px; }`,
      js: `const tasks = [{ id: 1, title: 'Skonfigurować projekt', status: 'todo' }];\nfunction saveBoard() {\n  localStorage.setItem('kanban_tasks', JSON.stringify(tasks));\n}\nsaveBoard();`,
    },
    hints: [
      'Dodaj w HTML element z atrybutem draggable="true".',
      'W JS użyj JSON.stringify(tasks) oraz localStorage.setItem(...).',
    ],
    rules: [
      { id: 'p4-s1', description: 'Etap 1: Serializacja stanu tablicy (JSON.stringify)', ruleType: 'js_contains', target: 'json.stringify' },
      { id: 'p4-s2', description: 'Etap 2: Trwały zapis zadań w localStorage', ruleType: 'js_contains', target: 'localstorage' },
      { id: 'p4-s3', description: 'Etap 3: Karta zadania z obsługą HTML5 Drag & Drop (draggable="true")', ruleType: 'html_attr_exists', target: 'draggable', param: 'true' },
    ],
  },
  'proj-5': {
    id: 'verify-proj-5',
    title: 'Weryfikacja Projektu #5: WeatherSphere — Pogodynka z Zewnętrznym API',
    instructions: 'Zaimplementuj asynchroniczne pobieranie prognozy pogody: funkcja async/await z wywołaniem fetch() oraz blokiem try/catch do bezpiecznej obsługi błędów sieciowych.',
    task: 'W pliku app.js napisz funkcję async wykorzystującą fetch(), await oraz blok try / catch.',
    starterCode: {
      html: `<div class="weather-app">\n  <input id="cityInput" placeholder="Wpisz miasto (np. Warszawa)" />\n  <button id="searchBtn" type="button">Sprawdź pogodę</button>\n  <div id="weatherResult"></div>\n</div>`,
      css: `.weather-app { padding: 20px; border-radius: 12px; background: #eff6ff; }`,
      js: `// Etap 1: Stwórz funkcję async pobierającą dane przez fetch()\n// Etap 2: Użyj słowa kluczowego await\n// Etap 3: Zabezpiecz zapytanie blokiem try / catch`,
    },
    solutionCode: {
      html: `<div class="weather-app">\n  <input id="cityInput" placeholder="Wpisz miasto (np. Warszawa)" />\n  <button id="searchBtn" type="button">Sprawdź pogodę</button>\n  <div id="weatherResult"></div>\n</div>`,
      css: `.weather-app { padding: 20px; border-radius: 12px; background: #eff6ff; }`,
      js: `async function fetchWeather(city) {\n  try {\n    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.23&longitude=21.01');\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error('Błąd sieci:', err);\n  }\n}`,
    },
    hints: [
      'Zadeklaruj funkcję jako async function fetchWeather() { ... }',
      'Wewnątrz użyj bloku try { const res = await fetch(...); } catch (err) { ... }',
    ],
    rules: [
      { id: 'p5-s1', description: 'Etap 1: Deklaracja funkcji asynchronicznej (async / await)', ruleType: 'js_contains', target: 'async' },
      { id: 'p5-s2', description: 'Etap 2: Komunikacja HTTP za pomocą Fetch API (fetch)', ruleType: 'js_contains', target: 'fetch(' },
      { id: 'p5-s3', description: 'Etap 3: Obsługa błędów sieciowych w bloku try / catch', ruleType: 'js_contains', target: 'catch' },
    ],
  },
  'proj-6': {
    id: 'verify-proj-6',
    title: 'Weryfikacja Projektu #6: PulseAnalytics — Dashboard Analityczny',
    instructions: 'Zaimplementuj logikę analityczną dashboardu: tabela transakcji <table> w HTML, obliczanie sumy przychodów metodą .reduce() oraz filtrowanie rekordów metodą .filter() w JS.',
    task: 'Dodaj tabelę <table> w HTML oraz użyj metod .filter() i .reduce() do agregacji KPI w JS.',
    starterCode: {
      html: `<div class="dashboard">\n  <h2>PulseAnalytics KPI</h2>\n  <!-- Etap 1: Dodaj tabelę <table> z nagłówkami transakcji -->\n</div>`,
      css: `.dashboard { padding: 16px; font-family: system-ui, sans-serif; }`,
      js: `const transactions = [\n  { id: 1, amount: 1200, status: 'PAID' },\n  { id: 2, amount: 850, status: 'PAID' },\n  { id: 3, amount: 300, status: 'PENDING' }\n];\n// Etap 2: Przefiltruj opłacone transakcje metodą .filter()\n// Etap 3: Oblicz łączny przychód metodą .reduce()`,
    },
    solutionCode: {
      html: `<div class="dashboard">\n  <h2>PulseAnalytics KPI</h2>\n  <table>\n    <thead><tr><th>ID</th><th>Kwota</th></tr></thead>\n    <tbody><tr><td>#1</td><td>1200 PLN</td></tr></tbody>\n  </table>\n</div>`,
      css: `.dashboard { padding: 16px; font-family: system-ui, sans-serif; }`,
      js: `const transactions = [\n  { id: 1, amount: 1200, status: 'PAID' },\n  { id: 2, amount: 850, status: 'PAID' },\n  { id: 3, amount: 300, status: 'PENDING' }\n];\nconst paid = transactions.filter((t) => t.status === 'PAID');\nconst totalRevenue = paid.reduce((acc, t) => acc + t.amount, 0);\nconsole.log('Przychód KPI:', totalRevenue);`,
    },
    hints: [
      'W pliku index.html umieść znacznik <table>.',
      'W pliku app.js użyj transactions.filter(...) oraz .reduce(...).',
    ],
    rules: [
      { id: 'p6-s1', description: 'Etap 1: Struktura tabeli danych <table> w widoku analitycznym', ruleType: 'html_tag_exists', target: 'table' },
      { id: 'p6-s2', description: 'Etap 2: Filtrowanie danych transakcyjnych metodą .filter()', ruleType: 'js_contains', target: '.filter(' },
      { id: 'p6-s3', description: 'Etap 3: Agregacja wskaźników KPI metodą .reduce()', ruleType: 'js_contains', target: '.reduce(' },
    ],
  },
  'proj-7': {
    id: 'verify-proj-7',
    title: 'Weryfikacja Projektu #7: SecureGate — System Uwierzytelniania JWT & RBAC',
    instructions: 'Zaimplementuj logikę zabezpieczeń backendu: haszowanie haseł (bcrypt), generowanie/weryfikację tokena JWT oraz konfigurację bezpiecznego ciasteczka HttpOnly.',
    task: 'W kodzie JS zaimplementuj obsługę bcrypt, jwt oraz flagi безопасности httpOnly.',
    starterCode: {
      html: `<div class="security-panel">\n  <h2>SecureGate Auth Inspector</h2>\n  <p>Status modułu autoryzacji JWT + RBAC</p>\n</div>`,
      css: `.security-panel { padding: 16px; background: #0f172a; color: #e2e8f0; border-radius: 8px; }`,
      js: `// Etap 1: Haszowanie hasła z użyciem bcrypt\n// Etap 2: Podpisanie lub weryfikacja tokena jwt\n// Etap 3: Konfiguracja ciasteczka z flagą httpOnly: true`,
    },
    solutionCode: {
      html: `<div class="security-panel">\n  <h2>SecureGate Auth Inspector</h2>\n  <p>Status modułu autoryzacji JWT + RBAC</p>\n</div>`,
      css: `.security-panel { padding: 16px; background: #0f172a; color: #e2e8f0; border-radius: 8px; }`,
      js: `const authConfig = {\n  hashPassword: (pwd) => 'bcrypt_hashed_' + pwd,\n  signToken: (payload) => 'jwt_token_' + JSON.stringify(payload),\n  cookieOptions: { httpOnly: true, secure: true, sameSite: 'strict' }\n};\nconsole.log('Konfiguracja zabezpieczeń:', authConfig);`,
    },
    hints: [
      'W pliku app.js uwzględnij wywołanie lub konfigurację bcrypt, jwt oraz flagę httpOnly.',
    ],
    rules: [
      { id: 'p7-s1', description: 'Etap 1: Haszowanie haseł z użyciem modułu bcrypt', ruleType: 'js_contains', target: 'bcrypt' },
      { id: 'p7-s2', description: 'Etap 2: Obsługa tokenów dostępowych JWT (jwt)', ruleType: 'js_contains', target: 'jwt' },
      { id: 'p7-s3', description: 'Etap 3: Zabezpieczenie Refresh Tokena flagą httpOnly', ruleType: 'js_contains', target: 'httponly' },
    ],
  },
  'proj-8': {
    id: 'verify-proj-8',
    title: 'Weryfikacja Projektu #8: DevChronicle — Blog Techniczny z CMS',
    instructions: 'Zbuduj moduł publikacji artykułów: semantyczny tag <article> w HTML, generator przyjaznych adresów URL (slug) oraz funkcję sanityzacji chroniącą przed XSS w JS.',
    task: 'Dodaj tag <article> w HTML, a w JS zaimplementuj generowanie pola slug oraz neutralizację tagów <script> (replace).',
    starterCode: {
      html: `<main>\n  <!-- Etap 1: Umieść artykuł w semantycznym znaczniku <article> -->\n  <div class="post">Wpis na blogu</div>\n</main>`,
      css: `article { max-width: 680px; margin: 0 auto; line-height: 1.7; }`,
      js: `// Etap 2: Wygeneruj przyjazny adres URL (slug) z tytułu artykułu\n// Etap 3: Zastosuj metodę .replace() do neutralizacji niebezpiecznych znaczników (ochrona XSS)`,
    },
    solutionCode: {
      html: `<main>\n  <article class="post">\n    <h1>Architektura Prisma ORM</h1>\n    <p>Treść artykułu technicznego...</p>\n  </article>\n</main>`,
      css: `article { max-width: 680px; margin: 0 auto; line-height: 1.7; }`,
      js: `function createPost(title, rawComment) {\n  const slug = title.toLowerCase().replace(/\\s+/g, '-');\n  const safeComment = rawComment.replace(/</g, '&lt;');\n  return { slug, safeComment };\n}\nconsole.log(createPost('Kurs Full Stack', 'Super wpis!'));`,
    },
    hints: [
      'W HTML zamień <div class="post"> na semantyczny znacznik <article>.',
      'W JS zdefiniuj zmienną lub pole slug oraz użyj metody .replace(...).',
    ],
    rules: [
      { id: 'p8-s1', description: 'Etap 1: Semantyczny kontener artykułu <article> w HTML', ruleType: 'html_tag_exists', target: 'article' },
      { id: 'p8-s2', description: 'Etap 2: Generator przyjaznego adresu URL (slug)', ruleType: 'js_contains', target: 'slug' },
      { id: 'p8-s3', description: 'Etap 3: Transformacja i sanityzacja tekstu metodą .replace()', ruleType: 'js_contains', target: '.replace(' },
    ],
  },
  'proj-9': {
    id: 'verify-proj-9',
    title: 'Weryfikacja Projektu #9: CodeMarket — Sklep E-Commerce & Stripe',
    instructions: 'Zaimplementuj logikę koszyka i płatności: obliczanie sumy zamówienia (.reduce), tworzenie sesji PaymentIntent (paymentIntent) oraz weryfikację webhooka Stripe.',
    task: 'W pliku app.js uzupełnij kalkulację koszyka (.reduce), obsługę paymentIntent oraz weryfikację webhook.',
    starterCode: {
      html: `<section class="checkout">\n  <h2>Koszyk CodeMarket</h2>\n  <button id="payBtn" type="button">Zapłać przez Stripe</button>\n</section>`,
      css: `.checkout { padding: 20px; border: 1px solid #cbd5e1; border-radius: 12px; }`,
      js: `const cart = [{ title: 'Kurs TypeScript', price: 149 }, { title: 'Kurs Node.js', price: 199 }];\n// Etap 1: Oblicz sumę koszyka metodą .reduce()\n// Etap 2: Utwórz obiekt paymentIntent\n// Etap 3: Dodaj obsługę zdarzenia webhook`,
    },
    solutionCode: {
      html: `<section class="checkout">\n  <h2>Koszyk CodeMarket</h2>\n  <button id="payBtn" type="button">Zapłać przez Stripe</button>\n</section>`,
      css: `.checkout { padding: 20px; border: 1px solid #cbd5e1; border-radius: 12px; }`,
      js: `const cart = [{ title: 'Kurs TypeScript', price: 149 }, { title: 'Kurs Node.js', price: 199 }];\nconst total = cart.reduce((sum, item) => sum + item.price, 0);\nconst paymentIntent = { amount: total * 100, currency: 'pln', status: 'succeeded' };\nfunction handleStripeWebhook(webhookEvent) {\n  return webhookEvent.type === 'payment_intent.succeeded';\n}\nconsole.log('Suma:', total, paymentIntent);`,
    },
    hints: [
      'Oblicz sumę za pomocą cart.reduce((sum, item) => sum + item.price, 0).',
      'Zdefiniuj zmienną paymentIntent oraz funkcję obsługującą webhook.',
    ],
    rules: [
      { id: 'p9-s1', description: 'Etap 1: Kalkulacja wartości koszyka metodą .reduce()', ruleType: 'js_contains', target: '.reduce(' },
      { id: 'p9-s2', description: 'Etap 2: Inicjalizacja transakcji Stripe (paymentIntent)', ruleType: 'js_contains', target: 'paymentintent' },
      { id: 'p9-s3', description: 'Etap 3: Weryfikacja powiadomień bramki płatniczej (webhook)', ruleType: 'js_contains', target: 'webhook' },
    ],
  },
  'proj-10': {
    id: 'verify-proj-10',
    title: 'Weryfikacja Projektu #10: TeamSync — Aplikacja B2B SaaS Multi-Tenant',
    instructions: 'Zaimplementuj izolację danych Multi-Tenant: sprawdzanie identyfikatora organizacji (tenantId), macierz ról użytkowników (role) oraz blokadę limitu planu subskrypcyjnego.',
    task: 'W pliku app.js dodaj weryfikację klucza tenantId, sprawdzanie roli (role) oraz limitu miejsc (maxSeats / limit).',
    starterCode: {
      html: `<div class="tenant-workspace">\n  <h2>TeamSync B2B Workspace</h2>\n</div>`,
      css: `.tenant-workspace { padding: 20px; background: #f8fafc; border-radius: 10px; }`,
      js: `// Etap 1: Izolacja zapytań po identyfikatorze organizacji (tenantId)\n// Etap 2: Walidacja uprawnień RBAC na podstawie pola role\n// Etap 3: Sprawdzanie limitu miejsc w planie subskrypcyjnym (limit)`,
    },
    solutionCode: {
      html: `<div class="tenant-workspace">\n  <h2>TeamSync B2B Workspace</h2>\n</div>`,
      css: `.tenant-workspace { padding: 20px; background: #f8fafc; border-radius: 10px; }`,
      js: `function canInviteMember(user, organization) {\n  if (user.tenantId !== organization.tenantId) return false;\n  if (user.role !== 'owner' && user.role !== 'admin') return false;\n  return organization.membersCount < organization.limit;\n}\nconsole.log('Multi-tenant guard ready');`,
    },
    hints: [
      'Sprawdź zgodność tenantId, uprawnienia role oraz limit planu (limit).',
    ],
    rules: [
      { id: 'p10-s1', description: 'Etap 1: Izolacja danych organizacji (tenantId)', ruleType: 'js_contains', target: 'tenantid' },
      { id: 'p10-s2', description: 'Etap 2: Kontrola dostępu oparta na rolach (role)', ruleType: 'js_contains', target: 'role' },
      { id: 'p10-s3', description: 'Etap 3: Egzekwowanie limitów planu taryfowego (limit)', ruleType: 'js_contains', target: 'limit' },
    ],
  },
  'proj-11': {
    id: 'verify-proj-11',
    title: 'Weryfikacja Projektu #11: CollabBoard — Czat i Współdzielona Tablica Realtime',
    instructions: 'Zbuduj moduł współpracy na żywo: dodaj w HTML element płótna <canvas>, a w JS pobierz kontekst rysowania getContext("2d") i obsłuż emisję zdarzeń WebSocket (emit / socket).',
    task: 'Umieść znacznik <canvas> w HTML, a w JS wywołaj getContext("2d") oraz obsługę komunikatów socket.',
    starterCode: {
      html: `<div class="collab-room">\n  <h3>Pokój projektowy #architektura</h3>\n  <!-- Etap 2: Dodaj element <canvas id="board"></canvas> -->\n</div>`,
      css: `canvas { border: 2px solid #4f46e5; border-radius: 8px; background: #ffffff; }`,
      js: `// Etap 1: Skonfiguruj połączenie lub zdarzenie socket\n// Etap 2: Pobierz kontekst płótna za pomocą getContext('2d')`,
    },
    solutionCode: {
      html: `<div class="collab-room">\n  <h3>Pokój projektowy #architektura</h3>\n  <canvas id="board" width="400" height="220"></canvas>\n</div>`,
      css: `canvas { border: 2px solid #4f46e5; border-radius: 8px; background: #ffffff; }`,
      js: `const canvas = document.getElementById('board');\nconst ctx = canvas.getContext('2d');\nconst socket = { emit: (event, payload) => console.log('WS emit:', event, payload) };\nsocket.emit('draw_line', { x: 10, y: 20 });`,
    },
    hints: [
      'Dodaj znacznik <canvas id="board"></canvas> w pliku index.html.',
      'W pliku app.js wywołaj getContext("2d") oraz zdefiniuj komunikację przez obiekt socket.',
    ],
    rules: [
      { id: 'p11-s1', description: 'Etap 1: Komunikacja dwukierunkowa WebSocket (socket)', ruleType: 'js_contains', target: 'socket' },
      { id: 'p11-s2', description: 'Etap 2: Element współdzielonego płótna <canvas> w HTML', ruleType: 'html_tag_exists', target: 'canvas' },
      { id: 'p11-s3', description: 'Etap 3: Inicjalizacja silnika rysowania 2D (getContext)', ruleType: 'js_contains', target: 'getcontext' },
    ],
  },
  'proj-12': {
    id: 'verify-proj-12',
    title: 'Weryfikacja Projektu #12: Capstone Full Stack Production App',
    instructions: 'Skonfiguruj architekturę produkcyjną Capstone: warstwa prezentacji z <main>, obsługiwany endpoint healthcheck (/api/health), zmienne środowiskowe (process.env) oraz konteneryzacja Docker.',
    task: 'Dodaj <main> w HTML oraz skonfiguruj w JS odwołanie do process.env, endpointu /api/health i konfiguracji docker.',
    starterCode: {
      html: `<!-- Etap 1: Zbuduj główny kontener aplikacji <main> -->\n<div class="capstone-shell">\n  <h1>Full Stack Capstone Production</h1>\n</div>`,
      css: `main { padding: 24px; max-width: 960px; margin: 0 auto; }`,
      js: `// Etap 2: Odczytaj konfigurację ze zmiennych środowiskowych process.env\n// Etap 3: Zdefiniuj endpoint monitoringu zdrowia aplikacji '/api/health'\n// Etap 4: Zdefiniuj deskryptor kontenera docker`,
    },
    solutionCode: {
      html: `<main class="capstone-shell">\n  <h1>Full Stack Capstone Production</h1>\n  <p>Status klastra: Online</p>\n</main>`,
      css: `main { padding: 24px; max-width: 960px; margin: 0 auto; }`,
      js: `const process = { env: { NODE_ENV: 'production', PORT: '3000' } };\nconst deploymentConfig = {\n  env: process.env.NODE_ENV,\n  healthEndpoint: '/api/health',\n  containerRuntime: 'docker-compose up -d'\n};\nconsole.log('Capstone Ready:', deploymentConfig);`,
    },
    hints: [
      'W HTML użyj semantycznego kontenera <main>.',
      'W JS odwołaj się do process.env, ścieżki /api/health oraz konfiguracji docker.',
    ],
    rules: [
      { id: 'p12-s1', description: 'Etap 1: Semantyczny kontener główny <main> w warstwie UI', ruleType: 'html_tag_exists', target: 'main' },
      { id: 'p12-s2', description: 'Etap 2: Konfiguracja zmiennych środowiskowych (process.env)', ruleType: 'js_contains', target: 'process.env' },
      { id: 'p12-s3', description: 'Etap 3: Endpoint diagnostyczny Healthcheck (/api/health)', ruleType: 'js_contains', target: '/api/health' },
      { id: 'p12-s4', description: 'Etap 4: Specyfikacja uruchomieniowa kontenera (docker)', ruleType: 'js_contains', target: 'docker' },
    ],
  },
};

export function getProjectInteractiveExercise(project: Project): InteractiveExercise {
  const spec = PROJECT_VERIFICATION_SPECS[project.id];
  if (spec) {
    return spec;
  }
  return {
    id: `verify-${project.id}`,
    title: `Weryfikacja Projektu: ${project.title}`,
    instructions: project.description,
    task: 'Zaimplementuj wymagane komponenty i uruchom automatyczne testy akceptacyjne.',
    starterCode: project.starterCode || {
      html: `<div class="project-container">\n  <h1>${project.title}</h1>\n</div>`,
      css: `body { font-family: system-ui, sans-serif; }`,
      js: `// Zaimplementuj logikę projektu`,
    },
    solutionCode: {
      html: `<main class="project-container">\n  <h1>${project.title}</h1>\n</main>`,
      css: `body { font-family: system-ui, sans-serif; display: flex; }`,
      js: `console.log("Projekt zweryfikowany");`,
    },
    hints: project.requirements.slice(0, 3),
    rules: [
      { id: 'def-1', description: 'Semantyczny kontener <main> w HTML', ruleType: 'html_tag_exists', target: 'main' },
      { id: 'def-2', description: 'Układ elastyczny w CSS (display: flex)', ruleType: 'css_contains', target: 'display: flex' },
    ],
  };
}


export function generateSandboxDocument(html: string, css: string, js: string): string {
  // Wrap in a secure, self-reporting HTML document with script error and console interceptors
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Reset & sensible defaults for exercises */
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      line-height: 1.5;
    }
    ${css}
  </style>
  <script>
    (function() {
      function sendToParent(type, message) {
        try {
          window.parent.postMessage({
            source: 'fsda-sandbox',
            type: type,
            data: message
          }, '*');
        } catch (e) {}
      }

      var _log = console.log;
      var _error = console.error;
      var _warn = console.warn;
      var _info = console.info;

      console.log = function() {
        var args = Array.prototype.slice.call(arguments);
        _log.apply(console, args);
        sendToParent('log', args.map(function(a) { 
          return typeof a === 'object' ? JSON.stringify(a) : String(a); 
        }).join(' '));
      };

      console.error = function() {
        var args = Array.prototype.slice.call(arguments);
        _error.apply(console, args);
        sendToParent('error', args.map(function(a) { 
          return typeof a === 'object' ? JSON.stringify(a) : String(a); 
        }).join(' '));
      };

      console.warn = function() {
        var args = Array.prototype.slice.call(arguments);
        _warn.apply(console, args);
        sendToParent('warn', args.map(function(a) { 
          return typeof a === 'object' ? JSON.stringify(a) : String(a); 
        }).join(' '));
      };

      window.onerror = function(msg, url, lineNo, columnNo, error) {
        sendToParent('error', 'Runtime Error (linia ' + lineNo + '): ' + msg);
        return false;
      };
    })();
  </script>
</head>
<body>
  ${html}

  <script>
    try {
      ${js}
    } catch(err) {
      console.error('Błąd wykonania skryptu: ' + (err.message || err));
    }
  </script>
</body>
</html>`;
}
