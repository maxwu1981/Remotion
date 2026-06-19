import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { Backdrop } from "../../../shared-skills/components/Backdrop";
import { GlassPanel } from "../../../shared-skills/components/lux";
import { API, MCP } from "../data";
import { ConnectorGlyph } from "../components";

/**
 * Vertical (1080×1920) cover for the reel — big stacked title + the one-glance
 * socket-vs-adapter contrast. Static (renders as a <Still>); export to PNG for the
 * Reel / Shorts thumbnail.
 */
export const ReelPoster: React.FC = () => {
  const cards = [
    { side: API, emoji: "🔌", line: "各國插座 · 每個都不同" },
    { side: MCP, emoji: "✨", line: "萬能轉接頭 · 全部搞定" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <Backdrop accent={MCP.color} seed="mcp-reel-poster" />

      {/* kicker */}
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 34px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.md }}>
          <ConnectorGlyph size={32} />
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, letterSpacing: 1, color: COLORS.inkSoft }}>AI 時代必懂</span>
        </div>
      </div>

      {/* title — MCP / vs / API stacked for the tall canvas */}
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 280, letterSpacing: -10, color: MCP.color, lineHeight: 1 }}>MCP</span>
        <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 120, color: COLORS.faint, lineHeight: 1 }}>vs</span>
        <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 280, letterSpacing: -10, color: API.color, lineHeight: 1 }}>API</span>
      </div>

      {/* hook line */}
      <div style={{ position: "absolute", top: 1066, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 120, letterSpacing: -1, color: COLORS.ink }}>
          到底{" "}
          <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>差在哪</span>
          ？
        </span>
      </div>

      {/* one-glance contrast — stacked cards */}
      <div style={{ position: "absolute", top: 1276, left: 64, right: 64, display: "flex", flexDirection: "column", gap: 34 }}>
        {cards.map((c) => (
          <GlassPanel key={c.side.label} tint={c.side.color} glow={c.side.color} glowAmt={0.4} radius={30} style={{ width: "100%" }}>
            <div style={{ padding: "34px 44px", display: "flex", alignItems: "center", gap: 30 }}>
              <span style={{ fontSize: 86 }}>{c.emoji}</span>
              <div>
                <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 76, color: c.side.color, lineHeight: 1 }}>{c.side.label}</div>
                <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.h2, color: COLORS.inkSoft, marginTop: 10 }}>{c.line}</div>
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* brand footer */}
      <div style={{ position: "absolute", bottom: 96, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.h3, color: COLORS.muted, letterSpacing: 0.5 }}>
          API ＝ 軟體的橋樑　·　MCP ＝ AI 的萬能轉接頭
        </span>
      </div>
    </AbsoluteFill>
  );
};
