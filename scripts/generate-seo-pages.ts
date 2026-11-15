import fs from 'node:fs';
import path from 'node:path';
import { MODULES_DATA } from '../src/data/modulesData';
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

function renderHtmlFromTemplate(
  templateHtml: string,
  params: {
    title: string;
    description: string;
    canonicalPath: string;
    bodyHtml: string;
  }
): string {
  const canonicalUrl = `${SITE_BASE_URL}${params.canonicalPath}`;
  let out = templateHtml;

  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(params.title)}</title>`);
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(params.description)}" />`
  );
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
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
  );

  const rootStart = out.indexOf('<div id="root">');
  const bodyEnd = out.lastIndexOf('</body>');
  if (rootStart === -1 || bodyEnd === -1 || bodyEnd <= rootStart) {
    throw new Error('Could not locate <div id="root">...</body> in dist/index.html template');
  }

  out =
    out.slice(0, rootStart) +
    `<div id="root">\n${params.bodyHtml}\n    </div>\n  ` +
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
    `${SITE_BASE_URL}/baza-wiedzy`,
    `${SITE_BASE_URL}/o-nas`,
    `${SITE_BASE_URL}/kontakt`,
    `${SITE_BASE_URL}/regulamin`,
    `${SITE_BASE_URL}/polityka-prywatnosci`,
    `${SITE_BASE_URL}/privacy-policy.html`,
  ];

  // 1. Knowledge Base index (/baza-wiedzy)
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
        <nav><a href="/">Strona Główna</a> | <a href="/baza-wiedzy">Baza Wiedzy</a> | <a href="/o-nas">O Akademii</a> | <a href="/kontakt">Kontakt</a></nav>
        <h1>Otwarta Baza Wiedzy — ${allLessons.length} darmowych lekcji programowania</h1>
        <p>${escapeHtml(kbSeo.description)}</p>
        ${kbListHtml}
      </main>`,
    })
  );

  // 2. All 91 individual public lesson pages (/baza-wiedzy/:id)
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
      h1: 'O Full Stack Developer Academy',
      content: `<p>Full Stack Developer Academy to polska platforma edukacyjna ucząca programowania od zera aż po poziom Full Stack Developera (HTML5, CSS, JavaScript, TypeScript, React, Node.js, PostgreSQL, Docker).</p>
      <p>Oferujemy ${MODULES_DATA.length} modułów oraz ${allLessons.length} pełnych lekcji dostępnych bezpłatnie w naszej Otwartej Bazie Wiedzy, bez konieczności rejestracji.</p>
      <p><a href="/baza-wiedzy">Przeglądaj wszystkie ${allLessons.length} lekcji</a></p>`,
    },
    {
      tab: 'contact',
      h1: 'Kontakt — Full Stack Developer Academy',
      content: `<p>W sprawach merytorycznych, technicznych oraz zgłoszeń RODO prosimy o kontakt e-mail na adres: <a href="mailto:zordonzordon1@gmail.com">zordonzordon1@gmail.com</a>.</p>`,
    },
    {
      tab: 'terms',
      h1: 'Regulamin serwisu Full Stack Developer Academy',
      content: `<p>Otwarta Baza Wiedzy na fsda-phi.vercel.app dostępna jest nieodpłatnie i bez rejestracji. Konta użytkowników służą do zapisywania postępów nauki w aplikacji ćwiczeniowej. Kontakt: <a href="mailto:zordonzordon1@gmail.com">zordonzordon1@gmail.com</a>.</p>`,
    },
    {
      tab: 'privacy',
      h1: 'Polityka Prywatności i Cookies (RODO / Google AdSense)',
      content: `<p>Serwis Full Stack Developer Academy przetwarza dane kont użytkowników wyłącznie w celu synchronizacji postępów (Firebase Authentication / Firestore). W celu finansowania darmowej bazy wiedzy serwis może wykorzystywać pliki cookie Google AdSense (rezygnacja dostępna w Ustawieniach reklam Google). Kontakt RODO: <a href="mailto:zordonzordon1@gmail.com">zordonzordon1@gmail.com</a>.</p>`,
    },
  ];

  for (const sp of staticPages) {
    const seo = getPublicRouteSeoMetadata(sp.tab);
    writeRoutePage(
      seo.canonicalPath,
      renderHtmlFromTemplate(templateHtml, {
        ...seo,
        bodyHtml: `<main style="max-width:860px;margin:0 auto;padding:32px 16px;font-family:sans-serif;line-height:1.7">
          <nav><a href="/">Strona Główna</a> | <a href="/baza-wiedzy">Baza Wiedzy</a> | <a href="/o-nas">O Akademii</a> | <a href="/kontakt">Kontakt</a> | <a href="/regulamin">Regulamin</a> | <a href="/polityka-prywatnosci">Polityka Prywatności</a></nav>
          <h1>${escapeHtml(sp.h1)}</h1>
          ${sp.content}
        </main>`,
      })
    );
  }

  // 4. Write sitemap.xml to both public/ and dist/
  const today = new Date().toISOString().split('T')[0];
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls
    .map(
      (url, idx) =>
        `  <url>\n    <loc>${escapeHtml(url)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${idx === 0 ? '1.0' : idx < 7 ? '0.9' : '0.8'}</priority>\n  </url>`
    )
    .join('\n')}\n</urlset>\n`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

  console.log(
    `Generated ${allLessons.length + staticPages.length + 1} static SEO route pages + sitemap.xml (${sitemapUrls.length} URLs).`
  );
}

main();
