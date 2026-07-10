# 每日影片工廠 Daily Video Factory — 規格 v1

需求來源：聽眾在 Reddit 上真正卡住的 Claude 問題 → 選題 → 雙 agent 合議出最穩、且查證過的解法 → 資料驅動模板生成影片 → 上傳 YouTube。每天 21:00 本機自動跑，早上人工一句話核准才公開。

## 已定案（與使用者確認）
- **自動化**：全自動到「不公開草稿」；**只在最後一關把關**，且為**非同步**。
- **核准**：早上跟 Claude 說「**發今天的**」→ 把當日 unlisted 影片一鍵轉公開（正片＋Short）。
- **通知**：**WhatsApp Cloud API**（21:00 自動送：標題＋縮圖＋不公開連結＋選題理由）。
- **來源**：Reddit 為主（官方 API／PRAW，需一把免費 Reddit App 憑證）；Threads 先放（官方 API 存在但要 Meta 審核，之後再說）。
- **社群**：r/ClaudeAI、r/Anthropic、r/ClaudeCode、r/LLMDevs。
- **題目範圍**：全 Claude（claude.ai 聊天、API、Cowork、MCP、桌面版）；排除純抱怨／政策，只留「可教學解法」。
- **去重**：維護 `covered-topics.json`，每次比對排除。
- **選題排序**：以「**衝瀏覽量**」為目標 → 搜尋需求 × 互動熱度 × GEO 缺口（我來定權重）。
- **解法**：兩 agent **合併共識**，取「**最穩**」；**必對照官方文件**（docs.claude.com／claude-code-guide）查證；查不到 → 標記＋附「網路上他人解法」當建議＋註明可能有其他方式。
- **格式**：固定這套（橫式、終端機/卡片風、正面語氣「經驗→解法」、重點＋outro CTA），**長度依內容不固定**；**每支都出 9:16 Short 導流**。
- **語言/可見度**：中文＋技術詞英文＋GEO 公式；最終**公開**。
- **排程**：本機 21:00；Mac 不睡眠＋工具權限預先授權（使用者自理）。
- **量/保險**：每天最多 1 支；沒有強題 → fallback「選一個 AI skill 詳細介紹（參考網路）」。

## 管線（21:00 orchestrator 依序跑）
1. **Scout（1 agent）**：Reddit API 搜 4 個社群近 24–48h 關於 Claude 的提問/痛點 → 過濾（只留可教學）→ 去重 → 依瀏覽量潛力排序 → 選 1 題 → 產 GEO 標題＋切角。無強題 → fallback skill 介紹。
2. **Solve & Debate（2 agent 合議）**：A/B 各研究 → 對照官方文件查證 → 互評 N 輪 → 合併成「最穩」解法 brief（問題→解法＋適用/不建議）；未證實處標記＋附網路建議。
3. **Scriptwriter**：brief → `video-spec.json`（旁白 script ＋ scene-spec：cover/terminal/compare/keypoints/places/outro）。
4. **Produce**：edge-tts 旁白 → detached 算繪 → QA gate（零抖動＋outro）；同時產 9:16 Short。
5. **Publish**：YouTube 上傳為 **unlisted** ＋自訂縮圖＋GEO metadata → 記 ledger → WhatsApp 通知。
6. **Morning approve**：使用者說「發今天的」→ unlisted → public（正片＋Short）。

## 關鍵架構決定
- **資料驅動通用模板**：做一個 parametrized Remotion composition `Explainer`，吃 Zod schema 的 scene-spec（Cover / TerminalScene / CompareScene / KeyPointsScene / PlacesScene / Outro），`calculateMetadata` 動態算長度，沿用現有 `shared-skills` + 既有 components。→ **每天只產 JSON、不寫新程式碼**（穩、不會 build 壞）。

## 狀態與失敗處理
- `automation/state/covered-topics.json`（去重）、`automation/state/daily-runs.json`（每日狀態/連結）。
- 任一階段失敗 → WhatsApp 通知錯誤 ＋ 跳過當天（**不留半成品公開**）。

## 需要使用者提供的前置
1. **Reddit App** client id／secret（免費）。
2. **WhatsApp Cloud API**：Meta app、phone-number-id、token、訊息範本、收訊號碼。
3. **Mac 21:00 不睡眠** ＋ 一次性**預先授權**所有工具（Reddit 抓取／render／上傳）。

## 分期建置
- **Phase 1**：資料驅動 `Explainer` 模板 → 用現有 2 支內容重現驗證（不需外部憑證）。
- **Phase 2**：Scriptwriter（brief→JSON）＋ Scout ＋ Debate（先半手動跑通一輪、產 1 支）。
- **Phase 3**：Produce/Publish 自動化 ＋ WhatsApp 通知 ＋ 一鍵核准。
- **Phase 4**：接 21:00 排程 ＋ ledger ＋ 失敗處理，端到端試跑。
- 每階段給使用者看產出再往下。

## 更新 2026-06-21
- 排程時間 02:00 → **21:00（晚上 9 點）**；live task `daily-video-factory` cron 已改 `0 21 * * *`（目前 enabled=false 暫停）。
- **封面/縮圖改由老闆用 Gemini 生**：上傳 unlisted **不帶 --thumbnail**，`render_daily.py` 產的 thumb 僅作 placeholder；iMessage 提醒老闆「用 Gemini 生封面→設自訂縮圖→『發今天的』轉公開」。封面定案規格見 memory `thumbnail-design-system`。
