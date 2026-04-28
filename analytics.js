// ──────────────────────────────────────────────────────────────────────
//  Cloudflare Web Analytics
// ──────────────────────────────────────────────────────────────────────
//  Cookie-less, privacy-friendly site analytics. No consent banner
//  needed; no PII or PHI captured.
//
//  Setup (one-time):
//    1. Go to https://dash.cloudflare.com → Web Analytics → "Add a site"
//    2. Hostname: kimtrinh.github.io (or your custom domain)
//    3. Cloudflare generates a snippet — copy the value of
//       data-cf-beacon's "token" field (a 32-char hex string).
//    4. Paste it as CF_BEACON_TOKEN below and commit.
//
//  Once a token is set, every page that loads this file will start
//  reporting page views. Leaving the token blank disables analytics
//  with zero side effects (no script is fetched).
//
//  To pause analytics later, just blank the token and commit.
// ──────────────────────────────────────────────────────────────────────

const CF_BEACON_TOKEN = ''; // ← paste your Cloudflare beacon token here

(function () {
  if (!CF_BEACON_TOKEN) return;
  const s = document.createElement('script');
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', JSON.stringify({ token: CF_BEACON_TOKEN }));
  document.head.appendChild(s);
})();
