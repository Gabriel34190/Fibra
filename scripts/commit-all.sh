#!/bin/bash
# À lancer depuis la racine du projet : bash scripts/commit-all.sh
# (Cursor ajoute --trailer à git commit, ce qui fait échouer sur les vieilles versions de git)

set -e
cd "$(dirname "$0")/.."

echo "=== 1/6 SequenceViewer ==="
git add src/components/SequenceViewer.jsx
git commit -m "fix(SequenceViewer): fix JSX grid + add term properties panel (Zeckendorf, ratio)"

echo "=== 2/6 Spiral2D ==="
git add src/components/Spiral2D.jsx
git commit -m "feat(Spiral2D): add progressive animation mode (step slider + play/pause)"

echo "=== 3/6 FibonacciClock ==="
git add src/components/FibonacciClock.jsx
git commit -m "feat(FibonacciClock): add simulation mode (manual time)"

echo "=== 4/6 FibonacciTrader ==="
git add src/components/FibonacciTrader.jsx
git commit -m "fix(FibonacciTrader): pause stops simulation + fix green points dedup"

echo "=== 5/6 App ==="
git add src/App.jsx
git commit -m "chore(App): rename tab Compression to Codage"

echo "=== 6/6 MusicGenerator ==="
git add src/components/MusicGenerator.jsx
git commit -m "docs(MusicGenerator): clarify WAV export + MP3 conversion note"

echo "=== 7/9 AlgorithmViewer + CodingExplorer (déjà présents, changements mineurs) ==="
git add src/components/AlgorithmViewer.jsx src/components/FibonacciCodingExplorer.jsx 2>/dev/null || true
git diff --cached --quiet || git commit -m "chore: minor updates AlgorithmViewer, FibonacciCodingExplorer"

echo "=== 8/9 Build config ==="
git add package.json package-lock.json vite.config.js 2>/dev/null || true
git diff --cached --quiet || git commit -m "chore: package and vite config"

echo "=== 9/9 Dist (build output) ==="
git add dist/ 2>/dev/null || true
git diff --cached --quiet || git commit -m "chore: build dist" || true

echo "=== Done ==="
git log --oneline -12
git status
