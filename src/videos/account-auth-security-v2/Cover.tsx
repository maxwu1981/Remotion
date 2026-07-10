import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS } from "../../shared-skills/theme";

/**
 * 單章 EP00 章封面(淺底、聚焦一個概念、用該章代表色)。長片裡每章前放 3s。
 */
export type ChapterCoverProps = { n: number; term: string; metaphor: string; gloss: string; color: string };
export const CHAPTER_COVERS: ChapterCoverProps[] = [
  { n: 1, term: "access token", metaphor: "房卡", gloss: "前台發的限時通行證 · 只開你允許的門、會過期", color: COLORS.teal },
  { n: 2, term: "API key", metaphor: "後門鑰匙", gloss: "服務天天來 · 固定、長期、不涉隱私", color: COLORS.warn },
  { n: 3, term: "CAPTCHA", metaphor: "門口保安", gloss: "分清你是真人還是機器人 · 擋機器人海", color: COLORS.error },
  { n: 4, term: "密碼 Password", metaphor: "萬能鑰匙", gloss: "一把開全部 · 絕不隨便交出去", color: COLORS.claude },
];
const CN = ["", "第一章", "第二章", "第三章", "第四章"];

export const ChapterCover: React.FC<ChapterCoverProps & { hold?: number; ep?: string }> = ({ n, term, metaphor, gloss, color, hold = 90, ep }) => {
  const f = useCurrentFrame();
  const rise = interpolate(f, [0, 14], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const app = interpolate(f, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(f, [hold - 8, hold - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink, opacity: out }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 24%)" }} />

      <div style={{ position: "absolute", top: 60, left: 100, display: "flex", alignItems: "center", gap: 22 }}>
        <span style={{ padding: "12px 30px", borderRadius: RADIUS.pill, background: GRADIENT.claude, color: "#fff", fontWeight: 800, fontSize: 40 }}>新手需要知道的事</span>
        {ep && <span style={{ padding: "12px 30px", borderRadius: RADIUS.pill, background: COLORS.ink, color: "#fff", fontWeight: 800, fontSize: 40, fontFamily: FONT.mono, letterSpacing: 1 }}>{ep}</span>}
      </div>
      <div style={{ position: "absolute", top: 70, right: 90, fontWeight: 800, fontSize: 34, color: COLORS.muted, letterSpacing: 1 }}>AI Wisdom · @aiwisdomcc</div>

      {/* 頂色條 + 進度 */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 14, background: color }} />

      <div style={{ position: "absolute", top: 300, left: 100, right: 100, display: "flex", alignItems: "center", gap: 70, transform: `translateY(${rise}px)`, opacity: app }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 40, color, letterSpacing: 2 }}>{CN[n]}</span>
          <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 380, lineHeight: 0.82, color, letterSpacing: -10 }}>{n}</span>
          <span style={{ fontWeight: 800, fontSize: 34, color: COLORS.muted }}>{n} / 4</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 116, lineHeight: 1.0, color: COLORS.ink }}>{term}</span>
          <span style={{ fontWeight: 800, fontSize: 96, lineHeight: 1.05, color, letterSpacing: -1 }}>＝{metaphor}</span>
          <span style={{ fontWeight: 700, fontSize: 42, lineHeight: 1.4, color: COLORS.inkSoft, marginTop: 8 }}>{gloss}</span>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 90, left: 100, display: "flex", gap: 16, alignItems: "center", opacity: app }}>
        <span style={{ padding: "16px 34px", borderRadius: RADIUS.pill, background: color, color: "#fff", fontWeight: 800, fontSize: 40 }}>帳號授權安全 · 一支旅館故事</span>
      </div>
    </AbsoluteFill>
  );
};

/**
 * 帳號授權安全 V2 封面 — EP00 致勝公式(淺底+巨大數字+右側分色概念牆)。
 * 系列框架「新手需要知道的事」;概念列照片內 4 章(房卡/後門鑰匙/保安/萬能鑰匙)。
 */
export const AasV2Cover: React.FC = () => {
  const rows = [
    { c: COLORS.teal, key: "access token", meta: "房卡", gloss: "前台發的限時通行證" },
    { c: COLORS.warn, key: "API key", meta: "後門鑰匙", gloss: "服務用 · 長期 · 不涉隱私" },
    { c: COLORS.error, key: "CAPTCHA", meta: "門口保安", gloss: "分清你是真人還是機器人" },
    { c: COLORS.claude, key: "密碼 Password", meta: "萬能鑰匙", gloss: "一把開全部 · 別交出去" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 24%)" }} />

      {/* 頻道 */}
      <div style={{ position: "absolute", top: 58, left: 100, fontWeight: 800, fontSize: 36, letterSpacing: 2, color: COLORS.muted }}>
        AI Wisdom · @aiwisdomcc
      </div>

      {/* 系列標：新手需要知道的事 */}
      <div style={{ position: "absolute", top: 118, left: 96, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ padding: "14px 34px", borderRadius: RADIUS.pill, background: GRADIENT.claude, color: "#fff", fontWeight: 800, fontSize: 46, letterSpacing: 1 }}>新手需要知道的事</span>
      </div>

      {/* 標題 */}
      <div style={{ position: "absolute", top: 220, left: 96 }}>
        <div style={{ fontWeight: 800, fontSize: 68, color: COLORS.ink, lineHeight: 1 }}>帳號授權安全</div>
        <div style={{ fontWeight: 800, fontSize: 108, letterSpacing: -2, lineHeight: 1.04, color: "transparent", background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text" }}>一支旅館故事</div>
      </div>

      {/* 巨大數字鉤子 */}
      <div style={{ position: "absolute", top: 512, left: 92, display: "flex", alignItems: "center", gap: 26 }}>
        <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 300, lineHeight: 0.84, color: COLORS.claudeDeep, letterSpacing: -10 }}>4</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 100, lineHeight: 1.05, color: COLORS.ink }}>個比喻</span>
          <span style={{ fontWeight: 800, fontSize: 100, lineHeight: 1.05, color: COLORS.ink, borderBottom: `10px solid ${COLORS.remotion}`, paddingBottom: 6 }}>一次看懂</span>
        </div>
      </div>

      {/* 底部藥丸 */}
      <div style={{ position: "absolute", bottom: 92, left: 96, display: "flex", gap: 18, alignItems: "center" }}>
        <span style={{ padding: "16px 32px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `2px solid ${COLORS.borderStrong}`, color: COLORS.inkSoft, fontWeight: 800, fontSize: 38 }}>OAuth · token · API key · CAPTCHA · 密碼</span>
      </div>

      {/* 右側分色概念牆 */}
      <div style={{ position: "absolute", top: 78, right: 70, width: 800, display: "flex", flexDirection: "column", gap: 18 }}>
        {rows.map((r, i) => (
          <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 22, height: 196, padding: "0 34px", borderRadius: RADIUS.lg, background: r.c, color: "#fff", boxSizing: "border-box" }}>
            <span style={{ fontWeight: 800, fontSize: 60, opacity: 0.5, width: 48 }}>{i + 1}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                <span style={{ fontWeight: 800, fontSize: 52, lineHeight: 1.05 }}>{r.key}</span>
                <span style={{ fontWeight: 800, fontSize: 34, opacity: 0.85 }}>＝{r.meta}</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 31, opacity: 0.92 }}>{r.gloss}</span>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
