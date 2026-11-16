import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULES_DATA } from '../data/modulesData';

const MIN_THEORY_WORDS = 200;

test('curriculum contains 15 modules and 96 unique lessons', () => {
  assert.equal(MODULES_DATA.length, 15);

  const allLessons = MODULES_DATA.flatMap((mod) => mod.lessons);
  assert.ok(allLessons.length >= 96, `Expected at least 96 lessons, got ${allLessons.length}`);

  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const lesson of allLessons) {
    assert.ok(!ids.has(lesson.id), `Duplicate lesson id: ${lesson.id}`);
    ids.add(lesson.id);

    assert.ok(lesson.slug.trim().length > 0, `Missing slug on lesson ${lesson.id}`);
    assert.ok(!slugs.has(lesson.slug), `Duplicate lesson slug: ${lesson.slug}`);
    slugs.add(lesson.slug);
  }
});

test('every lesson has substantial educational theory (>= 200 words) and complete learning blocks', () => {
  const shortLessons: Array<{ id: string; words: number }> = [];

  for (const mod of MODULES_DATA) {
    for (const lesson of mod.lessons) {
      const words = lesson.theoryMarkdown.trim().split(/\s+/).filter(Boolean).length;
      if (words < MIN_THEORY_WORDS) {
        shortLessons.push({ id: lesson.id, words });
      }

      assert.ok(
        lesson.summary.trim().length >= 20,
        `Lesson ${lesson.id} summary is missing or too short`
      );
      assert.ok(
        lesson.codeExamples.length >= 1,
        `Lesson ${lesson.id} must have at least one codeExample`
      );
      assert.ok(
        Array.isArray(lesson.quiz) && lesson.quiz.length >= 1,
        `Lesson ${lesson.id} must have at least one quiz question`
      );
      for (const question of lesson.quiz) {
        assert.ok(
          question.options.length >= 3 &&
            question.correctAnswer >= 0 &&
            question.correctAnswer < question.options.length,
          `Lesson ${lesson.id} quiz question ${question.id} has an invalid configuration`
        );
      }
      assert.ok(
        lesson.interactiveExercise.rules.length >= 1,
        `Lesson ${lesson.id} must have interactiveExercise validation rules`
      );
    }
  }

  assert.deepEqual(
    shortLessons,
    [],
    `Found lessons below ${MIN_THEORY_WORDS} words: ${JSON.stringify(shortLessons)}`
  );
});
