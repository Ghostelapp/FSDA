import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseInlineTokens,
  parseTheoryBlocks,
  getBeginnerLessonAid,
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
