// src/hooks/useProgress.ts

import type { ProgressState, ScenarioProgress } from '../types/scenario';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'netpath-trainer:progress:v1';

/**
 * Manages per-scenario progress for the app.
 * Persists to localStorage under a versioned key so we can migrate later
 * without colliding with old data.
 */
export function useProgress() {
  const [progress, setProgress] = useLocalStorage<ProgressState>(
    STORAGE_KEY,
    {}
  );

  /**
   * Mark a single step as completed within a scenario.
   */
  const completeStep = (scenarioId: string, stepOrder: number) => {
    setProgress((prev) => {
      const existing: ScenarioProgress = prev[scenarioId] ?? {
        completed: false,
        completedSteps: [],
        lastAttempt: new Date().toISOString(),
      };

      const alreadyDone = existing.completedSteps.includes(stepOrder);
      const nextCompletedSteps = alreadyDone
        ? existing.completedSteps
        : [...existing.completedSteps, stepOrder].sort((a, b) => a - b);

      return {
        ...prev,
        [scenarioId]: {
          completed: existing.completed,
          completedSteps: nextCompletedSteps,
          lastAttempt: new Date().toISOString(),
        },
      };
    });
  };

  /**
   * Mark an entire scenario as completed.
   * Called when the final step is validated.
   */
  const completeScenario = (scenarioId: string) => {
    setProgress((prev) => {
      const existing: ScenarioProgress = prev[scenarioId] ?? {
        completed: false,
        completedSteps: [],
        lastAttempt: new Date().toISOString(),
      };

      return {
        ...prev,
        [scenarioId]: {
          ...existing,
          completed: true,
          lastAttempt: new Date().toISOString(),
        },
      };
    });
  };

  /**
   * Reset progress for a single scenario.
   */
  const resetScenario = (scenarioId: string) => {
    setProgress((prev) => {
      const next = { ...prev };
      delete next[scenarioId];
      return next;
    });
  };

  /**
   * Clear all progress across all scenarios.
   */
  const resetAll = () => {
    setProgress({});
  };

  /**
   * Get progress for a single scenario, or an empty default.
   */
  const getScenarioProgress = (scenarioId: string): ScenarioProgress => {
    return (
      progress[scenarioId] ?? {
        completed: false,
        completedSteps: [],
        lastAttempt: '',
      }
    );
  };

  return {
    progress,
    completeStep,
    completeScenario,
    resetScenario,
    resetAll,
    getScenarioProgress,
  };
}