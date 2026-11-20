import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizePathname,
  parsePublicLocation,
  buildPublicPath,
  isPublicTab,
  isInstalledMobileAppRuntime,
  getPublicRouteSeoMetadata,
} from './publicRoutes';

const SAMPLE_IDS = new Set(['html-7', 'css-1', 'js-1', 'db-1']);

test('normalizePathname strips trailing slashes and query/hash fragments', () => {
  assert.equal(normalizePathname('/'), '/');
  assert.equal(normalizePathname('/baza-wiedzy/'), '/baza-wiedzy');
  assert.equal(normalizePathname('/o-nas///?ref=footer#top'), '/o-nas');
  assert.equal(normalizePathname('/baza-wiedzy/html-7/'), '/baza-wiedzy/html-7');
});

test('parsePublicLocation resolves public routes without authentication walls', () => {
  assert.deepEqual(parsePublicLocation('/', SAMPLE_IDS), { tab: 'landing' });
  assert.deepEqual(parsePublicLocation('/baza-wiedzy', SAMPLE_IDS), { tab: 'knowledge_base' });
  assert.deepEqual(parsePublicLocation('/baza-wiedzy/html-7', SAMPLE_IDS), {
    tab: 'public_lesson',
    lessonId: 'html-7',
  });
  assert.deepEqual(parsePublicLocation('/baza-wiedzy/unknown-id', SAMPLE_IDS), {
    tab: 'knowledge_base',
  });
  assert.deepEqual(parsePublicLocation('/o-nas', SAMPLE_IDS), { tab: 'about' });
  assert.deepEqual(parsePublicLocation('/kontakt', SAMPLE_IDS), { tab: 'contact' });
  assert.deepEqual(parsePublicLocation('/regulamin', SAMPLE_IDS), { tab: 'terms' });
  assert.deepEqual(parsePublicLocation('/polityka-prywatnosci', SAMPLE_IDS), { tab: 'privacy' });
  assert.equal(parsePublicLocation('/app', SAMPLE_IDS), null);
  assert.equal(parsePublicLocation('/app/dashboard', SAMPLE_IDS), null);
});

test('buildPublicPath and isPublicTab return canonical URLs cleanly', () => {
  assert.equal(isPublicTab('knowledge_base'), true);
  assert.equal(isPublicTab('public_lesson'), true);
  assert.equal(isPublicTab('dashboard'), false);

  assert.equal(buildPublicPath('landing'), '/');
  assert.equal(buildPublicPath('knowledge_base'), '/baza-wiedzy');
  assert.equal(buildPublicPath('public_lesson', 'html-7'), '/baza-wiedzy/html-7');
  assert.equal(buildPublicPath('about'), '/o-nas');
  assert.equal(buildPublicPath('privacy'), '/polityka-prywatnosci');
  assert.equal(buildPublicPath('dashboard'), null);
});

test('getPublicRouteSeoMetadata produces lesson-specific metadata and canonical paths', () => {
  const meta = getPublicRouteSeoMetadata('public_lesson', {
    id: 'html-7',
    title: 'Pierwsze znaczniki HTML',
    summary: 'Dowiedz się, jak działają nagłówki i akapity.',
    moduleTitle: 'Moduł 1',
  });
  assert.equal(meta.canonicalPath, '/baza-wiedzy/html-7');
  assert.match(meta.title, /Pierwsze znaczniki HTML/);
  assert.equal(meta.description, 'Dowiedz się, jak działają nagłówki i akapity.');
});

test('all 96 lessons across 15 modules (including 14 HTML5 lessons) have valid interactive exercises', async () => {
  const { MODULES_DATA } = await import('../data/modulesData');
  const { validateExerciseCode } = await import('./codeRunner');

  assert.equal(MODULES_DATA.length, 15);
  assert.equal(MODULES_DATA[0].lessons.length, 14);

  const allLessons = MODULES_DATA.flatMap((m) => m.lessons);
  assert.equal(allLessons.length, 96);

  for (const lesson of allLessons) {
    assert.ok(lesson.theoryMarkdown.length > 500, `Lesson ${lesson.id} theory too short`);
    const sol = validateExerciseCode(lesson.interactiveExercise, lesson.interactiveExercise.solutionCode);
    assert.equal(sol.allPassed, true, `Solution failed for ${lesson.id}`);
    const start = validateExerciseCode(lesson.interactiveExercise, lesson.interactiveExercise.starterCode);
    assert.equal(start.allPassed, false, `Starter already passed for ${lesson.id}`);
  }
});

test('SITE_BASE_URL, robots.txt, and privacy-policy.html target https://fsda.tech without legacy staging domains', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const { SITE_BASE_URL } = await import('./publicRoutes');

  assert.equal(SITE_BASE_URL, 'https://fsda.tech');

  const robotsTxt = fs.readFileSync(path.resolve('public/robots.txt'), 'utf8');
  assert.match(robotsTxt, /Sitemap:\s*https:\/\/fsda\.tech\/sitemap\.xml/);
  assert.doesNotMatch(robotsTxt, /fsda-phi\.vercel\.app/);

  const privacyHtml = fs.readFileSync(path.resolve('public/privacy-policy.html'), 'utf8');
  assert.match(privacyHtml, /https:\/\/fsda\.tech/);
  assert.doesNotMatch(privacyHtml, /fsda-phi\.vercel\.app/);
});

test('index.html and generate-seo-pages hide static crawler HTML during JS boot while keeping it visible for non-JS crawlers', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');

  const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf8');
  assert.match(indexHtml, /root\.classList\.add\(resolved,\s*'fsda-js-booting'\)/);
  assert.match(indexHtml, /html\.fsda-js-booting\s+\.fsda-seo-fallback\s*\{\s*display:\s*none\s*!important;/);
  assert.match(indexHtml, /class="fsda-preloader"/);
  assert.match(indexHtml, /class="fsda-seo-fallback"/);
  assert.match(indexHtml, /<!-- FSDA_ROOT_START -->[\s\S]*<!-- FSDA_ROOT_END -->/);

  const seoGen = fs.readFileSync(path.resolve('scripts/generate-seo-pages.ts'), 'utf8');
  assert.match(seoGen, /fsda-preloader/);
  assert.match(seoGen, /<div class="fsda-seo-fallback">/);
  assert.match(seoGen, /FSDA_ROOT_START/);
});

test('isInstalledMobileAppRuntime detects Android TWA, iOS PWA, and Expo WebView without affecting web browsers', () => {
  // Normal desktop & mobile browsers stay on public landing page
  assert.equal(
    isInstalledMobileAppRuntime({
      displayModeStandalone: false,
      navigatorStandalone: false,
      referrer: 'https://www.google.com/',
      userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 Chrome/131.0.0.0 Mobile Safari/537.36',
    }),
    false
  );

  // Links clicked from Gmail / Telegram on Android must NOT falsely trigger standalone app mode
  assert.equal(
    isInstalledMobileAppRuntime({
      displayModeStandalone: false,
      referrer: 'android-app://com.google.android.gm/',
      userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 Chrome/131.0.0.0 Mobile Safari/537.36',
    }),
    false
  );

  // Android TWA (Google Play app) via standalone display mode or package referrer
  assert.equal(
    isInstalledMobileAppRuntime({ displayModeStandalone: true }),
    true
  );
  assert.equal(
    isInstalledMobileAppRuntime({ referrer: 'android-app://com.fullstackacademy.app/' }),
    true
  );

  // iOS home screen PWA
  assert.equal(
    isInstalledMobileAppRuntime({ navigatorStandalone: true }),
    true
  );

  // Expo mobile WebView app
  assert.equal(
    isInstalledMobileAppRuntime({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) AppleWebKit/605.1.15 FullStackAcademyExpo/3.0.0',
    }),
    true
  );
});



