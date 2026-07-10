#!/bin/bash
# Render the 帳號授權安全 master to mp4. Renders to a .tmp first, then atomically
# moves it into place, so a killed/half-written file is never mistaken for done.
set -o pipefail
cd /Users/maxwu/Remotion || exit 1

OUTDIR="out/youtube-videos/帳號授權安全"
OUT="$OUTDIR/account-auth-security.mp4"
TMP="$OUTDIR/.aas.tmp.mp4"
mkdir -p "$OUTDIR"

echo "=== render start $(date) ==="
if NODE_OPTIONS='--max-old-space-size=8192' npx remotion render AccountAuthSecurity "$TMP" --crf=14 --log=info; then
  mv -f "$TMP" "$OUT"
  echo "=== RENDER_DONE $(date) -> $OUT ==="
else
  echo "=== RENDER_FAIL $(date) ==="
fi
