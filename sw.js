// see: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers
var cacheName = 'pwa-test-v1';
var contentToCache = [
    '/index.html',
    '/icons/pwa-icon-192.png',
    '/icons/pwa-icon-512.png',
    '/icons/red.png',
    //'/icons/green.png'
];

// make content available offline by adding it to cache
self.addEventListener('install', function(e) {
    console.log('[Service Worker] Install');
    // don't install before Promise is returned
    e.waitUntil(
        // caches: CacheStorage object provided in Service Worker scope
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all');
            return cache.addAll(contentToCache); // return Promise
        }).catch((err) => {
            console.log(err);
        })
    );
});

// whenever an request if fired by the app
// customs responses can be used instead of default response 
// used resource must be in cache
self.addEventListener('fetch', function(e){
    console.log('Fetch resource '+e.request.url);
    
    e.respondWith(
        caches.match(e.request).then((r) => {
        
            if(r) {
                return r; // response from cache
            } else { // not in cache
                return fetch(e.request).then((response) => {
                    console.log("Fetch and write in cache");
                    return caches.open(cacheName).then((cache) => {
                        cache.put(e.request, response.clone()); // write response in cache
                        return response; // return response
                    });          
                });    
            }
            
        })
    ); 
      
});


// ??? called only once
// e.g. delete not needed files
self.addEventListener('activate', function(e) {
    console.log('[Service Worker] Activate');
});
