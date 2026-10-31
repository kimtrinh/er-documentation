/* ──────────────────────────────────────────────────────────────
   SharePoint embed sign-in gate
   ──────────────────────────────────────────────────────────────
   Microsoft sends anti-framing headers on their SSO pages, so when a
   signed-out user hits a SharePoint embed the login redirect cannot render
   inside the iframe — they just get "can't open this page". The page cannot
   trigger the sign-in either: a cross-origin frame is opaque, onload fires
   for the error page too, and reading its contents throws. So there is no
   way to detect the failure or recover from it in place.

   What works is not loading the frame until the user has had the chance to
   sign in: show a placeholder, offer a new tab (where sign-in works fine),
   then load. One click per browser session, remembered in sessionStorage.

   This runs as a runtime interceptor rather than an edit to each embed,
   because the embeds are not uniform — 121 of them on algorithms.html are
   hand-written HTML strings inside script blocks, in several shapes, and are
   injected on demand. A MutationObserver catches those.

   Limitation: an iframe inserted with src already set begins loading before
   this can intervene, so the request may still be issued. The element is
   replaced before paint, so nothing broken is displayed — the error is
   suppressed, the request is not.
   ────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var SP_HOST = 'sp-cloud.kp.org';
  var KEY = 'kp-sp-preview-ok';

  function consented() {
    try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  function remember() {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* private mode */ }
  }

  // Sign-in target is derived from the frame's own URL, so a NEDOCS embed
  // sends you to /sites/FONTANANEDOCS and a toolkit PDF to /sites/ERtoolkit.
  function siteRootOf(url) {
    try {
      var u = new URL(url, window.location.href);
      var parts = u.pathname.split('/').filter(Boolean);
      if (parts[0] === 'sites' && parts[1]) return u.origin + '/sites/' + parts[1];
      return u.origin;
    } catch (e) {
      return 'https://' + SP_HOST;
    }
  }

  function isSpFrame(el) {
    if (!el || el.tagName !== 'IFRAME') return false;
    var src = el.getAttribute('src') || el.getAttribute('data-sp-src') || '';
    return src.indexOf(SP_HOST) !== -1;
  }

  var STYLE_ID = 'sp-gate-style';
  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = [
      '.sp-gate{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;',
      'min-height:220px;padding:28px 20px;text-align:center;background:var(--surface2,#111f35);',
      'border:1px dashed var(--border2,#243d5c);border-radius:10px;color:var(--text2,#8fa8c8)}',
      '.sp-gate-ico{font-size:26px;line-height:1}',
      '.sp-gate-msg{font-size:13px;line-height:1.6;max-width:46ch}',
      '.sp-gate-msg b{color:var(--text,#e8f0fc)}',
      '.sp-gate-actions{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}',
      '.sp-gate-btn{font-size:12px;font-weight:700;padding:8px 14px;border-radius:8px;cursor:pointer;',
      'text-decoration:none;border:1px solid var(--blue2,#1d4ed8);background:var(--blue3,#0d2038);',
      'color:var(--text-blue,#93c5fd);font-family:inherit;transition:.15s}',
      '.sp-gate-btn:hover{background:#162a5a;border-color:var(--blue,#3b82f6)}',
      '.sp-gate-btn.primary{background:#0a2a0a;border-color:#15803d;color:#86efac}',
      '.sp-gate-btn.primary:hover{background:#0d3b0d;border-color:#22c55e}',
      '.sp-gate-note{font-size:11px;color:var(--text3,#4a6280);max-width:46ch;line-height:1.6}'
    ].join('');
    document.head.appendChild(st);
  }

  function reveal(frame, gateEl) {
    var url = frame.getAttribute('data-sp-src');
    if (url) frame.setAttribute('src', url);
    frame.style.display = '';
    if (gateEl && gateEl.parentNode) gateEl.parentNode.removeChild(gateEl);
  }

  function gate(frame) {
    if (frame.getAttribute('data-sp-gated') === '1') return;
    frame.setAttribute('data-sp-gated', '1');

    var url = frame.getAttribute('src');
    if (url) {
      frame.setAttribute('data-sp-src', url);
      frame.removeAttribute('src');          // stop it going any further
    }

    // Already consented in this session: load it straight away, no interruption.
    if (consented()) { reveal(frame, null); return; }

    injectStyle();
    var g = document.createElement('div');
    g.className = 'sp-gate';
    var signIn = siteRootOf(frame.getAttribute('data-sp-src') || '');

    var ico = document.createElement('div');
    ico.className = 'sp-gate-ico';
    ico.textContent = '🔒';

    var msg = document.createElement('div');
    msg.className = 'sp-gate-msg';
    msg.innerHTML = 'This preview comes from <b>KP SharePoint</b> and only loads once you are signed in.';

    var actions = document.createElement('div');
    actions.className = 'sp-gate-actions';

    var a = document.createElement('a');
    a.className = 'sp-gate-btn';
    a.href = signIn;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'Sign in to SharePoint ↗';
    a.addEventListener('click', function () { remember(); });

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sp-gate-btn primary';
    btn.textContent = 'Load preview';
    btn.addEventListener('click', function () {
      remember();
      reveal(frame, g);
    });

    var note = document.createElement('div');
    note.className = 'sp-gate-note';
    note.textContent = 'Sign in opens in a new tab, then come back and load the preview. '
      + 'Asked once per browser session. The Open / Download link beside this works either way.';

    actions.appendChild(a);
    actions.appendChild(btn);
    g.appendChild(ico);
    g.appendChild(msg);
    g.appendChild(actions);
    g.appendChild(note);

    frame.style.display = 'none';
    if (frame.parentNode) frame.parentNode.insertBefore(g, frame);
  }

  function scan(root) {
    if (!root || !root.querySelectorAll) return;
    if (isSpFrame(root)) gate(root);
    var frames = root.querySelectorAll('iframe');
    for (var i = 0; i < frames.length; i++) {
      if (isSpFrame(frames[i])) gate(frames[i]);
    }
  }

  function start() {
    scan(document.body);
    // Panels on algorithms / protocols / agreements are injected on click,
    // so their embeds do not exist at load time.
    if (window.MutationObserver && document.body) {
      new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          var added = muts[i].addedNodes;
          for (var j = 0; j < added.length; j++) {
            if (added[j].nodeType === 1) scan(added[j]);
          }
        }
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.KP_SP_EMBED = { scan: scan, consented: consented };
})();
