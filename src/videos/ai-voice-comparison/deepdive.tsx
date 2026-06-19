import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { appearUp, enter } from "../../shared-skills/anim";
import { RADAR_AXES, Metrics, Tool } from "./data";
import { MetricBar, ScoreBadge, TagChip, ToolGlyph } from "./components";

const ramp = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/* =============================================================== MOS badge === */

export const MosBadge: React.FC<{ mos: number; color: string; delay?: number }> = ({ mos, color, delay = 0 }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, delay, delay + 26);
  const shown = (mos * p).toFixed(1);
  const filled = Math.round(mos);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 20px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
      <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 40, lineHeight: 1, color }}>{shown}</span>
      <span style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, fontWeight: 700, letterSpacing: 1, color: COLORS.faint }}>MOS / 5</span>
      <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
        {new Array(5).fill(0).map((_, i) => (
          <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < filled ? color : COLORS.border }} />
        ))}
      </div>
    </div>
  );
};

/* ============================================================ caveat box === */

export const CaveatCallout: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 14, 16);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", borderRadius: RADIUS.md, background: COLORS.warnBg, border: `1px solid ${COLORS.warn}44`, ...a }}>
      <span style={{ fontSize: 22 }}>⚠️</span>
      <span style={{ fontFamily: FONT.ui, fontSize: TYPE.small, fontWeight: 600, color: "#8A5A00" }}>
        <b style={{ color: COLORS.warn }}>Watch out: </b>
        {text}
      </span>
    </div>
  );
};

/* ============================================================ price box === */

export const PriceCallout: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 14, 16);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", borderRadius: RADIUS.md, background: COLORS.successBg, border: `1px solid ${COLORS.success}44`, ...a }}>
      <span style={{ fontSize: 22 }}>💲</span>
      <span style={{ fontFamily: FONT.ui, fontSize: TYPE.small, fontWeight: 600, color: "#176B3A" }}>
        <b style={{ color: COLORS.success }}>Price: </b>
        {text}
      </span>
    </div>
  );
};

/* ========================================================== tool deep dive === */

export const ToolDeepDive: React.FC<{
  tool: Tool;
  highlight: keyof Metrics;
  rank?: number;
}> = ({ tool, highlight, rank }) => {
  const frame = useCurrentFrame();
  const left = appearUp(frame, 8, 16, 22);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 60 }}>
      {/* identity + scores */}
      <div style={{ width: 560, ...left }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <ToolGlyph tool={tool} size={76} />
            {rank ? (
              <span style={{ position: "absolute", right: -10, top: -10, width: 32, height: 32, borderRadius: "50%", background: COLORS.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.mono, fontWeight: 800, fontSize: 15, border: "2px solid #fff", boxShadow: SHADOW.sm }}>
                #{rank}
              </span>
            ) : null}
          </div>
          <div>
            <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h1, letterSpacing: -1, color: COLORS.ink }}>{tool.name}</div>
            <div style={{ marginTop: 3, fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 700, color: tool.color }}>{tool.emoji} {tool.forWhom}</div>
          </div>
        </div>

        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 22 }}>
          <ScoreBadge score={tool.overallScore} color={tool.color} delay={12} size={128} sub="OVERALL" />
          <MosBadge mos={tool.mosScore} color={tool.color} delay={16} />
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {tool.tags.map((t) => (
              <TagChip key={t} color={tool.color}>{t}</TagChip>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          <PriceCallout text={tool.priceNote} delay={36} />
          <CaveatCallout text={tool.caveat} delay={48} />
        </div>
      </div>

      {/* full 4-metric breakdown */}
      <div style={{ width: 560 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, fontWeight: 700, letterSpacing: 2, color: COLORS.faint, marginBottom: 18 }}>
          ALL FOUR METRICS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {RADAR_AXES.map((ax, i) => (
            <MetricBar
              key={ax.key}
              label={ax.label}
              value={tool.metrics[ax.key]}
              color={tool.color}
              delay={24 + i * 8}
              highlight={ax.key === highlight}
              width={560}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ========================================================= comparison table === */

const COLS: { label: string; get: (t: Tool) => number; fmt: (n: number) => string }[] = [
  { label: "MOS", get: (t) => t.mosScore, fmt: (n) => n.toFixed(1) },
  { label: "Natural", get: (t) => t.metrics.naturalness, fmt: (n) => `${n}` },
  { label: "Emotion", get: (t) => t.metrics.emotion, fmt: (n) => `${n}` },
  { label: "Speed", get: (t) => t.metrics.speed, fmt: (n) => `${n}` },
  { label: "Value", get: (t) => t.metrics.costEfficiency, fmt: (n) => `${n}` },
  { label: "Overall", get: (t) => t.overallScore, fmt: (n) => `${n}` },
];

export const ComparisonTable: React.FC<{ tools: Tool[]; delay?: number; rowStep?: number }> = ({ tools, delay = 0, rowStep = 12 }) => {
  const frame = useCurrentFrame();
  const maxima = COLS.map((c) => Math.max(...tools.map((t) => c.get(t))));
  const grid = "1.5fr repeat(6, 0.82fr) 1.15fr";

  return (
    <div style={{ width: 1640, borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.lg, overflow: "hidden" }}>
      {/* header */}
      <div style={{ display: "grid", gridTemplateColumns: grid, padding: "16px 26px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.surfaceAlt }}>
        <span style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, fontWeight: 700, letterSpacing: 1, color: COLORS.faint }}>TOOL</span>
        {COLS.map((c) => (
          <span key={c.label} style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, fontWeight: 700, letterSpacing: 1, color: COLORS.faint, textAlign: "center" }}>{c.label}</span>
        ))}
        <span style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, fontWeight: 700, letterSpacing: 1, color: COLORS.faint, textAlign: "center" }}>PRICE</span>
      </div>
      {/* rows */}
      {tools.map((t, ri) => {
        const a = enter(frame, delay + ri * rowStep, 12);
        return (
          <div key={t.id} style={{ display: "grid", gridTemplateColumns: grid, alignItems: "center", padding: "15px 26px", borderBottom: ri < tools.length - 1 ? `1px solid ${COLORS.border}` : "none", opacity: a, transform: `translateX(${(1 - a) * -16}px)` }}>
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <ToolGlyph tool={t} size={36} />
              <span style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.small, color: COLORS.ink }}>{t.name}</span>
            </span>
            {COLS.map((c, ci) => {
              const v = c.get(t);
              const isWin = v === maxima[ci];
              return (
                <span key={c.label} style={{ textAlign: "center", fontFamily: FONT.mono, fontSize: TYPE.body, fontWeight: isWin ? 800 : 600, color: isWin ? t.color : COLORS.muted }}>
                  {isWin ? "👑 " : ""}{c.fmt(v)}
                </span>
              );
            })}
            <span style={{ textAlign: "center", fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 700, color: COLORS.inkSoft }}>{t.price}</span>
          </div>
        );
      })}
    </div>
  );
};

/* =========================================================== leaderboard === */

/** Ranked overall-score bars — a clear, numeric alternative to the overlaid radar. */
export const Leaderboard: React.FC<{ tools: Tool[]; delay?: number; width?: number }> = ({ tools, delay = 0, width = 640 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width, display: "flex", flexDirection: "column", gap: 18 }}>
      {tools.map((t, i) => {
        const p = ramp(frame, delay + i * 12, delay + i * 12 + 26);
        const shown = Math.round(t.overallScore * p);
        return (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ width: 36, fontFamily: FONT.mono, fontWeight: 800, fontSize: TYPE.h3, color: i === 0 ? t.color : COLORS.faint, textAlign: "center" }}>{i + 1}</span>
            <ToolGlyph tool={t} size={50} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <span style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.body, color: COLORS.ink }}>{t.name}</span>
                <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h3, color: t.color }}>{shown}</span>
              </div>
              <div style={{ height: 16, borderRadius: 999, background: COLORS.bgAlt, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${t.overallScore * p}%`, borderRadius: 999, background: `linear-gradient(90deg, ${t.color}, ${COLORS.teal})`, boxShadow: `0 0 12px ${t.color}88` }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
