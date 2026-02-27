(function () {
  'use strict';

  const GROUP_ORDER = ['Life-threatening', 'Common', 'Other'];
  const OUTPUT_DOTPHRASE = 'dotphrase';
  const OUTPUT_EXPANDED = 'expanded';
  const STORAGE_KEY = 'kp_mdm_builder_state_v3';
  const LEGACY_STORAGE_KEYS = ['kp_mdm_builder_state_v2'];
  const CALC_NEUTRAL = 'calc-neutral';
  const CALC_LOW = 'calc-low';
  const CALC_MODERATE = 'calc-moderate';
  const CALC_HIGH = 'calc-high';
  const DEFAULT_DISCHARGE_STATE = Object.freeze({
    include_uncertainty: true,
    include_return_precautions: true,
    include_shared_decision: true,
    complaint: '',
    working_diagnosis: '',
    return_triggers: 'worsening symptoms, persistent symptoms, new concerning symptoms, chest pain, shortness of breath, syncope, fever, neurologic change, inability to tolerate oral intake/medications, or any other concern',
    followup_with: 'primary care physician and/or relevant specialty',
    followup_timeframe: '24-48 hours',
    additional_notes: ''
  });
  const CALC_HELPER_LINKS = Object.freeze({
    heart: 'calculators.html#calc-heart',
    years: 'calculators.html#calc-years',
    wells_pe: 'calculators.html#calc-wellspe',
    perc: 'calculators.html#calc-wellspe',
    abcd2: 'calculators.html#calc-abcd2',
    cha2ds2_vasc: 'calculators.html#calc-cha2ds2vasc',
    qsofa: 'calculators.html#calc-softtissue',
    canadian_ct_head: 'calculators.html#calc-cthead',
    pecarn: 'calculators.html#calc-pecarn'
  });
  const HISTORY_RISK_TOOL_LABELS = Object.freeze({
    wells_pe: { short: 'WELLS', full: 'Wells PE' },
    perc: { short: 'PERC', full: 'PERC' },
    years: { short: 'YEARS', full: 'YEARS Algorithm' },
    heart: { short: 'HEART', full: 'HEART Score' },
    abcd2: { short: 'ABCD2', full: 'ABCD2 Score' },
    cha2ds2_vasc: { short: 'CHA2DS2-VASc', full: 'CHA2DS2-VASc Score' },
    qsofa: { short: 'qSOFA', full: 'qSOFA' },
    canadian_ct_head: { short: 'CCTHR', full: 'Canadian CT Head Rule' },
    pecarn: { short: 'PECARN', full: 'PECARN' },
    nexus_cspine: { short: 'NEXUS', full: 'NEXUS C-spine' },
    curb65: { short: 'CURB-65', full: 'CURB-65' },
    canadian_syncope: { short: 'CSRS', full: 'Canadian Syncope Risk Score' },
    alvarado: { short: 'ALVARADO', full: 'Alvarado Score' },
    glasgow_blatchford: { short: 'GBS', full: 'Glasgow-Blatchford Score' },
    add_rs: { short: 'ADD-RS', full: 'ADD-RS (Aortic Dissection)' },
    bisap: { short: 'BISAP', full: 'BISAP Score' },
    ottawa_sah: { short: 'OTTAWA SAH', full: 'Ottawa SAH Rule' },
    hints: { short: 'HINTS', full: 'HINTS Exam' },
    dix_hallpike: { short: 'DIX-HALLPIKE', full: 'Dix-Hallpike Test' },
    ciwa_ar: { short: 'CIWA-Ar', full: 'CIWA-Ar Score' },
    rockall: { short: 'ROCKALL', full: 'Rockall Score' },
    oakland: { short: 'OAKLAND', full: 'Oakland Score' },
    sofa: { short: 'SOFA', full: 'SOFA Score' },
    lrinec: { short: 'LRINEC', full: 'LRINEC Score' },
    bnp: { short: 'BNP', full: 'BNP / NT-proBNP' },
    gcs: { short: 'GCS', full: 'Glasgow Coma Scale' }
  });

  const RISK_TOOL_CRITERIA = Object.freeze({
    // Keyed by calculator.type for calculator tools, or by toggle.id for input tools
    heart:              ['History — highly/moderately/slightly suspicious', 'ECG — normal / nonspecific / significant ST changes', 'Age — <45 / 45–64 / ≥65', 'Risk factors — known CAD, risk factors, or none', 'Troponin — ≤normal limit / 1–3× / >3×'],
    wells_pe:           ['DVT signs or symptoms', 'Alternative diagnosis less likely than PE', 'Heart rate > 100', 'Immobilization or surgery ≤ 4 weeks', 'Prior DVT or PE', 'Hemoptysis', 'Active malignancy'],
    perc:               ['Age < 50', 'HR < 100', 'O₂ sat ≥ 95%', 'No unilateral leg swelling', 'No hemoptysis', 'No recent surgery or trauma (≤4 wk)', 'No prior DVT/PE', 'No estrogen use'],
    years:              ['Clinical signs of DVT', 'PE most likely diagnosis', 'Hemoptysis'],
    curb65:             ['Confusion (new onset)', 'Urea > 19 mg/dL (BUN > 7 mmol/L)', 'Respiratory rate ≥ 30/min', 'BP < 90 systolic or ≤ 60 diastolic', 'Age ≥ 65'],
    abcd2:              ['Age ≥ 60 (1pt)', 'BP ≥ 140/90 (1pt)', 'Clinical: unilateral weakness (2pt) or speech-only (1pt)', 'Duration: ≥ 60 min (2pt) or 10–59 min (1pt)', 'Diabetes (1pt)'],
    cha2ds2_vasc:       ['CHF or LVEF ≤ 40% (1pt)', 'Hypertension (1pt)', 'Age ≥ 75 (2pt)', 'Diabetes mellitus (1pt)', 'Stroke / TIA / thromboembolism (2pt)', 'Vascular disease (1pt)', 'Age 65–74 (1pt)', 'Female sex (1pt)'],
    canadian_syncope:   ['Predisposing/precipitating conditions', 'Heart disease history', 'SBP on arrival < 90 or > 180 mmHg', 'Troponin elevated (> 99th percentile)', 'Abnormal QRS axis (< −30° or > 100°)', 'QRS duration > 130 ms', 'QTc interval > 480 ms', 'Emergency diagnosis of cardiac syncope'],
    canadian_ct_head:   ['GCS < 15 at 2 hours post-injury', 'Suspected open or depressed skull fracture', 'Any sign of basal skull fracture', 'Vomiting ≥ 2 episodes', 'Age ≥ 65', 'Retrograde amnesia ≥ 30 min', 'Dangerous mechanism'],
    pecarn:             ['< 2 yrs: altered mental status, non-frontal scalp hematoma, LOC ≥ 5s, severe mechanism, palpable skull fracture, acting abnormally per caregiver', '≥ 2 yrs: altered mental status, LOC, severe headache, vomiting ≥ 2, severe mechanism, signs of basilar skull fracture'],
    nexus_cspine:       ['Focal neurologic deficit', 'Midline cervical spine tenderness', 'Altered level of alertness', 'Intoxication', 'Painful distracting injury'],
    qsofa:              ['Respiratory rate ≥ 22/min (1pt)', 'Altered mentation — GCS < 15 (1pt)', 'Systolic BP ≤ 100 mmHg (1pt)'],
    alvarado:           ['Migration to RLQ (1pt)', 'Anorexia (1pt)', 'Nausea/vomiting (1pt)', 'Tenderness in RLQ (2pt)', 'Rebound tenderness (1pt)', 'Elevated temperature (1pt)', 'Leukocytosis WBC > 10k (2pt)', 'Shift to left (1pt)'],
    glasgow_blatchford: ['BUN ≥ 18.2 mg/dL', 'Hemoglobin < 13 g/dL (M) / < 12 g/dL (F)', 'SBP < 110 mmHg', 'Heart rate ≥ 100', 'Melena on presentation', 'Syncope on presentation', 'Hepatic disease', 'Cardiac failure'],
    // Non-calculator tools keyed by toggle ID
    abd_bisap_score:    ['BUN > 25 mg/dL (1pt)', 'Impaired mental status — GCS < 15 (1pt)', 'SIRS ≥ 2 criteria: temp, HR, RR, WBC (1pt)', 'Age > 60 (1pt)', 'Pleural effusion on imaging (1pt)'],
    diz_hints_exam:     ['Head Impulse Test — abnormal (catch-up saccade) = peripheral; normal = central concern', 'Nystagmus — unidirectional = peripheral; direction-changing = central concern', 'Test of Skew — no vertical skew = peripheral; vertical skew = central concern'],
    diz_dix_hallpike:   ['Patient supine, head turned 45° to affected side, lowered 20–30° below horizontal', 'Positive: geotropic upbeat-torsional nystagmus with latency and fatigue = posterior canal BPPV', 'Negative: no nystagmus or atypical pattern'],
    sob_bnp_reviewed:   ['BNP < 100 pg/mL: CHF unlikely', 'BNP 100–400 pg/mL: gray zone — consider clinical context', 'BNP > 400 pg/mL: CHF highly likely'],
    ams_gcs_score:      ['Eye opening: spontaneous (4), to voice (3), to pain (2), none (1)', 'Verbal response: oriented (5), confused (4), words (3), sounds (2), none (1)', 'Motor response: obeys (6), localizes (5), withdraws (4), abnormal flexion (3), extension (2), none (1)'],
    ams_ciwa_score:     ['Tremor (0–7)', 'Paroxysmal sweats (0–7)', 'Anxiety (0–7)', 'Agitation (0–7)', 'Perceptual disturbances (0–7)', 'Headache or fullness in head (0–7)', 'Nausea or vomiting (0–7)', 'Seizure history (0–7)'],
    gib_rockall_score:  ['Age: < 60 (0pt), 60–79 (1pt), ≥ 80 (2pt)', 'Shock: none (0pt), HR > 100 and SBP ≥ 100 (1pt), SBP < 100 (2pt)', 'Comorbidity: none (0pt), cardiac failure/IHD/major illness (2pt), renal/liver failure or disseminated malignancy (3pt)'],
    gib_oakland_score:  ['Age < 40 (0pt) vs ≥ 40 (graded)', 'Sex: male (graded pts)', 'Previous LGIB admission', 'DRE: no blood (0pt) vs blood present (1pt)', 'Heart rate < 70 (0pt)', 'SBP ≥ 160 mmHg (0pt)', 'Hemoglobin ≥ 16 g/dL (0pt)'],
    fever_sofa_score:   ['Respiratory: PaO₂/FiO₂ ratio', 'Coagulation: platelets < 150k', 'Liver: bilirubin ≥ 1.2 mg/dL', 'Cardiovascular: MAP < 70 or vasopressors', 'CNS: GCS < 15', 'Renal: creatinine ≥ 1.2 mg/dL or UO < 0.5 mL/kg/hr'],
    fever_lrinec_score: ['CRP > 150 mg/L (4pt)', 'WBC 15–25k (1pt) or > 25k (2pt)', 'Hemoglobin ≤ 13.5 g/dL (1pt)', 'Sodium < 135 mEq/L (2pt)', 'Creatinine > 1.6 mg/dL (2pt)', 'Glucose > 180 mg/dL (1pt)']
  });

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
        { id: 'high_risk_exam', type: 'checkbox', label: 'High-risk exam finding: pulse deficit / BP differential ≥20 mmHg / focal neuro deficit / known aortic regurgitation / hypotension (+1)' }
      ]
    },
    ottawa_sah: {
      title: 'Ottawa SAH Rule',
      fields: [
        { id: 'age_ge_40', type: 'checkbox', label: 'Age ≥ 40 [Criterion 1]' },
        { id: 'neck_pain_stiffness', type: 'checkbox', label: 'Neck pain or stiffness [Criterion 2]' },
        { id: 'witnessed_loc', type: 'checkbox', label: 'Witnessed loss of consciousness [Criterion 3]' },
        { id: 'onset_exertion', type: 'checkbox', label: 'Onset during exertion / Valsalva / sexual activity [Criterion 4]' },
        { id: 'thunderclap_onset', type: 'checkbox', label: 'Thunderclap onset — maximal intensity within seconds [Criterion 5]' },
        { id: 'limited_neck_flexion', type: 'checkbox', label: 'Limited neck flexion on exam [Criterion 6]' }
      ]
    }
  });

  const state = {
    packs: [],
    packById: new Map(),
    commandMap: new Map(),
    activePack: null,
    activeDocTab: 'mdm',
    outputMode: OUTPUT_EXPANDED,
    selectedDdx: new Set(),
    selectedRuleouts: new Set(),
    availableRuleoutIds: [],
    selectedRisks: new Set(),
    dotphraseFavorites: new Set(),
    riskInputs: Object.create(null),
    savedByPack: Object.create(null),
    savedActivePackId: '',
    discharge: { ...DEFAULT_DISCHARGE_STATE },
    historyQuestions: null,
    historyQuestionMeta: Object.create(null),
    historyAnswers: Object.create(null),
    historyLoaded: false,
    historyExpandedDdx: new Set(),
    historyLoading: false,
    historyLoadError: ''
  };

  const els = {
    packSelect: document.getElementById('packSelect'),
    commandInput: document.getElementById('commandInput'),
    modeDot: document.getElementById('modeDotphrase'),
    modeExpanded: document.getElementById('modeExpanded'),
    aliasHint: document.getElementById('aliasHint'),
    quickPackButtons: document.getElementById('quickPackButtons'),
    stickyCopyFullBtn: document.getElementById('stickyCopyFullBtn'),
    stickyLifeThreatsBtn: document.getElementById('stickyLifeThreatsBtn'),
    stickyResetPackBtn: document.getElementById('stickyResetPackBtn'),
    completenessIndicators: document.getElementById('completenessIndicators'),
    tabMdmBuilder: document.getElementById('tabMdmBuilder'),
    tabDotphrase: document.getElementById('tabDotphrase'),
    tabDischarge: document.getElementById('tabDischarge'),
    resetPackBtn: document.getElementById('resetPackBtn'),
    lifeThreatsBtn: document.getElementById('lifeThreatsBtn'),
    clearDdxBtn: document.getElementById('clearDdxBtn'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    openMdmBuilderBtn: document.getElementById('openMdmBuilderBtn'),
    openDischargeBuilderBtn: document.getElementById('openDischargeBuilderBtn'),
    openDotphraseBtn: document.getElementById('openDotphraseBtn'),
    panelMdmBuilder: document.getElementById('panel-mdm-builder'),
    panelDischargeBuilder: document.getElementById('panel-discharge-builder'),
    panelDotphrase: document.getElementById('panel-dotphrase'),
    ddxContainer: document.getElementById('ddxContainer'),
    ddxSelectAllBtn: document.getElementById('ddxSelectAllBtn'),
    ddxClearAllBtn: document.getElementById('ddxClearAllBtn'),
    ruleoutContainer: document.getElementById('ruleoutContainer'),
    riskContainer: document.getElementById('riskContainer'),
    ddxCount: document.getElementById('ddxCount'),
    ruleoutCount: document.getElementById('ruleoutCount'),
    riskCount: document.getElementById('riskCount'),
    preview: document.getElementById('mdmPreview'),
    copyFullBtn: document.getElementById('copyFullBtn'),
    copyDdxBtn: document.getElementById('copyDdxBtn'),
    copyRuleoutsBtn: document.getElementById('copyRuleoutsBtn'),
    qualityContainer: document.getElementById('qualityContainer'),
    qualityCount: document.getElementById('qualityCount'),
    dischargeBuilder: document.getElementById('discharge-builder'),
    dischargePreview: document.getElementById('dischargePreview'),
    dischargeCopyFullMdmBtn: document.getElementById('dischargeCopyFullMdmBtn'),
    copyDischargeBtn: document.getElementById('copyDischargeBtn'),
    dotphraseSearchInput: document.getElementById('dotphraseSearchInput'),
    dotphraseFavoritesList: document.getElementById('dotphraseFavoritesList'),
    dotphraseFavoritesCount: document.getElementById('dotphraseFavoritesCount'),
    dotphraseQuickList: document.getElementById('dotphraseQuickList'),
    dotphraseMatchCount: document.getElementById('dotphraseMatchCount'),
    tabHistoryHelper: document.getElementById('tabHistoryHelper'),
    panelHistoryHelper: document.getElementById('panel-history-helper'),
    historyHelperContainer: document.getElementById('historyHelperContainer'),
    historyHelperEmpty: document.getElementById('historyHelperEmpty'),
    historyHelperCount: document.getElementById('historyHelperCount'),
    historyPreview: document.getElementById('historyPreview'),
    historyCopyFullBtn: document.getElementById('historyCopyFullBtn'),
    historyHelperCopyBtn: document.getElementById('historyHelperCopyBtn'),
    historyHelperResetBtn: document.getElementById('historyHelperResetBtn')
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

  function defaultDischargeState() {
    return { ...DEFAULT_DISCHARGE_STATE };
  }

  function sanitizeDischargeState(raw) {
    const next = defaultDischargeState();
    if (!raw || typeof raw !== 'object') return next;

    [
      'include_uncertainty',
      'include_return_precautions',
      'include_shared_decision'
    ].forEach((key) => {
      if (typeof raw[key] === 'boolean') {
        next[key] = raw[key];
      }
    });

    [
      'complaint',
      'working_diagnosis',
      'return_triggers',
      'followup_with',
      'followup_timeframe',
      'additional_notes'
    ].forEach((key) => {
      if (typeof raw[key] === 'string') {
        next[key] = raw[key];
      }
    });

    return next;
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

      if (!parsed) return;
      if (!parsed || typeof parsed !== 'object') return;

      // Keep expanded mode as default on load.

      if (typeof parsed.activePackId === 'string') {
        state.savedActivePackId = parsed.activePackId;
      }

      if (Array.isArray(parsed.dotphraseFavorites)) {
        state.dotphraseFavorites = new Set(
          parsed.dotphraseFavorites.map((id) => normalizeId(id)).filter(Boolean)
        );
      }

      state.discharge = sanitizeDischargeState(parsed.discharge);

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
      // Ignore invalid saved state.
    }
  }

  function saveState() {
    const storage = safeLocalStorage();
    if (!storage) return;

    try {
      const payload = {
        activePackId: state.activePack ? state.activePack.id : state.savedActivePackId,
        packs: state.savedByPack,
        dotphraseFavorites: [...state.dotphraseFavorites],
        discharge: state.discharge
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
    const interp = score === 0 ? 'very low risk — no imaging required by score alone'
      : score === 1 ? 'intermediate risk — clinical judgment required'
      : score === 2 ? 'high risk — aortic imaging indicated'
      : 'very high risk — emergent CTA aorta';
    const className = score === 0 ? CALC_LOW : score === 1 ? CALC_MODERATE : CALC_HIGH;
    return {
      ready: true,
      className,
      preview: `ADD-RS: ${score}/3 — ${interp}`,
      scoreText: `${score}/3`,
      interpretation: interp,
      details: `ADD-RS score ${score}/3: ${interp}.`
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
    const interp = positive
      ? `positive (${count}/6 criteria present) — LP or CTA head/neck indicated`
      : 'negative (0/6 criteria) — SAH workup not indicated by rule';
    const className = positive ? CALC_HIGH : CALC_LOW;
    return {
      ready: true,
      className,
      preview: `Ottawa SAH: ${positive ? 'POSITIVE' : 'NEGATIVE'} — ${count}/6 criteria`,
      scoreText: `${count}/6`,
      interpretation: interp,
      details: `Ottawa SAH Rule: ${positive ? 'positive' : 'negative'} — ${interp}.`
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
      case 'wells_pe':
        return evaluateWellsPeCalculator(values);
      case 'perc':
        return evaluatePercCalculator(values);
      case 'curb65':
        return evaluateCurb65Calculator(values);
      case 'qsofa':
        return evaluateQsofaCalculator(values);
      case 'alvarado':
        return evaluateAlvaradoCalculator(values);
      case 'glasgow_blatchford':
        return evaluateGlasgowBlatchfordCalculator(values);
      case 'canadian_syncope':
        return evaluateCanadianSyncopeCalculator(values);
      case 'canadian_ct_head':
        return evaluateCanadianCtHeadCalculator(values);
      case 'pecarn':
        return evaluatePecarnCalculator(values);
      case 'nexus_cspine':
        return evaluateNexusCspineCalculator(values);
      case 'add_rs':
        return evaluateAddRsCalculator(values);
      case 'ottawa_sah':
        return evaluateOttawaSahCalculator(values);
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
    if (!getSelectedDdxItems(pack).length) {
      return [];
    }
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
      return '';
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
      const lookup = phraseLookup(id);
      if (lookup.exists && lookup.text) {
        return `- ${lookup.text}`;
      }

      return `- ${formatDotphrase(id)}`;
    });

    return ['Rule-outs:', ...lines].join('\n');
  }

  function buildHistoryForMdmText() {
    const summary = buildHistorySummaryText();
    if (!summary || summary === 'No history questions answered.') {
      return '';
    }

    const lines = [];
    summary.split('\n').forEach((line) => {
      const clean = String(line || '').trim();
      if (!clean) return;
      if (clean.endsWith(':') && !clean.startsWith('[')) {
        lines.push(clean);
        return;
      }
      lines.push(`- ${clean}`);
    });

    if (!lines.length) return '';
    return ['History highlights:', ...lines].join('\n');
  }

  function buildMdmCoreText(pack) {
    const sections = [
      'MDM',
      buildDdxText(pack)
    ];

    const riskText = buildRiskText(pack);
    if (riskText) {
      sections.push(riskText);
    }

    sections.push(buildRuleoutsText());
    return sections.join('\n\n');
  }

  function buildMdmText(pack) {
    const sections = [];
    const historyText = buildHistoryForMdmText();
    if (historyText) {
      sections.push(historyText);
    }
    sections.push(buildMdmCoreText(pack));
    return sections.join('\n\n');
  }

  function buildUnifiedPreviewText(pack) {
    const sections = [buildMdmText(pack)];
    const dischargeText = buildDischargeText();
    if (dischargeText) {
      sections.push('Discharge Instructions:\n' + dischargeText);
    }
    return sections.join('\n\n');
  }

  function buildAutoDischargeComplaint() {
    if (state.activePack && state.activePack.title) {
      return normalizeLabel(state.activePack.title);
    }
    return '';
  }

  function buildAutoDischargeDiagnosis() {
    if (!state.activePack) return '';
    const labels = getSelectedDdxItems(state.activePack).map((item) => normalizeLabel(item.label)).filter(Boolean);
    if (!labels.length) return '';
    if (labels.length <= 3) return labels.join(', ');
    return labels.slice(0, 3).join(', ') + ', and other considered etiologies';
  }

  function buildDischargeText() {
    const complaint = normalizeLabel(state.discharge.complaint) || buildAutoDischargeComplaint() || '[chief complaint]';
    const diagnosis = normalizeLabel(state.discharge.working_diagnosis) || buildAutoDischargeDiagnosis() || '[working diagnosis]';
    const returnTriggers = normalizeLabel(state.discharge.return_triggers) || '[specific return precautions]';
    const followWith = normalizeLabel(state.discharge.followup_with) || '[follow-up provider/clinic]';
    const followTime = normalizeLabel(state.discharge.followup_timeframe) || '[follow-up timeframe]';
    const additional = normalizeLabel(state.discharge.additional_notes);

    const lines = [
      `Discharge diagnosis today: ${diagnosis}.`
    ];

    if (state.discharge.include_uncertainty) {
      lines.push(`I discussed with the patient that today's ED evaluation for ${complaint} did not identify a definitive life-threatening diagnosis, and diagnostic uncertainty remains. The patient understands a serious condition can evolve after discharge and agrees with strict return precautions.`);
    }

    if (state.discharge.include_shared_decision) {
      lines.push('Shared decision-making discussion was completed regarding discharge versus additional observation/testing. Patient verbalized understanding of the low but non-zero residual risk and agrees with this plan.');
    }

    if (state.discharge.include_return_precautions) {
      lines.push(`Patient instructed to return to the ED immediately for: ${returnTriggers}.`);
    }

    lines.push(`Follow up with ${followWith} within ${followTime} for reassessment and continued evaluation.`);

    if (additional) {
      lines.push(additional);
    }

    return lines.join('\n\n');
  }

  function setDischargePreview() {
    setPreview();
  }

  function renderDischargeBuilder() {
    if (!els.dischargeBuilder) return;
    const fields = els.dischargeBuilder.querySelectorAll('[data-discharge-field]');
    fields.forEach((field) => {
      const key = field.dataset.dischargeField;
      if (!key || !Object.prototype.hasOwnProperty.call(state.discharge, key)) return;
      if (field instanceof HTMLInputElement && field.type === 'checkbox') {
        field.checked = Boolean(state.discharge[key]);
        return;
      }
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
        if (key === 'complaint') {
          field.value = String(state.discharge[key] || buildAutoDischargeComplaint() || '');
          return;
        }
        if (key === 'working_diagnosis') {
          field.value = String(state.discharge[key] || buildAutoDischargeDiagnosis() || '');
          return;
        }
        field.value = String(state.discharge[key] || '');
      }
    });
  }

  function setPreview() {
    var previewText = '';
    if (state.activePack) {
      previewText = buildUnifiedPreviewText(state.activePack);
    }
    if (els.preview) {
      els.preview.value = previewText;
    }
  }

  function evaluateQualityChecks(pack) {
    const checks = [];
    const selectedDdx = getSelectedDdxItems(pack);
    const hasLifeThreat = selectedDdx.some((item) => String(item.group || '').toLowerCase() === 'life-threatening');

    if (!selectedDdx.length) {
      checks.push({
        level: 'warn',
        title: 'DDx not selected',
        detail: 'Select at least one likely diagnosis before copying MDM text.'
      });
    } else if (!hasLifeThreat) {
      checks.push({
        level: 'warn',
        title: 'No life-threatening diagnosis selected',
        detail: 'Add at least one life-threatening DDx when clinically appropriate to strengthen defensibility.'
      });
    } else {
      checks.push({
        level: 'ok',
        title: 'DDx scope documented',
        detail: `${selectedDdx.length} DDx selected with life-threatening coverage.`
      });
    }

    const availableRuleouts = state.availableRuleoutIds || [];
    const selectedRuleouts = getSelectedRuleoutIds();
    if (!availableRuleouts.length && selectedDdx.length) {
      checks.push({
        level: 'warn',
        title: 'No linked rule-outs available',
        detail: 'This DDx combination has no linked rule-out phrases configured yet.'
      });
    } else if (!selectedRuleouts.length) {
      checks.push({
        level: 'warn',
        title: 'Rule-outs not selected',
        detail: 'Select rule-out phrases to document what was considered and excluded.'
      });
    } else {
      checks.push({
        level: 'ok',
        title: 'Rule-outs selected',
        detail: `${selectedRuleouts.length} rule-out phrase${selectedRuleouts.length === 1 ? '' : 's'} included.`
      });
    }

    const missingRuleouts = selectedRuleouts.filter((id) => !phraseLookup(id).exists);
    if (missingRuleouts.length) {
      const label = missingRuleouts.map((id) => formatDotphrase(id)).join(', ');
      checks.push({
        level: 'warn',
        title: 'Missing dotphrase definitions',
        detail: `Missing in dotphrase library: ${label}. Output will fall back to ID text.`
      });
    }

    const visibleRisks = getVisibleRiskToggles(pack);
    const selectedRiskToggles = visibleRisks.filter((toggle) => state.selectedRisks.has(toggle.id));
    if (visibleRisks.length && !selectedRiskToggles.length) {
      checks.push({
        level: 'warn',
        title: 'Risk tools not documented',
        detail: 'Select at least one relevant risk tool when available for this complaint.'
      });
    } else if (selectedRiskToggles.length) {
      checks.push({
        level: 'ok',
        title: 'Risk modifiers included',
        detail: `${selectedRiskToggles.length} risk tool${selectedRiskToggles.length === 1 ? '' : 's'} selected.`
      });
    }

    const incompleteCalcs = selectedRiskToggles
      .filter((toggle) => toggle.calculator && toggle.calculator.type)
      .filter((toggle) => !evaluateRiskCalculator(toggle).ready)
      .map((toggle) => toggle.label);

    if (incompleteCalcs.length) {
      checks.push({
        level: 'warn',
        title: 'Calculator entries incomplete',
        detail: `Complete calculator inputs for: ${incompleteCalcs.join('; ')}.`
      });
    }

    return checks;
  }

  function renderQualityChecks() {
    if (!els.qualityContainer || !els.qualityCount) return;
    if (!state.activePack) {
      els.qualityCount.textContent = '0 warnings';
      els.qualityContainer.innerHTML = '<p class="empty-block">No pack selected.</p>';
      return;
    }

    const checks = evaluateQualityChecks(state.activePack);
    const warnings = checks.filter((item) => item.level === 'warn').length;
    els.qualityCount.textContent = `${warnings} warning${warnings === 1 ? '' : 's'}`;

    els.qualityContainer.innerHTML = checks.map((item) => {
      const levelClass = item.level === 'warn' ? 'warn' : 'ok';
      return `
        <div class="quality-item ${levelClass}">
          <span class="quality-title">${escapeHtml(item.title)}</span>
          ${escapeHtml(item.detail)}
        </div>
      `;
    }).join('');
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

    const helperHref = CALC_HELPER_LINKS[calcType] || '';
    const helperLink = helperHref
      ? `<a class="risk-calc-link" href="${escapeHtml(helperHref)}">Open full calculator</a>`
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

    const selectedDdxCount = getSelectedDdxItems(pack).length;
    if (!selectedDdxCount) {
      els.riskContainer.innerHTML = '<p class="empty-block">Select DDx items to show context-aware risk tools.</p>';
      return;
    }

    const visible = getVisibleRiskToggles(pack);
    if (!visible.length) {
      els.riskContainer.innerHTML = '<p class="empty-block">No risk tools for current DDx selection.</p>';
      return;
    }

    // Preserve which tools are currently expanded before re-render
    const openIds = new Set(
      Array.from(els.riskContainer.querySelectorAll('details.risk-row[open]'))
        .map(d => (d.getAttribute('id') || '').replace('risk-tool-', ''))
        .filter(Boolean)
    );

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

      const criteria = getCriteriaForToggle(toggle);
      const criteriaHtml = criteria
        ? `<ul class="risk-criteria-list">${criteria.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>`
        : '';

      // Open if checked, previously open, or has no collapsible content
      const shouldOpen = isChecked || openIds.has(toggle.id);

      return `
        <details class="risk-row" id="risk-tool-${escapeHtml(toggle.id)}"${shouldOpen ? ' open' : ''}>
          <summary class="risk-row-summary">
            <label class="check-row" onclick="event.stopPropagation()">
              <input type="checkbox" data-role="risk" data-risk-id="${escapeHtml(toggle.id)}" ${checkedAttr}>
              <span>${escapeHtml(toggle.label)}</span>
            </label>
            <span class="risk-row-chevron" aria-hidden="true"></span>
          </summary>
          ${criteriaHtml}
          ${inputHtml}
        </details>
      `;
    }).join('');
  }

  function getCriteriaForToggle(toggle) {
    if (!toggle) return null;
    // Calculator-based tools: look up by calculator type
    if (toggle.calculator && toggle.calculator.type) {
      return RISK_TOOL_CRITERIA[toggle.calculator.type] || null;
    }
    // Input/checkbox tools: look up by toggle ID
    return RISK_TOOL_CRITERIA[toggle.id] || null;
  }

  function renderAliasHint() {
    if (!state.activePack) {
      els.aliasHint.textContent = '';
      return;
    }
    const aliases = [state.activePack.id].concat(Array.isArray(state.activePack.aliases) ? state.activePack.aliases : []);
    els.aliasHint.textContent = `Commands: ${aliases.join(', ')}`;
  }

  function getDocTabMap() {
    return {
      mdm: els.panelMdmBuilder,
      dotphrase: els.panelDotphrase,
      discharge: els.panelDischargeBuilder,
      history: els.panelHistoryHelper
    };
  }

  function updateDocTabButtons(activeTab) {
    const tabs = [
      { el: els.tabMdmBuilder, id: 'mdm' },
      { el: els.tabDotphrase, id: 'dotphrase' },
      { el: els.tabDischarge, id: 'discharge' },
      { el: els.tabHistoryHelper, id: 'history' }
    ];
    tabs.forEach((tab) => {
      if (!tab.el) return;
      const isActive = tab.id === activeTab;
      tab.el.classList.toggle('active', isActive);
      tab.el.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function activateDocTab(tabId, options = {}) {
    const map = getDocTabMap();
    if (!Object.prototype.hasOwnProperty.call(map, tabId)) return;
    state.activeDocTab = tabId;
    const target = map[tabId];
    if (target) {
      target.open = true;
    }
    updateDocTabButtons(tabId);

    if (options.scroll === false) return;
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function syncDocTabFromOpenPanels() {
    const map = getDocTabMap();
    const order = ['mdm', 'dotphrase', 'discharge', 'history'];
    const openId = order.find((id) => map[id] && map[id].open) || state.activeDocTab || 'mdm';
    state.activeDocTab = openId;
    updateDocTabButtons(openId);
  }

  function renderCompletenessIndicators() {
    if (!els.completenessIndicators) return;
    if (!state.activePack) {
      els.completenessIndicators.innerHTML = [
        '<span class="status-pill neutral">DDx: 0</span>',
        '<span class="status-pill neutral">Rule-outs: 0</span>',
        '<span class="status-pill neutral">Risk: 0</span>'
      ].join('');
      return;
    }

    const selectedDdx = getSelectedDdxItems(state.activePack);
    const ddxCount = selectedDdx.length;
    const availableRuleouts = state.availableRuleoutIds.length;
    const selectedRuleouts = getSelectedRuleoutIds().length;
    const visibleRisks = getVisibleRiskToggles(state.activePack);
    const selectedRisks = visibleRisks.filter((toggle) => state.selectedRisks.has(toggle.id)).length;

    const ddxStatus = ddxCount > 0 ? 'ok' : 'warn';

    let ruleStatus = 'neutral';
    let ruleText = 'Rule-outs: N/A';
    if (availableRuleouts > 0) {
      ruleStatus = selectedRuleouts > 0 ? 'ok' : 'warn';
      ruleText = `Rule-outs: ${selectedRuleouts}/${availableRuleouts}`;
    }

    let riskStatus = 'neutral';
    let riskText = 'Risk: hidden';
    if (ddxCount > 0) {
      if (visibleRisks.length > 0) {
        riskStatus = selectedRisks > 0 ? 'ok' : 'warn';
        riskText = `Risk: ${selectedRisks}/${visibleRisks.length}`;
      } else {
        riskText = 'Risk: N/A';
      }
    }

    els.completenessIndicators.innerHTML = [
      `<span class="status-pill ${ddxStatus}">DDx: ${ddxCount}</span>`,
      `<span class="status-pill ${ruleStatus}">${ruleText}</span>`,
      `<span class="status-pill ${riskStatus}">${riskText}</span>`
    ].join('');
  }

  function renderCounts() {
    const ddxCount = state.selectedDdx.size;
    const ruleoutCount = getSelectedRuleoutIds().length;
    const riskCount = state.selectedRisks.size;

    els.ddxCount.textContent = `${ddxCount} selected`;
    els.ruleoutCount.textContent = `${ruleoutCount} selected`;
    els.riskCount.textContent = `${riskCount} selected`;
    renderCompletenessIndicators();
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
        favorite: state.dotphraseFavorites.has(id),
        score
      });
    });

    rows.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.linked !== b.linked) return a.linked ? -1 : 1;
      return a.cond.localeCompare(b.cond);
    });

    return rows;
  }

  function getFavoriteDotphraseRows() {
    const all = Array.isArray(window.KP_DOTPHRASES) ? window.KP_DOTPHRASES : [];
    const favorites = state.dotphraseFavorites || new Set();
    const queryRaw = normalizeLabel(els.dotphraseSearchInput ? els.dotphraseSearchInput.value : '').toLowerCase();
    const tokens = queryRaw ? queryRaw.split(/\s+/).filter(Boolean) : [];
    const linkedRuleouts = new Set(state.availableRuleoutIds || []);

    const rows = [];
    all.forEach((item) => {
      const id = normalizeId(item && item.dot);
      if (!id || !favorites.has(id)) return;

      const cond = normalizeLabel(item && item.cond);
      const cat = normalizeLabel(item && item.cat);
      const text = normalizeLabel(item && item.text);
      const searchable = `${id} ${cond} ${cat} ${text}`.toLowerCase();

      if (tokens.length && !tokens.every((token) => searchable.includes(token))) {
        return;
      }

      rows.push({
        id,
        cond,
        cat,
        text,
        linked: linkedRuleouts.has(id),
        selected: state.selectedRuleouts.has(id),
        favorite: true
      });
    });

    rows.sort((a, b) => {
      if (a.linked !== b.linked) return a.linked ? -1 : 1;
      return a.cond.localeCompare(b.cond);
    });
    return rows;
  }

  function renderDotphraseCards(rows, emptyMessage) {
    if (!rows.length) {
      return `<div class="dotphrase-empty">${escapeHtml(emptyMessage)}</div>`;
    }

    return rows.map((row) => {
      const dotTag = formatDotphrase(row.id);
      const linkedClass = row.linked ? ' linked' : '';
      const favoriteClass = row.favorite ? ' favorite' : '';
      const snippet = truncateText(row.text, 180);
      const toggleButton = row.linked
        ? `<button class="dotphrase-btn" type="button" data-role="toggle-linked-ruleout" data-dot-id="${escapeHtml(row.id)}">${row.selected ? 'Remove from Rule-outs' : 'Add to Rule-outs'}</button>`
        : '';

      return `
        <article class="dotphrase-item${linkedClass}${favoriteClass}">
          <div class="dotphrase-meta">
            <span class="dotphrase-dot">${escapeHtml(dotTag)}</span>
            <span class="dotphrase-cat">${escapeHtml(row.cat || 'General')}</span>
          </div>
          <div class="dotphrase-cond">${escapeHtml(row.cond || 'Untitled Dotphrase')}</div>
          <div class="dotphrase-snippet">${escapeHtml(snippet || 'No phrase text available.')}</div>
          <div class="dotphrase-actions">
            <button class="dotphrase-btn" type="button" data-role="copy-dot-text" data-dot-id="${escapeHtml(row.id)}">Copy Expanded Text</button>
            <button class="dotphrase-btn favorite ${row.favorite ? 'active' : ''}" type="button" data-role="toggle-favorite" data-dot-id="${escapeHtml(row.id)}">${row.favorite ? 'Unpin' : 'Pin'}</button>
            ${toggleButton}
          </div>
        </article>
      `;
    }).join('');
  }

  function toggleDotphraseFavorite(dotId) {
    const clean = normalizeId(dotId);
    if (!clean) return;
    if (state.dotphraseFavorites.has(clean)) {
      state.dotphraseFavorites.delete(clean);
    } else {
      state.dotphraseFavorites.add(clean);
    }
    renderDotphraseLookup();
    saveState();
  }

  function renderDotphraseLookup() {
    if (!els.dotphraseQuickList || !els.dotphraseMatchCount) return;

    const rows = getDotphraseRows();
    const favoriteRows = getFavoriteDotphraseRows();
    const favoriteIds = new Set(favoriteRows.map((row) => row.id));
    const mainRows = rows.filter((row) => !favoriteIds.has(row.id));

    els.dotphraseMatchCount.textContent = `${mainRows.length} shown`;
    if (els.dotphraseFavoritesCount) {
      els.dotphraseFavoritesCount.textContent = String(favoriteRows.length);
    }
    if (els.dotphraseFavoritesList) {
      els.dotphraseFavoritesList.innerHTML = renderDotphraseCards(
        favoriteRows,
        'No pinned dotphrases yet. Use Pin on any phrase you use often.'
      );
    }

    els.dotphraseQuickList.innerHTML = renderDotphraseCards(
      mainRows,
      'No dotphrases match this search. Try a shorter keyword.'
    );
  }

  // ── History Helper ──────────────────────────────────────────────

  async function loadHistoryQuestionsIfNeeded() {
    if (state.historyLoaded || state.historyLoading) return;
    state.historyLoading = true;
    state.historyLoadError = '';
    try {
      var response = await fetch('history_helper.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load history_helper.json');
      state.historyQuestions = await response.json();
      indexHistoryQuestions();
      state.historyLoaded = true;
    } catch (e) {
      state.historyLoadError = 'History helper data failed to load. Ensure history_helper.json is present and uploaded.';
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
    var packs = state.historyQuestions && state.historyQuestions.packs && typeof state.historyQuestions.packs === 'object'
      ? state.historyQuestions.packs
      : {};

    Object.keys(packs).forEach(function (packId) {
      var packData = packs[packId];
      if (!packData || typeof packData !== 'object' || !packData.ddx_questions) return;

      Object.keys(packData.ddx_questions).forEach(function (ddxLabel) {
        var questions = packData.ddx_questions[ddxLabel];
        if (!Array.isArray(questions)) return;

        questions.forEach(function (q) {
          if (!q || typeof q !== 'object') return;
          var qId = String(q.id || '').trim();
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

  function inferHistoryRiskMappings(meta) {
    var mappings = [];
    var seen = new Set();
    function add(calcType, fieldId) {
      if (!calcType || !fieldId) return;
      var key = calcType + ':' + fieldId;
      if (seen.has(key)) return;
      seen.add(key);
      mappings.push({ calcType: calcType, fieldId: fieldId });
    }

    if (!meta) return mappings;
    var ddx = normalizeLabel(meta.ddxLabel).toLowerCase();
    var text = normalizeLabel(meta.text).toLowerCase();
    var qId = String(meta.id || '').toLowerCase();

    // ── PE → Wells PE + PERC + YEARS ─────────────────────────────────────
    var peContext = ddx === 'pe' || ddx.includes('pulmonary embol') || qId.includes('_pe_');
    if (peContext) {
      add('wells_pe', 'general'); add('perc', 'general'); add('years', 'general'); // ensure tags show
      if (/(history|prior).{0,20}\b(dvt|pe)\b|\b(dvt|pe)\b.{0,20}(history|prior)/.test(text)) {
        add('wells_pe', 'prior_pe_dvt');
        add('perc', 'prior_pe_dvt');
      }
      if (/\b(estrogen|ocp|hrt)\b/.test(text)) {
        add('perc', 'estrogen_use');
      }
      if (/\b(surgery|immobil|travel)\b/.test(text)) {
        add('wells_pe', 'immobilization_or_recent_surgery');
        add('perc', 'recent_surgery_trauma');
      }
      if (/unilateral leg swelling|leg swelling|leg pain|leg redness|signs? of dvt/.test(text)) {
        add('wells_pe', 'dvt_signs');
        add('perc', 'unilateral_leg_swelling');
        add('years', 'dvt_signs');
      }
      if (/\bhemoptysis\b/.test(text)) {
        add('wells_pe', 'hemoptysis');
        add('perc', 'hemoptysis');
        add('years', 'hemoptysis');
      }
      if (/\bmalignan|chemotherap/.test(text)) {
        add('wells_pe', 'malignancy');
      }
    }

    // ── ACS → HEART ────────────────────────────────────────────────────────
    var acsContext = ddx.includes('acs') || qId.includes('_acs_');
    if (acsContext) {
      add('heart', 'general'); // ensure tag shows
      if (/(known cad|prior mi|stent|cabg|atherosclerotic|history of heart disease)/.test(text)) {
        add('heart', 'risk_known_athero');
      }
      if (/family history/.test(text) && /\b(cad|mi|heart)\b/.test(text)) {
        add('heart', 'risk_family_history');
      }
      if (/hypertension|htn/.test(text)) { add('heart', 'risk_htn'); }
      if (/hyperlipidemia|hld|cholesterol/.test(text)) { add('heart', 'risk_hld'); }
      if (/diabet/.test(text)) { add('heart', 'risk_dm'); }
      if (/smok/.test(text)) { add('heart', 'risk_smoker'); }
      if (/obes/.test(text)) { add('heart', 'risk_obesity'); }
      if (/substernal|pressure|squeezing|exertion|radiation|diaphor|nausea/.test(text)) {
        add('heart', 'history');
      }
    }

    // ── SAH → Ottawa SAH Rule (6 boolean criteria) ─────────────────────────
    var sahContext = ddx === 'sah' || qId.startsWith('ha_sah');
    if (sahContext) {
      add('ottawa_sah', 'general'); // ensure tag shows on all SAH questions
      if (/age.*40|40.*age|\[ottawa.*1\]/.test(text)) { add('ottawa_sah', 'age_ge_40'); }
      if (/neck pain|neck stiffness|stiff neck|\[ottawa.*2\]/.test(text)) { add('ottawa_sah', 'neck_pain_stiffness'); }
      if (/witnessed.*loss|loss.*conscious|\[ottawa.*3\]/.test(text)) { add('ottawa_sah', 'witnessed_loc'); }
      if (/exertion|valsalva|sexual|\[ottawa.*4\]/.test(text)) { add('ottawa_sah', 'onset_exertion'); }
      if (/thunderclap|maximal.*onset|onset.*within seconds|\[ottawa.*5\]/.test(text)) { add('ottawa_sah', 'thunderclap_onset'); }
      if (/limited neck|neck flexion|\[ottawa.*6\]/.test(text)) { add('ottawa_sah', 'limited_neck_flexion'); }
    }

    // ── TIA → ABCD2 ────────────────────────────────────────────────────────
    var tiaContext = ddx === 'tia' || qId.includes('_tia_');
    if (tiaContext) {
      add('abcd2', 'general'); // ensure tag shows
      if (/diabet/.test(text)) { add('abcd2', 'diabetes'); }
      if (/focal|unilateral|weakness|speech/.test(text)) { add('abcd2', 'clinical'); }
    }

    // ── Minor head injury (adult) → Canadian CT Head Rule ─────────────────
    var cthContext = ddx.includes('minor head injury') && ddx.includes('adult');
    if (cthContext) {
      add('canadian_ct_head', 'general');
      if (/vomit/.test(text)) { add('canadian_ct_head', 'vomiting_ge_2'); }
      if (/amnesia/.test(text)) { add('canadian_ct_head', 'amnesia_ge_30m'); }
      if (/age.*65|65.*age/.test(text)) { add('canadian_ct_head', 'age_ge_65'); }
      if (/mechanism|vehicle|pedestrian|height/.test(text)) { add('canadian_ct_head', 'dangerous_mechanism'); }
    }

    // ── Minor head injury (peds) → PECARN ─────────────────────────────────
    var pedsContext = ddx.includes('minor head injury') && (ddx.includes('peds') || ddx.includes('child'));
    if (pedsContext) {
      add('pecarn', 'general');
      if (/loss of consciousness|loc/.test(text)) { add('pecarn', 'ge2_history_loc'); add('pecarn', 'u2_loc_ge_5s'); }
      if (/vomit/.test(text)) { add('pecarn', 'ge2_vomiting'); }
      if (/headache/.test(text)) { add('pecarn', 'ge2_severe_headache'); }
      if (/mechanism/.test(text)) { add('pecarn', 'ge2_severe_mechanism'); add('pecarn', 'u2_severe_mechanism'); }
    }

    // ── Cervical spine → NEXUS ─────────────────────────────────────────────
    var cspineContext = ddx.includes('cervical') || qId.includes('_csp_');
    if (cspineContext) {
      add('nexus_cspine', 'general');
      if (/midline|tenderness|neck pain/.test(text)) { add('nexus_cspine', 'midline_tenderness'); }
      if (/focal neuro|neurologic/.test(text)) { add('nexus_cspine', 'focal_neuro_deficit'); }
      if (/altered|confusion|mental status/.test(text)) { add('nexus_cspine', 'altered_alertness'); }
      if (/intoxicat|alcohol|drug/.test(text)) { add('nexus_cspine', 'intoxication'); }
      if (/distract|other injury|fracture/.test(text)) { add('nexus_cspine', 'distracting_injury'); }
    }

    // ── Syncope → Canadian Syncope Risk Score ─────────────────────────────
    var syncopeContext = ddx === 'syncope' || ddx.includes('vasovagal') || ddx.includes('arrhythmic syncope') || qId.includes('syn_arr') || qId.includes('syn_vvs');
    if (syncopeContext) {
      add('canadian_syncope', 'general');
      if (/history.*heart|cardiac history|heart disease/.test(text)) { add('canadian_syncope', 'history_heart_disease'); }
      if (/vasovagal|prodrome|position/.test(text)) { add('canadian_syncope', 'predisposition_vasovagal'); }
    }

    // ── AFib → CHA2DS2-VASc ────────────────────────────────────────────────
    var afibContext = ddx.includes('afib') || qId.includes('_afib_');
    if (afibContext) {
      add('cha2ds2_vasc', 'general');
      if (/stroke|tia|thromboembol/.test(text)) { add('cha2ds2_vasc', 'stroke_tia_thromboembolism'); }
      if (/heart failure|chf/.test(text)) { add('cha2ds2_vasc', 'chf'); }
      if (/hypertension|htn/.test(text)) { add('cha2ds2_vasc', 'htn'); }
      if (/diabet/.test(text)) { add('cha2ds2_vasc', 'diabetes'); }
      if (/vascular|mi|peripheral arterial|aortic plaque/.test(text)) { add('cha2ds2_vasc', 'vascular'); }
    }

    // ── Aortic dissection → ADD-RS (3 boolean categories) ─────────────────
    var dissectionContext = ddx.includes('dissection') || qId.includes('_dis_');
    if (dissectionContext) {
      add('add_rs', 'general'); // ensure tag shows on all dissection questions
      if (/marfan|connective tissue|bicuspid|aortic valve|prior aortic|family history.*aortic|aortic.*family/.test(text)) {
        add('add_rs', 'high_risk_condition');
      }
      if (/tearing|ripping|sudden onset|abrupt onset|maximal at onset/.test(text)) {
        add('add_rs', 'high_risk_pain');
      }
      if (/pulse deficit|unequal pulse|bp differential|blood pressure differential|focal neuro|aortic regurgitation|hypotension|shock/.test(text)) {
        add('add_rs', 'high_risk_exam');
      }
    }

    // ── Appendicitis → Alvarado ────────────────────────────────────────────
    var appendicitis = ddx.includes('appendicitis') || qId.includes('_app_');
    if (appendicitis) {
      add('alvarado', 'general');
      if (/migrat|pain.*start.*navel|navel.*pain/.test(text)) { add('alvarado', 'migration'); }
      if (/anorex|appetite/.test(text)) { add('alvarado', 'anorexia'); }
      if (/nausea|vomit/.test(text)) { add('alvarado', 'nausea_vomiting'); }
      if (/rlq|right lower|mcburney/.test(text)) { add('alvarado', 'rlq_tenderness'); }
      if (/rebound|peritoneal/.test(text)) { add('alvarado', 'rebound'); }
      if (/fever/.test(text)) { add('alvarado', 'fever'); }
    }

    // ── Upper GI bleed → Glasgow-Blatchford + Rockall ─────────────────────
    var ugiContext = ddx.includes('upper gi') || qId.startsWith('abd_ugi') || qId.startsWith('gib_ugi');
    if (ugiContext) {
      add('glasgow_blatchford', 'general');
      add('rockall', 'general');
      if (/melena/.test(text)) { add('glasgow_blatchford', 'melena'); }
      if (/syncope/.test(text)) { add('glasgow_blatchford', 'syncope'); }
      if (/liver|hepatic|cirrhosis/.test(text)) { add('glasgow_blatchford', 'hepatic_disease'); }
      if (/heart failure|chf/.test(text)) { add('glasgow_blatchford', 'heart_failure'); }
    }

    // ── Lower GI bleed → Glasgow-Blatchford + Oakland ─────────────────────
    var lgiContext = ddx.includes('lower gi') || qId.startsWith('gib_lgi');
    if (lgiContext) {
      add('glasgow_blatchford', 'general');
      add('oakland', 'general');
      if (/syncope/.test(text)) { add('glasgow_blatchford', 'syncope'); }
    }

    // ── Variceal → Glasgow-Blatchford + Rockall ───────────────────────────
    var varContext = ddx.includes('variceal') || qId.startsWith('gib_var');
    if (varContext) {
      add('glasgow_blatchford', 'general');
      add('rockall', 'general');
      if (/liver|hepatic|cirrhosis/.test(text)) { add('glasgow_blatchford', 'hepatic_disease'); }
    }

    // ── Pancreatitis → BISAP ──────────────────────────────────────────────
    var pancContext = ddx === 'pancreatitis' || qId.startsWith('abd_pan');
    if (pancContext) {
      add('bisap', 'general');
    }

    // ── Pneumonia → CURB-65 ────────────────────────────────────────────────
    var pnaContext = ddx === 'pneumonia' || qId.startsWith('sob_pna') || qId.startsWith('fev_pna') || qId.startsWith('ccp_pna');
    if (pnaContext) {
      add('curb65', 'general');
      if (/confusion|altered|mental status/.test(text)) { add('curb65', 'confusion'); }
      if (/age.*65|65.*age|elderly/.test(text)) { add('curb65', 'age_ge_65'); }
    }

    // ── Bacteremia / sepsis → qSOFA + SOFA ────────────────────────────────
    var sepsisContext = ddx.includes('bacteremia') || ddx.includes('sepsis') || qId.startsWith('fev_sep') || qId.startsWith('ams_sep');
    if (sepsisContext) {
      add('qsofa', 'general');
      add('sofa', 'general');
      if (/altered|confusion|mental status/.test(text)) { add('qsofa', 'altered_mentation'); }
    }

    // ── SSTI → LRINEC ─────────────────────────────────────────────────────
    var sstiContext = ddx === 'ssti' || qId.startsWith('fev_ssti');
    if (sstiContext) {
      add('lrinec', 'general');
    }

    // ── Posterior stroke / peripheral vestibular → HINTS ──────────────────
    var hintsContext = ddx.includes('posterior circulation') || ddx.includes('peripheral vestibular') ||
                       qId.startsWith('diz_str') || qId.startsWith('diz_bppv');
    if (hintsContext) {
      add('hints', 'exam');
    }

    // ── BPPV / peripheral vestibular → Dix-Hallpike ───────────────────────
    var bppvContext = ddx.includes('peripheral vestibular') || ddx.includes('bppv') || qId.startsWith('diz_bppv');
    if (bppvContext) {
      add('dix_hallpike', 'exam');
    }

    // ── CHF → BNP ─────────────────────────────────────────────────────────
    var chfContext = ddx.includes('chf') || ddx.includes('pulmonary edema') || qId.startsWith('sob_chf');
    if (chfContext) {
      add('bnp', 'value');
    }

    // AMS toxicologic → CIWA-Ar (alcohol withdrawal)
    var ciwaContext = ddx.includes('toxicologic') || qId.startsWith('ams_tox');
    if (ciwaContext) {
      if (/alcohol|withdrawal|drink|ciwa/.test(text)) {
        add('ciwa_ar', 'criterion');
      }
    }

    // AMS general → GCS
    var amsContext = qId.startsWith('ams_') || ddx.includes('hypoglycemia') || ddx.includes('metabolic enceph') || ddx.includes('sepsis-associated');
    if (amsContext) {
      if (/mental status|confusion|altered|consciousness/.test(text)) {
        add('gcs', 'score');
      }
    }

    return mappings;
  }

  function getHistoryRiskToolTags(meta) {
    var mappings = inferHistoryRiskMappings(meta);
    if (!mappings.length) return [];

    var seen = new Set();
    var tags = [];
    mappings.forEach(function (mapping) {
      var calcType = String(mapping.calcType || '').trim();
      if (!calcType || seen.has(calcType)) return;
      seen.add(calcType);
      var label = HISTORY_RISK_TOOL_LABELS[calcType];
      if (label && label.short) {
        tags.push({ short: label.short, title: label.full || label.short, calcType: calcType });
        return;
      }
      var fallback = calcType.toUpperCase().replace(/_/g, '-');
      tags.push({ short: fallback, title: fallback, calcType: calcType });
    });
    return tags;
  }

  function setHistorySyncedCalculatorField(pack, calcType, fieldId, value) {
    if (!pack || !calcType || !fieldId) return false;
    var packToggles = Array.isArray(pack.risk_toggles) ? pack.risk_toggles : [];
    var nextValue = Boolean(value);
    var changed = false;

    packToggles.forEach(function (toggle) {
      if (!toggle.calculator || toggle.calculator.type !== calcType) return;
      var inputs = ensureCalculatorInputState(toggle);
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

  function syncAllHistoryAnswersToMdm() {
    if (!state.activePack || !state.historyLoaded || !state.historyQuestions) return;

    clearHistorySyncedRiskInputsForActivePack();
    Object.keys(state.historyAnswers || {}).forEach(function (qId) {
      var answer = state.historyAnswers[qId];
      if (answer === 'yes' || answer === 'no') {
        syncHistoryAnswerToMdm(qId, answer);
      } else {
        syncHistoryAnswerToMdm(qId, '');
      }
    });
  }

  function syncHistoryAnswerToMdm(questionId, answer) {
    if (!state.activePack || !questionId) return;
    var meta = state.historyQuestionMeta[questionId];
    if (!meta || meta.packId !== state.activePack.id) return;

    if (answer === 'yes' && meta.ddxLabel) {
      var hasDdx = (state.activePack.ddx || []).some(function (item) {
        return item.label === meta.ddxLabel;
      });
      if (hasDdx) {
        state.selectedDdx.add(meta.ddxLabel);
      }
    }

    syncRuleouts(state.activePack, { autoSelectNew: true });
    syncRiskToggles(state.activePack);

    var mappings = inferHistoryRiskMappings(meta);
    if (!mappings.length) return;
    var nextValue = answer === 'yes';
    mappings.forEach(function (mapping) {
      setHistorySyncedCalculatorField(state.activePack, mapping.calcType, mapping.fieldId, nextValue);
    });
  }

  function clearHistorySyncedRiskInputsForActivePack() {
    if (!state.activePack || !state.historyLoaded || !state.historyQuestions) return;
    var packData = state.historyQuestions.packs[state.activePack.id];
    if (!packData || !packData.ddx_questions) return;

    var seen = new Set();
    Object.keys(packData.ddx_questions).forEach(function (ddxLabel) {
      var questions = packData.ddx_questions[ddxLabel];
      if (!Array.isArray(questions)) return;
      questions.forEach(function (q) {
        if (!q || typeof q !== 'object') return;
        var meta = {
          id: String(q.id || ''),
          ddxLabel: ddxLabel,
          text: String(q.text || ''),
          category: String(q.category || '')
        };
        inferHistoryRiskMappings(meta).forEach(function (mapping) {
          var key = mapping.calcType + ':' + mapping.fieldId;
          if (seen.has(key)) return;
          seen.add(key);
          setHistorySyncedCalculatorField(state.activePack, mapping.calcType, mapping.fieldId, false);
        });
      });
    });
  }

  function renderHistoryHelper() {
    if (!els.historyHelperContainer) return;
    var pack = state.activePack;
    if (!pack) {
      els.historyHelperContainer.innerHTML = '';
      if (els.historyHelperEmpty) els.historyHelperEmpty.style.display = '';
      if (els.historyHelperCount) els.historyHelperCount.textContent = '0 answered';
      return;
    }

    if (els.historyHelperEmpty) els.historyHelperEmpty.style.display = 'none';
    if (state.historyLoading) {
      els.historyHelperContainer.innerHTML = '<p class="empty-block">Loading history questions...</p>';
      if (els.historyHelperCount) els.historyHelperCount.textContent = '0 answered';
      return;
    }

    if (state.historyLoadError) {
      els.historyHelperContainer.innerHTML = '<p class="empty-block">' + escapeHtml(state.historyLoadError) + '</p>';
      if (els.historyHelperCount) els.historyHelperCount.textContent = '0 answered';
      return;
    }

    if (!state.historyLoaded || !state.historyQuestions) {
      els.historyHelperContainer.innerHTML = '<p class="empty-block">History helper data is unavailable.</p>';
      if (els.historyHelperCount) els.historyHelperCount.textContent = '0 answered';
      return;
    }

    var packData = state.historyQuestions.packs[pack.id];
    if (!packData || !packData.ddx_questions) {
      els.historyHelperContainer.innerHTML = '<p class="empty-block">No history questions for this pack yet.</p>';
      if (els.historyHelperCount) els.historyHelperCount.textContent = '0 answered';
      return;
    }

    var ddxItems = pack.ddx || [];
    var groups = Object.create(null);
    ddxItems.forEach(function (item) {
      var g = item.group || 'Other';
      if (!groups[g]) groups[g] = [];
      groups[g].push(item);
    });

    var orderedGroups = [
      ...GROUP_ORDER.filter(function (g) { return groups[g]; }),
      ...Object.keys(groups).filter(function (g) { return !GROUP_ORDER.includes(g); })
    ];

    var totalAnswered = 0;
    var totalQuestions = 0;

    var html = orderedGroups.map(function (group) {
      var items = groups[group] || [];
      var ddxSections = items.map(function (ddxItem) {
        var questions = packData.ddx_questions[ddxItem.label];
        if (!questions || !questions.length) return '';

        totalQuestions += questions.length;
        var answeredForDdx = 0;
        var questionRows = questions.map(function (q) {
          var answer = state.historyAnswers[q.id] || '';
          if (answer && answer !== '') {
            totalAnswered++;
            answeredForDdx++;
          }

          var rowClass = answer === 'yes' ? 'answered-yes' :
                         answer === 'no' ? 'answered-no' :
                         answer === 'skip' ? 'answered-skip' : '';

          var yesActive = answer === 'yes' ? ' active-yes' : '';
          var noActive = answer === 'no' ? ' active-no' : '';
          var skipActive = answer === 'skip' ? ' active-skip' : '';

          var catTag = q.category
            ? ' <span class="hh-category-tag">' + escapeHtml(q.category) + '</span>'
            : '';
          var questionMeta = {
            id: String(q.id || ''),
            ddxLabel: String(ddxItem.label || ''),
            text: String(q.text || ''),
            category: String(q.category || '')
          };
          var riskToolTags = getHistoryRiskToolTags(questionMeta);
          var riskTag = riskToolTags.map(function (tag) {
            // Find the matching toggle ID in the current pack for linking
            var toggleId = '';
            var packToggles = Array.isArray(pack.risk_toggles) ? pack.risk_toggles : [];
            var matchedToggle = packToggles.find(function (t) {
              if (t.calculator && t.calculator.type === tag.calcType) return true;
              if (t.id === tag.calcType) return true;
              return false;
            });
            if (matchedToggle) toggleId = matchedToggle.id;
            var jumpAttr = toggleId ? ' data-jump-to-risk="' + escapeHtml(toggleId) + '"' : '';
            return ' <button class="hh-risk-tag"' + jumpAttr + ' title="Jump to ' + escapeHtml(tag.title) + ' in MDM Builder" type="button">' + escapeHtml(tag.short) + '</button>';
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

        var ddxKey = String(ddxItem.label || '');
        var isOpen = state.historyExpandedDdx.has(ddxKey);
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

    els.historyHelperContainer.innerHTML = html || '<p class="empty-block">No questions available.</p>';
    if (els.historyHelperCount) {
      els.historyHelperCount.textContent = totalAnswered + '/' + totalQuestions + ' answered';
    }
  }

  function buildHistorySummaryText() {
    if (!state.activePack || !state.historyLoaded || !state.historyQuestions) return '';
    var packData = state.historyQuestions.packs[state.activePack.id];
    if (!packData || !packData.ddx_questions) return '';

    var lines = [];
    var ddxItems = state.activePack.ddx || [];
    ddxItems.forEach(function (ddxItem) {
      var questions = packData.ddx_questions[ddxItem.label];
      if (!questions || !questions.length) return;

      var answered = questions.filter(function (q) {
        return state.historyAnswers[q.id] && state.historyAnswers[q.id] !== 'skip';
      });
      if (!answered.length) return;

      lines.push(ddxItem.label + ':');
      answered.forEach(function (q) {
        var ans = state.historyAnswers[q.id];
        var prefix = ans === 'yes' ? '[+]' : '[-]';
        lines.push('  ' + prefix + ' ' + q.text);
      });
      lines.push('');
    });

    return lines.join('\n').trim() || 'No history questions answered.';
  }

  // ── End History Helper ────────────────────────────────────────

  function renderAll() {
    renderAliasHint();
    renderQuickPackButtons();
    renderDdx();
    renderRuleouts();
    renderRiskToggles();
    renderQualityChecks();
    renderCounts();
    renderDotphraseLookup();
    renderDischargeBuilder();
    setPreview();
    renderHistoryHelper();
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
    state.historyAnswers = Object.create(null);
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

    state.historyAnswers = Object.create(null);
    if (saved.historyAnswers && typeof saved.historyAnswers === 'object') {
      Object.keys(saved.historyAnswers).forEach((qId) => {
        var val = saved.historyAnswers[qId];
        if (val === 'yes' || val === 'no' || val === 'skip') {
          state.historyAnswers[qId] = val;
        }
      });
    }

    if (state.historyLoaded) {
      syncAllHistoryAnswersToMdm();
    }
  }

  function snapshotActivePackState() {
    const serializedInputs = JSON.parse(JSON.stringify(state.riskInputs || {}));
    return {
      selectedDdx: [...state.selectedDdx],
      selectedRuleouts: getSelectedRuleoutIds(),
      selectedRisks: [...state.selectedRisks],
      riskInputs: serializedInputs,
      historyAnswers: Object.assign(Object.create(null), state.historyAnswers)
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
    state.historyExpandedDdx = new Set();
    els.packSelect.value = pack.id;
    els.commandInput.value = pack.id;
    updateCommandValidity(pack.id);

    const saved = state.savedByPack[pack.id];
    if (saved && typeof saved === 'object') {
      applySavedPackState(pack, saved);
    } else {
      applyDefaultPackState(pack);
      if (state.historyLoaded) {
        syncAllHistoryAnswersToMdm();
      }
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

  function selectAllDdx() {
    if (!state.activePack) return;
    const labels = (state.activePack.ddx || []).map((item) => item.label);
    state.selectedDdx = new Set(labels);
    // Select-all should affect DDx only; keep risk tools unchecked.
    state.selectedRisks.clear();
    syncRuleouts(state.activePack, { autoSelectNew: true });
    syncRiskToggles(state.activePack);
    renderAll();
    persistActivePackState();
  }

  function clearDdxSelections() {
    if (!state.activePack) return;
    state.selectedDdx.clear();
    state.selectedRuleouts.clear();
    state.availableRuleoutIds = [];
    syncRuleouts(state.activePack, { autoSelectNew: false });
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

  function applyPanelHash() {
    const hash = normalizeCommand(window.location.hash.replace(/^#/, ''));
    if (!hash) return;
    const aliasToTab = {
      mdmbuilder: 'mdm',
      panelmdmbuilder: 'mdm',
      discharge: 'discharge',
      dischargebuilder: 'discharge',
      paneldischargebuilder: 'discharge',
      dotphraselibrary: 'dotphrase',
      paneldotphrase: 'dotphrase',
      dotphrase: 'dotphrase',
      history: 'history',
      historyhelper: 'history',
      panelhistoryhelper: 'history'
    };
    const tabId = aliasToTab[hash];
    if (!tabId) return;
    activateDocTab(tabId, { scroll: true });
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

    if (els.tabMdmBuilder) {
      els.tabMdmBuilder.addEventListener('click', () => activateDocTab('mdm'));
    }
    if (els.tabDotphrase) {
      els.tabDotphrase.addEventListener('click', () => activateDocTab('dotphrase'));
    }
    if (els.tabDischarge) {
      els.tabDischarge.addEventListener('click', () => activateDocTab('discharge'));
    }
    if (els.tabHistoryHelper) {
      els.tabHistoryHelper.addEventListener('click', () => {
        activateDocTab('history');
        loadHistoryQuestionsIfNeeded().then(() => renderHistoryHelper());
      });
    }

    [els.panelMdmBuilder, els.panelDotphrase, els.panelDischargeBuilder, els.panelHistoryHelper].forEach((panel) => {
      if (!panel) return;
      panel.addEventListener('toggle', syncDocTabFromOpenPanels);
    });

    if (els.historyHelperContainer) {
      els.historyHelperContainer.addEventListener('toggle', (event) => {
        var target = event.target;
        if (!(target instanceof HTMLDetailsElement)) return;
        if (!target.matches('.hh-ddx-section[data-history-ddx]')) return;
        var ddxKey = target.dataset.historyDdx;
        if (!ddxKey) return;
        if (target.open) state.historyExpandedDdx.add(ddxKey);
        else state.historyExpandedDdx.delete(ddxKey);
      }, true);

      els.historyHelperContainer.addEventListener('click', (event) => {
        var target = event.target;
        if (!(target instanceof Element)) return;

        // Risk tag → jump to matching risk tool in MDM Builder
        var jumpBtn = target.closest('[data-jump-to-risk]');
        if (jumpBtn) {
          var toggleId = jumpBtn.dataset.jumpToRisk;
          if (toggleId) {
            // Open MDM Builder panel and activate tab
            if (els.panelMdmBuilder) els.panelMdmBuilder.open = true;
            activateDocTab('mdm', { scroll: false });
            // After tab switch, find + open + scroll + highlight the risk tool
            setTimeout(function () {
              var el = document.getElementById('risk-tool-' + toggleId);
              if (el) {
                el.open = true;
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('risk-row-highlight');
                setTimeout(function () { el.classList.remove('risk-row-highlight'); }, 1400);
              }
            }, 60);
          }
          return;
        }

        var btn = target.closest('.hh-btn[data-question-id]');
        if (!btn) return;
        var qId = btn.dataset.questionId;
        var answer = btn.dataset.answer;
        if (!qId || !answer) return;

        var nextAnswer = answer;
        state.historyAnswers[qId] = nextAnswer;

        syncHistoryAnswerToMdm(qId, nextAnswer);
        renderAll();
        persistActivePackState();
      });
    }

    if (els.historyCopyFullBtn) {
      els.historyCopyFullBtn.addEventListener('click', () => {
        if (!state.activePack) return;
        copyTextWithFeedback(buildMdmText(state.activePack), els.historyCopyFullBtn);
      });
    }

    if (els.historyHelperCopyBtn) {
      els.historyHelperCopyBtn.addEventListener('click', () => {
        var text = buildHistorySummaryText();
        copyTextWithFeedback(text, els.historyHelperCopyBtn);
      });
    }

    if (els.historyHelperResetBtn) {
      els.historyHelperResetBtn.addEventListener('click', () => {
        state.historyAnswers = Object.create(null);
        clearHistorySyncedRiskInputsForActivePack();
        renderAll();
        persistActivePackState();
      });
    }

    if (els.resetPackBtn) {
      els.resetPackBtn.addEventListener('click', resetCurrentPackToDefaults);
    }
    if (els.lifeThreatsBtn) {
      els.lifeThreatsBtn.addEventListener('click', applyLifeThreatsOnly);
    }
    if (els.ddxSelectAllBtn) {
      els.ddxSelectAllBtn.addEventListener('click', selectAllDdx);
    }
    if (els.ddxClearAllBtn) {
      els.ddxClearAllBtn.addEventListener('click', clearDdxSelections);
    }
    if (els.clearDdxBtn) {
      els.clearDdxBtn.addEventListener('click', clearDdxSelections);
    }
    if (els.clearAllBtn) {
      els.clearAllBtn.addEventListener('click', clearAllSelections);
    }
    if (els.stickyCopyFullBtn) {
      els.stickyCopyFullBtn.addEventListener('click', () => {
        if (!state.activePack) return;
        copyTextWithFeedback(buildMdmText(state.activePack), els.stickyCopyFullBtn);
      });
    }
    if (els.stickyLifeThreatsBtn) {
      els.stickyLifeThreatsBtn.addEventListener('click', applyLifeThreatsOnly);
    }
    if (els.stickyResetPackBtn) {
      els.stickyResetPackBtn.addEventListener('click', resetCurrentPackToDefaults);
    }
    if (els.openMdmBuilderBtn) {
      els.openMdmBuilderBtn.addEventListener('click', () => {
        activateDocTab('mdm');
      });
    }
    if (els.openDischargeBuilderBtn) {
      els.openDischargeBuilderBtn.addEventListener('click', () => {
        activateDocTab('discharge');
      });
    }
    if (els.openDotphraseBtn) {
      els.openDotphraseBtn.addEventListener('click', () => {
        activateDocTab('dotphrase');
      });
    }

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

    const handleDotphraseAction = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const btn = target.closest('button[data-role]');
      if (!btn) return;

      const role = btn.getAttribute('data-role') || '';
      const dotId = normalizeId(btn.getAttribute('data-dot-id') || '');
      if (!dotId) return;

      if (role === 'copy-dot-text') {
        const lookup = phraseLookup(dotId);
        const text = lookup && lookup.exists && lookup.text ? lookup.text : formatDotphrase(dotId);
        copyTextWithFeedback(text, btn);
        return;
      }

      if (role === 'toggle-favorite') {
        toggleDotphraseFavorite(dotId);
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
    };

    if (els.dotphraseQuickList) {
      els.dotphraseQuickList.addEventListener('click', handleDotphraseAction);
    }
    if (els.dotphraseFavoritesList) {
      els.dotphraseFavoritesList.addEventListener('click', handleDotphraseAction);
    }

    if (els.dischargeBuilder) {
      const handleDischargeInput = (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
        const key = target.dataset.dischargeField || '';
        if (!key || !Object.prototype.hasOwnProperty.call(state.discharge, key)) return;

        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
          state.discharge[key] = target.checked;
        } else {
          state.discharge[key] = target.value;
        }
        setDischargePreview();
        saveState();
      };

      els.dischargeBuilder.addEventListener('input', handleDischargeInput);
      els.dischargeBuilder.addEventListener('change', handleDischargeInput);
    }

    if (els.copyFullBtn) {
      els.copyFullBtn.addEventListener('click', () => {
        if (!state.activePack) return;
        copyTextWithFeedback(buildMdmText(state.activePack), els.copyFullBtn);
      });
    }

    els.copyDdxBtn.addEventListener('click', () => {
      if (!state.activePack) return;
      copyTextWithFeedback(buildDdxText(state.activePack), els.copyDdxBtn);
    });

    els.copyRuleoutsBtn.addEventListener('click', () => {
      if (!state.activePack) return;
      copyTextWithFeedback(buildRuleoutsText(), els.copyRuleoutsBtn);
    });

    if (els.copyDischargeBtn) {
      els.copyDischargeBtn.addEventListener('click', () => {
        copyTextWithFeedback(buildDischargeText(), els.copyDischargeBtn);
      });
    }

    if (els.dischargeCopyFullMdmBtn) {
      els.dischargeCopyFullMdmBtn.addEventListener('click', () => {
        if (!state.activePack) return;
        copyTextWithFeedback(buildMdmText(state.activePack), els.dischargeCopyFullMdmBtn);
      });
    }
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

    // Load both packs and history questions in parallel
    loadHistoryQuestionsIfNeeded();

    try {
      await loadPacks();
    } catch (error) {
      els.preview.value = 'Failed to load MDM packs. Check mdm_packs.json.';
      els.ddxContainer.innerHTML = `<p class="empty-block">${escapeHtml(error.message)}</p>`;
      els.ruleoutContainer.innerHTML = '<p class="empty-block">Unavailable.</p>';
      els.riskContainer.innerHTML = '<p class="empty-block">Unavailable.</p>';
      if (els.qualityContainer) {
        els.qualityContainer.innerHTML = '<p class="empty-block">Unavailable.</p>';
      }
      renderDischargeBuilder();
      return;
    }

    loadSavedState();
    renderDischargeBuilder();
    renderPackSelect();
    state.outputMode = OUTPUT_EXPANDED;
    activateDocTab('mdm', { scroll: false });

    const hashCmd = normalizeCommand(window.location.hash.replace(/^#/, ''));
    if (hashCmd && state.commandMap.has(hashCmd)) {
      selectPack(state.commandMap.get(hashCmd), { skipPersist: true });
      applyPanelHash();
      syncDocTabFromOpenPanels();
      return;
    }

    if (state.savedActivePackId && state.packById.has(state.savedActivePackId)) {
      selectPack(state.savedActivePackId, { skipPersist: true });
      applyPanelHash();
      syncDocTabFromOpenPanels();
      return;
    }

    selectPack(state.packs[0].id, { skipPersist: true });
    applyPanelHash();
    syncDocTabFromOpenPanels();
  }

  init();
})();
