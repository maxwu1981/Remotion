import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT } from "../../shared-skills/theme";
import { ACC, WhiteBg, darkCard, Glare, emberClip, hairline, rgba, Mosaic } from "./glass";

/**
 * 「生活應用 EP01 · LinkedIn 全自動翻新」封面 — 高級感精修版(2026-07-03 換裝)。
 * 構圖:左=純排版三層級(實體→巨大鉤子「全自動翻新」→副句「一杯咖啡的時間」)+底部數字暗玻璃條;
 * 右=黑曜石獨石碑「重建完成的 LinkedIn 檔案卡」:banner/頭像/姓名全馬賽克(呼應全片個資遮蔽),
 * 關鍵字與技能雲清晰可讀——遠看是一張個人檔案,近看是翻新成果。
 * 全封面 ember 一個主色+gold 數字;LinkedIn 藍只在碑內當主題色。frame 0 亮相不淡入。
 */

const SKILL_CHIPS = ["NPI 管理", "供應鏈", "風險管理", "精實製造", "FMEA"];

const chip = (border: string, bg = "transparent"): React.CSSProperties => ({
  padding: "8px 18px",
  borderRadius: 999,
  border: `1px solid ${border}`,
  background: bg,
  fontFamily: FONT.uiCjk,
  fontWeight: 500,
  fontSize: 24,
  letterSpacing: 1,
  color: rgba("#ffffff", 0.84),
  whiteSpace: "nowrap",
});

export const MakeoverCover: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: ACC.ink }}>
    <WhiteBg />

    {/* ── Eyebrow:系列徽章 + 頻道名 ── */}
    <div style={{ position: "absolute", top: 66, left: 100, display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "10px 30px", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ width: 12, height: 12, borderRadius: 999, background: `linear-gradient(135deg, ${ACC.ember}, ${ACC.emberSoft})`, boxShadow: `0 0 10px ${rgba(ACC.ember, 0.8)}` }} />
        <span style={{ fontWeight: 700, fontSize: 33, letterSpacing: 3, color: "#fff" }}>生活應用 EP01</span>
      </div>
      <span style={{ fontWeight: 500, fontSize: 30, letterSpacing: 7, color: ACC.muted }}>AI WISDOM · @aiwisdomcc</span>
    </div>

    {/* ── 左:標題三層級 ── */}
    <div style={{ position: "absolute", top: 208, left: 96 }}>
      <div style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: 66, letterSpacing: 1, color: ACC.ink }}>
        Claude <span style={{ color: ACC.ember }}>✕</span> LinkedIn
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
        全自動翻新
      </div>
      <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 24 }}>
        <span style={{ width: 64, height: 3, background: ACC.ember, borderRadius: 2 }} />
        <span style={{ fontWeight: 500, fontSize: 46, letterSpacing: 8, color: ACC.inkSoft }}>
          一份舊履歷<span style={{ color: ACC.muted }}>，</span>一杯咖啡的時間
        </span>
      </div>
    </div>

    {/* ── 左下:數字暗玻璃條 ── */}
    <div style={{ position: "absolute", bottom: 78, left: 96 }}>
      <div style={{ ...darkCard(ACC.ember, { r: 24, glow: 0.85 }), position: "relative", overflow: "hidden", display: "flex", alignItems: "baseline", gap: 18, padding: "26px 46px" }}>
        <Glare />
        <span style={{ position: "relative", fontWeight: 500, fontSize: 34, color: rgba("#ffffff", 0.62) }}>技能</span>
        <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 52, color: rgba("#ffffff", 0.5) }}>2</span>
        <span style={{ position: "relative", fontWeight: 700, fontSize: 40, color: ACC.emberSoft }}>→</span>
        <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 84, color: ACC.gold, textShadow: `0 0 22px ${rgba(ACC.gold, 0.45)}` }}>24</span>
        <span style={{ position: "relative", width: 1, alignSelf: "stretch", background: rgba("#ffffff", 0.16), margin: "0 14px" }} />
        <span style={{ position: "relative", fontWeight: 500, fontSize: 34, color: rgba("#ffffff", 0.62) }}>經歷</span>
        <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 52, color: rgba("#ffffff", 0.5) }}>1</span>
        <span style={{ position: "relative", fontWeight: 700, fontSize: 40, color: ACC.emberSoft }}>→</span>
        <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 72, color: ACC.gold, textShadow: `0 0 20px ${rgba(ACC.gold, 0.4)}` }}>3</span>
      </div>
    </div>

    {/* ── 右:黑曜石獨石碑「重建完成的檔案卡」 ── */}
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
        ...darkCard(ACC.ember, { r: 48, glow: 1.15 }),
      }}
    >
      {/* banner 條(LinkedIn 藍主題 + 右側馬賽克塊=遮蔽版橫幅) */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 168, background: `linear-gradient(120deg, ${rgba(ACC.linkedin, 0.4)} 0%, ${rgba(ACC.linkedin, 0.12)} 55%, ${rgba("#0D1322", 0)} 100%)`, borderBottom: `1px solid ${rgba("#ffffff", 0.12)}` }}>
        <Mosaic w={170} h={96} style={{ position: "absolute", right: 38, top: 36 }} />
      </div>
      {/* 頭像:馬賽克圓 + 環 */}
      <div style={{ position: "absolute", top: 96, left: 46, width: 150, height: 150, borderRadius: "50%", overflow: "hidden", border: `3px solid ${rgba("#ffffff", 0.35)}`, boxShadow: `0 10px 24px ${rgba("#0b1020", 0.45)}` }}>
        <Mosaic w={150} h={150} cell={16} />
      </div>
      <Glare />

      {/* 卡身內容 */}
      <div style={{ position: "absolute", top: 270, left: 46, right: 46, bottom: 40, display: "flex", flexDirection: "column" }}>
        {/* 姓名列=馬賽克 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Mosaic w={280} h={36} />
          <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 24, color: ACC.linkedin, textShadow: `0 0 12px ${rgba(ACC.linkedin, 0.6)}` }}>✓</span>
        </div>
        {/* 頭銜關鍵字(改寫後的 headline) */}
        <div style={{ marginTop: 24, fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: 33, color: rgba("#ffffff", 0.92) }}>
          16 年 NPI · <span style={{ color: ACC.gold }}>$320M</span> 專案交付
        </div>
        <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["新產品導入", "跨國產線移轉", "AI 提效"].map((t) => (
            <span key={t} style={chip(rgba(ACC.linkedin, 0.55), rgba(ACC.linkedin, 0.12))}>{t}</span>
          ))}
        </div>

        <div style={{ ...hairline, margin: "30px 0 24px" }} />

        {/* 技能雲(2→24 的成果) */}
        <div style={{ fontWeight: 500, fontSize: 25, letterSpacing: 3, color: rgba("#ffffff", 0.55), marginBottom: 16 }}>技能 · 24 項</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {SKILL_CHIPS.map((t) => (
            <span key={t} style={chip(rgba("#ffffff", 0.22))}>{t}</span>
          ))}
          <span style={{ ...chip(rgba(ACC.ember, 0.75), rgba(ACC.ember, 0.2)), fontWeight: 700, color: ACC.emberSoft }}>+19</span>
        </div>

        {/* 碑腳 */}
        <div style={{ marginTop: "auto", textAlign: "center", fontWeight: 500, fontSize: 25, letterSpacing: 5, color: rgba("#ffffff", 0.5) }}>
          個資已馬賽克 · 真實過程
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
