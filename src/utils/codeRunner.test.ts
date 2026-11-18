import test from 'node:test';
import assert from 'node:assert/strict';
import {
  REQUIRED_QUIZ_SCORE,
  validateExerciseCode,
  generateSandboxDocument,
  stripCodeComments,
  checkLessonCompletionEligibility,
  evaluateLessonQuiz,
  getProjectInteractiveExercise,
} from './codeRunner';
import { InteractiveExercise } from '../types';
import { MODULES_DATA } from '../data/modulesData';
import { PROJECTS_DATA } from '../data/projectsData';
import { localizeModule } from '../locales/curriculumEn';

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

test('stripCodeComments removes HTML, CSS, and JS comments (including cross-language comment blocks) so comments cannot cheat validation', () => {
  assert.equal(stripCodeComments('<!-- <h1>Fake</h1> --><div>Real</div>', 'html'), '<div>Real</div>');
  assert.equal(stripCodeComments('/* <h1>Fake</h1> */<div>Real</div>', 'html'), '<div>Real</div>');
  assert.equal(stripCodeComments('/* font-size: 2rem; :hover */ .btn {}', 'css').trim(), '.btn {}');
  assert.equal(stripCodeComments('<!-- display: flex --> .btn {}', 'css').trim(), '.btn {}');
  assert.equal(stripCodeComments('// const x = fetch();\n/* async await */\nlet a = 1;', 'js').trim(), 'let a = 1;');
  assert.equal(stripCodeComments('<!-- fetch("/api") -->\nconst url = "https://fsda.tech";', 'js').trim(), 'const url = "https://fsda.tech";');
});

test('validateExerciseCode anti-cheat: blocks unclosed tags, plain-text attribute spoofing, bare CSS without braces, and JS keyword substring/string spoofing', () => {
  const antiCheatExercise: InteractiveExercise = {
    id: 'anti-cheat-ex',
    title: 'Anti-cheat check',
    instructions: 'Test',
    task: 'Test',
    starterCode: { html: '', css: '', js: '' },
    solutionCode: {
      html: '<nav aria-label="Główna"><a href="https://fsda.tech" target="_blank">Start</a></nav>',
      css: '.nav { display: flex; justify-content: space-between; }',
      js: 'const items = [1]; if (items.length) { for (const x of items) { console.log(x); } }',
    },
    hints: [],
    rules: [
      { id: 'ac-1', description: 'Nawigacja <nav>', ruleType: 'html_tag_exists', target: 'nav' },
      { id: 'ac-2', description: 'Atrybut href', ruleType: 'html_attr_exists', target: 'href' },
      { id: 'ac-3', description: 'Atrybut target="_blank"', ruleType: 'html_attr_exists', target: 'target', param: '_blank' },
      { id: 'ac-4', description: 'Flexbox w CSS', ruleType: 'css_contains', target: 'display: flex' },
      { id: 'ac-5', description: 'Pętla for w JS', ruleType: 'js_contains', target: 'for' },
      { id: 'ac-6', description: 'Instrukcja if w JS', ruleType: 'js_contains', target: 'if' },
    ],
  };

  // 1. Cheating attempt: unclosed <nav>, attributes written in plain text <p>, CSS without braces, JS keywords inside identifiers/strings
  const cheatAttempt = validateExerciseCode(antiCheatExercise, {
    html: '<nav><p>href target="_blank"</p><a href="">Empty</a>',
    css: 'display: flex;',
    js: 'let format = "for if"; let shift = 1;',
  });
  assert.equal(cheatAttempt.allPassed, false);
  assert.equal(cheatAttempt.passedCount, 0, 'Every spoofed rule in cheatAttempt must be rejected');

  // 2. Legitimate code with compact CSS formatting (display:flex without space after colon) must pass 100%
  const validCompactCode = validateExerciseCode(antiCheatExercise, {
    html: '<nav aria-label="Main"><a href="/kurs" target="_blank">Kurs</a></nav>',
    css: 'nav{display:flex;justify-content:space-between}',
    js: 'const ok = true;\nif (ok) {\n  for (let i = 0; i < 1; i++) {}\n}',
  });
  assert.equal(validCompactCode.allPassed, true);
  assert.equal(validCompactCode.passedCount, 6);
});

test('evaluateLessonQuiz strictly validates question IDs, option index bounds, and 80% pass threshold', () => {
  const sampleLesson = MODULES_DATA[0].lessons[0];
  assert.equal(sampleLesson.quiz.length, 3);

  // Missing or empty answers fail validation
  assert.equal(evaluateLessonQuiz(sampleLesson, null).valid, false);
  assert.equal(evaluateLessonQuiz(sampleLesson, {}).valid, false);

  // Partial answers (only 2 of 3 answered) fail validation
  const partial: Record<string, number> = {
    [sampleLesson.quiz[0].id]: sampleLesson.quiz[0].correctAnswer,
    [sampleLesson.quiz[1].id]: sampleLesson.quiz[1].correctAnswer,
  };
  const partialEval = evaluateLessonQuiz(sampleLesson, partial);
  assert.equal(partialEval.valid, false);
  assert.equal(partialEval.passed, false);

  // Out-of-bounds option index (e.g. 99 or -1) or extra unknown question key fails validation
  const outOfBounds: Record<string, number> = {
    [sampleLesson.quiz[0].id]: 99,
    [sampleLesson.quiz[1].id]: sampleLesson.quiz[1].correctAnswer,
    [sampleLesson.quiz[2].id]: sampleLesson.quiz[2].correctAnswer,
  };
  assert.equal(evaluateLessonQuiz(sampleLesson, outOfBounds).valid, false);

  const extraKey: Record<string, number> = {
    [sampleLesson.quiz[0].id]: sampleLesson.quiz[0].correctAnswer,
    [sampleLesson.quiz[1].id]: sampleLesson.quiz[1].correctAnswer,
    [sampleLesson.quiz[2].id]: sampleLesson.quiz[2].correctAnswer,
    'fake-question-id': 0,
  };
  assert.equal(evaluateLessonQuiz(sampleLesson, extraKey).valid, false);

  // 2/3 correct = 67% -> valid submission, but does NOT pass 80% threshold
  const twoOfThree: Record<string, number> = {
    [sampleLesson.quiz[0].id]: sampleLesson.quiz[0].correctAnswer,
    [sampleLesson.quiz[1].id]: sampleLesson.quiz[1].correctAnswer,
    [sampleLesson.quiz[2].id]: (sampleLesson.quiz[2].correctAnswer + 1) % sampleLesson.quiz[2].options.length,
  };
  const twoEval = evaluateLessonQuiz(sampleLesson, twoOfThree);
  assert.equal(twoEval.valid, true);
  assert.equal(twoEval.scorePercent, 67);
  assert.equal(twoEval.passed, false);

  // 3/3 correct = 100% -> valid submission and passes 80% threshold
  const allCorrect: Record<string, number> = {
    [sampleLesson.quiz[0].id]: sampleLesson.quiz[0].correctAnswer,
    [sampleLesson.quiz[1].id]: sampleLesson.quiz[1].correctAnswer,
    [sampleLesson.quiz[2].id]: sampleLesson.quiz[2].correctAnswer,
  };
  const fullEval = evaluateLessonQuiz(sampleLesson, allCorrect);
  assert.equal(fullEval.valid, true);
  assert.equal(fullEval.scorePercent, 100);
  assert.equal(fullEval.passed, true);
});

test('checkLessonCompletionEligibility blocks self-approval until both exercise and quiz (>= 80%) are passed', () => {
  assert.equal(REQUIRED_QUIZ_SCORE, 80);
  const neither = checkLessonCompletionEligibility({ isExercisePassed: false, quizScore: undefined });
  assert.equal(neither.canComplete, false);
  assert.equal(neither.missingReasons.length, 2);

  const onlyExercise = checkLessonCompletionEligibility({ isExercisePassed: true, quizScore: 67 });
  assert.equal(onlyExercise.canComplete, false);
  assert.equal(onlyExercise.isQuizPassed, false);

  const onlyQuiz = checkLessonCompletionEligibility({ isExercisePassed: false, quizScore: 100 });
  assert.equal(onlyQuiz.canComplete, false);
  assert.equal(onlyQuiz.isQuizPassed, true);

  const bothPassed = checkLessonCompletionEligibility({ isExercisePassed: true, quizScore: 80 });
  assert.equal(bothPassed.canComplete, true);
  assert.equal(bothPassed.missingReasons.length, 0);
});

test('All 96 lessons in MODULES_DATA (PL and EN) have valid quizzes, fail validation on starterCode, and pass 100% on solutionCode', () => {
  const allLessonsPl = MODULES_DATA.flatMap((m) => m.lessons);
  const allLessonsEn = MODULES_DATA.map((m) => localizeModule(m, 'en')).flatMap((m) => m.lessons);
  assert.equal(allLessonsPl.length, 96);
  assert.equal(allLessonsEn.length, 96);

  for (const lessonsList of [allLessonsPl, allLessonsEn]) {
    for (const lesson of lessonsList) {
      const ex = lesson.interactiveExercise;
      assert.ok(ex, `Lesson ${lesson.id} must have interactiveExercise`);
      assert.ok(ex.rules.length >= 2, `Lesson ${lesson.id} must have at least 2 exercise verification rules`);

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

      // Verify quiz integrity
      assert.ok(lesson.quiz.length >= 3, `Lesson ${lesson.id} must have at least 3 quiz questions`);
      const qIds = new Set<string>();
      const perfectAnswers: Record<string, number> = {};
      for (const q of lesson.quiz) {
        assert.equal(qIds.has(q.id), false, `Duplicate question id ${q.id} in lesson ${lesson.id}`);
        qIds.add(q.id);
        assert.ok(q.question.trim().length > 5, `Empty question text in ${lesson.id}/${q.id}`);
        assert.ok(q.options.length >= 3, `Question ${lesson.id}/${q.id} must have at least 3 options`);
        assert.ok(
          Number.isInteger(q.correctAnswer) && q.correctAnswer >= 0 && q.correctAnswer < q.options.length,
          `Invalid correctAnswer index in ${lesson.id}/${q.id}`
        );
        perfectAnswers[q.id] = q.correctAnswer;
      }

      const quizEval = evaluateLessonQuiz(lesson, perfectAnswers);
      assert.equal(quizEval.valid, true);
      assert.equal(quizEval.scorePercent, 100);
      assert.equal(quizEval.passed, true);
    }
  }
});

test('All portfolio projects in PROJECTS_DATA fail validation on starterCode and pass 100% on solutionCode and have full sourceFiles', () => {
  assert.ok(PROJECTS_DATA.length >= 12);

  for (const project of PROJECTS_DATA) {
    assert.ok(
      Array.isArray(project.sourceFiles) && project.sourceFiles.length >= 3,
      `Project ${project.id} must have at least 3 full sourceFiles`
    );
    for (const file of project.sourceFiles) {
      assert.ok(file.path.length > 0, `Project ${project.id} file path cannot be empty`);
      assert.ok(file.code.trim().length > 150, `Project ${project.id} file ${file.path} must contain full code`);
    }

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

  assert.equal(seenLessonIds.size, 96, 'Full Stack curriculum should have 96 lessons across 15 modules');
  for (const id of ['html-10', 'html-11', 'html-12', 'html-13', 'html-14', 'css-9', 'js-10', 'git-6', 'sec-5', 'fullstack-4', 'fullstack-5', 'test-4', 'devops-4', 'next-4', 'career-4']) {
    assert.ok(seenLessonIds.has(id), `Expected lesson ${id} to be included in MODULES_DATA`);
  }
});


