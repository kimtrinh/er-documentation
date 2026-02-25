# Service Agreement Markdown Overrides

Use this file to provide practical, curated summaries for specific agreement IDs.
Each section must be:
- `## <agreement-id>`
- followed by one `json` code block with any of:
  - `summary_bullets`
  - `ed_actions`
  - `consults_and_escalation`
  - `disposition_or_ownership`
  - `timing_targets`

## urology-and-emergency-medicine-service-agreement-2019
```json
{
  "summary_bullets": [
    "Urgent/emergent urologic conditions requiring immediate Urology call include torsion, persistent priapism, penile fracture, unreducible paraphimosis, and refractory catheter/hematuria scenarios.",
    "Fournier's gangrene of the scrotum or penis requires immediate specialist escalation; if perirectal involvement is present or unclear, involve General Surgery.",
    "Infected or high-risk obstruction (obstructing stone with fever >38C, solitary-kidney obstruction, bilateral obstruction) is treated as time-sensitive and requires immediate Urology involvement.",
    "Hospital Medicine admission can proceed without overnight Urology call (7 PM-7 AM) for select non-fever obstructive pain/vomiting, controlled hematuria on CBI, or septic epididymo-orchitis without abscess/gangrene.",
    "Stable patients with larger stones, urinary retention after Foley, hydronephrosis, or renal/testicular masses are directed to outpatient Urology referral without ED Urology consult.",
    "Small uncomplicated stones, non-obstructive UTI/pyelo, balanitis/posthitis, uncomplicated epididymo-orchitis, benign cystic findings, and negative-ultrasound testicular pain follow PCP pathway.",
    "Acute urinary retention after Foley placement should include tamsulosin initiation and outpatient Urology planning when otherwise stable."
  ],
  "ed_actions": [
    "Call Urology immediately for torsion, persistent priapism, penile fracture, unreducible paraphimosis, infected obstruction, refractory hematuria, or difficult catheterization with acute retention.",
    "For Fournier's gangrene, call Urology immediately and add General Surgery if perirectal extension is present or uncertain.",
    "If hematuria persists despite CBI and repeated Foley irrigation, treat as urgent and escalate to Urology.",
    "For stable urinary retention after Foley placement, start tamsulosin and arrange outpatient Urology referral.",
    "Document pathway category (urgent call, admit/no overnight call, outpatient referral, or PCP follow-up) in the ED note."
  ],
  "consults_and_escalation": [
    "Immediate consult pathway: Urology for all urgent/emergent categories.",
    "Cross-service escalation: Add General Surgery for suspected Fournier's with perirectal involvement or unclear anatomic extension.",
    "No overnight Urology call window for specified admit category: 7 PM-7 AM.",
    "Escalate atypical high-risk presentations that do not cleanly fit categories via attending-to-attending discussion."
  ],
  "disposition_or_ownership": [
    "Admit to Hospital Medicine (without overnight Urology call, 7 PM-7 AM) for non-fever obstructive pain/vomiting, controlled gross hematuria on CBI, or septic epididymo-orchitis without abscess/gangrene.",
    "Outpatient Urology referral (no ED consult) for stable obstruction >3 mm without fever, asymptomatic hydronephrosis, renal stone >=10 mm, post-Foley retention, asymptomatic renal mass/complex cyst, or testicular mass.",
    "PCP follow-up (no Urology referral) for obstruction <=3 mm without fever, non-obstructive UTI/pyelo, balanitis/posthitis, uncomplicated epididymo-orchitis, renal stone <10 mm without obstruction, benign hydrocele/epididymal cyst, negative-ultrasound testicular pain, or microlithiasis."
  ],
  "timing_targets": [
    "Timing expectation: Immediate Urology contact for urgent/emergent conditions.",
    "Timing expectation: No overnight Urology call required from 7 PM-7 AM for defined Hospital Medicine admit scenarios."
  ]
}
```

## urology-and-emergency-medicine-service-agreement
```json
{
  "summary_bullets": [
    "Use a tiered ED workflow: urgent Urology call, Hospital Medicine admission without overnight call, outpatient Urology referral, or PCP follow-up based on risk and stability.",
    "Urgent/emergent triggers include torsion, persistent priapism, penile fracture, unreducible paraphimosis, Fournier's gangrene, infected/high-risk obstruction, refractory hematuria, difficult catheterization with acute retention, and post-op complications.",
    "If Fournier's has possible perirectal extension or anatomy is unclear, include General Surgery with Urology.",
    "Selected non-fever obstructive pain/vomiting, controlled hematuria on CBI, and septic epididymo-orchitis without abscess/gangrene can be admitted to Hospital Medicine without overnight Urology call.",
    "Stable patients with larger stones or non-emergent GU findings should be routed to outpatient Urology or PCP follow-up according to pathway criteria.",
    "For retention after Foley placement, initiate tamsulosin and arrange appropriate outpatient follow-up."
  ],
  "ed_actions": [
    "Call Urology immediately for all urgent/emergent categories and document the specific trigger.",
    "If concern for Fournier's extends to perirectal tissues, call General Surgery in parallel.",
    "Escalate persistent gross hematuria despite CBI and repeated Foley irrigation as urgent.",
    "For stable retention after Foley placement, start tamsulosin and route to outpatient Urology."
  ],
  "consults_and_escalation": [
    "Primary urgent consult: Urology.",
    "Cross-service consult: General Surgery when Fournier's anatomy extends beyond urologic boundaries.",
    "Use attending-level escalation when classification is uncertain or condition is worsening."
  ],
  "disposition_or_ownership": [
    "Hospital Medicine admit without overnight Urology call (7 PM-7 AM) for defined intermediate-risk scenarios.",
    "Outpatient Urology referral for stable stone/mass/retention categories not requiring emergent intervention.",
    "PCP follow-up for uncomplicated low-risk findings without obstruction, fever, or instability."
  ],
  "timing_targets": [
    "Timing expectation: Immediate Urology involvement for urgent/emergent presentations."
  ]
}
```
