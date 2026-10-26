#!/usr/bin/env bash
# Build static site: posts/*.md + public/ + assets/ -> dist/ ; writes deploy/manifest.json for the Vercel MCP.
set -euo pipefail
cd "$(dirname "$0")"
[ -d node_modules/marked ] || npm install --no-audit --no-fund
node scripts/build.mjs
