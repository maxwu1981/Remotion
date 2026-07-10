# VIDEO-PRODUCTION.md — Ai-Wisdom 影片製作流程總覽

> 這是「我們怎麼做影片」的單一入口文件。硬規則在 [CLAUDE.md](CLAUDE.md) §6（本檔不重複，只指路）；
> 逐條細節在專案記憶（`MEMORY.md` 索引）。頻道＝Ai-Wisdom（@aiwisdomcc），聲音＝edge-tts 曉晴，BGM＝Gemini Lyria 3 水晶鋼琴。

## 三條產線（先分清楚你要走哪條）

| 產線 | 觸發 | 畫面來源 | 對應 skill / runbook |
|---|---|---|---|
| **A. 每日影片工廠**（自動草稿） | 每天 06:00 排程 | `_explainer` 資料驅動模板（寫 JSON 不寫 code） | `automation/ORCHESTRATOR.md` runbook A；發布＝「發今天的」runbook B |
| **B. 旗艦教學片**（人工精修） | 老闆點題或挑每日草稿升級 | 黑曜石模板 `ExplainerObsidian` 為主；要重建真實 UI 才手刻 | `/Max1`（兩種起點：全新題材／沿用工廠草稿）；`/makevideo`（舊版完整流程） |
| **C. AI 生成畫面片** | 要 3D/實拍風角色場景（code 畫不出來） | Google Flow(Veo 3.1) 生 clip，Remotion 只串接 | `veo-reel` skill；分鏡寫法配 `visual-skills` |

## 標準流程（產線 B 為例，A/C 是它的子集/變體）

```
0. 開拍前 gate（一步都不能跳）
   ├─ 可點選選項問老闆「片型＋主題」（CLAUDE.md §6 風格制度）
   ├─ series-registry.json 鎖 EP 編號（check → 老闆拍板 → reserve）
   └─ 一片一資料夾：cp -R src/videos/_template src/videos/<name>

1. 查證＋腳本
   ├─ 對照官方文件逐字查證（必要時雙 claude-code-guide agent 合議）
   ├─ 故事腳本（故事弧，不是速查卡）→ 旁白逐句給老闆過稿
   ├─ 痛點段用真人逐字網路抱怨（ID 部分遮蔽）
   └─ 教學片：每步 💬 prompt ＋ 片尾 master prompt 禮物

2. 素材
   ├─ VO：scripts/make-vo-<name>.mjs 或 automation/make-vo-spec.py（曉晴；
   │    多音字/字母坑見記憶 vo-heteronym-tts、edge-tts-spaced-acronym-bug）
   ├─ BGM：Claude 自己駕駛 Gemini「創作音樂」生（Pro＋扩展；bgm-<name>.mp3）
   ├─ 實操真截圖＝老闆 Cmd+Shift+4 截＋遮蔽；概念段＝程式碼重建
   │    （混合制見記憶 tutorial-ui-rebuild-from-observed）
   └─ 有 ≥4 個新手術語 → 加名詞小教室片尾（video-glossary-handson-segments）

3. 算繪（鐵則全在 CLAUDE.md §6）
   ├─ 前置：封面文字/EP 號定案 ✓ 防抖旗標 ✓ 旁白已過稿 ✓ 系統負載 <8 ✓
   ├─ 深色卡風：--image-format=png --crf=15；一律 --timeout=300000
   ├─ >10 分鐘 → daemonize；輸出 out/<主題>/<name>-v<N>.mp4（遞增版本絕不覆蓋）
   └─ 9:16 Reel 加 --concurrency=2

4. QA gate（沒過不算 done）
   ├─ scripts/qa-video.mjs ＋ 五項 checklist（0:00 封面/3 秒鉤子/CTA/無抖動/字幕同步）
   └─ 抖動驗兩面：lossless hold-diff ＋ 成品 mp4 抽幀 diff（假警報排除見 video-qa-gate）

5. 發布（老闆對該片明講「發」才動；旗艦片排隊每天 22:00 TW 一支）
   ├─ yt_upload.py --desc-file YT_DESCRIPTION.txt（master prompt 逐字在描述最上方）
   ├─ GEO 描述：問答體＋章節時間戳＋🔗片中所有網址＋工具公信度＋實體講清楚
   ├─ 縮圖 <2MB（PNG 太大轉 JPEG q92）；系列片 yt_playlist.py add 入清單
   └─ npm run snapshot → push docs/（影片中心快照，只收公開片）
```

## 關鍵檔案地圖

- 編號真相：`series-registry.json`（上傳/入清單自動 sync）
- 品牌常數：`src/shared-skills/theme.ts` 的 `BRAND_MARK`（封面禁手打品牌字）
- 資料驅動引擎：`src/videos/_explainer/`（schema.ts＝積木合約；specs/current.json＝今日工廠）
- 上傳工具：`~/Documents/Claude/Projects/Video to Youtube/`（yt_upload.py / yt_publish.py / yt_playlist.py / sync_series_registry.py）
- 已發布影片總表＋各片教訓：記憶 `published-videos`

## Skills 一覽（本 repo `.claude/skills/`）

| Skill | 用途 |
|---|---|
| `/Max1` | 旗艦黑曜石教學片一條龍（3 種起點：全新／工廠草稿／跟操長片） |
| `/makevideo` | 解說片完整流程（搜題→查證→腳本→spec→配音→算繪→QA→封面→上傳） |
| `veo-reel` | Flow(Veo) 生 clip → Remotion 串片 |
| `visual-skills` | AI 影片提示詞/分鏡/運鏡方法論（寫 Veo prompt 前必讀） |
| `/ship` | 收尾：lint/型別/測試 → 草擬繁中 commit |
| `commit-zh` | 繁中 Conventional Commits 訊息產生器 |

## ⚠️ 公開 repo 紀律

這個 repo 是 **public**（GitHub Pages 需要）。絕不 commit：`automation/state/`（電話＋API key）、`cookies.json`、原始截圖/錄影目錄（`public/footage|facecam|handson|yt-upload-ep02|hf-voiceid|local-access|docreport`）、任何 token/憑證。名單維護在 `.gitignore`。
