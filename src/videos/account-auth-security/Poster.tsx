import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS } from "../../shared-skills/theme";

/** Thumbnail / cover still — EP00 winning formula, matches the in-video cover. */
export const Poster: React.FC = () => {
  const rows = [
    { c: COLORS.claude, key: "密碼 Password", gloss: "萬能鑰匙 · 你是誰" },
    { c: COLORS.teal, key: "OAuth · Token", gloss: "前台發房卡 · 程式的限時通行證" },
    { c: COLORS.warn, key: "API Key", gloss: "後門密碼 · 機器對機器、不過期" },
    { c: COLORS.error, key: "CAPTCHA", gloss: "門口警衛 · 你是不是人" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 24%)" }} />

      <div style={{ position: "absolute", top: 70, left: 100, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: COLORS.muted }}>
        AI Wisdom · @aiwisdomcc
      </div>

      <div style={{ position: "absolute", top: 140, left: 96 }}>
        <div style={{ fontWeight: 800, fontSize: 64, color: COLORS.ink, lineHeight: 1 }}>帳號授權安全</div>
        <div style={{ fontWeight: 800, fontSize: 132, letterSpacing: -2, lineHeight: 1.04, color: "transparent", background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text" }}>鑰匙比喻</div>
      </div>

      <div style={{ position: "absolute", top: 478, left: 92, display: "flex", alignItems: "center", gap: 26 }}>
        <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 300, lineHeight: 0.84, color: COLORS.claudeDeep, letterSpacing: -10 }}>4</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 100, lineHeight: 1.05, color: COLORS.ink }}>個角色</span>
          <span style={{ fontWeight: 800, fontSize: 100, lineHeight: 1.05, color: COLORS.ink, borderBottom: `10px solid ${COLORS.remotion}`, paddingBottom: 6 }}>一次搞懂</span>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 96, left: 96, display: "flex", gap: 18, alignItems: "center" }}>
        <span style={{ padding: "16px 34px", borderRadius: RADIUS.pill, background: GRADIENT.claude, color: "#fff", fontWeight: 800, fontSize: 44 }}>鑰匙 · 警衛 · 旅館</span>
        <span style={{ padding: "16px 32px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `2px solid ${COLORS.borderStrong}`, color: COLORS.inkSoft, fontWeight: 800, fontSize: 40 }}>觀念詳解</span>
      </div>

      <div style={{ position: "absolute", top: 80, right: 70, width: 780, display: "flex", flexDirection: "column", gap: 18 }}>
        {rows.map((r, i) => (
          <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 22, height: 196, padding: "0 32px", borderRadius: RADIUS.lg, background: r.c, color: "#fff", boxSizing: "border-box" }}>
            <span style={{ fontWeight: 800, fontSize: 60, opacity: 0.5, width: 50 }}>{i + 1}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 800, fontSize: 52, lineHeight: 1.05 }}>{r.key}</span>
              <span style={{ fontWeight: 700, fontSize: 32, opacity: 0.92 }}>{r.gloss}</span>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
