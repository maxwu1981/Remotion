import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS } from "../../../shared-skills/theme";
import { MOTIF } from "../data";

/**
 * Vertical (1080×1920) reel cover. Ports the EP00 winning formula to the tall
 * canvas: brand → title → giant number hook → 共享/不共享/持久 色塊牆. Static <Still>.
 */
export const ReelPoster: React.FC = () => {
  const rows = [
    { c: COLORS.success, key: "對話記憶", gloss: "跨裝置共享（同 session）" },
    { c: COLORS.error, key: "檔案／執行", gloss: "不共享、完全隔離" },
    { c: MOTIF.note, key: "CLAUDE.md", gloss: "push 才持久、才跨裝置" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 18%)" }} />

      <div style={{ position: "absolute", top: 86, left: 0, right: 0, textAlign: "center", fontWeight: 800, fontSize: 44, letterSpacing: 2, color: COLORS.muted }}>
        AI Wisdom · @aiwisdomcc
      </div>

      <div style={{ position: "absolute", top: 200, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 96, letterSpacing: -3, color: COLORS.ink, lineHeight: 1 }}>Claude Code</div>
        <div style={{ marginTop: 10, fontWeight: 800, fontSize: 150, letterSpacing: -3, lineHeight: 1.04, color: "transparent", background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text" }}>手機 / 遠端</div>
      </div>

      <div style={{ position: "absolute", top: 620, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
        <span style={{ fontWeight: 800, fontSize: 320, lineHeight: 0.86, color: COLORS.claudeDeep, letterSpacing: -8 }}>{rows.length}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 120, lineHeight: 1.05, color: COLORS.ink }}>個重點</span>
          <span style={{ fontWeight: 800, fontSize: 120, lineHeight: 1.05, color: COLORS.ink, borderBottom: `12px solid ${COLORS.remotion}`, paddingBottom: 6 }}>一次看懂</span>
        </div>
      </div>

      <div style={{ position: "absolute", top: 1090, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 24 }}>
        {rows.map((r, i) => (
          <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 28, height: 232, padding: "0 44px", borderRadius: RADIUS.lg, background: r.c, color: "#fff", boxSizing: "border-box" }}>
            <span style={{ fontWeight: 800, fontSize: 88, opacity: 0.5, width: 70 }}>{i + 1}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontWeight: 800, fontSize: 68, lineHeight: 1.05 }}>{r.key}</span>
              <span style={{ fontWeight: 700, fontSize: 40, opacity: 0.92 }}>{r.gloss}</span>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
