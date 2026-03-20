// api/check-scheduled.js — Vercel cron (CommonJS)
const { createClient } = require('@supabase/supabase-js');

const SUPA_URL    = process.env.VITE_SUPA_URL || 'https://neihlobcyssbvrsyptve.supabase.co';
const SUPA_KEY    = process.env.SUPABASE_SERVICE_KEY;
const PUSH_SECRET = process.env.PUSH_SECRET || 'script2025';
const APP_URL     = 'https://script-sable.vercel.app';

module.exports = async function handler(req, res) {
  const sb  = createClient(SUPA_URL, SUPA_KEY);
  const now = new Date().toISOString();

  const { data: due } = await sb
    .from('scheduled_notifications')
    .select('*').eq('sent', false).lte('send_at', now);

  if (!due?.length) return res.status(200).json({ fired: 0 });

  let fired = 0;
  for (const notif of due) {
    try {
      await fetch(`${APP_URL}/api/send-push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-script-secret': PUSH_SECRET },
        body: JSON.stringify({ userId: notif.user_id, title: notif.title, body: notif.body, tag: notif.type })
      });
      await sb.from('scheduled_notifications').update({ sent: true }).eq('id', notif.id);
      fired++;
    } catch (e) { console.error(e.message); }
  }
  return res.status(200).json({ fired });
};
