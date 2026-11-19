import { Lesson, Module } from '../types';

export type MapNodeStatus = 'completed' | 'current' | 'available' | 'locked';

export type NodeLaneOffset = 'left' | 'center-left' | 'center' | 'center-right' | 'right';

export interface MapLessonNode {
  lesson: Lesson;
  moduleId: number;
  moduleTitle: string;
  moduleCategory: string;
  globalIndex: number;
  indexInModule: number;
  totalInModule: number;
  status: MapNodeStatus;
  quizScore: number | null;
  hasSavedCode: boolean;
  laneOffset: NodeLaneOffset;
  offsetPx: number;
  isMilestoneNode: boolean;
}

export interface MapModuleZone {
  module: Module;
  nodes: MapLessonNode[];
  completedCount: number;
  totalCount: number;
  completionPercent: number;
  earnedXp: number;
  totalXp: number;
  isZoneCompleted: boolean;
  containsCurrentTarget: boolean;
  currentTargetLessonId: string | null;
}

export interface CurriculumMapSummary {
  zones: MapModuleZone[];
  flatNodes: MapLessonNode[];
  currentTargetNode: MapLessonNode | null;
  completedLessonsCount: number;
  totalLessonsCount: number;
  overallPercent: number;
  completedModulesCount: number;
  totalModulesCount: number;
}

const WINDING_PATTERN: { lane: NodeLaneOffset; px: number }[] = [
  { lane: 'center', px: 0 },
  { lane: 'center-right', px: 56 },
  { lane: 'right', px: 96 },
  { lane: 'center-right', px: 48 },
  { lane: 'center', px: 0 },
  { lane: 'center-left', px: -56 },
  { lane: 'left', px: -96 },
  { lane: 'center-left', px: -48 },
];

export function computeNodeLaneOffset(indexInModule: number): {
  laneOffset: NodeLaneOffset;
  offsetPx: number;
} {
  const safeIdx = Math.max(0, indexInModule);
  const entry = WINDING_PATTERN[safeIdx % WINDING_PATTERN.length];
  return {
    laneOffset: entry.lane,
    offsetPx: entry.px,
  };
}

export interface BuildCurriculumMapOptions {
  modules: Module[];
  completedLessonIds: string[];
  quizScores?: Record<string, number>;
  savedCode?: Record<string, { html: string; css: string; js: string }>;
  activeLessonId?: string | null;
  searchQuery?: string;
  categoryFilter?: string;
}

export function buildCurriculumMap(options: BuildCurriculumMapOptions): CurriculumMapSummary {
  const {
    modules,
    completedLessonIds,
    quizScores = {},
    savedCode = {},
    activeLessonId = null,
    searchQuery = '',
    categoryFilter = 'Wszystkie',
  } = options;

  const completedSet = new Set(completedLessonIds);
  const cleanQuery = searchQuery.trim().toLowerCase();

  // First determine the recommended "current target" lesson across all modules:
  // If activeLessonId is provided and exists, or otherwise the first uncompleted lesson in curriculum order.
  let firstUncompletedLessonId: string | null = null;
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (!completedSet.has(lesson.id)) {
        firstUncompletedLessonId = lesson.id;
        break;
      }
    }
    if (firstUncompletedLessonId) break;
  }

  const targetLessonId = activeLessonId || firstUncompletedLessonId;

  const zones: MapModuleZone[] = [];
  const flatNodes: MapLessonNode[] = [];
  let globalIdx = 0;
  let currentTargetNode: MapLessonNode | null = null;
  let totalAllLessons = 0;
  let totalCompletedLessons = 0;
  let completedModulesCount = 0;

  for (const mod of modules) {
    const modCompletedCount = mod.lessons.filter((l) => completedSet.has(l.id)).length;
    const modTotalCount = mod.lessons.length;
    totalAllLessons += modTotalCount;
    totalCompletedLessons += modCompletedCount;
    if (modTotalCount > 0 && modCompletedCount === modTotalCount) {
      completedModulesCount += 1;
    }

    const matchesCategory =
      !categoryFilter ||
      categoryFilter === 'Wszystkie' ||
      mod.category === categoryFilter;

    if (!matchesCategory) {
      continue;
    }

    const modTextMatches =
      !cleanQuery ||
      mod.title.toLowerCase().includes(cleanQuery) ||
      mod.description.toLowerCase().includes(cleanQuery);

    const filteredLessons = mod.lessons.filter((lesson) => {
      if (!cleanQuery || modTextMatches) return true;
      return (
        lesson.title.toLowerCase().includes(cleanQuery) ||
        lesson.summary.toLowerCase().includes(cleanQuery) ||
        lesson.id.toLowerCase().includes(cleanQuery)
      );
    });

    if (cleanQuery && filteredLessons.length === 0) {
      continue;
    }

    const nodes: MapLessonNode[] = [];
    let earnedXp = 0;

    filteredLessons.forEach((lesson, idx) => {
      globalIdx += 1;
      const isDone = completedSet.has(lesson.id);
      const isCurrent = lesson.id === targetLessonId;
      if (isDone) {
        earnedXp += lesson.xpReward;
      }

      const status: MapNodeStatus = isDone
        ? 'completed'
        : isCurrent
        ? 'current'
        : 'available';

      const { laneOffset, offsetPx } = computeNodeLaneOffset(idx);
      const rawScore = quizScores[lesson.id];
      const quizScore = typeof rawScore === 'number' ? rawScore : null;
      const exId = lesson.interactiveExercise?.id;
      const hasSavedCode = Boolean(exId && savedCode[exId]);

      const node: MapLessonNode = {
        lesson,
        moduleId: mod.id,
        moduleTitle: mod.title,
        moduleCategory: mod.displayCategory || mod.category,
        globalIndex: globalIdx,
        indexInModule: idx + 1,
        totalInModule: mod.lessons.length,
        status,
        quizScore,
        hasSavedCode,
        laneOffset,
        offsetPx,
        isMilestoneNode: idx === filteredLessons.length - 1,
      };

      if (isCurrent || (!currentTargetNode && !isDone)) {
        if (isCurrent) {
          currentTargetNode = node;
        }
      }

      nodes.push(node);
      flatNodes.push(node);
    });

    if (!currentTargetNode && nodes.length > 0) {
      currentTargetNode = nodes.find((n) => n.status !== 'completed') || nodes[0];
    }

    const completionPercent =
      modTotalCount > 0 ? Math.round((modCompletedCount / modTotalCount) * 100) : 0;

    zones.push({
      module: mod,
      nodes,
      completedCount: modCompletedCount,
      totalCount: modTotalCount,
      completionPercent,
      earnedXp,
      totalXp: mod.totalXp,
      isZoneCompleted: modTotalCount > 0 && modCompletedCount === modTotalCount,
      containsCurrentTarget: nodes.some((n) => n.lesson.id === targetLessonId),
      currentTargetLessonId: targetLessonId,
    });
  }

  const overallPercent =
    totalAllLessons > 0 ? Math.round((totalCompletedLessons / totalAllLessons) * 100) : 0;

  return {
    zones,
    flatNodes,
    currentTargetNode,
    completedLessonsCount: totalCompletedLessons,
    totalLessonsCount: totalAllLessons,
    overallPercent,
    completedModulesCount,
    totalModulesCount: modules.length,
  };
}

export interface LessonTransitionContext {
  currentNode: MapLessonNode | null;
  prevNode: MapLessonNode | null;
  nextNode: MapLessonNode | null;
  moduleZone: MapModuleZone | null;
  nextUncompletedNode: MapLessonNode | null;
  isCrossingModuleBoundaryOnNext: boolean;
  isCrossingModuleBoundaryOnPrev: boolean;
}

export function getLessonTransitionContext(
  mapSummary: CurriculumMapSummary,
  currentLessonId: string
): LessonTransitionContext {
  const { flatNodes, zones } = mapSummary;
  const idx = flatNodes.findIndex((n) => n.lesson.id === currentLessonId);
  const currentNode = idx >= 0 ? flatNodes[idx] : null;
  const prevNode = idx > 0 ? flatNodes[idx - 1] : null;
  const nextNode = idx >= 0 && idx < flatNodes.length - 1 ? flatNodes[idx + 1] : null;
  const moduleZone = currentNode
    ? zones.find((z) => z.module.id === currentNode.moduleId) || null
    : null;

  // Next uncompleted node after current index (or wrapping from start)
  let nextUncompletedNode: MapLessonNode | null = null;
  if (idx >= 0) {
    for (let i = idx + 1; i < flatNodes.length; i++) {
      if (flatNodes[i].status !== 'completed') {
        nextUncompletedNode = flatNodes[i];
        break;
      }
    }
  }
  if (!nextUncompletedNode) {
    nextUncompletedNode = flatNodes.find((n) => n.status !== 'completed') || null;
  }

  return {
    currentNode,
    prevNode,
    nextNode,
    moduleZone,
    nextUncompletedNode,
    isCrossingModuleBoundaryOnNext: Boolean(
      currentNode && nextNode && currentNode.moduleId !== nextNode.moduleId
    ),
    isCrossingModuleBoundaryOnPrev: Boolean(
      currentNode && prevNode && currentNode.moduleId !== prevNode.moduleId
    ),
  };
}
