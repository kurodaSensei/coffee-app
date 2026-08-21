#!/usr/bin/env bash
# Regenera public/og-image.png a partir de public/og-image.svg usando
# Chrome headless. Necesario porque rsvg-convert e ImageMagick no cargan
# webfonts remotas (DM Serif Display, JetBrains Mono), y el diseño del
# OG depende de esas tipografías.
#
# Uso:
#   ./scripts/render-og-image.sh
#
# Requiere Google Chrome instalado en /Applications/Google Chrome.app
# (macOS). En Linux ajustar la ruta del binario.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SVG="$ROOT/public/og-image.svg"
OUT="$ROOT/public/og-image.png"
TMP_HTML="$(mktemp -t og-render.XXXXX.html)"

if [[ ! -f "$SVG" ]]; then
  echo "❌ No se encontró $SVG"
  exit 1
fi

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [[ ! -x "$CHROME" ]]; then
  echo "❌ Google Chrome no está en $CHROME. Ajusta CHROME en este script."
  exit 1
fi

# HTML wrapper que carga DM Serif Display + JetBrains Mono desde Google
# Fonts y embebe el SVG inline.
{
  cat <<'HEAD'
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; }
  html, body { background: #141712; }
  body { display: flex; align-items: center; justify-content: center; }
  svg { display: block; }
</style>
</head>
<body>
HEAD
  cat "$SVG"
  echo "</body></html>"
} > "$TMP_HTML"

"$CHROME" \
  --headless=new \
  --hide-scrollbars \
  --no-sandbox \
  --disable-gpu \
  --window-size=1200,630 \
  --screenshot="$OUT" \
  --virtual-time-budget=4000 \
  "file://$TMP_HTML" 2>&1 | grep -E "written|ERROR" || true

rm -f "$TMP_HTML"

if [[ -f "$OUT" ]]; then
  echo "✅ Regenerado: $OUT"
  file "$OUT"
else
  echo "❌ Fallo al generar $OUT"
  exit 1
fi
