---
name: veo-reel
description: |
  用 Google Flow(Veo 3.1) 生 AI 影片片段 → Remotion 串成片。
  適用：要做「真實 AI 生成畫面」的短影音(3D/實拍風角色或場景，跟程式化動畫不同)，
  例如吉祥物情境片、產品演示、概念短片。觸發詞：「用 Flow/Veo 生影片」「Veo 串成片」
  「拿 AI 影片片段做 reel」「gemini 生影片再用 remotion 接」。
  跑通的範本＝src/videos/gemini-poc(「AI 小幫手 Little Helper」)，照它複製改。
allowed-tools: Bash(node scripts/make-vo-*.mjs) Bash(npx remotion*) Bash(ffmpeg*) Bash(ffprobe*) Bash(cp*) Bash(ls*) Bash(open*)
---

# veo-reel — Google Flow(Veo 3.1) 生 clip → Remotion 串成片

工作目錄 `/Users/maxwu/Remotion`。範本＝`src/videos/gemini-poc/`（2026-06-25 跑通的 PoC）。
全程繁中＋技術詞英文、套 GEO、收工前過 QA（見記憶 [[video-qa-gate]]）。
完整背景＆狀態在記憶 `gemini-flow-veo-video.md`、計畫 `~/.claude/plans/gemini-playwrite-gemini-adaptive-emerson.md`。

## 0. 先問主題＋規格（鐵則，CLAUDE.md §6）
用 **AskUserQuestion 可點選選項**問老闆：主題、角色/場景、比例(預設 9:16)、大概長度。別自己默默選。

## 1. 分鏡 spec（資料驅動，過稿才生）
仿 `src/videos/gemini-poc/storyboard.ts`：每 shot `{ id, motionPromptEn(英文運鏡), voCue, targetSec, status, note }` + `script`(cue→中文旁白) + `masterPrompt`。
- **提示詞一律英文**；畫面內不放中文(會亂碼)，中文走 Remotion 字幕。
- **長度不綁死 8s**：Veo 單次≈8s，逐 shot 判斷；要長連續鏡頭才用 Flow extend(時間軸右端「＋」)。PoC 多半原生 8s 就夠。
- **先把逐句中文旁白給老闆過稿**再生影片。

### 1a. 寫 motionPromptEn 的方法論（鐵則：別只寫「一個動作＋一個運鏡」）
> 之前分鏡「太簡單」＝每鏡只剩動作，缺鏡頭語言。每個 `motionPromptEn` **逐鏡跑這七軸**，缺的補上；後備方法論見記憶 [[video-storyboard-methodology]]。

**電影分鏡七軸（逐鏡填）：**
1. **景別 Shot size** — establishing/wide(全景) → medium(中景) → close-up(特寫) → extreme close(大特寫)。**整支至少要有景別變化**，別全部中景；情緒高點用越近的景別。
2. **運鏡 Camera move** — push-in/pull-out(推/拉)、orbit/arc(環繞)、pan/tilt(橫/直搖)、tracking(跟拍)、static lock-off(固定)。**一鏡只給一個主運鏡**，別堆兩個。
3. **光線 Lighting** — key light 方向＋暖/冷＋鏡內是否有光變(如螢幕亮起把臉打亮)。**跨鏡光線基調要一致**。
4. **構圖 Composition** — 主體位置(三分法)、前景/背景層次；**9:16 主體放上 2/3、下 1/3 留給字幕**，別壓到底。
5. **主體動作三拍 Action beats** — 把 8s 拆 **起→中→收**(進場動作→核心動作→收尾定格)，別只寫一個動作。
6. **連戲 Continuity** — 視線/螢幕方向(screen direction)跨鏡一致、上鏡結尾接下鏡開頭、情緒遞進；取捨用 Murch 六法則(情緒>故事>節奏>視線>2D軸線>3D空間)。
7. **一致性錨點 Consistency anchor** — 每鏡**必附 Flow 角色實體**＋prompt 開頭重述 `keeping its design identical (...具體設計...)`。文字點名會飄(§2)。

**英文 prompt 組裝順序：**
`[主體 + identical design lock] → [景別/構圖] → [動作三拍 Beat1/2/3] → [主運鏡] → [光線/情緒] → [風格 tag]`

**before→after（拿 gemini-poc s1 示範升級）：**
- ✗ 太簡單：`Animate the Little Helper, keeping its design identical. It looks at camera, blinks, gives a wave. Gentle slow push-in.`
- ✅ 七軸：`Animate this exact Little Helper desk robot, keeping its design identical (rounded white glossy egg body, single cyan screen-face, two floating arms, orange accent strip). Medium close-up, robot in the upper two-thirds, lower third clear for captions. Beat 1: sits idle, screen-face dim. Beat 2: screen-face brightens to warm cyan as it boots, eyes blink open. Beat 3: a cheerful little wave with one floating arm and a happy head-tilt. Camera: slow gentle push-in. Light: warm key from front-left, cool cyan rim from the screen glow rising mid-shot. Smooth cinematic 3D Pixar animation.`

## 2. 在 Flow 生 clip（Chrome MCP 駕駛，老闆保持登入）
接 Browser 1(`list_connected_browsers`→`select_browser` deviceId `21089397-3fc4-402f-b208-4e73dc8f3339`)→ navigate 到 Flow 專案。
設定：Veo 3.1 Fast / 目標比例 / x2 / 「生成前先确认: 始终」。每支 Fast 8s ≈ 20 點(x2=40)。

**鎖一致性（最關鍵）＝把 Flow「角色實體」當參考附進提示**，光用文字點名 Veo 會飄：
1. 先在 Flow 建好一個角色實體（「角色」分頁；或用既有的）。**建角色實體的 prompt 別用 "reference / character sheet" 字眼 → Nano Banana 會把標籤英文字烘進角色圖、甚至漏進後面的影片 take；改用「clean front-facing portrait, plain neutral background, no text」。本機圖直傳進不去 → 用既有 Flow 專案裡的現成圖、或 cp 到 Google Drive 再「從雲端硬碟添加」當參考。**
2. 每個 shot：composer 左下「**+**」→ 媒體選擇器選「<角色> 人物」→「**添加到提示**」(composer 出現帶人物 icon 的 chip)。
3. 打英文運鏡提示(措辭：`Animate this exact <Name>, keeping its design identical (...同設計細節...). <動作>. <運鏡>. Smooth cinematic 3D animation.`) → 送出。
4. agent 跳「I'm going to generate 2 videos…」。**若沒跟著跳「批准」按鈕就停住 → 在輸入框補一句 `Yes, please generate the 2 videos now.` nudge**，才會出確認(設定是先確認)。→ 點「批准」。
5. 等 ~1–2 分鐘(輪詢截圖看 8%→100%)。**偶爾整批 take 顯示「失敗」(Veo 隨機) → 確認有附角色實體後重送即可。**

## 3. 挑 take + 下載（每 shot 取一個好 take）
**（2026-06-25 修正：Chrome MCP 無 hover／`mouse_move` → 文件原本的「hover→右上⋮ kebab」走不通。）穩的下載＝點「素材庫 tile」新開編輯器 → 等 ~3s 載好(時間軸/預覽出來) → 右上下載鈕(↓)按一次**，自動落 `~/Downloads/`、無解析度選單(Veo Fast 原生 720p；1080p/4K 才是 upscale)。
- ⚠️ 用「編輯器頂部縮圖條」切換的 clip、或還沒載好就點的 clip，下載鈕不靈/掉描述檔名 → 一律從素材庫 tile 新開。
- 檔名：新開=描述名(`<標題>_<時間>.mp4`)／重開過=`video_*.mp4`。**驗證下載 `ls -t ~/Downloads/*.mp4 | head` 看全部最新檔，別只 grep 預期名(會誤判沒下成)。**
- 視窗寬度會跳(1280/1460/1530)，下載鈕位置不同(1530寬≈1223,45／1280寬≈1023,38) → **點前先截圖確認寬度**；「back 回庫」縮圖載 10–15s，先截圖確認載好再點。
- **下載後本機抽幀驗證**(別只信縮圖)：`ffprobe` 規格 + 抽 6 幀拼 contact sheet 用 Read 看運鏡/一致性，OK 才 `cp` 進 `public/gemini-clips/<片名>/shots/sN.mp4`。
- 全部 shot 規格要一致(同 WxH/fps/8s)。

## 4. 旁白（edge-tts 曉晴）
仿 `scripts/make-vo-gemini-poc.mjs`：edge-tts `zh-TW-HsiaoChenNeural` → `public/vo/<片名>/<id>.mp3` + 量秒數寫 `<片名>.vo.json`。
注意 [[edge-tts-spaced-acronym-bug]]：字母前用逗號/空格，不用全形冒號分號。

## 5. Remotion 串接
仿 `src/videos/gemini-poc/GeminiPoc.tsx`(1080×1920, 30fps)：
- 每 shot `<OffthreadVideo muted style={objectFit:cover 滿版}>` 放進 `<TransitionSeries>`，段間 `fade()` + `linearTiming({durationInFrames:15})`。
- 疊大字幕(HTML `<div>` + `FONT.uiCjk`，半透明底襯)、每 shot 旁白 `<Audio>`(包 `<Sequence from={16}>` 讓它在轉場後才起)、`<Audio src=bgm-crystal.mp3 volume={0.07}>`(見 [[video-bgm-crystal-piano]])。
- 總長 = shots×CLIP − (shots−1)×XFADE。
- 在 `src/Root.tsx` 註冊 `<Composition id="..." width={1080} height={1920} fps={30}/>`。

## 6. 算繪（背景跑，輸出留本機）
`mkdir -p out/youtube-videos/<片名>/` → 9:16 reel 加 `--concurrency=2`：
`npx remotion render <id> out/youtube-videos/<片名>/<片名>-v1.mp4 --concurrency=2`(背景跑+輪詢 log；>10 分用 daemon 見 [[long-render-detach]])。版本遞增不覆蓋([[video-output-versioning]])。輸出**留本機 out/**，不交付 Drive。

## 7. QA（沒過不算 done）
`ffprobe` 驗 WxH/長度/音軌；成片抽各 shot 代表幀拼 contact sheet 確認串接/字幕中文正確/角色一致/CTA/旁白同步。
- 抖動檢查 `scripts/qa-video.mjs`：**整片是 OffthreadVideo 實拍 + HTML 字幕時不適用**(相鄰幀本來就動、HTML 字幕逐幀像素穩)，可略過並說明，別硬跑。
- 封面 0:00 亮相 + 正式 outro CTA：依 CLAUDE.md §6 是**公開發佈前**必補(PoC 可暫緩，但要講明)。

## 8. 交付/上傳（等老闆點頭）
給老闆看成片(`open out/.../*.mp4`)→ 要公開才補封面/outro、寫 GEO 標題說明、走既有上傳管線([[youtube-upload-pipeline]] unlisted 先行)。
