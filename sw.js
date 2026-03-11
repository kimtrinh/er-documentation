const CACHE = 'em-toolkit-v4';
const DOTPHRASE_DB_CACHE = 'dotphrases-api-v1';
const DOTPHRASE_DB_KEY = '/api/dotphrases/store';

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
  const url = new URL(e.request.url);

  if (url.pathname === '/api/dotphrases' || /^\/api\/dotphrases\/[^/]+\/upvote$/.test(url.pathname)) {
    e.respondWith(handleDotphraseApi(e.request));
    return;
  }

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

async function readDotphraseStore() {
  const cache = await caches.open(DOTPHRASE_DB_CACHE);
  const match = await cache.match(DOTPHRASE_DB_KEY);
  if (!match) return [];
  try {
    const data = await match.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
}

async function writeDotphraseStore(items) {
  const cache = await caches.open(DOTPHRASE_DB_CACHE);
  const response = new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json' }
  });
  await cache.put(DOTPHRASE_DB_KEY, response);
}

function stableHash(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function normalizeItem(raw, index) {
  const dot = String(raw.dot || '').trim();
  const cond = String(raw.cond || '').trim();
  const cat = String(raw.cat || '').trim();
  const text = String(raw.text || '').trim();
  const createdAtRaw = Number(raw.createdAt);
  const votesRaw = Number(raw.votes);
  const createdAt = Number.isFinite(createdAtRaw) ? createdAtRaw : 0;
  const votes = Number.isFinite(votesRaw) ? votesRaw : 0;
  const fallbackId = `dp_${stableHash(`${dot}|${cond}|${cat}|${text}|${index}`)}`;

  return {
    ...raw,
    dot,
    cond,
    cat,
    text,
    id: String(raw.id || fallbackId),
    createdAt,
    votes
  };
}

async function readNormalizedStore() {
  const items = await readDotphraseStore();
  return items.map((item, index) => normalizeItem(item, index));
}

async function handleDotphraseApi(request) {
  const url = new URL(request.url);

  if (request.method === 'POST') {
    const upvoteMatch = url.pathname.match(/^\/api\/dotphrases\/([^/]+)\/upvote$/);
    if (upvoteMatch) {
      const id = decodeURIComponent(upvoteMatch[1]);
      const existing = await readNormalizedStore();
      const idx = existing.findIndex(item => item.id === id);
      if (idx === -1) {
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      existing[idx].votes += 1;
      await writeDotphraseStore(existing);
      return new Response(JSON.stringify(existing[idx]), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (request.method === 'GET') {
    const items = await readNormalizedStore();
    return new Response(JSON.stringify(items), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (request.method === 'POST') {
    try {
      const payload = await request.json();
      const item = {
        dot: String(payload.dot || '').trim(),
        cond: String(payload.cond || '').trim(),
        cat: String(payload.cat || '').trim(),
        text: String(payload.text || '').trim(),
        id: String(payload.id || '').trim(),
        createdAt: Number(payload.createdAt) || Date.now(),
        votes: Number(payload.votes) || 0
      };

      if (!item.dot || !item.cond || !item.cat || !item.text) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const existing = await readNormalizedStore();
      const normalized = normalizeItem(item, existing.length);
      existing.unshift(normalized);
      await writeDotphraseStore(existing);
      return new Response(JSON.stringify(normalized), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}
