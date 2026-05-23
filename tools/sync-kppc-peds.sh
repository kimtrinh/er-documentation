#!/bin/bash
# Sync the 13 KPPC peds PDFs from Google Drive Desktop into the repo.
#
# Run AFTER Drive Desktop has finished syncing the "KPPC peds" folder
# locally. The Drive folder lives in:
#   ~/Library/CloudStorage/GoogleDrive-kltrinh@gmail.com/My Drive/KPPC peds/
#   (or wherever else Drive places it — the script searches for it.)
#
# Each source filename in Drive is mapped to a stable kebab-case slug
# inside assets/peds-kppc/ so the algorithm cards keep working.
#
# Usage:  bash tools/sync-kppc-peds.sh

set -e

# Find the KPPC peds folder anywhere under Drive sync.
DRIVE_BASE="$HOME/Library/CloudStorage/GoogleDrive-kltrinh@gmail.com"
SRC="$(find "$DRIVE_BASE" -maxdepth 5 -type d -iname 'KPPC peds' 2>/dev/null | head -1)"
if [ -z "$SRC" ]; then
  echo "❌ Couldn't find the 'KPPC peds' folder under $DRIVE_BASE."
  echo "   Open Google Drive Desktop and make sure the folder has finished syncing."
  exit 1
fi
echo "📂 Source: $SRC"

DST="$(cd "$(dirname "$0")/.." && pwd)/assets/peds-kppc"
mkdir -p "$DST"
echo "📂 Destination: $DST"
echo

# source filename | target kebab-case slug
declare -a MAP=(
  "Pediatric_Abdominal_Pain_Appendicitis_SLA.pdf|peds-appendicitis-sla.pdf"
  "2025 peds gold card.pdf|peds-gold-card-2025.pdf"
  "CA-FIRST Tool Short (1).pdf|peds-febrile-infant-ca-first.pdf"
  "SVT Stablization Pathway 2024.pdf|peds-svt-pathway.pdf"
  "Peds Sz Guidelines word 2024.pdf|peds-seizure-guideline.pdf"
  "HYPOGLYCEMIA2024.pdf|peds-hypoglycemia.pdf"
  "DKA Oupt Pathway2024.pdf|peds-dka-outpatient.pdf"
  "Acute Stabilization Croup Outpatient Pathway2024 update.pdf|peds-croup-pathway.pdf"
  "Acute Stabilization Pediatric Acute Gastroenteritis Dehydration Pathway 2024.pdf|peds-gastro-dehydration.pdf"
  "Bronchiolitis Outpt Pathway 2024.pdf|peds-bronchiolitis-pathway.pdf"
  "ASTHMA OUTPT PATHWAY 2024.pdf|peds-asthma-outpatient.pdf"
  "ED - Peds Stroke Flow 2023.pdf|peds-stroke-flow.pdf"
  "PCWD ED Pathways - Updated 07.23.2024.pdf|peds-ed-pathways-master.pdf"
)

COPIED=0
MISSING=()
for pair in "${MAP[@]}"; do
  src_name="${pair%%|*}"
  dst_name="${pair##*|}"
  if [ -f "$SRC/$src_name" ]; then
    cp -p "$SRC/$src_name" "$DST/$dst_name"
    echo "  ✓ $dst_name"
    COPIED=$((COPIED+1))
  else
    MISSING+=("$src_name")
  fi
done

echo
echo "✅ Copied $COPIED of ${#MAP[@]} PDFs."
if [ "${#MISSING[@]}" -gt 0 ]; then
  echo "⚠️  Not found (Drive may still be syncing):"
  for m in "${MISSING[@]}"; do echo "    $m"; done
fi
echo
echo "→ Re-run this script after Drive finishes syncing if any are still missing."
