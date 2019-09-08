// see: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers

// on Service worker changes that leads to another cache-content: set a new cache version
// old version is cached with old Service worker until it is updated
// clear old cache with activate-event (limited cache-space in browser!)
var cacheName = 'pwa-test-v4';

var contentToCache = [
    '/index.html',
    '/icons/pwa-icon-192.png',
    '/icons/pwa-icon-512.png',
    '/icons/red.png',
    //'/icons/green.png' > added by client-js
];

// make content available offline by adding it to cache
self.addEventListener('install', function(e) {
    console.log('Install');
    // don't install before Promise is returned
    e.waitUntil(
        // caches: CacheStorage object provided in Service Worker scope
        caches.open(cacheName).then((cache) => {
            console.log('Caching all');
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
    console.log('Used cache', cacheName);
    console.log('Fetch resource '+e.request.url);
    
    // FetchEvent.respondWith: like a proxy server between app and network
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


// delete old cache
// test: uninstall app but do NOT delete app-data
self.addEventListener('activate', function(e) {
    console.log('activate');

    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if(cacheName.indexOf(key) === -1) {
                    console.log("delete", key);
                    return caches.delete(key);
                }                
            }))         
        })
    );
});
