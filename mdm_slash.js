(function () {
  'use strict';

  const GROUP_ORDER = ['Life-threatening', 'Common', 'Other'];
  const STORAGE_KEY = 'kp_mdm_builder_state_v3';
  const LEGACY_STORAGE_KEYS = ['kp_mdm_builder_state_v2'];
  const EDITOR_STORAGE_KEY = 'kp_mdm_slash_editor_state_v1';
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
    editor: document.getElementById('slashEditor'),
    editorShell: document.getElementById('slashEditorShell'),
    suggestions: document.getElementById('slashSuggestions'),
    status: document.getElementById('slashStatus'),
    ddxContainer: document.getElementById('slashDdxContainer'),
    ddxCount: document.getElementById('slashDdxCount'),
    ddxSelectAllBtn: document.getElementById('slashSelectAllDdxBtn'),
    ddxClearAllBtn: document.getElementById('slashClearAllDdxBtn'),
    ruleoutContainer: document.getElementById('slashRuleoutContainer'),
    ruleoutCount: document.getElementById('slashRuleoutCount'),
    riskContainer: document.getElementById('slashRiskContainer'),
    riskCount: document.getElementById('slashRiskCount'),
    copyFullBtn: document.getElementById('slashCopyFullBtn'),
    copyDdxBtn: document.getElementById('slashCopyDdxBtn'),
    copyRuleoutsBtn: document.getElementById('slashCopyRuleoutsBtn'),
    resetBtn: document.getElementById('slashResetBtn'),
    clearDraftBtn: document.getElementById('slashClearDraftBtn'),
    historyContainer: document.getElementById('slashHistoryContainer'),
    historyCount: document.getElementById('slashHistoryCount'),
    historyEmpty: document.getElementById('slashHistoryEmpty'),
    copySynthBtn: document.getElementById('slashCopySynthBtn')
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
    savedActivePackId: '',
    editorText: '',
    activeTokenRange: null,
    inlineDdxPicker: {
      active: false,
      packId: '',
      command: '',
      tokenRange: null,
      tokenConsumed: false,
      expandedLabel: ''
    },
    historyQuestions: null,
    historyLoaded: false,
    historyLoading: false,
    historyLoadError: '',
    historyAnswers: {},
    historyQuestionMeta: Object.create(null),
    historyExpandedDdx: new Set()
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

  function loadEditorDraft() {
    const storage = safeLocalStorage();
    if (!storage) return;
    try {
      const raw = storage.getItem(EDITOR_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return;
      const text = typeof parsed.editorText === 'string' ? parsed.editorText : '';
      state.editorText = text;
      if (els.editor) {
        els.editor.value = text;
      }
    } catch (e) {
      state.editorText = '';
    }
  }

  function saveEditorDraft() {
    const storage = safeLocalStorage();
    if (!storage || !els.editor) return;
    const payload = {
      editorText: els.editor.value || '',
      timestamp: new Date().toISOString()
    };
    try {
      storage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // ignore save failures
    }
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
      historyAnswers: state.historyAnswers && typeof state.historyAnswers === 'object'
        ? { ...state.historyAnswers }
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

  function buildSynthesizedMdm(pack) {
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

    const historySummary = buildHistorySummaryText();
    if (historySummary) {
      lines.push('');
      lines.push('History highlights:');
      historySummary.split('\n').forEach((line) => {
        lines.push(line);
      });
    }

    const editorText = (els.editor ? els.editor.value : '').trim();
    if (editorText) {
      lines.push('');
      lines.push('Additional notes:');
      lines.push(editorText);
    }

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

    const engine = window.ER_MDM_RISK;
    els.riskContainer.innerHTML = visible.map((toggle) => {
      const isChecked = state.selectedRisks.has(toggle.id);
      const checked = isChecked ? 'checked' : '';
      const open = isChecked || state.openRiskTools.has(toggle.id) ? ' open' : '';
      const content = toggle.calculator && toggle.calculator.type
        ? renderRiskCalculator(toggle, isChecked)
        : renderRiskInput(toggle, isChecked);

      const criteria = engine && engine.getCriteriaForToggle ? engine.getCriteriaForToggle(toggle) : null;
      const criteriaHtml = criteria
        ? '<ul class="risk-criteria-list">' + criteria.map(c => '<li>' + escapeHtml(c) + '</li>').join('') + '</ul>'
        : '';

      return `
        <details class="risk-row" id="slash-risk-${escapeHtml(toggle.id)}" data-risk-tool-id="${escapeHtml(toggle.id)}"${open}>
          <summary>
            <label class="check-row" onclick="event.stopPropagation()">
              <input type="checkbox" data-role="risk" data-risk-id="${escapeHtml(toggle.id)}" ${checked}>
              <span>${escapeHtml(toggle.label)}</span>
            </label>
            <span class="chevron" aria-hidden="true"></span>
          </summary>
          ${criteriaHtml}
          ${content}
        </details>
      `;
    }).join('');
  }

  // ── History Helper ──────────────────────────────────────────────

  async function loadHistoryQuestionsIfNeeded() {
    if (state.historyLoaded || state.historyLoading) return;
    state.historyLoading = true;
    state.historyLoadError = '';
    try {
      const response = await fetch('history_helper.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load history_helper.json');
      state.historyQuestions = await response.json();
      indexHistoryQuestions();
      state.historyLoaded = true;
    } catch (e) {
      state.historyLoadError = 'History helper data failed to load.';
      state.historyQuestionMeta = Object.create(null);
    } finally {
      state.historyLoading = false;
      if (state.historyLoaded && state.activePack) {
        syncAllHistoryAnswersToMdm();
        renderAll();
      } else {
        renderHistoryHelper();
      }
    }
  }

  function indexHistoryQuestions() {
    state.historyQuestionMeta = Object.create(null);
    const packs = state.historyQuestions && state.historyQuestions.packs && typeof state.historyQuestions.packs === 'object'
      ? state.historyQuestions.packs : {};

    Object.keys(packs).forEach((packId) => {
      const packData = packs[packId];
      if (!packData || typeof packData !== 'object' || !packData.ddx_questions) return;
      Object.keys(packData.ddx_questions).forEach((ddxLabel) => {
        const questions = packData.ddx_questions[ddxLabel];
        if (!Array.isArray(questions)) return;
        questions.forEach((q) => {
          if (!q || typeof q !== 'object') return;
          const qId = String(q.id || '').trim();
          if (!qId) return;
          state.historyQuestionMeta[qId] = {
            id: qId,
            packId: packId,
            ddxLabel: String(ddxLabel || ''),
            text: String(q.text || ''),
            category: String(q.category || '')
          };
        });
      });
    });
  }

  function getHistoryRiskToolTags(meta) {
    const engine = window.ER_MDM_RISK;
    if (!engine || !engine.inferHistoryRiskMappings) return [];
    const mappings = engine.inferHistoryRiskMappings(meta);
    if (!mappings.length) return [];

    const labels = engine.HISTORY_RISK_TOOL_LABELS || {};
    const seen = new Set();
    const tags = [];
    mappings.forEach((mapping) => {
      const calcType = String(mapping.calcType || '').trim();
      if (!calcType || seen.has(calcType)) return;
      seen.add(calcType);
      const label = labels[calcType];
      if (label && label.short) {
        tags.push({ short: label.short, title: label.full || label.short, calcType });
      } else {
        const fallback = calcType.toUpperCase().replace(/_/g, '-');
        tags.push({ short: fallback, title: fallback, calcType });
      }
    });
    return tags;
  }

  function setHistorySyncedCalculatorField(pack, calcType, fieldId, value) {
    if (!pack || !calcType || !fieldId) return false;
    const packToggles = Array.isArray(pack.risk_toggles) ? pack.risk_toggles : [];
    const nextValue = Boolean(value);
    let changed = false;

    packToggles.forEach((toggle) => {
      if (!toggle.calculator || toggle.calculator.type !== calcType) return;
      const inputs = ensureCalculatorInputState(toggle);
      if (Boolean(inputs[fieldId]) !== nextValue) {
        inputs[fieldId] = nextValue;
        changed = true;
      }
      if (nextValue) {
        state.selectedRisks.add(toggle.id);
      }
    });

    return changed;
  }

  function syncHistoryAnswerToMdm(questionId, answer) {
    if (!state.activePack || !questionId) return;
    const meta = state.historyQuestionMeta[questionId];
    if (!meta || meta.packId !== state.activePack.id) return;

    if (answer === 'yes' && meta.ddxLabel) {
      const hasDdx = (state.activePack.ddx || []).some((item) => item.label === meta.ddxLabel);
      if (hasDdx) {
        state.selectedDdx.add(meta.ddxLabel);
      }
    }

    syncRuleouts(state.activePack, { autoSelectNew: true });
    syncRiskToggles(state.activePack);

    const engine = window.ER_MDM_RISK;
    if (!engine || !engine.inferHistoryRiskMappings) return;
    const mappings = engine.inferHistoryRiskMappings(meta);
    if (!mappings.length) return;
    const nextValue = answer === 'yes';
    const packToggles = Array.isArray(state.activePack.risk_toggles) ? state.activePack.risk_toggles : [];
    mappings.forEach((mapping) => {
      setHistorySyncedCalculatorField(state.activePack, mapping.calcType, mapping.fieldId, nextValue);
      if (nextValue) {
        packToggles.forEach((toggle) => {
          if (toggle.calculator) return;
          const ct = mapping.calcType;
          if (toggle.id === ct || toggle.id.includes(ct)) {
            state.selectedRisks.add(toggle.id);
          }
        });
      }
    });
  }

  function syncAllHistoryAnswersToMdm() {
    if (!state.activePack || !state.historyLoaded || !state.historyQuestions) return;
    clearHistorySyncedRiskInputsForActivePack();
    Object.keys(state.historyAnswers || {}).forEach((qId) => {
      const answer = state.historyAnswers[qId];
      if (answer === 'yes' || answer === 'no') {
        syncHistoryAnswerToMdm(qId, answer);
      } else {
        syncHistoryAnswerToMdm(qId, '');
      }
    });
  }

  function clearHistorySyncedRiskInputsForActivePack() {
    if (!state.activePack || !state.historyLoaded || !state.historyQuestions) return;
    const packData = state.historyQuestions.packs[state.activePack.id];
    if (!packData || !packData.ddx_questions) return;
    const engine = window.ER_MDM_RISK;
    if (!engine || !engine.inferHistoryRiskMappings) return;

    const seen = new Set();
    Object.keys(packData.ddx_questions).forEach((ddxLabel) => {
      const questions = packData.ddx_questions[ddxLabel];
      if (!Array.isArray(questions)) return;
      questions.forEach((q) => {
        if (!q || typeof q !== 'object') return;
        const meta = {
          id: String(q.id || ''),
          ddxLabel,
          text: String(q.text || ''),
          category: String(q.category || '')
        };
        engine.inferHistoryRiskMappings(meta).forEach((mapping) => {
          const key = mapping.calcType + ':' + mapping.fieldId;
          if (seen.has(key)) return;
          seen.add(key);
          setHistorySyncedCalculatorField(state.activePack, mapping.calcType, mapping.fieldId, false);
        });
      });
    });
  }

  function renderHistoryHelper() {
    if (!els.historyContainer) return;
    const pack = state.activePack;
    if (!pack) {
      els.historyContainer.innerHTML = '';
      if (els.historyEmpty) els.historyEmpty.style.display = '';
      if (els.historyCount) els.historyCount.textContent = '0 answered';
      return;
    }

    if (els.historyEmpty) els.historyEmpty.style.display = 'none';
    if (state.historyLoading) {
      els.historyContainer.innerHTML = '<p class="empty-block">Loading history questions...</p>';
      if (els.historyCount) els.historyCount.textContent = '0 answered';
      return;
    }

    if (state.historyLoadError) {
      els.historyContainer.innerHTML = '<p class="empty-block">' + escapeHtml(state.historyLoadError) + '</p>';
      if (els.historyCount) els.historyCount.textContent = '0 answered';
      return;
    }

    if (!state.historyLoaded || !state.historyQuestions) {
      els.historyContainer.innerHTML = '';
      if (els.historyEmpty) els.historyEmpty.style.display = '';
      if (els.historyCount) els.historyCount.textContent = '0 answered';
      return;
    }

    const packData = state.historyQuestions.packs[pack.id];
    if (!packData || !packData.ddx_questions) {
      els.historyContainer.innerHTML = '<p class="empty-block">No history questions for this pack yet.</p>';
      if (els.historyCount) els.historyCount.textContent = '0 answered';
      return;
    }

    const ddxItems = pack.ddx || [];
    const groups = Object.create(null);
    ddxItems.forEach((item) => {
      const g = item.group || 'Other';
      if (!groups[g]) groups[g] = [];
      groups[g].push(item);
    });

    const orderedGroups = [
      ...GROUP_ORDER.filter((g) => groups[g]),
      ...Object.keys(groups).filter((g) => !GROUP_ORDER.includes(g))
    ];

    let totalAnswered = 0;
    let totalQuestions = 0;

    const html = orderedGroups.map((group) => {
      const items = groups[group] || [];
      const ddxSections = items.map((ddxItem) => {
        const questions = packData.ddx_questions[ddxItem.label];
        if (!questions || !questions.length) return '';

        totalQuestions += questions.length;
        let answeredForDdx = 0;
        const questionRows = questions.map((q) => {
          const answer = state.historyAnswers[q.id] || '';
          if (answer && answer !== '') {
            totalAnswered++;
            answeredForDdx++;
          }

          const rowClass = answer === 'yes' ? 'answered-yes' :
                           answer === 'no' ? 'answered-no' :
                           answer === 'skip' ? 'answered-skip' : '';

          const yesActive = answer === 'yes' ? ' active-yes' : '';
          const noActive = answer === 'no' ? ' active-no' : '';
          const skipActive = answer === 'skip' ? ' active-skip' : '';

          const catTag = q.category
            ? ' <span class="hh-category-tag">' + escapeHtml(q.category) + '</span>'
            : '';

          const questionMeta = {
            id: String(q.id || ''),
            ddxLabel: String(ddxItem.label || ''),
            text: String(q.text || ''),
            category: String(q.category || '')
          };
          const riskToolTags = getHistoryRiskToolTags(questionMeta);
          const riskTag = riskToolTags.map((tag) => {
            let toggleId = '';
            const packToggles = Array.isArray(pack.risk_toggles) ? pack.risk_toggles : [];
            const matchedToggle = packToggles.find((t) => {
              if (t.calculator && t.calculator.type === tag.calcType) return true;
              if (t.id === tag.calcType) return true;
              if (t.id.includes(tag.calcType)) return true;
              return false;
            });
            if (matchedToggle) toggleId = matchedToggle.id;
            const jumpAttr = toggleId ? ' data-jump-to-risk="' + escapeHtml(toggleId) + '"' : '';
            return ' <button class="hh-risk-tag"' + jumpAttr + ' title="Jump to ' + escapeHtml(tag.title) + '" type="button">' + escapeHtml(tag.short) + '</button>';
          }).join('');

          return '<div class="hh-question ' + rowClass + '">' +
            '<span class="hh-question-text">' + escapeHtml(q.text) + catTag + riskTag + '</span>' +
            '<div class="hh-actions">' +
              '<button class="hh-btn' + yesActive + '" data-question-id="' + escapeHtml(q.id) + '" data-ddx-label="' + escapeHtml(ddxItem.label) + '" data-answer="yes" type="button">Yes</button>' +
              '<button class="hh-btn' + noActive + '" data-question-id="' + escapeHtml(q.id) + '" data-ddx-label="' + escapeHtml(ddxItem.label) + '" data-answer="no" type="button">No</button>' +
              '<button class="hh-btn' + skipActive + '" data-question-id="' + escapeHtml(q.id) + '" data-ddx-label="' + escapeHtml(ddxItem.label) + '" data-answer="skip" type="button">Skip</button>' +
            '</div>' +
          '</div>';
        }).join('');

        const ddxKey = String(ddxItem.label || '');
        const isOpen = state.historyExpandedDdx.has(ddxKey);
        return '<details class="hh-ddx-section" data-history-ddx="' + escapeHtml(ddxKey) + '"' + (isOpen ? ' open' : '') + '>' +
          '<summary class="hh-ddx-summary">' +
            '<span class="hh-ddx-label">' + escapeHtml(ddxItem.label) + '</span>' +
            '<span class="hh-ddx-count">' + answeredForDdx + '/' + questions.length + ' answered</span>' +
          '</summary>' +
          '<div class="hh-ddx-body">' + questionRows + '</div>' +
        '</details>';
      }).filter(Boolean).join('');

      if (!ddxSections) return '';
      return '<div class="section-subgroup"><h4>' + escapeHtml(group) + '</h4>' + ddxSections + '</div>';
    }).filter(Boolean).join('');

    els.historyContainer.innerHTML = html || '<p class="empty-block">No questions available.</p>';
    if (els.historyCount) {
      els.historyCount.textContent = totalAnswered + '/' + totalQuestions + ' answered';
    }
  }

  function buildHistorySummaryText() {
    if (!state.activePack || !state.historyLoaded || !state.historyQuestions) return '';
    const packData = state.historyQuestions.packs[state.activePack.id];
    if (!packData || !packData.ddx_questions) return '';

    const lines = [];
    const ddxItems = state.activePack.ddx || [];
    ddxItems.forEach((ddxItem) => {
      const questions = packData.ddx_questions[ddxItem.label];
      if (!questions || !questions.length) return;

      const answered = questions.filter((q) => state.historyAnswers[q.id] && state.historyAnswers[q.id] !== 'skip');
      if (!answered.length) return;

      lines.push(ddxItem.label + ':');
      answered.forEach((q) => {
        const ans = state.historyAnswers[q.id];
        const prefix = ans === 'yes' ? '[+]' : '[-]';
        lines.push('  ' + prefix + ' ' + q.text);
      });
      lines.push('');
    });

    return lines.join('\n').trim() || '';
  }

  // ── End History Helper ────────────────────────────────────────────

  function renderPreview() {
    if (!els.editor) return;
    state.editorText = els.editor.value || '';
  }

  function renderAll() {
    renderPackSelect();
    renderPackChips();
    renderDdx();
    renderRuleouts();
    renderRiskTools();
    renderHistoryHelper();
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
    state.historyAnswers = {};
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

    state.historyAnswers = saved.historyAnswers && typeof saved.historyAnswers === 'object'
      ? { ...saved.historyAnswers }
      : {};

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

      // /hx command for history helper
      addCommandItem({
        type: 'history',
        command: `/hx${preferred}`,
        packId: pack.id,
        label: `History Helper: ${pack.title}`,
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
        addCommandItem({
          type: 'history',
          command: `/hx${alias}`,
          packId: pack.id,
          label: `History Helper: ${pack.title}`,
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

  function resetInlineDdxPicker() {
    state.inlineDdxPicker.active = false;
    state.inlineDdxPicker.packId = '';
    state.inlineDdxPicker.command = '';
    state.inlineDdxPicker.tokenRange = null;
    state.inlineDdxPicker.tokenConsumed = false;
    state.inlineDdxPicker.expandedLabel = '';
  }

  function resolvePackFromDdxToken(token) {
    const command = normalizeCommandText(token);
    if (!command.startsWith('/ddx')) return null;

    const body = command.replace(/^\//, '');
    const parts = body.split(/\s+/).filter(Boolean);
    if (!parts.length) return null;

    const first = parts[0].toLowerCase();
    if (!first.startsWith('ddx')) return null;

    let alias = normalizeAlias(first.slice(3));
    if (!alias && parts[1]) {
      alias = normalizeAlias(parts.slice(1).join(' '));
    }
    if (!alias) return null;

    const packId = state.aliasToPack.get(alias);
    if (!packId) return null;
    return { packId, command: `/ddx${alias}` };
  }

  function openInlineDdxPicker(tokenInfo, packId, commandText) {
    if (!tokenInfo || !packId) return;
    const pack = state.packById.get(packId);
    if (!pack) return;

    if (!state.inlineDdxPicker.active || state.inlineDdxPicker.packId !== packId) {
      state.inlineDdxPicker.tokenConsumed = false;
    }

    if (!state.activePack || state.activePack.id !== packId) {
      selectPack(packId);
    }

    state.inlineDdxPicker.active = true;
    state.inlineDdxPicker.packId = packId;
    state.inlineDdxPicker.command = commandText || '';
    state.inlineDdxPicker.tokenRange = { ...tokenInfo };
    state.activeTokenRange = { ...tokenInfo };
    state.suggestions = [];
    state.activeSuggestionIndex = -1;

    const prechecked = (state.activePack && Array.isArray(state.activePack.ddx))
      ? state.activePack.ddx
          .map((item) => item.label)
          .filter((label) => state.selectedDdx.has(label))
      : [];
    if (prechecked.length && !state.inlineDdxPicker.tokenConsumed) {
      const insertion = prechecked
        .map((label) => buildDdxInsertionText(label))
        .filter((snippet) => !editorContainsSnippet(snippet))
        .filter(Boolean)
        .join('\n');
      if (insertion) {
        state.activeTokenRange = { ...tokenInfo };
        replaceActiveTokenInEditor(insertion);
        state.inlineDdxPicker.tokenConsumed = true;
        state.inlineDdxPicker.tokenRange = null;
      }
    }
  }

  function getRiskTogglesForDdx(pack, ddxItem) {
    if (!pack || !ddxItem) return [];
    const itemTags = new Set((ddxItem.tags || []).map((tag) => String(tag)));

    return (pack.risk_toggles || []).filter((toggle) => {
      const required = Array.isArray(toggle.tags_required) ? toggle.tags_required : [];
      if (!required.length) return true;
      if (!itemTags.size) return false;
      return required.some((tag) => itemTags.has(String(tag)));
    });
  }

  function getInlineRiskScoreText(toggle) {
    const engine = window.ER_MDM_RISK;
    if (!toggle) return '';

    if (toggle.calculator && toggle.calculator.type && engine && typeof engine.evaluate === 'function') {
      const values = ensureCalculatorInputState(toggle);
      const result = engine.evaluate(toggle.calculator.type, values);
      return normalizeLabel(result.preview || result.interpretation || '');
    }

    if (state.selectedRisks.has(toggle.id)) {
      return 'selected';
    }
    return 'off';
  }

  function buildInlineRiskSubmenu(pack, item, expanded) {
    if (!expanded) return '';
    const toggles = getRiskTogglesForDdx(pack, item);
    if (!toggles.length) {
      return '<div class="inline-risk-empty">No associated risk tools for this diagnosis.</div>';
    }

    const rows = toggles.map((toggle) => {
      const checked = state.selectedRisks.has(toggle.id) ? 'checked' : '';
      const score = getInlineRiskScoreText(toggle);
      return `
        <label class="inline-risk-row">
          <input type="checkbox" data-role="inline-ddx-risk" data-risk-id="${escapeHtml(toggle.id)}" ${checked}>
          <span class="inline-risk-main">
            <span class="inline-risk-label">${escapeHtml(toggle.label)}</span>
            <span class="inline-risk-score">${escapeHtml(score)}</span>
          </span>
        </label>
      `;
    }).join('');

    return `<div class="inline-risk-submenu">${rows}</div>`;
  }

  function buildInlineDdxRows(pack) {
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

    return orderedGroups.map((group) => {
      const rows = (groups[group] || []).map((item) => {
        const isExpanded = state.inlineDdxPicker.expandedLabel === item.label;
        const checked = state.selectedDdx.has(item.label) ? 'checked' : '';
        const toggles = getRiskTogglesForDdx(pack, item);
        const hasTools = toggles.length > 0;
        const ids = Array.isArray(item.ruleouts)
          ? item.ruleouts.map((id) => normalizeId(id)).filter(Boolean)
          : [];
        const tokens = ids.length ? ids.map((id) => formatDotphrase(id)).join(', ') : 'No linked rule-out';
        return `
          <div class="inline-ddx-row${isExpanded ? ' expanded' : ''}" data-role="inline-ddx-row" data-label="${escapeHtml(item.label)}">
            <label class="inline-ddx-check">
              <input type="checkbox" data-role="inline-ddx-item" data-label="${escapeHtml(item.label)}" ${checked}>
              <span class="inline-ddx-main">
                <span class="inline-ddx-label">${escapeHtml(item.label)}</span>
                <span class="inline-ddx-meta">${escapeHtml(tokens)}</span>
              </span>
            </label>
            <button type="button" class="inline-ddx-expand${hasTools ? '' : ' disabled'}" data-role="inline-ddx-expand" data-label="${escapeHtml(item.label)}" ${hasTools ? '' : 'disabled'}>
              ${hasTools ? 'Risk tools' : 'No risk tools'}
            </button>
            ${buildInlineRiskSubmenu(pack, item, isExpanded)}
          </div>
        `;
      }).join('');

      return `
        <section class="inline-ddx-group">
          <h4>${escapeHtml(group)}</h4>
          <div class="inline-ddx-grid">${rows}</div>
        </section>
      `;
    }).join('');
  }

  function renderSuggestions() {
    if (!els.suggestions) return;

    if (state.inlineDdxPicker.active) {
      const pack = state.packById.get(state.inlineDdxPicker.packId) || state.activePack;
      if (!pack) {
        resetInlineDdxPicker();
        els.suggestions.innerHTML = '';
        els.suggestions.hidden = true;
        return;
      }

      els.suggestions.hidden = false;
      els.suggestions.innerHTML = `
        <li class="inline-ddx-head">
          <div>
            <div class="inline-ddx-title">${escapeHtml(pack.title)} Differential</div>
            <div class="inline-ddx-subtitle">Check diagnoses to auto-link rule-outs and insert dotphrase text.</div>
          </div>
          <div class="inline-ddx-actions">
            <button type="button" class="inline-ddx-btn" data-role="inline-ddx-select-all">All</button>
            <button type="button" class="inline-ddx-btn" data-role="inline-ddx-clear-all">None</button>
            <button type="button" class="inline-ddx-btn primary" data-role="inline-ddx-done">Done</button>
          </div>
        </li>
        <li class="inline-ddx-body">${buildInlineDdxRows(pack)}</li>
      `;
    } else {
      const list = state.suggestions;
      if (!list.length) {
        els.suggestions.innerHTML = '';
        els.suggestions.hidden = true;
        state.activeTokenRange = null;
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

    if (!els.editor || !els.editorShell) return;
    const anchorPos = state.inlineDdxPicker.active
      ? (Number.isFinite(els.editor.selectionStart) ? els.editor.selectionStart : (els.editor.value || '').length)
      : (state.activeTokenRange ? state.activeTokenRange.end : null);
    if (!Number.isFinite(anchorPos)) return;

    const caretPos = getCaretCoordinates(els.editor, anchorPos);
    const shellRect = els.editorShell.getBoundingClientRect();
    const editorRect = els.editor.getBoundingClientRect();
    const rawLeft = (editorRect.left - shellRect.left) + caretPos.left - els.editor.scrollLeft;
    const rawTop = (editorRect.top - shellRect.top) + caretPos.top - els.editor.scrollTop + caretPos.height + 6;

    const maxLeft = Math.max(8, els.editorShell.clientWidth - els.suggestions.offsetWidth - 8);
    const maxTop = Math.max(8, els.editorShell.clientHeight - els.suggestions.offsetHeight - 8);
    const left = Math.max(8, Math.min(rawLeft, maxLeft));
    const top = Math.max(8, Math.min(rawTop, maxTop));

    els.suggestions.style.left = `${left}px`;
    els.suggestions.style.top = `${top}px`;
  }

  function getSlashTokenAtCaret() {
    if (!els.editor) return null;
    const value = els.editor.value || '';
    const caret = Number.isFinite(els.editor.selectionStart) ? els.editor.selectionStart : value.length;
    const upto = value.slice(0, caret);
    const start = upto.lastIndexOf('/');
    if (start < 0) return null;
    if (start > 0 && !/\s/.test(upto.charAt(start - 1))) return null;
    const token = upto.slice(start);
    if (!token.startsWith('/')) return null;
    if (/[\r\n]/.test(token)) return null;
    return {
      token,
      start,
      end: caret
    };
  }

  function getCaretCoordinates(textarea, position) {
    const div = document.createElement('div');
    const style = window.getComputedStyle(textarea);
    const properties = [
      'boxSizing', 'width', 'height',
      'overflowX', 'overflowY',
      'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
      'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize',
      'fontSizeAdjust', 'lineHeight', 'fontFamily', 'textAlign', 'textTransform',
      'textIndent', 'textDecoration', 'letterSpacing', 'wordSpacing'
    ];

    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordWrap = 'break-word';
    div.style.top = '-9999px';
    properties.forEach((prop) => {
      div.style[prop] = style[prop];
    });

    div.textContent = textarea.value.substring(0, position);
    const span = document.createElement('span');
    span.textContent = textarea.value.substring(position) || '.';
    div.appendChild(span);
    document.body.appendChild(div);
    const coords = {
      top: span.offsetTop,
      left: span.offsetLeft,
      height: Number.parseFloat(style.lineHeight) || 18
    };
    document.body.removeChild(div);
    return coords;
  }

  function updateSuggestionsFromEditor() {
    const tokenInfo = getSlashTokenAtCaret();
    if (!tokenInfo) {
      closeSuggestions();
      return;
    }

    const inlinePack = resolvePackFromDdxToken(tokenInfo.token);
    if (inlinePack) {
      openInlineDdxPicker(tokenInfo, inlinePack.packId, inlinePack.command);
      renderSuggestions();
      return;
    }

    if (state.inlineDdxPicker.active) {
      resetInlineDdxPicker();
    }

    state.activeTokenRange = tokenInfo;
    state.suggestions = buildSuggestions(tokenInfo.token);
    state.activeSuggestionIndex = state.suggestions.length ? 0 : -1;
    renderSuggestions();
  }

  function getSuggestionByIndex(index) {
    if (index < 0 || index >= state.suggestions.length) return null;
    return state.suggestions[index] || null;
  }

  function closeSuggestions() {
    resetInlineDdxPicker();
    state.suggestions = [];
    state.activeSuggestionIndex = -1;
    state.activeTokenRange = null;
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
    return {
      ok: true,
      id,
      enabled: state.selectedRuleouts.has(id)
    };
  }

  function findVisibleRiskToggleByQuery(query) {
    if (!state.activePack) return null;
    const q = normalizeAlias(query);
    if (!q) return null;
    const visible = getVisibleRiskToggles(state.activePack);
    if (!visible.length) return null;
    return visible.find((toggle) => {
      const label = normalizeAlias(toggle.label);
      const id = normalizeAlias(toggle.id);
      const calc = toggle.calculator && toggle.calculator.type ? normalizeAlias(toggle.calculator.type) : '';
      return label.includes(q) || id.includes(q) || calc.includes(q);
    }) || null;
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

    const match = findVisibleRiskToggleByQuery(query);

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
    return match;
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

  function findDdxItemByLabel(label) {
    if (!state.activePack) return null;
    return (state.activePack.ddx || []).find((item) => item.label === label) || null;
  }

  function buildDdxInsertionText(label) {
    const item = findDdxItemByLabel(label);
    if (!item) return '';

    const seen = new Set();
    const lines = [];
    (item.ruleouts || []).forEach((rawId) => {
      const id = normalizeId(rawId);
      if (!id || seen.has(id)) return;
      seen.add(id);
      const lookup = phraseLookup(id);
      lines.push(lookup.exists ? normalizeLabel(lookup.text) : formatDotphrase(id));
    });

    if (!lines.length) {
      lines.push(`${item.label} considered.`);
    }

    return lines.join('\n');
  }

  function editorContainsSnippet(snippet) {
    if (!els.editor || !snippet) return false;
    return (els.editor.value || '').includes(snippet);
  }

  function normalizeEditorWhitespace(value) {
    return String(value || '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+\n/g, '\n');
  }

  function removeSnippetFromEditor(snippet) {
    if (!els.editor || !snippet) return false;
    const value = els.editor.value || '';
    const targets = [
      `\n${snippet}\n`,
      `\n${snippet}`,
      `${snippet}\n`,
      snippet
    ];

    for (let i = 0; i < targets.length; i += 1) {
      const block = targets[i];
      const idx = value.indexOf(block);
      if (idx < 0) continue;
      const before = value.slice(0, idx);
      const after = value.slice(idx + block.length);
      const merged = normalizeEditorWhitespace(before + after);
      els.editor.value = merged;
      const caret = Math.min(idx, merged.length);
      els.editor.focus();
      els.editor.setSelectionRange(caret, caret);
      state.editorText = merged;
      saveEditorDraft();
      return true;
    }

    return false;
  }

  function insertTextAtCaret(text) {
    if (!els.editor || !text) return;
    const value = els.editor.value || '';
    const start = Number.isFinite(els.editor.selectionStart) ? els.editor.selectionStart : value.length;
    const end = Number.isFinite(els.editor.selectionEnd) ? els.editor.selectionEnd : start;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const prefix = before.length && !before.endsWith('\n') ? '\n' : '';
    const suffix = after.length && !after.startsWith('\n') ? '\n' : '';
    const payload = `${prefix}${text}${suffix}`;

    els.editor.value = `${before}${payload}${after}`;
    const caretPos = before.length + payload.length;
    els.editor.focus();
    els.editor.setSelectionRange(caretPos, caretPos);
    state.editorText = els.editor.value;
    saveEditorDraft();
  }

  function applyDdxSelection(label, isChecked, options) {
    if (!state.activePack || !label) return;
    const opts = options || {};
    const prevVisible = new Set(getVisibleRiskToggles(state.activePack).map((toggle) => toggle.id));

    if (isChecked) {
      state.selectedDdx.add(label);
    } else {
      state.selectedDdx.delete(label);
    }

    syncRuleouts(state.activePack, { autoSelectNew: true });
    syncRiskToggles(state.activePack, {
      autoEnableNew: isChecked,
      prevVisibleIds: prevVisible
    });

    renderAll();
    persistActivePackState();

    if (opts.insertOnCheck && isChecked) {
      const insertion = buildDdxInsertionText(label);
      if (insertion && !editorContainsSnippet(insertion)) {
        if (state.inlineDdxPicker.active && !state.inlineDdxPicker.tokenConsumed && state.inlineDdxPicker.tokenRange) {
          state.activeTokenRange = { ...state.inlineDdxPicker.tokenRange };
          replaceActiveTokenInEditor(insertion);
          state.inlineDdxPicker.tokenConsumed = true;
          state.inlineDdxPicker.tokenRange = null;
        } else {
          insertTextAtCaret(insertion);
        }
      }
    }

    if (!isChecked && opts.removeOnUncheck) {
      const insertion = buildDdxInsertionText(label);
      removeSnippetFromEditor(insertion);
    }

    if (opts.keepInlinePickerOpen && state.inlineDdxPicker.active) {
      renderSuggestions();
    }
  }

  function applyInlineRiskSelection(riskId, isChecked) {
    if (!state.activePack || !riskId) return;
    const visibleIds = new Set(getVisibleRiskToggles(state.activePack).map((toggle) => toggle.id));
    if (!visibleIds.has(riskId)) return;

    if (isChecked) {
      state.selectedRisks.add(riskId);
      state.openRiskTools.add(riskId);
    } else {
      state.selectedRisks.delete(riskId);
      state.openRiskTools.delete(riskId);
    }

    renderRiskTools();
    renderCounts();
    persistActivePackState();
    if (state.inlineDdxPicker.active) {
      renderSuggestions();
    }
  }

  function removeInlineDdxCommandTokenIfNeeded() {
    if (!state.inlineDdxPicker.active) return;
    if (state.inlineDdxPicker.tokenConsumed || !state.inlineDdxPicker.tokenRange) return;
    state.activeTokenRange = { ...state.inlineDdxPicker.tokenRange };
    replaceActiveTokenInEditor('');
    state.inlineDdxPicker.tokenConsumed = true;
    state.inlineDdxPicker.tokenRange = null;
  }

  function parseAndExecuteCommand(rawInput) {
    const raw = normalizeLabel(rawInput);
    if (!raw) return { ok: false };

    const command = normalizeCommandText(raw);
    const exact = state.commandByText.get(command);
    if (exact && exact.type === 'pack') {
      selectPack(exact.packId);
      updateStatus(`Loaded ${state.packById.get(exact.packId).title}.`, 'ok');
      recordCommandUsage(exact.command);
      return { ok: true, type: 'pack', command: exact.command, packId: exact.packId };
    }

    const body = command.replace(/^\//, '');
    const parts = body.split(/\s+/).filter(Boolean);
    if (!parts.length) return { ok: false };

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
        return { ok: false, type: 'pack', command };
      }

      selectPack(packId);
      updateStatus(`Loaded ${state.packById.get(packId).title}.`, 'ok');
      recordCommandUsage(`/ddx${alias}`);
      return { ok: true, type: 'pack', command: `/ddx${alias}`, packId };
    }

    if (first === 'ruleout') {
      const result = toggleRuleoutFromCommand(rest);
      if (result && result.ok) {
        recordCommandUsage(`/ruleout ${normalizeId(rest)}`);
      }
      return result || { ok: false, type: 'ruleout', command };
    }

    if (first === 'risk') {
      const match = focusRiskFromCommand(rest);
      if (match) {
        const token = normalizeAlias(rest);
        recordCommandUsage(`/risk ${token || normalizeLabel(rest).toLowerCase()}`);
        return {
          ok: true,
          type: 'risk',
          command,
          riskId: match.id,
          riskLabel: match.label
        };
      }
      return { ok: false, type: 'risk', command };
    }

    if (first.startsWith('hx')) {
      let alias = first.slice(2);
      if (!alias && rest) {
        alias = normalizeAlias(rest);
      }
      alias = normalizeAlias(alias);

      const packId = state.aliasToPack.get(alias);
      if (!packId) {
        updateStatus(`Unknown history alias: ${alias || '(none)'}.`, 'warn');
        return { ok: false, type: 'history', command };
      }

      selectPack(packId);
      loadHistoryQuestionsIfNeeded();

      // Open the utility drawer and scroll to history panel
      const drawer = document.querySelector('.utility-drawer');
      if (drawer && !drawer.open) drawer.open = true;
      setTimeout(() => {
        if (els.historyContainer) {
          els.historyContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);

      updateStatus(`History Helper opened for ${state.packById.get(packId).title}.`, 'ok');
      recordCommandUsage(`/hx${alias}`);
      return { ok: true, type: 'history', command: `/hx${alias}`, packId };
    }

    if (first === 'clear') {
      clearAllSelections();
      recordCommandUsage('/clear');
      return { ok: true, type: 'clear', command: '/clear' };
    }

    if (first === 'reset') {
      resetCurrentPackToDefaults();
      recordCommandUsage('/reset');
      return { ok: true, type: 'reset', command: '/reset' };
    }

    if (first === 'help') {
      updateStatus('Command help: /ddxcp, /ddxsob, /hxcp, /hxsob, /ruleout <id>, /risk <tool>, /clear, /reset', 'ok');
      recordCommandUsage('/help');
      return { ok: true, type: 'help', command: '/help' };
    }

    updateStatus(`Unknown command: ${command}`, 'warn');
    return { ok: false, type: 'unknown', command };
  }

  function buildPackInsertText(pack) {
    if (!pack) return '';
    const scaffold = normalizeLabel(pack.base_mdm_template)
      || 'Focused emergency evaluation completed with risk-stratified disposition.';
    return `MDM - ${pack.title}: ${scaffold}`;
  }

  function buildRiskInsertText(riskId) {
    if (!state.activePack || !riskId) return '';
    const toggle = (state.activePack.risk_toggles || []).find((entry) => entry.id === riskId);
    if (!toggle) return '';
    const engine = window.ER_MDM_RISK;

    if (toggle.calculator && toggle.calculator.type && engine && typeof engine.evaluate === 'function') {
      const values = ensureCalculatorInputState(toggle);
      const evalResult = engine.evaluate(toggle.calculator.type, values);
      if (toggle.sentence_template && evalResult.ready) {
        return applyTemplate(toggle.sentence_template, {
          score: evalResult.scoreText,
          interpretation: evalResult.interpretation,
          details: evalResult.details
        });
      }
      if (engine && typeof engine.renderCalcSummary === 'function') {
        return engine.renderCalcSummary(toggle.calculator.type, evalResult);
      }
    }

    if (toggle.sentence_template) {
      const value = typeof state.riskInputs[riskId] === 'undefined' ? '' : String(state.riskInputs[riskId]);
      const sentence = applyTemplate(toggle.sentence_template, { value });
      if (sentence) return sentence;
    }

    return toggle.label || '';
  }

  function buildCommandInsertText(result, rawCommand) {
    if (!result || !result.ok) return '';
    if (result.type === 'pack') {
      return buildPackInsertText(state.activePack);
    }
    if (result.type === 'ruleout') {
      if (!result.enabled) return '';
      const lookup = phraseLookup(result.id);
      return lookup.exists ? normalizeLabel(lookup.text) : formatDotphrase(result.id);
    }
    if (result.type === 'risk') {
      return buildRiskInsertText(result.riskId);
    }
    if (result.type === 'history') {
      return '';
    }
    if (result.type === 'help') {
      return 'Commands: /ddxcp /ddxsob /ddxabd /ddxha /hxcp /hxsob /ruleout <id> /risk <tool> /clear /reset';
    }
    if (result.type === 'clear' || result.type === 'reset') {
      return '';
    }
    return normalizeLabel(rawCommand);
  }

  function replaceActiveTokenInEditor(insertion) {
    if (!els.editor || !state.activeTokenRange) return;
    const text = els.editor.value || '';
    const start = state.activeTokenRange.start;
    const end = state.activeTokenRange.end;
    const before = text.slice(0, start);
    const after = text.slice(end);
    const needsNewline = insertion && !before.endsWith('\n') && before.length > 0 ? '\n' : '';
    const needsTrailingNewline = insertion && after && !after.startsWith('\n') ? '\n' : '';
    const payload = insertion ? `${needsNewline}${insertion}${needsTrailingNewline}` : '';

    els.editor.value = `${before}${payload}${after}`;
    const caretPos = before.length + payload.length;
    els.editor.focus();
    els.editor.setSelectionRange(caretPos, caretPos);
    state.editorText = els.editor.value;
    saveEditorDraft();
  }

  function applyInlineCommand(commandText) {
    const result = parseAndExecuteCommand(commandText);
    if (!result || !result.ok) return;
    const insertion = buildCommandInsertText(result, commandText);
    replaceActiveTokenInEditor(insertion);
    closeSuggestions();
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

    if (els.editor) {
      els.editor.addEventListener('input', () => {
        state.editorText = els.editor.value || '';
        saveEditorDraft();
        updateSuggestionsFromEditor();
      });

      els.editor.addEventListener('click', () => {
        updateSuggestionsFromEditor();
      });

      els.editor.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Enter' || event.key === 'Tab') return;
        updateSuggestionsFromEditor();
      });

      els.editor.addEventListener('scroll', () => {
        if (state.suggestions.length) {
          renderSuggestions();
        }
      });

      els.editor.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeSuggestions();
          return;
        }

        if (state.inlineDdxPicker.active) {
          return;
        }

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

        if (event.key === 'Tab' || event.key === 'Enter') {
          const tokenInfo = getSlashTokenAtCaret();
          if (!tokenInfo) return;
          const suggestion = getSuggestionByIndex(state.activeSuggestionIndex) || state.suggestions[0] || null;
          const commandToApply = suggestion ? suggestion.command : tokenInfo.token;
          event.preventDefault();
          state.activeTokenRange = tokenInfo;
          applyInlineCommand(commandToApply);
        }
      });
    }

    if (els.suggestions) {
      els.suggestions.addEventListener('mousedown', (event) => {
        event.preventDefault();
      });

      els.suggestions.addEventListener('change', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) return;
        if (target.dataset.role === 'inline-ddx-item') {
          const label = target.dataset.label || '';
          if (!label) return;
          applyDdxSelection(label, target.checked, {
            insertOnCheck: true,
            removeOnUncheck: true,
            keepInlinePickerOpen: true
          });
          return;
        }

        if (target.dataset.role === 'inline-ddx-risk') {
          const riskId = target.dataset.riskId || '';
          if (!riskId) return;
          applyInlineRiskSelection(riskId, target.checked);
        }
      });

      els.suggestions.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;

        const actionBtn = target.closest('[data-role]');
        if (actionBtn && state.inlineDdxPicker.active) {
          const role = actionBtn.getAttribute('data-role') || '';
          if (role === 'inline-ddx-done') {
            removeInlineDdxCommandTokenIfNeeded();
            closeSuggestions();
            return;
          }
          if (role === 'inline-ddx-expand' || role === 'inline-ddx-row') {
            const label = actionBtn.getAttribute('data-label') || '';
            if (!label) return;
            if (target instanceof HTMLInputElement && target.dataset.role === 'inline-ddx-item') {
              return;
            }
            state.inlineDdxPicker.expandedLabel = (state.inlineDdxPicker.expandedLabel === label) ? '' : label;
            renderSuggestions();
            return;
          }
          if (role === 'inline-ddx-select-all' && state.activePack) {
            (state.activePack.ddx || []).forEach((item) => {
              applyDdxSelection(item.label, true, {
                insertOnCheck: !state.selectedDdx.has(item.label),
                removeOnUncheck: true,
                keepInlinePickerOpen: false
              });
            });
            renderSuggestions();
            return;
          }
          if (role === 'inline-ddx-clear-all' && state.activePack) {
            (state.activePack.ddx || []).forEach((item) => {
              applyDdxSelection(item.label, false, {
                insertOnCheck: false,
                removeOnUncheck: true,
                keepInlinePickerOpen: false
              });
            });
            renderSuggestions();
            return;
          }
        }

        if (state.inlineDdxPicker.active) return;

        const row = target.closest('[data-suggestion-index]');
        if (!row || !els.editor) return;
        const index = Number.parseInt(row.getAttribute('data-suggestion-index') || '', 10);
        const suggestion = getSuggestionByIndex(index);
        if (!suggestion) return;
        state.activeSuggestionIndex = index;
        const tokenInfo = getSlashTokenAtCaret();
        if (!tokenInfo) return;
        state.activeTokenRange = tokenInfo;
        applyInlineCommand(suggestion.command);
      });
    }

    if (els.ddxContainer) {
      els.ddxContainer.addEventListener('change', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || target.dataset.role !== 'ddx' || !state.activePack) return;
        const label = target.dataset.label || '';
        if (!label) return;
        applyDdxSelection(label, target.checked, {
          insertOnCheck: true,
          removeOnUncheck: true
        });
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

    if (els.historyContainer) {
      els.historyContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        // History answer buttons (Yes/No/Skip)
        if (target.classList.contains('hh-btn') && target.dataset.questionId) {
          const qId = target.dataset.questionId;
          const answer = target.dataset.answer || '';
          const current = state.historyAnswers[qId] || '';
          // Toggle off if same answer clicked
          if (current === answer) {
            delete state.historyAnswers[qId];
            syncHistoryAnswerToMdm(qId, '');
          } else {
            state.historyAnswers[qId] = answer;
            syncHistoryAnswerToMdm(qId, answer);
          }
          renderAll();
          persistActivePackState();
          return;
        }

        // Jump-to-risk-tool tag
        if (target.classList.contains('hh-risk-tag') && target.dataset.jumpToRisk) {
          const riskId = target.dataset.jumpToRisk;
          const riskEl = document.getElementById('slash-risk-' + riskId);
          if (riskEl) {
            if (!riskEl.open) riskEl.open = true;
            state.openRiskTools.add(riskId);
            riskEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          return;
        }
      });

      // Track expanded DDx sections
      els.historyContainer.addEventListener('toggle', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLDetailsElement)) return;
        if (!target.dataset.historyDdx) return;
        const ddxKey = target.dataset.historyDdx;
        if (target.open) state.historyExpandedDdx.add(ddxKey);
        else state.historyExpandedDdx.delete(ddxKey);
      }, true);
    }

    if (els.ddxSelectAllBtn) {
      els.ddxSelectAllBtn.addEventListener('click', selectAllDdx);
    }

    if (els.ddxClearAllBtn) {
      els.ddxClearAllBtn.addEventListener('click', clearAllDdx);
    }

    if (els.copySynthBtn) {
      els.copySynthBtn.addEventListener('click', () => {
        if (!state.activePack) return;
        const text = buildSynthesizedMdm(state.activePack);
        if (!text.trim()) return;
        copyTextWithFeedback(text, els.copySynthBtn);
      });
    }

    if (els.copyFullBtn) {
      els.copyFullBtn.addEventListener('click', () => {
        const text = els.editor ? (els.editor.value || '') : '';
        if (!text.trim()) return;
        copyTextWithFeedback(text, els.copyFullBtn);
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

    if (els.clearDraftBtn && els.editor) {
      els.clearDraftBtn.addEventListener('click', () => {
        els.editor.value = '';
        state.editorText = '';
        saveEditorDraft();
        updateStatus('Editor draft cleared.', 'ok');
        closeSuggestions();
      });
    }

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const inside = target.closest('.slash-editor-shell');
      if (!inside) {
        if (state.inlineDdxPicker.active) {
          removeInlineDdxCommandTokenIfNeeded();
        }
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
      if (els.editor) {
        els.editor.value = 'Failed to load MDM packs.';
      }
      return;
    }

    loadSavedState();
    loadCommandUsage();
    loadEditorDraft();
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

    updateSuggestionsFromEditor();
    updateStatus('Private slash editor ready. Type / for commands.', 'ok');

    loadHistoryQuestionsIfNeeded();
  }

  init();
})();
