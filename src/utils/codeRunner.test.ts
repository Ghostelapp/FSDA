import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateExerciseCode,
  generateSandboxDocument,
  stripCodeComments,
  checkLessonCompletionEligibility,
  getProjectInteractiveExercise,
} from './codeRunner';
import { InteractiveExercise } from '../types';
import { MODULES_DATA } from '../data/modulesData';
import { PROJECTS_DATA } from '../data/projectsData';

test('validateExerciseCode succeeds when code meets all criteria', () => {
  const mockExercise: InteractiveExercise = {
    id: 'test-ex',
    title: 'Test',
    instructions: 'Dodaj h1',
    task: 'Zrób to',
    starterCode: { html: '', css: '', js: '' },
    solutionCode: { html: '<h1>Witaj</h1>', css: '', js: '' },
    hints: [],
    rules: [
      { id: 'r1', description: 'Musi zawierać znacznik h1', ruleType: 'html_tag_exists', target: 'h1' },
      { id: 'r2', description: 'Musi zawierać tekst Witaj', ruleType: 'html_contains', target: 'Witaj' },
    ],
  };

  const goodCode = { html: '<h1 class="heading">Witaj świecie</h1>', css: '', js: '' };
  const result = validateExerciseCode(mockExercise, goodCode);

  assert.equal(result.allPassed, true);
  assert.equal(result.passedCount, 2);
  assert.equal(result.totalCount, 2);
});

test('validateExerciseCode flags missing requirements with friendly error messages', () => {
  const mockExercise: InteractiveExercise = {
    id: 'test-ex-fail',
    title: 'Test Fail',
    instructions: 'Dodaj formularz',
    task: 'Form',
    starterCode: { html: '', css: '', js: '' },
    solutionCode: { html: '<form action="/api"></form>', css: '', js: '' },
    hints: [],
    rules: [
      { id: 'r1', description: 'Musi zawierać znacznik form', ruleType: 'html_tag_exists', target: 'form' },
      { id: 'r2', description: 'Musi mieć atrybut action', ruleType: 'html_attr_exists', target: 'action', param: '/api' },
    ],
  };

  const incompleteCode = { html: '<div><input type="text"></div>', css: '', js: '' };
  const result = validateExerciseCode(mockExercise, incompleteCode);

  assert.equal(result.allPassed, false);
  assert.equal(result.passedCount, 0);
  assert.ok(result.results[0].message?.includes('<form>'));
});

test('stripCodeComments removes HTML, CSS, and JS comments so comments cannot cheat validation', () => {
  assert.equal(stripCodeComments('<!-- <h1>Fake</h1> --><div>Real</div>', 'html'), '<div>Real</div>');
  assert.equal(stripCodeComments('/* font-size: 2rem; :hover */ .btn {}', 'css').trim(), '.btn {}');
  assert.equal(stripCodeComments('// const x = fetch();\n/* async await */\nlet a = 1;', 'js').trim(), 'let a = 1;');
});

test('checkLessonCompletionEligibility blocks self-approval until both exercise and quiz (>= 80%) are passed', () => {
  const neither = checkLessonCompletionEligibility({ isExercisePassed: false, quizScore: undefined });
  assert.equal(neither.canComplete, false);
  assert.equal(neither.missingReasons.length, 2);

  const onlyExercise = checkLessonCompletionEligibility({ isExercisePassed: true, quizScore: 50 });
  assert.equal(onlyExercise.canComplete, false);
  assert.equal(onlyExercise.isQuizPassed, false);

  const onlyQuiz = checkLessonCompletionEligibility({ isExercisePassed: false, quizScore: 100 });
  assert.equal(onlyQuiz.canComplete, false);
  assert.equal(onlyQuiz.isQuizPassed, true);

  const bothPassed = checkLessonCompletionEligibility({ isExercisePassed: true, quizScore: 80 });
  assert.equal(bothPassed.canComplete, true);
  assert.equal(bothPassed.missingReasons.length, 0);
});

test('All lessons in MODULES_DATA fail validation on starterCode and pass 100% on solutionCode', () => {
  const allLessons = MODULES_DATA.flatMap((m) => m.lessons);
  assert.ok(allLessons.length >= 30);

  for (const lesson of allLessons) {
    const ex = lesson.interactiveExercise;
    assert.ok(ex, `Lesson ${lesson.id} must have interactiveExercise`);

    const starterValidation = validateExerciseCode(ex, ex.starterCode);
    assert.equal(
      starterValidation.allPassed,
      false,
      `Lesson ${lesson.id} starterCode should NOT pass validation automatically`
    );

    const solutionValidation = validateExerciseCode(ex, ex.solutionCode);
    assert.equal(
      solutionValidation.allPassed,
      true,
      `Lesson ${lesson.id} solutionCode MUST pass all validation rules`
    );
  }
});

test('All portfolio projects in PROJECTS_DATA fail validation on starterCode and pass 100% on solutionCode', () => {
  assert.ok(PROJECTS_DATA.length >= 12);

  for (const project of PROJECTS_DATA) {
    const ex = getProjectInteractiveExercise(project);
    const starterValidation = validateExerciseCode(ex, ex.starterCode);
    assert.equal(
      starterValidation.allPassed,
      false,
      `Project ${project.id} starterCode should NOT pass validation automatically`
    );

    const solutionValidation = validateExerciseCode(ex, ex.solutionCode);
    assert.equal(
      solutionValidation.allPassed,
      true,
      `Project ${project.id} solutionCode MUST pass all validation rules`
    );
  }
});

test('generateSandboxDocument produces valid HTML with console interception', () => {
  const doc = generateSandboxDocument('<h1>Test</h1>', 'h1 { color: red; }', 'console.log("hello");');
  assert.ok(doc.includes('<!DOCTYPE html>'));
  assert.ok(doc.includes('h1 { color: red; }'));
  assert.ok(doc.includes('<h1>Test</h1>'));
  assert.ok(doc.includes('console.log = function'));
  assert.ok(doc.includes('sendToParent'));
});

test('MODULES_DATA enforces sequential 1..N lesson order, pedagogical progression, and accurate totalXp sums', () => {
  assert.equal(MODULES_DATA.length, 15);
  const seenLessonIds = new Set<string>();

  for (const mod of MODULES_DATA) {
    assert.ok(mod.lessons.length >= 3, `Module ${mod.id} should have at least 3 lessons`);
    const expectedSumXp = mod.lessons.reduce((sum, l) => sum + l.xpReward, 0);
    assert.equal(mod.totalXp, expectedSumXp, `Module ${mod.id} totalXp must equal sum of lesson xpRewards`);

    mod.lessons.forEach((lesson, idx) => {
      assert.equal(lesson.order, idx + 1, `Lesson ${lesson.id} in Module ${mod.id} must have sequential order ${idx + 1}`);
      assert.equal(lesson.moduleId, mod.id);
      assert.equal(seenLessonIds.has(lesson.id), false, `Duplicate lesson id ${lesson.id}`);
      seenLessonIds.add(lesson.id);
    });
  }

  // Verify key pedagogical order fixes:
  // In TypeScript (Mod 6): Type Narrowing (ts-3) comes BEFORE Generics (ts-2)
  const tsIds = MODULES_DATA[5].lessons.map((l) => l.id);
  assert.ok(tsIds.indexOf('ts-3') < tsIds.indexOf('ts-2'));

  // In React (Mod 7): Conditional Rendering & Lists (react-4) and Forms (react-5) come BEFORE Context/useReducer/useMemo (react-3)
  const reactIds = MODULES_DATA[6].lessons.map((l) => l.id);
  assert.ok(reactIds.indexOf('react-4') < reactIds.indexOf('react-3'));
  assert.ok(reactIds.indexOf('react-5') < reactIds.indexOf('react-3'));

  // In Databases (Mod 9): SQL INSERT/UPDATE/DELETE (db-3), JOINs (db-4), and ACID Transactions (db-5) come BEFORE Prisma ORM (db-2)
  const dbIds = MODULES_DATA[8].lessons.map((l) => l.id);
  assert.ok(dbIds.indexOf('db-3') < dbIds.indexOf('db-2'));
  assert.ok(dbIds.indexOf('db-4') < dbIds.indexOf('db-2'));
  assert.ok(dbIds.indexOf('db-5') < dbIds.indexOf('db-2'));

  assert.equal(seenLessonIds.size, 91, 'Full Stack curriculum should have 91 lessons across 15 modules');
  for (const id of ['css-9', 'js-10', 'git-6', 'sec-5', 'fullstack-4', 'fullstack-5', 'test-4', 'devops-4', 'next-4', 'career-4']) {
    assert.ok(seenLessonIds.has(id), `Expected lesson ${id} to be included in MODULES_DATA`);
  }
});


