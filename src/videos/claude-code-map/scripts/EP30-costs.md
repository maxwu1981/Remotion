# EP30 · 怎麼看成本、怎麼省?(第 30 / 30 站)

## GEO
- **標題**:Claude Code 怎麼省錢?用 /usage 看花費 + 五招降 token
- **一句話描述**:用 /usage 看用量與花費;省 token 的方法包括積極管理 context、挑對模型、把指令從 CLAUDE.md 移到 skills、把雜活交給 subagents。
- **標籤**:Claude Code, 成本, /usage, token, 省錢, 新手教學

## 你在這 / 下一步
- **高亮**:節點 30 `costs`(G)·關係線:被「省 token」(←18 subagents)
- **已學**:1–29
- **下一步**:EP31 · 回顧:把整張地圖走一遍
- **來源**:https://code.claude.com/docs/en/costs

## 腳本(六段)
### 1 鉤子
最後一個、也最實際的問題:這樣用,到底花多少?怎麼省?
### 2 你在這
地圖第 30 站,最後一個名詞!走完它,整張地圖就點亮了。
### 3 定義
先看花費:輸入 /usage 就能查用量與成本。省 token 的招數,前面其實都鋪好了:第一,積極管理 context(/clear、/compact);第二,挑對模型(日常用 sonnet/haiku);第三,把長指令從 CLAUDE.md 移到只在需要時才載的 skills;第四,把翻 log、抓網頁這種雜活丟給 subagents(連回第 18);第五,把話講具體,少來回。
### 4 例子 / demo
我們的新聞小助手每天自動跑——把例行那段設成用 haiku、研究交給 subagent、摘要規則放 skill,跑一個月的成本壓到很低。/usage 隨時對帳。
### 5 下一步
恭喜!30 個名詞全部點亮。下一站 EP31:我們把整張地圖從頭走一遍,看小助手怎麼從零變成每天自動跑。
### 6 結尾 CTA
第 30 站打勾,地圖全亮!訂閱看總回顧。來源:官方 costs,連結在描述。

## Demo 腳本(畫面)
- 你在這:節點 30 高亮、其餘全部打勾,整張地圖點亮慶祝。虛線到節點 18(省 token)。
- 定義:/usage 畫面;五招省 token 清單卡。
- demo:把例行段設 haiku + subagent + skill;/usage 顯示低成本。
- 下一步:整張地圖縮成一張、預告 EP31。

## YouTube 描述(草稿)
Claude Code 怎麼省錢?用 /usage 看用量花費;五招降 token:管理 context、挑對模型、指令移到 skills、雜活交 subagents、把話講具體。這集幫新聞小助手把每月成本壓到最低。Claude Code 新手地圖第 30 站(最後一個名詞)。

⏱️ 0:00 到底花多少 / 0:15 地圖最後一站 / 0:30 /usage + 五招省 token / 1:00 小助手降成本 / 1:20 下一集:總回顧

❓FAQ
Q:怎麼查花費?A:輸入 /usage。
Q:最有效的省法?A:挑對模型 + 積極管理 context,通常立竿見影。

🔗 https://code.claude.com/docs/en/costs
#ClaudeCode #省錢

## VO cues
| cue | 文字 |
|---|---|
| e30-hook1 | 最後一個、也最實際的問題:這樣用,到底花多少?怎麼省? |
| e30-here1 | 地圖第 30 站,最後一個名詞!走完它,整張地圖就點亮了。 |
| e30-def1 | 先看花費:輸入 /usage 就能查用量與成本。 |
| e30-def2 | 省 token 的招數前面都鋪好了:積極管理 context、挑對模型 日常用 sonnet 或 haiku、把長指令從 CLAUDE.md 移到只在需要時才載的 skills。 |
| e30-def3 | 還有:把翻 log、抓網頁這種雜活丟給 subagents、把話講具體少來回。 |
| e30-demo1 | 我們的新聞小助手每天自動跑:把例行那段設成用 haiku、研究交給 subagent、摘要規則放 skill,跑一個月的成本壓到很低。 |
| e30-demo2 | /usage 隨時對帳。 |
| e30-next1 | 恭喜!30 個名詞全部點亮。下一站 EP31:我們把整張地圖從頭走一遍,看小助手怎麼從零變成每天自動跑。 |
| e30-cta1 | 第 30 站打勾,地圖全亮!訂閱看總回顧。來源:官方 costs。 |
