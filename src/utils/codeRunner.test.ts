import test from 'node:test';
import assert from 'node:assert/strict';
import { validateExerciseCode, generateSandboxDocument } from './codeRunner';
import { InteractiveExercise } from '../types';

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

test('generateSandboxDocument produces valid HTML with console interception', () => {
  const doc = generateSandboxDocument('<h1>Test</h1>', 'h1 { color: red; }', 'console.log("hello");');
  assert.ok(doc.includes('<!DOCTYPE html>'));
  assert.ok(doc.includes('h1 { color: red; }'));
  assert.ok(doc.includes('<h1>Test</h1>'));
  assert.ok(doc.includes('console.log = function'));
  assert.ok(doc.includes('sendToParent'));
});
