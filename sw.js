var cacheName = 'pwa-test-v1';
var contentToCache = [
    '/index.html',
    '/icons/pwa-icon-192.png',
    '/icons/pwa-icon-512.png',
    '/icons/red.png',
    '/icons/green.png'
];

// make content available offline by adding it to cache
self.addEventListener('install', function(e) {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all');
            return cache.addAll(contentToCache);
        }).catch((err) => {
            console.log(err);
        })
    );
});

// whenever an request if fired by the app
self.addEventListener('fetch', function(e){
    console.log('[Service Worker] Fetched resource '+e.request.url);
});

self.addEventListener('activate', function(e) {

});
