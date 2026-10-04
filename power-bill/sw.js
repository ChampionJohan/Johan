/* 얼마나와 service worker — the whole app is static and makes no network
   calls, so everything is served cache-first and refreshed in the background. */
const CACHE_NAME = "eolmanawa-v1";
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
    caches.open(CACHE_NAME).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        event.waitUntil(
          fetch(event.request)
            .then(res => res && res.ok && caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone())))
            .catch(() => {})
        );
        return cached;
      }
      return fetch(event.request).catch(() => caches.match("./index.html"));
    })
  );
});
