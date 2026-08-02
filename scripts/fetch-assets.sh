#!/bin/bash
# 新機器 clone 完 repo 後跑這支，把 assets-manifest.json 記錄的 public/ 素材
# 從 Google Drive 桌面同步夾複製回對應位置（這些資料夾故意不進 git，見
# .gitignore 註解與 Repo 可攜性計畫 Phase E）。
#
# 前置需求：
#   - Google Drive 桌面版已安裝、已登入 finalaaaa@gmail.com、資料夾已同步完成
#   - jq（沒有的話 `brew install jq`）
#
# 用法： ./scripts/fetch-assets.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANIFEST="$REPO_ROOT/assets-manifest.json"
DRIVE_ROOT="/Users/maxwu/Library/CloudStorage/GoogleDrive-finalaaaa@gmail.com/我的雲端硬碟/Remotion-Assets-Archive"

command -v jq >/dev/null || { echo "錯誤：需要 jq，先 brew install jq"; exit 1; }
[ -f "$MANIFEST" ] || { echo "錯誤：找不到 $MANIFEST"; exit 1; }
[ -d "$DRIVE_ROOT" ] || {
  echo "錯誤：找不到 Google Drive 同步資料夾：$DRIVE_ROOT"
  echo "確認 Google Drive 桌面版已安裝、已用 finalaaaa@gmail.com 登入、且完成初次同步"
  exit 1
}

TOTAL=$(jq '.fileCount' "$MANIFEST")
echo "準備從 Google Drive 複製 $TOTAL 個檔案回 $REPO_ROOT ..."

COUNT=0
MISSING=0
while IFS= read -r rel; do
  SRC="$DRIVE_ROOT/$rel"
  DST="$REPO_ROOT/$rel"
  if [ ! -f "$SRC" ]; then
    echo "⚠️  Drive 裡找不到：$rel（可能還沒同步完，或之後路徑改了）"
    MISSING=$((MISSING + 1))
    continue
  fi
  mkdir -p "$(dirname "$DST")"
  cp "$SRC" "$DST"
  COUNT=$((COUNT + 1))
  if [ $((COUNT % 500)) -eq 0 ]; then
    echo "已複製 $COUNT / $TOTAL ..."
  fi
done < <(jq -r '.files[].repoPath' "$MANIFEST")

echo "複製完成：$COUNT 個檔案，$MISSING 個缺漏。"
echo ""
echo "抽樣核對 20 筆 checksum（平均分布在各資料夾）..."
OK=0
BAD=0
while IFS=$'\t' read -r rel expected; do
  actual="$(shasum -a 256 "$REPO_ROOT/$rel" 2>/dev/null | awk '{print $1}')"
  if [ "$actual" == "$expected" ]; then
    OK=$((OK + 1))
  else
    BAD=$((BAD + 1))
    echo "❌ $rel checksum 不符（期望 $expected，實際 ${actual:-檔案不存在}）"
  fi
done < <(jq -r '
  . as $root
  | ($root.files | length) as $len
  | ([$len / 20 | floor, 1] | max) as $step
  | [range(0; $len; $step)][0:20]
  | .[] as $i | $root.files[$i] | "\(.repoPath)\t\(.sha256)"
' "$MANIFEST")

echo "抽樣結果：$OK 通過，$BAD 不符。"
[ "$MISSING" -eq 0 ] && [ "$BAD" -eq 0 ] && echo "✅ 全部正常" || echo "⚠️  有缺漏或不符，往上翻看細節"
