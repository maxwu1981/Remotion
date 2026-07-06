
---

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.
- **動手或提問前，先檢索相關 STANDING RULE / feedback 記憶**——別問一個記憶已經明確規定的問題（2026-07-05 教訓：BGM 生成記憶白紙黑字寫「是 Claude 的活、用 Chrome MCP 駕駛 Gemini 生」，卻還去問老闆「你自己生還是我代駕」被糾正）。這是多數「問錯問題／做錯決定」的根因。

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**驗證紀律（2026-06-25 教訓）：**
- **檢查副作用看「實際結果全集」，不要只 grep 你預期的字串。** 例：確認下載/檔案操作成功，用 `ls -t | head` 看全部最新檔，別只 `grep 你以為的檔名`——名字跟你想的不一樣時（如 Flow clip 被存成 `video_*.mp4`）會誤判「失敗」而白做重試。
- **駕駛不穩定的網頁 UI（版面會變、載入慢）：一步一截圖、別賭整批盲點座標。** 寧可慢、每步先確認狀態，也別把「back→點 tile→下載」一氣呵成賭它全中；失敗率高又難 debug。

## 5. GEO-First Publishing

**Every published artifact — articles, posts, videos, landing pages — must be optimized for Generative Engine Optimization (GEO), not just SEO.** GEO = being found, understood, and *cited* by AI answer engines (ChatGPT, Claude, Perplexity, Google AI Overviews, Gemini). Hard requirement, not an afterthought — if a publishing task doesn't mention GEO, apply it anyway and say so.

**Section rewrite formula (apply to every H2 / description block):**
- Each **H2 = a real question a user would actually ask** — not a topic label.
- Under it, a **direct answer in 2–3 sentences**, and that answer **must contain a concrete number or a comparison/conclusion** (never vague).
- End each section with a one-liner **「適用場景」/「不建議場景」** (when it fits / when it doesn't).

**Workflow:**
1. **Gap analysis first** — compare the page/asset against top competitors: which questions do they answer that you don't? Which info blocks are easier for AI to lift? Fix those gaps before rewriting.
2. **Rewrite** to the formula above.
3. **Schema + signals + monitor** — turn the Q&A into FAQ/VideoObject **JSON-LD**; ensure real crawlable text (not JS-only) + `llms.txt`, `sitemap.xml`, OpenGraph; seed external signals (Reddit / LinkedIn / Quora in a genuine voice); review weekly in Google Search Console (rank + CTR).

**Videos:** titles + descriptions written as problem → solution with a concrete result, captions/transcripts enabled, chapter timestamps — AI cites the text, not the pixels. **Name entities clearly** (who / what / topics) so engines can attribute the source.

## 6. 影片製作鐵則（Remotion · 本專案）

**用 Remotion 做任何影片時，這些是硬規則，不是建議。**

- **一片一資料夾**：每支新片＝獨立 `src/videos/<name>/`，從 `_template` 起、複用 `shared-skills/`；不在既有片上疊改。
- **頭尾必備**：每支都要有 **hook 封面/poster（含標題）** ＋ **結尾 outro（感謝 + 訂閱／按讚／分享 CTA）**。
- **封面要在第 0 秒亮相（2026-06-23 拍板）**：每支影片開場約 1–2 秒，先用「該片縮圖同款設計（大標+鉤子）」當開場卡閃一次 → 再進鉤子內容。縮圖只在按播放前出現、不會自動進影片，所以要刻意把封面烘進 0:00。已公開片不能換檔不回頭補；未公開＋未來片內建。詳見記憶 `cover-at-video-start`。
- **收工前必過 QA gate（沒過不算 done）**：跑 `scripts/qa-video.mjs`，並確認 ① 0:00 有封面亮相 ② 前 3 秒有鉤子 ③ 結尾有 CTA ④ 無抖動 ⑤ 字幕與旁白同步。
- **抖動要驗「兩面」，別只驗無損幀（2026-07-05 教訓）**：`<Backdrop freeze/>` + **lossless hold-diff**（無損幀，測程式碼穩不穩，≈全黑/YMAX≤4）**只是一半**。**一定要再 diff 成品 mp4 的同一組相鄰幀**（`ffmpeg -ss t1/-ss t2` 各抽一幀 → `blend=difference,signalstats` 看 YMAX）。若 lossless 穩(0)但 mp4 抖(≥5)＝h264 壓縮呼吸，不是 code 問題 → 用下面 PNG+CRF15 治，別改程式。**程式碼穩 ≠ 成品穩；v1 只驗無損幀，深色卡抖動被老闆一眼抓到。**（`scripts/qa-video.mjs` 在大 log 下 execFileSync buffer 會炸，可手動同邏輯做。）
- **黑曜石／深色漸層玻璃卡風 → 算繪一律 `--image-format=png --crf=15`（STANDING RULE 2026-07-04）**：預設 JPEG 中間幀＋CRF≈18 會讓大面積深色漸層＋光暈 h264 呼吸抖；PNG 無損中間幀＋CRF15 根治（代價：算繪+2~4 成、檔變大，YouTube 反正重壓）。詳見記憶 `obsidian-render-settings`。
- **抖動另兩種病因＋量測陷阱（2026-07-05 教訓，補上面「驗兩面」）**：lossless hold-diff **>0** ＝程式碼真的在抖、要改碼——已知一種是**全形標點相鄰又跨 Google Fonts 字型分片**（如「」、」），Chrome 的 CJK 標點擠壓逐 render-worker 不一致 → 整行半字寬跳，根治＝根節點加 `textSpacingTrim: "space-all"`（全片繼承）。**量測 mp4 呼吸別用 `-ss` seek 到 GOP 中間單抽一對幀**——seek 首幀解碼雜訊會給假峰值（曾誤報 YMAX≈245、實際 59）；要「從關鍵幀精確解碼、丟掉前幾幀」再比。判定「渲染確定性穩不穩」最準＝**同一幀連渲兩次比 hash**（出現 2 種＝不穩、全相同＝穩）。同一支片可能同時有「字型競態」＋「h264 呼吸」兩種抖，**每一處抖動獨立診斷、別假設同因**。
- **長算繪前 checklist（2026-07-05 教訓，白算兩趟）**：按下 >10 分算繪前先確認三件全定案——① 封面文字＋系列/EP 編號 ② 防抖旗標 `--image-format=png --crf=15` 有帶上 ③ 內容/旁白已過稿。這 session v3 烙錯 EP 編號、v3/v4 漏防抖旗標，各廢一趟 ~80 分。
- **產線順序**：橫版 Master → 9:16 Reel（render 要加 `--concurrency=2`）→ 算繪（輸出留在本機 `out/`，不用交付到 Google Drive）→ 上 YouTube 影片＋Short → 設縮圖。
- **系列影片 YouTube 清單**：EP01 發佈時一起建公開播放清單（名稱＝系列名）；EP02+ 用 `yt_playlist.py add` 加入同一清單。清單 ID 記在對應的系列記憶裡。
- **系列名＋EP 編號要在「開拍前」鎖死（2026-07-05 教訓；2026-07-06 升級成 registry）**：系列徽章烘在封面 = 影片 frame 0 ＋縮圖裡，**事後改一個字＝全片重算（~3h）＋重新上傳（新 video ID，舊片變孤兒）**。**編號的單一事實來源＝repo 根目錄 `series-registry.json`，不是 MEMORY.md**（記憶檔曾互相打架造成兩支 EP06 撞號公開上線）。流程：①開拍前跑 `python3 ~/Documents/Claude/Projects/"Video to Youtube"/sync_series_registry.py check --series <系列> --ep <EPxx>`（會先自動從 YouTube 抓即時狀態再查；exit 0=空號）②老闆用可點選選項拍板後 `reserve --series … --ep … --note "<片名>"` 鎖號 ③上傳/入清單後 registry 由 `yt_upload.py`/`yt_playlist.py add` **自動 sync**，reserved 兌現自動移除，不用手動維護。真要事後改：badge 只在 cover flash（frames 0~66）＋縮圖，理論上可只重算封面段再 splice，但 h264 接縫有風險，公開片寧可整支重算求穩。
- **封面品牌字樣一律用 `BRAND_MARK` 常數（STANDING RULE 2026-07-06）**：`src/shared-skills/theme.ts` 的 `BRAND`／`BRAND_HANDLE`／`BRAND_MARK`（=「Ai-Wisdom · @aiwisdomcc」），封面/縮圖/角標**不准手打品牌字**——歷史封面曾出現 AI WISDOM／AI Wisdom／Ai-Wisdom 三種寫法。新片一律 `import { BRAND_MARK } from "../../shared-skills/theme"`。
- **長算繪（>10 分鐘）**：Bash 背景有 10 分鐘上限會砍掉半成品 → 用 daemonize（`start_new_session`）跑、輪詢 log、結束後才 ffprobe 驗證。
- **算繪前先查系統負載（STANDING RULE 2026-07-04，2026-07-05 又踩）**：多 session 常同時在算繪，CPU 被搶會讓 render「每幀超過 timeout 被餓死」（log 停在某幀、無 mp4、估時飆到數小時）。開跑前先 `sysctl -n vm.loadavg`，1 分鐘 load 過高（>8）就等它降穩再開；render 一律加 `--timeout=300000` 較耐載。**偵測「有沒有別的 render 在跑」一律 `ps -Ao command | grep`，別用 `pgrep -af`——macOS 的 `pgrep` 不支援 `-a`，會回傳只有 PID 沒有 cmdline，守望腳本誤判「沒人在跑」而搶跑（2026-07-05 v6 因此跟別 session 對撞、ETA 從 80 分飆到 2h42m）。** **報算繪 ETA 給老闆前也先查 RAM/核心數（`sysctl -n hw.memsize hw.ncpu`），別憑感覺報數字**：8GB RAM 機器算 6 分鐘片（png 無損中間幀）約 **1 小時**、concurrency 別超過 4（8GB 記憶體吃緊，調高會 OOM 反而更慢）、png 中間幀比 jpeg 慢很多（2026-07-05 教訓：口報「15–25 分」實際 1 小時，害老闆基於錯誤預期做決定）。詳見記憶 `render-resource-check`。
- **影片要用到音樂／BGM／配樂 → 一律用 Gemini 生（2026-06-24 拍板）**：走 Gemini 網頁「創作音樂」(Lyria 3) 生（免費、台灣可用、不鎖區；MusicFX 鎖區、higgsfield 要付費都當備案），下載時選「**純音頻 MP3 音軌**」cp 進 `public/`。**⚠️ BGM 生成是我(Claude)的活，不是老闆的——一律我自己用 Chrome MCP 駕駛 Gemini 生，絕不問老闆「你自己生還是我代駕」**（老闆的參與只有：保持 Google 登入／必要時點 CAPTCHA／最後試聽挑用）。每支影片各自新生一首、檔名帶片名（`bgm-<片名>.mp3`），不共用舊檔；設 Pro＋思考等级「扩展」；生失敗會把 composer 卡在 stop 狀態，發起新對話重走即可。完整操作路徑見全域 `CLAUDE.md §8` 與記憶 `video-bgm-crystal-piano`。
- **標題/描述**：套上面第 5 點 GEO（problem→solution＋具體結果、開字幕、章節時間戳、實體講清楚）。
- **教學片有 prompt → 上 YouTube 時 prompt 逐字必進『描述』欄（STANDING RULE 2026-07-05）**：只要片裡教觀眾「對 Claude 說的那句 prompt」，發布時把完整 master prompt **逐字**貼進影片描述最上方（純文字、去掉 markdown 反引號與 `<>` 角括號，YouTube 會吃掉）；描述排序＝master prompt 全段 → 問答體開頭 → 章節時間戳 → 主題實體＋⚠️警語＋hashtags。GEO：描述裡的 prompt 逐字最容易被 AI 答案引擎引用，觀眾也不必暫停畫面就能複製。做法＝發布前備一份 `YT_DESCRIPTION.txt` 整段貼（`yt_upload.py --desc-file`）。詳見記憶 `tutorial-video-show-claude-prompts`。
- **風格制度（2026-06-22 拍板：三套並存）**：三套封面 × 三種片型「都做」，用「片型→封面」配對當默認——資料驅動解說片→EP00 致勝公式；詳細解說 Tutorial→風格 B 曉晴門面；工具盤點卡 roundup→EP00 垂直版。聲音/GEO/QA gate 三種都固定套。**每支開拍前先用可點選選項問老闆「片型＋主題」再動工，不自己默默選。** 要換：單支說「這支用風格 B 封面」，改默認說「某片型默認封面改成 X」。總表見記憶 `video-style-system`。
- **解說片＝故事腳本，不是速查卡（2026-06-23 退稿後拍板）**：走故事弧（為何有此議題 → 誰遇到 → 影響 → 大家為何解不掉 → 你怎麼解 → 你跟別人哪裡不同 → 怎麼證明真的解決〔可量測 before/after〕→ CTA）；第一人稱真實經歷；**旁白先逐句給老闆過稿再算繪**。詳見記憶 `video-story-script-structure`。
- **痛點用真實社會實證**：拿真人逐字網路抱怨當證據（GitHub／HN／具名部落格最穩；Reddit 直 fetch 會擋），**ID 部分屏蔽、文字照抄**，視覺上泡泡逐一彈出疊滿；別拿自家專案的東西冒充大眾痛點。
- **封面三方式並陳給老闆挑；AI 生圖中文必亂碼**：Remotion EP00（中文正確，首選）／ Gemini Pro（插畫張力）／ Canva（極簡）；**Gemini、Canva 一律走英文標題，中文最後用 Remotion 疊**——別讓 AI 直接畫中文。
- **AI 生成畫面片（Flow/Veo → Remotion）→ 走 `veo-reel` skill（2026-06-25 跑通）**：上面三種片型的畫面都是 Remotion 用程式碼「畫」出來的；要做「真實 AI 生成畫面」的短影音（3D／實拍風角色或場景，code 畫不出來的）才走這條——**用 Google Flow(Veo 3.1) 生影片片段，Remotion 只負責串接＋疊字幕/旁白/BGM**。
  - 一致性鐵則：**必把 Flow「角色實體」附進提示當參考**（composer「+」→選角色→添加到提示）。光用文字點名 Veo 會飄（自己長天線/胸燈、臉漂）。先把定妝角色存進 Flow 專案，每個 shot 都附它。
  - 長度：Veo 單次≈8s 是「生成顆粒」不是上限；要長鏡頭用 Flow extend，**逐 shot 判斷、別硬綁 8s**。
  - 配音關掉 Veo 原生聲，沿用 edge-tts 曉晴 + 水晶 BGM；提示詞一律英文、畫面不放中文。
  - clip 下載＝媒體庫 tile kebab「⋮」→下載→**720p 原始尺寸**（1080p/4K 是 upscale）。
  - 串接＝Remotion `OffthreadVideo` + `TransitionSeries`；範本 `src/videos/gemini-poc/`。詳見記憶 `gemini-flow-veo-video`。
- 完整細節見專案記憶（`MEMORY.md`）：`video-style-system`、`new-video-workflow`、`video-qa-gate`、`video-production-pipeline`、`reel-workflow`、`long-render-detach`、`youtube-upload-pipeline`、`youtube-upload-account`、`gemini-flow-veo-video`。

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.