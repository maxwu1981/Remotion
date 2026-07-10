import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT } from "../../shared-skills/theme";
import { ACC, WhiteBg, darkCard, Glare, emberClip, hairline, rgba } from "./glass";

/**
 * 「實戰自動化 EP02 · YouTube 上片全自動化」封面 — 黑曜石獨石碑系列款。
 * 構圖同 EP01:左=排版三層級(實體→巨大鉤子→副句)+底部數字暗玻璃條;
 * 右=系列簽名黑曜石獨石碑,本集碑主角=發光 ▶(YouTube 播放鍵稜鏡化),
 * 碑上蝕刻上傳指令+六項自動完成。全封面一個主色(ember)+gold 數字。frame 0 亮相。
 */

const FIELDS = ["影片", "標題", "描述", "標籤", "縮圖", "播放清單"];

export const YtUploadCover: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: ACC.ink }}>
    <WhiteBg />

    {/* ── Eyebrow:系列徽章 + 頻道名 ── */}
    <div style={{ position: "absolute", top: 66, left: 100, display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "10px 30px", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ width: 12, height: 12, borderRadius: 999, background: `linear-gradient(135deg, ${ACC.ember}, ${ACC.emberSoft})`, boxShadow: `0 0 10px ${rgba(ACC.ember, 0.8)}` }} />
        <span style={{ fontWeight: 700, fontSize: 33, letterSpacing: 3, color: "#fff" }}>生活應用 EP02</span>
      </div>
      <span style={{ fontWeight: 500, fontSize: 30, letterSpacing: 7, color: ACC.muted }}>AI WISDOM · @aiwisdomcc</span>
    </div>

    {/* ── 左:標題三層級 ── */}
    <div style={{ position: "absolute", top: 208, left: 96 }}>
      <div style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: 66, letterSpacing: 1, color: ACC.ink }}>
        Claude Code <span style={{ color: ACC.ember }}>✕</span> YouTube
      </div>
      <div
        style={{
          ...emberClip,
          background: "linear-gradient(160deg, #F09A6B 0%, #D97757 40%, #B54C29 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          fontWeight: 800,
          fontSize: 212,
          letterSpacing: -4,
          lineHeight: 1.02,
          marginTop: 10,
          filter: `drop-shadow(0 8px 20px ${rgba(ACC.ember, 0.35)})`,
        }}
      >
        上片全自動
      </div>
      <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 24 }}>
        <span style={{ width: 64, height: 3, background: ACC.ember, borderRadius: 2 }} />
        <span style={{ fontWeight: 500, fontSize: 46, letterSpacing: 8, color: ACC.inkSoft }}>
          5 分鐘設定<span style={{ color: ACC.muted }}>，</span>之後永遠自動
        </span>
      </div>
    </div>

    {/* ── 左下:數字暗玻璃條 ── */}
    <div style={{ position: "absolute", bottom: 78, left: 96 }}>
      <div style={{ ...darkCard(ACC.ember, { r: 24, glow: 0.85 }), position: "relative", overflow: "hidden", display: "flex", alignItems: "baseline", gap: 20, padding: "26px 46px" }}>
        <Glare />
        <span style={{ position: "relative", fontWeight: 500, fontSize: 34, color: rgba("#ffffff", 0.62) }}>手動</span>
        <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 62, color: rgba("#ffffff", 0.55), textDecoration: "line-through", textDecorationColor: rgba(ACC.ember, 0.75) }}>10</span>
        <span style={{ position: "relative", fontWeight: 500, fontSize: 34, color: rgba("#ffffff", 0.62) }}>分</span>
        <span style={{ position: "relative", fontWeight: 700, fontSize: 44, color: ACC.emberSoft, margin: "0 6px" }}>→</span>
        <span style={{ position: "relative", fontWeight: 500, fontSize: 34, color: rgba("#ffffff", 0.62) }}>一句指令</span>
        <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 84, color: ACC.gold, textShadow: `0 0 22px ${rgba(ACC.gold, 0.45)}` }}>60</span>
        <span style={{ position: "relative", fontWeight: 500, fontSize: 34, color: rgba("#ffffff", 0.62) }}>秒</span>
      </div>
    </div>

    {/* ── 右:「▶」黑曜石獨石碑 ── */}
    <div style={{ position: "absolute", right: 118, bottom: 52, width: 520, height: 56, borderRadius: "50%", background: rgba("#0b1020", 0.22), filter: "blur(26px)" }} />
    <div
      style={{
        position: "absolute",
        top: 92,
        right: 108,
        width: 590,
        height: 880,
        borderRadius: 48,
        overflow: "hidden",
        transform: "rotate(-3deg)",
        transformOrigin: "center",
        ...darkCard(ACC.ember, { r: 48, glow: 1.25 }),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 52px 46px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(52% 34% at 50% 26%, ${rgba(ACC.ember, 0.42)} 0%, transparent 72%)` }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: "44%", width: "12%", background: `linear-gradient(180deg, ${rgba("#ffffff", 0.1)} 0%, ${rgba("#ffffff", 0)} 55%)` }} />
      <Glare />

      {/* ▶ 稜鏡播放鍵(縮圖主角):圓角方座+三角,同 $ 的發光語彙 */}
      <div
        style={{
          position: "relative",
          width: 300,
          height: 300,
          borderRadius: 72,
          background: `linear-gradient(150deg, ${rgba("#ffffff", 0.16)} 0%, ${rgba(ACC.ember, 0.34)} 55%, ${rgba("#B54C29", 0.4)} 100%)`,
          border: `2px solid ${rgba("#ffd9bb", 0.55)}`,
          boxShadow: `0 0 44px ${rgba(ACC.ember, 0.6)}, inset 0 0 34px ${rgba(ACC.ember, 0.35)}, inset 0 2px 0 ${rgba("#ffffff", 0.35)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 12,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            borderTop: "78px solid transparent",
            borderBottom: "78px solid transparent",
            borderLeft: "126px solid #ffd9bb",
            marginLeft: 26,
            filter: `drop-shadow(0 0 22px ${rgba(ACC.ember, 0.85)}) drop-shadow(0 4px 10px ${rgba("#0b1020", 0.4)})`,
          }}
        />
      </div>

      {/* 蝕刻指令行 */}
      <div style={{ position: "relative", alignSelf: "stretch", marginTop: 34, padding: "18px 26px", borderRadius: 14, background: rgba("#060a14", 0.72), border: `1px solid ${rgba(ACC.ember, 0.35)}`, boxShadow: `inset 0 2px 6px ${rgba("#000000", 0.5)}` }}>
        <span style={{ fontFamily: FONT.monoCjk, fontSize: 29, color: rgba("#ffffff", 0.86) }}>
          <span style={{ color: ACC.gold }}>$</span> yt upload <span style={{ color: ACC.emberSoft }}>新片.mp4</span>
        </span>
      </div>

      <div style={{ ...hairline, alignSelf: "stretch", margin: "30px 0 26px", position: "relative" }} />

      {/* 六項自動完成 */}
      <div style={{ position: "relative", alignSelf: "stretch", display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 22, columnGap: 18 }}>
        {FIELDS.map((label) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 30, color: ACC.emberSoft, textShadow: `0 0 12px ${rgba(ACC.ember, 0.6)}` }}>✓</span>
            <span style={{ fontWeight: 500, fontSize: 30, letterSpacing: 1, color: rgba("#ffffff", 0.85), whiteSpace: "nowrap" }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ position: "relative", marginTop: "auto", fontWeight: 500, fontSize: 26, letterSpacing: 5, color: rgba("#ffffff", 0.5) }}>
        授權只跑一次
      </div>
    </div>
  </AbsoluteFill>
);
