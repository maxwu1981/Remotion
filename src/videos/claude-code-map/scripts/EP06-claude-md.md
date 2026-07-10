# EP06 · CLAUDE.md 是什麼?為什麼它是專案的記憶?(第 6 / 30 站)

## GEO
- **標題**:CLAUDE.md 是什麼?Claude Code 每次開場必讀的「專案記憶」
- **一句話描述**:CLAUDE.md 是放在專案根目錄的 markdown 檔,Claude Code 每次開場都會讀進去,用來寫專案慣例、build 指令與「永遠要做 X」等持久指令。
- **標籤**:Claude Code, CLAUDE.md, 系統提示, memory, 新手教學

## 你在這 / 下一步
- **高亮**:節點 6 `claude-md`(B)·關係線:存在專案裡(→5)、開場載入(→2)
- **已學**:1–5
- **下一步**:EP07 · Auto memory 自動記憶
- **來源**:https://code.claude.com/docs/en/memory

## 腳本(六段)
### 1 鉤子
如果你每次都要重新跟 Claude 解釋「我的專案長怎樣」,太累了。CLAUDE.md 就是來解決這件事的。
### 2 你在這
地圖第 6 站。它存在你的專案裡(連回第 5 站),而且每次開場都會被載入(連到第 2 站的迴圈)。
### 3 定義
CLAUDE.md 是放在專案根目錄的一個 markdown 檔,Claude 每次開場都會讀。你把「希望它每次都記得」的事寫進去:build 指令、命名慣例、專案結構、永遠要做 X。官方建議:寫具體、控制在 200 行內,越精簡它越聽話。
### 4 例子 / demo
幫新聞小助手寫 CLAUDE.md:目標是「每天抓 AI 新聞、整理成摘要、寄到我的 Gmail」;規則:摘要用繁體中文、最多 5 則、語氣中性。存檔。之後不管哪天打開,它都記得這些。
### 5 下一步
這是「你寫給它」的記憶。下一站第 7 號:它「自己寫給自己」的記憶——Auto memory。
### 6 結尾 CTA
第 6 站打勾!訂閱繼續。來源:官方 memory,連結在描述。

## Demo 腳本(畫面)
- 你在這:節點 6 高亮;虛線亮起到節點 5(存在專案裡)與節點 2(開場載入)。
- 定義:CLAUDE.md 檔案卡,內含 markdown 標題/清單;標「每次開場必讀」。
- demo:在 daily-news/CLAUDE.md 打入目標與三條規則,存檔。
- 下一步:鏡頭滑向節點 7。

## YouTube 描述(草稿)
CLAUDE.md 是什麼?它是放在專案根目錄的 markdown 檔,Claude Code 每次開場必讀,用來記住專案慣例、build 指令、「永遠要做 X」。這集幫新聞小助手寫第一份 CLAUDE.md。Claude Code 新手地圖第 6 站。

⏱️ 0:00 別每次重講一遍 / 0:20 你在地圖哪站 / 0:30 CLAUDE.md 是什麼 / 0:55 幫小助手寫一份 / 1:15 下一站:自動記憶

❓FAQ
Q:CLAUDE.md 放哪?A:專案根目錄 ./CLAUDE.md 或 ./.claude/CLAUDE.md。
Q:寫越多越好嗎?A:不,建議 200 行內、越具體越聽話。
Q:它一定會照做嗎?A:它是「情境」非強制;要強制請用 hooks(EP19)。

🔗 https://code.claude.com/docs/en/memory
#ClaudeCode #CLAUDEmd

## VO cues
| cue | 文字 |
|---|---|
| e06-hook1 | 如果你每次都要重新跟 Claude 解釋我的專案長怎樣,太累了。CLAUDE.md 就是來解決這件事的。 |
| e06-here1 | 地圖第 6 站。它存在你的專案裡,而且每次開場都會被載入。 |
| e06-def1 | CLAUDE.md 是放在專案根目錄的 markdown 檔,Claude 每次開場都會讀。 |
| e06-def2 | 你把希望它每次都記得的事寫進去:build 指令、命名慣例、專案結構、永遠要做 X。 |
| e06-def3 | 官方建議:寫具體、控制在 200 行內,越精簡它越聽話。 |
| e06-demo1 | 幫新聞小助手寫:目標是每天抓 AI 新聞、整理成摘要、寄到我的 Gmail;規則:摘要用繁體中文、最多 5 則、語氣中性。存檔。 |
| e06-demo2 | 之後不管哪天打開,它都記得這些。 |
| e06-next1 | 這是你寫給它的記憶。下一站第 7 號:它自己寫給自己的記憶,Auto memory。 |
| e06-cta1 | 第 6 站打勾!訂閱繼續。來源:官方 memory。 |
