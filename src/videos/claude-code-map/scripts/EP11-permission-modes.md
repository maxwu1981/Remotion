# EP11 · 權限模式有哪些?(第 11 / 30 站)

## GEO
- **標題**:Claude Code 權限模式怎麼選?從預設到 bypass 一次看懂
- **一句話描述**:用 Shift+Tab 在 Default、Auto-accept edits、Plan mode、Auto mode 之間切換;bypassPermissions 則跳過所有確認,自動化才用、要小心。
- **標籤**:Claude Code, 權限模式, permission modes, bypass, 新手教學

## 你在這 / 下一步
- **高亮**:節點 11 `permission-modes`(C)·關係線:屬於一種(←10)、安全雙保險(←13)、減少詢問(←26)
- **已學**:1–10
- **下一步**:EP12 · Context window 上下文
- **來源**:https://code.claude.com/docs/en/permissions

## 腳本(六段)
### 1 鉤子
要它「每一步都問你」還是「放手讓它跑」?這由權限模式決定。
### 2 你在這
地圖第 11 站,好幾條關係線都連到它——上一站的 Plan mode 就是其中一種。
### 3 定義
按 Shift+Tab 在四種模式間循環:Default,改檔、跑指令前都先問你;Auto-accept edits,自動接受改檔和像 mkdir 這類常見指令,其他還是會問;Plan mode,只規劃不改原始碼;Auto mode(研究預覽),用背景安全檢查評估每個動作。還有一個 bypassPermissions——跳過所有確認,只適合你完全信任、要自動跑的情境,平常別亂開。
### 4 例子 / demo
做新聞小助手:剛開始用 Default,看清楚它每一步;熟了、要它連續做,切 Auto-accept edits 加速;真的要排程無人值守(第 23 站),才考慮 bypass。
### 5 下一步
控制力到位。下一站第 12 號:它的「短期記憶」——Context window,以及滿了怎麼辦。
### 6 結尾 CTA
第 11 站打勾!訂閱繼續。來源:官方 permissions,連結在描述。

## Demo 腳本(畫面)
- 你在這:節點 11 高亮;虛線到 10、13、26。
- 定義:四模式階梯(Default → Auto-accept → Plan → Auto)+ 警示牌 bypassPermissions。
- demo:Shift+Tab 循環切換,底部狀態列文字隨之變化。
- 下一步:鏡頭滑向節點 12。

## YouTube 描述(草稿)
Claude Code 權限模式怎麼選?Shift+Tab 切 Default / Auto-accept edits / Plan mode / Auto mode;bypassPermissions 跳過所有確認、只在自動化時謹慎使用。這集教你新聞小助手各階段該用哪個。Claude Code 新手地圖第 11 站。

⏱️ 0:00 每步都問 vs 放手跑 / 0:20 你在地圖哪站 / 0:30 四種模式 + bypass / 1:00 各階段怎麼選 / 1:20 下一站:Context window

❓FAQ
Q:bypass 安全嗎?A:會跳過所有確認,只在你信任的自動化場景用。
Q:怎麼切換?A:Shift+Tab 循環。

🔗 https://code.claude.com/docs/en/permissions
#ClaudeCode #權限

## VO cues
| cue | 文字 |
|---|---|
| e11-hook1 | 要它每一步都問你,還是放手讓它跑?這由權限模式決定。 |
| e11-here1 | 地圖第 11 站,好幾條關係線都連到它,上一站的 Plan mode 就是其中一種。 |
| e11-def1 | 按 Shift+Tab 在四種模式間循環:Default,改檔、跑指令前都先問你。 |
| e11-def2 | Auto-accept edits,自動接受改檔和像 mkdir 這類常見指令,其他還是會問;Plan mode,只規劃不改原始碼;Auto mode 研究預覽,用背景安全檢查評估每個動作。 |
| e11-def3 | 還有一個 bypassPermissions,跳過所有確認,只適合你完全信任、要自動跑的情境,平常別亂開。 |
| e11-demo1 | 做新聞小助手:剛開始用 Default 看清楚每一步;熟了要它連續做,切 Auto-accept edits 加速。 |
| e11-demo2 | 真的要排程無人值守,才考慮 bypass。 |
| e11-next1 | 控制力到位。下一站第 12 號:它的短期記憶 Context window,以及滿了怎麼辦。 |
| e11-cta1 | 第 11 站打勾!訂閱繼續。來源:官方 permissions。 |
