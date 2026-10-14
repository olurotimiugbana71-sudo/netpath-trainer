// src/utils/license.ts

export interface LicensePayload {
  customerId: string;
  tier: 'premium' | 'team';
  issuedAt: string;
}

const PREFIX = 'NPT';

function b64urlEncode(input: string): string {
  return btoa(input)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function b64urlDecode(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (padded.length % 4)) % 4;
  return atob(padded + '='.repeat(padLength));
}

async function sign(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  const bytes = new Uint8Array(sig);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return b64urlEncode(binary).slice(0, 16);
}

export async function validateLicense(
  key: string,
  secret: string
): Promise<LicensePayload | null> {
  try {
    const parts = key.trim().split('-');
    if (parts.length !== 3) return null;
    if (parts[0] !== PREFIX) return null;

    const [, payloadB64, signature] = parts;
    const payloadJson = b64urlDecode(payloadB64);
    const expectedSig = await sign(payloadJson, secret);

    if (expectedSig !== signature) return null;

    const payload = JSON.parse(payloadJson) as LicensePayload;
    if (!payload.customerId || !payload.tier || !payload.issuedAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}