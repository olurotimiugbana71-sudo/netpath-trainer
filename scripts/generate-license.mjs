// scripts/generate-license.mjs
//
// Admin-only script to generate signed license keys.
// Usage:
//   node scripts/generate-license.mjs <customerId> <tier>

import { webcrypto } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const { subtle } = webcrypto;
const PREFIX = 'NPT';

function b64urlEncode(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function sign(payload, secret) {
  const enc = new TextEncoder();
  const key = await subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await subtle.sign('HMAC', key, enc.encode(payload));
  return b64urlEncode(sig).slice(0, 16);
}

function loadSecret() {
  if (process.argv[4]) return process.argv[4];
  try {
    const envPath = resolve(process.cwd(), '.env.local');
    const content = readFileSync(envPath, 'utf8');
    const match = content.match(/^VITE_LICENSE_SECRET=(.+)$/m);
    if (match) return match[1].trim();
  } catch {
    /* ignore */
  }
  if (process.env.VITE_LICENSE_SECRET) return process.env.VITE_LICENSE_SECRET;
  throw new Error(
    'Secret not found. Add VITE_LICENSE_SECRET to .env.local.'
  );
}

async function main() {
  const customerId = process.argv[2];
  const tier = process.argv[3];

  if (!customerId || !tier) {
    console.error(
      'Usage: node scripts/generate-license.mjs <customerId> <tier>'
    );
    console.error('  tier must be "premium" or "team"');
    process.exit(1);
  }

  if (tier !== 'premium' && tier !== 'team') {
    console.error('tier must be "premium" or "team"');
    process.exit(1);
  }

  const secret = loadSecret();
  const payload = {
    customerId,
    tier,
    issuedAt: new Date().toISOString(),
  };

  const payloadJson = JSON.stringify(payload);
  const payloadB64 = b64urlEncode(payloadJson);
  const signature = await sign(payloadJson, secret);
  const key = `${PREFIX}-${payloadB64}-${signature}`;

  console.log('');
  console.log('══════════════════════════════════════════════════════════');
  console.log('  NetPath Trainer — License Key Generated');
  console.log('══════════════════════════════════════════════════════════');
  console.log('');
  console.log(`  Customer:  ${customerId}`);
  console.log(`  Tier:      ${tier}`);
  console.log(`  Issued:    ${payload.issuedAt}`);
  console.log('');
  console.log('  LICENSE KEY:');
  console.log('');
  console.log(`  ${key}`);
  console.log('');
  console.log('══════════════════════════════════════════════════════════');
  console.log('');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});