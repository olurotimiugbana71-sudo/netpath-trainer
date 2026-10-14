// src/utils/validation.ts

import type { GuidedStep } from '../types/scenario';

/**
 * Normalize a command string for comparison:
 * - Trim leading/trailing whitespace
 * - Collapse internal whitespace to single spaces
 * - Lowercase everything
 */
function normalize(input: string): string {
  return input.trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * Validate the user's command input against the expected command
 * using the step's validation mode.
 */
export function validateCommand(
  input: string,
  step: GuidedStep
): boolean {
  const userInput = normalize(input);
  const expected = normalize(step.expectedCommand);

  if (userInput.length === 0) return false;

  switch (step.validation) {
    case 'exact':
      return userInput === expected;

    case 'contains':
      return userInput.includes(expected);

    case 'regex':
      try {
        return new RegExp(expected, 'i').test(input);
      } catch {
        // Bad regex in scenario data — fail safe rather than crash
        return false;
      }

    default:
      return false;
  }
}