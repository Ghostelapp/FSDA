import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getNextThemePreference,
  parseThemePreference,
  resolveTheme,
} from './theme';

test('parseThemePreference validates stored values and falls back to dark', () => {
  assert.equal(parseThemePreference('dark'), 'dark');
  assert.equal(parseThemePreference('light'), 'light');
  assert.equal(parseThemePreference('system'), 'system');
  assert.equal(parseThemePreference(null), 'dark');
  assert.equal(parseThemePreference(undefined), 'dark');
  assert.equal(parseThemePreference('invalid-value'), 'dark');
});

test('resolveTheme maps dark, light, and system preferences accurately', () => {
  assert.equal(resolveTheme('dark', false), 'dark');
  assert.equal(resolveTheme('dark', true), 'dark');
  assert.equal(resolveTheme('light', false), 'light');
  assert.equal(resolveTheme('light', true), 'light');
  assert.equal(resolveTheme('system', true), 'dark');
  assert.equal(resolveTheme('system', false), 'light');
});

test('getNextThemePreference cycles cleanly through dark -> light -> system -> dark', () => {
  assert.equal(getNextThemePreference('dark'), 'light');
  assert.equal(getNextThemePreference('light'), 'system');
  assert.equal(getNextThemePreference('system'), 'dark');
});

test('Light Mode CSS in src/index.css overrides all critical dark hex surfaces, tints, gradients, and hovers', () => {
  const cssPath = path.resolve(process.cwd(), 'src/index.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  const requiredSelectors = [
    'html.light .bg-\\[\\#070B13\\]',
    'html.light .bg-\\[\\#0E1422\\]',
    'html.light .bg-\\[\\#0F1626\\]',
    'html.light .bg-\\[\\#101726\\]\\/80',
    'html.light .bg-indigo-950\\/60',
    'html.light .bg-emerald-950\\/40',
    'html.light .bg-rose-950\\/40',
    'html.light .bg-amber-950\\/30',
    'html.light .bg-slate-700',
    'html.light .hover\\:bg-slate-800',
    'html.light .hover\\:bg-\\[\\#0F1626\\]',
    'html.light .from-\\[\\#0B1120\\]',
    'html.light .via-\\[\\#131C31\\]',
    'html.light .to-\\[\\#06080E\\]',
    'html.light .fixed.inset-0.bg-black\\/85',
  ];

  for (const selector of requiredSelectors) {
    assert.ok(
      css.includes(selector),
      `Missing expected Light Mode CSS override selector: ${selector}`
    );
  }
});
