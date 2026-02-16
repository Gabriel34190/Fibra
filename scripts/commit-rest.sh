#!/bin/bash
set -e
cd "$(dirname "$0")/.."

echo "=== 7 AlgorithmViewer + CodingExplorer ==="
git add src/components/AlgorithmViewer.jsx src/components/FibonacciCodingExplorer.jsx
git diff --cached --quiet && echo "(no changes)" || git commit -m "chore: minor updates AlgorithmViewer, FibonacciCodingExplorer"

echo "=== 8 Build config ==="
git add package.json package-lock.json vite.config.js
git diff --cached --quiet && echo "(no changes)" || git commit -m "chore: package and vite config"

echo "=== 9 Dist ==="
git add dist/
git diff --cached --quiet && echo "(no changes)" || git commit -m "chore: build dist"

git log --oneline -10
