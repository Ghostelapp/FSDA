import { Announcement } from '../types';

export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Witaj w Full Stack Developer Academy 2026!',
    content: 'Rozpoczynasz kompleksową drogę od podstaw do stanowiska Junior Full Stack Developera. Pamiętaj: najważniejsza jest regularność i aktywne pisanie kodu w interaktywnym edytorze.',
    date: '2026-10-21',
    category: 'Kurs',
    author: 'Architekt Kursu',
  },
  {
    id: 'ann-2',
    title: 'Nowy moduł: Semantyka HTML5 i Dostępność cyfrowa WCAG',
    content: 'Opublikowano 5 pełnych lekcji z interaktywnymi ćwiczeniami w piaskownicy kodowej oraz automatyczną weryfikacją testów.',
    date: '2026-10-21',
    category: 'Aktualizacja',
    author: 'Zespół Dydaktyczny',
  },
  {
    id: 'ann-3',
    title: 'Wskazówka tygodnia: Używaj narzędzi Accessibility w DevTools',
    content: 'Przed oddaniem zadania sprawdź zakładkę Accessibility w przeglądarce i upewnij się, że każdy formularz posiada prawidłowo powiązany label.',
    date: '2026-10-20',
    category: 'Porada',
    author: 'Główny Instruktor',
  },
];
