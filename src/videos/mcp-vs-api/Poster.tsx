import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS } from "../../shared-skills/theme";
import { API, MCP, DIFFS } from "./data";

/**
 * Thumbnail / cover for the video. Ports the EP00 「新手地圖」 winning formula:
 * left = brand + a single giant number hook; right = a high-density,
 * colour-coded info wall (here the API-vs-MCP differences). Static <Still>.
 */
export const Poster: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
    {/* 平背景(沿用 EP00 認可風格) */}
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 24%)" }} />

    {/* 品牌 */}
    <div style={{ position: "absolute", top: 70, left: 100, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: COLORS.muted }}>
      AI Wisdom · @aiwisdomcc
    </div>

    {/* 標題 — MCP vs API */}
    <div style={{ position: "absolute", top: 138, left: 96, display: "flex", alignItems: "baseline", gap: 30 }}>
      <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 158, letterSpacing: -6, color: MCP.color, lineHeight: 1 }}>MCP</span>
      <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 84, color: COLORS.faint, lineHeight: 1 }}>vs</span>
      <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 158, letterSpacing: -6, color: API.color, lineHeight: 1 }}>API</span>
    </div>

    {/* 巨大數字鉤子 */}
    <div style={{ position: "absolute", top: 470, left: 92, display: "flex", alignItems: "center", gap: 24 }}>
      <span style={{ fontWeight: 800, fontSize: 300, lineHeight: 0.86, color: COLORS.claudeDeep, letterSpacing: -8 }}>{DIFFS.length}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: COLORS.ink }}>大關鍵差異</span>
        <span style={{ fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: COLORS.ink, borderBottom: `10px solid ${COLORS.remotion}`, paddingBottom: 6 }}>一次分清</span>
      </div>
    </div>

    {/* 底部標籤 */}
    <div style={{ position: "absolute", bottom: 72, left: 96, display: "flex", gap: 18, alignItems: "center" }}>
      <span style={{ padding: "16px 34px", borderRadius: RADIUS.pill, background: GRADIENT.claude, color: "#fff", fontWeight: 800, fontSize: 44 }}>AI 時代必懂</span>
      <span style={{ padding: "16px 32px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `2px solid ${COLORS.borderStrong}`, color: COLORS.inkSoft, fontWeight: 800, fontSize: 40 }}>白話比喻 · 中英對照</span>
    </div>

    {/* 右半:API vs MCP 差異色塊牆 */}
    <div style={{ position: "absolute", top: 70, right: 70, width: 800, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* 欄頭 */}
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1, height: 92, borderRadius: RADIUS.md, background: API.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontWeight: 800, fontSize: 48 }}>🔌 API</div>
        <div style={{ flex: 1, height: 92, borderRadius: RADIUS.md, background: MCP.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontWeight: 800, fontSize: 48 }}>✨ MCP</div>
      </div>
      {/* 四個維度對比 */}
      {DIFFS.map((d) => (
        <div key={d.dim}>
          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 27, color: COLORS.muted, marginBottom: 6 }}>{d.dim}</div>
          <div style={{ display: "flex", gap: 14, alignItems: "stretch" }}>
            <div style={{ flex: 1, padding: "16px 18px", borderRadius: RADIUS.md, background: `${API.color}14`, border: `2px solid ${API.color}40`, color: API.deep, fontWeight: 800, fontSize: 32, lineHeight: 1.15, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>{d.api}</div>
            <div style={{ flex: 1, padding: "16px 18px", borderRadius: RADIUS.md, background: `${MCP.color}14`, border: `2px solid ${MCP.color}40`, color: MCP.deep, fontWeight: 800, fontSize: 32, lineHeight: 1.15, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>{d.mcp}</div>
          </div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
