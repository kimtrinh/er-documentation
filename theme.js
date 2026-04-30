function getTheme() {
  return localStorage.getItem('theme') || 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  var btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '\ud83c\udf19' : '\u2600\ufe0f';
}

function toggleTheme() {
  var next = getTheme() === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
}

applyTheme(getTheme());

/* ── Omnisearch modal injection ────────────────────────────────────── */
(function () {

  // ── Helpers ──────────────────────────────────────────────────────────
  function omEsc(v) {
    return String(v ?? '').replace(/[&<>"']/g, function (c) {
      return c==='&'?'&amp;':c==='<'?'&lt;':c==='>'?'&gt;':c==='"'?'&quot;':'&#39;';
    });
  }
  function omHref(href) {
    var t = String(href || '').trim();
    return /^[A-Za-z0-9._\/-]+\.html(?:\?[A-Za-z0-9._%=&:+\-]+)?(?:#[A-Za-z0-9._:\-]+)?$/.test(t) ? t : 'index.html';
  }

  // ── Group ordering (mirrors home page) ───────────────────────────────
  var OM_PRI = [
    'Dotphrases','Calculators','Algorithms','Neuro Hub','Peds Fever','Drugs',
    'OMC','FMC','External',
    'OMC Imaging Orders','FMC Imaging Orders',
    'OMC Key Staff','FMC Key Staff','Service Agreements','Reference'
  ];
  function omGroup(item) {
    var t = item.type;
    if (t==='phrase') return 'Dotphrases';
    if (t==='calc')   return 'Calculators';
    if (t==='drug')   return 'Drugs';
    if (t==='algo')   return 'Algorithms';
    if (t==='neuro')  return 'Neuro Hub';
    if (t==='page')   return item.g || 'Reference';
    return item.g || 'Other';
  }
  function omOrderGroups(groups) {
    var names = Object.keys(groups);
    var rest  = names.filter(function(n){return OM_PRI.indexOf(n)<0;}).sort();
    return OM_PRI.filter(function(n){return groups[n];}).concat(rest);
  }

  // ── Per-modal state ───────────────────────────────────────────────────
  var omFilter = 'all';
  var omHiIdx  = -1;
  function omMatches(item) {
    if (omFilter==='all') return true;
    if (omFilter==='phone') return ['phone','imaging','staff'].indexOf(item.type)>=0;
    return item.type===omFilter;
  }

  // ── Main injection ────────────────────────────────────────────────────
  function injectOmnisearch() {
    // Skip pages that already have the full home hero search bar
    if (document.getElementById('si') || document.getElementById('omnisearch-overlay')) return;

    var overlay = document.createElement('div');
    overlay.id = 'omnisearch-overlay';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-label','Search toolkit');
    overlay.innerHTML =
      '<div id="omnisearch-modal">'+
        '<div id="omnisearch-head">'+
          '<span id="om-icon">🔍</span>'+
          '<input id="om-input" type="text"'+
            ' placeholder="Search drugs, calcs, algorithms, phones…"'+
            ' autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"'+
            ' role="combobox" aria-autocomplete="list" aria-haspopup="listbox"'+
            ' aria-expanded="false" aria-controls="om-results" aria-label="Search toolkit"/>'+
          '<span id="om-esc-hint">esc</span>'+
        '</div>'+
        '<div id="om-chips">'+
          '<button class="om-chip on" data-filter="all">All</button>'+
          '<button class="om-chip" data-filter="phrase">📋 Dotphrases</button>'+
          '<button class="om-chip" data-filter="calc">🧮 Calcs</button>'+
          '<button class="om-chip" data-filter="drug">💊 Drugs</button>'+
          '<button class="om-chip" data-filter="algo">🔀 Algorithms</button>'+
          '<button class="om-chip" data-filter="phone">📞 Phones</button>'+
        '</div>'+
        '<div id="om-results" role="listbox" aria-label="Search results">'+
          '<div class="sdrop-empty">Type to search — drugs, calculators, algorithms, phones…</div>'+
        '</div>'+
      '</div>';
    document.body.appendChild(overlay);

    // ── Visible trigger pill ──────────────────────────────────────────────
    // When the page has a .sitenav-inner, we embed the trigger INSIDE the nav
    // so it doesn't float over and clip nav items. Otherwise, fall back to a
    // fixed top-right FAB so every page still gets a visible search affordance.
    if (!document.getElementById('om-trigger')) {
      var trigger = document.createElement('button');
      trigger.id = 'om-trigger';
      trigger.type = 'button';
      trigger.setAttribute('aria-label', 'Search toolkit');
      trigger.setAttribute('title', 'Search toolkit (\u2318K / Ctrl+K)');
      var isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
      trigger.innerHTML =
        '<span class="om-trigger-icon">\ud83d\udd0d</span>' +
        '<span class="om-trigger-label">Search</span>' +
        '<span class="om-trigger-kbd">' + (isMac ? '\u2318K' : 'Ctrl K') + '</span>';
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        omOpen();
      });
      var navInner = document.querySelector('.sitenav-inner');
      if (navInner) {
        trigger.classList.add('in-nav');
        navInner.appendChild(trigger);
      } else {
        trigger.classList.add('fab');
        document.body.appendChild(trigger);
      }
    }

    var inp     = overlay.querySelector('#om-input');
    var results = overlay.querySelector('#om-results');

    // ── Filter chips ─────────────────────────────────────────────────
    overlay.querySelectorAll('.om-chip').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        var filter = btn.getAttribute('data-filter');
        if (filter === 'phrase') { window.location.assign('dotphrase.html'); return; }
        omFilter = filter;
        overlay.querySelectorAll('.om-chip').forEach(function(b){b.classList.remove('on');});
        btn.classList.add('on');
        omRun(inp.value);
      });
    });

    // ── Open / Close ─────────────────────────────────────────────────
    function omOpen() {
      overlay.classList.add('open');
      omHiIdx = -1;
      // If the input was pre-populated (e.g. mirrored from a page-local
      // search input), render results immediately rather than waiting
      // for the next keystroke.
      if (inp.value && inp.value.trim()) omRun(inp.value);
      setTimeout(function(){inp.focus();inp.select();}, 30);
    }
    function omClose() {
      overlay.classList.remove('open');
      inp.blur();
    }

    // Backdrop click
    overlay.addEventListener('click', function(e){ if (e.target===overlay) omClose(); });

    // ⌘K / Ctrl+K — global shortcut
    document.addEventListener('keydown', function(e){
      if ((e.metaKey||e.ctrlKey) && e.key==='k') {
        e.preventDefault();
        overlay.classList.contains('open') ? omClose() : omOpen();
      } else if (e.key==='Escape' && overlay.classList.contains('open')) {
        omClose();
      }
    });

    // ── Input events ─────────────────────────────────────────────────
    inp.addEventListener('input', function(){ omRun(inp.value); });

    inp.addEventListener('keydown', function(e){
      var rows = Array.from(results.querySelectorAll('.sdrop-row'));
      if (e.key==='ArrowDown') {
        e.preventDefault();
        omHiIdx = Math.min(omHiIdx+1, rows.length-1);
        rows.forEach(function(r,i){
          var on=i===omHiIdx; r.classList.toggle('hi',on);
          r.setAttribute('aria-selected', on?'true':'false');
        });
        if (rows[omHiIdx]) rows[omHiIdx].scrollIntoView({block:'nearest'});
      } else if (e.key==='ArrowUp') {
        e.preventDefault();
        omHiIdx = Math.max(omHiIdx-1, 0);
        rows.forEach(function(r,i){
          var on=i===omHiIdx; r.classList.toggle('hi',on);
          r.setAttribute('aria-selected', on?'true':'false');
        });
        if (rows[omHiIdx]) rows[omHiIdx].scrollIntoView({block:'nearest'});
      } else if (e.key==='Enter') {
        if (omHiIdx>=0 && rows[omHiIdx]) rows[omHiIdx].click();
      } else if (e.key==='Escape') {
        omClose();
      }
    });

    // ── Render results ────────────────────────────────────────────────
    function omRun(q) {
      q = (q||'').trim();
      omHiIdx = -1;
      inp.setAttribute('aria-expanded', q ? 'true' : 'false');

      if (!q) {
        results.innerHTML = '<div class="sdrop-empty">Type to search — drugs, calculators, algorithms, phones…</div>';
        return;
      }

      /* SEARCH_INDEX is a top-level const from search-index.js.
         It's accessible here because both scripts share the same document scope.
         On pages without search-index.js, typeof guard prevents ReferenceError. */
      var idx = (typeof window !== 'undefined' && typeof window.getSearchIndex === 'function') ? window.getSearchIndex() : (typeof SEARCH_INDEX !== 'undefined' ? SEARCH_INDEX : []);
      if (!idx.length) {
        results.innerHTML = '<div class="sdrop-empty">Search index not available on this page. <a href="index.html" style="color:var(--blue)">Go to home →</a></div>';
        return;
      }

      var lo = q.toLowerCase();
      var tokens = lo.split(/\s+/).filter(Boolean);
      var found = idx.filter(function(item){
        if (!omMatches(item)) return false;
        if (item.type === 'phrase') return false;
        var searchable = [item.t, item.s, item.g].join(' ').toLowerCase();
        var words = searchable.split(/[\s\-\/(),.:;]+/).filter(Boolean);
        return tokens.every(function(tok){ return words.some(function(w){ return w.startsWith(tok); }); });
      });

      // Boost title-starts-with (on first token)
      var firstToken = tokens[0] || lo;
      found.sort(function(a,b){
        return (a.t.toLowerCase().indexOf(firstToken)===0?0:1) - (b.t.toLowerCase().indexOf(firstToken)===0?0:1);
      });

      var total = found.length;
      found = found.slice(0, 40);

      if (!found.length) {
        results.innerHTML = '<div class="sdrop-empty">No results — try different keywords or clear the filter</div>';
        return;
      }

      // Group + render
      var groups = {};
      found.forEach(function(item){ var g=omGroup(item); if(!groups[g])groups[g]=[]; groups[g].push(item); });

      var html = '';
      var ri   = 0;
      omOrderGroups(groups).forEach(function(grp){
        if (!groups[grp]) return;
        html += '<div class="sdrop-group">'+omEsc(grp)+'</div>';
        groups[grp].forEach(function(item){
          var id = 'omrow-'+(ri++);
          html +=
            '<a class="sdrop-row" id="'+id+'" role="option" aria-selected="false" href="'+omHref(item.u)+'">'+
              '<span class="sdrop-ico">'+omEsc(item.i)+'</span>'+
              '<div class="sdrop-body">'+
                '<div class="sdrop-title">'+omEsc(item.t)+'</div>'+
                '<div class="sdrop-sub">'+omEsc(item.s)+'</div>'+
              '</div>'+
              '<span class="sdrop-tag '+omEsc(item.gc)+'">'+omEsc(item.g)+'</span>'+
            '</a>';
        });
      });
      if (total>40) html += '<div class="sdrop-footer">Showing 40 of '+total+' — refine your search</div>';

      results.innerHTML = html;
    }

    // Expose hooks so other scripts (page-local search inputs) can populate
    // and open the global overlay. Both home/index and the page-local
    // sidebars route through this so every search bar shows the same
    // SEARCH_INDEX results.
    window.openOmnisearch = function (query) {
      omOpen();
      if (typeof query === 'string') {
        inp.value = query;
        omRun(query);
      }
    };
    window.setOmnisearchQuery = function (query) {
      if (typeof query !== 'string') return;
      inp.value = query;
      if (overlay.classList.contains('open')) omRun(query);
    };

    // ── Bridge page-local search inputs to the global overlay ──────────
    // Known page-local search inputs across the site. When the user types
    // in any of them, the global omnisearch is updated so pressing ⌘K /
    // clicking the trigger / pressing Enter shows the same comprehensive
    // results. Existing in-page filtering on these inputs is preserved.
    var LOCAL_SEARCH_IDS = [
      'searchInput',           // hospital-protocols, service-agreements
      'algoSearchInput',       // algorithms
      'dotphraseSearchInput',  // mdm
      'globalSearch',          // ed-phone-directory
      'search'                 // dotphrase
    ];
    LOCAL_SEARCH_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      // Mirror typing into the global overlay's input so opening it via
      // ⌘K / the trigger pill picks up the current query and shows the
      // same SEARCH_INDEX results as every other search bar on the site.
      el.addEventListener('input', function () {
        window.setOmnisearchQuery(el.value);
      });
      // Enter escalates to the global overlay with the current query so
      // any search bar on any page can land the user in the unified
      // result set.
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && el.value.trim()) {
          e.preventDefault();
          window.openOmnisearch(el.value);
        }
      });
    });
  }

  if (document.readyState==='loading') {
    document.addEventListener('DOMContentLoaded', injectOmnisearch);
  } else {
    injectOmnisearch();
  }
})();

/* ── Feedback bubble injection ─────────────────────────────────────── */
(function () {
  function injectFeedback() {
    if (document.getElementById('feedback-bubble')) return;

    // Popup card
    var popup = document.createElement('div');
    popup.id = 'feedback-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', 'Feedback');
    popup.innerHTML =
      '<p class="fb-popup-title">💡 Help us improve</p>' +
      '<p class="fb-popup-body">Have a suggestion or found an issue? We\'d love to hear from you.</p>' +
      '<a class="fb-popup-btn" href="feedback.html">Give Feedback \u2192</a>';

    // Bubble button
    var bubble = document.createElement('button');
    bubble.id = 'feedback-bubble';
    bubble.setAttribute('aria-label', 'Open feedback form');
    bubble.setAttribute('title', 'Give feedback');
    bubble.textContent = '\ud83d\udcac'; // 💬

    document.body.appendChild(popup);
    document.body.appendChild(bubble);

    // Toggle popup on bubble click
    bubble.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = popup.classList.toggle('open');
      bubble.classList.toggle('active', isOpen);
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!popup.contains(e.target) && e.target !== bubble) {
        popup.classList.remove('open');
        bubble.classList.remove('active');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        popup.classList.remove('open');
        bubble.classList.remove('active');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFeedback);
  } else {
    injectFeedback();
  }
})();
