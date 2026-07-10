# Remotion Video Studio — Ai-Wisdom 影片工廠

單一 Remotion 專案養**全部頻道影片**（40+ 支），不用每支重新 scaffold。共用積木只放一份在 `src/shared-skills/`，每支影片一個 `src/videos/<name>/` 資料夾；依賴單向 `videos/* → shared-skills/*`，絕不反向。

**完整製作流程（選題→腳本→VO→BGM→算繪→QA→上傳）見 [VIDEO-PRODUCTION.md](VIDEO-PRODUCTION.md)；硬規則見 [CLAUDE.md](CLAUDE.md) §6。**

## 專案結構

```
src/
  Root.tsx                 # 註冊所有 composition
  shared-skills/           # 共用積木：theme(design tokens+BRAND_MARK)、anim、
                           #   audio(<Bgm>/<Sfx>)、captions(CaptionTrack)、components/
  videos/
    _template/             # 新片起手式（複製這個開始，見其 README）
    _explainer/            # 資料驅動解說片引擎：吃 specs/*.json 出片、不寫 scene 程式碼
                           #   Explainer(白底) / ExplainerObsidian(黑曜石玻璃卡，現行預設)
                           #   VF-Daily comp = 每日工廠入口（讀 specs/current.json）
    <每支影片一夾>/         # Master/registry/scenes/SCRIPT.md/vo-manifest.json

scripts/                   # make-vo-<片名>.mjs(edge-tts 配音)、qa-video.mjs(QA gate)、
                           #   gen-ep-*.mjs(資料驅動 EP 工具鏈)、stills/render 雜項
automation/                # 每日影片工廠：ORCHESTRATOR.md(runbook)、scout.py(選題)、
                           #   make-vo-spec.py(通用 VO)、render_daily.py、state/(ledger)
public/                    # 素材：bgm-<片名>.mp3、vo/<片名>/、各片截圖/圖庫子資料夾
out/                       # 算繪輸出（gitignored；按主題子資料夾分類）
docs/                      # GitHub Pages 影片中心站（自動抓頻道上傳影片）
series-registry.json       # 系列/EP 編號單一事實來源（開拍前 check/reserve，上傳自動 sync）
```

## 常用指令

```bash
npm run dev        # Remotion Studio（長跑要 daemonize，見記憶 long-render-detach）
npm run tsc        # 型別檢查
npm run lint       # ESLint

# 算繪（黑曜石/深色卡風必帶防抖旗標；長片先查系統負載）
npx remotion render <CompId> out/<主題>/<片名>-v<N>.mp4 \
  --image-format=png --crf=15 --timeout=300000

# QA gate（收工前必過）
node scripts/qa-video.mjs out/<...>.mp4
```

## 新增一支影片

1. `cp -R src/videos/_template src/videos/<name>`（或資料驅動片直接寫 `_explainer/specs/<name>.json`）。
2. 開拍前：`series-registry.json` 鎖 EP 編號；片型＋主題用可點選選項跟老闆確認。
3. 建 scenes、`scripts/make-vo-<name>.mjs` 生曉晴配音、Gemini 生專屬 BGM（`public/bgm-<name>.mp3`）。
4. 在 `src/Root.tsx` 註冊 `<Composition>` → 算繪 → QA gate → 上傳。

細節與每步的鐵則、常見坑，一律以 `VIDEO-PRODUCTION.md` 與 `CLAUDE.md` §6 為準。

## 設計原則

- 動畫全部 frame-based（`useCurrentFrame` + `interpolate`/`spring`），**禁 CSS transitions**；隨機一律 Remotion 確定性 `random(seed)`。
- 中英雙語字型堆疊 `FONT.uiCjk`（Inter + Noto Sans TC）；封面品牌字樣一律用 `BRAND_MARK` 常數，不手打。
- 配音 edge-tts 曉晴（`zh-TW-HsiaoChenNeural`）；BGM 一律 Gemini Lyria 3 生水晶鋼琴調性、每支新生一首。
