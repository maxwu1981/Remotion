# 交接筆記 — git-commit-push-guide「專業教學」升級

> 這份是遠端 session 的對話記憶交接。遠端容器會被回收，所以把決策與做法寫成檔案，
> 在本地 `git pull` 後即可接手；新的 Claude session 也可直接讀這份繼續。
> 分支：`claude/remotion-workflow-versions-udjy76`

---

## 0. 目標（為什麼做這些）

把影片從「像教學」升級成「**像專業課程**」，並讓觀眾**每支看完都能挖到寶、長知識**——
帶走一份可複製、還懂原理的提示詞。用「專業知識型頻道 + 國際 YouTube 設計」的標準來做。

---

## 1. 世界級「節目骨架」（每集都照這個順序 = 品牌資產）

| 段 | 秒數 | 作用 | 要點 |
|---|---|---|---|
| 0. Hook 鉤子 | 0–3s | 痛點問句 + 承諾 | 標題出現**前**先製造張力 |
| 1. Cover 標題卡 | 3–7s | 定位 + 這集能得到什麼 | 標題 + 章節數/時長徽章 |
| 2. **Roadmap 全集地圖** | 7–12s | 先給地圖再上路 | 3–4 站縮圖，對應章節時間戳 ✅ 已做 |
| 3. 主體章節 × N | 主體 | 一章一觀念 | 每章開頭有編號徽章 01/04 |
| 4. **💎 挖寶段** | 收尾前 | 送可複製提示詞 | 見第 3 節 ✅ 已做 |
| 5. 三步驟 Recap | 10s | 壓縮成 3 條 | 現有 Outro 已做 |
| 6. Outro / CTA | 5s | 感謝 + 訂閱按讚分享 | 現有已做；可加「下集預告」 |

**排版鐵則（世界級細節）**：左對齊資訊軸線／頂部章節進度條 + 01/08 編號／一次只給一個重點
（逐個 spring 進場，不整塊 fade）／全片只用**一種**強調手法（克制）／重點卡片留白 1.5 倍／
數字與對比一定給具體值／講解慢穩、轉場與挖寶段快脆。

---

## 2. 這支片的關鍵架構（動手前必讀）

- **一片一資料夾**：`src/videos/git-commit-push-guide/`，共用元件在 `src/shared-skills/`。
- **場景註冊**：`registry.ts` 的 `SCENES[]` 陣列（順序 = 播放順序），`Master.tsx` 用
  `TransitionSeries` 串接並淡入淡出。`Root.tsx` 靠 `getGitFrames()` **自動**算長度、
  並用 `GG-${s.id}` 自動產生每場景的獨立 composition —— **加新場景不需改 Root.tsx**。
- **旁白/字幕時間軸**：
  - 台詞的唯一真相在 `script.json`（id → 中文台詞，同時被字幕與 TTS 使用）。
  - `captions.tsx` 的 `buildScene([ids])` 依 `vo-manifest.json` 的**實測秒數**排版；
    某 id **沒有**實測秒數時，自動走 `fallbackSeconds()`（captions-only 對時）。
  - **`public/vo/` 被 gitignore**（旁白 mp3 本地生成、不進版控）；`vo-manifest.json` 進版控。
  - 產生旁白：`npm run vo:git`（edge-tts，免費、需連網），會讀 `script.json` 生成每句 mp3
    到 `public/vo/git-commit-push-guide/`，並**回填** `vo-manifest.json` 讓全片重新對時。
- **設計 token**：`shared-skills/theme.ts`（`COLORS`／`FONT`／`RADIUS`／`SHADOW`／`TYPE`）。
  畫布是**淺色** `#F8F9FA`（不是黑曜石深色）；深色終端機用 `COLORS.term.*`。
- **動畫**：全 frame-based（`useCurrentFrame` + `interpolate`/`spring`），**禁 CSS transition**。
  helper 在 `shared-skills/anim.ts`（`appearUp`／`springPop`／`leave`…）。

---

## 3. 這次已完成（已 commit & push）

兩個**純新增**場景，不動既有 8 個內容場景：

### A. Roadmap 全集地圖 — `scenes/Roadmap.tsx`（插在 Cover 之後）
- 四站有編號 + 連接箭頭；第四站 💎 金色發光 +「⭐看到最後」緞帶 → 課程感 + 留人鉤子。
- 資料在 `data.ts` 的 `ROADMAP` / `ROADMAP_KEY`；台詞 `rm-c1…rm-c5`。

### B. 💎 今日提示詞 PromptGem —（挖寶段，固定欄目）`scenes/PromptGem.tsx`（插在 Outro 之前）
- 欄目名「今日提示詞 · Prompt of the Day」+ 金框標識。
- 深色終端機提示卡（等寬字、`›` 提示符、打字機動畫、`✓已複製`）→ 高對比「乾貨」。
- 三件套：**可複製提示詞** + 💡**為什麼這樣寫**（原理）+ 🔄**換個情境**（變體）。
- 底部「完整提示詞在資訊欄 · 每支影片都留一個給你 ⭐」→ 訂閱誘因 + **GEO 信號**。
- 資料在 `data.ts` 的 `GEM`；台詞 `gem-c1…gem-c6`。

### 改動檔案清單
- 新增：`scenes/Roadmap.tsx`、`scenes/PromptGem.tsx`
- 改：`data.ts`（+ROADMAP/GEM）、`script.json`（+rm-*/gem-* 台詞）、`registry.ts`（串入 SCENES）
- **未改**：`Root.tsx`（自動納入）、既有 8 個場景

### 驗證狀態
- ✅ `npm run tsc`、`eslint`（新檔）全綠。
- ✅ **實機渲染驗證過**（見第 4 節）；抓到並修好兩個無頭渲染破圖的 emoji：`🛠→🔧`、`🔖→⭐`。
- ⚠️ 目前是 captions-only fallback 對時，**還沒配音**。

---

## 4. 在受限網路 / 無頭環境的渲染方法（重要，本地也可能用到）

Remotion 預設會去 `remotion.media` 下載 Chromium；若該 host 被 egress 政策擋、或環境
已預裝瀏覽器，改用預裝的 **headless_shell**（完整版 chrome 已移除 old-headless，會啟動失敗）
＋ `--ignore-certificate-errors`（代理重簽 CA 時字型才載得下來）：

```bash
SHELL=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
# 單幀預覽（快）
npx remotion still GG-rm  out/qa/roadmap.png --frame=560 --browser-executable="$SHELL" --ignore-certificate-errors
npx remotion still GG-gem out/qa/gem.png     --frame=880 --browser-executable="$SHELL" --ignore-certificate-errors
```

> 在你本地一般環境（網路開放）通常**不需要**這些參數，直接 `npm run render:git` 即可。
> 若本地也擋，路徑中的版本號（`chromium_headless_shell-1194`）依環境調整。

**出正式帶旁白的成片**：
```bash
npm run vo:git                                   # 先補旁白，回填 vo-manifest.json 重新對時
npx remotion render GitCommitPushGuide out/git-commit-push-guide.mp4   # 需要時加上面兩個 --參數
node scripts/qa-video.mjs GG-gem 880 8 out/git-commit-push-guide.mp4   # QA gate
```

---

## 5. 下一步（依討論的優先序）

1. **（建議先做）元件化 + 升級 `_template`**：把 `Roadmap`、`PromptGem` 提煉成
   `shared-skills/components/` 可複用元件，並讓 `_template` 內建
   「Hook → Cover → Roadmap → 章節 → 挖寶 → Recap → Outro」骨架 →
   **每支新片起手就自帶世界級骨架**，把「挖到寶」變成頻道招牌欄目。
2. **鋪章節編號**：在 `components.tsx` 的 `Shell` 加 `chapter?: {n,total}` 角標
   （「章節 03 / 08」），鋪到所有內容場景，課程感更完整。
3. **微調**：金色濃度、地圖站數、挖寶段文案/版位、底部字幕與 💎chip 重複感再收。
4. **收工前**：更新 `scripts/qa-video.mjs` 檢查清單，加入「有 Roadmap／有挖寶段／章節編號」。

---

## 6. 給新 session 的一句話起手

> 讀 `src/videos/git-commit-push-guide/HANDOFF.md`。分支 `claude/remotion-workflow-versions-udjy76`
> 已完成 Roadmap + 💎PromptGem 兩場景並驗證。接著做第 5 節第 1 項（元件化 + 升級 _template）。
