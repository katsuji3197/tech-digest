#!/usr/bin/env bash
# Build static site: posts/*.md + public/ + assets/ -> dist/ (Vercel outputDirectory); also writes deploy/urls.txt for post-deploy checks.
set -euo pipefail
cd "$(dirname "$0")"
[ -d node_modules/marked ] && [ -d node_modules/sharp ] || npm install --no-audit --no-fund
node scripts/build.mjs
