/* Chatbot widget — pure-client retrieval over chatbot-index.json.
   No LLM, no API. BM25 ranking with title/heading boosts.
   Mounts itself: include <script src="chatbot.js?v=1" defer></script>. */
(function () {
  'use strict';

  if (window.__chatbotMounted) return;
  window.__chatbotMounted = true;

  const INDEX_URL = 'chatbot-index.json';
  const STOP = new Set([
    'a','an','and','are','as','at','be','but','by','for','from','has','have','he',
    'her','his','i','if','in','into','is','it','its','of','on','or','our','that',
    'the','their','them','then','there','these','they','this','to','was','we',
    'were','what','when','where','which','who','why','will','with','you','your',
    'do','does','did','how','can','could','should','would','about','tell','show','me'
  ]);

  function tokenize(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[^\w\s.\-/]/g, ' ')
      .split(/[\s.\-/]+/)
      .filter((t) => t && t.length >= 2 && !STOP.has(t))
      .map((t) => t.replace(/(ing|ed|es|s)$/, (m) => (t.length - m.length >= 4 ? '' : m)));
  }

  function buildBM25(chunks) {
    const N = chunks.length;
    const docs = chunks.map((c) => {
      const titleTerms = tokenize(`${c.pageTitle || ''} ${c.section || ''}`);
      const bodyTerms = tokenize(c.text || '');
      const tf = Object.create(null);
      for (const t of bodyTerms) tf[t] = (tf[t] || 0) + 1;
      for (const t of titleTerms) tf[t] = (tf[t] || 0) + 3; // heading boost
      return { tf, len: bodyTerms.length + titleTerms.length, titleSet: new Set(titleTerms) };
    });
    const avgdl = docs.reduce((s, d) => s + d.len, 0) / Math.max(1, N);
    const df = Object.create(null);
    for (const d of docs) for (const t in d.tf) df[t] = (df[t] || 0) + 1;
    const idf = Object.create(null);
    for (const t in df) idf[t] = Math.log(1 + (N - df[t] + 0.5) / (df[t] + 0.5));
    return { docs, avgdl, idf };
  }

  function score(query, model) {
    const q = tokenize(query);
    if (!q.length) return [];
    const k1 = 1.5, b = 0.75;
    const out = [];
    for (let i = 0; i < model.docs.length; i++) {
      const d = model.docs[i];
      let s = 0, hits = 0;
      for (const t of q) {
        const f = d.tf[t];
        if (!f) continue;
        hits++;
        const idf = model.idf[t] || 0;
        s += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + b * (d.len / model.avgdl))));
        if (d.titleSet.has(t)) s += 0.5; // small extra title boost
      }
      if (s > 0) out.push({ i, s, hits });
    }
    out.sort((a, b) => b.s - a.s || b.hits - a.hits);
    return out;
  }

  function snippet(text, queryTerms, max = 220) {
    const lower = text.toLowerCase();
    let best = -1;
    for (const t of queryTerms) {
      const idx = lower.indexOf(t);
      if (idx !== -1 && (best === -1 || idx < best)) best = idx;
    }
    if (best === -1) best = 0;
    const start = Math.max(0, best - 40);
    const end = Math.min(text.length, start + max);
    let out = text.slice(start, end);
    if (start > 0) out = '… ' + out;
    if (end < text.length) out = out + ' …';
    return out;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  function highlight(text, terms) {
    let out = escapeHtml(text);
    const seen = new Set();
    for (const t of terms) {
      if (seen.has(t) || t.length < 2) continue;
      seen.add(t);
      const re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      out = out.replace(re, '<mark>$1</mark>');
    }
    return out;
  }

  // ------- UI -------
  const STYLE = `
.cb-launcher{position:fixed;right:18px;bottom:18px;z-index:9000;
  background:linear-gradient(160deg,#1d4ed8,#3b82f6);color:#fff;border:none;
  border-radius:999px;padding:12px 18px;font:600 13px var(--sans,system-ui);
  box-shadow:0 6px 18px rgba(29,78,216,.45);cursor:pointer;display:flex;
  align-items:center;gap:8px;letter-spacing:.02em}
.cb-launcher:hover{filter:brightness(1.1)}
.cb-launcher .cb-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;
  box-shadow:0 0 0 2px rgba(34,197,94,.25)}
.cb-panel{position:fixed;right:18px;bottom:74px;z-index:9001;width:380px;
  max-width:calc(100vw - 24px);max-height:min(620px,calc(100vh - 110px));
  background:var(--surface,#0d1829);border:1px solid var(--border,#1a2d48);
  border-radius:14px;display:none;flex-direction:column;overflow:hidden;
  box-shadow:0 18px 50px rgba(0,0,0,.55);font-family:var(--sans,system-ui)}
.cb-panel.cb-open{display:flex;animation:cb-in .18s ease both}
@keyframes cb-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.cb-head{padding:12px 14px;border-bottom:1px solid var(--border,#1a2d48);
  display:flex;align-items:center;gap:10px;background:var(--surface2,#111f35)}
.cb-title{font-size:13px;font-weight:700;color:var(--text,#e8f0fc);flex:1}
.cb-sub{font-size:11px;color:var(--text3,#4a6280);font-weight:400}
.cb-close{background:none;border:none;color:var(--text2,#8fa8c8);cursor:pointer;
  font-size:18px;line-height:1;padding:2px 6px;border-radius:6px}
.cb-close:hover{background:var(--surface3,#162540);color:var(--text,#e8f0fc)}
.cb-log{flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:10px}
.cb-msg{font-size:13px;line-height:1.45;color:var(--text,#e8f0fc)}
.cb-msg.cb-user{align-self:flex-end;background:var(--blue3,#0d2038);
  border:1px solid var(--border2,#243d5c);padding:8px 12px;border-radius:12px 12px 2px 12px;
  max-width:85%;color:var(--text-blue-bright,#bfdbfe)}
.cb-msg.cb-bot{align-self:flex-start;max-width:100%}
.cb-hit{background:var(--surface2,#111f35);border:1px solid var(--border,#1a2d48);
  border-radius:10px;padding:9px 11px;margin-bottom:7px;cursor:pointer;
  transition:border-color .12s,background .12s;display:block;text-decoration:none;color:inherit}
.cb-hit:hover{border-color:var(--blue,#3b82f6);background:var(--surface3,#162540)}
.cb-hit-title{font-size:12px;font-weight:700;color:var(--text-blue-bright,#bfdbfe);
  margin-bottom:3px;display:flex;align-items:center;gap:6px}
.cb-hit-page{font-size:10px;color:var(--text3,#4a6280);font-weight:500;
  text-transform:uppercase;letter-spacing:.04em}
.cb-hit-snip{font-size:12px;color:var(--text2,#8fa8c8);line-height:1.4}
.cb-hit-snip mark{background:rgba(245,158,11,.22);color:var(--amber,#f59e0b);
  padding:0 2px;border-radius:2px}
.cb-empty{font-size:12px;color:var(--text2,#8fa8c8);padding:8px 10px;
  background:var(--surface2,#111f35);border:1px dashed var(--border,#1a2d48);
  border-radius:8px}
.cb-empty a{color:var(--text-blue,#93c5fd)}
.cb-form{border-top:1px solid var(--border,#1a2d48);padding:10px 12px;
  background:var(--surface2,#111f35);display:flex;gap:8px;align-items:flex-end}
.cb-input{flex:1;background:var(--surface,#0d1829);border:1px solid var(--border,#1a2d48);
  color:var(--text,#e8f0fc);border-radius:8px;padding:8px 10px;font:400 13px var(--sans,system-ui);
  resize:none;min-height:36px;max-height:96px;font-family:inherit}
.cb-input:focus{outline:none;border-color:var(--blue,#3b82f6)}
.cb-send{background:var(--blue,#3b82f6);color:#fff;border:none;border-radius:8px;
  padding:8px 14px;font:600 12px var(--sans,system-ui);cursor:pointer}
.cb-send:disabled{opacity:.5;cursor:not-allowed}
.cb-disclaim{font-size:10px;color:var(--text3,#4a6280);padding:0 14px 8px;
  background:var(--surface2,#111f35);text-align:center;line-height:1.4}
.cb-suggestions{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.cb-suggest{background:var(--surface3,#162540);border:1px solid var(--border,#1a2d48);
  color:var(--text2,#8fa8c8);padding:4px 9px;border-radius:999px;font-size:11px;cursor:pointer;
  font-family:inherit}
.cb-suggest:hover{border-color:var(--blue,#3b82f6);color:var(--text,#e8f0fc)}
@media(max-width:480px){
  .cb-panel{right:8px;left:8px;width:auto;bottom:64px}
  .cb-launcher{right:10px;bottom:10px;padding:10px 14px;font-size:12px}
}
`;

  const SUGGESTIONS = [
    'ketamine RSI dose',
    'stroke protocol',
    'peds fever workup',
    'norepinephrine',
    'request maintenance'
  ];

  const FLOATING_HTML = `
<button class="cb-launcher" id="cbLauncher" type="button" aria-label="Open assistant">
  <span class="cb-dot"></span> Ask
</button>`;

  const PANEL_HTML = `
<div class="cb-panel" id="cbPanel" role="dialog" aria-label="Site assistant">
  <div class="cb-head">
    <div class="cb-title">Site Assistant <div class="cb-sub">Searches every page on this toolkit</div></div>
    <button class="cb-close" id="cbClose" type="button" aria-label="Close">×</button>
  </div>
  <div class="cb-log" id="cbLog"></div>
  <form class="cb-form" id="cbForm">
    <textarea class="cb-input" id="cbInput" rows="1" placeholder="Ask about a drug, protocol, calc, or phone number…" aria-label="Ask the assistant"></textarea>
    <button class="cb-send" id="cbSend" type="submit">Ask</button>
  </form>
  <div class="cb-disclaim">Returns excerpts from this site. Not medical advice — verify against source.</div>
</div>`;

  let model = null;
  let chunks = [];
  let panel, log, input, sendBtn;

  function mount() {
    const style = document.createElement('style');
    style.textContent = STYLE;
    document.head.appendChild(style);

    const inlineLauncher = document.getElementById('cbInlineLauncher');
    const wrap = document.createElement('div');
    wrap.innerHTML = (inlineLauncher ? '' : FLOATING_HTML) + PANEL_HTML;
    document.body.appendChild(wrap);

    panel = document.getElementById('cbPanel');
    log = document.getElementById('cbLog');
    input = document.getElementById('cbInput');
    sendBtn = document.getElementById('cbSend');

    const trigger = inlineLauncher || document.getElementById('cbLauncher');
    if (trigger) trigger.addEventListener('click', open);
    document.getElementById('cbClose').addEventListener('click', close);
    document.getElementById('cbForm').addEventListener('submit', onSubmit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSubmit(e);
      }
    });
    document.addEventListener('keydown', (e) => {
      const isCmd = e.metaKey || e.ctrlKey;
      if (isCmd && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'Escape' && panel.classList.contains('cb-open')) {
        close();
      }
    });
    renderWelcome();
  }

  function open() {
    panel.classList.add('cb-open');
    setTimeout(() => input.focus(), 50);
    if (!model) loadIndex();
  }
  function close() { panel.classList.remove('cb-open'); }
  function toggle() { panel.classList.contains('cb-open') ? close() : open(); }

  function renderWelcome() {
    const sugg = SUGGESTIONS.map((s) => `<button class="cb-suggest" data-q="${escapeHtml(s)}" type="button">${escapeHtml(s)}</button>`).join('');
    log.innerHTML = `
      <div class="cb-msg cb-bot">
        Ask a question and I'll find the most relevant pages.
        <div class="cb-suggestions">${sugg}</div>
      </div>`;
    log.querySelectorAll('.cb-suggest').forEach((b) => {
      b.addEventListener('click', () => {
        input.value = b.getAttribute('data-q');
        onSubmit(new Event('submit'));
      });
    });
  }

  async function loadIndex() {
    try {
      const r = await fetch(INDEX_URL, { cache: 'force-cache' });
      const data = await r.json();
      chunks = data.chunks || [];
      model = buildBM25(chunks);
    } catch (err) {
      addBotMessage(`<div class="cb-empty">Couldn't load the search index. Try the <a href="javascript:document.getElementById('si')&&document.getElementById('si').focus()">Cmd+K search</a> or <a href="sitemap.html">sitemap</a>.</div>`);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    const q = (input.value || '').trim();
    if (!q) return;
    addUserMessage(q);
    input.value = '';
    answer(q);
  }

  function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'cb-msg cb-user';
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function addBotMessage(html) {
    const div = document.createElement('div');
    div.className = 'cb-msg cb-bot';
    div.innerHTML = html;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  async function answer(q) {
    if (!model) await loadIndex();
    if (!model) return;
    const ranked = score(q, model).slice(0, 5);
    const queryTerms = tokenize(q);
    if (!ranked.length) {
      addBotMessage(`<div class="cb-empty">No matches on this site. Try the <a href="javascript:void(0)" onclick="document.getElementById('si')&&document.getElementById('si').focus()">⌘K search</a> for curated tags, or browse the <a href="sitemap.html">sitemap</a>.</div>`);
      return;
    }
    // Dedupe by (page, section). Within a group, prefer anchored chunks so
    // results deep-link to the specific card; otherwise keep the higher score.
    const groups = new Map();
    for (const r of ranked) {
      const c = chunks[r.i];
      const key = `${c.page}::${(c.section || '').toLowerCase()}`;
      const existing = groups.get(key);
      if (!existing) { groups.set(key, { c, s: r.s }); continue; }
      const curHasAnchor = !!existing.c.anchor;
      const newHasAnchor = !!c.anchor;
      if (newHasAnchor && !curHasAnchor) groups.set(key, { c, s: r.s });
    }
    const top = [...groups.values()]
      .sort((a, b) => b.s - a.s)
      .slice(0, 4)
      .map((g) => ({ ...g.c, _score: g.s }));
    const html = top.map((c) => {
      const sec = c.section && c.section !== c.pageTitle ? c.section : c.pageTitle;
      const snip = highlight(snippet(c.text, queryTerms), queryTerms);
      const page = escapeHtml(c.pageTitle || c.page);
      return `<a class="cb-hit" href="${escapeHtml(c.url)}">
        <div class="cb-hit-title">${escapeHtml(sec)}</div>
        <div class="cb-hit-page">${page}</div>
        <div class="cb-hit-snip">${snip}</div>
      </a>`;
    }).join('');
    addBotMessage(html);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
