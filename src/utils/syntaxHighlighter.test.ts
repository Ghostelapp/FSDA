import test from 'node:test';
import assert from 'node:assert/strict';
import { highlightCode, getLanguageDisplayName } from './syntaxHighlighter';

test('highlightCode colors JavaScript keywords and strings', () => {
  const js = 'const user = "Jan Kowalski";';
  const html = highlightCode(js, 'javascript');
  assert.ok(html.includes('token keyword'), 'Should tokenize const as keyword');
  assert.ok(html.includes('token string'), 'Should tokenize "Jan Kowalski" as string');
});

test('highlightCode colors HTML tags and attributes', () => {
  const markup = '<button type="submit" class="btn">Kliknij</button>';
  const html = highlightCode(markup, 'html');
  assert.ok(html.includes('token tag'), 'Should tokenize HTML tags');
  assert.ok(html.includes('token attr-name'), 'Should tokenize attr name');
});

test('highlightCode colors CSS properties and selectors', () => {
  const css = '.container { display: flex; color: #fff; }';
  const html = highlightCode(css, 'css');
  assert.ok(html.includes('token selector'), 'Should tokenize selector');
  assert.ok(html.includes('token property'), 'Should tokenize CSS property');
});

test('getLanguageDisplayName returns formatted title', () => {
  assert.equal(getLanguageDisplayName('js'), 'JavaScript (ES6+)');
  assert.equal(getLanguageDisplayName('html'), 'HTML5');
  assert.equal(getLanguageDisplayName('bash'), 'Terminal Bash');
  assert.equal(getLanguageDisplayName('sql'), 'PostgreSQL SQL');
});
