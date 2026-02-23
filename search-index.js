// ╔══════════════════════════════════════════════════════════════════╗
// ║  KP/ER Search Index — search-index.js                           ║
// ║  Auto-generated — 310 entries                                ║
// ║                                                                  ║
// ║  ENTRY FORMAT:                                                   ║
// ║    type = type (phrase|calc|algo|neuro|drug|phone|imaging|staff) ║
// ║    i  = emoji icon                                               ║
// ║    t  = title / name  (searched + displayed)                     ║
// ║    s  = subtitle keywords  (searched, shown under title)         ║
// ║    g  = group label  (displayed in results)                      ║
// ║    u  = URL / href                                               ║
// ║                                                                  ║
// ║  TO ADD A NEW ENTRY:                                             ║
// ║    1. Find the right section below                               ║
// ║    2. Copy an existing entry and update n/s/g/u                  ║
// ║    3. Save — changes are live immediately                        ║
// ║                                                                  ║
// ║  SECTIONS IN THIS FILE:                                          ║
// ║    - CORE PAGES  (1 entry)                                 ║
// ║    - DOTPHRASES  (127 entries)                             ║
// ║    - CALCULATORS (13 entries)                              ║
// ║    - ALGORITHMS  (7 entries)                               ║
// ║    - NEURO HUB   (10 entries)                              ║
// ║    - VASOPRESSORS (8 entries)                           ║
// ║    - RSI MEDS    (9 entries)                               ║
// ║    - PHONE DIR   (92 entries)                             ║
// ║    - IMAGING     (24 entries)                              ║
// ║    - KEY STAFF   (16 entries)                              ║
// ╚══════════════════════════════════════════════════════════════════╝

const SEARCH_INDEX = [


  // ── CORE PAGES ──────────────────────────────────────────────────────────
  {type:'page',i:'🧾',t:'MDM Builder',s:'mdmccp  ·  mdmsob  ·  mdmabd  ·  mdmha  ·  mdmfever  ·  chief complaint documentation builder',g:'Reference',gc:'t-phrase',u:'mdm.html'},

  // ── DOTPHRASES ─────────────────────────────────────────────────────────
  {type:'phrase',i:'📋',t:'PE Rule-Out',s:'.nope  ·  Chest Pain  ·  chest pain dyspnea SOB shortness of breath',g:'Chest Pain',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Aortic Dissection Rule-Out',s:'.nodissection  ·  Chest Pain  ·  chest pain dyspnea SOB shortness of breath',g:'Chest Pain',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'ACS Rule-Out',s:'.noacs  ·  Chest Pain  ·  chest pain dyspnea SOB shortness of breath',g:'Chest Pain',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Pneumothorax Rule-Out',s:'.nopneumo  ·  Chest Pain  ·  chest pain dyspnea SOB shortness of breath',g:'Chest Pain',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Cardiac Tamponade Rule-Out',s:'.notamponade  ·  Chest Pain  ·  chest pain dyspnea SOB shortness of breath',g:'Chest Pain',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'SAH Rule-Out',s:'.nosah  ·  Headache  ·  headache head pain thunderclap migraine',g:'Headache',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Meningitis/Encephalitis Rule-Out',s:'.nomeningitis  ·  Headache  ·  headache head pain thunderclap migraine',g:'Headache',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Stroke Rule-Out',s:'.nostroke  ·  Headache  ·  headache head pain thunderclap migraine',g:'Headache',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Hypertensive Emergency Rule-Out',s:'.nohypertensiveemergency  ·  Headache  ·  headache head pain thunderclap migraine',g:'Headache',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Cerebral Venous Thrombosis Rule-Out',s:'.nocvt  ·  Headache  ·  headache head pain thunderclap migraine',g:'Headache',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'AAA / Aortic Emergency Rule-Out',s:'.noaaa  ·  Abdominal Pain  ·  abdominal pain belly stomach nausea vomiting',g:'Abdominal Pain',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Ectopic Pregnancy Rule-Out',s:'.noectopic  ·  Abdominal Pain  ·  abdominal pain belly stomach nausea vomiting',g:'Abdominal Pain',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Appendicitis Rule-Out',s:'.noappendix  ·  Abdominal Pain  ·  abdominal pain belly stomach nausea vomiting',g:'Abdominal Pain',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Mesenteric Ischemia Rule-Out',s:'.nomesischemia  ·  Abdominal Pain  ·  abdominal pain belly stomach nausea vomiting',g:'Abdominal Pain',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Small Bowel Obstruction Rule-Out',s:'.nosbo  ·  Abdominal Pain  ·  abdominal pain belly stomach nausea vomiting',g:'Abdominal Pain',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Ovarian Torsion Rule-Out',s:'.noovariantorsion  ·  Abdominal Pain  ·  abdominal pain belly stomach nausea vomiting',g:'Abdominal Pain',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Epigastric Pain Rule-Out (Pancreatitis / Hepatitis / Biliary)',s:'.noepigastric  ·  Abdominal Pain  ·  abdominal pain belly stomach nausea vomiting',g:'Abdominal Pain',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Upper GI Bleed Documentation',s:'.nougibleed  ·  GI  ·  GI gastrointestinal bleeding GIB UGIB LGIB',g:'GI',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Lower GI Bleed Documentation',s:'.nolgibleed  ·  GI  ·  GI gastrointestinal bleeding GIB UGIB LGIB',g:'GI',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Liver Failure / Hepatic Encephalopathy',s:'.nohepfailure  ·  GI  ·  GI gastrointestinal bleeding GIB UGIB LGIB',g:'GI',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Bowel Perforation Rule-Out',s:'.nobowelperf  ·  GI  ·  GI gastrointestinal bleeding GIB UGIB LGIB',g:'GI',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Intracranial Injury Rule-Out (Head Trauma)',s:'.nonci  ·  Neuro  ·  neuro neurological weakness numbness paralysis',g:'Neuro',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Seizure Work-Up Documented',s:'.noseizure  ·  Neuro  ·  neuro neurological weakness numbness paralysis',g:'Neuro',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Guillain-Barré Rule-Out',s:'.nogbs  ·  Neuro  ·  neuro neurological weakness numbness paralysis',g:'Neuro',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Cauda Equina Syndrome Rule-Out',s:'.nocaudaequina  ·  Neuro  ·  neuro neurological weakness numbness paralysis',g:'Neuro',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Preeclampsia/Eclampsia Rule-Out',s:'.noeclampsia  ·  OB  ·  OB obstetrics pregnancy gravid prenatal',g:'OB',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'HELLP Syndrome Rule-Out',s:'.nohellp  ·  OB  ·  OB obstetrics pregnancy gravid prenatal',g:'OB',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Placental Abruption Rule-Out',s:'.noabruption  ·  OB  ·  OB obstetrics pregnancy gravid prenatal',g:'OB',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Intussusception Rule-Out',s:'.nointussusception  ·  Peds  ·  pediatric peds child infant',g:'Peds',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Malrotation/Volvulus Rule-Out',s:'.novolvulus  ·  Peds  ·  pediatric peds child infant',g:'Peds',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Epiglottitis Rule-Out',s:'.noepiglottitis  ·  Peds  ·  pediatric peds child infant',g:'Peds',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Non-Accidental Trauma Screen',s:'.nonat  ·  Peds  ·  pediatric peds child infant',g:'Peds',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Mastoiditis Rule-Out',s:'.nomastoiditis  ·  Head & Neck  ·  head neck ENT ear nose throat abscess',g:'Head & Neck',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Peritonsillar Abscess Rule-Out',s:'.nopta  ·  Head & Neck  ·  head neck ENT ear nose throat abscess',g:'Head & Neck',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Retropharyngeal Abscess Rule-Out',s:'.norpha  ·  Head & Neck  ·  head neck ENT ear nose throat abscess',g:'Head & Neck',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Malignant Otitis Externa Rule-Out',s:'.nomalignantotitis  ·  Head & Neck  ·  head neck ENT ear nose throat abscess',g:'Head & Neck',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Temporal Arteritis (GCA) Rule-Out',s:'.nogca  ·  Head & Neck  ·  head neck ENT ear nose throat abscess',g:'Head & Neck',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Lemierre\'s Syndrome Rule-Out',s:'.nolemierres  ·  Head & Neck  ·  head neck ENT ear nose throat abscess',g:'Head & Neck',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Thyroid Storm Rule-Out',s:'.nothyroidstorm  ·  High-Risk Dx  ·  high risk life threatening emergent critical',g:'High-Risk Dx',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Myxedema Coma Rule-Out',s:'.nomyxedema  ·  High-Risk Dx  ·  high risk life threatening emergent critical',g:'High-Risk Dx',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Adrenal Crisis Rule-Out',s:'.noadrenalcrisis  ·  High-Risk Dx  ·  high risk life threatening emergent critical',g:'High-Risk Dx',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Acute Angle-Closure Glaucoma Rule-Out',s:'.noglaucoma  ·  High-Risk Dx  ·  high risk life threatening emergent critical',g:'High-Risk Dx',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Ludwig\'s Angina / Deep Space Neck Infection Rule-Out',s:'.noludsangina  ·  High-Risk Dx  ·  high risk life threatening emergent critical',g:'High-Risk Dx',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Fournier\'s Gangrene Rule-Out',s:'.nofourgangr  ·  High-Risk Dx  ·  high risk life threatening emergent critical',g:'High-Risk Dx',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Central Retinal Artery Occlusion',s:'.nocrao  ·  High-Risk Dx  ·  high risk life threatening emergent critical',g:'High-Risk Dx',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Wernicke\'s Encephalopathy Rule-Out',s:'.noWernicke  ·  High-Risk Dx  ·  high risk life threatening emergent critical',g:'High-Risk Dx',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Against Medical Advice (AMA)',s:'.ama  ·  Disposition  ·  disposition discharge AMA refusal capacity',g:'Disposition',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Shared Decision-Making: Low-Risk Chest Pain Discharge',s:'.sdmlowriskcp  ·  Disposition  ·  disposition discharge AMA refusal capacity',g:'Disposition',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Shared Decision-Making: LP for SAH Rule-Out',s:'.sdmlpsdm  ·  Disposition  ·  disposition discharge AMA refusal capacity',g:'Disposition',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Decision-Making Capacity Confirmed',s:'.capacityok  ·  Disposition  ·  disposition discharge AMA refusal capacity',g:'Disposition',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Return Precautions Documented',s:'.noreturn  ·  Disposition  ·  disposition discharge AMA refusal capacity',g:'Disposition',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Syncope — Low Risk, Discharge',s:'.nosyncope  ·  High-Volume  ·  high volume syncope etoh alcohol altered AMS',g:'High-Volume',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Alcohol Intoxication / Medical Clearance',s:'.etohclearance  ·  High-Volume  ·  high volume syncope etoh alcohol altered AMS',g:'High-Volume',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Altered Mental Status Work-Up',s:'.alteredms  ·  High-Volume  ·  high volume syncope etoh alcohol altered AMS',g:'High-Volume',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Renal Colic / Nephrolithiasis',s:'.flankpain  ·  High-Volume  ·  high volume syncope etoh alcohol altered AMS',g:'High-Volume',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Anaphylaxis Documentation',s:'.noanaphylaxis  ·  Airway / Respiratory  ·  airway respiratory breathing wheezing COPD asthma',g:'Airway / Respiratory',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Angioedema / Airway Threat Assessment',s:'.noangioedema  ·  Airway / Respiratory  ·  airway respiratory breathing wheezing COPD asthma',g:'Airway / Respiratory',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Asthma Exacerbation Severity',s:'.noasthma  ·  Airway / Respiratory  ·  airway respiratory breathing wheezing COPD asthma',g:'Airway / Respiratory',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Acute Pulmonary Edema / CHF Exacerbation',s:'.nochf  ·  Airway / Respiratory  ·  airway respiratory breathing wheezing COPD asthma',g:'Airway / Respiratory',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Aspiration Pneumonia Risk Documentation',s:'.noaspiration  ·  Airway / Respiratory  ·  airway respiratory breathing wheezing COPD asthma',g:'Airway / Respiratory',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Atrial Fibrillation with RVR — Rate Control',s:'.noafib  ·  Cardiology  ·  cardiology cardiac heart arrhythmia rhythm',g:'Cardiology',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Bradycardia / Heart Block Documentation',s:'.nobradycardia  ·  Cardiology  ·  cardiology cardiac heart arrhythmia rhythm',g:'Cardiology',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Hypertensive Urgency Discharge',s:'.nohypertensiveurgency  ·  Cardiology  ·  cardiology cardiac heart arrhythmia rhythm',g:'Cardiology',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'AKI Workup',s:'.noaki  ·  Renal / Metabolic  ·  renal metabolic kidney electrolyte AKI CKD',g:'Renal / Metabolic',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Hyperkalemia Management',s:'.nohyperkalemia  ·  Renal / Metabolic  ·  renal metabolic kidney electrolyte AKI CKD',g:'Renal / Metabolic',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'DKA / HHS Documentation',s:'.nodka  ·  Renal / Metabolic  ·  renal metabolic kidney electrolyte AKI CKD',g:'Renal / Metabolic',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Hyponatremia Workup',s:'.nohyponatremia  ·  Renal / Metabolic  ·  renal metabolic kidney electrolyte AKI CKD',g:'Renal / Metabolic',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Hypoglycemia Workup',s:'.nohypoglycemia  ·  Renal / Metabolic  ·  renal metabolic kidney electrolyte AKI CKD',g:'Renal / Metabolic',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Hypercalcemia Workup',s:'.nohypercalcemia  ·  Renal / Metabolic  ·  renal metabolic kidney electrolyte AKI CKD',g:'Renal / Metabolic',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Epididymo-Orchitis Rule-Out',s:'.noepididymitis  ·  GU / GYN  ·  GU GYN urologic gynecologic',g:'GU / GYN',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Pelvic Inflammatory Disease Documentation',s:'.nopid  ·  GU / GYN  ·  GU GYN urologic gynecologic',g:'GU / GYN',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Urinary Retention Documentation',s:'.nourinaryretention  ·  GU / GYN  ·  GU GYN urologic gynecologic',g:'GU / GYN',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Suicidal Ideation Risk Stratification',s:'.siscreen  ·  Psychiatric  ·  psych psychiatric mental health SI HI suicide',g:'Psychiatric',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Homicidal Ideation Screening',s:'.hiscreen  ·  Psychiatric  ·  psych psychiatric mental health SI HI suicide',g:'Psychiatric',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Agitation / Excited Delirium Documentation',s:'.agitation  ·  Psychiatric  ·  psych psychiatric mental health SI HI suicide',g:'Psychiatric',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Psychiatric Medical Clearance',s:'.psychmedclear  ·  Psychiatric  ·  psych psychiatric mental health SI HI suicide',g:'Psychiatric',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Acetaminophen Overdose Risk Stratification',s:'.noacetaminophen  ·  Toxicology  ·  tox toxicology overdose poisoning OD',g:'Toxicology',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Salicylate Toxicity Rule-Out',s:'.nosalicylate  ·  Toxicology  ·  tox toxicology overdose poisoning OD',g:'Toxicology',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'TCA Overdose Rule-Out',s:'.notca  ·  Toxicology  ·  tox toxicology overdose poisoning OD',g:'Toxicology',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Serotonin Syndrome Rule-Out',s:'.noserotonin  ·  Toxicology  ·  tox toxicology overdose poisoning OD',g:'Toxicology',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Anticholinergic Toxidrome Rule-Out',s:'.noanticholinergic  ·  Toxicology  ·  tox toxicology overdose poisoning OD',g:'Toxicology',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Opioid Toxicity / Overdose',s:'.noopioidtox  ·  Toxicology  ·  tox toxicology overdose poisoning OD',g:'Toxicology',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Heat Stroke Rule-Out',s:'.noheatstroke  ·  Toxicology  ·  tox toxicology overdose poisoning OD',g:'Toxicology',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Hypothermia Management',s:'.nohypothermia  ·  Toxicology  ·  tox toxicology overdose poisoning OD',g:'Toxicology',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Neutropenic Fever',s:'.noneutropenic  ·  Hematology / Oncology  ·  heme hematology oncology cancer blood',g:'Hematology / Oncology',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Sickle Cell Crisis Documentation',s:'.nosicklecell  ·  Hematology / Oncology  ·  heme hematology oncology cancer blood',g:'Hematology / Oncology',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Hyperviscosity Syndrome Rule-Out',s:'.nohyperviscosity  ·  Hematology / Oncology  ·  heme hematology oncology cancer blood',g:'Hematology / Oncology',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Tumor Lysis Syndrome Rule-Out',s:'.notumourlysis  ·  Hematology / Oncology  ·  heme hematology oncology cancer blood',g:'Hematology / Oncology',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Septic Arthritis Rule-Out',s:'.nosepticjoint  ·  Infectious Disease  ·  infectious disease infection fever sepsis',g:'Infectious Disease',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Osteomyelitis Rule-Out',s:'.noosteo  ·  Infectious Disease  ·  infectious disease infection fever sepsis',g:'Infectious Disease',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Endocarditis Risk Documentation',s:'.noendocarditis  ·  Infectious Disease  ·  infectious disease infection fever sepsis',g:'Infectious Disease',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Acute Limb Ischemia Rule-Out',s:'.nolimbischemia  ·  Vascular  ·  vascular ischemia blood vessel clot DVT PE',g:'Vascular',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'DVT Rule-Out',s:'.nodvt  ·  Vascular  ·  vascular ischemia blood vessel clot DVT PE',g:'Vascular',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Compartment Syndrome Rule-Out',s:'.nocompartment  ·  Vascular  ·  vascular ischemia blood vessel clot DVT PE',g:'Vascular',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Retinal Detachment Rule-Out',s:'.noretinaldetach  ·  Ophthalmology  ·  ophthalmology eye vision ocular',g:'Ophthalmology',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Orbital vs Preseptal Cellulitis',s:'.noorbitalcellulitis  ·  Ophthalmology  ·  ophthalmology eye vision ocular',g:'Ophthalmology',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Scaphoid Fracture Rule-Out',s:'.noscaphoid  ·  MSK / Trauma  ·  MSK musculoskeletal trauma fracture dislocation',g:'MSK / Trauma',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Spinal Cord Injury / SCIWORA Rule-Out',s:'.nospinalcord  ·  MSK / Trauma  ·  MSK musculoskeletal trauma fracture dislocation',g:'MSK / Trauma',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Lisfranc Injury Rule-Out',s:'.nolisfranc  ·  MSK / Trauma  ·  MSK musculoskeletal trauma fracture dislocation',g:'MSK / Trauma',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Domestic Violence Screening',s:'.dvscreen  ·  Social / Legal  ·  social legal capacity EMTALA domestic violence DV',g:'Social / Legal',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Capacity to Refuse Imaging / Procedure',s:'.refusalimaging  ·  Social / Legal  ·  social legal capacity EMTALA domestic violence DV',g:'Social / Legal',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'EMTALA Medical Screening Exam',s:'.emtala  ·  Social / Legal  ·  social legal capacity EMTALA domestic violence DV',g:'Social / Legal',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'High-Risk Wound Exploration',s:'.woundexplore  ·  Wound / Derm  ·  wound derm skin abscess laceration cellulitis',g:'Wound / Derm',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Abscess I&D Documentation',s:'.abscessid  ·  Wound / Derm  ·  wound derm skin abscess laceration cellulitis',g:'Wound / Derm',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Soft Tissue Infection — Severity Assessment',s:'.nonecksofttissue  ·  Wound / Derm  ·  wound derm skin abscess laceration cellulitis',g:'Wound / Derm',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Thoracentesis Documentation',s:'.procthoracentesis  ·  Procedures  ·  procedure thoracentesis paracentesis pericardiocentesis',g:'Procedures',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Paracentesis Documentation',s:'.procparacentesis  ·  Procedures  ·  procedure thoracentesis paracentesis pericardiocentesis',g:'Procedures',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Cardioversion Documentation',s:'.proccardioversion  ·  Procedures  ·  procedure thoracentesis paracentesis pericardiocentesis',g:'Procedures',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Pericardiocentesis Documentation',s:'.procpericardiocentesis  ·  Procedures  ·  procedure thoracentesis paracentesis pericardiocentesis',g:'Procedures',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Sepsis Screening',s:'.nosepsis  ·  Other',g:'Other',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Testicular Torsion Rule-Out',s:'.notorsion  ·  Other',g:'Other',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Spinal Epidural Abscess Rule-Out',s:'.nosea  ·  Other',g:'Other',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Necrotizing Fasciitis Rule-Out',s:'.nonecfasc  ·  Other',g:'Other',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Carbon Monoxide Poisoning Rule-Out',s:'.noco  ·  Other',g:'Other',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Consent — Lumbar Puncture',s:'.consentlp  ·  Consent  ·  consent informed procedure',g:'Consent',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Consent — Central Line (CVC)',s:'.consentcl  ·  Consent  ·  consent informed procedure',g:'Consent',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Consent — Endotracheal Intubation / RSI',s:'.consentintubation  ·  Consent  ·  consent informed procedure',g:'Consent',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Consent — Procedural Sedation',s:'.consentprocsedation  ·  Consent  ·  consent informed procedure',g:'Consent',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Consent — Chest Tube / Tube Thoracostomy',s:'.consentchesttube  ·  Consent  ·  consent informed procedure',g:'Consent',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Consent — Thoracentesis',s:'.consentthoracentesis  ·  Consent  ·  consent informed procedure',g:'Consent',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Consent — Paracentesis',s:'.consentparacentesis  ·  Consent  ·  consent informed procedure',g:'Consent',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Consent — Cardioversion (Elective)',s:'.consentcard  ·  Consent  ·  consent informed procedure',g:'Consent',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Consent — Transcutaneous Pacing',s:'.consentpacing  ·  Consent  ·  consent informed procedure',g:'Consent',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Consent — Pericardiocentesis',s:'.consentpericardio  ·  Consent  ·  consent informed procedure',g:'Consent',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Consent — Laceration Repair',s:'.consentlaceration  ·  Consent  ·  consent informed procedure',g:'Consent',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Consent — Incision & Drainage (I&D)',s:'.consentidabscess  ·  Consent  ·  consent informed procedure',g:'Consent',gc:'t-phrase',u:'dotphrase.html'},
  {type:'phrase',i:'📋',t:'Consent — Fracture / Dislocation Reduction',s:'.consentfracturereduction  ·  Consent  ·  consent informed procedure',g:'Consent',gc:'t-phrase',u:'dotphrase.html'},

  // ── CALCULATORS ────────────────────────────────────────────────────────
  {type:'calc',i:'🧮',t:'PERC Rule',s:'PE rule-out  ·  8 low-risk criteria  ·  pulmonary embolism',g:'Calculator',gc:'t-calc',u:'calculators.html#calc-wellspe'},
  {type:'calc',i:'🧮',t:'Wells PE Score',s:'PE pre-test probability  ·  clinical decision rule',g:'Calculator',gc:'t-calc',u:'calculators.html#calc-wellspe'},
  {type:'calc',i:'🧮',t:'HEART Score',s:'ACS risk  ·  MACE 6-week risk  ·  troponin  ·  chest pain',g:'Calculator',gc:'t-calc',u:'calculators.html#calc-heart'},
  {type:'calc',i:'🧮',t:'YEARS Algorithm',s:'PE  ·  d-dimer threshold  ·  CT reduction strategy  ·  hemoptysis  ·  DVT signs',g:'Calculator',gc:'t-calc',u:'calculators.html#calc-years'},
  {type:'calc',i:'🧮',t:'Wells DVT Score',s:'DVT probability  ·  D-dimer threshold  ·  deep vein thrombosis',g:'Calculator',gc:'t-calc',u:'calculators.html#calc-wellsdvt'},
  {type:'calc',i:'🧮',t:'ABCD2 Score',s:'TIA  ·  early stroke risk  ·  admission vs follow-up  ·  neurology',g:'Calculator',gc:'t-calc',u:'calculators.html#calc-abcd2'},
  {type:'calc',i:'🧮',t:'CHA2DS2-VASc Score',s:'atrial fibrillation  ·  stroke risk  ·  anticoagulation discussion',g:'Calculator',gc:'t-calc',u:'calculators.html#calc-cha2ds2vasc'},
  {type:'calc',i:'🧮',t:'Canadian CT Head Rule',s:'Head trauma  ·  CT indication  ·  minor head injury  ·  GCS',g:'Calculator',gc:'t-calc',u:'calculators.html#calc-cthead'},
  {type:'calc',i:'🧮',t:'LRINEC Score',s:'Necrotizing fasciitis  ·  soft tissue infection  ·  necrotizing',g:'Calculator',gc:'t-calc',u:'calculators.html#calc-softtissue'},
  {type:'calc',i:'🧮',t:'Fournier Gangrene Score (FGSI)',s:'Fournier\'s gangrene  ·  mortality risk  ·  prognostic severity index',g:'Calculator',gc:'t-calc',u:'calculators.html#calc-softtissue'},
  {type:'calc',i:'🧮',t:'SIRS Criteria',s:'Sepsis  ·  systemic inflammatory response  ·  fever tachycardia',g:'Calculator',gc:'t-calc',u:'calculators.html#calc-softtissue'},
  {type:'calc',i:'🧮',t:'qSOFA',s:'Sepsis  ·  quick SOFA  ·  organ dysfunction  ·  ICU',g:'Calculator',gc:'t-calc',u:'calculators.html#calc-softtissue'},
  {type:'calc',i:'🧮',t:'Shock Index',s:'Hemodynamic instability  ·  HR/SBP ratio  ·  hemorrhage',g:'Calculator',gc:'t-calc',u:'calculators.html#calc-softtissue'},
  {type:'calc',i:'🧮',t:'Centor / McIsaac Score',s:'Strep pharyngitis  ·  throat culture  ·  antibiotics',g:'Calculator',gc:'t-calc',u:'calculators.html#calc-centor'},
  {type:'calc',i:'🧮',t:'PECARN Pediatric Head Injury',s:'Peds head trauma  ·  CT indication  ·  children',g:'Calculator',gc:'t-calc',u:'calculators.html#calc-pecarn'},
  {type:'calc',i:'🧮',t:'Peds Fever Risk Stratification',s:'Febrile infant  ·  0-60 days  ·  sepsis workup  ·  LP',g:'Calculator',gc:'t-calc',u:'calculators.html#calc-pedsfever'},

  // ── ALGORITHMS ─────────────────────────────────────────────────────────
  {type:'algo',i:'🔀',t:'Orbital Fractures',s:'ophthalmology  ·  eye  ·  ocular  ·  orbital blowout  ·  trauma  ·  KP SBC ED Practice Guideline',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-orbital'},
  {type:'algo',i:'🔀',t:'Papilledema',s:'optic disc swelling  ·  elevated ICP  ·  vision  ·  neurology  ·  KP SBC ED Practice Guideline',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-papilledema'},
  {type:'algo',i:'🔀',t:'Pneumomediastinum',s:'mediastinal air  ·  esophageal rupture  ·  Boerhaave  ·  chest  ·  KP SBC ED Practice Guideline',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-pneumomediastinum'},
  {type:'algo',i:'🔀',t:'Vaginal Bleeding in Pregnancy',s:'OB bleeding  ·  first trimester  ·  anti-D immunoglobulin  ·  Rhogam  ·  progesterone  ·  pregnancy of unknown location  ·  OB trauma  ·  KP SBC GYN and ED Practice Guideline',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-pregvb'},
  {type:'algo',i:'🔀',t:'Aortic Dissection',s:'chest pain  ·  tearing  ·  CTA  ·  type A type B  ·  vascular  ·  KP SBC ED Practice Guideline',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-aortic'},
  {type:'algo',i:'🔀',t:'Visual Floaters & Flashes',s:'ophthalmology  ·  retinal detachment  ·  vitreous  ·  vision  ·  KP SBC ED Practice Guideline',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-floaters'},
  {type:'algo',i:'🔀',t:'Non-Pregnant Vaginal Bleeding',s:'GYN  ·  vaginal bleeding  ·  non-OB  ·  ectopic  ·  KP SBC ED Practice Guideline',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-nonpregvb'},

  // ── NEURO HUB ───────────────────────────────────────────────────────────
  {type:'neuro',i:'🧠',t:'Neuro Hub — ICH Protocol Overview',s:'ICH  ·  intracerebral hemorrhage  ·  stroke  ·  neurology consult',g:'Neuro Hub',gc:'t-neuro',u:'neurohub.html'},
  {type:'neuro',i:'🧠',t:'Neurology First Rule',s:'ICH  ·  do not page neurosurgery  ·  call neuro first  ·  866-361-2911',g:'Neuro Hub',gc:'t-neuro',u:'neurohub.html'},
  {type:'neuro',i:'🧠',t:'Neuro Hub Access Hours',s:'7am–9pm daily  ·  one number  ·  866-361-2911  ·  expanded hours',g:'Neuro Hub',gc:'t-neuro',u:'neurohub.html'},
  {type:'neuro',i:'🧠',t:'ICH — Clinical Triggers (When to Call)',s:'mandatory call  ·  hemorrhage  ·  ICH  ·  mass effect  ·  herniation',g:'Neuro Hub',gc:'t-neuro',u:'neurohub.html'},
  {type:'neuro',i:'🧠',t:'ICH — BP Management',s:'blood pressure  ·  SBP <140  ·  nicardipine  ·  labetalol  ·  antihypertensive',g:'Neuro Hub',gc:'t-neuro',u:'neurohub.html'},
  {type:'neuro',i:'🧠',t:'ICH — Anticoagulation Reversal',s:'reversal  ·  andexanet  ·  idarucizumab  ·  4-factor PCC  ·  warfarin  ·  DOAC  ·  Xarelto  ·  Eliquis  ·  Pradaxa',g:'Neuro Hub',gc:'t-neuro',u:'neurohub.html'},
  {type:'neuro',i:'🧠',t:'tPA / Alteplase Eligibility',s:'thrombolytics  ·  stroke  ·  tPA criteria  ·  inclusion exclusion  ·  tissue plasminogen activator',g:'Neuro Hub',gc:'t-neuro',u:'neurohub.html'},
  {type:'neuro',i:'🧠',t:'Stroke Triage Flowchart',s:'stroke alert  ·  NIHSS  ·  last known well  ·  CT  ·  thrombectomy',g:'Neuro Hub',gc:'t-neuro',u:'neurohub.html'},
  {type:'neuro',i:'🧠',t:'ICH — Disposition Summary',s:'medical ICH  ·  surgical  ·  neurosurgery escalation  ·  ICU  ·  admit',g:'Neuro Hub',gc:'t-neuro',u:'neurohub.html'},
  {type:'neuro',i:'🧠',t:'One-Page ICH Rapid Reference',s:'quick reference  ·  ICH cheat sheet  ·  hemorrhage summary',g:'Neuro Hub',gc:'t-neuro',u:'neurohub.html'},

  // ── DRUGS (VASOPRESSORS + RSI) ──────────────────────────────────────────
  {type:'drug',i:'💊',t:'Norepinephrine',s:'septic shock first-line  ·  0.01–3 mcg/kg/min  ·  alpha beta  ·  levophed  ·  vasopressor dosing calculator',g:'Vasopressor',gc:'t-drug',u:'vasopressors.html'},
  {type:'drug',i:'💊',t:'Epinephrine drip',s:'anaphylaxis  ·  cardiac arrest  ·  0.01–1 mcg/kg/min  ·  epi  ·  vasopressor dosing calculator',g:'Vasopressor',gc:'t-drug',u:'vasopressors.html'},
  {type:'drug',i:'💊',t:'Dopamine',s:'cardiogenic shock  ·  2–20 mcg/kg/min  ·  renal dose  ·  vasopressor dosing calculator',g:'Vasopressor',gc:'t-drug',u:'vasopressors.html'},
  {type:'drug',i:'💊',t:'Vasopressin',s:'septic shock adjunct  ·  0.03–0.04 units/min  ·  fixed dose  ·  ADH  ·  vasopressor dosing calculator',g:'Vasopressor',gc:'t-drug',u:'vasopressors.html'},
  {type:'drug',i:'💊',t:'Phenylephrine',s:'pure alpha  ·  neurogenic shock  ·  push-dose  ·  0.5–9 mcg/kg/min  ·  vasopressor dosing calculator',g:'Vasopressor',gc:'t-drug',u:'vasopressors.html'},
  {type:'drug',i:'💊',t:'Dobutamine',s:'cardiogenic shock  ·  inotrope  ·  2–20 mcg/kg/min  ·  low EF  ·  vasopressor dosing calculator',g:'Vasopressor',gc:'t-drug',u:'vasopressors.html'},
  {type:'drug',i:'💊',t:'Push-Dose Epinephrine',s:'push dose  ·  bolus  ·  10–20 mcg IV  ·  hypotension  ·  immediate  ·  vasopressor dosing calculator',g:'Vasopressor',gc:'t-drug',u:'vasopressors.html'},
  {type:'drug',i:'💊',t:'Angiotensin II',s:'giapreza  ·  refractory shock  ·  angiotensin  ·  adjunct vasopressor  ·  vasopressor dosing calculator',g:'Vasopressor',gc:'t-drug',u:'vasopressors.html'},
  {type:'drug',i:'🫁',t:'Succinylcholine',s:'RSI  ·  depolarizing paralytic  ·  1.5 mg/kg  ·  SCh  ·  contraindications hyperkalemia  ·  RSI calculator',g:'RSI',gc:'t-drug',u:'rsi.html'},
  {type:'drug',i:'🫁',t:'Rocuronium',s:'RSI  ·  non-depolarizing paralytic  ·  1.2 mg/kg  ·  can reverse with sugammadex  ·  RSI calculator',g:'RSI',gc:'t-drug',u:'rsi.html'},
  {type:'drug',i:'🫁',t:'Ketamine',s:'RSI induction  ·  1.5–2 mg/kg  ·  dissociative  ·  hemodynamically stable  ·  bronchospasm  ·  RSI calculator',g:'RSI',gc:'t-drug',u:'rsi.html'},
  {type:'drug',i:'🫁',t:'Etomidate',s:'RSI induction  ·  0.3 mg/kg  ·  hemodynamic stability  ·  adrenal suppression  ·  RSI calculator',g:'RSI',gc:'t-drug',u:'rsi.html'},
  {type:'drug',i:'🫁',t:'Propofol',s:'RSI induction  ·  sedation  ·  1.5–3 mg/kg  ·  hypotension risk  ·  RSI calculator',g:'RSI',gc:'t-drug',u:'rsi.html'},
  {type:'drug',i:'🫁',t:'Midazolam',s:'RSI premedication  ·  sedation  ·  0.1 mg/kg  ·  versed  ·  benzodiazepine  ·  RSI calculator',g:'RSI',gc:'t-drug',u:'rsi.html'},
  {type:'drug',i:'🫁',t:'Fentanyl',s:'RSI premedication  ·  blunt sympathetic response  ·  1–3 mcg/kg  ·  opioid  ·  RSI calculator',g:'RSI',gc:'t-drug',u:'rsi.html'},
  {type:'drug',i:'🫁',t:'Sugammadex',s:'rocuronium reversal  ·  16 mg/kg immediate  ·  4 mg/kg moderate  ·  bridion  ·  RSI calculator',g:'RSI',gc:'t-drug',u:'rsi.html'},
  {type:'drug',i:'🫁',t:'Vecuronium',s:'non-depolarizing paralytic  ·  maintenance paralysis  ·  0.1 mg/kg  ·  RSI calculator',g:'RSI',gc:'t-drug',u:'rsi.html'},

  // ── PHONE DIRECTORY ─────────────────────────────────────────────────────
  {type:'phone',i:'📞',t:'OMC — Triage / 30-Second Triage',s:'49808  ·  Office 45832  ·  locations  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — ED Pod A (Nurse Station)',s:'47510  ·  Fax 45811  ·  locations  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — ED Pod B (Nurse Station)',s:'47520  ·  Fax 45821  ·  locations  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — ED Pod C (Nurse Station)',s:'47530  ·  Fax 45831  ·  locations  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — MOD POD RN',s:'45886  ·  locations  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — PIT RN',s:'45882  ·  locations  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Urgent Care',s:'42544 / 42525  ·  locations  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — ED Admin Office',s:'45842  ·  locations  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — ACD Phone',s:'45884  ·  locations  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Staffing Dept – Call-offs Line',s:'45852  ·  locations  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Anesthesia',s:'47250  ·  7a–3:30p  ·  consults  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Internal Medicine',s:'47333  ·  3:30p–7a  ·  consults  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Interventional Radiology (IR)',s:'45210 / 45254  ·  OR Main 43910  ·  consults  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Orthopedics',s:'(909) 457-2048  ·  7a–10p  ·  consults  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Orthopedics',s:'Attending  ·  10p–7a  ·  consults  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Ortho Techs Pager',s:'909-209-0360  ·  Lead 47088 / Fax 45701  ·  consults  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — PICC RN',s:'47787 / 47789  ·  8a–5p  ·  consults  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Psychiatry (ED ext / Director)',s:'45855 / 427-3705  ·  8a–12a  ·  consults  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Psychiatry',s:'FMC Psychiatry  ·  12a–8a  ·  consults  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Respiratory',s:'43981  ·  consults  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — X-ray / ED',s:'45279  ·  Appt Center 888-750-0036  ·  internal services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — 2E – ICU',s:'225-244  ·  Charge 43636  ·  internal services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — 2W – Step Down',s:'201-224  ·  Charge 43640  ·  internal services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — 3E – Med Surg',s:'325-348  ·  Charge 43788  ·  internal services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — 3W – Med Surg',s:'301-324  ·  Charge 43737  ·  internal services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — 4E – Med Surg',s:'425-448  ·  Charge 43888  ·  internal services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — 4W – Med Surg',s:'401-424  ·  Charge 43838  ·  internal services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Labor & Delivery',s:'45555  ·  Nursery 49130 / NICU 45590  ·  internal services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — PACU',s:'43940  ·  43663 / 43477  ·  internal services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Sterile Processing',s:'43440  ·  Dept 45163  ·  internal services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — EVS',s:'45540  ·  8-330-1143  ·  internal services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — HR Service Center',s:'877-457-4772  ·  Cisco 49334  ·  internal services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Cashier Office',s:'45337  ·  Fax 43191  ·  internal services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Inpatient Financial Counselor',s:'45338  ·  Alt 45339  ·  internal services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — ED Copay / ED Financial Counselor',s:'43194  ·  Alt 43193  ·  internal services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — ETAP',s:'(562) 658-3998  ·  Fax 42199  ·  external services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Member Services',s:'800-464-4000  ·  8-279-3333  ·  external services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Ethics Consultation',s:'909-209-4688  ·  Fax 909-609-3659 / OMC Ph → 42841  ·  external services  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Case Manager / Utilization',s:'47333  ·  8:30a–10:30p  ·  physician support  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Social Services',s:'43320  ·  physician support  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Security',s:'45500  ·  security  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Security Specialist',s:'41555  ·  security  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Badge Office',s:'47292  ·  security  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'OMC — Vocera',s:'47690  ·  OLD: 8-250 / Palm Ct: 8-127  ·  other important numbers  ·  omc',g:'OMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Main Line',s:'(909) 427-5000  ·  Beeper 1204  ·  locations  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Pod A',s:'29112  ·  Beeper 6204  ·  locations  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — ED Housekeeping Pod C/D',s:'28540  ·  Beeper 6206  ·  locations  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Anesthesia',s:'24939  ·  Beeper 1685  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Internal Medicine',s:'Vocera  ·  7a–7p  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Internal Medicine',s:'27028  ·  7p–7a  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Interventional Radiology',s:'24050 / 24060  ·  3a–9p  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Neurosurgery',s:'Virtualist  ·  9p–3a  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — NICU',s:'27300  ·  Vocera "Gyn" (24190)  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Orthopedics PA',s:'p1651  ·  7a–10p  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Orthopedics',s:'Attending  ·  10p–7a  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Pain Clinic',s:'73185  ·  Beeper 7117  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Dialysis – HEMO 6th Floor',s:'28600 / 28608  ·  Ext 26511 (5 North)  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — PICC Line RN – 5 North',s:'26511  ·  Beeper 1404  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Radiology (File Room)',s:'76600  ·  7a–11:30p  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Radiology (STAT reads)',s:'76600  ·  7a–7p  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Substance Abuse',s:'29119  ·  7:30a–3:30p M–F  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Wound RN',s:'29652  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Wound Clinic',s:'75439  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Wound Care',s:'866-454-3485  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Wound Ostomy RN',s:'209-0456 / 370-7552  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Pacemaker',s:'7716  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Stroke Alert / Internal Overhead',s:'21006  ·  consults  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — X-ray',s:'24164  ·  Beeper 3323 PGR  ·  internal services  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Pharmacy – Outpatient',s:'28018  ·  Fax 5146  ·  internal services  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — ICU – 2 North (201-221)',s:'29200  ·  Beeper 1110  ·  internal services  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — ETAP / Burn Transfers (Member)',s:'(562) 658-3998  ·  8-122-4000  ·  external services  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — EPRP Call Center',s:'1-800-447-3777  ·  Beeper 8-320-3000  ·  external services  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — IT National Service Desk',s:'1-888-457-4872  ·  8-279-3333  ·  external services  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Case Manager',s:'(909) 491-1014  ·  8a–5p  ·  physician support  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Social Services',s:'(909) 459-3974  ·  5p–11p  ·  physician support  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Urgent Care',s:'75750  ·  physician support  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — PT Eval',s:'35707  ·  physician support  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Security – Med Center',s:'75500  ·  security  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Badge Office',s:'74190  ·  security  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Vocera',s:'24190  ·  (909) 302-4190  ·  other important numbers  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Fax',s:'(909) 302-7001  ·  Fax 29167  ·  other important numbers  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — ED Physician Suite',s:'29000  ·  Fax 29110  ·  other important numbers  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Help Desk',s:'74357  ·  other important numbers  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — HUB',s:'1-877-227-8799  ·  other important numbers  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Ectopic Watch',s:'Fwd chart to Jessica Dasco  ·  workflows — fmc  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Occupational Exposure',s:'Fwd chart to Gina Cummings  ·  workflows — fmc  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — OnRad Delays (>3 hrs) 12p–7a',s:'(909) 302-4112  ·  workflows — fmc  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Radiology Schedule: KP Telerad M–Th 7p–7a',s:'OnRad F–Su 7p–7a  ·  workflows — fmc  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Ontario ER – Pod A Ambulance',s:'8-264-5810  ·  workflows — fmc  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Ontario ER – Pod B',s:'8-264-5820  ·  workflows — fmc  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Ontario ER – Pod C',s:'8-264-5830  ·  workflows — fmc  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'phone',i:'📞',t:'FMC — Ontario ER – Abnormal Results Nurse',s:'8-264-5849  ·  workflows — fmc  ·  fmc',g:'FMC',gc:'t-phone',u:'ed-phone-directory.html'},

  // ── IMAGING ORDER CODES ─────────────────────────────────────────────────
  {type:'imaging',i:'🔬',t:'OMC — 3D Post-Processing (add-on)',s:'76377H  ·  imaging orders — ct  ·  omc',g:'OMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'OMC — Aortic Dissection',s:'228245  ·  imaging orders — ct  ·  omc',g:'OMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'OMC — Auditory Canal',s:'70480K  ·  imaging orders — ct  ·  omc',g:'OMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'OMC — Mesenteric Ischemia',s:'74174A  ·  imaging orders — ct  ·  omc',g:'OMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'OMC — Pan-scan',s:'207001  ·  imaging orders — ct  ·  omc',g:'OMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'OMC — Pulmonary Embolism',s:'71275J  ·  imaging orders — ct  ·  omc',g:'OMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'OMC — Pylorus',s:'76705AM  ·  imaging orders — ultrasound  ·  omc',g:'OMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'OMC — MSK / Soft Tissue Mass',s:'76881G  ·  imaging orders — ultrasound  ·  omc',g:'OMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'OMC — Appendix (Peds)',s:'76856B  ·  imaging orders — ultrasound  ·  omc',g:'OMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'OMC — Pelvis (Non-OB)',s:'225581  ·  imaging orders — ultrasound  ·  omc',g:'OMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'OMC — Pelvis (OB <14wks)',s:'218633  ·  imaging orders — ultrasound  ·  omc',g:'OMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'OMC — Gastrostomy Tube Confirmation',s:'74018A  ·  Also order Gastrograffin 20mL → 5980  ·  imaging orders — xray  ·  omc',g:'OMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'FMC — 3D Post-Processing (add-on)',s:'76377H  ·  imaging orders — ct  ·  fmc',g:'FMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'FMC — Aortic Dissection',s:'228245  ·  imaging orders — ct  ·  fmc',g:'FMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'FMC — Auditory Canal',s:'70480K  ·  imaging orders — ct  ·  fmc',g:'FMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'FMC — Mesenteric Ischemia',s:'74174A  ·  imaging orders — ct  ·  fmc',g:'FMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'FMC — Pan-scan',s:'207001  ·  imaging orders — ct  ·  fmc',g:'FMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'FMC — Pulmonary Embolism',s:'71275J  ·  imaging orders — ct  ·  fmc',g:'FMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'FMC — Pylorus',s:'76705AM  ·  imaging orders — ultrasound  ·  fmc',g:'FMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'FMC — MSK / Soft Tissue Mass',s:'76881G  ·  imaging orders — ultrasound  ·  fmc',g:'FMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'FMC — Appendix (Peds)',s:'76856B  ·  imaging orders — ultrasound  ·  fmc',g:'FMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'FMC — Pelvis (Non-OB)',s:'225581  ·  imaging orders — ultrasound  ·  fmc',g:'FMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'FMC — Pelvis (OB <14wks)',s:'218633  ·  imaging orders — ultrasound  ·  fmc',g:'FMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'imaging',i:'🔬',t:'FMC — Gastrostomy Tube Confirmation',s:'74018A  ·  Also order Gastrograffin 20mL → 5980  ·  imaging orders — xray  ·  fmc',g:'FMC Imaging Orders',gc:'t-phone',u:'ed-phone-directory.html'},

  // ── KEY STAFF ───────────────────────────────────────────────────────────
  {type:'staff',i:'👤',t:'OMC — Dr. Michael Schwartzwald, Chief of Svc.',s:'45840  ·  TL 826-45841  ·  key staff — omc ed  ·  omc',g:'OMC Key Staff',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'staff',i:'👤',t:'OMC — Brittany Martinez – OMC Admin Specialist',s:'45842  ·  Fax 45801  ·  key staff — omc ed  ·  omc',g:'OMC Key Staff',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'staff',i:'👤',t:'OMC — Dept / General Staff Fax',s:'45838  ·  key staff — omc ed  ·  omc',g:'OMC Key Staff',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'staff',i:'👤',t:'OMC — Claude Allaire, RN – ACD',s:'45817  ·  key staff — omc ed  ·  omc',g:'OMC Key Staff',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'staff',i:'👤',t:'OMC — Paxton Faskell, RN – ACD',s:'45809  ·  key staff — omc ed  ·  omc',g:'OMC Key Staff',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'staff',i:'👤',t:'OMC — Rosa Gonzalez, RN – ACD',s:'45828  ·  key staff — omc ed  ·  omc',g:'OMC Key Staff',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'staff',i:'👤',t:'OMC — Marcos Guerra, RN – ACD',s:'45851  ·  key staff — omc ed  ·  omc',g:'OMC Key Staff',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'staff',i:'👤',t:'OMC — Sonya Sandhu, RN – ACD/Educator',s:'45826  ·  key staff — omc ed  ·  omc',g:'OMC Key Staff',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'staff',i:'👤',t:'OMC — Willie Hernandez, RN – ACD/Educator',s:'45827  ·  key staff — omc ed  ·  omc',g:'OMC Key Staff',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'staff',i:'👤',t:'OMC — Gerry Pence – Unit Manager',s:'45848  ·  key staff — omc ed  ·  omc',g:'OMC Key Staff',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'staff',i:'👤',t:'OMC — Lynda Salas – Clerical Svcs Supervisor',s:'—  ·  key staff — omc ed  ·  omc',g:'OMC Key Staff',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'staff',i:'👤',t:'OMC — Communications / In-basket RN',s:'45849  ·  key staff — omc ed  ·  omc',g:'OMC Key Staff',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'staff',i:'👤',t:'FMC — Dr. Michael Schwartzwald, Chief',s:'29184  ·  Fax 29196  ·  key staff — fmc ed  ·  fmc',g:'FMC Key Staff',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'staff',i:'👤',t:'FMC — David Thiessen – Unit Manager',s:'29086  ·  Fax 29110  ·  key staff — fmc ed  ·  fmc',g:'FMC Key Staff',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'staff',i:'👤',t:'FMC — Denise Ramos',s:'29176  ·  Fax 29196  ·  key staff — fmc ed  ·  fmc',g:'FMC Key Staff',gc:'t-phone',u:'ed-phone-directory.html'},
  {type:'staff',i:'👤',t:'FMC — ED Security Specialist',s:'35500  ·  key staff — fmc ed  ·  fmc',g:'FMC Key Staff',gc:'t-phone',u:'ed-phone-directory.html'},

  // ── SITE PAGES ──────────────────────────────────────────────────────────
  {type:'page',i:'🤝',t:'Agreements & Protocols',s:'Kaiser  ·  SCPMG  ·  department agreements  ·  policies  ·  clinical protocols',g:'Reference',gc:'t-algo',u:'service-agreements.html'},
  {type:'page',i:'🔗',t:'External Links',s:'useful links  ·  references  ·  resources  ·  clinical tools  ·  external sites',g:'Reference',gc:'t-algo',u:'links.html'},
  {type:'page',i:'🗺️',t:'Roadmap',s:'upcoming features  ·  planned additions  ·  site roadmap',g:'Reference',gc:'t-algo',u:'roadmap.html'},

];

const KP_PHONE_INDEX_STORAGE_KEY = 'kp_er_phone_directory_index_v1';
const KP_SERVICE_AGREEMENTS_STORAGE_KEY = 'kp_er_service_agreements_index_v1';
const KP_SERVICE_AGREEMENTS_URL = 'data/service_agreements_index.json';

function kpDefaultTagClass(type) {
  if (type === 'phrase') return 't-phrase';
  if (type === 'calc') return 't-calc';
  if (type === 'algo') return 't-algo';
  if (type === 'neuro') return 't-neuro';
  if (type === 'drug') return 't-drug';
  return 't-phone';
}

function kpDefaultIcon(type) {
  if (type === 'phrase') return '📋';
  if (type === 'calc') return '🧮';
  if (type === 'algo') return '🔀';
  if (type === 'neuro') return '🧠';
  if (type === 'drug') return '💊';
  if (type === 'imaging') return '🔬';
  if (type === 'staff') return '👤';
  if (type === 'page') return '📄';
  return '📞';
}

function kpNormalizeSearchItem(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const type = String(raw.type || 'phone');
  const t = String(raw.t || '').trim();
  const u = String(raw.u || '').trim();
  if (!t || !u) return null;
  return {
    type,
    i: String(raw.i || kpDefaultIcon(type)),
    t,
    s: String(raw.s || ''),
    g: String(raw.g || 'Reference'),
    gc: String(raw.gc || kpDefaultTagClass(type)),
    u,
  };
}

function kpReadPhoneIndexFromStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(KP_PHONE_INDEX_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(kpNormalizeSearchItem).filter(Boolean);
  } catch (err) {
    return [];
  }
}

function kpBuildAgreementSearchSubtitle(agreement) {
  const chunks = [];
  if (Array.isArray(agreement.departments) && agreement.departments.length) {
    chunks.push(agreement.departments.join(' / '));
  }
  if (Array.isArray(agreement.tags) && agreement.tags.length) {
    chunks.push(agreement.tags.slice(0, 6).join(' '));
  }
  if (Array.isArray(agreement.summary_bullets) && agreement.summary_bullets.length) {
    chunks.push(agreement.summary_bullets.slice(0, 3).join(' '));
  }
  if (Array.isArray(agreement.ed_actions) && agreement.ed_actions.length) {
    chunks.push(agreement.ed_actions.slice(0, 2).join(' '));
  }
  if (agreement.last_updated) {
    chunks.push(`updated ${agreement.last_updated}`);
  }
  let subtitle = chunks.join(' · ').replace(/\s+/g, ' ').trim();
  if (subtitle.length > 380) subtitle = `${subtitle.slice(0, 377)}...`;
  return subtitle;
}

function kpNormalizeAgreementSearchItem(agreement) {
  if (!agreement || typeof agreement !== 'object') return null;
  const title = String(agreement.title || '').trim();
  if (!title) return null;
  return kpNormalizeSearchItem({
    type: 'page',
    i: '📑',
    t: title,
    s: kpBuildAgreementSearchSubtitle(agreement),
    g: 'Service Agreements',
    gc: 't-algo',
    u: 'service-agreements.html',
  });
}

function kpReadServiceAgreementIndexFromStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(KP_SERVICE_AGREEMENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(kpNormalizeSearchItem).filter(Boolean);
  } catch (err) {
    return [];
  }
}

function kpWriteServiceAgreementIndexToStorage(items) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(KP_SERVICE_AGREEMENTS_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    // Ignore storage quota/private mode failures.
  }
}

async function kpRefreshServiceAgreementIndex() {
  if (typeof window === 'undefined' || typeof fetch !== 'function') return;
  try {
    const res = await fetch(KP_SERVICE_AGREEMENTS_URL, { cache: 'no-store' });
    if (!res.ok) return;
    const payload = await res.json();
    const agreements = Array.isArray(payload && payload.agreements) ? payload.agreements : [];
    const items = agreements
      .filter((agreement) => {
        const src = String((agreement && agreement.source_filename) || '').toLowerCase();
        return src.endsWith('.doc') || src.endsWith('.docx');
      })
      .map(kpNormalizeAgreementSearchItem)
      .filter(Boolean);
    kpWriteServiceAgreementIndexToStorage(items);
    if (typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
      window.dispatchEvent(new CustomEvent('kp-search-index-updated'));
    }
  } catch (err) {
    // Ignore network failures so static search still works.
  }
}

function getSearchIndex() {
  const merged = [];
  const seen = new Set();

  const add = (item) => {
    const normalized = kpNormalizeSearchItem(item);
    if (!normalized) return;
    const key = [
      normalized.type,
      normalized.t.toLowerCase(),
      normalized.s.toLowerCase(),
      normalized.g.toLowerCase(),
      normalized.u.toLowerCase(),
    ].join('|');
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(normalized);
  };

  SEARCH_INDEX.forEach(add);
  kpReadPhoneIndexFromStorage().forEach(add);
  kpReadServiceAgreementIndexFromStorage().forEach(add);
  return merged;
}

if (typeof window !== 'undefined') {
  window.getSearchIndex = getSearchIndex;
  window.KP_ER_SEARCH = {
    getSearchIndex,
    phoneIndexStorageKey: KP_PHONE_INDEX_STORAGE_KEY,
    serviceAgreementsStorageKey: KP_SERVICE_AGREEMENTS_STORAGE_KEY,
  };
  kpRefreshServiceAgreementIndex();
}

(function initSharedNavSearch() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Home has a dedicated hero search. Directory has its own large live-search bar.
  if (document.getElementById('si') || document.getElementById('globalSearch')) return;
  if (document.getElementById('kp-shared-search-host')) return;

  const nav = document.querySelector('.sitenav');
  if (!nav) return;

  const styleId = 'kp-shared-search-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
#kp-shared-search-host{background:#0d1829;border-bottom:1px solid #1a2d48;padding:10px 20px}
#kp-shared-search-wrap{max-width:1200px;margin:0 auto;position:relative}
#kp-shared-search-input{width:100%;padding:12px 40px 12px 44px;background:#111f35;border:1px solid #243d5c;border-radius:10px;color:#e8f0fc;font-size:14px;outline:none;transition:border-color .15s,box-shadow .15s}
#kp-shared-search-input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.15)}
#kp-shared-search-input::placeholder{color:#4a6280}
#kp-shared-search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:15px;pointer-events:none}
#kp-shared-search-kbd{position:absolute;right:12px;top:50%;transform:translateY(-50%);font:11px 'JetBrains Mono',monospace;color:#8fa8c8;background:#0d2038;border:1px solid #1a2d48;padding:2px 7px;border-radius:5px}
#kp-shared-search-dd{position:absolute;left:0;right:0;top:calc(100% + 8px);background:#0d1829;border:1px solid #243d5c;border-radius:12px;overflow:hidden;box-shadow:0 22px 48px rgba(0,0,0,.55);display:none;max-height:68vh;overflow-y:auto;z-index:1000}
#kp-shared-search-dd.open{display:block}
.kp-sg{padding:7px 14px 4px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#4a6280;border-top:1px solid #1a2d48;background:#0d1829;position:sticky;top:0}
.kp-sg:first-child{border-top:none}
.kp-sr{display:flex;align-items:center;gap:10px;padding:9px 14px;text-decoration:none}
.kp-sr:hover,.kp-sr.hi{background:#111f35}
.kp-sr:focus-visible{outline:2px solid #60a5fa;outline-offset:-2px}
.kp-si{width:20px;text-align:center;font-size:14px;flex-shrink:0}
.kp-sb{flex:1;min-width:0}
.kp-st{font-size:13px;color:#e8f0fc;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kp-ss{font-size:11px;color:#8fa8c8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kp-tag{font-size:10px;padding:2px 7px;border-radius:20px;font-weight:700;border:1px solid transparent;white-space:nowrap;flex-shrink:0}
.kp-empty{padding:16px 14px;text-align:center;color:#8fa8c8;font-size:12px}
.kp-foot{padding:6px 14px 8px;font-size:11px;color:#8fa8c8;border-top:1px solid #1a2d48}
.kp-tag.t-phrase{background:#0d2038;color:#38bdf8;border-color:#0369a1}
.kp-tag.t-calc{background:#0d2d1f;color:#4ade80;border-color:#15803d}
.kp-tag.t-drug{background:#2d1f0d;color:#fb923c;border-color:#c2410c}
.kp-tag.t-phone{background:#1f1a0d;color:#facc15;border-color:#a16207}
.kp-tag.t-algo{background:#0d2d2d;color:#22d3ee;border-color:#0e7490}
.kp-tag.t-neuro{background:#1f0d2d;color:#e879f9;border-color:#a21caf}
@media(max-width:640px){#kp-shared-search-host{padding:8px 12px}#kp-shared-search-kbd{display:none}}
`;
    document.head.appendChild(style);
  }

  const host = document.createElement('div');
  host.id = 'kp-shared-search-host';
  host.innerHTML = `
<div id="kp-shared-search-wrap">
  <span id="kp-shared-search-icon">🔎</span>
  <input id="kp-shared-search-input" type="text" autocomplete="off" spellcheck="false" placeholder="Search toolkit + phone directory..."
    role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded="false"
    aria-controls="kp-shared-search-dd" aria-label="Search toolkit and phone directory">
  <span id="kp-shared-search-kbd">⌘K</span>
  <div id="kp-shared-search-dd" role="listbox" aria-label="Search results"></div>
</div>`;
  nav.insertAdjacentElement('afterend', host);

  const input = document.getElementById('kp-shared-search-input');
  const dd = document.getElementById('kp-shared-search-dd');
  let hiIdx = -1;

  const GROUP_PRIORITY = [
    'Dotphrases',
    'Calculators',
    'Algorithms',
    'Neuro Hub',
    'Drugs',
    'OMC',
    'FMC',
    'External',
    'OMC Imaging Orders',
    'FMC Imaging Orders',
    'OMC Key Staff',
    'FMC Key Staff',
    'Reference',
  ];

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (ch) => (
    ch === '&' ? '&amp;' :
    ch === '<' ? '&lt;' :
    ch === '>' ? '&gt;' :
    ch === '"' ? '&quot;' : '&#39;'
  ));

  const safeHref = (href) => {
    const trimmed = String(href || '').trim();
    return /^[A-Za-z0-9._/-]+\.html(?:#[A-Za-z0-9._:-]+)?$/.test(trimmed)
      ? trimmed
      : 'index.html';
  };
  const setExpanded = (open) => input.setAttribute('aria-expanded', open ? 'true' : 'false');
  const clearActiveDescendant = () => input.removeAttribute('aria-activedescendant');
  const setActiveDescendant = (rows) => {
    if (hiIdx >= 0 && rows[hiIdx] && rows[hiIdx].id) input.setAttribute('aria-activedescendant', rows[hiIdx].id);
    else clearActiveDescendant();
  };

  const getGroup = (item) => {
    if (item.type === 'phrase') return 'Dotphrases';
    if (item.type === 'calc') return 'Calculators';
    if (item.type === 'algo') return 'Algorithms';
    if (item.type === 'neuro') return 'Neuro Hub';
    if (item.type === 'drug') return 'Drugs';
    if (item.type === 'imaging') return item.g || 'Imaging Orders';
    if (item.type === 'staff') return item.g || 'Key Staff';
    if (item.type === 'page') return item.g || 'Reference';
    if (item.type === 'phone') return item.g || 'Phone Directory';
    return item.g || 'Other';
  };

  const orderedGroups = (groups) => {
    const names = Object.keys(groups);
    const remaining = names
      .filter((name) => !GROUP_PRIORITY.includes(name))
      .sort((a, b) => a.localeCompare(b));
    return GROUP_PRIORITY.filter((name) => groups[name]).concat(remaining);
  };

  const render = (rawQuery) => {
    const query = (rawQuery || '').trim();
    if (!query) {
      dd.classList.remove('open');
      dd.innerHTML = '';
      hiIdx = -1;
      clearActiveDescendant();
      setExpanded(false);
      return;
    }

    const lo = query.toLowerCase();
    const idx = getSearchIndex();
    let results = idx.filter((item) => (
      item.t.toLowerCase().includes(lo) ||
      item.s.toLowerCase().includes(lo) ||
      item.g.toLowerCase().includes(lo)
    ));

    results.sort((a, b) => {
      const aStarts = a.t.toLowerCase().startsWith(lo) ? 0 : 1;
      const bStarts = b.t.toLowerCase().startsWith(lo) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;

      const aTitle = a.t.toLowerCase().includes(lo) ? 0 : 1;
      const bTitle = b.t.toLowerCase().includes(lo) ? 0 : 1;
      if (aTitle !== bTitle) return aTitle - bTitle;

      return a.t.localeCompare(b.t);
    });

    const total = results.length;
    results = results.slice(0, 24);
    hiIdx = -1;

    if (!results.length) {
      dd.innerHTML = '<div class="kp-empty" role="status" aria-live="polite">No results</div>';
      dd.classList.add('open');
      setExpanded(true);
      return;
    }

    const grouped = {};
    results.forEach((item) => {
      const grp = getGroup(item);
      if (!grouped[grp]) grouped[grp] = [];
      grouped[grp].push(item);
    });

    let html = '';
    let rowIndex = 0;
    orderedGroups(grouped).forEach((groupName) => {
      html += `<div class="kp-sg">${escapeHtml(groupName)}</div>`;
      grouped[groupName].forEach((item) => {
        const rowId = `kp-sr-${rowIndex++}`;
        html += `<a class="kp-sr" id="${rowId}" role="option" aria-selected="false" href="${safeHref(item.u)}">
  <span class="kp-si">${escapeHtml(item.i)}</span>
  <div class="kp-sb">
    <div class="kp-st">${escapeHtml(item.t)}</div>
    <div class="kp-ss">${escapeHtml(item.s)}</div>
  </div>
  <span class="kp-tag ${escapeHtml(item.gc)}">${escapeHtml(item.g)}</span>
</a>`;
      });
    });

    if (total > 24) {
      html += `<div class="kp-foot">Showing 24 of ${total} results</div>`;
    }

    dd.innerHTML = html;
    dd.classList.add('open');
    setExpanded(true);
    clearActiveDescendant();
  };

  input.addEventListener('input', () => render(input.value));
  input.addEventListener('focus', () => { if (input.value.trim()) render(input.value); });
  window.addEventListener('kp-search-index-updated', () => {
    if (input.value.trim()) render(input.value);
  });
  input.addEventListener('keydown', (e) => {
    const rows = Array.from(dd.querySelectorAll('.kp-sr'));
    if (e.key === 'ArrowDown') {
      hiIdx = Math.min(hiIdx + 1, rows.length - 1);
      rows.forEach((el, i) => {
        const active = i === hiIdx;
        el.classList.toggle('hi', active);
        el.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      setActiveDescendant(rows);
      if (rows[hiIdx]) rows[hiIdx].scrollIntoView({ block: 'nearest' });
      e.preventDefault();
      return;
    }
    if (e.key === 'ArrowUp') {
      hiIdx = Math.max(hiIdx - 1, 0);
      rows.forEach((el, i) => {
        const active = i === hiIdx;
        el.classList.toggle('hi', active);
        el.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      setActiveDescendant(rows);
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter' && hiIdx >= 0 && rows[hiIdx]) {
      rows[hiIdx].click();
      return;
    }
    if (e.key === 'Escape') {
      dd.classList.remove('open');
      setExpanded(false);
      clearActiveDescendant();
      input.blur();
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#kp-shared-search-wrap')) {
      dd.classList.remove('open');
      setExpanded(false);
      clearActiveDescendant();
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
})();
