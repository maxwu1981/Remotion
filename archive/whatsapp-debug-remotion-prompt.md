# Remotion Prompt — "Why Won't My WhatsApp Send? An AI Debugging Case Study"

> Paste everything below (from "Hey, Claude" onward) into a fresh Remotion session.
> On-screen language: **繁體中文 (Traditional Chinese)**. Technical terms stay in English
> (e.g. `WhatsApp Cloud API`, `token`, `phone_number_id`, `error 131030`, `code 190`,
> `Status`, `Graph API`, `Bash`, `Read`, `WebSearch`, `CallMeBot`, `Claude Code`).
> Channel: **Ai-Wisdom**. Brand note: this is a **pure-tech** case study — do NOT show any
> art-studio / 峻清 branding. All sensitive data is faked: phone shown as `+86 188-XXXX-XXXX`,
> tokens/IDs as `EAA…••••` placeholders, back-office shown as stylized mockups, file paths
> generalized (e.g. `~/.../SKILL.md`).

---

Hey, Claude. Please use Remotion best practices to create a **"Why Won't My WhatsApp Send?"**
debugging-case-study animation covering the **Cover + 5 sections + Outro** detailed below.
Project handle: `whatsapp-debug-case`.

On-screen language rule: **all titles, labels, captions and narration subtitles are in
Traditional Chinese (繁體中文)**, while **filenames, commands, product names, API names,
error codes and technical terms stay in English** (`WhatsApp Cloud API`, `token`, `Status`,
`phone_number_id`, `error 131030`, `code 190`, `Graph API`, `curl`, `Bash`, `Read`,
`WebSearch`, `CallMeBot`). Quote the on-screen strings exactly as written below.

Render targets: **two compositions from one shared timeline** — a **16:9 (3840×2160, 4K)**
master for YouTube and a **9:16 (2160×3840)** cut for Shorts — both at **60fps**. Build
responsive layouts so each section reflows cleanly between the two aspect ratios (the
horizontal "timeline flowchart" becomes a vertical stack in 9:16).

## Timing & Pacing Details
- ~6–9 minutes total. Pacing per section: Cover ≈8s · S1 ≈45s · S2 ≈75s · S3 ≈150s
  (the densest — four blockers) · S4 ≈120s · S5 ≈110s · Outro ≈15s.
- Style: **活潑資訊圖卡 (lively infographic-card)** — bright, friendly, energetic, NOT a
  cold terminal aesthetic. Tone of the writing is **casual and conversational (輕鬆口語)**.
- Follow the script order top-to-bottom. **Reveal every section step by step, never all at
  once.** Each section opens with a **標題卡 (title card)**. Transitions between sections are
  **clean hard cuts (俐落硬切)**.
- An **AI virtual host (AI 虛擬主播)** — a simple friendly vector character (no real face) —
  appears in a corner to "present" key beats; keep it lightweight and reusable.
- Voiceover: Traditional-Chinese narration via **edge-tts `zh-TW-HsiaoChenNeural`**; subtitles
  burned in. BGM: light-tech bed. Add YouTube **chapter timestamps** (one per section).

## Layout, Framing & Visual Elaboration Strategy
- **Light theme**, colourful infographic cards on a soft off-white canvas.
- Accent colours (use consistently): **red ✘ = blocked/broken/paused**, **green ✔ =
  works/recommended**, **amber ⚠ = caveat/limitation**, **blue = neutral/info**.
- **THE CENTRAL RECURRING MOTIF = a left-to-right "diagnosis timeline" flowchart** that runs
  across the bottom of the frame for S1→S5 and **lights up node-by-node in sync with the
  narration (隨旁白同步點亮)**. This flowchart is the **spine of the whole video**. Nodes:
  `① 問題現場` → `② 是 bug 還是設計?` → `③ 拆四個坑` → `④ 收斂目標 + 三方案` → `⑤ 推薦解法`.
  Completed nodes turn green; the active node pulses; future nodes are greyed. In 9:16 this
  becomes a vertical progress rail on the right edge.
- Other recurring motifs (same icon = same idea every time): 📱 phone = the +86 contact number;
  🤖 robot-server = the Cloud API sender; 🔑 key = `token`; 🧪 test-tube = the test number;
  📣 broadcast-ring = `Status`. Reuse them so meaning compounds.
- Smooth spring/interpolate motion, generous whitespace, big readable Chinese type.

### Crucial Visual Requirement
Whenever a concept could confuse a non-expert, you MUST show a concrete diagram/mockup —
never "a relevant graphic." The specific confusing concepts in THIS content, each needing a
purpose-built visual:
- **"暫停不是壞掉"** — distinguish an *intentionally paused* step from a *crash*. Show the
  human-written pause note inside the pipeline file vs an imagined error.
- **Test number's 5-recipient limit** — why a message to the +86 phone is rejected
  (`error 131030`). Show a whitelist of 5 slots, the +86 phone NOT on it, bounced arrow.
- **Broken `token`** — show a real `curl` → `Graph API` round-trip returning
  `code 190 · token could not be decrypted`; contrast a 40-char stub vs a real 200+ char token.
- **`Status` has no API** — show the Cloud API endpoint menu with "post to Status" greyed/❌,
  and that Status lives only in the consumer app.
- **One number can't be on both** the consumer WhatsApp app AND the Cloud API — a split
  diagram with the +86 phone forced to pick one side.
- **"What computer access did the AI actually use"** — bust the myth: it did **NOT** drive the
  desktop / take screenshots; it only used `Bash` (terminal), `Read` (files) and `WebSearch`.
Prefer Remotion-native vector mockups over real screenshots (terminals are **redrawn and
beautified**, not screen-grabbed). Code snippets may be shown **in full** (they're faked/safe).

---

## Content & Context (Cover + 5 Sections + Outro to Animate)

### Cover / Hook (≈8s)
- Reusable **片頭模板**: small **Ai-Wisdom** logo lockup top-left, then the suspense question
  slams in center.
- On-screen title: **「我的 WhatsApp,為什麼一個字都發不出去?」**
- Subtitle: **「一次用 Claude Code 拆解真實生意問題的實戰排查」**
- Establishing visual: a phone 📱 with a message stuck on a spinning ✘, and the offending
  pipeline log line frozen in red: **`📲 WhatsApp：⛔ 暫停（待 Status 方案，本次未發）`**
- Date chip optional. The AI host 🤖 peeks in: 「先別急著修——先搞懂它為什麼不發。」

### Section 1 — 問題現場:那行紅色的 ⛔ (≈45s)
Teach what triggered the investigation: a daily auto-publish pipeline finished, but the
WhatsApp step printed a red "paused" line instead of sending. Land this line on screen:
- Key line: **「它不是報錯,是直接『暫停』——本次沒發。」**
**Visual Elaboration:** A redrawn, beautified "pipeline run" card list — steps `Shopify ✔`,
`Facebook ✔`, `Instagram ✔`, `Threads ✔`, then **`WhatsApp ⛔ 暫停`** in red while the rest are
green. Zoom into the red row; the exact string **`📲 WhatsApp：⛔ 暫停（待 Status 方案，本次未發）`**
slides up as a magnified chip. The bottom **diagnosis timeline** appears and lights node **①
問題現場** (pulsing). Goal banner pins to the corner: 📱 **「目標:讓 `+86 188-XXXX-XXXX` 這支客服號收到通知。」**

### Section 2 — 第一層診斷:是 bug,還是設計? (≈75s)
Teach the first reasoning move: classify before fixing. Open the pipeline definition file and
discover the step was **deliberately paused by a human note**, dated, not a crash.
- Key line: **「翻開檔案才發現:是我自己上週叫它『暫停』的。」**
**Visual Elaboration:** Split screen. LEFT = imagined "crash" path (red stack-trace card) with a
big ✘ "其實不是這個". RIGHT = a redrawn file card `~/.../SKILL.md` scrolling to a highlighted
human comment block: **`STEP 4.8：WhatsApp 通知 —— ⛔ 暫停（2026-06-20 指示）`** with a 🧑‍💻 author
chip. A magnifier glides over the date. Timeline node **② 是 bug 還是設計?** lights green on
"設計", and a label stamps: **「分類 → 排除誤判」**. The AI host 🤖 nods: 「先分類,才不會白修。」

### Section 3 — 拆解暫停背後的「四個坑」 (≈150s, the densest)
Teach that "paused" hid four independent real blockers. Reveal them as **four numbered cards**,
one at a time, each with its own mini-mockup. Land this line first:
- Key line: **「一個『暫停』,底下其實卡了四件事。」**
**Visual Elaboration:** A 2×2 grid of infographic cards builds in sequence; the timeline node
**③ 拆四個坑** pulses throughout and shows a 1→4 counter.
- **坑 1 — 🧪 測試號只能發 5 個人。** Mock a "allowed recipients" panel: 5 empty slots, the
  📱 `+86 188-XXXX-XXXX` card tries to dock but bounces with **`error 131030`**. Caption:
  **「測試號(+1 555…)只能發給 5 個已驗證的人,+86 不在名單。」**
- **坑 2 — 🔑 `token` 是壞的(真實踩坑,保留)。** Show a `Bash` card running
  `curl …/Graph API`, response card returns **`{ "code": 190, "message": "token could not be
  decrypted" }`** in red. Side-by-side: a stubby 40-char `EAA…••••` vs a long real token ruler.
  Caption: **「我實測打 API,token 直接被拒。就算解除暫停也會卡在這。」**
- **坑 3 — 📣 `Status` 根本沒有 API。** Show a Cloud API "能做什麼" menu: `傳訊息 ✔`,
  `範本 ✔`, `媒體 ✔`, **`貼到 Status ❌`** greyed out. A 📣 ring floats over a phone labelled
  **「Status 只活在消費者 App 裡」**. Caption: **「想自動貼 Status?官方 API 沒有這個端點。」**
- **坑 4 — 📱 一個號碼不能同時兩用。** Split diagram: the +86 phone in the middle, an arrow to
  "消費者 App(客人用 `wa.me` 私訊它)" on one side and "Cloud API 發送端" on the other, with a
  ⚠ "二選一" lock. Add a small 🇨🇳/VPN chip: **「+86 在中國,還得靠 VPN 才穩。」**
End card of the section stacks all four red ✘ chips: **「測試號 5 人 · token 壞 · 無 Status API ·
號碼二選一」**.

### Section 4 — 收斂目標 + 三方案評估表 (≈120s)
Teach the converging move (separate "收到通知" from "貼 Status 給客人"), then compare three
solutions in an animated table.
- Key line: **「『收到通知』和『貼 Status 給客人』是兩件事——先鎖定做得到的那個。」**
**Visual Elaboration:** First a small fork diagram: one path **「📱 讓 +86 收到」(可達成 ✔)** vs
**「📣 自動貼 Status」(無 API ✘)**; the achievable path glows. Then an **evaluation table**
animates in row-by-row (columns: 方案 / 怎麼做 / 速度·成本 / 限制):
- **方案 A — 把 +86 加進測試號白名單**｜沿用現有架構｜🟢 約 10 分鐘 · 免費｜測試號限 5 人、要先換有效 token
- **方案 B — `CallMeBot` 免 API 直推**｜curl 一個網址就進手機｜🟢 約 5 分鐘 · 免費｜第三方中繼、只能傳非敏感文字
- **方案 C — 另辦新號 + 商業驗證**｜正規生產化、可群發客人｜🟡 數天 · 按對話計費｜要 Business Verification
The **方案 A** row gets a green ✔ "推薦" ribbon as it settles. Timeline node **④** lights green.

### Section 5 — 推薦解法 A + 人工貼 Status + 效率對比 (≈110s)
Teach the chosen path end-to-end, the pragmatic Status workaround, and the efficiency payoff.
- Key line: **「選 A:驗證收件人 + 換有效 token + 解除暫停,十分鐘讓手機今天就收到。」**
**Visual Elaboration:** A 3-step horizontal mini-pipeline animates: **`① 加 +86 為驗證收件人`
→ `② 換成有效 token` → `③ 解除 STEP 4.8 暫停`**, ending with the 📱 phone finally buzzing a
green ✔ notification. Then a "Status 務實解" card: 🤖 prepares 圖+文案 → a 👆 one-tap "貼到
Status" by a human (because no API). Finish with an **效率對比** bar: **「人工土法查:約半天」**
(long amber bar) vs **「AI 協助:約 10 分鐘」** (short green bar). Timeline node **⑤** lights green;
all five nodes now green — the spine is complete.

### Outro — 你能學到什麼 (≈15s)
Three takeaway cards flip in (reusable **片尾模板**):
1. **「先分類:是 bug 還是設計,別急著修。」**
2. **「拆到底:一個現象,底下可能卡好幾件事。」**
3. **「誠實標限制:做不到的(像 Status API)就說做不到,給務實替代。」**
Then a **"AI 到底動了什麼權限?" myth-bust mini-card**: ✔ `Bash`(終端機)· ✔ `Read`(讀檔)·
✔ `WebSearch`(查資料)／ ✘ 沒有控制桌面、沒有截圖。 End card: **Ai-Wisdom** logo +
**「你會選哪個方案?留言告訴我 👇」**(CTA = 留言互動). No next-episode teaser.

---

Let me know if you have any questions — especially anything that should inform the aesthetic,
the AI-host character design, the recurring-motif icon set, the mockup/placeholder generation
logic (faked terminals, evaluation table, the light-up timeline flowchart), and how the 16:9
master should reflow into the 9:16 Shorts cut — before you start writing the Remotion code.
