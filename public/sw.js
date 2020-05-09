const cacheStore = "Radio-PWA-1.0.2";
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(cacheStore).then((cache) => {
            return cache.addAll([
                "./",
                "./js/main.js",
                "./css/bulma.min.css",
                "./css/main.css",
            ]).then(() => self.skipWaiting());
        })
    );
});
self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            return res || fetch(e.request);
        })
    );
});
self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('Radio-PWA') && cacheStore != cacheName;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    )
})