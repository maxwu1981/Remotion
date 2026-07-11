---
name: Max1
description: |
  把一個「真實在跑的流程/工具」或「每日工廠已選好的題目」做成一支完整、可公開發布的黑曜石教學影片。
  四種起點：A 全新題材——查文檔→寫故事腳本；B 沿用每日工廠草稿——只補缺口不重寫故事弧；
  C 旗艦跟操長片——真實錄屏 30–45 分；D 每日自動草稿——06:00 排程無人值守跑的模式（原
  ORCHESTRATOR runbook A，2026-07-11 併入本 skill 當單一事實來源）。A/B/C 共用發布尾段：黑曜石視覺
  → Gemini 生 BGM → 算繪 QA → 公開發布（長片＋Short＋乾淨縮圖＋播放清單）→ 置頂留言＋GEO 外部訊號；
  D 算繪+QA 完就停等老闆說「發今天的」。
  只在我輸入 /Max1 時執行（可帶主題，如 /Max1 用 Graph API 讓 FB 自動發文；或帶 <name> 沿用某天
  每日工廠草稿，如 /Max1 claude-code-agent-view）；D 例外＝排程 task 或「跑今天的影片工廠」觸發。
  範本：全新題材＝src/videos/fb-autopost/（youtube.com/watch?v=r8DFGXc_33I）；
  沿用每日工廠草稿＝src/videos/claude-code-agent-view/（youtube.com/watch?v=CaMHeWSo4mU）。
disable-model-invocation: true
allowed-tools: Bash(python3 automation/make-vo-spec.py*) Bash(npx remotion*) Bash(ffmpeg*) Bash(ffprobe*) Bash(python3 *yt_upload.py*) Bash(python3 *yt_playlist.py*) Bash(node*) Bash(cp*) Bash(mkdir*) Bash(ls*)
---

# /Max1 — 從「真實流程」或「每日工廠草稿」到「公開發布的黑曜石教學影片」

工作目錄 `/Users/maxwu/Remotion`。**全程繁中＋技術詞英文、第一人稱、正面語氣、套 GEO。** `<name>`＝這支的 kebab-case 片名。

**開拍前先問（別默默選；D 例外——無人值守不問）**：用 AskUserQuestion 問**這支的起點是哪一種**：
- **A. 全新題材**：老闆給一個流程/工具主題，從零查文檔＋寫故事腳本（走下面①②）。
- **B. 沿用每日工廠草稿**：老闆給 `<name>`（或不給，預設當天 `current.json`），直接拿每日工廠已經選好題、寫好的 spec/vo，只做內容缺口補強，不重寫故事弧（跳過①②，從③開始）。
- **C. 旗艦跟操片（保姆級長片）**：30–45 分鐘 follow-along 教學。走 A 起點的①②，但操作段落改**真實錄屏**、加檢核點與常見卡點（見下方「跟操模式」節），黑曜石只做骨架。
- **D. 每日自動草稿（無人值守）**：排程 task `daily-video-factory`（每天 06:00）走的模式，或老闆明說「跑今天的影片工廠」。**不問任何問題直接跑**，見下方「D 起點」節——它產出的草稿就是 B 起點的輸入。

A/B/C 之後，③起完全共用同一條管線；C 額外疊加「跟操模式」規則；D 自成一節（算繪完就停，不進入共用管線後段）。

**貫穿全程的閘門（gate）**：`過稿再算繪`（B 起點沿用既有 VO 通常不用重過稿，除非有改字）· `駛瀏覽器/碰帳號先握手`（[[screen-capture-handshake]]；互動 session 內若老闆已在場明說，「有沒有登入」這句可省略，見 [[gemini-driving-skip-login-ask]]，OAuth/選帳號仍要先問）· `每句 prompt 過驗證 GATE`（[[tutorial-video-show-claude-prompts]]，A 起點才通常需要）· `算繪前查資源`（[[render-resource-check]]）· `長算 daemonize`（[[long-render-detach]]）· `版本遞增檔名`（[[video-output-versioning]]）· `輸出分子目錄`（[[out-folder-taxonomy]]）。**上傳預設停在發布前問老闆；老闆說「發」才上，且要對「這一支片」明確首肯——排程節奏的通用指示（[[youtube-publish-queue-sequential]]）不能當成單支片的上傳授權**（2026-07-08 教訓：曾把這兩者搞混，被權限層擋下）。

---

## A 起點：全新題材

### ① 查文檔（找真實實作，不憑假設）
先在 repo / 本機找「這流程真正在跑的程式」（不是文件說的、是 code 做的）。抽出**真實技術事實**：端點、參數、權限名、版本號、檔名、排程。**使用者陳述的前提先查證再相信**（CLAUDE.md §1）。範例：fb-autopost 來源＝`~/Documents/Claude/Projects/FB/` 的 jq_token_manager.py / _fb_upload_one.py / jq_fb_publish.py。

### ② 教學報告（SCRIPT.md 故事腳本）
寫 `src/videos/<name>/SCRIPT.md`：走**故事弧**（為何有此議題→誰遇到→影響→為何別人解不掉→你怎麼解→哪裡不同→怎麼證明〔可量測 before/after〕→CTA），第一人稱、真實經歷（[[video-story-script-structure]]）。分章＝每章一個「觀眾會問的問題」，答案含具體數字（[[geo-first-publishing]]）。內含：分章表、每步「對 Claude 說的 prompt」逐字表、**完整 master prompt**、GEO 標題/描述草案。接著跟 B 起點一樣走③。

---

## B 起點：沿用每日工廠草稿

### ① 找題目
給了 `<name>` → 找 `src/videos/_explainer/specs/<name>.json`（若不存在，問老闆是不是要從當天 `current.json` 複製、或先照下方 **D 起點**流程研究產一份新草稿）。沒給 → 預設抓 `src/videos/_explainer/specs/current.json` + `current.vo.json`（今天的每日工廠草稿；那份草稿的題目來源可能是 `automation/scout.py` 自動搜 Reddit/HN，也可能是老闆直接指定主題後照 D 起點研究生成——兩種來源產出的 spec 格式一樣，這裡不分別處理）。

### ② 內容夠不夠格升級成正式片
草稿已經是資料驅動 explainer（cover/places/pipeline/terminal/compare/outro 積木），內容通常已經是「問題→解法→誠實提醒」結構。快速檢查：cover 4 chip 精不精準、keyline/官方文件出處在不在、有沒有明顯內容缺口——**只補缺口，不重寫成 A 起點那種完整故事弧**。若老闆想要更深的故事包裝，改走 A 起點。

---

## C 跟操模式（旗艦保姆級長片，疊加在 A 起點流程上）

**目的**：觀眾能「跟自己螢幕逐格比對、一步步照做」。解說片（A/B）賣理解，跟操片賣「做得出來」——兩者別混。片長目標 30–45 分鐘（對標：PAPAYA 27 分 45.6 萬觀看、雷蒙三十 35 分 59.5 萬）。

- **挖題先於寫稿**：章節＝觀眾真實提問。先抓對標片留言區（YouTube MCP `getVideoComments`）聚類卡點，別從功能目錄出發。
- **操作段落＝真實錄屏，不用黑曜石重建**：
  - terminal 段：asciinema/腳本重放，全自動可錄。
  - GUI 段（瀏覽器後台、桌面 App）：**需老闆握手**（[[screen-capture-handshake]]），ffmpeg avfoundation 或 QuickTime 錄真螢幕；敏感資訊（token/個資）事後遮罩再進片。誠實邊界：這段是半自動，做不到全包。
  - 嵌入＝Remotion `OffthreadVideo`（範本 `src/videos/gemini-poc/`）。
- **黑曜石只做骨架**：章節卡、概念錨頂帶、💬 prompt 方塊、重點字卡——保留既有優勢，其餘讓位給真實畫面。
- **每步結束加「✅ 檢核點卡」**：「你現在應該看到：…」讓觀眾自我確認有沒有跟上。
- **每章加「常見卡點」段**：演 2–3 個真實錯誤畫面＋解法（觀眾按暫停去搜尋的時刻全在出錯時）。
- **旁白節奏**：關鍵操作放慢、複述一次、等畫面跑完再往下——別均速唸稿。
- **課程化三件套（得到品控手冊）**：開場 15 秒先亮成品（目標感）；每章結尾一句「這章你帶走的是…」（交付感）；片尾回收開頭的問題＋before/after 數字（總分總）。
- 其餘（VO/BGM/QA/發布/Short/置頂留言）照共用管線；master prompt 與每步 prompt 的驗證 GATE 照 [[tutorial-video-show-claude-prompts]] 不變。

---

## D 起點：每日自動草稿（無人值守，06:00 排程 task `daily-video-factory` 走這條；2026-07-11 自 ORCHESTRATOR runbook A 併入，此節＝單一事實來源）

**唯一全自動模式**：不問老闆（AskUserQuestion 全跳過）、不碰瀏覽器（**不生專屬 BGM**，共用 `bgm-piano.mp3`）、不上傳。**明確省略、升級成正式片時走 B 起點補**：專屬 BGM、每步 💬 prompt 卡、片尾 master prompt、系列編號/播放清單、置頂留言與 GEO 外部訊號。

1. **選題**：`python3 automation/scout.py`（Reddit 4 社群＋HN Algolia；寫 `automation/state/scout-<date>.json`）。picked 只是關鍵字粗篩——**親自讀 candidates 判斷**「真的可教學的技術問題」（排除發布戲劇/迷因/情緒抒發/政策時事）；無合格題 → fallback 選一個常被問、未涵蓋的 Claude 功能做詳細介紹（查 `automation/state/covered-topics.json` 去重）。
2. **雙 agent 合議**：並行 spawn 兩個 `claude-code-guide` 各自研究＋**對照官方文件查證**（docs.claude.com / code.claude.com）→ 合議「最穩」共識 brief（每點標 verified/unverified；查不到附網路他人解法當建議並註明）。
3. **寫 spec**：共識 → `src/videos/_explainer/specs/current.json`（schema＝`_explainer/schema.ts`；cover＋outro 必有、正面語氣**不用「坑」**、標題/說明**不可含 `< >`**）。旁白冒出 ≥4 個新手術語 → 順手產 `current.glossary.json` 名詞小教室片尾（欄位規則見 [[video-glossary-handson-segments]]；**不做的日子把 terms/script 重設為空，兩檔必須存在**，否則會接到昨天的名詞段）。
4. **VO**：`python3 automation/make-vo-spec.py src/videos/_explainer/specs/current.json current src/videos/_explainer/specs/current.vo.json`（有名詞段再對 `current.glossary.json` 生 `current-glossary`）。
5. **算繪**：`python3 automation/render_daily.py`（做了名詞段改傳 `VF-DailyFull`）→ `out/vf-daily.mp4`＋`out/vf-daily-thumb.png`（自動抽幀縮圖），並自動歸檔 spec/vo/縮圖/**mp4** 到 `out/youtube-videos/<topic id>/`（防隔天覆蓋）。
6. **QA（必跑，2026-07-11 起不再是可選）**：挑一個畫面靜止的 frame 跑 `node scripts/qa-video.mjs <comp> <frame> 8 out/vf-daily.mp4`，hold-diff 應接近全黑（YMAX≤4）；未過 → 診斷修復重算；修不了 → ledger 標 `qa_failed` 並照下面失敗通知回報。
7. **GEO metadata 草稿（不上傳）**：title／description／tags 照 [[geo-first-publishing]]；description 含問答體＋官方文件出處＋`🔗 https://maxwu1981.github.io/Remotion/`＋#tags。做了名詞段的日子再加：章節時間戳多一行「名詞小教室」（起點秒數＝主片長度）＋ N 個名詞的「詞＋比喻＋白話定義」逐字列進描述。
8. **記 ledger**：`automation/state/daily-runs.json` append `{date, topic, source_url, title, description, tags, video_path:"out/vf-daily.mp4", thumb_path:"out/vf-daily-thumb.png", status:"rendered_pending_review"}`；題目關鍵字加進 `covered-topics.json`。

**到這裡停（2026-07-04 拍板「算繪完就停」）**——不上傳 YouTube、不主動通知；**只有失敗才** `python3 automation/notify_imessage.py "今日影片工廠失敗於步驟 X：<簡述>"` 並停止當天。老闆看過 `out/vf-daily.mp4` 親口說「**發今天的**」→ 走 `automation/ORCHESTRATOR.md` **runbook B**（上傳→轉公開→`npm run snapshot` 刷影片中心）。需要網路的指令原生執行（必要時停用沙盒）。維運速查（Mac 喚醒/預授權/疑難排解）見 `automation/CHEATSHEET.md`。

---

## A/B/C 起點共用（從這裡開始一樣；D 不進入本段）

### ③ 落永久檔（脫離每日輪替，B 起點適用；A 起點從零建檔）
```
cp src/videos/_explainer/specs/<src>.json     src/videos/_explainer/specs/<name>.json
cp src/videos/_explainer/specs/<src>.vo.json  src/videos/_explainer/specs/<name>.vo.json
mkdir -p public/vo/<name>   # 只複製 vo.json 列出的 cue id，別整個 vo/current/ 資料夾搬過去（會夾帶舊 cue）
```
A 起點沒有現成 spec，直接建 `src/videos/_explainer/specs/<name>.json`（schema 見 `_explainer/schema.ts`：cover/compare/pipeline/terminal/places/spotlight/image/complaints/outro）＋空 `<name>.vo.json`（`{}`）。用 node 驗證：cue↔script 全對應、積木數量合規、stamp/keylineAtCue 不超界。

### ④ 每步 prompt（A 起點必備；B 起點視主題性質，通常每日工廠題目是功能介紹型可省略）
每個「動作場景」都要給觀眾「對 Claude 說的那句 prompt」：畫面 💬 方塊（terminal 首行 `{k:"cmd",t:"💬 對 Claude：「…」"}`）＋旁白唸出。（[[tutorial-video-show-claude-prompts]]）

### ⑤ 片尾 master prompt（A 起點必備；B 起點視需要）
outro 前一格獨立場景，把每步合成一段完整 prompt，旁白鼓勵看完複製整段。**🔒 上片前過驗證 GATE**：①技術對照真實程式碼/官方文件 ②自我理解自測「我看得懂、能一次執行嗎」。（[[tutorial-video-show-claude-prompts]]）

### ⑥ 黑曜石視覺（預設共用元件，只有要重建真實 UI 才手刻）
**預設**：吃 `src/videos/_explainer/ExplainerObsidian.tsx`（通用黑曜石渲染器，schema 六種積木：cover/terminal/places/pipeline/compare/outro）。建 `src/videos/<name>/Obsidian.tsx` 薄包裝層——import 該片 spec/vo、定義 `ANCHORS`（概念錨頂帶）＋`kickerLabel="Claude Code 深度教學"`＋`bgmSrc="bgm-<name>.mp3"`，呼叫 `<ExplainerObsidian spec vo voDir anchors kickerLabel bgmSrc />`。Root.tsx 註冊 `Composition`+`Still`（照抄 `ClaudeCodeAgentViewObsidian`/`ClaudeCodeAgentViewThumb`）。

**只有這一種情況才手刻 bespoke**：這一幕要展示「真實網站/App 的介面重建」（如 fb-autopost 的 `MetaMock.tsx` 重建 Meta 開發者後台），schema 六種積木沒有對應的「假 UI 視窗」型別，硬套會很怪。這時才建該片專屬 `src/videos/<name>/glass.tsx`（照 fb-autopost 複製：`WhiteBg`＋`darkCard`＋`Glare`＋`emberClip`＋`ACC`）＋`Obsidian.tsx` 手刻對應場景（其餘場景仍可繼續呼叫共用 `ExplainerObsidian` 的子元件，不用整支都手刻）。三紀律不變：光暈收斂／字重三層／深卡白字。

跑完後**用 `npx tsc --noEmit` 確認沒新增型別錯誤**，`npx remotion still` 抽關鍵幀肉眼核對版面（終端機場景 lines 超過 6 行會變高、注意 stamps/keyline 別被擠壓，見 [[explainer-obsidian-template]]）。

### ⑦ 駛 Gemini 生 BGM（我的活，不丟給老闆）
**先握手** → Chrome MCP 駛 gemini.google.com → ＋→更多工具→制作音乐 → 模型 Pro＋思考等级**扩展** → 提示詞**避開「情緒」這個詞**（會被誤導成 emo/搖滾曲風，改講明確曲風「study music / ambient piano」+ 排除清單，[[video-bgm-crystal-piano]]）→ 生完先看 Gemini 回的曲風文字，不對就重生 → 下載「**純音頻 MP3 音軌**」→ cp `public/bgm-<name>.mp3`。⚠️下載常一次兩檔，用 ffprobe 對時長挑對的那首。

### ⑧ 依真實 UI 重建（要展示真後台時，同⑥的手刻情境）
若片中要秀真實網頁後台（建 App/取金鑰/SaaS 後台）：**駛瀏覽器觀察真實 UI → 黑曜石忠實重建（可公開真值照放、Secret/Token/個資打碼），不放真截圖**（[[tutorial-ui-rebuild-from-observed]]，範本 `MetaMock.tsx`：`MetaFrame` 瀏覽器窗＋假碼欄位；接法＝SceneShell 針對該 scene idx 導向 `MockupScene`，過高用 `scale` prop）。碰帳號（生 token/建 App）先握手。

### ⑨ 算繪＋QA
先把新寫的旁白（A 起點，或 B 起點有改字的部分）給老闆過稿 → `python3 automation/make-vo-spec.py <spec> <name> <vo.json>` 生曉晴 TTS（edge-tts zh-TW-HsiaoChen）到 `public/vo/<name>/`、填 vo.json → **查資源**（別跟其他 session render 撞，[[render-resource-check]]）→ **daemonize** render（python `start_new_session=True`；深卡 `--image-format=png --crf=15` 防色帶只在深色漸層背景才需要，本模板白底一般不用，[[obsidian-render-settings]]；`--concurrency` 視載）→ 輪詢 log → **ffprobe 驗證**（時長/解析度/aac 有聲）＋**雙重 QA**（lossless hold-diff **且**直接對成品 mp4 抽幀比對，[[video-qa-gate]]）。輸出 `out/youtube-videos/<name>/<name>-obsidian-vN.mp4`（[[out-folder-taxonomy]]、[[video-output-versioning]]）。

### ⑩ 交付＋等發布指示
mp4＋乾淨縮圖送給老闆看（`SendUserFile`，附本地路徑 [[deliver-local-file-paths]]）。**老闆明確對這一支片說「發」之前，不執行任何 `yt_upload.py`。**

### ⑪ 公開發布（老闆說「發」之後，長片＋Short＋乾淨縮圖＋清單）
上傳管線＝`~/Documents/Claude/Projects/Video to Youtube/`（[[youtube-upload-pipeline]]，頻道 Ai-Wisdom @aiwisdomcc [[youtube-upload-account]]；token 過期會自動 refresh）。
- **描述檔**：GEO 鉤子（problem→solution＋數字）＋**完整 master prompt 逐字放描述第一區塊**（若 A 起點有做這站）＋章節時間戳（node 從 spec/vo 算）＋實體/hashtag。
- **排程**：先用 `yt_admin.py`／直接查 YouTube API 確認佇列目前排到哪一天（**別只信本機 upload_log.json**，那個欄位可能沒同步後續 `vid-schedule` 呼叫），新片排「佇列最後一天的隔天 22:00 台灣時間」（[[youtube-scheduled-publish-10pm]]、[[youtube-publish-queue-sequential]]）。**排完回報老闆目前佇列排到哪一天。**
- **乾淨縮圖**：加一個無字幕 `<Name>Thumb` Still（純 CoverScene at f=60）→ 算 PNG → ffmpeg resize 1280×720 → `yt_playlist.py thumb`。
- **上傳**：`yt_upload.py --video … --title … --desc-file … --tags … --category 28 --publish-at <下一天22:00TW的UTC時間戳> --thumbnail … --skip-if-uploaded`。
- **播放清單**：`yt_playlist.py add --playlist <對應清單> --video <id>`。
- **9:16 Short**：建 `Short.tsx`（1080×1920，複用鉤子 VO＋master prompt VO＋BGM，3 景：hook/prompt/CTA，~28s），算繪→上傳 public（標題帶 #Shorts、描述導流長片）。

### ⑫ 置頂留言＋GEO 外部訊號草稿
- **置頂留言**：擬好文字給老闆貼＋釘（master prompt＋任何影片措辭補正）。
- **GEO 外部訊號**：寫 `src/videos/<name>/GEO-SEEDING.md`＝LinkedIn（中/英）＋Reddit（value-first）草稿，實體講清楚讓 AI 答案引擎引用。**⚠️ Reddit 自貼連結＝易 shadowban（[[reddit-publishing-channel]]）：內文零連結先給價值、被問才貼、或先養 karma**。都我擬草稿、**老闆自己貼**（不代發）。

---

**完成後**：更新該片專案記憶（狀態/URL/待辦），MEMORY.md 加索引。範本記憶＝[[fb-autopost-tutorial-video]]（A起點）、[[explainer-obsidian-template]]（B起點）。
