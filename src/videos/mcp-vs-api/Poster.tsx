import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { GlassPanel } from "../../shared-skills/components/lux";
import { API, MCP } from "./data";
import { ConnectorGlyph } from "./components";

/**
 * Thumbnail / cover for the video — big title, a hook question, and the
 * one-glance API-vs-MCP contrast. Static (renders as a <Still>), so no
 * frame-based animation. Export to PNG for use as the upload cover.
 */
export const Poster: React.FC = () => {
  const cards = [
    { side: API, emoji: "🔌", line: "各國插座 · 每個都不同" },
    { side: MCP, emoji: "✨", line: "萬能轉接頭 · 全部搞定" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <Backdrop accent={MCP.color} seed="mcp-poster" />

      {/* kicker */}
      <div style={{ position: "absolute", top: 116, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 30px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.md }}>
          <ConnectorGlyph size={28} />
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, letterSpacing: 1, color: COLORS.inkSoft }}>AI 時代必懂</span>
        </div>
      </div>

      {/* title — MCP vs API */}
      <div style={{ position: "absolute", top: 226, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 36 }}>
        <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 232, letterSpacing: -8, color: MCP.color, lineHeight: 1 }}>MCP</span>
        <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 116, color: COLORS.faint, lineHeight: 1 }}>vs</span>
        <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 232, letterSpacing: -8, color: API.color, lineHeight: 1 }}>API</span>
      </div>

      {/* hook line */}
      <div style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 108, letterSpacing: -1, color: COLORS.ink }}>
          到底{" "}
          <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>差在哪</span>
          ？
        </span>
      </div>

      {/* one-glance contrast */}
      <div style={{ position: "absolute", top: 720, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40 }}>
        {cards.map((c) => (
          <div key={c.side.label} style={{ width: 720 }}>
            <GlassPanel tint={c.side.color} glow={c.side.color} glowAmt={0.4} radius={26} style={{ width: "100%" }}>
              <div style={{ padding: "26px 34px", display: "flex", alignItems: "center", gap: 24 }}>
                <span style={{ fontSize: 66 }}>{c.emoji}</span>
                <div>
                  <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 56, color: c.side.color, lineHeight: 1 }}>{c.side.label}</div>
                  <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.h3, color: COLORS.inkSoft, marginTop: 7 }}>{c.line}</div>
                </div>
              </div>
            </GlassPanel>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
