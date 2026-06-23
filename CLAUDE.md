
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
- **收工前必過 QA gate（沒過不算 done）**：跑 `scripts/qa-video.mjs`，並確認 ① 0:00 有封面亮相 ② 前 3 秒有鉤子 ③ 結尾有 CTA ④ 無抖動（`<Backdrop freeze/>` + lossless hold-diff ≈ 全黑）⑤ 字幕與旁白同步。
- **產線順序**：橫版 Master → 9:16 Reel（render 要加 `--concurrency=2`）→ 算繪（輸出留在本機 `out/`，不用交付到 Google Drive）→ 上 YouTube 影片＋Short → 設縮圖。
- **長算繪（>10 分鐘）**：Bash 背景有 10 分鐘上限會砍掉半成品 → 用 daemonize（`start_new_session`）跑、輪詢 log、結束後才 ffprobe 驗證。
- **標題/描述**：套上面第 5 點 GEO（problem→solution＋具體結果、開字幕、章節時間戳、實體講清楚）。
- **風格制度（2026-06-22 拍板：三套並存）**：三套封面 × 三種片型「都做」，用「片型→封面」配對當默認——資料驅動解說片→EP00 致勝公式；詳細解說 Tutorial→風格 B 曉晴門面；工具盤點卡 roundup→EP00 垂直版。聲音/GEO/QA gate 三種都固定套。**每支開拍前先用可點選選項問老闆「片型＋主題」再動工，不自己默默選。** 要換：單支說「這支用風格 B 封面」，改默認說「某片型默認封面改成 X」。總表見記憶 `video-style-system`。
- **解說片＝故事腳本，不是速查卡（2026-06-23 退稿後拍板）**：走故事弧（為何有此議題 → 誰遇到 → 影響 → 大家為何解不掉 → 你怎麼解 → 你跟別人哪裡不同 → 怎麼證明真的解決〔可量測 before/after〕→ CTA）；第一人稱真實經歷；**旁白先逐句給老闆過稿再算繪**。詳見記憶 `video-story-script-structure`。
- **痛點用真實社會實證**：拿真人逐字網路抱怨當證據（GitHub／HN／具名部落格最穩；Reddit 直 fetch 會擋），**ID 部分屏蔽、文字照抄**，視覺上泡泡逐一彈出疊滿；別拿自家專案的東西冒充大眾痛點。
- **封面三方式並陳給老闆挑；AI 生圖中文必亂碼**：Remotion EP00（中文正確，首選）／ Gemini Pro（插畫張力）／ Canva（極簡）；**Gemini、Canva 一律走英文標題，中文最後用 Remotion 疊**——別讓 AI 直接畫中文。
- 完整細節見專案記憶（`MEMORY.md`）：`video-style-system`、`new-video-workflow`、`video-qa-gate`、`video-production-pipeline`、`reel-workflow`、`long-render-detach`、`youtube-upload-pipeline`、`youtube-upload-account`。

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.