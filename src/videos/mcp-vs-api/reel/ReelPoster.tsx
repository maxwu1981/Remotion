import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS } from "../../../shared-skills/theme";
import { API, MCP, DIFFS } from "../data";

/**
 * Vertical (1080×1920) reel cover. Ports the EP00 winning formula to the tall
 * canvas: brand → MCP vs API title → giant number hook → API/MCP 差異色塊牆.
 * Static <Still>.
 */
export const ReelPoster: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 18%)" }} />

    <div style={{ position: "absolute", top: 86, left: 0, right: 0, textAlign: "center", fontWeight: 800, fontSize: 44, letterSpacing: 2, color: COLORS.muted }}>
      AI Wisdom · @aiwisdomcc
    </div>

    <div style={{ position: "absolute", top: 210, left: 0, right: 0, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 30 }}>
      <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 200, letterSpacing: -8, color: MCP.color, lineHeight: 1 }}>MCP</span>
      <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 104, color: COLORS.faint, lineHeight: 1 }}>vs</span>
      <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 200, letterSpacing: -8, color: API.color, lineHeight: 1 }}>API</span>
    </div>

    <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
      <span style={{ fontWeight: 800, fontSize: 320, lineHeight: 0.86, color: COLORS.claudeDeep, letterSpacing: -8 }}>{DIFFS.length}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontWeight: 800, fontSize: 120, lineHeight: 1.05, color: COLORS.ink }}>大關鍵差異</span>
        <span style={{ fontWeight: 800, fontSize: 120, lineHeight: 1.05, color: COLORS.ink, borderBottom: `12px solid ${COLORS.remotion}`, paddingBottom: 6 }}>一次分清</span>
      </div>
    </div>

    <div style={{ position: "absolute", top: 980, left: 64, right: 64, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 18 }}>
        <div style={{ flex: 1, height: 104, borderRadius: RADIUS.md, background: API.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontWeight: 800, fontSize: 56 }}>🔌 API</div>
        <div style={{ flex: 1, height: 104, borderRadius: RADIUS.md, background: MCP.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontWeight: 800, fontSize: 56 }}>✨ MCP</div>
      </div>
      {DIFFS.map((d) => (
        <div key={d.dim}>
          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 34, color: COLORS.muted, marginBottom: 8 }}>{d.dim}</div>
          <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
            <div style={{ flex: 1, padding: "20px 20px", borderRadius: RADIUS.md, background: `${API.color}14`, border: `2px solid ${API.color}40`, color: API.deep, fontWeight: 800, fontSize: 40, lineHeight: 1.15, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>{d.api}</div>
            <div style={{ flex: 1, padding: "20px 20px", borderRadius: RADIUS.md, background: `${MCP.color}14`, border: `2px solid ${MCP.color}40`, color: MCP.deep, fontWeight: 800, fontSize: 40, lineHeight: 1.15, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>{d.mcp}</div>
          </div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
