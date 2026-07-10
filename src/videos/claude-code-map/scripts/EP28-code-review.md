# EP28 · Code review / ultrareview 是什麼?(第 28 / 30 站)

## GEO
- **標題**:Claude Code 的 Code Review 是什麼?自動在 PR 上挑問題
- **一句話描述**:Code review 會在 PR 上自動跑程式碼審查並標出嚴重度;ultrareview 則是在雲端做更深入的多代理審查。
- **標籤**:Claude Code, code review, ultrareview, PR, 新手教學

## 你在這 / 下一步
- **高亮**:節點 28 `code-review`(F)·關係線:上線前把關(→25 security)
- **已學**:1–27
- **下一步**:EP29 · 模型 Models(進入 G 模型與成本)
- **來源**:https://code.claude.com/docs/en/code-review

## 腳本(六段)
### 1 鉤子
安全掃過了,那「程式品質」呢?讓 Claude 幫你做 code review。
### 2 你在這
地圖第 28 站,「安全與品質」這章最後一站,一樣是「上線前把關」。
### 3 定義
Code review 會在你的 PR 上自動跑一次審查,挑出問題、標上嚴重度,還能回覆、評分每個發現。如果要更深入,有 ultrareview——它在雲端用「多個代理」一起做更全面的審查。簡單說:一個是日常 PR 的自動把關,一個是大改動時的重裝武器。
### 4 例子 / demo
新聞小助手要正式上 repo 了。開個 PR,Code review 自動跑,標出:這段沒處理錯誤、那段命名不一致——你一條條看、修掉,品質就穩了。大重構時改用 /code-review ultra 跑更深的。
### 5 下一步
品質把關完成,第六章結束!下一站第 29 號,進最後一章:挑對「模型」省力又省錢。
### 6 結尾 CTA
第 28 站打勾,第六章完成!訂閱進「模型與成本」章。來源:官方 code-review,連結在描述。

## Demo 腳本(畫面)
- 你在這:節點 28 高亮、25–27 打勾,F 類整欄亮起;虛線到節點 25。
- 定義:PR 畫面上逐條 inline 評論 + 嚴重度標籤;ultrareview 多代理雲端圖示。
- demo:開 PR → 自動審查回 3 條 finding(嚴重度色標)→ 逐條修。
- 下一步:鏡頭滑向 G 類節點 29。

## YouTube 描述(草稿)
Claude Code 的 Code Review 是什麼?它在 PR 上自動審查、標出嚴重度;ultrareview 則在雲端做更深入的多代理審查。這集幫新聞小助手的 PR 把關品質。Claude Code 新手地圖第 28 站。

⏱️ 0:00 品質怎麼把關 / 0:20 你在地圖哪站 / 0:35 Code review 與 ultrareview / 0:55 PR 自動審查示範 / 1:15 下一章:模型與成本

❓FAQ
Q:Code review 跟 Security review 差在哪?A:後者專看漏洞,前者看整體程式品質與正確性。
Q:ultrareview 是什麼?A:雲端多代理的深度審查,適合大改動。

🔗 https://code.claude.com/docs/en/code-review
#ClaudeCode #codereview

## VO cues
| cue | 文字 |
|---|---|
| e28-hook1 | 安全掃過了,那程式品質呢?讓 Claude 幫你做 code review。 |
| e28-here1 | 地圖第 28 站,「安全與品質」這章最後一站,一樣是上線前把關。 |
| e28-def1 | Code review 會在你的 PR 上自動跑一次審查,挑出問題、標上嚴重度,還能回覆、評分每個發現。 |
| e28-def2 | 要更深入,有 ultrareview,它在雲端用多個代理一起做更全面的審查。一個是日常 PR 的自動把關,一個是大改動時的重裝武器。 |
| e28-demo1 | 新聞小助手要正式上 repo 了。開個 PR,Code review 自動跑,標出:這段沒處理錯誤、那段命名不一致。 |
| e28-demo2 | 你一條條看、修掉,品質就穩了。大重構時改用 /code-review ultra 跑更深的。 |
| e28-next1 | 品質把關完成,第六章結束!下一站第 29 號,進最後一章:挑對模型省力又省錢。 |
| e28-cta1 | 第 28 站打勾,第六章完成!訂閱進模型與成本章。來源:官方 code-review。 |
