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
