import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS } from "../../../shared-skills/theme";
import { BRAND } from "../brand";

/**
 * Vertical (1080×1920) reel cover. Ports the EP00 winning formula to the tall
 * canvas: brand → wordmark → giant number hook (錄一次) → auto-stage 色塊牆.
 * Static <Still>.
 */
export const ReelPoster: React.FC = () => {
  const rows = [
    { c: COLORS.hi.sky, key: "錄一次螢幕", gloss: "OBS" },
    { c: COLORS.hi.violet, key: "自動轉錄＋剪輯", gloss: "Whisper · Cowork" },
    { c: COLORS.warn, key: "自動配音", gloss: "TTS" },
    { c: COLORS.success, key: "雙格式輸出", gloss: "橫版 ＋ Reel" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 18%)" }} />

      <div style={{ position: "absolute", top: 86, left: 0, right: 0, textAlign: "center", fontWeight: 800, fontSize: 44, letterSpacing: 2, color: COLORS.muted }}>
        AI Wisdom · @aiwisdomcc
      </div>

      <div style={{ position: "absolute", top: 196, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 124, letterSpacing: -4, lineHeight: 1, color: COLORS.ink }}>
          {BRAND.pre}
          <span style={{ color: "transparent", background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text" }}>{BRAND.post}</span>
        </div>
        <div style={{ marginTop: 10, fontWeight: 800, fontSize: 116, letterSpacing: -2, lineHeight: 1.04, color: COLORS.ink }}>每日全自動產線</div>
      </div>

      <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
        <span style={{ fontWeight: 800, fontSize: 320, lineHeight: 0.86, color: COLORS.claudeDeep, letterSpacing: -8 }}>1</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 120, lineHeight: 1.05, color: COLORS.ink }}>次錄製</span>
          <span style={{ fontWeight: 800, fontSize: 120, lineHeight: 1.05, color: COLORS.ink, borderBottom: `12px solid ${COLORS.remotion}`, paddingBottom: 6 }}>全自動成片</span>
        </div>
      </div>

      <div style={{ position: "absolute", top: 1110, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 20 }}>
        {rows.map((r, i) => (
          <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 26, height: 170, padding: "0 40px", borderRadius: RADIUS.lg, background: r.c, color: "#fff", boxSizing: "border-box" }}>
            <span style={{ fontWeight: 800, fontSize: 76, opacity: 0.5, width: 62 }}>{i + 1}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontWeight: 800, fontSize: 60, lineHeight: 1.05 }}>{r.key}</span>
              <span style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: 38, opacity: 0.92 }}>{r.gloss}</span>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
