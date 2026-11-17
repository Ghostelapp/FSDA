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
