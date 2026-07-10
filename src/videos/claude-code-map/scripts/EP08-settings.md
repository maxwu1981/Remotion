# EP08 · settings.json 是什麼?(第 8 / 30 站)

## GEO
- **標題**:Claude Code 的 settings.json 是什麼?權限、環境變數、hooks 都在這
- **一句話描述**:settings.json 是 Claude Code 的設定檔,可分使用者 / 專案 / 組織等層級,控制權限規則、環境變數、hooks 與模型等。
- **標籤**:Claude Code, settings.json, 設定, 權限, 新手教學

## 你在這 / 下一步
- **高亮**:節點 8 `settings`(B)
- **已學**:1–7
- **下一步**:EP09 · 怎麼下指令(進入 C 規劃與控制)
- **來源**:https://code.claude.com/docs/en/settings

## 腳本(六段)
### 1 鉤子
CLAUDE.md 是「行為建議」,但有些東西你想「硬性規定」——那要去 settings。
### 2 你在這
地圖第 8 站,「專案與記憶」這一章的最後一站。
### 3 定義
settings.json 是 Claude Code 的設定檔。它分層級:組織 > 專案 > 使用者,層層疊加。你在這裡設:哪些指令免問可跑、環境變數、hooks、預設模型等。和 CLAUDE.md 的差別:CLAUDE.md 是「建議」,settings 的規則是「強制」由程式執行的。
### 4 例子 / demo
幫新聞小助手在 .claude/settings.json 設兩件事:允許它免問就能跑測試指令;把 Gmail 的金鑰放進環境變數別寫死在程式裡。這樣它跑起來更順、也更安全。
### 5 下一步
專案地基打好了。下一站第 9 號,進第三章「規劃與控制」:怎麼把話講清楚,讓它一次到位。
### 6 結尾 CTA
第 8 站打勾,第二章完成!訂閱進下一章。來源:官方 settings,連結在描述。

## Demo 腳本(畫面)
- 你在這:節點 8 高亮、5–7 打勾,B 類整欄亮起。
- 定義:層級圖(組織 > 專案 > 使用者);對照「CLAUDE.md=建議 vs settings=強制」。
- demo:打開 .claude/settings.json,加入 permissions allow 一條 + env 一條。
- 下一步:鏡頭滑向 C 類節點 9。

## YouTube 描述(草稿)
Claude Code 的 settings.json 是什麼?它是設定檔,分組織/專案/使用者層級,控制權限規則、環境變數、hooks、模型——而且是「強制」執行的,和 CLAUDE.md 的「建議」不同。這集幫新聞小助手設好權限與金鑰。Claude Code 新手地圖第 8 站。

⏱️ 0:00 建議 vs 強制 / 0:20 你在地圖哪站 / 0:30 settings 是什麼 / 0:55 設權限+金鑰 / 1:15 下一章:規劃與控制

❓FAQ
Q:settings 和 CLAUDE.md 差在哪?A:settings 強制執行、CLAUDE.md 是行為建議。
Q:金鑰能寫在 settings 嗎?A:用環境變數引用,別把祕密寫死;細節見安全章(EP25)。

🔗 https://code.claude.com/docs/en/settings
#ClaudeCode #settings

## VO cues
| cue | 文字 |
|---|---|
| e08-hook1 | CLAUDE.md 是行為建議,但有些東西你想硬性規定,那要去 settings。 |
| e08-here1 | 地圖第 8 站,「專案與記憶」這一章的最後一站。 |
| e08-def1 | settings.json 是 Claude Code 的設定檔。它分層級:組織、專案、使用者,層層疊加。 |
| e08-def2 | 你在這裡設:哪些指令免問可跑、環境變數、hooks、預設模型等。 |
| e08-def3 | 和 CLAUDE.md 的差別:CLAUDE.md 是建議,settings 的規則是強制、由程式執行的。 |
| e08-demo1 | 幫新聞小助手設兩件事:允許它免問就能跑測試;把 Gmail 金鑰放進環境變數,別寫死在程式裡。 |
| e08-demo2 | 這樣它跑起來更順,也更安全。 |
| e08-next1 | 地基打好了。下一站第 9 號,進第三章規劃與控制:怎麼把話講清楚,讓它一次到位。 |
| e08-cta1 | 第 8 站打勾,第二章完成!訂閱進下一章。來源:官方 settings。 |
