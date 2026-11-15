import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizePathname,
  parsePublicLocation,
  buildPublicPath,
  isPublicTab,
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
