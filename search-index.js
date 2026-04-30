// ╔══════════════════════════════════════════════════════════════════╗
// ║  KP/ER Search Index — search-index.js                           ║
// ║  Auto-generated — 436 entries                                ║
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
// ║    - SERVICE AGREEMENTS (17 entries)                       ║
// ║    - ALGORITHMS  (29 entries)                              ║
// ║    - NEURO HUB   (10 entries)                              ║
// ║    - VASOPRESSORS (8 entries)                           ║
// ║    - RSI MEDS    (9 entries)                               ║
// ║    - PHONE DIR   (92 entries)                             ║
// ║    - IMAGING     (24 entries)                              ║
// ║    - KEY STAFF   (16 entries)                              ║
// ║    - KAISER DOCS (11 entries)                              ║
// ╚══════════════════════════════════════════════════════════════════╝

const SEARCH_INDEX = [


  // ── CORE PAGES ──────────────────────────────────────────────────────────
  {type:'page',i:'📋',t:'Service Request Board',s:'service request facility maintenance equipment housekeeping IT supply broken missing upvote',g:'Tools',gc:'t-algo',u:'service-requests.html'},

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
  {type:'calc',i:'🧮',t:'NIHSS',s:'NIH Stroke Scale  ·  acute stroke severity  ·  thrombolysis  ·  thrombectomy  ·  neurology',g:'Calculator',gc:'t-calc',u:'calculators.html#calc-nihss'},
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

  // ── SERVICE AGREEMENTS ─────────────────────────────────────────────────
  {type:'sa',i:'📑',t:'Necrotizing Fasciitis',s:'necrotizing fasciitis  ·  soft tissue infection  ·  LRINEC  ·  gas gangrene  ·  surgical emergency  ·  transfer',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#necfasc'},
  {type:'sa',i:'📑',t:'Pediatric Appendicitis',s:'peds appendicitis  ·  PAS score  ·  pediatric surgery  ·  children  ·  transfer  ·  GMC STMC',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#pedsappendix'},
  {type:'sa',i:'📑',t:'Urology Service Agreement',s:'urology  ·  renal colic  ·  urolithiasis  ·  stone  ·  torsion  ·  urinary retention  ·  hematuria  ·  Fournier  ·  four-tier',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#urology'},
  {type:'sa',i:'📑',t:'Hip Fracture — Ortho/Medicine',s:'hip fracture  ·  orthopedics  ·  internal medicine  ·  dual consult  ·  surgical planning  ·  admit',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#hipfracture'},
  {type:'sa',i:'📑',t:'IM & General Surgery Admissions',s:'internal medicine  ·  general surgery  ·  biliary  ·  cholecystitis  ·  bowel obstruction  ·  diverticulitis  ·  routing  ·  admission',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#imgsurg'},
  {type:'algo',i:'💗',t:'Atrial Fibrillation / Flutter',s:'afib  ·  atrial fibrillation  ·  flutter  ·  rate control  ·  cardioversion  ·  diltiazem  ·  metoprolol  ·  CHA2DS2-VASc  ·  anticoagulation  ·  echocardiography  ·  cardiology',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-afib'},
  {type:'sa',i:'📑',t:'Prolonged ED LOS (PLOS)',s:'PLOS  ·  prolonged LOS  ·  length of stay  ·  hospital medicine  ·  CWD  ·  observation  ·  disposition barrier',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#plos'},
  {type:'sa',i:'📑',t:'Non-member Transfer Process',s:'non-member  ·  transfer  ·  authorization  ·  managed care  ·  commercial  ·  medicare  ·  medi-cal  ·  secure chat  ·  one hour rule  ·  PLOS pilot',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#nonmember-transfer'},
  {type:'sa',i:'📑',t:'Adult Primary Care & EM',s:'adult primary care  ·  family medicine  ·  chronic disease  ·  outpatient  ·  referral  ·  consult agreement',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#adultprimarycare'},
  {type:'sa',i:'📑',t:'OB-GYN, Urgent Care & EM',s:'obstetrics  ·  gynecology  ·  OB GYN  ·  pregnancy  ·  pelvic pain  ·  bleeding  ·  urgent care  ·  consult',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#obgyn-uc-em'},
  {type:'sa',i:'🤰',t:'OB/L&D — Viable Pregnancy Transfer from ED',s:'labor and delivery  ·  L&D  ·  viable pregnancy  ·  transfer  ·  FMC  ·  OMC  ·  monitoring  ·  do not discharge  ·  trackboard  ·  encounter  ·  OB  ·  obstetrics  ·  ED clerk  ·  Schwartzwald  ·  Kim',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#ld-viable-pregnancy-transfer'},
  {type:'sa',i:'📑',t:'Psychiatry & ED Service Agreement',s:'psychiatry  ·  psych  ·  behavioral health  ·  mental health  ·  5150  ·  hold  ·  agitation  ·  involuntary  ·  IM hospitalists',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#psych-ed'},
  {type:'sa',i:'📑',t:'Neurosurgery ED Transfer Agreement',s:'neurosurgery  ·  neuro  ·  brain bleed  ·  ICH  ·  SDH  ·  EDH  ·  intracranial hemorrhage  ·  spinal cord  ·  spine  ·  transfer',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#neurosurg-transfer'},
  {type:'sa',i:'📑',t:'SNF to Emergency Medicine',s:'SNF  ·  skilled nursing facility  ·  transfer  ·  return to SNF  ·  disposition  ·  ED bounce-back  ·  rehab',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#snf-em'},
  {type:'sa',i:'📑',t:'Ophthalmology & EM',s:'ophthalmology  ·  eye  ·  vision  ·  ocular emergency  ·  retinal detachment  ·  globe rupture  ·  acute angle closure glaucoma  ·  consult',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#ophtho-em'},
  {type:'sa',i:'📑',t:'Hospitalist / Intensivist / Cardiologist & EM',s:'hospitalist  ·  intensivist  ·  cardiologist  ·  ICU  ·  critical care  ·  STEMI  ·  cardiac arrest  ·  multi-service  ·  admit',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#hosp-intensivist-cards'},
  {type:'sa',i:'📑',t:'Pediatrics & EM Transfer (OMC → FMC)',s:'pediatrics  ·  peds  ·  children  ·  transfer  ·  OMC  ·  FMC  ·  Fontana  ·  Ontario  ·  inter-facility',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#peds-em-transfer'},
  {type:'sa',i:'📑',t:'IM & Code Sepsis Agreement',s:'sepsis  ·  code sepsis  ·  SIRS  ·  qSOFA  ·  lactate  ·  blood cultures  ·  antibiotics  ·  septic shock  ·  vasopressors  ·  bundle',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#im-codesepsis'},
  {type:'sa',i:'📑',t:'SBCSD & Kaiser — Shared Patient Care',s:'SBCSD  ·  sheriff  ·  San Bernardino  ·  Kaiser  ·  detained  ·  inmate  ·  law enforcement  ·  shared care  ·  inter-agency  ·  custody',g:'Service Agreement',gc:'t-algo',u:'service-agreements.html#sbcsd-kaiser'},

  // ── HOSPITAL PROTOCOLS ─────────────────────────────────────────────────
  {type:'sa',i:'🏥',t:'Code Blue — Cardiac/Respiratory',s:'code blue  ·  cardiac arrest  ·  respiratory arrest  ·  CPR  ·  resuscitation  ·  fontana  ·  ontario  ·  FMC  ·  OMC',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#code-blue'},
  {type:'sa',i:'🏥',t:'Code Sepsis Protocol',s:'code sepsis  ·  sepsis  ·  SIRS  ·  qSOFA  ·  lactate  ·  antibiotics  ·  septic shock  ·  bundle  ·  protocol',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#code-sepsis'},
  {type:'sa',i:'❤️‍🔥',t:'STEMI Patients — Receiving Centers & Protocol',s:'STEMI  ·  ST elevation  ·  acute MI  ·  myocardial infarction  ·  cath lab  ·  PCI  ·  receiving center  ·  St Bernadine  ·  Loma Linda  ·  San Antonio Community  ·  AMR transport  ·  EKG fax  ·  ICEMA  ·  Kaiser Fontana  ·  Ontario  ·  clerk activation  ·  911  ·  SRF  ·  heparin  ·  nitropaste  ·  ASA  ·  dopamine  ·  lidocaine  ·  procainamide  ·  door-in door-out',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#stemi-protocol'},
  {type:'sa',i:'🧠',t:'Code 24 / Code Stroke — BEFAST',s:'code 24  ·  code stroke  ·  BEFAST  ·  balance eyes face arms speech time  ·  NIHSS  ·  teleneurologist  ·  323-699-4444  ·  last seen normal  ·  LSN  ·  wake up stroke  ·  CODE24 CTH  ·  CODE24 CTA  ·  intracranial occlusion  ·  ETAP  ·  CSC transfer  ·  thrombectomy  ·  LVO  ·  EDHelp smartphrase  ·  6-24 hours',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#code-24-stroke'},
  {type:'sa',i:'🏥',t:'Trauma Guidelines',s:'trauma  ·  trauma activation  ·  trauma guidelines  ·  injury  ·  mechanism  ·  level 1  ·  level 2  ·  criteria',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#trauma-guidelines'},
  {type:'sa',i:'🏥',t:'Trauma Triage',s:'trauma triage  ·  trauma criteria  ·  activation  ·  injury  ·  mechanism  ·  level  ·  protocol',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#trauma-triage'},
  {type:'sa',i:'🏥',t:'MD Restraint Cheat Sheet',s:'restraint  ·  chemical restraint  ·  physical restraint  ·  behavioral  ·  agitation  ·  violent patient  ·  documentation  ·  quick reference',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#md-restraint'},
  {type:'sa',i:'🏥',t:'Urine GC/Chlamydia Order Guide (<12 yrs)',s:'urine GC  ·  chlamydia  ·  gonorrhea  ·  STI  ·  pediatric  ·  abuse  ·  sexual assault  ·  labs  ·  order  ·  12 years',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#urine-gc-chlamydia'},
  {type:'sa',i:'🕊️',t:'Medical Wean / End of Life Management',s:'medical wean  ·  end of life  ·  EOL  ·  palliative  ·  comfort care  ·  terminal extubation  ·  withdrawal of care  ·  ventilator wean  ·  pressors  ·  ICU  ·  hospice  ·  goals of care  ·  DNR  ·  DNI  ·  dying  ·  morphine drip',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#medical-wean-eol'},
  {type:'sa',i:'🧠',t:'Dementia w/ Behavioral Disturbance — ED Workflow',s:'dementia  ·  behavioral disturbance  ·  BPSD  ·  agitation  ·  elderly  ·  geriatric  ·  delirium  ·  confusion  ·  sundowning  ·  psychiatric  ·  behavioral management  ·  ED workflow',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#dementia-behavioral-ed'},
  {type:'sa',i:'💉',t:'IV Versed — ED RN Scope Clarification',s:'IV versed  ·  midazolam  ·  RN scope  ·  nurse scope  ·  procedural sedation  ·  contingent workers  ·  travelers  ·  registry  ·  anxiolysis  ·  conscious sedation  ·  benzodiazepine  ·  clarification  ·  FAQ',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#iv-versed-rn-scope'},
  {type:'sa',i:'🆘',t:'Emergency Release & Hemorrhage Protocol — Blood Products',s:'emergency release  ·  hemorrhage protocol  ·  massive transfusion  ·  MTP  ·  uncrossmatched  ·  blood bank  ·  RBC  ·  packed red blood cells  ·  fresh frozen plasma  ·  FFP  ·  platelets pheresis  ·  waiver form  ·  fontana  ·  ontario  ·  FMC  ·  OMC  ·  transfusion committee  ·  NS.GNS.IVT.016  ·  ext 42984  ·  ext 28080  ·  group O negative  ·  ABO compatible  ·  KPPI  ·  type and screen  ·  crossmatch  ·  labor and delivery  ·  emergency department  ·  OR',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#emergency-hemorrhage-protocol'},
  {type:'sa',i:'🩸',t:'Bloodborne Pathogen Post-Exposure Protocol',s:'bloodborne pathogen  ·  BBP  ·  post-exposure  ·  needle stick  ·  sharps injury  ·  HIV  ·  HepC  ·  HepB  ·  HBsAG  ·  HBsAb  ·  rapid HIV  ·  PEP  ·  prophylaxis  ·  occupational exposure  ·  mucous membrane  ·  percutaneous  ·  KOJ  ·  Kaiser on the Job  ·  employee health  ·  DWC-1  ·  SRI  ·  supervisor report of injury  ·  Sedgwick  ·  Teresa Gwinn  ·  Sherri Fuchs  ·  Christine Petrovick  ·  Dr Perez  ·  source patient labs  ·  Fontana  ·  Ontario  ·  FMC  ·  OMC',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#bbp-exposure-protocol'},
  {type:'sa',i:'🏥',t:'Last Hour Assignment Protocol',s:'last hour  ·  assignment  ·  end of shift  ·  late arrivals  ·  coverage  ·  staffing  ·  protocol',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#last-hour-assignment'},
  {type:'sa',i:'📊',t:'FMC Shift PSG Assignments',s:'FMC  ·  shift  ·  PSG  ·  point scoring guide  ·  patient assignments  ·  triage  ·  ESI  ·  hourly points  ·  mod pod  ·  longest waiting  ·  staffing  ·  workload distribution',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#fmc-psg-assignments'},
  {type:'sa',i:'🏥',t:'Rx Sign-Out Workflow',s:'rx  ·  prescription  ·  sign-out  ·  handoff  ·  controlled substance  ·  narcotics  ·  workflow  ·  pharmacy',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#rx-signout'},
  {type:'sa',i:'🏥',t:'Inbasket Abnormal Results Workflow',s:'inbasket  ·  abnormal results  ·  pending labs  ·  follow-up  ·  critical value  ·  notification  ·  workflow',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#inbasket-results'},
  {type:'sa',i:'🏥',t:'Radiology Safety Net Process',s:'radiology  ·  safety net  ·  follow-up  ·  abnormal imaging  ·  critical finding  ·  notification  ·  workflow  ·  radiology report',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#radiology-safety-net'},
  {type:'sa',i:'🌙',t:'Overnight IR Procedures',s:'overnight  ·  IR  ·  interventional radiology  ·  charge RN  ·  non-emergent  ·  night  ·  scheduling  ·  fontana  ·  ontario  ·  FMC  ·  OMC  ·  ED physician  ·  order  ·  voicemail  ·  extension  ·  24044  ·  45210  ·  MR#',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#overnight-ir-procedures'},
  {type:'sa',i:'🏥',t:'MD-RN Communication Strategy (FMC)',s:'MD RN  ·  physician nurse  ·  communication  ·  FMC  ·  fontana  ·  handoff  ·  teamwork  ·  strategy',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#md-rn-communication'},
  {type:'sa',i:'🏥',t:'FMC/OMC ED Operations',s:'fontana  ·  ontario  ·  ED operations  ·  operational  ·  procedures  ·  FMC  ·  OMC  ·  emergency department',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#fmc-ed-operations'},
  {type:'sa',i:'🏥',t:'FMC Throughput Changes — Phase 1',s:'FMC  ·  throughput  ·  patient flow  ·  door-to-doctor  ·  efficiency  ·  phase 1  ·  fontana',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#fmc-throughput-1'},
  {type:'sa',i:'🏥',t:'FMC Throughput Changes — Phase 2',s:'FMC  ·  throughput  ·  patient flow  ·  door-to-doctor  ·  efficiency  ·  phase 2  ·  fontana',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#fmc-throughput-2'},
  {type:'sa',i:'💧',t:'Fluorescein Strip Replacement — OMC Drops',s:'fluorescein  ·  strips  ·  drops  ·  Altafluor  ·  Benox  ·  OMC  ·  ophthalmic  ·  eye exam  ·  corneal abrasion  ·  order  ·  pyxis  ·  refrigerator  ·  single-use  ·  replacement  ·  benoxinate',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#fluorescein-drops-omc'},
  {type:'sa',i:'📷',t:'Funduscopic Images — Viewing Workflow',s:'fundus camera  ·  funduscopic  ·  images  ·  viewing  ·  workflow  ·  PACS  ·  chart review  ·  eye tab  ·  fundus photography  ·  both eyes  ·  View images and PDF report  ·  ophthalmology  ·  papilledema',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#fundus-camera-viewing'},
  {type:'sa',i:'🏥',t:'Kaiser → Loma Linda Neuro Radiology Process',s:'Kaiser  ·  Loma Linda  ·  LLU  ·  neuro radiology  ·  transfer  ·  neurology  ·  neurosurgery  ·  imaging  ·  process',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#kaiser-llu-neuro'},
  {type:'sa',i:'🏥',t:'Fontana Regional Neonatal Transport Service',s:'neonatal  ·  transport  ·  fontana  ·  NICU  ·  newborn  ·  infant  ·  transfer  ·  regional  ·  transport service',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#neonatal-transport'},
  {type:'sa',i:'🏥',t:'CA Minor Consent & Confidentiality Laws',s:'California  ·  minor  ·  consent  ·  confidentiality  ·  adolescent  ·  teens  ·  HIPAA  ·  privacy  ·  STI  ·  mental health  ·  legal',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#ca-minor-consent'},
  {type:'sa',i:'🏥',t:'Chaperone Guidelines for Physicians',s:'chaperone  ·  physician  ·  exam  ·  sensitive examination  ·  policy  ·  guidelines  ·  requirements',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#chaperone-guidelines'},
  {type:'sa',i:'🏥',t:'Documenting Acute Kidney Injury',s:'AKI  ·  acute kidney injury  ·  documentation  ·  coding  ·  billing  ·  creatinine  ·  renal failure  ·  summary',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#aki-documentation'},
  {type:'sa',i:'🏥',t:'Safe Prescribing Guidelines',s:'safe prescribing  ·  opioid  ·  controlled substance  ·  scripting  ·  DEA  ·  CURES  ·  prescription  ·  guidelines',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#safe-prescribing'},
  {type:'sa',i:'🏥',t:'NEDOCS 2.0',s:'NEDOCS  ·  ED crowding  ·  crowding score  ·  assessment  ·  version 2  ·  emergency department  ·  occupancy',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#nedocs-2'},
  {type:'sa',i:'🏥',t:'NEDOCS 3.0',s:'NEDOCS  ·  ED crowding  ·  crowding score  ·  assessment  ·  version 3  ·  emergency department  ·  occupancy',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#nedocs-3'},
  {type:'sa',i:'🏥',t:'NEDOCS — FMC',s:'NEDOCS  ·  FMC  ·  fontana  ·  ED crowding  ·  crowding score  ·  assessment  ·  protocol',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#nedocs-fmc'},
  {type:'sa',i:'🏥',t:'NEDOCS — OMC',s:'NEDOCS  ·  OMC  ·  ontario  ·  ED crowding  ·  crowding score  ·  assessment  ·  protocol',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#nedocs-omc'},
  {type:'sa',i:'💩',t:'Constipation — Brian Bomb & Pink Lady',s:'constipation  ·  brian bomb  ·  pink lady  ·  glycerin  ·  fleet enema  ·  docusate  ·  bisacodyl  ·  mineral oil  ·  magnesium citrate  ·  laxative  ·  bowel  ·  bedside mixture  ·  recipe',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#constipation-mixtures'},
  {type:'sa',i:'💉',t:'Occipital Nerve Block (3-2-1)',s:'occipital nerve block  ·  3-2-1  ·  lidocaine  ·  marcaine  ·  bupivacaine  ·  kenalog  ·  triamcinolone  ·  headache  ·  migraine  ·  cervicogenic  ·  procedure  ·  recipe',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#occipital-nerve-block'},
  {type:'sa',i:'🧒',t:'Pediatric MIS-C Talking Points',s:'MIS-C  ·  pediatric  ·  multisystem inflammatory syndrome  ·  kawasaki  ·  COVID  ·  PTAC  ·  PICU  ·  CHLA  ·  cardiogenic shock  ·  fevers  ·  conjunctivitis  ·  rash  ·  peripheral edema',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#mis-c-peds'},
  {type:'sa',i:'💉',t:'Priapism — Phenylephrine Prep & Supplies',s:'priapism  ·  phenylephrine  ·  lidocaine  ·  epinephrine  ·  corpus cavernosum  ·  aspiration  ·  urology  ·  insulin syringe  ·  Dr Lawrence  ·  procedure',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#priapism-protocol'},
  {type:'sa',i:'👅',t:'Peritonsillar Abscess Protocol',s:'peritonsillar abscess  ·  PTA  ·  decadron  ·  dexamethasone  ·  rocephin  ·  ceftriaxone  ·  augmentin  ·  clindamycin  ·  ENT  ·  throat  ·  tonsil  ·  drainage',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#peritonsillar-abscess'},
  {type:'sa',i:'🫀',t:'Stress Tests — PNL Quick Reference',s:'stress test  ·  PNL  ·  treadmill  ·  lexiscan  ·  dobutamine  ·  cardiology  ·  chest pain  ·  exercise  ·  pharmacologic',g:'Hospital Protocol',gc:'t-algo',u:'hospital-protocols.html#stress-tests-pnl'},

  // ── ALGORITHMS ─────────────────────────────────────────────────────────
  {type:'algo',i:'🔀',t:'Orbital Fractures',s:'ophthalmology  ·  eye  ·  ocular  ·  orbital blowout  ·  trauma  ·  KP SBC ED Practice Guideline',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-orbital'},
  {type:'algo',i:'🔀',t:'Papilledema',s:'optic disc swelling  ·  elevated ICP  ·  vision  ·  neurology  ·  KP SBC ED Practice Guideline',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-papilledema'},
  {type:'algo',i:'🔀',t:'Pneumomediastinum',s:'mediastinal air  ·  esophageal rupture  ·  Boerhaave  ·  chest  ·  KP SBC ED Practice Guideline',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-pneumomediastinum'},
  {type:'algo',i:'🔀',t:'Vaginal Bleeding in Pregnancy',s:'OB bleeding  ·  first trimester  ·  anti-D immunoglobulin  ·  Rhogam  ·  progesterone  ·  pregnancy of unknown location  ·  OB trauma  ·  KP SBC GYN and ED Practice Guideline',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-pregvb'},
  {type:'algo',i:'🔀',t:'Aortic Dissection',s:'chest pain  ·  tearing  ·  CTA  ·  type A type B  ·  vascular  ·  KP SBC ED Practice Guideline',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-aortic'},
  {type:'algo',i:'🔀',t:'Visual Floaters & Flashes',s:'ophthalmology  ·  retinal detachment  ·  vitreous  ·  vision  ·  KP SBC ED Practice Guideline',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-floaters'},
  {type:'algo',i:'🔀',t:'Non-Pregnant Vaginal Bleeding',s:'GYN  ·  vaginal bleeding  ·  non-OB  ·  ectopic  ·  KP SBC ED Practice Guideline',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-nonpregvb'},
  {type:'algo',i:'🦴',t:'Vertebral Compression Fracture (VCF)',s:'spine  ·  compression fracture  ·  VCF  ·  vertebral  ·  back pain  ·  brace  ·  TLSO  ·  LSO  ·  vertebroplasty  ·  neurosurgery  ·  bone density  ·  KP SBC ED Practice Guideline',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-vcf'},
  {type:'algo',i:'🤱',t:'Postpartum Severe Hypertension',s:'postpartum  ·  HTN  ·  eclampsia  ·  nifedipine  ·  magnesium  ·  HELLP  ·  preeclampsia  ·  OB  ·  delivery  ·  severe blood pressure  ·  KP SBC OB/ED',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-pphtн'},
  {type:'algo',i:'🩸',t:'Outpatient DVT Anticoagulation',s:'DVT  ·  deep vein thrombosis  ·  anticoagulation  ·  outpatient  ·  enoxaparin  ·  Wells score  ·  hematology  ·  vascular  ·  KP SBC ED',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-dvt'},
  {type:'algo',i:'🦠',t:'Sepsis — SEP-1 Bundle',s:'sepsis  ·  SEP-1  ·  SIRS  ·  septic shock  ·  lactate  ·  bundle  ·  antibiotics  ·  fluids  ·  KP SBC 7/2020',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-sepsissep1'},
  {type:'algo',i:'🤱',t:'Pre-Eclampsia / Hypertensive Emergency',s:'preeclampsia  ·  eclampsia  ·  hypertensive emergency  ·  pregnancy  ·  magnesium  ·  labetalol  ·  hydralazine  ·  nifedipine  ·  ACOG 2020',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-preeclampsia'},
  {type:'algo',i:'🐍',t:'Pit Viper Envenomation — CroFab',s:'snake bite  ·  pit viper  ·  CroFab  ·  envenomation  ·  antivenom  ·  toxicology  ·  KP SBC 5/2017',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-pitviper'},
  {type:'algo',i:'🧩',t:'ED Psychiatry Medication Quick Ref',s:'psychiatry  ·  delirium  ·  mania  ·  psychosis  ·  catatonia  ·  dementia  ·  agitation  ·  medications  ·  KP SCAL 2016',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-psychmeds'},
  {type:'algo',i:'🦴',t:'Acute Gout',s:'gout  ·  podagra  ·  colchicine  ·  NSAID  ·  steroid  ·  arthrocentesis  ·  MSK  ·  KP SBC',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-gout'},
  {type:'algo',i:'🔬',t:'Infectious Diarrhea Workup',s:'infectious diarrhea  ·  C diff  ·  GI panel  ·  parasite  ·  ova  ·  stool testing  ·  KP SCAL',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-infectiousdiarrhea'},
  {type:'algo',i:'💉',t:'Peds DKA — 2-Bag System',s:'peds DKA  ·  diabetic ketoacidosis  ·  two bag  ·  cerebral edema  ·  insulin  ·  pediatrics  ·  KP SBC',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-pedsdka'},
  {type:'algo',i:'⭐',t:'Peds Sickle Cell Fever',s:'peds sickle cell  ·  fever  ·  ceftriaxone  ·  vaso-occlusive  ·  pediatrics  ·  KP SCAL Dr. Simon 1/2022',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-pedssickle'},
  {type:'algo',i:'🌊',t:'Peds Submersion',s:'pediatric submersion  ·  drowning  ·  near drowning  ·  aspiration  ·  hypoxia  ·  KP SBC Peds ED 6/2022',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-pedssubmersion'},
  {type:'algo',i:'🧬',t:'MIS-C Stable/Unstable',s:'MIS-C  ·  multisystem inflammatory syndrome children  ·  IVIG  ·  steroids  ·  pediatrics  ·  KP SBC 11/2021',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-misc'},
  {type:'algo',i:'🧠',t:'ED Code Stroke',s:'stroke  ·  code stroke  ·  tPA  ·  thrombolysis  ·  NIHSS  ·  CT head  ·  neuro  ·  CVA  ·  ischemic  ·  hemorrhagic  ·  KP SBC ED ICEMA',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-ed-stroke'},
  {type:'algo',i:'🪖',t:'CT Head for Trauma (Canadian Rule)',s:'CT head  ·  trauma  ·  Canadian rule  ·  GCS  ·  loss of consciousness  ·  LOC  ·  TBI  ·  traumatic brain injury  ·  KPSC Emergency Medicine',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-ct-head-trauma'},
  {type:'algo',i:'🫁',t:'PE Workup: D-Dimer & CT Algorithm',s:'PE  ·  pulmonary embolism  ·  D-dimer  ·  CT angiography  ·  Wells score  ·  PERC  ·  VTE  ·  clot  ·  anticoagulation  ·  KP SBC Emergency Medicine',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-pe-workup'},
  {type:'algo',i:'🍬',t:'Peds Hyperglycemia (No Insulin Drip)',s:'pediatric hyperglycemia  ·  DKA  ·  diabetic ketoacidosis  ·  glucose  ·  insulin  ·  peds endocrine  ·  KP SBC Pediatrics',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-peds-hypergly'},
  {type:'algo',i:'👶',t:'Deliveries Prior to Arrival (DPA)',s:'DPA  ·  precipitous delivery  ·  born before arrival  ·  BBA  ·  neonate  ·  newborn resuscitation  ·  OB  ·  KP SBC Emergency Medicine',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-dpa'},
  {type:'algo',i:'💊',t:'Emergency Contraception',s:'emergency contraception  ·  Plan B  ·  ella  ·  copper IUD  ·  sexual assault  ·  pregnancy prevention  ·  KP Interregional',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-emergency-contraception'},
  {type:'algo',i:'⚖️',t:'Bariatric Surgery CT Protocols',s:'bariatric surgery  ·  gastric bypass  ·  sleeve gastrectomy  ·  CT scan protocol  ·  imaging  ·  post-op complication  ·  morbid obesity  ·  KP SBC Radiology Surgery',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-bariatric-ct'},
  {type:'algo',i:'👶',t:'Abusive Head Trauma (2022)',s:'abusive head trauma  ·  shaken baby  ·  non-accidental trauma  ·  NAT  ·  child abuse  ·  TBI  ·  subdural  ·  retinal hemorrhage  ·  KP SBC January 2022',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-abusive-head-trauma'},
  {type:'algo',i:'💉',t:'Procedural Sedation',s:'procedural sedation  ·  ketamine  ·  propofol  ·  etomidate  ·  fentanyl  ·  midazolam  ·  PSA  ·  moderate deep sedation  ·  monitoring  ·  KP SBC Hospital Protocols 2015-2016',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-procedural-sedation'},
  {type:'algo',i:'❤️‍🔥',t:'STEMI Protocol (ICEMA)',s:'STEMI  ·  ST elevation  ·  acute MI  ·  myocardial infarction  ·  cath lab  ·  PCI  ·  ICEMA',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-stemi'},
  {type:'algo',i:'🧪',t:'Troponin Testing Guide',s:'troponin  ·  high sensitivity  ·  cardiac biomarker  ·  chest pain  ·  ACS  ·  NSTEMI  ·  rule out  ·  serial',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-troponin'},
  {type:'algo',i:'🩸',t:'DOAC/TSOA Bleeding Management',s:'DOAC  ·  TSOA  ·  anticoagulant reversal  ·  bleeding  ·  apixaban  ·  rivaroxaban  ·  dabigatran  ·  andexanet  ·  idarucizumab',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-doac-bleeding'},
  {type:'algo',i:'💉',t:'Contrast Allergy Premedication',s:'contrast allergy  ·  premedication  ·  prophylaxis  ·  allergic reaction  ·  IV contrast  ·  CT scan  ·  prednisone  ·  diphenhydramine',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-contrast-allergy'},
  {type:'algo',i:'🏃',t:'Non-Invasive Stress Testing',s:'non-invasive stress test  ·  cardiac stress  ·  exercise  ·  nuclear  ·  echo  ·  treadmill  ·  risk stratification  ·  chest pain',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-stress-testing'},
  {type:'algo',i:'🆘',t:'Emergency Hemorrhage Protocol',s:'massive transfusion  ·  MTP  ·  emergency release  ·  hemorrhage  ·  blood products  ·  FFP  ·  platelets  ·  trauma',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-hemorrhage-protocol'},
  {type:'algo',i:'🩸',t:'Transfusion Protocol',s:'transfusion  ·  blood products  ·  PRBC  ·  FFP  ·  platelets  ·  crossmatch  ·  type screen  ·  indications  ·  thresholds',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-transfusion'},
  {type:'algo',i:'🛡️',t:'Post-Exposure Prophylaxis (PEP)',s:'PEP  ·  post-exposure  ·  needlestick  ·  bloodborne  ·  HIV  ·  hepatitis  ·  occupational  ·  exposure  ·  prophylaxis',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-pep'},
  {type:'algo',i:'💊',t:'Medical Abortion — Mifepristone',s:'mifepristone  ·  misoprostol  ·  medical abortion  ·  first trimester  ·  pregnancy termination  ·  OB',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-medical-abortion'},
  {type:'algo',i:'💊',t:'Paxlovid Prescribing Guide',s:'paxlovid  ·  nirmatrelvir  ·  ritonavir  ·  COVID  ·  antiviral  ·  eligibility  ·  drug interactions  ·  prescribing',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-paxlovid'},
  {type:'algo',i:'🏠',t:'ED to SNF Disposition Criteria',s:'ED to SNF  ·  skilled nursing facility  ·  discharge  ·  criteria  ·  disposition  ·  clinical guidelines  ·  2014',g:'Algorithm',gc:'t-algo',u:'algorithms.html#card-ed-snf-criteria'},

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

  // ── PEDS FEVER ──────────────────────────────────────────────────────────
  {type:'page',i:'🌡️',t:'Peds Fever — CA FIRST Protocol',s:'pediatric fever  ·  febrile infant  ·  age-stratified workup  ·  0-28 days  ·  1-3 months  ·  3-24 months  ·  risk stratification',g:'Peds Fever',gc:'t-algo',u:'pedsfever.html'},
  {type:'page',i:'🌡️',t:'Peds Fever — Neonates (0–28 days)',s:'febrile neonate  ·  high risk  ·  full sepsis workup  ·  LP  ·  ceftriaxone  ·  ampicillin  ·  admit  ·  CA FIRST',g:'Peds Fever',gc:'t-algo',u:'pedsfever.html'},
  {type:'page',i:'🌡️',t:'Peds Fever — Young Infants (29–60 days)',s:'1-3 months  ·  Step-by-Step criteria  ·  PECARN  ·  SBI risk  ·  febrile infant  ·  discharge vs admit',g:'Peds Fever',gc:'t-algo',u:'pedsfever.html'},
  {type:'page',i:'🌡️',t:'Peds Fever — 3–24 Months',s:'fever without source  ·  UTI  ·  bacteremia  ·  UA  ·  CBC  ·  occult bacteremia  ·  pneumococcal',g:'Peds Fever',gc:'t-algo',u:'pedsfever.html'},
  {type:'page',i:'🌡️',t:'Peds Fever — Older Children (>3 years)',s:'fever  ·  school age  ·  older child  ·  focal infection  ·  workup criteria  ·  antibiotics',g:'Peds Fever',gc:'t-algo',u:'pedsfever.html'},

  // ── QUICK LINKS (cards on links.html — deep-linked) ─────────────────────
  {type:'link',i:'💵',t:'Paycheck Calculator',s:'paycheck  ·  net pay  ·  taxes  ·  deductions  ·  salary  ·  withholding  ·  W-2  ·  hourly',g:'Quick Link',gc:'t-algo',u:'links.html#link-paycheck'},
  {type:'link',i:'🌀',t:'Vertigo Helper',s:'vertigo  ·  dizziness  ·  BPPV  ·  HINTS exam  ·  nystagmus  ·  central peripheral  ·  cerebellar stroke',g:'Quick Link',gc:'t-algo',u:'links.html#link-vertigo'},
  {type:'link',i:'📊',t:'FMC Main Trackboard',s:'FMC  ·  Fontana  ·  main  ·  trackboard  ·  ED tracking  ·  patient list  ·  google sheet  ·  spreadsheet  ·  whiteboard',g:'Quick Link',gc:'t-algo',u:'links.html#link-trackboard-fmc-main'},
  {type:'link',i:'📊',t:'OMC Main Trackboard',s:'OMC  ·  Ontario  ·  main  ·  trackboard  ·  ED tracking  ·  patient list  ·  google sheet  ·  spreadsheet  ·  whiteboard',g:'Quick Link',gc:'t-algo',u:'links.html#link-trackboard-omc-main'},
  {type:'link',i:'⚡',t:'FMC Flex Trackboard',s:'FMC  ·  Fontana  ·  flex  ·  mod pod  ·  surge  ·  trackboard  ·  google sheet  ·  spreadsheet  ·  ED tracking',g:'Quick Link',gc:'t-algo',u:'links.html#link-trackboard-fmc-flex'},
  {type:'link',i:'⚡',t:'OMC Flex Trackboard',s:'OMC  ·  Ontario  ·  flex  ·  mod pod  ·  surge  ·  trackboard  ·  google sheet  ·  spreadsheet  ·  ED tracking',g:'Quick Link',gc:'t-algo',u:'links.html#link-trackboard-omc-flex'},
  {type:'link',i:'📈',t:'NEDOCS — Fontana',s:'NEDOCS  ·  ED crowding  ·  Fontana  ·  FMC  ·  worksheet  ·  score  ·  excel  ·  sharepoint  ·  capacity',g:'Quick Link',gc:'t-algo',u:'links.html#link-nedocs-fontana'},
  {type:'link',i:'📈',t:'NEDOCS — Ontario',s:'NEDOCS  ·  ED crowding  ·  Ontario  ·  OMC  ·  worksheet  ·  score  ·  excel  ·  sharepoint  ·  capacity',g:'Quick Link',gc:'t-algo',u:'links.html#link-nedocs-ontario'},
  {type:'link',i:'🩻',t:'Telerad',s:'telerad  ·  teleradiology  ·  remote read  ·  MITI  ·  IMIS  ·  radiology portal  ·  imaging',g:'Quick Link',gc:'t-algo',u:'links.html#link-telerad'},
  {type:'link',i:'💓',t:'MUSE — ECG Repository',s:'MUSE  ·  ECG  ·  EKG  ·  electrocardiogram  ·  prior tracings  ·  GE  ·  cardiology  ·  12-lead',g:'Quick Link',gc:'t-algo',u:'links.html#link-muse'},
  {type:'link',i:'🖼️',t:'PACS Radiology (iSite)',s:'PACS  ·  radiology  ·  iSite  ·  San Bernardino  ·  imaging viewer  ·  CT  ·  MRI  ·  X-ray  ·  ultrasound',g:'Quick Link',gc:'t-algo',u:'links.html#link-pacs'},
  {type:'link',i:'📞',t:'SCAL On-Call Directory',s:'SCAL  ·  on-call  ·  on call  ·  directory  ·  Southern California  ·  intelli-web  ·  consultant  ·  specialist',g:'Quick Link',gc:'t-algo',u:'links.html#link-scal-oncall'},
  {type:'link',i:'📟',t:'Vocera Web',s:'Vocera  ·  voice page  ·  web pager  ·  badge  ·  hands free  ·  call  ·  text  ·  Fontario',g:'Quick Link',gc:'t-algo',u:'links.html#link-vocera'},
  {type:'link',i:'🏥',t:'Fontario SharePoint',s:'Fontario  ·  SharePoint  ·  KP Fontana Ontario  ·  intranet  ·  collaboration hub',g:'Quick Link',gc:'t-algo',u:'links.html#link-fontario'},
  {type:'link',i:'🤖',t:'UpToDate Expert AI (in KPHC)',s:'UpToDate  ·  Expert AI  ·  KPHC  ·  HealthConnect  ·  clinical decision support  ·  gen AI  ·  generative AI  ·  evidence',g:'Quick Link',gc:'t-algo',u:'links.html#link-uptodate-ai'},
  {type:'link',i:'🔐',t:'KPHC Endpoints Login',s:'KPHC  ·  HealthConnect  ·  endpoints  ·  login  ·  KP credentials  ·  Epic',g:'Quick Link',gc:'t-algo',u:'links.html#link-kphc-endpoints'},
  {type:'link',i:'🚩',t:'Issue Reporting Form',s:'report  ·  on-call delay  ·  radiology delay  ·  staff behavior  ·  complaint  ·  concern  ·  incident  ·  feedback',g:'Quick Link',gc:'t-algo',u:'links.html#link-issue-form'},
  {type:'link',i:'🧾',t:'MDM Builder (Beta)',s:'MDM  ·  medical decision making  ·  documentation  ·  beta  ·  builder  ·  charting',g:'Quick Link',gc:'t-algo',u:'links.html#link-mdm-builder'},
  {type:'link',i:'⌨️',t:'Slash Editor (Beta)',s:'slash editor  ·  MDM  ·  inline  ·  command  ·  documentation  ·  beta',g:'Quick Link',gc:'t-algo',u:'links.html#link-mdm-slash'},

  // ── SITE PAGES ──────────────────────────────────────────────────────────
  {type:'page',i:'🤝',t:'Agreements & Protocols',s:'Kaiser  ·  SCPMG  ·  department agreements  ·  policies  ·  clinical protocols',g:'Reference',gc:'t-algo',u:'service-agreements.html'},
  {type:'page',i:'🔗',t:'External Links',s:'useful links  ·  references  ·  resources  ·  clinical tools  ·  external sites',g:'Reference',gc:'t-algo',u:'links.html'},
  {type:'page',i:'📑',t:'Site Index',s:'sitemap  ·  index  ·  table of contents  ·  TOC  ·  browse  ·  tree  ·  every page  ·  every card  ·  outline  ·  directory of contents  ·  index of everything',g:'Reference',gc:'t-algo',u:'sitemap.html'},
  {type:'page',i:'🗺️',t:'Roadmap',s:'upcoming features  ·  planned additions  ·  site roadmap',g:'Reference',gc:'t-algo',u:'roadmap.html'},
  {type:'page',i:'🆕',t:"What's New",s:'changelog  ·  site updates  ·  new features  ·  recent changes  ·  release notes',g:'Reference',gc:'t-algo',u:'changelog.html'},
  {type:'page',i:'🌀',t:'Vertigo Helper',s:'vertigo  ·  dizziness  ·  BPPV  ·  central vs peripheral  ·  HINTS exam  ·  nystagmus  ·  cerebellar stroke  ·  vestibular',g:'Reference',gc:'t-algo',u:'vertigo-helper.html'},
  {type:'page',i:'🚩',t:'Issue Reporting Form',s:'report  ·  on-call consultant delay  ·  critical radiology delay  ·  staff behavior  ·  complaint  ·  concern  ·  incident  ·  feedback',g:'Reference',gc:'t-algo',u:'https://forms.cloud.microsoft/r/Fbf0L0XCBK'},

  // ── KAISER COMMUNICATIONS (local PDFs / order sets / guidelines) ────────
  {type:'link',i:'🩸',t:'Kaiser Regional TSOA Bleeding Management Guideline (DOAC reversal)',s:'TSOA  ·  DOAC  ·  reversal  ·  bleeding management  ·  apixaban  ·  rivaroxaban  ·  dabigatran  ·  andexanet  ·  idarucizumab  ·  4-factor PCC  ·  Kaiser regional  ·  2022',g:'Kaiser Doc',gc:'t-algo',u:'assets/doac-bleeding-management.docx'},
  {type:'link',i:'🧠',t:'2022 ICH Guideline Update — ED Slides',s:'ICH  ·  intracerebral hemorrhage  ·  2022 guideline  ·  off-cycle changes  ·  neuro  ·  ED order set  ·  hypertonic saline  ·  blood pressure',g:'Kaiser Doc',gc:'t-algo',u:'assets/2024-05-29%20-%20Re%20KP%20FontanaOnt%20ED%20Fwd%20FW%20%20NOTICE%20OF%20OFF-CYCLE%20CHANGES%20to%20ICH-related%20NEURO%20and%20ED%20Order%20Sets%20and%20HYPERTONIC%20SALINE%20NEURO%20IP%20SCAL%20Order%20Set%20Effective%20Immediately%20-%202022%20ICH%20Guideline%20Update_ED_v5%20F.pptx'},
  {type:'link',i:'🧠',t:'Intracranial Hemorrhage ED SCAL Order Set (Hypertonic Saline)',s:'intracranial hemorrhage  ·  ICH  ·  ED SCAL  ·  order set  ·  hypertonic saline  ·  3% NaCl  ·  mannitol  ·  hyperosmolar therapy  ·  neuro  ·  2023-2024',g:'Kaiser Doc',gc:'t-algo',u:'assets/2024-05-29%20-%20KP%20FontanaOnt%20ED%20Fwd%20FW%20%20NOTICE%20OF%20OFF-CYCLE%20CHANGES%20to%20ICH-related%20NEURO%20and%20ED%20Order%20Sets%20and%20HYPERTONIC%20SALINE%20NEURO%20IP%20SCAL%20Order%20Set%20Effective%20Immediately%20-%202684_INTRACRANIAL_HEMORRHAGE_ED_SCAL.docx'},
  {type:'link',i:'🤰',t:'Preeclampsia/Eclampsia Diagnostic-Treatment Algorithm (CDPH-CMQCC)',s:'preeclampsia  ·  eclampsia  ·  HDP  ·  hypertension pregnancy  ·  diagnostic algorithm  ·  treatment algorithm  ·  CDPH  ·  CMQCC toolkit  ·  magnesium  ·  labetalol  ·  hydralazine  ·  2021',g:'Kaiser Doc',gc:'t-algo',u:'assets/preeclampsia-algo.pdf'},
  {type:'link',i:'🤰',t:'Preeclampsia / PIH ED SCAL Order Set',s:'preeclampsia  ·  PIH  ·  pregnancy induced hypertension  ·  ED SCAL  ·  order set  ·  net new  ·  2022  ·  magnesium  ·  severe range BP',g:'Kaiser Doc',gc:'t-algo',u:'assets/2022-04-05%20-%20KP%20FontanaOnt%20ED%20FW%20%20Regional%20review%20of%20Net%20New%20Order%20Set%20%20PREECLAMPSIA%20PIH%20ED%20SCAL%202%20Weeks%20Open%20Comment%20Period%20%20-%20PREECLAMPSIA_PIH_ED_SCAL_NET%20NEW%202-week%20comment%204-4-22.docx'},
  {type:'link',i:'🌡️',t:'Fever CA FIRST Protocol (Peds Fever) — 2021 Source',s:'CA FIRST  ·  pediatric fever  ·  febrile infant  ·  AAP 2021 CPG  ·  Roseville protocol  ·  Kaiser NorCal  ·  source slides  ·  see also pedsfever.html',g:'Kaiser Doc',gc:'t-algo',u:'assets/2022-05-26%20-%20KP%20FontanaOnt%20ED%20Fw%20Fever%20CA%20FIRST%20protocol%202021%20003%20002pptx%20-%20Fever%20CA%20FIRST%20protocol%202021%20%28003%29%20%28002%29.pptx'},
  {type:'link',i:'💉',t:'DKA Adult ED Two-Bag System Order Set (2021)',s:'DKA  ·  diabetic ketoacidosis  ·  two-bag system  ·  2-bag  ·  adult ED  ·  order set  ·  insulin  ·  D5  ·  saline  ·  KPHC inpatient key message  ·  2021',g:'Kaiser Doc',gc:'t-algo',u:'assets/2021-08-03%20-%20KP%20FontanaOnt%20ED%20Fw%20KPHC%20INPATIENT%20KEY%20MESSAGE%20EFFECTIVE%20IMMEDIATELY%20-%20Inpt-New-DKA-ADULT-TWO-BAG-SYSTEM-Order-Set-210637.pdf'},
  {type:'link',i:'🩸',t:'DVT Outpatient Anticoagulation Protocol (2019)',s:'DVT  ·  deep vein thrombosis  ·  outpatient anticoagulation  ·  protocol  ·  Kaiser  ·  2019 revision  ·  enoxaparin  ·  apixaban  ·  rivaroxaban',g:'Kaiser Doc',gc:'t-algo',u:'assets/dvt-outpatient-anticoagulation.pdf'},
  {type:'link',i:'💉',t:'Procedural Sedation Policy SC.QRM.PCS.020 (2017)',s:'procedural sedation  ·  moderate deep sedation  ·  non-anesthesiology  ·  policy  ·  SC.QRM.PCS.020  ·  SCAL  ·  2017  ·  PSA  ·  ketamine  ·  propofol',g:'Kaiser Doc',gc:'t-algo',u:'assets/procedural-sedation.pdf'},
  {type:'link',i:'🧠',t:'Code Stroke Order Set — Telehealth Consult Update (2020)',s:'code stroke  ·  telehealth consult  ·  order set update  ·  ED  ·  tele-stroke  ·  KPHC inpatient key message  ·  2020  ·  neurology consult',g:'Kaiser Doc',gc:'t-algo',u:'assets/2020-10-15%20-%20KP%20FontanaOnt%20ED%20Fwd%20KPHC%20INPATIENT%20ANESTHESIA%20AND%20OPTIME%20KEY%20MESSAGES%20EFFECTIVE%20OCTOBER%2021%20-%20Inpt-Update-to-Code-Stroke-Order-Set-Telehealth-Consult-Orders-ED-200937.pdf'},
  {type:'link',i:'📝',t:'Choose In Patient Guideline (2024)',s:'choose in  ·  patient guideline  ·  ED policy  ·  KP Fontana Ontario  ·  Choose In  ·  guidelines  ·  2024',g:'Kaiser Doc',gc:'t-algo',u:'assets/2024-11-08%20-%20KP%20FontanaOnt%20ED%20Choose%20in%20guidelines%20-%20Choose%20In%20Patient%20guideline.docx.pdf'},
  {type:'link',i:'📝',t:'Procedure Skip Policy (2025)',s:'procedure skip  ·  skip policy  ·  choose in  ·  ED full time physicians  ·  policy update  ·  2025  ·  KP Fontana Ontario',g:'Kaiser Doc',gc:'t-algo',u:'assets/2025-02-26%20-%20ED%20Full%20Time%20Physicians%20Updated%20skip%20and%20choose%20in%20policies%20please%20review%20and%20provide%20feedback%20asap%20-%20Procedure%20skip%20policy.docx.pdf'},

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
  const agreementId = String(agreement.id || '').trim();
  const href = agreementId
    ? `service-agreements.html?id=${encodeURIComponent(agreementId)}`
    : `service-agreements.html?q=${encodeURIComponent(title)}`;
  return kpNormalizeSearchItem({
    type: 'page',
    i: '📑',
    t: title,
    s: kpBuildAgreementSearchSubtitle(agreement),
    g: 'Service Agreements',
    gc: 't-algo',
    u: href,
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
    'Peds Fever',
    'Drugs',
    'OMC',
    'FMC',
    'External',
    'OMC Imaging Orders',
    'FMC Imaging Orders',
    'OMC Key Staff',
    'FMC Key Staff',
    'Service Agreements',
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
    if (/^https?:\/\/[^\s]+$/i.test(trimmed)) return trimmed;
    if (/^[A-Za-z0-9._/-]+\.html(?:\?[A-Za-z0-9._%=&:+-]+)?(?:#[A-Za-z0-9._:-]+)?$/.test(trimmed)) return trimmed;
    if (/^assets\/[A-Za-z0-9._%-]+\.[A-Za-z0-9]+$/.test(trimmed)) return trimmed;
    return 'index.html';
  };
  const resultHref = (item, query) => {
    const base = safeHref(item && item.u);
    const q = String(query || '').trim();
    if (base === 'service-agreements.html' && q) {
      return `service-agreements.html?q=${encodeURIComponent(q)}`;
    }
    return base;
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
        html += `<a class="kp-sr" id="${rowId}" role="option" aria-selected="false" href="${resultHref(item, query)}">
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
