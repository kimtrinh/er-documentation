(function () {
  'use strict';

  const CALC_NEUTRAL = 'calc-neutral';
  const CALC_LOW = 'calc-low';
  const CALC_MODERATE = 'calc-moderate';
  const CALC_HIGH = 'calc-high';

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
        { id: 'risk_htn', type: 'checkbox', label: 'Hypertension' },
        { id: 'risk_hld', type: 'checkbox', label: 'Hyperlipidemia' },
        { id: 'risk_dm', type: 'checkbox', label: 'Diabetes' },
        { id: 'risk_smoker', type: 'checkbox', label: 'Current smoker' },
        { id: 'risk_family_history', type: 'checkbox', label: 'Family history of CAD' },
        { id: 'risk_obesity', type: 'checkbox', label: 'Obesity (BMI >30)' },
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
    },
    wells_pe: {
      title: 'Wells PE',
      fields: [
        { id: 'dvt_signs', type: 'checkbox', label: 'Clinical signs/symptoms of DVT (+3)' },
        { id: 'pe_most_likely', type: 'checkbox', label: 'PE most likely diagnosis (+3)' },
        { id: 'hr_gt_100', type: 'checkbox', label: 'HR >100 bpm (+1.5)' },
        { id: 'immobilization_or_recent_surgery', type: 'checkbox', label: 'Immobilization >=3 days or recent surgery (+1.5)' },
        { id: 'prior_pe_dvt', type: 'checkbox', label: 'Prior PE/DVT (+1.5)' },
        { id: 'hemoptysis', type: 'checkbox', label: 'Hemoptysis (+1)' },
        { id: 'malignancy', type: 'checkbox', label: 'Active malignancy (+1)' }
      ]
    },
    perc: {
      title: 'PERC',
      fields: [
        { id: 'age_ge_50', type: 'checkbox', label: 'Age >=50' },
        { id: 'hr_ge_100', type: 'checkbox', label: 'HR >=100 bpm' },
        { id: 'spo2_lt_95', type: 'checkbox', label: 'SpO2 <95% on room air' },
        { id: 'unilateral_leg_swelling', type: 'checkbox', label: 'Unilateral leg swelling' },
        { id: 'hemoptysis', type: 'checkbox', label: 'Hemoptysis' },
        { id: 'recent_surgery_trauma', type: 'checkbox', label: 'Recent surgery/trauma' },
        { id: 'prior_pe_dvt', type: 'checkbox', label: 'Prior PE/DVT' },
        { id: 'estrogen_use', type: 'checkbox', label: 'Estrogen use' }
      ]
    },
    curb65: {
      title: 'CURB-65',
      fields: [
        { id: 'confusion', type: 'checkbox', label: 'Confusion (+1)' },
        { id: 'bun_ge_20', type: 'checkbox', label: 'BUN >=20 mg/dL (+1)' },
        { id: 'rr_ge_30', type: 'checkbox', label: 'Respiratory rate >=30 (+1)' },
        { id: 'low_bp', type: 'checkbox', label: 'SBP <90 or DBP <=60 (+1)' },
        { id: 'age_ge_65', type: 'checkbox', label: 'Age >=65 (+1)' }
      ]
    },
    qsofa: {
      title: 'qSOFA',
      fields: [
        { id: 'rr_ge_22', type: 'checkbox', label: 'Respiratory rate >=22 (+1)' },
        { id: 'sbp_le_100', type: 'checkbox', label: 'SBP <=100 (+1)' },
        { id: 'altered_mentation', type: 'checkbox', label: 'Altered mentation (GCS <15) (+1)' }
      ]
    },
    alvarado: {
      title: 'Alvarado',
      fields: [
        { id: 'migration', type: 'checkbox', label: 'Migration of pain (+1)' },
        { id: 'anorexia', type: 'checkbox', label: 'Anorexia (+1)' },
        { id: 'nausea_vomiting', type: 'checkbox', label: 'Nausea/vomiting (+1)' },
        { id: 'rlq_tenderness', type: 'checkbox', label: 'RLQ tenderness (+2)' },
        { id: 'rebound', type: 'checkbox', label: 'Rebound/peritoneal irritation (+1)' },
        { id: 'fever', type: 'checkbox', label: 'Fever (+1)' },
        { id: 'leukocytosis', type: 'checkbox', label: 'Leukocytosis (+2)' },
        { id: 'left_shift', type: 'checkbox', label: 'Left shift/neutrophilia (+1)' }
      ]
    },
    glasgow_blatchford: {
      title: 'Glasgow-Blatchford',
      fields: [
        {
          id: 'bun_points',
          type: 'select',
          label: 'BUN category',
          options: [
            { value: '', label: 'Select BUN category...' },
            { value: '0', label: '<18.2 mg/dL (0)' },
            { value: '2', label: '18.2-22.3 mg/dL (+2)' },
            { value: '3', label: '22.4-27.9 mg/dL (+3)' },
            { value: '4', label: '28-69.9 mg/dL (+4)' },
            { value: '6', label: '>=70 mg/dL (+6)' }
          ]
        },
        {
          id: 'hgb_points',
          type: 'select',
          label: 'Hemoglobin category (sex-adjusted)',
          options: [
            { value: '', label: 'Select Hgb category...' },
            { value: '0', label: 'No Hgb points (0)' },
            { value: '1', label: 'Lower-mild Hgb points (+1)' },
            { value: '3', label: 'Moderate Hgb points (+3, male only)' },
            { value: '6', label: 'Severe low Hgb points (+6)' }
          ]
        },
        {
          id: 'sbp_points',
          type: 'select',
          label: 'Systolic BP category',
          options: [
            { value: '', label: 'Select SBP category...' },
            { value: '0', label: '>=110 mmHg (0)' },
            { value: '1', label: '100-109 mmHg (+1)' },
            { value: '2', label: '90-99 mmHg (+2)' },
            { value: '3', label: '<90 mmHg (+3)' }
          ]
        },
        { id: 'pulse_ge_100', type: 'checkbox', label: 'Pulse >=100 (+1)' },
        { id: 'melena', type: 'checkbox', label: 'Melena (+1)' },
        { id: 'syncope', type: 'checkbox', label: 'Syncope (+2)' },
        { id: 'hepatic_disease', type: 'checkbox', label: 'Hepatic disease (+2)' },
        { id: 'heart_failure', type: 'checkbox', label: 'Heart failure (+2)' }
      ]
    },
    canadian_syncope: {
      title: 'Canadian Syncope Risk',
      fields: [
        { id: 'predisposition_vasovagal', type: 'checkbox', label: 'Predisposition to vasovagal symptoms (-1)' },
        { id: 'history_heart_disease', type: 'checkbox', label: 'History of heart disease (+1)' },
        { id: 'sbp_lt90_or_gt180', type: 'checkbox', label: 'Any SBP <90 or >180 (+2)' },
        { id: 'troponin_elevated', type: 'checkbox', label: 'Troponin above 99th percentile (+2)' },
        { id: 'qrs_axis_abnormal', type: 'checkbox', label: 'QRS axis < -30 or >100 (+1)' },
        { id: 'qrs_gt_130', type: 'checkbox', label: 'QRS duration >130 ms (+1)' },
        { id: 'qtc_gt_480', type: 'checkbox', label: 'QTc >480 ms (+2)' },
        {
          id: 'ed_diagnosis',
          type: 'select',
          label: 'ED diagnosis impression',
          default: 'other',
          options: [
            { value: 'other', label: 'Other / unclear (0)' },
            { value: 'vasovagal', label: 'Vasovagal syncope (-2)' },
            { value: 'cardiac', label: 'Cardiac syncope (+2)' }
          ]
        }
      ]
    },
    canadian_ct_head: {
      title: 'Canadian CT Head Rule',
      fields: [
        {
          id: 'eligible',
          type: 'select',
          label: 'Rule eligible?',
          options: [
            { value: '', label: 'Select eligibility...' },
            { value: 'yes', label: 'Yes, eligible' },
            { value: 'no', label: 'No, not eligible' }
          ]
        },
        { id: 'gcs_lt_15_2h', type: 'checkbox', label: 'GCS <15 at 2 hours' },
        { id: 'suspected_open_depressed_skull', type: 'checkbox', label: 'Suspected open/depressed skull fracture' },
        { id: 'basilar_skull_signs', type: 'checkbox', label: 'Signs of basilar skull fracture' },
        { id: 'vomiting_ge_2', type: 'checkbox', label: 'Vomiting >=2 episodes' },
        { id: 'age_ge_65', type: 'checkbox', label: 'Age >=65 years' },
        { id: 'amnesia_ge_30m', type: 'checkbox', label: 'Amnesia >=30 minutes before impact' },
        { id: 'dangerous_mechanism', type: 'checkbox', label: 'Dangerous mechanism' }
      ]
    },
    pecarn: {
      title: 'PECARN',
      fields: [
        {
          id: 'age_group',
          type: 'select',
          label: 'Age group',
          options: [
            { value: '', label: 'Select age group...' },
            { value: 'u2', label: '<2 years' },
            { value: 'ge2', label: '>=2 years' }
          ]
        },
        { id: 'heading_u2', type: 'heading', label: 'Age <2 years criteria' },
        { id: 'u2_gcs_lt_15', type: 'checkbox', label: 'GCS <15' },
        { id: 'u2_altered_mental_status', type: 'checkbox', label: 'Altered mental status' },
        { id: 'u2_palpable_skull_fracture', type: 'checkbox', label: 'Palpable skull fracture' },
        { id: 'u2_nonfrontal_scalp_hematoma', type: 'checkbox', label: 'Non-frontal scalp hematoma' },
        { id: 'u2_loc_ge_5s', type: 'checkbox', label: 'Loss of consciousness >=5 seconds' },
        { id: 'u2_severe_mechanism', type: 'checkbox', label: 'Severe mechanism' },
        { id: 'u2_not_acting_normal', type: 'checkbox', label: 'Not acting normally per parent' },
        { id: 'heading_ge2', type: 'heading', label: 'Age >=2 years criteria' },
        { id: 'ge2_gcs_lt_15', type: 'checkbox', label: 'GCS <15' },
        { id: 'ge2_altered_mental_status', type: 'checkbox', label: 'Altered mental status' },
        { id: 'ge2_basilar_skull_signs', type: 'checkbox', label: 'Signs of basilar skull fracture' },
        { id: 'ge2_history_loc', type: 'checkbox', label: 'History of loss of consciousness' },
        { id: 'ge2_vomiting', type: 'checkbox', label: 'Vomiting' },
        { id: 'ge2_severe_mechanism', type: 'checkbox', label: 'Severe mechanism' },
        { id: 'ge2_severe_headache', type: 'checkbox', label: 'Severe headache' }
      ]
    },
    nexus_cspine: {
      title: 'NEXUS C-Spine',
      fields: [
        { id: 'midline_tenderness', type: 'checkbox', label: 'Posterior midline cervical tenderness present' },
        { id: 'focal_neuro_deficit', type: 'checkbox', label: 'Focal neurologic deficit present' },
        { id: 'altered_alertness', type: 'checkbox', label: 'Altered level of alertness present' },
        { id: 'intoxication', type: 'checkbox', label: 'Intoxication present' },
        { id: 'distracting_injury', type: 'checkbox', label: 'Painful distracting injury present' }
      ]
    },
    add_rs: {
      title: 'ADD-RS',
      fields: [
        { id: 'high_risk_condition', type: 'checkbox', label: 'High-risk condition: Marfan syndrome / connective tissue disorder / family h/o aortic disease / known aortic valve disease / prior aortic surgery / known TAA (+1)' },
        { id: 'high_risk_pain', type: 'checkbox', label: 'High-risk pain feature: sudden/abrupt onset AND/OR tearing or ripping quality (+1)' },
        { id: 'high_risk_exam', type: 'checkbox', label: 'High-risk exam finding: pulse deficit / BP differential >=20 mmHg / focal neuro deficit / known aortic regurgitation / hypotension (+1)' }
      ]
    },
    ottawa_sah: {
      title: 'Ottawa SAH Rule',
      fields: [
        { id: 'age_ge_40', type: 'checkbox', label: 'Age >=40 [Criterion 1]' },
        { id: 'neck_pain_stiffness', type: 'checkbox', label: 'Neck pain or stiffness [Criterion 2]' },
        { id: 'witnessed_loc', type: 'checkbox', label: 'Witnessed loss of consciousness [Criterion 3]' },
        { id: 'onset_exertion', type: 'checkbox', label: 'Onset during exertion / Valsalva / sexual activity [Criterion 4]' },
        { id: 'thunderclap_onset', type: 'checkbox', label: 'Thunderclap onset - maximal intensity within seconds [Criterion 5]' },
        { id: 'limited_neck_flexion', type: 'checkbox', label: 'Limited neck flexion on exam [Criterion 6]' }
      ]
    },
    bisap: {
      title: 'BISAP',
      fields: [
        { id: 'bun_gt25', type: 'checkbox', label: 'BUN > 25 mg/dL (+1)' },
        { id: 'impaired_mentation', type: 'checkbox', label: 'Impaired mental status - GCS < 15 or disorientation (+1)' },
        { id: 'sirs', type: 'checkbox', label: 'SIRS >=2 criteria: temp <36 or >38 C, HR >90, RR >20, WBC <4k or >12k (+1)' },
        { id: 'age_gt60', type: 'checkbox', label: 'Age > 60 years (+1)' },
        { id: 'pleural_effusion', type: 'checkbox', label: 'Pleural effusion on imaging (+1)' }
      ]
    }
  });

  function toNumber(value) {
    const n = Number.parseFloat(String(value ?? '').trim());
    return Number.isFinite(n) ? n : Number.NaN;
  }

  function toInteger(value) {
    const n = Number.parseInt(String(value ?? '').trim(), 10);
    return Number.isFinite(n) ? n : Number.NaN;
  }

  function formatNumber(value, decimals) {
    const places = typeof decimals === 'number' ? decimals : 1;
    if (!Number.isFinite(value)) return '';
    if (Number.isInteger(value)) return String(value);
    const fixed = value.toFixed(places);
    return fixed.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
  }

  function getCalculatorSchema(type) {
    return CALCULATOR_SCHEMAS[String(type || '').trim()] || null;
  }

  function createDefaults(type) {
    const schema = getCalculatorSchema(type);
    if (!schema) return {};
    const defaults = {};
    schema.fields.forEach((field) => {
      if (field.type === 'heading') return;
      if (typeof field.default !== 'undefined') {
        defaults[field.id] = field.default;
      } else if (field.type === 'checkbox') {
        defaults[field.id] = false;
      } else {
        defaults[field.id] = '';
      }
    });
    return defaults;
  }

  function hydrateValues(type, incoming) {
    const defaults = createDefaults(type);
    const merged = { ...defaults };
    if (incoming && typeof incoming === 'object' && !Array.isArray(incoming)) {
      Object.keys(incoming).forEach((key) => {
        merged[key] = incoming[key];
      });
    }
    return merged;
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

    return {
      ready: true,
      className,
      preview: `CHA2DS2-VASc ${total} (${interpretation})`,
      scoreText: String(total),
      interpretation,
      details: `Sex ${sex}; threshold interpretation applied.`
    };
  }

  function evaluateWellsPeCalculator(values) {
    const score = (values.dvt_signs ? 3 : 0)
      + (values.pe_most_likely ? 3 : 0)
      + (values.hr_gt_100 ? 1.5 : 0)
      + (values.immobilization_or_recent_surgery ? 1.5 : 0)
      + (values.prior_pe_dvt ? 1.5 : 0)
      + (values.hemoptysis ? 1 : 0)
      + (values.malignancy ? 1 : 0);

    let interpretation = 'low pre-test probability';
    let className = CALC_LOW;
    let details = 'Wells <=1: if PERC negative, additional PE testing often not indicated.';
    if (score >= 7) {
      interpretation = 'high pre-test probability';
      className = CALC_HIGH;
      details = 'Wells >=7: high probability; proceed directly to definitive imaging/treatment pathway.';
    } else if (score >= 2) {
      interpretation = 'intermediate pre-test probability';
      className = CALC_MODERATE;
      details = 'Wells 2-6: intermediate probability; D-dimer and/or CT-PA based on full clinical context.';
    }

    return {
      ready: true,
      className,
      preview: `Wells PE ${formatNumber(score, 1)} (${interpretation})`,
      scoreText: formatNumber(score, 1),
      interpretation,
      details
    };
  }

  function evaluatePercCalculator(values) {
    const positiveCount = [
      values.age_ge_50,
      values.hr_ge_100,
      values.spo2_lt_95,
      values.unilateral_leg_swelling,
      values.hemoptysis,
      values.recent_surgery_trauma,
      values.prior_pe_dvt,
      values.estrogen_use
    ].filter(Boolean).length;

    const negative = positiveCount === 0;
    return {
      ready: true,
      className: negative ? CALC_LOW : CALC_HIGH,
      preview: `PERC ${positiveCount}/8 positive (${negative ? 'negative rule' : 'positive rule'})`,
      scoreText: `${positiveCount}/8`,
      interpretation: negative ? 'PERC negative' : 'PERC positive',
      details: negative
        ? 'All eight PERC criteria absent; in low pre-test probability patients, PE can be ruled out without further PE testing.'
        : 'One or more PERC criteria present; PERC alone cannot exclude PE.'
    };
  }

  function evaluateCurb65Calculator(values) {
    const score = [
      values.confusion,
      values.bun_ge_20,
      values.rr_ge_30,
      values.low_bp,
      values.age_ge_65
    ].filter(Boolean).length;

    let interpretation = 'low mortality risk';
    let className = CALC_LOW;
    let details = 'CURB-65 0-1 generally supports outpatient treatment when otherwise clinically appropriate.';
    if (score >= 3) {
      interpretation = 'high mortality risk';
      className = CALC_HIGH;
      details = 'CURB-65 >=3 supports inpatient/critical care level management.';
    } else if (score === 2) {
      interpretation = 'moderate mortality risk';
      className = CALC_MODERATE;
      details = 'CURB-65 =2 supports admission or very close monitored follow-up.';
    }

    return {
      ready: true,
      className,
      preview: `CURB-65 ${score}/5 (${interpretation})`,
      scoreText: `${score}/5`,
      interpretation,
      details
    };
  }

  function evaluateQsofaCalculator(values) {
    const score = [
      values.rr_ge_22,
      values.sbp_le_100,
      values.altered_mentation
    ].filter(Boolean).length;

    const highRisk = score >= 2;
    return {
      ready: true,
      className: highRisk ? CALC_HIGH : CALC_LOW,
      preview: `qSOFA ${score}/3 (${highRisk ? 'higher risk' : 'lower risk'})`,
      scoreText: `${score}/3`,
      interpretation: highRisk ? 'higher risk for poor outcome' : 'lower risk by qSOFA',
      details: highRisk
        ? 'qSOFA >=2 suggests higher risk and supports close monitoring/escalation.'
        : 'qSOFA <2 does not exclude serious infection; integrate with full clinical assessment.'
    };
  }

  function evaluateAlvaradoCalculator(values) {
    const score = (values.migration ? 1 : 0)
      + (values.anorexia ? 1 : 0)
      + (values.nausea_vomiting ? 1 : 0)
      + (values.rlq_tenderness ? 2 : 0)
      + (values.rebound ? 1 : 0)
      + (values.fever ? 1 : 0)
      + (values.leukocytosis ? 2 : 0)
      + (values.left_shift ? 1 : 0);

    let interpretation = 'low appendicitis probability';
    let className = CALC_LOW;
    let details = 'Alvarado <=4 generally supports low likelihood of appendicitis.';
    if (score >= 7) {
      interpretation = 'high appendicitis probability';
      className = CALC_HIGH;
      details = 'Alvarado >=7 is strongly concerning for appendicitis and supports urgent surgical pathway.';
    } else if (score >= 5) {
      interpretation = 'intermediate appendicitis probability';
      className = CALC_MODERATE;
      details = 'Alvarado 5-6 supports further imaging/serial reassessment.';
    }

    return {
      ready: true,
      className,
      preview: `Alvarado ${score}/10 (${interpretation})`,
      scoreText: `${score}/10`,
      interpretation,
      details
    };
  }

  function evaluateGlasgowBlatchfordCalculator(values) {
    const bunPts = toInteger(values.bun_points);
    const hgbPts = toInteger(values.hgb_points);
    const sbpPts = toInteger(values.sbp_points);

    if (Number.isNaN(bunPts) || Number.isNaN(hgbPts) || Number.isNaN(sbpPts)) {
      return {
        ready: false,
        className: CALC_NEUTRAL,
        preview: 'Glasgow-Blatchford: complete BUN/Hgb/SBP categories',
        scoreText: '[incomplete]',
        interpretation: 'incomplete',
        details: 'Glasgow-Blatchford calculator incomplete.'
      };
    }

    const score = bunPts + hgbPts + sbpPts
      + (values.pulse_ge_100 ? 1 : 0)
      + (values.melena ? 1 : 0)
      + (values.syncope ? 2 : 0)
      + (values.hepatic_disease ? 2 : 0)
      + (values.heart_failure ? 2 : 0);

    let interpretation = 'low risk for intervention';
    let className = CALC_LOW;
    let details = 'GBS 0 supports very low risk and potential outpatient management when otherwise appropriate.';
    if (score >= 13) {
      interpretation = 'very high risk';
      className = CALC_HIGH;
      details = 'Very high GBS supports urgent GI intervention/admission.';
    } else if (score >= 6) {
      interpretation = 'high risk';
      className = CALC_HIGH;
      details = 'High GBS supports inpatient management and urgent GI planning.';
    } else if (score >= 1) {
      interpretation = 'non-low risk';
      className = CALC_MODERATE;
      details = 'GBS >0 suggests higher risk than outpatient low-risk pathway.';
    }

    return {
      ready: true,
      className,
      preview: `Glasgow-Blatchford ${score} (${interpretation})`,
      scoreText: String(score),
      interpretation,
      details
    };
  }

  function evaluateCanadianSyncopeCalculator(values) {
    const dx = String(values.ed_diagnosis || '').trim();
    if (!dx) {
      return {
        ready: false,
        className: CALC_NEUTRAL,
        preview: 'Canadian Syncope Risk: select ED diagnosis impression',
        scoreText: '[incomplete]',
        interpretation: 'incomplete',
        details: 'Canadian Syncope Risk calculator incomplete.'
      };
    }

    let score = 0;
    score += values.predisposition_vasovagal ? -1 : 0;
    score += values.history_heart_disease ? 1 : 0;
    score += values.sbp_lt90_or_gt180 ? 2 : 0;
    score += values.troponin_elevated ? 2 : 0;
    score += values.qrs_axis_abnormal ? 1 : 0;
    score += values.qrs_gt_130 ? 1 : 0;
    score += values.qtc_gt_480 ? 2 : 0;
    if (dx === 'vasovagal') score += -2;
    if (dx === 'cardiac') score += 2;

    let interpretation = 'low short-term serious outcome risk';
    let className = CALC_LOW;
    let details = 'Score <=0 typically supports low-risk disposition if no other concerning features.';
    if (score >= 6) {
      interpretation = 'very high short-term serious outcome risk';
      className = CALC_HIGH;
      details = 'Very high score supports admission/urgent monitored pathway.';
    } else if (score >= 4) {
      interpretation = 'high short-term serious outcome risk';
      className = CALC_HIGH;
      details = 'High score supports monitored admission and urgent cardiac evaluation.';
    } else if (score >= 1) {
      interpretation = 'intermediate short-term serious outcome risk';
      className = CALC_MODERATE;
      details = 'Intermediate score supports cautious disposition and close follow-up.';
    }

    return {
      ready: true,
      className,
      preview: `Canadian Syncope Risk ${score} (${interpretation})`,
      scoreText: String(score),
      interpretation,
      details
    };
  }

  function evaluateCanadianCtHeadCalculator(values) {
    const eligible = String(values.eligible || '').trim();
    if (!eligible) {
      return {
        ready: false,
        className: CALC_NEUTRAL,
        preview: 'Canadian CT Head: select rule eligibility',
        scoreText: '[incomplete]',
        interpretation: 'incomplete',
        details: 'Canadian CT Head calculator incomplete.'
      };
    }

    if (eligible === 'no') {
      return {
        ready: true,
        className: CALC_NEUTRAL,
        preview: 'Canadian CT Head: not eligible',
        scoreText: 'N/A',
        interpretation: 'rule not applicable',
        details: 'Rule inclusion criteria not met; use clinical judgment.'
      };
    }

    const highRisk = [
      values.gcs_lt_15_2h,
      values.suspected_open_depressed_skull,
      values.basilar_skull_signs,
      values.vomiting_ge_2,
      values.age_ge_65
    ].filter(Boolean).length;
    const mediumRisk = [
      values.amnesia_ge_30m,
      values.dangerous_mechanism
    ].filter(Boolean).length;
    const indicated = highRisk > 0 || mediumRisk > 0;

    return {
      ready: true,
      className: indicated ? CALC_HIGH : CALC_LOW,
      preview: `Canadian CT Head: ${indicated ? 'CT indicated' : 'CT not required by rule'}`,
      scoreText: `${highRisk + mediumRisk} criteria`,
      interpretation: indicated ? 'rule-positive for CT imaging' : 'rule-negative for CT imaging',
      details: indicated
        ? `High-risk criteria: ${highRisk}; medium-risk criteria: ${mediumRisk}.`
        : 'No high- or medium-risk criteria identified by rule.'
    };
  }

  function evaluatePecarnCalculator(values) {
    const group = String(values.age_group || '').trim();
    if (!group) {
      return {
        ready: false,
        className: CALC_NEUTRAL,
        preview: 'PECARN: select age group',
        scoreText: '[incomplete]',
        interpretation: 'incomplete',
        details: 'PECARN calculator incomplete.'
      };
    }

    let highRiskCount = 0;
    let intermediateCount = 0;

    if (group === 'u2') {
      highRiskCount = [values.u2_gcs_lt_15, values.u2_altered_mental_status, values.u2_palpable_skull_fracture].filter(Boolean).length;
      intermediateCount = [values.u2_nonfrontal_scalp_hematoma, values.u2_loc_ge_5s, values.u2_severe_mechanism, values.u2_not_acting_normal].filter(Boolean).length;
    } else {
      highRiskCount = [values.ge2_gcs_lt_15, values.ge2_altered_mental_status, values.ge2_basilar_skull_signs].filter(Boolean).length;
      intermediateCount = [values.ge2_history_loc, values.ge2_vomiting, values.ge2_severe_mechanism, values.ge2_severe_headache].filter(Boolean).length;
    }

    let interpretation = 'very low risk by PECARN';
    let className = CALC_LOW;
    let details = 'No high- or intermediate-risk PECARN criteria selected.';
    if (highRiskCount > 0) {
      interpretation = 'high risk by PECARN';
      className = CALC_HIGH;
      details = 'High-risk PECARN features present; CT generally recommended in appropriate context.';
    } else if (intermediateCount > 0) {
      interpretation = 'intermediate risk by PECARN';
      className = CALC_MODERATE;
      details = 'Intermediate-risk PECARN features present; CT vs observation based on shared decision-making and clinical course.';
    }

    return {
      ready: true,
      className,
      preview: `PECARN (${group === 'u2' ? '<2y' : '>=2y'}): ${interpretation}`,
      scoreText: `H${highRiskCount}/I${intermediateCount}`,
      interpretation,
      details
    };
  }

  function evaluateNexusCspineCalculator(values) {
    const positiveCount = [
      values.midline_tenderness,
      values.focal_neuro_deficit,
      values.altered_alertness,
      values.intoxication,
      values.distracting_injury
    ].filter(Boolean).length;
    const nexusNegative = positiveCount === 0;

    return {
      ready: true,
      className: nexusNegative ? CALC_LOW : CALC_HIGH,
      preview: `NEXUS C-spine ${positiveCount}/5 positive (${nexusNegative ? 'negative rule' : 'positive rule'})`,
      scoreText: `${positiveCount}/5`,
      interpretation: nexusNegative ? 'NEXUS negative' : 'NEXUS positive',
      details: nexusNegative
        ? 'No NEXUS high-risk criteria present; cervical spine imaging may be unnecessary by rule.'
        : 'One or more NEXUS criteria present; cervical spine imaging indicated by rule.'
    };
  }

  function evaluateAddRsCalculator(values) {
    const score = [
      Boolean(values.high_risk_condition),
      Boolean(values.high_risk_pain),
      Boolean(values.high_risk_exam)
    ].filter(Boolean).length;
    const interpretation = score === 0 ? 'very low risk - no imaging required by score alone'
      : score === 1 ? 'intermediate risk - clinical judgment required'
      : score === 2 ? 'high risk - aortic imaging indicated'
      : 'very high risk - emergent CTA aorta';
    const className = score === 0 ? CALC_LOW : score === 1 ? CALC_MODERATE : CALC_HIGH;
    return {
      ready: true,
      className,
      preview: `ADD-RS: ${score}/3 - ${interpretation}`,
      scoreText: `${score}/3`,
      interpretation,
      details: `ADD-RS score ${score}/3: ${interpretation}.`
    };
  }

  function evaluateOttawaSahCalculator(values) {
    const met = [
      Boolean(values.age_ge_40),
      Boolean(values.neck_pain_stiffness),
      Boolean(values.witnessed_loc),
      Boolean(values.onset_exertion),
      Boolean(values.thunderclap_onset),
      Boolean(values.limited_neck_flexion)
    ];
    const count = met.filter(Boolean).length;
    const positive = count > 0;
    const interpretation = positive
      ? `positive (${count}/6 criteria present) - LP or CTA head/neck indicated`
      : 'negative (0/6 criteria) - SAH workup not indicated by rule';
    const className = positive ? CALC_HIGH : CALC_LOW;

    return {
      ready: true,
      className,
      preview: `Ottawa SAH: ${positive ? 'POSITIVE' : 'NEGATIVE'} - ${count}/6 criteria`,
      scoreText: `${count}/6`,
      interpretation,
      details: `Ottawa SAH Rule: ${positive ? 'positive' : 'negative'} - ${interpretation}.`
    };
  }

  function evaluateBisapCalculator(values) {
    const score = [
      Boolean(values.bun_gt25),
      Boolean(values.impaired_mentation),
      Boolean(values.sirs),
      Boolean(values.age_gt60),
      Boolean(values.pleural_effusion)
    ].filter(Boolean).length;

    const interpretation = score <= 2
      ? 'low risk - in-hospital mortality <1%'
      : score === 3
        ? 'moderate risk - in-hospital mortality ~5-8%; close monitoring warranted'
        : 'high risk - in-hospital mortality >15%; ICU-level care indicated';

    const className = score <= 2 ? CALC_LOW : score === 3 ? CALC_MODERATE : CALC_HIGH;
    return {
      ready: true,
      className,
      preview: `BISAP: ${score}/5 - ${interpretation}`,
      scoreText: `${score}/5`,
      interpretation,
      details: `BISAP score ${score}/5: ${interpretation}.`
    };
  }

  function evaluate(type, rawValues) {
    const calcType = String(type || '').trim();
    const values = hydrateValues(calcType, rawValues);

    switch (calcType) {
      case 'heart': return evaluateHeartCalculator(values);
      case 'years': return evaluateYearsCalculator(values);
      case 'abcd2': return evaluateAbcd2Calculator(values);
      case 'cha2ds2_vasc': return evaluateCha2ds2VascCalculator(values);
      case 'wells_pe': return evaluateWellsPeCalculator(values);
      case 'perc': return evaluatePercCalculator(values);
      case 'curb65': return evaluateCurb65Calculator(values);
      case 'qsofa': return evaluateQsofaCalculator(values);
      case 'alvarado': return evaluateAlvaradoCalculator(values);
      case 'glasgow_blatchford': return evaluateGlasgowBlatchfordCalculator(values);
      case 'canadian_syncope': return evaluateCanadianSyncopeCalculator(values);
      case 'canadian_ct_head': return evaluateCanadianCtHeadCalculator(values);
      case 'pecarn': return evaluatePecarnCalculator(values);
      case 'nexus_cspine': return evaluateNexusCspineCalculator(values);
      case 'add_rs': return evaluateAddRsCalculator(values);
      case 'ottawa_sah': return evaluateOttawaSahCalculator(values);
      case 'bisap': return evaluateBisapCalculator(values);
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

  function renderCalcSummary(type, result) {
    const schema = getCalculatorSchema(type);
    const title = schema ? schema.title : String(type || 'Calculator');
    const evaluated = result && typeof result === 'object' ? result : evaluate(type, {});
    return `${title}: ${evaluated.preview}`;
  }

  window.ER_MDM_RISK = {
    CALC_NEUTRAL,
    CALC_LOW,
    CALC_MODERATE,
    CALC_HIGH,
    getCalculatorSchema,
    createDefaults,
    evaluate,
    format: renderCalcSummary,
    renderCalcSummary
  };
})();
