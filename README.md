# ER Documentation Toolkit

Static HTML tools for emergency medicine documentation and quick bedside calculations.

## Pages

- `index.html`: searchable ER dotphrases by category
- `calculators.html`: Wells PE/PERC, Wells DVT, Canadian CT Head Rule
- `vasopressors.html`: vasopressor/inotrope infusion and push-dose guidance
- `rsi.html`: RSI medication and drip dosing helper

## Run Locally

No build step is required. Open any page directly in a browser, or serve the directory:

```bash
cd /Users/kimtrinh/Projects/er-documentation
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000/index.html`

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
