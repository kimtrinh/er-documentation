const CACHE = 'em-toolkit-v4';

const ASSETS = [
  '/index.html',
  '/home.html',
  '/mdm.html',
  '/calculators.html',
  '/rsi.html',
  '/vasopressors.html',
  '/algorithms.html',
  '/neurohub.html',
  '/pedsfever.html',
  '/dotphrase.html',
  '/links.html',
  '/roadmap.html',
  '/ed-phone-directory.html',
  '/service-agreements.html',
  '/service-requests.html',
  '/agreements.html',
  '/theme.css',
  '/mobile.css',
  '/theme.js',
  '/search-index.js',
  '/mdm.js',
  '/history_helper.json',
  '/data/dotphrases.js',
  '/mdm_packs.json',
  '/data/service_agreements_index.json',
  '/manifest.json'
];

// Install: cache everything
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate: clear old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first, fall back to cache when offline
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
