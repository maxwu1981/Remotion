import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS } from "../../shared-skills/theme";

/**
 * Thumbnail / cover still for 「Claude 本地 vs 雲端」. Ports the EP00 winning
 * formula: left = brand + 本地 vs 雲端 hero + giant 單向牆 hook; right = the
 * spec cover's number chips as a colour-coded stat wall. Static <Still>.
 */
export const LocalCloudPoster: React.FC = () => {
  const rows = [
    { c: COLORS.teal, n: "2", key: "個世界", gloss: "本地 vs 雲端" },
    { c: COLORS.success, n: "2", key: "份 CLAUDE.md", gloss: "各自獨立" },
    { c: COLORS.hi.violet, n: "0", key: "對話同步", gloss: "容器用完即丟" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 24%)" }} />

      <div style={{ position: "absolute", top: 70, left: 100, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: COLORS.muted }}>
        AI Wisdom · @aiwisdomcc
      </div>

      <div style={{ position: "absolute", top: 138, left: 96 }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 60, color: COLORS.ink, lineHeight: 1 }}>Claude</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
          <span style={{ fontWeight: 800, fontSize: 124, letterSpacing: -3, color: COLORS.teal, lineHeight: 1.02 }}>本地</span>
          <span style={{ fontWeight: 800, fontSize: 72, color: COLORS.faint }}>vs</span>
          <span style={{ fontWeight: 800, fontSize: 124, letterSpacing: -3, color: COLORS.hi.violet, lineHeight: 1.02 }}>雲端</span>
        </div>
      </div>

      <div style={{ position: "absolute", top: 470, left: 92, display: "flex", alignItems: "center", gap: 24 }}>
        <span style={{ fontWeight: 800, fontSize: 300, lineHeight: 0.86, color: COLORS.claudeDeep, letterSpacing: -8 }}>1</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: COLORS.ink }}>道單向牆</span>
          <span style={{ fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: COLORS.ink, borderBottom: `10px solid ${COLORS.warn}`, paddingBottom: 6 }}>決定一切</span>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 72, left: 96, display: "flex", gap: 18, alignItems: "center" }}>
        <span style={{ padding: "16px 34px", borderRadius: RADIUS.pill, background: GRADIENT.claude, color: "#fff", fontWeight: 800, fontSize: 44 }}>一張圖搞懂</span>
        <span style={{ padding: "16px 32px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `2px solid ${COLORS.borderStrong}`, color: COLORS.inkSoft, fontWeight: 800, fontSize: 36 }}>容器·沙盒·Cowork·Dispatch</span>
      </div>

      <div style={{ position: "absolute", top: 80, right: 70, width: 780, display: "flex", flexDirection: "column", gap: 18 }}>
        {rows.map((r) => (
          <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 24, height: 268, padding: "0 40px", borderRadius: RADIUS.lg, background: r.c, color: "#fff", boxSizing: "border-box" }}>
            <span style={{ fontWeight: 800, fontSize: 130, lineHeight: 0.9, letterSpacing: -4, width: 120 }}>{r.n}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontWeight: 800, fontSize: 56, lineHeight: 1.05 }}>{r.key}</span>
              <span style={{ fontWeight: 700, fontSize: 34, opacity: 0.92 }}>{r.gloss}</span>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
