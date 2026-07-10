import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { BRAND_MARK, FONT } from "../../shared-skills/theme";
import spec from "../_explainer/specs/claude-code-md-memory.json";
import voManifest from "../_explainer/specs/claude-code-md-memory.vo.json";
import { WhiteBg, ACC, darkCard, Glare, hairline, emberClip, rgba, accOf } from "./glass";

/**
 * claude-code-md-memory 黑曜石精修版（16:9, 1920×1080, 30fps）。
 * 資料驅動：讀 _explainer/specs/claude-code-md-memory.json（已過稿）+ 同名 vo.json + 曉晴 VO(public/vo/claude-code-md-memory)。
 * 只換視覺皮＝淺底畫布 + 黑曜石深卡玻璃 + 橙漸層鉤子 + 概念錨頂帶（系列一致）。
 */
const FPS = 30;
const VO = voManifest as Record<string, number>;
const SC = spec.script as Record<string, string>;
const sec = (id: string) => Math.round((VO[id] ?? 3) * FPS);
const LEAD = 14, GAP = 10, TAIL = 20, XFADE = 12;

const fadeIn = (f: number, at: number, d = 12) =>
  interpolate(f, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

type Scene = any;
const SCENES = spec.scenes as Scene[];

/* ── 每景概念錨（index 對 scene；null=不顯示：封面/禮物/outro）── */
const OS: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: ACC.emberSoft }}>{children}</span>;
const ANCHORS: (React.ReactNode | null)[] = [
  null,
  <>CLAUDE.md 沒用 = <OS>沒搞懂載入機制</OS></>,
  <>四層 = <OS>疊加不覆蓋</OS></>,
  <>四原則 = <OS>Size / Structure / Specificity / Consistency</OS></>,
  <>具體 <OS>優於</OS> 模糊</>,
  <>200 行內 = <OS>cache-friendly</OS></>,
  null,
  null,
];

const sceneDur = (s: Scene) =>
  LEAD + s.cues.reduce((a: number, id: string) => a + sec(id) + GAP, 0) - GAP + TAIL;
const sceneMarks = (s: Scene) => {
  let off = LEAD;
  return s.cues.map((id: string) => {
    const m = { id, start: off, end: off + sec(id) };
    off += sec(id) + GAP;
    return m;
  });
};
export const claudeMdMemoryObsidianFrames = () =>
  SCENES.reduce((a, s) => a + sceneDur(s), 0) - (SCENES.length - 1) * XFADE;

/* ── 共用小件 ─────────────────────────────────────────────── */
const Brand: React.FC = () => (
  <div style={{ position: "absolute", top: 40, right: 56, display: "flex", alignItems: "center", gap: 12, ...darkCard(ACC.ember, { r: 999, glow: 0.45 }), padding: "9px 22px" }}>
    <span style={{ width: 10, height: 10, borderRadius: 999, background: `linear-gradient(135deg, ${ACC.ember}, ${ACC.emberSoft})`, boxShadow: `0 0 9px ${rgba(ACC.ember, 0.8)}` }} />
    <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: "#fff" }}>Ai-Wisdom</span>
  </div>
);

const Kicker: React.FC<{ text: string; c: string }> = ({ text, c }) => (
  <div style={{ position: "absolute", top: 44, left: 60 }}>
    <div style={{ ...darkCard(c, { r: 999, glow: 0.5 }), padding: "9px 26px", display: "inline-flex", alignItems: "center", gap: 12 }}>
      <span style={{ width: 9, height: 9, borderRadius: 999, background: c, boxShadow: `0 0 9px ${rgba(c, 0.85)}` }} />
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 27, letterSpacing: 2, color: "#fff" }}>{text}</span>
    </div>
  </div>
);

const Heading: React.FC<{ zh: string; en?: string; f: number }> = ({ zh, en, f }) => {
  const o = fadeIn(f, 4, 14);
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 14}px)` }}>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 62, letterSpacing: 1, color: ACC.ink }}>{zh}</div>
      {en && <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 27, letterSpacing: 4, color: ACC.muted, marginTop: 8 }}>{en}</div>}
    </div>
  );
};

/**
 * 結論橫幅。bottom:200（比 fb-autopost 原本的 168 加大）— 兩行長字幕（Caption
 * maxWidth 1640, bottom:50）最深可達約 top=890；200 的淨空能確保兩者不重疊
 * （2026-07-07 教訓：淺色 _explainer 模板同款橫幅曾因間距不足被兩行字幕蓋住）。
 */
const KeyLine: React.FC<{ text: string; c: string; show: boolean }> = ({ text, c, show }) => {
  const f = useCurrentFrame();
  const o = show ? fadeIn(f, 0, 12) : 0;
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 200, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ ...darkCard(c, { r: 16, glow: 0.7 }), position: "relative", overflow: "hidden", padding: "16px 40px", maxWidth: 1480 }}>
        <Glare />
        <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 34, letterSpacing: 0.5, color: "#fff" }}>{text}</span>
      </div>
    </div>
  );
};

/* ── 終端機深卡（cmd/out/err/ok/cmt）── */
const lineColor = (k: string): React.CSSProperties => {
  switch (k) {
    case "cmd": return { color: "#fff", fontWeight: 700 };
    case "err": return { color: "#FF9DAC", fontWeight: 600 };
    case "ok": return { color: "#7EE6B6", fontWeight: 600 };
    case "cmt": return { color: rgba("#ffffff", 0.5), fontWeight: 500 };
    default: return { color: rgba("#ffffff", 0.82), fontWeight: 500 };
  }
};
const TermCard: React.FC<{ title?: string; lines: { k: string; t: string }[]; c: string; f: number; w?: number }> = ({ title, lines, c, f, w = 1440 }) => {
  const o = fadeIn(f, 8, 14);
  return (
    <div style={{ ...darkCard(c, { r: 22, glow: 0.95 }), position: "relative", overflow: "hidden", width: w, opacity: o, transform: `translateY(${(1 - o) * 16}px)` }}>
      <Glare />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, padding: "16px 26px", borderBottom: `1px solid ${rgba("#ffffff", 0.1)}` }}>
        <span style={{ width: 13, height: 13, borderRadius: 999, background: "#FF5F57" }} />
        <span style={{ width: 13, height: 13, borderRadius: 999, background: "#FEBC2E" }} />
        <span style={{ width: 13, height: 13, borderRadius: 999, background: "#28C840" }} />
        {title && <span style={{ marginLeft: 12, fontFamily: FONT.monoCjk, fontSize: 24, color: rgba("#ffffff", 0.6) }}>{title}</span>}
      </div>
      <div style={{ position: "relative", padding: "22px 30px", display: "flex", flexDirection: "column", gap: 15 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: FONT.monoCjk, fontSize: l.t.length > 40 ? 26 : 30, lineHeight: 1.32, ...lineColor(l.k) }}>
            {l.k === "cmd" && <span style={{ color: ACC.gold, marginRight: 12 }}>$</span>}
            {l.k === "cmt" && <span style={{ color: rgba("#ffffff", 0.32), marginRight: 8 }}>#</span>}
            {l.t}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── 場景視覺 ─────────────────────────────────────────────── */
const CoverScene: React.FC<{ s: Scene; f: number }> = ({ s, f }) => {
  // 封面第 0 幀即完整亮相（門面＝縮圖同款），符合「封面 0 秒亮相」鐵則。
  const o = fadeIn(f, -30, 16);
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: ACC.ink }}>
      <div style={{ position: "absolute", top: 62, left: 96, display: "flex", alignItems: "center", gap: 22, opacity: o }}>
        <div style={{ ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "10px 28px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 11, height: 11, borderRadius: 999, background: `linear-gradient(135deg, ${ACC.ember}, ${ACC.emberSoft})`, boxShadow: `0 0 10px ${rgba(ACC.ember, 0.8)}` }} />
          <span style={{ fontWeight: 700, fontSize: 30, letterSpacing: 2, color: "#fff" }}>Claude Code 深度教學</span>
        </div>
        <span style={{ fontWeight: 500, fontSize: 27, letterSpacing: 6, color: ACC.muted }}>{BRAND_MARK}</span>
      </div>

      <div style={{ position: "absolute", top: 194, left: 96, opacity: o, transform: `translateY(${(1 - o) * 18}px)` }}>
        <div style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: 72, letterSpacing: 1, color: ACC.ink }}>{s.titlePre}</div>
        <div style={{ ...emberClip, background: "linear-gradient(160deg, #F09A6B 0%, #D97757 42%, #B54C29 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", fontWeight: 800, fontSize: 100, letterSpacing: -2, lineHeight: 1.08, marginTop: 8, maxWidth: 1060, filter: `drop-shadow(0 8px 20px ${rgba(ACC.ember, 0.35)})` }}>{s.titlePost}</div>
        <div style={{ marginTop: 30, display: "flex", alignItems: "flex-start", gap: 22, maxWidth: 1010 }}>
          <span style={{ width: 60, height: 3, background: ACC.ember, borderRadius: 2, marginTop: 22, flexShrink: 0 }} />
          <span style={{ fontWeight: 500, fontSize: 34, lineHeight: 1.34, letterSpacing: 1, color: ACC.inkSoft }}>{spec.brand.tagline}</span>
        </div>
      </div>

      {/* 數字 chips */}
      <div style={{ position: "absolute", bottom: 214, left: 96, display: "flex", gap: 20, opacity: o }}>
        {(s.chips ?? []).map((ch: any, i: number) => {
          const c = accOf(ch.accent);
          return (
            <div key={i} style={{ ...darkCard(c, { r: 18, glow: 0.75 }), position: "relative", overflow: "hidden", padding: "18px 24px", display: "flex", alignItems: "center", gap: 10, maxWidth: 260 }}>
              <Glare />
              <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 40, color: "#fff", textShadow: `0 0 18px ${rgba(c, 0.6)}` }}>{ch.n}</span>
              <span style={{ position: "relative", fontWeight: 600, fontSize: 24, color: rgba("#ffffff", 0.82), lineHeight: 1.25 }}>{ch.t}</span>
            </div>
          );
        })}
      </div>

      {/* 右：master prompt 獨石碑 */}
      <div style={{ position: "absolute", top: 150, right: 92, width: 620, ...darkCard(ACC.ember, { r: 40, glow: 1.2 }), overflow: "hidden", padding: "40px 42px", transform: `rotate(-2.5deg)`, opacity: o }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(54% 30% at 50% 20%, ${rgba(ACC.ember, 0.36)} 0%, transparent 72%)` }} />
        <Glare />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 30 }}>💬</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 27, letterSpacing: 1, color: rgba("#ffffff", 0.7) }}>你只要對 Claude 說一句話</span>
        </div>
        <div style={{ position: "relative", padding: "22px 24px", borderRadius: 16, background: rgba("#060a14", 0.7), border: `1px solid ${rgba(ACC.ember, 0.35)}`, boxShadow: `inset 0 2px 6px ${rgba("#000", 0.5)}` }}>
          <span style={{ fontFamily: FONT.monoCjk, fontSize: 27, lineHeight: 1.42, color: "#fff" }}>
            <span style={{ color: ACC.gold }}>$</span> 「Hi Claude，幫我生成一份寫得好的 <span style={{ color: ACC.emberSoft }}>CLAUDE.md</span>」
          </span>
        </div>
        <div style={{ ...hairline, position: "relative", margin: "26px 0 22px" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 15 }}>
          {["四層位置：Managed/User/Project/Local", "四原則：Size/Structure/Specificity/Consistency", "寫一次 · 每次 session 自動套用"].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 26, color: ACC.emberSoft, textShadow: `0 0 12px ${rgba(ACC.ember, 0.6)}` }}>✓</span>
              <span style={{ fontWeight: 500, fontSize: 25, color: rgba("#ffffff", 0.85) }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const TerminalScene: React.FC<{ s: Scene; f: number; showKey: boolean }> = ({ s, f, showKey }) => {
  const c = accOf(s.accent);
  const isGift = (s.kicker || "").includes("禮物");
  return (
    <AbsoluteFill>
      <Kicker text={s.kicker} c={c} />
      <Brand />
      <Heading zh={s.headingZh} en={s.headingEn} f={f} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <TermCard title={s.terminal.title} lines={s.terminal.lines} c={c} f={f} w={isGift ? 1560 : 1440} />
      </AbsoluteFill>
      {s.keyline && <KeyLine text={s.keyline} c={c} show={showKey} />}
    </AbsoluteFill>
  );
};

const PlacesScene: React.FC<{ s: Scene; f: number; showKey: boolean }> = ({ s, f, showKey }) => {
  const c = accOf(s.accent);
  return (
    <AbsoluteFill>
      <Kicker text={s.kicker} c={c} />
      <Brand />
      <Heading zh={s.headingZh} en={s.headingEn} f={f} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 28 }}>
          {s.items.map((it: any, i: number) => {
            const ic = accOf(it.accent);
            const o = fadeIn(f, 10 + i * 8, 14);
            return (
              <div key={i} style={{ ...darkCard(ic, { r: 22, glow: 0.85 }), position: "relative", overflow: "hidden", width: 420, padding: "26px", display: "flex", flexDirection: "column", gap: 14, opacity: o, transform: `translateY(${(1 - o) * 18}px)` }}>
                <Glare />
                <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ width: 52, height: 52, borderRadius: "50%", background: rgba(ic, 0.18), border: `2px solid ${ic}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{it.icon}</span>
                  <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 30, color: "#fff" }}>{it.title}</span>
                </div>
                <div style={{ position: "relative", fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: 24, color: rgba("#ffffff", 0.75), background: rgba("#060a14", 0.6), border: `1px solid ${rgba(ic, 0.3)}`, borderRadius: 10, padding: "10px 14px" }}>{it.path}</div>
                <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 23, color: rgba("#ffffff", 0.68), lineHeight: 1.35 }}>{it.note}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {s.keyline && <KeyLine text={s.keyline} c={c} show={showKey} />}
    </AbsoluteFill>
  );
};

const PipelineScene: React.FC<{ s: Scene; f: number; showKey: boolean }> = ({ s, f, showKey }) => {
  const c = accOf(s.accent);
  return (
    <AbsoluteFill>
      <Kicker text={s.kicker} c={c} />
      <Brand />
      <Heading zh={s.headingZh} en={s.headingEn} f={f} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {s.nodes.map((n: any, i: number) => {
            const nc = accOf(n.accent);
            const o = fadeIn(f, 10 + i * 8, 14);
            return (
              <React.Fragment key={i}>
                <div style={{ ...darkCard(nc, { r: 24, glow: 0.9 }), position: "relative", overflow: "hidden", width: 290, minHeight: 210, padding: "28px 22px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12, opacity: o, transform: `translateY(${(1 - o) * 18}px)` }}>
                  <Glare />
                  <span style={{ position: "relative", fontSize: 56 }}>{n.icon}</span>
                  <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 32, color: "#fff" }}>{n.label}</span>
                  {n.sub && <span style={{ position: "relative", fontWeight: 500, fontSize: 22, color: rgba("#ffffff", 0.66), lineHeight: 1.3 }}>{n.sub}</span>}
                </div>
                {i < s.nodes.length - 1 && <span style={{ fontSize: 40, fontWeight: 800, color: ACC.emberSoft, opacity: fadeIn(f, 14 + i * 8, 12) }}>→</span>}
              </React.Fragment>
            );
          })}
        </div>
      </AbsoluteFill>
      {s.keyline && <KeyLine text={s.keyline} c={c} show={showKey} />}
    </AbsoluteFill>
  );
};

const CompareScene: React.FC<{ s: Scene; f: number; showKey: boolean }> = ({ s, f, showKey }) => {
  const c = accOf(s.accent);
  const Card = ({ side, badge, code, note, delay }: any) => {
    const good = side === "good";
    const cc = good ? ACC.mint : ACC.rose;
    const o = fadeIn(f, delay, 14);
    return (
      <div style={{ ...darkCard(cc, { r: 24, glow: 0.9 }), position: "relative", overflow: "hidden", width: 680, opacity: o, transform: `translateY(${(1 - o) * 18}px)` }}>
        <Glare />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, padding: "18px 26px", borderBottom: `1px solid ${rgba("#ffffff", 0.1)}` }}>
          <span style={{ width: 36, height: 36, borderRadius: 999, background: cc, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800 }}>{good ? "✔" : "✘"}</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 32, color: "#fff" }}>{badge}</span>
        </div>
        <div style={{ position: "relative", padding: "24px 26px" }}>
          <div style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: 24, color: "#fff", background: rgba("#060a14", 0.6), border: `1px solid ${rgba(cc, 0.3)}`, borderRadius: 12, padding: "16px 20px", lineHeight: 1.4 }}>{code}</div>
          <div style={{ marginTop: 16, fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 27, color: rgba("#ffffff", 0.78), lineHeight: 1.45 }}>{note}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Kicker text={s.kicker} c={c} />
      <Brand />
      <Heading zh={s.headingZh} en={s.headingEn} f={f} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 34 }}>
          <Card side="bad" {...s.bad} delay={10} />
          <Card side="good" {...s.good} delay={20} />
        </div>
      </AbsoluteFill>
      {s.keyline && <KeyLine text={s.keyline} c={c} show={showKey} />}
    </AbsoluteFill>
  );
};

const OutroScene: React.FC<{ s: Scene; f: number }> = ({ s, f }) => {
  const o = fadeIn(f, 4, 16);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT.uiCjk }}>
      <div style={{ textAlign: "center", opacity: o }}>
        <div style={{ fontWeight: 800, fontSize: 96, color: ACC.ink }}>感謝 <span style={emberClip}>觀看</span>！</div>
        <div style={{ fontWeight: 600, fontSize: 40, color: ACC.inkSoft, marginTop: 14 }}>覺得有幫助，就用一個動作支持 👇</div>
        <div style={{ display: "flex", gap: 26, justifyContent: "center", marginTop: 44 }}>
          {[["👍", "按讚", ACC.mint], ["🔔", "訂閱", ACC.rose], ["🔗", "分享", ACC.signal]].map(([e, t, c], i) => (
            <div key={i} style={{ ...darkCard(c as string, { r: 999, glow: 0.8 }), position: "relative", overflow: "hidden", padding: "18px 48px", display: "flex", alignItems: "center", gap: 14, opacity: fadeIn(f, 16 + i * 6, 12) }}>
              <Glare />
              <span style={{ position: "relative", fontSize: 40 }}>{e}</span>
              <span style={{ position: "relative", fontWeight: 800, fontSize: 42, color: "#fff" }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 44, display: "inline-flex", alignItems: "center", gap: 14, ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "12px 30px" }}>
          <span style={{ fontWeight: 800, fontSize: 30, color: "#fff" }}>Ai-Wisdom</span>
          <span style={{ fontWeight: 500, fontSize: 26, letterSpacing: 3, color: rgba("#ffffff", 0.6) }}>· Claude Code 深度教學系列</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── 字幕 + 頂帶 + 場景外殼 ── */
const Caption: React.FC<{ text: string; at: number; until: number }> = ({ text, at, until }) => {
  const f = useCurrentFrame();
  const o = fadeIn(f, at, 6) * (1 - fadeIn(f, until - 6, 6));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 50, textAlign: "center", opacity: o }}>
      <div style={{ display: "inline-block", maxWidth: 1640, padding: "16px 38px", borderRadius: 16, background: "rgba(13,19,34,0.72)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 10px 26px rgba(11,16,32,0.22), inset 0 1px 0 rgba(255,255,255,0.16)" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 38, lineHeight: 1.42, color: "#fff", letterSpacing: 0.5 }}>{text}</div>
      </div>
    </div>
  );
};

const TopBanner: React.FC<{ node: React.ReactNode }> = ({ node }) => {
  const f = useCurrentFrame();
  if (!node) return null;
  return (
    <div style={{ position: "absolute", top: 40, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: fadeIn(f, 6, 16) }}>
      <div style={{ padding: "11px 34px", borderRadius: 999, background: "rgba(13,19,34,0.66)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 10px 24px rgba(11,16,32,0.24), inset 0 1px 0 rgba(255,255,255,0.22)" }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 30, color: "#f4f7fb", letterSpacing: 1 }}>{node}</span>
      </div>
    </div>
  );
};

const SceneShell: React.FC<{ idx: number }> = ({ idx }) => {
  const s = SCENES[idx];
  const f = useCurrentFrame();
  const marks = sceneMarks(s);
  const anchor = ANCHORS[idx];
  const keyAtCue = s.keylineAtCue ?? 3;
  const keyStart = marks[Math.min(keyAtCue, marks.length - 1)]?.start ?? 9999;
  let visual: React.ReactNode;
  if (s.type === "cover") visual = <CoverScene s={s} f={f} />;
  else if (s.type === "places") visual = <PlacesScene s={s} f={f} showKey={f >= keyStart} />;
  else if (s.type === "pipeline") visual = <PipelineScene s={s} f={f} showKey={f >= keyStart} />;
  else if (s.type === "compare") visual = <CompareScene s={s} f={f} showKey={f >= keyStart} />;
  else if (s.type === "outro") visual = <OutroScene s={s} f={f} />;
  else visual = <TerminalScene s={s} f={f} showKey={f >= keyStart} />;

  return (
    <AbsoluteFill>
      {visual}
      {/* 頂帶（概念錨）— 封面/gift/outro 無 */}
      {anchor && s.type !== "cover" && <TopBanner node={anchor} />}
      {marks.map((m: any) => (
        <Caption key={m.id} text={SC[m.id]} at={m.start} until={m.end + GAP} />
      ))}
      {marks.map((m: any) => (
        <Sequence key={`a-${m.id}`} from={m.start}>
          <Audio src={staticFile(`vo/claude-code-md-memory/${m.id}.mp3`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** 乾淨封面縮圖（無字幕、元素全淡入）— 給 YouTube 自訂縮圖用。 */
export const ClaudeCodeMdMemoryThumb: React.FC = () => (
  <AbsoluteFill style={{ textSpacingTrim: "space-all" }}>
    <WhiteBg />
    <CoverScene s={SCENES[0]} f={60} />
  </AbsoluteFill>
);

export const ClaudeCodeMdMemoryObsidian: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  // textSpacingTrim off：Chrome 的 CJK 標點擠壓在「全形標點相鄰但分屬不同字型分片」時
  // （本片終端機卡「幫我檢查...「」」等含全形引號行）會逐 render-worker 不一致 → 整行半字寬跳。
  <AbsoluteFill style={{ textSpacingTrim: "space-all" }}>
    <WhiteBg />
    {bgm && <Audio loop src={staticFile("bgm-claude-code-md-memory.mp3")} volume={0.11} />}
    <TransitionSeries>
      {SCENES.flatMap((s, i) => {
        const seq = (
          <TransitionSeries.Sequence key={`seq-${i}`} durationInFrames={sceneDur(s)}>
            <SceneShell idx={i} />
          </TransitionSeries.Sequence>
        );
        if (i === 0) return [seq];
        return [
          <TransitionSeries.Transition key={`tr-${i}`} presentation={fade()} timing={linearTiming({ durationInFrames: XFADE })} />,
          seq,
        ];
      })}
    </TransitionSeries>
  </AbsoluteFill>
);
