import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONT } from "../../shared-skills/theme";
import { ACC, Glare, darkCard, emberPill, hairline, rgba } from "./glass";

/**
 * 「新手知道一下比較好的名詞」EP07 · Claude Code Plan Mode 各景 — 黑曜石高級感精修版。
 * 文案取自每日影片工廠 2026-07-03 的雙 agent 合議 brief + 3 則真實 GitHub issue 抱怨 + Anthropic 官方數據,
 * 只重製視覺(白底+黑曜石玻璃卡),旁白/節拍完全沿用(vo-manifest.json)。
 * 版面鐵則:每景 Wrap 置中 flex+scale(1.14)+緊 padding,內容放大填滿。
 * 色義:ember 橙=主敘事/解法、signal 藍=機制/終端、mint 綠=實證、rose 紅=痛點、violet 紫=人工判斷。
 * 字重三層:800=鉤子數字、700=標題句、500=說明句。防抖:只用 opacity 淡入,無彈跳。
 */
export type Mark = { start: number; end: number };
export type SceneProps = { dur: number; marks: Mark[] };

const SLATE = "#3A4356";

const fi = (f: number, at: number, d = 12) =>
  interpolate(f, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const t7 = (size = 36): React.CSSProperties => ({ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: size, letterSpacing: 1, color: "#fff" });
const gloss = (size = 28): React.CSSProperties => ({ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: size, letterSpacing: 0.5, color: rgba("#ffffff", 0.74) });
const inkNote = (size = 34): React.CSSProperties => ({ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: size, letterSpacing: 1, color: ACC.inkSoft });

const Wrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 50px 104px" }}>
    <div style={{ transform: "scale(1.14)", transformOrigin: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>{children}</div>
  </div>
);

const Head: React.FC<{ children: React.ReactNode; mb?: number }> = ({ children, mb = 40 }) => (
  <div style={{ textAlign: "center", marginBottom: mb }}>
    <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 54, letterSpacing: 4, color: ACC.ink }}>{children}</div>
    <div style={{ width: 72, height: 5, borderRadius: 3, background: `linear-gradient(90deg, ${ACC.ember}, ${ACC.emberSoft})`, margin: "16px auto 0", boxShadow: `0 0 12px ${rgba(ACC.ember, 0.4)}` }} />
  </div>
);

const Card: React.FC<{ c: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ c, style, children }) => (
  <div style={{ position: "relative", overflow: "hidden", ...darkCard(c), ...style }}>
    <Glare />
    {children}
  </div>
);

/* ────────────────────────── S1 鉤子:核准框轟炸 → 先看計畫 ────────────────────────── */
export const HookScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const steps = [
    { e: "🔔🔔🔔", t: "改大範圍程式碼被核准框轟炸", c: ACC.rose, at: marks[0].start + 4 },
    { e: "💡", t: "先看完整計畫、一次決定", c: ACC.ember, at: marks[1].start + 8 },
    { e: "🌍", t: "這困擾,真的不是只有你", c: ACC.violet, at: marks[2].start + 6 },
  ];
  return (
    <Wrap>
      <div style={{ opacity: fi(f, 4) }}>
        <Head>先看計畫，一次決定</Head>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.t}>
            {i > 0 && <span style={{ fontSize: 52, color: ACC.muted, alignSelf: "center" }}>→</span>}
            <div style={{ opacity: fi(f, s.at) }}>
              <Card c={s.c} style={{ width: 460, padding: "44px 32px", textAlign: "center" }}>
                <div style={{ position: "relative", fontSize: 88 }}>{s.e}</div>
                <div style={{ ...t7(33), position: "relative", marginTop: 22, lineHeight: 1.4 }}>{s.t}</div>
              </Card>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: 48, opacity: fi(f, marks[2].start + 30) }}>
        <Card c={ACC.ember} style={{ padding: "20px 54px", borderRadius: 999 }}>
          <span style={{ ...t7(38), position: "relative" }}>接下來,把這招<span style={{ color: ACC.emberSoft }}>拆給你看</span></span>
        </Card>
      </div>
    </Wrap>
  );
};

/* ────────────────────────── S2 真實抱怨牆 ────────────────────────── */
export const ComplaintsScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const items = [
    { handle: "queen****juul", plat: "GitHub", c: ACC.rose, at: marks[1].start + 6, en: "Claude edits files without asking, despite “Ask Before Edits” being enabled. I've reset all settings, logged out and back in.", zh: "明明開了「編輯前先問」，還是直接改檔案，設定重來也沒用。" },
    { handle: "r2h****0714", plat: "GitHub", c: ACC.signal, at: marks[2].start + 6, en: "I asked a diagnostic question, and Claude interpreted it as an edit request — 20+ tool calls, no confirmation.", zh: "只是問一句原因，就被當成編輯指令，二十幾次呼叫直接改檔案。" },
    { handle: "emsch****rtz", plat: "GitHub", c: ACC.violet, at: marks[3].start + 6, en: "It's a little tedious to hit allow every time, even when the git working tree is clean.", zh: "工作樹明明乾淨，還是每次都要手動按允許，很麻煩。" },
    { handle: "Anthropic Eng", plat: "官方部落格", c: ACC.gold, at: marks[4].start + 6, en: "Users approve 93% of permission prompts — over time it becomes fatigue.", zh: "使用者平均核准 93% 的提示——按到疲乏，沒真的在看。" },
  ];
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head mb={30}>這不是只有你，大家都在抱怨</Head>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, width: 1560 }}>
        {items.map((it) => (
          <div key={it.handle} style={{ opacity: fi(f, it.at) }}>
            <Card c={it.c} style={{ padding: "26px 30px", minHeight: 190 }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 24, color: rgba("#ffffff", 0.9) }}>{it.handle}</span>
                <span style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 20, padding: "3px 12px", borderRadius: 999, background: rgba("#ffffff", 0.1), color: rgba("#ffffff", 0.6) }}>{it.plat}</span>
              </div>
              <div style={{ position: "relative", fontFamily: FONT.ui, fontWeight: 500, fontSize: 21, lineHeight: 1.45, color: rgba("#ffffff", 0.82), fontStyle: "italic" }}>"{it.en}"</div>
              <div style={{ position: "relative", ...gloss(24), marginTop: 12 }}>{it.zh}</div>
            </Card>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 34, opacity: fi(f, marks[5].start + 4) }}>
        <span style={inkNote(34)}>同一個痛，一個接一個，蓋滿整個螢幕</span>
      </div>
    </Wrap>
  );
};

/* ────────────────────────── S3 三招都沒真的解 ────────────────────────── */
export const FailedApproachesScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const cards = [
    { e: "😵‍💫", t: "全部按核准", n: "按到疲乏、不再真的看", c: ACC.rose, at: marks[1].start + 6 },
    { e: "🚀", t: "切自動模式全跳過", n: "危險改動也來不及攔", c: ACC.signal, at: marks[2].start + 6 },
    { e: "📄", t: "CLAUDE.md 交代規則", n: "版本一有 bug,交代照樣被忽略", c: ACC.violet, at: marks[3].start + 6 },
  ];
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head>大家想了三招，都沒真的解</Head>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 34 }}>
        {cards.map((c) => (
          <div key={c.t} style={{ opacity: fi(f, c.at) }}>
            <Card c={c.c} style={{ width: 460, padding: "42px 30px", textAlign: "center" }}>
              <div style={{ position: "relative", fontSize: 84 }}>{c.e}</div>
              <div style={{ ...t7(34), position: "relative", marginTop: 20 }}>{c.t}</div>
              <div style={{ ...gloss(26), position: "relative", marginTop: 12 }}>{c.n}</div>
            </Card>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 40, opacity: fi(f, marks[4].start + 6) }}>
        <Card c={ACC.rose} style={{ padding: "22px 50px", borderRadius: 999 }}>
          <span style={{ ...t7(34), position: "relative" }}>共同死穴：<span style={{ color: "#FF8A80" }}>按到疲乏 / 風險失控 / 交代不保證有效</span></span>
        </Card>
      </div>
    </Wrap>
  );
};

/* ────────────────────────── S4 解法:切進 Plan Mode ────────────────────────── */
export const SolutionScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const lines: { k: string; t: string; at: number; tone?: string }[] = [
    { k: "切換方式 1 · 快捷鍵", t: "Shift+Tab → default ⇄ acceptEdits ⇄ plan", at: marks[2].start + 6 },
    { k: "切換方式 2/3 · 啟動旗標或斜線指令", t: "$ claude --permission-mode plan　／　/plan <描述>", at: marks[3].start + 6 },
    { k: "設成預設", t: ".claude/settings.json → permissions.defaultMode = \"plan\"", at: marks[4].start + 6 },
    { k: "唯讀能力範圍", t: "✅ Read / 唯讀 Bash　　⛔ Edit / Write / 有副作用指令", at: marks[5].start + 6, tone: ACC.mint },
  ];
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[1].start) }}>
        <Head mb={30}>切進 Plan Mode，先出計畫再動手</Head>
      </div>
      <Card c={ACC.signal} style={{ width: 1500, padding: "38px 50px", opacity: fi(f, marks[1].start + 10) }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, position: "relative" }}>
          {lines.map((l, i) => (
            <React.Fragment key={l.k}>
              {i > 0 && <div style={hairline} />}
              <div style={{ opacity: fi(f, l.at), display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 22, letterSpacing: 2, color: rgba("#ffffff", 0.5) }}>{l.k}</span>
                <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 27, color: l.tone ?? rgba("#ffffff", 0.92) }}>{l.t}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </Card>
      <div style={{ marginTop: 36, opacity: fi(f, marks[5].start + 20) }}>
        <Card c={ACC.ember} style={{ padding: "20px 50px", borderRadius: 999 }}>
          <span style={{ ...t7(32), position: "relative" }}>Plan Mode = 唯讀 + 先出計畫，寫入類動作全部先擋下</span>
        </Card>
      </div>
    </Wrap>
  );
};

/* ────────────────────────── S5 差異對比 ────────────────────────── */
export const CompareScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head mb={34}>跟全部按核准、全部跳過差在哪</Head>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch", gap: 50 }}>
        <div style={{ opacity: fi(f, marks[1].start + 6) }}>
          <Card c={ACC.rose} style={{ width: 640, padding: "44px 42px" }}>
            <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 26, color: "#FF8A80", marginBottom: 16 }}>全部按核准 / 全部自動跳過</div>
            <div style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 600, fontSize: 22, color: rgba("#ffffff", 0.7), marginBottom: 18 }}>default: 逐步核准 · auto/bypass: 全部跳過</div>
            <div style={{ position: "relative", ...gloss(27), lineHeight: 1.5 }}>逐步核准按到疲乏、不再真的看；全部跳過連危險改動都放過</div>
          </Card>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 58, color: ACC.muted, opacity: fi(f, marks[3].start) }}>→</span>
        </div>
        <div style={{ opacity: fi(f, marks[3].start + 6) }}>
          <Card c={ACC.ember} style={{ width: 640, padding: "44px 42px" }}>
            <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 26, color: ACC.emberSoft, marginBottom: 16 }}>Plan Mode</div>
            <div style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 600, fontSize: 22, color: rgba("#ffffff", 0.9), marginBottom: 18 }}>$ claude --permission-mode plan</div>
            <div style={{ position: "relative", ...gloss(27), lineHeight: 1.5 }}>唯讀先出計畫、一次看完全貌，核准後才選自動 / 逐一 / 送 Ultraplan 共審</div>
          </Card>
        </div>
      </div>
      <div style={{ marginTop: 40, opacity: fi(f, marks[5].start + 6) }}>
        <Card c={ACC.ember} style={{ padding: "20px 50px", borderRadius: 999 }}>
          <span style={{ ...t7(32), position: "relative" }}>差異＝一次看全貌 + 按需核准 + 可送瀏覽器多人共審</span>
        </Card>
      </div>
    </Wrap>
  );
};

/* ────────────────────────── S6 實測佐證 ────────────────────────── */
export const ProofScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const stats = [
    { big: "20+", unit: "次", k: "default 模式核准", c: ACC.rose, at: marks[1].start + 6 },
    { big: "1", unit: "次", k: "plan 模式決定", c: ACC.gold, at: marks[1].start + 18 },
    { big: "93%", unit: "", k: "Anthropic 官方核准率", c: ACC.violet, at: marks[2].start + 6 },
  ];
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head mb={30}>怎麼知道真的有解？實測</Head>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 28, width: 1500 }}>
        {stats.map((s) => (
          <div key={s.k} style={{ opacity: fi(f, s.at) }}>
            <Card c={s.c} style={{ padding: "40px 20px", textAlign: "center" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8 }}>
                <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 92, color: s.c, textShadow: `0 0 22px ${rgba(s.c, 0.45)}` }}>{s.big}</span>
                <span style={{ ...gloss(28) }}>{s.unit}</span>
              </div>
              <div style={{ ...gloss(27), position: "relative", marginTop: 12 }}>{s.k}</div>
            </Card>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 40, opacity: fi(f, marks[3].start + 6) }}>
        <Card c={ACC.mint} style={{ padding: "20px 50px", borderRadius: 999 }}>
          <span style={{ ...t7(32), position: "relative" }}>官方文件寫在 permission-modes 頁面，非過時、非偏方</span>
        </Card>
      </div>
      <div style={{ marginTop: 22, opacity: fi(f, marks[4].start + 6) }}>
        <span style={inkNote(28)}>要調整計畫？Ctrl+G 直接編輯，或送進 Ultraplan 讓別人留言</span>
      </div>
    </Wrap>
  );
};

/* ────────────────────────── Outro ────────────────────────── */
export const PlanModeOutroScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const cards = [
    { e: "😵‍💫", t: "痛點：逐步核准按到疲乏，bug 甚至讓「先問我」照樣被略過", c: ACC.rose },
    { e: "🛠️", t: "解法：Shift+Tab / --permission-mode plan → 唯讀先出計畫", c: ACC.mint },
    { e: "⚡", t: "差異：一次看全貌 + 按需核准 + 可送 Ultraplan 多人共審", c: ACC.signal },
    { e: "✅", t: "實證：官方 permission-modes 內建機制，非過時、非偏方", c: ACC.violet },
  ];
  const ctas = ["🔔 訂閱", "👍 按讚", "↗️ 分享"];
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head mb={30}>總整理</Head>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, width: 1560, marginBottom: 40 }}>
        {cards.map((c, i) => (
          <div key={c.t} style={{ opacity: fi(f, marks[1 + i].start + 4) }}>
            <Card c={c.c} style={{ padding: "26px 30px", display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{ position: "relative", fontSize: 46 }}>{c.e}</span>
              <span style={{ ...gloss(24), position: "relative", lineHeight: 1.4 }}>{c.t}</span>
            </Card>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", opacity: fi(f, marks[5].start) }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 44, color: ACC.ink, marginBottom: 26 }}>感謝收看 🙏</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 34 }}>
          {ctas.map((t, i) => (
            <div key={t} style={{ opacity: fi(f, marks[5].start + 10 + i * 8) }}>
              <Card c={ACC.ember} style={{ padding: "18px 44px", borderRadius: 999 }}>
                <span style={{ ...t7(38), position: "relative" }}>{t}</span>
              </Card>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 30, opacity: fi(f, marks[5].start + 40) }}>
          <span style={{ fontFamily: FONT.monoCjk, fontWeight: 800, fontSize: 32, color: SLATE }}>EP07 ✓ ・ EP08 待續 →</span>
        </div>
      </div>
    </Wrap>
  );
};

/* ════════════════════════ 💬 PromptCard:「你只要對 Claude 說」 ════════════════════════
 * 標準規則(tutorial-video-show-claude-prompts):動作步驟要給觀眾可暫停複製的逐字 prompt。 */
export const PromptCard: React.FC<{ text: string; note?: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const o = fi(f, 4, 12);
  const caret = Math.floor(f / 14) % 2 === 0;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "70px 90px" }}>
      <div style={{ width: 1280, maxWidth: "100%", opacity: o, transform: `translateY(${(1 - o) * 22}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <span style={{ fontSize: 42 }}>💬</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 40, color: ACC.ink, letterSpacing: 2 }}>
            你只要對 <span style={{ color: ACC.ember }}>Claude</span> 說
          </span>
        </div>
        <div style={{ position: "relative", overflow: "hidden", ...darkCard(ACC.ember, { r: 24, glow: 1 }), padding: "36px 44px" }}>
          <Glare />
          <div style={{ position: "relative", fontFamily: FONT.monoCjk, fontWeight: 500, fontSize: 34, lineHeight: 1.62, color: "#fff", letterSpacing: 0.5 }}>
            <span style={{ color: ACC.gold, marginRight: 12 }}>&gt;</span>
            {text}
            <span style={{ opacity: caret ? 1 : 0, color: ACC.emberSoft }}>▌</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20, justifyContent: "center" }}>
          <span style={{ padding: "8px 24px", borderRadius: 999, background: rgba(ACC.ember, 0.1), border: `1px solid ${rgba(ACC.ember, 0.4)}`, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 26, color: ACC.ember }}>⏸ 暫停這格就能複製</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ════════════════════════ 片尾 Master Prompt:看到最後的禮物 ════════════════════════
 * 兩關驗證通過(對照 code.claude.com/docs/en/permission-modes.md 逐條核對 + 自我理解自測):
 * .claude/settings.json → permissions.defaultMode="plan"、/plan <描述>、Shift+Tab 三模式循環、
 * 核准後 Approve+Auto/Review each/Keep planning 三選項、Ctrl+G 編輯計畫,皆為已驗證機制。 */
const MASTER_LINES: React.ReactNode[] = [
  <><span style={{ color: ACC.emberSoft }}>Hi Claude</span>，我想在改動範圍比較大的時候，先看到你完整的計畫再決定要不要執行，不要每一步都跳出來問我。請幫我：</>,
  <><span style={{ color: ACC.gold }}>①</span> 檢查這個專案根目錄有沒有 <span style={{ color: ACC.emberSoft }}>.claude/settings.json</span>，沒有就幫我建一個</>,
  <><span style={{ color: ACC.gold }}>②</span> 在裡面加上 <span style={{ color: ACC.emberSoft }}>permissions.defaultMode</span> 設成 <span style={{ color: ACC.emberSoft }}>plan</span>，讓這個專案以後一開新對話就自動先進 Plan Mode(唯讀、只出計畫不動手)</>,
  <><span style={{ color: ACC.gold }}>③</span> 跟我解釋清楚：如果我只想針對「這一件事」單獨規劃，可以直接打 <span style={{ color: ACC.emberSoft }}>/plan</span> 加上我要做的事，例如 /plan 幫我重構 API 路由；不想每次都預設 plan 的話，也可以用 <span style={{ color: ACC.emberSoft }}>Shift+Tab</span> 手動切換</>,
  <><span style={{ color: ACC.gold }}>④</span> 提醒我：你出完計畫後，我會看到幾個選項——核准並自動執行、核准但每個編輯都給我看、或繼續調整計畫；想直接改計畫內容，教我用 <span style={{ color: ACC.emberSoft }}>Ctrl+G</span> 打開編輯器</>,
  <><span style={{ color: ACC.gold }}>⑤</span> 全部設定完，幫我確認 settings.json 是正確的 JSON 格式，沒有語法錯誤</>,
];

export const MasterPromptScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const giftAt = marks[0].start + 6;
  const bodyAt = marks[1].start + 2;
  const copyAt = marks[2].start + 2;
  return (
    <Wrap>
      <div style={{ width: 1580, maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 22, opacity: fi(f, giftAt, 12) }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 50, color: ACC.ink, letterSpacing: 2 }}>
            🎁 看到最後的<span style={{ color: ACC.ember }}>禮物</span>：完整指令
          </span>
        </div>
        <div style={{ position: "relative", overflow: "hidden", ...darkCard(ACC.ember, { r: 26, glow: 1.1 }), padding: "32px 46px", opacity: fi(f, bodyAt, 14) }}>
          <Glare />
          <div style={{ position: "relative", fontFamily: FONT.monoCjk }}>
            {MASTER_LINES.map((node, i) => (
              <div key={i} style={{ fontWeight: i === 0 ? 600 : 500, fontSize: i === 0 ? 26 : 25, lineHeight: 1.5, color: rgba("#ffffff", i === 0 ? 0.94 : 0.86), marginBottom: i === 0 ? 14 : 8, opacity: fi(f, bodyAt + 4 + i * 3, 10) }}>
                {node}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 22, opacity: fi(f, copyAt, 12) }}>
          <span style={{ ...emberPill, padding: "13px 34px", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 28 }}>⏸ 暫停整段複製</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 26, color: ACC.inkSoft }}>逐字完整版＝影片描述第一行</span>
        </div>
      </div>
    </Wrap>
  );
};
