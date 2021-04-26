var CACHE_NAME = 'normalize-css-site-cache-v1';
var urlsToCache = [
    '/'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                // console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});
