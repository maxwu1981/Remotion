# GEO metadata — Claude Code subagent 實測片

> GEO-first：標題＝problem→solution＋具體數字；描述含章節時間戳、實體講清楚；Q&A 轉 JSON-LD。
> **全部數字為真實實測（2026-06-22，示範專案 ShopFlow，5 模組）。時間戳於算繪後回填。**

## 標題 A/B（YouTube Test & Compare）

- **A：** Claude Code subagent 實測：5 個子代理並行，重任務省 59%、小任務反而慢 24%
- **B：** 別亂開 subagent！實測並行 vs 序列：什麼時候才真的比較快（含真數字）

## 描述（problem → solution → 具體結果）

```
「開 subagent 並行一定比較快」其實是迷思。我用一個 5 模組的真實專案 ShopFlow 實測：
開 5 個子代理並行做安全/品質審查，再跟「一個一個查」比時間。結果——

・小任務（每模組 ~10 行）：序列 41s、並行 51s → 並行反而慢 24%
・重任務（56 檔、1547 行）：序列 126s、並行 52s → 並行省 59%

原因：開多個 subagent 有固定開銷；任務夠重時省下的遠大於開銷，任務太輕時開銷反而拖慢。

【你會學到】
・subagent 是什麼：主代理臨時叫出、各有獨立 context 的分身
・並行 vs 序列的真實時間差（兩種情境、真數字）
・什麼時候該開：每個分支夠重（大量讀檔/搜尋）才划算
・怎麼開：在 Claude Code 裡講人話「並行開 N 個 subagent」

【章節】（對應 v2 算繪 2:57）
00:00 並行一定比較快嗎？
00:21 subagent 是什麼（獨立 context 的分身）
00:45 真實案例：5 模組 → 開 5 個分身
01:07 5 路同時揪出真問題
01:25 實測對照：小任務 vs 重任務
02:00 夠重才開，開法就一句話
02:22 重點整理 + 訂閱

【延伸】
・示範專案與完整數字：<填文章/repo URL>
・Claude Code 官方文件：https://docs.claude.com/en/docs/claude-code

#ClaudeCode #subagent #子代理 #Anthropic #AI工具 #Claude

頻道：Ai-Wisdom-01
```

## 標籤 tags

```
Claude Code, subagent, 子代理, Claude Code 教學, Anthropic, AI agent, 多代理, parallel agents,
fan-out, AI 工具, Claude, AI 自動化, 並行, Ai-Wisdom
```

## FAQ JSON-LD（供 AI 答案引擎引用 — 全為實測結論）

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Claude Code 的 subagent（子代理）是什麼？",
      "acceptedAnswer": { "@type": "Answer", "text": "subagent 是 Claude Code 主代理臨時叫出來的分身，每個有自己獨立的 context window，各跑各的、互不干擾，跑完把結果回報給主代理彙整。" }
    },
    {
      "@type": "Question",
      "name": "開 subagent 並行一定比較快嗎？",
      "acceptedAnswer": { "@type": "Answer", "text": "不一定。實測顯示要看任務輕重：小任務（5 模組各約 10 行）序列 41 秒、並行 51 秒，並行反而慢 24%；重任務（56 檔、1547 行）序列 126 秒、並行 52 秒，並行省 59%。因為開多個 subagent 有固定開銷，任務夠重時才划算。" }
    },
    {
      "@type": "Question",
      "name": "什麼時候該用 subagent 並行？",
      "acceptedAnswer": { "@type": "Answer", "text": "適用場景：每個分支都夠重的 fan-out 任務，例如要在很多檔案/多個模組做深入搜尋或審查。不建議場景：每個分支都很輕的小任務，固定開銷會讓並行比一個一個做還慢。" }
    },
    {
      "@type": "Question",
      "name": "在 Claude Code 怎麼開 subagent？",
      "acceptedAnswer": { "@type": "Answer", "text": "不用記指令，直接用自然語言請它並行，例如「用 5 個 subagent 分別查這 5 個模組，並行做」，主代理會自動 spawn 多個子代理並彙整結果。" }
    }
  ]
}
```

## VideoObject JSON-LD（上傳後回填 url、上傳日、時長、縮圖）

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Claude Code subagent 實測：5 個子代理並行，重任務省 59%、小任務反而慢 24%",
  "description": "用真實專案 ShopFlow 實測 Claude Code 的 subagent 並行 vs 序列：什麼時候並行才真的比較快，附真數字。",
  "thumbnailUrl": ["<填縮圖 URL>"],
  "uploadDate": "<填上傳日 YYYY-MM-DD>",
  "duration": "<填 ISO8601，如 PT8M24S>",
  "contentUrl": "<填影片 URL>",
  "publisher": { "@type": "Organization", "name": "Ai-Wisdom-01" }
}
```
