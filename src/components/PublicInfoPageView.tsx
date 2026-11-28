import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PublicHeader } from './PublicHeader';
import { Mail, ShieldCheck, FileText, Users, CheckCircle2, ArrowRight } from 'lucide-react';

interface PublicInfoPageViewProps {
  page: 'about' | 'contact' | 'terms' | 'privacy';
  onOpenAuthModal: () => void;
}

export const PublicInfoPageView: React.FC<PublicInfoPageViewProps> = ({
  page,
  onOpenAuthModal,
}) => {
  const { setActiveTab, allModules, allLessons, language } = useApp();
  const isEn = language === 'en';
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactError, setContactError] = useState('');
  const [contactReady, setContactReady] = useState(false);

  const handleLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    target: 'landing' | 'knowledge_base' | 'guides' | 'about' | 'contact' | 'terms' | 'privacy'
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setActiveTab(target);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim());
    if (contactName.trim().length < 2) {
      setContactError(isEn ? 'Enter your name (minimum 2 characters).' : 'Podaj swoje imię (minimum 2 znaki).');
      return;
    }
    if (!emailOk) {
      setContactError(isEn ? 'Enter a valid email address.' : 'Podaj poprawny adres e-mail.');
      return;
    }
    if (contactMessage.trim().length < 10) {
      setContactError(isEn ? 'Enter your message (minimum 10 characters).' : 'Wpisz treść wiadomości (minimum 10 znaków).');
      return;
    }
    setContactReady(true);
  };

  return (
    <div className="min-h-screen bg-[#06080E] text-[#F8FAFC] selection:bg-indigo-600 selection:text-white">
      <PublicHeader onOpenAuthModal={onOpenAuthModal} activeTab={page} />

      <div className="mx-auto max-w-4xl px-4 sm:px-8 py-12 sm:py-16 space-y-10">
        {page === 'about' && (
          <article className="space-y-8">
            <header className="space-y-3 border-b border-white/[0.08] pb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <Users className="h-4 w-4" />
                <span>{isEn ? 'About Academy & Editorial Methodology' : 'O Akademii i Metodyce Redakcyjnej'}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F8FAFC]">
                {isEn
                  ? 'Full Stack Developer Academy — bilingual hands-on engineering education'
                  : 'Full Stack Developer Academy — edukacja programistyczna w języku polskim'}
              </h1>
              <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
                {isEn
                  ? 'Full Stack Developer Academy was created as an open educational platform pairing an accessible computer-science knowledge base with an interactive coding workspace directly in your browser.'
                  : 'Full Stack Developer Academy powstała jako otwarta polska platforma łącząca przystępną bazę wiedzy programistycznej z interaktywnym warsztatem kodu w przeglądarce.'}
              </p>
            </header>

            <section className="rounded-2xl border border-white/10 bg-[#0B101B] p-6 sm:p-8 space-y-4 text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
              <h2 className="font-display text-xl font-bold text-[#F8FAFC]">
                {isEn ? 'Our teaching methodology' : 'Nasza metodyka nauczania'}
              </h2>
              <p>
                {isEn ? (
                  <>
                    Instead of opening with intimidating academic jargon, each of the{' '}
                    <strong className="text-white">{allLessons.length} lessons</strong> across{' '}
                    <strong className="text-white">{allModules.length} modules</strong> unfolds in three steps:
                    an everyday life analogy clarifying the idea, clear syntax explanations with annotated code and a glossary,
                    and a hands-on exercise backed by an 80% pre-built scaffold.
                  </>
                ) : (
                  <>
                    Zamiast zaczynać od skomplikowanych definicji akademickich, każda z{' '}
                    <strong className="text-white">{allLessons.length} lekcji</strong> w{' '}
                    <strong className="text-white">{allModules.length} modułach</strong> prowadzona jest
                    w trzech krokach: najpierw codzienna analogia wyjaśniająca koncepcję, następnie
                    czytelne omówienie składni z przykładami kodu oraz słowniczek, a na końcu zadanie
                    praktyczne oparte o gotowy w 80% szkielet projektu.
                  </>
                )}
              </p>
              <p>
                {isEn ? (
                  <>
                    All theoretical guides and code walkthroughs are publicly readable in the{' '}
                    <a
                      href="/baza-wiedzy"
                      onClick={(e) => handleLink(e, 'knowledge_base')}
                      className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                    >
                      Open Knowledge Base
                    </a>{' '}
                    without creating an account. Registration simply unlocks saving your personal progress, code solutions, spaced-repetition flashcards, and completion certificates.
                  </>
                ) : (
                  <>
                    Wszystkie materiały teoretyczne i przykłady kodu są dostępne publicznie w{' '}
                    <a
                      href="/baza-wiedzy"
                      onClick={(e) => handleLink(e, 'knowledge_base')}
                      className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                    >
                      Otwartej Bazie Wiedzy
                    </a>{' '}
                    bez konieczności zakładania konta. Rejestracja służy wyłącznie do zapisywania
                    własnych postępów, rozwiązań zadań, fiszek powtórkowych oraz certyfikatów ukończenia.
                  </>
                )}
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#0B101B] p-6 sm:p-8 space-y-4 text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
              <h2 className="font-display text-xl font-bold text-[#F8FAFC]">
                {isEn ? 'Curriculum coverage' : 'Zakres merytoryczny programu'}
              </h2>
              <p>
                {isEn
                  ? 'The curriculum spans the complete modern web engineering lifecycle: HTML5 and WCAG accessibility, CSS Grid, Flexbox & Tailwind CSS, JavaScript ES2025, TypeScript, React 19, Node.js & Express backends, relational SQL & PostgreSQL databases, AppSec (OWASP, JWT), automated testing, and Docker + CI/CD deployment.'
                  : 'Program obejmuje kompletną ścieżkę współczesnego tworzenia aplikacji webowych: HTML5 i dostępność WCAG, CSS Grid, Flexbox i Tailwind CSS, JavaScript ES2025, TypeScript, React 19, backend w Node.js i Express, relacyjne bazy danych SQL i PostgreSQL, bezpieczeństwo aplikacji (OWASP, JWT), testy automatyczne oraz Docker i CI/CD.'}
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="/poradniki"
                  onClick={(e) => handleLink(e, 'guides')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors"
                >
                  <span>{isEn ? 'Read Engineering Guides' : 'Czytaj Poradniki Eksperckie'}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/baza-wiedzy"
                  onClick={(e) => handleLink(e, 'knowledge_base')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#CBD5E1] border border-white/15 hover:border-white/30 rounded-xl transition-colors"
                >
                  <span>{isEn ? `Browse all ${allLessons.length} lessons` : `Przeglądaj wszystkie ${allLessons.length} lekcji`}</span>
                </a>
                <a
                  href="/kontakt"
                  onClick={(e) => handleLink(e, 'contact')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#CBD5E1] border border-white/15 hover:border-white/30 rounded-xl transition-colors"
                >
                  {isEn ? 'Contact us' : 'Skontaktuj się z nami'}
                </a>
              </div>
            </section>
          </article>
        )}

        {page === 'contact' && (
          <article className="space-y-8">
            <header className="space-y-3 border-b border-white/[0.08] pb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <Mail className="h-4 w-4" />
                <span>{isEn ? 'Contact & Support' : 'Kontakt i Wsparcie'}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F8FAFC]">
                {isEn ? 'Contact Full Stack Developer Academy' : 'Skontaktuj się z Full Stack Developer Academy'}
              </h1>
              <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
                {isEn
                  ? 'Have a question about lesson content, a technical issue with the app, curriculum feedback, or a GDPR privacy request? Reach out directly.'
                  : 'Masz pytanie o treść lekcji, problem techniczny z aplikacją, sugestię poprawy materiału albo sprawę dotyczącą prywatności i RODO? Napisz bezpośrednio.'}
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 rounded-2xl border border-white/10 bg-[#0B101B] p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
                  {isEn ? 'Contact details' : 'Dane kontaktowe'}
                </h2>
                <div className="space-y-2 text-sm text-[#CBD5E1]">
                  <p>
                    <span className="block text-xs text-[#94A3B8]">
                      {isEn ? 'Administrator & Editorial Team:' : 'Administrator i Redakcja:'}
                    </span>
                    <strong className="text-white">Full Stack Developer Academy</strong>
                  </p>
                  <p>
                    <span className="block text-xs text-[#94A3B8]">
                      {isEn ? 'Email address:' : 'Adres e-mail:'}
                    </span>
                    <a
                      href="mailto:zordonzordon1@gmail.com"
                      className="font-mono text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                    >
                      zordonzordon1@gmail.com
                    </a>
                  </p>
                  <p className="text-xs text-[#94A3B8] pt-2 leading-relaxed">
                    {isEn
                      ? 'We typically respond on business days within 24–48 hours. GDPR requests (account or data deletion) are prioritized.'
                      : 'Odpowiadamy na wiadomości w dni robocze zazwyczaj w ciągu 24–48 godzin. Zgłoszenia RODO (usunięcie konta / danych) realizujemy priorytetowo.'}
                  </p>
                </div>
              </div>

              <div className="md:col-span-7 rounded-2xl border border-white/10 bg-[#0B101B] p-6 sm:p-7">
                {contactReady ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 text-emerald-400 font-bold">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>{isEn ? 'Message ready to send' : 'Wiadomość przygotowana do wysłania'}</span>
                    </div>
                    <p className="text-sm text-[#CBD5E1] leading-relaxed">
                      {isEn ? (
                        <>
                          Click the button below to open your email client and send the drafted message directly to{' '}
                          <strong className="text-white">zordonzordon1@gmail.com</strong>.
                        </>
                      ) : (
                        <>
                          Kliknij przycisk poniżej, aby wysłać przygotowaną wiadomość bezpośrednio ze swojego klienta poczty na adres{' '}
                          <strong className="text-white">zordonzordon1@gmail.com</strong>.
                        </>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`mailto:zordonzordon1@gmail.com?subject=${encodeURIComponent(
                          isEn ? `[FS Academy] Message from ${contactName}` : `[FS Academy] Wiadomość od ${contactName}`
                        )}&body=${encodeURIComponent(
                          isEn
                            ? `Name: ${contactName}\nReply-to Email: ${contactEmail}\n\n${contactMessage}`
                            : `Imię: ${contactName}\nE-mail zwrotny: ${contactEmail}\n\n${contactMessage}`
                        )}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                      >
                        {isEn ? 'Open email client and send' : 'Otwórz program pocztowy i wyślij'}
                      </a>
                      <button
                        type="button"
                        onClick={() => setContactReady(false)}
                        className="px-4 py-2.5 text-xs font-semibold text-[#94A3B8] hover:text-white"
                      >
                        {isEn ? 'Edit message' : 'Edytuj treść'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} noValidate className="space-y-4">
                    <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
                      {isEn ? 'Message form' : 'Formularz wiadomości'}
                    </h2>
                    <div className="space-y-1">
                      <label htmlFor="contact-name" className="block text-xs font-semibold text-[#CBD5E1]">
                        {isEn ? 'Your name' : 'Twoje imię'}
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={isEn ? 'e.g., Alex Morgan' : 'np. Jan Kowalski'}
                        className="w-full rounded-xl border border-white/15 bg-[#060911] px-3.5 py-2.5 text-sm text-[#F8FAFC] focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-[#CBD5E1]">
                        {isEn ? 'Email address' : 'Adres e-mail'}
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder={isEn ? 'e.g., alex@example.com' : 'np. jan@domena.pl'}
                        className="w-full rounded-xl border border-white/15 bg-[#060911] px-3.5 py-2.5 text-sm text-[#F8FAFC] focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="contact-message" className="block text-xs font-semibold text-[#CBD5E1]">
                        {isEn ? 'Message' : 'Treść wiadomości'}
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder={isEn ? 'Describe your question or report...' : 'Opisz swoje pytanie lub zgłoszenie...'}
                        className="w-full rounded-xl border border-white/15 bg-[#060911] px-3.5 py-2.5 text-sm text-[#F8FAFC] focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    {contactError && (
                      <p role="alert" className="text-xs font-semibold text-rose-400">
                        {contactError}
                      </p>
                    )}
                    <button
                      type="submit"
                      className="w-full py-3 px-5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors"
                    >
                      {isEn ? 'Prepare email message' : 'Przygotuj wiadomość e-mail'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </article>
        )}

        {page === 'terms' && (
          <article className="space-y-8">
            <header className="space-y-3 border-b border-white/[0.08] pb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <FileText className="h-4 w-4" />
                <span>{isEn ? 'Legal Documentation' : 'Dokumentacja Prawna'}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F8FAFC]">
                {isEn
                  ? 'Terms of Service — Full Stack Developer Academy'
                  : 'Regulamin serwisu Full Stack Developer Academy'}
              </h1>
              <p className="text-xs text-[#94A3B8]">
                {isEn ? 'Last updated: November 14, 2026' : 'Ostatnia aktualizacja: 14 listopada 2026 r.'}
              </p>
            </header>

            <div className="rounded-2xl border border-white/10 bg-[#0B101B] p-6 sm:p-8 space-y-6 text-sm text-[#CBD5E1] leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#F8FAFC]">
                  {isEn ? '1. General provisions' : '1. Postanowienia ogólne'}
                </h2>
                <p>
                  {isEn ? (
                    <>
                      The website available at <strong className="text-white">fsda.tech</strong> and
                      its companion educational application provide web engineering lessons and an interactive
                      browser practice environment. The service is owned and operated by Full Stack Developer
                      Academy (contact:{' '}
                      <a href="mailto:zordonzordon1@gmail.com" className="text-indigo-400 underline">
                        zordonzordon1@gmail.com
                      </a>
                      ).
                    </>
                  ) : (
                    <>
                      Serwis internetowy dostępny pod adresem{' '}
                      <strong className="text-white">fsda.tech</strong> oraz powiązana aplikacja
                      edukacyjna udostępniają materiały szkoleniowe z zakresu programowania webowego oraz
                      interaktywne środowisko ćwiczeniowe. Właścicielem i administratorem serwisu jest
                      Full Stack Developer Academy (kontakt:{' '}
                      <a href="mailto:zordonzordon1@gmail.com" className="text-indigo-400 underline">
                        zordonzordon1@gmail.com
                      </a>
                      ).
                    </>
                  )}
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#F8FAFC]">
                  {isEn ? '2. Free access and student accounts' : '2. Dostęp bezpłatny i konta użytkowników'}
                </h2>
                <p>
                  {isEn
                    ? 'The Open Knowledge Base and Engineering Guides are free and require no login. Creating a free student account enables cloud progress sync, the live code editor, 6 simulators, 12 hands-on projects, GitHub sync, and verified completion certificates — all 100% free and supported by Google AdSense.'
                    : 'Otwarta Baza Wiedzy oraz Poradniki Eksperckie są dostępne bez logowania i bezpłatnie. Założenie bezpłatnego konta kursanta umożliwia zapis postępów w chmurze, korzystanie z edytora kodu, 6 symulatorów, 12 projektów praktycznych, integracji GitHub oraz uzyskanie certyfikatu ukończenia — wszystkie te funkcje są w 100% bezpłatne dzięki wsparciu reklam Google AdSense.'}
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#F8FAFC]">
                  {isEn ? '3. Intellectual property' : '3. Prawa autorskie'}
                </h2>
                <p>
                  {isEn
                    ? 'Lesson guides, project specifications, graphics, and platform architecture are protected by copyright law. Learners may reuse code snippets from lessons for self-study and personal portfolio projects. Bulk scraping and commercial resale of the curriculum without prior written consent are prohibited.'
                    : 'Treści lekcji, opisy projektów, grafiki oraz układ platformy podlegają ochronie prawnej. Użytkownicy mogą wykorzystywać fragmenty kodu z lekcji do własnej nauki i własnych projektów portfolio. Zabronione jest masowe kopiowanie i dalsze komercyjne odsprzedawanie całego kursu bez zgody administratora.'}
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#F8FAFC]">
                  {isEn ? '4. Account deletion and support' : '4. Usunięcie konta i reklamacje'}
                </h2>
                <p>
                  {isEn ? (
                    <>
                      You may discontinue using the service at any time and request permanent deletion of your
                      account and study history by writing to{' '}
                      <a href="mailto:zordonzordon1@gmail.com" className="text-indigo-400 underline">
                        zordonzordon1@gmail.com
                      </a>
                      .
                    </>
                  ) : (
                    <>
                      Użytkownik ma prawo w każdej chwili zrezygnować z korzystania z serwisu i zażądać
                      trwałego usunięcia swojego konta wraz z postępami, wysyłając wiadomość na adres{' '}
                      <a href="mailto:zordonzordon1@gmail.com" className="text-indigo-400 underline">
                        zordonzordon1@gmail.com
                      </a>
                      .
                    </>
                  )}
                </p>
              </section>
            </div>
          </article>
        )}

        {page === 'privacy' && (
          <article className="space-y-8">
            <header className="space-y-3 border-b border-white/[0.08] pb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <ShieldCheck className="h-4 w-4" />
                <span>
                  {isEn
                    ? 'Personal Data Protection · GDPR & Google AdSense'
                    : 'Ochrona Danych Osobowych · RODO & Google AdSense'}
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F8FAFC]">
                {isEn ? 'Privacy & Cookie Policy' : 'Polityka Prywatności i Plików Cookie'}
              </h1>
              <p className="text-xs text-[#94A3B8]">
                {isEn ? 'Last updated: November 14, 2026' : 'Ostatnia aktualizacja: 14 listopada 2026 r.'}
              </p>
            </header>

            <div className="rounded-2xl border border-white/10 bg-[#0B101B] p-6 sm:p-8 space-y-6 text-sm text-[#CBD5E1] leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#F8FAFC]">
                  {isEn ? '1. Data controller' : '1. Administrator danych'}
                </h2>
                <p>
                  {isEn ? (
                    <>
                      The data controller for Full Stack Developer Academy (fsda.tech) is the
                      platform creator, reachable via email at{' '}
                      <a href="mailto:zordonzordon1@gmail.com" className="text-indigo-400 underline">
                        zordonzordon1@gmail.com
                      </a>
                      .
                    </>
                  ) : (
                    <>
                      Administratorem serwisu Full Stack Developer Academy (fsda.tech) jest
                      twórca platformy, dostępny pod adresem e-mail:{' '}
                      <a href="mailto:zordonzordon1@gmail.com" className="text-indigo-400 underline">
                        zordonzordon1@gmail.com
                      </a>
                      .
                    </>
                  )}
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#F8FAFC]">
                  {isEn ? '2. Data processed and purpose' : '2. Jakie dane przetwarzamy i po co'}
                </h2>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    {isEn ? (
                      <>
                        <strong>Browsing without an account:</strong> The Open Knowledge Base requires no registration. Browser local storage (<code>localStorage</code>) only stores your UI preferences (theme, language) and cookie consent choice.
                      </>
                    ) : (
                      <>
                        <strong>Przeglądanie bez konta:</strong> Otwarta Baza Wiedzy dostępna jest bez
                        rejestracji. W pamięci lokalnej przeglądarki (<code>localStorage</code>) mogą
                        być zapisywane jedynie Twoje ustawienia interfejsu oraz wybór dotyczący zgody na
                        pliki cookie.
                      </>
                    )}
                  </li>
                  <li>
                    {isEn ? (
                      <>
                        <strong>Student account (Firebase Authentication & Firestore):</strong> Upon voluntary sign-in (email or Google OAuth), we store your display name, email, completed lessons, XP points, and saved solutions to enable cross-device sync and personalized certificates.
                      </>
                    ) : (
                      <>
                        <strong>Konto kursanta (Firebase Authentication i Firestore):</strong> Po
                        dobrowolnym zalogowaniu (e-mail lub logowanie Google OAuth) zapisujemy imię,
                        adres e-mail, postępy ukończonych lekcji, punkty XP oraz napisane rozwiązania,
                        aby umożliwić synchronizację nauki między urządzeniami i wygenerowanie imiennego
                        certyfikatu.
                      </>
                    )}
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#F8FAFC]">
                  {isEn
                    ? '3. Google AdSense advertising & third-party cookies'
                    : '3. Reklamy Google AdSense i pliki cookie dostawców zewnętrznych'}
                </h2>
                <p>
                  {isEn ? (
                    <>
                      To sustain free access to learning materials, the platform may display advertisements via{' '}
                      <strong>Google AdSense</strong> (provider: Google Ireland Limited).
                    </>
                  ) : (
                    <>
                      Aby utrzymywać bezpłatny dostęp do materiałów edukacyjnych, serwis może korzystać z
                      usługi reklamowej <strong>Google AdSense</strong> (dostawca: Google Ireland Limited).
                    </>
                  )}
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    {isEn
                      ? 'Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites.'
                      : 'Dostawcy zewnętrzni, w tym Google, używają plików cookie do wyświetlania reklam w oparciu o wcześniejsze odwiedziny użytkownika w tym lub w innych serwisach internetowych.'}
                  </li>
                  <li>
                    {isEn
                      ? 'Google’s use of advertising cookies enables it and its partners to serve personalized or non-personalized ads to learners.'
                      : 'Użycie przez Google plików cookie reklamowych umożliwia firmie Google i jej partnerom wyświetlanie użytkownikom spersonalizowanych lub niespersonalizowanych reklam.'}
                  </li>
                  <li>
                    {isEn ? (
                      <>
                        Users may opt out of personalized advertising anytime in{' '}
                        <a
                          href="https://www.google.com/settings/ads"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 underline"
                        >
                          Google Ads Settings
                        </a>{' '}
                        or via{' '}
                        <a
                          href="https://www.aboutads.info/choices/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 underline"
                        >
                          aboutads.info
                        </a>
                        , or update browser cookie permissions.
                      </>
                    ) : (
                      <>
                        Użytkownicy mogą w każdej chwili wyłączyć personalizację reklam w{' '}
                        <a
                          href="https://www.google.com/settings/ads"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 underline"
                        >
                          Ustawieniach reklam Google
                        </a>{' '}
                        lub na stronie{' '}
                        <a
                          href="https://www.aboutads.info/choices/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 underline"
                        >
                          aboutads.info
                        </a>
                        , a także zmienić zgodę w swojej przeglądarce internetowej.
                      </>
                    )}
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#F8FAFC]">
                  {isEn ? '4. Your rights under GDPR' : '4. Twoje prawa zgodnie z RODO'}
                </h2>
                <p>
                  {isEn ? (
                    <>
                      You have the right to access, rectify, export, or request complete erasure of your personal data. Contact us anytime at{' '}
                      <a href="mailto:zordonzordon1@gmail.com" className="text-indigo-400 underline">
                        zordonzordon1@gmail.com
                      </a>
                      .
                    </>
                  ) : (
                    <>
                      Masz prawo do dostępu do swoich danych, ich sprostowania, przeniesienia oraz
                      żądania ich całkowitego usunięcia. W celu realizacji dowolnego z tych praw napisz na{' '}
                      <a href="mailto:zordonzordon1@gmail.com" className="text-indigo-400 underline">
                        zordonzordon1@gmail.com
                      </a>
                      .
                    </>
                  )}
                </p>
              </section>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};
