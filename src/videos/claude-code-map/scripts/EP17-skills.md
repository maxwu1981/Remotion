# EP17 · Skills(Agent Skills)是什麼?(第 17 / 30 站)

## GEO
- **標題**:Claude Code 的 Skills 是什麼?把重複流程打包成隨叫隨用
- **一句話描述**:Skills 是寫一個 SKILL.md 把可重複的流程/知識打包,Claude 需要時才動態載入(或用 /名稱 直接叫),省 context、提升一致性。
- **標籤**:Claude Code, skills, Agent Skills, SKILL.md, 新手教學

## 你在這 / 下一步
- **高亮**:節點 17 `skills`(D)·關係線:知識 vs 連線(→16 MCP)、改放這(→6 CLAUDE.md)、自訂指令併入(←14)、被打包分享(←20)
- **已學**:1–16
- **下一步**:EP18 · Subagents 子代理
- **來源**:https://code.claude.com/docs/en/skills

## 腳本(六段)
### 1 鉤子
如果你發現自己「每次都貼同一段指示」給 Claude,那就是該做一個 Skill 了。
### 2 你在這
地圖第 17 站,連線最多的節點之一——它跟 MCP、CLAUDE.md、自訂指令都有關係。
### 3 定義
Skill 就是寫一個 SKILL.md,把可重複的流程或知識打包起來。Claude 看相關才動態載入,或你用 /名稱 直接叫它。和 CLAUDE.md 的差別:CLAUDE.md 每次都載入吃 context;Skill 只有用到才載,所以放一堆參考資料幾乎不花成本。和 MCP 的差別:MCP 是連線取資料,Skill 是知識與指令。它遵循開放的 Agent Skills 標準。
### 4 例子 / demo
幫新聞小助手做一個「摘要排版」Skill:固定的標題格式、emoji、字數限制都寫進 SKILL.md。以後每次產摘要,叫一下這個 skill,排版就一致又漂亮。
### 5 下一步
Skill 管知識。下一站第 18 號:把整段雜活「外包」出去的——Subagents。
### 6 結尾 CTA
第 17 站打勾!訂閱繼續。來源:官方 skills,連結在描述。

## Demo 腳本(畫面)
- 你在這:節點 17 高亮;虛線到 16、6、14、20。
- 定義:SKILL.md 卡 + 「按需載入」動畫;對照「CLAUDE.md 每次載 vs Skill 用到才載」「MCP 連線 vs Skill 知識」。
- demo:建 .claude/skills/summary-format/SKILL.md → 叫 /summary-format → 摘要排版一致。
- 下一步:鏡頭滑向節點 18。

## YouTube 描述(草稿)
Claude Code 的 Skills 是什麼?寫一個 SKILL.md 把重複流程/知識打包,Claude 需要時才動態載入(或 /名稱 直接叫),省 context、提升一致性,遵循 Agent Skills 開放標準。這集幫新聞小助手做「摘要排版」skill。Claude Code 新手地圖第 17 站。

⏱️ 0:00 一直貼同一段指示 / 0:20 連線最多的節點 / 0:35 Skill 是什麼 / 1:00 做摘要排版 skill / 1:20 下一站:Subagents

❓FAQ
Q:Skill 跟 CLAUDE.md 差在哪?A:CLAUDE.md 每次載入,Skill 用到才載。
Q:Skill 跟 MCP 差在哪?A:MCP 連線取資料,Skill 是知識指令。
Q:自訂 / 指令呢?A:已併入 skills。

🔗 https://code.claude.com/docs/en/skills
#ClaudeCode #skills

## VO cues
| cue | 文字 |
|---|---|
| e17-hook1 | 如果你發現自己每次都貼同一段指示給 Claude,那就是該做一個 Skill 了。 |
| e17-here1 | 地圖第 17 站,連線最多的節點之一,它跟 MCP、CLAUDE.md、自訂指令都有關係。 |
| e17-def1 | Skill 就是寫一個 SKILL.md,把可重複的流程或知識打包起來。Claude 看相關才動態載入,或你用斜線名稱直接叫它。 |
| e17-def2 | 和 CLAUDE.md 的差別:CLAUDE.md 每次都載入吃 context;Skill 只有用到才載,放一堆參考資料幾乎不花成本。 |
| e17-def3 | 和 MCP 的差別:MCP 是連線取資料,Skill 是知識與指令。它遵循開放的 Agent Skills 標準。 |
| e17-demo1 | 幫新聞小助手做一個摘要排版 Skill:固定的標題格式、emoji、字數限制都寫進 SKILL.md。 |
| e17-demo2 | 以後每次產摘要,叫一下這個 skill,排版就一致又漂亮。 |
| e17-next1 | Skill 管知識。下一站第 18 號:把整段雜活外包出去的,Subagents。 |
| e17-cta1 | 第 17 站打勾!訂閱繼續。來源:官方 skills。 |
