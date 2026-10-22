import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyAntiBotSubmission, ANTI_BOT_CHALLENGES } from './antiBot';

test('verifyAntiBotSubmission rejects bot when honeypot is filled', () => {
  const result = verifyAntiBotSubmission({
    challengeId: 'ch-math',
    userAnswer: '22',
    honeypotValue: 'I am a bot spammer',
    sliderProgress: 100,
    timeSpentMs: 3000,
  });

  assert.equal(result.isHuman, false);
  assert.equal(result.score, 0);
  assert.ok(result.reason?.includes('honeypot'));
});

test('verifyAntiBotSubmission rejects bot when submitted under 800ms', () => {
  const result = verifyAntiBotSubmission({
    challengeId: 'ch-math',
    userAnswer: '22',
    honeypotValue: '',
    sliderProgress: 100,
    timeSpentMs: 250, // instant bot post
  });

  assert.equal(result.isHuman, false);
  assert.ok(result.reason?.includes('zbyt szybko'));
});

test('verifyAntiBotSubmission rejects when slider is not moved', () => {
  const result = verifyAntiBotSubmission({
    challengeId: 'ch-math',
    userAnswer: '22',
    honeypotValue: '',
    sliderProgress: 20,
    timeSpentMs: 2500,
  });

  assert.equal(result.isHuman, false);
  assert.ok(result.reason?.includes('suwak'));
});

test('verifyAntiBotSubmission rejects when challenge answer is wrong', () => {
  const result = verifyAntiBotSubmission({
    challengeId: 'ch-math',
    userAnswer: '999',
    honeypotValue: '',
    sliderProgress: 100,
    timeSpentMs: 2500,
  });

  assert.equal(result.isHuman, false);
  assert.ok(result.reason?.includes('Niepoprawna odpowiedź'));
});

test('verifyAntiBotSubmission accepts genuine human completion', () => {
  const result = verifyAntiBotSubmission({
    challengeId: 'ch-math',
    userAnswer: '22',
    honeypotValue: '',
    sliderProgress: 100,
    timeSpentMs: 2500,
  });

  assert.equal(result.isHuman, true);
  assert.equal(result.score, 100);
});
