# 工具盤點卡 — 可重用提示詞 (Roundup / Spotlight prompt)

復刻小紅書「**做视频：装这6个就够了**」那種**工具盤點卡**短影片。
本質：不是「一句生成式 prompt」，而是**填一份資料 spec**，交給本專案的淺色資料驅動引擎
[`_explainer`](./Explainer.tsx) 算繪（`cover[index]` → N×`spotlight` → `outro`）。

把下面整段貼給 Claude，附上你的主題與項目清單即可。產物是一份合法的 `VideoSpec` JSON
（schema 見 [`schema.ts`](./schema.ts)），存成 `src/videos/_explainer/specs/<id>.json`、照 `roundup-cc` 註冊進 `Root.tsx`。

---

## PROMPT (paste this)

You are generating a **VideoSpec JSON** for our data-driven Remotion "Explainer" engine
(`src/videos/_explainer/`). The video is a **tool/feature roundup** in the style of a
"装这 N 个就够了" carousel: an index cover, then one full-screen **spotlight card per item**,
then a recap outro. Light theme, bilingual (big English name + Traditional-Chinese copy).
Output **only** the JSON — no prose, no markdown fence.

### Inputs I will give you
- **Topic** (e.g. "做影片的 AI 工具", "Claude Code 必裝能力").
- **Items**: N entries (N = 4–6 recommended; cover `index` supports max 8). For each: an English
  name and what it does. If I give rough notes, you write the polished copy.

### Schema you must emit (`VideoSpec`)
```jsonc
{
  "id": "<kebab-case>",
  "brand": {
    "titlePre": "<short latin/mono lead, e.g. 'Claude Code'>",
    "titlePost": "<gradient hook, e.g. '這 6 招就夠'>",   // titlePre+titlePost = the cover headline
    "name": "Ai-Wisdom",
    "handle": "@aiwisdomcc",
    "tagline": "<one-line GEO subhead: who it's for + concrete payoff>",
    "date": "整理日期 YYYY-MM-DD"
  },
  "script": { "<cueId>": "<one spoken sentence = also the caption>", ... },
  "scenes": [ <cover>, <spotlight × N>, <outro> ]
}
```

**Scene 1 — `cover`** (the index / hook):
```jsonc
{
  "type": "cover",
  "titlePre": "<same as brand.titlePre>",
  "titlePost": "<same as brand.titlePost>",   // keep the whole headline ≤ ~12 CJK chars so it fits one line
  "index": [ { "n": "01", "title": "<EN name>", "tag": "<≤10-char zh hook>", "accent": "<accent>" }, ... ],  // one row per item, max 8
  "cues": ["cv1", "cv2", "cv3"]                // ~3 lines: the question → "all native/built-in" → "let's go"
}
```

**Scenes 2..N+1 — one `spotlight` per item**:
```jsonc
{
  "type": "spotlight",
  "no": "01",                       // matches the cover index number
  "kicker": "<2–6 char zh category, e.g. 把專長打包>",   // shown top-left as "01 · 把專長打包"
  "accent": "<accent>",             // SAME accent as this item's cover row (one item = one colour)
  "titleEn": "<big English name>",
  "subZh": "<coloured zh subtitle, e.g. 'SKILL.md ｜ 封裝可重用專長'>",
  "desc": "<1–2 sentence zh description; concrete, no fluff>",
  "bullets": ["<key point 1>", "<key point 2>", "<key point 3>"],   // 2–4, each ≤ ~14 zh chars
  "cues": ["s1a", "s1b", "s1c", "s1d"]   // line 0 names the item; lines 1.. each reveal one bullet
}
```

**Last scene — `outro`** (recap + CTA, CTA is built in):
```jsonc
{
  "type": "outro",
  "headingZh": "<N 字總整理>",
  "headingEn": "<latin recap label>",
  "cards": [ { "emoji": "🧩", "text": "<EN name>：<one-line zh>", "accent": "<accent>" }, ... ],  // 2–5 cards
  "cues": ["o1", "o2", ... , "oLast"]   // line0 intro · one line per card · last line = like/subscribe/share CTA
}
```

### Hard rules
1. **One item = one accent**, reused identically in the cover `index` row, the `spotlight`, and (if present) the `outro` card. Pick from exactly these 6 keys: `claude` (orange), `violet`, `blue`, `green`, `teal`, `warn` (amber). For 6 items use all six in this order.
2. **`cues` ↔ `script`**: every cue id in a scene must exist in `script`. For a spotlight with K bullets, give **K+1 cues** (cue[0] names the item; cue[i] reveals bullet[i-1]) so bullets stagger in with the narration.
3. **`no` / `n` numbers** are zero-padded strings ("01".."06") and must match between cover index and each spotlight.
4. **GEO** (mandatory, even if I don't ask): the cover headline and `tagline` read as a real question + concrete payoff with a number; each `desc`/bullet states a concrete capability or comparison, not vague praise; name entities clearly (real product/feature names) so AI answer engines can cite them. Captions = the `script` lines (crawlable text).
5. **Length**: keep each spoken line to ONE sentence (it doubles as the on-screen caption). Aim 4–6 items → ~2–2.5 min landscape master.
6. Traditional Chinese for all zh copy; keep English names in English.

### After you emit the JSON (I will do these)
- Save to `src/videos/_explainer/specs/<id>.json`; add a sibling `<id>.vo.json` (`{}` is fine to start).
- Register a `<Composition id="..." component={Explainer} ... width={1920} height={1080} fps={30}>` in `src/Root.tsx` (copy the `RoundupClaudeCode` block).
- Generate narration with a `scripts/make-vo-<id>.mjs` (copy `make-vo-roundup-cc.mjs`); it writes `public/vo/<id>/*.mp3` + fills `<id>.vo.json` so scenes re-time to the audio.
- Preview in Remotion Studio, run `scripts/qa-video.mjs`, then render master → 9:16 reel.

---

## Worked example
A complete filled spec lives at [`specs/roundup-cc.json`](./specs/roundup-cc.json)
(topic「Claude Code：這 6 招就夠」, 6 items: Skills / Subagents / MCP / Hooks / Slash Commands / Plan Mode).
Use it as the reference for tone, length, and structure.
