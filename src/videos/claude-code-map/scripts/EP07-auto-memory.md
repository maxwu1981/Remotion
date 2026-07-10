# EP07 · Auto memory 自動記憶是什麼?跟 CLAUDE.md 差在哪?(第 7 / 30 站)

## GEO
- **標題**:Claude Code 會自己記筆記?Auto memory 與 CLAUDE.md 的差別
- **一句話描述**:Auto memory 是 Claude 自己邊做邊記的筆記(build 指令、除錯心得、你的偏好),存在 MEMORY.md;與你親手寫的 CLAUDE.md 互補。
- **標籤**:Claude Code, auto memory, MEMORY.md, 記憶, 新手教學

## 你在這 / 下一步
- **高亮**:節點 7 `auto-memory`(B)·關係線:互補 它寫/你寫(→6)
- **已學**:1–6
- **下一步**:EP08 · settings.json 設定
- **來源**:https://code.claude.com/docs/en/memory#auto-memory

## 腳本(六段)
### 1 鉤子
CLAUDE.md 是你寫給它的。但你知道嗎——Claude 也會「自己寫筆記」。
### 2 你在這
地圖第 7 站,和上一站的 CLAUDE.md 是一對:一個你寫、一個它寫。
### 3 定義
這叫 Auto memory。Claude 邊做邊把值得記的事存下來:build 指令、除錯心得、你的偏好,寫進一個 MEMORY.md。每次開場會載入 MEMORY.md 的前 200 行。它不是每次都記,而是判斷「以後用得到」才記。預設開啟,可用 /memory 查看、編輯。
### 4 例子 / demo
做新聞小助手時,你糾正它一次:「以後寄信都用 pnpm、不要用 npm」。下次它就記得了——因為它把這條寫進了 auto memory。用 /memory 打開,就看得到。
### 5 下一步
記憶搞定。下一站第 8 號:settings.json——專案的「設定開關」。
### 6 結尾 CTA
第 7 站打勾!訂閱繼續。來源:官方 memory,連結在描述。

## Demo 腳本(畫面)
- 你在這:節點 7 高亮;虛線到節點 6(互補)。
- 定義:對照表「CLAUDE.md=你寫·指令 vs Auto memory=它寫·心得」;MEMORY.md 檔案圖示。
- demo:對話中糾正「用 pnpm」→ 畫面冒出「Writing memory」→ /memory 打開看到那條。
- 下一步:鏡頭滑向節點 8。

## YouTube 描述(草稿)
Claude Code 會自己記筆記?Auto memory 讓 Claude 把 build 指令、除錯心得、你的偏好自動存進 MEMORY.md,和你手寫的 CLAUDE.md 互補。這集看它怎麼記住「用 pnpm」。Claude Code 新手地圖第 7 站。

⏱️ 0:00 它會自己記筆記 / 0:20 和 CLAUDE.md 的差別 / 0:35 Auto memory 怎麼運作 / 0:55 實例:記住用 pnpm / 1:15 下一站:settings

❓FAQ
Q:Auto memory 跟 CLAUDE.md 衝突嗎?A:互補;你寫指令、它記心得。
Q:能關掉嗎?A:能,/memory 切換或設定 autoMemoryEnabled。
Q:存在哪?A:~/.claude/projects/<專案>/memory/。

🔗 https://code.claude.com/docs/en/memory#auto-memory
#ClaudeCode #memory

## VO cues
| cue | 文字 |
|---|---|
| e07-hook1 | CLAUDE.md 是你寫給它的。但你知道嗎,Claude 也會自己寫筆記。 |
| e07-here1 | 地圖第 7 站,和上一站的 CLAUDE.md 是一對:一個你寫、一個它寫。 |
| e07-def1 | 這叫 Auto memory。Claude 邊做邊把值得記的事存下來:build 指令、除錯心得、你的偏好,寫進一個 MEMORY.md。 |
| e07-def2 | 每次開場會載入 MEMORY.md 的前 200 行。它不是每次都記,而是判斷以後用得到才記。預設開啟,可用 /memory 查看編輯。 |
| e07-demo1 | 做新聞小助手時,你糾正它一次:以後都用 pnpm、不要用 npm。下次它就記得了,因為寫進了 auto memory。 |
| e07-demo2 | 用 /memory 打開,就看得到那一條。 |
| e07-next1 | 記憶搞定。下一站第 8 號:settings.json,專案的設定開關。 |
| e07-cta1 | 第 7 站打勾!訂閱繼續。來源:官方 memory。 |
