import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseTheoryBlocks,
  groupTheoryBlocksIntoSections,
  parseInlineTokens,
  estimateLessonReadingMinutes,
} from './lessonReadability';

test('groupTheoryBlocksIntoSections splits markdown blocks into numbered topic cards', () => {
  const markdown = `
### 1. Architektura dokumentu HTML
Przeglądarka czyta kod od góry do dołu i buduje drzewo \`DOM\`.
- Znacznik \`<head>\` zawiera metadane.
- Znacznik \`<body>\` zawiera widoczną treść.

### 2. Semantyka i dostępność
Stosuj znaczniki takie jak \`<main>\`, \`<nav>\` oraz \`<article>\`.
1. **Czytniki ekranowe**: łatwiej nawigują po sekcjach.
2. **SEO**: roboty indeksujące lepiej rozumieją strukturę.
  `.trim();

  const blocks = parseTheoryBlocks(markdown);
  const sections = groupTheoryBlocksIntoSections(blocks);

  assert.equal(sections.length, 2);
  assert.equal(sections[0].index, 1);
  assert.equal(sections[0].title, '1. Architektura dokumentu HTML');
  assert.equal(sections[0].blocks.length, 2);

  assert.equal(sections[1].index, 2);
  assert.equal(sections[1].title, '2. Semantyka i dostępność');
  assert.equal(sections[1].blocks.length, 2);
});

test('groupTheoryBlocksIntoSections handles intro paragraphs before the first heading', () => {
  const markdown = `
Wprowadzenie do tematu zmiennych w języku JavaScript.

### Deklaracja const oraz let
Zawsze zaczynaj od \`const\`, a \`let\` stosuj gdy wartość ulega zmianie.
  `.trim();

  const blocks = parseTheoryBlocks(markdown);
  const sections = groupTheoryBlocksIntoSections(blocks, 'Wstęp teoretyczny');

  assert.equal(sections.length, 2);
  assert.equal(sections[0].title, 'Wstęp teoretyczny');
  assert.equal(sections[1].title, 'Deklaracja const oraz let');
});

test('parseInlineTokens strips raw backticks and classifies code tokens cleanly', () => {
  const tokens = parseInlineTokens('Użyj znacznika **`<section>`** oraz właściwości `display: flex;`.');
  const codeTokens = tokens.filter((t) => t.type === 'code');
  assert.equal(codeTokens.length, 2);
  assert.equal(codeTokens[0].content, '<section>');
  assert.equal(codeTokens[0].category, 'html');
  assert.equal(codeTokens[1].content, 'display: flex;');
  assert.equal(codeTokens[1].category, 'css');
});

test('parseInlineTokens automatically detects unbackticked HTML tags in lesson summaries and tasks', () => {
  const summary =
    'Naucz się tworzyć formularz: pole <input type="email" required />, etykieta <label>E-mail</label> i przycisk <button type="submit">Wyślij</button> przed </form>.';
  const tokens = parseInlineTokens(summary);
  const codeTokens = tokens.filter((t) => t.type === 'code');

  assert.equal(codeTokens.length, 4);
  assert.equal(codeTokens[0].content, '<input type="email" required />');
  assert.equal(codeTokens[0].category, 'html');
  assert.equal(codeTokens[1].content, '<label>E-mail</label>');
  assert.equal(codeTokens[1].category, 'html');
  assert.equal(codeTokens[2].content, '<button type="submit">Wyślij</button>');
  assert.equal(codeTokens[2].category, 'html');
  assert.equal(codeTokens[3].content, '</form>');
  assert.equal(codeTokens[3].category, 'html');
});

test('parseInlineTokens does not misclassify math comparisons or Polish words', () => {
  const prose = 'Jeśli wiek < 18 oraz punkty > 10, użyj :hover oraz npm install helmet i console.log(wiek).';
  const tokens = parseInlineTokens(prose);
  const codeTokens = tokens.filter((t) => t.type === 'code');

  assert.equal(codeTokens.length, 3);
  assert.equal(codeTokens[0].content, ':hover');
  assert.equal(codeTokens[0].category, 'css');
  assert.equal(codeTokens[1].content, 'npm install helmet');
  assert.equal(codeTokens[1].category, 'cli');
  assert.equal(codeTokens[2].content, 'console.log(wiek)');
  assert.equal(codeTokens[2].category, 'js');
});

test('estimateLessonReadingMinutes returns realistic total time', () => {
  const minutes = estimateLessonReadingMinutes({
    theoryMarkdown: 'Słowo '.repeat(280),
    codeExamples: [{ title: 'Ex1', language: 'html', code: '<p>Test</p>', explanation: 'Opis' }],
    commonMistakes: [
      {
        mistake: 'Err1',
        whyItHappens: 'Powód',
        howToFix: 'Naprawa',
        badCode: 'a',
        goodCode: 'b',
      },
    ],
  });
  assert.ok(minutes >= 9 && minutes <= 14);
});
