# EP27 · Security review 外掛是什麼?(第 27 / 30 站)

## GEO
- **標題**:Claude Code 怎麼自己抓漏洞?Security review 外掛邊寫邊檢查
- **一句話描述**:Security review 是官方外掛,讓 Claude 在 session 中自動審查並修正自己改動造成的漏洞(每次改檔、每回合結尾、每次提交時檢查)。
- **標籤**:Claude Code, security review, 安全審查, 漏洞, 新手教學

## 你在這 / 下一步
- **高亮**:節點 27 `security-review`(F)·關係線:部署前先跑(→25 security)
- **已學**:1–26
- **下一步**:EP28 · Code review / ultrareview
- **來源**:https://code.claude.com/docs/en/security-guidance

## 腳本(六段)
### 1 鉤子
AI 幫你寫了一堆程式,但這些 code 有沒有漏洞?讓它「自己檢查自己」。
### 2 你在這
地圖第 27 站。它的角色就是「部署前先跑一次」(連回第 25)。
### 3 定義
這是官方的 Security guidance(安全審查)外掛。裝上後,Claude 會在 session 裡自動審查、並修正它自己改動造成的漏洞——而且是分三個時機:每次改檔時、每回合結尾、每次它要提交時。等於有個資安同事,邊寫邊幫你看有沒有把金鑰寫死、有沒有危險寫法。
### 4 例子 / demo
小助手上線前,裝上這個外掛,跑一次審查。它回報:有兩個地方把 API key 寫進了程式,建議改用環境變數;一個 webhook 沒驗證。然後它直接幫你修。
### 5 下一步
自我審查有了。下一站第 28 號:更全面的 Code review,在 PR 上把關。
### 6 結尾 CTA
第 27 站打勾!訂閱繼續。來源:官方 security-guidance,連結在描述。

## Demo 腳本(畫面)
- 你在這:節點 27 高亮;虛線到節點 25(部署前先跑)。
- 定義:三個檢查時機時間軸(改檔 / 回合結尾 / 提交);資安同事圖示。
- demo:跑審查 → 回報兩個漏洞(寫死金鑰、webhook 沒驗證)→ 自動修。
- 下一步:鏡頭滑向節點 28。

## YouTube 描述(草稿)
Claude Code 怎麼自己抓漏洞?Security review(安全審查)外掛讓 Claude 在 session 中自動審查並修正自己改動造成的漏洞——每次改檔、每回合結尾、每次提交都檢查。這集幫新聞小助手上線前掃一次。Claude Code 新手地圖第 27 站。

⏱️ 0:00 你的 code 有漏洞嗎 / 0:20 部署前先跑 / 0:35 安全審查外掛是什麼 / 0:55 掃出漏洞並修 / 1:15 下一站:Code review

❓FAQ
Q:它什麼時候檢查?A:每次改檔、每回合結尾、每次提交。
Q:會自動修嗎?A:會審查並可修正自己改動造成的問題。

🔗 https://code.claude.com/docs/en/security-guidance
#ClaudeCode #securityreview

## VO cues
| cue | 文字 |
|---|---|
| e27-hook1 | AI 幫你寫了一堆程式,但這些 code 有沒有漏洞?讓它自己檢查自己。 |
| e27-here1 | 地圖第 27 站。它的角色就是部署前先跑一次。 |
| e27-def1 | 這是官方的 Security guidance 安全審查外掛。裝上後,Claude 會在 session 裡自動審查、並修正它自己改動造成的漏洞。 |
| e27-def2 | 而且分三個時機:每次改檔時、每回合結尾、每次它要提交時。等於有個資安同事,邊寫邊幫你看有沒有把金鑰寫死、有沒有危險寫法。 |
| e27-demo1 | 小助手上線前裝上這外掛、跑一次審查。它回報:兩個地方把 API key 寫進了程式,建議改用環境變數;一個 webhook 沒驗證。 |
| e27-demo2 | 然後它直接幫你修。 |
| e27-next1 | 自我審查有了。下一站第 28 號:更全面的 Code review,在 PR 上把關。 |
| e27-cta1 | 第 27 站打勾!訂閱繼續。來源:官方 security-guidance。 |
