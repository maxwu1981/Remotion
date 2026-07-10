# EP16 · MCP 是什麼?怎麼接外部工具?(第 16 / 30 站)

## GEO
- **標題**:MCP 是什麼?讓 Claude Code 直接連 Gmail、Slack、資料庫
- **一句話描述**:MCP(Model Context Protocol)是連接 AI 與外部工具/資料的開放標準;接上後 Claude 能直接讀寫 Slack、Jira、Google Drive、資料庫等,不用再手動複製貼上。
- **標籤**:Claude Code, MCP, Model Context Protocol, Gmail, 新手教學

## 你在這 / 下一步
- **高亮**:節點 16 `mcp`(D)·關係線:提供更多(→15 tools)、知識 vs 連線(←17 skills)
- **已學**:1–15
- **下一步**:EP17 · Skills
- **來源**:https://code.claude.com/docs/en/mcp

## 腳本(六段)
### 1 鉤子
內建工具很強,但它怎麼連到你的 Gmail、Slack、資料庫?答案就一個字:MCP。
### 2 你在這
地圖第 16 站。MCP 等於替第 15 站的工具庫「再加外掛」。
### 3 定義
MCP 是 Model Context Protocol,連接 AI 與外部工具和資料的開放標準。接上一個 MCP 伺服器,Claude 就能直接讀寫那個服務——不用你一直複製貼上。什麼時候接?當你發現自己一直把另一個工具的資料貼進對話,就該接它了。
### 4 例子 / demo
我們的新聞小助手要會「寄信」。接上 Gmail 的 MCP,Claude 就能直接幫你把摘要寄出去。設定一次,之後它自己會用。
### 5 下一步
MCP 給的是「連線與動作」。下一站第 17 號是它的好搭檔,但管的是「知識」——Skills。
### 6 結尾 CTA
第 16 站打勾!訂閱繼續。來源:官方 mcp,連結在描述。

## Demo 腳本(畫面)
- 你在這:節點 16 高亮;虛線到節點 15(提供更多)、節點 17(知識 vs 連線)。
- 定義:中央 Claude,周圍接上 Slack / Jira / Drive / DB / Gmail 的插頭動畫(像 USB)。
- demo:接上 Gmail MCP → 對 Claude 說「把 summary.md 寄到我信箱」→ 寄出成功。
- 下一步:鏡頭滑向節點 17。

## YouTube 描述(草稿)
MCP 是什麼?Model Context Protocol 是連接 AI 與外部工具/資料的開放標準,接上後 Claude Code 能直接讀寫 Gmail、Slack、Jira、資料庫。這集幫新聞小助手接上 Gmail、學會寄信。Claude Code 新手地圖第 16 站。

⏱️ 0:00 怎麼連 Gmail / 0:20 替工具庫加外掛 / 0:35 MCP 是什麼 / 0:55 接 Gmail 寄摘要 / 1:15 下一站:Skills

❓FAQ
Q:MCP 跟內建工具差在哪?A:內建是基礎能力,MCP 連外部服務。
Q:什麼時候該接 MCP?A:當你一直把別的工具資料貼進對話時。
Q:MCP 跟 Skills 差在哪?A:MCP 連線取資料、Skills 是知識指令(EP17)。

🔗 https://code.claude.com/docs/en/mcp
#ClaudeCode #MCP

## VO cues
| cue | 文字 |
|---|---|
| e16-hook1 | 內建工具很強,但它怎麼連到你的 Gmail、Slack、資料庫?答案就一個字:MCP。 |
| e16-here1 | 地圖第 16 站。MCP 等於替第 15 站的工具庫再加外掛。 |
| e16-def1 | MCP 是 Model Context Protocol,連接 AI 與外部工具和資料的開放標準。 |
| e16-def2 | 接上一個 MCP 伺服器,Claude 就能直接讀寫那個服務,不用你一直複製貼上。 |
| e16-def3 | 什麼時候接?當你發現自己一直把另一個工具的資料貼進對話,就該接它了。 |
| e16-demo1 | 我們的新聞小助手要會寄信。接上 Gmail 的 MCP,Claude 就能直接幫你把摘要寄出去。 |
| e16-demo2 | 設定一次,之後它自己會用。 |
| e16-next1 | MCP 給的是連線與動作。下一站第 17 號是它的好搭檔,但管的是知識,Skills。 |
| e16-cta1 | 第 16 站打勾!訂閱繼續。來源:官方 mcp。 |
