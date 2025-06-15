const CACHE_NAME = 'gcse-cs-textbook-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
  // Core assets will be cached by Vite's build process, 
  // but this ensures the main shell is available offline.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
