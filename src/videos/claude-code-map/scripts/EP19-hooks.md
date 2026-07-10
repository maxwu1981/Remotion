# EP19 · Hooks 鉤子是什麼?(第 19 / 30 站)

## GEO
- **標題**:Claude Code 的 Hooks 是什麼?讓某些動作「一定會發生」
- **一句話描述**:Hooks 是在 Claude Code 生命週期特定時點自動執行的 shell 指令(設定在 settings),確保某動作「一定發生」,如改檔後自動格式化、提交前先跑 lint。
- **標籤**:Claude Code, hooks, 鉤子, 自動化, 新手教學

## 你在這 / 下一步
- **高亮**:節點 19 `hooks`(D)·關係線:設定於(→8 settings.json)
- **已學**:1–18
- **下一步**:EP20 · Plugins 外掛
- **來源**:https://code.claude.com/docs/en/hooks-guide

## 腳本(六段)
### 1 鉤子
CLAUDE.md 是「拜託它記得做」,但有些事你要「保證一定做」。那就用 Hooks。
### 2 你在這
地圖第 19 站。它設定在第 8 站的 settings 裡。
### 3 定義
Hooks 是在 Claude Code 生命週期特定時點自動執行的 shell 指令——例如「每次改完檔」「每回合結尾」「需要你輸入時」。它給的是「確定性」:不靠 AI 自己想到,而是時間點一到就一定執行。常見用途:改檔後自動格式化、提交前先跑 lint、需要你時跳通知。
### 4 例子 / demo
幫新聞小助手加一個 hook:每次它改完程式碼,自動跑格式化;另一個:當它停下來等你回覆,跳一個桌面通知,你就不用一直盯著終端機。
### 5 下一步
能力越加越多。下一站第 20 號:把這些 skills、hooks、MCP 一起打包分享——Plugins。
### 6 結尾 CTA
第 19 站打勾!訂閱繼續。來源:官方 hooks,連結在描述。

## Demo 腳本(畫面)
- 你在這:節點 19 高亮;虛線到節點 8(設定於)。
- 定義:生命週期時間軸,在「改檔後 / 回合結尾」掛上 hook 圖示;標「確定性,一定執行」。
- demo:settings 加一個 PostToolUse 格式化 hook → 改檔後自動跑;再加 Notification hook。
- 下一步:鏡頭滑向節點 20。

## YouTube 描述(草稿)
Claude Code 的 Hooks 是什麼?它是在生命週期特定時點自動執行的 shell 指令(設在 settings),確保某動作「一定發生」——改檔後自動格式化、提交前 lint、等你時跳通知。這集幫新聞小助手加自動格式化 hook。Claude Code 新手地圖第 19 站。

⏱️ 0:00 拜託 vs 保證 / 0:20 設在 settings / 0:35 Hooks 是什麼 / 0:55 加格式化+通知 hook / 1:15 下一站:Plugins

❓FAQ
Q:Hooks 跟 CLAUDE.md 差在哪?A:CLAUDE.md 是建議,Hooks 是時間點一到一定執行。
Q:要會寫程式嗎?A:基本是 shell 指令;也有 prompt-based/agent-based hook。

🔗 https://code.claude.com/docs/en/hooks-guide
#ClaudeCode #hooks

## VO cues
| cue | 文字 |
|---|---|
| e19-hook1 | CLAUDE.md 是拜託它記得做,但有些事你要保證一定做。那就用 Hooks。 |
| e19-here1 | 地圖第 19 站。它設定在第 8 站的 settings 裡。 |
| e19-def1 | Hooks 是在 Claude Code 生命週期特定時點自動執行的 shell 指令,例如每次改完檔、每回合結尾、需要你輸入時。 |
| e19-def2 | 它給的是確定性:不靠 AI 自己想到,而是時間點一到就一定執行。 |
| e19-def3 | 常見用途:改檔後自動格式化、提交前先跑 lint、需要你時跳通知。 |
| e19-demo1 | 幫新聞小助手加一個 hook:每次改完程式碼自動跑格式化;另一個:當它停下來等你回覆,跳一個桌面通知。 |
| e19-demo2 | 你就不用一直盯著終端機。 |
| e19-next1 | 能力越加越多。下一站第 20 號:把 skills、hooks、MCP 一起打包分享,Plugins。 |
| e19-cta1 | 第 19 站打勾!訂閱繼續。來源:官方 hooks。 |
