
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
- **收工前必過 QA gate（沒過不算 done）**：跑 `scripts/qa-video.mjs`，並確認 ① 前 3 秒有鉤子 ② 結尾有 CTA ③ 無抖動（`<Backdrop freeze/>` + lossless hold-diff ≈ 全黑）④ 字幕與旁白同步。
- **產線順序**：橫版 Master → 9:16 Reel（render 要加 `--concurrency=2`）→ 算繪 → 交付 Google Drive（複製進本機同步夾，別用 MCP base64 傳影片）→ 上 YouTube 影片＋Short → 設縮圖。
- **長算繪（>10 分鐘）**：Bash 背景有 10 分鐘上限會砍掉半成品 → 用 daemonize（`start_new_session`）跑、輪詢 log、結束後才 ffprobe 驗證。
- **標題/描述**：套上面第 5 點 GEO（problem→solution＋具體結果、開字幕、章節時間戳、實體講清楚）。
- 完整細節見專案記憶（`MEMORY.md`）：`new-video-workflow`、`video-qa-gate`、`video-production-pipeline`、`reel-workflow`、`long-render-detach`、`deliver-to-gdrive`、`youtube-upload-account`。

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.