# EP22 · /loop 與排程任務是什麼?(第 22 / 30 站)

## GEO
- **標題**:Claude Code 的 /loop 是什麼?在 session 內重複跑一個提示
- **一句話描述**:/loop 讓一個提示在 CLI session 內按間隔重複執行(輪詢用);也能設一次性提醒。是本機、session 內的輕量排程。
- **標籤**:Claude Code, /loop, scheduled tasks, 排程, 新手教學

## 你在這 / 下一步
- **高亮**:節點 22 `loop-schedule`(E)·關係線:雲端 vs 本機排程(←23 routines)
- **已學**:1–21
- **下一步**:EP23 · Routines 雲端自動跑
- **來源**:https://code.claude.com/docs/en/scheduled-tasks

## 腳本(六段)
### 1 鉤子
想讓它「每隔一段時間就做一次」,但不想搞雲端?先認識最輕量的:/loop。
### 2 你在這
地圖第 22 站。它跟下一站的 Routines 是「本機 vs 雲端」的對照。
### 3 定義
/loop 讓一個提示在你「開著的」CLI session 裡,按固定間隔重複跑,適合輪詢——例如每 5 分鐘看一次某個狀態。你也能設一次性提醒。重點:它跑在本機、而且 session 一關就停。要真正無人值守、關機也跑的,得用下一站的 Routines。
### 4 例子 / demo
測新聞小助手時,用 /loop 每 10 分鐘抓一次新聞看有沒有更新,邊開邊觀察。確認穩了,再升級成真正的每日排程。
### 5 下一步
本機輕量排程懂了。下一站第 23 號:讓它「上雲、關機也每天自動跑」——Routines,這是我們小助手的關鍵一步。
### 6 結尾 CTA
第 22 站打勾!訂閱繼續。來源:官方 scheduled-tasks,連結在描述。

## Demo 腳本(畫面)
- 你在這:節點 22 高亮;虛線到節點 23(雲端 vs 本機)。
- 定義:鐘擺/計時器圖示;標「本機 · session 內 · 關了就停」。
- demo:/loop 每 10 分鐘跑一次抓新聞的提示。
- 下一步:鏡頭滑向節點 23。

## YouTube 描述(草稿)
Claude Code 的 /loop 是什麼?它讓一個提示在 CLI session 內按間隔重複跑(輪詢),也能設一次性提醒——但跑在本機、session 關了就停。要關機也跑請看下一站 Routines。Claude Code 新手地圖第 22 站。

⏱️ 0:00 每隔一段做一次 / 0:20 本機 vs 雲端 / 0:35 /loop 是什麼 / 0:55 每 10 分鐘抓新聞 / 1:15 下一站:Routines

❓FAQ
Q:/loop 關了還會跑嗎?A:不會,它在 session 內、本機;關機也跑請用 Routines。
Q:適合什麼?A:短期輪詢、邊開邊觀察。

🔗 https://code.claude.com/docs/en/scheduled-tasks
#ClaudeCode #loop

## VO cues
| cue | 文字 |
|---|---|
| e22-hook1 | 想讓它每隔一段時間就做一次,但不想搞雲端?先認識最輕量的:/loop。 |
| e22-here1 | 地圖第 22 站。它跟下一站的 Routines 是本機 vs 雲端的對照。 |
| e22-def1 | /loop 讓一個提示在你開著的 CLI session 裡,按固定間隔重複跑,適合輪詢,例如每 5 分鐘看一次某個狀態。你也能設一次性提醒。 |
| e22-def2 | 重點:它跑在本機,而且 session 一關就停。要真正無人值守、關機也跑的,得用下一站的 Routines。 |
| e22-demo1 | 測新聞小助手時,用 /loop 每 10 分鐘抓一次新聞看有沒有更新,邊開邊觀察。 |
| e22-demo2 | 確認穩了,再升級成真正的每日排程。 |
| e22-next1 | 本機輕量排程懂了。下一站第 23 號:讓它上雲、關機也每天自動跑,Routines,這是小助手的關鍵一步。 |
| e22-cta1 | 第 22 站打勾!訂閱繼續。來源:官方 scheduled-tasks。 |
