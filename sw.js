const CACHE = 'em-toolkit-v7';

// Precache the full set of pages + assets needed for offline bedside use.
const ASSETS = [
  '/index.html',
  '/mdm.html',
  '/mdm-slash.html',
  '/calculators.html',
  '/rsi.html',
  '/vasopressors.html',
  '/algorithms.html',
  '/neurohub.html',
  '/pedsfever.html',
  '/dotphrase.html',
  '/links.html',
  '/roadmap.html',
  '/changelog.html',
  '/feedback.html',
  '/sitemap.html',
  '/vertigo-helper.html',
  '/ed-phone-directory.html',
  '/service-agreements.html',
  '/service-requests.html',
  '/theme.css',
  '/mobile.css',
  '/theme.js',
  '/search-index.js',
  '/mdm.js',
  '/mdm_slash.js',
  '/mdm_risk_engine.js',
  '/analytics.js',
  '/history_helper.json',
  '/data/dotphrases.js',
  '/mdm_packs.json',
  '/data/service_agreements_index.json',
  '/manifest.json',
  '/chatbot.js',
  '/chatbot-index.json'
];

// How long to wait for the network before falling back to cache. Keeps
// content fresh on a healthy connection but avoids hanging at the bedside
// on flaky/captive hospital wifi.
const NET_TIMEOUT_MS = 3000;

// Install: cache everything (ignore individual failures so one missing
// asset can't abort the whole install).
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(ASSETS.map(a => c.add(a).catch(() => null))))
      .then(() => self.skipWaiting())
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

// Fetch: network-first with a short timeout, falling back to cache.
// Cross-origin requests (fonts, Firebase, analytics, SharePoint) bypass the
// SW entirely so we never serve a stale opaque response for them.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith((async () => {
    const cached = await caches.match(e.request);

    const network = fetch(e.request).then(res => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    });

    // No cached copy: just wait on the network (with cache as last resort).
    if (!cached) {
      return network.catch(() => caches.match(e.request));
    }

    // Have a cached copy: race the network against a timeout so a slow/dead
    // connection serves cache fast. The in-flight network still updates the
    // cache for next time.
    const timeout = new Promise(resolve => setTimeout(() => resolve(cached), NET_TIMEOUT_MS));
    try {
      return await Promise.race([network, timeout]);
    } catch (_) {
      return cached;
    }
  })());
});
