import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT } from "../../shared-skills/theme";
import { ACC, WhiteBg, darkCard, Glare, emberClip, hairline, rgba } from "./glass";

/**
 * 「生活應用 EP03 · 小紅書發文全自動化」封面 — EP00 玻璃進化版·精修(黑曜石高級感)。
 * 構圖:左=純排版三層級(實體→巨大鉤子→副句)+底部數字暗玻璃條;
 * 右=系列簽名「$」指令水晶,升級成黑曜石獨石碑(product-shot 式微傾):
 * 遠看是發光的 $,近看碑上蝕刻著真實指令行+六項自動填寫——縮圖與全尺寸各有一層可讀。
 * 全封面只用一個主色(ember)+gold 數字,不出現第二種彩色。frame 0 亮相不淡入。
 */

/** 蝕刻在獨石碑上的六項自動填寫。 */
const FIELDS = ["影片", "標題", "正文", "8 標籤", "5 章節", "仅自己可见"];

export const XhsAutoCover: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: ACC.ink }}>
    <WhiteBg />

    {/* ── Eyebrow:系列徽章 + 頻道名(安靜、tracking 拉開) ── */}
    <div style={{ position: "absolute", top: 66, left: 100, display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "10px 30px", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ width: 12, height: 12, borderRadius: 999, background: `linear-gradient(135deg, ${ACC.ember}, ${ACC.emberSoft})`, boxShadow: `0 0 10px ${rgba(ACC.ember, 0.8)}` }} />
        <span style={{ fontWeight: 700, fontSize: 33, letterSpacing: 3, color: "#fff" }}>生活應用 EP03</span>
      </div>
      <span style={{ fontWeight: 500, fontSize: 30, letterSpacing: 7, color: ACC.muted }}>AI WISDOM · @aiwisdomcc</span>
    </div>

    {/* ── 左:標題三層級 ── */}
    <div style={{ position: "absolute", top: 208, left: 96 }}>
      {/* 層1 實體名(GEO:講清楚誰✕誰) */}
      <div style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: 66, letterSpacing: 1, color: ACC.ink }}>
        Claude Code <span style={{ color: ACC.ember }}>✕</span> 小紅書
      </div>
      {/* 層2 巨大鉤子(縮圖主讀點;漸層走深,手機縮圖才有打眼度) */}
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
        全自動發文
      </div>
      {/* 層3 副句(500 字重收尾,tracking 拉開=品味) */}
      <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 24 }}>
        <span style={{ width: 64, height: 3, background: ACC.ember, borderRadius: 2 }} />
        <span style={{ fontWeight: 500, fontSize: 46, letterSpacing: 8, color: ACC.inkSoft }}>
          一行指令<span style={{ color: ACC.muted }}>，</span>整篇發好
        </span>
      </div>
    </div>

    {/* ── 左下:數字暗玻璃條(唯一的數字鉤子) ── */}
    <div style={{ position: "absolute", bottom: 78, left: 96 }}>
      <div style={{ ...darkCard(ACC.ember, { r: 24, glow: 0.85 }), position: "relative", overflow: "hidden", display: "flex", alignItems: "baseline", gap: 20, padding: "26px 46px" }}>
        <Glare />
        <span style={{ position: "relative", fontWeight: 500, fontSize: 34, color: rgba("#ffffff", 0.62) }}>手動</span>
        <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 62, color: rgba("#ffffff", 0.55), textDecoration: "line-through", textDecorationColor: rgba(ACC.ember, 0.75) }}>40</span>
        <span style={{ position: "relative", fontWeight: 500, fontSize: 34, color: rgba("#ffffff", 0.62) }}>分</span>
        <span style={{ position: "relative", fontWeight: 700, fontSize: 44, color: ACC.emberSoft, margin: "0 6px" }}>→</span>
        <span style={{ position: "relative", fontWeight: 500, fontSize: 34, color: rgba("#ffffff", 0.62) }}>一行指令</span>
        <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 84, color: ACC.gold, textShadow: `0 0 22px ${rgba(ACC.gold, 0.45)}` }}>3</span>
        <span style={{ position: "relative", fontWeight: 500, fontSize: 34, color: rgba("#ffffff", 0.62) }}>分鐘</span>
      </div>
    </div>

    {/* ── 右:「$」黑曜石獨石碑(系列簽名) ── */}
    {/* 接地陰影:碑投在畫布上的橢圓,讓它「站」在畫面裡 */}
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
        padding: "40px 52px 46px",
        boxSizing: "border-box",
      }}
    >
      {/* 碑內光:$ 後方的暖核心 + 縱向稜鏡光柱 */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(52% 34% at 50% 26%, ${rgba(ACC.ember, 0.42)} 0%, transparent 72%)` }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: "44%", width: "12%", background: `linear-gradient(180deg, ${rgba("#ffffff", 0.1)} 0%, ${rgba("#ffffff", 0)} 55%)` }} />
      <Glare />

      {/* $ 稜鏡字(縮圖主角) */}
      <span
        style={{
          position: "relative",
          fontFamily: FONT.mono,
          fontWeight: 800,
          fontSize: 330,
          lineHeight: 1.04,
          color: "transparent",
          background: "linear-gradient(150deg, #ffffff 0%, #ffd9bb 42%, #ffae72 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 26px ${rgba(ACC.ember, 0.75)}) drop-shadow(0 4px 10px ${rgba("#0b1020", 0.4)})`,
        }}
      >
        $
      </span>

      {/* 蝕刻指令行 */}
      <div style={{ position: "relative", alignSelf: "stretch", marginTop: 26, padding: "18px 26px", borderRadius: 14, background: rgba("#060a14", 0.72), border: `1px solid ${rgba(ACC.ember, 0.35)}`, boxShadow: `inset 0 2px 6px ${rgba("#000000", 0.5)}` }}>
        <span style={{ fontFamily: FONT.monoCjk, fontSize: 29, color: rgba("#ffffff", 0.86) }}>
          <span style={{ color: ACC.gold }}>$</span> node xhs-post <span style={{ color: ACC.emberSoft }}>金澤vlog</span>
        </span>
      </div>

      <div style={{ ...hairline, alignSelf: "stretch", margin: "30px 0 26px", position: "relative" }} />

      {/* 六項自動填寫(全尺寸才讀到的細節層) */}
      <div style={{ position: "relative", alignSelf: "stretch", display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 22, columnGap: 18 }}>
        {FIELDS.map((label) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 30, color: ACC.emberSoft, textShadow: `0 0 12px ${rgba(ACC.ember, 0.6)}` }}>✓</span>
            <span style={{ fontWeight: 500, fontSize: 30, letterSpacing: 1, color: rgba("#ffffff", 0.85), whiteSpace: "nowrap" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* 碑腳:一句安靜的定調 */}
      <div style={{ position: "relative", marginTop: "auto", fontWeight: 500, fontSize: 26, letterSpacing: 5, color: rgba("#ffffff", 0.5) }}>
        全程沒碰滑鼠
      </div>
    </div>
  </AbsoluteFill>
);
