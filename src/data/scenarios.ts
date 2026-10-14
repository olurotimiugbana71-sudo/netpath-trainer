// src/data/scenarios.ts

import type { Scenario } from '../types/scenario';

import vlanTrunk from './scenarios/vlan-trunk-01.json';
import stpLoop from './scenarios/stp-loop-01.json';
import ospfBlackhole from './scenarios/ospf-blackhole-01.json';
import natExhaustion from './scenarios/nat-exhaustion-01.json';
import aclBlocking from './scenarios/acl-blocking-01.json';

/**
 * All scenarios available in the app.
 * Add new scenarios by importing the JSON file above and appending it here.
 */
export const scenarios: Scenario[] = [
  vlanTrunk as Scenario,
  stpLoop as Scenario,
  ospfBlackhole as Scenario,
  natExhaustion as Scenario,
  aclBlocking as Scenario,
];

/**
 * Look up a scenario by its unique ID.
 */
export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}

/**
 * Get all scenarios filtered by difficulty.
 */
export function getScenariosByDifficulty(
  difficulty: Scenario['difficulty']
): Scenario[] {
  return scenarios.filter((s) => s.difficulty === difficulty);
}