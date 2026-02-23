(function () {
  'use strict';

  const GROUP_ORDER = ['Life-threatening', 'Common', 'Other'];
  const OUTPUT_DOTPHRASE = 'dotphrase';
  const OUTPUT_EXPANDED = 'expanded';
  const STORAGE_KEY = 'kp_mdm_builder_state_v2';
  const CALC_NEUTRAL = 'calc-neutral';
  const CALC_LOW = 'calc-low';
  const CALC_MODERATE = 'calc-moderate';
  const CALC_HIGH = 'calc-high';
  const DOTPHRASE_DEFAULT_LIMIT = 18;
  const DOTPHRASE_SEARCH_LIMIT = 28;

  const CALCULATOR_SCHEMAS = Object.freeze({
    heart: {
      title: 'HEART',
      fields: [
        {
          id: 'history',
          type: 'select',
          label: 'History',
          options: [
            { value: '', label: 'Select history...' },
            { value: '0', label: 'Slightly suspicious (0)' },
            { value: '1', label: 'Moderately suspicious (1)' },
            { value: '2', label: 'Highly suspicious (2)' }
          ]
        },
        {
          id: 'ecg',
          type: 'select',
          label: 'ECG',
          options: [
            { value: '', label: 'Select ECG...' },
            { value: '0', label: 'Normal (0)' },
            { value: '1', label: 'Nonspecific repolarization (1)' },
            { value: '2', label: 'Significant ST deviation (2)' }
          ]
        },
        {
          id: 'age',
          type: 'select',
          label: 'Age',
          options: [
            { value: '', label: 'Select age...' },
            { value: '0', label: '<45 (0)' },
            { value: '1', label: '45-64 (1)' },
            { value: '2', label: '>=65 (2)' }
          ]
        },
        {
          id: 'risk_heading',
          type: 'heading',
          label: 'R Component: Click Risk Factors'
        },
        {
          id: 'risk_known_athero',
          type: 'checkbox',
          label: 'Known CAD / PAD / CVA (+2)'
        },
        {
          id: 'risk_htn',
          type: 'checkbox',
          label: 'Hypertension'
        },
        {
          id: 'risk_hld',
          type: 'checkbox',
          label: 'Hyperlipidemia'
        },
        {
          id: 'risk_dm',
          type: 'checkbox',
          label: 'Diabetes'
        },
        {
          id: 'risk_smoker',
          type: 'checkbox',
          label: 'Current smoker'
        },
        {
          id: 'risk_family_history',
          type: 'checkbox',
          label: 'Family history of CAD'
        },
        {
          id: 'risk_obesity',
          type: 'checkbox',
          label: 'Obesity (BMI >30)'
        },
        {
          id: 'troponin',
          type: 'select',
          label: 'Troponin',
          options: [
            { value: '', label: 'Select troponin...' },
            { value: '0', label: '<= ULN (0)' },
            { value: '1', label: '1-3x ULN (1)' },
            { value: '2', label: '>3x ULN (2)' }
          ]
        }
      ]
    },
    years: {
      title: 'YEARS',
      fields: [
        { id: 'dvt_signs', type: 'checkbox', label: 'Clinical signs of DVT' },
        { id: 'hemoptysis', type: 'checkbox', label: 'Hemoptysis' },
        { id: 'pe_most_likely', type: 'checkbox', label: 'PE most likely diagnosis' },
        { id: 'd_dimer', type: 'number', label: 'D-dimer (ng/mL FEU)', min: 0, step: 'any', placeholder: 'e.g. 420' }
      ]
    },
    abcd2: {
      title: 'ABCD2',
      fields: [
        { id: 'age_ge_60', type: 'checkbox', label: 'Age >=60 (+1)' },
        { id: 'bp_ge_140_90', type: 'checkbox', label: 'BP >=140/90 (+1)' },
        {
          id: 'clinical',
          type: 'select',
          label: 'Clinical Features',
          options: [
            { value: '', label: 'Select clinical feature...' },
            { value: 'other', label: 'Other symptoms (0)' },
            { value: 'speech', label: 'Speech disturbance only (1)' },
            { value: 'weakness', label: 'Unilateral weakness (2)' }
          ]
        },
        {
          id: 'duration',
          type: 'select',
          label: 'Duration of Symptoms',
          options: [
            { value: '', label: 'Select duration...' },
            { value: 'lt10', label: '<10 min (0)' },
            { value: '10to59', label: '10-59 min (1)' },
            { value: 'ge60', label: '>=60 min (2)' }
          ]
        },
        { id: 'diabetes', type: 'checkbox', label: 'Diabetes (+1)' }
      ]
    },
    cha2ds2_vasc: {
      title: 'CHA2DS2-VASc',
      fields: [
        {
          id: 'sex',
          type: 'select',
          label: 'Sex',
          options: [
            { value: '', label: 'Select sex...' },
            { value: 'male', label: 'Male (0)' },
            { value: 'female', label: 'Female (+1)' }
          ]
        },
        {
          id: 'age_band',
          type: 'select',
          label: 'Age',
          options: [
            { value: '', label: 'Select age...' },
            { value: 'lt65', label: '<65 (0)' },
            { value: '65to74', label: '65-74 (+1)' },
            { value: 'ge75', label: '>=75 (+2)' }
          ]
        },
        { id: 'chf', type: 'checkbox', label: 'CHF/LV dysfunction (+1)' },
        { id: 'htn', type: 'checkbox', label: 'Hypertension (+1)' },
        { id: 'diabetes', type: 'checkbox', label: 'Diabetes (+1)' },
        { id: 'stroke_tia_thromboembolism', type: 'checkbox', label: 'Prior stroke/TIA/thromboembolism (+2)' },
        { id: 'vascular', type: 'checkbox', label: 'Vascular disease (+1)' }
      ]
    }
  });

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
    riskInputs: Object.create(null),
    savedByPack: Object.create(null),
    savedActivePackId: ''
  };

  const els = {
    packSelect: document.getElementById('packSelect'),
    commandInput: document.getElementById('commandInput'),
    modeDot: document.getElementById('modeDotphrase'),
    modeExpanded: document.getElementById('modeExpanded'),
    aliasHint: document.getElementById('aliasHint'),
    quickPackButtons: document.getElementById('quickPackButtons'),
    resetPackBtn: document.getElementById('resetPackBtn'),
    lifeThreatsBtn: document.getElementById('lifeThreatsBtn'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    ddxContainer: document.getElementById('ddxContainer'),
    ruleoutContainer: document.getElementById('ruleoutContainer'),
    riskContainer: document.getElementById('riskContainer'),
    ddxCount: document.getElementById('ddxCount'),
    ruleoutCount: document.getElementById('ruleoutCount'),
    riskCount: document.getElementById('riskCount'),
    preview: document.getElementById('mdmPreview'),
    copyFullBtn: document.getElementById('copyFullBtn'),
    copyDdxBtn: document.getElementById('copyDdxBtn'),
    copyRuleoutsBtn: document.getElementById('copyRuleoutsBtn'),
    dotphraseSearchInput: document.getElementById('dotphraseSearchInput'),
    dotphraseQuickList: document.getElementById('dotphraseQuickList'),
    dotphraseMatchCount: document.getElementById('dotphraseMatchCount')
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
      if (typeof window === 'undefined' || !window.localStorage) return null;
      return window.localStorage;
    } catch (e) {
      return null;
    }
  }

  function loadSavedState() {
    const storage = safeLocalStorage();
    if (!storage) return;

    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return;

      if (parsed.outputMode === OUTPUT_DOTPHRASE || parsed.outputMode === OUTPUT_EXPANDED) {
        state.outputMode = parsed.outputMode;
      }

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
            riskInputs: entry.riskInputs && typeof entry.riskInputs === 'object' ? entry.riskInputs : {}
          };
        });
      }
    } catch (e) {
      // Ignore invalid saved state.
    }
  }

  function saveState() {
    const storage = safeLocalStorage();
    if (!storage) return;

    try {
      const payload = {
        outputMode: state.outputMode,
        activePackId: state.activePack ? state.activePack.id : state.savedActivePackId,
        packs: state.savedByPack
      };
      storage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // Ignore storage failures.
    }
  }

  function toNumber(value) {
    const n = Number.parseFloat(String(value ?? '').trim());
    return Number.isFinite(n) ? n : Number.NaN;
  }

  function toInteger(value) {
    const n = Number.parseInt(String(value ?? '').trim(), 10);
    return Number.isFinite(n) ? n : Number.NaN;
  }

  function formatNumber(value, decimals = 1) {
    if (!Number.isFinite(value)) return '';
    if (Number.isInteger(value)) return String(value);
    const fixed = value.toFixed(decimals);
    return fixed.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
  }

  function normalizeLabel(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function truncateText(text, maxLength) {
    const clean = normalizeLabel(text);
    if (!clean || clean.length <= maxLength) return clean;
    return `${clean.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
  }

  function getCalculatorSchema(type) {
    return CALCULATOR_SCHEMAS[String(type || '').trim()] || null;
  }

  function createCalculatorDefaults(type) {
    const schema = getCalculatorSchema(type);
    if (!schema) return {};

    const defaults = {};
    schema.fields.forEach((field) => {
      if (field.type === 'heading') {
        return;
      }
      if (typeof field.default !== 'undefined') {
        defaults[field.id] = field.default;
        return;
      }
      if (field.type === 'checkbox') {
        defaults[field.id] = false;
        return;
      }
      defaults[field.id] = '';
    });
    return defaults;
  }

  function cloneRiskInputValue(value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return { ...value };
    }
    if (typeof value === 'undefined' || value === null) return '';
    return String(value);
  }

  function ensureCalculatorInputState(toggle) {
    const calcType = toggle && toggle.calculator ? toggle.calculator.type : '';
    const defaults = createCalculatorDefaults(calcType);
    const existing = state.riskInputs[toggle.id];

    if (!existing || typeof existing !== 'object' || Array.isArray(existing)) {
      state.riskInputs[toggle.id] = { ...defaults };
      return state.riskInputs[toggle.id];
    }

    const merged = { ...defaults, ...existing };
    state.riskInputs[toggle.id] = merged;
    return merged;
  }

  function applyTemplate(toggle, tokens) {
    const template = String(toggle.sentence_template || '').trim();
    if (!template) return '';
    if (!tokens || typeof tokens !== 'object') {
      return template;
    }

    let output = template;
    Object.keys(tokens).forEach((key) => {
      const value = tokens[key];
      output = output.replaceAll(`{${key}}`, normalizeLabel(value));
    });
    return output.replace(/\{\w+\}/g, '').replace(/\s{2,}/g, ' ').trim();
  }

  function evaluateHeartCalculator(values) {
    const coreFields = ['history', 'ecg', 'age', 'troponin'];
    const corePts = coreFields.map((field) => toInteger(values[field]));
    if (corePts.some((n) => Number.isNaN(n))) {
      return {
        ready: false,
        className: CALC_NEUTRAL,
        preview: 'HEART: complete History/ECG/Age/Troponin',
        scoreText: '[incomplete]',
        interpretation: 'incomplete',
        details: 'HEART calculator incomplete.'
      };
    }

    const knownAthero = Boolean(values.risk_known_athero);
    const riskFactorCount = [
      values.risk_htn,
      values.risk_hld,
      values.risk_dm,
      values.risk_smoker,
      values.risk_family_history,
      values.risk_obesity
    ].filter(Boolean).length;

    let riskPts = 0;
    if (knownAthero || riskFactorCount >= 3) riskPts = 2;
    else if (riskFactorCount >= 1) riskPts = 1;

    const pts = [corePts[0], corePts[1], corePts[2], riskPts, corePts[3]];
    const total = pts.reduce((sum, n) => sum + n, 0);
    let interpretation = 'low risk';
    let className = CALC_LOW;
    if (total >= 7) {
      interpretation = 'high risk';
      className = CALC_HIGH;
    } else if (total >= 4) {
      interpretation = 'moderate risk';
      className = CALC_MODERATE;
    }

    return {
      ready: true,
      className,
      preview: `HEART ${total}/10 (${interpretation})`,
      scoreText: `${total}/10`,
      interpretation,
      details: `H/E/A/R/T = ${pts.join('/')}. R component: ${knownAthero ? 'known atherosclerotic disease' : `${riskFactorCount} selected risk factor${riskFactorCount === 1 ? '' : 's'}`} = ${riskPts}.`
    };
  }

  function evaluateYearsCalculator(values) {
    const dvt = Boolean(values.dvt_signs);
    const hemoptysis = Boolean(values.hemoptysis);
    const mostLikely = Boolean(values.pe_most_likely);
    const criteriaCount = [dvt, hemoptysis, mostLikely].filter(Boolean).length;
    const dDimer = toNumber(values.d_dimer);

    if (!Number.isFinite(dDimer) || dDimer < 0) {
      return {
        ready: false,
        className: CALC_NEUTRAL,
        preview: `YEARS: ${criteriaCount} criteria (enter D-dimer)`,
        scoreText: '[incomplete]',
        interpretation: 'incomplete',
        details: 'YEARS calculator incomplete.'
      };
    }

    const threshold = criteriaCount === 0 ? 1000 : 500;
    const ruledOut = dDimer < threshold;
    const interpretation = ruledOut ? 'PE ruled out by YEARS' : 'PE not excluded by YEARS';

    return {
      ready: true,
      className: ruledOut ? CALC_LOW : CALC_HIGH,
      preview: `YEARS: ${criteriaCount} criteria, D-dimer ${formatNumber(dDimer)} (${interpretation})`,
      scoreText: `${criteriaCount} criteria`,
      interpretation,
      details: `${criteriaCount} YEARS criteria; D-dimer ${formatNumber(dDimer)} ng/mL FEU; threshold ${threshold} ng/mL; ${ruledOut ? 'below threshold, CTA not indicated' : 'threshold met/exceeded, CTA indicated'}`
    };
  }

  function evaluateAbcd2Calculator(values) {
    const clinicalMap = { other: 0, speech: 1, weakness: 2 };
    const durationMap = { lt10: 0, '10to59': 1, ge60: 2 };
    const clinicalPts = clinicalMap[values.clinical];
    const durationPts = durationMap[values.duration];

    if (typeof clinicalPts === 'undefined' || typeof durationPts === 'undefined') {
      return {
        ready: false,
        className: CALC_NEUTRAL,
        preview: 'ABCD2: complete clinical features and duration',
        scoreText: '[incomplete]',
        interpretation: 'incomplete',
        details: 'ABCD2 calculator incomplete.'
      };
    }

    const agePts = values.age_ge_60 ? 1 : 0;
    const bpPts = values.bp_ge_140_90 ? 1 : 0;
    const dmPts = values.diabetes ? 1 : 0;
    const total = agePts + bpPts + clinicalPts + durationPts + dmPts;

    let interpretation = 'low early stroke risk';
    let className = CALC_LOW;
    let recommendation = 'supports outpatient follow-up when otherwise clinically appropriate.';
    if (total >= 6) {
      interpretation = 'high early stroke risk';
      className = CALC_HIGH;
      recommendation = 'supports admission or urgent stroke service pathway.';
    } else if (total >= 4) {
      interpretation = 'moderate early stroke risk';
      className = CALC_MODERATE;
      recommendation = 'supports expedited stroke workup/admission vs rapid clinic follow-up.';
    }

    return {
      ready: true,
      className,
      preview: `ABCD2 ${total}/7 (${interpretation})`,
      scoreText: `${total}/7`,
      interpretation,
      details: `ABCD2 tier ${total}; ${recommendation}`
    };
  }

  function evaluateCha2ds2VascCalculator(values) {
    const ageMap = { lt65: 0, '65to74': 1, ge75: 2 };
    const sex = values.sex;
    const agePts = ageMap[values.age_band];

    if (!sex || typeof agePts === 'undefined') {
      return {
        ready: false,
        className: CALC_NEUTRAL,
        preview: 'CHA2DS2-VASc: select sex and age',
        scoreText: '[incomplete]',
        interpretation: 'incomplete',
        details: 'CHA2DS2-VASc calculator incomplete.'
      };
    }

    const sexPts = sex === 'female' ? 1 : 0;
    const chfPts = values.chf ? 1 : 0;
    const htnPts = values.htn ? 1 : 0;
    const dmPts = values.diabetes ? 1 : 0;
    const strokePts = values.stroke_tia_thromboembolism ? 2 : 0;
    const vascularPts = values.vascular ? 1 : 0;
    const total = sexPts + agePts + chfPts + htnPts + dmPts + strokePts + vascularPts;

    let interpretation = 'no anticoagulation usually indicated';
    let className = CALC_LOW;
    if (sex === 'male') {
      if (total >= 2) {
        interpretation = 'anticoagulation recommended';
        className = CALC_HIGH;
      } else if (total === 1) {
        interpretation = 'consider anticoagulation';
        className = CALC_MODERATE;
      }
    } else {
      if (total >= 3) {
        interpretation = 'anticoagulation recommended';
        className = CALC_HIGH;
      } else if (total >= 2) {
        interpretation = 'consider anticoagulation';
        className = CALC_MODERATE;
      }
    }

    const sexLabel = sex === 'female' ? 'female' : 'male';
    return {
      ready: true,
      className,
      preview: `CHA2DS2-VASc ${total} (${interpretation})`,
      scoreText: String(total),
      interpretation,
      details: `Sex ${sexLabel}; threshold interpretation applied.`
    };
  }

  function evaluateRiskCalculator(toggle) {
    const calcType = toggle && toggle.calculator ? toggle.calculator.type : '';
    const values = ensureCalculatorInputState(toggle);

    switch (calcType) {
      case 'heart':
        return evaluateHeartCalculator(values);
      case 'years':
        return evaluateYearsCalculator(values);
      case 'abcd2':
        return evaluateAbcd2Calculator(values);
      case 'cha2ds2_vasc':
        return evaluateCha2ds2VascCalculator(values);
      default:
        return {
          ready: false,
          className: CALC_NEUTRAL,
          preview: 'Unsupported calculator',
          scoreText: '[unsupported]',
          interpretation: 'unsupported',
          details: 'Unsupported calculator.'
        };
    }
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

  function syncRuleouts(pack, options = {}) {
    const autoSelectNew = options.autoSelectNew !== false;
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
      if (toggle.calculator && toggle.calculator.type) {
        ensureCalculatorInputState(toggle);
        return;
      }
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

    if (toggle.calculator && toggle.calculator.type) {
      const calc = evaluateRiskCalculator(toggle);
      if (!calc.ready) {
        return `${toggle.label}: calculator incomplete.`;
      }
      const sentence = applyTemplate(toggle, {
        value: calc.scoreText,
        score: calc.scoreText,
        interpretation: calc.interpretation,
        details: calc.details
      });
      return sentence || `${toggle.label}: ${calc.preview}.`;
    }

    if (toggle.input) {
      const raw = state.riskInputs[toggle.id];
      const value = normalizeLabel(raw) || '[enter value]';
      const sentence = applyTemplate(toggle, { value });
      return sentence || normalizeLabel(String(toggle.sentence_template || ''));
    }

    const sentence = applyTemplate(toggle, {});
    return sentence || normalizeLabel(String(toggle.sentence_template || ''));
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

  function renderPackSelect() {
    els.packSelect.innerHTML = state.packs.map((pack) => (
      `<option value="${escapeHtml(pack.id)}">${escapeHtml(pack.title)} (${escapeHtml(pack.id)})</option>`
    )).join('');
  }

  function renderQuickPackButtons() {
    els.quickPackButtons.innerHTML = state.packs.map((pack) => {
      const active = state.activePack && state.activePack.id === pack.id ? 'active' : '';
      return `<button class="pack-chip ${active}" type="button" data-pack-id="${escapeHtml(pack.id)}">${escapeHtml(pack.title)}</button>`;
    }).join('');
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

  function renderRiskCalculator(toggle, isChecked) {
    const calcType = toggle && toggle.calculator ? toggle.calculator.type : '';
    const schema = getCalculatorSchema(calcType);
    if (!schema) {
      return '<p class="empty-block">Unsupported calculator.</p>';
    }

    const values = ensureCalculatorInputState(toggle);
    const evaluation = evaluateRiskCalculator(toggle);
    const disabled = isChecked ? '' : 'disabled';

    const fieldsHtml = schema.fields.map((field) => {
      const fieldId = `risk-calc-${toggle.id}-${field.id}`;
      const currentValue = values[field.id];

      if (field.type === 'heading') {
        return `<div class="risk-calc-subhead">${escapeHtml(field.label)}</div>`;
      }

      if (field.type === 'checkbox') {
        const checked = Boolean(currentValue) ? 'checked' : '';
        return `
          <label class="check-row risk-calc-check">
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
          <label class="risk-input-wrap risk-calc-field" for="${escapeHtml(fieldId)}">
            <span>${escapeHtml(field.label)}</span>
            <select id="${escapeHtml(fieldId)}" data-role="risk-calc-input" data-risk-id="${escapeHtml(toggle.id)}" data-field-id="${escapeHtml(field.id)}" ${disabled}>${options}</select>
          </label>
        `;
      }

      const min = typeof field.min === 'number' ? `min="${field.min}"` : '';
      const max = typeof field.max === 'number' ? `max="${field.max}"` : '';
      const step = field.step ? `step="${escapeHtml(field.step)}"` : '';
      const placeholder = field.placeholder ? `placeholder="${escapeHtml(field.placeholder)}"` : '';
      const value = typeof currentValue === 'undefined' || currentValue === null ? '' : String(currentValue);
      return `
        <label class="risk-input-wrap risk-calc-field" for="${escapeHtml(fieldId)}">
          <span>${escapeHtml(field.label)}</span>
          <input id="${escapeHtml(fieldId)}" type="number" value="${escapeHtml(value)}" ${min} ${max} ${step} ${placeholder} data-role="risk-calc-input" data-risk-id="${escapeHtml(toggle.id)}" data-field-id="${escapeHtml(field.id)}" ${disabled}>
        </label>
      `;
    }).join('');

    const helperLink = calcType === 'heart'
      ? '<a class="risk-calc-link" href="calculators.html#calc-heart">Open full HEART calculator</a>'
      : '';

    return `
      <div class="risk-calc-wrap">
        <div class="risk-calc-title">${escapeHtml(schema.title)} Calculator</div>
        <div class="risk-calc-grid">${fieldsHtml}</div>
        <div class="risk-calc-result ${escapeHtml(evaluation.className)}">${escapeHtml(evaluation.preview)}</div>
        ${helperLink}
      </div>
    `;
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
      const isChecked = state.selectedRisks.has(toggle.id);
      const checkedAttr = isChecked ? 'checked' : '';
      let inputHtml = '';

      if (toggle.calculator && toggle.calculator.type) {
        inputHtml = renderRiskCalculator(toggle, isChecked);
      } else if (toggle.input) {
        const input = toggle.input;
        const inputId = `risk-input-${toggle.id}`;
        const currentValue = typeof state.riskInputs[toggle.id] === 'undefined' ? '' : String(state.riskInputs[toggle.id]);

        if (input.type === 'select') {
          const options = (input.options || []).map((opt) => {
            const selected = String(opt.value) === currentValue ? 'selected' : '';
            return `<option value="${escapeHtml(opt.value)}" ${selected}>${escapeHtml(opt.label)}</option>`;
          }).join('');
          inputHtml = `
            <label class="risk-input-wrap" for="${escapeHtml(inputId)}">
              <span>${escapeHtml(input.label || 'Value')}</span>
              <select id="${escapeHtml(inputId)}" data-role="risk-input" data-risk-id="${escapeHtml(toggle.id)}" ${isChecked ? '' : 'disabled'}>${options}</select>
            </label>
          `;
        } else {
          const min = typeof input.min === 'number' ? `min="${input.min}"` : '';
          const max = typeof input.max === 'number' ? `max="${input.max}"` : '';
          const placeholder = input.placeholder ? `placeholder="${escapeHtml(input.placeholder)}"` : '';
          const type = input.type === 'number' ? 'number' : 'text';
          inputHtml = `
            <label class="risk-input-wrap" for="${escapeHtml(inputId)}">
              <span>${escapeHtml(input.label || 'Value')}</span>
              <input id="${escapeHtml(inputId)}" type="${type}" value="${escapeHtml(currentValue)}" ${placeholder} ${min} ${max} data-role="risk-input" data-risk-id="${escapeHtml(toggle.id)}" ${isChecked ? '' : 'disabled'}>
            </label>
          `;
        }
      }

      return `
        <div class="risk-row">
          <label class="check-row">
            <input type="checkbox" data-role="risk" data-risk-id="${escapeHtml(toggle.id)}" ${checkedAttr}>
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

  function renderCounts() {
    const ddxCount = state.selectedDdx.size;
    const ruleoutCount = getSelectedRuleoutIds().length;
    const riskCount = state.selectedRisks.size;

    els.ddxCount.textContent = `${ddxCount} selected`;
    els.ruleoutCount.textContent = `${ruleoutCount} selected`;
    els.riskCount.textContent = `${riskCount} selected`;
  }

  function getDotphraseRows() {
    const all = Array.isArray(window.KP_DOTPHRASES) ? window.KP_DOTPHRASES : [];
    const queryRaw = normalizeLabel(els.dotphraseSearchInput ? els.dotphraseSearchInput.value : '').toLowerCase();
    const tokens = queryRaw ? queryRaw.split(/\s+/).filter(Boolean) : [];
    const linkedRuleouts = new Set(state.availableRuleoutIds || []);

    const rows = [];
    all.forEach((item) => {
      const id = normalizeId(item && item.dot);
      if (!id) return;
      const cond = normalizeLabel(item && item.cond);
      const cat = normalizeLabel(item && item.cat);
      const text = normalizeLabel(item && item.text);
      const searchable = `${id} ${cond} ${cat} ${text}`.toLowerCase();

      let score = linkedRuleouts.has(id) ? 100 : 0;
      let matched = true;

      if (tokens.length) {
        tokens.forEach((token) => {
          if (!searchable.includes(token)) {
            matched = false;
            return;
          }
          if (id.includes(token)) score += 10;
          else if (cond.toLowerCase().includes(token)) score += 6;
          else if (cat.toLowerCase().includes(token)) score += 4;
          else score += 1;
        });
      }

      if (!matched) return;

      rows.push({
        id,
        cond,
        cat,
        text,
        linked: linkedRuleouts.has(id),
        selected: state.selectedRuleouts.has(id),
        score
      });
    });

    rows.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.linked !== b.linked) return a.linked ? -1 : 1;
      return a.cond.localeCompare(b.cond);
    });

    if (!tokens.length) {
      const linked = rows.filter((row) => row.linked);
      const others = rows.filter((row) => !row.linked);
      const keep = Math.max(DOTPHRASE_DEFAULT_LIMIT - linked.length, 8);
      return linked.concat(others.slice(0, keep));
    }

    return rows.slice(0, DOTPHRASE_SEARCH_LIMIT);
  }

  function renderDotphraseLookup() {
    if (!els.dotphraseQuickList || !els.dotphraseMatchCount) return;

    const rows = getDotphraseRows();
    els.dotphraseMatchCount.textContent = `${rows.length} shown`;

    if (!rows.length) {
      els.dotphraseQuickList.innerHTML = '<div class="dotphrase-empty">No dotphrases match this search. Try a shorter keyword.</div>';
      return;
    }

    els.dotphraseQuickList.innerHTML = rows.map((row) => {
      const dotTag = formatDotphrase(row.id);
      const linkedClass = row.linked ? ' linked' : '';
      const snippet = truncateText(row.text, 200);
      const toggleButton = row.linked
        ? `<button class="dotphrase-btn" type="button" data-role="toggle-linked-ruleout" data-dot-id="${escapeHtml(row.id)}">${row.selected ? 'Remove from Rule-outs' : 'Add to Rule-outs'}</button>`
        : '';

      return `
        <article class="dotphrase-item${linkedClass}">
          <div class="dotphrase-meta">
            <span class="dotphrase-dot">${escapeHtml(dotTag)}</span>
            <span class="dotphrase-cat">${escapeHtml(row.cat || 'General')}</span>
          </div>
          <div class="dotphrase-cond">${escapeHtml(row.cond || 'Untitled Dotphrase')}</div>
          <div class="dotphrase-snippet">${escapeHtml(snippet || 'No phrase text available.')}</div>
          <div class="dotphrase-actions">
            <button class="dotphrase-btn" type="button" data-role="copy-dot-id" data-dot-id="${escapeHtml(row.id)}">Copy ${escapeHtml(dotTag)}</button>
            <button class="dotphrase-btn" type="button" data-role="copy-dot-text" data-dot-id="${escapeHtml(row.id)}">Copy Expanded Text</button>
            ${toggleButton}
          </div>
        </article>
      `;
    }).join('');
  }

  function renderAll() {
    renderAliasHint();
    renderQuickPackButtons();
    renderDdx();
    renderRuleouts();
    renderRiskToggles();
    renderCounts();
    renderDotphraseLookup();
    setPreview();
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
    syncRiskToggles(pack);
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

    state.availableRuleoutIds = [];
    syncRuleouts(pack, { autoSelectNew: false });
    syncRiskToggles(pack);
  }

  function snapshotActivePackState() {
    const serializedInputs = JSON.parse(JSON.stringify(state.riskInputs || {}));
    return {
      selectedDdx: [...state.selectedDdx],
      selectedRuleouts: getSelectedRuleoutIds(),
      selectedRisks: [...state.selectedRisks],
      riskInputs: serializedInputs
    };
  }

  function persistActivePackState() {
    if (!state.activePack) return;
    state.savedByPack[state.activePack.id] = snapshotActivePackState();
    state.savedActivePackId = state.activePack.id;
    saveState();
  }

  function selectPack(packId, options = {}) {
    const skipPersist = Boolean(options.skipPersist);
    const pack = state.packById.get(packId);
    if (!pack) return;

    if (!skipPersist && state.activePack) {
      persistActivePackState();
    }

    state.activePack = pack;
    els.packSelect.value = pack.id;
    els.commandInput.value = pack.id;
    updateCommandValidity(pack.id);

    const saved = state.savedByPack[pack.id];
    if (saved && typeof saved === 'object') {
      applySavedPackState(pack, saved);
    } else {
      applyDefaultPackState(pack);
    }

    renderAll();
    saveState();
  }

  function updateCommandValidity(rawValue) {
    const cmd = normalizeCommand(rawValue);
    const isValid = !cmd || state.commandMap.has(cmd);
    els.commandInput.classList.toggle('invalid', !isValid);
    return isValid;
  }

  function tryCommandSelect(rawValue) {
    const cmd = normalizeCommand(rawValue);
    const packId = state.commandMap.get(cmd);
    updateCommandValidity(rawValue);

    if (!packId) return false;
    if (!state.activePack || state.activePack.id !== packId) {
      selectPack(packId);
    }
    return true;
  }

  function applyLifeThreatsOnly() {
    if (!state.activePack) return;
    const labels = (state.activePack.ddx || [])
      .filter((item) => String(item.group || '').toLowerCase() === 'life-threatening')
      .map((item) => item.label);

    state.selectedDdx = new Set(labels);
    state.selectedRuleouts.clear();
    state.availableRuleoutIds = [];
    syncRuleouts(state.activePack, { autoSelectNew: true });
    state.selectedRisks.clear();
    state.riskInputs = Object.create(null);
    syncRiskToggles(state.activePack);
    renderAll();
    persistActivePackState();
  }

  function clearAllSelections() {
    if (!state.activePack) return;
    state.selectedDdx.clear();
    state.selectedRuleouts.clear();
    state.availableRuleoutIds = [];
    syncRuleouts(state.activePack, { autoSelectNew: false });
    state.selectedRisks.clear();
    state.riskInputs = Object.create(null);
    syncRiskToggles(state.activePack);
    renderAll();
    persistActivePackState();
  }

  function resetCurrentPackToDefaults() {
    if (!state.activePack) return;
    delete state.savedByPack[state.activePack.id];
    applyDefaultPackState(state.activePack);
    renderAll();
    persistActivePackState();
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

  function updateRiskInputFromElement(target) {
    const role = target.dataset.role || '';
    const riskId = target.dataset.riskId || '';
    if (!riskId) return false;

    if (role === 'risk-input' && (target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) {
      state.riskInputs[riskId] = target.value;
      return true;
    }

    if (role === 'risk-calc-input' && (target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) {
      const fieldId = target.dataset.fieldId || '';
      if (!fieldId) return false;

      const existing = state.riskInputs[riskId];
      const next = (existing && typeof existing === 'object' && !Array.isArray(existing)) ? { ...existing } : {};

      if (target instanceof HTMLInputElement && target.type === 'checkbox') {
        next[fieldId] = target.checked;
      } else {
        next[fieldId] = target.value;
      }

      state.riskInputs[riskId] = next;
      if (!state.selectedRisks.has(riskId)) {
        state.selectedRisks.add(riskId);
      }
      return true;
    }

    return false;
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
      saveState();
    });

    els.modeExpanded.addEventListener('change', () => {
      if (!els.modeExpanded.checked) return;
      state.outputMode = OUTPUT_EXPANDED;
      setPreview();
      saveState();
    });

    els.quickPackButtons.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const btn = target.closest('[data-pack-id]');
      if (!btn) return;
      const packId = btn.getAttribute('data-pack-id');
      if (packId) selectPack(packId);
    });

    els.resetPackBtn.addEventListener('click', resetCurrentPackToDefaults);
    els.lifeThreatsBtn.addEventListener('click', applyLifeThreatsOnly);
    els.clearAllBtn.addEventListener('click', clearAllSelections);

    els.ddxContainer.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.dataset.role !== 'ddx') return;
      const label = target.dataset.label || '';
      if (!label) return;

      if (target.checked) state.selectedDdx.add(label);
      else state.selectedDdx.delete(label);

      syncRuleouts(state.activePack, { autoSelectNew: true });
      syncRiskToggles(state.activePack);
      renderAll();
      persistActivePackState();
    });

    els.ruleoutContainer.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.dataset.role !== 'ruleout') return;
      const id = normalizeId(target.dataset.id || '');
      if (!id) return;

      if (target.checked) state.selectedRuleouts.add(id);
      else state.selectedRuleouts.delete(id);
      renderCounts();
      setPreview();
      persistActivePackState();
    });

    els.riskContainer.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.dataset.role === 'risk' && target instanceof HTMLInputElement) {
        const riskId = target.dataset.riskId || '';
        if (!riskId) return;
        if (target.checked) state.selectedRisks.add(riskId);
        else state.selectedRisks.delete(riskId);
        renderRiskToggles();
        renderCounts();
        setPreview();
        persistActivePackState();
        return;
      }

      if (updateRiskInputFromElement(target)) {
        if (target.dataset.role === 'risk-calc-input') {
          renderRiskToggles();
          renderCounts();
        }
        setPreview();
        persistActivePackState();
      }
    });

    els.riskContainer.addEventListener('input', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
      if (!updateRiskInputFromElement(target)) return;
      setPreview();
      persistActivePackState();
    });

    if (els.dotphraseSearchInput) {
      els.dotphraseSearchInput.addEventListener('input', () => {
        renderDotphraseLookup();
      });
    }

    if (els.dotphraseQuickList) {
      els.dotphraseQuickList.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const btn = target.closest('button[data-role]');
        if (!btn) return;

        const role = btn.getAttribute('data-role') || '';
        const dotId = normalizeId(btn.getAttribute('data-dot-id') || '');
        if (!dotId) return;

        if (role === 'copy-dot-id') {
          copyTextWithFeedback(formatDotphrase(dotId), btn);
          return;
        }

        if (role === 'copy-dot-text') {
          const lookup = phraseLookup(dotId);
          const text = lookup && lookup.exists && lookup.text ? lookup.text : formatDotphrase(dotId);
          copyTextWithFeedback(text, btn);
          return;
        }

        if (role === 'toggle-linked-ruleout') {
          if (!state.availableRuleoutIds.includes(dotId)) return;
          if (state.selectedRuleouts.has(dotId)) state.selectedRuleouts.delete(dotId);
          else state.selectedRuleouts.add(dotId);
          renderRuleouts();
          renderCounts();
          renderDotphraseLookup();
          setPreview();
          persistActivePackState();
        }
      });
    }

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

    loadSavedState();
    renderPackSelect();

    if (state.outputMode === OUTPUT_EXPANDED) {
      els.modeExpanded.checked = true;
      els.modeDot.checked = false;
    } else {
      els.modeDot.checked = true;
      els.modeExpanded.checked = false;
      state.outputMode = OUTPUT_DOTPHRASE;
    }

    const hashCmd = normalizeCommand(window.location.hash.replace(/^#/, ''));
    if (hashCmd && state.commandMap.has(hashCmd)) {
      selectPack(state.commandMap.get(hashCmd), { skipPersist: true });
      return;
    }

    if (state.savedActivePackId && state.packById.has(state.savedActivePackId)) {
      selectPack(state.savedActivePackId, { skipPersist: true });
      return;
    }

    selectPack(state.packs[0].id, { skipPersist: true });
  }

  init();
})();
