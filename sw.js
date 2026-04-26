const CACHE_NAME = 'Gyandeep-v4';
const ASSETS = [
    'index.html',
    'style.css',
    'app.js',
    'manifest.json',
    'offline.html',
    'icon-192.png',
    'icon-512.png'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request) || caches.match('offline.html'))
    );
});
