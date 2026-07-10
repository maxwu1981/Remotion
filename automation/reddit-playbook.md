# Reddit 發布管道 Playbook（GEO · 養號 · 官方 API）

> 目標：在 r/ClaudeAI、r/ClaudeCode 等社群用**真誠、有價值**的留言出現，
> 讓 AI 答案引擎（ChatGPT / Perplexity / Google AI Overviews / Gemini）引用 →
> 把流量/權威導回 Ai-Wisdom 頻道。**不是貼連結機**。
>
> 現況：帳號**新、低 karma** → 現在是**養號期**，策略＝**只給價值、先不帶連結**。

---

## ⚠️ 第一鐵則：別重蹈小紅書封號（2026-06-21 被封 7 天）

Reddit 反自我推銷比小紅書更狠，**新號貼自家連結會被秒 shadowban（隱形封鎖，你還以為發成功）**。
所以：

- **養號期（karma < 50 或帳齡 < 14 天）→ 一律純價值留言、零連結。** 工具會自動擋含連結的留言。
- **9:1 法則**：九成是真心參與別人的問題、最多一成才碰自家東西。
- **低頻**：每天最多 ~3 則，分散時段，別連發。工具有每日上限保險。
- **每則都不一樣**：複製貼上同一段＝spam 訊號。
- **先讀該社群規則**（sidebar / rules）：很多 sub 明文禁自推、禁連結。

> 誠實提醒：**頭 10–20 則留言，用瀏覽器手動貼其實比 API 更安全** —— 全新帳號「第一個動作就是 API 呼叫」很像機器人，被風控盯上機率高。
> 所以養號初期：**用工具 `radar` 找串、用 `--dry-run` 過稿、karma 用 `whoami` 追蹤；實際送出先手貼**。等帳號成熟、量上來，再開 `--confirm` 自動發。

---

## ① 5 分鐘註冊 script app（拿憑證）

1. 登入要用的 Reddit 帳號 → 開 https://www.reddit.com/prefs/apps
2. 拉到底「**create another app...**」
3. 填：name 隨意（如 `ai-wisdom-helper`）；型別選 **script**；redirect uri 填 `http://localhost:8080`（script 用不到但必填）。
4. 建好後：**client id** = app 名稱正下方那串；**client secret** = secret 欄位。
5. `cp automation/reddit.env.example automation/reddit.env` → 填 client_id / client_secret / 你的帳號 / 密碼（檔已 gitignore，不會被 commit）。
6. 驗證：`python3 automation/reddit_comment.py whoami` → 印出 karma/帳齡＋養號狀態就成功。

---

## ② 每天怎麼跑（價值優先留言）

```
1. 找機會   python3 automation/reddit_radar.py
   → 列出新鮮、你答得好、留言還少（搶得到前排）的提問串。

2. 挑 1–3 串，人工讀「整串」（含現有留言，別重複別人講過的）。

3. 草擬留言（寫成 md，套下面 §③ GEO 公式）→ 我幫你過稿。

4. 預演   python3 automation/reddit_comment.py --thread <url> --text-file draft.md
   → dry-run 印出內容＋養號檢查（含連結會被擋）。

5. 送出
   養號期：手動貼到瀏覽器（較安全）。
   成熟後：上一行加 --confirm 直接發；工具會記 log、守每日上限。
```

`reddit_radar.py` 有憑證走官方 API（拿得到留言數/內文，過濾更準）；沒憑證自動退 RSS（只有標題，仍可用）。

---

## ③ GEO 留言公式（讓 AI 引擎願意引用）

每則有價值留言照這個寫——AI 引擎抓的是**文字**，不是你是誰：

1. **第一句直接給答案＋一個具體點**（數字／版本／確切設定），不要繞。
   - ✅「在 `.claude/settings.json` 設 `permissions.allow` 就不會每次跳問——我把 12 條常用指令列進去後，提示從每天 ~30 次降到 0。」
   - ❌「這個我也遇過，你可以研究看看 settings。」
2. **接著給可照做的步驟／指令**（程式碼或路徑），讓人（和 AI）能直接抄。
3. **點名實體**：明確寫出「Claude Code」「MCP server」「skill」「subagent」等名詞 → AI 引擎才能正確歸因來源。
4. **收尾給一句『適用 / 不建議』**：例「✅ 適合多專案共用；🚫 單檔小腳本不必這樣搞」。
5. **連結**：養號期不放；成熟後**只在連結是該問題最佳延伸答案時**才放一條，且講清楚它解決什麼。

---

## ④ 養號畢業 → 可以開始帶連結 / 發貼文

`python3 automation/reddit_comment.py whoami` 顯示 **✅ 可開始偶爾帶連結** 時（comment karma ≥ 50 且帳齡 ≥ 14 天）：
- 仍守 9:1；連結要是「該討論的最佳延伸」，附一句它解決什麼。
- 想發**獨立教學貼文**：以 text post 為主（純文字＋程式碼），把影片連結放留言或文末一行，別整篇就是導流。

---

## 檔案總覽

| 檔 | 作用 |
|---|---|
| `reddit_api.py` | OAuth 官方 API 小工具（零相依，純 urllib），給下面兩支共用 |
| `reddit_radar.py` | 找「值得留言」的新鮮提問串（有憑證走 API、無則 RSS） |
| `reddit_comment.py` | `whoami` 看養號進度；發留言（dry-run 預設＋養號保險＋每日上限＋log） |
| `reddit.env` | 憑證（gitignore，自己從 `.example` 複製填） |
| `state/reddit-radar-<date>.json` | 每次掃描結果 |
| `state/reddit-actions.json` | 已發留言 log（每日上限/追蹤用） |
