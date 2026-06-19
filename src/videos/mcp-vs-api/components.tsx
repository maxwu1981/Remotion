import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { appearUp } from "../../shared-skills/anim";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { BRAND } from "./brand";

/** Clamped 0→1 ramp between two frames — tidy interpolate for scenes. */
export const ramp = (frame: number, a: number, b: number): number =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/* ====================================================== connector glyph === */

/** The brand motif: a blue (API) node and an orange (MCP) node, linked. */
export const ConnectorGlyph: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <line x1="6.5" y1="12" x2="17.5" y2="12" stroke={COLORS.borderStrong} strokeWidth="2" strokeLinecap="round" />
    <circle cx="6" cy="12" r="3.6" fill={COLORS.remotion} />
    <circle cx="18" cy="12" r="3.6" fill={COLORS.claude} />
  </svg>
);

/* ================================================================ shell === */

/** Page chrome shared by every scene: backdrop, kicker chip, brand badge, bar. */
export const Shell: React.FC<{
  kicker?: string;
  accent?: string;
  durationInFrames: number;
  showChrome?: boolean;
  children: React.ReactNode;
}> = ({ kicker, accent = COLORS.remotion, durationInFrames, showChrome = true, children }) => {
  const frame = useCurrentFrame();
  const headIn = ramp(frame, 0, 14);
  const progress = Math.max(0, Math.min(1, frame / Math.max(1, durationInFrames - 1)));
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <Backdrop accent={accent} seed={kicker ?? "mcp-api"} />
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
              <ConnectorGlyph />
              <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.small, color: COLORS.ink, letterSpacing: -0.3 }}>{BRAND.name}</span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: COLORS.bgAlt }}>
            <div style={{ height: "100%", width: `${progress * 100}%`, background: `linear-gradient(90deg, ${COLORS.remotion}, ${COLORS.claude})`, boxShadow: `0 0 14px ${accent}88` }} />
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/* ============================================================= heading === */

/** A scene title: bold Chinese line + a muted English/мono sub-line. */
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

/* ============================================================ side badge === */

/** A colour-coded API / MCP pill. */
export const SideBadge: React.FC<{ label: string; color: string; sub?: string; big?: boolean }> = ({ label, color, sub, big }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 11, padding: big ? "11px 24px" : "7px 16px", borderRadius: RADIUS.pill, background: `${color}14`, border: `1.5px solid ${color}44` }}>
    <span style={{ width: big ? 13 : 9, height: big ? 13 : 9, borderRadius: "50%", background: color, boxShadow: `0 0 0 4px ${color}22` }} />
    <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: big ? TYPE.h3 : TYPE.body, color, letterSpacing: 0.4 }}>{label}</span>
    {sub ? <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: big ? TYPE.small : TYPE.tiny, color: COLORS.muted }}>{sub}</span> : null}
  </div>
);

/* ============================================================ icon bubble === */

/** Circular emoji token used by the flow / sources diagrams. */
export const IconBubble: React.FC<{ emoji: string; color: string; size?: number; active?: boolean }> = ({ emoji, color, size = 96, active }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.46,
      background: COLORS.surface,
      border: `2px solid ${color}55`,
      boxShadow: active ? SHADOW.glow(color) : SHADOW.md,
    }}
  >
    <span>{emoji}</span>
  </div>
);

/* ============================================================ flow arrow === */

/** A short horizontal connector that draws left→right and then pulses a dot. */
export const FlowArrow: React.FC<{ width?: number; color?: string; progress?: number }> = ({ width = 86, color = COLORS.faint, progress = 1 }) => {
  const frame = useCurrentFrame();
  const p = Math.max(0, Math.min(1, progress));
  const tip = 6 + (width - 16) * p;
  const headOp = ramp(p, 0.55, 1);
  const dotT = (frame % 42) / 42;
  const dotX = 6 + (width - 16) * dotT;
  return (
    <svg width={width} height={22} style={{ overflow: "visible" }}>
      <line x1={6} y1={11} x2={tip} y2={11} stroke={color} strokeWidth={2.5} strokeLinecap="round" opacity={0.6} />
      {p > 0.99 ? <circle cx={dotX} cy={11} r={3} fill={color} opacity={Math.sin(Math.PI * dotT)} /> : null}
      <g transform={`translate(${tip} 11)`} opacity={headOp}>
        <path d="M-7 -5 L1 0 L-7 5" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};
