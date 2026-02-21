# ER Documentation Toolkit

Static HTML tools for emergency medicine documentation and quick bedside calculations.

## Pages

- `home.html`: unified landing page with cross-tool search
- `index.html`: searchable ER dotphrases by category
- `calculators.html`: clinical decision calculators and chart-ready text
- `vasopressors.html`: vasopressor/inotrope infusion and push-dose guidance
- `rsi.html`: RSI medication and drip dosing helper
- `algorithms.html`: KP SBC ED practice-guideline algorithms
- `neurohub.html`: neuro protocols and ICH/tPA reference
- `pedsfever.html`: pediatric fever protocol guidance
- `ed-phone-directory.html`: OMC/FMC directory with local custom entries
- `agreements.html`: service agreement templates and tracking
- `links.html`: curated external references
- `roadmap.html`: feature roadmap and suggestions

## Run Locally

No build step is required. Open any page directly in a browser, or serve the directory:

```bash
cd /Users/kimtrinh/Projects/er-documentation
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000/home.html`

## GitHub Pages

This repo is ready for GitHub Pages as a static site.

1. Push the repository to GitHub.
2. In GitHub: `Settings` -> `Pages`.
3. Set source to `Deploy from a branch`.
4. Choose your branch (for example `main`) and folder `/ (root)`.

Your site will be served from:

- `https://<your-username>.github.io/er-documentation/`

## Clinical Safety

These tools are decision-support and documentation aids only. They do not replace clinician judgment, local protocols, pharmacy verification, or specialist consultation.

## Maintenance Checks

Run the smoke-check script before publishing:

```bash
node scripts/smoke-check.js
```

It validates:
- JavaScript syntax in `search-index.js`
- Inline script syntax across all `.html` files
- `search-index.js` URL targets and hash anchors
