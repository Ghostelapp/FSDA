import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStudyPlanEstimate, CAREER_TRACKS } from './landingCalculator';

test('calculateStudyPlanEstimate computes accurate weeks, daily minutes, and 4 ordered milestones', () => {
  const result = calculateStudyPlanEstimate(439, 10, 'fullstack');
  assert.equal(result.effectiveHours, 439);
  assert.equal(result.estimatedWeeks, 44);
  assert.equal(result.dailyMinutes, Math.round((10 * 60) / 7));
  assert.equal(result.milestones.length, 4);
  assert.ok(result.milestones[0].weekTarget < result.milestones[1].weekTarget);
  assert.ok(result.milestones[1].weekTarget < result.milestones[2].weekTarget);
  assert.equal(result.milestones[3].weekTarget, 44);
});

test('calculateStudyPlanEstimate scales hours when selecting frontend or backend specialization', () => {
  const full = calculateStudyPlanEstimate(400, 10, 'fullstack');
  const front = calculateStudyPlanEstimate(400, 10, 'frontend');
  assert.ok(front.effectiveHours < full.effectiveHours);
  assert.ok(front.estimatedWeeks < full.estimatedWeeks);
  assert.ok(CAREER_TRACKS.frontend.portfolioProjectsCount >= 8);
});
