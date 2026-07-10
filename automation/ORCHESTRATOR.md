# 每日影片工廠 — Orchestrator 執行手冊

兩個 runbook：**A. 每日建片（06:00 自動，2026-07-08 起）**、**B. 發今天的（老闆看片後一句話）**。
排程 task `daily-video-factory` 會叫一個 Claude session 照「A」跑；你說「發今天的」就跑「B」。
所有路徑以 repo 根目錄 `/Users/maxwu/Remotion` 為基準。規格＝`automation/daily-video-factory-SPEC.md`。

遵守：繁中＋技術詞英文、正面語氣（**不用「坑」**，用 經驗/終於發現/解法）、GEO 公式、[[geo-first-publishing]]。

---

## A. 每日建片（autonomous，給 06:00 cron）

**2026-07-04 起改為「算繪完就停」**：不再自動上傳 YouTube、不再主動發「影片已備好」的 iMessage 通知。老闆會自己找時間看 `out/vf-daily.mp4`，覺得可以發再親口說「發今天的」，才進入下面的 **B**。

**2026-07-08 起 `VF-Daily` 預設改黑曜石風**：`src/Root.tsx` 的 `VF-Daily` composition 從淺色 `Explainer` 換成 `ExplainerObsidian`（`src/videos/_explainer/ExplainerObsidian.tsx`，白底畫布+黑曜石玻璃卡），讀同一份 `current.json`/`current.vo.json`，時長/流程完全不變。共用 `bgm-piano.mp3`（不逐日生新 BGM，自動化流程不做 Chrome 駕駛 Gemini 這步）。若某天題目被挑中要升級成正式旗艦片，才另外手動生專屬 BGM＋搬進 `src/videos/<topic>/` 專屬資料夾（範例：`claude-code-agent-view/Obsidian.tsx`）。

1. **Scout 選題**：`python3 automation/scout.py`（會寫 `automation/state/scout-<date>.json`；來源＝Reddit 4 社群 + Hacker News Algolia API）。
   ⚠️ Scout 的 `picked` 只是**關鍵字粗篩的建議**，不可盲信——讀出 `candidates` 清單，**由你（LLM）親自判斷**哪一則是「真的可教學的技術問題」：
   - 排除：發布戲劇/迷因/情緒抒發/政策時事（即使含 how/vs/fix 也算）、太個案無法泛用的。
   - 留下：真的在問「怎麼做/怎麼修/怎麼選/怎麼設定」且能給通用解法的。
   若候選**沒有一則合格** → **fallback**：選一個常被問、且未涵蓋的 Claude 功能/skill 做「詳細介紹」（參考網路），例如 Hooks、Subagents、/commands、settings.json 等。
2. **雙 agent 合議解法**：用 Agent 工具並行 spawn **兩個 `claude-code-guide`**，各自研究 picked 題目的解法、**對照官方文件查證**（docs.claude.com / code.claude.com），輸出結構化 brief。
   然後**合議成共識**（取「最穩」）：問題 → 根因 → 步驟解法（每點標 [verified: URL] 或 [unverified]）→ 「適用場景／不建議場景」。查不到的標記，並附「網路上他人解法」當建議、註明可能有其他方式。
3. **Scriptwriter → spec**：把共識寫成符合 `src/videos/_explainer/schema.ts` 的 **video-spec JSON**，存到 **`src/videos/_explainer/specs/current.json`**。
   - 用 6 種積木挑適合的：`cover`(必)、`terminal`/`compare`/`places`/`pipeline`/`image`、`outro`(必，含 感謝+訂閱/按讚/分享 CTA)。
   - cover 4 顆 chip = 四個重點；每段 keyline = 帶結論的一句；旁白 `script`（cue id → 句）正面語氣。**標題/說明絕不含 `< >`**。
3b. **（可選）名詞小教室片尾**：若題目名詞密度高（旁白會冒出 **≥4 個**新手可能不懂的術語）→ scriptwriter 順手產 **`src/videos/_explainer/specs/current.glossary.json`**（通用模組 `src/videos/_explainer/GlossarySegment.tsx` 讀；形式＝2026-07-08 dotfiles/Stow 片老闆驗證版）：
   - 欄位：`motifEmoji`（選一個貫穿整段的比喻 motif）＋ `introHook`（開場卡鉤子，`\n` 換行）＋ `terms[]`（5–8 個，各 `big/sub/emoji/metaphor/def/where/accent(claude|blue|violet|green|warn)`，每卡「比喻→白話定義→你會在哪看到它」、朋友聊天語氣）＋ `script`（`g0` 開場、`g1..gN` 每詞一句、`g(N+1)` 收尾）。
   - 名詞段 VO：`python3 automation/make-vo-spec.py src/videos/_explainer/specs/current.glossary.json current-glossary src/videos/_explainer/specs/current.glossary.vo.json`
   - **不做名詞段的日子**：把 `current.glossary.json` 重設成 `{"terms": [], "script": {}}`、`current.glossary.vo.json` 重設成 `{}`——兩檔**必須存在**（Root.tsx 靜態 import），空＝停用，`VF-DailyFull` 會自動退化成純主片。別留昨天的名詞段，否則會被接到今天的片尾。
4. **VO**：`python3 automation/make-vo-spec.py src/videos/_explainer/specs/current.json current src/videos/_explainer/specs/current.vo.json`
5. **算繪**：`python3 automation/render_daily.py` → `out/vf-daily.mp4` + `out/vf-daily-thumb.png`。做了 3b 就改 `python3 automation/render_daily.py VF-DailyFull`（主片＋名詞段一次算成，並自動歸檔 glossary spec）；9:16 名詞段 Short（可選）＝ comp `VF-DailyGlossaryShort` 另 render。
6. **（可選）QA**：`node scripts/qa-video.mjs VF-Daily <靜止frame> 8 out/vf-daily.mp4` → hold-diff 應接近全黑。
7. **GEO metadata（草稿，先不上傳）**：寫 `title`（GEO、正面、含可搜尋關鍵詞，≤100 字）、`description`（問題→解法 Q&A＋官方文件出處＋ `🔗 https://maxwu1981.github.io/Remotion/`＋ #tags）、`tags`（逗號分隔）。**不可含 `< >`**。
   做了 3b 的日子，description 再加兩塊：① 章節時間戳多一行「名詞小教室」（起點秒數＝主片長度，用 `npx remotion compositions` 查 `VF-Daily` 的秒數即可）② 把 N 個名詞的「詞＋比喻＋白話定義」逐字列進描述（定義式純文字是 AI 答案引擎最容易引用的格式，觀眾也能不點開影片就複習）。
8. **記 ledger**：把 `{date, topic, source_url, title, description, tags, video_path:"out/vf-daily.mp4", thumb_path:"out/vf-daily-thumb.png", status:"rendered_pending_review"}` append 進 `automation/state/daily-runs.json` 的 `runs`。
9. **去重**：把今日題目關鍵字加進 `automation/state/covered-topics.json`。

**失敗處理**：任何一步失敗 → `notify_imessage.py "今日影片工廠失敗於步驟 X：<簡述>"` 並**停止當天**（這個錯誤通知保留——半夜管線掛掉還是要讓老闆知道；如果連這個也要關，再明講）。

---

## B. 發今天的（老闆本機看過 `out/vf-daily.mp4`、確認要發佈時說「發今天的」）

1. 讀 `automation/state/daily-runs.json`，取**最新一筆 status 為 `"rendered_pending_review"` 或 `"unlisted"`** 的紀錄。
2.（可選）使用者要改標題/縮圖就先處理（縮圖＝老闆自己用 Gemini 生、告訴 Claude 檔案路徑）。
3. 若該筆 `status == "rendered_pending_review"`（尚未上傳）→ **先上傳成不公開**：
   ```
   python3 "$HOME/Documents/Claude/Projects/Video to Youtube/yt_upload.py" \
     --video <video_path> --title "<title>" \
     --description "<description>" \
     --tags "<tags>" --category 28 --privacy unlisted \
     [--thumbnail <老闆提供的縮圖路徑，若有]
   ```
   從輸出抓 **video_id / url**，把該筆 `status` 改成 `"unlisted"` 並記下 `video_id`/`url`。（網路：本機原生執行；經 Bash 工具時加 `dangerouslyDisableSandbox`。）
4. 轉公開：
   ```
   python3 "$HOME/Documents/Claude/Projects/Video to Youtube/yt_publish.py" --video-id <ID> --privacy public
   ```
5. 把該筆 `status` 改成 `"public"`。
6. **刷新影片中心靜態快照（GEO：讓新片對 AI 引擎可見）**：`npm run snapshot` → 把 `docs/index.html` 與 `docs/sitemap.xml` 的更動 `git add docs && git commit && git push`（GitHub Pages 從 main/docs 部署，push 後幾分鐘生效）。快照只收**公開**影片，所以一定在轉公開後才跑。
7. 在對話直接回報公開連結即可（老闆本來就在對話中主動觸發，**不再另發 iMessage**）。
