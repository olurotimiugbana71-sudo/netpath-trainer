// src/types/scenario.ts

/**
 * Difficulty level for a scenario.
 * Used for filtering and visual badges.
 */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * How the user's command input is validated against the expected command.
 * - 'exact':    input must match expected exactly (trimmed, case-insensitive)
 * - 'contains': input must contain the expected substring
 * - 'regex':    expected is treated as a regular expression
 */
export type ValidationMode = 'exact' | 'contains' | 'regex';

/**
 * A single guided step within a troubleshooting scenario.
 */
export interface GuidedStep {
  /** Display order, starting at 1 */
  order: number;
  /** The question or task shown to the user */
  prompt: string;
  /** The correct CLI command the user should type */
  expectedCommand: string;
  /** Progressive hint shown if the user clicks "Need a hint?" */
  hint: string;
  /** How strictly to match the user's input */
  validation: ValidationMode;
}

/**
 * A full troubleshooting scenario.
 */
export interface Scenario {
  /** Unique identifier, matches the JSON filename (without .json) */
  id: string;
  /** Human-readable title */
  title: string;
  /** Difficulty level */
  difficulty: Difficulty;
  /** Topic category (e.g., 'VLAN', 'STP', 'OSPF', 'NAT', 'ACL') */
  topic: string;
  /** User-facing symptoms that describe the problem */
  symptoms: string[];
  /** The actual root cause (revealed only at the end) */
  rootCause: string;
  /** Ordered list of guided steps the user must complete */
  steps: GuidedStep[];
  /** Whether this scenario requires a premium license to unlock */
  premium: boolean;
}

/**
 * Progress record for a single scenario.
 */
export interface ScenarioProgress {
  /** Whether the user has completed all steps */
  completed: boolean;
  /** Which step orders have been completed (e.g., [1, 2, 3]) */
  completedSteps: number[];
  /** ISO timestamp of the last attempt */
  lastAttempt: string;
}

/**
 * Map of scenario ID to its progress record.
 * This is what gets persisted in localStorage.
 */
export type ProgressState = Record<string, ScenarioProgress>;