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
    lessons: [
      {
        id: 'next-1',
        moduleId: 14,
        moduleTitle: 'Zaawansowany Full Stack — Next.js, WebSockets i Cache',
        title: 'Next.js App Router: React Server Components, SSR i Server Actions',
        slug: 'nextjs-app-router-server-components-actions',
        durationMinutes: 50,
        xpReward: 100,
        order: 1,
        summary: 'Poznaj światowy standard frameworków Full Stack: Next.js App Router. Dowiedz się, dlaczego React Server Components (RSC) nie wysyłają kodu JavaScript do przeglądarki, jak działa Server-Side Rendering oraz jak Server Actions zastępują tradycyjne endpointy API.',
        objectives: [
          'Rozumieć architekturę React Server Components (RSC) i granicę "use client"',
          'Wdrażać strategie renderowania: Static Site (SSG), Dynamic SSR oraz Streaming z Suspense',
          'Wykonywać bezpośrednie mutacje bazy danych za pomocą funkcji Server Actions',
        ],
        prerequisites: ['Moduł 7: React', 'Moduł 8: Backend', 'Moduł 9: Bazy Danych'],
        theoryMarkdown: `**Next.js** to wiodący produkcyjny framework Reacta rozwijany przez firmę Vercel. Wraz z wprowadzeniem katalogu \`app/\` (App Router) zrewolucjonizował architekturę aplikacji internetowych.

**1. React Server Components (RSC) vs Client Components:**
- **Server Components (Domyślne):** Renderują się wyłącznie na serwerze i zwracają czysty strumień HTML. Ich kod (np. biblioteki \`prisma\`, ciężkie formatowania dat) **nigdy nie trafia do przeglądarki klienta**, dzięki czemu pakiet JS ma rozmiar 0 KB!
- **Client Components (\`'use client'\`):** Wymagane tylko wtedy, gdy komponent potrzebuje interaktywności w przeglądarce (\`useState\`, \`useEffect\`, nasłuchiwacze zdarzeń \`onClick\`, API przeglądarki \`window\`).

**2. Pobieranie danych bezpośrednio w komponencie serwerowym:**
\`\`\`tsx
// app/dashboard/page.tsx - Server Component
import { prisma } from '@/lib/db';

export default async function DashboardPage() {
  // Bezpośrednie zapytanie asynchroniczne bez useState i useEffect!
  const stats = await prisma.user.aggregate({ _sum: { xp: true } });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Łączne XP: {stats._sum.xp}</h1>
    </main>
  );
}
\`\`\`

**3. Server Actions (Mutacje danych bez API endpointu):**
\`\`\`tsx
// Akcja wykonywana bezpośrednio po stronie Node.js na serwerze:
async function addLessonAction(formData: FormData) {
  'use server';
  const title = formData.get('title') as string;
  await prisma.lesson.create({ data: { title } });
  revalidatePath('/lessons'); // Błyskawiczne odświeżenie cache!
}

export function NewLessonForm() {
  return (
    <form action={addLessonAction}>
      <input name="title" required />
      <button type="submit">Zapisz lekcję</button>
    </form>
  );
}
\`\`\``,
        codeExamples: [
          {
            title: 'Granica między Server i Client Component w Next.js',
            language: 'tsx',
            code: `// LikeButton.tsx - Komponent interaktywny
'use client';
import { useState } from 'react';

export function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  return (
    <button onClick={() => setLikes(l => l + 1)} className="btn">
      ❤️ {likes} polubień
    </button>
  );
}`,
            explanation: 'Zasada dobrej architektury w Next.js: przesuwaj dyrektywę "use client" na same końce drzewa komponentów (liście), zachowując całą resztę jako Server Components.',
          },
        ],
        stepByStepGuide: [
          { step: 1, title: 'Utwórz strukturę tras w app/', description: 'Foldery tworzą segmenty URL (np. app/courses/[id]/page.tsx).' },
          { step: 2, title: 'Wydziel komponenty interaktywne', description: 'Oznaczaj tylko przyciski i formularze dyrektywą "use client".' },
          { step: 3, title: 'Użyj Server Actions', description: 'Mutuj dane bezpośrednio z "use server" z automatyczną rewalidacją.' },
        ],
        interactiveExercise: {
          id: 'ex-nxt-1',
          title: 'Komponent wizualizacji statusu Next.js SSR',
          instructions: 'Zaprojektuj wizualny widżet architektury Next.js: utwórz kontener z klasą next-status, wskaźnik Server Component "RSC: Zero JS Bundle", oraz czas renderu "SSR Render: 12ms".',
          task: 'Utwórz element next-status z tekstami RSC: Zero JS Bundle i SSR Render: 12ms.',
          starterCode: {
            html: '<!-- Zbuduj widok wskaźnika Next.js poniżej -->\n',
            css: '.next-status { background: #000; border: 1px solid #262626; padding: 14px 18px; border-radius: 10px; font-family: monospace; color: #ededed; display: flex; flex-direction: column; gap: 6px; }\n.rsc-tag { color: #38bdf8; font-weight: bold; }',
            js: 'console.log("Next.js App Router gotowy.");',
          },
          solutionCode: {
            html: '<div class="next-status">\n  <div>RSC: Zero JS Bundle</div>\n  <div>SSR Render: 12ms</div>\n</div>',
            css: '.next-status { background: #000; border: 1px solid #262626; padding: 14px 18px; border-radius: 10px; font-family: monospace; color: #ededed; display: flex; flex-direction: column; gap: 6px; }\n.rsc-tag { color: #38bdf8; font-weight: bold; }',
            js: 'console.log("Next.js App Router gotowy.");',
          },
          hints: [
            'Użyj kontenera <div class="next-status">.',
            'Wstaw <div>RSC: Zero JS Bundle</div>.',
            'Wstaw <div>SSR Render: 12ms</div>.',
          ],
          rules: [
            { id: 'r1', description: 'Klasa next-status obecna', ruleType: 'html_contains', target: 'next-status' },
            { id: 'r2', description: 'Tekst RSC: Zero JS Bundle obecny', ruleType: 'html_contains', target: 'RSC: Zero JS Bundle' },
            { id: 'r3', description: 'Tekst SSR Render: 12ms obecny', ruleType: 'html_contains', target: 'SSR Render: 12ms' },
          ],
        },
        independentTask: {
          title: 'Migracja z Client-Side Fetching do RSC',
          instructions: 'Zastąp schemat useEffect + useState bezpośrednim asynchronicznym wywołaniem fetch w Server Component.',
          expectedOutcome: 'Drastyczne skrócenie czasu Time to Interactive (TTI) oraz eliminacja migania ekranu (layout shift).',
          starterHint: 'async function Page() { const res = await fetch("..."); return ... }',
        },
        quiz: [
        {
          id: 'q-nxt1-1',
          question: 'Dlaczego React Server Components (RSC) w Next.js są tak rewolucyjną zmianą dla wydajności aplikacji?',
          options: [
            'Ponieważ ich kod źródłowy i biblioteki pomocnicze wykonują się wyłącznie na serwerze i nie są dołączane do paczki JavaScript pobieranej przez przeglądarkę',
            'Ponieważ wyłączają konieczność używania CSS',
            'Zastępują protokół TCP/IP protokołem Bluetooth',
            'Wymagają instalacji specjalnego programu na komputerze użytkownika',
          ],
          correctAnswer: 0,
          explanation: 'Brak kodu Server Components w bundle klienta oznacza znacznie lżejszą stronę, szybsze ładowanie na urządzeniach mobilnych i wyższe pozycje w Google SEO.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Dodawanie "use client" na samej górze pliku układu (layout.tsx) lub strony głównej',
          whyItHappens: 'Próba szybkiego naprawienia błędu z użyciem useState.',
          howToFix: 'Umieszczenie "use client" w pliku bazowym zamienia całe poddrzewo w Client Components, tracąc wszystkie zalety RSC. Wydzielaj do Client Components tylko drobne interaktywne widżety.',
          badCode: '// app/layout.tsx\n"use client"; // Błąd: cała aplikacja traci zalety RSC!',
          goodCode: '// Zostaw layout jako RSC, a do navbaru z dropdownem dodaj "use client"',
        },
      ],
      practicalTask: {
        title: 'Analiza architektury Next.js',
        instructions: 'Zbadaj strukturę App Router i porównaj czas ładowania strony renderowanej na serwerze z tradycyjnym SPA.',
        brief: 'Przeanalizuj strumieniowanie danych z React Suspense.',
        steps: ['Porównaj HTML zwrócony przez curl z React SPA', 'Zobacz natychmiastową dostępność treści bez JS', 'Oceń wpływ na SEO'],
        deliverable: 'Głębokie zrozumienie nowoczesnego renderowania hybrydowego.',
      },
      completionCriteria: [
        'Zrozumienie React Server Components i Server Actions w Next.js',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
  ],
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
    lessons: [
      {
        id: 'career-1',
        moduleId: 15,
        moduleTitle: 'Portfolio, Rozmowy Rekrutacyjne i Kariera',
        title: 'Zwycięskie Portfolio Full Stack, techniczne CV i Live Coding',
        slug: 'portfolio-cv-live-coding-rekrutacja-it',
        durationMinutes: 45,
        xpReward: 90,
        order: 1,
        summary: 'Przekuj wiedzę techniczną w pierwszą ofertę pracy jako Junior Full Stack Developer! Dowiedz się, co naprawdę sprawdzają rekruterzy i Team Leaderzy w portfolio, jak opisać projekty językiem korzyści oraz jak bez stresu przejść zadania Live Coding.',
        objectives: [
          'Zbudować profesjonalne portfolio z działającymi wdrożeniami na Vercel/VPS oraz czytelnymi README na GitHub',
          'Sformatować techniczne CV zgodne z systemami ATS z wyeksponowanym stosem TypeScript/React/Node',
          'Stosować metodologię myślenia na głos (Think Out Loud) podczas technicznych zadań rekrutacyjnych',
        ],
        prerequisites: ['Ukończenie modułów frontendowych i backendowych'],
        theoryMarkdown: `Na rynku pracy IT rywalizuje wielu początkujących programistów. To, co wyróżnia wybranego kandydata spośród 200 innych aplikacji, to **jakość projektów w portfolio** i **dojrzałość inżynierska**.

**1. Trzy filary skutecznego Portfolio:**
- **Nie rób kolejnego klona TodoListy:** Zbuduj 2-3 rozbudowane, unikalne projekty Full Stack (np. platforma e-commerce z autoryzacją, koszykiem i płatnościami testowymi; aplikacja monitoringu serwerów z WebSockets; system rezerwacji z kalendarzem).
- **Działający link produkcyjny:** Rekruter nie pobiera kodu na swój komputer, aby go uruchomić. Każdy projekt musi posiadać działający link demonstracyjny (Vercel, Render, VPS) oraz link do repozytorium na GitHub.
- **Wzorcowe README.md:** Każde repozytorium musi zawierać zrzut ekranu lub GIF z działania, listę technologii, instrukcję uruchomienia (\`npm install && npm run dev\`) oraz opis wyzwań architektonicznych, które rozwiązałeś.

**2. Anatomia technicznego CV:**
- **Jedna strona:** Zwięzłe, bez lania wody.
- **Sekcja Umiejętności (Tech Stack):** Podzielona na Frontend (TypeScript, React, Tailwind), Backend (Node.js, Express, REST API), Bazy Danych (PostgreSQL, Prisma), Narzędzia (Git, Docker, Vitest).
- **Opis projektów:** Format STAR (Situation, Task, Action, Result) z metrykami: *"Zoptymalizowałem czas ładowania zapytań o 40% dzięki indeksacji w PostgreSQL"*.

**3. Zasady podczas Live Codingu:**
1. Zanim napiszesz linijkę kodu, sparafrazuj zadanie własnymi słowami i zadaj pytania doprecyzowujące (np. *"Czy dane wejściowe mogą być puste?", "Jaki jest limit rozmiaru tablicy?"*).
2. **Myśl na głos:** Rekruter bada Twój proces myślowy i umiejętność komunikacji, a nie tylko suchą składnię.
3. Napisz najpierw rozwiązanie działające (brute-force), a następnie zaproponuj optymalizację złożoności obliczeniowej (Big-O).`,
        codeExamples: [
          {
            title: 'Wzorcowy plik README.md dla projektu w portfolio',
            language: 'markdown',
            code: `# 🚀 Full Stack SaaS Platform

A fully-featured SaaS dashboard built with **React**, **TypeScript**, **Express**, and **PostgreSQL**.

## 🌟 Key Features
- **Authentication:** Secure JWT authentication with HttpOnly cookies and role-based access (RBAC).
- **Real-Time Data:** Live telemetry dashboard with WebSocket updates.
- **Anti-Bot Security:** Intelligent honeypot trap and heuristic timing verification.
- **Database:** PostgreSQL modeled with Prisma ORM and automated migrations.

## 🛠️ Tech Stack
- Frontend: React 18, TypeScript, Tailwind CSS, Vite
- Backend: Node.js, Express, Prisma ORM
- Database: PostgreSQL
- Testing: Vitest, Playwright

## ⚡ Getting Started
\`\`\`bash
git clone https://github.com/username/project.git
npm install
npm run dev
\`\`\``,
            explanation: 'Tak przygotowane repozytorium natychmiast buduje zaufanie u osoby prowadzącej rekrutację techniczną.',
          },
        ],
        stepByStepGuide: [
          { step: 1, title: 'Wybierz 2 najlepsze projekty', description: 'Skup się na jakości i głębi, nie na ilości miniaturek.' },
          { step: 2, title: 'Opublikuj na GitHubie z README', description: 'Upewnij się, że kod jest czysty, sformatowany i przetestowany.' },
          { step: 3, title: 'Przygotuj profil na LinkedIn', description: 'Napisz post podsumowujący zbudowany projekt z krótkim wideo demo.' },
        ],
        interactiveExercise: {
          id: 'ex-car-1',
          title: 'Komponent wizualizacji profilu kandydata IT (Junior Profile Card)',
          instructions: 'Zaprojektuj wizytówkę portfolio kandydata: utwórz kontener z klasą candidate-card, stanowisko "Junior Full Stack Developer", oraz kluczowy stack "Stack: TypeScript, React, Node, PostgreSQL".',
          task: 'Utwórz element candidate-card z informacją o stanowisku i stosie technologicznym.',
          starterCode: {
            html: '<!-- Zbuduj wizytówkę kandydata poniżej -->\n',
            css: '.candidate-card { background: #0f172a; border: 1px solid #38bdf8; padding: 18px; border-radius: 12px; font-family: sans-serif; color: #f8fafc; max-width: 420px; }\n.role-title { font-size: 1.1rem; font-weight: bold; color: #38bdf8; margin-bottom: 6px; }\n.stack-info { font-size: 0.85rem; color: #94a3b8; }',
            js: 'console.log("Candidate Profile Card załadowana.");',
          },
          solutionCode: {
            html: '<div class="candidate-card">\n  <div class="role-title">Junior Full Stack Developer</div>\n  <div class="stack-info">Stack: TypeScript, React, Node, PostgreSQL</div>\n</div>',
            css: '.candidate-card { background: #0f172a; border: 1px solid #38bdf8; padding: 18px; border-radius: 12px; font-family: sans-serif; color: #f8fafc; max-width: 420px; }\n.role-title { font-size: 1.1rem; font-weight: bold; color: #38bdf8; margin-bottom: 6px; }\n.stack-info { font-size: 0.85rem; color: #94a3b8; }',
            js: 'console.log("Candidate Profile Card załadowana.");',
          },
          hints: [
            'Użyj kontenera <div class="candidate-card">.',
            'Wstaw tekst Junior Full Stack Developer.',
            'Wstaw tekst Stack: TypeScript, React, Node, PostgreSQL.',
          ],
          rules: [
            { id: 'r1', description: 'Klasa candidate-card obecna', ruleType: 'html_contains', target: 'candidate-card' },
            { id: 'r2', description: 'Stanowisko Junior Full Stack Developer obecne', ruleType: 'html_contains', target: 'Junior Full Stack Developer' },
            { id: 'r3', description: 'Stack: TypeScript, React, Node, PostgreSQL obecny', ruleType: 'html_contains', target: 'Stack: TypeScript, React, Node, PostgreSQL' },
          ],
        },
        independentTask: {
          title: 'Symulacja zadania Live Coding: Odwrócenie ciągu i palindrom',
          instructions: 'Napisz funkcję isPalindrome(str) ignorującą wielkość liter i białe znaki, objaśniając złożoność czasową O(n).',
          expectedOutcome: 'Płynna demonstracja wiedzy algorytmicznej i czystego stylu pisania kodu.',
          starterHint: 'const clean = str.toLowerCase().replace(/[^a-z0-9]/g, ""); return clean === clean.split("").reverse().join("");',
        },
        quiz: [
          {
            id: 'q-car1-1',
            question: 'Co jest najważniejszą rzeczą, którą ocenia Tech Lead / Senior Developer podczas przeglądania repozytorium kandydata na GitHubie?',
            options: [
              'Czytelność kodu, podział na moduły, obecność testów, obsługa błędów brzegowych oraz jakość dokumentacji w README z działającym linkiem demonstracyjnym',
              'Liczba gwiazdek kupionych na forach internetowych',
              'Czy kandydat używa wyłącznie ciemnego motywu w edytorze kodu',
              'Czy repozytorium ma więcej niż 5000 commitów zrobionych w jeden dzień',
            ],
            correctAnswer: 0,
            explanation: 'Dojrzałość inżynierska objawia się w dbałości o czysty kod, testy, architekturę i czytelną dokumentację.',
          },
        ],
        commonMistakes: [
          {
            mistake: 'Wysyłanie linków do projektów na GitHubie, które nie mają działającego linku demo ani instrukcji instalacji',
            whyItHappens: 'Założenie, że rekruter sklonuje repozytorium i sam skonfiguruje bazę danych.',
            howToFix: 'Rekruter przegląda dziesiątki aplikacji w ciągu godziny. Jeśli nie ma działającego demo na Vercel/Render, projekt często jest całkowicie pomijany.',
            badCode: '# Projekt\nKod w załączniku.',
            goodCode: 'Zobacz działające wdrożenie na żywo: https://twoj-projekt.vercel.app',
          },
        ],
        practicalTask: {
          title: 'Generowanie Certyfikatu Ukończenia Akademii',
          instructions: 'Przejdź do zakładki "Certyfikat" w aplikacji i zobacz oficjalny dokument poświadczający kompetencje Full Stack.',
          brief: 'Zweryfikuj odblokowanie certyfikatu absolwenta.',
          steps: ['Otwórz widok Certyfikatu', 'Sprawdź swoje imię i nazwisko', 'Pobierz lub zachowaj certyfikat'],
          deliverable: 'Oficjalne potwierdzenie kwalifikacji inżynierskich.',
        },
        completionCriteria: [
          'Zrozumienie wymagań rekrutacyjnych i budowy profesjonalnego portfolio',
          'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
          'Zaliczenie quizu z wynikiem minimum 80%',
        ],
      },
    ],
  },
];
