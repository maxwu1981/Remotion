# EP18 · Subagents 子代理是什麼?(第 18 / 30 站)

## GEO
- **標題**:Claude Code 的 Subagents 是什麼?把雜活外包、不塞爆主對話
- **一句話描述**:Subagents 是專責特定任務的子助手,各自有獨立的 context window、自訂系統提示與工具;把雜訊隔離在外、只回主對話一份摘要。
- **標籤**:Claude Code, subagents, 子代理, context, 新手教學

## 你在這 / 下一步
- **高亮**:節點 18 `subagents`(D)·關係線:各自獨立的(→12 context window)、省 token(→30 costs)
- **已學**:1–17
- **下一步**:EP19 · Hooks 鉤子
- **來源**:https://code.claude.com/docs/en/sub-agents

## 腳本(六段)
### 1 鉤子
一件雜活會把主對話塞爆,讓 Claude 變健忘?把它「外包」出去就好。
### 2 你在這
地圖第 18 站。它直接連到第 12 站的 context——這正是它存在的理由。
### 3 定義
Subagent 是專責某類任務的子助手。它跑在「自己」獨立的 context window,有自訂的系統提示、指定的工具、獨立權限。當任務符合它的描述,Claude 就把活丟給它;它做完只回一份摘要回來。好處:探索、翻 log 這些雜訊不會塞爆你的主對話,還能省 token、用更便宜的模型跑。用 /agents 設定。
### 4 例子 / demo
新聞小助手要「研究今天哪些主題在燒」——這會抓一大堆網頁、很佔空間。開一個「研究」subagent 去做,它在自己的空間翻完,只回給主對話一句「今天熱門:三個主題」。主線乾淨清爽。
### 5 下一步
外包雜活搞定。下一站第 19 號:讓某些動作「一定會發生」的——Hooks。
### 6 結尾 CTA
第 18 站打勾!訂閱繼續。來源:官方 sub-agents,連結在描述。

## Demo 腳本(畫面)
- 你在這:節點 18 高亮;虛線到節點 12(各自獨立)、節點 30(省 token)。
- 定義:主對話框旁分出一個獨立的小框(子代理),做完只回一張摘要卡。
- demo:/agents 設研究子代理 → 它抓一堆網頁(在自己框內)→ 回主對話一句摘要。
- 下一步:鏡頭滑向節點 19。

## YouTube 描述(草稿)
Claude Code 的 Subagents 是什麼?它是專責特定任務的子助手,有獨立 context、自訂提示與工具,把雜訊隔離、只回主對話摘要,還能省 token。這集用「研究子代理」幫新聞小助手找熱門主題。Claude Code 新手地圖第 18 站。

⏱️ 0:00 雜活塞爆主對話 / 0:20 為何連到 context / 0:35 Subagent 是什麼 / 1:00 研究子代理示範 / 1:20 下一站:Hooks

❓FAQ
Q:Subagent 跟 Skill 差在哪?A:Skill 是指令,Subagent 是有獨立 context 的執行者。
Q:怎麼建?A:用 /agents,或在檔案放 markdown 定義。
Q:能用便宜模型嗎?A:能,把雜活路由到 Haiku 省成本。

🔗 https://code.claude.com/docs/en/sub-agents
#ClaudeCode #subagents

## VO cues
| cue | 文字 |
|---|---|
| e18-hook1 | 一件雜活會把主對話塞爆,讓 Claude 變健忘?把它外包出去就好。 |
| e18-here1 | 地圖第 18 站。它直接連到第 12 站的 context,這正是它存在的理由。 |
| e18-def1 | Subagent 是專責某類任務的子助手。它跑在自己獨立的 context window,有自訂系統提示、指定工具、獨立權限。 |
| e18-def2 | 當任務符合它的描述,Claude 就把活丟給它,它做完只回一份摘要回來。 |
| e18-def3 | 好處:探索、翻 log 這些雜訊不會塞爆主對話,還能省 token、用更便宜的模型跑。用 /agents 設定。 |
| e18-demo1 | 新聞小助手要研究今天哪些主題在燒,這會抓一大堆網頁、很佔空間。開一個研究 subagent 去做。 |
| e18-demo2 | 它在自己的空間翻完,只回給主對話一句:今天熱門三個主題。主線乾淨清爽。 |
| e18-next1 | 外包雜活搞定。下一站第 19 號:讓某些動作一定會發生的,Hooks。 |
| e18-cta1 | 第 18 站打勾!訂閱繼續。來源:官方 sub-agents。 |
