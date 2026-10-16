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

import qosVoice from './scenarios/qos-voice-01.json';
import stpRoot from './scenarios/stp-root-01.json';
import staticNat from './scenarios/static-nat-01.json';
import extendedAcl from './scenarios/extended-acl-01.json';
import ospfAbr from './scenarios/ospf-abr-01.json';

import ipv6Dualstack from './scenarios/ipv6-dualstack-01.json';
import sshAccess from './scenarios/ssh-access-01.json';
import cdpLldp from './scenarios/cdp-lldp-01.json';
import syslog from './scenarios/syslog-01.json';
import ipSla from './scenarios/ip-sla-01.json';

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
  qosVoice as Scenario,
  stpRoot as Scenario,
  staticNat as Scenario,
  extendedAcl as Scenario,
  ospfAbr as Scenario,
  ipv6Dualstack as Scenario,
  sshAccess as Scenario,
  cdpLldp as Scenario,
  syslog as Scenario,
  ipSla as Scenario,
];

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}

export function getScenariosByDifficulty(
  difficulty: Scenario['difficulty']
): Scenario[] {
  return scenarios.filter((s) => s.difficulty === difficulty);
}