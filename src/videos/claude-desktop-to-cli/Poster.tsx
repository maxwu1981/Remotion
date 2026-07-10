import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS } from "../../shared-skills/theme";
import { MOTIF } from "./data";

/**
 * Thumbnail / cover still. Ports the EP00 winning formula: left = brand + giant
 * number hook; right = colour-coded info wall (the 3 重點). Static <Still>.
 */
export const Poster: React.FC = () => {
  const rows = [
    { c: MOTIF.code, key: "Code 分頁 ≡ CLI", gloss: "同引擎、設定共用" },
    { c: MOTIF.engine, key: "同一個引擎", gloss: "登入後自動就有" },
    { c: MOTIF.disk, key: "換機備份", gloss: "整包 ~/.claude/" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 24%)" }} />

      <div style={{ position: "absolute", top: 70, left: 100, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: COLORS.muted }}>
        AI Wisdom · @aiwisdomcc
      </div>

      <div style={{ position: "absolute", top: 140, left: 96 }}>
        <div style={{ fontWeight: 800, fontSize: 78, color: COLORS.ink, lineHeight: 1.04 }}>Claude 桌面版</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{ fontWeight: 800, fontSize: 110, color: COLORS.faint, lineHeight: 1 }}>→</span>
          <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 132, letterSpacing: -2, lineHeight: 1.04, color: "transparent", background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text" }}>CLI</span>
        </div>
      </div>

      <div style={{ position: "absolute", top: 488, left: 92, display: "flex", alignItems: "center", gap: 24 }}>
        <span style={{ fontWeight: 800, fontSize: 300, lineHeight: 0.86, color: COLORS.claudeDeep, letterSpacing: -8 }}>{rows.length}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: COLORS.ink }}>個重點</span>
          <span style={{ fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: COLORS.ink, borderBottom: `10px solid ${COLORS.remotion}`, paddingBottom: 6 }}>一次搞懂</span>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 72, left: 96, display: "flex", gap: 18, alignItems: "center" }}>
        <span style={{ padding: "16px 34px", borderRadius: RADIUS.pill, background: GRADIENT.claude, color: "#fff", fontWeight: 800, fontSize: 44 }}>桌面 → 終端 · 一次搞懂</span>
        <span style={{ padding: "16px 32px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `2px solid ${COLORS.borderStrong}`, color: COLORS.inkSoft, fontWeight: 800, fontSize: 40 }}>含換機備份腳本</span>
      </div>

      <div style={{ position: "absolute", top: 80, right: 70, width: 780, display: "flex", flexDirection: "column", gap: 18 }}>
        {rows.map((r, i) => (
          <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 22, height: 268, padding: "0 36px", borderRadius: RADIUS.lg, background: r.c, color: "#fff", boxSizing: "border-box" }}>
            <span style={{ fontWeight: 800, fontSize: 64, opacity: 0.5, width: 54 }}>{i + 1}</span>
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
