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
      theoryMarkdown: `**Git** to rozproszony system kontroli wersji (*Distributed Version Control System*), stworzony w 2005 roku przez Linusa Torvaldsa na potrzeby rozwoju jądra Linux. Zamiast tworzyć kopie folderów w stylu \`projekt_final_v2_naprawde_ostateczny\`, każdy programista ma na dysku pełną historię zmian w postaci acyklicznego grafu skierowanego (DAG).

**1. Trzy stany pliku i przepływ zmian w Git:**
1. **Working Directory (Katalog roboczy):** Bieżące pliki projektu na Twoim dysku, które edytujesz w VS Code. Nowo utworzony plik ma status \`untracked\` (nieśledzony), a zmodyfikowany istniejący plik ma status \`modified\`.
2. **Staging Area (Poczekalnia / Index):** Precyzyjna lista zmian wybranych do najbliższego zapisu. Dodajesz do niej pliki poleceniem \`git add plik.ts\` lub \`git add .\`. Dzięki poczekalni możesz zacommitować tylko poprawkę błędu w jednym pliku, zostawiając niedokończoną funkcję w drugim na później!
3. **Repository (Katalog \`.git\`):** Niezmienna, podpisana kryptograficznie migawka (*snapshot*) projektu zapisana komendą \`git commit -m "opis"\`. Każdy commit otrzymuje unikalny 40-znakowy skrót SHA-1 i wskazuje swojego poprzednika (rodzica).

**2. Konwencja Conventional Commits w pracy zespołowej:**
W komercyjnych zespołach nie piszemy niejasnych opisów w rodzaju \`"poprawki"\` czy \`"działa"\`. Standard **Conventional Commits** narzuca czytelny przedrostek pozwalający automatycznie generować listy zmian (*Changelog*):
- \`feat: add user authentication with JWT\` — nowa funkcjonalność dla użytkownika,
- \`fix: resolve memory leak in websocket listener\` — naprawa błędu,
- \`docs: update API endpoints in README\` — wyłącznie zmiany w dokumentacji,
- \`refactor: extract tax calculation utility\` — porządkowanie kodu bez zmiany działania,
- \`chore: upgrade dependencies in package.json\` — konfiguracja, skrypty, utrzymanie.

**3. Higiena repozytorium — plik \`.gitignore\`:**
Przed pierwszym \`git add .\` zawsze konfiguruj \`.gitignore\`, aby wykluczyć folder \`node_modules/\`, pliki zbudowane \`dist/\` oraz prywatne sekrety z \`.env\`.`,
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
      theoryMarkdown: `W komercyjnych projektach IT gałąź główna \`main\` reprezentuje stabilny kod gotowy do wdrożenia na produkcję — nikt nie commituje do niej bezpośrednio. Cały zespół pracuje równolegle w izolowanych strumieniach nazywanych **gałęziami (Branches)**.

**1. Czym naprawdę jest gałąź i jak działa Feature Branch Workflow?**
Wewnętrznie gałąź w Git to nie kopia całego katalogu, lecz lekki, 41-bajtowy wskaźnik przesuwający się na najnowszy commit. Tworzenie gałęzi zajmuje ułamek milisekundy:
1. Zaktualizuj lokalnego \`main\` (\`git pull origin main\`), aby startować z najnowszego kodu zespołu.
2. Utwórz izolowaną gałąź zadania: \`git switch -c feat/koszyk-zakupowy\`.
3. Pracuj i zapisuj małe, atomowe commity bez psucia głównej gałęzi kolegom.
4. Wyślij gałąź do chmury (\`git push -u origin feat/koszyk-zakupowy\`) i otwórz **Pull Request (PR)** na GitHubie.
5. Po przejściu automatycznych testów CI oraz pozytywnym **Code Review** scal gałąź do \`main\` i usuń starą gałąź roboczą.

**2. Rodzaje scaleń (Fast-Forward vs Merge Commit):**
Jeśli od momentu utworzenia Twojej gałęzi na \`main\` nie pojawiły się żadne nowe commity innych osób, Git przesunie wskaźnik prosto do przodu (*Fast-Forward*). Jeśli obie gałęzie rozwijały się niezależnie, Git wykona *Three-Way Merge* i utworzy specjalny commit scalający łączący obie historie.

**3. Co to jest konflikt scalania (Merge Conflict) i jak go bezpiecznie rozwiązać?**
Konflikt nie jest awarią Gita — to mechanizm ochronny, który uruchamia się wyłącznie wtedy, gdy dwie osoby zmieniły **te same linijki** w tym samym pliku (albo jedna osoba plik zmodyfikowała, a druga go usunęła). Zamiast zgadywać, Git zatrzymuje scalanie i wstawia znaczniki:
\`\`\`
<<<<<<< HEAD (Twoja wersja)
const apiURL = "https://api.v2.dev";
=======
const apiURL = "https://api.v3.dev";
>>>>>>> feature/new-api (Wersja kolegi)
\`\`\`
Twoim zadaniem jest przejrzenie obu wersji, ręczne wybranie docelowego kodu, usunięcie linii znaczników (\`<<<\`, \`===\`, \`>>>\`), przetestowanie aplikacji i wykonanie \`git add . && git commit\`.`,
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
    {
      id: 'git-3',
      moduleId: 5,
      moduleTitle: 'Git i GitHub — Kontrola Wersji i Zespołowa Praca',
      title: 'Cofanie zmian, ratowanie pracy i schowek: git restore, revert, reset i stash',
      slug: 'git-cofanie-zmian-restore-revert-stash',
      durationMinutes: 35,
      xpReward: 75,
      order: 3,
      summary: 'Zepsułeś kod lub zatwierdziłeś zły plik? Bez paniki! Poznaj bezpieczne narzędzia podróży w czasie w Git: wycofywanie niezapisanych zmian (git restore), odkładanie pracy do schowka (git stash) oraz różnicę między git revert a git reset.',
      objectives: [
        'Bezpiecznie odrzucać zmiany w katalogu roboczym poleceniem git restore <plik>',
        'Odkładać niedokończoną pracę na bok za pomocą schowka git stash i git stash pop',
        'Rozróżniać bezpieczny na wspólnej gałęzi git revert od przepisującego historię git reset',
      ],
      prerequisites: ['Lekcja 1 i 2 modułu Git'],
      theoryMarkdown: `Każdy programista popełnia błędy — różnica między początkującym a doświadczonym inżynierem polega na znajomości bezpiecznych sposobów wycofywania zmian w Git bez ryzyka skasowania wielogodzinnej pracy.

**1. \`git restore\` — cofanie zmian przed utworzeniem commita:**
- \`git restore src/App.tsx\` — odrzuca lokalne niezapisane modyfikacje w katalogu roboczym i przywraca plik do stanu z ostatniego commita (uwaga: tych zmian nie ma jeszcze w historii Gita, więc nie da się ich łatwo odzyskać!).
- \`git restore --staged .\` — wycofuje pliki z poczekalni (*Staging Area*) z powrotem do katalogu roboczego, zachowując całą napisaną treść w plikach (bezpieczne odwrócenie \`git add .\`).

**2. \`git stash\` — tymczasowy schowek na niedokończoną pracę:**
Piszesz rozbudowany formularz na swojej gałęzi, ale nagle dostajesz zgłoszenie pilnego błędu na produkcji i musisz natychmiast przełączyć się na \`main\`? Nie rób śmieciowego commita w połowie pracy!
- \`git stash push -m "WIP: formularz płatności"\` — pakuje niezacommitowane zmiany na tymczasowy stos i czyści katalog roboczy.
- \`git stash list\` — pokazuje listę wszystkich odłożonych pakietów.
- \`git stash pop\` — wyciąga ostatni pakiet ze schowka, przywraca go do kodu i usuwa ze stosu (lub \`git stash apply\`, jeśli chcesz zostawić kopię w schowku).

**3. \`git revert\` vs \`git reset\` — najważniejsza zasada bezpieczeństwa:**
- **\`git revert <hash>\`** tworzy **zupełnie nowy commit**, który dokładnie odwraca zmiany wprowadzone przez wskazany wcześniejszy commit. Ponieważ historia pozostaje nienaruszona i dopisywana do przodu, \`git revert\` jest **jedyną bezpieczną metodą cofania błędów na publicznej gałęzi \`main\`**, z której korzysta cały zespół.
- **\`git reset --soft HEAD~1\`** cofa wskaźnik gałęzi o jeden commit wstecz, ale zostawia wszystkie zmienione pliki w poczekalni — świetne do poprawienia ostatniego lokalnego commita przed \`git push\`. Natomiast **\`git reset --hard\`** bezpowrotnie kasuje niezacommitowane zmiany i przepisuje historię; stosuj je wyłącznie na prywatnych, niewypchniętych gałęziach. W razie pomyłki ostatnią deską ratunku jest \`git reflog\`.`,
      codeExamples: [
        {
          title: 'Ratowanie pracy schowkiem git stash i bezpieczny revert',
          language: 'bash',
          code: `# 1. Odłóż niedokończone zmiany na bok z opisem:
git stash push -m "WIP: niedokonczony formularz płatności"

# 2. Przełącz się na main, napraw błąd i wróć:
git switch main
# ... naprawa ...
git switch feature/payments

# 3. Przywróć swoją pracę ze schowka:
git stash pop

# 4. Wycofaj wadliwy commit na serwerze bez psucia historii:
git revert a4f92c1`,
          explanation: 'git stash pozwala błyskawicznie oczyścić katalog roboczy bez konieczności tworzenia pół-gotowych commitów.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Sprawdź stan przez git status', description: 'Git w podpowiedziach zawsze wskazuje dokładną komendę git restore.' },
        { step: 2, title: 'Użyj git stash przy nagłej zmianie kontekstu', description: 'Schowaj zmiany przed zmianą gałęzi git switch.' },
        { step: 3, title: 'Stosuj git revert dla wypchniętych commitów', description: 'Nigdy nie używaj git reset --hard na wspólnej gałęzi zespołu.' },
      ],
      interactiveExercise: {
        id: 'ex-git-3',
        title: 'Komponent wizualizacji schowka Git Stash i Revert',
        instructions: 'Zbuduj w HTML widżet historii ratunkowej Git: kontener z klasą stash-card, znacznik <code> z komendą "git stash pop" oraz opis "Przywrócono odłożone zmiany".',
        task: 'Utwórz kontener .stash-card z kodem git stash pop i opisem Przywrócono odłożone zmiany.',
        starterCode: {
          html: '<!-- Zbuduj kartę git stash poniżej -->\n',
          css: '.stash-card { background: #0f172a; border: 1px solid #334155; padding: 14px 18px; border-radius: 10px; color: #f8fafc; font-family: sans-serif; display: flex; align-items: center; gap: 12px; }\ncode { background: #1e293b; color: #38bdf8; padding: 4px 8px; border-radius: 6px; font-family: monospace; }',
          js: 'console.log("Git Stash & Revert gotowe.");',
        },
        solutionCode: {
          html: '<div class="stash-card">\n  <code>git stash pop</code>\n  <span>Przywrócono odłożone zmiany</span>\n</div>',
          css: '.stash-card { background: #0f172a; border: 1px solid #334155; padding: 14px 18px; border-radius: 10px; color: #f8fafc; font-family: sans-serif; display: flex; align-items: center; gap: 12px; }\ncode { background: #1e293b; color: #38bdf8; padding: 4px 8px; border-radius: 6px; font-family: monospace; }',
          js: 'console.log("Git Stash & Revert gotowe.");',
        },
        hints: [
          'Użyj <div class="stash-card">.',
          'Wstaw <code>git stash pop</code>.',
          'Dodaj tekst Przywrócono odłożone zmiany.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa stash-card obecna', ruleType: 'html_contains', target: 'stash-card' },
          { id: 'r2', description: 'Komenda git stash pop obecna', ruleType: 'html_contains', target: 'git stash pop' },
          { id: 'r3', description: 'Opis Przywrócono odłożone zmiany obecny', ruleType: 'html_contains', target: 'Przywrócono odłożone zmiany' },
        ],
      },
      independentTask: {
        title: 'Poprawianie literówki w ostatnim commicie (--amend)',
        instructions: 'Przećwicz polecenie git commit --amend -m "Nowy, poprawny opis commita", które pozwala poprawić komunikat ostatniego lokalnego zatwierdzenia.',
        expectedOutcome: 'Czysta historia commitów bez wpisów typu "poprawka literówki".',
        starterHint: 'Używaj --amend tylko dla commitów, których jeszcze nie wysłałeś przez git push.',
      },
      quiz: [
        {
          id: 'q-git3-1',
          question: 'Dlaczego do wycofania wadliwego commita, który został już wysłany na wspólną gałąź main na GitHubie, należy użyć `git revert` zamiast `git reset --hard`?',
          options: [
            'Ponieważ git revert tworzy nowy commit odwracający zmiany bez wymazywania historii, dzięki czemu nie psuje repozytoriów innych członków zespołu',
            'Ponieważ git reset działa tylko w niedziele',
            'Ponieważ GitHub blokuje polecenie git restore',
            'Nie ma żadnej różnicy między tymi poleceniami',
          ],
          correctAnswer: 0,
          explanation: 'Przepisanie historii na współdzielonej gałęzi powoduje poważne rozjazdy u współpracowników. git revert jest bezpieczny i zostawia ślad w historii.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Uruchamianie `git reset --hard` bez upewnienia się, co jest w katalogu roboczym',
          whyItHappens: 'Chęć szybkiego wyczyszczenia repozytorium.',
          howToFix: 'Flaga --hard bezpowrotnie kasuje wszystkie niezacommitowane zmiany w śledzonych plikach. Zamiast tego użyj git stash, który pozwala je odzyskać.',
          badCode: 'git reset --hard HEAD~1 # Bezpowrotna utrata niezapisanej pracy!',
          goodCode: 'git stash # Bezpieczne odłożenie zmian do schowka',
        },
      ],
      practicalTask: {
        title: 'Koło ratunkowe: git reflog',
        brief: 'Poznaj tajną broń Seniorów — polecenie git reflog, które pamięta każdy ruch wskaźnika HEAD przez 90 dni, pozwalając odzyskać nawet skasowaną gałąź.',
        steps: ['Wpisz git reflog w terminalu', 'Znajdź identyfikator SHA sprzed pomyłki', 'Odzyskaj stan przez git checkout <sha>'],
        deliverable: 'Świadomość, że w Git niemal nic nie ginie bezpowrotnie.',
      },
      completionCriteria: [
        'Zrozumienie działania git restore, git stash i git revert',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'git-4',
      moduleId: 5,
      moduleTitle: 'Git i GitHub — Kontrola Wersji i Zespołowa Praca',
      title: 'Zdalne repozytoria GitHub: SSH, git remote, git fetch vs git pull i Fork',
      slug: 'github-zdalne-repozytoria-ssh-fetch-pull',
      durationMinutes: 30,
      xpReward: 65,
      order: 4,
      summary: 'Połącz swoje lokalne repozytorium ze światem: skonfiguruj bezpieczne klucze kryptograficzne SSH (Ed25519), zarządzaj adresami zdalnymi (git remote), poznaj różnicę między git fetch a git pull oraz współpracuj w Open Source przez Fork.',
      objectives: [
        'Łączyć lokalne repozytorium z GitHubem za pomocą git remote add origin',
        'Rozróżniać bezpieczne sprawdzanie zmian (git fetch) od natychmiastowego scalania (git pull)',
        'Rozumieć model Fork & Pull Request wykorzystywany w projektach Open Source',
      ],
      prerequisites: ['Lekcje 1–3 modułu Git'],
      theoryMarkdown: `Git działa w pełni lokalnie na Twoim dysku (możesz tworzyć commity i gałęzie nawet w samolocie bez internetu). Aby jednak dzielić się kodem z zespołem, uruchamiać automatyczne wdrożenia CI/CD i budować portfolio dla rekruterów, łączymy lokalne repozytorium ze zdalnym serwerem (**Remote**), najczęściej na GitHubie lub GitLabie pod domyślnym aliasem \`origin\`.

**1. \`git fetch\` vs \`git pull\` — klasyczne pytanie rekrutacyjne:**
- **\`git fetch origin\`**: Łączy się z serwerem GitHub i pobiera aktualne informacje o nowych commitach, tagach oraz gałęziach kolegów do ukrytych gałęzi śledzących (\`origin/main\`), ale **nie dotyka ani jednej linijki w Twoich otwartych plikach**. To bezpieczny podgląd (*„zobaczmy, co zmieniło się w zespole”*), po którym możesz uruchomić \`git diff main origin/main\`.
- **\`git pull origin main\`**: Wykonuje pod spodem dwa kroki naraz — najpierw \`git fetch\`, a od razu po nim \`git merge\` (lub \`rebase\`), natychmiast scalając zdalne zmiany do Twojej bieżącej gałęzi roboczej.

**2. Bezpieczne połączenie kluczami SSH (Ed25519) zamiast haseł:**
GitHub od dawna nie akceptuje zwykłych haseł do konta podczas wypychania kodu przez HTTPS. Profesjonalnym i wygodnym standardem jest uwierzytelnianie asymetrycznymi kluczami SSH opartymi na nowoczesnym algorytmie **Ed25519**:
- **Klucz prywatny (\`~/.ssh/id_ed25519\`):** Tajny plik pozostający wyłącznie na Twoim dysku (może być dodatkowo chroniony hasłem *passphrase*).
- **Klucz publiczny (\`~/.ssh/id_ed25519.pub\`):** Bezpieczny klucz jawny, który wklejasz w ustawieniach profilu GitHub -> *SSH and GPG keys*.

**3. Model pracy Open Source — Fork, Upstream i Pull Request:**
Gdy chcesz naprawić błąd w popularnej bibliotece (np. React lub Vite), nie masz uprawnień do bezpośredniego \`git push\` do oryginalnego repozytorium. Tworzysz wtedy własną kopię na swoim koncie GitHub (**Fork**), klonujesz ją na dysk jako \`origin\`, a oryginalny projekt podpinasz jako drugi adres zdalny o konwencjonalnej nazwie \`upstream\`, skąd pobierasz bieżące aktualizacje zanim wyślesz swój Pull Request.`,
      codeExamples: [
        {
          title: 'Podpięcie nowego repozytorium do GitHub i generowanie klucza SSH',
          language: 'bash',
          code: `# 1. Wygeneruj nowoczesny klucz kryptograficzny Ed25519:
ssh-keygen -t ed25519 -C "twoj_email@example.com"

# 2. Podepnij zdalny serwer GitHub pod nazwą "origin":
git remote add origin git@github.com:username/fullstack-project.git

# 3. Sprawdź skonfigurowane adresy zdalne:
git remote -v

# 4. Wyślij gałąź main i ustaw śledzenie (upstream):
git push -u origin main`,
          explanation: 'Flaga -u (--set-upstream) wiąże Twoją lokalną gałąź ze zdalną, dzięki czemu później wystarczy pisać samo git push i git pull.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Utwórz puste repozytorium na GitHub', description: 'Nie zaznaczaj README, jeśli masz już lokalne repozytorium.' },
        { step: 2, title: 'Dodaj adres zdalny git remote add origin', description: 'Skopiuj adres SSH lub HTTPS z GitHuba.' },
        { step: 3, title: 'Wypchnij kod poleceniem git push -u origin main', description: 'Odśwież stronę GitHub i zobacz swoje pliki w chmurze.' },
      ],
      interactiveExercise: {
        id: 'ex-git-4',
        title: 'Komponent konfiguracji połączenia zdalnego Git Remote',
        instructions: 'Zbuduj w HTML widżet połączenia z GitHubem: kontener z klasą remote-box, znacznik <code> z komendą "origin git@github.com:dev/app.git" oraz status "SSH Verified".',
        task: 'Utwórz kontener .remote-box z adresem origin i statusem SSH Verified.',
        starterCode: {
          html: '<!-- Zbuduj widżet git remote poniżej -->\n',
          css: '.remote-box { background: #0f172a; border: 1px solid #1e293b; padding: 14px 18px; border-radius: 10px; color: #e2e8f0; font-family: sans-serif; display: flex; align-items: center; justify-content: space-between; }\ncode { color: #a5b4fc; font-family: monospace; }\n.ssh-ok { color: #4ade80; font-size: 0.8rem; font-weight: bold; }',
          js: 'console.log("Git Remote SSH gotowe.");',
        },
        solutionCode: {
          html: '<div class="remote-box">\n  <code>origin git@github.com:dev/app.git</code>\n  <span class="ssh-ok">SSH Verified</span>\n</div>',
          css: '.remote-box { background: #0f172a; border: 1px solid #1e293b; padding: 14px 18px; border-radius: 10px; color: #e2e8f0; font-family: sans-serif; display: flex; align-items: center; justify-content: space-between; }\ncode { color: #a5b4fc; font-family: monospace; }\n.ssh-ok { color: #4ade80; font-size: 0.8rem; font-weight: bold; }',
          js: 'console.log("Git Remote SSH gotowe.");',
        },
        hints: [
          'Użyj <div class="remote-box">.',
          'Wstaw <code>origin git@github.com:dev/app.git</code>.',
          'Wstaw <span class="ssh-ok">SSH Verified</span>.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa remote-box obecna', ruleType: 'html_contains', target: 'remote-box' },
          { id: 'r2', description: 'Adres origin obecny', ruleType: 'html_contains', target: 'origin' },
          { id: 'r3', description: 'Status SSH Verified obecny', ruleType: 'html_contains', target: 'SSH Verified' },
        ],
      },
      independentTask: {
        title: 'Wkład w projekt Open Source (Fork -> Clone -> PR)',
        instructions: 'Zrozum proces kontrybucji do cudzego projektu, do którego nie masz uprawnień zapisu: robisz Fork na swoje konto, klonujesz go, tworzysz gałąź i otwierasz Pull Request do oryginału (upstream).',
        expectedOutcome: 'Gotowość do udziału w społeczności Open Source na GitHub.',
        starterHint: 'Oryginalne repozytorium dodajemy zwykle jako drugi remote pod nazwą upstream.',
      },
      quiz: [
        {
          id: 'q-git4-1',
          question: 'Czym różni się polecenie `git fetch` od `git pull`?',
          options: [
            'git fetch tylko pobiera metadane i nowe commity z serwera bez zmieniania Twoich otwartych plików, natomiast git pull pobiera je i od razu scala (merge) z Twoją bieżącą gałęzią',
            'git fetch służy do wysyłania plików na serwer',
            'git pull kasuje zdalne repozytorium',
            'Nie ma żadnej różnicy',
          ],
          correctAnswer: 0,
          explanation: 'git pull = git fetch + git merge.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Udostępnianie prywatnego klucza SSH (`id_ed25519` bez końcówki `.pub`) osobom trzecim',
          whyItHappens: 'Pomylenie pliku klucza prywatnego z publicznym.',
          howToFix: 'Na GitHub lub serwer VPS kopiujemy WYŁĄCZNIE zawartość pliku z rozszerzeniem .pub (public). Klucz prywatny musi pozostać tajny.',
          badCode: 'cat ~/.ssh/id_ed25519 # NIGDY nie kopiuj klucza prywatnego!',
          goodCode: 'cat ~/.ssh/id_ed25519.pub # Kopiujemy wyłącznie klucz publiczny',
        },
      ],
      practicalTask: {
        title: 'Inspekcja adresów zdalnych',
        brief: 'Uruchom w terminalu git remote -v i sprawdź skonfigurowane adresy fetch oraz push.',
        steps: ['Otwórz terminal w projekcie', 'Wpisz git remote -v', 'Sprawdź gałęzie zdalne przez git branch -a'],
        deliverable: 'Swobodne zarządzanie połączeniami z GitHubem.',
      },
      completionCriteria: [
        'Zrozumienie różnicy między fetch a pull oraz kluczy SSH',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu min. 80%',
      ],
    },
    {
      id: 'git-5',
      moduleId: 5,
      moduleTitle: 'Git i GitHub — Kontrola Wersji i Zespołowa Praca',
      title: 'Kultura Code Review, git blame oraz git merge vs git rebase',
      slug: 'git-code-review-merge-vs-rebase-blame',
      durationMinutes: 35,
      xpReward: 75,
      order: 5,
      summary: 'Jak pracują najlepsze zespoły inżynierskie? Poznaj etykietę profesjonalnego Code Review, utrzymywanie liniowej historii projektu za pomocą git rebase oraz śledzenie zmian z git blame.',
      objectives: [
        'Przygotowywać wzorcowy Pull Request i prowadzić konstruktywne Code Review',
        'Rozróżniać scalanie z commitem łączącym (git merge) od liniowego przewijania bazy (git rebase)',
        'Badać historię powstania konkretnej linijki kodu za pomocą git blame i git log -p',
      ],
      prerequisites: ['Lekcje 1–4 modułu Git'],
      theoryMarkdown: `W profesjonalnych zespołach programistycznych żaden kod nie trafia na produkcję bez przejścia przez **Code Review** (przegląd kodu) w Pull Requeście. To nie jest egzamin z ocenami, lecz najważniejszy mechanizm dzielenia się wiedzą architektoniczną, wyłapywania luk bezpieczeństwa oraz utrzymywania spójnego stylu w całym projekcie.

**1. Jak przygotować Pull Request, który zespół sprawdzi od ręki?**
- **Zasada małych kroków:** PR zmieniający 150–250 linii w kilku powiązanych plikach dostanie rzetelne review w kwadrans. PR na 3000 linii w 70 plikach paraliżuje zespół i ukrywa błędy w tłumie zmian (*„LGTM” po przejrzeniu pierwszych 3 plików*).
- **Kontekst biznesowy i techniczny:** W opisie PR wskaż krótko *dlaczego* zmiana powstała, *co* zmieniono, jak ją przetestować lokalnie oraz dołącz zrzut ekranu przy zmianach w UI.
- **Self-Review przed zaproszeniem recenzentów:** Zawsze sam przejrzyj zakładkę *Files changed* na GitHubie zaraz po utworzeniu PR — błyskawicznie wyłapiesz zapomniane \`console.log\`, zakomentowany kod lub niepotrzebne zmiany w plikach konfiguracyjnych.

**2. Kultura konstruktywnych komentarzy podczas recenzji:**
Komentuj zawsze **kod i jego konsekwencje**, nigdy osobę autora. Zamiast oschłego *„To jest źle napisane”*, napisz konkretnie: *„W tym miejscu pętla wewnątrz pętli daje złożoność O(n²); przy 5000 rekordów może zablokować UI — rozważmy indeksowanie przez new Map()”*. Rozróżniaj blokery bezpieczeństwa od drobnych sugestii stylistycznych (np. prefiks \`nit:\`).

**3. Strategie historii: \`git merge\` vs \`git rebase\` vs *Squash & Merge*:**
- **\`git merge\`:** Zachowuje wierną, rozgałęzioną historię równoległych prac i dopisuje *Merge Commit* — bezpieczne i nigdy nie zmienia starych identyfikatorów SHA.
- **\`git rebase origin/main\`:** Odłącza Twoje lokalne commity i nakłada je na świeży czubek gałęzi \`main\`, utrzymując idealnie prostą, liniową historię (nigdy nie rób jednak \`rebase\` na wspólnej gałęzi, na której pracują inni!).
- **Squash and Merge:** Łączy wszystkie drobne commity robocze z PR-a w jeden czysty commit na gałęzi \`main\`.

**4. Śledzenie kontekstu za pomocą \`git blame\` i \`git log -S\`:**
Polecenie \`git blame plik.ts\` nie służy do szukania winnego, lecz do szybkiego sprawdzenia, w którym commicie i Pull Requeście powstała nietypowa linijka kodu — zanim usuniesz pozornie zbędny warunek \`if\`, przeczytaj dlaczego tam trafił.`,
      codeExamples: [
        {
          title: 'Aktualizacja gałęzi roboczej za pomocą rebase i inspekcja historii',
          language: 'bash',
          code: `# Pobierz najnowszy stan z serwera i przewiń swoją gałąź na szczyt main:
git fetch origin
git rebase origin/main

# Sprawdź kto i w jakim commicie zmienił linijki 10-25 w pliku:
git blame -L 10,25 src/App.tsx

# Wyświetl graficzne drzewo wszystkich gałęzi w terminalu:
git log --oneline --graph --all -n 10`,
          explanation: 'git blame nie służy do szukania "winnego", lecz do odnalezienia commita i Pull Requesta wyjaśniającego kontekst biznesowy danej zmiany.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Przejrzyj własny diff przed otwarciem PR', description: 'Uruchom git diff, aby upewnić się, że nie zostawiłeś śmieciowego kodu.' },
        { step: 2, title: 'Komentuj kod, a nie człowieka podczas Code Review', description: 'Zamiast "Napisałeś to źle", napisz "Rozważmy użycie Map() dla złożoności O(1)".' },
        { step: 3, title: 'Stosuj Squash and Merge przy zamykaniu PR', description: 'Zachowasz nieskazitelnie czystą historię na gałęzi main.' },
      ],
      interactiveExercise: {
        id: 'ex-git-5',
        title: 'Komponent zatwierdzenia Code Review w Pull Requeście',
        instructions: 'Zbuduj w HTML widżet akceptacji Pull Requesta: kontener z klasą pr-approved, nagłówek <h4> z tekstem "Pull Request #42", oraz zieloną odznakę "Approved by Senior Dev".',
        task: 'Utwórz kontener .pr-approved z nagłówkiem Pull Request #42 i tekstem Approved by Senior Dev.',
        starterCode: {
          html: '<!-- Zbuduj kartę zatwierdzonego PR poniżej -->\n',
          css: '.pr-approved { background: #022c22; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; color: #ecfdf5; font-family: sans-serif; display: flex; align-items: center; justify-content: space-between; }\nh4 { margin: 0; font-size: 0.95rem; }\n.ok { background: #059669; padding: 4px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: bold; }',
          js: 'console.log("Code Review widget gotowy.");',
        },
        solutionCode: {
          html: '<div class="pr-approved">\n  <h4>Pull Request #42</h4>\n  <span class="ok">Approved by Senior Dev</span>\n</div>',
          css: '.pr-approved { background: #022c22; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; color: #ecfdf5; font-family: sans-serif; display: flex; align-items: center; justify-content: space-between; }\nh4 { margin: 0; font-size: 0.95rem; }\n.ok { background: #059669; padding: 4px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: bold; }',
          js: 'console.log("Code Review widget gotowy.");',
        },
        hints: [
          'Użyj <div class="pr-approved">.',
          'Wstaw <h4>Pull Request #42</h4>.',
          'Dodaj <span class="ok">Approved by Senior Dev</span>.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa pr-approved obecna', ruleType: 'html_contains', target: 'pr-approved' },
          { id: 'r2', description: 'Tytuł Pull Request #42 obecny', ruleType: 'html_contains', target: 'Pull Request #42' },
          { id: 'r3', description: 'Status Approved by Senior Dev obecny', ruleType: 'html_contains', target: 'Approved by Senior Dev' },
        ],
      },
      independentTask: {
        title: 'Szablon Pull Requesta (.github/pull_request_template.md)',
        instructions: 'Stwórz plik szablonu PR z listą kontrolną (Checklist): [ ] Testy przechodzą, [ ] Brak console.log, [ ] Sprawdzono RWD na urządzeniach mobilnych.',
        expectedOutcome: 'Automatyczna lista kontrolna pojawiająca się przy każdym nowym PR w projekcie.',
        starterHint: 'GitHub automatycznie wczytuje plik .github/pull_request_template.md.',
      },
      quiz: [
        {
          id: 'q-git5-1',
          question: 'Do czego w codziennej pracy inżynierskiej służy polecenie `git blame` (lub adnotacja GitLens w VS Code)?',
          options: [
            'Do sprawdzenia, w którym commicie, kiedy i dlaczego została zmodyfikowana dana linijka kodu, aby zrozumieć jej pierwotny kontekst biznesowy',
            'Do automatycznego blokowania konta programisty, który popełnił błąd',
            'Do kasowania historii repozytorium',
            'Do kompilacji plików CSS',
          ],
          correctAnswer: 0,
          explanation: 'git blame pozwala szybko dotrzeć do opisu commita i Pull Requesta, wyjaśniając dlaczego nietypowy warunek znalazł się w kodzie.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Otwieranie gigantycznego Pull Requesta zawierającego 5 różnych funkcji i refaktoryzację 60 plików naraz',
          whyItHappens: 'Praca przez dwa tygodnie na jednej gałęzi bez dzielenia zadań na mniejsze części.',
          howToFix: 'Zasada "1 zadanie = 1 mały, skupiony Pull Request". Małe PR-y są sprawdzane szybko i dokładnie.',
          badCode: 'PR: "Dodano koszyk, zmieniono kolory, przepisano bazę i naprawiono 14 błędów" (+4200 linii)',
          goodCode: 'PR #1: "feat(cart): add quantity selector component" (+120 linii)',
        },
      ],
      practicalTask: {
        title: 'Wizualizacja drzewa Git w terminalu',
        brief: 'Skonfiguruj własny alias git lg wyświetlający kolorowy graf historii commitów.',
        steps: ['Uruchom git log --oneline --graph --decorate --all', 'Przeanalizuj rozgałęzienia i scalenia'],
        deliverable: 'Pełna orientacja w topologii repozytorium.',
      },
      completionCriteria: [
        'Zrozumienie kultury Code Review oraz różnic merge vs rebase',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu min. 80%',
      ],
    },
  ],
};
