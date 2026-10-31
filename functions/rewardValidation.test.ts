import assert from 'node:assert/strict';
import test from 'node:test';
import { DAILY_CHALLENGES, FLASHCARDS_DECK } from '../src/utils/developerSimulators';
import { getVerifiedActivityRewardAmount, isValidPracticeAnswers } from './rewardValidation';

const today = '2026-10-27';

test('rejects unknown reward IDs and client-supplied amounts', () => {
  assert.equal(getVerifiedActivityRewardAmount('xp-100000', { amount: 100000 }, today), null);
  assert.equal(getVerifiedActivityRewardAmount('api-api-mission-1', {}, today), null);
});

test('accepts API mission only when the simulated request is completed', () => {
  const proof = {
    method: 'GET',
    endpoint: '/api/users',
    headers: {},
    bodyRaw: '',
  };
  assert.equal(getVerifiedActivityRewardAmount('api-api-mission-1', proof, today), 40);
  assert.equal(getVerifiedActivityRewardAmount('api-api-mission-1', { ...proof, endpoint: '/api/profile' }, today), null);
});

test('accepts daily coding reward only for the canonical solution', () => {
  const challenge = DAILY_CHALLENGES[0];
  assert.equal(
    getVerifiedActivityRewardAmount(`daily-${challenge.id}`, { code: challenge.solutionCode }, today),
    challenge.xpReward
  );
  assert.equal(getVerifiedActivityRewardAmount(`daily-${challenge.id}`, { code: 'return true;' }, today), null);
});

test('accepts a flashcard reward only for three unique known cards and the current day', () => {
  const cardIds = FLASHCARDS_DECK.slice(0, 3).map((card) => card.id);
  assert.equal(getVerifiedActivityRewardAmount(`flashcards-${today}`, { cardIds }, today), 25);
  assert.equal(getVerifiedActivityRewardAmount(`flashcards-${today}`, { cardIds: [cardIds[0], cardIds[0], cardIds[1]] }, today), null);
  assert.equal(getVerifiedActivityRewardAmount('flashcards-2026-10-26', { cardIds }, today), null);
});

test('accepts terminal missions only when the required command is submitted', () => {
  assert.equal(
    getVerifiedActivityRewardAmount('terminal-mission-m-1', { command: 'git init' }, today),
    40
  );
  assert.equal(
    getVerifiedActivityRewardAmount('terminal-mission-m-1', { command: 'echo done' }, today),
    null
  );
});

test('requires the correct answers to all practice questions', () => {
  assert.equal(isValidPracticeAnswers([0, 0, 1]), true);
  assert.equal(isValidPracticeAnswers([0, 1, 0]), false);
  assert.equal(isValidPracticeAnswers([0, 0]), false);
});