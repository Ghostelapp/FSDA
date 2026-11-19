import type { Variants } from 'framer-motion';

export type LessonStepId = 'all' | '1-teoria' | '2-przyklady' | '3-cwiczenie' | '4-quiz';

const STEP_ORDER: Record<LessonStepId, number> = {
  all: 0,
  '1-teoria': 1,
  '2-przyklady': 2,
  '3-cwiczenie': 3,
  '4-quiz': 4,
};

/**
 * Computes slide direction for lesson-to-lesson navigation.
 * Returns 1 when moving forward (next lesson slides in from right),
 * or -1 when moving backward (previous lesson slides in from left).
 */
export function computeLessonSlideDirection(prevIndex: number, nextIndex: number): 1 | -1 {
  if (prevIndex < 0 || nextIndex < 0) return 1;
  if (nextIndex < prevIndex) return -1;
  return 1;
}

/**
 * Computes slide direction when switching between stages inside a lesson.
 */
export function computeStepSlideDirection(prevStep: LessonStepId, nextStep: LessonStepId): 1 | -1 {
  const prevRank = STEP_ORDER[prevStep] ?? 0;
  const nextRank = STEP_ORDER[nextStep] ?? 0;
  return nextRank < prevRank ? -1 : 1;
}

/**
 * Builds Framer Motion directional slide variants for lesson transitions.
 * Respects `prefers-reduced-motion` by removing horizontal displacement when enabled.
 */
export function getLessonSlideVariants(reducedMotion: boolean): Variants {
  const offset = reducedMotion ? 0 : 48;

  return {
    enter: (direction: number) => ({
      x: direction >= 0 ? offset : -offset,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { duration: reducedMotion ? 0.01 : 0.24, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: reducedMotion ? 0.01 : 0.2, ease: 'easeOut' },
      },
    },
    exit: (direction: number) => ({
      x: direction >= 0 ? -offset : offset,
      opacity: 0,
      transition: {
        x: { duration: reducedMotion ? 0.01 : 0.16, ease: [0.4, 0, 1, 1] },
        opacity: { duration: reducedMotion ? 0.01 : 0.14, ease: 'easeIn' },
      },
    }),
  };
}

/**
 * Builds lighter Framer Motion directional slide variants for intra-lesson stage tabs.
 */
export function getStepSlideVariants(reducedMotion: boolean): Variants {
  const offset = reducedMotion ? 0 : 28;

  return {
    enter: (direction: number) => ({
      x: direction >= 0 ? offset : -offset,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { duration: reducedMotion ? 0.01 : 0.2, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: reducedMotion ? 0.01 : 0.16, ease: 'easeOut' },
      },
    },
    exit: (direction: number) => ({
      x: direction >= 0 ? -offset : offset,
      opacity: 0,
      transition: {
        x: { duration: reducedMotion ? 0.01 : 0.14, ease: [0.4, 0, 1, 1] },
        opacity: { duration: reducedMotion ? 0.01 : 0.12, ease: 'easeIn' },
      },
    }),
  };
}
