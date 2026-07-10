# EP12 · Context window 上下文是什麼?滿了怎麼辦?(第 12 / 30 站)

## GEO
- **標題**:Claude Code 的 Context window 是什麼?滿了用 /compact 跟 /clear
- **一句話描述**:Context window 是 Claude 一次能記住的內容(對話、檔案、CLAUDE.md…);快滿時會自動壓縮(compaction),用 /context 看用量、/compact 或 /clear 整理。
- **標籤**:Claude Code, context window, 上下文, compact, 新手教學

## 你在這 / 下一步
- **高亮**:節點 12 `context-window`(C)·關係線:各自獨立的(←18 subagents)
- **已學**:1–11
- **下一步**:EP13 · Checkpoints 復原
- **來源**:https://code.claude.com/docs/en/context-window

## 腳本(六段)
### 1 鉤子
聊久了,Claude 好像「忘記」前面講的?那是 context window 滿了。
### 2 你在這
地圖第 12 站,還在「規劃與控制」。
### 3 定義
Context window 是 Claude 一次能記住的內容:對話、讀過的檔案、CLAUDE.md、auto memory、載入的 skills。它會邊用邊滿;快滿時 Claude 會自動壓縮,叫 compaction,但早期的細節指令可能被丟掉。三個指令要記:/context 看現在用掉多少、/compact 主動壓縮(可指定保留重點)、/clear 清空從頭開始。持久規則要寫進 CLAUDE.md,別只靠對話。
### 4 例子 / demo
做新聞小助手做到一半,context 到 80%,它開始忘記摘要格式?輸入 /compact focus on 摘要格式,把重點壓住;真的卡死就 /clear、重開乾淨對話。
### 5 下一步
管好記憶體很關鍵。下一站第 13 號:萬一它改錯了,怎麼一鍵還原——Checkpoints。
### 6 結尾 CTA
第 12 站打勾!訂閱繼續。來源:官方 context-window,連結在描述。

## Demo 腳本(畫面)
- 你在這:節點 12 高亮;虛線到節點 18(各自獨立的)。
- 定義:context 條狀圖逐漸填滿 → 觸發 compaction 把舊內容縮短;三指令卡 /context /compact /clear。
- demo:/context 顯示用量 → /compact focus on 摘要格式。
- 下一步:鏡頭滑向節點 13。

## YouTube 描述(草稿)
Claude Code 的 Context window 是什麼?它是 Claude 一次能記住的內容,快滿會自動 compaction;用 /context 看用量、/compact 壓縮、/clear 清空。持久規則記得寫進 CLAUDE.md。Claude Code 新手地圖第 12 站。

⏱️ 0:00 它好像忘了前面 / 0:20 context 是什麼 / 0:40 /context /compact /clear / 1:00 小助手實作 / 1:20 下一站:Checkpoints

❓FAQ
Q:壓縮會丟東西嗎?A:會保留請求與關鍵程式碼,但早期細節可能流失;持久規則寫 CLAUDE.md。
Q:/compact 和 /clear 差在哪?A:compact 壓縮保留重點,clear 直接清空。

🔗 https://code.claude.com/docs/en/context-window
#ClaudeCode #context

## VO cues
| cue | 文字 |
|---|---|
| e12-hook1 | 聊久了,Claude 好像忘記前面講的?那是 context window 滿了。 |
| e12-here1 | 地圖第 12 站,還在「規劃與控制」。 |
| e12-def1 | Context window 是 Claude 一次能記住的內容:對話、讀過的檔案、CLAUDE.md、auto memory、載入的 skills。 |
| e12-def2 | 快滿時 Claude 會自動壓縮叫 compaction,但早期的細節指令可能被丟掉。 |
| e12-def3 | 三個指令:/context 看用掉多少、/compact 主動壓縮可指定保留重點、/clear 清空從頭開始。持久規則要寫進 CLAUDE.md,別只靠對話。 |
| e12-demo1 | 做小助手做到一半,context 到 80%,它開始忘記摘要格式?輸入 /compact focus on 摘要格式,把重點壓住。 |
| e12-demo2 | 真的卡死就 /clear、重開乾淨對話。 |
| e12-next1 | 管好記憶體很關鍵。下一站第 13 號:萬一它改錯了,怎麼一鍵還原,Checkpoints。 |
| e12-cta1 | 第 12 站打勾!訂閱繼續。來源:官方 context-window。 |
