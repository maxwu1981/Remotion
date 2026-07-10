# 腳本說明 — Claude Code 新手地圖系列

每集一個 `.md`。集數=[`tree.ts`](../tree.ts) 的節點序號(EP00 總覽、EP01..EP30 對應節點 1..30、EP31 系列回顧)。

## 格式(每集固定六段)

`鉤子 → 你在這(地圖)→ 定義 → 例子 / demo → 下一步 → 結尾 CTA`

- **直式 9:16**、每集 **2–3 分鐘、以實機 demo 為主**。
- 旁白繁中、技術名詞保留英文;字幕常駐;簡短 logo 片頭。
- 樹狀圖 bumper 頭尾都放:開頭高亮「你在這」、結尾顯示「打勾 + 下一步」。進度規則:已學打勾 · 當前高亮 · 未學變灰。
- 定義一律對照節點的官方 `sourceUrl`(畫面小字 + 描述連結)。

## 貫穿範例(所有集共用)

**「每日新聞摘要小助手」**:做一個每天早上自動把我關注主題的新聞整理成摘要、寄到我 Email 的小工具。
每學一個名詞,就用它把這個小助手往前推一步(CLAUDE.md 寫需求 → MCP 接 Gmail → Skills 排版 → Subagents 分工 → Routines 每天自動跑 → Security review 上線前把關)。

## VO cue 命名

`e<集號>-<段>` →(例:`e01-hook`、`e01-def1`、`e01-demo`)。每集底部的「VO cues」表即 `cue-id → 繁中口語`,可直接餵 edge-tts(複製 [`scripts/make-vo-claude-install.mjs`](../../../../scripts/make-vo-claude-install.mjs) 模式,`VO_VOICE=zh-TW-...`)。

## 全集清單(集號 = 學習路徑序號)

| 集 | 標題 | 對應節點 |
|---|---|---|
| EP00 | 開場:這張地圖怎麼用 | 全地圖總覽 |
| EP01 | Claude Code 是什麼 | 1 claude-code |
| EP02 | Agentic loop 代理迴圈 | 2 agentic-loop |
| EP03 | 在哪裡用 CLI/IDE/Desktop/Web | 3 interfaces |
| EP04 | 安裝、登入與方案 | 4 install-login |
| EP05 | 開 Project + /init | 5 project-init |
| EP06 | CLAUDE.md 專案記憶 | 6 claude-md |
| EP07 | Auto memory 自動記憶 | 7 auto-memory |
| EP08 | settings.json 設定 | 8 settings |
| EP09 | 怎麼下指令 | 9 prompting |
| EP10 | Plan mode 計畫模式 | 10 plan-mode |
| EP11 | 權限模式 | 11 permission-modes |
| EP12 | Context window 上下文 | 12 context-window |
| EP13 | Checkpoints 復原 | 13 checkpoints |
| EP14 | Slash commands 斜線指令 | 14 slash-commands |
| EP15 | Tools 工具 | 15 tools |
| EP16 | MCP 連外部工具 | 16 mcp |
| EP17 | Skills(Agent Skills) | 17 skills |
| EP18 | Subagents 子代理 | 18 subagents |
| EP19 | Hooks 鉤子 | 19 hooks |
| EP20 | Plugins 外掛 | 20 plugins |
| EP21 | Headless 非互動 | 21 headless |
| EP22 | /loop 與排程 | 22 loop-schedule |
| EP23 | Routines 雲端自動跑 | 23 routines |
| EP24 | Claude Code on the web | 24 web |
| EP25 | 安全與權限架構 | 25 security |
| EP26 | Sandboxing 沙箱 | 26 sandboxing |
| EP27 | Security review 外掛 | 27 security-review |
| EP28 | Code review / ultrareview | 28 code-review |
| EP29 | 模型 Models | 29 models |
| EP30 | 成本與 /usage | 30 costs |
| EP31 | 回顧:把整張地圖走一遍 | 全地圖回顧 |

> 本輪先交付 **EP00 + EP01**(鎖定風格/節奏)。確認後再依此範本批量補完 EP02–EP31。
