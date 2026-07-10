#!/bin/bash
# 連續算繪 Claude Code 新手地圖 EP04–EP30(+縮圖)到 out/。
# 已存在的 .mp4 跳過(可續跑);先渲到 .tmp 再 mv,半成品不會被當成完成。
cd /Users/maxwu/Remotion || exit 1
LOG=/Users/maxwu/Remotion/out/render_eps.log
echo "=== batch start $(date '+%F %T') ===" >> "$LOG"
for n in 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30; do
  ID=ClaudeCodeMapEP$n
  OUT=out/ep$n.mp4
  if [ -f "$OUT" ]; then
    echo "$(date '+%T') skip ep$n (exists)" >> "$LOG"
    continue
  fi
  echo "$(date '+%T') >>> ep$n render start" >> "$LOG"
  npx remotion still "${ID}Thumb" "out/ep$n-thumb.png" --log=error >> "$LOG" 2>&1
  if npx remotion render "$ID" "out/ep$n.tmp.mp4" --crf=10 --log=error >> "$LOG" 2>&1; then
    mv "out/ep$n.tmp.mp4" "$OUT"
    dur=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$OUT" 2>/dev/null)
    echo "$(date '+%T') <<< ep$n DONE dur=${dur}s" >> "$LOG"
  else
    echo "$(date '+%T') !!! ep$n FAILED" >> "$LOG"
  fi
done
echo "=== batch ALL DONE $(date '+%F %T') ===" >> "$LOG"
