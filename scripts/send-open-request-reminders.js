#!/usr/bin/env node
/**
 * Weekly "still-open service request" reminder.
 *
 * Reads the public `serviceRequests` Firestore collection (project `er-docu`,
 * public read rules), keeps everything that isn't Resolved, groups by location,
 * and emails each location's fulfiller a list of their open tickets via the
 * EmailJS REST API — clearly labeled as an AUTOMATIC weekly reminder that asks
 * them to click "Resolve" on anything already done.
 *
 *   OMC open tickets -> Russell (Russel.W.Maxie-Sr@kp.org)
 *   FMC open tickets -> David   (David.J.Thiessen@kp.org)
 *
 * Runs from GitHub Actions (see .github/workflows/weekly-service-request-reminder.yml).
 * No npm dependencies — uses Node 20's built-in fetch.
 *
 * Config comes from env (public values are safe to hardcode as workflow env;
 * only EMAILJS_PRIVATE_KEY + EMAILJS_REMINDER_TEMPLATE_ID are repo secrets):
 *   FIREBASE_PROJECT_ID           (default: er-docu)
 *   FIREBASE_API_KEY              (already public in service-requests.html)
 *   EMAILJS_SERVICE_ID            (e.g. service_7s9tj4j)
 *   EMAILJS_PUBLIC_KEY            (e.g. ZUkxeb4p-LrOetbHE)
 *   EMAILJS_PRIVATE_KEY           (secret — EmailJS Account -> API Keys)
 *   EMAILJS_REMINDER_TEMPLATE_ID  (secret/var — the reminder template you create)
 *   SITE_URL                      (link to the Service Requests page)
 *   DRY_RUN=1                     (print emails instead of sending)
 *
 * Recipient addresses mirror NOTIFY_EMAILS in service-requests.html — keep in sync.
 */

'use strict';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'er-docu';
const API_KEY = process.env.FIREBASE_API_KEY || '';
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || '';
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || '';
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_REMINDER_TEMPLATE_ID || '';
const SITE_URL = process.env.SITE_URL || 'https://er-toolkit.kltrinh-28a.workers.dev/service-requests.html';
const DRY_RUN = /^(1|true|yes)$/i.test(process.env.DRY_RUN || '');

// Location -> fulfiller. Mirrors service-requests.html routing (OMC->Russell, FMC->David).
const RECIPIENTS = {
  OMC: { name: 'Russell', email: 'Russel.W.Maxie-Sr@kp.org' },
  FMC: { name: 'David',   email: 'David.J.Thiessen@kp.org' },
};

const STATUS_LABEL = { open: 'Open', inprogress: 'In Progress', resolved: 'Resolved' };

function die(msg) { console.error('ERROR: ' + msg); process.exit(1); }

// ── Firestore REST value unwrapping ──────────────────────────────────────────
function unwrap(v) {
  if (v == null) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('booleanValue' in v) return v.booleanValue;
  if ('timestampValue' in v) return v.timestampValue;
  if ('nullValue' in v) return null;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(unwrap);
  if ('mapValue' in v) {
    const o = {}; const f = v.mapValue.fields || {};
    for (const k in f) o[k] = unwrap(f[k]);
    return o;
  }
  return null;
}

async function fetchOpenRequests() {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery?key=${API_KEY}`;
  const body = { structuredQuery: { from: [{ collectionId: 'serviceRequests' }] } };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) die(`Firestore query failed: ${res.status} ${await res.text()}`);
  const rows = await res.json();
  const out = [];
  for (const row of rows) {
    if (!row.document) continue; // skip readTime-only entries
    const f = row.document.fields || {};
    const doc = {};
    for (const k in f) doc[k] = unwrap(f[k]);
    if ((doc.status || 'open') === 'resolved') continue; // "still open" = not resolved
    out.push(doc);
  }
  return out;
}

function ageDays(ts) {
  if (!ts) return null;
  const ms = Date.now() - Date.parse(ts);
  return Number.isFinite(ms) ? Math.max(0, Math.floor(ms / 86400000)) : null;
}

function formatTickets(items) {
  // Oldest first so the most stale tickets are at the top.
  items.sort((a, b) => Date.parse(a.createdAt || 0) - Date.parse(b.createdAt || 0));
  return items.map((t, i) => {
    const parts = [];
    parts.push(`${i + 1}. [${t.priority || 'Medium'}] ${t.title || '(untitled)'}`);
    const meta = [];
    if (t.room) meta.push(`Rm ${t.room}`);
    if (t.category) meta.push(t.category);
    meta.push(STATUS_LABEL[t.status] || t.status || 'Open');
    const age = ageDays(t.createdAt);
    if (age != null) meta.push(`open ${age} day${age === 1 ? '' : 's'}`);
    if (t.submitter && t.submitter !== 'Anonymous') meta.push(`by ${t.submitter}`);
    return parts[0] + '\n     ' + meta.join(' · ');
  }).join('\n');
}

async function sendEmail(params) {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY,
      template_params: params,
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`EmailJS ${res.status}: ${text}`);
  return text;
}

async function main() {
  if (!API_KEY) die('FIREBASE_API_KEY is required.');
  if (!DRY_RUN) {
    const missing = [];
    if (!EMAILJS_SERVICE_ID) missing.push('EMAILJS_SERVICE_ID');
    if (!EMAILJS_PUBLIC_KEY) missing.push('EMAILJS_PUBLIC_KEY');
    if (!EMAILJS_PRIVATE_KEY) missing.push('EMAILJS_PRIVATE_KEY');
    if (!EMAILJS_TEMPLATE_ID) missing.push('EMAILJS_REMINDER_TEMPLATE_ID');
    if (missing.length) {
      // Not yet configured — skip cleanly (exit 0) so pre-setup scheduled runs
      // don't show a weekly failure. Add the EmailJS secrets to enable sending.
      console.log(`Reminder not configured yet — missing: ${missing.join(', ')}. Skipping (no email sent). Add the EmailJS secrets to enable, or run with DRY_RUN=1 to preview.`);
      return;
    }
  }

  const open = await fetchOpenRequests();
  const byLoc = { OMC: [], FMC: [] };
  for (const t of open) {
    const loc = (t.location || '').toUpperCase();
    if (byLoc[loc]) byLoc[loc].push(t);
  }

  let sent = 0, skipped = 0, failed = 0;
  for (const loc of Object.keys(RECIPIENTS)) {
    const items = byLoc[loc] || [];
    const who = RECIPIENTS[loc];
    if (!items.length) { console.log(`${loc}: 0 open tickets — no reminder to ${who.name}.`); skipped++; continue; }

    const params = {
      to_email: who.email,
      to_name: who.name,
      location: loc,
      count: String(items.length),
      tickets: formatTickets(items),
      site_url: SITE_URL,
    };

    if (DRY_RUN) {
      console.log(`\n===== DRY RUN — ${loc} -> ${who.name} <${who.email}> (${items.length} open) =====`);
      console.log(`This is an automatic weekly reminder. ${items.length} ${loc} service request(s) are still open:\n`);
      console.log(params.tickets);
      console.log(`\nIf any of these are done, open ${SITE_URL} and click Resolve to close them.`);
      console.log('(Automated reminder — no reply needed.)');
      sent++;
      continue;
    }

    try {
      await sendEmail(params);
      console.log(`${loc}: reminder sent to ${who.name} <${who.email}> (${items.length} open).`);
      sent++;
    } catch (e) {
      console.error(`${loc}: FAILED to email ${who.name}: ${e.message}`);
      failed++;
    }
  }

  console.log(`\nDone. sent/printed=${sent} skipped(no-open)=${skipped} failed=${failed}${DRY_RUN ? ' [DRY_RUN]' : ''}.`);
  if (failed) process.exit(1);
}

main().catch(e => die(e && e.stack ? e.stack : String(e)));
