import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FONT } from "../../shared-skills/theme";
import type { Cue } from "../../shared-skills/captions";
import { buildScene, sceneDurations } from "./Explainer";
import { WhiteBg, ACC, darkCard, Glare, emberClip, rgba, accOf } from "./obsidian-glass";
import type { SceneBlock, VideoSpec } from "./schema";

/**
 * 通用「黑曜石深度教學」視覺皮，跟 Explainer.tsx（淺色技術風）讀同一份 VideoSpec + VO manifest，
 * 只是換一套視覺（白底畫布 + 黑曜石玻璃卡 + 橙漸層鉤子）。場景計時沿用 Explainer.tsx 的
 * buildScene/sceneDurations，兩套皮膚永遠對同一份 spec 算出一樣的秒數。
 * 樣式抄自 src/videos/claude-code-md-memory/Obsidian.tsx（已過稿），改成 props 讀資料，
 * 讓每日影片工廠（current.json 每天換內容）跟未來任何一支手刻旗艦片都能共用同一套渲染邏輯。
 */
const TRANSITION = 14;

const fadeIn = (f: number, at: number, d = 12) =>
  interpolate(f, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export function explainerObsidianFrames(spec: VideoSpec, vo: Record<string, number>): number {
  const ds = sceneDurations(spec, vo);
  return ds.reduce((s, d) => s + d, 0) - TRANSITION * (ds.length - 1);
}

/* ── 共用小件 ─────────────────────────────────────────────── */
export const Brand: React.FC<{ name: string }> = ({ name }) => (
  <div style={{ position: "absolute", top: 40, right: 56, display: "flex", alignItems: "center", gap: 12, ...darkCard(ACC.ember, { r: 999, glow: 0.45 }), padding: "9px 22px" }}>
    <span style={{ width: 10, height: 10, borderRadius: 999, background: `linear-gradient(135deg, ${ACC.ember}, ${ACC.emberSoft})`, boxShadow: `0 0 9px ${rgba(ACC.ember, 0.8)}` }} />
    <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: "#fff" }}>{name}</span>
  </div>
);

export const Kicker: React.FC<{ text: string; c: string }> = ({ text, c }) => (
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

/** 結論橫幅。bottom:200 淨空避免跟兩行長字幕（bottom:50）重疊。 */
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
const TermCard: React.FC<{ title?: string; lines: { k: string; t: string }[]; c: string; f: number; w?: number; start?: number }> = ({ title, lines, c, f, w = 1440, start = 8 }) => {
  const o = fadeIn(f, start, 14);
  // 長終端機（多行）自動縮字距/行距，避免深卡撐爆版面跟結論橫幅打架。
  const dense = lines.length > 6;
  return (
    <div style={{ ...darkCard(c, { r: 22, glow: 0.95 }), position: "relative", overflow: "hidden", width: w, opacity: o, transform: `translateY(${(1 - o) * 16}px)` }}>
      <Glare />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, padding: "14px 26px", borderBottom: `1px solid ${rgba("#ffffff", 0.1)}` }}>
        <span style={{ width: 13, height: 13, borderRadius: 999, background: "#FF5F57" }} />
        <span style={{ width: 13, height: 13, borderRadius: 999, background: "#FEBC2E" }} />
        <span style={{ width: 13, height: 13, borderRadius: 999, background: "#28C840" }} />
        {title && <span style={{ marginLeft: 12, fontFamily: FONT.monoCjk, fontSize: 24, color: rgba("#ffffff", 0.6) }}>{title}</span>}
      </div>
      <div style={{ position: "relative", padding: dense ? "14px 30px" : "22px 30px", display: "flex", flexDirection: "column", gap: dense ? 8 : 15 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: FONT.monoCjk, fontSize: dense ? (l.t.length > 40 ? 21 : 24) : (l.t.length > 40 ? 26 : 30), lineHeight: 1.28, ...lineColor(l.k) }}>
            {l.k === "cmd" && <span style={{ color: ACC.gold, marginRight: 12 }}>$</span>}
            {l.k === "cmt" && <span style={{ color: rgba("#ffffff", 0.32), marginRight: 8 }}>#</span>}
            {l.t}
          </div>
        ))}
      </div>
    </div>
  );
};

/** 誠實提醒膠囊（研究預覽版、額度倍增等 warn/yes/no 短標）。 */
const STAMP_COLOR: Record<"yes" | "no" | "warn", string> = { yes: ACC.mint, no: ACC.rose, warn: ACC.gold };
const Stamp: React.FC<{ kind: "yes" | "no" | "warn"; text: string; f: number; at: number; rotate?: number }> = ({ kind, text, f, at, rotate = -2 }) => {
  const c = STAMP_COLOR[kind];
  const o = fadeIn(f, at, 10);
  return (
    <div style={{ ...darkCard(c, { r: 999, glow: 0.65 }), position: "relative", overflow: "hidden", padding: "10px 24px", opacity: o, transform: `scale(${0.85 + 0.15 * o}) rotate(${rotate}deg)` }}>
      <Glare />
      <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 24, color: c }}>{text}</span>
    </div>
  );
};

/* ── 場景視覺 ─────────────────────────────────────────────── */
const CoverScene: React.FC<{ block: Extract<SceneBlock, { type: "cover" }>; spec: VideoSpec; f: number; kickerLabel: string }> = ({ block, spec, f, kickerLabel }) => {
  // 封面第 0 幀即完整亮相（門面＝縮圖同款），符合「封面 0 秒亮相」鐵則。
  const o = fadeIn(f, -30, 16);
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: ACC.ink }}>
      <div style={{ position: "absolute", top: 62, left: 96, display: "flex", alignItems: "center", gap: 22, opacity: o }}>
        <div style={{ ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "10px 28px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 11, height: 11, borderRadius: 999, background: `linear-gradient(135deg, ${ACC.ember}, ${ACC.emberSoft})`, boxShadow: `0 0 10px ${rgba(ACC.ember, 0.8)}` }} />
          <span style={{ fontWeight: 700, fontSize: 30, letterSpacing: 2, color: "#fff" }}>{kickerLabel}</span>
        </div>
        {spec.brand.handle && <span style={{ fontWeight: 500, fontSize: 27, letterSpacing: 6, color: ACC.muted }}>{spec.brand.name} · {spec.brand.handle}</span>}
      </div>

      <div style={{ position: "absolute", top: 194, left: 96, opacity: o, transform: `translateY(${(1 - o) * 18}px)` }}>
        <div style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: 72, letterSpacing: 1, color: ACC.ink }}>{block.titlePre}</div>
        <div style={{ ...emberClip, background: "linear-gradient(160deg, #F09A6B 0%, #D97757 42%, #B54C29 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", fontWeight: 800, fontSize: 100, letterSpacing: -2, lineHeight: 1.08, marginTop: 8, maxWidth: 1060, filter: `drop-shadow(0 8px 20px ${rgba(ACC.ember, 0.35)})` }}>{block.titlePost}</div>
        <div style={{ marginTop: 30, display: "flex", alignItems: "flex-start", gap: 22, maxWidth: 1010 }}>
          <span style={{ width: 60, height: 3, background: ACC.ember, borderRadius: 2, marginTop: 22, flexShrink: 0 }} />
          <span style={{ fontWeight: 500, fontSize: 34, lineHeight: 1.34, letterSpacing: 1, color: ACC.inkSoft }}>{spec.brand.tagline}</span>
        </div>
      </div>

      {/* 數字 chips */}
      {block.chips?.length ? (
        <div style={{ position: "absolute", bottom: 214, left: 96, display: "flex", gap: 20, opacity: o }}>
          {block.chips.map((ch, i) => {
            const c = accOf(ch.accent);
            return (
              <div key={i} style={{ ...darkCard(c, { r: 18, glow: 0.75 }), position: "relative", overflow: "hidden", padding: "18px 24px", display: "flex", alignItems: "center", gap: 10, maxWidth: 260 }}>
                <Glare />
                {ch.n ? <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 40, color: "#fff", textShadow: `0 0 18px ${rgba(c, 0.6)}` }}>{ch.n}</span> : null}
                <span style={{ position: "relative", fontWeight: 600, fontSize: 24, color: rgba("#ffffff", 0.82), lineHeight: 1.25 }}>{ch.t}</span>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* 右：終端機獨石碑（cover.terminal 有給才畫） */}
      {block.terminal ? (
        <div style={{ position: "absolute", top: 260, right: 92, transform: `rotate(-2.5deg)`, opacity: o }}>
          <TermCard title={block.terminal.title} lines={block.terminal.lines} c={ACC.ember} f={f} w={640} start={-30} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const TerminalScene: React.FC<{ block: Extract<SceneBlock, { type: "terminal" }>; f: number; showKey: boolean; cues: Cue[] }> = ({ block, f, showKey, cues }) => {
  const c = accOf(block.accent);
  const at = (i: number) => cues[Math.min(i, cues.length - 1)]?.from ?? 0;
  return (
    <AbsoluteFill>
      <Kicker text={block.kicker} c={c} />
      <Heading zh={block.headingZh} en={block.headingEn} f={f} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", bottom: 230 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          {block.stamps?.length ? (
            <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
              {block.stamps.map((s, i) => <Stamp key={i} kind={s.kind} text={s.text} f={f} at={at(s.atCue)} rotate={i % 2 ? 2 : -2} />)}
            </div>
          ) : null}
          <TermCard title={block.terminal.title} lines={block.terminal.lines} c={c} f={f} />
        </div>
      </AbsoluteFill>
      {block.keyline && <KeyLine text={block.keyline} c={c} show={showKey} />}
    </AbsoluteFill>
  );
};

const PlacesScene: React.FC<{ block: Extract<SceneBlock, { type: "places" }>; f: number; showKey: boolean }> = ({ block, f, showKey }) => {
  const c = accOf(block.accent);
  return (
    <AbsoluteFill>
      <Kicker text={block.kicker} c={c} />
      <Heading zh={block.headingZh} en={block.headingEn} f={f} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 28 }}>
          {block.items.map((it, i) => {
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
      {block.keyline && <KeyLine text={block.keyline} c={c} show={showKey} />}
    </AbsoluteFill>
  );
};

const PipelineScene: React.FC<{ block: Extract<SceneBlock, { type: "pipeline" }>; f: number; showKey: boolean; cues: Cue[] }> = ({ block, f, showKey, cues }) => {
  const c = accOf(block.accent);
  // 講到第 i 句就把第 i 格放大＋外框發亮，下一句開始變回原樣（cue↔node 依序對應，超出就停在最後一格）
  const nodeStart = (i: number) => cues[Math.min(i, cues.length - 1)]?.from ?? 0;
  return (
    <AbsoluteFill>
      <Kicker text={block.kicker} c={c} />
      <Heading zh={block.headingZh} en={block.headingEn} f={f} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {block.nodes.map((n, i) => {
            const nc = accOf(n.accent);
            const o = fadeIn(f, 10 + i * 8, 14);
            const up = fadeIn(f, nodeStart(i), 9);
            const down = i < block.nodes.length - 1 ? fadeIn(f, nodeStart(i + 1), 9) : 0;
            const hot = up - down; // 0→1 亮起、換下一格時 1→0
            const scale = 1 + 0.1 * hot;
            return (
              <React.Fragment key={i}>
                <div style={{ ...darkCard(nc, { r: 24, glow: 0.9 + 1.1 * hot }), position: "relative", overflow: "hidden", width: 290, minHeight: 210, padding: "28px 22px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12, opacity: o, transform: `translateY(${(1 - o) * 18}px) scale(${scale})`, zIndex: hot > 0.05 ? 2 : 1, boxShadow: hot > 0.05 ? `0 0 ${28 * hot}px ${rgba(nc, 0.55 * hot)}, 0 0 ${60 * hot}px ${rgba(nc, 0.3 * hot)}` : undefined }}>
                  <Glare />
                  <span style={{ position: "relative", fontSize: 56 }}>{n.icon}</span>
                  <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 32, color: "#fff" }}>{n.label}</span>
                  {n.sub && <span style={{ position: "relative", fontWeight: 500, fontSize: 22, color: rgba("#ffffff", 0.66), lineHeight: 1.3 }}>{n.sub}</span>}
                </div>
                {i < block.nodes.length - 1 && <span style={{ fontSize: 40, fontWeight: 800, color: ACC.emberSoft, opacity: fadeIn(f, 14 + i * 8, 12) }}>→</span>}
              </React.Fragment>
            );
          })}
        </div>
      </AbsoluteFill>
      {block.keyline && <KeyLine text={block.keyline} c={c} show={showKey} />}
    </AbsoluteFill>
  );
};

/* ── 實拍標註三件套（移植自 src/videos/hf-voiceid/Obsidian.tsx，2026-07-10 拍板規格）── */
const SHOT_RED = "#FF3B30";

/** 紅框：一次性「畫框」動畫（12 幀描完後全靜態，防抖安全）。 */
const ShotRedFrame: React.FC<{ x: number; y: number; w: number; h: number; t: number }> = ({ x, y, w, h, t }) => {
  const P = 2 * (w + h);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", overflow: "visible" }} width={1} height={1}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={SHOT_RED} strokeWidth={5}
        strokeDasharray={P} strokeDashoffset={P * (1 - t)} opacity={t <= 0 ? 0 : 1}
        style={{ filter: `drop-shadow(0 0 10px ${rgba(SHOT_RED, 0.55)})` }} />
    </svg>
  );
};

/** 聚光：紅框外壓暗（box-shadow 打洞法）。 */
const ShotSpotlight: React.FC<{ x: number; y: number; w: number; h: number; t: number }> = ({ x, y, w, h, t }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 10, boxShadow: `0 0 0 9999px ${rgba("#060a14", 0.36)}`, opacity: t, pointerEvents: "none" }} />
);

/** 放大鏡：目標區裁切放大浮出。 */
const ShotLoupe: React.FC<{ src: string; imgW: number; rect: number[]; w: number; t: number }> = ({ src, imgW, rect, w, t }) => {
  const [x1, y1, x2, y2] = rect;
  const k = w / (x2 - x1);
  const full = Math.round((y2 - y1) * k);
  const h = Math.min(260, full);
  if (t <= 0.01) return null;
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: 14, overflow: "hidden", border: `3px solid ${SHOT_RED}`, boxShadow: `0 0 14px ${rgba(SHOT_RED, 0.45)}, 0 14px 30px ${rgba("#0b1020", 0.35)}`, opacity: t, background: "#0D1322" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", width: imgW * k, left: -x1 * k, top: -y1 * k - (full - h) / 2, maxWidth: "none" }} />
      <div style={{ position: "absolute", top: 6, right: 10, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 18, color: "#fff", background: rgba(SHOT_RED, 0.85), borderRadius: 8, padding: "2px 10px" }}>放大</div>
    </div>
  );
};

/** 單張大圖（真實截圖）：深玻璃卡框 + Ken Burns 推鏡(focus) + 標註膠囊(annotations)。
 *  有 shot 時走「實拍大圖版」（hf-voiceid ShotScene 同款）：截圖佔 2/3＋左步驟欄＋紅框/聚光/放大鏡。
 *  有 callouts 時走「桌面情境版」：照片靠左、右側 emoji 註解卡＋漸層箭頭（2026-07-10 老闆樣張），
 *  最後（focus.atCue）推鏡進螢幕看真實內容、註解卡淡出。 */
const ImageScene: React.FC<{ block: Extract<SceneBlock, { type: "image" }>; f: number; showKey: boolean; cues: Cue[] }> = ({ block, f, showKey, cues }) => {
  const c = accOf(block.accent);
  const at = (i: number) => cues[Math.min(i, cues.length - 1)]?.from ?? 0;
  const fc = block.focus;
  const zStart = fc ? at(fc.atCue) : 0;
  const z = fc ? interpolate(f, [zStart, zStart + 24], [1, fc.scale], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const ox = fc ? fc.x * 100 : 50;
  const oy = fc ? fc.y * 100 : 50;
  const o = fadeIn(f, 10, 14);
  const shot = block.shot;
  if (shot) {
    const IMGW = 1160;
    const scale = IMGW / shot.w;
    const IMGH = Math.round(shot.h * scale);
    const top = 252 + Math.max(0, Math.round((700 - IMGH) / 2));
    // 目前講到第幾句
    let act = 0;
    cues.forEach((q, i) => { if (f >= q.from) act = i; });
    // 取「atCue ≤ act」中最新的一組 highlight
    let hl: (typeof shot.highlights)[number] | null = null;
    for (const h of shot.highlights) if (h.atCue <= act && (!hl || h.atCue > hl.atCue)) hl = h;
    const hlStart = hl ? (cues[Math.min(hl.atCue, cues.length - 1)]?.from ?? 0) : 0;
    const tDraw = hl ? fadeIn(f, hlStart + 2, 12) : 0;
    const R = hl ? { x: hl.rect[0] * scale, y: hl.rect[1] * scale, w: (hl.rect[2] - hl.rect[0]) * scale, h: (hl.rect[3] - hl.rect[1]) * scale } : null;
    return (
      <AbsoluteFill>
        <Kicker text={block.kicker} c={c} />
        <Heading zh={block.headingZh} en={block.headingEn} f={f} />
        {/* 左：步驟欄＋放大鏡 */}
        <div style={{ position: "absolute", left: 56, top: 280, width: 500, display: "flex", flexDirection: "column", gap: 14, opacity: o }}>
          {shot.steps.map((st, i) => {
            const active = st.atCue === act;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", borderRadius: 16, ...(active ? darkCard(c, { r: 16, glow: 0.7 }) : { border: `1px solid ${rgba(ACC.ink, 0.1)}`, background: rgba("#ffffff", 0.45) }) }}>
                <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 26, color: active ? "#F5B851" : ACC.muted, flexShrink: 0 }}>{st.icon}</span>
                <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: active ? 700 : 500, fontSize: 25, lineHeight: 1.3, color: active ? "#fff" : ACC.inkSoft }}>{st.t}</span>
              </div>
            );
          })}
          {hl?.loupe && (
            <div style={{ marginTop: 8 }}>
              <ShotLoupe src={block.src} imgW={shot.w} rect={hl.loupe} w={500} t={tDraw} />
            </div>
          )}
        </div>
        {/* 右：截圖主圖（黑曜石卡框）＋紅框/聚光＋實拍徽章 */}
        <div style={{ position: "absolute", left: 618, top, ...darkCard(c, { r: 24, glow: 0.85 }), padding: 14, opacity: o }}>
          <div style={{ position: "relative", width: IMGW, height: IMGH, borderRadius: 14, overflow: "hidden" }}>
            <Img src={staticFile(block.src)} style={{ position: "absolute", left: 0, top: 0, width: IMGW }} />
            {R && <ShotSpotlight x={R.x} y={R.y} w={R.w} h={R.h} t={tDraw} />}
            {R && <ShotRedFrame x={R.x} y={R.y} w={R.w} h={R.h} t={tDraw} />}
            {R && hl?.mask && (
              <div style={{ position: "absolute", left: R.x + R.w / 2, top: R.y + R.h / 2, transform: "translate(-50%, -50%)", padding: "6px 18px", borderRadius: 10, background: rgba(SHOT_RED, 0.88), fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 24, color: "#fff", opacity: tDraw, whiteSpace: "nowrap" }}>⚠ {hl.mask}</div>
            )}
          </div>
          <div style={{ position: "absolute", right: 26, top: 26, padding: "6px 16px", borderRadius: 999, background: rgba("#060a14", 0.72), border: `1px solid ${rgba("#ffffff", 0.2)}`, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 20, color: "#fff", letterSpacing: 1 }}>📸 {shot.label}</div>
        </div>
      </AbsoluteFill>
    );
  }
  const cos = block.callouts ?? [];
  if (cos.length > 0) {
    const PX = 60, PY = 250, PW = 1380, PH = 760;
    const callFade = fc ? Math.max(0, 1 - fadeIn(f, zStart, 18)) : 1;
    const baseY = Math.max(268, 545 - cos.length * 86);
    const cardY = (i: number) => baseY + i * 172;
    return (
      <AbsoluteFill>
        <Kicker text={block.kicker} c={c} />
        <Heading zh={block.headingZh} en={block.headingEn} f={f} />
        <div style={{ position: "absolute", left: PX, top: PY, width: PW, height: PH, borderRadius: 24, overflow: "hidden", boxShadow: "0 18px 60px rgba(15,23,42,0.35)", border: "1px solid rgba(15,23,42,0.15)", opacity: o, transform: `translateY(${(1 - o) * 18}px)` }}>
          <Img src={staticFile(block.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: `${ox}% ${oy}%` }} />
        </div>
        {callFade > 0.01 && (
          <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: callFade }} width={1920} height={1080} viewBox="0 0 1920 1080">
            <defs>
              <linearGradient id="calloutArrow" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0" stopColor="#37D2C3" />
                <stop offset="1" stopColor="#4C8DFF" />
              </linearGradient>
            </defs>
            {cos.map((co, i) => {
              const ao = fadeIn(f, at(co.atCue) + i * 12, 14);
              if (ao <= 0.01) return null;
              const sx = 1462, sy = cardY(i) + 60;
              const tx = PX + co.x * PW, ty = PY + co.y * PH;
              const mx = (sx + tx) / 2;
              return (
                <g key={i} opacity={ao}>
                  <path d={`M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx + 16} ${ty}`} stroke="url(#calloutArrow)" strokeWidth={5} fill="none" strokeLinecap="round" />
                  <circle cx={tx} cy={ty} r={9} fill="#37D2C3" opacity={0.95} />
                  <circle cx={tx} cy={ty} r={16} fill="none" stroke="#37D2C3" strokeWidth={2.5} opacity={0.5} />
                </g>
              );
            })}
          </svg>
        )}
        {callFade > 0.01 && cos.map((co, i) => {
          const ao = fadeIn(f, at(co.atCue) + i * 12, 14);
          if (ao <= 0.01) return null;
          return (
            <div key={i} style={{ position: "absolute", left: 1470, top: cardY(i), width: 400, ...darkCard(c, { r: 20, glow: 0.85 }), padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start", opacity: ao * callFade, transform: `translateX(${(1 - ao) * 26}px)` }}>
              <span style={{ position: "relative", fontSize: 38, lineHeight: 1.1 }}>{co.emoji}</span>
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 26, color: "#fff", letterSpacing: 0.5 }}>{co.title}</div>
                <div style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 20, color: rgba("#ffffff", 0.74), lineHeight: 1.4, marginTop: 5 }}>{co.desc}</div>
              </div>
            </div>
          );
        })}
        {block.keyline && <KeyLine text={block.keyline} c={c} show={showKey} />}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Kicker text={block.kicker} c={c} />
      <Heading zh={block.headingZh} en={block.headingEn} f={f} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ marginTop: 80, ...darkCard(c, { r: 24, glow: 0.9 }), position: "relative", overflow: "hidden", width: 1330, height: 560, padding: 10, opacity: o, transform: `translateY(${(1 - o) * 18}px)` }}>
          <Glare />
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 16, overflow: "hidden" }}>
            <Img src={staticFile(block.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: `${ox}% ${oy}%` }} />
            {block.annotations?.map((an, i) => {
              const ap = fadeIn(f, at(an.atCue), 12);
              if (ap <= 0.01) return null;
              return (
                <div key={i} style={{ position: "absolute", left: `${an.x * 100}%`, top: `${an.y * 100}%`, opacity: ap, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * ap})` }}>
                  <div style={{ ...darkCard(c, { r: 999, glow: 1.2 }), padding: "10px 22px", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 26, color: "#fff", whiteSpace: "nowrap" }}>{an.text}</div>
                </div>
              );
            })}
          </div>
        </div>
        {block.caption && <div style={{ marginTop: 16, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 24, color: ACC.muted, opacity: Math.max(0, fadeIn(f, 20, 12) - (block.keyline ? fadeIn(f, at(block.keylineAtCue ?? 4), 12) : 0)) }}>{block.caption}</div>}
      </AbsoluteFill>
      {block.keyline && <KeyLine text={block.keyline} c={c} show={showKey} />}
    </AbsoluteFill>
  );
};

const CompareScene: React.FC<{ block: Extract<SceneBlock, { type: "compare" }>; f: number; showKey: boolean }> = ({ block, f, showKey }) => {
  const c = accOf(block.accent);
  const Card: React.FC<{ side: "bad" | "good"; badge: string; code: string; note: string; delay: number }> = ({ side, badge, code, note, delay }) => {
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
      <Kicker text={block.kicker} c={c} />
      <Heading zh={block.headingZh} en={block.headingEn} f={f} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 34 }}>
          <Card side="bad" {...block.bad} delay={10} />
          <Card side="good" {...block.good} delay={20} />
        </div>
      </AbsoluteFill>
      {block.keyline && <KeyLine text={block.keyline} c={c} show={showKey} />}
    </AbsoluteFill>
  );
};

/** 深卡版真實留言泡泡（社會實證）。handle 首字當頭像，platform 當右上小標籤。 */
const ComplaintCard: React.FC<{ handle: string; platform: string; quote: string; meta: string; c: string; x: number; y: number; rot: number; f: number; at: number }> = ({ handle, platform, quote, meta, c, x, y, rot, f, at }) => {
  const o = fadeIn(f, at, 10);
  const s = 0.82 + 0.18 * o;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 560, opacity: o, transform: `scale(${s}) rotate(${rot}deg)`, transformOrigin: "center" }}>
      <div style={{ ...darkCard(c, { r: 20, glow: 0.7 }), position: "relative", overflow: "hidden", padding: "22px 26px" }}>
        <Glare />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <span style={{ width: 40, height: 40, borderRadius: 999, background: c, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 19 }}>{handle.slice(0, 1).toUpperCase()}</span>
          <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 21, color: rgba("#ffffff", 0.72) }}>{handle}</span>
          <span style={{ marginLeft: "auto", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 17, color: c, background: rgba(c, 0.16), padding: "4px 12px", borderRadius: 999 }}>{platform}</span>
        </div>
        <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 25, lineHeight: 1.42, color: "#fff" }}>{quote}</div>
        {meta && <div style={{ position: "relative", marginTop: 10, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 19, color: rgba("#ffffff", 0.5) }}>{meta}</div>}
      </div>
    </div>
  );
};

const ComplaintsScene: React.FC<{ block: Extract<SceneBlock, { type: "complaints" }>; f: number; showKey: boolean; cues: Cue[] }> = ({ block, f, showKey, cues }) => {
  const c = accOf(block.accent);
  const at = (i: number) => cues[Math.min(i, cues.length - 1)]?.from ?? 0;
  return (
    <AbsoluteFill>
      <Kicker text={block.kicker} c={c} />
      <Heading zh={block.headingZh} en={block.headingEn} f={f} />
      {block.items.map((it, i) => (
        <ComplaintCard key={i} handle={it.handle} platform={it.platform} quote={it.textEn} meta={it.textZh} c={accOf(it.accent)} x={it.x * 1920} y={it.y * 1080} rot={it.rot} f={f} at={at(it.atCue)} />
      ))}
      {block.keyline && <KeyLine text={block.keyline} c={c} show={showKey} />}
    </AbsoluteFill>
  );
};

/** 單則真實引言聚光卡：一句話置中放大，配帳號/平台/按讚數。 */
const QuoteScene: React.FC<{ block: Extract<SceneBlock, { type: "quote" }>; f: number; showKey: boolean }> = ({ block, f, showKey }) => {
  const c = accOf(block.accent);
  const o = fadeIn(f, 14, 16);
  return (
    <AbsoluteFill>
      <Kicker text={block.kicker} c={c} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", bottom: 150 }}>
        <div style={{ ...darkCard(c, { r: 28, glow: 1 }), position: "relative", overflow: "hidden", width: 1240, padding: "44px 56px", opacity: o, transform: `translateY(${(1 - o) * 18}px)` }}>
          <Glare />
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <span style={{ width: 52, height: 52, borderRadius: 999, background: c, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 24 }}>{block.handle.slice(0, 1).toUpperCase()}</span>
            <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 26, color: rgba("#ffffff", 0.75) }}>{block.handle}</span>
            <span style={{ marginLeft: "auto", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 20, color: c, background: rgba(c, 0.16), padding: "6px 16px", borderRadius: 999 }}>{block.platform}</span>
          </div>
          <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 38, lineHeight: 1.5, color: "#fff" }}>{block.quote}</div>
          {block.meta && <div style={{ position: "relative", marginTop: 20, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 24, color: c }}>❤ {block.meta}</div>}
        </div>
      </AbsoluteFill>
      {block.keyline && <KeyLine text={block.keyline} c={c} show={showKey} />}
    </AbsoluteFill>
  );
};

const OutroScene: React.FC<{ block: Extract<SceneBlock, { type: "outro" }>; spec: VideoSpec; f: number }> = ({ spec, f }) => {
  const o = fadeIn(f, 4, 16);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT.uiCjk }}>
      <div style={{ textAlign: "center", opacity: o }}>
        <div style={{ fontWeight: 800, fontSize: 96, color: ACC.ink }}>感謝 <span style={emberClip}>觀看</span>！</div>
        <div style={{ fontWeight: 600, fontSize: 40, color: ACC.inkSoft, marginTop: 14 }}>覺得有幫助，就用一個動作支持 👇</div>
        <div style={{ display: "flex", gap: 26, justifyContent: "center", marginTop: 44 }}>
          {([["👍", "按讚", ACC.mint], ["🔔", "訂閱", ACC.rose], ["🔗", "分享", ACC.signal]] as const).map(([e, t, c], i) => (
            <div key={i} style={{ ...darkCard(c, { r: 999, glow: 0.8 }), position: "relative", overflow: "hidden", padding: "18px 48px", display: "flex", alignItems: "center", gap: 14, opacity: fadeIn(f, 16 + i * 6, 12) }}>
              <Glare />
              <span style={{ position: "relative", fontSize: 40 }}>{e}</span>
              <span style={{ position: "relative", fontWeight: 800, fontSize: 42, color: "#fff" }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 44, display: "inline-flex", alignItems: "center", gap: 14, ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "12px 30px" }}>
          <span style={{ fontWeight: 800, fontSize: 30, color: "#fff" }}>{spec.brand.name}</span>
          {spec.brand.tagline ? <span style={{ fontWeight: 500, fontSize: 26, letterSpacing: 3, color: rgba("#ffffff", 0.6) }}>· {spec.brand.tagline}</span> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── 字幕 + 頂帶 + 場景外殼 ── */
export const Caption: React.FC<{ text: string; at: number; until: number }> = ({ text, at, until }) => {
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

export const TopBanner: React.FC<{ node: React.ReactNode }> = ({ node }) => {
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

const SceneShell: React.FC<{
  block: SceneBlock; spec: VideoSpec; vo: Record<string, number>; voDir: string;
  anchor: React.ReactNode | null; kickerLabel: string;
}> = ({ block, spec, vo, voDir, anchor, kickerLabel }) => {
  const f = useCurrentFrame();
  const { cues } = buildScene(block.cues, spec.script, vo);
  const keyAtCue = "keylineAtCue" in block ? block.keylineAtCue : 3;
  const keyStart = cues[Math.min(keyAtCue, cues.length - 1)]?.from ?? 9999;
  const showKey = f >= keyStart;

  let visual: React.ReactNode;
  if (block.type === "cover") visual = <CoverScene block={block} spec={spec} f={f} kickerLabel={kickerLabel} />;
  else if (block.type === "places") visual = <PlacesScene block={block} f={f} showKey={showKey} />;
  else if (block.type === "pipeline") visual = <PipelineScene block={block} f={f} showKey={showKey} cues={cues} />;
  else if (block.type === "compare") visual = <CompareScene block={block} f={f} showKey={showKey} />;
  else if (block.type === "outro") visual = <OutroScene block={block} spec={spec} f={f} />;
  else if (block.type === "terminal") visual = <TerminalScene block={block} f={f} showKey={showKey} cues={cues} />;
  else if (block.type === "complaints") visual = <ComplaintsScene block={block} f={f} showKey={showKey} cues={cues} />;
  else if (block.type === "quote") visual = <QuoteScene block={block} f={f} showKey={showKey} />;
  else if (block.type === "image") visual = <ImageScene block={block} f={f} showKey={showKey} cues={cues} />;
  else visual = null; // spotlight: not yet supported by the obsidian skin

  return (
    <AbsoluteFill>
      {visual}
      {block.type !== "cover" && block.type !== "outro" && <Brand name={spec.brand.name} />}
      {anchor && block.type !== "cover" && block.type !== "outro" && <TopBanner node={anchor} />}
      {cues.map((c) => (
        <Caption key={c.id} text={c.text} at={c.from} until={c.from + c.dur + 10} />
      ))}
      {cues.map((c) => (
        <Sequence key={`a-${c.id}`} from={c.from}>
          <Audio src={staticFile(`${voDir}/${c.id}.mp3`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const XFADE = 12;

export const ExplainerObsidian: React.FC<{
  spec: VideoSpec;
  vo: Record<string, number>;
  voDir: string;
  /** 每景頂帶「概念錨」，index 對 scenes；不給就不顯示頂帶。 */
  anchors?: (React.ReactNode | null)[];
  /** 封面左上角膠囊字樣，預設「Claude Code 教學」。 */
  kickerLabel?: string;
  bgmSrc?: string;
  bgmVolume?: number;
}> = ({ spec, vo, voDir, anchors, kickerLabel = "Claude Code 教學", bgmSrc, bgmVolume = 0.11 }) => {
  const durations = sceneDurations(spec, vo);
  return (
    <AbsoluteFill style={{ textSpacingTrim: "space-all" }}>
      <WhiteBg />
      {bgmSrc && <Audio loop src={staticFile(bgmSrc)} volume={bgmVolume} />}
      <TransitionSeries>
        {spec.scenes.flatMap((block, i) => {
          const seq = (
            <TransitionSeries.Sequence key={`seq-${i}`} durationInFrames={durations[i]}>
              <SceneShell block={block} spec={spec} vo={vo} voDir={voDir} anchor={anchors?.[i] ?? null} kickerLabel={kickerLabel} />
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
};

/** 乾淨封面縮圖（無字幕、元素全淡入）— 給 YouTube 自訂縮圖 / render_daily.py still 用。 */
export const ExplainerObsidianThumb: React.FC<{ spec: VideoSpec; kickerLabel?: string }> = ({ spec, kickerLabel = "Claude Code 教學" }) => {
  const cover = spec.scenes.find((s) => s.type === "cover") as Extract<SceneBlock, { type: "cover" }> | undefined;
  if (!cover) return <AbsoluteFill><WhiteBg /></AbsoluteFill>;
  return (
    <AbsoluteFill style={{ textSpacingTrim: "space-all" }}>
      <WhiteBg />
      <CoverScene block={cover} spec={spec} f={60} kickerLabel={kickerLabel} />
    </AbsoluteFill>
  );
};
