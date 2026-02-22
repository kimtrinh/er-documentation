(function () {
  'use strict';

  const GROUP_ORDER = ['Life-threatening', 'Common', 'Other'];
  const OUTPUT_DOTPHRASE = 'dotphrase';
  const OUTPUT_EXPANDED = 'expanded';

  const state = {
    packs: [],
    packById: new Map(),
    commandMap: new Map(),
    activePack: null,
    outputMode: OUTPUT_DOTPHRASE,
    selectedDdx: new Set(),
    selectedRuleouts: new Set(),
    availableRuleoutIds: [],
    selectedRisks: new Set(),
    riskInputs: Object.create(null)
  };

  const els = {
    packSelect: document.getElementById('packSelect'),
    commandInput: document.getElementById('commandInput'),
    modeDot: document.getElementById('modeDotphrase'),
    modeExpanded: document.getElementById('modeExpanded'),
    aliasHint: document.getElementById('aliasHint'),
    ddxContainer: document.getElementById('ddxContainer'),
    ruleoutContainer: document.getElementById('ruleoutContainer'),
    riskContainer: document.getElementById('riskContainer'),
    preview: document.getElementById('mdmPreview'),
    copyFullBtn: document.getElementById('copyFullBtn'),
    copyDdxBtn: document.getElementById('copyDdxBtn'),
    copyRuleoutsBtn: document.getElementById('copyRuleoutsBtn')
  };

  function normalizeId(id) {
    if (typeof window.KP_normalizeDotphraseId === 'function') {
      return window.KP_normalizeDotphraseId(id);
    }
    return String(id || '').trim().replace(/^\./, '').toLowerCase();
  }

  function formatDotphrase(id) {
    if (typeof window.KP_formatDotphrase === 'function') {
      return window.KP_formatDotphrase(id);
    }
    const clean = normalizeId(id);
    return clean ? `.${clean}` : '';
  }

  function phraseLookup(id) {
    if (typeof window.KP_phraseLookup === 'function') {
      return window.KP_phraseLookup(id);
    }
    const clean = normalizeId(id);
    const map = window.KP_DOTPHRASE_MAP || {};
    const phrase = map[clean] || null;
    return {
      id: clean,
      exists: Boolean(phrase),
      text: phrase ? String(phrase.text || '') : '',
      phrase
    };
  }

  function normalizeCommand(cmd) {
    return String(cmd || '')
      .trim()
      .toLowerCase()
      .replace(/^[.#]/, '')
      .replace(/\s+/g, '');
  }

  function buildCommandMap() {
    state.commandMap.clear();
    state.packs.forEach((pack) => {
      const id = normalizeCommand(pack.id);
      if (id) state.commandMap.set(id, pack.id);
      (Array.isArray(pack.aliases) ? pack.aliases : []).forEach((alias) => {
        const clean = normalizeCommand(alias);
        if (clean) state.commandMap.set(clean, pack.id);
      });
    });
  }

  function populatePackSelect() {
    els.packSelect.innerHTML = state.packs.map((pack) => (
      `<option value="${escapeHtml(pack.id)}">${escapeHtml(pack.title)} (${escapeHtml(pack.id)})</option>`
    )).join('');
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => (
      ch === '&' ? '&amp;' :
      ch === '<' ? '&lt;' :
      ch === '>' ? '&gt;' :
      ch === '"' ? '&quot;' : '&#39;'
    ));
  }

  function applyTemplate(toggle, value) {
    const template = String(toggle.sentence_template || '').trim();
    if (!template) return '';
    if (template.includes('{value}')) {
      const replacement = String(value || '').trim() || '[enter value]';
      return template.replaceAll('{value}', replacement);
    }
    return template;
  }

  function getSelectedDdxItems(pack) {
    return (pack.ddx || []).filter((item) => state.selectedDdx.has(item.label));
  }

  function getActiveTags(pack) {
    const tags = new Set();
    getSelectedDdxItems(pack).forEach((item) => {
      (item.tags || []).forEach((tag) => tags.add(String(tag)));
    });
    return tags;
  }

  function computeAvailableRuleoutIds(pack) {
    const out = [];
    const seen = new Set();
    getSelectedDdxItems(pack).forEach((item) => {
      (item.ruleouts || []).forEach((ruleoutId) => {
        const clean = normalizeId(ruleoutId);
        if (!clean || seen.has(clean)) return;
        seen.add(clean);
        out.push(clean);
      });
    });
    return out;
  }

  function syncRuleouts(pack) {
    const nextIds = computeAvailableRuleoutIds(pack);
    const nextSet = new Set(nextIds);
    const prevSet = new Set(state.availableRuleoutIds);

    nextIds.forEach((id) => {
      if (!prevSet.has(id)) {
        state.selectedRuleouts.add(id);
      }
    });

    Array.from(state.selectedRuleouts).forEach((id) => {
      if (!nextSet.has(id)) state.selectedRuleouts.delete(id);
    });

    state.availableRuleoutIds = nextIds;
  }

  function getVisibleRiskToggles(pack) {
    const activeTags = getActiveTags(pack);
    return (pack.risk_toggles || []).filter((toggle) => {
      const required = Array.isArray(toggle.tags_required) ? toggle.tags_required : [];
      if (!required.length) return true;
      return required.some((tag) => activeTags.has(tag));
    });
  }

  function syncRiskToggles(pack) {
    const visible = getVisibleRiskToggles(pack);
    const visibleIds = new Set(visible.map((toggle) => toggle.id));

    Array.from(state.selectedRisks).forEach((id) => {
      if (!visibleIds.has(id)) state.selectedRisks.delete(id);
    });

    visible.forEach((toggle) => {
      if (!toggle.input) return;
      if (typeof state.riskInputs[toggle.id] !== 'undefined') return;
      if (typeof toggle.input.default !== 'undefined') {
        state.riskInputs[toggle.id] = String(toggle.input.default);
      } else {
        state.riskInputs[toggle.id] = '';
      }
    });
  }

  function buildRiskSentence(toggle) {
    if (!state.selectedRisks.has(toggle.id)) return '';
    const value = state.riskInputs[toggle.id];
    return applyTemplate(toggle, value);
  }

  function buildDdxText(pack) {
    const labels = getSelectedDdxItems(pack).map((item) => item.label);
    if (!labels.length) return 'DDx considered: none selected.';
    return `DDx considered: ${labels.join('; ')}.`;
  }

  function buildRiskText(pack) {
    const visible = getVisibleRiskToggles(pack);
    const lines = visible
      .map((toggle) => buildRiskSentence(toggle))
      .filter(Boolean);

    if (!lines.length) {
      return 'Risk stratification:\n- No additional risk modifiers documented.';
    }

    return ['Risk stratification:', ...lines.map((line) => `- ${line}`)].join('\n');
  }

  function getSelectedRuleoutIds() {
    return state.availableRuleoutIds.filter((id) => state.selectedRuleouts.has(id));
  }

  function buildRuleoutsText() {
    const ids = getSelectedRuleoutIds();
    if (!ids.length) return 'Rule-outs:\n- none selected';

    const lines = ids.map((id) => {
      if (state.outputMode === OUTPUT_DOTPHRASE) {
        return `- ${formatDotphrase(id)}`;
      }

      const lookup = phraseLookup(id);
      if (lookup.exists && lookup.text) {
        return `- ${lookup.text}`;
      }

      return `- ${formatDotphrase(id)}`;
    });

    return ['Rule-outs:', ...lines].join('\n');
  }

  function buildMdmText(pack) {
    const lead = String(pack.base_mdm_template || 'Focused emergency evaluation performed with consideration of life-threatening and common etiologies, risk stratification, and disposition planning.').trim();
    return [
      `MDM – ${pack.title}: ${lead}`,
      '',
      buildDdxText(pack),
      '',
      buildRiskText(pack),
      '',
      buildRuleoutsText()
    ].join('\n');
  }

  function setPreview() {
    if (!state.activePack) {
      els.preview.value = '';
      return;
    }
    els.preview.value = buildMdmText(state.activePack);
  }

  function renderDdx() {
    const pack = state.activePack;
    if (!pack) {
      els.ddxContainer.innerHTML = '<p class="empty-block">No pack selected.</p>';
      return;
    }

    const groups = Object.create(null);
    (pack.ddx || []).forEach((item) => {
      const group = item.group || 'Other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });

    const orderedGroups = [
      ...GROUP_ORDER.filter((group) => groups[group]),
      ...Object.keys(groups).filter((group) => !GROUP_ORDER.includes(group))
    ];

    els.ddxContainer.innerHTML = orderedGroups.map((group) => {
      const entries = groups[group] || [];
      const rows = entries.map((item) => {
        const checked = state.selectedDdx.has(item.label) ? 'checked' : '';
        return `
          <label class="check-row">
            <input type="checkbox" data-role="ddx" data-label="${escapeHtml(item.label)}" ${checked}>
            <span>${escapeHtml(item.label)}</span>
          </label>
        `;
      }).join('');

      return `
        <div class="section-subgroup">
          <h4>${escapeHtml(group)}</h4>
          <div class="check-grid">${rows}</div>
        </div>
      `;
    }).join('');
  }

  function renderRuleouts() {
    const ids = state.availableRuleoutIds;
    if (!ids.length) {
      els.ruleoutContainer.innerHTML = '<p class="empty-block">Select DDx items to populate linked rule-outs.</p>';
      return;
    }

    els.ruleoutContainer.innerHTML = ids.map((id) => {
      const checked = state.selectedRuleouts.has(id) ? 'checked' : '';
      const lookup = phraseLookup(id);
      const tag = formatDotphrase(id);
      const missing = lookup.exists ? '' : '<span class="missing-tag">(missing)</span>';
      return `
        <label class="check-row">
          <input type="checkbox" data-role="ruleout" data-id="${escapeHtml(id)}" ${checked}>
          <span class="ruleout-label">${escapeHtml(tag)} ${missing}</span>
        </label>
      `;
    }).join('');
  }

  function renderRiskToggles() {
    const pack = state.activePack;
    if (!pack) {
      els.riskContainer.innerHTML = '<p class="empty-block">No pack selected.</p>';
      return;
    }

    const visible = getVisibleRiskToggles(pack);
    if (!visible.length) {
      els.riskContainer.innerHTML = '<p class="empty-block">No risk tools for current DDx selection.</p>';
      return;
    }

    els.riskContainer.innerHTML = visible.map((toggle) => {
      const checked = state.selectedRisks.has(toggle.id) ? 'checked' : '';
      let inputHtml = '';

      if (toggle.input) {
        const input = toggle.input;
        const inputId = `risk-input-${escapeHtml(toggle.id)}`;
        const currentValue = typeof state.riskInputs[toggle.id] === 'undefined' ? '' : String(state.riskInputs[toggle.id]);

        if (input.type === 'select') {
          const options = (input.options || []).map((opt) => {
            const selected = String(opt.value) === currentValue ? 'selected' : '';
            return `<option value="${escapeHtml(opt.value)}" ${selected}>${escapeHtml(opt.label)}</option>`;
          }).join('');
          inputHtml = `
            <label class="risk-input-wrap" for="${inputId}">
              <span>${escapeHtml(input.label || 'Value')}</span>
              <select id="${inputId}" data-role="risk-input" data-risk-id="${escapeHtml(toggle.id)}" ${checked ? '' : 'disabled'}>${options}</select>
            </label>
          `;
        } else {
          const min = typeof input.min === 'number' ? `min="${input.min}"` : '';
          const max = typeof input.max === 'number' ? `max="${input.max}"` : '';
          const placeholder = input.placeholder ? `placeholder="${escapeHtml(input.placeholder)}"` : '';
          const type = input.type === 'number' ? 'number' : 'text';
          inputHtml = `
            <label class="risk-input-wrap" for="${inputId}">
              <span>${escapeHtml(input.label || 'Value')}</span>
              <input id="${inputId}" type="${type}" value="${escapeHtml(currentValue)}" ${placeholder} ${min} ${max} data-role="risk-input" data-risk-id="${escapeHtml(toggle.id)}" ${checked ? '' : 'disabled'}>
            </label>
          `;
        }
      }

      return `
        <div class="risk-row">
          <label class="check-row">
            <input type="checkbox" data-role="risk" data-risk-id="${escapeHtml(toggle.id)}" ${checked}>
            <span>${escapeHtml(toggle.label)}</span>
          </label>
          ${inputHtml}
        </div>
      `;
    }).join('');
  }

  function renderAliasHint() {
    if (!state.activePack) {
      els.aliasHint.textContent = '';
      return;
    }
    const aliases = [state.activePack.id].concat(Array.isArray(state.activePack.aliases) ? state.activePack.aliases : []);
    els.aliasHint.textContent = `Commands: ${aliases.join(', ')}`;
  }

  function renderAll() {
    renderAliasHint();
    renderDdx();
    renderRuleouts();
    renderRiskToggles();
    setPreview();
  }

  function selectPack(packId) {
    const pack = state.packById.get(packId);
    if (!pack) return;

    state.activePack = pack;
    els.packSelect.value = pack.id;
    els.commandInput.value = pack.id;

    state.selectedDdx = new Set(
      (pack.ddx || [])
        .filter((item) => Boolean(item.default_checked))
        .map((item) => item.label)
    );

    state.selectedRuleouts.clear();
    state.availableRuleoutIds = [];
    syncRuleouts(pack);

    state.selectedRisks.clear();
    state.riskInputs = Object.create(null);
    syncRiskToggles(pack);

    renderAll();
  }

  function tryCommandSelect(rawValue) {
    const cmd = normalizeCommand(rawValue);
    if (!cmd) return false;
    const packId = state.commandMap.get(cmd);
    if (!packId) return false;
    if (!state.activePack || state.activePack.id !== packId) {
      selectPack(packId);
    }
    return true;
  }

  function copyTextWithFeedback(text, btn) {
    if (!text || !btn) return;

    const fallbackCopy = () => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (e) {
        ok = false;
      }
      document.body.removeChild(ta);
      return ok;
    };

    const original = btn.textContent;
    const markSuccess = () => {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1400);
    };

    const markFailure = () => {
      btn.textContent = 'Copy failed';
      setTimeout(() => {
        btn.textContent = original;
      }, 1400);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(markSuccess).catch(() => {
        if (fallbackCopy()) markSuccess();
        else markFailure();
      });
      return;
    }

    if (fallbackCopy()) markSuccess();
    else markFailure();
  }

  function bindEvents() {
    els.packSelect.addEventListener('change', () => {
      selectPack(els.packSelect.value);
    });

    els.commandInput.addEventListener('input', () => {
      tryCommandSelect(els.commandInput.value);
    });

    els.commandInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        if (tryCommandSelect(els.commandInput.value)) {
          event.preventDefault();
        }
      }
    });

    els.modeDot.addEventListener('change', () => {
      if (!els.modeDot.checked) return;
      state.outputMode = OUTPUT_DOTPHRASE;
      setPreview();
    });

    els.modeExpanded.addEventListener('change', () => {
      if (!els.modeExpanded.checked) return;
      state.outputMode = OUTPUT_EXPANDED;
      setPreview();
    });

    document.getElementById('ddxContainer').addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.dataset.role !== 'ddx') return;
      const label = target.dataset.label || '';
      if (!label) return;

      if (target.checked) state.selectedDdx.add(label);
      else state.selectedDdx.delete(label);

      syncRuleouts(state.activePack);
      syncRiskToggles(state.activePack);
      renderAll();
    });

    document.getElementById('ruleoutContainer').addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.dataset.role !== 'ruleout') return;
      const id = normalizeId(target.dataset.id || '');
      if (!id) return;

      if (target.checked) state.selectedRuleouts.add(id);
      else state.selectedRuleouts.delete(id);
      setPreview();
    });

    document.getElementById('riskContainer').addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.dataset.role === 'risk' && target instanceof HTMLInputElement) {
        const riskId = target.dataset.riskId || '';
        if (!riskId) return;
        if (target.checked) state.selectedRisks.add(riskId);
        else state.selectedRisks.delete(riskId);

        const inputEl = document.getElementById(`risk-input-${riskId}`);
        if (inputEl instanceof HTMLInputElement || inputEl instanceof HTMLSelectElement) {
          inputEl.disabled = !target.checked;
        }
        setPreview();
        return;
      }

      if (target.dataset.role === 'risk-input' && (target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) {
        const riskId = target.dataset.riskId || '';
        if (!riskId) return;
        state.riskInputs[riskId] = target.value;
        setPreview();
      }
    });

    document.getElementById('riskContainer').addEventListener('input', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.dataset.role !== 'risk-input') return;
      const riskId = target.dataset.riskId || '';
      if (!riskId) return;
      state.riskInputs[riskId] = target.value;
      setPreview();
    });

    els.copyFullBtn.addEventListener('click', () => {
      copyTextWithFeedback(els.preview.value, els.copyFullBtn);
    });

    els.copyDdxBtn.addEventListener('click', () => {
      if (!state.activePack) return;
      copyTextWithFeedback(buildDdxText(state.activePack), els.copyDdxBtn);
    });

    els.copyRuleoutsBtn.addEventListener('click', () => {
      if (!state.activePack) return;
      copyTextWithFeedback(buildRuleoutsText(), els.copyRuleoutsBtn);
    });
  }

  async function loadPacks() {
    const response = await fetch('mdm_packs.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load mdm_packs.json (${response.status})`);
    }
    const payload = await response.json();
    const packs = Array.isArray(payload.packs) ? payload.packs : [];
    if (!packs.length) {
      throw new Error('mdm_packs.json has no packs');
    }
    state.packs = packs;
    state.packById = new Map(packs.map((pack) => [pack.id, pack]));
    buildCommandMap();
  }

  async function init() {
    bindEvents();

    try {
      await loadPacks();
    } catch (error) {
      els.preview.value = 'Failed to load MDM packs. Check mdm_packs.json.';
      els.ddxContainer.innerHTML = `<p class="empty-block">${escapeHtml(error.message)}</p>`;
      els.ruleoutContainer.innerHTML = '<p class="empty-block">Unavailable.</p>';
      els.riskContainer.innerHTML = '<p class="empty-block">Unavailable.</p>';
      return;
    }

    populatePackSelect();

    const hashCmd = normalizeCommand(window.location.hash.replace(/^#/, ''));
    if (hashCmd && state.commandMap.has(hashCmd)) {
      selectPack(state.commandMap.get(hashCmd));
      return;
    }

    selectPack(state.packs[0].id);
  }

  init();
})();
