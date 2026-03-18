# MDM Builder Analysis
### Medico-Legal, Clinical Completeness & Usability Review

---

## Executive Summary

The MDM Builder is a well-architected documentation supplement tool that does exactly what it claims: it helps ER physicians think through alternative diagnoses, document life-threat rule-outs, and capture risk stratification — all with minimal friction. The architecture is sound, the chief complaint packs are clinically thoughtful, and the embedded calculators are well-chosen.

This analysis covers three domains: **medico-legal defensibility**, **clinical completeness**, and **usability for the physician at the bedside**. The goal is to make a good tool better, not to redesign it.

---

## I. What's Working Well

**Conceptual framework is excellent.** The DDx → Rule-out → Risk Tool pipeline mirrors how plaintiff attorneys deconstruct charts. Documenting "I considered X and here's why it's not X" is the single most powerful medicolegal defense pattern, and this tool bakes it into the workflow.

**Life-threatening diagnoses are front-loaded.** The GROUP_ORDER of Life-threatening → Common → Other with default-checked life threats is the right call. It forces documentation of the high-acuity DDx even when the diagnosis seems obvious.

**Calculators are inline, not external.** Having HEART, Wells, PERC, YEARS, etc. built into the same workflow as the MDM text removes friction and makes it more likely they'll actually get documented.

**Quality checks are a smart guardrail.** The real-time warnings for "no life-threatening DDx selected" or "risk tools not documented" are exactly the kind of nudge that prevents gaps.

**State persistence via localStorage.** Preserving selections across sessions means physicians can build templates for their common patterns without starting from scratch.

---

## II. Medico-Legal Recommendations

### A. The Output Text Needs Stronger "Why Not" Language

**Current pattern:** Rule-outs produce phrases like:
- "CT head reviewed without acute intracranial abnormality."
- "ECG reviewed without acute ischemic changes."

**Problem:** These document *what was done* and *what was found*, but not *why the diagnosis was excluded*. The strongest defensible MDM connects the finding to the reasoning.

**Suggested enhancement:** Add a `reasoning_template` field to each rule-out that ties the objective finding to the clinical exclusion. For example:
- *Current:* "ECG reviewed without acute ischemic changes."
- *Better:* "ECG reviewed without acute ischemic changes. In the context of atypical presentation and low-risk HEART score, ACS is less likely."

This doesn't need to be long — even one additional clause connecting the data point to the clinical conclusion dramatically strengthens the note.

### B. Document the Disposition Decision Link

**Gap:** The MDM text currently ends with risk stratification but doesn't explicitly connect the assessment to disposition. Plaintiff attorneys frequently argue "the doctor knew X was possible but still discharged the patient."

**Suggestion:** Add an optional "Disposition Rationale" sentence at the end of the MDM output, e.g.:
- "Given low-risk stratification by [tool], reassuring serial assessments, and absence of high-risk features, discharge with close follow-up is appropriate."
- "Admission warranted given [high-risk score / clinical trajectory / incomplete workup]."

This could be a simple toggle or auto-generated based on whether calculator scores fell in low/moderate/high ranges.

### C. Time-Stamp Serial Assessments

**Gap:** Several risk toggles reference "serial reassessment" (e.g., "Serial reassessments remained stable") but don't capture temporal information.

**Suggestion:** For toggles that reference serial assessments, add an optional time field (e.g., "reassessed at __ hours") so the output reads: "Serial reassessments at 2h and 4h remained stable without recurrent syncope." This documents the time investment, which is powerful in litigation.

### D. Shared Decision-Making in the MDM (Not Just Discharge)

**Current:** Shared decision-making language exists only in the Discharge Builder.

**Gap:** For moderate-risk dispositions (HEART 4-6, intermediate Wells, etc.), documenting shared decision-making *within the MDM itself* is protective. Consider adding an optional SDM toggle to the risk section that generates: "Risks, benefits, and alternatives of [admission vs. discharge / imaging vs. observation] discussed with patient. Patient verbalizes understanding and agrees with plan."

---

## III. Clinical Completeness Recommendations

### A. Missing Chief Complaint Packs

The current 10 packs cover the highest-volume medicolegally dangerous presentations. Consider adding:

1. **Allergic Reaction / Anaphylaxis** — Life-threats: anaphylaxis, angioedema with airway compromise. Risk tools: biphasic reaction risk. This is a high-litigation complaint.

2. **Pediatric Fever** — Different DDx than adult (occult bacteremia, meningitis, UTI in <2yo, Kawasaki). You already have a pedsfever.html page — linking a pack here would be natural.

3. **Testicular Pain** — Testicular torsion is one of the top missed diagnoses in EM malpractice. A simple pack with torsion (life-threat to the organ), epididymitis, hernia would be high-value.

4. **Vaginal Bleeding (Non-Pregnant)** — Different DDx than pregnant VB. Could be its own pack or a variant.

5. **Skin/Soft Tissue Infection** — Necrotizing fasciitis is the life-threat to exclude. High litigation risk when missed.

### B. Specific Pack Improvements

**Chest Pain Pack:**
- Consider adding "Esophageal perforation" as Life-threatening rather than Other — Boerhaave's is genuinely life-threatening and medicolegally significant.
- Consider a risk toggle for "Mediastinal widening assessment on CXR" for dissection documentation.

**Headache/Neuro Pack:**
- This pack is currently overloaded (headache + TIA + syncope + trauma + AFib all in one). The aliases suggest it's meant to be a catch-all, but in practice the DDx is too broad. Consider splitting TIA, syncope, and trauma into their own packs (syncope already exists as a separate pack — clean up the alias overlap).
- Add "Idiopathic intracranial hypertension" as an Other DDx for completeness.
- Add a risk toggle for "fundoscopic exam" when considering elevated ICP.

**Abdominal Pain Pack:**
- Add "Ectopic pregnancy" as a Life-threatening DDx with a pregnancy test risk toggle. Every female of reproductive age with abdominal pain needs this documented.
- Add "Renal colic / ureterolithiasis" as Common — it's a frequent abdominal pain DDx and the life-threat (infected stone / pyonephrosis) should be addressed.

**Low Back Pain Pack:**
- Consider adding "Retroperitoneal hemorrhage" (especially in anticoagulated patients) as a life-threatening DDx.
- Add a risk toggle for "anticoagulation status reviewed" since this changes the management threshold significantly.

**Altered Mental Status Pack:**
- Add "Wernicke's encephalopathy" as a Life-threatening DDx. Failure to give thiamine before glucose in malnourished patients is a known litigation risk.
- Add "Non-convulsive status epilepticus" — increasingly recognized and medicolegally relevant.

### C. Calculator Gaps

- **Ottawa Ankle/Foot Rules** — Not currently included. For any future MSK/extremity pack, these would be essential.
- **SIRS Criteria** — While qSOFA is included, many institutions still use SIRS criteria for sepsis screening. Consider adding as an alternative option.
- **HAS-BLED** — Natural companion to CHA2DS2-VASc for anticoagulation discussions.
- **NIHSS** — If you add a dedicated stroke/TIA pack, an abbreviated NIHSS would be powerful for documentation.

---

## IV. Usability Recommendations for Bedside Use

### A. Reduce Click Count for the 80% Case

**Current flow:** Select pack → check DDx (some pre-checked) → scroll down to rule-outs → scroll down to risk tools → fill calculator → scroll to preview → copy.

**Problem:** In a busy ED, this is too many interactions. The physician is likely charting 10-20 patients per shift.

**Suggestions:**

1. **"One-Click Defaults" button** — A single button that selects all default-checked DDx, auto-selects all linked rule-outs, and pre-checks all risk toggles that don't require calculator input. Label it something like "Load Standard Template" or "Quick Start." This gets the physician 80% of the way with one click, then they customize.

2. **Auto-expand the MDM Builder panel on pack selection.** Currently it's inside a `<details>` accordion that starts closed. When a physician selects a pack, the MDM Builder panel should auto-open and scroll into view.

3. **Collapse completed sections.** Once DDx are selected and rule-outs populated, allow collapsing those sections so the physician can focus on the risk tools without scrolling past 15 checkboxes they've already set.

### B. Mobile Usability Is Critical

**Observation:** The CSS has responsive breakpoints at 980px and 640px, and you have a separate `mobile.css` file. However, the core interaction pattern (two-column grid with checkboxes + preview side by side) collapses to single-column on mobile, which means the preview is now far below the checkboxes.

**Suggestion:** On mobile, consider a **floating "Copy MDM" button** fixed to the bottom of the screen. The physician fills checkboxes, and when ready, taps the persistent copy button without scrolling to find it. The sticky toolbar helps but may scroll out of view on very long pack configurations.

### C. Preview Should Be Editable (and It Is — Highlight This)

The preview textarea is already editable (`<textarea>`), which is great — physicians can tweak the output before copying. But the UI doesn't make this obvious. Consider:
- Adding a subtle label like "Edit before copying" above the preview.
- A different background color or border style when the user has manually edited the preview (to signal "you've customized this").

### D. Quick Command UX

**The quick command input is powerful but hidden.** The placeholder text says "Type mdmccp, mdmsob, mdmabd..." but a physician won't memorize these aliases.

**Suggestions:**
1. Show the command aliases **on the pack chip buttons** as a tooltip or subtitle (e.g., the "Chest Pain" chip could show "mdmccp" in smaller text below).
2. Consider making the quick command input an **autocomplete/fuzzy search** that matches on both the pack title and aliases. Typing "chest" should surface "Chest Pain (mdmccp)."

### E. Visual Hierarchy of Risk Results

**Current:** Calculator results are shown in a small colored box with text like "HEART 3/10 (low risk)."

**Suggestion:** Make the risk result more visually prominent:
- Low risk: green background with a checkmark icon
- Moderate risk: yellow/amber with a caution icon
- High risk: red with an alert icon

This gives the physician immediate visual feedback without reading the text, which matters when they're scanning quickly.

### F. Copy Feedback

**Current:** The copy button briefly shows a "copied" state with a green highlight.

**Suggestion:** Also show a brief **toast notification** with the word count or a snippet of what was copied. This reassures the physician that the right content went to the clipboard, especially when copying subsections (DDx only, rule-outs only).

---

## V. Architecture & Data Model Notes

### Strengths
- Clean separation of pack definitions (JSON) from rendering logic (JS) allows easy addition of new packs without touching the UI code.
- The tag-based system for linking DDx → risk toggles is elegant and extensible.
- State management with per-pack saved selections is well-designed.
- The dotphrase integration with linked rule-outs is clever — it bridges the gap between the MDM builder and existing dotphrase workflows.

### Opportunities
- **Pack versioning:** Consider adding a version field to `mdm_packs.json` so you can track which version of a pack generated a given MDM. If scoring criteria change (e.g., HEART score interpretation thresholds are updated), you want to know which version was in use.
- **Custom DDx entry:** Allow physicians to add a free-text DDx item to any pack. Not every presentation fits neatly into pre-defined categories, and a physician who adds "considered X but excluded because Y" in their own words is even more defensible.
- **Export/Import packs:** If this tool is adopted by a group, different attendings may want different default configurations. Allow exporting/importing pack configurations.

---

## VI. Priority Ranking

If I were implementing changes, here's the order I'd tackle them:

| Priority | Recommendation | Impact | Effort |
|----------|---------------|--------|--------|
| 1 | Add disposition rationale toggle | High medico-legal | Low |
| 2 | One-click defaults / quick-start button | High usability | Low |
| 3 | Strengthen rule-out language with reasoning | High medico-legal | Medium |
| 4 | Add ectopic pregnancy DDx to abdominal pain | High clinical safety | Low |
| 5 | Fix headache/neuro pack alias overlap with syncope pack | Medium usability | Low |
| 6 | Floating copy button on mobile | Medium usability | Low |
| 7 | Shared decision-making toggle in MDM | Medium medico-legal | Low |
| 8 | Add missing packs (anaphylaxis, nec fasc, torsion) | Medium clinical | Medium |
| 9 | Custom free-text DDx entry | Medium medico-legal | Medium |
| 10 | Autocomplete on quick command input | Low-medium usability | Medium |

---

*Analysis prepared as a supplement review. All clinical and medico-legal suggestions should be vetted against your institution's specific documentation standards, EMR integration requirements, and risk management guidance.*
