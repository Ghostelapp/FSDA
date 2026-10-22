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
  ],
};
