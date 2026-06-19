import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { enter } from "../../shared-skills/anim";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { GlassPanel } from "../../shared-skills/components/lux";
import { BRAND } from "./brand";
import type { Tool } from "./data";

const ramp = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/* =============================================================== shell === */

export const Shell: React.FC<{
  kicker?: string;
  accent?: string;
  durationInFrames: number;
  showChrome?: boolean;
  children: React.ReactNode;
}> = ({ kicker, accent = COLORS.remotion, durationInFrames, showChrome = true, children }) => {
  const frame = useCurrentFrame();
  const headIn = enter(frame, 0, 14);
  const progress = Math.max(0, Math.min(1, frame / Math.max(1, durationInFrames - 1)));
  return (
    <AbsoluteFill style={{ fontFamily: FONT.ui, color: COLORS.ink }}>
      <Backdrop accent={accent} seed={kicker ?? "ai-voice"} />
      <AbsoluteFill>{children}</AbsoluteFill>
      {showChrome ? (
        <>
          <div style={{ position: "absolute", top: 50, left: 92, right: 92, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: headIn, transform: `translateY(${(1 - headIn) * -12}px)` }}>
            {kicker ? (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 11, padding: "8px 17px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: accent, boxShadow: `0 0 0 4px ${accent}22` }} />
                <span style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, fontWeight: 700, letterSpacing: 2, color: accent }}>{kicker}</span>
              </div>
            ) : <span />}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 15px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
              <EqualizerBars color={accent} count={4} barW={4} height={18} gap={3} />
              <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.small, color: COLORS.ink, letterSpacing: -0.3 }}>
                {BRAND.name}
              </span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: COLORS.bgAlt }}>
            <div style={{ height: "100%", width: `${progress * 100}%`, background: `linear-gradient(90deg, ${accent}, ${COLORS.teal})`, boxShadow: `0 0 14px ${accent}88` }} />
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/* ========================================================= equalizer === */

export const EqualizerBars: React.FC<{
  color?: string;
  count?: number;
  barW?: number;
  height?: number;
  gap?: number;
  seed?: number;
}> = ({ color = COLORS.remotion, count = 7, barW = 6, height = 40, gap = 4, seed = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap, height }}>
      {new Array(count).fill(0).map((_, i) => {
        const phase = i * 0.8 + seed;
        const h = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(frame / 5 + phase));
        return <div key={i} style={{ width: barW, height: `${h * 100}%`, borderRadius: barW, background: color }} />;
      })}
    </div>
  );
};

/* ======================================================== score ring === */

export const ScoreBadge: React.FC<{
  score: number;
  color: string;
  delay?: number;
  size?: number;
  sub?: string;
  textColor?: string;
  subColor?: string;
}> = ({ score, color, delay = 0, size = 150, sub, textColor = COLORS.ink, subColor = COLORS.faint }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, delay, delay + 30);
  const r = size / 2 - 10;
  const circ = 2 * Math.PI * r;
  const shown = Math.round(score * p);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS.bgAlt} strokeWidth={9} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - (score / 100) * p)} style={{ filter: `drop-shadow(0 0 6px ${color}88)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: size * 0.34, lineHeight: 1, color: textColor }}>{shown}</span>
        <span style={{ fontFamily: FONT.mono, fontSize: size * 0.1, color: subColor, marginTop: 2 }}>{sub ?? "/ 100"}</span>
      </div>
    </div>
  );
};

/* ======================================================== metric bar === */

export const MetricBar: React.FC<{
  label: string;
  value: number;
  color: string;
  delay?: number;
  highlight?: boolean;
  width?: number;
}> = ({ label, value, color, delay = 0, highlight = false, width = 460 }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, delay, delay + 22);
  const shown = Math.round(value * p);
  return (
    <div style={{ width }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: highlight ? 800 : 600, color: highlight ? color : COLORS.inkSoft }}>
          {label}
        </span>
        <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 800, color: highlight ? color : COLORS.muted }}>{shown}</span>
      </div>
      <div style={{ height: 12, borderRadius: 999, background: COLORS.bgAlt, overflow: "hidden", boxShadow: highlight ? `0 0 0 2px ${color}44` : "none" }}>
        <div style={{ height: "100%", width: `${value * p}%`, borderRadius: 999, background: highlight ? `linear-gradient(90deg, ${color}, ${COLORS.teal})` : color, boxShadow: highlight ? `0 0 14px ${color}` : "none" }} />
      </div>
    </div>
  );
};

/* =========================================================== tag chip === */

export const TagChip: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = COLORS.muted }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "6px 14px", borderRadius: RADIUS.pill, background: `${color}14`, border: `1px solid ${color}3a`, fontFamily: FONT.mono, fontSize: TYPE.tiny, fontWeight: 700, color }}>
    {children}
  </span>
);

/* ========================================================= tool glyph === */

export const ToolGlyph: React.FC<{ tool: Tool; size?: number }> = ({ tool, size = 64 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.28, background: `linear-gradient(150deg, ${tool.color}, ${tool.color}bb)`, boxShadow: `0 10px 24px -8px ${tool.color}99`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5 }}>
    <span>{tool.emoji}</span>
  </div>
);

/* =========================================================== tool card === */

export const ToolCard: React.FC<{
  tool: Tool;
  delay?: number;
  width?: number;
  showTags?: boolean;
}> = ({ tool, delay = 0, width = 520, showTags = true }) => {
  const frame = useCurrentFrame();
  const appear = enter(frame, delay, 16);
  return (
    <div style={{ width, opacity: appear, transform: `translateY(${(1 - appear) * 24}px)` }}>
      <GlassPanel tint={tool.color} glow={tool.color} glowAmt={0.4} radius={26} style={{ width: "100%" }}>
        <div style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ToolGlyph tool={tool} size={62} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink, letterSpacing: -0.5 }}>{tool.name}</div>
              <div style={{ marginTop: 3, fontFamily: FONT.mono, fontSize: TYPE.tiny, fontWeight: 700, color: tool.color }}>{tool.emoji} {tool.forWhom}</div>
            </div>
            <ScoreBadge score={tool.overallScore} color={tool.color} delay={delay + 6} size={104} />
          </div>
          {showTags ? (
            <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 9 }}>
              {tool.tags.map((t) => (
                <TagChip key={t} color={tool.color}>{t}</TagChip>
              ))}
            </div>
          ) : null}
        </div>
      </GlassPanel>
    </div>
  );
};
