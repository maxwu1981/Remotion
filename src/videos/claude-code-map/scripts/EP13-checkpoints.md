# EP13 · Checkpoints 是什麼?改錯了怎麼還原?(第 13 / 30 站)

## GEO
- **標題**:Claude Code 改錯怎麼救?Checkpoints 按兩下 Esc 就還原
- **一句話描述**:Claude Code 每次改檔前都會快照,出錯按兩下 Esc 就能倒回上一個狀態;它屬於 session 本地、和 git 分開,只涵蓋檔案變更。
- **標籤**:Claude Code, checkpoints, 還原, rewind, 新手教學

## 你在這 / 下一步
- **高亮**:節點 13 `checkpoints`(C)·關係線:安全雙保險(→11 權限模式)
- **已學**:1–12
- **下一步**:EP14 · Slash commands 斜線指令
- **來源**:https://code.claude.com/docs/en/how-claude-code-works#undo-changes-with-checkpoints

## 腳本(六段)
### 1 鉤子
它改壞了你的檔案,怎麼辦?不用慌——有「時光機」。
### 2 你在這
地圖第 13 站。它和權限模式是「安全雙保險」(連到第 11)。
### 3 定義
這叫 Checkpoints。每次 Claude 改檔之前,都會先把當下內容拍個快照。出錯時,按兩下 Esc 就能倒回上一個狀態,或直接叫它還原。重點:它是 session 本地的、跟 git 分開,而且只涵蓋「檔案變更」——像資料庫、寄出去的 Email 這種外部動作沒辦法倒回,所以這類動作它才會先問你。
### 4 例子 / demo
新聞小助手被改出 bug?按兩下 Esc，檔案瞬間回到改之前。試錯成本幾乎是零,放膽讓它嘗試。
### 5 下一步
安全網有了。下一站第 14 號:那些以 / 開頭的好用指令——Slash commands。
### 6 結尾 CTA
第 13 站打勾!訂閱繼續。來源:官方 how-claude-code-works,連結在描述。

## Demo 腳本(畫面)
- 你在這:節點 13 高亮;虛線到節點 11(安全雙保險)。
- 定義:時間軸 + 快照點;標「session 本地 · 與 git 分開 · 只涵蓋檔案」。
- demo:檔案被改壞(紅)→ 按 Esc Esc → 還原(綠)。
- 下一步:鏡頭滑向節點 14。

## YouTube 描述(草稿)
Claude Code 改錯怎麼救?每次改檔前都會快照,按兩下 Esc 就能倒回;它是 session 本地、和 git 分開、只涵蓋檔案變更(外部動作如寄信、改 DB 無法倒回,所以它會先問你)。Claude Code 新手地圖第 13 站。

⏱️ 0:00 改壞了怎麼辦 / 0:20 安全雙保險 / 0:30 Checkpoints 是什麼 / 0:55 按兩下 Esc 還原 / 1:10 下一站:斜線指令

❓FAQ
Q:Checkpoints 等於 git 嗎?A:不是,它是 session 本地快照、只涵蓋檔案。
Q:寄出去的信能撤回嗎?A:不能,外部動作無法倒回,所以它會先問你。

🔗 https://code.claude.com/docs/en/how-claude-code-works#undo-changes-with-checkpoints
#ClaudeCode #checkpoints

## VO cues
| cue | 文字 |
|---|---|
| e13-hook1 | 它改壞了你的檔案,怎麼辦?不用慌,有時光機。 |
| e13-here1 | 地圖第 13 站。它和權限模式是安全雙保險。 |
| e13-def1 | 這叫 Checkpoints。每次 Claude 改檔之前,都會先把當下內容拍個快照。 |
| e13-def2 | 出錯時按兩下 Esc 就能倒回上一個狀態,或直接叫它還原。 |
| e13-def3 | 重點:它是 session 本地、跟 git 分開,只涵蓋檔案變更;資料庫、寄出去的 Email 這種外部動作沒辦法倒回,所以它才會先問你。 |
| e13-demo1 | 新聞小助手被改出 bug?按兩下 Esc,檔案瞬間回到改之前。 |
| e13-demo2 | 試錯成本幾乎是零,放膽讓它嘗試。 |
| e13-next1 | 安全網有了。下一站第 14 號:那些以斜線開頭的好用指令,Slash commands。 |
| e13-cta1 | 第 13 站打勾!訂閱繼續。來源:官方 how-claude-code-works。 |
