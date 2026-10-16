// src/types/scenario.ts

/**
 * Difficulty level for a scenario.
 */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * How the user's command input is validated against the expected command.
 */
export type ValidationMode = 'exact' | 'contains' | 'regex';

/**
 * A single guided step within a troubleshooting scenario.
 */
export interface GuidedStep {
  order: number;
  prompt: string;
  expectedCommand: string;
  hint: string;
  validation: ValidationMode;
}

/**
 * A full troubleshooting scenario.
 */
export interface Scenario {
  id: string;
  title: string;
  difficulty: Difficulty;
  topic: string;
  symptoms: string[];
  rootCause: string;
  steps: GuidedStep[];
  premium: boolean;
}

/**
 * Progress record for a single scenario.
 */
export interface ScenarioProgress {
  completed: boolean;
  completedSteps: number[];
  lastAttempt: string;
}

/**
 * Map of scenario ID to its progress record.
 */
export type ProgressState = Record<string, ScenarioProgress>;
