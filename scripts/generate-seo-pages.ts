import fs from 'node:fs';
import path from 'node:path';
import { MODULES_DATA } from '../src/data/modulesData';
import { GUIDES_DATA } from '../src/data/guidesData';
import {
  buildGuideJsonLd,
  estimateGuideReadingMinutes,
  getGuideBySlug,
  getGuideWordCount,
} from '../src/utils/guides';
import { getBeginnerLessonAid } from '../src/utils/lessonReadability';
import { getPublicRouteSeoMetadata, SITE_BASE_URL } from '../src/utils/publicRoutes';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

function escapeHtml(text: string): string {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function markdownToSimpleHtml(md: string): string {
  const blocks = String(md || '').split(/\n{2,}/);
  const parts: string[] = [];
  for (const rawBlock of blocks) {
    const block = rawBlock.trim();
    if (!block) continue;
    if (block.startsWith('```')) {
      const code = block.replace(/^```[^\n]*\n?/, '').replace(/\n?```$/, '');
      parts.push(`<pre><code>${escapeHtml(code)}</code></pre>`);
    } else if (block.startsWith('### ')) {
      parts.push(`<h3>${escapeHtml(block.slice(4))}</h3>`);
    } else if (block.startsWith('## ')) {
      parts.push(`<h2>${escapeHtml(block.slice(3))}</h2>`);
    } else if (block.startsWith('# ')) {
      parts.push(`<h2>${escapeHtml(block.slice(2))}</h2>`);
    } else {
      parts.push(`<p>${escapeHtml(block).replace(/\n/g, '<br />')}</p>`);
    }
  }
  return parts.join('\n');
}

const PRELOADER_HTML = `      <div class="fsda-preloader" aria-hidden="true">
        <div class="fsda-preloader-badge">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
        <div class="fsda-preloader-spinner"></div>
      </div>`;

function renderHtmlFromTemplate(
  templateHtml: string,
  params: {
    title: string;
    description: string;
    canonicalPath: string;
    bodyHtml: string;
    robots?: string;
    stripAdSenseScript?: boolean;
    jsonLd?: Record<string, unknown>;
  }
): string {
  const canonicalUrl = `${SITE_BASE_URL}${params.canonicalPath}`;
  let out = templateHtml;

  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(params.title)}</title>`);
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(params.description)}" />`
  );
  if (params.robots) {
    out = out.replace(
      /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="robots" content="${escapeHtml(params.robots)}" />`
    );
  }
  out = out.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(params.title)}" />`
  );
  out = out.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(params.description)}" />`
  );
  out = out.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`
  );
  out = out.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(params.title)}" />`
  );
  out = out.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(params.description)}" />`
  );
  out = out.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
  );

  if (params.jsonLd) {
    const safeJson = JSON.stringify(params.jsonLd).replace(/</g, '\\u003c');
    out = out.replace(
      /<\/head>/i,
      `    <script id="fsda-guide-jsonld" type="application/ld+json">${safeJson}</script>\n  </head>`
    );
  }

  if (params.stripAdSenseScript) {
    out = out.replace(
      /<script[^>]+src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^"]*"[^>]*>\s*<\/script>\s*/gi,
      ''
    );
  }

  const rootMarkerStart = out.indexOf('<!-- FSDA_ROOT_START -->');
  const rootMarkerEnd = out.indexOf('<!-- FSDA_ROOT_END -->');
  if (rootMarkerStart !== -1 && rootMarkerEnd !== -1 && rootMarkerEnd > rootMarkerStart) {
    out =
      out.slice(0, rootMarkerStart) +
      `<!-- FSDA_ROOT_START -->\n    <div id="root">\n${PRELOADER_HTML}\n      <div class="fsda-seo-fallback">\n${params.bodyHtml}\n      </div>\n    </div>\n    ` +
      out.slice(rootMarkerEnd);
    return out;
  }

  const rootStart = out.indexOf('<div id="root">');
  const bodyEnd = out.lastIndexOf('</body>');
  if (rootStart === -1 || bodyEnd === -1 || bodyEnd <= rootStart) {
    throw new Error('Could not locate <div id="root">...</body> in dist/index.html template');
  }

  out =
    out.slice(0, rootStart) +
    `<div id="root">\n${PRELOADER_HTML}\n      <div class="fsda-seo-fallback">\n${params.bodyHtml}\n      </div>\n    </div>\n  ` +
    out.slice(bodyEnd);

  return out;
}

function writeRoutePage(routePath: string, html: string) {
  const cleanRel = routePath.replace(/^\/+/, '');
  const targetDir = cleanRel ? path.join(DIST_DIR, cleanRel) : DIST_DIR;
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error('dist directory does not exist; run vite build first');
  }

  const distIndexPath = path.join(DIST_DIR, 'index.html');
  const templateHtml = fs.readFileSync(distIndexPath, 'utf8');

  const allLessons = MODULES_DATA.flatMap((m) => m.lessons);
  const sitemapUrls: string[] = [
    `${SITE_BASE_URL}/`,
    `${SITE_BASE_URL}/poradniki`,
    `${SITE_BASE_URL}/baza-wiedzy`,
    `${SITE_BASE_URL}/o-nas`,
    `${SITE_BASE_URL}/kontakt`,
    `${SITE_BASE_URL}/regulamin`,
    `${SITE_BASE_URL}/polityka-prywatnosci`,
    `${SITE_BASE_URL}/privacy-policy.html`,
  ];

  // 1a. Engineering Guides index (/poradniki)
  const guidesSeo = getPublicRouteSeoMetadata('guides');
  const guidesListHtml = GUIDES_DATA.map((guide) => {
    const readMins = estimateGuideReadingMinutes(guide);
    const words = getGuideWordCount(guide);
    return `<article style="margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #334155">
      <p style="font-size:13px;color:#94a3b8">${escapeHtml(guide.category)} · ${escapeHtml(guide.level)} · ~${readMins} min czytania (${words} słów) · Aktualizacja: ${escapeHtml(guide.updatedAt)}</p>
      <h2><a href="/poradniki/${escapeHtml(guide.slug)}">${escapeHtml(guide.title)}</a></h2>
      <p>${escapeHtml(guide.subtitle)}</p>
    </article>`;
  }).join('\n');

  writeRoutePage(
    '/poradniki',
    renderHtmlFromTemplate(templateHtml, {
      ...guidesSeo,
      bodyHtml: `<main style="max-width:920px;margin:0 auto;padding:32px 16px;font-family:sans-serif;line-height:1.7">
        <nav><a href="/">Strona Główna</a> | <a href="/poradniki">Poradniki Eksperckie</a> | <a href="/baza-wiedzy">Baza Wiedzy</a> | <a href="/o-nas">O Akademii</a> | <a href="/kontakt">Kontakt</a> | <a href="/regulamin">Regulamin</a> | <a href="/polityka-prywatnosci">Polityka Prywatności</a></nav>
        <h1>Poradniki Eksperckie — Programowanie Full Stack (${GUIDES_DATA.length} przewodników)</h1>
        <p>${escapeHtml(guidesSeo.description)}</p>
        ${guidesListHtml}
      </main>`,
    })
  );

  // 1b. All individual Engineering Guide pages (/poradniki/:slug)
  for (const guide of GUIDES_DATA) {
    const seo = getPublicRouteSeoMetadata('guide_detail', null, 'pl', guide);
    const readMins = estimateGuideReadingMinutes(guide);
    const words = getGuideWordCount(guide);
    sitemapUrls.push(`${SITE_BASE_URL}${seo.canonicalPath}`);

    const leadHtml = guide.leadParagraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n');

    const sectionsHtml = guide.sections
      .map((sec) => {
        const paragraphs = sec.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n');
        const bullets = sec.bulletPoints?.length
          ? `<ul>${sec.bulletPoints.map((b) => `<li>${escapeHtml(b)}</li>`).join('\n')}</ul>`
          : '';
        const codeBlock = sec.codeSnippet
          ? `<figure><figcaption><strong>${escapeHtml(sec.codeSnippet.title)}</strong></figcaption><pre><code>${escapeHtml(sec.codeSnippet.code)}</code></pre>${
              sec.codeSnippet.caption ? `<p>${escapeHtml(sec.codeSnippet.caption)}</p>` : ''
            }</figure>`
          : '';
        const tableBlock = sec.table
          ? `<table><caption>${escapeHtml(sec.table.caption)}</caption><thead><tr>${sec.table.headers
              .map((h) => `<th>${escapeHtml(h)}</th>`)
              .join('')}</tr></thead><tbody>${sec.table.rows
              .map(
                (row) =>
                  `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`
              )
              .join('')}</tbody></table>`
          : '';
        return `<section id="${escapeHtml(sec.id)}"><h2>${escapeHtml(sec.heading)}</h2>${paragraphs}${bullets}${codeBlock}${tableBlock}</section>`;
      })
      .join('\n');

    const takeawaysHtml = guide.keyTakeaways.length
      ? `<section><h2>Najważniejsze wnioski</h2><ul>${guide.keyTakeaways
          .map((t) => `<li>${escapeHtml(t)}</li>`)
          .join('\n')}</ul></section>`
      : '';

    const faqHtml = guide.faq.length
      ? `<section><h2>Najczęstsze pytania (FAQ)</h2>${guide.faq
          .map((item) => `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`)
          .join('\n')}</section>`
      : '';

    const relatedLessonsHtml = guide.relatedLessonIds
      .map((id) => allLessons.find((l) => l.id === id))
      .filter((l): l is NonNullable<typeof l> => Boolean(l))
      .map(
        (l) => `<li><a href="/baza-wiedzy/${escapeHtml(l.id)}">${escapeHtml(l.title)}</a></li>`
      )
      .join('\n');

    const relatedGuidesHtml = guide.relatedGuideSlugs
      .map((slug) => getGuideBySlug(GUIDES_DATA, slug))
      .filter((g): g is NonNullable<typeof g> => Boolean(g))
      .map(
        (g) => `<li><a href="/poradniki/${escapeHtml(g.slug)}">${escapeHtml(g.title)}</a></li>`
      )
      .join('\n');

    const guideBodyHtml = `<main style="max-width:860px;margin:0 auto;padding:32px 16px;font-family:sans-serif;line-height:1.75">
      <nav><a href="/">Strona Główna</a> / <a href="/poradniki">Poradniki Eksperckie</a> / ${escapeHtml(guide.category)}</nav>
      <article>
        <header>
          <p>${escapeHtml(guide.category)} · ${escapeHtml(guide.level)} · ~${readMins} min czytania (${words} słów) · Autor: ${escapeHtml(guide.authorName)} · Aktualizacja: ${escapeHtml(guide.updatedAt)}</p>
          <h1>${escapeHtml(guide.title)}</h1>
          <p><strong>${escapeHtml(guide.subtitle)}</strong></p>
          ${leadHtml}
        </header>
        ${sectionsHtml}
        ${takeawaysHtml}
        ${faqHtml}
      </article>
      ${relatedLessonsHtml ? `<section><h2>Powiązane lekcje w Bazie Wiedzy</h2><ul>${relatedLessonsHtml}</ul></section>` : ''}
      ${relatedGuidesHtml ? `<section><h2>Przeczytaj także</h2><ul>${relatedGuidesHtml}</ul></section>` : ''}
      <footer style="margin-top:32px"><a href="/poradniki">Wszystkie poradniki</a> · <a href="/baza-wiedzy">Baza Wiedzy</a> · <a href="/o-nas">O Akademii</a> · <a href="/kontakt">Kontakt</a> · <a href="/regulamin">Regulamin</a> · <a href="/polityka-prywatnosci">Polityka Prywatności</a></footer>
    </main>`;

    writeRoutePage(
      seo.canonicalPath,
      renderHtmlFromTemplate(templateHtml, {
        ...seo,
        bodyHtml: guideBodyHtml,
        jsonLd: buildGuideJsonLd(guide),
      })
    );
  }

  // 2. Knowledge Base index (/baza-wiedzy)
  const kbSeo = getPublicRouteSeoMetadata('knowledge_base');
  const kbListHtml = MODULES_DATA.map((mod) => {
    const items = mod.lessons
      .map(
        (l) =>
          `<li><a href="/baza-wiedzy/${escapeHtml(l.id)}">${escapeHtml(l.title)}</a> — ${escapeHtml(l.summary)}</li>`
      )
      .join('\n');
    return `<section><h2>Moduł ${mod.id}: ${escapeHtml(mod.title)}</h2><p>${escapeHtml(mod.description)}</p><ul>${items}</ul></section>`;
  }).join('\n');

  writeRoutePage(
    '/baza-wiedzy',
    renderHtmlFromTemplate(templateHtml, {
      ...kbSeo,
      bodyHtml: `<main style="max-width:920px;margin:0 auto;padding:32px 16px;font-family:sans-serif;line-height:1.65">
        <nav><a href="/">Strona Główna</a> | <a href="/poradniki">Poradniki</a> | <a href="/baza-wiedzy">Baza Wiedzy</a> | <a href="/o-nas">O Akademii</a> | <a href="/kontakt">Kontakt</a> | <a href="/regulamin">Regulamin</a> | <a href="/polityka-prywatnosci">Polityka Prywatności</a></nav>
        <h1>Otwarta Baza Wiedzy — ${allLessons.length} darmowych lekcji programowania</h1>
        <p>${escapeHtml(kbSeo.description)}</p>
        ${kbListHtml}
      </main>`,
    })
  );

  // 2. All individual public lesson pages (/baza-wiedzy/:id)
  for (let i = 0; i < allLessons.length; i++) {
    const lesson = allLessons[i];
    const prev = i > 0 ? allLessons[i - 1] : null;
    const next = i < allLessons.length - 1 ? allLessons[i + 1] : null;
    const aid = getBeginnerLessonAid(lesson);
    const seo = getPublicRouteSeoMetadata('public_lesson', lesson);

    sitemapUrls.push(`${SITE_BASE_URL}${seo.canonicalPath}`);

    const glossaryHtml = aid.glossary
      .map((g) => `<dt><strong>${escapeHtml(g.term)}</strong></dt><dd>${escapeHtml(g.simpleDefinition)}</dd>`)
      .join('\n');
    const takeawaysHtml = aid.keyTakeaways.map((k) => `<li>${escapeHtml(k)}</li>`).join('\n');

    const objectivesHtml = (lesson.objectives || [])
      .map((obj) => `<li>${escapeHtml(obj)}</li>`)
      .join('\n');
    const codeExamplesHtml = (lesson.codeExamples || [])
      .map(
        (ex) =>
          `<section><h3>${escapeHtml(ex.title)}</h3><pre><code>${escapeHtml(ex.code)}</code></pre><p>${escapeHtml(ex.explanation)}</p></section>`
      )
      .join('\n');
    const stepsHtml = (lesson.stepByStepGuide || [])
      .map(
        (s) =>
          `<li><strong>Krok ${s.step}: ${escapeHtml(s.title)}</strong> — ${escapeHtml(s.description)}</li>`
      )
      .join('\n');
    const mistakesHtml = (lesson.commonMistakes || [])
      .map(
        (m) =>
          `<section><h3>Błąd: ${escapeHtml(m.mistake)}</h3><p><strong>Dlaczego powstaje:</strong> ${escapeHtml(m.whyItHappens)}</p><p><strong>Jak naprawić:</strong> ${escapeHtml(m.howToFix)}</p><pre><code>${escapeHtml(m.goodCode)}</code></pre></section>`
      )
      .join('\n');

    const bodyHtml = `<main style="max-width:860px;margin:0 auto;padding:32px 16px;font-family:sans-serif;line-height:1.7">
      <nav><a href="/">Strona Główna</a> / <a href="/baza-wiedzy">Baza Wiedzy</a> / ${escapeHtml(lesson.moduleTitle)}</nav>
      <article>
        <h1>${escapeHtml(lesson.title)}</h1>
        <p><strong>Podsumowanie:</strong> ${escapeHtml(lesson.summary)}</p>
        ${objectivesHtml ? `<section><h2>Cele lekcji</h2><ul>${objectivesHtml}</ul></section>` : ''}
        <section><h2>Analogia: ${escapeHtml(aid.analogyTitle)}</h2><p>${escapeHtml(aid.analogyText)}</p></section>
        ${glossaryHtml ? `<section><h2>Słowniczek pojęć</h2><dl>${glossaryHtml}</dl></section>` : ''}
        <section><h2>Materiał lekcji</h2>${markdownToSimpleHtml(lesson.theoryMarkdown)}</section>
        ${codeExamplesHtml ? `<section><h2>Przykłady kodu</h2>${codeExamplesHtml}</section>` : ''}
        ${stepsHtml ? `<section><h2>Instrukcja krok po kroku</h2><ol>${stepsHtml}</ol></section>` : ''}
        ${mistakesHtml ? `<section><h2>Najczęstsze błędy i dobre praktyki</h2>${mistakesHtml}</section>` : ''}
        ${takeawaysHtml ? `<section><h2>Najważniejsze wnioski</h2><ul>${takeawaysHtml}</ul></section>` : ''}
      </article>
      <nav style="margin-top:32px">
        ${prev ? `<a href="/baza-wiedzy/${escapeHtml(prev.id)}">← ${escapeHtml(prev.title)}</a>` : ''}
        ${prev && next ? ' | ' : ''}
        ${next ? `<a href="/baza-wiedzy/${escapeHtml(next.id)}">${escapeHtml(next.title)} →</a>` : ''}
      </nav>
      <footer style="margin-top:32px"><a href="/o-nas">O Akademii</a> · <a href="/kontakt">Kontakt</a> · <a href="/regulamin">Regulamin</a> · <a href="/polityka-prywatnosci">Polityka Prywatności</a></footer>
    </main>`;

    writeRoutePage(
      seo.canonicalPath,
      renderHtmlFromTemplate(templateHtml, {
        ...seo,
        bodyHtml,
      })
    );
  }

  // 3. Trust & Policy pages (/o-nas, /kontakt, /regulamin, /polityka-prywatnosci)
  const staticPages: Array<{ tab: 'about' | 'contact' | 'terms' | 'privacy'; h1: string; content: string }> = [
    {
      tab: 'about',
      h1: 'O Full Stack Developer Academy (fsda.tech)',
      content: `<section>
        <h2>Nasza misja i metodyka edukacyjna</h2>
        <p>Full Stack Developer Academy (<strong>fsda.tech</strong>) to otwarta, dwujęzyczna platforma edukacyjna ucząca projektowania i programowania nowoczesnych aplikacji webowych od podstaw do poziomu Full Stack Developera. Program został stworzony specjalnie z myślą o osobach początkujących, które potrzebują przystępnych analogii zamiast suchej teorii akademickiej.</p>
        <p>Każda z ${allLessons.length} lekcji w ${MODULES_DATA.length} modułach zawiera podsumowanie celów nauki, prostą analogię z codziennego życia, słowniczek pojęć, przykłady kodu z komentarzem, instrukcję krok po kroku oraz sekcję najczęstszych błędów wraz z rozwiązaniami.</p>
      </section>
      <section>
        <h2>Zakres materiału i praktyczne narzędzia</h2>
        <ul>
          <li><strong>${MODULES_DATA.length} modułów tematycznych i ${allLessons.length} otwartych lekcji:</strong> HTML5, CSS3, Flexbox, Grid, JavaScript ES2025, TypeScript, React 19, Node.js, PostgreSQL, bezpieczeństwo OWASP, testy automatyczne, Docker, CI/CD oraz przygotowanie do rekrutacji IT.</li>
          <li><strong>6 interaktywnych symulatorów:</strong> piaskownica HTML/CSS/JS na żywo, terminal Bash &amp; Git, studio zapytań SQL JOIN, studio REST API, wizualizator Event Loop oraz egzamin Live Coding.</li>
          <li><strong>12 projektów do portfolio:</strong> rozbudowane specyfikacje biznesowe wraz z checklistą architektury i możliwością podpięcia repozytorium GitHub.</li>
        </ul>
      </section>
      <section>
        <h2>Model otwartego dostępu</h2>
        <p>Wszystkie lekcje w <a href="/baza-wiedzy">Otwartej Bazie Wiedzy</a> oraz narzędzia w aplikacji są obecnie dostępne bezpłatnie (Edycja Otwarta wspierana przez Google AdSense), aby każdy mógł nauczyć się programowania bez bariery finansowej.</p>
      </section>`,
    },
    {
      tab: 'contact',
      h1: 'Kontakt — Full Stack Developer Academy',
      content: `<section>
        <h2>Dane kontaktowe i wsparcie merytoryczne</h2>
        <p>Serwis edukacyjny <strong>Full Stack Developer Academy</strong> (fsda.tech) prowadzony jest z myślą o społeczności uczącej się programowania webowego. Odpowiadamy na pytania techniczne, zgłoszenia błędów w zadaniach, sugestie nowych lekcji oraz wnioski dotyczące prywatności i RODO.</p>
        <ul>
          <li><strong>Bezpośredni adres e-mail:</strong> <a href="mailto:zordonzordon1@gmail.com">zordonzordon1@gmail.com</a></li>
          <li><strong>Czas odpowiedzi:</strong> standardowo w ciągu 24–48 godzin w dni robocze.</li>
          <li><strong>Języki korespondencji:</strong> polski i angielski.</li>
        </ul>
      </section>
      <section>
        <h2>Zakres zgłoszeń obsługiwanych mailowo</h2>
        <ul>
          <li>Uwagi merytoryczne dotyczące lekcji, testów jednostkowych i projektów w bazie wiedzy.</li>
          <li>Wsparcie techniczne przy synchronizacji konta kursanta lub repozytorium GitHub.</li>
          <li>Wnioski o wgląd, poprawę lub usunięcie danych osobowych na podstawie RODO.</li>
          <li>Pytania dotyczące współpracy edukacyjnej, zasad wyświetlania reklam i bezpieczeństwa serwisu.</li>
        </ul>
        <p>Zapraszamy również do przeglądu <a href="/polityka-prywatnosci">Polityki Prywatności</a> oraz <a href="/regulamin">Regulaminu serwisu</a>.</p>
      </section>`,
    },
    {
      tab: 'terms',
      h1: 'Regulamin serwisu Full Stack Developer Academy',
      content: `<section>
        <h2>1. Postanowienia ogólne</h2>
        <p>Serwis internetowy dostępny pod adresem <strong>fsda.tech</strong> oraz powiązana aplikacja edukacyjna udostępniają materiały szkoleniowe z zakresu programowania webowego oraz interaktywne środowisko ćwiczeniowe. Właścicielem i administratorem serwisu jest Full Stack Developer Academy (kontakt: <a href="mailto:zordonzordon1@gmail.com">zordonzordon1@gmail.com</a>).</p>
      </section>
      <section>
        <h2>2. Dostęp bezpłatny i konta użytkowników</h2>
        <p>Otwarta Baza Wiedzy na fsda.tech zawierająca ${allLessons.length} lekcji i przykładów kodu jest dostępna nieodpłatnie i bez rejestracji. Założenie bezpłatnego konta kursanta umożliwia zapis postępów w chmurze, korzystanie z edytora kodu, symulatorów, 12 projektów praktycznych, integracji GitHub oraz uzyskanie certyfikatu — wszystkie te funkcje są obecnie w 100% bezpłatne dzięki wsparciu reklam Google AdSense.</p>
      </section>
      <section>
        <h2>3. Prawa autorskie i dopuszczalny użytek</h2>
        <p>Treści lekcji, opisy projektów, grafiki oraz układ platformy podlegają ochronie prawnej. Użytkownicy mogą wykorzystywać fragmenty kodu z lekcji do własnej nauki i własnych projektów portfolio. Zabronione jest automatyczne masowe kopiowanie oraz dalsze komercyjne odsprzedawanie całego kursu bez zgody administratora.</p>
      </section>
      <section>
        <h2>4. Usunięcie konta i zgłoszenia reklamacyjne</h2>
        <p>Użytkownik ma prawo w każdej chwili zrezygnować z korzystania z serwisu i zażądać trwałego usunięcia swojego konta wraz z zapisanymi postępami, wysyłając wiadomość na adres <a href="mailto:zordonzordon1@gmail.com">zordonzordon1@gmail.com</a>.</p>
      </section>`,
    },
    {
      tab: 'privacy',
      h1: 'Polityka Prywatności i Plików Cookie (RODO / Google AdSense)',
      content: `<section>
        <h2>1. Administrator danych</h2>
        <p>Administratorem serwisu Full Stack Developer Academy (<strong>fsda.tech</strong>) jest twórca platformy, dostępny pod adresem e-mail: <a href="mailto:zordonzordon1@gmail.com">zordonzordon1@gmail.com</a>.</p>
      </section>
      <section>
        <h2>2. Jakie dane przetwarzamy i w jakim celu</h2>
        <ul>
          <li><strong>Przeglądanie bez konta:</strong> Otwarta Baza Wiedzy dostępna jest bez rejestracji. W pamięci lokalnej przeglądarki (localStorage) mogą być zapisywane wyłącznie preferencje interfejsu (motyw jasny/ciemny, język PL/EN) oraz Twój wybór dotyczący plików cookie.</li>
          <li><strong>Konto kursanta (Firebase Authentication i Firestore):</strong> Po dobrowolnym zalogowaniu zapisujemy imię, adres e-mail, postępy ukończonych lekcji, punkty XP oraz napisane rozwiązania, aby umożliwić synchronizację nauki między urządzeniami i wygenerowanie certyfikatu.</li>
        </ul>
      </section>
      <section>
        <h2>3. Reklamy Google AdSense i pliki cookie dostawców zewnętrznych</h2>
        <p>Aby utrzymywać bezpłatny dostęp do materiałów edukacyjnych, serwis może wyświetlać reklamy za pośrednictwem usługi <strong>Google AdSense</strong> (dostawca: Google Ireland Limited).</p>
        <ul>
          <li>Dostawcy zewnętrzni, w tym Google, używają plików cookie do wyświetlania reklam na podstawie wcześniejszych odwiedzin użytkownika w tej witrynie lub w innych witrynach.</li>
          <li>Użytkownik może zarządzać personalizacją reklam w <a href="https://myadcenter.google.com/" rel="noopener noreferrer">Ustawieniach reklam Google</a> lub zrezygnować z plików cookie firm zewnętrznych na stronie <a href="https://optout.aboutads.info/" rel="noopener noreferrer">aboutads.info</a>.</li>
          <li>Platforma zapewnia ponadto interaktywny baner zgody na pliki cookie pozwalający wybrać pomiędzy wszystkimi plikami cookie a wyłącznie niezbędnymi plikami technicznymi.</li>
        </ul>
      </section>
      <section>
        <h2>4. Prawa użytkownika wynikające z RODO</h2>
        <p>Masz prawo dostępu do swoich danych, ich sprostowania, przenoszenia oraz żądania usunięcia konta w dowolnym momencie poprzez kontakt na adres <a href="mailto:zordonzordon1@gmail.com">zordonzordon1@gmail.com</a>.</p>
      </section>`,
    },
  ];

  for (const sp of staticPages) {
    const seo = getPublicRouteSeoMetadata(sp.tab);
    writeRoutePage(
      seo.canonicalPath,
      renderHtmlFromTemplate(templateHtml, {
        ...seo,
        bodyHtml: `<main style="max-width:860px;margin:0 auto;padding:32px 16px;font-family:sans-serif;line-height:1.7">
          <nav><a href="/">Strona Główna</a> | <a href="/poradniki">Poradniki</a> | <a href="/baza-wiedzy">Baza Wiedzy</a> | <a href="/o-nas">O Akademii</a> | <a href="/kontakt">Kontakt</a> | <a href="/regulamin">Regulamin</a> | <a href="/polityka-prywatnosci">Polityka Prywatności</a></nav>
          <h1>${escapeHtml(sp.h1)}</h1>
          ${sp.content}
        </main>`,
      })
    );
  }

  // 4. Student Workspace entry (/app) — noindex + no AdSense auto-execution on the login gate
  writeRoutePage(
    '/app',
    renderHtmlFromTemplate(templateHtml, {
      title: 'Pulpit Kursanta | Full Stack Developer Academy',
      description:
        'Interaktywny pulpit kursanta Full Stack Developer Academy — logowanie do zapisanych postępów, symulatorów i projektów.',
      canonicalPath: '/app',
      robots: 'noindex, nofollow',
      stripAdSenseScript: true,
      bodyHtml: `<main style="max-width:720px;margin:0 auto;padding:48px 16px;font-family:sans-serif;line-height:1.7">
        <h1>Pulpit Kursanta — Full Stack Developer Academy</h1>
        <p>Ta sekcja wymaga aktywnej sesji przeglądarki lub zalogowania na bezpłatne konto ucznia.</p>
        <p>Jeśli szukasz bezpłatnych materiałów edukacyjnych bez logowania, odwiedź nasze <a href="/poradniki">Poradniki Eksperckie (${GUIDES_DATA.length} artykułów)</a>, <a href="/baza-wiedzy">Otwartą Bazę Wiedzy (${allLessons.length} lekcji)</a> lub <a href="/">Stronę Główną</a>.</p>
      </main>`,
    })
  );

  // 5. Write sitemap.xml to both public/ and dist/
  const today = new Date().toISOString().split('T')[0];
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls
    .map(
      (url, idx) =>
        `  <url>\n    <loc>${escapeHtml(url)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${idx === 0 ? '1.0' : idx < 8 || url.includes('/poradniki/') ? '0.9' : '0.8'}</priority>\n  </url>`
    )
    .join('\n')}\n</urlset>\n`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

  console.log(
    `Generated ${GUIDES_DATA.length + allLessons.length + staticPages.length + 3} static SEO/app route pages + sitemap.xml (${sitemapUrls.length} URLs).`
  );
}

main();
