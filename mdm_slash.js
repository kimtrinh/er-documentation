(function () {
  'use strict';

  const GROUP_ORDER = ['Life-threatening', 'Common', 'Other'];
  const STORAGE_KEY = 'kp_mdm_builder_state_v3';
  const LEGACY_STORAGE_KEYS = ['kp_mdm_builder_state_v2'];
  const COMMAND_USAGE_KEY = 'kp_mdm_slash_command_usage_v1';
  const MAX_SUGGESTIONS = 10;
  const PRIORITY_COMMAND_BOOSTS = Object.freeze({
    '/ddxcp': 520,
    '/ddxsob': 440,
    '/ddxabd': 420,
    '/ddxha': 400,
    '/ddxpregvb': 380,
    '/risk wells': 360,
    '/risk heart': 340,
    '/ruleout noacs': 330,
    '/ruleout nope': 320,
    '/help': 140,
    '/clear': 120,
    '/reset': 110
  });
  const RISK_TOKEN_PREFERENCES = Object.freeze({
    wells_pe: 'wells',
    heart: 'heart',
    perc: 'perc',
    years: 'years',
    add_rs: 'addrs',
    curb65: 'curb65',
    qsofa: 'qsofa',
    alvarado: 'alvarado',
    glasgow_blatchford: 'gbs',
    abcd2: 'abcd2',
    cha2ds2_vasc: 'cha2ds2vasc',
    canadian_ct_head: 'cthead',
    canadian_syncope: 'syncope',
    pecarn: 'pecarn',
    nexus_cspine: 'nexus',
    ottawa_sah: 'ottawasah',
    bisap: 'bisap'
  });

  const MANUAL_PACK_ALIASES = Object.freeze({
    mdmccp: ['cp', 'chestpain', 'ccp'],
    mdmsob: ['sob', 'dyspnea'],
    mdmabd: ['abd', 'abdpain', 'abdominal'],
    mdmha: ['ha', 'headache', 'neuro'],
    mdmfever: ['fever', 'sepsis'],
    mdmpregvb: ['pregvb', 'pregbleed', 'vagbleedpreg'],
    mdmsyncope: ['syncope', 'nearsyncope'],
    mdmdizzy: ['dizzy', 'vertigo'],
    mdmlbp: ['lbp', 'lowbackpain'],
    mdmams: ['ams', 'altered'],
    mdmgib: ['gib', 'gibleed']
  });

  const els = {
    packSelect: document.getElementById('slashPackSelect'),
    packChips: document.getElementById('slashPackChips'),
    commandInput: document.getElementById('slashCommandInput'),
    runCommandBtn: document.getElementById('runCommandBtn'),
    suggestions: document.getElementById('slashSuggestions'),
    status: document.getElementById('slashStatus'),
    quickCommands: document.getElementById('slashQuickCommands'),
    helpPanel: document.getElementById('slashHelpPanel'),
    ddxContainer: document.getElementById('slashDdxContainer'),
    ddxCount: document.getElementById('slashDdxCount'),
    ddxSelectAllBtn: document.getElementById('slashSelectAllDdxBtn'),
    ddxClearAllBtn: document.getElementById('slashClearAllDdxBtn'),
    ruleoutContainer: document.getElementById('slashRuleoutContainer'),
    ruleoutCount: document.getElementById('slashRuleoutCount'),
    riskContainer: document.getElementById('slashRiskContainer'),
    riskCount: document.getElementById('slashRiskCount'),
    preview: document.getElementById('slashPreview'),
    copyFullBtn: document.getElementById('slashCopyFullBtn'),
    copyDdxBtn: document.getElementById('slashCopyDdxBtn'),
    copyRuleoutsBtn: document.getElementById('slashCopyRuleoutsBtn'),
    resetBtn: document.getElementById('slashResetBtn')
  };

  const state = {
    packs: [],
    packById: new Map(),
    activePack: null,
    aliasToPack: new Map(),
    commandItems: [],
    commandByText: new Map(),
    suggestions: [],
    activeSuggestionIndex: -1,
    selectedDdx: new Set(),
    availableRuleoutIds: [],
    selectedRuleouts: new Set(),
    selectedRisks: new Set(),
    riskInputs: Object.create(null),
    openRiskTools: new Set(),
    commandUsage: Object.create(null),
    savedByPack: Object.create(null),
    savedActivePackId: ''
  };

  function normalizeLabel(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function normalizeAlias(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/^\/+/, '')
      .replace(/^ddx/, '')
      .replace(/^mdm/, '')
      .replace(/[^a-z0-9]+/g, '');
  }

  function normalizeCommandText(text) {
    const trimmed = String(text || '').trim().toLowerCase();
    if (!trimmed) return '';
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }

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

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => (
      ch === '&' ? '&amp;' :
      ch === '<' ? '&lt;' :
      ch === '>' ? '&gt;' :
      ch === '"' ? '&quot;' : '&#39;'
    ));
  }

  function safeLocalStorage() {
    try {
      return window.localStorage || null;
    } catch (e) {
      return null;
    }
  }

  function cloneRiskInputValue(value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return JSON.parse(JSON.stringify(value));
    }
    if (typeof value === 'undefined' || value === null) return '';
    return String(value);
  }

  function loadCommandUsage() {
    const storage = safeLocalStorage();
    if (!storage) return;
    try {
      const raw = storage.getItem(COMMAND_USAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return;

      state.commandUsage = Object.create(null);
      Object.keys(parsed).forEach((key) => {
        const command = normalizeCommandText(key);
        const count = Number.parseInt(String(parsed[key]), 10);
        if (!command || !Number.isFinite(count) || count <= 0) return;
        state.commandUsage[command] = count;
      });
    } catch (e) {
      state.commandUsage = Object.create(null);
    }
  }

  function saveCommandUsage() {
    const storage = safeLocalStorage();
    if (!storage) return;
    try {
      storage.setItem(COMMAND_USAGE_KEY, JSON.stringify(state.commandUsage || {}));
    } catch (e) {
      // ignore save failures
    }
  }

  function recordCommandUsage(rawCommand) {
    const command = normalizeCommandText(rawCommand);
    if (!command || command.includes('<')) return;
    state.commandUsage[command] = (state.commandUsage[command] || 0) + 1;
    saveCommandUsage();
  }

  function getCommandUsageBoost(rawCommand) {
    const command = normalizeCommandText(rawCommand);
    if (!command) return 0;
    const count = state.commandUsage[command] || 0;
    return Math.min(220, count * 14);
  }

  function getCommandPriorityBoost(rawCommand) {
    const command = normalizeCommandText(rawCommand);
    if (!command) return 0;
    return PRIORITY_COMMAND_BOOSTS[command] || 0;
  }

  function loadSavedState() {
    const storage = safeLocalStorage();
    if (!storage) return;

    try {
      let parsed = null;
      const keys = [STORAGE_KEY].concat(LEGACY_STORAGE_KEYS);
      for (let i = 0; i < keys.length; i += 1) {
        const raw = storage.getItem(keys[i]);
        if (!raw) continue;
        try {
          parsed = JSON.parse(raw);
          break;
        } catch (e) {
          parsed = null;
        }
      }

      if (!parsed || typeof parsed !== 'object') return;

      if (typeof parsed.activePackId === 'string') {
        state.savedActivePackId = parsed.activePackId;
      }

      const packs = parsed.packs;
      if (packs && typeof packs === 'object') {
        state.savedByPack = Object.create(null);
        Object.keys(packs).forEach((packId) => {
          const entry = packs[packId];
          if (!entry || typeof entry !== 'object') return;
          state.savedByPack[packId] = {
            selectedDdx: Array.isArray(entry.selectedDdx) ? entry.selectedDdx.map(String) : [],
            selectedRuleouts: Array.isArray(entry.selectedRuleouts) ? entry.selectedRuleouts.map((x) => normalizeId(x)) : [],
            selectedRisks: Array.isArray(entry.selectedRisks) ? entry.selectedRisks.map(String) : [],
            riskInputs: entry.riskInputs && typeof entry.riskInputs === 'object' ? entry.riskInputs : {},
            historyAnswers: entry.historyAnswers && typeof entry.historyAnswers === 'object' ? entry.historyAnswers : {}
          };
        });
      }
    } catch (e) {
      // ignore parse/storage failures
    }
  }

  function saveState() {
    const storage = safeLocalStorage();
    if (!storage) return;

    try {
      let existing = {};
      const raw = storage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') existing = parsed;
        } catch (e) {
          existing = {};
        }
      }

      const payload = {
        ...existing,
        activePackId: state.activePack ? state.activePack.id : state.savedActivePackId,
        packs: state.savedByPack
      };
      storage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // ignore save failures
    }
  }

  function snapshotActivePackState() {
    const existing = state.activePack ? state.savedByPack[state.activePack.id] : null;
    const riskInputs = Object.create(null);
    Object.keys(state.riskInputs || {}).forEach((id) => {
      riskInputs[id] = cloneRiskInputValue(state.riskInputs[id]);
    });

    return {
      selectedDdx: [...state.selectedDdx],
      selectedRuleouts: getSelectedRuleoutIds(),
      selectedRisks: [...state.selectedRisks],
      riskInputs,
      historyAnswers: existing && existing.historyAnswers && typeof existing.historyAnswers === 'object'
        ? { ...existing.historyAnswers }
        : {}
    };
  }

  function persistActivePackState() {
    if (!state.activePack) return;
    state.savedByPack[state.activePack.id] = snapshotActivePackState();
    state.savedActivePackId = state.activePack.id;
    saveState();
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

  function syncRuleouts(pack, options) {
    const opts = options || {};
    const autoSelectNew = opts.autoSelectNew !== false;
    const nextIds = computeAvailableRuleoutIds(pack);
    const nextSet = new Set(nextIds);
    const prevSet = new Set(state.availableRuleoutIds);

    if (autoSelectNew) {
      nextIds.forEach((id) => {
        if (!prevSet.has(id)) {
          state.selectedRuleouts.add(id);
        }
      });
    }

    Array.from(state.selectedRuleouts).forEach((id) => {
      if (!nextSet.has(id)) {
        state.selectedRuleouts.delete(id);
      }
    });

    state.availableRuleoutIds = nextIds;
  }

  function getVisibleRiskToggles(pack) {
    if (!getSelectedDdxItems(pack).length) return [];
    const activeTags = getActiveTags(pack);
    return (pack.risk_toggles || []).filter((toggle) => {
      const required = Array.isArray(toggle.tags_required) ? toggle.tags_required : [];
      if (!required.length) return true;
      return required.some((tag) => activeTags.has(String(tag)));
    });
  }

  function ensureCalculatorInputState(toggle) {
    const calcType = toggle && toggle.calculator ? toggle.calculator.type : '';
    const engine = window.ER_MDM_RISK;
    const defaults = engine && typeof engine.createDefaults === 'function'
      ? engine.createDefaults(calcType)
      : {};

    const existing = state.riskInputs[toggle.id];
    if (!existing || typeof existing !== 'object' || Array.isArray(existing)) {
      state.riskInputs[toggle.id] = { ...defaults };
      return state.riskInputs[toggle.id];
    }

    const merged = { ...defaults, ...existing };
    state.riskInputs[toggle.id] = merged;
    return merged;
  }

  function syncRiskToggles(pack, options) {
    const opts = options || {};
    const prevVisibleIds = opts.prevVisibleIds instanceof Set ? opts.prevVisibleIds : new Set();
    const autoEnableNew = Boolean(opts.autoEnableNew);

    const visible = getVisibleRiskToggles(pack);
    const visibleIds = new Set(visible.map((toggle) => toggle.id));

    if (autoEnableNew) {
      visible.forEach((toggle) => {
        if (!prevVisibleIds.has(toggle.id)) {
          state.selectedRisks.add(toggle.id);
          state.openRiskTools.add(toggle.id);
        }
      });
    }

    Array.from(state.selectedRisks).forEach((riskId) => {
      if (!visibleIds.has(riskId)) {
        state.selectedRisks.delete(riskId);
      }
    });

    Array.from(state.openRiskTools).forEach((riskId) => {
      if (!visibleIds.has(riskId)) {
        state.openRiskTools.delete(riskId);
      }
    });

    visible.forEach((toggle) => {
      if (toggle.calculator && toggle.calculator.type) {
        ensureCalculatorInputState(toggle);
      } else if (toggle.input) {
        if (typeof state.riskInputs[toggle.id] === 'undefined') {
          state.riskInputs[toggle.id] = typeof toggle.input.default !== 'undefined'
            ? String(toggle.input.default)
            : '';
        }
      }
    });
  }

  function getSelectedRuleoutIds() {
    return state.availableRuleoutIds.filter((id) => state.selectedRuleouts.has(id));
  }

  function updateStatus(text, level) {
    if (!els.status) return;
    els.status.textContent = text || '';
    els.status.dataset.level = level || 'info';
  }

  function applyTemplate(template, tokens) {
    let output = String(template || '').trim();
    if (!output) return '';
    const values = tokens && typeof tokens === 'object' ? tokens : {};
    Object.keys(values).forEach((key) => {
      output = output.replaceAll(`{${key}}`, normalizeLabel(values[key]));
    });
    return output.replace(/\{\w+\}/g, '').replace(/\s{2,}/g, ' ').trim();
  }

  function buildDdxText(pack) {
    const labels = getSelectedDdxItems(pack).map((item) => item.label);
    return labels.length
      ? `DDx considered: ${labels.join(', ')}.`
      : 'DDx considered: none selected.';
  }

  function buildRuleoutsText() {
    const selected = getSelectedRuleoutIds();
    if (!selected.length) {
      return 'Rule-outs: none selected.';
    }

    const lines = ['Rule-outs:'];
    selected.forEach((id) => {
      const lookup = phraseLookup(id);
      const text = lookup.exists ? normalizeLabel(lookup.text) : formatDotphrase(id);
      lines.push(`- ${text}`);
    });
    return lines.join('\n');
  }

  function buildRiskLines(pack) {
    const visible = getVisibleRiskToggles(pack);
    const engine = window.ER_MDM_RISK;
    if (!engine || typeof engine.evaluate !== 'function') return [];

    const lines = [];
    visible.forEach((toggle) => {
      if (!state.selectedRisks.has(toggle.id)) return;

      let sentence = '';
      if (toggle.calculator && toggle.calculator.type) {
        const values = ensureCalculatorInputState(toggle);
        const evalResult = engine.evaluate(toggle.calculator.type, values);
        if (toggle.sentence_template) {
          if (evalResult.ready) {
            sentence = applyTemplate(toggle.sentence_template, {
              score: evalResult.scoreText,
              interpretation: evalResult.interpretation,
              details: evalResult.details
            });
          } else {
            sentence = `${toggle.label}: calculator inputs incomplete.`;
          }
        } else {
          sentence = engine.renderCalcSummary(toggle.calculator.type, evalResult);
        }
      } else {
        const value = typeof state.riskInputs[toggle.id] === 'undefined' ? '' : String(state.riskInputs[toggle.id]);
        if (toggle.sentence_template) {
          sentence = applyTemplate(toggle.sentence_template, { value });
        }
        if (!sentence) {
          sentence = toggle.label;
        }
      }

      if (sentence) {
        lines.push(sentence);
      }
    });

    return lines;
  }

  function buildPreviewText(pack) {
    if (!pack) return '';

    const lines = [];
    const scaffold = normalizeLabel(pack.base_mdm_template)
      || 'Focused emergency evaluation completed with documentation-ready differential and risk-based disposition.';

    lines.push(`MDM - ${pack.title}: ${scaffold}`);
    lines.push('');
    lines.push(buildDdxText(pack));

    const riskLines = buildRiskLines(pack);
    if (riskLines.length) {
      lines.push('');
      lines.push('Risk stratification:');
      riskLines.forEach((line) => {
        lines.push(`- ${line}`);
      });
    }

    lines.push('');
    lines.push(buildRuleoutsText());

    return lines.join('\n').trim();
  }

  function renderCounts() {
    if (els.ddxCount) {
      els.ddxCount.textContent = `${state.selectedDdx.size} selected`;
    }
    if (els.ruleoutCount) {
      els.ruleoutCount.textContent = `${getSelectedRuleoutIds().length} selected`;
    }
    if (els.riskCount) {
      els.riskCount.textContent = `${state.selectedRisks.size} selected`;
    }
  }

  function renderPackSelect() {
    if (!els.packSelect) return;
    els.packSelect.innerHTML = state.packs.map((pack) => (
      `<option value="${escapeHtml(pack.id)}">${escapeHtml(pack.title)} (${escapeHtml(pack.id)})</option>`
    )).join('');

    if (state.activePack) {
      els.packSelect.value = state.activePack.id;
    }
  }

  function renderPackChips() {
    if (!els.packChips) return;
    els.packChips.innerHTML = state.packs.map((pack) => {
      const active = state.activePack && state.activePack.id === pack.id ? ' active' : '';
      return `<button type="button" class="pack-chip${active}" data-pack-id="${escapeHtml(pack.id)}">${escapeHtml(pack.title)}</button>`;
    }).join('');
  }

  function renderQuickCommandChips() {
    if (!els.quickCommands) return;
    const preferred = state.commandItems
      .filter((item) => item.type === 'pack')
      .slice(0, 8);
    els.quickCommands.innerHTML = preferred.map((item) => (
      `<button type="button" class="quick-chip" data-command="${escapeHtml(item.command)}">${escapeHtml(item.command)}</button>`
    )).join('');
  }

  function renderDdx() {
    const pack = state.activePack;
    if (!pack || !els.ddxContainer) return;

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
      const rows = (groups[group] || []).map((item) => {
        const checked = state.selectedDdx.has(item.label) ? 'checked' : '';
        return `
          <label class="check-row">
            <input type="checkbox" data-role="ddx" data-label="${escapeHtml(item.label)}" ${checked}>
            <span>${escapeHtml(item.label)}</span>
          </label>
        `;
      }).join('');

      return `
        <div class="subgroup">
          <h4>${escapeHtml(group)}</h4>
          <div class="check-grid">${rows}</div>
        </div>
      `;
    }).join('');
  }

  function renderRuleouts() {
    if (!els.ruleoutContainer) return;
    const ids = state.availableRuleoutIds;
    if (!ids.length) {
      els.ruleoutContainer.innerHTML = '<p class="empty-block">Select DDx items to populate linked rule-outs.</p>';
      return;
    }

    els.ruleoutContainer.innerHTML = ids.map((id) => {
      const checked = state.selectedRuleouts.has(id) ? 'checked' : '';
      const lookup = phraseLookup(id);
      const missing = lookup.exists ? '' : '<span class="missing">(missing)</span>';
      return `
        <label class="check-row">
          <input type="checkbox" data-role="ruleout" data-id="${escapeHtml(id)}" ${checked}>
          <span class="ruleout-label">${escapeHtml(formatDotphrase(id))} ${missing}</span>
        </label>
      `;
    }).join('');
  }

  function renderRiskInput(toggle, isChecked) {
    const input = toggle.input;
    if (!input) return '';

    const inputId = `slash-risk-input-${toggle.id}`;
    const value = typeof state.riskInputs[toggle.id] === 'undefined' ? '' : String(state.riskInputs[toggle.id]);
    const disabled = isChecked ? '' : 'disabled';

    if (input.type === 'select') {
      const options = (input.options || []).map((opt) => {
        const selected = String(opt.value) === value ? 'selected' : '';
        return `<option value="${escapeHtml(opt.value)}" ${selected}>${escapeHtml(opt.label)}</option>`;
      }).join('');

      return `
        <label class="risk-input-wrap" for="${escapeHtml(inputId)}">
          <span>${escapeHtml(input.label || 'Value')}</span>
          <select id="${escapeHtml(inputId)}" data-role="risk-input" data-risk-id="${escapeHtml(toggle.id)}" ${disabled}>${options}</select>
        </label>
      `;
    }

    const type = input.type === 'number' ? 'number' : 'text';
    const min = typeof input.min === 'number' ? `min="${input.min}"` : '';
    const max = typeof input.max === 'number' ? `max="${input.max}"` : '';
    const placeholder = input.placeholder ? `placeholder="${escapeHtml(input.placeholder)}"` : '';

    return `
      <label class="risk-input-wrap" for="${escapeHtml(inputId)}">
        <span>${escapeHtml(input.label || 'Value')}</span>
        <input id="${escapeHtml(inputId)}" type="${type}" value="${escapeHtml(value)}" ${min} ${max} ${placeholder} data-role="risk-input" data-risk-id="${escapeHtml(toggle.id)}" ${disabled}>
      </label>
    `;
  }

  function renderRiskCalculator(toggle, isChecked) {
    const engine = window.ER_MDM_RISK;
    if (!engine || typeof engine.getCalculatorSchema !== 'function') {
      return '<p class="empty-block">Risk engine unavailable.</p>';
    }

    const calcType = toggle.calculator.type;
    const schema = engine.getCalculatorSchema(calcType);
    if (!schema) {
      return '<p class="empty-block">Unsupported calculator.</p>';
    }

    const values = ensureCalculatorInputState(toggle);
    const result = engine.evaluate(calcType, values);
    const disabled = isChecked ? '' : 'disabled';

    const fieldsHtml = schema.fields.map((field) => {
      if (field.type === 'heading') {
        return `<div class="calc-subhead">${escapeHtml(field.label)}</div>`;
      }

      const fieldId = `slash-calc-${toggle.id}-${field.id}`;
      const currentValue = values[field.id];

      if (field.type === 'checkbox') {
        const checked = Boolean(currentValue) ? 'checked' : '';
        return `
          <label class="check-row calc-row">
            <input type="checkbox" id="${escapeHtml(fieldId)}" data-role="risk-calc-input" data-risk-id="${escapeHtml(toggle.id)}" data-field-id="${escapeHtml(field.id)}" ${checked} ${disabled}>
            <span>${escapeHtml(field.label)}</span>
          </label>
        `;
      }

      if (field.type === 'select') {
        const options = (field.options || []).map((opt) => {
          const selected = String(opt.value) === String(currentValue ?? '') ? 'selected' : '';
          return `<option value="${escapeHtml(opt.value)}" ${selected}>${escapeHtml(opt.label)}</option>`;
        }).join('');
        return `
          <label class="risk-input-wrap" for="${escapeHtml(fieldId)}">
            <span>${escapeHtml(field.label)}</span>
            <select id="${escapeHtml(fieldId)}" data-role="risk-calc-input" data-risk-id="${escapeHtml(toggle.id)}" data-field-id="${escapeHtml(field.id)}" ${disabled}>${options}</select>
          </label>
        `;
      }

      const min = typeof field.min === 'number' ? `min="${field.min}"` : '';
      const max = typeof field.max === 'number' ? `max="${field.max}"` : '';
      const step = field.step ? `step="${escapeHtml(field.step)}"` : '';
      const placeholder = field.placeholder ? `placeholder="${escapeHtml(field.placeholder)}"` : '';
      return `
        <label class="risk-input-wrap" for="${escapeHtml(fieldId)}">
          <span>${escapeHtml(field.label)}</span>
          <input id="${escapeHtml(fieldId)}" type="number" value="${escapeHtml(currentValue ?? '')}" ${min} ${max} ${step} ${placeholder} data-role="risk-calc-input" data-risk-id="${escapeHtml(toggle.id)}" data-field-id="${escapeHtml(field.id)}" ${disabled}>
        </label>
      `;
    }).join('');

    return `
      <div class="calc-wrap">
        <div class="calc-title">${escapeHtml(schema.title)} Calculator</div>
        <div class="calc-grid">${fieldsHtml}</div>
        <div class="calc-result ${escapeHtml(result.className)}">${escapeHtml(result.preview)}</div>
      </div>
    `;
  }

  function renderRiskTools() {
    if (!els.riskContainer) return;
    const pack = state.activePack;
    if (!pack) {
      els.riskContainer.innerHTML = '<p class="empty-block">No pack selected.</p>';
      return;
    }

    const selectedDdxCount = getSelectedDdxItems(pack).length;
    if (!selectedDdxCount) {
      els.riskContainer.innerHTML = '<p class="empty-block">Select DDx items to show linked risk tools.</p>';
      return;
    }

    const visible = getVisibleRiskToggles(pack);
    if (!visible.length) {
      els.riskContainer.innerHTML = '<p class="empty-block">No risk tools for current DDx selection.</p>';
      return;
    }

    els.riskContainer.innerHTML = visible.map((toggle) => {
      const isChecked = state.selectedRisks.has(toggle.id);
      const checked = isChecked ? 'checked' : '';
      const open = isChecked || state.openRiskTools.has(toggle.id) ? ' open' : '';
      const content = toggle.calculator && toggle.calculator.type
        ? renderRiskCalculator(toggle, isChecked)
        : renderRiskInput(toggle, isChecked);

      return `
        <details class="risk-row" id="slash-risk-${escapeHtml(toggle.id)}" data-risk-tool-id="${escapeHtml(toggle.id)}"${open}>
          <summary>
            <label class="check-row" onclick="event.stopPropagation()">
              <input type="checkbox" data-role="risk" data-risk-id="${escapeHtml(toggle.id)}" ${checked}>
              <span>${escapeHtml(toggle.label)}</span>
            </label>
            <span class="chevron" aria-hidden="true"></span>
          </summary>
          ${content}
        </details>
      `;
    }).join('');
  }

  function renderPreview() {
    if (!els.preview) return;
    if (!state.activePack) {
      els.preview.value = '';
      return;
    }
    els.preview.value = buildPreviewText(state.activePack);
  }

  function renderAll() {
    renderPackSelect();
    renderPackChips();
    renderQuickCommandChips();
    renderDdx();
    renderRuleouts();
    renderRiskTools();
    renderCounts();
    renderPreview();
  }

  function getDefaultDdxSet(pack) {
    return new Set(
      (pack.ddx || [])
        .filter((item) => Boolean(item.default_checked))
        .map((item) => item.label)
    );
  }

  function applyDefaultPackState(pack) {
    state.selectedDdx = getDefaultDdxSet(pack);
    state.selectedRuleouts.clear();
    state.availableRuleoutIds = [];
    syncRuleouts(pack, { autoSelectNew: true });
    state.selectedRisks.clear();
    state.riskInputs = Object.create(null);
    state.openRiskTools.clear();
    syncRiskToggles(pack, { autoEnableNew: true, prevVisibleIds: new Set() });
  }

  function applySavedPackState(pack, saved) {
    const validDdx = new Set((pack.ddx || []).map((item) => item.label));
    const validRisk = new Set((pack.risk_toggles || []).map((toggle) => toggle.id));

    state.selectedDdx = new Set((saved.selectedDdx || []).filter((label) => validDdx.has(label)));
    state.selectedRuleouts = new Set((saved.selectedRuleouts || []).map((id) => normalizeId(id)).filter(Boolean));
    state.selectedRisks = new Set((saved.selectedRisks || []).filter((id) => validRisk.has(id)));

    state.riskInputs = Object.create(null);
    Object.keys(saved.riskInputs || {}).forEach((id) => {
      state.riskInputs[id] = cloneRiskInputValue(saved.riskInputs[id]);
    });

    state.openRiskTools = new Set([...state.selectedRisks]);

    state.availableRuleoutIds = [];
    syncRuleouts(pack, { autoSelectNew: false });
    syncRiskToggles(pack, { autoEnableNew: false, prevVisibleIds: new Set() });
  }

  function selectPack(packId, options) {
    const opts = options || {};
    const skipPersist = Boolean(opts.skipPersist);
    const pack = state.packById.get(packId);
    if (!pack) return;

    if (!skipPersist && state.activePack) {
      persistActivePackState();
    }

    state.activePack = pack;
    if (els.packSelect) {
      els.packSelect.value = pack.id;
    }

    const saved = state.savedByPack[pack.id];
    if (saved && typeof saved === 'object') {
      applySavedPackState(pack, saved);
    } else {
      applyDefaultPackState(pack);
    }

    renderAll();
    persistActivePackState();
  }

  function buildPackAliasMap() {
    state.aliasToPack.clear();

    state.packs.forEach((pack) => {
      const aliases = new Set();
      const rawAliases = Array.isArray(pack.aliases) ? pack.aliases : [];

      aliases.add(normalizeAlias(pack.id));
      aliases.add(normalizeAlias(pack.id.replace(/^mdm/, '')));

      rawAliases.forEach((alias) => {
        aliases.add(normalizeAlias(alias));
        aliases.add(normalizeAlias(String(alias).replace(/^mdm/, '')));
      });

      (MANUAL_PACK_ALIASES[pack.id] || []).forEach((alias) => aliases.add(normalizeAlias(alias)));

      aliases.forEach((alias) => {
        if (!alias) return;
        if (!state.aliasToPack.has(alias)) {
          state.aliasToPack.set(alias, pack.id);
        }
      });
    });
  }

  function getPreferredAlias(pack) {
    const manual = MANUAL_PACK_ALIASES[pack.id];
    if (Array.isArray(manual) && manual.length) {
      return normalizeAlias(manual[0]);
    }

    const aliases = Array.isArray(pack.aliases) ? pack.aliases : [];
    for (let i = 0; i < aliases.length; i += 1) {
      const normalized = normalizeAlias(aliases[i]);
      if (normalized) return normalized;
    }

    return normalizeAlias(pack.id.replace(/^mdm/, '')) || normalizeAlias(pack.id);
  }

  function createCommandEntry(item) {
    const command = normalizeCommandText(item.command);
    if (!command) return null;
    return {
      ...item,
      command,
      search: `${command} ${normalizeLabel(item.label)} ${normalizeLabel(item.hint || '')}`.toLowerCase()
    };
  }

  function addCommandItem(item, seen) {
    const entry = createCommandEntry(item);
    if (!entry || seen.has(entry.command)) return;
    seen.add(entry.command);

    state.commandItems.push(entry);
    state.commandByText.set(entry.command, entry);
  }

  function getRiskCommandToken(toggle) {
    if (!toggle) return '';
    if (toggle.calculator && toggle.calculator.type) {
      const calcType = String(toggle.calculator.type || '').trim();
      if (RISK_TOKEN_PREFERENCES[calcType]) return RISK_TOKEN_PREFERENCES[calcType];
      return normalizeAlias(calcType);
    }

    const labelToken = normalizeAlias(toggle.label);
    if (labelToken) return labelToken;
    return normalizeAlias(toggle.id);
  }

  function getSuggestionPool() {
    const seen = new Set();
    const pool = [];

    const pushItem = (item) => {
      const entry = createCommandEntry(item);
      if (!entry || seen.has(entry.command)) return;
      seen.add(entry.command);
      pool.push(entry);
    };

    if (state.activePack) {
      state.availableRuleoutIds.forEach((id) => {
        pushItem({
          type: 'context-ruleout',
          command: `/ruleout ${id}`,
          label: `Toggle ${formatDotphrase(id)}`,
          hint: `${state.activePack.title} linked rule-out`
        });
      });

      const tokenSeen = new Set();
      getVisibleRiskToggles(state.activePack).forEach((toggle) => {
        const token = getRiskCommandToken(toggle);
        if (!token || tokenSeen.has(token)) return;
        tokenSeen.add(token);
        pushItem({
          type: 'context-risk',
          command: `/risk ${token}`,
          label: `Focus ${toggle.label}`,
          hint: `${state.activePack.title} linked risk tool`
        });
      });
    }

    state.commandItems.forEach((item) => pushItem(item));

    return pool;
  }

  function buildCommandCatalog() {
    state.commandItems = [];
    state.commandByText = new Map();
    const seen = new Set();

    state.packs.forEach((pack) => {
      const preferred = getPreferredAlias(pack);
      addCommandItem({
        type: 'pack',
        command: `/ddx${preferred}`,
        packId: pack.id,
        label: `Load ${pack.title}`,
        hint: `${pack.id}`
      }, seen);

      const aliases = new Set();
      aliases.add(normalizeAlias(pack.id.replace(/^mdm/, '')));
      (Array.isArray(pack.aliases) ? pack.aliases : []).forEach((alias) => aliases.add(normalizeAlias(alias)));
      (MANUAL_PACK_ALIASES[pack.id] || []).forEach((alias) => aliases.add(normalizeAlias(alias)));

      aliases.forEach((alias) => {
        if (!alias || alias === preferred) return;
        addCommandItem({
          type: 'pack',
          command: `/ddx${alias}`,
          packId: pack.id,
          label: `Load ${pack.title}`,
          hint: `${pack.id}`
        }, seen);
      });
    });

    addCommandItem({ type: 'utility', command: '/ruleout <id>', label: 'Toggle rule-out by dotphrase id', hint: 'Example: /ruleout noacs' }, seen);
    addCommandItem({ type: 'utility', command: '/risk <tool>', label: 'Focus/open a linked risk tool', hint: 'Example: /risk wells' }, seen);
    addCommandItem({ type: 'utility', command: '/ruleout noacs', label: 'Toggle ACS rule-out', hint: 'Frequent command' }, seen);
    addCommandItem({ type: 'utility', command: '/ruleout nope', label: 'Toggle PE rule-out', hint: 'Frequent command' }, seen);
    addCommandItem({ type: 'utility', command: '/risk wells', label: 'Focus Wells PE calculator', hint: 'Frequent command' }, seen);
    addCommandItem({ type: 'utility', command: '/risk heart', label: 'Focus HEART calculator', hint: 'Frequent command' }, seen);
    addCommandItem({ type: 'utility', command: '/clear', label: 'Clear DDx, rule-outs, and risk tools', hint: '' }, seen);
    addCommandItem({ type: 'utility', command: '/reset', label: 'Reset active pack to defaults', hint: '' }, seen);
    addCommandItem({ type: 'utility', command: '/help', label: 'Open command help', hint: '' }, seen);
  }

  function scoreCommandMatch(query, item) {
    const q = normalizeCommandText(query).toLowerCase();
    const baseWeight = getCommandPriorityBoost(item.command) + getCommandUsageBoost(item.command);

    let contextBoost = 0;
    if (item.type === 'context-ruleout' || item.type === 'context-risk') {
      contextBoost += 50;
    }
    if (state.activePack && item.type === 'pack' && item.packId === state.activePack.id) {
      contextBoost += 25;
    }

    if (!q) return baseWeight + contextBoost;

    const cmd = item.command.toLowerCase();
    const search = item.search;

    if (cmd === q) return 1000 + baseWeight + contextBoost;
    if (cmd.startsWith(q)) return (700 - (cmd.length - q.length)) + baseWeight + contextBoost;
    if (cmd.includes(q)) return (450 - (cmd.indexOf(q))) + baseWeight + contextBoost;

    const tokens = q.replace(/^\//, '').split(/\s+/).filter(Boolean);
    if (!tokens.length) return 0;
    const all = tokens.every((tok) => search.includes(tok));
    if (all) return (200 - tokens.length) + baseWeight + contextBoost;

    return 0;
  }

  function buildSuggestions(query) {
    const q = normalizeCommandText(query);
    const pool = getSuggestionPool();
    if (!q || q === '/') {
      return pool
        .map((item) => ({ item, score: scoreCommandMatch('', item) }))
        .sort((a, b) => b.score - a.score || a.item.command.localeCompare(b.item.command))
        .slice(0, MAX_SUGGESTIONS)
        .map((entry) => entry.item);
    }

    const scored = pool
      .map((item) => ({ item, score: scoreCommandMatch(q, item) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.item.command.localeCompare(b.item.command))
      .slice(0, MAX_SUGGESTIONS)
      .map((entry) => entry.item);

    return scored;
  }

  function renderSuggestions() {
    if (!els.suggestions) return;

    const list = state.suggestions;
    if (!list.length) {
      els.suggestions.innerHTML = '';
      els.suggestions.hidden = true;
      return;
    }

    els.suggestions.hidden = false;
    els.suggestions.innerHTML = list.map((item, idx) => {
      const active = idx === state.activeSuggestionIndex ? ' active' : '';
      return `
        <li class="slash-suggestion${active}" data-suggestion-index="${idx}">
          <span class="cmd">${escapeHtml(item.command)}</span>
          <span class="desc">${escapeHtml(item.label)}</span>
          <span class="hint">${escapeHtml(item.hint || '')}</span>
        </li>
      `;
    }).join('');
  }

  function updateSuggestionsFromInput() {
    const value = els.commandInput ? els.commandInput.value : '';
    state.suggestions = buildSuggestions(value);
    state.activeSuggestionIndex = state.suggestions.length ? 0 : -1;
    renderSuggestions();
  }

  function getSuggestionByIndex(index) {
    if (index < 0 || index >= state.suggestions.length) return null;
    return state.suggestions[index] || null;
  }

  function closeSuggestions() {
    state.suggestions = [];
    state.activeSuggestionIndex = -1;
    renderSuggestions();
  }

  function toggleRuleoutFromCommand(rawId) {
    if (!state.activePack) return false;
    const id = normalizeId(rawId);
    if (!id) {
      updateStatus('Usage: /ruleout <dotphrase_id>', 'warn');
      return false;
    }

    if (!state.availableRuleoutIds.includes(id)) {
      updateStatus(`Rule-out ${formatDotphrase(id)} is not linked to current DDx selection.`, 'warn');
      return false;
    }

    if (state.selectedRuleouts.has(id)) {
      state.selectedRuleouts.delete(id);
      updateStatus(`Removed ${formatDotphrase(id)} from rule-outs.`, 'ok');
    } else {
      state.selectedRuleouts.add(id);
      updateStatus(`Added ${formatDotphrase(id)} to rule-outs.`, 'ok');
    }

    renderRuleouts();
    renderCounts();
    renderPreview();
    persistActivePackState();
    return true;
  }

  function focusRiskFromCommand(query) {
    if (!state.activePack) return false;
    const q = normalizeAlias(query);
    if (!q) {
      updateStatus('Usage: /risk <tool>', 'warn');
      return false;
    }

    const visible = getVisibleRiskToggles(state.activePack);
    if (!visible.length) {
      updateStatus('No risk tools visible for current DDx selection.', 'warn');
      return false;
    }

    const match = visible.find((toggle) => {
      const label = normalizeAlias(toggle.label);
      const id = normalizeAlias(toggle.id);
      const calc = toggle.calculator && toggle.calculator.type ? normalizeAlias(toggle.calculator.type) : '';
      return label.includes(q) || id.includes(q) || calc.includes(q);
    });

    if (!match) {
      updateStatus(`No visible risk tool matching "${query}".`, 'warn');
      return false;
    }

    state.selectedRisks.add(match.id);
    state.openRiskTools.add(match.id);
    renderRiskTools();
    renderCounts();
    renderPreview();
    persistActivePackState();

    const targetId = `slash-risk-${match.id}`;
    setTimeout(() => {
      const node = document.getElementById(targetId);
      if (node) {
        node.open = true;
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 40);

    updateStatus(`Focused risk tool: ${match.label}.`, 'ok');
    return true;
  }

  function clearAllSelections() {
    if (!state.activePack) return;
    state.selectedDdx.clear();
    state.selectedRuleouts.clear();
    state.availableRuleoutIds = [];
    state.selectedRisks.clear();
    state.riskInputs = Object.create(null);
    state.openRiskTools.clear();
    syncRuleouts(state.activePack, { autoSelectNew: false });
    syncRiskToggles(state.activePack, { autoEnableNew: false, prevVisibleIds: new Set() });
    renderAll();
    persistActivePackState();
    updateStatus('Cleared DDx, rule-outs, and risk tools.', 'ok');
  }

  function resetCurrentPackToDefaults() {
    if (!state.activePack) return;
    delete state.savedByPack[state.activePack.id];
    applyDefaultPackState(state.activePack);
    renderAll();
    persistActivePackState();
    updateStatus(`Reset ${state.activePack.title} to defaults.`, 'ok');
  }

  function selectAllDdx() {
    if (!state.activePack) return;
    const prevVisible = new Set(getVisibleRiskToggles(state.activePack).map((t) => t.id));
    state.selectedDdx = new Set((state.activePack.ddx || []).map((item) => item.label));
    syncRuleouts(state.activePack, { autoSelectNew: true });
    syncRiskToggles(state.activePack, { autoEnableNew: true, prevVisibleIds: prevVisible });
    renderAll();
    persistActivePackState();
    updateStatus('Selected all DDx for current pack.', 'ok');
  }

  function clearAllDdx() {
    if (!state.activePack) return;
    state.selectedDdx.clear();
    syncRuleouts(state.activePack, { autoSelectNew: false });
    syncRiskToggles(state.activePack, { autoEnableNew: false, prevVisibleIds: new Set() });
    renderAll();
    persistActivePackState();
    updateStatus('Cleared all DDx.', 'ok');
  }

  function parseAndExecuteCommand(rawInput) {
    const raw = normalizeLabel(rawInput);
    if (!raw) return false;

    const command = normalizeCommandText(raw);
    const exact = state.commandByText.get(command);
    if (exact && exact.type === 'pack') {
      selectPack(exact.packId);
      updateStatus(`Loaded ${state.packById.get(exact.packId).title}.`, 'ok');
      recordCommandUsage(exact.command);
      return true;
    }

    const body = command.replace(/^\//, '');
    const parts = body.split(/\s+/).filter(Boolean);
    if (!parts.length) return false;

    const first = parts[0].toLowerCase();
    const rest = parts.slice(1).join(' ').trim();

    if (first.startsWith('ddx')) {
      let alias = first.slice(3);
      if (!alias && rest) {
        alias = normalizeAlias(rest);
      }
      alias = normalizeAlias(alias);

      const packId = state.aliasToPack.get(alias);
      if (!packId) {
        updateStatus(`Unknown DDx command alias: ${alias || '(none)'}.`, 'warn');
        return false;
      }

      selectPack(packId);
      updateStatus(`Loaded ${state.packById.get(packId).title}.`, 'ok');
      recordCommandUsage(`/ddx${alias}`);
      return true;
    }

    if (first === 'ruleout') {
      const ok = toggleRuleoutFromCommand(rest);
      if (ok) {
        recordCommandUsage(`/ruleout ${normalizeId(rest)}`);
      }
      return ok;
    }

    if (first === 'risk') {
      const ok = focusRiskFromCommand(rest);
      if (ok) {
        const token = normalizeAlias(rest);
        recordCommandUsage(`/risk ${token || normalizeLabel(rest).toLowerCase()}`);
      }
      return ok;
    }

    if (first === 'clear') {
      clearAllSelections();
      recordCommandUsage('/clear');
      return true;
    }

    if (first === 'reset') {
      resetCurrentPackToDefaults();
      recordCommandUsage('/reset');
      return true;
    }

    if (first === 'help') {
      if (els.helpPanel) {
        els.helpPanel.open = true;
        els.helpPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      updateStatus('Opened command help.', 'ok');
      recordCommandUsage('/help');
      return true;
    }

    updateStatus(`Unknown command: ${command}`, 'warn');
    return false;
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
      }, 1300);
    };

    const markFailure = () => {
      btn.textContent = 'Copy failed';
      setTimeout(() => {
        btn.textContent = original;
      }, 1300);
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
    if (els.packSelect) {
      els.packSelect.addEventListener('change', () => {
        selectPack(els.packSelect.value);
      });
    }

    if (els.packChips) {
      els.packChips.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const btn = target.closest('[data-pack-id]');
        if (!btn) return;
        const packId = btn.getAttribute('data-pack-id');
        if (packId) {
          selectPack(packId);
          updateStatus(`Loaded ${state.packById.get(packId).title}.`, 'ok');
        }
      });
    }

    if (els.quickCommands) {
      els.quickCommands.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const btn = target.closest('[data-command]');
        if (!btn || !els.commandInput) return;
        const cmd = btn.getAttribute('data-command');
        if (!cmd) return;
        els.commandInput.value = cmd;
        parseAndExecuteCommand(cmd);
        closeSuggestions();
      });
    }

    if (els.commandInput) {
      els.commandInput.addEventListener('input', () => {
        updateSuggestionsFromInput();
      });

      els.commandInput.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
          if (!state.suggestions.length) return;
          event.preventDefault();
          state.activeSuggestionIndex = (state.activeSuggestionIndex + 1) % state.suggestions.length;
          renderSuggestions();
          return;
        }

        if (event.key === 'ArrowUp') {
          if (!state.suggestions.length) return;
          event.preventDefault();
          state.activeSuggestionIndex = (state.activeSuggestionIndex - 1 + state.suggestions.length) % state.suggestions.length;
          renderSuggestions();
          return;
        }

        if (event.key === 'Tab') {
          const suggestion = getSuggestionByIndex(state.activeSuggestionIndex);
          if (!suggestion) return;
          event.preventDefault();
          els.commandInput.value = suggestion.command;
          updateSuggestionsFromInput();
          return;
        }

        if (event.key === 'Escape') {
          closeSuggestions();
          return;
        }

        if (event.key === 'Enter') {
          event.preventDefault();
          const suggestion = getSuggestionByIndex(state.activeSuggestionIndex);
          const commandToRun = suggestion ? suggestion.command : els.commandInput.value;
          parseAndExecuteCommand(commandToRun);
          closeSuggestions();
        }
      });
    }

    if (els.runCommandBtn && els.commandInput) {
      els.runCommandBtn.addEventListener('click', () => {
        parseAndExecuteCommand(els.commandInput.value);
        closeSuggestions();
      });
    }

    if (els.suggestions) {
      els.suggestions.addEventListener('mousedown', (event) => {
        event.preventDefault();
      });
      els.suggestions.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const row = target.closest('[data-suggestion-index]');
        if (!row || !els.commandInput) return;
        const index = Number.parseInt(row.getAttribute('data-suggestion-index') || '', 10);
        const suggestion = getSuggestionByIndex(index);
        if (!suggestion) return;
        els.commandInput.value = suggestion.command;
        parseAndExecuteCommand(suggestion.command);
        closeSuggestions();
      });
    }

    if (els.ddxContainer) {
      els.ddxContainer.addEventListener('change', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || target.dataset.role !== 'ddx' || !state.activePack) return;
        const label = target.dataset.label || '';
        if (!label) return;

        const prevVisible = new Set(getVisibleRiskToggles(state.activePack).map((toggle) => toggle.id));

        if (target.checked) {
          state.selectedDdx.add(label);
        } else {
          state.selectedDdx.delete(label);
        }

        syncRuleouts(state.activePack, { autoSelectNew: true });
        syncRiskToggles(state.activePack, {
          autoEnableNew: target.checked,
          prevVisibleIds: prevVisible
        });

        renderAll();
        persistActivePackState();
      });
    }

    if (els.ruleoutContainer) {
      els.ruleoutContainer.addEventListener('change', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || target.dataset.role !== 'ruleout') return;
        const id = normalizeId(target.dataset.id || '');
        if (!id) return;

        if (target.checked) state.selectedRuleouts.add(id);
        else state.selectedRuleouts.delete(id);

        renderCounts();
        renderPreview();
        persistActivePackState();
      });
    }

    if (els.riskContainer) {
      els.riskContainer.addEventListener('toggle', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLDetailsElement)) return;
        if (!target.matches('[data-risk-tool-id]')) return;
        const id = target.dataset.riskToolId;
        if (!id) return;
        if (target.open) state.openRiskTools.add(id);
        else state.openRiskTools.delete(id);
      }, true);

      els.riskContainer.addEventListener('change', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        if (target.dataset.role === 'risk' && target instanceof HTMLInputElement) {
          const riskId = target.dataset.riskId || '';
          if (!riskId) return;
          if (target.checked) {
            state.selectedRisks.add(riskId);
            state.openRiskTools.add(riskId);
          } else {
            state.selectedRisks.delete(riskId);
          }
          renderRiskTools();
          renderCounts();
          renderPreview();
          persistActivePackState();
          return;
        }

        if (target.dataset.role === 'risk-input' && (target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) {
          const riskId = target.dataset.riskId || '';
          if (!riskId) return;
          state.riskInputs[riskId] = target.value;
          if (!state.selectedRisks.has(riskId)) {
            state.selectedRisks.add(riskId);
          }
          renderPreview();
          persistActivePackState();
          return;
        }

        if (target.dataset.role === 'risk-calc-input' && (target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) {
          const riskId = target.dataset.riskId || '';
          const fieldId = target.dataset.fieldId || '';
          if (!riskId || !fieldId) return;

          const existing = state.riskInputs[riskId];
          const next = (existing && typeof existing === 'object' && !Array.isArray(existing)) ? { ...existing } : {};
          next[fieldId] = target instanceof HTMLInputElement && target.type === 'checkbox'
            ? target.checked
            : target.value;

          state.riskInputs[riskId] = next;
          state.selectedRisks.add(riskId);
          renderRiskTools();
          renderCounts();
          renderPreview();
          persistActivePackState();
        }
      });

      els.riskContainer.addEventListener('input', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
        if (target.dataset.role !== 'risk-calc-input') return;

        const riskId = target.dataset.riskId || '';
        const fieldId = target.dataset.fieldId || '';
        if (!riskId || !fieldId) return;

        const existing = state.riskInputs[riskId];
        const next = (existing && typeof existing === 'object' && !Array.isArray(existing)) ? { ...existing } : {};
        next[fieldId] = target instanceof HTMLInputElement && target.type === 'checkbox'
          ? target.checked
          : target.value;

        state.riskInputs[riskId] = next;
        state.selectedRisks.add(riskId);
        renderPreview();
        persistActivePackState();
      });
    }

    if (els.ddxSelectAllBtn) {
      els.ddxSelectAllBtn.addEventListener('click', selectAllDdx);
    }

    if (els.ddxClearAllBtn) {
      els.ddxClearAllBtn.addEventListener('click', clearAllDdx);
    }

    if (els.copyFullBtn) {
      els.copyFullBtn.addEventListener('click', () => {
        if (!state.activePack) return;
        copyTextWithFeedback(buildPreviewText(state.activePack), els.copyFullBtn);
      });
    }

    if (els.copyDdxBtn) {
      els.copyDdxBtn.addEventListener('click', () => {
        if (!state.activePack) return;
        copyTextWithFeedback(buildDdxText(state.activePack), els.copyDdxBtn);
      });
    }

    if (els.copyRuleoutsBtn) {
      els.copyRuleoutsBtn.addEventListener('click', () => {
        copyTextWithFeedback(buildRuleoutsText(), els.copyRuleoutsBtn);
      });
    }

    if (els.resetBtn) {
      els.resetBtn.addEventListener('click', resetCurrentPackToDefaults);
    }

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const inside = target.closest('.slash-command-shell');
      if (!inside) {
        closeSuggestions();
      }
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
  }

  async function init() {
    bindEvents();

    if (!window.ER_MDM_RISK) {
      updateStatus('Risk engine not loaded. Check mdm_risk_engine.js include.', 'warn');
      return;
    }

    try {
      await loadPacks();
    } catch (error) {
      updateStatus(error.message, 'warn');
      if (els.preview) {
        els.preview.value = 'Failed to load MDM packs.';
      }
      return;
    }

    loadSavedState();
    loadCommandUsage();
    buildPackAliasMap();
    buildCommandCatalog();

    const hash = normalizeAlias(window.location.hash.replace(/^#/, ''));
    if (hash && state.aliasToPack.has(hash)) {
      selectPack(state.aliasToPack.get(hash), { skipPersist: true });
    } else if (state.savedActivePackId && state.packById.has(state.savedActivePackId)) {
      selectPack(state.savedActivePackId, { skipPersist: true });
    } else {
      selectPack(state.packs[0].id, { skipPersist: true });
    }

    updateSuggestionsFromInput();
    updateStatus('Slash workspace ready. Try /ddxcp or /help.', 'ok');
  }

  init();
})();
