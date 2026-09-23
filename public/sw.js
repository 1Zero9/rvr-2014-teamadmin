self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
// This intentionally does not cache match data, images, or authenticated pages.
self.addEventListener('fetch', () => {});
