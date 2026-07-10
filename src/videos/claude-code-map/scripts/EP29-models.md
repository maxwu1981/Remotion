# EP29 · Claude Code 有哪些模型?怎麼選?(第 29 / 30 站)

## GEO
- **標題**:Claude Code 模型怎麼選?Opus、Sonnet、Haiku、Fable 一次懂
- **一句話描述**:用 /model 切換:sonnet(Sonnet 4.6,日常編碼)、opus(Opus 4.8,複雜推理)、haiku(快又省)、fable(Fable 5,最難最長的任務);opusplan 規劃用 Opus、執行切 Sonnet。
- **標籤**:Claude Code, 模型, Opus, Sonnet, Haiku, Fable, 新手教學

## 你在這 / 下一步
- **高亮**:節點 29 `models`(G 模型與成本)·關係線:負責推理(→2 agentic loop)
- **已學**:1–28
- **下一步**:EP30 · 成本與 /usage
- **來源**:https://code.claude.com/docs/en/model-config

## 腳本(六段)
### 1 鉤子
同一個 Claude Code,背後可以換不同「腦」。選對模型,省力又省錢。
### 2 你在這
地圖第 29 站,最後一章「模型與成本」。模型就是第 2 站那個迴圈裡「負責推理」的核心。
### 3 定義
用 /model 切換,常用四個別名:sonnet,是 Sonnet 4.6,日常編碼最常用;opus,是 Opus 4.8,複雜推理、架構決策;haiku,又快又省,適合簡單任務;fable,是 Fable 5,最難、最長、要它自己跑很久的任務。還有一個 opusplan:規劃階段用 Opus 想、執行階段自動切 Sonnet 做,兼顧聰明跟省。
### 4 例子 / demo
做新聞小助手:規劃整體架構時用 opus 或 opusplan;每天例行抓新聞、產摘要,用 sonnet 甚至 haiku 就夠,省很多。一句 /model haiku 就切。
### 5 下一步
選對腦了。最後一站第 30 號:怎麼看花了多少、怎麼省——成本與 /usage。
### 6 結尾 CTA
第 29 站打勾!訂閱看最後一站。來源:官方 model-config,連結在描述。

## Demo 腳本(畫面)
- 你在這:節點 29 高亮;虛線到節點 2(負責推理)。
- 定義:四張模型卡(Sonnet 4.6 日常 / Opus 4.8 複雜 / Haiku 快省 / Fable 5 最難最長)+ opusplan 說明。
- demo:/model 打開選單切換;標各別名解析到的版本。
- 下一步:鏡頭滑向節點 30。

## YouTube 描述(草稿)
Claude Code 模型怎麼選?/model 切換:sonnet(Sonnet 4.6,日常)、opus(Opus 4.8,複雜推理)、haiku(快省)、fable(Fable 5,最難最長);opusplan 規劃用 Opus、執行切 Sonnet。這集教你新聞小助手各階段選哪顆。Claude Code 新手地圖第 29 站。

⏱️ 0:00 換不同的腦 / 0:20 模型負責推理 / 0:35 四個別名怎麼選 / 1:00 小助手各階段選哪顆 / 1:20 最後一站:成本

❓FAQ
Q:新手預設用哪個?A:Pro 預設 Sonnet;複雜任務切 opus 或用 opusplan。
Q:opusplan 是什麼?A:規劃用 Opus、執行切 Sonnet,兼顧聰明與省。
Q:版本會變嗎?A:別名指向當前推薦版,本片為錄製當下對應版本。

🔗 https://code.claude.com/docs/en/model-config
#ClaudeCode #模型

## VO cues
| cue | 文字 |
|---|---|
| e29-hook1 | 同一個 Claude Code,背後可以換不同的腦。選對模型,省力又省錢。 |
| e29-here1 | 地圖第 29 站,最後一章模型與成本。模型就是第 2 站那個迴圈裡負責推理的核心。 |
| e29-def1 | 用 /model 切換,常用四個別名:sonnet 是 Sonnet 4.6,日常編碼最常用;opus 是 Opus 4.8,複雜推理、架構決策。 |
| e29-def2 | haiku 又快又省,適合簡單任務;fable 是 Fable 5,最難、最長、要它自己跑很久的任務。 |
| e29-def3 | 還有一個 opusplan:規劃階段用 Opus 想、執行階段自動切 Sonnet 做,兼顧聰明跟省。 |
| e29-demo1 | 做新聞小助手:規劃整體架構時用 opus 或 opusplan;每天例行抓新聞、產摘要,用 sonnet 甚至 haiku 就夠,省很多。 |
| e29-demo2 | 一句 /model haiku 就切。 |
| e29-next1 | 選對腦了。最後一站第 30 號:怎麼看花了多少、怎麼省,成本與 /usage。 |
| e29-cta1 | 第 29 站打勾!訂閱看最後一站。來源:官方 model-config。 |
