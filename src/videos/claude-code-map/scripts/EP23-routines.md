# EP23 · Routines 是什麼?讓它每天自動跑(第 23 / 30 站)

## GEO
- **標題**:Claude Code 的 Routines 是什麼?關機也能每天自動跑的雲端排程
- **一句話描述**:Routines 把提示+儲存庫+連接器存成一份設定,跑在 Anthropic 雲端(電腦關機也會跑);可用排程、API、GitHub 事件觸發,CLI 用 /schedule 建立。
- **標籤**:Claude Code, routines, 排程, 自動化, /schedule, 新手教學

## 你在這 / 下一步
- **高亮**:節點 23 `routines`(E)·關係線:跑在雲端(→24 web)、雲端 vs 本機(→22)、被「促成自動化」(←21 headless)
- **已學**:1–22
- **下一步**:EP24 · Claude Code on the web
- **來源**:https://code.claude.com/docs/en/routines

## 腳本(六段)
### 1 鉤子
我們的小助手最後一塊拼圖:讓它「每天早上自己跑」,你完全不用開電腦。靠的就是 Routines。
### 2 你在這
地圖第 23 站,本章的核心。它跑在雲端(連第 24),也是本機 /loop 的雲端版(連第 22)。
### 3 定義
Routine 就是把一份提示、要用的 repo、還有連接器(像你的 Gmail)存成「一份設定」,跑在 Anthropic 的雲端基礎設施上——所以你的電腦關機,它照樣跑。觸發方式有三種:排程(每天、每週)、API(打一個 HTTP 請求觸發)、GitHub 事件(例如有人開 PR)。在 CLI 用 /schedule 就能建。
### 4 例子 / demo
把新聞小助手設成一個 routine:每天早上 7 點、跑「抓新聞→摘要→寄到我 Gmail」。設定一次,從此每天早上你信箱就有一份摘要。/schedule 每天早上 7 點寄新聞摘要,搞定。
### 5 下一步
自動化完成!下一站第 24 號:這些雲端任務跑在哪——Claude Code on the web。
### 6 結尾 CTA
第 23 站打勾!訂閱繼續。來源:官方 routines,連結在描述。

## Demo 腳本(畫面)
- 你在這:節點 23 高亮;虛線到 24、22、21。
- 定義:一份設定卡(提示+repo+連接器)上雲;三種觸發 icon(排程/API/GitHub);標「電腦關機也跑」。
- demo:/schedule daily 7am 寄新聞摘要 → 顯示已排程、下次執行時間。
- 下一步:鏡頭滑向節點 24。

## YouTube 描述(草稿)
Claude Code 的 Routines 是什麼?把提示+repo+連接器存成設定、跑在 Anthropic 雲端(關機也跑),用排程/API/GitHub 觸發,CLI 用 /schedule 建。這集把新聞小助手設成每天早上 7 點自動寄摘要。Claude Code 新手地圖第 23 站。

⏱️ 0:00 每天自己跑 / 0:20 本章核心 / 0:35 Routines 是什麼 / 0:55 三種觸發 / 1:05 設每天 7 點寄摘要 / 1:25 下一站:Web

❓FAQ
Q:Routines 在哪些方案?A:Pro/Max/Team/Enterprise 且開啟 Claude Code on the web;研究預覽中。
Q:電腦關機會跑嗎?A:會,跑在 Anthropic 雲端。
Q:能用 webhook 觸發嗎?A:能,用 API 觸發或 GitHub 事件。

🔗 https://code.claude.com/docs/en/routines
#ClaudeCode #routines

## VO cues
| cue | 文字 |
|---|---|
| e23-hook1 | 我們小助手最後一塊拼圖:讓它每天早上自己跑,你完全不用開電腦。靠的就是 Routines。 |
| e23-here1 | 地圖第 23 站,本章的核心。它跑在雲端,也是本機 /loop 的雲端版。 |
| e23-def1 | Routine 就是把一份提示、要用的 repo、還有連接器像你的 Gmail,存成一份設定,跑在 Anthropic 的雲端基礎設施上,所以你電腦關機它照樣跑。 |
| e23-def2 | 觸發方式有三種:排程 每天每週、API 打一個 HTTP 請求觸發、GitHub 事件 例如有人開 PR。在 CLI 用 /schedule 就能建。 |
| e23-demo1 | 把新聞小助手設成一個 routine:每天早上 7 點跑抓新聞、摘要、寄到我 Gmail。 |
| e23-demo2 | 設定一次,從此每天早上你信箱就有一份摘要。/schedule 每天早上 7 點寄新聞摘要,搞定。 |
| e23-next1 | 自動化完成!下一站第 24 號:這些雲端任務跑在哪,Claude Code on the web。 |
| e23-cta1 | 第 23 站打勾!訂閱繼續。來源:官方 routines。 |
