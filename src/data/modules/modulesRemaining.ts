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
      {
        id: 'fullstack-2',
        moduleId: 11,
        moduleTitle: 'Full Stack — Integracja Całego Ekosystemu',
        title: 'Mutacje danych (useMutation), Upload plików (Multipart/Presigned URLs) i Powiadomienia',
        slug: 'fullstack-usemutation-upload-plikow-s3-powiadomienia',
        durationMinutes: 45,
        xpReward: 90,
        order: 2,
        summary: 'Jak przesyłać formularze, zdjęcia profilowe i dokumenty PDF z Reacta do backendu i chmury? Poznaj hook useMutation z automatyczną inwalidacją pamięci podręcznej (invalidateQueries) oraz architekturę bezpośredniego wgrywania plików przez Presigned URLs.',
        objectives: [
          'Wykonywać operacje POST/PATCH/DELETE za pomocą hooka useMutation i odświeżać widok przez queryClient.invalidateQueries',
          'Przesyłać pliki binarne za pomocą obiektu FormData (multipart/form-data) oraz walidować ich typ MIME i rozmiar',
          'Rozumieć wzorzec Presigned URLs do bezpośredniego wgrywania dużych plików do chmury S3 / Cloud Storage bez obciążania serwera Node.js',
        ],
        prerequisites: ['TanStack Query i REST API'],
        theoryMarkdown: `Pobieranie danych (\`useQuery\`) to dopiero połowa sukcesu. Prawdziwa aplikacja Full Stack musi pozwalać użytkownikowi tworzyć nowe zasoby, wgrywać awatary i natychmiast aktualizować interfejs.

**1. Mutacje i automatyczne odświeżanie cache (\`useMutation\` + \`invalidateQueries\`):**
Gdy użytkownik doda nowy komentarz, nie musimy ręcznie dopisywać go do tablicy stanu. Mówimy \`QueryClientowi\`, że klucz \`['comments']\` stał się nieaktualny, a TanStack Query sam pobierze świeżą listę w tle!
\`\`\`tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function AddCourseButton() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newCourse: { title: string }) =>
      fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse),
      }).then((res) => res.json()),
    onSuccess: () => {
      // Automatycznie odświeża wszystkie komponenty korzystające z ['courses']!
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  return (
    <button
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ title: 'Kurs Architektury' })}
    >
      {mutation.isPending ? 'Zapisywanie...' : 'Dodaj kurs'}
    </button>
  );
}
\`\`\`

**2. Upload plików: \`FormData\` vs \`Presigned URLs\`:**
- **Małe pliki (np. awatar do 2 MB):** Wysyłamy przez \`FormData\` do naszego serwera Express, który weryfikuje nagłówki pliku (Magic Bytes) i zapisuje go.
- **Duże pliki (np. wideo, archiwa ZIP):** Nigdy nie przepychaj ich przez pamięć RAM serwera Node.js! Backend generuje jednorazowy, ważny przez 5 minut podpisany link (**Presigned URL**) do AWS S3 / Cloudflare R2, a przeglądarka wysyła plik bezpośrednio do chmury.`,
        codeExamples: [
          {
            title: 'Podgląd wybranego zdjęcia na żywo przed wysłaniem (URL.createObjectURL)',
            language: 'tsx',
            code: `function AvatarUploader() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Plik nie może przekraczać 2 MB!');
      return;
    }
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div>
      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Podgląd" className="w-20 h-20 rounded-full object-cover" />}
    </div>
  );
}`,
            explanation: 'Funkcja URL.createObjectURL(file) tworzy błyskawiczny lokalny adres podglądu w pamięci przeglądarki jeszcze przed wysłaniem pliku na serwer.',
          },
        ],
        stepByStepGuide: [
          { step: 1, title: 'Użyj useMutation dla operacji zapisu', description: 'Zablokuj przycisk wysyłki na czas mutation.isPending, aby uniknąć podwójnych kliknięć.' },
          { step: 2, title: 'Unieważnij powiązane klucze cache w onSuccess', description: 'Wywołaj queryClient.invalidateQueries({ queryKey: [...] }).' },
          { step: 3, title: 'Waliduj rozmiar i typ pliku po obu stronach', description: 'Sprawdzaj file.size w React dla wygody UX oraz na serwerze dla bezpieczeństwa.' },
        ],
        interactiveExercise: {
          id: 'ex-fs-2',
          title: 'Widżet mutacji i wgrywania pliku do chmury',
          instructions: 'Zbuduj kontener z klasą upload-widget, wstaw znacznik <code>useMutation -&gt; invalidateQueries(["courses"])</code> oraz status "Cloud Storage Upload: 100% (Presigned URL)".',
          task: 'Utwórz element upload-widget prezentujący synchronizację mutacji i uploadu.',
          starterCode: {
            html: '<!-- Zbuduj widżet uploadu poniżej -->\n',
            css: '.upload-widget { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
            js: 'console.log("Upload widget aktywny.");',
          },
          solutionCode: {
            html: '<div class="upload-widget">\n  <code>useMutation -&gt; invalidateQueries(["courses"])</code>\n  <div>Cloud Storage Upload: 100% (Presigned URL)</div>\n</div>',
            css: '.upload-widget { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
            js: 'console.log("Upload widget aktywny.");',
          },
          hints: [
            'Użyj <div class="upload-widget">.',
            'Wstaw <code>useMutation -&gt; invalidateQueries(["courses"])</code>.',
            'Dodaj tekst Cloud Storage Upload: 100% (Presigned URL).',
          ],
          rules: [
            { id: 'r1', description: 'Klasa upload-widget obecna', ruleType: 'html_contains', target: 'upload-widget' },
            { id: 'r2', description: 'Wywołanie invalidateQueries obecne', ruleType: 'html_contains', target: 'invalidateQueries' },
            { id: 'r3', description: 'Informacja Presigned URL obecna', ruleType: 'html_contains', target: 'Presigned URL' },
          ],
        },
        independentTask: {
          title: 'Wysyłka FormData z paskiem postępu',
          instructions: 'Przygotuj obiekt new FormData(), dołącz do niego plik za pomocą formData.append("avatar", file) i pamiętaj, aby przy wysyłce przez fetch NIE ustawiać ręcznie nagłówka Content-Type (przeglądarka sama doda boundary!).',
          expectedOutcome: 'Poprawne przesłanie pliku multipart/form-data do serwera.',
          starterHint: 'const fd = new FormData(); fd.append("file", selectedFile); fetch("/api/upload", { method: "POST", body: fd });',
        },
        quiz: [
          {
            id: 'q-fs2-1',
            question: 'Dlaczego podczas wysyłania obiektu `FormData` z plikiem za pomocą `fetch()` NIE należy ręcznie ustawiać nagłówka `headers: { "Content-Type": "multipart/form-data" }`?',
            options: [
              'Ponieważ przeglądarka musi automatycznie wygenerować i dokleić do tego nagłówka unikalny ciąg rozdzielający części formularza (tzw. `boundary=----WebKitFormBoundary...`), bez którego serwer nie odczyta pliku',
              'Ponieważ `fetch()` nie obsługuje nagłówków HTTP',
              'Ponieważ plik zostanie zamieniony na czarno-biały obraz',
              'Ponieważ FormData używa protokołu FTP',
            ],
            correctAnswer: 0,
            explanation: 'Gdy przekażesz instancję FormData do body w fetch(), przeglądarka sama ustawi kompletny nagłówek multipart/form-data wraz z parametrem boundary.',
          },
        ],
        commonMistakes: [
          {
            mistake: 'Zapisywanie wgrywanych przez użytkowników awatarów w lokalnym folderze serwera wewnątrz kontenera Docker bez podpiętego wolumenu lub chmury S3',
            whyItHappens: 'Traktowanie systemu plików kontenera jak trwałego dysku twardego.',
            howToFix: 'Kontenery w chmurze są efemeryczne — przy każdym nowym wdrożeniu (deployu) system plików kontenera jest resetowany do zera. Pliki użytkowników trzymaj zawsze w chmurze obiektowej (S3, Cloudflare R2, GCS) lub na trwałym wolumenie!',
            badCode: '// Zapis do ./tmp/uploads wewnątrz kontenera bez Volume -> utrata plików po restarcie!',
            goodCode: '// Upload do S3 / R2 lub zamontowanego Persistent Volume',
          },
        ],
        practicalTask: {
          title: 'System powiadomień Web Push i Service Worker',
          brief: 'Przeanalizuj plik public/sw.js oraz integrację powiadomień przypominających o nauce w naszym projekcie.',
          steps: ['Otwórz public/sw.js', 'Zobacz obsługę zdarzenia message i showNotification', 'Sprawdź ustawienia przypomnień w pasku nawigacji'],
          deliverable: 'Zrozumienie działania powiadomień przeglądarkowych w aplikacjach PWA.',
        },
        completionCriteria: [
          'Zrozumienie useMutation, FormData i architektury Presigned URLs',
          'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
          'Zaliczenie quizu z wynikiem minimum 80%',
        ],
      },
      {
        id: 'fullstack-3',
        moduleId: 11,
        moduleTitle: 'Full Stack — Integracja Całego Ekosystemu',
        title: 'Integracja płatności online (Stripe Checkout & Webhooks) oraz e-maile transakcyjne',
        slug: 'fullstack-platnosci-stripe-webhooks-emaile-transakcyjne',
        durationMinutes: 45,
        xpReward: 95,
        order: 3,
        summary: 'Jak zarabiać na własnej aplikacji SaaS lub sklepie e-commerce? Poznaj bezpieczny przepływ płatności Stripe (dlaczego nigdy nie ufamy przekierowaniu na frontendzie!), kryptograficzną weryfikację Webhooków oraz wysyłkę e-maili transakcyjnych.',
        objectives: [
          'Rozumieć architekturę płatności opartą na sesjach Stripe Checkout oraz Payment Intents',
          'Implementować bezpieczny endpoint Webhooka weryfikujący podpis kryptograficzny Stripe-Signature',
          'Zapewniać idempotentność obsługi zdarzeń płatniczych (ochrona przed podwójnym naliczeniem zamówienia)',
        ],
        prerequisites: ['Architektura Full Stack i Transakcje ACID'],
        theoryMarkdown: `Integracja płatności to moment, w którym projekt edukacyjny zamienia się w prawdziwy produkt komercyjny. Najważniejsza zasada bezpieczeństwa finansowego brzmi: **Nigdy nie nadawaj dostępu Premium na podstawie samego wejścia użytkownika na stronę \`/payment-success\` w React!**

**1. Jak działa bezpieczny przepływ płatności (Stripe Checkout + Webhook)?**
1. Użytkownik klika "Kup dostęp Pro (99 zł)" w React.
2. Nasz backend Express pobiera cenę z **własnej bazy danych** (nigdy z parametru przysłanego z frontendu!) i tworzy sesję w API Stripe.
3. Użytkownik płaci kartą lub BLIK-iem na certyfikowanej stronie Stripe.
4. Serwery Stripe wysyłają bezpośrednio do naszego backendu asynchroniczne powiadomienie HTTP POST zwane **Webhookiem** (\`checkout.session.completed\`).
5. Nasz backend weryfikuje podpis kryptograficzny nagłówka \`Stripe-Signature\` i aktywuje subskrypcję w bazie PostgreSQL!

\`\`\`typescript
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;

  let event;
  try {
    // Weryfikacja, czy żądanie naprawdę przyszło ze Stripe, a nie od hakera:
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return res.status(400).send('Invalid Webhook Signature');
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await activateUserSubscription(session.client_reference_id);
  }

  res.status(200).json({ received: true });
});
\`\`\`

**2. Idempotentność (Idempotency):**
Serwery płatnicze ponawiają wysyłkę webhooka, jeśli Twój serwer nie odpowie w ciągu kilku sekund. Zapisz \`event.id\` w bazie danych (w kolumnie \`UNIQUE\`), aby mieć 100% pewności, że to samo zdarzenie nigdy nie zostanie przetworzone dwa razy!`,
        codeExamples: [
          {
            title: 'Wysyłka transakcyjnego e-maila powitalnego z szablonem HTML',
            language: 'typescript',
            code: `async function sendWelcomeEmail(toEmail: string, userName: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.RESEND_API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Akademia <onboarding@twojadomena.pl>',
      to: [toEmail],
      subject: 'Witaj na pokładzie Akademii Full Stack!',
      html: \`<h1>Cześć, \${userName}!</h1><p>Twój dostęp został aktywowany.</p>\`,
    }),
  });
  return res.ok;
}`,
            explanation: 'Nowoczesne serwisy e-mailowe (Resend, Postmark, SendGrid) pozwalają wysyłać wiadomości transakcyjne zwykłym zapytaniem REST API bez konieczności ręcznej konfiguracji serwera SMTP.',
          },
        ],
        stepByStepGuide: [
          { step: 1, title: 'Pobieraj ceny wyłącznie po stronie serwera', description: 'Klient wysyła tylko productId, a backend sam odczytuje kwotę z bazy.' },
          { step: 2, title: 'Użyj express.raw() dla trasy Webhooka', description: 'Weryfikacja podpisu kryptograficznego wymaga surowego bufora body przed parsowaniem JSON.' },
          { step: 3, title: 'Zadbaj o klucz idempotentności (event.id)', description: 'Sprawdzaj, czy dany identyfikator zdarzenia nie został już wcześniej obsłużony.' },
        ],
        interactiveExercise: {
          id: 'ex-fs-3',
          title: 'Wizualizacja weryfikacji Webhooka Płatności',
          instructions: 'Zbuduj kontener z klasą webhook-card, wstaw znacznik <code>Event: checkout.session.completed</code> oraz status "Stripe-Signature: Verified (Idempotent)".',
          task: 'Utwórz widżet webhook-card prezentujący bezpieczną obsługę płatności.',
          starterCode: {
            html: '<!-- Zbuduj widżet Webhooka poniżej -->\n',
            css: '.webhook-card { background: #0f172a; border: 1px solid #6366f1; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #818cf8; font-family: monospace; font-weight: bold; }',
            js: 'console.log("Payment Webhook zweryfikowany.");',
          },
          solutionCode: {
            html: '<div class="webhook-card">\n  <code>Event: checkout.session.completed</code>\n  <div>Stripe-Signature: Verified (Idempotent)</div>\n</div>',
            css: '.webhook-card { background: #0f172a; border: 1px solid #6366f1; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #818cf8; font-family: monospace; font-weight: bold; }',
            js: 'console.log("Payment Webhook zweryfikowany.");',
          },
          hints: [
            'Użyj <div class="webhook-card">.',
            'Wstaw <code>Event: checkout.session.completed</code>.',
            'Dodaj tekst Stripe-Signature: Verified (Idempotent).',
          ],
          rules: [
            { id: 'r1', description: 'Klasa webhook-card obecna', ruleType: 'html_contains', target: 'webhook-card' },
            { id: 'r2', description: 'Zdarzenie checkout.session.completed obecne', ruleType: 'html_contains', target: 'checkout.session.completed' },
            { id: 'r3', description: 'Informacja Stripe-Signature: Verified obecna', ruleType: 'html_contains', target: 'Stripe-Signature: Verified' },
          ],
        },
        independentTask: {
          title: 'Tabela logów idempotentności webhooków',
          instructions: 'Zaprojektuj tabelę SQL webhook_events z kolumną event_id TEXT PRIMARY KEY oraz processed_at TIMESTAMPTZ, która chroni system przed ponownym wykonaniem tego samego webhooka.',
          expectedOutcome: 'Gwarancja jednokrotnego wykonania logiki biznesowej po płatności.',
          starterHint: 'INSERT INTO webhook_events (event_id) VALUES ($1) ON CONFLICT DO NOTHING;',
        },
        quiz: [
          {
            id: 'q-fs3-1',
            question: 'Dlaczego kwota płatności (np. cena kursu) NIGDY nie powinna być przesyłana z frontendu React w ciele żądania `POST /api/checkout { price: 99 }`?',
            options: [
              'Ponieważ użytkownik może zmodyfikować żądanie w przeglądarce i wysłać `{ price: 0.01 }`, kupując produkt za 1 grosz; frontend powinien przesłać wyłącznie `productId`, a serwer sam pobiera cenę z bazy danych',
              'Ponieważ format JSON nie obsługuje liczb',
              'Ponieważ spowalnia to działanie bramki płatniczej',
              'Ponieważ React nie potrafi mnożyć kwot przez podatek VAT',
            ],
            correctAnswer: 0,
            explanation: 'Wszelkie kalkulacje cenowe, rabaty i podatki muszą odbywać się wyłącznie po stronie zaufanego serwera backendowego.',
          },
        ],
        commonMistakes: [
          {
            mistake: 'Brak weryfikacji podpisu `Stripe-Signature` w endpoincie webhooka',
            whyItHappens: 'Zwykłe odczytanie `req.body.type === "checkout.session.completed"` bez wywołania `constructEvent`.',
            howToFix: 'Bez weryfikacji kryptograficznej podpisu każdy atakujący może wysłać fałszywy request POST na Twój publiczny adres `/api/webhooks/stripe` i aktywować sobie konto Premium za darmo!',
            badCode: 'app.post("/webhook", (req, res) => { activatePremium(req.body.userId); });',
            goodCode: 'const event = stripe.webhooks.constructEvent(req.body, sig, secret);',
          },
        ],
        practicalTask: {
          title: 'Architektura modułu subskrypcji SaaS',
          brief: 'Rozrysuj maszynę stanów subskrypcji użytkownika: TRIALING -> ACTIVE -> PAST_DUE -> CANCELED i przypisz odpowiednie zdarzenia webhooków do każdego przejścia.',
          steps: ['Zdefiniuj enum SubscriptionStatus', 'Obsłuż pomyślną płatność (invoice.paid)', 'Obsłuż odrzucenie karty (invoice.payment_failed)'],
          deliverable: 'Kompletny model biznesowy subskrypcji SaaS.',
        },
        completionCriteria: [
          'Zrozumienie przepływu płatności Stripe, Webhooków i idempotentności',
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
      {
        id: 'test-2',
        moduleId: 12,
        moduleTitle: 'Testowanie i Jakość Kodu',
        title: 'Testowanie komponentów React (React Testing Library) oraz Mocking zależności',
        slug: 'testowanie-react-testing-library-mocking-integracyjne',
        durationMinutes: 45,
        xpReward: 85,
        order: 2,
        summary: 'Jak testować interfejsy użytkownika tak, jak korzysta z nich prawdziwy człowiek? Poznaj filozofię React Testing Library (getByRole, userEvent), testowanie stanów asynchronicznych (findByText) oraz kontrolowane symulowanie API (Mocking).',
        objectives: [
          'Wyszukiwać elementy na ekranie za pomocą dostępnych ról ARIA (screen.getByRole) zamiast kruchych klas CSS',
          'Symulować realistyczne interakcje użytkownika (kliknięcia, pisanie z klawiatury) za pomocą biblioteki @testing-library/user-event',
          'Rozumieć różnicę między getBy (synchroniczny), queryBy (sprawdzanie braku elementu) oraz findBy (asynchroniczny z oczekiwaniem)',
        ],
        prerequisites: ['Testy jednostkowe w Vitest oraz React'],
        theoryMarkdown: `Główna zasada **React Testing Library (RTL)** brzmi: *"Im bardziej Twoje testy przypominają sposób, w jaki z oprogramowania korzysta użytkownik, tym większą dają Ci pewność"*.

**1. Hierarchia zapytań: Dlaczego \`getByRole\` jest królem?**
Użytkownik nie widzi w przeglądarce nazwy klasy \`.btn-primary-v2\` ani wewnętrznej nazwy stanu \`isModalOpen\`. Użytkownik widzi **przycisk z napisem "Zapisz"** lub **pole tekstowe z etykietą "Adres e-mail"**:
\`\`\`tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

test('wyświetla błąd, gdy hasło jest zbyt krótkie', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  // Szukamy elementów po ich roli dostępnościowej (Accessibility) i etykiecie:
  await user.type(screen.getByLabelText(/adres e-mail/i), 'jan@example.com');
  await user.type(screen.getByLabelText(/hasło/i), '123');
  await user.click(screen.getByRole('button', { name: /zaloguj/i }));

  // Sprawdzamy, czy na ekranie pojawił się komunikat błędu:
  expect(await screen.findByRole('alert')).toHaveTextContent('Minimum 8 znaków');
});
\`\`\`
*(Korzyść dodatkowa: Jeśli potrafisz łatwo przetestować swój komponent przez \`getByRole\` i \`getByLabelText\`, oznacza to, że Twoja aplikacja jest jednocześnie w 100% dostępna dla osób niewidomych korzystających z czytników ekranu!).*

**2. Trzy rodziny zapytań w RTL:**
- **\`getBy...\`** — zwraca element natychmiast lub rzuca błąd, jeśli go nie ma.
- **\`queryBy...\`** — zwraca \`null\`, jeśli elementu nie ma (idealne do asercji \`expect(screen.queryByText('Błąd')).not.toBeInTheDocument()\`).
- **\`findBy...\`** — zwraca \`Promise\` i czeka (domyślnie do 1000 ms), aż element pojawi się po zakończeniu asynchronicznego \`fetch\`!`,
        codeExamples: [
          {
            title: 'Mockowanie funkcji callback (vi.fn) przy testowaniu formularza',
            language: 'tsx',
            code: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, test, expect } from 'vitest';
import { NewsletterBox } from './NewsletterBox';

test('wywołuje onSubscribe z wpisanym adresem e-mail', async () => {
  const handleSubscribe = vi.fn();
  render(<NewsletterBox onSubscribe={handleSubscribe} />);

  await userEvent.type(screen.getByPlaceholderText('Twój e-mail...'), 'kursant@dev.pl');
  await userEvent.click(screen.getByRole('button', { name: 'Zapisz się' }));

  expect(handleSubscribe).toHaveBeenCalledTimes(1);
  expect(handleSubscribe).toHaveBeenCalledWith('kursant@dev.pl');
});`,
            explanation: 'Funkcja szpiegująca vi.fn() (Mock Function) pozwala sprawdzić, ile razy i z jakimi dokładnie argumentami komponent wywołał przekazaną mu funkcję.',
          },
        ],
        stepByStepGuide: [
          { step: 1, title: 'Wyrenderuj komponent funkcją render()', description: 'RTL tworzy wirtualne drzewo DOM (jsdom / happy-dom) w pamięci.' },
          { step: 2, title: 'Znajdź elementy przez screen.getByRole', description: 'Unikaj wybierania po klasach CSS lub strukturze divów.' },
          { step: 3, title: 'Użyj userEvent zamiast fireEvent', description: 'userEvent symuluje pełny cykl zdarzeń przeglądarki (hover, focus, keydown, input, keyup).' },
        ],
        interactiveExercise: {
          id: 'ex-tst-2',
          title: 'Wizualizacja testu komponentu z getByRole',
          instructions: 'Zbuduj kontener z klasą rtl-test-card, wstaw zapytanie <code>screen.getByRole("button", { name: /zapisz/i })</code> oraz wynik "Assertion: toBeInTheDocument() PASSED".',
          task: 'Utwórz widżet rtl-test-card prezentujący testowanie komponentów React.',
          starterCode: {
            html: '<!-- Zbuduj widżet testu RTL poniżej -->\n',
            css: '.rtl-test-card { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
            js: 'console.log("React Testing Library aktywne.");',
          },
          solutionCode: {
            html: '<div class="rtl-test-card">\n  <code>screen.getByRole("button", { name: /zapisz/i })</code>\n  <div>Assertion: toBeInTheDocument() PASSED</div>\n</div>',
            css: '.rtl-test-card { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
            js: 'console.log("React Testing Library aktywne.");',
          },
          hints: [
            'Użyj <div class="rtl-test-card">.',
            'Wstaw <code>screen.getByRole("button", { name: /zapisz/i })</code>.',
            'Dodaj tekst Assertion: toBeInTheDocument() PASSED.',
          ],
          rules: [
            { id: 'r1', description: 'Klasa rtl-test-card obecna', ruleType: 'html_contains', target: 'rtl-test-card' },
            { id: 'r2', description: 'Metoda screen.getByRole obecna', ruleType: 'html_contains', target: 'screen.getByRole' },
            { id: 'r3', description: 'Asercja toBeInTheDocument() PASSED obecna', ruleType: 'html_contains', target: 'toBeInTheDocument() PASSED' },
          ],
        },
        independentTask: {
          title: 'Test sprawdzający zniknięcie modala po kliknięciu Zamknij',
          instructions: 'Napisz scenariusz testowy, który klika przycisk "Zamknij" i weryfikuje, że nagłówek modala zniknął z drzewa DOM za pomocą metody screen.queryByRole("dialog").',
          expectedOutcome: 'Poprawne użycie queryBy do weryfikacji nieobecności elementu.',
          starterHint: 'expect(screen.queryByRole("dialog")).toBeNull();',
        },
        quiz: [
          {
            id: 'q-tst2-1',
            question: 'Której metody z React Testing Library należy użyć, jeśli chcemy sprawdzić, że dany element (np. komunikat błędu) NIE znajduje się aktualnie na ekranie?',
            options: [
              '`screen.queryBy...` (np. `expect(screen.queryByText("Błąd")).toBeNull()`), ponieważ `getBy...` natychmiast rzuca wyjątek, gdy nie znajdzie elementu',
              '`screen.getBy...`',
              '`document.write()`',
              '`window.alert()`',
            ],
            correctAnswer: 0,
            explanation: 'Metody z prefiksem queryBy zwracają null w przypadku braku dopasowania, dzięki czemu idealnie nadają się do asercji negatywnych (.toBeNull() / .not.toBeInTheDocument()).',
          },
        ],
        commonMistakes: [
          {
            mistake: 'Wyszukiwanie elementów w testach za pomocą klas Tailwinda `container.querySelector(".bg-indigo-600")`',
            whyItHappens: 'Przenoszenie nawyków z jQuery do testów automatycznych.',
            howToFix: 'Gdy grafik zmieni kolor przycisku z indigo na violet, Twój test przestanie działać, mimo że przycisk nadal działa poprawnie! Zawsze wyszukuj elementy po ich semantycznej roli (`getByRole`) lub tekście.',
            badCode: 'const btn = container.querySelector(".px-4.py-2.bg-blue-500");',
            goodCode: 'const btn = screen.getByRole("button", { name: /wyślij/i });',
          },
        ],
        practicalTask: {
          title: 'Przechwytywanie zapytań sieciowych z Mock Service Worker (MSW)',
          brief: 'Zapoznaj się z koncepcją biblioteki MSW, która przechwytuje zapytania fetch na poziomie sieciowym podczas testów integracyjnych bez modyfikowania kodu komponentów.',
          steps: ['Zdefiniuj handler http.get("/api/user", () => HttpResponse.json({ name: "Anna" }))', 'Wyrenderuj komponent pobierający dane', 'Użyj await screen.findByText("Anna")'],
          deliverable: 'Realistyczne testy integracyjne odporne na zmiany wewnętrznej implementacji.',
        },
        completionCriteria: [
          'Zrozumienie React Testing Library, getByRole/queryBy/findBy oraz vi.fn()',
          'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
          'Zaliczenie quizu z wynikiem minimum 80%',
        ],
      },
      {
        id: 'test-3',
        moduleId: 12,
        moduleTitle: 'Testowanie i Jakość Kodu',
        title: 'Testy End-to-End (E2E) w prawdziwej przeglądarce z Playwright oraz Bramki Jakości',
        slug: 'testowanie-e2e-playwright-automatyzacja-bramki-jakosci',
        durationMinutes: 45,
        xpReward: 90,
        order: 3,
        summary: 'Najwyższe piętro piramidy testów: poznaj narzędzie Playwright, które uruchamia prawdziwy silnik Chromium, Firefox i WebKit, klika po działającej aplikacji Full Stack, weryfikuje nawigację, robi zrzuty ekranu i wykrywa błędy konsoli.',
        objectives: [
          'Pisać kompletne scenariusze użytkownika End-to-End (E2E) w Playwright z automatycznym oczekiwaniem (Auto-Waiting)',
          'Weryfikować brak błędów w konsoli przeglądarki (page.on("pageerror")) oraz poprawność odpowiedzi sieciowych',
          'Konfigurować automatyczne bramki jakości (Husky pre-commit hooks, lint-staged, Typecheck) blokujące zepsuty kod',
        ],
        prerequisites: ['Testy jednostkowe i komponentowe'],
        theoryMarkdown: `Testy jednostkowe sprawdzają poszczególne śrubki, ale skąd mamy pewność, że cały samochód faktycznie jedzie, gdy połączymy frontend React, router, backend Express i bazę PostgreSQL? Do tego służą **testy End-to-End (E2E) w Playwright**!

**1. Dlaczego Playwright zdominował rynek testów E2E?**
- Uruchamia prawdziwe przeglądarki (**Chromium, Firefox, WebKit/Safari**) w trybie bezgłowym (Headless) w ułamku sekundy.
- Posiada wbudowany mechanizm **Auto-Waiting**: przed kliknięciem w przycisk automatycznie czeka, aż element pojawi się w DOM, stanie się widoczny i przestanie się animować (koniec ze sztucznym \`sleep(5000)\`!).
- Pozwala nagrywać wideo oraz pełny ślad wykonania (**Playwright Trace Viewer**) dla każdego nieudanego testu.

\`\`\`typescript
import { test, expect } from '@playwright/test';

test('użytkownik może ukończyć lekcję i zdobyć punkty XP', async ({ page }) => {
  // 1. Otwieramy działającą aplikację na porcie 3000:
  await page.goto('http://localhost:3000');

  // 2. Klikamy w moduł kursu:
  await page.getByRole('button', { name: /Rozpocznij naukę/i }).click();

  // 3. Sprawdzamy, czy załadował się widok lekcji i nagłówek:
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
\`\`\`

**2. Automatyczne Bramki Jakości (Quality Gates):**
W profesjonalnym projekcie żaden kod nie może trafić na gałąź \`main\`, jeśli nie przejdzie zestawu 3 automatycznych kontroli:
1. **Typecheck (\`tsc --noEmit\`):** Zero błędów typów TypeScript.
2. **Linter (\`eslint\`):** Zero nieużywanych zmiennych i błędów w tablicach zależności hooków.
3. **Test Suite (\`npm test\`):** Wszystkie testy jednostkowe i E2E świecą na zielono.`,
        codeExamples: [
          {
            title: 'Test E2E sprawdzający brak jakichkolwiek błędów w konsoli przeglądarki',
            language: 'typescript',
            code: `import { test, expect } from '@playwright/test';

test('aplikacja ładuje się bez błędów runtime i wyjątków w konsoli', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('http://localhost:3000');
  await expect(page.locator('main')).toBeVisible();

  // Gwarancja czystej konsoli bez ukrytych wyjątków JS:
  expect(errors).toEqual([]);
});`,
            explanation: 'Nasłuchiwanie zdarzeń pageerror oraz console.error w Playwright pozwala natychmiast wychwycić błędy renderowania lub brakujące zasoby.',
          },
        ],
        stepByStepGuide: [
          { step: 1, title: 'Skup testy E2E na ścieżkach krytycznych (Critical User Journeys)', description: 'Testuj rejestrację, logowanie, główny proces biznesowy i płatność.' },
          { step: 2, title: 'Korzystaj z asercji Web-First (await expect(locator).toBeVisible())', description: 'Pozwól Playwrightowi automatycznie poczekać na stabilizację UI.' },
          { step: 3, title: 'Podepnij sprawdzanie typów i testów przed commitem', description: 'Używaj skryptu npm run lint && npm test przed każdym git push.' },
        ],
        interactiveExercise: {
          id: 'ex-tst-3',
          title: 'Raport wykonania testów E2E Playwright',
          instructions: 'Zbuduj kontener z klasą playwright-report, wstaw znacznik <code>Playwright Chromium: 3/3 E2E Journeys Passed</code> oraz informację "Console Errors: 0 | Page Errors: 0".',
          task: 'Utwórz widżet playwright-report prezentujący pomyślny audyt przeglądarkowy.',
          starterCode: {
            html: '<!-- Zbuduj raport Playwright poniżej -->\n',
            css: '.playwright-report { background: #0f172a; border: 1px solid #38bdf8; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #38bdf8; font-family: monospace; font-weight: bold; }',
            js: 'console.log("Playwright E2E raport gotowy.");',
          },
          solutionCode: {
            html: '<div class="playwright-report">\n  <code>Playwright Chromium: 3/3 E2E Journeys Passed</code>\n  <div>Console Errors: 0 | Page Errors: 0</div>\n</div>',
            css: '.playwright-report { background: #0f172a; border: 1px solid #38bdf8; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #38bdf8; font-family: monospace; font-weight: bold; }',
            js: 'console.log("Playwright E2E raport gotowy.");',
          },
          hints: [
            'Użyj <div class="playwright-report">.',
            'Wstaw <code>Playwright Chromium: 3/3 E2E Journeys Passed</code>.',
            'Dodaj tekst Console Errors: 0 | Page Errors: 0.',
          ],
          rules: [
            { id: 'r1', description: 'Klasa playwright-report obecna', ruleType: 'html_contains', target: 'playwright-report' },
            { id: 'r2', description: 'Informacja Playwright Chromium obecna', ruleType: 'html_contains', target: 'Playwright Chromium' },
            { id: 'r3', description: 'Status Console Errors: 0 obecny', ruleType: 'html_contains', target: 'Console Errors: 0' },
          ],
        },
        independentTask: {
          title: 'Test responsywności mobilnej w Playwright',
          instructions: 'Napisz test Playwrighta, który ustawia rozmiar okna na smartfon za pomocą await page.setViewportSize({ width: 375, height: 812 }) i sprawdza, czy nie występuje poziomy pasek przewijania (Horizontal Overflow).',
          expectedOutcome: 'Automatyczna weryfikacja poprawnego układu RWD na ekranach mobilnych.',
          starterHint: 'const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth); expect(hasOverflow).toBe(false);',
        },
        quiz: [
          {
            id: 'q-tst3-1',
            question: 'Dlaczego w testach Playwright nie powinno się używać sztywnych opóźnień `await page.waitForTimeout(5000)`?',
            options: [
              'Ponieważ sztuczne czekanie drastycznie spowalnia wykonanie zestawu testów i powoduje niestabilność (Flaky Tests); zamiast tego Playwright posiada mechanizm Auto-Waiting oraz asercje `await expect(locator).toBeVisible()`, które ruszają dalej w ułamku sekundy, gdy tylko element jest gotowy',
              'Ponieważ funkcja ta kasuje ciasteczka przeglądarki',
              'Ponieważ Playwright nie obsługuje słowa kluczowego await',
              'Ponieważ maksymalny czas trwania testu to 1 sekunda',
            ],
            correctAnswer: 0,
            explanation: 'Inteligentne asercje Web-First w Playwright czekają dokładnie tyle milisekund, ile potrzeba na pojawienie się elementu.',
          },
        ],
        commonMistakes: [
          {
            mistake: 'Uzależnianie kolejnego testu E2E od stanu pozostawionego przez poprzedni test',
            whyItHappens: 'Pisanie testu nr 2 zakładającego, że użytkownik został już zalogowany w teście nr 1.',
            howToFix: 'Zasada **Test Isolation**: każdy test w Playwright otrzymuje zupełnie nowy, czysty kontekst przeglądarki (BrowserContext) i musi być w stanie wykonać się niezależnie oraz w dowolnej kolejności.',
            badCode: '// Test 2 zakłada, że koszyk z Testu 1 nadal ma produkty',
            goodCode: '// Każdy test sam przygotowuje swój stan początkowy (np. w beforeEach)',
          },
        ],
        practicalTask: {
          title: 'Konfiguracja skryptów jakości w package.json',
          brief: 'Sprawdź sekcję "scripts" w pliku package.json naszego projektu i zobacz, jak skonfigurowana jest komenda "lint": "tsc --noEmit".',
          steps: ['Otwórz package.json', 'Przeanalizuj skrypty build oraz lint', 'Zrozum rolę statycznej weryfikacji typów przed budowaniem paczki produkcyjnej'],
          deliverable: 'Kompletny warsztat zapewniania jakości oprogramowania (QA).',
        },
        completionCriteria: [
          'Zrozumienie testów E2E w Playwright i izolacji testów',
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
      {
        id: 'devops-2',
        moduleId: 13,
        moduleTitle: 'Deployment i DevOps — Wdrażanie na Produkcję',
        title: 'Serwer VPS Linux, Nginx jako Reverse Proxy, domeny DNS i darmowe HTTPS (Certbot)',
        slug: 'devops-vps-linux-nginx-reverse-proxy-dns-ssl-certbot',
        durationMinutes: 45,
        xpReward: 90,
        order: 2,
        summary: 'Jak wystawić swoją aplikację Node.js na świat pod własną domeną z zieloną kłódką HTTPS? Poznaj konfigurację zapory ogniowej UFW na Ubuntu Linux, rekordy DNS (A, CNAME), serwer Nginx w roli Reverse Proxy oraz automatyczne certyfikaty TLS z Let’s Encrypt.',
        objectives: [
          'Rozumieć dlaczego aplikacja Node.js na porcie 3000 powinna stać za serwerem Reverse Proxy (Nginx / Caddy)',
          'Konfigurować rekordy DNS (Rekord A wskazujący na IP serwera oraz CNAME dla subdomen)',
          'Zabezpieczać serwer Linux (logowanie wyłącznie kluczem SSH, firewall UFW otwierający tylko porty 22, 80 i 443)',
        ],
        prerequisites: ['Podstawy terminala Linux i Docker'],
        theoryMarkdown: `Twój serwer Express nasłuchuje na porcie \`3000\`. Jednak użytkownicy wpisujący w przeglądarce \`https://twojadomena.pl\` łączą się domyślnie z portem **\`443\` (HTTPS)** lub **\`80\` (HTTP)**. Zamiast wystawiać proces Node.js bezpośrednio na ruch z internetu, stawiamy przed nim pancerny serwer **Nginx** działający jako **Reverse Proxy**!

**1. Co daje Nginx przed serwerem Node.js?**
- **Terminacja SSL/TLS:** Nginx obsługuje certyfikaty HTTPS i szyfrowanie, przekazując ruch do lokalnego portu \`127.0.0.1:3000\`.
- **Kompresja Gzip / Brotli i serwowanie plików statycznych:** Błyskawicznie wysyła obrazy i paczki CSS/JS bez angażowania wątku Node.js.
- **Load Balancing i ochrona:** Może rozdzielać ruch na kilka kontenerów i blokować podejrzane żądania.

\`\`\`nginx
# /etc/nginx/sites-available/aplikacja.conf
server {
    listen 80;
    server_name twojadomena.pl www.twojadomena.pl;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
\`\`\`

**2. Darmowy certyfikat SSL/TLS (HTTPS) jednym poleceniem:**
Narzędzie **Certbot** (Let's Encrypt) automatycznie weryfikuje domenę, pobiera certyfikat, modyfikuje plik konfiguracyjny Nginxa i ustawia przekierowanie 301 z HTTP na HTTPS:
\`\`\`bash
sudo certbot --nginx -d twojadomena.pl -d www.twojadomena.pl
\`\`\`

**3. Utwardzenie bezpieczeństwa serwera VPS (Firewall UFW):**
\`\`\`bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh      # Port 22
sudo ufw allow 'Nginx Full' # Porty 80 i 443 (port 3000 pozostaje ukryty dla świata!)
sudo ufw enable
\`\`\``,
        codeExamples: [
          {
            title: 'Konfiguracja rekordów DNS u rejestratora domeny (np. Cloudflare)',
            language: 'bash',
            code: `# Typ   Nazwa (Host)   Wartość (Target)         TTL
A       @              203.0.113.45             Auto   # Główna domena -> adres IPv4 serwera VPS
CNAME   www            twojadomena.pl           Auto   # Subdomena www -> wskazuje na domenę główną
A       api            203.0.113.45             Auto   # Subdomena api.twojadomena.pl`,
            explanation: 'Rekord A tłumaczy nazwę domeny na adres IPv4 serwera, natomiast rekord CNAME tworzy alias wskazujący na inną nazwę domenową.',
          },
        ],
        stepByStepGuide: [
          { step: 1, title: 'Skieruj rekord A domeny na adres IP swojego serwera VPS', description: 'Sprawdź propagację poleceniem dig twojadomena.pl.' },
          { step: 2, title: 'Skonfiguruj blok server w Nginx z proxy_pass', description: 'Przetestuj poprawność składni komendą sudo nginx -t && sudo systemctl reload nginx.' },
          { step: 3, title: 'Wygeneruj certyfikat HTTPS przez Certbota', description: 'Certbot sam skonfiguruje automatyczne odnawianie certyfikatu co 90 dni.' },
        ],
        interactiveExercise: {
          id: 'ex-devops-2',
          title: 'Schemat przepływu ruchu przez Nginx Reverse Proxy',
          instructions: 'Zbuduj kontener z klasą nginx-proxy, wstaw ścieżkę <code>Client (HTTPS :443) -&gt; Nginx -&gt; Node.js (:3000)</code> oraz status "Firewall UFW: Active | SSL: Let\'s Encrypt".',
          task: 'Utwórz widżet nginx-proxy prezentujący architekturę sieciową serwera produkcyjnego.',
          starterCode: {
            html: '<!-- Zbuduj schemat Reverse Proxy poniżej -->\n',
            css: '.nginx-proxy { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
            js: 'console.log("Nginx Reverse Proxy skonfigurowane.");',
          },
          solutionCode: {
            html: '<div class="nginx-proxy">\n  <code>Client (HTTPS :443) -&gt; Nginx -&gt; Node.js (:3000)</code>\n  <div>Firewall UFW: Active | SSL: Let\'s Encrypt</div>\n</div>',
            css: '.nginx-proxy { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
            js: 'console.log("Nginx Reverse Proxy skonfigurowane.");',
          },
          hints: [
            'Użyj <div class="nginx-proxy">.',
            'Wstaw <code>Client (HTTPS :443) -&gt; Nginx -&gt; Node.js (:3000)</code>.',
            'Dodaj tekst Firewall UFW: Active | SSL: Let\'s Encrypt.',
          ],
          rules: [
            { id: 'r1', description: 'Klasa nginx-proxy obecna', ruleType: 'html_contains', target: 'nginx-proxy' },
            { id: 'r2', description: 'Przepływ Nginx -> Node.js (:3000) obecny', ruleType: 'html_contains', target: 'Node.js (:3000)' },
            { id: 'r3', description: 'Status Firewall UFW: Active obecny', ruleType: 'html_contains', target: 'Firewall UFW: Active' },
          ],
        },
        independentTask: {
          title: 'Konfiguracja app.set("trust proxy", 1) w Expressie',
          instructions: 'Dowiedz się, dlaczego po postawieniu Expressa za Nginxem należy dodać linijkę app.set("trust proxy", 1), aby req.ip oraz rate-limiter widziały prawdziwy adres IP klienta, a nie 127.0.0.1.',
          expectedOutcome: 'Prawidłowe działanie limitera zapytań i ciasteczek Secure za Reverse Proxy.',
          starterHint: 'app.set("trust proxy", 1); // Ufa nagłówkowi X-Forwarded-For od Nginxa',
        },
        quiz: [
          {
            id: 'q-dop2-1',
            question: 'Co stałoby się z ogranicznikiem zapytań (`express-rate-limit`), gdyby serwer Express działał za Nginxem bez ustawienia `app.set("trust proxy", 1)`?',
            options: [
              'Express widziałby wszystkie przychodzące zapytania jako pochodzące z tego samego lokalnego adresu IP Nginxa (`127.0.0.1`), przez co zablokowałby dostęp wszystkim użytkownikom naraz po przekroczeniu puli zapytań',
              'Nginx przestałby obsługiwać certyfikaty SSL',
              'Baza danych zostałaby odłączona',
              'Nic by się nie stało',
            ],
            correctAnswer: 0,
            explanation: 'Ustawienie trust proxy mówi Expressowi, aby odczytywał prawdziwy adres IP klienta z nagłówka X-Forwarded-For przekazanego przez zaufany serwer Reverse Proxy.',
          },
        ],
        commonMistakes: [
          {
            mistake: 'Otwieranie portu bazy danych PostgreSQL (`5432`) na cały świat (`0.0.0.0/0`) w zaporze ogniowej serwera',
            whyItHappens: 'Chęć szybkiego podłączenia się do bazy z domowego programu pgAdmin bez tunelu SSH.',
            howToFix: 'Otwarty port 5432 zostanie w ciągu kilku minut zaatakowany przez boty próbujące złamać hasło. Baza danych powinna nasłuchiwać wyłącznie w sieci prywatnej / localhost, a dostęp administracyjny wykonuj przez bezpieczny tunel SSH!',
            badCode: 'sudo ufw allow 5432/tcp # Niebezpieczne wystawienie bazy na świat!',
            goodCode: '# Port 5432 zamknięty z zewnątrz; połączenie przez ssh -L 5432:localhost:5432 user@vps',
          },
        ],
        practicalTask: {
          title: 'Weryfikacja konfiguracji Nginx przed przeładowaniem',
          brief: 'Poznaj bezpieczną procedurę edycji konfiguracji serwera WWW na produkcji bez ryzyka wyłączenia działających stron.',
          steps: ['Edytuj plik w /etc/nginx/sites-available/', 'Zawsze uruchom sudo nginx -t w celu walidacji składni', 'Wykonaj bezprzestojowe przeładowanie sudo systemctl reload nginx'],
          deliverable: 'Bezpieczne administrowanie serwerem produkcyjnym Linux.',
        },
        completionCriteria: [
          'Zrozumienie roli Nginx Reverse Proxy, DNS, HTTPS i zapory UFW',
          'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
          'Zaliczenie quizu z wynikiem minimum 80%',
        ],
      },
      {
        id: 'devops-3',
        moduleId: 13,
        moduleTitle: 'Deployment i DevOps — Wdrażanie na Produkcję',
        title: 'Monitoring na produkcji, Kopie zapasowe (pg_dump), PWA i Publikacja w Google Play (TWA)',
        slug: 'devops-monitoring-sentry-backup-pgdump-pwa-google-play-twa',
        durationMinutes: 45,
        xpReward: 95,
        order: 3,
        summary: 'Wdrożenie to dopiero początek życia aplikacji! Dowiedz się, jak automatycznie wykonywać codzienne kopie zapasowe bazy PostgreSQL (pg_dump), monitorować błędy u użytkowników w czasie rzeczywistym oraz jak przekształcić aplikację webową PWA w natywny pakiet APK/AAB do sklepu Google Play.',
        objectives: [
          'Automatyzować codzienne zaszyfrowane kopie zapasowe bazy PostgreSQL za pomocą pg_dump i zadań Cron',
          'Konfigurować Web App Manifest (manifest.json) oraz Service Workera dla pełnej instalacji PWA (Progressive Web App)',
          'Zrozumieć proces pakowania aplikacji PWA jako Trusted Web Activity (TWA / Bubblewrap) do publikacji w Google Play Store',
        ],
        prerequisites: ['Docker, Nginx i architektura Full Stack'],
        theoryMarkdown: `**1. Zasada 3-2-1 Kopii Zapasowych Bazy Danych (\`pg_dump\`):**
Awaria dysku lub ludzka pomyłka może zdarzyć się w każdej firmie. Profesjonalny inżynier automatyzuje codzienne zrzuty bazy PostgreSQL i wysyła je do zewnętrznej chmury obiektowej:
\`\`\`bash
# Zrzut skompresowanej bazy danych z datą w nazwie pliku:
pg_dump -U postgres -Fc moja_baza > backup_$(date +%F).dump

# Odtworzenie bazy z kopii zapasowej ( zawsze testuj odtwarzanie! ):
pg_restore -U postgres -d moja_baza backup_2026-10-23.dump
\`\`\`

**2. Progressive Web App (PWA) — Aplikacja webowa instalowana jak natywna:**
Dzięki plikowi **\`manifest.json\`** oraz **Service Workerowi (\`sw.js\`)** Twoja aplikacja React może zostać zainstalowana na ekranie głównym telefonu z Androidem i iOS, działać na pełnym ekranie (\`"display": "standalone"\`) i wyświetlać powiadomienia Push!

**3. Publikacja w sklepie Google Play za pomocą Trusted Web Activity (TWA / Bubblewrap):**
Google oficjalnie wspiera umieszczanie aplikacji PWA w sklepie Google Play przy użyciu technologii **TWA (Trusted Web Activity)**:
1. Narzędzie **\`@bubblewrap/cli\`** generuje natywny projekt Androida, który uruchamia Twoją stronę w pełnoekranowym silniku Chrome bez paska adresu.
2. Plik **\`/.well-known/assetlinks.json\`** umieszczony na Twoim serwerze potwierdza kryptograficznie (przez odcisk klucza SHA-256), że jesteś właścicielem zarówno domeny WWW, jak i aplikacji Android.
3. Podpisany pakiet **\`.aab\` (Android App Bundle)** wgrywasz bezpośrednio do Google Play Console!`,
        codeExamples: [
          {
            title: 'Plik weryfikacji Digital Asset Links (/.well-known/assetlinks.json)',
            language: 'json',
            code: `[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "pl.akademia.fullstack",
    "sha256_cert_fingerprints": [
      "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"
    ]
  }
}]`,
            explanation: 'Dzięki obecności pliku assetlinks.json pod adresem https://twojadomena.pl/.well-known/assetlinks.json system Android ukrywa pasek adresu przeglądarki i traktuje aplikację TWA jak 100% natywną.',
          },
        ],
        stepByStepGuide: [
          { step: 1, title: 'Skonfiguruj automatyczny cron z pg_dump', description: 'Uruchamiaj zrzut bazy codziennie o 03:00 w nocy i przechowuj kopie z ostatnich 30 dni.' },
          { step: 2, title: 'Zadbaj o manifest.json i ikony 192x192 oraz 512x512', description: 'Zapewnij obsługę trybu standalone i maskowalnych ikon Androida.' },
          { step: 3, title: 'Zbuduj pakiet AAB/APK przez Bubblewrap', description: 'Użyj wbudowanego w naszą Akademię kreatora Google Play APK/AAB.' },
        ],
        interactiveExercise: {
          id: 'ex-devops-3',
          title: 'Panel statusu Backupów, PWA i Google Play TWA',
          instructions: 'Zbuduj kontener z klasą prod-readiness, wstaw znacznik <code>Daily Backup: pg_dump OK | PWA: Installable</code> oraz status "Google Play TWA (assetlinks.json): Verified".',
          task: 'Utwórz widżet prod-readiness potwierdzający gotowość mobilną i produkcyjną.',
          starterCode: {
            html: '<!-- Zbuduj panel gotowości produkcyjnej poniżej -->\n',
            css: '.prod-readiness { background: #0f172a; border: 1px solid #38bdf8; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #38bdf8; font-family: monospace; font-weight: bold; }',
            js: 'console.log("Production & Mobile TWA gotowe.");',
          },
          solutionCode: {
            html: '<div class="prod-readiness">\n  <code>Daily Backup: pg_dump OK | PWA: Installable</code>\n  <div>Google Play TWA (assetlinks.json): Verified</div>\n</div>',
            css: '.prod-readiness { background: #0f172a; border: 1px solid #38bdf8; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #38bdf8; font-family: monospace; font-weight: bold; }',
            js: 'console.log("Production & Mobile TWA gotowe.");',
          },
          hints: [
            'Użyj <div class="prod-readiness">.',
            'Wstaw <code>Daily Backup: pg_dump OK | PWA: Installable</code>.',
            'Dodaj tekst Google Play TWA (assetlinks.json): Verified.',
          ],
          rules: [
            { id: 'r1', description: 'Klasa prod-readiness obecna', ruleType: 'html_contains', target: 'prod-readiness' },
            { id: 'r2', description: 'Status pg_dump OK obecny', ruleType: 'html_contains', target: 'pg_dump OK' },
            { id: 'r3', description: 'Weryfikacja assetlinks.json obecna', ruleType: 'html_contains', target: 'assetlinks.json' },
          ],
        },
        independentTask: {
          title: 'Wyrażenie Cron dla nocnej kopii zapasowej',
          instructions: 'Zapisz 5-polowe wyrażenie harmonogramu Cron (`minuta godzina dzień_miesiąca miesiąc dzień_tygodnia`), które uruchamia skrypt backupu codziennie dokładnie o godzinie 02:30 w nocy.',
          expectedOutcome: 'Poprawna składnia tablicy crontab w systemie Linux.',
          starterHint: '30 2 * * * /usr/local/bin/backup-db.sh',
        },
        quiz: [
          {
            id: 'q-dop3-1',
            question: 'Jaka jest rola pliku `/.well-known/assetlinks.json` podczas publikowania aplikacji webowej PWA w sklepie Google Play jako Trusted Web Activity (TWA)?',
            options: [
              'Potwierdza kryptograficznie powiązanie między Twoją domeną internetową a podpisem cyfrowym SHA-256 aplikacji Android, dzięki czemu Chrome ukrywa górny pasek adresu URL i wyświetla aplikację w trybie pełnoekranowym',
              'Służy do zmiany tapety na telefonie użytkownika',
              'Zawiera bazę haseł wszystkich użytkowników',
              'Wyłącza połączenie z internetem',
            ],
            correctAnswer: 0,
            explanation: 'Bez poprawnego pliku assetlinks.json aplikacja TWA otworzy się z widocznym paskiem przeglądarki u góry ekranu.',
          },
        ],
        commonMistakes: [
          {
            mistake: 'Wykonywanie automatycznych kopii zapasowych bazy danych na ten sam dysk twardy, na którym działa baza, bez testowania ich odtwarzania',
            whyItHappens: 'Zapisywanie plików .sql do lokalnego katalogu /var/backups na tym samym serwerze VPS.',
            howToFix: 'Gdy ulegnie awarii dysk serwera VPS, stracisz zarówno bazę, jak i wszystkie backupy! Zawsze wysyłaj zrzuty na zewnętrzny serwer lub do chmury obiektowej (S3 / Backblaze) i regularnie testuj `pg_restore`.',
            badCode: 'pg_dump db > /home/ubuntu/backup.sql # Na tym samym dysku!',
            goodCode: 'pg_dump db | gzip | aws s3 cp - s3://moje-backupy/db-$(date +%F).sql.gz',
          },
        ],
        practicalTask: {
          title: 'Przetestuj generator pakietu Google Play APK/AAB w Akademii',
          brief: 'Przejdź do zakładki "Google Play APK" w górnym menu naszej aplikacji, pobierz gotowy pakiet startowy TWA i sprawdź wygenerowane pliki konfiguracyjne.',
          steps: ['Kliknij przycisk Google Play APK w nawigacji', 'Sprawdź konfigurację twa-manifest.json oraz assetlinks.json', 'Pobierz paczkę ZIP lub skrypt automatycznego budowania'],
          deliverable: 'Praktyczna umiejętność przygotowania aplikacji PWA do sklepu Google Play.',
        },
        completionCriteria: [
          'Zrozumienie kopii zapasowych pg_dump, PWA oraz publikacji TWA w Google Play',
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
    {
      id: 'next-2',
      moduleId: 14,
      moduleTitle: 'Zaawansowany Full Stack — Next.js, WebSockets i Cache',
      title: 'Komunikacja czasu rzeczywistego (Real-Time): WebSockets, Socket.io i Server-Sent Events',
      slug: 'zaawansowany-websockets-socketio-realtime-sse',
      durationMinutes: 45,
      xpReward: 95,
      order: 2,
      summary: 'Jak budować czaty na żywo, tablice współpracy (Multiplayer Canvas), powiadomienia natychmiastowe i kursy giełdowe? Poznaj dwukierunkowy protokół WebSocket (ws:// / wss://), pokoje (Rooms) w Socket.io oraz jednokierunkowe strumienie Server-Sent Events (SSE).',
      objectives: [
        'Rozróżniać klasyczny model żądanie-odpowiedź HTTP od trwałego, dwukierunkowego połączenia TCP w WebSockets',
        'Projektować architekturę zdarzeniową (Event-Driven) z podziałem na pokoje (Rooms) w bibliotece Socket.io',
        'Dbać o poprawne czyszczenie nasłuchiwaczy zdarzeń (socket.off) w hooku useEffect w React',
      ],
      prerequisites: ['React useEffect oraz serwer Node.js'],
      theoryMarkdown: `W klasycznym protokole HTTP serwer nie może sam z siebie zainicjować wiadomości do przeglądarki — musi czekać, aż klient wyśle zapytanie. Odpytywanie serwera co sekundę w pętli (\`setInterval(fetch, 1000)\`, tzw. **Short Polling**) generuje gigantyczne obciążenie sieciowe.

**1. Protokół WebSocket (\`wss://\`) — Trwały, dwukierunkowy tunel:**
Połączenie zaczyna się od zwykłego żądania HTTP z nagłówkiem \`Upgrade: websocket\` (**Handshake**). Po akceptacji(status \`101 Switching Protocols\`) połączenie TCP zostaje otwarte na stałe — zarówno serwer, jak i klient mogą wysyłać do siebie ramki danych w czasie poniżej **2 milisekund**!

**2. Pokoje (Rooms) i rozgłaszanie (Broadcasting) w Socket.io:**
\`\`\`typescript
// Serwer Node.js (Socket.io):
io.on('connection', (socket) => {
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    // Wyślij informację do wszystkich w pokoju OPRÓCZ nadawcy:
    socket.to(roomId).emit('user-joined', { userId: socket.id });
  });

  socket.on('send-message', ({ roomId, text }) => {
    // Wyślij wiadomość do WSZYSTKICH uczestników danego pokoju:
    io.to(roomId).emit('new-message', { id: crypto.randomUUID(), text, sender: socket.id });
  });
});
\`\`\`

**3. Integracja z Reactem — Pamiętaj o \`socket.off\`!**
\`\`\`tsx
useEffect(() => {
  const onNewMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  socket.on('new-message', onNewMessage);
  return () => {
    // Krytyczne: odpinamy listener przy odmontowaniu, by nie duplikować wiadomości!
    socket.off('new-message', onNewMessage);
  };
}, []);
\`\`\``,
      codeExamples: [
        {
          title: 'Server-Sent Events (SSE) — Lekka alternatywa dla jednokierunkowego streamingu',
          language: 'typescript',
          code: `// Gdy tylko serwer musi strumieniować dane do klienta (np. postęp generowania raportu):
app.get('/api/stream-progress', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const interval = setInterval(() => {
    res.write(\`data: \${JSON.stringify({ progress: 50 })}\\n\\n\`);
  }, 1000);

  req.on('close', () => clearInterval(interval));
});`,
          explanation: 'Server-Sent Events (EventSource w przeglądarce) działają po standardowym HTTP, automatycznie wznawiają połączenie i są idealne, gdy klient nie musi wysyłać strumienia z powrotem.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Używaj serwera autorytatywnego (Server-Authoritative State)', description: 'Klienci wysyłają intencje (np. "chcę wykonać ruch"), a serwer waliduje je i rozsyła nowy stan.' },
        { step: 2, title: 'Grupuj połączenia w pokoje (Rooms)', description: 'Nie rozsyłaj wiadomości z prywatnego czatu do wszystkich 10 000 podłączonych użytkowników.' },
        { step: 3, title: 'Zawsze odpinaj listenery w funkcji czyszczącej useEffect', description: 'Używaj socket.off("event", handler).' },
      ],
      interactiveExercise: {
        id: 'ex-nxt-2',
        title: 'Monitor połączenia WebSocket Real-Time',
        instructions: 'Zbuduj kontener z klasą ws-monitor, wstaw znacznik <code>wss://api.app.pl (101 Switching Protocols)</code> oraz status "Room: #typescript-study | Latency: 4ms".',
        task: 'Utwórz widżet ws-monitor prezentujący aktywne połączenie WebSocket.',
        starterCode: {
          html: '<!-- Zbuduj monitor WebSocket poniżej -->\n',
          css: '.ws-monitor { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
          js: 'console.log("WebSocket tunel aktywny.");',
        },
        solutionCode: {
          html: '<div class="ws-monitor">\n  <code>wss://api.app.pl (101 Switching Protocols)</code>\n  <div>Room: #typescript-study | Latency: 4ms</div>\n</div>',
          css: '.ws-monitor { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
          js: 'console.log("WebSocket tunel aktywny.");',
        },
        hints: [
          'Użyj <div class="ws-monitor">.',
          'Wstaw <code>wss://api.app.pl (101 Switching Protocols)</code>.',
          'Dodaj tekst Room: #typescript-study | Latency: 4ms.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa ws-monitor obecna', ruleType: 'html_contains', target: 'ws-monitor' },
          { id: 'r2', description: 'Status 101 Switching Protocols obecny', ruleType: 'html_contains', target: '101 Switching Protocols' },
          { id: 'r3', description: 'Pokój #typescript-study obecny', ruleType: 'html_contains', target: '#typescript-study' },
        ],
      },
      independentTask: {
        title: 'Wskaźnik "Użytkownik pisze..." (Typing Indicator) z Debounce',
        instructions: 'Zaprojektuj logikę wysyłającą zdarzenie socket.emit("typing-start") podczas pisania w polu czatu oraz automatyczne socket.emit("typing-stop") po 1.5 sekundy bezczynności.',
        expectedOutcome: 'Płynny wskaźnik aktywności rozmówcy znany z komunikatorów Slack i Discord.',
        starterHint: 'Użyj setTimeout resetowanego przy każdym naciśnięciu klawisza.',
      },
      quiz: [
        {
          id: 'q-nxt2-1',
          question: 'Czym różni się wywołanie `io.to(roomId).emit(...)` od `socket.to(roomId).emit(...)` w bibliotece Socket.io?',
          options: [
            '`io.to(roomId).emit` wysyła wiadomość do wszystkich klientów w pokoju włącznie z nadawcą, natomiast `socket.to(roomId).emit` wysyła ją do wszystkich w pokoju OPRÓCZ klienta, który nadał zdarzenie',
            'Nie ma między nimi żadnej różnicy',
            '`socket.to` działa tylko na serwerach Windows',
            '`io.to` zamyka połączenie z bazą danych',
          ],
          correctAnswer: 0,
          explanation: 'Rozróżnienie to jest kluczowe np. przy powiadomieniach "Jan dołączył do pokoju", których sam Jan nie musi otrzymywać.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Tworzenie nowej instancji połączenia `const socket = io()` bezpośrednio wewnątrz ciała komponentu React przy każdym renderze',
          whyItHappens: 'Umieszczenie inicjalizacji klienta WebSocket wewnątrz funkcji komponentu bez hooka lub modułu zewnętrznego.',
          howToFix: 'Spowoduje to otwarcie setek równoległych połączeń TCP przy każdym wpisaniu znaku w formularzu! Inicjalizuj instancję socketu jako singleton poza komponentem lub w dedykowanym Context Providerze.',
          badCode: 'function Chat() { const socket = io(); ... } // Nowe połączenie przy każdym renderze!',
          goodCode: 'import { socket } from "@/lib/socket"; // Pojedyncza współdzielona instancja',
        },
      ],
      practicalTask: {
        title: 'Architektura tablicy Kanban w czasie rzeczywistym',
        brief: 'Zaprojektuj zestaw zdarzeń WebSocket dla współdzielonej tablicy zadań: card:moved, card:created oraz user:cursor-moved.',
        steps: ['Zdefiniuj strukturę payloadu TypeScript dla każdego zdarzenia', 'Uwzględnij walidację uprawnień do tablicy po stronie serwera', 'Obsłuż ponowne połączenie (reconnection) po utracie zasięgu'],
        deliverable: 'Kompletny protokół komunikacji czasu rzeczywistego.',
      },
      completionCriteria: [
        'Zrozumienie protokołu WebSocket, pokoi Socket.io i SSE',
        'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
        'Zaliczenie quizu z wynikiem minimum 80%',
      ],
    },
    {
      id: 'next-3',
      moduleId: 14,
      moduleTitle: 'Zaawansowany Full Stack — Next.js, WebSockets i Cache',
      title: 'Pamięć podręczna Redis, kolejki zadań w tle (BullMQ) i optymalizacja wydajności (Web Vitals)',
      slug: 'zaawansowany-redis-cache-kolejki-bullmq-web-vitals',
      durationMinutes: 45,
      xpReward: 95,
      order: 3,
      summary: 'Jak obsłużyć 50 000 użytkowników jednocześnie przy minimalnym obciążeniu bazy PostgreSQL? Poznaj superszybką bazę w pamięci RAM — Redis (wzorzec Cache-Aside z TTL), kolejki zadań w tle (Background Jobs) oraz metryki Core Web Vitals (LCP, INP, CLS).',
      objectives: [
        'Stosować wzorzec Cache-Aside w bazie Redis z czasem wygasania klucza TTL (Time-To-Live)',
        'Odciążać główne zapytania HTTP poprzez delegowanie ciężkich operacji (generowanie PDF, wysyłka 1000 maili) do kolejek zadań w tle',
        'Optymalizować metryki Core Web Vitals (LCP, INP, CLS) oraz rozmiar paczki JavaScript (Code Splitting)',
      ],
      prerequisites: ['Bazy danych SQL i architektura backendu'],
      theoryMarkdown: `Nawet najlepiej zindeksowana baza PostgreSQL zapisuje dane na dysku SSD. Kiedy ten sam ranking kursantów lub lista popularnych produktów jest pobierana 500 razy na sekundę, umieszczamy wynik w pamięci RAM za pomocą bazy **Redis** (czas odczytu poniżej **0.1 milisekundy**!).

**1. Wzorzec Cache-Aside z czasem życia TTL (Time-To-Live):**
\`\`\`typescript
async function getLeaderboard() {
  const CACHE_KEY = 'leaderboard:top100';

  // 1. Sprawdzamy, czy wynik jest już w pamięci RAM (Redis):
  const cached = await redis.get(CACHE_KEY);
  if (cached) {
    return JSON.parse(cached); // Odczyt w 0.1 ms (Cache HIT!)
  }

  // 2. Jeśli nie ma (Cache MISS), odpytujemy bazę PostgreSQL:
  const freshData = await prisma.user.findMany({
    orderBy: { xp: 'desc' },
    take: 100,
  });

  // 3. Zapisujemy w Redisie z czasem wygaśnięcia 60 sekund (EX 60):
  await redis.set(CACHE_KEY, JSON.stringify(freshData), 'EX', 60);
  return freshData;
}
\`\`\`

**2. Kolejki zadań w tle (Background Workers / BullMQ):**
Użytkownik klikający "Wygeneruj certyfikat PDF i wyślij na e-mail" nie powinien patrzeć na kręcący się spinner przez 15 sekund.
- Endpoint HTTP w **10 ms** wrzuca zadanie do kolejki w Redisie (\`queue.add('generate-pdf', { userId })\`) i od razu odpowiada statusem \`202 Accepted\`.
- Osobny proces **Worker** pobiera zadania z kolejki i spokojnie przetwarza je w tle, obsługując automatyczne ponowienia (Retries) w razie chwilowego błędu!

**3. Trzy filary wydajności frontendu — Core Web Vitals:**
- **LCP (Largest Contentful Paint < 2.5s):** Szybkość wyrenderowania głównego elementu widoku.
- **INP (Interaction to Next Paint < 200ms):** Czas reakcji interfejsu na kliknięcie użytkownika.
- **CLS (Cumulative Layout Shift < 0.1):** Stabilność wizualna (brak skakania elementów podczas ładowania obrazków — zawsze podawaj \`width\` i \`height\`!).`,
      codeExamples: [
        {
          title: 'Inwalidacja (czyszczenie) klucza w Redisie po aktualizacji danych',
          language: 'typescript',
          code: `async function updateCoursePrice(courseId: string, newPrice: number) {
  // 1. Aktualizujemy źródło prawdy w PostgreSQL:
  const updated = await prisma.course.update({
    where: { id: courseId },
    data: { price: newPrice },
  });

  // 2. Natychmiast usuwamy przeterminowany wpis z Redisa:
  await redis.del(\`course:details:\${courseId}\`);
  await redis.del('courses:catalog:all');

  return updated;
}`,
          explanation: 'Połączenie krótkiego czasu TTL z jawnym usuwaniem klucza (redis.del) przy edycji danych gwarantuje, że użytkownicy zawsze widzą aktualne ceny.',
        },
      ],
      stepByStepGuide: [
        { step: 1, title: 'Zawsze ustawiaj czas wygaśnięcia TTL (EX) w Redisie', description: 'Klucze bez TTL zaśmiecają pamięć RAM i prowadzą do wyświetlania nieaktualnych danych.' },
        { step: 2, title: 'Przenoś zadania trwające > 500ms do kolejki w tle', description: 'Wysyłka maili, obróbka wideo i raporty PDF należą do Background Workera.' },
        { step: 3, title: 'Rezerwuj wymiary dla obrazków i szkieletów ładowania', description: 'Zapobiegniesz przesunięciom układu strony (CLS = 0).' },
      ],
      interactiveExercise: {
        id: 'ex-nxt-3',
        title: 'Panel telemetrii Redis Cache & Core Web Vitals',
        instructions: 'Zbuduj kontener z klasą redis-vitals, wstaw informację <code>Redis Cache HIT: 0.2ms (TTL: 60s)</code> oraz metryki "Web Vitals: LCP 1.1s | CLS 0.00".',
        task: 'Utwórz widżet redis-vitals prezentujący optymalizację backendu i frontendu.',
        starterCode: {
          html: '<!-- Zbuduj panel Redis & Web Vitals poniżej -->\n',
          css: '.redis-vitals { background: #0f172a; border: 1px solid #f59e0b; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #fbbf24; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Redis Cache & Web Vitals aktywne.");',
        },
        solutionCode: {
          html: '<div class="redis-vitals">\n  <code>Redis Cache HIT: 0.2ms (TTL: 60s)</code>\n  <div>Web Vitals: LCP 1.1s | CLS 0.00</div>\n</div>',
          css: '.redis-vitals { background: #0f172a; border: 1px solid #f59e0b; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #fbbf24; font-family: monospace; font-weight: bold; }',
          js: 'console.log("Redis Cache & Web Vitals aktywne.");',
        },
        hints: [
          'Użyj <div class="redis-vitals">.',
          'Wstaw <code>Redis Cache HIT: 0.2ms (TTL: 60s)</code>.',
          'Dodaj tekst Web Vitals: LCP 1.1s | CLS 0.00.',
        ],
        rules: [
          { id: 'r1', description: 'Klasa redis-vitals obecna', ruleType: 'html_contains', target: 'redis-vitals' },
          { id: 'r2', description: 'Informacja Redis Cache HIT obecna', ruleType: 'html_contains', target: 'Redis Cache HIT' },
          { id: 'r3', description: 'Metryka CLS 0.00 obecna', ruleType: 'html_contains', target: 'CLS 0.00' },
        ],
      },
      independentTask: {
        title: 'Uniwersalny wrapper getOrSetCache<T>',
        instructions: 'Napisz generyczną funkcję getOrSetCache<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T>, która automatyzuje wzorzec Cache-Aside dla dowolnego zapytania.',
        expectedOutcome: 'Jednolinijkowe buforowanie dowolnej funkcji serwisowej w projekcie.',
        starterHint: 'const cached = await redis.get(key); if (cached) return JSON.parse(cached) as T;',
      },
      quiz: [
        {
          id: 'q-nxt3-1',
          question: 'Co mierzy metryka CLS (Cumulative Layout Shift) wchodząca w skład wskaźników Google Core Web Vitals?',
          options: [
            'Stabilność wizualną strony — sprawdza, czy elementy interfejsu (np. przyciski i tekst) nie przesuwają się niespodziewanie po ekranie w trakcie doczytywania obrazków lub czcionek',
            'Zużycie baterii przez kartę graficzną',
            'Liczbę plików CSS w projekcie',
            'Prędkość obrotową wentylatora serwera',
          ],
          correctAnswer: 0,
          explanation: 'Niski wskaźnik CLS (poniżej 0.1) zapobiega irytującym sytuacjom, w których strona "przeskakuje" ułamek sekundy przed kliknięciem użytkownika.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Traktowanie pamięci podręcznej Redis jako jedynego miejsca zapisu krytycznych danych bez trwałej bazy SQL',
          whyItHappens: 'Zachłyśnięcie się szybkością operacji w pamięci RAM.',
          howToFix: 'Pamięć podręczna (Cache) z założenia może zostać wyczyszczona w każdej chwili. Źródłem prawdy (Source of Truth) zawsze musi być trwała baza danych (np. PostgreSQL), a Redis służy do przyspieszania odczytów i obsługi kolejek.',
          badCode: '// Zapis zamówień klientów wyłącznie w kluczu cache z TTL',
          goodCode: '// Zapis w PostgreSQL + buforowanie odczytu w Redisie',
        },
      ],
      practicalTask: {
        title: 'Audyt wydajności Lighthouse w Chrome DevTools',
        brief: 'Uruchom zakładkę Lighthouse w narzędziach deweloperskich przeglądarki i przeanalizuj wyniki Performance, Accessibility, Best Practices oraz SEO.',
        steps: ['Otwórz Chrome DevTools -> Lighthouse', 'Wygeneruj raport dla widoku Mobile oraz Desktop', 'Sprawdź czas LCP oraz wskaźnik CLS'],
        deliverable: 'Umiejętność profilowania i optymalizacji aplikacji webowych.',
      },
      completionCriteria: [
        'Zrozumienie wzorca Cache-Aside w Redisie, kolejek zadań i Core Web Vitals',
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
      {
        id: 'career-2',
        moduleId: 15,
        moduleTitle: 'Portfolio, Rozmowy Rekrutacyjne i Kariera',
        title: 'Techniczna rozmowa kwalifikacyjna: Najczęstsze pytania z JS, React, Node.js, SQL i System Design',
        slug: 'kariera-pytania-rekrutacyjne-js-react-node-sql-system-design',
        durationMinutes: 50,
        xpReward: 100,
        order: 2,
        summary: 'Kompletne kompendium pytań, które padają na 90% rozmów rekrutacyjnych na stanowisko Junior / Mid Full Stack Developer. Naucz się odpowiadać konkretnie, podawać przykłady z własnych projektów i rysować architekturę systemu na żywo.',
        objectives: [
          'Precyzyjnie odpowiadać na pytania o Event Loop, Closures (Domknięcia), Prototypy i niemutowalność w JS/TS',
          'Wyjaśniać cykl renderowania Reacta, algorytm Reconciliation, różnicę między Virtual DOM a Real DOM oraz pułapki hooków',
          'Projektować na tablicy prosty system rozproszony (np. skracacz linków Bitly lub system rezerwacji biletów)',
        ],
        prerequisites: ['Moduły 1-14'],
        theoryMarkdown: `Podczas rozmowy technicznej rekruter nie oczekuje od Ciebie recytowania definicji z Wikipedii. Najlepsza odpowiedź składa się z **3 części**:
1. **Krótka definicja w jednym zdaniu** (co to jest?).
2. **Dlaczego to istnieje / jaki problem rozwiązuje?**
3. **Przykład z Twojego projektu** (*"W mojej aplikacji e-commerce użyłem tego do..."*).

**1. Top 3 pytania z JavaScript i TypeScript:**
- **Czym jest Domknięcie (Closure)?**
  *Odpowiedź:* To zdolność funkcji zagnieżdżonej do zapamiętania i dostępu do zmiennych z jej zakresu zewnętrznego (leksykalnego), nawet po tym, jak funkcja zewnętrzna zakończyła już swoje działanie. Używamy tego np. do tworzenia prywatnych liczników, memoizacji oraz w hookach Reacta.
- **Jak działa Event Loop (Mikrozadania vs Makrozadania)?**
  *Odpowiedź:* Gdy Call Stack jest pusty, Event Loop w pierwszej kolejności opróżnia ** całą kolejkę Mikrozadań (Microtask Queue — \`Promise.then\`, \`await\`)**, a dopiero potem bierze jedno zadanie z **kolejki Makrozadań (Macrotask Queue — \`setTimeout\`, \`setInterval\`)**.
- **Różnica między \`interface\` a \`type\` oraz \`any\` a \`unknown\` w TS?**
  *Odpowiedź:* \`type\` pozwala na tworzenie unii (\`A | B\`), a \`unknown\` wymusza sprawdzenie typu (Type Narrowing) przed użyciem zmiennej, w przeciwieństwie do niebezpiecznego \`any\`.

**2. Top 3 pytania z Reacta:**
- **Kiedy komponent Reacta renderuje się ponownie (Re-render)?**
  *Odpowiedź:* Gdy zmieni się jego własny stan (\`useState\` / \`useReducer\`), gdy wyrenderuje się jego rodzic (chyba że komponent jest opakowany w \`React.memo\`) lub gdy zmieni się wartość subskrybowanego kontekstu (\`useContext\`).
- **Dlaczego nie wolno mutować stanu bezpośrednio (\`state.push()\`)?**
  *Odpowiedź:* Ponieważ React porównuje referencje w pamięci (\`Object.is(oldState, newState)\`). Jeśli zmodyfikujemy tę samą tablicę, jej adres w pamięci się nie zmieni i React uzna, że nic się nie wydarzyło, więc nie odświeży ekranu!

**3. Pytania z Backendu i Baz Danych:**
- **Jak przyspieszyć wolne zapytanie SQL?**
  *Odpowiedź:* Sprawdzić plan wykonania przez \`EXPLAIN ANALYZE\`, dodać brakujący indeks B-Tree na kolumnach z \`WHERE\`/\`JOIN\`, wyeliminować problem N+1 zapytań i unikać \`SELECT *\` na rzecz konkretnych kolumn.`,
        codeExamples: [
          {
            title: 'Klasyczna zagadka rekrutacyjna: Kolejność wypisania w Event Loop',
            language: 'javascript',
            code: `console.log('1 - Start');

setTimeout(() => {
  console.log('2 - setTimeout (Macrotask)');
}, 0);

Promise.resolve().then(() => {
  console.log('3 - Promise (Microtask)');
});

console.log('4 - Koniec skryptu');

// Prawidłowa kolejność w konsoli:
// 1 - Start -> 4 - Koniec skryptu -> 3 - Promise (Microtask) -> 2 - setTimeout (Macrotask)`,
            explanation: 'Kod synchroniczny (1, 4) wykonuje się od razu. Następnie opróżniana jest kolejka mikrozadań (3 - Promise), a na samym końcu wykonywane jest makrozadanie z setTimeout (2).',
          },
        ],
        stepByStepGuide: [
          { step: 1, title: 'Stosuj strukturę: Definicja -> Problem -> Przykład', description: 'Pokazuje to praktyczne doświadczenie zamiast suchej teorii.' },
          { step: 2, title: 'Nie bój się powiedzieć "Nie pamiętam dokładnej nazwy, ale..."', description: 'Opisz jak dany mechanizm działa pod maską lub jak byś to sprawdził w dokumentacji.' },
          { step: 3, title: 'Zadawaj pytania o skalę przy zadaniach architektonicznych', description: 'Zapytaj: "Ile mamy użytkowników dziennie? Czy ważniejsza jest spójność czy szybkość odczytu?".' },
        ],
        interactiveExercise: {
          id: 'ex-car-2',
          title: 'Symulator tablicy rozmowy technicznej (Technical Interview)',
          instructions: 'Zbuduj kontener z klasą interview-board, wstaw kolejność wykonania <code>Event Loop Order: Sync -&gt; Microtasks (Promise) -&gt; Macrotasks (setTimeout)</code> oraz wynik "Technical Evaluation: Strong Hire".',
          task: 'Utwórz widżet interview-board prezentujący wzorcową odpowiedź rekrutacyjną.',
          starterCode: {
            html: '<!-- Zbuduj tablicę rozmowy technicznej poniżej -->\n',
            css: '.interview-board { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
            js: 'console.log("Symulator rozmowy technicznej aktywny.");',
          },
          solutionCode: {
            html: '<div class="interview-board">\n  <code>Event Loop Order: Sync -&gt; Microtasks (Promise) -&gt; Macrotasks (setTimeout)</code>\n  <div>Technical Evaluation: Strong Hire</div>\n</div>',
            css: '.interview-board { background: #0f172a; border: 1px solid #10b981; padding: 14px 18px; border-radius: 10px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 6px; }\ncode { color: #34d399; font-family: monospace; font-weight: bold; }',
            js: 'console.log("Symulator rozmowy technicznej aktywny.");',
          },
          hints: [
            'Użyj <div class="interview-board">.',
            'Wstaw <code>Event Loop Order: Sync -&gt; Microtasks (Promise) -&gt; Macrotasks (setTimeout)</code>.',
            'Dodaj tekst Technical Evaluation: Strong Hire.',
          ],
          rules: [
            { id: 'r1', description: 'Klasa interview-board obecna', ruleType: 'html_contains', target: 'interview-board' },
            { id: 'r2', description: 'Kolejność Microtasks (Promise) obecna', ruleType: 'html_contains', target: 'Microtasks (Promise)' },
            { id: 'r3', description: 'Ocena Strong Hire obecna', ruleType: 'html_contains', target: 'Strong Hire' },
          ],
        },
        independentTask: {
          title: 'Zaprojektuj architekturę skracacza linków (np. bit.ly)',
          instructions: 'Wypisz w 4 punktach jak zbudowałbyś serwis skracający długie adresy URL: 1) Tabela SQL (short_code UNIQUE, target_url, clicks), 2) Endpoint POST generujący 7-znakowy kod Base62, 3) Endpoint GET /:code zwracający przekierowanie HTTP 302, 4) Cache w Redisie dla najpopularniejszych linków.',
          expectedOutcome: 'Kompletna, uporządkowana odpowiedź na pytanie System Design.',
          starterHint: 'Pamiętaj o indeksie B-Tree na kolumnie short_code oraz buforowaniu w Redisie.',
        },
        quiz: [
          {
            id: 'q-car2-1',
            question: 'W jakiej kolejności silnik JavaScript wykona poniższe operacje po zakończeniu bieżącego kodu synchronicznego?',
            options: [
              'Najpierw wykona wszystkie oczekujące Mikrozadania (np. `.then()` z Promise / `queueMicrotask`), a dopiero po ich całkowitym opróżnieniu przejdzie do kolejki Makrozadań (`setTimeout`, `setInterval`)',
              'Najpierw wykona `setTimeout`, a potem `Promise`',
              'Wykona je w losowej kolejności',
              'Wykona tylko te funkcje, które mają krótszą nazwę',
            ],
            correctAnswer: 0,
            explanation: 'Kolejka mikrozadań (Microtask Queue) ma zawsze wyższy priorytet niż kolejka makrozadań (Task / Macrotask Queue).',
          },
        ],
        commonMistakes: [
          {
            mistake: 'Zgadywanie na ślepo i wymyślanie nieistniejących pojęć, gdy nie zna się odpowiedzi na pytanie rekrutera',
            whyItHappens: 'Stres i strach przed przyznaniem się do niewiedzy.',
            howToFix: 'Seniorzy bardzo cenią szczerość inżynierską. Powiedz spokojnie: "Nie korzystałem jeszcze z tej konkretnej funkcji produkcyjnie, ale na podstawie tego, jak działa X, przypuszczam że... i zweryfikowałbym to w dokumentacji pod kątem Y".',
            badCode: '"Tak, znam świetnie tę bibliotekę..." (gdy słyszysz jej nazwę pierwszy raz)',
            goodCode: '"Z tym narzędziem jeszcze nie pracowałem, natomiast podobny problem rozwiązałem używając..."',
          },
        ],
        practicalTask: {
          title: 'Próbna rozmowa kwalifikacyjna z Fiszkami i Quizem w Akademii',
          brief: 'Przejdź do sekcji Fiszki oraz Quiz Szybkościowy w naszej aplikacji i przetestuj swoją płynność odpowiadania pod presją czasu.',
          steps: ['Otwórz zakładkę Fiszki (SRS)', 'Przejrzyj pojęcia z kategorii Backend i React', 'Rozwiąż serię pytań w Quizie Szybkościowym'],
          deliverable: 'Pewność siebie i swoboda wysławiania się podczas rozmowy technicznej.',
        },
        completionCriteria: [
          'Opanowanie kluczowych zagadnień z JS, React, Node, SQL i System Design',
          'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
          'Zaliczenie quizu z wynikiem minimum 80%',
        ],
      },
      {
        id: 'career-3',
        moduleId: 15,
        moduleTitle: 'Portfolio, Rozmowy Rekrutacyjne i Kariera',
        title: 'Praca w zespole IT: Metodologia Agile/Scrum, estymacja zadań, negocjacje i pierwsze 90 dni',
        slug: 'kariera-praca-w-zespole-agile-scrum-negocjacje-onboarding',
        durationMinutes: 45,
        xpReward: 100,
        order: 3,
        summary: 'Jak wygląda codzienność programisty w firmie technologicznej od pierwszego dnia pracy? Poznaj ceremonie Scrum (Sprint, Daily, Planning, Retro), sztukę zadawania dobrych pytań seniorom (zasada 30 minut), negocjacje warunków B2B vs UoP oraz plan na pierwsze 90 dni.',
        objectives: [
          'Rozumieć proces wytwarzania oprogramowania w metodyce Agile / Scrum oraz przepływ zadań na tablicy Jira / Linear',
          'Stosować regułę konstruktywnego proszenia o pomoc (co chcę osiągnąć, co już sprawdziłem, jaki widzę błąd)',
          'Przygotować się do rozmowy o wynagrodzeniu (widełki rynkowe, UoP vs B2B) oraz procesu onboardingu w nowej firmie',
        ],
        prerequisites: ['Wszystkie wcześniejsze moduły akademii'],
        theoryMarkdown: `Programowanie komercyjne to sport zespołowy. Umiejętności miękkie (komunikacja, odpowiedzialność, umiejętność szacowania czasu pracy) często decydują o zatrudnieniu i szybkim awansie na stanowisko Regular/Mid!

**1. Jak wygląda tydzień pracy w zespole Scrum / Agile?**
Praca dzielona jest na 1- lub 2-tygodniowe iteracje zwane **Sprintami**:
- **Sprint Planning:** Zespół wybiera zadania z listy (**Backlog**) i szacuje ich złożoność (np. w **Story Points** według ciągu Fibonacciego: 1, 2, 3, 5, 8).
- **Daily Standup (15 minut rano):** Krótkie spotkanie synchronizacyjne: *Co zrobiłem wczoraj? Nad czym pracuję dzisiaj? Czy coś mnie blokuje (Blocker)?*
- **Sprint Review / Demo:** Pokazanie działających nowych funkcji interesariuszom produktu.
- **Sprint Retrospective (Retro):** Szczera rozmowa zespołu o tym, co poszło świetnie, a co warto usprawnić w procesie pracy.

**2. Zasada 30 minut i jak zadawać pytania Seniorom:**
Gdy utkniesz na trudnym błędzie w nowej pracy:
- Nie pytaj po 30 sekundach bez przeczytania komunikatu błędu.
- Ale też **nie siedź w ciszy przez 2 dni**, bojąc się zapytać!
- Po **30–45 minutach** własnego śledztwa napisz na kanale zespołu:
  *"Cześć! Pracuję nad zadaniem PROJ-142 (walidacja koszyka). Chcę osiągnąć X, sprawdziłem już A oraz B w logach, ale przy wywołaniu metody otrzymuję błąd Y w linii 45. Czy ktoś mógłby rzucić okiem przez 5 minut?"* — każdy Senior z przyjemnością pomoże tak przygotowanemu Juniorowi!

**3. Pierwszy PR w nowej pracy i dalszy rozwój:**
Twój cel na pierwszy tydzień to skonfigurowanie środowiska lokalnego i wdrożenie pierwszego, choćby najmniejszego Pull Requestu na produkcję. Gratulacje — przeszedłeś całą ścieżkę **Akademii Full Stack Developera**!`,
        codeExamples: [
          {
            title: 'Szablon profesjonalnego zgłoszenia problemu / pytania na komunikatorze zespołowym',
            language: 'markdown',
            code: `Cześć @zespół-backend! 👋
Utknąłem przy zadaniu **#AUTH-204** (odświeżanie tokena sesji).

**1. Co próbuję zrobić:** Chcę zapisać nowy Refresh Token w bazie po wywołaniu \`/api/auth/refresh\`.
**2. Co już sprawdziłem:** Zweryfikowałem schemat Prisma oraz poprawność dekodowania JWT (test jednostkowy przechodzi).
**3. Problem:** Przy zapisie otrzymuję błąd \`P2002: Unique constraint failed on the fields: (token_hash)\`.
**4. Moja hipoteza:** Wygląda na to, że klient wysyła dwa równoległe zapytania naraz. Czy powinniśmy użyć tu klauzuli upsert lub blokady?`,
            explanation: 'Taki format wiadomości oszczędza czas całego zespołu i pokazuje Twoją samodzielność oraz analityczne podejście.',
          },
        ],
        stepByStepGuide: [
          { step: 1, title: 'Przygotuj 3 własne pytania na koniec rozmowy rekrutacyjnej', description: 'Zapytaj np.: "Jak wygląda proces Code Review i wdrażania nowego programisty w pierwszym miesiącu?".' },
          { step: 2, title: 'Rób notatki podczas onboardingu', description: 'Jeśli odkryjesz nieaktualny krok w instrukcji uruchomienia projektu, od razu zaktualizuj README dla kolejnych osób!' },
          { step: 3, title: 'Odbierz swój Certyfikat Akademii i buduj własne projekty', description: 'Praktyka i regularne pisanie kodu to najkrótsza droga do mistrzostwa.' },
        ],
        interactiveExercise: {
          id: 'ex-car-3',
          title: 'Tablica ukończenia Akademii i gotowości do pracy w Scrum',
          instructions: 'Zbuduj kontener z klasą graduation-card, wstaw znacznik <code>Sprint Status: Ready for Production</code> oraz tytuł "Certyfikowany Junior Full Stack Developer — 100% Ready!".',
          task: 'Utwórz widżet graduation-card wieńczący cały program nauczania.',
          starterCode: {
            html: '<!-- Zbuduj kartę ukończenia akademii poniżej -->\n',
            css: '.graduation-card { background: #0f172a; border: 2px solid #f59e0b; padding: 16px 20px; border-radius: 12px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 8px; }\ncode { color: #fbbf24; font-family: monospace; font-weight: bold; }',
            js: 'console.log("Gratulacje! Cały program Akademii ukończony!");',
          },
          solutionCode: {
            html: '<div class="graduation-card">\n  <code>Sprint Status: Ready for Production</code>\n  <div>Certyfikowany Junior Full Stack Developer — 100% Ready!</div>\n</div>',
            css: '.graduation-card { background: #0f172a; border: 2px solid #f59e0b; padding: 16px 20px; border-radius: 12px; font-family: sans-serif; color: #f8fafc; display: flex; flex-direction: column; gap: 8px; }\ncode { color: #fbbf24; font-family: monospace; font-weight: bold; }',
            js: 'console.log("Gratulacje! Cały program Akademii ukończony!");',
          },
          hints: [
            'Użyj <div class="graduation-card">.',
            'Wstaw <code>Sprint Status: Ready for Production</code>.',
            'Dodaj tekst Certyfikowany Junior Full Stack Developer — 100% Ready!.',
          ],
          rules: [
            { id: 'r1', description: 'Klasa graduation-card obecna', ruleType: 'html_contains', target: 'graduation-card' },
            { id: 'r2', description: 'Status Ready for Production obecny', ruleType: 'html_contains', target: 'Ready for Production' },
            { id: 'r3', description: 'Tytuł Certyfikowany Junior Full Stack Developer obecny', ruleType: 'html_contains', target: 'Certyfikowany Junior Full Stack Developer' },
          ],
        },
        independentTask: {
          title: 'Plan 30-60-90 dni na pierwszym stanowisku Junior Developera',
          instructions: 'Rozpisz swoje cele na pierwsze 3 miesiące pracy: 30 dni (poznanie domeny, uruchomienie środowiska, pierwsze poprawki błędów), 60 dni (samodzielna realizacja funkcji od bazy po frontend), 90 dni (aktywny udział w Code Review i pisanie testów E2E).',
          expectedOutcome: 'Jasna mapa drogowa rozwoju w pierwszej pracy w IT.',
          starterHint: 'Podziel plan na 3 etapy: Nauka domeny -> Samodzielność -> Wkład w jakość zespołu.',
        },
        quiz: [
          {
            id: 'q-car3-1',
            question: 'Jak należy zachować się w zespole IT, gdy podczas pracy nad zadaniem utkniesz na błędzie, którego nie udaje Ci się rozwiązać samodzielnie przez ponad 45 minut?',
            options: [
              'Sformułować zwięzłe pytanie na kanale zespołowym opisujące: cel zadania, co już zostało sprawdzone, dokładną treść błędu oraz własną hipotezę',
              'Ukrywać problem przez tydzień i mówić na Daily, że "wszystko idzie zgodnie z planem"',
              'Skasować całą bazę danych i zacząć projekt od nowa',
              'Wysłać sam zrzut ekranu z napisem "nie działa" bez żadnego kontekstu',
            ],
            correctAnswer: 0,
            explanation: 'Proaktywna, konkretna komunikacja o blokadach (tzw. Blockerach) jest jednym z najważniejszych wyznaczników profesjonalizmu w zespołach Agile.',
          },
        ],
        commonMistakes: [
          {
            mistake: 'Brak jakichkolwiek pytań do rekrutera i lidera technicznego na końcu rozmowy kwalifikacyjnej ("Nie, dziękuję, wszystko jest jasne")',
            whyItHappens: 'Zmęczenie po części technicznej rozmowy.',
            howToFix: 'Pytania kandydata pokazują jego autentyczne zaangażowanie i dojrzałość. Zawsze miej przygotowane 2-3 pytania o stos technologiczny, kulturę Code Review, proces wdrożeń CI/CD lub wyzwania stojące przed zespołem w najbliższym kwartale.',
            badCode: '"Nie mam żadnych pytań."',
            goodCode: '"Jak wygląda u Państwa proces wdrażania zmian na produkcję i kultura Code Review?"',
          },
        ],
        practicalTask: {
          title: 'Finalizacja Projektu Końcowego i odbiór Certyfikatu',
          brief: 'Sprawdź swój postęp na Dashboardzie, ukończ wyzwania w Laboratorium Projektów i wygeneruj swój imienny Certyfikat Junior Full Stack Developera!',
          steps: ['Otwórz zakładkę Projekty i sprawdź checklisty wymagań', 'Zweryfikuj zdobyte odznaki i poziom XP', 'Pobierz Certyfikat Ukończenia Akademii'],
          deliverable: 'Gotowość do podjęcia pierwszej pracy jako Junior Full Stack Developer!',
        },
        completionCriteria: [
          'Zrozumienie pracy w Scrum, komunikacji w zespole i procesu rekrutacji',
          'Prawidłowe rozwiązanie ćwiczenia interaktywnego',
          'Zaliczenie quizu z wynikiem minimum 80%',
        ],
      },
    ],
  },
];
