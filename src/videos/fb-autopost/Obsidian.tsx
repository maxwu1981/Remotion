import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { BRAND_MARK, FONT } from "../../shared-skills/theme";
import spec from "../_explainer/specs/fb-autopost.json";
import voManifest from "../_explainer/specs/fb-autopost.vo.json";
import { WhiteBg, ACC, darkCard, Glare, hairline, emberClip, emberPill, rgba, accOf } from "./glass";
import { MetaBasicSettings, MetaExplorer } from "./MetaMock";

/**
 * fb-autopost 黑曜石精修版（16:9, 1920×1080, 30fps）。
 * 資料驅動：讀 _explainer/specs/fb-autopost.json（已過稿）+ 同名 vo.json + 曉晴 VO(public/vo/fb-autopost)。
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
  <>日更靠<OS>系統</OS>，不是靠意志力</>,
  <>四個零件，<OS>全在你電腦</OS></>,
  <>發文權 = <OS>一個 Meta App</OS></>,
  <>Token = <OS>發文的鑰匙</OS></>,
  <>Page Token = <OS>不過期的鑰匙</OS></>,
  <>發文 = <OS>兩步 API</OS></>,
  <>自動 = <OS>掛上排程</OS></>,
  <>去重＋回收 = <OS>天天不斷更</OS></>,
  <>Token 會過期，<OS>要顧</OS></>,
  <><OS>40 天</OS>，零介入</>,
  <>Token = <OS>密碼，別外洩</OS></>,
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
export const fbObsidianFrames = () =>
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

const KeyLine: React.FC<{ text: string; c: string; show: boolean }> = ({ text, c, show }) => {
  const f = useCurrentFrame();
  const o = show ? fadeIn(f, 0, 12) : 0;
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 168, display: "flex", justifyContent: "center", opacity: o }}>
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
          <div key={i} style={{ fontFamily: FONT.monoCjk, fontSize: 30, lineHeight: 1.32, ...lineColor(l.k) }}>
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
  const o = fadeIn(f, 2, 16);
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: ACC.ink }}>
      <div style={{ position: "absolute", top: 62, left: 96, display: "flex", alignItems: "center", gap: 22, opacity: o }}>
        <div style={{ ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "10px 28px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 11, height: 11, borderRadius: 999, background: `linear-gradient(135deg, ${ACC.ember}, ${ACC.emberSoft})`, boxShadow: `0 0 10px ${rgba(ACC.ember, 0.8)}` }} />
          <span style={{ fontWeight: 700, fontSize: 30, letterSpacing: 2, color: "#fff" }}>生活應用系列 EP04</span>
        </div>
        <span style={{ fontWeight: 500, fontSize: 27, letterSpacing: 6, color: ACC.muted }}>{BRAND_MARK}</span>
      </div>

      <div style={{ position: "absolute", top: 194, left: 96, opacity: o, transform: `translateY(${(1 - o) * 18}px)` }}>
        <div style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: 72, letterSpacing: 1, color: ACC.ink }}>{s.titlePre}</div>
        <div style={{ ...emberClip, background: "linear-gradient(160deg, #F09A6B 0%, #D97757 42%, #B54C29 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", fontWeight: 800, fontSize: 150, letterSpacing: -3, lineHeight: 1.02, marginTop: 6, filter: `drop-shadow(0 8px 20px ${rgba(ACC.ember, 0.35)})` }}>{s.titlePost}</div>
        <div style={{ marginTop: 30, display: "flex", alignItems: "flex-start", gap: 22, maxWidth: 1010 }}>
          <span style={{ width: 60, height: 3, background: ACC.ember, borderRadius: 2, marginTop: 22, flexShrink: 0 }} />
          <span style={{ fontWeight: 500, fontSize: 38, lineHeight: 1.34, letterSpacing: 2, color: ACC.inkSoft }}>{spec.brand.tagline}</span>
        </div>
      </div>

      {/* 數字 chips */}
      <div style={{ position: "absolute", bottom: 214, left: 96, display: "flex", gap: 20, opacity: o }}>
        {(s.chips ?? []).map((ch: any, i: number) => {
          const c = accOf(ch.accent);
          return (
            <div key={i} style={{ ...darkCard(c, { r: 18, glow: 0.75 }), position: "relative", overflow: "hidden", padding: "18px 28px", display: "flex", alignItems: "baseline", gap: 12 }}>
              <Glare />
              <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 58, color: "#fff", textShadow: `0 0 18px ${rgba(c, 0.6)}` }}>{ch.n}</span>
              <span style={{ position: "relative", fontWeight: 600, fontSize: 28, color: rgba("#ffffff", 0.82) }}>{ch.t}</span>
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
          <span style={{ fontFamily: FONT.monoCjk, fontSize: 30, lineHeight: 1.42, color: "#fff" }}>
            <span style={{ color: ACC.gold }}>$</span> 「Hi Claude，幫我做一套 FB 粉專<span style={{ color: ACC.emberSoft }}>每天自動發文</span>的系統」
          </span>
        </div>
        <div style={{ ...hairline, position: "relative", margin: "26px 0 22px" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 15 }}>
          {["素材夾 → 排程 07:11 → Graph API → 貼文", "Meta 官方 API · 免月費 · Token 在本機", "連續 40 天 · 34 篇 · 全自動零介入"].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 26, color: ACC.emberSoft, textShadow: `0 0 12px ${rgba(ACC.ember, 0.6)}` }}>✓</span>
              <span style={{ fontWeight: 500, fontSize: 27, color: rgba("#ffffff", 0.85) }}>{t}</span>
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

/** CH3/CH4：依真實 Meta UI 重建的 mockup 場景（kicker + 標題 + 💬 prompt 藥丸 + Meta 畫面 + keyline）。 */
const MockupScene: React.FC<{ s: Scene; f: number; showKey: boolean; mock: React.ReactNode; scale?: number }> = ({ s, f, showKey, mock, scale = 1 }) => {
  const c = accOf(s.accent);
  const prompt: string = s.terminal?.lines?.[0]?.t ?? "";
  const mo = fadeIn(f, 14, 14);
  return (
    <AbsoluteFill>
      <Kicker text={s.kicker} c={c} />
      <Brand />
      <Heading zh={s.headingZh} en={s.headingEn} f={f} />
      {prompt && (
        <div style={{ position: "absolute", top: 212, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: fadeIn(f, 8, 12) }}>
          <div style={{ ...darkCard(ACC.ember, { r: 14, glow: 0.6 }), position: "relative", overflow: "hidden", padding: "11px 28px", maxWidth: 1520 }}>
            <Glare />
            <span style={{ position: "relative", fontFamily: FONT.monoCjk, fontSize: 25, color: "#fff" }}>{prompt}</span>
          </div>
        </div>
      )}
      <div style={{ position: "absolute", top: 284, left: 0, right: 0, bottom: 116, display: "flex", alignItems: "center", justifyContent: "center", opacity: mo }}>
        <div style={{ transform: `translateY(${(1 - mo) * 16}px) scale(${scale})` }}>{mock}</div>
      </div>
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
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          {s.nodes.map((n: any, i: number) => {
            const nc = accOf(n.accent);
            const o = fadeIn(f, 10 + i * 8, 14);
            return (
              <React.Fragment key={i}>
                <div style={{ ...darkCard(nc, { r: 24, glow: 0.9 }), position: "relative", overflow: "hidden", width: 300, minHeight: 210, padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12, opacity: o, transform: `translateY(${(1 - o) * 18}px)` }}>
                  <Glare />
                  <span style={{ position: "relative", fontSize: 60 }}>{n.icon}</span>
                  <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 34, color: "#fff" }}>{n.label}</span>
                  {n.sub && <span style={{ position: "relative", fontWeight: 500, fontSize: 24, color: rgba("#ffffff", 0.66), lineHeight: 1.3 }}>{n.sub}</span>}
                </div>
                {i < s.nodes.length - 1 && <span style={{ fontSize: 46, fontWeight: 800, color: ACC.emberSoft, opacity: fadeIn(f, 14 + i * 8, 12) }}>→</span>}
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
          <div style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: 28, color: "#fff", background: rgba("#060a14", 0.6), border: `1px solid ${rgba(cc, 0.3)}`, borderRadius: 12, padding: "16px 20px", lineHeight: 1.4 }}>{code}</div>
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
          {[["👍", "按讚", ACC.mint], ["🔔", "訂閱", ACC.rose], ["🔗", "分享", ACC.fb]].map(([e, t, c], i) => (
            <div key={i} style={{ ...darkCard(c as string, { r: 999, glow: 0.8 }), position: "relative", overflow: "hidden", padding: "18px 48px", display: "flex", alignItems: "center", gap: 14, opacity: fadeIn(f, 16 + i * 6, 12) }}>
              <Glare />
              <span style={{ position: "relative", fontSize: 40 }}>{e}</span>
              <span style={{ position: "relative", fontWeight: 800, fontSize: 42, color: "#fff" }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 44, display: "inline-flex", alignItems: "center", gap: 14, ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "12px 30px" }}>
          <span style={{ fontWeight: 800, fontSize: 30, color: "#fff" }}>Ai-Wisdom</span>
          <span style={{ fontWeight: 500, fontSize: 26, letterSpacing: 3, color: rgba("#ffffff", 0.6) }}>· 生活應用系列 · {spec.brand.date.replace(/[^0-9-]/g, "")}</span>
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
  else if (idx === 3) visual = <MockupScene s={s} f={f} showKey={f >= keyStart} mock={<MetaBasicSettings />} />;
  else if (idx === 4) visual = <MockupScene s={s} f={f} showKey={f >= keyStart} mock={<MetaExplorer />} scale={0.82} />;
  else if (s.type === "pipeline") visual = <PipelineScene s={s} f={f} showKey={f >= keyStart} />;
  else if (s.type === "compare") visual = <CompareScene s={s} f={f} showKey={f >= keyStart} />;
  else if (s.type === "outro") visual = <OutroScene s={s} f={f} />;
  else visual = <TerminalScene s={s} f={f} showKey={f >= keyStart} />;

  return (
    <AbsoluteFill>
      {visual}
      {/* 頂帶（概念錨）— 封面/gift/outro 無 */}
      {anchor && s.type !== "cover" && <TopBanner node={anchor} />}
      {marks.map((m: any, i: number) => (
        <Caption key={m.id} text={SC[m.id]} at={m.start} until={m.end + GAP} />
      ))}
      {marks.map((m: any) => (
        <Sequence key={`a-${m.id}`} from={m.start}>
          <Audio src={staticFile(`vo/fb-autopost/${m.id}.mp3`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** 乾淨封面縮圖（無字幕、元素全淡入）— 給 YouTube 自訂縮圖用。 */
export const FbAutopostThumb: React.FC = () => (
  <AbsoluteFill>
    <WhiteBg />
    <CoverScene s={SCENES[0]} f={60} />
  </AbsoluteFill>
);

export const FbAutopostObsidian: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill>
    <WhiteBg />
    {bgm && <Audio loop src={staticFile("bgm-fb-autopost.mp3")} volume={0.11} />}
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
