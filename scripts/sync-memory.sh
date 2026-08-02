#!/bin/bash
# Claude Code 記憶系統雙向同步。
#   pull  真實記憶路徑 → 私有內容庫的 .claude-memory-backup/（備份現況，並 commit+push）
#   push  私有內容庫的 .claude-memory-backup/ → 真實記憶路徑（新機器初始化用）
#
# 記憶資料夾名稱把「絕對路徑」編碼進去（/ 換成 -），所以換一台機器、
# 甚至同機器換路徑，資料夾名稱都會不一樣——這支腳本用 git repo 的實際
# 路徑動態算出來，不要手動寫死。若在某個 worktree（.claude/worktrees/<name>）
# 底下執行，會自動折回主 repo 路徑，因為 Claude Code 的記憶是綁主 repo
# 路徑，不是綁 worktree 路徑。

set -euo pipefail

RAW_ROOT="$(git rev-parse --show-toplevel)"
if [[ "$RAW_ROOT" == *"/.claude/worktrees/"* ]]; then
  REPO_ROOT="${RAW_ROOT%%/.claude/worktrees/*}"
else
  REPO_ROOT="$RAW_ROOT"
fi

MEMORY_DIR_NAME="$(echo "$REPO_ROOT" | sed 's/\//-/g')"
REAL_MEMORY_PATH="$HOME/.claude/projects/${MEMORY_DIR_NAME}/memory"
PRIVATE_REPO_PATH="${PRIVATE_CONTENT_REPO_PATH:-$REPO_ROOT/../remotion-private-content}"
BACKUP_PATH="$PRIVATE_REPO_PATH/.claude-memory-backup"

usage() {
  echo "用法: $0 pull|push [--force]"
  echo "  pull   真實記憶 → 私有內容庫備份（自動 commit+push）"
  echo "  push   私有內容庫備份 → 真實記憶路徑（新機器初始化用；已有內容會先確認）"
  echo ""
  echo "可用 PRIVATE_CONTENT_REPO_PATH 環境變數覆寫私有內容庫位置"
  echo "（預設：$REPO_ROOT 的同層目錄 remotion-private-content）"
  exit 1
}

[ $# -ge 1 ] || usage
CMD="$1"
FORCE="${2:-}"

if [ ! -d "$PRIVATE_REPO_PATH/.git" ]; then
  echo "找不到私有內容庫本機副本，先 clone 到 $PRIVATE_REPO_PATH ..."
  git clone https://github.com/maxwu1981/remotion-private-content.git "$PRIVATE_REPO_PATH"
fi

case "$CMD" in
  pull)
    if [ ! -d "$REAL_MEMORY_PATH" ]; then
      echo "錯誤：找不到真實記憶路徑 $REAL_MEMORY_PATH"
      exit 1
    fi
    mkdir -p "$BACKUP_PATH"
    rsync -a --delete "$REAL_MEMORY_PATH/" "$BACKUP_PATH/"
    cd "$PRIVATE_REPO_PATH"
    git add .claude-memory-backup
    if git diff --cached --quiet; then
      echo "記憶內容沒有變化，不用 commit"
    else
      git commit -m "sync: 記憶備份更新 $(date '+%Y-%m-%d %H:%M')" -q
      git push -q
      echo "已備份並推送到 remotion-private-content"
    fi
    ;;
  push)
    if [ ! -d "$BACKUP_PATH" ]; then
      echo "錯誤：私有內容庫裡沒有 .claude-memory-backup/，要先在舊機器跑過 pull"
      exit 1
    fi
    if [ -d "$REAL_MEMORY_PATH" ] && [ -n "$(ls -A "$REAL_MEMORY_PATH" 2>/dev/null)" ] && [ "$FORCE" != "--force" ]; then
      echo "警告：$REAL_MEMORY_PATH 已經有內容，直接覆蓋可能蓋掉這台機器上比較新的記憶。"
      read -r -p "確定要用備份覆蓋嗎？[y/N] " ans
      case "$ans" in
        y|Y) ;;
        *) echo "已取消"; exit 1 ;;
      esac
    fi
    mkdir -p "$REAL_MEMORY_PATH"
    rsync -a "$BACKUP_PATH/" "$REAL_MEMORY_PATH/"
    echo "已還原記憶到 $REAL_MEMORY_PATH"
    ;;
  *)
    usage
    ;;
esac
