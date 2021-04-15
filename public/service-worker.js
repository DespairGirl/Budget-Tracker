const FILE_TO_CACHE = [
    "/",
    "/public/index.html",
    "/public/db.js",
    "/public/index.js",
    "/public/manifest.json",
    "/public/service-worker.js",
    "/public/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

const CACHE_VERSION = "static-cache-v1";
const DATA_CACHE_VERSION = "data-cache-v1";

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => {
                return cache.addAll(FILE_TO_CACHE)
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {

    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_VERSION && key !== DATA_CACHE_VERSION) {

                        return caches.delete(keyList);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes("/api/") && event.request.method === "GET") {
        event.respondWith(
            caches
                .open(DATA_CACHE_VERSION)
                .then((cache) => {
                    return fetch(event.request)
                        .then((response) => {
                            if (response.status === 200) {
                                cache.put(event.request, respone.clone());
                            }
                            return response;
                        })
                        .catch(() => {
                            return cache.match(event.request);
                        });
                })
                .catch((err) => console.log(err))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return reponse || fetch(event.request);
        })
    );
})



