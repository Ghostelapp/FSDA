import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseInlineTokens,
  parseTheoryBlocks,
  getBeginnerLessonAid,
  detectPrimaryExerciseTab,
} from './lessonReadability';
import { MODULES_DATA } from '../data/modulesData';

test('parseInlineTokens strips nested bold around backticks (**`<!DOCTYPE html>`**) and leaves zero raw backticks', () => {
  const input = '1. **`<!DOCTYPE html>`**: Informuje przeglądarkę o standardzie **HTML5**.';
  const tokens = parseInlineTokens(input);

  const codeToken = tokens.find((t) => t.type === 'code');
  assert.ok(codeToken, 'Should produce a code token');
  assert.equal(codeToken?.content, '<!DOCTYPE html>');
  assert.equal(codeToken?.category, 'html');

  // Ensure no token contains raw backticks or double asterisks
  for (const token of tokens) {
    assert.equal(token.content.includes('`'), false, `Token leaked raw backtick: ${token.content}`);
    assert.equal(token.content.includes('**'), false, `Token leaked raw **: ${token.content}`);
  }
});

test('parseTheoryBlocks separates single-newline numbered lists and bullet lists into structured blocks', () => {
  const sampleMarkdown = `Gdy wpisujesz adres URL, uruchamiasz łańcuch zdarzeń:
1. **Rozwiązanie DNS:** Przeglądarka tłumaczy domenę na IP.
2. **Żądanie HTTP:** Przeglądarka wysyła zapytanie \`GET\`.
3. **Odpowiedź serwera:** Serwer zwraca status \`200 OK\`.

**1. Czym jest algorytm?**
Każdy algorytm składa się z 3 klocków:
- **Sekwencji** (wykonaj krok A, potem krok B),
- **Warunku** (jeśli hasło poprawne -> zaloguj),
- **Pętli** (powtarzaj dla każdego kursanta).`;

  const blocks = parseTheoryBlocks(sampleMarkdown);

  assert.equal(blocks[0]?.type, 'paragraph');
  assert.equal(blocks[1]?.type, 'ordered_list');
  if (blocks[1]?.type === 'ordered_list') {
    assert.equal(blocks[1].items.length, 3);
    assert.equal(blocks[1].items[0].number, '1');
    assert.ok(blocks[1].items[0].title && blocks[1].items[0].title.length > 0);
  }

  assert.equal(blocks[2]?.type, 'heading');
  assert.equal(blocks[3]?.type, 'paragraph');
  assert.equal(blocks[4]?.type, 'unordered_list');
  if (blocks[4]?.type === 'unordered_list') {
    assert.equal(blocks[4].items.length, 3);
  }
});

test('All 91 lessons across 15 modules parse without leaking raw backticks and provide beginner aids', () => {
  const allLessons = MODULES_DATA.flatMap((m) => m.lessons);
  assert.ok(allLessons.length >= 90);

  for (const lesson of allLessons) {
    const blocks = parseTheoryBlocks(lesson.theoryMarkdown);
    assert.ok(blocks.length > 0, `Lesson ${lesson.id} should produce at least 1 theory block`);

    for (const block of blocks) {
      if (block.type === 'paragraph') {
        for (const t of block.tokens) {
          assert.equal(t.content.includes('`'), false, `Leaked backtick in ${lesson.id}: ${t.content}`);
        }
      }
      if (block.type === 'ordered_list') {
        for (const item of block.items) {
          for (const t of item.body) {
            assert.equal(t.content.includes('`'), false, `Leaked backtick in ordered list of ${lesson.id}: ${t.content}`);
          }
        }
      }
    }

    const aid = getBeginnerLessonAid(lesson);
    assert.ok(aid.analogyTitle.length > 5);
    assert.ok(aid.analogyText.length > 20);
    assert.ok(aid.glossary.length > 0);
    assert.ok(aid.exerciseWalkthrough.length >= 1);
  }
});

test('MODULES_DATA starts with HTML basics (Module 1), then CSS (Module 2), JS (Module 3), and orders lessons from easiest to advanced', () => {
  // Module 1 is HTML starting with simple headings (html-7)
  const mod1Ids = MODULES_DATA.find((m) => m.id === 1)?.lessons.map((l) => l.id);
  assert.deepEqual(mod1Ids?.slice(0, 4), ['html-7', 'html-8', 'html-4', 'html-9']);

  // Module 2 is CSS starting with colors & fonts (css-7)
  const mod2Ids = MODULES_DATA.find((m) => m.id === 2)?.lessons.map((l) => l.id);
  assert.deepEqual(mod2Ids?.slice(0, 3), ['css-7', 'css-6', 'css-1']);

  // Module 3 is JS starting with variables -> if/else -> functions -> loops -> objects -> DOM -> map/filter
  const mod3Ids = MODULES_DATA.find((m) => m.id === 3)?.lessons.map((l) => l.id);
  assert.deepEqual(mod3Ids?.slice(0, 7), ['js-1', 'js-6', 'js-8', 'js-7', 'js-9', 'js-3', 'js-2']);

  // Module 4 is Internet/Tools starting with fund-1
  const mod4Ids = MODULES_DATA.find((m) => m.id === 4)?.lessons.map((l) => l.id);
  assert.deepEqual(mod4Ids?.slice(0, 4), ['fund-1', 'fund-2', 'fund-3', 'fund-4']);

  for (const mod of MODULES_DATA) {
    mod.lessons.forEach((lesson, idx) => {
      assert.equal(lesson.order, idx + 1, `Module ${mod.id} lesson ${lesson.id} should have order ${idx + 1}`);
      const firstPrereq = lesson.prerequisites[0] || '';
      if (idx === 0) {
        if (mod.id === 1) {
          assert.ok(firstPrereq.includes('Brak'));
        } else {
          assert.ok(firstPrereq.includes(`Modułu ${mod.id - 1}`));
        }
      } else {
        assert.ok(
          firstPrereq.startsWith(`Lekcja ${idx}:`),
          `Lesson ${lesson.id} (order ${lesson.order}) should reference Lekcja ${idx} in prerequisites, got: ${firstPrereq}`
        );
      }

      const tab = detectPrimaryExerciseTab(lesson.interactiveExercise);
      assert.ok(['html', 'css', 'js'].includes(tab));
    });
  }
});

test('All 9 HTML lessons in Module 1 have curated beginner glossaries, pre-filled starter code, and bite-sized tasks', () => {
  const htmlModule = MODULES_DATA.find((m) => m.id === 1);
  assert.ok(htmlModule, 'HTML module (Module 1) must exist');
  assert.equal(htmlModule.lessons.length, 9);

  for (const lesson of htmlModule.lessons) {
    const aid = getBeginnerLessonAid(lesson);
    assert.equal(
      aid.difficultyLabel,
      'Start od Zera',
      `HTML lesson ${lesson.id} should be labeled Start od Zera`
    );

    // Every HTML lesson must have a curated glossary, never generic "Kluczowy koncept #1"
    for (const item of aid.glossary) {
      assert.equal(
        item.term.startsWith('Kluczowy koncept'),
        false,
        `HTML lesson ${lesson.id} should have curated glossary terms, got: ${item.term}`
      );
    }

    // Starter code must be pre-filled with real HTML tags (not just a comment) and include a helpful Wzór comment
    const starterHtml = lesson.interactiveExercise.starterCode.html;
    assert.ok(
      starterHtml.includes('<') && starterHtml.includes('Wzór:'),
      `HTML lesson ${lesson.id} starterCode should include pre-filled tags and an inline Wzór comment`
    );

    // Bite-sized rules: max 3 rules per HTML lesson
    assert.ok(
      lesson.interactiveExercise.rules.length <= 3,
      `HTML lesson ${lesson.id} should have at most 3 rules for beginner friendliness`
    );
  }
});


