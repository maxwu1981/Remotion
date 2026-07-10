import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS } from "../../shared-skills/theme";
import { MOTIF } from "./data";

/**
 * Thumbnail / cover still. Ports the EP00 「新手地圖」 winning formula:
 * left = brand + giant number hook; right = high-density colour-coded info wall
 * (here the 4 安裝關鍵). Static <Still>.
 */
export const Poster: React.FC = () => {
  const rows = [
    { c: MOTIF.node, key: "Node 18+", gloss: "先升到 18 再裝" },
    { c: MOTIF.perm, key: "別用 sudo", gloss: "改用 nvm 最乾淨" },
    { c: MOTIF.path, key: "PATH 沒設", gloss: "≠ 沒裝成功" },
    { c: MOTIF.auth, key: "登入一次", gloss: "做一次就記住" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 24%)" }} />

      <div style={{ position: "absolute", top: 70, left: 100, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: COLORS.muted }}>
        AI Wisdom · @aiwisdomcc
      </div>

      <div style={{ position: "absolute", top: 140, left: 96 }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 76, color: COLORS.ink, lineHeight: 1 }}>Claude Code</div>
        <div style={{ fontWeight: 800, fontSize: 132, letterSpacing: -2, lineHeight: 1.04, color: "transparent", background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text" }}>安裝經驗</div>
      </div>

      <div style={{ position: "absolute", top: 478, left: 92, display: "flex", alignItems: "center", gap: 24 }}>
        <span style={{ fontWeight: 800, fontSize: 300, lineHeight: 0.86, color: COLORS.claudeDeep, letterSpacing: -8 }}>{rows.length}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: COLORS.ink }}>大關鍵</span>
          <span style={{ fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: COLORS.ink, borderBottom: `10px solid ${COLORS.remotion}`, paddingBottom: 6 }}>一次裝對</span>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 72, left: 96, display: "flex", gap: 18, alignItems: "center" }}>
        <span style={{ padding: "16px 34px", borderRadius: RADIUS.pill, background: GRADIENT.claude, color: "#fff", fontWeight: 800, fontSize: 44 }}>親手裝過 · 實戰</span>
        <span style={{ padding: "16px 32px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `2px solid ${COLORS.borderStrong}`, color: COLORS.inkSoft, fontWeight: 800, fontSize: 40 }}>中英對照</span>
      </div>

      <div style={{ position: "absolute", top: 80, right: 70, width: 780, display: "flex", flexDirection: "column", gap: 18 }}>
        {rows.map((r, i) => (
          <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 22, height: 196, padding: "0 32px", borderRadius: RADIUS.lg, background: r.c, color: "#fff", boxSizing: "border-box" }}>
            <span style={{ fontWeight: 800, fontSize: 60, opacity: 0.5, width: 50 }}>{i + 1}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 800, fontSize: 56, lineHeight: 1.05 }}>{r.key}</span>
              <span style={{ fontWeight: 700, fontSize: 32, opacity: 0.92 }}>{r.gloss}</span>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
