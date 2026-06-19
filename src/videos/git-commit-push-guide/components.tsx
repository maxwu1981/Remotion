import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { appearUp, springPop, springV } from "../../shared-skills/anim";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { PAL, PIPELINE } from "./data";
import { BRAND } from "./brand";

/** Clamped 0→1 ramp between two frames — tidy interpolate for scenes. */
export const ramp = (frame: number, a: number, b: number): number =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/* ===================================================== brand glyph (the pipeline) */

/** The motif of the whole video, in miniature: file → save dot → cloud. */
export const BrandGlyph: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size * 2.1} height={size} viewBox="0 0 50 24">
    {/* file */}
    <rect x="2" y="4" width="12" height="16" rx="2.5" fill="none" stroke={COLORS.hi.sky} strokeWidth="2" />
    <line x1="5" y1="9" x2="11" y2="9" stroke={COLORS.hi.sky} strokeWidth="1.6" strokeLinecap="round" />
    <line x1="5" y1="13" x2="11" y2="13" stroke={COLORS.hi.sky} strokeWidth="1.6" strokeLinecap="round" />
    {/* commit dot */}
    <circle cx="25" cy="12" r="4.4" fill={COLORS.hi.violet} />
    <line x1="16" y1="12" x2="20.5" y2="12" stroke={COLORS.borderStrong} strokeWidth="2" strokeLinecap="round" />
    {/* cloud */}
    <line x1="29.5" y1="12" x2="34" y2="12" stroke={COLORS.borderStrong} strokeWidth="2" strokeLinecap="round" />
    <path d="M38 17h7a3.5 3.5 0 0 0 .3-7 5 5 0 0 0-9.6 1.3A3 3 0 0 0 38 17z" fill={COLORS.remotion} opacity={0.9} />
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
      <Backdrop accent={accent} seed={seed ?? kicker ?? "git-guide"} freeze />
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
            <div style={{ height: "100%", width: `${progress * 100}%`, background: `linear-gradient(90deg, ${COLORS.hi.sky}, ${COLORS.hi.violet}, ${COLORS.remotion})`, boxShadow: `0 0 14px ${accent}88` }} />
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

/**
 * A stamped verdict badge that springs in with a tiny rotation — the recurring
 * ✔ / ✘ / ⚠ token. `at` is a scene-local frame.
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
        transform: `scale(${0.6 + 0.4 * Math.min(1, s)}) rotate(${rotate}deg)`,
        boxShadow: `0 0 0 6px ${c.fg}18`,
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

/* ============================================================== pipeline ===== */

/** One node of the master pipeline: a colored emoji token + label(s). */
const PipeNode: React.FC<{
  stage: (typeof PIPELINE)[number];
  reveal: { opacity: number; transform: string };
  active: boolean;
  scale: number;
}> = ({ stage, reveal, active, scale }) => {
  const d = 116 * scale;
  return (
    <div style={{ ...reveal, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 * scale }}>
      <div
        style={{
          width: d,
          height: d,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: d * 0.46,
          background: COLORS.surface,
          border: `${active ? 3 : 2}px solid ${stage.color}${active ? "" : "66"}`,
          boxShadow: active ? SHADOW.glow(stage.color) : SHADOW.md,
          transform: `scale(${active ? 1.06 : 1})`,
        }}
      >
        <span>{stage.emoji}</span>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body * scale, color: COLORS.ink, lineHeight: 1.1 }}>{stage.zh}</div>
        {"sub" in stage && stage.sub ? (
          <div style={{ marginTop: 4, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.small * scale, color: stage.color }}>{stage.sub}</div>
        ) : null}
      </div>
    </div>
  );
};

/**
 * The master pipeline 改檔案 → commit → push. Built node-by-node from `start`
 * (each node + its connecting arrow appears `step` frames apart) so a beginner
 * follows the order. `active` highlights one stage. Reused in the cover, outro
 * and as a recurring reference strip.
 */
export const Pipeline: React.FC<{
  start?: number;
  step?: number;
  active?: "file" | "commit" | "push" | null;
  scale?: number;
  gap?: number;
}> = ({ start = 0, step = 16, active = null, scale = 1, gap = 18 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: gap * scale }}>
      {PIPELINE.map((stage, i) => {
        const nodeDelay = start + i * step;
        const reveal = springPop(frame, fps, { delay: nodeDelay, from: 0.6, dist: 18 });
        return (
          <React.Fragment key={stage.key}>
            <div style={{ paddingTop: 22 * scale }}>
              <PipeNode stage={stage} reveal={reveal} active={active === stage.key} scale={scale} />
            </div>
            {i < PIPELINE.length - 1 ? (
              <div style={{ paddingTop: (22 + 116 * 0.5 - 12) * scale }}>
                <FlowArrow
                  width={92 * scale}
                  thickness={3}
                  color={COLORS.borderStrong}
                  progress={ramp(frame, nodeDelay + step * 0.5, nodeDelay + step)}
                />
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
