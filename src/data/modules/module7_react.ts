import { Module } from '../../types';

export const MODULE_7: Module = {
  id: 7,
  title: 'React — Nowoczesne Aplikacje SPA',
  category: 'Frontend',
  description: 'Światowy standard tworzenia interfejsów: komponenty funkcyjne, JSX, hooki (useState, useEffect, useMemo, useCallback, useRef), formularze i routing.',
  badgeName: 'Architekt React',
  badgeIcon: 'Atom',
  durationHours: 45,
  totalXp: 1200,
  prerequisites: ['Moduł 4: JavaScript', 'Moduł 6: TypeScript'],
  topics: [
    'Deklaratywny UI i Virtual DOM: jak React optymalizuje renderowanie',
    'Zarządzanie stanem: useState i reguły niezmienności (immutability)',
    'Cykl życia i efekty uboczne: useEffect, zależności i funkcje czyszczące (cleanup)',
    'Tworzenie własnych hooków (Custom Hooks) dla czystego reużycia logiki',
    'Komunikacja między komponentami i unikanie prop drilling (React Context API)',
    'Nawigacja i routing po stronie klienta (React Router)',
  ],
  projectBrief: 'Projekt modułu: Rozbudowany interaktywny dashboard analityczny z wykresami, filtrowaniem i pobieraniem danych z API.',
  lessons: [
    {
      id: 'react-1',
      moduleId: 7,
      moduleTitle: 'React — Nowoczesne Aplikacje SPA',
      title: 'Komponenty funkcyjne, JSX, propsy i zarządzanie stanem useState',
      slug: 'react-komponenty-jsx-props-usestate',
      durationMinutes: 40,
      xpReward: 80,
      order: 1,
      summary: 'Serce Reacta: jak pisać komponenty w składni JSX, przekazywać parametry (props) oraz zarządzać lokalnym stanem z hookiem useState z zachowaniem zasady immutability.',
      objectives: [
        'Zrozumieć deklaratywny model renderowania Reacta i rolę składni JSX',
        'Typować i przekazywać właściwości komponentu (Props)',
        'Aktualizować stan za pomocą hooka useState bez bezpośredniej mutacji obiektu',
      ],
      prerequisites: ['Moduł 4: JavaScript', 'Moduł 6: TypeScript'],
      theoryMarkdown: `React opiera się na **komponentach** — niezależnych, reużywalnych klockach interfejsu.

**JSX (JavaScript XML):**
Pozwala pisać strukturę HTML wewnątrz plików JavaScript/TypeScript. Pod spodem kompilator zamienia go na wywołania \`React.createElement()\`.

**Zarządzanie stanem (useState):**
Gdy dane w aplikacji się zmieniają, chcemy aby ekran automatycznie się zaktualizował. Do tego służy hook **\`useState\`**:
\`\`\`tsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <p>Licznik: {count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>Zwiększ</button>
    </div>
  );
}
\`\`\`

**Święta zasada Reacta: IMMUTABILITY (Niezmienność stanu)**
Nigdy nie modyfikuj stanu bezpośrednio:
\`\`\`tsx
// BŁĄD KATASTROFALNY (brak re-renderu!):
todos.push(newTodo);
setTodos(todos);

// PRAWIDŁOWO (tworzymy nową tablicę operatorem spread ...):
setTodos(prev => [...prev, newTodo]);
\`\`\``,
      codeExamples: [
        {
          title: 'Komponent karty kursanta z propsami i stanem',
          language: 'typescript',
          code: `interface StudentCardProps {
  name: string;
  initialXp: number;
}

export function StudentCard({ name, initialXp }: StudentCardProps) {
  const [xp, setXp] = useState(initialXp);

  return (
    <div className="card">
      <h3>{name}</h3>
      <p>Doświadczenie: {xp} XP</p>
      <button onClick={() => setXp(prev => prev + 50)}>+50 XP za lekcję</button>
    </div>
  );
}`,
          explanation: 'Każde kliknięcie wywołuje re-render komponentu z nową wartością stanu.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zadeklaruj komponent jako funkcję', description: 'Nazwa komponentu zawsze zaczyna się z wielkiej litery.' },
        { step: 2, title: 'Zainicjalizuj stan z useState', description: 'const [stan, setStan] = useState(wartość).' },
        { step: 3, title: 'Zwróć drzewo JSX', description: 'Zwróć pojedynczy korzeń lub fragment <>...</>.' },
      ],
      interactiveExercise: {
        id: 'ex-react-1',
        title: 'Komponent interaktywnego licznika polubień w React',
        instructions: 'Zaprojektuj wizualną strukturę komponentu React LikeButton: kontener z klasą like-widget, przycisk z tekstem "Polubienie" oraz licznik <span class="badge">42</span>.',
        task: 'Utwórz widget z klasą like-widget, przyciskiem i licznikiem w spanie.',
        starterCode: {
          html: '<!-- Zbuduj widget Reacta poniżej -->\n',
          css: '.like-widget { display: inline-flex; align-items: center; gap: 8px; background: #0f172a; padding: 10px 16px; border-radius: 8px; border: 1px solid #334155; }\nbutton { background: #4f46e5; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; }\n.badge { color: #38bdf8; font-family: monospace; font-weight: bold; }',
          js: 'console.log("React widget aktywny.");',
        },
        solutionCode: {
          html: '<div class="like-widget">\n  <button type="button">Polubienie</button>\n  <span class="badge">42</span>\n</div>',
          css: '.like-widget { display: inline-flex; align-items: center; gap: 8px; background: #0f172a; padding: 10px 16px; border-radius: 8px; border: 1px solid #334155; }\nbutton { background: #4f46e5; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; }\n.badge { color: #38bdf8; font-family: monospace; font-weight: bold; }',
          js: 'console.log("React widget aktywny.");',
        },
        hints: [
          'Użyj <div class="like-widget">.',
          'Wstaw <button type="button">Polubienie</button>.',
          'Wstaw <span class="badge">42</span>.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa like-widget obecna', ruleType: 'html_contains', target: 'like-widget' },
          { id: 'r2', description: 'Przycisk Polubienie obecny', ruleType: 'html_contains', target: 'Polubienie' },
          { id: 'r3', description: 'Licznik z klasą badge obecny', ruleType: 'html_contains', target: 'badge' },
        ],
      },
      independentTask: {
        title: 'Komponent warunkowy (Conditional Rendering)',
        instructions: 'Zastosuj zapis warunkowy {isLoggedIn ? <UserAvatar /> : <LoginButton />} w JSX.',
        expectedOutcome: 'Dynamiczne ukrywanie i pokazywanie elementów w zależności od uprawnień.',
        starterHint: 'W React warunki zapisujemy za pomocą operatora trójargumentowego lub &&.',
      },
      quiz: [
        {
          id: 'q-react1-1',
          question: 'Dlaczego w React NIE wolno bezpośrednio mutować tablicy w stanie (np. state.push(nowyItem))?',
          options: [
            'React porównuje referencje obiektów (Shallow Compare); bezpośrednia mutacja nie zmienia referencji tablicy, więc React nie wie, że należy odświeżyć widok',
            'Przeglądarka wyrzuci natychmiastowy błąd składni',
            'Tablice w React mogą mieć maksymalnie 10 elementów',
            'Funkcja push została wycofana w ES6',
          ],
          correctAnswer: 0,
          explanation: 'React bada referencję tablicy. Aby wywołać re-render, zawsze musimy przekazać nową tablicę [...state, newItem].',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Bezpośrednia mutacja stanu zamiast funkcji setującej',
          whyItHappens: 'Nawyki z programowania obiektowego bez zachowania niemutowalności.',
          howToFix: 'Zawsze używaj settera ze spread operatorem: setUser(prev => ({ ...prev, name: "Nowe" })).',
          badCode: 'user.name = "Nowe"; // BŁĄD: Brak re-renderu!',
          goodCode: 'setUser(prev => ({ ...prev, name: "Nowe" }));',
        },
      ],
      practicalTask: {
        title: 'Komponent filtrowanej listy w React',
        brief: 'Zaimplementuj pole wyszukiwania tekstowego w useState i przefiltruj listę kursantów w JSX za pomocą .filter().',
        steps: ['Utwórz input z onChange', 'Zapisz frazę w stanie', 'Wyrenderuj przefiltrowaną listę'],
        deliverable: 'Praktyczne połączenie stanu formularza z listą w React.',
      },
      completionCriteria: [
        'Zrozumienie JSX i działania useState',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'react-2',
      moduleId: 7,
      moduleTitle: 'React — Nowoczesne Aplikacje SPA',
      title: 'Efekty uboczne z useEffect, pobieranie danych i własne hooki',
      slug: 'react-useeffect-custom-hooks-api',
      durationMinutes: 45,
      xpReward: 90,
      order: 2,
      summary: 'Jak i kiedy łączyć się ze światem zewnętrznym w React: hook useEffect, tablica zależności (dependency array), sprzątanie subskrypcji (cleanup) oraz tworzenie Custom Hooks.',
      objectives: [
        'Opanować 3 warianty tablicy zależności w useEffect (brak, pusta [], z wartościami)',
        'Pobierać dane z API po zamontowaniu komponentu bez pętli nieskończonego renderowania',
        'Pisać funkcję czyszczącą (cleanup function) zapobiegającą wyciekom pamięci',
      ],
      prerequisites: ['Lekcja 1: Komponenty i useState'],
      theoryMarkdown: `Komponenty w React powinny być czystymi funkcjami renderującymi. 

Wszystkie operacje dotykające "świata zewnętrznego" (pobieranie danych z API przez fetch, nasłuchiwanie na \`window.addEventListener\`, timery \`setInterval\`) nazywamy **efektami ubocznymi (Side Effects)** i umieszczamy w hooku **\`useEffect\`**.

**3 warianty tablicy zależności (Dependency Array):**
1. **\`useEffect(fn)\`** (brak tablicy) — wykonuje się po **każdym** renderze (bardzo rzadko używane, niebezpieczne dla fetch!).
2. **\`useEffect(fn, [])\`** (pusta tablica) — wykonuje się **tylko raz**, gdy komponent pojawia się na ekranie (Mount). Idealne do inicjalizacji danych.
3. **\`useEffect(fn, [userId])\`** — wykonuje się przy montowaniu oraz **za każdym razem, gdy zmieni się \`userId\`**.

**Funkcja czyszcząca (Cleanup):**
\`\`\`tsx
useEffect(() => {
  const timer = setInterval(() => console.log("Tick"), 1000);

  // Funkcja zwracana wykonuje się przy odmontowaniu komponentu:
  return () => {
    clearInterval(timer); // Zapobiega wyciekowi pamięci!
  };
}, []);
\`\`\``,
      codeExamples: [
        {
          title: 'Wzorzec pobierania danych z API w komponencie React',
          language: 'typescript',
          code: `export function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (isMounted) setUsers(data);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => { isMounted = false; };
  }, []); // Pusta tablica: pobierz raz po montażu

  if (loading) return <p>Ładowanie kursantów...</p>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}`,
          explanation: 'Flaga isMounted chroni przed aktualizacją stanu na odmontowanym komponencie.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zaimportuj useEffect', description: 'import { useEffect } from "react".' },
        { step: 2, title: 'Zdefiniuj tablicę zależności', description: 'Zawsze świadomie podawaj zależności w drugim argumencie.' },
        { step: 3, title: 'Dodaj cleanup w return', description: 'Usuń event listenery lub anuluj subskrypcje.' },
      ],
      interactiveExercise: {
        id: 'ex-react-2',
        title: 'Komponent powiadomienia o synchronizacji useEffect',
        instructions: 'Zaprojektuj wizualny widżet powiadomienia o synchronizacji efektu: stwórz kontener z klasą sync-badge, tag <code> z napisem "useEffect(() => {}, [])" oraz tekst "Pobieranie jednokrotne".',
        task: 'Utwórz element z klasą sync-badge, tekstem useEffect i Pobieranie jednokrotne.',
        starterCode: {
          html: '<!-- Zbuduj widżet synchronizacji poniżej -->\n',
          css: '.sync-badge { background: #0f172a; border: 1px solid #334155; padding: 12px 18px; border-radius: 8px; display: inline-flex; align-items: center; gap: 10px; font-family: sans-serif; font-size: 0.85rem; color: #cbd5e1; }\ncode { color: #818cf8; font-family: monospace; font-weight: bold; }',
          js: 'console.log("useEffect visualizer gotowy.");',
        },
        solutionCode: {
          html: '<div class="sync-badge">\n  <code>useEffect(() => {}, [])</code>\n  <span>Pobieranie jednokrotne</span>\n</div>',
          css: '.sync-badge { background: #0f172a; border: 1px solid #334155; padding: 12px 18px; border-radius: 8px; display: inline-flex; align-items: center; gap: 10px; font-family: sans-serif; font-size: 0.85rem; color: #cbd5e1; }\ncode { color: #818cf8; font-family: monospace; font-weight: bold; }',
          js: 'console.log("useEffect visualizer gotowy.");',
        },
        hints: [
          'Użyj <div class="sync-badge">.',
          'Wstaw <code>useEffect(() => {}, [])</code>.',
          'Dodaj tekst Pobieranie jednokrotne.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa sync-badge obecna', ruleType: 'html_contains', target: 'sync-badge' },
          { id: 'r2', description: 'Zapis useEffect z pustą tablicą', ruleType: 'html_contains', target: 'useEffect' },
          { id: 'r3', description: 'Tekst Pobieranie jednokrotne', ruleType: 'html_contains', target: 'Pobieranie jednokrotne' },
        ],
      },
      independentTask: {
        title: 'Własny hook useWindowSize',
        instructions: 'Zaimplementuj Custom Hook useWindowSize nasłuchujący zdarzenia resize i zwracający { width, height }.',
        expectedOutcome: 'Możliwość ponownego wykorzystania logiki responsywnej w dowolnym komponencie.',
        starterHint: 'Custom hook to po prostu funkcja zaczynająca się od słowa "use".',
      },
      quiz: [
        {
          id: 'q-react2-1',
          question: 'Co się stanie, jeśli wewnątrz useEffect wywołasz setState, nie podając tablicy zależności (brak [])?',
          options: [
            'Komponent wpadnie w nieskończoną pętlę renderowania (Infinite Render Loop) i zablokuje przeglądarkę',
            'Kod wykona się dokładnie jeden raz',
            'React zgłosi błąd kompilacji',
            'Aplikacja automatycznie przełączy się na język Vue',
          ],
          correctAnswer: 0,
          explanation: 'Brak tablicy oznacza: wykonaj po każdym renderze. setState wywołuje render, co znowu odpala efekt -> nieskończona pętla.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Pominięcie tablicy zależności w useEffect przy pobieraniu z API',
          whyItHappens: 'Przeoczenie drugiego argumentu funkcji useEffect.',
          howToFix: 'Zawsze pamiętaj o drugim argumencie: useEffect(() => { ... }, []).',
          badCode: 'useEffect(() => { fetchUsers(); }); // Pętla bez końca!',
          goodCode: 'useEffect(() => { fetchUsers(); }, []); // Tylko po montażu',
        },
      ],
      practicalTask: {
        title: 'Zegar cyfrowy w czasie rzeczywistym',
        brief: 'Zaimplementuj komponent zegara cyfrowego z hookami useState i useEffect aktualizowany co sekundę z właściwym clearInterval().',
        steps: ['Ustaw stan const [time, setTime] = useState(new Date())', 'Uruchom setInterval w useEffect', 'Wyczyść timer w return'],
        deliverable: 'Praktyczne zrozumienie cyklu życia i funkcji cleanup.',
      },
      completionCriteria: [
        'Zrozumienie hooka useEffect i tablicy zależności',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'react-3',
      moduleId: 7,
      moduleTitle: 'React — Nowoczesne Aplikacje SPA',
      title: 'Globalny stan z Context API, wzorzec useReducer i optymalizacja useMemo',
      slug: 'react-context-api-usereducer-usememo',
      durationMinutes: 45,
      xpReward: 95,
      order: 3,
      summary: 'Koniec z uciążliwym prop drilling! Naucz się tworzyć globalne konteksty w React (Context API), zarządzać złożonym stanem za pomocą maszyn stanów useReducer oraz optymalizować wydajność z useMemo i useCallback.',
      objectives: [
        'Eliminować przekazywanie właściwości przez wiele poziomów (Prop Drilling) za pomocą React Context',
        'Stosować useReducer do przewidywalnego zarządzania stanem opartym na dyskretnych akcjach (dispatch)',
        'Optymalizować czas renderowania komponentów dzięki useMemo (cache wyników) i useCallback (stabilne referencje)',
      ],
      prerequisites: ['Moduł 7: Lekcje 1 i 2'],
      theoryMarkdown: `Wraz ze wzrostem wielkości aplikacji React pojawiają się dwa kluczowe wyzwania: **współdzielenie stanu pomiędzy odległymi gałęziami drzewa (Prop Drilling)** oraz **wydajność ponownego renderowania**.

**1. React Context API:**
Pozwala wstrzykiwać wartości bezpośrednio do dowolnego komponentu wewnątrz Providera, bez konieczności przekazywania propsów przez komponenty pośredniczące:
\`\`\`tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: { name: string; role: string } | null;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const login = (name: string) => setUser({ name, role: 'student' });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth musi być wywołany wewnątrz AuthProvider!');
  return ctx;
};
\`\`\`

**2. useReducer — Architektura zdarzeniowa (Wzorzec Redux):**
Gdy komponent posiada złożony stan zależny od wielu wzajemnych warunków, \`useReducer\` rozdziela definicję **co się stało** (Action) od **jak zmienić dane** (Reducer):
\`\`\`tsx
type CartAction = 
  | { type: 'ADD'; item: { id: string; price: number } }
  | { type: 'REMOVE'; id: string }
  | { type: 'CLEAR' };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.item];
    case 'REMOVE':
      return state.filter(i => i.id !== action.id);
    case 'CLEAR':
      return [];
  }
}
\`\`\`

**3. useMemo i useCallback:**
- \`useMemo(() => computeHeavyValue(a, b), [a, b])\` — zapamiętuje wynik ciężkich obliczeń i nie powtarza ich przy re-renderach, dopóki argumenty są niezmienne.
- \`useCallback(() => handleClick(id), [id])\` — zapobiega tworzeniu nowej referencji funkcji przy każdym renderze, co chroni komponenty podrzędne opakowane w \`React.memo\` przed zbędnym renderowaniem.`,
      codeExamples: [
        {
          title: 'Wzorzec Context + Custom Hook z rygorystycznym typowaniem',
          language: 'tsx',
          code: `import React, { createContext, useContext, useState } from 'react';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
}

const ThemeCtx = createContext<ThemeState | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const toggle = () => setIsDark(prev => !prev);

  return (
    <ThemeCtx.Provider value={{ isDark, toggle }}>
      <div className={isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}>
        {children}
      </div>
    </ThemeCtx.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeCtx);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};`,
          explanation: 'Własny hook useTheme gwarantuje bezpieczeństwo typów i natychmiastowy, czytelny błąd w razie użycia poza Providerem.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zdefiniuj interfejs stanu', description: 'Określ typ danych i funkcje modyfikujące w TypeScript.' },
        { step: 2, title: 'Stwórz Context i Provider', description: 'Użyj createContext i przekaż obiekt wartości w prop value Providera.' },
        { step: 3, title: 'Wystaw Custom Hook', description: 'Stwórz bezpieczną funkcję useContext z asercją obecności Providera.' },
      ],
      interactiveExercise: {
        id: 'ex-react-3',
        title: 'Komponent przełącznika motywu (Context UI)',
        instructions: 'Zaprojektuj interfejs przełącznika motywu z Context API: utwórz kontener z klasą theme-box, wyświetl aktualny motyw "Aktywny motyw: Ciemny" oraz przycisk z klasą btn-toggle i tekstem "Przełącz motyw".',
        task: 'Zbuduj element theme-box z informacją o motywie i przyciskiem btn-toggle.',
        starterCode: {
          html: '<!-- Zbuduj widget przełącznika motywu poniżej -->\n',
          css: '.theme-box { background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 12px; color: #f8fafc; font-family: sans-serif; max-width: 380px; }\n.btn-toggle { background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 12px; }',
          js: 'console.log("Context Theme Widget załadowany.");',
        },
        solutionCode: {
          html: '<div class="theme-box">\n  <p>Aktywny motyw: Ciemny</p>\n  <button class="btn-toggle">Przełącz motyw</button>\n</div>',
          css: '.theme-box { background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 12px; color: #f8fafc; font-family: sans-serif; max-width: 380px; }\n.btn-toggle { background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 12px; }',
          js: 'console.log("Context Theme Widget załadowany.");',
        },
        hints: [
          'Użyj <div class="theme-box"> jako głównego kontenera.',
          'Wstaw tekst Aktywny motyw: Ciemny wewnątrz paragrafu <p>.',
          'Dodaj <button class="btn-toggle">Przełącz motyw</button>.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa theme-box obecna', ruleType: 'html_contains', target: 'theme-box' },
          { id: 'r2', description: 'Tekst Aktywny motyw: Ciemny obecny', ruleType: 'html_contains', target: 'Aktywny motyw: Ciemny' },
          { id: 'r3', description: 'Przycisk btn-toggle z tekstem Przełącz motyw', ruleType: 'html_contains', target: 'Przełącz motyw' },
        ],
      },
      independentTask: {
        title: 'Koszyk sklepowy z useReducer',
        instructions: 'Zaprojektuj maszynę stanów koszyka e-commerce obsługującą akcje ADD_TO_CART, REMOVE_FROM_CART oraz APPLY_DISCOUNT.',
        expectedOutcome: 'Czysta, przewidywalna architektura stanu odporna na błędy logiczne.',
        starterHint: 'Zastosuj switch(action.type) z niezmiennymi operacjami na tablicy items.',
      },
      quiz: [
        {
          id: 'q-react3-1',
          question: 'Jaka jest główna korzyść ze stosowania hooka useMemo w komponentach React?',
          options: [
            'Zapamiętuje (cache’uje) wynik kosztownych obliczeń i przelicza go ponownie tylko wtedy, gdy zmieni się którakolwiek z jego zależności',
            'Automatycznie wysyła zapytanie AJAX do serwera',
            'Zapisuje dane w pamięci stałej dysku SSD',
            'Konwertuje kod Reacta na czysty HTML5',
          ],
          correctAnswer: 0,
          explanation: 'useMemo pozwala uniknąć powtarzania ciężkich kalkulacji (np. filtrowania tysięcy rekordów) przy każdym renderze komponentu.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Przesadne opakowywanie każdej prostej funkcji w useCallback i każdego dodawania w useMemo',
          whyItHappens: 'Przedwczesna optymalizacja bez profilowania wydajności.',
          howToFix: 'useMemo i useCallback same w sobie posiadają narzut pamięciowy. Używaj ich przy kosztownych kalkulacjach lub gdy przekazujesz referencję do komponentów memoizowanych (React.memo).',
          badCode: 'const sum = useMemo(() => a + b, [a, b]); // Przesada!',
          goodCode: 'const filteredList = useMemo(() => filterLargeDataset(items, query), [items, query]);',
        },
      ],
      practicalTask: {
        title: 'Globalny stan powiadomień w akademii',
        brief: 'Zaimplementuj wzorzec Context Provider dla systemu powiadomień toast w React z funkcjami showToast() i dismissToast().',
        steps: ['Utwórz NotificationContext', 'Dodaj stan listy powiadomień', 'Wystaw funkcję dispatchera'],
        deliverable: 'Kompletna architektura globalnego stanu w React.',
      },
      completionCriteria: [
        'Zrozumienie React Context API i eliminacji prop drilling',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'react-4',
      moduleId: 7,
      moduleTitle: 'React — Nowoczesne Interfejsy Użytkownika',
      title: 'Renderowanie warunkowe, listy z atrybutem key oraz wzorzec kompozycji (children)',
      slug: 'react-listy-key-renderowanie-warunkowe-children',
      durationMinutes: 45,
      xpReward: 85,
      order: 4,
      summary: 'Jak dynamicznie wyświetlać kolekcje danych i budować elastyczne komponenty opakowujące (Wrappery)? Poznaj rolę atrybutu key w algorytmie Reconciliation, pułapkę zera przy operatorze && oraz właściwość ReactNode children.',
      objectives: [
        'Renderować dynamiczne tablice obiektów za pomocą metody .map() z unikalnym i stabilnym kluczem key',
        'Stosować bezpieczne renderowanie warunkowe (operator trójargumentowy ? : oraz rzutowanie Boolean)',
        'Projektować reużywalne komponenty układów (Card, Modal, Layout) wykorzystujące prop children: React.ReactNode',
      ],
      prerequisites: ['Komponenty, JSX i Props w React'],
      theoryMarkdown: `W aplikacjach Reactowych niemal każdy ekran składa się z list danych (produkty, komentarze, lekcje) oraz elementów wyświetlanych warunkowo (badge "Premium", komunikaty błędów, puste stany tzw. Empty States).

**1. Renderowanie list i kluczowa rola atrybutu \`key\`:**
Kiedy przekształcasz tablicę danych w tablicę elementów JSX za pomocą \`.map()\`, każdy element najwyższego poziomu wewnątrz mapowania **musi** otrzymać unikalny prop \`key\`:
\`\`\`tsx
interface LessonItem {
  id: string;
  title: string;
  isCompleted: boolean;
}

export function LessonList({ items }: { items: LessonItem[] }) {
  if (items.length === 0) {
    return <p className="text-slate-400">Brak lekcji spełniających kryteria.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((lesson) => (
        <li key={lesson.id} className="p-3 rounded-lg bg-slate-900">
          <span>{lesson.title}</span>
          {lesson.isCompleted ? <span className="text-emerald-400">✓ Ukończono</span> : null}
        </li>
      ))}
    </ul>
  );
}
\`\`\`
**Dlaczego indeks tablicy (\`key={index}\`) to błąd?**
Jeśli lista może być sortowana, filtrowana lub można z niej usuwać elementy ze środka, użycie indeksu jako \`key\` zmyli Virtual DOM — React przypisze stany inputów i animacje do niewłaściwych wierszy! Zawsze używaj unikalnego \`item.id\` z bazy danych.

**2. Pułapka liczby \`0\` w renderowaniu warunkowym \`&&\`:**
\`\`\`tsx
// ❌ BŁĄD: Gdy count wynosi 0, React wyświetli na ekranie cyfrę "0"!
{items.length && <List items={items} />}

// ✅ POPRAWNIE: Jawne porównanie zwracające boolean
{items.length > 0 && <List items={items} />}
\`\`\`

**3. Kompozycja komponentów z \`children: React.ReactNode\`:**
Zamiast przekazywać dziesiątki propsów konfiguracyjnych do karty czy modala, pozwól programiście włożyć dowolną zawartość pomiędzy znaczniki otwierający i zamykający:
\`\`\`tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div>{children}</div>
    </section>
  );
}
\`\`\``,
      codeExamples: [
        {
          title: 'Wzorzec Slotów (Named Slots) przy kompozycji w React',
          language: 'tsx',
          code: `interface ModalProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function ModalShell({ header, children, footer }: ModalProps) {
  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6">
      <header className="border-b border-slate-800 pb-3 mb-4">{header}</header>
      <main className="my-4">{children}</main>
      {footer && <footer className="border-t border-slate-800 pt-3 flex justify-end gap-2">{footer}</footer>}
    </div>
  );
}`,
          explanation: 'Przekazywanie React.ReactNode jako nazwanych propsów (header, footer) daje pełną swobodę kompozycji bez usztywniania komponentu.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Obsłuż stan pusty (Empty State)', description: 'Zanim wywołasz .map(), sprawdź czy tablica nie jest pusta i wyświetl przyjazny komunikat.' },
        { step: 2, title: 'Przypisz stabilny key={item.id}', description: 'Użyj identyfikatora rekordu na najwyższym elemencie zwracanym z funkcji mapującej.' },
        { step: 3, title: 'Zastosuj wzorzec children', description: 'Buduj uniwersalne kontenery UI przyjmujące children: React.ReactNode.' },
      ],
      interactiveExercise: {
        id: 'ex-react-4',
        title: 'Lista zadań z unikalnymi kluczami i Empty State',
        instructions: 'Zbuduj listę <ul class="react-list"> zawierającą dwa elementy <li>: pierwszy z atrybutem data-key="task-1" i tekstem "Zaprojektować komponent Card", drugi z data-key="task-2" i tekstem "Dodać prop children".',
        task: 'Utwórz listę react-list z dwoma elementami posiadającymi atrybuty data-key.',
        starterCode: {
          html: '<!-- Zbuduj listę z kluczami poniżej -->\n',
          css: '.react-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; font-family: sans-serif; }\n.react-list li { background: #1e293b; border: 1px solid #334155; color: #f8fafc; padding: 10px 14px; border-radius: 8px; font-size: 0.9rem; }',
          js: 'console.log("Lista React wyrenderowana.");',
        },
        solutionCode: {
          html: '<ul class="react-list">\n  <li data-key="task-1">Zaprojektować komponent Card</li>\n  <li data-key="task-2">Dodać prop children</li>\n</ul>',
          css: '.react-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; font-family: sans-serif; }\n.react-list li { background: #1e293b; border: 1px solid #334155; color: #f8fafc; padding: 10px 14px; border-radius: 8px; font-size: 0.9rem; }',
          js: 'console.log("Lista React wyrenderowana.");',
        },
        hints: [
          'Użyj <ul class="react-list">.',
          'Dodaj <li data-key="task-1">Zaprojektować komponent Card</li>.',
          'Dodaj <li data-key="task-2">Dodać prop children</li>.',
        ],
        rules: [
          { id: 'r1', description: 'Lista z klasą react-list obecna', ruleType: 'html_contains', target: 'react-list' },
          { id: 'r2', description: 'Element data-key="task-1" obecny', ruleType: 'html_contains', target: 'data-key="task-1"' },
          { id: 'r3', description: 'Tekst Dodać prop children obecny', ruleType: 'html_contains', target: 'Dodać prop children' },
        ],
      },
      independentTask: {
        title: 'Komponent Badge i Alert z kompozycją',
        instructions: 'Zbuduj komponent Alert przyjmujący props variant ("info" | "warning" | "error") oraz children: React.ReactNode. Dobierz kolory obramowania na podstawie wariantu.',
        expectedOutcome: 'Czysty, wielokrotnie używalny komponent powiadomień.',
        starterHint: 'const styles = { info: "border-sky-500", warning: "border-amber-500", error: "border-rose-500" };',
      },
      quiz: [
        {
          id: 'q-react4-1',
          question: 'Dlaczego w React nie należy używać losowej wartości `key={Math.random()}` podczas renderowania listy?',
          options: [
            'Ponieważ przy każdym renderze klucz będzie inny, co zmusi Reacta do całkowitego zniszczenia i ponownego zamontowania wszystkich elementów DOM listy, niszcząc wydajność i fokus w polach formularza',
            'Ponieważ Math.random() nie działa w plikach .tsx',
            'Ponieważ przeglądarka zablokuje stronę z powodu bezpieczeństwa',
            'Ponieważ React akceptuje wyłącznie klucze będące liczbami parzystymi',
          ],
          correctAnswer: 0,
          explanation: 'Klucz musi być stabilny pomiędzy kolejnymi renderami tego samego elementu danych.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Zapis `{items.length && <ItemsList />}` prowadzący do wyświetlenia cyfry 0 na ekranie',
          whyItHappens: 'W JavaScript wyrażenie `0 && Coś` zwraca `0`, a React traktuje liczbę `0` jako poprawny węzeł tekstowy do wyrenderowania.',
          howToFix: 'Zawsze używaj warunku logicznego zwracającego boolean: `items.length > 0 && <ItemsList />` lub operatora trójargumentowego `? :`.',
          badCode: '{notifications.length && <BellBadge />}',
          goodCode: '{notifications.length > 0 && <BellBadge />}',
        },
      ],
      practicalTask: {
        title: 'Filtrowana lista modułów z obsługą Empty State',
        brief: 'Stwórz komponent łączący pole wyszukiwania z listą kursów, wyświetlający dedykowaną ilustrację i przycisk "Wyczyść filtry", gdy lista wynikowa jest pusta.',
        steps: ['Przefiltruj tablicę metodą .filter()', 'Sprawdź filtered.length === 0', 'Wyrenderuj wyniki z użyciem stabilnego key={course.id}'],
        deliverable: 'Przyjazny dla użytkownika komponent listy z obsługą stanów brzegowych.',
      },
      completionCriteria: [
        'Zrozumienie atrybutu key, renderowania warunkowego i kompozycji z children',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'react-5',
      moduleId: 7,
      moduleTitle: 'React — Nowoczesne Interfejsy Użytkownika',
      title: 'Formularze kontrolowane, walidacja na żywo oraz hook useRef',
      slug: 'react-formularze-kontrolowane-walidacja-useref',
      durationMinutes: 45,
      xpReward: 85,
      order: 5,
      summary: 'Opanuj pracę z formularzami w React: poznaj wzorzec Controlled Components (value + onChange), obsługę wielu pól jednym obiektem stanu, walidację błędów w czasie rzeczywistym oraz zastosowanie hooka useRef do zarządzania fokusem i wartościami bez rerenderu.',
      objectives: [
        'Tworzyć formularze kontrolowane (Controlled Inputs), w których jedynym źródłem prawdy jest stan Reacta',
        'Wykorzystywać hook useRef do bezpośredniego dostępu do elementów DOM (np. input.focus()) oraz przechowywania identyfikatorów timerów',
        'Implementować czytelną walidację formularza z blokadą przycisku Submit podczas wysyłki (isSubmitting)',
      ],
      prerequisites: ['useState i obsługa zdarzeń w React'],
      theoryMarkdown: `W tradycyjnym HTML pola formularza (\`<input>\`, \`<textarea>\`, \`<select>\`) same przechowują swój wewnętrzny stan w drzewie DOM. W React przejmujemy nad nimi pełną kontrolę poprzez wzorzec **Controlled Component**.

**1. Komponent kontrolowany (Controlled Input):**
Łączymy atrybut \`value\` ze zmienną stanu \`useState\`, a każdą zmianę przechwytujemy w \`onChange\`:
\`\`\`tsx
import { useState, FormEvent } from 'react';

export function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Blokujemy przeładowanie strony!
    if (!email.includes('@')) {
      setError('Podaj poprawny adres e-mail.');
      return;
    }
    if (password.length < 8) {
      setError('Hasło musi mieć minimum 8 znaków.');
      return;
    }
    setError(null);
    console.log('Wysyłanie danych:', { email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Twój e-mail"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Hasło (min. 8 znaków)"
      />
      {error && <p className="text-rose-400 text-sm">{error}</p>}
      <button type="submit">Zarejestruj konto</button>
    </form>
  );
}
\`\`\`

**2. Hook \`useRef\` — Dwa główne zastosowania:**
W przeciwieństwie do \`useState\`, zmiana właściwości \`ref.current\` **NIE wywołuje ponownego renderowania komponentu**!
1. **Bezpośredni dostęp do elementu DOM:** np. automatyczne ustawienie kursora w polu tekstowym po otwarciu modala (\`inputRef.current?.focus()\`) lub przewinięcie okna czatu na dół.
2. **Przechowywanie mutowalnych wartości między renderami:** np. ID timera z \`setInterval\`, instancja WebSocket czy czas rozpoczęcia wypełniania formularza.`,
      codeExamples: [
        {
          title: 'Zarządzanie fokusem pola wyszukiwania za pomocą useRef',
          language: 'tsx',
          code: `import { useRef, useEffect } from 'react';

export function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Automatycznie ustawia kursor w polu po zamontowaniu komponentu:
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex gap-2">
      <input ref={inputRef} type="search" placeholder="Szukaj lekcji (Ctrl+K)..." />
      <button onClick={() => inputRef.current?.focus()}>Skup kursor</button>
    </div>
  );
}`,
          explanation: 'Przekazanie obiektu inputRef do atrybutu ref={inputRef} sprawia, że React po wyrenderowaniu DOM przypisze rzeczywisty węzeł HTMLInputElement do pola inputRef.current.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Podepnij value oraz onChange', description: 'Upewnij się, że wartość początkowa w useState to pusty ciąg "", a nie undefined.' },
        { step: 2, title: 'Obsłuż zdarzenie onSubmit na znaczniku <form>', description: 'Dzięki temu formularz zadziała również po naciśnięciu klawisza Enter.' },
        { step: 3, title: 'Użyj useRef dla operacji imperatywnych', description: 'Stosuj ref tylko tam, gdzie deklaratywny stan nie wystarcza (focus, scroll, audio/video).' },
      ],
      interactiveExercise: {
        id: 'ex-react-5',
        title: 'Kontrolowany formularz z walidacją na żywo',
        instructions: 'Zbuduj formularz <form class="react-form"> zawierający pole <input id="username-field" value="JuniorDev" /> oraz komunikat walidacji <span class="valid-msg">Status: Poprawny login</span>.',
        task: 'Utwórz formularz react-form z polem username-field i komunikatem valid-msg.',
        starterCode: {
          html: '<!-- Zbuduj formularz kontrolowany poniżej -->\n',
          css: '.react-form { background: #0f172a; border: 1px solid #334155; padding: 16px; border-radius: 10px; display: flex; flex-direction: column; gap: 10px; font-family: sans-serif; max-width: 320px; }\ninput { background: #1e293b; border: 1px solid #475569; color: white; padding: 8px 12px; border-radius: 6px; }\n.valid-msg { color: #34d399; font-size: 0.85rem; font-weight: bold; }',
          js: 'console.log("Controlled form gotowy.");',
        },
        solutionCode: {
          html: '<form class="react-form">\n  <input id="username-field" value="JuniorDev" />\n  <span class="valid-msg">Status: Poprawny login</span>\n</form>',
          css: '.react-form { background: #0f172a; border: 1px solid #334155; padding: 16px; border-radius: 10px; display: flex; flex-direction: column; gap: 10px; font-family: sans-serif; max-width: 320px; }\ninput { background: #1e293b; border: 1px solid #475569; color: white; padding: 8px 12px; border-radius: 6px; }\n.valid-msg { color: #34d399; font-size: 0.85rem; font-weight: bold; }',
          js: 'console.log("Controlled form gotowy.");',
        },
        hints: [
          'Użyj <form class="react-form">.',
          'Wstaw <input id="username-field" value="JuniorDev" />.',
          'Dodaj <span class="valid-msg">Status: Poprawny login</span>.',
        ],
        rules: [
          { id: 'r1', description: 'Formularz z klasą react-form obecny', ruleType: 'html_contains', target: 'react-form' },
          { id: 'r2', description: 'Pole username-field obecne', ruleType: 'html_contains', target: 'username-field' },
          { id: 'r3', description: 'Komunikat Status: Poprawny login obecny', ruleType: 'html_contains', target: 'Status: Poprawny login' },
        ],
      },
      independentTask: {
        title: 'Stoper wykorzystujący useState i useRef',
        instructions: 'Zbuduj komponent stopera z przyciskami Start, Pauza i Reset. Aktualny czas trzymaj w useState, natomiast identyfikator interwału (setInterval) przechowuj w useRef, aby móc wywołać clearInterval w dowolnym momencie.',
        expectedOutcome: 'Praktyczne zrozumienie współpracy reaktywnego useState z niereaktywnym useRef.',
        starterHint: 'const timerRef = useRef<number | null>(null);',
      },
      quiz: [
        {
          id: 'q-react5-1',
          question: 'Co dzieje się w komponencie React, gdy zmienisz wartość `myRef.current = 123` utworzoną za pomocą hooka `useRef`?',
          options: [
            'Wartość zostaje natychmiast zaktualizowana w pamięci i zachowana między renderami, ale React NIE wykonuje ponownego renderowania komponentu',
            'Komponent natychmiast renderuje się od nowa, tak samo jak przy useState',
            'React rzuca błąd o mutacji stanu',
            'Wartość zostaje automatycznie wysłana na serwer',
          ],
          correctAnswer: 0,
          explanation: 'useRef służy właśnie jako "furtka bezpieczeństwa" do przechowywania wartości, których zmiana nie powinna wywoływać przebudowy interfejsu.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Przekazanie `undefined` jako początkowej wartości `value` do pola `<input>`, a potem zmiana na string',
          whyItHappens: 'Zainicjalizowanie stanu jako `useState<string>()` bez argumentu początkowego.',
          howToFix: 'Powoduje to ostrzeżenie w konsoli: "A component is changing an uncontrolled input to be controlled". Zawsze inicjalizuj stan pola tekstowego pustym ciągiem `useState("")`.',
          badCode: 'const [name, setName] = useState(); // undefined na starcie!',
          goodCode: 'const [name, setName] = useState(""); // Zawsze kontrolowany!',
        },
      ],
      practicalTask: {
        title: 'Wielopolowy formularz profilu z licznikiem znaków Bio',
        brief: 'Stwórz formularz edycji profilu kursanta z polem Imię, Rola (select) oraz Bio (textarea z limitem 160 znaków i kolorowym licznikiem na żywo).',
        steps: ['Utwórz obiekt stanu formData', 'Napisz uniwersalny handler lub aktualizuj pola przez spread {...prev, bio: e.target.value}', 'Zablokuj zapis, gdy bio.length > 160'],
        deliverable: 'Kompletny, responsywny formularz edycji danych użytkownika.',
      },
      completionCriteria: [
        'Zrozumienie formularzy kontrolowanych i hooka useRef',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'react-6',
      moduleId: 7,
      moduleTitle: 'React — Nowoczesne Interfejsy Użytkownika',
      title: 'Tworzenie własnych Hooków (Custom Hooks): useLocalStorage, useDebounce i useFetch',
      slug: 'react-custom-hooks-uselocalstorage-usedebounce-usefetch',
      durationMinutes: 45,
      xpReward: 90,
      order: 6,
      summary: 'Jak wydzielić powtarzalną logikę stanu z komponentów UI? Naucz się projektować własne Custom Hooks zgodne z zasadami Reacta (Rules of Hooks), takie jak useLocalStorage, useDebounce do wyszukiwarek oraz useWindowSize.',
      objectives: [
        'Rozumieć zasady Rules of Hooks (wywoływanie wyłącznie na najwyższym poziomie i prefiks use)',
        'Zaimplementować generyczny hook useLocalStorage<T> synchronizujący stan Reacta z pamięcią przeglądarki',
        'Stworzyć hook useDebounce opóźniający wysyłanie zapytań API podczas szybkiego pisania na klawiaturze',
      ],
      prerequisites: ['useState i useEffect w React', 'Generics w TypeScript'],
      theoryMarkdown: `Gdy zauważysz, że w kilku komponentach kopiujesz ten sam zestaw \`useState\` oraz \`useEffect\` (np. nasłuchiwanie stanu online/offline, obsługa localStorage czy pobieranie danych), czas wydzielić **Custom Hook**.

**1. Czym jest Custom Hook?**
To zwykła funkcja JavaScript/TypeScript, której nazwa zaczyna się od przedrostka **\`use\`** (np. \`useTheme\`, \`useDebounce\`) i która wewnątrz wywołuje inne hooki Reacta.

**2. Praktyczny przykład 1: \`useDebounce<T>\` (Ochrona API przed spamem zapytań):**
Gdy użytkownik wpisuje frazę "TypeScript" w wyszukiwarkę, nie chcemy wysyłać 10 zapytań HTTP po każdej literze, lecz poczekać 300 ms od ostatniego naciśnięcia klawisza:
\`\`\`tsx
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // Funkcja czyszcząca anuluje poprzedni timer, jeśli użytkownik nadal pisze!
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
\`\`\`

**3. Praktyczny przykład 2: Generyczny \`useLocalStorage<T>\`:**
\`\`\`tsx
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}
\`\`\`

**Złote zasady Hooków (Rules of Hooks):**
1. Wywołuj hooki **wyłącznie na najwyższym poziomie** funkcji komponentu (nigdy wewnątrz \`if\`, pętli \`for\` ani funkcji zagnieżdżonych!).
2. Wywołuj hooki wyłącznie z komponentów funkcyjnych Reacta lub z innych Custom Hooków.`,
      codeExamples: [
        {
          title: 'Hook useOnlineStatus monitorujący połączenie sieciowe',
          language: 'tsx',
          code: `import { useState, useEffect } from 'react';

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}`,
          explanation: 'Dzięki wydzieleniu logiki do useOnlineStatus(), dowolny komponent w aplikacji może sprawdzić status sieci jedną linijką: const isOnline = useOnlineStatus();',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Nazwij funkcję z prefiksem use', description: 'Pozwala to wtyczce ESLint sprawdzać poprawność użycia hooków.' },
        { step: 2, title: 'Zadbaj o funkcję czyszczącą w useEffect', description: 'Zawsze usuwaj listenery i timery przy odmontowaniu komponentu.' },
        { step: 3, title: 'Zwróć czytelny interfejs (obiekt lub krotkę as const)', description: 'Ułatw konsumentom hooka destrukturyzację danych.' },
      ],
      interactiveExercise: {
        id: 'ex-react-6',
        title: 'Wizualizacja działania hooka useDebounce',
        instructions: 'Zbuduj kontener z klasą hook-card, wstaw nazwę hooka <code>useDebounce(query, 300ms)</code> oraz informację o oszczędności "Zredukowano zapytania API o 85%".',
        task: 'Utwórz widżet hook-card prezentujący optymalizację wyszukiwania przez useDebounce.',
        starterCode: {
          html: '<!-- Zbuduj widżet Custom Hook poniżej -->\n',
          css: '.hook-card { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Custom Hook useDebounce aktywny.");',
        },
        solutionCode: {
          html: '<div class="hook-card">\n  <code>useDebounce(query, 300ms)</code>\n  <div>Zredukowano zapytania API o 85%</div>\n</div>',
          css: '.hook-card { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Custom Hook useDebounce aktywny.");',
        },
        hints: [
          'Użyj <div class="hook-card">.',
          'Wstaw <code>useDebounce(query, 300ms)</code>.',
          'Dodaj tekst Zredukowano zapytania API o 85%.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa hook-card obecna', ruleType: 'html_contains', target: 'hook-card' },
          { id: 'r2', description: 'Wywołanie useDebounce(query, 300ms) obecne', ruleType: 'html_contains', target: 'useDebounce(query, 300ms)' },
          { id: 'r3', description: 'Informacja Zredukowano zapytania API o 85% obecna', ruleType: 'html_contains', target: 'Zredukowano zapytania API o 85%' },
        ],
      },
      independentTask: {
        title: 'Custom Hook useToggle',
        instructions: 'Napisz zwięzły hook useToggle(initialValue = false), który zwraca krotkę [value, toggle, setValue], gdzie funkcja toggle() odwraca wartość logiczną na przeciwną.',
        expectedOutcome: 'Wygodna obsługa modali, menu mobilnych i przełączników w całej aplikacji.',
        starterHint: 'const toggle = useCallback(() => setValue(v => !v), []);',
      },
      quiz: [
        {
          id: 'q-react6-1',
          question: 'Czy dwa różne komponenty korzystające z tego samego Custom Hooka (np. `useCounter()`) współdzielą ze sobą ten sam stan?',
          options: [
            'Nie! Custom Hook to mechanizm wielokrotnego użycia logiki stanowej, ale każde wywołanie hooka tworzy całkowicie niezależną, odizolowaną instancję stanu',
            'Tak, wszystkie komponenty mają zawsze wspólny stan',
            'Tylko wtedy, gdy są w tym samym pliku',
            'Tak, ponieważ Custom Hook działa jak zmienna globalna window',
          ],
          correctAnswer: 0,
          explanation: 'Aby współdzielić ten sam stan między komponentami, należy połączyć hook z React Context API.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Wywoływanie hooka warunkowo wewnątrz instrukcji `if (isLoggedIn) { const data = useData(); }`',
          whyItHappens: 'Nieznajomość sposobu, w jaki React przechowuje listę hooków w pamięci komponentu (jako tablicę opartą na kolejności wywołań).',
          howToFix: 'Zawsze wywołuj hooki na samym początku komponentu w stałej kolejności, a warunek logiczny przekaż do środka hooka lub obsłuż po jego wywołaniu.',
          badCode: 'if (userId) { useEffect(() => { ... }, []); } // Błąd Rules of Hooks!',
          goodCode: 'useEffect(() => { if (userId) { ... } }, [userId]);',
        },
      ],
      practicalTask: {
        title: 'Hook useMediaQuery do responsywnego UI',
        brief: 'Stwórz hook useMediaQuery(query: string): boolean korzystający z window.matchMedia, który informuje komponent, czy ekran jest w trybie mobilnym.',
        steps: ['Odczytaj window.matchMedia(query).matches', 'Nasłuchuj zdarzenia "change"', 'Wyczyść listener w funkcji return efektu'],
        deliverable: 'Reaktywne dostosowywanie interfejsu React do rozmiaru ekranu.',
      },
      completionCriteria: [
        'Zrozumienie projektowania Custom Hooks i Rules of Hooks',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'react-7',
      moduleId: 7,
      moduleTitle: 'React — Nowoczesne Interfejsy Użytkownika',
      title: 'Nawigacja w aplikacjach SPA: React Router, parametry dynamiczne i Protected Routes',
      slug: 'react-router-spa-nawigacja-parametry-protected-routes',
      durationMinutes: 45,
      xpReward: 90,
      order: 7,
      summary: 'Jak tworzyć wieloekranowe aplikacje Single Page Application (SPA) bez przeładowywania przeglądarki? Poznaj React Router: komponenty Link/NavLink, hooki useParams, useNavigate, useSearchParams oraz wzorzec chronionych tras (Protected Routes).',
      objectives: [
        'Konfigurować drzewo tras za pomocą BrowserRouter, Routes, Route oraz zagnieżdżonych układów (<Outlet />)',
        'Odczytywać parametry ścieżki (:lessonId) przez useParams oraz parametry zapytania (?filter=react) przez useSearchParams',
        'Zabezpieczać widoki wymagające logowania za pomocą komponentu strażnika <ProtectedRoute>',
      ],
      prerequisites: ['Komponenty, Stan i Context API w React'],
      theoryMarkdown: `W klasycznych stronach WWW kliknięcie w link \`<a href="/profil">\` powoduje pobranie nowego dokumentu HTML z serwera i mignięcie białego ekranu. W **Single Page Application (SPA)** przechwytujemy zmianę adresu URL za pomocą History API przeglądarki i podmieniamy tylko odpowiedni komponent Reacta!

**1. Konfiguracja tras i układów zagnieżdżonych (\`<Outlet />\`):**
\`\`\`tsx
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

function AppLayout() {
  return (
    <div>
      <nav className="flex gap-4 p-4 border-b border-slate-800">
        <Link to="/">Dashboard</Link>
        <Link to="/courses">Kursy</Link>
      </nav>
      <main className="p-6">
        {/* W miejscu Outlet wyrenderuje się dopasowana podstrona! */}
        <Outlet />
      </main>
    </div>
  );
}
\`\`\`

**2. Dynamiczne parametry URL (\`useParams\`) i nawigacja programowa (\`useNavigate\`):**
\`\`\`tsx
import { useParams, useNavigate } from 'react-router-dom';

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const handleComplete = () => {
    // Po ukończeniu lekcji przekierowujemy użytkownika do podsumowania:
    navigate('/dashboard', { replace: true });
  };

  return <h1>Aktualna lekcja: {lessonId}</h1>;
}
\`\`\`

**3. Wzorzec Chronionej Trasy (Protected Route):**
Gdy niezalogowany użytkownik próbuje wejść na \`/settings\`, przekierowujemy go na \`/login\`:
\`\`\`tsx
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
\`\`\``,
      codeExamples: [
        {
          title: 'Synchronizacja filtrów z paskiem adresu URL za pomocą useSearchParams',
          language: 'tsx',
          code: `import { useSearchParams } from 'react-router-dom';

export function CourseFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') ?? 'all';

  return (
    <div className="flex gap-2">
      <button onClick={() => setSearchParams({ category: 'frontend' })}>
        Frontend (Aktywny: {category})
      </button>
      <button onClick={() => setSearchParams({ category: 'backend' })}>
        Backend
      </button>
    </div>
  );
}`,
          explanation: 'Trzymanie stanu filtrów w URL (?category=frontend) zamiast w zwykłym useState pozwala użytkownikowi skopiować link i wysłać znajomemu dokładnie ten sam przefiltrowany widok!',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zastąp <a href> komponentem <Link to>', description: 'Unikniesz pełnego przeładowania strony i utraty stanu aplikacji.' },
        { step: 2, title: 'Dodaj trasę 404 Not Found', description: 'Użyj <Route path="*" element={<NotFoundPage />} /> na końcu listy tras.' },
        { step: 3, title: 'Używaj leniwego ładowania tras (React.lazy)', description: 'Dziel kod podstron na mniejsze paczki ładowane na żądanie.' },
      ],
      interactiveExercise: {
        id: 'ex-react-7',
        title: 'Pasek nawigacji SPA z aktywną trasą',
        instructions: 'Zbuduj nawigację <nav class="spa-nav"> zawierającą informację o aktualnej ścieżce <code>URL: /courses/react-7</code> oraz status ochrony "ProtectedRoute: Authorized".',
        task: 'Utwórz element spa-nav prezentujący stan routera SPA.',
        starterCode: {
          html: '<!-- Zbuduj pasek statusu routera poniżej -->\n',
          css: '.spa-nav { background: #0f172a; border: 1px solid #6366f1; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; justify-content: space-between; align-items: center; gap: 12px; }\ncode { color: #818cf8; font-family: monospace; font-weight: bold; }',
          js: 'console.log("SPA Router aktywny.");',
        },
        solutionCode: {
          html: '<nav class="spa-nav">\n  <code>URL: /courses/react-7</code>\n  <span>ProtectedRoute: Authorized</span>\n</nav>',
          css: '.spa-nav { background: #0f172a; border: 1px solid #6366f1; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; justify-content: space-between; align-items: center; gap: 12px; }\ncode { color: #818cf8; font-family: monospace; font-weight: bold; }',
          js: 'console.log("SPA Router aktywny.");',
        },
        hints: [
          'Użyj <nav class="spa-nav">.',
          'Wstaw <code>URL: /courses/react-7</code>.',
          'Dodaj tekst ProtectedRoute: Authorized.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa spa-nav obecna', ruleType: 'html_contains', target: 'spa-nav' },
          { id: 'r2', description: 'Ścieżka URL: /courses/react-7 obecna', ruleType: 'html_contains', target: 'URL: /courses/react-7' },
          { id: 'r3', description: 'Status ProtectedRoute: Authorized obecny', ruleType: 'html_contains', target: 'ProtectedRoute: Authorized' },
        ],
      },
      independentTask: {
        title: 'Leniwe ładowanie podstron (Code Splitting z React.lazy i Suspense)',
        instructions: 'Opakuj ciężki komponent panelu analitycznego w React.lazy(() => import("./AnalyticsPage")) i wyświetl szkielet ładowania wewnątrz <Suspense fallback={<Skeleton />}>.',
        expectedOutcome: 'Szybszy start aplikacji dzięki pobieraniu kodu podstrony dopiero po kliknięciu w zakładkę.',
        starterHint: 'const AnalyticsPage = lazy(() => import("./AnalyticsPage"));',
      },
      quiz: [
        {
          id: 'q-react7-1',
          question: 'Dlaczego w aplikacjach React SPA do nawigacji wewnętrznej używamy komponentu `<Link to="/kursy">` zamiast klasycznego znacznika `<a href="/kursy">`?',
          options: [
            'Ponieważ `<Link>` przechwytuje kliknięcie i zmienia widok za pomocą History API bez pełnego przeładowania strony i bez resetowania stanu aplikacji w pamięci RAM',
            'Ponieważ znacznik `<a>` został usunięty ze standardu HTML5',
            'Ponieważ `<Link>` automatycznie tłumaczy stronę na język angielski',
            'Ponieważ znacznik `<a>` nie pozwala na zmianę koloru tekstu w CSS',
          ],
          correctAnswer: 0,
          explanation: 'Klasyczny <a href> wymusza pełne odświeżenie dokumentu przez przeglądarkę, co czyści cały stan Reacta.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Wywoływanie funkcji `navigate("/home")` bezpośrednio w ciele komponentu podczas renderowania',
          whyItHappens: 'Chęć przekierowania użytkownika bez użycia komponentu <Navigate /> lub hooka useEffect.',
          howToFix: 'Podczas czystego renderowania zwróć deklaratywny komponent `<Navigate to="/home" replace />`, a funkcję `navigate()` wywołuj wyłącznie wewnątrz obsługi zdarzeń (np. onClick) lub w `useEffect`.',
          badCode: 'if (!user) { navigate("/login"); return null; }',
          goodCode: 'if (!user) { return <Navigate to="/login" replace />; }',
        },
      ],
      practicalTask: {
        title: 'Wielopoziomowy układ Dashboardu z NavLink',
        brief: 'Zbuduj boczny pasek nawigacji wykorzystujący komponent <NavLink>, który automatycznie podświetla aktywną zakładkę za pomocą właściwości ({ isActive }) => isActive ? "bg-indigo-600" : "".',
        steps: ['Zdefiniuj tablicę linków nawigacyjnych', 'Wyrenderuj komponenty NavLink', 'Skonfiguruj zagnieżdżony <Outlet /> dla prawej kolumny treści'],
        deliverable: 'Profesjonalna nawigacja aplikacji SaaS.',
      },
      completionCriteria: [
        'Zrozumienie routingu SPA, parametrów URL i Protected Routes',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
  ],
};

