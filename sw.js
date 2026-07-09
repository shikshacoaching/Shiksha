const CACHE_NAME = 'Gyandeep-v10'; // Forced update to v10
const ASSETS = [
    'index.html',
    'style.css',
    'app.js',
    'manifest.json',
    'offline.html'
];

self.addEventListener('install', e => {
    self.skipWaiting(); // Force update immediately
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
        })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request) || caches.match('offline.html'))
    );
});
