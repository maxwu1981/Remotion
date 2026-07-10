# 每日影片工廠 — 維運速查卡

> 自動：每天 06:00 從 Reddit+HN 找 Claude 痛點 → 雙 agent 合議解法 → 生成影片 → **算繪+QA 完就停**（不自動上傳、不主動通知；2026-07-04 拍板）。
> 你本機看過 `out/vf-daily.mp4` 後說「**發今天的**」才上傳＋轉公開。完整規格：[`daily-video-factory-SPEC.md`](daily-video-factory-SPEC.md)；執行手冊：[`ORCHESTRATOR.md`](ORCHESTRATOR.md)。

---

## ① 每天 06:00 會做的事（自動）
```
scout.py 選題(Reddit RSS + HN) → LLM 判斷可教學否(不行→fallback)
 → 雙 agent 查官方文件合議 → 寫 current.json → make-vo-spec.py 旁白
 → render_daily.py 算繪+QA → 寫 daily-runs.json(status=rendered_pending_review) 停
```
（失敗時 `notify_imessage.py` 仍會通知——只有錯誤通知保留。）

## ② 要保持運作的 3 件事（缺一就不會自動跑）
1. **預先授權**：側邊欄「Scheduled」→ `daily-video-factory` → 按一次 **Run now**（一次性核准工具權限）。
2. **Mac 不睡眠**（讓 06:00 醒著）：
   ```bash
   sudo pmset repeat wakeorpoweron MTWRFSU 05:55:00   # 每天 05:55 自動醒
   sudo pmset -c sleep 0                               # 接電時整機不睡
   ```
3. **Claude app 開著**（關著的話排程會等下次開啟才補跑）。

## ③ 核准發布：看過本機成品後對 Claude 說「發今天的」
→ 讀 `state/daily-runs.json` 最新 `rendered_pending_review` 那筆 → `yt_upload.py` 上傳 unlisted → `yt_publish.py --video-id <id> --privacy public` → 改 status=public → **`npm run snapshot` 刷新影片中心靜態快照 + push docs/**（讓新片對 AI 引擎可見；快照只收公開片）→ 對話回報連結（不發 iMessage）。

---

## 常用手動指令（都在 repo 根目錄跑；要連網/Messages 的本機原生執行）
| 目的 | 指令 |
|---|---|
| 手動跑整條 | 開新 session 說「跑今天的影片工廠」(照 ORCHESTRATOR runbook A) |
| 只跑選題 | `python3 automation/scout.py` |
| 選題邏輯離線測 | `python3 automation/scout.py --selftest` |
| 只配音 | `python3 automation/make-vo-spec.py src/videos/_explainer/specs/current.json current src/videos/_explainer/specs/current.vo.json` |
| 只算繪+縮圖 | `python3 automation/render_daily.py` |
| 發 iMessage | `python3 automation/notify_imessage.py "訊息"` |
| 轉公開 | `python3 "$HOME/Documents/Claude/Projects/Video to Youtube/yt_publish.py" --video-id <ID> --privacy public` |
| 刷新網站靜態快照(GEO) | `npm run snapshot`（讀 gitignored config 的 server key→把公開影片烤進 `docs/index.html`+sitemap；之後 push docs/ 才上線） |

## 檔案地圖
- 引擎（7 積木資料驅動）：`src/videos/_explainer/`（`schema.ts` 合約 · `Explainer.tsx` 本體 · `components.tsx`）
- 今日 spec/旁白：`src/videos/_explainer/specs/current.json` + `current.vo.json`（每天被覆寫）→ 算繪 composition `VF-Daily`
- 選題：`automation/scout.py` · 旁白：`make-vo-spec.py` · 算繪：`render_daily.py` · 通知：`notify_imessage.py`
- 狀態：`automation/state/`（`config.json`〔含號碼,已 gitignore〕 · `daily-runs.json` 執行記錄 · `covered-topics.json` 去重）
- 上傳/發佈：`~/Documents/Claude/Projects/Video to Youtube/`（`yt_upload.py` · `yt_publish.py` · OAuth 憑證）

## 疑難排解
- **Scout 抓不到 / 429**：Reddit RSS 連打會 429（已內建退避 20s/40s）；一天冷啟一次正常。`.json` 端點已被封(403)，只能用 `.rss`。
- **本週全是 drama/迷因**：正常——LLM 會判定無合格題 → 自動 fallback（介紹一個未涵蓋的 Claude 功能）。
- **YouTube 上傳 400 invalidDescription**：標題/說明含 `< >`；`yt_upload.py` 已自動移除，但別在原稿用角括號。
- **算繪 >10 分鐘**：本機 cron 原生跑沒問題；若用 Bash 工具手動跑要 daemonize（`start_new_session`）避免 10 分鐘上限砍掉半成品。
- **YouTube token 過期**：`yt_upload.py` 會自動 refresh；若 `invalid_grant`，刪 `.yt_token.json` 重跑一次（會開瀏覽器，選 jinqing-gallery@gmail.com）。
- **「發今天的」轉公開逾時（socket timeout）**：googleapiclient/httplib2 的 `videos.update` 在本機曾連線逾時 → `yt_publish.py` 已改用**原生 urllib**（含 401 refresh），穩定。發佈後務必用 server key GET 二次確認 `privacyStatus`，別只信回傳。
- **iMessage 沒收到**：確認 Messages 已登入 + Automation 權限已授權；號碼在 `state/config.json` 的 `imessage_to`。

## 改設定
- 通知號碼/頻道：改 `automation/state/config.json`。
- 加去重題目：把關鍵字加進 `automation/state/covered-topics.json` 的 `keywords`（標題含任一就跳過）。
- 換通知通道（iMessage↔WhatsApp）：見 [[youtube-upload-account]] 記憶與 SPEC。

## 機密提醒
- repo 是 **public**。**勿提交**：`config.json`(已 gitignore)、任何 token/憑證。
- 唯讀的 YouTube 瀏覽器 key 在 `docs/config.js`（已鎖網域，可公開）。
