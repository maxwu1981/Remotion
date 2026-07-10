import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { appearUp, springV } from "../../shared-skills/anim";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { PAL } from "./data";
import { BRAND } from "./brand";

/** Clamped 0→1 ramp between two frames. */
export const ramp = (frame: number, a: number, b: number): number =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/* ============================================================= brand glyph === */

/** A terminal prompt glyph `>_` in a gradient tile — the video's mark. */
export const BrandGlyph: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: `linear-gradient(135deg, ${COLORS.remotion}, ${COLORS.claude})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontFamily: FONT.mono,
      fontWeight: 700,
      fontSize: size * 0.5,
      letterSpacing: -1,
    }}
  >
    {">_"}
  </div>
);

/* ================================================================= shell ===== */

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
      <Backdrop accent={accent} seed={seed ?? kicker ?? "cc-install"} freeze />
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
              <BrandGlyph size={24} />
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, color: COLORS.ink, letterSpacing: -0.3 }}>{BRAND.name}</span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: COLORS.bgAlt }}>
            <div style={{ height: "100%", width: `${progress * 100}%`, background: `linear-gradient(90deg, ${COLORS.remotion}, ${COLORS.hi.violet}, ${COLORS.claude})`, boxShadow: `0 0 14px ${accent}88` }} />
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/* =============================================================== heading ===== */

/** A scene title: bold Chinese line + a muted English/mono sub-line. */
export const Heading: React.FC<{ zh: string; en?: string; delay?: number; size?: number }> = ({
  zh,
  en,
  delay = 6,
  size = TYPE.h2,
}) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 18, 22);
  return (
    <div style={{ textAlign: "center", ...a }}>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: size, letterSpacing: -0.5, color: COLORS.ink, lineHeight: 1.18 }}>{zh}</div>
      {en ? <div style={{ marginTop: 9, fontFamily: FONT.mono, fontWeight: 500, fontSize: TYPE.small, color: COLORS.muted, letterSpacing: 0.4 }}>{en}</div> : null}
    </div>
  );
};

/* ================================================================ chip ======= */

export const Chip: React.FC<{ text: string; color?: string; icon?: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({
  text,
  color = COLORS.muted,
  icon,
  size = TYPE.small,
  style,
}) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 11, padding: "10px 20px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm, ...style }}>
    {icon ?? <span style={{ width: 9, height: 9, borderRadius: "50%", background: color }} />}
    <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: size, color: COLORS.inkSoft }}>{text}</span>
  </div>
);

/* =============================================================== key-line ==== */

/** The prominent "land on screen" banner stating a section's key takeaway. */
export const KeyLine: React.FC<{ text: string; tone?: string; delay?: number; width?: number; size?: number }> = ({
  text,
  tone = COLORS.remotion,
  delay = 0,
  width = 1480,
  size = TYPE.h3,
}) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 18, 24);
  return (
    <div style={{ width, margin: "0 auto", padding: "20px 36px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `2px solid ${tone}`, boxShadow: SHADOW.lg, textAlign: "center", ...a }}>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: size, lineHeight: 1.34, color: COLORS.ink }}>{text}</span>
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

/** A stamped verdict badge that springs in with a tiny rotation. `at` is scene-local. */
export const Stamp: React.FC<{ kind: StampKind; text: string; at?: number; size?: number; rotate?: number }> = ({
  kind,
  text,
  at = 0,
  size = TYPE.body,
  rotate = -3,
}) => {
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

/* ============================================================== terminal ===== */

export type TLine = { k: "cmd" | "out" | "err" | "ok" | "cmt"; t: string };

/** A dark macOS-style terminal panel; lines reveal staggered from `start`. */
export const Terminal: React.FC<{
  title?: string;
  lines: TLine[];
  start?: number;
  step?: number;
  width?: number;
}> = ({ title = "Terminal — zsh", lines, start = 0, step = 16, width = 1180 }) => {
  const frame = useCurrentFrame();
  const T = COLORS.term;
  const color = (k: TLine["k"]) =>
    k === "err" ? T.red : k === "ok" ? T.green : k === "cmt" ? T.dim : k === "out" ? T.dim : T.text;
  return (
    <div style={{ width, borderRadius: RADIUS.lg, background: T.bg, border: `1px solid ${COLORS.borderStrong}`, boxShadow: SHADOW.lg, overflow: "hidden" }}>
      {/* title bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", background: T.bgTop, borderBottom: `1px solid #ffffff14` }}>
        <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#FF5F57" }} />
        <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#FEBC2E" }} />
        <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#28C840" }} />
        <span style={{ marginLeft: 12, fontFamily: FONT.mono, fontSize: TYPE.tiny, color: T.dim }}>{title}</span>
      </div>
      {/* body */}
      <div style={{ padding: "26px 30px", display: "flex", flexDirection: "column", gap: 14 }}>
        {lines.map((ln, i) => {
          const a = appearUp(frame, start + i * step, 12, 12);
          return (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 14, ...a }}>
              {ln.k === "cmd" ? <span style={{ fontFamily: FONT.mono, fontSize: TYPE.body, color: T.prompt, fontWeight: 700 }}>$</span> : <span style={{ width: 14 }} />}
              <span
                style={{
                  fontFamily: FONT.monoCjk,
                  fontSize: ln.k === "cmd" ? TYPE.body : TYPE.small,
                  fontWeight: ln.k === "cmd" ? 600 : 500,
                  color: color(ln.k),
                  lineHeight: 1.45,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {ln.k === "ok" ? "✓ " : ln.k === "err" ? "✗ " : ln.k === "cmt" ? "# " : ""}
                {ln.t}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
