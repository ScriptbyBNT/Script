const CACHE = 'script-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
self.addEventListener('push', e => {
  if (!e.data) return;
  let d = {};
  try { d = e.data.json(); } catch { d = { title: 'Script', body: e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Script', {
    body: d.body || '',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    tag: d.tag || 'script',
    data: { url: d.url || '/' },
    vibrate: [200, 100, 200],
    requireInteraction: d.requireInteraction || false,
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('script-sable.vercel.app') && 'focus' in c) return c.focus();
      }
      return clients.openWindow(e.notification.data?.url || '/');
    })
  );
});
