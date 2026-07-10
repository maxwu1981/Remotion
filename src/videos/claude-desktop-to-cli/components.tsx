import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { appearUp, springPop, springV } from "../../shared-skills/anim";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { PAL, MOTIF } from "./data";
import { BRAND } from "./brand";

/** Clamped 0→1 ramp between two frames — tidy interpolate for scenes. */
export const ramp = (frame: number, a: number, b: number): number =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/* ===================================================== brand glyph ============ */

/** The motif of the whole video: an App window + a terminal sharing one engine. */
export const BrandGlyph: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size * 2.25} height={size} viewBox="0 0 54 24">
    {/* app window (3 tabs) */}
    <rect x="2" y="2" width="20" height="12.5" rx="2.4" fill="none" stroke={MOTIF.code} strokeWidth="2" />
    {[5.5, 9, 12.5].map((x) => (
      <circle key={x} cx={x} cy="5" r="0.9" fill={MOTIF.code} />
    ))}
    {/* terminal */}
    <rect x="32" y="2" width="20" height="12.5" rx="2.4" fill={COLORS.term.bg} />
    <path d="M36 6.5l2.4 2-2.4 2" fill="none" stroke={COLORS.term.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* connectors down into the engine */}
    <line x1="12" y1="14.5" x2="12" y2="19" stroke={MOTIF.engine} strokeWidth="1.6" strokeLinecap="round" />
    <line x1="42" y1="14.5" x2="42" y2="19" stroke={MOTIF.engine} strokeWidth="1.6" strokeLinecap="round" />
    {/* shared engine */}
    <rect x="12" y="19" width="30" height="3.4" rx="1.7" fill={MOTIF.engine} />
  </svg>
);

/* ================================================================ shell ====== */

/** Page chrome shared by every scene: backdrop, kicker chip, brand badge, bar. */
export const Shell: React.FC<{
  kicker?: string;
  accent?: string;
  durationInFrames: number;
  showChrome?: boolean;
  seed?: string;
  children: React.ReactNode;
}> = ({ kicker, accent = COLORS.remotion, durationInFrames, showChrome = true, seed, children }) => {
  const frame = useCurrentFrame();
  const headIn = ramp(frame, 0, 14);
  const progress = Math.max(0, Math.min(1, frame / Math.max(1, durationInFrames - 1)));
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <Backdrop accent={accent} seed={seed ?? kicker ?? "desktop-cli"} freeze />
      <AbsoluteFill>{children}</AbsoluteFill>
      {showChrome ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 50,
              left: 92,
              right: 92,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: headIn,
              transform: `translateY(${(1 - headIn) * -12}px)`,
            }}
          >
            {kicker ? (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 11, padding: "8px 18px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: accent, boxShadow: `0 0 0 4px ${accent}22` }} />
                <span style={{ fontFamily: FONT.monoCjk, fontSize: TYPE.tiny, fontWeight: 700, letterSpacing: 1, color: accent }}>{kicker}</span>
              </div>
            ) : (
              <span />
            )}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
              <BrandGlyph />
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, color: COLORS.ink, letterSpacing: -0.3 }}>{BRAND.name}</span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: COLORS.bgAlt }}>
            <div style={{ height: "100%", width: `${progress * 100}%`, background: `linear-gradient(90deg, ${MOTIF.code}, ${MOTIF.engine}, ${MOTIF.disk})`, boxShadow: `0 0 14px ${accent}88` }} />
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/* ============================================================== heading ====== */

/** A scene title: bold Chinese line + a muted English/mono sub-line. */
export const Heading: React.FC<{
  zh: string;
  en?: string;
  delay?: number;
  align?: "center" | "left";
  size?: number;
}> = ({ zh, en, delay = 6, align = "center", size = TYPE.h2 }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 18, 22);
  return (
    <div style={{ textAlign: align, ...a }}>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: size, letterSpacing: -0.5, color: COLORS.ink, lineHeight: 1.18 }}>{zh}</div>
      {en ? <div style={{ marginTop: 9, fontFamily: FONT.mono, fontWeight: 500, fontSize: TYPE.small, color: COLORS.muted, letterSpacing: 0.4 }}>{en}</div> : null}
    </div>
  );
};

/* ================================================================ stamp ====== */

type StampKind = "yes" | "no" | "warn";
const STAMP: Record<StampKind, { fg: string; bg: string }> = {
  yes: { fg: PAL.yes, bg: PAL.yesBg },
  no: { fg: PAL.no, bg: PAL.noBg },
  warn: { fg: PAL.warn, bg: PAL.warnBg },
};
const STAMP_ICON: Record<StampKind, string> = { yes: "✅", no: "❌", warn: "⚠️" };

/**
 * A stamped verdict badge that springs in with a tiny rotation — the recurring
 * ✅ / ❌ / ⚠️ token. `at` is a scene-local frame.
 */
export const Stamp: React.FC<{
  kind: StampKind;
  text: string;
  at?: number;
  size?: number;
  rotate?: number;
  icon?: boolean;
}> = ({ kind, text, at = 0, size = TYPE.body, rotate = -3, icon = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springV(frame, fps, { delay: at, damping: 11, stiffness: 150 });
  const c = STAMP[kind];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        padding: "9px 18px",
        borderRadius: RADIUS.pill,
        background: c.bg,
        border: `2px solid ${c.fg}`,
        color: c.fg,
        fontFamily: FONT.uiCjk,
        fontWeight: 800,
        fontSize: size,
        opacity: Math.min(1, s * 1.4),
        transform: `scale(${0.6 + 0.4 * Math.min(1, s)}) rotate(${rotate}deg)`,
        boxShadow: `0 0 0 6px ${c.fg}18`,
        whiteSpace: "nowrap",
      }}
    >
      {icon ? <span style={{ fontSize: size * 0.92 }}>{STAMP_ICON[kind]}</span> : null}
      {text}
    </div>
  );
};

/* ================================================================= chip ====== */

/** A neutral rounded info chip with an accent dot (or custom icon). */
export const Chip: React.FC<{
  text: React.ReactNode;
  color?: string;
  icon?: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}> = ({ text, color = COLORS.muted, icon, size = TYPE.small, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 11,
      padding: "10px 20px",
      borderRadius: RADIUS.pill,
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      boxShadow: SHADOW.sm,
      ...style,
    }}
  >
    {icon ?? <span style={{ width: 9, height: 9, borderRadius: "50%", background: color }} />}
    <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: size, color: COLORS.inkSoft }}>{text}</span>
  </div>
);

/* ============================================================ key-line ======= */

/**
 * The prominent "land on screen" banner used to state a section's key principle.
 * Tinted by `tone`; slides up and holds.
 */
export const KeyLine: React.FC<{
  text: React.ReactNode;
  tone?: string;
  delay?: number;
  width?: number;
  size?: number;
}> = ({ text, tone = COLORS.remotion, delay = 0, width = 1320, size = TYPE.h3 }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 18, 24);
  return (
    <div
      style={{
        width,
        margin: "0 auto",
        padding: "20px 36px",
        borderRadius: RADIUS.lg,
        background: COLORS.surface,
        border: `2px solid ${tone}`,
        boxShadow: SHADOW.lg,
        textAlign: "center",
        ...a,
      }}
    >
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: size, lineHeight: 1.34, color: COLORS.ink }}>{text}</span>
    </div>
  );
};

/* ============================================================ flow arrow ===== */

/** A directional connector that draws then pulses a dot. Horizontal or vertical. */
export const FlowArrow: React.FC<{
  width?: number;
  color?: string;
  progress?: number;
  vertical?: boolean;
  thickness?: number;
}> = ({ width = 90, color = COLORS.faint, progress = 1, vertical = false, thickness = 2.6 }) => {
  const frame = useCurrentFrame();
  const p = Math.max(0, Math.min(1, progress));
  const len = width;
  const tip = 6 + (len - 16) * p;
  const headOp = ramp(p, 0.5, 1);
  const dotT = (frame % 42) / 42;
  const dotP = 6 + (len - 16) * dotT;
  const box = vertical ? { w: 24, h: len } : { w: len, h: 24 };
  const A = (along: number, cross = 12) => (vertical ? { x: cross, y: along } : { x: along, y: cross });
  const s = A(6);
  const e = A(tip);
  const head = vertical
    ? `M ${12 - 5} ${tip - 7} L 12 ${tip} L ${12 + 5} ${tip - 7}`
    : `M ${tip - 7} ${12 - 5} L ${tip} 12 L ${tip - 7} ${12 + 5}`;
  const dot = A(dotP);
  return (
    <svg width={box.w} height={box.h} style={{ overflow: "visible" }}>
      <line x1={s.x} y1={s.y} x2={e.x} y2={e.y} stroke={color} strokeWidth={thickness} strokeLinecap="round" opacity={0.6} />
      {p > 0.99 ? <circle cx={dot.x} cy={dot.y} r={3} fill={color} opacity={Math.sin(Math.PI * dotT)} /> : null}
      <path d={head} fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round" strokeLinejoin="round" opacity={headOp} />
    </svg>
  );
};

/* ================================================================ panel ====== */

export type PanelTone = "yes" | "no" | "warn" | "neutral";
const TONE: Record<PanelTone, { fg: string; bg: string; mark: string }> = {
  yes: { fg: PAL.yes, bg: PAL.yesBg, mark: "✓" },
  no: { fg: PAL.no, bg: PAL.noBg, mark: "✕" },
  warn: { fg: PAL.warn, bg: PAL.warnBg, mark: "!" },
  neutral: { fg: COLORS.muted, bg: COLORS.surfaceAlt, mark: "•" },
};

/**
 * A titled card whose list items reveal one-by-one from `start`, `step` frames
 * apart. The recurring building block for the comparison columns (S1) and the
 * 自動共用 / 不會共用 split (S3). Each item gets a small tone-marked bullet so
 * meaning stays consistent (green ✓ / red ✕ / amber !).
 */
export const Panel: React.FC<{
  title: React.ReactNode;
  badge?: string;
  tone?: PanelTone;
  /** Override the tone's colour for the header + bullets (keeps the tone's mark). */
  accent?: string;
  items: React.ReactNode[];
  start?: number;
  step?: number;
  w?: number;
  mono?: boolean;
  itemSize?: number;
}> = ({ title, badge, tone = "neutral", accent, items, start = 0, step = 8, w = 660, mono = false, itemSize = TYPE.small }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const base = TONE[tone];
  const t = accent ? { fg: accent, bg: `${accent}12`, mark: base.mark } : base;
  const head = springPop(frame, fps, { delay: start, from: 0.9, dist: 14 });
  return (
    <div
      style={{
        width: w,
        borderRadius: RADIUS.lg,
        background: COLORS.surface,
        border: `2px solid ${t.fg}44`,
        boxShadow: SHADOW.lg,
        overflow: "hidden",
      }}
    >
      <div style={{ ...head, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 24px", background: t.bg, borderBottom: `1px solid ${t.fg}33` }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: t.fg }}>{title}</span>
        {badge ? (
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.tiny, color: t.fg, background: COLORS.surface, border: `1.5px solid ${t.fg}`, borderRadius: RADIUS.pill, padding: "5px 14px", whiteSpace: "nowrap" }}>{badge}</span>
        ) : null}
      </div>
      <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((it, i) => {
          const a = appearUp(frame, start + 8 + i * step, 14, 16);
          return (
            <div key={i} style={{ ...a, display: "flex", alignItems: "flex-start", gap: 13 }}>
              <span style={{ flexShrink: 0, marginTop: 2, width: 24, height: 24, borderRadius: "50%", background: `${t.fg}1a`, border: `1.5px solid ${t.fg}`, color: t.fg, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>{t.mark}</span>
              <span style={{ fontFamily: mono ? FONT.monoCjk : FONT.uiCjk, fontWeight: mono ? 600 : 600, fontSize: itemSize, lineHeight: 1.32, color: COLORS.inkSoft }}>{it}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
