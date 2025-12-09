const CACHE_NAME = 'pwa-modern-v1';
const ASSETS = [
'/',
'/index.html',
'/about.html',
'/offline.html',
'/style.css',
'/app.js',
'/data.json'
];


self.addEventListener('install', evt => {
self.skipWaiting();
evt.waitUntil(
caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
);
});


self.addEventListener('activate', evt => {
evt.waitUntil(
caches.keys().then(keys => Promise.all(
keys.map(k => { if (k !== CACHE_NAME) return caches.delete(k); })
))
);
});


self.addEventListener('fetch', evt => {
const req = evt.request;
// Network-first for API/data.json
if (req.url.endsWith('/data.json')) {
evt.respondWith(
fetch(req).then(res => {
const copy = res.clone();
caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
return res;
}).catch(() => caches.match(req))
);
return;
}


// Cache-first for navigation and assets
evt.respondWith(
caches.match(req).then(cached => cached || fetch(req))
.catch(() => caches.match('/offline.html'))
);
});


// Basic notification click handler
self.addEventListener('notificationclick', event => {
event.notification.close();
event.waitUntil(
clients.matchAll({ type: 'window' }).then(clientList => {
for (const client of clientList) {
if (client.url === '/' && 'focus' in client) return client.focus();
}
if (clients.openWindow) return clients.openWindow('/');
})
);
});