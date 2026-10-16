// src/data/scenarios.ts

import type { Scenario } from '../types/scenario';

import vlanTrunk from './scenarios/vlan-trunk-01.json';
import stpLoop from './scenarios/stp-loop-01.json';
import ospfBlackhole from './scenarios/ospf-blackhole-01.json';
import natExhaustion from './scenarios/nat-exhaustion-01.json';
import aclBlocking from './scenarios/acl-blocking-01.json';

import etherchannel from './scenarios/etherchannel-01.json';
import hsrp from './scenarios/hsrp-01.json';
import eigrp from './scenarios/eigrp-01.json';
import dhcpRelay from './scenarios/dhcp-relay-01.json';
import staticRouting from './scenarios/static-routing-01.json';

export const scenarios: Scenario[] = [
  vlanTrunk as Scenario,
  stpLoop as Scenario,
  ospfBlackhole as Scenario,
  natExhaustion as Scenario,
  aclBlocking as Scenario,
  etherchannel as Scenario,
  hsrp as Scenario,
  eigrp as Scenario,
  dhcpRelay as Scenario,
  staticRouting as Scenario,
];

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}

export function getScenariosByDifficulty(
  difficulty: Scenario['difficulty']
): Scenario[] {
  return scenarios.filter((s) => s.difficulty === difficulty);
}
