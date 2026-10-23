import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateCompletedModulesCount, 
  generateProgressTimelineData, 
  calculateProgressStats 
} from './progressTimeline';
import { Module } from '../types';

const mockModules: Module[] = ([
  {
    id: 1,
    title: 'Fundamenty',
    category: 'Podstawy',
    description: 'Opis',
    badgeName: 'B1',
    badgeIcon: 'Terminal',
    durationHours: 10,
    totalXp: 100,
    prerequisites: [],
    topics: [],
    projectBrief: 'Projekt 1',
    lessons: [
      {
        id: 'fund-1',
        moduleId: 1,
        moduleTitle: 'Fundamenty',
        title: 'Lekcja 1',
        slug: 'lekcja-1',
        durationMinutes: 20,
        xpReward: 50,
        order: 1,
        summary: 'S',
        objectives: [],
        prerequisites: [],
        theoryMarkdown: 'T',
      },
      {
        id: 'fund-2',
        moduleId: 1,
        moduleTitle: 'Fundamenty',
        title: 'Lekcja 2',
        slug: 'lekcja-2',
        durationMinutes: 20,
        xpReward: 50,
        order: 2,
        summary: 'S',
        objectives: [],
        prerequisites: [],
        theoryMarkdown: 'T',
      },
    ],
  },
  {
    id: 2,
    title: 'HTML5',
    category: 'Frontend',
    description: 'Opis',
    badgeName: 'B2',
    badgeIcon: 'Code',
    durationHours: 10,
    totalXp: 100,
    prerequisites: [],
    topics: [],
    projectBrief: 'Projekt 2',
    lessons: [
      {
        id: 'html-1',
        moduleId: 2,
        moduleTitle: 'HTML5',
        title: 'HTML 1',
        slug: 'html-1',
        durationMinutes: 20,
        xpReward: 50,
        order: 1,
        summary: 'S',
        objectives: [],
        prerequisites: [],
        theoryMarkdown: 'T',
      },
    ],
  },
] as unknown as Module[]);

test('calculateCompletedModulesCount accurately returns completed modules', () => {
  // Empty completed
  assert.equal(calculateCompletedModulesCount(mockModules, []), 0);

  // Partial module 1
  assert.equal(calculateCompletedModulesCount(mockModules, ['fund-1']), 0);

  // Complete module 1
  assert.equal(calculateCompletedModulesCount(mockModules, ['fund-1', 'fund-2']), 1);

  // Complete both modules
  assert.equal(calculateCompletedModulesCount(mockModules, ['fund-1', 'fund-2', 'html-1']), 2);
});

test('generateProgressTimelineData produces 30 consecutive day entries ending today', () => {
  const endDate = new Date('2026-10-22T12:00:00Z');
  const data = generateProgressTimelineData({
    completedModules: 4,
    totalModules: 15,
    completedLessons: 18,
    daysCount: 30,
    endDate,
  });

  assert.equal(data.length, 30);
  assert.equal(data[0].dayIndex, 1);
  assert.equal(data[29].dayIndex, 30);
  assert.equal(data[29].completedModules, 4);
  assert.equal(data[29].totalModules, 15);
  assert.equal(data[29].completedLessons, 18);
  assert.equal(data[29].progressPercent, Math.round((4 / 15) * 100));

  // Monotonic or non-decreasing progress
  for (let i = 1; i < data.length; i++) {
    assert.ok(data[i].completedModules >= data[i - 1].completedModules);
    assert.ok(data[i].completedLessons >= data[i - 1].completedLessons);
    assert.equal(data[i].totalModules, 15);
  }
});

test('calculateProgressStats returns correct metrics and delta', () => {
  const data = generateProgressTimelineData({
    completedModules: 5,
    totalModules: 15,
    completedLessons: 22,
    daysCount: 30,
  });

  const stats = calculateProgressStats(data, 5, 15, 22);
  assert.equal(stats.currentCompletedModules, 5);
  assert.equal(stats.totalModules, 15);
  assert.equal(stats.remainingModules, 10);
  assert.equal(stats.completionPercent, 33);
  assert.ok(stats.modulesDelta >= 0);
  assert.ok(stats.lessonsDelta >= 0);
});
