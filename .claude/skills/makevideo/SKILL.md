---
name: makevideo
description: |
  從零做一支 Ai-Wisdom 解說片：搜題 → 對照官方文件查證 → 寫「故事腳本」→ 資料驅動 spec → 配音 → 算繪 → QA → 三方式生封面 → 上傳 YouTube 不公開。
  只在我輸入 /makevideo 時執行（可帶主題，如 /makevideo Plan Mode）。
disable-model-invocation: true
allowed-tools: Bash(python3 automation/*) Bash(npx remotion*) Bash(python3 automation/make-vo-spec.py*) Bash(ffmpeg*) Bash(ffprobe*)
---

# /makevideo — 一支解說片，從搜題到上傳

工作目錄 `/Users/maxwu/Remotion`。完整細節在 `automation/ORCHESTRATOR.md`（runbook A）與專案記憶；這裡是把這套流程＋最新鐵則串起來。**全程繁中＋技術詞英文、正面語氣（不用「坑」）、套 GEO。**

## 0. 先問片型＋主題（鐵則，CLAUDE.md §6）
用 **AskUserQuestion 可點選選項**問老闆「片型＋主題」再動工，不要自己默默選。
- 片型→封面默認：資料驅動解說片→EP00 公式｜詳細解說 Tutorial→風格B 曉晴｜工具盤點卡→EP00 垂直。
- 帶了主題參數（$ARGUMENTS）就當主題建議，仍要確認片型。

## 1. 搜題
`python3 automation/scout.py`（讀 `automation/state/scout-<date>.json` 的 candidates）。**由你親自判斷**哪則是「真的可教學的技術問題」；本週全是發布戲劇／迷因 → fallback：選一個常被問、未涵蓋的 Claude 功能（查 `automation/state/covered-topics.json` 去重）。

## 2. 查證（對照官方文件）
WebFetch 官方文件（`code.claude.com/docs` / `docs.claude.com`）逐字查證；必要時並行兩個 `claude-code-guide` agent 合議「最穩」解法。每點標 verified/unverified。

## 3. 寫「故事腳本」→ 先給老闆過稿（鐵則，見記憶 video-story-script-structure）
**不要條列速查卡**。要故事弧：為何有此議題 → 誰遇到 → 影響什麼 → 大家為何解不掉 → 你怎麼解 → 你跟別人哪裡不同 → 怎麼證明真的解決（可量測 before/after）→ CTA。第一人稱真實經歷，約 3–4 分鐘。
- **痛點用「真實搜尋得到的網路抱怨」當社會實證**：WebFetch 抓真人逐字發言（GitHub 討論／HN Algolia API／具名部落格最穩；Reddit 直 fetch 會擋），**文字照抄、ID 部分屏蔽**（如 `prashant****465`），標來源平台。
- **先把逐句旁白給老闆定稿，再算繪**（退稿過一次，別直接 render）。

## 4. 寫 spec → 配音 → 算繪
- 寫符合 `src/videos/_explainer/schema.ts` 的 video-spec 到 `src/videos/_explainer/specs/current.json`。積木：`cover`(必)、`terminal`/`compare`/`places`/`pipeline`/`image`/`complaints`(真實抱怨牆,泡泡逐一彈出疊滿)、`outro`(必,感謝+訂閱/按讚/分享)。標題/說明**不可含 `< >`**。
- `python3 automation/make-vo-spec.py src/videos/_explainer/specs/current.json current src/videos/_explainer/specs/current.vo.json`
- 算繪用 daemon（>10 分會被背景上限砍）：`python3 -c "import subprocess;subprocess.Popen(['python3','automation/render_daily.py'],stdout=open('out/render.log','w'),stderr=subprocess.STDOUT,start_new_session=True)"`，輪詢 log 到「算繪完成」。

## 5. QA gate（沒過不算 done，見記憶 video-qa-gate）
抽幀確認：① 0:00 有封面亮相 ② 前 3 秒有鉤子 ③ 結尾有 CTA ④ 無抖動 ⑤ 字幕與旁白同步。

## 6. 三方式生封面，給老闆挑（見記憶 cover-ep00-formula）
- **Remotion EP00**（中文正確、最穩）：仿 `src/videos/_explainer/SlashCover.tsx`，註冊 Still、`npx remotion still <id> out/<name>.png`。
- **Gemini Pro**（插畫張力）：Chrome 驅動 gemini.google.com（切 Pro 擴展）生圖→「下載圖片」到 ~/Downloads→cp 進 out/。中文易亂碼→走英文標題。
- **Canva**：`generate-design`(youtube_thumbnail)→`create-design-from-candidate`→`export-design` png→curl 下載。中文會亂碼→走英文。
封面**留給老闆挑＋設定**，routine 上傳不帶 --thumbnail。

## 7. 上傳（不公開）＋通知
寫 GEO 標題/說明（問題→解法 Q&A＋官方出處＋`https://maxwu1981.github.io/Remotion/`＋#tags，存到 `~/Documents/Claude/Projects/Video to Youtube/_temp_yt_desc.txt`）→ `yt_upload.py --privacy unlisted --category 28`（**不帶 --thumbnail**）→ append `automation/state/daily-runs.json`、加 covered-topics → `python3 automation/notify_imessage.py "今日影片已備好(不公開)：<標題> — <url>"`。**維持 unlisted，等老闆生封面＋說「發今天的」才轉公開**（runbook B）。

**任何一步失敗 → notify_imessage 回報並停止，絕不留半成品公開。**
