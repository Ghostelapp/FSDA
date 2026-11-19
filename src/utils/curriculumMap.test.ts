import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCurriculumMap,
  computeNodeLaneOffset,
  getLessonTransitionContext,
} from './curriculumMap';
import { MODULES_DATA } from '../data/modulesData';

test('computeNodeLaneOffset produces smooth winding S-curve pattern', () => {
  const first = computeNodeLaneOffset(0);
  const second = computeNodeLaneOffset(1);
  const third = computeNodeLaneOffset(2);
  const fifth = computeNodeLaneOffset(4);
  const sixth = computeNodeLaneOffset(5);

  assert.equal(first.laneOffset, 'center');
  assert.equal(first.offsetPx, 0);
  assert.equal(second.laneOffset, 'center-right');
  assert.ok(second.offsetPx > 0);
  assert.equal(third.laneOffset, 'right');
  assert.ok(third.offsetPx > second.offsetPx);
  assert.equal(fifth.laneOffset, 'center');
  assert.equal(fifth.offsetPx, 0);
  assert.equal(sixth.laneOffset, 'center-left');
  assert.ok(sixth.offsetPx < 0);
});

test('buildCurriculumMap builds 15 module zones and 96 nodes with accurate target and statuses', () => {
  const firstModFirstLesson = MODULES_DATA[0].lessons[0].id;
  const firstModSecondLesson = MODULES_DATA[0].lessons[1].id;

  const summary = buildCurriculumMap({
    modules: MODULES_DATA,
    completedLessonIds: [firstModFirstLesson],
    quizScores: { [firstModFirstLesson]: 100 },
  });

  assert.equal(summary.zones.length, 15);
  assert.equal(summary.totalLessonsCount, 96);
  assert.equal(summary.completedLessonsCount, 1);
  assert.equal(summary.zones[0].nodes[0].status, 'completed');
  assert.equal(summary.zones[0].nodes[0].quizScore, 100);
  assert.equal(summary.zones[0].nodes[1].status, 'current');
  assert.equal(summary.currentTargetNode?.lesson.id, firstModSecondLesson);
  assert.equal(summary.zones[0].containsCurrentTarget, true);
  assert.equal(summary.zones[0].nodes[summary.zones[0].nodes.length - 1].isMilestoneNode, true);
});

test('buildCurriculumMap supports category and search filtering while preserving global totals', () => {
  const summary = buildCurriculumMap({
    modules: MODULES_DATA,
    completedLessonIds: [],
    categoryFilter: 'Bazy danych',
    searchQuery: 'SQL',
  });

  assert.ok(summary.zones.length >= 1);
  assert.ok(summary.zones.every((z) => z.module.category === 'Bazy danych'));
  assert.equal(summary.totalLessonsCount, 96);
});

test('getLessonTransitionContext detects module boundary crossings and next uncompleted lesson', () => {
  const mod1Lessons = MODULES_DATA[0].lessons;
  const lastLessonMod1 = mod1Lessons[mod1Lessons.length - 1].id;
  const firstLessonMod2 = MODULES_DATA[1].lessons[0].id;

  const summary = buildCurriculumMap({
    modules: MODULES_DATA,
    completedLessonIds: mod1Lessons.map((l) => l.id),
  });

  const ctxEndMod1 = getLessonTransitionContext(summary, lastLessonMod1);
  assert.equal(ctxEndMod1.currentNode?.lesson.id, lastLessonMod1);
  assert.equal(ctxEndMod1.nextNode?.lesson.id, firstLessonMod2);
  assert.equal(ctxEndMod1.isCrossingModuleBoundaryOnNext, true);
  assert.equal(ctxEndMod1.isCrossingModuleBoundaryOnPrev, false);
  assert.equal(ctxEndMod1.nextUncompletedNode?.lesson.id, firstLessonMod2);

  const ctxStartMod2 = getLessonTransitionContext(summary, firstLessonMod2);
  assert.equal(ctxStartMod2.isCrossingModuleBoundaryOnPrev, true);
  assert.equal(ctxStartMod2.prevNode?.lesson.id, lastLessonMod1);
});
