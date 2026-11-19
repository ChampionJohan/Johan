/* Smile Bank service worker.

   Two tiers on purpose. The app shell is small and is precached on install so
   the app opens instantly and works offline straight away. The face-tracking
   runtime is 22 MB — precaching that would make the very first visit crawl for
   people who may never open camera mode — so it is cached the first time it is
   actually fetched, and every visit after that is offline too.

   Everything here is same-origin; the app makes no third-party requests. */

const SHELL_CACHE = "smilebank-shell-v1";
const VISION_CACHE = "smilebank-vision-v1";
const KEEP = [SHELL_CACHE, VISION_CACHE];

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

/* The heavy face-tracking assets, matched by path. */
function isVisionAsset(pathname) {
  return pathname.includes("/vendor/mediapipe/") || pathname.includes("/models/");
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (isVisionAsset(url.pathname)) {
    /* Cache on first use, then serve from cache forever. These files are
       version-pinned, so there is nothing to revalidate. */
    event.respondWith(
      caches.open(VISION_CACHE).then((cache) =>
        cache.match(event.request).then((hit) =>
          hit || fetch(event.request).then((res) => {
            if (res && res.ok) cache.put(event.request, res.clone());
            return res;
          })
        )
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        event.waitUntil(
          fetch(event.request)
            .then((res) => res && res.ok && caches.open(SHELL_CACHE).then((c) => c.put(event.request, res.clone())))
            .catch(() => {})
        );
        return cached;
      }
      return fetch(event.request).catch(() => caches.match("./index.html"));
    })
  );
});
