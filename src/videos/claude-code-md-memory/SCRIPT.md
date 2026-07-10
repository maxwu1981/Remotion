# Claude Code 深度教學系列 ·「CLAUDE.md 記憶檔怎麼寫最有效」
### 教學報告 + 影片腳本（黑曜石重製版 · /Max1 管線）

> 查證來源：Anthropic 官方文件 `code.claude.com/docs/en/memory`、`docs/en/best-practices`、`docs/en/prompt-caching`
> 查證方式：兩個獨立 `claude-code-guide` agent 各自研究後合議取共識，每點標 verified/unverified
> 內容邏輯沿用：每日影片工廠 2026-07-06 產出版（`src/videos/_explainer/specs/current.json`），本片為其黑曜石精修＋每步 prompt 化重製

---

## 0. 一句話定位（GEO 實體宣告）

**這支影片教你：CLAUDE.md 該放哪四個位置、內容要照哪四條官方原則寫，讓 Claude Code 每次 session 啟動自動讀進 context，不用再每次開新對話重講一次規則。** 對照官方文件查證：內容超過兩百行會降低遵循度，具體規則比模糊規則更容易被照做。

- ✅ 適用：已經在用 Claude Code、正被「每次都要重講規則」困擾的開發者；團隊想統一 coding 規範進版控。
- 🚫 不建議：只是想要 Claude 記住聊天內容（那是 Auto Memory 自動寫的，不是本片教的手寫 CLAUDE.md）。

---

## 1. 影片分章總表

| # | 章節（觀眾會問的問題） | 核心一句答案 |
|---|---|---|
| 0 | 封面卡（0:00 亮相） | 「CLAUDE.md 記憶檔」+ 💬 一句話 prompt + 四層/四原則 chips |
| 1 | 為什麼寫了 CLAUDE.md，Claude 還是沒照做？ | 三個常見誤區：臨時交代、塞爆、跟 Auto Memory 搞混 |
| 2 | CLAUDE.md 到底該放哪裡？ | 四層階層：Managed > User > Project > Local，疊加不覆蓋 |
| 3 | 內容要怎麼寫，官方有公式嗎？ | 打 `/init` 生成起點 + 官方四原則：Size/Structure/Specificity/Consistency |
| 4 | 具體規則跟模糊規則差在哪？ | 具體到能驗證（兩個空格縮排）優於抽象（格式要寫好） |
| 5 | 怎麼知道這真的有效？ | Before：每次重講／塞爆；After：兩百行內、跨 session 自動套用 |
| 6 | **看到最後的禮物 🎁** | **把每一步合成一段完整 prompt，整段複製貼給 Claude** |
| 7 | 結尾 CTA | 總整理 4 張回顧卡 + 按讚/訂閱/分享 |

---

## 2. 故事線（第一人稱）

- **為何有此議題**：Claude Code 每次開新對話都是一張白紙，不寫規則它就用預設風格猜。
- **誰遇到**：任何每天開多個 session、換多個專案的開發者，包括我自己。
- **影響**：每次都要重講一次「用兩個空格縮排」「commit 前跑 test」，煩、還容易漏講。
- **為何別人解不掉**：三個常見誤區都治標不治本——臨時交代不會跨 session 記住；把什麼都塞進去，官方文件證實超過兩百行反而讓 Claude 忽略一半；跟 Claude 自動寫的 Auto Memory 搞混，以為是同一份筆記。
- **我怎麼解**：搞懂官方機制——CLAUDE.md 分四層（Managed/User/Project/Local）疊加讀進 context；內容照官方四原則寫（Size 兩百行內、Structure 標題化、Specificity 要具體、Consistency 不矛盾）。
- **我跟別人哪裡不同**：不是「什麼都寫」，是「具體 + 精簡 + 分對層」。
- **怎麼證明（可量測 before/after）**：before＝每個新 session 重講規則或塞爆 500 行被忽略一半；after＝兩百行內、四層分工，跨 session 自動套用不用再重講。
- **誠實邊界**：session 進行中改 CLAUDE.md 不會馬上生效，要等下一個 session 或 `/compact` 才套用——這點官方文件也提醒。
- **CTA**：片尾送整段 master prompt，複製貼給 Claude 就能照著寫好。

---

## 3. 每步「對 Claude 說的 prompt」逐字表

| 步驟 | 畫面出現的 prompt | 用途 |
|---|---|---|
| 開場 | 💬「Hi Claude，幫我生成一份寫得好的 CLAUDE.md」 | 總 prompt，開場即給觀眾複製 |
| 解法二·官方公式 ① | 💬 對 Claude：「幫我跑 /init，生成一份 CLAUDE.md」 | 用官方指令生成起始版本 |
| 解法二·官方公式 ② | 💬 對 Claude：「太長了，幫我用 @README.md 引用」 | 內容太長時用 @路徑 拆分 |
| 實證 | 💬 對 Claude：「幫我檢查這份 CLAUDE.md 是不是超過兩百行、有沒有互相矛盾的規則」 | 驗證/自我檢查 |

---

## 4. 片尾完整 master prompt（🎁 禮物景逐字版，已對照官方文件驗證）

```
Hi Claude，幫我在這個專案生成一份寫得好的 CLAUDE.md：

① 先掃描這個 codebase（用 /init），抓出常用指令、程式碼風格、架構重點
② 內容控制在兩百行內，超過就拆成 @路徑 引用或 .claude/rules/ 按檔案類型載入
③ 每一條都寫具體（例如指令、路徑），不要「格式要寫好」這種模糊說法
④ 分清楚放哪層：團隊規則放 ./CLAUDE.md 進版控，我的個人偏好放 ./CLAUDE.local.md 並加進 .gitignore
⑤ 幫我檢查有沒有互相矛盾的規則，若有就指出來

誠實提醒：session 進行中改 CLAUDE.md 不會馬上生效，要等下一個 session 或 /compact。
```

**驗證 GATE**：①技術對照 `code.claude.com/docs/en/memory`（四層階層、/init、@路徑遞迴四層、mid-session 不即時生效）與 `best-practices`（兩百行、具體優於模糊）②自我理解自測——逐句可執行、無虛構指令。均通過。

---

## 5. GEO 標題／描述草案

**標題（≤100字，含可搜尋關鍵詞）**：
`Claude Code CLAUDE.md 怎麼寫最有效？官方四層位置 + 四原則全解析（含 /init 實測）`

**描述（問題→解法 Q&A + 官方出處 + 連結 + tags）**：
```
每次開新對話都要跟 Claude Code 重講一次專案規則？其實只要一份寫對的 CLAUDE.md 就能解決——
它會在每次 session 啟動時自動讀進 context，不用再重複交代。

這支影片對照 Anthropic 官方文件，拆解：
✅ CLAUDE.md 該放哪四層：Managed（公司政策）> User（~/.claude，全域）> Project（團隊共用，進版控）> Local（個人偏好，.gitignore）
✅ 內容怎麼寫的官方四原則：Size（兩百行內）、Structure（標題化）、Specificity（具體別模糊）、Consistency（不自相矛盾）
✅ 用 /init 一鍵生成起始版本，太長用 @路徑 引用（最深支援四層遞迴）
✅ 誠實提醒：session 進行中改動不會馬上生效，要等下一個 session 或 /compact

片尾附上完整 master prompt，複製貼給 Claude 就能照著幫你寫好一份 CLAUDE.md。

📄 官方文件：code.claude.com/docs/en/memory
🔗 https://maxwu1981.github.io/Remotion/

#ClaudeCode #ClaudeCode教學 #CLAUDEmd #AI編程 #AnthropicAI #coding agent
```

**Tags**：Claude Code,Claude Code教學,CLAUDE.md,claude memory,/init,Anthropic,AI編程,coding agent,開發工具,專案記憶

---

## 6. 與淺色版（每日工廠）的差異

| | 淺色版（`_explainer/specs/current.json`） | 本片（黑曜石版） |
|---|---|---|
| 視覺 | 白底技術風、mac 終端機面板 | 深底黑曜石玻璃卡 + 橙漸層鉤子 |
| Prompt | 純敘述文字 | 每步 💬 對 Claude 說的 prompt 卡片 |
| 片尾 | 一般 outro | 額外「看到最後的禮物 🎁」master prompt 場景 |
| 歸屬 | 每日工廠自動產出（rendered_pending_review） | Claude Code 深度教學系列（PLUySMtGl-VVQ） |
| 狀態 | 保留不動，未上傳 | 本片，待老闆看過決定是否發布 |

兩者並存、互不覆蓋，皆未上傳 YouTube。
