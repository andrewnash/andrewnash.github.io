// The previous site (Urara, until 2026) registered a Workbox service worker at /sw.js that cached
// the old pages. Returning visitors' browsers re-fetch this file, so it now replaces that worker,
// clears its caches and unregisters itself so they get the live site.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) await caches.delete(key)
      await self.registration.unregister()
      for (const client of await self.clients.matchAll({ type: 'window' })) client.navigate(client.url)
    })()
  )
})
