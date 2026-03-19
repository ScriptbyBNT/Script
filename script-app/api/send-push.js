// api/send-push.js
import { createClient } from '@supabase/supabase-js';

const SUPA_URL = process.env.VITE_SUPA_URL || 'https://neihlobcyssbvrsyptve.supabase.co';
const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY;
const VAPID_PUBLIC  = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const PUSH_SECRET   = process.env.PUSH_SECRET || 'script2025';

function b64u(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
}

function b64uDecode(str) {
  str = str.replace(/-/g,'+').replace(/_/g,'/');
  while(str.length % 4) str += '=';
  return Buffer.from(str, 'base64');
}

async function buildVapidHeaders(audience, vapidPublic, vapidPrivate) {
  const crypto = await import('crypto');
  const exp = Math.floor(Date.now()/1000) + 12*3600;
  const header = b64u(Buffer.from(JSON.stringify({typ:'JWT',alg:'ES256'})));
  const payload = b64u(Buffer.from(JSON.stringify({aud:audience,exp,sub:'mailto:script@blunorthtechnology.com'})));
  const unsigned = `${header}.${payload}`;
  const privKeyDer = b64uDecode(vapidPrivate);
  const key = crypto.default.createPrivateKey({
    key: Buffer.concat([Buffer.from('308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b0201010420','hex'), privKeyDer, Buffer.from('a144034200','hex'), b64uDecode(vapidPublic)]),
    format:'der', type:'pkcs8'
  });
  const sig = crypto.default.sign(null, Buffer.from(unsigned), {key, dsaEncoding:'ieee-p1363'});
  return { Authorization: `vapid t=${unsigned}.${b64u(sig)},k=${vapidPublic}` };
}

async function sendOne(sub, payload, vapidPublic, vapidPrivate) {
  const endpoint = sub.endpoint;
  const url = new URL(endpoint);
  const audience = `${url.protocol}//${url.host}`;
  const headers = await buildVapidHeaders(audience, vapidPublic, vapidPrivate);

  // Encrypt payload (simple text, not encrypted — use for FCM/APNS compatible services)
  const encoder = new TextEncoder();
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);

  headers['Content-Type'] = 'application/json';
  headers['TTL'] = '86400';

  const res = await fetch(endpoint, { method: 'POST', headers, body });
  return res.status;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (req.headers['x-script-secret'] !== PUSH_SECRET) return res.status(401).end();

  const { userId, title, body, tag, url } = req.body || {};
  if (!userId || !title) return res.status(400).json({ error: 'Missing fields' });

  const sb = createClient(SUPA_URL, SUPA_KEY);
  const { data: subs } = await sb.from('push_subscriptions').select('subscription').eq('user_id', userId);
  if (!subs?.length) return res.status(200).json({ sent: 0 });

  const payload = { title, body: body||'', tag: tag||'script', url: url||'/' };
  let sent = 0;
  for (const { subscription } of subs) {
    try {
      const status = await sendOne(subscription, payload, VAPID_PUBLIC, VAPID_PRIVATE);
      if (status < 300) sent++;
      else if (status === 410) {
        // Subscription expired — remove it
        await sb.from('push_subscriptions').delete().eq('subscription->endpoint', subscription.endpoint);
      }
    } catch(e) { console.error('push error', e.message); }
  }
  return res.status(200).json({ sent });
}
