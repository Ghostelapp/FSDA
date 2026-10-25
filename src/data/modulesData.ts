import { Module, Lesson } from '../types';
import { MODULE_1 } from './modules/module1_fundamenty';
import { MODULE_2 } from './modules/module2_html';
import { MODULE_3 } from './modules/module3_css';
import { MODULE_4 } from './modules/module4_javascript';
import { MODULE_5 } from './modules/module5_git';
import { MODULE_6 } from './modules/module6_typescript';
import { MODULE_7 } from './modules/module7_react';
import { MODULE_8 } from './modules/module8_backend';
import { MODULE_9 } from './modules/module9_databases';
import { MODULE_10 } from './modules/module10_security';
import { MODULES_11_TO_15 } from './modules/modulesRemaining';
import { MISSING_CURRICULUM_LESSONS } from './modules/missingCurriculumLessons';

/**
 * Canonical pedagogical lesson ordering per module (strictly from easiest/zero-knowledge to advanced).
 */
export const PEDAGOGICAL_LESSON_ORDER: Record<number, string[]> = {
  1: ['fund-1', 'fund-2', 'fund-3', 'fund-4', 'fund-6', 'fund-5'],
  2: ['html-7', 'html-8', 'html-4', 'html-9', 'html-1', 'html-2', 'html-3', 'html-6', 'html-5'],
  3: ['css-7', 'css-6', 'css-1', 'css-2', 'css-8', 'css-3', 'css-4', 'css-5', 'css-9'],
  4: ['js-1', 'js-6', 'js-8', 'js-7', 'js-9', 'js-3', 'js-2', 'js-4', 'js-5', 'js-10'],
  5: ['git-1', 'git-2', 'git-3', 'git-4', 'git-5', 'git-6'],
  6: ['ts-1', 'ts-3', 'ts-4', 'ts-2', 'ts-5', 'ts-6'],
  7: ['react-1', 'react-4', 'react-5', 'react-2', 'react-6', 'react-3', 'react-7'],
  8: ['node-1', 'node-2', 'node-5', 'node-4', 'node-3', 'node-6'],
  9: ['db-1', 'db-3', 'db-4', 'db-5', 'db-2', 'db-6'],
  10: ['sec-1', 'sec-2', 'sec-5', 'sec-3', 'sec-4'],
  11: ['fullstack-1', 'fullstack-4', 'fullstack-5', 'fullstack-2', 'fullstack-3'],
  12: ['test-1', 'test-2', 'test-4', 'test-3'],
  13: ['devops-1', 'devops-2', 'devops-4', 'devops-3'],
  14: ['next-1', 'next-2', 'next-3', 'next-4'],
  15: ['career-1', 'career-2', 'career-4', 'career-3'],
};

/**
 * Clear, non-intimidating lesson titles so beginners immediately see a logical progression.
 */
const FRIENDLY_LESSON_TITLES: Record<string, string> = {
  // Module 1: Fundamenty od zera
  'fund-1': 'Jak działa strona internetowa? Przeglądarka, serwer i pierwsze powitanie',
  'fund-2': 'Jak myśli komputer? Proste kroki (algorytm) i zmienne w pamięci',
  'fund-3': 'Twój edytor kodu: VS Code, skróty klawiszowe i automatyczne formatowanie',
  'fund-4': 'Podstawy Terminala: tworzenie folderów i poruszanie się po plikach',
  'fund-6': 'Jak czytać komunikaty o błędach i korzystać z narzędzi przeglądarki (F12)',
  'fund-5': 'Bezpieczeństwo projektu: pliki konfiguracyjne .env i ukrywanie haseł (.gitignore)',

  // Module 2: HTML od najprostszych znaczników do pełnej strony
  'html-7': 'Pierwsze znaczniki HTML: Nagłówki (h1–h6), akapity (p) i pogrubienie (strong)',
  'html-8': 'Listy punktowane i numerowane (ul, ol) oraz linki (a href)',
  'html-4': 'Obrazki (img), odnośniki i proste tabele danych (table)',
  'html-9': 'Pudełka div i span oraz nazywanie elementów za pomocą id i class',
  'html-1': 'Pełny szkielet pliku HTML5: DOCTYPE, sekcja head oraz ciało strony body',
  'html-2': 'Semantyczny układ strony: nagłówek (header), menu (nav), treść (main) i stopka (footer)',
  'html-3': 'Formularze od podstaw: pola tekstowe (input), etykiety (label) i przyciski',
  'html-6': 'Multimedia na stronie: odtwarzacz wideo (video), dźwięk (audio) i ikony SVG',
  'html-5': 'Dostępność stron (WCAG) i widoczność w wyszukiwarce Google (Podstawy SEO)',

  // Module 3: CSS od kolorów i czcionek do układów Flexbox i Grid
  'css-7': 'Pierwsze kroki w CSS: Kolory tekstu, tła, czcionki i proste gradienty',
  'css-6': 'Jak wybierać elementy w CSS? Klasy (.klasa), efekt najechania (:hover) i jednostki (px, rem)',
  'css-1': 'Model pudełkowy (Box Model): odstępy wewnętrzne (padding), ramki (border) i marginesy (margin)',
  'css-2': 'Flexbox od podstaw: łatwe układanie elementów obok siebie i wyśrodkowanie',
  'css-8': 'Pozycjonowanie elementów: przyklejone menu (sticky, fixed) oraz warstwy (relative, absolute)',
  'css-3': 'Siatka CSS Grid: układanie strony w kolumny i wiersze',
  'css-4': 'Strony na telefon i komputer: Responsywność i @media queries',
  'css-5': 'Zmienne CSS (--kolor) oraz płynne animacje i przejścia (transition)',
  'css-9': 'Nowoczesne stylowanie z Tailwind CSS: gotowe klasy użytkowe w praktyce',

  // Module 4: JavaScript od zmiennych do pobierania danych
  'js-1': 'Pierwsze kroki w JavaScript: Zmienne (const, let), tekst i liczby',
  'js-6': 'Podejmowanie decyzji w kodzie: Instrukcje warunkowe (if / else)',
  'js-8': 'Funkcje od podstaw: Jak zamknąć kod w wielokrotnie używane polecenie',
  'js-7': 'Listy danych (Tablice) i powtarzanie czynności za pomocą pętli (for)',
  'js-9': 'Obiekty (grupowanie danych) i zapisywanie w przeglądarce (LocalStorage)',
  'js-3': 'Ożywianie strony HTML: Kliknięcia przycisków (addEventListener) i zmiana tekstu na żywo (DOM)',
  'js-2': 'Nowoczesna praca z listami: metody map, filter oraz find',
  'js-4': 'Operacje w tle: obietnice (Promise) oraz składnia async / await',
  'js-5': 'Pobieranie danych z internetu: Fetch API i format JSON',
  'js-10': 'Dzielenie kodu na pliki (import / export) i wyłapywanie błędów (try / catch)',
};

export function normalizeAndOrderModules(rawModules: Module[]): Module[] {
  return rawModules.map((mod, modIdx) => {
    const sourceModId = mod.id;
    const newModuleId = modIdx + 1;
    const extraLessons = MISSING_CURRICULUM_LESSONS[sourceModId] || [];
    const combinedLessons = [...mod.lessons, ...extraLessons];
    const expectedIds = PEDAGOGICAL_LESSON_ORDER[sourceModId] || [];
    const lessonMap = new Map<string, Lesson>();
    for (const l of combinedLessons) {
      lessonMap.set(l.id, l);
    }

    const orderedLessons: Lesson[] = [];
    for (const id of expectedIds) {
      const found = lessonMap.get(id);
      if (found) {
        orderedLessons.push({
          ...found,
          title: FRIENDLY_LESSON_TITLES[found.id] || found.title,
        });
        lessonMap.delete(id);
      }
    }
    for (const remaining of lessonMap.values()) {
      orderedLessons.push({
        ...remaining,
        title: FRIENDLY_LESSON_TITLES[remaining.id] || remaining.title,
      });
    }

    const normalizedLessons: Lesson[] = orderedLessons.map((lesson, idx) => {
      let cleanPrerequisites: string[];
      if (idx === 0) {
        if (modIdx === 0) {
          cleanPrerequisites = ['Brak — zaczynamy całkowicie od zera!'];
        } else {
          const prevModShort = rawModules[modIdx - 1].title.split('—')[0].trim();
          cleanPrerequisites = [`Podstawy z Modułu ${modIdx} (${prevModShort})`];
        }
      } else {
        const prevLesson = orderedLessons[idx - 1];
        cleanPrerequisites = [`Lekcja ${idx}: ${prevLesson.title}`];
      }

      return {
        ...lesson,
        moduleId: newModuleId,
        moduleTitle: mod.title,
        order: idx + 1,
        prerequisites: cleanPrerequisites,
      };
    });

    const calculatedTotalXp = normalizedLessons.reduce((sum, l) => sum + l.xpReward, 0);

    return {
      ...mod,
      id: newModuleId,
      prerequisites:
        modIdx === 0
          ? ['Brak — zaczynamy całkowicie od zera!']
          : [`Moduł ${modIdx}: ${rawModules[modIdx - 1].title.split('—')[0].trim()}`],
      totalXp: calculatedTotalXp > 0 ? calculatedTotalXp : mod.totalXp,
      lessons: normalizedLessons,
    };
  });
}

/**
 * Pedagogical Module Order:
 * 1. Podstawy HTML (Tworzenie Pierwszych Stron od Zera)
 * 2. Podstawy CSS (Kolory, Czcionki i Układ Strony)
 * 3. Podstawy JavaScript (Ożywianie Stron i Logika)
 * 4. Narzędzia Programisty (Jak działa Internet, Edytor Kodu i Terminal)
 * 5. Git i Współpraca Zespołowa
 * 6–15. TypeScript, React, Node.js, Bazy danych, Bezpieczeństwo, Full Stack, Testy, DevOps, Next.js, Kariera
 */
const RAW_MODULES: Module[] = [
  MODULE_2, // 1: Podstawy HTML
  MODULE_3, // 2: CSS
  MODULE_4, // 3: JavaScript
  MODULE_1, // 4: Jak działa Internet, Edytor i Terminal
  MODULE_5, // 5: Git
  MODULE_6,
  MODULE_7,
  MODULE_8,
  MODULE_9,
  MODULE_10,
  ...MODULES_11_TO_15,
];

export const MODULES_DATA: Module[] = normalizeAndOrderModules(RAW_MODULES);

