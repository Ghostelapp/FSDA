import { Module } from '../../types';

export const MODULE_5: Module = {
  id: 5,
  title: 'Git i GitHub — Kontrola Wersji i Zespołowa Praca',
  category: 'Podstawy',
  description: 'Kluczowe narzędzie każdego programisty: commity, gałęzie (branches), łączenie zmian (merge), rozwiązywanie konfliktów, pull requesty i profesjonalne portfolio na GitHub.',
  badgeName: 'Kapitan Gita',
  badgeIcon: 'GitBranch',
  durationHours: 12,
  totalXp: 450,
  prerequisites: ['Moduł 1: Fundamenty programowania'],
  topics: [
    'Inicjalizacja repozytorium, stany plików (untracked, staged, committed) i plik .gitignore',
    'Konwencja czytelnych commitów (Conventional Commits: feat, fix, chore, docs)',
    'Praca na gałęziach: git checkout, git switch, git branch i git merge',
    'Rozwiązywanie konfliktów scalania w VS Code krok po kroku',
    'Współpraca zdalna z GitHub: git push, git pull, git fetch i otwieranie Pull Requestów',
    'Code Review: jak czytać zmiany kolegów i pisać konstruktywne uwagi',
  ],
  projectBrief: 'Projekt modułu: Opublikowanie otwartego repozytorium na GitHub z profesjonalnym plikiem README.md i licencją.',
  lessons: [
    {
      id: 'git-1',
      moduleId: 5,
      moduleTitle: 'Git i GitHub — Kontrola Wersji i Zespołowa Praca',
      title: 'Podstawy Gita: Stany plików, staging i konwencja czytelnych commitów',
      slug: 'git-podstawy-stany-plikow-commity',
      durationMinutes: 30,
      xpReward: 60,
      order: 1,
      summary: 'Zrozum jak Git zapisuje migawki (snapshots) projektu w czasie. Poznaj trzy stany plików (Working Directory, Staging Area, Repository) oraz standard Conventional Commits.',
      objectives: [
        'Zainicjalizować lokalne repozytorium poleceniem git init',
        'Zrozumieć rolę poczekalni (Staging Area) i polecenia git add .',
        'Pisać profesjonalne komunikaty commitów (feat, fix, docs, chore)',
      ],
      prerequisites: ['Podstawy terminala z Modułu 1'],
      theoryMarkdown: `Git to rozproszony system kontroli wersji (**Distributed VCS**), stworzony w 2005 roku przez Linusa Torvaldsa. 

Zamiast kopiować foldery w stylu \`projekt_final_v2_ostateczny\`, Git tworzy drzewo historii (DAG — Directed Acyclic Graph).

**3 stany pliku w Git:**
1. **Working Directory (Katalog roboczy):** Pliki na Twoim dysku, które edytujesz w VS Code.
2. **Staging Area (Poczekalnia / Index):** Zmiany przygotowane do zapisania za pomocą \`git add <plik>\`.
3. **Repository (.git directory):** Trwała migawka projektu zapisana komendą \`git commit -m "opis"\`.

**Konwencja Conventional Commits:**
W profesjonalnych zespołach IT każdy commit zaczyna się od typu:
- \`feat: add user authentication with JWT\` (nowa funkcja)
- \`fix: resolve memory leak in websocket listener\` (naprawa błędu)
- \`docs: update API endpoints in README\` (dokumentacja)
- \`chore: upgrade dependencies in package.json\` (prace pomocnicze)`,
      codeExamples: [
        {
          title: 'Typowy cykl pracy z gitem w terminalu',
          language: 'bash',
          code: `# 1. Sprawdź zmodyfikowane pliki
git status

# 2. Dodaj zmiany do poczekalni (staging)
git add src/App.tsx

# 3. Zapisz migawkę z czytelnym opisem
git commit -m "feat: implement responsive navigation bar"

# 4. Sprawdź historię commitów
git log --oneline -n 5`,
          explanation: 'git log --oneline wyświetla zwięzłą listę ostatnich commitów z ich identyfikatorami SHA-1.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Sprawdź stan projektu', description: 'Wpisz git status aby zobaczyć zmienione pliki.' },
        { step: 2, title: 'Dodaj pliki do stagingu', description: 'Użyj git add . lub wskaż konkretne pliki.' },
        { step: 3, title: 'Zatwierdź commit', description: 'Uruchom git commit -m "feat: opis zmiany".' },
      ],
      interactiveExercise: {
        id: 'ex-git-1',
        title: 'Komponent wizualizacji statusu Git w terminalu',
        instructions: 'Zaprojektuj wizualny widżet statusu Git: stwórz kontener z klasą git-badge, wyświetlający aktywną gałąź <code>main</code> oraz zieloną kropkę oznaczającą czysty stan roboczy "working tree clean".',
        task: 'Utwórz komponent statusu Git z tekstem main i working tree clean.',
        starterCode: {
          html: '<!-- Zbuduj widżet statusu Git poniżej -->\n',
          css: '.git-badge { display: flex; align-items: center; gap: 8px; background: #0f172a; padding: 10px 16px; border-radius: 8px; font-family: monospace; font-size: 0.85rem; color: #cbd5e1; }\ncode { color: #818cf8; font-weight: bold; }\n.dot { height: 8px; width: 8px; border-radius: 50%; background: #22c55e; }',
          js: 'console.log("Status Git zainicjalizowany.");',
        },
        solutionCode: {
          html: '<div class="git-badge">\n  <span class="dot"></span>\n  <span>Gałąź: <code>main</code></span>\n  <span>| working tree clean</span>\n</div>',
          css: '.git-badge { display: flex; align-items: center; gap: 8px; background: #0f172a; padding: 10px 16px; border-radius: 8px; font-family: monospace; font-size: 0.85rem; color: #cbd5e1; }\ncode { color: #818cf8; font-weight: bold; }\n.dot { height: 8px; width: 8px; border-radius: 50%; background: #22c55e; }',
          js: 'console.log("Status Git zainicjalizowany.");',
        },
        hints: [
          'Użyj <div class="git-badge">.',
          'Wstaw <code>main</code>.',
          'Dodaj tekst working tree clean.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa git-badge obecna', ruleType: 'html_contains', target: 'git-badge' },
          { id: 'r2', description: 'Gałąź main w kodzie', ruleType: 'html_contains', target: 'main' },
          { id: 'r3', description: 'Status working tree clean obecny', ruleType: 'html_contains', target: 'working tree clean' },
        ],
      },
      independentTask: {
        title: 'Konfiguracja pliku .gitignore',
        instructions: 'Utwórz listę ignorowanych plików w projekcie: node_modules/, dist/, .env, *.log.',
        expectedOutcome: 'Bezpieczeństwo: brak wrażliwych haseł z pliku .env w publicznym repozytorium.',
        starterHint: 'Zawsze ignoruj node_modules i pliki ze zmiennymi środowiskowymi (.env).',
      },
      quiz: [
        {
          id: 'q-git1-1',
          question: 'Co robi polecenie git add . ?',
          options: [
            'Wysyła pliki bezpośrednio na serwer GitHub',
            'Przenosi wszystkie zmienione i nowe pliki z katalogu roboczego do poczekalni (Staging Area)',
            'Kasuje wszystkie niezapisane zmiany',
            'Tworzy nowe konto użytkownika',
          ],
          correctAnswer: 1,
          explanation: 'git add przygotowuje pliki do zatwierdzenia w następnym commicie (staging).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Commitowanie katalogu node_modules/ lub pliku .env z kluczami API',
          whyItHappens: 'Brak pliku .gitignore przed wykonaniem pierwszego polecenia git add .',
          howToFix: 'Zawsze zacznij projekt od utworzenia pliku .gitignore zawierającego node_modules i .env.',
          badCode: 'git add . && git commit -m "pierwszy commit" # Zawarł 300MB node_modules!',
          goodCode: 'echo "node_modules/\n.env" > .gitignore && git add .',
        },
      ],
      practicalTask: {
        title: 'Inicjalizacja lokalnego repozytorium',
        brief: 'Utwórz katalog, zainicjalizuj git init, stwórz plik README.md i zrób pierwszy commit.',
        steps: ['Wpisz git init', 'Wpisz echo "# Mój projekt" > README.md', 'Zrób git add README.md i commit'],
        deliverable: 'Czyste repozytorium z pierwszym zatwierdzeniem.',
      },
      completionCriteria: [
        'Zrozumienie 3 stanów plików w Git',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'git-2',
      moduleId: 5,
      moduleTitle: 'Git i GitHub — Kontrola Wersji i Zespołowa Praca',
      title: 'Gałęzie (branches), Pull Requesty i rozwiązywanie konfliktów',
      slug: 'git-galezie-pull-requests-konflikty',
      durationMinutes: 35,
      xpReward: 70,
      order: 2,
      summary: 'Naucz się pracować w zespole bez nadpisywania cudzego kodu: gałęzie funkcji (feature branches), scalanie zmian (git merge), techniki rozwiązywania konfliktów oraz tworzenie Pull Requestów na GitHub.',
      objectives: [
        'Tworzyć i przełączać gałęzie za pomocą git switch -c feature/login',
        'Scalać zmiany gałęzi do głównej linii produkcyjnej main (git merge)',
        'Rozpoznawać i bezstresowo rozwiązywać znaczniki konfliktów (<<<<<<< HEAD)',
      ],
      prerequisites: ['Lekcja 1: Podstawy Gita'],
      theoryMarkdown: `W profesjonalnych projektach nikt nie commituje bezpośrednio do gałęzi \`main\`. 

Stosuje się model **Feature Branch Workflow**:
1. Każda nowa funkcja powstaje na odrębnej gałęzi, np. \`git switch -c feature/koszyk\`.
2. Po zakończeniu pracy programista wysyła gałąź na serwer: \`git push -u origin feature/koszyk\`.
3. Otwiera **Pull Request (PR)** na GitHubie, gdzie koledzy z zespołu przeprowadzają **Code Review**.
4. Po zatwierdzeniu zmian następuje scalenie (**Merge**) do gałęzi produkcyjnej.

**Co to jest konflikt scalania (Merge Conflict)?**
Konflikt pojawia się, gdy dwóch programistów zmodyfikowało **tę samą linijkę** w tym samym pliku. Git nie zgaduje, czyja zmiana jest poprawna, lecz wstawia znaczniki:
\`\`\`
<<<<<<< HEAD (Twoja wersja)
const apiURL = "https://api.v2.dev";
=======
const apiURL = "https://api.v3.dev";
>>>>>>> feature/new-api (Wersja kolegi)
\`\`\`
Twoim zadaniem jest usunięcie znaczników i pozostawienie właściwego kodu.`,
      codeExamples: [
        {
          title: 'Przepływ pracy na gałęziach krok po kroku',
          language: 'bash',
          code: `# Pobierz najnowsze zmiany z serwera
git pull origin main

# Utwórz nową gałąź funkcji i przełącz się na nią
git switch -c feature/dark-mode

# Pracuj, commituj zmiany...
git add .
git commit -m "feat: implement dark mode styles"

# Wypchnij gałąź na GitHub
git push -u origin feature/dark-mode`,
          explanation: 'git switch to nowoczesne, bardziej intuicyjne polecenie zastępujące stare git checkout -b.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Utwórz gałąź funkcji', description: 'Użyj git switch -c nazwa-funkcji.' },
        { step: 2, title: 'Wypchnij na GitHub', description: 'Użyj git push -u origin nazwa-funkcji.' },
        { step: 3, title: 'Otwórz Pull Request', description: 'W interfejsie GitHub kliknij Compare & pull request.' },
      ],
      interactiveExercise: {
        id: 'ex-git-2',
        title: 'Komponent podglądu gałęzi Git Flow',
        instructions: 'Zaprojektuj wizualny widżet pokazujący scalenie gałęzi: stwórz kontener z klasą merge-card, tag <code> z informacją "Merge branch \'feature/auth\' into main", oraz odznakę stanu z tekstem "Merged".',
        task: 'Utwórz element z klasą merge-card, tekstem Merge branch i odznaką Merged.',
        starterCode: {
          html: '<!-- Zbuduj kartę scalenia poniżej -->\n',
          css: '.merge-card { background: #1e1b4b; border: 1px solid #4338ca; padding: 14px 18px; border-radius: 10px; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: space-between; }\ncode { color: #a5b4fc; font-family: monospace; }\n.badge { background: #8b5cf6; color: white; padding: 4px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: bold; }',
          js: 'console.log("Git branches visualizer gotowy.");',
        },
        solutionCode: {
          html: '<div class="merge-card">\n  <code>Merge branch \'feature/auth\' into main</code>\n  <span class="badge">Merged</span>\n</div>',
          css: '.merge-card { background: #1e1b4b; border: 1px solid #4338ca; padding: 14px 18px; border-radius: 10px; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: space-between; }\ncode { color: #a5b4fc; font-family: monospace; }\n.badge { background: #8b5cf6; color: white; padding: 4px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: bold; }',
          js: 'console.log("Git branches visualizer gotowy.");',
        },
        hints: [
          'Użyj <div class="merge-card">.',
          'Wstaw <code>Merge branch \'feature/auth\' into main</code>.',
          'Dodaj <span class="badge">Merged</span>.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa merge-card obecna', ruleType: 'html_contains', target: 'merge-card' },
          { id: 'r2', description: 'Komunikat Merge branch obecny', ruleType: 'html_contains', target: 'Merge branch' },
          { id: 'r3', description: 'Odznaka ze statusem Merged obecna', ruleType: 'html_contains', target: 'Merged' },
        ],
      },
      independentTask: {
        title: 'Rozwiązanie konfliktu w edytorze kodu',
        instructions: 'Zasymuluj konflikt scalania i wybierz opcję "Accept Both Changes" lub "Accept Current Change".',
        expectedOutcome: 'Spokój i pewność siebie podczas scalania kodu zespołowego.',
        starterHint: 'VS Code podświetla konflikty kolorami i oferuje przyciski akcji bezpośrednio nad kodem.',
      },
      quiz: [
        {
          id: 'q-git2-1',
          question: 'Co oznacza znacznik <<<<<<< HEAD w pliku ze statusem konfliktu?',
          options: [
            'Błąd składniowy w pliku package.json',
            'Początek zmian znajdujących się na Twojej aktualnie aktywnej gałęzi',
            'Koniec pliku źródłowego',
            'Wersję kodu pobraną z serwera',
          ],
          correctAnswer: 1,
          explanation: 'HEAD wskazuje commit i gałąź, na której aktualnie się znajdujesz.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Pushowanie kodu z pozostawionymi znacznikami konfliktu (<<<<<<<)',
          whyItHappens: 'Zatwierdzenie pliku bez dokładnego sprawdzenia zawartości.',
          howToFix: 'Przed commitem upewnij się, że usunąłeś wszystkie znaczniki konfliktu i kod kompiluje się bez błędów.',
          badCode: 'git commit -m "naprawiono" # W kodzie został <<<<<<< HEAD!',
          goodCode: '# Usuń znaczniki, przetestuj aplikację i dopiero zrób commit',
        },
      ],
      practicalTask: {
        title: 'Utworzenie gałęzi i Pull Requesta',
        brief: 'Utwórz gałąź w lokalnym repozytorium, dodaj plik i przećwicz przełączanie git switch main.',
        steps: ['Wpisz git switch -c feature/nowy-widok', 'Utwórz plik widok.html', 'Zrób commit i przełącz się z powrotem na main'],
        deliverable: 'Praktyczne zrozumienie izolacji pracy na gałęziach.',
      },
      completionCriteria: [
        'Zrozumienie gałęzi i mechanizmu Pull Request',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
  ],
};
