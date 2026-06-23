import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { appearUp, springPop, springV } from "../../shared-skills/anim";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { PAL } from "./palette";
import type { TermLine } from "./schema";

/** Clamped 0→1 ramp between two frames. */
export const ramp = (frame: number, a: number, b: number): number =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** Terminal prompt glyph `>_` — the channel's mark. */
export const BrandGlyph: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.28, background: `linear-gradient(135deg, ${COLORS.remotion}, ${COLORS.claude})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: FONT.mono, fontWeight: 700, fontSize: size * 0.5, letterSpacing: -1 }}>
    {">_"}
  </div>
);

/** Page chrome: backdrop + kicker chip + brand badge + progress bar. */
export const Shell: React.FC<{
  name: string;
  kicker?: string;
  accent?: string;
  durationInFrames: number;
  showChrome?: boolean;
  seed?: string;
  children: React.ReactNode;
}> = ({ name, kicker, accent = COLORS.remotion, durationInFrames, showChrome = true, seed, children }) => {
  const frame = useCurrentFrame();
  const headIn = ramp(frame, 0, 14);
  const progress = Math.max(0, Math.min(1, frame / Math.max(1, durationInFrames - 1)));
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <Backdrop accent={accent} seed={seed ?? kicker ?? "explainer"} freeze />
      <AbsoluteFill>{children}</AbsoluteFill>
      {showChrome ? (
        <>
          <div style={{ position: "absolute", top: 50, left: 92, right: 92, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: headIn, transform: `translateY(${(1 - headIn) * -12}px)` }}>
            {kicker ? (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 11, padding: "8px 18px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: accent, boxShadow: `0 0 0 4px ${accent}22` }} />
                <span style={{ fontFamily: FONT.monoCjk, fontSize: TYPE.tiny, fontWeight: 700, letterSpacing: 1, color: accent }}>{kicker}</span>
              </div>
            ) : (<span />)}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
              <BrandGlyph size={24} />
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, color: COLORS.ink, letterSpacing: -0.3 }}>{name}</span>
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

export const Heading: React.FC<{ zh: string; en?: string; delay?: number; size?: number }> = ({ zh, en, delay = 6, size = TYPE.h2 }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 18, 22);
  return (
    <div style={{ textAlign: "center", ...a }}>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: size, letterSpacing: -0.5, color: COLORS.ink, lineHeight: 1.18 }}>{zh}</div>
      {en ? <div style={{ marginTop: 9, fontFamily: FONT.mono, fontWeight: 500, fontSize: TYPE.small, color: COLORS.muted, letterSpacing: 0.4 }}>{en}</div> : null}
    </div>
  );
};

export const Chip: React.FC<{ text: string; color?: string; size?: number }> = ({ text, color = COLORS.muted, size = TYPE.small }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 11, padding: "10px 20px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
    <span style={{ width: 9, height: 9, borderRadius: "50%", background: color }} />
    <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: size, color: COLORS.inkSoft }}>{text}</span>
  </div>
);

export const KeyLine: React.FC<{ text: string; tone?: string; delay?: number; width?: number; size?: number }> = ({ text, tone = COLORS.remotion, delay = 0, width = 1480, size = TYPE.h3 }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 18, 24);
  return (
    <div style={{ width, margin: "0 auto", padding: "20px 36px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `2px solid ${tone}`, boxShadow: SHADOW.lg, textAlign: "center", ...a }}>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: size, lineHeight: 1.34, color: COLORS.ink }}>{text}</span>
    </div>
  );
};

type StampKind = "yes" | "no" | "warn";
const STAMP: Record<StampKind, { fg: string; bg: string }> = {
  yes: { fg: PAL.yes, bg: PAL.yesBg },
  no: { fg: PAL.no, bg: PAL.noBg },
  warn: { fg: PAL.warn, bg: PAL.warnBg },
};
export const Stamp: React.FC<{ kind: StampKind; text: string; at?: number; size?: number; rotate?: number }> = ({ kind, text, at = 0, size = TYPE.small, rotate = -3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springV(frame, fps, { delay: at, damping: 11, stiffness: 150 });
  const c = STAMP[kind];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "9px 18px", borderRadius: RADIUS.pill, background: c.bg, border: `2px solid ${c.fg}`, color: c.fg, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: size, opacity: Math.min(1, s * 1.4), transform: `scale(${0.6 + 0.4 * Math.min(1, s)}) rotate(${rotate}deg)`, boxShadow: `0 0 0 6px ${c.fg}18`, whiteSpace: "nowrap" }}>{text}</div>
  );
};

/** Dark macOS-style terminal/file panel; lines reveal staggered from `start`. */
export const Terminal: React.FC<{ title?: string; lines: TermLine[]; start?: number; step?: number; width?: number }> = ({ title = "Terminal — zsh", lines, start = 0, step = 16, width = 1180 }) => {
  const frame = useCurrentFrame();
  const T = COLORS.term;
  const color = (k: TermLine["k"]) => (k === "err" ? T.red : k === "ok" ? T.green : k === "cmt" ? T.dim : k === "out" ? T.dim : T.text);
  return (
    <div style={{ width, borderRadius: RADIUS.lg, background: T.bg, border: `1px solid ${COLORS.borderStrong}`, boxShadow: SHADOW.lg, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", background: T.bgTop, borderBottom: `1px solid #ffffff14` }}>
        <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#FF5F57" }} />
        <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#FEBC2E" }} />
        <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#28C840" }} />
        <span style={{ marginLeft: 12, fontFamily: FONT.mono, fontSize: TYPE.tiny, color: T.dim }}>{title}</span>
      </div>
      <div style={{ padding: "26px 30px", display: "flex", flexDirection: "column", gap: 14 }}>
        {lines.map((ln, i) => {
          const a = appearUp(frame, start + i * step, 12, 12);
          return (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 14, ...a }}>
              {ln.k === "cmd" ? <span style={{ fontFamily: FONT.mono, fontSize: TYPE.body, color: T.prompt, fontWeight: 700 }}>$</span> : <span style={{ width: 14 }} />}
              <span style={{ fontFamily: FONT.monoCjk, fontSize: ln.k === "cmd" ? TYPE.body : TYPE.small, fontWeight: ln.k === "cmd" ? 600 : 500, color: color(ln.k), lineHeight: 1.45, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
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

/** Horizontal pipeline: node → node → node, built node-by-node from `start`. */
export const Pipeline: React.FC<{
  nodes: { icon: string; label: string; sub?: string; color: string }[];
  start?: number;
  step?: number;
}> = ({ nodes, start = 0, step = 18 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 10 }}>
      {nodes.map((n, i) => {
        const delay = start + i * step;
        const reveal = springPop(frame, fps, { delay, from: 0.6, dist: 18 });
        return (
          <React.Fragment key={i}>
            <div style={{ ...reveal, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: 230 }}>
              <div style={{ width: 120, height: 120, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, background: COLORS.surface, border: `3px solid ${n.color}`, boxShadow: SHADOW.glow(n.color) }}>{n.icon}</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink, lineHeight: 1.15 }}>{n.label}</div>
                {n.sub ? <div style={{ marginTop: 4, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.small, color: n.color }}>{n.sub}</div> : null}
              </div>
            </div>
            {i < nodes.length - 1 ? (
              <div style={{ paddingTop: 44, fontSize: 48, color: COLORS.borderStrong, opacity: ramp(frame, start + i * step + step * 0.5, start + (i + 1) * step) }}>→</div>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
