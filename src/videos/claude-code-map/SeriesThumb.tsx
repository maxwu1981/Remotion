import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS } from "../../shared-skills/theme";
import { categories, type CategoryId } from "./tree";

/**
 * 系列共用 YouTube 縮圖模板(1280×720)。維持 EP00 認可的風格:
 * 左=品牌 + 巨大主打;右=七大類色條(per-episode 高亮當前大類)。
 * 每集只換:ep 編號、epLabel、巨大數字 + 兩行主打、highlightCat。
 */
export const SeriesThumb: React.FC<{
  ep: string;
  epLabel: string;
  bigNum: string;
  line1: string;
  line2: string;
  highlightCat?: CategoryId;
  brand?: string;
}> = ({ ep, epLabel, bigNum, line1, line2, highlightCat, brand = "AI Wisdom · @aiwisdomcc" }) => {
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      {/* 平背景 */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 24%)" }} />

      {/* 品牌 */}
      <div style={{ position: "absolute", top: 44, left: 64, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: COLORS.muted }}>
        {brand}
      </div>

      {/* 標題 */}
      <div style={{ position: "absolute", top: 92, left: 64 }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 64, color: COLORS.ink, lineHeight: 1 }}>Claude Code</div>
        <div style={{ fontWeight: 800, fontSize: 120, letterSpacing: -2, lineHeight: 1.04, color: "transparent", background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text" }}>
          新手地圖
        </div>
      </div>

      {/* 巨大主打 */}
      <div style={{ position: "absolute", top: 350, left: 60, display: "flex", alignItems: "center", gap: 18, maxWidth: 800 }}>
        <span style={{ fontWeight: 800, fontSize: 220, lineHeight: 0.86, color: COLORS.claudeDeep, letterSpacing: -6 }}>{bigNum}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontWeight: 800, fontSize: 78, lineHeight: 1.05, color: COLORS.ink }}>{line1}</span>
          <span style={{ fontWeight: 800, fontSize: 78, lineHeight: 1.05, color: COLORS.ink, borderBottom: `8px solid ${COLORS.remotion}`, paddingBottom: 4 }}>{line2}</span>
        </div>
      </div>

      {/* 底部標籤 */}
      <div style={{ position: "absolute", bottom: 48, left: 64, display: "flex", gap: 16, alignItems: "center" }}>
        <span style={{ padding: "12px 26px", borderRadius: RADIUS.pill, background: GRADIENT.claude, color: "#fff", fontWeight: 800, fontSize: 34 }}>{ep} · {epLabel}</span>
        <span style={{ padding: "12px 24px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `2px solid ${COLORS.borderStrong}`, color: COLORS.inkSoft, fontWeight: 800, fontSize: 30 }}>附 Anthropic 官方文件</span>
      </div>

      {/* 右半:七大類色條(高亮當前大類) */}
      <div style={{ position: "absolute", top: 70, right: 56, width: 336, display: "flex", flexDirection: "column", gap: 9 }}>
        {categories.map((c) => {
          const active = !highlightCat || c.id === highlightCat;
          return (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, height: 74, padding: "0 18px", borderRadius: RADIUS.md, background: c.color, color: "#fff", opacity: active ? 1 : 0.4, border: highlightCat && c.id === highlightCat ? "4px solid #fff" : "none", boxSizing: "border-box" }}>
              <span style={{ fontWeight: 800, fontSize: 30, width: 30 }}>{c.id}</span>
              <span style={{ fontWeight: 800, fontSize: 27, lineHeight: 1.05 }}>{c.label}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
