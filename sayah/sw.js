/* SayAh service worker.

   This app is meant to be opened in the worst possible conditions: a foreign
   hospital, no roaming, one bar of signal, a dead data plan. So the cache is
   the source of truth — every same-origin request is served from cache first
   and only falls through to the network when the cache has nothing. The app
   makes no third-party requests at all, so there is nothing else to handle. */

const CACHE_NAME = "sayah-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-any-192.png",
  "./icons/icon-any-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
  "./icons/icon-apple-180.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        /* Refresh the copy in the background, but never make the user wait
           for it — they already have a usable answer on screen. */
        event.waitUntil(
          fetch(event.request)
            .then((res) => res && res.ok && caches.open(CACHE_NAME).then((c) => c.put(event.request, res.clone())))
            .catch(() => {})
        );
        return cached;
      }
      return fetch(event.request).catch(() => caches.match("./index.html"));
    })
  );
});
