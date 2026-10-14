// src/utils/difficulty.ts

import type { Difficulty } from '../types/scenario';

/**
 * Human-readable label for each difficulty level.
 * Color styling is handled by CSS classes (.badge--beginner, etc.).
 */
export const difficultyLabel: Record<Difficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};