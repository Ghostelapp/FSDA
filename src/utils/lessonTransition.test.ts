import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeLessonSlideDirection,
  computeStepSlideDirection,
  getLessonSlideVariants,
  getStepSlideVariants,
} from './lessonTransition';

test('computeLessonSlideDirection returns 1 forward and -1 backward', () => {
  assert.equal(computeLessonSlideDirection(0, 1), 1);
  assert.equal(computeLessonSlideDirection(2, 10), 1);
  assert.equal(computeLessonSlideDirection(5, 4), -1);
  assert.equal(computeLessonSlideDirection(12, 0), -1);
  assert.equal(computeLessonSlideDirection(3, 3), 1);
  assert.equal(computeLessonSlideDirection(-1, 2), 1);
});

test('computeStepSlideDirection computes intra-lesson stage progression direction', () => {
  assert.equal(computeStepSlideDirection('all', '1-teoria'), 1);
  assert.equal(computeStepSlideDirection('1-teoria', '2-przyklady'), 1);
  assert.equal(computeStepSlideDirection('2-przyklady', '4-quiz'), 1);
  assert.equal(computeStepSlideDirection('4-quiz', '3-cwiczenie'), -1);
  assert.equal(computeStepSlideDirection('3-cwiczenie', 'all'), -1);
});

test('getLessonSlideVariants produces directional horizontal slide offsets and honors reduced motion', () => {
  const normal = getLessonSlideVariants(false);
  const enterForward = (normal.enter as (dir: number) => { x: number; opacity: number })(1);
  const exitForward = (normal.exit as (dir: number) => { x: number; opacity: number })(1);
  const enterBackward = (normal.enter as (dir: number) => { x: number; opacity: number })(-1);
  const exitBackward = (normal.exit as (dir: number) => { x: number; opacity: number })(-1);

  assert.equal(enterForward.x > 0, true);
  assert.equal(exitForward.x < 0, true);
  assert.equal(enterBackward.x < 0, true);
  assert.equal(exitBackward.x > 0, true);
  assert.equal(enterForward.opacity, 0);

  const reduced = getLessonSlideVariants(true);
  const reducedEnter = (reduced.enter as (dir: number) => { x: number; opacity: number })(1);
  const reducedExit = (reduced.exit as (dir: number) => { x: number; opacity: number })(-1);
  assert.equal(reducedEnter.x, 0);
  assert.equal(reducedExit.x, 0);

  const stepVariants = getStepSlideVariants(false);
  const stepEnter = (stepVariants.enter as (dir: number) => { x: number; opacity: number })(1);
  assert.equal(stepEnter.x > 0, true);
});
