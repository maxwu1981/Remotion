import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { appearUp, springV } from "../../shared-skills/anim";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { PAL } from "./data";
import { BRAND } from "./brand";

/** Clamped 0→1 ramp between two frames — tidy interpolate for scenes. */
export const ramp = (frame: number, a: number, b: number): number =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/* ===================================================== brand glyph (phone↔cloud) */

/** The motif of the whole video: a phone linked to a cloud. */
export const BrandGlyph: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size * 1.9} height={size} viewBox="0 0 46 24">
    <rect x="2" y="3" width="13" height="18" rx="3" fill="none" stroke={COLORS.remotion} strokeWidth="2" />
    <line x1="6.5" y1="18.5" x2="10.5" y2="18.5" stroke={COLORS.remotion} strokeWidth="1.6" strokeLinecap="round" />
    <line x1="17" y1="12" x2="28" y2="12" stroke={COLORS.borderStrong} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
    <path
      d="M33 16h7a4 4 0 0 0 .3-8 5.5 5.5 0 0 0-10.6 1.4A3.4 3.4 0 0 0 33 16z"
      fill={COLORS.hi.violet}
      opacity={0.9}
    />
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
      <Backdrop accent={accent} seed={seed ?? kicker ?? "claude-remote"} freeze />
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
            <div style={{ height: "100%", width: `${progress * 100}%`, background: `linear-gradient(90deg, ${COLORS.remotion}, ${COLORS.hi.violet})`, boxShadow: `0 0 14px ${accent}88` }} />
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
const STAMP: Record<StampKind, { fg: string; bg: string; ring: string }> = {
  yes: { fg: PAL.yes, bg: PAL.yesBg, ring: PAL.yes },
  no: { fg: PAL.no, bg: PAL.noBg, ring: PAL.no },
  warn: { fg: PAL.warn, bg: PAL.warnBg, ring: PAL.warn },
};

/**
 * A stamped verdict badge that springs in with a tiny rotation — the recurring
 * ✔共享 / ✘不共享 / ⚠注意 token. `at` is a scene-local frame.
 */
export const Stamp: React.FC<{
  kind: StampKind;
  text: string;
  at?: number;
  size?: number;
  rotate?: number;
}> = ({ kind, text, at = 0, size = TYPE.body, rotate = -3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springV(frame, fps, { delay: at, damping: 11, stiffness: 150 });
  const c = STAMP[kind];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 18px",
        borderRadius: RADIUS.pill,
        background: c.bg,
        border: `2px solid ${c.fg}`,
        color: c.fg,
        fontFamily: FONT.uiCjk,
        fontWeight: 800,
        fontSize: size,
        opacity: Math.min(1, s * 1.4),
        transform: `scale(${0.6 + 0.4 * Math.min(1, s)}) rotate(${(1 - Math.min(1, s)) * 0 + rotate}deg)`,
        boxShadow: `0 0 0 6px ${c.ring}18`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/* ================================================================= chip ====== */

/** A neutral rounded info chip with an accent dot. */
export const Chip: React.FC<{
  text: string;
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
  text: string;
  tone?: string;
  delay?: number;
  width?: number;
  size?: number;
}> = ({ text, tone = COLORS.remotion, delay = 0, width = 1300, size = TYPE.h3 }) => {
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

/* ============================================================ signal dots ==== */

const quad = (t: number, p0: number, c: number, p1: number) =>
  (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * c + t * t * p1;

/**
 * A connector between two points: a line that draws in (`progress` 0→1) then
 * carries flowing dots. The recurring "signal / data flow" motif.
 */
export const SignalDots: React.FC<{
  from: [number, number];
  to: [number, number];
  ctrl?: [number, number];
  progress?: number;
  color?: string;
  width?: number;
  dots?: number;
  speed?: number;
  dashed?: boolean;
  endDots?: boolean;
}> = ({ from, to, ctrl, progress = 1, color = COLORS.remotion, width = 3, dots = 4, speed = 46, dashed = false, endDots = true }) => {
  const frame = useCurrentFrame();
  const c = ctrl ?? [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
  const d = `M ${from[0]} ${from[1]} Q ${c[0]} ${c[1]} ${to[0]} ${to[1]}`;
  const tipX = quad(progress, from[0], c[0], to[0]);
  const tipY = quad(progress, from[1], c[1], to[1]);
  const flowing = progress > 0.96;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <path d={d} fill="none" stroke={`${color}40`} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? "3 8" : undefined} />
      {/* drawn portion */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? "3 8" : 2000}
        strokeDashoffset={dashed ? 0 : 2000 * (1 - progress)}
        opacity={dashed ? interpolate(progress, [0, 1], [0, 0.85]) : 1}
      />
      {endDots ? <circle cx={from[0]} cy={from[1]} r={width + 2} fill={color} /> : null}
      {progress > 0.04 && !flowing ? <circle cx={tipX} cy={tipY} r={width + 1} fill={color} /> : null}
      {flowing
        ? new Array(dots).fill(0).map((_, i) => {
            const t = (((frame / speed + i / dots) % 1) + 1) % 1;
            const x = quad(t, from[0], c[0], to[0]);
            const y = quad(t, from[1], c[1], to[1]);
            return <circle key={i} cx={x} cy={y} r={width + 1.5} fill={color} opacity={Math.sin(Math.PI * t)} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />;
          })
        : null}
      {endDots ? <circle cx={to[0]} cy={to[1]} r={width + 2} fill={color} opacity={ramp(progress, 0.5, 1)} /> : null}
    </svg>
  );
};

/* ============================================================ flow arrow ===== */

/** A short directional connector that draws then pulses a dot. Inline SVG. */
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
  const box = vertical
    ? { w: 24, h: len }
    : { w: len, h: 24 };
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
