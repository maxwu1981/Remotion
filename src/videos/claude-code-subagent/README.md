# claude-code-subagent — 風格 B 打樣片（「Claude Code 實戰」系列首集）

資料驅動：複用 `_explainer` 引擎（`spec.json` + `vo.json`），封面用本資料夾的 `Thumb.tsx`（風格 B、曉晴門面）。

## 角度（重要）

本片走**誠實實測**路線（不是「並行一定快」的俗套）。所有數字為**真實量測**（2026-06-22，
示範專案 `~/cc-subagent-demo` ShopFlow，5 模組）：

- 小任務（5 模組 × ~10 行）：序列 41s、並行 51s → **並行反而慢 24%**
- 重任務（56 檔 × 1547 行）：序列 126s、並行 52s → **並行省 59%**

內容＝真的開 5 個 subagent 跑（路線 A：真跑→Remotion 乾淨重演，非截圖；因沙箱無法截你的螢幕）。

## 檔案

| 檔 | 作用 | 狀態 |
|---|---|---|
| `spec.json` | 7 場結構＋旁白腳本（真實數字＋5 路真實發現） | ✅ 算繪驗證 |
| `Thumb.tsx` | 風格 B 封面（1280×720），曉晴已接 `public/thumb/sunny.png` | ✅ |
| `vo.json` | 旁白實測秒數 `{cueId: seconds}`。**現在空的** → 無音檔、帶字幕乾淨算繪 | ⏳ 待錄旁白回填 |
| `meta.md` | GEO：標題 A/B、描述＋章節、tags、JSON-LD（全真數字） | ✅ |

## 還沒做（收工前）

1. **旁白**：每個 cue 生一支 mp3 到 `public/vo/claude-code-subagent/<cueId>.mp3`（曉晴音色），
   量測秒數寫進 `vo.json`。cue ids：`cv1–3 · s1–4 · p1–5 · f1–3 · cm1–6 · hw1–4 · o1–6`。
2. **章節時間戳**：算繪後把 `meta.md` 的 `00:00` 換成實際時間。
3. （可選）**每集換曉晴表情**：從 `~/Downloads/AI-Sunny2.png` 表情表取對應格、同法去背換 `sunny.png`。

## 算繪 / 收工

- Studio 預覽：`npm run dev` → `ClaudeCodeSubagent` / `ClaudeCodeSubagentThumb`。
- QA gate：`node scripts/qa-video.mjs` ＋ 前 3 秒有鉤子、結尾有 CTA、無抖動、字幕同步。
- 產線：橫版 Master → 9:16 Reel（`--concurrency=2`）→ 算繪留 `out/` → YouTube **unlisted**（發公開前先問）→ 設縮圖。

## 待辦（全套設計系統統一，follow-up）

片內開場 cover 仍用 `_explainer` 既有樣式；風格 B（亮背＋曉晴）尚未統一進片內，屬「重新統一整套設計系統」的後續，打樣完再做。

## 示範專案

`~/cc-subagent-demo`（ShopFlow，5 模組各埋真實問題）——重算或要重現實測時用得到。
