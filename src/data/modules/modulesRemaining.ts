import { Module } from '../../types';

export const MODULES_11_TO_15: Module[] = [
  {
    id: 11,
    title: 'Full Stack — Integracja Całego Ekosystemu',
    category: 'Frontend',
    description: 'Połączenie wszystkich klocków: frontend React komunikujący się z backendem Express i PostgreSQL, obsługa wgrywania plików, mailing i płatności Stripe w trybie testowym.',
    badgeName: 'Full Stack Integrator',
    badgeIcon: 'Layers',
    durationHours: 40,
    totalXp: 1300,
    prerequisites: ['Moduły 1-10'],
    topics: [
      'Architektura aplikacji monorepo vs odrębne repozytoria frontend/backend',
      'Wspólne typy TypeScript między frontendem a backendem',
      'Pobieranie i synchronizacja stanu serwerowego z TanStack Query (React Query)',
      'Upload plików: bezpieczne przesyłanie grafik do chmury (S3 / Cloud Storage)',
      'Wysyłka powiadomień e-mail za pomocą szablonów HTML i serwisów transakcyjnych',
      'Integracja płatności online w trybie testowym (Stripe Elements i Webhooki)',
    ],
    projectBrief: 'Projekt modułu: Pełna aplikacja platformy kursowej z płatnościami testowymi i certyfikatem.',
    lessons: [
      {
        id: 'fullstack-1',
        moduleId: 11,
        moduleTitle: 'Full Stack — Integracja Całego Ekosystemu',
        title: 'Architektura Full Stack: Monorepo, współdzielone typy i TanStack Query',
        slug: 'architektura-fullstack-monorepo-tanstack-query',
        durationMinutes: 45,
        xpReward: 90,
        order: 1,
        summary: 'Jak złożyć całą aplikację w spójny organizm: organizacja monorepo, współdzielenie definicji typów TypeScript między frontendem a backendem oraz eliminacja redundancji stanu z TanStack Query.',
        objectives: [
          'Zaprojektować strukturę katalogów ze współdzieloną biblioteką typów (packages/shared)',
          'Zarządzać stanem serwerowym (Server State) z automatycznym cachem i refetchingiem w TanStack Query',
          'Obsługiwać błędy sieciowe w całej aplikacji za pomocą Error Boundaries i toastów',
        ],
        prerequisites: ['Moduł 7: React', 'Moduł 8: Backend Express'],
        theoryMarkdown: `Aplikacja Full Stack to nie dwa odrębne światy, lecz harmonijnie współpracujący system.

**Współdzielenie typów (End-to-End Type Safety):**
Gdy zmienisz schemat użytkownika w bazie lub typ odpowiedzi API, chcesz, aby kompilator TypeScript natychmiast wskazał błędy w komponentach Reacta.
W strukturze Monorepo tworzymy folder \`shared/types\` importowany zarówno przez \`client\`, jak i \`server\`.

**TanStack Query (React Query):**
Zamiast ręcznego pisania \`useState\` i \`useEffect\` dla każdego zapytania, używamy dedykowanego menedżera pamięci podręcznej serwera:
\`\`\`tsx
import { useQuery } from '@tanstack/react-query';

export function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: () => fetch('/api/courses').then(res => res.json()),
    staleTime: 1000 * 60 * 5, // Cache ważny przez 5 minut!
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <CoursesList items={data} />;
}
\`\`\``,
        codeExamples: [
          {
            title: 'Współdzielony kontrakt odpowiedzi w architekturze Full Stack',
            language: 'typescript',
            code: `// shared/src/types.ts
export interface CourseDto {
  id: string;
  title: string;
  enrolledStudentsCount: number;
}

// Używane w Expressie: res.json(courses: CourseDto[])
// Oraz w React: const { data } = useQuery<CourseDto[]>({ ... })`,
            explanation: 'Gwarancja, że frontend i backend zawsze rozmawiają tym samym językiem bez błędów w nazwach pól.',
          },
        ],
        stepByStepGuide: [
          { step: 1, title: 'Wydziel wspólne typy DTO', description: 'Umieść je w folderze widocznym dla obu części aplikacji.' },
          { step: 2, title: 'Zainstaluj TanStack Query w React', description: 'npm install @tanstack/react-query.' },
          { step: 3, title: 'Opakuj aplikację w QueryClientProvider', description: 'Zapewnij globalny dostęp do cache.' },
        ],
        interactiveExercise: {
          id: 'ex-fs-1',
          title: 'Komponent integracji stanu Full Stack',
          instructions: 'Zaprojektuj wizualny widżet architektury Full Stack: stwórz kontener z klasą fullstack-card, informację <code>React + Express + PostgreSQL</code> oraz status połączenia "End-to-End Type Safety".',
          task: 'Utwórz element fullstack-card z technologiami i tekstem Type Safety.',
          starterCode: {
            html: '<!-- Zbuduj widżet Full Stack poniżej -->\n',
            css: '.fullstack-card { background: #0f172a; border: 1px solid #334155; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: white; display: inline-flex; align-items: center; gap: 12px; }\ncode { color: #818cf8; font-family: monospace; font-weight: bold; }',
            js: 'console.log("Full Stack visualizer aktywny.");',
          },
          solutionCode: {
            html: '<div class="fullstack-card">\n  <code>React + Express + PostgreSQL</code>\n  <span style="color: #38bdf8; font-size: 0.8rem;">End-to-End Type Safety</span>\n</div>',
            css: '.fullstack-card { background: #0f172a; border: 1px solid #334155; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: white; display: inline-flex; align-items: center; gap: 12px; }\ncode { color: #818cf8; font-family: monospace; font-weight: bold; }',
            js: 'console.log("Full Stack visualizer aktywny.");',
          },
          hints: [
            'Użyj <div class="fullstack-card">.',
            'Wstaw <code>React + Express + PostgreSQL</code>.',
            'Wstaw tekst End-to-End Type Safety.',
          ],
          rules: [
            { id: 'r1', description: 'Klasa fullstack-card obecna', ruleType: 'html_contains', target: 'fullstack-card' },
            { id: 'r2', description: 'Stack React + Express + PostgreSQL obecny', ruleType: 'html_contains', target: 'React + Express + PostgreSQL' },
            { id: 'r3', description: 'Tekst Type Safety obecny', ruleType: 'html_contains', target: 'Type Safety' },
          ],
        },
        independentTask: {
          title: 'Optymistyczne aktualizacje (Optimistic UI)',
          instructions: 'Zastosuj wzorzec Optimistic Update w TanStack Query, aby interfejs pokazywał polubienie posta natychmiast przed odpowiedzią serwera.',
          expectedOutcome: 'Błyskawiczne wrażenie działania aplikacji dla użytkownika.',
          starterHint: 'Skorzystaj z callbacku onMutate w hooku useMutation.',
        },
        quiz: [
          {
            id: 'q-fs1-1',
            question: 'Jaka jest główna zaleta współdzielenia typów TypeScript w architekturze Monorepo?',
            options: [
              'Wszelkie zmiany w strukturze danych API natychmiast wywołują błędy kompilacji w komponentach frontendu, zapobiegając usterkom na produkcji',
              'Zmniejsza zużycie pamięci RAM na serwerze',
              'Automatycznie generuje bazy danych',
              'Jest to jedyny sposób na uruchomienie Dockera',
            ],
            correctAnswer: 0,
            explanation: 'End-to-End Type Safety gwarantuje spójność kontraktu danych między klientem a serwerem.',
          },
        ],
        commonMistakes: [
          {
            mistake: 'Trzymanie stanu serwerowego w globalnym store Redux/Zustand zamiast w TanStack Query',
            whyItHappens: 'Próba zarządzania wszystkim w jednym magazynie stanu.',
            howToFix: 'Stan serwerowy (dane z bazy, cache, status ładowania) powinien być obsługiwany przez TanStack Query, a stan lokalny (otwarte modale, filtry) przez prosty stan komponentu lub Context.',
            badCode: '// Ręczne pisanie 50 akcji Redux dla każdego fetch...',
            goodCode: 'const { data } = useQuery({ queryKey: ["courses"], queryFn: fetchCourses });',
          },
        ],
        practicalTask: {
          title: 'Konfiguracja QueryClient w React',
          brief: 'Skonfiguruj QueryClient z domyślną polityką ponawiania zapytań retry: 1 i cacheTime: 10 minut.',
          steps: ['Utwórz const queryClient = new QueryClient()', 'Opakuj aplikację w QueryClientProvider', 'Przetestuj cache'],
          deliverable: 'Wzorcowa architektura stanu serwerowego w React.',
        },
        completionCriteria: [
          'Zrozumienie integracji Full Stack i TanStack Query',
          'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
          'Zaliczenie quizu z wynikiem minimum 80%',
        ],
      },
    ],
  },
  {
    id: 12,
    title: 'Testowanie i Jakość Kodu',
    category: 'DevOps & Bezpieczeństwo',
    description: 'Napisz kod, któremu możesz zaufać: testy jednostkowe z Vitest, testy komponentów z React Testing Library, testy End-to-End z Playwright i automatyczny linter.',
    badgeName: 'Mistrz Jakości i Testów',
    badgeIcon: 'CheckCircle2',
    durationHours: 25,
    totalXp: 750,
    prerequisites: ['Moduł 7: React', 'Moduł 8: Backend'],
    topics: [
      'Piramida testów: testy jednostkowe, integracyjne i End-to-End (E2E)',
      'Testowanie czystej logiki i funkcji biznesowych z Vitest / Jest',
      'Testowanie interfejsu z React Testing Library (sprawdzanie z punktu widzenia użytkownika)',
      'Automatyzacja przeglądarki i testy E2E z Playwright',
      'Statyczna analiza kodu: ESLint, Prettier i hooki Git (Husky)',
      'Pokrycie kodu testami (Code Coverage) i praktyki Test-Driven Development (TDD)',
    ],
    projectBrief: 'Projekt modułu: Kompletny zestaw testów automatycznych (Unit + Integration + E2E) dla krytycznego modułu zakupowego.',
    lessons: [
      {
        id: 'test-1',
        moduleId: 12,
        moduleTitle: 'Testowanie i Jakość Kodu',
        title: 'Piramida testów, Vitest i testy jednostkowe czystej logiki',
        slug: 'testowanie-vitest-unit-tests-jakosc',
        durationMinutes: 40,
        xpReward: 80,
        order: 1,
        summary: 'Dlaczego automatyczne testy są polisą ubezpieczeniową aplikacji? Poznaj piramidę testów, pisanie szybkich testów w Vitest/node:test oraz techniki asercji (assert.equal, expect).',
        objectives: [
          'Rozróżniać testy jednostkowe (Unit), integracyjne (Integration) i End-to-End (E2E)',
          'Pisać deterministyczne testy w Vitest za pomocą bloków test() i expect()',
          'Odseparowywać czystą logikę biznesową od interfejsu DOM dla ułatwienia testowania',
        ],
        prerequisites: ['Moduł 4: JavaScript', 'Moduł 6: TypeScript'],
        theoryMarkdown: `Aplikacja bez testów automatycznych to tykająca bomba — każda nowa funkcja może zepsuć dotychczas działający kod (tzw. **regresja**).

**Piramida testów:**
1. **Testy jednostkowe (Unit Tests):** Podstawa piramidy (70%). Testują pojedyncze, czyste funkcje biznesowe w ułamku milisekundy.
2. **Testy integracyjne (Integration Tests):** Środek piramidy (20%). Testują współpracę komponentów (np. zapytanie API z bazą danych lub formularz React).
3. **Testy End-to-End (E2E z Playwright):** Szczyt piramidy (10%). Uruchamiają prawdziwą przeglądarkę i klikają po aplikacji jak człowiek.

**Wzorcowy test z biblioteki Vitest / Node Test Runner:**
\`\`\`typescript
import { test, expect } from 'vitest';
import { calculateDiscount } from './pricing';

test('nalicza 20% rabatu dla kwoty powyżej 100 zł', () => {
  const result = calculateDiscount(200, 20);
  expect(result).toBe(160);
});

test('rzuca błąd przy ujemnej cenie', () => {
  expect(() => calculateDiscount(-50, 10)).toThrow('Cena nie może być ujemna');
});
\`\`\``,
        codeExamples: [
          {
            title: 'Testowanie kalkulacji punktów XP w akademii',
            language: 'typescript',
            code: `import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateLevel } from './gamification';

test('poprawnie przypisuje Poziom 2 po osiągnięciu 150 XP', () => {
  const info = calculateLevel(150);
  assert.equal(info.level, 2);
  assert.equal(info.title, 'Adept Podstaw & Terminala');
});`,
            explanation: 'Szybkie testy jednostkowe wykonują się w kilkadziesiąt milisekund w terminalu.',
          },
        ],
        stepByStepGuide: [
          { step: 1, title: 'Wydziel czystą funkcję', description: 'Unikaj mieszania logiki z manipulacją DOM.' },
          { step: 2, title: 'Utwórz plik testowy .test.ts', description: 'Umieść go obok testowanego modułu.' },
          { step: 3, title: 'Uruchom testy w terminalu', description: 'npm test lub npx tsx --test.' },
        ],
        interactiveExercise: {
          id: 'ex-tst-1',
          title: 'Komponent wizualizacji zielonego raportu testów',
          instructions: 'Zaprojektuj wizualny widżet wyniku testów automatycznych: stwórz kontener z klasą test-report, zielony symbol sukcesu, tekst "10 tests passed" oraz czas wykonania "in 240ms".',
          task: 'Utwórz element test-report z informacją 10 tests passed i in 240ms.',
          starterCode: {
            html: '<!-- Zbuduj raport testów poniżej -->\n',
            css: '.test-report { background: #022c22; border: 1px solid #059669; padding: 12px 18px; border-radius: 8px; font-family: monospace; font-size: 0.85rem; color: #6ee7b7; display: inline-flex; align-items: center; gap: 10px; }\n.time { color: #a7f3d0; opacity: 0.8; }',
            js: 'console.log("Test runner raport gotowy.");',
          },
          solutionCode: {
            html: '<div class="test-report">\n  <span>✓</span>\n  <span>10 tests passed</span>\n  <span class="time">in 240ms</span>\n</div>',
            css: '.test-report { background: #022c22; border: 1px solid #059669; padding: 12px 18px; border-radius: 8px; font-family: monospace; font-size: 0.85rem; color: #6ee7b7; display: inline-flex; align-items: center; gap: 10px; font-family: monospace; font-size: 0.85rem; color: #6ee7b7; display: inline-flex; align-items: center; gap: 10px; }\n.time { color: #a7f3d0; opacity: 0.8; }',
            js: 'console.log("Test runner raport gotowy.");',
          },
          hints: [
            'Użyj <div class="test-report">.',
            'Wstaw tekst 10 tests passed.',
            'Wstaw <span class="time">in 240ms</span>.',
          ],
          rules: [
            { id: 'r1', description: 'Klasa test-report obecna', ruleType: 'html_contains', target: 'test-report' },
            { id: 'r2', description: 'Informacja 10 tests passed obecna', ruleType: 'html_contains', target: '10 tests passed' },
            { id: 'r3', description: 'Czas wykonania in 240ms obecny', ruleType: 'html_contains', target: 'in 240ms' },
          ],
        },
        independentTask: {
          title: 'Testy TDD (Test-Driven Development)',
          instructions: 'Napisz najpierw test sprawdzający funkcję walidacji adresu e-mail, upewnij się że nie przechodzi (Red), a następnie napisz implementację (Green).',
          expectedOutcome: 'Lepszy, bardziej przemyślany kod dzięki projektowaniu przez testy.',
          starterHint: 'Zasada TDD: Red -> Green -> Refactor.',
        },
        quiz: [
          {
            id: 'q-tst1-1',
            question: 'Dlaczego testy jednostkowe (Unit Tests) stanowią największą część piramidy testów?',
            options: [
              'Są niezwykle szybkie (wykonują się w ułamkach sekund), tanie w utrzymaniu i precyzyjnie wskazują linię, w której wystąpił błąd',
              'Są jedynym typem testów akceptowanym przez przeglądarkę',
              'Zajmują najmniej miejsca na dysku',
              'Wymaga ich polskie prawo',
            ],
            correctAnswer: 0,
            explanation: 'Szybkość wykonania pozwala uruchamiać tysiące testów jednostkowych przy każdym zapisie pliku.',
          },
        ],
        commonMistakes: [
          {
            mistake: 'Testowanie szczegółów implementacyjnych zamiast zachowania biznesowego',
            whyItHappens: 'Próba sprawdzania wewnętrznych zmiennych zamiast wartości zwracanych.',
            howToFix: 'Traktuj moduł jak czarną skrzynkę: testuj wejście (parametry) oraz oczekiwane wyjście (rezultat).',
            badCode: '// Testowanie czy funkcja używa pętli while czy for...',
            goodCode: 'expect(calculate(2, 2)).toBe(4);',
          },
        ],
        practicalTask: {
          title: 'Uruchomienie testów w projekcie akademii',
          brief: 'Uruchom wbudowany zestaw testów gamification.test.ts za pomocą npx tsx --test.',
          steps: ['Wpisz w terminalu polecenie uruchomienia testów', 'Sprawdź raport TAP version 13', 'Zobacz zielony wynik'],
          deliverable: 'Praktyczne doświadczenie z test runnerem.',
        },
        completionCriteria: [
          'Zrozumienie piramidy testów i pisania asercji',
          'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
          'Zaliczenie quizu z wynikiem minimum 80%',
        ],
      },
    ],
  },
  {
    id: 13,
    title: 'Deployment i DevOps — Wdrażanie na Produkcję',
    category: 'DevOps & Bezpieczeństwo',
    description: 'Od localhost do milionów użytkowników: konteneryzacja Docker, potoki CI/CD w GitHub Actions, konfiguracja serwera VPS Linux, Nginx jako Reverse Proxy, domeny i darmowe SSL Let’s Encrypt.',
    badgeName: 'Inżynier DevOps & Cloud',
    badgeIcon: 'Cloud',
    durationHours: 35,
    totalXp: 1100,
    prerequisites: ['Wszystkie wcześniejsze moduły'],
    topics: [
      'Konteneryzacja z Docker: Dockerfile, obrazy wieloetapowe (multi-stage builds) i Docker Compose',
      'Automatyzacja CI/CD: pisanie workflow w GitHub Actions (testy, budowanie, automatyczny deploy)',
      'Zarządzanie serwerem VPS z Ubuntu Linux: bezpieczny dostęp SSH, klucze, firewall UFW',
      'Serwer WWW i Reverse Proxy Nginx: konfiguracja routingu, buforowania i certyfikatu SSL Certbot',
      'Zarządzanie procesami Node.js na produkcji (PM2 lub systemd) oraz polityka restartów',
      'Zmienne środowiskowe, zarządzanie sekretami produkcyjnymi i regularne kopie zapasowe bazy',
    ],
    projectBrief: 'Projekt modułu: Wdrożenie skonteneryzowanej aplikacji Full Stack na publiczny serwer z własną domeną i HTTPS.',
    lessons: [
      {
        id: 'devops-1',
        moduleId: 13,
        moduleTitle: 'Deployment i DevOps — Wdrażanie na Produkcję',
        title: 'Konteneryzacja z Docker i zautomatyzowane potoki CI/CD',
        slug: 'docker-konteneryzacja-cicd-github-actions',
        durationMinutes: 45,
        xpReward: 90,
        order: 1,
        summary: 'Koniec z wymówką "u mnie działa"! Zbuduj lekki, powtarzalny obraz Docker (multi-stage build) i skonfiguruj potok GitHub Actions, który automatycznie testuje i wdraża aplikację po każdym commicie.',
        objectives: [
          'Zrozumieć różnicę między maszyną wirtualną (VM) a lekkim kontenerem Docker',
          'Pisać optymalne pliki Dockerfile z wieloetapowym budowaniem (Multi-Stage Builds)',
          'Skonfigurować zautomatyzowany potok CI/CD w pliku .github/workflows/deploy.yml',
        ],
        prerequisites: ['Moduł 1: Terminal', 'Moduł 8: Backend'],
        theoryMarkdown: `**Docker** rozwiązuje odwieczny problem niezgodności środowisk: różnice w wersjach Node.js, bibliotekach systemowych czy systemie operacyjnym między komputerem programisty a serwerem chmurowym.

Kontener pakuje aplikację wraz z jej wszystkimi zależnościami w jeden przenośny **obraz (Image)**.

**Wieloetapowy Dockerfile (Multi-stage build):**
Zamiast wysyłać na serwer obraz ważący 1.5 GB z narzędziami kompilacji (TypeScript, webpack), rozdzielamy proces na dwa etapy:
1. **Builder:** Instaluje wszystkie narzędzia i kompiluje kod do katalogu \`dist/\`.
2. **Runner:** Kopiuje **tylko** skompilowany kod \`dist/\` i zależności produkcyjne do lekkiego obrazu Alpine Linux (waga: zaledwie 80 MB!).

**Automatyzacja CI/CD z GitHub Actions:**
Po wypchnięciu kodu na gałąź \`main\`, serwery GitHub automatycznie:
1. Odpalają testy jednostkowe.
2. Budują obraz Dockera.
3. Wdrażają nową wersję na serwer produkcyjny bez przestoju (Zero Downtime).`,
        codeExamples: [
          {
            title: 'Wzorcowy plik automatyzacji GitHub Actions (.github/workflows/ci.yml)',
            language: 'bash',
            code: `name: CI/CD Pipeline
on:
  push:
    branches: [main]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
      - run: npm run build`,
            explanation: 'Jeśli testy nie przejdą, proces zostaje przerwany, a wadliwy kod nie trafia na serwer.',
          },
        ],
        stepByStepGuide: [
          { step: 1, title: 'Utwórz plik Dockerfile w katalogu głównym', description: 'Zdefiniuj bazowy obraz FROM node:20-alpine.' },
          { step: 2, title: 'Zbuduj obraz lokalnie', description: 'docker build -t moja-aplikacja:latest .' },
          { step: 3, title: 'Uruchom kontener', description: 'docker run -p 3000:3000 moja-aplikacja:latest.' },
        ],
        interactiveExercise: {
          id: 'ex-devops-1',
          title: 'Komponent wizualizacji statusu wdrożenia CI/CD',
          instructions: 'Zaprojektuj wizualny widżet statusu wdrożenia produkcyjnego: stwórz kontener z klasą deploy-card, zieloną ikonę sukcesu, napis "Docker Container: Healthy" oraz odznakę potoku "CI/CD: Passed".',
          task: 'Utwórz element deploy-card z tekstem Docker Container: Healthy i CI/CD: Passed.',
          starterCode: {
            html: '<!-- Zbuduj widżet DevOps poniżej -->\n',
            css: '.deploy-card { background: #0f172a; border: 1px solid #1e293b; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: white; display: inline-flex; align-items: center; gap: 12px; }\n.badge-pass { background: #059669; color: white; font-family: monospace; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }',
            js: 'console.log("DevOps visualizer aktywny.");',
          },
          solutionCode: {
            html: '<div class="deploy-card">\n  <span style="color: #34d399;">● Docker Container: Healthy</span>\n  <span class="badge-pass">CI/CD: Passed</span>\n</div>',
            css: '.deploy-card { background: #0f172a; border: 1px solid #1e293b; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: white; display: inline-flex; align-items: center; gap: 12px; }\n.badge-pass { background: #059669; color: white; font-family: monospace; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }',
            js: 'console.log("DevOps visualizer aktywny.");',
          },
          hints: [
            'Użyj <div class="deploy-card">.',
            'Wstaw tekst Docker Container: Healthy.',
            'Dodaj <span class="badge-pass">CI/CD: Passed</span>.',
          ],
          rules: [
            { id: 'r1', description: 'Klasa deploy-card obecna', ruleType: 'html_contains', target: 'deploy-card' },
            { id: 'r2', description: 'Status Docker Container: Healthy obecny', ruleType: 'html_contains', target: 'Docker Container: Healthy' },
            { id: 'r3', description: 'Odznaka CI/CD: Passed obecna', ruleType: 'html_contains', target: 'CI/CD: Passed' },
          ],
        },
        independentTask: {
          title: 'Konfiguracja pliku docker-compose.yml',
          instructions: 'Napisz plik docker-compose uruchamiający dwa połączone kontenery: aplikację webową na porcie 3000 oraz bazę PostgreSQL na porcie 5432.',
          expectedOutcome: 'Uruchomienie całego środowiska jednym poleceniem docker-compose up.',
          starterHint: 'Zdefiniuj sekcje services: app oraz db z odpowiednimi zmiennymi środowiskowymi.',
        },
        quiz: [
          {
            id: 'q-dop1-1',
            question: 'Dlaczego w pliku Dockerfile stosuje się technikę Multi-Stage Build?',
            options: [
              'Pozwala oddzielić ciężki etap budowania (z kompilatorami TS i devDependencies) od lekkiego obrazu uruchomieniowego, redukując rozmiar obrazu produkcyjnego nawet o 90%',
              'Zwiększa prędkość procesora o 200%',
              'Wymaga jej system Windows',
              'Służy do generowania certyfikatu SSL',
            ],
            correctAnswer: 0,
            explanation: 'Multi-stage build dramatycznie zmniejsza wagę obrazu i usuwa potencjalne podatności bezpieczeństwa.',
          },
        ],
        commonMistakes: [
          {
            mistake: 'Kopiowanie node_modules/ do obrazu Dockera zamiast instalacji wewnątrz kontenera',
            whyItHappens: 'Brak pliku .dockerignore.',
            howToFix: 'Zawsze stwórz plik .dockerignore zawierający node_modules i .git, aby pakiety budowały się zgodnie z architekturą kontenera (Linux).',
            badCode: '# Brak .dockerignore -> kopiowanie gigabajtów z dysku...',
            goodCode: 'echo "node_modules\n.git" > .dockerignore',
          },
        ],
        practicalTask: {
          title: 'Przegląd instrukcji wdrożenia',
          brief: 'Przejdź do zakładki "Przewodnik Wdrożenia" w aplikacji i przeanalizuj konfigurację Nginx oraz darmowego certyfikatu SSL Certbot.',
          steps: ['Otwórz przewodnik wdrożenia', 'Zbadaj konfigurację Reverse Proxy Nginx', 'Zobacz komendę certbota'],
          deliverable: 'Kompletna wiedza o wdrażaniu na serwer VPS Linux.',
        },
        completionCriteria: [
          'Zrozumienie konteneryzacji Docker i automatyzacji CI/CD',
          'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
          'Zaliczenie quizu z wynikiem minimum 80%',
        ],
      },
    ],
  },
  {
    id: 14,
    title: 'Zaawansowany Full Stack — Next.js, WebSockets i Cache',
    category: 'Frontend',
    description: 'Wejdź na poziom zaawansowany: Server-Side Rendering (SSR) i Static Site Generation (SSG) w Next.js App Router, komunikacja dwukierunkowa WebSockets (Socket.io) oraz szybki cache w Redis.',
    badgeName: 'Zaawansowany Architekt Full Stack',
    badgeIcon: 'Cpu',
    durationHours: 40,
    totalXp: 1350,
    prerequisites: ['Moduł 7: React', 'Moduł 8: Backend'],
    topics: [
      'Architektura Next.js App Router: React Server Components (RSC) vs Client Components',
      'Strategie renderowania: SSR (Server-Side), SSG (Static Site), ISR (Incremental Static Regeneration)',
      'Komunikacja czasu rzeczywistego (Real-Time): protokół WebSocket i biblioteka Socket.io',
      'Baza w pamięci podręcznej Redis: caching zapytań, kolejki zadań (BullMQ) i pub/sub',
      'Optymalizacja wydajności: Code Splitting, dynamiczne importy i analiza bundle size',
      'Wprowadzenie do architektury mikrousług i skalowania horyzontalnego',
    ],
    projectBrief: 'Projekt modułu: Aplikacja czatu realtime z pokojami, wskaźnikiem pisania i buforowaniem wiadomości w Redis.',
    lessons: [],
  },
  {
    id: 15,
    title: 'Portfolio, Rozmowy Rekrutacyjne i Kariera',
    category: 'Kariera',
    description: 'Ostatnia prosta do pierwszej pracy jako Junior Full Stack Developer: przygotowanie bezbłędnego portfolio, techniczne CV, zadania rekrutacyjne (Live Coding), symulacje rozmów i negocjacje.',
    badgeName: 'Certyfikowany Junior Full Stack Developer',
    badgeIcon: 'Award',
    durationHours: 25,
    totalXp: 1000,
    prerequisites: ['Ukończenie projektów praktycznych'],
    topics: [
      'Jak stworzyć portfolio, które wyróżni Cię z tłumu 500 innych kandydatów',
      'Konstrukcja technicznego CV: prezentacja projektów, stack technologiczny i metryki',
      'Typowe zadania rekrutacyjne: live coding, algorytmy i refaktoryzacja zastanego kodu',
      'Techniczna rozmowa kwalifikacyjna: pytania z JS, React, HTTP, baz danych i architektury',
      'Kultura inżynierska w zespołach IT: praca w Scrum, estymacja zadań, komunikacja w zespole',
      'Gdzie szukać pracy, jak rozmawiać z rekruterami i jak negocjować warunki zatrudnienia',
    ],
    projectBrief: 'Projekt końcowy akademii: Prezentacja kompletnego, wdrożonego produkcyjnie portfolio ze zrealizowanymi projektami komercyjnymi.',
    lessons: [],
  },
];
