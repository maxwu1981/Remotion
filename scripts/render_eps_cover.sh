#!/bin/bash
# 算繪 Claude Code 新手地圖 EP13–EP30「封面開場版」到 with-cover/(不覆蓋舊檔)。
# 已存在跳過(可續跑);先渲到 .tmp 再 mv,半成品不算完成。--crf=10 抗 h264 閃爍。
cd /Users/maxwu/Remotion || exit 1
OUTDIR=out/youtube-videos/claude-code-map/with-cover
mkdir -p "$OUTDIR"
LOG=$OUTDIR/render.log
echo "=== cover-render start $(date '+%F %T') ===" >> "$LOG"
for n in 00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18; do
  ID=ClaudeCodeMapEP$n
  OUT=$OUTDIR/ep$n.mp4
  if [ -f "$OUT" ]; then
    echo "$(date '+%T') skip ep$n (exists)" >> "$LOG"
    continue
  fi
  echo "$(date '+%T') >>> ep$n render start" >> "$LOG"
  if npx remotion render "$ID" "$OUTDIR/ep$n.tmp.mp4" --crf=10 --log=error >> "$LOG" 2>&1; then
    mv "$OUTDIR/ep$n.tmp.mp4" "$OUT"
    dur=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$OUT" 2>/dev/null)
    echo "$(date '+%T') <<< ep$n DONE dur=${dur}s" >> "$LOG"
  else
    echo "$(date '+%T') !!! ep$n FAILED" >> "$LOG"
  fi
done
echo "=== cover-render ALL DONE $(date '+%F %T') ===" >> "$LOG"
