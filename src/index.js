// Cloudflare Worker: Paystack Webhook & License Generator

const PREFIX = 'NPT';

function b64urlEncode(input) {
  return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sign(payload, secret) {
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

async function verifyPaystackSignature(bodyText, signature, secretKey) {
  if (!signature) return false;
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secretKey),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['verify']
    );
    const sigBytes = new Uint8Array(
      signature.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
    return await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      enc.encode(bodyText)
    );
  } catch {
    return false;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/' && request.method === 'GET') {
      return new Response('NetPath License Worker — OK', { status: 200 });
    }

    if (url.pathname === '/webhook' && request.method === 'POST') {
      const signature = request.headers.get('x-paystack-signature');
      const bodyText = await request.text();

      const isValid = await verifyPaystackSignature(
        bodyText,
        signature,
        env.PAYSTACK_SECRET_KEY
      );

      if (!isValid) {
        return new Response('Unauthorized', { status: 401 });
      }

      let event;
      try {
        event = JSON.parse(bodyText);
      } catch {
        return new Response('Bad JSON', { status: 400 });
      }

      if (event.event === 'charge.success') {
        const customerEmail = event.data.customer.email;
        const amountPaid = event.data.amount / 100;

        const payload = {
          customerId: customerEmail,
          tier: 'premium',
          issuedAt: new Date().toISOString(),
        };
        const payloadJson = JSON.stringify(payload);
        const payloadB64 = b64urlEncode(payloadJson);
        const signatureStr = await sign(payloadJson, env.LICENSE_SECRET);
        const licenseKey = `${PREFIX}-${payloadB64}-${signatureStr}`;

        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'NetPath Trainer <onboarding@resend.dev>',
            to: customerEmail,
            subject: 'Your NetPath Trainer License Key',
            html: `
              <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #111827;">Welcome to NetPath Trainer Premium!</h2>
                <p>Thank you for your payment of ₦${amountPaid.toLocaleString()}.</p>
                <p>Here is your license key:</p>
                <div style="font-size: 14px; font-weight: bold; background: #f3f4f6; padding: 15px; border-radius: 8px; font-family: monospace; word-break: break-all; border: 1px solid #e5e7eb;">
                  ${licenseKey}
                </div>
                <p style="margin-top: 20px;">To activate:</p>
                <ol>
                  <li>Go to <a href="https://olurotimiugbana71-sudo.github.io/netpath-trainer/activate">NetPath Trainer</a></li>
                  <li>Paste the key above.</li>
                </ol>
                <p>Save this key — you'll need it if you switch devices.</p>
                <p>— Rotimi / ApexDynamics Solutions</p>
              </div>
            `,
          }),
        });

        if (!emailRes.ok) {
          const errorText = await emailRes.text();
          console.error('Resend error:', errorText);
          return new Response('Email failed', { status: 500 });
        }
      }

      return new Response('OK', { status: 200 });
    }

    return new Response('Not Found', { status: 404 });
  },
};