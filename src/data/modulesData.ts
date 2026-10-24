import { Module, Lesson } from '../types';
import { MODULE_1 } from './modules/module1_fundamenty';
import { MODULE_2 } from './modules/module2_html';
import { MODULE_3 } from './modules/module3_css';
import { MODULE_4 } from './modules/module4_javascript';
import { MODULE_5 } from './modules/module5_git';
import { MODULE_6 } from './modules/module6_typescript';
import { MODULE_7 } from './modules/module7_react';
import { MODULE_8 } from './modules/module8_backend';
import { MODULE_9 } from './modules/module9_databases';
import { MODULE_10 } from './modules/module10_security';
import { MODULES_11_TO_15 } from './modules/modulesRemaining';
import { MISSING_CURRICULUM_LESSONS } from './modules/missingCurriculumLessons';

/**
 * Canonical pedagogical lesson ordering per module (from fundamental concepts to advanced patterns).
 */
export const PEDAGOGICAL_LESSON_ORDER: Record<number, string[]> = {
  1: ['fund-1', 'fund-2', 'fund-3', 'fund-4', 'fund-5', 'fund-6'],
  2: ['html-1', 'html-7', 'html-8', 'html-9', 'html-2', 'html-4', 'html-6', 'html-3', 'html-5'],
  3: ['css-1', 'css-6', 'css-7', 'css-8', 'css-2', 'css-3', 'css-4', 'css-5', 'css-9'],
  4: ['js-1', 'js-6', 'js-7', 'js-8', 'js-9', 'js-2', 'js-3', 'js-4', 'js-5', 'js-10'],
  5: ['git-1', 'git-2', 'git-3', 'git-4', 'git-5', 'git-6'],
  6: ['ts-1', 'ts-4', 'ts-3', 'ts-2', 'ts-5', 'ts-6'],
  7: ['react-1', 'react-4', 'react-5', 'react-2', 'react-6', 'react-3', 'react-7'],
  8: ['node-1', 'node-4', 'node-2', 'node-5', 'node-3', 'node-6'],
  9: ['db-1', 'db-3', 'db-4', 'db-5', 'db-2', 'db-6'],
  10: ['sec-1', 'sec-5', 'sec-2', 'sec-3', 'sec-4'],
  11: ['fullstack-1', 'fullstack-4', 'fullstack-5', 'fullstack-2', 'fullstack-3'],
  12: ['test-1', 'test-2', 'test-4', 'test-3'],
  13: ['devops-1', 'devops-2', 'devops-4', 'devops-3'],
  14: ['next-1', 'next-2', 'next-3', 'next-4'],
  15: ['career-1', 'career-4', 'career-2', 'career-3'],
};

export function normalizeAndOrderModules(rawModules: Module[]): Module[] {
  return rawModules.map((mod, modIdx) => {
    const extraLessons = MISSING_CURRICULUM_LESSONS[mod.id] || [];
    const combinedLessons = [...mod.lessons, ...extraLessons];
    const expectedIds = PEDAGOGICAL_LESSON_ORDER[mod.id] || [];
    const lessonMap = new Map<string, Lesson>();
    for (const l of combinedLessons) {
      lessonMap.set(l.id, l);
    }

    const orderedLessons: Lesson[] = [];
    for (const id of expectedIds) {
      const found = lessonMap.get(id);
      if (found) {
        orderedLessons.push(found);
        lessonMap.delete(id);
      }
    }
    // Append any newly added lessons not yet listed in PEDAGOGICAL_LESSON_ORDER
    for (const remaining of lessonMap.values()) {
      orderedLessons.push(remaining);
    }

    const normalizedLessons: Lesson[] = orderedLessons.map((lesson, idx) => ({
      ...lesson,
      moduleId: mod.id,
      moduleTitle: mod.title,
      order: idx + 1,
    }));

    const calculatedTotalXp = normalizedLessons.reduce((sum, l) => sum + l.xpReward, 0);

    return {
      ...mod,
      id: modIdx + 1,
      totalXp: calculatedTotalXp > 0 ? calculatedTotalXp : mod.totalXp,
      lessons: normalizedLessons,
    };
  });
}

const RAW_MODULES: Module[] = [
  MODULE_1,
  MODULE_2,
  MODULE_3,
  MODULE_4,
  MODULE_5,
  MODULE_6,
  MODULE_7,
  MODULE_8,
  MODULE_9,
  MODULE_10,
  ...MODULES_11_TO_15,
];

export const MODULES_DATA: Module[] = normalizeAndOrderModules(RAW_MODULES);

