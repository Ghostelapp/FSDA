import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULES_DATA } from '../data/modulesData';
import { getBeginnerLessonAid } from './lessonReadability';
import {
  buildLessonNarrationScript,
  cleanTextForNarration,
  estimateNarrationDurationSeconds,
  formatNarrationTime,
  selectBestSpeechVoice,
  splitSegmentIntoSpeechChunks,
  VoiceDescriptor,
} from './lessonNarrator';

test('cleanTextForNarration removes fenced code blocks and formats HTML tags naturally in PL and EN', () => {
  const sample = `
### Nagłówki HTML
Użyj **\`<h1>\`** dla głównego tytułu oraz \`</p>\` na końcu akapitu.
\`\`\`html
<h1>Tytuł w kodzie</h1>
\`\`\`
Zobacz [dokumentację](https://example.com) -> gotowe!
`;

  const pl = cleanTextForNarration(sample, 'pl');
  assert.ok(pl.includes('znacznik h1'), `Expected PL HTML tag narration, got: ${pl}`);
  assert.ok(pl.includes('znacznik zamykający p'), `Expected PL closing tag narration, got: ${pl}`);
  assert.ok(!pl.includes('Tytuł w kodzie'), 'Fenced code block must be stripped');
  assert.ok(!pl.includes('```'), 'Backticks must be stripped');
  assert.ok(!pl.includes('https://example.com'), 'Markdown link URLs must be stripped');
  assert.ok(pl.includes('dokumentację'), 'Markdown link labels must be preserved');

  const en = cleanTextForNarration('Use `<h1>` and `</p>` tags.', 'en');
  assert.ok(en.includes('h1 tag'), `Expected EN HTML tag narration, got: ${en}`);
  assert.ok(en.includes('closing p tag'), `Expected EN closing tag narration, got: ${en}`);
});

test('buildLessonNarrationScript builds multi-chapter script for real curriculum lessons without raw code', () => {
  const firstLesson = MODULES_DATA[0].lessons[0];
  assert.ok(firstLesson, 'First curriculum lesson should exist');
  const aid = getBeginnerLessonAid(firstLesson, 'pl');

  const segments = buildLessonNarrationScript(firstLesson, aid, 'pl');
  assert.ok(segments.length >= 4, 'Should generate intro, analogy, glossary/theory, and mistakes chapters');
  assert.equal(segments[0].kind, 'intro');
  assert.ok(segments.some((s) => s.kind === 'analogy'), 'Should include analogy chapter');
  assert.ok(segments.some((s) => s.kind === 'theory'), 'Should include theory chapters');
  if (firstLesson.commonMistakes && firstLesson.commonMistakes.length > 0) {
    assert.ok(segments.some((s) => s.kind === 'mistakes'), 'Should include common mistakes recap chapter');
  }

  for (const seg of segments) {
    assert.ok(seg.text.length > 10, `Segment ${seg.id} should have spoken text`);
    assert.ok(!seg.text.includes('```'), `Segment ${seg.id} must not contain raw code fences`);
    assert.ok(seg.estimatedSeconds >= 2, `Segment ${seg.id} should have positive estimated duration`);
  }
});

test('splitSegmentIntoSpeechChunks keeps every chunk within maxChars without dropping words', () => {
  const longText =
    'Pierwsze zdanie opisuje strukturę dokumentu HTML. Drugie zdanie wyjaśnia działanie nagłówków oraz akapitów na stronie internetowej. Trzecie zdanie pokazuje jak przeglądarka buduje drzewo DOM na podstawie znaczników i atrybutów. Czwarte zdanie podsumowuje najważniejsze zasady semantyki.';

  const chunks = splitSegmentIntoSpeechChunks(longText, 120);
  assert.ok(chunks.length >= 3, 'Should split long prose into multiple short chunks');
  for (const chunk of chunks) {
    assert.ok(chunk.length <= 120, `Chunk exceeded maxChars (len=${chunk.length}): ${chunk}`);
  }
  assert.equal(chunks.join(' '), longText);
});

test('selectBestSpeechVoice prefers saved voiceURI or highest-quality natural voice per language', () => {
  const voices: VoiceDescriptor[] = [
    { voiceURI: 'en-basic', name: 'English Basic', lang: 'en-US' },
    { voiceURI: 'pl-basic', name: 'eSpeak Polish', lang: 'pl-PL' },
    { voiceURI: 'pl-natural', name: 'Microsoft Zosia Online (Natural) - Polish (Poland)', lang: 'pl-PL' },
    { voiceURI: 'pl-google', name: 'Google polski', lang: 'pl-PL' },
    { voiceURI: 'en-natural', name: 'Microsoft Aria Online (Natural) - English (United States)', lang: 'en-US' },
  ];

  const autoPl = selectBestSpeechVoice(voices, 'pl');
  assert.equal(autoPl?.voiceURI, 'pl-natural');

  const preferredPl = selectBestSpeechVoice(voices, 'pl', 'pl-google');
  assert.equal(preferredPl?.voiceURI, 'pl-google');

  const autoEn = selectBestSpeechVoice(voices, 'en');
  assert.equal(autoEn?.voiceURI, 'en-natural');

  // If saved preference is for another language, ignore it and pick best matching
  const mismatchedPref = selectBestSpeechVoice(voices, 'en', 'pl-google');
  assert.equal(mismatchedPref?.voiceURI, 'en-natural');

  assert.equal(selectBestSpeechVoice([], 'pl'), null);
});

test('estimateNarrationDurationSeconds and formatNarrationTime compute accurate durations', () => {
  const words = Array.from({ length: 148 }, (_, i) => `word${i}`).join(' ');
  assert.equal(estimateNarrationDurationSeconds(words, 1), 60);
  assert.equal(estimateNarrationDurationSeconds(words, 1.5), 40);
  assert.equal(formatNarrationTime(0), '0:00');
  assert.equal(formatNarrationTime(65), '1:05');
  assert.equal(formatNarrationTime(245), '4:05');
});
