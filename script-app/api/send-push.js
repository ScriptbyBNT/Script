// api/send-push.js — Vercel serverless (CommonJS)
const { createClient } = require('@supabase/supabase-js');
const webpush = require('web-push');

const SUPA_URL    = process.env.VITE_SUPA_URL || 'https://neihlobcyssbvrsyptve.supabase.co';
const SUPA_KEY    = process.env.SUPABASE_SERVICE_KEY;
const PUSH_SECRET = process.env.PUSH_SECRET || 'script2025';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (req.headers['x-script-secret'] !== PUSH_SECRET) return res.status(401).end();

  const vapidPublic  = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  if (!vapidPublic || !vapidPrivate) return res.status(500).json({ error: 'VAPID keys not set' });

  webpush.setVapidDetails('mailto:script@blunorthtechnology.com', vapidPublic, vapidPrivate);

  const { userId, title, body, tag, url } = req.body || {};
  if (!userId || !title) return res.status(400).json({ error: 'Missing fields' });

  const sb = createClient(SUPA_URL, SUPA_KEY);
  const { data: subs } = await sb.from('push_subscriptions').select('subscription').eq('user_id', userId);
  if (!subs?.length) return res.status(200).json({ sent: 0 });

  const payload = JSON.stringify({ title, body: body || '', tag: tag || 'script', url: url || '/' });
  let sent = 0;
  for (const { subscription } of subs) {
    try {
      await webpush.sendNotification(subscription, payload);
      sent++;
    } catch (e) {
      if (e.statusCode === 410) {
        await sb.from('push_subscriptions').delete().eq('user_id', userId);
      }
    }
  }
  return res.status(200).json({ sent });
};
