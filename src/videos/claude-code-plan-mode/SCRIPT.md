# Claude Code Plan Mode——「新手知道一下比較好的名詞」EP07 逐句旁白稿 + Prompt 逐字表

內容來源：每日影片工廠 2026-07-03 雙 agent 合議 brief（對照 code.claude.com/docs/en/permission-modes.md + ultraplan 查證）
＋ 3 則真實 GitHub issue 抱怨（#38978 / #33126 / #1900）＋ Anthropic 官方工程部落格 93% 核准率數據。
視覺＝黑曜石高級感精修版（比照生活應用 EP01 / 實戰自動化 EP01）。

## 逐句旁白稿（編號＝cue id，要改直接說「sa2 改成…」）

### 封面卡（無旁白，0:00 閃卡）
Claude Code ✕ Plan Mode — 終結核准疲勞 — 先看完整計畫，一次決定

### 鉤子（cv1-cv3）
- cv1　如果你用 Claude Code 改大範圍的程式碼，被跳出來的核准框轟炸過，這支就是要解決這件事。
- cv2　我把「先看完整份計畫、一次決定」這招找出來，取代那種一直按核准的日子。
- cv3　先說清楚：這個困擾，真的不是只有你。

### 真實抱怨牆（na1-na6）
- na1　我上網查了 GitHub 上真實回報，發現這個痛，一個接一個。
- na2　有人說，明明開了「編輯前先問」，Claude 還是直接改了檔案，設定重來、登出登入都沒用，卡了兩個多禮拜。（來源：GitHub issue #38978，queenkjuul）
- na3　有人說，他只是問一句「為什麼分頁沒有頁碼」，結果被當成編輯指令，二十幾次工具呼叫直接改了好幾個檔案。（來源：GitHub issue #33126，r2h0714）
- na4　有人說，工作樹明明乾淨，還是每次都要手動按允許，很麻煩。（來源：GitHub issue #1900，emschwartz）
- na5　連 Anthropic 自己的工程部落格都承認，使用者平均核准了 93% 的權限提示——多半是按到疲乏，沒真的在看。（來源：Anthropic「How we built Claude Code auto mode」）
- na6　你看，同一個痛，一個接一個，蓋滿整個螢幕。

### 三招都沒真的解（fa1-fa5）
- fa1　為什麼會這樣？因為預設模式是「每一步都問」，任務一大，提示就跟著暴增。
- fa2　第一招，硬著頭皮全部按核准，改到後面根本沒在看，就是前面那 93% 的由來。
- fa3　第二招，乾脆切成自動模式全部跳過，遇到真正危險的改動也來不及攔。
- fa4　第三招，把規則寫進 CLAUDE.md 交代「先問我」，但版本一有 bug，交代照樣被忽略，照樣被改。
- fa5　三招的共同死穴：不是按到疲乏、就是風險失控，要不然就是交代了也不保證有效。

### 解法：切進 Plan Mode（sa0p, sa1-sa5）
- **sa0p（💬 prompt beat，全幀 PromptCard 覆蓋）** 跟 Claude 說，幫我在 settings.json 加上 permissions 的 defaultMode 設成 plan，這樣以後一開新對話都先進 Plan Mode。
- sa1　真正的解法，是先切進 Plan Mode，讓 Claude 只能讀、不能動手。
- sa2　按 Shift+Tab，在 default、acceptEdits、plan 三種模式間切換，切到 plan 就對了。
- sa3　也可以開頭就加 --permission-mode plan，或打 /plan 加你要它規劃的內容。
- sa4　要它變成預設，在 .claude/settings.json 的 permissions 裡把 defaultMode 設成 plan。
- sa5　這段時間它只能讀檔、跑唯讀指令探索程式碼，寫檔、改檔、有副作用的指令全部先被擋下。

### 跟另外兩種比（da1-da6）
- da1　這就是 Plan Mode，跟「全部按核准」「全部自動跳過」最大的不同。
- da2　全部按核准，是把同一個決定拆成幾十次，按到最後根本沒在看。
- da3　全部自動跳過，省事，但真正危險的改動也一起被放過。
- da4　Plan Mode 是先把整份計畫攤開來，一次看完、一次決定，而不是拆成幾十次。
- da5　核准之後你還能選：轉自動執行、轉逐一核准、或送進瀏覽器版 Ultraplan，讓別人也一起看計畫再動手。
- da6　一次看清全貌、按需核准、還能多人共審，這三點，另外兩種都做不到。

### 實測佐證（pa1-pa5）
- pa1　那怎麼知道這真的有解？
- pa2　同樣一個跨十幾個檔案的重構，default 模式要按幾十次核准；plan 模式看完整份計畫，只要決定一次。
- pa3　Anthropic 自己都說，使用者平均核准 93% 的提示——這正是 Plan Mode 想解決的疲乏問題，不是我瞎講。
- pa4　而且這是官方文件寫在 permission-modes 頁面裡的正式機制，不是偏方，也沒被標記過時。
- pa5　覺得計畫還要調整，Ctrl+G 直接編輯計畫文字，或送進 Ultraplan 讓別人留言，再回來執行。

### 🎁 片尾禮物：master prompt（g1-g3）
- g1　最後，送給看到這裡的你一個禮物。
- g2　這一整段，是把前面每一步合成的一句完整指令。
- g3　暫停整段複製，貼給 Claude，它就能幫你把 Plan Mode 設定好，順便教你怎麼用。

### 總整理（o1-o6）
- o1　快速總整理。
- o2　痛點：預設模式逐步核准按到疲乏，bug 甚至讓「先問我」照樣被略過，而且不是只有你。
- o3　解法：Shift+Tab 或 --permission-mode plan 切進 Plan Mode，唯讀先出計畫，看完整份再決定。
- o4　跟全部按核准、全部自動跳過的差別，是一次看全貌、按需核准、可送 Ultraplan 多人共審。
- o5　官方內建機制：docs 裡的 permission-modes 正式功能，不是過時、也不是偏方。
- o6　下次大改動前，先切 Plan Mode 看一次計畫吧。覺得有用，記得按讚、訂閱、分享，我們下次見！

---

## 每章 Gemini 生成配圖（7 張，白底+黑曜石玻璃+暖橙光+近正面 15° 微傾+無文字，同小紅書 EP01 風格家族）

1. ch1 hook — 核准框轟炸的焦慮感 → 一盞燈泡的平靜
2. ch2 complaints — GitHub 討論串 / issue 列表意象
3. ch3 failed — 三條分岔路都走不通
4. ch4 solution — 終端機打開一份唯讀計畫
5. ch5 compare — 天平兩端：雜亂核准框 vs 一份乾淨計畫
6. ch6 proof — 官方文件頁面 + 對勾
7. ch7 outro/gift — 禮物盒 + 一句完整指令

---

## Prompt 逐字表（tutorial-video-show-claude-prompts；兩關驗證：①技術正確對照 code.claude.com/docs/en/permission-modes.md + ultraplan ②自我理解自測——通讀一遍，每步無歧義、資訊完整、可直接執行）

**動作步驟 prompt（solution 景，sa0p）**：
> 幫我在 .claude/settings.json 裡加上 permissions.defaultMode 設成 plan，這樣以後一開新對話都先進 Plan Mode，唯讀先出計畫，不會直接動手改檔案

**片尾完整 master prompt（逐字，YouTube 描述第一行也放這段）**：
> Hi Claude，我想在改動範圍比較大的時候，先看到你完整的計畫再決定要不要執行，不要每一步都跳出來問我。請幫我：
> ① 檢查這個專案根目錄有沒有 .claude/settings.json，沒有就幫我建一個
> ② 在裡面加上 permissions.defaultMode 設成 plan，讓這個專案以後一開新對話就自動先進 Plan Mode（唯讀、只出計畫不動手）
> ③ 跟我解釋清楚：如果我只想針對「這一件事」單獨規劃，可以直接打 /plan 加上我要做的事，例如 /plan 幫我重構 API 路由；不想每次都預設 plan 的話，也可以用 Shift+Tab 在 default、acceptEdits、plan 三種模式間手動切換
> ④ 提醒我：你出完計畫後，我會看到幾個選項——核准並自動執行、核准但每個編輯都給我看、或繼續調整計畫；想直接改計畫內容，教我用 Ctrl+G 打開編輯器
> ⑤ 全部設定完，幫我確認 settings.json 是正確的 JSON 格式，沒有語法錯誤

---

## GEO 上片資料

**標題**（≤100 字，不含 `< >`）：
Claude Code Plan Mode 完整教學：先看計畫、一次決定，終結核准按到手軟（對照官方文件，含可直接複製的 Claude 指令）

**描述**（第一行放完整 master prompt 逐字版，供 AI 答案引擎與觀眾直接複製）：
```
📋 完整指令（複製貼給 Claude 就能幫你設定好 Plan Mode）：
Hi Claude，我想在改動範圍比較大的時候，先看到你完整的計畫再決定要不要執行，不要每一步都跳出來問我。請幫我：① 檢查這個專案根目錄有沒有 .claude/settings.json，沒有就幫我建一個 ② 在裡面加上 permissions.defaultMode 設成 plan，讓這個專案以後一開新對話就自動先進 Plan Mode（唯讀、只出計畫不動手） ③ 跟我解釋清楚：如果我只想針對「這一件事」單獨規劃，可以直接打 /plan 加上我要做的事，例如 /plan 幫我重構 API 路由；不想每次都預設 plan 的話，也可以用 Shift+Tab 在 default、acceptEdits、plan 三種模式間手動切換 ④ 提醒我：你出完計畫後，我會看到幾個選項——核准並自動執行、核准但每個編輯都給我看、或繼續調整計畫；想直接改計畫內容，教我用 Ctrl+G 打開編輯器 ⑤ 全部設定完，幫我確認 settings.json 是正確的 JSON 格式，沒有語法錯誤

Claude Code 預設模式什麼都要你按核准，改大範圍程式碼時被跳出來的核准框轟炸？這支影片示範怎麼用 Plan Mode（規劃模式）先看完整份計畫、一次決定，取代一次次按核准的疲勞。

Q1: 為什麼 Claude Code 常常要你一直按核准？
A: 預設模式（default）是「每一步都問」，任務一大，提示就跟著暴增。Anthropic 自己的工程部落格也承認，使用者平均核准了 93% 的權限提示——多半是按到疲乏、沒真的在看。適用場景：想知道為什麼自己也覺得「按到手軟」。

Q2: Plan Mode 跟直接按核准、切自動模式有什麼不同？
A: Plan Mode 讓 Claude 只能讀檔、跑唯讀指令，不能寫檔或執行有副作用的動作，先產出一份完整計畫給你一次看完、一次決定，而不是拆成幾十次核准；核准後你還能選轉自動執行、逐一核准、或送進瀏覽器版 Ultraplan 讓別人一起審查。適用場景：大型重構、不熟悉的專案、危險的資料庫遷移前。不建議場景：一兩行的小修正、快速反覆迭代。

Q3: 怎麼切進 Plan Mode？
A: 三種方式：按 Shift+Tab 在 default / acceptEdits / plan 間循環、啟動時加 --permission-mode plan、或打 /plan 你要規劃的內容；要設成預設，在 .claude/settings.json 的 permissions.defaultMode 設成 "plan"。

參考官方文件：
🔗 https://code.claude.com/docs/en/permission-modes.md
🔗 https://code.claude.com/docs/en/ultraplan

🔗 更多影片：https://maxwu1981.github.io/Remotion/

#ClaudeCode #PlanMode #AnthropicClaude #AICoding #權限模式
```

**標籤**：Claude Code, Plan Mode, Anthropic, AI coding, permission modes, 規劃模式, Claude AI, 權限管理

**播放清單**：新手知道一下比較好的名詞 `PL4hZLWNunGZ2oQROJ3r4eKHZwmffTsd3Q`（EP07）
